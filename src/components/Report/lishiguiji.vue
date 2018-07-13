<template>
    <section>
        <!--<vehical-list v-on:child="get" v-if="SystemID!==2&&SystemID!==6&&SystemID!==7"></vehical-list>-->
        <vehical-list v-on:child="get" v-if="showVehicalList"></vehical-list>
        <!--<lock-list v-on:child="get" v-if="SystemID===2||SystemID===6||SystemID===7"></lock-list>-->
        <!-- <lock-list v-on:child="get" v-if="(SystemID===2||SystemID===7)&&showVehicalList"></lock-list> -->
        <div id="operate_wrapper">
            <div class='box-header'>
                <div class="block">
                    <span class="operatExp">_选择车辆_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal">
                        <!---->
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="img-icon icon-carList-dialog" v-if="SystemID!==2&&SystemID!==6&&SystemID!==7"></i>
                            <i class="fa fa-lock" style="font-size: 18px" v-if="SystemID==2||SystemID==6||SystemID==7"></i>
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
                    <el-dropdown style='margin-left:9px'>
                        <el-button type="primary" class='export'>
                            _导出文件_
                            <i class="fa fa-share-square-o"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">


                            <el-dropdown-item>
                                <a href="javascript:;" @click="exportFile('csv')">_导出_ CVS</a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a href="javascript:;" @click="exportFile('pdf')">_导出_ PDF</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div class="el_table_wrap" id="el_table_wrap">
            <el-table :data="tableData3" stripe style="width: 100%" :height="table_height" ref="multipleTable" @selection-change="handleSelectionChange"
                empty-text='_暂无数据_' v-loading="loading" element-loading-text="_拼命加载中_">
                <!--<el-table-column type="selection" width="40"></el-table-column>-->
                <el-table-column prop='RowNo' label="_序号_" width="65">
                </el-table-column>
                <el-table-column prop="FShortName" label="_公司简称_" width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="FVehicleName" :label="SystemID==6?'_箱号_':'_车牌号_'" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FAssetID" label="_终端编号_" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FGPSDateTime" label="_轨迹时间_" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FRecvDateTime" label="_接收时间_" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FSpeed" label="_速度_(km/h)" v-if="SystemID==1||SystemID==2||SystemID==4||SystemID==7" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FMileage" label="_里程_(km)" v-if="SystemID==1||SystemID==2||SystemID==4||SystemID==7" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FCouplingStatus" label="_是否接挂_" width="120" v-if="SystemID==1" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FLockStatus" label="_锁状态_" width="120" v-if="SystemID==2" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FACC" label="ACC_状态_" width="120" v-if="SystemID==4" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sposition" label="_位置_" min-width="200" show-overflow-tooltip align='left'>
                </el-table-column>
                <el-table-column prop="FLongitude" label="_经度_" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FLatitude" label="_纬度_" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FLocationType" label="_定位状态_" width="150" show-overflow-tooltip v-if="SystemID==2||SystemID==4">
                </el-table-column>
                <el-table-column prop="FSwitchDoorTimes" label="_开关门次数_" width="120" v-if="SystemID==6" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FGPSSignal" label="GPS_个数_" v-if="SystemID==1||SystemID==2||SystemID==4||SystemID==7" width="120"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FCELLType" label="GPS_型号_" v-if="SystemID==1||SystemID==4||SystemID==7" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FBoxDoorStatus" label="_门状态_" v-if="SystemID==6" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FContainerStatus" label="_是否装箱_" width="180" v-if="SystemID==1||SystemID==4||SystemID==7" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FBoxLoadedStatus" label="_空重载状态_" width="160" v-if="SystemID==6" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FCellSignal" label="_网络信号_" v-if="SystemID==1||SystemID==2||SystemID==4||SystemID==7" width="120"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FAttitude" label="_锁姿态_" width="120" v-if="SystemID==2" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FOperatorName" label="_运营商名称_" v-if="SystemID==1||SystemID==4||SystemID==7" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FCharge" label="_是否正常充电_" v-if="SystemID==1||SystemID==2||SystemID==4||SystemID==7" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FWorkStatus" label="_是否作业状态_" v-if="SystemID==1||SystemID==2||SystemID==4||SystemID==7" width="180"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FPowerType" label="_电源类型_" v-if="SystemID==1||SystemID==2||SystemID==4||SystemID==7" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FBatteryPercent" label="_电量_(%)" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FAuxiliaryBatteryPercent" label="_从机电量_" v-if="SystemID==6" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column v-if="SystemID==1||SystemID==4||SystemID==7" min-width="800" header-align="left" class-name="header-left"
                    align="left" label="_温湿度_">
                    <template scope="scope">
                        <ul>
                            <li class="humiture" v-for="(value, key) in tableData3[scope.$index].allstatus" style='display:inline-block' v-show='tableData3[scope.$index].allstatus.length>0'>
                                <i class='tire'>{{value[2]}}</i>
                                <span class="humitureTxt">{{value[0]}}&nbsp;℃</span>
                                <span class="humitureTxt">{{value[1]}}&nbsp;%</span>
                            </li>
                            <li v-show='tableData3[scope.$index].allstatus.length==0'>--</li>
                        </ul>
                    </template>
                </el-table-column>
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

    import baidu from 'js/GIS/Baidu/BaiduAPI.js'
    import VehicalList from 'components/dialog/vehicalList.vue'
    // import  lockList from './../EL/lockList.vue'
    export default {
        data() {
            return {
                table: [],
                showVehicalList: false,
                loading: false,
                url: null,
                psize: 20,
                //value3: [new Date(), new Date()],
                value4: [new Date(), new Date()],
                //value4: '',
                FTotalCount: 0,
                pageSize1: 20,
                pageIndex1: 1,
                table_height: null,
                tableData3: [],
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
            screenHeight: Number
        },
        components: {
            VehicalList,

            // lockList
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
            getTime: function (value) {
                //return this.value4=value;
            },
            //重置表单
            reset: function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid');
                //this.value3=' ';
                this.value4 = [null, null];
                this.tableData3 = [],
                    this.FTotalCount = 0;
                this.pageIndex1 = 1;
            },
            //导出
            handleSelectionChange() {
            },
            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
                this.pageSize1 = val
                this.doQuery();
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
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
            rangeTime(start, end) {
                //alert(start,end);

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
                console.log('arr')
                return arr.join(',');
            },
            //请求报表
            doQuery(bool) {
                var _this = this;
                var curpageIndex;
                var curpageSize;
                var FVehicleID = $(".search-input").attr("fguid");
                var startTime;
                var endTime;
                var FTableDate;
                if (FVehicleID == undefined) {
                    this.message('_请选择车辆_/_箱号_', 'warning');
                    this.tableData3 = [];
                    this.FTotalCount = 0;
                    return
                }
                if (this.value4[0] && this.value4[1]) {
                    var t1 = this.timeChange(this.value4[0]);
                    var t2 = this.timeChange(this.value4[1]);
                    var startTime = this.parseUser(t1 + ' 00:00:00');
                    var endTime = this.parseUser(t2 + ' 23:59:59');
                    /*var t3=this.timeChange(startTime);
                    var t4=this.timeChange(endTime);*/
                    var t3 = startTime.substr(0, 10);
                    var t4 = endTime.substr(0, 10);
                    var FTableDate = this.rangeTime(t3, t4);
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
                    this.FTotalCount = 0;
                    return
                }
                curpageIndex = this.pageIndex1;    //表示this['pageIndex']，取到实际的this.pageIndex1
                curpageSize = this.pageSize1;

                let postData = {
                    FTokenID: _this.$store.state.FTokenID, 
                    FAction: "QueryReportLBSTrackListByFVehicleGUID", 
                    FVehicleGUID: FVehicleID,
                    FStartTime: startTime, 
                    FEndTime: endTime,
                    FTableDate:FTableDate,
                    FPageSize: curpageSize,
                    FPageIndex: curpageIndex, 
                    FVersion: "1.0.0"
                }
                //获取车牌
                if (FVehicleID != undefined && this.value4) {
                    _this.loading = true;
                    $.ajax({
                        'url': '/web/Combine/Combine_Report',
                        "cache": false,
                        "async": true,
                        "type": "post",
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
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
                                _this.loading = false;
                                if (bool) {
                                    _this.pageIndex1 = 1;
                                }
                                var Fobj = data;
                                _this.tableData3 = [];
                                _this.table = [];
                                // var Baidu= new baidu.baiduAPI();
                                $.each(Fobj.FObject.Table1, function (index, obj) {
                                    obj.FGPSDateTime = _this.parseGMT(obj.FGPSDateTime.replace(/T/ig, ' ').substring(0, 19));
                                    obj.FRecvDateTime = _this.parseGMT(obj.FRecvDateTime.replace(/T/ig, ' ').substring(0, 19));
                                    obj.FLocationType = obj.FLocationType == 1 ? 'GPS' : obj.FLocationType == 2 ? '_基站定位_' : obj.FLocationType == 3 ? 'WIFI' : '_不定位_';
                                    obj.FCouplingStatus = obj.FCouplingStatus ? '_是_' : '_否_';
                                    obj.FContainerStatus = obj.FContainerStatus ? '_有厢_' : '_无厢_';
                                    obj.FWorkStatus = obj.FWorkStatus ? '_是_' : '_否_';
                                    obj.FCharge = obj.FCharge ? '_是_' : '_否_';
                                    obj.FLockStatus = obj.FLockStatus ? '_开锁_' : '_上锁_';
                                    obj.FACC = obj.FACC ? '_开_' : '_关_';
                                    obj.FCELLType = obj.FCELLType == 2 ? '2g' : obj.FCELLType == 3 ? '3g' : obj.FCELLType == 4 ? '4g' : '--';
                                    obj.FBoxDoorStatus = (obj.FBoxDoorStatus == '-1' || obj.FBoxDoorStatus == null) ? '_无_' : (obj.FBoxDoorStatus == 0) ? '_关门_' : (obj.FBoxDoorStatus == 1) ? '_开门_' : '_无_';
                                    obj.FBoxLoadedStatus = (obj.FBoxLoadedStatus == '-1' || obj.FBoxLoadedStatus == null) ? '_无_' : (obj.FBoxLoadedStatus == 0) ? '_空载_' : (obj.FBoxLoadedStatus == 1) ? '_重载_' : '_无_';
                                    obj.FPowerType = (obj.FPowerType == -1 || obj.FPowerType == null) ? '_无_' : (obj.FPowerType == 1) ? '_内置电池_' : (obj.FPowerType == 2) ? '_外部电源_' : '_无_';
                                    obj.FAuxiliaryBatteryPercent = (obj.FAuxiliaryBatteryPercent == '-1' || obj.FAuxiliaryBatteryPercent == null) ? '_无_' : obj.FAuxiliaryBatteryPercent;
                                    obj.FSwitchDoorTimes = (obj.FSwitchDoorTimes == '-1' || obj.FSwitchDoorTimes == null) ? '_无_' : obj.FSwitchDoorTimes;
                                    obj.FOperatorName = obj.FOperatorName == null ? '--' : obj.FOperatorName;
                                    obj.FVehicleName = (obj.FVehicleName == null) ? obj.FVehicleName1 : obj.FVehicleName;
                                    obj.FBatteryPercent = obj.FBatteryPercent > 100 ? "_充电中_" : (obj.FBatteryPercent == -1 ? "--" : obj.FBatteryPercent);
                                    if (obj.FAttitude != null) {
                                        obj.FAttitude = _this.parseLockPose(obj.FAttitude);
                                        obj.FAttitude = (obj.FAttitude == 1) ? '_正立_' : (obj.FAttitude == 2) ? '_异常前倾_' : (obj.FAttitude == 3) ? '_异常后倾_' : (obj.FAttitude == 4) ? '_异常左倾_' : (obj.FAttitude == 5) ? '_异常右倾_' : (obj.FAttitude == 6) ? '_异常侧立_' : (obj.FAttitude == 7) ? '_异常倒立_' : (obj.FAttitude == 8) ? '_异常平躺_' : '_无_'
                                    } else {
                                        obj.FAttitude = '_无_'
                                    }
                                    let nubmerArr = [];
                                    let mixObj = {};
                                    for (var i = 1; i < 5; i++) {
                                        if (obj['FTemperature' + i] && obj['FTemperature' + i] !== '' && obj['FTemperature' + i] !== null && obj['FTemperature' + i] !== -1000) {
                                            nubmerArr.push([obj['FTemperature' + i], obj['FHumidity' + i], i]);
                                        }
                                    }
                                    console.log('nubmerArr', nubmerArr)
                                    obj.allstatus = (nubmerArr.length > 0) ? nubmerArr : [];
                                    //位置
                                    if (obj.FLongitude) {
                                        _this.$set(obj, 'sposition', null);
                                        var point1 = {
                                            lng: obj.FLongitude,
                                            lat: obj.FLatitude,
                                        }
                                        var type = _this.$store.state.globalMapType;
                                        var changepoint = _this.parsePoint(type, point1);
                                        _this.geocoder(type, changepoint, obj, 'sposition');
                                    } else {
                                        obj.sposition = '--'
                                    }
                                    console.log('obj', obj)
                                    _this.tableData3.push(obj);
                                });
                                _this.FTotalCount = Fobj.FObject.Table[0].FTotalCount;
                            }
                        },
                        error: function () {
                            //console.log('_请求失败_');
                            _this.loading = false;
                            _this.$message({
                                showClose: true,
                                message: '_请求失败_',
                                type: 'warning'
                            });
                        }
                    })
                }
            },
            exportFile(type) {
                var _this = this;
                var curpageIndex;
                var curpageSize;
                var FVehicleID = $(".search-input").attr("fguid");
                var startTime;
                var endTime;
                /*var year=new Date().getFullYear();
                 var month=new Date().getMonth()+1;
                 var date=new Date().getDate();
                 var today=year+'-'+month+'-'+date;*/
                var FTableDate;
                if (this.value4[0] && this.value4[1]) {
                    var t1 = this.timeChange(this.value4[0]);
                    var t2 = this.timeChange(this.value4[1]);
                    var startTime = this.parseUser(t1 + ' 00:00:00');
                    var endTime = this.parseUser(t2 + ' 23:59:59');
                    /*var t3=this.timeChange(startTime);
                    var t4=this.timeChange(endTime);*/
                    var t3 = startTime.substr(0, 10);
                    var t4 = endTime.substr(0, 10);
                    FTableDate = this.rangeTime(t3, t4);
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
                    this.FTotalCount = 0;
                    return
                }
                let newTab = null;
                if (type == "pdf") {
                    newTab = window.open('about:blank');
                    newTab.document.write("<p>_请稍候_,_正在导出_ pdf,_请勿关闭窗口_...</p>");
                }
                if (_this.FTotalCount >= 1000) {
                    this.$message({
                        showClose: true,
                        message: '_仅返回前一千条逆地理编码_!',
                    });
                }
                //甩挂和冷链
                if (this.SystemID == 3 || this.SystemID == 4) {
                    var url1 = '/web/Common/Common_Report';
                    var data1 = '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"ExportFleetManagerReportLBSTrackListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FPageSize":"' + _this.FTotalCount + '" ,"FType":"' + type + '","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' + FTableDate + '",FTimeDifferent:"' + _this.$store.state.timeDifferent + '",FLanguage:"' + _this.$store.state.language + '"}'
                } else if (this.SystemID == 1) {
                    var url1 = '/web/Common/Common_Report';
                    var data1 = '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"ExportTrailerReportLBSTrackListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FPageSize":"' + _this.FTotalCount + '" ,"FType":"' + type + '","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' + FTableDate + '",FTimeDifferent:"' + _this.$store.state.timeDifferent + '",FLanguage:"' + _this.$store.state.language + '"}'
                } else if (this.SystemID == 2) {
                    var url1 = '/web/Lock/Lock_Report';
                    var data1 = '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"ExportReportLBSTrackListByFAssetGUID","FAssetGUID":"' + FVehicleID + '","FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FPageSize":"' + _this.FTotalCount + '" ,"FType":"' + type + '","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' + FTableDate + '",FTimeDifferent:"' + _this.$store.state.timeDifferent + '",FLanguage:"' + _this.$store.state.language + '"}'
                } else if (this.SystemID == 6) {
                    var url1 = '/web/container/container_Report';
                    var data1 = '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"ExportReportLBSTrackListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FPageSize":"' + _this.FTotalCount + '" ,"FType":"' + type + '","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' + FTableDate + '",FTimeDifferent:"' + _this.$store.state.timeDifferent + '",FLanguage:"' + _this.$store.state.language + '"}'
                } else if (this.SystemID == 7) {
                    var url1 = '/web/SmartDistribution/SmartDistribution_Report';
                    var data1 = '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"ExportReportLBSTrackListByFAssetGUID","FAssetGUID":"' + FVehicleID + '","FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FPageSize":"' + _this.FTotalCount + '" ,"FType":"' + type + '","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' + FTableDate + '",FTimeDifferent:"' + _this.$store.state.timeDifferent + '",FLanguage:"' + _this.$store.state.language + '"}'
                }
                //获取车牌
                if (FVehicleID != undefined && this.value4) {
                    _this.loading = true;
                    $.ajax({
                        'url': url1,
                        "cache": false,
                        "async": true,
                        "type": "post",
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
                        'data': data1,
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
                            } else if (data.Result == 201) {
                                if (type == "pdf") {

                                    newTab.document.write("<p>_导出失败_!,_两秒后关闭页面_</p>");
                                    setTimeout(function () {
                                        newTab.close();
                                    }, 2000);
                                }
                                _this.loading = false;
                                _this.$message({
                                    showClose: true,
                                    message: '_暂无数据_',
                                    type: 'warning'
                                });
                            } else if (data.Result == 200) {
                                _this.loading = false;
                                if (type == 'csv') {

                                    window.location = "http://cloud.jointcontrols.cn:56091" + data.FObject;
                                } else {

                                    newTab.location.href = "http://cloud.jointcontrols.cn:56091" + data.FObject;
                                }
                            } else {
                                if (type == "pdf") {

                                    newTab.document.write("<p>_导出失败_!,_两秒后关闭页面_</p>");
                                    setTimeout(function () {
                                        newTab.close();
                                    }, 2000);
                                }
                                _this.loading = false;
                                _this.$message({
                                    showClose: true,
                                    message: '_错误_' + data.Result,
                                    type: 'warning'
                                });
                            }
                        },
                        error: function () {
                            _this.$message({
                                showClose: true,
                                message: '_请求超时_',
                                type: 'warning'
                            });
                            _this.loading = false;
                            console.log('_请求失败_')
                        }
                    })
                } else if (FVehicleID == undefined) {
                    this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                    this.tableData3 = [];
                    this.FTotalCount = 0;
                }
            },
            // 点击节点
            get: function (data) {
                if (data[0] !== undefined && data[1] !== undefined) {
                    $('.search-input').val(data[0]);
                    $('.search-input').attr('title', data[0])
                    $('.search-input').attr('fguid', data[1])
                }
            }
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
<style scoped>
</style>