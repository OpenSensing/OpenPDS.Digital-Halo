from file_io import APP_PATH, REPO_PATH
import shutil
MODEL_PATH = APP_PATH + 'model/'

shutil.os.mkdir(MODEL_PATH)

shutil.copytree(REPO_PATH + 'analytics/model', MODEL_PATH)
