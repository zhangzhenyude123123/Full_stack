var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/reg',function (req,res){

});

router.get('/login',function (req,res){

});

router.get('/logout',function (req,res){

});
module.exports = router;