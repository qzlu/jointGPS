<template>
  <section style="height: 100%" class="row">
    <div  class="vehicleList">
      <div class="carTeamList">
        <el-input
          class="filterInput"
          placeholder="_输入关键字_"
          v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :props="defaultProps"
          :data="data3"
          show-checkbox
          default-expand-all
          :filter-node-method="filterNode"
          :render-content="renderContent"
          @node-click="handleNodeClick"
          ref="tree2">
        </el-tree>
      </div>
    </div>
    <div class="configPanel" >
      <header class="configCar"></header>
      <div style="height: 100%">
        <div style="height: 200px;">
            <div class="configInfo">
              <div class="temperatureConfig">
                <p><span>公共温度</span><span><input type="text" placeholder="最低温度"><b>—</b><input type="text" placeholder="最高温度 "></span></p>
                <ul>
                  <li><span class="equipmentIndex">1</span>&nbsp;&nbsp;&nbsp;&nbsp; 温度<span><input type="text"placeholder="最低温度"><b>—</b><input type="text" placeholder="最高温度"></span></li>
                  <li><span class="equipmentIndex">2</span>&nbsp;&nbsp;&nbsp;&nbsp; 温度<span><input type="text"placeholder="最低温度"><b>—</b><input type="text" placeholder="最高温度"></span></li>
                  <li><span class="equipmentIndex">3</span>&nbsp;&nbsp;&nbsp;&nbsp; 温度<span><input type="text"placeholder="最低温度"><b>—</b><input type="text" placeholder="最高温度"></span></li>
                  <li><span class="equipmentIndex">4</span>&nbsp;&nbsp;&nbsp;&nbsp; 温度<span><input type="text"placeholder="最低温度"><b>—</b><input type="text" placeholder="最高温度"></span></li>
                </ul>
              </div>
              <div class="elConfig">
                <p><span>公共电量</span><span><input type="text" placeholder="最低电量"><b>—</b><input type="text" placeholder="最高电量"></span></p>
                <ul>
                  <li><span> &nbsp;&nbsp; </span>&nbsp;&nbsp;&nbsp;&nbsp; 电量<span><input type="text" placeholder="最低电量"><b>—</b><input type="text" placeholder="最高电量"></span></li>
                  <li><span> &nbsp;&nbsp; </span>&nbsp;&nbsp;&nbsp;&nbsp;  电量<span><input type="text" placeholder="最低电量"><b>—</b><input type="text" placeholder="最高电量"></span></li>
                  <li><span> &nbsp;&nbsp; </span>&nbsp;&nbsp;&nbsp;&nbsp; 电量<span><input type="text" placeholder="最低电量"><b>—</b><input type="text" placeholder="最高电量"></span></li>
                  <li><span> &nbsp;&nbsp; </span>&nbsp;&nbsp;&nbsp;&nbsp; 电量<span><input type="text" placeholder="最低电量"><b>—</b><input type="text" placeholder="最高电量"></span></li>
                </ul>

              </div>
            </div>
        </div>
        <div class="carImgContainer">
          <img src="/static/img/car.png" alt="">
        </div>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary">保存设置</el-button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import baidu  from '../../js/GIS/Baidu/BaiduAPI'
  let _this
  export default{
    data(){
      _this=this;
      return{
        loading:true,
        filterText: '',
        data3: null,
        defaultProps: {
          children: 'children',
          label: 'label',
          id:'id',
        },
        FVehicleName:null,
        lockID:null,
        currentStatus:null,
        currentPosition:null,
        FAssetID:null,
        lock:false,
        success:false,
        error:false
      }
    },
    activated: function(){
    },
    watch:{
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    mounted(){
      if (this.$store.state.allCarsList != null) {
        setData()
      } else {
        this.$store.commit('getAllCarsData', setData)
      }
      function setData() {
        _this.data3 = _this.$store.state.allCarsData;
        console.log(_this.data3)
      }
    },
    methods:{
      renderContent(h, { node, data, store }){
        return(
          <span>
          <i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A")!=-1}></i>
        <i class="fa fa-building icon" v-show={data.id.indexOf("@B")!=-1}></i>
        <i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C")!=-1}></i>
        <i class="fa fa-truck icon" v-show={data.id.indexOf("@B")==-1&data.id.indexOf("@A")==-1&data.id.indexOf("@C")==-1}></i>
        {node.label}
      <span v-show={data.id.indexOf("@B")!=-1||data.id.indexOf("@A")!=-1||data.id.indexOf("@C")!=-1} style="font-weight:bold">[{data.count}]</span>
        <span style="margin-left:10px" v-show={data.id.indexOf("@B")==-1&data.id.indexOf("@A")==-1&data.id.indexOf("@C")==-1}>({data.deviceId})</span>
        <div class="configResult">{data.message}</div>
          </span>
      )
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleNodeClick(data){
        if(data.FAssetID.indexOf("@A")===-1){
          _this.FVehicleName= data.FVehicleName;
          _this.lockID=data.FAssetID;
          var Baidu= new baidu.baiduAPI();
          var point = Baidu.GetPosition(data.FLongitude,data.FLatitude);
          var geoc = Baidu.GetClientGeocoder();
          Baidu.Geoco_GetLocation(geoc, point, function (json) {
            _this.currentPosition=json.address
          });
        }
      },
      unlocking(){
        if(_this.lockID!=null&&_this.lockID!=''){
          _this.success=false;
          _this.error=false;
          _this.lock=true;
          $(".unlocking-progress li").eq(0).animate({
            opacity:'1',
          },"slow");
          $.ajax({
            "url": "/web//Lock/Lock_SmartLock",
            "cache": false,
            "async": true,
            "type": "post",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryHomePageLastStyle","FAssetID":"'+_this.lockID+'","FVersion":"1.0.0"}',
            success: function (json) {
              if (json.Result==200){
                setTimeout(function () {
                  $(".unlocking-progress li").eq(1).animate({
                    opacity:'1',
                  },"slow");
                  $(".unlocking-progress li").eq(0).animate({
                    opacity:'0',
                  },"slow");
                },1000)
                _this.success=true;
              }else {
                _this.lock=false;
                _this.error=true;
              }
              console.log(json);
            },
            error: function () {
              _this.lock=false;
              _this.error=true;
            }
          });
        }else{
          _this.$message({
            showClose: true,
            message: '_请选择车辆_/_箱号_',
            type: 'warning'
          });
        }
      },

    },
    computed(){

    },
    components:{
    }
  }
</script>
<style>
.configInfo{
  width: 680px;
  height: 100%;
  margin: 0 auto;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
}
.configInfo input{
  width: 80px;
}
.configInfo  ::-webkit-input-placeholder{
  font-size: 12px;
  font-weight: normal;
  line-height: 28px;
}
.configInfo span{
  margin-left: 10px;
}
.configInfo b{
  margin:0px 5px;
  font-weight: normal;
}
.configInfo ul{
  margin-top: 20px;
}
.configInfo ul li{
  height: 36px;
  line-height: 36px;
}
  .temperatureConfig{
    width: 320px;
    height: 200px;
    float: left;
    padding: 20px;
  }
  .elConfig{
    height: 200px;
    width: 320px;
    float: right;
    padding: 20px;
  }
.temperatureConfig p,.elConfig p{
}
.equipmentIndex{
  color:#155baa
}
</style>
