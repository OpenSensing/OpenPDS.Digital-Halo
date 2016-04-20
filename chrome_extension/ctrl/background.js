var MINUTE = 60000
  // package sitename as a node modeule   , sitename = Halo.vendor('sitename')

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

  console.log('Running the mini pds')
  chrome.runtime.sendNativeMessage("dk.dtu.openpds", {'content' : 'no message, just open app.'})


}, 120 * MINUTE)


//chrome.runtime.onMessage.addListener(function(message,sender, cb) {
function storeBrowsingAndTrackingLocaly(message, sender) {   
  // verify the sender perhaps
  const SECOND = 1000
  setTimeout(function () {  
    // check the last page number and increment

    chrome.storage.local.get('recordedCount', function (items) { 
      var n = 0
      items.recordedCount || items.recordedCount == 0 ? n = items.recordedCount +1 : n = 0
      chrome.storage.local.set({'recordedCount': n})
      var toStore = {}
      toStore['page' + n] = {}
      toStore['page' + n]['sentUrl']        = message.URL,
      toStore['page' + n]['sentTitle']      = message.title,
      toStore['page' + n]['accessedAt']     = message.accessedAt,
      toStore['page' + n]['domain']         = GET(message.URL),
      toStore['page' + n]['thirdPTrackers'] = BAD_XDOMAIN_REQUESTS[sender.tab.id], //&& Object.keys(BAD_XDOMAIN_REQUESTS[sender.tab.id]),
      toStore['page' + n]['firstPTrackers'] = FISHY_REQUESTS[sender.tab.id],// && Object.keys(FISHY_REQUESTS[sender.tab.id])
      chrome.storage.local.set(toStore, function (err) {
        if (err) console.error(err)

        console.log('Saved data to Dropbox for: page'+n +' ---'+ message.title)
      })
    })  
    //alert(JSON.stringify(message)+'\n'+JSON.stringify(BAD_XDOMAIN_REQUESTS[sender.tab.id]))
  }, 1.5 * SECOND)
}
//})
/*  remember to remove copy from dropbox/index.js  when done with testing */
function sendRecent () {
  // get the overall count of recorded visits
  chrome.storage.local.get('recordedCount', function (items) {
    // check if anything got recorded, if not then return
    if (!items.recordedCount) return updateDBoxLog('No current history stored, nothing sent')

    // get recent history file count to append to file name
    authenticateWithDropbox()
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




