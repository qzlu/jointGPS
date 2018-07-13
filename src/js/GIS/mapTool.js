var overlays = [];
var Marker = [];
var RouteMarker = [];
//清除
function CleanMapOverLays() {
    $("#mFCoordinateFence").val("");
    $("#mFHotspotRadius").val("");

    for (var i = 0; i < overlays.length; i++) {
        GetMapObj().maplet.removeOverlay(overlays[i]);
        overlays.splice(i);
    }
    overlays.length = 0;
    for (var i = 0; i < Marker.length; i++) {
        GetMapObj().maplet.removeOverlay(Marker[i]);
    }
    Marker.length = 0;
}

jQuery(function ($) {

    $("#mapSwitch").click(function () {
        //map.mapType = BMAP_SATELLITE_MAP;
        if ($("#mapSwitchA").html() == "卫星地图") {
            changeMapLiStyle(1);
            GetMapObj().maplet.setMapType(BMAP_HYBRID_MAP);
        } else {
            changeMapLiStyle(0);
            GetMapObj().maplet.setMapType(BMAP_NORMAL_MAP);
        }


    });

    function changeMapLiStyle(type) {
        try {
            if (type == 0) {
                $("#mapSwitchA").removeClass("flat");
                $("#mapSwitchA").addClass("satellite");
                $("#mapSwitchA").attr("title", "切换卫星地图");
                $("#mapSwitchA").html("卫星地图")
            } else {
                $("#mapSwitchA").removeClass("satellite");
                $("#mapSwitchA").addClass("flat");
                $("#mapSwitchA").attr("title", "切换平面地图");
                $("#mapSwitchA").html("平面地图")
            }
        } catch (ex) {
            catchTheException("changeMapLiStyle", ex)
        }
    };

    //测量
    $("#DistanceTool").click(function () {
        var myDis = new BMapLib.DistanceTool(GetMapObj().maplet);
        myDis.open();
    });

    //导航
    $("#navigation").click(function () {
        $("#ShowNavigationDialog").removeClass('hide').dialog({
            modal: false,
            title: "导航",
            title_html: true,
            width: 550,
            height: 400,
            buttons: [
                {
                    text: "导航",
                    "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                    click: function () {
                        var spoint = markers["start"].getPosition();
                        var epoint = markers["end"].getPosition();
                        GetMapObj().maplet.removeOverlay(markers["start"]);
                        GetMapObj().maplet.removeOverlay(markers["end"]);
                        driving.search(spoint, epoint);
                        $(this).dialog("close");

                    }
                },
                {
                    text: "关闭",
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
        if (markers["start"] != null) {
            GetMapObj().maplet.removeOverlay(markers["start"])
        }
        GetMapObj().maplet.setDefaultCursor("crosshair");
        showMsg($, "请在地图上选择起点位置");
        GetMapObj().maplet.addEventListener("click", function checkmarker(e) {
            var point = new BMap.Point(e.point.lng, e.point.lat);
            var marker = GetMapObj().GetMarker();
            var Iconurl = "/assets/image/p_start.png";
            var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(50, 50), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(12, 0));
            marker.setIcon(icon);
            marker.setPosition(point);
            marker.enableDragging();
            GetMapObj().maplet.addOverlay(marker);
            marker.addEventListener("dragend", ChangeMarkerPosition);
            markers["start"] = marker;
            GetMapObj().maplet.setDefaultCursor("openhead");
            GetMapObj().maplet.removeEventListener("click", checkmarker);
        });
    });

    //终点位置选择
    $("#nMarkE").click(function () {
        if (markers["end"] != null) {
            GetMapObj().maplet.removeOverlay(markers["end"])
        }
        showMsg($, "请在地图上选择终点位置");

        GetMapObj().maplet.setDefaultCursor("crosshair");
        GetMapObj().maplet.addEventListener("click", function checkmarker(e) {
            var point = new BMap.Point(e.point.lng, e.point.lat);
            var marker = GetMapObj().GetMarker();
            marker.setPosition(point);
            var Iconurl = "/assets/image/p_end.png";
            var icon = GetMapObj().GetIcon(Iconurl, GetMapObj().GetSizeObject(50, 50), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(12, 0));
            marker.setIcon(icon);
            marker.enableDragging();
            GetMapObj().maplet.addOverlay(marker);
            marker.addEventListener("dragend", ChangeMarkerPosition);
            markers["end"] = marker;
            GetMapObj().maplet.setDefaultCursor("openhead");
            GetMapObj().maplet.removeEventListener("click", checkmarker);
        });
    });

    checkCars = [];
    mappoints = [];
    var markers = new Array();
    var showTraffic = false;
    var ctrl = new BMapLib.TrafficControl({
        showPanel: false //是否显示路况提示面板
    });
    GetMapObj().maplet.addControl(ctrl);
    //路况
    $("#Traffic").click(function () {
        if (showTraffic) {
            //ctrl.remove();
            ctrl.hideTraffic();
            showTraffic = false;
            $(this).find(".ace-text").html("打开路况");
        } else {
            ctrl.showTraffic();
            showTraffic = true;
            $(this).find(".ace-text").html("关闭路况");

        }

    });

    //缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
    GetMapObj().maplet.addControl(ctrl_ove);

    //查询
    $(".searchbtn").click(function () {
        $("#SearchList").html("");
        local.search($("#SearchText").val());
    });

    //查询服务
    var options = {
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
                    SearchResult += "<tr class='SearchResult' point='" + result.point.lat + "," + result.point.lng + "'><td>" + (i + 1) + "</td><td>" + result.title + "</td><td>" + result.address + "</td></tr>";

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
                    width: 550,
                    height: 400,
                    close: ClearFindDate
                });
            } else {
                ClearFindDate();
                showMsg($, "没有数据。");
            }
        }
    };
    var local = new BMap.LocalSearch(GetMapObj().maplet, options);

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
        for (var i = 0; i < Findoverlays.length; i++) {
            GetMapObj().maplet.removeOverlay(Findoverlays[i]);
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
        FindStr = "收费站";
        drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
        drawingFind.open();
    });

    //找加油站
    $("#sOilLi").click(function () {
        FindStr = "加油站";
        drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
        drawingFind.open();
    });

    //找停车场
    $("#sParkingLi").click(function () {
        FindStr = "停车场";
        drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
        drawingFind.open();
    });

    //找高速路出入口
    $("#sHighWayLi").click(function () {
        FindStr = "高速路出入口";
        drawingFind.setDrawingMode(BMAP_DRAWING_RECTANGLE);
        drawingFind.open();
    });

    //查询关键字
    var FindStr = "";

    //实例化鼠标绘制工具
    var drawingFind = new BMapLib.DrawingManager(GetMapObj().maplet, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        setDrawingMode: { BMAP_DRAWING_RECTANGLE},
                rectangleOptions: styleOptions //矩形的样式
        });
    var Findoverlays =[];
    //实例化鼠标绘制工具
    var drawingFindcomplete = function (e) {
        if (e.drawingMode == BMAP_DRAWING_RECTANGLE) {
            //方形
            var point0 = e.overlay.getPath()[0].lng + "," +e.overlay.getPath()[0].lat;
            var point2 = e.overlay.getPath()[2].lng + "," +e.overlay.getPath()[2].lat;
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
                local.searchInBounds(FindStr, bs);
            } else {
                return;
            }
        }
        drawingFind.close();
    };

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingFind.addEventListener('overlaycomplete', drawingFindcomplete);

    //切换地图
    $("#Google").click(function () {
        showMsg($, "切换地图Google");
        $("#ChoiceMap").find(".ace-text").html("谷歌地图");
    });

    $("#Baidu").click(function () {
        showMsg($, "切换地图Baidu");
        $("#ChoiceMap").find(".ace-text").html("百度地图");

    });

    //切换城市
    loadProvinceInfos();
    $("#CityList").click(function () {
        $(this).parent().toggleClass("open");
    });

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
            if (sTxt != "" && sTxt != "输入城市名") {
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

    //区域设置开始
    var drawingManager;
    var driving;
    var points = "";

    //添加区域画圆
    $("#CIRCLE").click(function () {
        drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
        drawingManager.open();
    });
    //添加区域多边形
    $("#POLYGON").click(function () {
        drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
        drawingManager.open();
    });
    //添加区域方形
    $("#RECTANGLE").click(function () {
        drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
        drawingManager.open();
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

    //生成路线回调
    function SearchComplete(results) {
        if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
            return;
        }
        var points = results.getPlan(0).getRoute(0).getPath();
        GetMapObj().maplet.addOverlay(points);
        markers["polyLine"] = points;
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
                $("#RouteResult").html(s.join());
                $("#RouteResult").removeClass('hide').dialog({
                    modal: false,
                    title: "",
                    title_html: true,
                    width: 650,
                    height: 300,
                    buttons: [
                        {
                            text: "保存线路",
                            "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                            click: function () {
                                SaveRouteDialog($);
                                //$(this).dialog("close");
                            }
                        },
                        {
                            text: "重新导航",
                            "class": "btn btn-sm btn-primary btn-round padding-lr-36",
                            click: function () {
                                $("#navigation").click();
                                GetMapObj().maplet.clearOverlays();

                                $(this).dialog("close");
                            }
                        },
                        {
                            text: "关闭",
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

    driving = new BMap.DrivingRoute(GetMapObj().maplet, {
        renderOptions: { map: GetMapObj().maplet, enableDragging: true, autoViewport: true },
        onSearchComplete: SearchComplete,
        onPolylinesSet: polyLineSet
    });

    //路线计算结束

    //实例化鼠标绘制工具
    var overlaycomplete = function (e) {
        var result = "";
        //result += e.drawingMode + ":";
        if (e.drawingMode == BMAP_DRAWING_MARKER) {
            result += e.overlay.GetMapObj().GetPosition().lng + ',' + e.overlay.GetMapObj().GetPosition().lat + "|";
        }
        else if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
            //圆形
            result += e.overlay.getCenter().lng + "," + e.overlay.getCenter().lat + "|";
            var point = new BMap.Point(e.overlay.getCenter().lng, e.overlay.getCenter().lat);
            if (e.overlay.getRadius() != 0) {
                //判断圆的范围,如果为0则不执行
                $("#mFHotspotRadius").val(e.overlay.getRadius());
                //AddMarker(point, 0);
                overlays.push(e.overlay);
            } else {
                $("#mFHotspotRadius").val("200");
                var circle = new BMap.Circle(point, "200", styleOptions); //创建圆
                GetMapObj().maplet.addOverlay(circle);
                //AddMarker(point, 0);
                overlays.push(circle);
            }
        }
        else if (e.drawingMode == BMAP_DRAWING_POLYGON) {
            //多边形
            for (var i = 0; i < e.overlay.getPath().length; i++) {
                result += e.overlay.getPath()[i].lng + "," + e.overlay.getPath()[i].lat + "|";
                var point = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
                //AddMarker(point, i);
                overlays.push(e.overlay);
            }
        }
        else if (e.drawingMode == BMAP_DRAWING_RECTANGLE) {
            //方形
            var point0 = e.overlay.getPath()[0].lng + "," + e.overlay.getPath()[0].lat;
            var point2 = e.overlay.getPath()[2].lng + "," + e.overlay.getPath()[2].lat;
            //判断对角坐标如果相同则不执行
            if (point0 != point2) {
                for (var i = 0; i < e.overlay.getPath().length; i++) {
                    result += e.overlay.getPath()[i].lng + "," + e.overlay.getPath()[i].lat + "|";
                    var point = new BMap.Point(e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat);
                    if (i % 2 == 0) {
                        //AddMarker(point, i);
                    }
                    overlays.push(e.overlay);
                }
            } else {
                return;
            }
        }
        var temp = result.substr(result.length - 1, result.length);
        if (result.length > 0 && temp == "|") {
            result = result.substr(0, result.length - 1);
        }
        $("#mFCoordinateFence").val(result); //将绘制的覆盖物信息结果输出到结果面板
        drawingManager.close();
        SaveAreaDialog($);
    };

    //实例化鼠标绘制工具
    drawingManager = new BMapLib.DrawingManager(GetMapObj().maplet, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        setDrawingMode: { BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE},
                circleOptions: styleOptions, //圆的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
        });

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);

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




    //区域设置结束
})