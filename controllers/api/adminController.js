const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../../services/adminServices.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = adminController