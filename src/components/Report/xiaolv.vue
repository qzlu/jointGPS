<template>
    <section>
        <vehical-select-dialog v-on:child="get" v-if="showVehicalList"></vehical-select-dialog>
        <!-- <lock-select-dialog v-on:child="get" v-if="SystemID==2&&showVehicalList"></lock-select-dialog> -->
        <div id="operate_wrapper">
            <div class='box-header'>
                <!-- <div class="block">
          <span class="operatExp">_选择车辆_</span>
          <div class="search-input-wrap" data-toggle="modal" data-target="#modal">
            <a href="javascript:;" class="get-carList-dialog">
              <i class="img-icon icon-carList-dialog" ></i>
            </a>
            <input type="text" class="search-input cursor-pointer" readonly='readonly' >
          </div>
        </div> -->

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
                    <el-date-picker size="small" v-model="value4" type="daterange" @change="getTime" :clearable="false" :picker-options="pickerOptions2"
                        placeholder="_选择时间范围_">
                    </el-date-picker>
                </div>
                <div class="btnList">
                    <el-button type="primary" class="search" @click="doQuery('true')">_查询_</el-button>
                    <el-button type="primary" class="reset" @click='reset'>_重置_</el-button>
                    <!-- <el-dropdown> -->
                    <el-button type="primary" class='export'>
                        _导出文件_
                        <i class="fa fa-share-square-o"></i>
                    </el-button>
                    <!-- <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a href="#">导出CVS</a></el-dropdown-item>
              <el-dropdown-item>导出PDF</el-dropdown-item>
            </el-dropdown-menu> -->
                    <!-- </el-dropdown> -->
                </div>
                <!-- <span style='margin-left:10px' class="text-red cursor-pointer" title="_运行效率_= (_运行天数_/_在线天数_)*100%">_运行效率计算式_</span> -->
                <span style='margin-left:10px'>_运行效率_= (_运行天数_/_在线天数_)*100%</span>
            </div>
        </div>
        <div class="el_table_wrap" id="el_table_wrap">
            <el-table :data="tableData3" stripe style="width: 100%" :height="table_height" ref="multipleTable" @selection-change="handleSelectionChange"
                v-loading="loading" element-loading-text="_拼命加载中_" empty-text="_暂无数据_">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop='RowNo' label="_序号_" width="65">
                </el-table-column>
                <el-table-column prop="FShortName" label="_公司简称_" width="180" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="FAssetID" label="_终端号_" width="180" sortable v-if="SystemID==2" show-overflow-tooltip></el-table-column>
                <el-table-column prop="FVehicleName" label="_车牌号_" width="180" show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column prop="FDriveMileage" label="_运行里程_(km)" width="160" sortable show-overflow-tooltip> 
        </el-table-column>
        <el-table-column prop="countDay" label="_运行天数_" width="140" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="FDriveDuration" label="_运行时长_" width="140" sortable :sort-method='sortMethod' :formatter='formatter' show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="efficiency" label="_运行效率_" width="160" sortable :sort-method='sortMethod1' :formatter='formatter1' 
                         class-name='fix-color' show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="FStartDateTime" label="_开始日期_" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="FEndDateTime" label="_结束日期_" width="200" show-overflow-tooltip>
        </el-table-column> -->
                <el-table-column prop="FEfficiency" label="_运行效率_" width="160" class-name='fix-color' sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FRunCount" label="_运行天数_" width="160" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FCount" label="_在线天数_" width="180" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FStartDate" label="_开始日期_" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FEndDate" label="_结束日期_" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop=" " label=" " min-width="1"></el-table-column>
            </el-table>
        </div>
        <div class="pagination" id='pagination'>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex1" :page-sizes="[10, 20, 30]"
                    :page-size="pageSize1" layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount">
                </el-pagination>
            </div>
        </div>
    </section>
</template>
<script>

    import baidu from '../../js/GIS/Baidu/BaiduAPI.js'
    import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
    // import  lockSelectDialog from './../EL/lockSelectDialog.vue'

    export default {
        data() {
            return {
                showVehicalList: false,
                loading: false,
                url: null,
                psize: 20,
                //value3: [new Date(), new Date()],
                // value3:' ',
                value4: [(new Date()).setDate((new Date()).getDate() - 1), (new Date()).setDate((new Date()).getDate() - 1)],
                FTotalCount: 0,
                pageSize1: 20,
                pageIndex1: 1,
                table_height: null,
                tableData3: [],
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
        components: {
            VehicalSelectDialog,
            // lockSelectDialog
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
                if (a.efficiency - b.efficiency > 0) {
                    return true
                } else {
                    return false
                }
            },
            formatter1(row, column, cellValue) {
                if (row.efficiency != 0) {
                    return row.efficiency + '%';
                } else {
                    return 0
                }
            },
            getTime: function (value) {
                //return this.value4=value;
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
            //重置表单
            reset: function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid');
                this.value4 = [null, null];
                this.tableData3 = [],
                    this.FTotalCount = 0;
                this.pageIndex1 = 1;
            },
            //提示信息
            message(msg, type) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type
                });
            },
            //导出
            handleSelectionChange() {
            },
            handleSizeChange(val) {
                this.pageSize1 = val
                this.doQuery();
            },
            handleCurrentChange(val) {
                this.pageIndex1 = val
                this.doQuery();
            },
            adjustPage() {
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) + 8;
            },
            //时间格式转换
            timeChange(time) {
                var time1 = Date.parse(new Date(time));
                var uom1 = new Date(time1);
                var month1 = (uom1.getMonth() + 1).toString().length == 1 ? "0" + (uom1.getMonth() + 1).toString() : (uom1.getMonth() + 1);
                var day1 = uom1.getDate().toString().length == 1 ? "0" + uom1.getDate() : uom1.getDate();
                return uom1.getFullYear() + '-' + month1 + '-' + day1;
            },
            //获取时间范围
            rangeDay(start, end) {
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
                return arr.length;
            },
            //请求报表
            doQuery(bool) {
                var _this = this;
                var curpageIndex;
                var curpageSize;
                var FVehicleID = $(".search-input").attr("fguid");
                var startTime;
                var endTime;
                var FDates;
                if (FVehicleID == undefined) {
                    this.message('_请选择车辆_/_箱号_', 'warning');
                    this.tableData3 = [];
                    this.FTotalCount = 0;
                    return
                }
                if (this.value4[0] && this.value4[1]) {
                    var t1 = this.timeChange(this.value4[0]);
                    var t2 = this.timeChange(this.value4[1]);
                    FDates = this.rangeTime(t1, t2);
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
                    this.message('_请选择时间_', 'warning');
                    this.tableData3 = [];
                    this.FTotalCount = 0;
                    return
                }
                curpageIndex = this.pageIndex1;
                curpageSize = this.pageSize1;
               
                //获取车牌
                if (FVehicleID != undefined && this.value4) {
                    _this.loading = true;
                    let postData = {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryReportRunStopCountByFVehicleGUIDs",
                        FVehicleGUIDs: FVehicleID,
                        FDates: FDates,
                        FPageSize: curpageSize,
                        FPageIndex: curpageIndex,
                        FVersion: "1.0.0"
                    };
                    $.ajax({
                        'url': '/web/Combine/Combine_Report',
                        "cache": false,
                        "async": true,
                        "type": "post",
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
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
                                _this.loading = false;
                                if (bool) {
                                    _this.pageIndex1 = 1;
                                }
                                var Fobj = data;
                                _this.tableData3 = [];
                                $.each(Fobj.FObject.Table1, function (index, obj) {
                                    if (obj.FCount) {

                                        //obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' ')).substring(0,10);
                                        //obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' ')).substring(0,10);
                                        //obj.countDay=_this.rangeDay(obj.FStartDateTime,obj.FEndDateTime);
                                        //obj.efficiency=((obj.FDriveDuration/(obj.countDay*24*3600))*100).toFixed(2);
                                        obj.FVehicleName = obj.FVehicleName ? obj.FVehicleName : '--';
                                        obj.FStartDate = obj.FStartDate.substring(0, 10);
                                        obj.FEndDate = obj.FEndDate.substring(0, 10);
                                        /* obj.FStartDate=_this.parseGMT(obj.FStartDate.replace(/T/ig,' ')).substring(0,10);
                                         obj.FEndDate=_this.parseGMT(obj.FEndDate.replace(/T/ig,' ')).substring(0,10);*/
                                        obj.FEfficiency = obj.FEfficiency + '%';
                                        _this.tableData3.push(obj);
                                    } else {
                                        obj.FVehicleName = obj.FVehicleName ? obj.FVehicleName : '--';
                                        obj.FCount = 0;
                                        obj.FRunCount = 0;
                                        obj.FEfficiency = 0;
                                        obj.FStartDate = '--';
                                        obj.FEndDate = '--';
                                        _this.tableData3.push(obj);
                                    }
                                });
                                _this.FTotalCount = data.FObject.Table[0].FTotalCount;
                            }
                        },
                        error: function () {
                            console.log('_请求失败_')
                        }
                    })
                }
                /*else if(FVehicleID == undefined){
                  if(this.SystemID==1||this.SystemID==3||this.SystemID==4){
                    this.message('_请选择车辆_/_箱号_','warning');
                  }else if(this.SystemID==2){
                     this.message('_请选择设备_','warning');
                  };
                  this.tableData3=[];
                  this.FTotalCount=0;
                }*/
            },
            // 点击节点
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
                    $('.search-input').removeAttr('fguid'); 639
                }
                /*if(this.SystemID==2){
                  $('.search-input').val("_已选_"+data[0].length);
                }else {
                  $('.search-input').val("_已选_"+data[0].length+"_辆_");
                }
                $('.search-input').attr('title',data[0])
                $('.search-input').attr('fguid',data[1])*/
            },
        },
        watch: {
            screenHeight() {
                this.adjustPage();
            }
        },
        deactivated() {
            this.showVehicalList = false;
        }
    }
</script>
<style>
    .fix-color {
        color: #005fc6;
    }
</style>