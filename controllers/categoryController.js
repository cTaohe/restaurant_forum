const db = require('../models')
const Category = db.Category

let pageLimit = 10

let categoryController = {
  getCategories: (req, res) => {
    let offset = 0

    if (req.query.page) {
      offset = (req.query.page) -1 * pageLimit
    }

    return Category.findAndCountAll({offset:offset, limit: pageLimit}).then(categories => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(categories.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1 )
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      
      console.log(totalPage)
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', { categories, category, page, totalPage, prev,  next})
          })
      } else {
        return res.render('admin/categories', { categories, page, totalPage, prev,  next })
      }
    })
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  }
}
module.exports = categoryController