
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
	client.authenticate(function (err, client) {
		if (err) return alert(err)

		getDropboxAccountInfo()
		console.log('Halo authenticated with Dropbox')	
	})
}
function signOutOfDropbox () {
	client.signOut(function (err) {
		if (err) return alert('Error while signing out: '+err)

		window.location.reload()
		alert('Signed out from Dropbox')
	})
}



// api functions
function getDropboxAccountInfo() {
	client.getAccountInfo(function(error, accountInfo) {
	  if (error) {
	    return console.error(error);  // Something went wrong.
	  }

	  alert("Hello, " + accountInfo.name + "!");
	})
}

function writeDropbox (text, fileName) {
	text = serialize(text)
	client.writeFile(fileName, text, function(error, stat) {
	  if (error) {
	    return console.error(error);  // Something went wrong.
	  }

	  alert("File saved as revision " + stat.versionTag);
	})
}

function readFromDropbox (fileName, cb) {
	client.readFile(fileName, function (err, contents) {
		if (err) console.error(err)

		cb(contents)
	})
}



