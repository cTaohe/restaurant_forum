const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurant => {
      return res.render('admin/restaurants', {restaurant: restaurant})
    })
  }
}
module.exports = adminController