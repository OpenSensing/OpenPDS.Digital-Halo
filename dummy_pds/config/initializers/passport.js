var User = App.model('user')

function init() {
  var passport              = require('passport')
    , OpenIDConnectStrategy = require('passport-openidconnect').Strategy
    , PDSOpenIDConnectStrategy = new OpenIDConnectStrategy ({
      authorizationURL: 'http://dev.sensible.dtu.dk:9091/oauth/authorize'
        , tokenURL        : 'http://dev.sensible.dtu.dk:9091/oauth/token'
        , clientID        : 'ae4c7cf88783336eaa66e38427bb151d'
        , clientSecret    : 'd0e313a1cb69401284524b910180dc56'
        , callbackURL     : 'http://dev.sensible.dtu.dk:9090/auth/provider/callback'
        , userInfoURL     : 'http://dev.sensible.dtu.dk:9091/oauth/userInfo'
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
