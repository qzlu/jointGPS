<template>
	<div style="height: 100%">
		<!-- 公司详情 -->
		<div class='velcss'>
			<el-dialog title='_公司详情_' :visible.sync="CdetailView">
				<table class="table detailTable" style='table-layout:fixed;'>
					<tbody >
				        <tr style='height:44px'>
				           	<td width="20%" class='likeHeader'><b>_公司简称_</b></td><td width="30%">{{comDetail.FShortName}}</td>
				           	<td width="20%" class='likeHeader'><b>_所属公司_</b></td><td width="30%">{{comDetail.FFatherShortName}}</td>
				        </tr>
						<tr style='height:44px'>
			            	<td class='likeHeader'><b>_公司代号_</b></td><td >{{comDetail.FAgentCode}}</td>
			            	<td class='likeHeader'><b>_公司全称_</b></td><td >{{comDetail.FFullName}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_联系人_</b></td><td >{{comDetail.FContacts}}</td>
			            	<td class='likeHeader'><b>_联系电话_</b></td><td >{{comDetail.FTelephone}}</td>
			            </tr>
		             	<tr style='height:44px'>
			            	<td class='likeHeader'><b>_所属洲_</b></td><td >{{comDetail.FContinent}}</td>
			            	<td class='likeHeader'><b>_所属国家_</b></td><td >{{comDetail.FCountry}}</td>
			            </tr>
						<tr style='height:44px'>
			            	<td class='likeHeader'><b>_邮箱_</b></td><td >{{comDetail.FEMailAddress}}</td>
			            	<td class='likeHeader'><b>_时差_</b></td><td >{{comDetail.FTimeDifferent}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_说明_</b></td><td  colspan="3">{{comDetail.FDescribe}}</td>
			            </tr>
		           </tbody>
				</table>
			</el-dialog>
		</div>
		<!-- 新增/编辑分组 -->
		<div class='editPass'>
			<el-dialog :title="isGroup?'_新增分组_':'_编辑分组_'" :visible.sync="groupView" size="init">
				<el-form :model="groupData" :rules="groupRules" ref="groupData" label-width="110px">
					<el-row>
						<el-form-item label="_分组名称_" prop='FGroupName'>
							<el-input v-model="groupData.FGroupName"></el-input>
						</el-form-item>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer text-center" >
					<el-button v-if='isGroup' type="primary" @click="submitGroup('groupData')">_确定_</el-button>
					<el-button v-if='!isGroup'type="primary" @click="editGroup('groupData')">_确定_</el-button>
				</div>
			</el-dialog>
		</div>
	    <!-- 新增/编辑公司 -->
		<div class='companyDialog'>
			<el-dialog  :title="isCreate?'_新增公司_':'_编辑公司_'" :visible.sync="companyView">
				<el-form :model="companyForm" :rules="rules" ref="companyForm" label-width="120px" >
					<el-col :span="10">
						<el-form-item label="_公司全称_" prop="FFullName">
							<el-input v-model="companyForm.FFullName"></el-input>
						</el-form-item>
						<el-form-item label="_联系人_" prop="FContacts">
							<el-input v-model="companyForm.FContacts"></el-input>
						</el-form-item>
						<el-form-item label="_默认分组_" prop="FGroupName" v-if='isCreate'>
							<el-input v-model="companyForm.FGroupName"></el-input>
						</el-form-item>
						<el-form-item label="_邮箱_" prop="FEMailAddress">
							<el-input v-model="companyForm.FEMailAddress"></el-input>
						</el-form-item>
						<el-form-item label="_所属国家_" prop="FCountry">
							<input type="text" id="quickFilterInput" v-model="companyForm.FCountry" class="el-input__inner" placeholder="_请输入国家英文名称_" />
						</el-form-item>
						<!-- <div class='describeArea' > -->
							<el-form-item label="_描述_" prop="FDescribe" >
								<el-input type="textarea" v-model="companyForm.FDescribe" :maxlength="120" :autosize="{minRows: 2, maxRows:3}" :resize='none'  placeholder='_最多输入_120_字_'></el-input>
							</el-form-item>
						<!-- </div> -->
					</el-col>
					<el-col :span="12">
						<el-form-item label="_公司简称_" prop="FShortName" label-width="160px">
							<el-input v-model="companyForm.FShortName"></el-input>
						</el-form-item>
						<el-form-item label="_联系电话_" prop="FTelephone" label-width="160px">
							<el-input v-model="companyForm.FTelephone"></el-input>
						</el-form-item>
						<el-form-item label="_时差_" label-width="160px" class='timeZone' v-if='isCreate'>
							<el-row >
								<el-col :span="8">
									<el-select v-model="companyForm.timeZoneSign" >
										<el-option
											v-for="item in timeZone.sign"
											:label="item"
											:value="item">
										</el-option>
									</el-select>
								</el-col>
								<el-col :span="7">
									<el-select v-model="companyForm.hour" >
										<el-option
											v-for="item in timeZone.hour"
											:label="item"
											:value="item">
										</el-option>
									</el-select>
								</el-col>
								<el-col :span="1">：</el-col>
								<el-col :span="8">
									<el-select v-model="companyForm.minute" >
										<el-option
											v-for="item in timeZone.minute"
											:label="item"
											:value="item">
										</el-option>
									</el-select>
								</el-col>
							</el-row>
						</el-form-item>
						<div class='ownSysd' v-if='!isCreate'>
							<el-form-item label="_时差_" label-width="160px" class='timeZone'>
								<el-row >
									<el-col :span="8">
										<el-select v-model="companyForm.timeZoneSign" disabled>
											<el-option
												v-for="item in timeZone.sign"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="7">
										<el-select v-model="companyForm.hour" disabled>
											<el-option
												v-for="item in timeZone.hour"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="1">：</el-col>
									<el-col :span="8">
										<el-select v-model="companyForm.minute" disabled>
											<el-option
												v-for="item in timeZone.minute"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</el-col>
								</el-row>
							</el-form-item>
						</div>
						<el-form-item label="_公司代号_" prop="FAgentCode" label-width="160px">
							<el-input v-model="companyForm.FAgentCode"></el-input>
						</el-form-item> 
						<el-form-item label="_所属洲_" prop="FContinent" label-width="160px">
							<el-select v-model="companyForm.FContinent" placeholder="_请选择_" style="width: 100%;">
						      	<el-option label="Asia" value="Asia"></el-option>
						      	<el-option label="Europe" value="Europe"></el-option>
						      	<el-option label="North America" value="North America"></el-option>
						      	<el-option label="South America" value="South America"></el-option>
						      	<el-option label="Africa" value="Africa"></el-option>
						     	 <el-option label="Oceania" value="Oceania"></el-option>
						      	<el-option label="Antarctica" value="Antarctica"></el-option>
						    </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="2"></el-col>
				</el-form>
				<!-- <div v-if='isCreate' class='footButton'> 
					<div class='float-right' style='width:250px;'>
						<el-button type="primary" @click="submitForm('companyForm')" >_保存_</el-button>
						<el-button @click="resetForm('companyForm')" type="button" class='el-button el-button--default cancel el-button--primary '>_重置_</el-button>
					</div>
				</div> -->
				<!-- <div v-if='!isCreate' class='dialog'> 
				    <div class='float-right' style='width:250px;'>
						<el-button  @click="editForm('companyForm')" type="primary">_保存_</el-button>
						<el-button @click="companyView=false" type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
					</div>
				</div> -->
				<div slot="footer" class="dialog-footer" v-if='isCreate'>
					<el-button type="primary" @click="submitForm('companyForm')" >_保存_</el-button>
					<el-button @click="resetForm('companyForm')" type="button" class='el-button el-button--default cancel el-button--primary '>_重置_</el-button>
				</div>
				<div slot="footer" class="dialog-footer" v-if='!isCreate'>
					<el-button  @click="editForm('companyForm')" type="primary">_保存_</el-button>
					<el-button @click="companyView=false" type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>	
		</div>
		<!-- 树 -->
		<div class="carTeamList">
			<!-- <div class='xin'>	 -->
				<el-input
					class="filterInput treeInput"
					placeholder="_输入关键字_"
					v-model="filterTextOne">
				</el-input>
				<el-tree ref="expandOne" class="expand-tree"
						 v-if="isLoadingTree"
						 :data="setTree"
						 node-key="id"
						 highlight-current
						 :props="defaultProps"
						 :expand-on-click-node="false"
						 :render-content="renderContent"
						 default-expand-all
						 :filter-node-method="filterOne"
						 @node-click="handleNodeClick">
				</el-tree>  <!-- :default-expanded-keys="defaultExpandKeys" -->
			<!-- </div> -->
	    </div>
	</div>
</template>
   <!--  </section> -->
<!-- </template> -->
<script>
	//import TreeRender from './tree_render'
	import  TreeRender from 'components/tree/tree_render.vue'
	export default {
		data(){
			/*const checkFDescribe = (rule,value,callback) => {  
 				if(value.length==3){
 					this.message('_最多输入_120_字_','warning')
 				}else{
 					callback();
 				}
	        };*/
	        const checkFPhoneNumber = (rule, value, callback) => {
		        var uPattern = /^[0-9\-\+\(\)]{1,18}$/g;
		        if(!value) {
	                return callback(new Error('_请输入有效号码_'));
	            }
				else if(value&& !uPattern.test(value)){
	            	console.log('error')
	             	callback(new Error('_请输入有效号码_'));
	            } else{
	            	console.log('succ')
	            	callback();
	            }
		    };
		    const checkFshortname = (rule, value, callback) => {   //公司简称长度检测
		        //var uPattern = /^[\u4e00-\u9fa5]{1,10}$|^[A-Za-z]{1,20}$/g;  //10中文或20英文
		        var uPattern = /^.{1,15}$/g;
		        if(!value) {
	                return callback(new Error('_请输入公司简称_'));
	            }
				else if(value&&uPattern.test(value)){
	            	console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	            	callback(new Error('_请输入十五位以内简称_'));
	            }
		    };
		    const checkFFullName = (rule, value, callback) => {   //公司简称长度检测
		        //var uPattern = /^[\u4e00-\u9fa5]{1,15}$|^[A-Za-z]{1,30}$/g;  //10中文或20英文
		        var uPattern = /^.{1,20}$/g;
		        if(!value) {
	                return callback(new Error('_请输入公司全称_'));
	            }
				else if(value&&uPattern.test(value)){
					console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	             	callback(new Error('_请输入二十位以内全称_'));
	            }
		    };
		    const FGroupName = (rule, value, callback) => {   //公司简称长度检测
	            let t=this.strlen(value);
		        if(!value) {
	                return callback(new Error('_请输入分组名称_'));
	            }else{
	            	callback();
	            }
				/*else if(value&&(t<=16)){
	             	callback();
	            } else{
	            	callback(new Error('_请输入少于十六个字符_'));
	            }*/
		    };
			return {
				isGroup:false,
				groupView:false,
				isCreate:false,
				companyView:false,
				CdetailView:false,
				filterTextOne:'',
				comDetail:'',  //公司详情数据
				//maxexpandId: api.maxexpandId,//新增节点开始id
		        //non_maxexpandId: api.maxexpandId,//新增节点开始id(不更改)
		        isLoadingTree: false,//是否加载节点树
		       // setTree: api.treelist,//节点树数据
		        //setTree:'',
		        /*defaultProps: {
		          children: 'children',
		          label: 'name'
		        },*/
		        defaultProps: {
		          children: 'children',
		          label: 'FShortName'
		        },
		        timeZone:{
					sign:['+','-'],
					hour:[
						0,1,2,3,4,5,6,7,8,9,10,11,12
					],
					minute:[0,30,45]
				},
        		defaultExpandKeys: [],//默认展开节点列表
        		companyData:'',
				companyForm:{
					FFatherAgentGUID:'',     //所属公司id
					FAgentCode:'',
					FShortName:'',
					FFullName:'',
					FDescribe:'',
					FContacts:'',
					FTelephone:'',
					FEMailAddress:'',
					FContinent:'',
					FCountry:'China',
					FStatus:1,
					FTimeDifferent:'',
					timeZoneSign:'+',
					hour:0,
					minute:0,
					FGroupName:'',
				},
				copycompanyForm:{
					FFatherAgentGUID:'',
					FAgentCode:'',
					FShortName:'',
					FFullName:'',
					FDescribe:'',
					FContacts:'',
					FTelephone:'',
					FEMailAddress:'',
					FContinent:'',
					FCountry:'China',
					FStatus:1,
					FTimeDifferent:'',
					timeZoneSign:'+',
					hour:0,
					minute:0,
					FGroupName:'',
				},
				groupData:{
					FGroupName:'',
					FAgentGUID:'',
				},
				rules: {
					FShortName: [{required: true,validator: checkFshortname }],
					FFullName: [{required: true,validator: checkFFullName }],
					FContacts: [{required: true, message: '_请输入联系人_'}],
					FEMailAddress: [{type: 'email', message: '_请输入正确的邮箱地址_'}],
					FTelephone:[{required: true, validator: checkFPhoneNumber }],
					FGroupName: [{required: true, validator: FGroupName}],
				},
				groupRules:{
					FGroupName: [{required: true, validator: FGroupName}],
				}
			}
		},
		watch: {
			filterTextOne(val) {
		        this.$refs.expandOne.filter(val);
		    },
		    screenHeight () {
		        this.adjustPage();
		    },
		},
		props: ['typeTable'],
		methods: {
			//新增分组
			groupHandleAdd(s,d,n){
				this.isGroup=true;
				this.groupView=true;
				this['groupData'].FGroupName='';
				this['groupData'].FAgentGUID=d.FGUID;
			},
			//提交新分组
			submitGroup(formName){
				let _this=this;
				this.$refs[formName].validate((valid) => {
			        if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let postData={
								FTokenID: TokenID,
								FAction: "AddAdminGroup",
								FAgentGUID:_this['groupData'].FAgentGUID,
								FGroupName:_this['groupData'].FGroupName,
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
								console.log(data);
								if(data.Result=="200"){
									_this.message('_新增成功_', 'success');
									_this.groupView=false;
									_this.$store.commit('getuserCompany','');
								}else if(data.Result!==200||(data.Result==200&&data.FObject==false)){
									_this.message('_该分组名称已占用_', 'warning'); 
								}
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					}
			        else{
			            console.log('error submit!!');
			            return false;
			        }
		        });
			},
			//修改分组
			groupHandleEdit(s,d,n){
				this.isGroup=false;
				this.groupView=true;
				console.log('d',d)
				this['groupData'].FGroupName=d.FShortName;
				this['groupData'].FGUID=d.FGUID;
			},
			//编辑提交分组
			editGroup(formName){
				let _this=this;
				this.$refs[formName].validate((valid) => {
			        if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let postData={
								FTokenID: TokenID,
								FAction: "UpdateAdminGroup",
								FGUID:_this['groupData'].FGUID,
								FGroupName:_this['groupData'].FGroupName,
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
								console.log(data);
								if(data.Result=="200"){
									_this.message('_修改成功_', 'success');
									_this.groupView=false;
									_this.$store.commit('getuserCompany','');
								}else if(data.Result!==200||(data.Result==200&&data.FObject==false)){
									_this.message('_该分组名称已占用_', 'warning'); 
								}
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					}
			        else{
			            console.log('error submit!!');
			            return false;
			        }
		        });
			},
			//删除分组
			groupHandleDelete(s,d,n){
				var _this=this;
		        console.log('d',d);
		        let tempObj=_this.$store.state.groupNumber;
		       if(tempObj[d.FFatherAgentGUID]==1){
		       		_this.message('_公司下至少保留一个分组_', 'warning');
		       }else{
		       		this.$confirm('_此操作将永久删除_,_是否继续_?', '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
				    })
					.then(() => {
						var deleteFGUID = d.FGUID; 
                        let TokenID = this.$store.state.FTokenID;
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteAdminGroupByFGUID","FVersion": "1.0.0","FGUID":"'+deleteFGUID+'"}',
							success: function (data) {
								console.log(data);

								if(data.Result!==200||(data.Result==200&&data.FObject===false)){
				                  	_this.message('_请先解除该分组的子关联_', 'warning');
				                }else {
					             	_this.message('_删除成功_', 'success');
					                _this.$store.commit('getuserCompany','');
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
		       }
			},
			//点击树新增
		    handleAdd(s,d,n){
		    	console.log('d',d);
		        this.isCreate=true;
                this.companyView=true;
				this.companyForm=this.deepCopy(this.$store.state.copycompanyForm);
				this.companyForm.FFatherAgentGUID=d.FGUID;
				this.companyForm.timeZoneSign=this.getLocalTimeZone().timeZoneSign;
				this.companyForm.hour=this.getLocalTimeZone().hour;
				this.companyForm.minute=this.getLocalTimeZone().minute;
				setTimeout(() => {
					this.initCountry();
				},300);
		    },
			//新增公司提交
			submitForm(formName) {
				let _this=this;
			    this.$refs[formName].validate((valid) => {
			        if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						let FTimeDifferent=this.getTimeZone(this[formName].timeZoneSign,this[formName].hour,this[formName].minute);
						let FGroupName=this[formName].FGroupName;
						delete JsonObj.FTimeDifferent;
						delete JsonObj.timeZoneSign;
						delete JsonObj.minute;
						delete JsonObj.hour;
						delete JsonObj.FGroupName;
						var JsonStr;
 							JsonStr=JSON.stringify({"FTokenID":TokenID,"FAction":"AddSuperAdminAgent","FT_SuperAdminAgent":JsonObj,"FVersion":"1.0.0",'FTimeDifferent':FTimeDifferent,'FGroupName':FGroupName});
 					   console.log('JsonStr',JsonStr)
						$.ajax({
							"url": "web/Common/Common_SuperAdmin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log(data);
								if(data.Result=="200"){
									_this.message('_新增成功_', 'success');
									_this.companyView=false;
									_this.$store.commit('getuserCompany','');
								}else{
									_this.message('_该公司名称已占用_', 'warning');
								}
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					}
			        else{
			            console.log('error submit!!');
			            return false;
			        }
		        });
		    },
		    //点击树编辑
		    async handleEdit(s,d,n){
				this.isCreate=false;
				this.companyView=true;
				let id=d.FGUID;
				await this.companyDetail(id);
				console.log('companyData',this.companyData);
				this.companyForm=this.deepCopy(this.companyData); 
				this.companyForm.timeZoneSign= this.parseTimeZone(this.companyForm.FTimeDifferent).timeZoneSign;
				this.companyForm.hour= this.parseTimeZone(this.companyForm.FTimeDifferent).hour;
				this.companyForm.minute= this.parseTimeZone(this.companyForm.FTimeDifferent).minute;
			},
		    //编辑提交
			editForm(formName) {
				let _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						//let TokenID='fe19e899-c799-45dd-80d4-630ffe6b03d1';
						let JsonObj=this[formName];
						delete JsonObj.timeZoneSign;
						delete JsonObj.minute;
						delete JsonObj.hour;
						delete JsonObj.FTimeDifferent;
						let FGUID=this[formName].FGUID;
						var JsonStr;
 							JsonStr=JSON.stringify({"FTokenID":TokenID,"FAction":"UpdateSuperAdminAgent","FGUID":FGUID,"FT_SuperAdminAgent":JsonObj,"FVersion":"1.0.0"});
						$.ajax({
							"url": "web/Common/Common_SuperAdmin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log(data);
							    if(data.Result=="200"){
							    	_this.message('_修改成功_', 'success');
							    	_this.companyView=false;
									_this.$store.commit('getuserCompany','');
								}else{
									_this.message('_该公司名称已占用_', 'warning');
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
		    //重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//取消提交
			cancelForm(formName){
				this.companyView=false
			},
			//提示信息
			message(msg, type){
				this.$message({
				  showClose: true,
				  message: msg,
				  type: type
				});
			},
			adjustPage(){
				console.log('this.tree_height',this.tree_height);
			},
			//搜索树
			filterOne(value, data) {
		        if (!value) return true;
		        return data.FShortName.indexOf(value) !== -1;
		    },
			initExpand(){
		        this.setTree.map((a) => { 
		        	this.defaultExpandKeys.push(a.FGUID) 
		        });
		        this.isLoadingTree = true;
		        console.log('this.setTree',this.setTree)
		    },
		    handleNodeClick(d,n,s){
		    	console.log('d',d)
		        //d.isEdit = false;   //放弃编辑状态
		        let id=d.FGUID;
		        let name=d.FShortName;
		        let fatherId=d.FFatherAgentGUID;
		        let type=d.type;
            	this.$emit("treeId",[id,name,fatherId,type]);  //查询该公司名下的直属全部数据
		    },
		    renderContent(h,{node,data,store}){//加载节点
		    	let _this=this;
		        return h(TreeRender,{
		          props: {
		            DATA: data,
		            NODE: node,
		            STORE: store,
		            renderID:this.typeTable,
		            maxexpandId: _this.non_maxexpandId
		          },
		          on: {
		            nodeAdd: ((s,d,n) => _this.handleAdd(s,d,n)),
		            nodeEdit: ((s,d,n) => _this.handleEdit(s,d,n)),
		            nodeDel: ((s,d,n) => _this.handleDelete(s,d,n)),
		            nodeDetail: ((s,d,n) => _this.handleDetail(s,d,n)),
		            groupAdd: ((s,d,n) => _this.groupHandleAdd(s,d,n)),
		            groupDel: ((s,d,n) => _this.groupHandleDelete(s,d,n)),
		            groupEdit: ((s,d,n) => _this.groupHandleEdit(s,d,n))
		          }
		        });
		    },
		    async handleDetail(s,d,n){  //查看公司详情
		    	console.log('公司id',d)
		    	this.CdetailView=true;
		    	await this.companyDetail(d.FGUID);
		    	this.comDetail=this.deepCopy(this.companyData);
		    	this.comDetail.FStatus=(this.comDetail.FStatus)?'_启用_':'_禁用_';
		    	this.comDetail.FFatherShortName=(this.comDetail.FFatherShortName==null)?'':this.comDetail.FFatherShortName;
		    	let t=this.parseTimeZone(this.comDetail.FTimeDifferent);
		    	console.log('t',t)
		    	this.comDetail.FTimeDifferent=t.timeZoneSign+t.hour+': '+t.minute;
		    },
			//点击树删除
		    handleDelete(s,d,n){
		    	var _this=this;
		        console.log('d',d);
		        this.$confirm('_此操作将永久删除_,_是否继续_?', '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
				    })
					.then(() => {
						var deleteFGUID = d.FGUID; 
                        let TokenID = this.$store.state.FTokenID;
                        //let TokenID='fe19e899-c799-45dd-80d4-630ffe6b03d1';
						$.ajax({
							"url": "web/Common/Common_SuperAdmin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteSuperAdminAgentByFGUID","FVersion": "1.0.0","FGUID":"'+deleteFGUID+'"}',
							success: function (data) {
								console.log(data);
								if(data.Result!==200){
				                  	_this.message('_请先解除该公司的子关联_', 'warning');
				                }else {
					             	_this.message('_删除成功_', 'success');
					                _this.$store.commit('getuserCompany','');
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
			//获取公司信息
			companyDetail(parm){
				let _this=this;
				return new Promise(resove=>{
			    let FGUID=parm;
				let TokenID = this.$store.state.FTokenID;
				//获取公司详情
				$.ajax({
				        "url": "web/Common/Common_SuperAdmin",
				        "cache": false,
				        "async": true,
				        "type": "post",
				        "dataType": "json",
				        "contentType": "application/json; charset=utf-8",
				        "data": '{"FTokenID": "' + TokenID + '","FAction": "QuerySuperAdminAgentByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
				        success: function (data) {
				            console.log('公司详情',data);
				            
				            _this.companyData= data.FObject[0];   /*父公司和子公司要给出公司名*/

				            resove();
				           /*d.isEdit=false;  //编辑按钮恢复*/
				        },
				        error: function () {
				            console.log('_请求失败_')
				        }
			        });	
				})
			},
			//实例化国家地区选择
			initCountry(){
				var _this=this;
				var quickList=[{"cc":"AF","name":"Afghanistan"},{"cc":"AL","name":"Albania"},{"cc":"DZ","name":"Algeria"},{"cc":"AS","name":"American Samoa"},{"cc":"AD","name":"Andorra"},{"cc":"AO","name":"Angola"},{"cc":"AI","name":"Anguilla"},{"cc":"AQ","name":"Antarctica"},{"cc":"AG","name":"Antigua and Barbuda"},{"cc":"AR","name":"Argentina"},{"cc":"AM","name":"Armenia"},{"cc":"AW","name":"Aruba"},{"cc":"AC","name":"Ascension Islands"},{"cc":"AU","name":"Australia"},{"cc":"AT","name":"Austria"},{"cc":"AZ","name":"Azerbaijan"},{"cc":"BS","name":"Bahamas"},{"cc":"BH","name":"Bahrain"},{"cc":"BD","name":"Bangladesh"},{"cc":"BB","name":"Barbados"},{"cc":"BY","name":"Belarus"},{"cc":"BE","name":"Belgium"},{"cc":"BZ","name":"Belize"},{"cc":"BJ","name":"Benin"},{"cc":"BM","name":"Bermuda"},{"cc":"BT","name":"Bhutan"},{"cc":"BO","name":"Bolivia"},{"cc":"BA","name":"Bosnia and Herzegovina"},{"cc":"BW","name":"Botswana"},{"cc":"BR","name":"Brazil"},{"cc":"IO","name":"British Indian Ocean Territory"},{"cc":"BN","name":"Brunei"},{"cc":"BG","name":"Bulgaria"},{"cc":"BF","name":"Burkina Faso"},{"cc":"BI","name":"Burundi"},{"cc":"KH","name":"Cambodia"},{"cc":"CM","name":"Cameroon"},{"cc":"CA","name":"Canada"},{"cc":"CV","name":"Cape Verde"},{"cc":"KY","name":"Cayman Islands"},{"cc":"CF","name":"Central African Republic"},{"cc":"TD","name":"Chad"},{"cc":"CL","name":"Chile"},{"cc":"CN","name":"China"},{"cc":"CO","name":"Colombia"},{"cc":"KM","name":"Comoros"},{"cc":"CG","name":"Congo"},{"cc":"CD","name":"Congo, The Democratic Republic of the"},{"cc":"CK","name":"Cook Islands"},{"cc":"CR","name":"Costa Rica"},{"cc":"CI","name":"Cote D’Ivoire"},{"cc":"HR","name":"Croatia"},{"cc":"CU","name":"Cuba"},{"cc":"CY","name":"Cyprus"},{"cc":"CZ","name":"Czech Republic"},{"cc":"DK","name":"Denmark"},{"cc":"DJ","name":"Djibouti"},{"cc":"DM","name":"Dominica"},{"cc":"DO","name":"Dominican Republic"},{"cc":"EC","name":"Ecuador"},{"cc":"EG","name":"Egypt"},{"cc":"SV","name":"El Salvador"},{"cc":"GQ","name":"Equatorial Guinea"},{"cc":"ER","name":"Eritrea"},{"cc":"EE","name":"Estonia"},{"cc":"ET","name":"Ethiopia"},{"cc":"FK","name":"Falkland Islands (Malvinas)"},{"cc":"FO","name":"Faroe Islands"},{"cc":"FJ","name":"Fiji"},{"cc":"FI","name":"Finland"},{"cc":"FR","name":"France"},{"cc":"GF","name":"French Guiana"},{"cc":"PF","name":"French Polynesia"},{"cc":"GA","name":"Gabon"},{"cc":"GM","name":"Gambia"},{"cc":"GE","name":"Georgia"},{"cc":"DE","name":"Germany"},{"cc":"GH","name":"Ghana"},{"cc":"GI","name":"Gibraltar"},{"cc":"GR","name":"Greece"},{"cc":"GL","name":"Greenland"},{"cc":"GD","name":"Grenada"},{"cc":"GP","name":"Guadeloupe"},{"cc":"GU","name":"Guam"},{"cc":"GT","name":"Guatemala"},{"cc":"GN","name":"Guinea"},{"cc":"GW","name":"Guinea-Bissau"},{"cc":"GY","name":"Guyana"},{"cc":"HT","name":"Haiti"},{"cc":"HN","name":"Honduras"},{"cc":"HK","name":"Hong Kong S.A.R., China"},{"cc":"HU","name":"Hungary"},{"cc":"IS","name":"Iceland"},{"cc":"IN","name":"India"},{"cc":"ID","name":"Indonesia"},{"cc":"SS","name":"Inmarsat"},{"cc":"IR","name":"Iran"},{"cc":"IQ","name":"Iraq"},{"cc":"IE","name":"Ireland"},{"cc":"IL","name":"Israel"},{"cc":"IT","name":"Italy"},{"cc":"JM","name":"Jamaica"},{"cc":"JP","name":"Japan"},{"cc":"JO","name":"Jordan"},{"cc":"KZ","name":"Kazakhstan"},{"cc":"KE","name":"Kenya"},{"cc":"KI","name":"Kiribati"},{"cc":"KP","name":"Korea, North"},{"cc":"KR","name":"Korea, South"},{"cc":"KW","name":"Kuwait"},{"cc":"KG","name":"Kyrgyzstan"},{"cc":"LA","name":"Laos"},{"cc":"LV","name":"Latvia"},{"cc":"LB","name":"Lebanon"},{"cc":"LS","name":"Lesotho"},{"cc":"LR","name":"Liberia"},{"cc":"LY","name":"Libya"},{"cc":"LI","name":"Liechtenstein"},{"cc":"LT","name":"Lithuania"},{"cc":"LU","name":"Luxembourg"},{"cc":"MO","name":"Macao"},{"cc":"MK","name":"Macedonia"},{"cc":"MG","name":"Madagascar"},{"cc":"MW","name":"Malawi"},{"cc":"MY","name":"Malaysia"},{"cc":"MV","name":"Maldives"},{"cc":"ML","name":"Mali"},{"cc":"MT","name":"Malta"},{"cc":"MH","name":"Marshall Islands"},{"cc":"MQ","name":"Martinique"},{"cc":"MR","name":"Mauritania"},{"cc":"MU","name":"Mauritius"},{"cc":"YT","name":"Mayotte"},{"cc":"MX","name":"Mexico"},{"cc":"FM","name":"Micronesia, Federated States Of"},{"cc":"MD","name":"Moldova"},{"cc":"MC","name":"Monaco"},{"cc":"MN","name":"Mongolia"},{"cc":"ME","name":"Montenegro"},{"cc":"MS","name":"Montserrat"},{"cc":"MA","name":"Morocco"},{"cc":"MZ","name":"Mozambique"},{"cc":"MM","name":"Myanmar"},{"cc":"NA","name":"Namibia"},{"cc":"NR","name":"Nauru"},{"cc":"NP","name":"Nepal"},{"cc":"NL","name":"Netherlands"},{"cc":"AN","name":"Netherlands Antilles"},{"cc":"NC","name":"New Caledonia"},{"cc":"NZ","name":"New Zealand"},{"cc":"NI","name":"Nicaragua"},{"cc":"NE","name":"Niger"},{"cc":"NG","name":"Nigeria"},{"cc":"NU","name":"Niue"},{"cc":"MP","name":"Northern Mariana Islands"},{"cc":"NO","name":"Norway"},{"cc":"OM","name":"Oman"},{"cc":"PK","name":"Pakistan"},{"cc":"PW","name":"Palau"},{"cc":"PS","name":"Palestinian Territory"},{"cc":"PA","name":"Panama"},{"cc":"PG","name":"Papua New Guinea"},{"cc":"PY","name":"Paraguay"},{"cc":"PE","name":"Peru"},{"cc":"PH","name":"Philippines"},{"cc":"PL","name":"Poland"},{"cc":"PT","name":"Portugal"},{"cc":"PR","name":"Puerto Rico"},{"cc":"QA","name":"Qatar"},{"cc":"RE","name":"Reunion"},{"cc":"RO","name":"Romania"},{"cc":"RU","name":"Russia"},{"cc":"RW","name":"Rwanda"},{"cc":"SH","name":"Saint Helena"},{"cc":"KN","name":"Saint Kitts and Nevis"},{"cc":"LC","name":"Saint Lucia"},{"cc":"PM","name":"Saint Pierre and Miquelon"},{"cc":"VC","name":"Saint Vincent and the Grenadines"},{"cc":"WS","name":"Samoa"},{"cc":"SM","name":"San Marino"},{"cc":"ST","name":"Sao Tome and Principe"},{"cc":"SA","name":"Saudi Arabia"},{"cc":"SN","name":"Senegal"},{"cc":"RS","name":"Serbia"},{"cc":"SC","name":"Seychelles"},{"cc":"SL","name":"Sierra Leone"},{"cc":"SG","name":"Singapore"},{"cc":"SK","name":"Slovakia"},{"cc":"SI","name":"Slovenia"},{"cc":"SB","name":"Solomon Islands"},{"cc":"SO","name":"Somalia"},{"cc":"ZA","name":"South Africa"},{"cc":"ES","name":"Spain"},{"cc":"LK","name":"Sri Lanka"},{"cc":"SD","name":"Sudan"},{"cc":"SR","name":"Suriname"},{"cc":"SZ","name":"Swaziland"},{"cc":"SE","name":"Sweden"},{"cc":"CH","name":"Switzerland"},{"cc":"SY","name":"Syria"},{"cc":"TW","name":"Taiwan"},{"cc":"TJ","name":"Tajikistan"},{"cc":"TZ","name":"Tanzania"},{"cc":"TH","name":"Thailand"},{"cc":"TL","name":"Timor-Leste"},{"cc":"TG","name":"Togo"},{"cc":"TK","name":"Tokelau"},{"cc":"TO","name":"Tonga"},{"cc":"TT","name":"Trinidad and Tobago"},{"cc":"TN","name":"Tunisia"},{"cc":"TR","name":"Turkey"},{"cc":"TM","name":"Turkmenistan"},{"cc":"TC","name":"Turks and Caicos Islands"},{"cc":"TV","name":"Tuvalu"},{"cc":"UG","name":"Uganda"},{"cc":"UA","name":"Ukraine"},{"cc":"AE","name":"United Arab Emirates"},{"cc":"GB","name":"United Kingdom"},{"cc":"US","name":"United States"},{"cc":"UY","name":"Uruguay"},{"cc":"UZ","name":"Uzbekistan"},{"cc":"VU","name":"Vanuatu"},{"cc":"VA","name":"Vatican City State (Holy See)"},{"cc":"VE","name":"Venezuela"},{"cc":"VN","name":"Vietnam"},{"cc":"VG","name":"Virgin Islands, British"},{"cc":"VI","name":"Virgin Islands, US"},{"cc":"WF","name":"Wallis and Futuna"},{"cc":"YE","name":"Yemen"},{"cc":"ZM","name":"Zambia"},{"cc":"ZW","name":"Zimbabwe"},{"cc":"VO","name":"iNum"}]


				//focus function for the country filter
				$("#quickFilterInput").focus(function(){
					if($(this).val() == '_请输入国家英文名称_'){
						$(this).val('');
						$(this).removeClass('color-grey');
					}
				});
				//blur function for the country filter
				$("#quickFilterInput").blur(function(){
					if($(this).val() == ''){
						$(this).val('_请输入国家英文名称_');
						$(this).addClass('color-grey');
					}
				});

				//init country filter based on jquery autocomplete
				$("#quickFilterInput").autocomplete(quickList, {
					minChars: 1,
					width: 310,
					matchContains: true,
					max: 10,
					scroll: false,
					formatItem: function(row, i, max) {
						return "<span class=\" flag " + row.cc + "\"></span>"  + row.name;
					},
					formatMatch: function(row, i, max) {
						return "<span class=\" flag " + row.cc + "\"></span>" +  row.name;
					},
					formatResult: function(row) {
						return row.name;
					}
				}).result(function(event, item) {
					_this.companyForm.FCountry=item.name;
				});
			},
		},
		mounted(){
			var _this=this;
			this.initExpand()
      		this.$store.commit('getuserCompany','');
      		// this.$store.commit('getAllGroup','');
			/*var _this = this;
			//模态框垂直居中,兼容小屏幕太向下的问题
			$('#modal').on('shown.bs.modal', function (e) {
				// 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
				$(this).css('display', 'block');
				var modalHeight = $(window).height() / 2 - $('#modal .modal-dialog').height() / 2;
				$(this).find('.modal-dialog').css({
					'margin-top': modalHeight
				});
			});
			//获取所有车辆列表
			if (this.$store.state.allCarsList != null) {
				setData()
			} else {
				this.$store.commit('getAllCarsData', setData)
			}
			function setData() {
				_this.data3 = _this.$store.state.allCarsData;
			}*/
      		setTimeout(() => {
		        this.adjustPage();
		    },100);
		},
		computed:{
			setTree:function(){  //请求store中tree数据
				return this.$store.state.treeData;	
			},
			/*renderID:function(){
				 return this.typeTable;
			}*/
		},
	};
</script>
<style>
	.expand-tree{
	  border:none;
	  margin:5px 0 0 2px;
	}
	.expand-tree .el-tree-node.is-current,
	.expand-tree .el-tree-node:hover{
	  overflow:hidden;
	}
	.expand-tree .is-current>.el-tree-node__content .tree-btn,
	.expand-tree .el-tree-node__content:hover .tree-btn{
	  display:inline-block;
	}
	.expand-tree .is-current>.el-tree-node__content .tree-label{
	  font-weight:600;
	  white-space:normal;
	}
	.describeArea{
		margin-top: 3px;
	}
	.footButton{
		height:35px;
		margin:12px 10px 0 10px;
	}
/*
	.zy{
		height:100%;
		white-space: nowrap;
		width:100%;
	}
*/
	.carTeamList  .el-tree{
		overflow:auto;
		height:96%;
	}
	.tree-expand{
		white-space: normal;
		width:100%;
	}
	.companyDialog .el-form-item{
    	margin-bottom: 14px;
    }
    .treeInput {
    	border:none;
        height: 34px;
    }
    .carTeamList .el-tree-node__content{
    	/*overflow: auto*/
    }
</style>


