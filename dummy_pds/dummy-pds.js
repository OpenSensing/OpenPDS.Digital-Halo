var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(saveData)
function saveData (req, res) {
    if (req.method !== "GET") return console.log("terminatin - not a GET request")
    
    
    fs.appendFileSync("./data/url-log.txt", req.url + '\n');
    console.log('requeted URL logged: ' + req.url)
    res.write('<h1>url saved<h1>')
    
}

server.listen(8000)
