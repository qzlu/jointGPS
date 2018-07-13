<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section style="height: 100%">
		<!-- 新增设备-->
		<div class='vehical-width'>
			<el-dialog :title="createAlarm?'_新增报警_':'_编辑报警_'" :visible.sync="alarmView" class="addCar-dialog">
				<el-form :model="ruleForm11" :rules="rules" ref="ruleForm11" label-width="200px">
					<el-row v-if='createAlarm'>
						<el-col :span="11">
							<el-form-item label="_选择车辆_">
								<div data-toggle="modal" data-target="#modal">
									<a href="javascript:;" class="get-carList-dialog" style="margin-right: -50px;margin-top: 4px;">
										<i class="img-icon icon-carList-dialog" style="z-index: 100"></i>
									</a>
									<el-input class="carInput cursor-pointer" readonly='readonly'></el-input>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="_普通公路超速_(km/h)" prop="FOverSpeedOrdinaryRoad">
								<el-input v-model="ruleForm11.FOverSpeedOrdinaryRoad"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_高速公路超速_(km/h)" prop="FOverSpeedHighRoad">
								<el-input v-model="ruleForm11.FOverSpeedHighRoad"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="_超速时长_(min)" prop="FOverSpeedTimeLength">
								<el-input v-model="ruleForm11.FOverSpeedTimeLength"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_疲劳驾驶超时_(min)" prop="FFatigueRunningTimeLength">
								<el-input v-model="ruleForm11.FFatigueRunningTimeLength"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="_疲劳驾驶休息时长_(min)" prop="FFatigueRestTimeLength">
								<el-input v-model="ruleForm11.FFatigueRestTimeLength"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_熄火停车时长_(min)" prop="FStopCloseACCTimeLength">
								<el-input v-model="ruleForm11.FStopCloseACCTimeLength"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="_未熄火停车时长_(min)" prop="FStopOpenACCTimeLength">
								<el-input v-model="ruleForm11.FStopOpenACCTimeLength"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_高胎压_(bar)" prop="FTPMSMaxTyre">
								<el-input v-model="ruleForm11.FTPMSMaxTyre"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_最低温_(℃)" prop="FCoolerLowTemperature">
								<el-input v-model="ruleForm11.FCoolerLowTemperature"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="_低胎压_(bar)" prop="FTPMSMinTyre">
								<el-input v-model="ruleForm11.FTPMSMinTyre"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_高胎温_(℃)" prop="FTPMSMaxTem">
								<el-input v-model="ruleForm11.FTPMSMaxTem"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="_低胎温_(℃)" prop="FTPMSMinTem">
								<el-input v-model="ruleForm11.FTPMSMinTem"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_胎温胎压持续时长_(min)" prop="FTPMSTimeLength">
								<el-input v-model="ruleForm11.FTPMSTimeLength"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="_最高温_(℃)" prop="FCoolerHightTemperature">
								<el-input v-model="ruleForm11.FCoolerHightTemperature"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_冷机超温报警时长_(min)" prop="FCoolerTimeLength">
								<el-input v-model="ruleForm11.FCoolerTimeLength"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="submitForm11('ruleForm11')">_保存_</el-button>
					<el-button @click='alarmView=false' type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 内容展示区 -->
		<div style="height: 100%">
			<div style="height: 100%">
				<!-- 左侧树 -->
				<div class='leftTree'>
					<div style="height: 100%">
						<company-alarm v-on:treeId='treeCompany' :typeTable='typeTable'></company-alarm>
					</div>
				</div>
				<!-- 右侧列表弹框 -->
				<div class='rightTable'>
					<div class='tableTab' style="height: 100%">
						<el-tabs type="border-card" style="height: 44px" v-model="activeName">
							<el-tab-pane label="_全局报警设置_" name='1'></el-tab-pane>
							<el-tab-pane label="_车辆设置_" name='2'></el-tab-pane>
						</el-tabs>
						<div v-if='activeName==1'>
							<!-- 操作按钮-->
							<div class='operatea'>
								<div class='adminHeader'>
									<div class="leftbtn">
										<el-button type="primary" icon="caret-right" size="small" @click="submitFormAll('ruleFormAll')">
											<span style="color: white">_保存_</span>
										</el-button>
									</div>
								</div>
							</div>
							<div style='background:white' v-if='treeId'>
								<div v-bind:style="{height:table_height + 'px'}" class='overHeight'>
									<el-form :model="ruleFormAll" ref="ruleFormAll" :rules='rules'>
										<div class='overall-config'>
											<span class="explain-title">_超速报警门阀值_</span>
											<div class='explain-content'>
												<el-row>
													<el-col :span="7">
														<el-form-item label="_普通公路_(km/h)" label-width="160px" label-position="left" prop='FOverSpeedOrdinaryRoad'>
															<el-input size="small" v-model="ruleFormAll.FOverSpeedOrdinaryRoad"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="8">
														<el-form-item label="_高速公路_(km/h)" label-width="220px" label-position="left" prop='FOverSpeedHighRoad'>
															<el-input size="small" v-model="ruleFormAll.FOverSpeedHighRoad"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="1"></el-col>
													<el-col :span="7">
														<el-form-item label="_持续时长_(min)" label-width="180px" label-position="left" prop='FOverSpeedTimeLength'>
															<el-input size="small" v-model="ruleFormAll.FOverSpeedTimeLength"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="1"></el-col>
												</el-row>
											</div>
										</div>
										<div class='overall-config'>
											<span class="explain-title">_疲劳报警门阀值_</span>
											<div class='explain-content'>
												<el-row>
													<el-col :span="7">
														<el-form-item label="_连续驾驶时长_(min)" label-width="160px" label-position="left" prop='FFatigueRunningTimeLength'>
															<el-input size="small" v-model="ruleFormAll.FFatigueRunningTimeLength"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="8">
														<el-form-item label="_休息时长_(min)" label-width="220px" label-position="left" prop='FFatigueRestTimeLength'>
															<el-input size="small" v-model="ruleFormAll.FFatigueRestTimeLength"></el-input>
														</el-form-item>
													</el-col>
												</el-row>
											</div>
										</div>
										<div class='overall-config'>
											<span class="explain-title">_停车报警门阀值_</span>
											<div class='explain-content'>
												<el-row>
													<el-col :span="7">
														<el-form-item label="_熄火停车_(min)" label-width="160px" label-position="left" prop='FStopCloseACCTimeLength'>
															<el-input size="small" v-model="ruleFormAll.FStopCloseACCTimeLength"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="8">
														<el-form-item label="_未熄火停车_(min)" label-width="220px" label-position="left" prop='FStopOpenACCTimeLength'>
															<el-input size="small" v-model="ruleFormAll.FStopOpenACCTimeLength"></el-input>
														</el-form-item>
													</el-col>
												</el-row>
											</div>
										</div>
										<div class='overall-config'>
											<span class="explain-title">_胎温胎压报警门阀值_</span>
											<div class='explain-content'>
												<el-row>
													<el-col :span="7">
														<el-form-item label="_高胎压_(bar)" label-width="160px" label-position="left" prop='FTPMSMaxTyre'>
															<el-input size="small" v-model="ruleFormAll.FTPMSMaxTyre"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="8">
														<el-form-item label="_低胎压_(bar)" label-width="220px" label-position="left" prop='FTPMSMinTyre'>
															<el-input size="small" v-model="ruleFormAll.FTPMSMinTyre"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="1"></el-col>
													<el-col :span="7">
														<el-form-item label="_胎温胎压持续时长_(min)" label-width="180px" label-position="left" prop='FTPMSTimeLength'>
															<el-input size="small" v-model="ruleFormAll.FTPMSTimeLength"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="1"></el-col>
												</el-row>
												<el-row>
													<el-col :span="7">
														<el-form-item label="_高胎温_(℃)" label-width="160px" label-position="left" prop='FTPMSMaxTem'>
															<el-input size="small" v-model="ruleFormAll.FTPMSMaxTem"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="8">
														<el-form-item label="_低胎温_(℃)" label-width="220px" label-position="left" prop='FTPMSMinTem'>
															<el-input size="small" v-model="ruleFormAll.FTPMSMinTem"></el-input>
														</el-form-item>
													</el-col>
												</el-row>
											</div>
										</div>
										<div class='overall-config'>
											<span class="explain-title">_温度报警门阀值_</span>
											<div class='explain-content'>
												<el-row>
													<el-col :span="7">
														<el-form-item label="_最高温_(°C)" label-width="160px" label-position="left" prop='FCoolerHightTemperature'>
															<el-input size="small" v-model="ruleFormAll.FCoolerHightTemperature"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="8">
														<el-form-item label="_最低温_(°C)" label-width="220px" label-position="left" prop='FCoolerLowTemperature'>
															<el-input size="small" v-model="ruleFormAll.FCoolerLowTemperature"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="1"></el-col>
													<el-col :span="7">
														<el-form-item label="_冷机超温报警时长_(min)" label-width="200px" label-position="left" prop='FCoolerTimeLength'>
															<el-input size="small" v-model="ruleFormAll.FCoolerTimeLength"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="1"></el-col>
												</el-row>
											</div>
										</div>
										<div class='overall-config'>
											<span class="explain-title">_时差_</span>
											<div class='explain-content'>
												<el-row>
													<el-col :span="9">
														<el-form-item label="_时差_" label-width="160px" label-position="left">
															<div class='timeThree'>
																<el-row>
																	<el-col :span="8">
																		<el-select v-model="ruleFormAll.timeZoneSign">
																			<el-option v-for="item in timeZone.sign" :label="item" :value="item">
																			</el-option>
																		</el-select>
																	</el-col>
																	<el-col :span="7">
																		<el-select v-model="ruleFormAll.hour">
																			<el-option v-for="item in timeZone.hour" :label="item" :value="item">
																			</el-option>
																		</el-select>
																	</el-col>
																	<el-col :span="1">：</el-col>
																	<el-col :span="8">
																		<el-select v-model="ruleFormAll.minute">
																			<el-option v-for="item in timeZone.minute" :label="item" :value="item">
																			</el-option>
																		</el-select>
																	</el-col>
																</el-row>
															</div>
														</el-form-item>
													</el-col>
													<el-col :span="1"></el-col>
												</el-row>
											</div>
										</div>
									</el-form>
								</div>
							</div>
							<div style='background:white' v-else='treeId'>
								<div v-bind:style="{height:table_height + 'px'}" class='overHeight container'>
									<div v-bind:style="{margin:imgHeight + 'px'}">
										<img src='/static/img/alarm.png' class='text-center'></img>
										<div style='height:30px;line-height:30px;font-size:16px;background:#5facfb7a;width:300px;' class='text-center'>
											<i class='el-icon-info'></i>
											<span>_您还没有选择公司哦_</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-if='activeName==2'>
							<!--  操作按钮 -->
							<div class='operatea'>
								<div class='adminHeader'>
									<div class="leftbtn">
										<span class='tableTop'>{{tableTopName}}</span>
										<!-- <el-button type="primary" icon="plus" size="small" @click='addAlarm'><span
					                  						                              style="color: white">_新建_</span>
					                  						                    </el-button>
					                  						                    <el-button type="primary" icon="delete" size="small" @click="deleteMore">_删除_</el-button> -->
									</div>
									<div class="rightinput" style="position: relative;margin-right:30px">
										<input type="text" placeholder="_请输入车牌号_" v-model="alarmKey" @keyup.enter="searchList">
										<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;position:absolute;top:14px;right:20px" @click="searchList"></button>
									</div>
								</div>
							</div>
							<!-- 车辆表格 -->
							<div id="el_table_wrap" class="el_table_wrap">
								<el-table :data="alarmList" @selection-change="handleSelectionChange1" ref="multipleTable1" :height="table_height" stripe
								 style="width: 100%;" v-loading="loading" element-loading-text="_拼命加载中_...">
									<el-table-column type="selection" width="55"></el-table-column>
									<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
									<el-table-column label="_操作_" prop="operate" width="80">
										<template scope="scope">
											<el-button type="text" size="small" @click="editAlarm(scope.$index, scope.row)">
												<i class="el-icon-edit" title='_编辑_'></i>
											</el-button>
											<!-- <el-button  type="text" size="small"  @click="deleteone(scope.$index,scope.row)"><i class="el-icon-delete" title='_删除_'></i></el-button> -->
										</template>
									</el-table-column>
									<el-table-column width="160" prop="FVehicleName" label="_车牌号_"></el-table-column>
									<el-table-column width="165" prop="FOverSpeedOrdinaryRoad" label="_普通公路超速_(km/h)"></el-table-column>
									<el-table-column width="195" prop="FOverSpeedHighRoad" label="_高速公路超速_(km/h)"></el-table-column>
									<el-table-column width="150" prop="FOverSpeedTimeLength" label="_超速时长_(min)"></el-table-column>
									<el-table-column width="180" prop="FFatigueRunningTimeLength" label="_疲劳驾驶超时_(min)"></el-table-column>
									<el-table-column width="210" prop="FFatigueRestTimeLength" label="_疲劳驾驶休息时长_(min)"></el-table-column>
									<el-table-column width="190" prop="FStopCloseACCTimeLength" label="_熄火停车时长_(min)"></el-table-column>
									<el-table-column width="190" prop="FStopOpenACCTimeLength" label="_未熄火停车时长_(min)"></el-table-column>
									<el-table-column width="120" prop="FTPMSMaxTyre" label="_高胎压_(bar)"></el-table-column>
									<el-table-column width="120" prop="FTPMSMinTyre" label="_低胎压_(bar)"></el-table-column>
									<el-table-column width="120" prop="FTPMSMaxTem" label="_高胎温_(℃)"></el-table-column>
									<el-table-column width="120" prop="FTPMSMinTem" label="_低胎温_(℃)"></el-table-column>
									<el-table-column width="210" prop="FTPMSTimeLength" label="_胎温胎压持续时长_(min)"></el-table-column>
									<el-table-column width="120" prop="FCoolerHightTemperature" label="_最高温_(℃)"></el-table-column>
									<el-table-column width="120" prop="FCoolerLowTemperature" label="_最低温_(℃)"></el-table-column>
									<el-table-column width="150" prop="FCoolerTimeLength" label="_超温时长_(min)"></el-table-column>
								</el-table>
							</div>
							<!-- 分页 -->
							<div class="pagination">
								<div class="block">
									<el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pageIndex1" :page-sizes="[10, 20, 30]"
									 :page-size="pageSize1" layout="prev, pager, next, jumper,total,sizes" :total="FTotalCount1">
									</el-pagination>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<vehical-list v-on:child="get"></vehical-list>
	</section>
</template>
<script>
	import companyAlarm from 'components/Company/companyAlarm.vue'
	import vehicalList from 'components/dialog/vehicalList.vue'
	export default {
		data() {
			const checkRoad = (rule, value, callback) => {  //普路
				var par1 = /^[1-9]\d*$/;   //非零的正整数：
				if (!par1.test(value) || (value > 150) || (value < 20)) {
					//callback(new Error('_请输入_(20~150)_之间的整数_'));
					callback(new Error('(20~150)'));
				} else {
					callback();
				}
			};
			const checkHigh = (rule, value, callback) => {  //高速
				var par2 = /^[1-9]\d*$/;   //非零的正整数：
				if (!par2.test(value) || (value > 150) || (value < 50)) {
					//callback(new Error('_请输入_(50~150)_之间的整数_'));
					callback(new Error('(50~150)'));
				} else {
					callback();
				}
			};
			const checkTime = (rule, value, callback) => {   //超时时长
				var par3 = /^[0-9]+(.[0-9]{1})?$/;   //带1位小数的正实数：
				if (!par3.test(value) || (value > 20) || (value <= 0)) {
					//callback(new Error('_请输入_(0~20)_之间的数字_'));
					callback(new Error('(0~20)'));
				} else {
					callback();
				}
			};
			const checkFatTime = (rule, value, callback) => {   //疲劳休息时长
				var par4 = /^[0-9]+(.[0-9]{1})?$/;   //带1位小数的正实数：
				if (!par4.test(value) || (value > 40) || (value <= 0)) {
					//callback(new Error('_请输入_(0~40)_之间的数字_'));
					callback(new Error('(0~40)'));
				} else {
					callback();
				}
			};
			const checkFat = (rule, value, callback) => {   //疲劳时长
				var par5 = /^[0-9]+(.[0-9]{1})?$/;   //带1位小数的正实数：
				if (!par5.test(value) || (value > 240) || (value <= 0)) {
					//callback(new Error('_请输入_(0~240)_之间的数字_'));
					callback(new Error('(0~240)'));
				} else {
					callback();
				}
			};
			const checkMaxTyre = (rule, value, callback) => {  //胎压
				var par6 = /^[0-9]+(.[0-9]{1})?$/;   //带1位小数的正实数：
				if (!par6.test(value) || (value > 13) || (value < 7)) {
					//callback(new Error('_请输入_(7~13)_之间的数字_'));
					callback(new Error('(7~13)'));
				} else {
					callback();
				}
			};
			const checkMaxTem = (rule, value, callback) => {  //胎温
				var par7 = /^(\-)?\d+(\.\d{1})?$/;
				if (!par7.test(value) || (value > 100)) {
					//callback(new Error('_请输入不大于_100_的数字_'));
					callback(new Error('<=100'));
				} else {
					callback();
				}
			};
			return {
				tableTopName: '_请选择公司_',
				timeZone: {
					sign: ['+', '-'],
					hour: [
						0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
					],
					minute: [0, 30, 45]
				},
				ruleFormAll: {
					FOverSpeedTimeLength: '',
					FOverSpeedHighRoad: '',
					FOverSpeedOrdinaryRoad: '',
					FFatigueRunningTimeLength: '',
					FFatigueRestTimeLength: '',
					FStopCloseACCTimeLength: '',
					FStopOpenACCTimeLength: '',
					FTPMSMaxTyre: '',
					FTPMSMinTyre: '',
					FTPMSMaxTem: '',
					FTPMSMinTem: '',
					FTPMSTimeLength: '',
					FCoolerHightTemperature: '',
					FCoolerLowTemperature: '',
					FCoolerTimeLength: '',
					FTimeDifferent: '',
					timeZoneSign: '+',
					hour: 0,
					minute: 0
				},
				//新增车辆表单
				ruleForm11: {
					FOverSpeedTimeLength: '',
					FOverSpeedHighRoad: '',
					FOverSpeedOrdinaryRoad: '',
					FFatigueRunningTimeLength: '',
					FFatigueRestTimeLength: '',
					FStopCloseACCTimeLength: '',
					FStopOpenACCTimeLength: '',
					FTPMSMaxTyre: '',
					FTPMSMinTyre: '',
					FTPMSMaxTem: '',
					FTPMSMinTem: '',
					FTPMSTimeLength: '',
					FCoolerHightTemperature: '',
					FCoolerLowTemperature: '',
					FCoolerTimeLength: '',
				},
				copyruleForm11: {
					FOverSpeedTimeLength: '',
					FOverSpeedHighRoad: '',
					FOverSpeedOrdinaryRoad: '',
					FFatigueRunningTimeLength: '',
					FFatigueRestTimeLength: '',
					FStopCloseACCTimeLength: '',
					FStopOpenACCTimeLength: '',
					FTPMSMaxTyre: '',
					FTPMSMinTyre: '',
					FTPMSMaxTem: '',
					FTPMSMinTem: '',
					FTPMSTimeLength: '',
					FCoolerHightTemperature: '',
					FCoolerLowTemperature: '',
					FCoolerTimeLength: '',
				},
				alarmList: [],
				alarmKey: '',
				createAlarm: false,
				alarmView: false,
				activeName: '1',
				table_height: null,
				imgHeight: null,
				typeTable: 4,
				driverKey: '',
				pageIndex1: 1,
				pageSize1: 20,
				FTotalCount1: 0,
				tableFguids1: '',
				treeId: '',
				FGUID: '',
				rules: {
					FOverSpeedTimeLength: [{ required: true, validator: checkTime }],
					FOverSpeedHighRoad: [{ required: true, validator: checkHigh }],
					FOverSpeedOrdinaryRoad: [{ required: true, validator: checkRoad }],
					FFatigueRunningTimeLength: [{ required: true, validator: checkFat }],
					FFatigueRestTimeLength: [{ required: true, validator: checkFatTime }],
					FStopCloseACCTimeLength: [{ required: true, validator: checkTime }],
					FStopOpenACCTimeLength: [{ required: true, validator: checkTime }],
					FTPMSMaxTyre: [{ required: true, validator: checkMaxTyre }],
					FTPMSMinTyre: [{ required: true, validator: checkMaxTyre }],
					FTPMSMaxTem: [{ required: true, validator: checkMaxTem }],
					FTPMSMinTem: [{ required: true, validator: checkMaxTem }],
					FTPMSTimeLength: [{ required: true, validator: checkTime }],
					FCoolerHightTemperature: [{ required: true, validator: checkMaxTem }],
					FCoolerLowTemperature: [{ required: true, validator: checkMaxTem }],
					FCoolerTimeLength: [{ required: true, validator: checkTime }],
				},
			}
		},
		props: {
			screenHeight: Number
		},
		components: {
			companyAlarm, vehicalList
		},
		mounted() {
			setTimeout(() => {
				this.adjustPage();
			}, 100);
		},
		methods: {
			//查询全局
			doQueryAll(id) {
				let _this = this;
				let TokenID = this.$store.state.FTokenID;
				let FAgentGUID = id;
				$.ajax({
					"url": '/web/Common/Common_System',
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": '{"FTokenID": "' + TokenID + '","FAction": "QuerySystemConfigAlarmAll","FAgentGUID":"' + FAgentGUID + '","FVersion": "1.0.0"}',
					success: function (data) {
						console.log('全局数据', data);
						var Fobj = data;
						Fobj.FObject[0].timeZoneSign = _this.parseTimeZone(Fobj.FObject[0].FTimeDifferent).timeZoneSign;
						Fobj.FObject[0].hour = _this.parseTimeZone(Fobj.FObject[0].FTimeDifferent).hour;
						Fobj.FObject[0].minute = _this.parseTimeZone(Fobj.FObject[0].FTimeDifferent).minute;

						_this['ruleFormAll'] = _this.deepCopy(Fobj.FObject[0]);
						_this['ruleFormAll'].FFatigueRunningTimeLength = Fobj.FObject[0].FFatigueRunningTimeLength / 60;
						_this['ruleFormAll'].FFatigueRestTimeLength = Fobj.FObject[0].FFatigueRestTimeLength / 60;
						_this['ruleFormAll'].FStopCloseACCTimeLength = Fobj.FObject[0].FStopCloseACCTimeLength / 60;
						_this['ruleFormAll'].FStopOpenACCTimeLength = Fobj.FObject[0].FStopOpenACCTimeLength / 60;
						_this['ruleFormAll'].FTPMSTimeLength = Fobj.FObject[0].FTPMSTimeLength / 60;
						_this['ruleFormAll'].FOverSpeedTimeLength = Fobj.FObject[0].FOverSpeedTimeLength / 60;
						_this['ruleFormAll'].FCoolerTimeLength = Fobj.FObject[0].FCoolerTimeLength / 60;
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			},
			//全局/新增、修改（注意系统补齐)
			submitFormAll(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let _this = this;
						let FAgentGUID = this.treeId;
						let TokenID = this.$store.state.FTokenID;
						let obj = _this.deepCopy(this[formName]);
						obj.FFatigueRunningTimeLength = obj.FFatigueRunningTimeLength * 60;
						obj.FFatigueRestTimeLength = obj.FFatigueRestTimeLength * 60;
						obj.FStopCloseACCTimeLength = obj.FStopCloseACCTimeLength * 60;
						obj.FStopOpenACCTimeLength = obj.FStopOpenACCTimeLength * 60;
						obj.FOverSpeedTimeLength = obj.FOverSpeedTimeLength * 60;
						obj.FTPMSTimeLength = obj.FTPMSTimeLength * 60;
						obj.FCoolerTimeLength = obj.FCoolerTimeLength * 60;
						obj.FTimeDifferent = this.getTimeZone(obj.timeZoneSign, obj.hour, obj.minute);
						let dataJson;
						dataJson = JSON.stringify({
							FTokenID: TokenID, FAction: "UpdateSystemConfigAlarmAll",
							FT_SystemConfigAlarm: obj,
							FAgentGUID: FAgentGUID, FVersion: "1.0.0"
						})
						$.ajax({
							"url": '/web/Common/Common_System',
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": dataJson,
							success: function (data) {
								console.log(data);
								if (data.Result == 104) {
									_this.message('_登录超时_,_五秒后跳转到登录页面_', 'warning');
									setTimeout(function () {
										_this.$store.commit("goLogin");
									}, 5000)
									return
								} else if (data.Result == 200) {
									_this.message('_保存成功_', 'success');
									_this.doQueryAll(FAgentGUID);
								}
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//多选删除
			deleteMore(ids) {
				if (this.tableFguids1) {
					let arrs = this.tableFguids1;
					this.deleteAlarm(arrs);
				} else {
					this.message('_请先勾选_', 'warning');
				}
			},
			//单选删除
			deleteone(index, row) {
				console.log('row', row)
				let id = row.FVehicleGUID;
				this.deleteAlarm(id);
			},
			//删除函数
			deleteAlarm(parm) {
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
							"url": "/web/Common/Common_System",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": '{"FTokenID": "' + TokenID + '","FAction": "DeleteSystemConfigAlarmVehicle","FVersion": "1.0.0","FVehicleGUIDs":"' + deleteFGUID + '"}',
							success: function (data) {
								console.log(data);
								if (data.Result !== 200) {
									_this.message('_删除失败_', 'warning');
								} else {
									_this.message('_删除成功_', 'success');
									_this.doQueryList(_this.pageIndex1, _this.pageSize1, _this.alarmKey, _this.treeId);
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
			//点击新增
			addAlarm() {
				this.createAlarm = true;
				this.alarmView = true;
				this.ruleForm11 = this.deepCopy(this.copyruleForm11);
				console.log('this.ruleForm11', this.ruleForm11)
				$('.carInput input').val('');
				$('.carInput input').attr('title', '');
				$('.carInput input').attr('fguid', '');
			},
			// 点击节点
			get: function (data) {
				$('.carInput input').val(data[0]);
				$('.carInput input').attr('title', data[0])
				$('.carInput input').attr('fguid', data[1])
				this.FGUID = data[1];
			},
			//单车/新增、修改（注意系统补齐)
			submitForm11(formName) {
				let _this = this;
				if (this.createAlarm) {
					if ($('.carInput input').val() == '') {   //新增加入选车条件
						this.message('_请选择车辆_/_箱号_', 'warning');
						return
					};
				}
				if (this.createAlarm) {
					this[formName].FCoolerLowTemperature = 35;
					this[formName].FCoolerHightTemperature = 100;
					this[formName].FCoolerTimeLength = 20;
					this[formName].FTPMSMaxTyre = 13;
					this[formName].FTPMSMinTyre = 7;
					this[formName].FTPMSMaxTem = 100;
					this[formName].FTPMSMinTem = 25;
					this[formName].FTPMSTimeLength = 20;


				} else {
					delete this[formName].FVehicleName;
					delete this[formName].RowNo;
					delete this[formName].FVehicleGUID;
				}

				this.$refs[formName].validate((valid) => {
					if (valid) {
						let dataJson;
						let FAgentGUID = this.treeId;
						let TokenID = this.$store.state.FTokenID;
						let FGUID = this.FGUID;
						let obj = _this.deepCopy(this[formName]);
						obj.FFatigueRunningTimeLength = obj.FFatigueRunningTimeLength * 60;
						obj.FFatigueRestTimeLength = obj.FFatigueRestTimeLength * 60;
						obj.FStopCloseACCTimeLength = obj.FStopCloseACCTimeLength * 60;
						obj.FStopOpenACCTimeLength = obj.FStopOpenACCTimeLength * 60;
						obj.FOverSpeedTimeLength =obj.FOverSpeedTimeLength * 60;
						obj.FTPMSTimeLength = obj.FTPMSTimeLength * 60;
						obj.FCoolerTimeLength = obj.FCoolerTimeLength * 60;
						dataJson = JSON.stringify({
							FTokenID: TokenID, FAction: "UpdateSystemConfigAlarmVehicle",
							FT_SystemConfigAlarm: obj,
							FVehicleGUID: FGUID, FVersion: "1.0.0"
						})
						$.ajax({
							"url": '/web/Common/Common_System',
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": dataJson,
							success: function (data) {
								console.log(data);
								console.log('dataJson', dataJson);
								if (data.Result == 104) {
									_this.message('_登录超时_,_五秒后跳转到登录页面_', 'warning');
									setTimeout(function () {
										_this.$store.commit("goLogin");
									}, 5000)
									return
								} else if (data.Result == 200) {
									_this.message('_保存成功_', 'success');
									_this.alarmView = false;
									_this.doQueryList(_this.pageIndex1, _this.pageSize1, _this.alarmKey, _this.treeId);
								}
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//点击编辑单车
			editAlarm(index, row) {
				this.alarmView = true;
				this.createAlarm = false;
				console.log('row', row);
				this.ruleForm11 = this.deepCopy(row);
				this.FGUID = row.FVehicleGUID;
			},
			//重置
			resetFormall(ruleForm) {
				this[ruleForm].FOverSpeedTimeLength = '';
				this[ruleForm].FOverSpeedHighRoad = '';
				this[ruleForm].FOverSpeedOrdinaryRoad = '';
				this[ruleForm].FFatigueRunningTimeLength = '';
				this[ruleForm].FFatigueRestTimeLength = '';
				this[ruleForm].FStopCloseACCTimeLength = '';
				this[ruleForm].FStopOpenACCTimeLength = '';

				this[ruleForm].FTPMSMaxTyre = '';
				this[ruleForm].FTPMSMinTyre = '';
				this[ruleForm].FTPMSMaxTem = '';
				this[ruleForm].FTPMSMinTem = '';
				this[ruleForm].FTPMSTimeLength = '';
				this[ruleForm].FCoolerHightTemperature = '';
				this[ruleForm].FCoolerLowTemperature = '';
				this[ruleForm].FCoolerTimeLength = '';


				console.log('res', this[ruleForm]);
			},
			//重置单车
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//点击左侧树获取公司id
			treeCompany(val) {
				this.tableTopName = val[1];
				this.treeId = val[0];       //保存下来翻页是时候会使用
				console.log('this.treeId', this.treeId);
				this.doQueryAll(this.treeId);
				if (this.pageIndex1 == 1) {
					this.doQueryList(this.pageIndex1, this.pageSize1, this.alarmKey, this.treeId);
				} else {
					this.pageIndex1 = 1
				}
			},
			//快捷搜索
			searchList() {
				if (this.treeId == '') {
					this.message('_请先选择公司_', 'warning');
				} else {
					if (this.pageIndex1 == 1) {
						this.doQueryList(this.pageIndex1, this.pageSize1, this.alarmKey, this.treeId);
					} else {
						this.pageIndex1 = 1;
					}
				}
			},
			doQueryList(index, size, key, id) {
				let _this = this;
				let TokenID = this.$store.state.FTokenID;
				let postData = {
					FTokenID: TokenID,
					FAction: "QuerySystemConfigAlarmVehicle",
					FAgentGUID: id,
					FKey: key,
					FPageSize: size,
					FPageIndex: index,
					FVersion: "1.0.0",
				}
				$.ajax({
					"url": "web/Combine/Combine_System",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (data) {
						console.log('车辆设置数据', data);
						_this.alarmList = [];
						if (data.Result == 200) {
							if (data.FObject.Table1.length > 0) {
								$.each(data.FObject.Table1, function (index, obj) {
									obj.FOverSpeedTimeLength = obj.FOverSpeedTimeLength / 60;
									obj.FFatigueRunningTimeLength = obj.FFatigueRunningTimeLength / 60;
									obj.FFatigueRestTimeLength = obj.FFatigueRestTimeLength / 60;
									obj.FStopCloseACCTimeLength = obj.FStopCloseACCTimeLength / 60;
									obj.FStopOpenACCTimeLength = obj.FStopOpenACCTimeLength / 60;
									obj.FTPMSTimeLength = obj.FTPMSTimeLength / 60;
									obj.FCoolerTimeLength = obj.FCoolerTimeLength / 60;
									_this.alarmList.push(obj);
								});
							}
							_this.FTotalCount1 = data.FObject.Table[0].FTotalCount;
						}
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			},
			handleSelectionChange1(val) {
				let arr = val;
				let temp = [];
				arr.forEach(obj => {
					temp.push(obj.FVehicleGUID);
				})
				this.tableFguids1 = temp.join(',');
			},
			//分页
			handleCurrentChange1(val) {
				this.pageIndex1 = val;
				this.doQueryList(this.pageIndex1, this.pageSize1, this.alarmKey, this.treeId);
			},
			handleSizeChange1(val) {
				this.pageSize1 = val;
				this.doQueryList(this.pageIndex1, this.pageSize1, this.alarmKey, this.treeId);
			},
			adjustPage() {
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "", "", true) - 105;
				//this.imgHeight=this.table_height/2-150;
				this.imgHeight = (this.table_height - 300) / 2;
			},
		},
		watch: {
			screenHeight() {
				this.adjustPage();
			},
		},
		computed: {
			language() {
				return this.$store.state.language
			}
		},
	}
</script>
<style scoped>
	.overHeight {
		overflow: auto;
	}

	.leftbtn {
		float: left;
	}

	.rightinput {
		float: right;
	}

	.searchtable {
		height: 30px;
		margin: -25px 0 5px 0;
	}

	.searchtable .searchinput {
		display: inline-block;
		width: 280px;
		height: 30px;
		/*border-radius: 2px;*/
		text-indent: 10px;
		box-shadow: none !important;
		border: 1px solid #d1dbe5;
	}

	.rightinput input {
		border: 1px solid #1970cf;
		height: 28px;
		border-radius: 15px;
		box-shadow: none !important;
		width: 180px;
		padding-left: 10px;

	}

	.rightinput input:active,
	.searchtable .searchinput {
		box-shadow: none !important;
		outline: none;
	}

	.rightinput input:focus,
	.searchtable .searchinput {
		box-shadow: none !important;
		outline: none;
	}

	.searchBtn {
		border: none;
		background-color: white;
		margin-left: -40px;
		box-shadow: none;
		height: 20px !important;
		outline: none;
	}

	.glyphicon-chevron-down {
		margin-left: 30px;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		outline: none;
		background-color: white;
		border: 1px solid #1970cf;
	}

	.el-popover .el-form-item {
		margin-bottom: 0px;
	}

	#el_table_wrap .el-button {
		padding: 0;
	}

	.el-form-item .el-input__inner {
		height: 28px;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
		margin: 5px 0;
	}
</style>
<style>
	.explain-title {
		display: inline-block;
		height: 35px;
		line-height: 35px;
		border-bottom: 4px solid #ffa81c;
		padding: 0 15px;
	}

	.explain-content {
		border-top: 1px solid #ccc;
	}

	.explain-content .el-input--small .el-input__inner {
		border-radius: 0
	}

	.explain-content .el-row:not(:first-child) {
		margin: 10px 0 0 0;
	}

	.explain-content .el-row:first-child {
		margin: 20px 0 0 0;
	}

	.timeThree .el-row:first-child {
		margin: 0 0 0 0;
	}

	.timeThree .el-input__inner {
		height: 30px;
		border-radius: 0;
	}

	.overall-config:not(:first-child) {
		margin-top: 20px;
	}

	.addCar-dialog .el-input__inner {
		text-indent: 18px;
	}

	.w {
		border: 1px solid red;
	}
</style>