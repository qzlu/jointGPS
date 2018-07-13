<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section style="height: 100%">
		<!-- 设备详情 -->
		<div class='velcss'>
			<el-dialog title='_设备详情_' :visible.sync="EdetailView">
				<table class="table detailTable" style='table-layout:fixed;'>
					<tbody>
						<tr style='height:44px'>
							<td width="20%" class='likeHeader'>
								<b>_终端号_</b>
							</td>
							<td width="30%">{{equDetailData.FAssetID}}</td>
							<td width="20%" class='likeHeader'>
								<b>_序号_</b>
							</td>
							<td width="30%">{{equDetailData.FAssetSerialID}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader' v-if='SystemID!==6'>
								<b>_关联车辆_</b>
							</td>
							<td class='likeHeader' v-if='SystemID==6'>
								<b>_关联集装箱_</b>
							</td>
							<td>{{equDetailData.FVehicleName}}</td>
							<td class='likeHeader'>
								<b>SIM_卡号_</b>
							</td>
							<td>{{equDetailData.FSIMNumber}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader'>
								<b>_公司_</b>
							</td>
							<td>{{equDetailData.FShortName}}</td>
							<td class='likeHeader'>
								<b>_分组_</b>
							</td>
							<td>{{equDetailData.FGroupName}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader'>
								<b>_类型_</b>
							</td>
							<td>{{equDetailData.FAssetTypeID}}</td>
							<td class='likeHeader'>
								<b>_状态_</b>
							</td>
							<td>{{equDetailData.FStatus}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader'>
								<b>_出厂日期_</b>
							</td>
							<td>{{equDetailData.FManufactureDate}}</td>
							<td class='likeHeader'>
								<b>_创建时间_</b>
							</td>
							<td>{{equDetailData.FCreateTime}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader'>
								<b>_外设温湿度_</b>
							</td>
							<td>{{equDetailData.FTHS}}</td>
							<td class='likeHeader'>
								<b>_外设视频_</b>
							</td>
							<td>{{equDetailData.FVideo}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader'>
								<b>_外设刷卡_</b>
							</td>
							<td>{{equDetailData.FRFID}}</td>
							<td class='likeHeader'>
								<b>_外设胎温胎压_</b>
							</td>
							<td>{{equDetailData.FTPMS}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader'>
								<b>_外设调度屏_</b>
							</td>
							<td>{{equDetailData.FScreen}}</td>
							<td class='likeHeader'>
								<b>_外设摄像头_</b>
							</td>
							<td>{{equDetailData.FCamera}}</td>
						</tr>
						<tr style='height:44px'>
							<td class='likeHeader'>
								<b>_描述_</b>
							</td>
							<td colspan="3" style='word-wrap:break-word'>{{equDetailData.FDescription}}</td>
						</tr>
					</tbody>
				</table>
			</el-dialog>
		</div>
		<!-- 新增设备 -->
		<div class='userDialog'>
			<el-dialog :title="createEquip?'_新增设备_':'_编辑设备_'" :visible.sync="equipView">
				<el-form :model="oneEquipData" :rules="rules" ref="oneEquipData" label-width="150px">
					<el-row>
						<el-col :span="11">
							<el-form-item label="_终端号_" prop="FAssetID">
								<el-input v-model.trim="oneEquipData.FAssetID" v-focus v-if='equipView&&createEquip'></el-input>
								<el-input v-model.trim="oneEquipData.FAssetID" v-if='equipView&&!createEquip'></el-input>
							</el-form-item>
							<el-form-item label="_类型_" prop="FAssetTypeID">
								<el-select v-model.number="oneEquipData.FAssetTypeID" placeholder="_请选择_" style="width:100%;">
									<el-option v-for="item in FAssetTypeIDs" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="SIM_卡号_" prop="FSIMNumber">
								<el-input v-model.trim="oneEquipData.FSIMNumber"></el-input>
							</el-form-item>
							<el-form-item label="_出厂日期_" prop="FManufactureDate">
								<el-date-picker type="date" placeholder="_选择日期_" v-model="oneEquipData.FManufactureDate" :clearable="false"></el-date-picker>
							</el-form-item>
							<el-form-item label="_序号_" prop="FAssetSerialID">
								<el-input v-model.trim="oneEquipData.FAssetSerialID"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<div class='twoinput'>
								<el-form-item :label="SystemID!==6?'_公司车辆_':'_公司集装箱_'" prop="ce" label-width="160px" style='height:82px'>
									<div class='cecontent' @click="focusCompany">
										<div>
											<span style='font-weight:bold'>_所属公司_:</span>{{oneEquipData.ce}}</div>
										<div v-if='SystemID!==6'>
											<span style='font-weight:bold'>_关联车牌_:</span>{{linkVel}}</div>
										<div v-if='SystemID==6'>
											<span style='font-weight:bold'>_关联集装箱_:</span>{{linkVel}}</div>
									</div>
								</el-form-item>
							</div>
							<el-form-item label="_分组_" prop="FGroupGUID" label-width="160px">
								<el-select v-model="oneEquipData.FGroupGUID" placeholder="_请选择_" style='width:100%'>
									<el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="_所属系统_" prop="FSystemType" label-width="160px" v-if='createEquip&&(!linkSys)'>
								<el-select v-model="oneEquipData.FSystemType" placeholder="_请选择_" style='width:100%'>
									<el-option v-for="item in sysArrs" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<div class='ownSysd' v-if='!createEquip||(createEquip&&linkSys)'>
								<el-form-item label="_所属系统_" prop="FSystemType" label-width="160px">
									<el-select v-model="oneEquipData.FSystemType" placeholder="_请选择_" style='width:100%' disabled>
										<el-option v-for="item in sysArrs" :key="item.value" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class='discrip'>
								<el-form-item label="_描述_" prop="FDescription" label-width="160px">
									<el-input type="textarea" v-model.trim="oneEquipData.FDescription" :maxlength="100" :rows="2" placeholder='_最多输入_100_字_'></el-input>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<div class='adcheckEquip' v-if='createEquip'>
						<el-row style='margin-bottom:10px'>
							<el-col :span='1'>
								<span style='visibility:hidden'>--</span>
							</el-col>
							<el-col :span='8'>
								<el-checkbox v-model="oneEquipData.FTHS" label-width="160px">_外设温湿度_</el-checkbox>
							</el-col>
							<el-col :span='7'>
								<el-checkbox v-model="oneEquipData.FVideo">_外设视频_</el-checkbox>
							</el-col>
							<el-col :span='7'>
								<el-checkbox v-model="oneEquipData.FRFID">_外设刷卡_</el-checkbox>
							</el-col>
							<el-col :span='1'></el-col>
						</el-row>
						<el-row>
							<el-col :span='1'>
								<span style='visibility:hidden'>--</span>
							</el-col>
							<el-col :span='8'>
								<el-checkbox v-model="oneEquipData.FTPMS">_外设胎温胎压_</el-checkbox>
							</el-col>
							<el-col :span='7'>
								<el-checkbox v-model="oneEquipData.FScreen">_外设调度屏_</el-checkbox>
							</el-col>
							<el-col :span='7'>
								<el-checkbox v-model="oneEquipData.FCamera">_外设摄像头_</el-checkbox>
							</el-col>
							<el-col :span='1'></el-col>
						</el-row>
					</div>
					<div class='edcheckEquip' v-if='!createEquip'>
						<div class='alter'>
							<el-row>
								<el-col :span="11">
									<el-form-item label="_外设温湿度_" prop="FTHS">
										<el-select v-model="oneEquipData.FTHS" placeholder="_请选择_" style="width:100%;">
											<el-option v-for="item in FTHSs" :key="item.value" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="_外设视频_" prop="FVideo" label-width="160px">
										<el-select v-model="oneEquipData.FVideo" placeholder="_请选择_" style="width:100%;">
											<el-option v-for="item in FTHSs" :key="item.value" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="2"></el-col>
							</el-row>
						</div>
						<div class='alter'>
							<el-row>
								<el-col :span="11">
									<el-form-item label="_外设刷卡_" prop="FRFID">
										<el-select v-model="oneEquipData.FRFID" placeholder="_请选择_" style="width:100%;">
											<el-option v-for="item in FTHSs" :key="item.value" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="_外设胎温胎压_" prop="FTPMS" label-width="160px">
										<el-select v-model="oneEquipData.FTPMS" placeholder="_请选择_" style="width:100%;">
											<el-option v-for="item in FTHSs" :key="item.value" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="2"></el-col>
							</el-row>
						</div>
						<div class='sel'>
							<el-row>
								<el-col :span="11">
									<el-form-item label="_外设调度屏_" prop="FScreen">
										<el-select v-model="oneEquipData.FScreen" placeholder="_请选择_" style="width:100%;">
											<el-option v-for="item in FTHSs" :key="item.value" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="_外设摄像头_" prop="FCamera" label-width="160px">
										<el-select v-model="oneEquipData.FCamera" placeholder="_请选择_" style="width:100%;">
											<el-option v-for="item in FTHSs" :key="item.value" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="2"></el-col>
							</el-row>
						</div>
					</div>
				</el-form>

				<div slot="footer" class="dialog-footer">
					<el-button v-if="createEquip" type="primary" @click="createSubmit('oneEquipData')">_创建_</el-button>
					<el-button v-if="createEquip" @click="resetUser" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
					<el-button v-if="!createEquip" type="primary" @click="editSubmit('oneEquipData')">_保存_</el-button>
					<el-button v-if="!createEquip" @click='equipView=false' type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 内容展示区 -->
		<div style="height: 100%">
			<!-- <el-row  style="height: 100%"> -->
			<!-- 左侧树 -->
			<!-- <el-col class='leftTree' style="height: 100%;display:inline-block"> -->
			<!--  <div class='leftTree' style="height: 100%;float:left"> -->
			<div class='leftTree'>
				<div style="height: 100%;">
					<company-module :typeTable='typeTable' v-on:treeId='treeCompany'></company-module>
				</div>
			</div>
			<!-- 右侧列表弹框 -->
			<!-- <el-col class='rightTable' style="height: 100%;display:inline-block"> -->
			<div class='rightTable' style="height: 100%;">
				<div class='tableTab' style="height: 100%">
					<el-tabs type="border-card" style="height: 44px" v-model="activeName">
						<el-tab-pane :label="numberTab?'_直属设备_':'_分组设备_'" name='1'></el-tab-pane>
						<el-tab-pane label="_全部设备_" name='2' v-if='numberTab'></el-tab-pane>
					</el-tabs>
					<!-- 操作按钮-->
					<div id="operate_wrapper">
						<div class='adminHeader'>
							<div class="float-left">
								<!-- <span style='display:inline-block;width:100px;height:30px;line-height:30px;text-align:center;background:#4db3ff'>A公司</span> -->
								<el-button type="primary" class='el-icon-plus' size="small" @click='addEquip'>
									<span style="color: white">_新建_</span>
								</el-button>
								<el-button type="primary" class='el-icon-circle-check' size="small" @click='moreChange(true)'>_启用_</el-button>
								<el-button type="primary" class="el-icon-circle-close" size="small" @click='moreChange(false)'>_禁用_
								</el-button>
								<el-button type="primary" class="el-icon-delete" size="small" @click="deleteMore">_删除_</el-button>
							</div>
							<div class="float-right" style="position: relative;margin-right:30px">
								<input type="text" class='searchIn' placeholder="_请输入终端号_" v-model="equipKey" @keyup.enter="searchList">
								<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px" @click="searchList"></button>
							</div>
						</div>
					</div>
					<!-- <span class='tableTop' v-if=''>{{tableTopName}}</span> -->
					<!-- 直属设备表格 -->
					<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==1'>
						<span class='tableTop' v-if=''>{{tableTopName}}</span>
						<el-table :data="equipList" @selection-change="handleSelectionChange1" ref="multipleTable1" :height="table_height" stripe
						 style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="RowNo" label="_序号_" width="70"></el-table-column>
							<el-table-column label="_操作_" width="90">
								<template scope="scope">
									<el-button size="small" type="text" @click="editEquip(scope.$index, scope.row)">
										<i class="el-icon-edit" title='_编辑_'></i>
									</el-button>
									<el-button type="text" size="small" @click="deleteone(scope.$index,scope.row)">
										<i class="el-icon-delete" title='_删除_'></i>
									</el-button>
									<el-button type="text" size="small" @click="detailE(scope.$index,scope.row)">
										<i class="el-icon-info" title='_详情_'></i>
									</el-button>
								</template>
							</el-table-column>
							<el-table-column label="_状态_" width="120">
								<template scope="scope">
									<el-switch v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
								</template>
							</el-table-column>
							<el-table-column prop="FAssetID" label="_终端号_" width="180" show-overflow-tooltip></el-table-column>
							<el-table-column prop="FVehicleName" label="_关联车牌号_" width="180" show-overflow-tooltip v-if='SystemID!==6'></el-table-column>
							<el-table-column prop="FVehicleName" label="_箱号_" width="120" show-overflow-tooltip v-if='SystemID==6'></el-table-column>
							<el-table-column prop="FAssetTypeID" label="_终端类型_" width="180" show-overflow-tooltip></el-table-column>
							<el-table-column prop="FCreateTime" show-overflow-tooltip label="_创建时间_" width="180"></el-table-column>
							<el-table-column prop="FShortName" label="_公司名称_" width="120" v-if='!numberTab'></el-table-column>
							<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_" min-width="150" align='left' class-name='renderCenter'></el-table-column>
						</el-table>
					</div>
					<!-- 分页 -->
					<div class="pagination" id='pagination' v-if='activeName==1'>
						<div class="block">
							<el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pageIndex1" :page-sizes="[10, 20, 30]"
							 :page-size="pageSize1" layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount1">
							</el-pagination>
						</div>
					</div>
					<!-- <span class='tableTop' v-if=''>{{tableTopName}}</span> -->
					<!-- 全部设备表格 -->
					<div id="el_table_wrap" class="el_table_wrap" v-if='activeName==2'>
						<span class='tableTop' v-if=''>{{tableTopName}}</span>
						<el-table :data="equipListAll" @selection-change="handleSelectionChange2" ref="multipleTable2" :height="table_height" stripe
						 style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="RowNo" label="_序号_" width="70"></el-table-column>
							<el-table-column label="_操作_" width="90">
								<template scope="scope">
									<el-button size="small" type="text" @click="editEquip(scope.$index, scope.row)">
										<i class="el-icon-edit" title='_编辑_'></i>
									</el-button>
									<el-button type="text" size="small" @click="deleteone(scope.$index,scope.row)">
										<i class="el-icon-delete" title='_删除_'></i>
									</el-button>
									<el-button type="text" size="small" @click="detailE(scope.$index,scope.row)">
										<i class="el-icon-info" title='_详情_'></i>
									</el-button>
								</template>
							</el-table-column>
							<el-table-column label="_状态_" width="120">
								<template scope="scope">
									<el-switch v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
								</template>
							</el-table-column>
							<!-- <el-table-column prop="FShortName"  label="_公司简称_" width="120" show-overflow-tooltip ></el-table-column> -->
							<el-table-column prop="FAssetID" label="_终端号_" width="180" show-overflow-tooltip></el-table-column>
							<el-table-column prop="FVehicleName" label="_关联车牌号_" width="180" show-overflow-tooltip v-if='SystemID!==6'></el-table-column>
							<el-table-column prop="FVehicleName" label="_箱号_" width="120" show-overflow-tooltip v-if='SystemID==6'></el-table-column>
							<el-table-column prop="FAssetTypeID" label="_终端类型_" width="180" show-overflow-tooltip></el-table-column>
							<el-table-column prop="FCreateTime" show-overflow-tooltip label="_创建时间_" width="180"></el-table-column>
							<el-table-column prop="FDescription" show-overflow-tooltip label="_描述_" min-width="150" align='left' class-name='renderCenter'></el-table-column>
						</el-table>
					</div>
					<!-- 分页 -->
					<div class="pagination" id='pagination' v-if='activeName==2'>
						<div class="block">
							<el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="pageIndex2" :page-sizes="[10, 20, 30]"
							 :page-size="pageSize2" layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount2">
							</el-pagination>
						</div>
					</div>
				</div>
			</div>
		</div>
		<radio-company :radioCompanyDialog='radioCompanyDialog' v-on:radiochangeC='changeRadioC' v-on:radiochildrenC='radiochildrenC'
		 v-on:radiochildrenV='radiochildrenV' :typeTable='typeTable' :SystemID='SystemID'></radio-company>
	</section>
</template>
<script>
	import companyModule from 'components/Company/companyModule.vue'
	import radioCompany from 'components/Company/radioCompany.vue'
	export default {
		data() {
			const checkFAssetID = (rule, value, callback) => {
				var uPattern = /^[0-9]{1,12}$/g;
				if (!value) {
					return callback(new Error('_请输入终端号_'));
				}
				else if (value && uPattern.test(value)) {
					console.log('succ')
					callback();
				} else {
					console.log('error')
					callback(new Error('_请输入数字_(1-12)'));
				}
			};
			const FSIMNumber = (rule, value, callback) => {
				var uPattern = /^[0-9a-zA-Z]{1,15}$/g;
				if (!value) {
					return callback(new Error('_请输入卡号_'));
				}
				else if (value && uPattern.test(value)) {
					console.log('succ')
					callback();
				} else {
					console.log('error')
					callback(new Error('_请输入十五位以内数字_'));
				}
			};
			return {
				linkSys: '',
				sysArrs: [],
				numberTab: true,
				groups: [],
				tableTopName: '_请选择公司_',
				radioCompanyDialog: false,
				createEquip: false,
				equipView: false,
				activeName: '1',
				table_height: null,
				typeTable: 0,
				equipKey: '',
				pageIndex1: 1,
				pageSize1: 20,
				FTotalCount1: 0,
				tableFguids1: '',
				pageIndex2: 1,
				pageSize2: 20,
				FTotalCount2: 0,
				tableFguids2: '',
				//treeId:'',  //点击左侧树的公司id
				treeObj: '',
				//linkCompany:'九通',
				// linkVel:'粤A',
				linkVel: '',
				EdetailView: false,
				equDetailData: '',
				equipCompanyId: '',       //司机已绑定的公司
				//getCompanyId:'',       //保存接收的公司id
				equipData: '',      //设备详情数据
				//新增设备列表
				oneEquipData: {
					FAssetID: '',
					FAssetTypeID: '',
					FManufactureDate: new Date(),
					FDescription: '',
					FAssetSerialID: '',
					checkList: '',
					FStatus: 1,
					FTHS: '',
					FVideo: '',
					FRFID: '',
					FTPMS: '',
					FScreen: '',
					FCamera: '',
					ce: '',        //界面显示混合
					//ceId:'',

					FSIMNumber: '',
					FAgentGUID: '',
					FVehicleGUID: '',
					FGroupGUID: '',
					FSystemType: ''
				},
				copyEquipData: {
					FAssetID: '',
					FAssetTypeID: '',
					FManufactureDate: new Date(),
					FDescription: '',
					FAssetSerialID: '',
					checkList: '',
					FStatus: 1,
					FTHS: '',
					FVideo: '',
					FRFID: '',
					FTPMS: '',
					FScreen: '',
					FCamera: '',
					ce: '',        //界面显示混合
					//ceId:'',

					FSIMNumber: '',
					FAgentGUID: '',
					FVehicleGUID: '',
					FGroupGUID: '',
					FSystemType: ''
				},
				FTHSs: [{
					label: '_无该外设_',
					value: 0
				}, {
					label: '_正常_',
					value: 1
				}, {
					label: '_异常_',
					value: 2
				}],
				rules: {
					FAssetID: [{ required: true, validator: checkFAssetID }],
					FAssetTypeID: [{ required: true, message: '_请输入终端类型_' }],
					ce: [{ required: true, message: '_请选择公司_' }],
					FGroupGUID: [{ required: true, message: '_请选择分组_' }],
					FSIMNumber: [{ required: true, validator: FSIMNumber }],
				},
				equipList: [],
				equipListAll: [],
				//设备类型
				FAssetTypeIDs: [{
					label: 'JT701',
					value: 701
				}, {
					label: 'JT702',
					value: 735
				}, {
					label: 'JT703',
					value: 703
				}, {
					label: 'JT703T',
					value: 707
				}, {
					label: 'JT704',
					value: 704
				}, {
					label: 'JT704B',
					value: 714
				}, {
					label: 'JT705',
					value: 740
				}, {
					label: 'JT706',
					value: 716
				}, {
					label: 'JT707',
					value: 717
				},
				{
					label: 'JT600C',
					value: 303
				},
				{
					label: 'GP4000',
					value: 400
				}, {
					label: 'GP6000',
					value: 600
				}, {
					label: 'GP6000F',
					value: 603
				}, {
					label: 'GP4000M',
					value: 404
				}, {
					label: 'JT500BD _一体机_',
					value: 607
				}
					, {
					label: 'JT500BD _一体机新线束_',
					value: 608
				}
					, {
					label: 'HB_R03GBD08',
					value: 669
				}
					, {
					label: '_首航_ SF110-GS',
					value: 682
				}, {
					label: '_中集_ ZNM801-6',
					value: 750
				},
				{
					label: 'JT704C _中集协议_',
					value: 751
				}
				],
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			companyModule, radioCompany
		},
		mounted() {
			setTimeout(() => {
				this.adjustPage();
			}, 100);
			this.sysTrans(this.sysHave);
		},
		methods: {
			focusCompany() {
				this.radioCompanyDialog = true;
			},
			//父接收子的公司弹框关闭
			changeRadioC(val) {
				this.radioCompanyDialog = val;
			},
			radiochildrenC(data) {
				console.log('子公司', data);
				this['oneEquipData'].FAgentGUID = data[1];
				this['oneEquipData'].ce = data[0];
				this['oneEquipData'].FGroupGUID = '';  //公司发生改变,FGroupGUID显示就要重选
				this.groups = data[2];
			},
			//接收选择的车辆数据
			radiochildrenV(data) {
				console.log('子车辆', data);
				this['oneEquipData'].FVehicleGUID = data[0];
				this.linkVel = data[1];
				this.linkSys = data[2];
			},
			adjustPage() {
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) - 65;
			},
			//点击新增
			addEquip() {
				this.createEquip = true;
				this.equipView = true;
				this.oneEquipData = this.deepCopy(this.copyEquipData);
				this.oneEquipData.FSystemType = this.SystemID;
				console.log('oneEquipData', this.oneEquipData);
				//this.linkCompany='';
				this.linkVel = '';
				this.groups = [];
				this.linkSys = '';
			},
			//新增提交
			createSubmit(formName) {
				var _this = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj = this[formName];
						let changeName = this[formName].ce;
						let FAgentGUID = this[formName].FAgentGUID;
						let FVehicleGUID = this[formName].FVehicleGUID;
						let FGroupGUID = this[formName].FGroupGUID;
						JsonObj.FManufactureDate = this.timeChange(this[formName].FManufactureDate);
						//JsonObj.FSystemType=this.SystemID;
						JsonObj.FTHS = (JsonObj.FTHS) ? 1 : 0;
						JsonObj.FVideo = (JsonObj.FVideo) ? 1 : 0;
						JsonObj.FRFID = (JsonObj.FRFID) ? 1 : 0;
						JsonObj.FTPMS = (JsonObj.FTPMS) ? 1 : 0;
						JsonObj.FScreen = (JsonObj.FScreen) ? 1 : 0;
						JsonObj.FCamera = (JsonObj.FCamera) ? 1 : 0;
						//delete JsonObj.FAgentGUID;
						//delete JsonObj.FVehicleGUID;
						//delete JsonObj.FGroupGUID;
						console.log('JsonObj', JsonObj);
						let postData = {
							FTokenID: TokenID,
							FAction: "AddAdminAsset",
							FAgentGUID: FAgentGUID,
							FVehicleGUID: FVehicleGUID,
							FGroupGUID: FGroupGUID,
							FT_AdminAsset: JsonObj,
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
								//console.log('提交',JSON.stringify(postData));
								console.log('新增设备', data);
								if (data.Result == 105) {
									_this.message('_该终端号已占用_', 'warning');
								};
								if (data.Result == 200) {
									_this.message('_新增成功_', 'success');
									_this.equipView = false;
									_this.$store.commit('getuserCompany', '');
									if (_this.numberTab) {   //属
										_this.tableTopName = changeName;
										_this.treeObj = {
											id: FAgentGUID,
											name: _this.tableTopName,
											fatherId: '',
											type: 1
										}
										if (_this.pageIndex1 == 1) {
											_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
										} else {
											_this.pageIndex1 = 1
										}
										if (_this.pageIndex2 == 1) {
											_this.doQueryEAll(_this.pageIndex2, _this.pageSize2, _this.equipKey, -1, -1, _this.treeObj);
										} else {
											_this.pageIndex2 = 1
										}
									} else {              //分组
										_this.tableTopName = _this.getLabel(FGroupGUID);
										_this.treeObj = {
											id: FGroupGUID,
											name: _this.tableTopName,
											fatherId: FAgentGUID,
											type: 0
										}
										if (_this.pageIndex1 == 1) {
											_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
										} else {
											_this.pageIndex1 = 1
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
			async editEquip(index, row) {
				var _this = this;
				this.createEquip = false;
				this.equipView = true;
				var parmId = row.FGUID;
				await this.equipDetail(parmId);
				this.oneEquipData = this.deepCopy(this.equipData);
				this['oneEquipData'].ce = this.equipData.FShortName;
				this['oneEquipData'].FAgentGUID = this.equipData.FAgentGUID;
				this.groups = this.getGroup(this['oneEquipData'].FAgentGUID);
				console.log('this.oneEquipData', this.oneEquipData);
				this.linkVel = (this.equipData.FVehicleName) ? (this.equipData.FVehicleName) : '';
				//await this.$store.dispatch('companyAble');
				/* if((_this.$store.state.companyAbleId).indexOf(_this.driverCompanyId)==-1){     //编辑而且公司已不可使用
					 _this.$message("_原公司已禁用_,_请重新选择_");
					 _this.oneEquipData.FAgentGUID='';
				 }*/
			},
			//编辑提交
			editSubmit(formName) {
				var _this = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj = this[formName];
						let changeName = this[formName].ce;
						let FGUID = this[formName].FGUID;
						let FAgentGUID = this[formName].FAgentGUID;
						let FGroupGUID = this[formName].FGroupGUID;
						let FVehicleGUID = (this[formName].FVehicleGUID == null || this[formName].FVehicleGUID == '00000000-0000-0000-0000-000000000000') ? '' : this[formName].FVehicleGUID;
						JsonObj.FManufactureDate = this.timeChange(this[formName].FManufactureDate);
						JsonObj.FSystemType = this.SystemID;
						/*delete JsonObj.FGUID;
						delete JsonObj.FAgentGUID;
						delete JsonObj.FVehicleGUID;
						delete JsonObj.FCreateTime;
						delete JsonObj.FShortName;
						delete JsonObj.FVehicleName;
						delete JsonObj.ce;
						delete JsonObj.FSystemType;
						delete JsonObj.FGroupGUID;*/
						console.log('JsonObj', JsonObj);
						let postData = {
							FTokenID: TokenID,
							FAction: "UpdateAdminAsset",
							FGUID: FGUID,
							FAgentGUID: FAgentGUID,
							FVehicleGUID: FVehicleGUID,
							FGroupGUID: FGroupGUID,
							FT_AdminAsset: JsonObj,
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
								console.log('JSON.stringify(postData)', JSON.stringify(postData))
								if (data.Result == 105) {
									_this.message('_该终端号已占用_', 'warning');
								};
								if (data.Result == 200) {
									_this.message('_修改成功_', 'success');
									_this.equipView = false;
									_this.$store.commit('getuserCompany', '');
									if (_this.numberTab) {   //属
										_this.tableTopName = changeName;
										_this.treeObj = {
											id: FAgentGUID,
											name: _this.tableTopName,
											fatherId: '',
											type: 1
										}
										_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
										_this.doQueryEAll(_this.pageIndex2, _this.pageSize2, _this.equipKey, -1, -1, _this.treeObj);
									} else {              //分组
										_this.tableTopName = _this.getLabel(FGroupGUID);
										_this.treeObj = {
											id: FGroupGUID,
											name: _this.tableTopName,
											fatherId: FAgentGUID,
											type: 0
										}
										_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
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
			//获取详情
			async detailE(index, row) {
				this.EdetailView = true;
				let id = row.FGUID;
				await this.equipDetail(id);
				this.equDetailData = this.deepCopy(this.equipData);
				this.equDetailData.FStatus = (this.equDetailData.FStatus) ? '_启用_' : '_禁用_';
				this.equDetailData.FCreateTime = this.parseGMT(this.equDetailData.FCreateTime.replace(/T/ig, ' ')).substring(0, 10);
				this.equDetailData.FManufactureDate = this.parseGMT(this.equDetailData.FManufactureDate.replace(/T/ig, ' ')).substring(0, 10);
				// this.listData(this.equDetailData);
				this.equipTranslate(this.equDetailData);
				this.equDetailData.FTHS = this.equDetailData.FTHS == '0' ? '_无该外设_' : this.equDetailData.FTHS == '1' ? '_正常_' : this.equDetailData.FTHS == '2' ? '_异常_' : '0';
				this.equDetailData.FVideo = this.equDetailData.FVideo == '0' ? '_无该外设_' : this.equDetailData.FVideo == '1' ? '_正常_' : this.equDetailData.FVideo == '2' ? '_异常_' : '0';
				this.equDetailData.FRFID = this.equDetailData.FRFID == '0' ? '_无该外设_' : this.equDetailData.FRFID == '1' ? '_正常_' : this.equDetailData.FRFID == '2' ? '_异常_' : '0';
				this.equDetailData.FTPMS = this.equDetailData.FTPMS == '0' ? '_无该外设_' : this.equDetailData.FTPMS == '1' ? '_正常_' : this.equDetailData.FTPMS == '2' ? '_异常_' : '0';
				this.equDetailData.FScreen = this.equDetailData.FScreen == '0' ? '_无该外设_' : this.equDetailData.FScreen == '1' ? '_正常_' : this.equDetailData.FScreen == '2' ? '_异常_' : '0';
				this.equDetailData.FCamera = this.equDetailData.FCamera == '0' ? '_无该外设_' : this.equDetailData.FCamera == '1' ? '_正常_' : this.equDetailData.FCamera == '2' ? '_异常_' : '0';
			},
			//点击左侧树获取公司id
			treeCompany(val) {
				this.tableTopName = val[1];
				this.treeObj = {
					id: val[0],
					name: val[1],
					fatherId: val[2],
					type: val[3]
				}
				switch (val[3]) {
					case 0:
						this.numberTab = false;
						this.activeName = '1';
						if (this.pageIndex1 == 1) {
							this.doQueryE(this.pageIndex1, this.pageSize1, this.equipKey, -1, -1, this.treeObj);
						} else {
							this.pageIndex1 = 1
						}
						break;
					case 1:
						this.numberTab = true;
						if (this.pageIndex1 == 1) {
							this.doQueryE(this.pageIndex1, this.pageSize1, this.equipKey, -1, -1, this.treeObj);
						} else {
							this.pageIndex1 = 1
						}
						if (this.pageIndex2 == 1) {
							this.doQueryEAll(this.pageIndex2, this.pageSize2, this.equipKey, -1, -1, this.treeObj);
						} else {
							this.pageIndex2 = 1
						}
						break;
				}
			},
			//直属设备
			doQueryE(index, size, key, state, type, obj) {
				let _this = this;
				let FTokenID = _this.$store.state.FTokenID;
				let FIsAll = obj.type ? 0 : 2;
				let FAgentGUID = obj.type ? obj.id : obj.fatherId;
				let FGroupGUID = obj.type ? '' : obj.id;
				let postData = {
					FTokenID: FTokenID,
					FAction: "QueryAdminAssetList",
					FAgentGUID: FAgentGUID,
					FIsAll: FIsAll,
					FGroupGUID: FGroupGUID,
					FKey: key,
					FState: state,
					FType: type,
					FPageSize: size,
					FPageIndex: index,
					// FSystemType:this.SystemID,
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
						console.log('公司直属设备', data);
						var Fobj = data;
						_this.equipList = [];
						if (data.Result == 200) {
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus = (obj.FStatus == 1) ? true : false;
								obj.FCreateTime = _this.parseGMT(obj.FCreateTime.replace(/T/ig, ' ')).substring(0, 10);
								_this.equipTranslate(obj);
								_this.equipList.push(obj);
							})
							_this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
						}
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			},
			//全部设备
			doQueryEAll(index, size, key, state, type, obj) {
				let _this = this;
				let FTokenID = _this.$store.state.FTokenID;
				let FAgentGUID = obj.id;
				let postData = {
					FTokenID: FTokenID,
					FAction: "QueryAdminAssetList",
					FAgentGUID: FAgentGUID,
					FIsAll: 1,
					FGroupGUID: '',
					FKey: key,
					FState: state,
					FType: type,
					FPageSize: size,
					FPageIndex: index,
					// FSystemType:this.SystemID,
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
						console.log('公司全部设备', data);
						var Fobj = data;
						_this.equipListAll = [];
						if (data.Result == 200) {
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus = (obj.FStatus == 1) ? true : false;
								obj.FCreateTime = _this.parseGMT(obj.FCreateTime.replace(/T/ig, ' ')).substring(0, 10);
								_this.equipTranslate(obj);
								_this.equipListAll.push(obj);
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
			searchList() {
				if (this.treeObj == '') {
					this.message('_请先选择公司或分组_', 'warning');
				} else {
					if (this.activeName == 1) {
						if (this.pageIndex1 == 1) {
							this.doQueryE(this.pageIndex1, this.pageSize1, this.equipKey, -1, -1, this.treeObj);
						} else {
							this.pageIndex1 = 1;
						}
					} else if (this.activeName == 2) {
						if (this.pageIndex2 == 1) {
							this.doQueryEAll(this.pageIndex2, this.pageSize2, this.equipKey, -1, -1, this.treeObj);
						} else {
							this.pageIndex2 = 1;
						}
					}
				}
			},
			//获取设备详情
			equipDetail(parm) {
				var _this = this;
				return new Promise(resove => {
					let FGUID = parm;
					let TokenID = this.$store.state.FTokenID;
					$.ajax({
						"url": "web/Common/Common_Admin",
						"cache": false,
						"async": true,
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminAssetByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}',
						success: function (data) {
							console.log('data', data);
							//_this.equipCompanyId='2bab69f1-4a3d-4191-a0dd-6de57dedae3c';     //当前公司id
							//_this.equipCompanyId=data.FObject[0].FAgentGUID;   //编辑的时候判断该公司是否仍然可用,现在已不许禁用
							_this.equipData = data.FObject[0]
							console.log('equipData', _this.equipData);
							resove();
						},
						error: function () {
							console.log('_请求失败_')
						}
					});
				})
			},
			//多选删除设备
			deleteMore(ids) {
				if (this.activeName == 1) {
					if (this.tableFguids1) {
						let arrs = this.tableFguids1;
						this.deleteEquip(arrs);
					} else {
						this.message('_请先勾选_', 'warning');
					}
				} else if (this.activeName == 2) {
					if (this.tableFguids2) {
						let arrs = this.tableFguids2;
						this.deleteEquip(arrs);
					} else {
						this.message('_请先勾选_', 'warning');
					}
				}
			},
			//单选删除设备
			deleteone(index, row) {
				let id = row.FGUID;
				console.log(id)
				this.deleteEquip(id);
			},
			//删除设备函数
			deleteEquip(parm) {
				var _this = this;
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
							"data": '{"FTokenID": "' + TokenID + '","FAction": "DeleteAdminAsset","FVersion": "1.0.0","FGUIDs":"' + deleteFGUID + '"}',
							success: function (data) {
								console.log(data);
								if (data.Result !== 200) {
									_this.message('_删除失败_', 'warning');
								} else {
									_this.message('_删除成功_', 'success');
									if (_this.numberTab) {
										_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
										_this.doQueryEAll(_this.pageIndex2, _this.pageSize2, _this.equipKey, -1, -1, _this.treeObj);
									} else {
										_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
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
			moreChange(status) {
				if (this.activeName == 1) {
					if (this.tableFguids1) {
						let arrs = this.tableFguids1;
						let FState = status ? 1 : 0;
						this.changeStatus(FState, arrs);
					} else {
						this.message('_请先勾选_', 'warning');
					}
				} else if (this.activeName == 2) {
					if (this.tableFguids2) {
						let arrs = this.tableFguids2;
						let FState = status ? 1 : 0;
						this.changeStatus(FState, arrs);
					} else {
						this.message('_请先勾选_', 'warning');
					}
				}
			},
			//单选修改状态
			onlyChange(index, row) {
				let status = row.FStatus ? 1 : 0;
				let id = row.FGUID;
				this.changeStatus(status, id);
			},
			//修改状态函数
			changeStatus(status, ids) {
				var _this = this;
				let url = "web/Common/Common_Admin";
				let TokenID = this.$store.state.FTokenID;
				let data = {
					FTokenID: TokenID,
					FAction: "UpdateAdminAssetStatus",
					FGUIDs: ids,
					FState: status,
					FVersion: "1.0.0"
				};
				$.post(url, data, function (res) {
					console.log("修改状态", res);
					if (res.Result == 200) {
						_this.message('_修改成功_', 'success');
						if (_this.numberTab) {
							_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
							_this.doQueryEAll(_this.pageIndex2, _this.pageSize2, _this.equipKey, -1, -1, _this.treeObj);
						} else {
							_this.doQueryE(_this.pageIndex1, _this.pageSize1, _this.equipKey, -1, -1, _this.treeObj);
						}
					}
				}).error(function () {
					console.log('_请求失败_')
				})
			},
			handleSelectionChange1(val) {
				let arr = val;
				let temp = [];
				arr.forEach(obj => {
					temp.push(obj.FGUID);
				})
				this.tableFguids1 = temp.join(',')
			},
			handleSelectionChange2(val) {
				let arr = val;
				let temp = [];
				arr.forEach(obj => {
					temp.push(obj.FGUID);
				})
				this.tableFguids2 = temp.join(',')
			},
			//分页
			handleCurrentChange1(val) {
				this.pageIndex1 = val;
				this.doQueryE(this.pageIndex1, this.pageSize1, this.equipKey, -1, -1, this.treeObj);
			},
			handleCurrentChange2(val) {
				this.pageIndex2 = val;
				this.doQueryEAll(this.pageIndex2, this.pageSize2, this.equipKey, -1, -1, this.treeObj);
			},
			handleSizeChange1(val) {
				this.pageSize1 = val;
				this.doQueryE(this.pageIndex1, this.pageSize1, this.equipKey, -1, -1, this.treeObj);
			},
			handleSizeChange2(val) {
				this.pageSize2 = val;
				this.doQueryEAll(this.pageIndex2, this.pageSize2, this.equipKey, -1, -1, this.treeObj);
			},
			//点击重置
			resetUser() {
				this.oneEquipData = this.deepCopy(this.copyEquipData);
				this.linkVel = '';
				this.groups = [];
			},

		},
		computed: {
			SystemID() {
				return this.$store.state.choiceSystemID;
			},
			sysHave() {
				return this.$store.state.haveSystemIDs;
			}
		},
		watch: {
			screenHeight() {
				this.adjustPage();
			},
			linkSys(v) {
				if (v) {
					this.oneEquipData.FSystemType = v;
				} else {
					this.oneEquipData.FSystemType = this.SystemID;
				}
			}
		},
		directives: {
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
		border: none;
		background-color: white;
		margin-left: -40px;
		box-shadow: none;
		height: 20px !important;
		outline: none;
	}

	#el_table_wrap .el-button {
		padding: 0;
	}
</style>
<style>
	.adcheckEquip {
		margin: 22px 0 10px 0;
	}

	.adcheckEquip .el-checkbox-group .el-row--flex.is-justify-space-around .el-col {
		height: 40px;
	}

	.edcheckEquip {
		/*margin-top:12px;*/
	}

	.userDialog .el-form-item {
		margin-bottom: 14px;
	}

	.discrip .el-form-item__content {
		margin-top: 3px
	}
</style>