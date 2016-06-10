var Model  = require('./model')
  , client = Halo.client;


// DROPBOX MODEL

function DBoxFileModel (initData) {
	//check minimal init data
	if (initData == undefined || initData.filePath == undefined && initData.content == undefined) throw 'DBoxFile initialized without conent nor filePath';

	Model.call(this, initData);
	this.filePath = initData.filePath;

	if (this.content == undefined) {
		this.loadFromDBox()
	}
}

DBoxFileModel.prototype = Object.create(Model.prototype);
DBoxFileModel.prototype.constructor = DBoxFileModel;


DBoxFileModel.prototype.loadFromDBox = function (mode) {
	mode ? mode : mode = 'ball';   //set default mode to whole json ball

	var self = this;
	return new Promise(function (resolve, reject) {
		Halo.client.readFile(self.filePath, function (err, data) {
			if (err) reject(err);

			resolve(data);
		});
	}).then( function (data) {
		if (mode == 'parse') { // add parsing code per data object if ever needed
		} else if (mode == 'ball') {
			self.content =  Model.deserialize(data);
			return self
		}
	}, function (err) { DBoxFileModel.handleDBoxError(err)})
};


DBoxFileModel.prototype.saveToDbox = function () {
	var self = this;
	var serializedContent = this.serialize();
	Halo.client.writeFile(self.filePath, serializedContent, function (err, state) {
		if (err) return DBoxFileModel.handleDBoxError(err)

		//update dropbox log
		console.log('File ' + self.filePath + ' saved ' + state.versionTag)
	})

}

DBoxFileModel.handleDBoxError = function(error) {
	console.log(error)
  switch (error.status) {
  case Dropbox.ApiError.INVALID_TOKEN:
  //showFlsahMessage('failure', 'Token expired, trying to reauthenticate')
    client.reset();
    client.authenticate();
    break;

  case Dropbox.ApiError.NOT_FOUND:
    //showFlashMessage('failure', 'File not found')
    break;

  case Dropbox.ApiError.OVER_QUOTA:
  	//showFlashMessage('failure', "You've reached the limit of your Dropbox space, remove some files or purches additional space")
    break;

  case Dropbox.ApiError.RATE_LIMITED:
    //showFlashMessage('failure', "You've sent too many request, please try again later.")
    break;

  case Dropbox.ApiError.NETWORK_ERROR:
		//showFlashMessage('failure', "You must be offline.")
    break;

  case Dropbox.ApiError.INVALID_PARAM:
  case Dropbox.ApiError.OAUTH_ERROR:
  case Dropbox.ApiError.INVALID_METHOD:
  default:
    //showFlashMessage('failure', 'An error occured, please refresh the page. '+error.status)
  }
};


module.exports = DBoxFileModel;

