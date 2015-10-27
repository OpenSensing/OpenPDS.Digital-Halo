const MINUTE = 60000

//store loaded page 
chrome.runtime.onMessage.addListener(function(message, sender, cb) {
  storeBrowsingAndTrackingLocaly(message, sender)
})

// send current browsing and tracking to dropbox
setInterval(function () {
    client.authenticate()
    sendRecent()
  }, 30 * MINUTE)