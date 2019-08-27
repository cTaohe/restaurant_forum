const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const userController = {
  singUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password){
      req.flash('error_messages', '兩次密碼輸入不同!')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: {email: req.body.email} }).then(user => {
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

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
    .then((favorite) => {
      console.log(favorite)
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({where:{
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
    .then((favorite) => {
      console.log(favorite)
      favorite.destroy()
      .then((restaurant) => {
        return res.redirect('back')
      })
    })
  }
}

module.exports = userController