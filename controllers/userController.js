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
const userServices = require('../services/userServices.js')

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
    userServices.getUser(req, res, (data) => {
      res.render('users/profile', data)
    })
  },

  // Profile 頁面
  editUser: (req, res) => {
    userServices.editUser(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect(`user/${req.params.id}`)
      }
      return res.render('users/edit', data)
    })
  },

  // 編輯 Profile
  putUser: (req, res) => {
    userServices.putUser(req, res, (data) => {
      console.log(req.params)
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        return res.redirect(`/users/${req.user.id}`)
      }
    })
  },

  addFavorite: (req, res) => {
    userServices.addFavorite(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('back')
      }
    })
  },

  removeFavorite: (req, res) => {
    userServices.removeFavorite(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('back')
      }
    })
  },

  addLike: async (req, res) => {
    userServices.addLike(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('back')
      }
    })
  },

  removeLike: async (req, res) => {
    userServices.removeLike(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('back')
      }
    })
  },

  getTopUser: (req, res) => {
    userServices.getTopUser(req, res, (data) => {
      res.render('topUser', data)
    })
  },

  addFollowing: (req, res) => {
    userServices.addFollowing(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('back')
      }
    })
  },

  removeFollowing: (req, res) => {
    userServices.removeFollowing(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('back')
      }
    })
  }
}

module.exports = userController