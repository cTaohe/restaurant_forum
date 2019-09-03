const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const pageLimit = 10

const {pageInfo, getPagination} = require('../middleware/middleware.js')

const adminController = {
  getRestaurants: async (req, res, callback) => {
    try {
      const { page, limiting } = await pageInfo(pageLimit, req.query.page)
      const restaurants = await Restaurant.findAndCountAll(limiting)
      const {totalPage, prev, next} = await getPagination(restaurants.count, pageLimit, page)
      callback({ restaurants, page, totalPage, prev, next })
    } catch (e) {
      console.log(e)
    }
  },

  // admin get restaurant
  getRestaurant: async (req, res, callback) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.id, {include: [Category] })
      callback({restaurant})
    } catch(e) {
      console.log(e)
    }
  },
}

module.exports = adminController