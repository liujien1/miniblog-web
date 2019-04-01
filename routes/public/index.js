var express = require('express');
var base=require("../base");

var router = express.Router();
var currModulePre="index/";
//var baseParams=base.baseParams;
var baseParams= Object.assign({}, base.baseParams);

baseParams.modulePath=base.baseParams.basePath+currModulePre;

router.get('/', function(req, res, next) {
    base.renderPage('public/index', baseParams,req, res, next);
});

router.get('/index', function(req, res, next) {
    base.renderPage('public/index', baseParams,req, res, next);
});


//博客列表
router.get("/getBlogList", function(req, res, next){
    var requestUrl=base.baseParams.services.blogServicePath+base.baseParams.publicServicePre+'getBlogList';
    var jadePath='public/index/index_blogs_list';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);
});


//阅读排行
router.get("/getReadTops", function(req, res, next) {
    var requestUrl=base.baseParams.services.blogServicePath+base.baseParams.publicServicePre+'getReadTops';
    var jadePath='public/index/index_blogs_right';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);

});


//查看文章
router.get("/getBlog", function(req, res, next) {
    var requestUrl=base.baseParams.services.blogServicePath+base.baseParams.publicServicePre+'getBlog';
    var jadePath='public/blog';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);

});



module.exports = router;
