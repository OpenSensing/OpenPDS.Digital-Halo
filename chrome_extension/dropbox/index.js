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

function presentResultsAsList (results) {
  for (group in results) {
    if (group != 'createdAt') {
        var new_li = document.createElement('li');
        document.querySelector('#demographics-ul').appendChild(new_li);
        new_li.innerHTML = group + '\t' + results[group][0]
    } 
  }
}

function presentResultsAsTable (results){
  for (group in results) {
    if (group != 'createdAt') {
      category    = results[group][0]
      probability = results[group][1].toFixed(3)
      rowHTML  = '<tr><td>'+group+'</td><td>'+category+'</td><td>'+probability+'</td></tr>'
      $('#demographics-table').append(rowHTML);
      $('#demographics-table').append('<tr><td><progress value='+probability+' max=1></progress></td><tr>')
    } 
  }
}


function readDemographics (e) {
  var demoFile = 'res_per_tracker.json'
    readFromDropbox(demoFile, function showDemographics(demographics) { 
        demographics = deserialize(demographics); 
        totals = demographics['total'];

        presentResultsAsTable(totals)
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

function openPDS (e) {
  chrome.runtime.sendNativeMessage("dk.dtu.openpds", {'content' : 'no message, just open app.'})
}

// register 
window.addEventListener('load', function (e) {
  document.querySelector('#log_in').addEventListener('click', authenticateWithDropbox) 
  document.querySelector('#log_out').addEventListener('click', signOutOfDropbox)
 
  //document.querySelector('#sendSDK').addEventListener('click', writeHistory)//writeDropbox)
  //document.querySelector('#showAnswer').addEventListener('click', readDemographics)
  //document.querySelector('nav').classList.add('move')
  //document.querySelector('#sendRecent').addEventListener('click', sendRecent)
  document.querySelector('#meetMonsters').addEventListener('click', readDemographics)
  document.querySelector('#openYourPDS').addEventListener('click', openPDS)
  $(".button-collapse").sideNav({edge: 'right'})
  $('#mobile-log_in').on('click', authenticateWithDropbox)
  $('#mobile-log_out').on('click', signOutOfDropbox)
})
