var mongoose = require('mongoose')

var schema = mongoose.Schema({
  userID    : Number,
  url       : String,
  accessedAt: Number,
  processed : Boolean
},{
  collection: 'url'
})
var Model = mongoose.model('url', schema)

module.exports = Model
