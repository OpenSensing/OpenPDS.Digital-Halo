var mongoose = require('mongoose')

function connect (connectionString) {
  mongoose.connect(connectionString)
  
  var db = mongoose.connection
  db.on('error', console.error.bind(console, 'Mongoose connection error at: ' + connectionString))
  db.once('open', function () {
    console.log('Mongoose connected at: ', connectionString) 
  })  
}

module.exports = connect
