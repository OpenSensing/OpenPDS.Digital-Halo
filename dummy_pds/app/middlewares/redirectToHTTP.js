function redirectToHTTP (req, res, next) {
  if (req.secure) {
    return res.redirect('http://' + req.get('host') + req.url)
  }
  next()
}

module.exports = redirectToHTTP
