
<template>
	<section style="height: 100%">
		<vehical-list v-on:child="get"></vehical-list>
		<div id="operate_wrapper">
			<div class="box-header">
				<div class="block">
					<span class="operatExp" v-if="SystemID===1||SystemID===4">_选择车辆_</span>
					<span class="operatExp" v-else>_选择设备_</span>
					<div class="search-input-wrap" data-toggle="modal" data-target="#modal"><!---->
						<a href="javascript:;" class="get-carList-dialog">
							<i class="img-icon icon-carList-dialog"  v-if="SystemID===1||SystemID===4"></i>
							<i class="fa fa-lock" v-else style="font-size: 18px;"></i>
						</a>
						<input type="text" class="search-input">
					</div>
				</div>
				<div class="block">
					<span class="operatExp">_选择时间_</span>
					<el-date-picker
						v-model="value2"
						size="small"
						align="right"
						:clearable="false"
						@change="getTime"
						type="date"
						placeholder="_选择日期_"
						:picker-options="pickerOptions1">
					</el-date-picker>
					<!--<el-date-picker-->
					<!--size="small"-->
					<!--v-model="value2"-->
					<!--:clearable="false"-->
					<!--@change="getTime"-->
					<!--type="daterange"-->
					<!--:picker-options="pickerOptions2"-->
					<!--placeholder="_选择时间范围_">-->
					<!--</el-date-picker>-->
				</div>
				<div class="btnList">
					<el-button type="primary" class="search" @click="doQuery">_查询_</el-button>
					<el-button type="primary" class="reset" @click="reset">_重置_</el-button>
					<el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>_导出文件_</el-button>
				</div>
				<div style="float: right;margin-right: 10px">
					<el-radio class="radio"  v-model="radio" label="1" style="margin: 0px">_温度曲线_</el-radio>
					<el-radio class="radio"  v-model="radio" label="2" style="margin: 0px">_历史轨迹_</el-radio>
				</div>
			</div>
		</div>
		<div class="el_table_wrap" id="el_table_wrap" style="position: relative">
			<el-table
				:data="table"
				v-loading="loading"
				element-loading-text="_拼命加载中_"
				empty-text="_暂无数据_"
				stripe
				:height="table_height"
				style="width:100%">
				<el-table-column
					type="index"
					align="center"
					label="_序号_"
					width="120">
				</el-table-column>
				<el-table-column
					prop="time"
					label="_最后更新时间_"
					align="center"
					width="160">
				</el-table-column>
				<el-table-column
					min-width="800"
					header-align="left"
					class-name="header-left"
					align="left"
					:label="vehicleName">
					<template scope="scope">
						<ul>
							<li class="humiture" v-for="(value, key) in table[scope.$index].group" v-show="value[0]!=null">
								<i class="tire">{{key}}</i>
								<span class="humitureTxt">{{value[0]}}&nbsp;℃</span>
								<span class="humitureTxt">{{value[1]}}&nbsp;%</span>
							</li>
						</ul>
					</template>
				</el-table-column>

			</el-table>
			<button type="button" @click="showPosition" class="btn btn-warning btn-sm showPosition">_设备位置图_</button>
			<transition
				name="slide-fade"
				enter-active-class="bounce-enter-active"
				leave-active-class="bounce-leave-active">
				<div v-if="isShowPositionImg" class="positionImg"></div>
			</transition>
			<!-- /.modal-content -->
			<div class="mymodalCommon mymodal1" v-show="radio==1" :class="{'chartModal':!fullScreen,'fullScreen':fullScreen}">
				<div class="modal-header">
					<div style="float: right">
						<button
							type="button" @click="open"
							class="btn-white btn-custom" style="width: 60px"><i
							class="fa fa-arrows-alt  padding-r-8"></i>{{word}}
						</button>
						<button type="button" @click="closeMymodal" class="closeMymodalBtn" >
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</div>
				</div>
				<div class="tireChart" id="tireChart"></div>
			</div>
			<!-- /.modal-content -->
			<div class="mymodalCommon mymodal2" :class="{'show':radio==2,'chartModal':!fullScreen1,'fullScreen':fullScreen1}" >
				<div class="modal-header" >
					<div style="float: right">
						<button
							type="button" @click="open"
							class="btn-white btn-custom" style="width: 60px"><i
							class="fa fa-arrows-alt  padding-r-8"></i>{{word1}}
						</button>
						<button type="button" @click="closeMymodal" class="closeMymodalBtn">
							<span class="glyphicon glyphicon-remove" ></span>
						</button>
					</div>
				</div>
				<div class="modal-body"  style="padding: 0px">
					<baidu-map ref="map" :fa-data="[mapToolShow]"></baidu-map>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
	import HighChart from 'highcharts/highstock'
	import baiduMap from 'components/Common/baidu_map.vue'
	import VehicalList from 'components/dialog/vehicalList.vue'
	let _this=null
	export default {
		data() {
			_this=this
			return{
				isShowPositionImg:false,
				value2:new Date(),
				radio: '',
				fullScreen:false,
				fullScreen1:false,
				pickerOptions1: {
					shortcuts: [{
						text: '_今天_',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '_昨天_',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '_前天_',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
							picker.$emit('pick', date);
						}
					}]
				},
				loading: false,
				value4: [new Date(),new Date()],
				value3: '',
				Area:"深圳",
				mapToolShow:false,
				table:null,
				table_height:null,
				tireOption:{
					chart:{
						type: 'spline',
						zoomType: 'x',
						resetZoomButton:{
							position: {
								align: "right",
								verticalAlign: "top",
								x: 0,
								y: -40,
							}
						}
					},
					plotOptions: {
						spline: {
							marker: {
								enabled: false
							},
							connectNulls: true
						}
					},
					scrollbar: {
						enabled:true,
						barBackgroundColor:"#2885eb",
						liveRedraw:false,
						showFull:false
					},

					title: {
						text: '_温度曲线_',
					},
					xAxis: {
						type: 'datetime',
						lable:''
					},
					yAxis: {
						softMax:30,
						softMin:-30,
						allowDecimals: false,
						title: {
							text: '_温度_ (℃)',
							margin:-45,
							align:"high",
							y:-20,
							rotation:0
						},
						lineColor: "#d7d7d7",
						lineWidth: 1
					},
					tooltip: {
						dateTimeLabelFormats: {
							minute: '%Y-%m-%d %H:%M',
						},
						formatter:function(){
							//console.log(this);
							let time=moment(this.x).format("YYYY-MM-DD HH:mm:ss");
							let len=this.points.length;
							let str="<span>"+time+"</span><br>";
							for (let i = 0; i < len; i++) {
								str+="<span>"+this.points[i].series.name+"：</span>"+this.points[i].y+"℃<br>";

							}
							//return "<span>"+time+"</span><br><span>_传感器_1：</span>"+this.points[0].y+"℃<br><span>_传感器_2：</span>"+this.points[1].y+"℃<br><span>_传感器_3：</span>"+this.points[2].y+"℃<br><span>_传感器_4：</span>"+this.points[3].y+"℃";
							return str;
						},
						borderColor: 'black',
						shared: true,
						crosshairs: [{            // 设置准星线样式
							width: 1,
							color: '#d8e63c'
						}],
					},
					credits: {
						enabled: false
					},
					legend: {
						verticalAlign: 'top',
						borderWidth: 0,
						y:15
					},
					series:''
				},
				vehicleName:"_温湿度_"
			}
		},
		mounted(){
			HighChart.setOptions({
				lang: {
					resetZoom: '_重置_'
				},
				global: { useUTC: false }
			});
			//加载地图
			setTimeout(function () {
				_this.adjustPage();
				_this.$refs.map.initMap();

			},100)
//      this.handler();
		},
		props: {
			screenHeight: Number
		},
		computed: {
			word:function () {
				if(this.fullScreen){
					return "_还原_"
				}else {
					return "_全屏_"
				}
			},
			word1:function () {
				if(this.fullScreen1){
					return "_还原_"
				}else {
					return "_全屏_"
				}
			},
			SystemID:{//系统ID
				get(){
					return this.$store.state.choiceSystemID;
				}
			},
		},
		watch:{
			screenHeight () {
				this.adjustPage();
			},
			radio () {
				if(this.table ==null||this.table.length == 0){
					this.radio='';
					this.$message({
						showClose: true,
						message: '_获取数据后方能查看_',
						type: 'warning'
					});
				}
			}
		},
		methods:{
			get:function (data) {
				if (data[0] !== undefined&&data[1] !== undefined) {
				$('.search-input').val(data[0]);
				$('.search-input').attr('title',data[0])
				$('.search-input').attr('fguid',data[1])          
				}
			},
			adjustPage(){
				$("#map-wrapper").height(400);
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper",'',true)+15;
			},
			getTime:function (value) {
				return this.value3=value;

			},
			reset:function () {
				$('.search-input').val('');
				$('.search-input').removeAttr('fguid')
				this.value2=new Date();
			},
			doQuery:function () {
				this.isShowPositionImg=false;
				this.closeMymodal();
				this.table=[];
				this.tireOption.series=[
					{
						name:'_传感器_1',
						data:[]
					},
					{
						name:'_传感器_2',
						data:[]
					},
					{
						name:'_传感器_3',
						data:[]
					},
					{
						name:'_传感器_4',
						data:[]
					}
					//{
					//	name:'_传感器_E',
					//	data:[]
					//},
					//{
					//	name:'_传感器_F',
					//	data:[]
					//}
				];
				//this.tireOption.xAxis.categories=[];
				this.vehicleName="_温湿度_"; //记录车牌号

				var FVehicleID = $(".search-input").attr("fguid");
				var startTime;
				var endTime;
				var tableDay;
				var year=new Date().getFullYear();
				var month=new Date().getMonth()+1;
				var date=new Date().getDate();
				if (month < 10) {
					month = "0" + month;
				}
				if (date< 10) {
					date = "0" + date;
				}
				var today=year+'-'+month+'-'+date;
				if(this.value3==''){
					startTime=this.parseUTC(today+' 00:00:00');
					endTime=this.parseUTC(today+' 23:59:59');
					tableDay=today.replace(/-/g,'');
				}else {
					tableDay = moment(this.value3).format("YYYY-MM-DD").replace(/-/g, '');
					startTime = this.parseUTC(moment(this.value3).format("YYYY-MM-DD") + ' 00:00:00');
					endTime = this.parseUTC(moment(this.value3).format("YYYY-MM-DD") + ' 23:59:59');
				}
				if ( FVehicleID!=undefined){
					this.loading=true;
					let postData={
						FTokenID:_this.$store.state.FTokenID,
						FAction:"QueryTrackExTemperatureListByFVehicleGUID",
						FVehicleGUID:FVehicleID,
						FStartTime:startTime,
						FEndTime:endTime,
						FTableDate:tableDay,
						FVersion:"1.0.0"
					};

					$.ajax({
						'url': '/web/Combine/Combine_Report',
						'cache': false,
						'async': true,
						'type': 'Post',
						'dataType': 'json',
						'contentType': 'application/json;charset=utf-8',
						'data': JSON.stringify(postData),
						success: async function (data) {
							console.log(data);
							if (data.Result == 104) {
								_this.$message({
									showClose: true,
									message: '_登录超时_,_五秒后跳转到登录页面_',
									type: 'warning'
								});
								setTimeout(function () {
									_this.$store.commit("goLogin");
								}, 5000)
								return
							}
							let allData = [];
							let order = []; //记录设备id顺序
							let assetCount = 4; //设备数量
							let timeArr = [];
							_this.loading = false;
							if (data.FObject.length == 0) {
								return
							}
							await new Promise(resove => {
								$.post('/web/Common/Common_Admin', {
								FTokenID: _this.$store.state.FTokenID,
								FAction: "QueryAdminAssetByFVehicleGUID",
								FVehicleGUID: FVehicleID,
								FVersion: "1.0.0"
							}, function (res) {
								console.log(res);
								for (let i = 1; i <= assetCount; i++) {
									if (res.FObject[0]['FSensorID' + i] != null) {
										order.push(res.FObject[0]['FSensorID' + i])
									}
								}
								resove();
							})
						})
							;
							data.FObject = JSON.hunpack(eval(data.FObject), 4)
							let fobj = data.FObject;
							if (fobj.length == 0) {
								_this.$message({
									showClose: true,
									message: '_未查询到数据_',
									type: 'warning'
								});
								return
							}
							_this.showPosition();
							$.each(fobj, function (index, obj) {
								//过滤多余数据
								if (order.indexOf(obj.FSensorID1) == -1) return;
								let timeItem = moment(_this.parseGMT(obj.FGPSDateTime)).format("YYYY-MM-DD HH:mm");

								if (timeArr.indexOf(timeItem) == -1) timeArr.push(timeItem);
								if(_this.vehicleName) obj.FVehicleName + ":_温湿度_";
								let oneData = {
									index: timeArr.indexOf(timeItem),
									id: null,
									temperature: null,
									humidity1: null
								};

								let alphaCode = null;
								for (let j = 0; j < order.length; j++) {
									let orderItem = order[j];
									if (orderItem == obj.FSensorID1) {
										switch (j) {
											case 0:
												alphaCode = "1";
												break;
											case 1:
												alphaCode = "2";
												break;
											case 2:
												alphaCode = "3";
												break;
											case 3:
												alphaCode = "4";
												break;
											case 4:
												alphaCode = "5";
												break;
											case 5:
												alphaCode = "6";
												break;
										};
										break
									}

								}

								oneData.id = alphaCode;
								oneData.temperature =Number(obj.FTemperature1.toFixed(1)) ;
								oneData.humidity1 = obj.FHumidity1;
								allData.push(oneData);
							});
							console.log(order);
							timeArr.map(function (item, index) {
								let tableItem = {
									time: item,
									group: {
										1: [null, null],
										2: [null, null],
										3: [null, null],
										4: [null, null]
									}
								}

								_this.table.push(tableItem)

							})
							allData.map(function (item, index) {

								_this.table[item.index].group[item.id][0] = item.temperature;
								_this.table[item.index].group[item.id][1] = item.humidity1;

							})

							_this.table.map(function (item, index) {

								//_this.tireOption.xAxis.categories.push(item.time.split(" ")[1]);
								let n = 0;
								for (let key in item.group) {
									let arr = [];
									arr.push(new Date(item.time).valueOf());
									arr.push(item.group[key][0])
									_this.tireOption.series[n].data.push(arr);
									n++
								}

							})

							console.log(_this.tireOption)
							HighChart.chart('tireChart', _this.tireOption);
							_this.showHistory(fobj);

						},
						error: function () {
							console.log('请求失败')
						}
					})
				}else if(FVehicleID==undefined){
					this.$message({
						showClose: true,
						message: (_this.SystemID===1||_this.SystemID===4)?'_请选择车辆_/_箱号_':'_请选择设备_',
						type: 'warning'
					});
				}
			},
			//绘制轨迹
			showHistory:function (data) {

				let points=[];
				var carData=data;
				for (var i = 0; i < carData.length; i++) {
					let lon=null,
						lat=null;
					if(carData[i].FLongitude==0 && carData[i].FLatitude==0){

						if(carData[i-1] && carData[i-1].FLongitude!=0 && carData[i-1].FLatitude!=0){
                   			let point=_this.parsePointBD(new BMap.Point(carData[i - 1].FLongitude,carData[i - 1].FLatitude));
              				points.push(new BMap.Point(point.lng,point.lat));

						}
						else if(carData[i+1] && carData[i+1].FLongitude!=0 && carData[i+1].FLatitude!=0){
              				let point=_this.parsePointBD(new BMap.Point(carData[i + 1].FLongitude,carData[i + 1].FLatitude));
              				points.push(new BMap.Point(point.lng,point.lat));

						}


					}else {
						 let point=_this.parsePointBD(new BMap.Point(carData[i].FLongitude,carData[i].FLatitude));
						 points.push(new BMap.Point(point.lng,point.lat));
					}

				}


				_this.$refs.map.showCarRoute([],points);
			},
			getCarPoint(data){
				let gpsPoint = {lon: data.FLongitude, lat: data.FLatitude};
				if (data.FLongitude >= 1 && data.FLatitude >= 1) {
					gpsPoint = this.fixGPSPoint(parseFloat(data.FLatitude),parseFloat(data.FLongitude));
				}
				return gpsPoint;
			},

			//全屏
			open:function () {
				if(this.radio==1){
					this.fullScreen=!this.fullScreen;
					if(this.fullScreen){
						$(".el_table_wrap").css("padding-left",'0px');
						$(".mymodal1").width("100%");
						$(".mymodal1").height(this.table_height);
						HighChart.chart('tireChart',this.tireOption);
					}else {
						$(".mymodal1").width("800");
						$(".mymodal1").height("400");
						HighChart.chart('tireChart',this.tireOption);
					}
				}else if(this.radio==2){
					this.fullScreen1=!this.fullScreen1;
					if(this.fullScreen1){
						$(".el_table_wrap").css("padding-left",'0px');
						$(".mymodal2").width("100%");
						$(".mymodal2").height(this.table_height);
						$("#map-wrapper").height(this.table_height);
					}else {
						$(".mymodal2").width("800");
						$(".mymodal2").height("400");
						$("#map-wrapper").height(400);
					}
				}
			},
			closeMymodal:function () {
				this.radio=''
			},
			//显示设备图
			showPosition(){
				let timeout=null;
				_this.isShowPositionImg=true;
				clearTimeout(timeout);
				timeout=setTimeout(function(){
					_this.isShowPositionImg=false;
				},3000)
			}
		},
		components:{
			baiduMap,
			VehicalList
//      BaiduMap
//      BootPage
		}
	}
</script>
<style>
	.header-left div{
		text-align:left!important;
	}

	.el-table__empty-block{
		width:100% !important;
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
		line-height: 28px;
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
	.chartContainer{
		width: 100%;
		height: 400px;
		padding-right: 14px;
		background: #ffffff;
	}
	.tireChart{
		height: 100%;
		width: 100%;
	}
	.mapcontainer{
		width: 30%;
		height: 100%;
		float: right;
		visibility: hidden;
	}
	.tire{
		display: inline-block;
		width: 16px;
		height: 16px;
		line-height:16px;
		border-radius:3px;
		margin-right: 4px;
		text-align:center;
		background-color:#c0dbf9;
		color:#506ef7;
	}
	.mymodalCommon{
		position: absolute;
		z-index:999;
		display:block;
		border: 1px solid #ccc;
		visibility:hidden;
	}
	.mymodalCommon .modal-header{
		position: absolute;
		top:1px;
		right: 0;
		z-index:1;
		padding:0;
		height:21px;
		background:#fff;
	}
	.chartModal{
		height: 400px;
		width:800px;
		top:50%;
		left: 50%;
		margin-left:-400px;
		margin-top: -200px;
	}
	.fullScreen{
		top:0;
		width:100%;
	}
	.mymodal1,.show{
		visibility:visible;
	}
	.closeMymodalBtn{
		height: 20px;
		width: 20px;
		border: none;
		font-size:14px;
		background:#fff;
	}
	.humiture{
		display:inline-block;
	}
	.humitureTxt{
		display:inline-block;
		min-width:60px
	}
	.showPosition{
		position:absolute;
		top:1px;
		right:0;

	}
	.positionImg{
		position:absolute;
		top:50%;
		left:50%;
		width:600px;
		height:250px;
		margin-left:-300px;
		margin-top:-125px;
		background:url("/static/img/position-tem.png") no-repeat;
		background-size:cover;
	}

	.bounce-enter-active {
		animation: bounce-in .5s;
	}
	.bounce-leave-active {
		animation: bounce-out .5s;
	}
	@keyframes bounce-in {
		0%   {transform: translateX(-600px)}
		100% {transform: translateX(0)}
	}
	@keyframes bounce-out {
		0%  {transform: translateX(0)}
		100%{transform: translateX(1000px)}
	}



</style>
