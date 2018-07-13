<template>
	<section style="height: 100%" class="row">
		<div class="vehicleList">
			<div class="carTeamList ">
				<el-input class="filterInput oilBoxConfigInput" placeholder="_输入关键字_" v-model="filterText">
				</el-input>
				<i class="fa fa-search fa-lg"></i>
				<el-tree class="filter-tree" :props="defaultProps" :highlight-current="true" :data="OilBoxConfigTreeData" node-key="id" default-expand-all
				 :filter-node-method="filterNode" :render-content="renderContent" @node-click="handleNodeClick" ref="tree2">
				</el-tree>
			</div>
		</div>
		<div class="configPanel">
			<header class="configCar" id="configCar">
				<div class="VehicleName">{{FVehicleName}}</div>
				<div class="operate-option">
					<el-cascader :options="options" size="mini" popper-class="OilBoxConfigCascader" v-model="selectedOptions" @change="handleChange">
					</el-cascader>
					<el-button type="primary" @click="save('SingleOilBox')" v-if="isShowSingleOilBox">_保存配置_</el-button>
					<el-button type="primary" @click="save('MultiOilBox')" v-if="isShowMultiOilBox">_保存配置_</el-button>
					<el-button type="primary" @click="deleteConfig">_删除配置_</el-button>
				</div>
			</header>
			<!--<div id="allOilBox" style="overflow-y: scroll;">-->
			<!--单油箱-->
			<div class="singleOilBox" v-show="isShowSingleOilBox">
				<el-row>
					<el-col :span="10">
						<img src="/static/img/oilBoxConfig_bg.png" alt="" class="oilBoxConfig_bg">
					</el-col>
					<el-col :span="14">
						<el-row>
							<el-col :span="24">
								<el-col :span="6">_满值_</el-col>
								<el-col :span="18">
									<el-input type="number" v-model="singleOilBoxData.FFuelMax"></el-input>
								</el-col>
							</el-col>
							<el-col :span="24">
								<el-col :span="6">_油箱体积_(_升_)</el-col>
								<el-col :span="18">
									<el-input type="number" v-model="singleOilBoxData.FFuelSize"></el-input>
								</el-col>
							</el-col>
							<el-col :span="24">
								<el-col :span="6">_液位高度_(mm)</el-col>
								<el-col :span="18">
									<el-input type="number" v-model="singleOilBoxData.FFuelHigh"></el-input>
								</el-col>
							</el-col>
							<el-col :span="24">
								<el-col :span="6">_零值_</el-col>
								<el-col :span="18">
									<el-input type="number" v-model="singleOilBoxData.FFuelMin"></el-input>
								</el-col>
							</el-col>
						</el-row>
					</el-col>
				</el-row>


			</div>
			<!--多油箱-->
			<div class="multiOilBox" :style="{height:div_height+'px'}" v-show="isShowMultiOilBox">
				<div class="oilBoxItem">
					<div class="oilBox oilBox-first">
						<span>_油箱_1</span>
					</div>
					<div class="oilBox-first-config">
						<el-row>
							<el-col :span="10">
								<img src="/static/img/oilBoxConfig_bg.png" alt="" class="oilBoxConfig_bg">
							</el-col>
							<el-col :span="14">
								<el-row>
									<el-col :span="24" class="col-margin-top-20">
										<el-col :span="6">_满值_</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox1.FFuelMax"></el-input>
										</el-col>
									</el-col>
									<el-col :span="24">
										<el-col :span="6">_油箱体积_(_升_)</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox1.FFuelSize"></el-input>
										</el-col>
									</el-col>
									<el-col :span="24" class="col-margin-top-45">
										<el-col :span="6">_零值_</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox1.FFuelMin"></el-input>
										</el-col>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</div>

				</div>
				<div class="oilBoxItem">
					<div class="oilBox oilBox-first">
						<span>_油箱_2</span>
					</div>
					<div class="oilBox-first-config">
						<el-row>
							<el-col :span="10">
								<img src="/static/img/oilBoxConfig_bg.png" alt="" class="oilBoxConfig_bg">
							</el-col>
							<el-col :span="14">
								<el-row>
									<el-col :span="24" class="col-margin-top-20">
										<el-col :span="6">_满值_</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox2.FFuelMax"></el-input>
										</el-col>
									</el-col>
									<el-col :span="24">
										<el-col :span="6">_油箱体积_(_升_)</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox2.FFuelSize"></el-input>
										</el-col>
									</el-col>
									<el-col :span="24" class="col-margin-top-45">
										<el-col :span="6">_零值_</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox2.FFuelMin"></el-input>
										</el-col>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</div>

				</div>
				<div class="oilBoxItem">
					<div class="oilBox oilBox-first">
						<span>_油箱_3</span>
					</div>
					<div class="oilBox-first-config">
						<el-row>
							<el-col :span="10">
								<img src="/static/img/oilBoxConfig_bg.png" alt="" class="oilBoxConfig_bg">
							</el-col>
							<el-col :span="14">
								<el-row>
									<el-col :span="24" class="col-margin-top-20">
										<el-col :span="6">_满值_</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox3.FFuelMax"></el-input>
										</el-col>
									</el-col>
									<el-col :span="24">
										<el-col :span="6">_油箱体积_(_升_)</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox3.FFuelSize"></el-input>
										</el-col>
									</el-col>
									<el-col :span="24" class="col-margin-top-45">
										<el-col :span="6">_零值_</el-col>
										<el-col :span="18">
											<el-input type="number" v-model="multiOilBox3.FFuelMin"></el-input>
										</el-col>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</div>

				</div>
			</div>
			<!--</div>-->
		</div>
	</section>
</template>
<script>
	import baidu from 'js/GIS/Baidu/BaiduAPI'
	let _this
	export default {
		data() {
			_this = this;
			return {
				loading: true,
				filterText: '',
				//OilBoxConfigTreeData: null,
				defaultProps: {
					children: 'children',
					label: 'label',
					id: 'id',
				},
				FVehicleName: null,
				FVehicleGUID: null,
				FAssetID: null,
				success: false,
				error: false,
				//温度
				Temperature1: null,
				Temperature2: null,
				Temperature3: null,
				Temperature4: null,
				//电量
				electricity1: null,
				electricity2: null,
				electricity3: null,
				electricity4: null,
				//湿度
				humidity1: null,
				humidity2: null,
				humidity3: null,
				humidity4: null,
				//设备ID
				SensorID1: null,
				SensorID2: null,
				SensorID3: null,
				SensorID4: null,

				//一下为新加data
				//单个
				singleOilBoxData: {
					FFuelMin: "0",
					FFuelMax: "4095", //市场部要求设置此数值为默认设置
					FFuelSize: "",
					FFuelHigh: "0"
				},
				//多个
				multiOilBox1: {
					FFuelMin: "0",
					FFuelMax: "4095",
					FFuelSize: ""
				},
				multiOilBox2: {
					FFuelMin: "0",
					FFuelMax: "4095",
					FFuelSize: ""
				},
				multiOilBox3: {
					FFuelMin: "0",
					FFuelMax: "4095",
					FFuelSize: ""
				},
				options: [
					{
						value: '1',
						label: '_单油箱_',
					},
					{
						value: '2',
						label: '_多油箱_',
					}
				],
				selectedOptions: ["1"],
				isShowSingleOilBox: true,
				isShowMultiOilBox: false,
				div_height: null,


			}
		},
		activated: function () {
		},
		watch: {
			filterText(val) {
				this.$refs.tree2.filter(val);
			},
			screenHeight() {
				this.adjustPage();
			}
		},
		computed: {
			OilBoxConfigTreeData() {
				return _this.$store.state.allCarsData;
			}
		},
		props: {
			screenHeight: Number
		},
		mounted() {
			setTimeout(() => {
				this.adjustPage()
			}, 100);
			/* 			if (this.$store.state.allCarsList != null) {
							setData()
						} else {
							this.$store.commit('getAllCarsData', setData)
						}
						function setData() {
							_this.OilBoxConfigTreeData = _this.$store.state.allCarsData;
							//console.log(_this.OilBoxConfigTreeData)
						} */
		},
		updated() {
			$('.configResult').eq($('.configResult').length - 1).css("border-bottom", "1px solid #ccc")
		},
		methods: {
			renderContent(h, { node, data, store }) {
				//console.log(data);
				//console.log(node);
				let str = "";
				data.FVehicleSerialCode == "" ? str = "" : str = "(" + data.FVehicleSerialCode + ")";
				return (
					/*{{"green":!data.FAlarmOffLine&&data.id.indexOf("@A")==-1&&data.id.indexOf("@B")==-1&&data.id.indexOf("@C")==-1}}*/
					<span class="" style="height:100%;width:100%">
						<i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A") != -1}></i>
						<i class="fa fa-building icon" v-show={data.id.indexOf("@B") != -1}></i>
						<i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C") != -1}></i>
						<i class="fa fa-truck icon" v-show={data.id.indexOf("@B") == -1 & data.id.indexOf("@A") == -1 & data.id.indexOf("@C") == -1}></i>
						{node.label}
						<span v-show={data.id.indexOf("@B") != -1 || data.id.indexOf("@A") != -1 || data.id.indexOf("@C") != -1} style="font-weight:bold">[{data.count}]</span>
						<span style="margin-left:10px" v-show={data.id.indexOf("@B") == -1 & data.id.indexOf("@A") == -1 & data.id.indexOf("@C") == -1}>{str}</span>
						<div class={{ "configResult": true, "green": data.message == "_保存成功_" }}>
							<i class={{ "el-icon-loading green": data.message == "_正在保存_", "el-icon-circle-check": data.message == "_保存成功_", "el-icon-circle-close": data.message == "_保存失败_" }}></i>
							<span class="green" v-show={data.IsConfigFuel && data.message == null}>_已配置_</span> <span v-show={data.message != null}>{data.message}</span></div>
					</span>
				)
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			handleNodeClick(data) {
				if (data.id.indexOf("@A") === -1 && data.id.indexOf("@B") === -1 && data.id.indexOf("@C") === -1) {
					//console.log(data);
					_this.FVehicleName = data.label;
					_this.FVehicleGUID = data.id;
					let postData = {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryFuelConfigByFVehicleGUID",
						FVehicleGUID: _this.FVehicleGUID,
						FVersion: "1.0.0"
					};
					$.ajax({
						"url": "/web/Combine/Combine_System",
						"cache": false,
						"async": true,
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": JSON.stringify(postData),
						success: function (json) {
							//console.log(json);
							if (json.Result = "200" && json.FObject.length != 0 && json.FObject.length == 1) {
								_this.reset();
								_this.singleOilBoxData.FFuelMin = json.FObject[0].FFuelMin;
								_this.singleOilBoxData.FFuelMax = json.FObject[0].FFuelMax;
								_this.singleOilBoxData.FFuelSize = json.FObject[0].FFuelSize;
								_this.singleOilBoxData.FFuelHigh = json.FObject[0].FFuelHigh;
								_this.selectedOptions = ["1"];
								_this.isShowSingleOilBox = true;
								_this.isShowMultiOilBox = false;
							} else if (json.FObject.length > 1) {


								_this.multiOilBox1.FFuelMin = json.FObject[0].FFuelMin;
								_this.multiOilBox1.FFuelMax = json.FObject[0].FFuelMax;
								_this.multiOilBox1.FFuelSize = json.FObject[0].FFuelSize;

								_this.multiOilBox2.FFuelMin = json.FObject[1].FFuelMin;
								_this.multiOilBox2.FFuelMax = json.FObject[1].FFuelMax;
								_this.multiOilBox2.FFuelSize = json.FObject[1].FFuelSize;

								if (json.FObject.length > 2) {
									_this.multiOilBox3.FFuelMin = json.FObject[2].FFuelMin;
									_this.multiOilBox3.FFuelMax = json.FObject[2].FFuelMax;
									_this.multiOilBox3.FFuelSize = json.FObject[2].FFuelSize;
								}
								_this.selectedOptions = ["2"];
								_this.isShowSingleOilBox = false;
								_this.isShowMultiOilBox = true;
							} else {
								_this.selectedOptions = ["1"];
								_this.isShowSingleOilBox = true;
								_this.isShowMultiOilBox = false;
								_this.reset();
							}
							/*_this.SensorID1=json.FObject[0].FSensorID1;
							_this.SensorID2=json.FObject[0].FSensorID2;
							_this.SensorID3=json.FObject[0].FSensorID3;
							_this.SensorID4=json.FObject[0].FSensorID4;
							_this.Temperature1=json.FObject[0].FTemperature1;
							_this.Temperature2=json.FObject[0].FTemperature2;
							_this.Temperature3=json.FObject[0].FTemperature3;
							_this.Temperature4=json.FObject[0].FTemperature4;
							_this.electricity1=json.FObject[0].FBattery1;
							_this.electricity2=json.FObject[0].FBattery2;
							_this.electricity3=json.FObject[0].FBattery3;
							_this.electricity4=json.FObject[0].FBattery4;
							_this.humidity1=json.FObject[0].FHumidity1;
							_this.humidity2=json.FObject[0].FHumidity2;
							_this.humidity3=json.FObject[0].FHumidity3;
							_this.humidity4=json.FObject[0].FHumidity4;*/
						},
						error: function () {

						}
					})
				}
			},
			adjustPage() {
				this.div_height = this.elementsFlex("allOilBox", "main-content", "configCar", null, true) + 10;
			},
			handleChange(value) {
				if (value == "1") {
					this.isShowSingleOilBox = true;
					this.isShowMultiOilBox = false;
				} else if (value == "2") {
					this.isShowSingleOilBox = false;
					this.isShowMultiOilBox = true;
				}
			},
			//重置
			reset() {
				this.singleOilBoxData = {
					FFuelMin: "0",
					FFuelMax: "4095",
					FFuelSize: "",
					FFuelHigh: "0"
				};
				this.multiOilBox1 = {
					FFuelMin: "0",
					FFuelMax: "4095",
					FFuelSize: ""
				}
				this.multiOilBox2 = {
					FFuelMin: "0",
					FFuelMax: "4095",
					FFuelSize: ""
				}
				this.multiOilBox3 = {
					FFuelMin: "0",
					FFuelMax: "4095",
					FFuelSize: ""
				}
			},
			//是否填写好数据
			isCorrect1() {
				let bool = true;
				for (let key in _this.multiOilBox1) {
					if (_this.multiOilBox1[key] === "") {
						bool = false;
					}
				}
				return bool;
			},
			isCorrect2() {
				let bool = true;
				for (let key in _this.multiOilBox2) {
					if (_this.multiOilBox2[key] === "") {
						bool = false;
					}
				}
				return bool;
			},
			isCorrect3() {
				let bool = true;
				for (let key in _this.multiOilBox3) {
					if (_this.multiOilBox3[key] === "") {
						bool = false;
					}
				}
				return bool;
			},
			//保存
			save(type) {
				//console.log(type);
				if (_this.FVehicleGUID != '' && _this.FVehicleGUID != null) {
					//console.log(this.selectedOptions);


					//首先判断保存的油箱类型
					//单油箱
					if (type == "SingleOilBox") {
						if (_this.singleOilBoxData.FFuelMin === "" || _this.singleOilBoxData.FFuelMax === "" || _this.singleOilBoxData.FFuelSize === "" || _this.singleOilBoxData.FFuelHigh === "") {
							this.$notify({
								title: '_提示_',
								message: '_请填写完整_,_并检查填写内容的正确性_!',
								type: 'warning'
							});
							return false;
						}
						let JsonArr =
						{
							FFuelMin: _this.singleOilBoxData.FFuelMin,
							FFuelMax: _this.singleOilBoxData.FFuelMax,
							FFuelSize: _this.singleOilBoxData.FFuelSize,
							FFuelHigh: _this.singleOilBoxData.FFuelHigh,
						};
						let JsonStr = JSON.stringify({
							FTokenID: _this.$store.state.FTokenID,
							FAction: "UpdateFuelCarArgs",
							FT_FuelCarArgs: JsonArr,
							FVehicleGUID: _this.FVehicleGUID,
							FVersion: "1.0.0"
						});
						function findCarTeam(data, num) {
							if (data.id == _this.FVehicleGUID) {
								if (num == undefined) {
									data.message = "_正在保存_";
								} else if (num) {
									data.message = "_保存成功_";
								} else {
									data.message = "_保存失败_";
								}
								return
							}
							if (data.children != undefined) {
								for (let i = 0; i < data.children.length; i++) {
									findCarTeam(data.children[i], num)
								}
							} else {
								return
							}
						}
						findCarTeam(_this.OilBoxConfigTreeData[0]);
						$.ajax({
							"url": "/web/Combine/Combine_System",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (json) {
								//console.log(json);
								if (json.Result == 200) {
									findCarTeam(_this.OilBoxConfigTreeData[0], 1);
									_this.message("_保存成功_!", "success");
								} else {
									findCarTeam(_this.OilBoxConfigTreeData[0], 0);
									_this.message("_保存失败_!", "error");
								}
							},
							error: function () {
								a.message = "_保存失败_";
							}
						})
					}

					//多油箱
					if (type == "MultiOilBox") {
						let JsonArr = [];
						if ((_this.isCorrect1() && _this.isCorrect2() && _this.isCorrect3()) || (_this.isCorrect1() && _this.isCorrect2())) {
							JsonArr.push(
								{
									FFuelMin: this.multiOilBox1.FFuelMin,
									FFuelMax: this.multiOilBox1.FFuelMax,
									FFuelSize: this.multiOilBox1.FFuelSize,
									FSensorName: ""
								},
								{
									FFuelMin: this.multiOilBox2.FFuelMin,
									FFuelMax: this.multiOilBox2.FFuelMax,
									FFuelSize: this.multiOilBox2.FFuelSize,
									FSensorName: ""
								}

							);

							//判断第三个油箱
							if (_this.isCorrect3()) {
								JsonArr.push(
									{
										FFuelMin: this.multiOilBox3.FFuelMin,
										FFuelMax: this.multiOilBox3.FFuelMax,
										FFuelSize: this.multiOilBox3.FFuelSize,
										FSensorName: ""
									}
								);
							} else {
								let bool = true;
								for (let key in _this.multiOilBox3) {
									if (_this.multiOilBox3[key] != "") {
										bool = false;
									}
								}
								if (!bool) {
									this.$notify({
										title: '_提示_',
										message: '_请填写完整_,_并检查填写内容的正确性_!',
										type: 'warning'
									});
									return false;
								}
							}
						} else {
							this.$notify({
								title: '_提示_',
								message: '_必须按顺序填写两个油箱配置及以上_，_并填写完整_!',
								type: 'warning'
							});
							return false;
						}
						//console.log(JsonArr);
						let JsonStr = JSON.stringify({
							FTokenID: _this.$store.state.FTokenID,
							FAction: "AddFuelSensor",
							FFuelSonserConfigs: JsonArr,
							FVehicleGUID: _this.FVehicleGUID,
							FVersion: "1.0.0"
						});
						$.each(_this.OilBoxConfigTreeData[0].children, function (index, obj) {
							$.each(obj.children, function (i, item) {
								$.each(item.children, function (j, a) {
									if (a.label == _this.FVehicleName) {
										a.message = "_正在保存_"
									}
								})
							})
						});
						$.ajax({
							"url": "/web/Combine/Combine_System",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (json) {
								//console.log(json);
								$.each(_this.OilBoxConfigTreeData[0].children, function (index, obj) {
									$.each(obj.children, function (i, item) {
										$.each(item.children, function (j, a) {
											if (a.label == _this.FVehicleName) {
												if (json.Result == 200) {
													a.message = "_保存成功_";
												} else {
													a.message = "_保存失败_";
												}
											}
										})
									})
								})
							},
							error: function () {
								a.message = "_保存失败_";
							}
						})

					}
				} else {
					_this.$message({
						showClose: true,
						message: '_请选择车辆_/_箱号_',
						type: 'warning'
					});
				}
			},
			deleteConfig() {
				//console.log(_this.FVehicleGUID);

				/*let CheckedKeys=this.$refs.tree2.getCheckedKeys();
				for (var i = 0; i < CheckedKeys.length; i++) {
					var obj = CheckedKeys[i];
					//console.log(obj);
					if(obj.indexOf("@A")!==-1||obj.indexOf("@B")!==-1||obj.indexOf("@C")!==-1){
						CheckedKeys.splice(i,1);
						i=i-1;
					}
				}*/
				//console.log(CheckedKeys);
				if (_this.FVehicleGUID == "" || _this.FVehicleGUID == null) {
					_this.message("_请选择车辆_!", "warning");
					return false;
				}
				let CheckedKeysStr = _this.FVehicleGUID;
				//console.log(CheckedKeysStr);
				let postData={
					FTokenID:_this.$store.state.FTokenID,
					FAction:"DeleteFuelConfig",
					FVehicleGUIDs:CheckedKeysStr,
					FVersion:"1.0.0"	
				};
				$.ajax({
					"url": "/web/Combine/Combine_System",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (json) {
						//console.log(json);
						if (json.Result = "200") {
							_this.reset();
							_this.message("_删除成功_!", "success");
						} else {
							_this.message("_删除失败_!", "error");
						}
					},
					error: function (data) {
						_this.message("_删除失败_!", "error");
					}
				});
			},
			//提示信息
			message(msg, type) {
				this.$message({
					showClose: true,
					message: msg,
					type: type
				});
			},
		},
		components: {
		}
	}
</script>
<style scoped>
	.vehicleList {
		height: 100%;
		padding-left: 16px;
		width: 440px;
		float: left
	}

	.configResult {
		float: right;
		width: 100px;
		height: 36px;
		background: white;
		border-left: 1px solid #ccc;
		text-align: center;
	}

	.configPanel {
		border: 1px solid #cccccc;
		background: white;
		padding-left: 0px;
		height: 100%;
		margin-left: 445px;
		margin-right: 20px;
	}

	.configPanel header {
		height: 50px;
		border-bottom: 1px solid #cccccc;
	}

	.configPram {
		width: 640px;
		height: 130px;
		margin: 50px auto;
	}

	.configPram ul li {
		width: 160px;
		height: 120px;
		box-sizing: border-box;
		border-right: 1px solid #cccccc;
		float: left;
	}

	.configPram ul li h1 {
		text-align: center;
		font-size: 26px;
		color: #005fc6;
		margin-top: -20px;
	}

	.configPram ul li p {
		padding-left: 20px;
		line-height: 24px;
		font-weight: bold;
	}

	.configPram ul li input {
		width: 90px;
		margin-left: 5px;
	}

	.configCar {
		line-height: 50px;
		padding-left: 20px;
		font-size: 20px;
		font-weight: bold;
	}

	.carImgContainer {
		margin-top: 100px;
	}

	.carImgContainer img {
		display: block;
		margin: 0px auto;
	}

	/*以下为新加样式*/

	.configPanel .singleOilBox,
	.configPanel .oilBox-first-config {
		width: 810px;
		margin: 30px auto;
	}

	.configPanel .oilBox-first-config {
		margin: 0 auto;
	}

	.configPanel .el-form .el-form-item {
		height: 40px;
	}



	.VehicleName,
	.operate-option {
		display: inline-block;
	}

	.operate-option {
		float: right;
		margin-right: 10px;
	}

	.multiOilBox {
		margin-top: 5px;
		overflow-y: scroll;
	}

	.multiOilBox .oilBox {
		height: 40px;
		padding-left: 50px;
		font-size: 18px;
		border-bottom: 1px solid #e6e6e6;
	}

	.multiOilBox .oilBox>span {
		line-height: 36px;
		display: inline-block;
		border-bottom: 4px solid #ffa81c;
		width: 80px;
		text-align: center;
	}

	.multiOilBox .oilBoxItem .el-col-24,
	.singleOilBox .el-col-24 {
		margin-top: 20px;
	}

	.multiOilBox .oilBoxItem {
		height: 260px;
	}

	.filterInput {
		width: 93%;
		height: 4.1%;
	}

	.filterInput .el-input__inner {
		border-radius: 0;
	}

	.deleteConfig {
		float: right;
		padding: 0;
		width: 26%;
		height: 4%;
	}

	.oilBoxConfig_bg {
		margin-top: 14px;
	}

	.multiOilBox .oilBoxItem .el-col-24 {
		margin-top: 45px;
	}

	.multiOilBox .oilBoxItem .col-margin-top-20 {
		margin-top: 20px;
	}

	.el-tree {
		border-top: 1px solid #ccc
	}
</style>
<style>
	.OilBoxConfigCascader .el-cascader-menu {
		height: 85px;
	}

	.configPanel .el-form-item__label {
		color: #333;
		font-weight: 500;
	}

	.configPanel .el-cascader__label {
		font-weight: 500;
		height: auto;
	}

	.configPanel .el-input__inner {
		border-radius: 0;
		height: 28px;
	}

	.oilBoxConfigInput .el-input__inner {
		border: none;
		height: 34px;
	}
</style>