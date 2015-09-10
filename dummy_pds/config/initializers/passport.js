var User = App.model('user')

function init() {
  var passport              = require('passport')
    , OpenIDConnectStrategy = require('passport-openidconnect').Strategy
    , PDSOpenIDConnectStrategy = new OpenIDConnectStrategy ({
          authorizationURL: 'http://dev.sensible.dtu.dk:9091/oauth/authorize'
        , tokenURL        : 'http://dev.sensible.dtu.dk:9091/oauth/token'
        , clientID        : '80d57d3b95a32dbbe2e53a2e7e4c4325'
        , clientSecret    : '03a5a086b396b6af84f21694d871110e'
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
              u.save(function (err, u){
                if (err) return console.log('While creating user ' + err)
              
                return cb(null, u)
              })
            } else {
	      cb(null, user)	  
            }
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
