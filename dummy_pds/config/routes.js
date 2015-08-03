module.exports = function (app)  {
  var dataRoutes = App.route('dataRoutes')
  app.post('/', dataRoutes.store)
  app.get('/', dataRoutes.send)

  var vizRoutes = App.route('vizRoutes')
  app.get('/showHalo', vizRoutes.show)
}
