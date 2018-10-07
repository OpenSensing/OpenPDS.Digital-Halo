/**
 * Created by mieszko on 17/09/2018.
 */

const priors = {};
priors['probabilities'] = {  //TODO: what should be the corresponding odds *100
	scrapped_us: {
			'age'  : {"25-34": 0.173, "18": 0.181, "55-64": 0.102, "65": 0.052, "18-24": 0.127, "45-54": 0.175, "35-44": 0.193},
			'education'  : {'No_College': 0.447, 'College': 0.408, 'Grad_School': 0.145},
			'gender'   : {'Female': 0.500, 'Male': 0.500},
			'income'  : {'0-50k': 0.512, '50-100k': 0.283, '100-150k': 0.118, '150k': 0.082},
			'kids' : {'Has_Kids': 0.507, 'No_Kids': 0.493},
			'race_US'  : {'Caucasian': 0.762, 'African_American': 0.095, 'Asian': 0.047 , 'Hispanic': 0.096}
		}
};

priors['odds'] = {  //TODO: what should be the corresponding odds *100
	scrapped_us: {
		'age'  : {"25-34": 1, "18": 1, "55-64": 1, "65": 1, "18-24": 1, "45-54": 1, "35-44": 1},
		'education'  : {'No_College': 1, 'College': 1, 'Grad_School': 1},
		'gender'   : {'Female': 1, 'Male': 1},
		'income'  : {'0-50k': 1, '50-100k': 1, '100-150k': 1, '150k': 1},
		'kids' : {'Has_Kids': 1, 'No_Kids': 1},
		'race_US'  : {'Caucasian': 1, 'African_American': 1, 'Asian': 1 , 'Hispanic': 1}
	}
};



const demogroups = {
	scrapped_us: {
		'age'      : ['18', '18-24', '25-34', '35-44', '45-54', '55-64', '65'],
		'education': ['College', 'Grad_School', 'No_College'],
		'gender'   : ['Female', 'Male'],
		'income'   : ['0-50k', '50-100k', '100-150k', '150k'],
		'kids'     : ['Has_Kids', 'No_Kids'],
		'race_US'  : ['Caucasian', 'African_American', 'Asian' , 'Hispanic']
		}
}






module.exports = {
	priors,
	demogroups
}