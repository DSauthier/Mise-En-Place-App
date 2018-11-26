const express = require('express');
const router  = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
// =--=-=-=-=-=-=sign up routes start here-==-=-=-=-=--=-=-==-

router.get('/register', (req, res, next) => {
  res.render('userFolder/signup'),{ message: req.flash("error")};
});


router.post('/register',(req,res,next)=>{
  User.findOne({ username: req.body.username })
    .then((theUser) => {

      if (theUser !== null) {
        console.log("username Taken")
        req.flash('error', 'sorry, that username is taken');
        // this is essentially equal to req.flash.error = 'sorry that username is taken'
        res.redirect('/register')
      }else{
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.password, salt);
        
        User.create({
          username: req.body.username,
          password: hashPass,
          about: req.body.about
        })
        .then(()=>{
          // console.log(User)
          res.redirect("/login");
        })
        .catch((err)=>{
          next(err)
        })
      }
    })
    .catch((err)=>{
        next(err)
    })
  
});

// =--=-=-==--=-==-sign up routes ends here- =-=--=-==-=-=--==-


// =-=--==-=-==--==-=-log in starts here=--=-=-==--=-=-
router.get("/login", (req, res, next) => {
  res.render("userFolder/login", { message: req.flash("error") });
});


router.post("/login", passport.authenticate("local", {

  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/');
})

router.get("/dashboard/", (req, res) => {
  res.render("userFolder/dashboard");
});





// -==-=-=-=--==-=-=-=-log in ends here =-=--=-=-=-=-=-=-=




module.exports = router;