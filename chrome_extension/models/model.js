function Model (initData) {	
	// check if minimal init Data
	if (initData.key == 'undefined' && initData.content == undefined) throw 'Trying to construct and object without content nor storageKey';

	this.content    = Model.deserialize(initData.content);  // obj
	this.storageKey = initData.key;   // string  
		
}

Model.prototype.serialize = function () {
	return JSON.stringify(this.content);
}

Model.deserialize = function (arg) {
	return typeof(arg) == 'string' ? JSON.parse(arg) : arg;
}
// for local storage functions i need to change how the webpages are stored
Model.prototype.loadFromLocal = function () {
	var self = this;

	chrome.storage.local.get(self.storageKey, function (data) {
		self.content = Model.deserialize(data);
	})
	
}
Model.prototype.saveToLocal = function () {

	var data = {};
	data[this.storageKey] = this.content;
	chrome.storage.local.set(data);

}

module.exports = Model;