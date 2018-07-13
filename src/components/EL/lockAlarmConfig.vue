<template>
  <section >
    <div class="modal fade" id="modal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" >
          <div class="modal-header" style="height: 32px;padding: 10px;background:#1970cf;text-align:center;">
            <button type="button" class="close mybtn" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h5 class="modal-title" style="color: white">_设置_</h5>
          </div>
          <div class="modal-body" style="height: 100%;padding-left:50px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-bottom:6px">_全选_</el-checkbox>
            <div>
              <el-checkbox-group v-model="checkboxGroup" size="mini" >
                <el-checkbox v-for="item in checkOptions" :label="item" :key="item"></el-checkbox>
                <!--   <el-checkbox  label="_绳挂锁剪断_"></el-checkbox>
                  <el-checkbox  label="_开锁状态保持一段时间_"></el-checkbox>
                  <el-checkbox  label="_震动_"></el-checkbox>
                  <el-checkbox  label="_出区域_"></el-checkbox>
                  <el-checkbox  label="_开后盖_"></el-checkbox> 
                  <el-checkbox  label="_刷非法卡_"></el-checkbox>
                  <el-checkbox  label="_进区域_"></el-checkbox>
                  <el-checkbox  label="_指令开锁密码连续输错五次报警_"></el-checkbox>
                  <el-checkbox  label="_低电量_"></el-checkbox>
                  <el-checkbox  label="_卡锁报警_"></el-checkbox> -->
              </el-checkbox-group>
            </div>
          </div>
          <div class="modal-footer" style="margin-right: 10px">
            <button type="submit" class="btn btn-primary submit" @click="alarmConfigs()" v-if="changeType==1" >_确定_</button>
            <button type="submit" class="btn btn-primary submit" @click="alarmConfig()" v-if="changeType==0">_确定_</button>
            <button type="reset" class="btn btn-default" data-dismiss="modal">_取消_</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal -->
    </div>
    <vehical-select-dialog v-on:child="get" ref="vehicle"></vehical-select-dialog>
          <div id="operate_wrapper">
            <div class="box-header">
              <div class="block" style="margin-right: 20px">
                <span class="operatExp">_选择设备_</span>
                <div class="search-input-wrap" data-toggle="modal" data-target="#modal"><!---->
                  <a href="javascript:;" class="get-carList-dialog">
                    <i class="fa fa-lock" style="font-size: 18px" ></i>
                  </a>
                  <input type="text" class="search-input" readonly="readonly">
                </div>
              </div>
              <div class="btnList">
                <!-- <el-button type="primary" class="search" @click="doQuery()">_查询_</el-button> -->
                <el-button type="primary" class="reset" @click="reset">_重置_</el-button>
                <el-button type="primary" class="search" @click="changeType=1;checkboxGroup=[];checkAll=false" data-toggle="modal" data-target="#modal1">_设置_</el-button>
              </div>
            </div>
          </div>
          <div class="el_table_wrap" id="el_table_wrap" >
                <!--   <div v-bind:height="table_height"> -->
                <el-table :data="table" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%"  @selection-change="handleSelectionChange" v-loading="loading"
                          element-loading-text="_正在修改中_">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column fixed header-align="center" align="center" label="_序号_"  width="80">
                    <template scope="scope">
                        {{scope.$index+1+pageSize*(pageIndex-1)}}
                    </template>
                  </el-table-column>
                  <el-table-column fixed header-align="center" prop="FAssetID" label="_终端号_" align="center" width="120" ></el-table-column>
                  <!-- <el-table-column fixed header-align="center" width="120" label="_操作_">
                    <template scope="scope">
                      <a href="javascript:" data-toggle="modal" data-target="#modal1" v-if="!scope.row.FAlarmOffLine" @click="change(scope.row)">_设置_</a>
                      <a href="javascript:" style="cursor:not-allowed;color: #cccccc " v-if="scope.row.FAlarmOffLine" title="离线状态不可设置">_设置_</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="FAlarmOffLine" label="_状态_" width="100" sortable>
                    <template scope="scope">
                      <span v-if="scope.row.FAlarmOffLine">_离线_</span>
                      <span v-else class="green">_在线_</span>
                    </template>
                  </el-table-column>            
                <el-table-column prop="" label="_配置进度_" width="100" >
                    <template scope="scope">
                      <span v-bind:class="{error:scope.row.progress=='_配置失败_',green:scope.row.progress=='_配置成功_'}">{{scope.row.progress}}<img
                        src="/static/img/myloading.gif" alt="" v-if="scope.row.progress=='_配置中_'"></span>
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="" label="_锁挂绳剪断_" width="120" align="center" >
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,10,'FLockRope')" v-bind:class={unconfigBg:!scope.row.FLockRope,configBg:scope.row.FLockRope}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column  prop=""  label="_刷非法卡_" width="120" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'9','FIllegalCard')" v-bind:class={unconfigBg:!scope.row.FIllegalCard,configBg:scope.row.FIllegalCard}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column  prop=""  label="_开后盖_" width="120" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'17','FUnCoverBack')" v-bind:class={unconfigBg:!scope.row.FUnCoverBack,configBg:scope.row.FUnCoverBack}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column  prop=""  label="_卡锁报警_" width="120" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'18','FLockStuck')" v-bind:class={unconfigBg:!scope.row.FLockStuck,configBg:scope.row.FLockStuck}><i class="fa fa-bell-o white"></i></a>
                    </template></el-table-column>   
                  <el-table-column  prop=""  label="_震动_" width="120" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'13','FVibration')" v-bind:class={unconfigBg:!scope.row.FVibration,configBg:scope.row.FVibration}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column  prop=""  label="_进区域_" width="120" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'14','FInGeoFence')" v-bind:class={unconfigBg:!scope.row.FInGeoFence,configBg:scope.row.FInGeoFence}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column  prop=""  label="_出区域_" width="120" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'15','FOutGeoFence')" v-bind:class={unconfigBg:!scope.row.FOutGeoFence,configBg:scope.row.FOutGeoFence}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>      
                  <el-table-column  prop=""  label="_低电量_" width="120" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'16','FLowPower')" v-bind:class={unconfigBg:!scope.row.FLowPower,configBg:scope.row.FLowPower}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column  prop=""  label="_长时间开锁_" width="150" align="center">
                    <template scope="scope">
                      <a class="switchAlarm" @click="alarmConfig(scope.row,'11','FLongTimeOpened')" v-bind:class={unconfigBg:!scope.row.FLongTimeOpened,configBg:scope.row.FLongTimeOpened}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column  prop=""  label="_密码连续五次错误_" align="center" width="160">
                    <template scope="scope">
                      <a class="switchAlarm"  @click="alarmConfig(scope.row,'12','FFivePasswordError')" v-bind:class={unconfigBg:!scope.row.FFivePasswordError,configBg:scope.row.FFivePasswordError}><i class="fa fa-bell-o white"></i></a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" min-width="100"></el-table-column>                           
                </el-table>
                <!-- </div>  -->
              </div>
          <div class="pagination">
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
          </div>      
  </section>
</template>
<script>
// import lockSelectDialog from "./lockSelectDialog.vue";
import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
let _this;
export default {
  data() {
    _this = this;
    return {
      total: 0,
      pageSize: 20,
      pageIndex: 1,
      table_height: null,
      table: null,
      FAssetID: null,
      FAssetGUID: null,
      changeObj: null,
      loading: false,
      multipleSelection: [],
      changeType: null,
      changeNum: 0,
      alarmTypelist: {
        FLockRope: 0,
        FIllegalCard: 0,
        FLongTimeOpened: 0,
        FFivePasswordError: 0,
        FVibration: 0,
        FInGeoFence: 0,
        FOutGeoFence: 0,
        FLowPower: 0,
        FUnCoverBack: 0,
        FLockStuck: 0
      },
      checkAll: false,
      checkOptions: [
        "_绳挂锁剪断_",
        "_长时间开锁_",
        "_震动_",
        "_出区域_",
        "_开后盖_",
        "_刷非法卡_",
        "_进区域_",
        "_密码连续五次错误_",
        "_低电量_",
        "_卡锁报警_"
      ],
      checkboxGroup: [],
      isIndeterminate: false
    };
  },
  props: {
    screenHeight: Number
  },
  mounted() {
    setTimeout(() => {
      this.adjustPage();
    }, 100);
  },
  computed: {
    url(){
      if(_this.$store.state.choiceSystemID==2){
        return  "/web/Lock/Lock_SmartLock"
      }else if(_this.$store.state.choiceSystemID==7){
        return "/web/SmartDistribution/SmartDistribution_SmartLock"
      }
    }    
  },
  updated() {},
  methods: {
    handleCheckAllChange(val) {
      this.checkboxGroup = val ? this.checkOptions : [];
    },   
    handleSizeChange(val) {
      this.pageSize = val;
      this.doQuery();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.doQuery();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    doQuery() {
      var FVehicleID = $(".search-input").attr("fguid");
      if (FVehicleID != undefined && FVehicleID != "") {
        $.post(
          _this.url,
          {
            FTokenID: _this.$store.state.FTokenID,
            FAction: "QueryLockAlarmSettingByFAssetGUIDs",
            FAssetGUIDs: FVehicleID,
            FPageSize: _this.pageSize,
            FPageIndex: _this.pageIndex,
            FVersion: "1.0.0"
          },
          function(json) {
            console.log(json);
            let totalArr = FVehicleID.split(",");
            _this.total = totalArr.length;
            _this.table = json.FObject;
            _this.table.sort(function (a,b) {
              return a.FAlarmOffLine-b.FAlarmOffLine
            })
          }
        );
      }else{
        this.$message({
          showClose: true,
          message: '_请选择设备_',
          type: 'warning'
        });
      }
    },
    translate(obj, arr) {
      $.each(arr, function(index, item) {
        switch (item) {
          case "_绳挂锁剪断_":
            obj.FLockRope = 1;
            break;
          case "_长时间开锁_":
            obj.FLongTimeOpened = 1;
            break;
          case "_震动_":
            obj.FVibration = 1;
            break;
          case "_出区域_":
            obj.FOutGeoFence = 1;
            break;
          case "_开后盖_":
            obj.FUnCoverBack = 1;
            break;
          case "_刷非法卡_":
            obj.FIllegalCard = 1;
            break;
          case "_进区域_":
            obj.FInGeoFence = 1;
            break;
          case "_密码连续五次错误_":
            obj.FFivePasswordError = 1;
            break;
          case "_低电量_":
            obj.FLowPower = 1;
            break;
          case "_卡锁报警_":
            obj.FLockStuck = 1;
            break;
          default:
            break;
        }
      });
    },
    //配置单个设备
     alarmConfig(row,typeIndex,type) {
        row[type]=!row[type];
        $.post(
          _this.url,
          {
            FTokenID: _this.$store.state.FTokenID,
            FAction: "UpdateAlarmStatus",
            FAssetGUID: row.FAssetGUID,
            FDataType: typeIndex,
            FState:Number(row[type]),
            FVersion: "1.0.0"
          },
          function(json) {
            if(json.Result==200){

            }else{
              row[type]=!row[type];
            }
            console.log('配置',json)
          }
        );
    },
    //配置多个设备
    alarmConfigs() {
       $(".submit").attr("data-dismiss", "modal");
      if (_this.multipleSelection.length == 0) {
        _this.$message({
          showClose: true,
          message: "_请选择设备_",
          type: "warning"
        });
      } else {
        let IDArr=[];
        let item= JSON.parse(JSON.stringify(_this.alarmTypelist));
        _this.translate(item,_this.checkboxGroup);
        $.each(_this.multipleSelection, function(index, obj) {
         IDArr.push(obj.FAssetGUID);
        });
        let ID=IDArr.join(',');
        $.post(
            _this.url,
            {
              FTokenID: _this.$store.state.FTokenID,
              FAction: "UpdateSmartLock_LockAlarmSetting",
              FAssetGUIDs: ID,
              FT_LockAlarmSets:item,
              FVersion: "1.0.0"
            },
            function(json) {
              console.log('配置',json)
              if(json.Result==200){
                $.each(_this.multipleSelection,function(index,obj){
                  for(var i in item){
                    obj[i]=item[i]
                  }
                })
              }
            }
        );
      }
    },
    adjustPage() {
      this.table_height =
        this.elementsFlex(
          "el_table_wrap",
          "main-content",
          "operate_wrapper",
          "pagination",
          true
        ) - 70;
      //this.countHeight=this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) - 70;
    },
    get: function(data) {
      $(".search-input").val(data[0].length);
      $(".search-input").attr("title", data[0]);
      $(".search-input").attr("fguid", data[1]);
      this.doQuery();
    },
    //重置表单
    reset: function() {
      $(".search-input").val("");
      $(".search-input").removeAttr("fguid");
      this.table = null;
      this.total = 0;
    }
  },
  watch: {
    screenHeight() {
      this.adjustPage();
    }
  },
  components: {
    // lockSelectDialog,
    VehicalSelectDialog,
  }
};
</script>
<style>
.error {
  color: red;
}
.searchBtn {
  outline: none;
}
.switchAlarm {
  display: inline-block;
  border-radius: 2px;
  width: 22px;
  height: 22px;
  color: white;
  font-size: 16px;
  line-height: 22px;
}
.configBg {
  background: red;
}
.unconfigBg {
  background: gray;
}
.el-checkbox-group label {
  width: 140px;
  height: 30px;
  margin-left: 0px !important;
}
</style>

