<template>
	<section style="height: 100%">
		<vehical-list v-on:child="get"></vehical-list>
		<div id="operate_wrapper">
			<div class="box-header">
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
					<el-radio class="radio" v-model="radio" label="1" style="margin: 0px">_胎压曲线_</el-radio>
					<el-radio class="radio" v-model="radio" label="2" style="margin: 0px">_历史轨迹_</el-radio>
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
					width="80">
				</el-table-column>
				<el-table-column
					prop="FGPSDateTime"
					label="_最后更新时间_"
					align="center"
					width="180">
				</el-table-column>
				<el-table-column
					min-width="1000"
					header-align="center"
					align="left"
					:label="vehicleName">
					<template scope="scope">
						<ul>
							<li class="humiture" v-for="(item,index) in table[scope.$index].FTyreContent" >
								<i class="tire">{{item.N}}</i>
								<span class="humitureTxt">{{item.P }}&nbsp;bar</span>
								<span class="humitureTxt">{{item.T}}&nbsp;℃</span>
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
				<div v-show="isShowPositionImg" class="positionImg tire-img"></div>
			</transition>

			<div class="mymodalCommon mymodal1" v-show="radio==1"
				 :class="{'chartModal':!fullScreen,'fullScreen':fullScreen}">
				<div class="modal-header">
					<div style="float: right">
						<button
							type="button" @click="open"
							class="btn-white btn-custom" style="width: 95px"><i
							class="fa fa-arrows-alt  padding-r-8"></i>{{word}}
						</button>
						<button type="button" @click="closeMymodal"
								style="height: 20px;width: 20px;background:white;border: none;"><span
							class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal;"></span>
						</button>
					</div>
				</div>
				<div class="tireChart" id="tireChart"></div>
			</div><!-- /.modal-content -->
			<div class="mymodalCommon mymodal2"
				 :class="{'show':radio==2,'chartModal':!fullScreen1,'fullScreen':fullScreen1}">
				<div class="modal-header" style="margin-bottom: -40px;position: absolute;z-index: 11; right: 0px;">
					<div style="float: right">
						<button
							type="button" @click="open"
							class="btn-white btn-custom" style="width: 95px"><i
							class="fa fa-arrows-alt  padding-r-8"></i>{{word1}}
						</button>
						<button type="button" @click="closeMymodal"
								style="height: 20px;width: 20px;background:white;border: none;"><span
							class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal;"></span>
						</button>
					</div>
				</div>
				<div class="modal-body" style="padding: 0px">
					<baidu-map ref="map" :fa-data="[mapToolShow]"></baidu-map>
				</div>
			</div><!-- /.modal-content -->
		</div>
	</section>
</template>
<script>
	import HighChart from 'highcharts/highstock'
	import baiduMap from '../Common/baidu_map.vue'
	import VehicalList from 'components/dialog/vehicalList.vue'
	//  import {BaiduMap} from 'vue-baidu-map'
	let _this=null
	export default {
		data() {
			_this=this
			return {
				isShowPositionImg:false,
				value2: new Date(),
				radio: '',
				fullScreen: false,
				fullScreen1: false,
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
				value4: [new Date(), new Date()],
				value3: '',
				Area: "深圳",
				mapToolShow: false,
				table: null,
				table_height: null,
				tireOption: {
					chart: {
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
					plotOptions: {
						series: {
              connectNulls:true,
							marker: {
								enabled: false
							}
						}
					},
					scrollbar: {
						enabled: true,
						barBackgroundColor: "#2885eb",
						liveRedraw: false,
						showFull: false
					},

					title: {
						text: '_胎压曲线_',
					},
					xAxis: {
						categories: '',
						tickInterval: 5,
						lable: ''
					},
					yAxis: {
						title: {
							text: '_压力_ (bar)',
							margin: -45,
							align: "high",
							y: -20,
							rotation: 0
						},
						lineColor: "#d7d7d7",
						lineWidth: 1
					},
					tooltip: {
						valueSuffix: 'bar'
					},
					credits: {
						enabled: false
					},
					legend: {
						verticalAlign: 'top',
						borderWidth: 0,
						y: 15
					},
					series: ''
				},
				vehicleName:"_胎压胎温详情_"
			}
		},
		mounted(){
			HighChart.setOptions({
				lang: {
					resetZoom: '_重置_'
				}
			});
			//加载地图
			setTimeout(function () {
				_this.adjustPage();
				_this.$refs.map.initMap();
			}, 100)
//      this.handler();
		},
		props: {
			screenHeight: Number
		},
		computed: {
			word: function () {
				if (this.fullScreen) {
					return "_还原_"
				} else {
					return "_全屏_"
				}
			},
			word1: function () {
				if (this.fullScreen1) {
					return "_还原_"
				} else {
					return "_全屏_"
				}
			}
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			},
			radio: function () {
				if (this.table == null || this.table.length == 0) {
					this.radio = '';
					this.$message({
						showClose: true,
						message: '_获取数据后方能查看_',
						type: 'warning'
					});

				}
			}
		},
		methods: {
			get: function (data) {
				if (data[0] !== undefined&&data[1] !== undefined) {
					$('.search-input').val(data[0]);
					$('.search-input').attr('title',data[0])
					$('.search-input').attr('fguid',data[1])          
				}
			},
			adjustPage(){
				$("#map-wrapper").height(400);
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", '', true) + 15;
			},
			getTime: function (value) {
				return this.value3 = value;

			},
			reset: function () {
				$('.search-input').val('');
				$('.search-input').removeAttr('fguid');
				this.value2 = new Date();
        this.table=null;
        this.radio=""
			},
			doQuery: function () {
				this.vehicleName="_胎压胎温详情_";
				this.isShowPositionImg = false;
				this.closeMymodal();
				this.table = [];
				this.tireOption.xAxis.categories = [];

				var FVehicleID = $(".search-input").attr("fguid");
				var startTime;
				var endTime;
				var tableDay;
				var year = new Date().getFullYear();
				var month = new Date().getMonth() + 1;
				var date = new Date().getDate();
				if (month < 10) {
					month = "0" + month;
				}
				if (date < 10) {
					date = "0" + date;
				}
				var today = year + '-' + month + '-' + date;
				if (this.value3 == '') {
					startTime = this.parseUTC(today + ' 00:00:00');
					endTime = this.parseUTC(today + ' 23:59:59');
					tableDay = today.replace(/-/g, '');
				} else {
					tableDay = moment(this.value3).format("YYYY-MM-DD").replace(/-/g, '');
					startTime = this.parseUTC(moment(this.value3).format("YYYY-MM-DD") + ' 00:00:00');
					endTime = this.parseUTC(moment(this.value3).format("YYYY-MM-DD") + ' 23:59:59');
				}
				if (FVehicleID != undefined) {
					this.loading = true;
					$.ajax({
						'url': '/web/Trailer/Trailer_LBS',
						'cache': false,
						'async': true,
						'type': 'Post',
						'dataType': 'json',
						'contentType': 'application/json;charset=utf-8',
						'data': '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLBSTrackTPMSListByFVehicleGUID","FVehicleGUID":"' + FVehicleID + '","FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FTableDate":"' + tableDay + '","FVersion":"1.0.0"}',
						success: function (data) {
              console.log(data);
              if(data.Result==104) {
                _this.$message({
                  showClose: true,
                  message: '_登录超时_,_五秒后跳转到登录页面_',
                  type: 'warning'
                });
                setTimeout(function(){
                  _this.$store.commit("goLogin");
                },5000)
                return
              }
							_this.loading = false;

							var fobj = data;
							if (fobj.FObject.length == 0) {
								_this.$message({
									showClose: true,
									message: '_未查询到数据_',
									type: 'warning'
								});
								return
							}
							data.FObject=JSON.hunpack(eval(data.FObject),4)
							_this.showPosition();
							_this.table = fobj.FObject;
							_this.tireOption.series = [
								{
									name: '_胎_1',
									data: []
								},
								{
									name: '_胎_2',
									data: []
								},
								{
									name: '_胎_3',
									data: []
								},
								{
									name: '_胎_4',
									data: []
								},
								{
									name: '_胎_5',
									data: []
								},
								{
									name: '_胎_6',
									data: []
								}
							];
							$.each(_this.table, function (index, obj) {
								obj.FGPSDateTime = _this.parseGMT(obj.FGPSDateTime.replace(/T/ig, ' '));
								obj.FTyreContent = $.parseJSON(obj.FTyreContent);
								obj.FTyreContent.sort(function (a, b) {
									return a.N - b.N;
								});
								_this.vehicleName=obj.FVehicleName+":_胎压胎温详情_";
								_this.tireOption.xAxis.categories.push(obj.FGPSDateTime.split(" ")[1]);
                if(obj.FTyreContent.length==6){
                  $.each(obj.FTyreContent,function (a,item) {
                    _this.tireOption.series[a].data.push(Number(obj.FTyreContent[a].P));
                  });
                }else {
                  $.each(obj.FTyreContent,function (a,item) {
                    for (let i=0;i<6;i++){
                        if(item.N==i+1){
                        _this.tireOption.series[i].data.push(Number(obj.FTyreContent[a].P));
                      }else {
                        _this.tireOption.series[i].data.push(null);
                      }
                    }
                  });
                }
//								for (let i = 0; i < 6; i++) {
//									if (obj.FTyreContent[i] == undefined) {
//										_this.tireOption.series[i].data.push(0)
//									} else {
//									  let j=obj.FTyreContent[i].N-1;
//										_this.tireOption.series[j].data.push(Number(obj.FTyreContent[i].P));
//									}
//								}
							});


							HighChart.chart('tireChart', _this.tireOption);

							_this.showHistory();

						},
						error: function () {
							console.log('请求失败')
						}
					})
				} else if (FVehicleID == undefined) {
					this.$message({
						showClose: true,
						message: '_请选择车辆_/_箱号_',
						type: 'warning'
					});
				}
			},
			//绘制轨迹
			showHistory: function () {
				let points = [];
				var carData = _this.table;
				for (var i = 0; i < carData.length; i++) {
					let lon = null,
						lat = null;
					if (carData[i].FLongitude == 0 && carData[i].FLatitude == 0) {
						if (carData[i - 1] && carData[i - 1].FLongitude != 0 && carData[i - 1].FLatitude != 0) {
						/*	lon = _this.getCarPoint(carData[i - 1]).lon;
							lat = _this.getCarPoint(carData[i - 1]).lat;*/
              let point=_this.parsePointBD(new BMap.Point(carData[i - 1].FLongitude,carData[i - 1].FLatitude));
							points.push(new BMap.Point(point.lng,point.lat));

						}
						else if (carData[i + 1] && carData[i + 1].FLongitude != 0 && carData[i + 1].FLatitude != 0) {
              let point=_this.parsePointBD(new BMap.Point(carData[i + 1].FLongitude,carData[i + 1].FLatitude));
              points.push(new BMap.Point(point.lng,point.lat));


            }

					} else {
            let point=_this.parsePointBD(new BMap.Point(carData[i].FLongitude,carData[i].FLatitude));
            points.push(new BMap.Point(point.lng,point.lat));

					}

				}


				//$.each(carData,function (index,obj) {
				//  let point=_this.getCarPoint(new BMap.Point(obj.FLongitude,obj.FLatitude));
				//  points.push(new BMap.Point(point.lon,point.lat))
				//});
				_this.$refs.map.showCarRoute([], points);
			},

			//全屏
			open: function () {
				if (this.radio == 1) {
					this.fullScreen = !this.fullScreen;
					if (this.fullScreen) {
						$(".el_table_wrap").css("padding-left", '0px');
						$(".mymodal1").width("100%");
						$(".mymodal1").height(this.table_height);
						HighChart.chart('tireChart', this.tireOption);
					} else {
						$(".mymodal1").width("800");
						$(".mymodal1").height("400");
						HighChart.chart('tireChart', this.tireOption);
					}
				} else if (this.radio == 2) {
					this.fullScreen1 = !this.fullScreen1;
					if (this.fullScreen1) {
						$(".el_table_wrap").css("padding-left", '0px');
						$(".mymodal").width("100%");
						$(".mymodal").height(this.table_height);
						$("#map-wrapper").height(this.table_height);
					} else {
						$(".mymodal").width("800");
						$(".mymodal").height("400");
						$("#map-wrapper").height(400);
					}
				}
			},
			closeMymodal: function () {
				this.radio = ''
			},
			//显示设备图
			showPosition(){
				let timeout = null;
				_this.isShowPositionImg = true;
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					_this.isShowPositionImg = false;
				}, 3000)
			}

		},
		components: {
			baiduMap,
			VehicalList
//      BaiduMap
//      BootPage
		}
	}
</script>
<style scoped>
	.tire-img{
		background-image:url("/static/img/position-tire.png");
	}
	.chartModal {
		height: 402px;
		width: 800px;
		top: 50%;
		left: 50%;
		margin-left: -400px;
		margin-top: -200px;
	}
</style>
