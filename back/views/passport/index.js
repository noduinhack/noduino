const passport = require('passport');
const session = require("express-session");
require('./serializers');
require('./localStrategy');

module.exports = (app)  => {
  app.use(passport.initialize());
  app.use(passport.session());
}
