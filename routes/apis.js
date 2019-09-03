const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController.js')
const catrgoryController = require('../controllers/api/catrgoryController')
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.get('/admin/categories', catrgoryController.getCategories)

module.exports = router