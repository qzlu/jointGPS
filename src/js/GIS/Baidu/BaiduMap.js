var MapContainer = "container";
var map;
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
//var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
//缩放控件type有四种类型:
//BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；
//BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；
//BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮

//初始化地图容器
function initialize() {
    map = new BMap.Map(MapContainer);
}

//初始化地图容器
function initialize(containerName) {
    if (containerName!="") {
        MapContainer = containerName;
    }
    map = new BMap.Map(MapContainer);
}

//设置地图中心点和缩放级数
function SetMapCenter(lat, lng,zoom) {
    var point = new BMap.Point(lat, lng);
    map.centerAndZoom(point, zoom);
}

//获取地图对象
function GetMapObject() {
    return map;
}

//获取图标
function GetIcon(Iconurl,imgSize,offsetSize,imageOffsetSize) {
    var Icon = new BMap.Icon(Iconurl,
         imgSize, {
             offset: offsetSize,
             imageOffset: imageOffsetSize
        });
    return Icon;
}

//获取百度地图Size对象
function GetSizeObject(num1,num2) {
    return new BMap.Size(num1, num2);
}

//获取覆盖层
function GetMarker() {
    var marker = new BMap.Marker();
    return marker;
}

//创建marker的label
function GetLabel(context) {
    var label = new BMap.Label(context, { offset: new BMap.Size(30, 3) });
    label.setStyle({ borderColor: "#a3a3a3", fontSize: "12px", color: "#a3a3a3" });
    return label;
}

function addMarkerEvent(marker,eventName,target) {
    marker.addEventListener(eventName, target);
}

//设置图标旋转角度
function setRotation(marker, Rotation) {
    marker.setRotation(Rotation);
    return marker;
}

//修改覆盖层坐标
function ChangeMarketPosition(marker,point) {
    marker.setPosition(point);
}

//覆盖层添加到地图上
function AddMarker(marker) {
    try {
        map.addOverlay(marker);
    } catch (e) {
        //alert(e);
    }

}

//获取覆盖层坐标点
function GetMarkerPoint(marker) {
    var point = new BMap.Point(marker.point.lng, marker.point.lat);
    return point;
}

//经纬度转换成百度地图坐标对象
function GetPosition(lat, lng) {
    return new BMap.Point(lat, lng);
}

//添加地图控件
function add_control() {
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);
    //map.addControl(top_right_navigation);
    map.enableScrollWheelZoom();
    map.enableInertialDragging();
    map.enableContinuousZoom();
}

//移除地图控件
function delete_control() {
    map.removeControl(top_left_control);
    map.removeControl(top_left_navigation);
    //map.removeControl(top_right_navigation);
}

//开启滚轮滚动缩放
function enableScrollWheelZoom() {
    map.enableScrollWheelZoom();
}

//禁用滚轮滚动缩放
function disabledScrollWheelZoom() {
    map.disabledScrollWheelZoom();
}

//设置多个点的最佳视野
function setAutoView(points) {
    map.setViewport(points);
}







