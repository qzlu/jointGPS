<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section style="height: 100%">
		<!-- 批量添加 -->
		<div class='userDialog'>
	        <el-dialog title="_批量添加_" :visible.sync="batchVelView">
				<el-form :model="oneVelData" :rules="batchrules" ref="oneVelData" label-width="130px">
					<el-row>
						<el-col :span="10">
							<div class='batchDialog'>
								<el-form-item label="_关联公司_" prop="ce" label-width="160px">
									<el-input v-model="oneVelData.ce"  class='hoverCursor' @focus="focusCompany" ></el-input>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_分组_" prop="FGroupGUID"  label-width="160px">
								<el-select v-model="oneVelData.FGroupGUID" placeholder="_请选择_" style='width:100%'>
				                  	<el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value"></el-option>
				                </el-select>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_所属系统_" prop="FSystemType" label-width="160px" >
								<el-select v-model="oneVelData.FSystemType" placeholder="_请选择_" style='width:100%' >
				                  	<el-option v-for="item in sysArrs" :key="item.value" :label="item.label" :value="item.value"></el-option>
				                </el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_车辆类型_" prop="FVehicleTypeID" label-width="160px">
				                <el-select v-model="oneVelData.FVehicleTypeID" placeholder="_请选择_" style='width:100%'>
				                  	<el-option v-for="item in FVehicleTypeIDs" :key="item.value" :label="item.label" :value="item.value"></el-option>
				                </el-select>
				            </el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form>
				<div class='batchList'>
                    <el-table :data="batchVelList" empty-text="_暂无数据_" border  style="width:100%"  :row-class-name="tableRowClassName">
                        <el-table-column  prop="index"  label="_序号_"  width="120"></el-table-column>
                        <el-table-column  prop="FVehicleName"  label="_车牌号_" width="200">
                        	<template slot-scope="scope">
						        <el-input v-model="scope.row.FVehicleName" width='100%'></el-input>
						    </template>
                        </el-table-column>
                        <el-table-column  prop="progress"  label="_进度_" min-width="120" ></el-table-column>
                    </el-table>  
                </div>
				<div slot="footer" class="dialog-footer">
					<el-button  type="primary" @click="batchSubmitVel('oneVelData')">_保存_</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 新增/编辑车辆 -->
		<div class='userDialog'>
	        <el-dialog :title="createVel?'_新增车辆_':'_编辑车辆_'" :visible.sync="velView">
				<el-form :model="oneVelData" :rules="rules" ref="oneVelData" label-width="130px">
					<!-- <div style='visibility:hidden'><el-col :span="1">1</el-col></div> -->
					<el-col :span="10">
						<div class='showImage'>
			                <el-form-item label=""  prop="FImage">
			                   <el-upload
			                    class="avatar-uploader"
			                    action="/Web/Common/FileUpload"
			                    :show-file-list="false"
			                    :on-error='uploadFailed'
			                    :before-upload="beforeAvatarUpload"
			                    :on-success="handleAvatarSuccess"
			                    :data="{FAction:'FileUpload',FVersion:'1.0.0',FTokenID:$store.state.FTokenID}">
			                    <img v-if="imageUrl" :src="imageUrl" >
			                    <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
			                  </el-upload>
			                </el-form-item>
			            </div>
						<el-form-item label="_车牌号_" prop="FVehicleName" >
			                <el-input v-model.trim="oneVelData.FVehicleName" v-focus v-if='velView&&createVel'></el-input>
							<el-input v-model.trim="oneVelData.FVehicleName"  v-if='velView&&!createVel'></el-input>
			            </el-form-item>
			            <el-form-item label="_自编号_" prop="FVehicleSerialCode" >
			                <el-input v-model.trim="oneVelData.FVehicleSerialCode"></el-input>
			            </el-form-item>
						<el-form-item label="_车辆类型_" prop="FVehicleTypeID">
			                <el-select v-model="oneVelData.FVehicleTypeID" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in FVehicleTypeIDs" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
			            </el-form-item>
			            <el-form-item label="_描述_" prop="FDescription" >
							<el-input type="textarea" v-model.trim="oneVelData.FDescription" :maxlength="100" :rows="2"
									  placeholder='_最多输入_100_字_'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<div class='threeinput'>
							<el-form-item label="_公司终端司机_" prop="ce"  style='height:82px' label-width="160px">
								<div class='cecontent'  @click="focusCompany">
									<div><span style='font-weight:bold'>_所属公司_:</span>{{oneVelData.ce}}</div>
									<div><span style='font-weight:bold'>_关联终端_:</span>{{linkEquipment}}</div>
									<div><span style='font-weight:bold'>_关联司机_:</span>{{linkDriver}}</div>
								</div>
							</el-form-item>
						</div>
						<el-form-item label="_分组_" prop="FGroupGUID" label-width="160px" >
							<el-select v-model="oneVelData.FGroupGUID" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
						<el-form-item label="_运营类型_" prop="FOperateType"  label-width="160px">
			                <el-select v-model="oneVelData.FOperateType" placeholder="_请选择_" style="width: 100%;">
			                  	<el-option v-for="item in FOperateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
			            </el-form-item>
						<el-form-item label="_所属系统_" prop="FSystemType" label-width="160px" v-if='createVel&&(!linkSys)'>
							<el-select v-model="oneVelData.FSystemType" placeholder="_请选择_" style='width:100%' >
			                  	<el-option v-for="item in sysArrs" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
						<div class='ownSysd' v-if='!createVel||(createVel&&linkSys)'>
							<el-form-item label="_所属系统_" prop="FSystemType" label-width="160px" >
								<el-select v-model="oneVelData.FSystemType" placeholder="_请选择_" style='width:100%' disabled>
				                  	<el-option v-for="item in sysArrs" :key="item.value" :label="item.label" :value="item.value"></el-option>
				                </el-select>
							</el-form-item>
						</div>
					</el-col>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button v-if="createVel" type="primary" @click="createSubmit('oneVelData')">_创建_</el-button>
					<el-button v-if="createVel"  @click="resetVel" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
					<el-button v-if="!createVel" type="primary" @click="editSubmit('oneVelData')">_保存_</el-button>
					<el-button v-if="!createVel" @click='velView=false' type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>
		</div>
	    <!-- 内容展示区 -->
		<div style="height: 100%">
			<div style="height: 100%">
				<!-- 左侧树 -->
			    <div class='leftTree' >
			        <div style="height: 100%" >
			      		<company-module v-on:treeId='treeCompany' :typeTable='typeTable'></company-module>
			      	</div>
			    </div>
				<!-- 右侧列表弹框 -->
	      		<div class='rightTable' >
					<div class='tableTab' style="height: 100%">
						<el-tabs type="border-card" style="height: 44px"  v-model="activeName" >
							<el-tab-pane :label="numberTab?'_直属车辆_':'_分组车辆_'" name='1'></el-tab-pane>
							<el-tab-pane label="_全部车辆_"  name='2' v-if='numberTab'></el-tab-pane>
						</el-tabs>
						<!-- 操作按钮-->
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
					               	<el-button type="primary"  class='el-icon-plus' size="small" @click='batchAdd'><span
					                    style="color: white">_批量添加_</span>
					                </el-button>
								</div>
								<div class="float-right" style="position: relative;margin-right:20px">
									<input type="text" class='searchIn' placeholder="_请输入车牌号_" v-model="velKey" @keyup.enter="searchList">
									<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px"
											@click="searchList"></button>
								</div>
							</div>
						</div> 
						<!-- 直属车辆表格 -->
						<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==1'>
							<span class='tableTop' v-if=''>{{tableTopName}}</span>
							<el-table :data="velList"  @selection-change="handleSelectionChange1" ref="multipleTable1"
									  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
								<el-table-column label="_操作_" width="90">
									<template scope="scope">
									      	<el-button  type="text" size="small" @click="editVel(scope.$index, scope.row)"><i class="el-icon-edit" title='_编辑_'></i></el-button>
										
										<el-button  type="text" size="small"  @click="deleteone(scope.$index,scope.row)"><i class="el-icon-delete" title='_删除_'></i></el-button>
										<el-button  type="text" size="small"  @click="detailV(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
									</template>
								</el-table-column>
								<el-table-column label="_状态_" width="100">
									<template scope="scope">
										<el-switch  v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
									</template>
								</el-table-column>
								<el-table-column prop="FVehicleName"  label="_车牌号_" width="200" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FDriverName" label="_司机姓名_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FVehicleTypeID" label="_车辆类型_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FAssetID"   label="_终端号_" width="120"></el-table-column>
								<el-table-column prop="FShortName"   label="_公司名称_" width="120" v-if='!numberTab'></el-table-column>
								<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_" min-width="100"  align='left'  class-name='renderCenter'></el-table-column>
								
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
						<!-- 全部车辆表格 -->
						<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==2'>
							<span class='tableTop' v-if=''>{{tableTopName}}</span>
							<el-table :data="velListAll"  @selection-change="handleSelectionChange2" ref="multipleTable2"
									  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
								<el-table-column label="_操作_" width="90">
									<template scope="scope">
										<el-button  type="text" size="small" @click="editVel(scope.$index, scope.row)"><i class="el-icon-edit" title='_编辑_'></i></el-button>
										<el-button  type="text" size="small"  @click="deleteone(scope.$index,scope.row)"><i class="el-icon-delete" title='_删除_'></i></el-button>
										<el-button  type="text" size="small"  @click="detailV(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
									</template>
								</el-table-column>
								<el-table-column label="_状态_" width="100">
									<template scope="scope">
										<el-switch  v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
									</template>
								</el-table-column>
								<el-table-column prop="FVehicleName"  label="_车牌号_" width="200" show-overflow-tooltip></el-table-column>
								<!-- <el-table-column prop="FShortName"   label="_公司名称_" width="120" show-overflow-tooltip></el-table-column> -->
								<el-table-column prop="FDriverName" label="_司机姓名_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FVehicleTypeID" label="_车辆类型_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FAssetID"   label="_终端号_" width="120"></el-table-column>
								<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_" min-width="100"  align='left'  class-name='renderCenter'></el-table-column>
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
	    	</div>				
		</div>
		<vel-detail  ref="velDatail"></vel-detail>
		<radio-company :radioCompanyDialog='radioCompanyDialog' v-on:radiochangeC='changeRadioC' v-on:radiochildrenC='radiochildrenC' v-on:radiochildrenE='radiochildrenE'  v-on:radiochildrenD='radiochildrenD' :typeTable='typeTable'></radio-company>	
	</section>
</template>
<script >
	import  companyModule from 'components/Company/companyModule.vue'
	import  radioCompany from 'components/Company/radioCompany.vue'
	import  velDetail from 'components/dialog/velDetail.vue'
	export default {
		data() {
			const checkFVehicleName = (rule, value, callback) => {
		        var uPattern = /^.{1,16}$/g;
	            if(!value) {
	                return callback(new Error('_请输入车牌号_'));
	              }
	            else if(value&&uPattern.test(value)){
	             	callback();
	            } else{
	            	callback(new Error('_请输入少于十六个字符_'));
	            }
		    };
			return {
				batchVelList:[{
					index:1,
					FVehicleName:'',
					progress:''
				},{
					index:2,
					FVehicleName:'',
					progress:''
				},{
					index:3,
					FVehicleName:'',
					progress:''
				},{
					index:4,
					FVehicleName:'',
					progress:''
				},{
					index:5,
					FVehicleName:'',
					progress:''
				}],
				batchFVehicleName:'',
				batchVelView:false,
				linkSys:'',
				sysArrs:[],
				indexSize:true,
				numberTab:true,
				groups:[],
				tableTopName:'_请选择公司_',
                radioCompanyDialog:false,
                VdetailView:false,
				createVel:false,
				velView:false,
				activeName:'1',
				table_height:null,
				typeTable:2,
				velKey:'',
				pageIndex1:1,
				pageSize1:20,
				FTotalCount1:0,
				tableFguids1:'',
				pageIndex2:1,
				pageSize2:20,
				FTotalCount2:0,
				tableFguids2:'',
				imageUrl:'',
				driverCompanyId:'',       //车辆已绑定的公司
				getCompanyId:'',       //保存接收的公司id
				velData:'',      //车辆详情数据
				velDataTrans:'',
				//treeId:'',  //点击左侧树的公司id
				treeObj:'',
				velId:'',   //获取详情传递给子组件的车辆id
				linkEquipment:'',
				linkDriver:'',
				//新增车辆列表
				oneVelData: {
					FVehicleName:'',
			        FVehicleSerialCode:'',
			        FVIN:'',
			        FEngineNumber:'',
			        FVehicleTypeID:'', 
			        FTankVolume:'',
			        FSeatCount:'',
			        FTonnage:'',
			        FMaxVariaLoad:'',
			        FColorRGB:'',
			        FLength:'',
			        FFuelType:'',
			        FFuelConsume:'',
			        FInsuCompany:'',
			        FInsuDate:new Date(),
			        FPurchaseDate:new Date(),
			        FRegisDate:new Date(),
			        FOperPermNumber:'',
			        FRoadTranNumber:'',
			        FRoadTranDate:new Date(),
			        FTechRegDate:new Date(),
			        FImage:'',
			        FOperateType:'',
			        FDriverName:'',
			        FDescription:'',
			        FStatus:1,
			        FAssetGUID:'',     //终端唯一标识ID
			        FAgentGUID:'',      //代理商ID
			        FAdminDriverGUID:'',  //司机id
			        ce:'',
			        FGroupGUID:'',
			        FSystemType:''
				},
				copyVelData:{
					FVehicleName:'',
			        FVehicleSerialCode:'',
			        FVIN:'',
			        FEngineNumber:'',
			        FVehicleTypeID:'', 
			        FTankVolume:'',
			        FSeatCount:'',
			        FTonnage:'',
			        FMaxVariaLoad:'',
			        FColorRGB:'',
			        FLength:'',
			        FFuelType:'',
			        FFuelConsume:'',
			        FInsuCompany:'',
			        FInsuDate:new Date(),
			        FPurchaseDate:new Date(),
			        FRegisDate:new Date(),
			        FOperPermNumber:'',
			        FRoadTranNumber:'',
			        FRoadTranDate:new Date(),
			        FTechRegDate:new Date(),
			        FImage:'',
			        FOperateType:'',
			        FDriverName:'',
			        FDescription:'',
			        FStatus:1,
			        FAssetGUID:'',     //终端唯一标识ID
			        FAgentGUID:'',      //代理商ID
			        FAdminDriverGUID:'',  //司机id
			        ce:'',
			        FGroupGUID:'',
			        FSystemType:''
			    },
				rules:{
					FVehicleName: [{required: true, validator: checkFVehicleName }],
					ce: [{required: true, message: '_请选择公司_'}],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
				},
				batchrules:{
					ce: [{required: true, message: '_请选择公司_'}],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
				},
				velList:[],
				velListAll:[],
				//车辆类型
		        FVehicleTypeIDs: [{
		          label: '_厢车_',
		          value: 0
		        },{
		          label: '_罐车_',
		          value: 1
		        },{
		          label: '_其他_',
		          value: 2
		        }],
		        //运营类型
		        FOperateTypes:[
			        {
			            label: '_经营租赁_',
			            value: '0'
			        },
		         	{
			            label: '_以租代售_',
			            value: '1'
		          	},
		          	{
			            label: '_直销_',
			            value: '2'
		          	},
		          	{
			            label: '_自营_',
			            value: '3'
		          	},
		          	{
			            label: '_试车_',
			            value: '4'
		         	},
		          	{
			            label: '_融资租赁_',
			            value: '5'
			        },
		          	{
			            label: '_其他_',
			            value: '6'
		          	}
		        ],
				
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			companyModule,radioCompany,velDetail
		},
		mounted(){
			this.sysTrans(this.sysHave);
			setTimeout(() => {
				this.adjustPage();
			}, 100);
		},
		methods: {
			tableRowClassName({row, rowIndex}) {
		        if (row.progress === '_该车牌号已占用_') {
		          return 'warning-row';
		        } else if (row.progress === '_保存成功_') {
		          return 'success-row';
		        }
		        return '';
		    },
			batchAdd(){
				this.batchVelView=true;
				this.oneVelData=this.deepCopy(this.copyVelData);
				this.oneVelData.FSystemType=this.SystemID;
				this.groups=[];
				this.linkSys='';
			    $.each(this.batchVelList,function(index,obj){
			    	obj.FVehicleName='';
			    	obj.progress='';
			    });
			},
			//批量添加
			batchSubmitVel(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let changeName=this[formName].ce;
						let JsonObj=this.deepCopy(this.copyVelData);
			            JsonObj.FInsuDate=this.timeChange(JsonObj.FInsuDate);
			            JsonObj.FPurchaseDate=this.timeChange(JsonObj.FPurchaseDate);
			            JsonObj.FRegisDate=this.timeChange(JsonObj.FRegisDate);
			            JsonObj.FRoadTranDate=this.timeChange(JsonObj.FRoadTranDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
			            JsonObj.FSystemType=(this[formName].FSystemType=='')?this.SystemID:this[formName].FSystemType;
			            JsonObj.FVehicleTypeIDs=this[formName].FVehicleTypeIDs;
			            JsonObj.FAgentGUID=this[formName].FAgentGUID;
			            let FGroupGUID=this[formName].FGroupGUID;
			            let FAgentGUID=this[formName].FAgentGUID;
			            var number=0;
			            for(let i=0;i<5;i++){
			            	if(this.batchVelList[i].FVehicleName!==''){
			            		JsonObj.FVehicleName=this.batchVelList[i].FVehicleName;
			            		var JsonStr;
			            		JsonStr=JSON.stringify({FTokenID:TokenID,FAction:"AddAdminVehicle",FT_AdminVehicle:JsonObj,FVersion:"1.0.0",'FGroupGUID':FGroupGUID});
								$.ajax({
									"url": "web/Common/Common_Admin",
									"cache": false,
									"async": true,
									"type": "post",
									"dataType": "json",
									"contentType": "application/json; charset=utf-8",
									"data": JsonStr,
									success: function (data) {
										console.log('新增车辆',data);
						                if(data.Result==105){
											_this.$set(_this.batchVelList[i],'progress','_该车牌号已占用_');
						                }
						                if(data.Result==200){
						                	_this.$set(_this.batchVelList[i],'progress','_保存成功_');
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
													_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
												}else{
													_this.pageIndex1=1
												}
												if(_this.pageIndex2==1){
													_this.velTableAll(_this.pageIndex2,_this.pageSize2,-1,_this.velKey,_this.treeObj,'All');
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
													_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
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
							}else{
								number++;
								if(number==5){
									_this.message('_请输入车牌号_', 'warning');
								}
							}
			            }
					} 
					else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			focusCompany(){
		        this.radioCompanyDialog=true;
		    },
		    //父接收子的公司弹框关闭
		    changeRadioC(val){
				this.radioCompanyDialog=val;
			},
			radiochildrenC(data){
				console.log('子公司',data);
				this['oneVelData'].FAgentGUID=data[1];
				this['oneVelData'].ce=data[0];
				this['oneVelData'].FGroupGUID='';  //公司发生改变,FGroupGUID显示就要重选
				this.groups=data[2];
			},
			//接收选择设备数据
			radiochildrenE(data){
				console.log('车辆设备',data);
				this['oneVelData'].FAssetGUID=data[0];
				this.linkEquipment=data[1];
				this.linkSys=data[2];
			},
			//接收选择司机数据
			radiochildrenD(data){
				console.log('车辆司机',data);
				this['oneVelData'].FAdminDriverGUID=data[0];
				this.linkDriver=data[1];
			},

			/*//接收选择司机数据
			checkchildrenD(data){
				console.log('车辆司机',data);
				this['oneVelData'].FAdminDriverGUID=data[1];
				this.linkDriver=data[0];
			},*/
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) -65;
			},
			//点击新增
			addDriver(){
				this.createVel=true;
				this.velView=true;
				this.oneVelData=this.deepCopy(this.copyVelData);
				this.oneVelData.FSystemType=this.SystemID;
				console.log('this.oneVelData',this.oneVelData);
                this.linkEquipment='';
                this.linkDriver='';
                this.groups=[];
                this.linkSys='';
			},
			//新增提交
			createSubmit(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
			            let JsonObj=this[formName];
			            let changeName=this[formName].ce;
			            JsonObj.FInsuDate=this.timeChange(JsonObj.FInsuDate);
			            JsonObj.FPurchaseDate=this.timeChange(JsonObj.FPurchaseDate);
			            JsonObj.FRegisDate=this.timeChange(JsonObj.FRegisDate);
			            JsonObj.FRoadTranDate=this.timeChange(JsonObj.FRoadTranDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
			            JsonObj.FSystemType=(JsonObj.FSystemType=='')?this.SystemID:JsonObj.FSystemType;
			            let FAgentGUID=this[formName].FAgentGUID;
			            let FGroupGUID=this[formName].FGroupGUID;
			            //delete JsonObj.FGroupGUID;
			            var JsonStr;
			            JsonStr=JSON.stringify({FTokenID:TokenID,FAction:"AddAdminVehicle",FT_AdminVehicle:JsonObj,FVersion:"1.0.0",'FGroupGUID':FGroupGUID});
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log('新增车辆',data);
				                if(data.Result==105){
				                  _this.message('_该车牌号已占用_', 'warning');
				                };
				                if(data.Result==200){  
				                	_this.message('_新增成功_', 'success');
				                	_this.velView=false;
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
				                			_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
				                		}else{
				                			_this.pageIndex1=1
				                		}
				                		if(_this.pageIndex2==1){
				                			_this.velTableAll(_this.pageIndex2,_this.pageSize2,-1,_this.velKey,_this.treeObj,'All');
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
				                			_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
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
			async editVel(index,row){
				var _this=this;
				this.createVel=false;
				this.velView=true;
				var parmId=row.FGUID; 
                await this.VelDetailGet(parmId); 
                console.log('this.oneVelData',this.oneVelData);
               // await this.$store.dispatch('companyAble');
                this.oneVelData=this.deepCopy(this.velData);
                this['oneVelData'].ce=this.velData.FShortName;
                this['oneVelData'].FAgentGUID=this.velData.FAgentGUID;
                this.linkEquipment=(this.velData.FAssetID)?(this.velData.FAssetID):'';
               	this.linkDriver=(this.velData.FDriverName)?(this.velData.FDriverName):'';
                this.groups=this.getGroup(this['oneVelData'].FAgentGUID);	
               	if(this['oneVelData'].FAdminDriverGUID=='00000000-0000-0000-0000-000000000000'||this['oneVelData'].FAdminDriverGUID==null){
                	this['oneVelData'].FAdminDriverGUID='';
                }
                if(this['oneVelData'].FAssetGUID=='00000000-0000-0000-0000-000000000000'||this['oneVelData'].FAssetGUID==null){
                	this['oneVelData'].FAssetGUID='';
                }
                this.imageUrl=this.velData.FImage;
                /*if((_this.$store.state.companyAbleId).indexOf(_this.driverCompanyId)==-1){     //编辑而且公司已不可使用
					_this.$message("_原公司已禁用_,_请重新选择_");
				    _this.oneVelData.FAgentGUID='';
				}*/
			},
			//编辑提交
			editSubmit(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
			            let JsonObj=this[formName];
			            let changeName=this[formName].ce;
			            var FGUID=this[formName].FGUID;
			            JsonObj.FInsuDate=this.timeChange(JsonObj.FInsuDate);
			            JsonObj.FPurchaseDate=this.timeChange(JsonObj.FPurchaseDate);
			            JsonObj.FRegisDate=this.timeChange(JsonObj.FRegisDate);
			            JsonObj.FRoadTranDate=this.timeChange(JsonObj.FRoadTranDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
			            JsonObj.FSystemType=this.SystemID;
			            let FAgentGUID=this[formName].FAgentGUID;
			            let FGroupGUID=this[formName].FGroupGUID;
			            //delete JsonObj.FAgentCompanyName1;  //后台多发一个
			           // delete JsonObj.FShortName1;  
			            //delete JsonObj.FGUID;
			            //delete JsonObj.FGroupGUID;
			            var JsonStr;
			            JsonStr=JSON.stringify({FTokenID:TokenID,FAction:"UpdateAdminVehicle","FGUID":FGUID,FT_AdminVehicle:JsonObj,FVersion:"1.0.0",'FGroupGUID':FGroupGUID});
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log('新增车辆',data);
				                if(data.Result==105){
				                  _this.message('_该车牌号已占用_', 'warning');
				                };
				                if(data.Result==200){  
				                	_this.message('_修改成功_', 'success');
				                	_this.velView=false;
				                	_this.$store.commit('getuserCompany','');
					             	if(_this.numberTab){   //属
				                		_this.tableTopName=changeName;
				                		_this.treeObj={
				                			id:FAgentGUID,
											name:_this.tableTopName,
											fatherId:'',
											type:1
				                		}
										_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
										_this.velTableAll(_this.pageIndex2,_this.pageSize2,-1,_this.velKey,_this.treeObj,'All');
				                	}else{              //分组
				                		_this.tableTopName=_this.getLabel(FGroupGUID);
				                		_this.treeObj={
				                			id:FGroupGUID,
											name:_this.tableTopName,
											fatherId:FAgentGUID,
											type:0
				                		}
				                		_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
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
			//点击左侧树获取公司id
			treeCompany(val){  
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
	            			this.velTable(this.pageIndex1,this.pageSize1,-1,this.velKey,this.treeObj,'All');
	            		}else{
	            			this.pageIndex1=1
	            		}
					break;
					case 1:
						this.numberTab=true;
						if(this.pageIndex1==1){
	            			this.velTable(this.pageIndex1,this.pageSize1,-1,this.velKey,this.treeObj,'All');
	            		}else{
	            			this.pageIndex1=1
	            		}
	            		if(this.pageIndex2==1){
	            			this.velTableAll(this.pageIndex2,this.pageSize2,-1,this.velKey,this.treeObj,'All');
	            		}else{
	            			this.pageIndex2=1
	            		}
					break;
				}
			},
			//获取车辆详情
			detailV(index,row){
				this.$refs.velDatail.getVelInfo(row.FGUID)
			},
			//多选删除车辆
			deleteMore(ids){
				if(this.activeName==1){
					if(this.tableFguids1){
						let arrs=this.tableFguids1;
						this.deleteVel(arrs);
					}else{
						this.message('_请先勾选_', 'warning');
					}
				}else if(this.activeName==2){
					if(this.tableFguids2){
						let arrs=this.tableFguids2;
						this.deleteVel(arrs);
					}else{
						this.message('_请先勾选_', 'warning');	
					}
				}
			},
			//单选删除车辆
			deleteone(index,row){
				let id=row.FGUID;
				this.deleteVel(id);
			},
			//删除车辆函数
			deleteVel(parm){
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
							"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteAdminVehicle","FVersion": "1.0.0","FGUIDs":"'+deleteFGUID+'"}',
							success: function (data) {
								console.log(data);
								if(data.Result!==200){
				                  	_this.message('_删除失败_', 'warning');
				                }else {
					             	_this.message('_删除成功_', 'success');
					             	if(_this.numberTab){
					             		_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
					             		_this.velTableAll(_this.pageIndex2,_this.pageSize2,-1,_this.velKey,_this.treeObj,'All');
					             	}else{
										_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
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
			//搜索
			searchList(){
				//let key=this.velKey;
             	if(this.treeObj==''){
					this.message('_请先选择公司或分组_', 'warning');
				}else{
					this.indexSize=false;
					if(this.activeName==1){
						if(this.pageIndex1==1){
	             			this.velTable(this.pageIndex1,this.pageSize1,-1,this.velKey,this.treeObj,'All');
	             		}else{
	             			this.pageIndex1=1;
	             		}
	             	}else if(this.activeName==2){
	             		if(this.pageIndex2==1){
	             			this.velTableAll(this.pageIndex2,this.pageSize2,-1,this.velKey,this.treeObj,'All');
	             		}else{
	             			this.pageIndex2=1;
	             		}
	             	}
				}
			},
			//修改状态函数
			changeStatus(status,ids){
				var _this=this;
				let url="web/Common/Common_Admin";
				let TokenID = this.$store.state.FTokenID;
				let data= {
						FTokenID: TokenID,
						FAction: "UpdateAdminVehicleStatus",
						FGUIDs: ids,
						FState: status,
						FVersion: "1.0.0"
					};
				$.post(url,data,function(res){
						console.log("修改状态",res);
						if(res.Result==200){
			             	_this.message('_修改成功_','success');
			             	if(_this.numberTab){
			             		_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
			             		_this.velTableAll(_this.pageIndex2,_this.pageSize2,-1,_this.velKey,_this.treeObj,'All');
			             	}else{
								_this.velTable(_this.pageIndex1,_this.pageSize1,-1,_this.velKey,_this.treeObj,'All');
			             	}
						}
					}).error(function(){
						console.log('_请求失败_')
					})
			},
			handleSelectionChange1(val){
				let arr=val;
				let temp=[];
				arr.forEach(obj=> {
					temp.push(obj.FGUID);
				})
				this.tableFguids1=temp.join(',')
			},
			handleSelectionChange2(val){
				let arr=val;
				let temp=[];
				arr.forEach(obj=> {
					temp.push(obj.FGUID);
				})
				this.tableFguids2=temp.join(',')
			},
			//分页
			handleCurrentChange1(val){
				this.pageIndex1=val;
				this.velTable(this.pageIndex1,this.pageSize1,-1,this.velKey,this.treeObj,'All');
			},
			handleCurrentChange2(val){
				this.pageIndex2=val;
				this.velTableAll(this.pageIndex2,this.pageSize2,-1,this.velKey,this.treeObj,'All');
			},
			handleSizeChange1(val){
				this.pageSize1=val;
				this.velTable(this.pageIndex1,this.pageSize1,-1,this.velKey,this.treeObj,'All');
			},
			handleSizeChange2(val){
				this.pageSize2=val;
				this.velTableAll(this.pageIndex2,this.pageSize2,-1,this.velKey,this.treeObj,'All');
			},
			//点击重置
			resetVel(){
				this.oneVelData=this.deepCopy(this.copyVelData);
				this.linkEquipment='';
				this.linkDriver='';
				this.groups=[];
			},
			//上传图片
			handleAvatarSuccess(res, file) {
		        console.log('res',res);
		        console.log('file',file);
		        this.imageUrl = URL.createObjectURL(file.raw);
		        this.oneVelData.FImage=res.FObject;
		    },
		    uploadFailed(err, file, fileList){
		        setTimeout(() => {
		          this.message('_上传失败_','warning');
		        },1000);
		    },
		    beforeAvatarUpload(file) {
		        console.log(file)
		        const isLt2M = file.size / 1024 / 1024 < 2;
		        if (!isLt2M) {
		          this.$message.error('_上传图片大小不能超过_2MB!');
		        }
		        return isLt2M;
		    },

           
		},
		computed:{
		    SystemID(){
		        return this.$store.state.choiceSystemID;
		    },
		    sysHave(){
		    	return this.$store.state.haveSystemIDs;
		    },
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			},
			linkSys(v){
				if(v){
					this.oneVelData.FSystemType=v;
				}else{
					this.oneVelData.FSystemType=this.SystemID;
				}
			}
		},
		directives:{
			focus: {
  				inserted: function (el) {
	    			el.children[0].focus()
	 			 }
			}
		}
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
	.batchList .el-table .cell,.batchList .el-table th div{
		padding-right:0;
		padding-left:0;	
	}
	.batchList .el-table .warning-row {
	    color: red;
	}

	.batchList .el-table .success-row {
	    background: #f0f9eb;
	}
</style>
