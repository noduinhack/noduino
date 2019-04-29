const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;



// router.get("/login", (req, res, next) => {
//   res.render("auth/login", { "message": req.flash("error") });
// });



router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (error, user, info) {
    let objeto;
    // req.session()
    if (user) {
      objeto = { logged: true, user: user }
    } else {
      objeto = { logged: false, user: null }
    }

    //ESTO ES DIOS

    req.login(user, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }

      res.json(objeto)
    })
  })(req, res, next)
})


router.post('/comprobar', (req, res, next) => {

  res.json({ auth: req.isAuthenticated() })

})

router.get('/isloggedin', (req, res, next) => {
  let objeto;


  if (req.user) {
    objeto = { logged: true, user: req.user }
  } else {
    objeto = { logged: false, user: null }
  }

  res.json(objeto)
})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get('/login', (req, res, next) => { })


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/logout", (req, res) => {

  console.log(req.session)

  req.session.destroy(function (err) {
    console.log(err)
    console.log("ENTRO EN FUNCION NODE")
  });
  res.json({ "mensaje": "Logueado con exito" })
});

module.exports = router;
