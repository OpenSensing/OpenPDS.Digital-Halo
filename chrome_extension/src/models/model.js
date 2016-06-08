function Model (initData) {	
	// check if minimal init Data
	if (initData == undefined || initData.key == 'undefined' && initData.content == undefined) throw 'Trying to construct and object without content nor storageKey';

	if (initData.content) this.content  = Model.deserialize(initData.content);  // obj
	if (initData.key) {
        this.storageKey = initData.key;
        // automated loading from storage if content not given at initialization
        //if (this.content == undefined)    this.loadFromLocal();
    }
}

Model.prototype.serialize = function () {
	return JSON.stringify(this.content);
};

Model.deserialize = function (arg) {
	return typeof(arg) == 'string' ? JSON.parse(arg) : arg;
}
// for local storage functions i need to change how the webpages are stored
Model.prototype.loadFromLocal = function () {
	var self = this;
//TODO : wont work for multiple storage keys
	chrome.storage.local.get(self.storageKey, function (data) {
		self.content = Model.deserialize(data[self.storageKey]);
	});
}

Model.prototype.saveToLocal = function () {
	var data = {};
	data[this.storageKey] = this.content;

    chrome.storage.local.set(data);
}

Model.prototype.deleteLocal = function () {
	chrome.storage.local.remove(this.storageKey);
}

Model.prototype.setContent = function (input) {
	this.content = Model.deserialize(input);
}

module.exports = Model;