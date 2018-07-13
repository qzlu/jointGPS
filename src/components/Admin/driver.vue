<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section style="height: 100%">
		<!-- 司机详情 -->
		<div class='velcss'>
			<el-dialog title='_司机详情_' :visible.sync="DdetailView">
				<table class="table detailTable" style='table-layout:fixed;border:1px solid #ccc'>
					<tbody >
				        <tr style='height:44px'>
				           	<td width="20%" class='likeHeader'><b>_司机名称_</b></td><td width="30%">{{driverDetailData.FDriverName}}</td>
				           	<td width="20%" class='likeHeader'><b>_驾龄_</b></td><td width="30%">{{driverDetailData.FDrivingExp}}</td>
				        </tr>
						<tr style='height:44px'>
			            	<td class='likeHeader'><b>_联系电话_</b></td><td >{{driverDetailData.FPhoneNumber}}</td>
			            	<td class='likeHeader'><b>_状态_</b></td><td >{{driverDetailData.FStatus}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_公司_</b></td><td >{{driverDetailData.FShortName}}</td>
			            	<td class='likeHeader'><b>_分组_</b></td><td >{{driverDetailData.FGroupName}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_身份证_</b></td><td >{{driverDetailData.FIdentityID}}</td>
			            	<td class='likeHeader'><b>_性别_</b></td><td >{{driverDetailData.FSex}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_驾驶证号_</b></td><td >{{driverDetailData.FDrivingNumber}}</td>
			            	<td class='likeHeader'><b>_驾驶类型_</b></td><td >{{driverDetailData.FDrivingType}}</td>
			            </tr>
						<tr style='height:44px'>
			            	<td class='likeHeader'><b>_开始有效期_</b></td><td >{{driverDetailData.FDrivingStartDate}}</td>
			            	<td class='likeHeader'><b>_结束有效期_</b></td><td >{{driverDetailData.FDrivingEndDate}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_关联车辆_</b></td><td  colspan="3">{{driverDetailData.FBindVehicleNameStrs}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_描述_</b></td><td  colspan="3" style='word-wrap:break-word'>{{driverDetailData.FDescription}}</td>
			            </tr>
		           </tbody>
				</table>
			</el-dialog>
		</div>
		<!-- 新增/编辑司机 -->
		<div class='userDialog'>
	        <el-dialog :title="createDriver?'_新增司机_':'_编辑司机_'" :visible.sync="driverView">
				<el-form :model="oneDriverData" :rules="rules" ref="oneDriverData" label-width="120px">
					<!-- <el-row> -->
						<el-col :span="10">
							<el-form-item label="_司机姓名_" prop="FDriverName">
								<el-input v-model.trim="oneDriverData.FDriverName" :maxlength='16' placeholder='_请输入少于十六个字符_' v-focus v-if='driverView&&createDriver'></el-input>
								<el-input v-model.trim="oneDriverData.FDriverName" :maxlength='16' placeholder='_请输入少于十六个字符_'  v-if='driverView&&!createDriver'></el-input>
							</el-form-item>
							<el-form-item label="_司机电话_" prop="FPhoneNumber">
								<el-input v-model.trim="oneDriverData.FPhoneNumber"></el-input>
							</el-form-item>
							
							<el-form-item label="_身份证号_" prop="FIdentityID">
								<el-input v-model.trim="oneDriverData.FIdentityID"></el-input>
							</el-form-item>
							<el-form-item label="_驾驶证号_" prop="FDrivingNumber">
								<el-input v-model.trim="oneDriverData.FDrivingNumber"></el-input>
							</el-form-item>
							<el-form-item label="_驾龄_(_年_)" prop="FDrivingExp" >
								<el-input-number v-model="oneDriverData.FDrivingExp" :min="1" :max="50" style='width:100%'></el-input-number>
							</el-form-item>
							<el-form-item label="_驾驶类别_" prop="FDrivingType">
								<el-select v-model.trim="oneDriverData.FDrivingType" placeholder="_请选择_" style='width:100%'>
				                  	<el-option v-for="item in FDrivingTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
				                </el-select>
							</el-form-item>
							<div class='discrip'>
								<el-form-item label="_描述_" prop="FDescription" >
									<el-input type="textarea" v-model.trim="oneDriverData.FDescription" :maxlength="100" :rows="2"
											  placeholder='_最多输入_100_字_'></el-input>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="12">
							<div class='twoinput'>
								<el-form-item label="_公司车辆_" prop="ce" label-width="160px" style='height:82px'>
									<div class='cecontent'  @click="focusCompany">
										<div><span style='font-weight:bold'>_所属公司_:</span>{{oneDriverData.ce}}</div>
										<div><span style='font-weight:bold'>_关联车牌_:</span>{{linkVel}}</div>
									</div>
								</el-form-item>
							</div>
							<el-form-item label="_分组_" prop="FGroupGUID" label-width="160px" >
								<el-select v-model="oneDriverData.FGroupGUID" placeholder="_请选择_" style='width:100%'>
				                  	<el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value"></el-option>
				                </el-select>
							</el-form-item>
							<el-form-item label="_性别_" prop="FSex" label-width="160px">
								<el-radio-group v-model.number="oneDriverData.FSex">
								    <el-radio :label="1">_男_</el-radio>
								    <el-radio :label="0">_女_</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="_驾驶证开始有效期_" prop="FDrivingStartDate" label-width="160px" >
								<el-date-picker type="date" placeholder="_选择日期_" v-model="oneDriverData.FDrivingStartDate" :clearable="false" style="width: 100%;">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="_驾驶证结束有效期_" prop="FDrivingEndDate" label-width="160px" > 
								<el-date-picker type="date" placeholder="_选择日期_" v-model="oneDriverData.FDrivingEndDate" style="width: 100%;" :clearable="false"></el-date-picker>
							</el-form-item>
						</el-col>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button v-if="createDriver" type="primary" @click="createSubmit('oneDriverData')">_创建_</el-button>
					<el-button v-if="createDriver"  @click="resetDriver" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
					<el-button v-if="!createDriver" type="primary" @click="editSubmit('oneDriverData')">_保存_</el-button>
					<el-button v-if="!createDriver" @click='driverView=false' type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>
		</div>
	    <!-- 内容展示区 -->
		<div style="height: 100%">
			<div  style="height: 100%">
				<!-- 左侧树 -->
			    <!-- <el-col :span="6"  style="height: 100%"> -->
			    <div class='leftTree' >
			        <div style="height: 100%" >
			      		<company-module v-on:treeId='treeCompany' :typeTable='typeTable'></company-module>
			      	</div>
			    </div>
				<!-- 右侧列表弹框 -->
	      		<!-- <el-col :span="18"  style="height: 100%"> -->
	      		<div class='rightTable' >
					<div class='tableTab' style="height: 100%">
						<el-tabs type="border-card" style="height: 44px"  v-model="activeName" >
							<el-tab-pane :label="numberTab?'_直属司机_':'_分组司机_'" name='1' ></el-tab-pane>
							<el-tab-pane label="_全部司机_"  name='2' v-if='numberTab'></el-tab-pane>
						</el-tabs>
						<!-- 操作按钮 -->
						<div id="operate_wrapper">
							<div class='adminHeader'>
								<div class="float-left">
									<el-button type="primary" class='el-icon-plus' size="small" @click='addDriver'><span
					                    style="color: white">_新建_</span>
					                </el-button>
					                <el-button type="primary" class='el-icon-circle-check' size="small" @click='moreChange(true)'>_启用_</el-button>
					                <el-button type="primary" class="el-icon-circle-close" size="small" @click='moreChange(false)'>_禁用_
					                </el-button>
					                <el-button type="primary" class="el-icon-delete" size="small" @click="deleteMore">_删除_</el-button>
								</div>
								<div class="float-right" style="position: relative;margin-right:30px">
									<input type="text" class='searchIn' placeholder="_请输入司机名称_" v-model="driverKey" @keyup.enter="searchList">
									<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px"
											@click="searchList"></button>
								</div>
							</div>
						</div> 
						<!-- 直属司机表格 -->
						<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==1'>
							<span class='tableTop'>{{tableTopName}}</span>
							<el-table :data="driverList"  @selection-change="handleSelectionChange1" ref="multipleTable1"
									  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
								<el-table-column label="_操作_" width="100">
									<template scope="scope">
										<el-button  type="text" size="small" @click="editDriver(scope.$index, scope.row)"><i class="el-icon-edit" title='_编辑_'></i></el-button>
										<el-button  type="text" size="small"  @click="deleteone(scope.$index,scope.row)"><i class="el-icon-delete" title='_删除_'></i></el-button>
										<el-button  type="text" size="small"  @click="detailD(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
									</template>
								</el-table-column>
								<el-table-column label="_状态_" width="100">
									<template scope="scope">
										<el-switch v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
									</template>
								</el-table-column>
								<el-table-column prop="FDriverName"  label="_司机姓名_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FDrivingExp"   label="_驾龄_" width="80" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FDrivingType" label="_驾驶类别_" width="170" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FPhoneNumber" label="_司机电话_" width="150" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FSex"   label="_性别_" width="80"></el-table-column>
								<el-table-column prop="FShortName"   label="_公司名称_" width="120" v-if='!numberTab'></el-table-column>
								<!-- <el-table-column prop="FDrivingStartDate" label="_开始有效期_" width="150" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FDrivingEndDate" label="_结束有效期_" width="150" show-overflow-tooltip></el-table-column> -->
								<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_" min-width="100" align='left'  class-name='renderCenter'></el-table-column>
							</el-table>
						</div>
						<!-- 分页 -->
						<div class="pagination" id='pagination' v-if='activeName==1'>
							<div class="block">
								<el-pagination
									@size-change="handleSizeChange1"
									@current-change="handleCurrentChange1"
									:current-page="pageIndex1"
									:page-sizes="[10, 20, 30]"
									:page-size="pageSize1"
									layout="prev, pager, next, jumper,total,sizes"
									:total="FTotalCount1">
								</el-pagination>
							</div>
						</div>
						<!-- 全部司机表格 -->
						<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==2'>
							<span class='tableTop'>{{tableTopName}}</span>
							<el-table :data="driverListAll"  @selection-change="handleSelectionChange2" ref="multipleTable2"
									  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
								<el-table-column label="_操作_" width="100">
									<template scope="scope">
										<el-button  type="text" size="small" @click="editDriver(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
										<el-button  type="text" size="small"  @click="deleteone(scope.$index,scope.row)"><i class="el-icon-delete"></i></el-button>
										<el-button  type="text" size="small"  @click="detailD(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
									</template>
								</el-table-column>
								<el-table-column label="_状态_" width="100">
									<template scope="scope">
										<el-switch  v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
									</template>
								</el-table-column>
								<el-table-column prop="FDriverName"  label="_司机姓名_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FDrivingExp"   label="_驾龄_" width="80" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FDrivingType" label="_驾驶类别_" width="170" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FPhoneNumber" label="_司机电话_" width="150" show-overflow-tooltip></el-table-column>
								<!-- <el-table-column prop="FIdentityID"  label="_身份证号码_" width="160" show-overflow-tooltip></el-table-column> -->
								<el-table-column prop="FSex"   label="_性别_" width="80"></el-table-column>
								<!-- <el-table-column prop="FDrivingNumber"  label="_驾驶证号_" width="180" show-overflow-tooltip></el-table-column> -->
								<!-- <el-table-column prop="FDrivingStartDate" label="_开始有效期_" width="150" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FDrivingEndDate" label="_结束有效期_" width="150" show-overflow-tooltip></el-table-column> -->
								<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_" min-width="100" align='left'  class-name='renderCenter'></el-table-column>
							</el-table>
						</div>
						<!-- 分页 -->
						<div class="pagination" id='pagination'  v-if='activeName==2'>
							<div class="block">
								<el-pagination
									@size-change="handleSizeChange2"
									@current-change="handleCurrentChange2"
									:current-page="pageIndex2"
									:page-sizes="[10, 20, 30]"
									:page-size="pageSize2"
									layout="prev, pager, next, jumper,total,sizes"
									:total="FTotalCount2">
								</el-pagination>
							</div>
						</div>
					</div>
				</div>
	      		<!-- </el-col> -->
	    	</div>				
		</div>
		<radio-company  :radioCompanyDialog='radioCompanyDialog' v-on:radiochangeC='changeRadioC' v-on:radiochildrenC='radiochildrenC' v-on:checkchildrenV='checkchildrenV' :typeTable='typeTable'></radio-company>
	</section>
</template>
<script >
	import  companyModule from 'components/Company/companyModule.vue'
	import  radioCompany from 'components/Company/radioCompany.vue'
	export default {
		data() {
			const checkFPhoneNumber = (rule, value, callback) => {
		        var uPattern = /^[0-9\-\+\(\)]{1,18}$/g;
	            if(!value) {
	                return callback(new Error('_请输入电话_'));
	              }
	            else if(value&& uPattern.test(value)){
	            	console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	            	callback(new Error('_请输入有效号码_'));
	            }
		    }; 
			return {
				num1:1,
				checkedtabel1:[],
				checkedtabel2:[],
				numberTab:true,
				groups:[],
				tableTopName:'_请选择公司_',
                radioCompanyDialog:false,
				createDriver:false,
				driverView:false,
				activeName:'1',
				table_height:null,
				typeTable:1,
				driverKey:'',
				pageIndex1:1,
				pageSize1:20,
				FTotalCount1:0,
				tableFguids1:'',
				pageIndex2:1,
				pageSize2:20,
				FTotalCount2:0,
				tableFguids2:'',
				//treeId:'',
				treeObj:'',
				DdetailView:false,
				driverDetailData:'',
				linkVel:'',
				driverCompanyId:'',       //司机已绑定的公司
				//getCompanyId:'',       //保存接收的公司id
				driverData:'',      //司机详情数据
				bindArr:'',        //司机绑定的车辆数据
				//新增司机列表
				oneDriverData: {
					FDriverName:'',
					FDrivingExp:1,
					FIdentityID:'',
					FSex:1,
					FDrivingNumber:'',
					FDrivingType:'',
					FDrivingStartDate:new Date(),
					FDrivingEndDate:new Date(),
					FPhoneNumber:'',
					FDescription:'',
					FStatus:1,
					ce:'',      //界面显示混合
					//ceId:'',

					FAgentGUID:'',
					FVehicleGUIDs:'',
					FGroupGUID:''
				},
				copyDriverData: {
					FDriverName:'',
					FDrivingExp:1,
					FIdentityID:'',
					FSex:1,
					FDrivingNumber:'',
					FDrivingType:'',
					FDrivingStartDate:new Date(),
					FDrivingEndDate:new Date(),
					FPhoneNumber:'',
					FDescription:'',
					FStatus:1,
					ce:'',      //界面显示混合
					//ceId:'',

					FAgentGUID:'',
					FVehicleGUIDs:'',
					FGroupGUID:''
				},
				rules:{
					FDriverName: [{required: true, message: '_请输入姓名_'}],
					FPhoneNumber: [{required: true, validator: checkFPhoneNumber }],
					FIdentityID: [{required: true, message: '_请输入身份证号_'}],
					ce: [{required: true, message: '_请选择公司_'}],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
				},
				driverList:[],
				driverListAll:[],
				//驾驶类别
				FDrivingTypes: [{
		          	label: '_大型货车_',
		          	value: 0
		        },{
		         	label: '_牵引车_',
		          	value: 1
		        },{
		         	label: '_小型自动挡汽车_',
		          	value: 2
		        },{
		         	label: '_大型客车_',
		          	value: 3
		        }
		        ,{
		         	label: '_城市公交车_',
		          	value: 4
		        }
		        ,{
		         	label: '_中型客车_',
		          	value: 5
		        },{
		         	label: '_小型汽车_',
		          	value: 6
		        }],  
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			companyModule,radioCompany
		},
		mounted(){
			setTimeout(() => {
				this.adjustPage();
			}, 100);
		},
		methods: {
			focusCompany(){
		        this.radioCompanyDialog=true;
		    },
		    //父接收子的公司弹框关闭
		    changeRadioC(val){
				this.radioCompanyDialog=val;
			},
			radiochildrenC(data){
				console.log('子公司',data);
				this['oneDriverData'].FAgentGUID=data[1];
				this['oneDriverData'].ce=data[0];
				this['oneDriverData'].FGroupGUID='';  //公司发生改变,FGroupGUID显示就要重选
				this.groups=data[2];
			},
			//接收选择的车辆数据
			checkchildrenV(data){
				console.log('子车辆',data);
				this['oneDriverData'].FVehicleGUIDs=data[0];
				this.linkVel=data[1];
				console.log('this.linkVel',this.linkVel)
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) -65;
			},
			//点击新增
			addDriver(){
				this.createDriver=true;
				this.driverView=true;
				this.oneDriverData=this.deepCopy(this.copyDriverData);
				console.log('this.oneDriverData',this.oneDriverData)
                this.linkVel='';
                this.groups=[];
			},
			//新增提交
			createSubmit(formName){
				var _this=this;
				if(new Date(this.timeChange(this[formName].FDrivingStartDate)).getTime()>new Date(this.timeChange(this[formName].FDrivingEndDate)).getTime()){
					_this.message('_开始日期不能大于结束日期_', 'warning');
					return
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						let changeName=this[formName].ce;
						let FAgentGUID=this[formName].FAgentGUID;
						let FVehicleGUIDs=this[formName].FVehicleGUIDs;
						let FGroupGUID=this[formName].FGroupGUID;
						JsonObj.FDrivingStartDate=this.timeChange(JsonObj.FDrivingStartDate);
 						JsonObj.FDrivingEndDate=this.timeChange(JsonObj.FDrivingEndDate);
 						//delete JsonObj.FAgentGUID;
						//delete JsonObj.FVehicleGUIDs;
						//delete JsonObj.FGroupGUID;
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "AddAdminDriver",
								FT_AdminDriver:JsonObj,
								FAgentGUID:FAgentGUID,
								FVehicleGUIDs:FVehicleGUIDs,
								FGroupGUID:FGroupGUID,
								FVersion: "1.0.0"
							}
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JSON.stringify(postData),
							success: function (data) {
								console.log('新增司机',data);
				                if(data.Result==200){
				                	_this.message('_新增成功_', 'success');
				                	_this.driverView=false;
				                	_this.$store.commit('getuserCompany','');
				                	if(_this.numberTab){   //属
				                		_this.tableTopName=changeName;
				                		_this.treeObj={
				                			id:FAgentGUID,
											name:_this.tableTopName,
											fatherId:'',
											type:1
				                		}
				                		if(_this.pageIndex1==1){
				                			_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
				                		}else{
				                			_this.pageIndex1=1
				                		}
				                		if(_this.pageIndex2==1){
				                			_this.doQueryDAll(_this.pageIndex2,_this.pageSize2,_this.driverKey,-1,_this.treeObj);
				                		}else{
				                			_this.pageIndex2=1
				                		}
				                	}else{              //分组
				                		_this.tableTopName=_this.getLabel(FGroupGUID);
				                		_this.treeObj={
				                			id:FGroupGUID,
											name:_this.tableTopName,
											fatherId:FAgentGUID,
											type:0
				                		}
				                		if(_this.pageIndex1==1){
				                			_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
				                		}else{
				                			_this.pageIndex1=1
				                		}
				                	}
				                }
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
			//点击编辑
			async editDriver(index,row){
				var _this=this;
				this.createDriver=false;
				this.driverView=true;
				var parmId=row.FGUID;  
                await this.driverDetail(parmId); 
                await this.driverBindVel(parmId); 
                this.oneDriverData=this.deepCopy(this.driverData);
                this['oneDriverData'].ce=this.driverData.FShortName;
                this['oneDriverData'].FAgentGUID=this.driverData.FAgentGUID;
                this['oneDriverData'].FVehicleGUIDs=(this.bindArr.length>0)?(this.bindArr.join(',')):'';
                this.groups=this.getGroup(this['oneDriverData'].FAgentGUID);
                console.log('this.oneDriverData',this.oneDriverData)
                this.linkVel=(this.driverData.FBindVehicleNameStrs)?(this.driverData.FBindVehicleNameStrs):'';
                //await this.$store.dispatch('companyAble');
                /*if((_this.$store.state.companyAbleId).indexOf(_this.driverCompanyId)==-1){     //编辑而且公司已不可使用
					_this.$message("_原公司已禁用_,_请重新选择_");
				    _this.oneDriverData.FAgentGUID='';
				}*/
			},
			//编辑提交
			editSubmit(formName){
				var _this=this;
				if(new Date(this.timeChange(this[formName].FDrivingStartDate)).getTime()>new Date(this.timeChange(this[formName].FDrivingEndDate)).getTime()){
					_this.message('_开始日期不能大于结束日期_', 'warning');
					return
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						let changeName=this[formName].ce;
						let FGUID=this[formName].FGUID;
						let FAgentGUID=this[formName].FAgentGUID;
						let FVehicleGUIDs=this[formName].FVehicleGUIDs;
						let FGroupGUID=this[formName].FGroupGUID;
						JsonObj.FDrivingStartDate=this.timeChange(JsonObj.FDrivingStartDate);
 						JsonObj.FDrivingEndDate=this.timeChange(JsonObj.FDrivingEndDate);
 						/*delete JsonObj.FGUID;
 						delete JsonObj.FAgentGUID;
						delete JsonObj.FVehicleGUIDs;
						delete JsonObj.FBindVehicleNameStrs;
						delete JsonObj.ce;
						delete JsonObj.FShortName;
						delete JsonObj.FGroupGUID;*/
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "UpdateAdminDriver",
								FT_AdminDriver:JsonObj,
								FGUID:FGUID,
								FAgentGUID:FAgentGUID,
								FGroupGUID:FGroupGUID,
								FVehicleGUIDs:FVehicleGUIDs,
								FVersion: "1.0.0"
							}
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JSON.stringify(postData),
							success: function (data) {
								console.log('aa',JSON.stringify(postData))
								console.log('修改司机',data);
				                if(data.Result==200){
				                	_this.message('_修改成功_', 'success');
				                	_this.driverView=false;
				                	_this.$store.commit('getuserCompany','');
				                	if(_this.numberTab){   //属
				                		_this.tableTopName=changeName;
				                		_this.treeObj={
				                			id:FAgentGUID,
											name:_this.tableTopName,
											fatherId:'',
											type:1
				                		}
				                		_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
										_this.doQueryDAll(_this.pageIndex2,_this.pageSize2,_this.driverKey,-1,_this.treeObj);
				                	}else{              //分组
				                		_this.tableTopName=_this.getLabel(FGroupGUID);
				                		_this.treeObj={
				                			id:FGroupGUID,
											name:_this.tableTopName,
											fatherId:FAgentGUID,
											type:0
				                		}
				                		_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
				                	}
				                }else{
				                	_this.message('_请先解除该司机关联的车辆_', 'warning');
				                }
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
			//获取详情
			async detailD(index,row){
				this.DdetailView=true;
				let id=row.FGUID;
				await this.driverDetail(id);
				this.driverDetailData=this.deepCopy(this.driverData);
				this.driverDetailData.FStatus=(this.driverDetailData.FStatus)?'_启用_':'_禁用_';
				this.listData(this.driverDetailData);
			},
			//点击左侧树获取公司id
			treeCompany(val){  
				console.log('val',val)
				this.tableTopName=val[1]; 
				this.treeObj={
					id:val[0],
					name:val[1],
					fatherId:val[2],
					type:val[3]
				}
				switch(val[3]){
					case 0:
						this.numberTab=false;
						this.activeName='1';
						if(this.pageIndex1==1){
	            			this.doQueryD(this.pageIndex1,this.pageSize1,this.driverKey,-1,this.treeObj);
	            		}else{
	            			this.pageIndex1=1
	            		}
					break;
					case 1:
						this.numberTab=true;
						if(this.pageIndex1==1){
	            			this.doQueryD(this.pageIndex1,this.pageSize1,this.driverKey,-1,this.treeObj);
	            		}else{
	            			this.pageIndex1=1
	            		}
	            		if(this.pageIndex2==1){
	            			this.doQueryDAll(this.pageIndex2,this.pageSize2,this.driverKey,-1,this.treeObj);
	            		}else{
	            			this.pageIndex2=1
	            		}
					break;
				}
			},
			//直属/分组司机
			doQueryD(index,size,key,state,obj){
				let _this = this;
				let FTokenID=_this.$store.state.FTokenID;
				let FIsAll=obj.type?0:2;
				let FAgentGUID=obj.type?obj.id:obj.fatherId;
				let FGroupGUID=obj.type?'':obj.id;
				let postData={
					FTokenID: FTokenID,
					FAction: "QueryAdminDriverList",
					FAgentGUID:FAgentGUID,
					FIsAll:FIsAll,
					FGroupGUID:FGroupGUID,
					FKey:key,
					FState:state,
					FPageSize:size,
					FPageIndex:index,
					FVersion: "1.0.0"
				}
				$.ajax({
					"url": "web/Common/Common_Admin",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (data) {
						console.log('公司直属司机',data);
						var Fobj=data;
						_this.driverList = [];
						if(data.Result==200){
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus=(obj.FStatus==1)?true:false;
								_this.listData(obj)
								_this.driverList.push(obj);
							})
							_this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
						}
					},
					error: function () {
						console.log('_请求失败_')
					}
				});		
			},
			//全部司机
			doQueryDAll(index,size,key,state,obj){
				let _this = this;
				let FTokenID=_this.$store.state.FTokenID;
				let FAgentGUID=obj.id;
				let postData={
					FTokenID: FTokenID,
					FAction: "QueryAdminDriverList",
					FAgentGUID:FAgentGUID,
					FIsAll:1,
					FGroupGUID:'',
					FKey:key,
					FState:state,
					FPageSize:size,
					FPageIndex:index,
					FVersion: "1.0.0"
				}
				$.ajax({
					"url": "web/Common/Common_Admin",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (data) {
						console.log('公司全部司机',data);
						var Fobj=data;
						_this.driverListAll = [];
						if(data.Result==200){
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus=(obj.FStatus==1)?true:false;
								_this.listData(obj)
								_this.driverListAll.push(obj);
							})
							_this.FTotalCount2 = Fobj.FObject.Table[0].FTotalCount;
						}
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			},
			//列表数据优化
			listData(obj){
				obj.FDrivingStartDate=this.parseGMT(obj.FDrivingStartDate.replace(/T/ig,' ')).substring(0,10);
				obj.FDrivingEndDate=this.parseGMT(obj.FDrivingEndDate.replace(/T/ig,' ')).substring(0,10);
				obj.FDrivingType=obj.FDrivingType=='0'?'_大型货车_':obj.FDrivingType=='1'?'_牵引车_':obj.FDrivingType=='2'?'_小型自动挡_':obj.FDrivingType=='3'?'_大型客车_':obj.FDrivingType=='4'?'_城市公交车_':obj.FDrivingType=='5'?'_中型汽车_':obj.FDrivingType=='6'?'_小型汽车_':'_大型货车_';
				obj.FSex=obj.FSex?'_男_':'_女_';

			},
			//搜索
			searchList(){
				if(this.treeObj==''){
					this.message('_请先选择公司或分组_', 'warning');
				}else{
					if(this.activeName==1){
	             		if(this.pageIndex1==1){
	             			this.doQueryD(this.pageIndex1,this.pageSize1,this.driverKey,-1,this.treeObj);
	             		}else{
	             			this.pageIndex1=1;
	             		}
	             	}else if(this.activeName==2){
	             		if(this.pageIndex2==1){
	             			this.doQueryDAll(this.pageIndex2,this.pageSize2,this.driverKey,-1,this.treeObj);
	             		}else{
	             			this.pageIndex2=1;
	             		}
	             	}
				}
			},
			//获取司机详情
			driverDetail(parm){
				var _this=this;
				return new Promise(resove=>{
			    let FGUID=parm;
				let TokenID = this.$store.state.FTokenID;
				$.ajax({
				        "url": "web/Common/Common_Admin",
				        "cache": false,
				        "async": true,
				        "type": "post",
				        "dataType": "json",
				        "contentType": "application/json; charset=utf-8",
				        "data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminDriverByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
				        success: function (data) {
				            console.log('司机详情',data);
				            //_this.driverCompanyId='2bab69f1-4a3d-4191-a0dd-6de57dedae3c';     //当前公司id
				            _this.driverData= data.FObject[0];
				            console.log('driverData',_this.driverData);
				            resove();
				        },
				        error: function () {
				            console.log('_请求失败_')
				        }
			        });	
				})
			},
			//查询司机所有已绑定的车辆
			driverBindVel(parm){
				var _this=this;
				return new Promise(resove=>{
			    let FGUID=parm;
				let TokenID = this.$store.state.FTokenID;
				$.ajax({
				        "url": "web/Common/Common_Admin",
				        "cache": false,
				        "async": true,
				        "type": "post",
				        "dataType": "json",
				        "contentType": "application/json; charset=utf-8",
				        "data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminDriverBindVehicleList","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
				        success: function (data) {
				            console.log('司机绑定车辆',data);
				            if(data.FObject.length>0){
				            	_this.bindArr=[];
				            	$.each(data.FObject, function (index, obj) {
									_this.bindArr.push(obj.FVehicleGUID);
								})
				            }
				            resove();
				        },
				        error: function () {
				            console.log('_请求失败_')
				        }
			        });	
				})
			},
			//多选删除司机
			deleteMore(ids){
				if(this.activeName==1){
					if(this.tableFguids1){
						let arrs=this.tableFguids1;
						this.deleteDriver(arrs);
					}else{
						this.message('_请先勾选_', 'warning');
					}
				}else if(this.activeName==2){
					if(this.tableFguids2){
						let arrs=this.tableFguids2;
						this.deleteDriver(arrs);
					}else{
						this.message('_请先勾选_', 'warning');	
					}
				}
			},
			//单选删除司机
			deleteone(index,row){
				let id=row.FGUID;
				this.deleteDriver(id);
			},
			//删除司机函数
			deleteDriver(parm){
				var _this=this;
		        this.$confirm('_此操作将永久删除_,_是否继续_?', '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
				    })
					.then(() => {
						var deleteFGUID = parm; 
                        let TokenID = this.$store.state.FTokenID;
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteAdminDriver","FVersion": "1.0.0","FGUIDs":"'+deleteFGUID+'"}',
							success: function (data) {
								console.log(data);
								if(data.Result!==200){
				                  	_this.message('_删除失败_', 'warning');
				                }else {
					             	_this.message('_删除成功_', 'success');
					             	if(_this.numberTab){
					             		_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
					             		_this.doQueryDAll(_this.pageIndex2,_this.pageSize2,_this.driverKey,-1,_this.treeObj);
					             	}else{
										_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
					             	}
					            }
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					})
					.catch(() => {
						this.$message.info('_已取消操作_!');
					});

			},
			//多选修改状态
			moreChange(status){
				if(this.activeName==1){
					if(this.tableFguids1){
						let arrs=this.tableFguids1;
						let FState=status?1:0;
						this.changeStatus(FState,arrs);
					}else{
						this.message('_请先勾选_', 'warning');
					}
				}else if(this.activeName==2){
					if(this.tableFguids2){
						let arrs=this.tableFguids2;
						let FState=status?1:0;
						this.changeStatus(FState,arrs);
					}else{
						this.message('_请先勾选_', 'warning');	
					}
				}
			},
			//单选修改状态
			onlyChange(index,row){
				let status=row.FStatus?1:0;
				let id=row.FGUID;
				this.changeStatus(status,id);
			},
			//修改状态函数
			changeStatus(status,ids){
				var _this=this;
				let url="web/Common/Common_Admin";
				let TokenID = this.$store.state.FTokenID;
				let data= {
						FTokenID: TokenID,
						FAction: "UpdateAdminDriverStatus",
						FGUIDs: ids,
						FState: status,
						FVersion: "1.0.0"
					};
				$.post(url,data,function(res){
					console.log("修改状态",res);
					if(res.Result==200){
						_this.message('_修改成功_','success');
		             	if(_this.numberTab){
		             		_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
		             		_this.doQueryDAll(_this.pageIndex2,_this.pageSize2,'',-1,_this.treeObj);
		             	}else{
							_this.doQueryD(_this.pageIndex1,_this.pageSize1,_this.driverKey,-1,_this.treeObj);
		             	}
					}
				}).error(function(){
					console.log('_请求失败_')
				})
			},
			handleSelectionChange1(val){
				this.checkedtabel1=val
				let arr=val;
				let temp=[];
				console.log('arr',arr)
				arr.forEach(obj=> {
					temp.push(obj.FGUID);
				})
				this.tableFguids1=temp.join(',')
			},
			handleSelectionChange2(val){
				this.checkedtabel2=val
				let arr=val;
				let temp=[];
				arr.forEach(obj=> {
					temp.push(obj.FGUID);
				})
				this.tableFguids2=temp.join(',');
			},
			//分页
			handleCurrentChange1(val){
				this.pageIndex1=val;
				this.doQueryD(this.pageIndex1,this.pageSize1,this.driverKey,-1,this.treeObj);
			},
			handleCurrentChange2(val){
				this.pageIndex2=val;
				this.doQueryDAll(this.pageIndex2,this.pageSize2,this.driverKey,-1,this.treeObj);
			},
			handleSizeChange1(val){
				this.pageSize1=val;
				this.doQueryD(this.pageIndex1,this.pageSize1,this.driverKey,-1,this.treeObj);
			},
			handleSizeChange2(val){
				this.pageSize2=val;
				this.doQueryDAll(this.pageIndex2,this.pageSize2,this.driverKey,-1,this.treeObj);
			},
			//点击重置
			resetDriver(){
				this.oneDriverData=this.deepCopy(this.copyDriverData);
				this.linkVel='';
				this.groups=[];
			},
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			},
		},
		directives:{
			focus: {
  				inserted: function (el) {
	    			el.children[0].focus()
	 			 }
			}
		},
	}
</script>
<style scoped>
	.searchBtn {
		border:none;
		background-color:white;
		margin-left:-40px;
		box-shadow:none;
		height:20px !important;
		outline:none;
	}
	#el_table_wrap .el-button {
		padding:0;
	}
</style>
<style>
	.userDialog .el-input-number__decrease,.userDialog .el-input-number__increase{
		line-height:27px;
	}
	.detailTable > thead > tr > th, .detailTable > tbody > tr > th, .detailTable > tfoot > tr > th, .detailTable > thead > tr > td, .detailTable > tbody > tr > td, .tt > tfoot > tr > td{
		border:1px solid #ccc !important;
		vertical-align: middle;
	}
	.userDialog .el-input-number__decrease,.userDialog .el-input-number__increase{
		top:6px;
		height:26px;
	}
</style>
