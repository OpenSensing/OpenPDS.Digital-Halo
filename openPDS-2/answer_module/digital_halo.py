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



inouts              = json.loads(sys.argv[1])
dbs                 = inouts.get('dbs')
results_folder      = inouts.get('results')
model_file_name     = 'scrapped_us.json'
model_path          = path.join(results_folder, 'model', model_file_name)

RES_PATH            = path.join(results_folder, 'res_per_tracker.json')
RES_DETAILS_PATH    = path.join(results_folder, 'res_per_tracker_details.json')
TRACKER_COUNTS_PATH = path.join(results_folder, 'tracker_counts.json')



DEMOGROUPS = {
    'age'      : ('18', '18-24', '25-34', '35-44', '45-54', '55-64', '65'),
    'education': ('College', 'Grad_School', 'No_College'),
    'gender'   : ('Female', 'Male'),
    'income'   : ('0-50k', '50-100k', '100-150k', '150k'),
    'kids'     : ('Has_Kids', 'No_Kids'),
    'race_US'  : ('Caucasian', 'African_American', 'Asian' , 'Hispanic')
}

priors = {
    'age'  : {"25_34": 0.173, "18": 0.181, "55_64": 0.102, "65": 0.052, "18_24": 0.127, "45_54": 0.175, "35_44": 0.193},
    'edu'  : {'No_College': 0.447, 'College': 0.408, 'Grad_School': 0.145},
    'kids' : {'Has_Kids': 0.507, 'No_Kids': 0.493},
    'inc'  : {'0-50k': 0.512, '50-100k': 0.283, '100-150k': 0.118, '150k': 0.082},
    'etn'  : {'Caucasian': 0.762, 'African_American': 0.095, 'Asian': 0.047 , 'Hispanic': 0.096}
}


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

def average_probability(categories_group):
    '''takes categories group as input to keep consistent with normalize_products()'''
    for category, sum_and_count in categories_group.iteritems():
        try:
            sum_of_probs, count = sum_and_count
            categories_group[category] = sum_of_probs/count
        except ValueError:   # missing data
            categories_group[category] = 'NA'
        
        
def count_score (data):
    '''
    ins: data - dictionary containing domain names as keys and number of visits as values
    outs: results - dictionary with category_groups -> categories -> [product of probs, normalized 'probability'] 
    ''' 
    #initialize results dict
    results = {}
    for gr_name, cat_labels in DEMOGROUPS.iteritems():
        results[gr_name] = {cat: [] for cat in cat_labels}
    
    # flag for any data in the demographic model for the given browsing history data
    any_data_in_model = False
    for domain, count in data.iteritems():
        if domain not in model: 
            continue
        else:
            domain = model[domain]
            any_data_in_model = True
            
        for cat_gr, cats in results.iteritems():

            for cat in cats.keys():
                
                if cat in domain:
                    
                    vals = domain[cat]
                    if cats[cat]:   # some data for the category already exists
                        cats[cat][0] += vals[1] * count
                        cats[cat][1] += count
                        
                    else:           # no data for the cat so initalize it 
                        cats[cat].append(vals[1] * count)
                        cats[cat].append(count)
    #normalize to percentage like values and convert Decimal to float
    if any_data_in_model:
        for group in results.values():
            average_probability(group)
            #for cat_name, vals in group.iteritems():
            #   if type(vals) == list:
            #        vals[0] = float(vals[0])
            #    if type(vals) == Decimal:
            #        group[cat_name] = float(vals)
    else:
        results = 'NA'
    
    return results

## extract simple results

def get_top_categories(detailed_results):
    results = deepcopy(detailed_results)
    for tracker_name, val in results.iteritems():
        if val == 'NA':
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
                


##### Function for tracker counts 

def get_tracking_company_details (company_name):
    details = {
        'name'    : company_name,
        'count'   : 0,
        'children': []
    }

    all_company_trackers_query = 'SELECT name, timesSeen FROM tracker where owner="{0}"'.format( company_name )
    trackerdb_cur.execute(all_company_trackers_query)
    
    for tracker, tracker_count in trackerdb_cur.fetchall():
        details['count'] += tracker_count
        details['children'].append({'name':tracker, 'count':tracker_count})

    return details

def get_all_tracking_companies_details ():
    all_details = []

    company_names_query = 'SELECT DISTINCT owner FROM tracker'
    trackerdb_cur.execute(company_names_query)
    
    for company_name in trackerdb_cur.fetchall():
        company_name = company_name[0]   #fetchall returns a tuple for every record

        all_details.append(get_tracking_company_details(company_name))

    all_details.sort(key = lambda x: x['count'], reverse = True)
    for company in all_details:
        company['children'].sort(key = lambda x: x['count'], reverse = True)

    return all_details

                    
######### 





## open dbs
for dbpath in dbs:
    if path.split(dbpath)[1] == 'Digital-Halo_domain.db':
        domaindb     = sqlite3.connect(dbpath)
    elif path.split(dbpath)[1] == 'Digital-Halo_tracker.db':
        trackerdb    = sqlite3.connect(dbpath)
## check if correct DB file names have been passed by checking if dbs connections have been crated
## errors while trying to open are going to raise exceptions in the loop above 
try: 
    domaindb
except NameError:
    raise ValueError('"Digital-Halo_domain.db" path missing ')
try: 
    trackerdb
except NameError:
    raise ValueError('"Digital-Halo_domain.db" path missing ')

## get cursors
domaindb_cur  = domaindb.cursor()    
trackerdb_cur = trackerdb.cursor()    

#### model work
model  = loadModel(model_path)


##################################### CALCULATE RESULTS
## calculate total results
results = {}


## pull all visited pay-level domains with visit counts and store it in a dictionary
total_browsing_history = {}
select_whole_history = 'SELECT name, total FROM domain'
domaindb_cur.execute(select_whole_history)
for name, total in domaindb_cur.fetchall():
    total_browsing_history[name] = total

## calculate demographic stats from full browsing history
results['total']     = count_score(total_browsing_history) 

## pull all trackers with pay level domains tracked by each of the trackers
select_trackers_query = 'SELECT name, domains FROM tracker'
trackerdb_cur.execute(select_trackers_query)

for tracker, domains in trackerdb_cur.fetchall():
    '''for each tracker fetch all visits to tracked domains'''
    domains = ast.literal_eval(domains)
    
    select_tracked = 'SELECT name, total FROM domain WHERE name in ({seq})'.format(
        seq=','.join(['?']*len(domains)))
    domaindb_cur.execute(select_tracked, domains)
    tracked_history = {}
    for name, total_count in domaindb_cur.fetchall():
        tracked_history[name] = total_count
    # done loading relveant (tracked) history
    
    ## calculate scores
    if tracked_history:
        results[tracker] = count_score(tracked_history)
    else:
        results[tracker] = 'Not Tracked'


        
        
## extract top category for each group
simple_results = get_top_categories(results)

## get number of occurances of each tracker and aggregate them over owning companies
tracker_and_company_counts = get_all_tracking_companies_details()

################################################  Save results

with open (RES_PATH, 'w') as res_file:
    json.dump(simple_results, res_file)
with open (RES_DETAILS_PATH, 'w') as res_det_file:
    json.dump(results, res_det_file)
with open (TRACKER_COUNTS_PATH, 'w') as tr_counts_file:
    json.dump(tracker_and_company_counts, tr_counts_file)