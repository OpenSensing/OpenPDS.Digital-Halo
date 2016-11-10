require('../../node_modules/materialize-css/dist/css/materialize.css');
require('../../style/stylesheet.css');

var d3              = require('d3')
  , materialize     = require('materialize-css')
    ,showCookieJar  = require('./cookiesViz')
  , updateBarcharts = require('./demobarsViz');


// flash helper

function showFlashMessage (type, message) {
    if ((type != 'success') && (type != 'failure')) throw 'Wrong flash message type, can only be "success" or "failure"'

    $('#flash_container').append( '<div class="flash ' + type + '" id="flashNote">' + message + '</div>')
    // remove the notivification after 7 seconds
    setTimeout(function(){$('#flashNote').remove()}, 7000)
}


//Dropbox inout


function deserialize (obj) {
    return typeof(obj) == 'string' ? JSON.parse(obj) : obj
};

function readDemographics () {
    var demoFile = 'res_per_tracker_details.json'
    Halo.client.readFile(demoFile, function showDemographics(err, demographics) {
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
    Halo.client.readFile(demoPerCompanyFile, function showDemographics(err, demographics) {
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
    Halo.client.readFile('tracker_counts.json', function (err, data) {
        data = deserialize(data);
        const packFeed = {name: 'Tracking Companies', 'children': []};
/*
        var min_count = 50;
        for (var i in data) {
            if (data[i].count >= min_count) packFeed['children'].push(data[i])   // trim out small tracking companies
        }
*/
        var cutoff;
        data.length < 50 ? cutoff = data.length : cutoff = 50;

        for (let i=0; i<cutoff; i++) {
            packFeed['children'].push(data[i])
        }



        showCookieJar(packFeed, readDemographics)
    })
}

function openPDS (e) {
    chrome.runtime.sendNativeMessage("dk.dtu.openpds", {'content' : 'no message, just open app.'})
}

// register
module.exports = function () {
    $('document').ready(function (e) {
        $('#log_in').click(Halo.client.authenticate);
        //$('#log_out').click(Halo.client.signOff);
        $('#log_out').click(()=>{chrome.tabs.getCurrent((t)=>{chrome.tabs.remove(t.id)})});
        $('#meetMonsters').click(readTrackerCounts);
        $('#openYourPDS').click(openPDS);
        $(".button-collapse").sideNav({edge: 'right'});
        $('#mobile-log_in').on('click', Halo.client.authenticate);
        $('#mobile-log_out').on('click', Halo.client.signOut);
    })
}
