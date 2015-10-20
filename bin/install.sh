#!/bin/sh
echo 'Installing the dev version of Digital Halo - Cookie Jar'
echo 'Requires: Python 2.6, and Google chrome'
while true; do
	read -p 'Do you whish to import your Safari history' yn
	case $yn in
		[Yy]* ) python dropbox/safari_history.py; break;;
		[Nn]* ) break;;
	esac
done

python dropbox/demographics.py