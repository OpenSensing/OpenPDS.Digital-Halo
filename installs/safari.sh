SAFARI_DB_PATH=${HOME}'/Library/Safari/History.db'
SAFARI_PLIST_PATH=${HOME}'/Library/Safari/History.plist'

while true; do
        read -p 'Do you whish to import your Safari history y/n' yn

        case $yn in
                [Yy]* ) if ! [ -f $SAFARI_DB_PATH ]; then 
				if [ -f $SAFARI_PLIST_PATH ]; then
					echo 'You seem to have the old version of the os. This means that to import your history we will need to install a python package (using sudo)';
					read -p 'Do yo want to install that package (will require your password for sudo)' yn2

						case $yn2 in
							[Yy]* ) sudo easy_install biplist;; 
							[Nn]* ) break;;
						esac
				else
					echo You do not have any Safari history on your harddrive;
					break;
				fi;
			fi; 
			python safari_extension/history/safari_history.py; 
			break;;
                [Nn]* ) break;;
        esac
done

