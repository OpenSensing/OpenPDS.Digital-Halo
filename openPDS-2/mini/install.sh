#!/bin/sh

PDSPATH=${HOME}/miniPDS
mkdir ${PDSPATH}

cp halo.py ${PDSPATH}
chmod 755 ${PDSPATH}/halo.py
#################### TODO  ##########
# copy parser, the AM and any other needed stuff



#################### TODO  ##########
# edit the native messaging host and copy it to 
# relevant chrome/chromium dir



###### initial run of the analysis

${PDSPATH}/halo.py