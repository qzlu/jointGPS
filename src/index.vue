<!-- index.vue -->
<template>
	<div class="wrapper" id="wrapper">
		<!--密码修改框框-->
		<el-dialog title="_修改密码_" :visible.sync="editpass" size="init">
			<!-- <el-form :model="form"> -->
			<el-form :model="passwordData" :rules="passwordRules" ref="passwordData">
				<el-row>
					<el-form-item label="_原密码_" prop="oldPass"  label-width="100px">
						<el-input v-model="passwordData.oldPass" type='password' placeholder="_请输入密码_"></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="_新密码_" prop="newPass" label-width="100px">
						<el-input v-model="passwordData.newPass" type='password'  placeholder="_请输入密码_"></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="_确认密码_" prop="checkPass" label-width="100px">
						<el-input v-model="passwordData.checkPass" type='password'  placeholder="_请输入密码_"></el-input>
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="warning" @click="editpass=false">_取消_</el-button>
				<el-button type="primary" @click="savePassword">_确定_</el-button>
			</div>
		</el-dialog>
		<!--快捷键编辑框-->
		<el-dialog custom-class="menu-info" :visible.sync="dialogHotkeys" size="small">
			<span slot="title" style="display: inline-block;margin: -15px 0 15px 0;">_编辑快捷键_</span>
			<el-checkbox-group
				v-model="checkedSecondaryMenu"
				:min="0"
				:max="6">
				<el-col :span="8" v-for="(MenuItem,index) in SecondaryMenuList">
					<el-checkbox :label="MenuItem.number" :key="MenuItem.number">
						<i class="menu-icon" :class="MenuItem.iconClass"></i>
						<span class="text">{{MenuItem.Menu}}</span>


					</el-checkbox>
				</el-col>
			</el-checkbox-group>
			<div slot="footer" class="dialog-footer">
				<el-button type="warning" @click="dialogHotkeys=false">_取消_</el-button>
				<el-button type="primary" @click="saveHotkeys">_确定_</el-button>
			</div>
		</el-dialog>
		<!--可拖动快捷键-->
		<drag-menu ref="menu"></drag-menu>
		<header class="main-header">


			<div href="index2.html" class="logo">
				<img class="main-logo" :src="logoURL"/>
				<!--<img class="main-logo" src="/static/img/logo/logo-LT.png"/>-->

			</div>

			<!-- Header Navbar -->
			<nav class="navbar">
				<div class="top-title-icon" :class="{'tagline-EN':language!='CN','tagline-CN':language=='CN'}"></div>

				<!-- Navbar Right Menu -->
				<div class="navbar-custom-menu">
					<ul class="nav navbar-nav">
						<!-- user name -->
						<li class="dropdown user">
							<a  class="dropdown-toggle" data-toggle="dropdown">
								<i class="fa fa-user-circle big-icon"></i>{{userName}}<i class="fa fa-chevron-down"></i></a>
							<ul class="dropdown-menu">
								<li class="text-center">
									<a  @click="changePassword" class="bg-green"><i class="fa fa-set"></i>_修改密码_</a>

									<a  @click="logOut" class="bg-red"><i class="fa fa-power-off"></i>_退出_</a>
								</li>
							</ul>
						</li>

						<!-- company choice-->
						<li class="dropdown user" :title="'_公司选择_:'+$store.state.companyName">
							<a  class="dropdown-toggle" data-toggle="dropdown" >
								<span>{{$store.state.companyName}}</span><i class="fa fa-chevron-down"></i>
							</a>
							<div class="dropdown-menu companyTreeWrap" @click.stop>
								<div class="carTeamList">
									<el-input
										class="filterInput"
										placeholder="_输入关键字_"
										v-model="filterTextOne">
									</el-input>
									<el-tree ref="expandOne" class="expand-tree"
											 :data="companyTreeData"
											 node-key="id"
											 highlight-current
											 :props="companyProp"
											 :expand-on-click-node="false"
											 :render-content="renderCompanyTree"
											 default-expand-all
											 :filter-node-method="filterCompany">
									</el-tree>
								</div>


							</div>
						</li>



						<!--Alarm info start-->
						<li class="dropdown alarm-menu has-border">
							<a  class="dropdown-toggle" data-toggle="dropdown">
								<i class="img-icon header-fn-icon header-alarm"></i>
								<span class="label label-danger" v-if="AllAlarmFTotalCount!==0">{{AllAlarmFTotalCount>999?'999+':AllAlarmFTotalCount|setZero}}</span>
							</a>
							<ul class="dropdown-menu" @click.stop>
								<li class="header">

									<i class="el-icon-menu" style="margin-left:-2px;color:#005fc6;" @click.stop="ShowSelectAlarmType"></i>
									<el-input class="fuzzyQueryAlarmDataInput" @change="ClassifiedByLicence" v-model="input" placeholder="_请输入车牌号_"></el-input>
									<!--<el-select class="selectAlarmDataSort" v-model="value" placeholder="请选择">
										<el-option :value="time">_按时间排序_</el-option>
										<el-option :value="licence">_按时间排序_</el-option>
									</el-select>-->
								</li>
								<li>
									<ul class="menu" id="indexAlarm" @click.stop v-loading="loadingAlarmData" element-loading-text="_正在加载_">
										<li class="alarm-item" v-for="(alarmItem,index) in alarmInfo" v-if="alarmItem.FIsShow" @mouseenter="showBtnList(index)" @mouseleave="hideBtnList(index)">
											<div class="alarm-header">
												<span class="alarm-license">·{{alarmItem.FVehicleName}}</span>
												<span class="alarm-message">[{{alarmItem.FDataTypeStr}}]</span>
												<span class="alarm-trackTime">{{alarmItem.FEndDateTimeStr}}</span>
											</div>
											<div class="alarm-location">_位置_:{{alarmItem.address}}</div>
											<!--<div class="alarm-warn">{{alarmItem.FRemind}}</div>-->

											<div class="btn-list clearfix" v-show="alarmItem.FIsShowDealBtnList">
												<button class="btn-item dealWith" @click.stop="dealWithAlarm(index)">_处理_</button>
												<button class="btn-item ignore" @click.stop="ignoreAlarm(index,alarmItem.FGUID)">
													_忽略_
												</button>
												<!--<button class="btn-item ignore" @click.stop="lookOverAlarm(alarmItem.FStartDateTime,alarmItem.FEndDateTime,alarmItem.FVehicleGUID,alarmItem.FVehicleName)">
													_查看_
												</button>-->
												<!--<button class="btn-item delate">删除</button>-->

											</div>
											<div class="alarm-deal-opinion" v-show="alarmItem.FIsShowDealOpinion">
												<textarea placeholder="_请输入内容_" v-model="alarmItem.FAlarmDealContent"></textarea>
												<div class="alarm-operation-btnList">
													<button type="button" class="alarm-operation-btn submitIdea" @click.stop="submitAlarmDealContent(alarmItem.FAlarmDealContent,alarmItem.FGUID,index)">_提交_</button>
													<button type="button" class="alarm-operation-btn dropOut" @click.stop="dropOut(index)">_退出_</button>
												</div>
											</div>
										</li>
									</ul>
								</li>
								<li class="footer">
									<a class="ignoreAll" @click="ignoreAllAlarm"><i class="fa fa-ban"></i>_忽略全部_</a>
								</li>
								<li @click.stop v-show="isShowSelectAlarmType">
									<div class="selectAlarmType">
										<div class="AlarmTypeHeader">_选择报警类型_</div>
										<el-col :span="4">
											<el-card>
												<div class="AlarmTypeWrap" :class="{checkedAlarmTypeWrap:isCheckedAllAlarmType}" @click.stop="selectAlarmType('all')">
													<div style="height: 40px;"></div>
													<div class="AlarmTypeName" :class="{checkedAlarmTypeName:isCheckedAllAlarmType}">_全部_</div>
													<div class="AlarmAmount" :class="{checkedAlarmAmount:isCheckedAllAlarmType}">({{AllAlarmFTotalCount}})</div>
												</div>
											</el-card>
										</el-col>
										<el-col :span="4" v-for="classifiedItem in alarmClassifiedArr">
											<el-card>
												<div class="AlarmTypeWrap" @click.stop="selectAlarmType(classifiedItem.type,classifiedItem)" :class="{checkedAlarmTypeWrap:classifiedItem.isChecked}" :title="classifiedItem.name">
                                                    <div class="allAlarmTypeIcon" :class="classifiedItem.classify"></div>
													<div class="AlarmTypeName" :class="{checkedAlarmTypeName:classifiedItem.isChecked}">{{classifiedItem.name}}</div>
													<div class="AlarmAmount" :class="{checkedAlarmAmount:classifiedItem.isChecked}">({{classifiedItem.amount}})</div>
												</div>

											</el-card>
										</el-col>
									</div>
								</li>
							</ul>

						</li>
						<!--Alarm info end-->

						<!--Messages info start-->
						<li class="dropdown msg-menu has-border">
							<a  class="dropdown-toggle" data-toggle="dropdown">
								<i class="img-icon header-fn-icon header-message"></i>
								<span class="label label-warning" v-if="AllSystemFTotalCount!==0">{{AllSystemFTotalCount>999?'999+':AllSystemFTotalCount|setZero}}</span>
							</a>
							<ul class="dropdown-menu" @click.stop>
								<li class="header">_系统消息_</li>
								<li>
									<!-- inner menu: contains the actual data -->
									<ul class="menu" id="indexMessages">
										<li class="messages-item" v-for="(systemItem,index) in systemInfo">
											<div class="messages-img">
												<img :src="systemItem.imgUrl">
											</div>
											<div class="messages-content">
												<div class="msg-c-header">
													<h5 class="content-title">{{systemItem.title}}</h5>
													<p class="content-time">{{systemItem.FCreateDateTime}}</p>
												</div>
												<div class="msg-c-content">
													<div class="c-content">{{systemItem.FContext}}</div>
													<div class="btn-list clearfix">
														<button type="button" class="btn-item reader" @click.stop="readMsg(systemItem.FGUID)">_已读_</button>
														<!--<button type="button" class="btn-item delete" id="deleteMsg">删除</button>-->
													</div>
												</div>
											</div>
										</li>
									</ul>
								</li>
								<li class="footer">
									<a class="allRead" id="allRead"  @click="setAllSystemRead()">
										<i class="fa fa-envelope-open-o" aria-hidden="true"></i>
										_全部设为已读_
									</a>
								</li>
							</ul>
						</li>
						<!--Messages info end-->

						<!--Event info start-->
						<li class="dropdown event-menu has-border">
							<a  class="dropdown-toggle" data-toggle="dropdown">
								<i class="img-icon header-fn-icon header-event"></i>
								<span class="label label-success" v-if="AllEventFTotalCount!==0">{{AllEventFTotalCount>999?'999+':AllEventFTotalCount|setZero}}</span>
							</a>
							<ul class="dropdown-menu">
								<li class="header" style="color: #aaa">
									_事件_
									<!--<i class="el-icon-menu" style="margin-left:-2px;color:#005fc6;" @click.stop="ShowSelectEventType"></i>
									<el-input class="fuzzyQueryAlarmDataInput" @change="ClassifiedByLicence" v-model="input" placeholder="请输入车牌号"></el-input>-->
									<!--<el-select class="selectAlarmDataSort" v-model="value" placeholder="请选择">
										<el-option :value="time">_按时间排序_</el-option>
										<el-option :value="licence">_按时间排序_</el-option>
									</el-select>-->
								</li>
								<li>
									<!-- inner menu: contains the actual data -->
									<ul class="menu" id="indexEvent">
										<li class="event-item" v-for="(eventItem,index) in eventInfo" v-if="eventItem.isShow" @mouseenter="showEventBtnList(index)" @mouseleave="hideEventBtnList(index)"><!-- start message -->
											<div class="event-header">
												<span class="event-license">·{{eventItem.FVehicleName}}</span>
												<span class="event-message">[{{eventItem.FDataType}}]</span>
												<span class="event-trackTime">{{eventItem.FStartDateTime}}</span>
											</div>
											<div class="event-location">_位置_：{{eventItem.address}}</div>
											<div class="btn-list clearfix" v-show="eventItem.FIsShowDealBtnList">
												<!--<button class="btn-item lookOver" @click="lookOverMsg(eventItem.FStartDateTime,eventItem.FEndDateTime,eventItem.FVehicleGUID,eventItem.FVehicleName)">_查看_</button>-->
												<button class="btn-item ignore" @click.stop="ignoreMsg(index,eventItem.FGUID)">
													_忽略_
												</button>
											</div>
										</li>
										<!-- end message -->
									</ul>
								</li>
								<li class="footer">
									<a @click.stop="ignoreAllMsg" class="event-ignoreAll ignoreAll" href="Javascript:;">
										<i class="fa fa-ban"></i>
										_忽略全部_
									</a>
									<!--<a @click.stop="openEventList" class="event-openList ignoreAll" href="Javascript:;">
										<i class="fa fa-file-text"></i>_查看列表_
									</a>-->

								</li>
							</ul>
						</li>
						<!--Event info end-->

						<!-- Control Sidebar Toggle Button -->
						<li class="has-border">
							<a  title="_用户手册下载_" href="Files/Download/manual/index.html" target="_blank"><i class="fa fa-cloud-download"></i></a>
						</li>
						<li class="has-border">
							<a  title="_帮助_" href="static/help.html" target="_blank"><i class="fa fa-youtube-play"></i></a>
						</li>
						<li class="has-border">
							<a  data-toggle="control-sidebar"><i class="img-icon header-fn-icon header-set"></i></a>
						</li>
					</ul>

				</div>

			</nav>
		</header>
		<!-- 左侧菜单区域 -->
		<aside class="main-sidebar">
			<!--<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button"></a>-->

			<section class="sidebar">
				<ul class="sidebar-menu tree" data-widget="tree">
					<li class="treeview active">
						<a href="#/">
							<i class="left-menu-icon icon-0"></i>
							<span>_首页_</span>
						</a>
					</li>
					<li v-for="p_menu in AccountMenuList" class="treeview">
						<a href="#">
							<i class="left-menu-icon" :class="p_menu.icon"></i>
							<span>{{p_menu.Menu}}</span>
                			<span class="pull-right-container">
                  				<i class="fa fa-angle-left pull-right"></i>
               				 </span>
						</a>
						<ul class="treeview-menu">
							<li @click="addSubTabs(menu.Menu,menu.URLAddress)" v-for="menu in p_menu.childMenu">
								<router-link :to=menu.URLAddress>{{menu.Menu}}</router-link>
							</li>
						</ul>
					</li>
				</ul>
			</section>
		</aside>

		<!-- 主内容区域 -->
		<div class="content-wrapper">
			<div class="content-header">
				<div id="Hui-tabNav" class="Hui-tabNav">
					<div class="Hui-tabNav-wp">
						<ul id="min_title_list" class="acrossTab">
							<li class="active">
								<router-link :to="{ path:'/' }"><span title="我的桌面">_首页_</span><em></em></router-link>
							</li>
							<li class="" v-for="item in $store.state.tabsData">
								<router-link :to="{ path:item.router }"><span>{{item.tabsText}}</span><i></i><em></em></router-link>
							</li>
						</ul>
					</div>
					<div class="Hui-tabNav-more btn-group">
						<a id="js-tabNav-prev" class="btn radius btn-default size-S" >
							<i class="fa fa-chevron-left"></i>
						</a>
						<a id="js-tabNav-next" class="btn radius btn-default size-S" >
							<i class="fa fa-chevron-right"></i>
						</a>
					</div>
					<div class="contextMenu" id="Huiadminmenu">
						<ul>
							<li id="closethis">_关闭当前_</li>
							<li id="closeall">_关闭全部_</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="content" id="main-content">
				<keep-alive exclude="monitor">
					<router-view :toChildrenSystemID="choiceSystem.ID" :screenHeight="screenHeight" @changeRoute="changeRoute"></router-view>
				</keep-alive>
			</div>

		</div>


		<!-- 功能设置区域 -->
		<aside class="control-sidebar control-sidebar-dark">
			<!-- Tab panes -->
			<div class="tab-content">
				<!-- time zone-->
				<div class="time_zone">
					<p><i class="fa fa-clock-o big-icon"></i>_时区选择_</p>
					<button type="button" @click="openTimeZone" class="el-button el-button--default el-button--primary">
						GMT {{timeZone}}
					</button>

				</div>
			</div>
		</aside>
		<!-- /.control-sidebar -->
		<!-- Add the sidebar's background. This div must be placed
			 immediately after the control sidebar -->
		<div class="control-sidebar-bg"></div>
		<!--图片查看-->
		<div class="imageView" v-show="showImgUrl!=null">
			<img :src="showImgUrl"/>
			<a class="close-btn" @click="showImgUrl=null">
				<i class="fa fa-close fa-4x"></i>
			</a>
		</div>
		<time-zone ref="timeZone"></time-zone>
	</div>
</template>
<script>
	import contextmenu from "./plugins/jquery.contextmenu/jquery.contextmenu.r2.js"
	import dragMenu from "components/Common/menu.vue"
	import timeZone from "components/dialog/timeZone.vue"
	import TreeRender from 'components/tree/tree_render.vue'
	let _this=null
	export default {
		data() {
			_this=this;
			var validatePass= (rule, value, callback) => {
				if (value === '') {
					callback(new Error('_请再次输入密码_'));
				} else if (value !== this.passwordData.newPass) {
					callback(new Error('_两次输入密码不一致_!'));
				} else {
					callback();
				}
			};

			return {
				userName:"",
				language:"CN",
				logoURL:null,
				systemSwitchoverWidth:null,
				systemSwitchoverRight:null,
				editpass:false,
				passwordData:{
					oldPass:'',
					newPass:'',
					checkPass:''
				},
				passwordRules:{
					oldPass: [
						{required: true, message: '_请输入原密码_', trigger: 'blur'},
						{ min: 6, max:12, message: '_长度在_ 6 ~ 12 _个字符_', trigger: 'blur' }
					],
					newPass: [
						{required: true, message: '_请输入新密码_', trigger: 'blur'},
						{ min: 6, max:12, message: '_长度在_ 6 ~ 12 _个字符_', trigger: 'blur' }
					],
					checkPass: [{validator: validatePass, trigger: 'blur'},
						{required: true, message: '_请确认密码_', trigger: 'blur'},
					]
				},
				companyProp: { //公司树形配置选项
					children: 'children',
					label: 'FShortName'
				},
				filterTextOne:"",//过滤公司关键字
				menuData: {
					typeId: 0, menuList: [
						{mainMenu: [1, 1, 1], sunMenu: [[1, 1, 1], [1, 1, 1]]},
						{mainMenu: [1, 0, 1], sunMenu: [[1, 1, 1], [1, 1, 1]]},
					]
				},
				//tabsData: [],
				screenHeight: window.innerHeight,
				num : 0,
				eventInfo: [],
				alarmInfo: [],//显示在页面的报警数据
				tempAlarmInfo:[],//加载的所有报警原始数据
				systemInfo: [],
				//EventCount:26,
				hiddenAside:-190+"px",
				isHiddenAside:0+"px",
				sidebarImgUrl:"/static/img/show_carList_btn_right.png",
				radio:"1",
				SystemData:[],//系统类型
				AlarmTypeData:[],//报警类型
				alarmClassifiedArr:[],//报警数量按类型统计
				showAlarmType:"all",//all为全部,其它为详细分类
				loadingAlarmData:false,//loading报警数据
				selectTypeArr:[],//选中的报警类别数组
				isCheckedAllAlarmType:true,//是否选择了全部的报警类型
				alarmClassifiedItemArr:[],//按报警类型筛选报警数据数组
				isShowSelectAlarmType:false,//是否显示选择报警类型
				ClassifiedByLicenceArr:[],//按车牌筛选报警数据数组
				isShowSelectEventType:false,//是否显示选择事件类型
				AllAlarmFTotalCount:0,
				AllSystemFTotalCount:0,
				AllEventFTotalCount:0,
				defaultSystemID:8, //默认系统ID
				hotketsString:'', //快捷键字符串
				haveSystemIDs:[1,2,4,6,7],//默认拥有系统ID数组
				firstLogin:true,          //由于本版本elmentUI radio 单选框 无对应change事件  只能监听默认系统ID值变化 本数值排除第一次登录时变化
				choiceSystem:{
					name:"",
					ID:null
				},
				AlarmInfoPageIndex:1,
				EventInfoPageIndex:1,
				carGUID:null,
				AccountMenuList:[],
				SecondaryMenuList:[],

				checkedSecondaryMenu:[] //本系统下快捷键ID数组
			}
		},
		created() {
			this.$store.state.router=this.$router;

			console.log("时差",window.sessionStorage.timeDifferent-0);
			if(window.sessionStorage.timeDifferent){
				this.$store.state.timeDifferent=window.sessionStorage.timeDifferent-0;
			}else{
				let zone=moment().utcOffset();
				this.$store.state.timeDifferent=zone;
				//存入localstorrage  方便Common.js 里 parseGMT 调用
				window.sessionStorage.timeDifferent=zone;
			}

			let url=location.search;
			//alert(url);
			let loginData=null;
			if(url!=""){
				var json=decodeURIComponent(url.replace("?p=",""));
				loginData=JSON.parse(json);
			}else if(window.name!=""){
				loginData=JSON.parse(window.name).FObject[0];
				console.log("用户信息",loginData);
			}else {
				//强制退出
				this.$store.commit('goLogin')
			}
			if(loginData!=null){

				this.$store.state.FUserName=loginData.FUserName;
				this.$store.state.FTokenID=loginData.FTokenID;
				this.$store.state.FUserInterfaceAddress=loginData.FUserReferer+"/indexNew.html";
				//this.$store.state.FShortName=loginData.FShortName; //旧系统中公司简称
				//this.$store.state.FAgentGUID=loginData.FAgentGUID; //旧系统中公司ID
				this.$store.state.language=loginData.FLanguage;
				this.$store.state.FEnableSystemLogo=loginData.FEnableSystemLogo;
				this.language=loginData.FLanguage;

				//根据中英文版本选择百度（中文）、谷歌（英文）地图
				if(this.language=='CN'){
					this.$store.state.globalMapType=0;
					this.$store.state.mapType=0;
				}else {
					this.$store.state.globalMapType=1;
					this.$store.state.mapType=1;
				};
				if(window.sessionStorage.mapType) this.$store.state.mapType=window.sessionStorage.mapType-0;

				this.userName=this.$store.state.FUserName;
			}
			//得到管理的公司信息
			if(window.localStorage[this.userName]){
				let companyObj=JSON.parse(window.localStorage[this.userName]);
				this.companyID=companyObj.ID;
				this.$store.state.companyName=companyObj.name;
			}else {
				//获取公司信息
				this.getCompanyData(function(){

					_this.loadSystemData(function(){
						_this.getDefaultSystemID()
						_this.loadAlarmType();//获取报警类型
						_this.haveSystemIDs.map(function(item,index){
							_this.SystemData.dataContent[item-1].active=true;
						})
						_this.$store.commit('getAllCarsData',function(){
							_this.getTopInfo();
						});

					});

					if(window.sessionStorage.tabsData){
						_this.$store.state.tabsData=JSON.parse(window.sessionStorage.tabsData);
					}

					_this.getSystemInfo();

				});
				return
			}

			_this.loadSystemData(function(){
				_this.getDefaultSystemID()
				_this.loadAlarmType();//获取报警类型

				_this.haveSystemIDs.map(function(item,index){
					_this.SystemData.dataContent[item-1].active=true;
				})
				_this.$store.commit('getAllCarsData',function(){
					_this.getTopInfo();
				});


			});

			if(window.sessionStorage.tabsData){
				_this.$store.state.tabsData=JSON.parse(window.sessionStorage.tabsData);
			}

			
			_this.getSystemInfo();
			//刷新返回首页
			//_this.$router.push('/');
		},
		filters:{

			setZero:function (value){
				let temp=value<=0?0:value;
				return temp;
			}
		},
		mounted(){
			this.$store.state.tabNavallwidth=this.tabNavallwidth;

			var sUserAgent = navigator.userAgent.toLowerCase();
			var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
			var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			var bIsMidp = sUserAgent.match(/midp/i) == "midp";
			var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
			var bIsAndroid = sUserAgent.match(/android/i) == "android";
			var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
			var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

			let oUl = $("#min_title_list");
			if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
				$("a[href!='#']").attr("data-toggle", "offcanvas");
			} else {
				changeHeight();
				//页面onresize
			};
			window.onresize = function () {
				changeHeight();
				_this.screenHeight = window.innerHeight;
				setTimeout(function () {
					_this.tabNavallwidth();

				}, 50);
			}

			function changeHeight() {
				var wH = $(window).height(),
					headerH = $(".main-header").height(),
					contentHeaderH = $(".content-header").height();
				$("#main-content").height(wH - headerH - contentHeaderH - 20);

			}

			if(!'placeholder'in document.createElement('input')){
				Pace.stop(); //IE9中强制关闭pace进度条

				//ie 兼容placeholder属性
				jQuery('[placeholder]').focus(function() {
					var input = jQuery(this);
					if (input.val() == input.attr('placeholder')) {
						input.val('');
						//console.log(input.attr('placeholder'))
						input.removeClass('placeholder');
					}
				}).blur(function() {
					var input = jQuery(this);
					if (input.val() == '' || input.val() == input.attr('placeholder')) {
						input.addClass('placeholder');

						input.val(input.attr('placeholder'));
					}
				})

				setTimeout(function(){
					$("input[placeholder]").blur();
				},500)

			}


			$('div.contextMenu').hide();
			/*选项卡导航*/
			//单击关闭
			$("#min_title_list").on("click", "li i", function (e) {
				//e.stopPropagation();

				var aCloseIndex = $(this).parents("li").index()-1;
				//console.log(aCloseIndex);
				if (aCloseIndex >= 0) {
					$("#min_title_list").find("a").eq(aCloseIndex).find("span").trigger("click");
				}
				_this.deleteTabData(aCloseIndex);
				_this.num == 0 ? _this.num = 0 : _this.num--;
				_this.tabNavallwidth();
			});
			//双击关闭
			$("#min_title_list").on("dblclick", "li", function () {
				var aCloseIndex = $(this).index() - 1;
				if (aCloseIndex >= 0) {
					$("#min_title_list").find("a").eq(aCloseIndex).find("span").trigger("click");
					_this.deleteTabData(aCloseIndex);
					_this.num == 0 ? _this.num = 0 : _this.num--;
					_this.tabNavallwidth();
				} else {
					return false;
				}
			});

			$('#js-tabNav-next').click(function () {
				_this.num == oUl.find('li').length - 1 ? _this.num = oUl.find('li').length - 1 : _this.num++;
				_this.toNavPos();
			});
			$('#js-tabNav-prev').click(function () {
				_this.num == 0 ? _this.num = 0 : _this.num--;
				_this.toNavPos();
			});


			//_this.getEventInfo();

			window.setInterval(function(){
				//console.log(_this.EventInfoPageIndex);
				_this.EventInfoPageIndex = 1;
				_this.AlarmInfoPageIndex = 1;
				_this.AlarmInfoPageIndex = 1;
				_this.eventInfo = [],
				_this.alarmInfo = [],
				_this.systemInfo = [],
				_this.selectTypeArr=[];
				_this.isCheckedAllAlarmType=true;
				_this.showAlarmType='all';
				_this.getAlarmInfo();
				_this.getEventInfo();
				_this.getSystemInfo();
			}, 1000 * 60 * 5);
			//_this.getAlarmInfo();
			//_this.loadEventData();
			//_this.loadAlarmData();
			//_this.loadMessagesData();

			//_this.lazyLoadingAlarmInfo();

			this.contextMenu();


			this.contextMenu();
		},
		methods: {
			//打开修改密码弹框
			changePassword(){
				this.editpass=true;
				this.passwordData={
			        oldPass:'',
					newPass:'',
					checkPass:''
				}

			},
			//保存密码
			savePassword(){

				this.$refs['passwordData'].validate((valid) => {
					if (valid) {
						let url="web/Common/Common_Admin";

						password(url);
						function password(url){
							let passwordData=_this.passwordData;
							let postData={
								FTokenID: _this.$store.state.FTokenID,
								FAction: "UpdateAdminMainUserPassword",
								FOldPassword:passwordData.oldPass,
								FNewPassword:passwordData.checkPass,
								FVersion: "1.0.0"
							}
							$.ajax({
								"url": url,
								"cache": false,
								"async": true,
								"type": "post",
								"dataType": "json",
								"contentType": "application/json; charset=utf-8",
								"data": JSON.stringify(postData),
								success: function (res) {

									if(res.Result==200){

										_this.$refs['passwordData'].resetFields();
										_this.$message("_修改成功_，_5秒后返回登录页面_");
										_this.editpass = false;
										setTimeout(function(){
											_this.$store.commit("goLogin");
										},5000)
									}else {
										_this.$message("_修改失败_!")
									}
								},
								error: function () {
									//console.log('_请求失败_')
								}
							});
						}
					} else {
						//console.log('error submit!!');
						return false;
					}
				});
			},
			//取得公司数据
			getCompanyData(callback){
				let postData = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryAgentList",
					FVersion: "1.0.0"
				};

				$.ajax({
					url: "/web/Common/Common",
					cache: false,
					async: true,
					type: 'Post',
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					global: false,
					data: JSON.stringify(postData),
					success: function (res) {
						//console.log("conpany data",res)
						if (res.Result == 104) {
							_this.$store.commit("goLogin");
							return
						}
						if (res.Result == 200) {
							let data=res.FObject[0]

							_this.companyID=data.FAgentGUID;
							_this.$store.state.companyName=data.FShortName;
						}
						if(callback!=null||callback!="") callback()
					}
				});

			},
			//左侧导航栏点击添加tabs标签
			addSubTabs(menuText,routerLink){
				var menuData = {tabsText: menuText, router: routerLink.replace("#/","")};
				this.$store.commit("changeRoute", menuData)
			},
			//退出登录
			logOut(){
				this.$store.commit('goLogin')
			},
			//子页面跳转路由
			changeRoute(menuData){
				this.$store.commit("changeRoute", menuData)
			},
			//删除tabsData中的路由
			deleteTabData(index){
				_this.$store.state.tabsData.splice(index, 1);
				window.sessionStorage.tabsData=JSON.stringify(_this.$store.state.tabsData);
			},
			/*获取顶部选项卡总长度*/
			tabNavallwidth() {
				var taballwidth = 0,
					hide_nav = $("#Hui-tabNav"),
					$tabNav = hide_nav.find(".acrossTab"),
					$tabNavWp = hide_nav.find(".Hui-tabNav-wp"),
					$tabNavitem = hide_nav.find(".acrossTab li"),
					$tabNavmore = hide_nav.find(".Hui-tabNav-more");
				if (!$tabNav[0]) {
					return
				}
				$tabNavitem.each(function (index, element) {
					taballwidth += Number(parseFloat($(this).width() + 60))
				});
				$tabNav.width(taballwidth + 25);
				var w = $tabNavWp.width();
				if (taballwidth + 25 > w) {
					$tabNavmore.show();
				}
				else {
					$tabNavmore.hide();
					$tabNav.css({left: 0});
				}
				this.contextMenu();
			},
			//tab导航右键菜单调用
			contextMenu() {
				$("#min_title_list li").contextMenu('Huiadminmenu', {
					bindings: {
						'closethis': function (t) {
							if ($(t).find("i")) {
								var aCloseIndex = $(t).index() - 1;
								if (aCloseIndex >= 0) {
									$("#min_title_list").find("a").eq(aCloseIndex).find("span").trigger("click");
									_this.deleteTabData(aCloseIndex);
									_this.num == 0 ? _this.num = 0 : _this.num--;
									_this.tabNavallwidth();
								}
								//$(t).find("i").trigger("click");
							}
						},
						'closeall': function () {
							_this.$store.state.tabsData = [];
							window.sessionStorage.tabsData=[];
							_this.$router.push("/");
							_this.num = 0;
							_this.toNavPos();
							setTimeout(_this.tabNavallwidth, 100);
						},
					}
				});
			},
			toNavPos() {
				$("#min_title_list").stop().animate({'left': -_this.num * 100}, 100);
			},


			//获取该登录账号拥有的菜单
			getAccountMenuList(){
				let SystemType =_this.choiceSystem.ID;
				//console.log(SystemType);
				let TokenID = this.$store.state.FTokenID;
				let index=0;
				$.post("web/Common/Common",{
					FTokenID:TokenID,
					FAction:"QueryMenuList",
					FSystemType:8,
					FVersion:"1.0.0"
				},function(data){
					console.log("菜单原始数据",data);
					if(data.Result=="200"){
						//console.log("当前账号菜单",data);
						for (let i = 0; i < data.FObject.length; i++) {
							let obj = data.FObject[i];
							//console.log(obj);
							if(obj.FICONURLAddress==32){
								_this.$store.state.remoteUnlockLimits=1;
							}
							// console.log("当前账号菜单",obj);
							if(obj.FParentGUID==null){

								index++;
								_this.AccountMenuList.push({
									id:obj.FGUID,
									Menu:_this.parseRouteMenu(obj.FICONURLAddress-0).name,
									//Menu:obj.FMenuName,
									childMenu:[],
									icon:_this.parseRouteMenu(obj.FICONURLAddress-0).icon,
									//icon:_this.tempSetIcon(obj.FMenuName),
									index:obj.FMenuIndex
								});


							}

						}
						_this.AccountMenuList.sort(function(a,b){
							return a.index- b.index;
						})
						for (let i = 0; i < data.FObject.length; i++) {
							let obj = data.FObject[i];
							if(obj.FParentGUID==null) continue;

							for (let j = 0; j < _this.AccountMenuList.length; j++) {
								let obj_c = _this.AccountMenuList[j];
								//&&(obj.FSystemType=="0"||obj.FSystemType==SystemType)
								if(obj.FParentGUID==obj_c.id){
									//console.log("当前账号菜单",obj);
									let oneMenu=_this.parseRouteMenu(obj.FICONURLAddress-0);
									let childObj={
										Menu:oneMenu.name,
										//Menu:obj.FMenuName,
										URLAddress:oneMenu.path,
										iconClass:oneMenu.imgClass,
										index:obj.FMenuIndex,
										number:obj.FICONURLAddress-0,
										id:obj.FGUID,
									};
									obj_c.childMenu.push(childObj);
									_this.SecondaryMenuList.push(childObj)
									_this.$store.state.routerArr.push(childObj.URLAddress)
								}
							}
						}
						_this.SecondaryMenuList.sort(function(a,b){
							return a.number- b.number;
						})
						//console.log("显示的所有菜单",_this.AccountMenuList);
						//console.log(_this.SecondaryMenuList);
					}
				});
			},
		
			//获得车辆数据
			getTopInfo(type){
				_this.carGUID=this.$store.state.allCarsID.join(",");
				switch (type){
					case "event":
						//_this.getEventInfo(carGUID);
						_this.lazyLoadingEventInfo();
						break;
					case "alarm":
						//_this.getAlarmInfo();
						_this.lazyLoadingAlarmInfo();
						break;
					default:
						//_this.getEventInfo(carGUID);
						//_this.getAlarmInfo();
						_this.lazyLoadingAlarmInfo();
						_this.lazyLoadingEventInfo();
				}
			},
			//请求事件数据
			getEventInfo(){
				/*$("#indexEvent").slimScroll({
					size:"3px"
				})*/
				let arg=arguments[0];
				let pageSize=10;
				//console.log(arg);
				if(arg==10000){
					pageSize=arg;
					_this.EventInfoPageIndex=1;
				}
				let postData={
					FTokenID:_this.$store.state.FTokenID,
					FAction:"QueryMessageEventByFVehicleGUIDs",
					FAgentGUID: _this.companyID,
					FVehicleGUIDs:_this.carGUID,
					FState:0,
					FDataType:0,
					FPageSize:pageSize,
					FPageIndex:_this.EventInfoPageIndex,
					FStartTime:this.getSomeDayBefore(2,"begin"),
					FEndTime:this.getSomeDayBefore(0,"end"),
					FVersion:"1.0.0"
				}

				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success:function(data){
						//console.log("事件",data);//成功
						if(data.FObject instanceof Array)return;
						if(pageSize==10000){
							let arr=data.FObject.Table1;
							let EventFGUID="";
							for (let i = 0; i < arr.length; i++) {
								EventFGUID+=arr[i].FGUID+",";
							}
							EventFGUID=EventFGUID.substring(0,EventFGUID.length-1);
							_this.ignoreMsg("all",EventFGUID);
						}else {

							if(data.FObject.Table1.length!=0){
								_this.AllEventFTotalCount = data.FObject.Table[0].FTotalCount;
								let tempArr=_this.getUsableData(data.FObject.Table1,"event");
								window.setTimeout(function(){
									$.each(tempArr,function(index,item){
										_this.eventInfo.push(item);
									});
								},500)
							}
						}

					},
				});
			},
			//请求报警数据
			getAlarmInfo(){
				let postData={
					FTokenID:_this.$store.state.FTokenID,
					FAction:"QueryMessageAlarmByFVehicleGUIDs",
					FAgentGUID: _this.companyID,
					FVehicleGUIDs:_this.carGUID,
					FState:0,
					FDataType:0,
					FPageSize:10000,
					FPageIndex:_this.AlarmInfoPageIndex,
					FStartTime:this.getSomeDayBefore(2, "begin") ,
					FEndTime:this.getSomeDayBefore(0, "end") ,
					FVersion:"1.0.0"
				}
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (data) {
						//console.log("报警",data);
						//console.log(pageSize);
						//console.log("报警页码",_this.AlarmInfoPageIndex);
						let alarmTypeNumArr=[];
						//console.log("ajax",_this.AlarmTypeData);
						for (let i = 0; i < _this.AlarmTypeData.length; i++) {
							alarmTypeNumArr.push(_this.AlarmTypeData[i].FDataType);
						}
						if(data.FObject instanceof Array){
							_this.classifiedStatisticsAlarm();	// 返回的数据类型错误也要将报警分类并统计数量
							return
						}else if(data.FObject.Table1.length != 0){
							for (let i = 0; i < data.FObject.Table1.length; i++) {
								let obj = data.FObject.Table1[i];
								if($.inArray(String(obj.FDataType),alarmTypeNumArr)===-1){
									data.FObject.Table1.splice(i,1);
									i=i-1;
								}
							}
							_this.AllAlarmFTotalCount = data.FObject.Table1.length;//显示报警总条数
							_this.tempAlarmInfo = _this.getUsableData(data.FObject.Table1,"alarm");//所有报警的原始数据
							_this.showAlarmInfo(1, 10,_this.tempAlarmInfo);//显示所有报警的前10条
						}
						_this.alarmClassifiedArr.length=0;//每请求一次就把按报警类型分类的数据初始化一次
						_this.classifiedStatisticsAlarm();//将报警分类并统计数量
					},
				});
			},
			//显示报警数据
			showAlarmInfo(pageIndex, pageSize,arr){
				let needAlarmInfo=this.pagination(pageIndex,pageSize,arr);
				for (let i=0;i<needAlarmInfo.length;i++){
					if(needAlarmInfo[i].address==""){
						_this.ReverseGeocoding(needAlarmInfo[i].FStartLongitude,needAlarmInfo[i].FStartLatitude,needAlarmInfo[i]);
					}
				}
				let temp=[];
				temp=_this.alarmInfo.concat(needAlarmInfo);
				temp=temp.sort(function(a,b){
					return Date.parse(new Date(b.FStartDateTime))- Date.parse(new Date(a.FStartDateTime));
				})
				_this.alarmInfo.length=0;
				_this.alarmInfo=temp;
				_this.loadingAlarmData=false;
			},
			//分类统计报警数据
			classifiedStatisticsAlarm(){
				for (let i = 0; i < _this.AlarmTypeData.length; i++) {
					let obj = _this.AlarmTypeData[i];
					let alarmClassified={
						name:this.$store.state.language=="CN"?obj.alarmNameCN:obj.alarmNameEN,
						type:obj.FDataType,
						amount:0,
                        classify:obj.classify,
						isChecked:false
					};
					_this.alarmClassifiedArr.push(alarmClassified);
				}
				//console.log("全部报警数据",_this.tempAlarmInfo);
				for (let i=0;i<_this.alarmClassifiedArr.length;i++){
					for (let j=0;j<_this.tempAlarmInfo.length;j++){
						if(_this.alarmClassifiedArr[i].type==_this.tempAlarmInfo[j].FDataType){
							_this.alarmClassifiedArr[i].amount=(_this.alarmClassifiedArr[i].amount)+1;
						}
					}
				}
                _this.alarmClassifiedArr.sort(function(a,b){
                    return b.amount- a.amount;
                })
				//console.log("分好类的",_this.alarmClassifiedArr);
			},

			//筛选报警类型
			selectAlarmType(type,row){
				if(type!='all'){
					_this.showAlarmType='other';
				}else {
					_this.showAlarmType=type;
				}
				_this.loadingAlarmData=true;
				_this.AlarmInfoPageIndex=1;
				_this.alarmInfo.length=0;
				if(type!='all'){
					row.isChecked=!(row.isChecked);
                    if((row.classify).indexOf("Gray")==-1){
                        row.classify=(row.classify)+"Gray";
                    }else {
                        row.classify=(row.classify).replace("Gray","");
                    }
					_this.isCheckedAllAlarmType=false;
					let index=$.inArray(type,_this.selectTypeArr);//判断选择的报警类型是否被选中过，选中过则返回索引并移除
					if(index!=-1){
						_this.selectTypeArr.splice(index,1);
					}else {
						_this.selectTypeArr.push(type);
					}
					_this.alarmClassifiedItemArr.length=0;
					for (let i=0;i<_this.tempAlarmInfo.length;i++){
						for (let j=0;j<_this.selectTypeArr.length;j++){
							if(_this.selectTypeArr[j]==_this.tempAlarmInfo[i].FDataType){
								_this.alarmClassifiedItemArr.push(_this.tempAlarmInfo[i]);
							}
						}
					}
					if(_this.selectTypeArr.length!=0){
						_this.showAlarmInfo(1,10,_this.alarmClassifiedItemArr);
					}else {
						_this.isCheckedAllAlarmType=true;
                        _this.showAlarmType='all';
						_this.showAlarmInfo(1,10,_this.tempAlarmInfo);
					}
				}else {
					_this.isCheckedAllAlarmType=true;
					for (let i=0;i<_this.alarmClassifiedArr.length;i++){
						_this.alarmClassifiedArr[i].isChecked=false;
                        if((_this.alarmClassifiedArr[i].classify).indexOf("Gray")==-1){
                            _this.alarmClassifiedArr[i].classify=_this.alarmClassifiedArr[i].classify+"Gray";
                        }
					}
					_this.selectTypeArr.length=0;
					_this.showAlarmInfo(1,10,_this.tempAlarmInfo);
				}
			},
			//是否显示选择报警类型的容器
			ShowSelectAlarmType(){
				_this.isShowSelectAlarmType=!_this.isShowSelectAlarmType
			},
			//是否显示选择事件类型的容器
			ShowSelectEventType(){
				_this.isShowSelectEventType=!_this.isShowSelectEventType
			},
			//显示按钮
			showBtnList(index){
				this.alarmInfo[index].FIsShowDealBtnList=true;
			},
			showEventBtnList(index){
				this.eventInfo[index].FIsShowDealBtnList=true;
			},
			//隐藏按钮
			hideBtnList(index){
				_this.alarmInfo[index].FIsShowDealBtnList=false;
                this.alarmInfo[index].FIsShowDealOpinion=false;
			},
			hideEventBtnList(index){
				_this.eventInfo[index].FIsShowDealBtnList=false;
				//this.eventInfo[index].FIsShowDealOpinion=false;
			},
			//通过input框输入筛选车牌
			ClassifiedByLicence(value){
				if(value==""){
					_this.alarmInfo.length=0;
					_this.AlarmInfoPageIndex=1;
					if(_this.selectTypeArr.length==0){
						_this.showAlarmType="all";
						_this.showAlarmInfo(1,10,_this.tempAlarmInfo);
					}else {
						_this.showAlarmType="other";
						console.log(_this.alarmClassifiedItemArr);
						_this.showAlarmInfo(1,10,_this.alarmClassifiedItemArr);
					}
					return false;
				}
				_this.showAlarmType="licence";
				if(_this.selectTypeArr.length==0){
					_this.ClassifiedByLicenceArr=[];
					for (let i=0;i<_this.tempAlarmInfo.length;i++){
						let licence=_this.tempAlarmInfo[i].FVehicleName.toLowerCase();
						//let address=_this.tempAlarmInfo[i].address.toLowerCase();
						if(licence.indexOf(value)!=-1){
							_this.ClassifiedByLicenceArr.push(_this.tempAlarmInfo[i]);
						}
					}
				}else {
					_this.ClassifiedByLicenceArr=[];
					for (let i=0;i<_this.alarmClassifiedItemArr.length;i++){
						let licence=_this.alarmClassifiedItemArr[i].FVehicleName.toLowerCase();
						//let address=_this.alarmClassifiedItemArr[i].address.toLowerCase();
						if(licence.indexOf(value)!=-1){
							_this.ClassifiedByLicenceArr.push(_this.alarmClassifiedItemArr[i]);
						}
					}
				}
				if(value!=""){
					_this.alarmInfo.length=0;
					_this.AlarmInfoPageIndex=1;
					console.log(_this.ClassifiedByLicenceArr);
					_this.showAlarmInfo(1,10,_this.ClassifiedByLicenceArr);
				}
			},
			//分页
			pagination(pageIndex, pageSize, array) {
				let offset = (pageIndex - 1) * pageSize;
				return ((Number(offset) + Number(pageSize)) >= array.length) ? array.slice(offset, array.length) : array.slice(Number(offset), (Number(offset) + Number(pageSize)));
			},
			//懒加载报警信息
			lazyLoadingAlarmInfo(){
				if(_this.AlarmInfoPageIndex==1){
					$("#indexAlarm").slimScroll({
						size:"3px",
                        height:"265px"
					});
					_this.getAlarmInfo();
					_this.AlarmInfoPageIndex++;
					_this.lazyLoadingAlarmInfo();
				}else {
					$("#indexAlarm").slimScroll().bind("slimscroll",function(e,pos){
						if(pos=="bottom"){
							//console.log('筛选类型:',_this.showAlarmType);
//							_this.getAlarmInfo();
							if(_this.showAlarmType=="all"){
								_this.AlarmInfoPageIndex++;
								_this.showAlarmInfo(_this.AlarmInfoPageIndex,10,_this.tempAlarmInfo);
							}else if(_this.showAlarmType=="licence"){
								//console.log(_this.AlarmInfoPageIndex);
								_this.AlarmInfoPageIndex++;
								_this.showAlarmInfo(_this.AlarmInfoPageIndex,10,_this.ClassifiedByLicenceArr);
							}else if(_this.showAlarmType=="other"){
								_this.AlarmInfoPageIndex++;
								_this.showAlarmInfo(_this.AlarmInfoPageIndex,10,_this.alarmClassifiedItemArr);
							}


						}
					});
				}
			},
			//懒加载事件信息
			lazyLoadingEventInfo(){
				if(_this.EventInfoPageIndex==1){
					$("#indexEvent").slimScroll({
						size:"3px"
					});
					_this.getEventInfo();
					_this.EventInfoPageIndex++;
					_this.lazyLoadingEventInfo();
				}else {
					$("#indexEvent").slimScroll().bind("slimscroll",function(e,pos){
						if(pos=="bottom"){
							_this.getEventInfo();
							_this.EventInfoPageIndex++;

						}
					});
				}
			},
			//处理报警信息
			submitAlarmDealContent(val,id,index){
				let JsonObj={
					FMessageGUID:id,
					FProcessStatus:1,
					FProcessType:0,
					FProcessContext:val
				};
				let JsonStr=JSON.stringify({FTokenID:_this.$store.state.FTokenID,FAction:"UpdateMessageAlarmByFMessageGUID",FT_Message:JsonObj,FVersion:"1.0.0"})
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data":JsonStr,
					success:function(data){
						//console.log(data);
						if(data.Result=="200"){
							_this.AllAlarmFTotalCount--;
							_this.alarmInfo[index].FIsShow=false;
							_this.getTopInfo("alarm");
						}

					}
				});
			},
			//请求系统消息
			getSystemInfo(){
				$("#indexMessages").slimScroll({
					size:"3px"
				});
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data":'{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryMessageNotifyByFUserGUID","FState":"0","FDataType":"0","FPageSize":"10000","FPageIndex":"1","FVersion":"1.0.0"}',
					success:function(data){
						//console.log(data);
						_this.AllSystemFTotalCount = data.FObject.Table[0].FTotalCount;
						_this.systemInfo=_this.getUsableData(data.FObject.Table1,"system");
					}
				});
			},
			//设置系统消息已读
			readMsg(id){
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data":'{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"UpdateMessageNotifyStatus","FGUIDs":"'+id+'","FState":"1","FVersion":"1.0.0"}',
					success:function(data){
						//console.log(data);
						_this.getSystemInfo();
					}
				});
			},
			//设置所有系统消息已读
			setAllSystemRead(){
				let GUIDArr=[];
				for (let i = 0; i < this.systemInfo.length; i++) {
					GUIDArr.push(this.systemInfo[i].FGUID);
				}
				let GUIDStr=GUIDArr.join(",");
				this.readMsg(GUIDStr);
			},
			//优化显示的数据(解析地址+修改字段)
			getUsableData(arr, type){
				let result = arr;
				//console.log(result);
				let myGeo = new BMap.Geocoder();
				for (let i = 0; i < result.length; i++) {
					//修改字段
					if (type == "alarm") {
						if(_this.AlarmTypeData.length===0) return;
						for (let j=0;j<_this.AlarmTypeData.length;j++){
							if(result[i].FDataType==_this.AlarmTypeData[j].FDataType){
								if(this.$store.state.language=="CN"){
									result[i].FDataTypeStr=_this.AlarmTypeData[j].alarmNameCN;
								}else {
									result[i].FDataTypeStr=_this.AlarmTypeData[j].alarmNameEN;
								}
								result[i].FRemind = "";
								continue;
							}
						}
						/*if (result[i].FDataType == "1") {
							result[i].FDataType = "_超速报警_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "2") {
							result[i].FDataType = "_胎温胎压报警_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "3") {
							result[i].FDataType = "_超时停车报警_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "4") {
							result[i].FDataType = "_疲劳驾驶报警_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "5") {
							result[i].FDataType = "_离线报警_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "6") {
							result[i].FDataType = "_电量报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "7") {
							result[i].FDataType = "_温度报警_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "8") {
							result[i].FDataType = "_异常开锁报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "9") {
							result[i].FDataType = "_刷非法卡_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "10") {
							result[i].FDataType = "_锁挂绳剪断报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "11") {
							result[i].FDataType = "_长时间开锁报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "12") {
							result[i].FDataType = "_连续五次密码错_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "13") {
							result[i].FDataType = "_震动报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "14") {
							result[i].FDataType = "_进区域报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "15") {
							result[i].FDataType = "_出区域报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "16") {
							result[i].FDataType = "_锁低电报警(_低于_30%)_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "17") {
							result[i].FDataType = "_开后盖报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "18") {
							result[i].FDataType = "_卡锁报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "19") {
							result[i].FDataType = "_主机拆卸报警_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "20") {
							result[i].FDataType = "_从机拆卸报警_";
							result[i].FRemind = "";
						}*/
						result[i].FIsShow = true;
						result[i].FIsShowDealOpinion = false;
						result[i].FIsShowDealBtnList = false;
						result[i].FAlarmDealContent = "";
						result[i].address="";
						result[i].FEndDateTimeStr = _this.parseGMT(result[i].FEndDateTime);
						result[i].FEndDateTime = result[i].FStartDateTime.replace(/T/g, " ");
					}else if(type == "event"){
						result[i].isShow = true;
						result[i].FIsShowDealBtnList = false;
						if (result[i].FDataType == "1") {
							result[i].FDataType = "ACC _开_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "2") {
							result[i].FDataType = "ACC _关_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "3") {
							result[i].FDataType = "_接挂_";
							result[i].FRemind = "";
						} else if (result[i].FDataType == "4") {
							result[i].FDataType = "_甩挂_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "5") {
							result[i].FDataType = "_开锁_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "6") {
							result[i].FDataType = "_关锁_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "7") {
							result[i].FDataType = "_开门_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "8") {
							result[i].FDataType = "_关门_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "9") {
							result[i].FDataType = "_装箱_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "10") {
							result[i].FDataType = "_卸箱_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "11") {
							result[i].FDataType = "_长时间开锁_";
							result[i].FRemind = "";
						}else if (result[i].FDataType == "12") {
							result[i].FDataType = "_设备离线_";
							result[i].FRemind = "";
						}
						result[i].isShow = true;
						result[i].FStartDateTime = _this.parseGMT(result[i].FStartDateTime);
						result[i].FEndDateTime = result[i].FStartDateTime.replace(/T/g, " ");
					}else if (type == "system") {
						result[i].FCreateDateTime = result[i].FCreateDateTime.substring(0, 10);
						result[i].imgUrl = "static/img/emptyUrl.gif";
						result[i].title =result[i].FContext.substring(0,5)+"...";
						if(result[i].FContext.length>=55){
							result[i].FContext=result[i].FContext.substring(0,55)+"...";
						}
					}
					//解析地址
					if(type!='alarm'){
						if (result[i].FStartLongitude != "" || result[i].FStartLongitude != undefined) {
							_this.ReverseGeocoding(result[i].FStartLongitude,result[i].FStartLatitude,result[i]);
						}
					}
				}
				return result
			},
			//逆地理编码
			ReverseGeocoding(lat,lon,obj){
				let pointObj={lat:lon,lng:lat};
				let point=this.parsePoint(this.$store.state.globalMapType,pointObj);
				this.geocoder(this.$store.state.globalMapType,point,obj,"address");
			},
			//忽略事件
			ignoreMsg(index,id){
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data":"{'FTokenID':'"+_this.$store.state.FTokenID+"','FAction':'UpdateMessageEventStatus','FGUIDs':'"+id+"','FState':'1','FVersion':'1.0.0'}",
					success:function(json){
						if(index=="all"){
							for (var i=0;i<_this.eventInfo.length;i++){
								_this.eventInfo[i].isShow=false;
							}
							_this.AllEventFTotalCount=0;
						}else {
							if(json.Result=="200"){
								_this.AllEventFTotalCount--;
								_this.eventInfo[index].isShow=false;
							}
						}

					}
				});

			},
			//查看事件
			lookOverMsg(startTime,endTime,id,Vehicle){
				//console.log(id);
				//this.$router.push({name:"event",params: { ID: id ,startTime:startTime,endTime:endTime,vehicle:Vehicle}});
				//let menuData = {tabsText: "事件", router: "/event"};
				//_this.tabsData.push(menuData);
			},
			//查看报警
			lookOverAlarm(startTime,endTime,id,Vehicle){

			},
			//忽略所有事件
			ignoreAllMsg(){
				this.getEventInfo(10000);
			},
			//忽略所有报警
			ignoreAllAlarm(){
				let AlarmFGUID="";
				for (let i = 0; i < _this.tempAlarmInfo.length; i++) {
					AlarmFGUID+=_this.tempAlarmInfo[i].FGUID+",";
				}
				AlarmFGUID=AlarmFGUID.substring(0,AlarmFGUID.length-1);
				_this.ignoreAlarm("all",AlarmFGUID);
			},
			//打开事件页面
			/*openEventList(){
				let menuData ={tabsText: "_事件_", router: "/event"};
				this.$store.commit("changeRoute", menuData);

			},*/
			//忽略报警
			ignoreAlarm(index,id){
				$.ajax({
					"url": "/web/Common/Common_Message",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data":"{'FTokenID':'"+_this.$store.state.FTokenID+"','FAction':'UpdateMessageAlarmStatus','FGUIDs':'"+id+"','FState':'1','FVersion':'1.0.0'}",
					success:function(json){
						if(json.Result=="200"){
							if(index=="all"){
								for (var i=0;i<_this.alarmInfo.length;i++){
									_this.alarmInfo[i].FIsShow=false;
								}
								_this.AllAlarmFTotalCount=0;
							}else {
								_this.AllAlarmFTotalCount--;
								_this.alarmInfo[index].FIsShow=false;
							}

						}
					}
				});
			},
			dealWithAlarm(index){
				this.alarmInfo[index].FIsShowDealOpinion=true;
			},
			dropOut(index){
				this.alarmInfo[index].FIsShowDealOpinion=false;
			},
			//获取本地系统的数据
			loadSystemData(callback){
				let url="/static/systems/systems_"+this.$store.state.language+".json"
				_this.$http.get(url).then(function (res) {
					_this.SystemData=JSON.parse(res.bodyText);

					callback()
				});
			},
			//获取本地报警类型数据
			loadAlarmType(){
				let url="/static/AlarmType/AlarmType.json"
				_this.$http.get(url).then(function (res) {
					//_this.AlarmTypeData=JSON.parse(res.bodyText);
                    let temp=JSON.parse(res.bodyText);
                    //console.log("这是临时的",temp);
                    for (let i=0;i<temp.dataContent.length;i++){
                        if(temp.dataContent[i].systemType===this.$store.state.choiceSystemID){
                            _this.AlarmTypeData=temp.dataContent[i].alarmType;
                        }
                    }
					console.log('报警类型',_this.AlarmTypeData);
				});
			},
			//从服务器获取默认系统ID
			getDefaultSystemID(){
				//如果未登录过系统 则向服务器请求默认系统数据
				let postData={
					FTokenID:_this.$store.state.FTokenID,
					FAction:"QuerySystemConfigUser",
					FVersion:"1.0.0"
				}

				$.ajax({
					"url": "/web/Common/Common_System",
					"cache": false,
					"async": false,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData) ,
					success: function (res) {
						console.log("Default system",res);
						if(res.Result==200){
							
							//获取用户公司列表
							_this.$store.commit('getuserCompany');
							//获取用户菜单权限
							_this.getAccountMenuList();
							//系统logo部分
							if(res.FObject[0].FSystemLogoURL!=null && res.FObject[0].FSystemLogoURL!=""){
								_this.logoURL=res.FObject[0].FSystemLogoURL;
								_this.$store.state.logoURL=_this.logoURL;
							}else{
								_this.logoURL="/static/img/logo/logo.png";
								_this.$store.state.logoURL="/static/img/logo/logo.png";
							}


							//系统快捷键部分
							let hotkeys=res.FObject[0].FSystemShortcutKey;
							_this.hotketsString=hotkeys;
							if(hotkeys==null){
								_this.$store.state.hotkeys=null
							}else{
								let obj=new Object();
								hotkeys.split(";").map(function (item,index) {
									//console.log(item)
									if(item!=null&&item!=""){
										let arr=item.split(":");
										let key=arr[0]-0;
										let value=JSON.parse("["+arr[1]+"]"); //转换后数组内元素为number类型
										//console.log(key,value)
										obj[key]=value
									}
								});

								_this.$store.state.hotkeys=obj;
								if(typeof obj[_this.$store.state.choiceSystemID] ==="undefined"){
									_this.checkedSecondaryMenu=[]
								}else{
									_this.checkedSecondaryMenu=_this.$store.state.hotkeys[_this.$store.state.choiceSystemID].slice(0,6)
								}
							};
							_this.$refs.menu.gethotkeys();
							//console.log("转译后的快捷键",_this.$store.state.hotkeys);

						}
					},
					error: function () {
						//console.log("Default system request error")
					}
				})

			},
			//选择切换系统
			changeSystem(data){
				// console.log(_this.haveSystemIDs);
				// console.log(data.systemID);
				// console.log(_this.haveSystemIDs.indexOf(data.systemID));
				if(data.systemID==this.choiceSystem.ID || _this.haveSystemIDs.indexOf(data.systemID)==-1) return;
				window.sessionStorage.systemInfo=JSON.stringify(data);
				window.sessionStorage.tabsData=[];
				//this.$router.go(0);
				this.$router.push('/');
				window.location.reload();
				//this.$router.push();
			},
			//未开通系统提示
			noHoveSystem(){
				_this.$message({
					showClose: true,
					message: '_您尚未开通此系统_',
					type: 'warning'
				});
			},

			//保存快捷键
			saveHotkeys(){
				//console.log(_this.checkedSecondaryMenu);

				if(_this.checkedSecondaryMenu.length===0) this.$message({
					message: '请选择',
					type: 'warning'
				});

				let obj=_this.$store.state.hotkeys;
				if(obj==null){
					let newObj=new Object();
					newObj[_this.$store.state.choiceSystemID]=_this.checkedSecondaryMenu;
					obj=newObj;
				}else {
					obj[_this.$store.state.choiceSystemID]=_this.checkedSecondaryMenu;
				}

				let string="";
				for(let key in obj){
					string+=key+":"+obj[key].join(",")+";";
				};

				let postData={
					 FTokenID: _this.$store.state.FTokenID,
					 FAction: "UpdateSystemConfigUser",
					 FDefaultSystemId:_this.defaultSystemID,
					 FSystemShortcutKey:string,
					 FVersion: "1.0.0"
				 }
				$.ajax({
					 url: "/web/Common/Common_System",
					 cache: false,
					 async: true,
					 type: "post",
					 dataType: "json",
					 contentType: "application/json; charset=utf-8",
					 data:JSON.stringify(postData),
					 success:function(res){
						 //console.log("快捷键保存情况",res);//成功
						 if(res.Result==200){
							 _this.$message({
								 message: '_快捷键保存成功_',
								 type: 'success'
							 });
							 _this.hotketsString=string;
							 _this.dialogHotkeys=false;
							 _this.$refs.menu.gethotkeys();
						 }else{
							 _this.$message({
								 message: '_快捷键保存失败_',
								 type: 'error'
							 });
						 }

					},
				});
			},
			//打开时区选择
			openTimeZone(){
				this.$refs.timeZone.openDialog()
			},
			renderCompanyTree(h,{node,data,store}){//加载节点
				let show=this.companyID!=node.data.FGUID;
				return (
					<span style="displya:inline-block;width:100%;">
						<span style="float: left;">
							<span v-show={show}>{node.label}</span>
							<span v-show={!show} class="text-blue">{node.label}</span>
						</span>
						<span style="float: right;margin-right:10px;">
							<span style="margin-right: 5px">[{data.FVehicleCount}]</span>
							<el-button v-show={show} type="primary" size="mini" on-click={ () => this.clickCompany(store, data) }>_选择_</el-button>
						</span>
					</span>
				);
			},
			//选择管理的公司
			clickCompany(store, data){
				console.log(data)
				let obj={
					ID:data.FGUID,
					name:data.FShortName
				};
				window.localStorage[this.$store.state.FUserName]=JSON.stringify(obj);
				window.location.reload();
			},
			//过滤公司
			filterCompany(value, data) {
				if (!value) return true;
				return data.FShortName.toUpperCase().indexOf(value.toUpperCase()) !== -1;
			}

		},
		watch:{
			//过滤公司
			filterTextOne(val) {
				this.$refs.expandOne.filter(val);
			},
		},
		computed:{
			companyID: { //公司id
				set(value){
					_this.$store.state.companyID=value
				},
				get () {
					return  _this.$store.state.companyID
				}
			},
			dialogHotkeys:{
				set(value){
					_this.$store.state.dialogHotkeys=value;
				},
				get(){
					return _this.$store.state.dialogHotkeys;
				}
			},
			showImgUrl:{
				set(value){
					_this.$store.state.showImgUrl=value;
				},
				get(){
					return _this.$store.state.showImgUrl;
				}
			},
			timeZone:{
				get(){
					let t=_this.$store.state.timeDifferent;
					return moment().utcOffset(t).format('Z')
				}
			},
			companyTreeData:{  //请求store中tree数据
				get(){
					return this.$store.state.treeDataCompany;
				}

			},
		},
		components:{
			dragMenu: dragMenu,
			timeZone: timeZone
		}

	}


</script>
<style scoped>
	/********header图标***********/



	/*
	  .main-header .logo{
		width:40%;
	  }
	  .main-header .navbar{
		float:left;
		width:60%;
		margin-left:0;
	  }
	*/
	.main-header ul li {
		font-size:20px;
	}
	.navbar-nav > .event-menu > .dropdown-menu, .navbar-nav > .msg-menu > .dropdown-menu,.navbar-nav > .alarm-menu > .dropdown-menu {
		width:402px;
		border:1px solid #eee;
		box-shadow:2px 2px 3px rgba(0,0,0,0.5);
		border-bottom:none;
	}

	.navbar-nav > .event-menu > .dropdown-menu > li .menu, .navbar-nav > .msg-menu > .dropdown-menu > li .menu {
		max-height:250px;
	}

	.navbar-nav > .event-menu > .dropdown-menu > li.header,
	.navbar-nav > .msg-menu > .dropdown-menu > li.header,
	.navbar-nav > .alarm-menu > .dropdown-menu > li.header {
		padding:7px 10px;
		border-bottom:1px solid #f4f4f4;
		color:#fff;
		font-size:16px;
		cursor:default;
	}
	.event-menu .header{
		background-color:#ebebeb;
	}
	.msg-menu .header{
		background-color:#f39c12;
	}
	.alarm-menu .header{
		background-color:#ebebeb;
	}


	.navbar-nav > .event-menu > .dropdown-menu, .navbar-nav > .msg-menu > .dropdown-menu, .navbar-nav > .alarm-menu > .dropdown-menu {
		padding:0;
	}
	.navbar-nav > .event-menu > .dropdown-menu > li.footer > a, .navbar-nav > .msg-menu > .dropdown-menu > li.footer > a, .navbar-nav > .alarm-menu > .dropdown-menu > li.footer > a {
		border-top-left-radius:0;
		border-top-right-radius:0;
		border-bottom-right-radius:4px;
		border-bottom-left-radius:4px;
		font-size:12px;
		background-color:#fff;
		padding:7px 10px;
		border-bottom:1px solid #eeeeee;
		color:#444 !important;
		text-align:center
	}
	.main-header .main-logo {
		float:left;
		display:block;
		padding-top:6px;
	}


	/*事件：忽略全部*/
	.navbar-nav > .event-menu > .dropdown-menu > li.footer > .ignoreAll,.navbar-nav > .alarm-menu > .dropdown-menu > li.footer > .ignoreAll {
		background-color:#81bbf9;
		height:40px;
		color:#fff !important;
		line-height:25px;
		font-size:14px;
		border-bottom:none;
	}
	.navbar-nav > .event-menu > .dropdown-menu > li.footer >.event-ignoreAll {
		width:100%;
		display:inline-block;
		border-bottom-right-radius:0;
		border-right:1px solid #ccc;
	}
	.navbar-nav > .event-menu > .dropdown-menu > li.footer >.event-openList {
		width:50%;
		display:inline-block;
		border-bottom-left-radius:0;
	}


	.navbar-nav > li > a {
		height:50px;
		line-height:50px;
		padding:0 20px 0;
	}

	.main-header .navbar .nav > li > a > .label {
		top:10px;
		right:13px;
	}
	.navbar-nav  .system-type a{
		padding:0 10px 0 30px;
	}
	.main-header .user a{
		padding: 0 25px 0 15px;
	}
	.main-header .user a, .main-header .system-type a {
		font-size:14px;
	}
	.main-header .user span{
		max-width:150px;
		display:inline-block;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.main-header .user .fa-chevron-down{
		position:absolute;
		top:18px;
		right:1px;
	}
	.main-header .big-icon {
		display:block;
		float:left;
		line-height:50px;
		font-size:24px;
		padding-right:5px;
	}

	.main-header .fa-chevron-down {
		padding-left:20px;
		font-size:12px;
	}

	.main-header .has-border {
		border-left:1px solid #09417d;
		border-right:1px solid #3b8feb;
	}

	@media (max-width:1124px) and (min-width:0px) {
		/*
		.main-header .logo, .main-header .navbar {
		  float:none;
		  width:100%;
		}
		*/
		.navbar-nav > li > a {
			padding:0 10px 0;
		}
		.main-header .navbar .nav > li > a > .label {
			top:13px;
			right:8px;
		}
	}

	/*index  header style end*/

	/* main-sidebar  style*/
	.main-sidebar {
		-webkit-box-shadow:2px 2px 4px rgba(0,0,0,.20);
		-moz-box-shadow:2px 2px 4px rgba(0,0,0,.20);
		-ms-box-shadow:2px 2px 4px rgba(0,0,0,.20);
		box-shadow:2px 2px 4px rgba(0,0,0,.20);
	}
	/***图标****/
	.left-menu-icon{
		display:inline-block;
		width:18px;
		height:18px;
		margin-top:2px;
		background-image: url("/static/img/sprite/tag_icon.png")
	}



	.main-sidebar .router-link-exact-active {
		color:#fff !important;
		background-color:#96b9e6;
	}

	/*acrossTab 导航栏样式*/
	.content-header {
		-webkit-box-shadow:2px 2px 4px rgba(0,0,0,.20);
		-moz-box-shadow:2px 2px 4px rgba(0,0,0,.20);
		-ms-box-shadow:2px 2px 4px rgba(0,0,0,.20);
		box-shadow:2px 2px 4px rgba(0,0,0,.20);
	}

	.Hui-tabNav-wp {
		position:relative;
		height:35px;
		overflow:hidden;
	}


	.Hui-tabNav .acrossTab li a {
		height:26px;
		line-height:26px;
		display:block;
		background-image:url("../static/img/acrossTab-2.png")
	}

	.Hui-tabNav {
		background-image:none;
	}

	.acrossTab {
		position:absolute;
		top:9px;
		left:0;
		height:26px;
		width:100%;
		line-height:26px;
		padding-top:0;
		background-repeat:repeat-x;
		background-position:0 0;
		padding-top:1px;
		padding-left:0;
		overflow:hidden;
	}

	.acrossTab li {
		position:relative;
		display:inline-block;
		height:29px;
		line-height:29px;
		font-size:14px;
		cursor:pointer;
		white-space:nowrap;
		background-position:0 0
	}

	.acrossTab li a em {
		position:absolute;
		top:0;
		right:-16px;
		height:26px;
		width:16px;
		background-image:url("../static/img/acrossTab-2.png");
		background-position:right -30px;
	}

	.acrossTab li a, .acrossTab li a em {
		background-repeat:no-repeat;
	}

	.acrossTab li a span {
		color:#282828;
	}

	.acrossTab li a:hover {
		text-decoration:none;
		background-position:0 -60px
	}
	.acrossTab li a:hover span {
		color:#282828;
	}
	.acrossTab li a:hover em {
		background-position:right -90px
	}

	.acrossTab li .router-link-exact-active {
		background-position:0 -120px;
	}
	.acrossTab li .router-link-exact-active span {
		color:#fff;
	}

	.acrossTab li .router-link-exact-active em {
		background-position:right -150px;
		z-index:99
	}

	.acrossTab li a i {
		position:absolute;
		display:block;
		width:13px;
		height:13px;
		top:50%;
		margin-top:-6px;
		right:5px;
		font-size:0;
		line-height:0;
		cursor:pointer;
		background-image:url("../static/img/acrossTab-close.png");
		background-repeat:no-repeat;
		background-position:0 0
	}

	.acrossTab li a i:hover {
		background-position:0 bottom
	}

	.Hui-tabNav .acrossTab li a {
		padding:0 30px;
	}

	.Hui-tabNav {
		height:35px;
		padding-right:75px;
		overflow:hidden;
		position:relative;
		background-color:#fff;
	}

	.Hui-tabNav-more {
		position:absolute;
		right:0px;
		width:78px;
		top:4px;
		display:none
	}

	.Hui-tabNav-more a {
		padding: 2px 12px;
		font-size:18px;
		color:#005fc6;
		border-bottom:none;
	}

	#main-content{
		background-color:#e8e8e8;
		padding-right:0;
	}

	/*event popular style*/
	.main-header ul .event-item {
		padding-bottom: 5px;
		margin: 0 5px;
		border-bottom: 1px solid #e6e6e6;
		cursor: default;
	}

	.main-header ul .event-item .event-header,.main-header ul .alarm-item .alarm-header {
		margin-left:20px;
		height:26px;
		line-height:26px;
	}

	.main-header ul .event-item .event-license,.main-header ul .alarm-item .alarm-license {
		color:#333;
		font-size:12px;
	}

	.main-header ul .event-item .event-message,.main-header ul .alarm-item .alarm-message {
		color:#999;
		font-size:12px;
	}

	.main-header ul .event-item .event-trackTime,.main-header ul .alarm-item .alarm-trackTime {
		color:#b8b8b8;
		float:right;
		margin-right:8px;
		font-size:12px;
	}

	.main-header ul .event-item .event-location,.main-header ul .alarm-item .alarm-location {
		color:#254068;
		font-size:12px;

		line-height:18px;
		margin-left:24px;
	}

	.main-header ul .alarm-item .alarm-warn {
		color:#999;
		font-size:12px;
		min-height:42px;
		line-height:20px;
		margin-left:24px;
		text-indent:2em;
	}

	.main-header ul .alarm-item {
		padding-bottom:5px;
		margin:0 5px;
		border-bottom:1px solid #e6e6e6;
		cursor:default;
	}

	.main-header ul .alarm-item .alarm-deal-opinion {
		margin:9px 0 0 10px;
		width:380px;
		height:74px;
		background-color:#f5f5f5;
	}

	.main-header ul .alarm-item .alarm-deal-opinion>textarea {
		width:290px;
		height:60px;
		resize:none;
		margin:7px 0 0 20px;
		border-color:transparent;
		border-radius:3px;
		font-size:12px;
		color:#ccc;
	}

	.main-header ul .alarm-item .alarm-deal-opinion>.alarm-operation-btnList {
		float:right;
		margin:15px 15px 0 0;
	}
	.alarm-operation-btnList .alarm-operation-btn {
		border:none;
		font-size:12px;
		width:40px;
		height:20px;
		display:block;
		margin-bottom:3px;
		border-radius:3px;
		color:#fff;
	}

	.alarm-operation-btnList .submitIdea {
		background-color:#427dbe;
	}

	.alarm-operation-btnList .dropOut {
		background-color:#b9b9b9;
	}

	.main-header ul .event-item .btn-list .btn-item,.main-header ul .messages-item .btn-list .btn-item,.main-header ul .alarm-item .btn-list .btn-item {
		width:60px;
		height:20px;
		line-height:20px;
		border:none;
		color:#fff;
	}

	.main-header ul .event-item .btn-list {
		margin-left:305px;
		font-size:12px;
	}
	.main-header ul .alarm-item .btn-list {
		font-size:12px;
		margin-left:255px;
	}
	.main-header ul .messages-item .btn-list {
		margin-left:255px;
		font-size:12px;
	}
	.main-header ul .event-item .btn-list .lookOver,.main-header ul .alarm-item .btn-list .dealWith {
		background-color:#2076d4;
	}

	.main-header ul .event-item .btn-list .ignore,.main-header ul .alarm-item .btn-list .ignore {
		background-color:#f3a511;
        margin-left: 5px;
	}

	.main-header ul .alarm-item .btn-list .delete {
		background-color:#bababa;
	}

	/*messages popular style*/
	.main-header ul .messages-item {
		height:110px;
		border-bottom:1px solid #f1f1f1;
		margin:0 10px;
		cursor:default;
	}
	.main-header ul .messages-item .messages-img {
		float:left;
		width:115px;
		margin:5px 0 0 5px;
		height:95px;
		border:1px solid #cdcdcd;
		border-radius:3px;
		display:flex;
		justify-content:center;
		align-items:center;
	}
	.main-header ul .messages-item .messages-img img {
		display:block;
		width:107px;
		height:87px;
	}
	.main-header ul .messages-item .messages-content {
		float:right;
		width:250px;
		height:100%;
		margin-left:10px;
	}
	.msg-c-header {
		height:24px;
		line-height:24px;
	}
	.msg-c-header .content-title {
		color:#363636;
		margin:5px 0 0;
		float:left;
		width:180px;
		height:24px;
		line-height:24px;
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
	}
	.msg-c-header .content-time {
		color:#c7c7c7;
		float:right;
		font-size:12px;
		margin-top:5px;
	}

	.msg-c-content {
		height:76px;
		position:relative;
	}
	.msg-c-content .c-content {
		text-indent:2em;
		font-size:12px;
		max-width:250px;
		display:inline-block;
		cursor:pointer;
	}
	.main-header ul .messages-item .btn-list {
		position:absolute;
		right:0;
		bottom:0;
		height:20px;
	}
	.main-header ul .messages-item .btn-list .reader {
		background-color:#f8906d;
	}
	.main-header ul .messages-item .btn-list .delete {
		background-color:#bababa;
	}
	.navbar-nav > .msg-menu > .dropdown-menu > li.footer > .allRead {
		background-color:#81bbf9;
		color:#fff!important;
		border-bottom:none;
		height:40px;
		line-height:25px;
		font-size:14px;
	}

	.alarm-menu .footer,.msg-menu .footer,.event-menu .footer {
		height: 40px;
		padding: 0;
	}



	/*报警类型选择*/
	.selectAlarmType {
		background-color:#ebebeb;
		border:1px solid #ccc;
		cursor:default;
		position:absolute;
		height:350px;
		width:480px;
		left:-480px;
		top:0;
		padding:5px 4px;
		overflow-y: scroll;
	}
	.AlarmTypeHeader {
		font-size:14px;
		padding:1px 0 5px 5px;
	}
	.selectAlarmType .el-card {
		margin:3px 4px;
		text-align:center;
	}

	.selectAlarmType .AlarmTypeIcon {
		padding:3px 0;
	}

	.selectAlarmType .AlarmTypeName,.selectAlarmType .AlarmAmount {
		font-size:12px;
		color:#cecece;
	}
	.selectAlarmType .AlarmAmount {
		color:#3d3d3d;
	}
	.selectAlarmType .AlarmTypeName {
		height:34px;
		overflow: hidden;
	}
	.selectAlarmType .checkedAlarmTypeName {
		color:#005fc6;
	}
	.selectAlarmType .checkedAlarmAmount {
		color:#005fc6;
	}
	.selectAlarmType .AlarmTypeWrap {
		border:2px solid;
		border-color:#fff;
		border-radius:4px;
	}
	.selectAlarmType .checkedAlarmTypeWrap {
		border-color:#005fc6;
	}

</style>
<style>
	/*图片查看器  css*/
	.imageView{
		position:absolute;
		left:0;
		top:0;
		width:100%;
		height:100%;
		background-color:rgba(0,0,0,.8);
		z-index:1600;
		text-align:center;
	}
	.imageView img{
		height:100%;
	}
	.imageView .close-btn{
		position:absolute;
		right:0;
		top:0;
		width:50px;
		height:50px;
		color:#fff;
	}
	/*报警类型选择begin*/
	.selectAlarmType .el-card .el-card__body {
		padding:0;
		height:97px;
	}
	.fuzzyQueryAlarmDataInput {
		/*width:62%!important;*/
		width:94%!important;
	}
	.selectAlarmDataSort {
		width:30%!important;
	}
	.fuzzyQueryAlarmDataInput,.selectAlarmDataSort {
		display:inline-block;
	}
	.fuzzyQueryAlarmDataInput .el-input__inner,.selectAlarmDataSort .el-input__inner {
		height:28px;
	}
	/*报警类型选择end*/
	.sidebar-toggle {
		position:absolute;
		left:100%;
		top:38%;
		display:block;
		width: 15px;
		height: 76px;
		background:url("/static/img/show_carList_btn_left.png") no-repeat;
	}
	#jqContextMenu{
		z-index:1051!important;
	}
	/* 快捷键列表样式  start */
	.menu-info .el-checkbox__input{
		top:-13px
	}
	.menu-info .el-checkbox-group label{
		height: 42px
	}
	.menu-icon{
		display:inline-block;
		width:40px;
		height:40px;
		background-image:url(/static/img/menu/menu-list.png);
		background-color:#333;
		background-repeat:no-repeat;
		background-position:-20px -20px;
	}
	.menu-info .text{
		position:absolute;
		top:13px;
		left:70px;
	}
	/* 快捷键列表样式  end */

	.time_zone{
		color:#fff;
		font-size:20px;
	}
	.time_zone a{
		color:#fff;
	}
	.companyTreeWrap{
		width:400px!important;
		height:476px;
	}
	.companyTreeWrap .filterInput {
		height: 7%;
	}
	.companyTreeWrap .carTeamList .el-tree{
		height:92%;
	}
</style>