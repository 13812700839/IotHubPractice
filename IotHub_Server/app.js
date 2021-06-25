// app.js

var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

// MongoDB的ORM
var mongoose = require("mongoose")
mongoose
  // .connect("mongodb://iot:iot@localhost:27017/iothub?authSource=admin", {
  .connect("mongodb://iot:iot@10.40.250.101:27017/iothub?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("数据库连接成功"))
  .catch(() => console.log("数据库连接失败"))

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")

// 把routes/devices.js挂载在/devices下
var deviceRouter = require("./routes/devices")
// 把routes/tokens.js挂载在/tokens下
var tokensRouter = require('./routes/tokens')

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)

app.use("/devices", deviceRouter)
app.use('/tokens', tokensRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
