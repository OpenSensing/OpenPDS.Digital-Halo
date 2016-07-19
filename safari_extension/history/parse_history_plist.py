import os
import sqlite3
import biplist
from utils import APP_PATH

#
SAFARI_PATH = os.environ['HOME'] + '/Library/Safari/'
HISTORY_PLIST_FILE = SAFARI_PATH + 'History.plist'

#  dbwork
def db_work() :
	outfile = sqlite3.connect(APP_PATH + 'safari_history.db')
	create_table_query = 'CREATE TABLE history_items(url TEXT, visit_count INT)'
	outfile.execute(create_table_query) 

	return outfile
# parse plist
def history_plist_work ():
	if not os.path.isfile(HISTORY_PLIST_FILE): return False

	db = db_work()
	cursor = db.cursor()
	history_plist = biplist.readPlist(HISTORY_PLIST_FILE)
	for key,value in history_plist.iteritems():
		if key == 'WebHistoryDates':
			for history_item in value:
				url         = history_item['']
				title       = history_item.get('title')
				visit_count = history_item.get('visitCount')

				insert_history_query = 'INSERT INTO history_items VALUES(?, ?)'
				cursor.execute(insert_history_query, (url, visit_count))
	db.commit()	
	db.close()
	return True

