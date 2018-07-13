<template>
	<div class="mycontainer" v-show="SystemID!=null">
		<!--顶部标签栏-->
		<div class="panel panel-default">
			<!--接甩挂系统   标签栏-->
			<div class="header panel-heading top-tag">
				<ul class="row sortable">
					<li class="col-md-2 carstatus-container" v-if="item.status!='FNoAlarmCount'" v-for="item in filtercarJsons" v-dragging="{ item: item, list: carJsons ,group: 'item'}"
					 :key='item.status' @click="choiceTagData(item.status)">
						<div class="park" :class="item.status">
							<div class="home-tags-icon left-icon"></div>
							<div class="text">
								<p class="number" v-if="item.status=='FOffLineCount'">
									{{item.number+item.noposition}}
									<span>/{{item.noposition}}</span>
								</p>
								<p class="number" v-if="item.status!='FOffLineCount'">
									{{ item.number}}
								</p>
								<p class="carstatus">{{ item.status|translate}}
									<span v-if="item.status=='FOffLineCount'&&language=='CN'">/_无设备_</span>
								</p>
							</div>
							<img v-show="carJsons.length>=7" class="tags_delete" src="static/img/home_tags_delete.png" @click.stop="deleteTags(item.status)">
						</div>
					</li>
					<li class="col-md-2 carstatus-container" v-if="showAll&&hideTagsNameArr.length!==0" data-toggle="modal" data-target="#add_tags">
						<div class="park add_tags">
							<span class="add_icon"></span>
						</div>
					</li>
				</ul>
				<a v-if="SystemID!=6" @click="showAll=!showAll" class="tagMore">
					{{work}}
					<span class="glyphicon" v-bind:class="pointer"></span>
				</a>
			</div>
			<!--地图  柱状图 -->
			<div class="chart panel-body">
				<button v-show="!isShowWorldMap" type="button" class="map-btn" @click="drawWorldMap">_返回_</button>
				<div class="mapContainer col-md-5" id="mapContainer"></div>
				<div class="hightchart col-md-7" id="myChart"></div>
			</div>
		</div>



		<!--顶部标签栏 结束-->

		<!--三个饼状图-->
		<div class="circle panel panel-default">
			<!--<div style="position: absolute;width: 33%;height: 200px;left:30%;top:25px;border-left: 1px dashed #e6e6e6;border-right: 1px dashed #e6e6e6;"></div>-->
			<ul>
				<li class="col-md-4" id="pieChart0"></li>
				<li class="col-md-4" id="pieChart1"></li>
				<li class="col-md-4" id="pieChart2"></li>
				<li v-if="SystemID!=4" class="glyphicon glyphicon-plus circle-plus" data-toggle="modal" data-target="#modal2"></li>
			</ul>
		</div>
		<!--三个饼状图 结束-->



		<!--里程统计/日重载箱数量报表-->
		<div class="panel">
			<div class="panel-heading ">
				<span class="chart-title" @click="sendLink(linkTo0)">{{reportTypeValue0|translate1}}</span>
				<div class="selectBox">
					<label for="">_时间_</label>
					<el-select v-model="timevalue0" placeholder="请选择" class="selectoption" @change="getTimeValue0">
						<el-option v-for="item in  timeOption" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="selectBox">
					<label for="">_报表类型_</label>
					<el-select v-model="reportTypeValue0" placeholder="请选择" class="selectoption" @visible-change="openUpdata0" @change="showAndUpdataLine0">
						<el-option v-for="item in  reportType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="panel-body">
				<div class="homeLineChart" id="homeLineChart0">
				</div>
			</div>
		</div>
		<!--超速报警line-->
		<div class="panel" v-show="isShowHLC1">
			<div class="panel-heading ">
				<span class="chart-title" @click="sendLink(linkTo1)">{{reportTypeValue1|translate1}}</span>
				<div class="selectBox">
					<label for="">_时间_</label>
					<el-select v-model="timevalue1" placeholder="_请选择_" class="selectoption" @change="getTimeValue1">
						<el-option v-for="item in  timeOption" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<i class="el-icon-circle-close homeLineCloseBtn" @click="deleteLineChart('reportvalue',1)"></i>
				</div>
				<div class="selectBox ">
					<label for="">_报表类型_</label>
					<el-select v-model="reportTypeValue1" placeholder="_请选择_" class="selectoption" @visible-change="openUpdata1" @change="showAndUpdataLine1">
						<el-option v-for="item in  reportType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="panel-body">
				<div class="homeLineChart" id="homeLineChart1"></div>
			</div>
		</div>

		<div class="panel" v-show="isShowHLC2">
			<div class="panel-heading ">
				<span class="chart-title" @click="sendLink(linkTo2)">{{reportTypeValue2|translate1}}</span>
				<div class="selectBox">
					<label for="">_时间_</label>
					<el-select v-model="timevalue2" placeholder="_请选择_" class="selectoption" @change="getTimeValue2">
						<el-option v-for="item in  timeOption" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<i class="el-icon-circle-close homeLineCloseBtn" @click="deleteLineChart('reportTypeValue2',2)"></i>

				</div>
				<div class="selectBox ">
					<label for="">_报表类型_</label>
					<el-select v-model="reportTypeValue2" placeholder="_请选择_" class="selectoption" @visible-change="openUpdata2" @change="showAndUpdataLine2">
						<el-option v-for="item in  reportType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="panel-body">
				<div class="homeLineChart" id="homeLineChart2"></div>
			</div>
		</div>
		<div class="panel" v-show="isShowHLC3">
			<div class="panel-heading " style="background: #ffffff">
				<span class="chart-title" @click="sendLink(linkTo3)">{{reportTypeValue3|translate1}}</span>
				<div class="selectBox">
					<label for="">_时间_</label>
					<el-select v-model="timevalue3" placeholder="_请选择_" class="selectoption" @change="getTimeValue3">
						<el-option v-for="item in  timeOption" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<i class="el-icon-circle-close homeLineCloseBtn" @click="deleteLineChart('reportvalue3',3)"></i>
				</div>
				<div class="selectBox ">
					<label for="">_报表类型_</label>
					<el-select v-model="reportTypeValue3" placeholder="_请选择_" class="selectoption" @visible-change="openUpdata3" @change="showAndUpdataLine3">
						<el-option v-for="item in  reportType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="panel-body">
				<div class="homeLineChart" id="homeLineChart3">
				</div>
			</div>
		</div>
		<!--不同系统特有line 结束-->

		<!--添加line-->
		<div v-show="filterLineChartArr.length!=0" class="panel panel-default addChart" data-toggle="modal" data-target="#modal">
			<i class="glyphicon glyphicon-plus addLine-icon"></i>
			<span class="addLine-txt">_点击增加折线图_</span>
		</div>
		<!--添加line 结束-->

		<!--添加top_tags start-->
		<div class="modal fade" id="add_tags" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width:500px">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h5 class="modal-title">_请选择需要添加的标签_</h5>
					</div>
					<div class="modal-body home-modal-body" style="height: 100%">
						<el-checkbox-group v-model="choiceTags" :min="1">
							<el-checkbox v-for="item in hideTagsNameArr" :label="item" :key="item">
								{{item|translate}}
							</el-checkbox>
						</el-checkbox-group>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal" @click="addTags">_确定_
						</button>
						<button type="reset" class="btn btn-default" data-dismiss="modal">_取消_</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal -->
		</div>
		<!--添加top_tags end-->

		<!--添加曲线弹出框-->
		<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width:500px">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h5 class="modal-title">_请选择需要添加的车辆曲线图_</h5>
					</div>
					<div class="modal-body home-modal-body" style="height: 100%">
						<el-checkbox-group v-model="showLineIndex" :min="1" :max="3">
							<el-checkbox v-for="item in filterLineChartArr" :label="item" :key="item">
								{{item}}:_初始类型_【{{lineChartArr[item]|translate1}}】
							</el-checkbox>
						</el-checkbox-group>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal" @click="addLineChart">_确定_
						</button>
						<button type="reset" class="btn btn-default" data-dismiss="modal">_取消_</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal -->
		</div>
		<!--添加曲线弹出框 结束-->

		<!--添加环形图弹出框-->
		<div class="modal fade" id="modal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h5 class="modal-title" id="myModalLabe2">_请选择三个车辆环形比例图_</h5>
					</div>
					<div class="modal-body home-modal-body" style="height: 100%">
						<el-checkbox-group v-model="FAnnularPair" :min="1" :max="3">
							<el-checkbox v-for="value in annularChartArr" :label="value" :key="value">
								{{value|translate2}}
							</el-checkbox>
						</el-checkbox-group>

					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal" @click="addAnnularChart">
							_确定_
						</button>
						<button type="reset" class="btn btn-default" data-dismiss="modal">_取消_</button>
					</div>
				</div>
			</div>
		</div>
		<!--添加环形图弹出框 结束-->

	</div>

</template>
<script>

	import HighCharts from 'highcharts/highstock'
	import highmaps from 'highcharts/highmaps'
	require('highcharts/modules/drilldown')(highmaps)
	import baidu from 'js/GIS/Baidu/BaiduAPI'
	let _this
	export default {
		data() {
			_this = this
			return {
				/*******   各系统相同数据     ******/
				interval: null, //存储定时器
				choiceStatus: "FHaveDataCount",//所选的车辆或者设备状态
				checkName: [],
				showAll: false,
				statusStyle: '',
				currentIndex: '',
				carJsons: [], //top_tags对象数组
				tagNumberObj: {}, //top_tags数量对象
				allTagsNameArr: ["FHaveDataCount", "FOnLineCount", "FOffLineCount", "FRunningOnDayCount", "FStopOnDayCount", "FRunningCount",
					"FStopCount", "FAlarmCount", "FLockOpenCount", "FLockCloseCount", "FUnCouplingCount", "FCouplingCount", "FContainerCount",
					"FUnContainCount", "FLoadedContainerCount", "FEmptyContainerCount", "FHoisting", "FOpenDoorCount", "FCloseDoorCount"], //top_tags名称数组
				showTagsNameArr: [],
				hideTagsNameArr: [],
				choiceTags: [],
				provinceArray: [],
				countryObj: null,
				carArray: '',
				cityArray: '',
				carCityArray: '',
				isShowWorldMap: true, //是不是显示世界地图
				showCountry: null,    //选择显示的国家简称
				isUpdataStyle: [false, false, false, false], //四个图表是不是开始储存页面样式

				FStatusBlock: [],
				FAnnularPair: [],
				//多点配送统计数据
				ALLReceivedCount: 0,  //已完成订单数
				ALLCurrentCount: 0,   //未完成订单数
				AllGreenLockCount: 0, //绿通开锁总数
				AllOtherOpenLockCount: 0, //其他开锁总数
				AllAgentCodeCount: 0, //全部站点总数
				AllFinishCount: 0,    //已完成站点总数
				AVGUsedTime: 0,       //平均站点时长(秒)


				lineChartIndex: [],  //盛放折线图类型顺序数组
				showLineIndex: [],   //选择显示的折线图顺序数组
				isShowHLC1: false,   //是否显示 homeLineChart1
				isShowHLC2: false,   //是否显示 homeLineChart2
				isShowHLC3: false,   //是否显示 homeLineChart3

				timevalue0: 1,
				timevalue1: 1,
				timevalue2: 1,
				timevalue3: 1,

				timeOption: [
					{
						value: 1,
						label: '_最近一周_'
					}, {
						value: 2,
						label: '_最近_15_天_'
					}, {
						value: 3,
						label: '_最近_30_天_'
					}
				],


				reportTypeValue0: "",
				reportTypeValue1: "",
				reportTypeValue2: "",
				reportTypeValue3: "",

				linkTo0: {
					tabsText: "",
					router: ""
				},
				linkTo1: {
					tabsText: "",
					router: ""
				},
				linkTo2: {
					tabsText: "",
					router: ""
				},
				linkTo3: {
					tabsText: "",
					router: ""
				},
				//省级柱状图公共参数
				option: {
					chart: {
						type: 'column',
						//panning: true,
						//panKey: 'shift'
						zoomType: 'x',
						resetZoomButton: {
							position: {
								align: "right",
								verticalAlign: "top",
								x: 0,
								y: -40,
							}
						}
					},
					legend: {
						enabled: false
					},
					scrollbar: {
						enabled: true,
						barBackgroundColor: "#2885eb",
						liveRedraw: true,
						showFull: false
					},
					loading: {
						labelStyle: {
							"display": "none",
							/*
							 "fontWeight": "bold",
							 "fontSize":"46px",
							 */
						},
						style: {
							"background": 'url(/static/img/loading.gif) no-repeat center 100px'
						}
					},
					credits: { //版权标签
						enabled: false
					},
					exporting: { //导出设置
						enabled: false
					},
					title: {
						text: '_分布柱状图_',
						style: { "fontFamily": '微软雅黑' }
					},
					xAxis: {
						//						categories: '',
						type: 'category',
						crosshair: true,
					},
					yAxis: {
						allowDecimals: false,
						min: 0,
						title: {
							text: '_单位_（_台_）',
							rotation: 0,
							align: 'high',
							y: -20,
							x: 0,
							margin: -50,
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table style="width: 100px; overflow: hidden">',
						pointFormat: '<tr><td style="color:{series.color};padding:0"> </td>' +
							'<td style="padding:0"><b>{point.y:.0f} _台_</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0,
						},
						series: {
							cursor: 'pointer',
							point: {
								events: {
									click: function () {
										console.log('类别：' + this.data + ', 值：' + this.y + '，下标：' + this.x);
										if (this.data.length === 0) return;

										let menuData = { tabsText: "_实时监控_", router: "monitor" };
										_this.$store.commit('changeRoute', menuData)
										_this.$router.push({ name: "monitor", params: { IDArr: this.data } })

									}
								}
							}
						}
					},
					series: ''
				},
				//饼状图公共参数
				pieData: {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						marginLeft: 0,
						spacing: [25, 0, 5, 100]
					},
					legend: {
						align: 'left',
						verticalAlign: 'middle',
						layout: 'vertical',
						symbolHeight: 20,
						symbolWidth: 20,
						itemMarginBottom: 20,
						itemStyle: {
							color: '#bb9360',
						},
						y: 85,
						x: -100,
						labelFormatter: function () {
							return this.name.replace(/\([^\)]*\)/g, '')
						}
					},
					credits: {
						enabled: false
					},
					exporting: { //导出设置
						enabled: false
					},
					tooltip: {
						pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							innerSize: 140,
							dataLabels: {
								enabled: false
							},
							showInLegend: true,
							size: 200,
							dataLabels: {
								enabled: true,
								allowOverlap: false,
								distance: -30,
								overflow: "none",
								format: '<b>{point.name}</b>: {point.percentage:.1f} %',
								style: {
									color: (highmaps.theme && highmaps.theme.contrastTextColor) || 'black',
								}
							},
							point: {
								events: {
									mouseOver: function (e) {  // 鼠标滑过时动态更新标题
										// 标题更新函数，API 地址：https:/.hcharts.cn/highcharts#Chart.setTitle

									}
									//,
									// click: function(e) { // 同样的可以在点击事件里处理
									//     chart.setTitle({
									//         text: e.point.name+ '\t'+ e.point.y + ' %'
									//     });
									// }
								}
							},
						}
					},
					series: '',
					title: {
						floating: true,
						verticalAlign: 'top',
						y: 0,
						x: -100,
						text: '',
						align: 'left',
						style: { "fontWeight": "bold", "fontFamily": '微软雅黑', "fontSize": "16px" }
					},
				},
				//折线图公共参数
				lineOption: {
					chart: {
						marginLeft: 40,
						marginTop: 40,
						type: 'area'
					},
					title: {
						text: '',
						x: -20
					},
					credits: {
						enabled: false,
					},
					exporting: { //导出设置
						enabled: false
					},
					xAxis: {
						categories: ''
					},
					yAxis: {
						allowDecimals: false,
						title: {
							text: '',
							rotation: 0,
							align: 'high',
							y: -20,
							x: 70
						},
						labels: {
							x: 0,
							style: {
								whiteSpace: 'nowrap',
							}

						},
						tickPixelInterval: 50,
						plotLines: [{
							value: 0,
							width: 1,
							color: '#808080'
						}]
					},
					plotOptions: {
						series: {
							lineWidth: 3,
							fillOpacity: 0.1,
						},
					},
					tooltip: {
						valueSuffix: '',
						formatter: null
					},
					legend: {
						enabled: false
					},
					series: ''
				},
				FCouplingCount1: {},
				FOnLineCount1: {},
				FRunningCount1: {},
				FContainerCount1: {},
				FLockOpenCount1: {},
				FRefrigeratorWorkCount1: {},
				FRunningOnDayCount: {},
				FTemperatureNormalCount1: {},
				FRefrigeratorWorkCount1: {},

				annularChartArr: [
					"FCouplingCount",
					"FOnLineCount",
					"FContainerCount",
					"FRunningCount",
					"FLockOpenCount",
					"FRunningOnDayCount"
				],
				lineChartArr: [
					"MileageCount",
					"AlarmOverSpeedCount",
					"CouplingCount",
					"RunStopCount",
					"FLockOpenCount",
					"FuelImproper",
					"LoadedContainerCount"
				],
				reportType: [
					{
						value: 'MileageCount',
						label: '_里程统计报表_'
					},
					{
						value: 'RunStopCount',
						label: '_运行效率统计_'
					},
					{
						value: 'AlarmOverSpeedCount',
						label: '_超速报警报表_'
					},
					{
						value: 'CouplingCount',
						label: '_接甩挂报表_'
					},
					{
						value: 'FLockOpenCount',
						label: '_开锁次数统计_'
					},
					{
						value: 'FuelImproper',
						label: '_异常油耗统计_'
					},
					{
						value: 'LoadedContainerCount',
						label: '_日重载箱数量报表_'
					}
				],
			}
		},
		filters: {
			/*顶部标签栏 数据映射表*/
			translate(value) {
				switch (value) {
					case "FHaveDataCount":
						return "_全部设备_";
					case "FOnLineCount":
						return "_在线_";
					case "FOffLineCount":
						return "_离线_";
					case "FRunningOnDayCount":
						return "_今日运行_";
					case "FStopOnDayCount":
						return "_今日未运行_";
					case "FRunningCount":
						return "_行驶_";
					case "FStopCount":
						return "_停止_";
					case "FAlarmCount":
						return "_报警_";
					case "FLockOpenCount":
						return "_开锁_";
					case "FLockCloseCount":
						return "_上锁_";
					case "FUnCouplingCount":
						return "_甩挂车辆_";
					case "FCouplingCount":
						return "_接挂车辆_";
					case "FContainerCount":
						return "_有厢车辆_";
					case "FUnContainCount":
						return "_无厢车辆_";
					case "FLoadedContainerCount":
						return "_重载箱_";
					case "FEmptyContainerCount":
						return "_空载箱_";
					case "FHoisting":
						return "_吊装_";
					case "FOpenDoorCount":
						return "_开门箱数_";
					case "FCloseDoorCount":
						return "_关门箱数_";
					default:
						return value
				}
			},
			/*折线图 数据映射表*/
			translate1: function (value) {
				switch (value) {
					case "MileageCount":
						return "_里程统计报表_";
					case "AlarmOverSpeedCount":
						return "_超速报警报表_";
					case "CouplingCount":
						return "_接甩挂报表_";
					case "RunStopCount":
						return "_运行效率统计_";
					case "FLockOpenCount":
						return "_开锁次数统计_";
					case "TemperatureAbNormalCount":
						return "_温度异常统计_";
					case "FuelImproper":
						return "_异常油耗统计_";
					case "LoadedContainerCount":
						return "_日重载箱数量报表_";
					case "TripDetails":
						return "_配送站点统计_";
					default:
						return value
				}
			},
			/*环形图 数据映射表*/
			translate2(value) {
				switch (value) {
					case "FCouplingCount":
						return "_接甩挂比例_";
					case "FOnLineCount":
						return "_在线离线比例_";
					case "FContainerCount":
						return "_有厢无厢比例_";
					case "FRunningCount":
						return "_运行静止比例_";
					case "FLockOpenCount":
						return "_开关锁比例_";
					case "FRunningOnDayCount":
						return "_今日运行比例_";
					case "FRefrigeratorWorkCount":
						return "_冷机异常比例_";
					case "FTemperatureNormalCount":
						return "_温度异常比例_";
				}
			}
		},

		activated() {

			this.updata()

			this.interval = setInterval(function () {
				_this.updata()
			}, 5 * 60 * 1000)

		},
		mounted() {
			HighCharts.setOptions({
				lang: {
					resetZoom: '_重置_'
				}
			});
			highmaps.setOptions({
				lang: {
					drillUpText: '<_返回_',
				}
			});
			let chart = HighCharts.chart('myChart', _this.option);
			chart.showLoading();
			let map = new highmaps.Map('mapContainer', {
				title: {
					text: '_地理位置分布图_',
					style: { "fontFamily": '微软雅黑' }
				},
				loading: {

					labelStyle: {
						"display": "none"
					},
					style: {
						"background": 'url(/static/img/loading.gif) no-repeat center 100px'
					}
				},
				credits: {
					enabled: false
				},
				exporting: { //导出设置
					enabled: false
				}
			});
			map.showLoading();
			_this.dragging();
		},
		computed: {
			companyID: { //公司id
				get() {
					return _this.$store.state.companyID
				}
			},
			SystemID: { //系统id
				get() {
					console.log("所选的系统ID", this.$store.state.choiceSystemID)
					return this.$store.state.choiceSystemID
				}
			},
			language: {
				get() {
					return this.$store.state.language
				}
			},
			filtercarJsons: function () {
				if (this.showAll == false) {
					return this.carJsons.slice(0, 6)
				} else {
					return this.carJsons
				}
			},
			filterLineChartArr: function () {
				let arr = [];
				if (!this.isShowHLC1) arr.push(1);
				if (!this.isShowHLC2) arr.push(2);
				if (!this.isShowHLC3) arr.push(3);
				//////console.log(arr)
				return arr
			},
			work: function () {
				if (this.showAll == false) {
					return "_点击显示更多状态_"
				} else {
					return "_点击收起_"
				}
			},
			pointer: function () {
				if (this.showAll == false) {
					return 'glyphicon-chevron-down'
				} else {
					return 'glyphicon-chevron-up'
				}
			},
		},
		methods: {
			//左侧导航栏点击添加tabs标签
			addSubTabs(menuText, routerLink, dataType, isOver) {
				var menuData = { tabsText: menuText, router: routerLink };
				this.$store.commit("changeRoute", menuData);
				this.$router.push({ name: "shipmentsReport", params: { isSkip: true, dataType: dataType, isOver: isOver } });
			},
			//更新首页样式
			updata() {

				this.getHomeLastStyle();


			},
			translateStatus(value) {
				switch (value) {
					case "FHaveDataCount":
						return "_全部设备_";
					case "FOnLineCount":
						return "_在线_";
					case "FOffLineCount":
						return "_离线_";
					case "FRunningOnDayCount":
						return "_今日运行_";
					case "FStopOnDayCount":
						return "_今日未运行_";
					case "FRunningCount":
						return "_行驶_";
					case "FStopCount":
						return "_停止_";
					case "FAlarmCount":
						return "_报警_";
					case "FLockOpenCount":
						return "_开锁_";
					case "FLockCloseCount":
						return "_上锁_";
					case "FUnCouplingCount":
						return "_甩挂车辆_";
					case "FCouplingCount":
						return "_接挂车辆_";
					case "FContainerCount":
						return "_有厢车辆_";
					case "FUnContainCount":
						return "_无厢车辆_";
					case "FLoadedContainerCount":
						return "_重载箱_";
					case "FEmptyContainerCount":
						return "_空载箱_";
					case "FOpenDoorCount":
						return "_开门箱数_";
					case "FCloseDoorCount":
						return "_关门箱数_";
					case "FHoisting":
						return "_吊装_";
					default:
						return value
				}
			},
			//根据类型解析 linechat title 路由链接数据
			parseRoute(value, type) {
				let text, router;
				switch (value) {
					case 'AlarmOverSpeedCount':
						text = '_超速报警_';
						router = 'speedAlarm';
						break;
					case 'MileageCount':
						text = '_行驶统计_';
						router = 'xingshi';
						break;
					case 'RunStopCount':
						text = '_运行效率分析_';
						router = 'xiaolv';
						break;
					case 'CouplingCount':
						text = '_接甩挂分析_';
						router = 'TrailerReport';
						break;
					case 'FLockOpenCount':
						text = '_开锁次数统计_';
						router = 'FLockOpenCount';
						break;
					case 'TemperatureAbNormalCount':
						text = '_温度异常_';
						router = 'temperatureAlarm';
						break;
					case 'FuelImproper':
						text = '_油耗分析_';
						router = 'OilWear';
						break;
				};
				this[type].tabsText = text;
				this[type].router = router;
			},


			//修改首页样式
			updateHomeStyle() {
				let url = "/web/Combine/Combine_HomePage",
					datajson = JSON.stringify({
						FTokenID: _this.$store.state.FTokenID,
						FAction: 'UpdateHomePageLastStyle',
						FT_Combine_HomePageLastStyle: this.FStatusBlock,
						FVersion: "1.0.0"
					});

				$.ajax({
					"url": url,
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": datajson,
					success: function (json) {
						if (json.Result === 200) {
							console.log("首页修改成功");
						} else {
							console.log("首页修改失败");
						}

					}

				});
			},
			//获取首页最后样式
			getHomeLastStyle() {

				let SystemID = this.SystemID;
				let url = "/web/Combine/Combine_HomePage";
				let postData = {
					FTokenID: this.$store.state.FTokenID,
					FAction: "QueryHomePageLastStyle",
					FVersion: "1.0.0"
				};

				$.ajax({
					"url": url,
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (json) {
						var obj = json;
						console.log("首页样式", obj);


						if (obj.FObject.length === 0) {
							_this.FStatusBlock = {
								FStatusBlock1: 'FHaveDataCount',
								FStatusBlock2: 'FOnLineCount',
								FStatusBlock3: 'FOffLineCount',
								FStatusBlock4: 'FRunningCount',
								FStatusBlock5: 'FStopCount',
								FStatusBlock6: 'FAlarmCount',
								FStatusBlock7: 'FRunningOnDayCount',
								FStatusBlock8: 'FStopOnDayCount',
								FStatusBlock9: 'FLockOpenCount',
								FStatusBlock10: 'FLockCloseCount',
								FStatusBlock11: 'FCouplingCount',
								FStatusBlock12: 'FUnCouplingCount',
								FStatusBlock13: 'FContainerCount',
								FStatusBlock14: 'FUnContainCount',
								FStatusBlock15: 'FLoadedContainerCount',
								FStatusBlock16: 'FEmptyContainerCount',
								FStatusBlock17: 'FHoisting',
								FStatusBlock18: 'FOpenDoorCount',
								FStatusBlock19: 'FCloseDoorCount',
								FStatusBlock20: '',
								FMapStatusIndex: 1,
								FAnnularPair1: 'FLockOpenCount',
								FAnnularPair2: 'FOnLineCount',
								FAnnularPair3: 'FRunningCount',
								FAnnularPair4: '',
								FAnnularPair5: '',
								FAnnularPair6: '',
								FLineChart1: 'MileageCount',
								FLineChart2: '',
								FLineChart3: '',
								FLineChart4: '',
								FLineChart5: '',
								FLineChart6: ''
							};
						} else {
							_this.FStatusBlock = obj.FObject[0];
						};


						_this.getAllData();



						_this.FAnnularPair.length = 0;
						//////console.log("首页状态",_this.FStatusBlock);
						for (let i = 1; i < 4; i++) {
							let k = "FAnnularPair" + i;
							_this.FAnnularPair.push(_this.FStatusBlock[k]);
						};
						_this.lineChartIndex.length = 0;
						for (let i = 1; i < 5; i++) {
							let k = "FLineChart" + i;
							_this.lineChartIndex.push(_this.FStatusBlock[k]);

						};
						console.log("首页折线图顺序", _this.lineChartIndex);
						_this.lineChartIndex.map(function (item, index) {
							if (item == "" || item == null) {
								_this["isShowHLC" + index] = false;
							} else {
								console.log(index, item);
								_this["isShowHLC" + index] = true;
								_this["reportTypeValue" + index] = item;   //赋值触发相应的change事件
								_this["showAndUpdataLine" + index](item);
							}
						})


					},
					error: function () {
						////console.log("请求失败")
					}
				});

			},
			//获取首页统计数据
			getAllData: function () {
				if (_this.companyID === null) {
					setTimeout(() => {
						_this.getAllData()
					}, 1000);
					return;
				};
				let url = "/web/Combine/Combine_HomePage",
					postData = {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryHomePageCount",
						FAgentGUID: _this.companyID,
						FVersion: "1.0.0"
					};
				$.ajax({
					"url": url,
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (json) {
						_this.carJsons = [];
						_this.tagNumberObj = json;
						let obj = json;
						console.log("车辆统计数据", obj);

						let all = obj.FObject[0].FHaveDataCount;
						let outLine = all - obj.FObject[0].FOnLineCount;
						let b = all - obj.FObject[0].FOnLineCount - obj.FObject[0].FOffLineCount;

						let allTagsNameArr = _this.deepCopy(_this.allTagsNameArr);
						for (let i = 1; i < 20; i++) {
							let k = "FStatusBlock" + i;
							if (_this.FStatusBlock[k] != '' && _this.FStatusBlock[k] != null) {
								let oneName = _this.FStatusBlock[k];
								let tag = {
									status: oneName,
									number: obj.FObject[0][oneName] ? obj.FObject[0][oneName] : 0,
									noposition: b
								};
								_this.carJsons.push(tag);
								let index = allTagsNameArr.indexOf(oneName);
								allTagsNameArr.splice(index, 1);

							}
						};
						_this.hideTagsNameArr = allTagsNameArr;

						// 加载地图数据并绘制
						_this.showMapAndBar(_this.choiceStatus);

						//在线离线比例
						_this.FOnLineCount1 = _this.deepCopy(_this.pieData);
						_this.FOnLineCount1.title.text = "_在线离线比例_";
						_this.FOnLineCount1.series = [{
							type: 'pie',
							name: '_比例_',
							data: [
								{
									name: '_在线_' + '(' + obj.FObject[0].FOnLineCount + '/' + all + ')',
									y: obj.FObject[0].FOnLineCount / all * 100,
									color: '#5b9fd4'
								},
								{
									name: '_离线_' + '(' + outLine + '/' + all + ')',
									y: outLine / all * 100,
									color: '#b4b3b3'
								}
							],
						}];
						_this.FOnLineCount1.legend.labelFormatter = function () {
							return this.name.replace(/\([^\)]*\)/g, '')
						}

						//运行静止比例
						var sum2 = obj.FObject[0].FRunningCount + obj.FObject[0].FStopCount;
						_this.FRunningCount1 = _this.deepCopy(_this.pieData);
						_this.FRunningCount1.title.text = "_运行静止比例_";
						_this.FRunningCount1.series = [{
							type: 'pie',
							name: '_比例_',
							data: [
								{
									name: '_运行_' + '(' + obj.FObject[0].FRunningCount + '/' + sum2 + ')',
									y: obj.FObject[0].FRunningCount / sum2 * 100,
									color: '#42a742'
								},
								{
									name: '_静止_' + '(' + obj.FObject[0].FStopCount + '/' + sum2 + ')',
									y: obj.FObject[0].FStopCount / sum2 * 100,
									color: '#e69a29'
								}
							]
						}];
						_this.FRunningCount1.legend.labelFormatter = function () {
							return this.name.replace(/\([^\)]*\)/g, '')
						};

						//今日是否运行比例
						var sum3 = obj.FObject[0].FRunningOnDayCount + obj.FObject[0].FStopOnDayCount;
						_this.FRunningOnDayCount1 = _this.deepCopy(_this.pieData);
						_this.FRunningOnDayCount1.title.text = "_今日运行比例_";
						_this.FRunningOnDayCount1.series = [{
							type: 'pie',
							name: '_比例_',
							data: [
								{
									name: '_今日运行_' + '(' + obj.FObject[0].FRunningOnDayCount + '/' + sum3 + ')',
									y: obj.FObject[0].FRunningOnDayCount / sum3 * 100,
									color: "#6a967b"
								},
								{
									name: '_今日未运行_' + '(' + obj.FObject[0].FStopOnDayCount + '/' + sum3 + ')',
									y: obj.FObject[0].FStopOnDayCount / sum3 * 100,
									color: "#bb9360"
								}
							],
						}];
						_this.FRunningOnDayCount1.legend.labelFormatter = function () {
							return this.name.replace(/\([^\)]*\)/g, '')
						};

						//接甩挂比例
						var sum5 = obj.FObject[0].FCouplingCount + obj.FObject[0].FUnCouplingCount;
						_this.FCouplingCount1 = _this.deepCopy(_this.pieData);
						_this.FCouplingCount1.title.text = "_接甩挂比例_";
						_this.FCouplingCount1.series = [{
							type: 'pie',
							name: '_比例_',
							data: [
								{
									name: '_接挂_' + '(' + obj.FObject[0].FCouplingCount + '/' + sum5 + ')',
									y: obj.FObject[0].FCouplingCount / sum5 * 100,
									color: '#035682'
								},
								{
									name: '_甩挂_' + '(' + obj.FObject[0].FUnCouplingCount + '/' + sum5 + ')',
									y: obj.FObject[0].FUnCouplingCount / sum5 * 100,
									color: '#498ca6'
								}
							]
						}];
						_this.FCouplingCount1.legend.labelFormatter = function () {
							return this.name.replace(/\([^\)]*\)/g, '')
						};


						//有厢无厢比例
						var sum4 = obj.FObject[0].FContainerCount + obj.FObject[0].FUnContainCount;
						_this.FContainerCount1 = _this.deepCopy(_this.pieData);
						_this.FContainerCount1.title.text = "_有厢无厢比例_";
						_this.FContainerCount1.series = [{
							type: 'pie',
							name: '_比例_',
							data: [
								{
									name: '_有厢_' + '(' + obj.FObject[0].FContainerCount + '/' + sum4 + ')',
									y: obj.FObject[0].FContainerCount / sum4 * 100,
									color: "#6f7ccb"
								},
								{
									name: '_无厢_' + '(' + obj.FObject[0].FUnContainCount + '/' + sum4 + ')',
									y: obj.FObject[0].FUnContainCount / sum4 * 100,
									color: "#60b19d"
								}
							]
						}];
						_this.FContainerCount1.legend.labelFormatter = function () {
							return this.name.replace(/\([^\)]*\)/g, '')
						};

						//开关锁比例
						var sum6 = obj.FObject[0].FLockOpenCount + obj.FObject[0].FLockCloseCount;
						_this.FLockOpenCount1 = _this.deepCopy(_this.pieData);
						_this.FLockOpenCount1.title.text = "_开关锁比例_";
						_this.FLockOpenCount1.series = [{
							type: 'pie',
							name: '_比例_',
							data: [
								{
									name: '_开锁车辆_' + '(' + obj.FObject[0].FLockOpenCount + '/' + sum6 + ')',
									y: obj.FObject[0].FLockOpenCount / sum6 * 100,
									color: '#035682'
								},
								{
									name: '_上锁车辆_' + '(' + obj.FObject[0].FLockCloseCount + '/' + sum6 + ')',
									y: obj.FObject[0].FLockCloseCount / sum6 * 100,
									color: '#498ca6'
								}
							]
						}];
						_this.FLockOpenCount1.legend.labelFormatter = function () {
							return this.name.replace(/\([^\)]*\)/g, '')
						};

						_this.showAnnularChart();

					},
					error: function () {
						////console.log("请求失败")
					},
				});
			},

			// 增加top_tags
			addTags() {
				console.log(this.choiceTags);
				let obj = _this.tagNumberObj,
					all = obj.FObject[0].FHaveDataCount,
					outLine = all - obj.FObject[0].FOnLineCount,
					b = all - obj.FObject[0].FOnLineCount - obj.FObject[0].FOffLineCount;
				this.choiceTags.map(function (item, index) {
					let tag = {
						status: item,
						number: obj.FObject[0][item] ? obj.FObject[0][item] : 0,
						noposition: b
					};
					_this.carJsons.push(tag);
					let n = _this.hideTagsNameArr.indexOf(item);
					_this.hideTagsNameArr.splice(n, 1);

				});
				_this.choiceTags.length = 0;
				_this.updataTags();

			},
			// 删除top_tags
			deleteTags(key) {
				let arr = _this.carJsons;
				this.carJsons.map(function (item, index) {
					if (item.status == key) {
						_this.carJsons.splice(index, 1);
					}
				})
				console.log(this.carJsons);
				_this.updataTags();
				this.hideTagsNameArr.push(key);
			},
			//拖动top_tags
			dragging: function () {
				this.$dragging.$on('dragend', () => {
					_this.updataTags();
				})
			},
			//修改top_tags排序并上传更新
			updataTags() {
				_this.showTagsNameArr.length = 0;
				let arr = _this.carJsons;
				for (let i = 0; i < 20; i++) {
					let k = "FStatusBlock" + (i + 1);
					if (i <= arr.length - 1) {
						_this.FStatusBlock[k] = arr[i].status;
						_this.showTagsNameArr.push(arr[i].status);
					} else {
						_this.FStatusBlock[k] = "";
					}
				};
				console.log(_this.FStatusBlock);
				_this.updateHomeStyle();
			},

			//根据状态显示地图
			showMapAndBar(status) {
				let url = '/web/Combine/Combine_HomePage',
					postData = {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryVehiclePositionList",
						FAgentGUID: _this.companyID,
						FDataType: status,
						FVersion: "1.0.0"
					};

				$.ajax({
					"url": url,
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (json) {
						console.log("首页地图数据", json)
						var Fobj = json;

						_this.option.title.text = "_分布柱状图_" + "(" + _this.translateStatus(status) + ")";

						_this.provinceArray = [];
						let countryArray = []
						_this.countryObj = new Object();
						_this.carArray = [];
						_this.cityArray = [];
						_this.carCityArray = [];
						let IDObj = new Object();
						var province = [];
						var count = 0;
						var a = 0;
						if (Fobj.FObject.length == 0) {
							//深拷贝 避免破坏原有数据格式
							let option = _this.deepCopy(_this.option);
							option.xAxis.categories = [];
							option.series = [{}];
							option.series[0].data = [];


							if (_this.$route.path == "/") HighCharts.chart('myChart', option);
							_this.drawMap();
							return
						}


						//转换经纬度
						$.each(Fobj.FObject, function (index, obj) {
							count++;
							//统计各省车辆
							var city = obj.FCity == null || obj.FCity == "" ? null : obj.FCity.replace(/地区/g, '市'),
								province = obj.FProvince,
								country = obj.FCountry;

							//console.log(city,province,country)
							let ID = null;
							if (_this.SystemID === 2) {
								ID = obj.FAssetGUID
							} else {
								ID = obj.FVehicleGUID
							}

							if (province === '' || province === null) {

								a++;
							} else {
								//统计国家
								if (countryArray.indexOf(country) == -1) {
									countryArray.push(country);
									_this.countryObj[country] = 1;
								} else {
									_this.countryObj[country]++
								}

								if (_this.provinceArray.indexOf(province) == -1) {

									_this.provinceArray.push(province);
									_this.carArray.push(1);
									IDObj[province] = new Array();
									IDObj[province].push(ID)

								} else {
									var index = _this.provinceArray.indexOf(province);
									_this.carArray[index]++;
									IDObj[province].push(ID)
								}

							};



							if (city !== null && _this.cityArray.indexOf(city) === -1) {
								_this.cityArray.push(city);
								_this.carCityArray.push(1);
							} else if (city !== null && _this.cityArray.indexOf(city) !== -1) {
								var index = _this.cityArray.indexOf(city);
								_this.carCityArray[index]++
							}
							if (count == Fobj.FObject.length) {
								getObj();
							};



						});

						let ffl = Fobj.FObject.length - a;

						function getObj() {
							for (var i = 0; i < _this.provinceArray.length; i++) {
								province.push({
									y: _this.carArray[i],
									name: _this.provinceArray[i],
									data: IDObj[_this.provinceArray[i]]
								})
							}
							province.sort(function (a, b) {
								return b.y - a.y
							});
							if (a != 0) {
								province.push({ y: a, name: "_盲区_", data: [] })
							}

							// setTimeout(function () {
							//_this.option.xAxis.categories = _this.provinceArray;
							_this.option.series = [{}];
							_this.option.series[0].data = province;
							//console.log(province)
							if (_this.$route.path == "/") HighCharts.chart('myChart', _this.option);
							_this.drawMap();
						}

					},
					error: function () {
						////console.log("请求失败")
					}

				});
			},
			//绘制地图
			drawMap() {

				if (this.language === "CN") {
					let map = null,
						geochina = 'https://data.jianshukeji.com/jsonp?filename=geochina/',
						//不能加载的省份或地区，包括台湾、香港、澳门、南海，各直辖市
						unDrilldown = ['taiwan', 'xianggang', 'aomen', 'nanhai', 'beijing', 'tianjin', 'shanghai', 'chongqing'];

					$.getJSON('/static/china.json', function (mapdata) {
						var data = [];
						// 随机数据
						highmaps.each(mapdata.features, function (md, index) {
							data.push({
								fullname: md.properties.fullname,
								name: md.properties.name,
								drilldown: md.properties.filename, // 赋值 drilldown
								value: 0.9
							});
						});

						for (let i = 0; i < data.length; i++) {
							for (let j = 0; j < _this.provinceArray.length; j++) {
								if (data[i].fullname == _this.provinceArray[j]) {
									data[i].value = _this.carArray[j]
								}
							}
						};
						map = new highmaps.Map('mapContainer', {
							chart: {
								events: {
									drilldown: function (e) {
										// 异步加载
										console.log(e.point.drilldown)
										if (e.point.drilldown && unDrilldown.indexOf(e.point.drilldown) === -1) {
											var pointName = e.point.properties.fullname;
											map.showLoading('_加载中_，_请稍后_...');
											// 获取二级行政地区数据并更新图表
											$.getJSON(geochina + e.point.drilldown + '.json&callback=?', function (data) {
												data = highmaps.geojson(data);
												highmaps.each(data, function (d) {
													if (_this.language !== "CN") {
														d.value = 1
													}
												});
												for (let i = 0; i < data.length; i++) {
													for (let j = 0; j < _this.cityArray.length; j++) {
														if (data[i].properties.fullname == _this.cityArray[j]) {
															data[i].value = _this.carCityArray[j];
														} else if (typeof data[i].value === "undefined") {
															data[i].value = null
														}
													}
												}
												if (_this.$route.path != "/") return
												map.hideLoading();
												map.addSeriesAsDrilldown(e.point, {
													name: e.point.name,
													data: data,
													dataLabels: {
														enabled: true,
														format: '{point.name}'
													},
												});
												map.setTitle({
													text: pointName
												});
											});
										}
									},
									drillup: function () {
										map.setTitle({
											text: '_地理位置分布图_'
										});
									}
								}
							},
							title: {
								text: '_地理位置分布图_',
								style: { "fontFamily": '微软雅黑' }
							},
							credits: {
								enabled: false
							},
							exporting: { //导出设置
								enabled: false
							},
							mapNavigation: {
								enabled: true,
								buttonOptions: {
									verticalAlign: 'bottom'
								}
							},
							tooltip: {
								formatter: function () {
									return '<b>' + this.point.properties.parent + '</b>-'
										+ '<b>' + this.point.properties.fullname + '</b>-'
										+ '<p>' + (this.point.value == 0.9 ? 0 : this.point.value) + '_台_</p>';
								}
							},
							colorAxis: {
								//min:1,
								//max: 5,
								type: 'logarithmic',
								//showFirstLabel: false,
								startOnTick: false,
								gridLineWidth: 2,
								gridLineColor: 'white',
								minorTickInterval: 0.1,
								minorGridLineColor: 'white',
								tickLength: 0
							},
							series: [{
								data: data,
								mapData: mapdata,
								joinBy: 'name',
								name: '_中国地图_',
								states: {
									hover: {
										color: '#a4edba'
									}
								},
								dataLabels: {
									enabled: true,
									format: '{point.name}'
								}
							}],
						});
					});
				} else {
					let world = 'https://img.hcharts.cn/mapdata/custom/world.geo.json';
					let countries = "https://img.hcharts.cn/mapdata/countries/";

					if (this.showCountry !== null) {
						this.isShowWorldMap = false;
						if (_this.showCountry == "lk") {
							showMap("/static/countries/lk-all.geo.json");
						} else {
							showMap(countries + _this.showCountry + '/' + _this.showCountry + "-all.geo.json");
						}

					} else {
						this.isShowWorldMap = true;
						showMap(world);
					}

					function showMap(url) {

						$.getJSON(url, function (mapdata) {
							var data = [];
							// 随机数据
							highmaps.each(mapdata.features, function (md, index) {
								data.push({
									key: md.properties['hc-key'],
									name: md.properties.name,
									woeName: md.properties['woe-name'],
									value: 0.9
								});
							});

							if (_this.isShowWorldMap) {
								//console.log(_this.countryObj)
								for (let key in _this.countryObj) {
									for (let i = 0; i < data.length; i++) {
										if (key == data[i].name) {
											data[i].value = _this.countryObj[key];
											break
										}
									}
								}

							} else {
								for (let i = 0; i < data.length; i++) {
									for (let j = 0; j < _this.provinceArray.length; j++) {
										//console.log(_this.provinceArray[j],data[i].name);

										let arr = ["Guangdong", "Fujian", "Zhejiang", "Shanghai"];
										//以上几个区域在区域文件内用的中文名称 进行校正
										if (arr.indexOf(_this.provinceArray[j]) !== -1) {
											if (data[i].woeName != null && data[i].woeName.indexOf(_this.provinceArray[j]) !== -1) {
												data[i].value = _this.carArray[j];
												break
											}
										} else {
											if (data[i].name != null && data[i].name.indexOf(_this.provinceArray[j]) !== -1) {
												data[i].value = _this.carArray[j];
												break
											}
										}
									}
								}
							}

							let map = new highmaps.mapChart('mapContainer', {
								title: {
									text: '_地理位置分布图_',
									style: { "fontFamily": '微软雅黑' }
								},
								credits: {
									enabled: false
								},
								exporting: { //导出设置
									enabled: false
								},
								mapNavigation: {
									enabled: true,
									buttonOptions: {
										verticalAlign: 'bottom'
									}
								},
								colorAxis: {
									//min:1,
									//max: _this.colorAxisMax,
									type: 'logarithmic',
									gridLineWidth: 2,
									gridLineColor: 'white',
									minorTickInterval: 0.1,
									minorGridLineColor: 'white',
									tickLength: 0
								},
								tooltip: {
									useHTML: true,
									formatter: function () {
										return '<b>' + this.point.name +
											'</b> : <b>' + (this.point.value == 0.9 ? 0 : this.point.value) + '</b>';
									}
								},
								series: [
									{
										data: data,
										mapData: mapdata,
										joinBy: ['hc-key', 'key'],
										name: '_分布数据_',
										states: {
											hover: {
												color: '#a4edba'
											}
										},
										dataLabels: {
											enabled: true,
											format: "{point.name}"
										},
										point: {
											events: {
												// On click, look for a detailed map
												click: function () {
													//在显示世界地图的情况下 记录点击选择的国家
													if (_this.isShowWorldMap) {
														_this.showCountry = this.key;
														console.log(_this.showCountry)
														_this.isShowWorldMap = false;
														map.showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');
														if (_this.showCountry == "lk") {
															showMap("/static/countries/lk-all.geo.json");
														} else {
															showMap(countries + _this.showCountry + '/' + _this.showCountry + "-all.geo.json");
														}

													}
												}
											}
										}
									},
								]
							});
						});
					}
				}
			},
			// 点击返回世界地图
			drawWorldMap() {
				this.showCountry = null;
				this.drawMap()
			},

			//添加环形图
			addAnnularChart() {
				////console.log(this.FAnnularPair);
				if (this.FAnnularPair.length === 3) {

					this.FStatusBlock.FAnnularPair1 = this.FAnnularPair[0];
					this.FStatusBlock.FAnnularPair2 = this.FAnnularPair[1];
					this.FStatusBlock.FAnnularPair3 = this.FAnnularPair[2];
					this.showAnnularChart();
					this.updateHomeStyle();
				} else {
					this.$message({
						showClose: true,
						message: '_请选择三种环形图_',
						type: 'warning'
					});
				}
			},
			//绘制环形图
			showAnnularChart: function () {
				_this.FAnnularPair.map(function (item, index) {
					if (_this.$route.path == "/") HighCharts.chart("pieChart" + index, _this[item + 1]);
				})
			},



			//绘制lineChart
			showLine(index, value) {
				this.parseRoute(value, 'linkTo' + index);
				this['reportTypeValue' + index] = value;
				this.doQuery("homeLineChart" + index, 1, value);
			},

			//绘制lineChart并保存类型 (折线图选择类型变化后触发)
			showAndUpdataLine0(value) {
				this.showLine(0, value);
				this.FStatusBlock.FLineChart1 = value;
				if (!_this.isUpdataStyle[0]) return;
				this.updateHomeStyle();
			},
			showAndUpdataLine1(value) {
				this.showLine(1, value);
				this.FStatusBlock.FLineChart2 = value;
				if (!_this.isUpdataStyle[1]) return;
				this.updateHomeStyle();
			},
			showAndUpdataLine2(value) {
				this.showLine(2, value);
				this.FStatusBlock.FLineChart3 = value;
				if (!_this.isUpdataStyle[2]) return;
				this.updateHomeStyle();
			},
			showAndUpdataLine3(value) {
				this.showLine(3, value);
				this.FStatusBlock.FLineChart4 = value;
				if (!_this.isUpdataStyle[3]) return;
				this.updateHomeStyle();
			},
			//只有打开过下拉菜单后才允许上传  避免赋值改变后触发change事件 上传错误style
			openUpdata0() {
				_this.isUpdataStyle[0] = true
			},
			openUpdata1() {
				_this.isUpdataStyle[1] = true
			},
			openUpdata2() {
				_this.isUpdataStyle[2] = true
			},
			openUpdata3() {
				_this.isUpdataStyle[3] = true
			},


			getTimeValue0: function (time) {
				this.doQuery("homeLineChart0", time, this.reportTypeValue0)
			},
			getTimeValue1: function (time) {
				//console.log(time);
				this.doQuery("homeLineChart1", time, this.reportTypeValue1)
			},
			getTimeValue2: function (time) {
				this.doQuery("homeLineChart2", time, this.reportTypeValue2)
			},
			getTimeValue3: function (time) {
				this.doQuery("homeLineChart3", time, this.reportTypeValue3)
			},


			//添加折线图
			addLineChart() {
				console.log(this.showLineIndex)
				this.showLineIndex.map(function (item, index) {
					_this["isShowHLC" + item] = true;
					_this.showLine(item, _this.lineChartArr[item]);
					_this.FStatusBlock["FLineChart" + (item + 1)] = _this.lineChartArr[item];
				})
				this.updateHomeStyle();
			},
			deleteLineChart(type, index) {
				this["isShowHLC" + index] = false;
				this.FStatusBlock["FLineChart" + (index + 1)] = "";
				this.lineChartArr.push(type);
				this.updateHomeStyle();
			},
			//选择查看不同类型车辆或者设备
			choiceTagData(status) {
				//console.log(status);
				this.choiceStatus = status;

				this.getAllData();
			},


			getDate(datestr) {
				var temp = datestr.split("-");
				temp[1] = (temp[1] - 1).toString();
				var date = new Date(temp[0], temp[1], temp[2]);
				return date;
			},

			//车辆运行状况图表
			doQuery: function (DOM, time, reportType) {
				let url = "/web/Combine/Combine_HomePage";

				//获取时间和报表类型
				var _this = this;

				var today = new Date();
				var year = today.getFullYear();
				var month = today.getMonth() + 1;
				var day = today.getDate();
				if (month < 10) {
					month = "0" + month;
				}
				if (day < 10) {
					day = "0" + day;
				}
				var endTime = year + "-" + month + "-" + day + ' 23:59:59';
				let days;
				switch (time) {
					case 1:
						days = 7;
						var startday = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
						var startyear = startday.getFullYear();
						var startmonth = startday.getMonth() + 1;
						var startday = startday.getDate();
						if (startmonth < 10) {
							startmonth = "0" + startmonth;
						}
						if (startday < 10) {
							startday = "0" + startday;
						}
						var startTime = startyear + "-" + startmonth + "-" + startday + ' 00:00:00';
						break;
					case 2:
						days = 15;
						var startday = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
						var startyear = startday.getFullYear();
						var startmonth = startday.getMonth() + 1;
						var startday = startday.getDate();
						if (startmonth < 10) {
							startmonth = "0" + startmonth;
						}
						if (startday < 10) {
							startday = "0" + startday;
						}
						var startTime = startyear + "-" + startmonth + "-" + startday + ' 00:00:00';
						break;
					case 3:
						days = 30;
						var startday = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
						var startyear = startday.getFullYear();
						var startmonth = startday.getMonth() + 1;
						var startday = startday.getDate();
						if (startmonth < 10) {
							startmonth = "0" + startmonth;
						}
						if (startday < 10) {
							startday = "0" + startday;
						}
						var startTime = startyear + "-" + startmonth + "-" + startday + ' 00:00:00';
						break;
				}


				let UTCStartTime = this.parseUTC(startTime),
					UTCEndTime = this.parseUTC(endTime);


				_this.lineOption.xAxis.categories = [];
				//获取开始时间跟结束之间的每一天
				var startTime1 = _this.getDate(startTime.slice(0, 11));
				var endTime1 = _this.getDate(endTime.slice(0, 11));
				while ((endTime1.getTime() - startTime1.getTime()) >= 0) {
					var year = startTime1.getFullYear();
					var month = (startTime1.getMonth() + 1).toString().length == 1 ? "0" + (startTime1.getMonth() + 1).toString() : startTime1.getMonth() + 1;
					var day = startTime1.getDate().toString().length == 1 ? "0" + startTime1.getDate() : startTime1.getDate();
					var dateStr = year + "-" + month + "-" + day;
					_this.lineOption.xAxis.categories.push(dateStr);
					startTime1.setDate(startTime1.getDate() + 1);
				}
				_this.lineOption.series = [{}];
				_this.lineOption.series[0].data = [];

				let chartObj = HighCharts.chart(DOM, this.lineOption)
				chartObj.showLoading();

				//同样的接口类型  写的五花八门的 也是让人无语
				let postData = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryHomePageLineChartData",
					FAgentGUID: _this.companyID,
					FDataType: reportType,
					FStartTime: UTCStartTime,
					FEndTime: UTCEndTime,
					"FVersion": "1.0.0"
				};

				$.ajax({
					'url': url,
					'cache': false,
					'async': true,
					'type': 'Post',
					'dataType': 'json',
					'contentType': 'application/json;charset=utf-8',
					'data': JSON.stringify(postData),
					success: function (data) {
						var Fobj = data;
						console.log("折线图类型", reportType, data);
						let lineOption = _this.deepCopy(_this.lineOption);
						function parseData(type) {
							$.each(Fobj.FObject, function (index, obj) {
								obj.FDate = obj.FDate.split("T")[0];
								var i = lineOption.xAxis.categories.indexOf(obj.FDate);
								if (i != -1) {
									lineOption.series[0].data[i] = obj[type]
								}
							});
							for (let i = 0; i < lineOption.xAxis.categories.length; i++) {
								if (lineOption.series[0].data[i] == undefined) {
									lineOption.series[0].data[i] = 0;
								}
							}
						};


						switch (reportType) {
							case 'MileageCount':
								lineOption.series[0].name = '_运行里程_';
								lineOption.yAxis.title.text = '_公里_(km)';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '_公里_' + '<br/>';
								};
								parseData("FTotalMileage");

								//国内使用单位规则
								if (_this.$store.state.language == "CN") {
									lineOption.yAxis.labels.formatter = function () {
										if (this.value >= 10000 * 100) {
											return this.value / (10000 * 100) + "百万"
										} else if (this.value >= 10000) {
											return this.value / 10000 + "万"
										} else if (this.value >= 1000) {
											return this.value / 1000 + "千"
										} else {
											return this.value
										}
									}
								};
								break;
							case 'AlarmOverSpeedCount':
								lineOption.series[0].name = '_超速报警次数_';
								lineOption.yAxis.title.text = '_次数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '_次_' + '<br/>';
								};
								parseData("OverSpeedCount");

								break;
							case 'CouplingCount':
								lineOption.series[0].name = '_接甩挂次数_';
								lineOption.yAxis.title.text = '_次数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '_次_' + '<br/>';
								};
								parseData("FUnCouplingCount");
								break;
							case 'RunStopCount':
								lineOption.series[0].name = '_运行效率_';
								lineOption.yAxis.title.text = '_效率_(%)';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '%' + '<br/>';
								};
								$.each(Fobj.FObject, function (index, obj) {
									obj.FDate = obj.FDate.split("T")[0];
									var i = lineOption.xAxis.categories.indexOf(obj.FDate);
									if (i != -1) {
										lineOption.series[0].data[i] = obj.FRunningOnDayCount / (obj.FRunningOnDayCount + obj.FStopOnDayCount) * 100
									}
								});
								for (let i = 0; i < lineOption.xAxis.categories.length; i++) {
									if (lineOption.series[0].data[i] == undefined) {
										lineOption.series[0].data[i] = 0;
									}
								}
								break;
							case 'FLockOpenCount':
								lineOption.series[0].name = '_开锁次数_';
								lineOption.yAxis.title.text = '_次数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '_次_' + '<br/>';
								};
								parseData("FLockOpenCount");

								break;
							case 'TemperatureAbNormalCount':
								lineOption.series[0].name = '_温度异常统计_';
								lineOption.yAxis.title.text = '_次数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '_次_' + '<br/>';
								};
								parseData("FTemperatureAbNormalCount");

								break;
							case "FuelImproper":
								lineOption.series[0].name = '_异常油耗统计_';
								lineOption.yAxis.title.text = '_次数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '_次_' + '<br/>';
								};
								parseData("FuelImproper");

								break;
							case "LoadedContainerCount":
								lineOption.series[0].name = '_重载箱数_';
								lineOption.yAxis.title.text = '_箱数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '<br/>';
								};
								parseData("FLoadedContainerCount");

								break;
							case "TripDetails":
								lineOption.series[0].name = '_站点数_';
								lineOption.yAxis.title.text = '_站点数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '<br/>';
								};
								parseData("TripDetailsCount");

								break;
							case "Trips":
								lineOption.series[0].name = '_发货次数_';
								lineOption.yAxis.title.text = '_次数_';
								lineOption.tooltip.formatter = function () {
									return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + highmaps.numberFormat(this.y, 0, '.', "") + '<br/>';
								};
								parseData("TripsCount");
								break;
						}
						if (_this.$route.path == "/") HighCharts.chart(DOM, lineOption);
					},
					error: function () {
						////console.log("请求失败")
					}

				})
			},
			sendLink: function (value) {
				let data = this.deepCopy(value);
				this.$emit('changeRoute', data);
				this.$router.push({ path: data.router })
			},

		},
		deactivated() {
			//组件停用时 停止定时器
			if (this.interval != null) clearInterval(this.interval);
		},

	}

</script>
<style>
	ul li {
		list-style: none;
	}

	.mycontainer {
		width: 100%;
		padding: 0px;
		margin-top: 5px;
		height: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
		font-family: '微软雅黑', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
	}

	.mycontainer .panel-heading {
		background-color: #fff;
	}

	.sortable {
		padding-left: 10px;
		margin-bottom: 0px;
	}

	.mycontainer .carstatus-container {
		padding-left: 0px;
		padding-right: 10px;
	}

	.mycontainer .carstatus-container:hover .tags_delete {
		display: block;
	}

	.panel {
		margin-bottom: 10px;
	}

	.top-tag {
		position: relative;
		padding-bottom: 0;
		background: #f5f5f5 !important;
	}

	.tags_delete {
		position: absolute;
		right: -1px;
		top: -12px;
		display: none;
	}

	.tags_delete:hover {
		cursor: pointer;
	}

	.chart-title {
		font-family: '微软雅黑', 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 18px !important;
		font-weight: bold !important;
		cursor: pointer;
	}

	.park {
		height: 74px;
		margin-bottom: 10px;
		padding: 5px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		border-radius: 5px;
		color: #fff;
	}

	.park .left-icon {
		position: absolute;
		left: 8%;
		top: 14px;
		width: 46px;
		height: 46px;
	}

	.park:hover {
		box-shadow: 6px 6px 2px #cccccc;
		cursor: move;
	}

	.park .text {
		text-align: right;
	}

	.park .number {
		margin-left: 35%;
		font-size: 28px;
		font-family: "Helvetica Neue";
		line-height: 34px;
	}

	.carstatus {
		margin-left: 35%;
		font-size: 14px;
		line-height: 24px;
	}

	.tagMore {
		position: absolute;
		left: 50%;
		bottom: -24px;
		z-index: 809;
		width: 284px;
		height: 24px;
		margin-left: -142px;
		display: block;
		text-align: center;
		cursor: pointer;
		background: url('/static/img/carIcon/more.png') no-repeat center
	}

	/*车辆状态*/

	/* 全部车辆 */

	.FHaveDataCount,
	.add_tags {
		border: 3px solid #5c9cf4;
		color: #5c9cf4;
	}

	.FHaveDataCount .left-icon {
		background-position: 0 0;
	}

	/* 在线车辆 */

	.FOnLineCount {
		border: 3px solid #68a0d0;
		background: #68a0d0;
	}

	.FOnLineCount .left-icon {
		background-position: -46px 0;
	}

	/* 行驶车辆 */

	.FRunningCount {
		border: 3px solid #407467;
		background: #407467;
	}

	.FRunningCount .left-icon {
		background-position: -92px 0;
	}

	/* 离线 */

	.FOffLineCount {
		border: 3px solid #a8a8a8;
		background: #a8a8a8;
	}

	.FOffLineCount .left-icon {
		background-position: -138px 0;
	}

	/* 停止车辆 */

	.FStopCount {
		border: 3px solid #fba55f;
		background: #fba55f;
	}

	.FStopCount .left-icon {
		background-position: -184px 0;
	}

	/* 报警车辆 */

	.FAlarmCount {
		border: 3px solid #ee4f43;
		background: #ee4f43;
	}

	.FAlarmCount .left-icon {
		background-position: -230px 0;
	}

	/* 今日运行 */

	.FRunningOnDayCount {
		border: 3px solid #ad7dbd;
		background: #ad7dbd;
	}

	.FRunningOnDayCount .left-icon {
		background-position: 0 -46px;
	}

	/* 今日未运行 */

	.FStopOnDayCount {
		border: 3px solid #d67a5c;
		background: #d67a5c;
	}

	.FStopOnDayCount .left-icon {
		background-position: -46px -46px;
	}

	/* 接挂车辆 */

	.FCouplingCount {
		border: 3px solid #68a0d0;
		background: #68a0d0;
	}

	.FCouplingCount .left-icon {
		background-position: -92px -46px;
	}

	/* 甩挂车辆 */

	.FUnCouplingCount {
		border: 3px solid #477baa;
		background: #477baa;
	}

	.FUnCouplingCount .left-icon {
		background-position: -138px -46px;
	}

	/* 有厢车辆 */

	.FContainerCount {
		border: 3px solid #407467;
		background: #407467;
	}

	.FContainerCount .left-icon {
		background-position: -184px -46px;
	}

	/* 无厢车辆 */

	.FUnContainCount {
		border: 3px solid #68a0d0;
		background: #68a0d0;
	}

	.FUnContainCount .left-icon {
		background-position: -230px -46px;
	}

	/* 上锁 */

	.FLockCloseCount {
		border: 3px solid #407467;
		background: #407467;
	}

	.FLockCloseCount .left-icon {
		background-position: -46px -92px;
	}

	/* 开锁 */

	.FLockOpenCount {
		border: 3px solid #477baa;
		background: #477baa;
	}

	.FLockOpenCount .left-icon {
		background-position: 0 -92px;
	}


	/* 满载箱 */

	.FLoadedContainerCount {
		border: 3px solid #ad7dbd;
		background: #ad7dbd;
	}

	.FLoadedContainerCount .left-icon {
		background-position: 0 -138px;
	}

	/* 空载箱 */

	.FEmptyContainerCount {
		border: 3px solid #d67a5c;
		background: #d67a5c;
	}

	.FEmptyContainerCount .left-icon {
		background-position: -46px -138px;
	}

	/* 开门箱数 */

	.FOpenDoorCount {
		border: 3px solid #477baa;
		background: #477baa;
	}

	.FOpenDoorCount .left-icon {
		background-position: -92px -92px;
	}

	/* 关门箱数 */

	.FCloseDoorCount {
		border: 3px solid #fba55f;
		background: #fba55f;
	}

	.FCloseDoorCount .left-icon {
		background-position: -138px -92px;
	}


	/* 吊装 */

	.FHoisting {
		border: 3px solid #68a0d0;
		background: #68a0d0;
	}

	.FHoisting .left-icon {
		background-position: -184px -92px;
	}

	.add_tags:hover {
		cursor: pointer;
	}

	.add_icon {
		position: absolute;
		left: 50%;
		top: 45%;
		margin-left: -23px;
		margin-top: -23px;
		width: 46px;
		height: 46px;
		background: url("/static/img/sprite/tag_icon.png") no-repeat -230px -92px;
	}


	.addstatus {
		border: 3px solid #c9c9c9;
		color: #c9c9c9;

	}

	.addcar {
		text-align: center;
		margin-top: 40px;
		font-size: 14px;
	}


	.deleteStatus {
		float: right;
		text-decoration: none;
		cursor: pointer;
		font-size: 18px;
		font-weight: bold;
		display: none;
	}

	.show {
		display: block;
	}

	.chart {
		height: 480px;
		padding-top: 30px;
	}

	.mapContainer {
		height: 440px;
	}

	.hightchart {
		height: 440px;
	}

	.circle {
		height: 250px;
		position: relative;
	}

	.circle li {
		height: 240px;
	}

	.circle-plus {
		font-size: 20px;
		line-height: 20px;
		color: #bb9360;
		position: absolute;
		left: 98%;
		top: 5px;
		cursor: pointer
	}

	.homeLineChart {
		height: 300px;
	}

	.homeLineCloseBtn {
		float: right;
		cursor: pointer;
	}

	.selectBox {
		float: right;
		width: 260px;
		height: 40px;

	}

	.sortable {
		position: relative;
	}

	.addChart {
		cursor: pointer;
		text-align: center;
		height: 60px;
		line-height: 60px;
	}

	.addLine-icon {
		margin-right: 10px;
		line-height: 60px;
		font-size: 20px;
		font-weight: lighter;
		color: #999;
	}

	.addLine-txt {
		position: relative;
		bottom: 2px;
		font-size: 18px;
		color: #bb9360
	}

	.selectoption {
		width: 150px;
		height: 20px !important;
	}

	.selectoption input {
		height: 24px !important;
	}

	.panel-heading label {
		font-size: 14px;
	}


	.map-btn {
		position: absolute;
		left: 39%;
		bottom: 30px;
		z-index: 10;
	}

	.home-modal-body {
		padding: 20px 0 0 35px;
	}

	.home-modal-body .el-checkbox {
		display: block;
	}

	.selectBox .el-input__suffix {
		top: -7px;
	}

	.selectBox .el-input__icon {
		height: inherit;
	}
</style>