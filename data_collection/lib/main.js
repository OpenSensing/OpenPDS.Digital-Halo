//var sdkSelf = require('sdk/self');
var tabs  = require('sdk/tabs');
var Request = require('sdk/request').Request;

tabs.on('ready', alertURL);

function alertURL (tab) {
    tab.attach  ({
        contentScript: 'window.alert("Page matches ruleset");'
        //contentScript: 'document.body.innerHTML = "Page matches ruleset"'
    });
    console.log(tabs.activeTab.url)
};

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js

function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

