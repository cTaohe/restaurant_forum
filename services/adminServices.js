const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Op = require('sequelize').Op

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const pageLimit = 10

const { pageInfo, getPagination } = require('../middleware/middleware.js')

const adminController = {
  getRestaurants: async (req, res, callback) => {
    try {
      const { page, limiting } = await pageInfo(pageLimit, req.query.page)
      const restaurants = await Restaurant.findAndCountAll(limiting)
      const { totalPage, prev, next } = await getPagination(restaurants.count, pageLimit, page)
      callback({ restaurants, page, totalPage, prev, next })
    } catch (e) {
      console.log(e)
    }
  },

  // create restaurant page 
  createRestaurant: async (req, res, callback) => {
    try {
      let categories = await Category.findAll()
      callback({ categories })
    } catch (e) {
      console.log(e)
    }
  },

  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
      })
    }
    else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },

  // admin get restaurant
  getRestaurant: async (req, res, callback) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.id, { include: [Category] })
      callback({ restaurant })
    } catch (e) {
      console.log(e)
    }
  },

  editRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      const categories = await Category.findAll()
      callback({ restaurant, categories })
    } catch (e) {
      console.log(e)
    }
  },

  //admin post restaurant
  putRestaurant: (req, res, callback) => {
    console.log(req.body)
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
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
                callback({ status: 'success', message: 'restaurant was successfully to update' })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
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
            callback({ status: 'success', message: 'restaurant was successfully to update' })
          })
      })
    }
  },

  // admin get category
  getCategories: async (req, res, callback) => {
    try {
      const { page, limiting } = await pageInfo(pageLimit, req.query.page)
      const categories = await Category.findAndCountAll(limiting)
      const { totalPage, prev, next } = await getPagination(categories.count, pageLimit, page)
      const category = await Category.findByPk(req.params.id)
      if (req.params.id) {
        callback({ categories, category, page, totalPage, prev, next })
      } else {
        callback({ categories, page, totalPage, prev, next })
      }
    } catch (e) {
      console.log(e)
    }
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.create({
        name: req.body.name
      })
        .then(category => {
          callback({ status: 'success', message: 'category was successfully created' })
        })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.findByPk(req.params.id).then(category => {
        category.update(req.body).then(category => {
          callback({ status: 'success', message: 'category was successfully updated' })
        })
      })
    }
  },

  deleteCategory: async (req, res, callback) => {
    try {
      const category = await Category.findByPk(req.params.id)
      category.destroy().then(category => {
        callback({ status: 'success', message: 'category was successfully to delete' })
      })
    } catch (e) {
      console.log(e)
    }
  },

  deleteRestaurant: async (req, ers, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      restaurant.destroy().then((restaurant) => {
        callback({ status: 'success', message: 'restaurant was successfully to delete' })
      })
    } catch (e) {
      console.log(e)
    }
  },

  editUsers: async (req, res, callback) => {
    try {
      const { page, limiting } = await pageInfo(pageLimit, req.query.page)
      const users = await User.findAndCountAll({ where: { email: { [Op.ne]: 'root@example.com' } }, limiting })
      const { totalPage, prev, next } = await getPagination(users.count, pageLimit, page)
      callback({ users, page, totalPage, prev, next })
    } catch (e) {
      console.log(e)
    }
  },

  putUsers: async (req, res, callback) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return callback({ status: 'error', message: 'user is not exist' })
      if (req.user.id === user.id) return callback({ status: 'error', message: 'This action is not allowed' })
      user.update({ isAdmin: !user.isAdmin }).then(user => {
        const text = (user.isAdmin) ? 'Admin' : 'User'
        callback({ status: 'success', message: `${user.name} was successfully to update to ${text}` })
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController