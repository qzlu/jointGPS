<template>
    <section>
        <vehical-select-dialog v-on:child="get"></vehical-select-dialog>
        <div class="mymodal">
            <div class="modal-header" style="position: absolute;left: 890px;height: 20px;width: 20px;border: none;padding: 0px;z-index: 2;">
                <button type="button" @click="closeMymodal" style="height: 30px;width: 30px;background:transparent;outline:none;border: none;">
                    <!--<span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal"></span>-->
                    <i class="fa fa-times" aria-hidden="true" style="font-size: 24px;"></i>
                </button>
            </div>
            <div class="modal-body" style="padding: 0px">
                <baidu-map ref="map" :fa-data="[mapToolShow]"></baidu-map>
            </div>
            <div class="mapModal">
                <header style="background: #f9f9f9 ;height:34px;padding: 10px">
                    <h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{FAssetID}}</h4>
                </header>
                <div style="padding: 15px">
                    <p>
                        <span>_上锁时间_：</span>{{FStartDateTime}}</p>
                    <p>
                        <span>_开锁时间_：</span>{{FEndDateTime}}</p>
                    <p>
                        <span>_开锁方式_：</span>{{FOpenType}}</p>
                    <p :title="startAdress">
                        <nobr>
                            <span>_开始位置_：</span>{{startAdress}}</nobr>
                    </p>
                    <p :title="endAdress">
                        <nobr>
                            <span>_结束位置_：</span>{{endAdress}}</nobr>
                    </p>
                </div>
            </div>
        </div>
        <!-- /.modal-content -->
        <div id="operate_wrapper">
            <div class="box-header">
                <div class="block">
                    <span class="operatExp">_选择设备_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal">
                        <!---->
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="fa fa-lock" style="font-size: 18px"></i>
                        </a>
                        <input type="text" class="search-input" readonly="readonly">
                    </div>
                </div>
                <div class="block">
                    <span class="operatExp">_选择时间_</span>
                    <el-date-picker size="small" v-model="value3" :clearable="false" type="daterange" @change="getTime" :picker-options="pickerOptions2"
                        placeholder="_选择时间范围_">
                    </el-date-picker>
                </div>
                <div class="btnList">
                    <el-button type="primary" class="search" @click="doQuery()">_查询_</el-button>
                    <el-button type="primary" class="reset" @click="reset">_重置_</el-button>
                    <el-button type="primary" class="export" @click="exportTable()">
                        <i class="fa fa-share-square-o"></i>_导出文件_</el-button>
                </div>
                <div style="float: right;margin-right: 20px">
                    <el-radio class="radio" v-model="radio" label="1" style="margin: 0px" v-if="activeName=='all'">_显示汇总图表_</el-radio>
                    <el-checkbox class="radio" v-model="radio1" label="1" style="margin: 0px">_不显示_0_里程_</el-checkbox>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" @tab-remove="removeTab" @tab-click="closeMymodal">
            <el-tab-pane label="_汇总_" name="all">
                <div class="el_table_wrap" id="el_table_wrap">
                    <!--   <div v-bind:height="table_height"> -->
                    <el-table :data="table0" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%">
                        <el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
                        <el-table-column prop="" width="80" label="_操作_">
                            <template scope="scope">
                                <a href="javascript:" @click="addTab(scope.$index,scope.row)" v-if="scope.row.TripCount!=0">_详情_</a>
                                <a href="javascript:" v-if="scope.row.TripCount==0" style="cursor: not-allowed;color:#cccccc">_详情_</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="FShortName" label="_公司简称_" width="120"></el-table-column>
                        <el-table-column prop="FAssetID" label="_电子锁_ ID" width="120" sortable></el-table-column>
                        <!--  <el-table-column  prop="FVehicleName" sortable label="_车牌号_" width="100"></el-table-column>-->
                        <el-table-column prop="TripCount" sortable label="_趟次次数_" width="160"></el-table-column>
                        <el-table-column prop="" label=""></el-table-column>
                    </el-table>
                    <div class="mymodal1 mymodalCommon" :class="{'chartModal':!fullScreen,'fullScreen':fullScreen}">
                        <div class="modal-header">
                            <div style="float: right">
                                <button type="button" @click="open" class="btn-white btn-custom" style="width: 60px">
                                    <i class="fa fa-arrows-alt  padding-r-8"></i>{{word}}
                                </button>
                                <button type="button" @click="radio=''" style="height: 20px;width: 20px;background:white;border: none;">
                                    <span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal;"></span>
                                </button>
                            </div>
                        </div>
                        <div class="countChart" id="countChart"></div>
                    </div>
                    <!-- </div>  -->
                </div>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange0" @current-change="handleCurrentChange0" :current-page="pageIndex0" :page-sizes="[10, 20, 30,]"
                            :page-size="pageSize0" layout="prev, pager, next, jumper,total,sizes" :total="total0">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="_全部_" name="first">
                <div class="el_table_wrap">
                    <el-table :data="table1" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%">
                        <el-table-column prop="" label="_序号_" width="80">
                            <template scope="scope">
                                <span>{{scope.$index+1+pageSize1*(pageIndex1-1)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" width="90" label="_操作_">
                            <template scope="scope">
                                <a href="javascript:" style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看轨迹_</a>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column  prop="FShortName"  label="_公司简称_" width="120"></el-table-column> -->
                        <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable></el-table-column>
                        <el-table-column prop="FVehicleName" sortable label="_车牌号_" width="100"></el-table-column>
                        <el-table-column prop="FStartDateTime" sortable label="_上锁时间_" width="160"></el-table-column>
                        <el-table-column prop="starAdress" label="_上锁位置_" width="260" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FEndDateTime" sortable label="_开锁时间_" width="160"></el-table-column>
                        <el-table-column prop="endAdress" label="_开锁位置_" width="260" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FOpenType" label="_开锁方式_" width="160"></el-table-column>
                        <el-table-column prop="FCardNo" sortable label="_刷卡卡号_" width="160"></el-table-column>
                        <el-table-column prop="FTotalDuration" sortable label="_全程耗时_" :sort-method="sortMethod" :formatter="formatter" width="160"></el-table-column>
                        <el-table-column prop="FTotalMileage" sortable label="_运行里程_" width="160"></el-table-column>
                        <el-table-column prop="" label=""></el-table-column>
                    </el-table>
                </div>
                <div id="pagination" class="pagination">
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pageIndex1" :page-sizes="[10, 20, 30]"
                            :page-size="pageSize1" layout="prev, pager, next, jumper,total,sizes" :total="total1">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name" closable>
                <div class="el_table_wrap">
                    <div class="el_table_wrap">
                        <el-table :data="table2" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%">
                            <el-table-column prop="" label="_序号_" width="80">
                                <template scope="scope">
                                    <span>{{scope.$index+1+pageSize2*(pageIndex2-1)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" width="90" label="_操作_">
                                <template scope="scope">
                                    <a href="javascript:" style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看轨迹_</a>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column  prop="FShortName"  label="_公司简称_" width="120"></el-table-column> -->
                            <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable></el-table-column>
                            <el-table-column prop="FVehicleName" sortable label="_车牌号_" width="100"></el-table-column>
                            <el-table-column prop="FStartDateTime" sortable label="_上锁时间_" width="160"></el-table-column>
                            <el-table-column prop="starAdress" label="_上锁位置_" width="260" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="FEndDateTime" sortable label="_开锁时间_" width="160"></el-table-column>
                            <el-table-column prop="endAdress" label="_开锁位置_" width="260" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="FOpenType" label="_开锁方式_" width="160"></el-table-column>
                            <el-table-column prop="FCardNo" sortable label="_刷卡卡号_" width="160"></el-table-column>
                            <el-table-column prop="FTotalDuration" sortable label="_全程耗时_" :sort-method="sortMethod" :formatter="formatter" width="160"></el-table-column>
                            <el-table-column prop="FTotalMileage" sortable label="_运行里程_" width="160"></el-table-column>
                            <el-table-column prop="" label=""></el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <div class="block">
                            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="pageIndex2" :page-sizes="[10, 20, 30,]"
                                :page-size="pageSize2" layout="prev, pager, next, jumper,total,sizes" :total="total2">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
    import HighCharts from 'highcharts/highstock'
    import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
    import baiduMap from '../Common/baidu_map.vue'
    export default {
        data() {
            return {
                radio: '',
                radio1: false,
                fullScreen: false,
                total0: 0,
                total1: 0,
                total2: 0,
                pageSize0: 20,
                pageSize1: 20,
                pageSize2: 20,
                pageIndex0: 1,
                pageIndex1: 1,
                pageIndex2: 1,
                activeName: 'all',
                pickerOptions2: {
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
                // value3: [new Date(), new Date()],
                value3: [new Date(), new Date()],
                value4: '',
                table_height: null,
                countHeight: null,
                table0: null,
                table1: null,
                table2: null,
                objDetail: null,
                tabIndex: 2,
                editableTabs: [],
                countOption: {
                    chart: {
                        type: 'column',
                        zoomType: 'x',
                        marginLeft: 60,
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        enabled: true,
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    scrollbar: {
                        enabled: true,
                        barBackgroundColor: "#2885eb",
                        liveRedraw: false,
                        showFull: false
                    },
                    title: {
                        text: '_趟次数_',
                    },
                    xAxis: {
                        categories: '',
                        crosshair: true,
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: '_单位_(_次_)',
                            margin: -45,
                            align: "high",
                            y: -20,
                            rotation: 0
                        },
                        lineColor: "#d7d7d7",
                        lineWidth: 1
                    },
                    tooltip: {
                        //             valueSuffix: 'bar'
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table style="width: 100px; overflow: hidden">',
                        pointFormat: '<tr><td style="color:{series.color};padding:0"> </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}_次_</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: ''
                },
                table0: null,
                table1: null,
                FAssetID: '',
                address: '',
                FStartDateTime: '',
                FEndDateTime: '',
                startAdress: "",
                endAdress: "",
                FOpenType: '',
                SystemID: 2,

                //记录路由传入的assetID
                queryID: null
            }
        },
        props: {
            screenHeight: Number
        },
        activated: function () {
            if (this.$route.params.ID != undefined) {
                console.log(this.$route.params.ID);
                this.queryID = this.$route.params.ID;
                this.doQuery("pageSize0", "pageIndex0")
            } else {
                this.queryID = null;
            }
        },
        mounted() {
            this.$refs.map.initMap();
            $("#map-wrapper").height(570);
            /*HighChart.setOptions({
              lang: {
                resetZoom: '_重置_'
              }
            });*/
            setTimeout(() => {
                this.adjustPage();
            }, 100);
        },
        computed: {
            word: function () {
                if (this.fullScreen) {
                    return "_还原_"
                } else {
                    return "_全屏_"
                }
            },
            Ftype: function () {
                if (this.radio1) {
                    return "Mileage"
                } else {
                    return "All"
                }
            }
        },
        methods: {
            formatter(row, column, cellValue) {
                let keepTime = moment(row.FEndDateTime).unix() - moment(row.FStartDateTime).unix();
                return this.formatSeconds(keepTime);
            },
            handleSelectionChange(val) {
            },
            handleSizeChange0(val) {
                this.pageSize0 = val;
                this.doQuery("pageSize0", "pageIndex0")
            },
            handleSizeChange1(val) {
                this.pageSize1 = val;
                this.doQuery("pageSize1", "pageIndex1")
            },
            handleSizeChange2(val) {
                this.pageSize2 = val;
                this.checkDetail();
            },
            handleCurrentChange0(val) {
                this.pageIndex0 = val;
                this.doQuery("pageSize0", "pageIndex0");
            },
            handleCurrentChange1(val) {
                this.pageIndex1 = val;
                this.doQuery("pageSize1", "pageIndex1");
            },
            handleCurrentChange2(val) {
                this.pageIndex2 = val;
                this.checkDetail();
            },
            adjustPage() {
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) - 70;
                //this.countHeight=this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) - 70;
            },
            get: function (data) {
                $('.search-input').val("_已选_" + data[0].length);
                $('.search-input').attr('title', data[0])
                $('.search-input').attr('fguid', data[1])
            },
            //重置表单
            reset: function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid');
                this.value3 = [new Date(), new Date()];
                this.table0 = null;
                this.table1 = null;
                this.editableTabs = [];
                this.total0 = 0;
                this.total1 = 0;
                this.activeName = 'all';
                this.$refs.lock.$children[1].setCheckedKeys([]);
            },
            getTime: function (value) {
                return this.value4 = value;
            },
            /*  exportTable(){
               let th,tb,table,name;
               if(this.activeName=="all"){
                  th=['序号', '操作', '公司简称', '电子锁ID', '趟次次数'];
                  tb=['RowNo', '', 'FShortName', 'FAssetID', 'TripCount'];
                  table=this.table0;
                  name="趟次报表(汇总)";
               }else if(this.activeName=="first"){
                  th=['序号', '操作', '终端号', '车牌号', '上锁时间','上锁地点','开锁时间','开锁地点','开锁方式','全程耗时','运行里程'];
                  tb=['RowNo', '', 'FAssetID', 'FVehicleName', 'FStartDateTime', 'starAdress', 'FEndDateTime', 'endAdress', 'FOpenType', 'FTotalDuration', 'FTotalMileage'];
                  table=this.table1;
                  name="趟次报表(全部)";
               }else{
                 return
               }
               if(table==null||table.length==0){
                 this.$message({
                     showClose: true,
                     message: '_无数据_',
                     type: 'warning'
                 });
                 return;
               }
               this.export2Excel(th,tb,table,name)
             }, */
            doQuery: function (pageSize, pageIndex) {
                this.closeMymodal();
                var curpageIndex;
                var curpageSize;
                var _this = this;
                var FVehicleID = null;
                if (this.queryID != null) {
                    FVehicleID = this.queryID;
                } else {
                    FVehicleID = $(".search-input").attr("fguid");
                };

                var startTime;
                var endTime;
                if (this.value3) {
                    var time0 = moment(this.value3[0]).format("YYYY-MM-DD");
                    var time1 = moment(this.value3[1]).format("YYYY-MM-DD");;
                    //startTime = this.parseUTC(time0 + ' 00:00:00');
                    //endTime = this.parseUTC(time1 + ' 23:59:59');
                    startTime = this.parseUser(time0 + ' 00:00:00');
                    endTime = this.parseUser(time1 + ' 23:59:59');
                } else {
                    _this.$message({
                        showClose: true,
                        message: '_请选择时间_',
                        type: 'warning'
                    });
                    return
                }
                let t1 = new Date(this.value3[0]).getTime();
                let t2 = new Date(this.value3[1]).getTime();
                if (t2 - t1 > (31 * 24 * 60 * 60 * 1000)) {
                    _this.$message({
                        showClose: true,
                        message: '开始时间与结束时间不能大于31天',
                        type: 'warning'
                    });
                    return
                }
                if (FVehicleID != undefined) {
                    if (arguments.length == 0) {
                        //任意情况下点击doQuery
                        if (this.editableTabs.length != 0) {
                            this.editableTabs = [];
                            if (this.activeName !== "all" && this.activeName !== "first") {
                                this.activeName = 'all';
                            }
                        };
                        //页码初始化
                        _this.pageIndex0 = 1;
                        _this.pageIndex1 = 1;
                        _this.pageIndex2 = 1;
                        _this.activeName = 'all';
                        getGather();
                        getAll();
                    } else if (arguments[0] == "pageSize0") {
                        getGather();
                    } else if (arguments[0] == "pageSize1") {
                        getAll();
                    };
                    //汇总
                    function getGather() {
                        let postData = {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "QueryTripCountByFAssetGUIDs",
                            FVehicleGUIDs: FVehicleID,
                            FStartTime: startTime,
                            FEndTime: endTime,
                            FPageSize: _this.pageSize0,
                            FPageIndex: _this.pageIndex0,
                            FVersion: "1.0.0"
                        };
                        $.ajax({
                            'url': '/web/Combine/Combine_Report',
                            'cache': false,
                            'async': true,
                            'type': 'Post',
                            'dataType': 'json',
                            'contentType': 'application/json;charset=utf-8',
                            'data': JSON.stringify(postData),
                            success: function (data) {
                                console.log(data);
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
                                } else if (data.Result == 200) {
                                    var fobj = data;
                                    _this.total0 = FVehicleID.split(",").length;
                                    _this.table0 = fobj.FObject;
                                    if (_this.table0.length == 0) {
                                        _this.$message({
                                            showClose: true,
                                            message: '_未查询到数据_',
                                            type: 'warning'
                                        });
                                    } else {
                                        _this.countOption.xAxis.categories = [];
                                        _this.countOption.series = [{}];
                                        _this.countOption.series[0].data = [];
                                        $.each(_this.table0, function (index, obj) {
                                            _this.countOption.xAxis.categories.push(obj.FAssetID);
                                            _this.countOption.series[0].data.push(obj.TripCount);
                                        });
                                        console.log(_this.countOption);
                                        HighCharts.chart('countChart', _this.countOption);
                                    }
                                }
                            },
                            error: function () {
                                console.log("请求失败")
                            }
                        });
                    }
                    //全部
                    function getAll() {
                        let postData = {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "QueryTripReportByFVehicleGUIDs",
                            FVehicleGUIDs: FVehicleID,
                            FStartTime: startTime,
                            FEndTime: endTime,
                            FPageSize: _this.pageSize0,
                            FPageIndex: _this.pageIndex0,
                            FType: _this.Ftype,
                            FVersion: "1.0.0"
                        };
                        $.ajax({
                            'url': '/web/Combine/Combine_Report',
                            'cache': false,
                            'async': true,
                            'type': 'Post',
                            'dataType': 'json',
                            'contentType': 'application/json;charset=utf-8',
                            'data': JSON.stringify(postData),
                            success: function (data) {
                                console.log(data);
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
                                } else if (data.Result == 200) {
                                    var fobj = data;
                                    _this.total1 = fobj.FObject.Table[0].FTotalCount;
                                    _this.table1 = fobj.FObject.Table1;
                                    $.each(_this.table1, function (index, obj) {
                                        _this.$set(obj, "starAdress", null);
                                        _this.$set(obj, "endAdress", null);
                                        var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                                        _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                                        var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                                        _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress");
                                        if (obj.FStartTime != null) {
                                            _this.$set(_this.table1[index], 'FStartDateTime', _this.parseGMT(obj.FStartTime.replace(/T/ig, ' ')));
                                        }
                                        if (obj.FEndTime != null) {
                                            _this.$set(_this.table1[index], 'FEndDateTime', _this.parseGMT(obj.FEndTime.replace(/T/ig, ' ')));
                                        } else {
                                            _this.$set(_this.table1[index], 'FEndDateTime', '--')
                                        }

                                        if (obj.FOpenType == 1) {
                                            obj.FOpenType = "_刷卡开锁_"
                                        } else if (obj.FOpenType == 2) {
                                            obj.FOpenType = "_远程开锁_"
                                        } else if (obj.FOpenType == 3) {
                                            obj.FOpenType = "_蓝牙开锁_"
                                        } else {
                                            obj.FOpenType = "--"
                                        }
                                    });
                                }
                            },
                            error: function () {
                                console.log("请求失败")
                            }
                        });
                    }







                } else if (FVehicleID == undefined) {
                    this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                    this.table0 = [];
                    this.table1 = [];
                    this.total0 = 0;
                    this.total1 = 0;
                    this.activeName = 'all';
                } else if (this.value4 == '') {
                    this.$message({
                        showClose: true,
                        message: '_请选择时间_',
                        type: 'warning'
                    });
                    this.table0 = [];
                    this.table1 = [];
                    this.total0 = 0;
                    this.total1 = 0;
                    this.activeName = 'all';
                }
            },
            //查看详情
            addTab: function (index, row) {
                this.objDetail = row;
                var _this = this;
                let newTabName = ++this.tabIndex + '';
                let table = "mytable" + newTabName;
                var tabName = row.FAssetID;
                this.editableTabs.length = 0;
                this.editableTabs.push({
                    title: tabName,
                    name: newTabName,
                    table: table,
                });
                this.activeName = newTabName;
                this.checkDetail();
            },
            //查看详情时请求数据
            checkDetail: function () {
                this.loading = true;
                var _this = this;
                var startTime;
                var endTime;
                var FVehicleID = this.objDetail.FVehicleGUID;
                var curpageIndex = this.pageIndex2;
                var curpageSize = this.pageSize2;
                var time0 = moment(this.value3[0]).format("YYYY-MM-DD");
                var time1 = moment(this.value3[1]).format("YYYY-MM-DD");;
                //startTime = this.parseUTC(time0 + ' 00:00:00');
                // endTime = this.parseUTC(time1 + ' 23:59:59');
                startTime = this.parseUser(time0 + ' 00:00:00');
                endTime = this.parseUser(time1 + ' 23:59:59');

                let postData = {
                    FTokenID: _this.$store.state.FTokenID,
                    FAction: "QueryTripReportByFVehicleGUIDs",
                    FVehicleGUIDs: FVehicleID,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FPageSize: _this.pageSize0,
                    FPageIndex: _this.pageIndex0,
                    FType: _this.Ftype,
                    FVersion: "1.0.0"
                };
                $.ajax({
                    'url': '/web/Combine/Combine_Report',
                    'cache': false,
                    'async': true,
                    'type': 'Post',
                    'dataType': 'json',
                    'contentType': 'application/json;charset=utf-8',
                    'data': JSON.stringify(postData),
                    success: function (data) {
                        console.log(data);
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
                        } else if (data.Result == 200) {
                            var fobj = data;
                            _this.total2 = fobj.FObject.Table[0].FTotalCount;
                            _this.table2 = fobj.FObject.Table1;
                            $.each(_this.table2, function (index, obj) {
                                _this.$set(obj, "starAdress", null);
                                _this.$set(obj, "endAdress", null);
                                var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                                _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                                var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                                _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress");
                                if (obj.FStartTime != null) {
                                    _this.$set(_this.table2[index], 'FStartDateTime', _this.parseGMT(obj.FStartTime.replace(/T/ig, ' ')));
                                }
                                if (obj.FEndTime != null) {
                                    _this.$set(_this.table2[index], 'FEndDateTime', _this.parseGMT(obj.FEndTime.replace(/T/ig, ' ')));
                                } else {
                                    _this.$set(_this.table2[index], 'FEndDateTime', '--')
                                }
                                if (obj.FOpenType == 1) {
                                    obj.FOpenType = "_刷卡开锁_"
                                } else if (obj.FOpenType == 2) {
                                    obj.FOpenType = "_远程开锁_"
                                } else if (obj.FOpenType == 3) {
                                    obj.FOpenType = "_蓝牙开锁_"
                                } else {
                                    obj.FOpenType = "--"
                                }
                            });
                        }
                    },
                    error: function () {
                        console.log("请求失败")
                    }
                });
            },
            removeTab(targetName) {
                let tabs = this.editableTabs;
                let activeName = this.activeName;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }
                //this.activeName = activeName;
                this.activeName = 'all';
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                this.pageIndex2 = 1;
                this.pageSize2 = 20;
            },
            //全屏
            open: function () {
                this.fullScreen = !this.fullScreen;
                if (this.fullScreen) {
                    $(".el_table_wrap").css("padding-left", '0px');
                    $(".mymodal1").width("100%");
                    $(".mymodal1").height(this.table_height);
                    HighCharts.chart('countChart', this.countOption);
                } else {
                    $(".mymodal1").width("800");
                    $(".mymodal1").height("400");
                    HighCharts.chart('countChart', this.countOption);
                }
            },
            closeMymodal: function () {
                $(".mymodal").css('visibility', 'hidden')
            },
        },
        watch: {
            screenHeight() {
                this.adjustPage();
            },
            radio: function () {
                if (this.table0 != null && this.table0.length != 0) {
                    if (this.radio == 1) {
                        $(".mymodal1").css('visibility', 'visible');
                    } else {
                        $(".mymodal1").css('visibility', 'hidden');
                    }
                } else if (this.table0 == null || this.table0.length == 0) {
                    this.radio = '';
                    this.$message({
                        showClose: true,
                        message: '_请查询_',
                        type: 'warning'
                    });
                } else {
                    this.radio = '';
                    this.$message({
                        showClose: true,
                        message: '_未查询到数据_',
                        type: 'warning'
                    });
                }
            },
            radio1: function () {
                this.doQuery()
            }
        },
        components: {
            VehicalSelectDialog,
            baiduMap,
        }
    }
</script>
<style scoped>
    .countChart {
        position: absolute;
        height: 100%;
        width: 100%;
    }

    .mymodalCommon {
        position: absolute;
        z-index: 999;
        visibility: hidden;
        border: 1px solid #ccc;
        background: white;
    }

    .modal-header {
        background: none;
        padding-top: 5px;
        padding-bottom: 0px;
        height: 30px;
    }

    .chartModal {
        height: 400px;
        width: 800px;
        top: 50%;
        left: 50%;
        margin-left: -400px;
        margin-top: -230px;
    }

    .fullScreen {
        top: 0;
        width: 100%;
    }

    .mapModal {
        position: absolute;
        height: 180px;
        width: 350px;
        margin-top: -180px;
        z-index: 10;
        right: 0px;
        background: white;
        border: 1px solid #cccccc
    }

    .mapModal p {
        font-size: 12px;
        margin-bottom: 6px;
        height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    .mapModal p span {
        font-weight: bold;
    }
</style>