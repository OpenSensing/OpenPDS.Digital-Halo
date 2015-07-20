var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , express = require('express')
  , bodyParser = require('body-parser')
  , MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var pds = express()
  , mongoUrl = 'mongodb://localhost:27017/dummy-pds';


// Route handlers  

function saveData (req, res) {
    MongoClient.connect(mongoUrl, function (err, db) {
	if (err) return console.log ("can't connect to Mongo: "+err)
//        assert.equal(null,err, 'Unable to connect to mongo: '+ err)
	console.log("Connected to mongo");
        
        insertToMongo(db, {userID: 1, url: req.body.sentUrl}, function () {
            db.close()   
	})
    });

    res.send('<h1>url saved<h1>');
    
}

function insertToMongo (db, data, callback)  {
    
    var collection = db.collection('url');
    collection.insert(
      data, 
      function (err, result) {
          if (err) return console.log('Unable to insert to mongo: '+ err)
          console.log('Inserted sent url: '+ data.url);
	  callback(result)
      });
}
// Register Middleware

pds.use(bodyParser.json());

// Routing
//
pds.get("/:id", function (req,res) {res.send({answer : "What do you want?"})});
pds.post("/", saveData)

pds.listen(8000)
