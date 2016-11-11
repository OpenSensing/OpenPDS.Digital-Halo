/**
 * Created by mpio on 11/05/16.
 */
var client        = Halo.client
    ,PagesModel   = Halo.model('trackedPages')
    ,defaultDelay = 10 * 1000;

function sendRecent () {

    Halo.innerState.loadFromLocal();
    var recordedCount = Halo.innerState.content;
    // check if anything got recorded, if not then return
    if (!recordedCount) return //updateDBoxLog('No current history stored, nothing sent');

    // get recent history file count to append to file name
    if (!client.isAuthenticated) client.authenitcate();

    // create pointer Array
    var pagePointers = [];
    for (var i = 0  ; i <= recordedCount; i++) {
        pagePointers.push('page' + i);
    }


    Halo.dboxState.loadFromDBox()
    .then(function () {
        var nextFilesCount = Halo.dboxState.content.raw_data.currentHistoryAndTrackers.file_count + 1
            , fileName = 'currentHistory/currentHistoryAndTrackers' + nextFilesCount + ".json"
            , modelInitData = {'key': pagePointers, filePath: fileName};
        //update the file count in the DBox config
        Halo.dboxState.content.raw_data.currentHistoryAndTrackers.file_count++;
        Halo.dboxState.saveToDbox();

        return new PagesModel(modelInitData)

    }).then(function (trackedHistory) {

        // send stored pages
        setTimeout(function () {
            trackedHistory.saveToDbox();
            console.log('sent recent history and trackers to Dropbox');
            trackedHistory.deleteLocal();
            console.log('deleted the tracked pages after sending');

            // clear the pages from local storage and reset the counter
            Halo.innerState.setContent(0);
            Halo.innerState.saveToLocal();
        }, 4000);
    })
};

module.exports = function sendRecentAndAnalyze () {
    sendRecent();
    //run analysis
    setTimeout(function () {
        console.log('Running the mini pds');
        chrome.runtime.sendNativeMessage("dk.dtu.openpds", {'content': 'no message, just open app.'});
    }, defaultDelay)
};

module.exports = function sendRecentAndAnalyze () {
    sendRecent();
    //run analysis
    setTimeout(function () {
        console.log('Running the mini pds');
        chrome.runtime.sendNativeMessage("dk.dtu.openpds", {'content': 'no message, just open app.'});
    }, defaultDelay)
};