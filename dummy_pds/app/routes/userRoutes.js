var User = App.model('user')

function signUp(req, res) {
  res.render('user/signUp', {title: 'So you want to see what THEY can see about you.'})
}

function create(req, res) {
  var u = new User({email: req.body.email, passwordHash: req.body.password})
  
  u.save(function(err){ 
    if (err) return res.status(422).send('Error while creating user: ' + err)
   
    res.status(200).send('Welcome! You are going to see your Halo soon!')
  }) 
}

exports.signUp = signUp
exports.create = create
