const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/catrgoryController')
const userController = require('../controllers/api/userController.js')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', adminController.createRestaurant) //create restaurnat page
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurtant)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', adminController.editRestaurant) //edit restaurnat page
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

router.get('/admin/users', adminController.editUsers) //edit users page
router.put('/admin/users/:id', authenticated, authenticatedAdmin, adminController.putUsers) //put users

router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategory)
router.put('/admin/categories/:id', categoryController.putCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)

module.exports = router