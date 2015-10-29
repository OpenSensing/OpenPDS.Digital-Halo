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

}, 30 * MINUTE)