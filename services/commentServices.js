const db = require('../models')
const Comment = db.Comment

let commentController = {
  postComment: async (req, res, callback) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      callback({status: 'success', message: 'success comment'})
    } catch (e) {
      console.log(e)
    }
  },

  deleteComment: async (req, res, callback) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      if (comment) {
        comment.destroy()
        callback({status: 'success', message: 'success delete'})
      } else {
        callback({status: 'error', message: 'not exist'})
      }
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = commentController