
<template>
    <section style="height: 100%">
        <vehical-list v-on:child="get"></vehical-list>
        <div id="operate_wrapper">
            <div class="box-header">
                <div class="block">
                    <span class="operatExp">_选择箱号_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal"><!---->
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="fa fa-lock" style="font-size: 18px"></i>
                        </a>
                        <input type="text" class="search-input">
                    </div>
                </div>
                <div class="block">
                    <span class="operatExp">_选择时间_</span>
                    <el-date-picker
                            v-model="queryDate"
                            size="small"
                            :clearable="false"
                            @change="getTime"
                            type="daterange"
                            placeholder="_选择日期_"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                    <!--<el-date-picker-->
                    <!--size="small"-->
                    <!--v-model="value2"-->
                    <!--:clearable="false"-->
                    <!--@change="getTime"-->
                    <!--type="daterange"-->
                    <!--:picker-options="pickerOptions2"-->
                    <!--placeholder="_选择时间范围_">-->
                    <!--</el-date-picker>-->
                </div>
                <div class="btnList">
                    <!-- @click="doQuery"-->
                    <el-button type="primary" class="search" @click="doQuery">_查询_</el-button>
                    <el-button type="primary" class="reset" @click="reset">_重置_</el-button>
                    <el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>_导出文件_</el-button>
                </div>
                <div style="float: right;margin-right: 10px">
                    <el-radio class="radio"  v-model="radio" label="1" style="margin: 0px">_温度曲线_</el-radio>
                    <!--<el-radio class="radio"  v-model="radio" label="2" style="margin: 0px">_历史轨迹_</el-radio>-->
                </div>
            </div>
        </div>
        <div class="el_table_wrap" id="el_table_wrap" style="position: relative">
            <el-table :data="TemTrack" stripe style="width: 100%" :height="table_height" ref="multipleTable"
                      empty-text='_暂无数据_'
                      v-loading="loading"
                      element-loading-text="_拼命加载中_"
            >
                <el-table-column prop="RowNo" label="_序号_" width="65"></el-table-column>
                <el-table-column prop="FVehicleName" label="_箱号_" width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="FGPSDateTime" label="_时间_" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FInsideTemperature" label="_箱内温度_(℃)" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FOutsideTemperature" label="_箱外温度_(℃)" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FLongitude" label="_经度_" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FLatitude" label="_纬度_" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="address" label="_位置_" width="260" show-overflow-tooltip>
                </el-table-column>
                <!--<el-table-column prop="FACC" label="_状态_" width="120" v-if="SystemID==3" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FACC" label="_状态_" width="120" v-if="SystemID==4" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sposition" label="_位置_" width="250" show-overflow-tooltip align='left'>
                </el-table-column>
                <el-table-column prop="FLongitude" label="_经度_" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FLatitude" label="_纬度_" width="120" show-overflow-tooltip>
                </el-table-column>-->
                <el-table-column prop=" " label=" " min-width="1" ></el-table-column>
            </el-table>
            <!--<button type="button" @click="showPosition" class="btn btn-warning btn-sm showPosition">_设备位置图_</button>-->
            <transition
                    name="slide-fade"
                    enter-active-class="bounce-enter-active"
                    leave-active-class="bounce-leave-active">
                <div v-if="isShowPositionImg" class="positionImg"></div>
            </transition>
            <!-- /.modal-content -->
            <div class="mymodalCommon mymodal1" v-show="radio==1" :class="{'chartModal':!fullScreen,'fullScreen':fullScreen}">
                <div class="modal-header">
                    <div style="float: right">
                        <button
                                type="button" @click="open"
                                class="btn-white btn-custom" style="width: 70px"><i
                                class="fa fa-arrows-alt  padding-r-8"></i>{{word}}
                        </button>
                        <button type="button" @click="closeMymodal" class="closeMymodalBtn" >
                            <span class="glyphicon glyphicon-remove"></span>
                        </button>
                    </div>
                </div>
                <div class="containerChart" id="containerChart"></div>
            </div>
            <!-- /.modal-content -->
            <div class="mymodalCommon mymodal2" :class="{'show':radio==2,'chartModal':!fullScreen1,'fullScreen':fullScreen1}" >
                <div class="modal-header" >
                    <div style="float: right">
                        <button
                                type="button" @click="open"
                                class="btn-white btn-custom" style="width: 60px"><i
                                class="fa fa-arrows-alt  padding-r-8"></i>{{word1}}
                        </button>
                        <button type="button" @click="closeMymodal" class="closeMymodalBtn">
                            <span class="glyphicon glyphicon-remove" ></span>
                        </button>
                    </div>
                </div>
                <div class="modal-body"  style="padding: 0px">
                    <baidu-map ref="map" :fa-data="[mapToolShow]"></baidu-map>
                </div>
            </div>
        </div>
        <div id="pagination" class="pagination"><!--part3 header start-->
            <div class="block">
                <el-pagination
                        @size-change="handleSize"
                        @current-change="handleCurrent"
                        :page-sizes="[10, 20, 30]"
                        :page-size="pageSize"
                        :current-page="pageIndex"
                        layout="prev, pager, next, jumper,total,sizes"
                        :total="FTotalCount">
                </el-pagination>
            </div>
        </div>
    </section>
</template>
<script>
    import HighChart from 'highcharts/highstock'
    import baiduMap from 'components/Common/baidu_map.vue'
    import VehicalList from 'components/dialog/vehicalList.vue'
    let _this=null
    export default {
        data() {
            _this=this
            return{
                isShowPositionImg:false,
                value2:new Date(),
                radio: '',
                fullScreen:false,
                fullScreen1:false,
                pageIndex:1,
                pageSize:20,
                FTotalCount:0,
                TemTrack:[],
                queryDate: [new Date(),new Date()],
                pickerOptions: {
                    shortcuts: [{
                        text: '_今天_',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '_昨天_',
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            const end = start;
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '_最近三天_',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                loading: false,
                value4: [new Date(),new Date()],
                value3: '',
                Area:"深圳",
                mapToolShow:false,
                table:null,
                table_height:null,
                containerOption:{
                    chart:{
                        type: 'spline',
                        zoomType: 'x',
                        resetZoomButton:{
                            position: {
                                align: "right",
                                verticalAlign: "top",
                                x: 0,
                                y: -40,
                            }
                        }
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: false
                            },
                            connectNulls: true
                        }
                    },
                    scrollbar: {
                        enabled:false,
                        barBackgroundColor:"#2885eb",
                        liveRedraw:false,
                        showFull:false
                    },

                    title: {
                        text: '_温度曲线_',
                    },
                    xAxis: {
                        type: 'datetime',
                        lable:{},
                        dateTimeLabelFormats: {
                            hour: '%H:%M',
                            day: '%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        },
                    },
                    yAxis: {
                        softMax:30,
                        softMin:-30,
                        allowDecimals: false,
                        title: {
                            text: '_温度_ (℃)',
                            margin:-45,
                            align:"high",
                            y:-20,
                            rotation:0
                        },
                        lineColor: "#d7d7d7",
                        lineWidth: 1
                    },
                    tooltip: {
                        valueSuffix: '℃',
                        formatter:function(){
                            //console.log(this);
                            let time=moment(new Date(this.x)).format("YYYY-MM-DD HH:mm:ss");
                            return "<span>"+time+"</span><br><span>_箱外温度_：</span>"+this.points[0].y+"℃<br><span>_箱内温度_：</span>"+this.points[1].y+"℃";
                        },
                        borderColor: 'black',
                        shared: true,
                        crosshairs: [{            // 设置准星线样式
                            width: 1,
                            color: '#d8e63c'
                        }],
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        verticalAlign: 'top',
                        borderWidth: 0,
                        y:15
                    },
                    series:[
                        {
                            name:'_箱内温度_',
                            data:[]
                        },
                        {
                            name:'_箱外温度_',
                            data:[]
                        }
                    ]
                },
                vehicleName:"_温湿度_"
            }
        },
        mounted(){
            HighChart.setOptions({
                lang: {
                    resetZoom: '_重置_'
                },
                global: { useUTC: false }
            });
            //加载地图
            setTimeout(function () {
                _this.adjustPage();
                _this.$refs.map.initMap();

            },100)
//      this.handler();
        },
        props: {
            screenHeight: Number
        },
        computed: {
            word:function () {
                if(this.fullScreen){
                    return "_还原_"
                }else {
                    return "_全屏_"
                }
            },
            word1:function () {
                if(this.fullScreen1){
                    return "_还原_"
                }else {
                    return "_全屏_"
                }
            }
        },
        watch:{
            screenHeight () {
                this.adjustPage();
            },
            radio () {
                if(this.table ==null||this.table.length == 0){
                    this.radio='';
                    this.$message({
                        showClose: true,
                        message: '_获取数据后方能查看_',
                        type: 'warning'
                    });

                }
            }
        },
        methods:{
            handleSize(val) {
                this.pageSize = val;
                this.pageIndex = 1;
                this.TemTrack=this.pagination(1,this.pageSize,this.table);
            },
            handleCurrent(val) {
                this.pageIndex = val;
                this.TemTrack=this.pagination(this.pageIndex,this.pageSize,this.table);
            },
            get:function (data) {
                $('.search-input').val(data[0]);
                $('.search-input').attr('title',data[0])
                $('.search-input').attr('fguid',data[1])
            },
            adjustPage(){
                $("#map-wrapper").height(400);
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper",'pagination',true)+15;
            },
            getTime:function (value) {
                return this.value3=value;

            },
            reset:function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid')
                this.value4=null
            },
            doQuery:function () {
                //this.isShowPositionImg=false;
                this.closeMymodal();
                this.table=[];
                this.containerOption.series[0].data.length=0;
                this.containerOption.series[1].data.length=0;
                //this.containerOption.xAxis.categories=[];
                //this.vehicleName="_温湿度_"; //记录车牌号

                var FVehicleID = $(".search-input").attr("fguid");
                let time = _this.queryDate;
                let startTime = _this.parseUTC(time[0]);
                let endTime = _this.parseUTC(time[1]);

                let queryDate = "";
                let middleDate = "";
                if ((startTime.substring(0, 10)).toString() != (endTime.substring(0, 10)).toString()) {
                    middleDate = _this.dataScope(startTime.substring(0, 10), endTime.substring(0, 10)).join(",") + ",";
                }
                //_this.dataScope(startTime.substring(0,10),endTime.substring(0,10)).join(",")+","
                if (startTime.substring(0, 10) == endTime.substring(0, 10)) {
                    queryDate = startTime.substring(0, 10).replace(/-/g, "");
                } else {
                    if (middleDate.length == 1) {
                        middleDate = "";
                    }
                    queryDate = (startTime.substring(0, 10)).replace(/-/g, "") + "," + middleDate + (endTime.substring(0, 10)).replace(/-/g, "");
                }

                //console.log(startTime+","+endTime);
                if ( FVehicleID!=undefined){
                    this.loading=true;
                    let postData={
                        FTokenID:_this.$store.state.FTokenID,
                        FAction:"QueryReportLBSTrackListByFVehicleGUID",
                        FVehicleGUID:FVehicleID,
                        FStartTime:startTime,
                        FEndTime:endTime,
                        FPageSize:10000,
                        FPageIndex:1,
                        FTableDate:queryDate,
                        FVersion:"1.0.0"
                    };
                    $.ajax({
                        'url': '/web/Container/Container_Report',
                        'cache': false,
                        'async': true,
                        'type': 'Post',
                        'dataType': 'json',
                        'contentType': 'application/json;charset=utf-8',
                        'data': JSON.stringify(postData),
                        success:function (data) {
                            if (data.Result == 104) {
                                _this.$message({
                                    showClose: true,
                                    message: '_登录超时_,_五秒后跳转到登录页面_',
                                    type: 'warning'
                                });
                                setTimeout(function () {
                                    _this.$store.commit("goLogin");
                                }, 5000)
                                return
                            }
                            let allData = [];
                            let order = []; //记录设备id顺序
                            let assetCount = 4; //设备数量
                            let timeArr = [];
                            if (data.FObject.length == 0) {
                                return
                            }
                            //data.FObject = JSON.hunpack(eval(data.FObject), 4);
                            console.log("历史轨迹哦",data);
                            let fobj = data.FObject;
                            let temp=_this.getUsableData(data.FObject.Table1);
                            _this.FTotalCount=data.FObject.Table[0].FTotalCount;
                            setTimeout(function(){
                                _this.pageIndex=1;
                                _this.pageSize=20,
                                _this.table=temp;
                                _this.TemTrack=_this.pagination(1,20,temp);
                                _this.loading = false;
                            },500);
                            HighChart.chart('containerChart', _this.containerOption);
                            console.log(_this.containerOption);
                            if (fobj.length == 0) {
                                _this.$message({
                                    showClose: true,
                                    message: '_未查询到数据_',
                                    type: 'warning'
                                });
                                return
                            }
                            //_this.showPosition();
                            /*$.each(fobj, function (index, obj) {
                                //过滤多余数据
                                if (order.indexOf(obj.FSensorID1) == -1) return;
                                let timeItem = moment(_this.parseGMT(obj.FGPSDateTime)).format("YYYY-MM-DD HH:mm");

                                if (timeArr.indexOf(timeItem) == -1) timeArr.push(timeItem);
                                _this.vehicleName = obj.FVehicleName + ":_温湿度_";
                                let oneData = {
                                    index: timeArr.indexOf(timeItem),
                                    id: null,
                                    temperature: null,
                                    humidity1: null
                                };

                                let alphaCode = null;
                                for (let j = 0; j < order.length; j++) {
                                    let orderItem = order[j];
                                    if (orderItem == obj.FSensorID1) {
                                        switch (j) {
                                            case 0:
                                                alphaCode = "1";
                                                break;
                                            case 1:
                                                alphaCode = "2";
                                                break;
                                            case 2:
                                                alphaCode = "3";
                                                break;
                                            case 3:
                                                alphaCode = "4";
                                                break;
                                            case 4:
                                                alphaCode = "5";
                                                break;
                                            case 5:
                                                alphaCode = "6";
                                                break;
                                        };
                                        break
                                    }

                                }

                                oneData.id = alphaCode;
                                oneData.temperature =Number(obj.FTemperature1.toFixed(0)) ;
                                oneData.humidity1 = obj.FHumidity1;
                                allData.push(oneData);
                            });*/
                            /*console.log(order);
                            timeArr.map(function (item, index) {
                                let tableItem = {
                                    time: item,
                                    group: {
                                        1: [null, null],
                                        2: [null, null],
                                        3: [null, null],
                                        4: [null, null]
                                    }
                                }

                                _this.table.push(tableItem)

                            })
                            allData.map(function (item, index) {

                                _this.table[item.index].group[item.id][0] = item.temperature;
                                _this.table[item.index].group[item.id][1] = item.humidity1;

                            })

                            _this.table.map(function (item, index) {

                                _this.containerOption.xAxis.categories.push(item.time.split(" ")[1]);
                                let n = 0;
                                for (let key in item.group) {
                                    let arr = [];
                                    arr.push(item.time);
                                    arr.push(item.group[key][0])
                                    _this.containerOption.series[n].data.push(arr);
                                    n++
                                }

                            })

                            console.log(_this.containerOption)

                            _this.showHistory(fobj);*/

                        },
                        error: function () {
                            console.log('请求失败')
                        }
                    })
                }else if(FVehicleID==undefined){
                    this.$message({
                        showClose: true,
                        message: '_请选择箱号_',
                        type: 'warning'
                    });
                }
            },
            //分页
            pagination(pageIndex, pageSize, array) {
                let offset = (pageIndex - 1) * pageSize;
                return ((Number(offset) + Number(pageSize)) >= array.length) ? array.slice(offset, array.length) : array.slice(Number(offset), (Number(offset) + Number(pageSize)));
            },
            //优化显示数据
            getUsableData(arr){
                let result = arr;
                
                for (let i = 0; i < result.length; i++) {
                    let t=_this.getUTCTime(result[i].FGPSDateTime);
                    result[i].FGPSDateTime = _this.parseGMT(result[i].FGPSDateTime);
					result[i].FOutsideTemperature=result[i].FOutsideTemperature<-50?"--":result[i].FOutsideTemperature;
					result[i].FInsideTemperature=result[i].FInsideTemperature<-50?"--":result[i].FInsideTemperature;
                    _this.containerOption.series[0].data.push([t,Number(result[i].FOutsideTemperature)]);
                    _this.containerOption.series[1].data.push([t,Number(result[i].FInsideTemperature)]);
                    _this.ReverseGeocoding(result[i].FLongitude,result[i].FLatitude,result[i]);
                }
                return result
            },
            //获取开始时间和结束时间之间的日期
            dataScope(value1, value2){
                var getDate = function (str) {
                    var tempDate = new Date();
                    var list = str.split("-");
                    tempDate.setFullYear(list[0]);
                    tempDate.setMonth(list[1] - 1);
                    tempDate.setDate(list[2]);
                    return tempDate;
                }
                var date1 = getDate(value1);
                var date2 = getDate(value2);
                if (date1 > date2) {
                    var tempDate = date1;
                    date1 = date2;
                    date2 = tempDate;
                }
                date1.setDate(date1.getDate() + 1);
                var dateArr = [];
                var i = 0;
                while (!(date1.getFullYear() == date2.getFullYear()
                && date1.getMonth() == date2.getMonth() && date1.getDate() == date2
                        .getDate())) {
                    var dayStr = date1.getDate().toString();
                    var monthStr = (date1.getMonth() + 1).toString();
                    if (dayStr.length == 1) {
                        dayStr = "0" + dayStr;
                    }
                    if (monthStr.length == 1) {
                        monthStr = "0" + monthStr;
                    }
                    dateArr[i] = date1.getFullYear() + "" + monthStr + ""
                            + dayStr;
                    i++;
                    date1.setDate(date1.getDate() + 1);
                }
                //console.log(dateArr);
                return dateArr;
            },
            //逆地理编码
            ReverseGeocoding(lat,lon,obj){
                let pointObj={lat:lon,lng:lat};
                let point=this.parsePoint(this.$store.state.globalMapType,pointObj);
                this.geocoder(this.$store.state.globalMapType,point,obj,"address");
            },
            //绘制轨迹
            showHistory:function (data) {

                let points=[];
                var carData=data;
                for (var i = 0; i < carData.length; i++) {
                    let lon=null,
                            lat=null;
                    if(carData[i].FLongitude==0 && carData[i].FLatitude==0){

                        if(carData[i-1] && carData[i-1].FLongitude!=0 && carData[i-1].FLatitude!=0){
                            let point=_this.parsePointBD(new BMap.Point(carData[i - 1].FLongitude,carData[i - 1].FLatitude));
                            points.push(new BMap.Point(point.lng,point.lat));

                        }
                        else if(carData[i+1] && carData[i+1].FLongitude!=0 && carData[i+1].FLatitude!=0){
                            let point=_this.parsePointBD(new BMap.Point(carData[i + 1].FLongitude,carData[i + 1].FLatitude));
                            points.push(new BMap.Point(point.lng,point.lat));

                        }


                    }else {
                        let point=_this.parsePointBD(new BMap.Point(carData[i].FLongitude,carData[i].FLatitude));
                        points.push(new BMap.Point(point.lng,point.lat));
                    }

                }


                _this.$refs.map.showCarRoute([],points);
            },
            getCarPoint(data){
                let gpsPoint = {lon: data.FLongitude, lat: data.FLatitude};
                if (data.FLongitude >= 1 && data.FLatitude >= 1) {
                    gpsPoint = this.fixGPSPoint(parseFloat(data.FLatitude),parseFloat(data.FLongitude));
                }
                return gpsPoint;
            },

            //全屏
            open:function () {
                if(this.radio==1){
                    this.fullScreen=!this.fullScreen;
                    if(this.fullScreen){
                        $(".el_table_wrap").css("padding-left",'0px');
                        $(".mymodal1").width("100%");
                        $(".mymodal1").height(this.table_height);
                        HighChart.chart('containerChart',this.containerOption);
                    }else {
                        $(".mymodal1").width("800");
                        $(".mymodal1").height("400");
                        HighChart.chart('containerChart',this.containerOption);
                    }
                }else if(this.radio==2){
                    this.fullScreen1=!this.fullScreen1;
                    if(this.fullScreen1){
                        $(".el_table_wrap").css("padding-left",'0px');
                        $(".mymodal2").width("100%");
                        $(".mymodal2").height(this.table_height);
                        $("#map-wrapper").height(this.table_height);
                    }else {
                        $(".mymodal2").width("800");
                        $(".mymodal2").height("400");
                        $("#map-wrapper").height(400);
                    }
                }
            },
            closeMymodal:function () {
                this.radio=''
            },
            //显示设备图
            showPosition(){
                let timeout=null;
                _this.isShowPositionImg=true;
                clearTimeout(timeout);
                timeout=setTimeout(function(){
                    _this.isShowPositionImg=false;
                },3000)
            }
        },
        components:{
            baiduMap,
            VehicalList
//      BaiduMap
//      BootPage
        }
    }
</script>
<style scoped>
    .el-table__empty-block{
        width:100% !important;
    }
    .block {
        float:left;
        margin-left:20px;
    }

    .block:nth-child(1) {
        margin-left:0;
    }

    .search-input-wrap {
        float:left;
        margin:9px 0 0 10px;
    }

    .search-input {
        float:left;
        width:120px;
        height:28px;
        border:1px solid #e6e6e6;
        line-height: 28px;
    }

    .operatExp {
        float:left;
        font-size:12px;
    }

    .get-carList-dialog {
        float:left;
        display:flex;
        justify-content:center;
        align-items:center;
        width:28px;
        height:28px;
        border:1px solid #e6e6e6;
        border-right:none;
        text-align:center;
    }
    .chartContainer{
        width: 100%;
        height: 400px;
        padding-right: 14px;
        background: #ffffff;
    }
    .containerChart{
        background-color: #fff;
        box-shadow: 2px 5px 8px rgba(0,0,0,0.5);
        height: 100%;
        width: 100%;
    }
    .mapcontainer{
        width: 30%;
        height: 100%;
        float: right;
        visibility: hidden;
    }
    .tire{
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height:16px;
        border-radius:3px;
        margin-right: 4px;
        text-align:center;
        background-color:#c0dbf9;
        color:#506ef7;
    }
    .mymodalCommon{
        position: absolute;
        z-index:999;
        display:block;
        border: 1px solid #ccc;
        visibility:hidden;
    }
    .mymodalCommon .modal-header{
        position: absolute;
        top:1px;
        right: 0;
        z-index:1;
        padding:0;
        height:21px;
        background:#fff;
    }
    .chartModal{
        height: 420px;
        width:800px;
        top:50%;
        left: 50%;
        margin-left:-400px;
        margin-top: -200px;
    }
    .fullScreen{
        top:0;
        width:100%;
    }
    .mymodal1,.show{
        visibility:visible;
    }
    .closeMymodalBtn{
        height: 20px;
        width: 20px;
        border: none;
        font-size:14px;
        background:#fff;
    }
    .humiture{
        display:inline-block;
    }
    .humitureTxt{
        display:inline-block;
        min-width:60px
    }
    .showPosition{
        position:absolute;
        top:1px;
        right:0;
    }
    .positionImg{
        position:absolute;
        top:50%;
        left:50%;
        width:600px;
        height:250px;
        margin-left:-300px;
        margin-top:-125px;
        background:url("/static/img/position-tem.png") no-repeat;
        background-size:cover;
    }

    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-out .5s;
    }
    @keyframes bounce-in {
        0%   {transform: translateX(-600px)}
        100% {transform: translateX(0)}
    }
    @keyframes bounce-out {
        0%  {transform: translateX(0)}
        100%{transform: translateX(1000px)}
    }



</style>
