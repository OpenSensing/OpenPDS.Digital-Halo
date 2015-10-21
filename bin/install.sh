#!/bin/sh
SAFARI_PATH='~/Library/Safari/History.db'

echo 'Installing the dev version of Digital Halo - Cookie Jar'
echo 'Requires: Python 2.6, and Google chrome'
while true; do
	read -p 'Do you whish to import your Safari history
It will require installing a python dependency (with sudo).  y/n' yn
	case $yn in
		[Yy]* ) if [ -f SAFARI_PATH ]; then sudo easy_install biplist; python dropbox safari_parser_v1_1.py; done; python dropbox/safari_history.py; break;;
		[Nn]* ) break;;
	esac
done

python dropbox/copy_model_to_dropbox.py
python dropbox/demographics.py
