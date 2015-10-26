const SECOND = 1000
const MINUTE = 60000

chrome.runtime.onMessage.addListener(function(message,sender, cb) {
  // verify the sender perhaps
  setTimeout(function () {  
    // check the last page number and increment

    chrome.storage.local.get('recordedCount', function (items) { 
      var n = 0
      items.recordedCount ? n = items.recordedCount +1 : n = 1
      chrome.storage.local.set({'recordedCount': n})
      var toStore = {}
      toStore['page' + n] = {}
      toStore['page' + n]['sentUrl']        = message.URL,
      toStore['page' + n]['sentTitle']      = message.title,
      toStore['page' + n]['accessedAt']     = message.accessedAt,
      toStore['page' + n]['thirdPTrackers'] = BAD_XDOMAIN_REQUESTS[sender.tab.id] && Object.keys(BAD_XDOMAIN_REQUESTS[sender.tab.id]),
      toStore['page' + n]['firstPTrackers'] = FISHY_REQUESTS[sender.tab.id] && Object.keys(FISHY_REQUESTS[sender.tab.id])
      chrome.storage.local.set(toStore, function (err) {
        if (err) console.error(err)

        console.log('Saved data to Dropbox for: page'+n +' ---'+ message.title)
      })
    })  
    //alert(JSON.stringify(message)+'\n'+JSON.stringify(BAD_XDOMAIN_REQUESTS[sender.tab.id]))
  }, 1.5 * SECOND)
})

setInterval(function () {
    client.authenticate()
    chrome.storage.local.get('recordedCount', function (items) {
      var pageNo = 'page' + items.recordedCount
      chrome.storage.local.get(pageNo, function (data) {
        writeDropbox(data[pageNo], 'test_live.json')
      })
    })
  }, 15 * MINUTE)
