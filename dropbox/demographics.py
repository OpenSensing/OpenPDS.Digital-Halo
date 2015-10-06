history       = {}
gender_model  = {}
total_visits  = 0
gender_score  = 0 
def score_to_gender (score):
	# hypotesis test with alpha = 0.95 
	return true

def count_total_score (data, model):
	for d,count in data:
		if d in gender_model:
			total_visits += count
	        gender_score += gender_model[d]*count
	return gender_score

#normalize
gender_score = gender_score / total_visits
gender = score_to_gender(gender_score/total_visits)
