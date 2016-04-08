
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
		showFlashMessage('success', 'Signed out from Dropbox')
	})
}



// api functions
function getDropboxAccountInfo() {
	client.getAccountInfo(function(error, accountInfo) {
	  if (error) return handleDBoxError(error)

	  showFlashMessage('success', "Hello, " + accountInfo.name + "!");
	})
}

function writeDropbox (text, fileName) {
	text = serialize(text)
	client.writeFile(fileName, text, function(error, stat) {
	  if (error) return handleDBoxError(error);  

	  updateDBoxLog("File " + fileName + " saved as revision id: " + stat.versionTag);
	})
}

function readFromDropbox (fileName, cb) {
	client.readFile(fileName, function (err, contents) {
		if (err) return handleDBoxError(err)

		cb(contents)
	})
}


// update sending log
function updateDBoxLog (logMessage) {
	var timestamp = new Date()
	timestamp = timestamp.toISOString()

	chrome.storage.local.get('DBoxLog', function (storedItems) {
		if (jQuery.isEmptyObject(storedItems)) {
			DBoxLog = []
		} else {
			DBoxLog = storedItems.DBoxLog
		}
		DBoxLog.push(timestamp + ' ' + logMessage) 

		chrome.storage.local.set({'DBoxLog': DBoxLog})
	})
}


// Error handlers

var handleDBoxError = function(error) {
	console.log(error)
  switch (error.status) {
  case Dropbox.ApiError.INVALID_TOKEN:
    showFlashMessage('failure', 'Token expired, please reauthenticate.')
    authenticateWithDropbox()
    break;

  case Dropbox.ApiError.NOT_FOUND:
    showFlashMessage('failure', 'File not found for url: ' + error.url)
    break;

  case Dropbox.ApiError.OVER_QUOTA:
  	showFlashMessage('failure', "You've reached the limit of your Dropbox space, remove some files or purches additional space")
    break;

  case Dropbox.ApiError.RATE_LIMITED:
    showFlashMessage('failure', "You've sent too many request, please try again later.")
    break;

  case Dropbox.ApiError.NETWORK_ERROR:
		showFlashMessage('failure', "You must be offline.")
    break;

  case Dropbox.ApiError.INVALID_PARAM:
  case Dropbox.ApiError.OAUTH_ERROR:
  case Dropbox.ApiError.INVALID_METHOD:
  default:
    showFlashMessage('failure', 'An error occured, please refresh the page. '+error.status)
  }
};







