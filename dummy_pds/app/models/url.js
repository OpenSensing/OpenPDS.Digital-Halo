var mongoose = require('mongoose')

var schema = mongoose.Schema({
  userID    : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  url       : String,
  accessedAt: Number,
  processed : Boolean
},{
  collection: 'url'
})
var Model = mongoose.model('url', schema)

module.exports = Model
