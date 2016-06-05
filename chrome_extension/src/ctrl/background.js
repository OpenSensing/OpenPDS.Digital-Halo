const MINUTE = 60000
    , SECOND = 1000;
var sendInterval = 120 * MINUTE
  , storeDelay   = 2 * SECOND
  //, client       = Halo.client
  , Model        = Halo.model('model')
  //, PagesModel   = Halo.model('trackedPages')
  ,  sendRecent   = Halo.ctrl('sendRecent');
  // package sitename as a node modeule   , sitename = Halo.vendor('sitename')

//store loaded page 
module.exports = function () {
  chrome.runtime.onMessage.addListener(function(message, sender, cb) {
    storePageInfoLocaly(message, sender);
  })

  // send current browsing and tracking to dropbox

  setInterval(function () {   
    sendRecent();
    //run analysis
    console.log('Running the mini pds');
    chrome.runtime.sendNativeMessage("dk.dtu.openpds", {'content' : 'no message, just open app.'})
  }, sendInterval)
}

//chrome.runtime.onMessage.addListener(function(message,sender, cb) {
function storePageInfoLocaly(message, sender) {   
  // verify the sender perhaps
  Halo.innerState.loadFromLocal();
  setTimeout(function () {  
    // check the last page number and increment
    //Halo.innerState.loadFromLocal();
   
    var recordedCount = Halo.innerState.content
      , n = 0;

    recordedCount || recordedCount == 0 ? n = recordedCount +1 : n = 0;
    Halo.innerState.setContent(n);

    var toStore = {
      'sentUrl'        : message.URL,
      'sentTitle'      : message.title,
      'accessedAt'     : message.accessedAt,
      'domain'         : GET(message.URL),
      'thirdPTrackers' : BAD_XDOMAIN_REQUESTS[sender.tab.id], //&& Object.keys(BAD_XDOMAIN_REQUESTS[sender.tab.id]),
      'firstPTrackers' : FISHY_REQUESTS[sender.tab.id]// && Object.keys(FISHY_REQUESTS[sender.tab.id])
    }

    var pageInfo = new Model({content: toStore, key: 'page'+n})
    pageInfo.saveToLocal();
    Halo.innerState.saveToLocal();

    console.log('Saved data to Dropbox for: page'+n +' ---'+ message.title)
    //alert(JSON.stringify(message)+'\n'+JSON.stringify(BAD_XDOMAIN_REQUESTS[sender.tab.id]))
  }, storeDelay)
}



/*
function sendRecent () {
  
  Halo.innerState.loadFromLocal();
  var recordedCount = Halo.innerState.content.recordedCount;
    // check if anything got recorded, if not then return
  if (!recordedCount) return updateDBoxLog('No current history stored, nothing sent');

    // get recent history file count to append to file name
  if (!client.isAuthenticated) client.authenitcate();

      // create pointer Array
  var pagePointers = []
  for (var i = 1; i <= recordedCount; i++) {
    pagePointers.push('page' + i);
  } 

  Halo.dboxState.loadFromDbox();  //update the files information
  var nextFilesCount = Halo.dboxState.content.raw_data.currentHistoryAndTrackers.file_count + 1
    , fileName        = 'currentHistory/currentHistoryAndTrackers' + nextFilesCount
    , modelInitData   = {'key': pagePointers, filePath: fileName} 
    , trackedHistory  = new PagesModel(modelInitData);
  //trackedHistory.loadFromLocal();

  // send stored pages
  trackedHistory.saveToDbox();
  console.log('sent recent history and trackers to Dropbox');
  trackedHistory.deleteLocal();
  conxole.log('deleted the tracked pages after sending');
  // update the config object and file
  Halo.dboxState.content.raw_data.currentHistoryAndTrackers.file_count = nextFilesCount;
  Halo.dboxState.saveToDbox()
  
  // clear the pages from local storage and reset the counter
  Halo.innerState.setContet({recordedCount : 0});
  Halo.innerState.saveToLocal();
 
}
*/




