from file_io import APP_PATH
import sqlite3
import json


DB_PATH = APP_PATH + 'raw.db'

def create_tables():
	print 'Initializatin of sqlite db: ',
	try:
		create_tabs_queries = ["CREATE TABLE domain(name TEXT UNIQUE, total INT, recent INT, ancient_count INT, trackers TEXT, otherXDRs TEXT)",
			"CREATE TABLE url(url TEXT, title TEXT, domain TEXT, trackers TEXT, otherXDRs TEXT, accessedAt INT)",
			"CREATE TABLE tracker(name TEXT UNIQUE, domains TEXT, trackID INT)",
			"CREATE TABLE otherXDR(name TEXT UNIQUE, domains TEXT, xdrID INT)"]

		db  = sqlite3.connect(DB_PATH)
		cur = db.cursor()
		for query in create_tabs_queries: 
			db.execute(query)

		db.commit()
		db.close()

		print 'Success'
	except sqlite3.Error, e:
		print "Error %s:" % e.args[0]


create_tables()
