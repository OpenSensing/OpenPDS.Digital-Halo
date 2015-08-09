function signIn(req,res) {
  res.render('session/signIn', {Title: 'Welcome to your Haslo visualiztion'})
}

var User = App.model('user')
function create(req,res) {
  User.findByEmailAndPassword(req.body.email, req.body.password, function(err,user) {
    if (err) return res.status(422).send('Problem while signing in: ' + err)
    if (!user) return res.status(401).send('Email and Password combination not found') 

    res.status(200).send('Welcome ' + req.body.email)
  })
}

exports.signIn = signIn
exports.create = create
