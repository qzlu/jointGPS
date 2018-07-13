<template>
    <section>
        <vehical-list v-on:child="get" v-if="SystemID!==2"></vehical-list>
        <lock-list v-on:child="get" v-if="SystemID==2"></lock-list>
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
                    <span class="operatExp" v-if="SystemID!==2">_选择车辆_</span>
                    <span class="operatExp" v-if="SystemID==2">_选择设备_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal"><!---->
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="img-icon icon-carList-dialog"  v-if="SystemID!==2"></i>
                            <i class="fa fa-lock" style="font-size: 18px"  v-if="SystemID==2"></i>
                        </a>
                        <input type="text" class="search-input" readonly="readonly">
                    </div>
                </div>
                <div class="block">
                    <span class="operatExp">_选择时间_</span>
                    <el-date-picker
                            size="small"
                            v-model="value4"
                            type="daterange"
                            @change="getTime"
                            :clearable="false"
                            :picker-options="pickerOptions2"
                            placeholder="_选择时间范围_">
                    </el-date-picker>
                </div>
                <div class="btnList">
                    <!-- @click="doQuery('true')"-->
                    <el-button type="primary" class="search" @click="doQuery()">_查询_</el-button>
                    <el-button type="primary" class="reset" @click='reset'>_重置_</el-button>
                    <el-dropdown>
                        <el-button type="primary" class='export'>
                            _导出文件_ <i class="fa fa-share-square-o"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">

                            <el-dropdown-item><a href="javascript:;" @click="exportFile('csv')">_导出_ CVS</a></el-dropdown-item>
                            <el-dropdown-item><a href="javascript:;" @click="exportFile('pdf')">_导出_ PDF</a></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div class="el_table_wrap" id="el_table_wrap">
            <el-table :data="tableData3" stripe style="width: 100%" :height="table_height" ref="multipleTable" @selection-change="handleSelectionChange"
                      empty-text='_暂无数据_'
                      v-loading="loading"
                      element-loading-text="_拼命加载中_"
            >
                <el-table-column prop='RowNo' label="_序号_" width="65">
                </el-table-column>
                <el-table-column prop="FVehicleName" label="_箱号_" width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="FGPSDateTime" label="_定位时间_" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sposition" label="_当前位置_" width="240" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FBoxDoorStatus" label="_门状态_" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FBoxLoadedStatus" label="_空重载状态_" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FOutsideTemperature" label="_箱内温度_(℃)" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FInsideTemperature" label="_箱外温度_(℃)" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FBatteryPercent" label="_电量_" width="120" show-overflow-tooltip>
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
        </div>
        <div  class="pagination" id='pagination'>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex1"
                        :page-sizes="[10, 20, 30]"
                        :page-size="pageSize1"
                        layout="prev, pager, next, jumper,total,sizes"
                        :total="FTotalCount">
                </el-pagination>
            </div>
        </div>
    </section>
</template>
<script>

    import  baidu from '../../js/GIS/Baidu/BaiduAPI.js'
    import  VehicalList from 'components/dialog/vehicalList.vue'
    import  lockList from './../EL/lockList.vue'

    export default {
        data() {
            return {
                loading:false,
                url:null,
                psize:20,
                //value3: [new Date(), new Date()],
                value4: [new Date(), new Date()],
                //value4: '',
                FTotalCount:0,
                pageSize1:20,
                pageIndex1:1,
                table_height: null,
                tableData3:[],
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
            lockList
        },
        computed:{
            SystemID(){
                return this.$store.state.choiceSystemID;
            }
        },
        mounted(){
            var _this=this;
            setTimeout(() => {
                this.adjustPage();
        },100);
        },
        methods: {
            getTime:function (value) {
                //return this.value4=value;
            },
            //重置表单
            reset:function () {
                $('.search-input').val('');
                $('.search-input').removeAttr('fguid');
                //this.value3=' ';
                this.value4=[null,null];
                this.tableData3=[],
                        this.FTotalCount=0;
                this.pageIndex1=1;
            },
            //导出
            handleSelectionChange(){
            },
            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
                this.pageSize1=val
                this.doQuery();
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                this.pageIndex1=val
                this.doQuery();
            },
            adjustPage(){
                this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) +8;
            },
            //时间格式转换
            timeChange(time){
                var time1=Date.parse(new Date(time));
                var uom1=new Date(time1);
                var month1=(uom1.getMonth()+1).toString().length==1?"0"+(uom1.getMonth()+1).toString():(uom1.getMonth()+1);
                var day1=uom1.getDate().toString().length==1?"0"+uom1.getDate():uom1.getDate();
                return uom1.getFullYear()+'-'+month1+'-'+day1;
            },
            //获取时间范围
            rangeTime(start,end){
                var arr=[];
                var temp1 = start.split("-");
                var temp2 = end.split("-");
                var date1 = new Date(start);
                var date2 = new Date(end);
                while((date2.getTime()-date1.getTime())>=0){
                    var year = date1.getFullYear();
                    var monthTemp=date1.getMonth()+1;
                    var month = monthTemp.toString().length==1?"0"+monthTemp.toString():monthTemp.toString();
                    var day = date1.getDate().toString().length==1?"0"+date1.getDate():date1.getDate();
                    var temp=year+month+day;
                    arr.push(temp)
                    date1.setDate(date1.getDate()+1);
                }
                return arr.join(',');
            },
            //请求报表
            doQuery(){
                var _this=this;
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
                if(this.value4[0]&&this.value4[1]){
                    var t1=this.timeChange(this.value4[0]);
                    var t2=this.timeChange(this.value4[1]);
                    var startTime=this.parseUTC(t1+' 00:00:00');
                    var endTime=this.parseUTC(t2+' 23:59:59');
                    var t3=this.timeChange(startTime);
                    var t4=this.timeChange(endTime);
                    FTableDate=this.rangeTime(t3,t4);
                    let d1=startTime.substr(0,10).split("-")
                    let t1=new Date(d1[0],d1[1]-1,d1[2]).getTime();
                    let d2=endTime.substr(0,10).split("-")
                    let t2=new Date(d2[0],d2[1]-1,d2[2]).getTime();
                    console.log(t2-t1-31*24*60*60*1000)
                    if(t2-t1>(31*24*60*60*1000)){
                        _this.$message({
                            showClose: true,
                            message: '_开始时间与结束时间不能大于_31_天_',
                            type: 'warning'
                        });
                        return
                    }
                }else{
                    this.$message({
                        showClose: true,
                        message: '_请选择时间_',
                        type: 'warning'
                    });
                    this.tableData3=[];
                    this.FTotalCount=0;
                    return
                }
                curpageIndex=this.pageIndex1;    //表示this['pageIndex']，取到实际的this.pageIndex1
                curpageSize=this.pageSize1;

                //获取车牌
                if(FVehicleID!=undefined && this.value4){
                    _this.loading=true;
                    $.ajax({
                        'url':'/web/Container/Container_Report',
                        "cache": false,
                        "async": true,
                        "type": "post",
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
                        'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryReportLBSTrackListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' +startTime+ '","FEndTime":"' +endTime+ '","FTableDate":"' +FTableDate+ '","FPageSize":"' +_this.pageSize1+ '" ,"FPageIndex":"' +_this.pageIndex1+ '","FVersion":"1.0.0"}',
                        success:function(data){
                            console.log(data);
                            if(data.Result==104) {
                                _this.$message({
                                    showClose: true,
                                    message: '_登录超时_,_五秒后跳转到登录页面_',
                                    type: 'warning'
                                });
                                setTimeout(function(){
                                    _this.$store.commit("goLogin");
                                },5000)
                                return
                            }else if(data.Result==200){
                                _this.loading=false;
                                // if(bool){
                                //     _this.pageIndex1=1;
                                // }
                                var Fobj = data;
                                _this.tableData3=[];
                                $.each(Fobj.FObject.Table1, function (index, obj) {
                                    obj.FGPSDateTime=_this.parseGMT(obj.FGPSDateTime.replace(/T/ig,' ').substring(0,19));
                                    if(obj.FBoxDoorStatus==-1){
                                        obj.FBoxDoorStatus="--"
                                    }else if(obj.FBoxDoorStatus==0){
                                        obj.FBoxDoorStatus="_开_"
                                    }else if(obj.FBoxDoorStatus==1){
                                        obj.FBoxDoorStatus="_关_"
                                    }
                                    if(obj.FBoxLoadedStatus==-1){
                                        obj.FBoxLoadedStatus="--"
                                    }else if(obj.FBoxLoadedStatus==0){
                                        obj.FBoxLoadedStatus="_空载_"
                                    }else if(obj.FBoxLoadedStatus==1){
                                        obj.FBoxLoadedStatus="_重载_"
                                    }
                                    obj.FBatteryPercent=obj.FBatteryPercent+'%';
                                    obj.FInsideTemperature=_this.parseTemperature(obj.FInsideTemperature);
                                    obj.FOutsideTemperature=_this.parseTemperature(obj.FOutsideTemperature);
                                    // obj.FACC=obj.FACC?'_开_':'_关_';
                                    //位置
                                    if(obj.FLongitude){
                                        _this.$set(obj,'sposition',null);
                                        var point1={
                                            lng:obj.FLongitude,
                                            lat:obj.FLatitude,
                                        }
                                        var type=_this.$store.state.globalMapType;
                                        var changepoint=_this.parsePoint(type,point1);
                                        _this.geocoder(type,changepoint,obj,'sposition');
                                    }else{
                                        obj.sposition='--'
                                    }
                                    _this.tableData3.push(obj);
                                });
                                _this.FTotalCount=Fobj.FObject.Table[0].FTotalCount;
                            }
                        },
                        error:function () {
                            //console.log('_请求失败_');
                            _this.loading=false;
                            _this.$message({
                                showClose: true,
                                message: '_请求失败_',
                                type: 'warning'
                            });
                        }
                    })
                }else if(FVehicleID == undefined){
                    this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                    this.tableData3=[];
                    this.FTotalCount=0;
                }
            },
            exportFile(type){
                var _this=this;
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
                if(this.value4[0]&&this.value4[1]){
                    var t1=this.timeChange(this.value4[0]);
                    var t2=this.timeChange(this.value4[1]);
                    var startTime=this.parseUTC(t1+' 00:00:00');
                    var endTime=this.parseUTC(t2+' 23:59:59');
                    var t3=this.timeChange(startTime);
                    var t4=this.timeChange(endTime);
                    FTableDate=this.rangeTime(t3,t4);
                    let d1=startTime.substr(0,10).split("-")
                    let t1=new Date(d1[0],d1[1]-1,d1[2]).getTime();
                    let d2=endTime.substr(0,10).split("-")
                    let t2=new Date(d2[0],d2[1]-1,d2[2]).getTime();
                    console.log(t2-t1-31*24*60*60*1000)
                    if(t2-t1>(31*24*60*60*1000)){
                        _this.$message({
                            showClose: true,
                            message: '_开始时间与结束时间不能大于_31_天_',
                            type: 'warning'
                        });
                        return
                    }
                }else{
                    this.$message({
                        showClose: true,
                        message: '_请选择时间_',
                        type: 'warning'
                    });
                    this.tableData3=[];
                    this.FTotalCount=0;
                    return
                }
                let newTab=null;
                if(type=="pdf"){
                    newTab=window.open('about:blank');
                    newTab.document.write("<p>_请稍候_,_正在导出_pdf,_请勿关闭窗口_...</p>");
                }
                if(_this.FTotalCount>=1000){
                    this.$message({
                        showClose: true,
                        message: '_仅返回前一千条逆地理编码_!',
                    });
                }
                //甩挂和冷链
                /*if(this.SystemID==1||this.SystemID==3||this.SystemID==4){
                    var url1='/web/Common/Common_Report';
                    var data1='{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"ExportReportLBSTrackListByFAssetGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' +startTime+ '","FEndTime":"' +endTime+ '","FPageSize":"' +_this.FTotalCount+ '" ,"FType":"'+type+'","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' +FTableDate+ '"}'
                }else if(this.SystemID==2){
                    var url1='/web/Lock/Lock_Report';
                    var data1='{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"ExportReportLBSTrackListByFAssetGUID","FAssetGUID":"' + FVehicleID + '","FStartTime":"' +startTime+ '","FEndTime":"' +endTime+ '","FPageSize":"' +_this.FTotalCount+ '" ,"FType":"'+type+'","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' +FTableDate+ '"}'
                }*/
                var url1='/web/Container/Container_Report';
                var data1='{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"ExportReportLBSTrackListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' +startTime+ '","FEndTime":"' +endTime+ '","FPageSize":"' +_this.FTotalCount+ '" ,"FType":"'+type+'","FPageIndex":"1","FVersion":"1.0.0","FTableDate":"' +FTableDate+ '"}'

                //获取车牌
                if(FVehicleID!=undefined && this.value4){
                    _this.loading=true;
                    $.ajax({
                        'url':url1,
                        "cache": false,
                        "async": true,
                        "type": "post",
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
                        'data':data1,
                        success:function(data){
                            console.log(data);
                            if(data.Result==104) {
                                _this.$message({
                                    showClose: true,
                                    message: '_登录超时_,_五秒后跳转到登录页面_',
                                    type: 'warning'
                                });
                                setTimeout(function(){
                                    _this.$store.commit("goLogin");
                                },5000)
                                return
                            }else if(data.Result==201){
                                if(type=="pdf"){

                                    newTab.document.write("<p>_导出失败_!,_两秒后关闭页面_</p>");
                                    setTimeout(function(){
                                        newTab.close();
                                    },2000);
                                }
                                _this.loading=false;
                                _this.$message({
                                    showClose: true,
                                    message: '_暂无数据_',
                                    type: 'warning'
                                });
                            }else if(data.Result==200){
                                _this.loading=false;
                                if(type=='csv'){
                                    window.location="http://cloud.jointcontrols.cn:56090"+data.FObject;
                                }else {
                                    newTab.location.href="http://cloud.jointcontrols.cn:56090"+data.FObject;
                                }
                            }else {
                                if(type=="pdf"){

                                    newTab.document.write("<p>_导出失败_!,_两秒后关闭页面_</p>");
                                    setTimeout(function(){
                                        newTab.close();
                                    },2000);
                                }
                                _this.loading=false;
                                _this.$message({
                                    showClose: true,
                                    message: '_错误_'+data.Result,
                                    type: 'warning'
                                });
                            }
                        },
                        error:function () {
                            _this.$message({
                                showClose: true,
                                message: '_请求超时_',
                                type: 'warning'
                            });
                            _this.loading=false;
                            console.log('_请求失败_')
                        }
                    })
                }else if(FVehicleID == undefined){
                    this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                    this.tableData3=[];
                    this.FTotalCount=0;
                }
            },
            // 点击节点
            get:function (data) {
                $('.search-input').val(data[0]);
                $('.search-input').attr('title',data[0])
                $('.search-input').attr('fguid',data[1])
            },
        },
        watch: {
            screenHeight () {
                this.adjustPage();
            }
        },
    }
</script>
<style scoped>

</style>

