<template>
	<li class="map-tool-item halving-r-line">
		<div id="map_tool1" class="btn-white btn-custom">
			<button data-toggle="dropdown" type="button" class="btn-white btn-custom">
				{{thisArea}}
				<i class="fa fa-caret-down padding-l-4"></i>
			</button>
			<div id="citySelDiv" class="dropdown-menu map-menu">
				<div class="cityListLayer">
					<div class="hotCity" id="hotCityDiv">
						<a href="javascript:void(0)"
						   @click="setMapCity(1, '全国|34.30017*108.9976@34.301612*108.992755|1|');"
						   style="cursor: default;"><b>全国</b></a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'北京市|39.89945*116.40969@39.898046*116.403447|7|1114368');">北京</a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'上海市|31.23385*121.4755@31.235782*121.470968|7|3211520');">上海</a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'天津市|39.14307*117.2001@39.142018*117.193784|8|1179904');">天津</a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'重庆市|29.56029*106.55355@29.563135*106.549829|8|5243136');">重庆</a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'深圳市|22.55197*114.11819@22.554654*114.113081|8|4457216');">深圳</a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'广州市|23.13399*113.26006@23.136667*113.254734|8|4456704');">广州</a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'西安市|34.30017*108.9976@34.301612*108.992755|8|6357248');">西安</a>
						<a href="javascript:void(0)"
						   @click="setMapCity(1,'香港市|22.31881*114.18144@22.321572*114.176492|8|8454145');">香港</a>
					</div>
					<div class="searchCity fix">
						<button class="btn btn-info btn-xs now" href="javascript:void(0)"
							id="AccordingToPA" lang>
							_按城市_
						</button>
						<button class="btn btn-info btn-xs " href="javascript:void(0)"
							id="AccordingToCA">_按省份_
						</button>
						<input type="text" v-model="searchText" id="searchText"
						       placeholder="_输入关键字_" class="nav-search-input"
						       autocomplete="off">

					</div>
					<!--省份检索 start-->
					<div id="provinceDiv" class="hide">
						<div class="line">
							<a href="javascript:void(0)" v-for="item in getProvince[1]">{{item}}</a>
						</div>
						<div id="pContentDiv" class="cityList">
							<table>
								<tbody id="provinceInfoTB">
								<tr v-for="item in getProvince[0]">
									<td v-show="searchText==''" valign="top"
									    width="50">
										<b>
											<a href="javascript:void(0)"
											   style="cursor:default;"
											   :id='"p"+item.index'>{{item.index}}</a>
										</b>
									</td>
									<td v-show="searchText==''" valign="top"
									    width="70">
										<h2>
											<a href="javascript:void(0)"
											   @click="setMapCity(0,item.provinces.data);">
												{{item.provinces.name}}
											</a>
										</h2>
									</td>
									<td>
										<a v-for="itemChild in item.provinces.city"
										   href="javascript:void(0)"
										   @click="setMapCity(1,itemChild);">{{itemChild.split("|")[0]}}</a>
									</td>
								</tr>
								</tbody>
							</table>
						</div>
					</div>
					<!--省份检索 end-->
					<!--城市检索 start-->
					<div id="cityDiv">
						<div class="line">
							<a href="javascript:void(0)">A</a>
							<a href="javascript:void(0)">B</a>
							<a href="javascript:void(0)">C</a>
							<a href="javascript:void(0)">D</a>
							<a href="javascript:void(0)">E</a>
							<a href="javascript:void(0)">F</a>
							<a href="javascript:void(0)">G</a>
							<a href="javascript:void(0)">H</a>
							<a href="javascript:void(0)">J</a>
							<a href="javascript:void(0)">K</a>
							<a href="javascript:void(0)">L</a>
							<a href="javascript:void(0)">M</a>
							<a href="javascript:void(0)">N</a>
							<a href="javascript:void(0)">P</a>
							<a href="javascript:void(0)">Q</a>
							<a href="javascript:void(0)">R</a>
							<a href="javascript:void(0)">S</a>
							<a href="javascript:void(0)">T</a>
							<a href="javascript:void(0)">W</a>
							<a href="javascript:void(0)">X</a>
							<a href="javascript:void(0)">Y</a>
							<a href="javascript:void(0)">Z</a>
						</div>
						<div id="cContentDiv" class="cityList">
							<table>
								<tbody id="cityInfoTB">
								<tr v-for="(item, key) in getCitys"
								    v-show="item.cityCount!=0">
									<td valign="top" width="50">
										<b>
											<a href="javascript:void(0)"
											   :id='"c"+key'>{{key}}</a>
										</b>
									<td>
										<a href="javascript:void(0)"
										   v-for="city in item.city "
										   v-show="typeof(city.cityName) != undefined"
										   @click="setMapCity(1,city.cityData);">{{city.cityName}}</a>
									</td>
								</tr>
								</tbody>
							</table>
						</div>
					</div>
					<!--城市检索 end-->
				</div>
			</div>
		</div>
	</li>
</template>
<script>

	import cityDatas from "js/GIS/cityDatas.js"
	export default {
		data () {
			return {
				searchText: "",
				thisArea: this.Area
			}
		},
		props: {
			Area: String
		},
		mounted(){
			let _this = this;
			//切换到省会列表
			$("#AccordingToCA").click(function (e) {
				e.stopPropagation();
				$("#provinceDiv").removeClass("hide");
				$("#cityDiv").addClass("hide");
				$(this).addClass("now");
				$("#AccordingToPA").removeClass("now");
			});
			//切换到城市列表
			$("#AccordingToPA").click(function (e) {
				e.stopPropagation();
				$("#provinceDiv").addClass("hide");
				$("#cityDiv").removeClass("hide");
				$(this).addClass("now");
				$("#AccordingToCA").removeClass("now");

			});

			$("#searchCityBtn").bind("click", function (e) {
				e.stopPropagation();

			});

			//省会索引点击
			$("#provinceDiv .line a").bind("click", function (e) {
				e.stopPropagation();
				focusCityA(0, this);
			});
			//城市索引点击
			$("#cityDiv .line a").bind("click", function (e) {
				e.stopPropagation();
				focusCityA(1, this);
			});


			//索引焦点
			function focusCityA(type, obj) {
				try {
					var flagStr = (type == 0) ? "p" : "c";
					var letterStr = $.trim($(obj).html());
					if (letterStr == "其它") {
						letterStr = "Other";
					}
					$("#" + flagStr + letterStr).focus();
				} catch (ex) {
					/*        catchTheException("focusCityA", ex);
					 */
				}
			};

		},
		methods: {
			setMapCity(type, info){
				var infos = info.split("|");
				var point = {lng:infos[1].split("@")[0].split("*")[1],lat:infos[1].split("@")[0].split("*")[0]};
				this.thisArea = infos[0].replace("市", "");
				this.$emit('cityData', {name: infos[0].replace("市", ""), point: point});
			},
			setArea(data){
				this.thisArea = data.replace("市", "");
			}
		},
		computed: {
			getCitys: function () {
				let _this = this,
					originCity = cityDatas.cityDatas().cCityDatas,
					cContentArr = {
						"A": {city: [], cityCount: 0},
						"B": {city: [], cityCount: 0},
						"C": {city: [], cityCount: 0},
						"D": {city: [], cityCount: 0},
						"E": {city: [], cityCount: 0},
						"F": {city: [], cityCount: 0},
						"G": {city: [], cityCount: 0},
						"H": {city: [], cityCount: 0},
						"J": {city: [], cityCount: 0},
						"K": {city: [], cityCount: 0},
						"L": {city: [], cityCount: 0},
						"M": {city: [], cityCount: 0},
						"N": {city: [], cityCount: 0},
						"P": {city: [], cityCount: 0},
						"Q": {city: [], cityCount: 0},
						"R": {city: [], cityCount: 0},
						"S": {city: [], cityCount: 0},
						"T": {city: [], cityCount: 0},
						"W": {city: [], cityCount: 0},
						"X": {city: [], cityCount: 0},
						"Y": {city: [], cityCount: 0},
						"Z": {city: [], cityCount: 0}
					};
				for (var i in originCity) {
					for (var j = 0; j < originCity[i].length; j++) {
						let cityArr = originCity[i][j].split("|");
						//搜索城市功能
						let thisCity;
						if (cityArr[0].indexOf(_this.searchText) != -1) {
							thisCity = {cityData: originCity[i][j], cityName: cityArr[0]}
							cContentArr[cityArr[4]].cityCount++;
						} else {
							thisCity = {cityData: "", cityName: ""};
						}
						cContentArr[cityArr[4]].city.push(thisCity);
					}
				}
				//console.log(JSON.stringify(cContentArr));
				return cContentArr;
			},
			getProvince: function () {
				let provinceData = [],
					_this = this,
					originProvince = cityDatas.cityDatas().cProvinceDatas,
					originCity = cityDatas.cityDatas().cCityDatas,
					pNumber = [];
				for (let i = 0; i < originProvince.length; i++) {
					//解析省份
					let cProvinceArr = originProvince[i].split("|");
					let cityArr = [];
					let count = 0;
					for (let j = 0; j < originCity[cProvinceArr[0]].length; j++) {
						if (originCity[cProvinceArr[0]][j].indexOf(_this.searchText) != -1) {
							cityArr.push(originCity[cProvinceArr[0]][j]);
							count++;
						}

					}
					let allProvince = {
						type: count,
						name: cProvinceArr[0],
						data: originProvince[i],
						city: cityArr
					}
					//是否有字幕序号
					if (pNumber.indexOf(cProvinceArr[4]) === -1) {

						pNumber.push(cProvinceArr[4]);
						provinceData.push({
							index: cProvinceArr[4],
							type: 0,
							provinces: allProvince
						});

					} else {
						provinceData.push({index: "", type: 0, provinces: allProvince});
					}

				}
				//console.log(JSON.stringify(provinceData));
				return [provinceData, pNumber];
			}


		}

	}
</script>
<style>
	/*城市选择*/
	.cityListLayer {
		width:388px;
		padding:5px 10px;
		font-size:12px;
	}

	.cityListLayer .hotCity, .cityListLayer .line, .cityListLayer .searchCity {
		padding:8px 5px;
	}

	.cityListLayer .cityList a, .cityListLayer .hotCity a, .cityListLayer .line a {
		padding:2px 3px;
		color:#0078b6;
		margin-right:5px;
		display:inline-block;
	}

	.cityListLayer .cityList a:hover, .cityListLayer .hotCity a:hover, .cityListLayer .line a:hover {
		color:#219bd0;
	}

	.cityListLayer .line {
		border-bottom:1px solid #dcdcdc;
		box-shadow:0 1px 0 #fff;
	}

	.cityListLayer .searchCity {
		background:#f5f5f5;
	}

	.cityListLayer .searchCity .now {
		background:#337ab7;
		font-weight:700;
	}

	.cityListLayer span {
		margin-right:10px;
	}

	.cityListLayer h2, .cityListLayer h3, .cityList td, .cityListLayer .comSearch input {
		font-size:12px;
	}

	.cityListLayer h2, .cityListLayer h3 {
		font-weight:700;
		word-break:keep-all;
		white-space:nowrap;
	}

	.cityList {
		height:250px;
		overflow-y:auto;
	}

	.cityListLayer table td {
		padding:6px 8px 6px 0;
	}

	.cityListLayer .cityList b a, .cityListLayer .cityList b a:hover {
		font-size:24px;
		color:#ccc;
	}

	.cityListLayer .cityList h3 a, .cityListLayer .cityList h3 a:hover {
		cursor:default;
		color:#888;
	}

	.cityListLayer .nav-search-input {
		border:1px solid #1970cf;
		width:150px;
		height:28px;
		outline:none;
		padding-top:2px;
		padding-bottom:2px;
		padding-left:15px;
		border-radius:14px;
		font-size:13px;
		color:#666;
	}

</style>
