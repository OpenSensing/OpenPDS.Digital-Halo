
//  helper
function serialize (object) {
  return typeof object != 'string' ? JSON.stringify(object) : object
}
function deserialize (object) {
  return typeof object == 'string' ? JSON.parse(object) : object
}

// init client
var client = new Dropbox.Client({key: '3z9vnky7whz2dmn'})

client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
	  rememberUser: false,
		receiverPath: 'dropbox/chrome_oauth_receiver.html'
	})
)

function authenticateWithDropbox () {
	try {
		client.authenticate(function (err, client) {
			if (err) return handleDBoxError(err)

			getDropboxAccountInfo()
			console.log('Halo authenticated with Dropbox')	
		})  	
  } catch (exception) {   // not giving authorization crashes the client, so trying to reset
  	console.log(exception+'\nReseting the client and trying to authenticate again')
  	client.reset()
  	client.authenticate(function (err, client) {
			if (err) return handleDBoxError(err)

			getDropboxAccountInfo()
			console.log('Halo authenticated with Dropbox')	
		})  
  }

}
function signOutOfDropbox () {
	client.signOut(function (err) {
		if (err) return handleDBoxError(err)

		window.location.reload()
		alert('Signed out from Dropbox')
	})
}



// api functions
function getDropboxAccountInfo() {
	client.getAccountInfo(function(error, accountInfo) {
	  if (error) return handleDBoxError(error)

	  alert("Hello, " + accountInfo.name + "!");
	})
}

function writeDropbox (text, fileName) {
	text = serialize(text)
	client.writeFile(fileName, text, function(error, stat) {
	  if (error) return handleDBoxError(error);  

	  alert("File saved as revision " + stat.versionTag);
	})
}

function readFromDropbox (fileName, cb) {
	client.readFile(fileName, function (err, contents) {
		if (err) return handleDBoxError(err)

		cb(contents)
	})
}


// Error handlers

var handleDBoxError = function(error) {
	console.log(error)
  switch (error.status) {
  case Dropbox.ApiError.INVALID_TOKEN:
    alert('Token expired, please reauthenticate.')
    authenticateWithDropbox()
    break;

  case Dropbox.ApiError.NOT_FOUND:
    alert('File not found for url: ' + error.url)
    break;

  case Dropbox.ApiError.OVER_QUOTA:
  	alert("You've reached the limit of your Dropbox space, remove some files or purches additional space")
    break;

  case Dropbox.ApiError.RATE_LIMITED:
    alert("You've sent too many request, please try again later.")
    break;

  case Dropbox.ApiError.NETWORK_ERROR:
		alert("You must be offline.")
    break;

  case Dropbox.ApiError.INVALID_PARAM:
  case Dropbox.ApiError.OAUTH_ERROR:
  case Dropbox.ApiError.INVALID_METHOD:
  default:
    alert('An error occured, please refresh the page. '+error.status)
  }
};







