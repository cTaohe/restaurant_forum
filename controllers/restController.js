const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite
const User = db.User
const pageLimit = 10
const sequelize = require('sequelize')

let restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))

      Category.findAll().then(categories => {
        return res.render('restaurants', { restaurants: data, categories, categoryId, page, totalPage, prev, next })
      })
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        restaurant.increment('viewCounts', { by: 1 })
        return res.render('restaurant', {
          restaurant: restaurant,
          isFavorited: isFavorited,
        })
      })
  },

  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment,
        { model: db.User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurant => {
        res.render('dashboard', { restaurant: restaurant })
      })
  },

  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },

  getTopRestaurant: async (req, res) => {
    try {
      let restaurants = await Restaurant.findAll({
        include: [{ model: db.User, as: 'FavoritedUsers' }],
        attributes: [
          'Restaurant.address',
          [sequelize.literal('(SELECT COUNT(*) FROM Favorites WHERE Favorites.RestaurantId = Restaurant.id)'), 'FavoritedCount'],
          'name',
          'description',
          'image',
          'id'
        ],
        order: [[sequelize.literal('FavoritedCount'), 'DESC']],
        limit: 10
      })

      restaurants = await restaurants.map(r => ({
        ...r.dataValues,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        description: r.dataValues.description.substring(0, 50)
      }))

      let topRestaurants = await restaurants.filter(restaurant => restaurant.FavoritedCount > 0
      ).sort((a, b) => b.FavoritedCount - a.FavoritedCount
      )
      
      return res.render('topRestaurant', { topRestaurants })
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = restController