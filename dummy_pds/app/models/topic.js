var mongoose = require('mongoose')
  , annotate = App.middleware('addSystemProperties')

var schema = mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
, topic : String
, count : Number  
},{
  collection: 'topic'    
})

annotate(schema)

var Model  = mongoose.model('topic',  schema)

module.exports = Model
