var mongoose = require('mongoose')
  , annotate = App.middleware('addSystemProperties')

var schema = mongoose.Schema({
  userID    : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  url       : String,
  title     : String,
  processed : Boolean
},{
  collection: 'url'
})

annotate(schema)

var Model = mongoose.model('url', schema)

module.exports = Model
