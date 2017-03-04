/**
 * Created by jamesbillinger on 3/4/17.
 */
require('babel-core/register')();
var express = require('express');
var tracer = require('tracer');
var winston = require('winston');
var expressWinston = require('express-winston');


global.logger = tracer.console();
global.log = tracer.console().log;
global.info = tracer.console().info;
global.trace = tracer.console().trace;
global.debug = tracer.console().debug;
global.warn = tracer.console().warn;
global.error = tracer.console().error;

var app = express();
app.use(express.static('public'));
app.use(express.static('files'));

var router = express.Router();

var routes = function(app) {
  app.get('/*', function(req, res) { res.render('index', {
    NODE_ENV: process.env.NODE_ENV || 'production'
  }); });
};

routes(app);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

if (process.env.NODE_ENV != 'development') {
  var msg = [
    '{{(req.headers && req.headers["x-forwarded-for"]) || (req.connection && req.connection.remoteAddress) || "-"}}',
    '-',
    '{{[new Date()]}}',//custom
    '{{req.user && req.user.email || "-"}}',
    '"{{req.headers["user-agent"] || "-"}}"'
  ].join(' ');

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true
      })
    ],
    meta: false,
    msg: msg,
    expressFormat: false,
    colorStatus: true,
    ignoreRoute: function (req, res) {
      return false;
    }
  }));
}

app.use(router);
var server = app.listen(3000);
log('Web Server started on port 3000');