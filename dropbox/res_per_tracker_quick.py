from file_io import APP_PATH
import sqlite3
import ast
import json

DB_PATH  		  = APP_PATH + 'raw.db'
RES_PATH          = APP_PATH + 'res_per_tracker.json'
RES_DETAILS_PATH =  APP_PATH + 'res_per_tracker_details.json'

db  = sqlite3.connect(DB_PATH)
cur = db.cursor()



	#print tracker, len(domains), domains[-1]


	############ STOLEN FROM DEMOGRAPHICS
import pdb 


import file_io
import decimal
from decimal import Decimal
import operator
import time
from copy import deepcopy

age_priors  = {"25_34": 0.173, "18": 0.181, "55_64": 0.102, "65": 0.052, "18_24": 0.127, "45_54": 0.175, "35_44": 0.193}
edu_priors  = {'No_College': 0.447, 'College': 0.408, 'Grad_School': 0.145}
kids_priors = {'Has_Kids': 0.507, 'No_Kids': 0.493}
inc_priors  = {'0-50k': 0.512, '50-100k': 0.283, '100-150k': 0.118, '150k': 0.082}
etn_priors  = {'Caucasian': 0.762, 'African_American': 0.095, 'Asian': 0.047 , 'Hispanic': 0.096}

decimal.getcontext().prec = 3

file_io.populateModels()
weights  = file_io.weights
female_weights  = file_io.weights['gender']['Female']
male_weights    = file_io.weights['gender']['Male']
age_weights     = file_io.weights['age']

def count_score (data, model, prior = 0.5):
	score = [Decimal(prior), 0]
	for d, count in data.iteritems():
		if d in model and model[d] > 100:#105:
			           #from index to odds ration
			score[0] *= Decimal(model[d] / 100.0) ** count
			score[1] += count
	score[0] = float(score[0])
	return score

######### 


### age
age_per_tracker = {}
age_score_per_tracker = {}
eth_per_tracker = {}
eth_score_per_tracker = {}
gender_per_tracker = {}
gender_score_per_tracker = {}
edu_per_tracker = {}
edu_score_per_tracker = {}
inc_per_tracker = {}
inc_score_per_tracker = {}
kids_per_tracker = {}
kids_score_per_tracker = {}

select_trackers_query = 'SELECT * FROM tracker'

cur.execute(select_trackers_query)
for tracker, domains, x in cur.fetchall():
	if domains: domains = ast.literal_eval(domains)
	
	select_tracked = 'SELECT name, total FROM domain WHERE name in ({seq})'.format(
		seq=','.join(['?']*len(domains)))
	cur.execute(select_tracked, domains)
	browsing_history = {}
	for name, total in cur.fetchall():
		 browsing_history[name] = total
	# sTOLEN FROM DEMOGRAPHICS

	## AGE
	age_scores = {}
	for age_group in age_weights:
		age_scores[age_group] = count_score(browsing_history, age_weights[age_group], age_priors[age_group])
	age_score_per_tracker[tracker] = deepcopy(age_scores)
	flat_age = [(l,v[0]) for l,v in age_scores.iteritems() if v[1] > 0]
	if flat_age:
		age = max(flat_age, key = operator.itemgetter(1))
		age_per_tracker[tracker] = age[0]
	else:
		age_per_tracker[tracker] = None
	## ETH
	eth_scores = {}
	for eth_group in weights['race_US']:
		eth_scores[eth_group] = count_score(browsing_history, weights['race_US'][eth_group], etn_priors[eth_group])
	eth_score_per_tracker[tracker] = deepcopy(eth_scores)
	flat_eth = [(l,v[0]) for l,v in eth_scores.iteritems() if v[1] > 0]
	if flat_eth:
		eth = max(flat_eth, key = operator.itemgetter(1))
		eth_per_tracker[tracker] = eth[0]
	else:
		eth_per_tracker[tracker] = None
	## GENDER
	male_score   = count_score(browsing_history, male_weights)
	female_score = count_score(browsing_history, female_weights)
	gender_score_per_tracker[tracker] = {'Male': male_score, 'Female': female_score}
	if male_score[1] or female_score[1]:
		if male_score[0] > female_score[0]:
		    gender = 'Male'
		else:
		    gender = 'Female'
		gender_per_tracker[tracker] = gender
	## EDU
	edu_scores = {}
	for edu_group in weights['education']:
		edu_scores[edu_group] = count_score(browsing_history, weights['education'][edu_group], edu_priors[edu_group])
	edu_score_per_tracker[tracker] = deepcopy(edu_scores)
	flat_edu = [(l,v[0]) for l,v in edu_scores.iteritems() if v[1] > 0]
	if flat_edu:
		edu = max(flat_edu, key = operator.itemgetter(1))
		edu_per_tracker[tracker] = edu[0]
	else:
		edu_per_tracker[tracker] = None
	## INC
	inc_scores = {}
	for inc_group in weights['income']:
		inc_scores[inc_group] = count_score(browsing_history, weights['income'][inc_group], inc_priors[inc_group])
	inc_score_per_tracker[tracker] = deepcopy(inc_scores)
	flat_inc = [(l,v[0]) for l,v in inc_scores.iteritems() if v[1] > 0]
	if flat_inc:
		inc = max(flat_inc, key = operator.itemgetter(1))
		inc_per_tracker[tracker] = inc[0]
	else:
		inc_per_tracker[tracker] = None
	## KIDS
	kids_scores = {}
	for kids_group in weights['kids']:
		kids_scores[kids_group] = count_score(browsing_history, weights['kids'][kids_group], kids_priors[kids_group])
	
	
	#if tracker == 'google-analytics.com':pdb.set_trace()

	kids_score_per_tracker[tracker] = deepcopy(kids_scores)
	flat_kids = [(l,v[0]) for l,v in kids_scores.iteritems() if v[1] > 0]
	if flat_kids:
		kids = max(flat_kids, key = operator.itemgetter(1))
		kids_per_tracker[tracker] = kids[0]
	else:
		kids_per_tracker[tracker] = None
	## 

####
res = {}
res_details =  {}
cur.execute('SELECT name FROM tracker')
for tr in cur.fetchall():
	tr = tr[0]
	res[tr] = {}
	res_details[tr] = {}
	
	res[tr]['age'] = age_per_tracker.get(tr)
	res_details[tr]['age'] = age_score_per_tracker.get(tr)
	res[tr]['eth'] = eth_per_tracker.get(tr)
	res_details[tr]['eth'] = eth_score_per_tracker.get(tr)
	res[tr]['gender'] = gender_per_tracker.get(tr)
	res_details[tr]['gender'] = gender_score_per_tracker.get(tr)
	res[tr]['edu'] = edu_per_tracker.get(tr)
	res_details[tr]['edu'] = edu_score_per_tracker.get(tr)
	res[tr]['inc'] = inc_per_tracker.get(tr)
	res_details[tr]['inc'] = inc_score_per_tracker.get(tr)
	res[tr]['kids'] = kids_per_tracker.get(tr)
	res_details[tr]['kids'] = kids_score_per_tracker.get(tr)

####

with open (RES_PATH, 'w') as res_file:
	json.dump(res, res_file)
with open (RES_DETAILS_PATH, 'w') as res_file:
	json.dump(res_details, res_file)

