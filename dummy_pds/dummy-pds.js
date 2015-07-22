var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , express = require('express')
  , bodyParser = require('body-parser')
  , MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var pds = express()
  , mongoUrl = 'mongodb://localhost:27017/dummy-pds';

var userId = 1;


// Route handlers  

function saveData (req, res) {
    MongoClient.connect(mongoUrl, function (err, db) {
	if (err) return console.log ("can't connect to Mongo: "+err)
//        assert.equal(null,err, 'Unable to connect to mongo: '+ err)
	console.log("Connected to mongo");
        insertToMongo(db, {userID: userId, url: req.body.sentUrl}, function () {
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

function sendHalo (req, res)  {
    MongoClient.connect(mongoUrl, function (err,db) {
        if (err) return console.log ("can't connect to Mongo: "+ err)
        console.log("Conencted to mongo");
        readFromMongo (db, {userID: userId}, function (result) {
//	    res.header('Content-Type', 'application/json');
	    res.send(result[0]); 
	    db.close()   
	})
    })
}

function readFromMongo (db, data, callback)  {
    var collection = db.collection('halo');
    collection.find(data).toArray( function (err, result)  {
           if (err) return console.log ("can't read from Mongo: "+ err)
           console.log("read succesful for: "+data.userID);
           callback(result)    
       }
    )
}

// Register Middleware

pds.use(bodyParser.json());


// Routing
//
pds.get("/", sendHalo);
pds.post("/", saveData)

pds.listen(8000)
