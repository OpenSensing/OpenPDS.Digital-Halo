var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , express = require('express')
  , bodyParser = require('body-parser')
  , pds = express()

pds.use(bodyParser.json());
//pds.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//      extended: true
//}));

function saveData (req, res) {
    fs.appendFileSync("./data/url-log.txt", "POST "+ req.body.sentUrl + '\n');
    console.log('requested URL logged: ' + req.body.sentUrl)
    res.send('<h1>url saved<h1>')
}

pds.get("/:id", function (req,res) {res.send({answer : "What do you want?"})});
pds.post("/", saveData)

pds.listen(8000)
