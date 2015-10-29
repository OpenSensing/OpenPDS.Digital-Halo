from db_utils import DB_PATH, RECENT_PATH
import os
import sqlite3
import json

def recent_to_sqlite(file_handle):
	content = json.loads(file_handle.read())
	for el in content:
		record = [el.get('sentUrl'), el.get('sentTitle') ,el.get('domain'), str(el.get('thirdPTrackers')), str(el.get('firstPTrackers')), el.get('accessedAt')]
		try: 
			cur.execute('INSERT INTO url VALUES (?,?,?,?,?,?)', record)
		except sqlite3.Error, e:
			print 'error while inserting into url: ', e
		#print el.get('sentTitle', '---- Title Missing ----')
	db.commit()

db  = sqlite3.connect(DB_PATH)
cur = db.cursor()

for subdir, dirs, files  in os.walk(RECENT_PATH):
	for file_name in files:
		file_name = RECENT_PATH + file_name
		with open(file_name, 'r') as f:
			recent_to_sqlite(f)

db.close()






