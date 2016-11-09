const MINUTE = 60000
    , SECOND = 1000;

//TODO: make a setter of the send interval in the Halo App
var defaultSendInterval = 120 * MINUTE
  , defaultDelay = 3 * SECOND
  //, client       = Halo.client
  , Model        = Halo.model('model')
  //, PagesModel   = Halo.model('trackedPages')
  ,  sendRecentAndAnalyze   = Halo.ctrl('sendRecent');
  //TODO: package sitename as a node module   , sitename = Halo.vendor('sitename')


// Require on install callbacks
Halo.ctrl('onInstall');

//store loaded page
module.exports.setupLocalStorageListener = function () {
  chrome.runtime.onMessage.addListener(function (message, sender, cb) {
    storePageInfoLocaly(message, sender);
  })
};

module.exports.setSendInterval = function (interval) {
  interval = interval * MINUTE || defaultSendInterval;
  // send current browsing and tracking to dropbox

  sendRecentAndAnalyze();
  
  setInterval(sendRecentAndAnalyze, interval)
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
  }, defaultDelay)
}




