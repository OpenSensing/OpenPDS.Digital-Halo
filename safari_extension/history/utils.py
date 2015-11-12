import os
import json

def getDropboxPath (): 
    try:
        with open (os.environ['HOME'] + '/.dropbox/info.json') as info_file:
            dbox_info = json.loads(info_file.read())
            dbox_path = dbox_info.get('personal') 
	    if dbox_path: 
                dbox_path = dbox_path['path']   
	    else:
               dbox_path = dbox_info['business']['path']
		
        return dbox_path
    except IOError:
        return raw_input('Full path to your root dropbox folder please:\n')

def getAppPath (): 
        return getDropboxPath() + '/Apps/openPDS.Digital-Halo/'
APP_PATH  = getAppPath ()
ANAL_PATH = os.path.dirname(os.path.realpath(__file__)) + '/' 
REPO_PATH = os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + '/' 
