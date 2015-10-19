chrome.runtime.onMessage.addListener(function(message,sender, cb) {
  setTimeout(function () {  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://dev.sensible.dtu.dk:9090/', true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.send(JSON.stringify({
      'sentUrl':         message.URL,
      'sentTitle':       message.title,
      'accessedAt':      message.accessedAt,
      'thirdPTrackers':  BAD_XDOMAIN_REQUESTS[sender.tab.id] && Object.keys(BAD_XDOMAIN_REQUESTS[sender.tab.id]),
      'firstPTrackers':  FISHY_REQUESTS[sender.tab.id] && Object.keys(FISHY_REQUESTS[sender.tab.id])  
    }))
    //alert(JSON.stringify(message)+'\n'+JSON.stringify(BAD_XDOMAIN_REQUESTS[sender.tab.id]))
  }, 1500)
})
