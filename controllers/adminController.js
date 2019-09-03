const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Op = require('sequelize').Op
const Category = db.Category

const adminService = require('../services/adminServices.js')

let pageLimit = 10

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
   },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant
        })
      })
    })
  },

  putRestaurant: (req, res) => {
    if(!req.body.name){
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
  
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      })
    }
    else
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  },
  
  editUsers: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    return User.findAndCountAll({ where:{ email: { [Op.ne]: 'root@example.com' } }, offset: offset, limit: pageLimit }).then(users => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil( users.count / pageLimit )
      let totalPage = Array.from({length: pages}).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page -1
      let next = page + 1 > pages ? pages : page + 1
      console.log(users)
      return res.render('admin/users', { users, page, totalPage, prev, next })
    })
  },

  putUsers: (req, res) => {
    User.findByPk(req.params.id)
    .then(user => {
      if (!user) {
        req.flash('error_messages', 'user is not exist')
        return res.redirect('/admin/users')
      }

      if (req.user.id === user.id) {
        req.flash('error_messages', "This action is not allowed")
        return res.redirect('/admin/users')
      }

      user.update({isAdmin: !user.isAdmin})
      .then(user => {
        const text = (user.isAdmin)? 'Admin' : 'User'
        req.flash('success_messages', `${user.name} was successfully to update to ${text}`)
        res.redirect('/admin/users')
      })
    })
  }
}
module.exports = adminController