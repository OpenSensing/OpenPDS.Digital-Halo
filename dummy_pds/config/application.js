var env          = process.env.NODE_ENV || 'development'
  , packageJson  = require('../package')
  , express      = require('express')
  , path         = require('path')
  , bodyParser   = require('body-parser')
  , logger       = require('morgan')
  , childProcess = require('child_process')
  , stylus       = require('stylus')
  , nib          = require('nib')


console.log("Loading Digital Halo Server (PDS mockup) version " + packageJson.version + " in " + env + " mode" )

global.App = {
  app: express()
, port: process.env.PORT || 8000
, version: packageJson.version
, root: path.join(__dirname, '..')
, mongoUrl: (process.env.MONGODB_URL || 'mongodb://localhost:27017/')
, dbName: 'digitalHalo_' + env
, appPath: function(path)  {
    return this.root + '/' + path
  }
, require: function (path)  {
    return require(this.appPath(path))	   
  }
, env: env
, start: function ()  {
    if (!this.started)  {
      this.started = true
      this.app.listen(this.port)
      console.log('Running Halo Server ver ' + this.version + ' on port ' + this.port + ' in ' + this.env + ' mode.')      
    }
  }    
, route: function (path) {
    return this.require('app/routes/' + path)
  }
, model: function (path) {
    return this.require('app/models/' + path)
  }
, anal: function (path)  {
    return this.require('app/anal/' + path)
  }
, command: function (path) {
    return this.require('app/commands/' + path)
  }
, middleware: function (path) {
    return this.require('app/middlewares/' + path)
  }
}

// Set up views and styles engine

function compile (str, path)  {
  return stylus(str)
    .set('filename', path)
    .use(nib())
} 

App.app.set('views', App.appPath('app/views'))
App.app.set('view engine', 'jade')
App.app.use(stylus.middleware(
  {src: App.appPath('public/stylesheets'),
   compile: compile}      
))

//  Register Middleware

App.app.use(logger(':method :url :req[content-type]'))
App.app.use(bodyParser.json())
App.app.use(bodyParser.urlencoded())
App.app.use(require('cookie-parser')())
App.app.use(require('cookie-session')({secret: 'A secret', key: 'session', maxAge: 1440000000}))
App.require('config/initializers/passport.js')()
App.app.use(require('connect-flash')())
App.app.use(App.middleware('attachAuthStatus'))
App.app.use(App.middleware('setFlash'))
App.app.use(express.static(App.appPath('public')))

// DB bootstrap

App.require('config/database')(App.mongoUrl + App.dbName)

// Routes

App.require('config/routes')(App.app)

// Load exec schedule

App.require('config/schedule')



App.app.use(function(err, req, res, next) {
     res.status(err.status || 500)
     res.send('error message: ' + err.message + '\n' + err);
});
