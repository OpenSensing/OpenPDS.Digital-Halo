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

// register 
window.addEventListener('load', function (e) {
  document.querySelector('#logIn').addEventListener('click', authenticateWithDropbox) 
  document.querySelector('#logOut').addEventListener('click', signOutOfDropbox)
  document.querySelector('#sendSDK').addEventListener('click', writeHistory)//writeDropbox)
  document.querySelector('#showAnswer').addEventListener('click', readDemographics)
  document.querySelector('nav').classList.add('move')
})
