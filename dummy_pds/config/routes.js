module.exports = function (app)  {
  var dataRoutes = App.route('dataRoutes')
  app.post('/', dataRoutes.store)
  app.get('/', dataRoutes.send)

  var vizRoutes = App.route('vizRoutes')
  app.get('/showHalo', vizRoutes.show)

  var userRoutes = App.route('userRoutes')
  app.get('/signUp', userRoutes.signUp)
  app.post('/createUser', userRoutes.create )
}
