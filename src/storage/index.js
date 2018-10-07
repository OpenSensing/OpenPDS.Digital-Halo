/**
 * Created by mieszko on 30/09/2018.
 */
const getProfile = function ({name}) {
	name = name || 'full';

	if (name === 'all') {
		return JSON.parse(window.localStorage.getItem('currentProfile'));
	}

	const allProfiles = JSON.parse(window.localStorage.getItem('currentProfile'));

	let oldProfile = allProfiles[name] || config.priors.odds.scrapped_us;

	return oldProfile
};

const setProfile = function ({name, profile}) {
	if (name === 'all' ) {
		window.localStorage.setItem('currentProfile', JSON.stringify(profile));
		return;
	}

	const allProfiles = JSON.parse(window.localStorage.getItem('currentProfile'));

	allProfiles[name] = profile;

	window.localStorage.setItem('currentProfile', JSON.stringify(allProfiles))
};


module.exports = {
	getProfile,
	setProfile
}