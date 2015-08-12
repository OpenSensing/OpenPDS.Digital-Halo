from pymongo import MongoClient
from bson import objectid
from logging import log
import sys



# Find topics for whole users browsing history (if sites listed in DMOZ)

##############

def get_new_urls (userId):
    url_cursor = db.url.find({'userID': userId, 'processed': {'$ne' : True}}) 
    obj_ids = []
    #update the fetched elements as processed 
    for d in url_cursor:
	obj_ids.append(d['_id'])
	db.url.update(d,{'$set' : {'processed': True}})

    url_cursor = db.url.find({'_id': {'$in': obj_ids}})
    return url_cursor


def get_topic (cursor, user, method= 'dmoz'):
    for item in cursor:
	if not item.get('url')  : continue
	url = item['url']
	topic = db.dmoz.find_one({'url': url})
        
	if topic: print 'found new topic:'#+ topic['topic']+ '\nfor url:'+ url

	if not topic:
            url = url.split('/')
	    for offset in range(1,len(url)-3+1):
		topic = db.dmoz.find_one({'url': '/'.join(url[:-offset])+'/'})
		if topic: 

		    print 'found new topic:'#+ topic['topic']+ '\nfor url:'+ '/'.join(url[:-offset])
		    
	            break
	
	if topic:
            topic = topic['topic']#.split('/')
	    save_topic(topic, user)
	

def save_topic (topic, user):
    try:
	db.topic.update({'topic': topic, 'userID' : user}, {'$inc' : {'count':1} },  upsert=True)
    except:
        print( "MonogoDB error while upsert : ", sys.exc_info()[0:2])
    return
       

############

mongo_uri, db_name = sys.argv[1:3]
#db = MongoClient('mongodb://localhost:27017')['dummy-pds']
con = MongoClient(mongo_uri)
db  = con[db_name]

for user in db.users.find():	
    get_topic(get_new_urls(userId=user['_id']), user['_id']);

con.close()
