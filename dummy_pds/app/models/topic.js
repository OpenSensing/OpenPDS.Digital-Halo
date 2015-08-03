var mongoose = require('mongoose')

var schema = mongoose.Schema({
  userID: Number
, topic : String
, count : Number  
},{
  collection: 'topic'    
})

var Model  = mongoose.model('topic',  schema)

module.exports = Model
