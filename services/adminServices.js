const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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

  postRestaurant: (req, res, callback) => {
    if(!req.body.name){
      callback({status: 'error', message: "name didn't exist"})
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
          callback({status: 'success', message: 'restaurant was successfully created'})
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
        callback({status: 'success', message: 'restaurant was successfully created'})
      })
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

  // admin get category
  getCategories: async (req, res, callback) => {
    try {
      const { page , limiting } = await pageInfo(pageLimit, req.query.page)
      const categories = await Category.findAndCountAll(limiting)
      const {totalPage, prev, next} = await getPagination(categories.count, pageLimit, page)
      const category = await Category.findByPk(req.params.id)
      if(req.params.id) {
        callback({ categories, category, page, totalPage, prev, next })
      } else {
        callback({ categories, page, totalPage, prev, next })
      }
    } catch (e) {
      console.log(e)
    }
  },

  deleteRestaurant: async (req, ers, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      restaurant.destroy().then((restaurant) => {
        callback({ status: 'success', message: '' })
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController