from file_io import APP_PATH, ANAL_PATH
import shutil
MODEL_PATH = APP_PATH + 'model/'

shutil.os.mkdir(MODEL_PATH)

shutil.copytree(ANAL_PATH + 'analytics/model', MODEL_PATH)
