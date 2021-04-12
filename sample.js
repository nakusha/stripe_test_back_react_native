'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var http = require('http');
var https = require('https');

// increase the default limit globally
// 0 to turn off the limit
require('events').EventEmitter.prototype._maxListeners = 100;

// load common module
var admin = require('./module/firebase').admin;
var dbclient = require('./module/dbconn');


// Router
var routes = require('./routes/index');
var service_user = require('./routes/user');
var service_payment = require('./routes/payment');
var service_account = require('./routes/account');
var service_follow = require('./routes/follow');
var service_service = require('./routes/service');
var service_game = require('./routes/game');
var service_ignore = require('./routes/ignore');
var service_report = require('./routes/report');

var admin_notice = require('./routes/adminNotice');
var admin_faq = require('./routes/adminFaq');
var admin_member = require('./routes/adminMember');
var admin_payment = require('./routes/adminPayment');
var admin_user = require('./routes/adminUser');
var admin_report = require('./routes/adminReport');
//var userInfo = require('./routes/userInfo');
//var restapi = require('./routers/restapi');

// SSL Certification
const sslOption = {
    //ca: fs.readFileSync('./SSLCertificate/COMODORSADomainValidationSecureServerCA.crt'),
    key: fs.readFileSync('./SSLCertificate/rankers_kr.key.pem'),
    cert: fs.readFileSync('./SSLCertificate/rankers_kr.crt.pem')
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var whitelist = [
  'http://localhost:3000', 
  'http://localhost:80', 
  'http://localhost:433', 
  'https://rankers.kr', 
  'https://rankers.kr:433', 
  'https://admin.rankers.kr',
  'https://admin.rankers.kr:433',
]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true,credentials: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


app.use(cors(corsOptionsDelegate));
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));

// Router
//console.log("Flag01");
app.use('/', routes);
app.use('/services/user', service_user);
app.use('/services/user/follow', service_follow);
app.use('/services/user/ignore', service_ignore);
app.use('/services/user/report', service_report);
app.use('/services/payment', service_payment);
app.use('/services/account', service_account);
app.use('/services/service', service_service);
app.use('/services/game', service_game);

//admin
app.use('/admin/member', admin_member);
app.use('/admin/user', admin_user);
app.use('/admin/payment', admin_payment);
app.use('/admin/notice', admin_notice);
app.use('/admin/faq', admin_faq);
app.use('/admin/report', admin_report);


//app.use('/ranerks/server/restapi', restapi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
});

app.set('port', process.env.PORT || 7430);

var httpsServer = https.createServer(sslOption, app).listen(app.get('port'), function () {
    console.log((new Date()).toLocaleString('en-US', { timeZone: "Asia/Seoul" }));
    console.log('Express https server listening on port ' + httpsServer.address().port);

});

var httpServer = http.createServer(app).listen((parseInt(app.get('port'))+1), function () {
    console.log('Express http server listening on port ' + httpServer.address().port);
});

//console.log("Flag10");

//process.on('SIGTERM', function () {
//    // closing process
//    console.log("Flag11");
//    dbclient.end();

//    server.close(function () {
//        // process exit
//        console.log("Flasg12");
//        process.exit(0);
//    });
//});
