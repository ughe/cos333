const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000

app.get('/', (req, res) => res.send('hello, world'))

app.listen(port);
