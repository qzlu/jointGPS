<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section>
		<!-- 编辑sim卡-->
		<div class='midSim'>
			<el-dialog  title='SIM_卡管理_-_编辑_' :visible.sync="editEquipment">
			<el-form :model="objDetail" :rules="rules" ref="objDetail" label-width="110px" >
				<el-row>
					<el-col :span="10">
						<el-form-item label="SIM_卡号_" prop="FSIMNumber">
							<el-input v-model="objDetail.FSIMNumber"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="_开始使用日期_" prop="FStartDatetime" label-width="160px">
							<el-date-picker type="date" placeholder="_选择日期_" v-model="objDetail.FStartDatetime" style="width: 100%;" :clearable="false"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="2"></el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="SIM_卡标识_" prop="FSIMCardCCID">
							<el-input v-model="objDetail.FSIMCardCCID"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="FNearDatetime" label="_最近缴费日期_" label-width="160px">
					        <el-date-picker type="date" placeholder="_选择日期_" v-model="objDetail.FNearDatetime" style="width: 100%;" :clearable="false"></el-date-picker>
					    </el-form-item>	
					</el-col>
					<el-col :span="2"></el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
					    <el-form-item label="_描述_" prop="FDescription">
							<el-input type="textarea" v-model="objDetail.FDescription" :maxlength="200" :rows="2"
									  placeholder='_最多输入_200_字_'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="_下次缴费日期_" prop="FNextDatetime" label-width="160px">
							<el-date-picker type="date" placeholder="_选择日期_" v-model="objDetail.FNextDatetime" style="width: 100%;" :clearable="false"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="2"></el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm11('objDetail')">_保存_</el-button>
				<el-button @click="res" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
			</div>
			</el-dialog>
		</div>
		<!-- 新增sim卡-->
		<div class='midSim'>
			<el-dialog  title='SIM_卡管理_-_新增_' :visible.sync="addEquipment">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" >
				<el-row>
					<el-col :span="10">
						<el-form-item label="SIM_卡号_" prop="FSIMNumber">
							<el-input v-model="ruleForm.FSIMNumber"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="_开始使用日期_" prop="FStartDatetime" label-width="160px">
							<el-date-picker type="date" placeholder="_选择日期_" v-model="ruleForm.FStartDatetime" style="width: 100%;" :clearable="false"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="2"></el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="SIM_卡标识_" prop="FSIMCardCCID">
							<el-input v-model="ruleForm.FSIMCardCCID"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="_下次缴费日期_" prop="FNextDatetime" label-width="160px">
							<el-date-picker type="date" placeholder="_选择日期_" v-model="ruleForm.FNextDatetime" style="width: 100%;" :clearable="false"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="2"></el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="_描述_" prop="FDescription">
							<el-input type="textarea" v-model="ruleForm.FDescription" :maxlength="200" :rows="2"
									  placeholder='_最多输入_200_字_'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="FNearDatetime" label="_最近缴费日期_" label-width="160px">
					        <el-date-picker type="date" placeholder="_选择日期_" v-model="ruleForm.FNearDatetime" style="width: 100%;" :clearable="false"></el-date-picker>
					    </el-form-item>	
					</el-col>
					<el-col :span="2"></el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleForm')">_保存_</el-button>
				<el-button @click="resetForm('ruleForm')" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
			</div>
			</el-dialog>
		</div>


		<div id="operate_wrapper">
			<div class='box-header'>
				<div class="leftbtn">
					<el-button type="primary" icon="edit" size="small" @click='addEquipment=true'><span
						style="color: white">_新建_</span>
					</el-button>
					<el-button type="primary" icon="caret-right" size="small" @click='changeStatus(true)'>_启用_</el-button>
					<el-button type="primary" icon="circle-close" size="small" @click='changeStatus(false)'>_禁用_</el-button>
					<el-button type="primary" icon="delete" size="small" @click='ondelete'>_删除_</el-button> 
				</div>
				<div class="rightinput" style="position: relative">
					<input type="text" placeholder="_请输入_SIM_卡号_" v-model="searchCondition.FKey" @keyup.enter="doQuery">
					<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;"
							@click="doQuery"></button>
					<button class="glyphicon glyphicon-chevron-down" @click="dialogVisible=!dialogVisible"></button>
					<div class="mymodal"
						 style="position:absolute;left:-160px;z-index:999;visibility: hidden;border: 1px solid #ccc;background: white;padding-top: 10px">
						<div class="modal-body" style="padding: 0px">
							<el-form :model='searchCondition' ref="ruleForm1" label-width="100px">
								<el-form-item label="_关键字_" prop="FKey">
									<el-input class="col-md-12" v-model="searchCondition.FKey" placeholder="_请输入_SIM_卡号_"></el-input>
								</el-form-item>
								<el-form-item label="_状态_" prop="FState">
									<el-select class="col-md-12" v-model="searchCondition.FState" placeholder="_请选择_">
										<el-option label="_全部_" value="-1" selected="selected"></el-option>
										<el-option label="_已启用_" value="1"></el-option>
										<el-option label="_已禁用_" value="0"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<div class="btnList">
										<el-button type="primary" @click="doQuery">_提交_</el-button>
										<el-button @click="resetForm('ruleForm1')" class='reset el-button el-button--default cancel el-button--primary'>_重置_</el-button>
									</div>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--设备列表-->
		<div id="el_table_wrap" class="el_table_wrap">
			<el-table :data="equipmentList" ref="multipleTable" @selection-change="handleSelectionChange"
					  :height="table_height" stripe style="width: 100%;" empty-text='_暂无数据_'>
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
				<el-table-column label="_操作_" width="90">
					<template scope="scope">
						<el-button  type="text" size="small" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button  type="text" size="small"  @click="ondelete(scope.$index,scope.row)"><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
				<el-table-column label="_状态_" width="100">
					<template scope="scope">
						<el-switch  v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="FSIMNumber"  label="SIM_卡号_" width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FShortName"  label="_公司简称_" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FVehicleName" label="_关联车牌号_" width="130" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FAssetID" label="_关联终端号_" width="180" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FStartDatetime"   label="_开始使用日期_" width="140" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FNextDatetime"  label="_下次缴费日期_" width="160" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FNearDatetime"   label="_最近缴费日期_" width="160" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FDescription" show-overflow-tooltip label="_说明_" width="150"></el-table-column>
				<el-table-column prop=""   min-width="1" ></el-table-column>
			</el-table>
		</div>
		<!--分页-->
		<div class="pagination" id='pagination'>
			<div class="block">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="pageIndex"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize"
					layout="prev, pager, next, jumper,total,sizes"
					:total="FTotalCount">
				</el-pagination>
			</div>
		</div>
	</section>
</template>
<script >
	import zuzhiSelectDialog from 'components/dialog/zuzhiSelectDialog.vue'
	export default {
		data() {
			return {
				fguid:'',
				bool:false,
				pageSize: 20,
				pageIndex: 1,
				FTotalCount: 0,
				dialogVisible: false,
				FGUIDs: '',
				table_height: null,
				anycheck: [],
				relatierol: false,
				addEquipment: false,
				editEquipment: false,
				//搜索关键字
				searchCondition: {
					"FState": "",
					"FKey": ""
				},
				//新增设备
				ruleForm: {
					FSIMNumber:'',
					FSIMCardCCID:'',
					FStartDatetime: new Date(),
					FNextDatetime: new Date(),
					FNearDatetime: new Date(),
					FDescription:'',
					FStatus:1,
				},
				objDetail:{},
				rules: {
					FSIMNumber: [{required: true, message: '_请输入_SIM_卡号_'}],
				},
				allcheck: {
					ischeck: false,
				},
				equipmentList: [],
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			zuzhiSelectDialog
		},
		computed:{

	    },
		mounted(){
			setTimeout(() => {
				this.adjustPage();
			}, 100);
			//右边搜索区域取消默认
			$('form').on("click", function (e) {
				e.stopPropagation();
			});
			var _this = this;
			this.doQuery();
		},
		methods: {
			timeChange(time){
		        var time1=Date.parse(new Date(time));
		        var uom1=new Date(time1);
		        var month1=(uom1.getMonth()+1).toString().length==1?"0"+(uom1.getMonth()+1).toString():(uom1.getMonth()+1);
		        var day1=uom1.getDate().toString().length==1?"0"+uom1.getDate():uom1.getDate();
		        return uom1.getFullYear()+'-'+month1+'-'+day1;
		    },
			res(){
				let _this=this;
				if(this.objDetail.FStatus){  //不重置FStatus
                  	_this.objDetail={
						FSIMNumber:'',
						FSIMCardCCID:'',
						FStartDatetime: new Date(),
						FNextDatetime: new Date(),
						FNearDatetime: new Date(),
						FDescription:'',
						FStatus:1,
					}
				}else{                          //不重置FStatus
					_this.objDetail={
						FSIMNumber:'',
						FSIMCardCCID:'',
						FStartDatetime: new Date(),
						FNextDatetime: new Date(),
						FNearDatetime: new Date(),
						FDescription:'',
						FStatus:0,
					}
				}
			},
			getTime: function (value) {
				console.log(value);
				this.ruleForm.FManufactureDate=value;
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.doQuery();
			},
			handleCurrentChange(val) {
				this.pageIndex = val;
				this.doQuery();
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) + 8;
			},
			//重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//搜索框查询
			doQuery(){
				let _this = this;
				let TokenID = this.$store.state.FTokenID;
				let FKey = this.searchCondition.FKey;
				let FState = this.searchCondition.FState;
				FState==""?FState=-1:FState=FState;
				let PageSize = this.pageSize;
				let pageIndex = this.pageIndex;
				$.ajax({
					"url": "web/Common/Common_Admin",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminSIMList","FVersion": "1.0.0","FKey":"' + FKey + '","FState":"' + FState + '","FPageSize":"' + PageSize + '","FPageIndex":"' + pageIndex + '"}',
					success: function (data) {
						console.log(data);
						var Fobj = data;
						_this.equipmentList = [];
						$.each(Fobj.FObject.Table1, function (index, obj) {
							obj.FStartDatetime=_this.parseGMT(obj.FStartDatetime.replace(/T/ig,' ')).substring(0,10);
							obj.FNextDatetime=_this.parseGMT(obj.FNextDatetime.replace(/T/ig,' ')).substring(0,10);
							obj.FNearDatetime=_this.parseGMT(obj.FNearDatetime.replace(/T/ig,' ')).substring(0,10);
							obj.FVehicleName=obj.FVehicleName?obj.FVehicleName:'--';
							obj.FShortName=obj.FShortName?obj.FShortName:'--';
							obj.FAssetID=obj.FAssetID?obj.FAssetID:'--';
							obj.FDescription=obj.FDescription?obj.FDescription:'--';
							if(obj.FStatus==1){
								obj.FStatus=true
							}else{
								obj.FStatus=false
							}
							_this.equipmentList.push(obj);
						});
						_this.FTotalCount = Fobj.FObject.Table[0].FTotalCount;
						//搜索表单重置
						// _this.resetForm('ruleForm1');
						_this.dialogVisible=false;
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			},
			//提示信息
			message(msg, type){
				this.$message({
					showClose: true,
					message: msg,
					type: type
				});
			},
			//判断是否有数据被选中
			handleSelectionChange(val) {
				this.anycheck = val;
				console.log(this.anycheck);
				let arrFGUID = [];
				this.anycheck.forEach(obj=> {
					arrFGUID.push(obj.FGUID);
				})
				this.FGUIDs = arrFGUID.join(',');
			},
			//删除单选或者多选
		    ondelete(index,rows) {
		    	let TokenID=this.$store.state.FTokenID;
		        let _this=this;
		        let Fgid='';
		        if(rows==undefined){  //点击多选删除
			        if(this.anycheck.length == 0){
			            _this.message('_请先勾选_', 'warning');
			        }else{        
			           Fgid=_this.FGUIDs;
			        }
		        }else{              //点击单选删
		            Fgid=rows.FGUID;
		        }
				if(Fgid){  //勾选或者选中某行则执行删除操作
					this.$confirm('_此操作将删除与终端的关联_,_是否继续_?', '_提示_', {
							confirmButtonText: '_确定_',
							confirmButtonClass: "search",
							cancelButtonText: '_取消_',
							cancelButtonClass: "cancel el-button--primary",
							type: 'warning'
					    })
						.then(() => {
							$.ajax({
								"url": "web/Common/Common_Admin",
								"cache": false,
								"async": true,
								"type": "post",
								"dataType": "json",
								"contentType": "application/json; charset=utf-8",
								"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteAdminSIM","FVersion": "1.0.0","FGUIDs":"'+Fgid+'"}',
								success: function (data) {
									console.log(data);
									_this.doQuery();
									_this.message('_删除成功_', 'success');
								},
								error:function () {
								            console.log('_请求失败_')
								    }
							});
					    })
						.catch(() => {
							this.$message.info('_已取消操作_!');
							_this.anycheck=[];
							_this.$refs.multipleTable.clearSelection();
						});
				}else{
		          return false
		        }
		    },
			//多选修改设备状态
			changeStatus: function (parm) {
				var _this = this;
				if (this.anycheck.length == 0) {
					this.message('_请先勾选_', 'warning');
				} else {
					let TokenID = this.$store.state.FTokenID;
					let FGUIDs = this.FGUIDs;
					let FState=parm?1:0;
					$.ajax({
						"url": "web/Common/Common_Admin",
						"cache": false,
						"async": true,
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": '{"FTokenID":"' + TokenID + '","FAction":"UpdateAdminSIMStatus","FGUIDs":"' + FGUIDs + '","FVersion":"1.0.0","FState":"' + FState + '"}',
						success: function (data) {
							console.log(data);
							_this.equipmentList=[];
							_this.doQuery();
							_this.message('_修改成功_','success');
							_this.anycheck=[];
							_this.$refs.multipleTable.clearSelection();
						},
						error: function () {
							console.log('_请求失败_')
						}
					});
				}
			},
			//单选修改设备状态
			onlyChange(index,row){
				let _this=this;
				let TokenID = this.$store.state.FTokenID;
			    let FState=row.FStatus?1:0;
 				let FGUIDs = row.FGUID;
 				$.ajax({
						"url": "web/Common/Common_Admin",
						"cache": false,
						"async": true,
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": '{"FTokenID":"' + TokenID + '","FAction":"UpdateAdminSIMStatus","FGUIDs":"' + FGUIDs + '","FVersion":"1.0.0","FState":"' + FState + '"}',
						success: function (data) {
							console.log(data);
							if(data.Result!="200"){
				                _this.equipmentList[index].FStatus=_this.equipmentList[index].FStatus;
				            }else {
				              _this.message('_修改成功_', 'success');
				              _this.anycheck=[];
				              _this.$refs.multipleTable.clearSelection();
				            }
			                _this.anycheck=[];
						},
						error: function () {
							console.log('_请求失败_')
						}
					});
			},
			//编辑数据
			handleEdit(index,row) {
               this.editEquipment=true;
               this.fguid=row.FGUID;
               let FGUID=this.fguid;
		       let _this = this;
		       let TokenID = this.$store.state.FTokenID;
		        //获取sim详情
		        $.ajax({
		          "url": "web/Common/Common_Admin",
		          "cache": false,
		          "async": true,
		          "type": "post",
		          "dataType": "json",
		          "contentType": "application/json; charset=utf-8",
		          "data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminSIMByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}',
		          success: function (data) {
		            console.log(data);
		            _this.editEquipment=true;
		            var Fobj = data;
		            _this.objDetail=Fobj.FObject[0];
		          },
		          error: function () {
		            console.log('_请求失败_')
		          }
		        });
			},
			//提价新表单
			submitForm(formName) {
				var _this=this;
				if(this[formName].FStartDatetime.getTime()>this[formName].FNextDatetime.getTime()){
					_this.message('_开始日期不能大于下次缴费日期_', 'warning');
					return
				};
				if(this[formName].FStartDatetime.getTime()>this[formName].FNearDatetime.getTime()){
					_this.message('_开始日期不能大于最近缴费日期_', 'warning');
					return
				};
				if(this[formName].FNearDatetime.getTime()>this[formName].FNextDatetime.getTime()){
					_this.message('_最近缴费日期不能大于下次缴费日期_', 'warning');
					return
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						let today=(Date.parse(new Date()));
 						JsonObj.FStartDatetime=JsonObj.FStartDatetime?this.timeChange(JsonObj.FStartDatetime):this.timeChange(today);
 						JsonObj.FNextDatetime=JsonObj.FNextDatetime?this.timeChange(JsonObj.FNextDatetime):this.timeChange(today);
 						JsonObj.FNearDatetime=JsonObj.FNearDatetime?this.timeChange(JsonObj.FNearDatetime):this.timeChange(today);
						var JsonStr;
 							JsonStr=JSON.stringify({"FTokenID":TokenID,"FAction":"AddAdminSIM","FT_AdminSIM":JsonObj,"FVersion":"1.0.0"});
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log(data);
								if(data.Result==105){
									_this.message('_该卡号已被占用_', 'warning');
								};
								_this.equipmentList=[];
								_this.doQuery();
								_this.resetForm(formName);
							    _this.addEquipment=false;
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					} 
					else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//编辑新表单
			submitForm11(formName) {
				var _this=this;
				if(new Date(this.timeChange(this[formName].FStartDatetime)).getTime()>new Date(this.timeChange(this[formName].FNextDatetime)).getTime()){
					_this.message('_开始日期不能大于下次缴费日期_', 'warning');
					return
				};
				if(new Date(this.timeChange(this[formName].FStartDatetime)).getTime()>new Date(this.timeChange(this[formName].FNearDatetime)).getTime()){
					_this.message('_开始日期不能大于最近缴费日期_', 'warning');
					return
				};
				if(new Date(this.timeChange(this[formName].FNearDatetime)).getTime()>new Date(this.timeChange(this[formName].FNextDatetime)).getTime()){
					_this.message('_最近缴费日期不能大于下次缴费日期_', 'warning');
					return
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						var FGUID=this.fguid;
						let JsonObj=this[formName];
 						let today=(Date.parse(new Date()));
 						JsonObj.FStartDatetime=JsonObj.FStartDatetime?this.timeChange(JsonObj.FStartDatetime):this.timeChange(today);
 						JsonObj.FNextDatetime=JsonObj.FNextDatetime?this.timeChange(JsonObj.FNextDatetime):this.timeChange(today);
 						JsonObj.FNearDatetime=JsonObj.FNearDatetime?this.timeChange(JsonObj.FNearDatetime):this.timeChange(today);
						var JsonStr;
 							JsonStr=JSON.stringify({"FTokenID":TokenID,"FAction":"UpdateAdminSIM","FGUID":FGUID,"FT_AdminSIM":JsonObj,"FVersion":"1.0.0"});
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log(data);
								if(data.Result==105){
									_this.message('_该卡号已被占用_', 'warning');
								};
								_this.equipmentList=[];
								_this.doQuery();
							    _this.editEquipment=false;
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					} 
					else {
						console.log('error submit!!');
						return false;
					}
				});
			},
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			},
			dialogVisible: function () {
				if (this.dialogVisible) {
					$(".mymodal").css('visibility', 'visible');
				} else {
					$(".mymodal").css('visibility', 'hidden');
				}
			},
			addEquipment: {
				handler () {
					this.ruleForm={
							FSIMNumber:'',
							FSIMCardCCID:'',
							FStartDatetime: new Date(),
							FNextDatetime: new Date(),
							FNearDatetime: new Date(),
							FDescription:'',
							FStatus:1,
						}
				},
				//deep: true
			},
		},
		created: function () {

		}
	}
</script>
<style scoped>

	.leftbtn {
		float:left;
	}

	.rightinput {
		float:right;
		margin-right:10px;
	}

	.rightinput input {
		border:1px solid #1970cf;
		height:28px;
		border-radius:15px;
		box-shadow:none !important;
		width:180px;
		padding-left:10px;

	}

	.rightinput input:active {
		box-shadow:none !important;
		outline:none;
	}

	.rightinput input:focus {
		box-shadow:none !important;
		outline:none;
	}

	.searchBtn {
		border:none;
		background-color:white;
		margin-left:-40px;
		box-shadow:none;
		height:20px !important;
		outline:none;
	}

	.glyphicon-chevron-down {
		margin-left:30px;
		width:28px;
		height:28px;
		border-radius:50%;
		outline:none;
		background-color:white;
		border:1px solid #1970cf;
	}

	#el_table_wrap .el-button {
		padding:0;
	}

	.el-popover .el-form-item {
		margin-bottom:0px;
	}

	.el-form-item .el-input__inner {
		height:28px;
	}
</style>
<style>
	.equiment .el-form-item .el-input__inner {
		height:28px;
		border-radius:0;
	}

	.equiment .btnList {
		text-align:right;
		width:100%;
		padding-right:25px;
	}

	.equiment .btnList .reset {
		padding:7px 25px;
		border:1px solid #ccc;
		background-color:#fff;
	}
	.midSim  .el-dialog .el-dialog__body {
	    max-height:600px;
	    overflow:auto;
	}
	@media (min-width:1600px) {   
		.midSim .el-dialog--small {
		    width: 36%;
		} 

    }
    @media (min-width:1300px) and (max-width:1599px){
    	.midSim .el-dialog--small {
		    width: 52%;
		} 
    }
    @media (min-width:1200px) and (max-width:1299px){
    	.midSim .el-dialog--small {
		    width: 52%;
		} 
    }
    @media (max-width:1199px) {
		.midSim .el-dialog--small {
		    width: 50%;
		} 
    } 
</style>