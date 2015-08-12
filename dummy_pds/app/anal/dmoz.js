var childProcess = require('child_process')

function getDmozTopic () {
    var python = childProcess.exec('python ' + App.appPath('public/anal/get_dmoz_topic.py ' + App.mongoUrl + ' '  + App.dbName), function (err) {
        if (err) return console.log(err)  });
    python.on('exit', function (code) {
       console.log('child python process: compute_halo finished with response: '+code);
    });
}

module.exports = getDmozTopic

