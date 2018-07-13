<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section>
		<!-- 新增/编辑角色-->
		<div class='jue'>
			<el-dialog :title="createRole?'_新增角色_':'_编辑角色_'" :visible.sync="isShowAddRole" custom-class="addroledialog">
				<el-form :model="RoleForm" :rules="rules" ref="RoleForm" label-width="110px" >
					<el-row>
						<el-col :span="10">
							<el-form-item label="_角色名称_" prop="FName" >
								<el-input v-model.trim="RoleForm.FName" v-focus v-if='isShowAddRole&&createRole'></el-input>
								<el-input v-model.trim="RoleForm.FName" v-if='isShowAddRole&&!createRole'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" >
							<el-form-item label="_简称_" prop="FSimpleName"  label-width="160px">
								<el-input v-model.trim="RoleForm.FSimpleName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_描述_" prop="FDescription">
								<el-input type="textarea" v-model.trim="RoleForm.FDescription" :maxlength="200" :rows="2"
										  placeholder='_最多输入_200_字_'></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button v-if="createRole" type="primary" @click="createSubmit('RoleForm')">_创建_</el-button>
					<el-button v-if="createRole"  @click="resetForm('RoleForm')" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
					<el-button v-if="!createRole" type="primary" @click="editSubmit('RoleForm')">_保存_</el-button>
					<el-button v-if="!createRole" @click='isShowAddRole=false' type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>
		</div>
		<!--角色配置菜单-->
		<div class='menudialog'>
		 	<el-dialog title="_角色菜单设置_" :visible.sync="isShowRoleMenuConfig" custom-class="rolemenuconfigdialog" size="tiny">
				<el-tree
					:data="allMenuList"
					show-checkbox
					node-key="id"
					ref="Roletree"
					:default-expand-all="true"
					:default-checked-keys="checkedKeysArr"
					:render-content="renderContent"
					:props="defaultProps">
				</el-tree>
				<div class='treeFooter'>
					<el-button type="primary" @click="submitRoleMenu">_保存_</el-button>
				</div>
		    </el-dialog>
		</div>

		<div id="operate_wrapper">
			<div class='box-header'>
				<div class="float-left">
					<el-button type="primary" class='el-icon-plus' size="small" @click='addRole'><span
	                    style="color: white">_新建_</span>
	                </el-button>
					<el-button type="primary" class='el-icon-circle-check' size="small" @click='moreChange(true)'>_启用_
					</el-button>
					<el-button type="primary" class="el-icon-circle-close" size="small" @click='moreChange(false)'>_禁用_
					</el-button>
					<!-- <el-button type="primary" icon="circle-close" size="small" @click='aa'>_获取登录角色_
					</el-button> -->
				</div>
				<div class="float-right" style="position: relative;margin-right:30px">
					<input type="text" class='searchIn' placeholder="_请输入角色名称_" v-model="roleKey" @keyup.enter="searchList">
					<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px"
							@click="searchList"></button>
				</div>
			</div>
		</div>
		<!--角色列表-->
		<div id="el_table_wrap" class="el_table_wrap">
			<el-table class="roleList" :data="RoleList" ref="multipleTable1" @selection-change="handleSelectionChange1"
					  :height="table_height" stripe style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
				<el-table-column label="_操作_" width="90">
					<template scope="scope">
						<el-button type="text" size="small" @click="setMenu(scope.row)"><i
							class="el-icon-setting" title='_权限配置_'></i></el-button>
						<!-- <el-button type="text" size="small" @click="menuConfig(scope.$index, scope.row)"><i
							class="el-icon-setting" title='_权限配置_'></i></el-button> -->
						<el-button type="text" size="small" @click="editRole(scope.$index, scope.row)"><i
							class="el-icon-edit" title='_编辑_'></i></el-button>
						<el-button type="text" size="small" @click="deleteone(scope.$index,scope.row)"><i
							class="el-icon-delete" title='_删除_'></i></el-button>
					</template>
				</el-table-column>
				<el-table-column class-name="rolestate" label="_状态_" width="100">
					<template scope="scope">
						<el-switch  v-model="scope.row.FStatus"
								   @change='onlyChange(scope.$index, scope.row)'></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="FSimpleName" label="_角色简称_" width="150"show-overflow-tooltip></el-table-column>
				<el-table-column prop="FName" label="_角色名称_" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FLastUpdateTime" label="_最后修改时间_" width="180" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_" min-width="180" align='left'  class-name='renderCenter'>
				</el-table-column>
			</el-table>
		</div>
		<!--分页-->
		<div class="pagination" id='pagination'>
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
		<role-dialog  ref="roleDialog" ></role-dialog>
	</section>
</template>
<script >
	import  roleDialog from 'components/dialog/roleDialog.vue'
	export default {
		data() {
			return {
				createRole:false,
				roleData:'',
				roleKey:'',
				pageIndex1:1,
				pageSize1:20,
				FTotalCount1:0,
				tableFguids1:'',
				table_height: null,
				anycheck: [],
				relatierol: false,
				isShowAddRole: false,
				isShowEditRole: false,
				isShowRoleMenuConfig: false,
				//树形控件数据
				allMenuList: [],
				checkedKeysArr:[],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				RoleGUID:"",
				tempparentmenu:[],



				searchFKey: '',
				RoleForm: {
					FName: '',
					FSimpleName: '',
					FDescription: '',
					FStatus: 1,
					//FGUID:"",
				},
				copyRoleForm: {
					FName: '',
					FSimpleName: '',
					FDescription: '',
					FStatus: 1,
					//FGUID:"",
				},
				rules: {
					FName: [{required: true, message: '_角色名称不能为空_'}],
					FSimpleName: [{required: true, message: '_角色简称不能为空_'}],
				},

				RoleList: [],
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			roleDialog
		},
		mounted(){
			setTimeout(() => {
				this.adjustPage();
				//this.getAccountMenuList();
			}, 100);
			this.doQuery(1,20,'');
			//this.getAccountMenuList();
		},
		methods: {
			setMenu(data){
				this.$refs.roleDialog.openDialog(data.FGUID);
			},
			//查询角色对应菜单列表
			/*menuConfig(index,row){
				let _this=this;
				this.RoleGUID=row.FGUID;  
				let FGUID=row.FGUID;
				_this.allMenuList=[];
				let TokenID = this.$store.state.FTokenID;
				$.post("web/Common/Common_Admin",{
					FTokenID:TokenID,
					FAction:"QueryAdminMenuListByRoleGUID",
					FRoleGUID:FGUID,
					FVersion:"1.0.0"
				},function(data){
					if(data.Result=="200"){
						console.log('a角色的权限',data);
						_this.isShowRoleMenuConfig=true;
						_this.checkedKeysArr=[];
						_this.allMenuList=_this.tempparentmenu;
						console.log('切系统',_this.allMenuList)
						_this.isShowRoleMenuConfig=true;
						if(data.FObject.length>0){
							for (let i = 0; i < data.FObject.length; i++) {
								var obj = data.FObject[i];
								switch(_this.SystemID){
									case 1:
										if(obj.FMenuLevle=="1"&&obj.FGUID=='9b57ecfc-59bb-44f9-8040-c3d5e9960f16'){
											_this.checkedKeysArr.push(obj.FGUID);   //管理员是整个菜单
										}
										if(obj.FMenuLevle=="2"&&obj.FParentGUID!='9b57ecfc-59bb-44f9-8040-c3d5e9960f16'){
											_this.checkedKeysArr.push(obj.FGUID);
										}
										break;
									case 2:
										if(obj.FMenuLevle=="1"&&obj.FGUID=='386e77f8-8f72-4765-b8f2-5aab40fdbe60'){
											_this.checkedKeysArr.push(obj.FGUID);   //管理员是整个菜单
										}
										if(obj.FMenuLevle=="2"&&obj.FParentGUID!='386e77f8-8f72-4765-b8f2-5aab40fdbe60'){
											_this.checkedKeysArr.push(obj.FGUID);
										}
										break;
									case 4:
										if(obj.FMenuLevle=="1"&&obj.FGUID=='d9e0367f-4c32-4003-bb8c-41240e2453c1'){
											_this.checkedKeysArr.push(obj.FGUID);   //管理员是整个菜单
										}
										if(obj.FMenuLevle=="2"&&obj.FParentGUID!='d9e0367f-4c32-4003-bb8c-41240e2453c1'){
											_this.checkedKeysArr.push(obj.FGUID);
										}
										break; 
									case 6:
										if(obj.FMenuLevle=="1"&&obj.FGUID=='e22ba839-66cf-45a8-a928-a5f7e87e1a34'){
											_this.checkedKeysArr.push(obj.FGUID);   //管理员是整个菜单
										}
										if(obj.FMenuLevle=="2"&&obj.FParentGUID!='e22ba839-66cf-45a8-a928-a5f7e87e1a34'){
											_this.checkedKeysArr.push(obj.FGUID);
										}
										break;  
									case 7:
										if(obj.FMenuLevle=="1"&&obj.FGUID=='9ee16af9-7353-4dbf-b147-5d91ada2b900'){
											_this.checkedKeysArr.push(obj.FGUID);   //管理员是整个菜单
										}
										if(obj.FMenuLevle=="2"&&obj.FParentGUID!='9ee16af9-7353-4dbf-b147-5d91ada2b900'){
											_this.checkedKeysArr.push(obj.FGUID);
										}
										break;  
								}
							}
						}
						console.log('_this.checkedKeysArr',_this.checkedKeysArr);
					}
				}).error(function(){
					console.log('_请求失败_')
				});
			},*/
			//获取该登录账号拥有的菜单
			/*getAccountMenuList(){
				let _this=this;
				let SystemType = this.$store.state.choiceSystemID;
				console.log('SystemType',SystemType)
				let TokenID = this.$store.state.FTokenID;
				$.post("web/Common/Common",{
					FTokenID:TokenID,
					FAction:"QueryMenuList",
					FSystemType:SystemType,
					FVersion:"1.0.0"
				},function(data){
					console.log('账号菜单',data);
					if(data.Result=="200"){
						_this.tempparentmenu=[];
						let adminFather=['9b57ecfc-59bb-44f9-8040-c3d5e9960f16','386e77f8-8f72-4765-b8f2-5aab40fdbe60','d9e0367f-4c32-4003-bb8c-41240e2453c1','e22ba839-66cf-45a8-a928-a5f7e87e1a34','9ee16af9-7353-4dbf-b147-5d91ada2b900']
						for (let i = 0; i < data.FObject.length; i++) {
							let obj=data.FObject[i];
							//不显示首页菜单，每个模块都有
							if(obj.FMenuLevle=="1"){
								_this.tempparentmenu.push({
									id:obj.FGUID,
									label:_this.parseRouteMenu(obj.FICONURLAddress-0).name,
									children:[],
								})
							}
						}
						for (let i = 0; i < data.FObject.length; i++) {
							var obj = data.FObject[i];
							for (let j = 0; j < _this.tempparentmenu.length; j++) {
								var obj_p = _this.tempparentmenu[j];
								if(obj.FMenuLevle=="2"&&obj_p.id==obj.FParentGUID&&(adminFather.indexOf(obj.FParentGUID)==-1)){
									obj_p.children.push({       //管理员下级菜单不参与权限
										id:obj.FGUID,
										p_id:obj_p.id,
										label:_this.parseRouteMenu(obj.FICONURLAddress-0).name,
										children:[],
									});
								}
							}
						}
					}
				});
			},*/
			//批量添加角色菜单
			/*submitRoleMenu(){
				let _this=this;
				let TokenID = this.$store.state.FTokenID;
				let CheckedKeys=this.$refs.Roletree.getCheckedKeys();
				console.log('CheckedKeys',CheckedKeys)
				let newArr=[];
				
				for(var i =0;i<CheckedKeys.length;i++){
					if(newArr.indexOf(CheckedKeys[i]) == -1){
						newArr.push(CheckedKeys[i]);
					}
				}
				switch(this.SystemID){
					case 1:
						if(newArr.indexOf('9b57ecfc-59bb-44f9-8040-c3d5e9960f16')!=-1){
							newArr.push('9391635a-205f-4183-b5b2-0efc0a5e90ef');
							newArr.push('4c769606-5ca8-425f-963a-1a37b54ddc23');
							newArr.push('af5919f0-4d8e-41a9-aa31-2efb92348feb');
							newArr.push('3ea39bae-cb6b-4f1b-b890-d437b0867d6f');
							newArr.push('973938b3-718b-48d3-912f-d05d54054541');
						}
					   	break;
					case 2:
						if(newArr.indexOf('386e77f8-8f72-4765-b8f2-5aab40fdbe60')!=-1){
							newArr.push('14903085-09b3-4dac-bcd6-8d6057a20914');
							newArr.push('6a9990e4-e25a-4b04-a9e6-8933218c0813');
							newArr.push('d17aabd7-f88d-4907-a5dd-f73e7bca3792');
							newArr.push('de855119-4298-42ec-a1a0-2d0e9ee6eac7');
							newArr.push('d02579e4-441a-4385-8179-dcb21d2650fa');
						}
					   	break;
					case 4:
						if(newArr.indexOf('d9e0367f-4c32-4003-bb8c-41240e2453c1')!=-1){
							newArr.push('4fb52192-a323-4217-99de-c267744a275f');
							newArr.push('40191761-7b15-44f4-a3eb-a93e5af054e9');
							newArr.push('05ea2a69-550a-4609-add9-2299fc2c48cc');
							newArr.push('b65a01c4-8252-4e7a-98ce-75b9b4b65883');
							newArr.push('f6e75d05-564d-4674-9d18-917889601471');
						}
					   	break;
					case 6:
						if(newArr.indexOf('e22ba839-66cf-45a8-a928-a5f7e87e1a34')!=-1){
							newArr.push('07628d8b-7f5e-4618-af9d-734a39a3eb92');
							newArr.push('286ba703-64c7-4517-a8b1-a5c80c4d4671');
							newArr.push('d57a7bb7-0afa-4662-80a6-1ad1734684a0');
							newArr.push('b8089a3a-f91d-4547-8397-6608eb45a20c');
						}
					   	break;
					case 7:
						if(newArr.indexOf('9ee16af9-7353-4dbf-b147-5d91ada2b900')!=-1){
							newArr.push('c65c139a-c000-4ef2-bcca-e88ef260716c');
							newArr.push('5ccb58d4-354a-418c-a9df-92d3b9f507a1');
							newArr.push('5aaea716-4c97-47a7-a595-462bf36163e8');
							newArr.push('75ce2dac-5159-447f-a3ef-61fab6c10a26');
							newArr.push('4d234cca-8fe3-48bc-9160-c2f730f5e5e7');
						}
					   	break;
				}
				
				
				let newStr=newArr.join(',');
				$.post("web/Common/Common_Admin",{
					FTokenID:TokenID,
					FAction:"AddAdminRoleAllMenu",
					FRoleGUID:_this.RoleGUID,
					FMenuGUIDs:newStr,
					FVersion:"1.0.0"
				},function(data){
					console.log('配置角色',data);
					if(data.Result=="200"){
						_this.message('_设置成功_', 'success');
					}else {
						_this.message('_设置失败_', 'error');
					}
					_this.isShowRoleMenuConfig=false;
				}).error(function(){
					console.log('_请求失败_')
				});
			},*/
			//点击新增
			addRole(){
				this.createRole=true;
				this.isShowAddRole=true;
				this.RoleForm=this.deepCopy(this.copyRoleForm);
				console.log('this.RoleForm',this.RoleForm)
			},
			//新增提交
			createSubmit(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						//let TokenID='fe19e899-c799-45dd-80d4-630ffe6b03d1';
						let JsonObj=this[formName];
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "AddAdminRole",
								FT_AdminRole:JsonObj,
								FVersion: "1.0.0"
							}
						$.ajax({
							"url": "web/Combine/Combine_Common",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JSON.stringify(postData),
							success: function (data) {
								console.log('新增角色',data);
				                if(data.Result==200){
				                	_this.message('_新增成功_', 'success');
				                	_this.isShowAddRole=false;
				                	_this.doQuery(1,20,'');
				                }else{
				                	_this.message('_名称已被占用_', 'warning');
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
			async editRole(index,row){
				var _this=this;
				this.createRole=false;
				this.isShowAddRole=true;
				var parmId=row.FGUID;  
                await this.roleDetail(parmId); 
                this.RoleForm=this.deepCopy(this.roleData);
                console.log('this.RoleForm',this.RoleForm)  
			},
			//编辑提交
			editSubmit(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						//let TokenID='fe19e899-c799-45dd-80d4-630ffe6b03d1';
						let JsonObj={
							FName:this[formName].FName,
							FSimpleName:this[formName].FSimpleName,
							FDescription:this[formName].FDescription,
							FStatus:this[formName].FStatus
						};
						let FGUID=this[formName].FGUID;
						delete JsonObj.FGUID;
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "UpdateAdminRole",
								FT_AdminRole:JsonObj,
								FGUID:FGUID,
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
								console.log('修改角色',data);
				                if(data.Result==200){
				                	_this.message('_修改成功_', 'success');
				                	_this.isShowAddRole=false;
				                	_this.doQuery(_this.pageIndex1,_this.pageSize1,'');
				                }else{
				                	_this.message('_名称已被占用_', 'warning');
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
			renderContent(h, { node, data, store }) {
				return (
					<span>
						<span>
							<span>{node.label}</span>
						</span>
						<span v-show={node.data.id==="d953ddfb-a9ed-47d0-ac87-feb80e832ac3"} style="color:orange;">
							(_选中后具备开锁权限_)
						</span>
					</span>);
			},
			//获取角色详情
			roleDetail(parm){
				var _this=this;
				return new Promise(resove=>{
			    let FGUID=parm;
				let TokenID = this.$store.state.FTokenID;
				//let TokenID='fe19e899-c799-45dd-80d4-630ffe6b03d1';
				$.ajax({
				        "url": "web/Common/Common_Admin",
				        "cache": false,
				        "async": true,
				        "type": "post",
				        "dataType": "json",
				        "contentType": "application/json; charset=utf-8",
				        "data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminRoleByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
				        success: function (data) {
				            console.log('角色详情',data);
				            _this.roleData= data.FObject[0];
				            console.log('roleData',_this.roleData);
				            resove();
				        },
				        error: function () {
				            console.log('_请求失败_')
				        }
			        });	
				})
			},
			//单选删除角色
			deleteone(index,row){
				let id=row.FGUID;
				this.deleteRole(id);
			},
			//删除角色函数
			deleteRole(parm){
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
                        //let TokenID='fe19e899-c799-45dd-80d4-630ffe6b03d1';
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteAdminRoleByFGUID","FVersion": "1.0.0","FGUID":"'+deleteFGUID+'"}',
							success: function (data) {
								console.log(data);
								if(data.Result!==200){
				                  	_this.message('_请先解除该角色关联的账号_', 'warning');
				                }else {
					             	_this.message('_删除成功_', 'success');
					             	_this.doQuery(_this.pageIndex1,_this.pageSize1,'');
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
				if(this.tableFguids1){
					let arrs=this.tableFguids1;
					let FState=status?1:0;
					this.changeStatus(FState,arrs);
				}else{
					this.message('_请先勾选_', 'warning');
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
						FAction: "UpdateAdminRoleStatus",
						FGUIDs: ids,
						FState: status,
						FVersion: "1.0.0"
					};
				if(status==0){
					this.$confirm('_此操作将解除与用户的关联_,_是否继续_?', '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
				    })
					.then(() => {
						$.post(url,data,function(res){
							console.log("修改状态",res);
							if(res.Result==200){
								_this.message('_修改成功_','success');
								_this.doQuery(1,20,'');
							}
						}).error(function(){
							console.log('_请求失败_')
						})
					})
					.catch(() => {
						this.$message.info('_已取消操作_!');
						_this.doQuery(1,20,'');
					});
				}else{
					$.post(url,data,function(res){
						console.log("修改状态",res);
						if(res.Result==200){
							_this.message('_修改成功_','success');
							_this.doQuery(1,20,'');
						}
					}).error(function(){
						console.log('_请求失败_')
					})
				}
			},
			searchList(){
				let key=this.roleKey;
				this.doQuery(1,20,key);
			},
			//搜索框查询
			doQuery(index,size,key){
				let _this = this;
				let FTokenID=_this.$store.state.FTokenID;
				let postData={
					FTokenID: FTokenID,
					FAction: "QueryAdminRoleList",
					FKey:key,
					FPageSize:size,
					FPageIndex:index,
					FVersion: "1.0.0"
				}
				$.ajax({
					"url": "web/Combine/Combine_Common",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (data) {
						console.log('角色列表',data)
						if(data.Result=="200"){
							var Fobj = data;
							_this.RoleList = [];
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FLastUpdateTime=_this.parseGMT(obj.FLastUpdateTime.replace(/T/ig,' ').substring(0,19));
								obj.FStatus=(obj.FStatus==1)?true:false;
								//空白位补'--'
                                obj.FDescription=obj.FDescription?obj.FDescription:'--';
								_this.RoleList.push(obj);
							});
							_this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
							// _this.dialogVisible = false;
						}else {
							_this.message('_角色列表获取失败_', 'error');
						}
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			},
			handleSizeChange1(val){
				this.pageSize1=val;
				this.doQuery(this.pageIndex1,this.pageSize1,'');
			},
			handleCurrentChange1(val){
				this.pageIndex1=val;
				this.doQuery(this.pageIndex1,this.pageSize1,'');
			},
			handleSelectionChange1(val){
				let arr=val;
				let temp=[];
				console.log('arr',arr)
				arr.forEach(obj=> {
					temp.push(obj.FGUID);
				})
				this.tableFguids1=temp.join(',')
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) + 8;
			},
			//重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
		},
		computed:{
		    SystemID(){
		    	// this.getAccountMenuList();
		        return this.$store.state.choiceSystemID;
		    }
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			},
		},
		directives:{  //局部注册自定义写法
	  		focus:{
	  			inserted:function(el,binding){
	  				console.log('el',el)
	  				console.log('binding',el.children[0])
	  				el.children[0].focus()
	  			}
	  		}
	  	}
	}
</script>
<style scoped>

	.role_menu_config {
		display:inline-block;
		width:14px;
		height:14px;
		background-image:url(/static/img/role_menu_config.png);
		background-repeat:no-repeat;
	}



	.searchBtn {
		border:none;
		background-color:white;
		margin:0 0 0 -40px;
		box-shadow:none;
		height:20px !important;
		outline:none;
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

	/* .el-dialog__body {
		margin:30px 0 0 0;
	} */
	.rolestate label {
		margin-bottom:1px;
	}
</style>
<style>
	.rolemenuconfigdialog .el-dialog__body {
		padding-top:20px;
	}
	.rolemenuconfigdialog .el-dialog__body {
		padding-bottom:10px;
	}
	.rolemenuconfigdialog .el-tree {
		max-height:360px;
		overflow:auto;
	}
	.menudialog .el-dialog{
		width:450px;
	}
	.menudialog .treeFooter{
		margin-top:12px;
		text-align:center;
	}
	.jue .el-col{
	   height:55px;
	}
	@media (min-width:1600px) {   
		.jue .el-dialog{
		    width: 36%;
		} 
    }
    @media (min-width:1300px) and (max-width:1599px){
    	.jue .el-dialog{
		    width: 45%;
		} 
    }
    @media (min-width:1200px) and (max-width:1299px){
    	.jue .el-dialog {
		    width: 52%;
		} 
    }
    @media (max-width:1199px) {
		.jue .el-dialog {
		    width: 50%;
		} 
    } 
</style>