window.addEventListener('load', function () {
  chrome.runtime.sendMessage({
    'URL':    document.URL,
    'title':  document.title,
    'accessedAt': Date.now()
  }, function (res) {})
}, false) 

