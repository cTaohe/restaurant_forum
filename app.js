const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const db = require('./models')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')

// setup handlebars
app.engine('handlebars', exphbs({ 
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers.js')
}))
app.set('view engine', 'handlebars')
// setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// setup session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
// setup flash
app.use(flash())

// res.flash in res.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on port ${port}`)
})

require('./routes')(app)