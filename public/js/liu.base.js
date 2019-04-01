/**
 * 个人整理常用js工具类
 * Created by liujie on 2017-5-16.
 */
var liu = (function () {
    /**
     * 一般验证
     * @param value
     */
    function liu_validate(name, value) {
        var regex;
        switch (name) {
            case 'name':
                regex = /^[0-9a-zA-Z\u4e00-\u9fa5_]{2,16}$/;
                break;
            case 'phone':
                regex = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                break;
            case 'amount':
                regex = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                break;
        }
        return regex.test(value);
    }

    /**
     * 一般格式化
     * @param name
     * @param value
     */
    function liu_format(name, params) {
        switch (name) {
            case 'format_amount':
                return liu_formatMoney1(params.value, params.scale);
                break;
            case 'format_amount2':
                return liu_formatMoney2(params.value, params.scale);
                break;
            case 'unformat_amount':
                return liu_unFormatMoney(params.value);
                break;
            case 'format_date':
                return liu_dateformat(params.date,params.dateformat);
                break;
        }
    }

    /**
     * 金额格式化（四舍五入）
     * @param s
     * @param n
     * @returns {string}
     */
    function liu_formatMoney1(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }

    /**
     * 金额格式化（非四舍五入）
     * @param s
     * @param n
     * @returns {string}
     */
    function liu_formatMoney2(number, decimals){
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,

            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            dec = '.',
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.floor(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.floor(n)).split('.');


        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    /**
     * 还原金额格式化
     * @param s
     * @returns {Number}
     */
    function liu_unFormatMoney(s) {
        var ret = (s + "").replace(/[^\d\.-]/g, "");
        return parseFloat(ret);
    }

    /**
     * 导出
     * @param params
     */
    function liu_export(params) {
        liu_createHiddenForm(params);
        var formName = params.formName ? params.formName : 'tempLiuForm';
        $("#" + formName).submit();
    }

    /**
     * 创建隐藏表单
     */
    function liu_createHiddenForm(params) {
        var formName = params.formName ? params.formName : 'tempLiuForm';
        $("#" + formName).remove();
        var target=(params.formTarget!='undefined')?"target='"+params.formTarget+"'":"";
        var form = $("<form id='" + formName + "' action='" + params.url + "' method='post'"+target+"></form>");
        for (var i = 0; i < params.input_hidden.length; i++) {
            var hidden_input = "<input name='" + params.input_hidden[i].name + "' value='" + params.input_hidden[i].value + "' type='hidden'/>";
            $(hidden_input).appendTo($(form));
        }
        form.appendTo(document.getElementsByTagName("body")[0]);
    }

    /**
     * 序列化表单为json
     * */
    function liu_serializeJson(params){
        var formId = params.formId ? params.formId : 'tempLiuForm';
        var obj=$("#"+formId);
        var serializeObj={};
        var array=obj.serializeArray();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    }

    function liu_getUrlParams(){
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    /**
     * 初始化三级联动
     * @example
     */
    function liu_initArea(params) {

        var areaJson;
        var temp_html;
        var oProvince = $("#" + params.select.provinceId);
        var oCity = $("#" + params.select.cityId);
        var oDistrict = $("#" + params.select.districtId);

        //初始化省
        var province = function () {
            $.each(areaJson, function (i, province) {
                temp_html += "<option value='" + province.code + "'>" + province.name + "</option>";
            });
            oProvince.html(temp_html);
            city();
        };

        //赋值市
        var city = function () {
            temp_html = "";
            var n = oProvince.get(0).selectedIndex;
            $.each(areaJson[n].children, function (i, city) {
                temp_html += "<option value='" + city.code + "'>" + city.name + "</option>";
            });
            oCity.html(temp_html);
            district();
        };
        //赋值县
        var district = function () {
            temp_html = "";
            var m = oProvince.get(0).selectedIndex;
            var n = oCity.get(0).selectedIndex;
            if (typeof(areaJson[m].children[n].children) == "undefined") {
                oDistrict.css("display", "none");
            } else {
                oDistrict.css("display", "inline");
                $.each(areaJson[m].children[n].children, function (i, district) {
                    temp_html += "<option value='" + district.code + "'>" + district.name + "</option>";
                });
                oDistrict.html(temp_html);
            }
            ;
        }


        //选择省改变市
        oProvince.change(function () {
            city();
        });
        //选择市改变县
        oCity.change(function () {
            district();
        });

        //获取json数据
        $.getJSON(params.url, function (data) {
            areaJson = data;
            province();
        });


    }

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
    function liu_dateformat(date,fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    return {
        /**
         * 表单常用验证
         * @param name
         * @param value
         * @returns {*}
         */
        validate: function (name, value) {
            return liu_validate(name, value);
        },
        /**
         * 字符串格式化
         * @param name
         * @param value
         * @returns {*}
         */
        format: function (name, value) {
            return liu_format(name, value);
        },
        /**
         * 页面导出功能
         * @param params
         */
        pageExport: function (params) {
            liu_export(params);
            return "";
        },
        /**
         * 创建隐藏表单
         * @param params
         * var params={url:'http://www.baidu.com',
                input_hidden:[{name:'username',value:'sss'},{name:'test',value:'sdsf'}]};
         * @example
         */
        createHiddenForm: function (params) {
            liu_createHiddenForm(params);
            return "";
        },
        /**
         * 初始化三级联动
         * @param var params={url:'${basePath}/static/js/liu/area.json',select:{provinceId:'provinceId',cityId:'cityId',districtId:'districtId'}}
         * @example
         */
        initArea: function (params) {
            liu_initArea(params);
            return "";
        },
        /**
         * 清空表单
         * @param params={id:''}
         */
        clearForm: function (params) {
            var id = params.id;
            $(':input', '#' + id)
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            $("#" + id).submit();
            return "";
        },
        /**
         * 序列化表单
         * @param params={formId:''}
         */
        serializeJson: function (params) {
            return liu_serializeJson(params);
        },
        /**
         * 获取url参数
         */
        getUrlParams:function(){
            return liu_getUrlParams();
        }

    }
})()

