<template>
    <section  class="dis-mainContent">   
          <div class="dis-header">
<!--
                        <button class="noBg mgright-10" @click="clicAdd"><i class="el-icon-plus" ></i>_新建_</button>
                        <button class="noBg mgright-10" @click="changeStatus(true)"><i class="el-icon-caret-right" ></i>_启用_</button>
                        <button class="noBg mgright-10" @click="changeStatus(false)"><i class="el-icon-circle-close"></i>_禁用_</button>
                        <button class="noBg mgright-10" @click="deleteDiss()"><i class="el-icon-delete"></i>_删除_</button>
-->
			  <el-button type="primary" class='el-icon-plus' size="small" @click='clicAdd'>_新建_</el-button>
			  <el-button type="primary" class='el-icon-circle-check' size="small" @click='changeStatus(true)'>_启用_</el-button>
			  <el-button type="primary" class="el-icon-circle-close" size="small" @click='changeStatus(false)'>_禁用_</el-button>
			  <el-button type="primary" class="el-icon-delete" size="small" @click="deleteDiss">_删除_</el-button>
          </div>
          <div class="dis-content " id="el_table_wrap" >
                <el-table :data="table" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%"  v-loading="loading"
                          element-loading-text="_正在修改中_" @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column  header-align="center" prop="Row"  label="_序号_"  width="80">
                    <template scope="scope">
                      {{scope.$index+1}}
                    </template>
                  </el-table-column>
                  <el-table-column  header-align="center" prop="" label="_操作_" width="130" >
                    <template scope="scope">
                      <a style="font-size:14px;padding:0 6px;color:#005fc6" title="_编辑_" @click="updateDis(scope.row)"><i class="el-icon-edit"></i></a>
                      <a style="font-size:14px;padding:0 6px;color:#005fc6" title="_删除_" @click="deleteDis(scope.row.FGUID)"><i class="el-icon-delete"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" label="_状态_" width="120" >
                    <template scope="scope">
                      <el-switch v-model="scope.row.FStatus"  @change="changeStatu(scope.row)"> </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="FStoreName"  label="_门店名称_" width="120">
                  </el-table-column>
                  <el-table-column  prop="FUserName"  label="_收货人_" width="120">
                  </el-table-column>
                  <el-table-column  prop="FTelephone"  label="_手机_" width="120">
                  </el-table-column>
                  <el-table-column  prop="fenceName"  label="_绑定围栏_" width="200">
                  </el-table-column>
                  <el-table-column  prop="FAddress"  label="_地址_" width="260" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column  prop=""  label="" width="">
                  </el-table-column>
                </el-table>
              </div>
              <el-dialog
                :title="text"
                :visible.sync="dialogVisible"
                size=""
                class="changeDialog"
                :before-close="handleClose">
                <span>
                  <el-form :inline="true" :model="formInline" class="demo-form-inline ">
                    <el-form-item label="_门店名称_" :rules="[{required: true}]">
                      <el-input v-model="disInfo.FAgentCode" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="_收货人_" :rules="[{required: true}]">
                      <el-input v-model="disInfo.FUserName" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="_手机_" :rules="[{required: true}]">
                      <el-input v-model="disInfo.FTelephone" placeholder=""></el-input>
                    </el-form-item>
                  </el-form>
                  <div class="dis-map">
                    <div class="serchDis">
                      <ul>
                        			<li class="map-tool-item">
                                  <div id="r-result"><input type="text" id="suggestId" size="20" v-model="disInfo.FAddress"  class="dis-search" placeholder="_门店地址_"/></div>
                                  <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
                              </li>
                              <li style="margin-left:60px;width:220px">
                                  <el-select v-model="disInfo.FFenceGUID"  clearable placeholder="_绑定围栏_">
                                      <el-option
                                        v-for="item in fences"
                                        :key="item.FAgentGUID"
                                        :label="item.FName" 
                                        :value="item.FGUID">
                                        <span style="float: left;margin-right:10px"><span class="el-color-picker__color img-fence no-border" :class="'fencetype-icon'+item.FIcon" style="width:24px;height:24px" ></span></span>
                                        <span style="color:black; font-size: 13px">{{ item.FName }}</span>
                                      </el-option>
                                    </el-select>
                              </li>
                      </ul>
                    </div>
                     <baidu-map ref="map" :fa-data="[mapToolShow]"  ></baidu-map>
                  </div> 
                </span>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addDis()">_保存_</el-button>
                  <el-button @click="dialogVisible = false">_取消_</el-button>
                </span>
              </el-dialog>
          <!-- <div class="disManage">
                <div class="block">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 30,]"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper,total,sizes"
                    :total="total">
                  </el-pagination>
                </div>
          </div>       -->
    </section>
</template>
<script>
import baiduMap from '../Common/baidu_map.vue'
let _this
export default {
  data(){
    _this=this;
      return{
          table:[],
          table_height:null,
          multipleSelection: [],
          dialogVisible:false,
          mapToolShow:false,
          text:"",
          //站点信息
          disInfo:{
            FUserName:'',
            FAgentCode:'',
            FTelephone:'',
            FAddress:'',
            FLongitude:'',
            FLatitude:'',
            FFenceGUID:"",
          },
          fences: [],
      }
  },
  props:{
    screenHeight: Number,
  },
  beforCreate(){

  },
  create(){

  },
  watch:{
    screenHeight(){
      _this.table_height=$('.dis-content').height()
    },
    dialogVisible(){
      if (_this.dialogVisible) {
        this.$nextTick(function () {
          _this.$refs.map.initMap();
          _this.baiduSearch();
        })
      }
    }
  },
  computed:{

  },
  updated(){

  },
  components:{
      baiduMap,
  },
  mounted(){
    this.$nextTick(function () {
          _this.table_height=$('.dis-content').height();
    })
    _this.getAllDistribution();
  },
  methods:{
    //获取所有围栏信息
      loadFence(){
        return new Promise(resove=>{
          $.ajax({
            "url": "/web/Common/Common_LBS",
            "cache": false,
            "async": true,
            "type": "post",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLBSGISFenceList","FPageSize":999999,"FPageIndex":1,"FVersion":"1.0.0"}',
            success: function (json) {
              if (json.FObject.Table1) {
                _this.fences=json.FObject.Table1;
              }
              resove()
            },
            error:function () {
            }
          })
        })
      },
    //获取所有站点信息
    async getAllDistribution(){
      await _this.loadFence();
      $.post("/web/SmartDistribution/SmartDistribution_Admin",
      {
        FTokenID:_this.$store.state.FTokenID,
        FAction:"QueryCustomerList",
        FVersion:"1.0.0"
      },
      function (res) {
        console.log("站点",res)
        _this.table=res.FObject;
        $.each( _this.table,function (index,obj) {
          if(obj.FStatus){
            obj.FStatus=true
          }else{
            obj.FStatus=false
          }
          _this.$set(obj,'fenceName',"_未绑定_")
          $.each(_this.fences,function (i,item) {
            if (obj.FFenceGUID==item.FGUID) {
              obj.fenceName=item.FName
            }
          })
        });
      })
    },
    //修改站点状态(单个)
    changeStatu(obj){
      $.post("/web/SmartDistribution/SmartDistribution_Admin",
      {
        FTokenID:_this.$store.state.FTokenID,
        FAction:"UpdateCustomerStatus",
        FGUID:obj.FGUID,
        FState:Number(obj.FStatus),
        FVersion:"1.0.0"
      },
      function (res) {
        if(res.Result!=200){
          obj.FStatus=!obj.FStatus;
        }else{
          _this.$message({
            showClose: true,
            message: '_修改成功_',
            type: 'success'
          });
        }
      })
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    //修改站点状态（多个）
    changeStatus(status){
        if (!this.multipleSelection.length) {
                  _this.$message({
                    showClose: true,
                    message: '_请选择站点_',
                    type: 'warning'
                  });
        }
      $.each(this.multipleSelection,function (index,item) {
        if(item.FStatus!=status){
          item.FStatus=status;
          _this.changeStatu(item)
        }
      })
    },
      baiduSearch(){
        // 百度地图API功能
        function G(id) {
          return document.getElementById(id);
        }
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
          {"input" : "suggestId"
          ,"location" : _this.$refs.map.map
        });

        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
          var _value = e.fromitem.value;
          var value = "";
          if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
          }    
          str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
          
          value = "";
          if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
          }    
          str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
          G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
          myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
          G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
          _this.disInfo.FAddress=myValue;
         setPlace();
        });

        function setPlace(){
          _this.$refs.map.map.clearOverlays();    //清除地图上所有覆盖物
          function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            _this.disInfo.FLatitude=pp.lat;
            _this.disInfo.FLongitude=pp.lng;
           _this.$refs.map.map.centerAndZoom(pp, 18);
            _this.$refs.map.map.addOverlay(new BMap.Marker(pp));    //添加标注
          }
          var local = new BMap.LocalSearch( _this.$refs.map.map, { //智能搜索
            onSearchComplete: myFun
          });
          local.search(myValue);
        }
      },
      updateDis(obj){
        _this.text="_编辑_";
        _this.dialogVisible=true;
        _this.disInfo.FAgentCode=obj.FStoreName;
        _this.disInfo.FUserName=obj.FUserName;
        _this.disInfo.FTelephone=obj.FTelephone;
        _this.disInfo.FFenceGUID=obj.fenceName=="_未绑定_"?"":obj.FFenceGUID;//过滤被删除的围栏
        _this.disInfo.FAddress=obj.FAddress
        setTimeout(() => {
           $("#suggestId").val(obj.FAddress)
        }, 300);
      },
      clicAdd(){
        this.dialogVisible=true;
        this.text='_新建_';
        _this.disInfo.FAgentCode="";
        _this.disInfo.FUserName="";
        _this.disInfo.FTelephone="";
        _this.disInfo.FFenceGUID="";
        _this.disInfo.FAddress=""
      },
      //保存(新增或修改站点信息)
      addDis(){
        if(_this.disInfo.FAgentCode==null||_this.disInfo.FAgentCode==""){
          _this.$message({
            showClose: true,
            message: '_请输入门店名称_',
            type: 'warning'
          });
          return
        }
        if(_this.disInfo.FUserName==null||_this.disInfo.FUserName==""){
          _this.$message({
            showClose: true,
            message: '_请输入联系人_',
            type: 'warning'
          });
          return
        }
        if(_this.disInfo.FTelephone==null||_this.disInfo.FTelephone==""){
          _this.$message({
            showClose: true,
            message: '_请输入手机号码_',
            type: 'warning'
          });
          return
        }else if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(_this.disInfo.FTelephone))){
          _this.$message({
            showClose: true,
            message: '_手机号码不正确_',
            type: 'warning'
          });
          return
        }
        if(_this.disInfo.FAddress==null||_this.disInfo.FAddress==""){
          _this.$message({
            showClose: true,
            message: '_请输入地址_',
            type: 'warning'
          });
          return
        }
        $.post("/web/SmartDistribution/SmartDistribution_Admin",
        {
          FTokenID:_this.$store.state.FTokenID,
          FAction:"AddCustomerInfo",
          FMT_SmartDistribution_Customer:_this.disInfo,
          FVersion:"1.0.0"
        },
        function (res) {
          console.log("修改",res)
          if(res.Result==200){
            _this.$message({
              showClose: true,
              message: '_保存成功_',
              type: 'success'
            });
            _this.dialogVisible=false;
            _this.getAllDistribution();
          }else{
            _this.$message({
              showClose: true,
              message: '_保存失败_',
              type: 'success'
            });
          }
        })        
      },
      //取消
      cancle(){
        _this.text="";
        _this.dialogVisible=false;
        for (var key in _this.disInfo) {
          _this.disInfo[key]=""
        }
      },
      //删除站点
      deleteDis(guids){
        this.$confirm('_此操作将永久删除_,_是否继续_?', '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
				    })
          .then(_ => {
              $.post("/web/SmartDistribution/SmartDistribution_Admin",
              {
                FTokenID:_this.$store.state.FTokenID,
                FAction:"DeleteCustomerInfo",
                FGUIDs:guids,
                FVersion:"1.0.0"
              },
              function (res) {
                console.log("修改",res)
                if(res.Result==200){
                  _this.$message({
                    showClose: true,
                    message: '_删除成功_',
                    type: 'success'
                  });
                  _this.getAllDistribution();
                }else{
                  _this.$message({
                    showClose: true,
                    message: '_删除失败_',
                    type: 'warning'
                  });
                }
              })        
          })
          .catch(_ => {});
      },
      //删除多个站点
      deleteDiss(){
        var guids=[];
        if (!this.multipleSelection.length) {
                  _this.$message({
                    showClose: true,
                    message: '_请选择站点_',
                    type: 'warning'
                  });
                  return
        }
        $.each(this.multipleSelection,function (index,item) {
          guids.push(item.FGUID)
        });
        var guidsStr=guids.join(",");
        this.deleteDis(guidsStr)
      }
  }
}
</script>
<style>
  .dis-mainContent{
    height: 100%; 
    background: white;
    padding-left: 10px;
    border: 1px solid #ccc;
  }
  .dis-header{
    height: 50px;
    line-height: 50px;
    position: absolute;
  }
  /*.dis-header button{
    height: 30px;
    width: 70px;
  }*/
  .dis-content{
    position: absolute;
    top: 150px;
    bottom: 10px;
  }
  .changeDialog .el-dialog{
    width: 780px;
    height: 432px;
  }
  .changeDialog .el-dialog .el-form-item__content{
    width: 150px
  }
  .dis-map{
    position: relative;
  }
  .dis-map #map-component{
   height: 278px;
   overflow: hidden;
  }
 .dis-map #map-wrapper{
   border: none;
   height: 306px;
  }
.dis-map #map-component section{
  display: none;
}
.serchDis{
  position: absolute;
  z-index: 1000;
  top: 10px;
  left: 10px;
}
.serchDis ul li{
  display: inline-block;
}
.serchDis .dis-search{
  width: 400px;
  height: 30px;
  line-height: 30px;
}
  /* .dis-map #map-tool li{
    display: none
  } */
  /* .disManage{
    position: absolute;
    bottom: 20px;
  } */
</style>
