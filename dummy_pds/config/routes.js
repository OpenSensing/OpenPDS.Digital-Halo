var passport = require('passport')

module.exports = function (app)  {
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
  app.get('/signIn', sessionRoutes.signIn)
  app.post('/signIn', passport.authenticate('local', {successRedirect: '/app/showHalo', failureRedirect: '/signIn', failureFlash: 'Invalid username or password'}))
  app.get('/signOut', sessionRoutes.destroy)
}
