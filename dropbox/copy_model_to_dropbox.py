from file_io import APP_PATH, REPO_PATH
import shutil
MODEL_PATH = APP_PATH + 'model/'

try:
	shutil.rmtree(MODEL_PATH)
except OSError, e:
	if e.errno != 2:
		raise

# sys.stdout.write instead of print to avoid newline
shutil.sys.stdout.write('Trying to create the model directory in dropbox app folder. ')
try:	
	#shutil.os.mkdir(MODEL_PATH)
	shutil.copytree(REPO_PATH + 'resources/model', MODEL_PATH)
	print 'Success'
except OSError, e:
	print '\nError while creating the model:', e.errno, e.strerror

###  copy config as well

shutil.sys.stdout.write('Copying the config file : config.json. ')
try:
    shutil.copy(REPO_PATH + 'resources/config.json', APP_PATH)
    print 'Success'
except OSError, e:
    print "\nCan't copy the config file:", e.errno, e.strerror

