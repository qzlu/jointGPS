function baiduAPI() {
    try {
        this.maplet = null;
        this.mapName = "baidu";
        this.mapLevelDistance = [2000, 1000, 500, 200, 100, 50, 25, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02];
        this.disTool = null;
        this.mapLevel = new Array();
        this.mapLevel["全国"] = 5;
        this.mapLevel["省"] = 7;
        this.mapLevel["市"] = 12;
        this.mapLevel["区"] = 14;
        this.traffic = null;
        this.naviControl = null;
        this.overviewControl = null;
        this.LEVELD_ISTANCE = {
            5: "500km",
            6: "200km",
            7: "100km",
            8: "50km",
            9: "25km",
            10: "20km",
            11: "10km",
            12: "5km",
            13: "2km",
            14: "1km",
            15: "500m",
            16: "200m",
            17: "100m",
            18: "50m"
        }
    } catch (ex) {
        catchTheException("baiduAPI", ex)
    }
};
baiduAPI.prototype.IndexInitBaidu = function (mDiv) {
    try {
        this.maplet = new BMap.Map(mDiv, {
            minZoom: 5,
            maxZoom: 18
        });


        var llArr = null;
        this.maplet.enableScrollWheelZoom();
        this.naviControl = new BMap.NavigationControl();
        this.maplet.addControl(this.naviControl);
        this.maplet.addControl(new BMap.ScaleControl());
        this.overviewControl = new BMap.OverviewMapControl();
        this.maplet.addControl(this.overviewControl);
        try {

            var myDis = new BMapLib.DistanceTool(this.maplet);
        } catch (ex) { }
    } catch (ex) {

        catchTheException("baiduAPI.prototype.IndexInitBaidu", ex)
    }
};

baiduAPI.prototype.InitBaidu = function (mDiv, dCity, level) {
    try {
        this.maplet = new BMap.Map(mDiv, {
            minZoom: 5,
            maxZoom: 18
        });
        if (typeof level == "undefined" || level == null || level == "") {
            level = 12
        }
        if (typeof dCity != "undefined" && dCity != null && dCity != "") {
            this.maplet.centerAndZoom(dCity, level)
            //var llArr = dCity.split(",");
           // this.maplet.centerAndZoom(new BMap.Point(llArr[1], llArr[0]), level)
        } else {
            this.maplet.centerAndZoom("深圳", level)
        }
        var llArr = null;
        this.maplet.enableScrollWheelZoom();
        this.naviControl = new BMap.NavigationControl();
        this.maplet.addControl(this.naviControl);
        this.maplet.addControl(new BMap.ScaleControl());
        this.overviewControl = new BMap.OverviewMapControl();
        this.maplet.addControl(this.overviewControl);
        try {

            var myDis = new BMapLib.DistanceTool(this.maplet);
        } catch (ex) { }
    } catch (ex) {

        catchTheException("baiduAPI.prototype.InitBaidu", ex)
    }
};
baiduAPI.prototype.getMapObject = function () {
    try {
        return this.maplet;
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getMapObject", ex)
    }
};
baiduAPI.prototype.GetPosition = function (lng, lat) {
    return new BMap.Point(lng, lat);
}
baiduAPI.prototype.GetMarker = function () {
    var marker = new BMap.Marker();
    return marker;
}

baiduAPI.prototype.GetMarkerAndDrag = function () {
    var marker = new BMap.Marker();
    marker.enableDragging();
    return marker;
}


baiduAPI.prototype.addPointMarker = function (point) {
    var marker = new BMap.Marker(point);
    return marker;
}


//用户自定义图标
baiduAPI.prototype.userDefinedMarker = function (Iconurl, point) {
    var Icon = new BMap.Icon(Iconurl, new BMap.Size(32, 32));
    var marker = new BMap.Marker(point, { icon: Icon });
    return marker;
}

baiduAPI.prototype.GetIcon = function (Iconurl, imgSize, offsetSize, imageOffsetSize) {
    var Icon = new BMap.Icon(Iconurl,
         imgSize, {
             offset: offsetSize,
             imageOffset: imageOffsetSize
         });
    return Icon;
}

//marker label 无单击事件
baiduAPI.prototype.SetLabel = function (point, iconUrl, showinfo,zIndex) {
    var icon = GetMapObj().GetIcon(iconUrl, GetMapObj().GetSizeObject(32, 32), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));

    var marker = new BMap.Marker();
    marker.zIndex = zIndex;
    marker.setIcon(icon);
    marker.setPosition(point);
    GetMapObj().addOverlay(marker);
    var label = new BMap.Label(showinfo, { offset: new BMap.Size(30, 3) });
    label.setStyle({//给label设置样式，任意的CSS都是可以的
        border: "0",
        cursor: "pointer",
        padding: "3px"
    });
    marker.setLabel(label);
    return marker;
}

var markerO;
//marker label 无单击事件并只有图标
baiduAPI.prototype.SetOnlyIconLabel = function (point, iconUrl, showinfo) {
    var icon = GetMapObj().GetIcon(iconUrl, GetMapObj().GetSizeObject(32, 32), GetMapObj().GetSizeObject(0, 0), GetMapObj().GetSizeObject(0, 0));
    GetMapObj().removeOverlay(markerO);
    markerO = new BMap.Marker();
    markerO.zIndex = "100";
    markerO.setIcon(icon);
    markerO.setPosition(point);
    GetMapObj().addOverlay(markerO);
    var label = new BMap.Label(showinfo, { offset: new BMap.Size(30, 3) });
    label.setStyle({//给label设置样式，任意的CSS都是可以的
        border: "0",
        cursor: "pointer",
        padding: "3px"
    });
    markerO.setLabel(label);
    return markerO;
}


//marker label 有单击事件
baiduAPI.prototype.SetInLabel = function (marker, icon, point, label, json, obj, tempMonitor, tireMonitor) {
    marker.setIcon(icon);
    marker.setPosition(point);
    marker.setLabel(baiduAPI.prototype.GetLabel(label));
    marker.json = JSON.stringify(json);
    marker.tempMonitor = JSON.stringify(tempMonitor);
    marker.tireMonitor = JSON.stringify(tireMonitor),
    marker.id = json.mFObjectID;
    //添加单击监听事件
    marker.addEventListener("click", obj);
    //添加到地图
    this.maplet.addOverlay(marker);
    return marker;
}


//marker 单击后显示的infowindow
baiduAPI.prototype.OpenMarkerInfoWindow = function (sContent, CarMarker) {
    var infoWindow = new BMap.InfoWindow(sContent, CarMarker); // 创建信息窗口对象
    infoWindow.height = 100;
    CarMarker.openInfoWindow(infoWindow);
}

//获取Geocoder对象
baiduAPI.prototype.GetClientGeocoder = function () {
    return new BMap.Geocoder();
}

//调用Geoc => getLocation函数
baiduAPI.prototype.Geoco_GetLocation = function (geoc, point, callBack_Geoc) {
    geoc.getLocation(point, callBack_Geoc);
}

//setViewport函数,设置所有锚点最佳试图
baiduAPI.prototype.SetViewport = function (points, zoom) {

    var view = this.maplet.getViewport(points);
    var mapZoom;
    if (points.length > 1) {
        mapZoom = (view.zoom)-1;
    } else {
        mapZoom = zoom;
    }
    //var mapZoom = view.zoom;
    var centerPoint = view.center;
    this.setMapCenter(centerPoint);
    this.setZoom(mapZoom);
}

//搜索附近关键字
baiduAPI.prototype.GetSearchBykeWord = function (local, keyWord) {
    local.search(keyWord);
}

//创建LocalSearch实例
baiduAPI.prototype.GetLocalSearchObject = function (options) {
    var local = new BMap.LocalSearch(this.maplet, options);
    return local;
}

//设置默认鼠标指针样式
baiduAPI.prototype.setDefaultCursor = function (cursor) {
    this.maplet.setDefaultCursor(cursor);
}

//添加marker监听事件
baiduAPI.prototype.setMarkerEventListener = function (marker, strmode, callbackFun) {
    marker.addEventListener(strmode, callbackFun);
}

//添加监听事件
baiduAPI.prototype.addEventListener = function (strMode, callbackFun) {
    this.maplet.addEventListener(strMode, callbackFun);
}

//删除监听事件
baiduAPI.prototype.removeEventListener = function (strMode, callbackFun) {
    this.maplet.removeEventListener(strMode, callbackFun);
}

//获取point根据事件
baiduAPI.prototype.getPointByEvent = function (event) {
    return event.point;
}

//开启Dragging事件
baiduAPI.prototype.enableDragging = function (markerObj) {
    markerObj.enableDragging();
}


//创建驾驶路线对象
baiduAPI.prototype.CreateDrivingRoute = function (SearchComplete, polyLineSet) {
    return new BMap.DrivingRoute(this.maplet, {
        renderOptions: { map: this.maplet, enableDragging: true, autoViewport: true },
        onSearchComplete: SearchComplete,
        onPolylinesSet: polyLineSet
    });
}

//查询路线
baiduAPI.prototype.DrivingSearch = function (driving, Mark_start, Mark_End, waypoints) {
    if (typeof waypoints == "undefined" || waypoints == "" || waypoints == null) {
        driving.search(Mark_start, Mark_End);
    } else {
        driving.search(Mark_start, Mark_End, { waypoints: waypoints });
    }
}

//根据条件获取Lng/Lat
baiduAPI.prototype.getLngOrLat = function (type, obj, index) {
    if (type == "e.lng") {
        return obj.target.getPosition().lng;
    } else if (type == "e.lat") {
        return obj.target.getPosition().lat;
    } else if (type == "overlay.lng") {
        return obj.getPath()[index].lng;
    } else if (type == "overlay.lat") {
        return obj.getPath()[index].lat;
    } else if (type == "p.lng") {
        return obj.lng;
    } else if (type == "p.lat") {
        return obj.lat;
    }
}

baiduAPI.prototype.GetSizeObject = function (num1, num2) {
    return new BMap.Size(num1, num2);
}
baiduAPI.prototype.GetLabel = function (context) {
    var label = new BMap.Label(context, { offset: new BMap.Size(30, 3) });
    label.setStyle({ borderColor: "#a3a3a3", fontSize: "12px", color: "#a3a3a3" });
    return label;
}
baiduAPI.prototype.openTraffic = function () {
    try {
        this.traffic = new BMap.TrafficLayer();
        this.maplet.addTileLayer(this.traffic)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.openTraffic", ex)
    }
};
baiduAPI.prototype.closeTraffic = function () {
    try {
        if (this.traffic != null) {
            this.maplet.removeTileLayer(this.traffic);
            this.traffic = null
        }
    } catch (ex) {
        catchTheException("baiduAPI.prototype.closeTraffic", ex)
    }
};
baiduAPI.prototype.changeMapType = function (type) {
    try {
        if (type == 0) {
            this.maplet.setMapType(BMAP_NORMAL_MAP)
        } else {
            this.maplet.setMapType(BMAP_HYBRID_MAP)
        }
    } catch (ex) {
        catchTheException("baiduAPI.prototype.changeMapType", ex)
    }
};
baiduAPI.prototype.ZoomIn = function () {
    try {
        this.maplet.zoomIn()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.ZoomIn", ex)
    }
};
baiduAPI.prototype.ZoomOut = function () {
    try {
        this.maplet.zoomOut()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.ZoomOut", ex)
    }
};
baiduAPI.prototype.Move = function () {
    try {
        if (this.disTool != null) {
            this.disTool.close()
        }
        this.setDrawMode("pan", null)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.Move", ex)
    }
};
baiduAPI.prototype.Measure = function () {
    try {
        this.disTool = new BMapLib.DistanceTool(this.maplet, {
            "lineStroke": 3,
            "opacity": 0.7,
            "lineColor": "#ff0000"
        });
        this.disTool.open()
    } catch (ex) {
        addScript("baiduDistanceTool.js");
        setTimeout(function () {
            this.disTool = new BMapLib.DistanceTool(this.maplet, {
                "lineStroke": 3,
                "opacity": 0.7,
                "lineColor": "#ff0000"
            });
            this.disTool.open()
        }, 1000);
        catchTheException("baiduAPI.prototype.Measure", ex)
    }
};
baiduAPI.prototype.setZoom = function (level) {
    try {
        if (typeof (level) == 'undefined' || level == '' || level == null) return;
        this.maplet.setZoom(level)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setZoom", ex)
    }
};
baiduAPI.prototype.getZoom = function () {
    try {
        return this.maplet.getZoom()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getZoom", ex)
    }
};
baiduAPI.prototype.setMapCenter = function (llObj) {
    try {
        if (typeof IsSetLockMap != "undefined") {
            IsSetLockMap = false
        }
        this.maplet.setCenter(llObj)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setMapCenter", ex)
    }
};
baiduAPI.prototype.setMapCenterAndZoom = function (lat, lng, level) {
    try {
        if (typeof IsSetLockMap != "undefined") {
            IsSetLockMap = false;
        }
        var point = new BMap.Point(lat, lng);
        this.maplet.centerAndZoom(point, level);
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setMapCenter", ex)
    }
};
baiduAPI.prototype.getMapCenter = function () {
    try {
        var centerPoint = this.maplet.getCenter();
        var rObj = {
            lon: centerPoint.lng,
            lat: centerPoint.lat
        };
        return rObj
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getMapCenter", ex)
    }
};
baiduAPI.prototype.createMPoint = function (lon, lat) {
    try {
        return new BMap.Point(lon, lat)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.createMPoint", ex)
    }
};
baiduAPI.prototype.addOverlay = function (overLay) {
    try {
        if (typeof overLay == "undefined" || overLay == null) {
            return
        }
        this.maplet.addOverlay(overLay);
        if (overLay.myLabel != null) {
            overLay.setLabel(overLay.myLabel)
        }
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addOverlay", ex)
    }
};
baiduAPI.prototype.removeOverlay = function (overLay) {
    try {
        this.maplet.removeOverlay(overLay)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.removeOverlay", ex)
    }
};
baiduAPI.prototype.openInfoWindow = function (overLay) {
    try {
        overLay.winWidth = overLay.winWidth || 260;
        overLay.winHeight = overLay.winHeight || 220;
        if (overLay.enableAutoPan == 'undefined' || overLay.enableAutoPan == null || overLay.enableAutoPan) {
            overLay.enableAutoPan = true
        } else {
            overLay.enableAutoPan = false
        }
        var infoWin = new BMap.InfoWindow(overLay.winDetails, {
            enableMessage: false,
            title: overLay.winTitle,
            width: overLay.winWidth,
            height: overLay.winHeight,
            enableAutoPan: overLay.enableAutoPan
        });
        overLay.openInfoWindow(infoWin)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.openInfoWindow", ex)
    }
};
baiduAPI.prototype.closeInfoWindow = function () {
    try {
        this.maplet.closeInfoWindow();
        try {
            closeClusterWin(false)
        } catch (ex) { }
    } catch (ex) {
        catchTheException("baiduAPI.prototype.closeInfoWindow", ex)
    }
};
baiduAPI.prototype.cleanMap = function () {
    try {
        this.maplet.clearOverlays();
        this.maplet.closeInfoWindow()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.cleanMap", ex)
    }
};
baiduAPI.prototype.pushOverlayToArr = function (overlay, type) { };
baiduAPI.prototype.clearMarkerArr = function () { };
baiduAPI.prototype.clearAreaArr = function () { };
baiduAPI.prototype.clearAreaArr = function () { };
baiduAPI.prototype.mapResize = function (width, height) {
    try {
        this.maplet.checkResize()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.mapResize", ex)
    }
};
baiduAPI.prototype.createMarker = function (llObj, options) {
    try {
        if (typeof llObj == "undefined" || llObj == "" || llObj == null) {
            return
        }
        if (typeof options == "undefined" || options == null || typeof options != "object") {
            options = {}
        }
        options.icon = options.icon || getRootPath() + "/Images/Map/15.png";
        options.name = options.name || "";
        options.winDetails = options.winDetails || null;
        options.color = options.color || "#ffffff";
        options.fontColor = options.fontColor || "#000000";
        options.isDrag = options.isDrag || false;
        options.width = options.width || 25;
        options.height = options.height || 25;
        options.winTitle = options.winTitle || "";
        options.winTitle = options.winTitle.toString();
        options.offsetType = options.offsetType || 0;
        options.winWidth = options.winWidth || 260;
        options.winHeight = options.winHeight || 220;
        if (options.enableAutoPan == 'undefined' || options.enableAutoPan == null || options.enableAutoPan) {
            options.enableAutoPan = true
        } else {
            options.enableAutoPan = false
        }
        var iconOffset = {
            x: 0,
            y: 0
        };
        if (options.offsetType == 0) {
            iconOffset = {
                x: 0,
                y: 0
            }
        } else {
            iconOffset = {
                x: 0,
                y: (options.height / 2) * (-1)
            }
        }
        var myIcon = new BMap.Icon(options.icon, new BMap.Size(parseInt(options.width), parseInt(options.height)));
        myIcon.imageSize = new BMap.Size(parseInt(options.width), parseInt(options.height));
        var marker = new BMap.Marker(llObj, {
            offset: new BMap.Size(iconOffset.x, iconOffset.y),
            icon: myIcon,
            enableDragging: options.isDrag
        });
        if (options.winDetails != "" && options.winDetails != null) {
            marker.addEventListener("click", function () {
                var infoWin = new BMap.InfoWindow(this.winDetails, {
                    enableMessage: false,
                    title: this.winTitle,
                    width: options.winWidth,
                    height: options.winHeight,
                    enableAutoPan: options.enableAutoPan
                });
                infoWin.winWidth = options.winWidth;
                infoWin.winHeight = options.winHeight;
                infoWin.enableAutoPan = options.enableAutoPan;
                this.openInfoWindow(infoWin)
            })
        }
        if (options.name != "" && options.name != " " && options.name != null) {
            if (options.icon.indexOf("blank") >= 0) {
                var myLabel = new BMap.Label(options.name, {
                    offset: new BMap.Size(0, 0),
                    position: llObj
                });
                myLabel.setStyle({
                    color: options.fontColor,
                    borderWidth: "1px",
                    borderColor: "#cdcdcd",
                    backgroundColor: options.color
                });
                myLabel.addEventListener("click", function () {
                    var infoWin = new BMap.InfoWindow(marker.winDetails, {
                        enableMessage: false,
                        title: marker.winTitle,
                        width: options.winWidth,
                        height: options.winHeight,
                        enableAutoPan: options.enableAutoPan
                    });
                    infoWin.winWidth = options.winWidth;
                    options.winHeight = options.winHeight;
                    infoWin.enableAutoPan = options.enableAutoPan;
                    marker.openInfoWindow(infoWin)
                })
            } else {
                var myLabel = new BMap.Label(options.name, {
                    offset: new BMap.Size((options.width + 2), (options.height / 2 - 10))
                });
                myLabel.setStyle({
                    color: options.fontColor,
                    borderWidth: "1px",
                    borderColor: "#cdcdcd",
                    backgroundColor: options.color
                })
            }
            marker.myLabel = myLabel
        } else {
            marker.myLabel = null
        }
        marker.winDetails = options.winDetails;
        marker.winTitle = options.winTitle;
        marker.lon = llObj.lng;
        marker.lat = llObj.lat;
        marker.name = options.name;
        marker.fontColor = options.fontColor;
        marker.color = options.color;
        marker.width = options.width;
        marker.setTop(true);
        return marker
    } catch (ex) {
        catchTheException("baiduAPI.prototype.createMarker", ex)
    }
};
baiduAPI.prototype.createLine = function (LLObjs, options) {
    try {
        if (typeof LLObjs == "undefined" || LLObjs == "" || LLObjs == null) {
            return
        }
        if (typeof options == "undefined" || options == null || typeof options != "object") {
            options = {}
        }
        options.color = options.color || "#ff0000";
        options.width = options.width || 4;
        options.IsArrow = options.IsArrow || false;
        options.strokeStyle = options.strokeStyle || "solid";
        options.clickable = options.clickable || false;
        options.strokeOpacity = options.strokeOpacity || 1;
        return new BMap.Polyline(LLObjs, {
            strokeColor: options.color,
            strokeWeight: options.width,
            strokeStyle: options.strokeStyle,
            enableClicking: options.clickable,
            strokeOpacity: options.strokeOpacity
        })
    } catch (ex) {
        catchTheException("baiduAPI.prototype.createLine", ex)
    }
};
baiduAPI.prototype.createArea = function (LLObjs, options) {
    try {
        if (typeof LLObjs == "undefined" || LLObjs == "" || LLObjs == null) {
            return
        }
        if (typeof options == "undefined" || options == null || typeof options != "object") {
            options = {}
        }
        options.color = options.color || "#ff0000";
        var area = new BMap.Polygon(LLObjs, {
            strokeColor: options.color,
            strokeWeight: 1,
            fillOpacity: 0.35,
            fillColor: options.color,
            enableClicking: false,
            strokeStyle: "solid"
        });
        return area
    } catch (ex) {
        catchTheException("baiduAPI.prototype.createArea", ex)
    }
};
baiduAPI.prototype.setMarkerPoint = function (marker, newPoint) {
    try {
        // marker.lon = newPoint.lng;
        // marker.lat = newPoint.lat;
        marker.setPosition(newPoint)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setMarkerPoint", ex)
    }
};
baiduAPI.prototype.getLLObjOfMarker = function (marker) {
    try {
        return marker.getPosition()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getLLObjOfMarker", ex)
    }
};
baiduAPI.prototype.setMarkerIcon = function (marker, newIcon) {
    try {
        //  marker.setIcon(new BMap.Icon(newIcon, marker.getIcon().size))
        marker.setIcon(newIcon);
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setMarkerIcon", ex)
    }
};
baiduAPI.prototype.setMarkerLabel = function (marker, newLabelStr) {
    try {
        if (marker.getLabel() == null) {
            var myLabel = new BMap.Label(newLabelStr, {
                offset: new BMap.Size(marker.width + 2, 0)
            });
            myLabel.setStyle({
                color: marker.fontColor,
                borderWidth: "1px",
                borderColor: "#cdcdcd",
                backgroundColor: marker.color
            });
            marker.setLabel(myLabel);
            marker.setTop(true)
        } else {
            if (newLabelStr == "") {
                this.removeOverlay(marker);
                this.addOverlay(marker)
            } else {
                marker.getLabel().setContent(newLabelStr)
            }
        }
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setMarkerLabel", ex)
    }
};
baiduAPI.prototype.setAreaColor = function (area, newColor) {
    try {
        area.setFillColor(newColor);
        area.setStrokeColor(newColor)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setAreaColor", ex)
    }
};
baiduAPI.prototype.setLineColor = function (line, newColor) {
    try {
        line.setStrokeColor(newColor)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setLineColor", ex)
    }
};
baiduAPI.prototype.getLinePath = function (line) {
    try {
        var path = line.getPath();
        return path
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getLinePath", ex)
    }
};
baiduAPI.prototype.createCircle = function (cLLObj, radius, opts) {
    try {
        if (typeof cLLObj == "undefined" || cLLObj == "" || cLLObj == null || typeof radius == "undefined" || radius == "" || radius == null) {
            return
        }
        opts.color = opts.color || "#ff0000";
        opts.opacity = opts.opacity || 0.35;
        var circle = new BMap.Circle(cLLObj, radius, {
            strokeColor: opts.color,
            fillColor: opts.color,
            strokeWeight: 1,
            fillOpacity: opts.opacity,
            strokeOpacity: 1,
            enableClicking: false
        });
        return circle
    } catch (ex) {
        catchTheException("baiduAPI.prototype.createCircle", ex)
    }
};
var drawCallback_BD = null;
baiduAPI.prototype.setDrawMode = function (strMode, callbackFunction, mImgUrl, mWidth, mHeight, offsetType) {
    try {
        drawCallback_BD = null;
        if (typeof strMode == "undefined" || strMode == "" || strMode == null) {
            return
        }
        if (strMode != "pan" && strMode != "marker" && strMode != "rect" && strMode != "polygon" && strMode != "circle") {
            return
        }
        if (typeof callbackFunction == "undefined" || callbackFunction == "" || callbackFunction == null) {
            callbackFunction = null
        }
        if (typeof mImgUrl == "undefined" || mImgUrl == "" || mImgUrl == null) {
            mImgUrl = ""
        }
        if (typeof mWidth == "undefined" || mWidth == "" || mWidth == null) {
            mWidth = 25
        }
        if (typeof mHeight == "undefined" || mHeight == "" || mHeight == null) {
            mHeight = 25
        }
        if (typeof offsetType == "undefined" || offsetType == "" || offsetType == null) {
            offsetType = 0
        }
        drawCallback_BD = callbackFunction;
        InitDrawingManager_BD(mImgUrl, mWidth, mHeight, offsetType);
        switch (strMode) {
            case "pan":
                drawingManager_BD.close();
                break;
            case "marker":
                drawingManager_BD.setDrawingMode(BMAP_DRAWING_MARKER);
                break;
            case "rect":
                drawingManager_BD.setDrawingMode(BMAP_DRAWING_RECTANGLE);
                break;
            case "polygon":
                drawingManager_BD.setDrawingMode(BMAP_DRAWING_POLYGON);
                break;
            case "circle":
                drawingManager_BD.setDrawingMode(BMAP_DRAWING_CIRCLE);
                break;
            default:
                break
        }
        drawingManager_BD.open()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setDrawMode", ex)
    }
};
var drawingManager_BD = null;

function InitDrawingManager_BD(mImgUrl, mWidth, mHeight, offsetType) {
    try {
        //if (typeof mImgUrl == "undefined" || mImgUrl == "" || mImgUrl == null) {
        //    mImgUrl = getRootPath() + "/Images/Map/15.png"
        //}
        if (typeof mWidth == "undefined" || mWidth == "" || mWidth == null) {
            mWidth = 25
        }
        if (typeof mHeight == "undefined" || mHeight == "" || mHeight == null) {
            mHeight = 25
        }
        if (typeof offsetType == "undefined" || offsetType == "" || offsetType == null) {
            offsetType = 0
        }
        var iconOffset = {
            x: 0,
            y: 0
        };
        if (offsetType == 0) {
            iconOffset = {
                x: 0,
                y: 0
            }
        } else {
            iconOffset = {
                x: 0,
                y: (mHeight / 2) * (-1)
            }
        }
        //var styleOptions = {
        //    strokeColor: "#ff0000",
        //    fillColor: "#ff0000",
        //    strokeWeight: 1,
        //    strokeOpacity: 1,
        //    fillOpacity: 0.35,
        //    strokeStyle: 'solid'
        //};
        //var mOption = {
        //    icon: new BMap.Icon(mImgUrl, new BMap.Size(mWidth, mHeight)),
        //    enableDragging: true,
        //    offset: new BMap.Size(iconOffset.x, iconOffset.y)
        //};
        drawingManager_BD = new BMapLib.DrawingManager(GetMapObj().maplet, {
            isOpen: false,
            enableDrawingTool: false,
            enableCalculate: false,
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                offset: new BMap.Size(5, 5),
                scale: 0.8,
                drawingTypes: [BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYLINE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE]
            },
            //    markerOptions: mOption,
            circleOptions: styleOptions,
            polylineOptions: styleOptions,
            polygonOptions: styleOptions,
            rectangleOptions: styleOptions
        });
        drawingManager_BD.addEventListener('overlaycomplete', DManagerComplete_BD)
    } catch (ex) {
        catchTheException("InitDrawingManager_BD", ex)
    }
};

function DManagerComplete_BD(e) {
    try {
        drawingManager_BD.close();
        //if (drawCallback_BD != null) {
        //    eval("drawCallback_BD(event)");
        //}
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
        // drawingManager.close();
        // SaveAreaDialog();
        if (drawCallback_BD != null) {
            drawCallback_BD();
        }

    } catch (ex) {
        catchTheException("DManagerComplete_BD", ex)
    }
};
baiduAPI.prototype.setContextMenu = function (myMenu) {
    try {
        this.maplet.addContextMenu(myMenu.menu)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.setContextMenu", ex)
    }
};
var MapContextMenu = baiduAPI.prototype.MapContextMenu = function () {
    try {
        this.menu = new BMap.ContextMenu()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.MapContextMenu", ex)
    }
};
MapContextMenu.prototype.addMenuItem = function (title, callback) {
    try {
        this.menu.addItem(new BMap.MenuItem(title, callback))
    } catch (ex) {
        catchTheException("baiduAPI.js的addMenuItem", ex)
    }
};
baiduAPI.prototype.addListener = function (obj, sEvent, callbackFun) {
    try {
        return eval("obj.addEventListener(sEvent, callbackFun)")
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addListener", ex)
    }
};
baiduAPI.prototype.addZoomListener = function (callbackFun) {
    try {
        return this.maplet.addEventListener("zoomend", callbackFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addZoomListener", ex)
    }
};
baiduAPI.prototype.addMapMoveListener = function (callbackFun) {
    try {
        return this.maplet.addEventListener("moveend", callbackFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addMapMoveListener", ex)
    }
};
baiduAPI.prototype.addMarkerDragListener = function (obj, callbackName) {
    try {
        this.markerDragBack.callbackName = callbackName;
        this.markerDragBack.type = obj.type;
        obj.addEventListener("dragend", this.markerDragBack)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addMarkerDragListener", ex)
    }
};
baiduAPI.prototype.markerDragBack = function (marker) {
    try {
        marker.lon = marker.point.lng;
        marker.lat = marker.point.lat;
        marker.type = this.type;
        var ll02Obj = LLBDTo02(marker.point.lng, marker.point.lat);
        var ll84Obj = LL02To84(ll02Obj.lon, ll02Obj.lat);
        var rObj = {
            ll84: {
                lon: ll84Obj.lon,
                lat: ll84Obj.lat
            },
            ll02: {
                lon: ll02Obj.lon,
                lat: ll02Obj.lat
            }
        };
        return eval(baiduAPI.prototype.markerDragBack.callbackName + "(rObj,marker)")
    } catch (ex) {
        catchTheException("baiduAPI.prototype.markerDragBack", ex)
    }
};
baiduAPI.prototype.addLineClickListener = function (obj, callback) {
    try {
        this.lineClickBack.callback = callback;
        this.lineClickBack.lineObj = obj;
        obj.addEventListener("click", this.lineClickBack)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addLineClickListener", ex)
    }
};
baiduAPI.prototype.lineClickBack = function (event) {
    try {
        var rObj = {
            ll84: {
                lon: 0,
                lat: 0
            },
            ll02: {
                lon: 0,
                lat: 0
            }
        };
        var ll02Obj = LLBDTo02(event.point.lng, event.point.lat);
        var ll84Obj = LL02To84(ll02Obj.lon, ll02Obj.lat);
        var rObj = {
            ll84: {
                lon: ll84Obj.lon,
                lat: ll84Obj.lat
            },
            ll02: {
                lon: ll02Obj.lon,
                lat: ll02Obj.lat
            }
        };
        return eval("baiduAPI.prototype.lineClickBack.callback(rObj,baiduAPI.prototype.lineClickBack.lineObj)")
    } catch (ex) {
        catchTheException("baiduAPI.prototype.lineClickBack", ex)
    }
};



baiduAPI.prototype.addMarkerClick = function (obj, callback, strMode) {
    try {
        this.markerClickBack.callback = callback;
        this.markerClickBack.markerObj = obj;
        obj.addEventListener(strMode, this.markerClickBack)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addMarkerClick", ex)
    }
};
baiduAPI.prototype.markerClickBack = function (event) {
    try {
        var rObj = {
            ll84: {
                lon: 0,
                lat: 0
            },
            ll02: {
                lon: 0,
                lat: 0
            }
        };
        var ll02Obj = LLBDTo02(event.point.lng, event.point.lat);
        var ll84Obj = LL02To84(ll02Obj.lon, ll02Obj.lat);
        var rObj = {
            ll84: {
                lon: ll84Obj.lon,
                lat: ll84Obj.lat
            },
            ll02: {
                lon: ll02Obj.lon,
                lat: ll02Obj.lat
            }
        };
        return eval("baiduAPI.prototype.markerClickBack.callback(rObj,baiduAPI.prototype.markerClickBack.markerObj)")
    } catch (ex) {
        catchTheException("baiduAPI.prototype.markerClickBack", ex)
    }
};
baiduAPI.prototype.addMarkerMouseoverListener = function (obj, callbackFun) {
    try {
        obj.addEventListener("mouseover", callbackFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addMarkerMouseoverListener", ex)
    }
};
baiduAPI.prototype.addMarkerMouseoutListener = function (obj, callbackFun) {
    try {
        obj.addEventListener("mouseout", callbackFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addMarkerMouseoutListener", ex)
    }
};
baiduAPI.prototype.removeListener = function (handle, obj, sEvent, removeFun) {
    try {
        return eval("obj.removeEventListener(sEvent, callbackFun)")
    } catch (ex) {
        catchTheException("baiduAPI.prototype.removeListener", ex)
    }
};
baiduAPI.prototype.removeZoomListener = function (handle, removeFun) {
    try {
        return this.maplet.removeEventListener("zoomend", removeFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.removeZoomListener", ex)
    }
};
baiduAPI.prototype.removeMarkerDragListener = function (handle, obj, removeFun) {
    try {
        return obj.removeEventListener("dragend", removeFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.removeMarkerDragListener", ex)
    }
};
baiduAPI.prototype.pointToPixel = function (llObj) {
    try {
        var point = new BMap.Point(llObj.lon, llObj.lat);
        var xy = this.maplet.pointToPixel(point);
        point = null;
        return xy
    } catch (ex) {
        catchTheException("baiduAPI.prototype.pointToPixel", ex)
    }
};
baiduAPI.prototype.pixelToPoint = function (x, y) {
    try {
        var LLObj = this.maplet.pixelToPoint(new BMap.Pixel(x, y));
        var rObj = {
            lon: LLObj.lng,
            lat: LLObj.lat
        };
        return rObj
    } catch (ex) {
        catchTheException("baiduAPI.prototype.pixelToPoint", ex)
    }
};
baiduAPI.prototype.getViewBounds = function () {
    try {
        var boundsObj = this.maplet.getBounds();
        var neObj = boundsObj.getNorthEast();
        var ne = {
            lon: neObj.lng,
            lat: neObj.lat
        };
        var swObj = boundsObj.getSouthWest();
        var sw = {
            lon: swObj.lng,
            lat: swObj.lat
        };
        var rObj = {
            ne: ne,
            sw: sw
        };
        return rObj
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getViewBounds", ex)
    }
};
baiduAPI.prototype.fitBounds = function (bounds) {
    try {
        var boundsArr = new Array();
        boundsArr.push(new BMap.Point(bounds.sw.lon, bounds.ne.lat));
        boundsArr.push(new BMap.Point(bounds.ne.lon, bounds.ne.lat));
        boundsArr.push(new BMap.Point(bounds.ne.lon, bounds.sw.lat));
        boundsArr.push(new BMap.Point(bounds.sw.lon, bounds.sw.lat));
        this.maplet.setViewport(boundsArr)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.fitBounds", ex)
    }
};
baiduAPI.prototype.getDistance = function (llObj01, llObj02) {
    try {
        var dis = this.maplet.getDistance(llObj01, llObj02);
        return dis
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getDistance", ex)
    }
};
baiduAPI.prototype.getMapOfMarker = function (marker) {
    try {
        return marker.getMap()
    } catch (ex) {
        catchTheException("baiduAPI.prototype.getMapOfMarker", ex)
    }
};
baiduAPI.prototype.extendBounds = function (llObj, bounds) {
    try {
        var bdBounds = new BMap.Bounds(new BMap.Point(bounds.sw.lon, bounds.sw.lat), new BMap.Point(bounds.ne.lon, bounds.ne.lat));
        var point = new BMap.Point(llObj.lon, llObj.lat);
        bdBounds.extend(point);
        var rObj = {
            sw: {
                lon: bdBounds.getSouthWest().lng,
                lat: bdBounds.getSouthWest().lat
            },
            ne: {
                lon: bdBounds.getNorthEast().lng,
                lat: bdBounds.getNorthEast().lat
            }
        };
        return rObj
    } catch (ex) {
        catchTheException("baiduAPI.prototype.extendBounds", ex)
    }
};
baiduAPI.prototype.AddMarkerClickListener = function (marker, clickFun) {
    try {
        marker.addEventListener("click", clickFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.AddMarkerClickListener", ex)
    }
};
baiduAPI.prototype.IsLLObjInBounds = function (llObj, bounds) {
    try {
        var bdBounds = new BMap.Bounds(new BMap.Point(bounds.sw.lon, bounds.sw.lat), new BMap.Point(bounds.ne.lon, bounds.ne.lat));
        var point = new BMap.Point(llObj.lon, llObj.lat);
        return bdBounds.containsPoint(point)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.IsLLObjInBounds", ex)
    }
};
baiduAPI.prototype.createLayer = function (options) {
    return null
};
baiduAPI.prototype.addLayer = function (layer) { };
baiduAPI.prototype.removeLayer = function (layer) { };
baiduAPI.prototype.addMouseoverListener = function (obj, callbackFun) {
    try {
        this.mouseoverBack.callback = callbackFun;
        this.mouseoverBack.obj = obj;
        obj.addEventListener("mouseover", this.mouseoverBack)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addMouseoverListener", ex)
    }
};
baiduAPI.prototype.mouseoverBack = function (event) {
    try {
        var rObj = {
            ll84: {
                lon: 0,
                lat: 0
            },
            ll02: {
                lon: 0,
                lat: 0
            }
        };
        var ll02Obj = LLBDTo02(event.point.lng, event.point.lat);
        var ll84Obj = LL02To84(ll02Obj.lon, ll02Obj.lat);
        var rObj = {
            ll84: {
                lon: ll84Obj.lon,
                lat: ll84Obj.lat
            },
            ll02: {
                lon: ll02Obj.lon,
                lat: ll02Obj.lat
            }
        };
        return eval("baiduAPI.prototype.mouseoverBack.callback(rObj,event.currentTarget)")
    } catch (ex) {
        catchTheException("baiduAPI.prototype.mouseoverBack", ex)
    }
};
baiduAPI.prototype.addMouseoutListener = function (obj, callbackFun) {
    try {
        obj.addEventListener("mouseout", callbackFun)
    } catch (ex) {
        catchTheException("baiduAPI.prototype.addMouseoutListener", ex)
    }
};
module.exports={
  baiduAPI : baiduAPI
}
