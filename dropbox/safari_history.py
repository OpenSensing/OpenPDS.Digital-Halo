from file_io import APP_PATH
import os
from shutil import copyfile
import sqlite3
import json
from collections import defaultdict

from sitename import sitename

######  copy the history file to DBox
SAFARI_PATH = os.environ['HOME'] + '/Library/Safari'
copyfile(SAFARI_PATH + '/History.db', APP_PATH + 'safari_history.db')
###### convert sqlite into json 
con = sqlite3.connect(APP_PATH + 'safari_history.db')
cursor = con.cursor()

all_history_query = 'SELECT url, visit_count FROM history_items'
cursor.execute(all_history_query)

raw_history = {his_item[0]: his_item[1] for his_item in cursor.fetchall()}
# Save to DBOX
#with open (APP_PATH + 'raw_safari_history.json', 'w') as raw_json:
#    json.dump(raw_history, raw_json)

###### extract unique sitenames from raw urls, count them and save to DBox
clean_history = defaultdict(int)
for item, count in raw_history.iteritems():
	site = sitename(item)
	if site:
		clean_history[site] += int(count)

with open (APP_PATH + 'safari_history.json', 'w') as history_file:
	json.dump(clean_history, history_file)

