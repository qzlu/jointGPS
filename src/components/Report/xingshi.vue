<script src="../../../../node_modules/element-ui/lib/tooltip.js"></script>
<template>
    <section>
        <vehical-select-dialog v-on:child="get" v-if="showVehicalList"></vehical-select-dialog>
        <!-- <lock-select-dialog v-on:child="get" v-if="SystemID==2&&showVehicalList"></lock-select-dialog> -->
        <!-- 轨迹地图弹窗 -->
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
                <header style="background: #f9f9f9 ;height:34px;padding: 10px">
                    <h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{FVehicleName}}</h4>
                </header>
                <div style="padding: 15px">
                    <p v-if="sposition" :title='sposition'>
                        <nobr>
                            <span>_开始位置_：</span>{{sposition}}</nobr>
                    </p>
                    <p v-if="eposition" :title='eposition'>
                        <nobr>
                            <span>_结束位置_：</span>{{eposition}}</nobr>
                    </p>
                    <div v-if="M">
                        <p>
                            <span>_运行里程_：</span>{{FTotalMileage}}km</p>
                        <p>
                            <span>_运行时长_：</span>{{FTotalDuration}}</p>
                    </div>
                    <div v-if="R">
                        <p>
                            <span>_运行公里_：</span>{{FDriveMileage}}km</p>
                        <p>
                            <span>_行驶时长_：</span>{{FDriveDuration}}</p>
                    </div>
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
                    <el-button type="primary" class="search" @click="doQuery(true)">_查询_</el-button>
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
                    <el-table :data="tableData3" stripe style="width: 100%;" :height='table_height' ref="multipleTable" @selection-change="handleSelectionChange"
                        empty-text='_暂无数据_'>
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop='RowNo' label="_序号_" width="65">
                        </el-table-column>
                        <el-table-column label="_操作_" width="152">
                            <template scope="scope">
                                <a href="javascript:" @click="addTab1(scope.$index,scope.row)" v-if="scope.row.FDriveMileage!=0">_日里程_</a>
                                <span style='color:#3c8dbc' v-if="scope.row.FDriveMileage!==0">|</span>
                                <a href="javascript:" @click="addTab2(scope.$index,scope.row)" v-if="scope.row.FDriveMileage!=0">_行驶段_</a>
                                <span v-if="scope.row.FDriveMileage==0">--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="FShortName" label="_公司名称_" width="120" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FAssetID" label="_终端号_" width="180" sortable v-if="SystemID==2" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="140" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FDriveMileage" label="_运行总公里_(km)" width="160" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FDriveDuration" label="_运行时长_" width="160" sortable :sort-method='sortMethod' :formatter='formatter'
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FRunningDays" label="_运行天数_" width="160" v-if="SystemID!==2" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FCount" label="_运行次数_" width="140" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FAverageSpeed" label="_平均速度_(km/h)" width="165" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FStartDateTime" label="_开始时间_" width="200" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FEndDateTime" label="_结束时间_" width="200" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="sposition" label="_开始位置_" width="250" show-overflow-tooltip align='left'>
                        </el-table-column>
                        <el-table-column prop="eposition" label="_结束位置_" width="250" show-overflow-tooltip align='left'>
                        </el-table-column>
                        <el-table-column prop="" label="" min-width="1" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
                <div class="pagination" id='pagination'>
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange0" @current-change="handleCurrentChange0" :current-page="pageIndex0" :page-sizes="[10, 20, 30,]"
                            :page-size='pageSize0' layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount0">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <!-- 里程段 -->
            <el-tab-pane v-for="(item, index) in editableTabs1" :key="item.name" :label="item.title" :name="item.name" closable>
                <div class="el_table_wrap">
                    <el-table :data="tableData4" :height="table_height" style="width: 100%;" ref="multipleTable" @selection-change="handleSelectionChange"
                        empty-text='_暂无数据_'>
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop='RowNo' label="_序号_" width="65"></el-table-column>
                        <el-table-column label="_操作_" width="140">
                            <template scope="scope" class='milleage'>
                                <!-- <el-button  type="text" size="small" @click="position(scope.$index,scope.row)"><i class='img_track' ></i></el-button> -->
                                <el-button type="text" size="small" @click="showHistory(scope.$index,scope.row)">
                                    <i class='img_track' title='_查看轨迹_'></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="FShortName" label="_公司名称_" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FAssetID" label="_终端号_" width="160" sortable v-if="SystemID==2" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="140" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FDate" label="_日期_" width="120" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FTotalMileage" label="_运行里程_(km)" width="170" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FTotalDuration" label="_运行时长_" width="140" sortable :sort-method='sortMethod1' :formatter='formatter1'
                            show-overflow-tooltip></el-table-column>
                        <!-- <el-table-column prop="FStartDateTime" label="_开始时间_" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="FEndDateTime" label="_结束时间_" width="200" show-overflow-tooltip></el-table-column> -->
                        <el-table-column prop="sposition" label="_开始位置_" width="250" show-overflow-tooltip align='left'></el-table-column>
                        <el-table-column prop="eposition" label="_结束位置_" width="250" show-overflow-tooltip align='left'></el-table-column>
                        <el-table-column prop="" label="" min-width="1" show-overflow-tooltip></el-table-column>
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
            <!-- 行驶段 -->
            <el-tab-pane v-for="(item, index) in editableTabs2" :key="item.name" :label="item.title" :name="item.name" closable>
                <div class="el_table_wrap">
                    <el-table :data="tableData5" :height="table_height" style="width: 100%;" ref="multipleTable" @selection-change="handleSelectionChange"
                        empty-text='_暂无数据_'>
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop='RowNo' label="_序号_" width="65"></el-table-column>
                        <el-table-column label="_操作_" width="140">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="showHistory(scope.$index,scope.row)">
                                    <i class='img_track' title='_查看轨迹_'></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="FShortName" label="_公司名称_" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FAssetID" label="_终端号_" width="110" sortable v-if="SystemID==2" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FDriveMileage" label="_运行公里_(km)" width="170" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FDriveDuration" label="_行驶时长_" width="140" sortable :sort-method='sortMethod' :formatter='formatter'
                            show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FAverageSpeed" label="_平均速度_(km/h)" width="165" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FStartDateTime" label="_开始时间_" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="FEndDateTime" label="_结束时间_" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="sposition" label="_开始位置_" width="250" show-overflow-tooltip align='left'></el-table-column>
                        <el-table-column prop="eposition" label="_结束位置_" width="250" show-overflow-tooltip align='left'></el-table-column>
                        <el-table-column prop="" label="" min-width="1" show-overflow-tooltip></el-table-column>
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
                countPage: '',
                url: null,
                urlLBS: null,
                faLBS: null,
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
                sposition: '',
                eposition: '',
                FTotalMileage: '',
                FDriveMileage: '',
                M: false,
                R: false,
                value4: [(new Date()).setDate((new Date()).getDate() - 1), (new Date()).setDate((new Date()).getDate() - 1)],
                onindex: '',
                tabIndex: 1,
                editableTabs1: [],
                editableTabs2: [],
                totle_height: null,
                table_height: null,
                activeName: 'all',
                objDetail: '',  //保存汇总里面的当行数据
                pickerOptions2: {
                    shortcuts: [{
                        text: '_昨天_',
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            const end = start;
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '_前天_',
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                            const end = start;
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '_最近一周_',
                        onClick(picker) {
                            const end = new Date();
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }],
                    disabledDate: function (time) {
                        return time.getTime() > (Date.now() - 3600 * 1000 * 24 * 1);
                    }
                },
            }
        },
        props: {
            screenHeight: Number
        },
        computed: {
            SystemID() {
                return this.$store.state.choiceSystemID;
            }
        },
        mounted() {
            var _this = this;
            setTimeout(() => {
                this.adjustPage();
            }, 100);
            this.$refs.map.initMap();
            $("#map-wrapper").height(570);
        },
        activated() {
            this.showVehicalList = true;
        },
        methods: {
            sortMethod(a, b) {
                if (a.FDriveDuration - b.FDriveDuration > 0) {
                    return true
                } else {
                    return false
                }
            },
            formatter(row, column, cellValue) {
                if (row.FDriveDuration != 0) {
                    return this.formatSeconds(row.FDriveDuration);
                } else {
                    return 0
                }
            },
            sortMethod1(a, b) {
                if (a.FTotalDuration - b.FTotalDuration > 0) {
                    return true
                } else {
                    return false
                }
            },
            formatter1(row, column, cellValue) {
                return this.formatSeconds(row.FTotalDuration);
            },
            getTime: function (value) {
                // return this.value4=value;
            },
            //重置表单
            reset: function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid');
                //this.value3=null;
                this.value4 = [null, null];
                this.tableData3 = [],
                    this.tableData4 = [],
                    this.tableData5 = [],
                    this.editableTabs = [];
                this.FTotalCount0 = 0;
                this.FTotalCount1 = 0;
                this.FTotalCount2 = 0;
                this.editableTabs1 = [],
                    this.editableTabs2 = [],
                    this.activeName = 'all';
                this.pageIndex0 = 1;
                this.pageIndex1 = 1;
                this.pageIndex2 = 1;
            },
            //提示信息
            message(msg, type) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type
                });
            },
            // 选择车辆
            get: function (data) {
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
            //绘制轨迹（定位到地图）
            /* position: function (index, row) {
               $(".mymodal").css('visibility', 'visible');
               var _this=this;
               $.getJSON('/static/carData.json',function (data) {
                 let points=[];
                 var carData=data;
                $.each(carData.mObject,function (index,obj) {
                  let point=_this.getCarPoint(new BMap.Point(obj.FLongitude,obj.FLatitude));
                  points.push(new BMap.Point(point.lon,point.lat))
                });
                 console.log(points);
                 _this.$refs.map.showCarRoute([],points);
               })
             },*/
            //绘制轨迹
            showHistory(index, row) {
                var _this = this;
                let points = [];
                let startTime = this.parseUser(row.FStartDateTime.replace(/T/ig, ' ').substring(0, 19));
                let endTime = this.parseUser(row.FEndDateTime.replace(/T/ig, ' ').substring(0, 19));
                let FTableDate = _this.timeChange(startTime).replace(/-/ig, '');
                var FVehicleID = row.FVehicleGUID;
                this.FVehicleName = row.FVehicleName;
                this.sposition = row.sposition;
                this.eposition = row.eposition;
                if (row.FTotalMileage) {
                    this.FTotalMileage = row.FTotalMileage;
                    this.FTotalDuration = this.formatSeconds(row.FTotalDuration);
                    this.M = true;
                } else {
                    this.M = false;
                }
                if (row.FDriveMileage) {
                    this.FDriveMileage = row.FDriveMileage;
                    this.FDriveDuration = this.formatSeconds(row.FDriveDuration);
                    this.R = true;
                } else {
                    this.R = false;
                }
            
                let postData = {
                    FTokenID: _this.$store.state.FTokenID,
                    FAction: "QueryLBSTrackListByFVehicleGUID",
                    FVehicleGUID: row.FVehicleGUID,
                    FStartTime: startTime,
                    FEndTime: endTime,
                    FAssetTypeID:row.FAssetTypeID,
                    FTableDate: FTableDate,
                    FVersion: "1.0.0"
                };
                $.ajax({
                    // 'url':_this.urlLBS,
                    'url': '/web/Combine/Combine_LBS',
                    'cache': false,
                    'async': true,
                    'type': 'Post',
                    'dataType': 'json',
                    'contentType': 'application/json;charset=utf-8',
                    'data': JSON.stringify(postData),
                    success: function (data) {
                        console.log(data)
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
                            var Fobj = data;
                            if (Fobj.FObject.length != 0) {
                                $(".mymodal").css('visibility', 'visible');
                                data.FObject = JSON.hunpack(eval(data.FObject), 4);
                                $.each(Fobj.FObject, function (index, obj) {
                                    if (obj.FLongitude != 0 && obj.FLatitude != 0) {
                                        let point = _this.parsePointBD(new BMap.Point(obj.FLongitude, obj.FLatitude));
                                        points.push(new BMap.Point(point.lng, point.lat))
                                    }
                                });
                                _this.$refs.map.showCarRoute([], points);
                            } else {
                                _this.$message({
                                    showClose: true,
                                    message: '_暂无位置信息_',
                                    type: 'warning'
                                });
                            }
                        }
                        /*var Fobj=data;
                        if(Fobj.FObject.length!=0){
                          $(".mymodal").css('visibility', 'visible');
                          $.each(Fobj.FObject, function (index, obj) {
                            if(obj.FLongitude!=0&&obj.FLatitude!=0){
                              let point=_this.parsePointBD(new BMap.Point(obj.FLongitude,obj.FLatitude));
                              points.push(new BMap.Point(point.lng,point.lat))
                            }
                          });
                          _this.$refs.map.showCarRoute([],points);
                        }else {
                          _this.$message({
                            showClose: true,
                            message: '_暂无位置信息_',
                            type: 'warning'
                          });
                        }*/
                    },
                    error: function () {
                        console.log('_请求失败_')
                    }
                });
            },
            //关闭轨迹地图
            closeMymodal: function () {
                // this.$refs.map.initMap();
                $(".mymodal").css('visibility', 'hidden')
            },
            getCarPoint(point) {
                let gpsPoint = { lon: point.lng, lat: point.lat };
                if (point.lng >= 1 && point.lat >= 1) {
                    gpsPoint = this.fixGPSPoint(parseFloat(point.lat), parseFloat(point.lng));
                }
                return gpsPoint;
            },
            //将经纬度转换成地址
            /* getPosition(Longitude,Latitude){
               var Baidu= new baidu.baiduAPI();
               var point = Baidu.GetPosition(Longitude,Latitude);
               var geoc = Baidu.GetClientGeocoder();
               var address;
               Baidu.Geoco_GetLocation(geoc, point, function (data) {
                 var position = data.addressComponents;
                     address=position.province+position.city+position.district+position.street+position.streetNumber
               })
               return  (address);
             },*/
            handleSelectionChange() {
            },
            handleSizeChange0(val) {
                this.pageSize0 = val;
                this.doQuery(false);
            },
            handleSizeChange1(val) {
                this.pageSize1 = val;
                this.checkMileage();
            },
            handleSizeChange2(val) {
                this.pageSize2 = val;
                this.checkRun();
            },
            handleCurrentChange0(val) {
                this.pageIndex0 = val;
                this.doQuery(false);
            },
            handleCurrentChange1(val) {
                this.pageIndex1 = val;
                this.checkMileage();
            },
            handleCurrentChange2(val) {
                this.pageIndex2 = val;
                this.checkRun();
            },
            adjustPage() {
                // this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper","pagination", true) - 28;
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) - 60;
                this.loading_height = Number(this.table_height) + 80;
            },
            //时间格式转换去掉时分秒
            timeChange(time) {
                var time1 = Date.parse(new Date(time));
                var uom1 = new Date(time1);
                var month1 = (uom1.getMonth() + 1).toString().length == 1 ? "0" + (uom1.getMonth() + 1).toString() : (uom1.getMonth() + 1);
                var day1 = uom1.getDate().toString().length == 1 ? "0" + uom1.getDate() : uom1.getDate();
                return uom1.getFullYear() + '-' + month1 + '-' + day1;
            },
            rangeTime(start, end) {
                var arr = [];
                var temp1 = start.split("-");
                var temp2 = end.split("-");
                var date1 = new Date(start);
                var date2 = new Date(end);
                while ((date2.getTime() - date1.getTime()) >= 0) {
                    var year = date1.getFullYear();
                    var monthTemp = date1.getMonth() + 1;
                    var month = monthTemp.toString().length == 1 ? "0" + monthTemp.toString() : monthTemp.toString();
                    var day = date1.getDate().toString().length == 1 ? "0" + date1.getDate() : date1.getDate();
                    var temp = year + month + day;
                    arr.push(temp)
                    date1.setDate(date1.getDate() + 1);
                }
                return arr.join(',');
            },
            //timeDiffer
            timeDiffer(uom1) {
                var year = uom1.getFullYear();
                var month = (uom1.getMonth() + 1).toString().length == 1 ? "0" + (uom1.getMonth() + 1).toString() : (uom1.getMonth() + 1);
                var date = uom1.getDate().toString().length == 1 ? "0" + uom1.getDate() : uom1.getDate();
                var hour = uom1.getHours().toString().length == 1 ? "0" + uom1.getHours() : uom1.getHours();
                var minute = uom1.getMinutes().toString().length == 1 ? "0" + uom1.getMinutes() : uom1.getMinutes();
                var second = uom1.getSeconds().toString().length == 1 ? "0" + uom1.getSeconds() : uom1.getSeconds();
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            },
            //切换tab
            addTab1(index, row) {
                var _this = this;
                this.objDetail = row;
                let newTabName = '2';
                let table = "mytable" + newTabName;
                if (this.SystemID == 2) {
                    var tabName = row.FAssetID + '_日里程_';
                } else {
                    var tabName = row.FVehicleName + '_日里程_';
                }
                this.editableTabs1.length = 0;
                this.editableTabs1.push({
                    title: tabName,
                    name: newTabName,
                });
                this.activeName = newTabName;
                this.checkMileage();
            },
            addTab2(index, row) {
                var _this = this;
                this.objDetail = row;
                // let newTabName = ++this.tabIndex + '';
                let newTabName = '3';
                if (this.SystemID == 2) {
                    var tabName = row.FAssetID + '_行驶段_';
                } else {
                    var tabName = row.FVehicleName + '_行驶段_';
                }
                this.editableTabs2.length = 0;
                this.editableTabs2.push({
                    title: tabName,
                    name: newTabName,
                });
                this.activeName = newTabName;
                // this.tableData4=[];
                this.checkRun();
            },
            removeTab(targetName) {
                if (targetName == '2') {
                    this.editableTabs1 = [];
                    this.pageIndex1 = 1;
                    this.pageSize1 = 20;
                    this.activeName = (this.editableTabs2.length > 0) ? '3' : 'all';
                }
                if (targetName == '3') {
                    this.editableTabs2 = [];
                    this.pageIndex2 = 1;
                    this.pageSize2 = 20;
                    this.activeName = (this.editableTabs1.length > 0) ? '2' : 'all';
                }
            },
            //请求汇总
            doQuery(bool) {
                this.closeMymodal();
                var _this = this;
                var curpageIndex = this.pageIndex0;
                var curpageSize = this.pageSize0;
                var FVehicleID = $(".search-input").attr("fguid");
                var startTime;
                var endTime;
                if (FVehicleID == undefined) {
                    this.message('_请选择车辆_/_箱号_', 'warning');
                    this.tableData3 = [];
                    this.FTotalCount0 = 0;
                    this.activeName = 'all';
                    return
                }
                if (this.value4[0] && this.value4[1]) {
                    var t1 = this.timeChange(this.value4[0]);
                    var t2 = this.timeChange(this.value4[1]);
                    var startTime = this.parseUser(t1 + ' 00:00:00');
                    var endTime = this.parseUser(t2 + ' 23:59:59');
                    //var startTime=this.parseUTC(t1+' 00:00:00');
                    //var endTime=this.parseUTC(t2+' 23:59:59');
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
                    this.FTotalCount0 = 0;
                    this.activeName = 'all';
                    return
                }
                //页码初始化
                if (bool) {
                    _this.pageIndex0 = 1;
                    _this.pageIndex1 = 1;
                    _this.pageIndex2 = 1;
                    _this.activeName = 'all';
                    this.editableTabs1 = [];
                    this.editableTabs2 = [];
                    this.activeName = 'all';
                }
                //甩挂和冷链 
                if (FVehicleID != undefined && this.value4) {
                    _this.loading = true;
                    let postData = {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryReportDriveCountByFVehicleGUIDs",
                        FVehicleGUIDs:FVehicleID,
                        FStartTime: startTime,
                        FEndTime: endTime,
                        FPageSize: curpageSize,
                        FPageIndex: curpageIndex,
                        FVersion: "1.0.0"
                    };
                    //请求汇总
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
                                _this.tableData3 = [];
                                var Fobj = data;
                                var Baidu = new baidu.baiduAPI();
                                $.each(Fobj.FObject.Table1, function (index, obj) {
                                    if (obj.FDriveMileage) {
                                        obj.FStartDateTime = _this.parseGMT(obj.FStartDateTime.replace(/T/ig, ' ').substring(0, 19));
                                        obj.FEndDateTime = _this.parseGMT(obj.FEndDateTime.replace(/T/ig, ' ').substring(0, 19));
                                        _this.$set(obj, 'sposition', null);
                                        _this.$set(obj, 'eposition', null);
                                        var point1 = {
                                            lng: obj.FStartLongitude,
                                            lat: obj.FStartLatitude,
                                        }
                                        var point2 = {
                                            lng: obj.FEndLongitude,
                                            lat: obj.FEndLatitude,
                                        }
                                        var type = _this.$store.state.globalMapType;
                                        var changepoint1 = _this.parsePoint(type, point1);
                                        var changepoint2 = _this.parsePoint(type, point2);
                                        if (obj.FStartLongitude) {
                                            _this.geocoder(type, changepoint1, obj, 'sposition');
                                        } else {
                                            obj.sposition = '--'
                                        };
                                        if (obj.FEndLongitude) {
                                            _this.geocoder(type, changepoint2, obj, 'eposition');
                                        } else {
                                            obj.eposition = '--'
                                        };
                                        _this.tableData3.push(obj);
                                    } else {
                                        obj.FDriveMileage = 0;
                                        obj.FDriveDuration = 0;
                                        obj.FCount = 0;
                                        obj.FAverageSpeed = 0;
                                        obj.FStartDateTime = 0;
                                        obj.FEndDateTime = 0;
                                        obj.sposition = '--';
                                        obj.eposition = '--';
                                        obj.FVehicleName = obj.FVehicleName ? obj.FVehicleName : '--'
                                        _this.tableData3.push(obj);
                                    }
                                })
                                _this.loading = false;
                                _this.FTotalCount0 = data.FObject.Table[0].FTotalCount;
                            }
                        },
                        error: function () {
                            console.log("_请求失败_")
                        }
                    });
                }
            },
            //请求日里程
            checkMileage() {
                var _this = this;
                var startTime;
                var endTime;
                var curpageIndex = this.pageIndex1;
                var curpageSize = this.pageSize1;
                var FDates;
                if (this.value4[0] && this.value4[1]) {
                    var t1 = this.timeChange(this.value4[0]);
                    var t2 = this.timeChange(this.value4[1]);
                    FDates = this.rangeTime(t1, t2);
                }
                if (this.SystemID == 2) {
                    var FVehicleID = this.objDetail.FAssetGUID;
                    var url1 = '/web/Lock/Lock_Report';
                    /*var data1= '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryReportDayMileageListByFAssetGUID","FAssetGUID":"' + FVehicleID + '","FStartTime":"' +startTime+ '","FEndTime":"' +endTime+ '","FPageSize":"' +curpageSize+ '" ,"FPageIndex":"' +curpageIndex+ '","FVersion":"1.0.0"}';*/
                    var data1 = '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryReportDayMileageListByFAssetGUID","FAssetGUID":"' + FVehicleID + '","FDates":"' + FDates + '","FPageSize":"' + curpageSize + '" ,"FPageIndex":"' + curpageIndex + '","FVersion":"1.0.0"}';
                } else {
                    var FVehicleID = this.objDetail.FVehicleGUID;
                    var url1 = '/web/Common/Common_Report';
                    /*var data1= '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryReportDayMileageListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' +startTime+ '","FEndTime":"' +endTime+ '","FPageSize":"' +curpageSize+ '" ,"FPageIndex":"' +curpageIndex+ '","FVersion":"1.0.0"}';*/
                    var data1 = '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryReportDayMileageListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FDates":"' + FDates + '","FPageSize":"' + curpageSize + '" ,"FPageIndex":"' + curpageIndex + '","FVersion":"1.0.0"}';
                }
                if (FVehicleID != undefined) {
                    _this.loading = true;
                    $.ajax({
                        //'url': _this.url,
                        'url': url1,
                        'cache': false,
                        'async': true,
                        'type': 'Post',
                        'dataType': 'json',
                        'contentType': 'application/json;charset=utf-8',
                        "data": data1,
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
                                _this.tableData4 = [];
                                var Fobj = data;
                                var Baidu = new baidu.baiduAPI();
                                $.each(Fobj.FObject.Table1, function (index, obj) {
                                    obj.FStartDateTime = new Date(obj.FStartDateTime.replace(/T/ig, ' ').substring(0, 19)).getTime() + obj.FTimeDifferent * 1000;
                                    obj.FStartDateTime = _this.timeDiffer(new Date(obj.FStartDateTime));
                                    obj.FEndDateTime = new Date(obj.FEndDateTime.replace(/T/ig, ' ').substring(0, 19)).getTime() + obj.FTimeDifferent * 1000;
                                    obj.FEndDateTime = _this.timeDiffer(new Date(obj.FEndDateTime));
                                    obj.FDate = _this.parseGMT(obj.FDate.replace(/T/ig, ' '));
                                    obj.FDate = _this.timeChange(obj.FDate);
                                    _this.$set(obj, 'sposition', null);
                                    _this.$set(obj, 'eposition', null);
                                    var point1 = {
                                        lng: obj.FStartLongitude,
                                        lat: obj.FStartLatitude,
                                    }
                                    var point2 = {
                                        lng: obj.FEndLongitude,
                                        lat: obj.FEndLatitude,
                                    }
                                    var type = _this.$store.state.globalMapType;
                                    var changepoint1 = _this.parsePoint(type, point1);
                                    var changepoint2 = _this.parsePoint(type, point2);
                                    if (obj.FStartLongitude) {
                                        _this.geocoder(type, changepoint1, obj, 'sposition');
                                    } else {
                                        obj.sposition = '--'
                                    }
                                    if (obj.FEndLongitude) {
                                        _this.geocoder(type, changepoint2, obj, 'eposition');
                                    } else {
                                        obj.eposition = '--'
                                    }
                                    _this.tableData4.push(obj);
                                    //开始位置
                                    /*var point1 = Baidu.GetPosition(obj.FStartLongitude,obj.FStartLatitude);
                                    var geoc1 = Baidu.GetClientGeocoder();
                                    Baidu.Geoco_GetLocation(geoc1, point1, function (json) {
                                      var address1;
                                        if(json.address==''){
                                            address1='--'
                                        }else {
                                          address1 = json.address;
                                        }
                                      _this.$set(_this.tableData4[index],'sposition',address1);
                                    });
                                    //结束位置
                                    var point2 = Baidu.GetPosition(obj.FEndLongitude,obj.FEndLatitude);
                                    var geoc2 = Baidu.GetClientGeocoder();
                                    Baidu.Geoco_GetLocation(geoc2, point2, function (json) {
                                      var address2;
                                      if(json.address==''){
                                          address2='--'
                                      }else {
                                        address2 = json.address;
                                      }
                                      _this.$set(_this.tableData4[index],'eposition',address2);
                                     });*/
                                })
                                _this.loading = false;
                                _this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
                            }
                        },
                        error: function () {
                            console.log("_请求失败_")
                        }
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                }
            },
            //请求运行段
            checkRun() {
                var _this = this;
                var startTime;
                var endTime;
                //var FVehicleID = this.objDetail.FVehicleGUID;  //这个可能会取不到？保存table3的时候就要保存
                var curpageIndex = this.pageIndex2;
                var curpageSize = this.pageSize2;
                var year = new Date().getFullYear();
                var month = new Date().getMonth() + 1;
                var date = new Date().getDate();
                var today = year + '-' + month + '-' + date;
                /*if (this.value4 == '') {
                  startTime =this.parseUTC(today + ' 00:00:00');
                  endTime = this.parseUTC(today + ' 23:59:59');
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
                let FVehicleID = this.objDetail.FVehicleGUID;
                if (FVehicleID != undefined) {
                    _this.loading = true;
                    let postData = {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryReportDriveCountByFVehicleGUIDs",
                        FVehicleGUIDs:FVehicleID,
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
                        "data": JSON.stringify(postData),
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
                                    obj.FStartDateTime = _this.parseGMT(obj.FStartDateTime.replace(/T/ig, ' ').substring(0, 19));
                                    obj.FEndDateTime = _this.parseGMT(obj.FEndDateTime.replace(/T/ig, ' ').substring(0, 19));
                                    _this.$set(obj, 'sposition', null);
                                    _this.$set(obj, 'eposition', null);
                                    var point1 = {
                                        lng: obj.FStartLongitude,
                                        lat: obj.FStartLatitude,
                                    }
                                    var point2 = {
                                        lng: obj.FEndLongitude,
                                        lat: obj.FEndLatitude,
                                    }
                                    var type = _this.$store.state.globalMapType;
                                    var changepoint1 = _this.parsePoint(type, point1);
                                    var changepoint2 = _this.parsePoint(type, point2);
                                    if (obj.FStartLongitude) {
                                        _this.geocoder(type, changepoint1, obj, 'sposition');
                                    } else {
                                        obj.sposition = '--'
                                    }
                                    if (obj.FEndLongitude) {
                                        _this.geocoder(type, changepoint2, obj, 'eposition');
                                    } else {
                                        obj.eposition = '--'
                                    }
                                    _this.tableData5.push(obj);
                                    /*//开始位置
                                    var point1 = Baidu.GetPosition(obj.FStartLongitude,obj.FStartLatitude);
                                    var geoc1 = Baidu.GetClientGeocoder();
                                    Baidu.Geoco_GetLocation(geoc1, point1, function (json) {
                                      var address1;
                                      if(json.address==''){
                                          address1='--'
                                      }else {
                                        address1 = json.address;
                                      }
                                      _this.$set(_this.tableData5[index],'sposition',address1);
                                    });
                                    //结束位置
                                    var point2 = Baidu.GetPosition(obj.FEndLongitude,obj.FEndLatitude);
                                    var geoc2 = Baidu.GetClientGeocoder();
                                    Baidu.Geoco_GetLocation(geoc2, point2, function (json) {
                                      var address2;
                                      if(json.address==''){
                                          address2='--'
                                      }else {
                                        address2 = json.address;
                                      }
                                      _this.$set(_this.tableData5[index],'eposition',address2);
                                    });*/
                                })
                                _this.loading = false;
                                _this.FTotalCount2 = Fobj.FObject.Table[0].FTotalCount;
                            }
                        },
                        error: function () {
                            console.log("_请求失败_")
                        }
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                }
            }
        },
        watch: {
            screenHeight() {
                this.adjustPage();
            }
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

    a:hover {
        text-decoration: none;
    }
</style>