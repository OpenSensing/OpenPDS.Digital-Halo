var Url   = App.model('url')
var Topic = App.model('topic')

var userId = 1                     // A placeholder for user id

exports.store = function (req, res)  {
  var url = new Url({ 
    userID    : userId                    // Placeholder for user id
  , url       : req.body.sentUrl
  , accessedAt: 123456789
  })
  url.save(function (err)  {
    if (err) return res.status(422).send('Problem saving the url: ', err.message)
    
    console.log('Url ' + req.body.sentUrl + '\n saved to Mongo')
    res.send('Url saved to Mongo')
  })
}

exports.send = function (req, res)  {
  Topic.
    find({userID: userId}).
    exec(function (err, records) {
      if (err) return res.status(422).send('Error while retreiving from Mongoose :', err.message)

      res.header('Content-Type', 'application/json')
      res.send(records)
    })
} 
