var base = {}

base.alert=function (msg){
    alert(msg);
}

base.confirm=function (msg,fn){
    $("#confirmModal").modal('show');
    $("#confirm-message").html(msg);
    $("#comfirm-ok").on("click",function(){
        fn();
    })
}

base.delete=function(url,params){
    base.confirm("确定删除？",function(){
        $.ajax({
            type: "post",
            url: url,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            data:params,
            success: function(data) {
                if(data.errorCode==0){
                    location.href=location.href;
                }else{
                    base.alert(data.message);
                }
            }
        })
    })
}

//写cookies
base.setCookie=function(name,value){
    var exp = new Date();
    exp.setTime(exp.getTime() + 15*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/";
}

//读取cookies
base.getCookie=function(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}