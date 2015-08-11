function ensureAuthenticated (req,res,next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('error', 'You must be logged in to perform that action')
    res.redirect('/signIn')
  }
}

module.exports = ensureAuthenticated
