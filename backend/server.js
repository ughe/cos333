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
const port = process.env.PORT || 4000;
const app = express();

if (process.env.DEBUG_TRUE) {
  app.set('showStackError', true);
  app.use(morgan('dev'));
}

// hello, world
app.get('/hello', (req, res) => res.send('hello, world'));

/**********************************************************************
 * React Frontend
 **********************************************************************/

/*
app.use(compression({
  filter: function (req, res) {
    return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
  },
  level: 9
}));
*/
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
app.use('/login', passport.authenticate('pucas'),
  function(req, res, next) {
    var netid = req.user.username;
    console.log('[CAS] LOGIN ' + netid);
    res.redirect('/');
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

app.use('/protected', ensureAuth, function(req, res) {
    res.json({user: req.user});
});



/**********************************************************************
 * AWS DynamoDB Configuration
 **********************************************************************/

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_DYNAMO_ACCESS_KEY,
  region: 'us-east-1'
});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

/**********************************************************************
 * REST
 **********************************************************************/

// Instructions
app.get('/api', (req, res) => res.json({
  user: req.user,
  login: '/api/login',
  logout: '/api/logout',
  Table: '/api/Table',
  Item: '/api/Table/key/value',
  Create: '/api/Table/key/value/create',
}));

// Write data
app.get('/api/:table/:key/:value/create', function (req, res) {
  var params = {
    TableName: req.params.table,
    Item: {}
  };
  params['Item'][req.params.key] = {'S': req.params.value};

  ddb.putItem(params, function(err, data) {
    if (err) {
      res.send('Error');
    } else {
      res.send('Success');
    }
  });
});

// Get Data
app.get('/api/:table/:key/:value', function (req, res) {
  var params = {
    Key: {},
    TableName: req.params.table
  };
  params.Key[req.params.key] = {S: req.params.value};
  ddb.getItem(params, function(err, data) {
    if (!err) {
      res.send(data);
    }
  });
});

// Get All Data
var docClient = new AWS.DynamoDB.DocumentClient();
app.get('/api/:table/:LastEvaluatedKey?', function (req, res) {
  var params = {TableName: req.params.table, ConsistentRead: true};
  if (typeof req.params.LastEvaluatedKey != "undefined") {
    params.ExclusiveStartKey = req.params.LastEvaluatedKey;
  }
  docClient.scan(params, function (err, data) {
    if (!err) {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify([data]).slice(0, -1));
      if (typeof data.LastEvaluatedKey != "undefined") {
        res.write(', { "LastEvaluatedKey": ' +
                  JSON.stringify(data.LastEvaluatedKey) + '}]');
      } else {
        res.write(', { "LastEvaluatedKey": "undefined"}]');
      }
    }
    res.end();
  });
});

// Post Example
app.post('/api/:table/:key/:value', function (req, res) {
  if (req.params.table === req.body.TableName && req.params.Item) {
    var params = {
      Key: {},
      TableName: req.params.table
    };
    params.Key[req.params.key] = {S: req.params.value};
    ddb.putItem(req.body, function(err, data) {
      if (!err) {
        res.send('200');
      }
    });
  } else {
    res.send('400');
  }
});

app.listen(port);
