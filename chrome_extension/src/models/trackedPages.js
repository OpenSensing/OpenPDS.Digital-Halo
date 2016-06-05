var DboxModel = Halo.model('dboxModel');

function trackedPagesModel (initData) {
	initData && DboxModel.call(this, initData);
	this.loadFromLocal();
}

trackedPagesModel.prototype = Object.create(DboxModel.prototype);
trackedPagesModel.prototype.constructor = trackedPagesModel;

/*trackedPagesModel.prototype.loadFromLocal = function () {
	var self = this;

	chrome.storage.local.get(self.storageKey, function (data) {
		var content = [];
		  for (page in data) {
	    	content.push(data[page])
	  	}
		self.content = Model.deserialize(content);
	})
} */

module.exports = trackedPagesModel;