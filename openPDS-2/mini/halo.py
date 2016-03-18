#!/usr/bin/python
import os
from os import path
import sys
import sqlite3
from time import time
import json
import subprocess


if len(sys.argv) > 1 and sys.argv[1] == '--dev':
	dev = True
else:
	dev = False
dev = True

#### PATHS
paths = {
	'this'   : path.dirname(path.realpath(__file__)),
	'db'     : path.join(path.dirname(path.realpath(__file__)), 'data'),
	'app'    : '',
	'history': ''
}


if dev:
	paths['parser']  = path.abspath(path.join(paths['this'], '../parser'))
	paths['am']      = path.abspath(path.join(paths['this'], '../answer_module'))
	paths['results'] = path.join(paths['this'], 'results')
	if not path.exists(paths['results']):
		os.mkdir(paths['results'], 0755)
else:
	paths['parser'] = path.join(paths['this'], 'parser')
	paths['am']     = path.join(paths['this'], 'answer_module')


#### Config #############################
### Create state DB and table  

confdb    = sqlite3.connect(path.join(paths['this'], 'config.db'))
confdb_cur = confdb.cursor()


## create execution_details table if necessary

create_config_table_query = "CREATE TABLE IF NOT EXISTS execution_details (last_file_name TEXT, last_file_number INT, epochtime timestamp DEFAULT (strftime ('%s', 'now')))"
confdb_cur.execute(create_config_table_query)
confdb.commit()


###  Get the last processed last_file_number

get_last_processed_file_query = 'SELECT last_file_name, last_file_number FROM execution_details WHERE epochtime = (SELECT max(epochtime) FROM execution_details)'
confdb_cur.execute(get_last_processed_file_query)
last_file_details             = confdb_cur.fetchall()

if last_file_details:
	last_file_details = last_file_details[0]   # get rid of the enclosing array
	process_history   = False
else:
	last_file_details = (None, -1)
	process_history   = True


### Open processed data DBs (create them if not existing)

paths['db'] = path.join(paths['this'], 'data')
if not path.exists(paths['db']):
	os.mkdir(paths['db'], 0755)

dbs = {
	'domain'    : sqlite3.connect(path.join(paths['db'], 'Digital-Halo_domain.db')),
	'url'       : sqlite3.connect(path.join(paths['db'], 'Digital-Halo_url.db')),
	'tracker'   : sqlite3.connect(path.join(paths['db'], 'Digital-Halo_tracker.db')),
	'otherXDRs' : sqlite3.connect(path.join(paths['db'], 'Digital-Halo_otherXDRs.db')),
}
## get cursors
cursors = {
	'domain'    : dbs['domain'].cursor(),    
	'url'       : dbs['url'].cursor(),    
	'tracker'   : dbs['tracker'].cursor(),    
	'otherXDRs' : dbs['otherXDRs'].cursor()    
}
## create db queries

# read parser manifest file with dbs schema

with open (path.join(paths['parser'], 'manifest.json')) as manifest_file:
    manifest = json.load(manifest_file)
    data_types = manifest['dataTypes']

for dt in data_types:
    name = dt['name']
    schema = ', '.join([field[0]+' '+field[1] for field in dt['schema'].iteritems()])
    create_db_query = 'CREATE TABLE IF NOT EXISTS {name} ({schema})'.format(name = name, schema = schema)
    cursors[name].execute(create_db_query)
    dbs[name].commit()




##### Config End ########################


### dropbox path

def get_dropbox_path ():
	relative_app_path = path.join('Apps', 'openPDS.Digital-Halo')

	try:
		with open (os.environ['HOME'] + '/.dropbox/info.json') as info_file:
			info = json.loads(info_file.read())
			try:
				dropbox_path = info['personal']['path'] 
			except KeyError:
				dropbox_path = info['business']['path']
			
			return path.join(dropbox_path, relative_app_path)

	except IOError:
		dropbox_path = raw_input('Full path to your root dropbox folder please:\n')

		return path.join(dropbox_path, relative_app_path)


paths['app']     = get_dropbox_path()
paths['results'] = get_dropbox_path()


### all filenames with counter greater then in last_file_details

paths['history'] = path.join(paths['app'], 'currentHistory')

def is_new_history_file_factory(start_count):
	
	def is_new_history_file(filename):
		if filename.startswith('currentHistoryAndTrackers'):
			if path.isfile(path.join(paths['history'], filename)):
				return int(filename.replace('currentHistoryAndTrackers', '').replace('.json', '')) > start_count
		return False

	return is_new_history_file

is_new_history = is_new_history_file_factory(last_file_details[1])


history_file_names = filter(is_new_history, os.listdir(paths['history']))
if process_history:
	history_file_names.append('history.json')

##########################  CALL PARSER and AM
### call parser

parser      = path.join(paths['parser'], 'parser.py')

parser_args = {
	'files_root': paths['history'], 
	'files'     : history_file_names,
	'dbs_root'  : paths['db'],
	'dbs'       : ['Digital-Halo_domain.db', 'Digital-Halo_tracker.db', 'Digital-Halo_url.db', 'Digital-Halo_otherXDRs.db']
}
subprocess.call(['python', parser, json.dumps(parser_args)])

### update config with last processed file
if history_file_names:

	if process_history:
		history_file_names.remove('history.json')
	last_file         = sorted(history_file_names, key = lambda x: int(x.replace('currentHistoryAndTrackers', '').replace('.json', '')))[-1]
	last_file_no      = int(last_file.replace('currentHistoryAndTrackers', '').replace('.json', ''))
	last_file_details = (last_file, last_file_no)

	insert_config_db_query = 'INSERT INTO execution_details (last_file_name , last_file_number) VALUES( ?, ? )'
	confdb_cur.execute(insert_config_db_query, last_file_details)
	confdb.commit()


### call AM

answer_module = path.join(paths['am'], 'digital_halo.py')

am_args       = {
	'results': paths['results'], 
    'dbs'    : [path.join(paths['db'], 'Digital-Halo_domain.db'),
                path.join(paths['db'], 'Digital-Halo_tracker.db')]

}

subprocess.call(['python', answer_module, json.dumps(am_args)])








