const MINUTE = 60000

//store loaded page 
chrome.runtime.onMessage.addListener(function(message, sender, cb) {
  storeBrowsingAndTrackingLocaly(message, sender)
})

// send current browsing and tracking to dropbox
setInterval(function () {
  try {
  	client.authenticate()
  } catch (exception) {   // not giving authorization crashes the client, so trying to reset
  	console.log(exception+'\nReseting the client and trying to authenticate again')
  	client.reset()
  	client.authenticate()
  }
  sendRecent() 

}, 120 * MINUTE)


chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");

        try {
			client.authenticate(function (err, client) {
				if (err) return handleDBoxError(err)
				
				console.log('Halo background page authenticated with Dropbox')	
			    client.mkdir('currentHistory', function (err, res) {
			    	if (err) return console.log(err); 

			    	console.log(res)
			    	getHistory(writeHistory)
			    });
		        
		    	//client.copy('history.json', 'currentHistory/history.json', function (err, res) {if (err) return console.log(err); console.log(res)})	
			})  	
		} catch (exception) {   // not giving authorization crashes the client, so trying to reset
		  	console.log(exception+'\nReseting the client and trying to authenticate again')
		  	client.reset()
		  	client.authenticate(function (err, client) {
				if (err) return handleDBoxError(err)

				console.log('Halo background page authenticated with Dropbox')
			    //client.mkdir('currentHistory', function (err, res) {if (err) return console.log(err); console.log(res)});
		        client.mkdir('currentHistory', function (err, res) {
			    	if (err) return console.log(err); 

			    	console.log(res)
			    	getHistory(writeHistory)
			    });
		    		
			})  
  		}	

    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});




function getHistory (cb) {
    var sitename = new Sitename()
    var theHistory = {}
  chrome.history.search({text: "", startTime: 0, maxResults: 100000}, function (hist) {
    for (var it in hist) {
        var domain = sitename.get(hist[it]['url'])
        !theHistory[domain] ? theHistory[domain] = hist[it]['visitCount'] :
          theHistory[domain] += hist[it]['visitCount']
    }
    var fileName = 'history.json'
    cb(theHistory, fileName)
  })
}


function writeHistory (history, filename) {
    writeDropbox(history, filename);
    setTimeout(function () {client.copy('history.json', 'currentHistory/history.json', function (err, res) {if (err) return console.log(err); console.log(res)})}, 15000);
}


