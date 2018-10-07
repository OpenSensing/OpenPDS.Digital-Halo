/**
 * Created by mpio on 03/04/2017.
 */
const copy = require('deepcopy');
const empty = require('../utils.js').object.empty;
const MODEL = require('../../public/scrapped_us');
//import '../../public/scrapped_us';
const config = require('./config');
//const priors = config.priors.probabilities.scrapped_us;
const PRIORS = config.priors.odds.scrapped_us;

const demogroups = config.demogroups.scrapped_us;
/* model
// {
//		'stackexchange.com': {
// 			'18': [ 89, 0.16 ],
//			'65': [ 31, 0.02 ],
//			'25-34': [ 139, 0.24 ],
//			'0-50k': [ 96, 0.49 ],
//			No_Kids: [ 93, 0.47 ],
//			'100-150k': [ 107, 0.13 ],
//			Inactive: [ 109, 0.31 ],
//			...
//	    }
//		'yelp.com': {
// 			'18': [],
//			..
// 		}
//
// }
*/

// const trackerCounts = localForage.get('trackerCounts');  TODO: user local forage
const history      = require('../../public/data/history');
// history -  { 'bitbucket.com': 78, 'google.dk': 1000}
const hisWTrackers = require('../../public/data/historyAndTrackers');  //visit, + who's seen it
/* hisWTrackers -
// [
// 		{   accessedAt: 1447076915693,
//			domain: 'dropbox.com',
//			sentTitle: 'Dropbox API v2 launches today | Dropbox Developer Blog',
//			sentUrl: 'https://blogs.dropbox.com/developers/2015/11/dropbox-api-v2-launches-today/',
//			thirdPTrackers:
//				{ 'addthis.com': [ 'AddThis', 'http://www.addthis.com/' ],
//				'facebook.net': [ 'Facebook', 'http://www.facebook.com/' ],
//				'google-analytics.com': [ 'Google', 'http://www.google.com/' ],
//				'twitter.com': [ 'Twitter', 'https://twitter.com/' ] }
//       }
//	]
*/

const findDomainInModel = ({domain, model}) => model[domain] || {};


//TODO: save snapshots of profile in time
function addVisitToProfile({domainModel, priors }) {

	if (!priors || empty(priors) ) priors = copy(PRIORS);
	const posteriors = {};
		/*
		 "probability aggregate " some kind of normalization
		1. "simple odds ratio product" which is model val[0] / 100
		 */
		/*console.log('add VisitToProfile')
		console.log(`domainModel ${JSON.stringify(domainModel)}`)
		console.log(`priors ${JSON.stringify(priors)}`)
		*/

	//console.log(`addVisitToProfile after: ${priors}`)

	Object.entries(priors).forEach(([gr_name, gr_cats]) => {
		const new_cats = {};
		posteriors[gr_name] = new_cats;
		Object.entries(gr_cats).forEach(([cat_name, cat_val]) => {

			new_cats[cat_name] = cat_val * ((domainModel[cat_name] && domainModel[cat_name][0] / 100) || 1)
		})
	});

	return posteriors
}

function trackersFromVisit ({visit}) {
	const trackers = [], companies = [];

	visit.thirdPTrackers && Object.entries(visit.thirdPTrackers).forEach(([tracker, company]) => {
		trackers.push(tracker);
		companies.push(company[0]);
	});

	return {companies, trackers};
}


// TODO: add step returning trackers per visit
// TODO: AD above: use rich visits instead of history OR create a database of trackers per domain

function addAllNewVisitsToProfile ({profile, visits, model}) {
	if (!profile || empty(profile) ) profile = {};
	model = model || MODEL;


	visits.forEach(visit => {
		const {domain} = visit;
		let domainModel = findDomainInModel({domain, model});

		const {trackers, companies} = trackersFromVisit({visit});

		profile['full'] =  addVisitToProfile({domainModel, priors: profile['full']});
		trackers.concat(companies).forEach( trck => {
			profile[trck] = addVisitToProfile({domainModel, priors: profile[trck]})
		});

/*
//		{   accessedAt: 1447076915693,
//			domain: 'dropbox.com',
//			sentTitle: 'Dropbox API v2 launches today | Dropbox Developer Blog',
//			sentUrl: 'https://blogs.dropbox.com/developers/2015/11/dropbox-api-v2-launches-today/',
//			thirdPTrackers:
//				{ 'addthis.com': [ 'AddThis', 'http://www.addthis.com/' ],
//				'facebook.net': [ 'Facebook', 'http://www.facebook.com/' ],
//				'google-analytics.com': [ 'Google', 'http://www.google.com/' ],
//				'twitter.com': [ 'Twitter', 'https://twitter.com/' ] }
//       }
		//let domainModel = findDomainInModel({domain, model});
		//profile = addVisitToProfile({domainModel, priors: profile});*/
	});

	return profile;
}


//  FOR OUTPUT

function normalizeGroup (group) {
	const total = Object.values(group).reduce((agg, val) => typeof val === 'number' && agg + val, 0);
	const normalized = {};
	Object.entries(group).forEach(([catN, val]) => typeof val ==='number' ? normalized[catN] = val / total :
																		  normalized[catN] = 'NA');

	return normalized;
}

function normalizeProfile (profile) {
	const normalized = {};
	//console.log(profile)
	Object.entries(profile).forEach(([gr_name, group]) => {
		normalized[gr_name] = normalizeGroup(group);
	});

	return normalized;
}

function normalizeAllProfiles (allProfiles) {
	const normalized = {};
	Object.entries(allProfiles).forEach(([tracker, profile]) => {
		normalized[tracker] = normalizeProfile(profile);
	})
	return normalized;
}

function computeNewProfile ({visits}) {

	//const profile = addAllNewVisitsToProfile({visits, model});
	const profile = addAllNewVisitsToProfile({visits});
	return normalizeAllProfiles(profile);
	//return normalizeProfile(profile);
}

function runOnFile () {
	return computeNewProfile({visits: hisWTrackers})
}

function trackerCountsFromHistoryWithTrackers (historyWithTrackers) {  //  cookie Viz feed
	const trackerCounts = [];      //  Who's seen how much , via which trackers   - 
	/*{ count: 11453,
	//	name: 'Google',
	//	children:
	//	[ { count: 6708, name: 'google-analytics.com' },
	//		{ count: 1254, name: 'doubleclick.net' }
	//  ]
	//}
	*/

	historyWithTrackers.forEach((visit)=>{
	
		const domain    = visit.domain;
		const trackers  = visit.thirdPTrackers;
		//console.log(domain, trackers && Object.keys(trackers));
	
		trackers && Object.entries(trackers).forEach(entry=>{
			const name   = entry[1][0];
			const domain = entry[0];
	
			let tc = trackerCounts.find(t=>t.name === name);
			if (!tc) {
				tc = {name: name, count:0, children: []};
				trackerCounts.push(tc)
			}

			tc.count += 1;
			let tc_domain = tc.children.find(c=>c.name ===domain);
			if (!tc_domain) {
				tc_domain = {name: domain, count: 0};
				tc.children.push(tc_domain);
			}
			tc_domain.count += 1
	
		});
	});
	
	return trackerCounts;

}

function trackedDomainsPerCompanyAndTracker (historyWithTrackers){     // who's tracking where, how much they've seen
    /* gets all domains tracked per tracker
    // also keeps number of visits to each domain
	//  {
	// 		'analytics.yahoo.com': { 'dropbox.com': 23, 'yelp.com': 1 },
	//      'bizographics.com': { 'dropbox.com': 23, 'yelp.com': 1 }
	//  }
	*/

    const res = {
        trackers: {},
        companies: {}
    };

    historyWithTrackers.forEach(visit=>{
        const {domain, thirdPTrackers} = visit;

        thirdPTrackers && Object.keys(thirdPTrackers).forEach(trackerName=>{
            if (!res.trackers[trackerName]) res.trackers[trackerName] = {};
            if (!res.trackers[trackerName][domain]) res.trackers[trackerName][domain] = 0;

            res.trackers[trackerName][domain] += 1;

            const companyName  = thirdPTrackers[trackerName][0],
                companyAddress = thirdPTrackers[trackerName][1];

            if (!res.companies[companyName]) res.companies[companyName] = {};
            if (!res.companies[companyName][domain]) res.companies[companyName][domain] = 0;

            res.companies[companyName][domain] += 1;

        });
    });

    return res;
}



module.exports = {
	trackerCountsFromHistoryWithTrackers,
	trackedDomainsPerCompanyAndTracker,
	computeNewProfile,
	runOnFile,
	trackersFromVisit
};
