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
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true,
}));

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
  sequelize,
  modelName: 'user',
});

class Idea extends Sequelize.Model {}
Idea.init({
  title: Sequelize.STRING,
  content: Sequelize.STRING,
  photo_url: Sequelize.STRING,
  net_votes: Sequelize.INTEGER,
}, {
  sequelize,
  modelName: 'idea',
});
User.hasMany(Idea);
Idea.belongsTo(User);
// idea.getUser() and user.getIdeas()

class Comment extends Sequelize.Model {}
Comment.init({
  content: Sequelize.STRING,
  net_votes: Sequelize.INTEGER,
}, {
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

class Tag extends Sequelize.Model {}
Tag.init({
  name: Sequelize.STRING,
}, {
  sequelize,
  modelName: 'tag',
});
Idea.hasMany(Tag);
Tag.belongsTo(Idea);

class Vote extends Sequelize.Model {}
Vote.init({
  netid: Sequelize.STRING,
  is_upvote: Sequelize.BOOLEAN,
  is_idea: Sequelize.BOOLEAN,
}, {
  sequelize,
  modelName: 'vote',
});
Idea.hasMany(Vote);
Vote.belongsTo(Idea);
Comment.hasMany(Vote);
Vote.belongsTo(Comment);

// Re-set database structure (dumps all data)
//sequelize.sync({force: true});
// Create object method:
/*
sequelize.sync().then(() => {
  return Comment.create({
    content: "insightful comment",
    ideaId: 2,
  });
});
*/

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
  cookie: {
    secure: false,
    maxAge: 604800,
  },
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

app.use('/api/whoami', ensureAuth, function(req, res) {
  res.json({user: req.user});
});

/**********************************************************************
 * REST
 **********************************************************************/

app.get('/api', (req, res) => res.json({
  user: req.user,
  whoami: '/api/whoami',
  login: '/api/login',
  logout: '/api/logout',
  users: '/api/get/user',
  ideas: '/api/get/idea',
  idea: '/api/get/idea/372
  votes: '/api/get/vote/idea/:ideaId/:netid',
  votes: '/api/get/vote/comment/:commentId/:netid',
  comments: '/api/get/comment',
  comment_comments: '/api/get/comment/372/comments',
  comment_votes: '/api/get/comment/732/votes',
  set_idea: '/api/set/idea/',
  set_comment: '/api/set/comment/',
  filter: '/api/get/idea/tag/name_of_the_tag',
  search: '/api/get/idea/search/query',
  del: '/api/del/vote/idea/:ideaId/:netid',
  del: '/api/del/vote/comment/:commentId/:netid',
}));


app.use('/api/get/user/:netid?', ensureAuth, function(req, res) {
  const netid = req.params.netid;
  const search = (netid) ? {where:{netid:netid}} : {};
  User.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/idea/tag/:name', function(req, res) {
  Idea.findAll({include:[{
    model: Tag,
    where: {name: req.params.name},
  }]})
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/idea/search/:query', function(req, res) {
  Idea.findAll({
    where: {
      [Sequelize.Op.or]: [
        {title: { [ Sequelize.Op.like ]: '%' + req.params.query + '%' }},
        {content: { [ Sequelize.Op.like ]: '%' + req.params.query + '%' }},
      ],
    },
  })
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/idea/:id?', function(req, res) {
  const search = (req.params.id) ? {
    where:{id:req.params.id},
    include:[Tag,Vote,Comment],
  } : {include:[Tag,Vote,Comment]};
  Idea.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/comment/:id?', function(req, res) {
  const search = (req.params.id) ? {
    where:{id:req.params.id},
    include:[Comment, Vote],
  } : {include:[Comment, Vote]};
  Comment.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/tag/:name?', function(req, res) {
  const search = (req.params.name) ? {where:{name:req.params.name}} : {};
  Tag.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/vote/:id?', function(req, res) {
  const search = (req.params.id) ? {where:{name:req.params.id}} : {};
  Vote.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/get/vote/idea/:ideaId/:netid', function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  //if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  Vote.findAll({where: {netid: req.params.netid, ideaId: req.params.ideaId, }})
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.use('/api/del/vote/comment/:commentId/:netid', function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  //if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  Vote.findAll({where: {netid: req.params.netid, commentId: req.params.commentId, }})
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});



app.use('/api/set/user', ensureAuth, function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  if (whoami !== netid) {
    return res.send('403 permission denied to update: ' + netid);
  }

  User.update(req.body)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.post('/api/set/idea', ensureAuth, function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;

  //TODO RESOLVE BELOW
  //if (whoami !== netid) {console.log("EarlyReturn"); return res.send('403 permission denied to update: ' + netid); }

  const id = req.body.id;
  if (id) {
    Idea.update(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  } else {
    Idea.create(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  }
});

app.post('/api/set/comment', ensureAuth, function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  //if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  const id = req.body.id;
  if (id) {
    Comment.update(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  } else {
    Comment.create(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  }
});

app.post('/api/set/vote', ensureAuth, function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  //if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  const id = req.body.id;
  if (id) {
    Vote.update(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  } else {
    Vote.create(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  }
});

// TODO auth
app.post('/api/set/tag', ensureAuth, function(req, res) {
  const id = req.body.id;
  if (id) {
    Tag.update(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  } else {
    Tag.create(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
  }
});

app.use('/api/del/vote/idea/:ideaId/:netid', function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  //if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  Vote.destroy({where: {netid: req.params.netid, ideaId: req.params.ideaId, }})
  .then(function(data) {
    res.redirect('/');
  })
  .catch(function(err) {
    if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); }
  });
});

app.use('/api/del/vote/comment/:commentId/:netid', function(req, res) {
  const whoami = req.user;
  const netid = req.body.netid;
  //if (whoami !== netid) { return res.send('403 permission denied to update: ' + netid); }

  Vote.destroy({where: {netid: req.params.netid, commentId: req.params.commentId, }})
  .then(function(data) {
    res.redirect('/');
  })
  .catch(function(err) {
    if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); }
  });
});


/*
app.use('/api/del/idea/:id', function(req, res) {
  Idea.destroy({where: {id: req.params.id,}})
  .then(function(data) {
    console.log('SUCCESS!');
    res.redirect('/');
  })
  .catch(function(err) {
    if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); }
  });
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


*/

app.listen(port);
