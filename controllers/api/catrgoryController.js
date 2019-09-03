const adminService = require('../../services/adminServices')

const categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = categoryController