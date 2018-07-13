<template>
  <section style="height: 100%" class="row">
    <div class="col-md-3" style="height: 100%;padding-left:16px;padding-right: 10px">
      <div class="carTeamList">
        <div style="position:relative">
          <span class="glyphicon glyphicon-refresh" style="position: absolute;z-index: 999;left: 390px;top: 10px;cursor: pointer;" @click="refresh()"></span>
          <el-input
              class="filterInput"
              placeholder="_输入关键字_"
              v-model="filterText">
          </el-input>
        </div>
        <el-tree
          class="filter-tree"
          :props="defaultProps"
          :highlight-current="true"
          :data="data3"
          node-key="id"
          show-checkbox
          :load="loadTree"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :render-content="renderContent"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
          ref="tree2">
        </el-tree>
      </div>
    </div>
    <div class="col-md-9 unlockPanel" style="height: 100%">
      <div class="carInfoBox">
        <baidu-map ref="map" :fa-data="[false]" ></baidu-map>
      </div>
      <div class="unlocking" v-h>
        <!-- <div class="unlocking-btn">
          <button  @click="openLocks()"><img src="/static/img/lock/key.png" alt="" style="margin-right:10px">_开锁_</button>
        </div> -->
        <div class="el_table_wrap"  style="margin-top:10px" >
                    <el-table :data="table" empty-text="_暂无数据_" stripe ref="multipleTable" :height="tableHeght"  @selection-change="handleSelectionChange" style="width:100%">
                       <!-- <el-table-column type="selection" :selectable="check" width="55"> </el-table-column> -->
                        <el-table-column  label="_序号_" type="index"  width="80"></el-table-column>
                        <el-table-column
                        prop=""
                        width="90"
                        label="_开锁_">
                        <template scope="scope">
                           <a class="img-icon monitor-icon icon-key"  @click="openLockBox(scope.row)" v-if="!scope.row.FAlarmOffLine&&!scope.row.lockStatus"></a>
                        </template>
                        </el-table-column>
                        <el-table-column prop="FAssetID" label="_电子锁_ ID" width="120" ></el-table-column>
                        <el-table-column prop="FVehicleName" label="_车牌号_" width="140" v-if="sysTemID===2" ></el-table-column>
                        <el-table-column prop="FGPSDateTime" label="_定位时间_" width="150" ></el-table-column>
                        <el-table-column  prop="address"  label="_当前位置_"  ></el-table-column>
                        <!-- <el-table-column  prop="progress"  label="_状态_"  ></el-table-column> -->
                    </el-table>
        </div>
      </div>
    </div>
    <open-lock ref="openLock"></open-lock>
  </section>
</template>
<script>
  import baiduMap from '../Common/baidu_map.vue'
  import openLock from "components/dialog/openLock";
  let _this
  export default{
    data(){
      _this=this;
      return{
        loading:true,
        Area:"深圳",
        mapToolShow:false,
        dialogVisible:false,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label',
          id:'id',
          disabled:'disable'
        },
        FVehicleName:null,
        lockID:null,
        currentStatus:null,
        currentPosition:null,
        FAssetID:null,
        lock:false,
        success:false,
        error:false,
        timer:null,
        table:[],
        tableHeght:null,
        multipleSelection: [],
        checkAll:false,
      }
    },
    props: {
      screenHeight: Number,
    },
    computed:{
      data3(){
        //车队管理过滤不是701T设备
        if (this.$store.state.choiceSystemID==4) {
          var temp;
          var arr=JSON.parse(JSON.stringify(_this.$store.state.allCarsData));
          function findTree(arr) {
            for (let i = 0; i < arr.length; i++) {
              const element = arr[i];
              if (element.FAssetTypeID) {
                if (element.FAssetTypeID!="701"){
                  arr.splice(i,1);
                  i--
                }
              }else if(element.children){
                findTree(element.children)
              }
            }
            return arr
          }
          temp=findTree(arr);
          return temp
        }else{
          return this.$store.state.allCarsData
        }
      },
      sysTemID(){
        return this.$store.state.choiceSystemID
      }
    },
    watch:{
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      screenHeight(){
        $("#map-wrapper").height($('.carInfoBox').height());
        this.tableHeght=$('.unlockPanel').height()-$('.carInfoBox').height()-12;
      },
    },
    mounted(){
      $("#map-wrapper").height($('.carInfoBox').height());
      this.tableHeght=$('.unlockPanel').height()-$('.carInfoBox').height()-12;
      this.$refs.map.initMap();
      this.showAllfence();
/*       let oldValue=_this.$store.state.allLocksData;
      setInterval(function () {
       if(_this.$store.state.allLocksData!=oldValue){
         _this.setData();
         oldValue=_this.$store.state.allLocksData;
       }
     },1000); */

     setInterval(()=>{
       this.getCheckedNodes();
     },3*60*1000);
    },
    updated(){
      $("#map-wrapper").height($('.carInfoBox').height());
      this.tableHeght=$('.unlockPanel').height()-$('.carInfoBox').height()-12;
    },
    methods:{
      adjustPage(){
         $("#map-wrapper").height($('.carInfoBox').height());
        this.tableHeght=$('.unlockPanel').height()-$('.carInfoBox').height()-12;
      },
     handleSelectionChange(val) {
      this.multipleSelection = val;
     },
/*      setData(){
      _this.data3=JSON.parse(JSON.stringify(_this.$store.state.allCarsData));
         $.each( _this.data3[0].children,function (index,obj) {
             if(obj.FAlarmOffLine==null&&obj.id.indexOf("@")==-1){
               obj.FAlarmOffLine=true;
             }
             if(obj.FAlarmOffLine||obj.FLockStatus||obj.FAssetTypeID==717){
                obj.disabled=true
             }else{
               obj.disabled=false
             }
        });
      _this.data3[0].children.sort(function (a,b) {
        return a.FAlarmOffLine-b.FAlarmOffLine
      });
      console.log('电子锁设备',_this.data3)
     }, */
     refresh(){
       this.filterText='';
       this.table=[];
       this.$store.commit('getAllCarsData');
     },
      renderContent(h, { node, data, store }){
        if (this.$store.state.choiceSystemID==4) {
            return(
              <span class={{green:!data.FAlarmOffLine&&data.FAlarmOffLine!=null&&data.id.indexOf("@")==-1,noclick:data.FAlarmOffLine||data.FAlarmOffLine==null&&data.id.indexOf("@")==-1}}>
              <i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A")!=-1}></i>
              <i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C")!=-1}></i>
              <i class="fa fa-lock icon" v-show={data.id.indexOf("@")==-1&&!data.lockStatus}></i>
              <i class="fa fa-unlock icon" v-show={data.id.indexOf("@")==-1&&data.lockStatus}></i>
              <span>{data.label}</span>
              <span style="margin-left:10px" v-show={data.id.indexOf("@")==-1&&data.subLabel}>({data.subLabel})</span>
              </span>
          )
        }
        return(
          <span class={{green:!data.FAlarmOffLine&&data.FAlarmOffLine!=null&&data.id.indexOf("@")==-1,noclick:data.FAlarmOffLine||data.FAlarmOffLine==null&&data.id.indexOf("@")==-1}}>
          <i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A")!=-1}></i>
          <i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C")!=-1}></i>
          <i class="fa fa-lock icon" v-show={data.id.indexOf("@")==-1&&!data.lockStatus}></i>
          <i class="fa fa-unlock icon" v-show={data.id.indexOf("@")==-1&&data.lockStatus}></i>
          <span>{data.label}</span>
          <span v-show={data.id.indexOf("@")!=-1} style="font-weight:bold">[{data.count}]</span>
          <span style="margin-left:10px" v-show={data.id.indexOf("@")==-1&&data.subLabel}>({data.subLabel})</span>
          </span>
      )
      },
      filterNode(value, data) {
        if (!value) return true;
        if(data.label){
          return data.label.indexOf(value) !== -1;
        }
      },
      handleNodeClick(data){
        var nodeArr = this.$refs.tree2.getCheckedNodes();
				if (nodeArr.indexOf(data) == -1&&!data.FAlarmOffLine&&!data.lockStatus&&data.FAlarmOffLine!=null&&data.FAssetTypeID!=717) {
					this.$refs.tree2.setChecked(data, true, true)
				}else if(data.id.indexOf("@") !== -1) {
          this.$refs.tree2.setChecked(data, true, true)
        }else if(data.FAlarmOffLine){
           _this.$message({
            showClose: true,
            message: '_离线状态不能开锁_',
            type: 'warning'
          });
        }else if(data.lockStatus){
          _this.$message({
            showClose: true,
            message: '_锁处于打开状态_',
            type: 'warning'
          });
        }else if(data.FAssetTypeID==717){
          _this.$message({
            showClose: true,
            message: '_该设备不支持远程开锁_',
            type: 'warning'
          });
        }else {
					this.$refs.tree2.setChecked(data, false, true)
				}
       /*  if(data.FAssetID.indexOf("@A")===-1&&!data.FAlarmOffLine){
          _this.FVehicleName= data.FVehicleName;
          _this.lockID=data.FAssetID;
          if(data.FLockAlarmDescribeJSON!=null){
            _this.currentStatus=data.FLockAlarmDescribeJSON
          }else {
            _this.currentStatus="正常"
          }
          var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: data.FLatitude, lng: data.FLongitude });
          _this.geocoder(_this.$store.state.globalMapType, ponit0, _this, "currentPosition");
          if(data.FLongitude>0&&data.FLatitude>0){
            this.$refs.map.setMark(ponit0);
          }else {
            _this.$refs.map.initMap();
            _this.$message({
              showClose: true,
              message: '_暂无位置信息_',
              type: 'warning'
            });
          }
        }else if(data.FAlarmOffLine){
          _this.$message({
            showClose: true,
            message: '_离线状态不能开锁_',
            type: 'warning'
          });
        } */
      },
      getCheckedNodes(){
        let nodeArr = this.$refs.tree2.getCheckedNodes();
        let carIdArr=[];
				let url;
        let action;
        if (nodeArr.length==0) {
          _this.table=[];
          _this.$refs.map.removeOverlay( _this.$refs.map.remoteUnlockMarks);
          return
        }
        $.each(nodeArr,function (index,obj) {
          if(obj.id.indexOf("@") === -1){
            carIdArr.push(obj.id)
          }
        });
        let carIdString=carIdArr.join(',');
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
				}

				$.ajax({
					url: url,
					cache: false,
					async: true,
					type: 'Post',
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					global: false,
					data: '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLBSMonitorListByFAssetGUIDs","FAssetGUIDs":"' + carIdString + '","FVersion":"1.0.0"}',
					success: function (res) {
            if(res.Result == 200){
              if (!res.FObject.length) {
                _this.table=nodeArr
              }else{
                for (let i=0;i<res.FObject.length;i++){
                  res.FObject[i].FGPSDateTime=_this.parseGMT(res.FObject[i].FGPSDateTime);
                }
                _this.table=res.FObject; //防止后面谷歌反地理编码报错终端程序下行
              }
              $.each(res.FObject,function (index,item) {
                _this.$set(item,"address");
                let ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: item.FLatitude, lng: item.FLongitude });
                _this.geocoder(_this.$store.state.globalMapType, ponit0, item, "address");
              });
               _this.$refs.map.setMarks(res.FObject);

            }
          },
          error:function(){

          }
        })
      },
      handleCheckChange(){
            let fn= _this.getCheckedNodes;
            clearTimeout(fn.timer);
            fn.timer=setTimeout(() => {
               fn.call(null)
            }, 500);
      },
      openLockBox(row){ 
				_this.$refs.openLock.openLockBox(row.FAssetID,row.FAssetGUID,false);
			},
      async showAllfence() {
           await new Promise((resove)=> {
             setTimeout(async function () {
               await _this.$refs.map.getFenceData();
               resove()
             }, 0)
           });
          _this.$refs.map.showFence('all');
      },
   /*    openLocks(){
        if(this.multipleSelection.length==0){
             _this.$message({
                  showClose: true,
                  message: '_请选择设备_',
                  type: 'warning'
                });
        }else if(this.multipleSelection.length==1){
          	_this.$refs.openLock.openLockBox(_this.multipleSelection[0].FAssetID,true);
        }else{
          $.each(this.multipleSelection,async function (index,obj) {
            //_this.$refs.openLock.openLockBox(obj.FAssetID,true);
            let timer;
            let i=0;
            obj.progress="_正在连接服务器_"
            await new Promise(resove=>{
              $.ajax({
                "url": "/web//Lock/Lock_SmartLock",
                "cache": false,
                "async": true,
                "type": "post",
                "dataType": "json",
                "contentType": "application/json; charset=utf-8",
                "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"OpenLockControl","FAssetID":"'+obj.FAssetID+'","FVersion":"1.0.0"}',
                success: function (json) {
                  if(json.Result==104){
                    obj.progress="_服务器连接失败_";
                    _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                    });
                    setTimeout(function(){
                      _this.$store.commit("goLogin");
                    },5000)
                    return
                  }else if(json.Result==200){
                     obj.progress="_连接服务器成功，服务器正在下发指令开锁_";
                    resove()
                  }else{
                     obj.progress="_服务器连接失败_";
                  }
                },
                error:function (params) {
              
                }
              })
            });
            timer=setInterval(function () {
              i++;
              if(i>4){
                clearInterval(timer);
                obj.progress="_开锁失败，请检查锁状态_";
              }else{
                $.ajax({
                  "url": "/web//Lock/Lock_SmartLock",
                  "cache": false,
                  "async": true,
                  "type": "post",
                  "dataType": "json",
                  "contentType": "application/json; charset=utf-8",
                  "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLockStatus","FAssetID":"'+obj.FAssetID+'","FVersion":"1.0.0"}',
                  success: function (json) {
                     if(json.Result==200){
                        clearInterval(timer)
                        obj.progress="_开锁成功_";
                     }
                  },
                  error:function(){

                  }
                })
              }
            },2000)       

          })
        }
      }, */
    },
    activated: function(){
    },
    components:{
      baiduMap,
      openLock,
    },
    directives: {
      h:{
          inserted: function (el) {
            // 聚焦元素
            
          }
      }
		}
  }
</script>
<style>
  .carTeamList{
    border: 1px solid #cccccc;
    background:white;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .unlockPanel{
    border: 1px solid #cccccc;
    background:white;
    padding-left: 0px;
  }
  .filterInput{
    z-index: 100;
    height: 40px;
  }
  .carTeamList .el-tree-node__content{
    border-bottom: 1px solid #ccc;
  }
  .icon{
    margin-right: 5px;
  }
  .carInfoBox{
    width: 100%;
    height: 50%;
    border-bottom: 1px solid #cccccc;
    position: relative;
  }
  .unlocking ul{
    margin-left: 40px;
  }
  .unlocking ul li{
    height: 40px;
    font-size: 16px;
    font-weight: bold;
  }
  .carInfoBox p{
    position: absolute;
    left:30px;
    top: -50px;
    font-size: 20px;
    font-weight: bold;
    color:#005fc6;
  }
  .unlocking{
    width: 100%;
    height: 50%;
    position: relative;
  }
  .unlocking-btn{
   padding: 10px
  }
  .unlocking-btn button{
  background-color: #005fc6;
  color:white;
  height: 32px;
  border: none;
  padding: 4px;
  border-radius:4px;
  }
  .lockingDialog .el-dialog{
    width: 150px;
    height: 150px;
    top:50%!important;
    margin-top: -75px;
  }
  .lockingDialog .el-dialog .el-dialog__body{
    padding: 0px;
  }
  .lockingDialog .el-dialog ul li {
    width: 150px;
    height: 150px;
    text-align: center;
  }
  .lockingDialog .el-dialog ul li .el-loading-spinner{
    margin-top: -60px;
  }
  .lockingDialog .el-dialog ul li  .circular{
    width: 100px;
    height: 100px;
  }
  .lockingDialog .el-dialog ul li .el-progress-circle{
    width: 100px!important;
    height: 100px!important;
    margin-top: 10px;
  }
  .lockingDialog .el-dialog ul li .el-icon-check{
    font-size: 40px;
  }
  .lockingDialog .el-dialog__header{
    display: none;
  }
  .noclick{
    cursor: not-allowed;
  }


  .green{
    color:#00b700;
  }
</style>
