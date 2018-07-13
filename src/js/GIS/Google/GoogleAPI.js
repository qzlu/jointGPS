/**********************************************
*   说明：googleAPI.js是关于Google地图的api的封装。 *  
    Update By:liulg
    Last UpdateTime:2017-01-17
*
/*********************************************/
/*
* 地图对象
*/
function googleAPI() {
    try {
        this.maplet = null;
        this.mapName = "google";
        this.mapLevelDistance = [10000, 5000, 2000, 1000, 500, 200, 200, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005];
        this.overlaysArr = new Array();
        this.overlaysArr["P"] = new Array(); //自定义点数组
        this.overlaysArr["A"] = new Array(); //自定义区域数组
        this.overlaysArr["L"] = new Array(); //自定义区域数组
        this.overlaysArr["Lo"] = new Array(); //定位车辆数组
        this.overlaysArr["O"] = new Array(); //其他数据数组
        this.mapLevel = new Array();
        this.mapLevel["全国"] = 4;
        this.mapLevel["省"] = 6;
        this.mapLevel["市"] = 11;
        this.mapLevel["区"] = 13;
        this.traffic = null;
        this.LEVELD_ISTANCE = { 4: "500km", 5: "200km", 6: "100km", 7: "50km", 8: "20km", 9: "20km", 10: "10km", 11: "5km", 12: "2km", 13: "1km", 14: "500m", 15: "200m", 16: "100m", 17: "50m", 18: "20m", 19: "10m", 20: "5m" };
    }
    catch (ex) {
        catchTheException("googleAPI", ex);
    }
};

/*
*   初始化google地图
*/
googleAPI.prototype.InitGoogle = function (mDiv, dCity, level) {
    try {
        var llArr = new Array();
        if (typeof level == "undefined" || level == null || level == "") { level = 11; }
        if (typeof dCity != "undefined" && dCity != null && dCity != "") {
            llArr = dCity.split(",");
        }
        else {
            llArr = [22.541098, 114.054136];
        }
        var myOptions = {
            zoom: level,
            center: new google.maps.LatLng(llArr[0], llArr[1]),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            overviewMapControl: true,
            scaleControl: true,
            streetViewControl: false,
            minZoom: 5,
            maxZoom: 18
        };
        this.maplet = new google.maps.Map(document.getElementById(mDiv),
        myOptions);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.InitGoogle", ex);
    }
};

googleAPI.prototype.getMapObject = function () {
    try {
        return this.maplet;
    } catch (ex) {
        catchTheException("googleAPI.prototype.getMapObject", ex)
    }
};

//获取坐标对象
googleAPI.prototype.GetPosition = function (lng, lat) {
    var myLatlng = new google.maps.LatLng(lat, lng);
    return myLatlng;
};

//获取标记对象
googleAPI.prototype.GetMarker = function () {
    var marker = new google.maps.Marker();
    return marker;
};

//获取标记对象开启坐标拖动事件
googleAPI.prototype.GetMarkerAndDrag = function () {
    var marker = new google.maps.Marker();

    var MarkerOptions = {
        draggable: true
    }
    marker.setOptions(MarkerOptions);
    return marker;
};

googleAPI.prototype.GetIcon = function (Iconurl, imgSize, offsetSize, imageOffsetSize) {
    var Icon = {
        url: Iconurl,
        size: imgSize
        //  origin: offsetSize,
        //  anchor: imageOffsetSize
        // scaledSize: new google.maps.Size(25, 25)
    };
    return Icon;
}

//marker label 无单击事件
googleAPI.prototype.SetLabel = function (point, iconUrl, showinfo) {


    var markerLabel = new MarkerWithLabel({
        position: point,
        map: this.maplet,
        icon: iconUrl,
        labelContent: showinfo,
        labelAnchor: new google.maps.Point(0, 0),
        //   json: json,
        //   id: json.TID,
        labelClass: "google_labels" // the CSS class for the label  
        //labelStyle: {
        //    opacity: 0.75,
        //    border: "0",
        //    cursor: "pointer",
        //    padding: "3px"
        //}
    });
    return markerLabel;
}

//marker label 有单击事件
googleAPI.prototype.SetInLabel = function (markers, icon, point, label, json, obj, tempMonitor, tireMonitor) {

    var marker = new MarkerWithLabel({
        position: point,
        map: this.maplet,
        icon: icon,
        labelContent: label,
        labelAnchor: new google.maps.Point(0, 0),
        json: JSON.stringify(json),
        tempMonitor: JSON.stringify(tempMonitor),
        tireMonitor: JSON.stringify(tireMonitor),
        id: json.mFObjectID,
        labelClass: "google_labels" // the CSS class for the label  
        // labelStyle: { opacity: 0.75 }
    });
    marker.addListener('click', obj);
    return marker;
}

//marker 单击后显示的infowindow
googleAPI.prototype.OpenMarkerInfoWindow = function (sContent, CarMarker) {
    var infowindow = new google.maps.InfoWindow({
        content: sContent
    });// 创建信息窗口对象
    infowindow.open(this.maplet, CarMarker);
}

//获取Geocoder对象
googleAPI.prototype.GetClientGeocoder = function () {
    var geocoder = new google.maps.Geocoder();
    return geocoder;
}

//调用Geoc => getLocation函数
googleAPI.prototype.Geoco_GetLocation = function (geoc, point, callBack_Geoc) {
    var jsonAddress = {
        province: "",
        city: "",
        district: "",
        street: ""
    }
    var jsonComponent = {
        addressComponents: jsonAddress
    }

    var latlng = point.lat() + "," + point.lng();
    $.ajax({
        async: true,
        type: "GET",
        dataType: "json",
        url: "http://maps.google.cn/maps/api/geocode/json?latlng=" + latlng,
        success: function (msg) {
            // var results = eval(msg.results);
            var results = msg.results;
            //alert(results[0].address_components[4].long_name);
            if (results != null && results != "" && results != "undefined" && results.length > 0 && results[0].address_components.length > 4) {
                jsonAddress.province = results[0].address_components[4].long_name;
                jsonAddress.city = results[0].address_components[3].long_name;
                jsonAddress.district = results[0].address_components[2].long_name;
                jsonAddress.street = results[0].address_components[1].long_name;
                callBack_Geoc(jsonComponent);
            }
        }
    });

    //geoc.geocode({ 'location': point }, function (results, status) {
    //    if (results != null && results != "" && results != "undefined" && results.length > 0 && results[0].address_components.length > 4) {
    //        jsonAddress.province = results[0].address_components[4].long_name;
    //        jsonAddress.city = results[0].address_components[3].long_name;
    //        jsonAddress.district = results[0].address_components[2].long_name;
    //        jsonAddress.street = results[0].address_components[1].long_name;
    //        callBack_Geoc(jsonComponent);
    //    }
    //});
}


//setViewport函数,设置所有锚点最佳试图
googleAPI.prototype.SetViewport = function (points) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, LtLgLen = points.length; i < LtLgLen; i++) {
        bounds.extend(points[i]);
    }
    this.maplet.fitBounds(bounds);
}

//搜索附近关键字
googleAPI.prototype.GetSearchBykeWord = function (service, callback, keyWord) {
    var request = {
        //  bounds: this.maplet.getBounds(),
        location: this.maplet.getCenter(),
        radius: 50000,
        keyword: keyWord
        // type: ['hotel']
    };
    service.nearbySearch(request, callback);
}

//根据所选框内范围查询所有相关地方
googleAPI.prototype.GetSearchBoundsBykeWord = function (service, callback, keyWord, Bounds) {
    var request = {
        bounds: Bounds,
        location: this.maplet.getCenter(),
        radius: 10000,
        keyword: keyWord,
        type: [keyWord]
    };
    service.nearbySearch(request, callback);
}

//根据条件获取Lng/Lat
googleAPI.prototype.getLngOrLat = function (type, obj, index) {
    if (type == "e.lng") {
        return obj.latLng.lng();
    } else if (type == "e.lat") {
        return obj.latLng.lat();
    } else if (type == "overlay.lng") {
        return obj.getPath().getAt(index).lng()
    } else if (type == "overlay.lat") {
        return obj.getPath().getAt(index).lat()
    } else if (type == "p.lng") {
        return obj.lng();
    } else if (type == "p.lat") {
        return obj.lat();
    }
}

//创建LocalSearch实例
googleAPI.prototype.GetLocalSearchObject = function () {
    var local = new google.maps.places.PlacesService(this.maplet);
    return local;
}


googleAPI.prototype.setMapCenterAndZoom = function (lng, lat, level) {
    var myLatlng = new google.maps.LatLng(lat, lng);
    this.setMapCenter(myLatlng);
    this.setZoom(level);
}



googleAPI.prototype.GetSizeObject = function (num1, num2) {
    return new google.maps.Size(num1, num2);
}


//设置默认鼠标指针样式 GOOGLE禁用了 此处无效
googleAPI.prototype.setDefaultCursor = function (cursor) {
    //  this.setOptions({ draggingCursor: 'url(/assets/image/p_start.png), ' + cursor + '' })
}

//添加marker监听事件
googleAPI.prototype.setMarkerEventListener = function (marker, strmode, callbackFun) {
    marker.addListener(strmode, callbackFun);
}

//添加监听事件
var listenerObj;
googleAPI.prototype.addEventListener = function (strMode, callbackFun) {
    listenerObj = this.maplet.addListener(strMode, callbackFun);
}

//删除监听事件
googleAPI.prototype.removeEventListener = function (strMode, callbackFun) {
    // this.maplet.removeListener(listenerObj);
    listenerObj.remove();
}

//获取point根据事件
googleAPI.prototype.getPointByEvent = function (event) {
    return event.latLng;
}

//开启Dragging事件
googleAPI.prototype.enableDragging = function (markerObj) {
    markerObj.setDraggable(true);
}



//创建驾驶路线对象
googleAPI.prototype.CreateDrivingRoute = function (SearchComplete, polyLineSet) {
    var directionsService = new google.maps.DirectionsService();
    return directionsService;
}

//查询路线
googleAPI.prototype.DrivingSearch = function (driving, Mark_start, Mark_End, waypoints) {
 
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(this.maplet);
    var request = {
        origin: Mark_start,
        destination: Mark_End,
        optimizeWaypoints:true,
        travelMode: google.maps.TravelMode.DRIVING
    };

    driving.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

/*
*   路况
*/
googleAPI.prototype.openTraffic = function () {
    try {
        this.traffic = new google.maps.TrafficLayer();
        this.traffic.setMap(this.maplet);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.openTraffic", ex);
    }
};
googleAPI.prototype.closeTraffic = function () {
    try {
        if (this.traffic != null) {
            this.traffic.setMap(null);
            this.traffic = null;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.closeTraffic", ex);
    }
};
/*
*   切换地图
*/
googleAPI.prototype.changeMapType = function (type) {
    try {
        if (type == 0) { //切换到平面
            this.maplet.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        }
        else { //切换到卫星
            this.maplet.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.changeMapType", ex);
    }
};
/*
*   放大
*/
googleAPI.prototype.ZoomIn = function () {
    try {
        var nowZoom = this.maplet.getZoom();
        this.maplet.setZoom(nowZoom + 1);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.ZoomIn", ex);
    }
};
/*
*   缩小
*/
googleAPI.prototype.ZoomOut = function () {
    try {
        var nowZoom = this.maplet.getZoom();
        this.maplet.setZoom(nowZoom - 1);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.ZoomOut", ex);
    }
};
/*
* 地图平移
*/
googleAPI.prototype.Move = function () {
    try {
        //处理测距
        var markerOptions = {
            latlng: measurePointArr[measurePointArr.length - 1],
            image: getRootPath() + "/Images/Map/x.png",
            width: "12px",
            height: "12px",
            labelText: null,
            detail: null,
            labelColor: "black",
            bColor: "white",
            draggable: false,
            labelOffset: new google.maps.Size(-5, -5),
            clickFun: closeMeasure
        };
        deleMarker = new MyMarker(this.maplet, markerOptions);
        deleMarker.setMap(this.maplet);
        //清除测距相关
        if (mousemoveEvent != null) { google.maps.event.removeListener(mousemoveEvent); mousemoveEvent = null; }
        if (mapclickEvent != null) { google.maps.event.removeListener(mapclickEvent); mapclickEvent = null; }
        if (mapdbclickEvent != null) { google.maps.event.removeListener(mapdbclickEvent); mapdbclickEvent = null; }
        if (mousemoveIconM != null) { mousemoveIconM.setMap(null); mousemoveIconM = null; }
        //    if (measureLine != null) { measureLine.setMap(null); measureLine = null; }
        if (mousemoveIconM != null) { mousemoveIconM.setMap(null); mousemoveIconM = null; }
        if (moveLine != null) { moveLine.setMap(null); moveLine = null; }
        //    if (deleMarker != null) { deleMarker.setMap(null); deleMarker = null; }
        //    measureMarkerArr = new Array();
        measurePointArr = new Array();
        //设置地图移动
        this.setDrawMode("pan");
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.Move", ex);
    }
};
/*
* 测距
*/
googleAPI.prototype.Measure = function () {
    try {
        GoogleMeasure();
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.Measure", ex);
    }
};
/*
* 设置地图缩放等级
*/
googleAPI.prototype.setZoom = function (level) {
    try {
        if (typeof (level) == 'undefined' || level == '' || level == null) return;
        this.maplet.setZoom(level);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setZoom", ex);
    }
};
/*
* 获取地图缩放等级
*/
googleAPI.prototype.getZoom = function () {
    try {
        return this.maplet.getZoom();
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.getZoom", ex);
    }
};
/*
* 设置地图中心点
*llObj:经纬度对象
*/
googleAPI.prototype.setMapCenter = function (llObj) {
    try {
        if (typeof IsSetLockMap != "undefined") {
            IsSetLockMap = false;
        }
        this.maplet.setCenter(llObj);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setMapCenter", ex);
    }
};
/*
* 获取地图中心点
*返回值：[lon,lat]
*/
googleAPI.prototype.getMapCenter = function () {
    try {
        var centerPoint = this.maplet.getCenter();
        var rObj = { lng: centerPoint.lng(), lat: centerPoint.lat() };
        return rObj;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.getMapCenter", ex);
    }
};
/*
* 创建经纬度对象
*/
googleAPI.prototype.createMPoint = function (lon, lat) {
    try {
        return new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.createMPoint", ex);
    }
};
/*
* 将对象添加到地图上
*/
googleAPI.prototype.addOverlay = function (overLay) {
    try {
        if (typeof overLay == "undefined" || overLay == null) { return; }
        overLay.setMap(this.maplet);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addOverlay", ex);
    }
};
/*
* 将对象从地图上移除
*/
googleAPI.prototype.removeOverlay = function (overLay) {
    try {
        if (overLay != null) {
            overLay.setMap(null);
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.removeOverlay", ex);
    }
};
/*
* 打开坐标点的气泡
*/
var infoWin = null;
googleAPI.prototype.openInfoWindow = function (overLay) {
    try {
        overLay.winWidth = overLay.winWidth || 260;
        overLay.winHeight = overLay.winHeight || 220;
        if (overLay.enableAutoPan == 'undefined' || overLay.enableAutoPan == null || overLay.enableAutoPan) {
            overLay.enableAutoPan = true;
        } else {
            overLay.enableAutoPan = false;
        }

        var infoWindowOptions = {
            content: overLay.winDetails,
            position: overLay.latlng,
            maxWidth: overLay.winWidth,
            disableAutoPan: !overLay.disableAutoPan
        };
        if (infoWin == null) {
            infoWin = new google.maps.InfoWindow(infoWindowOptions);
        }
        else {
            infoWin.setOptions(infoWindowOptions);
        }
        infoWin.open((typeof this.maplet == "undefined") ? map.maplet : this.maplet);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.openInfoWindow", ex);
    }
};
/*
* 关闭信息窗口
*/
googleAPI.prototype.closeInfoWindow = function () {
    try {
        closeClusterWin(false);
        if (infoWin != null) {
            infoWin.close();
            infoWin = null;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.closeInfoWindow", ex);
    }
};
/*
* 清空地图
*/
googleAPI.prototype.cleanMap = function () {
    try {
        if (this.overlaysArr) {
            if (this.overlaysArr["P"]) {
                for (var i in this.overlaysArr["P"]) {
                    if (i == "indexOf" || i == "delNull") { continue; }
                    this.overlaysArr["P"][i].setMap(null);
                }
                this.overlaysArr["P"].length = 0;
            }
            if (this.overlaysArr["A"]) {
                for (var m in this.overlaysArr["A"]) {
                    if (m == "indexOf" || m == "delNull") { continue; }
                    this.overlaysArr["A"][m].setMap(null);
                }
                this.overlaysArr["A"].length = 0;
            }
            if (this.overlaysArr["L"]) {
                for (var j in this.overlaysArr["L"]) {
                    if (j == "indexOf" || j == "delNull") { continue; }
                    this.overlaysArr["L"][j].setMap(null);
                }
                this.overlaysArr["L"].length = 0;
            }
            if (this.overlaysArr["O"]) {
                for (var n in this.overlaysArr["O"]) {
                    if (n == "indexOf" || n == "delNull") { continue; }
                    this.overlaysArr["O"][n].setMap(null);
                }
                this.overlaysArr["O"].length = 0;
            }
            if (this.overlaysArr["Lo"]) {
                for (var n in this.overlaysArr["Lo"]) {
                    if (n == "indexOf" || n == "delNull") { continue; }
                    this.overlaysArr["Lo"][n].setMap(null);
                }
                this.overlaysArr["Lo"].length = 0;
            }
            if (infoWin != null) {
                infoWin.close();
                infoWin = null;
            }
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.cleanMap", ex);
    }
};
/*
* 将相应的对象放在相应的数组中
*type:需要放进的数组的标识（P-点，A-区域，L-线，O-其他，Lo-定位车辆）
*/
googleAPI.prototype.pushOverlayToArr = function (overlay, type) {
    try {
        this.overlaysArr[type].push(overlay);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.pushOverlayToArr", ex);
    }
};
/*
* 清空保存点线面的数组
*/
googleAPI.prototype.clearMarkerArr = function () {
    try {
        if (this.overlaysArr) {
            this.overlaysArr["P"].length = 0;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.clearMarkerArr", ex);
    }
};
/*
* 清空保存区域的数组(Google地图方法)
*/
googleAPI.prototype.clearAreaArr = function () {
    try {
        if (this.overlaysArr) {
            this.overlaysArr["A"].length = 0;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.clearAreaArr", ex);
    }
};
/*
* 自适应地图容器大小
*/
googleAPI.prototype.mapResize = function (width, height) { };
/*
* 创建点对象
*icon:图标路径（必填）；llObj:经纬度对象（必填）；name:名称；winDetails:信息窗口内容（默认为null）；
*type:类型（（P-点(如果是自定义区域的中心点，此处传A)，A-区域(自定义区域)，L-线，O-其他，Lo-定位车辆））；color:名称背景颜色（默认白色）；fontColor:名称字体颜色（默认黑色）；
*isDrag:是否可拖拽（默认不可拖拽）；width:图标宽度（默认25px）；height:默认高度（默认25px）；winTitle:信息框标题（默认“”,Google地图中此参数无效）；
*offsetType:图标的锚点偏移类型（0-以图表的中心点为锚点，1-已图标的底部中心为锚点；默认0。）
*/
googleAPI.prototype.createMarker = function (llObj, options) {
    try {
        if (typeof llObj == "undefined" || llObj == "" || llObj == null) { return; }
        if (typeof options == "undefined" || options == null || typeof options != "object") { options = {}; }
        options.icon = options.icon || getRootPath() + "/Images/Map/15.png";
        options.name = options.name || "";
        options.winDetails = options.winDetails || null;
        options.color = options.color || "#ffffff";
        options.fontColor = options.fontColor || "#000000";
        options.isDrag = options.isDrag || false;
        options.width = options.width || 25;
        options.height = options.height || 25;
        options.winTitle = options.winTitle || "";
        options.offsetType = options.offsetType || 0;
        options.type = options.type || "O";
        options.winWidth = options.winWidth || 260;
        options.winHeight = options.winHeight || 220;//disableAutoPan
        if (options.enableAutoPan == 'undefined' || options.enableAutoPan == null || options.enableAutoPan) {
            options.enableAutoPan = true;
        } else {
            options.enableAutoPan = false;
        }

        var iconOffset = { x: 0, y: 0 };
        if (options.offsetType == 0) {
            iconOffset = { x: parseInt(options.width) / 2, y: parseInt(options.height) / 2 };
        }
        else {
            iconOffset = { x: parseInt(options.width) / 2, y: parseInt(options.height) };
        }
        //针对箭头图标做特殊处理（箭头图标偏移位置不对）
        if (options.icon.indexOf("arrow_") >= 0 && IsIE) {
            if (options.offsetType == 0) {
                iconOffset = { x: parseInt(options.width) / 2, y: parseInt(options.height) / 2 + parseInt(options.height) / 4 };
            }
            else {
                iconOffset = { x: parseInt(options.width) / 2, y: parseInt(options.height) };
            }
        }
        var marker = null;
        var cAble = false;
        if (options.winDetails != null) { cAble = true; }
        if (options.isDrag) {
            //绘制当前点
            marker = new google.maps.Marker({
                draggable: options.isDrag,
                clickable: cAble,
                icon: new google.maps.MarkerImage(options.icon, new google.maps.Size(options.width, options.height), new google.maps.Point(0, 0), new google.maps.Point(iconOffset.x, iconOffset.y), null),
                position: llObj,
                title: options.name
            });
            marker.winDetails = options.winDetails;
            marker.winWidth = options.winWidth;
            marker.enableAutoPan = options.enableAutoPan;
            if (options.winDetails != null && options.winDetails != "") {
                google.maps.event.addListener(marker, "click", function (event) {
                    var infoWindowOptions = {
                        content: this.winDetails,
                        position: this.getPosition(),
                        maxWidth: this.winWidth,
                        disableAutoPan: !this.enableAutoPan
                    };
                    if (infoWin == null) {
                        infoWin = new google.maps.InfoWindow(infoWindowOptions);
                    }
                    else {
                        infoWin.setOptions(infoWindowOptions);
                    }
                    infoWin.open(map.maplet);
                });
            }
            marker.latlng = llObj;
        }
        else {
            var markerOptions = {
                latlng: llObj,
                image: options.icon,
                width: options.width + "px",
                height: options.height + "px",
                labelText: options.name,
                detail: options.winDetails,
                labelColor: options.fontColor,
                bColor: options.color,
                draggable: options.isDrag,
                labelOffset: new google.maps.Size(options.width / 2, options.height / 2),
                offset: iconOffset,
                winWidth: options.winWidth,
                winHeight: options.winHeight,
                enableAutoPan: options.enableAutoPan

            };
            marker = new MyMarker(this.maplet, markerOptions);
        }
        marker.winDetails = options.winDetails;
        marker.winTitle = options.winTitle;
        marker.lon = llObj.lng();
        marker.lat = llObj.lat();
        this.overlaysArr[options.type].push(marker);
        return marker;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.createMarker", ex);
    }
};
/*
* 创建线对象
*LLObjs:经纬度对象数组（必填）；color:颜色（默认红色）；width:线宽度（默认3px）；IsArrow:是否需要箭头（Google中此参数无效）；clickable:是否可以click
*/
googleAPI.prototype.createLine = function (LLObjs, options) {
    try {
        if (typeof LLObjs == "undefined" || LLObjs == "" || LLObjs == null) { return; }
        if (typeof options == "undefined" || options == null || typeof options != "object") { options = {}; }
        options.color = options.color || "#ff0000";
        options.width = options.width || 4;
        options.clickable = options.clickable || false;
        options.zIndex = options.zIndex || null;

        var polylineOptions = {
            path: LLObjs,
            map: null,
            strokeColor: options.color,
            strokeWeight: options.width,
            visible: true,
            clickable: options.clickable,
            zIndex: options.zIndex
        };
        var line = new google.maps.Polyline(polylineOptions);
        this.overlaysArr["L"].push(line);
        return line;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.createLine", ex);
    }
};
/*
* 创建区域对象
*LLObjs:经纬度对象数组；color:区域颜色；type:区域类型（（P-点（此处无效），A-区域（自定义区域），L-线（此处无效），O-其他，Lo-定位车辆（此处无效）））；
*/
googleAPI.prototype.createArea = function (LLObjs, options) {
    try {
        if (typeof LLObjs == "undefined" || LLObjs == "" || LLObjs == null) { return; }
        if (typeof options == "undefined" || options == null || typeof options != "object") { options = {}; }
        options.color = options.color || "#ff0000";
        options.type = options.type || "O";

        var area = new google.maps.Polygon({
            fillColor: options.color,
            fillOpacity: 0.35,
            strokeColor: options.color,
            strokeOpacity: 1,
            strokeWeight: 1,
            paths: LLObjs,
            clickable: false
        });
        this.overlaysArr[options.type].push(area);
        return area;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.createArea", ex);
    }
};
/*
* 修改点的经纬度信息
*marker:点对象；newPoint:新的经纬度对象。
*/
googleAPI.prototype.setMarkerPoint = function (marker, newPoint) {
    try {
        marker.lon = newPoint.lng();
        marker.lat = newPoint.lat();
        marker.setPosition(newPoint);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setMarkerPoint", ex);
    }
};
/*
* 返回Marker的经纬度对象
*/
googleAPI.prototype.getLLObjOfMarker = function (marker) {
    try {
        var llObj = null;
        if (marker.latlng != null) { llObj = marker.latlng; }
        else { llObj = marker.position; }
        return llObj;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.getLLObjOfMarker", ex);
    }
};
/*
* 修改点的图标
*marker:点对象；newIcon:新的图标路径
*/
googleAPI.prototype.setMarkerIcon = function (marker, newIcon) {
    try {
        if (typeof marker.changeIcon != "undefined") {
            marker.changeIcon(newIcon);
        }
        else {
            marker.setIcon(newIcon);
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setMarkerIcon", ex);
    }
};
/*
* 修改点的名称
*marker:点对象；newLabelStr:新的名称字符串
*/
googleAPI.prototype.setMarkerLabel = function (marker, newLabelStr) {
    try {
        marker.changeLabel(newLabelStr);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setMarkerLabel", ex);
    }
};
/*
* 设置区域颜色
*area:区域对象；newColor:新的颜色
*/
googleAPI.prototype.setAreaColor = function (area, newColor) {
    try {
        area.setOptions({ fillColor: newColor, strokeColor: newColor });
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setAreaColor", ex);
    }
};
/*
* 设置线颜色
*line:线对象；newColor:新的颜色
*/
googleAPI.prototype.setLineColor = function (line, newColor) {
    try {
        line.setOptions({ strokeColor: newColor });
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setLineColor", ex);
    }
};
/*
* 获取线的经纬度路径
*line:线对象；newColor:新的颜色
*/
googleAPI.prototype.getLinePath = function (line) {
    try {
        var path = line.getPath();
        return path;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.getLinePath", ex);
    }
};
/*
* 创建圆形对象
*cLLObj:中心点经纬度对象（必填）；radius:半径（单位-米，必填）；color:颜色；type:类型（P-点，A-区域（自定义区域），L-线（此处无效），O-其他，Lo-定位车辆（此处无效））。
*/
//googleAPI.prototype.createCircle = function (cLLObj, radius, color, type) {
googleAPI.prototype.createCircle = function (cLLObj, radius, opts) {
    try {
        if (typeof cLLObj == "undefined" || cLLObj == "" || cLLObj == null || typeof radius == "undefined" || radius == "" || radius == null) { return; }
        //        if (typeof color == "undefined" || color == "" || color == null) { color = "#ff0000"; }
        opts.color = opts.color || "#ff0000";
        opts.type = opts.type || "O";
        opts.opacity = opts.opacity || 0.35;
        var circle = new google.maps.Circle({
            center: cLLObj,
            radius: radius,
            fillOpacity: opts.opacity,
            fillColor: opts.color,
            strokeColor: opts.color,
            strokeOpacity: 1,
            strokeWeight: 1,
            clickable: false
        });
        this.overlaysArr[opts.type].push(circle);
        return circle;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.createCircle", ex);
    }
};
/*
* 设置地图绘制模式
*strMode:地图的绘制模式（pan-平移，marker-点，rect-矩形，polygon-多边形）；callbackFunction:回调函数
offsetType:图标的锚点偏移类型（0-以图表的中心点为锚点，1-已图标的底部中心为锚点；默认0。）
*/
var drawCallback_Google = null;
googleAPI.prototype.setDrawMode = function (strMode, callbackFunction, mImgUrl, mWidth, mHeight, offsetType) {
    try {
        drawCallback_Google = null;
        if (typeof strMode == "undefined" || strMode == "" || strMode == null) { return; }
        if (strMode != "pan" && strMode != "marker" && strMode != "rect" && strMode != "polygon" && strMode != "circle") { return; }
        if (typeof callbackFunction == "undefined" || callbackFunction == "" || callbackFunction == null) { callbackFunction = null; }
        if (typeof mImgUrl == "undefined" || mImgUrl == "" || mImgUrl == null) { mImgUrl = ""; }
        if (typeof mWidth == "undefined" || mWidth == "" || mWidth == null) { mWidth = 25; }
        if (typeof mHeight == "undefined" || mHeight == "" || mHeight == null) { mHeight = 25; }
        if (typeof offsetType == "undefined" || offsetType == "" || offsetType == null) { offsetType = 0; }
        drawCallback_Google = callbackFunction;
        InitDrawingManager_Google(mImgUrl, mWidth, mHeight, offsetType);
        switch (strMode) {
            case "pan":
                drawingManager_Google.setOptions({ drawingMode: null });
                break;
            case "marker":
                drawingManager_Google.setOptions({ drawingMode: google.maps.drawing.OverlayType.MARKER });
                break;
            case "rect":
                drawingManager_Google.setOptions({ drawingMode: google.maps.drawing.OverlayType.RECTANGLE });
                break;
            case "polygon":
                drawingManager_Google.setOptions({ drawingMode: google.maps.drawing.OverlayType.POLYGON });
                break;
            case "circle":
                drawingManager_Google.setOptions({ drawingMode: google.maps.drawing.OverlayType.CIRCLE });
                break;
            default: break;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setDrawMode", ex);
    }
};
//DrawingManager
var drawingManager_Google = null;
function InitDrawingManager_Google(mImgUrl, mWidth, mHeight, offsetType) {
    try {
        //if (typeof mImgUrl == "undefined" || mImgUrl == "" || mImgUrl == null) {
        //    mImgUrl = getRootPath() + "/Images/Map/15.png";
        //}
        if (typeof mWidth == "undefined" || mWidth == "" || mWidth == null) { mWidth = 25; }
        if (typeof mHeight == "undefined" || mHeight == "" || mHeight == null) { mHeight = 25; }
        if (typeof offsetType == "undefined" || offsetType == "" || offsetType == null) { offsetType = 0; }
        var iconOffset = { x: 0, y: 0 };
        if (offsetType == 0) {
            iconOffset = { x: parseInt(mWidth) / 2, y: parseInt(mHeight) / 2 };
        }
        else {
            iconOffset = { x: parseInt(mWidth) / 2, y: parseInt(mHeight) };
        }


        drawingManager_Google = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: false,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE
                ]
            },
            circleOptions: styleOptions,
            polylineOptions: styleOptions,
            polygonOptions: styleOptions,
            rectangleOptions: styleOptions
            //markerOptions: {
            //    icon: new google.maps.MarkerImage(mImgUrl, new google.maps.Size(mWidth, mHeight), new google.maps.Point(0, 0), new google.maps.Point(iconOffset.x, iconOffset.y), null),
            //    draggable: true
            //},
            //rectangleOptions: {
            //    fillColor: '#ff0000',
            //    strokeColor: '#ff0000',
            //    fillOpacity: 0.35,
            //    strokeWeight: 1,
            //    clickable: false,
            //    zIndex: 1
            //},
            //polygonOptions: {
            //    fillColor: '#ff0000',
            //    strokeColor: '#ff0000',
            //    fillOpacity: 0.35,
            //    strokeWeight: 2,
            //    clickable: false,
            //    zIndex: 1
            //}
        });
        drawingManager_Google.setMap(GetMapObj().maplet);
        google.maps.event.addListener(drawingManager_Google, 'overlaycomplete', DManagerComplete_Google);
    }
    catch (ex) {
        catchTheException("InitDrawingManager_Google", ex);
    }
};
function DManagerComplete_Google(e) {
    try {
        drawingManager_Google.setOptions({ drawingMode: null });
        //event.overlay
        //if (drawCallback_Google != null) {
        //   // eval("drawCallback_Google(event.overlay)");
        //}
        var result = "";
        //result += e.drawingMode + ":";
        if (e.type == "market") {
            result += e.overlay.GetMapObj().GetPosition().lng + ',' + e.overlay.GetMapObj().GetPosition().lat + "|";
        }
        else if (e.type == "circle") {
            //圆形
            result += e.overlay.center.lng() + "," + e.overlay.center.lat() + "|";
            var point = new google.maps.Point(e.overlay.center.lng(), e.overlay.center.lat());
            if (e.overlay.getRadius() != 0) {
                //判断圆的范围,如果为0则不执行
                $("#mFHotspotRadius").val(e.overlay.radius);
                //AddMarker(point, 0);
                overlays.push(e.overlay);
            } else {
                $("#mFHotspotRadius").val("200");
                var circle = new google.maps.Circle(point, "200", styleOptions); //创建圆
                GetMapObj().maplet.addOverlay(circle);
                //AddMarker(point, 0);
                overlays.push(circle);
            }
        }
        else if (e.type == "polygon") {
            var paths = e.overlay.getPath();
            //alert(paths.length);
            //多边形         
            for (var i = 0; i < paths.length; i++) {
                result += paths.getAt(i).lng() + "," + paths.getAt(i).lat() + "|";
                //var point = new google.maps.Point(paths[i].lng(), paths[i].lat());
                //AddMarker(point, i);
                overlays.push(e.overlay);
            }
        }
        else if (e.type == "rectangle") {
            //方形
            var point0 = e.overlay.bounds.getNorthEast().lng() + "," + e.overlay.bounds.getNorthEast().lat();
            var point2 = e.overlay.bounds.getSouthWest().lng() + "," + e.overlay.bounds.getSouthWest().lat();
            //判断对角坐标如果相同则不执行
            if (point0 != point2) {
                var point1 = e.overlay.bounds.getNorthEast().lng() + "," + e.overlay.bounds.getSouthWest().lat();
                var point3 = e.overlay.bounds.getSouthWest().lng() + "," + e.overlay.bounds.getNorthEast().lat();
                result += point0 + "|" + point1 + "|" + point2 + "|" + point3 + "|";
                overlays.push(e.overlay);
            } else {
                return;
            }
        }
        var temp = result.substr(result.length - 1, result.length);
        if (result.length > 0 && temp == "|") {
            result = result.substr(0, result.length - 1);
        }

        $("#mFCoordinateFence").val(result); //将绘制的覆盖物信息结果输出到结果面板
        // drawingManager.close();
        // SaveAreaDialog();
        //alert(1111)
        if (drawCallback_Google != null) {
            drawCallback_Google();
        }

    }
    catch (ex) {
        catchTheException("DManagerComplete_Google", ex);
    }
};
/*
*创建右键菜单
*/
googleAPI.prototype.createContextMenu = function (nemuStr, widthStr) {
    try {
        //初始化右键菜单，在初始化地图中一并初始化了。  
        var ContextMenuControlDiv = document.createElement('DIV');
        var ContextMenuControl = new createContextMenu(ContextMenuControlDiv, this.maplet, nemuStr, widthStr);

        ContextMenuControlDiv.index = 1;
        /*增加层的方式*/
        this.maplet.controls[google.maps.ControlPosition.TOP_LEFT].push(ContextMenuControlDiv);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.createContextMenu", ex);
    }
};
/*
*创建右键菜单
*/
googleAPI.prototype.setContextMenu = function (myMenu) {
    try {
        /*增加层的方式*/
        this.maplet.controls[google.maps.ControlPosition.TOP_LEFT].push(myMenu.menu);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.setContextMenu", ex);
    }
};
//地图右键菜单
var MapContextMenu = googleAPI.prototype.MapContextMenu = function () {
    try {
        this.menu = document.createElement('div');
        this.menu.zIndex = 9999;
        this.menu.style.visibility = "hidden";
        this.menu.id = "ContextMenuDiv";
        //右键div的详细样式
        this.menu.className = "rMenu";
        this.menu.style.width = "95px";
        this.menuUL = document.createElement('ul');
        this.menu.appendChild(this.menuUL);
        /*给整个地图增加右键事件监听*/
        var that = this;
        google.maps.event.addDomListener(map_Google.maplet, "rightclick", function (event) {
            that.menu.style.position = "absolute";
            that.menu.style.left = (event.pixel.x - 80) + "px"; //平移显示以对应右键点击坐标  
            that.menu.style.top = event.pixel.y + "px";
            that.menu.style.visibility = "visible";
            googleRightX = event.pixel.x;
            googleRightY = event.pixel.y;
        });
        /*点击菜单层中的某一个菜单项，就隐藏菜单*/
        google.maps.event.addDomListener(this.menu, 'click', function () {
            that.menu.style.visibility = "hidden";
        });
        google.maps.event.addDomListener(map_Google.maplet, 'click', function () {
            that.menu.style.visibility = "hidden";
        });
        google.maps.event.addDomListener(map_Google.maplet, 'drag', function () {
            that.menu.style.visibility = "hidden";
        });
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.MapContextMenu", ex);
    }
};
MapContextMenu.prototype.addMenuItem = function (title, callback) {
    try {
        var Li = document.createElement("li");
        if (title == "居中") { Li.className = "last"; }
        var span = document.createElement("span");
        $(span).html(title);
        $(Li).append(span)
            .bind("click", callback);
        this.menuUL.appendChild(Li);
    }
    catch (ex) {
        catchTheException("googleAPI.js的addMenuItem", ex);
    }
};
/*
*监听事件
*/
googleAPI.prototype.addListener = function (obj, sEvent, callbackFun) {
    try {
        return google.maps.event.addListener(obj, sEvent, callbackFun);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addListener", ex);
    }
};
//监听地图Zoom事件
googleAPI.prototype.addZoomListener = function (callbackFun) {
    try {
        return google.maps.event.addListener(this.maplet, "zoom_changed", callbackFun);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addZoomListener", ex);
    }
};
//监听地图的拖动事件
googleAPI.prototype.addMapMoveListener = function (callbackFun) {
    try {
        //        return google.maps.event.addListener(this.maplet, "dragend", callbackFun);
        return google.maps.event.addListener(this.maplet, "bounds_changed", callbackFun);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addMapMoveListener", ex);
    }
};
//监听点Drag事件
googleAPI.prototype.addMarkerDragListener = function (obj, callbackName) {
    try {
        this.markerDragBack.callbackName = callbackName;
        this.markerDragBack.type = obj.type;
        google.maps.event.addListener(obj, "dragend", this.markerDragBack);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addMarkerDragListener", ex);
    }
};
//点拖动回调
googleAPI.prototype.markerDragBack = function (marker) {
    try {
        marker.lon = marker.latLng.lng();
        marker.lat = marker.latLng.lat();
        marker.type = this.type;
        var ll84Obj;
        var ll02Obj;
        if (IsPointInHK(marker.lon, marker.lat)) {
            ll84Obj = { lon: marker.lon, lat: marker.lat };
            ll02Obj = LL84To02(marker.lon, marker.lat);
        }
        else {
            ll84Obj = LL02To84(marker.latLng.lng(), marker.latLng.lat());
            ll02Obj = { lon: marker.lon, lat: marker.lat };
        }
        var rObj = { ll84: ll84Obj, ll02: ll02Obj };
        return eval(googleAPI.prototype.markerDragBack.callbackName + "(rObj,marker)");
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.markerDragBack", ex);
    }
};
//线点击事件
googleAPI.prototype.addLineClickListener = function (obj, callback) {
    try {
        this.lineClickBack.callback = callback;
        this.lineClickBack.lineObj = obj;
        google.maps.event.addListener(obj, "click", this.lineClickBack);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addLineClickListener", ex);
    }
};
googleAPI.prototype.lineClickBack = function (event) {
    try {
        var rObj = { ll84: { lon: 0, lat: 0 }, ll02: { lon: 0, lat: 0 } };
        var lon = event.latLng.lng();
        var lat = event.latLng.lat();

        var ll84Obj;
        var ll02Obj;
        if (IsPointInHK(lon, lat)) {
            ll84Obj = { lon: lon, lat: lat };
            ll02Obj = LL84To02(lon, lat);
        }
        else {
            ll84Obj = LL02To84(lon, lat);
            ll02Obj = { lon: lon, lat: lat };
        }
        rObj.ll84.lon = ll84Obj.lon;
        rObj.ll84.lat = ll84Obj.lat;
        rObj.ll02.lon = ll02Obj.lon;
        rObj.ll02.lat = ll02Obj.lat;
        return eval("googleAPI.prototype.lineClickBack.callback(rObj,googleAPI.prototype.lineClickBack.lineObj)");
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.lineClickBack", ex);
    }
};
//marker点击事件
googleAPI.prototype.addMarkerClick = function (obj, callback, strmode) {
    try {
        this.markerClickBack.callback = callback;
        this.markerClickBack.markerObj = obj;
        google.maps.event.addListener(obj, strmode, this.markerClickBack);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addMarkerClick", ex);
    }
};
googleAPI.prototype.markerClickBack = function (event) {
    try {
        var rObj = { ll84: { lon: 0, lat: 0 }, ll02: { lon: 0, lat: 0 } };
        var lon = event.latLng.lng();
        var lat = event.latLng.lat();

        var ll84Obj;
        var ll02Obj;
        if (IsPointInHK(lon, lat)) {
            ll84Obj = { lon: lon, lat: lat };
            ll02Obj = LL84To02(lon, lat);
        }
        else {
            ll84Obj = LL02To84(lon, lat);
            ll02Obj = { lon: lon, lat: lat };
        }
        rObj.ll84.lon = ll84Obj.lon;
        rObj.ll84.lat = ll84Obj.lat;
        rObj.ll02.lon = ll02Obj.lon;
        rObj.ll02.lat = ll02Obj.lat;
        return eval("googleAPI.prototype.markerClickBack.callback(rObj,googleAPI.prototype.markerClickBack.markerObj)");
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.markerClickBack", ex);
    }
};
//鼠标滑过点事件
googleAPI.prototype.addMarkerMouseoverListener = function (obj, callbackFun) {
    try {
        //        if (obj.divObj == null) {
        //            obj.mouseoverFun = callbackFun;
        //        }
        obj.addMouseoverListener(callbackFun);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addMarkerMouseoverListener", ex);
    }
};
//鼠标Out点事件
googleAPI.prototype.addMarkerMouseoutListener = function (obj, callbackFun) {
    try {
        //        if (obj.divObj == null) {
        //            obj.mouseoutFun = callbackFun;
        //        }
        obj.addMouseoutListener(callbackFun);
        //        google.maps.event.addListener(obj, "mouseout", callbackFun);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addMarkerMouseoutListener", ex);
    }
};
/*
*监听事件
*/
googleAPI.prototype.removeListener = function (handle, obj, sEvent, removeFun) {
    try {
        return google.maps.event.removeListener(handle);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.removeListener", ex);
    }
};
//移除地图缩放事件
googleAPI.prototype.removeZoomListener = function (handle, removeFun) {
    try {
        return google.maps.event.removeListener(handle);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.removeZoomListener", ex);
    }
};
//监听点Drag事件
googleAPI.prototype.removeMarkerDragListener = function (handle, obj, removeFun) {
    try {
        return google.maps.event.removeListener(handle);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.removeMarkerDragListener", ex);
    }
};
/*
*经纬度To像素值
*llObj:{lon:lon,lat:lat}；@return:{x:x,y:y}
*/
googleAPI.prototype.pointToPixel = function (llObj) {
    try {
        var point = new google.maps.LatLng(llObj.lat, llObj.lon);
        var marker = new MyMarker(this.maplet, { latlng: point, image: getRootPath() + "/Images/Map/blank.gif" }, true);

        if (typeof marker.getProjection() == "undefined") {
            this.maplet.setZoom(this.maplet.getZoom());
        }

        var xy = marker.getProjection().fromLatLngToContainerPixel(point);
        marker.setMap(null);
        point = null;
        marker = null;
        return xy;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.pointToPixel", ex);
    }
};
/*
*像素值To经纬度
*@return:{lon:lon,lat:lat}
*/
googleAPI.prototype.pixelToPoint = function (x, y) {
    try {
        var marker = new MyMarker(this.maplet, { latlng: new google.maps.LatLng(23.0000, 113.0000), image: getRootPath() + "/Images/Map/blank.gif" }, true);
        //        marker.setMap(this.maplet);
        var llObj = marker.getProjection().fromContainerPixelToLatLng(new google.maps.Point(x, y));
        marker.setMap(null);
        var rObj = { lon: llObj.lng(), lat: llObj.lat() };
        return rObj;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.pixelToPoint", ex);
    }
};
/*
*获取地图的可视范围
*/
googleAPI.prototype.getViewBounds = function () {
    try {
        var boundsObj = this.maplet.getBounds();
        var neObj = boundsObj.getNorthEast();
        var ne = { lon: neObj.lng(), lat: neObj.lat() };
        var swObj = boundsObj.getSouthWest();
        var sw = { lon: swObj.lng(), lat: swObj.lat() };
        var rObj = { ne: ne, sw: sw };
        return rObj;
    }
    catch (ex) {
        var rObj = { ne: null, sw: null };
        return rObj;
        //        catchTheException("googleAPI.prototype.getViewBounds", ex);
    }
};
/*
*根据bounds，将地图设置为相应的等级及中心点展示
*bounds:{sw:{lon:lon,lat:lat},ne:{lon:lon,lat:lat}}
*/
googleAPI.prototype.fitBounds = function (bounds) {
    try {
        var LatLngBounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.sw.lat, bounds.sw.lon), new google.maps.LatLng(bounds.ne.lat, bounds.ne.lon));
        this.maplet.fitBounds(LatLngBounds);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.fitBounds", ex);
    }
};
/*
*计算距离
*/
googleAPI.prototype.getDistance = function (llObj01, llObj02) {
    try {
        // var length = google.maps.geometry.spherical.computeDistanceBetween(GetMapObj().GetPosition(llObj01.lon, llObj01.lat), GetMapObj().GetPosition(llObj02.lon, llObj02.lat));
        // alert(length);
        //  return length / 1000;
        // var leng=  GetDistance(llObj01.lon, llObj01.lat, llObj02.lon, llObj02.lat);
        // alert(llObj01.lng() + "," + llObj01.lat() + "|" + llObj02.lng() + "," + llObj02.lat());
        // var aa = GetDistance(llObj01.lng(), llObj01.lat(), llObj02.lng(), llObj02.lat());
        // alert(aa);
        return GetDistance(llObj01.lng(), llObj01.lat(), llObj02.lng(), llObj02.lat());
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.getDistance", ex);
    }
};

function GetDistance(lon1, lat1, lon2, lat2) {
    var lat = [lat1, lat2]
    var lng = [lon1, lon2]
    var R = 6378137;
    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
    var dLng = (lng[1] - lng[0]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d);
}

/*
*获取marker对象的地图
*/
googleAPI.prototype.getMapOfMarker = function (marker) {
    try {
        return marker.getMap();
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.getMapOfMarker", ex);
    }
};
/*
*放大边界，使其包含给定的点
*/
googleAPI.prototype.extendBounds = function (llObj, bounds) {
    try {
        var bdBounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.sw.lat, bounds.sw.lon), new google.maps.LatLng(bounds.ne.lat, bounds.ne.lon));
        var point = new google.maps.LatLng(llObj.lat, llObj.lon);
        var exBounds = bdBounds.extend(point);
        var rObj = { sw: { lon: exBounds.getSouthWest().lng(), lat: exBounds.getSouthWest().lat() }, ne: { lon: exBounds.getNorthEast().lng(), lat: exBounds.getNorthEast().lat() } };
        return rObj;
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.extendBounds", ex);
    }
};
/*
*点的点击事件（聚合使用）
*/
googleAPI.prototype.AddMarkerClickListener = function (marker, clickFun) {
    try {
        if (typeof marker.labelText == "undefined") {
            marker.setClickable(true);
            google.maps.event.addListener(marker, 'click', clickFun);
        }
        else {
            marker.addClickListener(clickFun);
        }
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.AddMarkerClickListener", ex);
    }
};
/*
*经纬度是否在某个边界内
*/
googleAPI.prototype.IsLLObjInBounds = function (llObj, bounds) {
    try {
        var bdBounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.sw.lat, bounds.sw.lon), new google.maps.LatLng(bounds.ne.lat, bounds.ne.lon));
        var point = new google.maps.LatLng(llObj.lat, llObj.lon);
        return bdBounds.contains(point);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.IsLLObjInBounds", ex);
    }
};
/*
*创建叠加图层
*/
googleAPI.prototype.createLayer = function (options) { return null; };
/*
*  添加叠加层到地图上
*/
googleAPI.prototype.addLayer = function (layer) { };
/*
*  删除叠加层
*/
googleAPI.prototype.removeLayer = function (layer) { };








/******************************************************/
//overlay = new MyMarker(map, { latlng: new google.maps.LatLng(0, -180), image: "googlemap/images/alarm.gif"});
function MyMarker(map, options, setMap) {
    try {
        // Now initialize all properties.     
        this.latlng = options.latlng; //设置图标的位置
        this.image_ = options.image || getRootPath() + "/Images/Map/15.png";  //设置图标的图片  
        this.image_width = options.width || "25";  //设置图标的图片宽度 
        this.image_height = options.height || "25";  //设置图标的图片宽度 

        this.labelText = options.labelText || '';
        this.labelColor = options.labelColor;  //设置文字的样式  
        this.detail = options.detail || "";
        this.bColor = options.bColor;
        this.labelOffset = options.labelOffset || new google.maps.Size(8, -33);
        this.iconOffset = options.offset || { x: parseInt(this.image_width) / 2, y: parseInt(this.image_height) / 2 };
        this.winWidth = options.winWidth || 260;
        this.winHeight = options.winHeight || 220;
        this.clickFun = options.clickFun || null;
        if (options.enableAutoPan == 'undefined' || options.enableAutoPan == null || options.enableAutoPan) {
            this.enableAutoPan = true;
        } else {
            this.enableAutoPan = false;
        }
        this.map_ = map;
        this.divObj = null;
        this.mouseoverFun = null;
        this.mouseoutFun = null;

        this.div_ = null;
        // Explicitly call setMap() on this overlay

        if (typeof setMap != "undefined" && setMap) {
            this.setMap(map);
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker", ex);
    }
};

MyMarker.prototype = new google.maps.OverlayView();
//初始化图标
MyMarker.prototype.onAdd = function () {
    try {
        // Note: an overlay's receipt of onAdd() indicates that    
        // the map's panes are now available for attaching     
        // the overlay to the map via the DOM.      
        // Create the DIV and set some basic attributes.    
        var div = document.createElement('DIV'); //创建存放图片和文字的div  
        div.style.border = "none";
        div.style.borderWidth = "0px";
        div.style.position = "absolute";
        div.style.zIndex = "999";
        div.className = "mapMarker";
        div.Range = this.Range;
        div.llObj = this.llObj;
        div.AreaColor = this.AreaColor;
        this.divObj = div;
        //            markerObj.Range = markersDataArr[i].Range;
        //            markerObj.llObj = llObj;
        //            markerObj.AreaColor = markersDataArr[i].AreaColor;

        if (this.detail != "") {
            div.style.cursor = "pointer";
            var detail = this.detail;
            div.detail = detail;
            var Latlon = this.latlng;
            div.Latlon = Latlon;
            div.winWidth = this.winWidth;
            div.enableAutoPan = this.enableAutoPan;
            //注册click事件，没有定义就为空函数  
            div.onclick = function () {
                var infoWindowOptions = {
                    content: div.detail,
                    position: div.Latlon,
                    maxWidth: div.winWidth,
                    disableAutoPan: !div.enableAutoPan
                };
                if (infoWin == null) {
                    infoWin = new google.maps.InfoWindow(infoWindowOptions);
                }
                else {
                    infoWin.setOptions(infoWindowOptions);
                }
                infoWin.open(map.maplet);
            };
        }
        else if (this.clickFun != null) {
            div.style.cursor = "pointer";
            div.onclick = this.clickFun;
        }
        //鼠标Over事件
        if (this.mouseoverFun != null) {
            div.onmouseover = this.mouseoverFun;
        }
        //鼠标Out事件
        if (this.mouseoutFun != null) {
            div.onmouseout = this.mouseoutFun;
        }

        // Create an IMG element and attach it to the DIV.    
        var img = document.createElement("img"); //创建图片元素  
        img.src = this.image_;
        img.style.width = this.image_width;
        img.style.height = this.image_height;
        //初始化文字标签  
        //    if (this.labelText != "" && this.labelText != " ") {
        if (this.labelText == " ") { this.labelText = ""; }
        var label = document.createElement('span'); //创建文字标签  
        label.innerHTML = this.labelText;
        label.style.width = 'auto';
        label.style.backgroundColor = this.bColor;
        label.style.color = this.labelColor;
        label.style.borderColor = "#cdcdcd";
        label.style.borderStyle = "solid";
        label.style.fontSize = "12px";
        if (this.labelText != "") {
            label.style.borderWidth = "1px";
            label.style.padding = "1px 2px";
            label.style.marginLeft = "2px";
        }
        else {
            label.style.borderWidth = "0";
            label.style.padding = "0";
            label.style.marginLeft = "0";
        }
        //    }
        div.appendChild(img);
        //    if (this.labelText != "" && this.labelText != " ") { div.appendChild(label); }
        div.appendChild(label);

        this.div_ = div;
        // We add an overlay to a map via one of the map's panes.    
        // We'll add this overlay to the overlayImage pane.    
        var panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.onAdd", ex);
    }
};
//绘制图标，主要用于控制图标的位置
MyMarker.prototype.draw = function () {
    try {
        // Size and position the overlay. We use a southwest and northeast     
        // position of the overlay to peg it to the correct position and size.    
        // We need to retrieve the projection from this overlay to do this.    
        var overlayProjection = this.getProjection();
        // Retrieve the southwest and northeast coordinates of this overlay    
        // in latlngs and convert them to pixels coordinates.    
        // We'll use these coordinates to resize the DIV.    
        var position = overlayProjection.fromLatLngToDivPixel(this.latlng);   //将地理坐标转换成屏幕坐标  
        if (position == null) { return; }
        //  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());      
        // Resize the image's DIV to fit the indicated dimensions.     
        var div = this.div_;
        ////        div.style.left = position.x - parseInt(this.image_width.replace("px", "")) / 2 + 'px';
        ////        div.style.top = position.y - parseInt(this.image_height.replace("px", "")) + 'px';
        div.style.left = position.x - this.iconOffset.x + 'px';
        div.style.top = position.y - this.iconOffset.y + 'px';
        //控制图标的大小  
        div.style.width = this.image_width;
        div.style.height = this.image_height;
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.draw", ex);
    }
};
MyMarker.prototype.onRemove = function () {
    try {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.onRemove", ex);
    }
};
MyMarker.prototype.setPosition = function (latlng) {
    try {
        this.setMap(null);
        this.latlng = latlng;
        this.setMap(this.map_);
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.setPosition", ex);
    }
};
//Note that the visibility property must be a string enclosed in quotes
MyMarker.prototype.hide = function () {
    try {
        if (this.div_) {
            this.div_.style.visibility = "hidden";
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.hide", ex);
    }
};
MyMarker.prototype.show = function () {
    try {
        if (this.div_) {
            this.div_.style.visibility = "visible";
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.show", ex);
    }
};
//显示或隐藏图标
MyMarker.prototype.toggle = function () {
    try {
        if (this.div_) {
            if (this.div_.style.visibility == "hidden") {
                this.show();
            } else {
                this.hide();
            }
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.toggle", ex);
    }
};
//去掉图标留下名称
MyMarker.prototype.removeIconLeaveLabel = function () {
    try {
        if (this.div_ && this.div_.firstChild) {
            //        this.div_.firstChild.src = "../Images_New/icon/blank.gif";
            //        this.div_.firstChild.width = "2px";
            //        this.div_.firstChild.height = "2px";
            this.div_.removeChild(this.div_.firstChild);
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.removeIconLeaveLabel", ex);
    }
};
//修改图片
MyMarker.prototype.changeIcon = function (icon) {
    try {
        if (this.div_ && this.div_.firstChild) {
            this.div_.firstChild.src = icon;
        }
        else if (this.image_) {
            this.image_ = icon;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.changeIcon", ex);
    }
};
//修改Label
MyMarker.prototype.changeLabel = function (labelStr) {
    try {
        if (this.div_ && this.div_.children[1] && this.div_.children[1]) {
            this.div_.children[1].innerHTML = labelStr;
            if (labelStr != "") {
                this.div_.children[1].style.borderWidth = "1px";
                this.div_.children[1].style.padding = "2px";
                this.div_.children[1].style.marginLeft = "2px";
            }
            else {
                this.div_.children[1].style.borderWidth = "0";
                this.div_.children[1].style.padding = "0";
                this.div_.children[1].style.marginLeft = "0";
            }
        }
        else {
            this.labelText = labelStr;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.changeLabel", ex);
    }
};
//绑定信息窗口
MyMarker.prototype.bindInfoWindowHtml = function (detail) {
    try {
        if (this.div_) {
            var lonlat = this.latlng;
            var winWidth = this.winWidth;
            this.div_.lonlat = lonlat;
            this.div_.winWidth = winWidth;
            this.div_.enableAutoPan = this.enableAutoPan;
            //注册click事件，没有定义就为空函数  
            this.div_.onclick = function () {
                var infoWindowOptions = {
                    content: detail,
                    position: this.lonlat,
                    maxWidth: this.winWidth,
                    disableAutoPan: !this.enableAutoPan
                };
                if (infoWin == null) {
                    infoWin = new google.maps.InfoWindow(infoWindowOptions);
                }
                else {
                    infoWin.setOptions(infoWindowOptions);
                }
                infoWin.open(map.googlemapAPI);
            };
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.bindInfoWindowHtml", ex);
    }
};
MyMarker.prototype.addClickListener = function (fun) {
    try {
        if (this.div_) {
            this.div_.onclick = fun;
        }
        else {
            this.clickFun = fun;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.addClickListener", ex);
    }
};
MyMarker.prototype.addMouseoverListener = function (fun) {
    try {
        if (this.div_) {
            this.div_.onmouseover = fun;
        }
        else {
            this.mouseoverFun = fun;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.addMouseoverListener", ex);
    }
};
MyMarker.prototype.addMouseoutListener = function (fun) {
    try {
        if (this.div_) {
            this.div_.onmouseout = fun;
        }
        else {
            this.mouseoutFun = fun;
        }
    }
    catch (ex) {
        catchTheException("googleAPI.js的MyMarker.prototype.addMouseoutListener", ex);
    }
};

/*
*Google测距
*/
var mousemoveIconM = null;
var mousemoveEvent = null;
var mapclickEvent = null;
var mapdbclickEvent = null;
var measureMarkerArr = new Array();
var measurePointArr = new Array();
var measureLine = null;
var moveLine = null;
var deleMarker = null;
function GoogleMeasure() {
    try {
        var map = GetMapObj();
        //   $("#").style.cursor = "url()";
        // $(this).removeClass("closeTree");
        // $("#container").addClass("MeasureCursor");
        map.maplet.setOptions({ disableDoubleClickZoom: true });
        //监听鼠标移动事件

        mousemoveEvent = google.maps.event.addListener(map.maplet, 'mousemove', function (event) {
            if (mousemoveIconM == null) {
                var markerOptions = {
                    latlng: event.latLng,
                    image: getRootPath() + "ruler.png",
                    width: "29px",
                    height: "21px",
                    labelText: "双击结束",
                    detail: null,
                    labelColor: "black",
                    bColor: "white",
                    draggable: false,
                    labelOffset: new google.maps.Size(19 / 2, 19 / 2)
                };

                mousemoveIconM = new MyMarker(map.maplet, markerOptions);
                mousemoveIconM.setMap(map.maplet);
            }
            else {
                mousemoveIconM.setMap(null);
                mousemoveIconM = null;
                var markerOptions = {
                    latlng: event.latLng,
                    image: getRootPath() + "ruler.png",
                    width: "29px",
                    height: "21px",
                    labelText: "双击结束",
                    detail: null,
                    labelColor: "black",
                    bColor: "white",
                    draggable: false,
                    labelOffset: new google.maps.Size(19 / 2, 19 / 2)
                };
                mousemoveIconM = new MyMarker(map.maplet, markerOptions);
                mousemoveIconM.setMap(map.maplet);
            }
            if (measurePointArr.length > 0) {
                if (moveLine != null) { moveLine.setMap(null); }
                var moveLineOptions = {
                    path: [measurePointArr[measurePointArr.length - 1], event.latLng],
                    strokeColor: "#FF0000",
                    strokeWeight: 2.0,
                    visible: true,
                    clickable: false
                };
                moveLine = new google.maps.Polyline(moveLineOptions);
                moveLine.setMap(map.maplet);
            }
        });
        //监听鼠标点击事件
        mapclickEvent = google.maps.event.addListener(map.maplet, "click", function (event) {
            //计算距离
            var oneM = measureMarkerArr.length == 0 ? mousemoveIconM : measureMarkerArr[measureMarkerArr.length - 1];
            var dis = map.getDistance({ lon: oneM.latlng.lng(), lat: oneM.latlng.lat() }, { lon: event.latLng.lng(), lat: event.latLng.lat() }) / 1000;
            var markerOptions = {
                latlng: event.latLng,
                image: getRootPath() + "circle.png",
                width: "12px",
                height: "12px",
                labelText: dis + "公里",
                detail: null,
                labelColor: "black",
                bColor: "white",
                draggable: false,
                labelOffset: new google.maps.Size(19 / 2, 19 / 2)
            };
            var mMarker = new MyMarker(map.maplet, markerOptions);
            mMarker.setMap(map.maplet);
            measureMarkerArr.push(mMarker);
            measurePointArr.push(event.latLng);

            var polylineOptions = {
                path: measurePointArr,
                strokeColor: "#FF0000",
                strokeWeight: 2.0,
                visible: true,
                clickable: false
            };

            if (measureLine != null) {
                measureLine.setMap(null);
            }
            if (measurePointArr.length > 1) {
                measureLine = new google.maps.Polyline(polylineOptions);
                measureLine.setMap(map.maplet);
            }
        });
        //监听鼠标双击事件
        mapdbclickEvent = google.maps.event.addListener(map.maplet, "dblclick", function (event) {
            //创建删除点
            var markerOptions = {
                latlng: event.latLng,
                image: getRootPath() + "x.png",
                width: "12px",
                height: "12px",
                labelText: null,
                detail: null,
                labelColor: "black",
                bColor: "white",
                draggable: false,
                labelOffset: new google.maps.Size(-5, -5),
                clickFun: closeMeasure
            };
            deleMarker = new MyMarker(map.maplet, markerOptions);
            deleMarker.setMap(map.maplet);
            //清除相关事件
            google.maps.event.removeListener(mousemoveEvent);
            mousemoveEvent = null;
            google.maps.event.removeListener(mapclickEvent);
            mapclickEvent = null;
            google.maps.event.removeListener(mapdbclickEvent);
            mapdbclickEvent = null;
            mousemoveIconM.setMap(null);
            mousemoveIconM = null;
            setTimeout(function () { map.maplet.setOptions({ disableDoubleClickZoom: false }); }, 500);
        });
    }
    catch (ex) {
        catchTheException("GoogleMeasure", ex);
    }
};

function getRootPath() {
    return "/assets/xjaddpic/";
}

function closeMeasure() {
    try {
        for (var i = 0; i < measureMarkerArr.length; i++) {
            measureMarkerArr[i].setMap(null);
        }
        measureMarkerArr = new Array();
        measurePointArr = new Array();
        if (measureLine != null) { measureLine.setMap(null); measureLine = null; }
        if (moveLine != null) { moveLine.setMap(null); moveLine = null; }
        if (deleMarker != null) { deleMarker.setMap(null); deleMarker = null; }
    }
    catch (ex) {
        catchTheException("closeMeasure", ex);
    }
};

//添加线路的mouseover事件
googleAPI.prototype.addMouseoverListener = function (obj, callbackFun) {
    try {
        this.mouseoverBack.callback = callbackFun;
        //this.mouseoverBack.obj = obj;
        google.maps.event.addListener(obj, "mouseover", this.mouseoverBack);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addMouseoverListener", ex);
    }
};
googleAPI.prototype.mouseoverBack = function (event) {
    try {
        var rObj = { ll84: { lon: 0, lat: 0 }, ll02: { lon: 0, lat: 0 } };
        var lon = event.latLng.lng();
        var lat = event.latLng.lat();

        var ll84Obj;
        var ll02Obj;
        if (IsPointInHK(lon, lat)) {
            ll84Obj = { lon: lon, lat: lat };
            ll02Obj = LL84To02(lon, lat);
        }
        else {
            ll84Obj = LL02To84(lon, lat);
            ll02Obj = { lon: lon, lat: lat };
        }
        rObj.ll84.lon = ll84Obj.lon;
        rObj.ll84.lat = ll84Obj.lat;
        rObj.ll02.lon = ll02Obj.lon;
        rObj.ll02.lat = ll02Obj.lat;
        return eval("googleAPI.prototype.mouseoverBack.callback(rObj,this)");
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.mouseoverBack", ex);
    }
};
googleAPI.prototype.addMouseoutListener = function (obj, callbackFun) {
    try {
        google.maps.event.addListener(obj, "mouseout", callbackFun);
    }
    catch (ex) {
        catchTheException("googleAPI.prototype.addMouseoutListener", ex);
    }
};