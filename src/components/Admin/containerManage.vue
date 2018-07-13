<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section style="height: 100%">
		<!-- 新增/编辑集装箱 -->
		<div class='userDialog'>
	        <el-dialog :title="createCon?'_新增集装箱_':'_编辑集装箱_'" :visible.sync="conView">
				<el-form :model="oneConData" :rules="rules" ref="oneConData" label-width="110px">
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
			                    <img v-if="imageUrl" :src="imageUrl"  >
			                    <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
			                  </el-upload>
			                </el-form-item>
			            </div>
			            <el-form-item label="_尺寸_" prop="FVehicleSerialCode">
			                <el-select v-model="oneConData.FVehicleSerialCode" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in FVehicleSerialCodes" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
			            </el-form-item>
						<el-form-item label="_类型_" prop="FVIN">
			                <el-select v-model="oneConData.FVIN" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in FVINs" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
			            </el-form-item>
			            <el-form-item label="_描述_" prop="FDescription">
							<el-input type="textarea" v-model.trim="oneConData.FDescription" :maxlength="100" :rows="2"
									  placeholder='_最多输入_100_字_'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="1" style='visibility:hidden'>-</el-col>
					<el-col :span="11">
						<div class='containerinput'>
							<el-form-item label="_公司设备_"  prop="ce" label-width="160px" style='height:82px'>
								<div class='cecontent'  @click="focusCompany">
									<div><span style='font-weight:bold'>_所属公司_:</span>{{oneConData.ce}}</div>
									<div><span style='font-weight:bold'>_关联设备_:</span>{{linkVel}}</div>
								</div>
							</el-form-item>
						</div>
						<el-form-item label="_箱号_" prop="FVehicleName" label-width="160px">
							<el-input v-model.trim="oneConData.FVehicleName" style='width:70%' placeholder='_注_:ABCD123456'></el-input><el-input  v-model='containerCode'  style='width:20%' disabled></el-input>
						    <span class="glyphicon glyphicon-heart" style='color:#bbb' :title='tooltip'></span>
						</el-form-item>
						<el-form-item label="_分组_" prop="FGroupGUID" label-width="160px" >
							<el-select v-model="oneConData.FGroupGUID" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
						<!-- <el-form-item label="_所属系统_" prop="FSystemType" label-width="160px" v-if='createCon'>
							<el-select v-model="oneConData.FSystemType" placeholder="_请选择_" style='width:100%' >
									                  	<el-option v-for="item in sysArrs" :key="item.value" :label="item.label" :value="item.value"></el-option>
									                </el-select>
						</el-form-item>
						<div class='ownSysd' v-if='!createCon'>
							<el-form-item label="_所属系统_" prop="FSystemType" label-width="160px" >
								<el-select v-model="oneConData.FSystemType" placeholder="_请选择_" style='width:100%' disabled>
										                  	<el-option v-for="item in sysArrs" :key="item.value" :label="item.label" :value="item.value"></el-option>
										                </el-select>
							</el-form-item>
						</div> -->
					</el-col>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button v-if="createCon" type="primary" @click="createSubmit('oneConData')">_创建_</el-button>
					<el-button v-if="createCon"  @click="resetVel" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
					<el-button v-if="!createCon" type="primary" @click="editSubmit('oneConData')">_保存_</el-button>
					<el-button v-if="!createCon" @click='conView=false' type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
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
	      		<div class='rightTable'>
					<div class='tableTab' style="height: 100%">
						<el-tabs type="border-card" style="height: 44px"  v-model="activeName" >
							<el-tab-pane :label="numberTab?'_直属集装箱_':'_分组集装箱_'" name='1'></el-tab-pane>
							<el-tab-pane label="_全部集装箱_"  name='2' v-if='numberTab'></el-tab-pane>
						</el-tabs>
						<!-- 操作按钮-->
						<div id="operate_wrapper">
							<div class='adminHeader'>
								<div class="float-left">
									<el-button type="primary" class='el-icon-plus' size="small" @click='addCon'><span
					                    style="color: white">_新建_</span>
					                </el-button>
					                <el-button type="primary" class='el-icon-circle-check' size="small" @click='moreChange(true)'>_启用_</el-button>
					                <el-button type="primary" class="el-icon-circle-close" size="small" @click='moreChange(false)'>_禁用_
					                </el-button>
					                <el-button type="primary" class="el-icon-delete" size="small" @click="deleteMore">_删除_</el-button>
								</div>
								<div class="float-right" style="position: relative;margin-right:30px">
									<input type="text" class='searchIn' placeholder="_请输入箱号_" v-model="conKey" @keyup.enter="searchList">
									<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px"
											@click="searchList"></button>
								</div>
							</div>
						</div> 
						<!-- 直属集装箱表格 -->
						<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==1'>
							<span class='tableTop' v-if=''>{{tableTopName}}</span>
							<el-table :data="conList"  @selection-change="handleSelectionChange1" ref="multipleTable1"
									  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
								<el-table-column label="_操作_" width="90">
									<template scope="scope">
									      	<el-button  type="text" size="small" @click="editCon(scope.$index, scope.row)"><i class="el-icon-edit" title='_编辑_'></i></el-button>
										<el-button  type="text" size="small"  @click="deleteone(scope.$index,scope.row)"><i class="el-icon-delete" title='_删除_'></i></el-button>
										<el-button  type="text" size="small"  @click="detailC(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
									</template>
								</el-table-column>
								<el-table-column label="_状态_" width="100">
									<template scope="scope">
										<el-switch  v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
									</template>
								</el-table-column>
								<el-table-column prop="FVehicleName"  label="_箱号_" width="150" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FVehicleSerialCode"   label="_尺寸_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FVIN" label="_类型_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FAssetID"   label="_终端号_" width="120"></el-table-column>
								<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_"  min-width="100"  align='left'  class-name='renderCenter'></el-table-column>
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
						<!-- 全部集装箱表格 -->
						<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==2'>
							<span class='tableTop' v-if=''>{{tableTopName}}</span>
							<el-table :data="conListAll"  @selection-change="handleSelectionChange2" ref="multipleTable2"
									  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
								<el-table-column label="_操作_" width="90">
									<template scope="scope">
									      	<el-button  type="text" size="small" @click="editCon(scope.$index, scope.row)"><i class="el-icon-edit" title='_编辑_'></i></el-button>
										
										<el-button  type="text" size="small"  @click="deleteone(scope.$index,scope.row)"><i class="el-icon-delete" title='_删除_'></i></el-button>
										<el-button  type="text" size="small"  @click="detailC(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
									</template>
								</el-table-column>
								<el-table-column label="_状态_" width="100">
									<template scope="scope">
										<el-switch  v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
									</template>
								</el-table-column>
								<el-table-column prop="FVehicleName"  label="_箱号_" width="150" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FVehicleSerialCode"   label="_尺寸_" width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="FVIN" label="_类型_" width="120" show-overflow-tooltip></el-table-column>
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
		<con-detail ref="conDetail"></con-detail>
		<radio-company :radioCompanyDialog='radioCompanyDialog' v-on:radiochangeC='changeRadioC' v-on:radiochildrenC='radiochildrenC' :typeTable='typeTable' v-on:radiochildrenE='radiochildrenE'></radio-company>
	</section>
</template>
<script >
	import  companyModule from 'components/Company/companyModule.vue'
	import  radioCompany from 'components/Company/radioCompany.vue'
	import  conDetail from 'components/dialog/conDetail.vue'
	export default {
		data() {
			const checkCon = (rule,value,callback) => {  //箱号
		        var par1=/^[A-Z]{4}[0-9]{6}$/g;   //大写字母加数字：
		        if(!par1.test(value)){
		            callback(new Error('_请输入正确格式_'));
		        }else{
		            callback();
		        } 
	        };
			return {
				
				sysArrs:[],
				numberTab:true,
				groups:[],
				tableTopName:'_请选择公司_',
				tooltip:'_格式_:_四位大写字母_+_六位数字_',
				containerCode:'',
				radioCompanyDialog:false,
                CdetailView:false,
				createCon:false,
				conView:false,
				activeName:'1',
				table_height:null,
				typeTable:3,
				conKey:'',
				pageIndex1:1,
				pageSize1:20,
				FTotalCount1:0,
				tableFguids1:'',
				pageIndex2:1,
				pageSize2:20,
				FTotalCount2:0,
				tableFguids2:'',
				imageUrl:'',
				conData:'',      //车辆详情数据
				velDataTrans:'',
				//treeId:'',  //点击左侧树的公司id
				treeObj:'',
				conId:'',   //获取详情传递给子组件的车辆id
				linkVel:'',
				//新增集装箱列表
				oneConData: {
					FVehicleName:'',
			        FVehicleSerialCode:'',
			        FVIN:'',
			        FEngineNumber:'',
			        FVehicleTypeID:3, 
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
				copyConData:{
					FVehicleName:'',
			        FVehicleSerialCode:'',
			        FVIN:'',
			        FEngineNumber:'',
			        FVehicleTypeID:3, 
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
					ce: [{required: true, message: '_请选择公司_'}],
					FVehicleName: [{required: true,validator: checkCon }],
					FVehicleSerialCode: [{required: true, message: '_请选择尺寸_'}],
					FVIN: [{required: true, message: '_请选择类型_'}],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
				},
				conList:[],
				conListAll:[],
				//集装箱尺寸
		        FVehicleSerialCodes: [{
		          label: 22,
		          value: 22
		        },{
		          label: 25,
		          value: 25
		        },{
		          label: 42,
		          value: 42
		        },{
		          label: 45,
		          value: 45
		        },{
		          label: 'L2',
		          value: 'L2'
		        },{
		          label: 'L5',
		          value: 'L5'
		        }],
		        //集装箱型
		        FVINs:[
			        {
			            label: 'G1',
			            value: 'G1'
			        },
			        {
			            label: 'P1',
			            value: 'P1'
			        },
			        {
			            label: 'R1',
			            value: 'R1'
		          	},
			        {
			            label: 'T1',
			            value: 'T1'
		         	},
		         	{
			            label: 'U1',
			            value: 'U1'
		          	},
		         	{
			            label: 'V1',
			            value: 'V1'
		          	},
		        ],
				
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			companyModule,conDetail,radioCompany
		},
		mounted(){
			setTimeout(() => {
				this.adjustPage();
			}, 100);
			this.sysTrans(this.sysHave);
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
				this['oneConData'].FAgentGUID=data[1];
				this['oneConData'].ce=data[0];
				this['oneConData'].FGroupGUID='';  //公司发生改变,FGroupGUID显示就要重选
				this.groups=data[2];
			},
			//接收选择的设备数据
			radiochildrenE(data){
				console.log('子设备',data);
				this['oneConData'].FAssetGUID=data[0];
				this.linkVel=data[1];
				
			},
			//点击新增
			addCon(){
				this.createCon=true;
				this.conView=true;
				this.linkVel='';
				this.oneConData=this.deepCopy(this.copyConData);
				this.oneConData.FSystemType=this.SystemID;
				console.log('this.oneConData',this.oneConData);
				this.groups=[];
				
			},
			//新增提交
			createSubmit(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
			            let JsonObj=this[formName];
			            let changeName=this[formName].ce;
			            JsonObj.FVehicleName=this[formName].FVehicleName+this.containerCode;
			            JsonObj.FInsuDate=this.timeChange(JsonObj.FInsuDate);
			            JsonObj.FPurchaseDate=this.timeChange(JsonObj.FPurchaseDate);
			            JsonObj.FRegisDate=this.timeChange(JsonObj.FRegisDate);
			            JsonObj.FRoadTranDate=this.timeChange(JsonObj.FRoadTranDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
			            JsonObj.FSystemType=(JsonObj.FSystemType==='')?this.SystemID:JsonObj.FSystemType;
			            let FGroupGUID=this[formName].FGroupGUID;
			            //delete JsonObj.FGroupGUID;
			            //delete JsonObj.ce;
			            let FAgentGUID=this[formName].FAgentGUID;
			            var JsonStr;
			            JsonStr=JSON.stringify({
							FTokenID:TokenID,FAction:"AddAdminVehicle",
							FT_AdminVehicle:JsonObj,
							FVersion:"1.0.0",
							FGroupGUID:FGroupGUID
						});
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log('新增集装箱',data);
				                if(data.Result==105){
				                  _this.message('_该箱号已占用_', 'warning');
				                };
				                if(data.Result==200){  
				                	_this.message('_新增成功_', 'success');
				                	_this.conView=false;
					             	if(_this.numberTab){   //属
				                		_this.tableTopName=changeName;
				                		_this.treeObj={
				                			id:FAgentGUID,
											name:_this.tableTopName,
											fatherId:'',
											type:1
				                		}
				                		_this.conTable(1,_this.pageSize1,-1,'',_this.treeObj,'All');
										_this.conTableAll(1,_this.pageSize2,-1,'',_this.treeObj,'All');
				                	}else{              //分组
				                		_this.tableTopName=_this.getLabel(FGroupGUID);
				                		_this.treeObj={
				                			id:FGroupGUID,
											name:_this.tableTopName,
											fatherId:FAgentGUID,
											type:0
				                		}
				                		_this.conTable(1,_this.pageSize1,-1,'',_this.treeObj,'All');
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
			async editCon(index,row){
				var _this=this;
				this.createCon=false;
				this.conView=true;
				var parmId=row.FGUID; 
                await this.ConDetailGet(parmId); 
                console.log('this.oneConData',this.oneConData);
                this.oneConData=this.deepCopy(this.conData);
                this['oneConData'].FVehicleName=this['oneConData'].FVehicleName.substring(0,10);
                this['oneConData'].ce=this.conData.FShortName;
                this['oneConData'].FAgentGUID=this.conData.FAgentGUID;
                this.linkVel=(this.conData.FAssetID)?(this.conData.FAssetID):'';
                this.groups=this.getGroup(this['oneConData'].FAgentGUID);
                this.imageUrl=this.conData.FImage;
                if(this['oneConData'].FAssetGUID=='00000000-0000-0000-0000-000000000000'||this['oneConData'].FAssetGUID==null){
                	this['oneConData'].FAssetGUID='';
                }
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
			           // delete JsonObj.FAgentCompanyName1;  //后台多发一个
			           // delete JsonObj.FShortName1;  
			            //delete JsonObj.FGUID;
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
								console.log('新增集装箱',data);
				                if(data.Result==105){
				                  _this.message('_该箱号已占用_', 'warning');
				                };
				                if(data.Result==200){  
				                	_this.message('_修改成功_', 'success');
				                	_this.conView=false;
					             	if(_this.numberTab){   //属
				                		_this.tableTopName=changeName;
				                		_this.treeObj={
				                			id:FAgentGUID,
											name:_this.tableTopName,
											fatherId:'',
											type:1
				                		}
										_this.conTable(_this.pageIndex1,_this.pageSize1,-1,'',_this.treeObj,'All');
										_this.conTableAll(_this.pageIndex2,_this.pageSize2,-1,'',_this.treeObj,'All');
				                	}else{              //分组
				                		_this.tableTopName=_this.getLabel(FGroupGUID);
				                		_this.treeObj={
				                			id:FGroupGUID,
											name:_this.tableTopName,
											fatherId:FAgentGUID,
											type:0
				                		}
				                		_this.conTable(_this.pageIndex1,_this.pageSize1,-1,'',_this.treeObj,'All');
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
			//详情弹框
			changeDetailC(val){
				this.CdetailView=val;
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) -65;
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
						this.conTable(1,20,-1,'',this.treeObj,'All');
					break;
					case 1:
						this.numberTab=true;
						this.conTable(1,20,-1,'',this.treeObj,'All');
					    this.conTableAll(1,20,-1,'',this.treeObj,'All');
					break;
				}
			},
			//获取集装箱详情
			detailC(index,row){
				this.$refs.conDetail.getConInfo(row.FGUID)
			},
			//多选删除集装箱
			deleteMore(ids){
				if(this.activeName==1){
					if(this.tableFguids1){
						let arrs=this.tableFguids1;
						this.deleteCon(arrs);
					}else{
						this.message('_请先勾选_', 'warning');
					}
				}else if(this.activeName==2){
					if(this.tableFguids2){
						let arrs=this.tableFguids2;
						this.deleteCon(arrs);
					}else{
						this.message('_请先勾选_', 'warning');	
					}
				}
			},
			//单选删除集装箱
			deleteone(index,row){
				let id=row.FGUID;
				this.deleteCon(id);
			},
			//删除集装箱函数
			deleteCon(parm){
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
					             		_this.conTable(_this.pageIndex1,_this.pageSize1,-1,'',_this.treeObj,'All');
					             		_this.conTableAll(_this.pageIndex2,_this.pageSize2,-1,'',_this.treeObj,'All');
					             	}else{
										_this.conTable(_this.pageIndex1,_this.pageSize1,-1,'',_this.treeObj,'All');
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
				let key=this.conKey;
             	if(this.treeObj==''){
					this.message('_请先选择公司或分组_', 'warning');
				}else{
					if(this.activeName==1){
						this.conTable(1,20,-1,key,this.treeObj,'All');
	             	}else if(this.activeName==2){
	             		this.conTableAll(1,20,-1,key,this.treeObj,'All');
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
			             		_this.conTable(_this.pageIndex1,_this.pageSize1,-1,'',_this.treeObj,'All');
			             		_this.conTableAll(_this.pageIndex2,_this.pageSize2,-1,'',_this.treeObj,'All');
			             	}else{
								_this.conTable(_this.pageIndex1,_this.pageSize1,-1,'',_this.treeObj,'All');
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
				this.conTable(this.pageIndex1,this.pageSize1,-1,'',this.treeObj,'All');
			},
			handleCurrentChange2(val){
				this.pageIndex2=val;
				this.conTableAll(this.pageIndex2,this.pageSize2,-1,'',this.treeObj,'All');
			},
			handleSizeChange1(val){
				this.pageSize1=val;
				this.conTable(this.pageIndex1,this.pageSize1,-1,'',this.treeObj,'All');
			},
			handleSizeChange2(val){
				this.pageSize2=val;
				this.conTableAll(this.pageIndex2,this.pageSize2,-1,'',this.treeObj,'All');
			},
			//点击重置
			resetVel(){
				this.oneConData=this.deepCopy(this.copyConData);
				this.linkVel='';
				this.groups=[];
			},
			//上传图片
			handleAvatarSuccess(res, file) {
		        console.log('res',res);
		        console.log('file',file);
		        this.imageUrl = URL.createObjectURL(file.raw);
		        this.oneConData.FImage=res.FObject;
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
		    }
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			},
			"oneConData.FVehicleName" (val){
				var par1=/^[A-Z]{4}[0-9]{6}$/g;   //大写字母加数字：
				if(par1.test(val)){
					this.containerCode=this.Checkcode(val);
				}else{
					this.containerCode='';
				}
			},
			sysHave(){
		    	return this.$store.state.haveSystemIDs;
		    },
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

</style>
