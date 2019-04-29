require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash = require("connect-flash");

const cors = require('cors');
// const passport = require('passport')
// , LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = Promise;
mongoose
  .connect(process.env.bbdd, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

<<<<<<< HEAD
app.use(cors(
  {
    credentials: true,
    origin: "*"
    //origin: ['http://localhost:3000', 'http://localhost:3001', "https://noduino.herokuapp.com/", "http://192.168.20.73:3000"]
  }
));

=======
app.use(cors({
  credentials: true,
  origin: [process.env.SERVER]
}));
>>>>>>> b48ef13952a5b5f41266cde1c708b16c1b513de5

// Middleware Setup
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));



app.use(express.static(path.join(__dirname, 'public')));



// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    defaultExpirationTime: 1000 * 60 * 60 * 24 * 14
  })
}))
require('./passport')(app);


// app.use(flash());

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use((req, res, next) => {
  next();
})


const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


app.use((req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

<<<<<<< HEAD
// app.listen(5000, () => {
//   console.log("Escuchando")
// })
=======
// app.listen(5000,()=>{
//   console.log("Escuchando")
// }) 

>>>>>>> b48ef13952a5b5f41266cde1c708b16c1b513de5

module.exports = app;
