var Dropbox = require('dropbox');


var client = new Dropbox.Client({key: '3z9vnky7whz2dmn'});

client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
	  rememberUser: false,
		receiverPath: 'view/chrome_oauth_receiver.html'
	})
)

client.authenticate();

module.exports = client;
/*function authenticateWithDropbox () {
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

}*/
/*function signOutOfDropbox () {
	client.signOut(function (err) {
		if (err) return handleDBoxError(err)

		window.location.reload()
		showFlashMessage('success', 'Signed out from Dropbox')
	})
}*/



/*// api functions
function getDropboxAccountInfo() {
	client.getAccountInfo(function(error, accountInfo) {
	  if (error) return handleDBoxError(error)

	  showFlashMessage('success', "Hello, " + accountInfo.name + "!");
	})
}*/





module.exports = client;