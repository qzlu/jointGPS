<template>
	<section>
		<div class="modal fade" id="modal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content" >
					<div style="height: 20px;width: 20px;position: relative;padding: 0px;left: 93%">
						<button type="button" class="close mybtn" data-dismiss="modal" aria-hidden="true" style="background: white" @click="clearText()">&times;</button>
					</div>
					<div class="modal-body" style="height: 100%">
						<textarea style="height:190px;width:100%;text-indent: 2em;padding: 4px" placeholder="_输入处理意见_" id="myinput"></textarea>
					</div>
					<div class="modal-footer" style="margin-right: 10px">
						<div class="btn btn-primary btn-sm" style="height: 30px;padding: 0px">
							<button type="button" class="btn  btn-xs mybtn" data-dismiss="modal" @click="handle(0,7)" style="width: 40px">_提交_</button>
							<el-dropdown trigger="click" @command="handleCommand">
								<el-button type="primary" size="mini" style="width: 20px;" class="mybtn">
									<i class="el-icon-caret-bottom el-icon--right"></i>
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
          <p><span>_开始时间_：</span>{{FStartDateTime}}</p>
          <p><span>_结束时间_：</span>{{FEndDateTime}}</p>
          <p><span>_持续时长_：</span>{{FKeepSeconds}}</p>
          <p :title="startAdress"><nobr><span>_开始位置_：</span>{{startAdress}}</nobr></p>
          <p :title="endAdress"><nobr><span>_结束位置_：</span>{{endAdress}}</nobr></p>
				</div>
			</div>
		</div><!-- /.modal-content -->
		<vehical-select-dialog v-on:child="get" ref="vehicle"></vehical-select-dialog>
		<div id="operate_wrapper">
			<div class="box-header">
				<div class="block">
					<span class="operatExp" v-if="SystemID===1||SystemID===4">_选择车辆_</span>
					<span class="operatExp" v-else>_选择设备_</span>
					<div class="search-input-wrap" data-toggle="modal" data-target="#modal"><!---->
						<a href="javascript:;" class="get-carList-dialog">
							<i class="img-icon icon-carList-dialog"  v-if="SystemID===1||SystemID===4"></i>
							<i class="fa fa-lock" v-else style="font-size: 18px;"></i>
						</a>
						<input type="text" class="search-input" readonly="readonly" >
					</div>
				</div>
				<div class="block">
					<!-- <el-select v-model="value" placeholder="请选择" class="searchType" size="small" @change="searchType">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select> -->
					<span class="operatExp">_选择时间_</span>
					<el-date-picker
						size="small"
						v-if="value=='_选择时间_'"
						v-model="value3"
						:clearable="false"
						type="daterange"
						@change="getTime"
						:picker-options="pickerOptions2"
						placeholder="_选择时间范围_">
					</el-date-picker>
					<input type="number" v-if="value=='_最近次数_'" class="" min="1" name="points">
				</div>
				<div class="btnList">
					<el-button type="primary" class="search" @click="queryCount(0,7)">_查询_</el-button>
					<el-button type="primary" class="reset" @click="reset()">_重置_</el-button>
					<el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>_导出文件_</el-button>
					<el-button type="primary" class="read" @click="setToRead(0,7)"><i class="fa fa-envelope-open-o"></i>_设为已读_</el-button>
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
							prop="RowNo"
							label="_序号_"
							width="80">
						</el-table-column>
						<el-table-column
							prop=""
							width="120"
							label="_操作_">
							<template scope="scope">
								<a href="javascript:" @click="addTab(scope.$index,scope.row,7)" v-if="scope.row.FAlarmCount!=0">_详情_</a>
                <a href="javascript:" v-if="scope.row.FAlarmCount==0" style="cursor: not-allowed;color:#cccccc">_详情_</a>
							</template>
						</el-table-column>
						<el-table-column
							prop="FShortName"
							label="_公司简称_"
							width="200">
						</el-table-column>
						<el-table-column
								prop="FVehicleName"
								sortable
								label="_车牌号_"
								width="100">
						</el-table-column>
						<el-table-column
								prop="FAssetID"
								sortable
								label="_终端号_"
								width="100">
						</el-table-column>
						<el-table-column
							prop="FAlarmCount"
							sortable
							label="_异常次数_"
							width="120">
						</el-table-column>
						<el-table-column
							prop=""
							label=""
							align="center"
						>
						</el-table-column>
					</el-table>
				</div>
				<div id="pagination" class="pagination">
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
						ref="multipleTable"
						v-loading="loading"
						element-loading-text="_拼命加载中_"
						empty-text="_暂无数据_"
						:data="table1"
						stripe
						@selection-change="handleSelectionChange"
						:height="table_height"
						align="left"
						style="width: 100%">
						<el-table-column
							type="selection"
              				:selectable="check"
							width="55">
						</el-table-column>
						<el-table-column
							label="_序号_"
							prop="RowNo"
							width="80">
						</el-table-column>
						<el-table-column
							prop="FProcessStatus"
							show-overflow-tooltip
							label="_状态_"
							width="80">
						</el-table-column>
						<el-table-column
							prop=""
							width="130"
							label="_操作_">
							<template scope="scope">
								<a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1" v-if="scope.row.FProcessStatus=='_未处理_'" >_处理_</a>
								<a href="javascript:"style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看位置_</a>
							</template>
						</el-table-column>
						<el-table-column
							prop="FShortName"
							label="_公司简称_"
							width="120">
						</el-table-column>
						<el-table-column
							prop="FVehicleName"
							sortable
							label="_车牌号_"
							width="100">
						</el-table-column>
					<!--	<el-table-column
							prop=""
							label="_异常类型_"
							width="120">
						</el-table-column>-->
            <el-table-column
              prop=""
              show-overflow-tooltip
              label="_描述_"
              width="260">
              <template scope="scope">
                <ul>
                  <li class="humiture" v-for="(item,index) in table1[scope.$index].FDescribeJSON" style="margin-right: 10px">
                    <span v-if="item.I">_高温报警_</span>
                    <span v-else="">_低温报警_</span>
                    <span>_温度_:{{item.T.toFixed(1)}}°C</span>
                  </li>
                </ul>
              </template>
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
							label="_开始时间_"
							width="200">
						</el-table-column>
            <el-table-column
              prop="FEndDateTime"
              sortable
              label="_结束时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="starAdress"
              show-overflow-tooltip
              label="_开始位置_"
              width="240">
            </el-table-column>
            <el-table-column
              prop="endAdress"
              show-overflow-tooltip
              label="_结束位置_"
              width="240">
            </el-table-column>
						<el-table-column
							prop=""
							label=""
							align="center"
						>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination">
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
						stripe
						:height="table_height"
						align="left"
						style="width: 100%">
						<el-table-column
							prop="RowNo"
							label="_序号_"
							width="80">
						</el-table-column>
						<el-table-column
							prop=""
							width="120"
							label="_操作_">
							<template scope="scope">
								<a href="javascript:" style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看位置_</a>
							</template>
						</el-table-column>
						<el-table-column
							prop="FShortName"
							label="_公司简称_"
							width="120">
						</el-table-column>
						<el-table-column
							prop="FVehicleName"
							sortable
							label="_车牌号_"
							width="100">
						</el-table-column>
					<!--	<el-table-column
							prop=""
							label="_异常类型_"
							width="120">
						</el-table-column>-->
            <el-table-column
              prop=""
              show-overflow-tooltip
              label="_描述_"
              width="260">
              <template scope="scope">
                <ul>
                  <li class="humiture" v-for="(item,index) in table2[scope.$index].FDescribeJSON" style="margin-right: 10px">
                    <!--<span>ID:{{item.ID}}</span>-->
                    <span v-if="item.I">_高温报警_</span>
                    <span v-else="">_低温报警_</span>
                    <span>_温度_:{{item.T.toFixed(1)}}°C</span>
                  </li>
                </ul>
              </template>
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
              label="_开始时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FEndDateTime"
              sortable
              label="_结束时间_"
              width="200">
            </el-table-column>
			<el-table-column
			  prop="FKeepSeconds"
			  sortable
			  :sort-method="sortMethod"
			  :formatter="formatter"
			  label="_持续时长_"
			  width="120">
			</el-table-column>
            <el-table-column
              prop="starAdress"
              show-overflow-tooltip
              label="_开始位置_"
              width="240">
            </el-table-column>
            <el-table-column
              prop="endAdress"
              show-overflow-tooltip
              label="_结束位置_"
              width="240">
            </el-table-column>
						<el-table-column
							prop=""
							label=""
							align="center"
						>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination">
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
						ref="multipleTable"
						v-loading="loading"
						element-loading-text="拼命加载中"
						empty-text="_暂无数据_"
						:data="table3"
						stripe
						:height="table_height"
						align="left"
						@selection-change="handleSelectionChange"
						style="width: 100%">
						<el-table-column
							type="selection"
							width="55">
						</el-table-column>
						<el-table-column
							prop="RowNo"
							label="_序号_"
							width="80">
						</el-table-column>
						<el-table-column
							prop=""
							width="130"
							label="_操作_">
							<template scope="scope">
								<a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1">_处理_</a>
								<a href="javascript:" style="color: #4aae58"  @click="showHistory(scope.$index,scope.row)">_查看位置_</a>
							</template>
						</el-table-column>
						<el-table-column
							prop="FShortName"
							label="_公司简称_"
							width="120">
						</el-table-column>
						<el-table-column
							prop="FVehicleName"
							sortable
							label="_车牌号_"
							width="100">
						</el-table-column>
					<!--	<el-table-column
							prop=""
							label="_异常类型_"
							width="120">
						</el-table-column>-->
            <el-table-column
              prop=""
              show-overflow-tooltip
              label="_描述_"
              width="260">
              <template scope="scope">
                <ul>
                  <li class="humiture" v-for="(item,index) in table3[scope.$index].FDescribeJSON" style="margin-right: 10px">
                    <!--<span>ID:{{item.ID}}</span>-->
                    <span v-if="item.I">_高温报警_</span>
                    <span v-else="">_低温报警_</span>
                    <span>_温度_:{{item.T.toFixed(1)}}°C</span>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column
              prop="FStartDateTime"
              sortable
              label="_开始时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FEndDateTime"
              sortable
              label="_结束时间_"
              width="200">
            </el-table-column>
			<el-table-column
			  prop="FKeepSeconds"
			  sortable
			  :sort-method="sortMethod"
			  :formatter="formatter"
			  label="_持续时长_"
			  width="120">
			</el-table-column>
            <el-table-column
              prop="starAdress"
              show-overflow-tooltip
              label="_开始位置_"
              width="240">
            </el-table-column>
            <el-table-column
              prop="endAdress"
              show-overflow-tooltip
              label="_结束位置_"
              width="240">
            </el-table-column>
						<el-table-column
							prop=""
							label=""
							align="center"
						>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination">
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
				:name="item.name">
				<div class="el_table_wrap" >
					<el-table
						ref="multipleTable"
						v-loading="loading"
						element-loading-text="拼命加载中"
						empty-text="_暂无数据_"
						:data="mytable"
						stripe
						@selection-change="handleSelectionChange"
						:height="table_height"
						align="left"
						style="width: 100%">
						<el-table-column
							type="selection"
              :selectable="check"
							width="55">
						</el-table-column>
						<el-table-column
							prop="RowNo"
							label="_序号_"
							width="80">
						</el-table-column>
						<el-table-column
							prop="FProcessStatus"
							show-overflow-tooltip
							label="_状态_"
							width="80">
						</el-table-column>
						<el-table-column
							prop=""
							width="130"
							label="_操作_">
							<template scope="scope">
								<a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1" v-if="scope.row.FProcessStatus=='_未处理_'" >_处理_</a>
								<a href="javascript:"style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看位置_</a>
							</template>
						</el-table-column>
						<el-table-column
							prop="FShortName"
							label="_公司简称_"
							width="120">
						</el-table-column>
					<!--	<el-table-column
							prop="FDataType"
							label="_异常类型_"
							width="120">
						</el-table-column>-->
            <el-table-column
              prop=""
              show-overflow-tooltip
              label="_描述_"
              width="260">
              <template scope="scope">
                <ul>
                  <li class="humiture" v-for="(item,index) in mytable[scope.$index].FDescribeJSON" style="margin-right: 10px">
                    <!--<span>ID:{{item.ID}}</span>-->
                    <span v-if="item.I">_高温报警_</span>
                    <span v-else="">_低温报警_</span>
                    <span>_温度_:{{item.T.toFixed(1)}}°C</span>
                  </li>
                </ul>
              </template>
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
              label="_开始时间_"
              width="200">
            </el-table-column>
            <el-table-column
              prop="FEndDateTime"
              sortable
              label="_结束时间_"
              width="200">
            </el-table-column>
			<el-table-column
			  prop="FKeepSeconds"
			  sortable
			  :sort-method="sortMethod"
			  :formatter="formatter"
			  label="_持续时长_"
			  width="120">
			</el-table-column>
            <el-table-column
              prop="starAdress"
              show-overflow-tooltip
              label="_开始位置_"
              width="240">
            </el-table-column>
            <el-table-column
              prop="endAdress"
              show-overflow-tooltip
              label="_结束位置_"
              width="240">
            </el-table-column>
						<el-table-column
							prop=""
							label=""
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
	import baiduMap from 'components/Common/baidu_map.vue'
	import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
	import baidu  from 'js/GIS/Baidu/BaiduAPI'
	export default{
		data(){
			return {
				loading: false,
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
						text: '_最近一周_',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '_最近一个月_',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				options: [{
					value: '_选择时间_',
					label: '_选择时间_'
				}, {
					value: '_最近次数_',
					label: '_最近次数_'
				}],
				value: "_选择时间_",
				value3: [new Date(), new Date()],
				value4:'',
				table_height: null,
				table0:[],
				table1:[],
				table2:[],
				table3:[],
				table4:[],
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
        url:'/web/Lock/Lock_Message'
			}
		},
		props: {
			screenHeight: Number
		},
		mounted(){
			//加载地图
			this.$refs.map.initMap();
			$("#map-wrapper").height(570);
			setTimeout(() => {
				this.adjustPage();

		    },100);
		},
		methods: {
			formatter(row,column,cellValue){
				let keepTime = moment(row.FEndDateTime).unix()-moment(row.FStartDateTime).unix();
				return this.formatSeconds(keepTime);
			},
			searchType:function (val) {
				console.log(val);
				this.value=val;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSizeChange0(val){
				this.pageSize0 = val;
					this.queryCount(1,7)

			},
			handleSizeChange1(val) {
				this.pageSize1 = val;
        this.queryCount(2,7)
			},
			handleSizeChange2(val){
				this.pageSize2 = val;
        this.queryCount(3,7)
			},
			handleSizeChange3(val){
				this.pageSize3 = val;
        this.queryCount(4,7)
			},
			handleSizeChange4(val){
				this.pageSize4 = val;
					this.checkDetail(7)
			},
			handleCurrentChange0(val){
				this.pageIndex0 = val;
        this.queryCount(1,7)
			},
			handleCurrentChange1(val) {
				this.pageIndex1 = val;
        this.queryCount(2,7)
			},
			handleCurrentChange2(val){
				this.pageIndex2 = val;
        this.queryCount(3,7)
			},
			handleCurrentChange3(val){
				this.pageIndex3 = val;
        this.queryCount(4,7)
			},
			handleCurrentChange4(val){
				this.pageIndex4 = val;
				this.checkDetail(7);
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true)-30;
			},
			get: function (data) {
        $('.search-input').val("_已选_"+data[0].length+"_台_");
				$('.search-input').attr('title', data[0])
				$('.search-input').attr('fguid', data[1])
			},
			getTime: function (value) {
				return this.value4 = value;
			},
			/*doQuery: function (pageSize, pageIndex) {
				var curpageIndex;
				var curpageSize;
				var _this = this;
				var FVehicleID = $(".search-input").attr("fguid");
				var startTime;
				var endTime;
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
				if (arguments.length == 0) {
					curpageIndex = 1;
					curpageSize = 20
				} else {
					curpageIndex = parseInt(this[pageIndex]);
					curpageSize = parseInt(this[pageSize]);
				}
        let d1=startTime.substr(0,10).split("-")
        let t1=new Date(d1[0],d1[1]-1,d1[2]).getTime();
        let d2=endTime.substr(0,10).split("-")
        let t2=new Date(d2[0],d2[1]-1,d2[2]).getTime();
        if(t2-t1>(31*24*60*60*1000)){
          _this.$message({
            showClose: true,
            message: '开始时间与结束时间不能大于31天',
            type: 'warning'
          });
          return
        }
				if (FVehicleID != undefined) {
					this.loading=true;
					if (arguments.length == 0) {
            if(this.editableTabs.length!=0){
              this.editableTabs=[];
              if(this.activeName!=="all"&&this.activeName!=="first"&&this.activeName!=="second"&&this.activeName!=="third"){
                this.activeName='all';
              }
            }
            this.pageIndex0=1;
            this.pageIndex1=1;
            this.pageIndex2=1;
            this.pageIndex3=1;
            this.tabel0=[];
            this.tabel1=[];
            this.tabel2=[];
            this.tabel3=[];
						//汇总
						$.ajax({
							'url': '/web/Common/Common_Message',
							'cache': false,
							'async': true,
							'type': 'Post',
							'dataType': 'json',
							'contentType': 'application/json;charset=utf-8',
							'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmCountByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +'"FStartTime":"'+startTime+'","FEndTime":"'+endTime+'","FDataType":"7","FState":-1,"FPageSize":"'+curpageSize+'" ,"FPageIndex":"'+curpageIndex+'","FSystemType":3,"FVersion":"1.0.0"}',
							success: function (data) {
								console.log("汇总",data);
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

								_this.loading=false;
							},
							error: function () {
								console.log("请求失败")
							}
						});
						//全部
						$.ajax({
							'url': '/web/Common/Common_Message',
							'cache': false,
							'async': true,
							'type': 'Post',
							'dataType': 'json',
							'contentType': 'application/json;charset=utf-8',
							'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
							'"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"7","FState":-1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":3,"FVersion":"1.0.0"}',
							success: function (data) {
								console.log("全部",data);
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
                  $.each(_this.table1,function (index,obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                    var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table1[index],'starAdress',address);
                    });
                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table1[index],'endAdress',address);
                    });
                    obj.FDescribeJSON=$.parseJSON(obj.FDescribeJSON);
                    if(obj.FProcessContext==''||obj.FProcessContext==null){
                      obj.FProcessContext='--'
                    }
                    if (obj.FProcessStatus==0){
                      obj.FProcessStatus="_未处理_"
                    }else if(obj.FProcessStatus==1){
                      obj.FProcessStatus="_已处理_"
                    }
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                    if(obj.FProcessDateTime){
                      obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                    }else {
                      obj.FProcessDateTime="--"
                    }
                  });
                }

							},
							error: function () {
								console.log("请求失败")
							}
						});
						//未读
						$.ajax({
							'url': '/web/Common/Common_Message',
							'cache': false,
							'async': true,
							'type': 'Post',
							'dataType': 'json',
							'contentType': 'application/json;charset=utf-8',
							'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
							'"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"7","FState":0,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":3,"FVersion":"1.0.0"}',
							success: function (data) {
								console.log("未读",data);

								var fobj = data;
								var Baidu= new baidu.baiduAPI();
								_this.total3 = fobj.FObject.Table[0].FTotalCount;
								_this.table3 = fobj.FObject.Table1;
								$.each(_this.table3,function (index,obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                  var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table3[index],'starAdress',address);
                  });
                  Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table3[index],'endAdress',address);
                  });
                  obj.FDescribeJSON=$.parseJSON(obj.FDescribeJSON);
									obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '))
								});
							},
							error: function () {
								console.log("请求失败")
							}
						});
						// 已读
						$.ajax({
							'url': '/web/Common/Common_Message',
							'cache': false,
							'async': true,
							'type': 'Post',
							'dataType': 'json',
							'contentType': 'application/json;charset=utf-8',
							'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
							'"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"7","FState":1,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":3,"FVersion":"1.0.0"}',
							success: function (data) {
								console.log("已读",data);
								var fobj = data;
								var Baidu= new baidu.baiduAPI();
								_this.total2 = fobj.FObject.Table[0].FTotalCount;
								_this.table2 = fobj.FObject.Table1;
								$.each(_this.table2,function (index,obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                  var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table2[index],'starAdress',address);
                  });
                  Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table2[index],'endAdress',address);
                  });
                  obj.FDescribeJSON=$.parseJSON(obj.FDescribeJSON);
									if(obj.FProcessContext==''||obj.FProcessContext==null){
										obj.FProcessContext='--'
									}
									obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '))
                  if(obj.FProcessDateTime){
                    obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                  }else {
                    obj.FProcessDateTime="--"
                  }
								});
							},
							error: function () {
								console.log("请求失败")
							}
						});
					} else if (arguments[0] == "pageSize0") {
						$.ajax({
							'url': '/web/Common/Common_Message',
							'cache': false,
							'async': true,
							'type': 'Post',
							'dataType': 'json',
							'contentType': 'application/json;charset=utf-8',
							'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmCountByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +'"FStartTime":"'+startTime+'","FEndTime":"'+endTime+'","FDataType":"7","FState":-1,"FPageSize":"'+curpageSize+'" ,"FPageIndex":"'+curpageIndex+'","FSystemType":3,"FVersion":"1.0.0"}',
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
                  _this.total0 = FVehicleID.split(",").length;
                  _this.table0 = fobj.FObject.Table1;
                  $.each(_this.table0,function (index,obj) {
                    if(obj.FAlarmCount==null){
                      obj.FAlarmCount=0
                    }
                  })
                }

								_this.loading=false;
							},
							error: function () {
								console.log("请求失败")
							}
						});
					} else if (arguments[0] == "pageSize1") {
            $.ajax({
              'url': '/web/Common/Common_Message',
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"7","FState":-1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":3,"FVersion":"1.0.0"}',
              success: function (data) {
                console.log("全部",data);
                _this.loading=false;
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
                  $.each(_this.table1,function (index,obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                    var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table1[index],'starAdress',address);
                    });
                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table1[index],'endAdress',address);
                    });
                    obj.FDescribeJSON=$.parseJSON(obj.FDescribeJSON);
                    if(obj.FProcessContext==''||obj.FProcessContext==null){
                      obj.FProcessContext='--'
                    }
                    if (obj.FProcessStatus==0){
                      obj.FProcessStatus="_未处理_"
                    }else if(obj.FProcessStatus==1){
                      obj.FProcessStatus="_已处理_"
                    }
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                    if(obj.FProcessDateTime){
                      obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                    }else {
                      obj.FProcessDateTime="--"
                    }
                  });
                }

              },
              error: function () {
                console.log("请求失败")
              }
            });
					} else if (arguments[0] == "pageSize2") {
						console.log("已读")
            $.ajax({
              'url': '/web/Common/Common_Message',
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"7","FState":1,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":3,"FVersion":"1.0.0"}',
              success: function (data) {
                console.log("已读",data);
                _this.loading=false;
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
                  $.each(_this.table2,function (index,obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                    var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table2[index],'starAdress',address);
                    });
                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table2[index],'endAdress',address);
                    });
                    obj.FDescribeJSON=$.parseJSON(obj.FDescribeJSON);
                    if(obj.FProcessContext==''||obj.FProcessContext==null){
                      obj.FProcessContext='--'
                    }
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '))
                    if(obj.FProcessDateTime){
                      obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                    }else {
                      obj.FProcessDateTime="--"
                    }
                  });
                }
              },
              error: function () {
                console.log("请求失败")
              }
            });
					} else if (arguments[0] == "pageSize3") {
						console.log("未读")
            $.ajax({
              'url': '/web/Common/Common_Message',
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"7","FState":0,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":3,"FVersion":"1.0.0"}',
              success: function (data) {
                console.log("未读",data);
                _this.loading=false;
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
                  $.each(_this.table3,function (index,obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                    var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table3[index],'starAdress',address);
                    });
                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table3[index],'endAdress',address);
                    });
                    obj.FDescribeJSON=$.parseJSON(obj.FDescribeJSON);
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '))
                  });
                }
              },
              error: function () {
                console.log("请求失败")
              }
            });
					}
				} else {
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
				var tabName = row.FVehicleName;
				this.editableTabs.length = 0;
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
				var FVehicleID = this.objDetail.FVehicleGUID;
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
				;
				$.ajax({
					'url': '/web/Common/Common_Message',
					'cache': false,
					'async': true,
					'type': 'Post',
					'dataType': 'json',
					'contentType': 'application/json;charset=utf-8',
					'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageAlarmByFVehicleGUIDs","FVehicleGUIDs":"' + FVehicleID + '",' +
					'"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"7","FState":-1,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":3,"FVersion":"1.0.0"}',
					success: function (data) {
						console.log(data)
            var fobj = data;
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
              var Baidu= new baidu.baiduAPI();
              _this.total4 = fobj.FObject.Table[0].FTotalCount;
              _this.mytable = fobj.FObject.Table1;
              $.each(_this.mytable,function (index,obj) {
                var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                var geoc = Baidu.GetClientGeocoder();
                Baidu.Geoco_GetLocation(geoc, point, function (json) {
                  var address;
                  if(json.address==''){
                    address='--'
                  }else {
                    address = json.address;
                  }
                  _this.$set(_this.mytable[index],'starAdress',address);
                });
                Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                  var address;
                  if(json.address==''){
                    address='--'
                  }else {
                    address = json.address;
                  }
                  _this.$set(_this.mytable[index],'endAdress',address);
                });
                obj.FDescribeJSON=$.parseJSON(obj.FDescribeJSON);
                if (obj.FProcessStatus==0){
                  obj.FProcessStatus="_未处理_"
                }else if(obj.FProcessStatus==1){
                  obj.FProcessStatus="_已处理_"
                }
                obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
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
			},
			//设为已读
			setToRead: function () {
				var _this=this;
				var str = ''
				var temp=[]
				this.multipleSelection.forEach(obj=>{
					obj.FProcessStatus="_已处理_";
				console.log(obj);
				temp.push(obj.FGUID)
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
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"UpdateMessageAlarmStatus","FGUIDs":"' + str + '","FState":"1","FSystemType":3,"FVersion":"1.0.0"}',
            success: function (json) {
              console.log(json);
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
            error: function () {
              console.log("请求失败")
            }
          })
        }


			},
			closeMymodal: function () {
				$(".mymodal").css('visibility', 'hidden')
			},*/
			handleCommand(command) {
				$("#myinput").val(command)
			},
			//点击处理时，存取要处理的对象
			clickHandleBtn:function (row) {
				this.handleObj=row;
			},
			//处理
		/*	handle: function () {
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
						'"FT_Message":{"FMessageGUID":"' + FVehicleID + '","FProcessStatus":"1","FProcessContext":"' + handleContent + '"},"FSystemType":3,"FVersion":"1.0.0"}',
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
        $("#myinput").val("");
      }
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			}
		},
		computed:{
			SystemID:{//系统ID
				get(){
					return this.$store.state.choiceSystemID;
				}
			}
		},
		components: {
			baiduMap,
			VehicalSelectDialog
		}
	}
</script>
<style scoped>
  /*按钮样式 可用于全局 也可单独用在组件，主要看以后表格内的按钮怎么命名*/
  .search {
    background-color:#005fc6!important;
  }
  .reset {
    background-color:#547ca9!important;
  }
  .export {
    background-color:#4aae58!important;
    padding:8px 16px;
  }
  .read {
    background-color:#f39b2a!important;
    padding:8px 16px;
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
  .mybtn{
    margin: 0px;
    padding: 0px;
    height: 28px;
    border: none ;
    background: none;
  }
</style>
