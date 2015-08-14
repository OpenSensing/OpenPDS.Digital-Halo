var mongoose = require('mongoose')

function addSystemProps (schema) {
  schema.add({
    createdAt : Date,
    accessedAt: Date,
    modifiedAt: Date 
  })
  
  var now = new Date()
  schema.pre('save', function(next) {
    if (!this.createdAt) this.createdAt = now
    this.modifiedAt = now 
    next()
  })
}

module.exports = addSystemProps
