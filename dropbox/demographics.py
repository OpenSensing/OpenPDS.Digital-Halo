import file_io
from browsing_history import browsing_history
import decimal
from decimal import Decimal
import operator
import time

age_priors  = {"25_34": 0.173, "18": 0.181, "55_64": 0.102, "65": 0.052, "18_24": 0.127, "45_54": 0.175, "35_44": 0.193}
edu_priors  = {'No_College': 0.447, 'College': 0.408, 'Grad_School': 0.145}
kids_priors = {'Has_Kids': 0.507, 'No_Kids': 0.493}
inc_priors  = {'0-50k': 0.512, '50-100k': 0.283, '100-150k': 0.118, '150k': 0.082}
etn_priors  = {'Caucasian': 0.762, 'African_American': 0.095, 'Asian': 0.047 , 'Hispanic': 0.096}

decimal.getcontext().prec = 3

weights  = file_io.weights
female_weights  = file_io.weights['gender']['Female']
male_weights    = file_io.weights['gender']['Male']
age_weights     = file_io.weights['age']

def count_score (data, model, prior = 0.5):
	score = [Decimal(prior), 0]
	for d, count in data.iteritems():
		if d in model and model[d] > 105:
			           #from index to odds ration
			score[0] *= Decimal(model[d] / 100.0) ** count
			score[1] += count
	return score

######### 

### gender
male_score   = count_score(browsing_history, male_weights)
female_score = count_score(browsing_history, female_weights)
if male_score[0] > female_score[0]:
    gender = 'Male'
else:
    gender = 'Female'

### age
age_scores = {}
for age_group in age_weights:
	age_scores[age_group] = count_score(browsing_history, age_weights[age_group])
flat_age = [(l,v[0]) for l,v in age_scores.iteritems()]
age = max(flat_age, key = operator.itemgetter(1))

### edu
edu_scores = {}
for edu_group in weights['education']:
	edu_scores[edu_group] = count_score(browsing_history, weights['education'][edu_group])
flat_edu = [(l,v[0]) for l,v in edu_scores.iteritems()]
edu      = max(flat_edu, key= operator.itemgetter(1))

### kids
kids_scores = {}
for kids_group in weights['kids']:
	kids_scores[kids_group] = count_score(browsing_history, weights['kids'][kids_group])
flat_kids = [(l,v[0]) for l,v in kids_scores.iteritems()]
kids = max(flat_kids, key = operator.itemgetter(1))

### income
inc_scores = {}
for inc_group in weights['income']:
	inc_scores[inc_group] = count_score(browsing_history, weights['income'][inc_group])
flat_inc = [(l,v[0]) for l,v in inc_scores.iteritems()]
inc      = max(flat_inc, key= operator.itemgetter(1))

### ethnicity
eth_scores = {}
for eth_group in weights['race_US']:
	eth_scores[eth_group] = count_score(browsing_history, weights['race_US'][eth_group])
flat_eth = [(l,v[0]) for l,v in eth_scores.iteritems()]
eth      = max(flat_eth, key= operator.itemgetter(1))

####### save

file_io.saveToDropbox({
	'gender'   : gender,
	'age'      : age[0],
	'education': edu[0],
	'race'     : eth[0],
	'income'   : inc[0],
	'kids'     : kids[0],
	'createdAt': int(time.time()*1000)
}, 'test_res.json')

