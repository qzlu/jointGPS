
var dict = {};
function setLanguage(lang, path) {
    setCookie("lang=" + lang + "; Path =/;");
    translate(path);
}

function getCookieVal(name) {
    var items = document.cookie.split(";");
    for (var i in items) {
        var cookie = $.trim(items[i]);
        var eqIdx = cookie.indexOf("=");
        var key = cookie.substring(0, eqIdx);
        if (name == $.trim(key)) {
            return $.trim(cookie.substring(eqIdx + 1));
        }
    }
    return null;
}

function setCookie(cookie) {
    document.cookie = cookie;
}

function translate(path) {
    loadDict(path);

    $("[lang]").each(function () {
        switch (this.tagName.toLowerCase()) {
            case "input":
                $(this).val(__tr($(this).attr("lang")));
                break;
            default:
                $(this).text(__tr($(this).attr("lang")));
        }
    });
}

function __tr(src) {
    return (dict[src] || src);
}

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}

function loadDict(path) {
    var lang = (getCookieVal("lang") || "en");

    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: path + lang + ".json",
        success: function (msg) {
            if (isEmptyObject(dict)) {
                dict = eval(msg);
            } else {
                dict = $.extend(dict, eval(msg));
            }
                
        }
    });

    //$.ajax({
    //    async: false,
    //    type: "get",
    //    dataType: "jsonp",
    //    url: "http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x=113.540124&y=23.517846",
    //    success: function (data) {
    //        var tranPos = eval(data);
    //        var nowpos = GetMapObj().GetPosition(tranPos.x, tranPos.y);
    //        alert(nowpos.lat);
    //    }
    //});

}

function registerWords() {
    $("[lang]").each(function () {
        switch (this.tagName.toLowerCase()) {
            case "input":
                $(this).attr("lang", $(this).val());
                break;
            default:
                $(this).attr("lang", $(this).text());
        }
    });
}
clearInput();
function clearInput() {
    //添加"*"号
    $("label.red").addClass("MustFillThis");
    //给"*"号定位
    $("input[type='text'], input[type='password']").addClass("Input")
    /*显示清除input框按钮*/
    $(".Input").each(function () {
        var _this = $(this);
        $(this).focus(function () {
            $(this).parent().find(".clearInput").removeClass("hide");
        });
        $(this).blur(function () {
            setTimeout(function () {
                _this.parent().find(".clearInput").addClass("hide");
            }, 200)
            
        });
    });
    //清除input框
    $(document).on("click", ".clearInput", function () {
        $(this).parent().find(".Input").val("");
        $(this).prev().val("");
    });
}

addClearInput();
function addClearInput() {
    //添加清除按钮
    var html = '<a href="javascript:;" class="clearInput hide"></a>';
    $("input[type='text']").after(html);
    $("input[type='password']").after(html);
    
    $("#ValidateCode, .date-picker, #ManagerPsw, #ManagerName, #mFKey, #SearchText, #mFTrackTimeE, #mFTrackTimeB,#mFOUName,.nav-search-input,#mFStartDateTimeB,#mFStartDateTimeE,#mFDateTimeB,#mFDateTimeE").removeClass("Input").next(".clearInput").remove();
    $("#searchCarsInput").after(html);

}
//导出报表按钮图标切换
iconToggle(".dropdown-toggle", ".glyphicon", ".btn-group", "open","glyphicon-folder-open", "glyphicon-folder-close");
function iconToggle(btnClass, className1, className2, className3, className4, className5) {
    $(btnClass).click(function () {
        var tag = $(this).find(className1);
        var parentTag = $(this).parent(className2);
        if (parentTag.hasClass(className3)) {
            tag.removeClass(className4).addClass(className5);
        } else {
            tag.removeClass(className5).addClass(className4);
        }
    });
}

//坐标纠偏
function fixGPSPoint(lat, lon) {
    var gcjlatlng = GPS.gcj_encrypt(lat, lon);
    var bdlatlng = GPS.bd_encrypt(gcjlatlng.lat, gcjlatlng.lon);
    return bdlatlng;
}




