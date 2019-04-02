const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

// AWS
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_DYNAMO_ACCESS_KEY,
  region: 'us-east-1'
});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();


// Routing
app.get('/hello', (req, res) => res.send('hello, world'));

// Instructions
app.get('/api', (req, res) => res.send('/api/:table{/:key/:value{/create}}'));

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
/*
app.post('/api/:table/:key/:value', function (req, res) {
  if (req.params.table === req.body.TableName &&
      req.params.Item)
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
});
*/

app.use(express.static(path.resolve(__dirname+'/../frontend/build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});

app.listen(port);
