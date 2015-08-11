function attachAuthStatus(req,res,next) {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
}

module.exports = attachAuthStatus
