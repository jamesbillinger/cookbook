/**
 * Created by jamesbillinger on 4/2/17.
 */
require('babel-core/register')();
var express = require('express');

var app = express();
app.use(express.static('public'));
app.use(express.static('files'));

var router = express.Router();
var manifest = require(__dirname + '/public/dist/assets.json');
app.get('/*', function(req, res) {
  res.render('index', {
    NODE_ENV: process.env.NODE_ENV || 'production',
    chunk: manifest && manifest.app && manifest.app.js
  });
});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(router);
var server = app.listen(3000);
console.log('Web Server started on port 3000');