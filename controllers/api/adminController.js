const adminService = require('../../services/adminServices.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  
  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  putRestaurtant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      res.json(data)
    })
  },

  editUsers: (req, res) => {
    adminService.editUsers(req, res, (data) => {
      res.json(data)
    })
  },

  putUsers: (req, res) => {
    adminService.putUsers(req, res, (data) => {
      res.json(data)
    })
  },

}

module.exports = adminController