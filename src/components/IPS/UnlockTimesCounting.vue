<template>
    <section>
        <div class="mymodal"
             style="height: 570px;width: 920px;margin-left:-320px;margin-top: -230px;position: fixed;left: 50%;top: 50%;z-index:999;visibility: hidden">
            <div class="modal-header"
                 style="position: absolute;left: 890px;height: 20px;width: 20px;border: none;padding: 0px;z-index: 2;">
                <button type="button" @click="closeMymodal"
                        style="height: 30px;width: 30px;background:transparent;outline:none;border: none;">
                    <!--<span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal"></span>-->
                    <i class="fa fa-times" aria-hidden="true" style="font-size: 24px;"></i>
                </button>
            </div>
            <div class="modal-body" style="padding: 0px">
                <baidu-map ref="map" :fa-data="[mapToolShow]"></baidu-map>
            </div>
            <div class="mapModal">
                <header style="background: #f9f9f9 ;height:34px;padding: 10px">
                    <h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{locationIntro.FVehicleName}}</h4>
                </header>
                <div style="padding: 15px" v-show="isShowRefuel">
                    <p><span>_开始时间_：</span>{{locationIntro.FStartDateTime}}</p>
                    <p><span>_结束时间_：</span>{{locationIntro.FStopDateTime}}</p>
                    <p><span>_持续时长_：</span>{{locationIntro.FKeepSeconds}}</p>
                    <p><span>_开始升数_：</span>{{locationIntro.FStartLiter}}</p>
                    <p><span>_结束升数_：</span>{{locationIntro.FStopLiter}}</p>
                    <p><span>_加油升数_：</span>{{locationIntro.FRefuel}}</p>
                    <p><span>_位置_：</span>{{locationIntro.address}}</p>
                </div>
                <div style="padding: 15px" v-show="isShowImproper">
                    <p><span>_开始时间_：</span>{{locationIntro.FStartDateTime}}</p>
                    <p><span>_结束时间_：</span>{{locationIntro.FStopDateTime}}</p>
                    <p><span>_持续时长_：</span>{{locationIntro.FKeepSeconds}}</p>
                    <p><span>_开始升数_：</span>{{locationIntro.FStartLiter}}</p>
                    <p><span>_结束升数_：</span>{{locationIntro.FStopLiter}}</p>
                    <p><span>_消耗升数_：</span>{{locationIntro.FImproper}}</p>
                    <p><span>_位置_：</span>{{locationIntro.address}}</p>
                </div>
            </div>
        </div>
        <!--选择车辆弹窗-->
        <vehical-select-dialog v-on:child.sync="get" ref="vehicle"></vehical-select-dialog>
        <div id="operate_wrapper"><!--part1 header start-->
            <div class='box-header'>
                <!--<div class="block">
                    <span class="operatExp">_选择车辆_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal">&lt;!&ndash;&ndash;&gt;
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="img-icon icon-carList-dialog"></i>
                        </a>
                        <input type="text" class="search-input">
                    </div>
                </div>-->

                <div class="block">
                    <span class="operatExp">_选择发货时间_</span>
                    <el-date-picker
                            popper-class="oilWearDateSelect"
                            size="small"
                            v-model="queryDate"
                            type="daterange"
                            :clearable="false"
                            :picker-options="pickerOptions"
                            placeholder="_选择时间范围_">
                    </el-date-picker>
                </div>
                <div class="block">
                    <span class="demonstration">_选择开锁原因_</span>
                    <el-cascader
                            class="switchLockOpenType"
                            :options="openTypeOptions"
                            v-model="selectedOptions"
                            @change="handleChangeOpenType">
                    </el-cascader>
                </div>
                <div class="block">
                    <el-input
                            v-model="FKey"
                            class="keyInput"
                            @keyup.13.native="doQuery"
                            placeholder="_设备_ID、_车牌号_、_订单号_">
                    </el-input>
                </div>
                <div class="btnList block">
                    <el-button type="primary" class="search" @click="doQuery()">_查询_</el-button>
                    <el-button type="primary" class="reset" @click="resetCondition()">_重置_</el-button>
                    <!--<el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>导出文件</el-button>-->
                    <!--<el-button type="primary" class="read" @click="changeState"><i class="fa fa-envelope-open-o"></i>_设为已读_
                    </el-button>-->
                </div>
            </div>
            <!--饿了么选项卡部分，报警报表，胎压报警里面估计没有，可省略-->
            <el-tabs v-model="activeName" @tab-click="switchoverTab" @tab-remove="removeTab">
                <el-tab-pane label="_汇总_" name="1"></el-tab-pane>
                <el-tab-pane
                        v-for="(item, index) in editableTabs"
                        :key="item.name"
                        closable
                        :label="item.title"
                        :name="item.name"
                ></el-tab-pane>
            </el-tabs>
        </div><!--part1 header end-->

        <div class="el_table_wrap" id="el_table_wrap"><!--part2 header start-->
            <!--汇总-->
            <el-table :data="switchLockCountInfo" stripe style="width: 100%" :height="table_height"
                      v-show="show_SLCountInfo">
                <!--表格统一用饿了么组件，类型使用stripe，不要使用border-->
                <el-table-column tooltip-effect="dark" type="index" align="center" label="_序号_" width="80">
                </el-table-column>
                <el-table-column label="_操作_" align="center" width="100">
                    <template scope="scope">
                        <el-button type="text" title="_查看详情_" size="small" @click="LookOverDetails(scope.row)">_查看详情_</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="FAssetID" label="_设备_ID" width="130">
                </el-table-column>
                <el-table-column prop="FCargoCode" label="_货单号_" show-overflow-tooltip sortable width="100">
                </el-table-column>
                <el-table-column prop="FVehicleName" label="_车牌号_" width="140">
                </el-table-column>
                <el-table-column prop="FCargoName" label="_货物简称_" width="180">
                </el-table-column>
                <el-table-column prop="FAllOpenCount" label="_开关锁次数_" sortable width="130">
                </el-table-column>
                <el-table-column prop="" align="center" label="">
                </el-table-column>

            </el-table>


            <!--开关锁报表全部-->
            <el-table :data="allSwitchLockInfo" stripe style="width: 100%" :height="table_height" v-show="show_allSwitchLockInfo">
                <el-table-column tooltip-effect="dark" type="index" align="center" label="_序号_" width="80">
                </el-table-column>
                <el-table-column label="_操作_" align="center" width="100">
                    <template scope="scope">
                        <el-button type="text" title="_查看图片_" size="small" @click="showPicture(scope.row)">_查看图片_</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="FAssetID" label="_设备_ID" show-overflow-tooltip width="120">
                </el-table-column>
                <el-table-column prop="FCargoName" label="_货物简称_" width="140">
                </el-table-column>
                <el-table-column prop="FVehicleName" label="_车牌号_" width="140">
                </el-table-column>
                <el-table-column prop="FDeliveryTime" label="_发货时间_" width="180">
                </el-table-column>
                <el-table-column prop="FOpenReson" label="_开锁原因_" width="140">
                </el-table-column>
                <el-table-column prop="FDischargeCargo" show-overflow-tooltip label="_卸货信息_" width="200">
                </el-table-column>
                <el-table-column prop="FOpenTime" label="_开锁时间_" sortable width="180">
                </el-table-column>
                <el-table-column prop="openAddress" align="center" show-overflow-tooltip label="_开锁地点_" width="230">
                </el-table-column>
                <!--<el-table-column prop="FCloseTime" align="center" label="_上锁时间_" width="180">
                </el-table-column>
                <el-table-column prop="closeAddress" align="center" show-overflow-tooltip label="_上锁地点_" width="230">
                </el-table-column>-->
                <!--<el-table-column prop="FDischargeCargo" align="center" label="_全程耗时_" min-width="230">
                </el-table-column>-->
                <el-table-column prop="FDriverName" align="center" show-overflow-tooltip label="_司机_" width="120">
                </el-table-column>
                <el-table-column prop="FDriverPhone" align="center" show-overflow-tooltip label="_司机电话_" width="180">
                </el-table-column>
                <el-table-column prop="" align="center" label="" width="">
                </el-table-column>
            </el-table>
        </div><!--part2 header end-->
        <el-dialog title="" :visible.sync="showPictureDialog" class="showPictureDialog">
            <template>
                <el-carousel arrow="always" :autoplay="false" height="500px" v-show="havePiacture">
                    <el-carousel-item v-for="item in pictureArr" :key="item">
                        <div class="showPictureWrap">
                            <img class="showPictureImg" :src="item" alt="">

                        </div>

                    </el-carousel-item>
                </el-carousel>
                <div class="no_found" v-show="!havePiacture">
                    <img src="/static/img/not-found.png" alt="">
                    <span class="not_found_text">_暂无图片_</span>
                </div>
            </template>
        </el-dialog>
        <!--分页还是统一用饿了么的组件，事件、配置都还挺好-->
        <div id="pagination" class="pagination" v-show="show_pagination"><!--part3 header start-->
            <div class="block" v-if="show_SLCountInfo">
                <el-pagination
                        @size-change="handleSizeSLCount"
                        @current-change="handleCurrentSLCount"
                        :page-sizes="[10, 20, 30]"
                        :page-size="pageSize_OpenCount"
                        :current-page="pageIndex_OpenCount"
                        layout="prev, pager, next, jumper,total,sizes"
                        :total="SLCountFTotalCount">
                </el-pagination>
            </div>
            <div class="block" v-if="show_allSwitchLockInfo">
                <el-pagination
                        @size-change="handleSizeChangeDetails"
                        @current-change="handleCurrentChangeDetails"
                        :page-sizes="[10, 20, 30]"
                        :page-size="pageSize_Details"
                        :current-page="pageIndex_Details"
                        layout="prev, pager, next, jumper,total,sizes"
                        :total="allSLFTotalCount">
                </el-pagination>
            </div>
        </div><!--part3 header end-->
    </section>
</template>
<script type="text/ecmascript-6">
    import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
    import HighChart from 'highcharts/highstock'
    import baiduMap from '../Common/baidu_map.vue'
    export default {
        data() {
            return {
                Area: "深圳",
                mapToolShow: false,
                queryDate: [new Date(), new Date()],
                activeName: "1",
                show_SLCountInfo: true,//显示汇总table
                show_allSwitchLockInfo: false,//显示加油次数table
                show_FuelImproper: false,//显示异常次数table
                table_height: null,
                switchLockCountInfo: [],
                allSwitchLockInfo: [],//发货详情数据,
                showPictureDialog:false,
                pictureArr:[],
                FuelImproperInfo: [],
                checkedRow: [],
                pageIndex_OpenCount: 1,
                pageSize_OpenCount: 20,
                pageIndex_Details: 1,
                pageSize_Details: 20,
                pageIndex_Improper: 1,
                pageSize_Improper: 20,
                SLCountFTotalCount: 0,
                allSLFTotalCount: 0,
                FuelImproperFTotalCount: 0,
                RefuelCountLicense: "",
                CountLicense: "",
                FVehicleGUID_Count:"",//汇总车辆id
                FVehicleGUID_Refuel:"",//加油车辆id
                FVehicleGUID_Improper:"",//异常车辆id
                tempCountData:"",//汇总稀释后的临时数据
                DetailsFTripGUID: "",//任务单唯一标识
                DetailsFAssetID: "",//设备ID
                FKey:null,//关键字
                FuelImproperLicense: "",
                FuelImproperCarFGUID: "",
                carFGUID: "",
                havePiacture:true, // 是否有图片
                isShowRefuel:false,
                isShowImproper:false,
                locationIntro: {
                    FVehicleName: "",
                    FStartDateTime: "",
                    FStopDateTime: "",
                    FStartLiter:"",
                    FStopLiter:"",
                    FRefuel:"",
                    FImproper:"",
                    FKeepSeconds: "",
                    address: ""
                },
                FStartDateTime: "",
                //seachTime: "",
                editableTabs: [],
                showChartCollect: false,//是否显示汇总曲线选项卡
                showChartRefuelDialog: false,
                showChartImproperDialog: false,
                show_pagination: true,
                loadingCharts: false,//汇总折线图loading
                loadingRefuelCharts:false,//加油折线图loading
                loadingImproperCharts:false,//异常折线图loading
                customInterval: 150,
                openTypeOptions: [
                    {
                        value: '0',
                        label: '_全部_',
                    },
                    {
                        value: '1',
                        label: '_收货_',
                    },
                    {
                        value: '2',
                        label: '_绿通_',
                    },
                    {
                        value: '3',
                        label: '_其它_',
                    },
                ],
                selectedOptions:['0'],
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
                    }],
                    /*disabledDate(time){
                     return time.getTime() > Date.now() - 8.64e7;
                     }*/
                },
            }
        },

        props: {
            screenHeight: Number
        },
        mounted(){
            this.$refs.map.initMap();
            $("#map-wrapper").height(470);
            setTimeout(() => {
                this.adjustPage();
            }, 100);
            HighChart.wrap(HighChart.Chart.prototype, 'exportChartLocal', function (proceed, options) {
                if (options && options.type === 'application/pdf') {
                    this.exportChart(options);
                } else {
                    proceed.call(this, options);
                }
            });
            HighChart.setOptions({
                lang: {
                    resetZoom: '_重置_',
                    //contextButtonTitle: "_图表导出菜单_",
                    downloadJPEG:"_下载_ JPEG _图片_",
                    downloadPDF:"_下载_ PDF _文件_",
                    downloadPNG:"_下载_ PNG _文件_",
                    downloadSVG:"_下载_ SVG _文件_",
                    printChart:"_打印图表_"
                },
                rangeSelector: {
                    buttons: [{
                        type: 'all',
                        text: 'All'
                    }],
                    selected: 1
                },
                global: { useUTC: false }
            });
        },
        methods: {
            /*Pagination*/
            /*--全部--*/
            handleSizeSLCount(val) {
                this.pageSize_OpenCount = val;
                this.doQuery();
            },
            handleCurrentSLCount(val) {
                this.pageIndex_OpenCount = val;
                this.doQuery();
            },
            handleSizeChangeDetails(val) {
                this.pageSize_Details = val;
                this.doRefuelCountQuery();
            },
            handleCurrentChangeDetails(val) {
                this.pageIndex_Details = val;
                this.doRefuelCountQuery();
            },
            handleSizeChangeImproper(val) {
                this.pageSize_Improper = val;
                this.doFuelImproperQuery();
            },
            handleCurrentChangeImproper(val) {
                this.pageIndex_Improper = val;
                this.doFuelImproperQuery();
            },
            //选择开锁类型
            handleChangeOpenType(value) {
                console.log(value);
            },
            adjustPage(){
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) +13;
            },

            //警告弹窗内容
            warningDialogMsg(msg, type){
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type
                });
            },
            //获取时间
            /*getTime(value){
             return this.seachTime = value;
             },*/
            //时间格式转换去掉时分秒
            timeChange(time){
                var time1=Date.parse(new Date(time));
                var uom1=new Date(time1);
                var month1=(uom1.getMonth()+1).toString().length==1?"0"+(uom1.getMonth()+1).toString():(uom1.getMonth()+1);
                var day1=uom1.getDate().toString().length==1?"0"+uom1.getDate():uom1.getDate();
                return uom1.getFullYear()+'-'+month1+'-'+day1;
            },
            //请求数据
            doQuery(){
                this.removeTab("2");
                this.allSwitchLockInfo=[];
                let time = this.queryDate;
                if (time == "") {
                    this.warningDialogMsg("_请选择时间_!", "warning");
                    return false;
                }
                var _this = this;
                //console.log(time);
                let startTime = this.parseUTC(this.timeChange(time[0]) + " 00:00:00");
                //let startTime = this.parseUTC(time[0]);
                let endTime = this.parseUTC(this.timeChange(time[1]) + " 23:59:59");
                //let endTime = this.parseUTC(time[1]);
                //console.log(startTime+","+endTime);
                let letFTokenID = this.$store.state.FTokenID;
                //console.log(_this.carFGUID);
                //console.log(startTime+","+endTime);
                //console.log(this.datelimit(endTime,startTime,3));
                /*if (!this.datelimit(endTime, startTime, 7)) {
                 this.warningDialogMsg("_查询时间请小于七天_!", "warning");
                 return false;
                 }*/
                $.post("/web/SmartDistribution/SmartDistribution_Report", {
                    FTokenID: letFTokenID,
                    FAction: "QueryReportDeliveryOpenCount",
                    FKey: _this.FKey,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FDataType:_this.selectedOptions[0],
                    FPageSize: this.pageSize_OpenCount,
                    FPageIndex: this.pageIndex_OpenCount,
                    FVersion: "1.0.0",
                }, function (data) {
                    //let json=JSON.parse(data);
                    console.log("开关锁报表",data);
                    if (data.FObject.length != 0) {
                        _this.SLCountFTotalCount = data.FObject.Table[0].Column1;
                        let temp=_this.getUsableData(data.FObject.Table1,"collect");
                        _this.switchLockCountInfo = temp;
                    } else {
                        _this.warningDialogMsg("_未查询到数据_!", "warning");
                        _this.switchLockCountInfo = _this.tempDataArr;
                    }
                });
            },
            // 判断图片是否有效
            CheckImgExists(imgurl) {
                var ImgObj = new Image(); //判断图片是否存在
                ImgObj.src = imgurl;
                //没有图片，则返回-1
                if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                    return true;
                } else {
                    return false;
                }
            },
            showPicture(row){
                this.pictureArr.length = 0;
                let temp = row.FCargoPictures.split(",");
                for (let i = 0; i < temp.length; i++) {
                    if (this.CheckImgExists(temp[i])) {
                        this.pictureArr.push(temp[i]);
                    }
                }
                console.log(this.pictureArr);
                if (this.pictureArr.length === 0) {
                    this.havePiacture = false;
                } else {
                    this.havePiacture = true;
                }
                this.showPictureDialog = true;
            },
            //关闭modal窗口
            closeMymodal() {
                $(".mymodal").css('visibility', 'hidden')
            },
            //地图上定位
            position(index, row) {
                $(".mymodal").css('visibility', 'visible');
                //console.log(index, row);
                var point = new BMap.Point(row.FLongitude, row.FLatitude);
                this.$refs.map.setMark(point);
                this.setMapInfo(row);
            },

            //在地图上添加点信息
            setMapInfo(row){
                this.locationIntro.FVehicleName = row.FVehicleName;
                this.locationIntro.FStartDateTime = row.FStartDateTime;
                this.locationIntro.FStopDateTime = row.FStopDateTime;
                this.locationIntro.FStartLiter = row.FStartLiter;
                this.locationIntro.FStopLiter = row.FStopLiter;
                this.locationIntro.FRefuel = row.FRefuel;
                this.locationIntro.FImproper = row.FImproper;
                this.locationIntro.address = row.address;
                let seconds = (new Date(row.FStopDateTime)).getTime() - (new Date(row.FStartDateTime)).getTime();
                let minute = seconds / 1000 / 60;
                this.locationIntro.FKeepSeconds = minute.toFixed(0) + "分钟";
            },

            //重置
            resetCondition(){
                $(".search-input").val("");
                this.FKey="";
                this.selectedOptions=['0'],
                        this.queryDate = [new Date(), new Date()];
                this.switchLockCountInfo = [];
                this.allSwitchLockInfo = [];
                this.FuelImproperInfo = [];
                this.License = "";
                this.carFGUID = "";
                this.pageIndex_OpenCount = 1;
                this.pageIndex_Details = 1;
                this.pageIndex_Improper = 1;
                this.pageSize_OpenCount = 20;
                this.pageSize_Details = 20;
                this.pageSize_Improper = 20;
                this.SLCountFTotalCount = 0;
                this.allSLFTotalCount = 0;
                this.FuelImproperFTotalCount = 0;
                this.editableTabs = [];
                this.activeName = "1";
                this.show_SLCountInfo = true;
                this.show_allSwitchLockInfo = false;
                this.show_FuelImproper = false;
                this.showChartCollect = false;
                this.show_pagination = true;
                this.$refs.vehicle.$children[1].setCheckedKeys([]);
            },
            //获取车辆信息
            get(data){
                this.License = data[0].join(",");
                this.carFGUID = data[1].join(",");
                $(".search-input").val("_已选_" + data[0].length + "_辆_");
            },
            //查看任务单详情
            LookOverDetails(row){
                this.DetailsFTripGUID = row.FTripGUID;
                this.DetailsFAssetID = row.FAssetID;
                this.doDetailsQuery(row,"other_r");
                this.addDetailsTab();
            },
            //查看异常次数
            LookOverFuelImproper(row){
                this.FuelImproperLicense = row.FVehicleName;
                this.FuelImproperCarFGUID = row.FVehicleGUID;
                this.doFuelImproperQuery();
                this.doDetailsQuery(row,"other_i");
                this.addFuelImproperTab();
            },
            //请求单个车辆加油次数
            doRefuelCountQuery(){
                let _this = this;
                _this.allSwitchLockInfo.length=0;
                let time = this.queryDate;
                let startTime = this.parseUTC(time[0]);
                let endTime = this.parseUTC(time[1]);
                let letFTokenID = this.$store.state.FTokenID;
                //console.log(_this.RefuelCountCarFGUID+","+startTime+","+endTime)
                $.post("web/FleetManager/FleetManager_Report", {
                    FTokenID: letFTokenID,
                    FAction: "QueryFuelRefuelByFVehicleGUID",
                    FVehicleGUID: _this.RefuelCountCarFGUID,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FPageIndex: _this.pageIndex_Details,
                    FPageSize: _this.pageSize_Details,
                    FOrderBy: "FRefuel DESC",//FStartDateTime 升序 //FStartDateTime DESC 降序 //FRefuel 升序 //FRefuel DESC降序
                    FVersion: "1.0.0"
                }, function (data) {
                    //console.log("加油次数",data);
                    if (data.FObject.length != 0) {
                        _this.allSLFTotalCount = data.FObject.Table[0].FTotalCount;
                        let tempArr = _this.getUsableData(data.FObject.Table1, "refuel");
                        setTimeout(function(){
                            _this.allSwitchLockInfo = tempArr;
                        },200)
                    }

                });
            },
            //请求单个车辆异常次数
            doFuelImproperQuery(){
                let _this = this;
                _this.FuelImproperInfo.length=0;
                let time = this.queryDate;
                let startTime = this.parseUTC(time[0]);
                let endTime = this.parseUTC(time[1]);
                let letFTokenID = this.$store.state.FTokenID;
                $.post("web/FleetManager/FleetManager_Report", {
                    FTokenID: letFTokenID,
                    FAction: "QueryFuelImproperByFVehicleGUID",
                    FVehicleGUID: _this.FuelImproperCarFGUID,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FPageIndex: _this.pageIndex_Improper,
                    FPageSize: _this.pageSize_Improper,
                    FOrderBy: "FImproper",//FStartDateTime 升序 //FStartDateTime DESC 降序 //FRefuel 升序 //FRefuel DESC降序
                    FVersion: "1.0.0"
                }, function (data) {
                    //console.log(data);
                    if (data.FObject.length != 0) {
                        _this.FuelImproperFTotalCount = data.FObject.Table[0].FTotalCount;
                        let tempArr = _this.getUsableData(data.FObject.Table1, "improper");
                        setTimeout(function(){
                            _this.FuelImproperInfo = tempArr;
                        },200)
                    }
                });
            },
            //请求任务单详情数据
            doDetailsQuery(){
                let _this = this;
                let letFTokenID = this.$store.state.FTokenID;
                //console.log(row.FVehicleGUID+","+startTime+","+endTime+","+queryDate);
                $.post("web/SmartDistribution/SmartDistribution_Report", {
                    FTokenID: letFTokenID,
                    FAction: "QueryReportDeliveryReportOpenDetail",
                    FTripGUID: _this.DetailsFTripGUID,
                    FPageSize:_this.pageSize_Details,
                    FDataType:_this.selectedOptions[0],
                    FPageIndex:_this.pageIndex_Details,
                    FVersion: "1.0.0"
                }, function (data) {
                    console.log("开关锁详情",data);
                    if (data.Result == "200") {
                        if (data.FObject.length != 0) {
                            let temp=_this.getUsableData(data.FObject.Table1,"details");
                            _this.allSLFTotalCount=data.FObject.Table[0].FTotalCount;
                            setTimeout(function(){
                                _this.allSwitchLockInfo=temp;
                            },500)
                        } else {
                            _this.warningDialogMsg("_暂无数据_!", "warning");
                        }
                    } else {
                        _this.warningDialogMsg("_暂无数据_!", "warning");
                    }


                });
            },
//			重置图表
            resetChartCollect(type){
                //console.log(this.tempCountData);
                this.getUsableData(this.tempCountData, "countChart");
                this.showChartCollectCharts(type);
            },
            afterSetExtremes(e){
                let type=e.target.chart.renderTo.id;
                //console.log(e.target.chart.renderTo.id);
                let FVehicleGUID="";
                switch (type){
                    case "chartCollect":
                        FVehicleGUID=this.FVehicleGUID_Count;
                        break;
                    case "chartRefuel":
                        FVehicleGUID=this.FVehicleGUID_Refuel;
                        break;
                    case "chartImproper":
                        FVehicleGUID=this.FVehicleGUID_Improper;
                        break;
                }
                let timeDiff=e.max-e.min;
                if(timeDiff>12*60*60*1000){
                    console.log("时间太长了!")
                    return false;
                }else {
                    let beginDate=this.parseUTC(moment(new Date(e.min)).format("YYYY-MM-DD HH:mm:ss"));
                    let endDate=this.parseUTC(moment(new Date(e.max)).format("YYYY-MM-DD HH:mm:ss"));
                    //console.log(beginDate,endDate);
                    this.doChartNotReduceQuery(beginDate,endDate,FVehicleGUID,type)
                }
            },
//			请求没有经过稀释的油位数据
            doChartNotReduceQuery(beginDate,endDate,FVehicleGUID,type){
                //this.CountLicense = row.FVehicleName;
                if(type=="chartCollect"){
                    this.loadingCharts = true;
                }
                let _this = this;
                _this.option.series[0].data.length = 0;
                _this.option.series[1].data.length = 0;
                _this.option.series[2].data.length = 0;
                let startTime = beginDate;
                let endTime = endDate;
                let letFTokenID = this.$store.state.FTokenID;
                //console.log(startTime+","+endTime);
                let queryDate = "";
                let middleDate = "";
                if ((startTime.substring(0, 10)).toString() != (endTime.substring(0, 10)).toString()) {
                    //console.log(_this.dataScope(startTime.substring(0,10),endTime.substring(0,10)));
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
                //console.log(row.FVehicleGUID+","+startTime+","+endTime+","+queryDate);
                $.post("web/FleetManager/FleetManager_LBS", {
                    FTokenID: letFTokenID,
                    FAction: "QueryFuelTrackDataByFVehicleGUID",
                    FVehicleGUID: FVehicleGUID,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FTableDate: queryDate,
                    FVersion: "1.0.0"
                }, function (data) {
                    if (data.Result == "200") {
                        //console.log(data);
                        if (data.FObject.length != 0) {
                            data.FObject = JSON.hunpack(eval(data.FObject), 1);
                            //console.log("油位曲线",data);
                            _this.getUsableData(data.FObject, "countChart");
                            //_this.option.navigator.xAxis.tickInterval = parseInt((data.FObject.length) / 14);
                            //_this.option.xAxis.tickInterval = parseInt((data.FObject.length) / 18);
                            _this.showChartCollectCharts("collect");
                        } else {
                            _this.warningDialogMsg("_暂无数据_!", "warning");
                            _this.removeTab("4");
                        }
                    } else {
                        _this.warningDialogMsg("_数据加载错误_!", "warning");
                        _this.showChartCollect = false;
                    }


                });
            },
            //将查询时间向前后各推15分钟
            addFifteenMinute(type, time){
                if (type == "b") {
                    let timeStr = this.GetDateSeconds(time) - (60 * 120);
                    return this.transDate(timeStr);
                }
                if (type == "e") {
                    let timeStr = this.GetDateSeconds(time) + (60 * 120);
                    return this.transDate(timeStr);
                }
            },
            //请求加油/异常消耗次数折线图
            doRefuelAndImproperQuery(row, type){
                //console.log(row);
                if(type=="refuel"){
                    this.loadingRefuelCharts=true;
                }else {
                    this.loadingImproperCharts=true;
                }
                let _this = this;
                let startTime = this.addFifteenMinute("b", this.parseUTC(row.FStartDateTime));
                let endTime = this.addFifteenMinute("e", this.parseUTC(row.FStopDateTime));
                //console.log(endTime);
                //console.log(this.addFifteenMinute("e",endTime));
                //console.log(startTime+","+endTime);
                let letFTokenID = this.$store.state.FTokenID;
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
                //console.log(row.FVehicleGUID+","+startTime+","+endTime+","+queryDate);
                $.post("web/FleetManager/FleetManager_LBS", {
                    FTokenID: letFTokenID,
                    FAction: "QueryFuelTrackDataByFVehicleGUID",
                    FVehicleGUID: row.FVehicleGUID,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FTableDate: queryDate,
                    //FDataType:"Curves",
                    FVersion: "1.0.0"
                }, function (data) {
                    //console.log(data);
                    if (data.Result == "200") {
                        if (data.FObject.length != 0) {
                            data.FObject = JSON.hunpack(eval(data.FObject), 1);
                            //console.log(data);
                            if (type == "refuel") {
                                _this.getUsableData(data.FObject, "refuelchart");
                                _this.showChartCollectCharts("refuel");
                                _this.loadingRefuelCharts=false;
                            } else if (type == "improper") {
                                _this.getUsableData(data.FObject, "improperchart");
                                _this.showChartCollectCharts("improper");
                                _this.loadingImproperCharts=false;
                            }
                        } else {
                            _this.warningDialogMsg("_暂无数据_!", "warning");
                        }
                    } else {
                        _this.warningDialogMsg("_暂无数据_!", "warning");
                    }


                });
            },
            //汇总折线图
            showChartCollectCharts(type){
                let _this = this;
                switch (type){
                    case "collect"://汇总曲线
                        _this.showChartCollect = true;
                        HighChart.chart("chartCollect", _this.option);
                        this.loadingCharts = false;
                        console.timeEnd("drawCharts");
                        break;
                    case "refuel"://加油曲线
                        HighChart.chart("chartRefuel", _this.RefuelOption);
                        break;
                    case "improper"://异常曲线
                        HighChart.chart("chartImproper", _this.ImproperOption);
                        break;
                    case "other_r"://跳转到加油次数,显示稀释过后的这个时间段的曲线
                        HighChart.chart("chartRefuel", _this.option);
                        break;
                    case "other_i"://跳转到异常次数,显示稀释过后的这个时间段的曲线
                        HighChart.chart("chartImproper", _this.option);
                        break;
                }


            },
            //加油次数折线图
//			showChartRefuel(){
//				let _this = this;
//				window.setTimeout(function () {
////					HighChart.chart("chartRefuel", _this.RefuelOption);
//					HighChart.chart("chartRefuel", _this.option);
//				}, 200)
//			},
//			showChartImproper(){
//				let _this = this;
//				window.setTimeout(function () {
////					HighChart.chart("chartImproper", _this.ImproperOption);
//					HighChart.chart("chartImproper", _this.option);
//				}, 200)
//			},
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
//			初始化图表
            initCharts(type){
                switch (type){
                    case "refuelchart":
                        this.RefuelOption.series[0].data.length=0;
                        this.RefuelOption.series[1].data.length=0;
                        this.RefuelOption.series[2].data.length=0;
                        break;
                    case "improperchart":
                        this.ImproperOption.series[0].data.length=0;
                        this.ImproperOption.series[1].data.length=0;
                        this.ImproperOption.series[2].data.length=0;
                        break;
                    case "countChart":
                        this.option.series[0].data.length=0;
                        this.option.series[1].data.length=0;
                        this.option.series[2].data.length=0;
                        break;
                }
            },
            //优化显示数据
            getUsableData(arr, type){
                let result = arr;
                for (let i = 0; i < result.length; i++) {
                    if(type=="collect"){
                        result[i].FDeliveryTime = this.parseGMT(result[i].FDeliveryTime);
                        result[i].FFinishTime = this.parseGMT(result[i].FFinishTime);
                    }else if(type=="details"){
                        result[i].FDeliveryTime = this.parseGMT(result[i].FDeliveryTime);
                        //解析地址
                        if (result[i].FCloseLongitude != "" || result[i].FCloseLatitude != undefined||result[i].FOpenLatitude != "" || result[i].FOpenLongitude != undefined) {
                            let pointObj1 = {lat: result[i].FOpenLatitude, lng: result[i].FOpenLongitude};
                            let point1 = this.parsePoint(this.$store.state.globalMapType, pointObj1);
                            let pointObj2 = {lat: result[i].FCloseLatitude, lng: result[i].FCloseLongitude};
                            let point2 = this.parsePoint(this.$store.state.globalMapType, pointObj2);
                            this.geocoder(this.$store.state.globalMapType, point1, result[i], "openAddress");
                            this.geocoder(this.$store.state.globalMapType, point2, result[i], "closeAddress");
                        }
                        if(result[i].FOpenReson===0){
                            if(result[i].FIsReplace===1){
                                result[i].FOpenReson="_代收货_";
                            }else if(result[i].FIsReplace===2){
                                result[i].FOpenReson="_开锁收货_";
                            }else {
                                result[i].FOpenReson="_开锁收货_";
                            }
                        }else if(result[i].FOpenReson===1){
                            result[i].FOpenReson="_绿通开锁_";
                        }else if(result[i].FOpenReson===2){
                            result[i].FOpenReson="_其他开锁_";
                        }
                        result[i].FOpenTime = this.parseGMT(result[i].FOpenTime);
                        result[i].FCloseTime = this.parseGMT(result[i].FCloseTime);
                    }
                }
                //解析地址
                /*if (type != "count" && type != "improperchart" && type != "countChart" && type != "refuelchart") {
                 if (result[i].FLatitude != "" || result[i].FLongitude != undefined) {
                 let pointObj = {lat: result[i].FLatitude, lng: result[i].FLongitude};
                 let point = this.parsePoint(this.$store.state.globalMapType, pointObj);
                 this.geocoder(this.$store.state.globalMapType, point, result[i], "address");
                 }
                 }*/
                return result;
            },
            //添加图表标签页
            addCountTab(){
                if (this.isRepetition("4")) {
                    this.editableTabs.push({
                        title: this.CountLicense + "-_油位曲线_",
                        name: "4",
                        content: ""
                    });
                } else {
                    for (let i = 0; i < this.editableTabs.length; i++) {
                        if (this.editableTabs[i].name == "4") {
                            this.editableTabs[i].title = this.CountLicense + "-_油位曲线_";
                        }
                    }
                }


                this.activeName = "4";
                this.switchoverTable(this.activeName);
            },
            //添加单辆车加油次数标签页
            addDetailsTab(){
                if (this.isRepetition("2")) {
                    this.editableTabs.push({
                        title: this.DetailsFAssetID,
                        name: "2",
                        content: ""
                    });
                } else {
                    for (let i = 0; i < this.editableTabs.length; i++) {
                        if (this.editableTabs[i].name == "2") {
                            this.editableTabs[i].title = this.DetailsFAssetID;
                        }
                    }
                }


                this.activeName = "2";
                this.switchoverTable(this.activeName);
            },
            //添加单辆车异常次数标签页
            addFuelImproperTab(){
                if (this.isRepetition("3")) {
                    this.editableTabs.push({
                        title: this.FuelImproperLicense + "-_异常消耗_",
                        name: "3",
                        content: ""
                    });
                } else {
                    for (let i = 0; i < this.editableTabs.length; i++) {
                        if (this.editableTabs[i].name == "3") {
                            this.editableTabs[i].title = this.FuelImproperLicense + "-_异常消耗_";
                        }
                    }
                }
                this.activeName = "3";
                this.switchoverTable(this.activeName);
            },
            isRepetition(id){
                //console.log(this.editableTabs);
                if (this.editableTabs.length == 0) {
                    return true;
                } else {
                    for (let i = 0; i < this.editableTabs.length; i++) {
                        //console.log(this.editableTabs[i].name+","+id);
                        if (this.editableTabs[i].name == id) {
                            return false;
                        } else {
                            //console.log(i+","+this.editableTabs.length);
                            if (i == this.editableTabs.length - 1) {
                                return true;
                            }
                        }
                    }
                }

            },
            //移除tab
            removeTab(targetName) {
                let tabs = this.editableTabs;
                let activeName = this.activeName;
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].name == targetName) {
                        tabs.splice(i, 1);
                    }
                }
                if(targetName=="4"){this.adjustPage(1)};
                this.switchoverTable("1");
                this.activeName = "1";
                this.show_SLCountInfo = true;
            },
            //切换tab
            switchoverTable(activeName){
                //let name=tab.name;
                //console.log(activeName);
                switch (activeName) {
                    case "1":
                        this.show_SLCountInfo = true;
                        this.show_allSwitchLockInfo = false;
                        this.show_FuelImproper = false;
                        this.showChartCollect = false;
                        this.show_pagination = true;
                        this.loadingCharts = false;
                        break;
                    case "2":
                        this.show_SLCountInfo = false;
                        this.show_allSwitchLockInfo = true;
                        this.show_FuelImproper = false;
                        this.showChartCollect = false;
                        this.show_pagination = true;
                        this.loadingCharts = false;
                        this.isShowRefuel=true;
                        this.isShowImproper=false;
                        break;
                }
            },
            switchoverTab(tab){
                let name = tab.name;
                this.switchoverTable(name);
            },
            datelimit(date1, date2, limit){
                var a = date1.substr(5, 2);
                var b = date1.substr(8, 2);
                var c = date1.substr(0, 4);
                var a2 = date2.substr(5, 2);
                var b2 = date2.substr(8, 2);
                var c2 = date2.substr(0, 4);
                //alert(date1 + "__" + date2 + "\n\n" + c + "__" + a + "__" + b + "\n\n" + c2 + "__" + a2 + "__" + b2);
                if (c === c2) {
                    if (a == a2 && b >= b2) {
                        if (Number(b) - Number(b2) <= limit) {
                            //alert(Number(b) + "-" + Number(b2) + "=" + (Number(b) - Number(b2)));
                            return true;
                        }
                    } else if (Number(a) - Number(a2) == 1) {
                        //alert(Number(a) + "-" + Number(a2) + "=" + (Number(a) - Number(a2)));
                        if (30 + Number(b) - Number(b2) <= limit) {
                            return true;
                        }
                    }
                } else if (c - c2 === 1) {
                    if ((Number(a) == 1) && (Number(a2) == 12)) {
                        if (30 + Number(b) - Number(b2) <= limit) {
                            return true;
                        }
                    }
                } else if (c2 - c === 1) {
                    if ((Number(a2) == 1) && (Number(a) == 12)) {
                        if (30 + Number(b2) - Number(b) <= limit) {
                            return true;
                        }
                    }
                }
                return false;
            },
        },
        components: {
            baiduMap,
            VehicalSelectDialog
        },
        watch: {
            screenHeight () {
                this.adjustPage();
            }
        },

    }
</script>
<style scoped>
    .img_chart {
        display:inline-block;
        width:16px;
        height:16px;
        background-image:url(/static/img/img_chart.png);
        background-repeat:no-repeat;
    }

    .img_refuel {
        display:inline-block;
        width:16px;
        height:16px;
        background-image:url(/static/img/refuel.png);
        background-repeat:no-repeat;
    }

    .img_fuel_abnormal {
        display:inline-block;
        width:16px;
        height:16px;
        background-image:url(/static/img/fuel_abnormal.png);
        background-repeat:no-repeat;
    }

    .img_track {
        display:inline-block;
        width:16px;
        height:16px;
        background-image:url(/static/img/img_track.png);
        background-repeat:no-repeat;
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

    /*按钮样式 可用于全局 也可单独用在组件，主要看以后表格内的按钮怎么命名*/
    /*.el-button不能全局可能有些报表内部会用到饿了么的按钮组件*/
    .el-button {
        border:none;
        border-radius:0;
        padding:8px 26px;
        font-size:12px;
    }

    .search {
        background-color:#005fc6;
    }

    .reset {
        background-color:#547ca9;
    }

    .export {
        background-color:#4aae58;
        padding:8px 16px;
    }

    button.cancel {
        background-color:transparent;
    }

    .read {
        background-color:#f39b2a;
        padding:8px 16px;
    }

    /*fontawesome 里面字体图标的样式*/
    .fa-share-square-o {
        margin-right:3px;
    }

    .fa-envelope-open-o {
        margin-right:3px;
    }

    .el-dialog__body {
        height:600px;
    }

    #chartCollect {
        height:450px;
    }

    tbody .el-button {
        padding:0;
    }

    .mapModal {
        position:absolute;
        height:245px;
        width:300px;
        margin-top:-245px;
        z-index:10;
        right:0px;
        background:white;
        border:1px solid #cccccc
    }

    .mapModal p {
        font-size:12px;
        margin-bottom:6px;
    }

    .mapModal p span {
        font-weight:bold;
    }
    .el-time-panel {
        width:180px !important;
    }
    #chartCollect {
        position:relative;
    }
    .resetChartCollect {
        position:fixed;
        right:8%;
        top:190px;
        border:none;
        outline:none;
        padding:4px 12px;
    }
    .el-date-editor--daterange.el-input {
        width: 205px;
    }
</style>
<style>
    .keyInput .el-input__inner{
        padding-right: 10px;
        height: 28px;
        width: 195px;
        line-height: 28px;
        font-size: 12px;
        border-radius: 0;
    }
    .oilWearDateSelect .el-time-spinner__list::before {
        height:75px;
    }
    .oilWearDateSelect .el-scrollbar__wrap {
        margin-right:-11px !important;
    }

    .switchLockOpenType .el-input__inner ,.switchLockOpenType .el-cascader__label{
        padding-right: 10px;
        height: 28px;
        width: 162px;
        line-height: 28px;
        font-size: 12px;
        border-radius: 0;
    }
    .switchLockOpenType .el-cascader__label {
        height: 46px;
        line-height: 46px;
    }

    .showPictureDialog .no_found {
        height: 460px;
        vertical-align: middle;
        text-align: center;
        width: 600px;
        margin: 20px auto;
        background-color: #ccc;
    }

    .showPictureDialog .no_found img {
        margin-top: 60px;
    }

    .showPictureDialog .no_found .not_found_text {
        position: absolute;
        left:50%;
        top:65%;
        transform: translate(-50%,0%);
        font-size: 30px;
    }
</style>

