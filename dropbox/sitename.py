import json
from urlparse import urlparse

with open ('tlds.json', 'r') as tlds_file:
	tlds = json.loads(tlds_file.read())

def sitename (url):
	url         = urlparse(url)
	if url.scheme not in ('http', 'https', 'ftp'): return None
	
	domain      = url.hostname
	labels      = domain.split('.')
	label_count = len(labels) -1

	try: # if domain is an IP address
		float(labels[label_count])
	except ValueError:
		domain = '.'.join(labels[-2:])
		for i in range (label_count, 1, -1):
			if tlds.get('.'.join(labels[-i:])):
				domain = '.'.join(labels[-i-1:])

	return domain


		 	
