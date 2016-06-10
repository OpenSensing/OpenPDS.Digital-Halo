var DboxModel = Halo.model('dboxModel'),
	Model     = Halo.model('model');

function trackedPagesModel (initData) {
	initData && DboxModel.call(this, initData);
	this.loadFromLocal();
}

trackedPagesModel.prototype = Object.create(DboxModel.prototype);
trackedPagesModel.prototype.constructor = trackedPagesModel;


trackedPagesModel.prototype.loadFromLocal = function () {
	var self = this;

	chrome.storage.local.get(self.storageKey, function (pages) {
		var content = [];
		  for (page in pages) {
	    	content.push(pages[page])
	  	}
		console.log('Tracked pages, loading content from local, to model n = '+pages.length)
		self.content = content;
	})
}

module.exports = trackedPagesModel;