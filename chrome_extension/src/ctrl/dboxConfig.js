// loaded by Webback external
//var Dropbox = require('dropbox');


var client = new Dropbox.Client({key: '3z9vnky7whz2dmn'});

client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
	  rememberUser: false,
		receiverPath: 'html/chrome_oauth_receiver.html'
	})
);

client.authenticate();

module.exports = client;

