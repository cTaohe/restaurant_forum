let middleware = {
  isUser: (req, res, next) => {
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', '無權編輯此 profile')
      return res.redirect(`/users/${req.params.id}`)
    }
    next()
  },

  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    return res.redirect('/signin')
  },
  
  authenticatedAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
}
module.exports = middleware