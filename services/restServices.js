const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10
const sequelize = require('sequelize')
const { pageInfo, getPagination } = require('../middleware/middleware.js')

let restController = {
  getRestaurants: async (req, res, callback) => {
    try {
      let whereQuery = {}
      let categoryId = ''
      if (req.query.categoryId) {
        categoryId = Number(req.query.categoryId)
        whereQuery['categoryId'] = categoryId
      }
      const { page, limiting } = await pageInfo(pageLimit, req.query.page)
      const restaurants = await Restaurant.findAndCountAll(limiting)
      const { totalPage, prev, next } = await getPagination(restaurants.count, pageLimit, page)
      const data = restaurants.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      const categories = await Category.findAll()
      callback({ restaurants: data, categories, categoryId, page, totalPage, prev, next })
    } catch (e) {
      console.log(e)
    }
  },

  getRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      restaurant.increment('viewCounts', { by: 1 })
      callback({restaurant, isFavorited})
    } catch (e) {
      console.log(e)
    }
  },

  getDashboard: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, Comment, { model: User, as: 'FavoritedUsers' }]
      })
      callback({restaurant})
    } catch (e) {
      console.log(e)
    }
  },

  getFeeds: async (req, res, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category]
      })
      const comments = await Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })

      callback({restaurants, comments})
    } catch (e) {
      console.log(e)
    }
  },

  getTopRestaurant: async (req, res, callback) => {
    try {
      let attributeQuery = ''
      let orderQuery = ''
      // 根據環境切換
      if (process.env.heroku) {
        attributeQuery = '(SELECT COUNT(*) FROM "Favorites" WHERE "Favorites"."RestaurantId" = "Restaurant"."id")'
        orderQuery = '"FavoritedCount" DESC'
      } else {
        attributeQuery = '(SELECT COUNT(*) FROM Favorites WHERE Favorites.RestaurantId = Restaurant.id)'
        orderQuery = 'FavoritedCount DESC'
      }

      let restaurants = await Restaurant.findAll({
        attributes: [
          [sequelize.literal(attributeQuery), 'FavoritedCount'],
          'name',
          'description',
          'image',
          'id'
        ],
        order: sequelize.literal(orderQuery),
        limit: 10
      })
      restaurants = await restaurants.map(r => ({
        ...r.dataValues,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        description: r.dataValues.description.substring(0, 50)
      }))
      let topRestaurants = await restaurants.filter(restaurant => restaurant.FavoritedCount > 0)

      callback({ topRestaurants })
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = restController