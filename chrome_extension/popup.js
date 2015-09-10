var haloUrl = 'http://dev.sensible.dtu.dk:9090/app/showHalo'
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //alert(tabs[0].url)
    //document.body.innerHTML = tabs[0].url
    //chrome.tabs.update(tabs[0].id, {url: haloUrl})
    chrome.tabs.create({url: haloUrl})
  })
})
