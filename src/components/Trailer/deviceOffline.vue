<script src="../../../../node_modules/element-ui/lib/tooltip.js"></script>
<template>
  <section>
    <div class="modal fade" id="modal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" >
          <div class="modal-header" style="height: 20px;width: 20px;position: relative;padding: 0px;left: 95%;border-bottom-width: 0px;background:none">
            <button type="button" class="close mybtn" data-dismiss="modal" aria-hidden="true" style="background: white;width: 28px" @click="clearText()">&times;</button>
          </div>
          <div class="modal-body" style="height: 100%">
            <textarea style="height:190px;width:100%;text-indent: 2em;padding: 4px" placeholder="_输入处理意见_" id="myinput"></textarea>
          </div>
          <div class="modal-footer" style="margin-right: 10px">
            <div class="btn btn-primary btn-sm" style="height: 30px;padding: 0px">
              <button type="button" class="btn  btn-xs mybtn" data-dismiss="modal" @click="handle(0,5)" style="width: 40px">_提交_</button>
              <el-dropdown trigger="click" @command="handleCommand">
                <el-button type="primary" size="mini" style="width: 20px;" class="mybtn">
                  <i class="el-icon-caret-bottom el-icon--right" style="margin-left: 0px"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="_我已阅读_">_我已阅读_</el-dropdown-item>
                  <el-dropdown-item command="_已通知相关人员处理_">_已通知相关人员处理_</el-dropdown-item>
                  <el-dropdown-item command="_已经联系司机确认_">_已经联系司机确认_</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <button type="reset" class="btn btn-default" data-dismiss="modal" @click="clearText()">_取消_</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal -->
    </div>
	  <div class="mymodal" style="height: 570px;width: 920px;margin-left:-320px;margin-top: -230px;position: fixed;left: 50%;top: 50%;z-index:999;visibility: hidden">
		  <div class="modal-header" style="position: absolute;left: 890px;height: 20px;width: 20px;border: none;padding: 0px;z-index: 2;">
        <button type="button" @click="closeMymodal" style="height: 30px;width: 30px;background:transparent;outline:none;border: none;">
			<!--<span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal"></span>-->
			<i class="fa fa-times" aria-hidden="true" style="font-size: 24px;"></i>
		</button>
      </div>
      <div class="modal-body"  style="padding: 0px">
        <baidu-map ref="map" :fa-data="[mapToolShow]" ></baidu-map>
      </div>
      <div class="mapModal">
        <header style="background: #f9f9f9 ;height:34px;padding: 10px">
          <h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{FVehicleName}}</h4>
        </header>
        <div style="padding: 15px">
          <p><span>_离线时间_：</span>{{FStartDateTime}}</p>
          <p><span>_持续时长_：</span>{{FKeepSeconds}}</p>
          <p><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_司机_：</span>{{FDriverName}}</p>
          <p :title="address"><nobr><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_位置_：</span>{{address}}</nobr></p>
        </div>
      </div>
    </div><!-- /.modal-content -->
    <vehical-select-dialog v-on:child="get"  ref="vehicle"></vehical-select-dialog>
    <!-- <lock-select-dialog v-on:child="get" v-if="SystemID==2" ref="lock"></lock-select-dialog> -->
    <div id="operate_wrapper">
      <div class="box-header">
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
            v-model="value3"
            :clearable="false"
            type="daterange"
            @change="getTime"
            :picker-options="pickerOptions2"
            placeholder="_选择时间范围_">
          </el-date-picker>
        </div>
        <div class="btnList">
          <el-button type="primary" class="search" @click="queryCount(0,5)">_查询_</el-button>
          <el-button type="primary" class="reset" @click="reset()">_重置_</el-button>
          <el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>_导出文件_</el-button>
          <el-button type="primary" class="read" @click="setToRead(0,5)"><i class="fa fa-envelope-open-o"></i>_设为已读_</el-button>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName"  @tab-remove="removeTab('forth')">
      <el-tab-pane label="_汇总_" name="all">
        <div class="el_table_wrap" id="el_table_wrap">
          <el-table
            :data="table0"
            v-loading="loading"
            element-loading-text="_拼命加载中_"
            empty-text="_暂无数据_"
            stripe
            :height="table_height"
            align="left"
            style="width: 100%">
            <el-table-column
              prop=""
              label="_序号_"
              width="80">
                    <template scope="scope">
                        {{scope.$index+1+pageSize0*(pageIndex0-1)}}
                    </template>
            </el-table-column>
            <el-table-column
              prop=""
              width="120"
              label="_操作_">
              <template scope="scope">
                <a href="javascript:" @click="addTab(scope.$index,scope.row,5)" v-if="scope.row.FAlarmCount!=0">_详情_</a>
                <a href="javascript:" v-if="scope.row.FAlarmCount==0" style="cursor: not-allowed;color:#cccccc">_详情_</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="FShortName"
              label="_公司简称_"
              width="120">
            </el-table-column>
           <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>
            <el-table-column
              prop="FVehicleName"
              sortable
              label="_车牌号_"
              width="100">
            </el-table-column>
            <el-table-column
              prop="FDriverName"
              label="_司机_"
              width="80">
            </el-table-column>
            <el-table-column
              prop="FAlarmCount"
              sortable
              label="_离线次数_"
              width="200">
            </el-table-column>
            <el-table-column
              prop=""
              label=""
              min-width="100"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
        <div  class="pagination">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange0"
              @current-change="handleCurrentChange0"
              :current-page="pageIndex0"
              :page-sizes="[10, 20, 30,]"
              :page-size="pageSize0"
              layout="prev, pager, next, jumper,total,sizes"
              :total="total0">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="_全部_" name="first">
        <div class="el_table_wrap" >
          <el-table
            :data="table1"
            v-loading="loading"
            element-loading-text="_拼命加载中_"
            empty-text="_暂无数据_"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            stripe
            :height="table_height"
            align="left"
            style="width: 100%">
            <el-table-column
              type="selection"
              :selectable="check"
              width="55">
            </el-table-column>
            <el-table-column
              prop=""
              label="_序号_"
              width="80">
                    <template scope="scope">
                        {{scope.$index+1+pageSize1*(pageIndex1-1)}}
                    </template>
            </el-table-column>
            <el-table-column
              prop="FProcessStatus"
              sortable
              label="_状态_"
              width="90">
            </el-table-column>
            <el-table-column
              prop=""
              width="140"
              label="_操作_">
              <template scope="scope">
                <a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1" v-if="scope.row.FProcessStatus=='_未处理_'">_处理_</a>
                <a href="javascript:"style="color: #4aae58" @click="position(scope.$index,scope.row)">_查看位置_</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="FShortName"
              label="_公司简称_"
              width="120">
            </el-table-column>
           <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>
            <el-table-column
              prop="FVehicleName"
              sortable
              label="_车牌号_"
              width="100">
            </el-table-column>
            <el-table-column
              prop="FDriverName"
              label="_司机_"
              width="80">
            </el-table-column>
            <el-table-column
              prop="FProcessContext"
              show-overflow-tooltip
              label="_处理结果_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FProcessDateTime"
              sortable
              label="_处理时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FStartDateTime"
              sortable
              label="_离线时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FKeepSeconds"
              sortable
              :sort-method="sortMethod"
              :formatter="formatter"
              label="_离线持续时长_"
              width="160">
            </el-table-column>
            <el-table-column
              prop="FStartMileage"
              show-overflow-tooltip
              label="_离线里程_(km)"
              width="150">
            </el-table-column>
            <el-table-column
              prop="starAdress"
              label="_离线位置_"
              show-overflow-tooltip
              width="240">
            </el-table-column>
            <el-table-column
              prop=""
              label=""
              min-width="100"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
        <div id="pagination" class="pagination">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="pageIndex1"
              :page-sizes="[10, 20, 30,]"
              :page-size="pageSize1"
              layout="prev, pager, next, jumper,total,sizes"
              :total="total1">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="_已读_" name="second">
        <div class="el_table_wrap" >
          <el-table
            :data="table2"
            v-loading="loading"
            element-loading-text="_拼命加载中_"
            empty-text="_暂无数据_"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            stripe
            :height="table_height"
            align="left"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop=""
              label="_序号_"
              width="80">
                    <template scope="scope">
                        {{scope.$index+1+pageSize2*(pageIndex2-1)}}
                    </template>
            </el-table-column>
            <el-table-column
              prop=""
              width="120"
              label="_操作_">
              <template scope="scope">
                <a href="javascript:"style="color: #4aae58" @click="position(scope.$index,scope.row)">_查看位置_</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="FShortName"
              label="_公司简称_"
              width="120">
            </el-table-column>
           <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>
            <el-table-column
              prop="FVehicleName"
              sortable
              label="_车牌号_"
              width="100">
            </el-table-column>
            <el-table-column
              prop="FDriverName"
              label="_司机_"
              width="80">
            </el-table-column>
            <el-table-column
              prop="FProcessContext"
              show-overflow-tooltip
              label="_处理结果_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FProcessDateTime"
              sortable
              label="_处理时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FStartDateTime"
              sortable
              label="_离线时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FKeepSeconds"
              sortable
              :sort-method="sortMethod"
              :formatter="formatter"
              label="_离线持续时长_"
              width="160">
            </el-table-column>
            <el-table-column
              prop="FStartMileage"
              show-overflow-tooltip
              label="_离线里程_(km)"
              width="150">
            </el-table-column>
            <el-table-column
              prop="starAdress"
              show-overflow-tooltip
              label="_离线位置_"
              width="240">
            </el-table-column>
            <el-table-column
              prop=""
              label=""
              min-width="100"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
        <div  class="pagination">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="pageIndex2"
              :page-sizes="[10, 20, 30,]"
              :page-size="pageSize2"
              layout="prev, pager, next, jumper,total,sizes"
              :total="total2">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="_未读_" name="third">
        <div class="el_table_wrap" >
          <el-table
            :data="table3"
            v-loading="loading"
            element-loading-text="_拼命加载中_"
            empty-text="_暂无数据_"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            stripe
            :height="table_height"
            align="left"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop=""
              label="_序号_"
              width="80">
                    <template scope="scope">
                        {{scope.$index+1+pageSize3*(pageIndex3-1)}}
                    </template>
            </el-table-column>
            <el-table-column
              prop=""
              width="140"
              label="_操作_">
              <template scope="scope">
                <a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1">_处理_</a>
                <a href="javascript:" style="color: #4aae58" @click="position(scope.$index,scope.row)">_查看位置_</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="FShortName"
              label="_公司简称_"
              width="120">
            </el-table-column>
           <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>
            <el-table-column
              prop="FVehicleName"
              sortable
              label="_车牌号_"
              width="100">
            </el-table-column>
            <el-table-column
              prop="FDriverName"
              label="_司机_"
              width="80">
            </el-table-column>
            <el-table-column
              prop="FStartDateTime"
              sortable
              label="_离线时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FKeepSeconds"
              sortable
              :sort-method="sortMethod"
              :formatter="formatter"
              label="_离线持续时长_"
              width="160">
            </el-table-column>
            <el-table-column
              prop="FStartMileage"
              label="_离线里程_(km)"
              width="150">
            </el-table-column>
            <el-table-column
              prop="starAdress"
              show-overflow-tooltip
              label="_离线位置_"
              width="240">
            </el-table-column>
            <el-table-column
              prop=""
              label=""
              min-width="100"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
        <div  class="pagination">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange3"
              @current-change="handleCurrentChange3"
              :current-page="pageIndex3"
              :page-sizes="[10, 20, 30,]"
              :page-size="pageSize3"
              layout="prev, pager, next, jumper,total,sizes"
              :total="total3">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.name"
        closable
        :label="item.title"
        :name="item.name"
      >
        <div class="el_table_wrap" >
          <el-table
            :data="mytable"
            v-loading="loading"
            element-loading-text="_拼命加载中_"
            empty-text="_暂无数据_"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            stripe
            :height="table_height"
            align="left"
            style="width: 100%">
            <el-table-column
              type="selection"
              :selectable="check"
              width="55">
            </el-table-column>
            <el-table-column
              prop=""
              label="_序号_"
              width="80">
                    <template scope="scope">
                        {{scope.$index+1+pageSize4*(pageIndex4-1)}}
                    </template>
            </el-table-column>
            <el-table-column
              prop="FProcessStatus"
              label="_状态_"
              width="80">
            </el-table-column>
            <el-table-column
              prop=""
              width="140"
              label="_操作_">
              <template scope="scope">
                <a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1" v-if="scope.row.FProcessStatus=='_未处理_'">_处理_</a>
                <a href="javascript:"style="color: #4aae58" @click="position(scope.$index,scope.row)">_查看位置_</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="FShortName"
              label="_公司简称_"
              width="120">
            </el-table-column>
           <el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>
            <el-table-column
              prop="FVehicleName"
              sortable
              label="_车牌号_"
              width="100">
            </el-table-column>
            <el-table-column
              prop="FDriverName"
              label="_司机_"
              width="80">
            </el-table-column>
            <el-table-column
              prop="FProcessContext"
              show-overflow-tooltip
              label="_处理结果_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FProcessDateTime"
              sortable
              label="_处理时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FStartDateTime"
              sortable
              label="_离线时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FKeepSeconds"
              sortable
              :sort-method="sortMethod"
              :formatter="formatter"
              label="_离线持续时长_"
              width="160">
            </el-table-column>
            <el-table-column
              prop="starAdress"
              label="_离线位置_"
              show-overflow-tooltip
              width="240">
            </el-table-column>
            <el-table-column
              prop="FKeepDistance"
              show-overflow-tooltip
              label="_离线里程_"
              width="240">
            </el-table-column>
            <el-table-column
              prop=""
              label=""
              min-width="100"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange4"
              @current-change="handleCurrentChange4"
              :current-page="pageIndex4"
              :page-sizes="[10, 20, 30,]"
              :page-size="pageSize4"
              layout="prev, pager, next, jumper,total,sizes"
              :total="total4">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
  import baiduMap from '../Common/baidu_map.vue'
  import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
  // import lockSelectDialog from './../EL/lockSelectDialog.vue'
  import baidu  from '../../js/GIS/Baidu/BaiduAPI'
  export default{
    data(){
      return {
        loading:false,
        Area:"深圳",
        mapToolShow:false,
        currentPage:1,
        activeName:'all',
        total0:0,
        total1:0,
        total2:0,
        total3:0,
        total4:0,
        pageSize0:20,
        pageSize1:20,
        pageSize2:20,
        pageSize3:20,
        pageSize4:20,
        pageIndex0:1,
        pageIndex1:1,
        pageIndex2:1,
        pageIndex3:1,
        pageIndex4:1,
        pickerOptions2: {
          shortcuts: [{
            text: '_今天_',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              //start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
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
          },{
            text: '_最近七天_',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '_最近三十天_',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value3: [new Date(), new Date()],
        value4:'',
        table_height: null,
        table0:null,
        table1:null,
        table2:null,
        table3:null,
        table4:null,
        editableTabs:[],
        tabIndex: 4,
        multipleSelection: [],
        objDetail:'',
        handleObj:'',
        FVehicleName:'',
        address:'',
        FStartDateTime:'',
        FKeepSeconds:'',
        FDriverName:'',
      }
    },
    props: {
      screenHeight: Number,
    },
    watch:{
    },
    computed:{
      SystemID(){
        return this.$store.state.choiceSystemID
      },
      url(){
        if(this.$store.state.choiceSystemID==2){
          return '/web/Lock/Lock_Message';
        }else{
          return '/web/Common/Common_Message';
        }
      }

    },
    mounted(){
      var _this=this;
      //加载地图
      this.$refs.map.initMap();
      $("#map-wrapper").height(570);
      setTimeout(() => {
        this.adjustPage();

      },100);
    },
    methods: {
    /*  sortMethod(a,b){
        if(a.FKeepSeconds-b.FKeepSeconds>0){
          return true
        }else {
          return false
        }
      },*/
      formatter(row,column,cellValue){
        return this.formatSeconds(row.FKeepSeconds);
      },
     /* check(row,index){
        if(row.FProcessStatus=='_未处理_'){
          return true
        }else {
          return false
        }

      },*/
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange0(val){
        this.pageSize0 = val;
        this.queryCount(1,5)
      },
      handleSizeChange1(val) {
        this.pageSize1 = val;
        this.queryCount(2,5)
      },
      handleSizeChange2(val){
        this.pageSize2 = val;
        this.queryCount(3,5)
      },
      handleSizeChange3(val){
        this.pageSize3 = val;
        this.queryCount(4,5)
      },
      handleSizeChange4(val){
        this.pageSize4 = val;
        this.checkDetail(5)
      },
      handleCurrentChange0(val){
        this.pageIndex0 = val;
        this.queryCount(1,5)
      },
      handleCurrentChange1(val) {
        this.pageIndex1 = val;
        this.queryCount(2,5)
      },
      handleCurrentChange2(val){
        this.pageIndex2 = val;
        this.queryCount(3,5)
      },
      handleCurrentChange3(val){
        this.pageIndex3 = val;
        this.queryCount(4,5)
      },
      handleCurrentChange4(val){
        this.pageIndex4 = val;
        this.checkDetail(5);
      },
      adjustPage(){
        this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) - 60;
      },
      get: function (data) {
        if(this.SystemID==2){
          $('.search-input').val("_已选_"+data[0].length);
        }else {
          $('.search-input').val("_已选-"+data[0].length+"_辆_");
        }
        $('.search-input').attr('title',data[0])
        $('.search-input').attr('fguid',data[1])
      },
     /* reset:function () {
        $('.search-input').val('');
        $('.search-input').removeAttr('fguid')
        this.value3=null;
        this.table0=null;
        this.table1=null;
        this.table2=null;
        this.table3=null;
        this.table4=null;
        this.editableTabs=[];
        this.total0=0;
        this.total1=0;
        this.total2=0;
        this.total3=0;
        this.total4=0;
        this.activeName='all';
        if(this.SystemID==2){
          this.$refs.lock.$children[1].setCheckedKeys([]);
        }else {
          this.$refs.vehicle.$children[1].setCheckedKeys([]);
        }
      },*/
      getTime:function (value) {
        return this.value4=value;
      },
      /*doQuery:function (pageSize,pageIndex) {
        var curpageIndex;
        var curpageSize;
        var _this=this;
        var FVehicleID = $(".search-input").attr("fguid");
        var startTime;
        var endTime;
        var year=new Date().getFullYear();
        var month=new Date().getMonth()+1;
        var date=new Date().getDate();
        var today=year+'-'+month+'-'+date;
        if(this.value4==''){
          startTime=this.parseUTC(today+' 00:00:00');
          endTime=this.parseUTC(today+' 23:59:59');
        }else {
          var time=this.value4.split(' - ');
          startTime=this.parseUTC(time[0]+' 00:00:00');
          endTime=this.parseUTC(time[1]+' 23:59:59');
        };
        if(arguments.length==0){
          curpageIndex=1;
          curpageSize=20
        } else {
          curpageIndex=this[pageIndex];
          curpageSize=this[pageSize]
        };
        let d1=startTime.substr(0,10).split("-")
        let t1=new Date(d1[0],d1[1]-1,d1[2]).getTime();
        let d2=endTime.substr(0,10).split("-")
        let t2=new Date(d2[0],d2[1]-1,d2[2]).getTime();
        console.log(t2-t1-31*24*60*60*1000)
        if(t2-t1>(31*24*60*60*1000)){
          _this.$message({
            showClose: true,
            message: '开始时间与结束时间不能大于31天',
            type: 'warning'
          });
          return
        }
        if ( FVehicleID!=undefined){
          this.loading=true;
          let action;
          let action1;
          let Guids;
          if(this.SystemID==2){
            action='QueryMessageAlarmCountByFAssetGUIDs';
            action1='QueryMessageAlarmByFAssetGUIDs';
            Guids='FAssetGUIDs'
          }else {
            action='QueryMessageAlarmCountByFVehicleGUIDs';
            action1='QueryMessageAlarmByFVehicleGUIDs';
            Guids='FVehicleGUIDs'
          }
          if(arguments.length==0){
            if(this.editableTabs.length!=0){
              this.editableTabs=[];
              if(this.activeName!="all"&&this.activeName!="first"&&this.activeName!="second"&&this.activeName!="third"){
                this.activeName='all';
              }
            }
            this.pageIndex0=1;
            this.pageIndex1=1;
            this.pageIndex2=1;
            this.pageIndex3=1;
            //汇总
            $.ajax({
              'url':  _this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":-1,"FPageSize":"'+_this.pageSize0+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
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
                  var fobj = data;
                  _this.total0 = FVehicleID.split(",").length;
                  _this.table0 = fobj.FObject.Table1;
                  if(_this.table0.length==0){
                    _this.$message({
                      showClose: true,
                      message: '_未查询到数据_',
                      type: 'warning'
                    });
                  }else {
                    $.each(_this.table0,function (index,obj) {
                      if(obj.FAlarmCount==null){
                        obj.FAlarmCount=0
                      }
                    })
                  }
                }
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
            //全部
            $.ajax({
              'url': _this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":-1,"FPageSize":"'+_this.pageSize1+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                console.log(data)
                var fobj = data;
                var Baidu= new baidu.baiduAPI();
                _this.total1 = fobj.FObject.Table[0].FTotalCount;
                _this.table1 = fobj.FObject.Table1;
                $.each(fobj.FObject.Table1, function (index, obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table1[index],'address',address);
                  });
                });
                $.each(_this.table1,function (index,obj) {
                  if(obj.FProcessContext==''){
                    obj.FProcessContext='--'
                  }
                  if (obj.FProcessStatus==0){
                    obj.FProcessStatus="_未处理_"
                  }else if(obj.FProcessStatus==1){
                    obj.FProcessStatus="_已处理_"
                  }
//                  obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                  obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  if(obj.FProcessDateTime){
                    obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                  }else {
                    obj.FProcessDateTime="--"
                  }
                });
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
            //未读
            $.ajax({
              'url': _this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":0,"FPageSize":"'+_this.pageSize3+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                var fobj = data;
                var Baidu= new baidu.baiduAPI();
                _this.total3 = fobj.FObject.Table[0].FTotalCount;
                _this.table3 = fobj.FObject.Table1;
                $.each(fobj.FObject.Table1, function (index, obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table3[index],'address',address);
                  });
                });
                $.each(_this.table3,function (index,obj) {
//                  obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                  obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '))
                });
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
            // 已读
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":1,"FPageSize":"'+_this.pageSize2+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                var fobj = data;
                var Baidu= new baidu.baiduAPI();
                _this.total2 = fobj.FObject.Table[0].FTotalCount;
                _this.table2 = fobj.FObject.Table1;
                $.each(fobj.FObject.Table1, function (index, obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table2[index],'address',address);
                  });
                });
                $.each(_this.table2,function (index,obj) {
                  if(obj.FProcessContext==''){
                    obj.FProcessContext='--'
                  }
//                  obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                  obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '))
                  if(obj.FProcessDateTime){
                    obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                  }else {
                    obj.FProcessDateTime="--"
                  }
                });
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize0"){
            $.ajax({
              'url': _this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":-1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                var fobj = data;
                _this.total0 =FVehicleID.split(",").length;
                _this.table0 = fobj.FObject.Table1;
                $.each(_this.table0,function (index,obj) {
                  if(obj.FAlarmCount==null){
                    obj.FAlarmCount=0
                  }
                })
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize1"){
            console.log("全部")
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":-1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                console.log(data)
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
                  var fobj = data;
                  var Baidu= new baidu.baiduAPI();
                  _this.total1 = fobj.FObject.Table[0].FTotalCount;
                  _this.table1 = fobj.FObject.Table1;
                  $.each(fobj.FObject.Table1, function (index, obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table1[index],'address',address);
                    });
                  });
                  $.each(_this.table1,function (index,obj) {
                    if(obj.FProcessContext==''){
                      obj.FProcessContext='--'
                    }
                    if (obj.FProcessStatus==0){
                      obj.FProcessStatus="_未处理_"
                    }else if(obj.FProcessStatus==1){
                      obj.FProcessStatus="_已处理_"
                    }
//                  obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    if(obj.FProcessDateTime){
                      obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                    }else {
                      obj.FProcessDateTime="--"
                    }
                  });
                }

                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize2"){
            console.log("已读")
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
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
                  var fobj = data;
                  var Baidu= new baidu.baiduAPI();
                  _this.total2 = fobj.FObject.Table[0].FTotalCount;
                  _this.table2 = fobj.FObject.Table1;
                  $.each(fobj.FObject.Table1, function (index, obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table2[index],'address',address);
                    });
                  });
                  $.each(_this.table2,function (index,obj) {
                    if(obj.FProcessContext==''){
                      obj.FProcessContext='--'
                    }
//                  obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '))
                    if(obj.FProcessDateTime){
                      obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                    }else {
                      obj.FProcessDateTime="--"
                    }
                  });
                }
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize3"){
            console.log("未读")
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":0,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
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
                  var fobj = data;
                  var Baidu= new baidu.baiduAPI();
                  _this.total3 = fobj.FObject.Table[0].FTotalCount;
                  _this.table3 = fobj.FObject.Table1;
                  $.each(fobj.FObject.Table1, function (index, obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table3[index],'address',address);
                    });
                  });
                  $.each(_this.table3,function (index,obj) {
//                  obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '))
                  });
                }

                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }
        }else {
          this.$message({
            showClose: true,
            message: '_请选择车辆_/_箱号_',
            type: 'warning'
          });
        }

      },
      //查看详情
      addTab: function (index, row) {
        this.objDetail=row;
        var _this = this;
        let newTabName = ++this.tabIndex + '';
        let table = "mytable" + newTabName;
        this.editableTabs.length = 0;
        var tabName ;
        if(this.SystemID==2){
          tabName = row.FAssetID;
        }else {
          tabName = row.FVehicleName;
        }
        this.editableTabs.push({
          title: tabName,
          name: newTabName,
          table: table,
        });
        this.activeName = newTabName;
        this.checkDetail();
      },
      //查看详情时请求数据
      checkDetail:function () {
        this.loading=true;
        var _this=this;
        var startTime;
        var endTime;
        var curpageIndex = this.pageIndex4;
        var curpageSize = this.pageSize4;
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        var date = new Date().getDate();
        var today = year + '-' + month + '-' + date;
        if (this.value4 == '') {
          startTime=this.parseUTC(today+' 00:00:00');
          endTime=this.parseUTC(today+' 23:59:59');
        } else {
          var time = this.value4.split(' - ');
          startTime=this.parseUTC(time[0]+' 00:00:00');
          endTime=this.parseUTC(time[1]+' 23:59:59');
        }
        let action1;
        let Guids;
        var FVehicleID ;
        if(this.SystemID==2){
          action1='QueryMessageAlarmByFAssetGUIDs';
          Guids='FAssetGUIDs';
          FVehicleID = this.objDetail.FAssetGUID;
        }else {
          action1='QueryMessageAlarmByFVehicleGUIDs';
          Guids='FVehicleGUIDs';
          FVehicleID = this.objDetail.FVehicleGUID;
        }
        $.ajax({
          'url':  _this.url,
          'cache': false,
          'async': true,
          'type': 'Post',
          'dataType': 'json',
          'contentType': 'application/json;charset=utf-8',
          'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"' + FVehicleID + '",' +
          '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"5","FState":-1,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
          success: function (data) {
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
              var fobj = data;
              var Baidu= new baidu.baiduAPI();
              _this.total4 = fobj.FObject.Table[0].FTotalCount;
              _this.mytable = fobj.FObject.Table1;
              $.each(fobj.FObject.Table1, function (index, obj) {
                var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                var geoc = Baidu.GetClientGeocoder();
                Baidu.Geoco_GetLocation(geoc, point, function (json) {
                  var address;
                  if(json.address==''){
                    address='--'
                  }else {
                    address = json.address;
                  }
                  _this.$set(_this.mytable[index],'address',address);
                });
              });
              $.each(_this.mytable,function (index,obj) {
                if (obj.FProcessStatus==0){
                  obj.FProcessStatus="_未处理_"
                }else if(obj.FProcessStatus==1){
                  obj.FProcessStatus="_已处理_"
                }
//              obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '))
                if(obj.FProcessDateTime){
                  obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                }else {
                  obj.FProcessDateTime="--"
                }
              });
            }

            _this.loading=false
          },
          error: function () {
            console.log("请求失败")
          }
        });
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
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        this.pageIndex4=1;
        this.pageSize4
      },
      setToRead:function () {
        var _this=this;
        var str = ''
        var temp=[]
        this.multipleSelection.forEach(obj=> {
          if(obj.FProcessStatus=="_未处理_"||obj.FProcessStatus==0){
            temp.push(obj.FGUID);
          }
        });
        str=temp.join(',');
        if(str!=''){
          $.ajax({
            'url': '/web/Common/Common_Message',
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"UpdateMessageAlarmStatus","FGUIDs":"'+ str + '","FState":"1","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success:function (json) {
              if(json.Result==200){
                _this.doQuery();
                _this.$message({
                  showClose: true,
                  message: '_处理成功_',
                  type: 'success'
                });
              }else if(json.Result==104) {
                _this.$message({
                  showClose: true,
                  message: '_登录超时_,_五秒后跳转到登录页面_',
                  type: 'warning'
                });
                setTimeout(function(){
                  _this.$store.commit("goLogin");
                },5000)
                return
              }
            },
            error:function () {
              console.log("请求失败")
            }
          })
        }
      },*/
      position: function (index, row) {
        let _this=this;
        this.FVehicleName=row.FVehicleName;
        this.FStartDateTime=row.FStartDateTime;
        this.address=row.starAdress;
        this.FDriverName=row.FDriverName;
        this.FKeepSeconds=this.formatSeconds(row.FKeepSeconds);
//        let FVehicleName=row.FVehicleName;
//        let address=row.address;
//        let content=`<div><p>车牌号：${FVehicleName}</p><p>地址:${address}</p></div>`;
        if(row.FStartLongitude!=0&&row.FStartLatitude!=0){
          $(".mymodal").css('visibility', 'visible');
          var point = _this.parsePointBD(new BMap.Point(row.FStartLongitude,row.FStartLatitude));
          this.$refs.map.setMark(point);
        }else {
          _this.$message({
            showClose: true,
            message: '_暂无位置信息_',
            type: 'warning'
          });
        }

      },
     /* closeMymodal:function () {
        $(".mymodal").css('visibility','hidden')
        this.$refs.map.initMap();
      },*/
      handleCommand(command) {
        $("#myinput").val(command)
      },
      //点击处理时，存取要处理的对象
      clickHandleBtn:function (row) {
        this.handleObj=row
      },
      //处理
     /* handle: function () {
        var _this=this;
        var handleContent = $("#myinput").val();
        var FVehicleID = this.handleObj.FGUID;
        if (handleContent==''){
          this.$message({
            showClose: true,
            message: '_请输入处理方式_',
            type: 'warning'
          });
        }else {
          $.ajax({
            'url': '/web/Common/Common_Message',
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"UpdateMessageAlarmByFMessageGUID",' +
            '"FT_Message":{"FMessageGUID":"' + FVehicleID + '","FProcessStatus":"1","FProcessContext":"' + handleContent + '"},"FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (json) {
              if(json.Result==200){
                _this.doQuery();
                _this.clearText()
                _this.$message({
                  showClose: true,
                  message: '_处理成功_',
                  type: 'success'
                });
              }else if(json.Result==104) {
                _this.$message({
                  showClose: true,
                  message: '_登录超时_,_五秒后跳转到登录页面_',
                  type: 'warning'
                });
                setTimeout(function(){
                  _this.$store.commit("goLogin");
                },5000)
                return
              }
            },
            error: function () {
              console.log("请求失败")
            }
          });
        }
      },*/
      clearText(){
        $("#myinput").val("")
      }
    },
    watch: {
      screenHeight () {
        this.adjustPage();
      }
    },
    components: {
      baiduMap,
      VehicalSelectDialog,
      // lockSelectDialog
    }
  }
</script>
<style scoped>
  .block {
    float:left;
    margin-left:20px;

  }

  .block:nth-child(1) {
    margin-left:0;
  }


  .search-input-wrap {
    float:left;
    margin:9px 0 0 10px;
  }

  .search-input {
    float:left;
    width:120px;
    height:28px;
    border:1px solid #e6e6e6;
    line-height: 28px;
  }

  .operatExp {
    float:left;
    font-size:12px;
  }

  .get-carList-dialog {
    float:left;
    display:flex;
    justify-content:center;
    align-items:center;
    width:28px;
    height:28px;
    border:1px solid #e6e6e6;
    border-right:none;
    text-align:center;
  }
  /*按钮样式 可用于全局 也可单独用在组件，主要看以后表格内的按钮怎么命名*/
  .search {
    background-color:#005fc6;
  }
  .reset {
    background-color:#547ca9;
  }
  .export {
    background-color:#4aae58;
    padding:8px 16px;
  }
  .read {
    background-color:#f39b2a;
    padding:8px 16px;
  }

  /*fontawesome 里面字体图标的样式*/
  .fa-share-square-o {
    margin-right:3px;
  }
  .fa-envelope-open-o {
    margin-right:3px;
  }
  /*不能全局可能有些报表内部会用到饿了么的按钮组件*/
  .el-button {
    border:none;
    border-radius:0;
    padding:8px 26px;
  }
  .mybtn{
    margin: 0px;
    padding: 0px;
    height: 28px;
    border: none ;
    background: none;
  }
  .mapModal{
    position: absolute;
    height:180px;
    width:350px;
    margin-top:-180px;
    z-index: 10;
    right: 0px;
    background: white;
    border: 1px solid #cccccc
  }
  .mapModal p{
    font-size: 12px;
    margin-bottom: 6px;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .mapModal p span{
    font-weight: bold;
  }

</style>

