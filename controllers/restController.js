const restServices = require('../services/restServices.js')

let restController = {
  getRestaurants: (req, res) => {
    restServices.getRestaurants(req, res, (data) => {
      return res.render('restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    restServices.getRestaurant(req, res, (data) => {
      return res.render('restaurant', data)
    })
  },

  getDashboard: (req, res) => {
    restServices.getDashboard(req, res, (data) => {
      return res.render('dashboard', data)
    })
  },

  getFeeds: (req, res) => {
    restServices.getFeeds(req, res, (data) => {
      return res.render('feeds', data)
    })
  },

  getTopRestaurant: async (req, res) => {
    restServices.getTopRestaurant(req, res, (data) => {
      return res.render('topRestaurant', data)
    })
  }
}
module.exports = restController