//var map = new BMap.Map("container");          // 创建地图实例
var DistancePoints = [];//坐标数据
var Direction = [];//方向数据
var point = new BMap.Point(113.927137, 22.556735);  // 创建点坐标
var c = 0;
var t;
var map_Baidu;
var map_Google;
var map = "baidu";
var TrackJsonList = [];
var bubbleJson = "";
var s7;
var s8;
var sb;
$("#checkboxTable").show();
$("#trackPanel").show();
$(".widget-header-show>div").show();
$("#SearchText").show();
$("#map_tool0").show();
$("#map_tool1").show();
$("#map_tool2").show();
$("#map_tool3").show();
$("#map_tool4").show();
$("#myTab").show();
$(".myTab1").show();
//全局变量
var overlays = [];
var Marker = [];
var RouteMarker = [];
var StopPoints = [];
var polylinePoints = [];
var polyline;
var styleOptions = {
    color: "#005FC6",
    width: 4, //边线的宽度，以像素为单位。
    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
    strokeStyle: 'solid', //边线的样式，solid或dashed。
    IsArrow: true
}


function GetMapObj() {
    if (map == "baidu") {
        return map_Baidu;
    }
    else if (map == "google") {
        return map_Google;
    }
}


//设置路线样式
function setPolylineStyle() {
    polyline.setStrokeColor("black");//线的颜色
    polyline.setStrokeOpacity(1);//透明度
    polyline.setStrokeWeight(4);//线的宽度
    polyline.setStrokeStyle("solid");//设置是为实线或虚线，solid或dashed。
}

//回复原始路线
function RecoveryRoute() {
    //GetMapObj().cleanMap();
    styleOptions.color = "#005FC6";
    polyline = GetMapObj().createLine(polylinePoints, styleOptions);
    GetMapObj().addOverlay(polyline);

    //for (var i = 0; i <= StopPoints.length; i++) {
    //    StopPoints[i]
    //}
}

//运行段路线高亮事件
//function RunningBetween(RunningStratIndex, RunningEndIndex) {
//    RecoveryRoute();
//    var RunningBetweenPoint = [];
//    for (var i = RunningStratIndex; i <= RunningEndIndex; i++) {
//        RunningBetweenPoint.push(polylinePoints[i]);
//    }

//    //GetMapObj().cleanMap();
//    styleOptions.color = "#red";
//    var polyline = GetMapObj().createLine(RunningBetweenPoint, styleOptions);
//    GetMapObj().addOverlay(polyline);
//    GetMapObj().SetViewport(RunningBetweenPoint);
//}


//路线样式设置
//var styleOptions = {
//    color: "#005FC6",
//    width: 4, //边线的宽度，以像素为单位。
//    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
//    strokeStyle: 'solid', //边线的样式，solid或dashed。
//    IsArrow: true
//}



//显示选项控制
var showOptions = {
    showTime: "block",
    showDate: "block",
    showMileage: "block",
    showSpeed: "block",
    showStopTime: "block"
}

//返回总里程距离
function getAllDistance() {
    return GetMapObj().getDistance(polylinePoints[0], polylinePoints[polylinePoints.length - 1]);
}


//将轨迹点添加到路线上
function showPointInfoOnRoute(json) {
    // alert(data.S7);
    // var json = $.parseJSON(data);
    var temp = "";
    temp += "<span style='display:" + showOptions.showTime + "'>" + TransDate(json.S6) + "</span><br />";
    temp += "<span style='display:" + showOptions.showSpeed + "'>" + json.SA + "</span><br />";
    temp += "<span style='display:" + showOptions.showMileage + "'>" + json.SC + "</span><br />";
    // temp += "<span style='display:" + showOptions.showTime + "'>" + TransDate(json.S6) + "</span>";
    var point = GetMapObj().GetPosition(json.S8, json.S7);
    GetMapObj().SetLabel(point, "/assets/image/point.png", "<div>" + temp + "</div>");
    setMapCenterAndZoom(json.S8, json.S7);
}


//根据坐标设置最佳视图
function setMapCenterAndZoom(lon, lat) {
    var Zoom = GetMapObj().getZoom();
    var bounds = GetMapObj().getViewBounds();
    //console.log(bounds.ne.lon + "," + lon);
    if (bounds.ne.lon < lon) {
        GetMapObj().setMapCenterAndZoom(lon, lat, Zoom);
    } else if (bounds.ne.lat < lat) {
        GetMapObj().setMapCenterAndZoom(lon, lat, Zoom);
    } else if (bounds.sw.lon > lon) {
        GetMapObj().setMapCenterAndZoom(lon, lat, Zoom);
    } else if (bounds.sw.lat > lat) {
        GetMapObj().setMapCenterAndZoom(lon, lat, Zoom);
    }
}


//设置路线样式
function setPolylineStyle() {
    polyline.setStrokeColor("black");//线的颜色
    polyline.setStrokeOpacity(1);//透明度
    polyline.setStrokeWeight(4);//线的宽度
    polyline.setStrokeStyle("solid");//设置是为实线或虚线，solid或dashed。
}

//回复原始路线
function RecoveryRoute() {
    //GetMapObj().cleanMap();
    styleOptions.color = "#005FC6";
    polyline = GetMapObj().createLine(polylinePoints, styleOptions);
    GetMapObj().addOverlay(polyline);

    //for (var i = 0; i <= StopPoints.length; i++) {
    //    StopPoints[i]
    //}
}

//运行段路线高亮事件
function RunningBetween(RunningStratIndex, RunningEndIndex) {
    RecoveryRoute();
    var RunningBetweenPoint = [];
    //alert(RunningStratIndex + "," + RunningEndIndex);
    //alert(polylinePoints.length + ":" + polylinePoints[RunningStratIndex].lng + "," + polylinePoints[RunningEndIndex].lng);
    for (var i = RunningStratIndex; i < RunningEndIndex; i++) {
        RunningBetweenPoint.push(polylinePoints[i]);
    }
    //console.log(RunningBetweenPoint);
    // alert(RunningBetweenPoint.length + "," + RunningBetweenPoint[0].lng);
    //GetMapObj().cleanMap();
    styleOptions.color = "red";
    var Runningpolyline = GetMapObj().createLine(RunningBetweenPoint, styleOptions);
    styleOptions.color = "#005FC6";
    GetMapObj().addOverlay(Runningpolyline);
    GetMapObj().SetViewport(RunningBetweenPoint);
}

jQuery(function ($) {
    //多语言
/*    registerWords();
    var path = "/Language/MTM/Track/";
    translate(path);
    $("#hidePanelA").attr("title", __tr("Hide"));
    $("#showPanelA").attr("title", __tr("Show"));
    $("#xj-p-slow").attr("title", __tr("slow"));
    $("#xj-p-play").attr("title", __tr("play"));
    $("#xj-p-stop").attr("title", __tr("stop"));
    $("#xj-p-pause").attr("title", __tr("pause"));
    $("#xj-p-fast").attr("title", __tr("fast"));
    $("#mapSwitchA").attr("title", __tr("Switch satellite map"));
    $("#trackInfo_open").attr("title", __tr("Show historical track"));
    $("#trackInfo_close").attr("title", __tr("Hide historical track"));
    $("#searchCityTxt").attr("placeholder", __tr("type in key words"));
    $("#mFCoordinateFence").attr("placeholder", __tr("Fencing the coordinates of the point,Make a point,separated by '|'"));
    $("#mFDescription").attr("placeholder", __tr("Length less than or equal to 200 characters"));
    $("#mFDescriptionR").attr("placeholder", __tr("Is not required to enter,Length less than or equal to 200 characters"));
 */   //初始化变量
    var pageIndex = 1;
    var pageSize = 100;
    var varmFName;
    var varmFStatus;
    var varmFOUID;
    GetSysEnum("Area.Type", "mFType");
    GetSysEnum("DataFrom", "mFFrom");

    var url = location.href;
    var mfid = getQueryStringV(url, "mfid");
    var mfVehicle = getQueryStringV(url, "mfVehicle");
    $("#vehicleName").val(mfVehicle);
    $("#vehicleID").val(mfid);
    //初始化
    map_Baidu = new baiduAPI();
    //map_Google = new googleAPI();

    map_Baidu.InitBaidu("container");

    //加载地图选择项
    $.post(
          "/SCM/Maps/Query", { mPageIndex: 1, mPageSize: 1000, mFStatus: 10 },
          function (data) {
              if (!CheckDataStatus(data, $)) return;
              var Maps_json = $.parseJSON(data);
              for (var i = 0; i < Maps_json.mRecords.length; i++) {
                  if (Maps_json.mRecords[i].mFNumber == "google")
                      $("#Google").show();
                  if (Maps_json.mRecords[i].mFNumber == "baidu")
                      $("#Baidu").show();
              }

          }
      );



    function setHighLight(id) {
        $(id).find("tr").each(function (obj, index) {
            var _this = $(this);

            _this.click(function () {
                $(id).find("tr").removeClass("trbgcolor");
                $(this).addClass("trbgcolor");
            });
        });
    }

    ////GetSysEnum("Status", "mStatus");
    //var mapheight = $("#iframe", window.parent.document).attr("height") -110;
    ////console.log(mapheight);
    ////if (mapheight == 728) {
    ////    mapheight = 763
    ////} else if (mapheight == 416) {
    ////    mapheight = 451
    ////}
    //$("#container").css("height", mapheight);

    //$(".trackInfo_close").click(function () {
    //    $("#container").css("height", mapheight);
    //    $(".tab-tableinfo").addClass("hide");
    //    $(".trackInfo_open").removeClass("hide");
    //    $(this).addClass("hide");
    //    //console.log($(".BMap_mask").height())
    //});

    //$(".trackInfo_open").click(function () {
    //    $("#container").css("height", mapheight - 200);
    //    $(".tab-tableinfo").removeClass("hide");
    //    $(".trackInfo_close").removeClass("hide");
    //    $("#hidePanelA").click();
    //    $(this).addClass("hide");
    //});

    //选择页大小触发
    //$("#PageSize").change(function () {
    //    pageSize = $(this).select().val();
    //    pageIndex = 1;
    //    doQuery();
    //});



    //$(".searchbtn").click(function () {
    //    pageIndex = 1;
    //    doQuery();
    //});

    $("#vehicleName").focus(function () {
        $("#vehicleTree").removeClass("hide");

    });

    $("#container").click(function () {
        if (!$('#vehicleTree').is('.hide')) {
            HideCarTree();
            $("#vehicleName").blur();
        }

    });
    //点击展开关闭树形会使input框失去焦点
    //$("#vehicleName").focusout(function () {
    //    setTimeout(HideCarTree, 300);

    //});

    function HideCarTree() {
        $("#vehicleTree").addClass("hide");
    }
    //地图的放大缩小
    //$("[data-action=fullscreen]").on("click", function () {
    //    if (!$(this).hasClass("has")) {
    //        $("#container").css("height", mapheight + 100);
    //        $(this).addClass("has");
    //    } else {
    //        $("#container").css("height", mapheight);
    //        $(".tab-tableinfo").addClass("hide");
    //        $(this).removeClass("has");
    //    }

    //});
    var json = "";
    //绑定数据

    var companyinfo = window.parent.companyinfo;
    var _html = "";

    window.setTimeout(doQuery, 1);
    //第一次加载页面需要的数据
    function doQuery() {
        //$.post("/MTM/Monitor/QueryVehicle", { mFStatus: 10, mFOUID: companyinfo.mFID }, function (data) {

        //    var json = $.parseJSON(data);
        //    $.post("/ORGDialog/ORGDialog/doQuery", { mFOUID: companyinfo.mFOUID }, function (data) {
        //        BindData(data, json);

        //    });
        //});
        var vehiclejson = $.parseJSON(window.parent._jsonVehicles);
        var orgjson = window.parent._jsonORGDialog
        BindData(orgjson, vehiclejson);
    }

    function BindData(data, carjson) {
        json = $.parseJSON(data);
        var tabletemp = "<ul>";
        tabletemp += takeMenu(json.mObject, companyinfo.mFID, true, carjson);
        tabletemp += "</ul>";
        $("#vehicleTree").html(tabletemp);
        _html = "";
        BindOpenCloseClick();
        BindCarClick();
    }

    function BindCarData(json, carjson) {
        $.each(carjson.mRecords, function (index, obj) {
            if (json.mFID == obj.mFDeptID) {

                _html += '<li class="parent_li"><span class="width100 CheckCar" mFID="' + obj.mFID + '" mFLicense="' + obj.mFLicense + '"><i class="icon-folder-open"></i>' + obj.mFLicense + '</span>';
            }
            else if (obj.mFDeptID == "" && json.mFID == obj.mFOUID) {
                _html += '<li class="parent_li"><span class="width100 CheckCar" mFID="' + obj.mFID + '" mFLicense="' + obj.mFLicense + '"><i class="icon-folder-open"></i>' + obj.mFLicense + '</span>';
            }
        });
    }

    function takeMenu(all, id, bool, carjson) {
        for (var i = 0; i < all.length; i++) {

            var tempStart = "";
            var tempEnd = "";
            //以上定义按钮
            if (bool) {
                if (all[i].mFID == id) {
                    _html += "<li>";
                    _html += "<span class='width100 MotorcadeName'><i class='icon-folder-open'  value='" + all[i].mFID + "'></i><i class='ace-icon fa closeTree'></i>" + all[i].mFName + "</span>";

                    //_html += "<a>" + all[i].mFStatusText + "</a>";

                    _html += "" + tempStart + "" + tempEnd + "<ul>";
                    takeMenu(all, all[i].mFID, false, carjson);
                    BindCarData(all[i], carjson);
                    _html += "</ul></li>";
                }
            } else {
                if (all[i].mFParentID == id) {
                    _html += "<li>";
                    _html += "<span class='width100 MotorcadeName'><i class='icon-folder-open'  value='" + all[i].mFID + "'></i><i class='ace-icon fa closeTree'></i>" + all[i].mFName + "</span>";

                    //_html += "<a>" + all[i].mFStatusText + "</a>";

                    _html += "" + tempStart + "" + tempEnd + "<ul>";
                    takeMenu(all, all[i].mFID, false, carjson);
                    BindCarData(all[i], carjson);
                    _html += "</ul></li>";
                }
            }

        }
        return _html;
    }

    var mapheight = $("#iframe", window.parent.document).attr("height");


    var h = mapheight - 110;
    $("#container").css("height", h);

    //地图放大缩小
    var resizeSwitch = true;
    $("[data-action=fullscreen]").on("click", function () {

        if (!$(this).hasClass("has")) {
            $("#container").css("height", mapheight);
            $("#iframe", window.parent.document).attr("height", mapheight + 100);
            $(this).addClass("has");
            resizeSwitch = false;
        } else {
            $("#container").css("height", h);
            $(".tab-tableinfo").addClass("hide");
            $(this).removeClass("has");
            $("#iframe", window.parent.document).attr("height", mapheight);
            resizeSwitch = true;
        }
        //        } else {
        //            if (!$(this).hasClass("has")) {
        //                $("#container").css("height", 767);
        //                $(".jiankongtree").css("height", 767);
        //                $(this).addClass("has");
        //            } else {
        //                $(".tab-tableinfo").addClass("hide");
        //                $(this).removeClass("has");
        //            }
        //        }
    });
    OpenTable();
    function OpenTable() {
        //拖拽之前的初始值
        var mapheight1 = $("#iframe", window.parent.document).attr("height");
        var h1 = mapheight1 - 110;
        $("#container").css("height", h1);
        //tab_content = $(".tab-content").height();
        //AllCarTable = $("#AllCarTable").height();
        //jiankongtree = $(".jiankongtree").height();

        $(".trackInfo_close").unbind().click(function () {
            $("#container").css("height", h1);
            $(".tab-tableinfo").addClass("hide");
            $(".trackInfo_open").removeClass("hide");
            $(this).addClass("hide");
            //点击关闭Table后恢复默认
            //$(".tab-content").height(tab_content);
            //$("#AllCarTable").height(AllCarTable);
            //$(".jiankongtree").height(jiankongtree);
        });
        $(".trackInfo_open").unbind().click(function () {
            $("#container").css("height", h1 - 200);
            $(".tab-tableinfo").removeClass("hide");
            $(".trackInfo_close").removeClass("hide");
            $(this).addClass("hide");
        });
    }
    window.onresize = function () {
        if (resizeSwitch == false) {
            return
        }
        //拖拽之前的初始值
        OpenTable();
        $(".trackInfo_close").click();
    }

    //2D和卫星地图切换
    $("#mapSwitch").click(function () {
        //map.mapType = BMAP_SATELLITE_MAP;
        if ($("#mapSwitchA").html() == __tr("Satellite map")) {
            changeMapLiStyle(1);
            GetMapObj().changeMapType(1);
            //GetMapObj().maplet.setMapType(BMAP_HYBRID_MAP);
        } else {
            GetMapObj().changeMapType(0);
            changeMapLiStyle(0);
            // GetMapObj().maplet.setMapType(BMAP_NORMAL_MAP);
        }


    });

    function changeMapLiStyle(type) {
        try {
            if (type == 0) {
                $("#mapSwitchA").removeClass("flat");
                $("#mapSwitchA").addClass("satellite");
                $("#mapSwitchA").attr("title", __tr("switch Satellite map"));
                $("#mapSwitchA").html(__tr("Satellite map"))
            } else {
                $("#mapSwitchA").removeClass("satellite");
                $("#mapSwitchA").addClass("flat");
                $("#mapSwitchA").attr("title", __tr("switch Plane map"));
                $("#mapSwitchA").html(__tr("Plane map"))
            }
        } catch (ex) {
            catchTheException("changeMapLiStyle", ex)
        }
    };

    function BindCarClick() {
        $(".CheckCar").click(function () {
            $("#vehicleName").val($(this).attr("mFLicense"));
            $("#vehicleID").val($(this).attr("mFID"));
            $("#vehicleTree").addClass("hide");
        });
    }

    function BindOpenCloseClick() {
        $(".closeTree").unbind("click").click(function () {
            $(this).removeClass("closeTree");
            $(this).addClass("openTree");
            $(this).parent().parent().children("ul").addClass("hide");
            BindOpenCloseClick();
        });

        $(".openTree").unbind("click").click(function () {
            $(this).removeClass("openTree");
            $(this).addClass("closeTree");
            $(this).parent().parent().children("ul").removeClass("hide");
            BindOpenCloseClick();
        });

    }

    //控制条配置
    var options = {
        speed: 400,
        lowerBound: 0.000001,
        upperBound: 10
    };

    $(".progress-new").click(function (e) {
        e.preventDefault();
        var position = checkBoundaries((((e.pageX - $(".progress-new").offset().left) / ($(".progress-new").outerWidth())) * 100).toFixed(6));
        SetPosition(position);

    });

    //var point = GetMapObj().GetPosition(json.S8, json.S7);

    function SetPosition(position) {
        //$("#showTime").stop().animate({
        //    left: (position - 100) + '%'
        //}, 0);
        $("#progress-yuan").stop().animate({
            left: position + '%'
        }, 0);

        var temp = 0;
        for (var i = 0; i < Direction.length; i++) {
            temp = (i / Direction.length) * 100;
            if (temp > position) {
                var point = GetMapObj().GetPosition(Direction[i].S8, Direction[i].S7);
                //marker.setPosition(point);
                c = i;
                return;
            }
        }
    }

    //$("#progress-yuan").mouseover(function (e) {
    //    e.preventDefault();
    //    $("#showTime").removeClass("hide");
    //}).mouseout(function (e) {
    //    $("#showTime").addClass("hide");
    //});

    $("#progress-yuan").mousedown(function (e) {
        e.preventDefault();
        controller = true;
        $(document).mousemove(function (e) {
            e.preventDefault();
            var position = checkBoundaries((((e.pageX - $(".progress-new").offset().left) / $(".progress-new").outerWidth()) * 100).toFixed(6));
            if (controller) {
                //$(fill).width(position + "%");
                SetPosition(position);
            }
        });
        $(document).mouseup(function () {
            e.preventDefault();
            controller = false;
        });
    });

    function checkBoundaries(value) {
        if (value < options.lowerBound * 10)
            return options.lowerBound * 10;
        else if (value > options.upperBound * 10)
            return options.upperBound * 10;
        else
            return value;
    }

    //日期插件初始化
    $("#mFTrackTimeB,#mFTrackTimeE").flatpickr({
        enableTime: true,
        enableSeconds: true,
        time_24hr: true,
        minuteIncrement: 1,
        allowInput: true,
        defaultDate: "today",
    });
    $("#mFTrackTimeE").flatpickr({
        enableTime: true,
        enableSeconds: true,
        time_24hr: true,
        minuteIncrement: 1,
        allowInput: true,
        defaultDate: formatDate(0) + " 23:59:59"
    });






    //车辆模糊查询
    $("#vehicleName").keyup(function () {
        var searchValue = $(this).val();
        var lilist = $("#vehicleTree").children("ul").find("li");
        var Motorcadelilist = $("#vehicleTree").find(".MotorcadeName");
        if (searchValue == "") {
            lilist.removeClass("hide");
        } else {
            lilist.addClass("hide");
            lilist.each(function (index, obj) {
                var name = $(this).children(".CheckCar").attr("mflicense");
                //console.info(name);
                if (name != undefined && name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    $(this).removeClass("hide");
                    $(this).parents("li").removeClass("hide");
                    //console.info(name);
                }
            });
        }
        if (searchValue == "") {
            lilist.removeClass("hide");
        } else {
            //lilist.addClass("hide");
            Motorcadelilist.each(function (index, obj) {
                var name = removeHTMLTag($(this).html());
                if (name != undefined && name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    $(this).parents("li").removeClass("hide");
                    $(this).parent("li").find("li").removeClass("hide");
                    //console.info(name);
                }
            });
        }
    });
    //正则去标签
    function removeHTMLTag(str) {
        return str = str.replace(/<\/?[^>]*>/g, "");
    }
    //正则去空格
    function removeBlank(str) {
        return str = str.replace(/\s/g, "&nbsp;");
    }

    $("#selectDate").change(function () {
        switch ($(this).select().val()) {
            case "1":
                $("#mFTrackTimeB").val(formatDate(0) + " 00:00:00");
                $("#mFTrackTimeE").val(formatDate(0) + " 23:59:59");
                break;
            case "2":
                $("#mFTrackTimeB").val(formatDate(1) + " 00:00:00");
                $("#mFTrackTimeE").val(formatDate(1) + " 23:59:59");
                break;
            case "3":
                $("#mFTrackTimeB").val(formatDate(2) + " 00:00:00");
                $("#mFTrackTimeE").val(formatDate(2) + " 23:59:59");
                break;
            default:
        }
    });

    //格局化日期：yyyy-MM-dd 
    function formatDate(day) {
        var date = new Date();
        var millSeconds = Math.abs(date) + (-day * 24 * 60 * 60 * 1000);
        var rDate = new Date(millSeconds);
        var myyear = rDate.getFullYear();
        var mymonth = rDate.getMonth() + 1;
        var myweekday = rDate.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }

    $("#vehicleSel").change(function () {
        $("#regnameDiv").find("#regNameP").html($(this).find("option:selected").text());

    });

    $("#today").click(function () {
        $("#mFTrackTimeB").val(formatDate(0));
        $("#mFTrackTimeE").val(formatDate(0));
    });

    $("#yestoday").click(function () {
        $("#mFTrackTimeB").val(formatDate(1));
        $("#mFTrackTimeE").val(formatDate(1));
    });

    $("#threeday").click(function () {
        $("#mFTrackTimeB").val(formatDate(3));
        $("#mFTrackTimeE").val(formatDate(0));
    });
    $("#today").click();

    function down(x, y) {
        return (x.S6 < y.S6) ? -1 : 1;

    }


    //var geoc = new BMap.Geocoder();



    //温度图表数据
    var chart;
    var categoriesList = [];
    var pointList = [];
    var seriesJson = [];
    var SensorSeqs = "";
    function seriesItem() {
        this.name = "";
        this.fieldName = 0;
        this.value = "";
        this.data = [];
    }

    function markerInfo() {
        this.name = "";
        this.date = "";
        this.mFLat = "";
        this.mFLng = "";
        this.data = [];
    }

    function down(x, y) {
        return (x.S6 < y.S6) ? -1 : 1;

    }

    function downtemp(x, y) {
        return (x.mFTrackTime < y.mFTrackTime) ? -1 : 1;

    }

    function queryBubble(mFProdTypeID) {
        $.post("/JSBDDialog/BubbleViewConfigDialog/doQuery", { mFProdTypeID: mFProdTypeID }, function (data) {
            bubbleJson = $.parseJSON(data);
        });
    }

    function getDate(datestr) {
        var temp = datestr.substring(0, 10).split("/");
        var date = new Date(temp[0], temp[1], temp[2]);
        return date;
    }

    var mFDate;
    var mStartTime;
    var mEndTime;
    var mTotalCount = 0;
    var IsGetTemTrack = "1";
    var spaceSelValue;
    var stopindex;
    var mfid;
    var mFVehicleID;
    var mFTrackTimeB;
    var mFTrackTimeE;
    var _AllTrackList;
    var onOff = true;
    var t_mFVehicleID = "";
    var t_mFTrackTimeB = "";
    var t_mFTrackTimeE = "";
    //查询按钮
    $("#trackDataSch").click(function () {

		//判断时间是否正确
        mFTrackTimeB = GetDateSeconds($("#mFTrackTimeB").val().replace(/-/ig, "/"));
        mFTrackTimeE = GetDateSeconds($("#mFTrackTimeE").val().replace(/-/ig, "/"));
        //   var diff = ((mFTrackTimeE - mFTrackTimeB) / (60 * 60));
        if (mFTrackTimeE > mFTrackTimeB) {
            if ((mFTrackTimeE - mFTrackTimeB) > 86400 * 7) {
                closeloading();
                showMsg($, __tr("Two time difference less than 24*7 hours!"));
                return;
            }
        } else {
            closeloading();
            showMsg($, __tr("End time must be greater than start time!"));
            return;
        }

        if (mFVehicleID == "") {
            closeloading();
            showMsg($, __tr("plase choose vehicles"));
            return;
        }
        GetMapObj().cleanMap();
        ClearFindDate();
        polylinePoints = [];
        polylinePoints.length = 0;

        mfid = $(this).attr("mFID");
        spaceSelValue = $("#spaceSel").val();
        stopindex = 0;

        $("#RunningInfoTable").html("");
        $("#TrackInfoTable").html("");
        $("#StopInfoTable").html("");
        $("#RunningBtn").find(".number").html("0");
        $("#TrackBtn").find(".number").html("0");
        $("#StopBtn").find(".number").html("0");
        DistancePoints = [];
        DistancePoints.length = 0;
        Direction = [];
        Direction.length = 0;
        TrackJsonList = [];
        TrackJsonList.length = 0;
        mTotalCount = 0;

        IsGetTemTrack = "1";
        openloading();

        mStartTime = getDate($("#mFTrackTimeB").val().replace(/-/ig, "/"));
        mEndTime = getDate($("#mFTrackTimeE").val().replace(/-/ig, "/"));
        //while ((mEndTime.getTime() - mStartTime.getTime()) >= 0) {
        //    var year = mStartTime.getFullYear();
        //    var month = mStartTime.getMonth().toString().length == 1 ? "0" + mStartTime.getMonth().toString() : mStartTime.getMonth();
        //    var day = mStartTime.getDate().toString().length == 1 ? "0" + mStartTime.getDate() : mStartTime.getDate();
        //    mFDateList.push(year + "-" + month + "-" + day);
        //    mStartTime.setDate(mStartTime.getDate() + 1);
        //}
        //mFDate = mFDateList[0];
        mFDate = getFDate();
        mStartTime.setMonth((mStartTime.getMonth() - 1));
        mStartTime.setDate(mStartTime.getDate() + 1);
        mStartTime.setMonth((mStartTime.getMonth() + 1));
        if ((t_mFVehicleID == "" || t_mFTrackTimeB == "" || t_mFTrackTimeE == "") || (t_mFVehicleID != mFVehicleID || t_mFTrackTimeB != mFTrackTimeB || t_mFTrackTimeE != mFTrackTimeE)) {
            showMsg($, __tr("Is the query, please later!"));
            t_mFVehicleID = mFVehicleID;
            t_mFTrackTimeB = mFTrackTimeB;
            t_mFTrackTimeE = mFTrackTimeE;
            _AllTrackList = null;
            QueryTrack();

        } else {
            showInMaps();
        }
    });

    function getFDate() {
        var year = mStartTime.getFullYear();
        var month = mStartTime.getMonth().toString().length == 1 ? "0" + mStartTime.getMonth().toString() : mStartTime.getMonth();
        var day = mStartTime.getDate().toString().length == 1 ? "0" + mStartTime.getDate() : mStartTime.getDate();
        // alert(year + "_" + month + "_" + day)
        return year + "_" + month + "_" + day;
    }


    //04.22
    function AddDirectionMsg(json, S8, S7) {
        var LableList = $("#container").find(".temporary-checkboxclick");
        LableList.remove();
        var a = TransDate(json.S6).split(" ");
        var point = GetMapObj().GetPosition(json.S8, json.S7);
        var myIcon = new BMap.Icon("/assets/xjaddpic/placeholder.png", new BMap.Size(1, 1));
        //style='display:block!important;'

        GetMapObj().SetLabel(point, "/assets/xjaddpic/placeholder.png", "<div class='checkboxclick temporary-checkboxclick' style='display:block!important;'><span class='sDate1' style='display:inline!important;'>" + a[0] + "</span><span class='empty'></span><span class='sTime1' style='display:inline!important;'>" + a[1] + "</span><span class='sSpeed1' style='display:inline!important;'> " + json.SA + "km/h</span><span class='sKilo1' style='display:inline!important;'> " + json.SC + "km</span><span class='S7' style='display:none'>" + json.S7 + "</span><span class='S8'style='display:none'>" + json.S8 + "</span><span class='SB' style='display:none'>" + json.SB + "</span></div>","100").setShadow(myIcon);
    }
    function showLable(json) {
        $(document).on("click", ".TrackInfoTabletr", function () {
            $(".checkbox-control").find("input").each(function () {
                if (!$(this).is(":checked")) {
                    $(this).prop("checked", true);
                }
            });
            var _this = $(this);
            var lng = _this.attr("s8");
            var lat = _this.attr("s7");
            var sb = $(this).attr("sb");
            var pointitem = GetMapObj().GetPosition(lng, lat);
            var marker = GetMapObj().GetMarker();
            var Iconurl = GetCarImgUrl(sb);
            //var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(25, 25), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
            GetMapObj().SetOnlyIconLabel(pointitem, Iconurl);
            //marker.setIcon(icon);
            //marker.setPosition(pointitem);
            var i = _this.find("td:first-child").text();
            $(this).siblings().removeClass("trbgcolor");
            $(this).focus().addClass("trbgcolor");
            AddDirectionMsg(json[i - 1], lng, lat);
            setMapCenterAndZoom(lng, lat);
            //console.log(json[i-1]);
        })

    }
    //04.22
    function showInMaps() {
        // openloading();
        var json = _AllTrackList;
        if (json.mObject.length > 0) {
            json.mObject.sort(down);
            //获取车辆终端弹窗显示字段配置
            queryBubble(json.mObject[0].S4ID);
            //温度json
            var tempTrack = json.mObject_1;
            tempTrack.sort(downtemp);

            for (var x = 0; x < json.mObject.length; x++) {
                if (json.mObject[x].S8 >= 1 && json.mObject[x].S7 >= 1) {
                    //将所有正常的坐标加入到路线数组中
                    var savePoint = GetMapObj().GetPosition(json.mObject[x].S8, json.mObject[x].S7);
                    polylinePoints.push(savePoint);
                }
            }

            var FuelBox = $.parseJSON(json.mObject_3);
            for (var i = 0; i < json.mObject.length; i++) {
                var _monitor = json.mObject[i];
                for (var j = 0; j < FuelBox.length; j++) {
                    if (mFVehicleID == FuelBox[j].mFVehicleID) {
                        var _fuelboxVolume = parseFloat(FuelBox[j].mFMaxVolume);
                        var _fuelboxValue = parseFloat(FuelBox[j].mFMaxSignValue);
                        var _monitorE4T = $.parseJSON(_monitor.E4T);
                        var _monitorVU = parseFloat(_monitorE4T[0].VU);
                        var fuelValue = (_monitorVU / _fuelboxVolume) * _fuelboxValue
                        _monitorE4T[0].VV = fuelValue;
                        json.mObject[i].E4T = JSON.stringify(_monitorE4T);
                    }
                }
            }


            //运行段报表生成 
            var runningTrack = json.mObject_2;
            //alert(JSON.stringify(json.mObject_2))
            var startRunningJson = null;
            var endRunningJson = null;
            var RunningStratIndex = 0;
            var RunningEndIndex = 0;
            var _AllRunningTime = 0;

            for (var j = 0; j < runningTrack.length; j++) {
                for (var i = 0; i < json.mObject.length; i++) {
                    if (parseInt(json.mObject[i].S6) >= parseInt(runningTrack[j].mFStartDateTime)) {
                        RunningStratIndex = i;
                        startRunningJson = json.mObject[i];
                        break;
                    }
                }

                for (var i = 0; i < json.mObject.length; i++) {
                    if (parseInt(json.mObject[i].S6) <= parseInt(runningTrack[j].mFEndDateTime)) {
                        RunningEndIndex = i;
                        endRunningJson = json.mObject[i];
                    }
                }
                _AllRunningTime += parseInt(runningTrack[j].mFTimeLength);

                if (RunningEndIndex > 0 && RunningStratIndex >= 0)
                    AddRunningInfo(startRunningJson, endRunningJson, RunningStratIndex, RunningEndIndex, runningTrack[j]);
            }

            //运行段分析
            //运行段报表生成   
            //var startRunningJson = null;
            //var endRunningJson = null;
            //var RunningStratIndex = 0;
            //var RunningEndIndex = 0;
            //var truePointmObject = [];
            //var isStart = false;
            //alert(JSON.stringify(json.mObject));         
            //var _AllRunningTime = 0;
            //for (var i = 0; i < json.mObject.length; i++) {
            //    //console.log(i + ":" + json.mObject[i].SA + "," + isStart + "/" + json.mObject[i].S6)
            //    if (parseInt(json.mObject[i].SA) > 0 && isStart == false) {
            //        isStart = true;
            //        RunningStratIndex = i;
            //        startRunningJson = json.mObject[i];

            //    } else if (parseInt(json.mObject[i].SA) <= 0 && isStart == true) {
            //        isStart = false;
            //        endRunningJson = json.mObject[i];
            //        RunningEndIndex = i;

            //        AddRunningInfo(startRunningJson, endRunningJson, RunningStratIndex, RunningEndIndex);
            //        _AllRunningTime += parseInt(endRunningJson.S6) - parseInt(startRunningJson.S6);
            //    }

            //    //如果数据已经是最后一条了,那么直接将最后一个点当作最后的运行段结束点
            //    if (i == json.mObject.length - 1 && endRunningJson != null && startRunningJson != null) {
            //        RunningEndIndex = i;
            //        endRunningJson = json.mObject[i];
            //        AddRunningInfo(startRunningJson, endRunningJson, RunningStratIndex, RunningEndIndex);
            //        _AllRunningTime += parseInt(endRunningJson.S6) - parseInt(startRunningJson.S6);
            //    }

            //}




            if (spaceSelValue == "auto") {
                var DistancePointsL = json.mObject.length;
                if (DistancePointsL >= 1500) {
                    spaceSelValue = 50000;
                }
                else if (DistancePointsL >= 1000 || DistancePointsL < 1500) {
                    spaceSelValue = 30000;
                }
                else if (DistancePointsL >= 800 || DistancePointsL < 1000) {
                    spaceSelValue = 10000;
                }
                else if (DistancePointsL >= 500 || DistancePointsL < 800) {
                    spaceSelValue = 5000;
                }
                else if (DistancePointsL >= 300 || DistancePointsL < 500) {
                    spaceSelValue = 3000;
                }
            }

            //停车报表生成
            for (var i = 0; i < json.mObject.length; i++) {
                json.mObject[i].TempMonitor = [];


                var nowPoint = GetMapObj().GetPosition(json.mObject[i].S8, json.mObject[i].S7);
                //判断前一个点和现在点的距离,如果为真则添加一条行车信息
                if (DistancePoints.length == 0) {
                    categoriesList.push(json.mObject[i].S6);
                    TrackJsonList.push(json.mObject[i]);
                } else if (GetMapObj().getDistance(DistancePoints[DistancePoints.length - 1], nowPoint) > spaceSelValue) {
                    categoriesList.push(json.mObject[i].S6);
                    TrackJsonList.push(json.mObject[i]);
                }

                //如果之前停车的下标小于现在循环的下标,则表示已经记录的停车
                if (stopindex <= i) {
                    //当前坐标点
                    var bool = false;
                    //循环当前坐标点之后的坐标点,如果有相同,继续匹配下一个,如果有不同,则取不同坐标点的上一个坐标点
                    for (var j = 1; j < json.mObject.length - i; j++) {
                        // var nowPoint = GetMapObj().GetPosition(json.mObject[i].S8, json.mObject[i].S7);
                        var NextPoint = GetMapObj().GetPosition(json.mObject[parseInt(i + j)].S8, json.mObject[parseInt(i + j)].S7);
                        //  alert(json.mObject[parseInt(i + j)].S8 + "," + json.mObject[parseInt(i + j)].S7)
                        //如果不相等则代表结束停车
                        var Distance = GetMapObj().getDistance(nowPoint, NextPoint);
                        if (Distance > 50) {
                            if (bool) {
                                //保存停车最后一个坐标点的下标
                                stopindex = i + j - 1;
                                //获取当前停车最后一个坐标点JSOn
                                var stoppointjson = json.mObject[stopindex];
                                var Stoptime = $("#stopSel").val();
                                //判断最后一个停车时间减掉开始停车时间是否大于选择的停车时间,如果为真则添加停车marker
                                var starttime = parseInt(json.mObject[i].S6);
                                var endtime = parseInt(stoppointjson.S6);
                                var timespan = endtime - starttime;
                                //alert("endtime:" + endtime + "----starttime:" + starttime + "----timespan:" + endtime - starttime);
                                if (timespan > Stoptime) {
                                    StopPoints.push(nowPoint);
                                    //if (timespan > 60 * 1000) {
                                    //    timespan = parseInt(timespan / 1000 / 60) + "m" + timespan / 1000 % 60 + "s";
                                    //} else {
                                    //    timespan = timespan / 1000 + "s";
                                    //}
                                    AddStopInfo(json.mObject[i], stoppointjson.S6, formatSeconds(timespan));
                                }
                            }
                            break;
                        } else {
                            //相等则代表是停车
                            bool = true;
                        }
                    }
                }
            }
            var removeZeroTrackJsonList = removeZeroDate(TrackJsonList);

            $.each(tempTrack, function (index, obj) {
                if (SensorSeqs.indexOf(obj.mFSensorSeq) < 0) {
                    SensorSeqs += obj.mFSensorSeq + ",";
                    var Item = new seriesItem();
                    Item.name = obj.mFSensorSeq + __tr("temperature");
                    Item.fieldName = obj.mFSensorSeq + ",mFTemp";
                    seriesJson.push(Item);

                }

            });

            $.each(categoriesList, function (tindex, timeItem) {

                $.each(seriesJson, function (sindex, serieItem) {
                    var bool = false;
                    var jsonitem;
                    $.each(tempTrack, function (index, obj) {
                        var sensorSeq = serieItem.fieldName.split(",")[0];
                        if (obj.mFSensorSeq == sensorSeq) {
                            var resu = (timeItem - obj.mFTrackTime);
                            if (resu <= 5) {
                                bool = true;
                                jsonitem = obj;
                                //json.mObject.splice(index, 1);
                                return false;
                            }
                        }
                    });
                    if (categoriesList.length == tindex) {
                        return;
                    }
                    if (bool) {
                        var fname = serieItem.fieldName.split(",")[1];
                        serieItem.data.push(parseFloat(jsonitem[fname]));
                    } else {
                        if (serieItem.data.length > 0) {
                            serieItem.data.push(parseFloat(serieItem.data[serieItem.data.length - 1]));
                        } else {
                            serieItem.data.push(parseFloat(0));

                        }
                    }
                });
                categoriesList[tindex] = TransDate(timeItem);
            });

            //AddDirectionMsg(TrackJsonList);


            //console.log(TrackJsonList);
            //轨迹点生成

            $("#TrackBtn").find(".number").html(removeZeroTrackJsonList.length);
            showLable(removeZeroTrackJsonList);
            TableScroll(removeZeroTrackJsonList);
            for (var i = 0; i < removeZeroTrackJsonList.length; i++) {
                //04.22
                //AddDirectionMsg(TrackJsonList[i]);
                //console.log(TrackJsonList[i]);

                //04.22
                for (var k = 0; k < seriesJson.length; k++) {
                    removeZeroTrackJsonList[i].TempMonitor.push(seriesJson[k].fieldName.split(",")[0] + ":" + seriesJson[k].data[i]);
                }
                var nowPoint = GetMapObj().GetPosition(removeZeroTrackJsonList[i].S8, removeZeroTrackJsonList[i].S7);

                //添加轨迹点至信息表
                if (i < 100) {
                    AddPointInfo(true, removeZeroTrackJsonList[i]);
                }


                //判断前一个点和现在点的距离,如果为真则添加一条行车信息
                if (DistancePoints.length == 0) {
                    //    DistancePoints.push(nowPoint);
                    //    //方向
                    Direction.push(removeZeroTrackJsonList[i].SB);

                } else if (GetMapObj().getDistance(DistancePoints[DistancePoints.length - 1], nowPoint) > spaceSelValue) {
                    //    DistancePoints.push(nowPoint);
                    //    //方向
                    Direction.push(removeZeroTrackJsonList[i].SB);
                }

                //防止线路方向箭头数量过多,增加过滤
                var isSetInMap = false;
                if (i % parseInt(removeZeroTrackJsonList.length / 20) == 0)
                    isSetInMap = true;
                //此处添加线路方向箭头图标
                if (isSetInMap)
                    AddDirection(removeZeroTrackJsonList[i]);
            }

            //总里程计算
            if (removeZeroTrackJsonList.length == 0) {
                showMsg($, "该车辆没有无坐标点!");
                closeloading();
            }
            var startkilo = removeZeroTrackJsonList[0].SC;
            var endkilo = removeZeroTrackJsonList[removeZeroTrackJsonList.length - 1].SC;
            var kilo = endkilo - startkilo;

            //总运行时长计算
            //var usedTime = formatSeconds(parseInt(TrackJsonList[TrackJsonList.length - 1].S6 - parseInt(TrackJsonList[0].S6)));
            $(".amountKilo").html(__tr("Total mileage") + kilo + "km<br />" + __tr("Total duration") + formatSeconds(_AllRunningTime));



            //单选框点击事件
            var checkedBox = $("#checkboxTable").find("input");

            var timecheckbox = $(".sTime").prev();
            timecheckbox.on("click", function () {

                if (timecheckbox.is(":checked")) {
                    $(".sTime1").show(); $(".checkboxclick").show();

                } else {
                    $(".sTime1").hide();
                    $("#xj-p-pause").click();
                }
            });
            var speedcheckbox = $(".sSpeed").prev();
            speedcheckbox.on("click", function () {
                if (speedcheckbox.is(":checked")) {
                    $(".sSpeed1").show(); $(".checkboxclick").show();
                } else {
                    $(".sSpeed1").hide();
                    $("#xj-p-pause").click();
                }
            });
            var datecheckbox = $(".sDate").prev();
            datecheckbox.on("click", function () {
                if (datecheckbox.is(":checked")) {
                    $(".sDate1").show(); $(".checkboxclick").show();
                } else {
                    $(".sDate1").hide();
                    $("#xj-p-pause").click();
                }
            });
            var kilocheckbox = $(".sKilo").prev();
            kilocheckbox.on("click", function () {
                if (kilocheckbox.is(":checked")) {
                    $(".sKilo1").show();
                    $(".checkboxclick").show();
                } else {
                    $(".sKilo1").hide();
                    $("#xj-p-pause").click();
                }
            });
            var stopcheckbox = $(".sStop").prev();
            stopcheckbox.on("click", function () {
                if (stopcheckbox.is(":checked")) {
                    $(".stop-icon").show();
                } else {
                    $(".stop-icon").hide();
                }
            });
            checkedBox.on("click", function () {
                if ($("#checkboxTable").find("input:checked").length == 0) {
                    $(".checkboxclick").hide();
                }
            })

            //温度图表加载
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'ReportContainer', //放置图表的容器
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    defaultSeriesType: 'spline'
                },
                title: {
                    text: __tr("Temperature curve")
                },
                subtitle: {
                    text: null
                },
                xAxis: {
                    //X轴数据
                    categories: categoriesList,
                    tickInterval: parseInt(categoriesList.length / 5),
                    labels: {
                        rotation: 0, //字体倾斜
                        align: 'center'
                    }
                },
                yAxis: {
                    //Y轴显示文字
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + Highcharts.numberFormat(this.y, 1) + "℃";
                    }
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false
                        },
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true //是否显示title
                    }
                },
                series: seriesJson
            });


            //  var polyline = new BMap.Polyline(polylinePoints);
            //  GetMapObj().addOverlay(polyline);
            //console.log(typeof polylinePoints);
            polyline = GetMapObj().createLine(polylinePoints, styleOptions);

            GetMapObj().addOverlay(polyline);
            SetMapView();
            // AddMarkerToMap(polylinePoints[0], mfid);
            AddStartOrEndIcon(polylinePoints[0], __tr("p_start"));
            AddStartOrEndIcon(polylinePoints[polylinePoints.length - 1], __tr("p_end"));
            $("#ControlBar").removeClass("hide");
            $("#trackInfo_open").click();
            $("#hidePanelA").click();

        } else {
            showMsg($, __tr("Did not find the track data!"));
            $("#ControlBar").addClass("hide");
        }
        closeloading();
    }
    function removeZeroDate(arr) {
        var newarr = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].S7 >= 1 || arr[i].S8 >= 1) {
                newarr.push(arr[i]);
            }
        }
        return newarr;
    }
    function QueryTrack() {
        //console.log(new Date());
        $.post("/MTM/Track/doQueryByDate", { mFVehicleID: mFVehicleID, mFTrackTimeB: mFTrackTimeB, mFTrackTimeE: mFTrackTimeE, mSort: "mFTrackTime", offsetName: map, IsGetTemTrack: IsGetTemTrack, mFDate: mFDate }, function (data) {

            //if (!CheckDataStatus(data, $)) return;
            var json = $.parseJSON(data);
            if (json.Result != "100") {
                if (IsGetTemTrack == "1") {
                    IsGetTemTrack = "0";
                    mTotalCount = json.mTotalCount;
                    _AllTrackList = json;
                    if (mTotalCount > 2000)
                        _AllTrackList.mObject = JSON.hunpack(eval(_AllTrackList.mObject), 4);
                } else {
                    if (json.mTotalCount > 2000)
                        json.mObject = JSON.hunpack(eval(json.mObject), 4);

                    $.each(json.mObject, function (index, obj) {
                        _AllTrackList.mObject.push(obj);
                    });
                }

                if ((mEndTime.getTime() - mStartTime.getTime()) >= 0) {
                    mFDate = getFDate();
                    mStartTime.setMonth((mStartTime.getMonth() - 1));
                    mStartTime.setDate(mStartTime.getDate() + 1);
                    mStartTime.setMonth((mStartTime.getMonth() + 1));
                    QueryTrack();
                } else {
                    //_AllTrackList.mObject = JSON.hunpack(eval(_AllTrackList.mObject), 4);
                    _AllTrackList.mObject.sort(function (a, b) {
                        return a.S6 - b.S6
                    });

                    //GPS坐标纠偏
                    if (map == "baidu") {
                        for (var x = 0; x < _AllTrackList.mObject.length; x++) {
                            if (_AllTrackList.mObject[x].S8 >= 1 && _AllTrackList.mObject[x].S7 >= 1) {
                                var fixedlatlng = fixGPSPoint(parseFloat(_AllTrackList.mObject[x].S8), parseFloat(_AllTrackList.mObject[x].S7))
                                _AllTrackList.mObject[x].S8 = fixedlatlng.lon;
                                _AllTrackList.mObject[x].S7 = fixedlatlng.lat;
                            }
                        }
                    }
                    // console.log(new Date());
                    showInMaps();
                }
            } else {
                showMsg($, json.Message);
                $("#ControlBar").addClass("hide");
                closeloading();
            }

            var runningcarLength = $("#RunningTable").find("tr").length;
            //if (runningcarLength >= 5) {
            //    $("#RunningTable").find("thead>tr").attr("style", "width:calc( 100% - 1.2em )");
            //} else {
            //    $("#RunningTable").find("thead>tr").attr("style", "width:100%");
            //}
            $("#baidumap").next().removeClass("hide");


        });
    }



    //var isContinue = false;
    //function getTransPoint(x, y) {
    //    var nowPoint = null;
    //    var tranPointUrl = "http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x=" + x + "&y=" + y;
    //    $.ajax({
    //        async: false,
    //        type: "get",
    //        dataType: "jsonp",
    //        url: tranPointUrl,
    //        // url: "http://api.zdoz.net/transgpsbd.aspx?lng=" + json.mObject[i].S8 + "&lat=" + json.mObject[i].S7,
    //        success: function (data) {
    //            var tranPos = eval(data);
    //            nowPoint = GetMapObj().GetPosition(tranPos.x, tranPos.y);
    //        }
    //    });
    //    return nowPoint;
    //}

    //var geoc = new BMap.Geocoder();


    //添加起点和结束点图标
    //function AddStartOrEndIcon(point, iconName) {
    //    marker = GetMapObj().GetMarker();
    //    var icon = GetMapObj().GetIcon("/assets/image/" + iconName + ".png", GetMapObj().GetSizeObject(32, 32), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
    //    marker.setIcon(icon);
    //    marker.setPosition(point);
    //    GetMapObj().addOverlay(marker);
    //}
    function AddStartOrEndIcon(point, iconName) {
        var iconUrl = "/assets/image/" + iconName + ".png";
        var userDefinedMarker = GetMapObj().userDefinedMarker(iconUrl, point);
        //console.log(userDefinedMarker);
        GetMapObj().addOverlay(userDefinedMarker);
    }

    //设置地图可视区域
    function SetMapView() {
        //var view = GetMapObj().maplet.getViewport(eval(points));
        //var mapZoom = view.zoom;
        //var centerPoint = view.center;
        //GetMapObj().maplet.centerAndZoom(centerPoint, mapZoom);
        GetMapObj().SetViewport(polylinePoints);
    }

    //米转换成公里
    function distanceMToKM(distance) {
        if (distance < 1000)
            return (distance + "m");
        else if (distance > 1000)
            return ((Math.round(distance / 100) / 10).toFixed(1) + "km");
    }

    //添加运行段信息
    function AddRunningInfo(startJson, endJson, RunningStratIndex, RunningEndIndex, runningTrack) {
        setHighLight("#RunningInfoTable");
        var temp = "";
        var runningInfoIndex = parseInt($("#RunningInfoTable").find("tr").length + 1);
        temp += '<tr onclick="RunningBetween(' + RunningStratIndex + ',' + RunningEndIndex + ' )" style="cursor:pointer"><td class="xj-width-45"">' + runningInfoIndex + '</td>';
        temp += '<td class="xj-width-150">' + TransDate(startJson.S6) + '</td>';
        temp += '<td class="xj-width-150">' + TransDate(endJson.S6) + '</td>';
        temp += '<td class="Point xj-width-300 text-align-left" id="RunningStartInfo_' + runningInfoIndex + '"></td>';
        temp += '<td class="Point xj-width-300 text-align-left" id="RunningEndInfo_' + runningInfoIndex + '"></td>';
        temp += '<td class="xj-width-150">' + formatSeconds(parseInt(endJson.S6) - parseInt(startJson.S6)) + '</td>';
        //var startPoint = GetMapObj().GetPosition(startJson.S8, startJson.S7);
        //var endPoint = GetMapObj().GetPosition(endJson.S8, endJson.S7);
        //var Distance = GetMapObj().getDistance(startPoint, endPoint);
        //distanceMToKM(Distance.toFixed(2))
        temp += '<td class="xj-width-150">' + runningTrack.mFMileage + 'km</td></tr>';
        $("#RunningInfoTable").append(temp);
        TransPointAddress("RunningStartInfo_" + runningInfoIndex, startJson.S7, startJson.S8);
        TransPointAddress("RunningEndInfo_" + runningInfoIndex, endJson.S7, endJson.S8);
        $("#RunningBtn").find(".number").html(runningInfoIndex);
        // $("#RunningInfoTable").find("tr").eq(0).addClass("trbgcolor");
    }

    getBubbleJson();
    //var bubbleJson;
    function getBubbleJson() {
        $.post("/JSBDDialog/BubbleViewConfigDialog/doQuery", {}, function (data) {
            bubbleJson = $.parseJSON(data);
        });
    }

    function GetStatuStrB(obj) {
        switch (obj.K) {
            case "703B_Container":
                return obj.V == "1" ? __tr("703B_Container_1") : __tr("703B_Container_0");
            case "703B_HeadStock":
                return obj.V == "1" ? __tr("703B_HeadStock_1") : __tr("703B_HeadStock_0");
            case "P_PowerValue":
                return obj.V;
            case "SolarCharger":
                return obj.V == "1" ? __tr("SolarCharger_1") : __tr("SolarCharger_0");
            default:
                return "";
        }
    }

    function TableScroll(json) {
        var TrackJsonListsection = 100;
        var Startsection = 0;
        var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
        var nScrollTop = 0;   //滚动到的当前位置
        var nDivHight = $("#TrackInfoTable").height();
        $("#TrackInfoTable").scroll(function () {
            nScrollHight = $(this)[0].scrollHeight;
            nScrollTop = $(this)[0].scrollTop;
            if (nScrollTop + nDivHight >= nScrollHight) {
                var Eindex = TrackJsonListsection * (Startsection + 2);
                var Sindex = TrackJsonListsection * (Startsection + 1);
                var newTrackJsonList = json.slice(Sindex, Eindex);
                for (var j = 0; j < newTrackJsonList.length; j++) {
                    AddPointInfo(false, newTrackJsonList[j]);
                }

                Startsection++;
            }
        })

    }

    //添加轨迹点信息
    function AddPointInfo(switchAdd, arr) {
        var json = "";
        var temp = "";
        var statusStr = "";
        //if (json.E1T != "") {
        //    var statusJson = $.parseJSON(json.E1T);

        //    $.each(statusJson, function (index, obj) {
        //        statusStr += GetStatuStr(obj) + ",";
        //    });
        //}
        if (switchAdd) {
            json = arr;

        }
        if (switchAdd == false) {

            json = arr;
        }
        if (json.E1T != "" && typeof json.E1T != "undefined" && json.E1T != null) {
            var obj = bubbleJson.mObject;
            var statusJson = $.parseJSON(json.E1T);
            for (var j = 0; j < obj.length; j++) {
                if (json.S4ID == obj[j].mFProdTypeID) {
                    //如果是油量状态的单独运算
                    if (obj[j].mFField == 'Fuel_Value') {
                        statusStr += __tr("VV") + parseFloat($.parseJSON(json.E4T)[0].VV).toFixed(2) + ";&nbsp;&nbsp;";
                    } else {
                        //非油量的状态直接循环
                        $.each(statusJson, function (sindex, sobj) {
                            if (obj[j].mFField == sobj.K) {
                                statusStr += __tr(sobj.K) + GetStatuStrB(sobj) + ";&nbsp;&nbsp;";
                            }
                        });
                    }
                }
            }
        }

        if (json.S8 > 0 && json.S7 > 0) {
            var trackInfoIndex = parseInt($("#TrackInfoTable").find("tr").length + 1);
            //onclick='showPointInfoOnRoute(" + JSON.stringify(json) + ")'

            temp += "<tr class='TrackInfoTabletr'style='cursor:pointer' s8='" + json.S8 + "' s7='" + json.S7 + "' sb='" + json.SB + "'><td class='xj-width-45' style='cursor:pointer'>" + trackInfoIndex + "</td>";
            temp += '<td class="xj-width-150 create_time" >' + TransDate(json.S6) + '</td>';
            temp += '<td class="xj-width-150">' + json.SA + '</td>';
            temp += '<td class="xj-width-170">' + json.SC + '</td>';
            //temp += '<td class="xj-width-170">-</td>';
            temp += '<td class="xj-width-451" title="' + statusStr + '">';
            temp += statusStr;
            temp += '</td>';
            temp += '<td class="xj-width-300">';
            for (var i = 0; i < json.TempMonitor.length; i++) {
                temp += (i == 0 ? (json.TempMonitor[i] + "℃") : ("," + json.TempMonitor[i] + "℃"));
            }
            temp += '</td>';
            temp += '<td class="Point xj-width-285 text-align-left" id="PointInfo_' + trackInfoIndex + '"></td>';
            temp += '</tr>';
            $("#TrackInfoTable").append(temp);
            //添加地址
            TransPointAddress("PointInfo_" + trackInfoIndex, json.S7, json.S8);
        }

    }

    //在线路上添加方向图标的方法
    function AddDirection(json) {
        var a = TransDate(json.S6).split(" ");
        var point = GetMapObj().GetPosition(json.S8, json.S7);
        var myIcon = new BMap.Icon("/assets/xjaddpic/placeholder.png", new BMap.Size(1, 1));
        //"<div class='checkboxclick'><span class='sDate1'>" + a[0] + "</span><span class='empty'></span><span class='sTime1'>" + a[1] + "</span><span class='sSpeed1'> " + json.SA + "km/h</span><span class='sKilo1' style='display:none'> " + json.SC + "km</span><span class='S7' style='display:none'>" + json.S7 + "</span><span class='S8'style='display:none'>" + json.S8 + "</span><span class='SB' style='display:none'>" + json.SB + "</span></div>"
        GetMapObj().SetLabel(point, iconUrlFun(json.SB),"").setShadow(myIcon);
        //console.log(GetMapObj());
    }



    function iconUrlFun(direction) {
        var direc = parseInt((parseInt(direction) + 22) / 45);
        //        switch (direc) {
        //        case 0:
        //            return "/assets/xjaddpic/6.gif";
        //        case 1:
        //            return "/assets/xjaddpic/5.gif";
        //        case 2:
        //            return "/assets/xjaddpic/4.gif";
        //        case 3:
        //            return "/assets/xjaddpic/3.gif";
        //        case 4:
        //            return "/assets/xjaddpic/2.gif";
        //        case 5:
        //            return "/assets/xjaddpic/1.gif";
        //        case 6:
        //            return "/assets/xjaddpic/8.gif";
        //        case 7:
        //            return "/assets/xjaddpic/7.gif";
        //        default:
        //            return "/assets/xjaddpic/6.gif";
        //        }
        switch (direc) {
            case 0:
                return "/assets/image/north.png";
            case 1:
                return "/assets/image/northeast.png";
            case 2:
                return "/assets/image/east.png";
            case 3:
                return "/assets/image/southeast.png";
            case 4:
                return "/assets/image/south.png";
            case 5:
                return "/assets/image/southwest.png";
            case 6:
                return "/assets/image/west.png";
            case 7:
                return "/assets/image/northwest.png";
            default:
                return "/assets/image/north.png";
        }
    }

    //坐标点转换为地址
    function TransPointAddress(id, S7, S8) {
        var geoc = GetMapObj().GetClientGeocoder();
        var point = GetMapObj().GetPosition(S8, S7);
        window.setTimeout(function () {
            GetMapObj().Geoco_GetLocation(geoc, point, function (json) {
                var address1 = json.addressComponents.province + "" + json.addressComponents.city + "" + json.addressComponents.district;
                var address2 = "" + json.addressComponents.street;
                $("#" + id).html(address1 + address2);
            });
        }, 100)
    }

    $(".togg").on("click", function () {

        if ($(this).parent().hasClass("opentogg")) {
            $(".clicktogg").remove();
            $(this).parent().removeClass("opentogg");
            $(this).removeClass("bottom-33");
        } else {
            $(this).parent().addClass("opentogg");
            $(this).parent().prepend("<i class='clicktogg'>点击按钮出现车辆弹框</i>");
            $(this).addClass("bottom-33");
        }
        $("#checkboxTable>div").toggle();
    });

    //添加停车信息
    function AddStopInfo(json, endTime, timespan) {
        setHighLight("#StopInfoTable");
        var Stoptemp = "";
        var statusStr = "";
        //if (json.E1T != "") {
        //    var statusJson = $.parseJSON(json.E1T);

        //    $.each(statusJson, function (index, obj) {
        //        statusStr += GetStatuStr(obj) + ",";
        //    });
        //}
        if (json.E1T != "" && typeof json.E1T != "undefined" && json.E1T != null) {
            var obj = bubbleJson.mObject;
            var statusJson = $.parseJSON(json.E1T);
            for (var j = 0; j < obj.length; j++) {
                if (json.S4ID == obj[j].mFProdTypeID) {
                    //如果是油量状态的单独运算
                    if (obj[j].mFField == 'Fuel_Value') {
                        statusStr += __tr("VV") + parseFloat($.parseJSON(json.E4T)[0].VV).toFixed(2) + ";&nbsp;&nbsp;";
                    } else {
                        //非油量的状态直接循环
                        $.each(statusJson, function (sindex, sobj) {
                            if (obj[j].mFField == sobj.K) {
                                statusStr += __tr(sobj.K) + GetStatuStrB(sobj) + ";&nbsp;&nbsp;";
                            }
                        });
                    }
                }
            }
        }
        var stopInfoIndex = parseInt($("#StopInfoTable").find("tr").length + 1);
        Stoptemp += '<tr style="cursor:pointer" onclick="setMapCenterAndZoom(' + json.S8 + ',' + json.S7 + ')"><td class="xj-width-45">' + stopInfoIndex + '</td>';
        Stoptemp += "<td class='xj-width-150'>" + TransDate(json.S6) + "</td>";
        Stoptemp += '<td class="xj-width-150">' + TransDate(endTime) + '</td>';
        Stoptemp += '<td class="xj-width-150">' + timespan + '</td>';
        Stoptemp += '<td class="xj-width-450" title="' + statusStr + '">' + statusStr + '</td>';
        // Stoptemp += '<td>区域</td>';
        Stoptemp += '<td class="Point text-align-left xj-width-285" id="StopInfo_' + stopInfoIndex + '"></td>';
        Stoptemp += '</tr>';
        $("#StopInfoTable").append(Stoptemp);
        TransPointAddress("StopInfo_" + stopInfoIndex, json.S7, json.S8);

        $("#StopBtn").find(".number").html($("#StopInfoTable").find("tr").length);
        //添加停车mark到路线

        var point = GetMapObj().GetPosition(json.S8, json.S7);
        $(".sStop").prev().prop("checked", true);
        var myIcon = new BMap.Icon("/assets/xjaddpic/placeholder.png", new BMap.Size(1, 1));
        GetMapObj().SetLabel(point, "/assets/image/p_stop.png", "<span class='stop-icon' style='display:" + showOptions.showMileage + "'>" + timespan + "</span>").setShadow(myIcon);
        // var marker = GetMapObj().GetMarker();
        //var icon = GetMapObj().GetIcon("/assets/image/p_stop.png", GetMapObj().GetSizeObject(32, 32), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
        //marker.setIcon(icon);
        // marker.setPosition(point);
        //marker.setTitle(__tr("Stop time") + ":" + timespan + "s," + __tr("Parking start time") + ":" + TransDate(json.S6) + "," + __tr("Parking end time") + ":" + DateFormat(endTime));      
        //GetMapObj().addOverlay(marker);
        //});
    }


    //将秒数转换成时间格式
    function formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime) + " " + __tr("second");
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1) + " " + __tr("minute") + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + " " + __tr("hour") + result;
        }
        return result;
    }

    $("#xj-p-backward").click(function () {
        var TrackInfoTable = $("#TrackInfoTable");
        TrackInfoTable.scrollTop(0);
        //$("#showTime").html(TransDate(TrackJsonList[0].S6));
        $("#TrackInfoTable").find("tr").removeClass("trbgcolor");
        $("#TrackInfoTable").find("tr").eq(0).addClass("trbgcolor");
        $("#xj-p-stop").click();
    });

    $("#xj-p-forward").click(function () {
        $("#progress-yuan").stop().animate({
            left: '95%'
        }, 0);;
        clearTimeout(t);
        c = points.length;
        marker.setPosition(points[points.length]);
    });

    $("#xj-p-slow").click(function () {
        $("#xj-p-pause").click();
        timeout = defaulttime * 2;
        TrackPlay();
    });

    $("#xj-p-fast").click(function () {
        $("#xj-p-pause").click();
        timeout = defaulttime / 2;
        TrackPlay();
    });

    $("#xj-p-play").click(function () {
        $("#xj-p-pause").click();
        $("#TrackBtn").click();
        timeout = defaulttime;
        TrackPlay();

    });
    $("#xj-p-pause").click(function () {
        clearTimeout(t);
    });
    $("#xj-p-stop").click(function () {
        $("#progress-yuan").stop().animate({
            left: '0%',
        }, 0);;
        clearTimeout(t);
        c = 0;
        marker.setPosition(points[0]);
    });

    $("#hidePanelA").click(function () {
        $("#panelTable").toggle();
        $("#regnameDiv").toggle();
    });

    $("#showPanelA").click(function () {
        $("#panelTable").toggle();
        $("#regnameDiv").toggle();
    });

    ////测量
    //$("#DistanceTool").click(function () {
    //    var myDis = new BMapLib.DistanceTool(GetMapObj().maplet);
    //    myDis.open();
    //});

    ////导航
    //$("#navigation").click(function () {
    //    $("#ShowNavigationDialog").removeClass('hide').dialog({
    //        modal: false,
    //        title: __tr("Navigation"),
    //        title_html: true,
    //        width: 550,
    //        height: 400,
    //        buttons: [
    //            {
    //                text: __tr("Navigation"),
    //                "class": "btn btn-sm btn-primary btn-round padding-lr-36",
    //                click: function () {
    //                    var spoint = markers["start"].getPosition();
    //                    var epoint = markers["end"].getPosition();
    //                    GetMapObj().maplet.removeOverlay(markers["start"]);
    //                    GetMapObj().maplet.removeOverlay(markers["end"]);
    //                    driving.search(spoint, epoint);
    //                    $(this).dialog("close");

    //                }
    //            },
    //            {
    //                text: __tr("Close"),
    //                "class": "btn btn-white btn-primary btn-round  padding-lr-36 margin-l-15",
    //                click: function () {
    //                    $(this).dialog("close");

    //                }
    //            }
    //        ],
    //        close: ClearFindDate
    //    });
    //});

    ////起点位置选择
    //$("#nMarkS").click(function () {
    //    if (markers["start"] != null) {
    //        GetMapObj().maplet.removeOverlay(markers["start"])
    //    }
    //    GetMapObj().maplet.setDefaultCursor("crosshair");
    //    showMsg($, __tr("Please select the starting point on the map"));
    //    GetMapObj().maplet.addEventListener("click", function checkmarker(e) {
    //        var point = new BMap.Point(e.point.lng, e.point.lat);
    //        var marker = GetMapObj().GetMarker();
    //        var Iconurl = "/assets/image/p_start.png";
    //        var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(50, 50), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(12, 0));
    //        marker.setIcon(icon);
    //        marker.setPosition(point);
    //        marker.enableDragging();
    //        GetMapObj().maplet.addOverlay(marker);
    //        marker.addEventListener("dragend", ChangeMarkerPosition);
    //        markers["start"] = marker;
    //        GetMapObj().maplet.setDefaultCursor("openhead");
    //        GetMapObj().maplet.removeEventListener("click", checkmarker);
    //    });
    //});

    ////终点位置选择
    //$("#nMarkE").click(function () {
    //    if (markers["end"] != null) {
    //        GetMapObj().maplet.removeOverlay(markers["end"])
    //    }
    //    showMsg($, __tr("Please select the starting point on the map"));

    //    GetMapObj().maplet.setDefaultCursor("crosshair");
    //    GetMapObj().maplet.addEventListener("click", function checkmarker(e) {
    //        var point = new BMap.Point(e.point.lng, e.point.lat);
    //        var marker = GetMapObj().GetMarker();
    //        marker.setPosition(point);
    //        var Iconurl = "/assets/image/p_end.png";
    //        var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(50, 50), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(12, 0));
    //        marker.setIcon(icon);
    //        marker.enableDragging();
    //        GetMapObj().maplet.addOverlay(marker);
    //        marker.addEventListener("dragend", ChangeMarkerPosition);
    //        markers["end"] = marker;
    //        GetMapObj().maplet.setDefaultCursor("openhead");
    //        GetMapObj().maplet.removeEventListener("click", checkmarker);
    //    });
    //});

    //checkCars = [];
    //mappoints = [];
    //var markers = new Array();
    //var showTraffic = false;
    //var ctrl = new BMapLib.TrafficControl({
    //    showPanel: true, //是否显示路况提示面板
    //    anchor: BMAP_ANCHOR_BOTTOM_RIGHT
    //});
    //GetMapObj().maplet.addControl(ctrl);
    //路况
    //$("#Traffic").click(function () {
    //    if (showTraffic) {
    //        //ctrl.remove();
    //        ctrl.hideTraffic();
    //        showTraffic = false;
    //        $(this).find(".ace-text").html(__tr("open road condition"));
    //    } else {
    //        ctrl.showTraffic();
    //        showTraffic = true;
    //        $(this).find(".ace-text").html(__tr("close road condition"));
    //    }
    //});

    //缩略图控件
    //var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
    //GetMapObj().maplet.addControl(ctrl_ove);

    ////查询
    //$(".searchbtn").click(function () {
    //    $("#SearchList").html("");
    //    local.search($("#SearchText").val());
    //});

    //查询服务
    //var options = {
    //    //renderOptions: { map: map },
    //    pageCapacity: 100,
    //    onSearchComplete: function (results) {
    //        // 判断状态是否正确
    //        if (local.getStatus() == BMAP_STATUS_SUCCESS) {
    //            //var s = "";
    //            var SearchResult = "";
    //            for (var i = 0; i < results.getCurrentNumPois() ; i++) {
    //                //for (var i = 0; i < 3 ; i++) {
    //                var result = results.getPoi(i);
    //                //s += "<li class='SearchResult' point='" + result.point.lat + "," + result.point.lng + "'>" + result.title + "</br>" + result.province + "," + result.city + "," + "</hr></li>";
    //                SearchResult += "<tr class='SearchResult' point='" + result.point.lat + "," + result.point.lng + "'><td>" + (i + 1) + "</td><td>" + result.title + "</td><td>" + result.address + "</td></tr>";
    //                AddFindMarker(result);
    //            }
    //            $("#SearchResult").html(SearchResult);
    //            $("#SearchResult").find("tr.SearchResult").click(function () {
    //                var point = $(this).attr("point");
    //                GetMapObj().setMapCenterAndZoom(point.split(",")[1], point.split(",")[0], 15);
    //            });
    //            $("#ShowFindDialog").removeClass('hide').dialog({
    //                modal: false,
    //                title: "",
    //                title_html: true,
    //                width: 550,
    //                height: 400,
    //                close: ClearFindDate
    //            });
    //        } else {
    //            ClearFindDate();
    //            showMsg($, __tr("Not data"));
    //        }
    //    }
    //};
    //var local = new BMap.LocalSearch(GetMapObj().maplet, options);

    //添加查询出来的marker
    function AddFindMarker(json) {
        var marker = GetMapObj().GetMarker();
        marker.setPosition(json.point);
        marker.setLabel(GetMapObj().GetLabel(json.title));
        GetMapObj().maplet.addOverlay(marker);
        marker.tags = json.tags;
        marker.addEventListener("click", ShowFindMarkerInfo);

        Findoverlays.push(marker);
    }

    //查询出来的marker点击弹出气泡
    function ShowFindMarkerInfo(e) {
        var tags = this.tags;
        var sContent = "";
        for (var key in tags) {
            sContent += tags[key];
        }
        var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
        this.openInfoWindow(infoWindow);
    }

    //清除地图查询的marker
    function ClearFindDate() {
        CleanMapOverLays();
        for (var i = 0; i < Findoverlays.length; i++) {
            GetMapObj().removeOverlay(Findoverlays[i]);
        }
        Findoverlays.length = 0;
    }

    ////找已定位的车
    //$("#sCarLocationLi").click(function () {

    //});

    ////找自己的车
    //$("#sCarOneselfLi").click(function () {
    //    //var pStart = new BMap.Point(116.274625, 39.961627);
    //    //var pEnd = new BMap.Point(116.367474, 39.988609);
    //    //var bs = new BMap.Bounds(pStart, pEnd);   //自己规定范围
    //    //local.searchInBounds("银行", bs);
    //});

    ////找收费站
    //$("#sTollStationLi").click(function () {
    //    FindStr = __tr("Toll Gate");
    //    drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    //    drawingFind.open();
    //});

    ////找加油站
    //$("#sOilLi").click(function () {
    //    FindStr = __tr("gas station");
    //    drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    //    drawingFind.open();
    //});

    ////找停车场
    //$("#sParkingLi").click(function () {
    //    FindStr = __tr("parking lot");
    //    drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    //    drawingFind.open();
    //});

    ////找高速路出入口
    //$("#sHighWayLi").click(function () {
    //    FindStr = __tr("high-speed road entrance");
    //    drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    //    drawingFind.open();
    //});

    ////查询关键字
    //var FindStr = "";

    ////实例化鼠标绘制工具
    //var drawingFind = new BMapLib.DrawingManager(GetMapObj().maplet, {
    //    isOpen: false, //是否开启绘制模式
    //    enableDrawingTool: false, //是否显示工具栏
    //    setDrawingMode: { BMAP_DRAWING_RECTANGLE},
    //            rectangleOptions: styleOptions //矩形的样式
    //    });
    var Findoverlays = [];
    ////实例化鼠标绘制工具
    //var drawingFindcomplete = function (e) {
    //    if (e.drawingMode == BMAP_DRAWING_RECTANGLE) {
    //        //方形
    //        var point0 = e.overlay.getPath()[0].lng + "," +e.overlay.getPath()[0].lat;
    //        var point2 = e.overlay.getPath()[2].lng + "," +e.overlay.getPath()[2].lat;
    //        //判断对角坐标如果相同则不执行
    //        if (point0 != point2) {
    //            var pStart;
    //            var pEnd;
    //            for (var i = 0; i < e.overlay.getPath().length; i++) {
    //                if (i < 2) {
    //                    if (e.overlay.getPath()[i].lat < e.overlay.getPath()[i +2].lat && e.overlay.getPath()[i].lng < e.overlay.getPath()[i +2].lng) {
    //                        pStart = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
    //                        pEnd = new BMap.Point(e.overlay.getPath()[i +2].lng, e.overlay.getPath()[i +2].lat);
    //                        break;
    //    }
    //    } else if (i >= 2) {
    //                    if (e.overlay.getPath()[i].lat < e.overlay.getPath()[i -2].lat && e.overlay.getPath()[i].lng < e.overlay.getPath()[i -2].lng) {
    //                        pStart = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
    //                        pEnd = new BMap.Point(e.overlay.getPath()[i - 2].lng, e.overlay.getPath()[i - 2].lat);
    //                        break;
    //                    }
    //    }
    //            }
    //            Findoverlays.push(e.overlay);
    //            var bs = new BMap.Bounds(pStart, pEnd);   //自己规定范围
    //            local.searchInBounds(FindStr, bs);
    //        } else {
    //            return;
    //        }
    //    }
    //    drawingFind.close();
    //};
    ////添加鼠标绘制工具监听事件，用于获取绘制结果
    //drawingFind.addEventListener('overlaycomplete', drawingFindcomplete);

    //切换地图
    $("#Google").click(function () {
        ClearFindDate();
        showMsg($, __tr("switch Google Maps"));
        if (map_Google == null) {
            map_Google = new googleAPI();
        }
        map = "google";
        map_Google.InitGoogle("container");
        $("#ChoiceMap").find(".ace-text").html(__tr("Google Maps"));
    });

    $("#Baidu").click(function () {
        ClearFindDate();
        showMsg($, __tr("switch Baidu Maps"));
        map = "baidu";
        map_Baidu.InitBaidu("container");
        $("#ChoiceMap").find(".ace-text").html(__tr("Baidu Maps"));

    });

    //切换城市
    loadProvinceInfos();
    //$("#CityList").click(function () {
    //    $(this).parent().toggleClass("open");
    //});

    //切换到省会列表
    $("#AccordingToPA").click(function () {
        $("#provinceDiv").removeClass("hide");
        $("#cityDiv").addClass("hide");
        $(this).addClass("now");
        $("#AccordingToCA").removeClass("now");
        loadProvinceInfos();
    });
    //切换到城市列表
    $("#AccordingToCA").click(function () {
        $("#provinceDiv").addClass("hide");
        $("#cityDiv").removeClass("hide");
        $(this).addClass("now");
        $("#AccordingToPA").removeClass("now");
        loadCityInfos();
    });

    $("#searchCityBtn").bind("click", function () {
        searchCity();
    });

    //省会索引点击
    $("#provinceDiv .line a").bind("click", function () {
        focusCityA(0, this);
    });
    //城市索引点击
    $("#cityDiv .line a").bind("click", function () {
        focusCityA(1, this);
    });

    //查询城市
    function searchCity() {
        try {
            var pClassStr = $("#AccordingToPA").attr("class");
            var cClassStr = $("#AccordingToCA").attr("class");
            var selDivId = "";
            if (pClassStr.indexOf("now") >= 0) {
                selDivId = "provinceDiv"
            } else {
                selDivId = "cityDiv"
            }
            var sTxt = $.trim($("#searchCityTxt").val());
            if (sTxt != "" && sTxt != __tr("Enter a city name")) {
                var selCityA = null;
                var selCount = 0;
                var citys = $("#" + selDivId + " a");
                var allCitys = $("#hotCityDiv a");
                $.merge(allCitys, citys);
                for (var i = 0, len = allCitys.length; i < len; i++) {
                    allCitys[i].className = "";
                    if (allCitys[i].innerHTML.indexOf(sTxt) >= 0 || sTxt.indexOf(allCitys[i].innerHTML) >= 0) {
                        allCitys[i].className = "selected";
                        if (selCityA == null || $(allCitys[i]).html().replace("市", "") != $(selCityA).html().replace("市", "")) {
                            selCount++
                        }
                        selCityA = allCitys[i]
                    }
                }
                $(selCityA).focus();
                if (selCityA != null && selCount == 1) {
                    $(selCityA).click()
                }
            } else {
                $("#citySelDiv a[class='selected']").removeClass("selected");
                $("#searchCityTxt").blur()
            }
        } catch (ex) {
            catchTheException("searchCity", ex)
        }
    };

    //索引焦点
    function focusCityA(type, obj) {
        try {
            var flagStr = (type == 0) ? "p" : "c";
            var letterStr = $.trim($(obj).html());
            if (letterStr == "其它") {
                letterStr = "Other";
            }
            $("#" + flagStr + letterStr).focus();
        } catch (ex) {
            catchTheException("focusCityA", ex);
        }
    };

    //加载城市
    function loadCityInfos() {
        try {
            if ($.trim($("#cityInfoTB").html()) != "") {
                return
            }
            var cCityAArr = new Array();
            cCityAArr["A"] = new Array();
            cCityAArr["B"] = new Array();
            cCityAArr["C"] = new Array();
            cCityAArr["D"] = new Array();
            cCityAArr["E"] = new Array();
            cCityAArr["F"] = new Array();
            cCityAArr["G"] = new Array();
            cCityAArr["H"] = new Array();
            cCityAArr["J"] = new Array();
            cCityAArr["K"] = new Array();
            cCityAArr["L"] = new Array();
            cCityAArr["M"] = new Array();
            cCityAArr["N"] = new Array();
            cCityAArr["P"] = new Array();
            cCityAArr["Q"] = new Array();
            cCityAArr["R"] = new Array();
            cCityAArr["S"] = new Array();
            cCityAArr["T"] = new Array();
            cCityAArr["W"] = new Array();
            cCityAArr["X"] = new Array();
            cCityAArr["Y"] = new Array();
            cCityAArr["Z"] = new Array();
            var cContentArr = new Array();
            var cStr = "";
            for (var i in cCityDatas) {
                for (var j = 0, len = cCityDatas[i].length; j < len; j++) {
                    var cityArr = cCityDatas[i][j].split("|");
                    cCityAArr[cityArr[4]].push('<a href="javascript:void(0)" onclick="setMapCity(1,\'' + cCityDatas[i][j] + '\');">' + cityArr[0].replace("市", "") + '</a>')
                }
            }
            for (var n in cCityAArr) {
                cStr = '<tr>' + '<td valign="top"><b><a href="javascript:void(0)" id="c' + n + '">' + n + '</a></b></td>' + '<td>' + cCityAArr[n].join("") + '</td>' + '</tr>';
                cContentArr.push(cStr)
            }
            $("#cityInfoTB").html(cContentArr.join(""));
            //$("#cContentDiv").unmask();
        } catch (ex) {
            window.catchTheException("loadCityInfos", ex);
        }
    };

    //加载省会
    function loadProvinceInfos() {
        try {
            if ($.trim($("#provinceInfoTB").html()) != "") {
                return
            }
            var pContentArr = new Array();
            var pStr = "";
            var pFlag = "";
            var pNumber = "";
            for (var i = 0, len = cProvinceDatas.length; i < len; i++) {
                var cProvinceArr = cProvinceDatas[i].split("|");
                if (cProvinceArr[4] == "") {
                    continue
                }
                pStr = '<tr>';
                if (cProvinceArr[4] != pFlag) {
                    pStr += '<td valign="top"><b><a href="javascript:void(0)" style="cursor:default;" id="p' + cProvinceArr[4] + '">' + cProvinceArr[4] + '</a></b></td>';
                    pNumber += "<a href=\"javascript:void(0)\">" + cProvinceArr[4] + "</a>";
                } else if (cProvinceArr[4] == pFlag) {
                    pStr += '<td></td>'
                }
                pStr += '<td valign="top"><h2><a href="javascript:void(0)" onclick="setMapCity(0,\'' + cProvinceDatas[i] + '\');">' + cProvinceArr[0].replace("省", "") + '</a></h2></td>';
                pStr += '<td>';
                for (var j = 0, len1 = cCityDatas[cProvinceArr[0]].length; j < len1; j++) {
                    var cityArr = cCityDatas[cProvinceArr[0]][j].split("|");
                    pStr += '<a href="javascript:void(0)" onclick="setMapCity(1,\'' + cCityDatas[cProvinceArr[0]][j] + '\');">' + cityArr[0].replace("市", "") + '</a>'
                }
                pStr += '</td>' + '</tr>';
                pFlag = cProvinceArr[4];
                pContentArr.push(pStr)
            }
            pStr = '<tr>' + '<td></td>' + '<td><h3><a href="javascript:void(0)" style="cursor:default;" id="pOther">其它</a></h3></td>' + '<td>';
            for (var n = 0, len = cCityDatas["其它"].length; n < len; n++) {
                var cityArr = cCityDatas["其它"][n].split("|");
                pStr += '<a href="javascript:void(0)" onclick="setMapCity(1,\'' + cCityDatas["其它"][n] + '\');">' + cityArr[0].replace("市", "") + '</a>'
            }
            pStr += '</td>' + '</tr>';
            pContentArr.push(pStr);
            $("#provinceInfoTB").html(pContentArr.join(""));
            $("#provinceDiv .line").html(pNumber);
        } catch (ex) {
            window.catchTheException("loadProvinceInfos", ex);
        }
    };

    ////保存区域弹窗
    //function SaveAreaDialog() {
    //    $("#SaveAreaDialog").removeClass('hide').dialog({
    //        modal: true,
    //        title: "",
    //        title_html: true,
    //        width: 550,
    //        buttons: [
    //            {
    //                text: __tr("Save"),
    //                "class": "btn btn-sm btn-primary btn-round padding-lr-36",
    //                click: function () {
    //                    SaveArea();
    //                    $(this).dialog("close");
    //                    CleanMapOverLays();
    //                }
    //            },
    //            {
    //                text: __tr("Close"),
    //                "class": "btn btn-white btn-primary btn-round  padding-lr-36 margin-l-15",
    //                click: function () {
    //                    $(this).dialog("close");
    //                    CleanMapOverLays();
    //                }
    //            }
    //        ],
    //        close: function () {
    //            CleanInputValue("SaveAreaDialog");
    //        }
    //    });
    //}

    ////保存路径弹窗
    //function SaveRouteDialog() {
    //    $("#SaveRouteDialog").removeClass('hide').dialog({
    //        modal: true,
    //        title: "",
    //        title_html: true,
    //        width: 550,
    //        buttons: [
    //            {
    //                text: __tr("Save"),
    //                "class": "btn btn-sm btn-primary btn-round padding-lr-36",
    //                click: function () {
    //                    SaveRoute();
    //                    $(this).dialog("close");
    //                }
    //            },
    //            {
    //                text: __tr("Close"),
    //                "class": "btn btn-white btn-primary btn-round  padding-lr-36 margin-l-15",
    //                click: function () {
    //                    $(this).dialog("close");
    //                }
    //            }
    //        ],
    //        close: function () {
    //            CleanInputValue("SaveRouteDialog");
    //        }
    //    });
    //}

    ////保存区域
    //function SaveArea() {
    //    var varmFNumber = $("#mFNumber").val();
    //    var varmFName = $("#mFName").val();
    //    var varmFDescription = $("#mFDescription").val();
    //    var varmFOUID = $("#mFOU").attr("OUID");
    //    var varmFType = $("#mFType").val();
    //    var varmFFrom = $("#mFFrom").val();
    //    var varmFHotspotRadius = $("#mFHotspotRadius").val();
    //    var varmFLimitSpeedValue = $("#mFLimitSpeedValue").val();
    //    var varmFLimitTimeValue = $("#mFLimitTimeValue").val();
    //    var varmFHead = $("#mFHead").val();
    //    var varmFMovePhone = $("#mFMovePhone").val();

    //    //坐标点
    //    var varmFCoordinateFence = $("#mFCoordinateFence").val();
    //    $.post(
    //        "/GIS/AreaEdit/Save", {
    //            mFNumber: varmFNumber,
    //            mFName: varmFName,
    //            mFDescription: varmFDescription,
    //            mFOUID: varmFOUID,
    //            mFType: varmFType,
    //            mFFrom: varmFFrom,
    //            mFHotspotRadius: varmFHotspotRadius,
    //            mFCoordinateFence: varmFCoordinateFence,
    //            mFLimitSpeedValue: varmFLimitSpeedValue,
    //            mFLimitTimeValue: varmFLimitTimeValue,
    //            mFHead: varmFHead,
    //            mFMovePhone: varmFMovePhone
    //        },
    //        function (data) {
    //            if (!CheckDataStatus(data, $)) return;
    //            //var json = $.parseJSON(data);
    //        }
    //    );
    //}

    ////保存路线
    //function SaveRoute() {
    //    var isadd = true;
    //    var varmFNumber = $("#mFNumberR").val();
    //    var varmFName = $("#mFNameR").val();
    //    var varmFOUID = $("#mFOUR").attr("ouid");
    //    var varmFDescription = $("#mFDescriptionR").val();
    //    var routecoordinatesJson = "[";
    //    var routePoints = points.split("|");
    //    //获取线路点的Json数据
    //    for (var i = 0; i < routePoints.length; i++) {
    //        var lng = routePoints[i].split(",")[0];
    //        var lat = routePoints[i].split(",")[1];
    //        var ismarker = false;
    //        //for (var j = 0; j < Marker.length; j++) {
    //        //    var markerPoint = Marker[i].marker.GetMapObj().GetPosition();
    //        //    if (markerPoint.lat == lat && markerPoint.lng==lng) {
    //        //        ismarker = true;
    //        //        break;
    //        //    }
    //        //}
    //        routecoordinatesJson += '{"mFMarking":"' + ismarker + '","mFIndex":"' + (i + 1) + '","mFLng":"' + lng + '","mFLat":"' + lat + '"},';
    //    }
    //    routecoordinatesJson = routecoordinatesJson.substr(0, routecoordinatesJson.length - 1);
    //    routecoordinatesJson += "]";
    //    $.post("/GIS/RouteEdit/Save", {
    //        mFNumber: varmFNumber,
    //        mFName: varmFName,
    //        mFOUID: varmFOUID,
    //        mFDescription: varmFDescription,
    //        routecoordinatesJson: routecoordinatesJson
    //    }, function (data) {
    //        if (!CheckDataStatus(data, $)) return;
    //        // var json = $.parseJSON(data);
    //    });
    //}

    //清除
    function clearOverlay() {
        $("#mFCoordinateFence").val("");
        $("#mFHotspotRadius").val("");
        for (var i = 0; i < overlays.length; i++) {
            GetMapObj().maplet.removeOverlay(overlays[i]);
            overlays.splice(i);
        }
        for (var i = 0; i < Marker.length; i++) {
            GetMapObj().maplet.removeOverlay(Marker[i]);
        }
    }

    $("#BtnDel").click(function () {
        clearOverlay();
    });

    ////区域设置开始
    //var drawingManager;
    //var driving;
    var points = "";

    ////添加区域画圆
    //$("#CIRCLE").click(function () {
    //    drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
    //    drawingManager.open();
    //});
    ////添加区域多边形
    //$("#POLYGON").click(function () {
    //    drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
    //    drawingManager.open();
    //});
    ////添加区域方形
    //$("#RECTANGLE").click(function () {
    //    drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    //    drawingManager.open();
    //});

    //$(".mapicon-look").click(function () {
    //    showMsg($, __tr("Display area"));
    //});

    ////路线计算开始
    ////计算路线
    //$("#searchRoute").click(function () {
    //    GetMapObj().maplet.removeEventListener("click", AddRouteMarker);
    //    routeSearch();
    //});

    ////选点事件
    //function AddRouteMarker(e) {
    //    var marker = GetMapObj().GetMarker();
    //    var point = GetMapObj().GetPosition(e.point.lng, e.point.lat);
    //    marker.setPosition(point);
    //    GetMapObj().maplet.addOverlay(marker);
    //    RouteMarker.push(marker);
    //}


    //function routeSearch() {
    //    var start = new BMap.Point(RouteMarker[0].point.lng, RouteMarker[0].point.lat);
    //    var end = new BMap.Point(RouteMarker[RouteMarker.length - 1].point.lng, RouteMarker[RouteMarker.length - 1].point.lat);
    //    var waypoints = [];
    //    for (var i = 1; i < RouteMarker.length - 1; i++) {
    //        var point = new BMap.Point(RouteMarker[i].point.lng, RouteMarker[i].point.lat);
    //        waypoints.push(point);
    //    }
    //    driving.search(start, end, { waypoints: waypoints });
    //}

    ////生成路线回调
    //function SearchComplete(results) {
    //    if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
    //        return;
    //    }
    //    var points = results.getPlan(0).getRoute(0).getPath();
    //    GetMapObj().maplet.addOverlay(points);
    //    markers["polyLine"] = points;
    //    var plan = results.getPlan(0);
    //    Duration = plan.getDuration(true); //获取时间
    //    Distance = plan.getDistance(true); //获取距离
    //};

    ////生成路线回调
    //function polyLineSet() {
    //    setTimeout(function () {
    //        var Plan = driving.getResults().getPlan(0);
    //        points = "";
    //        var count = 0;
    //        for (var j = 0; j < Plan.getNumRoutes() ; j++) {
    //            var path = Plan.getRoute(j).getPath();
    //            for (var i = 0; i < path.length; i++) {
    //                var point = path[i];
    //                points += point.lng + "," + point.lat + "|";
    //                count++;
    //            }
    //            var route = Plan.getRoute(j);
    //            var s = [];
    //            for (var i = 0; i < route.getNumSteps() ; i++) {
    //                var step = route.getStep(i);
    //                //s.push("<tr><td>" + (i + 1) + step.getDescription() + "</td></tr>");
    //                s.push("<div>" + (i + 1) + step.getDescription() + "</div>");
    //            }
    //            $("#RouteResult").html(s.join());
    //            $("#RouteResult").removeClass('hide').dialog({
    //                modal: false,
    //                title: "",
    //                title_html: true,
    //                width: 650,
    //                height: 300,
    //                buttons: [
    //                    {
    //                        text: __tr("Save road"),
    //                        "class": "btn btn-sm btn-primary btn-round padding-lr-36",
    //                        click: function () {
    //                            SaveRouteDialog();
    //                            //$(this).dialog("close");
    //                        }
    //                    },
    //                    {
    //                        text: __tr("Re navigation"),
    //                        "class": "btn btn-sm btn-primary btn-round padding-lr-36",
    //                        click: function () {
    //                            $("#navigation").click();
    //                            GetMapObj().maplet.clearOverlays();
    //                            $(this).dialog("close");
    //                        }
    //                    },
    //                    {
    //                        text: __tr("Close"),
    //                        "class": "btn btn-white btn-primary btn-round  padding-lr-36",
    //                        click: function () {
    //                            GetMapObj().maplet.clearOverlays();
    //                            $(this).dialog("close");
    //                        }
    //                    }
    //                ]
    //            });
    //        }
    //        //alert(driving.getResults().getPlan(0).getNumRoutes() + "总共有" + count + "个坐标点\n" + points);
    //    }, "1000");
    //}

    //driving = new BMap.DrivingRoute(GetMapObj().maplet, {
    //    renderOptions: { map: GetMapObj().maplet, enableDragging: true, autoViewport: true },
    //    onSearchComplete: SearchComplete,
    //    onPolylinesSet: polyLineSet
    //});


    ////路线计算结束

    ////实例化鼠标绘制工具
    //var overlaycomplete = function (e) {
    //    var result = "";
    //    //result += e.drawingMode + ":";
    //    if (e.drawingMode == BMAP_DRAWING_MARKER) {
    //        result += e.overlay.GetMapObj().GetPosition().lng + ',' + e.overlay.GetMapObj().GetPosition().lat + "|";
    //    }
    //    else if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
    //        //圆形
    //        result += e.overlay.getCenter().lng + "," + e.overlay.getCenter().lat + "|";
    //        var point = new BMap.Point(e.overlay.getCenter().lng, e.overlay.getCenter().lat);
    //        if (e.overlay.getRadius() != 0) {
    //            //判断圆的范围,如果为0则不执行
    //            $("#mFHotspotRadius").val(e.overlay.getRadius());
    //            //AddMarker(point, 0);
    //            overlays.push(e.overlay);
    //        } else {
    //            $("#mFHotspotRadius").val("200");
    //            var circle = new BMap.Circle(point, "200", styleOptions); //创建圆
    //            GetMapObj().maplet.addOverlay(circle);
    //            //AddMarker(point, 0);
    //            overlays.push(circle);
    //        }
    //    }
    //    else if (e.drawingMode == BMAP_DRAWING_POLYGON) {
    //        //多边形
    //        for (var i = 0; i < e.overlay.getPath().length; i++) {
    //            result += e.overlay.getPath()[i].lng + "," + e.overlay.getPath()[i].lat + "|";
    //            var point = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
    //            //AddMarker(point, i);
    //            overlays.push(e.overlay);
    //        }
    //    }
    //    else if (e.drawingMode == BMAP_DRAWING_RECTANGLE) {
    //        //方形
    //        var point0 = e.overlay.getPath()[0].lng + "," + e.overlay.getPath()[0].lat;
    //        var point2 = e.overlay.getPath()[2].lng + "," + e.overlay.getPath()[2].lat;
    //        //判断对角坐标如果相同则不执行
    //        if (point0 != point2) {
    //            for (var i = 0; i < e.overlay.getPath().length; i++) {
    //                result += e.overlay.getPath()[i].lng + "," + e.overlay.getPath()[i].lat + "|";
    //                var point = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
    //                if (i % 2 == 0) {
    //                    //AddMarker(point, i);
    //                }
    //                overlays.push(e.overlay);
    //            }
    //        } else {
    //            return;
    //        }
    //    }
    //    var temp = result.substr(result.length - 1, result.length);
    //    if (result.length > 0 && temp == "|") {
    //        result = result.substr(0, result.length - 1);
    //    }
    //    $("#mFCoordinateFence").val(result); //将绘制的覆盖物信息结果输出到结果面板
    //    drawingManager.close();
    //    SaveAreaDialog();
    //};

    ////实例化鼠标绘制工具
    //drawingManager = new BMapLib.DrawingManager(GetMapObj().maplet, {
    //    isOpen: false, //是否开启绘制模式
    //    enableDrawingTool: false, //是否显示工具栏
    //    setDrawingMode: { BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE},
    //            circleOptions: styleOptions, //圆的样式
    //            polygonOptions: styleOptions, //多边形的样式
    //            rectangleOptions: styleOptions //矩形的样式
    //    });

    ////添加鼠标绘制工具监听事件，用于获取绘制结果
    //drawingManager.addEventListener('overlaycomplete', overlaycomplete);

    ////热点失去焦点事件,用于文本修改后圆行区域生成新的区域
    //$("#mFHotspotRadius").focusout(function () {
    //    var overlay = overlays[0];
    //    GetMapObj().maplet.removeOverlay(overlay);
    //    overlays.splice(0);
    //    //圆的加载方法
    //    var pointstr = $("#mFCoordinateFence").val();
    //    var point = new BMap.Point(pointstr.split(",")[0], pointstr.split(",")[1]);
    //    var circle = new BMap.Circle(point, $("#mFHotspotRadius").val(), styleOptions); //创建圆
    //    GetMapObj().maplet.addOverlay(circle);
    //    overlays.push(circle);
    //    });
    ////添加marker
    //function AddMarker(point, title) {
    //    var marker = GetMapObj().GetMarker();
    //    marker.setPosition(point);
    //    marker.setTitle(title);
    //    marker.enableDragging();
    //    GetMapObj().maplet.addOverlay(marker);
    //    marker.addEventListener("dragend", ChangeMarkerPosition);
    //    Marker.push(marker);
    //    }

    ////marker拖动后的回调,用来改变线的坐标
    //function ChangeMarkerPosition(e) {
    //    var overlay = overlays[0];
    //    GetMapObj().maplet.removeOverlay(overlay);
    //    overlays.splice(0);
    //    var points =[];
    //    var result = '';
    //    if ($("#mFType").val() == "C") {
    //        //圆的加载方法
    //        var point = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
    //        var circle = new BMap.Circle(point, $("#mFHotspotRadius").val(), styleOptions); //创建圆
    //        GetMapObj().maplet.addOverlay(circle);
    //        overlays.push(circle);
    //        $("#mFCoordinateFence").val(e.target.GetMapObj().GetPosition().lng + "," +e.target.GetMapObj().GetPosition().lat);
    //    }
    //    else if ($("#mFType").val() == "R") {
    //        var point0;
    //        var point2;
    //        if (e.target.getTitle() == 0) {
    //            point0 = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
    //            point2 = new BMap.Point(overlay.getPath()[2].lng, overlay.getPath()[2].lat);
    //        } else {
    //            point2 = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
    //            point0 = new BMap.Point(overlay.getPath()[0].lng, overlay.getPath()[0].lat);
    //        }
    //        var point1 = new BMap.Point(point0.lng, point2.lat);
    //        var point3 = new BMap.Point(point2.lng, point0.lat);
    //        points.push(point0);
    //        points.push(point1);
    //        points.push(point2);
    //        points.push(point3);
    //        for (var j = 0; j < points.length; j++) {
    //            result += points[j].lng + "," + points[j].lat + "|";
    //        }
    //        var temp = result.substr(result.length - 1, result.length);
    //        if (result.length > 0 && temp == "|") {
    //            result = result.substr(0, result.length - 1);
    //        }
    //        $("#mFCoordinateFence").val(result);
    //        var polygon = new BMap.Polygon(points, styleOptions);
    //        GetMapObj().maplet.addOverlay(polygon);
    //        overlays.push(polygon);
    //    } else {
    //        for (var i = 0; i < overlay.getPath().length; i++) {
    //            var point;
    //            if (i == e.target.getTitle()) {
    //                point = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
    //                result += e.target.GetMapObj().GetPosition().lng + "," + e.target.GetMapObj().GetPosition().lat + "|";
    //            } else {
    //                point = new BMap.Point(overlay.getPath()[i].lng, overlay.getPath()[i].lat);
    //                result += overlay.getPath()[i].lng + "," + overlay.getPath()[i].lat + "|";
    //            }
    //            points.push(point);
    //        }
    //        var temp = result.substr(result.length - 1, result.length);
    //        if (result.length > 0 && temp == "|") {
    //            result = result.substr(0, result.length - 1);
    //        }
    //        $("#mFCoordinateFence").val(result);
    //        var polygon = new BMap.Polygon(points, styleOptions);
    //        GetMapObj().maplet.addOverlay(polygon);
    //        overlays.push(polygon);
    //    }
    //}

    //清除
    function CleanMapOverLays() {
        $("#mFCoordinateFence").val("");
        $("#mFHotspotRadius").val("");
        $("#mFType").val("");
        for (var i = 0; i < overlays.length; i++) {
            GetMapObj().removeOverlay(overlays[i]);
            overlays.splice(i);
        }
        overlays.length = 0;
        for (var i = 0; i < Marker.length; i++) {
            GetMapObj().removeOverlay(Marker[i]);
        }
        Marker.length = 0;
    }


    //区域设置结束

    TranslateThead();
    function TranslateThead() {
        $(document).find("span").each(function () {
            $(this).html(__tr($(this).attr("i")));
        });
        $(".customFixedTable thead").find("td").each(function () {
            $(this).html(__tr($(this).attr("i")));
        });
    }

});
var defaulttime = 400;
var timeout = 0;
var marker;
function AddMarkerToMap(point, mFID) {
    // alert(point.lng + "," + point.lat);
    //  alert(TrackJsonList[0].S8 + "," + TrackJsonList[0].S7);
    //获取marker
    marker = GetMapObj().GetMarker();
    // console.log(marker)
    //转换icon
    var Iconurl = GetCarImgUrl(Direction[c]);
    var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(25, 25), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));

    marker.setIcon(icon);
    marker.setPosition(point);
    marker.json = TrackJsonList[0];
    GetMapObj().addOverlay(marker);
    //添加到地图
    //  marker.addEventListener("click", ShowInfo);
    GetMapObj().setMarkerEventListener(marker, "click", objShow);
    //   GetMapObj().SetInLabel(marker, icon, point, TrackJsonList[0].mFVehicleLicense, TrackJsonList[0], ShowInfo);
}
//点击跳转

$(document).on("click", ".BMap_Marker", function () {
    var indexNum = $(this).css("z-index");
    for (var i = 0, len = $(".BMapLabel").length; i < len; i++) {
        if (indexNum == $(".BMapLabel").eq(i).parent().css("z-index") && $(".BMapLabel").eq(i).find(".S7").text()) {
            s7 = $(".BMapLabel").eq(i).find(".S7").text();
            s8 = $(".BMapLabel").eq(i).find(".S8").text();
            sb = $(".BMapLabel").eq(i).find(".SB").text();
            setMapCenterAndZoom(s8, s7);
            var pointitem = GetMapObj().GetPosition(s8, s7);
            var Iconurl = GetCarImgUrl(sb);
            var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(25, 25), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
            marker.setPosition(pointitem);
            marker.setIcon(icon);
            var trH = $("#TrackInfoTable").find("tr").height();
            var TrackInfoTable = $("#TrackInfoTable");
            TrackInfoTable.scrollTop(trH * (i - 4));
            $("#TrackBtn").click();
            TrackInfoTable.find("tr").removeClass("trbgcolor");
            TrackInfoTable.find("tr").eq(i - 3).focus().addClass("trbgcolor");
            //            GetMapObj().setMarkerEventListener(marker, "click", objShow);
        }
    }

});
function BingBtnClick() {
    $(".addsifang").unbind("click").click(function () {
        var lat = Number($(this).parent().attr("lat"));
        var lng = Number($(this).parent().attr("lng"));
        var pointflot = Number("0.002");

        var temp = "";
        var points = [];
        temp += lng - pointflot + "," + lat - pointflot + "|";
        var point0 = new BMap.Point(lng - pointflot, lat - pointflot);
        points.push(point0);

        temp += lng - pointflot + "," + lat + pointflot + "|";
        var point1 = new BMap.Point(lng - pointflot, lat + pointflot);
        points.push(point1);

        temp += lng + pointflot + "," + lat + pointflot + "|";
        var point2 = new BMap.Point(lng + pointflot, lat + pointflot);
        points.push(point2);

        temp += lng + pointflot + "," + lat - pointflot + "|";
        var point3 = new BMap.Point(lng + pointflot, lat - pointflot);
        points.push(point3);

        $("#mFCoordinateFence").val(temp);
        var polygon = new BMap.Polygon(points, styleOptions);
        GetMapObj().maplet.addOverlay(polygon);
        overlays.push(polygon);
        SaveAreaDialog();
    });

    $(".addpoint").unbind("click").click(function () {
        var lat = $(this).parent().attr("lat");
        var lng = $(this).parent().attr("lng");

        var point = new BMap.Point(lng, lat);
        var circle = new BMap.Circle(point, 200, styleOptions); //创建圆
        GetMapObj().maplet.addOverlay(circle);
        //AddMarker(point, 0);
        overlays.push(circle);
        $("#mFCoordinateFence").val(lng + "," + lat);
        $("#mFHotspotRadius").val("200");
        //$("#mFHotspotRadius").removeAttr("disabled");
        SaveAreaDialog();

    });

    $(".road").unbind("click").click(function () {
        $("#Traffic").click();
    });

    $(".navigation").unbind("click").click(function () {
        $("#navigation").click();
    });

    $(".track").unbind("click").click(function () {
        alert(__tr("Jump history"));
    });

    $(".manager").unbind("click").click(function () {
        alert(__tr("Jump vehicle information page"));
    });

    $(".more").unbind("click").click(function () {
        alert(__tr("More"));
    });
}

//获取车辆图标
function GetCarImgUrl(direction) {
    var direc = parseInt((parseInt(direction) + 22) / 45);
    //    switch (direc) {
    //        case 0:
    //            return "/assets/image/car_north.png";
    //        case 1:
    //            return "/assets/image/car_northeast.png";
    //        case 2:
    //            return "/assets/image/car_east.png";
    //        case 3:
    //            return "/assets/image/car_southeast.png";
    //        case 4:
    //            return "/assets/image/car_south.png";
    //        case 5:
    //            return "/assets/image/car_southwest.png";
    //        case 6:
    //            return "/assets/image/car_west.png";
    //        case 7:
    //            return "/assets/image/car_northwest.png";
    //        default:
    //            return "/assets/image/car_north.png";
    //    }
    switch (direc) {
        case 0:
            return "/assets/xjaddpic/greencar_north.gif";
        case 1:
            return "/assets/xjaddpic/greencar_northeast.gif";
        case 2:
            return "/assets/xjaddpic/greencar_east.gif";
        case 3:
            return "/assets/xjaddpic/greencar_southeast.gif";
        case 4:
            return "/assets/xjaddpic/greencar_south.gif";
        case 5:
            return "/assets/xjaddpic/greencar_southwest.gif";
        case 6:
            return "/assets/xjaddpic/greencar_west.gif";
        case 7:
            return "/assets/xjaddpic/greencar_northwest.gif";
        default:
            return "/assets/xjaddpic/greencar_north.gif";
    }
    //    switch (direc) {
    //        case 0:
    //            return "/assets/image/north_arrow.png";
    //        case 1:
    //            return "/assets/image/northeast_arrow.png";
    //        case 2:
    //            return "/assets/image/east_arrow.png";
    //        case 3:
    //            return "/assets/image/southeast_arrow.png";
    //        case 4:
    //            return "/assets/image/south_arrow.png";
    //        case 5:
    //            return "/assets/image/southwest_arrow.png";
    //        case 6:
    //            return "/assets/image/west_arrow.png";
    //        case 7:
    //            return "/assets/image/northwest_arrow.png";
    //        default:
    //            return "/assets/image/north_arrow.png";
    //    }
}

function stopCount() {
    clearTimeout(t);
}
//选择车辆(存在问题暂时不用)
//$(document).on("click", "#vehicleName", function () {
//    $(this).parent().find(".closeTree").removeClass("closeTree").addClass("openTree");
//    $(this).parent().find(".parent_li").hide();
//});
//$(document).on("click", ".MotorcadeName", function () {
//    $(this).parent().find(".parent_li").attr("style", "display:blck");
//});

function TrackPlayTimeLine() {
    $(".fatherProgress ").mousemove(function (e) {
        var xx = e.originalEvent.x || e.originalEvent.layerX || 0;
        var lineX = xx - 16;
        var lineWidth = $(".progress").width();
        var perLineX = lineX / lineWidth;
        if ($(".xj-width-150").length != 0) {
            var xjLength = $(".xj-width-150").length;
            var nowValNum = parseInt(xjLength * perLineX);
            var innerTXT = $(".xj-width-150").eq(nowValNum).text();
            $(this).attr("title", innerTXT);
        }
    });
}

TrackPlayTimeLine();

function TrackPlay() {
    $(".fatherProgress ").hover(function (e) {
        var xx = e.originalEvent.x || e.originalEvent.layerX || 0;
        var lineX = xx - 16;
        var lineWidth = $(".progress").width();
        var perLineX = lineX / lineWidth;
        if ($(".create_time").length != 0) {
            var xjLength = $(".create_time").length;
            var nowValNum = parseInt(xjLength * perLineX);
            var innerTXT = $(".create_time").eq(nowValNum).text();
            //$("#showTime").text(innerTXT);
        }
    });
    var pointitem = Direction[c++];
    var pointitem_coord = GetMapObj().GetPosition(pointitem.S8, pointitem.S7);
    var TrackInfoTable = $("#TrackInfoTable");
    var Iconurl = GetCarImgUrl(Direction[c - 1]);
    var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(25, 25), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
    //marker.setPosition(pointitem_coord);
    //marker.setIcon(icon);
    var trH = $("#TrackInfoTable").find("tr").height();
    TrackInfoTable.scrollTop(trH * (c - 3));
    TrackInfoTable.find("tr").removeClass("trbgcolor");
    TrackInfoTable.find("tr").eq(c - 2).focus().addClass("trbgcolor").click();
    $("#progress-yuan").stop().animate({
        left: (c / Direction.length) * 100 + '%'
    }, 0);;
    if (c == Direction.length) {
        $("#xj-p-stop").click();
        showMsg($, __tr("Play over!"));
        return;
    }
    //console.log(pointitem);
    //setMapCenterAndZoom(pointitem.S8, pointitem.S7);
    t = setTimeout('TrackPlay()', timeout);
}

//function ShowInfo() {
//    var windowInfo = GetWindowHtml(TrackJsonList[c]);
//    var infoWindow = new BMap.InfoWindow(windowInfo); // 创建信息窗口对象
//    infoWindow.height = 100;
//    marker.openInfoWindow(infoWindow);
//}

//var objShow = function GetWindowHtml(e) {
//    var json = $.parseJSON(this.json);
//    console.log(json);
//    var sContent = "<div id=\"header\" style='font-size:18px;'>" + json.mFVehicleLicense + "(" + json.S3 + ")</div><div style='overflow:auto;height:170px;padding:5px;width:300px;'>";
//    var CarMarker = this;
//    //bubbleJson = $.parseJSON(bubbleJson);
//    $.each(bubbleJson.mObject, function (index, obj) {
//        for (var key in json) {
//            if (obj.mFField == key) {
//                if (obj.mFField == 'S6') {
//                    //时间
//                    sContent += "<div style='width:100px;text-align:right;float:left;'><b>" + obj.mFDescription + "：</b></div>" + TransDate(json[key]) + "<br />";
//                } else if (obj.mFField == 'TempMonitor') {
//                    //温度
//                    if (json[key] != "") {
//                        sContent += "<div style='width:100px;text-align:right;float:left;'><b>" + obj.mFDescription + "：</b></div>";
//                        var tempMonitor = json[key];
//                        for (var i = 0; i < tempMonitor.length; i++) {
//                            sContent += "<div style='margin-left:100px;'>" + tempMonitor[i] + "℃</div>";
//                        }
//                        // sContent += "</p>";
//                    }
//                } else if (obj.mFField == 'E1T') {
//                    //状态
//                    if (json[key] != "") {

//                        var statusJson = $.parseJSON(json[key]);
//                        if (statusJson != null) {
//                            sContent += "<div style='width:100px;text-align:right;float:left;'><b>" + obj.mFDescription + "：</b></div>";
//                            $.each(bubbleJson.mObject, function (cindex, cobj) {
//                                $.each(statusJson, function (sindex, sobj) {
//                                    if (cobj.mFField == "E1T_" + sobj.BT) {
//                                        sContent += "<div style='margin-left:100px;'>" + GetStatuStr(sobj) + "</div>";
//                                    }
//                                });
//                            });
//                            sContent += "<br />";
//                        }
//                    }
//                } else if (obj.mFField == 'E2T') {
//                    //报警
//                    if (json[key] != "") {

//                        var statusJson = $.parseJSON(json[key]);
//                        if (statusJson != null) {
//                            sContent += "<div style='width:100px;text-align:right;float:left;'><b>" + obj.mFDescription + "：</b></div>";
//                            $.each(bubbleJson.mObject, function (cindex, cobj) {
//                                $.each(statusJson, function (sindex, sobj) {
//                                    if (cobj.mFField == "E2T_" + sobj.BT) {
//                                        sContent += "<div style='margin-left:100px;'>" + GetStatuStr(sobj) + "</div>";
//                                    }
//                                });
//                            });
//                            sContent += "<br />";
//                        }
//                    }
//                } else {
//                    //其他文本,不涉及需要格式化的数据
//                    sContent += "<div style='width:100px;text-align:right;float:left;'><b>" + obj.mFDescription + "：</b></div>" + json[key] + "<br />";
//                }

//                break;
//            }
//        }

//    });
//    sContent += "</div>";
//    //sContent += '<div id="tools" style="width:100%;background:#F1F1F1;padding:2px;height:30px;" lng=' + json.S7 + ' lat=' + json.S8 + '>';
//    //sContent += '<div style="padding:2px;" class="InfoWindow_btn addsifang" title="'+__tr("Add area")+'"><i></i></div>';
//    //sContent += '<div style="padding:2px;" class="InfoWindow_btn addpoint" title="' + __tr("Add point") + '"><i></i></div>';
//    //sContent += '<div style="padding:2px;" class="InfoWindow_btn road" title="' + __tr("Query traffic") + '" ><i></i></div>';
//    //sContent += '<div style="padding:2px;" class="InfoWindow_btn navigation" title="' + __tr("Navigation") + '" ><i></i></div>';
//    //sContent += '<div style="padding:2px;" class="InfoWindow_btn track" title="' + __tr("Track playback") + '" ><i></i></div>';
//    //sContent += '<div style="padding:2px;" class="InfoWindow_btn manager" title="' + __tr("Vehicle management") + '" ><i></i></div>';
//    //sContent += '<div style="padding:2px;" class="InfoWindow_btn more" title="' + __tr("More") + '" ><i></i></div>';
//    sContent += '</div>';
//    GetMapObj().OpenMarkerInfoWindow(sContent, CarMarker);
//    setTimeout(BingBtnClick, 100);
//    //return sContent;

//}
function GetStatuStr(obj) {
    switch (obj.BT) {
        case "BIT0":
            return obj.V == "1" ? __tr("ACC ON") : __tr("ACC OFF");
        case "BIT1":
            return obj.V == "1" ? __tr("Engine ON") : __tr("Engine OFF");
        case "BIT2":
            return obj.V == "1" ? __tr("Brake") : __tr("not braking");
        case "BIT3":
            return obj.V == "1" ? __tr("Universal port 1 ON") : __tr("Universal port 1 OFF");
        case "BIT4":
            return obj.V == "1" ? __tr("Universal port 2 ON") : __tr("Universal port 2 OFF");
        case "BIT5":
            return obj.V == "1" ? __tr("AC ON") : __tr("AC OFF");
        case "BIT6":
            return obj.V == "1" ? __tr("Door Open") : __tr("Door Close");
        case "BIT7":
            return obj.V == "1" ? __tr("High reservation: signal available") : __tr("High reservation: no signal");
        case "BIT8":
            return obj.V == "1" ? __tr("battery status: back up battery") : __tr("Battery status: Main power");
        case "BIT9":
            return obj.V == "1" ? __tr("Fuel cut off:  cut off") : __tr("Fuel cut off:  Normal");
        case "BIT10":
            return obj.V == "1" ? __tr("SOS: SOS on") : __tr("SOS: Normal");
        case "BIT11":
            return obj.V == "1" ? __tr("GPS antennat open circuit: Open circuit") : __tr("GPS antennat open circuit: Normal");
        case "BIT12":
            return obj.V == "1" ? __tr("GPS antenna short circuit: short circuit") : __tr("GPS antenna short circuit: Normal");
        case "BIT13":
            return obj.V == "1" ? __tr("Over speed: over speed") : __tr("Over speed: Normal");
        case "BIT14":
            return obj.V == "1" ? __tr("Universal IO port 1 status:  high") : __tr("Universal IO port 1 status:  low");
        case "BIT15":
            return obj.V == "1" ? __tr("Universal IO port 2 status:  high") : __tr("Universal IO port 2 status:  low");
        case "BIT16":
            return obj.V == "1" ? __tr("Flash:  IC normal") : __tr("Flash:  abnormal");
        case "BIT17":
            return obj.V == "1" ? __tr("FRAM: IC normal") : __tr("FRAM: IC abnormal");
        case "BIT18":
            return obj.V == "1" ? __tr("FRAM: IC normal") : __tr("FRAM: IC abnormal");
        default:
            return "";
    }

}


$(document).on("click", ".TrackInfoTabletr", function () {
    //s7 = $(this).attr("s7");
    //s8 = $(this).attr("s8");
    //sb = $(this).attr("sb");
    //var i = $(this).find(".width-45").text();
    //var trH = $(this).height;
    //setMapCenterAndZoom(s8, s7);
    //var pointitem = GetMapObj().GetPosition(s8, s7);
    //var Iconurl = GetCarImgUrl(sb);
    //var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(25, 25), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
    //marker.setPosition(pointitem);
    //marker.setIcon(icon);

});
function getQueryStringV(vhref, name) {
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空 
    vhref = decodeURIComponent(vhref);
    if (vhref.indexOf("?") == -1 || vhref.indexOf(name + '=') == -1) {
        return '';
    }
    // 获取链接中参数部分 
    var queryString = vhref.substring(vhref.indexOf("?") + 1);
    // 分离参数对 ?key=value&key2=value2 
    var parameters = queryString.split("&");
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        // 获取等号位置 
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }
        // 获取name 和 value 
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        if (paraName == name) {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
}
