<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
	<div id="map-template" class="map-template" :class="{'full-screen':isFullScreen,'':!isFullScreen}">

		<!--地图内选择全部开锁 或者 全部上锁设备 快捷方式 结束-->
		<!-- 字段设置弹框 -->
		<el-dialog class="settingDialog" title="_字段选择_" :visible.sync="settingDialog" :modal="false" :close-on-click-modal="true" width="520px">
			<el-checkbox-group v-model="checkList" @change="checkChange">
				<el-checkbox v-for="item in checkOptions" :label="item.value" :key="item.value"><i :class="[item.value,'statu-icon']"></i>{{item.label}}</el-checkbox>
			</el-checkbox-group>
		</el-dialog>

		<!--车辆选择弹框-->
		<div v-if="systemID==2" class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
			 aria-hidden="true">
			<div class="modal-dialog map-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="myModalLabel" style="color: white">
							ID:&nbsp;&nbsp;{{FAssetID}}&nbsp;&nbsp;【&nbsp;{{FVehicleName}}&nbsp;】</h4>
					</div>
					<div class="modal-body">
						<el-input
							placeholder="_输入关键字_"
							v-model="filterText1">
						</el-input>
						<el-tree
							class="filter-tree"
							:data="treeData"
							:props="defaultProps"
							:highlight-current="true"
							default-expand-all
							:expand-on-click-node="false"
							:filter-node-method="filterNode1"
							:render-content="renderContent"
							@node-click="handleNodeClick"
							ref="tree1">
						</el-tree>
						<div class="bingCar">
							<p>
								<i class="el-icon-warning"></i>
							</p>
							<p>_没有您输入的车辆_，_请前往车辆管理新增车辆_</p>

						</div>
					</div>
					<div class="modal-footer">
						<button class="btn btn-success float-left" @click="changeRoute({tabsText: '_车辆管理_',router: 'vehicalmanage'})"
								data-dismiss="modal"><i class="el-icon-plus">_新增车辆_</i></button>
						<button type="button" class="btn cancel float-right text-white" data-dismiss="modal">_取消_</button>
						<button type="button" class="btn btn-primary float-right" @click="bingVehicle">_确认_</button>
					</div>
				</div>
			</div>
		</div>
		<!--车辆选择弹框 结束-->

		<!--加载地图模板-->
		<baidu-map ref="map" @fullScreen="changefullScreen" @openLockBox="openLockBox" @changeStatusDataIndex="changeStatusDataIndex" :fa-data="[mapToolShow,isShowAreaSearch]"></baidu-map>
		<!--加载地图模板 结束-->

		<!--开锁窗口-->
		<open-lock ref="openLock" v-if="systemID==2||systemID==4||systemID==7"></open-lock>
		<!--开锁窗口  结束-->

		<!--地图右侧部分-->
		<div id="select-car" v-bind:class="{'show-select-car-list':!isShowSelectCarList,'hide-select-car-list':isShowSelectCarList}">
			<!--列表 和 状态栏 开关-->
			<ul class="status-switch">
				<li class="item" :class="{'active':rightListState}" title="_选择列表_" @click="rightListState=true">
					<i class="fa fa-list"></i>
				</li>
				<li v-if="statusData!=null" class="item item1" :class="{'active':!rightListState}" title="_状态栏_" @click="rightListState=false">
					<i class="fa fa-file-text-o"></i>
				</li>
			</ul>
			<!--列表 和 状态栏 开关 end-->

			<!--开关右侧列表开关-->
			<div class="operate-module" @click="showCarList"></div>
			<!--开关右侧列表开关 end-->

			<!--状态栏-->
      <div v-if="statusData!=null"  v-show="!rightListState" class="status-list">
        <div class="top-info">
          <p>
            <nobr><span style="font-size: 14px">{{statusData.FVehicleName}}[{{statusData.assetID}}]</span></nobr>
          </p>
          <p :title="statusData.address">
            <nobr><span>{{statusData.address}}</span></nobr>
          </p>
        </div>

        <div v-if="EquipmentType === 3" class="container-list-about">  <!-- 集装箱特有 n -->
          <el-row class="FContacts" style="font-weight: bolder; padding: 5px ;margin-top: 10px">
            <el-col :span="10" ><div class="">
              <span class="padding-r-8">_箱东_</span>
            </div></el-col>
            <el-col :span="14" style="border-bottom: 1px solid #cccccc;" ><div class="contacts">
              <span >{{statusData.FContacts}}</span>
            </div></el-col>
          </el-row>
          <el-row class="FTelephone" style="font-weight: bolder; padding: 5px;margin-top: 10px ">
            <el-col :span="10"><div class="">
              <span class="padding-r-8">_联系方式_</span>
            </div></el-col>
            <el-col :span="14" style="border-bottom: 1px solid #cccccc;"><div class="contacts">
              <span >{{statusData.FTelephone}}</span>
            </div></el-col>
          </el-row>
        </div>


        <!--<el-row v-if="systemID===2">-->
        <el-row v-if="EquipmentType === 1" style="margin-top: 10px">  <!-- 电子锁 -->
          <el-col :span="9" >
            <div class="trip trip-left border-right">
              <i class="fa fa-truck fa-lg blue-text"></i>
              _当日趟次_
            </div>
          </el-col>
          <el-col :span="15" style="border-bottom: 1px solid #cccccc">
            <div class="trip trip-right" @click="linkTripReport(statusData.FAssetGUID)">{{statusData.todayTrip}}</div>
          </el-col>
        </el-row>
        <div class="runTime-stopTime" v-if="EquipmentType === 2|| EquipmentType ===4"> <!--接甩挂 车队  共有的部分 -->
          <el-row  style="font-weight: bolder;margin-top: 10px">
            <el-col :span="10"><div class="running-time">_当日运行时长_</div></el-col>
            <el-col :span="14" style="border-bottom: 1px solid #cccccc"><div class="running-time-counts">
              <span style="color:#aa530e; font-size: 23px;font-family: 'ds-digitalnormal';margin-right: 2px">{{ statusData.runTime.H}}</span>H
              <span style="color:#aa530e; font-size: 23px;font-family: 'ds-digitalnormal';margin-right: 2px">{{ statusData.runTime.M}}</span>M
            </div></el-col>
          </el-row>
          <el-row style="font-weight: bolder;margin-top: 10px">
            <el-col :span="10"><div class="stoping-time">_当日停车时长_</div></el-col>
            <el-col :span="14" style="border-bottom: 1px solid #cccccc"><div class="stoping-time-counts">
              <span style="color:#aa530e;font-size: 23px;font-family: 'ds-digitalnormal';margin-right: 2px">{{ statusData.stopTime.H}}</span>H
              <span style="color:#aa530e;font-size: 23px;font-family: 'ds-digitalnormal';margin-right: 2px">{{ statusData.stopTime.M}}</span>M
            </div></el-col>
          </el-row>
          <el-row v-if="EquipmentType === 2" style="margin-top: 10px">
            <el-col :span="10" style="font-weight: bolder;"><div class="">_厢体状态_</div></el-col>
            <el-col :span="14"><div class="" style="border-bottom: 1px solid #cccccc">{{ statusData.containerStatus }}</div></el-col>
          </el-row>
          <el-row v-if="EquipmentType === 2" style="margin-top: 10px">
            <el-col :span="10" style="font-weight: bolder;"><div class="">_接甩挂状态_</div></el-col>
            <el-col :span="14"><div class="" style="border-bottom: 1px solid #cccccc">{{statusData.couplingStatusTitle}}</div></el-col>
          </el-row>
          <!--<el-row v-if="EquipmentType === 2" style="font-weight: bolder;margin-top: 5px">-->
            <!--<el-col :span="10"><div class="">_胎压_</div></el-col>-->
            <!--<el-col :span="14"><div class="" style="border-bottom: 1px solid #cccccc">__</div></el-col>-->
          <!--</el-row>-->
        </div>

        <!--<div class="title" v-if="systemID===7">_任务_</div>-->
        <!--<el-row v-if="systemID===7">-->
        <!--<el-col :span="8">-->
        <!--<div class="text-center border-right">-->
        <!--<p class="font-bolder">_当前进度_</p>-->
        <!--<p class="plan-text blue-text font-22">{{statusData.FinishProgress}}</p>-->
        <!--</div>-->

        <!--</el-col>-->
        <!--<el-col :span="16">-->
        <!--<p class="next-station">-->
        <!--<span>_下一站_:</span>{{statusData.FNextAgentCode}}-->
        <!--</p>-->
        <!--<p class="next-station">-->
        <!--<span>_承运人_:</span>{{statusData.FCarrier}}-->
        <!--</p>-->
        <!--<p class="next-station">-->
        <!--<span>_货物简称_:</span>{{statusData.FCargoName}}-->
        <!--</p>-->

        <!--</el-col>-->
        <!--</el-row>-->
        <el-row class="alarm-about" style="font-weight: bolder" v-if="EquipmentType !== 3">
          <el-col :span="10" >
            <div class="alarm-title" >
              _报警_
            </div>
          </el-col>
          <el-col :span="14" style="border-bottom: 1px solid #cccccc">
            <ul v-if="EquipmentType !== 3" class="status-text clearfix" >
            <!--<li v-for="LockStatus in LockStatusBarAlarm.slice(0,5)" :title="LockStatus.name">-->
              <!--<div style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>-->
            <!--</li>-->
            <li v-for="LockStatus in AlarmCollection" :title="LockStatus.name" v-if="LockStatus.status">
              <div  style="margin-top:5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>
            </li>
            <span v-if="ALLNotAlarm" style="position: relative;top: 4px;">_无_</span>

            <!--&lt;!&ndash;疲劳驾驶&ndash;&gt;-->
            <!--<li v-show="statusData.alarmFatigue" :title="AlarmCollection[3].name" >-->
              <!--<div  style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[AlarmCollection[3].bg]"></div>-->
            <!--</li>-->
          </ul>
          </el-col>
        </el-row>
        <div class="title">_状态_</div>
        <el-row v-if="EquipmentType !== 3" style="border-bottom: 1px solid #cccccc">
          <el-col :span="9" style="border-right: 1px solid #cccccc">
            <div class="status-warp sub-warp">
              <h6 style="margin-left: 20px;">_方向_</h6>
              <div class="inner compass">
                <div class="pointer" :style="{'-o-transform':'rotate('+statusData.direction+'deg)',
								'-ms-transform':'rotate('+statusData.direction+'deg)',
								'-moz-transform':'rotate('+statusData.direction+'deg)',
								'-webkit-transform':'rotate('+statusData.direction+'deg)',
								'transform':'rotate('+statusData.direction+'deg)'}"></div>
              </div>

            </div>
          </el-col>
          <el-col :span="8" style="border-right: 1px solid #cccccc">
            <div class="status-warp sub-warp">
              <h6 style="margin-left: 25px">_信号_</h6>
              <div class="inner">
                <div class="signal">
                  <h6>GPS</h6>
                  <ul>
                    <li v-for="n in 4" :class="{'bg-yellow':n<=statusData.GPSSignal}"></li>
                  </ul>
                </div>
                <div class="signal">
                  <h6>GSM</h6>
                  <ul>
                    <li v-for="n in 4" :class="{'bg-yellow':n<=statusData.GSMSignal}"></li>
                  </ul>
                </div>
              </div>

            </div>
          </el-col>
          <el-col :span="7">
            <div class="status-warp sub-warp">
              <h6 style="margin-left: 15px;">_电量_</h6>
              <!--<div class="inner" v-show="statusData.batteryPercent!='&#45;&#45;'">-->
                <!--<img src="/static/img/status/battery.png">-->
                <!--<span v-show="statusData.batteryPercent!='_充电中_'" class="status-number txt">{{statusData.batteryPercent}}%</span>-->
                <!--<div v-show="statusData.batteryPercent=='_充电中_'" class="charge-icon"></div>-->
                <!--<div class="battery_bg" :class="{'charge':statusData.batteryPercent=='_充电中_',-->
									<!--'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,-->
									<!--'battery-red':statusData.batteryPercent<=10}" :style="{'height':(statusData.batteryPercent/100)*70+'px'}"></div>-->
              <!--</div>-->
              <div class="inner top-signal-3" v-show="statusData.batteryPercent!='--'" style="margin-top: 15px">
                <img src="/static/img/status/battery-small.png">
                <div style="display: inline-block;position: absolute;width: 3px;height: 4px;margin-left: -5px;margin-top: 10px;background-color: black"></div>
                <span v-show="statusData.batteryPercent!='_充电中_'" class="status-number txt" style="font-family: normal;font-size: 15px">{{statusData.batteryPercent}}%</span>
                <!--<div v-show="statusData.batteryPercent=='_充电中_'" class="charge-icon"></div>-->
                <div class="bg" :class="{'top-charge':statusData.batteryPercent=='_充电中_',
									'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,
									'battery-red':statusData.batteryPercent<=10}" :style="{'width':(statusData.batteryPercent/100)*34+'px'}"></div>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row v-if="EquipmentType === 1" style="border-bottom: 1px solid #cccccc">
          <el-col :span="12" >
            <!--<div class="status-warp">-->
              <!--<h6 style="margin-left: 40px">_速度_</h6>-->
              <!--&lt;!&ndash;<div class="speed-wrap" id="speed-wrap"></div>&ndash;&gt;-->
              <!--<div class="long-pointer" :style="{'-o-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'-ms-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'-moz-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'-webkit-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'transform':'rotate('+statusData.speedAngle+'deg)'}"></div>-->
              <!--<span>{{statusData.speed}}</span>-->
              <!--&lt;!&ndash;<p v-if="systemID===2||systemID===7" class="text-center"><span class="status-number">{{statusData.speed}}</span>km/h</p>&ndash;&gt;-->
              <!--&lt;!&ndash;<p v-if="EquipmentType === 1" class="text-center"><span class="status-number">{{statusData.speed}}</span>km/h</p>&ndash;&gt;-->
              <!--&lt;!&ndash;<p v-if="systemID===4" class="text-center"><strong>_里程_:</strong><span class="status-number">{{statusData.mileage}}</span>km</p>&ndash;&gt;-->
            <!--</div>-->
            <div class="dashboard">
                <div class="mid">
                    <div class="wrap">
                      <div style="text-align: center; position: relative;top: -20px;">_速度_</div>
                      <div class="long-pointer" :style="{'-o-transform':'rotate('+statusData.speedAngle+'deg)',
                  '-ms-transform':'rotate('+statusData.speedAngle+'deg)',
                  '-moz-transform':'rotate('+statusData.speedAngle+'deg)',
                  '-webkit-transform':'rotate('+statusData.speedAngle+'deg)',
                  'transform':'rotate('+statusData.speedAngle+'deg)'}"></div>
                      <span>{{statusData.speed}}</span>
                    </div>
                </div>
            </div>

          </el-col>
          <el-col :span="12" style="border-left: 1px solid #cccccc">
            <!--<div v-if="systemID===2||systemID===7" class="status-warp ml-5">-->
            <div v-if="EquipmentType === 1" class="status-warp ml-5">
              <h6 style="margin-left: 35px">_锁状态_</h6>
              <!--<i class="lock-warp" v-show="statusData.FLockStatus===-1">&#45;&#45;</i>-->
              <!--<i class="lock-warp" v-show="statusData.FLockStatus!==-1" :class="{'img-lock':statusData.FLockStatus,'img-unlock':!statusData.FLockStatus}" title="_上锁_"></i>-->
              <i class="lock-warp"  v-show="!statusData.FLockStatus"  :class="{'img-lock':statusData.FLockStatus,'img-unlock':!statusData.FLockStatus}" title="_上锁_"></i>
              <i class="lock-warp" v-show="statusData.FLockStatus"  :class="{'img-lock':statusData.FLockStatus,'img-unlock':!statusData.FLockStatus}" title="_开锁_"></i>
              <el-popover placement="top-start"
                          width="460"
                          offset="350"
                          popper-class="popover-box"
                          trigger="hover"
                          :disabled="statusData.attitude==null">
                <p slot="reference" class="text-center"><span>_锁姿态_:</span><span style="color: red;font-weight:bolder">{{statusData.attitude | parseAttitude}}</span></p>

                <div class="text-center" v-if="statusData.attitude!=0">
                  <img  :src="'/static/img/pose/pose'+statusData.attitude+'.png'">
                </div>
              </el-popover>
            </div>
          </el-col>

        </el-row>
        <!--<el-row>-->
        <!--<el-row v-if="EquipmentType !== 3">-->
        <!--<el-col :span="8">-->
        <!--<div class="status-warp sub-warp">-->
        <!--<h6>_方向_</h6>-->
        <!--<div class="inner compass">-->
        <!--<div class="pointer" :style="{'-o-transform':'rotate('+statusData.direction+'deg)',-->
        <!--'-ms-transform':'rotate('+statusData.direction+'deg)',-->
        <!--'-moz-transform':'rotate('+statusData.direction+'deg)',-->
        <!--'-webkit-transform':'rotate('+statusData.direction+'deg)',-->
        <!--'transform':'rotate('+statusData.direction+'deg)'}"></div>-->
        <!--</div>-->

        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<div class="status-warp sub-warp">-->
        <!--<h6>_信号_</h6>-->
        <!--<div class="inner">-->
        <!--<div class="signal">-->
        <!--<h6>GPS</h6>-->
        <!--<ul>-->
        <!--<li v-for="n in 4" :class="{'bg-yellow':n<=statusData.GPSSignal}"></li>-->
        <!--</ul>-->
        <!--</div>-->
        <!--<div class="signal">-->
        <!--<h6>GSM</h6>-->
        <!--<ul>-->
        <!--<li v-for="n in 4" :class="{'bg-yellow':n<=statusData.GSMSignal}"></li>-->
        <!--</ul>-->
        <!--</div>-->
        <!--</div>-->

        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<div class="status-warp sub-warp">-->
        <!--<h6>_电量_</h6>-->
        <!--<div class="inner" v-show="statusData.batteryPercent!='&#45;&#45;'">-->
        <!--<img src="/static/img/status/battery.png">-->
        <!--<span v-show="statusData.batteryPercent!='_充电中_'" class="status-number txt">{{statusData.batteryPercent}}%</span>-->
        <!--<div v-show="statusData.batteryPercent=='_充电中_'" class="charge-icon"></div>-->
        <!--<div class="battery_bg" :class="{'charge':statusData.batteryPercent=='_充电中_',-->
        <!--'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,-->
        <!--'battery-red':statusData.batteryPercent<=10}" :style="{'height':(statusData.batteryPercent/100)*70+'px'}"></div>-->
        <!--</div>-->

        <!--</div>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<div class="title"  v-if="systemID===4&&statusData.coldChainEquipment.length!=0">-->
        <!--_温度_-->
        <!--</div>-->
        <!--<div class="title">-->
        <!--_报警_-->
        <!--</div>-->
        <!--<ul class="status-text clearfix">-->
        <!--<li v-for="LockStatus in LockStatusBarAlarm.slice(0,5)" :title="LockStatus.name">-->
        <!--<div style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>-->
        <!--</li>-->
        <!--</ul>-->

        <!--<ul class="status-text clearfix" v-if="systemID===1">-->
        <!--<li v-for="LockStatus in carStatusBarAlarm.slice(0,5)" :title="LockStatus.name">-->
        <!--<div style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>-->
        <!--</li>-->
        <!--</ul>-->

        <!--</div>-->
        <!--上个div-->
        <!--<div v-if="EquipmentType === 3"   class="status-list">   &lt;!&ndash; 集装箱 &ndash;&gt;-->
        <el-row v-if="EquipmentType === 3" class="container-tem-status-ele" style="border-bottom: 1px solid #cccccc;height: 106px">
          <!--温度-->
          <el-col :span="8" class="temperature" style="height: 100%;border-right: 1px solid #cccccc"><div >
            <div style="text-align: center">_温度_</div>
            <div style="margin-top: 10px">
              <span style="font-weight: bolder">_箱内_</span>
              <span style="font-family: 'ds-digitalnormal';font-size: 17px" >{{statusData.FTemperature2}}</span>
            </div>
            <div style="margin-top: 10px">
              <span style="font-weight: bolder;" >_箱外_</span>
              <span style="font-family: 'ds-digitalnormal';font-size: 17px" >{{statusData.FTemperature1}}</span>
            </div>
          </div></el-col>
          <!--当前状态-->
          <el-col :span="9" class="current-status" style="height: 100%;border-right: 1px solid #cccccc"><div >
            <div class="" style="text-align: center">
              _当前状态_
            </div>
            <div class="container-status">
              <p style="margin-top: 10px; font-weight: bolder">[{{statusData.FIsLoaded}}]</p>
              <p style="margin-top: 10px; font-weight: bolder" v-show="statusData.FIsOpenDoor!='--'">[_箱门_{{statusData.FIsOpenDoor}}]</p>
            </div>
          </div></el-col>
          <!--电量-->
          <el-col :span="7"><div class="electricity">
            <div class="status-warp sub-warp">
              <div style="text-align: center;margin-top: -4px">_电量_</div>
              <div class="inner top-signal-3" v-show="statusData.batteryPercent!='--'" style="margin-top: 15px">
                <!--<img src="/static/img/status/battery.png">-->
                <img src="/static/img/status/battery-small.png">
                <div style="display: inline-block;position: absolute;width: 3px;height: 4px;margin-left: -5px;margin-top: 10px;background-color: black"></div>
                <span v-show="statusData.batteryPercent!='_充电中_'" class="status-number txt">{{statusData.batteryPercent}}%</span>
                <div v-show="statusData.batteryPercent=='_充电中_'" class="charge-icon"></div>
                <!--<div class="battery_bg" :class="{'charge':statusData.batteryPercent=='_充电中_',-->
									<!--'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,-->
									<!--'battery-red':statusData.batteryPercent<=10}" :style="{'height':(statusData.batteryPercent/100)*70+'px'}"></div>-->
                <div class="bg" :class="{'top-charge':statusData.batteryPercent=='_充电中_',
									'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,
									'battery-red':statusData.batteryPercent<=10}" :style="{'width':(statusData.batteryPercent/100)*34+'px'}"></div>
              </div>
            </div>
          </div></el-col>
        </el-row>
        <el-row v-if="EquipmentType === 3" style="border-bottom: 1px solid #cccccc;padding: 10px">
          <el-col :span="13">
            <img src="/static/img/status/jzx.png">
          </el-col>
          <el-col :span="7">
            <div class="open-counts">
              _开门次数_
            </div>
          </el-col>
          <el-col :span="4">
            <div class="open-counts" style="color: #3ca4ff; font-weight: bolder;font-size: 30px;">{{statusData.doorTimes}}</div>
            <!--<div class="trip trip-right" @click="linkTripReport(statusData.FAssetGUID)">{{statusData.doorTimes}}</div>-->
          </el-col>
          <!--<el-col :span="12">-->
          <!--<div class="container-info">-->
          <!--<p>{{statusData.supName}} <span class="subName">{{statusData.subName}}</span></p>-->
          <!--<p>-->
          <!--<span>{{statusData.FContainerType}}</span>-->
          <!--<span>{{statusData.FContainerSize}}</span>-->
          <!--</p>-->
          <!--</div>-->

          <!--</el-col>-->
        </el-row>
        <!--<el-row v-if="EquipmentType === 3">-->
        <!--<el-col :span="12">-->
        <!--<div class="trip trip-left border-right">-->
        <!--_当前状态_-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<p class="container-status">-->
        <!--<span >[{{statusData.FIsLoaded}}]</span>-->
        <!--<span v-show="statusData.FIsOpenDoor!='&#45;&#45;'">[_箱门_{{statusData.FIsOpenDoor}}]</span>-->
        <!--</p>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row v-if="EquipmentType === 3">-->
        <!--<el-col :span="12">-->
        <!--<div class="trip trip-left border-right">-->
        <!--_开门次数_-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<div class="trip trip-right">{{statusData.doorTimes}}</div>-->
        <!--&lt;!&ndash;<div class="trip trip-right" @click="linkTripReport(statusData.FAssetGUID)">{{statusData.doorTimes}}</div>&ndash;&gt;-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<ul class="container-list">-->
        <!--<li><span class="padding-r-8"><i class="fa fa-user"></i>_箱东_:</span>{{statusData.FContacts}}</li>-->
        <!--<li><span class="padding-r-8"><i class="fa fa-mobile fa-lg"></i>_联系方式_:</span>{{statusData.FTelephone}}</li>-->
        <!--<li><span class="padding-r-8"><i class="fa fa-map-marker"></i>_当前位置_:</span>{{statusData.address}}</li>-->
        <!--&lt;!&ndash;<li class="no-border"><span class="padding-r-8"><i class="fa fa-clock-o"></i>_停留时间_:</span>{{parseFloat(statusData.FStopLongTime) < 0 ?"":statusData.FStopLongTime}}</li>&ndash;&gt;-->
        <!--</ul>-->
        <!--<div class="title">_温度_</div>-->
        <!--<el-row>-->
        <!--<el-col :span="12">-->
        <!--<div class="text-center border-right">-->
        <!--<p class="font-bolder">_箱内温度_</p>-->
        <!--<p class="tem-text">{{statusData.inTemperature}}<span>℃</span></p>-->
        <!--</div>-->

        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<div class="text-center">-->
        <!--<p class="font-bolder">_箱外温度_</p>-->
        <!--<p class="tem-text">{{statusData.outTemperature}}<span>℃</span></p>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<div class="status-warp sub-warp">-->
        <!--<h6>_电量_</h6>-->
        <!--<div class="inner" v-show="statusData.batteryPercent!='&#45;&#45;'">-->
        <!--<img src="/static/img/status/battery.png">-->
        <!--<span v-show="statusData.batteryPercent!='_充电中_'" class="status-number txt">{{statusData.batteryPercent}}%</span>-->
        <!--<div v-show="statusData.batteryPercent=='_充电中_'" class="charge-icon"></div>-->
        <!--<div class="battery_bg" :class="{'charge':statusData.batteryPercent=='_充电中_',-->
        <!--'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,-->
        <!--'battery-red':statusData.batteryPercent<=10}" :style="{'height':(statusData.batteryPercent/100)*70+'px'}"></div>-->
        <!--</div>-->

        <!--</div>-->

        <!--<ul v-if="statusData!=null&&(systemID==1||systemID===4)"  v-show="!rightListState" class="status-list">-->
        <ul v-if="EquipmentType === 2 || EquipmentType === 4"  v-show="!rightListState">
          <!--<li class="top-info">-->
          <!--<p class="car_name">-->
          <!--{{statusData.name}}-->
          <!--</p>-->
          <!--<p class="car_address">-->
          <!--{{statusData.address}}-->
          <!--</p>-->

          <!--</li>-->
          <!--<li class="time-info clearfix">-->
            <!--&lt;!&ndash;<div class="text-center border-right">&ndash;&gt;-->
            <!--&lt;!&ndash;<p class="txt">_当日运行时长_</p>&ndash;&gt;-->
            <!--&lt;!&ndash;<p class="time">&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;<span>{{statusData.runTime.H}}</span>H&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;<span>{{statusData.runTime.M}}</span>M&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;<span>_数据待定_</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</p>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="text-center">&ndash;&gt;-->
            <!--&lt;!&ndash;<p class="txt">_当日停车时长_</p>&ndash;&gt;-->
            <!--&lt;!&ndash;<p class="time">&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;<span>{{statusData.stopTime.H}}</span>H&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;<span>{{statusData.stopTime.M}}</span>M&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;<span>_数据待定_</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</p>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--</li>-->
          <!--车队和接甩挂-->
          <li class="dashboard" v-if="EquipmentType === 4 || EquipmentType === 2">
            <!--<ul class="top clearfix">-->
              <!--&lt;!&ndash;<li>&ndash;&gt;-->
              <!--&lt;!&ndash;<h6>GPS</h6>&ndash;&gt;-->
              <!--&lt;!&ndash;<ul class="top-signal">&ndash;&gt;-->
              <!--&lt;!&ndash;<li v-for="n in 4" :class="{'battery-green':n<=statusData.GPSSignal}"></li>&ndash;&gt;-->
              <!--&lt;!&ndash;</ul>&ndash;&gt;-->
              <!--&lt;!&ndash;</li>&ndash;&gt;-->
              <!--&lt;!&ndash;<li>&ndash;&gt;-->
              <!--&lt;!&ndash;<h6>GSM</h6>&ndash;&gt;-->
              <!--&lt;!&ndash;<ul class="top-signal">&ndash;&gt;-->
              <!--&lt;!&ndash;<li v-for="n in 4" :class="{'battery-green':n<=statusData.GSMSignal}"></li>&ndash;&gt;-->
              <!--&lt;!&ndash;</ul>&ndash;&gt;-->
              <!--&lt;!&ndash;</li>&ndash;&gt;-->
              <!--&lt;!&ndash;<li v-show="statusData.batteryPercent!='&#45;&#45;'">&ndash;&gt;-->
              <!--&lt;!&ndash;<h6 v-show="statusData.batteryPercent!='_充电中_'">{{statusData.batteryPercent}}%</h6>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="top-signal">&ndash;&gt;-->
              <!--&lt;!&ndash;<img src="/static/img/status/battery-small.png">&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="bg" :class="{'top-charge':statusData.batteryPercent=='_充电中_',&ndash;&gt;-->
              <!--&lt;!&ndash;'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,&ndash;&gt;-->
              <!--&lt;!&ndash;'battery-red':statusData.batteryPercent<=10}" :style="{'width':(statusData.batteryPercent/100)*34+'px'}"></div>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--&lt;!&ndash;</li>&ndash;&gt;-->
            <!--</ul>-->

            <!--接甩锁只有里程-->
            <div v-if="EquipmentType === 2"  class="mid clearfix" style="border-bottom: 1px solid #cccccc;">
              <div v-if="EquipmentType === 2"  class="item-1" style="margin-left: 60px"  >
                <div class="wrap">
                  <div style="text-align: center; position: relative;top: -20px;">_速度_</div>
                  <div class="long-pointer" :style="{'-o-transform':'rotate('+statusData.speedAngle+'deg)',
                  '-ms-transform':'rotate('+statusData.speedAngle+'deg)',
                  '-moz-transform':'rotate('+statusData.speedAngle+'deg)',
                  '-webkit-transform':'rotate('+statusData.speedAngle+'deg)',
                  'transform':'rotate('+statusData.speedAngle+'deg)'}"></div>
                  <span>{{statusData.speed}}</span>
                </div>
                <p class="txt" style="color: black">_里程_:
                  <span style="color: #df8931;font-size: 25px">{{statusData.mileage}}</span>km
                </p>
              </div>
            </div>

            <div v-if="EquipmentType === 4" class="mid clearfix" style="border-bottom: 1px solid #cccccc">

              <!--车队有油位和里程-->
              <div v-if="EquipmentType === 4"  class="item">
                <div class="wrap">
                  <div style="text-align: center; position: relative;top: -20px;">_速度_</div>
                  <div class="long-pointer" :style="{'-o-transform':'rotate('+statusData.speedAngle+'deg)',
								'-ms-transform':'rotate('+statusData.speedAngle+'deg)',
								'-moz-transform':'rotate('+statusData.speedAngle+'deg)',
								'-webkit-transform':'rotate('+statusData.speedAngle+'deg)',
								'transform':'rotate('+statusData.speedAngle+'deg)'}"></div>
                  <span>{{statusData.speed}}</span>
                </div>
                <p class="txt" style="color: black">_里程_:
                  <span style="color: #df8931;font-size: 25px">{{statusData.mileage}}</span>km
                </p>
              </div>
              <div class="item" v-if="EquipmentType === 4">
                <div class="wrap oil">
                  <div style="text-align: center; position: relative;top: -20px;">_油位_</div>
                  <div class="long-pointer" :style="{'-o-transform':'rotate('+statusData.fuelAngle+'deg)',
								'-ms-transform':'rotate('+statusData.fuelAngle+'deg)',
								'-moz-transform':'rotate('+statusData.fuelAngle+'deg)',
								'-webkit-transform':'rotate('+statusData.fuelAngle+'deg)',
								'transform':'rotate('+statusData.fuelAngle+'deg)'}"></div>
                </div>
                <p class="txt olitxt" style="color: black">_油位_:
                  <span style="color: #11e1ff;font-size: 25px">{{statusData.fuel}}</span>L
                </p>
              </div>
              <!--<div class="compass">-->
              <!--<div class="pointer" :style="{'-o-transform':'rotate('+statusData.direction+'deg)',-->
              <!--'-ms-transform':'rotate('+statusData.direction+'deg)',-->
              <!--'-moz-transform':'rotate('+statusData.direction+'deg)',-->
              <!--'-webkit-transform':'rotate('+statusData.direction+'deg)',-->
              <!--'transform':'rotate('+statusData.direction+'deg)'}"></div>-->
              <!--</div>-->

            </div>
            <ul class="btm" v-if="EquipmentType === 4">  <!-- 车队特有 -->
              <li :class="{'active':statusData.FEngine}" title="_引擎_"></li>
              <li :class="{'active':statusData.FACC}" title="ACC"></li>
              <li :class="{'active':statusData.FAirCondition}" title="_空调_"></li>
              <li :class="{'active':statusData.FBrake}" title="_刹车_"></li>
              <li :class="{'active':statusData.mainBattey}" title="_主电源_"></li>
            </ul>

          </li>
          <!--<div class="title" v-if="systemID!==6">-->
          <!--_报警_-->
          <!--</div>-->
          <!--<ul class="status-text clearfix">-->
          <!--<li v-for="LockStatus in carStatusBarAlarm.slice(0,5)" :title="LockStatus.name">-->
          <!--<div style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>-->
          <!--</li>-->
          <!--</ul>-->
          <!--<div class="title"  v-if="systemID===4&&statusData.coldChainEquipment.length!=0">-->
          <!--_温度_-->
          <!--</div>-->
          <!--<ul  v-if="systemID===4" class="temperature-text clearfix">-->
          <!--<li v-for="item in statusData.coldChainEquipment">-->
          <!--<span :class="{'text-red':item.temAlarm}" :title="item.time==null?'&#45;&#45;':item.time+'  '+'ID:'+item.ID">-->
          <!--{{item.tem}}-->
          <!--</span>-->
          <!--℃-->
          <!--</li>-->
          <!--</ul>-->
        </ul>

      </div>
      <div class="zhushi">
        <!--<div v-if="statusData!=null"  v-show="!rightListState" class="status-list">-->
          <!--<div class="top-info">-->
            <!--<p>-->
              <!--<nobr><span>{{statusData.name}}[{{statusData.assetID}}]</span></nobr>-->
            <!--</p>-->
            <!--<p :title="statusData.address">-->
              <!--<nobr><span>{{statusData.address}}</span></nobr>-->
            <!--</p>-->
          <!--</div>-->
          <!--<el-row v-if="systemID===2">-->
            <!--<el-col :span="12">-->
              <!--<div class="trip trip-left border-right">-->
                <!--<i class="fa fa-truck fa-lg blue-text"></i>-->
                <!--_当日趟次_-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<div class="trip trip-right" @click="linkTripReport(statusData.FAssetGUID)">{{statusData.todayTrip}}</div>-->
            <!--</el-col>-->
          <!--</el-row>-->
  <!---->
          <!--<div class="title" v-if="systemID===7">_任务_</div>-->
          <!--<el-row v-if="systemID===7">-->
            <!--<el-col :span="8">-->
              <!--<div class="text-center border-right">-->
                <!--<p class="font-bolder">_当前进度_</p>-->
                <!--<p class="plan-text blue-text font-22">{{statusData.FinishProgress}}</p>-->
              <!--</div>-->
  <!---->
            <!--</el-col>-->
            <!--<el-col :span="16">-->
              <!--<p class="next-station">-->
                <!--<span>_下一站_:</span>{{statusData.FNextAgentCode}}-->
              <!--</p>-->
              <!--<p class="next-station">-->
                <!--<span>_承运人_:</span>{{statusData.FCarrier}}-->
              <!--</p>-->
              <!--<p class="next-station">-->
                <!--<span>_货物简称_:</span>{{statusData.FCargoName}}-->
              <!--</p>-->
  <!---->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<div class="title">_状态_</div>-->
  <!---->
          <!--<el-row>-->
            <!--<el-col :span="12">-->
              <!--<div class="status-warp">-->
                <!--<h6>_速度_</h6>-->
                <!--<div class="speed-wrap" id="speed-wrap"></div>-->
                <!--<p v-if="systemID===2||systemID===7" class="text-center"><span class="status-number">{{statusData.speed}}</span>km/h</p>-->
                <!--<p v-if="systemID===4" class="text-center"><strong>_里程_:</strong><span class="status-number">{{statusData.mileage}}</span>km</p>-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<div v-if="systemID===2||systemID===7" class="status-warp ml-5">-->
                <!--<h6>_锁状态_</h6>-->
                <!--<i class="lock-warp" v-show="statusData.FLockStatus===-1">&#45;&#45;</i>-->
                <!--<i class="lock-warp" v-show="statusData.FLockStatus!==-1" :class="{'img-lock':statusData.FLockStatus,'img-unlock':!statusData.FLockStatus}" title="_上锁_"></i>-->
                <!--<el-popover placement="top-start"-->
                      <!--width="460"-->
                      <!--offset="350"-->
                      <!--popper-class="popover-box"-->
                      <!--trigger="hover"-->
                      <!--:disabled="statusData.attitude==null">-->
                  <!--<p slot="reference" class="text-center"><strong>_锁姿态_:</strong>{{statusData.attitude | parseAttitude}}</p>-->
  <!---->
                  <!--<div class="text-center" v-if="statusData.attitude!=0">-->
                    <!--<img  :src="'/static/img/pose/pose'+statusData.attitude+'.png'">-->
                  <!--</div>-->
                <!--</el-popover>-->
              <!--</div>-->
            <!--</el-col>-->
  <!---->
          <!--</el-row>-->
          <!--<el-row>-->
            <!--<el-col :span="8">-->
              <!--<div class="status-warp sub-warp">-->
                <!--<h6>_方向_</h6>-->
                <!--<div class="inner compass">-->
                  <!--<div class="pointer" :style="{'-o-transform':'rotate('+statusData.direction+'deg)',-->
                  <!--'-ms-transform':'rotate('+statusData.direction+'deg)',-->
                  <!--'-moz-transform':'rotate('+statusData.direction+'deg)',-->
                  <!--'-webkit-transform':'rotate('+statusData.direction+'deg)',-->
                  <!--'transform':'rotate('+statusData.direction+'deg)'}"></div>-->
                <!--</div>-->
  <!---->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="8">-->
              <!--<div class="status-warp sub-warp">-->
                <!--<h6>_信号_</h6>-->
                <!--<div class="inner">-->
                  <!--<div class="signal">-->
                    <!--<h6>GPS</h6>-->
                    <!--<ul>-->
                      <!--<li v-for="n in 4" :class="{'bg-yellow':n<=statusData.GPSSignal}"></li>-->
                    <!--</ul>-->
                  <!--</div>-->
                  <!--<div class="signal">-->
                    <!--<h6>GSM</h6>-->
                    <!--<ul>-->
                      <!--<li v-for="n in 4" :class="{'bg-yellow':n<=statusData.GSMSignal}"></li>-->
                    <!--</ul>-->
                  <!--</div>-->
                <!--</div>-->
  <!---->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="8">-->
              <!--<div class="status-warp sub-warp">-->
                <!--<h6>_电量_</h6>-->
                <!--<div class="inner" v-show="statusData.batteryPercent!='&#45;&#45;'">-->
                  <!--<img src="/static/img/status/battery.png">-->
                  <!--<span v-show="statusData.batteryPercent!='_充电中_'" class="status-number txt">{{statusData.batteryPercent}}%</span>-->
                  <!--<div v-show="statusData.batteryPercent=='_充电中_'" class="charge-icon"></div>-->
                  <!--<div class="battery_bg" :class="{'charge':statusData.batteryPercent=='_充电中_',-->
                    <!--'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,-->
                    <!--'battery-red':statusData.batteryPercent<=10}" :style="{'height':(statusData.batteryPercent/100)*70+'px'}"></div>-->
                <!--</div>-->
  <!---->
              <!--</div>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<div class="title"  v-if="systemID===4&&statusData.coldChainEquipment.length!=0">-->
            <!--_温度_-->
          <!--</div>-->
          <!--<div class="title">-->
            <!--_报警_-->
          <!--</div>-->
          <!--<ul class="status-text clearfix">-->
            <!--<li v-for="LockStatus in LockStatusBarAlarm.slice(0,5)" :title="LockStatus.name">-->
              <!--<div style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>-->
            <!--</li>-->
          <!--</ul>-->
  <!---->
          <!--<ul class="status-text clearfix" v-if="systemID===1">-->
            <!--<li v-for="LockStatus in carStatusBarAlarm.slice(0,5)" :title="LockStatus.name">-->
              <!--<div style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>-->
            <!--</li>-->
          <!--</ul>-->
  <!---->
        <!--</div>-->
        <!--<div v-if="statusData!=null&&systemID===6"  v-show="!rightListState" class="status-list">-->
          <!--<el-row>-->
            <!--<el-col :span="12">-->
              <!--<img src="/static/img/status/jzx.png">-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<div class="container-info">-->
                <!--<p>{{statusData.supName}} <span class="subName">{{statusData.subName}}</span></p>-->
                <!--<p>-->
                  <!--<span>{{statusData.FContainerType}}</span>-->
                  <!--<span>{{statusData.FContainerSize}}</span>-->
                <!--</p>-->
              <!--</div>-->
  <!---->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-row>-->
            <!--<el-col :span="12">-->
              <!--<div class="trip trip-left border-right">-->
                <!--_当前状态_-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<p class="container-status">-->
                <!--<span >[{{statusData.FIsLoaded}}]</span>-->
                <!--<span v-show="statusData.FIsOpenDoor!='&#45;&#45;'">[_箱门_{{statusData.FIsOpenDoor}}]</span>-->
              <!--</p>-->
  <!---->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-row>-->
            <!--<el-col :span="12">-->
              <!--<div class="trip trip-left border-right">-->
                <!--_开门次数_-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<div class="trip trip-right">{{statusData.doorTimes}}</div>-->
              <!--&lt;!&ndash;<div class="trip trip-right" @click="linkTripReport(statusData.FAssetGUID)">{{statusData.doorTimes}}</div>&ndash;&gt;-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<ul class="container-list">-->
            <!--<li><span class="padding-r-8"><i class="fa fa-user"></i>_箱东_:</span>{{statusData.FContacts}}</li>-->
            <!--<li><span class="padding-r-8"><i class="fa fa-mobile fa-lg"></i>_联系方式_:</span>{{statusData.FTelephone}}</li>-->
            <!--<li><span class="padding-r-8"><i class="fa fa-map-marker"></i>_当前位置_:</span>{{statusData.address}}</li>-->
            <!--&lt;!&ndash;<li class="no-border"><span class="padding-r-8"><i class="fa fa-clock-o"></i>_停留时间_:</span>{{parseFloat(statusData.FStopLongTime) < 0 ?"":statusData.FStopLongTime}}</li>&ndash;&gt;-->
          <!--</ul>-->
          <!--<div class="title">_温度_</div>-->
          <!--<el-row>-->
            <!--<el-col :span="12">-->
              <!--<div class="text-center border-right">-->
                <!--<p class="font-bolder">_箱内温度_</p>-->
                <!--<p class="tem-text">{{statusData.inTemperature}}<span>℃</span></p>-->
              <!--</div>-->
  <!---->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<div class="text-center">-->
                <!--<p class="font-bolder">_箱外温度_</p>-->
                <!--<p class="tem-text">{{statusData.outTemperature}}<span>℃</span></p>-->
              <!--</div>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<div class="status-warp sub-warp">-->
            <!--<h6>_电量_</h6>-->
            <!--<div class="inner" v-show="statusData.batteryPercent!='&#45;&#45;'">-->
              <!--<img src="/static/img/status/battery.png">-->
              <!--<span v-show="statusData.batteryPercent!='_充电中_'" class="status-number txt">{{statusData.batteryPercent}}%</span>-->
              <!--<div v-show="statusData.batteryPercent=='_充电中_'" class="charge-icon"></div>-->
              <!--<div class="battery_bg" :class="{'charge':statusData.batteryPercent=='_充电中_',-->
                    <!--'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,-->
                    <!--'battery-red':statusData.batteryPercent<=10}" :style="{'height':(statusData.batteryPercent/100)*70+'px'}"></div>-->
            <!--</div>-->
  <!---->
          <!--</div>-->
        <!--</div>-->
        <!--<ul v-if="statusData!=null&&(systemID==1||systemID===4)"  v-show="!rightListState" class="status-list">-->
				<!--<li class="top-info">-->
					<!--<p class="car_name">-->
						<!--{{statusData.name}}-->
					<!--</p>-->
					<!--<p class="car_address">-->
						<!--{{statusData.address}}-->
					<!--</p>-->

				<!--</li>-->
				<!--<li class="time-info clearfix">-->
					<!--<div class="text-center border-right">-->
						<!--<p class="txt">_当日运行时长_</p>-->
						<!--<p class="time">-->
							<!--<span>{{statusData.runTime.H}}</span>H-->
							<!--<span>{{statusData.runTime.M}}</span>M-->
						<!--</p>-->
					<!--</div>-->
					<!--<div class="text-center">-->
						<!--<p class="txt">_当日停车时长_</p>-->
						<!--<p class="time">-->
							<!--<span>{{statusData.stopTime.H}}</span>H-->
							<!--<span>{{statusData.stopTime.M}}</span>M-->
						<!--</p>-->
					<!--</div>-->
				<!--</li>-->
				<!--<li class="dashboard">-->
					<!--<ul class="top clearfix">-->
						<!--<li>-->
							<!--<h6>GPS</h6>-->
							<!--<ul class="top-signal">-->
								<!--<li v-for="n in 4" :class="{'battery-green':n<=statusData.GPSSignal}"></li>-->
							<!--</ul>-->
						<!--</li>-->
						<!--<li>-->
							<!--<h6>GSM</h6>-->
							<!--<ul class="top-signal">-->
								<!--<li v-for="n in 4" :class="{'battery-green':n<=statusData.GSMSignal}"></li>-->
							<!--</ul>-->
						<!--</li>-->
						<!--<li v-show="statusData.batteryPercent!='&#45;&#45;'">-->
							<!--<h6 v-show="statusData.batteryPercent!='_充电中_'">{{statusData.batteryPercent}}%</h6>-->
							<!--<div class="top-signal">-->
								<!--<img src="/static/img/status/battery-small.png">-->
								<!--<div class="bg" :class="{'top-charge':statusData.batteryPercent=='_充电中_',-->
									<!--'battery-yellow':statusData.batteryPercent<=25&&statusData.batteryPercent>10,-->
									<!--'battery-red':statusData.batteryPercent<=10}" :style="{'width':(statusData.batteryPercent/100)*34+'px'}"></div>-->
							<!--</div>-->
						<!--</li>-->
					<!--</ul>-->
					<!--<div class="mid clearfix">-->
						<!--<div class="item">-->
							<!--<div class="wrap">-->
								<!--<div class="long-pointer" :style="{'-o-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'-ms-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'-moz-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'-webkit-transform':'rotate('+statusData.speedAngle+'deg)',-->
								<!--'transform':'rotate('+statusData.speedAngle+'deg)'}"></div>-->
								<!--<span>{{statusData.speed}}</span>-->
							<!--</div>-->
							<!--<p class="txt">_里程_:-->
								<!--<span>{{statusData.mileage}}</span>km-->
							<!--</p>-->
						<!--</div>-->
						<!--<div class="item">-->
							<!--<div class="wrap oil">-->
								<!--<div class="long-pointer" :style="{'-o-transform':'rotate('+statusData.fuelAngle+'deg)',-->
								<!--'-ms-transform':'rotate('+statusData.fuelAngle+'deg)',-->
								<!--'-moz-transform':'rotate('+statusData.fuelAngle+'deg)',-->
								<!--'-webkit-transform':'rotate('+statusData.fuelAngle+'deg)',-->
								<!--'transform':'rotate('+statusData.fuelAngle+'deg)'}"></div>-->
							<!--</div>-->
							<!--<p class="txt olitxt">_油位_:-->
								<!--<span>{{statusData.fuel}}</span>L-->
							<!--</p>-->
						<!--</div>-->
						<!--<div class="compass">-->
							<!--<div class="pointer" :style="{'-o-transform':'rotate('+statusData.direction+'deg)',-->
								<!--'-ms-transform':'rotate('+statusData.direction+'deg)',-->
								<!--'-moz-transform':'rotate('+statusData.direction+'deg)',-->
								<!--'-webkit-transform':'rotate('+statusData.direction+'deg)',-->
								<!--'transform':'rotate('+statusData.direction+'deg)'}"></div>-->
						<!--</div>-->

					<!--</div>-->
					<!--<ul class="btm">-->
						<!--<li :class="{'active':statusData.FEngine}" title="_引擎_"></li>-->
						<!--<li :class="{'active':statusData.FACC}" title="ACC"></li>-->
						<!--<li :class="{'active':statusData.FAirCondition}" title="_空调_"></li>-->
						<!--<li :class="{'active':statusData.FBrake}" title="_刹车_"></li>-->
						<!--<li :class="{'active':statusData.mainBattey}" title="_主电源_"></li>-->

					<!--</ul>-->

				<!--</li>-->
				<!--<div class="title" v-if="systemID!==6">-->
					<!--_报警_-->
				<!--</div>-->
				<!--<ul class="status-text clearfix">-->
					<!--<li v-for="LockStatus in carStatusBarAlarm.slice(0,5)" :title="LockStatus.name">-->
						<!--<div style="margin-top: 2.5px" class="allAlarmTypeIcon" :class="[LockStatus.status?LockStatus.bg:LockStatus.bg+'Gray']"></div>-->
					<!--</li>-->
				<!--</ul>-->
				<!--<div class="title"  v-if="systemID===4&&statusData.coldChainEquipment.length!=0">-->
					<!--_温度_-->
				<!--</div>-->
				<!--<ul  v-if="systemID===4" class="temperature-text clearfix">-->
					<!--<li v-for="item in statusData.coldChainEquipment">-->
						<!--<span :class="{'text-red':item.temAlarm}" :title="item.time==null?'&#45;&#45;':item.time+'  '+'ID:'+item.ID">-->
							<!--{{item.tem}}-->
						<!--</span>-->
						<!--℃-->
					<!--</li>-->
				<!--</ul>-->
			<!--</ul>-->
      </div>
			<!--状态栏 end-->

			<!--车辆列表-->
			<car-tree v-show="rightListState" ref='tree' :treeData="treeData" :options="options" @refresh="refreshRightList"
					  @handleLockStatus="handleLockStatus" @handleWaybillStatus="handleWaybillStatus"   @choiceCarId="handlecheckedChange" @node-click="handlecheckedChange"></car-tree>
		</div>
		<!--地图右侧部分 结束-->

		<!--下部列表区域-->
		<div id="contentList" class="row no-margin-right">
			<div v-dragY="['contentList','map-template',adjustPage]" class="position-line"></div>
			<div class="col-sm-12 no-padding-right">
				<div class="contentList-header" @dblclick="openSubMenu">
					<div class="border"></div>
					<ul class="nav nav-tabs " id="myTab">
						<li class="active">
							<a @click="showCarDataList(0)" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								<span class="square bg-white"></span>
								<span class="number"><i>{{allCarData.length}}</i></span>
								<span class="infoContent">_全部_</span>
							</a>
						</li>
						<li>
							<a @click="showCarDataList(1)" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								<span class="square bg-green"></span>
								<span class="number"><i>{{runCarData.length}}</i></span>
								<span v-if="systemID!=6" class="infoContent">_运行_</span>
								<span v-if="systemID==6" class="infoContent">_空载_</span>
							</a>
						</li>
						<li>
							<a @click="showCarDataList(16)" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								<span class="square bg-yellow"></span>
								<span class="number"><i>{{idlingData.length}}</i></span>
								<span class="infoContent">_怠速_</span>
							</a>
						</li>

						<li>
							<a @click="showCarDataList(2)" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								<span class="square bg-orange"></span>
								<span class="number"><i>{{stopCarData.length}}</i></span>
								<span v-if="systemID!=6" class="infoContent">_停止_</span>
								<span v-if="systemID==6" class="infoContent">_重载_</span>
							</a>
						</li>
						<li>
							<a @click="showCarDataList(4)" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								<span class="square bg-red"></span>
								<span class="number"><i>{{alarmCarData.length}}</i></span>
								<span class="infoContent">_报警_</span>
							</a>
							<div v-show="isShowAlarmType&&alarmCarData.length!=0" class="alarmType">

								<!-----------------  通用报警类型  （6超速 10低电量） -------------------->
								<p v-show="alarmOverSpeed.length!=0" @click="showCarDataList(6)">
									<span class="img-icon monitor-icon icon-alarmOverSpeed"></span>
									_超速报警_（{{alarmOverSpeed.length}}）
								</p>
								<p v-show="FAlarmLowPower.length!=0" @click="showCarDataList(10)">
									<span class="img-icon monitor-icon icon-alarmLowBattery"></span>
									_低电量报警_（{{FAlarmLowPower.length}}）
								</p>

								<!-----------------  接甩挂和车队系统共有报警类型   （5疲劳驾驶）-------------------->
								<p v-show="alarmFatigue.length!=0" @click="showCarDataList(5)">
									<span class="img-icon monitor-icon icon-alarmFatigue"></span>
									_疲劳驾驶_（{{alarmFatigue.length}}）
								</p>
								<!-----------------  冷链报警类型   -------------------->
								<p @click="showCarDataList(8)" v-show="alarmTemperature.length!=0">
									<span class="img-icon monitor-icon icon-alarmTemperature"></span>
									_温度报警_（{{alarmTemperature.length}}）
								</p>

								<!-----------------  电子锁报警类型   （9绳索异常，11后盖异常，12长时间未锁，13连续五次错误密码，14刷非法卡，15禁区开锁）-------------------->

								<p @click="showCarDataList(9)" v-show="alarmFLockRope.length!=0">
									<span class="img-icon monitor-icon icon-alarmFLockRope"></span>
									_绳索异常_（{{alarmFLockRope.length}}）
								</p>

								<p @click="showCarDataList(11)" v-show="unCoverBack.length!=0">
									<span class="img-icon monitor-icon icon-unCoverBack"></span>
									_后盖报警_（{{unCoverBack.length}}）
								</p>
								<p @click="showCarDataList(12)" v-show="longTimeOpened.length!=0">
									<span class="img-icon monitor-icon icon-longTimeOpened"></span>
									_长时间未锁_（{{longTimeOpened.length}}）
								</p>
								<p @click="showCarDataList(13)" v-show="fivePasswordError.length!=0">
									<span class="img-icon monitor-icon icon-fivePasswordError"></span>
									_连续五次错误密码_（{{fivePasswordError.length}}）
								</p>
								<p @click="showCarDataList(14)" v-show="illegalCard.length!=0">
									<span class="img-icon monitor-icon icon-illegalCard"></span>
									_刷非法卡_（{{illegalCard.length}}）
								</p>
								<p @click="showCarDataList(15)" v-show="forbiddenAreaOpen.length!=0">
									<span class="img-icon monitor-icon icon-forbiddenAreaOpen"></span>
									_禁区开锁_（{{forbiddenAreaOpen.length}}）
								</p>




								<!--道路偏移
								<p @click="showCarDataList(7)"><span class="img-icon monitor-icon icon-alarmOffsetRoad"></span>_道路偏移_（{{alarmOffsetRoad.length}}）</p>
								-->
								<!--
								<p v-if="systemID==2" @click="showCarDataList(9)">
									<span class="img-icon monitor-icon icon-alarmOverTime"></span>
									_超时报警_（{{alarmFLockRope.length}}）
								</p>
								-->
							</div>
						</li>

						<li>
							<a @click="showCarDataList(3)" data-toggle="tab" ripple="ripple" ripple-color="#FFF">
								<span class="square bg-grey"></span>
								<span class="number"><i>{{outlineCarData.length}}</i></span>
								<span v-if="systemID!=6" class="infoContent">_离线_</span>
								<span v-if="systemID==6" class="infoContent">_未启用_</span>
							</a>
						</li>
						<li title="全部：所有设备的总数，注意，不是车辆的总和，首页中的所有状态的统计均是以设备为标准。在线：最近30分钟有上传数据的设备即为在线。离线：超过30分钟无数据上传，即为离线，704/704B/704C/706/707除外。行驶：当前设备在线，并且速度大于等于10，即为行驶。停止：当前设备在线，并且速度低于10，即为停止。报警：当前设备在线，并且产生报警。"><i class="monitor-table-icon monitor-warning-icon"></i></li>
						<li>
							<i @click="showCarNameSearch" class="fa fa-search search-car-name-icon"></i>
							<input v-show="isShowSearchCarName" type="text" id="searchCarName"
								   class="search-car-name-input input-custom border-radius-2 width-150"
								   v-model="searchCarName" placeholder="_请输入关键字_">

						</li>
					</ul>
					<div class="close-Menu set-prop" @click="settingDialog=true"><i class="monitor-table-icon monitor-setting"></i></div>
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
					<!--所有车辆-->
					<template>
						<el-table
							ref="elTable"
							:data="filterCarName"
							border
							stripe
							highlight-current-row
							style="width: 100%"
							@sort-change="sortChange"
							:height="maxHeight">
							<el-table-column
								type="index"
								fixed
								label="_序号_"
								width="80">
							</el-table-column>
							<!--车牌-->
							<el-table-column
								prop="FVehicleName"
								:render-header="setHead"
								label='{"value":"FVehicleName","title":"_车牌号_/_箱号_","label":"_车牌号_/_箱号_"}'
								sortable="custom"
								fixed
								show-overflow-tooltip
								width="150">
									<template scope="scope">
										<div @click="showCarPlace(filterCarName,scope.$index)"
											class="list-name"
											:class="{'name-active':scope.row.active,
														'text-blue':scope.row.type==0,
														'text-red':scope.row.type==4,
														'text-grey':scope.row.type==3,
														'text-green':scope.row.type==1,
														'text-orange':scope.row.type==2,
														'text-yellow':scope.row.type==16}">
											{{scope.row.FVehicleName}}
										</div>
									</template>
							</el-table-column>
							<el-table-column
								prop="assetID"
								:render-header="setHead"
								label='{"value":"FAssetID","title":"_设备_ID","label":"_设备_ID"}'
								show-overflow-tooltip
								fixed
								width="150">
<!-- 								<template scope="scope">
									<div @click="showCarPlace(filterCarName,scope.$index)"
										 class="list-name"
										 :class="{'name-active':scope.row.active,
													'text-blue':scope.row.type==0,
													'text-red':scope.row.type==4,
													'text-grey':scope.row.type==3,
													'text-green':scope.row.type==1,
													'text-orange':scope.row.type==2,
													'text-yellow':scope.row.type==16}">
										{{scope.row.name}}
									</div>
								</template> -->
							</el-table-column>
							<el-table-column
								prop="FAssetType"
								:render-header="setHead"
								label='{"value":"FAssetTypeID","title":"_设备类型_","label":"_设备类型_"}'
								show-overflow-tooltip
								width="200">
							</el-table-column>
							<el-table-column
								prop="time"
								show-overflow-tooltip
								sortable="custom"
								:render-header="setHead"
								label='{"value":"FGPSDateTime","title":"_定位时间_","label":""}'
								width="200">
							</el-table-column>

							<el-table-column
								prop="recvTime"
								show-overflow-tooltip
								sortable="custom"
								:render-header="setHead"
								label='{"value":"FRecvDateTime","title":"_数据接收时间_","label":""}'
								width="200">
							</el-table-column>
							<el-table-column
								:render-header="setHead"
								label='{"value":"FAddress","title":"_当前位置_","label":""}'
								align="left"
								min-width="300">
								<template scope="scope">
									<span v-show="scope.row.address!='_获取位置_'"
										  :title="scope.row.address">{{scope.row.address}}</span>
									<span v-show="scope.row.address=='_获取位置_'" @click="getAddress(scope.row)"
										  class="text-blue hover-underline cursor-pointer">{{scope.row.address}}</span>

								</template>

							</el-table-column>

							<el-table-column
								v-if="carDataType>=4&&carDataType!=16"
								:render-header="setHead"
								label='{"value":"FAlarm","title":"_报警类型_","label":""}'
								width="150">
								<template scope="scope">
									<span v-if="scope.row.alarmOverSpeed==1"
										  class="img-icon monitor-icon icon-alarmOverSpeed"
										  data-toggle="tooltip" data-placement="left" title="_超速报警_"></span>

									<span v-if="scope.row.FAlarmLowPower==1"
										  class="img-icon monitor-icon icon-alarmLowBattery"
										  data-toggle="tooltip" data-placement="left" title="_低电量报警_"></span>

									<span v-if="scope.row.alarmFatigue==1"
										  class="monitor-icon img-icon icon-alarmFatigue"
										  data-toggle="tooltip" data-placement="left" title="_疲劳驾驶_"></span>

									<span v-if="scope.row.alarmTemperature==1"
										  class="img-icon monitor-icon icon-alarmTemperature"
										  data-toggle="tooltip" data-placement="left" title="_温度报警_"></span>

									<span v-if="scope.row.alarmFLockRope==1"
										  class="img-icon monitor-icon icon-alarmFLockRope"
										  data-toggle="tooltip" data-placement="left" title="_绳索异常_"></span>

									<span v-if="scope.row.unCoverBack==1"
										  class="img-icon monitor-icon icon-unCoverBack"
										  data-toggle="tooltip" data-placement="left" title="_后盖报警_"></span>

									<span v-if="scope.row.longTimeOpened==1"
										  class="img-icon monitor-icon icon-longTimeOpened"
										  data-toggle="tooltip" data-placement="left" title="_长时间未锁_"></span>

									<span v-if="scope.row.fivePasswordError==1"
										  class="img-icon monitor-icon icon-fivePasswordError"
										  data-toggle="tooltip" data-placement="left" title="_连续五次错误密码_"></span>

									<span v-if="scope.row.illegalCard==1"
										  class="img-icon monitor-icon icon-illegalCard"
										  data-toggle="tooltip" data-placement="left" title="_刷非法卡_"></span>

									<span v-if="scope.row.forbiddenAreaOpen==1"
										  class="img-icon monitor-icon icon-forbiddenAreaOpen"
										  data-toggle="tooltip" data-placement="left" title="_禁区开锁_"></span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FLocationType')!==-1"
								prop="locationType"
								:render-header="setHead"
								label='{"value":"FLocationType","title":"_定位状态_","label":""}'
								sortable="custom"
								width="110">
								<template scope="scope">
									<!-- <span v-if="!scope.row.locationType">--</span> -->
									<i class="img-icon" :class="{'gps-light':scope.row.locationType==1,
											   'net-light':scope.row.locationType==2,
											   'wifi-light':scope.row.locationType==3,
											   'red-light':scope.row.locationType==0}"
									   :title="scope.row.locationType==1?'GPS':(scope.row.locationType==2?'_基站定位_':(scope.row.locationType==3?'WIFI':'_不定位_'))"></i>
								</template>
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FSpeed')!==-1"
								prop="speed"
								sortable="custom"
								:render-header="setHead"
								label='{"value":"FSpeed","title":"_速度_","label":""}'
								width="120">
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FMileage')!==-1"
								prop="mileage"
								sortable="custom"
								:render-header="setHead"
								label='{"value":"FMileage","title":"_里程_","label":""}'
								width="120">
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FBindFenceCount')!==-1"
								prop="FBindFenceCount"
								sortable="custom"
								:render-header="setHead"
								label='{"value":"FBindFenceCount","title":"_绑定围栏个数_","label":""}'
								width="120">
								<template scope="scope">
									<a href="javascript:;" @click="showFence(scope.row)" style="display:block">{{scope.row.FBindFenceCount}}</a>
								</template>
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FBatteryPercent')!==-1"
								prop="batteryPercent"
								:render-header="setHead"
								label='{"value":"FBatteryPercent","title":"_电量_","label":""}'
								sortable="custom"
								:class="{'text-red':batteryPercent<=LowPowerThreshold}"
								width="120">
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FLockStatus')!==-1"
								:render-header="setHead"
								label='{"value":"FLockStatus","title":"_锁状态_","label":""}'
								width="120">
								<template scope="scope">
									<span v-if="scope.row.FLockStatus==-1||!(scope.row.FAssetTypeID==701||scope.row.FAssetTypeID==735||scope.row.FAssetTypeID==740)">--</span>
									<el-popover v-if="scope.row.FLockStatus!=-1"
												placement="top-start"
												width="460"
												offset="350"
												popper-class="popover-box"
												trigger="hover"
												:disabled="scope.row.attitude==null">
										<i slot="reference" class="img-icon lock-state" :class="{'normal-lock':!scope.row.FLockStatus&&scope.row.attitude<=1,
														'abnormal-lock':!scope.row.FLockStatus&&scope.row.attitude>1,
														'normal-unlock':scope.row.FLockStatus&&scope.row.attitude<=1,
														'abnormal-unlock':scope.row.FLockStatus&&scope.row.attitude>1}"
										   :title="scope.row.FLockStatus?'_开锁_':'_上锁_'"></i>

										<div class="pose-wrap">
											<img v-if="scope.row.attitude!=null"
												 :src="'/static/img/pose/pose'+scope.row.attitude+'.png'">
											<p class="top-left">_左视图_</p>
											<p class="top-right">_俯视图_</p>
											<p class="bom">_正视图_</p>
										</div>
									</el-popover>
								</template>
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FOil')!==-1"
								:render-header="setHead"
								label='{"value":"FOil","title":"_油位_","label":""}'
								width="120">
								<template scope="scope">
									<span v-if="!scope.row.fuelValue||!scope.row.fuelValue.length">--</span>
									<span v-for="obj in scope.row.fuelValue" v-else>
										<i class="tire" v-show="scope.row.fuelValue.length!=1 && obj.number!=1">{{obj.number}}</i>{{obj.value}}&nbsp;
									</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FCouplingStatus')!==-1"
								prop="couplingStatus"
								:render-header="setHead"
								sortable="custom"
								label='{"value":"FCouplingStatus","title":"_接甩挂_","label":""}'
								width="110">
								<template scope="scope">
									<span v-show="scope.row.FAssetTypeID!==703">--</span>
									<i v-show="scope.row.couplingStatus==1 || scope.row.couplingStatus==0" class="img-icon"
									   :class="{'online-coupling':scope.row.couplingStatus==1&&scope.row.alarmOffLine!=1,
												'online-unCoupling':scope.row.couplingStatus==0&&scope.row.alarmOffLine!=1,
												'offline-Coupling':scope.row.couplingStatus==1&&scope.row.alarmOffLine==1,
												'offline-unCoupling':scope.row.couplingStatus==0&&scope.row.alarmOffLine==1}"
									   :title="scope.row.couplingStatusTitle"></i>
								</template>
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FTireTemperature')!==-1"
								:render-header="setHead"
								label='{"value":"FTireTemperature","title":"_胎温胎压_","label":""}'
								width="110">
								<template scope="scope">
									<span v-show="scope.row.isHaveTyreContent==0">--</span>
									<el-popover v-show="scope.row.isHaveTyreContent==1"
												placement="top"
												width="460"
												offset="350"
												popper-class="popover-box"
												trigger="click">

													<span @click="getCarTireData(scope.row)" slot="reference">
														<i class="img-icon carChoiceList-icon ChoiceListIcon-5a cursor-pointer"></i>
													</span>

										<div style="min-height:400px">
											<table class="popover-table" width="100%">
												<thead>
												<tr>
													<th colspan="2">_设备_ID:{{tireData.ID}}</th>
													<th colspan="2">_上传时间_:{{tireData.time}}</th>
												</tr>
												<tr>
													<th width="10%">_序号_</th>
													<th width="20%">_胎压_(Bar)</th>
													<th width="20%">_胎温_(℃)</th>
													<th width="50%">_状态_</th>
												</tr>
												</thead>
												<tbody>
												<tr v-for="value in tireData.data">
													<td align="center">{{value.N}}</td>
													<td align="center">{{value.P}}</td>
													<td align="center">{{value.T}}</td>
													<td align="left">
														&nbsp;&nbsp;{{value.state}}
													</td>
												</tr>
												</tbody>
											</table>
											<div class="popover-img img-tire"></div>
										</div>
									</el-popover>

								</template>
							</el-table-column>


							<!--集装箱系统特有 start-->
							<el-table-column
								v-if="checkList.indexOf('FBoxLoadedStatus')!==-1"
								:render-header="setHead"
								prop="FIsLoaded"
								sortable="custom"
								label='{"value":"FBoxLoadedStatus","title":"_空重载状态_","label":""}'
								width="150">
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FBoxDoorStatus')!==-1"
								:render-header="setHead"
								prop="FIsOpenDoor"
								sortable="custom"
								label='{"value":"FBoxDoorStatus","title":"_箱门状态_","label":""}'
								width="150">
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FSwitchDoorTimes')!==-1"
								prop="doorTimes"
								:render-header="setHead"
								sortable="custom"
								label='{"value":"FSwitchDoorTimes","title":"_开关门次数_","label":""}'
								width="150">
							</el-table-column>

							<!--温湿度 start-->
							<el-table-column
								v-if="checkList.indexOf('FTemperature')!==-1"
								prop="coldChainEquipment"
								:render-header="setHead"
								show-overflow-tooltip
								label='{"value":"FTemperature","title":"_箱内_/_箱外温度_/_温湿度_","label":""}'
								width="300">
								<template scope="scope">
										<span>{{scope.row.FTemperature2}}/{{scope.row.FTemperature1}}/{{scope.row.FTemperature3}}/{{scope.row.FTemperature4}}</span>
								</template>
							</el-table-column>
							<!--温湿度 end-->

							<el-table-column
								v-if="checkList.indexOf('FIsLock')!==-1"
								:render-header="setHead"
								label='{"value":"FIsLock","title":"_远程开锁_","label":""}'
								width="120">
								<template scope="scope">
									<p v-if="!(scope.row.FAssetTypeID==701||scope.row.FAssetTypeID==735||scope.row.FAssetTypeID==740)">--</p>
									<a v-if="!scope.row.isShowKeyBtn" class="img-icon monitor-icon no-icon-key" title="_不支持远程开锁_"></a>
									<a v-if="scope.row.isShowKeyBtn" @click="openLockBox(scope.row)"
									   class="img-icon monitor-icon icon-key" title="_远程开锁_"></a>
								</template>
							</el-table-column>
							<el-table-column
								v-if="checkList.indexOf('FDetail')!==-1"
								:render-header="setHead"
								label='{"value":"FDetail","title":"_查看详情_","label":""}'
								width="120">
								<template scope="scope">
									<a @click="showCarInfo(scope.row.ID)"
									   class="img-icon monitor-icon icon-info" title="_查看详情_">
									</a>
								</template>
							</el-table-column>
							<el-table-column prop="" ></el-table-column>
						</el-table>
					</template>
				</div>
			</div>
		</div>
		<!--下部列表区域 结束-->
	</div>

</template>
<script>
	import baiduMap from "components/Common/baidu_map.vue"
	import openLock from "components/dialog/openLock.vue"
	import highcharts from 'highcharts/highcharts'
	require('highcharts/highcharts-more')(highcharts)
	require('highcharts/js/modules/solid-gauge')(highcharts)
	import carTree from "components/tree/tree.vue"
	let _this = null
	export default{

		data(){
			_this = this
			return {
				isLoadTreeDom:true, //是不是加载树形组件
				refreshInterva: 30 * 1000, //页面刷新间隔
				subMenu: [
					{active: true},
					{active: false},
					{active: false}
				],
				settingDialog:false, //字段设置弹框是否显示,
				showFenceArr:[],//设备绑定的围栏
				checkOptions:[{
					value:"FLocationType",
					label:"_定位状态_"
				},{
					value:"FSpeed",
					label:"_速度_"
				},{
					value:"FMileage",
					label:"_里程_"
				},{
					value:"FBatteryPercent",
					label:"_电量_"
				},{
					value:"FLockStatus",
					label:"_锁状态_"
				},{
					value:"FBoxLoadedStatus",
					label:"_空重载状态_"
				},{
					value:"FTemperature",
					label:"_箱内_/_箱外温度_/_温湿度_"
				},{
					value:"FBoxDoorStatus",
					label:"_箱门状态_"
				},{
					value:"FDetail",
					label:"_查看详情_"
				},{
					value:"FOil",
					label:"_油位_"
				},{
					value:"FSwitchDoorTimes",
					label:"_开关门次数_"
				},{
					value:"FCouplingStatus",
					label:"_接甩挂_"
				},{
					value:"FTireTemperature",
					label:"_胎温胎压_"
				},{
					value:"FIsLock",
					label:"_远程开锁_"
				},{
					value:"FBindFenceCount",
					label:"_绑定围栏个数_"
				}],//可选字段
				checkList:[],//已选字段
				showNum:5,       //下侧列表显示行数
				startIndex: 0,   //显示的第一行的index
				endIndex: 5,    //显示的最后一行的index
				maxHeight:0,    //下侧列表最大高度
				treeLoading:null, //树形控件loading

				isFullScreen: false,//地图全屏开关
				rightListState: true,// 右侧列表显示内容 true 列表  false 状态栏
				statusData:null,    //状态数据容器
				chartSpeed:null,    //速度图表对象
				chartOil:null,      //油位图表对象
				statusDataIndex:null, //状态栏显示数据索引值

				isShowAlarmType: false,//报警类型开关
				isShowSelectCarList: false,//侧边栏开关
				isShowSearchCarName: false,//下部车辆搜索开关
				//初始化显示工具栏
				mapToolShow: true,
				LowPowerThreshold: this.$store.state.LowPowerThreshold, //低电量阈值  单位%
				//是否显示区域检索
				isShowAreaSearch: true,
				//初始城市
				Area: "深圳",
				isFirstClick:true,//第一次点击

				isGetTreeData:false,    //是否需要获取树形数据
				tireData: { //轮胎数据
					ID: null,
					time: null,
					data: []
				},
				//排序状态
				sortObj:{
					prop:null,             //排序列key
					order:"ascending",     //升序/降序
				},
				data: null,
				conut: 0,
				filterText: '',
				filterText1: '',
				choiceAssetData:null,
				FAssetID: null,    //终端号
				FAssetGUID: null,  //终端GUID
				FVehicleName: null, //车牌号
				FVehicleGUID: null,
				lockAssetData:{ //开锁设备数据
					ID:null,
					text:[],
					btnDisabled:false,
					serverData:{
						precent:0,
						status:"success"
					},
					lockData:{
						precent:0,
						status:"success"
					}
				},
				/************电子锁结束***************/

				//树形图选项
				options: {
					showCheckbox: true, //是否支持多选
					halfCheckedStatus: true,//控制父框是否需要半钩状态
					search: {
						useInitial: true, //是否支持首字母搜索
						useEnglish: true, //是否是英文搜索
						customFilter: null // 自定义节点过滤函数
					},
					isShowLockBtn:true
				},


				showDataList: [],    //显示信息使用容器
				allCarData: [],      //所选车辆信息
				runCarData: [],      //运行车辆信息
				stopCarData: [],     //停车车辆信息
				idlingData:[],       //怠速车辆信息
				alarmCarData: [],     //报警车辆信息
				outlineCarData: [],   //离线车辆信息
				alarmFatigue: [],     //疲劳驾驶报警
				alarmOverSpeed: [],   //超速报警
				alarmOffsetRoad: [],  //道路偏移报警
				alarmTemperature: [], //温度报警
				alarmFLockRope: [],   //绳锁是否异常
				FAlarmLowPower: [],   //低电量报警
				unCoverBack: [],        //后盖打开
				longTimeOpened: [],     //长时间未锁
				fivePasswordError: [],   //五次输入错误
				illegalCard: [],         //刷非法卡
				forbiddenAreaOpen: [],   //禁区开锁


				searchCarName: "",      //搜索车辆关键字
				intervalGetData: true,  //定时器开关
				carIdArr: [],            //车辆id数组
				treeIDArr:[],			 //所选树形菜单节点数组 比	carIdArr多了公司 车队节点ID
				ExitStatusID:[],         //离开本页面时 保存车辆ID数据 carIdArr
				carDataType: 0,          //记录下部菜单列表选择项类型


				LockStatusBarAlarm: [//电子锁状态栏报警
					{
						name: "_超速报警_",
						status: 0,
						bg: "AI-A1",
						fields:"alarmOverSpeed"
					},
					{
						name: "_锁绳剪断_",
						status: 0,
						bg: "AI-C5",
						fields:"alarmFLockRope"
					},
					{
						name: "_后盖打开_",
						status: 0,
						bg: "AI-E5",
						fields:"unCoverBack"
					},
					{
						name: "_姿态异常_",
						status: 0,
						bg: "AI-H5",
						fields:""
					},
					{
						name: "_低电量报警_",
						status: 0,
						bg: "AI-F1",
						fields:"FAlarmLowPower"
					},
					{
						name: "_温度报警_",
						status: 0,
						bg: "AI-D1",
						fields:""
					},
					{
						name: "_上盖被破坏报警_",
						status: 0,
						bg: "AI-I5",
						fields:""
					},
					{
						name: "_控制板通讯异常报警_",
						status: 0,
						bg: "AI-B7",
						fields:""
					},
				],
				carStatusBarAlarm: [//电子锁状态栏报警
					{
						name: "_超速报警_",
						status: 0,
						bg: "AI-A1",
						fields:"alarmOverSpeed"
					},
					{
						name: "_低电量报警_",
						status: 0,
						bg: "AI-F1",
						fields:"FAlarmLowPower"
					},
					{
						name: "_疲劳驾驶_",
						status: 0,
						bg: "AI-E1",
						fields:"alarmFatigue"
					},
					{
						name: "_温度报警_",
						status: 0,
						bg: "AI-D1",
						fields:"alarmTemperature"
					},
					{
						name: "_进围栏_",
						status: 0,
						bg: "AI-I1",
						fields:""
					},
				],
        AlarmCollection: [
          {
            name: "_超速报警_",
            status: 0,
            bg: "AI-A1",
            fields:"alarmOverSpeed"
          },
          {
            name: "_锁绳异常_",
            status: 0,
            bg: "AI-C5",
            fields:"alarmFLockRope"
          },
          {
            name: "_后盖打开_",
            status: 0,
            bg: "AI-E5",
            fields:"unCoverBack"
          },
          {
            name: "_道路偏移_",
            status: 0,
            bg: "AI-C3",
            fields:"alarmOffsetRoad"
          },
          {
            name: "_低电量报警_",
            status: 0,
            bg: "AI-F1",
            fields:"FAlarmLowPower"
          },
          {
            name: "_长时间未锁_",
            status: 0,
            bg: "AI-D7",
            fields:"longTimeOpened"
          },
          {
            name: "_刷非法卡_",
            status: 0,
            bg: "AI-D5",
            fields:"illegalCard"
          },
          {
            name: "_疲劳驾驶报警_",
            status: 0,
            bg: "AI-E1",
            fields:"alarmFatigue"
          },
          {
            name: "_五次输入错误_",
            status: 0,
            bg: "AI-J5",
            fields:"fivePasswordError"
          },
        ],   // 报警状态集合 n
				markerClusterer:null,
        EquipmentType:null, // 设备类型 1：电子锁  2：接甩挂   3：集装箱  4：车队  n
        ALLNotAlarm:true // 是否都没所有的报警类型
			}
		},
		components: {
			baiduMap: baiduMap,
			carTree: carTree,
			openLock: openLock
		},
		props: {
			screenHeight: Number
		},
		filters:{
			parseAttitude (value) {
				switch (value) {
					case null:
						return "_无姿态数据_";
					case 1:
						return "_正立_";
					case 2:
						return "_异常前倾_";
					case 3:
						return "_异常后倾_";
					case 4:
						return "_异常左倾_";
					case 5:
						return "_异常右倾_";
					case 6:
						return "_异常侧立_";
					case 7:
						return "_异常倒立_";
					case 8:
						return "_异常平躺_";
				}
			}
		},
		mounted(){
			this.queryCheckList()
			_this.treeLoading = this.$loading({
				target:document.getElementById("select-car"),
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				customClass:"loading-bg"
			});
			console.log("车辆列表数据",this.$store.state.allCarsData);
			if(this.$store.state.allCarsData.length!=0) {

				setTimeout(function () {
					_this.treeLoading.close();
				},100)
			};

			setTimeout(function () {
				_this.adjustPage();
				_this.$refs.map.initMap();
			}, 500);

			//tabs切换效果
			var activePos = $('.contentList-header .active').position();
			//初始化下方边框
			function changePos() {
				activePos = $('.contentList-header .active').position();
				$('.border').stop().css({
					left: activePos.left,
					width: $('.contentList-header .active').width()
				});
			}

			var tabHeight = $('.tab.active').height();

			function animateTabHeight() {
				tabHeight = $('.tab.active').height();
				$('.tabs-content').stop().css({height: tabHeight + 'px'});
			}

			animateTabHeight();
			$('.contentList-header li').on('click', function (e) {
				e.preventDefault();
				setTimeout(changePos, 50)
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

			//监听滚动事件
			document.getElementsByClassName("el-table__body-wrapper")[0].addEventListener('scroll', function () {

				let	nScrollTop = this.scrollTop,              //滚动条高度
					trHight = $(this).find("tr").height(),    //内部单个tr的高度
					n = parseInt(nScrollTop / trHight);      //滚动高度计算出已经显示的tr个数
				if(nScrollTop==0) return;

				_this.startIndex=n;
				_this.endIndex=n+_this.showNum;
				console.log("初始化1",_this.startIndex,_this.endIndex)

			});
			this.$store.commit('getFenceData',this)
		},
		activated(){
			this.isLoadTreeDom=true;
			if (typeof this.$route.params.IDArr != "undefined") {
				this.carIdArr=this.$route.params.IDArr;
				console.log(this.carIdArr);
				this.ExitStatusID =this.$route.params.IDArr;
				this.isGetTreeData=false;
				this.openInfowindowIndex=null;
			}

			//组件激活时，所选车辆不为空时，开启定时刷新
			if (_this.carIdArr.length != 0) {
				_this.intervalGetData=true;
				_this.getCarIdData();
				//_this.intervalGetData = setInterval(function () {
				//	_this.getCarIdData();
				//}, _this.refreshInterva)
			};
			if(_this.isGetTreeData) {
				this.loadTreeData(function(){
					//选择离开页面时选中的数据
					_this.selectedCarInTree(_this.treeData[0],_this.ExitStatusID);
					_this.handlecheckedChange(_this.ExitStatusID)
				});
			}else {
				_this.selectedCarInTree(_this.treeData[0],_this.ExitStatusID);
			}
		},
		updated(){
			if ($('.el-tree-node').eq(0).css('display') == 'none') {
				$('.bingCar').css("display", 'block')
			} else {
				$('.bingCar').css("display", 'none')
			}
		},
		watch: {
			screenHeight () {
				this.adjustPage()
			},
			filterText1(val) {
				this.$refs.tree1.filter(val);
			},
			rightListState(val){
				if(val) {
					this.chartSpeed=null;
					this.chartOil=null;
				}
			},
			//状态栏数据的索引值
			statusDataIndex(val){
				//console.log(val)
				this.allCarData.map(function (item,index) {
					item.active=false;
					if(item.markerIndex===val){
						_this.showStatusList(item);
						item.active=true;
					}
				})
			},
			//监听下次显示数据变化 触发逆编译事件
			endIndex(){
				if(_this.showDataList.length!=0) _this.getGeocoder()
			}
		},
		methods: {
			setHead(h,{ column, $index }){
					let obj=JSON.parse(column.label)
					return(<span title={obj.title} style="cursor: pointer;"><i class={['statu-icon',obj.value]}></i>{obj.label}</span>)
			},
			//排序 obj={ column, prop, order }
			sortChange(obj){
				//console.log(obj);
				let key=obj.prop;
				this.sortObj.prop=key;
				this.sortObj.order=obj.order;
				//this.filterCarName[
				let ulArr=[];

				let data=this.showDataList;
				for (let i = data.length-1; i >=0; i--) {
					let obj = data[i][key];
					if(obj==="--"){
						ulArr.push(data.splice(i,1)[0])
					}
				}

				data.sort(function (a,b) {
					if(a[key] > b[key]){
						return 1
					}else if(a[key]===b[key]){
						return 0
					}else{
						return -1
					}
				})
				if(obj.order==="descending") data.reverse();
				if(ulArr.length!=0){
					ulArr.map(function(item,index){
						data.push(item)
					})
				}
				this.getGeocoder();
			},

			//跳转路由
			changeRoute(menuData){
				this.$store.commit("changeRoute", menuData);
				this.$router.push(menuData.router)
			},
			//跳转 趟次报表
			linkTripReport(FAssetGUID){
				let menuData = {tabsText: "_开关锁报表_", router: "tripReport"};
				this.$store.commit("changeRoute", menuData);
				this.$router.push({name: "tripReport", params: {ID: FAssetGUID}})
			},
			//跳转 轨迹回放
			linkHistorical(data){
				let ID=data.ID;  //订单ID
				let name=data.assetID;     //设备名称
				let menuData = {tabsText: "_轨迹回放_", router: "historical_route"};
				this.$store.commit('changeRoute',menuData)
				this.$router.push({name: "historical_route", params: {ID: ID, name: name,data:data}})
			},
			//全屏
			changefullScreen(meg){
				this.isFullScreen = meg;
				this.isShowSelectCarList=meg;
				$("#contentList").height("35px");
				$("#contentList").css("overflow", "hidden");
				this.setScroll("table-wrap", 155)
				setTimeout(function () {
					_this.adjustPage()
				}, 100)
			},
			//动态调整页面布局
			adjustPage(){
				this.elementsFlex("map-wrapper", "map-template", "map-tool", "contentList");
				this.elementsFlex("select-car", "map-template", "map-tool", "contentList");
				setTimeout(function () {
					let h = _this.elementsFlex("tree-body", "select-car", "tree-header", "tree-footer", true);
					_this.setScroll("tree-body", h);


					let tableHeight=$('.el-table__body-wrapper').height();
					let trHight = $('.el-table__body-wrapper').find("tr").height();
					let n=Math.floor(tableHeight/trHight);
					//console.log("显示个数",n)
					if(trHight==NaN || n==Infinity){
						_this.showNum=10;
					}else {
						_this.showNum=n;
					}
					_this.endIndex=_this.startIndex+_this.showNum;
					//console.log("初始化2",_this.startIndex,_this.endIndex)

				}, 300)
			},
			//最小化下部菜单
			closeSubMenu(){
				this.changeActive(this.subMenu, 0);
				$("#map-tool").show();
				$("#contentList").height("35px");
				$("#contentList").css("overflow", "hidden");
				this.adjustPage();
				//$('.lockBtns').css("bottom", "80px")
			},
			//展开下部菜单
			openSubMenu(){
				this.changeActive(this.subMenu, 2);
				$("#contentList").css("overflow", "visible")
				$("#map-tool").show();
				$("#contentList").height("220px");
				this.maxHeight=185;
				//this.setScroll("table-wrap", 155)
				this.adjustPage();
				//$('.lockBtns').css("bottom", "260px")
			},
			//下部菜单全屏
			fullSubMenu(){
				this.changeActive(this.subMenu, 1);
				$("#contentList").css("overflow", "visible");
				$("#map-tool").hide();
				this.elementsFlex("contentList", "map-template");
				let height = this.elementsFlex("table-wrap", "contentList", "contentList-header", "table-header", true);
				this.maxHeight= height - 20;
				//this.setScroll("table-wrap", height - 20);
				//if (this.carPointArr != 0) this.startIndex += 50;
				this.adjustPage();
			},
			//开启关闭右侧车辆选择
			showCarList(){
				this.isShowSelectCarList = !this.isShowSelectCarList;
			},
			//开启关闭车辆选择搜索input
			showCarNameSearch(){
				this.isShowSearchCarName = !this.isShowSearchCarName;
				if (!this.isShowSearchCarName) this.searchCarName = "";
				setTimeout(function () {
					$("#searchCarName").focus();
				}, 200)
			},
			//调取车辆信息 或 锁数据
			loadTreeData(callback) {
				_this.$store.commit('getAllCarsData',function(){
					if (_this.$store.state.allCarsList.length == 0) {
						_this.$refs.map.showError("_暂无数据_");
					}
					if (callback != null && callback != "") callback();
				});


				/*
				 if (this.$store.state.allCarsList != null && refresh != true) {

				 setData()
				 } else {

				 _this.$store.commit('getAllCarsData', setData);
				 }
				 function setData() {

				 if (_this.$store.state.allCarsList.length == 0) {
				 _this.$refs.map.showError("_暂无车辆数据_");
				 }
				 if (_this.systemID == 2) {
				 _this.allCarsArr = _this.$store.state.allLockList;   //原始锁列表
				 _this.lockData = _this.deepCopy(_this.$store.state.mapLocksData);  //地图树形 锁列表
				 //_this.noLockVehicle = _this.$store.state.noLockVehicle;  //未绑定车辆的 锁列表
				 } else {
				 _this.allCarsArr = _this.$store.state.allCarsList;   //原始车辆列表
				 }
				 _this.treeData = _this.deepCopy(_this.$store.state.allCarsData); //地图树形 车辆列表

				 if (callback != null && callback != "") callback();
				 }*/
			},
			//选中车辆请求车辆数据
			handlecheckedChange(cars){ //cars 【Array】  ID数组
				console.log("cars",cars)

				_this.intervalGetData=false;
				//if (_this.intervalGetData != null) {
				//	clearInterval(_this.intervalGetData);
				//};
				_this.carIdArr = [];

				for (let i = 0; i < cars.length; i++) {
					let id = cars[i];
					if (id.indexOf("@") === -1) _this.carIdArr.push(id);
				};
				_this.treeIDArr=_this.carIdArr;
				//删除已绘制的点
				_this.$refs.map.deleteLately();

				if (_this.carIdArr.length === 0) {
					_this.closeSubMenu();
					_this.allCarData.length=0;
					_this.stopCarData.length=0;
					_this.idlingData.length=0;
					_this.runCarData.length=0;
					_this.alarmCarData.length=0;
					_this.outlineCarData.length=0;
					_this.alarmFatigue.length=0;
					_this.alarmOverSpeed.length=0;
					_this.alarmOffsetRoad.length=0;
					_this.alarmTemperature.length=0;
					_this.unCoverBack.length=0;
					_this.longTimeOpened.length=0;
					_this.fivePasswordError.length=0;
					_this.illegalCard.length=0;
					_this.forbiddenAreaOpen.length=0;
					_this.showDataList.length=0;
					return
				};


				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					customClass:"loading-bg"
				});

				_this.intervalGetData=true;
				_this.getCarIdData(function () {
					_this.openSubMenu();
					loading.close();
					setTimeout(function () {
						_this.$refs.map.showAllMap();
						_this.$refs.elTable.doLayout()
						if(_this.isFirstClick){
							$(".list-name").eq(0).click();
							_this.isFirstClick=false;
						};

					}, 300)

				});

				//_this.intervalGetData = setInterval(function () {
				//	_this. ();
				//}, _this.refreshInterva)

			},
			//刷新右侧列表
			refreshRightList(){
				_this.treeLoading = this.$loading({
					target:document.getElementById("select-car"),
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					customClass:"loading-bg"
				});
				this.loadTreeData(function () {
					let data=null;
					data=_this.treeData[0];
					_this.selectedCarInTree(data,_this.treeIDArr)
				})
			},
			// 根据startIndex和endIndex反地理编码
			getGeocoder(){
				console.log("编译",_this.startIndex,_this.endIndex);
				for (let i = _this.startIndex; i <= _this.endIndex; i++) {

					if(!_this.filterCarName[i] && i<0 || i>=_this.filterCarName.length) continue;

					if (_this.filterCarName[i].point.lng != 0 && _this.filterCarName[i].point.lat != 0) {

						if(_this.filterCarName[i].address!="_获取定位_"){

							_this.geocoder(_this.mapType, _this.filterCarName[i].point, _this.filterCarName[i], "address")
						}
					} else {
						_this.filterCarName[i].address = "_无定位_"
					}

				}
			},

			//遍历树 选中上次勾选
			selectedCarInTree(treeData,ArrID){
				if(treeData==null || ArrID.length==0) return;

				let datas = new Map();
				const getNode = (key) => {
					return datas.get(key)
				};
				const _traverseNodes = (root) => {
					for (let node of root) {
						datas.set(node.id, node)
						if (node.children && node.children.length > 0) _traverseNodes(node.children)
					}
				}
				const _traverseUp = (node, flag) => {
					let parent = null;
					if (node.checked) { //打钩

						if (node.parentId) {
							parent = getNode(node.parentId)
							//console.log(parent);
							if (flag) {
								parent.checked = true
								parent.nodeSelectNotAll = true
								_traverseUp(parent, true)
							} else {
								parent.checked = true;
								parent.nodeSelectNotAll = sameSilibingHalfChecked(true, parent, node.parentId, node.id) === 'half' ? true : false; //返回true则全钩，false为半钩
								_traverseUp(parent)
							}
						}
					} else { //去钩
						if (node.parentId) {
							parent = getNode(node.parentId)
							if (sameSilibingHalfChecked(false, parent, node.parentId, node.id) === "none") { //返回true则全没钩，false为半钩
								parent.checked = false
								parent.nodeSelectNotAll = false
							} else {
								parent.checked = true
								parent.nodeSelectNotAll = true
							}
							_traverseUp(parent, true)
						}
					}
				};
				const _traverseDown = (node) => {
					if (node.children && node.children.length > 0) {
						if (node.nodeSelectNotAll) { //节点没勾选
							node.nodeSelectNotAll = false
						}
						for (let child of node.children) {
							child.checked = node.checked
							_traverseDown(child)
						}
					}
				};
				const sameSilibingHalfChecked = (status, parent, parentId, currentId) => {
					let sbIds = []
					let currentNode = getNode(currentId)
					parent.children.forEach(x => {
						if (!currentNode.nodeSelectNotAll && x.id !== currentId) sbIds.push(x.id) //除去当前节点的剩下节点
				})

					if (status) { //打钩
						if (sbIds.length !== 0) {
							for (let id of sbIds) { //子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
								let node = getNode(id)
								if (!node.checked || node.nodeSelectNotAll) { //节点没勾选
									return "half" //表示父框半钩的状态
								}
							}
						} else {
							if (currentNode.nodeSelectNotAll) {
								return "half" //表示全钩的状态
							}
						}
						return "all" //表示全钩的状态
					} else { //去钩
						if (sbIds.length !== 0) {
							for (let id of sbIds) { //子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
								let node = getNode(id)
								if (node.checked || node.nodeSelectNotAll) { //有节点被勾选，父框半钩的状态
									return "half"
								}
							}
						} else {
							if (currentNode.nodeSelectNotAll) {
								return "half" //表示全钩的状态
							}
						}
						return "none"
					}
				};

				_traverseNodes([treeData])



				function traverseNode(node){

					if(ArrID.indexOf(node.id)!==-1){
						//console.log("节点",node);
						node.checked=true;
						_traverseUp(node)
						_traverseDown(node)
					}


				}
				function traverseTree(node){
					if (!node) {
						return;
					}
					traverseNode(node);
					if (node.children && node.children.length > 0) {
						var i = 0;
						for (i = 0; i < node.children.length; i++) {
							traverseTree(node.children[i]);
						}
					}
				}
				traverseTree(treeData);
			},
			//在当前选择车辆的范围内 根据开锁和上锁状态 过滤设备
			handleLockStatus(status){
				_this.loadTreeData(function(){
					let IDArr=[];
					_this.treeData[0].children.map(function(item,index){
						item.children.map(function(subItem,subIndex){
							if(subItem.lockStatus==status){ //选择上锁车辆
								subItem.checked=true;
								//console.log(item.id);
								IDArr.push(subItem.id);
							}else {
								subItem.checked=false;
							}
						})

					});
					_this.handlecheckedChange(IDArr);
				});

			},
			//在当前选择车辆的范围内 根据有单和无单状态 过滤设备
			handleWaybillStatus(status){
				_this.loadTreeData(function(){
					let IDArr=[];
					_this.treeData[0].children.map(function(item,index){
						item.children.map(function(subItem,subIndex){
							if(subItem.FIsHaveTrip==status){ //选择上锁车辆
								subItem.checked=true;
								//console.log(item.id);
								IDArr.push(subItem.id);
							}else {
								subItem.checked=false;
							}
						})

					});
					_this.handlecheckedChange(IDArr)
				});

			},
			//查询已选字段
			queryCheckList(){
				$.post("/web/Combine/Combine_LBS",{
					FTokenID:_this.$store.state.FTokenID,
					FAction:"QueryLBSMonitorParameter",
					FVersion:"1.0.0"
				},function (data) {
					console.log("已选字段",data);
					if(data.FObject[0].FMonitorParameter){
						_this.checkList=data.FObject[0].FMonitorParameter.split(',');
					}
				})
			},
			handleCheckChange(){
				let fn = _this.getCheckChange;
				clearTimeout(fn.timeoutId);
				fn.timeoutId = setTimeout(function () {
					fn.call(null);
				}, 500);
				//this.throttle(_this.save,null,500,this.value)
			},
			checkChange(value){
				console.log(value)
				new Promise(resove=>{
					$.post("/web/Combine/Combine_LBS",{
						FTokenID:_this.$store.state.FTokenID,
						FAction:"UpdateLBSMonitorParameter",
						FMonitorParameter:value.length?value.join(","):"&nbsp",
						FVersion:"1.0.0"
					},function (data) {
						console.log("更改字段",data);
						resove()
					})
				})
				.then(()=>{

				})
			},
			//请求车辆数据
			getCarIdData(callback){
				if(!this.intervalGetData) {
					clearTimeout(timeout);
					return;
				}
				let _this=this,
					carIdString = this.carIdArr.join(",");
				let postData={
					FTokenID:_this.$store.state.FTokenID,
					FAction:"QueryLBSMonitorListByFVehicleGUIDs",
					FVehicleGUIDs:carIdString,
					FMonitorParameter:"",
					FVersion:"1.0.0"
				};
				$.ajax({
					url: "/web/Combine/Combine_LBS",
					cache: false,
					async: true,
					type: 'Post',
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					global: false,
					data: JSON.stringify(postData),
					success: function (res) {
						if(!_this.intervalGetData) {
							clearTimeout(timeout);
							return;
						};
						//console.log("查询车辆数据", res);
						_this.allCarData = [];
						_this.stopCarData = [];
						_this.idlingData = [];
						_this.runCarData = [];
						_this.alarmCarData = [];
						_this.outlineCarData = [];
						_this.alarmFatigue = [];
						_this.alarmOverSpeed = [];
						_this.alarmOffsetRoad = [];
						_this.alarmTemperature = [];
						_this.alarmFLockRope = [];
						_this.FAlarmLowPower = [];
						_this.unCoverBack = [];
						_this.longTimeOpened = [];
						_this.fivePasswordError = [];
						_this.illegalCard = [];
						_this.forbiddenAreaOpen = [];
						_this.showDataList = [];
						if (res.Result == 104) {
							_this.$refs.map.showError("_登录超时_，_五秒后返回登录页面_");
							setTimeout(function () {
								_this.$store.commit("goLogin");
							}, 5000)
							return
						}
						if (res.Result == 200) {
							if (res.FObject.length == 0) {
								_this.$refs.map.showError("_暂无数据_");
								if (callback != null && callback != "") callback();
								return
							}
							//console.log("实时监控车辆数据", res);
							let resData = res.FObject,
								points = [],
								markers=[],
								idArr = _this.deepCopy(_this.carIdArr),
							 	oResData=null;
							const isShowKeyBtn =(data)=>{
								if ((data.FAssetTypeID==701||data.FAssetTypeID==735||data.FAssetTypeID==740)&&!data.FAlarmOffLine) {
									return true
								}else{
									return false
								}
							}
								for (let i = 0; i < resData.length; i++) {
									oResData = resData[i];

									let point = {
										lng: oResData.FLongitude,
										lat: oResData.FLatitude
									};

									let theDate=_this.parseGMT(oResData.FGPSDateTime).replace(/-/g,"/").split(" ")[0];
									let today = moment().format("YYYY/MM/DD");


									let oCarPonitData = {
										markerIndex:i,
										name:oResData.FAssetID, //下部列表第二项显示内容，电子锁系统为电子锁ID
										ID: oResData.FVehicleGUID,
										assetID: oResData.FAssetID,
										FAssetTypeID:oResData.FAssetTypeID,
										FAssetType:_this.transFAssetType(oResData.FAssetTypeID),//设备类型
										FAssetGUID: oResData.FAssetGUID,
										FVehicleName: oResData.FVehicleName == null ? "--" : oResData.FVehicleName,
										FVehicleGUID: oResData.FVehicleGUID,
										company: oResData.FShortName,
										operateType: oResData.FOperateType,
										time: _this.parseGMT(oResData.FGPSDateTime),
										recvTime: _this.parseGMT(oResData.FRecvDateTime),
										point: _this.parsePoint(_this.mapType,point),
										speed: oResData.FSpeed,
										direction: oResData.FDirection,
										mileage: oResData.FMileage,
										address: "_获取位置信息中_",
										locationType: oResData.FLocationType,  //定位状态
										batteryPercent: oResData.FBatteryPercent > 100 ? "_充电中_" :(oResData.FBatteryPercent==-1?"--":oResData.FBatteryPercent) ,
										alarmOffLine: oResData.FAlarmOffLine, //离线状态
										FLockStatus:oResData.FLockStatus?-1:oResData.FLockStatus,    //锁状态
										GPSSignal:_this.parseGPS(oResData.FGPSSignal),
										GSMSignal:_this.parseGSM(oResData.FCellSignal),
										todayTrip:theDate<today? 0:oResData.FTripCount,
										runTime:_this.parseHAndM(oResData.FTotalDuration),
										stopTime:_this.parseHAndM(oResData.FParkingDuration),
										FACC:oResData.FACC,
										FEngine:oResData.FEngine,
										FAirCondition:oResData.FAirCondition,
										FBrake:oResData.FBrake,
										alarmOverSpeed: oResData.FAlarmOverSpeed, //超速报警
										alarmOffsetRoad: oResData.FAlarmOffsetRoad, //道路偏移
										alarmFLockRope: oResData.FLockRope,         //绳索异常
										FAlarmLowPower: oResData.FAlarmLowPower,      //低电量
										unCoverBack: oResData.FUnCoverBack,          //后盖打开
										longTimeOpened: oResData.FLongTimeOpened,       //长时间未锁
										fivePasswordError: oResData.FFivePasswordError,    //五次输入错误
										illegalCard: oResData.FIllegalCard,          //刷非法卡
										forbiddenAreaOpen: oResData.FForbiddenAreaOpen,    //禁区开锁
										alarmFatigue: oResData.FAlarmFatigue, //疲劳驾驶报警
										alarmArr:[],     //报警类型数组

										isShowKeyBtn:isShowKeyBtn(oResData),
										attitude: null,        //锁姿态  无姿态数据为null 数据格式 字符串 x轴，y轴，z轴
										coldChainEquipment: [],
										active: false,
										type: 1,
										FTemperature1:oResData.FTemperature1&&oResData.FTemperature1!==-1000?oResData.FTemperature1+'°C':"--",//(如果是704/706则 箱外温度 -1000 不存在)
										FTemperature2:oResData.FTemperature2&&oResData.FTemperature2!==-1000?oResData.FTemperature2+'°C':"--",//(如果是704/706则 箱外温度 -1000 不存在)
										FTemperature3:oResData.FTemperature3&&oResData.FTemperature3!==-1000?oResData.FTemperature3+'°C':"--",
										FTemperature4:oResData.FTemperature4&&oResData.FTemperature4!==-1000?oResData.FTemperature4+'°C':"--",
										//集装箱特有
										FContainerSize:_this.parseTxt(oResData.FContainerSize),    //尺寸代码
										FContainerType:_this.parseTxt(oResData.FContainerType),    //箱体类型
										FContacts:_this.parseTxt(oResData.FContacts),              //联系人
										FTelephone:_this.parseTxt(oResData.FTelephone),            //联系电话
										FEMailAddress:_this.parseTxt(oResData.FEMailAddress),      //油箱地址
										FStopLongTime:_this.formatSeconds(oResData.FStopLongTime),      //停留时长
										inTemperature: _this.parseTemperature(oResData.FInsideTemperature),
										outTemperature:_this.parseTemperature(oResData.FOutsideTemperature),
										FAlarmOffLine: 0,  //集装箱系统 表示无数据 待响应的箱体
										FIsLoaded:oResData.FBoxLoadedStatus?oResData.FBoxLoadedStatus==-1?"--":(oResData.FBoxLoadedStatus?"_重载_":"_空载_"):"--",
										FIsOpenDoor:oResData.FBoxDoorStatus?oResData.FBoxDoorStatus==-1?"--":(oResData.FBoxDoorStatus?"_开启_":"_关闭_"):"--",
										subBattery:oResData.FAuxiliaryBatteryPercent,    //从机电量
										doorTimes:oResData.FBoxDoorStatus?oResData.FBoxDoorStatus==-1||oResData.FSwitchDoorTimes===null?"--":(oResData.FSwitchDoorTimes-0):"--",                 //开关门次数
										//集装箱特有结束
										//车辆特有
										couplingStatus: oResData.FCouplingStatus,
										containerStatus: oResData.FContainerStatus == 1 ? "_有厢_" : "_无厢_",
										isHaveTyreContent:oResData.FTyreContent&&oResData.FTyreContent.length?1:0,  //0 无   1有
										FTyreContent:oResData.FTyreContent&&oResData.FTyreContent.length?oResData.FTyreContent:"",
										coldChainEquipment: [], //温度数据
										fuelValue: [], //油位数据
										fuel:0,
										fuelAngle:-112,
										speedAngle:(oResData.FSpeed*224)/160-112,
										tireData: { //轮胎数据
											ID: null,
											time: null,
											data: []
										},
										couplingStatusTitle: "",  //接甩挂状态的title
										FBindFenceCount:oResData.FBindFenceCount//绑定围栏个数

									};
									//分析接甩挂title
									if (oCarPonitData.alarmOffLine) {
										oCarPonitData.couplingStatusTitle += "_离线_&"
									} else {
										oCarPonitData.couplingStatusTitle += "_在线_&"
									}
									if (oCarPonitData.couplingStatus) {
										oCarPonitData.couplingStatusTitle += "_接挂_"
									} else {
										oCarPonitData.couplingStatusTitle += "_甩挂_"
									}
									if (oResData.FAttitude != null && oResData.FAttitude != '') {
										//console.log("转译前倾斜状态",oResData.FAttitude);
										oCarPonitData.attitude = _this.parseLockPose(oResData.FAttitude);

									};

									let fuelValue = oCarPonitData.fuelValue;
									for (let j = 1; j < 4; j++) {
										if (oResData['FFuelValue' + j]&&oResData['FFuelValue' + j]>0) {
											let item = {
												number: j,
												value: oResData['FFuelValue' + j]
											}
											fuelValue.push(item);
											if(j===1){
												let value= oResData['FFuelValue' + j];
												oCarPonitData.fuel=value;
												oCarPonitData.fuelAngle=(value*224)/400-112;
											}
										}
									}
									//实时车辆状态 筛选优先顺序  离线>报警>停车>运行
									if (oResData.FAlarmOffLine == 1) {
										//离线
										oCarPonitData.type = 3;
										_this.outlineCarData.push(oCarPonitData)
									}
									else if (oCarPonitData.alarmOverSpeed == 1
										|| oCarPonitData.alarmFLockRope == 1
										|| oCarPonitData.FAlarmLowPower == 1
										|| oCarPonitData.alarmFLockRope == 1
										|| oCarPonitData.unCoverBack == 1
										|| oCarPonitData.longTimeOpened == 1
										|| oCarPonitData.fivePasswordError == 1
										|| oCarPonitData.illegalCard == 1
										|| oCarPonitData.alarmFatigue==1
										|| oCarPonitData.forbiddenAreaOpen == 1) {
										//报警
										oCarPonitData.type = 4;
										_this.alarmCarData.push(oCarPonitData);
										let arr=[
											"alarmFLockRope",
											"alarmOverSpeed",
											"FAlarmLowPower",
											"unCoverBack",
											"longTimeOpened",
											"fivePasswordError",
											"illegalCard",
											"forbiddenAreaOpen",
											"alarmFatigue"
										];
										arr.map(function (item,index) {
											if(oCarPonitData[item] == 1){
												_this[item].push(oCarPonitData);
												oCarPonitData.alarmArr.push(item)
											}
										});


									}
									else if (oResData.FSpeed == 0&& oResData.FEngine==1) {
										//怠速
										oCarPonitData.type = 16;
										_this.idlingData.push(oCarPonitData)
									}
									else if (oResData.FSpeed == 0) {
										//停车
										oCarPonitData.type = 2;
										_this.stopCarData.push(oCarPonitData)
									}
									else {
										//运行
										_this.runCarData.push(oCarPonitData)
									}

									 _this.allCarData.push(oCarPonitData);

									//车辆坐标集合
									if (oCarPonitData.point.lng != 0 && oCarPonitData.point.lat != 0) {
										points.push(oCarPonitData.point);

									} else {
										 _this.allCarData[i].address = "_无定位_"
									}

								}
								console.log("1111",_this.allCarData);
								_this.$refs.map.getLatelyData(_this.allCarData, points)
								setTimeout(() => {
									_this.$refs.map.showFences(_this.showFenceArr);
								}, 0);
								if (callback != null && callback != "") callback();
								//  将无数据的车辆填充进入离线车辆列表
							}
							//console.log("服务器返回车辆数据",_this.allCarData);
							_this.showDataList = [];
							switch (_this.carDataType) {
								case 0: //全部数据
									_this.showDataList = _this.allCarData
									break;
								case 1: //运行数据
									_this.showDataList = _this.runCarData
									break;
								case 2://停车数据
									_this.showDataList = _this.stopCarData
									break;
								case 3://离线数据
									_this.showDataList = _this.outlineCarData
									break;
								case 4://报警数据
									_this.showDataList = _this.alarmCarData
									break;
								case 5://疲劳驾驶报警
									_this.showDataList = _this.alarmFatigue
									break;
								case 6://超速报警
									_this.showDataList = _this.alarmOverSpeed
									break;
								case 7://道路偏移报警
									_this.showDataList = _this.alarmOffsetRoad
									break;
								case 8://温度报警
									_this.showDataList = _this.alarmTemperature
									break;
								case 9://绳索异常报警
									_this.showDataList = _this.alarmFLockRope
									break;
								case 10://低电量报警
									_this.showDataList = _this.FAlarmLowPower
									break;
								case 11://后盖异常
									_this.showDataList = _this.unCoverBack
									break;
								case 12://长时间未锁
									_this.showDataList = _this.longTimeOpened
									break;
								case 13://五次连续错误密码
									_this.showDataList = _this.fivePasswordError
									break;
								case 14://刷非法卡
									_this.showDataList = _this.illegalCard
									break;
								case 15://禁区开锁
									_this.showDataList = _this.forbiddenAreaOpen
									break;
								case 16://怠速
									_this.showDataList = _this.idlingData
									break;
							};
							if(_this.sortObj.prop!=null) _this.sortChange(_this.sortObj);
							if(_this.showDataList.length!=0) _this.getGeocoder();
							if(!_this.rightListState && _this.statusDataIndex!=null) _this.showStatusList(_this.allCarData[_this.statusDataIndex]);
						}
				});
				let timeout=setTimeout(_this.getCarIdData,_this.refreshInterva);

			},
			//转换GPS信号
			parseGPS(gps){
				if(gps<=2 || gps==null){
					return 0
				}else if(gps>=3 && gps<=5){
					return 1
				}else if(gps>=6 && gps<=8){
					return 2
				}else if(gps>=9 && gps<=12){
					return 3
				}else if(gps>=13){
					return 4
				};

			},
			//转换GSM信号
			parseGSM(gsm){
				if(gsm<=0 || gsm==null){
					return 0
				}else if(gsm>=1 && gsm<=8){
					return 1
				}else if(gsm>=8 && gsm<=15){
					return 2
				}else if(gsm>=16 && gsm<=21){
					return 3
				}else if(gsm>=22){
					return 4
				};fd

			},

			//请求车辆地址
			getAddress(data){
				//console.log('位置', data);
				_this.geocoder(this.mapType, data.point, data, 'address')
			},
			//显示所选车辆位置
			showCarPlace(data, index){
				if(typeof data[index].markerIndex==="undefined") {
					_this.$refs.map.showError("_暂无定位信息_!");
					_this.rightListState=true;
					_this.statusData=null;
					_this.statusDataIndex=null;
					_this.$refs.map.showCarPlace();
					return;
				}
				let lng = data[index].point.lng,
					lat = data[index].point.lat;
				_this.rightListState=false;
				this.statusDataIndex=data[index].markerIndex;
				if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90 && lng != 0 && lat != 0) {
					_this.$refs.map.showCarPlace(data[index]);
					_this.changeActive(data, index);
				} else {
					_this.$refs.map.showError("_暂无定位信息_!");
					_this.$refs.map.showCarPlace();
				}

			},
			//显示车辆列表
			showCarDataList(type){
				_this.carDataType = type;
				switch (type) {
					case 0: //全部数据
						_this.isShowAlarmType = false;
						_this.showDataList =_this.deepCopy(_this.allCarData);
						break;
					case 1: //运行数据
						_this.isShowAlarmType = false;
						_this.showDataList = _this.deepCopy(_this.runCarData);
						break;
					case 2://停车数据
						_this.isShowAlarmType = false;
						_this.showDataList = _this.deepCopy(_this.stopCarData);
						break;
					case 3://离线数据
						_this.isShowAlarmType = false;
						_this.showDataList = _this.deepCopy(_this.outlineCarData);
						break;
					case 4://报警数据
						_this.isShowAlarmType = !_this.isShowAlarmType;
						_this.showDataList = _this.deepCopy(_this.alarmCarData);
						break;
					case 5://疲劳驾驶报警
						_this.showDataList = _this.deepCopy(_this.alarmFatigue);
						break;
					case 6://超速报警
						_this.showDataList = _this.deepCopy(_this.alarmOverSpeed);
						break;
					case 7://道路偏移报警
						_this.showDataList = _this.deepCopy(_this.alarmOffsetRoad);
						break;
					case 8://温度报警
						_this.showDataList = _this.deepCopy(_this.alarmTemperature);
						break;
					case 9://绳索报警
						_this.showDataList = _this.deepCopy(_this.alarmFLockRope);
						break;
					case 10://低电量报警
						_this.showDataList = _this.deepCopy(_this.FAlarmLowPower);
						break;
					case 11://后盖异常
						_this.showDataList = _this.deepCopy(_this.unCoverBack);
						break;
					case 12://长时间未锁
						_this.showDataList = _this.deepCopy(_this.longTimeOpened);
						break;
					case 13://五次连续错误密码
						_this.showDataList = _this.deepCopy(_this.fivePasswordError);
						break;
					case 14://刷非法卡
						_this.showDataList = _this.deepCopy(_this.illegalCard);
						break;
					case 15://禁区开锁
						_this.showDataList = _this.deepCopy(_this.forbiddenAreaOpen);
						break;
					case 16://怠速
						_this.isShowAlarmType = false;
						_this.showDataList = _this.deepCopy(_this.idlingData);
						break;
				}
				if(_this.showDataList.length!=0) _this.getGeocoder()
			},

			//修改statusDataIndex
			changeStatusDataIndex(index){
				this.statusDataIndex=index;
			},
			//状态栏报警状态图标按报警状态更改
			changeAlarmStatusList(data){
				console.log("报警类型",data.alarmArr);
				let arr=null;
				// if(_this.systemID===2||_this.systemID===7){
				// 	arr=_this.LockStatusBarAlarm
				// }else if(_this.systemID===1||_this.systemID===4){
				// 	arr=_this.carStatusBarAlarm
				// }else {
				// 	return
				// }
        arr = _this.AlarmCollection
        _this.ALLNotAlarm = true
				for (let i = 0; i < arr.length; i++) {
					let item=arr[i];

					if(data.alarmArr.indexOf(item.fields)!=-1){
						item.status=1
            _this.ALLNotAlarm = false
					}else {
						item.status=0
					}
				}
				arr.sort(function(a,b){
					return b.status- a.status;
				})


			},
			//显示状态栏
			showStatusList(data){
				_this.changeAlarmStatusList(data);
				_this.statusData=data;
        switch (_this.statusData.FAssetTypeID) {
          case 701:
          case 717:
          case 735:
          case 740:
            _this.EquipmentType = 1  // 电子锁设备
            break;
          case 703:
            _this.EquipmentType = 2 // 接甩锁
            break;
          case 704:
          case 714:
          case 716:
          case 750:
            _this.EquipmentType = 3 // 集装箱
            break;
          case 400:
          case 600:
          case 603:
            _this.EquipmentType = 4 // 车队
            break;
          default:
            break;
        }
				_this.rightListState=false;

				if(_this.systemID===6||_this.systemID==4 ||_this.systemID==1) return;
				setTimeout(function(){
          // 电子锁才有速度图表 2018年7月3日09:27:31
          if(_this.EquipmentType == 1) {
            return  // 速度图表用最新的了。不用这个。n 2018-7-9 09:48:50
            if (_this.chartSpeed == null) {
              _this.chartSpeed = highcharts.chart("speed-wrap", {
                chart: {
                  type: 'gauge',
                  plotBackgroundColor: null,
                  plotBackgroundImage: null,
                  plotBorderWidth: 0,
                  plotShadow: false
                },
                legend: {
                  enabled: false
                },
                credits: {
                  enabled: false
                },
                title: {
                  text: ''
                },
                pane: {
                  startAngle: -150,
                  endAngle: 150,
                  background: [{
                    backgroundColor: {
                      linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                      stops: [
                        [0, '#FFF'],
                        [1, '#333']
                      ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                  }, {
                    backgroundColor: {
                      linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                      stops: [
                        [0, '#333'],
                        [1, '#FFF']
                      ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                  }, {
                    // default background
                  }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                  }]
                },
                // the value axis
                yAxis: {
                  min: 0,
                  max: 200,
                  minorTickInterval: 'auto',
                  minorTickWidth: 1,
                  minorTickLength: 10,
                  minorTickPosition: 'inside',
                  minorTickColor: '#666',
                  tickPixelInterval: 30,
                  tickWidth: 2,
                  tickPosition: 'inside',
                  tickLength: 10,
                  tickColor: '#666',
                  labels: {
                    step: 2,
                    rotation: 'auto'
                  },
                  title: {
                    text: ''
                  },
                  plotBands: [{
                    from: 0,
                    to: 120,
                    color: '#55BF3B' // green
                  }, {
                    from: 120,
                    to: 160,
                    color: '#DDDF0D' // yellow
                  }, {
                    from: 160,
                    to: 200,
                    color: '#DF5353' // red
                  }]
                },
                series: [{
                  name: '_速度_',
                  data: [data.speed],
                  tooltip: {
                    valueSuffix: ' km/h'
                  }
                }]
              });  //
            } else {
              _this.chartSpeed.series[0].points[0].update(data.speed);
            }
          }
					/*if(_this.systemID!=4) return;
					let oil=data.fuelValue.length!=0?data.fuelValue[0].value:0;
					if(_this.chartOil==null){
						_this.chartOil=highcharts.chart('oil-wrap', {
							chart: {
								type: 'solidgauge'
							},
							title: null,
							pane: {
								center: ['50%', '65%'],
								size: '95%',
								startAngle: -90,
								endAngle: 90,
								background: {
									backgroundColor: '#EEE',
									innerRadius: '60%',
									outerRadius: '100%',
									shape: 'arc'
								}
							},
							yAxis: {
								stops: [
									[0.1, '#DF5353'], // red
									[0.5, '#DDDF0D'], // yellow
									[0.9, '#55BF3B']  // green
								],
								lineWidth: 0,
								minorTickInterval: null,
								tickPixelInterval: 100,
								tickWidth: 0,
								title: {
									y: -70
								},
								labels: {
									y: 16
								},
								min: 0,
								max: 400,
								title: {
									text: ''
								}
							},
							plotOptions: {
								solidgauge: {
									dataLabels: {
										y: 30,
										borderWidth: 0,
										useHTML: true
									}
								}
							},
							credits: {
								enabled: false
							},
							series: [{
								name: '_油位_',
								data: [oil],
								dataLabels: {
									format: '<div style="text-align:center"><span style="font-size:20px;color:' +
									('black') + '">{y}</span><br/>' +
									'<span style="font-size:12px;color:silver">L</span></div>'
								},
								tooltip: {
									valueSuffix: ' L'
								}
							}]
						});
					}else{
						_this.chartOil.series[0].points[0].update(oil);
					}*/

				},300)

			},

			//点击绑定图标
			beforebingVehicle(data){
				//console.log(data)
				_this.choiceAssetData=data;
				_this.FVehicleGUID=null;
				_this.FAssetGUID = data.FAssetGUID;
				_this.FAssetID = data.assetID;
				_this.FVehicleName = data.FVehicleName;
			},
			//选择绑定车辆后  点击确定
			bingVehicle(){

				if(_this.FVehicleGUID==null){
					_this.$message({
						message: '_请选择车辆_/_箱号_',
						type: 'warning'
					})
					return
				}

				let postData = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "UpdateBoundingVehicle",
					FAssetGUID: _this.FAssetGUID,
					FVehicleGUID: _this.FVehicleGUID,
					FVersion: "1.0.0"
				}
				$.ajax({
					"url": "/web/Lock/Lock_SmartLock",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (json) {
						//console.log(json)
						if(json.Result==200){
							$("#modal").modal("hide");
							_this.$message({
								message: '_修改成功_',
								type: 'success'
							});
							//更新下部列表数据
							_this.choiceAssetData.FVehicleName=_this.FVehicleName;
							_this.choiceAssetData.FVehicleGUID=_this.FVehicleGUID;
							//更新树形图数据

							_this.treeData[0].children.map(function(item,index){
								if(item.id==_this.FAssetGUID){
									item.subLabel=_this.FVehicleName;
									item.FVehicleGUID=_this.FVehicleGUID;
									return;
								}
							})


						}else{
							_this.$message({
								message: '_修改失败_',
								type: 'error'
							})
						}
					},
					error: function () {

					}
				})
			},
			//打开开锁窗口
			openLockBox(obj){
				_this.$refs.openLock.openLockBox(obj.assetID,obj.ID);
			},
			//显示车辆详情
			showCarInfo(ID){
				_this.$refs.map.showCarInfo(ID);
			},
			//获取胎压数据
			getCarTireData(obj){
				this.tireData= {    //初始轮胎数据
					ID: null,
					time: null,
					data: []
				};
				let tireData=this.tireData;
				console.log("胎温胎压",obj)
				let json = JSON.parse(obj.FTyreContent);
				//console.log(json);
				tireData.ID =obj.assetID;
				tireData.time = obj.time;
				for (var i = 0; i < json.length; i++) {
					let obj = json[i];
					let arr = obj.S.split(',');
					let state = "";
					if (arr.indexOf('LB') != -1) state += "_低电量_; ";
					//if(arr.indexOf('BN')!=-1) state+="_电量正常_";
					if (arr.indexOf('PN') != -1) state += "_胎压正常_; ";
					if (arr.indexOf('HP') != -1) state += "_高胎压_; ";
					if (arr.indexOf('LP') != -1) state += "_低胎压_; ";
					if (arr.indexOf('LE') != -1) state += "_急泄漏_; ";
					if (arr.indexOf('L') != -1) state += "_泄露_; ";
					if (arr.indexOf('TN') != -1) state += "_胎温正常_; ";
					if (arr.indexOf('HT') != -1) state += "_高胎温_; ";
					obj.state = state
				}
				tireData.data = json;

			},
			//选择绑定车辆
			handleNodeClick(data){
				if (data.id.indexOf("@B") != -1 || data.id.indexOf("@A") != -1 || data.id.indexOf("@C") != -1) return;

				this.FVehicleName = data.subLabel; // 点击获取车牌而非终端号
				this.FVehicleGUID = data.VehicleID; // 改为车辆唯一标识而非终端唯一标识

			},
			//elementUI 树形结构将数据解析成html
			renderContent(h, { node, data, store }){ // 修改终端绑定的车辆树形列表
				return (
					<span>
						<i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A")!=-1}></i>
						<i class="fa fa-building icon" v-show={data.id.indexOf("@B")!=-1}></i>
						<i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C")!=-1}></i>
						<i class="fa fa-truck icon"
						   v-show={data.id.indexOf("@B")==-1&data.id.indexOf("@A")==-1&data.id.indexOf("@C")==-1}></i>
						{data.subLabel==""?"--":data.subLabel}
						<span style="margin-left:10px"
							  v-show={data.id.indexOf("@B")!=-1||data.id.indexOf("@A")!=-1||data.id.indexOf("@C")!=-1}>
							({data.count})
						</span>
					</span>
				)
			},

			showFence(obj){
				if (!obj.FBindFenceCount) {
					return
				}
				$.ajax({
					url: "/web/Combine/Combine_LBS",
					cache: false,
					async: true,
					type: 'Post',
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					global: false,
					data: '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"QueryLBSGISUnLockFenceByFAssetGUID",FAssetGUID:"'+obj.FAssetGUID+'",FVersion:"1.0.0"}',
					success: function (res) {
						_this.showFenceArr=[];
						$.each(res.FObject,function (index,obj) {
							$.each(_this.fenceObj['all'],function (i,item) {
								if (obj.FFenceGUID===item.ID) {
									item.index=i;
									_this.showFenceArr.push(item)
								}
							})
						});
						_this.$refs.map.showFences(_this.showFenceArr)
					},
					error:function(){

					}
        		})
			},
			//车辆绑定列表 过滤规则
			filterNode1(value, data) {
				if (!value) {
					return true;
				}
				return data.label.indexOf(value) !== -1;
			},

		},
		computed: {
			systemID:{
				get () {
					return this.$store.state.choiceSystemID
				}
			},
			remoteUnlockLimits:{
				get (){
					return this.$store.state.remoteUnlockLimits
				}
			} ,
			//车辆树形图数据
			treeData: {
				get () {
					if(_this.treeLoading!=null) _this.treeLoading.close();
					return _this.deepCopy(this.$store.state.allCarsData)
				}
			},
			//车辆ID数据
			treeID: {
				get () {
					return _this.deepCopy(this.$store.state.allCarsID)
				}
			},
			//树形图列表所有车辆容器
			allCarsArr: {
				get () {
					return _this.deepCopy(this.$store.state.allCarsList)
				}
			},
			//获取地理类型
			mapType:{
				get () {
					return this.$store.state.mapType
				}
			},
			//下侧列表显示数据
			filterCarName: {
				get (){
					var name = this.searchCarName;
					var list = this.showDataList;
					let n=-1;
					return list.filter(function (item) {
						if(name=="") {
							n++;
							if(n<=_this.endIndex+2) return true
						}else {
							let a = false, b = false;
							if (item.FVehicleName != '' && item.FVehicleName != null && item.FVehicleName.toUpperCase().indexOf(name.toUpperCase()) != -1) a = true;
							if (item.assetID && item.assetID.toUpperCase().indexOf(name.toUpperCase()) != -1) b = true;
							let isShow=false;
							if(_this.systemID===2){
								if (a || b) {
									isShow=true;
									n++
								}

							}else{
								if (a) {
									isShow=true;
									n++
								}
							};
							if(isShow  && n<=_this.endIndex+2) return true;
						}
					});

				}
			},
			fenceObj: {//围栏分组对象
				get(){
					return this.$store.state.fenceTeamObj
				}
			},
		},
		deactivated(){
			this.isLoadTreeDom=false;
			//组件停用时 停止定时器
			if (_this.intervalGetData===true) _this.intervalGetData=false;
			//if (_this.intervalGetData != null) clearInterval(_this.intervalGetData);
			if(_this.treeIDArr.length!=0){
				_this.ExitStatusID=_this.treeIDArr
			}else {
				_this.ExitStatusID.length=0;
			}


			_this.isGetTreeData=false;
			setTimeout(function () {
				_this.isGetTreeData=true;
				//console.log("要刷新")
			},1000*60*3)

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
							//console.log("disy",disy)
							//var w = fatherDiv.offsetWidth;
							var h = fatherDiv.offsetHeight + oscrolltop;
							//console.log("h",h)
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
								//console.log(fatherDiv.offsetHeight,y)
								if (y <= $("#map-tool").height()) {
									$("#map-tool").hide()
								} else {
									$("#map-tool").show()
								}
								$("#contentList").height(newHeight + 'px');
								let h1 = $('#myTab').height();

								_this.maxHeight=newHeight - h1;
								//console.log(_this.maxHeight);
								/*$("#table-wrap").slimScroll({
								 //width: 'auto', //可滚动区域宽度
								 height: newHeight - h1 - h2 + 'px', //可滚动区域高度
								 size: '10px', //组件宽度
								 color: '#00aff0', //滚动条颜色
								 position: 'right', //组件位置：left/right
								 distance: '0px', //组件与侧边之间的距离
								 start: 'top', //默认滚动位置：top/bottom
								 opacity: .6, //滚动条透明度
								 alwaysVisible: false, //是否 始终显示组件
								 disableFadeOut: true, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
								 railVisible: true, //是否 显示轨道
								 railColor: '#333', //轨道颜色
								 railOpacity: .2, //轨道透明度
								 railDraggable: true, //是否 滚动条可拖动
								 railClass: 'slimScrollRail', //轨道div类名
								 barClass: 'slimScrollBar', //滚动条div类名
								 wrapperClass: 'slimScrollDiv', //外包div类名
								 allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
								 wheelStep: 20, //滚轮滚动量
								 touchScrollStep: 200, //滚动量当用户使用手势
								 borderRadius: '7px', //滚动条圆角
								 railBorderRadius: '7px' //轨道圆角
								 });*/

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
		}
	}
</script>
<style>
	#myTab{
		height:35px;
	}
	.map-template .map-dialog {
		margin-top:150px;
		width:500px;
	}
	.modal-header{
		background-color:#1970cf;
	}
	.map-template .map-dialog .el-tree {
		height:450px;
		overflow-y:scroll;
	}

	/*elementUI 下部列表样式*/
	.tab-content .el-table th{
		border-top:none;
	}
	.tab-content .el-table th>.cell{
		text-align:center;
		background-color:#bfdefb;
	}
	.tab-content .el-table th>.cell,.tab-content .el-table td>.cell{
		overflow:hidden;
		white-space:nowrap;
	}
	.tab-content .el-table td,.tab-content .el-table th{
		border-color:#ccc;
		font-size:12px;
	}
	.icon-key {
		background-position:-16px -202px;
	}
	.no-icon-key{
		background-position:0 -202px;
	}
	.monitor-icon {
		display:inline-block;
		width:16px!important;
		height:16px!important;
		margin-right:5px;
	}
	.icon-info {
		font-size:14px;
		background-position:-32px -202px;
	}
	.track-info {
		font-size:14px;
		background-position:-125px -202px;
	}
	.search-car-name-icon {
		float:left;
		margin:8px 5px 0 8px;
		font-size:20px;
		color:#fff;
		cursor:pointer;
	}

	.search-car-name-input {
		float:left;
		margin-top:6px;
	}
	.list-name{
		width:100%;
		height:100%;
		text-decoration:underline;
		cursor:pointer;
	}
	/* 电子锁姿态异常图片中文字定位样式 start */
	.pose-wrap{
		position:relative;
		height:360px;
		width:320px;
		margin-left:35px;
	}
	.pose-wrap p{
		position:absolute;
		padding:2px 5px;
		border-radius:3px;
		font-size:12px;
		color:#fff;
		background-color:#4285F4;
	}
	.pose-wrap .top-left{
		top:18px;
		left:15px;
	}
	.pose-wrap .top-right{
		top:18px;
		left:178px;
	}
	.pose-wrap .bom{
		top:111px;
		left:15px;
	}
	/* 电子锁姿态异常图片中文字定位样式 end */
	/* 字段选择弹框 */
	.settingDialog .el-dialog__body{
		padding:30px 40px;
	}
	.monitor-table-icon{
		display: inline-block;
		width: 20px;
		height: 20px;
		position: relative;
		top: 4px;
	}
	.settingDialog .el-dialog__body .el-checkbox-group label:nth-child(odd){
		width:260px;
	}
	.monitor-setting{
		background: url(/static/img/LBS/monitor_setting_icon.png);
		cursor: pointer;
	}
	.monitor-warning-icon{
		background: url(/static/img/LBS/monitorinform_icon.png);
		top: 8px;
		margin-right: 20px
	}
	/* 字段选择状态图标 */
	.statu-icon{
		display: inline-block;
		width:16px;
		height: 16px;
		position: relative;
		top: 4px;
		margin-right: 4px;
		background-image: url("/static/img/LBS/status.png");
	}
	.FLocationType{
		background-position: -112px 0px;
	}
	.FSpeed{
		background-position: -80px -16px;
	}
	.FMileage{
		background-position: -16px -16px;
	}
	.FBatteryPercent{
		background-position: -80px 0px;
	}
	.FBindFenceCount{
		background-position: -48px -32px;
	}
	.FLockStatus{
		background-position: -96px -16px;
	}
	.FBoxLoadedStatus{
		background-position: 0px -16px;
	}
	.FTemperature{
		background-position: -144px -16px;
	}
	.FBoxDoorStatus{
		background-position: -128px -16px;
	}
	.FDetail{
		background-position: 0px -32px;
	}
	.FOil{
		background-position: -32px -32px;
	}
	.FSwitchDoorTimes{
		background-position: -144px 0px;
	}
	.FCouplingStatus{
		background-position: -128px 0px;
	}
	.FTireTemperature{
		background-position: -112px -16px;
	}
	.FIsLock{
		background-position: -16px -32px;
	}
	.FVehicleName{
		background-position: 0px 0px;
	}
	.FAssetID{
		background-position: -16px 0px;
	}
	.FAssetTypeID{
		background-position: -48px -16px;
	}
	.FGPSDateTime{
		background-position: -96px 0px;
	}
	.FRecvDateTime{
		background-position: -64px -16px;
	}
	.FAddress{
		background-position: -64px 0px;
	}
	.FAlarm{
		background-position: -32px 0px;
	}


	/*查询列表和状态栏切换按钮样式 start*/
	.status-switch{
		position:absolute;
		top:0;
		left:-16px;
		width:16px;
		height:150px;
		z-index:1500;
		overflow:hidden;
	}
	.status-switch .item{
		position:absolute;
		top:-8px;
		width:100%;
		height:76px;
		cursor:pointer;
		background:url("/static/img/show_carList_bg.png") no-repeat center;
		color:#0059c4;
	}
	.status-switch .item1{
		top:60px;
	}
	.status-switch .active{
		z-index:5;
		background:url("/static/img/show_carList_bg_blue.png") no-repeat center;
		color:#fff;
	}
	.status-switch .item i{
		position:absolute;
		top:30px;
		left:3px;
	}
	/*查询列表和状态栏切换按钮样式 end*/
</style>
<style scoped>


	/*状态栏样式 start*/
	.status-list{
		height:100%;
		width:100%;
		padding:0 10px;
		overflow-y:scroll;
		line-height:22px;
	}
	.border-right{
		/*border-right:1px solid #d9d9d9;*/
	}
	.top-info{
		padding-top:6px;
		padding-bottom:20px;
		border-bottom:1px solid #cccccc
	}
	.top-info p{
		font-size:12px;
		font-weight:bolder;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}
	.top-info .car_name{
		height:35px;
		line-height:35px;
		font-size:20px;
	}
	.top-info .car_address{
		line-height:26px;
	}
	.top-info .left-txt{
		display:block;
		float:left;
		font-weight:bolder;
	}
	.top-info .right-txt{
		display:inline-block;
		padding-left:5px;
		font-weight:bold;
	}
	.time-info{
		padding:15px 0 5px 0;
		margin-bottom:5px;
		border-radius:5px;
		background-color:#ebebeb;
	}
	.time-info div{
		width:50%;
		float:left;
	}
	.time-info .txt{
		line-height:18px;
	}
	.time-info .time{
		line-height:24px;
	}
	.time-info .time span{
		padding:0 3px;
		font-family:"ds-digitalnormal";
		font-size:30px;
		color:#c98242;
	}
  /*车队特有,修改样式*/
	.dashboard{
		padding:5px 0;
		border-radius:5px;
		/*background-color:#19263a;*/
	}
	.dashboard .top{
		height:28px;
		color:#fff;
		padding-top:10px;
		overflow:hidden;
	}
	.dashboard .top>li{
		width:33%;
		float:left;
		position:relative;
	}

	.dashboard .top h6{
		position:absolute;
		top:-3px;
		left:9px;
	}
	.top-signal{
		position:relative;
		top:0;
		left:48px;
		height:14px;
	}
	.top-signal li{
		position:absolute;
		bottom:0;
		width:6px;
		background-color:#ccc;
	}
	.top-signal li:nth-child(1){
		height:4px;
		left:0;
	}
	.top-signal li:nth-child(2){
		height:8px;
		left:8px;
	}
	.top-signal li:nth-child(3){
		height:14px;
		left:16px;
	}
	.top-signal li:nth-child(4){
		height:20px;
		left:24px;
	}
	.top-signal img{
		position:absolute;
		left:-6px;
		top:-2px;
		z-index:2
	}
	.top-signal .bg{
		position:absolute;
		left:-3px;
		bottom:0;
		z-index:1;
		height:13px;
		background-color:#278d36;
	}
  /*电池新图标 -n*/
  .top-signal-3 .bg{
    position:absolute;
    top:7px;
    left:23px;
    bottom:0;
    z-index:1;
    height:10px;
    background-color:#278d36;
  }
	.top-charge{
		animation:top-charge 2s infinite linear;
	}

	@-webkit-keyframes top-charge {
		0%  { width: 0;}
		25% { width: 7px;}
		50% { width: 14px}
		75% { width: 21px}
		100%{ width: 34px;}
	}
	@-o-keyframes top-charge {
		0%  { width: 0;}
		25% { width: 7px;}
		50% { width: 14px}
		75% { width: 21px}
		100%{ width: 34px;}
	}
	@-ms-keyframes top-charge {
		0%  { width: 0;}
		25% { width: 7px;}
		50% { width: 14px}
		75% { width: 21px}
		100%{ width: 34px;}
	}
	@-moz-keyframes top-charge {
		0%  { width: 0;}
		25% { width: 7px;}
		50% { width: 14px}
		75% { width: 21px}
		100%{ width: 34px;}
	}
	@keyframes top-charge {
		0%  { width: 0;}
		25% { width: 7px;}
		50% { width: 14px}
		75% { width: 21px}
		100%{ width: 34px;}
	}
	.dashboard .mid{
		position:relative;
		padding-top:17px;
	}
	.dashboard .mid .item{
		width:50%;
		float:left;
	}
	.dashboard .mid .wrap{
		position:relative;
		left:2px;
		width:130px;
		height:95px;
		background:url("/static/img/status/speed.png") no-repeat;
		background-size:cover;
	}
	.dashboard .mid .oil{
		background:url("/static/img/status/oil.png") no-repeat;
		background-size:cover;
	}
	.dashboard .mid .wrap span{
		position:absolute;
		top:85px;
		left:41px;
		display:block;
		width:48px;
		height:20px;
		line-height:20px;
		text-align:center;
		background-color:#df8931;
		font-family:"ds-digitalnormal";
		font-size:24px;
		color:#fff;
	}
	.dashboard .mid  .txt{
		margin-top:12px;
		padding-left:5px;
		height:25px;
		line-height:25px;
		font-size:12px;
		color:#1c80dd;
	}
	.dashboard .mid  .txt span{
		padding:0 3px;
		font-family:"ds-digitalnormal";
		font-size:17px;
		color:#fff;
	}
	.dashboard .mid  .olitxt{
		padding-left:20px;
	}

	.dashboard .long-pointer{
		position:absolute;
		top:13px;
		left:62px;
		width:4px;
		height:106px;
		background:url("/static/img/status/long-pointer.png") no-repeat;
		background-size:contain;

		-webkit-transition:all .6s;
		-moz-transition:all .6s;
		-ms-transition:all .6s;
		-o-transition:all .6s;
		transition:all .6s;
		-ms-transform:rotate(-112deg); 	/* IE 9 */
		-moz-transform:rotate(-112deg); 	/* Firefox */
		-webkit-transform:rotate(-112deg); /* Safari 和 Chrome */
		-o-transform:rotate(-112deg);
		transform:rotate(-112deg);
	}

	.dashboard .mid .compass{
		position:absolute;
		left:110px;
		top:0;
		width:50px;
		height:50px;
		background:url("/static/img/status/new_conpass.png") no-repeat;
		background-size:cover;
	}
	.dashboard .mid .compass .pointer{
		position: absolute;
		top: 9px;
		left: 22px;
		width: 7px;
		height: 33px;
		background:url("/static/img/status/pointer.png") no-repeat;
		background-size:contain;

		-ms-transform:rotate(0deg); 	/* IE 9 */
		-moz-transform:rotate(0deg); 	/* Firefox */
		-webkit-transform:rotate(0deg); /* Safari 和 Chrome */
		-o-transform:rotate(0deg);
		transform:rotate(0deg);
	}
	.dashboard .btm{
		margin-left:5%;
		width:90%;
		height:30px;
		border-radius:5px;
		background-color:rgba(255,255,255,.2);
	}
	.dashboard .btm li{
		float:left;
		margin:3px 6px;
		width:24px;
		height:24px;
		background:url("/static/img/status/state.png") no-repeat;
	}
	.dashboard .btm li:nth-child(2){background-position:-24px 0}
	.dashboard .btm li:nth-child(3){background-position:-48px 0}
	.dashboard .btm li:nth-child(4){background-position:-72px 0}
	.dashboard .btm li:nth-child(5){background-position:-96px 0}

	.dashboard .btm li:nth-child(1).active{background-position:0 -24px}
	.dashboard .btm li:nth-child(2).active{background-position:-24px -24px}
	.dashboard .btm li:nth-child(3).active{background-position:-48px -24px}
	.dashboard .btm li:nth-child(4).active{background-position:-72px -24px}
	.dashboard .btm li:nth-child(5).active{background-position:-96px -24px}
	.trip{
		height:25px;
	}
	.trip-left{
		/*text-align:right;*/
		padding-right:5px;
		font-weight:bolder;
	}
	.trip-right{
		text-align:center;
		font-family:"ds-digitalnormal";
		font-size:28px;
		color:#0e38be;
		cursor:pointer;
	}
	.status-text li{
		width:45px;
		height:45px;
		float:left;
		margin-right:4px;
		line-height:45px;
		border-radius:3px;
		/*background-color:#e6e6e6;*/
		/*border:1px solid #ccc;*/
		font-size:12px;
		text-align:center;
	}
	.status-text li p{
		display:inline-block;
		line-height:25px;
	}
	.bg-active{
		background-color:#16b03d!important;
		color:#fff;
	}
	.bg-alarm{
		background-color:#d92323 !important;
		color:#fff;
	}
	.status-text li:last-child{
		margin-right:0;
	}
	.status-list .title{
		width:100%;
		height:40px;
		line-height:40px;
		margin:3px 0;
		padding-left:5px;
		-webkit-border-radius:3px;
		-moz-border-radius:3px;
		border-radius:3px;
    font-weight: bolder;
		/*background-color: #2592e2b5;*/
		background: linear-gradient(to right, #248eff,#248eff 20%,#248eff 5%, #f7fbfd);;
		background: -webkit-linear-gradient(to right, #248eff,#248eff 20%,#248eff 5%, #f7fbfd);
		background: -o-linear-gradient(to right, #248eff,#248eff 20%,#248eff 5%, #f7fbfd);;
		background: -ms-linear-gradient(to right, #248eff,#248eff 20%,#248eff 5%, #f7fbfd);;
		background: linear-gradient(to right, #248eff,#248eff 20%,#248eff 5%, #f7fbfd);;
    /*background:-webkit-gradient(linear, lefft, left bottom, color-stop(0%, #36ce1d), color-stop(100%, #1e9c40));*/
    /*background:-webkit-linear-gradient(top, #36ce1d 0%, #1e9c40 100%);*/
    /*background:-o-linear-gradient(top, #36ce1d 0%, #1e9c40 100%);*/
    /*background:-ms-linear-gradient(top, #36ce1d 0%, #1e9c40 100%);*/
    /*background:linear-gradient(to bottom, #36ce1d 0%, #1e9c40 100%);*/了法庭
		color:#ffffff;
	}
	.status-warp{
		width:97%;
		margin-top:5px;
		height:165px;
		/*border:1px solid #d5d5d5;*/
		overflow:hidden;
		position:relative;
		text-align:center;
	}
	.task-warp{
		width:97%;
		margin-top:5px;
		height:50px;
		border:1px solid #d5d5d5;
		overflow:hidden;
		position:relative;
		text-align:center;
	}

	.ml-5{
		margin-left:5px;
	}
	.status-warp h6{
		position:absolute;
		z-index:5;
		padding-left:3px;
		font-size:12px;
		font-weight:bolder;
	}
	.status-warp p{
		position:absolute;
		bottom:0;
		z-index:5;
		width:100%;
		padding-left:3px;
		font-size:12px;
		line-height:15px;
	}
	.status-warp strong{
		display:block;
		text-align:left;
	}
	.status-number{
		font-family:"ds-digitalnormal";
		font-size:24px;
		padding:0 2px;
	}
	.speed-wrap{
		position:absolute;
		left:-13px;
		top:-13px;
		width:154px;
		height:178px;
		-webkit-transform:scale(.85);
		-moz-transform:scale(.85);
		-ms-transform:scale(.85);
		-o-transform:scale(.85);
		transform:scale(.85);
	}
	.status-warp .lock-status{
		margin-top:20px;
		font-size:7em;
	}
	.ml-5 strong{
		line-height:25px;
	}
	.lock-warp{
		position:absolute;
		top:30px;
		left:20px;
		display:block;
		width:88px;
		height:100px;
	}
	.sub-warp{
		height:100px;
		border:none;
	}
	.sub-warp .inner{
		position:absolute;
		top:14px;
		/*left:10px;*/
		width:80px;
		height:80px;
	}
	.compass{

		background:url("/static/img/status/conpass_bg.png") no-repeat;
		background-size:cover;
	}
	.compass .pointer{
		position:absolute;
		top:12px;
		left:34px;
		width:12px;
		height:56px;
		background:url("/static/img/status/pointer.png") no-repeat;
		background-size:contain;

		-ms-transform:rotate(0deg); 	/* IE 9 */
		-moz-transform:rotate(0deg); 	/* Firefox */
		-webkit-transform:rotate(0deg); /* Safari 和 Chrome */
		-o-transform:rotate(0deg);
		transform:rotate(0deg);
	}
	.signal{
		position:relative;
	}
	.signal h6{
		position:absolute;
		top:11px;
		left:0;
	}
	.signal ul{
		position:relative;
		top:0;
		left:33px;
		width:45px;
		height:37px;
	}
	.signal ul li{
		position:absolute;
		bottom:0;
		width:8px;
		background-color:#ccc;
	}
	.signal ul li:nth-child(1){
		height:9px;
		left:0;
	}
	.signal ul li:nth-child(2){
		height:18px;
		left:12px;
	}
	.signal ul li:nth-child(3){
		height:27px;
		left:24px;
	}
	.signal ul li:nth-child(4){
		height:36px;
		left:36px;
	}
	.inner .txt{
		position:absolute;
		/*top:24px;*/
		top:1px;
		left:-11px;
		display:block;
		width:38px;
		text-align:center;
		font-size:18px;
	}
	.inner .charge-icon{
		position:absolute;
		top:-1px;
		left:27px;
		width:25px;
		height:31px;
		background:url(/static/img/status/charge.png) no-repeat;
	}
	.inner .battery_bg{
		position:absolute;
		left:23px;
		bottom:5px;
		z-index:-1;
		width:34px;
		background-color:rgba(106,183,45,.8);
	}
	.battery-green{
		background-color:#09bb0c!important;
	}
	.battery-yellow{
		background-color:#de880b!important;
	}
	.battery-red{
		background-color:#f56b68!important;
	}
	.charge{
		animation:charge 2s infinite linear;
	}

	@-webkit-keyframes charge {
		0%  { height: 0;}
		25% { height: 17px;}
		50% { height: 34px}
		75% { height: 51px}
		100%{ height: 70px;}
	}
	@-o-keyframes charge {
		0%  { height: 0;}
		25% { height: 17px;}
		50% { height: 34px}
		75% { height: 51px}
		100%{ height: 70px;}
	}
	@-ms-keyframes charge {
		0%  { height: 0;}
		25% { height: 17px;}
		50% { height: 34px}
		75% { height: 51px}
		100%{ height: 70px;}
	}
	@-moz-keyframes charge {
		0%  { height: 0;}
		25% { height: 17px;}
		50% { height: 34px}
		75% { height: 51px}
		100%{ height: 70px;}
	}
	@keyframes charge {
		0%  { height: 0;}
		25% { height: 17px;}
		50% { height: 34px}
		75% { height: 51px}
		100%{ height: 70px;}
	}
	.temperature-text li{
		float:left;
		width:63px;
		height:25px;
		line-height:25px;
		text-align:center;
	}
	.temperature-text li span{
		font-family:"ds-digitalnormal";
		font-size:28px;
		color:#00b700;
	}

	.container-info{
		padding:20px 0 0 10px;
	}
	.container-info p{
		line-height:35px;
		font-size:16px;
		font-weight:bolder;
	}
	.container-info span{
		font-size:15px;
	}
	.container-status{
		text-align:center;
	}
	.container-status span{
		font-weight:bolder;
	}
	.container-list{
		margin:10px 0;
		padding:5px 5px 5px 20px;
		border:1px solid #ccc;
		-webkit-border-radius:3px;
		-moz-border-radius:3px;
		border-radius:3px;
		box-shadow:0 0 10px #333;
	}
	.container-list li{
		position:relative;
		line-height:30px;
		border-bottom:1px solid #ccc;
	}
	.container-list li span{
		font-weight:bolder;
	}
	.container-list li i{
		position:absolute;
		top:10px;
		left:-15px;
		color:#ccc;
	}
	.tem-text{
		line-height:35px;
		font-size:50px;
		font-family:"ds-digitalnormal";

	}
	.tem-text span{
		font-size:18px;
	}

	/*状态栏样式 end*/

	.bingCar {
		position:absolute;
		top:150px;
		width:470px;
		text-align:center;
	}

	.bingCar p {
		line-height:40px;
	}

	.bingCar .el-icon-warning {
		font-size:35px;
		color:#c87f0a;
	}

	.bingCar button {
		background:white;
		border:1px solid #1a70ce;
		color:#1a70ce;
		width:120px;
		height:26px;
	}

	.text-nowrap-165 {
		display:block;
		max-width:320px;
		padding-left:5px;
		word-break:keep-all;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
	}

	@media (max-width:1800px) {
		.text-nowrap-165 {
			max-width:165px;
		}
	}

	@media (min-width:1800px) and (max-width:1920px) {
		.text-nowrap-165 {
			max-width:265px;
		}
	}



	#contentList .nav > li a {
		padding:0 12px 0 17px;
		margin:0;
		border:none;
	}

	.alarmType {
		position:absolute;
		bottom:128%;
		left:-33px;
		z-index:1000;
		min-width:150px;
		border:1px solid #ccc;
		font-size:14px;
		-webkit-box-shadow:0 6px 12px rgba(0, 0, 0, .175);
		box-shadow:0 6px 12px rgba(0, 0, 0, .175);
	}

	.alarmType:after {
		content:"";
		position:absolute;
		left:60px;
		bottom:-20px;
		width:0;
		height:0;
		border:10px solid transparent;
		border-top-color:#fff;
	}

	.alarmType p {
		position:relative;
		box-sizing:content-box;
		height:35px;
		line-height:35px;
		border-bottom:1px solid #ccc;
		padding-left:28px;
		text-align:left;
		background-color:#fff;
		color:#666;
		cursor:pointer;
		white-space:nowrap;
	}

	.alarmType .monitor-icon {
		position:absolute;
		top:10px;
		left:5px;
	}

	.alarmType p:last-child {
		border:0;
	}

	.alarmType p:hover {
		background-color:#6699d1;
		color:#fff;
	}

	.square {
		position:absolute;
		left:10px;
		top:13px;
		display:inline-block;
		width:15px;
		height:15px;
		border-radius:3px;
	}

	.bg-white {
		background:#f9f9f9;
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#f9f9f9', gradientType=0);
		background:-moz-linear-gradient(top, #fff 0%, #f9f9f9 100%);
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #fff), color-stop(100%, #f9f9f9));
		background:-webkit-linear-gradient(top, #fff 0%, #f9f9f9 100%);
		background:-o-linear-gradient(top, #fff 0%, #f9f9f9 100%);
		background:-ms-linear-gradient(top, #fff 0%, #f9f9f9 100%);
		background:linear-gradient(to bottom, #fff 0%, #f9f9f9 100%);
	}

	.bg-green {
		background:#0f970f;
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#a8e49e', endColorstr='#0f970f', gradientType=0);
		background:-moz-linear-gradient(top, #a8e49e 0%, #0f970f 100%);
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #fff), color-stop(100%, #0f970f));
		background:-webkit-linear-gradient(top, #a8e49e 0%, #0f970f 100%);
		background:-o-linear-gradient(top, #a8e49e 0%, #0f970f 100%);
		background:-ms-linear-gradient(top, #a8e49e 0%, #0f970f 100%);
		background:linear-gradient(to bottom, #a8e49e 0%, #0f970f 100%);

	}

	.bg-orange {
		background:#ce851d;
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#faaa39', endColorstr='#ce851d', gradientType=0);
		background:-moz-linear-gradient(top, #faaa39 0%, #ce851d 100%);
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #faaa39), color-stop(100%, #ce851d));
		background:-webkit-linear-gradient(top, #faaa39 0%, #ce851d 100%);
		background:-o-linear-gradient(top, #faaa39 0%, #ce851d 100%);
		background:-ms-linear-gradient(top, #faaa39 0%, #ce851d 100%);
		background:linear-gradient(to bottom, #faaa39 0%, #ce851d 100%);
	}
	.bg-yellow{
		background:#1e9c40;
		/*filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fef18a', endColorstr='#ebc40c', gradientType=0);*/
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#36ce1d', endColorstr='#1e9c40', gradientType=0);
		/*background:-moz-linear-gradient(top, #fef18a 0%, #ebc40c 100%);*/
		/*background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #fef18a), color-stop(100%, #ebc40c));*/
		/*background:-webkit-linear-gradient(top, #fef18a 0%, #ebc40c 100%);*/
		/*background:-o-linear-gradient(top, #fef18a 0%, #ebc40c 100%);*/
		/*background:-ms-linear-gradient(top, #fef18a 0%, #ebc40c 100%);*/
		/*background:linear-gradient(to bottom, #fef18a 0%, #ebc40c 100%);
		background:-moz-linear-gradient(top, #fef18a 0%, #ebc40c 100%);*/
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #36ce1d), color-stop(100%, #1e9c40));
		background:-webkit-linear-gradient(top, #36ce1d 0%, #1e9c40 100%);
		background:-o-linear-gradient(top, #36ce1d 0%, #1e9c40 100%);
		background:-ms-linear-gradient(top, #36ce1d 0%, #1e9c40 100%);
		background:linear-gradient(to bottom, #36ce1d 0%, #1e9c40 100%);
	}
	.bg-red {
		background:#d92323;
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fd8c8c', endColorstr='#d92323', gradientType=0);
		background:-moz-linear-gradient(top, #fd8c8c 0%, #d92323 100%);
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #fd8c8c), color-stop(100%, #d92323));
		background:-webkit-linear-gradient(top, #fd8c8c 0%, #d92323 100%);
		background:-o-linear-gradient(top, #fd8c8c 0%, #d92323 100%);
		background:-ms-linear-gradient(top, #fd8c8c 0%, #d92323 100%);
		background:linear-gradient(to bottom, #fd8c8c 0%, #d92323 100%);

	}

	.bg-grey {
		background:#ccc;
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#c1beb6', endColorstr='#838383', gradientType=0);
		background:-moz-linear-gradient(top, #c1beb6 0%, #838383 100%);
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #c1beb6), color-stop(100%, #838383));
		background:-webkit-linear-gradient(top, #c1beb6 0%, #838383 100%);
		background:-o-linear-gradient(top, #c1beb6 0%, #838383 100%);
		background:-ms-linear-gradient(top, #c1beb6 0%, #838383 100%);
		background:linear-gradient(to bottom, #c1beb6 0%, #838383 100%);

	}

	.number {
		float:left;
		position:relative;
		z-index:1001;
		display:block;
		line-height:15px;
		margin-top:5px;
	}

	.number i {
		height:15px;
		padding:0 3px;
		background-color:#f76a28;
		color:#fff;
		border-radius:5px;
		font-size:12px;
		font-style:normal;
	}

	.infoContent {
		float:right;
		display:block;
		font-size:16px;
		height:35px;
		line-height:35px;
	}

	.alarmTemperature {
		padding:0 8px;
	}

	.lockBtns {
		position: absolute;
		top: 246px;
		font-size: 30px;
		left: 11px;
		z-index: 999;
	}

	.lockBtns button {
		display:block;
		margin-bottom:5px;
		width:50px;
		height:50px;
		border-radius:25px;
	}

	.lockBtns .unlockBtn {
		border:3px solid #005fc6;
		background:white;
		color:#005fc6;
		outline:none;
	}

	.lockBtns .lockBtn {
		background:#005fc6;
		border:3px solid transparent;
		color:white;
		outline:none;
	}

	.unlockBtn:focus, .lockBtn:focus {
		border-color:#60ef23;
	}

	.online-coupling {
		display:block;
		width:64px;
		height:25px;
		margin:2px auto;
		background-position:0 -241px;
	}

	.offline-coupling {
		display:block;
		width:64px;
		height:25px;
		margin:2px auto;
		background-position:0 -265px;
	}

	.online-unCoupling {
		display:block;
		width:64px;
		height:25px;
		margin:2px auto;
		background-position:-64px -241px;
	}

	.offline-unCoupling {
		display:block;
		width:64px;
		height:25px;
		margin:2px auto;
		background-position:-64px -265px;
	}
	.offline-Coupling{
		display:block;
		width:64px;
		height:25px;
		margin:2px auto;
		background-position:-202px -63px;
	}

	.next-station{
		line-height:18px;
		font-size:12px;
	}
	.next-station span{
		padding:0 5px;
	}
	.plan-text{
		height:30px;
		line-height:30px;
	}
	.subName{
		display: inline-block;
		width: 15px;
		height: 18px;
		line-height: 16px;
		text-align:center;
		border:2px solid #333;
	}
	.name-active{
		border:2px solid #000000;
	}
	.set-prop{
		right: 110px;
		color:white;
	}

  /*n*/
  .open-counts{
    height:120px;
    line-height:120px;
    overflow:hidden;
  } /*集装箱开门次数居中*/

  /*状态栏 报警 2字状态修改*/
  .alarm-title{
    display: inline-block;
    width: 50px;
    height: 40px;
    line-height: 40px;
    padding-top: 4px;
  }
  /*状态栏报警图标*/
  .status-text.clearfix{
    line-height: 40px;
  }
  /*电量数字显示部分*/
  .status-number.txt{
    top: 18px;
    left: 17px;
  }
</style>
