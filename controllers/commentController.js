const commentServices = require('../services/commentServices.js')

let commentController = {
  postComment: (req, res) => {
    commentServices.postComment(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      }
    })
  },

  deleteComment: (req, res) => {
    commentServices.deleteComment(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('back')
      }
    })
  }
}
module.exports = commentController