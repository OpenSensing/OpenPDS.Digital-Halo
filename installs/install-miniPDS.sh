#!/bin/sh
REPO=https://raw.githubusercontent.com/OpenSensing/OpenPDS.Digital-Halo/dev
#REPO=https://raw.githubusercontent.com/OpenSensing/OpenPDS.Digital-Halo/feat8-extension_install




PDSPATH=${HOME}/miniPDS
mkdir ${PDSPATH}
mkdir ${PDSPATH}/parser
mkdir ${PDSPATH}/answer_module



##############################
# copy parser, the AM and any other needed stuff


curl ${REPO}/openPDS-2/mini/halo.py --output ${PDSPATH}/halo.py
chmod 755 ${PDSPATH}/halo.py

curl ${REPO}/openPDS-2/parser/parser.py --output ${PDSPATH}/parser/parser.py
curl ${REPO}/openPDS-2/answer_module/digital_halo.py --output ${PDSPATH}/answer_module/digital_halo.py

curl ${REPO}/openPDS-2/parser/manifest.json --output ${PDSPATH}/parser/manifest.json
curl ${REPO}/openPDS-2/answer_module/manifest.json --output ${PDSPATH}/answer_module/manifest.json


#################### TODO  ##########
# edit the native messaging host and copy it to 
# relevant chrome/chromium dir
curl ${REPO}/openPDS-2/chrome_native_messaging/dk.dtu.openpds.json --output dk.dtu.openpds.json
# update the messaging host config with path to the pds executable
perl -si -pe 's/LOCALPDSPATH/$pdsPath/' -- -pdsPath=${PDSPATH} dk.dtu.openpds.json
#copy the file to the chrome/chromium messaging hosts folder

if [ "$(uname -s)" == "Darwin" ]; then
  if [ "$(whoami)" == "root" ]; then
    MESSAGE_HOST_DIR="/Library/Google/Chrome/NativeMessagingHosts"
  else
    MESSAGE_HOST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
  fi
else
  if [ "$(whoami)" == "root" ]; then
    MESSAGE_HOST_DIR="/etc/opt/chrome/native-messaging-hosts"
  else
    MESSAGE_HOST_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
  fi
fi

cp dk.dtu.openpds.json "${MESSAGE_HOST_DIR}"
chmod 644 "${MESSAGE_HOST_DIR}/dk.dtu.openpds.json"
rm -f dk.dtu.openpds.json

########## copy model files
DBOXPATH=`cat ${HOME}/.dropbox/info.json| python -c 'import json,sys;obj=json.load(sys.stdin);z=obj["pesonal"] if obj.get("personal") else obj.get("business"); print z["path"];'`
DBOXPATH=${DBOXPATH}/Apps/openPDS.Digital-Halo

curl ${REPO}/resources/scrapped_uk.json --output ${DBOXPATH}/model/scrapped_uk.json
curl ${REPO}/resources/scrapped_us.json --output ${DBOXPATH}/model/scrapped_us.json



###### initial run of the analysis

${PDSPATH}/halo.py