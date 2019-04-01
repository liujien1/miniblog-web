$(function(){

    changeValidPic();

    $("#verifyCodePic").on("click",function(){

        changeValidPic();
    })

    $("#loginBtn").on("click",function(){
        $("#subform").submit();

    })

    //调用登录按钮的登录事件
    document.onkeydown = function (event) {
        var e = event || window.event;
        if (e && e.keyCode == 13) { //回车键的键值为13
            $("#loginBtn").click();
        }
    };
})

function changeValidPic(){
    var userServicePath=$("#userServicePath").val();
    var imgUrl=userServicePath+"public/verifyCode";

    $.ajax({
        type: 'get', // 获取头信息，type=HEAD即可
        url : imgUrl,
        xhrFields: {
            withCredentials: true // 携带跨域cookie
        },
        success: function( data){

            base.setCookie("uuid",data.uuid);
            $("#verifyCodePic").attr("src",data.imageSrc);
        }
    });
}