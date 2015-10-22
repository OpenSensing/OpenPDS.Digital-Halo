#!/bin/sh
SAFARI_PATH=${HOME}'/Library/Safari/History.db'
DROPBOX_PATH=${HOME}'/Dropbox/Apps/OpenPDS.Digital-Halo'

echo 'Installing the dev version of Digital Halo - Cookie Jar'
echo 'Requires: Python 2.6, and Google chrome'
while true; do
	read -p 'Do you whish to import your Safari history
It will require installing a python dependency (with sudo).  y/n' yn
	case $yn in
		[Yy]* ) if ! [ -f $SAFARI_PATH ]; then sudo easy_install biplist; fi; python dropbox/safari_history.py; break;;
		[Nn]* ) break;;
	esac
done

python dropbox/copy_model_to_dropbox.py
python dropbox/demographics.py
