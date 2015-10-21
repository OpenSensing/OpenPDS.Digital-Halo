from file_io import APP_PATH, REPO_PATH
import shutil
MODEL_PATH = APP_PATH + 'model/'

try:
	shutil.rmtree(MODEL_PATH)
except OSError, e:
	if e.errno != 2:
		raise

print 'Trying to create the model directory in dropbox app folder'
try:	
	#shutil.os.mkdir(MODEL_PATH)
	shutil.copytree(REPO_PATH + 'analytics/model', MODEL_PATH)
	print 'Success'
except OSError, e:
	print 'Error while creating the model:', e.errno, e.strerror

