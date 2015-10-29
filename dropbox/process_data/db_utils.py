import sqlite3
import os
import json

def getDropboxPath ():
    try:
    	with open (os.environ['HOME'] + '/.dropbox/info.json') as info_file:
    		return json.loads(info_file.read())['personal']['path']
    except IOError:
    	return raw_input('Full path to your root dropbox folder please:\n')

def getAppPath ():
	return getDropboxPath() + '/Apps/openPDS.Digital-Halo/'
ANAL_PATH   = os.path.dirname(os.path.realpath(__file__)) + '/'
REPO_PATH   = os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + '/'
APP_PATH    = getAppPath()
DB_PATH     = APP_PATH + 'raw.db'
RECENT_PATH = APP_PATH + 'currentHistory/'


def open_db ():
	db = sqlite3.connect(DB_PATH) 
	return db, db.cursor()

def clear_db ():
	delete_tabs_queries = ["DROP TABLE domain",
		"DROP TABLE url",
		"DROP TABLE tracker",
		"DROP TABLE otherXDR"]
	
	db  = sqlite3.connect(DB_PATH)
	cur = db.cursor()
	for query in delete_tabs_queries:
		db.execute(query)

	db.commit()
	db.close()
	print 'Deleted the db'