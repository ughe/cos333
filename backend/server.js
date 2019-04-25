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

  let ideas = [
    { title:      'Compostable Foam Peanuts',
      content:    'Best for plastic beach parties',
      photo_url:  'https://upload.wikimedia.org/wikipedia/commons/f/fb/Foam_Peanuts.jpg'
      userNetid:  'mdhallee',
    }, // 1
    { title:      'Black Hole Observers',
      content:    'Use the newly pictured black hole to help draw other ones',
      photo_url:  'https://cdn.cnn.com/cnnnext/dam/assets/190410090959-01-black-hole-event-horizon-telescope-exlarge-169.jpg',
      userNetid:  'aboppana',
    }, // 2
    { title:      'The Superfluous Novel Thought Group',
      content:    'Join our group to explore the great ideas behind superfluous novels, with a strong focus on those various ones written by famous authors',
      photo_url:  'https://imgc.artprintimages.com/img/print/san-giorgio-maggiore-by-twilight-c-1908_u-l-f57p6r0.jpg',
      userNetid:  'mdhallee',
    }, // 3
    { title:      'Real Time Ideas',
      content:    'Do you have great ideas? Join us in real time.',
      photo_url:  'https://i.ytimg.com/vi/Xoe3Nn5vuBg/maxresdefault.jpg',
      userNetid:  'aboppana',
    }, // 4
    { title:      'FSFA',
      content:    'Free Salad For All',
      photo_url:  'https://assets.bonappetit.com/photos/5ad51b07ff795274c43a0f58/16:9/w_1200,c_limit/20180403_Basically_122.jpg',
      userNetid:  'mdhallee',
    }, // 5
    { title:      'Fractaculous Fractals',
      content:    'We discovered a new word to describe fractals. How does it sound?',
      photo_url:  'https://www.samwoolfe.com/wp-content/uploads/2012/12/Webp.net-resizeimage-1440x866.jpg',
      userNetid:  'aboppana',
    }, // 6
    { title:      'Hemp Roads',
      content:    'Hemp based road paving is the future. Have you ever dreamed of an environmentally-friendly and cost-effective paving technology? Join today.',
      photo_url:  'http://extras.mnginteractive.com/live/media/site19/2018/0522/20180522__23ST_road_work~1.jpg',
      userNetid:  'nsf2',
    }, // 7
  ];

  for (int i = 0; i < ideas.length; i++) {
    Idea.create({
      title = ideas[i]["title"],
      content: ideas[i]["content"],
      photo_url: ideas[i]["photo_url"],
      userNetid: ideas[i]["userNetid"],
      net_votes: 0,
    });
  }

  let comments = [
    { content:    'Any questions?',
      userNetid:  'mdhallee',
      ideaId:     1,
      commentId:  null,
    }, // 1
    { content:    'How do you plan on making these?',
      userNetid:  'aboppana',
      ideaId:     null,
      commentId:  1,
    }, // 2
    { content:    'Is the picture to scale?',
      userNetid:  'wughetta',
      ideaId:     null,
      commentId:  1,
    }, // 3
    { content:    'Super cool that it is compostable',
      userNetid:  'nsf2',
      ideaId:     1,
      commentId:  null,
    }, // 4
    { content:    'This is amazing! Never thought I would ever see a black hole until now.',
      userNetid:  'mdhallee',
      ideaId:     2,
      commentId:  null,
    }, // 5
    { content:    'FYI Meetings in Frist on Tuesdays'
      userNetid:  'aboppana',
      ideaId:     2,
      commentId:  null,
    }, // 6
    { content:    'What will be read?',
      userNetid:  'wughetta',
      ideaId:     3,
      commentId:  null,
    }, // 7
    { content:    'The Most Dangerous Game, for example',
      userNetid:  'mdhallee',
      ideaId:     null,
      commentId:  7,
    }, // 8
    { content:    'Will it be a lot of reading?',
      userNetid:  'aboppana',
      ideaId:     3,
      commentId:  null,
    }, // 9
    { content:    'Nope. Just a lot of fun reading.',
      userNetid:  'mdhallee',
      ideaId:     null,
      commentId:  9,
    }, // 10
    { content:    'How will ideas actually be real time?',
      userNetid:  'wughetta',
      ideaId:     4,
      commentId:  null,
    }, // 11
    { content:    'By using this website of course or talking in person during the designated period',
      userNetid:  'aboppana',
      ideaId:     null,
      commentId:  11,
    }, // 12
    { content:    'Great idea! I really like it and want to participate in the spontaneous sharing of thoughts.',
      userNetid:  'mdhallee',
      ideaId:     4,
      commentId:  null,
    }, // 13
    { content:    'How many salads will be available per person?',
      userNetid:  'aboppana',
      ideaId:     5,
      commentId:  null,
    }, // 14
    { content:    '1',
      userNetid:  'mdhallee',
      ideaId:     null,
      commentId:  14,
    }, // 15
    { content:    'Where will students get their free salad?',
      userNetid:  'wughetta',
      ideaId:     5,
      commentId:  null,
    }, // #
    { content:    'Fractaculous Fractals',
      userNetid:  'aboppana',
      ideaId:     6,
      commentId:  null,
    }, // #
    { content:    'Hemp Roads',
      userNetid:  'nsf2',
      ideaId:     7,
      commentId:  null,
    }, // #
    { content:    '',
      userNetid:  '',
      ideaId:     null,
      commentId:  null,
    }, // #
    { content:    '',
      userNetid:  '',
      ideaId:     null,
      commentId:  null,
    }, // #


    { content:    '',
      userNetid:  '',
      ideaId:     null,
      commentId:  null,
    }, // #
  ];

  for (int i = 0; i < comments.length; i++) {
    Comment.create({
      content: comments[i]["content"],
      userNetid: comments[i]["userNetid"],
      ideaId: comments[i]["ideaId"],
      commentId: comments[i]["commentId"],
      net_votes: 0,
    });
  }


  let TS = ['Entrepreneurship', 'Groups', 'Initiatives', 'Shower Thoughts'];

  let tags = [
    { name:   TS[0],
      ideaId: 1,
    },
    { name:   TS[1],
      ideaId: 1,
    },
    { name:   TS[2],
      ideaId: 1,
    },
    { name:   TS[3],
      ideaId: 1,
    },
    { name:   TS[1],
      ideaId: 2,
    },
    { name:   TS[2],
      ideaId: 3,
    },
    { name:   TS[3],
      ideaId: 4,
    },
    { name:   TS[0],
      ideaId: 5,
    },
    { name:   TS[2],
      ideaId: 5,
    },
    { name:   TS[3],
      ideaId: 5,
    },
    { name:   TS[0],
      ideaId: 6,
    },
  ];

  for (int i = 0; i < tags.length; i++) {
    Tag.create({
      name = tags[i]["name"],
      ideaId: tags[i]["ideaId"],
    });
  }

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
    secure: false, // TODO security
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

// TODO: Crawl collegefacebook
// https://tigerbook.herokuapp.com/images/netid
// also api/v1/undergraduates/netid

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
          if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); }
        });
      }
    })
    .catch(function(err) {
      if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); }
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
  idea: '/api/get/idea/372',
  votes: '/api/get/vote/idea/:ideaId/:netid',
  votes: '/api/get/vote/comment/:commentId/:netid',
  comments: '/api/get/comment',
  comment_comments: '/api/get/comment/:id/comments',
  comment_votes: '/api/get/comment/:id/votes',
  set_idea: '/api/set/idea/',
  set_comment: '/api/set/comment/',
  filter: '/api/get/idea/tag/name_of_the_tag',
  search: '/api/get/idea/search/query',
  del: '/api/del/vote/idea/:ideaId/:netid',
  del: '/api/del/vote/comment/:commentId/:netid',
  del: '/api/del/idea/:id',
}));


// PROTECTED
app.use('/api/get/user/:netid?', ensureAuth, function(req, res) {
  const netid = req.params.netid;
  const search = (netid) ? {where:{netid:netid}} : {};
  User.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

app.use('/api/get/idea/tag/:name', function(req, res) {
  Idea.findAll({include:[{
    model: Tag,
    where: {name: req.params.name},
  }]})
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
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
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

app.use('/api/get/idea/:id?', function(req, res) {
  var include;
  if (req.user) {
    include = [Tag, {model: Vote, where: {netid: req.user}, required: false}, Comment,];
  } else {
    include = [Tag, Comment,];
  }
  const search = (req.params.id) ? {
    where:{id:req.params.id},
    include: include,
  } : {include: include};
  Idea.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

app.use('/api/get/comment/:id?', function(req, res) {
  var include;
  if (req.user) {
    include = [Comment, {model: Vote, where: {netid: req.user}, required: false},];
  } else {
    include = [Comment,];
  }
  const search = (req.params.id) ? {
    where:{id:req.params.id},
    include: include,
  } : {include: include};
  Comment.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

app.use('/api/get/tag/:name?', function(req, res) {
  const search = (req.params.name) ? {where:{name:req.params.name}} : {};
  Tag.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

app.use('/api/get/vote/:id?', function(req, res) {
  const search = (req.params.id) ? {where:{name:req.params.id}} : {};
  Vote.findAll(search)
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

app.use('/api/get/vote/idea/:ideaId/:netid', function(req, res) {
  Vote.findAll({where: {netid: req.params.netid, ideaId: req.params.ideaId, }})
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

app.use('/api/get/vote/comment/:commentId/:netid', function(req, res) {
  Vote.findAll({where: {netid: req.params.netid, commentId: req.params.commentId, }})
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});


// PROTECTED
app.use('/api/set/user', ensureAuth, function(req, res) {
  User.update(req.body, {where : { netid: req.user } })
  .then(function(data) { res.json(data); })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

// PROTECTED
app.post('/api/set/idea', ensureAuth, function(req, res) {
  const id = req.body.id;
  if (id) {
    if (req.body.net_votes) { return res.send('403: may not set net_upvotes on your idea'); }
    Idea.update(req.body, {where : { id: id, userNetid: req.user } })
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
  } else {
    if (req.body.userNetid !== req.user) { return res.send('403'); } // FORBIDDEN
    Idea.create(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
  }
});

// PROTECTED
app.post('/api/set/comment', ensureAuth, function(req, res) {
  const id = req.body.id;
  if (id) {
    Comment.update(req.body, {where : { id: id, userNetid: req.user } })
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
  } else {
    if (req.body.userNetid !== req.user) { return res.send('403'); } // FORBIDDEN
    Comment.create(req.body)
    .then(function(data) { res.json(data); })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
  }
});

// PROTECTED
app.post('/api/set/vote/idea', ensureAuth, function(req, res) {
  const whoami = req.user;
  const ideaId = req.body.ideaId;
  const netid = req.body.netid;
  const is_upvote = req.body.is_upvote;
  const new_vote = (is_upvote ? 1 : -1);
  const is_idea = req.body.is_idea;
  if (!is_idea) { return res.send('400: /api/set/vote/idea/:ideaId must set idea not comment'); }
  const v = req.body;

  // Get net_votes
  Idea.findByPk(ideaId)
  .then(idea => {

    // Find data
    Vote.findAll({where: {netid: netid, ideaId: ideaId, }})
    .then(function(vote_list) {
      const vote = (vote_list.length > 0 ? vote_list[0] : null);

      if (vote) {
        const previous_vote = (vote.dataValues.is_upvote ? 1 : -1);
        console.log('[INFO] /api/set/vote/idea/:ideaId previous vote found');

        // Modify vote
        Vote.update({is_upvote: is_upvote}, {where : { id: vote.id, netid: whoami } })
        .then(function(data) {

          // Update ideaId's net_votes
          const new_total = (idea.dataValues.net_votes + new_vote - previous_vote);
          const uni = idea.dataValues.userNetid;
          Idea.update({net_votes: new_total}, {where : { id: ideaId, userNetid: uni } })
          .then((data) => {
              console.log('updated net_votes from ' + idea.dataValues.net_votes + ' to ' + new_total);
              res.json({net_votes:new_total})
          })
          .catch((err) => { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send(err); } });

        })
        .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });

      } else {
        console.log('[INFO] /api/set/vote/idea/:ideaId previous vote NOT found');

        // Create vote
        Vote.create(v)
        .then(function(data) {
          // Update ideaId's net_votes
          const new_total = (idea.dataValues.net_votes + new_vote);
          const uni = idea.dataValues.userNetid;
          Idea.update({net_votes: new_total}, {where : { id: ideaId, userNetid: uni } })
          .then((data) => {
              console.log('updated net_votes from ' + idea.dataValues.net_votes + ' to ' + new_total);
              res.json({net_votes:new_total})
          })
          .catch((err) => { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });

        })
        .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send(' 500'); } });

      }

    })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });

  })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });
});

// PROTECTED
app.post('/api/set/vote/comment', ensureAuth, function(req, res) {
  const whoami = req.user;
  const commentId = req.body.commentId;
  const netid = req.body.netid;
  const is_upvote = req.body.is_upvote;
  const new_vote = (is_upvote ? 1 : -1);
  const is_idea = req.body.is_idea;
  if (is_idea) { return res.send('400: /api/set/vote/comment/:commentId must set comment not idea'); }
  const v = req.body;

  // Get net_votes
  Comment.findByPk(commentId)
  .then(comment => {

    // Find data
    Vote.findAll({where: {netid: netid, commentId: commentId, }})
    .then(function(vote_list) {
      const vote = (vote_list.length > 0 ? vote_list[0] : null);

      if (vote) {
        const previous_vote = (vote.dataValues.is_upvote ? 1 : -1);
        console.log('[INFO] /api/set/vote/comment/:commentId previous vote found');

        // Modify vote
        Vote.update({is_upvote: is_upvote}, {where : { id: vote.id, netid: whoami } })
        .then(function(data) {

          // Update commentId's net_votes
          const new_total = (comment.dataValues.net_votes + new_vote - previous_vote);
          const uni = comment.dataValues.userNetid;
          Comment.update({net_votes: new_total}, {where : { id: commentId, userNetid: uni } })
          .then((data) => {
              console.log('updated net_votes from ' + comment.dataValues.net_votes + ' to ' + new_total);
              res.json({net_votes:new_total})
          })
          .catch((err) => { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send(err); } });

        })
        .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });

      } else {
        console.log('[INFO] /api/set/vote/comment/:commentId previous vote NOT found');

        // Create vote
        Vote.create(v)
        .then(function(data) {

          // Update commentId's net_votes
          const new_total = (comment.dataValues.net_votes + new_vote);
          const uni = comment.dataValues.userNetid;
          console.log(new_total);
          Comment.update({net_votes: new_total}, {where : { id: commentId, userNetid: uni } })
          .then((data) => {
              console.log('updated net_votes from ' + comment.dataValues.net_votes + ' to ' + new_total);
              res.json({net_votes:new_total})
          })
          .catch((err) => { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });

        })
        .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send(' 500'); } });

      }

    })
    .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });

  })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); } });


});



// Not protected from other logged-in users
app.post('/api/set/tag', ensureAuth, function(req, res) {
  Promise.all(req.body.tags.map(t => Tag.create(t)))
  .then(data => res.json(data))
  .catch(err => { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

// PROTECTED
app.use('/api/del/vote/idea/:ideaId/:netid', ensureAuth, function(req, res) {
  if (req.params.netid !== req.user) { return res.send('403'); } // FORBIDDEN
  Vote.destroy({where: {netid: req.params.netid, ideaId: req.params.ideaId, }})
  .then(function(data) {
    res.redirect('/');
  })
  .catch(function(err) {
    if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); }
  });
});

// PROTECTED
app.use('/api/del/vote/comment/:commentId/:netid', ensureAuth, function(req, res) {
  if (req.params.netid !== req.user) { return res.send('403'); } // FORBIDDEN
  Vote.destroy({where: {netid: req.params.netid, commentId: req.params.commentId, }})
  .then(function(data) {
    res.redirect('/');
  })
  .catch(function(err) {
    if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send('500'); }
  });
});

// PROTECTED
app.use('/api/del/idea/:id', ensureAuth, function(req, res) {
  Idea.destroy({where: {id: req.params.id, userNetid: req.user}})
  .then(function(data) {
    console.log('SUCCESS!');
    res.redirect('/');
  })
  .catch(function(err) { if (process.env.DEBUG_TRUE) { res.send(err); } else { res.send("500"); } });
});

app.listen(port);
