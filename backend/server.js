/**********************************************************************
 * server.js
 * Backend for tigerteams
 * Mike, Avi, & William
 **********************************************************************/
const express = require('express');
const path = require('path');
const compression = require('compression');
const passport = require('passport');
const cas = require('passport-pucas');
const session = require('express-session');
const morgan = require('morgan');
const Sequelize = require('sequelize');
const url = require('url');
const port = process.env.PORT || 4000;
const app = express();

if (process.env.DEBUG_TRUE) {
  app.set('showStackError', true);
  app.use(morgan('dev'));
}

/**********************************************************************
 * MySQL RDS Database
 **********************************************************************/

const sequelize = new Sequelize(
  process.env.AWS_RDS_DATABASE,
  process.env.AWS_RDS_USERNAME,
  process.env.AWS_RDS_PASSWORD, {
    host: process.env.AWS_RDS_HOST,
    port: 3306,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    dialectOptions: {
      ssl:'Amazon RDS'
    },
    pool: { maxConnections: 5, maxIdleTime: 30},
    language: 'en'
  }
);

class User extends Sequelize.Model {}
User.init({
  netid: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  last: Sequelize.STRING,
  first: Sequelize.STRING,
  photo_url: Sequelize.STRING,
}, {
  underscored: true,
  sequelize,
  modelName: 'user',
});

class Idea extends Sequelize.Model {}
Idea.init({
  title: Sequelize.STRING,
  content: Sequelize.STRING,
  photo_url: Sequelize.STRING,
  downvotes: Sequelize.STRING,
  upvotes: Sequelize.STRING,
  tags: Sequelize.STRING,
}, {
  underscored: true,
  sequelize,
  modelName: 'idea',
});
User.hasMany(Idea);
Idea.belongsTo(User);
// idea.getUser() and user.getIdeas()

class Comment extends Sequelize.Model {}
Comment.init({
  content: Sequelize.STRING,
  downvotes: Sequelize.STRING,
  upvotes: Sequelize.STRING,
}, {
  underscored: true,
  sequelize,
  modelName: 'comment',
});
// User comments
User.hasMany(Comment);
Comment.belongsTo(User);
// Top level idea comments
Idea.hasMany(Comment);
Comment.belongsTo(Idea);
// Comments' parent and children comments
Comment.hasMany(Comment);
Comment.belongsTo(Comment);

//sequelize.sync({force: true});

// Route for checking databse connection
app.get('/db', (req, res) =>
  sequelize.authenticate()
  .then(() => {
    if (process.env.DEBUG_TRUE) {
      sequelize.getQueryInterface().showAllSchemas().then((tables) => {
        res.send(tables);
      });
    } else {
      res.send('hello, database');
    }
  })
  .catch(err => {
    if (process.env.DEBUG_TRUE) {
      res.send('Unable to connect to the database:' + err);
    } else {
      res.send('no connection');
    }
  })
);


/**********************************************************************
 * React Frontend
 **********************************************************************/

app.use(express.json());
app.use(express.static(path.resolve(__dirname+'/../frontend/build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});


/**********************************************************************
 * CAS Authentication
 **********************************************************************/

// passport
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  saveUninitialized: false,
  resave: false,
  cookie: { secure: !process.env.DEBUG_TRUE },
}));
app.use(passport.initialize());
app.use(passport.session());

var cas_strategy = new cas.Strategy(
  {casURL: 'https://fed.princeton.edu/cas'},
  function(username, done) {
    console.log('Success: ' + username + ' is logged in.');
    return done(null, {username: username});
  }
);
passport.use(cas_strategy);

// CAS login
app.use('/login', passport.authenticate('pucas', { failureRedirect: '/failed_login' }),
  function(req, res, next) {
    const netid = req.user.username;
    User.findOne({where: {netid: netid}})
    .then(function(user) {
      if (user && user.dataValues.netid === netid) {
        console.log('[CAS] LOGIN ' + netid);
        res.redirect('/#logged-in');
      } else {
        // New User
        User.create({netid: netid,})
        // TODO pull in last, first, photo_url - is there absolute url?
        .then(function(user) {
          console.log('[CAS] LOGIN NEW USER ' + netid);
          res.redirect('/#logged-in');
        })
        .catch(function(err) {
          if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); }
        });
      }
    })
    .catch(function(err) {
      if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); }
    });
  }
);

// CAS logout
app.use('/logout', function(req, res, next) {
  res.redirect(cas_strategy.logout(req, res));
});

//used to support session
passport.serializeUser(function(user, done) {
  console.log("serializing"+user);
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  console.log("deserializing "+username);
  done(null, username);
});


function ensureAuth(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

app.use('/whoami', ensureAuth, function(req, res) {
  res.json({user: req.user});
});

/**********************************************************************
 * AWS DynamoDB Configuration
 **********************************************************************/

/*
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_DYNAMO_ACCESS_KEY,
  region: 'us-east-1'
});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
*/

/**********************************************************************
 * REST
 **********************************************************************/

app.get('/api', (req, res) => res.json({
  user: req.user,
  login: '/api/login',
  logout: '/api/logout',
  users: '/api/get/user',
  ideas: '/api/get/idea',
  comments: '/api/get/comment',
  set: '/api/set/idea/0'
}));


app.use('/api/get/user/:netid?', ensureAuth, function(req, res) {
  const netid = req.params.netid;
  const search = (netid) ? {where:{netid:netid}} : {};
  console.log("CHILLING: " + netid);
  User.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/idea/:id?', ensureAuth, function(req, res) {
  const search = (req.params.id) ? {where:{id:req.params.id}} : {};
  Idea.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/comment/:id?', ensureAuth, function(req, res) {
  const search = (req.params.id) ? {where:{id:req.params.id}} : {};
  Comment.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/set/user', ensureAuth, function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  User.update(req.body)
  .then(function(data) { res.json(req.body); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/set/idea', ensureAuth, function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  const id = req.body.id;
  if (id) {
    Idea.update(req.body)
    .then(function(data) { res.json(req.body); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  } else {
    Idea.create(req.body)
    .then(function(data) { res.json(req.body); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  }
});

app.use('/api/set/comment', ensureAuth, function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  const id = req.body.id;
  if (id) {
    Comment.update(req.body)
    .then(function(data) { res.json(req.body); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  } else {
    Comment.create(req.body)
    .then(function(data) { res.json(req.body); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  }
});

app.listen(port);
