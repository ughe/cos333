const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000

app.get('/hello', (req, res) => res.send('hello, world'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'findex.html'));
});

app.listen(port);
