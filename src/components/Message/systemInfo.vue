<!-- overtime_record.vue -->
<template>
	<section>
		<div id="operate_wrapper">
			<div class='box-header'>
				<div class="block">
					<!--<span class="operatExp">_选择时间_</span>
					&lt;!&ndash;format="yyyy/MM/dd HH:mm:ss"&ndash;&gt;
					<el-date-picker
						size="small"
						v-model="queryDate"
						type="datetimerange"
						:clearable="false"
						placeholder="选择时间范围">
					</el-date-picker>-->
				</div>
				<div class="btnList">
					<!--<el-button type="primary" class="search" @click="doQueryByAll()">_查询_</el-button>
					<el-button type="primary" class="reset">_重置_</el-button>-->
					<el-button type="primary" class="read" @click="changeState"><i class="fa fa-envelope-open-o"></i>_设为已读_
					</el-button>
					<!--<el-button type="primary" class="delete"><i class="fa fa-trash"></i>_删除_</el-button>-->
				</div>
			</div>
			<el-tabs v-model="activeName" @tab-click="switchoverTable" @tab-remove="removeTab">
				<el-tab-pane label="_全部_" name="first"></el-tab-pane>
				<el-tab-pane label="_已读_" name="second"></el-tab-pane>
				<el-tab-pane label="_未读_" name="third"></el-tab-pane>
				<el-tab-pane
					v-for="(item, index) in editableTabs"
					:key="item.name"
					closable
					:label="item.title"
					:name="item.name"
				></el-tab-pane>
			</el-tabs>
		</div>
		<div class="el_table_wrap" id="el_table_wrap">
			<el-table :data="allSystemInfo" stripe style="width: 100%" :height="table_height" v-if="show_allSystemInfo"
					  @select="selectRow"
					  @select-all="selectAll"
					  ref="setAllSystemInfo">
				<el-table-column
					type="selection"
					width="40"
					:selectable="disabledRow">
				</el-table-column>
				<el-table-column type="index" tooltip-effect="dark" align="center" label="_序号_" width="80">
				</el-table-column>
				<el-table-column prop="FContext" label="_内容_" show-overflow-tooltip min-width="250">
					<!--<template scope="scope">
						<a href="javascript:;" @click="addTab(scope.row.FContext,scope.row.FGUID,scope.row.FState)">{{scope.row.FContext}}</a>
					</template>-->
				</el-table-column>
				<el-table-column prop="FCreateDateTime" label="_时间_" sortable min-width="120">
				</el-table-column>
				<el-table-column prop="FStateStr" align="center" label="_状态_" min-width="120">
				</el-table-column>
			</el-table>
			<el-table :data="readSystemInfo" stripe style="width: 100%" :height="table_height"
					  v-if="show_readSystemInfo">
				<el-table-column
					type="selection"
					width="40">
				</el-table-column>
				<el-table-column type="index" tooltip-effect="dark" align="center" label="_序号_" width="80">
				</el-table-column>
				<el-table-column prop="FContext" label="_内容_" show-overflow-tooltip min-width="250">
					<!--<template scope="scope">
						<a href="javascript:;" @click="addTab(scope.row.FContext,scope.row.FGUID,scope.row.FState)">{{scope.row.FContext}}</a>
					</template>-->
				</el-table-column>
				<el-table-column prop="FCreateDateTime" label="_时间_" sortable min-width="120">
				</el-table-column>
				<el-table-column prop="FStateStr" align="center" label="_状态_" min-width="120">
				</el-table-column>
			</el-table>
			<el-table :data="noReadSystemInfo" stripe style="width: 100%" :height="table_height"
					  v-if="show_noReadSystemInfo"
					  ref="setNoReadSystemInfo">
				<el-table-column
					type="selection"
					width="40">
				</el-table-column>
				<el-table-column type="index" tooltip-effect="dark" align="center" label="_序号_" width="80">
				</el-table-column>
				<el-table-column prop="FContext" label="_内容_" show-overflow-tooltip min-width="250">
					<!--<template scope="scope">
						<a href="javascript:;" @click="addTab(scope.row.FContext,scope.row.FGUID,scope.row.FState)">{{scope.row.FContext}}</a>
					</template>-->
				</el-table-column>
				<el-table-column prop="FCreateDateTime" label="_时间_" sortable min-width="120">
				</el-table-column>
				<el-table-column prop="FStateStr" align="center" label="_状态_" min-width="120">
				</el-table-column>
			</el-table>
			<div v-if="show_systemDetailInfo" class="systemDetailInfo" :style="{height:table_height+'px'}">
				{{systemDetailInfo.content}}
			</div>
		</div>
		<div id="pagination" class="pagination">
			<div class="block" v-if="show_allSystemInfo">
				<el-pagination
					@size-change="handleSizeChangeAll"
					@current-change="handleCurrentChangeAll"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize_all"
					:current-page="pageIndex_all"
					layout="prev, pager, next, jumper,total,sizes"
					:total="AllFTotalCount">
				</el-pagination>
			</div>
			<div class="block" v-if="show_readSystemInfo">
				<el-pagination
					@size-change="handleSizeChangeRead"
					@current-change="handleCurrentChangeRead"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize_read"
					:current-page="pageIndex_read"
					layout="prev, pager, next, jumper,total,sizes"
					:total="ReadFTotalCount">
				</el-pagination>
			</div>
			<div class="block" v-if="show_noReadSystemInfo">
				<el-pagination
					@size-change="handleSizeChangeNoRead"
					@current-change="handleCurrentChangeNoRead"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize_noRead"
					:current-page="pageIndex_noRead"
					layout="prev, pager, next, jumper,total,sizes"
					:total="NoReadFTotalCount">
				</el-pagination>
			</div>
		</div>
	</section>
</template>
<script type="text/ecmascript-6">

	//import vueZtree from './vue-ztree.vue'
	//require("!style!css!../../plugins/daterangepicker/daterangepicker.css")
	require("!style!css!../../css/Common/el_table.css")
	//require('../../plugins/daterangepicker/moment.js')
	//var plugin = require('../../plugins/daterangepicker/daterangepicker.js')
	// plugin.getiCheck();
	// plugin.getdatepicker();
	export default {
		data() {
			return {
				//需要的时间
				queryDate: [],
				activeName: "first",
				table_height: null,
				show_allSystemInfo: true,
				show_readSystemInfo: false,
				show_noReadSystemInfo: false,
				show_systemDetailInfo: false,
				//table数据
				allSystemInfo: [],
				readSystemInfo: [],
				noReadSystemInfo: [],
				multipleSelection: [],
				//页码
				pageIndex_all: 1,
				pageSize_all: 10,
				pageIndex_read: 1,
				pageSize_read: 10,
				pageIndex_noRead: 1,
				pageSize_noRead: 10,
				//总页数
				AllFTotalCount: 0,
				ReadFTotalCount: 0,
				NoReadFTotalCount: 0,
				//选中的行
				checkedRow: [],
				editableTabs: [],
				//判断有没有添加重复的tab
				repeatedId: [],
				//详情内容数组
				systemDetailInfoArr: [],
				systemDetailInfo: "",

			}
		},
		props: {
			screenHeight: Number
		},
		mounted(){
			setTimeout(() => {
				this.adjustPage();
			}, 100);
			this.doQueryByAll();
		},
		methods: {
			/*Pagination*/
			/*--全部--*/
			handleSizeChangeAll(val) {
				this.pageSize_all = val;
				this.doQuery("-1", "all");
			},
			handleCurrentChangeAll(val) {
				this.pageIndex_all = val;
				this.doQuery("-1", "all");
			},
			/*--全部--*/
			/*--已读--*/
			handleSizeChangeRead(val){
				this.pageSize_read = val;
				this.doQuery("1", "read");
			},
			handleCurrentChangeRead(val){
				this.pageIndex_read = val;
				this.doQuery("1", "read");
			},
			/*--已读--*/
			/*--未读--*/
			handleSizeChangeNoRead(val){
				this.pageSize_noRead = val;
				this.doQuery("0", "noRead");
			},
			handleCurrentChangeNoRead(val){
				this.pageIndex_noRead = val;
				this.doQuery("0", "noRead");
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) + 10;
			},
			//切换tab方法
			switchoverTab(name){
				switch (name) {
					case "_全部_":
						//this.doQuery("-1", "all");
						this.show_allSystemInfo = true;
						this.show_readSystemInfo = false;
						this.show_noReadSystemInfo = false;
						this.show_systemDetailInfo = false;
						break;
					case "_已读_":
						//this.doQuery("1", "read");
						this.show_allSystemInfo = false;
						this.show_readSystemInfo = true;
						this.show_noReadSystemInfo = false;
						this.show_systemDetailInfo = false;
						break;
					case "_未读_":
						//this.doQuery("0", "noRead");
						this.show_allSystemInfo = false;
						this.show_readSystemInfo = false;
						this.show_systemDetailInfo = false;
						this.show_noReadSystemInfo = true;
						break;
					default:
						//console.log(name);
						for (let i = 0; i < this.systemDetailInfoArr.length; i++) {
							if (this.systemDetailInfoArr[i].id == name) {
								this.systemDetailInfo = this.systemDetailInfoArr[i]
							}
						}
						this.show_allSystemInfo = false;
						this.show_readSystemInfo = false;
						this.show_noReadSystemInfo = false;
						this.show_systemDetailInfo = true;
						return;
				}
			},
			//切换tab
			switchoverTable(tab){
				if (typeof tab == "string") {
					this.switchoverTab(tab);
				} else {
					let name = tab.label;
					if (name == "_全部_" || name == "_已读_" || name == "_未读_") {
						this.switchoverTab(name);
					} else {
						this.switchoverTab(tab.name);
					}

				}

			},
			//点击查询按钮
			doQueryByAll(){
				this.doQuery("-1", "all");
				this.doQuery("1", "read");
				this.doQuery("0", "noRead");
			},
			doQuery(state, arr){
				let pageSize;
				let pageIndex;
				switch (state) {
					case "-1":
						pageSize = this.pageSize_all;
						pageIndex = this.pageIndex_all;
						break;
					case "1":
						pageSize = this.pageSize_read;
						pageIndex = this.pageIndex_read;
						break;
					case "0":
						pageSize = this.pageSize_noRead;
						pageIndex = this.pageIndex_noRead;
						break;
					default:
						pageSize = 10;
						pageIndex = 1;
				}
				//let time = $(".el-date-editor--datetimerange>.el-input__inner").val();
				var _this = this;
				//let startTime = time.substring(0, 19);
				//let endTime = time.substring(22, 42);
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryMessageNotifyByFUserGUID","FState":"' + state + '","FDataType":"0","FPageSize":"' + pageSize + '","FPageIndex":"' + pageIndex + '","FVersion":"1.0.0"}',
					success: function (data) {
						//console.log(data);
						if (arr == "all") {
							_this.AllFTotalCount = data.FObject.Table[0].FTotalCount;
							_this.allSystemInfo = _this.getUsableData(data.FObject.Table1);
						} else if (arr == "read") {
							_this.ReadFTotalCount = data.FObject.Table[0].FTotalCount;
							_this.readSystemInfo = _this.getUsableData(data.FObject.Table1);

						} else if (arr == "noRead") {
							_this.NoReadFTotalCount = data.FObject.Table[0].FTotalCount;
							_this.noReadSystemInfo = _this.getUsableData(data.FObject.Table1);
						}
					},
					error: function (data) {
						console.log("没有系统消息!");
					}
				});
			},
			getUsableData(arr){
				let result = arr;
				for (let i = 0; i < result.length; i++) {
					//修改字段
					if (result[i].FState == "0") {
						result[i].FStateStr = "_未读_";
					} else if (result[i].FState == "1") {
						result[i].FStateStr = "_已读_";
					}
					result[i].FCreateDateTime = result[i].FCreateDateTime.substring(0, 10);
				}
				return result
			},
			//CheckBox选择行
			selectRow(selection, row){
				this.checkedRow.length = 0;
				for (let i = 0; i < selection.length; i++) {
					let id = selection[i].FGUID;
					this.checkedRow.push(id);
				}
			},
			//CheckBox全选
			selectAll(selection){
				this.checkedRow.length = 0;
				for (let i = 0; i < selection.length; i++) {
					let id = selection[i].FGUID;
					this.checkedRow.push(id);
				}
			},
			//改变已读未读状态
			changeState(id){
				let checkedRowStr;
				if (id == "" || id == undefined || typeof id == "object") {
					checkedRowStr = this.checkedRow.join(",");
				} else {
					checkedRowStr = id;
				}
				var _this = this;
				if (checkedRowStr == "") {
					this.$message({
						showClose: true,
						message: "_请勾选项目_!",
						type: "warning"
					});
					return
				}
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"UpdateMessageNotifyStatus","FGUIDs":"' + checkedRowStr + '","FState":"1","FVersion":"1.0.0"}',
					success: function (data) {
						console.log(data);
						_this.doQueryByAll();
					}
				});
				if (this.show_allSystemInfo) {
					this.$refs.setAllSystemInfo.clearSelection();
				} else {
					this.$refs.setNoReadSystemInfo.clearSelection();
				}

			},
			//add tab方法
			addTabWay(content, id){
				if(this.repeatedId.length>=1)return;
				this.repeatedId.push(id);
				let title = content.substring(0, 4) + "...";
				this.editableTabs.push({
					title: title,
					name: id,
					content: ""
				});
				this.activeName = id;
				//console.log(id);
				this.switchoverTable(id);
				this.systemDetailInfo.content = content;
			},
			//点击查看详情
			addTab(content, id, status) {
				if (status != "1") {
					this.changeState(id);
				}
				this.systemDetailInfoArr.push({
					id: id,
					content: content,
					title: ""
				});
				if (this.repeatedId.length != 0) {
					for (let i = 0; i < this.repeatedId.length; i++) {
						if (this.repeatedId[i] == id) {
							this.activeName = id;
							this.switchoverTable(id);
							return;
						}
					}
					this.addTabWay(content, id);
				} else {
					this.addTabWay(content, id);
				}
			},
			//移除tab
			removeTab(targetName) {
				for (var i = 0; i < this.repeatedId.length; i++) {
					if (this.repeatedId[i] == targetName) {
						this.repeatedId.splice(i, 1);
						break;
					}
				}
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
				if (this.repeatedId.length == 0) {
					this.activeName = "first";
					this.switchoverTable("_全部_");
				} else {
					this.activeName = activeName;
				}
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
			//禁用CheckBox
			disabledRow(row, index){
				if (row.FState == "1") {
					return false
				} else {
					return true
				}
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
	/*.el-button不能全局可能有些报表内部会用到饿了么的按钮组件*/
	.el-button {
		border:none;
		border-radius:0;
		padding:8px 26px;
	}

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

	.delete {
		background-color:#cd1a1a;
		padding:8px 16px;
	}

	/*fontawesome 里面字体图标的样式*/
	.fa-trash {
		margin-right:3px;
	}

	.fa-envelope-open-o {
		margin-right:3px;
	}
</style>
<style>
	/*el-tabs*/
	.el-tabs__header {
		margin:0;
	}

	.el-tabs__active-bar {
		background-color:#005fc6;
	}

	.el-tabs__item {
		height:36px;
		line-height:36px;
	}

	.el-tabs__nav-wrap {
		background-color:#fff;
	}

	.el-tabs__item.is-active {
		color:#333;
	}
</style>
