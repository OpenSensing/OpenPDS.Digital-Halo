var User = App.model('user')

function init() {
  var passport              = require('passport')
    , OpenIDConnectStrategy = require('passport-openidconnect').Strategy
    , PDSOpenIDConnectStrategy = new OpenIDConnectStrategy ({
          authorizationURL: 'http://localhost:3000/oauth/authorize'
        , tokenURL        : 'http://localhost:3000/oauth/token'
        , clientID        : 'df4012ec3bffefd3e14cff0a4a734266'
        , clientSecret    : '5d002be253376792bbbff204a9fccb36'
        , callbackURL     : 'http://localhost:8000/auth/provider/callback'
        , userInfoURL     : 'http://localhost:3000/oauth/userInfo'
        , scope           : 'profile|email'
        },
      function (accessToken, refreshToken, profile, cb) {
        //process.nextTick(function() {
          App.model('user').findOne({'email': profile._json.email}, function (err, user) {
            if (err) return cb(err, null)
            if (!user) {
              var u = new User({email: profile._json.email, passwordHash: null})
              u.save(function (err){if (err) return console.log('While creating user ' + err)})
            }

	          cb(null, user)	  
	        })  
	      //})
      } 
    )
    , serializeUser   = App.command('serializeUser')()
    , deserializeUser = App.command('deserializeUser')()
  
  passport.use('provider', PDSOpenIDConnectStrategy)
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  App.app.use(passport.initialize())
  App.app.use(passport.session())      
}

module.exports = init
