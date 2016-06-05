// flash helper

function showFlashMessage (type, message) {
  if ((type != 'success') && (type != 'failure')) throw 'Wrong flash message type, can only be "success" or "failure"'

  $('#flash_container').append( '<div class="flash ' + type + '" id="flashNote">' + message + '</div>')
  // remove the notivification after 7 seconds
  setTimeout(function(){$('#flashNote').remove()}, 7000)
}


// button calbacks




// Presentation functions
function presentResultsAsList (results) {
  for (group in results) {
    if (group != 'createdAt') {
        var new_li = document.createElement('li');
        document.querySelector('#demographics-ul').appendChild(new_li);
        new_li.innerHTML = group + '\t' + results[group][0]
    } 
  }
}

function presentResultsAsTable (results){
  for (group in results) {
    if (group != 'createdAt') {
      category    = results[group][0]
      probability = results[group][1].toFixed(3)
      rowHTML  = '<tr><td>'+group+'</td><td>'+category+'</td><td>'+probability+'</td></tr>'
      $('#demographics-table').append(rowHTML);
      $('#demographics-table').append('<tr><td><progress value='+probability+' max=1></progress></td><tr>')
    } 
  }
}


//Dropbox inout


function readDemographics () {
  var demoFile = 'res_per_tracker_details.json'
  readFromDropbox(demoFile, function showDemographics(demographics) { 
      demographics = deserialize(demographics); 
      totals = demographics['total'];

      //initial render of totals
      updateBarcharts('total', totals);




      var trackerList = ['total'];
      for (trackerName in demographics) {
        if (demographics[trackerName] != 'No data available in model') {
          trackerList.push(trackerName);
        }
      };

      d3.select('#cookies-container').selectAll('.leaf')
        .filter(function (d) {return (trackerList.indexOf(d.name) > -1)})
        .on('click', function (d) {updateBarcharts(d.name, demographics[d.name])})
    })

  var demoPerCompanyFile = 'res_per_company_details.json'
    readFromDropbox(demoPerCompanyFile, function showDemographics(demographics) { 
      demographics = deserialize(demographics); 

      var companyList = [];
      for (companyName in demographics) {
        if (demographics[companyName] != 'No data available in model') {
          companyList.push(companyName);
        }
      };

      d3.select('#cookies-container').selectAll('.node:not(.leaf):not(.root)')
        .filter(function (d) {return (companyList.indexOf(d.name) > -1)})
        .on('click', function (d) {updateBarcharts(d.name, demographics[d.name])})


/*        var trackerLinks = d3.select('#cookies-container').selectAll('p')
          .data(trackerList)
          .enter().append('p')
          .html(function (d) {return d})
          .on('click', function (d) { updateBarcharts(d, demographics[d])});
*/
    })
}

function readTrackerCounts () {
  readFromDropbox('tracker_counts.json', function (data) {
    data = deserialize(data);
    packFeed = {name: 'Tracking Companies', 'children': []};

    var min_count = 50; 
    for (i in data) {
      if (data[i].count >= min_count) packFeed['children'].push(data[i])   // trim out small tracking companies
       
    }

    showCookieJar(packFeed, readDemographics)
})
}
/*


function sendRecent () {
  // get the overall count of recorded visits
  chrome.storage.local.get('recordedCount', function (items) {
    // check if anything got recorded, if not then return
    if (!items.recordedCount) return alert('No current history stored, nothing sent')

    // get recent history file count to append to file name
    readFromDropbox('config.json', function (config) {
      config = deserialize(config)
      config.raw_data.currentHistoryAndTrackers.file_count++
      var fileName = 'currentHistory/currentHistoryAndTrackers' + (config.raw_data.currentHistoryAndTrackers.file_count) + '.json'
       
      var count = items.recordedCount;
      // create pointer Array
      var pagePointers = []
      for (var i = 1; i <= count; i++) {
        pagePointers.push('page' + i)
      } 
      // get the pages from storage and send them
      chrome.storage.local.get(pagePointers, function (data) {
        // merge the pages into a single json array
        var payload = [];
        for (page in data) {
          payload.push(data[page])
        } 
        // send it
        writeDropbox(payload, fileName)
        console.log('sent recent history and trackers to Dropbox')
        // clear the pages from local storage and reset the counter
        chrome.storage.local.remove(pagePointers)
        chrome.storage.local.set({'recordedCount': 0}) 
      }) 
      writeDropbox(config, 'config.json')
    })
  })
}
*/
function openPDS (e) {
  chrome.runtime.sendNativeMessage("dk.dtu.openpds", {'content' : 'no message, just open app.'})
}

// register 
$('document').ready(function (e) {
  $('#log_in').click(authenticateWithDropbox) ;
  $('#log_out').click(signOutOfDropbox);
 
  //document.querySelector('#sendSDK').addEventListener('click', writeHistory)//writeDropbox)
  //document.querySelector('#showAnswer').addEventListener('click', read$)
  //document.querySelector('nav').classList.add('move')
  //document.querySelector('#sendRecent').addEventListener('click', sendRecent)
  $('#meetMonsters').click(readTrackerCounts);
  $('#openYourPDS').click(openPDS);
  $(".button-collapse").sideNav({edge: 'right'});
  $('#mobile-log_in').on('click', authenticateWithDropbox);
  $('#mobile-log_out').on('click', signOutOfDropbox);
})
