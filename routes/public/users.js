var express = require('express');
var request=require("request");
var base=require("../base");
var router = express.Router();
var currModulePre="user/";
//var baseParams=base.baseParams;
var baseParams= Object.assign({}, base.baseParams);

baseParams.modulePath=base.baseParams.basePath+currModulePre;

//登陆页面
router.get("/login", function(req, res, next) {
    var requestUrl=base.baseParams.services.userServicePath+'public/loginPage';
    var jadePath='public/login';
    var custParams={requestUrl:requestUrl,jadePath:jadePath};
    base.post_method(req, res, next,baseParams,custParams);
});


//登陆
router.post("/doLogin", function(req, res, next) {

    //console.log("----------"+JSON.stringify(req.body));
    var requestUrl=base.baseParams.services.userServicePath+base.baseParams.publicServicePre+'dologin';
    //var params=req.query;
    var params=req.body;
    var options = {
        url: requestUrl,
        method: 'POST',
        json:true,
        xhrFields: {
            withCredentials: true // 携带跨域cookie
        },
        headers:req.headers,
        form:params
    };
    console.log("service request url:"+requestUrl+",params:"+JSON.stringify(params));
    request.post(options, function (error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log("servive response:"+JSON.stringify(data).substring(0,100)) // 打印
            for (var x in baseParams) {
                if ("_locals" != x) {
                    data[x] = baseParams[x];
                }
            }
            if(data.code=='0000'){
                res.cookie("userInfo", data.userInfo, {maxAge: 1000*60*60*2,httpOnly: true});
                res.cookie("token", data.token, {maxAge: 1000*60*60*2,httpOnly: true});
                console.log("-----data-----"+JSON.stringify(data));
                //base.renderPage('public/index', data,req, res, next);
                res.redirect("/personal/getMyArticlePage");
            }else{
                //base.renderPage('public/login', data,req, res, next);
                res.redirect("/user/login");
            }

        }else{
            console.log(response.statusCode);
        }
    });

});

//退出
router.get("/logout", function(req, res, next) {

    var requestUrl=base.baseParams.services.userServicePath+base.baseParams.privateServicePre+'logout';
    var options = {
        url: requestUrl,
        method: 'POST',
        json:true,
        xhrFields: {
            withCredentials: true // 携带跨域cookie
        },
        headers:req.headers
    };
    request.post(options, function (error, response, data) {
        if (!error && response.statusCode == 200) {
            res.clearCookie('userInfo');
            res.clearCookie('token');
            res.render('public/index', baseParams);
        }else{
            console.log(response.statusCode);
        }
    });

});

module.exports = router;
