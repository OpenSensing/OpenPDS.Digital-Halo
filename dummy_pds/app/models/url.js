var mongoose = require('mongoose')

var schema = mongoose.Schema({
  userID    : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  url       : String,
  title     : String,
  accessedAt: Date,
  processed : Boolean
},{
  collection: 'url'
})
var Model = mongoose.model('url', schema)

module.exports = Model
