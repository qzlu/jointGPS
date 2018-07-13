var timeout;
var map_Baidu;
var map_Google = null;
var map = "baidu";
var markers = [];
//全局变量
var overlays = [];
var Marker = [];
var RouteMarker = [];
var timer1;
var arrJson = [];
$(".widget-header-show>div").show();
$("#trackPanel").show();
$("#SearchText").show();
$("#map_tool0").show();
$("#map_tool1").show();
$("#map_tool2").show();
$("#map_tool3").show();
$("#map_tool4").show();
$(".shishi-search").show();
$("#myTab").show();
var mapheight = $("#iframe", window.parent.document).attr("height");
var styleOptions = {
    strokeColor: "darkgrey", //边线颜色。
    fillColor: "darkgrey", //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 2, //边线的宽度，以像素为单位。
    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
function GetMapObj() {
    if (map == "baidu") {
        return map_Baidu;
    }
    else if (map == "google") {
        return map_Google;
    }
}

function setMapCenterAndZoom(lng, lat) {
    if (lng <= 1 || lat <= 1) {
        alert("该设备未定位!");
        return false;
    }
    GetMapObj().setMapCenterAndZoom(lng+0.0001, lat+0.005, 15);
}

jQuery(function ($) {
    //多语言
    registerWords();
    var path = "/Language/MTM/Monitor/";
    translate(path);
    $("#showCarList").attr("title", __tr("show car list"));
    $("#hideCarList").attr("title", __tr("hide car list"));
    $("#allCarsA").attr("title", __tr("Click to show all vehicles"));
    $("#mapSwitchA").attr("title", __tr("Switched satellite map"));
    $("#lishowcarinfo").attr("title", __tr("Show car information"));
    $("#lihidecarinfo").attr("title", __tr("Hide car information"));
    $("#nMarkS").attr("title", __tr("Mark the starting point on the map"));
    $("#nMarkE").attr("title", __tr("Mark the end point on the map"));
    $("#SearchText").attr("placeholder", __tr("type in key words"));
    $("#searchCityTxt").attr("placeholder", __tr("type in key words"));
    $("#searchCarsInput").attr("placeholder", __tr("type in key words"));
    $("#mFCoordinateFence").attr("placeholder", __tr("Fencing the coordinates of the point,Make a point,separated by '|'"));
    $("#mFDescription").attr("placeholder", __tr("Is not required to enter,Length less than or equal to 200 characters"));
    $("#mFDescriptionR").attr("placeholder", __tr("Is not required to enter,Length less than or equal to 200 characters"));
    //功能选择弹窗
    seajs.config({
        alias: {
            "jquery": "jquery-1.10.2.min"
        }
    });
    // demo
    window.console = window.console || { log: function () { } }
    seajs.use(['jquery'], function ($) {

        $('#CompanySelect').on('click', function () {
            top.dialog({
                id: 'test-dialog',
                title: __tr("Choose company"),
                width: '1100',
                height: '530',
                url: '/ORGDialog/CompanyDialog',
                onclose: function () {
                    if (this.returnValue) {
                        var json = $.parseJSON(this.returnValue);

                        $("#mFOU").val(json.mFName);
                        $("#mFOU").attr("OUID", json.mFID);
                    }
                    //console.log('onclose');
                }

            })
                .showModal();
            return false;
        });

        $('#CompanySelectR').on('click', function () {
            top.dialog({
                id: 'test-dialog',
                title: __tr("Choose company"),
                width: '1100',
                height: '530',
                url: '/ORGDialog/CompanyDialog',
                onclose: function () {
                    if (this.returnValue) {
                        var json = $.parseJSON(this.returnValue);

                        $("#mFOUR").val(json.mFName);
                        $("#mFOUR").attr("OUID", json.mFID);


                    }
                    //console.log('onclose');
                }

            })
                .showModal();
            return false;
        });

        $('button[data-event=reload]').on('click', function () {
            location.reload();
            return false;
        });
    });

    GetSysEnum("Area.Type", "mFType");
    GetSysEnum("DataFrom", "mFFrom");
    var trackIds = [];
    var trackpoints = new Array();
    var trackPolyline = new Array();
    //初始化 baidu
    map_Baidu = new baiduAPI();


    //默认打开加载baidu
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

    var companyinfo = GetLoginUserCompanyInfo();
    refreshLoad();
    function refreshLoad() {
        $(".refresh").click(function () {
            window.parent.getAllVehicles();
            Load();
        });
    }
    window.setTimeout(Load, 1);
    $(".default-company").attr("placeholder", companyinfo.mFName);
    //加载车辆列表
    function Load() {
        //$.post("/MTM/Monitor/QueryVehicle", { mFStatus: 10, mFOUID: companyinfo.mFID }, function (data) {
        //alert(data);
        // var json = $.parseJSON(window.parent._jsonVehicles);
        // $.post("/ORGDialog/ORGDialog/doQuery", { mFOUID: companyinfo.mFOUID }, function (data) {
        var vehiclejson = $.parseJSON(window.parent._jsonVehicles);
        var orgjson = window.parent._jsonORGDialog;
        if (!CheckDataStatus(orgjson, $)) return;
        BindData(orgjson, vehiclejson);
        //console.log(vehiclejson.mRecords);
        for (var i = 0; i < vehiclejson.mRecords.length; i++) {
            //console.log(vehiclejson.mRecords[i].mFOUNumber);
            if (vehiclejson.mRecords[i].mFLicense == "7921703003" || vehiclejson.mRecords[i].mFLicense == "7921703065") {
                //console.log(vehiclejson.mRecords[i]);
            }
        }
        //一下用于统计该节点下面拥有车辆数
        var li_List = $("li[name='li_carSum']");
        for (var i = 0; i < li_List.length; i++) {
            var nowCarSum = li_List.eq(i).find(".VehicleItem").size();
            $("#b_" + li_List.eq(i).attr("id")).html("[" + nowCarSum + "]");
        }
        //  });

        // });

    }

    function BindCarData(json, carjson) {
        $.each(carjson.mRecords, function (index, obj) {

            //<a><i class="ace-icon fa xj-sanjiao-right"></i></a>
            if (json.mFID == obj.mFDeptID) {
                _html += '<li><div class="treeli" mFID="' + obj.mFID + '"><a><i class="ace-icon fa left-14"></i></a><div class="jcheckbox"><label><input name="jkcheckbox" type="checkbox" ProdID="' + obj.mFProdNumber + '" class="ace jkcheckbox" >';
                _html += '<span class="lbl"><i class="fa xj-form-check"></i></span></label></div><a class="VehicleItem"  ><i class="ace-icon fa car"></i><em >' + obj.mFLicense + '</em></a></div></li>';
            }
            else if (obj.mFDeptID == "" && json.mFID == obj.mFOUID) {
                _html += '<li><div class="treeli" mFID="' + obj.mFID + '"><a><i class="ace-icon fa left-14"></i></a><div class="jcheckbox" ><label><input name="jkcheckbox" type="checkbox" ProdID="' + obj.mFProdNumber + '" class="ace jkcheckbox" >';
                _html += '<span class="lbl"><i class="fa xj-form-check"></i></span></label></div><a class="VehicleItem"  ><i class="ace-icon fa car"></i><em >' + obj.mFLicense + '</em></a></div></li>';
            }
        });

    }


    function BindData(data, carjson) {
        json = $.parseJSON(data);
        var tabletemp = "";
        //$("#searchCarsInput").val(JSON.stringify(carjson));
        tabletemp += takeMenu(json.mObject, companyinfo.mFID, true, carjson);
        $("#MonitorList").html(tabletemp);
        //$(".dataTables_info").remove();
        BindTableClick();
        BindOpenCloseClick();
        //$(".closeTree").click();
        _html = "";
    }
    var _html = "";
    function takeMenu(all, id, bool, carjson) {
        for (var i = 0; i < all.length; i++) {
            //以上定义按钮
            var className = "";
            if (all[i].mFOrgType == "A") {
                className = "agent";
            } else if (all[i].mFOrgType == "D") {
                className = "dept";
            } else if (all[i].mFOrgType == "C") {
                className = "company";
            }
            if (bool) {
                if (all[i].mFID == id) {
                    _html += '<li><div class="treeli"><a><i class="ace-icon fa closeTree"></i></a><div class="jcheckbox"><input name="jkcheckbox" type="checkbox" class="ace checkChildren" >';
                    _html += '<span class="lbl"><i class="fa xj-form-check"></i></span></div><a><i class="ace-icon fa joint"></i><em>' + all[i].mFName + '&nbsp;<b>[' + carjson.mRecords.length + ']</b></em></a></div>';

                    _html += "<ul>";
                    takeMenu(all, all[i].mFID, false, carjson);
                    BindCarData(all[i], carjson);
                    _html += "</ul></li>";
                }
            } else {
                if (all[i].mFParentID == id) {
                    _html += '<li name="li_carSum" id="' + all[i].mFID + '"><div class="treeli"><a><i class="ace-icon fa closeTree"></i></a><div class="jcheckbox"><input name="jkcheckbox" type="checkbox" class="ace checkChildren" >';
                    _html += '<span class="lbl"><i class="fa xj-form-check"></i></span></div><a ><i class="ace-icon fa ' + className + '"></i><em>' + all[i].mFName + '&nbsp;<b id="b_' + all[i].mFID + '">[0]</b></em></a></div>';

                    _html += "<ul>";
                    takeMenu(all, all[i].mFID, false, carjson);
                    BindCarData(all[i], carjson);
                    _html += "</ul></li>";
                }
            }
        }
        return _html;
    }
    var h = mapheight - 79;
    var h2 = mapheight - 110;
    //    if ($(".mapinfo").width() < 1200) {
    //        
    //        $("#container").css("height", h);
    //        $(".jiankongtree").css("height", h);
    //    } else {
    //    
    $("#container").css("height", h);
    $(".jiankongtree").css("height", h2);
    //    }
    //滚动时候设置fixed

    //查询该节点下有多少直属车辆
    //function getNodesCarSum(json, carjson) {
    //    var CarCount = 0;
    //    $.each(carjson.mRecords, function (index, obj) {
    //        if (json.mFID == obj.mFDeptID) {
    //            CarCount++;
    //        }
    //        else if (obj.mFDeptID == "" && json.mFID == obj.mFOUID) {
    //            CarCount++;
    //        }
    //    });
    //    return CarCount;
    //}



    $("#hideCarList").click(function () {
        $(".mapinfo").removeClass("col-xs-9 col-lg-10");
        $(".mapinfo").addClass("col-sm-12");
        $(".carinfo").addClass("hide");
        $(this).addClass("hide");
        $("#showCarList").removeClass("hide");
    });

    $("#showCarList").click(function () {
        $(".mapinfo").removeClass("col-sm-12");
        $(".mapinfo").addClass("col-xs-9 col-lg-10");
        $(".carinfo").removeClass("hide");
        $(this).addClass("hide");
        $("#hideCarList").removeClass("hide");

    });


    var tab_content = $(".tab-content").height();
    var AllCarTable = $("#AllCarTable").height();
    var jiankongtree = $(".jiankongtree").height();

    function recoverDefault() {
        $(".tab-content").height(tab_content);
        $("#AllCarTable").height(AllCarTable);
        $(".jiankongtree").height(jiankongtree);
    }
    $(".trackInfo_close").click(function () {
        $("#container").css("height", h);
        $(".jiankongtree").css("height", h2);
        $(".tab-tableinfo").addClass("hide");
        $(".trackInfo_open").removeClass("hide");
        $(this).addClass("hide");
        //点击关闭Table后恢复默认
        //recoverDefault();
    });



    $(".trackInfo_open").click(function () {
        $("#container").css("height", h - 169);
        $(".jiankongtree").css("height", h - 200);
        $(".tab-tableinfo").removeClass("hide");
        $(".trackInfo_close").removeClass("hide");
        $(this).addClass("hide");

    });


    //var timerStart = false;

    //定时器
    timer();

    function timer() {

        //if (!timerStart) {
            setInterval(GetNewCarInfo, 1000*60);
            timerStart = true;
        //}
    }
    //地图放大缩小
    var resizeSwitch = true;
    $("[data-action=fullscreen]").on("click", function () {
        //recoverDefault();
        if (!$(this).hasClass("has")) {
            var changeMapHeight = parseInt(mapheight) + parseInt(15);
            $("#container").css("height", changeMapHeight);
            $(".jiankongtree").css("height", mapheight);
            $(this).find("i").removeClass("xj-expand").addClass("xj-shrink");
            $("#iframe", window.parent.document).attr("height", parseInt(mapheight) + parseInt(100));
            $(this).addClass("has");
            resizeSwitch = false;
        } else {
            $("#container").css("height", h);
            $(".jiankongtree").css("height", h2);
            $(".tab-tableinfo").addClass("hide");
            $(this).find("i").removeClass("xj-shrink").addClass("xj-expand");
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
    })
    //定时查询车辆信息
    function GetNewCarInfo() {
        var mSlaveList = "";
        for (var j = 0; j < checkCars.length; j++) {
            mSlaveList += checkCars[j] + "|";
        }

        if (mSlaveList.length != 0) {
            mSlaveList = mSlaveList.substr(0, mSlaveList.length - 1);
            QueryMonitorByVehicleIDs(mSlaveList, true);
        }
    }

    function ClearCarInfo() {
        for (var j = 0; j < markers.length; j++) {
            GetMapObj().removeOverlay(markers[j]);
        }
        for (var i = 0; i < trackPolyline.length; i++) {
            GetMapObj().removeOverlay(trackPolyline[i]);
        }
        markers = [];
        trackPolyline.length = 0;
    }

    
    //胎压弹窗
    function showTireBubble(index) {
        //var isOpen = true;
        $(document).on("click", ".bubblebtn" + index, function () {
            //if (isOpen) {
                $(this).parents("#allTable").parent().parent().find(".tirebubble").remove();
                var getStr = $(this).attr("showData");
                var tireArr = $.parseJSON(getStr);
                //console.log(tireArr);
                var tireContent = "";
                var tireTempstr = "";
                for (var i = 0; i < tireArr.length; i++) {
                    var tempStat = tireArr[i].Stat.split(",");
                    
                    //+ __tr("tyre") + (tireArr[i].TID) + ":" 
                    if (tempStat[1] != "P Normal" || tempStat[2] != "TEMP Normal") {
                        tireContent += "<div class='AbnormalData tireData tireData" + tireArr[i].TID + "'><span class='tire-pressure'>胎压 : " + tireArr[i].P + " bar</span><span class='temperature'>温度 : " + tireArr[i].T + "℃</span></div>";
                    } else {
                        tireContent += "<div class='tireData tireData" + tireArr[i].TID + "'><span class='tire-pressure'>胎压 : " + tireArr[i].P + " bar</span><span class='temperature'>温度 : " + tireArr[i].T + "℃</span></div>";
                    }
                }
                tireContent += "<i class='fa xj-close-tyre-dialog close-tyre-dialog'></i>";
                var html = "<div class='tirebubble'>" + tireContent + "</div>";
                $(this).parents("#allTable").parent().before(html);
                isOpen = false;
           // } else {
                
               // $(".tirebubble").hide();
                //isOpen = true;
           // }
            
        })
    }
    closeTyreDialog();
    function closeTyreDialog() {
        $(document).on("click", ".close-tyre-dialog", function () {
            $(".tirebubble").hide();
        })
    }

    //车辆信息Table
    function ShowCheckCars(index, carJson, TempMonitor, tireMonitor) {
        var geoc = GetMapObj().GetClientGeocoder();
        // && carJson.S7 > 1 && carJson.S8 > 1
        if (carJson != "") {
            var point = GetMapObj().GetPosition(carJson.S7, carJson.S8);
            GetMapObj().Geoco_GetLocation(geoc, point, function (json) {
                var address1;
                var address2;
                var adress1Class;
                var adress2Class;
                if (json.addressComponents.province == "" && json.addressComponents.city == "" && json.addressComponents.district == "") {
                    address1 = "-";
                    adress1Class = "text-align-center";
                } else {
                    address1 = json.addressComponents.province + "/" + json.addressComponents.city + "/" + json.addressComponents.district;
                    adress1Class = "text-align-left";
                }
                if (json.addressComponents.street != "") {
                    address2 = json.addressComponents.street;
                    adress2Class = "text-align-left";
                } else {
                    address2 = "-";
                    adress2Class = "text-align-center";
                }
                if (carJson.SC == "4294967295") {
                    carJson.SC = 0;
                }

                var temp = "";
                var trClass = "";
                var statusstr = "";
                //console.log(carJson.mFStatus);
                var date = new Date();
                var cardate = new Date(TransDate(carJson.S6));
                var num = (date - cardate) / 1000;
                if (num > 30 * 60) {
                    carJson.mFStatus = "40";
                }
                //else if (num > 5 * 60) {
                    //carJson.mFStatus = "20";
                //} else {
                    //carJson.mFStatus = "10";
               // }
                switch (carJson.mFStatus) {
                    case "10":
                        trClass = "green";
                        break;
                    case "30":
                        trClass = "purple";
                        break;
                    case "20":
                        trClass = "red";
                        break;
                    case "40":
                        trClass = "gray";
                        break;
                    default:
                        trClass = "gray";
                        break;
                }

                if (trackIds.indexOf(carJson.S3) > -1) {
                    var points = trackpoints[carJson.S3];
                    if (points == undefined) {
                        points = [];
                        points.push(GetMapObj().GetPosition(carJson.S7, carJson.S8));
                    } else {
                        var p1 = points[points.length - 1];
                        var point = GetMapObj().GetPosition(carJson.S7, carJson.S8);
                        if (p1.lat != point.lat && p1.lng != point.lng) {
                            points.push(point);
                        }
                        if (points.length >= 10) {
                            points.splice(0, 1);
                        }
                    }
                    trackpoints[carJson.S3] = points;
                    var Polyline = GetMapObj().createLine(points, { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 });
                    trackPolyline.push(Polyline);
                    GetMapObj().addOverlay(Polyline);
                } else {
                }
                temp += "<td class='xj-width-110' onclick='setMapCenterAndZoom(" + carJson.S7 + "," + carJson.S8 + ")' style='cursor: pointer;text-decoration: underline;' title='" + __tr("Click to locate the vehicle") + "' mfid ='" + carJson.mFObjectID + "'>" + carJson.mFVehicleLicense + "</td>";
                temp += "<td class='width_158'>" + TransDate(carJson.S6) + "</td>";
                temp += "<td class='width_123'>" + carJson.SA + "</td>";
                temp += "<td class='width_137'>" + carJson.SC + "</td>";
                temp += "<td class='width_145 " + adress1Class + "'>" + address2 + "</td>";
                temp += "<td class='width_218 " + adress2Class + "'>" + address1 + "</td>";

                var tireTempstr = "";

                //取出对应胎压值
                //console.log(tireMonitor);
                var tyreContent;
                $.each(tireMonitor, function (sindex, tire_obj) {
                    if (carJson.mFObjectID == tire_obj.mFObjectID) {
                        tyreContent = $.parseJSON(tire_obj.mFTyreContent);
                        //根据轮胎顺序排序
                        tyreContent.sort(function (a, b) {
                            return a.TID - b.TID
                        });
                        var tyrecount = 0;//暂时只获取六个
                        $.each(tyreContent, function (sindex, tyre_obj) {
                            if (tyrecount < 6) {
                                tireTempstr += (tireTempstr == "" ? "" : ",") + __tr("tyre") + (tyre_obj.TID) + ":";
                                var tempStat = tyre_obj.Stat.split(",");
                                if (tempStat[1] == "P Normal")
                                    tireTempstr += tyre_obj.P + " bar";
                                else
                                    tireTempstr += tyre_obj.P + " bar &nbsp;&nbsp;" + __tr(tempStat[1]) + "";
                            }
                            tyrecount++;
                        });
                    }
                });
                var ToStr = JSON.stringify(tyreContent);
                var tireTempbtn = "<a class='tirebubblebtn bubblebtn" + index + "' showData='" + ToStr + "'>详情</a>";
                //暂时胎压状态和温度状态只取其一
                //console.log(tireTempstr);
                if (tireTempstr != "") {
                    showTireBubble(index);
                    //+ tireTempstr
                    temp += "<td class='width_507 text-align-left'>" + tireTempbtn + tireTempstr + "</td>";
                } else {
                    if (TempMonitor.length > 0) {
                        var mFTemphtml = "";
                        for (var j = 0; j < TempMonitor.length; j++) {
                            if (carJson.mFObjectID == TempMonitor[j].mFObjectID) {
                                mFTemphtml += '<div>' + TempMonitor[j].mFSensorSeq + ":" + __tr("Temperature") + ":" + TempMonitor[j].mFTemp + "℃";
                                if (TempMonitor[j].mFMoisture != "") {
                                    mFTemphtml += "," + __tr("Humidity") + ":" + TempMonitor[j].mFMoisture;
                                }
                                if (TempMonitor[j].mFMoisture != "") {
                                    mFTemphtml += "," + __tr("Voltage") + +TempMonitor[j].mFVoltage + "V";
                                }
                                var mFLastUpdateTime = TransDate(TempMonitor[j].mFTrackTime);
                                mFTemphtml += ',' + __tr('Last update time') + ':' + new Date(mFLastUpdateTime).pattern('MM-dd HH:mm') + ';';
                                mFTemphtml += '</div>';
                            }
                        }
                        temp += "<td class='width_507 text-align-left' title=" + removeBlank(removeHTMLTag(mFTemphtml.substr(0, mFTemphtml.length))) + ">" + mFTemphtml.substr(0, mFTemphtml.length) + "</td>";

                    } else {
                        temp += "<td class='width_507'>-</td>";
                    }
                }
                //if (statusstr.length > 15) {
                //    temp += "<td class='width_85' title='" + statusstr + "'>" + statusstr.substr(0, 5) + "</td>";
                //} else {
                //    temp += "<td class='width_85' title='" + statusstr + "'>-</td>";
                //}
                carJson.Status = statusstr;
                temp += "<td class='width_136'><a href='javascript:void(0)' onclick=\"addTab('" + __tr("Vehicle information") + "','/JVMD/VehicleEdit/Index/" + carJson.mFObjectID + "?type=view')\">" + __tr("Click to view") + "</a></td>";
                //判断是否符合其他规则
                if (carJson.mFStatus == "10") {
                    //运行
                    var items = $("#onlineCarTable").children("." + carJson.S3);
                    if (items.length > 0) {
                        items.eq(0).html(temp);
                    } else {
                        $("#onlineCarTable").append("<tr role=\"row\" class='" + trClass + " " + carJson.S3 + "' S3='" + carJson.S3 + "'>" + temp + "</tr>");
                    }
                } else if (carJson.mFStatus == "30") {
                    //停车
                    var items = $("#stopCarTable").children("." + carJson.S3);
                    if (items.length > 0) {
                        items.eq(0).html(temp);
                    } else {
                        $("#stopCarTable").append("<tr role=\"row\" class='" + trClass + " " + carJson.S3 + "' S3='" + carJson.S3 + "'>" + temp + "</tr>");
                    }
                } else if (carJson.mFStatus == "20") {
                    //报警
                    var items = $("#warningCarTable").children("." + carJson.S3);
                    if (items.length > 0) {
                        items.eq(0).html(temp);
                    } else {
                        $("#warningCarTable").append("<tr role=\"row\" class='" + trClass + " " + carJson.S3 + "' S3='" + carJson.S3 + "'>" + temp + "</tr>");
                    }
                } else if (carJson.mFStatus == "40") {
                    //离线
                    var items = $("#offlineCarTable").children("." + carJson.S3);
                    if (items.length > 0) {
                        items.eq(0).html(temp);
                    } else {
                        $("#offlineCarTable").append("<tr role=\"row\" class='" + trClass + " " + carJson.S3 + "' S3='" + carJson.S3 + "'>" + temp + "</tr>");
                    }
                }
                var items = $("#AllCarTable").children("." + carJson.S3);
                if (items.length > 0) {
                    items.eq(0).html(temp);
                } else {
                    $("#AllCarTable").append("<tr role=\"row\" class='" + trClass + " " + carJson.S3 + "' TID=" + carJson.TID + " S3='" + carJson.S3 + "'>" + temp + "</tr>");
                }

                $(".trackChk").unbind("click").click(function () {
                    if ($(this).is(":checked")) {
                        trackIds.push($(this).attr("S3"));
                    } else {
                        for (var i = 0; i < trackIds.length; i++) {
                            if (trackIds[i] == $(this).attr("S3")) {
                                trackIds.splice(i, 1);
                            }
                        }
                    }
                });
                AddMarkerToMap(GetMapObj().GetPosition(carJson.S7, carJson.S8), carJson, carJson.SB, carJson.mFVehicleLicense, TempMonitor, tireMonitor);
                UpdateTableNumber();
                var checkallLength = $("#AllCarTable").find("tr").length;
                var checkonLength = $("#onlineCarTable").find("tr").length;
                var checkoffLength = $("#offlineCarTable").find("tr").length;
                var checkwarnLength = $("#warningCarTable").find("tr").length;
                var checkstopLength = $("#stopCarTable").find("tr").length;
                if (checkallLength <= 5) {
                    $("#AllCarTable").find("tr").attr("style", "width:calc( 100% - 1.2em )");
                    //                                                 
                } else {
                    $("#AllCarTable").find("tr").attr("style", "width:100%");
                    //                    $("#stopCarTable").find("tr").attr("style", "width:100%");                             
                }
                if (checkonLength <= 5) {
                    $("#onlineCarTable").find("tr").attr("style", "width:calc( 100% - 1.2em )");
                } else {
                    $("#onlineCarTable").find("tr").attr("style", "width:100%");
                }
                if (checkoffLength <= 5) {
                    $("#offlineCarTable").find("tr").attr("style", "width:calc( 100% - 1.2em )");
                } else {
                    $("#offlineCarTable").find("tr").attr("style", "width:100% ");
                }
                if (checkwarnLength <= 5) {
                    $("#warningCarTable").find("tr").attr("style", "width:calc( 100% - 1.2em )");
                } else {
                    $("#warningCarTable").find("tr").attr("style", "width:100%");
                }
                if (checkstopLength <= 4) {
                    $("#stopCarTable").find("tr").attr("style", "width:calc( 100% - 1.2em )");
                } else {
                    $("#stopCarTable").find("tr").attr("style", "width:100%");
                }
            });
        }

    }

    function removeEmptyTr(id) {
        $(id).find("tr").each(function () {
            if ($(this).html() == "") {
                $(this).remove();
            }
        });
    }

    function UpdateTableNumber() {
        removeEmptyTr("#AllCarTable");
        removeEmptyTr("#offlineCarTable");
        removeEmptyTr("#warningCarTable");
        removeEmptyTr("#stopCarTable");
        removeEmptyTr("#onlineCarTable");
        $("#allcars .number").html($("#AllCarTable").find("tr").length);
        $("#offlinecars .number").html($("#offlineCarTable").find("tr").length);
        $("#warningcars .number").html($("#warningCarTable").find("tr").length);
        $("#stopcars .number").html($("#stopCarTable").find("tr").length);
        $("#onlinecars .number").html($("#onlineCarTable").find("tr").length);
        //if (ShowCarCount == 1)
        //    SetMapView();
    }

    //function GetStatuStr(obj) {
    //    switch (obj.BT) {
    //        case "BIT0":
    //            return obj.V == "1" ? __tr("ACC ON") : __tr("ACC OFF");
    //        case "BIT1":
    //            return obj.V == "1" ? __tr("Engine ON") : __tr("Engine OFF");
    //        case "BIT2":
    //            return obj.V == "1" ? __tr("Brake") : __tr("not braking");
    //        //case "BIT3":
    //        //    return obj.V == "1" ? __tr("Universal port 1 ON") : __tr("Universal port 1 OFF");
    //        //case "BIT4":
    //        //    return obj.V == "1" ? __tr("Universal port 2 ON") : __tr("Universal port 2 OFF");
    //        case "BIT5":
    //            return obj.V == "1" ? __tr("AC ON") : __tr("AC OFF");
    //        case "BIT6":
    //            return obj.V == "1" ? __tr("Door Open") : __tr("Door Close");
    //        case "BIT7":
    //            return obj.V == "1" ? __tr("High reservation: signal available") : __tr("High reservation: no signal");
    //        case "BIT8":
    //            return obj.V == "1" ? __tr("battery status: back up battery") : __tr("Battery status: Main power");
    //        case "BIT9":
    //            return obj.V == "1" ? __tr("Fuel cut off:  cut off") : __tr("Fuel cut off:  Normal");
    //        case "BIT10":
    //            return obj.V == "1" ? __tr("SOS: SOS on") : __tr("SOS: Normal");
    //        case "BIT11":
    //            return obj.V == "1" ? __tr("GPS antennat open circuit: Open circuit") : __tr("GPS antennat open circuit: Normal");
    //        case "BIT12":
    //            return obj.V == "1" ? __tr("GPS antenna short circuit: short circuit") : __tr("GPS antenna short circuit: Normal");
    //        case "BIT13":
    //            return obj.V == "1" ? __tr("Over speed: over speed") : __tr("Over speed: Normal");
    //        case "BIT14":
    //            return obj.V == "1" ? __tr("Universal IO port 1 status:  high") : __tr("Universal IO port 1 status:  low");
    //        case "BIT15":
    //            return obj.V == "1" ? __tr("Universal IO port 2 status:  high") : __tr("Universal IO port 2 status:  low");
    //        case "BIT16":
    //            return obj.V == "1" ? __tr("Flash:  IC normal") : __tr("Flash:  abnormal");
    //        case "BIT17":
    //            return obj.V == "1" ? __tr("FRAM: IC normal") : __tr("FRAM: IC abnormal");
    //        case "BIT18":
    //            return obj.V == "1" ? __tr("FRAM: IC normal") : __tr("FRAM: IC abnormal");
    //        default:
    //            return "";
    //    }
    //}

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



    function ClearCheckCarTable() {
        $("#AllCarTable").html("");
        $("#onlineCarTable").html("");
        $("#stopCarTable").html("");
        $("#warningCarTable").html("");
        $("#offlineCarTable").html("");
        $("#allcars").children(".number").html("0");
        $("#onlinecars").children(".number").html("0");
        $("#stopcars").children(".number").html("0");
        $("#warningcars").children(".number").html("0");
        $("#offlinecars").children(".number").html("0");
    }

    getBubbleJson();
    var bubbleJson;
    function getBubbleJson() {
        $.post("/JSBDDialog/BubbleViewConfigDialog/doQuery", {}, function (data) {
            bubbleJson = $.parseJSON(data);
        });
    }

    //即时弹出气泡事件
    function QueryMonitorByVehicleIDs(VehicleIDs, isClearCar) {
        BingBtnClick();
        $.post("/MTM/Monitor/doQuery", { mSlaveList: VehicleIDs, FRelation: "1" }, function (data) {
            closeloading();
            if (isClearCar) {
                ClearCarInfo();
                ClearCheckCarTable();
            }
            var json = $.parseJSON(data);
            //GPS坐标纠偏
            if (map == "baidu") {
                for (var x = 0; x < json.mObject.length; x++) {
                    if (json.mObject[x].S8 >= 1 && json.mObject[x].S7 >= 1) {
                        var fixedlatlng = fixGPSPoint(parseFloat(json.mObject[x].S8), parseFloat(json.mObject[x].S7))
                        json.mObject[x].S8 = fixedlatlng.lat;
                        json.mObject[x].S7 = fixedlatlng.lon;
                    }
                }
            }

            var tempMonitor = $.parseJSON(json.mObject_1);
            var FuelBox = $.parseJSON(json.mObject_2);
            var tireMonitor = $.parseJSON(json.mObject_3);
            //alert(json.mObject_2);
            for (var i = 0; i < json.mObject.length; i++) {
                var _monitor = json.mObject[i];
                if (_monitor.E4T != "" && _monitor.E4T != undefined)
                    for (var j = 0; j < FuelBox.length; j++) {
                        if (_monitor.mFObjectID == FuelBox[j].mFVehicleID) {
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
            //查询状态数据
            if (json.Result == "200") {
                Temp_Num = 0;
                for (var i = 0; i < json.mObject.length; i++) {
                    if (i == 0 && json.mObject.length == 1) {
                        if (json.mObject[i].S7 < 1 || json.mObject[i].S8 < 1)
                            break;
                        if (i == 0)
                            setMapCenterAndZoom(json.mObject[0].S7, json.mObject[0].S8);
                        var a = GetCarImgUrl(json.SB, json);
                        var direct = a.split("/")[3].split("_")[1].split(".")[0];
                        $("#infoBox").remove();
                        var temp1 = "";
                        temp1 += "<div id='infoBox'><div id='header'><img src='../image/truck.png'>" + json.mObject[0].mFVehicleLicense + "(" + json.mObject[0].S3 + ")<span style='position:absolute;right:5px;top:-1px;cursor:pointer'>x</span></div><div class='infoBox'><table><tr><td> " + __tr("terminal type") + " :</td><td>" + json.mObject[0].S4N + "</td><tr><td>" + __tr("Last update time") + "：</td><td>" + TransDate(json.mObject[0].S6) + "</td></tr>" +
                            "<tr><td>" + __tr("mileage") + "：</td><td>" + json.mObject[0].SC + "km</td></tr><tr><td>" + __tr("speed") + "：</td><td>" + json.mObject[0].SA + "km/h</td></tr><tr><td> " + __tr("direction") + ":</td><td>" + __tr(direct) + "</td></tr>";


                        //取出该产品类别的对应状态
                        var bubble_obj = bubbleJson.mObject;
                        //alert(json.mObject[i].S4ID + "," + obj[0].mFProdTypeID)
                        if (json.mObject[i].E1T != "") {
                            var statusJson = $.parseJSON(json.mObject[i].E1T);
                            for (var j = 0; j < bubble_obj.length; j++) {
                                if (json.mObject[i].S4ID == bubble_obj[j].mFProdTypeID) {
                                    //如果是油量状态的单独运算
                                    if (bubble_obj[j].mFField == 'Fuel_Value') {
                                        temp1 += "<tr><td>" + __tr("VV") + "：</td>";
                                        temp1 += "<td>" + parseFloat($.parseJSON(json.mObject[i].E4T)[0].VV).toFixed(2) + "</td></tr>";
                                    } else {
                                        //非油量的状态直接循环                                     
                                        $.each(statusJson, function (sindex, status_obj) {
                                            if (bubble_obj[j].mFField == status_obj.K) {
                                                temp1 += "<tr><td>" + __tr(bubble_obj[j].mFField) + "：</td>";
                                                temp1 += "<td>" + GetStatuStrB(status_obj) + "</td></tr>";
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        //取出对应温度的状态
                        $.each(tempMonitor, function (sindex, temp_obj) {
                            if (json.mObject[i].mFObjectID == temp_obj.mFObjectID) {
                                temp1 += "<tr><td>" + temp_obj.mFSensorSeq + "：</td>";
                                temp1 += "<td>" + temp_obj.mFTemp + "℃</td></tr>";
                                // temp1 += "<td>" + obj.mFTemp + "℃/" + obj.mFMoisture + "RH%/" + obj.mFVoltage + "V</td></tr>"; //此处是带温度/湿度/电压状态
                            }
                        });


                        //取出对应胎压值
                        $.each(tireMonitor, function (sindex, tire_obj) {
                            if (json.mObject[i].mFObjectID == tire_obj.mFObjectID) {
                                var tyreContent = $.parseJSON(tire_obj.mFTyreContent);
                                //根据轮胎顺序排序
                                tyreContent.sort(function (a, b) {
                                    return a.TID - b.TID
                                });

                                var tyrecount = 0;//暂时只获取六个
                                $.each(tyreContent, function (sindex, tyre_obj) {
                                    if (tyrecount < 6) {
                                        temp1 += "<tr><td>" + __tr("tyre") + (tyre_obj.TID) + "：</td>";
                                        var tempStat = tyre_obj.Stat.split(",");
                                        if (tempStat[1] == "P Normal")
                                            temp1 += "<td>" + tyre_obj.P + " bar</td></tr>";
                                        else
                                            temp1 += "<td>" + tyre_obj.P + " bar &nbsp;&nbsp;" + __tr(tempStat[1]) + "</td></tr>";
                                    }
                                    tyrecount++;
                                });
                            }
                        });

                        temp1 += "</table></div>";
                        temp1 += '<div id="tools" style="width:100%;background:#F1F1F1;padding:2px;height:30px;" lng=' + json.S7 + ' lat=' + json.S8 + '>';
                        temp1 += '<div style="padding:2px;" class="InfoWindow_btn location cursor-p" title="' + __tr("Location") + '"><i></i></div>';
                        temp1 += '<div style="padding:2px;" class="InfoWindow_btn monitor cursor-p" title="' + __tr("Monitor") + '" mfid="' + json.mFObjectID + '" mfVehicle="' + json.mFVehicleLicense + '"><i></i></div>';
                        temp1 += '<div onclick=\'addTab("' + __tr('Vehicle information') + '","/JVMD/VehicleEdit/Index/' + json.mObject[0].mFObjectID + '?type=view")\' style="padding:2px;" class="InfoWindow_btn carinformation cursor-p" title="' + __tr("CarInfo") + '"><i></i></div>';
                        temp1 += '<div style="padding:2px;" class="InfoWindow_btn road cursor-p" title="' + __tr("View road conditions") + '"><i></i></div>';
                        temp1 += '<div style="padding:2px;" class="InfoWindow_btn navigation cursor-p" title="' + __tr("Navigation") + '"><i></i></div>';
                        temp1 += "</div></div>";
                        $("html").append(temp1);

                    }
                    timer1 = setTimeout(function () {
                        $("#infoBox").remove();
                    }, 3000);
                    ShowCheckCars(i,json.mObject[i], tempMonitor, tireMonitor);
                }
            } else {
                showMsg($, json.Message);
            }
        });
    }

    function BindOpenCloseClick() {
        $(".closeTree").unbind("click").click(function () {
            $(this).removeClass("closeTree");
            $(this).addClass("openTree");
            $(this).parent().parent().parent().children("ul").addClass("hide");
            BindOpenCloseClick();
        });

        $(".openTree").unbind("click").click(function () {
            $(this).removeClass("openTree");
            $(this).addClass("closeTree");
            $(this).parent().parent().parent().children("ul").removeClass("hide");
            BindOpenCloseClick();
        });
    }

    function stoper() {
        clearTimeout(timer1);
    }

    //车辆列表点击
    function BindTableClick(carJson) {
        $(".VehicleItem").click(function (e) {
            stoper();
            $("#infoBox").remove();
            var VehicleItem = $(this).parent();
            var checkbox = $(this).parent().find(".jkcheckbox");
            if (checkbox.is(":checked") === false) {
                checkbox.click();
            } else {
                QueryMonitorByVehicleIDs(VehicleItem.attr("mfid"), false);
            }
        });

        $(".jkcheckbox").click(function () {

            var VehicleItem = $(this).parent().parent().parent();
            var checkbox = $(this);
            if (checkbox.is(":checked")) {
                $(".trackInfo_open ").click();
                DragTableFunc();
                checkCars.push(VehicleItem.attr("mfid"));
                // alert("1," + VehicleItem.attr("mfid").length);
                QueryMonitorByVehicleIDs(VehicleItem.attr("mfid"), false);
            } else {
                //移除
                var proid = $(this).attr("ProdID");
                var tid = $("#AllCarTable").find("." + proid).attr("TID");
                // alert(markers.length)
                //移除车辆marker
                for (var i = 0; i < markers.length; i++) {
                    var markerjson = $.parseJSON(markers[i].json);
                    if (markerjson.TID == tid) {
                        //    alert(markerjson.S7 + "," + markerjson.S8);
                        GetMapObj().removeOverlay(markers[i]);
                        markers.splice(i, 1);
                    }
                }
                //移除选中车
                for (var j = 0; j < checkCars.length; j++) {
                    if (checkCars[j] == VehicleItem.attr("mfid")) {
                        checkCars.splice(j, 1);
                    }
                }

                //移除表格数据
                $("#AllCarTable").find("." + proid).remove();
                $("#onlineCarTable").find("." + proid).remove();
                $("#stopCarTable").find("." + proid).remove();
                $("#warningCarTable").find("." + proid).remove();
                $("#offlineCarTable").find("." + proid).remove();
                UpdateTableNumber();
            }
        });

        $(".checkChildren").click(function () {

            var Vehiclelist = $(this).parent().parent().next().find(":checkbox");
            if ($(this).is(":checked")) {
                //var Vehiclelist = $(".jkcheckbox");
                var VehicleIDs = "";
                for (var i = 0; i < Vehiclelist.length; i++) {

                    if (!Vehiclelist.eq(i).is(":checked")) {
                        if (typeof Vehiclelist.eq(i).parent().parent().parent().attr("mfid") != "undefined") {
                            VehicleIDs += Vehiclelist.eq(i).parent().parent().parent().attr("mfid") + "|";
                            checkCars.push(Vehiclelist.eq(i).parent().parent().parent().attr("mfid"));
                        }
                    }
                    Vehiclelist.eq(i).prop("checked", true);
                }
                //                Vehiclelist.each(function () {
                //                    if (!$(this).is(":checked")) {
                //                        
                //                        if (typeof $(this).parent().parent().parent().attr("mfid") != "undefined") {
                //                            VehicleIDs += $(this).parent().parent().parent().attr("mfid") + "|";
                //
                //                            checkCars.push($(this).parent().parent().parent().attr("mfid"));
                //                        }
                //                        $(this).prop("checked", true);
                //                    }
                //                });
                VehicleIDs = VehicleIDs.substr(0, VehicleIDs.length - 1);
                if (VehicleIDs != "") {
                    QueryMonitorByVehicleIDs(VehicleIDs, true);
                    //     alert(VehicleIDs)
                    openloading();
                    $(".trackInfo_open ").click();
                    DragTableFunc();

                }
            } else {
                //var Vehiclelist = $(this).children(".jkcheckbox");
                Vehiclelist.each(function () {

                    $(this).attr("checked", false);
                    var mfid = $(this).parent().parent().parent().attr("mfid");
                    var proid = $(this).attr("ProdID");
                    //var tid = $("#AllCarTable").find("." + proid).attr("TID");
                    for (var i = 0; i < markers.length; i++) {
                        if (markers[i].id == mfid) {
                            GetMapObj().removeOverlay(markers[i]);
                            markers.splice(i, 1);
                        }
                    }

                    for (var j = 0; j < checkCars.length; j++) {
                        if (checkCars[j] == mfid) {
                            checkCars.splice(j, 1);
                        }
                    }

                    $("#AllCarTable").find("." + proid).remove();
                    $("#onlineCarTable").find("." + proid).remove();
                    $("#stopCarTable").find("." + proid).remove();
                    $("#warningCarTable").find("." + proid).remove();
                    $("#offlineCarTable").find("." + proid).remove();
                    UpdateTableNumber();

                });

            }
        });
        $(".jcheckbox").next().click(function () {
            $(this).prev(".jcheckbox").children(".checkChildren").click();
        });
    }

    //设置地图可视区域
    function SetMapView() {
        var mappoints = [];
        for (var i = 0; i < markers.length; i++) {
            var markerjson = $.parseJSON(markers[i].json);
            var point = GetMapObj().GetPosition(markerjson.S7, markerjson.S8);
            mappoints.push(point);
        }
        GetMapObj().SetViewport(mappoints);

    }


    //车辆marker添加至地图
    function AddMarkerToMap(point, json, direction, label, tempMonitor, tireMonitor) {
        //获取marker
        var marker = GetMapObj().GetMarker();
        //转换icon
        var Iconurl = GetCarImgUrl(direction, json);
        var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(25, 25), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
        DeleteMarkerById(json.mFObjectID);
        if (checkCars.indexOf(json.mFObjectID) > -1) {
            marker = GetMapObj().SetInLabel(marker, icon, point, label, json, objShow, tempMonitor, tireMonitor);
            markers.push(marker);
        }
    }

    //车辆状态点击事件
    $("#allcars").click(function () {
        //全部
    });

    $("#onlinecars").click(function () {
        //运行
    });
    $("#warningcars").click(function () {
        //报警
    });
    $("#stopcars").click(function () {
        //停车
    });
    $("#offlinecars").click(function () {
        //离线
    });

    $("#monitorMode").click(function () {
        //  alert(mappoints.length);
        SetMapView();
    });

    //车辆查询
    $("#searchCarsInput").keyup(function () {
        var searchValue = $(this).val();
        var lilist = $("#MonitorList").find("li");
        var Motorcadelilist = $("#MonitorList").find("li[name='li_carSum']");
        //车牌号查询
        if (searchValue == "") {
            lilist.show();
        } else {
            lilist.hide();
            lilist.each(function (index, obj) {
                var name = $(this).children("div").children(".VehicleItem").children("em").html();
                if (name != undefined && name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    $(this).show();
                    $(this).parents("li").show();
                    //console.info(name);
                }
            });
        }
        //车队查询
        if (searchValue == "") {
            lilist.show();
        } else {
            //lilist.hide();
            Motorcadelilist.each(function (index, obj) {
                var MotorcadeName = removeHTMLTag($(this).find(".treeli").find("em").html());
                if (MotorcadeName != undefined && MotorcadeName.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    $(this).show();
                    $(this).parents("li").show();
                    $(this).find("ul").show();
                    $(this).find("ul").children("li").show();
                    //console.info(MotorcadeName);
                }
            });
        }

    });
    //03.21
    var CarNum = 0;
    var CarArr = [];
    //↑↓键选择车辆
    MarkCar();
    function MarkCar() {
        $(document).on("keydown", function (ev) {
            $("#MonitorList").focus();
            var e = ev || event;
            var KeyCode = e.keyCode;
            switch (KeyCode) {
                case 40:
                    PressDown(CarNum);
                    CarNum++;
                    break;
                case 38:
                    CarNum--;
                    //console.log(CarNum);
                    if (CarNum <= 1) {
                        CarNum = 1;
                    }
                    PressUp(CarNum);
                    break;
                case 13:
                    SelectCar();
            };
        });
    }
    InitCarArr();
    function InitCarArr() {
        $("#searchCarsInput").change(function () {
            for (var i = 0; i < CarArr.length; i++) {
                CarArr[i].removeClass("whitebg");
            }
            CarArr = [];
            CarNum = 0;
        });
    }
    function SelectCar() {
        var lilist = $("#MonitorList").find("li");
        lilist.each(function () {
            if ($(this).hasClass("whitebg")) {
                var VehicleItem = $(this).children(".treeli");
                var checkbox = $(this).find(".jkcheckbox");
                if (checkbox.is(":checked")) {
                    checkbox.click();
                    $("#AllCarTable").find("." + VehicleItem.attr("ProdID")).children().eq(1).click();
                    for (var i = 0; i < markers.length; i++) {
                        var markerjson = $.parseJSON(markers[i].json);
                        if (parentId == markerjson.mFObjectID) {
                            setMapCenterAndZoom(markerjson.S7-0.001, markerjson.S8-0.001);
                        }
                    }
                } else {
                    checkbox.click();
                }
            }
        });
    }

    function CreateCarArr(n) {
        CarArr = [];
        var searchValue = $("#searchCarsInput").val();
        var lilist = $("#MonitorList").find("li");
        lilist.each(function (index, obj) {
            var name = $(this).children("div").children(".VehicleItem").children("em").html();
            if (name != undefined && name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                CarArr.push($(this));
            }
        });
    }

    function PressDown(n) {
        CreateCarArr();
        var divlist = $("#MonitorList").find("li").children("div").children(".VehicleItem").parent("div");
        for (var i = 0; i < CarArr.length; i++) {
            CarArr[i].removeClass("whitebg");
        }
        if (n > CarArr.length) {
            return false;
        } else {
            CarArr[n].addClass("whitebg");
        }
        //console.log(CarNum);
        //console.log(CarArr);
    }
    function PressUp(n) {
        CreateCarArr();
        var divlist = $("#MonitorList").find("li").children("div").children(".VehicleItem").parent("div");
        for (var i = 0; i < CarArr.length; i++) {
            CarArr[i].removeClass("whitebg");
        }
        if (n < 0) {
            return false;
        } else {
            CarArr[n - 1].addClass("whitebg");
        }
        //console.log(CarNum);

    }
    //03.21

    function removeHTMLTag(str) {
        return str = str.replace(/<\/?[^>]*>/g, "");
    }
    //正则去空格
    function removeBlank(str) {
        return str = str.replace(/\s/g, "&nbsp;");
    }


    //删除指定id的marker
    function DeleteMarkerById(id) {

        for (var j = 0; j < markers.length; j++) {
            if (markers[j].id == id) {
                GetMapObj().removeOverlay(markers[j]);
            }
        }
    }

    //点击车辆的marker气泡
    var objShow = function ShowCarInfo(e) {
        var json = $.parseJSON(this.json);
        var tempMonitor = $.parseJSON(this.tempMonitor);
        var tireMonitor = $.parseJSON(this.tireMonitor);
        var sContent = "<div id=\"header\" style='font-size:18px;'><img src='../image/truck.png'>" + json.mFVehicleLicense + "(" + json.S3 + ")</div><div style='overflow:auto;height:150px;padding:5px;width:350px;'>";
        var CarMarker = this;
        sContent += "<div style='width:113px;text-align:right;float:left;'><b>" + __tr("terminal type") + "：</b></div>" + json.S4N + "</br>";
        //        sContent += "<div style='width:113px;text-align:right;float:left;'><b>" + __tr("terminal NO") + "：</b></div>" + json.S3 + "</br>";
        sContent += "<div style='width:113px;text-align:right;float:left;'><b>" + __tr("Last update time") + "：</b></div>" + TransDate(json.S6) + "</br>";
        sContent += "<div style='width:113px;text-align:right;float:left;'><b>" + __tr("mileage") + "：</b></div>" + json.SC + "km</br>";
        sContent += "<div style='width:113px;text-align:right;float:left;'><b>" + __tr("speed") + "：</b></div>" + json.SA + "km/h</br>";
        var a = GetCarImgUrl(json.SB, json);
        var direct = a.split("/")[3].split("_")[1].split(".")[0];
        sContent += "<div style='width:113px;text-align:right;float:left;'><b>" + __tr("direction") + "：</b></div>" + __tr(direct) + "</br>";
        //        sContent += "<div style='width:113px;text-align:right;float:left;'><b>温度：</b></div>" + json.TempMonitor[0].mFSensorSeq + "</br>";

        if (json.E1T != "") {
            var bubble_obj = bubbleJson.mObject;
            var statusJson = $.parseJSON(json.E1T);
            for (var j = 0; j < bubble_obj.length; j++) {
                if (json.S4ID == bubble_obj[j].mFProdTypeID) {
                    //如果是油量状态的单独运算
                    if (bubble_obj[j].mFField == 'Fuel_Value') {
                        sContent += "<div style='width:100%;height:18px;'><div style='width:113px;float:left;'>" + __tr("VV") + ":</div><span style='float:left;'>" + parseFloat($.parseJSON(json.E4T)[0].VV).toFixed(2) + "</span></div>";
                    } else {
                        //非油量的状态直接循环
                        $.each(statusJson, function (sindex, status_obj) {
                            if (bubble_obj[j].mFField == status_obj.K) {
                                sContent += "<div style='width:100%;height:18px;'><div style='width:113px;float:left;'>" + __tr(status_obj.K) + ":</div><span style='float:left;'>" + GetStatuStrB(status_obj) + "</span></div>";
                            }
                        });
                    }
                }
            }
        }

        //取出对应温度的状态
        $.each(tempMonitor, function (sindex, temp_obj) {
            if (json.mFObjectID == temp_obj.mFObjectID) {
                sContent += "<div style='width:100%;height:18px;'><div style='width:113px;float:left;'>" + temp_obj.mFSensorSeq + ":</div><span style='float:left;'>" + temp_obj.mFTemp + "℃</span></div>";
                // temp1 += "<td>" + obj.mFTemp + "℃/" + obj.mFMoisture + "RH%/" + obj.mFVoltage + "V</td></tr>"; //此处是带温度/湿度/电压状态
            }
        });


        //取出对应胎压值
        $.each(tireMonitor, function (sindex, tire_obj) {
            if (json.mFObjectID == tire_obj.mFObjectID) {
                var tyreContent = $.parseJSON(tire_obj.mFTyreContent);
                //根据轮胎顺序排序
                tyreContent.sort(function (a, b) {
                    return a.TID - b.TID
                });
                var tyrecount = 0;//暂时只获取六个
                $.each(tyreContent, function (sindex, tyre_obj) {
                    if (tyrecount < 6) {
                        var tempStat = tyre_obj.Stat.split(",");
                        if (tempStat[1] == "P Normal") {
                            sContent += "<div style='width:100%;height:18px;'><div style='width:113px;float:left;'>" + __tr("tyre") + (tyre_obj.TID) + ":</div><span style='float:left;'>" + tyre_obj.P + " bar</span></div>";
                        }
                        else {
                            sContent += "<div style='width:100%;height:18px;'><div style='width:113px;float:left;'>" + __tr("tyre") + (tyre_obj.TID) + ":</div><span style='float:left;'>" + tyre_obj.P + " bar &nbsp;&nbsp;" + __tr(tempStat[1]) + " </span></div>";
                        }
                    }
                    tyrecount++
                });

            }
        });


        sContent += "<div style='width:113px;height36px;text-align:right;float:left;' id='ad_" + json.mFObjectID + "'><b style='display:inline-block;height:36px;'>" + __tr("Loaction") + "：</b></div><span style=';overflow:hidden;text-overflow:ellipsis;width:210px'></span> </br>";
        sContent += "</div>";
        sContent += '<div id="tools" style="width:100%;background:#F1F1F1;padding:2px;height:30px;" lng=' + json.S7 + ' lat=' + json.S8 + '>';
        sContent += '<div style="padding:2px;" class="InfoWindow_btn location cursor-p" title="' + __tr("Location") + '"><i></i></div>';
        sContent += '<div style="padding:2px;" class="InfoWindow_btn monitor cursor-p" title="' + __tr("Monitor") + '" mfid="' + json.mFObjectID + '" mfVehicle="' + json.mFVehicleLicense + '"><i></i></div>';
        sContent += '<div onclick=\'addTab("' + __tr('Vehicle information') + '","/JVMD/VehicleEdit/Index/' + json.mFObjectID + '?type=view")\' style="padding:2px;" class="InfoWindow_btn carinformation cursor-p" title="' + __tr("CarInfo") + '"><i></i></div>';
        sContent += '<div style="padding:2px;" class="InfoWindow_btn road cursor-p" title="' + __tr("View road conditions") + '"><i></i></div>';
        sContent += '<div style="padding:2px;" class="InfoWindow_btn navigation cursor-p" title="' + __tr("Navigation") + '"><i></i></div>';
        sContent += '</div>';

        GetMapObj().OpenMarkerInfoWindow(sContent, CarMarker);
        setTimeout(BingBtnClick, 100);

        //地址转换
        tranPostion(json);
    }


    function tranPostion(json) {
        var point1 = GetMapObj().GetPosition(json.S7, json.S8);
        var geoc = GetMapObj().GetClientGeocoder();
        GetMapObj().Geoco_GetLocation(geoc, point1, function (add_json) {
            var address3 = add_json.addressComponents.province + "/" + add_json.addressComponents.city + "/" + add_json.addressComponents.district;
            var address4 = add_json.addressComponents.street;

            var addre = address3 + '/' + address4;
            window.setTimeout(function () {
                $("#ad_" + json.mFObjectID).next().append(addre)
            }, 200)
            ;
        });
    }


    function BingBtnClick() {
        $(".addsifang").unbind("click").click(function () {
            var lat = Number($(this).parent().attr("lat"));
            var lng = Number($(this).parent().attr("lng"));
            var pointflot = Number("0.002");

            var temp = "";
            var points = [];
            temp += lng - pointflot + "," + lat - pointflot + "|";
            var point0 = GetMapObj().GetPosition(lng - pointflot, lat - pointflot);
            points.push(point0);

            temp += lng - pointflot + "," + lat + pointflot + "|";
            var point1 = GetMapObj().GetPosition(lng - pointflot, lat + pointflot);
            points.push(point1);

            temp += lng + pointflot + "," + lat + pointflot + "|";
            var point2 = GetMapObj().GetPosition(lng + pointflot, lat + pointflot);
            points.push(point2);

            temp += lng + pointflot + "," + lat - pointflot + "|";
            var point3 = GetMapObj().GetPosition(lng + pointflot, lat - pointflot);
            points.push(point3);

            $("#mFCoordinateFence").val(temp);
            var polygon = GetMapObj().createArea(points, styleOptions);
            GetMapObj().addOverlay(polygon);
            overlays.push(polygon);
            SaveAreaDialog();
        });

        $(".addpoint").unbind("click").click(function () {
            var lat = $(this).parent().attr("lat");
            var lng = $(this).parent().attr("lng");

            var point = GetMapObj().GetPosition(lng, lat);
            //  var circle = GetMapObj().SetInOverlayByCircle(point, styleOptions);; //创建圆
            var circle = GetMapObj().createCircle(point, 200, styleOptions);
            GetMapObj().addOverlay(circle);
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
        $(document).on("click", ".road", function () {
            $("#Traffic").click();
        });
        $(".navigation").unbind("click").click(function () {
            $("#navigation").click();
        });
        $(document).on("click", ".navigation", function () {
            $("#navigation").click();
        });
        $(".monitor").unbind("click").click(function () {
            //alert(__tr("Jump history"));
            var varID = $(this).attr("mfid");
            var mfVehicle = $(this).attr("mfVehicle");
            var uri = encodeURI("?mfid=" + varID + "&mfVehicle=" + mfVehicle);
            addTab(__tr("track"), "/MTM/Track/Index/" + uri);
        });

        $(".manager").unbind("click").click(function () {
            alert(__tr("Jump vehicle information page"));
        });

        $(".more").unbind("click").click(function () {
            alert(__tr("More"));
        });
    }

    //获取车辆图标
    function GetCarImgUrl(direction, json) {
        var direc = parseInt((parseInt(direction) + 22) / 45);
        //        switch (direc) {
        //            case 0:
        //                return "/assets/image/car_north.png";
        //            case 1:
        //                return "/assets/image/car_northeast.png";
        //            case 2:
        //                return "/assets/image/car_east.png";
        //            case 3:
        //                return "/assets/image/car_southeast.png";
        //            case 4:
        //                return "/assets/image/car_south.png";
        //            case 5:
        //                return "/assets/image/car_southwest.png";
        //            case 6:
        //                return "/assets/image/car_west.png";
        //            case 7:
        //                return "/assets/image/car_northwest.png";
        //            default:
        //                return "/assets/image/car_north.png";
        //        }
        switch (json.mFStatus) {
            //运行 绿色
            case "10":
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
                break;
                //怠速 (异常)红色
            case "20":
                switch (direc) {
                    case 0:
                        return "/assets/xjaddpic/redcar_north.gif";
                    case 1:
                        return "/assets/xjaddpic/redcar_northeast.gif";
                    case 2:
                        return "/assets/xjaddpic/redcar_east.gif";
                    case 3:
                        return "/assets/xjaddpic/redcar_southeast.gif";
                    case 4:
                        return "/assets/xjaddpic/redcar_south.gif";
                    case 5:
                        return "/assets/xjaddpic/redcar_southwest.gif";
                    case 6:
                        return "/assets/xjaddpic/redcar_west.gif";
                    case 7:
                        return "/assets/xjaddpic/redcar_northwest.gif";
                    default:
                        return "/assets/xjaddpic/redcar_north.gif";
                }
                break;
                //紫色 (停止) 
            case "30":
                switch (direc) {
                    case 0:
                        return "/assets/xjaddpic/purplecar_north.gif";
                    case 1:
                        return "/assets/xjaddpic/purplecar_northeast.gif";
                    case 2:
                        return "/assets/xjaddpic/purplecar_east.gif";
                    case 3:
                        return "/assets/xjaddpic/purplecar_southeast.gif";
                    case 4:
                        return "/assets/xjaddpic/purplecar_south.gif";
                    case 5:
                        return "/assets/xjaddpic/purplecar_southwest.gif";
                    case 6:
                        return "/assets/xjaddpic/purplecar_west.gif";
                    case 7:
                        return "/assets/xjaddpic/purplecar_northwest.gif";
                    default:
                        return "/assets/xjaddpic/purplecar_north.gif";
                }
                break;
                //灰色 离线
            case "40":
                switch (direc) {
                    case 0:
                        return "/assets/xjaddpic/greycar_north.gif";
                    case 1:
                        return "/assets/xjaddpic/greycar_northeast.gif";
                    case 2:
                        return "/assets/xjaddpic/greycar_east.gif";
                    case 3:
                        return "/assets/xjaddpic/greycar_southeast.gif";
                    case 4:
                        return "/assets/xjaddpic/greycar_south.gif";
                    case 5:
                        return "/assets/xjaddpic/greycar_southwest.gif";
                    case 6:
                        return "/assets/xjaddpic/greycar_west.gif";
                    case 7:
                        return "/assets/xjaddpic/greycar_northwest.gif";
                    default:
                        return "/assets/xjaddpic/greycar_north.gif";
                }
                //灰色 离线
            default:
                switch (direc) {
                    case 0:
                        return "/assets/xjaddpic/greycar_north.gif";
                    case 1:
                        return "/assets/xjaddpic/greycar_northeast.gif";
                    case 2:
                        return "/assets/xjaddpic/greycar_east.gif";
                    case 3:
                        return "/assets/xjaddpic/greycar_southeast.gif";
                    case 4:
                        return "/assets/xjaddpic/greycar_south.gif";
                    case 5:
                        return "/assets/xjaddpic/greycar_southwest.gif";
                    case 6:
                        return "/assets/xjaddpic/greycar_west.gif";
                    case 7:
                        return "/assets/xjaddpic/greycar_northwest.gif";
                    default:
                        return "/assets/xjaddpic/greycar_north.gif";
                }
        }

    }

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

    //测量 测距
    $("#DistanceTool").click(function () {
        GetMapObj().Measure();
        // var myDis = new BMapLib.DistanceTool(GetMapObj().maplet);
        // myDis.open();
    });

    //导航
    $("#navigation").click(function () {
        $("#ShowNavigationDialog").removeClass('hide').dialog({
            modal: false,
            title: __tr("Navigation"),
            title_html: true,
            width: 300,
            height: 300,
            buttons: [
                {
                    text: __tr("Navigation"),
                    "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                    click: function () {
                        // var spoint = marker_key["start"].getPosition();
                        // var epoint = marker_key["end"].getPosition();
                        GetMapObj().removeOverlay(marker_key["start"]);
                        GetMapObj().removeOverlay(marker_key["end"]);
                        //  driving.search(spoint, epoint);
                        if (map == "baidu") {
                            GetMapObj().DrivingSearch(driving, marker_key["start"], marker_key["end"]);
                        } else if (map = "google") {
                            SearchDriving(marker_key["start"], marker_key["end"]);
                        }
                        $(this).dialog("close");

                    }
                },
                {
                    text: __tr("Close"),
                    "class": "btn btn-white btn-primary btn-round  padding-lr-36 margin-l-15",
                    click: function () {
                        $(this).dialog("close");

                    }
                }
            ],
            close: ClearFindDate
        });
    });

    //起点位置选择
    $("#nMarkS").click(function () {
        if (marker_key["start"] != null) {
            GetMapObj().removeOverlay(marker_key["start"])
        }
        GetMapObj().setDefaultCursor("crosshair");
        showMsg($, "Please select the starting point on the map");
        GetMapObj().addEventListener("click", function checkmarker(e) {
            var point = GetMapObj().getPointByEvent(e);
            var marker = GetMapObj().GetMarker();
            var Iconurl = "/assets/image/p_start.png";
            var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(50, 50), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(12, 0));
            GetMapObj().setMarkerIcon(marker, icon);
            GetMapObj().setMarkerPoint(marker, point);
            GetMapObj().enableDragging(marker);
            // marker.enableDragging();
            GetMapObj().addOverlay(marker);
            // marker.addEventListener("dragend", ChangeMarkerPosition);
            GetMapObj().addMarkerClick(marker, ChangeMarkerPosition, "dragend");
            marker_key["start"] = marker;
            GetMapObj().setDefaultCursor("openhead");
            GetMapObj().removeEventListener("click", checkmarker);
        });
    });

    //终点位置选择
    $("#nMarkE").click(function () {
        if (marker_key["end"] != null) {
            GetMapObj().removeOverlay(marker_key["end"])
        }
        showMsg($, __tr("Please select end point on map"));
        GetMapObj().setDefaultCursor("crosshair");
        GetMapObj().addEventListener("click", function checkmarker(e) {
            var point = GetMapObj().getPointByEvent(e);
            var marker = GetMapObj().GetMarker();
            var Iconurl = "/assets/image/p_end.png";
            var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(50, 50), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(12, 0));
            GetMapObj().setMarkerIcon(marker, icon);
            GetMapObj().setMarkerPoint(marker, point);
            GetMapObj().enableDragging(marker);
            // marker.enableDragging();
            GetMapObj().addOverlay(marker);
            //marker.addEventListener("dragend", ChangeMarkerPosition);
            GetMapObj().addMarkerClick(marker, ChangeMarkerPosition, "dragend");
            marker_key["end"] = marker;
            GetMapObj().setDefaultCursor("openhead");
            GetMapObj().removeEventListener("click", checkmarker);
        });
    });

    checkCars = [];
    // mappoints = [];
    var marker_key = new Array();
    var showTraffic = false;
    //var ctrl = new BMapLib.TrafficControl({
    //    showPanel: true, //是否显示路况提示面板
    //    anchor: BMAP_ANCHOR_BOTTOM_RIGHT
    //});
    //GetMapObj().maplet.addControl(ctrl);

    //路况
    $("#Traffic").click(function () {
        if (showTraffic) {
            //ctrl.remove();
            //ctrl.hideTraffic();
            GetMapObj().closeTraffic();
            showTraffic = false;
            $(this).find(".ace-text").html(__tr("open road condition"));
        } else {
            //ctrl.showTraffic();
            GetMapObj().openTraffic();
            showTraffic = true;
            $(this).find(".ace-text").html(__tr("close road condition"));

        }

    });

    //04.20 map-tools收缩
    isShowMapTools();
    var isShowMapToolsOff = true;
    function isShowMapTools() {
        var wrapw = $("#maptoolabsolute").width();
        var wraph = $("#maptoolabsolute").height();
        $(".isShow-map-tools").click(function () {
            if (isShowMapToolsOff) {
                $("#maptoolabsolute").removeClass("maptoolabsolute");
                $("#maptoolabsolute").animate({ "width": 0, "height": 0 }, 200, function () {
                    $(".map-tools-wrap").css({ "display": "none" });
                    $(".isShow-map-tools").removeClass("xj-trigon-right").addClass("xj-trigon-left isShow-map-tools-change");
                    isShowMapToolsOff = false;
                });
            } else {
                $("#maptoolabsolute").animate({ "width": wrapw, "height": wraph }, 200, function () {
                    $(".map-tools-wrap").css({ "display": "block" });
                    $(".isShow-map-tools").removeClass("xj-trigon-left isShow-map-tools-change").addClass("xj-trigon-right");
                    isShowMapToolsOff = true;
                });
            }
        });
    }
    //04.20 map-tools收缩 end

    window.onresize = function () {
        if (resizeSwitch == false) {
            return
        }
        //拖拽之前的初始值
        var mapheight1 = $("#iframe", window.parent.document).attr("height");
        var h1 = mapheight1 - 79;
        var h2 = mapheight1 - 110;
        $("#container").css("height", h1);
        $(".jiankongtree").css("height", h2);


        $(".trackInfo_close").unbind().click(function () {
            $("#container").css("height", h1);
            $(".jiankongtree").css("height", h1);
            $(".tab-tableinfo").addClass("hide");
            $(".trackInfo_open").removeClass("hide");
            $(this).addClass("hide");
            //点击关闭Table后恢复默认
            recoverDefault();
        });
        $(".trackInfo_open").unbind().click(function () {
            $("#container").css("height", h1 - 169);
            $(".jiankongtree").css("height", h1 - 200);
            $(".tab-tableinfo").removeClass("hide");
            $(".trackInfo_close").removeClass("hide");
            $(this).addClass("hide");
        });
        $(".trackInfo_close").click();
    }
    //缩略图控件
    //var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
    //GetMapObj().maplet.addControl(ctrl_ove);

    //查询
    var local;
    $(".searchbtn").click(function () {
        $("#SearchList").html("");
        if (map == "baidu") {
            local = GetMapObj().GetLocalSearchObject(baidu_options);
            GetMapObj().GetSearchBykeWord(local, $("#SearchText").val());
        }
        else if (map == "google") {
            local = GetMapObj().GetLocalSearchObject();
            GetMapObj().GetSearchBykeWord(local, google_options, $("#SearchText").val());
        }

        //  local.search($("#SearchText").val());
        // local= GetMapObj().GetSearchResults($("#SearchText").val(), options);

    });

    /////////////////////谷歌查询服务回调属性 开始
    var google_options = function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var SearchResult = "";
            for (var i = 0, result; result = results[i]; i++) {
                var placeLoc = result.geometry.location;
                SearchResult += "<tr class='SearchResult' point='" + placeLoc.lat() + "," + placeLoc.lng() + "'><td class='xj-width-40'>" + (i + 1) + "</td><td class='xj-width-205'>" + result.name + "</td><td class='xj-width-345'>" + result.vicinity + "</td></tr>";
                createMarker(result);
            }

            $("#SearchResult").html(SearchResult);
            $("#SearchResult").find("tr.SearchResult").click(function () {
                var point = $(this).attr("point");
                GetMapObj().setMapCenterAndZoom(point.split(",")[1], point.split(",")[0], 15);
            });
            $("#ShowFindDialog").removeClass('hide').dialog({
                modal: false,
                title: "",
                title_html: true,
                width: 650,
                height: 400,
                close: ClearFindDate
            });
        } else {
            ClearFindDate();
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: GetMapObj().getMapObject(),
            position: placeLoc
        });
        Findoverlays.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
            GetMapObj().OpenMarkerInfoWindow(place.name, marker);
        });
    }
    /////////////////////谷歌查询服务回调属性 结束


    ////////////////////百度查询服务回调属性 开始
    var baidu_options = {
        //renderOptions: { map: map },
        pageCapacity: 100,
        onSearchComplete: function (results) {
            // 判断状态是否正确
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                //var s = "";
                var SearchResult = "";
                for (var i = 0; i < results.getCurrentNumPois() ; i++) {
                    //for (var i = 0; i < 3 ; i++) {
                    var result = results.getPoi(i);
                    //s += "<li class='SearchResult' point='" + result.point.lat + "," + result.point.lng + "'>" + result.title + "</br>" + result.province + "," + result.city + "," + "</hr></li>";
                    SearchResult += "<tr class='SearchResult' point='" + result.point.lat + "," + result.point.lng + "'><td class='xj-width-40'>" + (i + 1) + "</td><td class='xj-width-205'>" + result.title + "</td><td class='xj-width-345'>" + result.address + "</td></tr>";

                    AddFindMarker(result);
                }
                $("#SearchResult").html(SearchResult);
                $("#SearchResult").find("tr.SearchResult").click(function () {
                    var point = $(this).attr("point");
                    GetMapObj().setMapCenterAndZoom(point.split(",")[1], point.split(",")[0], 15);
                });
                $("#ShowFindDialog").removeClass('hide').dialog({
                    modal: false,
                    title: "",
                    title_html: true,
                    width: 650,
                    height: 400,
                    close: ClearFindDate
                });
            } else {
                ClearFindDate();
                //showMsg($, "没有数据。");
            }
        }
    };

    //添加查询出来的marker
    function AddFindMarker(json) {
        var marker = GetMapObj().GetMarker();
        marker.setPosition(json.point);
        marker.setLabel(GetMapObj().GetLabel(json.title));
        GetMapObj().addOverlay(marker);
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

    ///////////////百度查询服务回调属性 结束///////////////////

    //清除地图查询的marker
    function ClearFindDate() {
        CleanMapOverLays();
        for (var i = 0; i < Findoverlays.length; i++) {
            GetMapObj().removeOverlay(Findoverlays[i]);
        }
        Findoverlays.length = 0;
    }

    //找已定位的车
    $("#sCarLocationLi").click(function () {

    });

    //找自己的车
    $("#sCarOneselfLi").click(function () {
        //var pStart = new BMap.Point(116.274625, 39.961627);
        //var pEnd = new BMap.Point(116.367474, 39.988609);
        //var bs = new BMap.Bounds(pStart, pEnd);   //自己规定范围
        //local.searchInBounds("银行", bs);
    });

    //找收费站
    $("#sTollStationLi").click(function () {
        FindStr = __tr("Toll Gate");
        if (map == "google") {
            clearOverlay();
            //  FindStr = "收费站";
            GetMapObj().setDrawMode("rect", BoundsBySearch);
        } else if (map == "baidu") {
            //   FindStr = "收费站";
            drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            drawingFind.open();
        }

    });

    //找加油站
    $("#sOilLi").click(function () {

        FindStr = __tr("gas station");
        if (map == "google") {
            clearOverlay();
            //      FindStr = "加油站";
            GetMapObj().setDrawMode("rect", BoundsBySearch);
        } else if (map == "baidu") {
            //      FindStr = "加油站";
            drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            drawingFind.open();
        }
    });


    //找停车场
    $("#sParkingLi").click(function () {
        FindStr = __tr("parking lot");

        if (map == "google") {
            clearOverlay();
            //  FindStr = "停车场";
            GetMapObj().setDrawMode("rect", BoundsBySearch);
        } else if (map == "baidu") {

            //   FindStr = "停车场";
            drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            drawingFind.open();
        }

    });

    //找高速路出入口
    $("#sHighWayLi").click(function () {
        FindStr = __tr("high-speed road entrance");
        if (map == "google") {
            clearOverlay();
            //FindStr = "高速路出入口";
            GetMapObj().setDrawMode("rect", BoundsBySearch);
        } else if (map == "baidu") {
            //FindStr = "高速路出入口";
            drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            drawingFind.open();
        }

    });

    //google 选框搜索的回调
    function BoundsBySearch() {
        local = GetMapObj().GetLocalSearchObject();
        GetMapObj().GetSearchBoundsBykeWord(local, google_options, FindStr, overlays[0].bounds);
    }


    //查询关键字
    var FindStr = "";

    ///////////////////////////////////百度选框搜索 开始
    //实例化鼠标绘制工具
    var drawingFind = new BMapLib.DrawingManager(GetMapObj().maplet, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        //  setDrawingMode: {BMAP_DRAWING_RECTANGLE},
        rectangleOptions: styleOptions //矩形的样式
    });
    var Findoverlays = [];
    //实例化鼠标绘制工具
    var drawingFindcomplete = function (e) {
        if (e.drawingMode == BMAP_DRAWING_RECTANGLE) {
            //方形
            var point0 = e.overlay.getPath()[0].lng + "," + e.overlay.getPath()[0].lat;
            var point2 = e.overlay.getPath()[2].lng + "," + e.overlay.getPath()[2].lat;
            //判断对角坐标如果相同则不执行
            if (point0 != point2) {
                var pStart;
                var pEnd;
                for (var i = 0; i < e.overlay.getPath().length; i++) {
                    if (i < 2) {
                        if (e.overlay.getPath()[i].lat < e.overlay.getPath()[i + 2].lat && e.overlay.getPath()[i].lng < e.overlay.getPath()[i + 2].lng) {
                            pStart = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
                            pEnd = new BMap.Point(e.overlay.getPath()[i + 2].lng, e.overlay.getPath()[i + 2].lat);
                            break;
                        }
                    } else if (i >= 2) {
                        if (e.overlay.getPath()[i].lat < e.overlay.getPath()[i - 2].lat && e.overlay.getPath()[i].lng < e.overlay.getPath()[i - 2].lng) {
                            pStart = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
                            pEnd = new BMap.Point(e.overlay.getPath()[i - 2].lng, e.overlay.getPath()[i - 2].lat);
                            break;
                        }
                    }
                }
                Findoverlays.push(e.overlay);
                var bs = new BMap.Bounds(pStart, pEnd);   //自己规定范围
                local = GetMapObj().GetLocalSearchObject(baidu_options);
                local.searchInBounds(FindStr, bs);
            } else {
                return;
            }
        }
        drawingFind.close();
    };

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingFind.addEventListener('overlaycomplete', drawingFindcomplete);
    ///////////////////////////////////百度选框搜索 结束


    //搜索城市dropdown下拉框阻止默认关闭事件
    $(".toolsLayer").on('click', function (e) {
        e.stopPropagation();
    });



    //切换地图
    $("#Google").click(function () {
        showMsg($, __tr("switch Google Maps"));
        if (map_Google == null) {
            map_Google = new googleAPI();
        }

        ClearFindDate();
        $('input:checkbox[name=jkcheckbox]:checked').each(function () {
            var inputObj = $(this).parent().parent().parent().attr("mfid");
            if (typeof inputObj == 'undefined') {
                $(this).removeAttr("checked")
            } else {
                $(this).click();
            }
        });

        map = "google";
        map_Google.InitGoogle("container");
        $("#ChoiceMap").find(".ace-text").html(__tr("Google Maps"));
    });

    $("#Baidu").click(function () {
        ClearFindDate();
        $('input:checkbox[name=jkcheckbox]:checked').each(function () {
            var inputObj = $(this).parent().parent().parent().attr("mfid");
            if (typeof inputObj == 'undefined') {
                $(this).removeAttr("checked")
            } else {
                $(this).click();
            }
        });
        showMsg($, __tr("switch Baidu Maps"));
        // showMsg($, "切换地图Baidu");
        map = "baidu";
        map_Baidu.InitBaidu("container");
        driving = GetMapObj().CreateDrivingRoute(SearchComplete, polyLineSet);
        //  $("#ChoiceMap").find(".ace-text").html("百度地图");
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

    //保存区域弹窗
    function SaveAreaDialog() {
        $("#SaveAreaDialog").removeClass('hide').dialog({
            modal: true,
            title: __tr("electronic fence"),
            title_html: true,
            width: "60.5%",
            height: 560,
            buttons: [
                {
                    text: __tr("Save"),
                    "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                    click: function () {
                        SaveArea();
                        $(this).dialog("close");
                        CleanMapOverLays();
                    }
                },
                {
                    text: __tr("Close"),
                    "class": "btn btn-white btn-primary btn-round  padding-lr-36 margin-l-15",
                    click: function () {
                        $(this).dialog("close");
                        CleanMapOverLays();
                    }
                }
            ],
            close: function () {
                $(this).dialog("close");
                CleanMapOverLays();
                CleanInputValue("SaveAreaDialog");
            }
        });
    }

    //保存路径弹窗
    function SaveRouteDialog() {
        $("#SaveRouteDialog").removeClass('hide').dialog({
            modal: true,
            title: "",
            title_html: true,
            width: 768,
            buttons: [
                {
                    text: __tr("Save"),
                    "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                    click: function () {
                        SaveRoute();
                        $(this).dialog("close");
                    }
                },
                {
                    text: __tr("Close"),
                    "class": "btn btn-white btn-primary btn-round  padding-lr-36 margin-l-15",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ],
            close: function () {
                CleanInputValue("SaveRouteDialog");
            }
        });
    }

    //保存区域
    $("#mFFrom").find("option").eq(2).attr("selected", "selected");//默认通用UI
    function SaveArea() {
        var varmFNumber = $("#mFNumber").val();
        var varmFName = $("#mFName").val();
        var varmFDescription = $("#mFDescription").val();
        var varmFOUID = $("#mFOU").attr("OUID");


        var varmFType = $("#mFType").val();
        // alert($("#mFType").val());
        //  return;
        var varmFFrom = $("#mFFrom").val();
        var varmFHotspotRadius = $("#mFHotspotRadius").val();
        var varmFLimitSpeedValue = $("#mFLimitSpeedValue").val();
        var varmFLimitTimeValue = $("#mFLimitTimeValue").val();
        var varmFHead = $("#mFHead").val();
        var varmFMovePhone = $("#mFMovePhone").val();

        //坐标点
        var varmFCoordinateFence = $("#mFCoordinateFence").val();
        $.post(
            "/GIS/AreaEdit/Save", {
                mFNumber: varmFNumber,
                mFName: varmFName,
                mFDescription: varmFDescription,
                mFOUID: varmFOUID,
                mFType: varmFType,
                mFFrom: varmFFrom,
                mFHotspotRadius: varmFHotspotRadius,
                mFCoordinateFence: varmFCoordinateFence,
                mFLimitSpeedValue: varmFLimitSpeedValue,
                mFLimitTimeValue: varmFLimitTimeValue,
                mFHead: varmFHead,
                mFMovePhone: varmFMovePhone
            },
            function (data) {
                if (!CheckDataStatus(data, $)) return;
                //var json = $.parseJSON(data);


            }
        );
    }

    //保存路线
    function SaveRoute() {
        var isadd = true;
        var varmFNumber = $("#mFNumberR").val();
        var varmFName = $("#mFNameR").val();
        var varmFOUID = $("#mFOUR").attr("ouid");
        var varmFDescription = $("#mFDescriptionR").val();
        var routecoordinatesJson = "[";
        var routePoints = points.split("|");
        //获取线路点的Json数据
        for (var i = 0; i < routePoints.length; i++) {
            var lng = routePoints[i].split(",")[0];
            var lat = routePoints[i].split(",")[1];
            var ismarker = false;
            //for (var j = 0; j < Marker.length; j++) {
            //    var markerPoint = Marker[i].marker.GetMapObj().GetPosition();
            //    if (markerPoint.lat == lat && markerPoint.lng==lng) {
            //        ismarker = true;
            //        break;
            //    }
            //}
            routecoordinatesJson += '{"mFMarking":"' + ismarker + '","mFIndex":"' + (i + 1) + '","mFLng":"' + lng + '","mFLat":"' + lat + '"},';
        }
        routecoordinatesJson = routecoordinatesJson.substr(0, routecoordinatesJson.length - 1);
        routecoordinatesJson += "]";

        $.post("/GIS/RouteEdit/Save", {
            mFNumber: varmFNumber,
            mFName: varmFName,
            mFOUID: varmFOUID,
            mFDescription: varmFDescription,
            routecoordinatesJson: routecoordinatesJson
        }, function (data) {
            if (!CheckDataStatus(data, $)) return;
            // var json = $.parseJSON(data);

        });
    }

    //清除
    function clearOverlay() {
        $("#mFCoordinateFence").val("");
        $("#mFHotspotRadius").val("");
        for (var i = 0; i < overlays.length; i++) {
            GetMapObj().removeOverlay(overlays[i]);
            overlays.splice(i);
        }
        for (var i = 0; i < Marker.length; i++) {
            GetMapObj().removeOverlay(Marker[i]);
        }


    }

    $("#BtnDel").click(function () {
        clearOverlay();
    });

    //区域设置开始
    //  var drawingManager;
    var driving;
    driving = GetMapObj().CreateDrivingRoute(SearchComplete, polyLineSet);
    var points = "";

    //添加区域画圆
    $(".evCircle").click(function () {
        $("#mFType").val("C");
        GetMapObj().setDrawMode("circle", SaveAreaDialog);
        //  drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
        //  drawingManager.open();

    });
    //添加区域多边形
    $(".evPolygon").click(function () {
        $("#mFType").val("A");
        GetMapObj().setDrawMode("polygon", SaveAreaDialog);

        //  drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
        //  drawingManager.open();
    });
    //添加区域方形
    $(".evRectangle").click(function () {
        $("#mFType").val("R");
        GetMapObj().setDrawMode("rect", SaveAreaDialog);
        //   drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
        //   drawingManager.open();
    });

    $(".mapicon-look").click(function () {
        showMsg($, __tr("Display area"));
    });

    //路线计算开始
    //计算路线
    $("#searchRoute").click(function () {
        GetMapObj().maplet.removeEventListener("click", AddRouteMarker);
        routeSearch();
    });

    //选点事件
    function AddRouteMarker(e) {
        var marker = GetMapObj().GetMarker();
        var point = GetMapObj().GetPosition(e.point.lng, e.point.lat);
        marker.setPosition(point);
        GetMapObj().maplet.addOverlay(marker);
        RouteMarker.push(marker);

    }


    function routeSearch() {
        var start = new BMap.Point(RouteMarker[0].point.lng, RouteMarker[0].point.lat);
        var end = new BMap.Point(RouteMarker[RouteMarker.length - 1].point.lng, RouteMarker[RouteMarker.length - 1].point.lat);
        var waypoints = [];
        for (var i = 1; i < RouteMarker.length - 1; i++) {
            var point = new BMap.Point(RouteMarker[i].point.lng, RouteMarker[i].point.lat);
            waypoints.push(point);
        }
        driving.search(start, end, { waypoints: waypoints });
    }

    //////////////google地图路线查询方法 开始
    function SearchDriving(Mark_start, Mark_End) {
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var directionsService = new google.maps.DirectionsService;
        directionsDisplay.setMap(GetMapObj().maplet);
        directionsDisplay.setPanel(document.getElementById('RouteResult'));
        var start = Mark_start.getPosition();
        var end = Mark_End.getPosition();
        directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var path = response.routes[0].overview_path;
                for (var i = 0; i < path.length; i++) {
                    points += path[i].lng() + "," + path[i].lat() + "|";
                }

                $("#RouteResult").removeClass('hide').dialog({
                    modal: false,
                    title: "",
                    title_html: true,
                    width: 400,
                    height: 300,
                    buttons: [
                        {
                            text: "保存线路",
                            "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                            click: function () {
                                SaveRouteDialog();
                                //$(this).dialog("close");
                            }
                        },
                        {
                            text: "重新导航",
                            "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                            click: function () {
                                Mark_start.setMap(null);
                                Mark_End.setMap(null);
                                directionsDisplay.setMap(null);
                                $("#navigation").click();
                                $(this).dialog("close");
                            }
                        },
                        {
                            text: "关闭",
                            "class": "btn btn-white btn-primary btn-round  padding-lr-36",
                            click: function () {
                                Mark_start.setMap(null);
                                Mark_End.setMap(null);
                                directionsDisplay.setMap(null);
                                $(this).dialog("close");
                            }
                        }
                    ]
                });

            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });

    }

    //////////////google地图路线查询方法 结束



    //////////////百度地图路线查询回调方法 开始
    //生成路线回调
    function SearchComplete(results) {
        if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
            return;
        }
        var points = results.getPlan(0).getRoute(0).getPath();
        GetMapObj().maplet.addOverlay(points);
        marker_key["polyLine"] = points;
        var plan = results.getPlan(0);
        Duration = plan.getDuration(true); //获取时间
        Distance = plan.getDistance(true); //获取距离
    };

    //生成路线回调
    function polyLineSet() {
        setTimeout(function () {
            var Plan = driving.getResults().getPlan(0);
            points = "";
            var count = 0;
            for (var j = 0; j < Plan.getNumRoutes() ; j++) {
                var path = Plan.getRoute(j).getPath();
                for (var i = 0; i < path.length; i++) {
                    var point = path[i];
                    points += point.lng + "," + point.lat + "|";
                    count++;
                }
                var route = Plan.getRoute(j);
                var s = [];
                for (var i = 0; i < route.getNumSteps() ; i++) {
                    var step = route.getStep(i);
                    //s.push("<tr><td>" + (i + 1) + step.getDescription() + "</td></tr>");
                    s.push("<div>" + (i + 1) + step.getDescription() + "</div>");
                }
                $("#RouteResult").html(s.join(" "));
                $("#RouteResult").removeClass('hide').dialog({
                    modal: false,
                    title: "",
                    title_html: true,
                    width: 450,
                    height: -100,
                    buttons: [
                        {
                            text: __tr("Save road"),
                            "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                            click: function () {
                                SaveRouteDialog();
                                //$(this).dialog("close");
                            }
                        },
                        {
                            text: __tr("Re navigation"),
                            "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                            click: function () {
                                $("#navigation").click();
                                GetMapObj().maplet.clearOverlays();

                                $(this).dialog("close");
                            }
                        },
                        {
                            text: __tr("Close"),
                            "class": "btn btn-white btn-primary btn-round  padding-lr-36",
                            click: function () {
                                GetMapObj().maplet.clearOverlays();
                                $(this).dialog("close");
                            }
                        }
                    ]
                });
            }
            //alert(driving.getResults().getPlan(0).getNumRoutes() + "总共有" + count + "个坐标点\n" + points);
        }, "1000");
    }
    //////////////百度地图路线查询回调方法 结束


    ///////////////////////拖动table开始
    //获取所有tr高度之和
    function GetTrH(id) {
        var trH = 0;
        $(id).find("tr").each(function () {
            trH += $(this).height();
        });
        return trH;
    }

    function CompareH(id, TrH) {
        if ($(id).height() > TrH) {
            $(id).prev().css({ "width": 100 + "%" });
        } else {
            $(id).prev().css({ "width": "calc( 100% - 1.1em )" });
        }

    }


    function DragTableFunc() {
        $("#DragDiv").mousedown(function (ev) {
            var e = ev || event;
            var _this = $(this);

            var TabContentH = $(".tab-content").height();
            var AllCarTableH = $("#AllCarTable").height();
            var onlineCarTableH = $("#onlineCarTable").height();
            var stopCarTableH = $("#stopCarTable").height();
            var warningCarTableH = $("#warningCarTable").height();
            var offlineCarTableH = $("#offlineCarTable").height();
            var MapContainerH = $("#container").height();
            var JiankongtreeH = $(".jiankongtree").height();

            var AllCarTableTrH = GetTrH("#AllCarTable");
            var onlineCarTableTrH = GetTrH("#onlineCarTable");
            var stopCarTableTrH = GetTrH("#stopCarTable");
            var warningCarTableTrH = GetTrH("#warningCarTable");
            var offlineCarTableTrH = GetTrH("#offlineCarTable");

            //var disY = e.clientY;
            var disT = _this.offset().top;
            //console.log(disT, TabContentH, AllCarTableH);
            $(document).mousemove(function (ev) {
                var e = ev || event;
                e.preventDefault();

                var disY = disT - (e.clientY - 2);
                var ChangeTop = -3 - disY;
                if ((JiankongtreeH + ChangeTop) < 50 || (-ChangeTop + TabContentH) < 36) {
                    return;
                }
                //console.log(disT, e.clientY);
                //console.log(disY + "px");
                //_this.css({ "top": (ChangeTop+160)+ "px" });
                //$("#DragTable").css({"bottom": -ChangeTop + "px" });
                $(".tab-content").css({ "height": (-ChangeTop + TabContentH) + "px" });
                $("#AllCarTable").css({ "height": (-ChangeTop + AllCarTableH) + "px" });
                $("#onlineCarTable").css({ "height": (-ChangeTop + onlineCarTableH) + "px" });
                $("#stopCarTable").css({ "height": (-ChangeTop + stopCarTableH) + "px" });
                $("#warningCarTable").css({ "height": (-ChangeTop + warningCarTableH) + "px" });
                $("#offlineCarTable").css({ "height": (-ChangeTop + offlineCarTableH) + "px" });
                $("#container").css({ "height": (MapContainerH + ChangeTop) + "px" });
                $(".jiankongtree").css({ "height": (JiankongtreeH + ChangeTop) + "px" });



                CompareH("#AllCarTable", AllCarTableTrH);
                CompareH("#onlineCarTable", onlineCarTableTrH);
                CompareH("#stopCarTable", stopCarTableTrH);
                CompareH("#warningCarTable", warningCarTableTrH);
                CompareH("#offlineCarTable", offlineCarTableTrH);
            });
            $(document).mouseup(function () {
                $(this).unbind("mousemove");
            });
        });
    }
    //拖动table结束

    //driving = new BMap.DrivingRoute(GetMapObj().maplet, {
    //    renderOptions: { map: GetMapObj().maplet, enableDragging: true, autoViewport: true },
    //    onSearchComplete: SearchComplete,
    //    onPolylinesSet: polyLineSet
    //});


    //路线计算结束

    //实例化鼠标绘制工具 回调函数 百度 开始
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
    //   // drawingManager.close();
    //    SaveAreaDialog();
    //};
    //实例化鼠标绘制工具 回调函数 百度 结束


    //实例化鼠标绘制工具
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

    //热点失去焦点事件,用于文本修改后圆行区域生成新的区域
    $("#mFHotspotRadius").focusout(function () {
        var overlay = overlays[0];
        GetMapObj().maplet.removeOverlay(overlay);
        overlays.splice(0);
        //圆的加载方法
        var pointstr = $("#mFCoordinateFence").val();
        var point = new BMap.Point(pointstr.split(",")[0], pointstr.split(",")[1]);
        var circle = new BMap.Circle(point, $("#mFHotspotRadius").val(), styleOptions); //创建圆
        GetMapObj().maplet.addOverlay(circle);
        overlays.push(circle);
    });

    //添加marker
    function AddMarker(point, title) {
        var marker = GetMapObj().GetMarker();
        marker.setPosition(point);
        marker.setTitle(title);
        marker.enableDragging();
        GetMapObj().maplet.addOverlay(marker);
        marker.addEventListener("dragend", ChangeMarkerPosition);

        Marker.push(marker);
    }

    //marker拖动后的回调,用来改变线的坐标
    function ChangeMarkerPosition(e) {
        var overlay = overlays[0];
        GetMapObj().maplet.removeOverlay(overlay);
        overlays.splice(0);
        var points = [];
        var result = '';
        if ($("#mFType").val() == "C") {
            //圆的加载方法
            var point = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
            var circle = new BMap.Circle(point, $("#mFHotspotRadius").val(), styleOptions); //创建圆
            GetMapObj().maplet.addOverlay(circle);
            overlays.push(circle);
            $("#mFCoordinateFence").val(e.target.GetMapObj().GetPosition().lng + "," + e.target.GetMapObj().GetPosition().lat);
        }
        else if ($("#mFType").val() == "R") {
            var point0;
            var point2;
            if (e.target.getTitle() == 0) {
                point0 = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
                point2 = new BMap.Point(overlay.getPath()[2].lng, overlay.getPath()[2].lat);
            } else {
                point2 = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
                point0 = new BMap.Point(overlay.getPath()[0].lng, overlay.getPath()[0].lat);
            }
            var point1 = new BMap.Point(point0.lng, point2.lat);
            var point3 = new BMap.Point(point2.lng, point0.lat);
            points.push(point0);
            points.push(point1);
            points.push(point2);
            points.push(point3);
            for (var j = 0; j < points.length; j++) {
                result += points[j].lng + "," + points[j].lat + "|";
            }
            var temp = result.substr(result.length - 1, result.length);
            if (result.length > 0 && temp == "|") {
                result = result.substr(0, result.length - 1);
            }
            $("#mFCoordinateFence").val(result);
            var polygon = new BMap.Polygon(points, styleOptions);
            GetMapObj().maplet.addOverlay(polygon);
            overlays.push(polygon);
        }
        else {

            for (var i = 0; i < overlay.getPath().length; i++) {
                var point;
                if (i == e.target.getTitle()) {
                    point = new BMap.Point(e.target.GetMapObj().GetPosition().lng, e.target.GetMapObj().GetPosition().lat);
                    result += e.target.GetMapObj().GetPosition().lng + "," + e.target.GetMapObj().GetPosition().lat + "|";
                } else {
                    point = new BMap.Point(overlay.getPath()[i].lng, overlay.getPath()[i].lat);
                    result += overlay.getPath()[i].lng + "," + overlay.getPath()[i].lat + "|";
                }
                points.push(point);
            }
            var temp = result.substr(result.length - 1, result.length);
            if (result.length > 0 && temp == "|") {
                result = result.substr(0, result.length - 1);
            }
            $("#mFCoordinateFence").val(result);
            var polygon = new BMap.Polygon(points, styleOptions);
            GetMapObj().maplet.addOverlay(polygon);
            overlays.push(polygon);
        }
    }

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

    $(document).on("click", ".BMap_Marker ", function () {
        $(document).find("#infoBox").remove();

    });
    $(document).on("click", ".xj-width-110", function () {
        var tdId = $(this).attr("mfid");
        var vehId
        for (var i = 0, len = $(".VehicleItem").length; i < len; i++) {
            vehId = $(".VehicleItem").eq(i).parent().attr("mfid");
            if (vehId == tdId) {
                $(".VehicleItem").eq(i).click();
            }
        }
    })
    var headercancel = $("#header>span");
    $(document).on("click", headercancel, function () {
        $(document).find("#infoBox").remove();
    });
    //$(document).ready(function () {
    //    $(".resizekeydown").mousedown(function (e)//e鼠标事件  


    //    {
    //        var offset = $(this).offset();//DIV在页面的位置  
    //        var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离  
    //        var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离  
    //        $(document).bind("mousemove", function (ev)//绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件  
    //        {
    //            $("#lishowcarinfo").click();
    //            $(".resizekeydown").stop();//加上这个之后  

    //            var _x = ev.pageX - x;//获得X轴方向移动的值  
    //            var _y = ev.pageY - y;//获得Y轴方向移动的值  

    //            console.log(_y);
    //            $("#AllCarTable").attr("style", "height:" + _x + "px");
    //        });

    //    });

    //    $(document).mouseup(function () {
    //        $(".show").css("cursor", "default");
    //        $(this).unbind("mousemove");
    //    })
    //})

    // --></script>


    //区域设置结束
});
