const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Followship = db.Followship
const Comment = db.Comment
const Restaurant = db.Restaurant
const Like = db.Like

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  singUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同!')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊信箱!')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    if (req.user.isAdmin) {
      req.flash('success_messages', `Admin 成功登入!`)
      return res.redirect('/admin/users')
    }

    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },

  // Profile
  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(profile => {
      const {Comments} = profile
      profile.isFollowed = req.user.Followings.map(d => d.id).includes(profile.id)
      const set = new Set();
      const comments = Comments.filter(item => !set.has(item.RestaurantId) ? set.add(item.RestaurantId) : false);
      return res.render('users/profile', {
        profile,
        user: req.user,
        comments
      })
    })
  },
  // Profile 頁面
  editUser: (req, res) => {
    User.findByPk(req.params.id).then(profile => {
      if (req.user.id !== Number(profile.id)) {
        req.flash('error_messages', '無權編輯此 profile')
        return res.redirect(`/users/${req.params.id}`)
      }
      return res.render('users/edit', { profile: profile })
    })
  },
  // 編輯 Profile
  putUser: (req, res) => {

    // 非 Profile 資料本人
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', '無權編輯此 profile')
      return res.redirect(`/users/${req.params.id}`)
    }
    // 名字空白
    if (!req.body.name) {
      return res.render(`users/edit`, { profile: req.user, 'error_messages': `請填寫名字` })
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
                return res.render('users/profile', {
                  profile: profile,
                  user: req.user,
                  'success_messages': `已修改 ${profile.name} 的資料`
                })
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
              return res.render('users/profile', {
                profile: profile,
                user: req.user,
                'success_messages': `已修改 ${profile.name} 的資料`
              })
            })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((favorite) => {
        return res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },

  addLike: async (req, res) => {
    try {
      const like = await Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })

      if (!like) {
        Like.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        })
        return res.redirect('back')
      } else {
        console.log("already liked")
      }
    } catch (e) {
      console.log(e)
    }
  },

  removeLike: async (req, res) => {
    try {
      const like = await Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
      like ? like.destroy() : console.log('not exist')
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController