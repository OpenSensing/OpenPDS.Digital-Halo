
//  helper
function serialize (object) {
  return typeof object != 'string' ? JSON.stringify(object) : object
}

// init client
var client = new Dropbox.Client({key: '3z9vnky7whz2dmn'})

client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
	  rememberUser: false,
		receiverPath: 'chrome_oauth_receiver.html'
	})
)

function authenticateWithDropbox () {
	client.authenticate(function (err, client) {
		if (err) return console.error(err)

		console.log('Halo authenticated with Dropbox')	
	})
}
function signOutOfDropbox () {
	client.signOut(function (err) {
		if (err) return console.log('Error while signing out: '+err)

		window.location.reload()
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

function writeDropbox (text) {
	text = serialize(text)
	client.writeFile("hello_world.txt", text, function(error, stat) {
	  if (error) {
	    return console.error(error);  // Something went wrong.
	  }

	  alert("File saved as revision " + stat.versionTag);
	})
}

// button calbacks
function writeHistory (e) {
	getHistory(writeDropbox)
}

// register 
window.addEventListener('load', function (e) {
	document.querySelector('#logIn').addEventListener('click', authenticateWithDropbox) 
  document.querySelector('#logOut').addEventListener('click', signOutOfDropbox)
  document.querySelector('#sendSDK').addEventListener('click', writeHistory)//writeDropbox)
})

