<template>
	<div id="map-template" class="map-template"
		 :class="{'full-screen':IsActive.isFullScreen,'':!IsActive.isFullScreen}">
		<baidu-map ref="map" @fullScreen="changefullScreen" @playNumber="scrollShowData"
				   :fa-data="[mapToolShow]"></baidu-map>
		<!--智能搜索-->
		<div id="select-car"
			 :class="{'show-select-car-list':isShowSelectCarList,'hide-select-car-list':!isShowSelectCarList}">
			<!--智能搜索-->
			<div class="search-module">
				<!--操作选择车辆列表显示隐藏-->
				<div class="operate-module" @click="showCarList"></div>
				<!--车辆或者设备列表-->
				<car-tree  ref='tree' :treeData="treeData" :options="options"
						  @refresh="loadTreeData"
						  @node-click="getChoiceCarData"></car-tree>


				<ul id="tree-footer" class="list-group">
					<li class="list-group-item top-border">
						<label>_已选择_：</label>
						<span class="text-aqua">{{choiceCarData.name}}</span>
					</li>
					<li class="timeChoice no-border">
						<el-date-picker
							popper-class="trackDateSelect"
							v-model="choiceTime"
							type="datetimerange"
							size="small"
							:editable=false
							:clearable=false
							:picker-options="pickerOptions"
							placeholder="_选择时间范围_">
						</el-date-picker>
						<p class="alt-txt" v-if="queryDateScope==='threeDay'">_查询时间跨度最大为三天_</p>
						<!--<p class="alt-txt" v-if="queryDateScope==='sevenDay'">_查询时间跨度最大为七天_</p>-->
						<p class="alt-txt" v-if="queryDateScope==='thirtyDay'">_查询时间跨度最大为三十天_</p>
					</li>

					<!--选择地图标记类型-->

					<li class="list-group-item no-border queryDataTypeListLi" v-if="isShowQueryDataTypeList">
						<ul class="queryDataTypeList">
							<li @click="selectQueryDataType(item)" :title="item.title" v-for="item in queryDataTypeList[systemID]" class="queryDataType queryDataTypeIcon" :class="[item.isChecked?item.name+'-point-check':item.name+'-point']"></li>
						</ul>
					</li>

					<!--<li class="list-group-item no-border">
						<label for="car-end-time">_结束时间_：</label>
						<input id="car-end-time" type="text">
					</li>-->
					<li class="list-group-item  no-border">
						<button :id="dateScopeTypeObj[queryDateScope][0].id" class="btn btn-xs btn-reset">{{dateScopeTypeObj[queryDateScope][0].text}}</button>
						<button :id="dateScopeTypeObj[queryDateScope][1].id" class="btn btn-xs btn-reset">{{dateScopeTypeObj[queryDateScope][1].text}}</button>
						<button :id="dateScopeTypeObj[queryDateScope][2].id" class="btn btn-xs btn-forgive">{{dateScopeTypeObj[queryDateScope][2].text}}</button>
						<button @click="getCarData" class="btn btn-search btn-xs"><i
								class="fa fa-search padding-r-8"></i>_查询_
						</button>
					</li>
					<li class="list-group-item no-border">
						<label for="travel-spacing">_标记间距_：</label>
						<select @change="changeInterval" v-model="interval" id="travel-spacing">
							<option value="0">_自动_</option>
							<option value="50">50km</option>
							<option value="30">30km</option>
							<option value="10">10km</option>
							<option value="5">5km</option>
							<option value="3">3km</option>
							<option value="1">1km</option>
						</select>
					</li>
					<li class="list-group-item no-border" v-if="systemID!=7">
						<label for="stop-time">_停车时长_≥：</label>
						<select @change="showAllStopPoint" v-model="carStopPointArr.choiceTime">
							<option value="3">3_分钟_</option>
							<option value="5">5_分钟_</option>
							<option value="10">10_分钟_</option>
							<option value="30">30_分钟_</option>
							<option value="60">60_分钟_</option>
						</select>
					</li>

				</ul>
			</div>

		</div>
		<!--列表区域-->
		<div id="contentList" class="row no-margin-right">
			<!--拖动条-->
			<div v-dragY="['contentList','map-template',adjustPage]" class="position-line"></div>
			<!--车辆数据报表部分-->
			<div class="col-sm-12 no-padding-right">
				<!--报表类型头部-->
				<div class="contentList-header" @dblclick="openSubMenu">
					<div class="border"></div>
					<ul class="nav nav-tabs " id="myTab">


						<!--轨迹点 -->
						<li :class="{'active':IsActive.pointType===0}">
							<a @click="showAllPoints" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_轨迹点_(<span class="number remove-number">{{carPointArr.length}}</span>)
							</a>
						</li>

						<!--全局停车-->
						<li v-if="showStatusBarObj.stop" :class="{'active':IsActive.pointType===2}">
							<a @click="IsActive.pointType=2" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_停车_(<span class="number remove-number">{{carStopPointArr.filterData.length}}</span>)
							</a>
						</li>
						<!-- 报警点 -->
						<li v-if="showStatusBarObj.alarm" :class="{'active':IsActive.pointType===4}">
							<a @click="IsActive.pointType=4" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_报警_(<span class="number remove-number">{{carAlarmPointArr.alarmData.length}}</span>)
							</a>
						</li>
						<!--集装箱独有的开关门-->
						<li v-if="showStatusBarObj.door" :class="{'active':IsActive.pointType===6}">
							<a @click="IsActive.pointType=6" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_开关门_(<span class="number remove-number">{{carDoorPointArr.doorData.length}}</span>)
							</a>
						</li>
						<!--甩挂 胎压报警-->
						<li v-if="showStatusBarObj.tire" :class="{'active':IsActive.pointType===3}">
							<a @click="IsActive.pointType=3" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_胎压_
								(<span class="number remove-number">{{tyreArr.data.length}}</span>)
							</a>
						</li>
						<li v-if="showStatusBarObj.oil" :class="{'active':IsActive.pointType===7}">
							<a @click="IsActive.pointType=7" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_加减油_
								(<span class="number remove-number">{{carOilPointArr.oilData.length}}</span>)
							</a>
						</li>
						<li v-if="showStatusBarObj.trailer" :class="{'active':IsActive.pointType===8}">
							<a @click="IsActive.pointType=8" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_接甩挂_
								(<span class="number remove-number">{{carTrailerPointArr.trailerData.length}}</span>)
							</a>
						</li>
						<li v-if="showStatusBarObj.lock" :class="{'active':IsActive.pointType===5}">
							 <a @click="IsActive.pointType=5" data-toggle="tab"  ripple="ripple" ripple-color="#FFF">
							   _开关锁_
							   (<span class="number remove-number">{{carLockPointArr.lockData.length}}</span>)
							 </a>
						   </li>
						<!--电子锁 异常报表-->
						<!--<li v-if="systemID==2">
							<a @click="IsActive.pointType=4" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_异常报表_
								(<span class="number remove-number">{{tyreArr.data.length}}</span>)
							</a>
						</li>-->
						<li v-if="showStatusBarObj.runSection" :class="{'active':IsActive.pointType===1}">
							<a @click="IsActive.pointType=1" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_运行段_(<span class="number remove-number">{{carRunArr.runData.length}}</span>)
							</a>
						</li>
						<!--温度曲线-->
						<!--<li v-if="systemID==3||systemID==4">
							<a @click="showTemperature" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_温度曲线_
							</a>
						</li>-->
						<!--油位曲线-->
						<!--<li v-if="systemID==4">
							<a @click="showOilLine" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								_油位曲线_
							</a>
						</li>-->


					</ul>
					<div class="close-Menu" :class="{'active-Menu':subMenu[0].active}">
						<a title="_最小化_" @click="closeSubMenu">
							<i class="fa fa-minus"></i>
						</a>
					</div>
					<div class="close-Menu full-menu" :class="{'active-Menu':subMenu[1].active}">
						<a title="_全屏_" @click="fullSubMenu">
							<i class="img-icon  restore-btn"></i>
						</a>
					</div>
					<div class="close-Menu full-menu open-menu" :class="{'active-Menu':subMenu[2].active}">
						<a title="_向下还原_" @click="openSubMenu">
							<i class="img-icon close-btn"></i>
						</a>
					</div>
				</div>
				<div class="tab-content no-padding no-border tab-tableinfo">
					<div class="customFixedTable">

						<template>
							<!--发货单-->
							<!--<el-table
								v-show="systemID==7&&IsActive.pointType==7"
								:data="ManifesData"
								border
								stripe
								highlight-current-row
								style="width: 100%"
								:height="maxHeight">
								<el-table-column
									fixed
									type="index"
									label="_序号_"
									width="150">
								</el-table-column>
								<el-table-column
									fixed
									prop="assetID"
									label="_设备_ID"
									show-overflow-tooltip
									width="150">
								</el-table-column>
								<el-table-column
									fixed
									prop="FCargoCode"
									label="_货单号_"
									show-overflow-tooltip
									width="150">
								</el-table-column>
								<el-table-column
									prop="name"
									label="_车牌号_"
									show-overflow-tooltip
									width="150">
								</el-table-column>
								<el-table-column
									prop="FCargoName"
									label="_货物简称_"
									min-width="150">
								</el-table-column>
								<el-table-column
									prop="startTime"
									label="_发货时间_"
									min-width="150">
								</el-table-column>
								<el-table-column
									prop="endTime"
									label="_完成时间_"
									min-width="150">
								</el-table-column>
								<el-table-column
									prop="FDriverName"
									label="_司机_"
									width="150">
								</el-table-column>
								<el-table-column
									prop="duration"
									label="_时长_"
									width="200">
								</el-table-column>
								<el-table-column
									prop="mileage"
									label="_里程_(km)"
									width="200">
								</el-table-column>
								<el-table-column
									prop="NumberOfSites"
									label="_站点数_"
									width="200">
								</el-table-column>
								<el-table-column
									prop="FCarrier"
									label="_承运人_"
									width="200">
								</el-table-column>
								<el-table-column
									v-if="isShowHandleRow"
									fixed="right"
									label="_查看详情_"
									width="120">
									<template scope="scope">
										<a  @click="getSiteAndPoint(scope.row)" class="img-icon monitor-icon icon-info" title="_查看详情_"></a>
									</template>
								</el-table-column>


							</el-table>-->
							<!--集装箱开关门-->
							<el-table
								v-show="systemID===6&&IsActive.pointType==6"
								:data="carDoorPointArr.doorData"
								:row-class-name="choiceRow"
								@row-click="mapShowSite"
								border
								stripe
								highlight-current-row
								style="width: 100%"
								:height="maxHeight">
								<el-table-column
									fixed
									type="index"
									label="_序号_"
									width="120">
								</el-table-column>
								<el-table-column
									prop="closeTime"
									label="_关门时间_"
									width="200">
								</el-table-column>
								<el-table-column
									prop="closeAddress"
									label="_关门位置_"
									show-overflow-tooltip
									width="380">
								</el-table-column>
								<el-table-column
									prop="openTime"
									label="_开门时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="openAddress"
									label="_开门位置_"
									show-overflow-tooltip
									width="380">
								</el-table-column>
								<el-table-column
									prop="amount"
									label="_开关门次数_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="keepTime"
									label="_运行时长_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="mileage"
									label="_运行距离_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
							</el-table>
							<!--通用 运行段-->
							<el-table
								v-show="IsActive.pointType==1"
								:data="carRunArr.runData"
								border
								stripe
								highlight-current-row
								:row-class-name="choiceRow"
								@row-click="mapShowRunPath"
								style="width: 100%"
								:height="maxHeight">
								<el-table-column
									fixed
									type="index"
									label="_序号_"
									show-overflow-tooltip
									width="120">
								</el-table-column>
								<el-table-column
									prop="startTime"
									label="_开始时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="endTime"
									label="_结束时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="startAddress"
									label="_开始位置_"
									show-overflow-tooltip
									min-width="300">
								</el-table-column>
								<el-table-column
									prop="endAddress"
									label="_结束位置_"
									show-overflow-tooltip
									min-width="300">
								</el-table-column>
								<el-table-column
									prop="timeValue"
									label="_运行时长_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="mileage"
									label="_运行距离_(km)"
									show-overflow-tooltip
									width="200">
								</el-table-column>

							</el-table>
							<!--电子锁 开关锁-->
							<el-table
								v-show="IsActive.pointType==5"
								:data="carLockPointArr.lockData"
								border
								stripe
								highlight-current-row
								:row-class-name="choiceRow"
								@row-click="showLockPoint"
								style="width: 100%"
								:height="maxHeight">
								<el-table-column
									fixed
									type="index"
									label="_序号_"
									show-overflow-tooltip
									width="120">
								</el-table-column>
								<el-table-column
									prop="startTime"
									label="_上锁时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="startAddress"
									label="_上锁位置_"
									show-overflow-tooltip
									min-width="200">
								</el-table-column>
								<el-table-column
									prop="openType"
									label="_开锁方式_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="endTime"
									label="_开锁时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="endAddress"
									label="_开锁位置_"
									show-overflow-tooltip
									min-width="200">
								</el-table-column>
								<el-table-column
									prop="keepTime"
									label="_运行时长_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="mileage"
									label="_运行距离_"
									show-overflow-tooltip
									width="200">
								</el-table-column>

							</el-table>
							<!--通用 停车点-->
							<el-table
								v-show="IsActive.pointType==2"
								:data="carStopPointArr.filterData"
								border
								stripe
								highlight-current-row
								:row-class-name="choiceRow"
								@row-click="showStopPoint"

								:height="maxHeight">
								<el-table-column
									type="index"
									label="_序号_"
									show-overflow-tooltip
									width="120">
								</el-table-column>
								<el-table-column
									prop="startTime"
									label="_停车开始时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="endTime"
									label="_停车结束时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="stopTime"
									label="_停车时长_"
									show-overflow-tooltip
									width="200">
								</el-table-column>

								<el-table-column
									prop="address"
									label="_位置_"
									show-overflow-tooltip
									min-width="300">
								</el-table-column>

							</el-table>
							<!--胎温胎压胎压详情-->
							<el-table
								v-show="IsActive.pointType==3"
								:data="tyreArr.data"
								border
								stripe
								highlight-current-row
								:row-class-name="choiceRow"
								style="width: 100%"
								:height="maxHeight">
								<el-table-column
									fixed
									type="index"
									label="_序号_"
									show-overflow-tooltip
									width="150">
								</el-table-column>
								<el-table-column
									label="_胎温胎压详情_"
									show-overflow-tooltip
									width="1800">
									<template scope="scope">
										<ul>
											<li class="humiture" v-for="(item,index) in tyreArr.data[scope.$index].FTyreContent" >
												<i class="tire">{{item.N}}</i>
												<span class="humitureTxt">{{item.P }}&nbsp;bar</span>
												<span class="humitureTxt">{{item.T}}&nbsp;℃</span>
											</li>
										</ul>
									</template>
								</el-table-column>
							</el-table>
							<!--加减油-->
							<el-table
								v-show="IsActive.pointType==7"
								:data="carOilPointArr.oilData"
								border
								stripe
								highlight-current-row
								:row-class-name="choiceRow"
								@row-click="showOilPoint"
								style="width: 100%"
								:height="maxHeight">
							<el-table-column
									fixed
									type="index"
									label="_序号_"
									show-overflow-tooltip
									width="120">
							</el-table-column>
							<el-table-column
									prop="startTime"
									label="_开始时间_"
									show-overflow-tooltip
									width="200">
							</el-table-column>
							<el-table-column
									prop="startTime"
									label="_结束时间_"
									show-overflow-tooltip
									width="200">
							</el-table-column>
							<el-table-column
									prop="address"
									label="_位置_"
									show-overflow-tooltip
									min-width="200">
							</el-table-column>
							<el-table-column
									prop="riseOrFall"
									label="_加油/减油_"
									show-overflow-tooltip
									width="200">
							</el-table-column>
							<el-table-column
									prop="startLiter"
									label="_之前油位_(L)"
									show-overflow-tooltip
									width="200">
							</el-table-column>
							<el-table-column
									prop="stopLiter"
									label="_之后油位_(L)"
									show-overflow-tooltip
									width="200">
							</el-table-column>
							<el-table-column
									prop="liter"
									label="_升数_ (L)"
									show-overflow-tooltip
									width="200">
							</el-table-column>

						</el-table>
							<!--接甩挂-->
							<el-table
									v-show="IsActive.pointType==8"
									:data="carTrailerPointArr.trailerData"
									border
									stripe
									highlight-current-row
									:row-class-name="choiceRow"
									@row-click="showTrailerPoint"
									style="width: 100%"
									:height="maxHeight">
								<el-table-column
										fixed
										type="index"
										label="_序号_"
										show-overflow-tooltip
										width="120">
								</el-table-column>
								<el-table-column
										prop="status"
										label="_接甩挂_"
										show-overflow-tooltip
										width="200">
								</el-table-column>
								<el-table-column
										prop="startTime"
										label="_开始时间_"
										show-overflow-tooltip
										width="200">
								</el-table-column>
								<el-table-column
										prop="endTime"
										label="_结束时间_"
										show-overflow-tooltip
										min-width="200">
								</el-table-column>
								<el-table-column
										prop="keepTime"
										label="_持续时长_"
										show-overflow-tooltip
										min-width="200">
								</el-table-column>
								<el-table-column
										prop="mileage"
										label="_里程_"
										show-overflow-tooltip
										width="200">
								</el-table-column>
								<el-table-column
										prop="startAddress"
										label="_开始位置_"
										show-overflow-tooltip
										width="200">
								</el-table-column>
								<el-table-column
										prop="endAddress"
										label="_结束位置_"
										show-overflow-tooltip
										width="200">
								</el-table-column>
							</el-table>
							<!-- 报警点 -->
							<el-table
								v-show="IsActive.pointType==4"
								:data="carAlarmPointArr.alarmData"
								border
								stripe
								highlight-current-row
								:row-class-name="choiceRow"
								@row-click="showAarmPoint"

								:height="maxHeight">
								<el-table-column
									type="index"
									label="_序号_"
									show-overflow-tooltip
									width="120">
								</el-table-column>
								<el-table-column
									prop="alarmType"
									label="_报警类型_"
									show-overflow-tooltip
									width="100">
								</el-table-column>
								<el-table-column
									prop="describe"
									label="_报警描述_"
									show-overflow-tooltip
									width="400">
								</el-table-column>
								<el-table-column
									prop="startTime"
									label="_开始时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="endTime"
									label="_结束时间_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="keepTime"
									label="_持续时长_"
									show-overflow-tooltip
									width="200">
								</el-table-column>
								<el-table-column
									prop="starAdress"
									label="_开始位置_"
									show-overflow-tooltip
									min-width="450">
								</el-table-column>
								<el-table-column
									prop="endAdress"
									label="_结束位置_"
									show-overflow-tooltip
									min-width="450">
								</el-table-column>

							</el-table>
						</template>


						<!--报表 table theader-->
						<div id="table-header" v-if="IsActive.pointType==0||IsActive.pointType==5||IsActive.pointType==6">
							<!--轨迹点  接甩挂-->
							<ul v-if="systemID===1" v-show="IsActive.pointType==0">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-10"><span>_定位时间_</span></li>
								<li class="Width-5"><span>_定位状态_</span></li>
								<li class="Width-5"><span>_速度_(km/h)</span></li>
								<li class="Width-10"><span>_里程_(km)</span></li>
								<li class="Width-5"><span>_电量_(%)</span></li>
								<li class="Width-30"><span>_位置_</span></li>
								<li class="Width-30"><span>_状态_</span></li>
							</ul>
							<!--轨迹点  电子锁-->
							<ul v-if="systemID===2" v-show="IsActive.pointType==0">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-10"><span>_定位时间_</span></li>
								<li class="Width-10"><span>_定位状态_</span></li>
								<li class="Width-10"><span>_速度_(km/h)</span></li>
								<li class="Width-10"><span>_里程_(km)</span></li>
								<li class="Width-5"><span>_电量_(%)</span></li>
								<li class="Width-30"><span>_位置_</span></li>
								<li class="Width-10"><span>_锁状态_</span></li>
								<li class="Width-10"><span>_锁绳状态_</span></li>




							</ul>
							<!--轨迹点  冷链-->
							<ul v-if="systemID==3" v-show="IsActive.pointType==0">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-15"><span>_定位时间_</span></li>
								<li class="Width-5"><span>_定位状态_</span></li>
								<li class="Width-5"><span>_速度_(km/h)</span></li>
								<li class="Width-10"><span>_里程_(km)</span></li>
								<li class="Width-10"><span>_电量_(%)</span></li>
								<li class="Width-30"><span>_温湿度_</span></li>
								<li class="Width-20"><span>_位置_</span></li>
							</ul>
							<!--轨迹点  车队-->
							<ul v-if="systemID==4" v-show="IsActive.pointType==0">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-15"><span>_定位时间_</span></li>
								<li class="Width-10"><span>_定位状态_</span></li>
								<li class="Width-10"><span>_速度_(km/h)</span></li>
								<li class="Width-10"><span>_里程_(km)</span></li>
								<li class="Width-10"><span>_电量_(%)</span></li>
								<li class="Width-30"><span>_位置_</span></li>
								<li class="Width-10"><span>_油量_</span></li>
							</ul>
							<!--轨迹点  集装箱-->
							<ul v-if="systemID==6" v-show="IsActive.pointType==0">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-10"><span>_定位时间_</span></li>
								<li class="Width-5"><span>_定位状态_</span></li>
								<li class="Width-10"><span>_电量_(%)</span></li>
								<li class="Width-40"><span>_位置_</span></li>
								<li class="Width-10"><span>_箱门状态_</span></li>
								<li class="Width-10"><span>_内外温度_(℃)</span></li>
								<li class="Width-10"><span>_空满载状态_</span></li>

							</ul>


							<!--运行段
							<ul v-if="systemID!=2" v-show="IsActive.pointType==1">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-15"><span>_开始时间_</span></li>
								<li class="Width-15"><span>_结束时间_</span></li>
								<li class="Width-20"><span>_开始位置_</span></li>
								<li class="Width-20"><span>_结束位置_</span></li>
								<li class="Width-15"><span>_运行时长_</span></li>
								<li class="Width-10"><span>_运行距离_</span></li>
							</ul>
							&lt;!&ndash;趟次报表&ndash;&gt;
							<ul v-if="systemID==2" v-show="IsActive.pointType==1">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-15"><span>_上锁时间_</span></li>
								<li class="Width-15"><span>_上锁位置_</span></li>
								<li class="Width-10"><span>_开锁方式_</span></li>
								<li class="Width-15"><span>_开锁时间_</span></li>
								<li class="Width-15"><span>_开锁位置_</span></li>
								<li class="Width-15"><span>_运行时长_</span></li>
								<li class="Width-10"><span>_运行距离_</span></li>
							</ul>
							&lt;!&ndash;停车点&ndash;&gt;
							<ul v-show="IsActive.pointType==2">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-15"><span>_停车开始时间_</span></li>
								<li class="Width-15"><span>_停车结束时间_</span></li>
								<li class="Width-15"><span>_停车时长_</span></li>
								<li class="Width-30"><span>_状态_</span></li>
								<li class="Width-20"><span>_位置_</span></li>
							</ul>
							&lt;!&ndash;胎压报警&ndash;&gt;
							<ul v-if="systemID==1" v-show="IsActive.pointType==3">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-15"><span>_开始_/_结束时间_</span></li>
								<li class="Width-15"><span>_开始位置_</span></li>
								<li class="Width-15"><span>_结束位置_</span></li>
								<li class="Width-10"><span>_报警时长_/_里程_</span></li>
								<li class="Width-40"><span>_报警信息_</span></li>
							</ul>
							&lt;!&ndash;异常报表&ndash;&gt;
							<ul v-if="systemID==2" v-show="IsActive.pointType==4">
								<li class="Width-5"><span>_序号_</span></li>
								<li class="Width-15"><span>_时间_</span></li>
								<li class="Width-40"><span>_位置_</span></li>
								<li class="Width-40"><span>_异常类型_</span></li>
							</ul>-->
							<ul v-if="systemID==4" v-show="IsActive.pointType==5">
								<li style="width:100%">_温度曲线_</li>
							</ul>
							<ul v-if="systemID==4" v-show="IsActive.pointType==6">
								<li style="width:100%">_油位曲线_</li>
							</ul>
						</div>
						<!--报表 table tbody-->
						<div id="table-wrap" class="table-wrap"  v-show="IsActive.pointType==0||IsActive.pointType==5||IsActive.pointType==6">
							<!--  轨迹点部分  -->
							<table  v-show="IsActive.pointType==0" class="table table-striped table-bordered table-hover" id="table-inner">
								<!--接甩挂-->
								<tbody v-if="systemID==1">
								<tr @click="showPointText(item.index-1)" class="cursor-pointer"
									v-for="(item,index) in getStartIndexData"
									:class="{'list-active':item.active,'':item.active}">
									<td width="5%">{{item.index}}</td>
									<td width="10%">{{item.time}}</td>
									<td width="5%">
										<i class="img-icon" :class="{'gps-light':item.locationType==1,
											   'net-light':item.locationType==2,
											   'wifi-light':item.locationType==3,
											   'red-light':item.locationType==0}"
										   :title="item.locationType==1?'GPS':(item.locationType==2?'_基站定位_':(item.locationType==3?'WIFI':'_不定位_'))"></i>
									</td>
									<td width="5%">{{item.speed}}</td>
									<td width="10%">{{item.mileage}}</td>
									<td width="5%">{{item.powerState}}</td>
									<td width="30%" align="left">
										<span class="text-nowrap-address" :title="item.address">{{item.address}}</span>
									</td>
									<td width="30%">
											<span class="tooltip-test text-nowrap-status"
												  :title="'_车头状态_:'+item.carState+'; _厢体状态_:'+item.containerState+';  _电量值_(%):'+item.powerState+';  _太阳能_:'+item.solarPower">
											  _车头状态_:{{item.carState}};&nbsp;_厢体状态_:{{item.containerState}};&nbsp;_电量值_(%):{{item.powerState}};&nbsp;_太阳能_:{{item.solarPower}};
											</span>
									</td>
								</tr>
								</tbody>
								<!--电子锁-->
								<tbody v-if="systemID==2">
								<tr @click="showPointText(item.index-1)" class="cursor-pointer"
									v-for="(item,index) in getStartIndexData"
									:class="{'list-active':item.active,'':item.active}">
									<td width="5%">{{item.index}}</td>
									<td width="10%">{{item.time}}</td>
									<td width="10%">
										<i class="img-icon" :class="{'gps-light':item.locationType==1,
											   'net-light':item.locationType==2,
											   'wifi-light':item.locationType==3,
											   'red-light':item.locationType==0}"
										   :title="item.locationType==1?'GPS':(item.locationType==2?'_基站定位_':(item.locationType==3?'WIFI':'_不定位_'))"></i>
									</td>
									<td width="10%">{{item.speed}}</td>
									<td width="10%">{{item.mileage}}</td>
									<td width="5%">{{item.powerState}}</td>
									<td width="30%" align="left">
										<span class="text-nowrap-address"  :title="item.address">{{item.address}}</span>
									</td>
									<td width="10%">
										<el-popover placement="top-start"
													width="460"
													offset="350"
													popper-class="popover-box"
													trigger="hover"
													:disabled="item.attitude==0">
											<i slot="reference" class="img-icon lock-state" :class="{'normal-lock':!item.lockStatus&&item.attitude<=1,
													'abnormal-lock':!item.lockStatus&&item.attitude>1,
													'normal-unlock':item.lockStatus&&item.attitude<=1,
													'abnormal-unlock':item.lockStatus&&item.attitude>1}"></i>

											<div class="pose-wrap">
												<img v-if="item.attitude!=0"
													 :src="'/static/img/pose/pose'+item.attitude+'.png'">
												<p class="top-left">_左视图_</p>
												<p class="top-right">_俯视图_</p>
												<p class="bom">_正视图_</p>
											</div>
										</el-popover>
									</td>
									<td width="10%">
										<span v-show="!item.lockRopeState" class="text-green">_正常_</span>
										<span v-show="item.lockRopeState" class="text-red">_异常_</span>
									</td>
								</tr>
								</tbody>
								<!--冷链-->
								<tbody v-if="systemID==3">
								<tr @click="showPointText(item.index-1)" class="cursor-pointer"
									v-for="(item,index) in getStartIndexData"
									:class="{'list-active':item.active,'':item.active}">
									<td width="5%">{{item.index}}</td>
									<td width="15%">{{item.time}}</td>
									<td width="5%">
										<i class="img-icon" :class="{'gps-light':item.locationType==1,
											   'net-light':item.locationType==2,
											   'wifi-light':item.locationType==3,
											   'red-light':item.locationType==0}"
										   :title="item.locationType==1?'GPS':(item.locationType==2?'_基站定位_':(item.locationType==3?'WIFI':'_不定位_'))"></i>
									</td>
									<td width="5%">{{item.speed}}</td>
									<td width="10%">{{item.mileage}}</td>
									<td width="10%" :class="{'text-red':item.powerState<=LowPowerThreshold}">
										{{item.powerState}}
									</td>
									<td width="30%" align="left">
										<el-popover placement="top-start"
													width="460"
													offset="60"
													popper-class="popover-box"
													trigger="hover">
											<p slot="reference" class="humiture-row">&nbsp;&nbsp;
												<span slot="reference">
													<i class="tire">{{item.number}}</i>
													<span class="humitureTxt">{{item.temperature}}&nbsp;℃</span>
												</span>
											</p>
											<div>
												<table class="popover-table" width="100%">
													<thead>
													<tr>
														<th width="10%">_序号_</th>
														<th width="20%">_温度_(℃)</th>
														<th width="20%">_湿度_(%)</th>
														<th width="20%">_电量_(%)</th>
														<th width="30%">ID</th>
													</tr>
													</thead>
													<tbody>
													<tr>
														<td align="center">{{item.number}}</td>
														<td align="center">{{item.temperature}}</td>
														<td align="center">{{item.humidity}}</td>
														<td align="center">{{item.sensorBattery}}</td>
														<td align="center">{{item.ID}}</td>
													</tr>
													</tbody>

												</table>
												<div class="popover-img img-tem"></div>
											</div>
										</el-popover>
									</td>
									<td width="20%" align="left">
										<span class="text-nowrap-address" :title="item.address">{{item.address}}</span>
									</td>
								</tr>
								</tbody>
								<!--车队-->
								<tbody v-if="systemID==4">
								<tr @click="showPointText(item.index-1)" class="cursor-pointer"
									v-for="(item,index) in getStartIndexData">
									<td width="5%">{{item.index}}</td>
									<td width="15%">{{item.time}}</td>
									<td width="10%">
										<i class="img-icon" :class="{'gps-light':item.locationType==1,
											   'net-light':item.locationType==2,
											   'wifi-light':item.locationType==3,
											   'red-light':item.locationType==0}"
										   :title="item.locationType==1?'GPS':(item.locationType==2?'_基站定位_':(item.locationType==3?'WIFI':'_不定位_'))"></i>
									</td>
									<td width="10%">{{item.speed}}</td>
									<td width="10%">{{item.mileage}}</td>
									<td width="10%" :class="{'text-red':item.powerState<=LowPowerThreshold}">
										{{item.powerState}}
									</td>
									<td width="30%" align="left">
										<span class="text-nowrap-address" :title="item.address">{{item.address}}</span>
									</td>
									<td width="10%" :align="item.fuelValue.length==0?'center':'left'">
										<span v-show="item.fuelValue.length==0">--</span>
											<span v-for="obj in item.fuelValue">
												&nbsp;&nbsp;<i class="tire">{{obj.number}}&nbsp;&nbsp;</i>{{obj.value}}&nbsp;L
											</span>
									</td>
								</tr>
								</tbody>
								<!--集装箱-->
								<tbody v-if="systemID==6">
								<tr @click="showPointText(item.index-1)" class="cursor-pointer"
									v-for="(item,index) in getStartIndexData"
									:class="{'list-active':item.active,'':item.active}">
									<td width="5%">{{item.index}}</td>
									<td width="10%">{{item.time}}</td>
									<td width="5%">
										<i class="img-icon" :class="{'gps-light':item.locationType==1,
											   'net-light':item.locationType==2,
											   'wifi-light':item.locationType==3,
											   'red-light':item.locationType==0}"
										   :title="item.locationType==1?'GPS':(item.locationType==2?'_基站定位_':(item.locationType==3?'WIFI':'_不定位_'))"></i>
									</td>
									<td width="10%" :class="{'text-red':item.powerState<=LowPowerThreshold}">
										{{item.powerState}}
									</td>
									<td width="40%" align="left">
										<span class="text-nowrap-address"  :title="item.address">{{item.address}}</span>
									</td>
									<td width="10%">{{item.FIsOpenDoor}}</td>
									<td width="10%">{{item.inTemperature}}&nbsp;&nbsp;/&nbsp;&nbsp;{{item.outTemperature}}</td>

									<td width="10%">{{item.FIsLoaded}}</td>
								</tr>
								</tbody>
							</table>
							<!--  运行段  运行段  运行段 胎压报警  开关锁 异常报表-->
							<!--
														<table v-show="IsActive.pointType!=0 && IsActive.pointType!=5 && IsActive.pointType!=6"
															   class="table table-striped table-bordered table-hover">
															&lt;!&ndash;通用   运行段&ndash;&gt;
															<tbody v-show="IsActive.pointType==1" v-if="systemID!=2">
															<tr @click="mapShowRunPath(index)" class="cursor-pointer"
																v-for="(item,index) in carRunArr.runData"
																:class="{'list-active':item.active,'':item.active}">
																<td width="5%">{{index+1}}</td>
																<td width="15%">{{item.startTime}}</td>
																<td width="15%">{{item.endTime}}</td>
																<td width="20%" align="left">
																	<span class="text-nowrap-address">{{item.startAddress}}</span>
																</td>
																<td width="20%" align="left">
																	<span class="text-nowrap-address">{{item.endAddress}}</span>
																</td>
																<td width="15%">{{item.timeValue}}</td>
																<td width="10%">{{item.mileage}}km</td>
															</tr>
															</tbody>
															&lt;!&ndash;电子锁 趟次报表&ndash;&gt;
															<tbody v-show="IsActive.pointType==1" v-if="systemID==2">
															<tr @click="mapShowRunPath(index)" class="cursor-pointer"
																v-for="(item,index) in carRunArr.runData"
																:class="{'list-active':item.active,'':item.active}">
																<td width="5%">{{index+1}}</td>
																<td width="15%">{{item.startTime}}</td>
																<td width="15%" align="left">
																	<span class="text-nowrap-address">{{item.startAddress}}</span>
																</td>
																<td width="10%">{{item.unlockType}}</td>
																<td width="15%">{{item.endTime}}</td>
																<td width="15%" align="left">
																	<span class="text-nowrap-address">{{item.endAddress}}</span>
																</td>
																<td width="15%">{{item.timeValue}}</td>
																<td width="20%">{{item.mileage}}km</td>
															</tr>
															</tbody>
															&lt;!&ndash;通用   停车点&ndash;&gt;
															<tbody v-show="IsActive.pointType==2">
															<tr @click="showStopPoint(index)" class="cursor-pointer"
																v-for="(item,index) in carStopPointArr.filterData"
																:class="{'list-active':item.active,'':item.active}">
																<td width="5%">{{index+1}}</td>
																<td width="15%">{{item.startTime}}</td>
																<td width="15%">{{item.endTime}}</td>
																<td width="15%">{{item.stopTime}}</td>
																<td width="30%">
																		<span class="tooltip-test text-nowrap-status" data-toggle="tooltip"
																			  :data-placement="index!=0?'left':'bottom'"
																			  :title="'_车头状态_:'+item.carState+'; _厢体状态_:'+item.containerState+';  _电量值_(%):'+item.powerState+';  _太阳能_:'+item.solarPower">
																		  _车头状态_:{{item.carState}};&nbsp;_厢体状态_:{{item.containerState}};&nbsp;_电量值_(%):{{item.powerState}};&nbsp;_太阳能_:{{item.solarPower}};
																		</span>
																</td>
																<td width="20%" align="left">
																	<span class="text-nowrap-address">{{item.address}}</span>
																</td>
															</tr>
															</tbody>
															&lt;!&ndash;胎压报警&ndash;&gt;
															<tbody v-show="IsActive.pointType==3" v-if="systemID==1">
															<tr @click="highlightShowTyre(index)" class="tire-alarm"
																v-for="(item,index) in tyreArr.data"
																:class="{'list-active':item.active,'':item.active}">
																<td width="5%">{{index+1}}</td>
																<td width="15%">
																	{{item.startTime}}</br>
																	{{item.endTime}}
																</td>
																<td width="15%" class="text-left">{{item.startAddress}}</td>
																<td width="15%" class="text-left">{{item.endAddress}}</td>
																<td width="10%">{{item.timeValue}}/{{item.mileage}}km</td>
																<td width="40%" class="text-left">
																	<p class="tyre-state" v-for="t in item.tyre">&nbsp;&nbsp;
																		<span class="square-number">{{t.tyreN}}</span>&nbsp;&nbsp;
																		<span>{{t.tyreS}}</span>&nbsp;&nbsp;
																		<span>{{t.tyreP}}&nbsp;bar</span>&nbsp;&nbsp;
																		<span>{{t.tyreT}}&nbsp;°C</span>
																	</p>
																</td>
															</tr>
															</tbody>
															&lt;!&ndash;开关锁&ndash;&gt;
															<tbody v-show="IsActive.pointType==3" v-if="systemID==2">
															<tr @click="showStopPoint(index)" class="cursor-pointer"
																v-for="(item,index) in carStopPointArr.filterData"
																:class="{'list-active':item.active,'':item.active}">
																<td width="5%">{{index+1}}</td>
																<td width="15%">{{item.startTime}}</td>
																<td width="20%">
																	<span class="text-nowrap-address">{{item.address}}</span>
																</td>
																<td width="60%">{{item.startTime}}</td>
															</tr>
															</tbody>
															&lt;!&ndash;异常报表&ndash;&gt;
															<tbody v-show="IsActive.pointType==4" v-if="systemID==2">
															<tr @click="showStopPoint(index)" class="cursor-pointer"
																v-for="(item,index) in carStopPointArr.filterData"
																:class="{'list-active':item.active,'':item.active}">
																<td width="5%">{{index+1}}</td>
																<td width="15%">{{item.startTime}}</td>
																<td width="20%">
																	<span class="text-nowrap-address">{{item.address}}</span>
																</td>
																<td width="60%">{{item.startTime}}</td>
															</tr>
															</tbody>
														</table>
							-->
							<!--温度曲线部分-->
							<div v-if="systemID==3 || systemID==4" v-show="IsActive.pointType==5" class="lineChart"
								 id="lineChart"></div>
							<!--油耗曲线部分-->
							<div v-if="systemID==4" v-show="IsActive.pointType==6" class="lineChart"
								 id="chartCollect"></div>
						</div>


					</div>

				</div>

			</div>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	import HighChart from 'highcharts/highstock'
	import baiduMap from "components/Common/baidu_map.vue"
	import carTree from "components/tree/tree.vue"
	import Vue from 'vue'
	//require("plugins/flatpickr/flatpickr.js")
	//require("!style!css!plugins/flatpickr/flatpickr.min.css")
	let _this = null
	export default{
		data(){
			_this = this
			return {
				maxHeight: 0,    //下侧列表最大高度
				isLoadTreeDom:true, //是不是加载树形组件
				subMenu: [
					{active: true},
					{active: false},
					{active: false}
				],
				choiceTime: [],//所选时间

				pickerOptions: {   //过滤未来的日期
					disabledDate: function (time) {
						if (time > new Date()) {
							return true
						} else {
							return false
						}
					}
				},
				IsActive: {
					isFullScreen: false,//地图全屏开关
					pointType: 0 //下部菜单显示车辆类型
					// 0 轨迹点 1运行段 2停车 3胎温胎压 4超速报警 5开关锁 6开关门 7加减油 8接甩挂
				},
				// 是否显示查询类型列表(点击查询时就会显示,一直到页面关闭都会为ture)
				isShowQueryDataTypeList:false,

				dateScopeTypeObj: {
					threeDay:[
						{id:"today",text:"_今天_"},
						{id:"yesterday",text:"_昨天_"},
						{id:"threeday",text:"_近三天_"},
					],
					thirtyDay:[
						{id:"month_today",text:"_今天_"},
						{id:"month_sevenday",text:"_近七天_"},
						{id:"month_thirtyDay",text:"_一个月_"},
					],
				},
				// 根据类型将查询类型分类(isChecked为选中时改变样式的字段)
				queryDataTypeList:{
					1:[
						{title:"_停车_",isChecked:false,name:"stop"},
						{title:"_超速报警_",isChecked:false,name:"alarm"},
						{title:"_胎压_",isChecked:false,name:"tire"},
						{title:"_运行段_",isChecked:false,name:"runSection"},
						{title:"_接甩挂_",isChecked:false,name:"trailer"}
					],
					2:[
						{title:"_停车_",isChecked:false,name:"stop"},
						{title:"_超速报警_",isChecked:false,name:"alarm"},
						{title:"_开关锁_",isChecked:false,name:"lock"},
					],
					4:[
						{title:"_停车_",isChecked:false,name:"stop"},
						{title:"_超速报警_",isChecked:false,name:"alarm"},
						{title:"_加减油_",isChecked:false,name:"oil"},
						{title:"_运行段_",isChecked:false,name:"runSection"},
					],
					6:[
						{title:"开关门_",isChecked:false,name:"door"},
					],
				},
				// 在状态栏中是否显示
				showStatusBarObj: {
					stop: false,
					alarm:false,
					oil:false,
					runSection:false,
					lock:false,
					door:false,
					tire:false,
					trailer:false,
				},
				showStatusBar:"",
				isShowSelectCarList: true,//右侧车辆搜索栏开关
				isShowHandleRow:true,     //配送系统中是不是显示最后操作列
				//初始化显示工具栏
				mapToolShow: true,

				LowPowerThreshold: this.$store.state.LowPowerThreshold, //低电量阈值  单位%

				carPointArr: [],  //轨迹点的数据
				ManifesData: [],   //货单数据
				SiteData: [],      //站点数据

				//运行段数组
				carRunArr: {
					runData: [],
					//运行段起始点和终点索引值数组
					startTimeIndex: [],
					endTimeIndex: [],
					//总运行时间
					allRunTime: 0,
					//总运行里程
					allMileage: 0
				},
				//停车点数组
				carStopPointArr: {
					//停车点数据
					stopData: [],
					//停车结束点对应停车轨迹点索引
					stopIndex: [],
					//过滤数据
					filterData: [],
					//过滤数据
					filterIndex: [],
					//停车时长选择
					choiceTime: 3
				},
				//报警点数组
				carAlarmPointArr: {
					//报警点数据
					alarmData: [],
					//报警结束点对应停车轨迹点索引
					alarmIndex: [],
					//过滤数据
					filterData: [],
					//过滤数据
					filterIndex: [],
					//报警时长选择
					choiceTime: 3
				},
				// 开关锁数据
				carLockPointArr:{
					lockData: [],
				},
				// 开关门数据
				carDoorPointArr:{
					doorData: [],
				},
				// 开关门数据
				carOilPointArr:{
					oilData: [],
				},
				// 接甩挂数据
				carTrailerPointArr:{
					trailerData: [],
				},
				//胎压数据
				tyreArr: {
					data: [],
					startTimeIndex: [],
					endTimeIndex: []
				},
				//锁数据
				lockArr: {
					data: [],
					startTimeIndex: [],
					endTimeIndex: []
				},

				//点轨迹开始索引值
				startIndex: 0,
				endIndex: 10,
				showPiontIndex:0, //显示的点的index
				//滚动加载点index数组
				scrollNum: [],//轨迹点地址逆编译完成index数组
				showNum: 35, //轨迹点表格显示个数
				//间距
				interval: 0,

				//树形图选项
				options: {
					showCheckbox: false, //是否支持多选
					halfCheckedStatus: false,//控制父框是否需要半钩状态
					search: {
						useInitial: true, //是否支持首字母搜索
						useEnglish: true, //是否是英文搜索
						customFilter: null // 自定义节点过滤函数
					}
				},
				//选择的车辆数据
				choiceCarData: {
					name: "",
					id: null,
					time: [],
					startTime: null,
					endTime: null,
					assetType:null	// 设备类型 如：701/702/JT701等等
				},

				tempChoiceCarDataTime:{
					start:null,
					end:null
				},

				systemID:"",

				queryDateScope: "thirtyDay",	//查询时间范围

				filterText: '',

				//温度折线图参数
				lineOption: {
					chart: {
						type: 'spline',
						zoomType: 'x',
						resetZoomButton: {
							position: {
								align: "right",
								verticalAlign: "top",
								x: 0,
								y: 10,
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
						enabled: true,
						barBackgroundColor: "#2885eb",
						liveRedraw: false,
						showFull: false
					},

					title: {
						text: '_温度曲线_',
						floating: true,
						align: "left",

					},
					xAxis: {
						type: 'String',
						lable: ''
					},
					yAxis: {
						title: {
							text: '_温度_ (℃)',
							align: "low",
							y: 0,
							x: -40,
							rotation: 0
						},
						lineColor: "#d7d7d7",
						lineWidth: 1
					},
					tooltip: {
						valueSuffix: '℃'
					},
					credits: {
						enabled: false
					},
					legend: {
						align: 'left',
						verticalAlign: 'top',
						layout: 'vertical',
						symbolHeight: 0,
						symbolWidth: 20,
						borderWidth: 0,
						y: 15
					},
					series: ''
				},
				//油位折线参数
				oilOption: this.$store.state.oilLineChart,
			}
		},
		activated: function () {
			this.isLoadTreeDom=true;
			if (this.$route.params.ID != undefined && this.$route.params.name != undefined) {
				this.choiceCarData.name = this.$route.params.name;
				this.choiceCarData.id = this.$route.params.ID;

				if (!this.$route.params.data) return;
				this.$refs.map.deleteOverlay();
				$('[ripple]').eq(0).click()
				this.isShowHandleRow=false;
				let data = this.$route.params.data;
				this.ManifesData.length = 0;
				let oneManifes = {
					FCargoName: data.FCargoName,
					assetID: data.assetID,
					FCargoCode: data.FCargoCode,
					name: data.name,
					startTime: data.FDeliveryTime,
					endTime: "_进行中_",
					FDriverName: data.FDriverName,
					//FDriverPhone: data.FDriverPhone,
					duration: "--",
					mileage: "--",
					NumberOfSites: data.FinishProgress.split("/")[1],
					FCarrier: data.FCarrier,
					FTripGUID: data.FTripGUID,
					FAssetGUID: data.FAssetGUID,
					active:false
				};
				this.IsActive.pointType = 7;
				this.ManifesData.push(oneManifes);
				this.getSiteAndPoint(oneManifes)
				this.openSubMenu();

			}
			//加载树形图
			this.loadTreeData();
		},
		props: {
			screenHeight: Number
		},
		components: {
			baiduMap: baiduMap,
			carTree: carTree,
		},
		mounted(){
			HighChart.setOptions({
				lang: {
					resetZoom: '_重置_'
				},
				rangeSelector: {
					buttons: [{
						type: 'all',
						text: 'All'
					}],
					selected: 1
				},
				global: {useUTC: false}
			});

			setTimeout(function () {
				_this.adjustPage();
				_this.$refs.map.initMap();
			}, 100);



			var tabHeight = $('.tab.active').height();

			function animateTabHeight() {
				tabHeight = $('.tab.active').height();
				$('.tabs-content').stop().css({height: tabHeight + 'px'});
			}

			animateTabHeight();
			$(".contentList-header").on('click',"li", function (e) {
				e.preventDefault();
				setTimeout(function(){
					_this.changePos();
				}, 50)
			});
			//非Ie9及其以下版本执行
			if (navigator.appName != "Microsoft Internet Explorer" || parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) > 9) {
				$('[ripple]').on('click', function (e) {
					var rippleDiv = $('<div class="ripple" />'), rippleOffset = $(this).offset(), rippleY = e.pageY - rippleOffset.top, rippleX = e.pageX - rippleOffset.left, ripple = $('.ripple');
					rippleDiv.css({
						top: rippleY - ripple.height() / 2,
						left: rippleX - ripple.width() / 2,
						background: $(this).attr('ripple-color')
					}).appendTo($(this));
					window.setTimeout(function () {
						rippleDiv.remove();
					}, 1500);
				});
			};
			//延迟加载解析地址函数  监听滚动事件
			document.getElementById("table-wrap").addEventListener('scroll', function () {
				//nDivHight = this.offsetHeight,
				if (_this.IsActive.pointType == 0) {
					let nDivHight = this.offsetHeight,
					    nScrollTop = this.scrollTop,              //滚动条高度
						maxIndex = _this.carPointArr.length,        //表格总个数
						trHight = $(this).find("tr").height()===null?31:$(this).find("tr").height(),    //内部单个tr的高度
						n = parseInt(nScrollTop / trHight);      //滚动高度计算出已经显示的tr个数

					this.showNum= Math.floor(nDivHight / trHight);

					let bottomHeight =maxIndex * trHight - nScrollTop - this.offsetHeight;
					if (bottomHeight <= 0) {
						$('#table-inner').css('margin-top', trHight * n+"px");
						$('#table-inner').css('margin-bottom',"0px");
					}else {
						$('#table-inner').css('margin-top', nScrollTop);
						$('#table-inner').css('margin-bottom', bottomHeight);

					}
					_this.startIndex = n;

					//console.log("显示第一个点",n)

					if (n + _this.showNum >= maxIndex) {
						_this.endIndex = maxIndex;
					} else {
						_this.endIndex = n + _this.showNum;
					};
					//console.log(_this.startIndex,_this.endIndex)

					for (let m = _this.startIndex; m <= _this.endIndex; m++) {
						if (m == maxIndex) return;
						if (_this.scrollNum.indexOf(m) === -1) {
							_this.scrollNum.push(m);
							////console.log(m)
							_this.geocoder(_this.mapType, _this.carPointArr[m].point, _this.carPointArr[m], 'address')

						}
					};

				}

			});

			//通过上下按键控制表格显示
			let upOrDownTable=function(e){
				e=e||window.event;
				e.preventDefault();
				if(e.keyCode===38){
					_this.scrollShowData(_this.showPiontIndex--);
				}else if(e.keyCode===40){
					_this.scrollShowData(_this.showPiontIndex++);
				};
				if (_this.showPiontIndex>=_this.carPointArr.length) _this.showPiontIndex=_this.carPointArr.length-1;
				if (_this.showPiontIndex<=0) _this.showPiontIndex=0;
				_this.showPointText(_this.showPiontIndex)
			};
			document.addEventListener("click", function () {
				document.removeEventListener("keydown",upOrDownTable)
			});

			document.getElementById("table-wrap").addEventListener("click", function (e) {
				e.stopPropagation();
				document.addEventListener("keydown", upOrDownTable)
			});


			//时间控件
			//格局化日期：yyyy-MM-dd
			this.choiceTime = [
				formatDate(0) + " 00:00:00",
				formatDate(0) + " 23:59:59"
			]

			function formatDate(day) {
				var date = new Date();
				var millSeconds = Math.abs(date) + (-day * 24 * 60 * 60 * 1000);
				var rDate = new Date(millSeconds);
				var myyear = rDate.getFullYear();
				var mymonth = rDate.getMonth() + 1;
				var myweekday = rDate.getDate();
				if (mymonth < 10) {
					mymonth = "0" + mymonth;
				}
				if (myweekday < 10) {
					myweekday = "0" + myweekday;
				}
				return (myyear + "-" + mymonth + "-" + myweekday);
			};


			// 今天
			$(document).on("click","#today,#month_today",function () {
				_this.choiceTime = [
					formatDate(0) + " 00:00:00",
					formatDate(0) + " 23:59:59"
				]
				_this.getCarData()
			});

			// 昨天
			$(document).on("click","#yesterday",function () {
				_this.choiceTime = [
					formatDate(1) + " 00:00:00",
					formatDate(1) + " 23:59:59"
				]
				_this.getCarData()
			});

			// 近三天
			$(document).on("click","#threeday",function () {
				_this.choiceTime = [
					formatDate(2) + " 00:00:00",
					formatDate(0) + " 23:59:59"
				]
				_this.getCarData()
			});

			// 近七天
			$(document).on("click","#month_sevenday",function () {
				_this.choiceTime = [
					formatDate(6) + " 00:00:00",
					formatDate(0) + " 23:59:59"
				]
				_this.getCarData()
			});

			// 一个月
			$(document).on("click","#month_thirtyDay",function () {
				_this.choiceTime = [
					formatDate(29) + " 00:00:00",
					formatDate(0) + " 23:59:59"
				]
				_this.getCarData()
			});


		},
		//updated(){
		//},
		methods: {
			//element  table  选择当前行 改变行样式
			choiceRow(row, index){
				if (row.active) {
					return "list-active"
				} else {
					return "cursor-pointer"
				}
			},

			//tabs切换效果
			//初始化下方边框
			changePos() {
				let activePos = $('.contentList-header .active').position();
				$('.border').stop().css({
					left: activePos.left,
					width: $('.contentList-header .active').width()
				});
			},

			//计算时间差
			getSecondValue(startTime, endTime){
				let stratVal = this.GetDateSeconds(startTime),
					endVal = this.GetDateSeconds(endTime);
				return endVal - stratVal;
			},
			//动态调整页面布局
			adjustPage(){
				this.elementsFlex("map-wrapper", "map-template", "map-tool", "contentList");
				this.elementsFlex("select-car", "map-template", "map-tool", "contentList");
				setTimeout(function () {
					let h = _this.elementsFlex("tree-body", "select-car", "tree-header", "tree-footer", true);
					_this.setScroll("tree-body", h);
					let tableHeight = $('#table-wrap').height();
					let trHight = $('#table-wrap').find("tr").height();
					let n = Math.floor(tableHeight / trHight);
					//console.log(n)
					////console.log("显示个数",n)
					if (isNaN(trHight) || isFinite(n)) {
						_this.showNum = 25;
					} else {
						_this.showNum = n;
					}
					//绘制温度曲线
					if (_this.systemID == 4 && _this.carPointArr.length != 0 && _this.IsActive.pointType == 5) HighChart.chart('lineChart', _this.lineOption);
					if (_this.systemID == 4 && _this.carPointArr.length != 0 && _this.IsActive.pointType == 6) HighChart.chart("chartCollect", _this.oilOption);
					////console.log(n);
				}, 1000)

			},
			//最小化下部菜单
			closeSubMenu(){
				this.changeActive(this.subMenu, 0);
				$("#map-tool").show();
				$("#contentList").height("35px");
				$("#contentList").css("overflow", "hidden");
				setTimeout(function () {
					_this.adjustPage()
				}, 200)
			},
			//展开下部菜单
			openSubMenu(){
				this.changeActive(this.subMenu, 2);
				$("#contentList").css("overflow", "visible")
				$("#map-tool").show();
				$("#contentList").height("220px");
				this.setScroll("table-wrap", 155);
				this.maxHeight = 185;
				setTimeout(function () {
					_this.adjustPage();
				}, 200)
			},
			//下部菜单全屏
			fullSubMenu(){
				this.changeActive(this.subMenu, 1);
				$("#contentList").css("overflow", "visible");
				$("#map-tool").hide();
				this.elementsFlex("contentList", "map-template");
				let height = this.elementsFlex("table-wrap", "contentList", "contentList-header", "table-header", true);
				this.setScroll("table-wrap", height - 40);
				this.maxHeight = height - 20;
				setTimeout(function () {
					_this.adjustPage()
				}, 200)
			},
			//调整下边栏列表高度
			setSubMenuHeight(){

				$("#contentList").height("220px");
				this.setScroll("table-wrap", 155)
				this.adjustPage()
			},
			//全屏
			changefullScreen(meg){
				this.IsActive.isFullScreen = meg;
				this.IsActive.menuFull = false;
				$("#contentList").height("35px");
				$("#contentList").css("overflow", "hidden");
				this.setScroll("table-wrap", 155)

				setTimeout(function () {
					_this.adjustPage()
				}, 100)
			},
			//切换显示轨迹点
			showAllPoints(){
				this.IsActive.pointType = 0;
				//$('#table-inner').css('margin-top', "0px");
			},
			//切换显示温度曲线
			showTemperature(){
				this.IsActive.pointType = 5;
				this.fullSubMenu();
			},
			//切换显示油位曲线
			showOilLine(){
				this.IsActive.pointType = 6;
				this.fullSubMenu();
			},
			//分析开锁类型
			parseOpenType(number){
				switch (number) {
					case 1:
						return "_刷卡开锁_";
					case 2:
						return "_远程开锁_";
					case 3:
						return "_蓝牙开锁_";
				}
			},
			/**
			 ******************************  右侧车辆列表功能   ************************************
			 **
			 **/
			//调取车辆信息
			loadTreeData() {
				_this.$store.commit('getAllCarsData', setData)

				function setData() {
					if (_this.$store.state.allCarsList.length == 0) {
						_this.$refs.map.showError("_暂无车辆数据_");
					}
				}

			},
			//展开车辆选择列表
			showCarList(){
				this.isShowSelectCarList = !this.isShowSelectCarList;
			},
			// 根据设备类型判断属于哪个系统
			judgeSystemByAsset(assetType){
				let systemType = "";
				switch (assetType){
					case 704:
					case 714:
					case 750:
					case 716:	// 集装箱
						systemType = 6;
						break;
					case 701:	//电子锁
					case 735:
					case 740:
					case 717:
						systemType = 2;
						break;
					case 703:	// 接甩挂
						systemType = 1;
						break;
					case 400:	// 车队
					case 600:
					case 603:
						systemType = 4;
						break;
				}
				return systemType;
			},
			//得到选择车辆的数据(非电子锁系统  树形菜单选择)
			getChoiceCarData(node){
				if (node.id.indexOf("@A") === -1 && node.id.indexOf("@B") === -1 && node.id.indexOf("@C") === -1) {
					this.choiceCarData.name = node.label;
					this.showStatusBar = "";
					if(!this.isShowQueryDataTypeList)this.isShowQueryDataTypeList=true;	// 显示选择查询状态按钮
					this.choiceCarData.id = node.id;
					this.choiceCarData.assetType = node.FAssetTypeID;
					console.log(node.FAssetTypeID);
					this.systemID = _this.judgeSystemByAsset(_this.choiceCarData.assetType);
					if(this.systemID!==""){
						this.emptyQueryDataTypeList();
					}
					if(this.systemID === 6){
						this.queryDateScope = "thirtyDay"
					}else {
						this.queryDateScope = "threeDay"
					}
				}
			},

			// 选择查询的类型
			selectQueryDataType(item){
				if(item.isChecked){
					this.showStatusBar = "";
					this.emptyQueryDataTypeList();
				}else {
					this.emptyQueryDataTypeList();
					item.isChecked=!item.isChecked;
					this.showStatusBar = item.name;
				}
			},
			// 清空选择类型
			emptyQueryDataTypeList(){
				for (let queryDataType in this.queryDataTypeList){
					let arr = this.queryDataTypeList[queryDataType];
					for (let i = 0;i < arr.length;i++){
						arr[i].isChecked = false;
					}
				}
				/*for (let i=0;i<this.queryDataTypeList[this.systemID].length;i++){
					this.queryDataTypeList[this.systemID][i].isChecked = false;
				}*/
			},
			//得到选择车辆的数据(电子锁系统  树形菜单选择)
			handleNodeClick(data){
				if (data.FAssetID.indexOf("@A") === -1) {
					this.choiceCarData.name = data.FVehicleName;
					this.choiceCarData.id = data.FAssetGUID;
				}
			},
			//修改间距数
			changeInterval(){
				this.$refs.map.overPlayPoint();
				this.$refs.map.showCarMileagePoint(this.interval);
			},


			/**
			 * ******************    轨迹点      ***************************************
			 *
			 * **/

			doWhichFun(name){
				switch (name){
					case "stop":
						this.getStopData();
						this.IsActive.pointType=2;
						break;
					case "trailer":
						this.getTrailerData();
						this.IsActive.pointType=8;
						break;
					case "alarm":
						this.getAlarmData();
						this.IsActive.pointType=4;
						break;
					case "oil":
						this.getOilData();
						this.IsActive.pointType=7;
						break;
					case "runSection":
						this.getRunData();
						this.IsActive.pointType=1;
						break;
					case "lock":
						this.getLockData();
						this.IsActive.pointType=5;
						break;
					case "door":
						this.getDoorData();
						this.IsActive.pointType=6;
						break;
					case "tire":
						this.getTyreData();
						this.IsActive.pointType=3;
						break;
				}
			},

			//请求车辆数据
			getCarData(){
				Pace.restart();
				this.$refs.map.overPlayPoint();

				//车辆不能为空
				if (this.choiceCarData.id == null) {
					_this.$refs.map.showError("_请选择车辆_");
					return;
				}
				if (this.choiceTime[0] == null || this.choiceTime[1] == null) {
					_this.$refs.map.showError("_请选择时间_");
					return;
				}

				let startTime = moment(this.choiceTime[0]).format("YYYY-MM-DD HH:mm:ss"),
					endTime = moment(this.choiceTime[1]).format("YYYY-MM-DD HH:mm:ss");

				let startDayTime = _this.parseUTC(startTime);
				let endDayTime = _this.parseUTC(endTime);

				_this.choiceCarData.startTime = _this.parseUTC(startTime);
				_this.choiceCarData.endTime = _this.parseUTC(endTime);
				// 如果时间改变了就清空查询类型直接查轨迹
				if(_this.tempChoiceCarDataTime.start===null){
					_this.tempChoiceCarDataTime.start = _this.choiceCarData.startTime;
					_this.tempChoiceCarDataTime.end = _this.choiceCarData.endTime;
				}else if(_this.tempChoiceCarDataTime.start!==_this.choiceCarData.startTime&&_this.tempChoiceCarDataTime.end!==_this.choiceCarData.endTime){
					this.emptyQueryDataTypeList();
					_this.showStatusBar="";
					_this.tempChoiceCarDataTime.start = _this.choiceCarData.startTime;
					_this.tempChoiceCarDataTime.end = _this.choiceCarData.endTime;
				}
				// 如果选择了类型就不查轨迹单独查类型
				if(_this.showStatusBar!==""){
					_this.doWhichFun(_this.showStatusBar);
					_this.showStatusBarObj[_this.showStatusBar] = true;
					setTimeout(function(){_this.changePos()},200);
					return
				}else {
					// 将除轨迹点意外的状态栏清空
					for (let item in _this.showStatusBarObj){
						_this.showStatusBarObj[item] = false;
					}
					this.IsActive.pointType=0;	// 轨迹点状态栏激活
					setTimeout(function(){_this.changePos()},200);
				}



				let FTableDate = moment(endDayTime).format("YYYYMMDD"),
					startSeconds = _this.GetDateSeconds(startTime.replace(/-/ig, "/")),
					endSeconds = _this.GetDateSeconds(endTime.replace(/-/ig, "/"));
				if (endSeconds > startSeconds) {
					if ((endSeconds - startSeconds) > 86400 * 15&&this.systemID!==6) {
						_this.$refs.map.showError("_单次只能查询三天内数据_，_请重选起始时间_!");
						return;
					}else if((endSeconds - startSeconds) > 86400 * 30&&this.systemID===6){
						_this.$refs.map.showError("_单次只能查询三十天内数据_，_请重选起始时间_!");
						return;
					}
				} else {
					_this.$refs.map.showError("_结束时间需要大于开始时间_，_请重选起始时间_!");
					return;
				};

				//初始化数据

				_this.ManifesData=[];
				_this.SiteData=[];
				_this.greenSite=[];
				_this.scrollNum = [];
				_this.carRunArr.runData = [];//车辆运行数据
				_this.carRunArr.startTimeIndex = [];
				_this.carRunArr.endTimeIndex = [];
				_this.carRunArr.allRunTime = 0;
				_this.carRunArr.allMileage = 0;

				_this.carStopPointArr.stopData = [];//车辆停止数据
				_this.carStopPointArr.stopIndex = [];
				_this.carStopPointArr.filterData = [];
				_this.carStopPointArr.filterIndex = [];

				_this.tyreArr.data = [];//胎压报警段
				_this.tyreArr.startTimeIndex = [];//胎压报警段
				_this.tyreArr.endTimeIndex = [];//胎压报警段

				_this.startIndex = 0;
				_this.endIndex = 10;
				$('#table-inner').css('margin-top', "0px");
				document.getElementById("table-wrap").scrollTop =0;
				_this.$refs.map.deleteOverlay();

				if(_this.systemID===7){
					_this.getTripDetail()
					return
				}

				// 获取间隔天数
				function getDays(day1, day2) {
					// 获取入参字符串形式日期的Date型日期
					var st = day1.getDate();
					var et = day2.getDate();

					// 定义返回的数组
					var retArr = [];

					// 循环，启动日期不等于结束日期时，进行循环
					while (st.getTime() != et.getTime()) {

						// 将启动日期的字符串形式的日期存放进数组
						retArr.push(st.getYMD());

						// 取得开始日期的天
						var tempDate = st.getDate();

						// 将开始日期st指向构造出的新的日期
						// 新的日期较之前的日期多加一天
						st = new Date(st.getFullYear(), st.getMonth(), st.getDate() + 1);
					}

					// 将结束日期的天放进数组
					retArr.push(et.getYMD());

					return retArr // 或可换为return ret;
				}

				// 给Date对象添加getYMD方法，获取字符串形式的年月日
				Date.prototype.getYMD = function () {
					let retDate = this.getFullYear() + "-";  // 获取年份。
					if (this.getMonth() + 1 < 10) {
						retDate += '0' + (this.getMonth() + 1) + "-";    // 获取月份。
					} else {
						retDate += this.getMonth() + 1 + "-";    // 获取月份。
					}

					if (this.getDate() < 10) {
						retDate += '0' + this.getDate();    // 获取日。
					} else {
						retDate += this.getDate();    // 获取日。
					}
					return retDate;                          // 返回日期。
				}
				// 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期
				String.prototype.getDate = function () {
					var strArr = this.split('-');
					var date = new Date(strArr[0], strArr[1] - 1, strArr[2]);
					return date;
				};

				let startDay = startDayTime.split(" ")[0];
				let startT = startDayTime.split(" ")[1];
				let endDay = endDayTime.split(" ")[0];
				let endT = endDayTime.split(" ")[1];

				let days = getDays(startDay, endDay);


				//后台接口不支持跨天查询 支持后可使用 避免循环调用接口
				//if(_this.systemID===6){ //集装箱系统查询方法
				//	_this.getContainerPath(days)
				//	return
				//}

				_this.choiceCarData.time = [];
				if (days.length == 1) {
					_this.choiceCarData.time.push({
						start: days[0] + " " + startT,
						end: days[0] + " " + endT
					});
				} else {
					for (var k = 0; k < days.length; k++) {
						let item = days[k];
						let obj;
						if (k == 0) {
							obj = {
								start: item + " " + startT,
								end: item + " 23:59:59"
							}
						} else if (k == days.length - 1) {
							obj = {
								start: item + " 00:00:00",
								end: item + " " + endT
							}
						} else {
							obj = {
								start: item + " 00:00:00",
								end: item + " 23:59:59"
							}
						}
						_this.choiceCarData.time.push(obj);
					}
				}
				//console//console.log("choiceCarData.time", _this.choiceCarData.time);


				let initData = [],
					info = {},
					temperatureData = [],
					Tobj = info,
					order = [], //记录设备id顺序
					timeArr = [];

				//请求数据轨迹点数据
				function getAllPoints(start, end, callback) {
					console.log(_this.choiceCarData.assetType);
					let url="/web/Combine/Combine_LBS",
						action="QueryLBSTrackListByFVehicleGUID",
						GUID="FVehicleGUID";

					let postData = {
						FTokenID: _this.$store.state.FTokenID,
						FAction: action,
						[GUID]: _this.choiceCarData.id,
						FAssetTypeID:_this.choiceCarData.assetType,
						FStartTime: start,
						FEndTime: end,
						FTableDate: end.replace(/-/g, '').split(" ")[0],
						FVersion: "1.0.0",
						FState:-1,
					};
					$.ajax({
						"url": url,
						"cache": false,
						"async": false, //同步方法
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": JSON.stringify(postData),
						success: function (res) {
							console.log("轨迹点", res);

							if (res.Result == 104) {
								_this.$refs.map.showError("_登录超时_，_请重新登录页面_");
								setTimeout(function () {
									_this.$store.commit("goLogin");
								}, 5000)
							};
							if (res.Result == 200) {
								let Arr;

								switch (_this.systemID) {
									case 1:
										if (res.FObject.length != 0) initData = initData.concat(JSON.hunpack(eval(res.FObject), 1));
										break;
									case 2:
										if (res.FObject.length != 0) initData = initData.concat(JSON.hunpack(eval(res.FObject), 1));
										break;
									case 3:
										info = res.FObject.Table[0],
										initData = initData.concat(res.FObject.Table1);
										break;
									case 4:
										if (res.FObject.length != 0) initData = initData.concat(JSON.hunpack(eval(res.FObject), 1));
										break;
									case 6:
										if (res.FObject.length != 0) initData = initData.concat(JSON.hunpack(eval(res.FObject), 4));
										break;
								}
							};
							callback();


						}
					})

				};


				let choiceTime = _this.choiceCarData.time;
				let num = 0;
				for (var m = 0; m < choiceTime.length; m++) {
					let t = choiceTime[m];
					setTimeout(function () {
						getAllPoints(t.start, t.end, function () {
							num++;
							if (num == choiceTime.length) {
								console.log("总的原始数据", initData);
								_this.carPointArr = [];//车辆轨迹点
								if (initData.length == 0) {
									_this.$refs.map.showError("_暂无数据_");
									return
								} else {
									let points = [],
										location_points = [],
										pointData;
//console.log(1)
									switch (_this.systemID) {
										case 1:

											for (var i = 0; i < initData.length; i++) {
												let pointArr = initData[i];
												let time = _this.parseGMT(pointArr.FGPSDateTime);
												//轨迹点数据

												pointData = {
													index: i + 1,
													time: time,
													speed: pointArr.FSpeed,
													mileage: pointArr.FMileage,
													direction: pointArr.FDirection,
													carState: pointArr.FCouplingStatus = 1 ? "_接挂_" : "_甩挂_",
													containerState: pointArr.FContainerStatus ? "_有厢_" : "_无厢_",
													solarPower: pointArr.FSolarCharge ? "_充电_" : "_未充电_",
													powerState: pointArr.FBatteryPercent > 100 ? "_充电中_" : (pointArr.FBatteryPercent == -1 ? "--" : pointArr.FBatteryPercent),
													point: _this.parsePoint(_this.mapType,{
														lng: parseFloat(pointArr.FLongitude),
														lat: parseFloat(pointArr.FLatitude)
													}),
													address: "_获取位置信息中_",
													locationType: pointArr.FLocationType,
													active: false
												};
												_this.carPointArr.push(pointData);
												//排除坐标为零的点
												if (pointArr.FLongitude != 0 && pointArr.FLatitude != 0) {
													if (pointArr.FLocationType !== 2) {
														points.push(pointData.point);
													}else {
														location_points.push(pointData.point);
													}
													//预先转译地址
													if (_this.carPointArr.length > 0 && i < _this.endIndex) {
														let n = i;
														_this.geocoder(_this.mapType, _this.carPointArr[n].point, _this.carPointArr[n], 'address')
													}

												} else {
													_this.carPointArr[i].address = "_无定位_";
												}

											};
											if (_this.carPointArr.length > 0) {
												_this.$refs.map.showCarRoute(_this.carPointArr, points, location_points);
												_this.$refs.map.showAllMap();
												_this.openSubMenu();
											};
											break;
										case 2:
											for (var i = 0; i < initData.length; i++) {
												let pointArr = initData[i];
												let time = _this.parseGMT(pointArr.FGPSDateTime);
												//轨迹点数据

												pointData = {
													index: i + 1,
													time: time,
													speed: pointArr.FSpeed,
													mileage: pointArr.FMileage,
													direction: pointArr.FDirection,

													lockRopeState: pointArr.FLockRope,
													lockStatus: pointArr.FLockStatus,
													attitude: 0,        //锁姿态  无姿态数据为null 数据格式 字符串 x轴，y轴，z轴
													powerState: pointArr.FBatteryPercent > 100 ? "_充电中_" : (pointArr.FBatteryPercent == -1 ? "--" : pointArr.FBatteryPercent),
													point: _this.parsePoint(_this.mapType,{
														lng: parseFloat(pointArr.FLongitude),
														lat: parseFloat(pointArr.FLatitude)
													}),
													address: "_获取位置信息中_",
													locationType: pointArr.FLocationType,
													active: false
												};
												if (pointArr.FAttitude != null && pointArr.FAttitude != '') {
													pointData.attitude = _this.parseLockPose(pointArr.FAttitude);
												}
												_this.carPointArr.push(pointData);
												//排除坐标为零的点
												if (pointArr.FLongitude != 0 && pointArr.FLatitude != 0) {
													if (pointArr.FLocationType !== 2) {
														points.push(pointData.point);
													}else {
														location_points.push(pointData.point);
													}
													//预先转译地址
													if (_this.carPointArr.length > 0 && i < _this.endIndex) {
														let n = i;
														_this.geocoder(_this.mapType, _this.carPointArr[n].point, _this.carPointArr[n], 'address')
													}

												} else {
													_this.carPointArr[i].address = "_无定位_";
												}

											};
											if (_this.carPointArr.length > 0) {
												_this.$refs.map.showCarRoute(_this.carPointArr, points, location_points);
												_this.$refs.map.showAllMap();
												_this.openSubMenu();

											};
											break;
										case 3:
											Tobj = info;
											order = []; //记录设备id顺序
											timeArr = [];
											for (let i = 1; i <= 6; i++) {
												if (Tobj['FSensorID' + i] != null) {
													order.push(Tobj['FSensorID' + i])
												}
											}
											//console.log(order);
											let newIndex = 0; //新建计数器 记录过滤后数据的index


											for (let i = 0; i < initData.length; i++) {
												var obj = initData[i];
												//过滤多余数据

												if (order.indexOf(obj.FSensorID1) != -1) {
													newIndex++;
													//获取每个点的分钟 数组
													let timeItem = moment(_this.parseGMT(obj.FGPSDateTime)).format("YYYY-MM-DD HH:mm");
													if (timeArr.indexOf(timeItem) == -1) timeArr.push(timeItem);
													//console.log(obj.FLongitude, obj.FLatitude)
													let oneData = {
														time: _this.parseGMT(obj.FGPSDateTime),
														speed: obj.FSpeed,
														mileage: obj.FMileage,
														direction: obj.FDirection,
														powerState: obj.FBatteryPercent > 100 ? "_充电中_" : (obj.FBatteryPercent == -1 ? "--" : obj.FBatteryPercent),
														point: _this.parsePoint(_this.mapType,{
															lng: parseFloat(obj.FLongitude),
															lat: parseFloat(obj.FLatitude)
														}),
														index: newIndex,
														chartIndex: timeArr.indexOf(timeItem),
														number: null,
														temperature: _this.parseTemperature(obj.FTemperature1),
														humidity: obj.FHumidity1,
														sensorBattery: obj.FSensorBattery1,
														ID: obj.FSensorID1,
														locationType: obj.FLocationType,
														active: false,
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
													;
													oneData.number = alphaCode;
													//排除坐标为零的点
													if (pointArr.FLongitude != 0 && pointArr.FLatitude != 0) {
														points.push(pointData.point);

														//预先转译地址
														if (_this.carPointArr.length > 0 && i < _this.endIndex) {
															let n = i;
															_this.geocoder(_this.mapType, _this.carPointArr[n].point, _this.carPointArr[n], 'address')
														}

													} else {
														_this.carPointArr[i].address = "_无定位_";
													}

													_this.carPointArr.push(oneData);
													points.push(oneData.point);

												}
											}

											//console.log(_this.carPointArr);
											if (_this.carPointArr.length > 0) {
												_this.$refs.map.showCarRoute(_this.carPointArr, points);

												_this.openSubMenu();
												setTimeout(function () {
													_this.$refs.map.showAllMap()
												}, 300);

											}
											;
											let chartData = [];
											timeArr.map(function (item, index) {
												let tableItem = {
													//index:index+1,
													time: item,
													group: {
														1: [null, null, null, null],  //0 温度 1 湿度 2 电量 3 ID
														2: [null, null, null, null],
														3: [null, null, null, null],
														4: [null, null, null, null]
													},
													//speed:null,
													//mileage: null,
													//direction: null,
													//powerState:null,
													//point:null,
													//address: "_获取位置信息中_",
													//active: false
												}
												chartData.push(tableItem)
											})
											//console.log("绘图数据", chartData);
											_this.carPointArr.map(function (item, index) {

												chartData[item.chartIndex].group[item.number][0] = item.temperature;
												chartData[item.chartIndex].group[item.number][1] = item.humidity;
												chartData[item.chartIndex].group[item.number][2] = item.sensorBattery;
												chartData[item.chartIndex].group[item.number][3] = item.ID;
												//if(chartData[item.chartIndex].speed==null) chartData[item.chartIndex].speed=item.speed;
												//if(chartData[item.chartIndex].mileage==null) chartData[item.chartIndex].mileage=item.mileage;
												//if(chartData[item.chartIndex].direction==null) chartData[item.chartIndex].direction=item.direction;
												//if(chartData[item.chartIndex].powerState==null) chartData[item.chartIndex].powerState=item.powerState;
												//if(chartData[item.chartIndex].point==null) chartData[item.chartIndex].point=item.point;

											})
											let assetCount = order.length; //设备数量
											_this.lineOption.series = []
											for (let j = 0; j < assetCount; j++) {

												_this.lineOption.series.push({
													name: '_传感器_' + (j + 1),
													data: []
												})
											}
											_this.lineOption.xAxis.categories = [];
											chartData.map(function (item, index) {
												_this.lineOption.xAxis.categories.push(item.time.split(" ")[1]);
												let n = 0;
												for (let key in item.group) {
													let arr = [];
													arr.push(item.time);
													arr.push(item.group[key][0])
													_this.lineOption.series[n].data.push(arr);
													n++
												}
											})
											HighChart.chart('lineChart', _this.lineOption);
											break;
										case 4:
											_this.oilOption.series[0].data.length = 0;
											_this.oilOption.series[1].data.length = 0;
											_this.oilOption.series[2].data.length = 0;

											for (var i = 0; i < initData.length; i++) {
												let pointArr = initData[i];
												let time = _this.parseGMT(pointArr.FGPSDateTime);

												//轨迹点数据
												pointData = {
													index: i + 1,
													time: time,
													speed: pointArr.FSpeed,
													mileage: pointArr.FMileage,
													direction: pointArr.FDirection,
													powerState: pointArr.FBatteryPercent > 100 ? "_充电中_" : (pointArr.FBatteryPercent == -1 ? "--" : pointArr.FBatteryPercent),
													point: _this.parsePoint(_this.mapType,{
														lng: parseFloat(pointArr.FLongitude),
														lat: parseFloat(pointArr.FLatitude)
													}),
													fuelValue: [],
													address: "_获取位置信息中_",
													locationType: pointArr.FLocationType,
													active: false
												};

												//油量
												if (_this.systemID == 4) {
													let fuelValue = pointData.fuelValue;
													for (let j = 1; j < 4; j++) {
														if (pointArr['FFuelValue' + j] != -1) {
															let item = {
																number: j,
																value: pointArr['FFuelValue' + j]
															}
															fuelValue.push(item)
														}
													}
												}

												if (pointData.fuelValue.length !== 0) {

													let t = _this.getUTCTime(pointArr.FGPSDateTime);
													_this.oilOption.series[0].data.push([t, pointArr.FFuelValue1]);
													//this.option.series[0].data.push(Number(result[i].FFuelValue1));
													_this.oilOption.series[1].data.push([t, pointArr.FMileage]);
													//this.option.series[1].data.push(result[i].FMileage);
													_this.oilOption.series[2].data.push([t, pointArr.FSpeed]);

												}
												_this.carPointArr.push(pointData);
												/*if(_this.excludeSpeed){
													if(pointData.speed>_this.speedContent){
														_this.carPointArr.push(pointData);
													}
												}else {
													_this.carPointArr.push(pointData);
												}*/

												////console.log("过滤后的carPointArr",_this.carPointArr);

												//排除坐标为零的点
												if (pointArr.FLongitude != 0 && pointArr.FLatitude != 0) {
													if (pointArr.FLocationType !== 2) {
														points.push(pointData.point);
													}else {
														location_points.push(pointData.point);
													}
													//预先转译地址
													if (_this.carPointArr.length > 0 && i < _this.endIndex) {
														let n = i;
														_this.geocoder(_this.mapType, _this.carPointArr[n].point, _this.carPointArr[n], 'address')
													}

												} else {
													_this.carPointArr[i].address = "_无定位_";
												}


											};

											//绘制地图线路 并显示油量曲线
											if (_this.carPointArr.length > 0) {
												_this.$refs.map.showCarRoute(_this.carPointArr, points, location_points);
												_this.$refs.map.showAllMap();
												_this.openSubMenu();
												HighChart.chart("chartCollect", _this.oilOption);
											};
											// _this.getTemperature(choiceTime);
											/*//解析温度数据 并绘制曲线
											 let chartData4=[];
											 timeArr.map(function(item,index){
											 let tableItem={
											 //index:index+1,
											 time:item,
											 group:{
											 1:[null,null,null,null],  //0 温度 1 湿度 2 电量 3 ID
											 2:[null,null,null,null],
											 3:[null,null,null,null],
											 4:[null,null,null,null]
											 }
											 }
											 chartData4.push(tableItem)
											 })
											 //console.log("绘图数据",chartData4);
											 _this.carPointArr.map(function(item,index){

											 chartData4[item.chartIndex].group[item.number][0]=item.temperature;
											 chartData4[item.chartIndex].group[item.number][1]=item.humidity;
											 chartData4[item.chartIndex].group[item.number][2]=item.sensorBattery;
											 chartData4[item.chartIndex].group[item.number][3]=item.ID;

											 })
											 let assetCount4=order.length; //设备数量
											 _this.lineOption.series=[]
											 for (let j = 0; j < assetCount4; j++) {

											 _this.lineOption.series.push({
											 name:'_传感器_'+(j+1),
											 data:[]
											 })
											 }
											 _this.lineOption.xAxis.categories=[];
											 chartData4.map(function(item,index){
											 _this.lineOption.xAxis.categories.push(item.time.split(" ")[1]);
											 let n=0;
											 for (let key in item.group){
											 let arr=[];
											 arr.push(item.time);
											 arr.push(item.group[key][0])
											 _this.lineOption.series[n].data.push(arr);
											 n++
											 }
											 });
											 HighChart.chart('lineChart',_this.lineOption);*/
											break;
										case 6:
											for (var i = 0; i < initData.length; i++) {
												let pointArr = initData[i];
												let time = _this.parseGMT(pointArr.FGPSDateTime);
												//轨迹点数据

												pointData = {
													index: i + 1,
													time: time,
													locationType: pointArr.FLocationType,
													inTemperature: _this.parseTemperature(pointArr.FInsideTemperature),
													outTemperature: _this.parseTemperature(pointArr.FOutsideTemperature),
													FIsLoaded: pointArr.FBoxLoadedStatus == -1 || pointArr.FBoxLoadedStatus == null ? "--" : (pointArr.FBoxLoadedStatus ? "_重载_" : "_空载_"),
													FIsOpenDoor: pointArr.FBoxDoorStatus == -1 || pointArr.FBoxDoorStatus == null ? "--" : (pointArr.FBoxDoorStatus ? "_开启_" : "_关闭_" ),

													powerState: pointArr.FBatteryPercent > 100 ? "_充电中_" : pointArr.FBatteryPercent,
													point: _this.parsePoint(_this.mapType,{
														lng: parseFloat(pointArr.FLongitude),
														lat: parseFloat(pointArr.FLatitude)
													}),
													address: "_获取位置信息中_",
													active: false
												};


												_this.carPointArr.push(pointData);
												//排除坐标为零的点
												if (pointArr.FLongitude != 0 && pointArr.FLatitude != 0) {
													if (pointArr.FLocationType !== 2) {
														points.push(pointData.point);
													}else {
														location_points.push(pointData.point);
													}
													//预先转译地址
													if (_this.carPointArr.length > 0 && i < _this.endIndex) {
														let n = i;
														_this.geocoder(_this.mapType, _this.carPointArr[n].point, _this.carPointArr[n], 'address')
													}

												} else {
													_this.carPointArr[i].address = "_无定位_";
												}

											}
											;
											if (_this.carPointArr.length > 0) {
												_this.$refs.map.showCarRoute(_this.carPointArr, points, location_points);
												_this.$refs.map.showAllMap();
												_this.openSubMenu();
											}
											;
											break;
									}
									//if (_this.systemID != 6) _this.getRunData();
								}
							}
						})
					}, 100 * m)
				}
			},
			//请求集装箱轨迹
			getContainerPath(days){  //后台接口不支持跨天查询 支持后可使用
				let dateArr=[],
				    points = [],
					pointData;
				days.map(function (item,index) {
					dateArr.push(item.replace(/-/g, ''))
				})
				let postData = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: 'QueryLBSTrackListByFVehicleGUID',
					FVehicleGUID: _this.choiceCarData.id,
					FStartTime: _this.choiceCarData.startTime,
					FEndTime: _this.choiceCarData.endTime,
					FTableDate: dateArr.join(","),
					FVersion: "1.0.0"
				};
				$.ajax({
					"url": "/web/Container/Container_LBS",
					"cache": false,
					"async": true, //同步方法
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (res) {

						//console.log("集装箱轨迹数据", res);

						if (res.Result == 200) {

							if(res.FObject.length==0) {
								_this.$refs.map.showError("_暂无数据_");
								return
							}
							let initData=JSON.hunpack(eval(res.FObject), 4)

							for (var i = 0; i < initData.length; i++) {
								let pointArr = initData[i];
								let time = _this.parseGMT(pointArr.FGPSDateTime);
								//轨迹点数据
								let pointData = {
									index: i + 1,
									time: time,
									locationType: pointArr.FLocationType,
									inTemperature: _this.parseTemperature(pointArr.FInsideTemperature),
									outTemperature: _this.parseTemperature(pointArr.FOutsideTemperature),
									FIsLoaded: pointArr.FBoxLoadedStatus == -1 || pointArr.FBoxLoadedStatus == null ? "--" : (pointArr.FBoxLoadedStatus ? "_重载_" : "_空载_"),
									FIsOpenDoor: pointArr.FBoxDoorStatus == -1 || pointArr.FBoxDoorStatus == null ? "--" : (pointArr.FBoxDoorStatus ? "_开启_" : "_关闭_" ),

									powerState: pointArr.FBatteryPercent > 100 ? "_充电中_" : pointArr.FBatteryPercent,
									point: _this.parsePoint(_this.mapType,{
										lng: parseFloat(pointArr.FLongitude),
										lat: parseFloat(pointArr.FLatitude)
									}),
									address: "_获取位置信息中_",
									active: false
								};


								_this.carPointArr.push(pointData);
								//排除坐标为零的点
								if (pointArr.FLongitude != 0 && pointArr.FLatitude != 0) {
									points.push(pointData.point);

									//预先转译地址
									if (_this.carPointArr.length > 0 && i < _this.endIndex) {
										let n = i;
										_this.geocoder(_this.mapType, _this.carPointArr[n].point, _this.carPointArr[n], 'address')
									}

								} else {
									_this.carPointArr[i].address = "_无定位_";
								}

							}
							;
							if (_this.carPointArr.length > 0) {
								_this.$refs.map.showCarRoute(_this.carPointArr, points);
								_this.$refs.map.showAllMap();
								_this.openSubMenu();
							};

						}

					}
				})
			},
			//车队请求温度曲线数据
			getTemperature(choiceTime){
				let allData = [];
				let order = []; //记录设备id顺序
				let assetCount = 4; //设备数量
				let timeArr = [];
				let temperatureData = [];
				let ID = _this.choiceCarData.id;
				let num = 0;

				let IDPostData = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryAdminAssetByFVehicleGUID",
					FVehicleGUID: ID,
					FVersion: "1.0.0"
				};

				$.ajax({
					"url": '/web/Common/Common_Admin',
					"cache": false,
					"async": false, //同步方法
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(IDPostData),
					success: function (res) {
						//console.log("温度ID", res);
						if (res.Result == 200) {

							if (res.FObject.length == 0) return;

							for (let i = 1; i <= assetCount; i++) {
								if (res.FObject[0]['FSensorID' + i] != null) {
									order.push(res.FObject[0]['FSensorID' + i])
								}
							}
						}
						;
					}
				})


				for (let m = 0; m < choiceTime.length; m++) {
					let t = choiceTime[m];
					setTimeout(function () {
						getTem(t.start, t.end, function () {
							num++;
							if (num == choiceTime.length) {
								//console.log("温度曲线数据", temperatureData);
								if (temperatureData.length == 0) {
									_this.$refs.map.showError("暂无温度数据");
									return
								} else {


									let newIndex = 0; //新建计数器 记录过滤后数据的index


									for (let i = 0; i < temperatureData.length; i++) {
										var obj = temperatureData[i];
										//过滤多余数据

										if (order.indexOf(obj.FSensorID1) != -1) {
											newIndex++;
											//获取每个点的分钟 数组
											let timeItem = moment(_this.parseGMT(obj.FGPSDateTime)).format("YYYY-MM-DD HH:mm");
											if (timeArr.indexOf(timeItem) == -1) timeArr.push(timeItem);

											let oneData = {
												time: _this.parseGMT(obj.FGPSDateTime),

												index: newIndex,
												chartIndex: timeArr.indexOf(timeItem),
												number: null,
												temperature: _this.parseTemperature(obj.FTemperature1),
												humidity: obj.FHumidity1,
												sensorBattery: obj.FSensorBattery1,
												ID: obj.FSensorID1
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

													}
													;
													break
												}
											}
											;
											oneData.number = alphaCode;
											//防止过滤坐标为0的点
											allData.push(oneData);
										}
									}


									let chartData = [];
									timeArr.map(function (item, index) {
										let tableItem = {
											//index:index+1,
											time: item,
											group: {
												1: [null, null, null, null],  //0 温度 1 湿度 2 电量 3 ID
												2: [null, null, null, null],
												3: [null, null, null, null],
												4: [null, null, null, null]
											}

										}
										chartData.push(tableItem)
									})
									//console.log("绘图数据", chartData);
									allData.map(function (item, index) {

										chartData[item.chartIndex].group[item.number][0] = item.temperature;
										chartData[item.chartIndex].group[item.number][1] = item.humidity;
										chartData[item.chartIndex].group[item.number][2] = item.sensorBattery;
										chartData[item.chartIndex].group[item.number][3] = item.ID;
										//if(chartData[item.chartIndex].speed==null) chartData[item.chartIndex].speed=item.speed;
										//if(chartData[item.chartIndex].mileage==null) chartData[item.chartIndex].mileage=item.mileage;
										//if(chartData[item.chartIndex].direction==null) chartData[item.chartIndex].direction=item.direction;
										//if(chartData[item.chartIndex].powerState==null) chartData[item.chartIndex].powerState=item.powerState;
										//if(chartData[item.chartIndex].point==null) chartData[item.chartIndex].point=item.point;

									})
									let assetCount = order.length; //设备数量
									_this.lineOption.series = []
									for (let j = 0; j < assetCount; j++) {

										_this.lineOption.series.push({
											name: '_传感器_' + (j + 1),
											data: []
										})
									}
									_this.lineOption.xAxis.categories = [];
									chartData.map(function (item, index) {
										_this.lineOption.xAxis.categories.push(item.time.split(" ")[1]);
										let n = 0;
										for (let key in item.group) {
											let arr = [];
											arr.push(item.time);
											arr.push(item.group[key][0])
											_this.lineOption.series[n].data.push(arr);
											n++
										}
									})
									HighChart.chart('lineChart', _this.lineOption);

								}
							}
						})
					}, 100 * m)
				}

				function getTem(start, end, callback) {
					let postData = {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryLBSTrackExTemperatureListByFVehicleGUID",
						FVehicleGUID: ID,
						FStartTime: start,
						FEndTime: end,
						FTableDate: end.replace(/-/g, '').split(" ")[0],
						FVersion: "1.0.0"
					};
					$.ajax({
						"url": '/web/ColdChain/ColdChain_LBS',
						"cache": false,
						"async": false, //同步方法
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": JSON.stringify(postData),
						success: function (res) {
							//console.log("温度曲线值", res);

							if (res.Result == 200) {
								if (res.FObject.length != 0) temperatureData = temperatureData.concat(JSON.hunpack(eval(res.FObject), 4));
								callback();
							}
							;


						}
					})

				}

			},
			//地图车辆信息显示框
			showPointText(index) {
				this.changeActive(this.carPointArr, index);
				this.showPiontIndex=index;
				let data = this.carPointArr[index].point;
				if (data.lng == 0 && data.lat == 0) {
					this.$refs.map.showError("_此轨迹点无定位_");
					return
				};
				if (index < this.carPointArr.length) this.$refs.map.showPlayPoint(index);
			},

			/***
			 * * ******************************   运行段    **********************
			 * */

			//获得  运行段数据 || 趟次数据
			getRunData(){
				let url, ation, key;
				url = "/web/Combine/Combine_Report";
				ation = "QueryReportDriveListByFVehicleGUID";
				key = 'FVehicleGUID';


				$.post(url, {
						FTokenID: _this.$store.state.FTokenID,
						FAction: ation,
						[key]: _this.choiceCarData.id,
						FStartTime: _this.choiceCarData.startTime,
						FEndTime: _this.choiceCarData.endTime,
						FPageSize: 99999,
						FPageIndex:1,
						FVersion: "1.0.0"
					},
					function (res) {
						//console.log("运行段或趟次", res);
						if (res.Result == 104) {
							_this.$refs.map.showError("登录超时，5秒后返回登录页面");
							setTimeout(function () {
								_this.$store.commit("goLogin");
							}, 5000)
							return
						}
						if (res.Result == 200) {
							let data = [];
							data = res.FObject.Table1;
							if (data.length == 0) {
								_this.$refs.map.showError("暂无运行段数据");
							} else {
								/*let pointArr = [];
								for (let i = 0;i<_this.carPointArr.length;i++){
									if(_this.carPointArr[i].address !== "_无定位_"  && _this.carPointArr[i].FLocationType !== 2){
										pointArr.push(_this.carPointArr[i]);
									}
								}*/
								let resRunData = data.reverse(),
									pointArr = _this.carPointArr,
								//start = _this.carRunArr.startTimeIndex,
								//end = _this.carRunArr.endTimeIndex,
									runData = _this.carRunArr.runData,
									allRunTime = _this.carRunArr.allRunTime,
									allMileage = _this.carRunArr.allMileage;

								//_this.parseRoute(resRunData, pointArr, start, end, runData, allRunTime, allMileage, unlockType);
								_this.parseRoute(resRunData, pointArr, runData, allRunTime, allMileage);

							}
						}
						//_this.getStopData();
						//_this.getAlarmData();
					})


			},
			//分析运行段数据 (新 在轨迹上显示起始点 并 描红线路)
			parseRoute(resRunData, pointArr, runData, allRunTime, allMileage){
				let allT = null,
					allM = null;

				if (resRunData.length != 0 && pointArr.length != 0) {


					//生成运行段数据
					for (let i = 0; i < resRunData.length; i++) {
						let resRunItem = resRunData[i],
							startT,
							endT,
							aRunData = null;

							startT = _this.parseGMT(resRunItem.FStartDateTime);
							endT = _this.parseGMT(resRunItem.FEndDateTime);


						////console.log(resRunItem.FStartTime);
						////console.log(resRunItem.FEndTime);
						let s = null,
							e = null;
						for (let j = 0; j < pointArr.length; j++) {
							let pointTime = pointArr[j].time;
							if (startT== pointTime) {
								s = j
							}
							if (endT == pointTime) {
								e = j
							}

						};




						//判断运行段开始点是否在轨迹点内
						if (i == 0 && this.GetDateSeconds(pointArr[0].time) > this.GetDateSeconds(startT)) {
							//console.log(1);
							if (this.systemID != 2) {
								//非电子锁系统 为运行段 不在轨迹点范围内的将 轨迹点的起始点定未开始点
								aRunData = {
									startTime: pointArr[0].time,
									endTime: endT,
									startPoint: pointArr[0].point,
									endPoint: _this.parsePoint(_this.mapType,{
										lng: parseFloat(resRunItem.FEndLongitude),
										lat: parseFloat(resRunItem.FEndLatitude)
									}),
									startAddress: "",
									endAddress: "",
									startIndex:0,
									endIndex:e,
									timeValue: this.formatSeconds(this.getSecondValue(startT, endT)),
									mileage: resRunItem.FEndMileage - pointArr[0].mileage,
									active: false,
									//轮胎数据
									tyre: []
								}

							}

						} else if (i == resRunData.length - 1 && this.GetDateSeconds(pointArr[pointArr.length - 1].time) < this.GetDateSeconds(endT)) {
							//console.log(2);
							if (this.systemID != 2) {
								aRunData = {
									startTime: startT,
									endTime: pointArr[pointArr.length - 1].time,
									startPoint: _this.parsePoint({
										lng: parseFloat(resRunItem.FStartLongitude),
										lat: parseFloat(resRunItem.FStartLatitude)
									}),
									endPoint: pointArr[pointArr.length - 1].point,
									startAddress: "",
									endAddress: "",
									startIndex:s,
									endIndex:pointArr.length - 1,
									timeValue: this.formatSeconds(this.getSecondValue(startT, endT)),
									mileage: pointArr[pointArr.length - 1].mileage - resRunItem.FStartMileage,
									active: false,
									//轮胎数据
									tyre: []
								}
							}

						} else {
							//console.log(3);
							aRunData = {
								startTime: startT,
								endTime: endT,
								startPoint: _this.parsePoint(_this.mapType,{
									lng: resRunItem.FStartLongitude,
									lat: resRunItem.FStartLatitude
								}),
								endPoint: _this.parsePoint(_this.mapType,{
									lng: resRunItem.FEndLongitude,
									lat: resRunItem.FEndLatitude
								}),
								startAddress: "",
								endAddress: "",
								startIndex:s,
								endIndex:e,
								unlockType:_this.parseOpenType(resRunItem.FOpenType),
								timeValue: this.formatSeconds(this.getSecondValue(startT, endT)),
								mileage: resRunItem.FEndMileage - resRunItem.FStartMileage,
								active: false,
								//轮胎数据
								tyre: []
							}
						}
						//console.log("趟次数据", aRunData);
						if (aRunData != null) {
							if (resRunData[i].FDescribeJSON != undefined) {
								let tyreItem = JSON.parse(resRunData[i].FDescribeJSON);
								for (let j = 0; j < tyreItem.length; j++) {
									let ftc = tyreItem[j];
									let state = [];
									if (ftc.S.indexOf('HP')) state.push('_高胎压_');
									if (ftc.S.indexOf('LP:')) state.push('_低胎压_');
									if (ftc.S.indexOf('LE')) state.push('_急泄漏_');
									if (ftc.S.indexOf('HT')) state.push('_高温_');
									aRunData.tyre.push({
										tyreN: ftc.N,
										tyreS: state.toString(),
										tyreP: ftc.P,
										tyreT: ftc.T,
									})
								}
								//console.log(aRunData.tyre);

							}
							runData.push(aRunData);
							//console.log(runData)
							if (allRunTime != null && allMileage != null) {
								allT += this.getSecondValue(startT, endT);
								allM += aRunData.mileage;
								allRunTime = this.formatSeconds(allT);
								allMileage = allM;
								_this.$refs.map.setAllTime(allRunTime);
							}

							let n = runData.length - 1;
							setTimeout(function () {
								_this.geocoder(_this.mapType, aRunData.startPoint, runData[n], 'startAddress')

							}, 200)
							setTimeout(function () {
								_this.geocoder(_this.mapType, aRunData.endPoint, runData[n], 'endAddress')
							}, 400)

						}

					}

				}


			},

			//分析运行段数据 (旧 在轨迹上描红)
/*
			parseRoute(resRunData, pointArr, start, end, runData, allRunTime, allMileage, unlockType){
				let allT = null,
					allM = null;

				if (resRunData.length != 0 && pointArr.length != 0) {
					//找到开始和结束点的索引值

					resRunData.map(function (item, index) {
						let s = null,
							e = null;
						for (let i = 0; i < pointArr.length; i++) {
							let pointTime = pointArr[i].time;
							if (_this.parseGMT(item.FStartDateTime) == pointTime) {
								s = i
							}
							if (_this.parseGMT(item.FEndDateTime) == pointTime) {
								e = i
							}

						}
						;
						if (s != null && e != null && s < e) {
							start.push(s);
							end.push(e);

						} else if (s != null && e == null) {
							//假如最后一个运行段跨越查询时间 设置轨迹点最后一个点为运行结束点
							start.push(s);
							end.push(pointArr.length - 1);
						}

					})

					//console.log("开始点", start)
					//console.log("结束点", end)
					//console.log(start.length);
					if (start.length != 0) {

						//生成运行端数据
						for (let i = 0; i < start.length; i++) {
							let carStartPoint = pointArr[start[i]];
							let carEndPoint = pointArr[end[i]];
							let aRunData = {
								startTime: carStartPoint.time,
								endTime: carEndPoint.time,
								startAddress: "",
								endAddress: "",
								unlockType: unlockType,
								timeValue: this.formatSeconds(this.getSecondValue(carStartPoint.time, carEndPoint.time)),
								mileage: carEndPoint.mileage - carStartPoint.mileage,
								active: false,

								//轮胎数据
								tyre: []
							}
							if (resRunData[i].FDescribeJSON != undefined) {
								let tyreItem = JSON.parse(resRunData[i].FDescribeJSON);
								for (let j = 0; j < tyreItem.length; j++) {
									let ftc = tyreItem[j];
									let state = [];
									if (ftc.S.indexOf('HP')) state.push('_高胎压_');
									if (ftc.S.indexOf('LP:')) state.push('_低胎压_');
									if (ftc.S.indexOf('LE')) state.push('_急泄漏_');
									if (ftc.S.indexOf('HT')) state.push('_高温_');
									aRunData.tyre.push({
										tyreN: ftc.N,
										tyreS: state.toString(),
										tyreP: ftc.P,
										tyreT: ftc.T,
									})
								}
								//console.log(aRunData.tyre);

							}
							runData.push(aRunData);
							if (allRunTime != null && allMileage != null) {
								allT += this.getSecondValue(carStartPoint.time, carEndPoint.time);
								allM += aRunData.mileage;
								allRunTime = this.formatSeconds(allT);
								allMileage = allM;
								_this.$refs.map.setAllTimeAndMileage(allRunTime, allMileage);
							}
							setTimeout(function () {
								_this.geocoder(_this.$store.state.mapType, _this.carPointArr[start[i]].point, runData[i], 'startAddress')

							}, 100)
							setTimeout(function () {
								_this.geocoder(_this.$store.state.mapType, _this.carPointArr[end[i]].point, runData[i], 'endAddress')
							}, 800)

						}
					}
				}


			},
*/
			//高亮显示运行段 (旧 在轨迹上描红)
			highlightShowPath(index){
				//设置激活状态
				this.changeActive(this.carRunArr.runData, index);
				this.$refs.map.highlightShowPath(this.carRunArr.startTimeIndex, this.carRunArr.endTimeIndex, index);
			},
			//地图上显示运行段开始和结束标记
			/*mapShowRunPath(index){
			 //设置激活状态
			 this.changeActive(this.carRunArr.runData, index);
			 this.$refs.map.mapShowRunPath(this.carRunArr.runData[index]);
			 },*/

			//运行画开始和结束点
			mapShowRunPath(row, event, column){
				////console.log(row, event, column);
				this.carRunArr.runData.map(function (item, index) {
					item.active = false;
				})
				//设置激活状态
				row.active = true;
				this.$refs.map.mapShowRunPath(row);
			},

			/********       停车点       *******/


			//请求停车点信息
			getStopData(){
				let url,action,GUID;
				url = '/web/Combine/Combine_Report';
				action="QueryReportParkingListByFVehicleGUIDs";
				GUID="FVehicleGUIDs";

				$.post(url, {
						FTokenID: _this.$store.state.FTokenID,
						FAction:action ,
						[GUID]: _this.choiceCarData.id,
						FStartTime: _this.choiceCarData.startTime,
						FEndTime: _this.choiceCarData.endTime,
						FPageSize: 99999,
						FVersion: "1.0.0"
					},
					function (res) {
						console.log("停车点", res.Result, res.Message, res.FObject);
						if (res.Result == 104) {
							_this.$refs.map.showError("登录超时，5秒后返回登录页面");
							setTimeout(function () {
								_this.$store.commit("goLogin");
							}, 5000)
							return
						}
						if (res.Result == 200) {
							if (res.FObject == 0) {
								_this.$refs.map.showError("_暂无停车点数据_");
							}
							else {


								let stopData = _this.carStopPointArr.stopData;
								let carPointArr = _this.carPointArr;
								let stopPointRes = res.FObject.Table1.reverse();

								let n = 0
								stopPointRes.map(function (item, index) {

									if (parseInt(item.FParkingDuration) >= _this.carStopPointArr.choiceTime * 60) {

										let stopObj = {
											startTime: _this.parseGMT(item.FParkingStartDateTime),
											endTime: _this.parseGMT(item.FParkingEndDateTime),
											stopTime: _this.formatSeconds(item.FParkingDuration),
											point: _this.parsePoint(_this.mapType,{
												lng: item.FParkingLongitude,
												lat: item.FParkingLatitude
											}),
											driverName:item.FDriverName,
											shortName:item.FShortName,
											originalStopTime: item.FParkingDuration,
											carState: '_有待提供_',
											containerState: '_有待提供_',
											solarPower: '_有待提供_',
											powerState: '_有待提供_',
											address: "_有待提供_",
											active: false
										}
										stopData.push(stopObj)

										_this.geocoder(_this.mapType, stopData[n].point, stopObj, "address");
										n++;

									}


								})


								//console.log("解析后停车点", stopData);
								_this.showAllStopPoint();

								for (let j = 0; j < stopData.length; j++) {
									let stopItem = stopData[j];

									for (let i = 0; i < carPointArr.length; i++) {
										let PointArr = carPointArr[i];
										if (carPointArr[i].time == stopItem.endTime) {
											stopItem.carState = PointArr.carState;
											stopItem.containerState = PointArr.containerState;
											stopItem.solarPower = PointArr.solarPower;
											stopItem.powerState = PointArr.powerState;
										}
									}

								}
								;


							}
						}


					})

			},
			//显示所有停车点
			showAllStopPoint(){
				this.carStopPointArr.filterData = [];
				for (let i = 0; i < this.carStopPointArr.stopData.length; i++) {
					let parkingDuration = this.carStopPointArr.stopData[i].originalStopTime;
					////console.log(parkingDuration);
					if (parkingDuration >= this.carStopPointArr.choiceTime * 60) {
						this.carStopPointArr.filterData.push(this.carStopPointArr.stopData[i]);
					}
				}
				this.$refs.map.showCarStopPoint(this.carStopPointArr.filterData);

			},
            //显示选中的停车点
			/*showStopPoint(index){
			 let point = this.carStopPointArr.filterData[index].point;
			 this.$refs.map.showActiveStopPoint(point);
			 this.changeActive(this.carStopPointArr.filterData, index);
			 },*/
			showStopPoint(row){
				let point = row.point;
				this.$refs.map.showActiveStopPoint(point);
				this.carStopPointArr.filterData.map(function (item,index) {
					item.active=false;
				})
				row.active=true;
			},

			/********       报警点       *******/
			getAlarmType(type){
				switch (type) {
					case 1:
						return "_超速报警_";
					case 2:
						return "_胎温胎压报警_";
					case 3:
						return "_超时停车报警_";
					case 4:
						return "_疲劳驾驶报警_";
					case 6:
						return "_低电量报警_";
					case 7:
						return "_温度报警_";
					case 9:
						return "_刷非法卡_";
					case 10:
						return "_锁挂绳剪断报警_";
					case 11:
						return "_长时间开锁报警_";
					case 12:
						return "_密码错误报警_";
					case 13:
						return "_震动报警_";
					case 14:
						return "_进电子围栏报警_";	
					case 15:
						return "_出电子围栏报警_";	
					case 16:
						return "_低电量报警_";	
					case 17:
						return "_开后盖报警_";	
					case 19:
						return "_主机拆卸报警_";	
					case 20:
						return "_从机拆卸报警_";	
					case 21:
						return "_未系安全带报警_";	
					case 24:
						return "_进道路报警_";	
					case 25:
						return "_出道路报警_";
					case 26:
						return "_道路偏移报警_";
					case 27:
						return "_连接断开_";
					case 28:
						return "_主电源断开报警_";
					case 29:
						return "_ GPS天线开路_";
					case 30:
						return "_GPS天线短路_";
					case 31:
						return "_GSM信号干扰_";
					case 32:
						return "_劫警_";
					case 33:
						return "_紧急刹车报警_";
					case 34:
						return "_空挡滑行报警_";
					case 35:
						return "_锁异常报警_";
					case 36:
						return "_非许可区域报警_";
					case 37:
						return "_上盖被破坏报警_";	
					case 38:
						return "_控制板通讯异常报警_";																
					default:
						break;
				}
			},
			getAlarmData(){
				let type,dataType;//查询条件类型（车辆或者终端）
				let SpeedLimit = new Promise((resolve) => {
					$.post("/web/Combine/Combine_Message",{
						FTokenID: _this.$store.state.FTokenID,
						FAction:"QueryMessageAlarmByFVehicleGUID",
						FVehicleGUID:_this.choiceCarData.id,
						FStartTime:_this.choiceCarData.startTime,
						FEndTime: _this.choiceCarData.endTime,
						FDataType:1,
						FState:-1,
						FPageIndex:1,
						FPageSize: 99999,
						FVersion: "1.0.0"
					},function(data){
						//console.log("这个是报警配置",data);
						let config = {};
						config.highRoadConfig = data.FObject.Table[0].FOverSpeedHighRoad;
						config.ordinaryRoadConfig = data.FObject.Table[0].FOverSpeedOrdinaryRoad;
						resolve(config);
					})
				});
				SpeedLimit.then(function(config){
					$.post('/web/Combine/Combine_Message', {
								FTokenID: _this.$store.state.FTokenID,
								FAction:'QueryMessageAlarmByFVehicleGUIDs' ,
								FVehicleGUIDs: _this.choiceCarData.id,
								FStartTime: _this.choiceCarData.startTime,
								FEndTime: _this.choiceCarData.endTime,
								FDataType:1,
								FState:-1,
								FPageIndex:1,
								FPageSize: 99999,
								FVersion: "1.0.0"
							},
							function (res) {
								_this.carAlarmPointArr.alarmData=[];
								//console.log("报警点", res.Result, res.Message, res.FObject);
								if (res.Result == 104) {
									_this.$refs.map.showError("登录超时，5秒后返回登录页面");
									setTimeout(function () {
										_this.$store.commit("goLogin");
									}, 5000)
									return
								}
								if (res.Result == 200) {
									if (res.FObject == 0||res.FObject.Table1.length ===0) {
										_this.$refs.map.showError("_暂无报警点数据_");
									}
									else {

										let alarmData = _this.carAlarmPointArr.alarmData;
										let carPointArr = _this.carPointArr;
										let alarmPointRes = res.FObject.Table1.reverse();
										alarmPointRes.map(function (item, index) {
											let alarmObj = {
												startTime: _this.parseGMT(item.FStartDateTime),
												endTime: _this.parseGMT(item.FEndDateTime),
												keepTime: _this.formatSeconds(item.FKeepSeconds),
												s_point: _this.parsePoint(_this.mapType,{
													lng: item.FStartLongitude,
													lat: item.FStartLatitude
												}),
												e_point: _this.parsePoint(_this.mapType,{
													lng: item.FEndLongitude,
													lat: item.FEndLatitude
												}),
												alarmType:_this.getAlarmType(item.FDataType),
												status:item.FCurrentStatus==1?'报警中':'报警已结束',
												describe:"",
												driverName:item.FDriverName,
												carState: '_有待提供_',
												containerState: '_有待提供_',
												solarPower: '_有待提供_',
												powerState: '_有待提供_',
												address: "_有待提供_",
												active: false,
												speedLimit:config,
												averageSpeed:item.FAverageSpeed,
												maxSpeed:item.FMaxSpeed
											}
											_this.$set(alarmObj, "starAdress", null);
											_this.$set(alarmObj, "endAdress", null);
											_this.geocoder(_this.mapType, alarmObj.s_point, alarmObj, "starAdress",function(){
												let str = "_平均速度_:"+item.FAverageSpeed+"km/h,"+"_最大速度_:"+item.FMaxSpeed+"km/h,"+"_限速_:"
												if(alarmObj.starAdress.indexOf("高速") !== -1){
													alarmObj.describe = str +config.highRoadConfig+"km/h";
												}else {
													alarmObj.describe = str +config.ordinaryRoadConfig+"km/h";
												}
											});
											_this.geocoder(_this.mapType, alarmObj.e_point, alarmObj, "endAdress");

											alarmData.push(alarmObj)

										})
										_this.$refs.map.showCarAlarmPoint(alarmData);
									}
								}


							})
				})


			},
			showAarmPoint(row){
				let point = row.s_point;
				this.$refs.map.showActiveStopPoint(point);
				this.carAlarmPointArr.alarmData.map(function (item,index) {
					item.active=false;
				})
				row.active=true;
			},
			//显示所有报警点
			showAllAlarmPoint(){
				this.$refs.map.showCarStopPoint(this.carAlarmPointArr.alarmData);
			},

			//*******************************开关锁***************************************
			// 显示选中的开关锁点
			showLockPoint(row){
				let point = row.s_point;
				this.$refs.map.showActiveLockPoint(point);
				this.carLockPointArr.lockData.map(function (item,index) {
					item.active=false;
				})
				row.active=true;
			},
			getLockData(){
				$.post("/web/Combine/Combine_Report", {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryTripReportByFVehicleGUIDs",
					FVehicleGUIDs: _this.choiceCarData.id,
					FStartTime: _this.choiceCarData.startTime,
					FEndTime: _this.choiceCarData.endTime,
					FPageSize: 9999999,
					FType:"All",
					FVersion: "1.0.0"
				},function(res){
					_this.carLockPointArr.lockData=[];
					console.log("开关锁", res.Result, res.Message, res.FObject);
					if (res.Result == 104) {
						_this.$refs.map.showError("登录超时，5秒后返回登录页面");
						setTimeout(function () {
							_this.$store.commit("goLogin");
						}, 5000)
						return
					}
					if (res.Result == 200) {
						if (res.FObject == 0||res.FObject.Table1.length ===0) {
							_this.$refs.map.showError("_暂无开关锁数据_");
						}
						else {

							let lockData = _this.carLockPointArr.lockData;
							let lockPointRes = res.FObject.Table1.reverse();
							lockPointRes.map(function (item, index) {
								let lockObj = {
									startTime: _this.parseGMT(item.FStartTime),
									endTime: _this.parseGMT(item.FEndTime),
									keepTime: _this.formatSeconds(item.FTotalDuration),
									s_point: _this.parsePoint(_this.mapType,{
										lng: item.FStartLongitude,
										lat: item.FStartLatitude
									}),
									e_point: _this.parsePoint(_this.mapType,{
										lng: item.FEndLongitude,
										lat: item.FEndLatitude
									}),
									openType:_this.parseOpenType(item.FOpenType),
									mileage:item.FTotalMileage,
									active: false
								}
								_this.$set(lockObj, "starAdress", null);
								_this.$set(lockObj, "endAdress", null);
								_this.geocoder(_this.mapType, lockObj.s_point, lockObj, "startAddress");
								_this.geocoder(_this.mapType, lockObj.e_point, lockObj, "endAddress");
								lockData.push(lockObj)

							})
							_this.$refs.map.showCarLockPoint(lockData);
						}
					}
				})
			},


			//*******************************接甩挂***************************************

			// 显示选中的接甩挂点
			showTrailerPoint(row){
				let point = row.point;
				this.$refs.map.showActiveTrailerPoint(point);
				this.carTrailerPointArr.trailerData.map(function (item,index) {
					item.active=false;
				})
				row.active=true;
			},
			getTrailerData(){
				$.post("/web/Combine/Combine_Report", {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QuerySmartTrailerCouplingListByFVehicleGUIDs",
					FVehicleGUIDs: _this.choiceCarData.id,
					FStartTime: _this.choiceCarData.startTime,
					FEndTime: _this.choiceCarData.endTime,
					FPageSize: 9999999,
					FPageIndex:1,
					FVersion: "1.0.0"
				},function(res){
					_this.carTrailerPointArr.trailerData=[];
					// console.log("接甩挂", res.Result, res.Message, res.FObject);
					if (res.Result == 104) {
						_this.$refs.map.showError("登录超时，5秒后返回登录页面");
						setTimeout(function () {
							_this.$store.commit("goLogin");
						}, 5000)
						return
					}
					if (res.Result == 200) {
						if (res.FObject == 0||res.FObject.Table1.length ===0) {
							_this.$refs.map.showError("_暂无接甩挂数据_");
						}
						else {

							let trailerData = _this.carTrailerPointArr.trailerData;
							let lockPointRes = res.FObject.Table1.reverse();
							lockPointRes.map(function (item, index) {
								let trailerObj = {
									startTime: _this.parseGMT(item.FStartDateTime),
									endTime: _this.parseGMT(item.FEndDateTime),
									keepTime: _this.formatSeconds(item.FTotalDuration),
									point: _this.parsePoint(_this.mapType,{
										lng: item.FStartLongitude,
										lat: item.FStartLatitude
									}),
									status:item.FCouplingStatus,	//接挂状态
									mileage:item.FTotalMileage,		//里程
									active: false
								}
								_this.geocoder(_this.mapType, trailerObj.point, trailerObj, "startAddress");
								_this.geocoder(_this.mapType, trailerObj.point, trailerObj, "endAddress");
								trailerData.push(trailerObj)

							})
							_this.$refs.map.showCarTrailerPoint(trailerData);
						}
					}
				})
			},

			//*******************************开关门***************************************
			// 显示选中的接甩挂点
			showTrailerPoint(row){
				let point = row.point;
				this.$refs.map.showActiveDoorPoint(point);
				this.carDoorPointArr.doorData.map(function (item,index) {
					item.active=false;
				})
				row.active=true;
			},
			getDoorData(){
				$.post("/web/Combine/Combine_Report", {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryReportSwitchDoorListByFVehicleGUIDs",
					FVehicleGUIDs: _this.choiceCarData.id,
					FStartTime: _this.choiceCarData.startTime,
					FEndTime: _this.choiceCarData.endTime,
					FPageSize: 9999999,
					FPageIndex:1,
					FVersion: "1.0.0"
				},function(res){
					_this.carDoorPointArr.doorData=[];
					//console.log("开关门", res.Result, res.Message, res.FObject);
					if (res.Result == 104) {
						_this.$refs.map.showError("登录超时，5秒后返回登录页面");
						setTimeout(function () {
							_this.$store.commit("goLogin");
						}, 5000)
						return
					}
					if (res.Result == 200) {
						if (res.FObject == 0||res.FObject.Table1.length ===0) {
							_this.$refs.map.showError("_暂无开关门数据_");
						}
						else {

							let doorData = _this.carDoorPointArr.doorData;
							let doorPointRes = res.FObject.Table1.reverse();
							doorPointRes.map(function (item, index) {
								let doorObj = {
									dataType: item.FDataType,	// 开关门类型   7 开门 8 关门
									openTime: item.FDataType===7?_this.parseGMT(item.FStartDateTime):"--",
									closeTime: item.FDataType===8?_this.parseGMT(item.FStartDateTime):"--",
									keepTime: "_有待提供_",
									point: _this.parsePoint(_this.mapType,{
										lng: item.FStartLongitude,
										lat: item.FStartLatitude
									}),
									amount:"_有待提供_",		// 开关门总数
									mileage:item.FStartMileage,
									active: false
								}
								item.FDataType===7?_this.geocoder(_this.mapType, doorObj.point, doorObj, "openAddress"):_this.geocoder(_this.mapType, doorObj.point, doorObj, "closeAddress");

								doorData.push(doorObj)

							})
							_this.$refs.map.showCarDoorPoint(doorData);
						}
					}
				})
			},


			//*******************************加减油***************************************
			// 显示选中的加减油点
			showOilPoint(row){
				let point = row.point;
				this.$refs.map.showActiveOilPoint(point);
				this.carOilPointArr.oilData.map(function (item,index) {
					item.active=false;
				})
				row.active=true;
			},

			getOilData(){
				$.post("/web/Combine/Combine_Report", {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryFuelRefuelByFVehicleGUID",
					FVehicleGUID: _this.choiceCarData.id,
					FStartTime: _this.choiceCarData.startTime,
					FEndTime: _this.choiceCarData.endTime,
					FOrderBy:"FStartDateTime",
					FPageSize: 9999999,
					FPageIndex:1,
					FVersion: "1.0.0"
				},function(res){
					_this.carOilPointArr.oilData=[];
					console.log("加油哦", res.Result, res.Message, res.FObject);
					if (res.Result == 104) {
						_this.$refs.map.showError("登录超时，5秒后返回登录页面");
						setTimeout(function () {
							_this.$store.commit("goLogin");
						}, 5000)
						return
					}
					if (res.Result == 200) {
						if (res.FObject == 0||res.FObject.Table1.length ===0) {
							//_this.$refs.map.showError("_暂无开关门数据_");
						}
						else {
							_this.getImproperOilData(res.FObject.Table1);
						}
					}
				})
			},

			// 油耗数据
			getImproperOilData(data){
				$.post("/web/Combine/Combine_Report", {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryFuelImproperByFVehicleGUID",
					FVehicleGUID: _this.choiceCarData.id,
					FStartTime: _this.choiceCarData.startTime,
					FEndTime: _this.choiceCarData.endTime,
					FOrderBy:"FStartDateTime",
					FPageSize: 9999999,
					FPageIndex:1,
					FVersion: "1.0.0"
				},function(res){
					console.log("耗油哦", res.Result, res.Message, res.FObject);
					if (res.Result == 200) {
						res.FObject.Table1.concat(data);
						//console.log(res.FObject.Table1);
						if (res.FObject.Table1.length ===0) {
							_this.$refs.map.showError("_暂无加减油数据_");
						}
						else {
							let oilData = _this.carOilPointArr.oilData;
							let alarmPointRes = res.FObject.Table1.reverse();

							alarmPointRes.map(function(item,index){
								let oilmObj = {
									startTime: _this.parseGMT(item.FStartDateTime),
									endTime: _this.parseGMT(item.FEndDateTime),
									point: _this.parsePoint(_this.mapType,{
										lng: item.FLongitude,
										lat: item.FLatitude
									}),
									startLiter:item.FStartLiter,
									stopLiter:item.FStopLiter,
									liter:item.FRefuel?item.FRefuel:item.FImproper,
									riseOrFall:item.FRefuel?"_加油_":"_减油_",
								}
								_this.$set(oilmObj, "second", null);
								_this.$set(oilmObj, "address", null);
								_this.geocoder(_this.mapType, oilmObj.point, oilmObj, "address");
								oilData.push(oilmObj);
								oilmObj.second = _this.getUTCTime(oilmObj.startTime);
							});
							_this.carOilPointArr.oilData.sort(function(a,b){
								return a.second- b.second;
							})
							_this.$refs.map.showCarOilPoint(oilData);
						}
					}
				})
			},
			//*******************************胎温胎压*************************************
			//请求胎压数据
			getTyreData(){
				$.post("/web/Combine/Combine_LBS", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryLBSTrackTPMSListByFVehicleGUID",
						FVehicleGUID: _this.choiceCarData.id,
						FStartTime: _this.choiceCarData.startTime,
						FEndTime: _this.choiceCarData.endTime,
						FVersion: "1.0.0"
					},
					function (res) {
						// console.log("胎压", res.Result, res.Message, res.FObject);
						if (res.Result == 104) {
							_this.$refs.map.showError("登录超时，5秒后返回登录页面");
							setTimeout(function () {
								_this.$store.commit("goLogin");
							}, 5000)
							return
						}
						if (res.Result == 200) {
							if (res.FObject == 0) {
								_this.$refs.map.showError("暂无胎压报警数据");
							} else {
								for (let i = 0;i < res.FObject.length;i++){
									if (res.FObject[i].FTyreContent != undefined||res.FObject[i].FTyreContent != null||res.FObject[i].FTyreContent != "")res.FObject[i].FTyreContent = JSON.parse(res.FObject[i].FTyreContent);
								}
								_this.tyreArr.data = res.FObject;
								let tyreRes = res.FObject,
									pointArr = _this.carPointArr,
									start = _this.tyreArr.startTimeIndex,
									end = _this.tyreArr.endTimeIndex,
									runData = _this.tyreArr.data;

								// _this.parseRoute(tyreRes, pointArr, start, end, runData);
							}
						}
					})


			},
			//高亮显示胎压
			highlightShowTyre(index){
				this.changeActive(this.tyreArr.data, index);
				this.$refs.map.highlightShowtyre(this.tyreArr.startTimeIndex, this.tyreArr.endTimeIndex, index);
			},
			//*******************************异常报表（电子锁）***************************************
			getAbnormal(){
				$.post("/web/Lock/Lock_Message", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryMessageAlarmByFAssetGUIDs",
						FAssetGUIDs: _this.choiceCarData.id,
						FStartTime: _this.choiceCarData.startTime,
						FEndTime: _this.choiceCarData.endTime,
						FDataType: 8,
						FState: -1,
						FPageSize: 9999999,
						FSystemType: 1,
						FVersion: "1.0.0"
					},
					function (res) {
						//console.log("异常", res.Result, res.Message, res.FObject);
						if (res.Result == 104) {
							_this.$refs.map.showError("登录超时，5秒后返回登录页面");
							setTimeout(function () {
								_this.$store.commit("goLogin");
							}, 5000)
							return
						}
						if (res.Result == 200) {
							if (res.FObject == 0) {
								_this.$refs.map.showError("暂无异常");
							} else {
								let lockRes = res.FObject.Table1,
									pointArr = _this.carPointArr,
									start = _this.tyreArr.startTimeIndex,
									end = _this.tyreArr.endTimeIndex,
									runData = _this.tyreArr.data;


								_this.parseRoute(lockRes, pointArr, start, end, runData);
							}
						}
					})
			},

			//接收子组件播放点数 滚动滚动条
			scrollShowData(index){
				if(index<0) index=0;
				this.changeActive(this.carPointArr, index);
				let maxIndex = this.carPointArr.length - 1,
					n = this.showNum;
				
				if (index + n >= maxIndex) {
					this.endIndex = maxIndex;
				} else {
					this.endIndex = index + n;
				};
				let trHight = $("#table-wrap").find("tr").height();
				//console.log(this.startIndex,this.endIndex);
			
				document.getElementById("table-wrap").scrollTop = (index - 1) * trHight;
			},

			/***
			 * * ******************************   智能配送部分    **********************
			 * */
			//根据设备ID和时间查询运单信息
			getTripDetail(){
				_this.ManifesData=[];
				let postData = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryLBSTripDetailByFTripGUID",
					FAssetGUID: _this.choiceCarData.id,
					FStartTime: _this.choiceCarData.startTime,
					FEndTime: _this.choiceCarData.endTime,
					FVersion: "1.0.0"
				};
				$.ajax({
					"url": "/web/SmartDistribution/SmartDistribution_Trip",
					"cache": false,
					"async": true, //同步方法
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (res) {
						//console.log("运单数据", res);

						if (res.Result == 200) {
							let data=res.FObject;


							if(data.length==0){
								_this.$refs.map.showError("_暂无数据_");
								return
							}
							_this.isShowHandleRow=true;
							data.map(function (item,index) {
								let oneManifes = {
									FCargoName: _this.parseTxt(item.FCargoName),  //货物简称
									assetID: item.FAssetID,         //终端ID
									FCargoCode: _this.parseTxt(item.FCargoCode),   //货单号
									name: _this.parseTxt(item.FVehicleName),   //车牌
									startTime:_this.parseGMT(item.FDeliveryTime),
									endTime: item.FFinishTime==null?"_进行中_":_this.parseGMT(item.FFinishTime),
									FDriverName: _this.parseTxt(item.FDriverName),
									//FDriverPhone: item.FDriverPhone,
									duration:_this.formatSeconds(item.FRunTime),
									mileage: item.FTotalMileage,
									NumberOfSites: item.FTripDetailCount,
									FCarrier: _this.parseTxt(item.FCarrier),  //承运商
									FTripGUID: item.FGUID,
									FAssetGUID: _this.choiceCarData.id,
									active:false
								};
								_this.ManifesData.push(oneManifes);
							})
							_this.IsActive.pointType = 7;
							_this.openSubMenu();

						}

					}
				})
			},

			//获得站点和轨迹点数据
			getSiteAndPoint(data){
				_this.SiteData=[];
				_this.greenSite=[];
				_this.carPointArr=[];
				$.post('/web/SmartDistribution/SmartDistribution_LBS', {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryLBSTrackTripDetailByFTripGUID",
						FAssetGUID: data.FAssetGUID,
						FTripGUID: data.FTripGUID,
						FStartTime: _this.parseUTC(data.startTime),
						FEndTime: data.endTime == "_进行中_" ? _this.parseUTC(0) : _this.parseUTC(data.endTime),
						FVersion: "1.0.0"
					},
					function (res) {
						//console.log("站点和轨迹点", res);
						if (res.Result == 104) {
							_this.$refs.map.showError("登录超时，5秒后返回登录页面");
							setTimeout(function () {
								_this.$store.commit("goLogin");
							}, 5000)
							return
						}
						if (res.Result == 200) {
							let site = res.FObject.Table,
								pointData = res.FObject.Table1,
								greenSite = res.FObject.Table2;
							//站点信息部分
							site.sort(function (a, b) {
								return a.FIndex - b.FIndex
							});
							site.map(function (item, index) {

								let oneData = {
									index:item.FIndex, //站点顺序
									name: item.FStoreName, //站点名称
									vehicleName: data.name,          //车牌
									contacts: item.FContacts, //联系人
									phone: item.FTelephone, //联系电话
									address: item.FAddress, //站点地址
									point:_this.parsePoint(_this.mapType,{
										lng:item.FLongitude,
										lat:item.FLatitude
									}),
									openLockAddress: "",    //开锁地址
									openLockpoint: _this.parsePoint(_this.mapType,{
										lng: item.FOpenLongitude,
										lat: item.FOpenLatitude
									}),
									FOpenLockTime: _this.parseGMT(item.FOpenLockTime),      //开锁收货时间
									img: (item.FOpenLockPictures==null||item.FOpenLockPictures=="")?null:item.FOpenLockPictures.split(","), //开锁收货图片
									time: index == 0 ? _this.getTimeDifference(data.startTime, _this.parseGMT(item.FOpenLockTime)) : _this.getTimeDifference(_this.SiteData[index - 1].FOpenLockTime, _this.parseGMT(item.FOpenLockTime)),           //用时
									openType:_this.parseOpenType(item.FOpenType),  //开锁类型
									isIntraField: "有待提供",  //是否区域内开锁
									FIsFinish: item.FIsFinish, //是否已完成
									FCarrier: data.FCarrier,  //承运商
									active:false              //是否被选中
								}
								_this.SiteData.push(oneData);
								if (oneData.openLockpoint.lng === 0 && oneData.openLockpoint.lat === 0) {
									_this.SiteData[index].openLockAddress = "--"
								} else {
									_this.geocoder(_this.mapType, _this.SiteData[index].openLockpoint, _this.SiteData[index], "openLockAddress");
								}

							});
							_this.$refs.map.showSite(_this.SiteData);
							//console.log("站点数据", _this.SiteData);
                             //绿通信息部分
							greenSite.map(function (item, index) {

								let oneData = {
									name: item.FStoreName, //站点名称
									time:_this.parseGMT(item.FOpenLockTime), //开锁时间
									img: (item.FOpenLockPictures==null||item.FOpenLockPictures=="")?null:item.FOpenLockPictures.split(","), //开锁收货图片
									point:_this.parsePoint(_this.mapType,{
										lng: item.FOpenLongitude,
										lat: item.FOpenLatitude 
									}),
									address:"",
									FOpenReson: item.FOpenReson  //开锁原因
								};
								_this.greenSite.push(oneData);
								if (oneData.point.lng === 0 && oneData.point.lat === 0) {
									_this.greenSite[index].address = "--"
								} else {
									_this.geocoder(_this.mapType, _this.greenSite[index].point, _this.greenSite[index], "address");
								}

							})
							_this.$refs.map.showGreenSite(_this.greenSite);
                            //轨迹点信息部分
							let points = [];
							pointData.map(function (item,index) {
								let onePoint = {
									index: index + 1,
									time:  _this.parseGMT(item.FGPSDateTime),
									speed: item.FSpeed,
									mileage: item.FMileage,
									direction: item.FDirection,
									lockRopeState: item.FLockRope,
									lockStatus: item.FLockStatus,
									attitude: 0,        //锁姿态  无姿态数据为null 数据格式 字符串 x轴，y轴，z轴
									powerState: item.FBatteryPercent > 100 ? "_充电中_" : (item.FBatteryPercent == -1 ? "--" : item.FBatteryPercent),
									point: _this.parsePoint(_this.mapType,{
										lng: parseFloat(item.FLongitude),
										lat: parseFloat(item.FLatitude)
									}),
									address: "_获取位置信息中_",
									locationType: item.FLocationType,
									active: false
								};
								//if (pointArr.FAttitude != null && pointArr.FAttitude != '') {
								//	onePoint.attitude = _this.parseLockPose(pointArr.FAttitude);
								//}
								_this.carPointArr.push(onePoint);
								//排除坐标为零的点
								if (item.FLongitude != 0 && item.FLatitude != 0) {
									points.push(onePoint.point);

									//预先转译地址
									if (_this.carPointArr.length > 0 && index < _this.endIndex) {
										let n = index;
										_this.geocoder(_this.mapType, _this.carPointArr[n].point, _this.carPointArr[n], 'address')
									}

								} else {
									_this.carPointArr[index].address = "_无定位_";
								}
							})
							if (_this.carPointArr.length > 0) {
								_this.$refs.map.showCarRoute(_this.carPointArr, points);
								setTimeout(function () {
									_this.$refs.map.showAllMap();
								},500)

							};


						}


					})


			},
			//地图上显示站点
			mapShowSite(row, event, column){
				this.SiteData.map(function (item,index) {
					item.active=false;
				})
				row.active=true;
				let point = row.point;
				if(point.lng===0&&point.lat===0){
					_this.$message({
						message: '_无定位数据_',
						type: 'warning'
					});
					return;
				}
				this.$refs.map.showActiveStopPoint(point);

			},

		},
		watch: {
			screenHeight () {
				this.adjustPage()
			},
			showNum(val){
				this.endIndex=this.startIndex+val;
			}
		},
		computed: {
			//轨迹点获取startIndex个数据
			getStartIndexData:function(){
				////console.log("开始和结束INdex",this.startIndex,this.endIndex)
				return this.carPointArr.slice(this.startIndex, this.endIndex + 1);
			},
			/*systemID: {
				get () {
					return this.$store.state.choiceSystemID
				}
			},*/
			//树形图数据
			treeData: {
				get () {
					return _this.deepCopy(this.$store.state.allCarsData)
				}
			},
			//获取地理类型
			mapType:{
				get () {
					return this.$store.state.mapType
				}
			}
		},
		directives: {
			dragY: {
				inserted: function (el, binding) {
					var oDiv = el;

					if (binding.value.length != 0) {
						let targetDiv = document.getElementById(binding.value[0]);
						let fatherDiv = document.getElementById(binding.value[1]);
						let fn = binding.value[2];

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
							//var disx = ev.clientX - getPoint(targetDiv).left;    //鼠标点击点击时 在DIV上X轴到DIV左侧距离 = 鼠标x坐标 - DIV左侧至屏幕左侧距离
							var disy = ev.clientY - getPoint(targetDiv).top;
							////console.log("disy",disy)
							//var w = fatherDiv.offsetWidth;
							var h = fatherDiv.offsetHeight + oscrolltop;
							////console.log("h",h)
							document.onmousemove = function (ev) {
								ev = ev || window.event;
								//var x = ev.clientX - disx - getPoint(fatherDiv).left;   //DIVx坐标=鼠标x坐标-鼠标点击点击时 在DIV上X轴到DIV左侧距离
								var y = ev.clientY - disy - getPoint(fatherDiv).top;

								if (y < oscrolltop) {          //此处Y最小应等于滚动条高度，适配网页中所有位置
									y = oscrolltop;
								}
								if (y > h - $("#myTab").height()) {
									y = h - $("#myTab").height();
								}
								//targetDiv.style.left = x + 'px';   //确定DIV的  left值 和top值
								//targetDiv.style.top = y + 'px';

								let newHeight = fatherDiv.offsetHeight - y;
								////console.log(fatherDiv.offsetHeight,y)
								if (y <= $("#map-tool").height()) {
									$("#map-tool").hide()
								} else {
									$("#map-tool").show()
								}
								$("#contentList").height(newHeight + 'px');
								let h1 = $('#myTab').height();
								_this.maxHeight = newHeight - h1;
								let h2 = $('#table-header').height();
								$("#table-wrap").slimScroll({
									//width: 'auto', //可滚动区域宽度
									height: newHeight - h1 - h2 + 'px', //可滚动区域高度
									size: '15px', //组件宽度
									color: '#00aff0', //滚动条颜色
									position: 'right', //组件位置：left/right
									distance: '0px', //组件与侧边之间的距离
									start: 'top', //默认滚动位置：top/bottom
									opacity:.8, //滚动条透明度
									alwaysVisible: false, //是否 始终显示组件
									disableFadeOut: true, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
									railVisible: true, //是否 显示轨道
									railColor: '#bee1eb', //轨道颜色
									railOpacity: .8, //轨道透明度
									railDraggable: true, //是否 滚动条可拖动
									railClass: 'slimScrollRail', //轨道div类名
									barClass: 'slimScrollBar', //滚动条div类名
									wrapperClass: 'slimScrollDiv', //外包div类名
									allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
									wheelStep: 20, //滚轮滚动量
									touchScrollStep: 200, //滚动量当用户使用手势
									borderRadius: '7px', //滚动条圆角
									railBorderRadius: '7px' //轨道圆角
								});

								fn();
							}

							document.onmouseup = function () {
								document.onmousemove = null;
								document.onmouseup = null;
							};

						};

					}
				}
			}
		},
		deactivated(){
			this.isLoadTreeDom=true;
		}
	}
</script>
<style>
	.text-nowrap-status {
		padding-left:5px;
	}
	.text-nowrap-address {
		display:block;
		max-width:600px;
		padding:0 5px;
		word-break:keep-all;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
	}


	@media (max-width:1660px) {
		.text-nowrap-status {
			display:block;
			max-width:300px;
			word-break:keep-all;
			white-space:nowrap;
			overflow:hidden;
			text-overflow:ellipsis;
		}
	}

	@media (max-width:1660px) {
		.text-nowrap-address {
			max-width:350px;
		}
	}




	.map-template {
		position:relative;
	}

	#map-template input::-webkit-input-placeholder {
		padding-left:7px;
	}

	/*表格样式*/
	.list-active {
		background-color:#d2d2e6 !important;
	}

	.list-active td {
		background-color:#d2d2e6 !important;
	}

	#contentList {
		height:35px;
		position:relative;
		z-index:800;
		overflow:hidden;
	}

	#contentList .nav > li {
		-webkit-transition:0.3s ease;
		transition:0.3s ease;
	}

	#contentList .nav > li a {
		height:35px;
		line-height:35px;
		padding:0 15px;
		margin:0;
		border:none;
		text-transform:uppercase;
		cursor:pointer;
		color:#fff;
	}

	#contentList .nav > li.active a, #contentList .nav > li a:hover, #contentList .nav > li > a:focus > a {
		background-color:#719ff5;
		color:#fff;
		border-radius:0;
	}

	[ripple] {
		z-index:1;
		position:relative;
		overflow:hidden;
	}

	[ripple] .ripple {
		position:absolute;
		background:#FFFFFF;
		width:12px;
		height:12px;
		border-radius:100%;
		-webkit-animation:ripple 1.6s;
		animation:ripple 1.6s;
	}

	@-webkit-keyframes ripple {
		0% {
			-webkit-transform:scale(1);
			transform:scale(1);
			opacity:0.2;
		}
		100% {
			-webkit-transform:scale(40);
			transform:scale(40);
			opacity:0;
		}
	}

	@keyframes ripple {
		0% {
			-webkit-transform:scale(1);
			transform:scale(1);
			opacity:0.2;
		}
		100% {
			-webkit-transform:scale(40);
			transform:scale(40);
			opacity:0;
		}
	}

	.contentList-header {
		position:relative;
		z-index:50;
		background:#4285F4;
	}

	.contentList-header .border {
		position:absolute;
		z-index:2;
		bottom:0;
		left:0;
		background:#F4B142;
		width:auto;
		height:2px;
		-webkit-transition:0.3s ease;
		transition:0.3s ease;
	}

	.close-Menu {
		position:absolute;
		top:0;
		right:0;
		font-size:20px;
	}

	.active-Menu, .close-Menu:hover {
		background-color:#719ff5;
	}

	.close-Menu a {
		display:block;
		width:35px;
		height:34px;
		line-height:34px;
		left:35px;
		text-align:center;
		color:#fff;
	}

	.full-menu {
		right:35px;
	}
	.open-menu {
		right:70px;
	}

	.full-menu a i {
		display:inline-block;
		width:16px;
		height:16px;
	}



	/*
		#contentList tbody td span{
			padding: 0 2px;
		}
	*/
	.tyre-state {
		display:inline-block;
		padding-right:5px;
	}

	.square-number {
		display:inline-block;
		padding:0 2px;
		height:15px;
		line-height:15px;
		border:0;
		border-radius:3px;
		background-color:#FF9900;
		color:#fff;
	}

	/*侧边栏样式*/

	.show-select-car-list {
		transform:translateX(0);
		transition:all 0.2s linear;
	}

	.hide-select-car-list {
		transform:translateX(100%);
		transition:all 0.2s linear;
	}

	#select-car {
		position:absolute;
		right:0;
		top:40px;
		z-index:800;
		width:310px;
		height:92.5%;
		background-color:#fff;
		border:1px solid #d2d2d2;
	}

	.search-module {
		width:100%;
		height:94.9%;
	}

	.search-module #lockList {
		margin-bottom:-230px;
		padding-bottom:230px;
	}

	.search-module #lockList .el-tree {
		border:none;
	}

	.tree-li {
		padding-left:16px;
		height:30px;
		line-height:30px;
	}

	.tree-li a, .tree-li i {
		display:inline-block;
		width:14px;
		height:14px;
	}

	.tree-li input[type="checkbox"] {
		display:inline-block;
		vertical-align:middle;
		margin-bottom:7px;
	}

	.child-ul {
		padding-left:36px;
	}

	#car-list {
		height:25%;
		margin-top:5px;
	}

	.car-info {
		height:85%;
	}

	.operate-module {
		position:absolute;
		left:-15px;
		top:39%;
		z-index:1500;
		width:15px;
		height:76px;
		cursor:pointer;
		background:url("/static/img/show_carList_btn.png") no-repeat center;
	}

	.list-group-item input, .list-group-item select {
		width:150px;
		height:26px;
		color:#666;
	}

	.position-line {
		position:absolute;
		height:5px;
		width:100%;
		top:0;
		z-index:1500;
		background-color:transparent;
		cursor:row-resize;
	}

	.tire-alarm td {
		line-height:18px !important;
		cursor:pointer;
	}

	.lineChart {
		height:100%;
		width:100%;
	}

	.popover-li {
		width:25%;
		float:left;
		font-size:14px;
	}

	.popover-li .title {
		text-align:center;
		font-size:20px;
		color:#005fc6;
	}

	.popover-li p span {
		display:block;
		float:left;
		width:50%;
		text-align:center;
	}

	.popover-img {
		width:80%;
		height:150px;
		margin-left:10%;
		margin-top:20px;
	}

	.img-tem {
		background:url("/static/img/position-tem.png") no-repeat;
		background-size:contain;
	}

	.img-tire {
		background:url("/static/img/position-tire.png") no-repeat;
		background-size:contain;
	}

	.humiture-row {
		height:30px;
		line-height:30px;
		width:100%;
		cursor:pointer;
	}

	.popover-table th {
		text-align:center;
	}

	.gps-light {
		display:inline-block;
		width:14px;
		height:14px;
		background-position:-83px -203px;
	}
	.net-light {
		display:inline-block;
		width:14px;
		height:14px;
		background-position:-141px -203px;
	}
	.wifi-light {
		display:inline-block;
		width:14px;
		height:14px;
		background-position:-97px -203px;
	}

	.red-light {
		display:inline-block;
		width:14px;
		height:14px;
		background-position:-111px -203px;
	}

	.lock-state {
		display:block;
		width:20px;
		height:20px;
		margin:3px auto;
	}

	.normal-lock {
		background-position:0 -112px;
	}

	.abnormal-lock {
		background-position:-19px -112px;
	}

	.normal-unlock {
		background-position:-39px -112px;
	}

	.abnormal-unlock {
		background-position:-59px -112px;
	}

	#tree-footer .timeChoice .el-input__icon {
		top:-3px;
		left:-8px;
	}
	#tree-footer .timeChoice .el-range__close-icon{
		display:none;
	}
	#tree-footer .el-range-input{
		width: 44%;
		font-size: 12px;
	}
	#tree-footer .timeChoice .el-input__inner {
		height:30px;
		width:280px;
		margin:0;
		border-color:rgb(169, 169, 169);
	}
	.usageImg{
		position:absolute;
		top: -279px;
		left: 6px;
		width:314px;
		height:270px;
		border:1px solid #333;
	}
	.trackDateSelect .el-button--text {
		background-color: #ccc;
		color: #fff;
	}
	.trackDateSelect .el-button--default {
		background-color: #409EFF;
		color: #fff;
	}
	.trackDateSelect .el-button.is-plain:hover {
		background-color: #409EFF;
		color: #fff;
	}
</style>
<style scoped>
	.customFixedTable ul {
		width:100%;
		height:30px;
		text-align:center;
		margin-bottom:0;
	}

	.customFixedTable ul li {
		float:left;
		height:30px;
		line-height:30px;
		font-size:12px;
		background-color:#bfdefb;
		overflow:hidden;
	}

	.customFixedTable ul .humiture {
		background-color:transparent;
	}

	.customFixedTable ul li span {
		display:inline-block;
		line-height:15px;

	}

	.customFixedTable td {
		font-size:12px;
	}

	#contentList .table-wrap {
		height:155px;
		background-color:#fff;
		text-align:center;
	}

	#contentList td {
		height:30px;
		line-height:30px;
		padding:0;
		border:1px solid #ccc;
		overflow:hidden;
		white-space:nowrap;
		word-break:keep-all;
	}

	#tree-footer {
		height:220px;
		margin:0;
	}

	#tree-footer .top-border {
		border-top:1px solid #8c8c8c;
		border-bottom:none;
	}

	#tree-footer li {
		height:35px;
		line-height:35px;
		padding:0 0 0 10px;
	}

	#tree-footer .queryDataTypeList li{
		padding: 0;
		float: left;
		height: 26px;
		margin: 0 3px;
	}

	.queryDataTypeListLi {
		height:30px;
		line-height:30px;
	}

	#tree-footer label {
		width:102px;
		font-size:12px;
	}
	#tree-footer .timeChoice{
		height:55px;
	}
	.alt-txt{
		height:15px;
		line-height:15px;
		font-size:12px;
		color:#f71752;
	}

</style>

