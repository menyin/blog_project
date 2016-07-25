var User = require('../models/User');
var crypto = require('crypto');//NodeJS加密解密模块
module.exports.index = function (req, res) {
        res.render('index', {title: '首页', layout:'layout'});
};
module.exports.reg = function (req, res) {
    res.render('reg');
};

module.exports.doReg = function (req, res) {
    if (req.body['password'] != req.body['password-repeat']) {
        req.session.error = "两次密码输入不一致";
        return res.redirect('reg');
    }
    var md5 = crypto.createHash('md5');
    //update是加密操作 digest是加密方式
    var password=md5.update(req.body["password"]).digest("base64");
    var newUser = new User({
        name:req.body["username"],
        password:password
    });
    User.find(newUser.name, function (err,user) {
        if (user) {
            req.session.error = "此用户已存在！";
            return res.redirect('reg');
        }
        newUser.save(function (err) {
            if (err) {
                req.session.error = err;
                res.redirect('reg');
            }else {
                req.session.user = newUser;
                req.session.success = '注册成功';
                res.redirect('/');
            }
        });
    })

};
module.exports.user = function (req, res) {
    res.render('user');
};
module.exports.post = function (req, res) {
    res.render('post');
};

module.exports.login = function (req, res) {
    res.render('login');
};
module.exports.doLogin = function (req, res) {
    var userName = req.body["username"];
    var userPassword = req.body["password"];
    var md5 = crypto.createHash('md5');
    var md5Password = md5.update(userPassword).digest('base64');
    User.find(userName, function (err,user) {
        if (err) {
            req.session.error=err;
            res.redirect('login');
        }else {
            if (user) {
                if (user.password==md5Password) {
                    req.session.user=user;
                    res.redirect('/');
                }else {
                    req.session.error="密码不正确！";
                    res.redirect('login');
                }

            }else {
                req.session.error="用户不存！";
                res.redirect('login');
            }

        }
    });

};
module.exports.loginOut = function (req, res) {
     //res.send('loginOut');
    req.session.user=null;
    req.session.message = "退出成功";
   res.redirect('/');
};

