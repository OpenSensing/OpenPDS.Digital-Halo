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
    //console.log(theHistory.length)
  })
}
