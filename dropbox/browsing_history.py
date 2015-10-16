import json
from file_io import getAppPath

choice = raw_input('Please chose your history file!\nchose 1 for history.json\nchose 2 for safari_history.json')
if choice == '1':
	file_name = 'history.json'
elif choice == '2':
	file_name = 'safari_history.json'
browsing_history = {}
with open (getAppPath() + file_name) as his:
	browsing_history = json.loads(his.read())

