//var sdkSelf = require('sdk/self');
var tabs  = require('sdk/tabs');
var Request = require('sdk/request').Request;

tabs.on('ready', alertURL);


function alertURL (tab) {
    tab.attach  ({
        contentScript: 'window.alert("Page url extracted ");'
        //contentScript: 'document.body.innerHTML = "Page matches ruleset"'
    });
    console.log(tabs.activeTab.url);
    Request({ url: "http://localhost:8000/",
	contentType: 'application/json',
	content: JSON.stringify({'sentUrl' : tabs.activeTab.url}),
        onComplete: function (res) {
	console.log(res)
        }
    }).post()

};

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js

function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

