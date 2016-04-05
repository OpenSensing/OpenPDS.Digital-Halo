$('document').ready(function (){
	chrome.storage.local.get('DBoxLog', function (log) {
		log = log.DBoxLog
		for (var i in log.slice(-100)) {
			$('#DBoxLogParagraph').append(log[i] + '<br/>')
		}
	})
})