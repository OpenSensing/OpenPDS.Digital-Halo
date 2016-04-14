function Model (content) {
	 this.content = Model.deserialize(content);
		
}

Model.prototype.serialize = function () {
	return JSON.stringify(this.content);
}

Model.deserialize = function (arg) {
	return typeof(arg) == 'string' ? JSON.parse(arg) : arg;
}
// for local storage functions i need to change how the webpages are stored
Model.loadFromLocal = function (key, cb) {
	
	cb(data)
}
Model.saveToLocal = function (key, data ) {


}

// DROPBOX MODEL

function DBoxModel (filePath, content) {
	Model.call(this, content);
	this.filePath   = filePath;

	if (this.content == undefined) {
		DBoxModel.loadFromDBox(this.filePath)
		.then(function (data) {this.conent = data})
	}
} 

DBoxModel.prototype = Object.create(Model.prototype);
DBoxModel.prototype.constructor = DBoxModel;

//  TODO  

DBoxModel.loadFromDBox = function (filePath) {
	
	new Promise(function (resolve, reject) {
		client.readFile(filePath, funciton (err, data) {
			if (err) reject(err);

			resolve(data)
		});
	)}.then( function (data) {
		return data;
	}, function (err) {  /* TODO handle the error */})
};

// particualr dropbox models - read only and rw models

// rw model

DBoxModel.saveToDbox = function (filePath, data) {

/*  TODO
	-serialize the content
	- post it to dropbox path as in this.filePath
*/
}





exports.Model = Model;
exports.DBoxModel = DBoxModel;