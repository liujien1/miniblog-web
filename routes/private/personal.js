var express = require('express');
var base=require("../base");

var router = express.Router();
var currModulePre="personal/";
var baseParams= Object.assign({}, base.baseParams);

baseParams.modulePath=base.baseParams.basePath+currModulePre;


//我的文章
router.get("/getMyArticlePage", function(req, res, next){
    base.renderPage('private/personal/my_article', baseParams,req, res, next);
});

//我的文章列表
router.get("/getMyArticleList", function(req, res, next){
    var requestUrl=base.baseParams.services.blogServicePath+'private/personal/getMyArticleList';
    var jadePath='private/personal/my_article_list';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);
});

//我的文章列表
router.get("/getAllCategory", function(req, res, next){
    var requestUrl=base.baseParams.services.blogServicePath+'private/personal/getAllCategory';
    var jadePath='private/personal/my_article_category';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);
});

//修改我的文章页面
router.get("/updateMyArticlePage", function(req, res, next){
    var requestUrl=base.baseParams.services.blogServicePath+'private/personal/updateMyArticlePage';
    var jadePath='private/personal/my_article_update';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);
});

//添加我的文章页面
router.get("/addMyArticlePage", function(req, res, next){

    var requestUrl=base.baseParams.services.blogServicePath+'private/personal/getAllCategory';
    var jadePath='private/personal/my_article_add';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);
});

//修改我的文章
router.post("/updateMyArticle", function(req, res, next){
    var requestUrl=base.baseParams.services.blogServicePath+'private/personal/updateMyArticle';
    var jadePath='';
    var custParams={requestUrl:requestUrl,jadePath:jadePath,redirect:"/personal/getMyArticlePage"};
    base.post_method(req, res, next,baseParams,custParams);
});

//添加我的文章
router.post("/addMyArticle", function(req, res, next){
    var requestUrl=base.baseParams.services.blogServicePath+'private/personal/addMyArticle';
    var jadePath='private/personal/my_article_list';
    var custParams={requestUrl:requestUrl,jadePath:jadePath,redirect:"/personal/getMyArticlePage"};
    base.post_method(req, res, next,baseParams,custParams);
});

//设置页面
router.get("/settingPage", function(req, res, next){
    var requestUrl=base.baseParams.services.blogServicePath+'private/personal/getAllCategory';
    var jadePath='private/personal/my_setting';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    baseParams.category=1;
    base.post_method(req, res, next,baseParams,custParams);

});

module.exports = router;
