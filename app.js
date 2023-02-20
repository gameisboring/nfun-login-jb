const createError = require('http-errors')
const helmet = require('helmet')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const questionRouter = require('./routes/question')
const errorController = require('./lib/errorController')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/question', questionRouter)
// helmet middleware

app.disable('x-powered-by')

//* 에러 컨트롤 */
app.use(errorController.pageNotFoundError)
app.use(errorController.respondInternalError)

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
