const adminService = require('../../services/adminServices')

const categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  postCategory: (req, res) => {
    adminService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
}
module.exports = categoryController