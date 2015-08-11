function signIn(req,res) {
  res.render('session/signIn', {Title: 'Welcome to your Haslo visualiztion'})
}

function destroy(req,res) {
  req.logout()
  req.flash('notice', 'You have successfuly logged out.')
  res.redirect('/signIn')
}

exports.signIn = signIn
exports.destroy = destroy
