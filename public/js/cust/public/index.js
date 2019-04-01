$(function(){

    load_list();
    load_right();

    searchBtnClick();
})

//列表
function load_list(){

    goPage(1);
}

//右侧
function load_right(){
    var basePath=$("#basePath").val();
    $.get(basePath+"getReadTops",function (data) {
        $("#showReadTops").html(data);
    })
}

function goPage(pageIndex){
    var basePath=$("#basePath").val();
    var extendSearch=$("#extendSearch").val();
    var params={pageIndex:pageIndex,extendSearch:extendSearch};
    $.get(basePath+"getBlogList",params,function (data) {
        $("#showBlogs").html(data);
    })
}

function searchBtnClick(){

    $("#searchBtn").on("click",function(){
        goPage(1);
    })
}

/**
 * 分页方法
 * @param type 类型 up:上一页 next:下一页
 */
function page(type){
    var pageIndex = $("#pageIndex").val();
    if(type == "up"){
        pageIndex--;
        if(pageIndex <= 0){
            alert("当前已经是第一页");
            return false;
        }
    }else{
        pageIndex++;
        var totalPage = $("#totalPage").val();;
        if(pageIndex > totalPage ){
            alert("当前已经是最后一页");
            return false;
        }
    }
    goPage(pageIndex);
}