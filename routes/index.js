var user = require('../models/User');
module.exports.index = function (req, res) {
    user.find("陈芳", function (err, user) {
        res.render('index', {title: '首页', user: user, layout: 'layout'});
    });
};
module.exports.reg = function (req, res) {
    res.render('reg');
};

module.exports.doReg = function (req, res) {
    if (req.body['password'] != req.body['password-repea']) {
        res.session.error = '两次密码输入不一致！';
        return res.redirect('reg');
    }

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
    res.render('doLogin');
};
module.exports.loginOut = function (req, res) {
    res.render('loginOut');
};