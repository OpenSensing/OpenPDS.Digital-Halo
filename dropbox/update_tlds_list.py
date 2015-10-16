import requests
import json

tlds_url = 'https://mxr.mozilla.org/mozilla-central/source/netwerk/dns/effective_tld_names.dat?raw=1'

with open ('tldPatch.json', 'r') as tldPatch:
	tld_patch = json.loads(tldPatch.read())


tlds_request = requests.get(tlds_url)

if tlds_request.status_code == 200:
	raw_tlds = tlds_request.text
	for line in d.splitlines():
		if line and line[0:2] != '//':
			if line[0] == '*' or line[0] == '!':
				line = line[1:]
			if line[0] == '.':
				line = line[1:]

			tlds[line] = True

