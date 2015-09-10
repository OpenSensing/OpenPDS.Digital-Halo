//document.addEventListener('DOMContentLoaded', function () {
chrome.tabs.onUpdated.addListener(function (id, changeInfo, tab) {
  if(changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined){
    alert( tab.title +  tab.url)

    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://dev.sensible.dtu.dk:9090/', true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.send(JSON.stringify({
      'sentUrl':    tab.url,
      'sentTitle':  tab.title,
      'accessedAt': Date.now()
    }))
  }
})
