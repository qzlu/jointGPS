<template>
	<section id="OilWear">
		<div class="mymodal">
			<div class="modal-header"
				 style="position: absolute;left: 890px;height: 20px;width: 20px;border: none;padding: 0px;z-index: 2;">
				<button type="button" @click="closeMymodal"
						style="height: 30px;width: 30px;background:transparent;outline:none;border: none;">
					<!--<span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal"></span>-->
					<i class="fa fa-times" aria-hidden="true" style="font-size: 24px;"></i>
				</button>
			</div>
			<div class="modal-body" style="padding: 0px">
				<baidu-map ref="map" :fa-data="[mapToolShow]"></baidu-map>
			</div>
			<div class="mapModal">
				<header style="background: #f9f9f9 ;height:34px;padding: 10px">
					<h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{locationIntro.FVehicleName}}</h4>
				</header>
				<div style="padding: 15px" v-show="isShowRefuel">
					<p><span>_开始时间_：</span>{{locationIntro.FStartDateTime}}</p>
					<p><span>_结束时间_：</span>{{locationIntro.FStopDateTime}}</p>
					<p><span>_持续时长_：</span>{{locationIntro.FKeepSeconds}}</p>
					<p><span>_开始升数_：</span>{{locationIntro.FStartLiter}}</p>
					<p><span>_结束升数_：</span>{{locationIntro.FStopLiter}}</p>
					<p><span>_加油升数_：</span>{{locationIntro.FRefuel}}</p>
					<p><span>_位置_：</span>{{locationIntro.address}}</p>
				</div>
                <div style="padding: 15px" v-show="isShowImproper">
                    <p><span>_开始时间_：</span>{{locationIntro.FStartDateTime}}</p>
                    <p><span>_结束时间_：</span>{{locationIntro.FStopDateTime}}</p>
                    <p><span>_持续时长_：</span>{{locationIntro.FKeepSeconds}}</p>
                    <p><span>_开始升数_：</span>{{locationIntro.FStartLiter}}</p>
                    <p><span>_结束升数_：</span>{{locationIntro.FStopLiter}}</p>
                    <p><span>_消耗升数_：</span>{{locationIntro.FImproper}}</p>
                    <p><span>_位置_：</span>{{locationIntro.address}}</p>
                </div>
			</div>
		</div>
		<!--选择车辆弹窗-->
		<vehical-select-dialog v-on:child.sync="get" ref="vehicle"></vehical-select-dialog>
		<div id="operate_wrapper"><!--part1 header start-->
			<div class='box-header'>
				<div class="block">
					<span class="operatExp">_选择车辆_</span>
					<div class="search-input-wrap" data-toggle="modal" data-target="#modal"><!---->
						<a href="javascript:;" class="get-carList-dialog">
							<i class="img-icon icon-carList-dialog"></i>
						</a>
						<input type="text" class="search-input">
					</div>
				</div>
				<div class="block">
					<span class="operatExp">_选择时间_</span>
					<el-date-picker
						popper-class="oilWearDateSelect"
						size="small"
						v-model="queryDate"
						type="datetimerange"
						:clearable="false"
						:picker-options="pickerOptions"
						placeholder="_选择时间范围_">
					</el-date-picker>
				</div>
				<div class="btnList">
					<el-button type="primary" class="search" @click="doQuery()">_查询_</el-button>
					<el-button type="primary" class="reset" @click="resetCondition()">_重置_</el-button>
					<!--<el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>导出文件</el-button>-->
					<!--<el-button type="primary" class="read" @click="changeState"><i class="fa fa-envelope-open-o"></i>_设为已读_
					</el-button>-->
				</div>
			</div>
			<!--饿了么选项卡部分，报警报表，胎压报警里面估计没有，可省略-->
			<el-tabs v-model="activeName" @tab-click="switchoverTab" @tab-remove="removeTab">
				<el-tab-pane label="_汇总_" name="1"></el-tab-pane>
				<el-tab-pane
					v-for="(item, index) in editableTabs"
					:key="item.name"
					closable
					:label="item.title"
					:name="item.name"
				></el-tab-pane>
			</el-tabs>
		</div><!--part1 header end-->

		<div class="el_table_wrap" id="el_table_wrap"><!--part2 header start-->
			<!--汇总-->
			<el-table :data="FuelCountInfo" stripe style="width: 100%" :height="table_height"
					  v-show="show_FuelCount">
				<!--表格统一用饿了么组件，类型使用stripe，不要使用border-->
				<el-table-column tooltip-effect="dark" type="index" align="center" label="_序号_" width="80">
				</el-table-column>
				<el-table-column label="_操作_" align="center" width="100">
					<template scope="scope">
						<el-button type="text" title="_查看油位曲线_" size="small" @click="doChartQuery(scope.row,'collect')"><i
							class='img_chart'></i></el-button>
						<el-button type="text" title="_查看加油次数_" size="small" @click="LookOverFRefuelCount(scope.row)"><i
							class='img_refuel'></i></el-button>
						<el-button type="text" title="_查看异常消耗次数_" size="small" @click="LookOverFuelImproper(scope.row)"><i
							class='img_fuel_abnormal'></i></el-button>
					</template>
				</el-table-column>
				<el-table-column prop="FShortName" label="_公司简称_" width="120">
				</el-table-column>
				<el-table-column prop="FVehicleName" label="_车牌号_" sortable min-width="100">
				</el-table-column>
				<el-table-column prop="FRefuelCount" label="_加油次数_" sortable width="140">
					<!--<template scope="scope">-->
						<!--<el-button type="text" size="small" @click="LookOverFRefuelCount(scope.row)">-->
							<!--{{scope.row.FRefuelCount}}-->
						<!--</el-button>-->
					<!--</template>-->
				</el-table-column>
				<el-table-column prop="FRefuelSum" label="_加油_(_升_)" sortable width="120">
				</el-table-column>
				<el-table-column prop="FImproperCount" label="_异常消耗次数_" sortable width="220">
					<!--<template scope="scope">-->
						<!--<el-button type="text" size="small" @click="LookOverFuelImproper(scope.row)">-->
							<!--{{scope.row.FImproperCount}}-->
						<!--</el-button>-->
					<!--</template>-->
				</el-table-column>
				<el-table-column prop="FImproperSum" align="center" sortable label="_异常消耗_(_升_)" width="180">
				</el-table-column>
				<el-table-column prop="FRunFuelSum" align="center" label="_运行消耗_(_升_)" sortable width="172">
				</el-table-column>
				<el-table-column prop="FRunMileageSum" align="center" label="_运行距离_(km)" sortable width="190">
				</el-table-column>
				<el-table-column prop="MPG" align="center" label="_百公里油耗_(_升_/100km)" sortable width="260">
				</el-table-column>

			</el-table>


			<!--加油次数-->
			<el-table :data="FuelRefuelInfo" stripe style="width: 100%" :height="table_height/2-20" v-show="show_FuelRefuel">
				<!--表格统一用饿了么组件，类型使用stripe，不要使用border-->
				<el-table-column tooltip-effect="dark" type="index" align="center" label="_序号_" width="80">
				</el-table-column>
				<el-table-column label="_操作_" align="center" width="120">
					<template scope="scope">
						<el-button type="text" title="_查看位置_" size="small" @click="position(scope.$index,scope.row)">
							<i class='img_track'></i>
						</el-button>
						<el-button type="text" title="_查看加油详情_" size="small" @click="doRefuelAndImproperQuery(scope.row,'refuel')">
							<i class='img_chart'></i>
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="FShortName" label="_公司简称_" show-overflow-tooltip width="120">
				</el-table-column>
				<el-table-column prop="FStartDateTime" label="_开始时间_" sortable width="180">
				</el-table-column>
				<el-table-column prop="FStopDateTime" label="_结束时间_" width="180">
				</el-table-column>
				<el-table-column prop="FStartLiter" label="_开始升数_" sortable width="180">
				</el-table-column>
				<el-table-column prop="FStopLiter" label="_结束升数_" sortable width="180">
				</el-table-column>
				<el-table-column prop="FRefuel" align="center" label="_加油升数_" sortable width="120">
				</el-table-column>
				<el-table-column prop="address" align="center" label="_位置_" min-width="230">
				</el-table-column>

			</el-table>
			<!--异常次数-->
			<el-table :data="FuelImproperInfo" stripe style="width: 100%" :height="table_height/2-20"
					  v-show="show_FuelImproper">
				<!--表格统一用饿了么组件，类型使用stripe，不要使用border-->
				<el-table-column tooltip-effect="dark" type="index" align="center" label="_序号_" width="80">
				</el-table-column>
				<el-table-column label="_操作_" align="center" width="120">
					<template scope="scope">
						<el-button type="text" size="small" @click="position(scope.$index,scope.row)">
							<i class='img_track'></i>
						</el-button>
						<el-button type="text" size="small" @click="doRefuelAndImproperQuery(scope.row,'improper')">
							<i class='img_chart'></i>
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="FShortName" label="_公司简称_" show-overflow-tooltip width="120">
				</el-table-column>
				<el-table-column prop="FStartDateTime" label="_开始时间_" sortable width="180">
				</el-table-column>
				<el-table-column prop="FStopDateTime" label="_结束时间_" width="180">
				</el-table-column>
				<el-table-column prop="FStartLiter" label="_开始升数_" sortable width="180">
				</el-table-column>
				<el-table-column prop="FStopLiter" label="_结束升数_" sortable width="180">
				</el-table-column>
				<el-table-column prop="FImproper" align="center" label="_油位消耗_" sortable width="150">
				</el-table-column>
				<el-table-column prop="address" align="center" label="_位置_" min-width="230">
				</el-table-column>
			</el-table>

		</div><!--part2 header end-->
		<div style="height:0">
			<div v-show="showChartCollect" id="chartCollect"
				 :style="{height:div_height+'px',background:'#fff'}"
				 v-loading="loadingCharts"
				 element-loading-text="拼命加载中">
			</div>
			<button v-show="showChartCollect" class="resetChartCollect" @click="resetChartCollect('collect')">_重置图表_</button>
		</div>

		<!--<el-dialog :visible.sync="showChartRefuelDialog">
			<div id="chartRefuel"></div>
		</el-dialog>
		<el-dialog :visible.sync="showChartImproperDialog">
			<div id="chartImproper"></div>
		</el-dialog>-->
		<!--<div class="mymodalCommon mymodal1" v-show="radio==1">
			<div class="modal-header">
				<div style="float: right">
					<button
						type="button" @click="open"
						class="btn-white btn-custom" style="width: 60px"><i
						class="fa fa-arrows-alt  padding-r-8"></i>{{word}}
					</button>
					<button type="button" @click="closeMymodal"
							style="height: 20px;width: 20px;background:white;border: none;"><span
						class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal;"></span>
					</button>
				</div>
			</div>
			<div id="chartCollect"></div>
		</div>--><!-- /.modal-content -->
		<!--分页还是统一用饿了么的组件，事件、配置都还挺好-->
		<div id="pagination" class="pagination" v-show="show_pagination"><!--part3 header start-->
			<div class="block" v-if="show_FuelCount">
				<el-pagination
					@size-change="handleSizeChangeFuelCount"
					@current-change="handleCurrentChangeFuelCount"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize_FuelCount"
					:current-page="pageIndex_FuelCount"
					layout="prev, pager, next, jumper,total,sizes"
					:total="FuelCountFTotalCount">
				</el-pagination>
			</div>
			<div class="block" v-if="show_FuelRefuel">
				<el-pagination
					@size-change="handleSizeChangeRefuel"
					@current-change="handleCurrentChangeRefuel"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize_Refuel"
					:current-page="pageIndex_Refuel"
					layout="prev, pager, next, jumper,total,sizes"
					:total="RefuelFTotalCount">
				</el-pagination>
			</div>
			<div class="block" v-if="show_FuelImproper">
				<el-pagination
					@size-change="handleSizeChangeImproper"
					@current-change="handleCurrentChangeImproper"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize_Improper"
					:current-page="pageIndex_Improper"
					layout="prev, pager, next, jumper,total,sizes"
					:total="FuelImproperFTotalCount">
				</el-pagination>
			</div>
		</div><!--part3 header end-->
		<div id="chartRefuel"
			 v-show="show_FuelRefuel"
			 v-loading="loadingRefuelCharts"
			 element-loading-text="_拼命加载中_"
			 :style="{height:table_height/2+'px'}"></div>
		<div id="chartImproper"
			 v-show="show_FuelImproper"
			 v-loading="loadingImproperCharts"
			 element-loading-text="_拼命加载中_"
			 :style="{height:table_height/2+'px'}"></div>
	</section>
</template>
<!--<script src="https://img.hcharts.cn/highcharts/highcharts.js"></script>
<script src="https://img.hcharts.cn/highcharts/modules/exporting.js"></script>
<script src="https://img.hcharts.cn/highcharts-plugins/highcharts-zh_CN.js"></script>-->
<script>
	import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
	import HighChart from 'highcharts/highstock'
	require('highcharts/modules/drilldown')(HighChart)
	//require('highcharts/modules/exporting')(HighChart)
	//require('highcharts/modules/offline-exporting')(HighChart)
	/*这两个文件虽然在这引用，但是作用仍在全局，内容不多，后期估计得加到main.css里面就可以了*/
	import baiduMap from '../Common/baidu_map.vue'
	export default {
		data() {
			return {
				Area: "深圳",
				mapToolShow: false,
				queryDate: [new Date(new Date().getTime()-1*1000*60*60*24).getFullYear()+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getMonth()+1)+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getDate())+" 00:00:00", new Date(new Date().getTime()-1*1000*60*60*24).getFullYear()+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getMonth()+1)+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getDate())+" 23:59:59"],
				activeName: "1",
				show_FuelCount: true,//显示汇总table
				show_FuelRefuel: false,//显示加油次数table
				show_FuelImproper: false,//显示异常次数table
				table_height: null,
				div_height: null,
				FuelCountInfo: [],
				FuelRefuelInfo: [],
				FuelImproperInfo: [],
				checkedRow: [],
				pageIndex_FuelCount: 1,
				pageSize_FuelCount: 20,
				pageIndex_Refuel: 1,
				pageSize_Refuel: 20,
				pageIndex_Improper: 1,
				pageSize_Improper: 20,
				FuelCountFTotalCount: 0,
				RefuelFTotalCount: 0,
				FuelImproperFTotalCount: 0,
				RefuelCountLicense: "",
				CountLicense: "",
				FVehicleGUID_Count:"",//汇总车辆id
				FVehicleGUID_Refuel:"",//加油车辆id
				FVehicleGUID_Improper:"",//异常车辆id
				tempCountData:"",//汇总稀释后的临时数据
				RefuelCountCarFGUID: "",
				FuelImproperLicense: "",
				FuelImproperCarFGUID: "",
				carFGUID: "",
                isShowRefuel:false,
                isShowImproper:false,
				locationIntro: {
					FVehicleName: "",
					FStartDateTime: "",
					FStopDateTime: "",
                    FStartLiter:"",
                    FStopLiter:"",
                    FRefuel:"",
                    FImproper:"",
					FKeepSeconds: "",
					address: ""
				},
				FStartDateTime: "",
				//seachTime: "",
				editableTabs: [],
				showChartCollect: false,//是否显示汇总曲线选项卡
				showChartRefuelDialog: false,
				showChartImproperDialog: false,
				show_pagination: true,
				loadingCharts: false,//汇总折线图loading
				loadingRefuelCharts:false,//加油折线图loading
				loadingImproperCharts:false,//异常折线图loading
				customInterval: 150,
				pickerOptions: {
					shortcuts: [{
						text: '_最近三天_',
						onClick(picker) {
							let data=new Date(new Date().getTime()-3*1000*60*60*24);
							let s_dateStr=(data.getFullYear()+"-"+(data.getMonth()+1)+"-"+(data.getDate())+" 00:00:00");
							data=new Date(new Date().getTime()-1*1000*60*60*24);
							let e_dateStr=(data.getFullYear()+"-"+(data.getMonth()+1)+"-"+(data.getDate())+" 23:59:59");
							let start=new Date(s_dateStr);
							let end=new Date(e_dateStr);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '_最近一周_',
						onClick(picker) {
							let data=new Date(new Date().getTime()-7*1000*60*60*24);
							let s_dateStr=(data.getFullYear()+"-"+(data.getMonth()+1)+"-"+(data.getDate())+" 00:00:00");
							data=new Date(new Date().getTime()-1*1000*60*60*24);
							let e_dateStr=(data.getFullYear()+"-"+(data.getMonth()+1)+"-"+(data.getDate())+" 23:59:59");
							let start=new Date(s_dateStr);
							let end=new Date(e_dateStr);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '_最近一个月_',
						onClick(picker) {
							let data=new Date(new Date().getTime()-30*1000*60*60*24);
							let s_dateStr=(data.getFullYear()+"-"+(data.getMonth()+1)+"-"+(data.getDate())+" 00:00:00");
							data=new Date(new Date().getTime()-1*1000*60*60*24);
							let e_dateStr=(data.getFullYear()+"-"+(data.getMonth()+1)+"-"+(data.getDate())+" 23:59:59");
							let start=new Date(s_dateStr);
							let end=new Date(e_dateStr);
							picker.$emit('pick', [start, end]);
						}
					}],
					disabledDate(time){
						return time.getTime() > Date.now() - 8.64e7;
					}
				},
//				option: this.$store.state.oilLineChart,
				option: {
					chart: {
						type: "spline",
						zoomType: 'xy',
						panning: true,
						panKey: 'ctrl',
						marginTop: 50,
						marginBottom: 50,
						resetZoomButton: {
							theme: {
								display: 'none'
							}
						}
					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					scrollbar: {
						enabled: false
					},
					//X轴数据
					xAxis: {
						type: 'datetime',
						//categories: [],
						labels: {
							/*formatter: function() {
							 return  HighChart.dateFormat('%H:%M:%S', this.value);
							 }*/
							//step:2
						},
						dateTimeLabelFormats: {
							hour: '%H:%M',
							day: '%m-%d',
							week: '%m-%d',
							month: '%Y-%m',
							year: '%Y'
						},
						gridLineWidth:1,
						gridLineDashStyle:"Dash",

						//X轴显示文字
						title: {
							text: null,
						},
						//tickInterval: 3 * 60 * 60 * 1000,

						events: {
							// 范围选择器改变的范围最终是改变坐标轴的范围，所以我们监听坐标的极值变更事件函数即可
							/*afterSetExtremes: function(e) {
								// e.min 和 e.max 为坐标轴当前的范围
								console.log(new Date(e.min),new Date(e.max));
							}*/
						}
					},
					yAxis: [{ // Primary yAxis
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[2]
							 }*/
						},
						gridLineWidth: 0,
						title: {
							text: '_油位_',
							style: {
								color: "#df2020"
							}
						},
						//tickAmount: 7,
						//tickInterval: 50,

						opposite: true,
						lineWidth: 1,
						lineColor: '#df2020',
						tickColor:"#df2020",
						tickLength:5
					}, { // Tertiary yAxis
						gridLineWidth: 0,
						title: {
							text: '_里程_',
							style: {
								color: "#009dff"
							}
						},
						endOnTick:true,
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[1]
							 }*/
						},
						//tickInterval:20000,
						opposite: true,
						lineWidth: 1,
						lineColor: '#009dff',
					}, { // Secondary yAxis
						gridLineWidth: 0,
						title: {
							text: '_速度_',
							style: {
								color: "#009400"
							}
						},
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[0]
							 }*/
						},
						lineWidth: 1,
						lineColor: '#009400',
						tickAmount: 5,
						tickInterval: 50,
					}],
					tooltip: {
						dateTimeLabelFormats: {
							minute: '%Y-%m-%d %H:%M',
						},
						formatter:function(){
							//console.log(this);
							let time=moment(new Date(this.x)).format("YYYY-MM-DD HH:mm:ss");
							return "<span>"+time+"</span><br><span>_油位_：</span>"+this.points[0].y+"_升_<br><span>_里程_：</span>"+this.points[1].y+"km<br><span>_速度_：</span>"+this.points[2].y+"km/h";
						},
						borderColor: 'black',
						shared: true,
						crosshairs: [{            // 设置准星线样式
							width: 1,
							color: '#d8e63c'
						}],
					},
					plotOptions: {
						spline: {
							marker: {
								enabled: false
							},
							dataLabels: {
								enabled: false
							},

							enableMouseTracking: true //是否显示title
						},
					},
					legend: {
						layout: 'horizontal',
						align: 'left',
						x: 100,
						verticalAlign: 'top',
						y: 10,
						floating: true,
						/*backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'*/
					},
					credits:{
						enabled: false // 禁用版权信息
					},
					series: [
						{
							name: '_油位_(_升_)',
							type: 'spline',
							data: [],
							yAxis: 0,
							lineWidth: 1,
							//showInNavigator: true,
							color: "#df2020",
							tooltip: {
								valueSuffix: ' _升_'
							},
						},
						{
							name: '_里程_(km)',
							type: 'spline',
							yAxis: 2,
							lineWidth: 1,
							color: "#009dff",
							data: [],
							yAxis: 1,
							//showInNavigator: true,
							marker: {
								enabled: false
							},
							//dashStyle: 'shortdot',
							tooltip: {
								valueSuffix: ' km'
							},
						}, {
							name: '_速度_(km/h)',
							type: 'spline',
							yAxis: 1,
							lineWidth: 1,
							data: [],
							yAxis: 2,
							//showInNavigator: true,
							color: "#009400",
							tooltip: {
								valueSuffix: ' km/h'
							},
						}
					],
					//导出
					exporting: {
						sourceWidth: 1280,
						sourceHeight: 640,
						buttons:{
							contextButton: {
								// 自定义导出菜单项目及顺序
								menuItems: [
									{
										text: '_导出_PDF_文件_',
										onclick: function() {
											this.exportChart({
												type: 'application/pdf'
											});
										}
									},
									{
										text: '_导出_PNG_文件_',
										onclick: function() {
											this.exportChart({
												type: 'image/png'
											});
										}
									},
									{
										text: '_导出_JPG_文件_',
										onclick: function() {
											this.exportChart({
												type: 'image/jpeg'
											});
										}
									},
								]
							}


						},
						fallbackToExportServer: false
					},
				},
				RefuelOption: {
					chart: {
						type: "spline",
						zoomType: 'xy',
						panning: true,
						panKey: 'ctrl',
						marginTop: 50,
						marginBottom: 50,
					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					scrollbar: {
						enabled: false
					},
					//X轴数据
					xAxis: {
						type: 'datetime',
						//categories: [],
						labels: {
							/*formatter: function() {
							 return  HighChart.dateFormat('%H:%M:%S', this.value);
							 }*/
							//step:2
						},
						dateTimeLabelFormats: {
							hour: '%H:%M',
							day: '%m-%d',
							week: '%m-%d',
							month: '%Y-%m',
							year: '%Y'
						},
						gridLineWidth:1,
						gridLineDashStyle:"Dash",

						//X轴显示文字
						title: {
							text: null,
						},
						//tickInterval: 3 * 60 * 60 * 1000,

						events: {
							// 范围选择器改变的范围最终是改变坐标轴的范围，所以我们监听坐标的极值变更事件函数即可
							afterSetExtremes: function(e) {
								// e.min 和 e.max 为坐标轴当前的范围
								//console.log(e);
								//console.log(new Date(e.min),new Date(e.max));
							}
						}
					},
                    //导出
                    exporting: {
                        sourceWidth: 1280,
                        sourceHeight: 640,
                        buttons:{
                            contextButton: {
                                // 自定义导出菜单项目及顺序
                                menuItems: [
                                    {
                                        text: '_导出_PDF_文件_',
                                        onclick: function() {
                                            this.exportChart({
                                                type: 'application/pdf'
                                            });
                                        }
                                    },
                                    {
                                        text: '_导出_PNG_文件_',
                                        onclick: function() {
                                            this.exportChart({
                                                type: 'image/png'
                                            });
                                        }
                                    },
                                    {
                                        text: '_导出_JPG_文件_',
                                        onclick: function() {
                                            this.exportChart({
                                                type: 'image/jpeg'
                                            });
                                        }
                                    },
                                ]
                            }


                        },
                        fallbackToExportServer: false
                    },
					yAxis: [{ // Primary yAxis
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[2]
							 }*/
						},
						gridLineWidth: 0,
						title: {
							text: '_油位_',
							style: {
								color: "#df2020"
							}
						},
						//tickAmount: 7,
						//tickInterval: 50,

						opposite: true,
						lineWidth: 1,
						lineColor: '#df2020',
						tickColor:"#df2020",
						tickLength:5
					}, { // Tertiary yAxis
						gridLineWidth: 0,
						title: {
							text: '_里程_',
							style: {
								color: "#009dff"
							}
						},
						endOnTick:true,
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[1]
							 }*/
						},
						//tickInterval:20000,
						opposite: true,
						lineWidth: 1,
						lineColor: '#009dff',
					}, { // Secondary yAxis
						gridLineWidth: 0,
						title: {
							text: '_速度_',
							style: {
								color: "#009400"
							}
						},
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[0]
							 }*/
						},
						lineWidth: 1,
						lineColor: '#009400',
						tickAmount: 5,
						tickInterval: 50,
					}],
					tooltip: {
						dateTimeLabelFormats: {
							minute: '%Y-%m-%d %H:%M',
						},
						formatter:function(){
							//console.log(this);
							let time=moment(new Date(this.x)).format("YYYY-MM-DD HH:mm:ss");
							return "<span>"+time+"</span><br><span>_油位_：</span>"+this.points[0].y+"_升_<br><span>_里程_：</span>"+this.points[1].y+"km<br><span>_速度_：</span>"+this.points[2].y+"km/h";
						},
						borderColor: 'black',
						shared: true,
						crosshairs: [{            // 设置准星线样式
							width: 1,
							color: '#d8e63c'
						}],
					},
					plotOptions: {
						spline: {
							marker: {
								enabled: false
							},
							dataLabels: {
								enabled: false
							},

							enableMouseTracking: true //是否显示title
						},
					},
					legend: {
						layout: 'horizontal',
						align: 'left',
						x: 100,
						verticalAlign: 'top',
						y: 10,
						floating: true,
						/*backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'*/
					},
					credits:{
						enabled: false // 禁用版权信息
					},
					series: [
						{
							name: '_油位_(_升_)',
							type: 'spline',
							data: [],
							yAxis: 0,
							lineWidth: 1,
							//showInNavigator: true,
							color: "#df2020",
							tooltip: {
								valueSuffix: ' _升_'
							},
						},
						{
							name: '_里程_(km)',
							type: 'spline',
							yAxis: 2,
							lineWidth: 1,
							color: "#009dff",
							data: [],
							yAxis: 1,
							//showInNavigator: true,
							marker: {
								enabled: false
							},
							//dashStyle: 'shortdot',
							tooltip: {
								valueSuffix: ' km'
							},
						}, {
							name: '_速度_(km/h)',
							type: 'spline',
							yAxis: 1,
							lineWidth: 1,
							data: [],
							yAxis: 2,
							//showInNavigator: true,
							color: "#009400",
							tooltip: {
								valueSuffix: ' km/h'
							},
						}
					]
				},
				ImproperOption: {
					chart: {
						type: "spline",
						zoomType: 'xy',
						panning: true,
						panKey: 'ctrl',
						marginTop: 50,
						marginBottom: 50,
					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					scrollbar: {
						enabled: false
					},
					//X轴数据
					xAxis: {
						type: 'datetime',
						//categories: [],
						labels: {
							/*formatter: function() {
							 return  HighChart.dateFormat('%H:%M:%S', this.value);
							 }*/
							//step:2
						},
						dateTimeLabelFormats: {
							hour: '%H:%M',
							day: '%m-%d',
							week: '%m-%d',
							month: '%Y-%m',
							year: '%Y'
						},
						gridLineWidth:1,
						gridLineDashStyle:"Dash",

						//X轴显示文字
						title: {
							text: null,
						},
						//tickInterval: 3 * 60 * 60 * 1000,

						events: {
							// 范围选择器改变的范围最终是改变坐标轴的范围，所以我们监听坐标的极值变更事件函数即可
							afterSetExtremes: function(e) {
								// e.min 和 e.max 为坐标轴当前的范围
								//console.log(e);
								//console.log(new Date(e.min),new Date(e.max));
							}
						}
					},
                    //导出
                    exporting: {
                        sourceWidth: 1280,
                        sourceHeight: 640,
                        buttons:{
                            contextButton: {
                                // 自定义导出菜单项目及顺序
                                menuItems: [
                                    {
                                        text: '_导出_PDF_文件_',
                                        onclick: function() {
                                            this.exportChart({
                                                type: 'application/pdf'
                                            });
                                        }
                                    },
                                    {
                                        text: '_导出_PNG_文件_',
                                        onclick: function() {
                                            this.exportChart({
                                                type: 'image/png'
                                            });
                                        }
                                    },
                                    {
                                        text: '_导出_JPG_文件_',
                                        onclick: function() {
                                            this.exportChart({
                                                type: 'image/jpeg'
                                            });
                                        }
                                    },
                                ]
                            }


                        },
                        fallbackToExportServer: false
                    },
					yAxis: [{ // Primary yAxis
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[2]
							 }*/
						},
						gridLineWidth: 0,
						title: {
							text: '_油位_',
							style: {
								color: "#df2020"
							}
						},
						//tickAmount: 7,
						//tickInterval: 50,

						opposite: true,
						lineWidth: 1,
						lineColor: '#df2020',
						tickColor:"#df2020",
						tickLength:5
					}, { // Tertiary yAxis
						gridLineWidth: 0,
						title: {
							text: '_里程_',
							style: {
								color: "#009dff"
							}
						},
						endOnTick:true,
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[1]
							 }*/
						},
						//tickInterval:20000,
						opposite: true,
						lineWidth: 1,
						lineColor: '#009dff',
					}, { // Secondary yAxis
						gridLineWidth: 0,
						title: {
							text: '_速度_',
							style: {
								color: "#009400"
							}
						},
						labels: {
							format: '{value}',
							/*style: {
							 color: Highcharts.getOptions().colors[0]
							 }*/
						},
						lineWidth: 1,
						lineColor: '#009400',
						tickAmount: 5,
						tickInterval: 50,
					}],
					tooltip: {
						dateTimeLabelFormats: {
							minute: '%Y-%m-%d %H:%M',
						},
						formatter:function(){
							//console.log(this);
							let time=moment(new Date(this.x)).format("YYYY-MM-DD HH:mm:ss");
							return "<span>"+time+"</span><br><span>_油位_：</span>"+this.points[0].y+"_升_<br><span>_里程_：</span>"+this.points[1].y+"km<br><span>_速度_：</span>"+this.points[2].y+"km/h";
						},
						borderColor: 'black',
						shared: true,
						crosshairs: [{            // 设置准星线样式
							width: 1,
							color: '#d8e63c'
						}],
					},
					plotOptions: {
						spline: {
							marker: {
								enabled: false
							},
							dataLabels: {
								enabled: false
							},

							enableMouseTracking: true //是否显示title
						},
					},
					legend: {
						layout: 'horizontal',
						align: 'left',
						x: 100,
						verticalAlign: 'top',
						y: 10,
						floating: true,
						/*backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'*/
					},
					credits:{
						enabled: false // 禁用版权信息
					},
					series: [
						{
							name: '_油位_(_升_)',
							type: 'spline',
							data: [],
							yAxis: 0,
							lineWidth: 1,
							//showInNavigator: true,
							color: "#df2020",
							tooltip: {
								valueSuffix: ' _升_'
							},
						},
						{
							name: '_里程_(km)',
							type: 'spline',
							yAxis: 2,
							lineWidth: 1,
							color: "#009dff",
							data: [],
							yAxis: 1,
							//showInNavigator: true,
							marker: {
								enabled: false
							},
							//dashStyle: 'shortdot',
							tooltip: {
								valueSuffix: ' km'
							},
						}, {
							name: '_速度_(km/h)',
							type: 'spline',
							yAxis: 1,
							lineWidth: 1,
							data: [],
							yAxis: 2,
							//showInNavigator: true,
							color: "#009400",
							tooltip: {
								valueSuffix: ' km/h'
							},
						}
					]
				},
			}
		},

		props: {
			screenHeight: Number
		},
		mounted(){
			require('highcharts/modules/exporting')(HighChart)
			require('highcharts/modules/offline-exporting')(HighChart)
			this.$refs.map.initMap();
			$("#map-wrapper").height(470);
			console.log(new Date().getFullYear()+"-"+(new Date().getMonth()+1));
			console.log(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+(new Date().getDate())+" 00:00:00");
			setTimeout(() => {
				this.adjustPage();
			}, 100);
			HighChart.wrap(HighChart.Chart.prototype, 'exportChartLocal', function (proceed, options) {
				if (options && options.type === 'application/pdf') {
					this.exportChart(options);
				} else {
					proceed.call(this, options);
				}
			});
			HighChart.setOptions({
				lang: {
					resetZoom: '_重置_',
					//contextButtonTitle: "_图表导出菜单_",
					downloadJPEG:"_下载_ JPEG _图片_",
					downloadPDF:"_下载_ PDF _文件_",
					downloadPNG:"_下载_ PNG _文件_",
					downloadSVG:"_下载_ SVG _文件_",
					printChart:"_打印图表_"
				},
				rangeSelector: {
					buttons: [{
						type: 'all',
						text: 'All'
					}],
					selected: 1
				},
				global: { useUTC: false }
			});
		},
		methods: {
			/*Pagination*/
			/*--全部--*/
			handleSizeChangeFuelCount(val) {
				this.pageSize_FuelCount = val;
				this.doQuery();
			},
			handleCurrentChangeFuelCount(val) {
				this.pageIndex_FuelCount = val;
				this.doQuery();
			},
			handleSizeChangeRefuel(val) {
				this.pageSize_Refuel = val;
				this.doRefuelCountQuery();
			},
			handleCurrentChangeRefuel(val) {
				this.pageIndex_Refuel = val;
				this.doRefuelCountQuery();
			},
			handleSizeChangeImproper(val) {
				this.pageSize_Improper = val;
				this.doFuelImproperQuery();
			},
			handleCurrentChangeImproper(val) {
				this.pageIndex_Improper = val;
				this.doFuelImproperQuery();
			},
			adjustPage(bool){
				if(bool==""||bool==null||bool==undefined){
					this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) + 10;
				}else {
					this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) -20;
				}
				this.div_height = Number(this.table_height) + 40;
			},

			//警告弹窗内容
			warningDialogMsg(msg, type){
				this.$message({
					showClose: true,
					message: msg,
					type: type
				});
			},
			//获取时间
			/*getTime(value){
				return this.seachTime = value;
			},*/
			//请求数据
			doQuery(){
				let time = this.queryDate;
				console.log(this.License);
				console.log(time);
				if (this.License == ""||this.License==undefined) {
					this.warningDialogMsg("_请选择车辆_!", "warning");
					return false;
				} else if (time == ""||time[0]==null) {
					this.warningDialogMsg("_请选择时间_!", "warning");
					return false;
				}
				var _this = this;
				//console.log(time);
				//let startTime = this.parseUTC(time[0] + " 00:00:00");
				let startTime = this.parseUTC(time[0]);
				//let endTime = this.parseUTC(time[1] + " 23:59:59");
				let endTime = this.parseUTC(time[1]);
				//console.log(startTime+","+endTime);
				let letFTokenID = this.$store.state.FTokenID;
				//console.log(_this.carFGUID);
				//console.log(startTime+","+endTime);
				//console.log(this.datelimit(endTime,startTime,3));
				if (!this.datelimit(endTime, startTime, 29)) {
					this.warningDialogMsg("_查询时间请小于七天_!", "warning");
					return false;
				}
				$.post("/web/Combine/Combine_Report", {
					FTokenID: letFTokenID,
					FAction: "QueryFuelCountByFVehicleGUIDs",
					FVehicleGUIDs: _this.carFGUID,
					FStartTime: startTime,
					FEndTime: endTime,
					FPageSize: this.pageSize_FuelCount,
					FPageIndex: this.pageIndex_FuelCount,
					FOrderBy: "FRefuelCount DESC",
					FVersion: "1.0.0",
				}, function (data) {
					//let json=JSON.parse(data);
					//console.log(data);
					if (data.FObject.length != 0) {
						_this.FuelCountFTotalCount = data.FObject.Table[0].FTotalCount;
						//_this.FuelCountInfo = data.FObject.Table1;
						let tempArr = _this.getUsableData(data.FObject.Table1, "count");
						_this.FuelCountInfo = tempArr;
					} else {
						_this.warningDialogMsg("_未查询到数据_!", "warning");
					}
				});
			},
			//关闭modal窗口
			closeMymodal() {
				$(".mymodal").css('visibility', 'hidden')
			},
			//地图上定位
			position(index, row) {
				$(".mymodal").css('visibility', 'visible');
				//console.log(index, row);
				var point = new BMap.Point(row.FLongitude, row.FLatitude);
				this.$refs.map.setMark(point);
				this.setMapInfo(row);
			},

			//在地图上添加点信息
			setMapInfo(row){
				this.locationIntro.FVehicleName = row.FVehicleName;
				this.locationIntro.FStartDateTime = row.FStartDateTime;
				this.locationIntro.FStopDateTime = row.FStopDateTime;
				this.locationIntro.FStartLiter = row.FStartLiter;
				this.locationIntro.FStopLiter = row.FStopLiter;
				this.locationIntro.FRefuel = row.FRefuel;
				this.locationIntro.FImproper = row.FImproper;
				this.locationIntro.address = row.address;
				let seconds = (new Date(row.FStopDateTime)).getTime() - (new Date(row.FStartDateTime)).getTime();
				let minute = seconds / 1000 / 60;
				this.locationIntro.FKeepSeconds = minute.toFixed(0) + "分钟";
			},

			//重置
			resetCondition(){
				$(".search-input").val("");
				this.queryDate = [new Date(new Date().getTime()-1*1000*60*60*24).getFullYear()+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getMonth()+1)+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getDate())+" 00:00:00", new Date(new Date().getTime()-1*1000*60*60*24).getFullYear()+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getMonth()+1)+"-"+(new Date(new Date().getTime()-1*1000*60*60*24).getDate())+" 23:59:59"];
				this.FuelCountInfo = [];
				this.FuelRefuelInfo = [];
				this.FuelImproperInfo = [];
				this.License = "";
				this.carFGUID = "";
				this.pageIndex_FuelCount = 1;
				this.pageIndex_Refuel = 1;
				this.pageIndex_Improper = 1;
				this.pageSize_FuelCount = 20;
				this.pageSize_Refuel = 20;
				this.pageSize_Improper = 20;
				this.FuelCountFTotalCount = 0;
				this.RefuelFTotalCount = 0;
				this.FuelImproperFTotalCount = 0;
				this.editableTabs = [];
				this.activeName = "1";
				this.show_FuelCount = true;
				this.show_FuelRefuel = false;
				this.show_FuelImproper = false;
				this.showChartCollect = false;
				this.show_pagination = true;
				this.$refs.vehicle.$children[1].setCheckedKeys([]);
			},
			//获取车辆信息
			get(data){
				this.License = data[0].join(",");
				this.carFGUID = data[1].join(",");
				$(".search-input").val("_已选_" + data[0].length + "_辆_");
			},
			//查看加油次数
			LookOverFRefuelCount(row){
				this.RefuelCountLicense = row.FVehicleName;
				this.RefuelCountCarFGUID = row.FVehicleGUID;
				this.doRefuelCountQuery();
				this.doChartQuery(row,"other_r");
				this.addRefuelCountTab();
			},
			//查看异常次数
			LookOverFuelImproper(row){
				this.FuelImproperLicense = row.FVehicleName;
				this.FuelImproperCarFGUID = row.FVehicleGUID;
				this.doFuelImproperQuery();
				this.doChartQuery(row,"other_i");
				this.addFuelImproperTab();
			},
			//请求单个车辆加油次数
			doRefuelCountQuery(){
				let _this = this;
				_this.FuelRefuelInfo.length=0;
				let time = this.queryDate;
				let startTime = this.parseUTC(time[0]);
				let endTime = this.parseUTC(time[1]);
				let letFTokenID = this.$store.state.FTokenID;
				//console.log(_this.RefuelCountCarFGUID+","+startTime+","+endTime)
				$.post("web/Combine/Combine_Report", {
					FTokenID: letFTokenID,
					FAction: "QueryFuelRefuelByFVehicleGUID",
					FVehicleGUID: _this.RefuelCountCarFGUID,
					FStartTime: startTime,
					FEndTime: endTime,
					FPageIndex: _this.pageIndex_Refuel,
					FPageSize: _this.pageSize_Refuel,
					FOrderBy: "FRefuel DESC",//FStartDateTime 升序 //FStartDateTime DESC 降序 //FRefuel 升序 //FRefuel DESC降序
					FVersion: "1.0.0"
				}, function (data) {
					//console.log("加油次数",data);
					if (data.FObject.length != 0) {
						_this.RefuelFTotalCount = data.FObject.Table[0].FTotalCount;
                        let tempArr = _this.getUsableData(data.FObject.Table1, "refuel");
                        setTimeout(function(){
                            _this.FuelRefuelInfo = tempArr;
                        },200)
					}

				});
			},
			//请求单个车辆异常次数
			doFuelImproperQuery(){
				let _this = this;
				_this.FuelImproperInfo.length=0;
				let time = this.queryDate;
				let startTime = this.parseUTC(time[0]);
				let endTime = this.parseUTC(time[1]);
				let letFTokenID = this.$store.state.FTokenID;
				$.post("web/Combine/Combine_Report", {
					FTokenID: letFTokenID,
					FAction: "QueryFuelImproperByFVehicleGUID",
					FVehicleGUID: _this.FuelImproperCarFGUID,
					FStartTime: startTime,
					FEndTime: endTime,
					FPageIndex: _this.pageIndex_Improper,
					FPageSize: _this.pageSize_Improper,
					FOrderBy: "FImproper",//FStartDateTime 升序 //FStartDateTime DESC 降序 //FRefuel 升序 //FRefuel DESC降序
					FVersion: "1.0.0"
				}, function (data) {
					//console.log(data);
					if (data.FObject.length != 0) {
						_this.FuelImproperFTotalCount = data.FObject.Table[0].FTotalCount;
						let tempArr = _this.getUsableData(data.FObject.Table1, "improper");
                        setTimeout(function(){
                            _this.FuelImproperInfo = tempArr;
                        },200)
					}
				});
			},
			//请求曲线图数据(稀释过后的)
			doChartQuery(row,type){
				this.CountLicense = row.FVehicleName;
				this.FVehicleGUID_Count=row.FVehicleGUID;
				if(type=="collect"){
					this.addCountTab();
					this.loadingCharts = true;
					this.show_FuelCount = false;
					this.showChartCollect = true;
				}
				let _this = this;
				_this.option.series[0].data.length = 0;
				_this.option.series[1].data.length = 0;
				_this.option.series[2].data.length = 0;
				let time = this.queryDate;
				let startTime = this.parseUTC(time[0]);
				let endTime = this.parseUTC(time[1]);
				let letFTokenID = this.$store.state.FTokenID;
				//console.log(startTime+","+endTime);
				let queryDate = "";
				let middleDate = "";
				if ((startTime.substring(0, 10)).toString() != (endTime.substring(0, 10)).toString()) {
					//console.log(_this.dataScope(startTime.substring(0,10),endTime.substring(0,10)));
					middleDate = _this.dataScope(startTime.substring(0, 10), endTime.substring(0, 10)).join(",") + ",";
				}
				//_this.dataScope(startTime.substring(0,10),endTime.substring(0,10)).join(",")+","
				if (startTime.substring(0, 10) == endTime.substring(0, 10)) {
					queryDate = startTime.substring(0, 10).replace(/-/g, "");
				} else {
					if (middleDate.length == 1) {
						middleDate = "";
					}
					queryDate = (startTime.substring(0, 10)).replace(/-/g, "") + "," + middleDate + (endTime.substring(0, 10)).replace(/-/g, "");
				}
				//console.log(row.FVehicleGUID+","+startTime+","+endTime+","+queryDate);
				console.time("getData");
				$.post("web/FleetManager/FleetManager_LBS", {
					FTokenID: letFTokenID,
					FAction: "QueryFuelTrackDataByFVehicleGUID",
					FVehicleGUID: row.FVehicleGUID,
					FStartTime: startTime,
					FEndTime: endTime,
					FTableDate: queryDate,
					FDataType:"Curves",
					FVersion: "1.0.0"
				}, function (data) {
					if (data.Result == "200") {
						//console.log(data);
						console.timeEnd("getData");
						if (data.FObject.length != 0) {
							console.time("unzip");
							data.FObject = JSON.hunpack(eval(data.FObject), 1);
							_this.tempCountData=data.FObject;
							console.timeEnd("unzip");
							//console.log("油位曲线",data);
							_this.getUsableData(data.FObject, "countChart");
							//_this.option.navigator.xAxis.tickInterval = parseInt((data.FObject.length) / 14);
							//_this.option.xAxis.tickInterval = parseInt((data.FObject.length) / 18);
							console.time("drawCharts");
							_this.option.xAxis.events.afterSetExtremes=_this.afterSetExtremes
							_this.showChartCollectCharts(type);
						} else {
							if(type==="collect"){
								_this.warningDialogMsg("_暂无数据_!", "warning");
							}
							//_this.removeTab("4");
						}
					} else {
						_this.warningDialogMsg("_数据加载错误_!", "warning");
						_this.showChartCollect = false;
					}


				});
			},
//			重置图表
			resetChartCollect(type){
				//console.log(this.tempCountData);
				this.getUsableData(this.tempCountData, "countChart");
				this.showChartCollectCharts(type);
			},
			afterSetExtremes(e){
				let type=e.target.chart.renderTo.id;
				//console.log(e.target.chart.renderTo.id);
				let FVehicleGUID="";
				switch (type){
					case "chartCollect":
						FVehicleGUID=this.FVehicleGUID_Count;
					break;
					case "chartRefuel":
						FVehicleGUID=this.FVehicleGUID_Refuel;
					break;
					case "chartImproper":
						FVehicleGUID=this.FVehicleGUID_Improper;
						break;
				}
				let timeDiff=e.max-e.min;
				if(timeDiff>12*60*60*1000){
					console.log("时间太长了!")
					return false;
				}else {
					let beginDate=this.parseUTC(moment(new Date(e.min)).format("YYYY-MM-DD HH:mm:ss"));
					let endDate=this.parseUTC(moment(new Date(e.max)).format("YYYY-MM-DD HH:mm:ss"));
					//console.log(beginDate,endDate);
					this.doChartNotReduceQuery(beginDate,endDate,FVehicleGUID,type)
				}
			},
//			请求没有经过稀释的油位数据
			doChartNotReduceQuery(beginDate,endDate,FVehicleGUID,type){
				//this.CountLicense = row.FVehicleName;
				if(type=="chartCollect"){
					this.loadingCharts = true;
				}
				let _this = this;
				_this.option.series[0].data.length = 0;
				_this.option.series[1].data.length = 0;
				_this.option.series[2].data.length = 0;
				let startTime = beginDate;
				let endTime = endDate;
				let letFTokenID = this.$store.state.FTokenID;
				//console.log(startTime+","+endTime);
				let queryDate = "";
				let middleDate = "";
				if ((startTime.substring(0, 10)).toString() != (endTime.substring(0, 10)).toString()) {
					//console.log(_this.dataScope(startTime.substring(0,10),endTime.substring(0,10)));
					middleDate = _this.dataScope(startTime.substring(0, 10), endTime.substring(0, 10)).join(",") + ",";
				}
				//_this.dataScope(startTime.substring(0,10),endTime.substring(0,10)).join(",")+","
				if (startTime.substring(0, 10) == endTime.substring(0, 10)) {
					queryDate = startTime.substring(0, 10).replace(/-/g, "");
				} else {
					if (middleDate.length == 1) {
						middleDate = "";
					}
					queryDate = (startTime.substring(0, 10)).replace(/-/g, "") + "," + middleDate + (endTime.substring(0, 10)).replace(/-/g, "");
				}
				//console.log(row.FVehicleGUID+","+startTime+","+endTime+","+queryDate);
				$.post("web/FleetManager/FleetManager_LBS", {
					FTokenID: letFTokenID,
					FAction: "QueryFuelTrackDataByFVehicleGUID",
					FVehicleGUID: FVehicleGUID,
					FStartTime: startTime,
					FEndTime: endTime,
					FTableDate: queryDate,
					FVersion: "1.0.0"
				}, function (data) {
					if (data.Result == "200") {
						//console.log(data);
						if (data.FObject.length != 0) {
							data.FObject = JSON.hunpack(eval(data.FObject), 1);
							//console.log("油位曲线",data);
							_this.getUsableData(data.FObject, "countChart");
							//_this.option.navigator.xAxis.tickInterval = parseInt((data.FObject.length) / 14);
							//_this.option.xAxis.tickInterval = parseInt((data.FObject.length) / 18);
							_this.showChartCollectCharts("collect");
						} else {
							_this.warningDialogMsg("_暂无数据_!", "warning");
							//_this.removeTab("4");
						}
					} else {
						_this.warningDialogMsg("_数据加载错误_!", "warning");
						_this.showChartCollect = false;
					}


				});
			},
			//将查询时间向前后各推15分钟
			addFifteenMinute(type, time){
				if (type == "b") {
					let timeStr = this.GetDateSeconds(time) - (60 * 120);
					return this.transDate(timeStr);
				}
				if (type == "e") {
					let timeStr = this.GetDateSeconds(time) + (60 * 120);
					return this.transDate(timeStr);
				}
			},
			//请求加油/异常消耗次数折线图
			doRefuelAndImproperQuery(row, type){
				//console.log(row);
				if(type=="refuel"){
					this.loadingRefuelCharts=true;
				}else {
					this.loadingImproperCharts=true;
				}
				let _this = this;
				let startTime = this.addFifteenMinute("b", this.parseUTC(row.FStartDateTime));
				let endTime = this.addFifteenMinute("e", this.parseUTC(row.FStopDateTime));
				//console.log(endTime);
				//console.log(this.addFifteenMinute("e",endTime));
				//console.log(startTime+","+endTime);
				let letFTokenID = this.$store.state.FTokenID;
				let queryDate = "";
				let middleDate = "";
				if ((startTime.substring(0, 10)).toString() != (endTime.substring(0, 10)).toString()) {
					middleDate = _this.dataScope(startTime.substring(0, 10), endTime.substring(0, 10)).join(",") + ",";
				}
				//_this.dataScope(startTime.substring(0,10),endTime.substring(0,10)).join(",")+","
				if (startTime.substring(0, 10) == endTime.substring(0, 10)) {
					queryDate = startTime.substring(0, 10).replace(/-/g, "");
				} else {
					if (middleDate.length == 1) {
						middleDate = "";
					}
					queryDate = (startTime.substring(0, 10)).replace(/-/g, "") + "," + middleDate + (endTime.substring(0, 10)).replace(/-/g, "");
				}
				//console.log(row.FVehicleGUID+","+startTime+","+endTime+","+queryDate);
				$.post("web/FleetManager/FleetManager_LBS", {
					FTokenID: letFTokenID,
					FAction: "QueryFuelTrackDataByFVehicleGUID",
					FVehicleGUID: row.FVehicleGUID,
					FStartTime: startTime,
					FEndTime: endTime,
					FTableDate: queryDate,
					//FDataType:"Curves",
					FVersion: "1.0.0"
				}, function (data) {
					//console.log(data);
					if (data.Result == "200") {
						if (data.FObject.length != 0) {
							data.FObject = JSON.hunpack(eval(data.FObject), 1);
							//console.log(data);
							if (type == "refuel") {
								_this.getUsableData(data.FObject, "refuelchart");
								_this.showChartCollectCharts("refuel");
								_this.loadingRefuelCharts=false;
							} else if (type == "improper") {
								_this.getUsableData(data.FObject, "improperchart");
								_this.showChartCollectCharts("improper");
								_this.loadingImproperCharts=false;
							}
						} else {
							_this.warningDialogMsg("_暂无数据_!", "warning");
						}
					} else {
						_this.warningDialogMsg("_暂无数据_!", "warning");
					}


				});
			},
			//汇总折线图
			showChartCollectCharts(type){
				let _this = this;
				switch (type){
					case "collect"://汇总曲线
						_this.showChartCollect = true;
						HighChart.chart("chartCollect", _this.option);
						this.loadingCharts = false;
						console.timeEnd("drawCharts");
					break;
					case "refuel"://加油曲线
						HighChart.chart("chartRefuel", _this.RefuelOption);
					break;
					case "improper"://异常曲线
						HighChart.chart("chartImproper", _this.ImproperOption);
					break;
					case "other_r"://跳转到加油次数,显示稀释过后的这个时间段的曲线
						HighChart.chart("chartRefuel", _this.option);
					break;
					case "other_i"://跳转到异常次数,显示稀释过后的这个时间段的曲线
						HighChart.chart("chartImproper", _this.option);
					break;
				}


			},
			//加油次数折线图
//			showChartRefuel(){
//				let _this = this;
//				window.setTimeout(function () {
////					HighChart.chart("chartRefuel", _this.RefuelOption);
//					HighChart.chart("chartRefuel", _this.option);
//				}, 200)
//			},
//			showChartImproper(){
//				let _this = this;
//				window.setTimeout(function () {
////					HighChart.chart("chartImproper", _this.ImproperOption);
//					HighChart.chart("chartImproper", _this.option);
//				}, 200)
//			},
			//获取开始时间和结束时间之间的日期
			dataScope(value1, value2){
				var getDate = function (str) {
					var tempDate = new Date();
					var list = str.split("-");
					tempDate.setFullYear(list[0]);
					tempDate.setMonth(list[1] - 1);
					tempDate.setDate(list[2]);
					return tempDate;
				}
				var date1 = getDate(value1);
				var date2 = getDate(value2);
				if (date1 > date2) {
					var tempDate = date1;
					date1 = date2;
					date2 = tempDate;
				}
				date1.setDate(date1.getDate() + 1);
				var dateArr = [];
				var i = 0;
				while (!(date1.getFullYear() == date2.getFullYear()
				&& date1.getMonth() == date2.getMonth() && date1.getDate() == date2
					.getDate())) {
					var dayStr = date1.getDate().toString();
					var monthStr = (date1.getMonth() + 1).toString();
					if (dayStr.length == 1) {
						dayStr = "0" + dayStr;
					}
					if (monthStr.length == 1) {
						monthStr = "0" + monthStr;
					}
					dateArr[i] = date1.getFullYear() + "" + monthStr + ""
						+ dayStr;
					i++;
					date1.setDate(date1.getDate() + 1);
				}
				//console.log(dateArr);
				return dateArr;
			},
//			初始化图表
			initCharts(type){
				switch (type){
					case "refuelchart":
						this.RefuelOption.series[0].data.length=0;
						this.RefuelOption.series[1].data.length=0;
						this.RefuelOption.series[2].data.length=0;
					break;
					case "improperchart":
						this.ImproperOption.series[0].data.length=0;
						this.ImproperOption.series[1].data.length=0;
						this.ImproperOption.series[2].data.length=0;
					break;
					case "countChart":
						this.option.series[0].data.length=0;
						this.option.series[1].data.length=0;
						this.option.series[2].data.length=0;
					break;
				}
			},
			//优化显示数据
			getUsableData(arr, type){
				//console.log(arr);
				this.initCharts(type);
				let result = arr;
//				let myGeo = new BMap.Geocoder();
				for (let i = 0; i < result.length; i++) {

					if (type == "countChart"){//汇总曲线图
						let t=this.getUTCTime(result[i].FGPSDateTime);
						this.option.series[0].data.push([t, Number(result[i].FFuelValue1)]);
						this.option.series[1].data.push([t, result[i].FMileage]);
						this.option.series[2].data.push([t, result[i].FSpeed]);
					} else if (type == "count") {//汇总
						//result[i].FRefuelSum = result[i].FRefuelSum + " _升_";
						//result[i].FImproperSum = result[i].FImproperSum + " _升_";
						//result[i].FRunFuelSum = result[i].FRunFuelSum + " _升_";
					} else if (type == "refuel") {//加油次数
						//result[i].FStartDateTime=result[i].FStartDateTime.replace(/T/g, " ");
						result[i].FStartDateTime = this.parseGMT(result[i].FStartDateTime);
						result[i].FStopDateTime = this.parseGMT(result[i].FStopDateTime);
						//result[i].FStartLiter = result[i].FStartLiter + " _升_";
						//result[i].FStopLiter = result[i].FStopLiter + " _升_";
						//result[i].FRefuel = result[i].FRefuel + " _升_";
					} else if (type == "improper") {//异常次数
						result[i].FStartDateTime = this.parseGMT(result[i].FStartDateTime);
						result[i].FStopDateTime = this.parseGMT(result[i].FStopDateTime);
						//result[i].FStartLiter = result[i].FStartLiter + " _升_";
						//result[i].FStopLiter = result[i].FStopLiter + " _升_";
						//result[i].FImproper = result[i].FImproper + " _升_";
					} else if (type == "refuelchart") {//加油曲线图
						let t=this.getUTCTime(result[i].FGPSDateTime);
						this.RefuelOption.series[0].data.push([t,Number(result[i].FFuelValue1)]);
						this.RefuelOption.series[1].data.push([t, result[i].FMileage]);
						this.RefuelOption.series[2].data.push([t, result[i].FSpeed]);
					} else if (type == "improperchart") {//异常曲线图
						let t=this.getUTCTime(result[i].FGPSDateTime);
						this.ImproperOption.series[0].data.push([t,Number(result[i].FFuelValue1)]);
						this.ImproperOption.series[1].data.push([t, result[i].FMileage]);
						this.ImproperOption.series[2].data.push([t, result[i].FSpeed]);
					}
					//解析地址
					if (type != "count" && type != "improperchart" && type != "countChart" && type != "refuelchart") {
						if (result[i].FLatitude != "" || result[i].FLongitude != undefined) {
							let pointObj = {lat: result[i].FLatitude, lng: result[i].FLongitude};
							let point = this.parsePoint(this.$store.state.globalMapType, pointObj);
							this.geocoder(this.$store.state.globalMapType, point, result[i], "address");
						}
					}
				}
				//console.log(result);
				return result;
			},
			//添加图表标签页
			addCountTab(){
				if (this.isRepetition("4")) {
					this.editableTabs.push({
						title: this.CountLicense + "-_油位曲线_",
						name: "4",
						content: ""
					});
				} else {
					for (let i = 0; i < this.editableTabs.length; i++) {
						if (this.editableTabs[i].name == "4") {
							this.editableTabs[i].title = this.CountLicense + "-_油位曲线_";
						}
					}
				}


				this.activeName = "4";
				this.switchoverTable(this.activeName);
			},
			//添加单辆车加油次数标签页
			addRefuelCountTab(){
				if (this.isRepetition("2")) {
					this.editableTabs.push({
						title: this.RefuelCountLicense + "-_加油_",
						name: "2",
						content: ""
					});
				} else {
					for (let i = 0; i < this.editableTabs.length; i++) {
						if (this.editableTabs[i].name == "2") {
							this.editableTabs[i].title = this.RefuelCountLicense + "-_加油_";
						}
					}
				}


				this.activeName = "2";
				this.switchoverTable(this.activeName);
			},
			//添加单辆车异常次数标签页
			addFuelImproperTab(){
				if (this.isRepetition("3")) {
					this.editableTabs.push({
						title: this.FuelImproperLicense + "-_异常消耗_",
						name: "3",
						content: ""
					});
				} else {
					for (let i = 0; i < this.editableTabs.length; i++) {
						if (this.editableTabs[i].name == "3") {
							this.editableTabs[i].title = this.FuelImproperLicense + "-_异常消耗_";
						}
					}
				}
				this.activeName = "3";
				this.switchoverTable(this.activeName);
			},
			isRepetition(id){
				//console.log(this.editableTabs);
				if (this.editableTabs.length == 0) {
					return true;
				} else {
					for (let i = 0; i < this.editableTabs.length; i++) {
						//console.log(this.editableTabs[i].name+","+id);
						if (this.editableTabs[i].name == id) {
							return false;
						} else {
							//console.log(i+","+this.editableTabs.length);
							if (i == this.editableTabs.length - 1) {
								return true;
							}
						}
					}
				}

			},
			//移除tab
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.activeName;
				for (let i = 0; i < tabs.length; i++) {
					if (tabs[i].name == targetName) {
						tabs.splice(i, 1);
					}
				}
				if(targetName=="4"){this.adjustPage(1)};
				this.switchoverTable("1");
				this.activeName = "1";
				this.show_FuelCount = true;
			},
			//切换tab
			switchoverTable(activeName){
				//let name=tab.name;
                //console.log(activeName);
				switch (activeName) {
					case "1":
						this.show_FuelCount = true;
						this.show_FuelRefuel = false;
						this.show_FuelImproper = false;
						this.showChartCollect = false;
						this.show_pagination = true;
						this.loadingCharts = false;
						break;
					case "2":
						this.show_FuelCount = false;
						this.show_FuelRefuel = true;
						this.show_FuelImproper = false;
						this.showChartCollect = false;
						this.show_pagination = true;
						this.loadingCharts = false;
                        this.isShowRefuel=true;
                        this.isShowImproper=false;
						break;
					case "3":
						this.show_FuelCount = false;
						this.show_FuelRefuel = false;
						this.show_FuelImproper = true;
						this.showChartCollect = false;
						this.show_pagination = true;
						this.loadingCharts = false;
                        this.isShowRefuel=false;
                        this.isShowImproper=true;
						break;
					case "4":
						this.show_FuelCount = false;
						this.show_FuelRefuel = false;
						this.show_FuelImproper = false;
						this.showChartCollect = true;
						this.show_pagination = false;
						this.loadingCharts = false;
						break;
				}
			},
			switchoverTab(tab){
				let name = tab.name;
				this.switchoverTable(name);
			},
			datelimit(date1, date2, limit){
				var a = date1.substr(5, 2);
				var b = date1.substr(8, 2);
				var c = date1.substr(0, 4);
				var a2 = date2.substr(5, 2);
				var b2 = date2.substr(8, 2);
				var c2 = date2.substr(0, 4);
				//alert(date1 + "__" + date2 + "\n\n" + c + "__" + a + "__" + b + "\n\n" + c2 + "__" + a2 + "__" + b2);
				if (c === c2) {
					if (a == a2 && b >= b2) {
						if (Number(b) - Number(b2) <= limit) {
							//alert(Number(b) + "-" + Number(b2) + "=" + (Number(b) - Number(b2)));
							return true;
						}
					} else if (Number(a) - Number(a2) == 1) {
						//alert(Number(a) + "-" + Number(a2) + "=" + (Number(a) - Number(a2)));
						if (30 + Number(b) - Number(b2) <= limit) {
							return true;
						}
					}
				} else if (c - c2 === 1) {
					if ((Number(a) == 1) && (Number(a2) == 12)) {
						if (30 + Number(b) - Number(b2) <= limit) {
							return true;
						}
					}
				} else if (c2 - c === 1) {
					if ((Number(a2) == 1) && (Number(a) == 12)) {
						if (30 + Number(b2) - Number(b) <= limit) {
							return true;
						}
					}
				}
				return false;
			},
		},
		components: {
			baiduMap,
			VehicalSelectDialog
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			}
		},

	}
</script>
<style scoped>
	.img_chart {
		display:inline-block;
		width:16px;
		height:16px;
		background-image:url(/static/img/img_chart.png);
		background-repeat:no-repeat;
	}

	.img_refuel {
		display:inline-block;
		width:16px;
		height:16px;
		background-image:url(/static/img/refuel.png);
		background-repeat:no-repeat;
	}

	.img_fuel_abnormal {
		display:inline-block;
		width:16px;
		height:16px;
		background-image:url(/static/img/fuel_abnormal.png);
		background-repeat:no-repeat;
	}

	.img_track {
		display:inline-block;
		width:16px;
		height:16px;
		background-image:url(/static/img/img_track.png);
		background-repeat:no-repeat;
	}

	.block {
		float:left;
		margin-left:20px;
	}

	.block:nth-child(1) {
		margin-left:0;
	}


	.search-input-wrap {
		float:left;
		margin:9px 0 0 10px;
	}

	.search-input {
		float:left;
		width:120px;
		height:28px;
		border:1px solid #e6e6e6;
	}

	.operatExp {
		float:left;
		font-size:12px;
	}

	.get-carList-dialog {
		float:left;
		display:flex;
		justify-content:center;
		align-items:center;
		width:28px;
		height:28px;
		border:1px solid #e6e6e6;
		border-right:none;
		text-align:center;
	}

	/*按钮样式 可用于全局 也可单独用在组件，主要看以后表格内的按钮怎么命名*/
	/*.el-button不能全局可能有些报表内部会用到饿了么的按钮组件*/
	.el-button {
		border:none;
		border-radius:0;
		padding:8px 26px;
		font-size:12px;
	}

	.search {
		background-color:#005fc6;
	}

	.reset {
		background-color:#547ca9;
	}

	.export {
		background-color:#4aae58;
		padding:8px 16px;
	}

	button.cancel {
		background-color:transparent;
	}

	.read {
		background-color:#f39b2a;
		padding:8px 16px;
	}

	/*fontawesome 里面字体图标的样式*/
	.fa-share-square-o {
		margin-right:3px;
	}

	.fa-envelope-open-o {
		margin-right:3px;
	}

	.el-dialog__body {
		height:600px;
	}

	#chartCollect {
		height:450px;
	}

	.mapModal {
		position:absolute;
		height:245px;
		width:300px;
		margin-top:-245px;
		z-index:10;
		right:0px;
		background:white;
		border:1px solid #cccccc
	}

	.mapModal p {
		font-size:12px;
		margin-bottom:6px;
	}

	.mapModal p span {
		font-weight:bold;
	}
	.el-time-panel {
		width:180px !important;
	}
	#chartCollect {
		position:relative;
	}
	.resetChartCollect {
		position:fixed;
		right:8%;
		top:190px;
		border:none;
		outline:none;
		padding:4px 12px;
	}
</style>
<style>
	.oilWearDateSelect .el-time-spinner__list::before {
		height:75px;
	}
	.oilWearDateSelect .el-scrollbar__wrap {
		margin-right:-11px !important;
	}

	.oilWearDateSelect .el-button--text {
		background-color: #ccc;
		color: #fff;
	}
	.oilWearDateSelect .el-button--default {
		background-color: #409EFF;
		color: #fff;
	}

	.oilWearDateSelect .el-button.is-plain:hover {
		background-color: #409EFF;
		color: #fff;
	}
	#OilWear .el-dialog__body {
		max-height:500px;
		height:500px;
		padding:20px 0 0;
	}

	#OilWear .el-dialog__header {
		background-color:#fff;
	}

	#OilWear .el-table__body .el-button {
		padding:8px 0 0;
	}
</style>
<!--
<style>
	/*DatePicker 饿了么选择时间插件(后期可放入main.css)*/
	.el-date-editor .el-input__icon {
		left:0;
	}

	.el-date-editor .el-input__inner {
		padding-left:35px;
		border-radius:0;
		border-color:#e6e6e6;
		margin-left:10px;
	}

	.el-date-editor&#45;&#45;daterange .el-input__icon + .el-input__inner {
		padding-right:10px;
		height:28px;
		width:195px;
		line-height:28px;
		font-size:12px;
	}

	.el-date-editor&#45;&#45;datetimerange .el-input__icon + .el-input__inner {
		width:325px;
		padding-right:10px;
	}

	/*el-tabs 选项卡(后期可放入main.css)*/
	.el-tabs__header {
		margin:0;
	}

	.el-tabs__active-bar {
		background-color:#005fc6;
	}

	.el-tabs__item {
		height:36px;
		line-height:36px;
	}

	.el-tabs__nav-wrap {
		background-color:#fff;
	}

	.el-tabs__item.is-active {
		color:#333;
	}

	label.el-checkbox {
		margin-bottom:0;
	}
</style>
-->

