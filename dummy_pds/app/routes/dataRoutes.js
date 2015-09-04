var mongoose = require('mongoose')
  , Url      = App.model('url')
  , Topic    = App.model('topic')


//var userId = 1                     // A placeholder for user id

exports.store = function (req, res)  {
  var url = new Url({ 
    userID      : mongoose.Types.ObjectId(req.user.id)                   // Placeholder for user id
  , url         : req.body.sentUrl
  , title       : req.body.sentTitle
  })
  url.save(function (err)  {
    if (err) return res.status(422).send('Problem saving the url: ', err.message)
    
    console.log('Url ' + req.body.sentUrl + '\n saved to Mongo')
    res.send('Url saved to Mongo')
  })
}

exports.send = function (req, res)  {
  Topic.
    find({userID: mongoose.Types.ObjectId(req.user.id) }).
    exec(function (err, records) {
      if (err) return res.status(422).send('Error while retreiving from Mongoose :', err.message)

      res.header('Content-Type', 'application/json')
      res.send(records)
    })
} 
