var request=require("request");
var cookieParser = require('cookie-parser');
var base = {}

//var miniblog="https://www.xyblogs.site";
var miniblog="http://127.0.0.1:3000";


//var ip="www.xyblogs.com"
var ip="127.0.0.1"
//var basePath="http://"+ip+":38151/";
var basePath="http://"+ip+":3000/";
//网关接口
//var servicePath="http://"+ip+":38152/";
var servicePath="http://"+ip+":12002/";

var services={
    userServicePath:servicePath+"service-user/",
    blogServicePath:servicePath+"service-blog/"
}

var publicBaseParams={
    miniblog:miniblog,
    basePath:basePath,
    indexUrl:basePath+"index",
    servicePath:servicePath,
    publicServicePre:"public/",
    privateServicePre:"private/",
    services:services
};

base.baseParams=publicBaseParams;

//post方法
base.post_method=function(req, res, next,baseParams,custParams){
    //console.log("header:"+JSON.stringify(req.headers));
    var params={};

    var getParams=req.query;
    var postParams=req.body;
    for (var x in getParams)
        if("_locals"!=x) {
            params[x] = getParams[x];
        }
    for (var x in postParams)
        if("_locals"!=x) {
            params[x] = postParams[x];
        }

    //console.log(params);
    var options = {
        //headers: {"Connection": "close"},
        headers:req.headers,
        url: custParams.requestUrl,
        method: 'POST',
        json:true,
        form:params
    };
    console.log("service request url:"+custParams.requestUrl+",params:"+JSON.stringify(params).substring(0,100));
    request.post(options, function (error, response, data) {
        if (!error && response.statusCode == 200) {
            //console.log("servive response:"+JSON.stringify(data).substring(0,100)) // 打印
            for (var x in baseParams)
                if("_locals"!=x) {
                    //console.log(x + "," + baseParams[x]);
                    data[x]=baseParams[x];
                }
            if(custParams.redirect){
                res.redirect(custParams.redirect);
            }else {
                base.renderPage(custParams.jadePath, data, req, res, next);
            }
        }else{
            console.log("statusCode:"+response.statusCode);
            //token过期
            if(response.statusCode == 401){
                res.clearCookie('userInfo');
                res.clearCookie('token');
                res.redirect("/index");
            }
        }
    });
}

//页面渲染
base.renderPage=function (path,baseParams,req,res,next) {


    var params=Object.assign({}, baseParams);
    console.log("----cookie:"+JSON.stringify(req.cookies));
    var cookie=req.cookies;
    //console.log("----userInfo:"+cookie.userInfo);
    var queryParams=req.query;
    for (var x in queryParams)
        params[x]=queryParams[x];
    console.log("----queryParams:"+JSON.stringify(queryParams))
    if(typeof(cookie.userInfo)!='undefined'){
        if(typeof(cookie.userInfo)=='string'){
            params.userInfo=JSON.parse(cookie.userInfo);
        }else{
            params.userInfo=cookie.userInfo;
        }

    }else{
        //未登录，跳转主页
        if(path.indexOf("public")==-1){
            res.render("public/index", params);
            return;
        }
    }
    res.render(path, params);
}

module.exports=base;