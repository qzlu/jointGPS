<!--百度地图组件-->
<template>
	<div id="map-component">
		<!--地图工具-->
		<ul id="map-tool" v-show="mapToolShow">
			<!--地图选择-->
			<li class="map-tool-item halving-r-line">
				<button data-toggle="dropdown" type="button" class="btn-white btn-custom">
					{{mapType==0?'_百度地图_':'_谷歌地图_'}} <i class="fa fa-caret-down padding-l-4"></i>
					</span>
				</button>
				<ul class="dropdown-menu">
					<li><a @click="choiceMap(0)">_百度地图_</a></li>
					<li><a @click="choiceMap(1)">_谷歌地图_</a></li>
				</ul>

			</li>
			<!--地图选择 end-->
			<!--当前地图中心位置-->
			<li v-if="mapType==1" class="map-tool-item halving-r-line">{{Area}}</li>
			<!--城市选择 star--><!--     -->
			<change-city v-if="mapType==0" ref="city" :Area="Area" @cityData="changeMap"></change-city>
			<!--城市选择 end-->
			<!--智能搜索-->
			<li class="map-tool-item">
				<div v-if="mapType==0" class="search-area">
					<input id="baidu-search" v-model="searchMapText" @keyup.enter="searchMap(searchMapText)" type="text"
						   onfocus="this.select()" onmouseup="this.select()" class="input-custom border-radius-2 width-150" placeholder="_智能搜索_">
					<span v-show="searchMapText!=''" class="search-area-btn" @click="deleteSearch"><i class="fa fa-close"></i></span>
					<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
				</div>
				<div v-show="mapType==1" class="search-area">
					<input id="G-search" class="input-custom border-radius-2 width-150" v-model="searchMapText"
						   onfocus="this.select()" onmouseup="this.select()" placeholder="_智能搜索_">
					<span v-show="searchMapText!=''" class="search-area-btn" @click="deleteSearch"><i class="fa fa-close (alias)"></i></span>
				</div>
			</li>
			<li class="map-tool-item halving-r-line" v-if="isShowAreaSearch">
				<button data-toggle="dropdown" type="button" class="btn-white btn-custom">
					<i class="img-icon map-icon map-icon1"></i>_框选查找_</i>
				</button>
				<ul class="dropdown-menu">

					<li>
						<a @click="rectangleSearchCar" href="javascript:;">
							<i class="img-icon sub-map-icon sub-map-icon2"></i>_框选查车_
						</a>
					</li>
					<li>
						<a @click="rectangleSearch(1)" href="javascript:;">
							<i class="img-icon sub-map-icon sub-map-icon1"></i>_区域检索_
						</a>
					</li>
					<!--
					<li><a @click="rectangleSearch(1)" href="javascript:;"><i class="img-icon sub-map-icon sub-map-icon3"></i>_找加油站_</a></li>
					<li><a @click="rectangleSearch(2)" href="javascript:;"><i class="img-icon sub-map-icon sub-map-icon4"></i>_找停车场_</a></li>
					<li><a @click="rectangleSearch(3)" href="javascript:;"><i class="img-icon sub-map-icon sub-map-icon5"></i>_找高速出入口_</a></li>
					<li><a @click="rectangleSearch(4)" href="javascript:;"><i class="img-icon sub-map-icon sub-map-icon6"></i>_找收费站_</a></li>
-->
				</ul>
			</li>
			<li class="map-tool-item halving-r-line" v-if="!isShowAreaSearch">
				<button @click="rectangleSearch(1)" data-toggle="dropdown" type="button" class="btn-white btn-custom">
					<i class="img-icon map-icon map-icon1"></i>_区域检索_</i>
				</button>
			</li>
			<li class="map-tool-item halving-r-line">
				<button @click="setFence(3)" data-toggle="dropdown" type="button" class="btn-white btn-custom">
					<i class="img-icon map-icon map-icon2"></i>_创建围栏_<i class="fa fa-caret-down padding-l-4"></i>
				</button>
				<!--<ul class="dropdown-menu">
					<li><a @click="setFence(1)" href="javascript:;"><i class="fa fa-circle-o"></i>_圆形围栏_</a></li>
					<li><a @click="setFence(2)" href="javascript:;"><i class="fa fa-square-o"></i>_矩形围栏_</a></li>
					<li><a @click="setFence(3)" href="javascript:;"><i class="fa fa-star-o"></i>_多边形围栏_</a></li>
				</ul>-->
			</li>
			<!--显示围栏-->
			<li v-if="isShowFenceBtn" class="map-tool-item halving-r-line show-fence">
				<button @click="getFenceData" data-toggle="dropdown" type="button" class="btn-white btn-custom"><i
					class="img-icon map-icon map-icon3"></i>
					_显示围栏_<i class="fa fa-caret-down padding-l-4"></i></button>
				<ul class="dropdown-menu fence-icon-wrap">
					<!-- <li class="fence-li">
						<a class="text-center" @click.stop="showFence('all')">_显示全部_</a>
					</li>				 -->
					<li v-for="item in fenceTypeArr" class="fence-li">
						<a @click.stop="showFence(item)" href="javascript:;" class="clearfix">
							<i class="img-fence fencetype-icon" :class="'fencetype-icon'+item.icon"></i>
							{{item.name}}&nbsp;({{item.fenceArr.length}})
							<i class="color-box"
							   :style="{borderColor:item.strokeColor,backgroundColor:item.fillColor}"></i>
						</a>
					</li>
					<li class="fence-li" v-if="fenceArr.graph.length!=0">
						<a class="text-center"  @click.stop="hideFence()">_隐藏围栏_</a>
					</li>
				</ul>
			</li>

			<li v-show="mapType==0" class="map-tool-item halving-r-line" :class="{'open':IsActive.ranging}">
				<button @click="ranging" type="button" class="btn-white btn-custom">
					<i class="img-icon map-icon map-icon4"></i>_测距_
				</button>
			</li>
			<li class="map-tool-item halving-r-line">
				<button @click="roadCondition" :class="{'open':IsActive.road,'':!IsActive.road}"
						type="button" class="btn-white btn-custom">
					<i class="img-icon map-icon map-icon5"></i>_路况_
				</button>

			</li>
			<li v-if="isShowAllMapBtn" class="map-tool-item">
				<button @click="showAllMap" type="button" class="btn-white btn-custom"><i
					class="img-icon map-icon map-icon6"></i>_全图_
				</button>
			</li>
			<li class="map-tool-item  float-right" v-if="isShowFullBtn">
				<button @click="openFullScreen" :class="{'open':IsActive.fullScreen,'':!IsActive.fullScreen}"
						type="button"
						class="btn-white btn-custom"><i class="fa padding-r-8 fa-lg" :class="{'fa-arrows-alt':!IsActive.fullScreen,'fa-compress':IsActive.fullScreen}" :title="IsActive.fullScreen?'_退出全屏_':'_全屏_'"></i>
				</button>
			</li>
			<li class="map-tool-item  float-right" v-if="isShowFullBtn">
				<button @click="newWindowFull" type="button" class="btn-white btn-custom">
					<i class="fa fa-external-link padding-r-8 fa-lg" title="_新窗口全屏_"></i>
				</button>
			</li>
			<li class="map-tool-item  float-right">
				<button @click="saveView" :class="{'open':IsActive.fullScreen,'':!IsActive.fullScreen}" type="button"
						class="btn-white btn-custom"><i class="fa fa-floppy-o padding-r-8 fa-lg"  title="_保存当前视野为地图初始视野_"></i>
				</button>
			</li>
		</ul>
		<!--地图内容-->
		<div id="map-wrapper">
			<div id="map-container"></div>
			<!------进度控制器--------->
			<div class="fatherProgress" id="hideControler" v-if="carPointData!=0">
				<a class="sidebar-toggle" @click="hideControler"></a>
				<div class="showLocation">
					<el-switch
							class="isShowLocation"
							v-model="options.showLocation"
							@change="showLocation"
							active-text="基站点">
					</el-switch>
					<label class="showLocationLabel"><input type="checkbox" @change="showLocationLine"
															v-model="options.showLigature"><span>_连线_</span></label>
				</div>
				<div id="checkboxTable" v-if="systemID!=6">
					<!--<i class='clicktogg'>点击按钮出现车辆弹框</i>-->
					<div class="checkbox-control">
						<label><input type="checkbox" @change="showPlayPoint(playNumber)"
									  v-model="options.showTime"><span>_时间_</span></label>
						<label><input type="checkbox" @change="showPlayPoint(playNumber)" v-model="options.showMileage"><span>_里程_</span></label>
						<label><input type="checkbox" @change="showPlayPoint(playNumber)"
									  v-model="options.showSpeed"><span>_速度_</span></label>
						<label v-if="systemID!=7"><input type="checkbox" @change="setStopMarker"
									  v-model="options.showStopTime"><span>_停车点_</span></label>
					</div>
					<div v-if="systemID!=2" class="amountKilo no-border">_总时长_ : {{allRunTime}}</div>
					<div class="amountKilo">_总里程_ : {{allMileage}}km</div>

					<!--<i class="togg bottom-33"></i>-->
				</div>
				<!--进度条-->
				<div id="my-progressbar" class="progress xs progress-grenn">
					<div v-dragX="moveProgressbar" class="progress-yuan" id="progress-yuan"
						 v-bind:style="{left:(getPercent>97?97:getPercent)+'%'}"></div>

					<div role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"
						 class="progress-bar progress-bar-yellow no-transition" v-bind:style="{width:(getPercent>97?97:getPercent)+'%'}">
					</div>
				</div>
				<p class="play-speed">_播放速度_：{{playSpeed}}×</p>
				<div class="row padding-6">
					<div class="col-xs-12">
						<div class="text-center" onselectstart="return false;" style="-moz-user-select:none;">
							<a @click="backwardsPlaySpeed" class="control-panel xj-p-backward"
							   id="xj-p-backward" title="_快退_">
							</a>
							<a @click="subPlaySpeed" class="control-panel xj-p-slow"
							   id="xj-p-slow" title="_减速_">
							</a>
							<a @click="playPoint" :class="{'btn-active':btnActive[0].active,'xj-p-play':isPlayBtn,'xj-p-pause':!isPlayBtn}"
							   class="control-panel" id="xj-p-play" title="_播放_">
							</a>
							<!--<a @click="stopPlayPoint"
							   :class="{'btn-active':btnActive[1].active,'':!btnActive[1].active}"
							   class="control-panel xj-p-pause" id="xj-p-pause" title="_暂停_"><i
								class="ace-icon fa xj-p-pause"></i></a>-->
							<a @click="overPlayPoint"
							   :class="{'btn-active':btnActive[2].active,'':!btnActive[2].active}"
							   class="control-panel xj-p-stop" id="xj-p-stop" title="_停止_">
							</a>
							<a @click="addPlaySpeed" class="control-panel xj-p-fast"
							   id="xj-p-fast" title="_加速_">
							</a>
							<a @click="forwardPlaySpeed" class="control-panel xj-p-forward"
							   id="xj-p-forward" title="_快进_">
							</a>
						</div>
					</div>
				</div>
			</div>																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																								a>
			<!--车辆列表-->
			<div id="map-carlist" class="panel panel-primary map-carlist" v-show="isMapCarlistShow">
				<div v-drag="['map-carlist','map-wrapper']" class="panel-heading">
					<a class="close" @click="closeCarsList">&times;</a>
					<h3 class="panel-title">_选中的车辆_</h3>
				</div>
				<ul class="panel-body">
					<li>
						<p>
							<strong>
								_当前区域内车辆数_：<span class="text-primary">{{areaChoiceArr.length}}</span>_辆_
							</strong>
						</p>
					</li>
					<li class="carlist-content">
						<ul>
							<li v-for="item in carListpage">

								<strong @click="showCarPlace(item.point)" class="cursor-pointer">
									<span v-if="systemID==2">{{item.assetID}}</span>
									{{item.name}}
								</strong>
								<p class="text-muted">{{item.address}}</p>
							</li>
						</ul>
					</li>

					<li v-show="areaChoiceArr.length>5" align="center">
						<el-pagination @current-change="searchCarPage"
									   small layout="prev, pager, next" :page-size="5"
									   :total="areaChoiceArr.length">
						</el-pagination>
					</li>
				</ul>
			</div>
			<!--围栏内容-->
			<div class="modal-backdrop fade in" v-show="isCreateFence"></div>
			<!--创建围栏-->
			<div id="creat-fence" class="panel panel-primary map-fence" v-if="isCreateFence">
				<div v-drag="['creat-fence','map-wrapper']" class="panel-heading">
					<a class="close" @click="closeCreateFencePanel">&times;</a>
					<h3 class="panel-title">_创建围栏_</h3>
				</div>
				<ul class="panel-body">
					<li>
						<label><span class="text-red">*</span>_名称_：</label><input maxlength="20"  v-model="drawingData.name" type="text">
						<!--<label>_编号_：</label><input maxlength="20" onkeyup="this.value=this.value.replace(/[\W]/g,'')"
												   oninput="this.value=this.value.replace(/[\W]/g,'')"
												   v-model="drawingData.number" type="text">-->
						<label><span class="text-red">*</span>_分组_：</label>
						<div class="map-select-wrap">
							<button data-toggle="dropdown" type="button" class="map-select">
								{{choicFenceTeam}}
								<div class="sp-dd">▼</div>
							</button>
							<ul class="dropdown-menu fence-icon-wrap">
								<li v-for="item in fenceTeamArr" class="fence-li">
									<a @click="choiceTeam(item)" href="javascript:;">
										{{item.name}}
									</a>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<label><span class="text-red">*</span>_类型_：</label>
						<div class="map-select-wrap">
							<button data-toggle="dropdown" type="button" class="map-select">
								{{choicFenceType}}
								<div class="sp-dd">▼</div>
							</button>
							<ul class="dropdown-menu fence-icon-wrap">
								<li v-for="item in fenceTypeArr" class="fence-li">
									<a @click="redrawFence(item)" href="javascript:;">
										<i class="img-fence fencetype-icon" :class="'fencetype-icon'+item.icon"></i>
										{{item.name}}
										<i class="color-box"
										   :style="{borderColor:item.strokeColor,backgroundColor:item.fillColor}"></i>
									</a>
								</li>
							</ul>
						</div>
						<label>_面积_：</label><input v-model="drawingData.area" type="text" disabled>
					</li>
					<li>
						<label>_经度_：</label><input v-model="drawingData.center.lng" type="text" disabled>
						<label>_纬度_：</label><input v-model="drawingData.center.lat" type="text" disabled>
					</li>
					<li>
						<label>_位置_：</label><input class="address-input" v-model="drawingData.address" type="text"
												   disabled>
					</li>
					
					<li class="textarea-wrap">
						<label>_备注_：</label><textarea @keyup="textareaMaxLength($event)"
													  @paste="textareaMaxLength($event)" v-model="drawingData.remark"
													  maxlength="100"
													  onkeydown="if(this.value.length>100) {event.returnValue=false}"></textarea>
					</li>
					<li class="fence-btn">
						<button @click="confirmSetFence(false)" type="button" class="el-button search el-button--primary">
							_保存_
						</button>
						<button @click="resetFence(3)" type="button" class="el-button reset el-button--primary">_重绘_</button>
						<!--<el-dropdown @command="resetFence">
							<el-button type="primary">
								_重绘类型_<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								&lt;!&ndash;<el-dropdown-item command="1">_圆形_</el-dropdown-item>&ndash;&gt;
								<el-dropdown-item command="2">_矩形_</el-dropdown-item>
								<el-dropdown-item command="3">_多边形_</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>-->
						<button @click="closeCreateFencePanel" type="button"
								class="el-button cancel el-button--primary">_取消_
						</button>
					</li>

				</ul>
			</div>
			<!--编辑围栏-->
			<div id="redact-fence" class="panel panel-primary map-fence" v-if="isRedactFence">
				<div v-drag="['redact-fence','map-wrapper']" class="panel-heading">
					<a class="close" @click="closeRedactFencePanel">&times;</a>
					<h3 class="panel-title">_编辑围栏_</h3>
				</div>
				<ul class="panel-body">
					<li>
						<label><span class="text-red">*</span>_名称_：</label><input maxlength="20"
																				  v-model="drawingData.name"
																				  type="text">
						<!--<label>_编号_：</label>
						     <input maxlength="20" onkeyup="this.value=this.value.replace(/[\W]/g,'')"
												   oninput="this.value=this.value.replace(/[\W]/g,'')"
												   v-model="drawingData.number" type="text">-->
						<label><span class="text-red">*</span>_分组_：</label>
						<div class="map-select-wrap">
							<button data-toggle="dropdown" type="button" class="map-select">
								{{choicFenceTeam}}
								<div class="sp-dd">▼</div>
							</button>
							<ul class="dropdown-menu fence-icon-wrap">
								<li v-for="item in fenceTeamArr" class="fence-li">
									<a @click="choiceTeam(item)" href="javascript:;">
										{{item.name}}
									</a>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<label><span class="text-red">*</span>_类型_：</label>
						<div class="map-select-wrap">
							<button data-toggle="dropdown" type="button" class="map-select">
								{{choicFenceType}}
								<div class="sp-dd">▼</div>
							</button>
							<ul class="dropdown-menu fence-icon-wrap">
								<li v-for="item in fenceTypeArr" class="fence-li">
									<a @click="redactRedrawFence(item)" href="javascript:;">
										<i class="img-fence fencetype-icon" :class="'fencetype-icon'+item.icon"></i>
										{{item.name}}
										<i class="color-box"
										   :style="{borderColor:item.strokeColor,backgroundColor:item.fillColor}"></i>
									</a>
								</li>
							</ul>
						</div>
						<label>_面积_：</label><input v-model="drawingData.area" type="text" disabled>
					</li>
					<li>
						<label>_经度_：</label><input v-model="drawingData.center.lng" type="text" disabled>
						<label>_纬度_：</label><input v-model="drawingData.center.lat" type="text" disabled>
					</li>
					<li>
						<label>_位置_：</label><input class="address-input" v-model="drawingData.address" type="text"
												   disabled>
					</li>
					<li class="textarea-wrap">
						<label>_备注_：</label><textarea @keyup="textareaMaxLength($event)"
													  @paste="textareaMaxLength($event)" v-model="drawingData.remark"
													  maxlength="100"
													  onkeydown="if(this.value.length>100) {event.returnValue=false}"></textarea>
					</li>
					<li class="fence-btn">
						<button @click="confirmSetFence(true)" type="button"
								class="el-button search el-button--primary">_保存_
						</button>
						<!--<el-dropdown @command="redactResetFence">
							<el-button type="primary">
								_重绘类型_<i class="el-icon-caret-bottom el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="1">_圆形_</el-dropdown-item>
								<el-dropdown-item command="2">_矩形_</el-dropdown-item>
								<el-dropdown-item command="3">_多边形_</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>-->
						<button @click="redactResetFence(3)" type="button" class="el-button reset el-button--primary">_重绘_</button>
						<button @click="closeRedactFencePanel" type="button"
								class="el-button cancel el-button--primary">_取消_
						</button>
					</li>

				</ul>
			</div>
			<!--错误提示-->
			<div class="errorShow" v-show="isErrorShow">{{errorTxt}}</div>
		</div>
		<!--车辆详情-->
		<vel-detail ref="velDetail"></vel-detail>
		<con-detail ref="conDetail"></con-detail>
	</div>
</template>
<script>

	import changeCity from "./changeCity.vue"
	require('js/GIS/Baidu/Lib/BaiduAPI_TrafficControl.js')
	require('js/GIS/Baidu/Lib/BaiduAPI_DistanceTool_min.js')
	require('js/GIS/Baidu/Lib/BaiduAPI_DrawingManager_min.js')
	require('js/GIS/Baidu/Lib/BaiduAPI_TextIconOverlay.js')
	require('js/GIS/Baidu/Lib/BaiduAPI_MarkerClusterer.js')
	require('js/GIS/Baidu/Lib/GeoUtils.js')

	require('js/GIS/Google/Lib/markerclusterer.js')

	require('!style!css!plugins/spectrum/spectrum.css')
	require('plugins/spectrum/spectrum.js')

	import  velDetail from 'components/dialog/velDetail.vue'
	import  conDetail from 'components/dialog/conDetail.vue'

	export default{
		data(){
			return {
				// ************************** 地图初始化数据   start*****************************************************
				mapType: null,//地图类型
				center:{   //初始坐标
					lng: 105.564341,
					lat: 35.643579
				},
				level: 5,   //地图缩放等级
				apng_supported:false, //是否支持apng格式图片
				IsHideControler:false, //是否隐藏回放控制器
				isShowFenceBtn:true,  //显示围栏按钮   默认显示
				isShowAllMapBtn:true, //显示全图按钮   默认显示
				IsActive: {
					road: false,
					ranging: false,
					fullScreen: false,
					isShowIconBox: false
				},
				isShowFullBtn:true,
				mapToolShow: this.faData[0], //初始化显示工具栏
				isShowAreaSearch: this.faData[1], //是否显示区域检索
				searchMapText: "",  //搜索数据
				Area: null,
				errorTxt: '', //错误提示内容
				// ************************** 地图初始化数据   end*****************************************************

				// ************************** 实时监控   start*****************************************************
				MarkerClusterer:null, //marker聚合对象
				latelyData: [],  //实时车辆数据
				latelyArr: [],  //实时车辆绘制图标和文字对象容器
				markersArr:[],  //实时监控实例化marker数组
				listenerArr:[],  //监听事件数组
				infoWindowListenerOpen:[],
				infoWindowListenerClose:null,
				openInfowindowIndex:null, //打开的infowindow的index
				infowindowArr: [],
				googleInfoWindow: [],   //保存google 地图infoWindow对象
				detailDialog:false,     //详情展示是否打开
				detail:{				//详情展示数据
					FVehicleName:'',
					FAssetID:'',   //终端号
					FVehicleSerialCode:'',
					FVIN:'',
					FEngineNumber:'',
					FVehicleTypeID:'',   //车辆类型
					FTankVolume:'',
					FSeatCount:'',
					FTonnage:'',
					FMaxVariaLoad:'',
					FColorRGB:'',
					FLength:'',
					FFuelType:'',
					FFuelConsume:'',
					FInsuCompany:'',
					FInsuDate:new Date(),
					FPurchaseDate:new Date(),
					FRegisDate:new Date(),
					FOperPermNumber:'',
					FRoadTranNumber:'',
					FRoadTranDate:new Date(),
					FTechRegDate:new Date(),
					FImage:'',
					FVehicleGroupFullName:'',
					//  FShortName:'',
					FOperateType:'',
					FDriverName:'',
					FDescription:'',
					FStatus:1,
					FAssetGUID:'',  //终端唯一标识ID
					FVehicleGroupGUID:'',  //车队ID
					// FAgentGUID:'',    //代理商ID
					FAdminDriverGUID:''  //司机id
				},
				// ************************** 实时监控   end*****************************************************

				// ************************** 轨迹回放   start*****************************************************
				btnActive: [ //控制按钮激活状态
					{active: false},
					{active: false},
					{active: false}],
				isPlayBtn:true, //显示播放按钮
				carPointData: [],       //运行轨迹点的数据
				initPointsData:[],     //初始点数据
				carStopData: [],      //停车点集合
				carRunArr: [],        //运行段数据
				tirePressureArr: [],  //胎压数据
				siteData:[],          //站点数据
				greenSiteData:[],    //绿通站点数据
				allPointsArr: [],   //全图点坐标数组
				sitePointArr:[],     //站点坐标数组   包含绿通
				stopPointIndex: [],   //停车点对应索引值集合
				allLineArr: [],	   //轨迹相关所有对象数组
				locationPointsArr: [],	   //基站定位相关所有对象数组
				location_points:[],		// 基站定位相关所有对象数组
				runLineArr: [],	   //运行段对象数组
				intervalArr: [],   //里程点对象数组
				stopArr: [],       //停车点对象数组
				alarmArr:[],	   //报警点对象数组
				lockArr:[],	   //开关锁对象数组
				trailerArr:[],	   //接甩挂对象数组
				doorArr:[],	   //开关门对象数组
				oilArr:[],	   //加减油对象数组
				remoteUnlockMarks:[],//远程开锁定位点
				redPolyline: [],   //报警段
				playPointArr: [],  //播放点对象数组
				allRunTime: 0, //总运行时间
				allMileage: 0,      //总运行里程
				startIndex: 6,    //点轨迹开始索引值
				options: {          //显示选项控制
					showTime: true,
					showMileage: true,
					showSpeed: true,
					showStopTime: true,
					showAlarm:true,
					showLocation:true,
					showLigature:false,
				},
				playSpeed: 1, //播放速度
				playNumber: 0,
				progressWidth: null, //进度条宽度数据				
				searchResult: [],//保存地图搜索结果
				areaChoiceArr: [],  //区域选择车辆容器
				carListpage: [],    //车辆列表分页数据
				isMapCarlistShow: false, //地图中区域查车车辆列表是否显示
				// ************************** 轨迹回放   start*****************************************************


				// ************************** 围栏数据   start*****************************************************
				drawingArr: [],     //绘制图形容器
				fenceArr: {         //服务器围栏数据绘制对象
					graph: [],
					icon: [],
					closeIcon: []
				},
				isCreateFence: false,
				isRedactFence: false,
				isErrorShow: false,
				isRedactRedrawing: true,  //是不是编辑状态不重绘围栏形状 只更改状态
				redactFenceIndex: null,
				drawingData: {    //绘图数据
					name: null,	 //围栏名称
					number: "",   //自定义编号
					remark: "",   //备注
					area: null,   //面积
					formType: 0,  //类型  1圆 2矩形 3多边形
					fenceType: 0, //类型ID
					teamID:null, //分组ID
					path: null,   //多边形&&矩形 各顶点坐标数组  {lng:"",lat:""}
					radius: null, //圆形半径
					center: {lng: null, lat: null},  //围栏近似中心点坐标
					address: null,                //围栏近似中心点地址
				},
				choicFenceType: '_请选择类型_',    //所选围栏类型
				choicFenceTeam: '_请选择分组_',    //所选围栏类型
				mapShowFenceDataArr:[],			  //地图上显示的围栏的数据数组
				choiceFenceType: null,            //保存当前查看围栏状态
				// ************************** 围栏数据   end*****************************************************

			}
		},
		components: {
			changeCity:changeCity,
			velDetail:velDetail,
			conDetail:conDetail
		},
		props: {
			faData: Array
		},
		created() {
			 
			if(this.$route.query.full) {
				this.$store.state.choiceSystemID=this.$route.query.full;
				this.isShowFullBtn=false;
				this.$emit('fullScreen', true);
			}

			if(this.$route.path==="/fence_manage"){
				this.isShowFenceBtn=false;
				this.isShowAllMapBtn=false
			}

		},
		mounted(){
			let _this = this;

			this.progressWidth = $("#my-progressbar").width;

			//监测浏览器是否支持apng格式图片
			(function() {
				"use strict";
				var apngTest = new Image(),
					ctx = document.createElement("canvas").getContext("2d");
				apngTest.onload = function () {
					ctx.drawImage(apngTest, 0, 0);
					self.apng_supported = ctx.getImageData(0, 0, 1, 1).data[3] === 0;
					_this.apng_supported=self.apng_supported;
				};
				apngTest.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANS" +
					"URBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg==";
			}());

			window.showImgFull = function(e){
				e=event.target ||event.srcElement;
				let target=$(e);
				_this.$store.state.showImgUrl=target.attr('src');
			}
			window.imgSwitcher = function(e){
				e=event.target ||event.srcElement;
				//console.log(e)
				let target=$(e);
				let url=target.attr('imgUrl');
				$(".infoWindow-imgBtn").removeClass("active");
				target.addClass("active");
				$(".infoWindow-img img").eq(0).attr("src",url)
			}
		},
		methods: {
			/**
			 * ************* 1.公共部分********************
			 * */
			//隐藏轨迹播放控制器
			hideControler(){
				let width=$("#hideControler").width()+18;
				if(this.IsHideControler){
					this.IsHideControler=false;
					$("#hideControler").css('left','10px')
				}else{
					this.IsHideControler=true;
					$("#hideControler").css('left',-width+'px')
				}
			},

			// 显示错误提示
			showError(txt){
				let _this = this;
				this.errorTxt = txt;
				this.isErrorShow = true;
				setTimeout(function () {
					_this.isErrorShow = false;
				}, 3000)
			},

			//全屏
			openFullScreen(){
				this.IsActive.fullScreen = !this.IsActive.fullScreen;
				this.$emit('fullScreen', this.IsActive.fullScreen);
			},
			//新窗口全屏
			newWindowFull(){
				//获取目前的url
				let url=window.location.href;
				let name=window.name;
				let w=window.open("")
				w.name=name;
				let ID=this.$store.state.choiceSystemID
				w.location.href=url+"?full="+ID;
			},
			//localStorage 储存本地地图视野信息
			saveView(){
				let storage=window.localStorage;
				let view={
					center:this.center,
					level:this.level
				};
				storage.mapView=JSON.stringify(view);
				this.showError("_已保存当前视野为地图初始视野_")
			},

			/***
			 * ************* 2.封装地图公共方法***********
			 * ****
			 * */
			//加载地图 0百度 1谷歌
			initMap(){
				let _this = this;
				this.map=null;
				this.mapType = this.$store.state.mapType;

				let center = null,
					zoom = null;
				let storage=window.localStorage;
				if(storage.mapView){
					let obj=JSON.parse(storage.mapView)
					this.center=obj.center;
					this.level=obj.level;
				}

				let Mpoint ;
				switch (this.mapType) {
					case 0:
						Mpoint = this.getMapPoint(this.center);
						this.map = new BMap.Map("map-container"); //设定地图DOM容器
						this.map.addControl(new BMap.MapTypeControl({ //设置地图类型
							mapTypes:[
								BMAP_NORMAL_MAP, //普通地图
								BMAP_HYBRID_MAP  //混合地图
							],
							anchor: BMAP_ANCHOR_TOP_LEFT,
							offset:new BMap.Size(70,10)
						}));
						this.map.addControl(new BMap.NavigationControl());
						this.map.enableScrollWheelZoom();//启用地图滚轮放大缩小
						this.map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
						this.map.enableKeyboard();//启用键盘上下左右键移动地图
						this.map.enableAutoResize();  //启用自动适应容器尺寸变化  主要 否则遮罩层会发生变形

						var scale = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});  //添加比例尺工具
						this.map.addControl(scale);


						this.centerAndZoom(Mpoint, this.level);
						_this.getArea(Mpoint, this.level)
						this.map.addEventListener("dragend", function () {
							center = _this.map.getCenter();
							zoom = _this.map.getZoom();
							//console.log(center,zoom)
							_this.center = center;
							_this.getArea(center, zoom)
						});
						this.map.addEventListener("zoomend", function () {
							center = _this.map.getCenter();
							zoom = _this.map.getZoom();
							_this.level = zoom;
							console.log("baidu缩放等级",zoom)
							_this.getArea(center, zoom)
						});
						//实例化 测距工具
						this.myDis = new BMapLib.DistanceTool(this.map, {lineStroke: 5});
						//监听双击关闭事件
						this.myDis.addEventListener("drawend", function(e) {
							_this.IsActive.ranging=false
						});
						this.MarkerClusterer = new BMapLib.MarkerClusterer(this.map,{
							maxZoom:12, //视野等级超过15不在聚合
							minClusterSize:5   //小于5  不在聚合
						});
						break;
					case 1:

						if(typeof(google)=='undefined'){
							setTimeout(function(){
								_this.initMap();
							},300)
							return
						}

						console.log("加载谷歌地图")
						Mpoint = this.getMapPoint(this.center);
						console.log(Mpoint)
						let mapOpt = {
							center: new google.maps.LatLng(0, 0),
							zoom: 5,
							mapTypeId: google.maps.MapTypeId.ROADMAP
						};
						this.map = new google.maps.Map(document.getElementById("map-container"), mapOpt);

						this.centerAndZoom(Mpoint, this.level);

						_this.getArea(Mpoint, this.level)
						this.map.addListener("dragend", function () {
							center = {
								lat:_this.map.getCenter().lat(),
								lng:_this.map.getCenter().lng()
							};
							zoom = _this.map.getZoom();
							_this.center = center;
							_this.getArea(center, zoom)
						});
						this.map.addListener("zoom_changed", function () {
							center = {
								lat:_this.map.getCenter().lat(),
								lng:_this.map.getCenter().lng()
							};
							zoom = _this.map.getZoom();
							_this.level = zoom;
							_this.getArea(center, zoom)
						});
						this.GoogleSmartSearch();
						//加载谷歌地图第三方库 markerwithlable
						this.MarkerWithLabel = require("js/GIS/Google/Lib/markerwithlabel.js")(google.maps);
						this.MarkerClusterer =  new MarkerClusterer(this.map);
						this.MarkerClusterer.setMaxZoom(12);
						break;
				};
			},
			//地图切换部分  0百度 1谷歌
			choiceMap(type){
				if (this.mapType == type) return;
				if (type==1 && typeof(google)=='undefined') {
					this.$message("_谷歌地图访问受限_,_请先连接_VPN");
					return
				};
				//切换后初始化数据
				this.searchMapText = ""; //搜索数据
				this.IsActive = {
					road: false,
					ranging: false,
					fullScreen: false,
					isShowIconBox: false
				};
				this.level = 5;
				this.carRunArr = [];
				this.tirePressureArr = [];
				//this.startTimeIndex = [];
				//this.endTimeIndex = [];
				this.allRunTime = 0;
				this.allMileage = 0;
				this.intervalArr = [];
				this.stopArr = [];
				this.alarmArr=[];
				this.lockArr=[];
				this.trailerArr=[];
				this.doorArr=[];
				this.oilArr=[];
				this.startIndex = 6;

				this.playSpeed = 1;
				this.playNumber = 0;
				this.progressWidth = null;

				this.searchResult = [];//保存地图搜索结果

				this.markersArr=[];
				this.latelyArr = [];
				this.openInfowindowIndex =null;
				this.infowindowArr=[];
				this.listenerArr=[];

				this.areaChoiceArr = [];
				this.carListpage = [];

				this.allLineArr=[];	   //轨迹相关所有对象数组
				this.locationPointsArr=[];	   //基站定位相关所有对象数组
				this.runLineArr=[];	   //运行段对象数组
				this.intervalArr=[];   //里程点对象数组
				this.stopArr=[];       //停车点对象数组
				this.alarmArr=[];      //报警点对象数组
				this.lockArr=[];      //开关锁对象数组
				this.trailerArr=[];      //接甩挂对象数组
				this.doorArr=[];      //开关门对象数组
				this.oilArr=[];      //加减油对象数组
				this.redPolyline=[];   //报警段
				this.playPointArr= [];  //播放点对象数组


				this.drawingArr = [];
				this.fenceArr = {
					graph: [],
					icon: [],
					closeIcon: []
				};
				this.isMapCarlistShow = false;
				this.isCreateFence = false;
				this.isRedactFence = false;
				this.isErrorShow = false;
				this.drawingData = {
					name: null,	 //围栏名称
					number: "",   //自定义编号
					remark: "",   //备注
					area: null,   //面积
					formType: 0,  //类型  1圆 2矩形 3多边形
					fenceType: 0, //类型ID
					teamID:null, //分组ID
					path: null,   //多边形&&矩形 各顶点坐标数组  {lng:"",lat:""}
					radius: null, //圆形半径
					center: {lng: null, lat: null},  //围栏近似中心点坐标
					address: null,                //围栏近似中心点地址
					state:true,		//启用状态
				};
				if (this.choicFenceType !== '_请先创建围栏类型_') {
					this.choicFenceType = '_请选择类型_';					
				};
				this.googleInfoWindow = [];  //保存google 地图infoWindow对象
				//初始化结束

				this.mapType = type;
				this.$store.state.mapType=type;
				window.sessionStorage.mapType=type;
				//console.log("地图类型",this.$store.state.mapType);
				this.initMap();
				//重绘实时监控点
				if(this.latelyData.length !=0) this.getLatelyData(this.latelyData, this.initPointsData);
                //重绘轨迹点
				if(this.carPointData.length!=0) this.showCarRoute(this.carPointData, this.initPointsData);
				//重绘停车点
				if(this.carStopData.length!=0) this.setStopMarker();
				//重绘站点
				if(this.siteData.length!=0) this.showSite(this.siteData);
				//重绘绿通
				if(this.greenSiteData.length!=0) this.showGreenSite(this.greenSiteData);
			},
			//得到对应的地图坐标对象 point={lat：，lng：}
			getMapPoint(point){
				switch (this.mapType) {
					case 0:
						return new BMap.Point(point.lng, point.lat);
					case 1:
						return new google.maps.LatLng(point.lat, point.lng);

				}
			},
			//设置中心和缩放等级  Mpoint=this.getMapPoint(point);
			centerAndZoom(Mpoint, level){
				switch (this.mapType) {
					case 0:
						//console.log("百度定位",Mpoint,level);
						this.map.centerAndZoom(Mpoint, level)
						break;
					case 1:
						this.map.panTo(Mpoint);
						this.map.setZoom(level);
						break;

				}

			},
			//开启实时路况
			openRoadCondition(){
				switch (this.mapType) {
					case 0:
						this.ctrl = new BMapLib.TrafficControl();
						this.map.addControl(this.ctrl);
						this.ctrl.showTraffic();
						break;
					case 1:
						this.ctrl = new google.maps.TrafficLayer();
						this.ctrl.setMap(this.map);
						break;
				}

			},
			//关闭实时路况
			closeRoadCondition(){
				switch (this.mapType) {
					case 0:
						this.ctrl.hideTraffic()
						break;
					case 1:
						this.ctrl.setMap(null);
						break;
				}

			},
			//移除监听事件
			removeListener(listener,overlayArr){
				if(listener===null ||overlayArr===null || listener.length===0 || overlayArr.length===0) return;
				let _this=this;
				console.log(listener,overlayArr)
				listener.map(function (item,index) {
					switch (_this.mapType) {
					case 0:
						overlayArr[index].removeEventListener("click",item);
						break;
					case 1:
						google.maps.event.removeListener(item);
						break;
				}
				})
			},
			//清除地图覆盖物
			mapRemoveOverlay(overlay,index){
				if(overlay===null) return;
				switch (this.mapType) {
					case 0:
						overlay.removeEventListener("open",this.infoWindowListenerOpen[index]);
						overlay.removeEventListener("clickclose",this.infoWindowListenerClose);
						this.map.removeOverlay(overlay);
						break;
					case 1:
						overlay.setMap(null);
						break;
				}

			},
			//按index清除标记
			removeOverlay(Arr, index){
				if(!(Arr instanceof Array) || Arr.length===0) return;

				if (index != null && index != "") {
					if (Arr[index]) {
						this.mapRemoveOverlay(Arr[index],index)
					}
				} else {
					for (var i = 0; i < Arr.length; i++) {
						this.mapRemoveOverlay(Arr[i],i)
					}
					Arr.length = 0;
				}
			},
			//根据坐标点和缩放等级确定省份和城市
			getArea(center, zoom){
				if (center != null) {
					if (zoom == null || zoom == "") zoom = this.level;
					let _this = this;


					switch (this.mapType) {
						case 0:
							let myGeo = new BMap.Geocoder();
							myGeo.getLocation(new BMap.Point(center.lng, center.lat), function (rs) {
								let addComp = rs.addressComponents;
								//console.log(addComp);
								// addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
								if (zoom >= 10) {
									_this.Area = addComp.city
								} else if (zoom > 6 && zoom < 10) {
									_this.Area = addComp.province
								} else if (zoom <= 6) {
									_this.Area = "_全国_"
								}
								_this.$refs.city.setArea(_this.Area);
								_this.BaiduSmartSearch();
							})

							break;
						case 1:
							var geocoder = new google.maps.Geocoder();
							geocoder.geocode({location: center}, function geoResults(results, status) {
								if (status == google.maps.GeocoderStatus.OK) {
									//console.log(results);

									if (zoom >= 10) {
										_this.Area = results[0].address_components[2].long_name
									} else if (zoom > 6 && zoom < 10) {
										_this.Area = results[0].address_components[3].long_name
									} else if (zoom <=6) {
										if(results[0].address_components[4]){
											_this.Area = results[0].address_components[4].long_name
										}else {
											_this.Area = results[0].formatted_address
										}
									}
								}

							})
							break;
					}


				}
			},
			//原始坐标集合转换为地图坐标集合
			parsePointsArr(points){
				let MapPointsArr = [];
				for (var i = 0; i < points.length; i++) {
					MapPointsArr.push(this.getMapPoint(points[i]))
				}
				return MapPointsArr;
			},
			//根据轨迹点选择最佳视图
			setViewport(MapPointsArr) {

				switch (this.mapType) {
					case 0:
						//let mapPoints=[]
						//for (var i = 0; i <points.length; i++) {
						//	mapPoints.push(this.getMapPoint(points[i]))
						//}
						var view = this.map.getViewport(MapPointsArr);
						var mapZoom;
						if (MapPointsArr.length > 1) {
							mapZoom = view.zoom;
						} else {
							mapZoom = 12;
						};
						var centerPoint = view.center;
						//if (typeof IsSetLockMap != "undefined") {
						//	IsSetLockMap = false
						//}
						this.map.centerAndZoom(centerPoint,mapZoom);
						this.map.centerAndZoom(centerPoint,mapZoom-1);
						break;
					case 1:
						var bounds = new google.maps.LatLngBounds();
						for (var i = 0; i < MapPointsArr.length; i++) {
							bounds.extend(MapPointsArr[i]);
						};
						if (MapPointsArr.length > 2) {

							this.map.fitBounds(bounds, 80);
						} else {
							let center = bounds.getCenter();

							this.map.panTo(center);
							this.map.setZoom(11);
						};
						break;
				}

			},
			//设置原始marker
			setInitMarker(point){
				let marker, myIcon;
				switch (this.mapType) {
					case 0:
						marker = new BMap.Marker(point);  // 创建标注
						this.map.addOverlay(marker);
						return marker
					case 1:
						marker = new google.maps.Marker({
							position: point,
							map: this.map
						});
						return marker
						break;
				}

			},
			//不同地图-绘制自定义mark
			setMapMarker(point, iconUrl, zIndex, sizeX, sizeY, label,isNoShow){
				let marker=null,
					myIcon=null,
					map=null;
				switch (this.mapType) {
					case 0:
						myIcon = new BMap.Icon(iconUrl, new BMap.Size(sizeX, sizeY));
						marker = new BMap.Marker(point, {icon: myIcon});  // 创建标注
						if (label != null && label != "") {
							label.setOffset(new BMap.Size(sizeX+5, (sizeY/2)-10));
							marker.setLabel(label);
						};

						marker.setZIndex(zIndex);
						if(isNoShow) return marker;
						this.map.addOverlay(marker);
						return marker;
					case 1:
						if(isNoShow) map=this.map;
						myIcon = {
							anchor: new google.maps.Point(sizeX / 2, sizeY / 2),
							labelOrigin:new google.maps.Point(sizeX*2.5, sizeY / 2),
							url: iconUrl,
							size: new google.maps.Size(sizeX, sizeY),
						};
						if (label != null && label != "") {
							marker = new this.MarkerWithLabel({
								position: point,
								icon: myIcon,
								labelContent: label.text,
								labelAnchor: new google.maps.Point(label.x, label.y),
								//labelClass: "labels", // the CSS class for the label
								labelStyle: {
									color: label.color,
									border: "1px solid #999",
									background: "#fff",
								},
								zIndex: zIndex,
								map: map,
								optimized: false
							});

						} else {
							marker = new google.maps.Marker({
								position: point,
								icon: myIcon,
								zIndex: zIndex,
								map: map,
								optimized: false
							});
						}
						return marker;
				}

			},
			//不同地图-设置自定义Label
			setMapLabel(text, color,type){
				let textLabel;
				switch (this.mapType) {
					case 0:
						textLabel = new BMap.Label(text);     //为lable填写内容
						if(type!=="monitor"){
							textLabel.setStyle({//给label设置样式，任意的CSS都是可以的
								color: color,
								padding:"0px",
								"background-color":"#499d45",
								border: "1px solid #267d22",
								"border-radius":"2px",
								textAlign: "center",            //文字水平居中显示
							});
						}else {
							textLabel.setStyle({//给label设置样式，任意的CSS都是可以的
								color: color,
								border: "1px solid #999",
								textAlign: "center",            //文字水平居中显示
							});
						}
						return textLabel
					case 1:
						textLabel = {
							color: color,
							text: text,
							border: "1px solid #999",
							background: "#fff",
							minWidth: "250px",
							x: -15,
							y: 10
						};
						return textLabel
						break;
				}

			},
			//绘制线条
			setMapline(MapPointsArr, option){
				let polyline
				switch (this.mapType) {
					case 0:
						//var Bsy = new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_OPEN_ARROW, {
						//	scale: 0.5,//图标缩放大小
						//	strokeColor:'#fff',//设置矢量图标的线填充颜色
						//	strokeWeight: '2',//设置线宽
						//});
						//var Bicons = new BMap.IconSequence(Bsy, '100','10%');
						polyline = new BMap.Polyline(MapPointsArr, {
							//icons:[Bicons],
							strokeColor: option.strokeColor,
							strokeWeight: option.strokeWeight, //边线的宽度，以像素为单位。
							strokeOpacity: option.strokeOpacity, //边线透明度，取值范围0 - 1。
							strokeStyle:  option.strokeStyle, //边线的样式，solID或dashed。
							IsArrow: true,
							zIndex: option.zIndex
						});
						this.map.addOverlay(polyline);
						return polyline
					case 1:
						let Gsy,iconsOption,strokeOpacity;
						if(option.strokeStyle==="dashed"){
							//谷歌地图画虚线的方法
							Gsy ={
								path:"M 0,-1 0,1",
								strokeOpacity: 1,
								scale: 3
							};
							iconsOption={
								icon:Gsy,
								offset: '0',
								repeat: '20px'
							};
							strokeOpacity=0;
						}else{
							Gsy ={
								path:google.maps.SymbolPath.FORWARD_OPEN_ARROW,
								scale: 1,//图标缩放大小
								strokeColor:'#fff',//设置矢量图标的线填充颜色
								strokeWeight: '2',//设置线宽
							};
							iconsOption={
								icon: Gsy,
								repeat: '5%'
							};
							strokeOpacity=option.strokeOpacity;
						}
						polyline = new google.maps.Polyline({
							path: MapPointsArr,
							icons:[iconsOption],
							strokeColor: option.strokeColor, // 线条颜色
							strokeWeight: option.strokeWeight, // 线条粗细
							strokeOpacity: strokeOpacity, // 线条透明度
							zIndex: option.zIndex
						});
						polyline.setMap(this.map)
						return polyline;
				}
			},


			/**
			 * **************3.业务逻辑部分**************
			 * **/


			/***

			 * * **********************************    ⑴工具栏部分   *****************************************
			 * */

			//百度地图------改变城市地图
			changeMap(cityData){
				this.BaiduSmartSearch();
				this.Area = cityData.name;

				let level;
				if (this.Area.indexOf("全球") != -1) {
					level = 3
				}
				else if (this.Area.indexOf("全国") != -1) {
					level = 5
				} else if (this.Area.indexOf("省") != -1) {
					level = 9
				} else {
					level = 12
				}
				//console.log(cityData.point);
				let Mpoint = this.getMapPoint(cityData.point);
				this.centerAndZoom(Mpoint, level);
			},
			//测距
			ranging(){
				if(this.IsActive.ranging){
					this.showError("_测距工具已关闭_")
					this.myDis.close();
					this.IsActive.ranging=false;
				}else {
					this.showError("_测距工具已开启_,_左键单击地图测距_,_左键双击地图关闭测距_")
					this.myDis.open();
					this.IsActive.ranging=true;
				}
			},
			//开启实时路况
			roadCondition(){
				if (!this.IsActive.road) {
					this.openRoadCondition()
					if (this.level < 7) this.showError("_实时路况已开启_,_缩放地图到省级视野以下查看_")
				} else {
					this.closeRoadCondition();
					this.showError("_实时路况已关闭_")
				}
				this.IsActive.road = !this.IsActive.road

			},
			//全图查看
			showAllMap(){
				if(this.systemID!=7){
					if (this.allPointsArr.length == 0) {
						this.showError("_暂无定位车辆_！")
					} else {
						this.setViewport(this.allPointsArr);
					}
				}else{
					let arr=[];
					let pointArr=arr.concat(this.allPointsArr,this.sitePointArr);
					if (pointArr == 0) {
						this.showError("_暂无数据_！")
					} else {
						this.setViewport(pointArr);
					}
				}

			},


			/***

			 * * *****************************     ⑵实时监控部分   ******************************
			 * */

			//显示实时车辆点图标和文字
			getLatelyData(data, points){
				let allData=this.deepCopy(data);
				let allPoints=this.deepCopy(points);
				let _this=this;


				// console.log(1,window.Instance("TANGRAM__1"));
				// console.log(window.$BAIDU$._instances);
				// let wbi=window.$BAIDU$._instances;
				// for (const key in wbi) {
				// 	if (wbi.hasOwnProperty(key)) {
				// 		console.log("key:",key,"value:",wbi[key]);
				// 		BMapLib.EventWrapper.clearInstanceListeners(wbi[key]);
				// 		wbi[key]=new Object();
						
				// 	}
				// }

				// console.log(window.$BAIDU$);
				window.$BAIDU$._instances={};
				//this.MarkerClusterer.removeMarkers(this.markersArr);
				this.MarkerClusterer.clearMarkers();
				this.infoWindowListenerOpen=[];
				this.map.clearOverlays();
				this.listenerArr=[];

				this.googleInfoWindow=[];
				this.markersArr=[];
				this.infowindowArr=[];

				this.latelyData = allData;
				this.initPointsData=allPoints;
				this.allPointsArr = this.parsePointsArr(allPoints);
				let item=null,
					marker=null;
				if (allPoints.length != 0)  {
					for (var i = 0; i < allData.length; i++) {
						item = allData[i];

						if (item.point.lng >= -180 && item.point.lng <= 180 && item.point.lat >= -90 && item.point.lat <= 90 && item.point.lng != 0 && item.point.lat != 0) {
							//this.showLately(item, i);
							marker=this.showLately(item, i);
							//
							this.markersArr.push(marker);
							item=null;
						} else{
							this.infowindowArr.push(null);
							this.latelyArr.push(null);
						};
					};
				
					this.MarkerClusterer.addMarkers(this.markersArr);
					//如果 openInfowindowIndex不为空 打开对应的infowindow
					console.log("开启infowindow的index",this.openInfowindowIndex);
					let n=this.openInfowindowIndex;
					if(n!==null){

						if(typeof data[n]=="undefined") n=0;
						let obj = {address: ''};
						
						let point = allData[n].point;
						_this.geocoder(_this.$store.state.mapType, point, obj, "address", function () {
							$(".car-address").eq(0).html(obj.address)
						});

						this.openinfowindow(n);
					}
					n=null;
					//console.log(this.latelyArr);
				}
			},
			//显示实时车辆点
			showLately(data, index){
				let _this = this,
				    point = this.getMapPoint(data.point),
					url=null,
					imgUrl = null,
					temp = "",
					status=null,
					alarmText = "";
				
				if(data.FAssetTypeID==704||data.FAssetTypeID==714||data.FAssetTypeID==750||data.FAssetTypeID==716||data.FAssetTypeID==751){
					url="/static/img/xjaddpic/";
					switch(data.type){
						case 0:
							url+="container_blue.png";
							break;
						case 1:
							url+="container_green.png";
							break;
						case 2:
							url+="container_yellow.png";
							break;
						case 3:
							url+="container_grey.png";
							break;
						case 4:
							url+="container_red.png";
							break;
					}
				}else{
					url = this.iconUrlFun(data.direction, data.type);
				}
/* 				if (this.$store.state.choiceSystemID != 6){
					url = this.iconUrlFun(data.direction, data.type);
				}else {
					url="/static/img/xjaddpic/";
					switch(data.type){
						case 0:
							url+="container_blue.png";
							break;
						case 1:
							url+="container_green.png";
							break;
						case 2:
							url+="container_yellow.png";
							break;
						case 3:
							url+="container_grey.png";
							break;
						case 4:
							url+="container_red.png";
							break;
					}
				}; */

/* 				switch (this.$store.state.choiceSystemID) {
					case 1:
						imgUrl = "truck.png";
						break;
					case 2:
						imgUrl = "EL.png";
						break;
					case 3:
						imgUrl = "CCL.png";
						break;
					case 4:
						imgUrl = "motorcade.png";
						break;
					case 6:
						imgUrl = "container.png";
						break;
					case 7:
						imgUrl = "dispatching.png";
						break;
				};
 */
				let text=data.FVehicleName+'  (' + data.assetID + ')';
				let color = null;
				switch (data.type) {
					case 1:
						color = "#07d703"
						break;
					case 2:
						color = "#df8001"
						break;
					case 3:
						color = "#838383"
						break;
					case 4:
						color = "#d9161a"
						break;
				};


				let textLabel = this.setMapLabel(text, color,"monitor")

				let iconWidth=34,iconHeight=34;
				if (data.FAssetTypeID==701||data.FAssetTypeID==735||data.FAssetTypeID==740) {
					let status;
					imgUrl = "EL.png";
					if (data.FLockStatus) {
						status = "_开锁_"
					} else {
						status = "_上锁_"
					}
					temp+=`<div class="BMap_bubble_header">
							<img src="/static/img/carIcon/${imgUrl}">
							&nbsp;&nbsp;${data.FVehicleName}&nbsp;&nbsp;[${data.assetID}]</div>
							<div class="BMap_bubble_text">
							<table>
								<tbody>
									<tr>
										<td class="font-bolder text-right">_公司简称_：</td><td class="link-black">${data.company}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_锁状态_：</td>
										<td class="link-black">${status}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_里程_：</td><td class="link-black">${data.mileage}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_温度_：</td><td class="link-black">${data.coldChainEquipment?data.coldChainEquipment:"--"}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_速度_：</td><td class="link-black">${data.speed}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_电量_：</td><td class="link-black">${data.batteryPercent}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_更新时间_：</td><td class="link-black">${data.time}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_位置_：</td><td class="link-black car-address" lng="${data.point.lng}" lat="${data.point.lat}">${data.address}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div style="width:100%;height:25px;">
							<a carID="${data.ID}" carName="${data.assetID}"  class="InfoWindow_btn monitor cursor-pointer" title="_轨迹回放_"><i></i></a>
							<a class="InfoWindow_btn road cursor-pointer" title="_路况_"><i></i></a>`
						if(_this.remoteUnlockLimits==1){
							temp +=`<a class="InfoWindow_btn" assetid="${data.assetID}" guid="${data.ID}" title="_开锁_" id="locking">
							<i class="img-icon monitor-icon icon-key"></i></a>`;
						};
						temp +=`</div>`;
				}else if(data.FAssetTypeID==704||data.FAssetTypeID==714||data.FAssetTypeID==750||data.FAssetTypeID==716||data.FAssetTypeID==751){
					imgUrl = "container.png";
					temp += ` <div class="BMap_bubble_header"><img src="/static/img/carIcon/${imgUrl}">&nbsp;&nbsp;${data.name}&nbsp;&nbsp;[${data.assetID}]</div>
					<div class="BMap_bubble_text">
						<table>
							<tbody>
								<tr>
									<td class="font-bolder text-right">_公司简称_：</td><td class="link-black">${data.company}</td>
								</tr>
								<tr>
									<td class="font-bolder text-right">_内外温度_：</td><td class="link-black">${data.FTemperature2} &nbsp;℃&nbsp;/&nbsp;${data.FTemperature1}&nbsp;℃&nbsp;</td>
								</tr>`
								if(data.FAssetTypeID==714||data.FAssetTypeID==716){
									temp+=`<tr>
											<td class="font-bolder text-right">_空满载状态_：</td><td class="link-black">${data.FIsLoaded}</td>
										  </tr>`
								}else if(data.FAssetTypeID==750||data.FAssetTypeID==716||data.FAssetTypeID==751){
									temp+=`<tr>
											<td class="font-bolder text-right">_箱门开关状态_：</td><td class="link-black">${data.FIsOpenDoor}</td>
										  </tr>`
								}
								temp+=`
												<tr>
													<td class="font-bolder text-right">_电量_：</td><td class="link-black">${data.batteryPercent}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_更新时间_：</td><td class="link-black">${data.time}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_位置_：</td><td class="link-black car-address" lng="${data.point.lng}" lat="${data.point.lat}">${data.address}</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div style="width:100%;height:25px;">
										<a carID="${data.ID}" carName="${data.assetID}"  class="InfoWindow_btn monitor cursor-pointer" title="_轨迹回放_"><i></i></a>
										<a carID="${data.ID}" class="InfoWindow_btn carinformation cursor-pointer" title="_车辆详情_"><i></i></a>
										<a class="InfoWindow_btn road cursor-pointer" title="_路况_"><i></i></a>
									</div>`
				}else{
					imgUrl = "truck.png";
					temp+=`<div class="BMap_bubble_header">
							<img src="/static/img/carIcon/${imgUrl}">
							&nbsp;&nbsp;${data.FVehicleName}&nbsp;&nbsp;[${data.assetID}]</div>
							<div class="BMap_bubble_text">
							<table>
								<tbody>
									<tr>
										<td class="font-bolder text-right">_公司简称_：</td><td class="link-black">${data.company}</td>
									</tr>`
									if(data.FAssetTypeID==703){
										temp+=`<tr>
													<td class="font-bolder text-right">_厢体状态_：</td><td class="link-black">${data.containerStatus}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_接甩挂状态_：</td><td class="link-black">${data.couplingStatus == 1 ? "_接挂_" : "_甩挂_"}</td>
												</tr>
												`
									}
									temp+=`<tr>
										<td class="font-bolder text-right">_里程_：</td><td class="link-black">${data.mileage}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_温度_：</td><td class="link-black">${data.coldChainEquipment?data.coldChainEquipment:"--"}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_速度_：</td><td class="link-black">${data.speed}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_电量_：</td><td class="link-black">${data.batteryPercent}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_更新时间_：</td><td class="link-black">${data.time}</td>
									</tr>
									<tr>
										<td class="font-bolder text-right">_位置_：</td><td class="link-black car-address" lng="${data.point.lng}" lat="${data.point.lat}">${data.address}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div style="width:100%;height:25px;">
							<a carID="${data.ID}" carName="${data.assetID}"  class="InfoWindow_btn monitor cursor-pointer" title="_轨迹回放_"><i></i></a>
							<a carID="${data.ID}" class="InfoWindow_btn carinformation cursor-pointer" title="_车辆详情_"><i></i></a>
							<a class="InfoWindow_btn road cursor-pointer" title="_路况_"><i></i></a>
						</div>`
				}
				let marker = this.setMapMarker(point, url, 300, iconWidth, iconHeight, textLabel,true);
				let infoWindow=this.setInfoWindow(marker, temp, function () {
					let obj = {address: ''};
					let address =  $(".car-address").eq(0);
					console.log(address);
					_this.changeStatusDataIndex(data.markerIndex);
					let point = {lng: address.attr("lng"), lat: address.attr("lat")}
					switch (_this.mapType) {
						case 0:
							$(".monitor").on("click", function () {
								_this.linkHistorical($(this))
							});
							$(".road").on("click", function () {
								_this.roadCondition()
							});
							$(".carinformation").on("click", function () {
								let ID = $(this).attr("carID");
								_this.showCarInfo(ID)
							});
							_this.geocoder(_this.$store.state.mapType, point, obj, "address", function () {
								address.html(obj.address);
								//data.address=obj.address;
							});
							if(_this.systemID===2||_this.systemID===7){
								$("#locking").on("click", function () {
									_this.linkUnlock($(this))
								});
							}
							break;
						case 1:
							let monitor = document.getElementsByClassName("monitor")[0];
							let road = document.getElementsByClassName("road")[0];
							let carinformation = document.getElementsByClassName("carinformation")[0];
							let locking = document.getElementById("locking");
							_this.geocoder(_this.$store.state.mapType, point, obj, "address", function () {
								
								if(address.html()==="_获取位置信息中_" || address.html()==="_获取位置_"){
									address.html(obj.address);  
									data.address=obj.address;
								}
							});

							google.maps.event.addDomListener(monitor, "click", function () {

								//console.log($(this).attr("carId"))
								_this.linkHistorical($(this))
							});
							google.maps.event.addDomListener(road, "click", function () {
								_this.roadCondition()
							});

							if(_this.systemID===1||_this.systemID===4){
								google.maps.event.addDomListener(carinformation, "click", function () {
									let ID = $(this).attr("carID");
									_this.showCarInfo(ID)
								});
							};
							if(_this.systemID===2||_this.systemID===7){
								google.maps.event.addDomListener(locking, "click", function () {
									_this.linkUnlock($(this))
								});
							};
							break;
					};
				});

				let infoWindowIndex=index;
				switch (this.mapType) {
					case 0:
						infoWindow.addEventListener("open",function(){
							//获取当前打开的infowindow   index
							_this.openInfowindowIndex=index;
						});
						infoWindow.addEventListener("clickclose",function(e){
							//关闭时 初始化index
							_this.openInfowindowIndex=null;
						})
				        break;
					case 1:
						infoWindow.addListener("domready",function(){
							//获取当前打开的infowindow   index
							_this.openInfowindowIndex=index;
						});
						infoWindow.addListener("closeclick",function(e){
							//关闭时 初始化index
							_this.openInfowindowIndex=null;
						})
						break;

				};

/* 				this.infowindowArr.push(infoWindow);
				this.latelyArr.push(marker);
				this.markersArr.push(marker); */
				return marker
			},
			//setInfoWindow  设置信息框
			setInfoWindow(marker, temp, callback){
				let _this = this,
					infoWindow;
				switch (this.mapType) {
					case 0:
						infoWindow = new BMap.InfoWindow(temp,{
							height:0
						});  // 创建信息窗口对象
						marker.addEventListener("click", function () {
							this.openInfoWindow(infoWindow);
						    //图片加载完毕重绘infowindow
							document.getElementById('map-container').onload = function () {
								infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
							}
							if (callback != null && callback != "") callback();
						});
						break;
					case 1:
						infoWindow = new google.maps.InfoWindow({
							content: temp,
						});
						this.googleInfoWindow.push(infoWindow);
						this.map.addListener('click', function () {
							infoWindow.close()
						});
						google.maps.event.addListener(marker, 'click', function () {
							_this.googleInfoWindow.map(function (item) {
								item.close()
							});
							infoWindow.open(this.map, marker);
							google.maps.event.addListener(infoWindow, "domready", function () {
								if (callback != null && callback != "") callback();
							});
						});
						break;
				}
				return infoWindow;
			},
			//实时监控显示状态栏
			changeStatusDataIndex(index){
				this.$emit('changeStatusDataIndex',index)
			},
			//显示所选车辆位置
			showCarPlace(data){
				if(data==null){
					this.closeinfowindow(this.openInfowindowIndex);
					this.openInfowindowIndex=null;
					return
				};
				let Mpoint = this.getMapPoint(data.point);
				//由于聚合禁用了 move事件，必须通过缩放来重绘marker
				this.centerAndZoom(Mpoint, 12);
				this.centerAndZoom(Mpoint, 13);
				this.getArea(Mpoint, 13);
				this.showChoiceIcon(Mpoint);
				if(!isNaN(data.markerIndex)){
					this.openinfowindow(data.markerIndex);
				};
			},
			//打开infowindow
			openinfowindow(index){
				let _this=this;
				//console.log(this.latelyArr[index]);
				switch(this.mapType){
					case 0:
						//百度触发marker 点击事件方法
						if(this.latelyArr[index]&&this.latelyArr[index].V) this.latelyArr[index].V.click()
						break;
					case 1:
						//google触发marker 点击事件方法
						new google.maps.event.trigger(_this.latelyArr[index], 'click');
						break;

				}
			},
			//关闭infowindow
			closeinfowindow(index){
				switch(this.mapType){
					case 0:
						//百度触发marker 点击事件方法
						this.map.closeInfoWindow()
						break;
					case 1:
						this.googleInfoWindow[index].close()
						break;

				}
			},

			//显示选中效果
			showChoiceIcon(Mpoint){
				let _this = this;
				let url;
				//console.log("支持apng吗",_this.apng_supported);
				if(_this.apng_supported){
					url = "/static/img/focus.png";
				}else {
					url = "/static/img/focus.gif";
				}
				let marker = this.setMapMarker(Mpoint, url, -1, 72, 72)
				setTimeout(function () {
					_this.mapRemoveOverlay(marker);
				}, 1500)
			},
			//清除实时车辆图标和文字
			deleteLately(){
				this.removeListener(this.listenerArr,this.markersArr);
				this.removeOverlay(this.markersArr);
				this.removeOverlay(this.infowindowArr);
				this.removeOverlay(this.latelyArr);
				this.removeOverlay(this.playPointArr);
				this.MarkerClusterer.clearMarkers();
				this.googleInfoWindow.length=0;
				this.initPointsData.length=0;
				this.allPointsArr.length=0;
				this.latelyData.length=0;

			},
			//跳转历史回放
			linkHistorical(obj){
				let ID = $(obj).attr("carID");
				let name = $(obj).attr("carName");
				let menuData = {tabsText: "_轨迹回放_", router: "historical_route"};
				this.$store.commit('changeRoute',menuData)
				this.$router.push({name: "historical_route", params: {ID: ID, name: name}})
			},
			//显示_车辆详情_
			showCarInfo(ID){
				if(this.systemID==6){
					this.$refs.conDetail.getConInfo(ID)
				}else{
					this.$refs.velDetail.getVelInfo(ID)
				}

			},

			//跳转远程开锁
			linkUnlock(obj){
				let assetID = $(obj).attr("assetid");
				let ID = $(obj).attr("guid");
				//此处调用父级组件Monitor中方法openLockBox
				this.$emit('openLockBox',{assetID:assetID,ID:ID})
			},

			/***
			 * * ******************************   ⑶历史轨迹部分    **************************************************
			 * */

			//绘制普通mark点
			setMark(point){
				let Mpoint = this.getMapPoint(point);
				if (this.searchResult.length != 0) this.removeOverlay(this.searchResult);
				let marker = this.setInitMarker(Mpoint)
				this.centerAndZoom(Mpoint, 15);
				this.searchResult.push(marker);
			},
			//绘制普通mark点(多个)
			setMarks(items){
				let _this=this;
				this.removeOverlay(this.remoteUnlockMarks);
				this.remoteUnlockMarks=[];
				console.log(items,"000")
				for (let i = 0; i < items.length; i++) {
					const obj = items[i];		
					let point = _this.parsePoint(_this.$store.state.globalMapType, { lat: parseFloat(obj.FLatitude), lng: parseFloat(obj.FLongitude) });
					let Mpoint = this.getMapPoint(point);
					let marker = this.setInitMarker(Mpoint);
					let temp = `<div class="BMap_bubble_header">_电子锁_ ID:${obj.FAssetID}</div>
								<div class="BMap_bubble_text">
									<div>_地址_：<span class="car-address"></span></div>
									<div>_定位时间_：${_this.parseGMT(obj.FGPSDateTime)}</div>
								</div>`;

					let infowindow = this.setInfoWindow(marker,temp,function(){
						let addressObj = {address: ''};
						_this.geocoder(_this.$store.state.mapType, Mpoint, addressObj, "address", function () {
								$(".car-address").eq(0).html(addressObj.address);
						});
					});
					this.remoteUnlockMarks.push(marker);
						
				}
			},
			/*
			 *	获取图标路径
			 *   direction 坐标方向
			 *   toggle 显示图标类型  0运行车辆 1 车辆行驶方向标记点  2停止车辆  3报警车辆 4离线车辆
			 * */
			iconUrlFun(direction, toggle) {
				let direc = parseInt((parseInt(direction) + 22) / 45);
				let carType = null;
				switch (toggle) {
					case 0:
						switch (direc) { //车辆行驶方向标记点
							case 0:
								return "/static/img/carIcon/north.png";
							case 1:
								return "/static/img/carIcon/northeast.png";
							case 2:
								return "/static/img/carIcon/east.png";
							case 3:
								return "/static/img/carIcon/southeast.png";
							case 4:
								return "/static/img/carIcon/south.png";
							case 5:
								return "/static/img/carIcon/southwest.png";
							case 6:
								return "/static/img/carIcon/west.png";
							case 7:
								return "/static/img/carIcon/northwest.png";
							default:
								return "/static/img/carIcon/north.png";
						}
						break;
					case 1:
						carType = "/static/img/xjaddpic/greencar"
						break;
					case 2:
						carType = "/static/img/xjaddpic/purplecar"
						break;
					case 3:
						carType = "/static/img/xjaddpic/greycar"
						break;
					case 4:
						carType = "/static/img/xjaddpic/redcar"
						break;
					case 16:
						carType = "/static/img/xjaddpic/yellowcar"
						break;
					default:
				};
				switch (direc) {
					case 0:
						return carType + "_north.gif";
					case 1:
						return carType + "_northeast.gif";
					case 2:
						return carType + "_east.gif";
					case 3:
						return carType + "_southeast.gif";
					case 4:
						return carType + "_south.gif";
					case 5:
						return carType + "_southwest.gif";
					case 6:
						return carType + "_west.gif";
					case 7:
						return carType + "_northwest.gif";
					default:
						return carType + "_north.gif";
				}
			},
			//还原路线
			showCarRoute(carPointData, points, location_points) {	// carPointData:车辆数据;points:点数据;location_points:基站定位点数据;
				this.carPointData = carPointData;
				this.initPointsData=points;
				//清除上一次绘制点
				if(this.allLineArr.length!=0) this.removeOverlay(this.allLineArr);
				if(this.locationPointsArr.length!=0) this.removeOverlay(this.locationPointsArr);

				// if(this.systemID!=6 && carPointData.length!=0) this.allMileage=carPointData[carPointData.length-1].mileage-carPointData[0].mileage;
				//转换地图坐标数组
				if(points.length !== 0){
					this.allPointsArr = this.parsePointsArr(points);
					let startPoint = this.allPointsArr[0];
					let endPoint = this.allPointsArr[this.allPointsArr.length - 1];

					let strokeStyle="solid";
					let start_img,end_img;
					if(this.$store.state.language=="CN"){
						start_img="p_start.png";
						end_img="p_end.png";
					}else {
						start_img="p_start_en.png";
						end_img="p_end_en.png";
					}

					let startMarker = this.setMapMarker(startPoint, "/static/img/carIcon/"+start_img, 4, 22, 29);
					let endMarker = this.setMapMarker(endPoint, "/static/img/carIcon/"+end_img, 5, 22, 29);

					let option = {
						strokeColor: "#18a45b",
						strokeWeight: 6, //边线的宽度，以像素为单位。
						strokeOpacity: 1, //边线透明度，取值范围0 - 1。
						strokeStyle:strokeStyle,
						zIndex: 1
					};

					//设置线路
					let line = this.setMapline(this.allPointsArr, option);

					this.allLineArr.push(line, startMarker, endMarker)
					//设置视图
					//this.setViewport(this.allPointsArr);
					//绘制间距图标
					this.showCarMileagePoint(0);
					//暂停播放
					clearInterval(this.playControl);
					this.playNumber = 0;
				}
				if(location_points && location_points.length !== 0){
					this.location_points = this.filterLocationPoint(location_points);
					if(this.options.showLocation){
						for (let i=0;i<this.location_points.length;i++){
							let locationPoints = this.setMapMarker(this.location_points[i], "/static/img/carIcon/track_base_location.png", 4, 30, 30);
							this.locationPointsArr.push(locationPoints);
						}
					}
				}


			},
			// 过滤掉位置差不多的基站定位点
			filterLocationPoint(locationPoints){
				let pointArr = [];
				let rateArr = [];
				let rate = (locationPoints[0].lat/locationPoints[0].lng).toFixed(5);
				rateArr.push(rate);
				pointArr.push(locationPoints[0]);
				for (let i=0;i<locationPoints.length;i++){
					let realRate = (locationPoints[i].lat/locationPoints[i].lng).toFixed(5);
					if(rate !== realRate && $.inArray(realRate,rateArr)===-1){
						rate = realRate;
						rateArr.push(rate);
						pointArr.push(locationPoints[i]);
					}
				}
				return pointArr
			},
			// 将基站点和GPS点连起来
			showLocationLine(){
				let points = [],
						location_points = [];
				for (let i=0;i<this.carPointData.length;i++){
					if (this.carPointData[i].point.lng != 0 && this.carPointData[i].point.lat != 0) {
						if(this.options.showLigature){
							points.push(this.carPointData[i].point);
							if (this.carPointData[i].locationType === 2) {
								location_points.push(this.carPointData[i].point);
							}
						}else {
							if (this.carPointData[i].locationType !== 2) {
								points.push(this.carPointData[i].point);
							}else {
								location_points.push(this.carPointData[i].point);
							}
						}
					}
				}
				this.showCarRoute(this.carPointData,points,location_points);
			},
			// 是否显示基站点
			showLocation(){
				console.log()
				if(!this.options.showLocation){
					if(this.locationPointsArr.length!=0) this.removeOverlay(this.locationPointsArr);
				}else {
					for (let i=0;i<this.location_points.length;i++){
						let locationPoints = this.setMapMarker(this.location_points[i], "/static/img/carIcon/track_base_location.png", 4, 30, 30);
						this.locationPointsArr.push(locationPoints);
					}
				}
			},
			//设置总时长 总里程
			setAllTime(allTime){
				this.allRunTime = allTime;
			},
			//绘制路程标记点
			showCarMileagePoint(interval){
				Pace.restart();
				//删除上次的点
				this.removeOverlay(this.intervalArr)
				let carPoint;
				let mapPointsArr;
				let marker;
				let allMileage;
				if(this.carPointData.length!=0){
					carPoint = this.carPointData;
					mapPointsArr = this.allPointsArr;
					allMileage=carPoint[carPoint.length-1].mileage - carPoint[0].mileage;
					if(allMileage===0) return;
				}else {
					return
				}
				for (let i = 0; i < carPoint.length; i++) {
					//避免两端画点
					if (i != 0 && i != carPoint.length - 1) {
						if (interval == 0) interval=Math.ceil(allMileage/10);
						if (carPoint[i].mileage != carPoint[i + 1].mileage && (carPoint[i].mileage - carPoint[0].mileage) % interval == 0) {
							//根据公里数选择点
							let url = this.iconUrlFun(this.carPointData[i].direction, 0);
							if(mapPointsArr[i])marker = this.setMapMarker(mapPointsArr[i], url, 1, 24, 24)
							this.intervalArr.push(marker);
							this.allLineArr.push(marker);
						}
					}
				}
			},
			//高亮显示运行线路(旧 在轨迹上描红)
/*
			highlightShowPath(startIndex, endIndex){
				if (this.runLineArr.length != 0)this.removeOverlay(this.runLineArr)
				let start = startIndex;
				let end = endIndex;
				//console.log(start,end);
				let highLightLine = this.allPointsArr.slice(start, end)
				//console.log(highLightLine);
				let option = {
					strokeColor: "#21b42c",
					strokeWeight: 6, //边线的宽度，以像素为单位。
					strokeOpacity: 1, //边线透明度，取值范围0 - 1。
					zIndex: 10
				};
				//设置线路
				let line = this.setMapline(highLightLine, option);
				//console.log(line);
				this.allLineArr.push(line);
				this.runLineArr.push(line);
				//设置视图
				this.setViewport(highLightLine);
			},
*/
			//地图上显示运行段开始和结束标记
			
			mapShowRunPath(data){
				if (this.runLineArr.length != 0)this.removeOverlay(this.runLineArr)
				let startPoint = this.getMapPoint(data.startPoint);
				let endPoint = this.getMapPoint(data.endPoint);
				let startUrl="/static/img/carIcon/",
					endUrl="/static/img/carIcon/";
				if(this.systemID==2){
					startUrl+="lock.png";
					endUrl+="unlock.png"
				}else {
					startUrl+="run_start.png";
					endUrl+="run_end.png"
				}

				//设置起始图标
				let startMarker = this.setMapMarker(startPoint, startUrl, 100, 22, 22)
				let endMarker = this.setMapMarker(endPoint, endUrl, 100, 22, 22)
				this.showChoiceIcon(startPoint);
				this.showChoiceIcon(endPoint);

				//线路描红
				let start = data.startIndex;
				let end = data.endIndex;
				console.log("开始结束点index",start,end);
				let highLightLine = this.allPointsArr.slice(start, end)
				//console.log(highLightLine);
				let option = {
					strokeColor: "#CC3333",
					strokeWeight: 6, //边线的宽度，以像素为单位。
					strokeOpacity: 1, //边线透明度，取值范围0 - 1。
					zIndex: 12
				};
				//设置线路
				let line = this.setMapline(highLightLine, option); 
				this.runLineArr.push(startMarker,endMarker,line);
				//设置视图
				this.setViewport([startPoint,endPoint]);
				
			},
			//绘制停车标记点
			showCarStopPoint(StopData){
				this.carStopData = StopData;
				this.setStopMarker();
			},
			//绘制停车点marker
			setStopMarker(){
				console.log(this.carStopData);
				if (this.carStopData.length == 0) return
				let _this = this;
				if (this.stopArr.length != 0) this.removeOverlay(this.stopArr)
				if (!_this.options.showStopTime) return;
				this.carStopData.map(function (item, index) {
					//let pointIndex = _this.stopPointIndex[index]
					let MPoint = _this.getMapPoint(item.point);
					let url = "/static/img/carIcon/track_stop.png";
					let marker;
					let RowNoMarker;
					let temp = `<i class="trackRowNum" style="background-color: #449c98">${index+1}</i>${item.startTime}`;
					let color = "white";
					let label = _this.setMapLabel(temp, color);
					marker = _this.setMapMarker(MPoint, url, 15, 24, 24, label);
					_this.stopArr.push(marker);
					let template = `<div class="BMap_bubble_text Track_bubble_text">
										<table>
											<tbody>
												<tr>
													<td class="font-bolder text-right Width-25">_公司简称_：</td><td class="link-black">${item.shortName}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_司机_：</td><td class="link-black">${item.driverName}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_开始时间_：</td><td class="link-black">${item.startTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_结束时间_：</td><td class="link-black">${item.endTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_停车时长_：</td><td class="link-black">${item.stopTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_停车位置_：</td><td id="stopCar-address${index}" class="link-black" lng="${item.point.lng}" lat="${item.point.lat}">${item.address}</td>
												</tr>
											</tbody>
										</table>
									</div>`
					_this.setInfoWindow(marker,template,function(){
						let obj = {address: ''};
						let address = $("#stopCar-address"+index);
						let point = {lng: address.attr("lng"), lat: address.attr("lat")};
						_this.geocoder(_this.$store.state.mapType, point, obj, "address", function () {
							address.html(obj.address);
							//data.address=obj.address;
						});
					});
				})
			},
			//绘制选中停车点
			showActiveStopPoint(point){
				let MPoint = this.getMapPoint(point);
				this.centerAndZoom(MPoint, 20);
				this.getArea(MPoint, 20);
				this.showChoiceIcon(MPoint);
			},
			//绘制报警点
			showCarAlarmPoint(StopData){
				if(StopData.length==0) return
				let _this=this;
				if (this.alarmArr.length != 0) this.removeOverlay(this.alarmArr)
				if (!_this.options.showAlarm) return;
				StopData.map(function (item, index) {
					let MPoint = _this.getMapPoint(item.s_point);
					let url = "/static/img/carIcon/track_alarm.png";
					let marker;
					let temp = `<i class="trackRowNum" style="background-color: #44759c">${index+1}</i>${item.startTime}`;
					let color = "white";
					let label = _this.setMapLabel(temp, color);
					marker = _this.setMapMarker(MPoint, url, 15, 24, 24, label);
					_this.alarmArr.push(marker);
					let template = `<div class="BMap_bubble_text Track_bubble_text">
										<table>
											<tbody>
												<tr>
													<td class="font-bolder text-right Width-25">_司机_：</td><td class="link-black">${item.driverName}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_超速描述_：</td><td id="alarmDescribe${index}" class="link-black"></td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_开始时间_：</td><td class="link-black">${item.startTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_结束时间_：</td><td class="link-black">${item.endTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_超速时长_：</td><td class="link-black">${item.keepTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_开始位置_：</td><td id="s-alarmCar-address${index}" class="link-black " lng="${item.s_point.lng}" lat="${item.s_point.lat}">${item.address}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_结束位置_：</td><td id="e-alarmCar-address${index}" class="link-black" lng="${item.e_point.lng}" lat="${item.e_point.lat}">${item.address}</td>
												</tr>
											</tbody>
										</table>
									</div>`
					_this.setInfoWindow(marker,template,function(){
						let obj = {s_address: '',e_address:''};
						let s_address = $("#s-alarmCar-address"+index);
						let e_address = $("#e-alarmCar-address"+index);
						let alarmDescribe = $("#alarmDescribe"+index);
						let s_point = {lng: s_address.attr("lng"), lat: s_address.attr("lat")};
						let e_point = {lng: e_address.attr("lng"), lat: e_address.attr("lat")};
						_this.geocoder(_this.$store.state.mapType, s_point, obj, "s_address", function () {
							s_address.html(obj.s_address);
							let str = "_平均速度_:"+item.averageSpeed+"km/h,"+"_最大速度_:"+item.maxSpeed+"km/h,"+"_限速_:";
							if(obj.s_address.indexOf("高速") !== -1){
								alarmDescribe.html(str + item.speedLimit.highRoadConfig+"km/h");
							}else {
								alarmDescribe.html(str + item.speedLimit.ordinaryRoadConfig+"km/h");
							}
						});
						_this.geocoder(_this.$store.state.mapType, e_point, obj, "e_address", function () {
							e_address.html(obj.e_address);
						});
					});
				})
			},
			//绘制选中开关锁点
			showActiveLockPoint(point){
				let MPoint = this.getMapPoint(point);
				this.centerAndZoom(MPoint, 20);
				this.getArea(MPoint, 20);
				this.showChoiceIcon(MPoint);
			},
			// 绘制开关锁点
			showCarLockPoint(LockData){
				if(LockData.length==0) return
				let _this=this;
				if (this.lockArr.length != 0) this.removeOverlay(this.lockArr)
				if (!_this.options.showAlarm) return;
				LockData.map(function (item, index) {
					let MPoint = _this.getMapPoint(item.s_point);
					let url = "/static/img/carIcon/track_lock.png";
					let marker;
					let temp = `<i class="trackRowNum" style="background-color: #44499c">${index+1}</i>${item.startTime}`;
					let color = "white";
					let label = _this.setMapLabel(temp, color);
					marker = _this.setMapMarker(MPoint, url, 15, 24, 24, label);
					_this.lockArr.push(marker);
					let template = `<div class="BMap_bubble_text Track_bubble_text">
										<table>
											<tbody>
												<tr>
													<td class="font-bolder text-right">_上锁时间_：</td><td class="link-black">${item.startTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_上锁位置_：</td><td class="link-black" id="s-lockCar-address${index}" class="link-black" lng="${item.s_point.lng}" lat="${item.s_point.lat}">${item.startAddress}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_开锁方式_：</td><td class="link-black">${item.openType}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_开锁时间_：</td><td class="link-black">${item.endTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_开锁位置_：</td><td class="link-black" id="e-lockCar-address${index}" class="link-black" lng="${item.e_point.lng}" lat="${item.e_point.lat}">${item.endAddress}</td>
												</tr>
											</tbody>
										</table>
									</div>`
					_this.setInfoWindow(marker,template,function(){
						let obj = {s_address: '',e_address:''};
						let s_address = $("#s-lockCar-address"+index);
						let e_address = $("#e-lockCar-address"+index);
						let s_point = {lng: s_address.attr("lng"), lat: s_address.attr("lat")};
						let e_point = {lng: e_address.attr("lng"), lat: e_address.attr("lat")};
						_this.geocoder(_this.$store.state.mapType, s_point, obj, "s_address", function () {
							s_address.html(obj.s_address);
						});
						_this.geocoder(_this.$store.state.mapType, e_point, obj, "e_address", function () {
							e_address.html(obj.e_address);
						});
					});
				})
			},
			//绘制选中接甩挂点
			showActiveTrailerPoint(point){
				let MPoint = this.getMapPoint(point);
				this.centerAndZoom(MPoint, 20);
				this.getArea(MPoint, 20);
				this.showChoiceIcon(MPoint);
			},
			// 绘制接甩挂点
			showCarTrailerPoint(TrailerData){
				if(TrailerData.length==0) return
				let _this=this;
				if (this.trailerArr.length != 0) this.removeOverlay(this.trailerArr)
				if (!_this.options.showAlarm) return;
				TrailerData.map(function (item, index) {
					let MPoint = _this.getMapPoint(item.point);
					let url = "/static/img/carIcon/track_trailer.png";
					let marker;
					let temp = `<i class="trackRowNum" style="background-color: #44499c">${index+1}</i>${item.startTime}`;
					let color = "white";
					let label = _this.setMapLabel(temp, color);
					marker = _this.setMapMarker(MPoint, url, 15, 24, 24, label);
					_this.trailerArr.push(marker);
					let template = `<div class="BMap_bubble_text Track_bubble_text">
										<table>
											<tbody>
												<tr>
													<td class="font-bolder text-right">_接甩挂_：</td><td class="link-black">${item.status}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_开始时间_：</td><td class="link-black">${item.startTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_结束时间_：</td><td class="link-black">${item.endTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_持续时长_：</td><td class="link-black">${item.keepTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_里程_：</td><td class="link-black">${item.mileage}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_开始位置_：</td><td class="link-black">${item.endAddress}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_结束位置_：</td><td class="link-black">${item.endAddress}</td>
												</tr>
											</tbody>
										</table>
									</div>`
					_this.setInfoWindow(marker,template);
				})
			},
			//绘制选中开关门点
			showActiveDoorPoint(point){
				let MPoint = this.getMapPoint(point);
				this.centerAndZoom(MPoint, 20);
				this.getArea(MPoint, 20);
				this.showChoiceIcon(MPoint);
			},
			// 绘制开关门点
			showCarDoorPoint(DoorData){
				if(DoorData.length==0) return
				let _this=this;
				if (this.doorArr.length != 0) this.removeOverlay(this.doorArr)
				if (!_this.options.showAlarm) return;
				DoorData.map(function (item, index) {
					let MPoint = _this.getMapPoint(item.point);
					let url = "/static/img/carIcon/track_door.png";
					let marker;
					let temp = `<i class="trackRowNum" style="background-color: #9c4449">${index+1}</i>${item.dataType === 7?item.openTime:item.closeTime}`;
					let color = "white";
					let label = _this.setMapLabel(temp, color);
					marker = _this.setMapMarker(MPoint, url, 15, 24, 24, label);
					_this.doorArr.push(marker);
					let template = `<div class="BMap_bubble_text Track_bubble_text">
										<table>
											<tbody>
												<tr>
													<td class="font-bolder text-right Width-25">_开关门次数_：</td><td class="link-black">${item.amount}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_关门时间_：</td><td class="link-black">${item.closeTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_关门位置_：</td><td id="o-doorCar-address${index}" class="link-black" lng="${item.point.lng}" lat="${item.point.lat}"></td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_开门时间_：</td><td class="link-black">${item.openTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right Width-25">_开门位置_：</td><td id="c-doorCar-address${index}" class="link-black" lng="${item.point.lng}" lat="${item.point.lat}"></td>
												</tr>
											</tbody>
										</table>
									</div>`
					_this.setInfoWindow(marker,template,function(){
						let obj = {address: ''};
						let o_address = $("#o-doorCar-address"+index);
						let c_address = $("#c-doorCar-address"+index);
						let point = {lng: o_address.attr("lng"), lat: o_address.attr("lat")};
						_this.geocoder(_this.$store.state.mapType, point, obj, "address", function () {
							if(item.dataType === 7){
								o_address.html(obj.address);
							}else {
								c_address.html(obj.address);
							}

						});
					});
				})
			},
			//绘制选中加减油点
			showActiveOilPoint(point){
				let MPoint = this.getMapPoint(point);
				this.centerAndZoom(MPoint, 20);
				this.getArea(MPoint, 20);
				this.showChoiceIcon(MPoint);
			},
			// 绘制加减油点
			showCarOilPoint(OilData){
				if(OilData.length==0) return
				let _this=this;
				if (this.oilArr.length != 0) this.removeOverlay(this.oilArr)
				if (!_this.options.showAlarm) return;
				OilData.map(function (item, index) {
					let MPoint = _this.getMapPoint(item.point);
					let url = "/static/img/carIcon/track_oil.png";
					let marker;
					let temp = `<i class="trackRowNum" style="background-color: #b663bb">${index+1}</i>${item.startTime}`;
					let color = "white";
					let label = _this.setMapLabel(temp, color);
					marker = _this.setMapMarker(MPoint, url, 15, 24, 24, label);
					_this.oilArr.push(marker);
					let template = `<div class="BMap_bubble_text Track_bubble_text">
										<table>
											<tbody>
												<tr>
													<td class="font-bolder text-right">_开始时间_：</td><td class="link-black">${item.startTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_结束时间_：</td><td class="link-black">${item.endTime}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_位置_：</td><td id="oilCar-address${index}" class="link-black" lng="${item.point.lng}" lat="${item.point.lat}">${item.address}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_加油_/_减油_：</td><td class="link-black">${item.riseOrFall}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_之前油位_(L)：</td><td class="link-black">${item.startLiter}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">_之后油位_(L)：</td><td class="link-black">${item.stopLiter}</td>
												</tr>
												<tr>
													<td class="font-bolder text-right">升数(L)：</td><td class="link-black">${item.liter}</td>
												</tr>
											</tbody>
										</table>
									</div>`
					_this.setInfoWindow(marker,template,function(){
						let obj = {address: ''};
						let address = $("#oilCar-address"+index);
						let point = {lng: address.attr("lng"), lat: address.attr("lat")};
						_this.geocoder(_this.$store.state.mapType, point, obj, "address", function () {
							address.html(obj.address);
						});
					});
				})
			},
			//显示轨迹回放点
			showPlayPoint(index){
				if (this.carPointData.length != 0 && index >= this.carPointData.length) index = this.carPointData.length - 1;
				this.playNumber = index;
				let data=this.carPointData[index],
				    Mpoint = data.point;
				
				if(typeof data.point.lng==="undefined" || typeof data.point.lat==="undefined" ||(data.point.lng==0 && data.point.lat==0)){
					this.showError("_此轨迹点无定位_");
					return
				};
				let temp = "";
				let url = null;
				if(this.systemID===6){
					url = "/static/img/xjaddpic/container_green.png";
					temp += `<span style="padding:2px 4px;">${data.time}</span>
							<span style="padding:2px 4px;">${data.FIsLoaded}</span>
							<span style="padding:2px 4px;">_箱门状态_${data.FIsOpenDoor}</span>`;
				}else{
					url = this.iconUrlFun(data.direction, 1);
					temp += "<span style='display:" + this.showOptions.showTime + ";padding:2px 4px;'>" + data.time + "</span>";
					temp += "<span style='display:" + this.showOptions.showSpeed + ";padding:2px 4px;'>" + data.speed + "km/h</span>";
					temp += "<span style='display:" + this.showOptions.showMileage + ";padding:2px 4px;'>" + data.mileage + "km</span>";
				};

				
				this.setMapCenterAndZoom(Mpoint, this.map);

				let color = "white";

				let label = this.setMapLabel(temp, color);

				this.removeOverlay(this.playPointArr);
				let marker = null;
				if(this.systemID===6){
					marker = this.setMapMarker(Mpoint, url, 50, 34, 34, label)
				}else{
					marker = this.setMapMarker(Mpoint, url, 50, 24, 24, label)
				};
				this.playPointArr.push(marker);

			},
			//清空轨迹点相关所有marker
			deleteOverlay(){
				if (this.allLineArr.length != 0) this.removeOverlay(this.allLineArr);
				if (this.locationPointsArr.length != 0) this.removeOverlay(this.locationPointsArr);
				if (this.stopArr.length != 0) this.removeOverlay(this.stopArr);
				if (this.alarmArr.length != 0) this.removeOverlay(this.alarmArr);
				if (this.lockArr.length != 0) this.removeOverlay(this.lockArr);
				if (this.trailerArr.length != 0) this.removeOverlay(this.trailerArr);
				if (this.doorArr.length != 0) this.removeOverlay(this.doorArr);
				if (this.oilArr.length != 0) this.removeOverlay(this.oilArr);
				if (this.runLineArr.length != 0)this.removeOverlay(this.runLineArr)
				if (this.latelyArr.length != 0)this.removeOverlay(this.latelyArr)
			},
			//坐标超出视野范围后 显示到视野中心
			setMapCenterAndZoom(point, map) {
				if(typeof point ==="undefined")  return;
				let Zoom, bounds;
				switch (this.mapType) {
					case 0:
						Zoom = this.map.getZoom();
						bounds = this.getViewBounds(map);
						if (bounds.ne.lng < point.lng || bounds.ne.lat < point.lat || bounds.sw.lng > point.lng || bounds.sw.lat > point.lat) {
							this.centerAndZoom(point, Zoom);
						};
						break;
					case 1:
						Zoom = this.map.getZoom();
						bounds = this.map.getBounds();
						let ne = bounds.getNorthEast();
						let sw = bounds.getSouthWest();
						let lng = point.lng();
						let lat = point.lat();
						if (ne.lng() < lng || ne.lat() < lat || sw.lng() > lng || sw.lat() > lat) {
							this.centerAndZoom(point, Zoom);
						};
						break;
				}
			},
			//高亮显示胎压报警
			/*highlightShowtyre(startTimeIndex, endTimeIndex, index){
				//this.mapRemoveOverlay(this.redPolyline);

				if (this.redPolyline.length != 0) this.removeOverlay(this.redPolyline)
				let start = startTimeIndex[index];
				let end = endTimeIndex[index];
				//console.log(start,end);
				let highLightLine = this.allPointsArr.slice(start, end)
				//console.log(highLightLine);
				let option = {
					strokeColor: "#c3140f",
					strokeWeight: 5, //边线的宽度，以像素为单位。
					strokeOpacity: 1, //边线透明度，取值范围0 - 1。
					zIndex: 20
				};
				//设置线路
				let line = this.setMapline(highLightLine, option);
				//console.log(line);
				this.allLineArr.push(line);
				this.redPolyline.push(line);
				//设置视图
				this.setViewport(highLightLine);

			},*/
			//显示站点
			showSite(data){
				let _this = this;
				this.siteData=data;
				data.map(function (item,index) {

					if(item.point.lng!==0&&item.point.lat!==0){
						_this.sitePointArr.push(item.point);
						let point = _this.getMapPoint(item.point);
						let url="static/img/dispatching/";
						let color;
						if(item.FIsFinish){
							url+="gray";
							color="#999"
						}else {
							url+="blue"
							color="#1c7feb"
						}
						url+=item.index+".png";

						let temp =`<div class="BMap_bubble_header">
									_站点_${item.index}—${item.name}
								</div>
								<div class="BMap_bubble_text ${item.img==null?'':'site-info'}">
									<table>
										<tbody>
											<tr>
												<td class="font-bolder text-right">_收货人_：</td>
												<td class="link-black">${item.contacts}</td>
											</tr>
											<tr>
												<td class="font-bolder text-right">_收货电话_：</td>
												<td class="link-black">${item.phone}</td>
											</tr>`
						if(item.FIsFinish==1) temp +=`<tr>
									<td class="font-bolder text-right">_收货时间_：</td>
									<td class="link-black">${item.FOpenLockTime}</td>
								</tr>
								<tr>
									<td class="font-bolder text-right">_耗时_：</td>
									<td class="link-black">${item.time}</td>
								</tr>
								<tr>
									<td class="font-bolder text-right">_承运人_：</td>
									<td class="link-black">${item.FCarrier}</td>
								</tr>
								<tr>
									<td class="font-bolder text-right">_开锁类型_：</td>
									<td class="link-black">${item.openType}</td>
								</tr>`
						temp+=`<tr>
								<td class="font-bolder text-right">_站点地址_：</td>
								<td class="link-black">${item.address}</td>
							</tr>
						</tbody>
					</table>`

						if(item.img!=null){
							temp+=`<div class="infoWindow-img">
												<img onclick="showImgFull()" src="${item.img[0]}"/>`;
							if(item.img.length>=2){
								for(let i=0;i<item.img.length;i++){
									if(i===0){
										temp+=`<a onclick="imgSwitcher()" imgUrl="${item.img[i]}" class="infoWindow-imgBtn active"></a>`
									}else {
										temp+=`<a onclick="imgSwitcher()" imgUrl="${item.img[i]}" class="infoWindow-imgBtn"></a>`
									}
								}
							}
							temp+=`</div>`
						}
						temp+=`</div>`;
						let textLabel = _this.setMapLabel(item.name, color,"monitor")
						let marker = _this.setMapMarker(point, url, 300, 30, 38,textLabel);
						_this.setInfoWindow(marker, temp);
						_this.latelyArr.push(marker);
					}

				})
			},
            //显示绿通
			showGreenSite(data){
				let _this = this;
				this.greenSiteData=data;
				data.map(function (item,index) {
					if(item.point.lng!==0&&item.point.lat!==0){
						_this.sitePointArr.push(item.point);
						let point = _this.getMapPoint(item.point);
						let title,url;
						if(item.FOpenReson==1){
							title="_绿通开锁_"
							url="static/img/dispatching/lv.png";
						}else{
							title="_其他开锁_"
							url="static/img/dispatching/otherOpen.png";
						}
						let temp = `<div class="BMap_bubble_header">${title}</div>
								<div class="BMap_bubble_text ${item.img==null?'':'site-info'}">
								<table>
									<tbody>
										<tr>
											<td class="font-bolder text-right">_开锁时间_：</td>
											<td class="link-black">${item.time}</td>
										</tr>
										<tr>
											<td class="font-bolder text-right">_开锁原因_：</td>
											<td class="link-black">${title}</td>
										</tr>
										<tr>
											<td class="font-bolder text-right">_站点地址_：</td>
											<td class="link-black site-address" index="${index}">${item.address}</td>
										</tr>
									</tbody>
								</table>`
						if(item.img!=null){
							temp+=`<div class="infoWindow-img">
									<img onclick="showImgFull()" src="${item.img[0]}"/>`;
							if(item.img.length>=2){
								for(let i=0;i<item.img.length;i++){
									if(i===0){
										temp+=`<a onclick="imgSwitcher()" class="active"></a>`
									}else {
										temp+=`<a onclick="imgSwitcher()"></a>`
									}
								}
							}
							temp+=`</div>`
						}
						temp+=`</div>`;

						let marker = _this.setMapMarker(point, url, 300, 22, 22);
						_this.setInfoWindow(marker, temp, function () {
							let address = document.getElementsByClassName("site-address")[0];
							let index = $(address).attr("index");
							$(address).html(_this.greenSiteData[index].address)
						});
						_this.latelyArr.push(marker);
					}
				})


			},
			/*************播放功能部分*******************/
			//播放轨迹
			playPoint(){
				let _this = this;
				if(this.isPlayBtn){
					this.isPlayBtn=false;
					this.changeActive(this.btnActive, 0);
					clearInterval(this.playControl);
					this.showPlayPoint(this.playNumber);
					function showPoint(index){
						_this.showPlayPoint(index);
						//向父组件传递
						_this.$emit("playNumber", index);
					};

					showPoint(this.playNumber);
					
					this.playControl = setInterval(function () {

						if (_this.playNumber >= _this.carPointData.length - 2) {
							clearInterval(_this.playControl);
							_this.playNumber = _this.carPointData.length - 2;
							_this.changeActive(_this.btnActive, 1);
						}
						_this.playNumber++;
						showPoint(_this.playNumber);

					}, 1000 / this.playSpeed);
				}else{
					this.isPlayBtn=true;
					this.changeActive(this.btnActive, 1);
					clearInterval(this.playControl);
				}
			},
			//停止轨迹回放
			overPlayPoint(){
				this.changeActive(this.btnActive, 2);
				this.isPlayBtn=true;
				clearInterval(this.playControl);
				this.playNumber = 0;
				this.removeOverlay(this.playPointArr);
			},
			//暂停播放
			stopPlayPoint(){
				this.changeActive(this.btnActive, 1);
				clearInterval(this.playControl);
			},
			//增加播放速度
			addPlaySpeed(){
				this.playSpeed++;
				if (this.playSpeed > 4) this.playSpeed = 4;
				clearInterval(this.playControl);
				this.playPoint();
			},
			//减小播放速度
			subPlaySpeed(){
				this.playSpeed--;
				if (this.playSpeed < 1) this.playSpeed = 1;
				clearInterval(this.playControl);
				this.playPoint();
			},
			//快进
			forwardPlaySpeed(){
				clearInterval(this.playControl);
				this.playNumber += parseInt(this.carPointData.length / 10);
				if (this.playNumber >= this.carPointData.length - 2) this.playNumber = this.carPointData.length - 2;
				this.playPoint();
			},
			//快退
			backwardsPlaySpeed(){
				clearInterval(this.playControl);
				this.playNumber -= parseInt(this.carPointData.length / 10);
				if (this.playNumber <= 0) this.playNumber = 0
				this.playPoint();
			},
			//滑动进度条
			moveProgressbar(){
				let left = parseInt($("#progress-yuan").css("left")) + 8,
					width = $("#my-progressbar").width();
				this.playNumber = Math.floor(left / width * this.carPointData.length);
			},


			/***
			 * * ⑷围栏部分********************************************************************************
			 * */


			/***********公共绘图方法*************************/
			//rgba转换成 rgb 和 alpha
			transformRGBA(rgba){
				let reg = /[^\(\)]+(?=\))/g;
				let arr = reg.exec(rgba)[0].split(",");


				let rgb = "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
				if (arr[3] == undefined || arr[3] == "")arr[3] = 1;
				return {rgb: rgb, alpha: arr[3]}
			},
			//textarea长度验证
			textareaMaxLength (event){
				var area = $(event.target);
				var max = parseInt(area.attr("maxlength"), 10); //获取maxlength的值
				if (max > 0) {
					if (area.val().length > max) { //textarea的文本长度大于maxlength
						area.val(area.val().substr(0, max)); //截断textarea的文本重新赋值
					}
				}
			},
			//计算多边形近似中心点
			getCenter(path){
				let area = 0,
					Gx = 0,
					Gy = 0;// 重心的x、y
				for (let i = 1; i <= path.length; i++) {
					let iLat = path[i % path.length].lat;
					let iLng = path[i % path.length].lng;
					let nextLat = path[i - 1].lat;
					let nextLng = path[i - 1].lng;
					let temp = (iLat * nextLng - iLng * nextLat) / 2.0;
					area += temp;
					Gx += temp * (iLat + nextLat) / 3.0;
					Gy += temp * (iLng + nextLng) / 3.0;
				}
				Gx = (Gx / area).toFixed(6);
				Gy = (Gy / area).toFixed(6);
				return {lng: Gy, lat: Gx}
			},

			//绘制图形  type 1圆形 2矩形 3多边形  option（null 初始绘图/围栏类型ID 根据类型绘图）   fn绘图完成后回调函数
			makeRail(type, typeData, fn){
				this.removeOverlay(this.drawingArr);
				this.removeOverlay(this.searchResult);
				let _this = this,
					id = parseInt(type),
					drawingTool,
					option;
				if (typeData == null || typeData == "") {
					option = {
						strokeColor: "rgb(0,95,198)",
						fillColor: "rgb(255,255,255)",
						strokeWeight: "4",
						strokeOpacity: "0.6",
						fillOpacity: "0.5"
					}
				} else {
					let typeObj = _this.fenceTypeObj[typeData],
						strokeColor = this.transformRGBA(typeObj.strokeColor),
						fillColor = this.transformRGBA(typeObj.fillColor);
					option = {
						strokeColor: strokeColor.rgb,
						strokeOpacity: strokeColor.alpha,
						fillColor: fillColor.rgb,
						fillOpacity: fillColor.alpha,
						strokeWeight: "4"
					};
				};
				function drawingComplete(overlay) {
					_this.drawingArr.push(overlay);
					let closeIcon = _this.setCloseBtn(overlay);
					_this.drawingArr.push(closeIcon);
					_this.listenerMarkerClick(closeIcon, function () {
						_this.removeOverlay(_this.drawingArr);
						_this.removeOverlay(_this.searchResult);
					})
					switch (_this.mapType) {
						case 0:
							drawingTool.close();
							break;
						case 1:
							drawingTool.setMap(null);
							break;
					}
				};
				switch (this.mapType) {
					case 0:
						drawingTool = new BMapLib.DrawingManager(this.map, {
							isOpen: true,
							enableDrawingTool: false,
							enableCalculate: false,
							circleOptions: option,
							rectangleOptions: option,
							polygonOptions: option,

						})
						switch (id) {
							case 1:
								drawingTool.setDrawingMode("circle");
								break;
							case 2:
								drawingTool.setDrawingMode("rectangle");
								break;
							case 3:
								drawingTool.setDrawingMode("polygon");
								break;
						};
						drawingTool.addEventListener("circlecomplete", function (e, overlay) {
							overlay.type = "circle";
							drawingComplete(overlay)
							if (fn != null) fn();
						});
						drawingTool.addEventListener("polygoncomplete", function (e, overlay) {
							overlay.type = "polygon";
							drawingComplete(overlay)
							if (fn != null) fn();
						});
						drawingTool.addEventListener("rectanglecomplete", function (e, overlay) {
							overlay.type = "rectangle";
							drawingComplete(overlay);
							_this.$emit("deleteFence");
							if (fn != null) fn();
						});
						break;
					case 1:
						let type;
						switch (id) {
							case 1:
								type = "circle";
								break;
							case 2:
								type = "rectangle";
								break;
							case 3:
								type = "polygon";
								break;
						}
						drawingTool = new google.maps.drawing.DrawingManager({
							drawingMode: google.maps.drawing.OverlayType.MARKER,
							drawingControl: false,
							drawingControlOptions: {
								position: google.maps.ControlPosition.TOP_CENTER,
							},
							drawingMode: type,
							circleOptions: option,
							polygonOptions: option,
							rectangleOptions: option
						});
						drawingTool.setMap(this.map);
						let overlay;
						google.maps.event.addListener(drawingTool, 'overlaycomplete', function (event) {
							let overlay = event.overlay;
							overlay.type = event.type;
							drawingComplete(overlay);
							_this.$emit("deleteFence");
							if (fn != null) fn();
						});
						break;
				}
			},
			//设置关闭按钮
			setCloseBtn(overlay){
				let iconUrl = "/static/img/xjaddpic/black_close.png";
				let closePoint, bounds, ne, sw;
				switch (this.mapType) {
					case 0:
						//console.log("百度overlay", overlay.type);
						if (overlay.type == "circle") {
							closePoint = this.getMapPoint(overlay.getPath()[0]);
						} else {
							closePoint = this.getMapPoint(overlay.getPath()[1]);
						}
						break;
					case 1:
						//console.log("overlay.type", overlay.type);
						switch (overlay.type) {
							case 'circle':
								bounds = overlay.getBounds();
								ne = bounds.getNorthEast();
								sw = bounds.getSouthWest();
								let lng = (ne.lng() + sw.lng()) / 2;
								let lat = ne.lat();
								closePoint = new google.maps.LatLng({lat: lat, lng: lng});
								break;
							case 'rectangle':
								bounds = overlay.getBounds();
								ne = bounds.getNorthEast();
								closePoint = ne;
								break;
							case 'polygon':
								closePoint = overlay.getPath().getArray()[0];
								break;
						}
						//console.log("path", JSON.stringify(closePoint));
						break;
				}

				let marker = this.setMapMarker(closePoint, iconUrl,10, 16, 16);
				return marker;
			},
			//marker 监听点击事件
			listenerMarkerClick(marker, callback){
				let _this = this;
				switch (this.mapType) {
					case 0:
						marker.addEventListener("click",callback);
						break;
					case 1:
						marker.addListener("click", callback);
						break;
				}
			},

			/****************  围栏绘制方法       ***************/
			//获取服务器围栏数据
			getFenceData(){
				this.$store.commit('getFenceData',this)
			},
			//服务器返回数据绘制围栏
			showFence(data){
				this.choiceFenceType = data.fenceType;
				let _this = this;
				let points = [];
				if(this.drawingArr.length!=0) this.removeOverlay(this.drawingArr)
				if(this.fenceArr.graph.length!=0)this.removeOverlay(this.fenceArr.graph)
				if(this.fenceArr.icon.length!=0)this.removeOverlay(this.fenceArr.icon)
				if(this.fenceArr.closeIcon.length!=0)this.removeOverlay(this.fenceArr.closeIcon)

				if (data.fenceArr.length === 0) {
					this.showError("_暂无该类型围栏数据_,_请添加后查看_");
					return
				};
				this.mapShowFenceDataArr=data.fenceArr;
				this.mapShowFenceDataArr.map(function (item, index) {
					item.index = index;
					//console.log(index,item);
					_this.showOneFence(item, index, points);
				})

				this.setViewport(points)
				//console.log("graph",this.fenceArr.graph);
				//console.log("icon",this.fenceArr.icon);
				//console.log("closeIcon",this.fenceArr.closeIcon);
			},
			//隐藏围栏
			hideFence(){
				if(this.fenceArr.graph.length!=0){
					this.removeOverlay(this.fenceArr.graph);
					this.removeOverlay(this.fenceArr.icon);
					this.removeOverlay(this.fenceArr.closeIcon);
				}
			},
			//显示一个完整围栏
			showOneFence(item, index, points){
				let _this = this;
				let overlay = null;
				let data = this.fenceTypeObj[item.fenceType];
				let strokeColor = this.transformRGBA(data.strokeColor);
				let fillColor = this.transformRGBA(data.fillColor);
				let option = {
					center: null,
					radius: null,
					bounds: null,
					paths: null,
					strokeColor: strokeColor.rgb,
					strokeOpacity: strokeColor.alpha,
					fillColor: fillColor.rgb,
					fillOpacity: fillColor.alpha,
					strokeWeight: "4"
				};
				
				if(typeof index==="undefined" || index==null) index=0;
				switch (this.mapType) {
					case 0:
						switch (parseInt(item.formType)) {
							case 1:
								overlay = new BMap.Circle(
									item.center,
									item.radius,
									option
								);
								overlay.type = "circle";
								break;
							case 2:
								overlay = new BMap.Polygon(
									item.path,
									option
								);
								overlay.type = 'rectangle';
								break;
							case 3:
								overlay = new BMap.Polygon(
									item.path,
									option
								);
								overlay.type = 'polygon';
								break;
						}
						this.map.addOverlay(overlay);      //绘制图形
						break;
					case 1:
						switch (parseInt(item.formType)) {
							case 1:
								//console.log('center',item.center);
								option.center = this.getMapPoint(item.center);
								option.radius = parseFloat(item.radius);
								overlay = new google.maps.Circle(option);
								overlay.type = 'circle';
								break;
							case 2:
								option.bounds = {
									north: item.path[0].lat,
									south: item.path[2].lat,
									east: item.path[2].lng,
									west: item.path[0].lng
								};
								//console.log('option.bounds',option.bounds)
								overlay = new google.maps.Rectangle(option);
								overlay.type = 'rectangle';
								break;
							case 3:
								option.paths = item.path;
								//console.log('option.paths',option.paths)
								overlay = new google.maps.Polygon(option);
								overlay.type = 'polygon';
								break;

						}
						overlay.setMap(this.map);      //绘制图形
						break;
				};
				//根据传入参数将中心点坐标保存在相应的数组内
				if (points != null) points.push(this.getMapPoint(item.center));
				this.fenceArr.graph.splice(index, 1, overlay); //将图形对象放入对应数组中
				let icon = this.showfenceIcon(item, index);          //绘制中心图标
				this.fenceArr.icon.splice(index, 1, icon);

				//只在实时监控、轨迹回放、围栏管理中显示关闭按钮
				if(_this.$route.path !== "/monitor" && _this.$route.path !== "/historical_route" && _this.$route.path !== "/fence_manage") return;
				let closeIcon = this.setCloseBtn(overlay);   //绘制关闭图标
				closeIcon.index=index;
				this.fenceArr.closeIcon.splice(index, 1, closeIcon);

				this.listenerMarkerClick(closeIcon, function () {
					let n=closeIcon.index;
					_this.removeOverlay(_this.fenceArr.graph, n);
					_this.removeOverlay(_this.fenceArr.icon, n);
					_this.removeOverlay(_this.fenceArr.closeIcon,n);
				})

			},
			//绘制中心图标
			showfenceIcon(data, index){
				let _this = this,
					Mpoint = this.getMapPoint(data.center),
					fenceTypeData = this.fenceTypeObj[data.fenceType],
					url = "/static/img/fence/fencetype-icon" + fenceTypeData.icon + ".png",
					fenceTeamName = this.fenceTeamObj[data.teamID].name,
					fenceTypeName = fenceTypeData.name;

				//let myIcon = new BMap.Icon(url, new BMap.Size(24,24));
				//let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
				let marker = this.setMapMarker(Mpoint, url, 100, 24, 24);

				let temp = `<div class="BMap_bubble_header text-blue font-20">${data.name}</div>
						<div class="BMap_bubble_text">
							<table>
								<tbody>
									<tr><td class="font-bolder text-right">_面积_：</td><td class="link-black">${data.area} ㎡</td></tr>
									<tr><td class="font-bolder text-right">_分组_：</td><td class="link-black">${fenceTeamName}</td></tr>
									<tr><td class="font-bolder text-right">_类型_：</td><td class="link-black">${fenceTypeName}</td></tr>
									<tr><td class="font-bolder text-right">_经度_：</td><td class="link-black">${parseFloat(data.center.lng).toFixed(8)}</td></tr>
									<tr><td class="font-bolder text-right">_纬度_：</td><td class="link-black">${parseFloat(data.center.lat).toFixed(8)}</td></tr>
									<tr><td class="font-bolder text-right">_位置_：</td><td class="link-black car-address">${data.address}</td></tr>
									<tr><td class="font-bolder text-right">_备注_：</td><td class="link-black">${data.remark==""?"--":data.remark}</td></tr>
								</tbody>
							</table>
						</div>`;

				if (typeof index==="undefined" || index==null) {
					temp += `<div class="BMap_bottom">
								<a carId="${data.ID}" carIndex="${data.index}" class="InfoWindow_btn redact cursor-pointer" title="_编辑_"><i></i></a>
								<a carId="${data.ID}" carIndex="${data.index}" class="InfoWindow_btn delete cursor-pointer" title="_删除_"><i></i></a>
							</div>`;

				}else {
					temp += `<div class="BMap_bottom">
							<a carId="${data.ID}" carIndex="0" class="InfoWindow_btn redact cursor-pointer" title="_编辑_"><i></i></a>
							<a carId="${data.ID}" class="InfoWindow_btn delete cursor-pointer" title="_删除_"><i></i></a>
						</div>`;
				}

				this.setInfoWindow(marker, temp, function () {
					switch (_this.mapType) {
						case 0:
							$(".delete").bind("click", function () {
								_this.clickDeleteFence($(this))
							});
							$(".redact").bind("click", function () {
								_this.clickRedactFence($(this))
							});
							break;
						case 1:
							let deleteBtn = document.getElementsByClassName("delete")[0];
							let redact = document.getElementsByClassName("redact")[0];
							google.maps.event.addDomListener(deleteBtn, "click", function () {
								_this.clickDeleteFence($(this))
							});
							google.maps.event.addDomListener(redact, "click", function () {
								_this.clickRedactFence($(this))
							});
							break;
					};


				})
				return marker;
			},
			//显示围栏位置
			showFencePlace(data){
				this.setViewport(data.path);
				this.removeOverlay(this.drawingArr);
				this.removeOverlay(this.fenceArr.graph);
				this.removeOverlay(this.fenceArr.icon);
				this.removeOverlay(this.fenceArr.closeIcon);
				this.mapShowFenceDataArr=[data];
				this.showOneFence(data);
			},
			//显示围栏位置
			showFences(arr){
				let _this=this;
				this.removeOverlay(this.drawingArr);
				this.removeOverlay(this.fenceArr.graph);
				this.removeOverlay(this.fenceArr.icon);
				this.removeOverlay(this.fenceArr.closeIcon);
				this.mapShowFenceDataArr=arr;
				$.each(arr,function (index,item) {
					_this.showOneFence(item);
				});
				this.setViewport([]);
			},
			/***************   创建围栏            **************/
			//创建围栏 type 1圆形 2矩形 3多边形
			setFence(type){
				let _this = this;
				//初始化围栏属性
				if (this.choicFenceType !== '_请先创建围栏类型_') {
					this.choicFenceType = '_请选择类型_';					
				};
				this.drawingData = {
					name: null,	 //围栏名称
					number: "",   //自定义编号
					remark: "",   //备注
					state:true,		//启用状态
					area: null,     //面积
					formType: 0,     //类型  1圆 2矩形 3多边形
					fenceType: 0,
					path: null,     //多边形&&矩形 各顶点坐标数组  {lng:"",lat:""}
					radius: null,   //圆形半径
					center: {lng: null, lat: null},            //围栏近似中心点坐标
					address: null,                        //围栏近似中心点地址
				};
				let data = this.drawingData;
				data.formType = type;
				this.makeRail(type, null, function () {
					let overlay = _this.drawingArr[0];
					if(type==2){
						let path,NE,SW,lng1,lng2,lat1,lat2;
						switch(_this.mapType){
							case 0:
								path = overlay.getPath();
								NE=path[0];
								SW=path[2];
								lng1=NE.lng;
								lng2=SW.lng;
								lat1=NE.lat;
								lat2=SW.lat;
								break;
							case 1:
								path = overlay.getBounds();
								NE=path.getNorthEast();
								SW=path.getSouthWest();
								lng1=NE.lng();
								lng2=SW.lng();
								lat1=NE.lat();
								lat2=SW.lat();
								break;
						};
						//避免操作失误  未画出矩形
						if(lng1==lng2 || lat1==lat2){
							_this.showError("_请鼠标左键点击拖动绘制矩形_!");
							_this.removeOverlay(_this.drawingArr);
							_this.setFence(type);
							return;
						}
					};
					if(type==3){
						let path;
						switch(_this.mapType){
							case 0:
								path = overlay.getPath();
								break;
							case 1:
								path = overlay.getPath().getArray();
								break;
						}
						console.log(path);
						//百度地图  判断多边形有没有重复顶点
						if(_this.mapType==0){
							let newObj=new Object();
							let isHaveSamePoint=false;
							path.map(function (item,index) {
								let str=JSON.stringify(item)
								if(!newObj[str]){
									newObj[str]=1;
								}else{
									isHaveSamePoint=true;
									return
								}
							})
							if(isHaveSamePoint){
								_this.showError("_多边形有重复顶点_,_请重新绘制_!");
								_this.removeOverlay(_this.drawingArr);
								_this.setFence(type);
								return
							}
						}
						//判断多边形点数在1-10之间
						if(type==2 && path.length<=2 || path.length>10){
							//避免多边形顶点不是3-10之间
							_this.showError("_多边形的顶点数应保证在三到十之间_,_请重新绘制_!");
							_this.removeOverlay(_this.drawingArr);
							_this.setFence(type);
							return
						}

					}

					_this.parseOverlay(type, overlay, data);
					_this.isCreateFence = true;
				})

			},
			//创建-----重新设置围栏区域
			resetFence(type){
				this.closeCreateFencePanel();
				this.setFence(type)
			},
			//选择分组
			choiceTeam(data){
				this.choicFenceTeam = data.name;
				this.drawingData.teamID = data.ID;
			},
			//
			redrawFence(data){
				let _this = this,
					drawingData = this.drawingData,
					index = drawingData.index;
				this.choicFenceType = data.name;

				console.log("设定围栏类型后重绘drawingData", drawingData);
				drawingData.fenceType = data.ID;
				let strokeColor = this.transformRGBA(data.strokeColor);
				let fillColor = this.transformRGBA(data.fillColor);

				let overlay = null,
					option = {
						center: null,
						radius: null,
						bounds: null,
						paths: null,
						strokeColor: strokeColor.rgb,
						strokeOpacity: strokeColor.alpha,
						fillColor: fillColor.rgb,
						fillOpacity: fillColor.alpha,
						strokeWeight: "4"
					},
					icon,
					closeIcon;


				switch (this.mapType) {
					case 0:
						switch (parseInt(drawingData.formType)) {
							case 1:
								overlay = new BMap.Circle(
									drawingData.center,
									drawingData.radius,
									option
								);
								overlay.type = "circle";
								break;
							case 2:
								overlay = new BMap.Polygon(
									drawingData.path,
									option
								);
								overlay.type = 'rectangle';
								break;
							case 3:
								overlay = new BMap.Polygon(
									drawingData.path,
									option
								);
								overlay.type = 'polygon';
								break;


						}
						this.map.addOverlay(overlay);
						break;
					case 1:
						switch (parseInt(drawingData.formType)) {
							case 1:
								//console.log('center',drawingData.center);
								option.center = this.getMapPoint(drawingData.center);
								option.radius = parseFloat(drawingData.radius);
								overlay = new google.maps.Circle(option);
								overlay.type = 'circle';
								break;
							case 2:
								option.bounds = {
									north: drawingData.path[0].lat,
									south: drawingData.path[2].lat,
									east: drawingData.path[2].lng,
									west: drawingData.path[0].lng
								};
								//console.log('option.bounds',option.bounds)
								overlay = new google.maps.Rectangle(option);
								overlay.type = 'rectangle';
								break;
							case 3:
								option.paths = drawingData.path;
								//console.log('option.paths',option.paths)
								overlay = new google.maps.Polygon(option);
								overlay.type = 'polygon';
								break;


						}
						overlay.setMap(_this.map);//绘制图形
						break;
				}

				this.removeOverlay(this.drawingArr);
				icon = this.showfenceIcon(drawingData);
				closeIcon = this.setCloseBtn(overlay);
				this.listenerMarkerClick(closeIcon, function () {
					_this.removeOverlay(_this.drawingArr);
				});
				this.drawingArr.push(overlay, icon, closeIcon)
			},
			//关闭创建围栏面板
			closeCreateFencePanel() {
				this.isCreateFence = false;
				this.removeOverlay(this.drawingArr);
			},

			/********         编辑围栏            **************/
			clickRedactFence(obj){
				let index = parseInt($(obj).attr("carIndex"));
				this.redactFence(index);
			},

			redactFence(index) {
				this.redactFenceIndex = index-0;
				this.drawingData = this.deepCopy(this.mapShowFenceDataArr[index]);
				this.choicFenceType = this.fenceTypeObj[this.drawingData.fenceType].name;
				this.choicFenceTeam = this.fenceTeamObj[this.drawingData.teamID].name;
				this.isRedactFence = true;
				this.isRedactRedrawing = true;
				console.log("编辑围栏，drawingData", this.drawingData);
			},
			//编辑-----重新设置围栏区域
			redactResetFence(type){
				let _this = this;
				this.isRedactFence = false;
				this.isRedactRedrawing = false;

				let data = this.drawingData,
					index = this.drawingData.index,
					fenceType = this.drawingData.fenceType;

				console.log("编辑重新设置围栏区域fenceType", fenceType);

				this.makeRail(type, fenceType, function () {
					let overlay = _this.drawingArr[0];
					_this.parseOverlay(type, overlay, data);
					data.formType = type;

					let icon = _this.showfenceIcon(data);
					_this.drawingArr.push(icon);
					_this.isRedactFence = true;
				})

			},

			//编辑--------设定围栏类型后重绘
			redactRedrawFence(data){

				let _this = this,
					drawingData = this.drawingData,
					index = drawingData.index;
				this.choicFenceType = data.name;

				console.log("设定围栏类型后重绘drawingData", drawingData);
				drawingData.fenceType = data.ID;
				let strokeColor = this.transformRGBA(data.strokeColor);
				let fillColor = this.transformRGBA(data.fillColor);

				let overlay = null,
					option = {
						center: null,
						radius: null,
						bounds: null,
						paths: null,
						strokeColor: strokeColor.rgb,
						strokeOpacity: strokeColor.alpha,
						fillColor: fillColor.rgb,
						fillOpacity: fillColor.alpha,
						strokeWeight: "4"
					},
					icon,
					closeIcon;


				switch (this.mapType) {
					case 0:
						switch (parseInt(drawingData.formType)) {
							case 1:

								overlay = new BMap.Circle(
									drawingData.center,
									drawingData.radius,

									option
								);
								overlay.type = "circle";
								break;
							case 2:

								overlay = new BMap.Polygon(
									drawingData.path,
									option
								);
								overlay.type = 'rectangle';
								break;
							case 3:
								overlay = new BMap.Polygon(
									drawingData.path,
									option
								);
								overlay.type = 'polygon';
								break;


						}
						this.map.addOverlay(overlay);
						break;
					case 1:
						switch (parseInt(drawingData.formType)) {
							case 1:
								//console.log('center',drawingData.center);
								option.center = this.getMapPoint(drawingData.center);
								option.radius = parseFloat(drawingData.radius);
								overlay = new google.maps.Circle(option);
								overlay.type = 'circle';
								break;
							case 2:
								option.bounds = {
									north: drawingData.path[0].lat,
									south: drawingData.path[2].lat,
									east: drawingData.path[2].lng,
									west: drawingData.path[0].lng
								};
								//console.log('option.bounds',option.bounds)
								overlay = new google.maps.Rectangle(option);
								overlay.type = 'rectangle';
								break;
							case 3:
								option.paths = drawingData.path;
								//console.log('option.paths',option.paths)
								overlay = new google.maps.Polygon(option);
								overlay.type = 'polygon';
								break;

						}


						overlay.setMap(_this.map);//绘制图形
						//}
						break;


				}
				if (this.isRedactRedrawing) {
					this.removeOverlay(this.fenceArr.graph, index);
					this.removeOverlay(this.fenceArr.icon, index);
					this.removeOverlay(this.fenceArr.closeIcon, index);

					icon = this.showfenceIcon(drawingData);
					closeIcon = this.setCloseBtn(overlay);

					this.fenceArr.graph.splice(index, 1, overlay);
					this.fenceArr.icon.splice(index, 1, icon);
					this.fenceArr.closeIcon.splice(index, 1, closeIcon);

					this.listenerMarkerClick(closeIcon, function () {
						this.removeOverlay(this.fenceArr.graph, index);
						this.removeOverlay(this.fenceArr.icon, index);
						this.removeOverlay(this.fenceArr.closeIcon, index);
					})


				} else {
					this.removeOverlay(this.drawingArr);
					icon = this.showfenceIcon(drawingData);
					closeIcon = this.setCloseBtn(overlay);
					this.listenerMarkerClick(closeIcon, function () {
						this.removeOverlay(this.drawingArr);
					})
					this.drawingArr.push(overlay, icon, closeIcon)

				}


			},

			//根据overlay的获取围栏数据
			parseOverlay(type, overlay, data){
				let _this = this;

				if (type == 1) {
					switch (_this.mapType) {
						case 0:
							data.radius = overlay.getRadius().toFixed(2);
							data.center = overlay.getCenter();
							data.area = Math.PI * (data.radius * data.radius).toFixed(2)
							break;
						case 1:
							data.radius = overlay.getRadius().toFixed(2);
							data.center.lng = overlay.getCenter().lng().toFixed(6);
							data.center.lat = overlay.getCenter().lat().toFixed(6);
							data.area = Math.PI * (data.radius * data.radius).toFixed(2)
							break;
					}


				} else {
					let bounds;
					switch (_this.mapType) {
						case 0:
							data.path = overlay.getPath();
							data.area = BMapLib.GeoUtils.getPolygonArea(overlay);
							data.center = _this.getCenter(data.path);
							break;
						case 1:
							if (type == 2) { //矩形
								bounds = overlay.getBounds();
								let ne = bounds.getNorthEast();
								let sw = bounds.getSouthWest();
								let lng = (ne.lng() + sw.lng()) / 2;
								let lat = (ne.lat() + sw.lat()) / 2;
								data.center = {lat: lat, lng: lng};
								data.path = [
									{lng: sw.lng(), lat: ne.lat()},
									{lng: ne.lng(), lat: ne.lat()},
									{lng: ne.lng(), lat: sw.lat()},
									{lng: sw.lng(), lat: sw.lat()}
								];

							}
							if (type == 3) { //多边形
								bounds = overlay.getPath().getArray();
								console.log("谷歌Paths", bounds);
								data.path = []
								bounds.map(function (item, index) {
									data.path.push({lng: item.lng(), lat: item.lat()})
								})
								data.center = _this.getCenter(data.path);
							}
							let BaiduOverlay = new BMap.Polygon(
								data.path
							)
							data.area = BMapLib.GeoUtils.getPolygonArea(BaiduOverlay);
							break;

					}

				}

				data.area = parseInt(data.area) + "m²";
				_this.geocoder(_this.$store.state.mapType, data.center, data, "address")

			},
			//关闭编辑围栏面板
			closeRedactFencePanel(){
				let index=null;
				if(this.mapShowFenceDataArr.length===1) {
					index=0;
				}else{
					index = this.drawingData.index;
				};
				let data = this.mapShowFenceDataArr[index];
				this.removeOverlay(this.drawingArr);
				this.removeOverlay(this.fenceArr.graph, index);
				this.removeOverlay(this.fenceArr.icon, index);
				this.removeOverlay(this.fenceArr.closeIcon, index);
				this.showOneFence(data, index);
				this.isRedactFence = false;
			},

			//确定保存围栏
			confirmSetFence(redact){
				let _this = this;
				let drawingData = this.drawingData;
				if (drawingData.name == ""||drawingData.name == null) {
					this.showError("_请输入围栏名称_!")
					return
				}
				if (drawingData.fenceType == 0) {
					this.showError("_请输入围栏类型_!")
					return
				}
				//console.log(drawingData.path);

				//存储到服务器的为WGS-84 坐标  需进行一下转换
				//转换中心点坐标
				let centerPoint=_this.parseWGS(_this.mapType,drawingData.center);
				//转换围栏顶点坐标数组
				let fencePath="*";
				if(drawingData.path != null){
					let arr=[];

					drawingData.path.map(function (item,index) {
						arr.push(_this.parseWGS(_this.mapType,item));
					})
					fencePath=JSON.stringify(arr)
				}


				let FT_Combine_LBSGISFence = {
					FAgentGUID: _this.$store.state.companyID,
					FSystemType:8,
					FName: drawingData.name,
					FNumber: drawingData.number == "" ? "*" : drawingData.number,
					FRemark: drawingData.remark == "" ? "*" : drawingData.remark,
					FArea: parseFloat(drawingData.area),
					FFormType: drawingData.formType,
					FFenceTypeGUID: drawingData.fenceType,
					FPath:fencePath,
					FRadius: drawingData.radius == null ? 0 : parseFloat(drawingData.radius),
					FCenterLon: centerPoint.lng,
					FCenterLat: centerPoint.lat,
					FCenterLat: centerPoint.lat,
					FAddress: drawingData.address,
					FStatus:drawingData.state?1:0,
					FGISFenceTypeGroupGUID:drawingData.teamID
				};

				function postData(url) {

					if (!redact) {//创建模式
						$.post(url, {
								FTokenID: _this.$store.state.FTokenID,
								FAction: "AddLBSGISFence",
								FT_Combine_LBSGISFence: FT_Combine_LBSGISFence,
								FVersion: "1.0.0"
							},
							function (res) {
								console.log("创建围栏", res);

								if (res.Result == 200) {
									_this.showError("_创建围栏成功_!");
									_this.$emit("deleteFence");
									_this.drawingData["ID"]=res.FObject[0].Column1;
									let icon = _this.showfenceIcon(_this.drawingData);
									_this.drawingArr.push(icon);
									_this.isCreateFence = false;

									_this.$emit("refresh");

								} else {
									_this.showError("_创建围栏失败_!")

								}
							})

					} else {  //编辑模式
						$.post(url, {
								FTokenID: _this.$store.state.FTokenID,
								FAction: "UpdateLBSGISFence",
								FGUID: drawingData.ID,
								FT_Combine_LBSGISFence: FT_Combine_LBSGISFence,
								FVersion: "1.0.0"
							},
							function (res) {
								console.log("修改围栏", res);

								if (res.Result == 200) {
									_this.showError("_修改围栏成功_!");
									_this.$emit("deleteFence");
									_this.removeOverlay(_this.drawingArr);
									let index = _this.redactFenceIndex,
										type = _this.choiceFenceType;

									_this.removeOverlay(_this.fenceArr.graph, index);
									_this.removeOverlay(_this.fenceArr.icon, index);
									_this.removeOverlay(_this.fenceArr.closeIcon, index);

									//清空临时绘制围栏
									_this.removeOverlay(_this.drawingArr);

									_this.isRedactRedrawing = true;

									_this.showOneFence(_this.drawingData, index);

									_this.isRedactFence = false;
									_this.$emit("refresh");

								} else {
									_this.showError("_修改围栏失败_!")

								}
							})
					}


				};
				postData("/web/Combine/Combine_LBS")

			},

			//delete围栏
			clickDeleteFence(obj){
				let ID = $(obj).attr("carId");
				let index=null;
				if(typeof $(obj).attr("carIndex")!=undefined){
					index = $(obj).attr("carIndex");
				};
				this.deleteFence(ID,index)
			},
			deleteFence(ID,index){

				let _this = this;
				let p = new Promise((resolve, reject)=>{
							$.post("/web/Combine/Combine_LBS",{
							FAction:"QueryCheckFenceBindingAsset",
							FTokenID:_this.$store.state.FTokenID,
							FFenceGUID:ID,
							FVersion:"1.0.0"
						},function(data){
							if(data.FObject.length!==0){
								let FAssetIDStr = "";
								for (let i=0;i<data.FObject.length;i++){
									FAssetIDStr+=data.FObject[i].FAssetID+","
								}
								resolve(FAssetIDStr);
							}else {
								reject();
							}

						});
					});
				p.then(function(str){
					reminder('_此围栏已经写入设备_'+str+'_是否继续_?');
				},function(){
					reminder('_是否继续_?');
				})

				function reminder(str){
					_this.$confirm(str, '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
					}).then(() => {

						deleteFence("/web/Common/Common_LBS");
					}).catch(() => {});
				}



				/*this.$confirm('_此操作将永久删除该围栏_, _是否继续_?', '_提示_', {
					confirmButtonText: '_确定_',
					confirmButtonClass: "search",
					cancelButtonText: '_取消_',
					cancelButtonClass: "cancel el-button--primary",
					type: 'warning'
				}).then(() => {
					deleteFence("/web/Common/Common_LBS");
			    }).catch(() => {});*/

				//let _this = this;
				function deleteFence(url) {

					$.post(url, {
							FTokenID: _this.$store.state.FTokenID,
							FAction: "DeleteLBSGISFence",
							FGUIDs: ID,
							FVersion: "1.0.0"
						},
						function (res) {
							if (res.Result == 200) {
								_this.showError("_围栏删除成功_");
								_this.$emit("refresh");

								_this.$emit("deleteFence");
								if(index!=null){
									_this.removeOverlay(_this.fenceArr.graph, index);
									_this.removeOverlay(_this.fenceArr.icon, index);
									_this.removeOverlay(_this.fenceArr.closeIcon, index);
								}else {
									_this.removeOverlay(_this.drawingArr);
								}

							}
						})

				}
			},


			/***
			 * * ***************************************   ⑸搜索部分部分    *****************************************
			 * */

			//搜索区域车辆分页 page页数
			searchCarPage(page){
				let _this=this;
				this.carListpage = this.areaChoiceArr.slice((page - 1) * 5, (page - 1) * 5 + 5);
				this.carListpage.map(function (item,index) {
					_this.geocoder(_this.$store.state.mapType, item.point, item, "address")
				})
			},
			//获得百度矩形Bounds  返回百度的区域对象  依赖百度的GIS方法获取对应的进出情况
			getBaiduBounds(overlay){
				let pStart, pEnd;
				switch (this.mapType) {
					case 0:
						let path = overlay.getPath();
						pStart = new BMap.Point(path[3].lng, path[3].lat);
						pEnd = new BMap.Point(path[1].lng, path[1].lat);
						console.log(pStart, pEnd)
						return new BMap.Bounds(pStart, pEnd);   //自己规定范围
						break;
					case 1:
						let bounds = overlay.getBounds();
						let ne = bounds.getNorthEast();
						let sw = bounds.getSouthWest();
						pStart = new BMap.Point(sw.lng(), sw.lat());
						pEnd = new BMap.Point(ne.lng(), ne.lat());
						console.log(pStart, pEnd)
						return new BMap.Bounds(pStart, pEnd);   //自己规定范围
						break;
				}
			},
			//搜索区域车辆
			rectangleSearchCar(){
				let _this = this;
				_this.isMapCarlistShow = false;
				this.makeRail(2, null, function () {
					Pace.restart();
					_this.areaChoiceArr.length = 0;
					let bs = _this.getBaiduBounds(_this.drawingArr[0]);
					for (var i = 0; i < _this.latelyData.length; i++) {
						let data = _this.latelyData[i],
							point = new BMap.Point(data.point.lng, data.point.lat);
						console.log("车辆坐标点对象", point);
						if (BMapLib.GeoUtils.isPointInRect(point, bs)) {
							_this.areaChoiceArr.push(data)
						}
					}
					if (_this.areaChoiceArr.length != 0) {
						_this.isMapCarlistShow = true;
						_this.searchCarPage(1);
						//_this.carListpage = _this.areaChoiceArr.slice(0, 5)
					} else {
						_this.showError("_区域内暂无车辆_，_请重新加载车辆或选择区域_")
						_this.removeOverlay(_this.drawingArr);
					}
				})
			},
			//添加搜索标注
			setPlace(myValue, bs) {

				let _this = this;
				switch (this.mapType) {
					case 0:

						function myFun() {
							let num = 1;
							if (bs != null && bs != "" || local.getResults().getPoi(0) == undefined) {
								//搜索结果数量
								num = local.getResults().getNumPois();
								if (num == 0) {
									_this.showError("_未查到结果_,_请更换关键字或者放大地图后重新查找_");
									_this.removeOverlay(_this.drawingArr);
								}
							} else {
								_this.centerAndZoom(local.getResults().getPoi(0).point, 18);

							}

							_this.removeOverlay(_this.searchResult);

							for (var i = 0; i < num; i++) {
								let result = local.getResults().getPoi(i);
								let pp = result.point;    //获取第一个智能搜索的结果
								let marker = new BMap.Marker(pp);
								_this.map.addOverlay(marker);    //添加标注
								_this.searchResult.push(marker);


								var temp = `
								<div class="BMap_bubble_title" style="overflow: hidden; height: auto; line-height: 24px; white-space: nowrap; width: auto;">
									<p style="font:bold 14px/16px arial,sans-serif;margin:0;color:#cc5522;white-space:nowrap;overflow:hidden" title="${result.title}">${result.title}
										<a target="_blank" href="${result.url}&amp;output=html&amp;source=jsapi" style="margin-left:5px;font-size:12px;color:#3d6dcc;font-weight:normal;text-decoration:none;">详情»</a>
									</p>
								</div>
								<div class="BMap_bubble_content" style="width: auto; height: auto;"><div style="font:12px arial,sans-serif;margin-top:10px">

									<table cellspacing="0" style="overflow:hidden;table-layout:fixed;font:12px arial,sans-serif">
										<tbody>
											<tr>
												<td style="vertical-align:top;width:38px;white-space:nowrap;word-break:keep-all">地址：&nbsp;</td>
												<td style="line-height:16px">${result.address}&nbsp;</td>
											</tr>
											<tr>
												<td style="vertical-align:top;">电话：</td><td>${result.phoneNumber != undefined ? result.phoneNumber : "未知"}</td>
											</tr>
										</tbody>
									</table>
								</div>`;


								let infoWindow = new BMap.InfoWindow(temp);

								marker.addEventListener("click", function () {
									this.openInfoWindow(infoWindow);
								});

							}
						}

						var local = new BMap.LocalSearch(_this.map, { //智能搜索
							pageCapacity: 50,
							//renderOptions:{map: this.map},
							onSearchComplete: myFun
						});

						if (bs != null && bs != "") {
							local.searchInBounds(myValue, bs);
						} else {
							local.search(myValue);
						}
						break;
					case 1:
						let infoWindow = new google.maps.InfoWindow();
						let service = new google.maps.places.PlacesService(_this.map);

						// The idle event is a debounced event, so we can query & listen without
						// throwing too many requests at the server.

						console.log(myValue, bs);

					function performSearch() {
						var request = {
							bounds: bs,
							keyword: myValue
						};
						service.radarSearch(request, callback);
					}

					function callback(results, status) {
						if (status !== google.maps.places.PlacesServiceStatus.OK) {
							_this.showError("_未查到结果_,_请更换关键字或者放大地图后重新查找_");
							_this.removeOverlay(_this.drawingArr);
							return;
						}
						_this.removeOverlay(_this.searchResult);
						for (var i = 0, result; result = results[i]; i++) {
							addMarker(result);
						}

					}

					function addMarker(place) {
						var marker = new google.maps.Marker({
							map: _this.map,
							position: place.geometry.location,
							//icon: {
							//	url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
							//	anchor: new google.maps.Point(10, 10),
							//	scaledSize: new google.maps.Size(10, 17)
							//}
						});

						google.maps.event.addListener(marker, 'click', function () {
							service.getDetails(place, function (result, status) {
								if (status !== google.maps.places.PlacesServiceStatus.OK) {
									console.log(status);
									return;
								}

								let content = `<div class="BMap_bubble_title" style="overflow: hidden; height: auto; line-height: 24px; white-space: nowrap; width: auto;">
														<p style="font:bold 14px/16px arial,sans-serif;margin:0;color:#cc5522;white-space:nowrap;overflow:hidden" title="${result.name}">${result.name}
															<a target="_blank" href="${result.url}&amp;output=html&amp;source=jsapi" style="margin-left:5px;font-size:12px;color:#3d6dcc;font-weight:normal;text-decoration:none;">详情»</a>
														</p>
													</div>
													<div class="BMap_bubble_content" style="width: auto; height: auto;"><div style="font:12px arial,sans-serif;margin-top:10px">
														<table cellspacing="0" style="overflow:hidden;table-layout:fixed;font:12px arial,sans-serif">
															<tbody>
																<tr>
																	<td style="vertical-align:top;width:38px;white-space:nowrap;word-break:keep-all">地址：&nbsp;</td>
																	<td style="line-height:16px">${result.formatted_address}&nbsp;</td>
																</tr>
																<tr>
																	<td style="vertical-align:top;">电话：</td><td>${result.international_phone_number != undefined ? result.international_phone_number : "未知"}</td>
																</tr>
															</tbody>
														</table>
													</div>`;
								infoWindow.setContent(content);
								infoWindow.open(_this.map, marker);
							});
						});
						_this.searchResult.push(marker);
					}

						performSearch();
						break;
				}


			},
			//搜索地图
			searchMap(searchMapText){
				if (searchMapText != null && searchMapText != "") {
					this.setPlace(searchMapText)
				} else {
					this.removeOverlay(this.searchResult);
					this.showError("_请输入搜索关键字_！");
				}

			},
			//自定义搜索地图内容
			rectangleSearch(){
				this.removeOverlay(this.searchResult);
				let _this = this;

				this.$prompt('_请输入搜索关键字_', {
					title: '_区域检索_',
					inputPattern: /\S/,
					inputErrorMessage: '_不能为空_',
					confirmButtonClass: "search",
					confirmButtonText: '_选择区域_',
					cancelButtonText: '_取消_',
					cancelButtonClass: "cancel el-button--primary"
				}).then(({value}) => {
					this.makeRail(2, null, function () {

					let bs;
					switch (_this.mapType) {
						case 0:
							bs = _this.getBaiduBounds(_this.drawingArr[0]);   //自己规定范围
							break;
						case 1:
							bs = _this.drawingArr[0].getBounds();
							break;
					}
					Pace.restart();

					_this.setPlace(value, bs);

				})
			}).catch(() => {});

			},
			closeCarsList(){
				this.isMapCarlistShow = false;
				this.removeOverlay(this.drawingArr);
			},


			//根据Area智能检索
			BaiduSmartSearch(){
				let _this = this;
				//智能搜索
				function G(ID) {
					return document.getElementById(ID);
				}

				var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
					{
						"input": "baidu-search"
						, "location": this.Area
					});
				ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
					var str = "";
					var _value = e.fromitem.value;
					var value = "";
					if (e.fromitem.index > -1) {
						value = _value.province + _value.city + _value.district + _value.street + _value.business;
					}
					str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

					value = "";
					if (e.toitem.index > -1) {
						_value = e.toitem.value;
						value = _value.province + _value.city + _value.district + _value.street + _value.business;
					}
					str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
					G("searchResultPanel").innerHTML = str;
				});
				var myValue;
				ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
					var _value = e.item.value;
					myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
					_this.searchMapText = myValue;
					G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

					_this.setPlace(myValue)
					//_this.searchMapText = '';
				});

			},
			GoogleSmartSearch(){
				let _this = this;
				var placeSearch, autocomplete;

				function initAutocomplete() {
					// Create the autocomplete object, restricting the search to geographical
					// location types.
					autocomplete = new google.maps.places.Autocomplete(
						/** @type {!HTMLInputElement} */(document.getElementById('G-search')),
						{
							types: ['geocode'],
							bounds: _this.map.getBounds()
						});

					// When the user selects an address from the dropdown, populate the address
					// fields in the form.
					autocomplete.addListener('place_changed', fillInAddress);
				}

				function fillInAddress() {
					_this.removeOverlay(_this.searchResult);
					let place = autocomplete.getPlace();
					console.log(place);
					let marker = new google.maps.Marker({
						map: _this.map,
						position: place.geometry.location,
					});
					_this.searchResult.push(marker);
					google.maps.event.addListener(marker, 'click', function () {

						let content = `<div class="BMap_bubble_title" style="overflow: hidden; height: auto; line-height: 24px; white-space: nowrap; width: auto;">
													<p style="font:bold 14px/16px arial,sans-serif;margin:0;color:#cc5522;white-space:nowrap;overflow:hidden" title="${place.name}">${place.name}
														<a target="_blank" href="${place.url}&amp;output=html&amp;source=jsapi" style="margin-left:5px;font-size:12px;color:#3d6dcc;font-weight:normal;text-decoration:none;">详情»</a>
													</p>
												</div>
												<div class="BMap_bubble_content" style="width: auto; height: auto;"><div style="font:12px arial,sans-serif;margin-top:10px">
													<table cellspacing="0" style="overflow:hidden;table-layout:fixed;font:12px arial,sans-serif">
														<tbody>
															<tr>
																<td style="vertical-align:top;width:38px;white-space:nowrap;word-break:keep-all">地址：&nbsp;</td>
																<td style="line-height:16px">${place.formatted_address}&nbsp;</td>
															</tr>
															<tr>
																<td style="vertical-align:top;">电话：</td><td>${place.international_phone_number != undefined ? place.international_phone_number : "未知"}</td>
															</tr>
														</tbody>
													</table>
												</div>`;
						let infoWindow = new google.maps.InfoWindow();
						infoWindow.setContent(content);
						infoWindow.open(_this.map, marker);


					})
					let bounds = new google.maps.LatLngBounds();
					if (place.geometry.viewport) {
						// Only geocodes have viewport.
						bounds.union(place.geometry.viewport);
					} else {
						bounds.extend(place.geometry.location);
					}
					;
					_this.map.fitBounds(bounds);
				}

				initAutocomplete();

			},
			deleteSearch(){
				this.removeOverlay(this.searchResult);
				this.searchMapText = "";
			},
		},
		wacth:{
			screenHeight(){
				this.elementsFlex("map-wrapper", "map-template", "map-tool", "contentList");
				this.elementsFlex("select-car", "map-template", "map-tool", "contentList");
			}
		},
		computed: {
			systemID:{//系统ID
				get(){
					return this.$store.state.choiceSystemID
				}
			},
			remoteUnlockLimits:{
				get(){
					return this.$store.state.remoteUnlockLimits   //开锁权限
				}

			},
			//轨迹点获取startIndex个数据
			getStartIndexData(){
				return this.carPointData.slice(0, this.startIndex);
			},
			//围栏类型数据对象
			fenceTypeObj(){
				return this.$store.state.fenceTypeObj;
			},
			//围栏类型数据数组
			fenceTypeArr(){
				return this.$store.state.fenceTypeArr;
			},
			//围栏分组数据对象
			fenceTeamObj(){
				return this.$store.state.fenceTeamObj;
			},
			//围栏分组数据数组
			fenceTeamArr(){
				return this.$store.state.fenceTeamArr;
			},
			//计算滚动条百分百
			getPercent(){
				// console.log(this.playNumber,this.carPointData.length);
				return Math.floor(this.playNumber / (this.carPointData.length-1) * 100);
			},
			showOptions(){
				let obj = {
					showTime: "",
					showMileage: "",
					showSpeed: "",
					showStopTime: "",
				}

				for (let key in this.options) {
					if (this.options[key] === true) {
						obj[key] = "inline-block";
					} else {
						obj[key] = "none";
					}
				}
				return obj;
			},
		},
		activated(){
			
		},
		deactivated(){ //组件停用时 调用函数
			this.stopPlayPoint();
		},
		directives: {
			drag:{
				inserted:function (el, binding) {
					var oDiv = el;
					if (binding.value.length != 0) {
						let targetDiv = document.getElementById(binding.value[0]);
						let fatherDiv = document.getElementById(binding.value[1]);

						function getPoint(obj) { //获取某元素以浏览器左上角为原点的坐标
							var t = obj.offsetTop; //获取该元素对应父容器的上边距
							var l = obj.offsetLeft; //对应父容器的上边距
							//判断是否有父容器，如果存在则累加其边距
							while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
								t += obj.offsetTop; //叠加父容器的上边距
								l += obj.offsetLeft; //叠加父容器的左边距
							}
							return {top: t, left: l}
						}

						oDiv.onmousedown = function (ev) {
							ev = ev || window.event; //兼容性
							ev.preventDefault();
							var oscrolltop = fatherDiv.scrollTop;  //定义滚动条高度    并顾忌兼容性
							var disx = ev.clientX - getPoint(targetDiv).left;    //鼠标点击点击时 在DIV上X轴到DIV左侧距离 = 鼠标x坐标 - DIV左侧至屏幕左侧距离
							var disy = ev.clientY - getPoint(targetDiv).top;
							var w = fatherDiv.offsetWidth;
							var h = fatherDiv.offsetHeight + oscrolltop;
							document.onmousemove = function (ev) {
								ev = ev || window.event;
								var x = ev.clientX - disx - getPoint(fatherDiv).left;   //DIVx坐标=鼠标x坐标-鼠标点击点击时 在DIV上X轴到DIV左侧距离
								var y = ev.clientY - disy - getPoint(fatherDiv).top;
								//限制DIV在浏览器屏幕中移动
								if (x < 0) {
									x = 0;
								}
								if (x > w - targetDiv.offsetWidth) {
									x = w - targetDiv.offsetWidth;
								}
								if (y < oscrolltop) {          //此处Y最小应等于滚动条高度，适配网页中所有位置
									y = oscrolltop;
								}
								if (y > h - targetDiv.offsetHeight) {
									y = h - targetDiv.offsetHeight;
								}
								targetDiv.style.left = x + 'px';   //确定DIV的  left值 和top值
								targetDiv.style.top = y + 'px';
							}

							document.onmouseup = function () {
								document.onmousemove = null;
								document.onmouseup = null;
							};

						};

					}
				}
			},
			dragX:{
				inserted:function (el, binding) {
					var oDiv = el;
					//width 【Array】  width[0]:父级宽度  width[0]:自身宽度
					if (binding.value!=undefined) {
						var faWidth = $("#my-progressbar").width();
						var chWidth = $("#progress-yuan").width();
						var fn = binding.value;
						oDiv.onmousedown = function (ev) {
							ev.preventDefault();
							var disX = ev.clientX - oDiv.offsetLeft;
							document.onmousemove = function (ev) {
								var l = ev.clientX - disX;
								if (l < -chWidth / 2) l = -chWidth / 2;
								if (l > faWidth - chWidth / 2) l = faWidth - chWidth / 2;

								oDiv.style.left = l + 'px';
								fn();
							};
							document.onmouseup = function () {
								document.onmousemove = null;
								document.onmouseup = null;
							};

						};


					}
				}
			}
		}
	}
</script>
<style>
	.map-template {
		width:100%;
		height:100%;
		overflow:hidden;
	}

	#map-wrapper {
		position:relative;
		width:100%;
		height:800px;
		border:1px solid #8a9eac;
	}

	#map-wrapper .sidebar-toggle{
		top:22%
	}

	#map-container {
		width:100%;
		height:100%;
	}

	/******地图内车辆列表*********/
	.map-carlist {
		position:absolute;
		top:100px;
		left:15%;
		z-index:1031;
		min-width:280px;
	}

	.carlist-content {
		height:250px;
	}

	.map-carlist .panel-title, .map-fence .panel-title {
		cursor:move;
	}

	/*****围栏编辑面板样式*******/
	.map-fence {
		position:absolute;
		top:100px;
		left:25%;
		z-index:1040;
	}

	.map-fence .panel-body {
		min-width:510px;
		padding-right:35px;
	}

	.map-fence ul li {
		height:35px;
		line-height:35px;
	}

	.map-fence label {
		min-width:80px;
		text-align:right;
	}
	.fence-btn{
		padding:6px 0 0 80px
	}
	.map-fence .textarea-wrap {
		height:65px;
		line-height:65px;
	}

	.map-fence .textarea-wrap label {
		float:left;
	}

	.map-fence .textarea-wrap textarea {
		height:100%;
		width:388px;
		resize:none;
	}

	.map-fence .address-input {
		width:388px;
	}

	.map-select-wrap {
		position:relative;
		display:inline-block;
		margin-left:-4px;
	}

	.map-fence input {
		padding-left: 3px;
		width:153px;
		height:24px;
		line-height:25px;
		border:1px solid #a9a9a9;
	}

	.map-select {
		padding-left: 3px;
		width:154px;
		height:24px;
		line-height:25px;
		border:1px solid #a9a9a9;
		text-align:left;
		background-color:#fff;
		font:14px/1.5 \5FAE\8F6F\96C5\9ED1, arial, \5b8b\4f53;
	}

	.map-fence .dropdown-menu a, .show-fence .dropdown-menu a {
		padding:0 34px;
	}

	.dropdown-menu .fence-li {
		position:relative;
	}

	.map-select .sp-dd {
		float:right;
	}

	.map-select-wrap .dropdown-menu {
		top:17px;
	}

	.fence-icon-wrap{
		max-height:250px;
		overflow-y:auto;
	}
	.fencetype-icon {
		position:absolute;
		top:0;
		left:4px;
		width:24px;
		height:24px;
		border:none;
		margin:6px 5px 0 0;
	}

	.color-box {
		position:absolute;
		top:0;
		right:4px;
		width:22px;
		height:22px;
		border:2px solid transparent;
		margin-top:6px;
	}


	/******错误提示*********/
	.errorShow {
		position:absolute;
		z-index:1300;
		top:50px;
		left:50%;
		height:35px;
		line-height:35px;
		padding:0 10px;
		border-radius:5px;
		text-align:center;
		min-width:280px;
		margin-left:-140px;
		background-color:rgba(0, 0, 0, .5);
		color:#fff;
	}

	/******回放控制面板*********/
	.fatherProgress {
		position:absolute;
		left:10px;
		bottom:60px;
		font-size:12px;
		padding:8px;
		border:1px solid #fff;
		border:1px solid #cdcdcd;
		border-radius:3px;
		box-shadow:0 1px 5px #666;
		background:#f8f8f8;
		-webkit-transition:left .8s;
		-moz-transition:left .8s;
		-ms-transition:left .8s;
		-o-transition:left .8s;
		transition:left .8s;
	}

	.checkbox-control {
		height:25px;
		line-height:25px;
	}

	.checkbox-control label {
		padding:0 7px;
	}

	.checkbox-control label input {
		display:block;
		float:left;
		margin-top:6px;
	}

	.checkbox-control span {
		display:block;
		float:left;
	}

	.showLocation {
		line-height:35px;
		border-bottom:1px solid #cccccc;
		height:45px;
	}

	.showLocation .el-switch__label * {
		font-size: 13px;
		font-weight: 700;
	}

	.isShowLocation {
		float: left;
		margin-top: 10px;
	}

	.showLocationLabel {
		margin-left: 20px;
		margin-top: 2px;
	}

	.showLocationLabel input {
		display: block;
		float: left;
		margin-top: 12px;
	}

	.showLocationLabel span {
		display: block;
		float: left;
	}

	.amountKilo {
		line-height:25px;
		border-bottom:1px solid #cccccc;
	}

	.fatherProgress .progress {
		position:relative;
		margin-top:15px;
		margin-bottom:10px;
		overflow:inherit;
	}

	.fatherProgress .no-transition {
		-webkit-transition-duration:0s;
		-moz-transition-duration:0s;
		-ms-transition-duration:0s;
		-o-transition-duration:0s;
		transition-duration:0s;
	}

	.progress-yuan {
		position:absolute;
		z-index:2;
		top:-2px;
		margin-top:-4px;
		border-radius:100%;
		width:17px;
		height:17px;
		cursor:move;
		background-color:#F8F8F8;
		border:1px solid #00c0ef;
		-webkit-box-shadow:0 1px 1px 1px rgba(0, 0, 0, .3);
		box-shadow:0 1px 1px 1px rgba(0, 0, 0, .3);
	}

	.f-m-a {
		margin:0 auto;
		float:initial;
	}

	.progress-grenn {
		background-color:#00e765 !important;
	}

	.play-speed {
		padding-bottom:3px;
	}

	.control-panel {
		display:inline-block;
		width:30px;
		height:30px;
		line-height:30px;
		color:#ccc;
		border:1px solid #FFF;
		border-radius:50%;
		cursor:pointer;
		background-color:#ccc;
		background-image:url(/static/img/sprite/title_icon.png);
		background-repeat:no-repeat;

	}

	.control-panel:hover {
		background-color:#00e765;
	}

	.btn-active {
		background-color:#70efa5;
	}

	.xj-p-backward {
		background-position:5px -87px;
	}

	.xj-p-slow {
		background-position:-25px -87px;
	}

	.xj-p-play {
		background-position:-53px -87px;
	}

	.xj-p-pause {
		background-position:-85px -87px;
	}

	.xj-p-stop {
		background-position:-115px -87px;
	}

	.xj-p-fast {
		background-position:-145px -87px;
	}

	.xj-p-forward {
		background-position:-175px -87px;
	}

	/*地图工具样式*/
	#map-tool {
		height:40px;
		width:100%;
		padding:10px 5px;
		background-color:#fff;
		margin-bottom:0;
	}

	.map-tool-item {
		padding:0 7px;
		float:left;
		height:16px;
	}

	.halving-r-line {
		position:relative;
	}

	.search-area {
		position:relative;
	}

	.search-area input {
		height:23px;
	}

	.search-area-btn {
		position:absolute;
		width:14px;
		height:21px;
		right:1px;
		top:1px;
		cursor:pointer;
		background-color:#fff;
	}

	.halving-r-line:after {
		content:"";
		width:1px;
		background-color:#dbdbdb;
		height:16px;
		position:absolute;
		right:0;
		top:2px;
	}

	.open {
		color:#005fc6;
	}

	.activePress {
		color:#005fc6;
	}

	.map-icon {
		display:block;
		float:left;
		width:14px;
		height:14px;
		margin:3px 5px 0 0;
	}

	.map-icon1 {
		background-position:0 -132px;
	}

	.map-icon2 {
		background-position:-14px -132px;
	}

	.map-icon3 {
		background-position:-28px -132px;
	}

	.map-icon4 {
		background-position:-42px -132px;
	}

	.map-icon5 {
		background-position:-56px -132px;
	}

	.map-icon6 {
		background-position:-70px -132px;
	}

	.open .map-icon1 {
		background-position:0 -146px;
	}

	.open .map-icon2 {
		background-position:-14px -146px;
	}

	.open .map-icon3 {
		background-position:-28px -146px;
	}

	.open .map-icon4 {
		background-position:-42px -146px;
	}

	.open .map-icon5 {
		background-position:-56px -146px;
	}

	.open .map-icon6 {
		background-position:-70px -146px;
	}

	.sub-map-icon {
		display:block;
		float:left;
		width:14px;
		height:14px;
		margin:12px 5px 0 0;
	}

	.sub-map-icon1 {
		background-position:0 -84px;
	}

	.sub-map-icon2 {
		background-position:-14px -84px;
	}


	li:hover > a .sub-map-icon1 {
		background-position:0 -98px;
	}

	li:hover > a .sub-map-icon2 {
		background-position:-14px -98px;
	}


	/*智能搜索*/
	.tangram-suggestion-main {
		z-index:10001;
	}

	.tangram-suggestion-main > div {
		width:400px
	}

	/*测距*/
	.BMapLabel {
		max-width:300px;
	}

	/*百度地图信息框样式*/
	.BMap_bubble_header {
		width:100%;
		height:25px;
		line-height:20px;
		font-size:14px;
		font-weight:bolder;
	}

	.BMap_bubble_header img {
		display:inline-block;
		height:100%;
	}

	.BMap_bubble_text {
		position:relative;
		height:215px;
		width:350px;
		border:3px solid #ccc;
		padding:5px;
		overflow:auto;
		font-size:12px;
	}
	@media screen and (max-width: 1366px) {
		.BMap_bubble_text {
			height:130px;
		}
	}
	@media screen and (max-width: 1280px) {
		.BMap_bubble_text {
			height:80px;
		}
	}
	.BMap_bubble_text td{
		line-height:22px;
	}
	.site-info{
		width:400px;
	}
	.site-info table{
		width:200px;
	}
	.site-info .text-right{
		width:80px;
	}
	.site-info .link-black{
		width:120px;
	}
	.infoWindow-img{
		position:absolute;
		left:220px;
		top:20px;
		width:150px;
		text-align:center;
		cursor:pointer;
		overflow:hidden;
	}
	.infoWindow-img img{
		width:100%;
		height:110px;
	}
	.infoWindow-imgBtn{
		display:inline-block;
		width:10px;
		height:10px;
		border-radius:50%;
		margin:0 5px;
		background-color:#8c8c8c;
	}
	.infoWindow-img .active{
		background-color:#5372ff;
	}
	#pac-input {
		height:0;
		width:500px;
		left:143px;
	}
	.car-address{
		width:200px;
	}


	.InfoWindow_btn {
		float:left;
		display:block;
		margin-right:5px;
		padding:2px;
	}

	.InfoWindow_btn i {
		width:20px;
		height:20px;
		float:left;;
	}

	.road i {
		background:url(/static/img/carIcon/roadcondition.png) no-repeat center;
	}

	.navigation i {
		background:url(/static/img/carIcon/navigation.png) no-repeat center;
	}


	.carinformation i {
		background:url(/static/img/carIcon/carInfo.png) no-repeat center;
	}

	.monitor i {
		background:url(/static/img/carIcon/monitor.png) no-repeat center;
	}

	.location i {
		background:url(/static/img/carIcon/locate.png) no-repeat center;
	}

	.delete i {
		background:url(/static/img/carIcon/delete.png) no-repeat center;
	}

	.redact i {
		background:url(/static/img/carIcon/redact.png) no-repeat center;
	}

	/*google map InfoWindow信息框样式*/
	.markerLabels{
		white-space :nowrap
	}
	.gm-style-iw {
		left:26px !important;
	}

	/*轨迹点序号样式*/
	.trackRowNum {
		display: inline-block;
		width: 16px;
		height: 16px;
		line-height: 16px;
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
		margin-right: 6px;
		text-align: center;
		color: #ffffff;
	}
	.Track_bubble_text {
		height:195px;
		margin-top:10px;
	}
</style>

