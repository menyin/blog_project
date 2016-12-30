var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var app = express();
var connect = require("connect");
//var MongoStore = require('connect-mongo')(connect);
var settings = require('./settings');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.locals._layoutFile='layout2';//此设置无效
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var session = require('cookie-session');
var MongoStore = require('connect-mongo')(connect);
// 设置 Session
// 注意此处的session是要额外引入(Express4.x将许多模块踢掉原因)，原项目直接用Express.session(...)
//app.use(session({
//    secret: settings.cookieSecret,
//    store: new MongoStore({
//        host: settings.host,
//        db: settings.db,
//        port: 27017
//    })
//}));

app.use(function (req,res,next) {
    var err=req.session.error;
    var msg=req.session.success;
    //删除原有属性
    delete req.session.error;
    delete req.session.success;
    res.locals.message='';
    if (err) {
        res.locals.message ='<div class="alert alert-error">' + err + '</div>';
    }
    if (msg) {
        res.locals.message ='<div class="alert alert-success">' + msg + '</div>';
    }
    next();
});
//使用中间件把user设置成动态视图助手
app.use(function(req, res, next){
    res.locals.user=req.session.user;
    //res.locals({
    //    user:req.session.user
    //})
    next();
})
//ҳ��·�ɹ滮
app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/loginOut', routes.loginOut);

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


module.exports = app;
