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
      toStore['page' + n]['thirdPTrackers'] = BAD_XDOMAIN_REQUESTS[sender.tab.id] && Object.keys(BAD_XDOMAIN_REQUESTS[sender.tab.id]),
      toStore['page' + n]['firstPTrackers'] = FISHY_REQUESTS[sender.tab.id] && Object.keys(FISHY_REQUESTS[sender.tab.id])
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
  chrome.storage.local.get('recordedCount', function (items) {
    var count        = items.recordedCount;
    // create pointer Array
    var pagePointers = []
    for (var i = 0; i <= count; i++) {
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
      writeDropbox(payload, 'test_live.json')
      console.log('sent recent history and trackers to Dropbox')
      // clear the pages from local storage and reset the counter
      chrome.storage.local.remove(pagePointers)
      chrome.storage.local.set({'recordedCount': 0}) 
    })  
  })
}
*/


