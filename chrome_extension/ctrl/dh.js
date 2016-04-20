var path = require('path');


global.Halo = {
	client: require('./dboxConfig')
   ,root: path.join(__dirname, '..')
}




////////  views config
var mainUrl   = chrome.extension.getURL('views/index.html') 
  , bgpageUrl = chrome.extension.getURL('_generated_background_page.html'); 