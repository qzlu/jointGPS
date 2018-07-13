<template>
  <section style="height: 100%" class="row">
    <div class="col-md-3" style="height: 100%;padding-left:16px;padding-right: 10px">
      <div class="carTeamList">
        <el-input
          class="filterInput"
          placeholder="_输入关键字_"
          v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :props="defaultProps"
          :highlight-current="true"
          :data="data3"
          :load="loadTree"
          default-expand-all
          :filter-node-method="filterNode"
          :render-content="renderContent"
          @node-click="handleNodeClick"
          ref="tree2">
        </el-tree>
      </div>
    </div>
    <div class="col-md-9 unlockPanel" style="height: 100%">
      <div class="carInfoBox">
        <!--  <ul>
            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;车牌：{{FVehicleName}}</li>
            <li>电子锁ID：{{lockID}}</li>
            <li>当前状态：{{currentStatus}}</li>
            <li>当前位置：{{currentPosition}}</li>
          </ul>
        <p><i class="fa fa-lock" style="margin-right: 10px"></i>开锁</p>-->
        <baidu-map ref="map" :fa-data="[mapToolShow]" v-on:deleteFence="loadFence()" ></baidu-map>
      </div>
      <div class="unlocking">
        <header style="height: 40px;width: 100%;background: #f0f0f0;border-bottom:1px solid #f0f0f0;line-height: 40px;padding: 0px 20px">
          <span style="font-size:16px;font-weight:bold;margin-right:20px">{{FVehicleName}}</span>
          <span style="font-size:16px;font-weight:bold;margin-right:20px">
            <el-button type="primary"  v-if="!FFenceOpen&&FVehicleName!=null" @click="switchLockFenceStatus('SetOpenLockFenceStatus')">_开启区域开锁_</el-button>
            <el-button type="info" class="reset" v-if="FFenceOpen&&FVehicleName!=null"  @click="switchLockFenceStatus('SetCloseLockFenceStatus')">_关闭区域开锁_</el-button>
            <!-- <a href="javascript:;">_关闭区域开锁置_</a> -->
          </span>
          <span v-bind:class="{error:progress=='_配置失败_',green:progress=='_配置成功_'}">{{progress}}</span>
          <span class="pull-right">
            <el-button style="background: #999999;color: white" @click="unbindAllFence()">_移除全部开锁区域_</el-button>
            <!-- <el-button style="background: #09bb07;color: white">全部允许</el-button> -->
          </span>
        </header>
        <div>
          <el-table
            :data="tableData"
            :height="tableHeight"
            border
            style="width: 100%">
            <el-table-column
              prop="FName"
              :label="fenceNum"
              width="180">
            </el-table-column>
            <el-table-column
              prop="FCreateTime"
              label="_创建时间_"
              width="260">
            </el-table-column>
            <el-table-column
              prop=""
              width="200"
              label="_操作_">
              <template scope="scope" >
                <a href="javascript:" v-if="scope.row.isConfig==1" @click="bindFence(scope.$index,scope.row,'UpdateLBSGISUnLockFence')">_移除开锁区域_</a>
                <a href="javascript:" class="green" v-if="scope.row.isConfig==0" @click="bindFence(scope.$index,scope.row,'SetLBSGISUnLockFence')">_设置开锁区域_</a>
              </template>
            </el-table-column>
             <el-table-column prop="" label="_状态_" width="" >
               <template scope="scope">
                <span v-bind:class="{error:scope.row.progress=='_配置失败_',green:scope.row.progress=='_配置成功_'}">{{scope.row.progress}}<img
                  src="/static/img/myloading.gif" alt="" v-if="scope.row.progress=='_配置中_'"></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import baiduMap from '../Common/baidu_map.vue'
  import baidu  from '../../js/GIS/Baidu/BaiduAPI'
  let _this
  export default{
    data(){
      _this=this;
      return{
        loading:true,
        Area:"深圳",
        mapToolShow:true,
        dialogVisible:false,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label',
          id:'id',
        },
        //电子锁ID
        FVehicleName:null,
        //电子锁guid
        lockID:null,
        //设备类型
        FAssetTypeID:"",
        currentStatus:null,
        currentPosition:null,
        FAssetID:null,
        lock:false,
        success:false,
        error:false,
        tableHeight:null,
        tableData:[],
        fenceNum:null,
        table:null,
        guid:null,
        //索引
        arr:null,
        config:true,
        //判断是否正在配置中，如在配置中不能切换设备
        configing:false,
        //区域开锁是否已开启
        FFenceOpen:null,
        //开启（关闭）区域开锁进度
        progress:null,
        //查询区域开锁是否已开启返回的对象
        FenceOpenStatus:null,
        //是否离线
        FAlarmOffLine:null,
      }
    },
    props: {
      screenHeight: Number,
    },
    activated: function(){
    },
    watch:{
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      screenHeight(){
        $("#map-wrapper").height($('.carInfoBox').height());
        this.tableHeight=$('.unlocking').height()-40
      }
    },
    computed:{
      url(){
        if(_this.$store.state.choiceSystemID==2){
          return "/web/Lock/Lock_SmartLock"
        }else if(_this.$store.state.choiceSystemID==7){
          return "/web/SmartDistribution/SmartDistribution_SmartLock"
        }
      },
      url1(){
        if(_this.$store.state.choiceSystemID==2){
          return "/web/Lock/Lock_LBS"
        }else if(_this.$store.state.choiceSystemID==7){
          return "/web/SmartDistribution/SmartDistribution_SmartLock"
        }
      },
      data3(){
        return _this.$store.state.allCarsData
      }
    },
    updated(){
      this.tableHeight=$('.unlocking').height()-40;
    },
    mounted(){
      this.$refs.map.initMap();
      $("#map-wrapper").height($('.carInfoBox').height());
      this.tableHeight=$('.unlocking').height()-40;
      this.showAllfence();
      this.loadFence();
    },
    methods:{
      renderContent(h, { node, data, store }){
        return(
          <span class={{green:!data.FAlarmOffLine&&data.id.indexOf("@")==-1}}>
          <i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A")!=-1}></i>
          <i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C")!=-1}></i>
          <i class="fa fa-lock icon" v-show={data.id.indexOf("@")==-1&&!data.lockStatus}></i>
          <i class="fa fa-unlock icon" v-show={data.id.indexOf("@")==-1&&data.lockStatus}></i>
          <span>{data.label}</span>
          <span v-show={data.id.indexOf("@")!=-1} style="font-weight:bold">[{data.count}]</span>
          <span style="margin-left:10px" v-show={_this.$store.state.choiceSystemID!==7&&data.id.indexOf("@")==-1&&data.subLabel}>({data.subLabel})</span>
          </span>
      )
      },
      filterNode(value, data) {
        if (!value) return true;
        if(data.label){
          return data.label.indexOf(value) !== -1;
        }
      },
      loadFence(){
        _this.tableData=[];
        _this.FVehicleName=null;
        _this.lockID=null;
        $.ajax({
          "url": "/web/Common/Common_LBS",
          "cache": false,
          "async": true,
          "type": "post",
          "dataType": "json",
          "contentType": "application/json; charset=utf-8",
          "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLBSGISFenceList","FPageSize":999999,"FPageIndex":1,"FVersion":"1.0.0"}',
          success: function (json) {
            console.log("wode",json)
            $.each(json.FObject.Table1,function(index,obj) {
              if(obj.FStatus==1){
                obj.FCreateTime=_this.parseGMT(obj.FCreateTime.replace(/T/ig,' '));
                _this.$set(obj,'isConfig',null);
                _this.tableData.push(obj)
              }
            })
            _this.fenceNum= "_围栏_"+'('+_this.tableData.length+')'
          },
          error:function () {

          }
        })
      },
      showPosition(obj){
				let url;
				switch (this.$store.state.choiceSystemID) {
					case 2:
						url = '/web/Lock/Lock_LBS';
						break;
					case 4:
						url = '/web/FleetManager/FleetManager_LBS';
						break;
					case 7	:
						url = '/web/SmartDistribution/SmartDistribution_LBS';
						break;
        };
        const isShowKeyBtn =(data)=>{
          if(data.FAssetTypeID==717){
            return false
          }else{
            if(data.FAlarmOffLine==1){
              return false
            }else{
              return true
            }

          }
        };

				$.ajax({
					url: url,
					cache: false,
					async: true,
					type: 'Post',
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					global: false,
					data: '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLBSMonitorListByFAssetGUIDs","FAssetGUIDs":"' + obj.id + '","FVersion":"1.0.0"}',
					success: function (res) {
            if (res.Result == 200) {
							if (res.FObject.length == 0) {
								_this.$refs.map.showError("_暂无数据_");
								return
							}
                  let oResData=res.FObject[0];
                  let theDate=_this.parseGMT(oResData.FGPSDateTime).replace(/-/g,"/").split(" ")[0];
									let today = moment().format("YYYY/MM/DD");
                  let point = {
										lng: oResData.FLongitude,
										lat: oResData.FLatitude
									};

									let oCarPonitData = {
									
										name:oResData.FAssetID, //下部列表第二项显示内容，电子锁系统为电子锁ID
										ID: oResData.FAssetGUID,
										assetID: oResData.FAssetID,
										FAssetGUID: oResData.FAssetGUID,
										FVehicleName: oResData.FVehicleName == null ? "--" : oResData.FVehicleName,
										FVehicleGUID: oResData.FVehicleGUID,
										company: oResData.FShortName,
										operateType: oResData.FOperateType,
										time: _this.parseGMT(oResData.FGPSDateTime),
										recvTime: _this.parseGMT(oResData.FRecvDateTime),
										point: _this.parsePoint(_this.$store.state.mapType,point),
										speed: oResData.FSpeed,
										direction: oResData.FDirection,
										mileage: oResData.FMileage,
										address: "_获取位置信息中_",
										locationType: oResData.FLocationType,  //定位状态
										batteryPercent: oResData.FBatteryPercent > 100 ? "_充电中_" :(oResData.FBatteryPercent==-1?"--":oResData.FBatteryPercent) ,
										alarmOffLine: oResData.FAlarmOffLine, //离线状态
										FLockStatus: oResData.FUninitialized===0?oResData.FLockStatus:-1,    //锁状态
									
										todayTrip:theDate<today? 0:oResData.FTripCount,

										alarmOverSpeed: oResData.FAlarmOverSpeed, //超速报警
										alarmOffsetRoad: oResData.FAlarmOffsetRoad, //道路偏移
										alarmFLockRope: oResData.FLockRope,         //绳索异常
										FAlarmLowPower: oResData.FAlarmLowPower,      //低电量
										unCoverBack: oResData.FUnCoverBack,          //后盖打开
										longTimeOpened: oResData.FLongTimeOpened,       //长时间未锁
										fivePasswordError: oResData.FFivePasswordError,    //五次输入错误
										illegalCard: oResData.FIllegalCard,          //刷非法卡
										forbiddenAreaOpen: oResData.FForbiddenAreaOpen,    //禁区开锁
										alarmArr:[],     //报警类型数组

										isShowKeyBtn:isShowKeyBtn(oResData),
										attitude: null,        //锁姿态  无姿态数据为null 数据格式 字符串 x轴，y轴，z轴
										coldChainEquipment: [],
										active: false,
										type: 1,

									};

									

									//温度
									let cce = oCarPonitData.coldChainEquipment;
									for (let j = 1; j < 5; j++) {
										if (oResData['FSensorID' + j] != null) {
											let cceItem = {
												number: j,
												ID: oResData['FSensorID' + j],
												tem: _this.parseTemperature(oResData['FTemperature' + j]),
												temAlarm: oResData['FTemperature' + j + 'Alarm'],
												hum: oResData['FHumidity' + j],
												time: _this.parseGMT(oResData['FSensor' + j + 'GPSDateTime']),
											}
											if (cceItem.temAlarm == 1) oCarPonitData.alarmTemperature = true;
											cce.push(cceItem);
										}
									};

									//实时车辆状态 筛选优先顺序  离线>报警>停车>运行
									if (oResData.FAlarmOffLine == 1) {
										//离线
										oCarPonitData.type = 3;
									
									}
									else if (oCarPonitData.alarmOverSpeed == 1
										|| oCarPonitData.alarmFLockRope == 1
										|| oCarPonitData.FAlarmLowPower == 1
										|| oCarPonitData.alarmFLockRope == 1
										|| oCarPonitData.unCoverBack == 1
										|| oCarPonitData.longTimeOpened == 1
										|| oCarPonitData.fivePasswordError == 1
										|| oCarPonitData.illegalCard == 1
										|| oCarPonitData.forbiddenAreaOpen == 1) {
										//报警
										oCarPonitData.type = 4;
									
									}
									else if (oResData.FSpeed == 0) {
										//停车
										oCarPonitData.type = 2;
									
									}
                  console.log([oCarPonitData], [oCarPonitData.point])
              

                  _this.$refs.map.getLatelyData([oCarPonitData], [oCarPonitData.point]);


                  let lng = oCarPonitData.point.lng,
					            lat = oCarPonitData.point.lat;
                  if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90 && lng != 0 && lat != 0) {
                    _this.$refs.map.showCarPlace(oCarPonitData);
                  } else {
                    _this.$refs.map.showError("_暂无定位信息_!");
                    _this.$refs.map.showCarPlace();
                  };


            }






            // if(res.Result == 200){
            //   $.each(res.FObject,function (index,item) {
            //     _this.$set(item,"address")
            //     let ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: item.FLatitude, lng: item.FLongitude });
            //     _this.geocoder(_this.$store.state.globalMapType, ponit0, item, "address");
            //   });
            //    _this.$refs.map.setMarks(res.FObject);
            // }
          },
          error:function(){

          }
        })
      },
      handleNodeClick(data){
        _this.progress=null;
        if(_this.configing){
          _this.$message({
            showClose: true,
            message: '_请等待上一个配置完成再进行配置_',
            type: 'warning'
          });
            return
        }
        if(data.id.indexOf("@")===-1&&data.FAssetTypeID!=717){
          _this.FVehicleName= data.label;
          _this.lockID=data.id;
          _this.FAlarmOffLine=data.FAlarmOffLine;
          _this.FAssetTypeID=data.FAssetTypeID;
          _this.QueryFenceOpenStatus(_this.lockID);
          _this.showPosition(data)
          $.ajax({
            "url":_this.url1,
            "cache": false,
            "async": true,
            "type": "post",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLBSGISUnLockFenceByFAssetGUID","FAssetGUID":"'+_this.lockID+'","FVersion":"1.0.0"}',
            success: function (json) {
              _this.table=json.FObject;
              _this.arr=[1,2,3,4,5,6,7,8,9,10],
              $.each(_this.tableData,function (index,obj) {
                  obj.isConfig=0;
                  obj.FIndex=0;
                  _this.$set(obj, "progress", null)
              })
              if(json.FObject.length!=0){
                  $.each(json.FObject,function (i,item) {
                    let index=_this.arr.indexOf(item.FIndex);
                    if(index!=-1){
                      _this.arr.splice(index,1);
                    }
                    $.each(_this.tableData,function (index,obj) {
                      if(item.FFenceGUID==obj.FGUID){
                        obj.isConfig=1;
                        obj.FIndex=item.FIndex
                      }
                  })
                });
              }
            },
            error:function () {

            }
          });
         

        }else if(data.id.indexOf("@")!=-1){

        }else{
          _this.$message({
            showClose: true,
            message: '_该设备不支持围栏设置_',
            type: 'warning'
          });
        }
      },
      async showAllfence() {
           await new Promise((resove)=> {
             setTimeout(async function () {
               await _this.$refs.map.getFenceData();
               resove()
             }, 100)
           });
          _this.$refs.map.showFence('all');
      },
       async bindFence(index,row,status){
        let guid=row.FGUID;
        let a;
        let i=0;
        let timer;
        let action;
        let FAssetGUID=_this.lockID;
        if(this.FAlarmOffLine){
          row.progress="_离线状态不能配置_";
          return
        }
        if(status=="SetLBSGISUnLockFence"){
          if(!_this.config){
            row.progress="_请等待上一个配置完成再进行配置_";
            return
          }
          action="QueryLBSGISBoundFenceStatus"
        }else{
          action="QueryLBSGISUnBoundFenceStatus"
        }
        if(row.FIndex){
          a=row.FIndex
        }else{
           a=_this.arr[0];
        }
        if(a==undefined){
          row.progress="_最多配置_10_个围栏_";
          return
        }
        await new Promise(resove=>{
          $.ajax({
              "url": _this.url1,
              "cache": false,
              "async": true,
              "type": "post",
              "dataType": "json",
              "contentType": "application/json; charset=utf-8",
              "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"'+status+'","FAssetGUID":"'+FAssetGUID+'","FFenceGUID":"'+guid+'","FIndex":"'+a+'","FVersion":"1.0.0"}',
              success: function (json) {
                if(json.Result==200){
                  _this.configing=true;
                  if(status=="SetLBSGISUnLockFence"){
                    _this.config=false;
                  }
                 row.progress="_配置中_";
                 resove()
                }else{
                  row.progress="_配置失败_";
                  _this.config=true;
                }
              },
              error:function () {

              }
            })
        });
         //查询绑定是否成功
        timer=setInterval(function () {
          i++;
          if(i>5){
            clearInterval(timer);
            row.progress="_配置失败_";
            _this.configing=false;
            if(status=="SetLBSGISUnLockFence"){
              _this.config=true;
           }     
          }else{
           $.ajax({
                    "url": _this.url1,
                    "cache": false,
                    "async": true,
                    "type": "post",
                    "dataType": "json",
                    "contentType": "application/json; charset=utf-8",
                    "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"'+action+'","FAssetGUID":"'+FAssetGUID+'","FFenceGUID":"'+guid+'","FIndex":"'+a+'","FVersion":"1.0.0"}',
                    success: function (json) {
                      if(json.Result==200){
                        clearInterval(timer);
                        if(status=="SetLBSGISUnLockFence"){
                          row.isConfig=1;
                          row.FIndex=a;
                          _this.arr.splice(0,1);
                          _this.config=true;
                        }else{
                          row.isConfig=0;
                          row.FIndex=0
                          _this.arr.push(a)
                        }
                        row.progress="_配置成功_";
                        _this.configing=false;
                      }else if(json.Result==102){
                        clearInterval(timer);
                        row.progress="_配置失败_";
                        _this.configing=false;
                      }
                    },
                    error:function () {

                    }
                })
          }
        },2000)
 
      },
       unbindAllFence(){
        if(_this.lockID!=null){
          $.each(_this.tableData,async function (index,obj) {
            if(obj.isConfig==0){
              return
            }
            _this.bindFence(index,obj,"UpdateLBSGISUnLockFence")
          })
        }
      },
      //查询是否开启区域开锁
      QueryFenceOpenStatus(a){
        return new Promise(resove=>{
          $.ajax({
              "url": _this.url,
              "cache": false,
              "async": true,
              "type": "post",
              "dataType": "json",
              "contentType": "application/json; charset=utf-8",
              "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryFenceOpenStatus","FAssetGUID":"'+a+'","FVersion":"1.0.0"}',
              success: function (json) {
                _this.FenceOpenStatus=json
                if(json.Result==200){
                  if(json.FObject[0]){
                    _this.FFenceOpen=json.FObject[0].FFenceOpen;
                  }else{
                    _this.FFenceOpen=0;
                  }
                resove();
                }
              },
              error:function () {

              }
            })
        })

      },
      //开启或关闭区域开锁
      async switchLockFenceStatus(b){
        let timer;
        let i=0;
        if(_this.FAlarmOffLine){
          _this.progress="_离线状态不能配置_";
          return
        }
        if(b=="SetOpenLockFenceStatus"){
          _this.progress="_正在开启中_"
        }else{
          _this.progress="_正在关闭中_"
        }
        await new Promise(resove=>{
          $.ajax({
              "url":_this.url,
              "cache": false,
              "async": true,
              "type": "post",
              "dataType": "json",
              "contentType": "application/json; charset=utf-8",
              "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"'+b+'","FAssetID":"'+_this.FVehicleName+'","FAssetTypeID":"'+_this.FAssetTypeID+'","FAssetGUID":"'+_this.lockID+'","FVersion":"1.0.0"}',
              success: function (json) {
                if(json.Result==200){
                   resove();
                }else{
                  if(b=="SetOpenLockFenceStatus"){
                     _this.progress="_服务器出错，开启失败_"
                  }else{
                     _this.progress="_服务器出错，关闭失败_"
                   }
                }
              },
              error:function () {

              }
            })          
        });
        timer=setInterval(async function () {
          i++;
          if(i>4){
                  if(b=="SetOpenLockFenceStatus"){
                     _this.progress="_开启失败_，_请检查设备是否正常_"
                  }else{
                     _this.progress="_关闭失败_，_请检查设备是否正常_"
                  }
                  clearInterval(timer)            
          }else{
            await _this.QueryFenceOpenStatus(_this.lockID);
            if(_this.FenceOpenStatus.FObject[0].FFenceOpenStatus==1){
               clearInterval(timer);
               _this.progress="_修改成功_"   
            }
          }
          
        },2000)   
      }
    },
    activated: function(){
    },
    components:{
      baiduMap,
    }
  }
</script>
<style>
.unlocking .el-table__body-wrapper{
  overflow-x: hidden;
  overflow-y: auto;
}
.carInfoBox #map-tool> li:last-child,.carInfoBox #map-tool> li:nth-last-child(2),.carInfoBox #map-tool> li:nth-last-child(3){
  display: none;
}

</style>
