var Topic    = App.model('topic')
  , mongoose = require('mongoose')

exports.show= function (req, res)  {

  Topic.
    find({userID: req.user.id}).
    exec(function (err, records) {
      if (err) return res.status(422).send('Error while retreiving from Mongoose :', err.message)
      records.map(function (el, i)  { el.topic = el.topic.split('/').slice(2,4).join('/'); return el})
      res.render('index',
	         {title: 'Halo!',
       	          topics: records
                 }
      )
    })
}
