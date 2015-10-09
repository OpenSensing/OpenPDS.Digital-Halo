import csv
import json
import os

weights = {}

# demogroups
# feed the groups from a file
demogroups = {
	'age'      : ('18', '18_24', '25_34', '35_44', '45_54', '55_64', '65'),
	'education': ('College', 'Grad_School', 'No_College'),
	'gender'   : ('Female', 'Male'),
	'income'   : ('0-50k', '50-100k', '100-150k', '150k'),
	'kids'     : ('Has_Kids', 'No_Kids'),
	'race_US'  : ('African_American', 'Asian', 'Caucasian', 'Hispanic')
}

# helper

def getDropboxPath ():
    try:
    	with open (os.environ['HOME'] + '/.dropbox/info.json') as info_file:
    		return json.loads(info_file.read())['personal']['path']
    except IOError:
    	return raw_input('Full path to your root dropbox folder please:\n')

def getAppPath ():
	return getDropboxPath() + '/Apps/openPDS.Digital-Halo/'


def loadModel (model_file):
	model_dic = {}
	with open(model_file,'r') as data_file:
		reader = csv.reader(data_file, delimiter = '\t')
		for line in reader:
			if len(line) == 2: model_dic[line[1]] = int(line[0])

	return model_dic

# populate

def populateModels () :
	app_path =  getAppPath()

	for category, bins in demogroups.iteritems():
		weights[category] = {}
		mod = weights[category]

		for bin in bins:
			mod[bin] = loadModel(app_path + '/quantcast/' + bin + '.txt-goog.txt')


# action

populateModels()

