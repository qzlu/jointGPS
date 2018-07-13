<template>
	<section style="height: 100%;">
		<div class='tableTab' style="height: 100%;">
			<el-tabs type="border-card" style="height: 100%;" v-model="activeName">
				<el-tab-pane label="_直属用户_"  name='1'>
					<!-- 操作按钮-->
					<div id="operate_wrapper">
						<div class='box-header clearfix'>
							<div class="float-left">
								<el-button type="primary" class='el-icon-plus' size="small" @click='addUser'><span
				                    style="color: white">_新建_</span>
				                </el-button>
				                <el-button type="primary" class='el-icon-circle-check' size="small" @click='moreChange(true)'>_启用_</el-button>
				                <el-button type="primary" class="el-icon-circle-close" size="small" @click='moreChange(false)'>_禁用_
				                </el-button>
							</div>
							<div class="float-right" style="position: relative;margin-right:30px">
								<input class='searchIn' type="text" placeholder="_请输入用户名称_" v-model="userKey" @keyup.enter="searchList">
								<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px"
										@click="searchList"></button>
							</div>
						</div>
					</div> 
					<!-- 直属用户表格 -->
					<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==1'>
						<el-table :data="userList"  @selection-change="handleSelectionChange1" ref="multipleTable1"
								  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
							<el-table-column type="selection"  width="55"></el-table-column>
							<el-table-column prop="RowNo"  label="_序号_" width="80"></el-table-column>
							<el-table-column label="_操作_" width="120">
								<template scope="scope">
								    <el-button size="small" type="text" class="el-icon-setting" @click="setPassword(scope.$index,scope.row)" title='_设置密码_'></el-button>
								    <el-button size="small" type="text" class="el-icon-edit" @click='editUser(scope.$index,scope.row)' title='_编辑_'></el-button>
								    <el-button size="small" type="text" class="el-icon-delete" @click="deleteUser(scope.$index,scope.row)" title='_删除_'></el-button>
								   	<el-button  type="text" size="small"  @click="detailU(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
								</template>
							</el-table-column>
							<el-table-column label="_状态_" width="100">
								<template scope="scope">
									<el-switch  v-model="scope.row.FStatus"  @change="onlyChange(scope.$index, scope.row)"></el-switch>
								</template>
							</el-table-column>
							<el-table-column  prop="FUserName" label="_用户名_" width="180" show-overflow-tooltip></el-table-column>
							<!-- <el-table-column  prop="FRoleName" label="_角色名_" width="150" show-overflow-tooltip></el-table-column> -->
							<el-table-column  prop="FCountry" label="_国家_" width="180" show-overflow-tooltip></el-table-column>
							<!-- <el-table-column  prop="timeZone" label="_时差_" width="100" show-overflow-tooltip></el-table-column> -->
							<el-table-column  prop="FDescribe" label="_描述_" min-width="180" show-overflow-tooltip align='left'  class-name='renderCenter'></el-table-column>
						</el-table>
					</div>
					<!-- 分页 -->
					<div class="pagination" id='pagination'  v-if='activeName==1'>
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
				</el-tab-pane>
				<el-tab-pane label="_全部用户_"  name='2'>
					<!-- 操作按钮-->
					<div id="operate_wrapper">
						<div class='box-header clearfix'>
							<div class="float-left">
								<el-button type="primary" class='el-icon-plus' size="small" @click='addUser'><span
				                    style="color: white">_新建_</span>
				                </el-button>
				                <el-button type="primary" class='el-icon-circle-check' size="small" @click='moreChange(true)'>_启用_</el-button>
				                <el-button type="primary" class="el-icon-circle-close" size="small" @click='moreChange(false)'>_禁用_
				                </el-button>
							</div>
							<div class="float-right" style="position: relative;margin-right:30px">
								<input class='searchIn' type="text" placeholder="_请输入用户名称_" v-model="userKey" @keyup.enter="searchList">
								<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px"
										@click="searchList"></button>
							</div>
						</div>
					</div> 
					<!-- 全部用户表格 -->
					<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==2'>
						<el-table :data="userListAll"  @selection-change="handleSelectionChange2" ref="multipleTable2"
								  :height="table_height" stripe style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
							<el-table-column type="selection"  width="55"></el-table-column>
							<el-table-column prop="RowNo"  label="_序号_" width="80"></el-table-column>
							<el-table-column label="_操作_" width="120">
								<template scope="scope">
									<el-button size="small" type="text" class="el-icon-setting" @click="setPassword(scope.$index,scope.row)" title='_设置密码_'></el-button>
								    <el-button size="small" type="text" class="el-icon-edit" @click='editUser(scope.$index,scope.row)' title='_编辑_'></el-button>
								    <el-button size="small" type="text" class="el-icon-delete" @click="deleteUser(scope.$index,scope.row)" title='_删除_'></el-button>
								   	<el-button  type="text" size="small"  @click="detailU(scope.$index,scope.row)"><i class="el-icon-info" title='_详情_'></i></el-button>
								</template>
							</el-table-column>
							<el-table-column label="_状态_" width="100">
								<template scope="scope">
									<el-switch  v-model="scope.row.FStatus"  @change="onlyChange(scope.$index, scope.row)"></el-switch>
								</template>
							</el-table-column>
							<el-table-column prop="FUserName" label="_用户名_" width="180" show-overflow-tooltip></el-table-column>
							<!-- <el-table-column  prop="FRoleName" label="_角色名_" width="150" show-overflow-tooltip></el-table-column>
							<el-table-column  prop="FShortName" label="_所属公司_" width="200" show-overflow-tooltip></el-table-column> -->
							<el-table-column  prop="FCountry" label="_国家_" width="180" show-overflow-tooltip></el-table-column>
							<!-- <el-table-column  prop="timeZone" label="_时差_" width="100" show-overflow-tooltip></el-table-column> -->
							<el-table-column  prop="FDescribe" label="_描述_" min-width="180"  align='left'  class-name='renderCenter' show-overflow-tooltip></el-table-column>
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
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- 用户详情 -->
		<div class='velcss'>
			<el-dialog title='_用户详情_' :visible.sync="UdetailView">
				<table class="table detailTable" style='table-layout:fixed;'>
					<tbody >
						<tr style='height:44px'>
			            	<td class='likeHeader'><b>_用户名称_</b></td><td >{{userDetailData.FUserName}}</td>
			            	<td class='likeHeader'><b>_状态_</b></td><td >{{userDetailData.FStatus}}</td>
			            </tr>
				        <tr style='height:44px'>
				           <td class='likeHeader'><b>_默认系统_</b></td><td >{{userDetailData.FDefaultSystemId}}</td>
				           <td class='likeHeader'><b>_国家_</b></td><td >{{userDetailData.FCountry}}</td>
				        </tr>
				        <tr style='height:44px'>
			            	<td class='likeHeader'><b>_联系人_</b></td><td >{{userDetailData.FContacts}}</td>
			            	<td class='likeHeader'><b>_联系电话_</b></td><td >{{userDetailData.FTelephone}}</td> 
			            </tr>
						<!-- <tr style='height:44px'>
									            	<td width="20%" class='likeHeader'>_系统_Logo</td><td width="30%">{{userDetailData.Logo}}</td>
									            	<td class='likeHeader'>_时差_</td><td >{{userDetailData.FTimeDifferent}}</td>
									            </tr> -->
			            
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_创建时间_</b></td><td >{{userDetailData.FCreateTime}}</td>
			            	<!-- <td class='likeHeader'>_修改时间_</td><td >{{userDetailData.FLastUpdateTime}}</td>  -->
			            	<td class='likeHeader'><b>_邮箱_</b></b></td><td >{{userDetailData.FEMailAddress}}</td> 
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_公司简称_</b></td><td  colspan="3">{{userDetailData.FShortName}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_系统权限_</b></td><td  colspan="3">{{userDetailData.FHaveSystemIds}}</td>
			            </tr>
			            <tr style='height:44px'>
			            	<td class='likeHeader'><b>_描述_</b></td><td  colspan="3">{{userDetailData.FDescribe}}</td>
			            </tr>
		           </tbody>
				</table>
			</el-dialog>
		</div>
		<!-- 编辑密码弹框 -->
		<div class='editPass'>
			<el-dialog title="_修改用户密码_" :visible.sync="editpassView" size="init">
				<el-form :model="passwordData" :rules="passwordRules" ref="passwordData" label-width="140px">
					<el-row>
						<el-form-item label="_用户名_" >
							<el-input v-model="passwordData.name" disabled ></el-input>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="_新密码_" prop="FPassword" >
							<el-input v-model="passwordData.FPassword" type='password'  placeholder="_请输入新密码_"></el-input>
						</el-form-item>
					</el-row>
					 <el-row>
						<el-form-item label="_确认密码_" prop="checkPass" >
							<el-input v-model="passwordData.checkPass" type='password'  placeholder="_请输入密码_"></el-input>
						</el-form-item>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="submitPass('passwordData')">_确定_</el-button>
					<el-button  @click="editpassView=false" type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 新增/编辑用户 -->
		<div class='userDialog'>
	        <el-dialog :title="createUser?'_新增用户_':'_编辑用户_'" :visible.sync="userView">
				<el-form :model="oneUserData" :rules="rules" ref="oneUserData" label-width="120px">
					<el-row>
						<el-col :span="10">
							<el-form-item label="_用户名_" prop="FUserName" >
								<el-input v-model.trim="oneUserData.FUserName" :disabled="!createUser" placeholder="_请输入用户名_" v-focus v-if='userView&&createUser'></el-input>
								<el-input v-model.trim="oneUserData.FUserName" :disabled="!createUser" placeholder="_请输入用户名_"  v-if='userView&&!createUser'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_关联公司_" prop="FAgentGUIDsname" label-width="160px">
								<el-input v-model="oneUserData.FAgentGUIDsname"  class='hoverCursor' @focus="focusCompany" :title='oneUserData.FAgentGUIDsname'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row v-if="createUser">
						<el-col :span="10">
							<el-form-item  label="_密码_" prop="FPassword" >
								<el-input v-model.trim="oneUserData.FPassword" type='password'  placeholder="_请输入密码_"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_确认密码_" prop="checkPass" label-width="160px">
								<el-input v-model.trim="oneUserData.checkPass" type="password"  placeholder="_请确认密码_"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="22">
							<div class='roleSel' style='margin-top:3px'>
								<el-form-item label="_角色简称_"  prop="FRoleGUIDs"  >
									<el-select v-model="oneUserData.FRoleGUIDs" multiple placeholder="_请选择_" style='width:100%' size='small'>
									    <el-option
									      v-for="item in roleList"
									      :key="item.value"
									      :label="item.name"
									      :value="item.value">
									    </el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item  label="_联系人电话_" prop="FTelephone" >
								<el-input v-model.trim="oneUserData.FTelephone" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_联系人_" prop="FContacts" label-width="160px">
								<el-input v-model.trim="oneUserData.FContacts" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row class='systemErrors'>
					    <el-col :span='24'>
							<el-form-item label="_系统权限_"  prop="FHaveSystemIds">
								<el-checkbox-group v-model="oneUserData.FHaveSystemIds">
								   	<el-checkbox label='1' name="FHaveSystemIds" :disabled="sysHave.indexOf(1)==-1">_接甩挂_</el-checkbox>
								   	<el-checkbox label='2' name="FHaveSystemIds" :disabled="sysHave.indexOf(2)==-1">_智能电子锁_</el-checkbox>
								   	<!-- <el-checkbox label='3' name="FHaveSystemIds">_冷链系统_</el-checkbox> -->
								   	<el-checkbox label='4' name="FHaveSystemIds" :disabled="sysHave.indexOf(4)==-1">_车队管理_</el-checkbox>
								   	<el-checkbox label='6' name="FHaveSystemIds" :disabled="sysHave.indexOf(6)==-1">_集装箱管理_</el-checkbox>
								   	<el-checkbox label='7' name="FHaveSystemIds" :disabled="sysHave.indexOf(7)==-1">_智能配送_</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
					    </el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_默认系统_"   prop="FDefaultSystemId">
								<el-select v-model="oneUserData.FDefaultSystemId" placeholder="_请选择默认系统_" style='width:100%'>
									<el-option v-for="item in FDefaultSystemIds"  :label="item.name" :value="item.val" ></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_国家地区_"  prop="FCountry" label-width="160px">
								<input type="text" id="quickFilterInput" v-model="oneUserData.FCountry" class="el-input__inner" placeholder="_请输入国家英文名称_" />
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<!-- <el-row>
						<el-col :span="12">
							<el-form-item label="_时差_" label-width="160px">
								<el-row >
									<el-col :span="8">
										<el-select v-model="oneUserData.timeZoneSign">
											<el-option
												v-for="item in timeZone.sign"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="7">
										<el-select v-model="oneUserData.hour">
											<el-option
												v-for="item in timeZone.hour"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="1">：</el-col>
									<el-col :span="8">
										<el-select v-model="oneUserData.minute">
											<el-option
												v-for="item in timeZone.minute"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</el-col>
								</el-row>
							</el-form-item> 
						</el-col>
						<el-col :span="2"></el-col>
					</el-row> -->
					<el-row>
						<el-col :span="10">
							<el-form-item  label="_邮箱_" prop="FEMailAddress" >
								<el-input v-model.trim="oneUserData.FEMailAddress" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if='HaveLogo==0'>
							<el-form-item label="_描述_" prop="FDescribe" label-width="160px">
								<el-input type="textarea" v-model.trim="oneUserData.FDescribe" :maxlength="100" :rows="2"
										  placeholder='_最多输入_100_字_'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12' v-if='HaveLogo==1'>
							<div class='logoUP'>
								<el-form-item label='_用户_logo' prop="FSystemLogoURL" label-width="160px">
								    <span style='display:inline-block;width:135px;height:30px;margin-top:6px'>
										<el-upload
											class="avatar-uploader"
											action="/Web/Common/FileUpload"
											:show-file-list="false"
											:on-error='uploadFailed'
											:before-upload="beforeAvatarUpload"
											:on-success="handleAvatarSuccess"
											:on-progress='onprogress'
											:data="{FAction:'FileUpload',FVersion:'1.0.0',FTokenID:$store.state.FTokenID}">
											<img v-if="imageUrl" :src="imageUrl" class="avatar" >
											<i v-else class="el-icon-plus avatar-uploader-icon" ></i>
										</el-upload>
									</span>
									<div v-if="imageUrl" style='display:inline-block'>
										<el-button size="small" type="text" class="el-icon-circle-close" style='padding:0' @click="deleteLogo"></el-button>
									</div>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="10" v-if='HaveLogo==1'>
							<el-form-item label="_描述_" prop="FDescribe">
								<el-input type="textarea" v-model.trim="oneUserData.FDescribe" :maxlength="100" :rows="2"
										  placeholder='_最多输入_100_字_'></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button v-if="createUser" type="primary" @click="createSubmit('oneUserData')">_创建_</el-button>
					<el-button v-if="createUser"  @click="resetUser" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
					<el-button v-if="!createUser" type="primary" @click="editSubmit('oneUserData')">_保存_</el-button>
					<el-button v-if="!createUser" @click='userView=false' type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 用户多选公司组件 -->
		<check-company :checkCompanyDialog='checkCompanyDialog' :createUser='createUser' v-on:checkchangeC='changeCheckC' v-on:childrenC='childrenDataC' :chooseCompanyId='chooseCompanyId'></check-company>
	</section>
</template>
<script >
	require("!style!css!plugins/Autocomplete/Autocomplete.css")
	require("plugins/Autocomplete/Autocomplete.js")
	import  companyModule from 'components/Company/companyModule.vue'
	import  checkCompany from 'components/Company/checkCompany.vue'
	/*import  companyModule from './companyModule.vue'
	import  checkCompany from './checkCompany.vue'*/
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('_请输入密码_'));
				} else {
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('_请再次输入密码_'));
				} else if (value !== this.oneUserData.FPassword) {
					callback(new Error('_两次输入密码不一致_!'));
				} else {
					callback();
				}
			};
			var validatePass3= (rule, value, callback) => {
				if (value === '') {
					callback(new Error('_请输入密码_'));
				} else if (value !== this.passwordData.FPassword) {
					callback(new Error('_两次输入密码不一致_!'));
				} else {
					callback();
				}
			};
			const validateUserName = (rule,value,callback) => {  
 				var uPattern = /^[a-zA-Z0-9_]{3,16}$/;
	            if(!value) {
	                return callback(new Error('_请输入用户名_'));
	              }
	            else if(value&& uPattern.test(value)){
	             	callback();
	            } else{
	            	callback(new Error('_请输入_(3~16)_位字母_、_数字_、_'));
	            }
	        };
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
                checkCompanyDialog:false,
				createUser:false,
				userView:false,
				editpassView:false,
				activeName:'1',
				table_height:null,
				setTree:null,
				userKey:'',
				pageIndex1:1,
				pageSize1:20,
				FTotalCount1:0,
				tableFguids1:'',
				pageIndex2:1,
				pageSize2:20,
				FTotalCount2:0,
				tableFguids2:'',
				userDetailData:'',
				imageUrl:'',
				UdetailView:false,
				chooseCompanyId:'',
				userCompanyId:'',          //用户已绑定的公司
				//userCompanyAbleId:[],    //可用的公司id
				//userCompanyList:[],      //可用的公司
				userRoleId:'',
				userRoleAbleId:[],
				userRoleList:[],
				roleList:[],
				userData:'',               //用户详情数据
				sysHave:'',                //登录用户系统权限
				FDefaultSystemIds:[],      //用户默认数组
				editDefault:'',            //编辑获取的默认权限优先
				/*timeZone:{
					sign:['+','-'],
					hour:[
						0,1,2,3,4,5,6,7,8,9,10,11,12
					],
					minute:[0,30,45]
				},*/
				//新增用户列表
				oneUserData: {
					FAgentGUIDsname:'',  //所属公司
					FAgentGUIDs:'',   	//多个公司ids
					FRoleGUIDs:[],   	//多个角色ids
					FUserName: '',
					FPassword: '',
					checkPass: '',
					FCountry: 'China',
					/*timeZoneSign:'+',
					hour:0,
					minute:0,*/
					FDescribe:"",
					FCountrySelectEnable:'true',
					FDefaultSystemId:'',
					FHaveSystemIds:[],
					FSystemLogoURL:'',
					FStatus:1,
					FContacts:'',
					FTelephone:'',
					FEMailAddress:'',
				},
				copyUserData: {
					FAgentGUIDsname:'',  //所属公司
					FAgentGUIDs:'',   	//多个公司ids
					FRoleGUIDs:[],   	//多个角色ids
					FUserName: '',
					FPassword: '',
					checkPass: '',
					FCountry: 'China',
					/*timeZoneSign:'+',
					hour:0,
					minute:0,*/
					FDescribe:"",
					FCountrySelectEnable: 'true',
					FDefaultSystemId:'',
					FHaveSystemIds:[],
					FSystemLogoURL:'',
					FStatus:1,
					FContacts:'',
					FTelephone:'',
					FEMailAddress:'',
				},
				rules:{
					FUserName: [{required: true, validator: validateUserName}],
					FPassword: [
						{validator: validatePass, trigger: 'blur', required: true},
						{ min: 6, max:12, message: '_长度在_ (6 ~ 12) _个字符_', trigger: 'blur' }
					],
					checkPass: [{validator: validatePass2, trigger: 'blur'},
						{required: true, message: '_请确认密码_', trigger: 'blur'},
					],
					FCountry: [
						{required: true, message: '_请输入国家_'},
					],
					FAgentGUIDsname: [
						{required: true, message: '_请选择公司_'},
					],
					FRoleGUIDs: [
						{required: true, message: '_请选择角色_'},
					],
					FDefaultSystemId: [
						{required: true, message: '_请选择默认系统_'},
					],
					FHaveSystemIds: [
						{required: true, message: '_请选择系统权限_'},
					],
					FTelephone: [{required: true, validator: checkFPhoneNumber }],
					FEMailAddress: [{type: 'email', message: '_请输入正确的邮箱地址_'}],
				},
				userList:[],
				userListAll:[],
				passwordData:{   //编辑密码表单
					name:'',
					ID:'',
					FPassword:'',
					checkPass:''
				},
				passwordRules:{
					FPassword: [
						{validator: validatePass, trigger: 'blur', required: true},
						{ min: 6, max:12, message: '_长度在_(6 ~ 12)_个字符_', trigger: 'blur' }
					],
					checkPass: [{validator: validatePass3, trigger: 'blur'},
						{required: true, message: '_请确认密码_', trigger: 'blur'},
					]
				} 
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			companyModule,checkCompany
		},
		mounted(){
			this.doQueryUser(this.pageIndex1,this.pageSize1,this.userKey,-1,0);
			this.doQueryUAll(this.pageIndex2,this.pageSize2,this.userKey,-1,1);
			this.getFHaveSystemIds();
			setTimeout(() => {
		        this.adjustPage();
		    },100);
		   /* //获取所有公司列表
			if (this.$store.state.treelist != null) {
				getTree()
			} else {
				alert(0)
				this.$store.commit('getuserCompany',getTree);
			}
			function getTree() {
				this.setTree = this.$store.state.treelist;
				console.log('xd',this.$store.state.treelist)
			}
			let oldValue=this.$store.state.treelist;
		    setInterval(function () {
		         if(this.$store.state.treelist!=oldValue){
		           this.setTree=this.$store.state.treelist;
		           oldValue=this.$store.state.treelist;
		         }
		    },1000)*/
		},
		methods: {
			/*getTree(){
				this.setTree = this.$store.state.treelist;
				console.log('this.setTree',this.setTree)
			},*/
			deleteLogo(){
				this.imageUrl='';
				this.oneUserData.FSystemLogoURL='';
			},
			linkRole(){  //链接菜单
				this.$emit('getrole',['true'])
			},
			focusCompany(){
		        this.checkCompanyDialog=true;
		    },
		    //父接收子的弹框关闭
			changeCheckC(val){
				this.checkCompanyDialog=val;
			},
			//父接收子的公司数据
			childrenDataC(data){
				console.log('子传递',data);
				let temp1=data[0];    //公司名
				let temp2=data[1];    //id
				let temp3=data[2];    //FFatherAgentGUID
				let value1=[];
				let value2=[];
				for(var i=0;i<temp3.length;i++){
					if (temp2.indexOf(temp3[i])==-1){
						value2.push(temp2[i]);
						value1.push(temp1[i]);
					}
				}
				this['oneUserData'].FAgentGUIDs=value2.join(',');
				this['oneUserData'].FAgentGUIDsname=value1.join(',');
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) -65;
			},
			//点击新增
			addUser(){
				this.createUser=true;
				this.userView=true;
				this.oneUserData=this.deepCopy(this.copyUserData);
				this.chooseCompanyId='';
				this.imageUrl='';
				this.getLocalTimeZone();
				setTimeout(() => {
					this.initCountry();
					this.getAbleRole();
				},300);
				//根据当前用户的系统权限 使新建子用户继承相应权限 减少用户操作次数 提升用户使用体验
				this.oneUserData.FHaveSystemIds=this.sysHave.join(",").split(",");
				//默认系统需要根据系统求取，在watch里面
				console.log('this.oneUserData.FDefaultSystemId',this.oneUserData.FDefaultSystemId);
				console.log('this.oneUserData',this.oneUserData)
			},
			//新增提交
			createSubmit(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this[formName].FRoleGUIDs=this[formName].FRoleGUIDs.join(',');
						let TokenID = this.$store.state.FTokenID;
						//let TokenID='fe19e899-c799-45dd-80d4-630ffe6b03d1';
						let JsonObj=this[formName];
						let FHaveSystemIds=this[formName].FHaveSystemIds.join(',');
						let FDefaultSystemId=this[formName].FDefaultSystemId;
						let FSystemLogoURL=this[formName].FSystemLogoURL;
						/*JsonObj['FTimeDifferent']=this.getTimeZone(this[formName].timeZoneSign,this[formName].hour,this[formName].minute);*/
						delete JsonObj.FHaveSystemIds;
						delete JsonObj.FDefaultSystemId;
						delete JsonObj.FSystemLogoURL;
						delete JsonObj.checkPass;
						/*delete JsonObj.timeZoneSign;
						delete JsonObj.minute;
						delete JsonObj.hour;*/
						delete JsonObj.FAgentGUIDsname;
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "AddAdminUser",
								FT_AdminUser:JsonObj,
                                FDefaultSystemId:FDefaultSystemId,
                                FHaveSystemIds:FHaveSystemIds,
                                FSystemLogoURL:FSystemLogoURL,
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
								console.log('xinz',JSON.stringify(postData))
								if(data.Result!==200||(data.Result==200&&data.FObject===false)){
				                  _this.message('_该用户名已占用_', 'warning');
				                  _this.userView=false;
				                };
				                if(data.Result==200){
				                	_this.message('_新增成功_', 'success');
				                	_this.userView=false;
				                	if(_this.pageIndex1==1){
			                			_this.doQueryUser(_this.pageIndex1,_this.pageSize1,_this.userKey,-1);
			                		}else{
			                			_this.pageIndex1=1
			                		}
			                		if(_this.pageIndex2==1){
			                			_this.doQueryUAll(_this.pageIndex2,_this.pageSize2,_this.userKey,-1);
			                		}else{
			                			_this.pageIndex2=1
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
			async editUser(index,row){
				this.createUser=false;
				this.userView=true;
				var parmId=row.FGUID;
				setTimeout(() => {
					this.initCountry();
					this.getAbleRole();
				},300); 
				
                /*await this.userDetail(parmId); 
                this.oneUserData=this.deepCopy(this.userData);
                this.oneUserData.FHaveSystemIds=this.oneUserData.FHaveSystemIds.split(',');
                let t=this.parseTimeZone(this.userData.FTimeDifferent);
                this['oneUserData'].timeZoneSign=t.timeZoneSign;
                this['oneUserData'].hour=t.hour;
                this['oneUserData'].minute=t.minute;
                var AgentGUIDs=this.oneUserData.FBindAgentGUIDStrs.toLowerCase().split(',');
                let allCompany=this.$store.state.userCompanyAll;
				let arrName=[];
				for(var i=0;i<allCompany.length;i++){
					if(AgentGUIDs.indexOf((allCompany[i].FGUID).toString())!=-1){
						arrName.push(allCompany[i].name);
					}
				}
				this['oneUserData'].FAgentGUIDs=this.oneUserData.FBindAgentGUIDStrs.toLowerCase();
				this['oneUserData'].FAgentGUIDsname=arrName.join(',');
				this.chooseCompanyId=this['oneUserData'].FAgentGUIDs;
				let arrName2=[];
				this['oneUserData'].FRoleGUIDs=this.oneUserData.FBindRoleGUIDStrs.toLowerCase().split(',');*/
				this.oneUserData= {
					FAgentGUIDsname:'',  //所属公司
					FAgentGUIDs:'',   	//多个公司ids
					FRoleGUIDs:[],   	//多个角色ids
					FUserName: '',
					FPassword: '',
					checkPass: '',
					FCountry: 'China',
					/*timeZoneSign:'+',
					hour:0,
					minute:0,*/
					FDescribe:"",
					FCountrySelectEnable:'true',
					FDefaultSystemId:'',
					FHaveSystemIds:[],
					FSystemLogoURL:'',
					FStatus:1,
					FContacts:'',
					FTelephone:'',
					FEMailAddress:'',
				}, 
				await this.userDetail(parmId);
				let data=this.deepCopy(this.userData);
				/*let t=this.parseTimeZone(data.FTimeDifferent);*/
			   /* this['oneUserData'].timeZoneSign=t.timeZoneSign;
			    this['oneUserData'].hour=t.hour;
			    this['oneUserData'].minute=t.minute;*/
			    this['oneUserData'].FUserName=data.FUserName;
			    this['oneUserData'].FGUID=data.FGUID;
			    this['oneUserData'].FTelephone=data.FTelephone;
			    this['oneUserData'].FEMailAddress=data.FEMailAddress;
			    this['oneUserData'].FContacts=data.FContacts;
			    this['oneUserData'].FSystemLogoURL=data.FSystemLogoURL;
			    this['oneUserData'].FStatus=data.FStatus;
			    this['oneUserData'].FDescribe=data.FDescribe;
			    this['oneUserData'].FCountry=data.FCountry;
			    this['oneUserData'].FCountrySelectEnable='true';
			    this['oneUserData'].FHaveSystemIds=data.FHaveSystemIds.split(',');
			    this.editDefault=data.FDefaultSystemId;
			    this.imageUrl=data.FSystemLogoURL;
			    let AgentGUIDs=data.FBindAgentGUIDStrs.toLowerCase().split(',');
                let allCompany=this.$store.state.userCompanyAll;
				let arrName=[];
				for(var i=0;i<allCompany.length;i++){
					if(AgentGUIDs.indexOf((allCompany[i].FGUID).toString())!=-1){
						arrName.push(allCompany[i].FShortName);
					}
				}
				this['oneUserData'].FAgentGUIDs=data.FBindAgentGUIDStrs.toLowerCase();
				this['oneUserData'].FAgentGUIDsname=arrName.join(',');
				this.chooseCompanyId=this['oneUserData'].FAgentGUIDs;
				let arrName2=[];
				this['oneUserData'].FRoleGUIDs=data.FBindRoleGUIDStrs.toLowerCase().split(',');
				console.log('oneUserData',this['oneUserData']);
			},
			//编辑提交
			editSubmit(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this[formName].FRoleGUIDs=this[formName].FRoleGUIDs.join(',');
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						let FHaveSystemIds=this[formName].FHaveSystemIds.join(',');
						let FDefaultSystemId=this[formName].FDefaultSystemId;
						let FSystemLogoURL=this[formName].FSystemLogoURL;
						let FGUID=this[formName].FGUID;
						// JsonObj['FTimeDifferent']=this.getTimeZone(this[formName].timeZoneSign,this[formName].hour,this[formName].minute);
						delete JsonObj.FHaveSystemIds;
						delete JsonObj.FDefaultSystemId;
						delete JsonObj.FSystemLogoURL;
						delete JsonObj.checkPass;
						delete JsonObj.FPassword;
						/*delete JsonObj.timeZoneSign;
						delete JsonObj.minute;
						delete JsonObj.hour;*/
						delete JsonObj.FBindAgentGUIDStrs;
						delete JsonObj.FAgentGUIDsname;
						delete JsonObj.FCreateTime;
						delete JsonObj.FLastUpdateTime;
						delete JsonObj.FGUID;
						delete JsonObj.FUserName;
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "UpdateAdminUser",
								FT_AdminUser:JsonObj,
								FGUID:FGUID,
                                FDefaultSystemId:FDefaultSystemId,
                                FHaveSystemIds:FHaveSystemIds,
                                FSystemLogoURL:FSystemLogoURL,
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
								/*if(data.Result!==200||(data.Result==200&&data.FObject==false)){
				                   _this.message('_该用户名已占用_', 'warning');
				                };*/
				                if(data.Result==200){
				                	_this.message('_修改成功_', 'success');
				                	_this.userView=false;
					             	_this.doQueryUser(_this.pageIndex1,_this.pageSize1,_this.userKey,-1);
									_this.doQueryUAll(_this.pageIndex2,_this.pageSize2,_this.userKey,-1);
				                }else{
				                	_this.message('_该用户名已占用_', 'warning');
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
			//删除用户
			deleteUser(index,row){
				var _this=this;
		        this.$confirm('_此操作将永久删除_,_是否继续_?', '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
				    })
					.then(() => {
						var deleteFGUID = row.FGUID; 
                        let TokenID = this.$store.state.FTokenID;
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteAdminUserByFGUID","FVersion": "1.0.0","FGUID":"'+deleteFGUID+'"}',
							success: function (data) {
								console.log(data);
								if(data.Result!==200||(data.Result==200&&data.FObject==false)){
				                  	_this.message('_请先解除该账号的子关联_/_角色名_', 'warning');
				                }else{
					             	_this.message('_删除成功_', 'success');
					             	//if(_this.activeName==1){
					             		_this.doQueryUser(_this.pageIndex1,_this.pageSize1,_this.userKey,-1);
					             	//}else if(_this.activeName==2){
										_this.doQueryUAll(_this.pageIndex2,_this.pageSize2,_this.userKey,-1);
					             	//}
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
			//获取详情
			async detailU(index,row){
				this.UdetailView=true;
				let id=row.FGUID;
				await this.userDetail(id);
				this.userDetailData=this.deepCopy(this.userData);
				let AgentGUIDs=this.userDetailData.FBindAgentGUIDStrs.toLowerCase().split(',');
				let allCompany=this.$store.state.userCompanyAll;
				let arrName=[];
				for(var i=0;i<allCompany.length;i++){
					if(AgentGUIDs.indexOf((allCompany[i].FGUID).toString())!=-1){
						arrName.push(allCompany[i].FShortName);
					}
				}
				this.userDetailData.FShortName=arrName.join(',');
				this.userDetailData.FStatus=(this.userDetailData.FStatus)?'_启用_':'_禁用_';			
				this.userDetailData.FCreateTime=this.parseGMT(this.userDetailData.FCreateTime.replace(/T/ig,' ')).substring(0,10);
				this.userDetailData.FLastUpdateTime=this.parseGMT(this.userDetailData.FLastUpdateTime.replace(/T/ig,' ')).substring(0,10);
				// this.userDetailData.FTimeDifferent=row.timeZone;
				this.userDetailData.FHaveSystemIds=this.sysLimit(this.userDetailData.FHaveSystemIds);
				this.userDetailData.FDefaultSystemId=this.sysLimit([this.userDetailData.FDefaultSystemId]);
			},
			//获得角色列表
			getAbleRole(){
				let _this=this;
				let TokenID = this.$store.state.FTokenID;
                let postData={
					FTokenID: TokenID,
					FAction: "QueryAdminRoleEnalbleList",
					FKey:'',
					FPageIndex:1,
					FPageSize:999999,
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
						console.log("角色数据",data);
						_this.roleList = [];
						_this.RoleNew=[];
						$.each(data.FObject.Table1, function (index, obj) {
						    var item={
								name:obj.FSimpleName,
								value:obj.FGUID
							}
							_this.roleList.push(item)
						});
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			},
			//查询登录账号用户
			doQueryUser(index,size,key,state){
				let _this = this;
				// let FIsAll=all?1:0;
				let TokenID = this.$store.state.FTokenID;
				let postData={
					FTokenID: TokenID,
					FAction: "QueryAdminUserList",
					FIsAll:0,
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
						console.log('账号下属账号',data);
						var Fobj=data;
						_this.userList = [];
						if(data.Result==200){

							//数据
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus=(obj.FStatus==1)?true:false;
								obj.FDescribe=obj.FDescribe?obj.FDescribe:'--';
								if(obj.FDescribe=='系统自动创建'){
								    obj.FDescribe='_系统自动创建_'
								}
								_this.userList.push(obj);
							})
							_this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;	
						}
					},
					error: function () {
						console.log('_请求失败_')
					}
				});	
			},
			//查询登录账号全部子用户
			doQueryUAll(index,size,key,state){
				let _this = this;
				let TokenID = this.$store.state.FTokenID;
				let postData={
					FTokenID: TokenID,
					FAction: "QueryAdminUserList",
					FIsAll:1,
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
						console.log('账号全部账号',data);
						var Fobj=data;
						_this.userListAll = [];
						if(data.Result==200){
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus=(obj.FStatus==1)?true:false;
								obj.FDescribe=obj.FDescribe?obj.FDescribe:'--';
								if(obj.FDescribe=='系统自动创建'){
								    obj.FDescribe='_系统自动创建_'
								}
								_this.userListAll.push(obj);

							})
							_this.FTotalCount2 = Fobj.FObject.Table[0].FTotalCount;
						}
					},
					error: function () {
						console.log('_请求失败_')
					}
				});	
			},
			//搜索
			searchList(){
				if(this.activeName==1){
             		if(this.pageIndex1==1){
             			this.doQueryUser(this.pageIndex1,this.pageSize1,this.userKey,-1);
             		}else{
             			this.pageIndex1=1;
             		}
             	}else if(this.activeName==2){
					if(this.pageIndex2==1){
             			this.doQueryUAll(this.pageIndex2,this.pageSize2,this.userKey,-1);
             		}else{
             			this.pageIndex2=1;
             		}
             	}
			},
			//获取用户详情函数
			userDetail(parm){
				let _this = this;
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
				        "data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminUserByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
				        success: function (data) {
				            console.log('用户详情',data);
				            //_this.userCompanyId='2babdata.FObject[0].FStatus?69f1-4a3d-4191-a0dd-6de57dedae3c';     //当前公司id
				            _this.userData= data.FObject[0];
				            console.log('userData',_this.userData);
				            resove();
				        },
				        error: function () {
				            console.log('_请求失败_')
				        }
			        });	
				})
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
				let _this=this;
				let url="web/Common/Common_Admin";
				let TokenID = this.$store.state.FTokenID;
				let data= {
						FTokenID: TokenID,
						FAction: "UpdateAdminUserStatus",
						FGUIDs: ids,
						FState: status,
						FVersion: "1.0.0"
					};
				$.post(url,data,function(res){
						console.log("修改状态",res);
						if(res.Result==200){
							_this.message('_修改成功_','success');
							if(_this.activeName==1){
								_this.$refs.multipleTable1.clearSelection();
			             	}else if(_this.activeName==2){
			             		_this.$refs.multipleTable2.clearSelection();
			             	}
			             	_this.doQueryUser(_this.pageIndex1,_this.pageSize1,_this.userKey,-1);
			             	_this.doQueryUAll(_this.pageIndex2,_this.pageSize2,_this.userKey,-1);
						}
					}).error(function(){
						console.log('_请求失败_')
					})
			},
			//解析权限
			sysLimit(arr){
				let sysArr=[];
				for(var i=0;i<arr.length;i++){
					if(arr[i]==1){
						sysArr.push('_接甩挂_')
					}
					if(arr[i]==2){
						sysArr.push('_智能电子锁_')
					}
					if(arr[i]==4){
						sysArr.push('_车队管理_')
					}
					if(arr[i]==6){
						sysArr.push('_集装箱管理_')
					}
					if(arr[i]==7){
						sysArr.push('_智能配送_')
					}
				}
				return sysArr.join(',')
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
				this.doQueryUser(this.pageIndex1,this.pageSize1,this.userKey,-1);
			},
			handleCurrentChange2(val){
				this.pageIndex2=val;
				this.doQueryUAll(this.pageIndex2,this.pageSize2,this.userKey,-1);
			},
			handleSizeChange1(val){
				this.pageSize1=val;
				this.doQueryUser(this.pageIndex1,this.pageSize1,this.userKey,-1);
			},
			handleSizeChange2(val){
				this.pageSize2=val;
				this.doQueryUAll(this.pageIndex2,this.pageSize2,this.userKey,-1);
			},
			//点击重置
			resetUser(){
				this.oneUserData=this.deepCopy(this.copyUserData);
				this.getLocalTimeZone();
				//根据当前用户的系统权限 使新建子用户继承相应权限 减少用户操作次数 提升用户使用体验
				this.oneUserData.FHaveSystemIds=this.sysHave.join(",").split(",");
				
				setTimeout(() => {
					this.initCountry();
				},300);
			},
            //获取登录用户的权限
            getFHaveSystemIds(){
				console.log("当前用户权限",this.$store.state.haveSystemIDs);
				this.sysHave=this.$store.state.haveSystemIDs;
			},
			//点击修改密码
			setPassword(index,row){
				this.editpassView=true;
				console.log('修改密码的用户信息',row);
				this.passwordData={
					name:row.FUserName,
					ID:row.FGUID,
					FPassword:null,
				    checkPass:null
				}
			},
			//提交新密码
			submitPass(formName){
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "UpdateAdminUserPassword",
								FGUID:JsonObj.ID,
								FPassword:JsonObj.FPassword,
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
							success: function (res) {
								if(res.Result==200){
									_this.$message("_修改成功_!");
									_this.editpassView = false;
									_this.$refs[formName].resetFields();
								}else {
									_this.$message("_修改失败_!")
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
			//上传图片
			handleAvatarSuccess(res, file) {
		        console.log('res',res);
		        console.log('file',file);
		        this.imageUrl = URL.createObjectURL(file.raw);
		        this.oneUserData.FSystemLogoURL=res.FObject;
		    },
			//图片
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
			//获取计算机时间时区
			/*getLocalTimeZone(){
				var d=new Date();
				let TimezoneOffset=d.getTimezoneOffset();
				if(TimezoneOffset<0){
					this.oneUserData.timeZoneSign='+'
				}else {
					this.oneUserData.timeZoneSign='-'
				};
				let t=Math.abs(TimezoneOffset);
				this.oneUserData.hour=Math.floor(t/60);
				this.oneUserData.minute=Math.round(t%60);
			},*/
			//数字转成时差符号
			/*parseTimeZone(timeZone){
				let timeZoneSign,hour,minute;
				if (timeZone<0){
					timeZoneSign='-'
				}else {
					timeZoneSign='+'
				};
				let t=Math.abs(timeZone);
				hour=Math.floor(t/3600);
				minute=(t/60)%60;
				let obj={
					timeZoneSign:timeZoneSign,
					hour:hour,
					minute:minute,
				}
				return obj
			},*/
			//列表数据优化
			/*listData(obj){
				let timeDifferent=Math.abs(obj.FTimeDifferent);
				let hour=Math.floor(timeDifferent/3600);
				let minute=(timeDifferent/60)%60;
				if(hour<10){
					hour='0'+hour;
				}
				if(minute==0){
					minute='00';
				}
				let n=hour+':'+minute;
				if(obj.FTimeDifferent>0){
					obj.timeZone='+'+n;
				}else {
					obj.timeZone='-'+n;
				}
			},*/
			//时差符号化作数字
			/*getTimeZone(timeZoneSign,hour,minute){
				let t=null;
				if(timeZoneSign=="+"){
					t=(hour*60+minute)*60;
				}else {
					t=-(hour*60+minute)*60;
				};
				return t;
			},*/
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
					_this.oneUserData.FCountry=item.name;
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
		},
		computed:{
		    SystemID(){
		        return this.$store.state.choiceSystemID;
		    },
		    HaveLogo(){
		    	//console.log('state',this.$store.state.FEnableSystemLogo)
		    	return this.$store.state.FEnableSystemLogo;
		    	/*if((JSON.parse(window.name)).FObject[0].FEnableSystemLogo){
		    		return true
		    	}else{
		    		return false
		    	}*/
		    }
		},
		watch: {
			"oneUserData.FHaveSystemIds" (newval,oldval) {
				let temp = {};
				let temp2 = {};
				let temp4 = {};
				let temp6 = {};
				let temp7 = {};
				let systemtoString=this.SystemID.toString();
				console.log('newval[1]',newval)
				if(newval){
					this.FDefaultSystemIds = [];
					for (let i=0; i<newval.length;i++) {
						if (newval[i] == 1) {
							temp.val = newval[i];
							temp.name = "_接甩挂_";
							this.FDefaultSystemIds.push(temp);
						}
						if (newval[i] == 2) {
							temp2.val = newval[i];
							temp2.name = "_智能电子锁_";
							this.FDefaultSystemIds.push(temp2);
						}
						if (newval[i] == 4) {
							temp4.val = newval[i];
							temp4.name = "_车队管理_";
							this.FDefaultSystemIds.push(temp4);
						}
						if (newval[i] == 6) {
							temp6.val = newval[i];
							temp6.name = "_集装箱管理_";
							this.FDefaultSystemIds.push(temp6);
						}
						if (newval[i] == 7) {
							temp7.val = newval[i];
							temp7.name = "_智能配送_";
							this.FDefaultSystemIds.push(temp7);
						}
					}
					if(this.createUser){
					   if(newval.indexOf(systemtoString)!==-1){ 
					   		this.oneUserData.FDefaultSystemId=systemtoString;
					    }else{
					    	this.oneUserData.FDefaultSystemId=newval[0];
					    } 	
					}else{
						if(newval.indexOf(this.editDefault.toString())!==-1){
					   		this.oneUserData.FDefaultSystemId=this.editDefault.toString();
					    }else{
					    	this.oneUserData.FDefaultSystemId=newval[0];
					    } 
					}
				}else{
					this.FDefaultSystemIds = [];
					this.oneUserData.FDefaultSystemId='';
				}
			},
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

	.companyDialog  .el-dialog{ /*新增编辑公司*/
		/*width: 36%;*/
		width:765px;
	}
	.velcss .el-dialog{          /*公司、司机、车辆、设备详情*/
		width: 650px;
	}
	.userDialog .el-dialog{     /*新增用户*/
		width: 850px;
	}
	.companyTree .el-dialog{     /*多选公司弹框*/
		width: 380px;
	}
	.relateV .el-dialog{
		width:360px;
		/*left:65.5%;*/
	}
	.relateDE .el-dialog {
		width:788px;
		/*width: 25%;*/
		/*left:70%;*/
	}
	.relateCon .el-dialog{
		width:460px;
	}
	/* .leftTree{
		
	}
	.rightTable{
		
	} */



    /*.nopointer{
		cursor: not-allowed;
		display: inline-block;
	}*/
	
	.tableTab .el-tabs__nav-wrap {
       	background-color:#005fc6;
    }
    .tableTab .el-tabs__item.is-active {
		color:#005fc6;
	}
	.tableTab .el-tabs__nav {
		height:42px;
		margin-left:10px;
	}
	.tableTab .el-tabs__item {
		height:34px;
		line-height:28px;
		margin-top:8px;
		font-size:16px;
		color:#fff;
		border-top-left-radius:3px;
		border-top-right-radius:3px;
	}
	.tableTab .el-tabs--border-card > .el-tabs__content {
		padding:0;
	}

	/* #companyModal{
		z-index: 20018;
	} */
	.logoUP .avatar-uploader .el-upload {
	    border: 1px dashed #C0CCDA;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	    top:-1px;
	   /* left:-150px;*/
	}
	.logoUP  .avatar-uploader .el-upload:hover {
	    border-color: #20a0ff;
	}
	.logoUP  .avatar-uploader-icon {
	     font-size: 14px;
	     color: #8c939d;
	     width: 135px;
	     line-height: 30px;
	     display: block;
	}
	.logoUP  .avatar {
	    width: 135px;
	    height: 30px;
	    display: block;
	}
	input[type=file] {
	    display: none;
	}
	.systemErrors  .el-form-item__error{
		top:75px;
	}
	.editPass .el-dialog{
		width:340px;
	}
	.systemErrors .el-checkbox-group label{
		width:220px;
	}
	.roleSel .el-form-item__error{
		top:36px;
	} 	
</style>
