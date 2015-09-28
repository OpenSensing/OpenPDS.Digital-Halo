function getHistory (cb) {
	var sitename = new Sitename()
	var theHistory = {}
  chrome.history.search({text: "", startTime: 0, maxResults: 100000}, function (hist) {
    for (var it in hist) {
    	var domain = sitename.get(hist[it]['url'])
    	!theHistory[domain] ? theHistory[domain] = hist[it]['visitCount'] :
    	  theHistory[domain] += hist[it]['visitCount']
    }
    cb(theHistory)  
    console.log(theHistory.length)
  })
}

var button = document.getElementById('send');
button.addEventListener('click', getHistory(dropboxSend))

