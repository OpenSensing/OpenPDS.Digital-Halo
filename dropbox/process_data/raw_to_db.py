from db_utils import DB_PATH, RECENT_PATH, APP_PATH
import os
import sqlite3
import json

def recent_to_sqlite(file_handle):
	content = json.loads(file_handle.read())
	for el in content:
		# extract features
		url        = el.get('sentUrl')
		title      = el.get('sentTitle')
		domain     = el.get('domain')
		trackers   = el.get('thirdPTrackers')
		if trackers : trackers = str(trackers)
		otherXDRs  = el.get('firstPTrackers')
		if otherXDRs: otherXDRs = str(otherXDRs)
		accessedAt = el.get('accessedAt')

		# URL table 
		url_record = [url, title, domain, trackers, otherXDRs, accessedAt]
		try: 
			cur.execute('INSERT INTO url VALUES (?,?,?,?,?,?)', url_record)
		except sqlite3.Error, e:
			print 'error while inserting into url: ', e
			print url_record

		# DOMAINS table
		insert_query = 'INSERT OR IGNORE INTO domain (name, total, recent) VALUES (?, ?, ?)'
		update_query = 'UPDATE domain SET total=total+1,recent=recent+1 WHERE name="{0}"'.format( domain )
		dom_record = [domain, ]
		try:
			cur.execute(insert_query, (domain, 0, 0))
			cur.execute(update_query)
		except sqlite3.Error, e:
			print 'error while inserting into domain:',domain, e



	db.commit()



db  = sqlite3.connect(DB_PATH)
cur = db.cursor()

for subdir, dirs, files  in os.walk(RECENT_PATH):
	for file_name in files:
		file_name = RECENT_PATH + file_name
		with open(file_name, 'r') as f:
			recent_to_sqlite(f)

db.close()






