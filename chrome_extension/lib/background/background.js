const MINUTE = 60000

//store loaded page 
chrome.runtime.onMessage.addListener(function(message, sender, cb) {
  storeBrowsingAndTrackingLocaly(message, sender)
})

// send current browsing and tracking to dropbox
setInterval(function () {
  client.authenticate()
  readFromDropbox('config.json', function (config) {
		config = deserialize(config)
		config.raw_data.currentHistoryAndTrackers.file_count++
		var fileName = 'currentHistory/currentHistoryAndTrackers' + (config.raw_data.currentHistoryAndTrackers.file_count) + '.json'
  	sendRecent(fileName)
  	// update new file count
  	writeDropbox(config, 'config.json')
  })
    
}, 30 * MINUTE)