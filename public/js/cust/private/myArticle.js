$(function(){

    load_list();

    load_right();

    searchBtnClick();
})

//列表
function load_list(){

    goPage(1);
}

//分页搜索
function goPage(pageIndex){
    var basePath=$("#basePath").val();
    var extendSearch=$("#extendSearch").val();
    var params={pageIndex:pageIndex,extendSearch:extendSearch};
    $.get(basePath+"personal/getMyArticleList",params,function (data) {
        $("#showBlogs").html(data);
    })
}

//搜索
function searchBtnClick(){

    $("#searchBtn").on("click",function(){
        goPage(1);
    })
}

//分类搜索
function searchByCategory(category){
    var basePath=$("#basePath").val();
    var params={pageIndex:1,category:category};
    $.get(basePath+"personal/getMyArticleList",params,function (data) {
        $("#showBlogs").html(data);
    })
}

function load_right(){

    var basePath=$("#basePath").val();
    $.get(basePath+"personal/getAllCategory",null,function (data) {
        $("#showMyArticleCategory").html(data);
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