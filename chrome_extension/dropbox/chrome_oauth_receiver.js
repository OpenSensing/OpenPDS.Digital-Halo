Dropbox.AuthDriver.ChromeExtension.oauthReceiver()

function getInfo () {
	client.getAccountInfo(function(error, accountInfo) {
	  if (error) {
	    return showError(error);  // Something went wrong.
	  }

	  console.log("Hello, " + accountInfo.name + "!");
  })
}

document.addEventListener('click', getInfo())