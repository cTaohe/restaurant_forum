const db = require('../models')
const Category = db.Category
const adminService = require('../services/adminServices.js')

let categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  putCategory: (req, res) => {
    adminService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error', data['message'])
        return res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        return res.redirect('/admin/categories')
      }
    })
  },

  postCategory: (req, res) => {
    adminService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  }
}
module.exports = categoryController