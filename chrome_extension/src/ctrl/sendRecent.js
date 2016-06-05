/**
 * Created by mpio on 11/05/16.
 */
var client        = Halo.client
    ,PagesModel   = Halo.model('trackedPages');

module.exports = function sendRecent () {

    Halo.innerState.loadFromLocal();
    var recordedCount = Halo.innerState.content;
    // check if anything got recorded, if not then return
    if (!recordedCount) return updateDBoxLog('No current history stored, nothing sent');

    // get recent history file count to append to file name
    if (!client.isAuthenticated) client.authenitcate();

    // create pointer Array
    var pagePointers = [];
    for (var i = 1; i <= recordedCount; i++) {
        pagePointers.push('page' + i);
    }


    Halo.dboxState.loadFromDBox().then(function () {
        var nextFilesCount = Halo.dboxState.content.raw_data.currentHistoryAndTrackers.file_count + 1
            , fileName = 'currentHistory/currentHistoryAndTrackers' + nextFilesCount + ".json"
            , modelInitData = {'key': pagePointers, filePath: fileName};
        //update the file count in the DBox config
        Halo.dboxState.content.raw_data.currentHistoryAndTrackers.file_count++;
        Halo.dboxState.saveToDbox();

        return new PagesModel(modelInitData);
    }).then(function (trackedHistory) {

        // send stored pages
        trackedHistory.saveToDbox();
        console.log('sent recent history and trackers to Dropbox');
        trackedHistory.deleteLocal();
        console.log('deleted the tracked pages after sending');

        // clear the pages from local storage and reset the counter
        Halo.innerState.setContent(0);
        Halo.innerState.saveToLocal();
    })
};