/**
 * Created by mieszko on 26/09/2018.
 */

const config = require('./config');
const {	getProfile, setProfile} = require('../storage');


/*const window = {
	localStorage: {
		getItem: name => name === 'currentProfile' && '{"full": {"kids":1, "stuff":2}}'
	}
}*/
/*
	Make an event callback/interval job which

	1. Read new Visits
	2. Read existing Profile
	3. Feed the Visits & Profile to the Model
	4. Pass the new Profile to storage and frontend
	5. Mark Visits as handled




	AD 1.		let Visits = read from content script / local storage / backend

	AD 2. 		let oldProfile = window.localStorage.getItem('currentProfile', JSON.stringify(trackerCounts));

	AD 3. 		trackedDomainsPerCompanyAndTracker,
 				computeNewProfile,
 				runOnFile} = require('./src/compute/model.js')

 				const newProfile = runAppropriateFunction(oldProfile, Visits, algorithm)

	AD 4,     	window.localStorage.setItem('currentProfile', newProfile);
 				window.localStorage.extendItem('profileHistory.', oldProfile);
 				execute callback - set state /props of the frontend

 	AD 5.	 window.localStorage.setItem('visited', Visits); OR delete them



	Consider: Size and speed of local storage
 */

//  €€€€€€€€€  1  €€€€€€€€€
const readVisits = function ({source}) {
	source = source || 'demo';

	let visits = undefined;
	switch (source) {
		case 'demo':
		default:  //TODO: decide in accordance with the model.js if rich visits (or vist count, tracker info from else)
			//visits = require('../../public/data/history');
			visits = require('../../public/data/historyAndTrackers');
	}

	return visits;
};

//  €€€€€€€€€  2 €€€€€€€€€



console.log(readVisits({}));
//console.log(getProfile({}));
