const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const loggerWinston = require('./commons/winston');
require('dotenv').config();

//  router
const pageAccessTokenRouter = require('./routes/pageAccessToken');
const conversationRouter = require('./routes/conversation');
const messengerRouter = require('./routes/messenger');
const fileUploadRouter = require('./routes/fileUpload');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

//  catch 404 and forward to error handler
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  //  tạo req.user và gán data
  done(null, user);
});

passport.deserializeUser((user, done) => {
  //  giải mã req.user
  done(null, user);
});

passport.use(new FacebookStrategy({
  clientID: '1824956421068299',
  clientSecret: 'f3c9631f96b0b04392b4dc94d5a01153',
  callbackURL: "https://demo-node-2021.herokuapp.com/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email', 'accounts'],
},
(accessToken, refreshToken, profile, cb) => {
  // let token = accessToken;
  // call back đc đẩy vào passport.serializeUser(cb)
  return cb(null, profile);
}));

app.get('/auth/facebook',
  passport.authenticate('facebook',
    { authType: 'reauthenticate',
      scope: [
        'email',
        'pages_show_list',
        'read_page_mailboxes',
        'pages_messaging',
        'pages_read_engagement',
        'pages_manage_metadata',
        'pages_read_user_content',
        'pages_manage_ads',
        'pages_manage_posts',
        'pages_manage_engagement',
      ],
    }
  ));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    // res.cookie("id", req.user.id);
    // req.session.id = req.user.id;
    // console.log(req.user.id);
    res.redirect('/');
  });
app.get('/showSession',
  (req, res) => {
    // Successful authentication, redirect home.
    loggerWinston.info(req.user);
    res.json(req.user);
  });
app.get('/upLoad',
  (req, res) => {
    // Successful authentication, redirect home.
    res.render("uploadFile");
  });

app.get('/', (req, res) => {
  res.render('index', { title: "Express" });
});

//  ROUTER
app.use('/pageAccessToken', pageAccessTokenRouter);
app.use('/conversation', conversationRouter);
app.use('/messenger', messengerRouter);
app.use('/fileUpload', fileUploadRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
