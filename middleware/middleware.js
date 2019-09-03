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
  },

  pageInfo: (pageLimit, pageNumber = 1) => {
    const page = parseInt(pageNumber)
    const limiting = { offset: pageLimit * (page - 1), limit: pageLimit }
    return { page, limiting }
  },

  getPagination: (count, pageLimit, page) => {
    let pages =  Math.ceil(count / pageLimit)
    let totalPage = Array.from({ length: pages }, (item, index) => index + 1)
    let prev = page - 1 < 1 ? 1 : page - 1
    let next = page + 1 > pages ? pages : page + 1
    return {totalPage, prev, next}
  }
}
module.exports = middleware