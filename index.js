const express = require('express')
const app = express();
const path = require('path')
const mysql = require('mysql2');
const mysqlConfig = require('./app/config/mysql.json');
const myConnection = require('express-myconnection');
const c_main = require('./app/controllers/controller_main')
const passport = require("./app/module/passport")
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis_config = require('./app/config/redis.json')
const app_config = require('./app/config/app.json')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require("express-flash");

// Enable proxy for get secure https
app.enable("trust proxy")

//view
app.set('views', path.join(__dirname, 'app/views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname+'/public')))

let redisClient = redis.createClient()

app.use(myConnection(mysql, {
  host: mysqlConfig.db_host,
  user: mysqlConfig.db_user,
  password: mysqlConfig.db_pass,
  port: mysqlConfig.db_port,
  database: mysqlConfig.database
}, 'single'));

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: app_config.secret,
  resave: false,
  unset: 'destroy',
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

app.use('/', c_main)

const server = app.listen(app_config.port, () => {
  console.log('Example app listening on port ' + app_config.port)
});

