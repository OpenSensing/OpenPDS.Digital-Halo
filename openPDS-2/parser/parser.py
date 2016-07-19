import sys
import json
from   os import path
import sqlite3
import ast
from copy import deepcopy


data_types = ['domain',
	      'url',
	      'trackers',
              'otherXDRs'
             ]

inouts     = json.loads(sys.argv[1])
files_root = inouts.get('files_root')
dbs_root   = inouts.get('dbs_root')
files	   = inouts.get('files')
dbs        = inouts.get('dbs')

## open dbs
domaindb = sqlite3.connect(path.join(dbs_root, 'Digital-Halo_domain.db'))
urldb    = sqlite3.connect(path.join(dbs_root, 'Digital-Halo_url.db'))
trackerdb    = sqlite3.connect(path.join(dbs_root, 'Digital-Halo_tracker.db'))
otherXDRsdb    = sqlite3.connect(path.join(dbs_root, 'Digital-Halo_otherXDRs.db'))
## get cursors
domaindb_cur = domaindb.cursor()    
urldb_cur = urldb.cursor()    
trackerdb_cur = trackerdb.cursor()    
otherXDRsdb_cur = otherXDRsdb.cursor()    


## prepopulate history
history    = False
if 'history.json' in files:
    history = files.pop(files.index('history.json'))
    history = path.join(files_root, history)

if history:
    with open(history, 'r') as his_fil:
	history = json.loads(his_fil.read())
        
	insert_his_query = 'INSERT OR IGNORE INTO domain (name, total, ancient_count, recent)VALUES(?, ?, ?, ?)'
	domains         = [(dom, count, count, 0) for dom,count in history.iteritems()]        	
        domaindb_cur.executemany(insert_his_query, domains)
        domaindb.commit()

## normal files

def recent_to_sqlite(file_handle):
    content = json.loads(file_handle.read())

    #  el is information about a single page
    for el in content:
        # extract features
        url        = el.get('sentUrl')
        title      = el.get('sentTitle')
        domain     = el.get('domain')
        trackers   = el.get('thirdPTrackers')
        if trackers : 
            trackers_details = deepcopy(trackers)
            trackers = str(trackers.keys())
        otherXDRs  = el.get('firstPTrackers')
        if otherXDRs: 
            otherXDRs_details = deepcopy(otherXDRs)
            otherXDRs = str(otherXDRs.keys())
        accessedAt = el.get('accessedAt')

        # URL table 
        url_record = [url, title, domain, trackers, otherXDRs, accessedAt]
        try: 
            urldb_cur.execute('INSERT INTO url (url, title, domain, trackers, otherXDRs, accessedAt) VALUES (?,?,?,?,?,?)', url_record)
        except sqlite3.Error, e:
            print 'error while inserting into url: ', e
            print url_record

        # DOMAINS table
        domain_insert_query = 'INSERT OR IGNORE INTO domain (name, total, recent) VALUES (?, ?, ?)'
        domain_update_counts_query = 'UPDATE domain SET total=total+1,recent=recent+1 WHERE name="{0}"'.format( domain )
        
        if trackers:
            trackers = set(ast.literal_eval(trackers))
        if otherXDRs:
            otherXDRs = set(ast.literal_eval(otherXDRs))
        
        try:
            domaindb_cur.execute(domain_insert_query, (domain, 0, 0))
            domaindb_cur.execute(domain_update_counts_query)
            if trackers:
                domaindb_cur.execute('SELECT trackers FROM domain WHERE name="{0}"'.format(domain))
                db_trackers = domaindb_cur.fetchone()[0]
                if db_trackers:
                    trackers = set(ast.literal_eval(db_trackers)).union(trackers) 
                domaindb_cur.execute('UPDATE domain SET trackers = "{0}" WHERE name="{1}"'.format(list(trackers), domain)) 
            if otherXDRs:
                domaindb_cur.execute('SELECT otherXDRs FROM domain WHERE name="{0}"'.format(domain))
                db_otherXDRs = domaindb_cur.fetchone()[0]
                if db_otherXDRs:
                    otherXDRs = set(ast.literal_eval(db_otherXDRs)).union(otherXDRs) 
                domaindb_cur.execute('UPDATE domain SET otherXDRs = "{0}" WHERE name="{1}"'.format(list(otherXDRs), domain))         

        except sqlite3.Error, e:
            print 'error while inserting into domain:',domain, e

            print 'UPDATE domain SET trackers = "{0}" WHERE name="{1}"'.format(list(trackers), domain)

        # TRACKERS table
        if trackers:
            for tracker, owner in trackers_details.iteritems():

                owner, ownerUrl   = owner

                ### query definitions
                ## following two lines work as an upsert definition
                track_insert_query = 'INSERT OR IGNORE INTO tracker(name, owner, ownerUrl, timesSeen) VALUES (?, ?, ?, ?)'             
                tracker_update_counts_query = 'UPDATE tracker SET timesSeen=timesSeen+1 WHERE name="{0}"'.format( tracker )            
                ## upsert end

                track_select_query = 'SELECT domains FROM tracker WHERE name="{}"'.format(tracker)
                ### query definitions end

                try:
                    ## perform upsert
                    trackerdb_cur.execute(track_insert_query, (tracker, owner, ownerUrl, 0))
                    trackerdb_cur.execute(tracker_update_counts_query)
                    ## end of upsert
                    trackerdb_cur.execute(track_select_query)
                    tracked_domains = trackerdb_cur.fetchone()[0] 
                    
                    if tracked_domains:
                        tracked_domains = set(ast.literal_eval(tracked_domains))
                        if tracked_domains != tracked_domains.union(set([domain])):
                            trackerdb_cur.execute('UPDATE tracker SET domains="{}" WHERE name="{}"'.format(list(tracked_domains.union(set([domain]))), tracker))
                    else:
                        trackerdb_cur.execute('UPDATE tracker SET domains="{}" WHERE name="{}"'.format([domain], tracker))
        
                except sqlite3.Error, e:
                    print 'error while inserting into trackers tracker {1} for domain {0}'.format(domain, tracker), e
    domaindb.commit()
    urldb.commit()
    trackerdb.commit()
    otherXDRsdb.commit()


for filename in files:
    filename = path.join(files_root, filename)
    with open (filename) as fil:
        recent_to_sqlite(fil)

domaindb.close()
urldb.close()
trackerdb.close()
otherXDRsdb.close()
