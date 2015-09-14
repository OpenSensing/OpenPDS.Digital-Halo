document.addEventListener('DOMContentLoaded', function () {
  var port = chrome.runtime.connect({name: "Halo_get_data_content_script"})

//  alert('conent script on DOMContentLoaded '  + document.title)

  port.postMessage({
    'URL':    document.URL,
    'title':  document.title,
    'accessedAt': Date.now()
  })
}, false) 
