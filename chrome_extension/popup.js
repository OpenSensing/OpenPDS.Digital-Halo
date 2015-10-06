//var haloUrl = 'http://dev.sensible.dtu.dk:9090/app/showHalo'
var haloUrl = chrome.extension.getURL('dropbox/index.html')
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({url: haloUrl, currentWindow: true}, function(tabs) {
    tabs[0] ? chrome.tabs.update(tabs[0].id, {active: true}) :
    //alert(tabs[0].url)
    //document.body.innerHTML = tabs[0].url
    //chrome.tabs.update(tabs[0].id, {url: haloUrl})
      chrome.tabs.create({url: haloUrl})
  })
})
