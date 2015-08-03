var data = require('sdk/self').data
  , tabs  = require('sdk/tabs')
  , Request = require('sdk/request').Request
  , buttons = require('sdk/ui/button/action');

var pdsUrl = 'http://localhost:8000/';


// Event Handlers

function saveURL (tab) {
   /*  tab.attach  ({
        contentScript: 'window.alert("Page url extracted ");'
        //contentScript: 'document.body.innerHTML = "Page matches ruleset"'
    });
    */
    console.log(tabs.activeTab.url);
    Request({ url: pdsUrl,
	contentType: 'application/json',
	content: JSON.stringify({'sentUrl' : tabs.activeTab.url}),
        onComplete: function (res) {
	    console.log(res)
        }
    }).post()
};

function buttonClickHandler (state) {
    tabs.open({
	url: pdsUrl+'showHalo'
	/*url: './vis.html',
	onLoad: getDigitalHalo*/
    })
}

function getDigitalHalo () {
    Request({ url: pdsUrl+'/showHalo',
        conentType: 'text/html',
    /*    onComplete: function (res) {
            var worker = tabs.activeTab.attach({
		//contentScriptFile: './vis-cloud-content-script.js'
		contentScriptFile: './test.js'
	    });
	    worker.port.emit('loadHalo', res.text);
	}     
    */	
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

tabs.on('ready', saveURL);


// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js

function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

