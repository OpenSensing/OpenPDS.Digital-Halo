//var $ = require('jquery');
window.jQuery = window.$ = require("jquery");

global.Halo = {
	client: require('./dboxConfig')

    //,root: path.join(__dirname, '..')
    /*,appPath: function (relativePath) {
   		return path.join(this.root, relativePath) 
   	}*/
   /*,require: function (relativePath) {
   		return require(this.appPath(relativePath))
    }*/
    ,model: function (modelName) {
   		// return this.require(path.join('src/models', fileName))
      return require('../models/' + modelName + '.js')
    }
   ,view: function (viewName) {
   		// return this.require(path.join('src/views'), filename)
      return require('../view/' + viewName + '.js')  
    }
    ,ctrl: function (ctrlName) {
      return require('./' + ctrlName + ".js")
    }
   /*,vendor: function(modulePath) {
   		return require('../vendor/' + filePath)
    }*/
};
Halo.setSendInterval = require('./background.js').setSendInterval;

//var Model     = require('../models/model.js')
var Model     = Halo.model('model')
  , DboxModel = Halo.model('dboxModel');

Halo.innerState = new Model({key: 'recordedCount'});
Halo.dboxState  = new DboxModel({filePath: 'config.json'});
Halo.sendRecentAndAnalyze = Halo.ctrl('sendRecent');

//require('./background')();


/*///////  views config  // this will be handle by separate webpack bundles
var mainUrl   = chrome.extension.getURL('views/index.html') 
  , bgPageUrl = chrome.extension.getURL('_generated_background_page.html'); 

  
if (location.href == bgPageUrl) Halo.require('ctrl/background')();
if (location.href == mainUrl) Halo.view('index.js');	
*/