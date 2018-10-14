const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
const User = require("../../models/User");
//Test User route
router.get("/test", (req, res) => res.json({ msg: "Users work" }));




//Register User Route
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {


    if (user) {
      return res.status(400).json({ email: "Email Already Exists" });
    } else {
      if ( req.body.name === "" && req.body.email === "" &&  req.body.password === "" )
      {
        res.json({ name : "Name is empty" , email : "Email is empty" , password : "password is empty" });
      }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });

});

// Login User Route
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Found
        const payload = { id: user.id, name: user.name }; // Payload generated from User
        //Token Sign
        jwt.sign(
          payload,
          keys.secretorkey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password is incorrect" });
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);


router.post('/forgotPassword' , (req,res) => {
  if (req.body.email !== undefined) {
    var  email = req.body.email;
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(404).json({ email: "User not found" });
      }
      else {
        const payload = { id: user.id, name: user.name }; // Payload generated from User
        jwt.sign(
          payload,
          keys.secretorkey,
          { expiresIn: 10 },
          (err, token) => {
            res.send('<a href="/resetpassword/' + payload.id + '/' + token + '">Reset password</a>');
          }
        );
      }
    });

  }
});

router.get('/resetpassword/:email/:token', function(req, res) {

  User.findOne({ email: req.params.email }).then(user => {

res.send('<form action="/api/users/resetpassword" method="POST">' +
      '<input type="hidden" name="id" value="' + req.params.email + '" />' +
      '<input type="hidden" name="token" value="' + req.params.token + '" />' +
      '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
      '<input type="submit" value="Reset Password" />' +
  '</form>');
  });

});


router.post('/resetpassword/:email', function(req, res) {
var email = req.params.email;

  User.findOne({ email : email }).then(user => {
    var Newpassword = req.body.password

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(Newpassword, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
    
  
  // res.send('Your password has been successfully changed.');
});

module.exports = router;


