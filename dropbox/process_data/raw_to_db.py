from db_utils import DB_PATH, RECENT_PATH, APP_PATH
import os
import sqlite3
import json
import ast

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
		update_counts_query = 'UPDATE domain SET total=total+1,recent=recent+1 WHERE name="{0}"'.format( domain )
		
		if trackers:
			trackers = set(ast.literal_eval(trackers))
		if otherXDRs:
			otherXDRs = set(ast.literal_eval(otherXDRs))
		
		try:
			cur.execute(insert_query, (domain, 0, 0))
			cur.execute(update_counts_query)
			if trackers:
				cur.execute('SELECT trackers FROM domain WHERE name="{0}"'.format(domain))
				db_trackers = cur.fetchone()[0]
				if db_trackers:
					trackers = set(ast.literal_eval(db_trackers)).union(trackers) 
				cur.execute('UPDATE domain SET trackers = "{0}" WHERE name="{1}"'.format(list(trackers), domain)) 
			if otherXDRs:
				cur.execute('SELECT otherXDRs FROM domain WHERE name="{0}"'.format(domain))
				db_otherXDRs = cur.fetchone()[0]
				if db_otherXDRs:
					otherXDRs = set(ast.literal_eval(db_otherXDRs)).union(otherXDRs) 
				cur.execute('UPDATE domain SET otherXDRs = "{0}" WHERE name="{1}"'.format(list(otherXDRs), domain)) 		

		except sqlite3.Error, e:
			print 'error while inserting into domain:',domain, e

			print 'UPDATE domain SET trackers = "{0}" WHERE name="{1}"'.format(list(trackers), domain)



	db.commit()



db  = sqlite3.connect(DB_PATH)
cur = db.cursor()

for subdir, dirs, files  in os.walk(RECENT_PATH):
	for file_name in files:
		file_name = RECENT_PATH + file_name
		with open(file_name, 'r') as f:
			recent_to_sqlite(f)

db.close()






