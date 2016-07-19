from db_utils import APP_PATH
import os
import sqlite3
import json

DB_PATH = APP_PATH + 'raw.db'

history_file_name = 'history.json'

def load_history(file_name):
	file_name = APP_PATH + file_name
	with open(file_name, 'r') as history_file:
		history_dict = json.loads(history_file.read())

		db  = sqlite3.connect(DB_PATH)
		cur = db.cursor()

		insert_query    = 'INSERT INTO domain (name, total, ancient_count, recent)VALUES(?, ?, ?, ?)'
		domains         = [(dom, count, count, 0) for dom,count in history_dict.iteritems()]
		cur.executemany(insert_query, domains)
		db.commit()	

	db.close()