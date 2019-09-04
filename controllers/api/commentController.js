const commentServices = require('../../services/commentServices.js')

const commentController = {
  postComment: (req, res) => {
    commentServices.postComment(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteComment: (req, res) => {
    commentServices.deleteComment(req, res, (data) => {
      console.log(data)
      return res.json(data)
    })
  },
}

module.exports = commentController