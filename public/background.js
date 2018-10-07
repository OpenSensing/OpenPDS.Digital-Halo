/**
 * Created by mieszko on 30/09/2018.
 */
const MINUTE = 60000

function storePageInfoLocaly(message, sender) {


	var toStore = {
		'sentUrl'        : message.URL,
		'sentTitle'      : message.title,
		'accessedAt'     : message.accessedAt,
		'domain'         : GET(message.URL),
		'thirdPTrackers' : BAD_XDOMAIN_REQUESTS[sender.tab.id], //&& Object.keys(BAD_XDOMAIN_REQUESTS[sender.tab.id]),
		'firstPTrackers' : FISHY_REQUESTS[sender.tab.id]// && Object.keys(FISHY_REQUESTS[sender.tab.id])
	};

	// UPDATE PROFILE
	updateProfile([toStore]);

	/*var currentProfileRaw = deserialize(window.localStorage.getItem('currentProfileRaw'));

	 var updatedProfileRaw = addAllNewVisitsToProfile({profile: currentProfileRaw, visits: [toStore]});
	 window.localStorage.setItem('currentProfileRaw', serialize(updatedProfileRaw));

	 var updatedProfile = normalizeAllProfiles(updatedProfileRaw);
	 window.localStorage.setItem('currentProfile', serialize(updatedProfile));

	 var currentTrackerCounts = deserialize(window.localStorage.getItem('trackerCounts'));
	 var updatedTrackerCounts = trackerCountsFromHistoryWithTrackers(currentTrackerCounts, [toStore]);
	 window.localStorage.setItem('trackerCounts', serialize(updatedTrackerCounts));
	 */

	//alert(JSON.stringify(message)+'\n'+JSON.stringify(BAD_XDOMAIN_REQUESTS[sender.tab.id]))

}

//store loaded page
chrome.runtime.onMessage.addListener(function(message, sender, cb) {
	storePageInfoLocaly(message, sender)
});

// send current browsing and tracking to dropbox



chrome.runtime.onInstalled.addListener(function(details){
	if (details.reason == "install"){
		console.log('first install of Digital Halo Reignited');



		chrome.history.search({text:"", maxResults: 100000, startTime: new Date().getTime() - 1000*3600*24*10 }, res => {

			chrome.storage.local.set({'historyOld': res});
			chrome.storage.local.set({
				'historyOldCrunched': res.map(v => ([GET(v.url), v.visitCount]))
					.reduce((agg, v) => {
						let val = agg[v[0]] || 0;
						agg[v[0]] = val + v[1];
						return agg
					}, {})
			});

			const history = res.map(v => ([GET(v.url), v.visitCount]))
				.reduce((agg, v) => {
					let val = agg[v[0]] || 0;
					agg[v[0]] = val + v[1];
					return agg
				}, {});

			// Read the domain_trackers.json
			const imputedVisits = Object.entries(history).map(([domain, count]) => {
				let thirdPTrackers = DOMAIN_TRACKERS[domain] ? DOMAIN_TRACKERS[domain].thirdPTrackers : null;
				return {domain, thirdPTrackers};
			}).filter(visit=> visit.thirdPTrackers);
			// Merge history with domain_trackers.json
			window.iv = imputedVisits;

			// addAllNewVisitsToProfile
			updateProfile(imputedVisits);

		})



	} else if (details.reason == "update"){
		var thisVersion = chrome.runtime.getManifest().version;
		console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
	}
});


function updateProfile (visits) {
	var currentProfileRaw = deserialize(window.localStorage.getItem('currentProfileRaw'));
	var updatedProfileRaw = addAllNewVisitsToProfile({profile: currentProfileRaw, visits: visits});
	window.localStorage.setItem('currentProfileRaw', serialize(updatedProfileRaw));

	var updatedProfile = normalizeAllProfiles(updatedProfileRaw); 	console.log(updatedProfile);

	window.localStorage.setItem('currentProfile', serialize(updatedProfile));

	var currentTrackerCounts = deserialize(window.localStorage.getItem('trackerCounts'));
	var updatedTrackerCounts = trackerCountsFromHistoryWithTrackers(currentTrackerCounts, visits);
	window.localStorage.setItem('trackerCounts', serialize(updatedTrackerCounts));
}







