import sys
import json
from os import path
import sqlite3
import ast
import decimal
from decimal import Decimal
import operator
import time
from copy import deepcopy



inouts     = json.loads(sys.argv[1])
dbs        = inouts.get('dbs')
results    = inouts.get('results')
RES_PATH   = path.join(results, 'res_per_tracker.json')
RES_DETAILS_PATH  =  path.join(results, 'res_per_tracker_details.json')
model_file = 'scrapped_us.json'

## open dbs
for dbpath in dbs:
    if path.split(dbpath)[1] == 'Digital-Halo_domain.db':
        domaindb     = sqlite3.connect(dbpath)
    elif path.split(dbpath)[1] == 'Digital-Halo_tracker.db':
        trackerdb    = sqlite3.connect(dbpath)

## get cursors
domaindb_cur  = domaindb.cursor()    
trackerdb_cur = trackerdb.cursor()    

#### model work

demogroups = {
    'age'      : ('18', '18_24', '25_34', '35_44', '45_54', '55_64', '65'),
    'education': ('College', 'Grad_School', 'No_College'),
    'gender'   : ('Female', 'Male'),
    'income'   : ('0-50k', '50-100k', '100-150k', '150k'),
    'kids'     : ('Has_Kids', 'No_Kids'),
    'race_US'  : ('Caucasian', 'African_American', 'Asian' , 'Hispanic')
}

age_priors  = {"25_34": 0.173, "18": 0.181, "55_64": 0.102, "65": 0.052, "18_24": 0.127, "45_54": 0.175, "35_44": 0.193}
edu_priors  = {'No_College': 0.447, 'College': 0.408, 'Grad_School': 0.145}
kids_priors = {'Has_Kids': 0.507, 'No_Kids': 0.493}
inc_priors  = {'0-50k': 0.512, '50-100k': 0.283, '100-150k': 0.118, '150k': 0.082}
etn_priors  = {'Caucasian': 0.762, 'African_American': 0.095, 'Asian': 0.047 , 'Hispanic': 0.096}



## model functions

def loadModel (model_file):
    
    with open(model_file,'r') as data_fh:
        model_dic = json.load(data_fh)
        
    return model_dic

##### count the scores
def normalize_products(categories_group):
    total = sum(categories_group.values())
    if total: 
        for category, product in categories_group.iteritems():
            categories_group[category] = [product, float(product/total)]
   
        
def count_score (data):
    '''
    ins: data - dictionary containing domain names as keys and number of visits as values
    outs: results - dictionary with category_groups -> categories -> [product of probs, normalized 'probability'] 
    ''' 
    #initiate results dict
    results = {}
    for gr_name, cat_labels in demogroups.iteritems():
        results[gr_name] = {cat: Decimal(0) for cat in cat_labels}
    
    #
    any_data_in_model = False
    for domain, count in data.iteritems():
        if domain not in model: continue

        any_data_in_model = True
            
        domain = model[domain]
        for cat_gr, cats in results.iteritems():

            for cat in cats.keys():
                if cat in domain: 
                    vals = domain[cat]
                    if cats[cat]:
                        cats[cat] *= Decimal(vals[1]) ** count
                    else:
                        cats[cat]  = Decimal(vals[1]) ** count
    
    #normalize to percentage like values and convert Decimal to float
    if any_data_in_model:
        for group in results.values():
            normalize_products(group)
            for cat_name, vals in group.iteritems():
                if type(vals) == list:
                    vals[0] = float(vals[0])
                if type(vals) == Decimal:
                    group[cat_name] = float(vals)
    else:
        results = 'No data available in model'
    
    return results

## extract simple results

def get_top_categories(detailed_results):
    results = deepcopy(detailed_results)
    for tracker_name, val in results.iteritems():
        if val == 'No data available in model':
            results[tracker_name] = 'NA'
        else:
            cat_groups = val
            for group_name, cats in cat_groups.iteritems():
                
                try:
                    top_cat = max(cats.keys(), key= lambda cat_name: cats[cat_name][1])
                    results[tracker_name][group_name] = (top_cat, cats[top_cat][1])
                except TypeError:
                    results[tracker_name][group_name] = 'NA'
    
    return results
                
                    
######### 

model_path = path.join(results, 'model', model_file)
model      = loadModel(model_path)


results = {}
## calculate total results


select_whole_history = 'SELECT name, total FROM domain'
total_browsing_history = {}
domaindb_cur.execute(select_whole_history)
for name, total in domaindb_cur.fetchall():
    total_browsing_history[name] = total
results['total']     = count_score(total_browsing_history) 

## calculate results per tracker
select_trackers_query = 'SELECT name, domains FROM tracker'
trackerdb_cur.execute(select_trackers_query)
for tracker, domains in trackerdb_cur.fetchall():
    '''for each tracker fetch all visits to tracked domains'''
    
    if domains: domains = ast.literal_eval(domains)

    select_tracked = 'SELECT name, total FROM domain WHERE name in ({seq})'.format(
        seq=','.join(['?']*len(domains)))
    domaindb_cur.execute(select_tracked, domains)
    browsing_history = {}
    for name, total in domaindb_cur.fetchall():
        browsing_history[name] = total
    # done loading relveant (tracked) history
    
    ## calculate scores
    if browsing_history:
        results[tracker] = count_score(browsing_history)
    else:
        results[tracker] = 'Not Tracked'

## extract top category for each group
simple_results = get_top_categories(results)



####

with open (RES_PATH, 'w') as res_file:
    json.dump(simple_results, res_file)
with open (RES_DETAILS_PATH, 'w') as res_det_file:
    json.dump(results, res_det_file)