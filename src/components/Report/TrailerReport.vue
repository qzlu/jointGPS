<template>
    <section>
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
            <!-- <div class="mapModal">
			  <header style="background: #f9f9f9 ;height:34px;padding: 10px">
				  &lt;!&ndash;<h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{locationIntro.FVehicleName}}</h4>&ndash;&gt;
			  </header>
			  <div style="padding: 15px">
				  &lt;!&ndash;<p><span>_开始时间_：</span>{{locationIntro.FStartDateTime}}</p>
				  <p><span>_结束时间_：</span>{{locationIntro.FStopDateTime}}</p>
				  <p><span>_持续时长_：</span>{{locationIntro.FKeepSeconds}}</p>
				  <p><span>_位置_：</span>{{locationIntro.address}}</p>&ndash;&gt;
			  </div>
		  </div>-->
        </div>
        <vehical-select-dialog v-on:child="get" ref="vehicle"></vehical-select-dialog>
        <!-- 地图弹窗 -->
        <div id="operate_wrapper">
            <div class="box-header">
                <div class="block">
                    <span class="operatExp">_选择车辆_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal">
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="img-icon icon-carList-dialog"></i>
                        </a>
                        <input type="text" class="search-input" readonly="readonly">
                    </div>
                </div>
                <div class="block">
                    <span class="operatExp">_选择时间_</span>
                    <el-date-picker size="small" v-model="value3" :clearable="false" type="daterange"  :picker-options="pickerOptions2"
                        placeholder="_选择时间范围_">
                    </el-date-picker>
                </div>
                <div class="btnList">
                    <el-button type="primary" class="search" @click="doQuery">_查询_</el-button>
                    <el-button type="primary" class="reset" @click="reset">_重置_</el-button>
                    <el-button type="primary" class="export">
                        <i class="fa fa-share-square-o"></i>_导出文件_</el-button>
                </div>
                <div style="float: right;margin-right: 20px">
                    <el-radio class="radio" v-model="radio" label="1" style="margin: 0px" v-if="activeName=='all'">显示汇总图表</el-radio>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" @tab-remove="removeTab" @tab-click="closeMymodal">
            <el-tab-pane label="_汇总_" name="all">
                <div class="el_table_wrap" id="el_table_wrap">
                    <div v-bind:height="table_height">
                        <el-table :data="table0" stripe style="width: 100%" :height='table_height' element-loading-text="_拼命加载中_" empty-text="_暂无数据_">
                            <el-table-column prop="RowNo" label="_序号_" width="80">
                            </el-table-column>
                            <el-table-column prop="" width="80" label="_操作_">
                                <template scope="scope">
                                    <a href="javascript:" @click="addTab(scope.$index,scope.row)" v-if="scope.row.FCouplingCount!=0">_详情_</a>
                                    <a href="javascript:" v-if="scope.row.FCouplingCount==0" style="cursor: not-allowed;color:#cccccc">_详情_</a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="FShortName" label="_公司名称_" width="120">
                            </el-table-column>
                            <el-table-column prop="FVehicleName" label="_车牌号_" width="100" sortable>
                            </el-table-column>
                            <el-table-column prop="FCouplingCount" label="_接挂次数_" width="140" sortable>
                            </el-table-column>
                            <el-table-column prop="FUnCouplingCount" label="_甩挂次数_" width="140" sortable>
                            </el-table-column>
                            <el-table-column prop="FCouplingTotalMileage" label="_接挂里程_(km)" width="140">
                            </el-table-column>
                            <el-table-column prop="FUnCouplingTotalMileage" label="_甩挂里程_(km)" width="140">
                            </el-table-column>
                            <el-table-column prop="FCouplingTotalDuration" label="_持续总长_" width="150" sortable :sort-method="sortMethod" :formatter="formatter">
                            </el-table-column>
                            <el-table-column prop="" label="" align="center">
                            </el-table-column>
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
                            <div class="tireChart" id="chart-one"></div>
                        </div>
                        <!-- /.modal-content -->
                        <!--<div class='box-charts ' id='box-charts' style='width:100%;height:325px'>-->
                        <!--<div id='chart-one' class='clearfix' style='width:100%;height:300px'></div>-->
                        <!--</div>-->
                    </div>
                </div>

                <div id="pagination" class="pagination">
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange0" @current-change="handleCurrentChange0" :current-page="pageIndex0" :page-sizes="[10, 20, 30,]"
                            :page-size="pageSize0" layout="prev, pager, next, jumper,total,sizes" :total="total0">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="_全部_" name="first">
                <div class="el_table_wrap">
                    <el-table :data="table1" :height="table_height" style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_" empty-text="_暂无数据_">
                        <el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
                        <el-table-column prop="FCouplingStatus" width="80" label="_状态_"></el-table-column>
                        <el-table-column prop="FShortName" label="_公司名称_" width="120"></el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="100" sortable></el-table-column>
                        <el-table-column prop="FStartDateTime" label="_接挂时间_" width="160"></el-table-column>
                        <el-table-column prop="FEndDateTime" label="_最后接挂时间_" width="160"></el-table-column>
                        <el-table-column prop="starAdress" label="_接挂地点_" width="240" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="endAdress" label="_最后接挂地点_" width="240" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FTotalMileage" label="_运行公里_(km)" width="150" sortable></el-table-column>
                        <el-table-column prop="FTotalDuration" label="_持续时长_" width="150" sortable :sort-method="sortMethod" :formatter="formatter"></el-table-column>
                        <el-table-column prop="" label="" align="center">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pageIndex1" :page-sizes="[10, 20, 30,]"
                            :page-size="pageSize1" layout="prev, pager, next, jumper,total,sizes" :total="total1">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name" closable>
                <div class="el_table_wrap">
                    <div class="el_table_wrap">
                        <el-table :data="table2" :height="table_height" style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_" empty-text="_暂无数据_">
                            <el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
                            <el-table-column label="_操作_" align="center" width="140">
                                <template scope="scope">
                                    <a type="text" @click="position(scope.$index,scope.row)">
                                        _查看位置_
                                    </a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="FCouplingStatus" width="80" label="_状态_"></el-table-column>
                            <el-table-column prop="FShortName" label="_公司名称_" width="120"></el-table-column>
                            <el-table-column prop="FVehicleName" label="_车牌号_" width="100" sortable></el-table-column>
                            <el-table-column prop="FStartDateTime" label="_接_/_甩挂时间_" width="160"></el-table-column>
                            <el-table-column prop="FEndDateTime" label="_甩_/_接挂时间_" width="150"></el-table-column>
                            <el-table-column prop="starAdress" label="_接挂地点_" width="240" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="endAdress" label="_最后接挂地点_" width="240" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="FTotalMileage" label="_运行公里_(km)" width="150" sortable></el-table-column>
                            <el-table-column prop="FTotalDuration" label="_持续时长_" sortable :sort-method="sortMethod" :formatter="formatter" width="150"></el-table-column>
                            <el-table-column prop="" min-width="100"></el-table-column>
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
    import baidu from '../../js/GIS/Baidu/BaiduAPI'
    import baiduMap from '../Common/baidu_map.vue'
    export default {
        data() {
            return {
                fullScreen: false,
                radio: '',
                loading: false,
                value3: [new Date(), new Date()],
                onindex: '',
                tabIndex: 2,
                editableTabs: [],
                FTotalCount: 'FTotalCount',
                table_height: null,
                activeName: 'all',
                total0: 0,
                total1: 0,
                total2: 0,
                pageSize0: 20,
                pageSize1: 20,
                pageSize2: 20,
                pageIndex0: 1,
                pageIndex1: 1,
                pageIndex2: 1,
                pickerOptions2: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            const end = start;
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                table0: null,
                table1: null,
                objDetail: null,
                option: {
                    chart: {
                        type: 'column',
                        marginLeft: 60,
                    },
                    legend: {
                        enabled: false
                    },
                    //          scrollbar: {
                    //            enabled:true,
                    //            barBackgroundColor:"#2885eb",
                    //            liveRedraw:false
                    //          },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '_车辆接甩挂次数_',
                        style: { "fontFamily": '微软雅黑' }
                    },
                    xAxis: {
                        categories: '',
                        crosshair: true,
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '_单位_（_次_）',
                            rotation: 0,
                            align: 'high',
                            y: -20,
                            x: 60
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table style="width: 100px; overflow: hidden">',
                        pointFormat: '<tr><td style="color:{series.color};padding:0"> </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}_次_</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0,
                        }
                    },
                    series: ''
                },
            }
        },
        props: {
            screenHeight: Number
        },
        mounted() {
            var _this = this;
            this.$refs.map.initMap();
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
        },
        methods: {
            sortMethod(a, b) {
                if (a.FTotalDuration - b.FTotalDuration > 0) {
                    return true
                } else {
                    return false
                }
            },
            formatter(row, column, cellValue) {
                let time;
                //console.log(row.FCouplingTotalDuration);
                if (row.FCouplingTotalDuration == undefined) {
                    time = row.FTotalDuration;
                } else {
                    time = row.FCouplingTotalDuration;
                }
                return this.formatSeconds(time);
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
            //重置表单
            reset: function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid')
                this.value3 = null;
                this.table0 = null;
                this.table1 = null;
                this.editableTabs = [];
                this.total0 = 0;
                this.total1 = 0;
                this.activeName = 'all';
                this.$refs.vehicle.$children[1].setCheckedKeys([]);
            },
            adjustPage() {
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) - 60;
            },
            // 选择车辆
            get: function (data) {
                $('.search-input').val("_已选_" + data[0].length + "_辆_");
                $('.search-input').attr('title', data[0])
                $('.search-input').attr('fguid', data[1])
            },
            doQuery: function (pageSize, pageIndex) {
                this.closeMymodal();
                var curpageIndex;
                var curpageSize;
                var _this = this;
                var FVehicleID = $(".search-input").attr("fguid");
                var startTime;
                var endTime;
                if (this.value3) {
                    var time0 = this.value3[0].toJSON().split("T")[0];
                    var time1 = this.value3[1].toJSON().split("T")[0];
                    startTime = this.parseUTC(time0 + ' 00:00:00');
                    endTime = this.parseUTC(time1 + ' 23:59:59');
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
                if (arguments.length == 1) {
                    curpageIndex = 1;
                    curpageSize = 20
                } else {
                    curpageIndex = this[pageIndex];
                    curpageSize = this[pageSize]
                }
                if (t2 - t1 > (31 * 24 * 60 * 60 * 1000)) {
                    _this.$message({
                        showClose: true,
                        message: '开始时间与结束时间不能大于31天',
                        type: 'warning'
                    });
                    return
                }
                if (FVehicleID != undefined) {
                    this.loading = true;

                    if (arguments.length == 1) {
                        if (this.editableTabs.length != 0) {
                            this.editableTabs = [];
                            this.activeName = 'all';
                        }
                        this.pageIndex0 = 1;
                        this.pageIndex1 = 1;
                        getGather();
                        getAll();
                    } else if (arguments[0] == "pageSize0") {
                        getGather();

                    } else if (arguments[0] == "pageSize1") {
                        getAll();
                    }
                    function getGather() {
                        let postData = {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "QuerySmartTrailerCouplingCountByFVehicleGUIDs",
                            FVehicleGUIDs: FVehicleID,
                            FStartTime: startTime,
                            FEndTime: endTime,
                            FPageSize: _this.pageSize0,
                            FPageIndex: curpageIndex,
                            FVersion: "1.0.0"
                        }
                        //汇总
                        $.ajax({
                            'url': '/web/Combine/Combine_Report',
                            'cache': false,
                            'async': true,
                            'type': 'Post',
                            'dataType': 'json',
                            'contentType': 'application/json;charset=utf-8',
                            'data': JSON.stringify(postData),
                            success: function (data) {
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
                                    //console.log(data);
                                    var fobj = data;
                                    _this.total0 = FVehicleID.split(",").length;
                                    _this.table0 = fobj.FObject.Table1;
                                    if (_this.table0.length == 0) {
                                        _this.$message({
                                            showClose: true,
                                            message: '_未查询到数据_',
                                            type: 'warning'
                                        });
                                    } else {
                                        _this.option.xAxis.categories = [];
                                        _this.option.series = [{}, {}];
                                        _this.option.series[0].data = [];
                                        _this.option.series[1].data = [];
                                        $.each(_this.table0, function (index, obj) {
                                            if (obj.FCouplingCount == null || obj.FUnCouplingCount == null) {
                                                obj.FCouplingCount = 0;
                                                obj.FUnCouplingCount = 0;
                                                obj.FCouplingTotalMileage = "--";
                                                obj.FUnCouplingTotalMileage = "--";
                                                obj.FTotalDuration = 0;
                                            }
                                            _this.option.xAxis.categories.push(obj.FVehicleName);
                                            _this.option.series[0].data.push(obj.FCouplingCount);
                                            _this.option.series[1].data.push(obj.FUnCouplingCount);
                                        });
                                        HighCharts.chart('chart-one', _this.option);
                                    }
                                }
                                _this.loading = false
                            },
                            error: function () {
                                console.log("请求失败")
                            }
                        });

                    };
                    function getAll() {
                        let postData = {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "QuerySmartTrailerCouplingListByFVehicleGUIDs",
                            FVehicleGUIDs: FVehicleID,
                            FStartTime: startTime,
                            FEndTime: endTime,
                            FPageSize: _this.pageSize0,
                            FPageIndex: curpageIndex,
                            FVersion: "1.0.0"
                        };
                        //全部
                        $.ajax({
                            'url': '/web/Combine/Combine_Report',
                            'cache': false,
                            'async': true,
                            'type': 'Post',
                            'dataType': 'json',
                            'contentType': 'application/json;charset=utf-8',
                            'data': JSON.stringify(postData),
                            success: function (data) {
                                var fobj = data;
                                var Baidu = new baidu.baiduAPI();
                                _this.total1 = fobj.FObject.Table[0].FTotalCount;
                                _this.table1 = fobj.FObject.Table1;
                                //console.log( _this.table1);
                                $.each(fobj.FObject.Table1, function (index, obj) {
                                    var point = Baidu.GetPosition(obj.FStartLongitude, obj.FStartLatitude);
                                    var geoc = Baidu.GetClientGeocoder();
                                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                                        var address = json.address;
                                        _this.$set(_this.table1[index], 'starAdress', address);
                                    });
                                    var point1 = Baidu.GetPosition(obj.FEndLongitude, obj.FEndLatitude);
                                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                                        var address;
                                        if (json.address == '') {
                                            address = '--'
                                        } else {
                                            address = json.address;
                                        }
                                        _this.$set(_this.table1[index], 'endAdress', address);
                                    });
                                });
                                $.each(_this.table1, function (index, obj) {
                                    obj.FStartDateTime = _this.parseGMT(obj.FStartDateTime.replace(/T/ig, ' '));
                                    obj.FEndDateTime = _this.parseGMT(obj.FEndDateTime.replace(/T/ig, ' '));
                                    if (obj.FCouplingStatus == 0) {
                                        obj.FCouplingStatus = '_甩挂_'
                                    } else {
                                        obj.FCouplingStatus = '_接挂_'
                                    }
                                });
                                _this.loading = false
                            },
                            error: function () {
                                console.log("请求失败")
                            }
                        });

                    };
                } else {
                    this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                }
            },
            //关闭modal窗口
            closeMymodal() {
                $(".mymodal").css('visibility', 'hidden')
            },
            //地图上定位
            position(index, row) {
                console.log(row);
                $(".mymodal").css('visibility', 'visible');
                //console.log(index, row);
                var point = new BMap.Point(row.FStartLongitude, row.FStartLatitude);
                this.$refs.map.setMark(point);
                //this.setMapInfo(row);
            },
            //查看详情
            addTab: function (index, row) {
                this.objDetail = row;
                var _this = this;
                let newTabName = ++this.tabIndex + '';
                let table = "mytable" + newTabName;
                var tabName = row.FVehicleName;
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
                let _this = this;
                let startTime;
                let endTime;
                let FVehicleID = this.objDetail.FVehicleGUID;
                let curpageIndex = this.pageIndex2;
                let curpageSize = this.pageSize2;
                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                let date = new Date().getDate();
                let today = year + '-' + month + '-' + date;

                let time0 = this.value3[0].toJSON().split("T")[0];
                let time1 = this.value3[1].toJSON().split("T")[0];
                startTime = this.parseUTC(time0 + ' 00:00:00');
                endTime = this.parseUTC(time1 + ' 23:59:59');
              
                $.ajax({
                    'url': '/web/Combine/Combine_Report',
                    'cache': false,
                    'async': true,
                    'type': 'Post',
                    'dataType': 'json',
                    'contentType': 'application/json;charset=utf-8',
                    'data': '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QuerySmartTrailerCouplingListByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
                        '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FVersion":"1.0.0"}',
                    success: function (data) {
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
                            var Baidu = new baidu.baiduAPI();
                            _this.total2 = fobj.FObject.Table[0].FTotalCount;
                            _this.table2 = fobj.FObject.Table1;
                            //console.log(_this.table2);
                            $.each(fobj.FObject.Table1, function (index, obj) {
                                var point = Baidu.GetPosition(obj.FStartLongitude, obj.FStartLatitude);
                                var geoc = Baidu.GetClientGeocoder();
                                Baidu.Geoco_GetLocation(geoc, point, function (json) {
                                    var address = json.address;
                                    _this.$set(_this.table2[index], 'starAdress', address);
                                });
                                var point1 = Baidu.GetPosition(obj.FEndLongitude, obj.FEndLatitude);
                                Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                                    var address = json.address;
                                    _this.$set(_this.table2[index], 'endAdress', address);
                                });
                            });
                            $.each(_this.table2, function (index, obj) {
                                obj.FStartDateTime = _this.parseGMT(obj.FStartDateTime.replace(/T/ig, ' '));
                                obj.FEndDateTime = _this.parseGMT(obj.FEndDateTime.replace(/T/ig, ' '));
                                if (obj.FCouplingStatus == 0) {
                                    obj.FCouplingStatus = '_甩挂_'
                                } else {
                                    obj.FCouplingStatus = '_接挂_'
                                }
                            });
                        }
                        _this.loading = false
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
            open: function () {
                this.fullScreen = !this.fullScreen;
                if (this.fullScreen) {
                    $(".el_table_wrap").css("padding-left", '0px');
                    $(".mymodal1").width("100%");
                    $(".mymodal1").height(this.table_height);
                    HighCharts.chart('chart-one', this.option);
                } else {
                    $(".mymodal1").width("800");
                    $(".mymodal1").height("400");
                    HighCharts.chart('chart-one', this.option);
                }

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
                } else if (this.table0 == null) {
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
        },
        components: {
            baiduMap,
            VehicalSelectDialog
        }
    }
</script>
<style scoped>
    .img_track {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-image: url(/static/img/img_track.png);
        background-repeat: no-repeat;
    }

    .tireChart {
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
        background: white;
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
</style>
<style>
    #map-wrapper {
        height: 470px;
    }
</style>