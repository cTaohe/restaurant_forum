const restServices = require('../../services/restServices')

const restController = {
  getRestaurants: (req, res) => {
    restServices.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    restServices.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  getDashboard: (req, res) => {
    restServices.getDashboard(req, res, (data) => {
      return res.json(data)
    })
  },

  getFeeds: (req, res) => {
    restServices.getFeeds(req, res, (data) => {
      return res.json(data)
    })
  },

  getTopRestaurant: async (req, res) => {
    restServices.getTopRestaurant(req, res, (data) => {
      return res.json(data)
    })
  }


}

module.exports = restController