const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
  .then(userDocument => {
    console.log("se      kñkjñkjñlkhñkhjhñhñkhr      ",userDocument)
    cb(null, userDocument);
  })
  .catch(err => {
    console.log("tpm    tpm   jtka",err)
    cb(err);
  })
});
