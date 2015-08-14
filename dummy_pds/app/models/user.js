var mongoose = require('mongoose')
  , validate = require('mongoose-validate')
  , bcrypt   = require('bcrypt')
  , annotate = App.middleware('addSystemProperties')
  , SALT_WORK_FACTOR = 10
  , MIN_PASSWD_LENGTH = 7

function passwordValidator (pass) {
  return pass.length >= MIN_PASSWD_LENGTH
} 

var schema = mongoose.Schema({
  email       : {type: String, unique: true, required: true, validate: [validate.email, 'invalid email address']},
  passwordHash: {type: String, required: true, validate: [passwordValidator, 'password to short']}
})

schema.pre('save', function (next) {
  var self = this

  if (!self.isModified('passwordHash')) return next()

  bcrypt.hash(self.passwordHash, SALT_WORK_FACTOR, function(err, hash) {
    if (err) {
      console.log(err)
      return next(err)
    }
    self.passwordHash = hash
    next()
  }) 
})

schema.statics.findByEmailAndPassword = function findByEmailAndPassword(email,passwd,cb) {
  Model.findOne({email: email}, function (err,user) {
    if (err) return cb(err)
    if (!user) return cb()

    bcrypt.compare(passwd, user.passwordHash, function (err, match) {
      return cb(err, match ? user : null)
    })
  })
}

annotate(schema)

var Model = mongoose.model('user', schema)

module.exports = Model
