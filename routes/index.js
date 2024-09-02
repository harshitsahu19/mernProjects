var express = require('express');
var router = express.Router();
const userModel = require ('./users');
const postModel = require ('./post');
const passport = require ('passport');
const upload = require ('./multer')

const localStrategy = require ("passport-local");
passport.use(new localStrategy (userModel.authenticate()));

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {  
  res.render('login', { error: req.flash('error')});
});


router.post('/upload',isLoggedIn, upload.single("file"),async function(req, res, next) {
   if (!req.file){
    return res.status(404).send("no files were given")
   }
   const user = await  userModel.findOne({username: req.session.passport.user})
   const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user : user._id
   });

   user.posts.push(post._id);
   await user.save();
  res.redirect("/profile");
});
 
router.get('/profile', isLoggedIn, async function(req, res, next) {  
  const user = await userModel.findOne({
    username: req.session.passport.user 
  })
  .populate("posts")
  console.log(user);
  res.render('profile',{user});
});



router.post("/register", function(req,res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function(){
    console.log("User registered successfully"); 
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })

})

router.post("/login", passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "login",
  failureFlash:true
}), function(req,res){
})

router.get("/logout", function(req, res){
  req.logout(function (err){
    if (err){return next (err); }
    res.redirect('/')
  })
})

function isLoggedIn( req, res, next){
  if (req.isAuthenticated()) return next ();
  res.redirect("/login")
}

router.post('/delete', isLoggedIn, async function (req, res, next) {
  try {
    // Find the user in the session
    const user = await userModel.findOne({ username: req.session.passport.user });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Optionally delete all posts by the user
    await postModel.deleteMany({ user: user._id });

    // Delete the user
    await userModel.findByIdAndDelete(user._id);

    // Log out the user after deletion
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/post/delete/:id', isLoggedIn, async function(req, res, next) {
  console.log('Delete request received for post ID:', req.params.id);
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Find the user who is deleting the post
    const user = await userModel.findOne({ username: req.session.passport.user });

    // Ensure the post belongs to the logged-in user
    if (!user || !user.posts.includes(postId)) {
      return res.status(403).send('Unauthorized to delete this post');
    }

    // Remove the post from the user's posts array
    user.posts.pull(postId);
    await user.save();

    // Delete the post
    await postModel.findByIdAndDelete(postId);

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
