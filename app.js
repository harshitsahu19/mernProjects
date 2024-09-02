var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require ("express-session")
const flash = require ('connect-flash')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret: "Heyyy!!"
}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// errorchat handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
































// router.get('/createuser',async  function(req, res, next) {
//   let createduser = await userModel.create({
//      username:"harsh",
//      password: "harsh",
//      posts: [],    
//      email: "harsh@gmail.com",
//      fullName:"harsh sharma"
//    })
//    res.send(createduser);
//  });
 
//  router.get('/alluserposts',async  function(req, res, next) {
//     let user = await userModel.findOne({_id:"66d189a934cde62400cbfe73"})
//     .populate('posts')
//     res.send(user)
//   });
 
//  router.get('/createpost',async  function(req, res, next) {
//    let createdpost = await postModel.create({
//      postText: "This is second post by me",
//      user: "66d189a934cde62400cbfe73"   
//    })  
//      let user = await userModel.findOne({_id:"66d189a934cde62400cbfe73"})
//      user.posts.push(createdpost._id);
//      await user.save();
//      res.send(" post created done done");
//   });
 