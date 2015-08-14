var data    = require('sdk/self').data
  , tabs    = require('sdk/tabs')
  , Request = require('sdk/request').Request
  , buttons = require('sdk/ui/button/action')
  , windows = require('sdk/windows')//.browserWindows

//var pdsUrl = 'http://dev.sensible.dtu.dk:9090/'//http://localhost:8000/';
var pdsUrl = 'http://localhost:8000/';
tabs.open({url: pdsUrl + 'app/signIn'})


// Event Handlers

function savePageData (tab) {
    console.log(tabs.activeTab.url);
    Request({ url: pdsUrl,
	contentType: 'application/json',
	content: JSON.stringify({
          'sentUrl'   : tabs.activeTab.url,
          'sentTitle' : tabs.activeTab.title,
          'accessedAt': Date.now()
        }),
        onComplete: function (res) {
	    console.log(res)
        }
    }).post()
};

function buttonClickHandler (state) {
    tabs.open({
	url: pdsUrl+'app/showHalo'
    })
}

function getDigitalHalo () {
    Request({ url       : pdsUrl+'/showHalo',
              conentType: 'text/html'
    }).get()
}


// UI modifications

var button = buttons.ActionButton({
    id: 'Visualiztion-Tab',
    label: 'See your Digital-Halo',
    icon: {'16': './icon-16.png'},
    onClick: buttonClickHandler
});


// Event Registration

tabs.on('ready', savePageData)

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js

function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

