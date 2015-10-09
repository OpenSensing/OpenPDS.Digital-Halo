import file_io
from browsing_history import browsing_history
import decimal
from decimal import Decimal
import operator

age_priors = {"25_34": 0.173, "18": 0.181, "55_64": 0.102, "65": 0.052, "18_24": 0.127, "45_54": 0.175, "35_44": 0.193}

decimal.getcontext().prec = 3


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

male_score   = count_score(browsing_history, male_weights)
female_score = count_score(browsing_history, female_weights)


age_scores = {}
for age_group in age_weights:
	age_scores[age_group] = count_score(browsing_history, age_weights[age_group])


##

flat_age = [(l,v[0]) for l,v in age_scores.iteritems()]
age = max(flat_age, key = operator.itemgetter(1))

if male_score[0] > female_score[0]:
    gender = 'Male'
else:
    gender = 'Female'

print 'gender:', gender
print 'age:   ', age[0]

