chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");

        try {
          client.authenticate(function (err, client) {
            if (err) return console.log(err)
            console.log('Halo background page authenticated with Dropbox')  
            // setup the history folder and query the history already storred in chrome
            initHaloFolder()
      })    
        } catch (exception) {   // not giving authorization crashes the client, so trying to reset
          console.log(exception+'\nReseting the client and trying to authenticate again')
          client.reset()
          client.authenticate(function (err, client) {
            if (err) return err;

            initHaloFolder()   
          })  
      } 

    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

function initHaloFolder() {
    client.mkdir('currentHistory', function (err, res) {
      if (err) return console.log(err); 

      console.log('Successfuly created "currentHistory" folder')
      getHistory(writeHistory)
    });
  
    client.mkdir('model', function (err, res) {
      if (err) return console.log(err);

      console.log('Successfuly created model folder ')
}

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
