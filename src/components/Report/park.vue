<template>
    <section>
        <vehical-select-dialog v-on:child="get" v-if="showVehicalList"></vehical-select-dialog>
      
        <!-- 地图某一点 -->
        <div class="mymodal">
            <div class="modal-header" style="position: absolute;left: 890px;height: 20px;width: 20px;border: none;padding: 0px;z-index: 2;">
                <button type="button" @click="closeMymodal" style="height: 30px;width: 30px;background:transparent;outline:none;border: none;">
                    <!--<span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal"></span>-->
                    <i class="fa fa-times" aria-hidden="true" style="font-size: 24px;"></i>
                </button>
            </div>
            <div class="modal-body" style="padding: 0px">
                <!--  <baidu-map ref="map" :fa-data="[Area,mapToolShow]" ></baidu-map> -->
                <baidu-map ref="map" :fa-data="[mapToolShow]"></baidu-map>
            </div>
            <div class="mapModal">
                <header style="bdoackground: #f9f9f9 ;height:34px;padding: 10px">
                    <h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{FVehicleName}}</h4>
                </header>
                <div style="padding: 15px">
                    <p>
                        <span>_停车时长_：</span>{{FParkingDuration}}</p>
                    <p>
                        <span>_司机_：</span>{{FDriverName}}</p>
                    <p :title='position'>
                        <nobr>
                            <span>_位置_：</span>{{position}}</nobr>
                    </p>
                </div>
            </div>
        </div>
        <div id="operate_wrapper">
            <div class="box-header">
                <div class="block">
                    <span class="operatExp">_选择车辆_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal">
                        <!---->
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="img-icon icon-carList-dialog" v-if="SystemID!==2"></i>
                            <i class="fa fa-lock" style="font-size: 18px" v-if="SystemID==2"></i>
                        </a>
                        <input type="text" class="search-input" readonly="readonly">
                    </div>
                </div>
                <div class="block">
                    <span class="operatExp">_选择时间_</span>
                    <el-date-picker size="small" v-model="value4" :clearable="false" type="daterange" @change="getTime" :picker-options="pickerOptions2"
                        placeholder="_选择时间范围_">
                    </el-date-picker>
                </div>
                <div class="btnList">
                    <el-button type="primary" class="search" @click="doQuery(0)">_查询_</el-button>
                    <el-button type="primary" class="reset" @click="reset">_重置_</el-button>
                    <el-button type="primary" class="export">
                        <i class="fa fa-share-square-o"></i>_导出文件_</el-button>
                </div>
            </div>
        </div>
        <div v-show="loading" :style="{height:loading_height+'px',background:'#fff'}" v-loading="loading" element-loading-text="_拼命加载中_">
        </div>
        <el-tabs v-model="activeName" @tab-remove="removeTab" @tab-click="closeMymodal">
            <el-tab-pane label="_汇总_" name="all">
                <div class="el_table_wrap" id="el_table_wrap">
                    <el-table :data="tableData3" stripe style="width: 100%" :height="table_height" ref="multipleTable" @selection-change="handleSelectionChange"
                        empty-text="_暂无数据_">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop='RowNo' label="_序号_" width="65">
                        </el-table-column>
                        <el-table-column label="_操作_" width="140">
                            <template scope="scope">
                                <el-button @click="addTab(scope.$index,scope.row)" type="text" size="small" v-if="scope.row.FCount!=0">
                                    _查看详情_
                                </el-button>
                                <span v-if="scope.row.FCount==0">--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="FShortName" label="_公司名称_" width="140" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FAssetID" label="_终端号_" width="140" sortable v-if="SystemID==2" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="140" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FParkingStartDateTime" label="_开始时间_" width="200" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FParkingEndDateTime" label="_结束时间_" width="200" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FCount" label="_停车次数_" width="160" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FParkingDuration" label="_停车总时长_" width="160" sortable :sort-method='sortMethod' :formatter='formatter'
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop=" " label=" " min-width="1"></el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange0" @current-change="handleCurrentChange0" :current-page="pageIndex0" :page-sizes="[10, 20, 30,]"
                            :page-size='pageSize0' layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount0">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="_全部_" name="first">
                <div class="el_table_wrap">
                    <el-table :data="tableData4" :height="table_height" style="width: 100%;" ref="multipleTable" @selection-change="handleSelectionChange"
                        empty-text="_暂无数据_">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop='RowNo' label="_序号_" width="65"></el-table-column>
                        <el-table-column label="_操作_" width="140">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="doposition(scope.$index,scope.row)">
                                    <i class='img_track' title='_查看位置_'></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop='FShortName' label="_公司名称_" width="140"></el-table-column>
                        <el-table-column prop="FAssetID" label="_终端号_" width="140 " sortable v-if="SystemID==2"></el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="160" sortable></el-table-column>
                        <el-table-column prop="FParkingDuration" label="_停车时长_" width="160" sortable :sort-method='sortMethod' :formatter='formatter'></el-table-column>
                        <el-table-column prop="FDriverName" label="_司机_" width="80"></el-table-column>
                        <el-table-column prop="FParkingStartDateTime" label="_开始停车时间_" width="200" sortable></el-table-column>
                        <el-table-column prop="FParkingEndDateTime" label="_结束停车时间_" width="200" sortable></el-table-column>
                        <el-table-column prop="position" label="_位置_" width="380" show-overflow-tooltip align='left'></el-table-column>
                        <el-table-column prop=" " label=" " min-width="155"></el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pageIndex1" :page-sizes="[10, 20, 30,]"
                            :page-size='pageSize1' layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount1">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name" closable>
                <div class="el_table_wrap">
                    <el-table :data="tableData5" :height="table_height" style="width: 100%;" ref="multipleTable" @selection-change="handleSelectionChange"
                        empty-text="_暂无数据_">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop='RowNo' label="_序号_" width="65"></el-table-column>
                        <el-table-column label="_操作_" width="140">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="doposition(scope.$index,scope.row)">
                                    <i class='img_track' title='_查看位置_'></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop='FShortName' label="_公司名称_" width="140"></el-table-column>
                        <el-table-column prop="FAssetID" label="_终端号_" width="100" sortable v-if="SystemID==2"></el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="160" sortable></el-table-column>
                        <el-table-column prop="FParkingDuration" label="_停车时长_" width="160" sortable :sort-method='sortMethod' :formatter='formatter'></el-table-column>
                        <el-table-column prop="FDriverName" label="_司机_" width="80"></el-table-column>
                        <el-table-column prop="FParkingStartDateTime" label="_开始停车时间_" width="200" sortable></el-table-column>
                        <el-table-column prop="FParkingEndDateTime" label="_结束停车时间_" width="200" sortable></el-table-column>
                        <el-table-column prop="position" label="_位置_" width="380" show-overflow-tooltip align='left'></el-table-column>
                        <el-table-column prop=" " label=" " min-width="155"></el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="pageIndex2" :page-sizes="[10, 20, 30,]"
                            :page-size='pageSize2' layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount2">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
    import baidu from 'js/GIS/Baidu/BaiduAPI.js'
    import baiduMap from 'components/Common/baidu_map.vue'
    import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
    // import  lockSelectDialog from './../EL/lockSelectDialog.vue'
    export default {
        data() {
            return {
                showVehicalList: false,
                loading: false,
                loading_height: null,
                equipIds: '',
                equips: '',
                anycheck: [],
                equipData: [],
                equipdialog: false,
                simKey: '',
                pageSize3: 20,
                pageIndex3: 1,
                FTotalCount3: 0,   //车队列表
                bool: true,
                url: null,
                url1: '',
                faction1: '',
                faction2: '',
                Area: "深圳",
                mapToolShow: false,
                pageSize0: 20,
                pageSize1: 20,
                pageSize2: 20,
                pageIndex0: 1,
                pageIndex1: 1,
                pageIndex2: 1,
                FTotalCount0: 0,
                FTotalCount1: 0,
                FTotalCount2: 0,
                tableData3: [],
                tableData4: [],
                tableData5: [],
                FVehicleName: '',
                FDriverName: '',
                FParkingDuration: '',
                position: '',
                value4: [new Date(), new Date()],
                //value3:' ',
                //value4:'',
                onindex: '',
                tabIndex: 2,
                editableTabs: [],
                table_height: null,
                activeName: 'all',
                objDetail: '',  //保存汇总里面的当行数据
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
            }
        },
        props: {
            screenHeight: Number,
            // toChildrenSystemID: Number
        },
        computed: {
            SystemID() {
                return this.$store.state.choiceSystemID;
            }
        },
        mounted() {
            var _this = this;
            //加载地图
            this.$refs.map.initMap();
            $("#map-wrapper").height(570);
            setTimeout(() => {
                this.adjustPage();
            }, 100);
        },
        activated() {
            this.showVehicalList = true;
        },
        methods: {
            equipQuery() {
                this.equipdialog = true;
                this.anycheck = [];
                this.searchEquip();
                this.pageIndex3 = 1;
            },
            sortMethod(a, b) {
                if (a.FParkingDuration - b.FParkingDuration > 0) {
                    return true
                } else {
                    return false
                }
            },
            formatter(row, column, cellValue) {
                if (row.FParkingDuration != 0) {
                    return this.formatSeconds(row.FParkingDuration);
                } else {
                    return 0
                }
            },
            //查看位置（定位到某点）
            doposition: function (index, row) {
                $(".mymodal").css('visibility', 'visible');
                this.FVehicleName = row.FVehicleName;
                this.FDriverName = row.FDriverName;
                this.FParkingDuration = this.formatSeconds(row.FParkingDuration);
                this.position = row.position;
                var point = new BMap.Point(row.FParkingLongitude, row.FParkingLatitude);
                //this.$refs.map.setMark(content,point);
                this.$refs.map.setMark(point);
            },
            //关闭地图
            closeMymodal: function () {
                $(".mymodal").css('visibility', 'hidden');
                // this.$refs.map.initMap();
            },
            getTime: function (value) {
                //return this.value4=value;
            },
            //重置表单
            reset: function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid');
                this.value4 = [null, null];
                this.tableData3 = [],
                    this.tableData4 = [],
                    this.tableData5 = [],
                    this.editableTabs = [];
                this.FTotalCount0 = 0;
                this.FTotalCount1 = 0;
                this.FTotalCount2 = 0;
                this.activeName = 'all';
                this.pageIndex0 = 1;
                this.pageIndex1 = 1;
                this.pageIndex2 = 1;
            },
            //导出
            handleSelectionChange() {
            },
            handleSelectionChange1(val) {
                this.anycheck = val;
                console.log(this.anycheck);
            },
            handleSizeChange0(val) {
                this.pageSize0 = val;
                this.doQuery(1, this.pageSize0, this.pageIndex0)
            },
            handleSizeChange1(val) {
                this.pageSize1 = val;
                this.doQuery(2, this.pageSize1, this.pageIndex1)
            },
            handleSizeChange2(val) {
                this.pageSize2 = val;
                this.checkDetail();
            },
            /* handleSizeChange3(val) {
                this.pageSize3 = val;
                this.searchEquip();
            }, */
            handleCurrentChange0(val) {
                this.pageIndex0 = val;
                this.doQuery(1, this.pageSize0, this.pageIndex0)
            },
            handleCurrentChange1(val) {
                this.pageIndex1 = val;
                this.doQuery(2, this.pageSize1, this.pageIndex1)
            },
            handleCurrentChange2(val) {
                this.pageIndex2 = val;
                this.checkDetail();
            },
            /*  handleCurrentChange3(val) {
                 this.pageIndex3 = val;
                 this.searchEquip();
             }, */
            adjustPage() {
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) - 60;
                this.loading_height = Number(this.table_height) + 80;
            },
            //提示信息
            message(msg, type) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type
                });
            },
            //时间格式转换
            timeChange(time) {
                var time1 = Date.parse(new Date(time));
                var uom1 = new Date(time1);
                var month1 = (uom1.getMonth() + 1).toString().length == 1 ? "0" + (uom1.getMonth() + 1).toString() : (uom1.getMonth() + 1);
                var day1 = uom1.getDate().toString().length == 1 ? "0" + uom1.getDate() : uom1.getDate();
                return uom1.getFullYear() + '-' + month1 + '-' + day1;
            },
            // 选择车辆
            get: function (data) {
                /*if(this.SystemID==2){
                  $('.search-input').val("_已选_"+data[0].length);
                }else {
                  $('.search-input').val("_已选_"+data[0].length+"_辆_");
                }
                $('.search-input').attr('title',data[0])
                $('.search-input').attr('fguid',data[1])*/
                $('.search-input').attr('title', data[0])
                $('.search-input').attr('fguid', data[1])
                if (data[0].length > 0) {  //选择了车或者锁
                    if (this.SystemID == 2) {
                        $('.search-input').val("_已选_" + data[0].length);
                    } else {
                        $('.search-input').val("_已选_" + data[0].length + "_辆_");
                    }
                } else {
                    $('.search-input').val('');
                    $('.search-input').removeAttr('fguid');
                }
            },
            // type 0 汇总&全部 1汇总 2全部
            doQuery(type, pageSize, pageIndex) {
                this.closeMymodal();
                var _this = this;
                var curpageIndex;
                var curpageSize;
                var FVehicleID = $(".search-input").attr("fguid");
                var startTime;
                var endTime;
                if (FVehicleID == undefined) {
                    this.message('_请选择车辆_/_箱号_', 'warning');
                    this.tableData3 = [];
                    this.tableData4 = [];
                    this.FTotalCount0 = 0;
                    this.FTotalCount1 = 0;
                    this.activeName = 'all';
                    return
                };
                // 验证选择的时间
                if (this.value4[0] && this.value4[1]) {
                    var t1 = this.timeChange(this.value4[0]);
                    var t2 = this.timeChange(this.value4[1]);
                    var startTime = this.parseUser(t1 + ' 00:00:00');
                    var endTime = this.parseUser(t2 + ' 23:59:59');
                    let d1 = startTime.substr(0, 10).split("-")
                    let t1 = new Date(d1[0], d1[1] - 1, d1[2]).getTime();
                    let d2 = endTime.substr(0, 10).split("-")
                    let t2 = new Date(d2[0], d2[1] - 1, d2[2]).getTime();
                    console.log(t2 - t1 - 31 * 24 * 60 * 60 * 1000)
                    if (t2 - t1 > (31 * 24 * 60 * 60 * 1000)) {
                        _this.$message({
                            showClose: true,
                            message: '_开始时间与结束时间不能大于_31_天_',
                            type: 'warning'
                        });
                        return
                    }
                } else {
                    this.$message({
                        showClose: true,
                        message: '_请选择时间_',
                        type: 'warning'
                    });
                    this.tableData3 = [];
                    this.tableData4 = [];
                    this.FTotalCount0 = 0;
                    this.FTotalCount1 = 0;
                    this.activeName = 'all';
                    return
                };
                // 验证传入参数
                if (arguments.length == 1) {
                    curpageIndex = 1;
                    curpageSize = 20
                } else {
                    curpageIndex = parseInt(this[pageIndex]);
                    curpageSize = parseInt(this[pageSize]);
                };
                _this.loading = true;
                _this.pageIndex0 = 1;
                _this.pageIndex1 = 1;
                _this.pageIndex2 = 1;
                if(type===0)_this.activeName = 'all';
                this.editableTabs = [];
                if (type === 0) {
                    getGather();
                    getAll();
                } else if (type === 1) {
                    getGather();
                } else {
                    getAll();
                }

                function getGather() {
                    let postData = {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryReportParkingCountByFVehicleGUIDs",
                        FVehicleGUIDs: FVehicleID,
                        FStartTime: startTime,
                        FEndTime: endTime,
                        FPageSize: curpageSize,
                        FPageIndex: curpageIndex,
                        FVersion: "1.0.0"
                    };
                    //请求汇总
                    $.ajax({
                        'url': "/web/Combine/Combine_Report",
                        'cache': false,
                        'async': true,
                        'type': 'Post',
                        'dataType': 'json',
                        'contentType': 'application/json;charset=utf-8',
                        'data': JSON.stringify(postData),
                        success(data) {
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
                                _this.tableData3 = [];
                                var Fobj = data;
                                $.each(Fobj.FObject.Table1, function (index, obj) {
                                    if (obj.FCount) {
                                        obj.FParkingStartDateTime = _this.parseGMT(obj.FParkingStartDateTime.replace(/T/ig, ' ').substring(0, 19));
                                        obj.FParkingEndDateTime = _this.parseGMT(obj.FParkingEndDateTime.replace(/T/ig, ' ').substring(0, 19));
                                        _this.tableData3.push(obj);
                                    } else {
                                        obj.FParkingStartDateTime = '--';
                                        obj.FParkingEndDateTime = '--';
                                        obj.FCount = 0;
                                        obj.FParkingDuration = 0;
                                        _this.tableData3.push(obj);
                                    }
                                })
                                // _this.FTotalCount0=Fobj.FObject.Table[0].FTotalCount;
                                _this.loading = false;
                                _this.FTotalCount0 = FVehicleID.split(",").length;
                            }
                        },
                        error: function () {
                            console.log("_请求失败_")
                        }
                    });

                }
                function getAll() {
                    let postData1 = {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryReportParkingListByFVehicleGUIDs",
                        FVehicleGUIDs: FVehicleID,
                        FStartTime: startTime,
                        FEndTime: endTime,
                        FPageSize: curpageSize,
                        FPageIndex: curpageIndex,
                        FVersion: "1.0.0"
                    };

                    //请求全部
                    $.ajax({
                        'url': "/web/Combine/Combine_Report",
                        'cache': false,
                        'async': true,
                        'type': 'Post',
                        'dataType': 'json',
                        'contentType': 'application/json;charset=utf-8',
                        /*'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"' +Faction2+ '","FVehicleGUIDs":"' + FVehicleID + '","FStartTime":"' +startTime+ '","FEndTime":"' +endTime+ '","FPageSize":"' +curpageSize+ '" ,"FPageIndex":"' +curpageIndex+ '","FVersion":"1.0.0"}',*/
                        'data': JSON.stringify(postData1),
                        success(data) {
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
                                _this.tableData4 = [];
                                var Fobj = data;
                                var Baidu = new baidu.baiduAPI();
                                $.each(Fobj.FObject.Table1, function (index, obj) {
                                    obj.FParkingStartDateTime = _this.parseGMT(obj.FParkingStartDateTime.replace(/T/ig, ' ').substring(0, 19));
                                    obj.FParkingEndDateTime = _this.parseGMT(obj.FParkingEndDateTime.replace(/T/ig, ' ').substring(0, 19));
                                    obj.FDriverName = obj.FDriverName ? obj.FDriverName : '--';
                                    //位置
                                    /*var point1 = Baidu.GetPosition(obj.FParkingLongitude,obj.FParkingLatitude);
                                    var geoc1 = Baidu.GetClientGeocoder();
                                    Baidu.Geoco_GetLocation(geoc1, point1, function (json) {
                                        var address1;
                                        if(json.address==''){
                                            address1='--'
                                        }else {
                                        address1 = json.address;
                                        }
                                        _this.$set(_this.tableData4[index],'position',address1);
                                    });*/
                                    if (obj.FParkingLongitude) {
                                        _this.$set(obj, 'position', null);
                                        var point = {
                                            lng: obj.FParkingLongitude,
                                            lat: obj.FParkingLatitude,
                                        }
                                        var type = _this.$store.state.globalMapType;
                                        var changepoint = _this.parsePoint(type, point);
                                        _this.geocoder(type, changepoint, obj, 'position');
                                    } else {
                                        obj.position = '--'
                                    }
                                    _this.tableData4.push(obj);
                                })
                                _this.loading = false;
                                if (Fobj.FObject.Table) {
                                    _this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
                                }
                            }
                        },
                        error: function () {
                            console.log("_请求失败_")
                        }
                    });
                }
            },
            //切换tab
            addTab(index, row) {
                var _this = this;
                this.objDetail = row;
                let newTabName = ++this.tabIndex + '';
                let table = "mytable" + newTabName;
                //var tabName = row.FVehicleName;
                if (this.SystemID == 2) {
                    var tabName = row.FAssetID;
                } else {
                    var tabName = row.FVehicleName;
                }
                this.editableTabs.length = 0;  //每次初始化，保证只有一个新开tab
                this.editableTabs.push({
                    title: tabName,
                    name: newTabName,
                    // table:table  //这个属性？
                });
                this.activeName = newTabName;
                // _this.tableData5=[];    //初始化新表格
                this.checkDetail();
            },
            //新添加表格的请求数据
            checkDetail: function () {
                this.loading = true;
                var _this = this;
                var startTime;
                var endTime;
                var FVehicleID = this.objDetail.FVehicleGUID;   //汇总必须先保存这个字段？？
                if (this.SystemID == 1 || this.SystemID == 3 || this.SystemID == 4) {
                    var FVehicleID = this.objDetail.FVehicleGUID;
                } else if (this.SystemID == 2) {
                    var FVehicleID = this.objDetail.FAssetGUID;
                }
                var curpageIndex = this.pageIndex2;
                var curpageSize = this.pageSize2;
                /*var year = new Date().getFullYear();
                var month = new Date().getMonth() + 1;
                var date = new Date().getDate();
                var today = year + '-' + month + '-' + date;*/
                /*if (this.value4 == '') {
                  startTime =this.parseUTC(today + ' 00:00:00');
                  endTime =this.parseUTC(today + ' 23:59:59');
                } else {
                  var time = this.value4.split(' - ');
                  startTime = this.parseUTC(time[0] + ' 00:00:00');
                  endTime = this.parseUTC(time[1] + ' 23:59:59');
                };*/
                if (this.value4[0] && this.value4[1]) {
                    var t1 = this.timeChange(this.value4[0]);
                    var t2 = this.timeChange(this.value4[1]);
                    var startTime = this.parseUser(t1 + ' 00:00:00');
                    var endTime = this.parseUser(t2 + ' 23:59:59');
                }
                //请求一辆车的数据

                let postData = {
                    FTokenID: _this.$store.state.FTokenID,
                    FAction: "QueryReportParkingListByFVehicleGUIDs",
                    FVehicleGUIDs: FVehicleID,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FPageSize: curpageSize,
                    FPageIndex: curpageIndex,
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
                            _this.tableData5 = [];
                            var Fobj = data;
                            var Baidu = new baidu.baiduAPI();
                            $.each(Fobj.FObject.Table1, function (index, obj) {
                                obj.FParkingStartDateTime = _this.parseGMT(obj.FParkingStartDateTime.replace(/T/ig, ' ').substring(0, 19));
                                obj.FParkingEndDateTime = _this.parseGMT(obj.FParkingEndDateTime.replace(/T/ig, ' ').substring(0, 19));
                                obj.FDriverName = obj.FDriverName ? obj.FDriverName : '--';
                                //位置
                                /*var point1 = Baidu.GetPosition(obj.FParkingLongitude,obj.FParkingLatitude);
                                var geoc1 = Baidu.GetClientGeocoder();
                                Baidu.Geoco_GetLocation(geoc1, point1, function (json) {
                                  console.log(json.point)
                                  var address1;
                                  if(json.address==''){
                                      address1='--'
                                  }else {
                                    address1 = json.address;
                                  }
                                  _this.$set(_this.tableData5[index],'position',address1);
                                });*/
                                if (obj.FParkingLongitude) {
                                    _this.$set(obj, 'position', null);
                                    var point = {
                                        lng: obj.FParkingLongitude,
                                        lat: obj.FParkingLatitude,
                                    }
                                    var type = _this.$store.state.globalMapType;
                                    var changepoint = _this.parsePoint(type, point);
                                    _this.geocoder(type, changepoint, obj, 'position');
                                } else {
                                    obj.position = '--'
                                }
                                _this.tableData5.push(obj);
                            })
                            _this.loading = false;
                            _this.FTotalCount2 = Fobj.FObject.Table[0].FTotalCount;
                        }
                    },
                    error: function () {
                        console.log("_请求失败_")
                    }
                })
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
                this.activeName = 'all';
                this.pageIndex2 = 1;
                this.pageSize2 = 20;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            },
        },
        watch: {
            screenHeight() {
                this.adjustPage();
            },
            /* toChildrenSystemID () {
               this.SystemID=this.$store.state.choiceSystemID;
             },*/
        },
        components: {
            baiduMap,
            VehicalSelectDialog,
            // lockSelectDialog
        },
        deactivated() {
            this.showVehicalList = false;
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

    .el-table .el-button {
        padding: 0;
    }

    .mapModal {
        position: absolute;
        height: 160px;
        width: 350px;
        margin-top: -160px;
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

    .searchBtn {
        border: none;
        background-color: white;
        margin-left: -40px;
        box-shadow: none;
        height: 20px !important;
        outline: none;
    }

    .searchtable {
        height: 40px;
    }

    .searchtable .searchinput {
        border: 1px solid #1970cf;
        height: 28px;
        border-radius: 15px;
        box-shadow: none !important;
        width: 180px;
        padding-left: 10px;

    }

    .searchtable .searchinput {
        box-shadow: none !important;
        outline: none;
    }

    .searchtable .searchinput {
        box-shadow: none !important;
        outline: none;
    }

    .leftbtn {
        float: left;
        margin: -18px 0 0 0;
    }

    .rightinput {
        float: right;
        margin: -18px 0 0 0;
    }
</style>