function serialize (object) {
  return typeof object != 'string' ? JSON.stringify(object) : object
}

var client = new Dropbox.Client({key: '3z9vnky7whz2dmn'})



function dropboxSend (payload) {
	var userID    = "mieszkomieszko@gmail.com"
	var token     = "zLMBGCx3p9gAAAAAAABgAvqOWZZAlAWUalI_ORH6aLIBnRv96ExJryoayyJX0dFV"
	var key       =	"xxx"  
	var signature = "xxx"  // SECRET?

	var xhr = new XMLHttpRequest()

	xhr.onreadystatechange = function() {
	//	if (xhr.readyState==4 && xhr.status==200) {
	//		console.log('history uploaded to Dropbox!')
	  if(xhr.readyState==4) {
	  	console.log('finished with status: '+xhr.status)   
	  } else if(xhr.readyState==0) {
	  	conosle.log('state: 0 - not init')
	  } else if (xhr.readyState==1) {
	  	console.log('state: 1 - connected to server')
	  } else if (xhr.readyState==2) {
	  	console.log('state: 2 - received')	  		
	  } else if (xhr.readyState==3) {
	  	console.log('state: 3 - processing')	  		
	  }
  }

	var drop_path = "testfile.json"
	var params    = "?access_token=" + token
	xhr.open("PUT", 
		"https://content.dropboxapi.com/1/files_put/auto/" + drop_path + params,
	  true)

	/*
	xhr.setRequestHeader("Authorization", 'OAuth oauth_version="2.0",oauth_signature_method=' +
	  '"PLAINTEXT",oauth_comsumer_key="' + key + '",oauth_token="' + token + '",oauth_signature="' 
	  + signature + '"')
	*/
	xhr.setRequestHeader("Accept", '"text/plain; charset=iso-8859-1", "Content-Type":' + 
		'"text/plain; charset=iso-8859-1"' )

	xhr.send(serialize(payload))
	//console.log(payload[1])	
}