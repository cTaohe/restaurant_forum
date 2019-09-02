const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const pageLimit = 10

const adminController = {
  getRestaurants: (req, res, callback) => {
    let offset = 0

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    
    return Restaurant.findAndCountAll({offset: offset, limit: pageLimit}).then(restaurants => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(restaurants.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1 )
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page +1 > pages ? pages : page + 1

      callback({ restaurants: restaurants, page, totalPage, prev, next })
    })
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