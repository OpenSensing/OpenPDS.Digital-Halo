var passport = require('passport')

module.exports = function (app)  {
  // General Routes
  app.get('/about', function (req,res) {res.redirect('http://www.digitalhalo.org')})

  var dataRoutes = App.route('dataRoutes')
  app.post('/', dataRoutes.store)
  app.get('/', dataRoutes.send)

  // Ensure authenticated
  app.all('/app/*', App.middleware('ensureAuthenticated'))

  var vizRoutes = App.route('vizRoutes')
  app.get('/app/showHalo', vizRoutes.show)

  var userRoutes = App.route('userRoutes')
  app.get('/signUp', userRoutes.signUp)
  app.post('/signUp', userRoutes.create )

  var sessionRoutes = App.route('sessionRoutes')
  //app.get('/signIn', sessionRoutes.signIn)
  app.get('/signIn', function (req,res) {res.redirect('/auth/provider')})
  //app.post('/signIn', passport.authenticate('local', {successRedirect: '/app/showHalo', failureRedirect: '/signIn', failureFlash: 'Invalid username or password'}))
  app.get('/auth/provider', passport.authenticate('provider'))
  //app.get('/auth/provider/callback', passport.authenticate('provider'))
  app.get('/auth/provider/callback', passport.authenticate('provider', {successRedirect: '/app/showHalo', failureRedirect: '/about'}))
  app.get('/signOut', sessionRoutes.destroy)
}
