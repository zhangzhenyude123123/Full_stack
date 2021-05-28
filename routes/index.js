var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var crypto = require('crypto');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', {
//     title: 'MainPage'
//   });
// });
router.get('/', function(req, res) {
    Post.get(null, function(err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index', {
            title: 'MainPage',
            posts: posts,
        });
    });
});

/* Register */
router.get('/reg', checkNotLogin);
router.get('/reg',function (req,res){
    res.render('reg', {
        title: 'Register',
    });
});
router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res) {
    //檢驗用戶兩次輸入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
        req.flash('error', '兩次輸入的口令不一致');
        return res.redirect('/reg');
    }

    //生成口令的散列值
    const md5 = crypto.createHash('md5');
    const password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
        name: req.body.username,
        password: password,
    });

    //檢查用戶名是否已經存在
    User.get(newUser.name, function(err, user) {
        if (user)
            err = 'Username already exists.';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在則新增用戶
        newUser.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '註冊成功');
            res.redirect('/');
        });
    });
});

/* Login */
router.get('/login', checkNotLogin);
router.get('/login',function (req,res){
    res.render('login', {
        title: 'Login',
    });
});
router.post('/login', checkNotLogin);
router.post('/login', function(req, res) {
    //生成口令的散列值
    const md5 = crypto.createHash('md5');
    const password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function(err, user) {
        if (!user) {
            req.flash('error', '用戶不存在');
            return res.redirect('/login');
        }
        if (user.password != password) {
            req.flash('error', '用戶口令錯誤');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');
    });
});

/* Logout */
router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}

/* postmicroblog */
router.post('/post',checkLogin);
router.post('/post',function (req,res){
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', 'Post Success');
        res.redirect('/u/' + currentUser.name);
    });
});

/* this is user to get there */
router.get('/u/:user', function(req, res) {
    User.get(req.params.user, function(err, user) {
        if (!user) {
            req.flash('error', '用戶不存在');
            return res.redirect('/');
        }
        Post.get(user.name, function(err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                posts: posts,
            });
        });
    });
});

module.exports = router;
