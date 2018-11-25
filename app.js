require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

require("./config/passport");
// const User = require("./models/userModel");
// const bcrypt = require("bcryptjs");
const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;



// requiring middleware consts-==--==-=--=
const session = require("express-session");
const flash = require("connect-flash");

// =--=-=-=-=-==-=-=-=--=-=-=-=

mongoose
  .connect('mongodb://localhost/project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// =-=--=-=-=-==--==--= start Express View engine setup =--=-=-=-=-=-=-=-=

app.use(flash());

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


app.locals.title = 'Express - Generated with IronGenerator';





app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));
// this block of code configures and activates a session in express

app.use(passport.initialize());
// this line 'turns on' the passport package
app.use(passport.session());
//this line connects passport to the session you created




// -=-=-=-=-=-=-= end of engine setup -=-=-=-=-=
// -=-=-=-=-= exrpress session setup =-=--=-=-=


      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
})
app.locals.title = 'Welcome to Mise-En-Place App!';



const index = require('./routes/index');
app.use('/', index);


const user = require("./routes/userRoute");
app.use("/", user);

const recipe = require("./routes/recipeRoute");
app.use("/recipes", recipe);

const recipeBook = require("./routes/recipeBookRoute");
app.use("/recipeBook", recipeBook);


module.exports = app;
