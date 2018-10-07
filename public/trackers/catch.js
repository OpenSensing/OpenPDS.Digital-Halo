
/*
  The script is a customization of Disconnect's background.js script
  to be used as a part of Digital Halo.

  Copyright 2010-2014 

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Mieszko Manijak <mieszkomieszko@gmail.com>

  Based on work of:

    Brian Kennish <byoogle@gmail.com> Disconnect, Inc.
*/

/* Populates an array of a given length with a default value. */
function initializeArray(length, defaultValue) {
  const ARRAY = [];
  for (var i = 0; i < length; i++) ARRAY[i] = defaultValue;
  return ARRAY;
}

/* Toggles the search preferences. */

/* Check Disconnect for a new notification */

/* Rewrites a generic cookie with specific domains and paths. */
function mapCookie(cookie, storeId, url, domain, subdomains, paths) {
  const MINIMIZE = Math.min;
  const SUBDOMAIN_COUNT = MINIMIZE(subdomains.length, 20);
      // Chrome won't persist more than 22 domains because of cookie limits.
  delete cookie.hostOnly;
  delete cookie.session;
  const DOMAIN = cookie.domain;

  for (var i = 0; i < SUBDOMAIN_COUNT; i++) {
    var subdomain = subdomains[i];
    cookie.url = url.replace('www', subdomain).replace('search', subdomain);
    cookie.domain = subdomain + domain;
    COOKIES.set(cookie);
  }

  const PATH_COUNT = MINIMIZE(paths.length, 10);
      // Chrome won't persist more than 11 paths.
  cookie.domain = DOMAIN;

  for (i = 0; i < PATH_COUNT; i++) {
    var path = paths[i];
    cookie.url = url + path;
    cookie.path = '/' + path;
    COOKIES.set(cookie);
  }

  COOKIES.remove({url: url, name: cookie.name, storeId: storeId});
}

/* Rewrites a batch of generic cookies with specific domains and paths. */
function mapCookies(url, service) {
  COOKIES.getAllCookieStores(function(cookieStores) {
    const STORE_COUNT = cookieStores.length;
    const DOMAIN = '.' + service[1][0];
    const SUBDOMAINS = service[2];
    const PATHS = service[3];

    for (var i = 0; i < STORE_COUNT; i++) {
      var storeId = cookieStores[i].id;

      COOKIES.getAll({url: url, storeId: storeId}, function(cookies) {
        const COOKIE_COUNT = cookies.length;
        for (var j = 0; j < COOKIE_COUNT; j++)
            mapCookie(cookies[j], storeId, url, DOMAIN, SUBDOMAINS, PATHS);
      });
    }
  });
}

/* Erases a batch of cookies. */
function deleteCookies(url, domain, path, storeId, name) {
  const DETAILS = {url: url, storeId: storeId};
  if (name) DETAILS.name = name;

  COOKIES.getAll(DETAILS, function(cookies) {
    const COOKIE_COUNT = cookies.length;

    for (var i = 0; i < COOKIE_COUNT; i++) {
      var cookie = cookies[i];
      if (cookie.domain == domain && cookie.path == path)
          COOKIES.remove(
            {url: url, name: name || cookie.name, storeId: storeId}
          );
    }
  });
}

/* Rewrites a batch of specific cookies with a generic domain and path. */
function reduceCookies(url, service, name) {
  COOKIES.getAllCookieStores(function(cookieStores) {
    const STORE_COUNT = cookieStores.length;
    const SUBDOMAINS = service[2];
    const SUBDOMAIN_COUNT = SUBDOMAINS.length;
    const DOMAIN = '.' + service[1][0];
    const PATHS = service[3];
    const PATH_COUNT = PATHS.length;

    for (var i = 0; i < STORE_COUNT; i++) {
      var storeId = cookieStores[i].id;

      for (var j = 0; j < SUBDOMAIN_COUNT; j++) {
        var subdomain = SUBDOMAINS[j];
        var mappedUrl =
            url.replace('www', subdomain).replace('search', subdomain);

        if (!name && !j) {
          COOKIES.getAll({url: mappedUrl, storeId: storeId}, function(cookies) {
            const COOKIE_COUNT = cookies.length;

            for (var i = 0; i < COOKIE_COUNT; i++) {
              var details = cookies[i];
              details.url = url;
              details.domain = DOMAIN;
              delete details.hostOnly;
              delete details.session;

              setTimeout(function(details) {
                COOKIES.set(details);
              }.bind(null, details), 1000);
            }
          });
        }

        deleteCookies(mappedUrl, '.' + subdomain + DOMAIN, '/', storeId, name);
      }

      for (j = 0; j < PATH_COUNT; j++) {
        var path = PATHS[j];
        deleteCookies(url + path, DOMAIN, '/' + path, storeId, name);
      }
    }
  });
}


/* Tallies the number of tracking requests. */
function getCount(tabRequests) {
  var count = 0;

  for (var categoryName in tabRequests) {
    var category = tabRequests[categoryName];
    for (var serviceName in category) count += category[serviceName].count;
  }

  return count;
}

/* Creates an HTML5 Growl notification. */

/* Indicates the number of tracking requests. */

/* Indicates the number of tracking requests, if the tab is rendered. */

/* Tallies and indicates the number of tracking requests. */


/* MY VARIABLES  ##################################################################*/
const BAD_XDOMAIN_REQUESTS = {}
const FISHY_REQUESTS = {}

/* Checks to see if the user has paid. */

if (SAFARI)
    for (var key in localStorage) {
      options[key] = localStorage[key];
      delete localStorage[key];
    }

/* The current build number. */
const CURRENT_BUILD = 78;

/* The previous build number. */
const PREVIOUS_BUILD = options.build;

/* The domain name of the tabs. */
const DOMAINS = {};

/* The blacklisted services per domain name. */
const BLACKLIST = deserialize(options.blacklist) || {};

/* The previous requested URL of the tabs. */
const REQUESTS = {};

/* The previous redirected URL of the tabs. */
const REDIRECTS = {};

/* The number of tracking requests per tab, overall and by third party. */
const REQUEST_COUNTS = {};

/* The number of total, blocked, and secured requests per tab. */
const DASHBOARD = {};

/* The Collusion data structure. */
const LOG = {};

/* The content key. */
const CONTENT_NAME = 'Content';

/* The list value. */
const LIST_NAME = 'list';

/* The graph value. */
const GRAPH_NAME = 'graph';

/* The legacy value. */
const LEGACY_NAME = 'legacy';

/* The "extension" API. */
const EXTENSION = chrome.extension;

/* The "tabs" API. */
const TABS = chrome.tabs;

/* The "privacy" API. */
//if (false) const PRIVACY = chrome.privacy.services;

/* The "cookies" API. */
const COOKIES = chrome.cookies;

/* The "browserAction" API. */
const BROWSER_ACTION = chrome.browserAction;

/* The "instantEnabled" property. */
//if (false) const INSTANT_ENABLED = PRIVACY.instantEnabled;

/* The "searchSuggestEnabled" property. */
//if (false) const SUGGEST_ENABLED = PRIVACY.searchSuggestEnabled;

/* The experimental value of the "levelOfControl" property. */
const EDITABLE = 'controllable_by_this_extension';

/* The domain object. */
const SITENAME = new Sitename;

/* The domain initialization. */
const IS_INITIALIZED = SITENAME.isInitialized;

/* The domain getter. */
const GET = SITENAME.get;

/* The Shadow Web. */
const PLAYBACK = [];

/* The path to the Chrome directory. */
//const PATH = SAFARI ? 'opera/chrome/' : OPERA ? 'chrome/' : '';
const PATH = 'trackers/'

/* The pixel width and height of the toolbar icon. */
const SIZE = SAFARI ? 32 : 19;

/* The whitelisted services per domain name. */
var whitelist = deserialize(options.whitelist) || {};

/* Today. */
var date = new Date();
var month = date.getMonth() + 1;
month = (month < 10 ? '0' : '') + month;
var day = date.getDate();
day = (day < 10 ? '0' : '') + day;
date = date.getFullYear() + '-' + month + '-' + day;

/* T-0. */
var startTime;

/*  D2 config
if (!PREVIOUS_BUILD) options.blockingIndicated = true;
if (!PREVIOUS_BUILD || PREVIOUS_BUILD < 26) options.blogOpened = true;

if (!PREVIOUS_BUILD || PREVIOUS_BUILD < 31) {
  delete options.settingsEditable;
  options.browsingHardened = true;
}



if (!PREVIOUS_BUILD || PREVIOUS_BUILD < 43) {
  const MIGRATED_WHITELIST = {};

  for (var domain in whitelist) {
    var siteWhitelist =
        (MIGRATED_WHITELIST[domain] = {}).Disconnect =
            {whitelisted: false, services: {}};
    for (var service in whitelist[domain])
        siteWhitelist.services[service] = true;
  }

  options.displayMode = LEGACY_NAME;

  if (PREVIOUS_BUILD || options.initialized) options.pwyw = JSON.stringify({});
  else {
    options.pwyw = JSON.stringify({date: date, bucket: 'viewed'});
    options.displayMode = LIST_NAME;
    options.installDate = moment();
    var partner = false;
    if (SAFARI) {
      safari.application.browserWindows.forEach(function(windowObject) {
        windowObject.tabs.forEach(function(tab) {
          var url = tab.url;
          if (url && url.indexOf('disconnect.me/disconnect/partner') + 1) {
            partner = url.substr(url.lastIndexOf('/') + 1);
            options.referrer = partner;
          }
        });
      });
      if (partner) {
        options.pwyw = JSON.stringify({date: date, bucket: 'viewed-cream'});
        TABS.create({url: 'https://disconnect.me/d2/partner/' + partner});
      }
      else {
        options.pwyw = JSON.stringify({date: date, bucket: 'viewed'});
        TABS.create({url: 'https://disconnect.me/disconnect/welcome'});
      }
    }
    else TABS.query({url: "*://*.disconnect.me/*"}, function(disconnectTabs) {
      disconnectTabs.forEach(function(tab) {
        url = tab.url;
        if (tab.url.indexOf('partner') + 1) {
          partner = url.substr(url.lastIndexOf('/') + 1);
          options.referrer = partner;
        }
      });

      
      
      if (navigator.userAgent.indexOf('WhiteHat Aviator') + 1) {
        options.pwyw = JSON.stringify({date: date, bucket: 'trying'});
      }
      else if (partner) {
        options.pwyw = JSON.stringify({date: date, bucket: 'viewed-cream'});
        TABS.create({url: 'https://disconnect.me/d2/partner/' + partner});
      }
      else if (CURRENT_BUILD > 71) {
        options.pwyw = JSON.stringify({date: date, bucket: 'viewed-cream'});
        TABS.create({url: 'https://disconnect.me/welcome/paysomething'});
      }
      else {
        options.pwyw = JSON.stringify({date: date, bucket: 'viewed'});
        TABS.create({url: 'https://disconnect.me/disconnect/welcome'});
      }
    

    });
  }

  options.whitelist = JSON.stringify(whitelist = MIGRATED_WHITELIST);
  options.blacklist = JSON.stringify(BLACKLIST);
  options.updateClosed = true;
  options.sitesHidden = true;
}
*/
/*   D2 UI - images

try {
  if (!deserialize(options.pwyw).date) {
    downgradeServices(true);
    BROWSER_ACTION.setIcon({path: PATH + 'images/legacy/' + SIZE + '.png'});

    $.getJSON('https://goldenticket.disconnect.me/existing', function(data) {
      if (data.goldenticket === 'true') {
        options.displayMode = LIST_NAME;
        options.pwyw = JSON.stringify({date: date, bucket: 'pending'});
        downgradeServices();
        BROWSER_ACTION.setIcon({path: PATH + 'images/' + SIZE + '.png'});
        BROWSER_ACTION.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
        BROWSER_ACTION.setBadgeText({text: 'NEW!'});
        BROWSER_ACTION.setPopup({popup: ''});
      }
    });
  } else if (deserialize(options.pwyw).bucket == 'postponed') {
    options.displayMode = LEGACY_NAME;
    downgradeServices(true);
    BROWSER_ACTION.setIcon({path: PATH + 'images/legacy/' + SIZE + '.png'});
  } else {
    const PWYW = deserialize(options.pwyw);
    if (PWYW.bucket == 'later')
        options.pwyw = JSON.stringify({date: PWYW.date, bucket: 'trying'});
            // "later" was accidentally live for a bit.
    BROWSER_ACTION.setIcon({path: PATH + 'images/' + SIZE + '.png'});
  }
}
catch (e) {
  console.log(e);
  if (!(options.pwyw)) {
    options.pwyw = JSON.stringify({date: date, bucket: 'viewed'});
  }
}
*/


/* Prepopulates the store of tab domain names. */
const ID = setInterval(function() {
  if (IS_INITIALIZED()) {
    clearInterval(ID);
    const TLDS = deserialize(options.tlds);
    TLDS['google.com'] = true;
    TLDS['yahoo.com'] = true;
    options.tlds = JSON.stringify(TLDS);

    TABS.query({}, function(tabs) {
      const TAB_COUNT = tabs.length;

      for (var i = 0; i < TAB_COUNT; i++) {
        var tab = tabs[i];
        DOMAINS[tab.id] = GET(tab.url);
      }
    });
  }
}, 100);

/* Tests the writability of the search preferences. */

/* Traps and selectively cancels or redirects a request. */
chrome.webRequest.onBeforeRequest.addListener(function(details) {
  const TAB_ID = details.tabId;
  const TYPE = details.type;
  const PARENT = TYPE == 'main_frame';
  const REQUESTED_URL = details.url;
  const CHILD_DOMAIN = GET(REQUESTED_URL);                                        /* get CNAME, GET = sitename.get*/

  if (PARENT) {                                                                   /* if main frame - first request in the tab*/
    DOMAINS[TAB_ID] = CHILD_DOMAIN;                                               // remembers the CNAME domain of the page
    if (!startTime) startTime = new Date();   
  }

  const CHILD_SERVICE = getService(CHILD_DOMAIN);                                 /* getServices - defined in services.js
                                                                                    object {category: "Disconnect|Advertising|etc" 
                                                                                           , name: "Google|Microsoft|etc"      - owner
                                                                                           , url: "http://www.google.com|etc"  - owners www
                                                                                            }          */
  const PARENT_DOMAIN = DOMAINS[TAB_ID];
  var hardenedUrl;
  var hardened;
  var blockingResponse = {cancel: false};
  var whitelisted;
  var blockedCount;

  //-----------------------  COUNT AND DISPLAY WORK

  const TAB_DASHBOARD =
      DASHBOARD[TAB_ID] ||
          (DASHBOARD[TAB_ID] = {total: 0, blocked: 0, secured: 0});
  const TOTAL_COUNT = ++TAB_DASHBOARD.total;
  const POPUP =
      options.displayMode != LEGACY_NAME &&
          EXTENSION.getViews({type: 'popup'})[0];

  //-----------------------  END OF: COUNT AND DISPLAY WORK

  //-----------------------   

  if (CHILD_SERVICE) {                                                            // request's domain found on the list of baddoers
    const PARENT_SERVICE = getService(PARENT_DOMAIN);                             // find service of the actual website (from address bar)
    const CHILD_NAME = CHILD_SERVICE.name;
    const REDIRECT_SAFE = REQUESTED_URL != REQUESTS[TAB_ID];                      /* true if ?different url then the actual website (from address bar)
                                                                                     -??- how is REQUESTS populated -??-*/
    const CHILD_CATEGORY =                                                        /* recategorize bad content from good domains "apis.google.com": ["\\/js\\/plusone\\.js"
                                                                                                        "www.google.com": ["\\/uds\\/afs"
                                                                                                    "msg.yahoo.com": ["insider\\.msg\\.yahoo\\.com" */
        CHILD_SERVICE.category =
            recategorize(CHILD_DOMAIN, REQUESTED_URL) || CHILD_SERVICE.category;
    const CONTENT = CHILD_CATEGORY == CONTENT_NAME;                                
    
//  ----------------------  WHITELIST WORK
    const CATEGORY_WHITELIST =
        ((deserialize(options.whitelist) || {})[PARENT_DOMAIN] ||
            {})[CHILD_CATEGORY] || {};
//  ----------------------  END OF: WHITELIST WORK

    if (  //   ??     main_fr   ??not known domain         not X-domain request
      TAB_ID == -1 || PARENT || !PARENT_DOMAIN || CHILD_DOMAIN == PARENT_DOMAIN
          //  page on badlist AND  request for the same service
          || PARENT_SERVICE && CHILD_NAME == PARENT_SERVICE.name
    ) {         

          
      //alert('safe: ', REQUESTED_URL)   //  ###########################################################################
      if (!PARENT) {
        if (!FISHY_REQUESTS[TAB_ID])  FISHY_REQUESTS[TAB_ID] = {} 
        FISHY_REQUESTS[TAB_ID][CHILD_DOMAIN] ? 
          FISHY_REQUESTS[TAB_ID][CHILD_DOMAIN] += 1: FISHY_REQUESTS[TAB_ID][CHILD_DOMAIN] = 1
      }

    //---------------------  IF STH ABOVE TRUE & REDIRECT - 'HARDEN'                                                                  
      if (REDIRECT_SAFE) {
        hardenedUrl = harden(REQUESTED_URL);
        hardened = hardenedUrl.hardened;
        hardenedUrl = hardenedUrl.url;
        if (hardened) blockingResponse = {redirectUrl: hardenedUrl};
      }

    //---------------------  END OF: ABOVE


    //---------------------  IF X_DOMAIN but WHITELISTED(?)
    } else if (
      (CONTENT && CATEGORY_WHITELIST.whitelisted != false ||
          CATEGORY_WHITELIST.whitelisted ||
              (CATEGORY_WHITELIST.services || {})[CHILD_NAME]) &&
                  !(((deserialize(options.blacklist) || {})[PARENT_DOMAIN] ||
                      {})[CHILD_CATEGORY] || {})[CHILD_NAME]
    ) { // The request is allowed: the category or service is whitelisted.


      //alert('safe: ', REQUESTED_URL)   //  ###########################################################################


      if (REDIRECT_SAFE) {
        hardenedUrl = harden(REQUESTED_URL);
        hardened = hardenedUrl.hardened;
        hardenedUrl = hardenedUrl.url;
        if (hardened) blockingResponse = {redirectUrl: hardenedUrl};
        else whitelisted = true;
      }

    //---------------------  END OF:  ABOVE FALSE but WHITELISTED(?)

    //!!!!!!!!!!-----------  X-DOMAIN REQUEST (AND NOT WHITELISTED)
    } else {

   //alert( CHILD_NAME +' '+ CHILD_SERVICE  +' '+ CHILD_CATEGORY +' '+ CHILD_DOMAIN)   //  ###########################################################################
      //alert(CHILD_DOMAIN)   //  ###########################################################################
      if (!BAD_XDOMAIN_REQUESTS[TAB_ID])  BAD_XDOMAIN_REQUESTS[TAB_ID] = {} 
      BAD_XDOMAIN_REQUESTS[TAB_ID][CHILD_DOMAIN] ? 
        //BAD_XDOMAIN_REQUESTS[TAB_ID][CHILD_DOMAIN] += 1: BAD_XDOMAIN_REQUESTS[TAB_ID][CHILD_DOMAIN] = 1
          BAD_XDOMAIN_REQUESTS[TAB_ID][CHILD_DOMAIN][2] += 1 :
          BAD_XDOMAIN_REQUESTS[TAB_ID][CHILD_DOMAIN] = [CHILD_SERVICE.name, CHILD_SERVICE.url, 1]


		blockingResponse = {
        redirectUrl:
            TYPE == 'image' ?
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
                    : 'about:blank'
      };
      blockedCount = ++TAB_DASHBOARD.blocked;
      const BLOCKED_REQUESTS = deserialize(options.blockedRequests) || {};
      BLOCKED_REQUESTS[date] ? BLOCKED_REQUESTS[date]++ :
          BLOCKED_REQUESTS[date] = 1;
      options.blockedRequests = JSON.stringify(BLOCKED_REQUESTS);
    } // The request is denied.
    //!!!!!!!!!!------------  END OF: ABOVE FALSE (AND NOT WHITELISTED) - request denied


    /*   D2 request counter
    if (blockingResponse.redirectUrl || whitelisted)
        incrementCounter(TAB_ID, CHILD_SERVICE, !whitelisted || CONTENT, POPUP);
    */
  }

  REQUESTED_URL != REDIRECTS[TAB_ID] && delete REQUESTS[TAB_ID];
  delete REDIRECTS[TAB_ID];
  var securedCount;

  if (hardened) {
    REQUESTS[TAB_ID] = REQUESTED_URL;
    REDIRECTS[TAB_ID] = hardenedUrl;
    securedCount = ++TAB_DASHBOARD.secured;
    const HARDENED_REQUESTS = deserialize(options.hardenedRequests) || {};
    HARDENED_REQUESTS[date] ? HARDENED_REQUESTS[date]++ :
        HARDENED_REQUESTS[date] = 1;
    options.hardenedRequests = JSON.stringify(HARDENED_REQUESTS);
  }

  // The Collusion data structure.
  /*
  if (!(CHILD_DOMAIN in LOG))
      LOG[CHILD_DOMAIN] = {host: CHILD_DOMAIN, referrers: {}, visited: false};
  if (!(PARENT_DOMAIN in LOG))
      LOG[PARENT_DOMAIN] = {host: PARENT_DOMAIN, referrers: {}};
  LOG[PARENT_DOMAIN].visited = true;
  const REFERRERS = LOG[CHILD_DOMAIN].referrers;
  const ELAPSED_TIME = new Date() - startTime;
  if (CHILD_DOMAIN != PARENT_DOMAIN && !(PARENT_DOMAIN in REFERRERS))
      REFERRERS[PARENT_DOMAIN] = {
        host: PARENT_DOMAIN,
        types: [ELAPSED_TIME]
      };
  const PARENT_REFERRERS = REFERRERS[PARENT_DOMAIN];

  if (PARENT_REFERRERS) {
    const TYPES = PARENT_REFERRERS.types;
    TYPES.indexOf(TYPE) == -1 && TYPES.push(TYPE);
  }
  */

  /*// A live update.
  if (POPUP)
      if (options.displayMode == GRAPH_NAME) {
        const GRAPH = POPUP.graph;
        GRAPH && GRAPH.update(LOG);
      } else {
        const TIMEOUT = POPUP.timeout;

        blockedCount && setTimeout(function() {
          POPUP.renderBlockedRequest(
            TAB_ID,
            Math.min(blockedCount + TOTAL_COUNT * .28, TOTAL_COUNT),
            TOTAL_COUNT
          );
        }, TIMEOUT);

        securedCount && setTimeout(function() {
          POPUP.renderSecuredRequest(
            TAB_ID,
            Math.min(securedCount + TOTAL_COUNT * .28, TOTAL_COUNT),
            TOTAL_COUNT
          );
        }, TIMEOUT);
      }
  //return blockingResponse;
  */
}, {urls: ['http://*/*', 'https://*/*']})//, ['blocking']);















!OPERA && chrome.webNavigation.onCommitted.addListener(function(details) {
  if (!details.frameId) {
    const TAB_ID = details.tabId;
    delete BAD_XDOMAIN_REQUESTS[TAB_ID];
    delete FISHY_REQUESTS[TAB_ID];
    /*
    safelyUpdateCounter(TAB_ID, 0);
    const POPUP =
        options.displayMode != LEGACY_NAME &&
            EXTENSION.getViews({type: 'popup'})[0];
    POPUP && POPUP.clearServices(TAB_ID);
    */
  }
});


/* Resets the number of tracking requests and services for a tab. */
SAFARI && safari.application.addEventListener(
  'beforeNavigate', function(event) {
    const TAB_ID = event.target.id;
    delete REQUEST_COUNTS[TAB_ID];
    delete DASHBOARD[TAB_ID];
    safelyUpdateCounter(TAB_ID, 0);
    const POPUP =
        options.displayMode != LEGACY_NAME &&
            EXTENSION.getViews({type: 'popup'})[0];
    POPUP && POPUP.clearServices(TAB_ID);
  }, true
);

// Tells other extensions if digital-halo is installed
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    try {
      if (request.checkExtension && request.sourceExtension) {
        sendResponse({product: "digital-halo"});
        //$.get('https://disconnect.me/pingBack/' + request.sourceExtension)
      }
    }
    catch(e) {
      console.log(e);
    }
  }
);


/* Builds a block list or adds to the number of blocked requests. */
/*  ----------------------
EXTENSION.onRequest.addListener(function(request, sender, sendResponse) {
  const TAB = sender.tab;

  if (TAB) {
    const TAB_ID = TAB.id;
    const TAB_DASHBOARD =
        DASHBOARD[TAB_ID] ||
            (DASHBOARD[TAB_ID] = {total: 0, blocked: 0, secured: 0});
    const TOTAL_COUNT = ++TAB_DASHBOARD.total;

    if (request.initialized) {
      const DOMAIN = GET(TAB.url);
      sendResponse({
        servicePointer: servicePointer,
        tlds: SITENAME.getTlds(),
        domain: DOMAIN,
        whitelist: (deserialize(options.whitelist) || {})[DOMAIN] || {},
        blacklist: (deserialize(options.blacklist) || {})[DOMAIN] || {}
      });
    } else if (request.pwyw) {
      const PWYW = deserialize(options.pwyw);
      PWYW.bucket = request.bucket;
      options.pwyw = JSON.stringify(PWYW);
      sendResponse({});
    } 
    else if (request.deleteTab) {
      TABS.remove(TAB.id);
      if (request.pingURL) {
        $.get(request.pingURL);
      }
    } else {
      if (SAFARI) {
        const BLOCKED = request.blocked;
        const WHITELISTED = request.whitelisted;
        var popup =
            options.displayMode != LEGACY_NAME &&
                EXTENSION.getViews({type: 'popup'})[0];
        if (BLOCKED || WHITELISTED)
            incrementCounter(TAB_ID, request.childService, !WHITELISTED, popup);
        var blockedCount;

        if (BLOCKED) {
          blockedCount = ++TAB_DASHBOARD.blocked;
          const BLOCKED_REQUESTS = deserialize(options.blockedRequests) || {};
          BLOCKED_REQUESTS[date] ? BLOCKED_REQUESTS[date]++ :
              BLOCKED_REQUESTS[date] = 1;
          options.blockedRequests = JSON.stringify(BLOCKED_REQUESTS);
        }

        // The Collusion data structure.
        const CHILD_DOMAIN = request.childDomain;
        if (!(CHILD_DOMAIN in LOG))
            LOG[CHILD_DOMAIN] = {
              host: CHILD_DOMAIN, referrers: {}, visited: false
            };
        const PARENT_DOMAIN = request.parentDomain;
        if (!(PARENT_DOMAIN in LOG))
            LOG[PARENT_DOMAIN] = {host: PARENT_DOMAIN, referrers: {}};
        LOG[PARENT_DOMAIN].visited = true;
        const REFERRERS = LOG[CHILD_DOMAIN].referrers;
        if (!startTime) startTime = new Date();
        const ELAPSED_TIME = new Date() - startTime;
        if (CHILD_DOMAIN != PARENT_DOMAIN && !(PARENT_DOMAIN in REFERRERS))
            REFERRERS[PARENT_DOMAIN] = {
              host: PARENT_DOMAIN,
              types: [ELAPSED_TIME]
            };
        const PARENT_REFERRERS = REFERRERS[PARENT_DOMAIN];

        if (PARENT_REFERRERS) {
          const TYPES = PARENT_REFERRERS.types;
          const TYPE = request.type;
          TYPES.indexOf(TYPE) == -1 && TYPES.push(TYPE);
        }

        // A live update.
        if (popup)
            if (options.displayMode == GRAPH_NAME) {
              const GRAPH = popup.graph;
              GRAPH && GRAPH.update(LOG);
            } else {
              const TIMEOUT = popup.timeout;

              blockedCount && setTimeout(function() {
                popup.renderBlockedRequest(
                  TAB_ID,
                  Math.min(blockedCount + TOTAL_COUNT * .28, TOTAL_COUNT),
                  TOTAL_COUNT
                );
              }, TIMEOUT);
            }
      }

      sendResponse({});
    }
  } else sendResponse({});
});
*/


