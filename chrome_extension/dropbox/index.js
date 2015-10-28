// button calbacks
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

function writeHistory (e) {
    getHistory(writeDropbox)
}

function readDemographics (e) {
  var demoFile = 'test_res.json'
    readFromDropbox(demoFile, function showDemographics(demographics) { 
        demographics = JSON.parse(demographics); 
        for (category in demographics) {
            if (category != 'createdAt') {
                var new_li = document.createElement('li');
                document.querySelector('#demographics-ul').appendChild(new_li);
                new_li.innerHTML = category + '\t' + demographics[category]
          } 
        }
        //alert(serialize(demo))
    })
}

function sendRecent () {
  // get the overall count of recorded visits
  chrome.storage.local.get('recordedCount', function (items) {
    // check if anything got recorded, if not then return
    if (!items.recordedCount) return alert('No current history stored, nothing sent')

    // get recent history file count to append to file name
    readFromDropbox('config.json', function (config) {
      config = deserialize(config)
      config.raw_data.currentHistoryAndTrackers.file_count++
      var fileName = 'currentHistory/currentHistoryAndTrackers' + (config.raw_data.currentHistoryAndTrackers.file_count) + '.json'
       
      var count = items.recordedCount;
      // create pointer Array
      var pagePointers = []
      for (var i = 1; i <= count; i++) {
        pagePointers.push('page' + i)
      } 
      // get the pages from storage and send them
      chrome.storage.local.get(pagePointers, function (data) {
        // merge the pages into a single json array
        var payload = [];
        for (page in data) {
          payload.push(data[page])
        } 
        // send it
        writeDropbox(payload, fileName)
        console.log('sent recent history and trackers to Dropbox')
        // clear the pages from local storage and reset the counter
        chrome.storage.local.remove(pagePointers)
        chrome.storage.local.set({'recordedCount': 0}) 
      }) 
      writeDropbox(config, 'config.json')
    })
  })
}

// register 
window.addEventListener('load', function (e) {
  document.querySelector('#logIn').addEventListener('click', authenticateWithDropbox) 
  document.querySelector('#logOut').addEventListener('click', signOutOfDropbox)
  document.querySelector('#sendSDK').addEventListener('click', writeHistory)//writeDropbox)
  document.querySelector('#showAnswer').addEventListener('click', readDemographics)
  document.querySelector('nav').classList.add('move')
  document.querySelector('#sendRecent').addEventListener('click', sendRecent)
})
