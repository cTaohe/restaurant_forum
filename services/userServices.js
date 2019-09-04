const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const userServices = {
  // user profile
  getUser: async (req, res, callback) => {
    try {
      let profile = await User.findByPk(req.params.id, {
        include: [
          { model: Comment, include: [Restaurant] },
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      profile.isFollowed = await req.user.Followings.map(d => d.id).includes(profile.id)
      const set = new Set();
      const comments = await profile.Comments.filter(item => !set.has(item.RestaurantId) ? set.add(item.RestaurantId) : false)
      callback({ profile, user: req.user, comments })
    } catch (e) {
      console.log(e)
    }
  },

  // personal profile 頁面
  editUser: async (req, res, callback) => {
    try {
      const profile = await User.findByPk(req.params.id)
      if (req.user.id !== profile.id) {
        return callback({ status: 'error', message: 'you can\'t edit this file' })
      }
      callback({ profile })
    } catch (e) {
      console.log(e)
    }
  },

  // 編輯 Profile
  putUser: (req, res, callback) => {
    // 名字空白
    if (!req.body.name) {
      return callback({ status: 'error', message: '請填寫名字' })
    }

    if (req.user.id !== Number(req.params.id)) {
      return callback({ status: 'error', message: '非本人' })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
              .then(profile => {
                callback({ status: 'success', message: 'Profile has been updated', profile })
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            image: user.image
          })
            .then(profile => {
              return callback({ status: 'success', message: 'Profile has been updated', profile })
            })
        })
    }
  },

  addFavorite: async (req, res, callback) => {
    try {
      if (!req.user) return callback({ status: 'error', message: 'not user can\'t add' })
      let favorite = await Favorite.findOne({where: {UserId: req.user.id, RestaurantId: req.params.restaurantId}})
      if (favorite) {
        callback({status: 'error', message: 'already added'})
      } else {
        await Favorite.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        })
        callback({status: 'success', message: 'success add'})
      }
    } catch (e) {
      console.log(e)
    }
  },

  removeFavorite: async (req, res, callback) => {
    try {
      if (!req.user) return callback({ status: 'error', message: 'not user can\'t add' })
      let favorite = await Favorite.findOne({where: {UserId: req.user.id, RestaurantId: req.params.restaurantId}})
      if (favorite) {
        await favorite.destroy()
        callback({status: 'success', message: 'success remove'})
      } else {
        callback({status: 'error', message: 'already removed'})
      }
    } catch (e) {
      console.log(e)
    }
  },

  addLike: async (req, res, callback) => {
    try {
      const like = await Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
      if (!like) {
        await Like.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        })
        callback({status: 'success', message: 'you like it!!'})
      } else {
        callback({status: 'error', message: 'you love it already!'})
      }
    } catch (e) {
      console.log(e)
    }
  },
  
  // remove like
  removeLike: async (req, res, callback) => {
    try {
      const like = await Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
      if (like) {
        await like.destroy()
        callback({status: 'success', message: 'success removeLike'})
      } else {
        callback({status: 'error', message: 'you removeLike already!'})
      }     
    } catch (e) {
      console.log(e)
    }
  },

  // top user
  getTopUser: async(req, res, callback) => {
    try {
      const user = await User.findAll({include: [{ model: User, as: 'Followers' }]})
      const users = await user.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      })).sort((a, b) => b.FollowerCount - a.FollowerCount)
      callback({ users })
    } catch (e) {
      console.log(e)
    }
  },

  // follow user
  addFollowing: async (req, res, callback) => {
    try {
      const follow = await Followship.findOne({where: {followerId: req.user.id, followingId: req.params.userId}})
      console.log(req.params.userId)
      if (!follow) {
        await Followship.create({
          followerId: req.user.id,
          followingId: req.params.userId
        })
        callback({status: 'success', message: 'success follow'})
      } else {
        callback({status: 'error', message: 'you are a follower already!'})
      }
    } catch (e) {
      console.log(e)
    }
  },

  // remove follow
  removeFollowing: async (req, res, callback) => {
    try {
      const follow = await Followship.findOne({where: {followerId: req.user.id, followingId: req.params.userId}})
      if (follow) {
        await follow.destroy()
        callback({status: 'success', message: 'success removeLike'})
      } else {
        callback({status: 'error', message: 'you removeLike already!'})
      }     
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = userServices