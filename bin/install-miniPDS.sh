#!/bin/sh
REPO=https://raw.githubusercontent.com/OpenSensing/OpenPDS.Digital-Halo/fix2-PDS_ersatz/openPDS-2

PDSPATH=${HOME}/miniPDS
mkdir ${PDSPATH}
mkdir ${PDSPATH}/parser
mkdir ${PDSPATH}/answer_module


#################### TODO  ##########
# copy parser, the AM and any other needed stuff


curl ${REPO}/mini/halo.py --output ${PDSPATH}/halo.py
chmod 755 ${PDSPATH}/halo.py

curl ${REPO}/parser/parser.py --output ${PDSPATH}/parser/parser.py
curl ${REPO}/answer_module/digital_halo.py --output ${PDSPATH}/answer_module/digital_halo.py

curl ${REPO}/parser/manifest.json --output ${PDSPATH}/parser/manifest.json
curl ${REPO}/answer_module/manifest.json --output ${PDSPATH}/answer_module/manifest.json


#################### TODO  ##########
# edit the native messaging host and copy it to 
# relevant chrome/chromium dir
curl ${REPO}/chrome_native_messaging/dk.dtu.openpds.json --output dk.dtu.openpds.json
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

###### initial run of the analysis

${PDSPATH}/halo.py