/**
 * Created by DELL on 2017/6/17.
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
//数据  页面调用方法的  this.$store.state.FUserName
const state = {
	//开发测试数据
	//FUserName:"admin",
	//FTokenID:"a4bfdec1-6734-4203-b7cb-e2d1f1b2be27",
	//FShortName:"长沙五六联盟",
	//FAgentGUID:"39398d49-955e-478f-8ec6-7af21a0a1c48",
	//上线数据清空
	FUserName:null,
	FTokenID:null,
	FShortName:"_全部_",
	companyID:null,      //当前选择公司ID
	companyName:null,      //当前选择公司名称
	logoURL:null,         //logo地址
	FEnableSystemLogo:null,

	FUserInterfaceAddress:"http://cloud.jointcontrols.cn:56081/indexNew.html",
	//FUserInterfaceAddress:"http://cloud.jointcontrols.cn:56080",
	haveSystemIDs:[1,2,4,6,7],  //拥有系统权限的数组 例如[1,2,3,4]


	allCarsList: [],       //分析前车辆数据
	allCarsID:[],          //分析后车辆ID数组
	allCarsData:[],      //分析后车辆树形图数据
    allCarTeam:null,       //分析后车队树形图数据
	LocksTree:[],       //分析后电子锁树形图数据
	locksIDArr:[],	    //电子锁ID数组

	//allLockList:null,	   //分析前原始锁数据
	//allLockID:[],          //分析后锁ID数组
 	//mapLocksData:[],       //分析后电子锁数据 (实时监控/轨迹回放 列表)
 	


	choiceSystemID:8,   //所选择系统信息
	remoteUnlockLimits:0,  //远程开锁权限  0无开锁权限 1有开锁权限
	language:'CN',         //全局语言类型  CN 中文  EN 英文
	timeDifferent:0,       //用户时差 按分钟计算 有正负
 	globalMapType :0,      //全局地图类型  0百度地图 1谷歌地图
  	mapType :0 ,           //地图页面  地图类型   0百度地图 1谷歌地图
	LowPowerThreshold:10,  //全局低电量阈值  单位%  小于等于此阈值的  文字标红  class='text-red'

	router:null,	    //保存路由对象
	routerArr:["/"],    //有权限进入的路由数组
	tabNavallwidth:null, //保存 获取顶部选项卡总长度 的function

	tabsData:[] ,   //框架中所选菜单数据
	//油位曲线配置数据
	oilLineChart: {
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

	//快捷键开关
	dialogHotkeys:false,
	hotkeys:null, //快捷键内容
	showImgUrl:null,  //显示查看图片的url
	userCompanyAll:null,     //登录账号管理的所有公司(含子公司)
	userGroupAll:null,     //登录账号的所有公司分组
	treeData:[],           //公司加分组树
	treeDataCompany:[],    //公司树
	allId:[],              //账号的所有公司id
	groupNumber:{},         //统计公司下分组数
    copyVelData:{
		FVehicleName:'',
        FVehicleSerialCode:'',
        FVIN:'',
        FEngineNumber:'',
        FVehicleTypeID:'', 
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
        FOperateType:'',
        FDriverName:'',
        FDescription:'',
        FStatus:1,
        FAssetGUID:'',     //终端唯一标识ID
        FAgentGUID:'',      //代理商ID
        FAdminDriverGUID:'',  //司机id
        ce:'',
        FGroupGUID:''
    },
    copyEquipData: {
		FAssetID:'',
		FAssetTypeID:'',
		FManufactureDate: new Date(),
		FDescription:'',
		FAssetSerialID:'',
		checkList:'',
		FStatus:1,
		FTHS:'',
		FVideo:'',
		FRFID:'',
		FTPMS:'',
		FScreen:'',
		FCamera:'',
		ce:'',        //界面显示混合
		FSIMNumber:'',
		FAgentGUID:'',
		FVehicleGUID:'',
		FGroupGUID:''
	},
	copyDriverData: {
		FDriverName:'',
		FDrivingExp:1,
		FIdentityID:'',
		FSex:1,
		FDrivingNumber:'',
		FDrivingType:'',
		FDrivingStartDate:new Date(),
		FDrivingEndDate:new Date(),
		FPhoneNumber:'',
		FDescription:'',
		FStatus:1,
		ce:'',      //界面显示混合
		FAgentGUID:'',
		FVehicleGUIDs:'',
		FGroupGUID:''
	},
	copycompanyForm:{
		FFatherAgentGUID:'',
		FAgentCode:'',
		FShortName:'',
		FFullName:'',
		FDescribe:'',
		FContacts:'',
		FTelephone:'',
		FEMailAddress:'',
		FContinent:'',
		FCountry:'China',
		FStatus:1,
		FTimeDifferent:'',
		timeZoneSign:'+',
		hour:0,
		minute:0,
		FGroupName:'',
	},
	fenceTeamArr:[], //围栏分组数据数组
	fenceTypeArr:[], //围栏类型数据数组
	fenceTeamObj:null, //围栏分组数据对象
	fenceTypeObj:null, //围栏类型数据对象
	fenceTeamTree:[],  //围栏分组树数据
	fenceTypeTree:[],  //围栏类型树数据
};

//方法 页面调用方法  this.$store.commit('changeTokenID',"parameters")
const mutations={
	goLogin: (state) => {
		window.name="";			//清除登录信息
		sessionStorage.clear();     //清除本地数据
		window.location.href = state.FUserInterfaceAddress
	},
	getAllCarsData: (state, callback) => {
		//请求车队数据
		$.post("/web/Combine/Combine_Common", {
				FTokenID: state.FTokenID,
				FAction: "QueryVehicleOrAssetListByFAgentGUID",
				FAgentGUID: state.companyID,
				FVersion: "1.0.0"
			},
			function (res) {

				console.log("车辆列表原始数据",res);
				//设定顶级公司名称
				let company = [{
					id:"@A"+ state.companyID,
					label:state.companyName,
					parentId:0,
					count:0,
					open: true,
					checked: false,
					nodeSelectNotAll: false,//新增参数，表示父框可以半钩状态
					visible: true,
					searched: false,
					children:[],
					rootType:1
				}];
				let teamID=[];  //分组ID数组
				let teamArr=[];  //分组数组
				let carOrAsset=[]; //车辆或者设备数组
				let eLock=[]; //车辆或者设备数组
				//清空车辆ID数组
				state.allCarsID=[];
				state.allCarsList=[];
				state.LocksTree=[],       //分析后电子锁树形图数据
				state.locksIDArr=[],	    //电子锁ID数组



				//第er次遍历 编译公司 车队 车辆数据
				//@A 表示顶级公司  @B 表示二级公司 @C 表示所有车队
				$.each(res.FObject, function (i, item)  {
					

					if(teamID.indexOf(item.FGroupGUID)==-1){
						let team={
							id: "@C" + item.FGroupGUID,
							label: item.FGroupName,
							parentId:"@A"+ state.companyID,
							count: 0,
							open: false,
							checked: false,
							nodeSelectNotAll: false,//新增参数，表示父框可以半钩状态
							visible: true,
							searched: false,
							children:[],
							rootType:2
						}
						teamID.push(item.FGroupGUID)
						teamArr.push(team)
					};
					
					if (item.FGUID!=null) {
						state.allCarsList.push(item);
						state.allCarsID.push(item.FGUID);
						let asset = {
							id: item.FGUID,
							VehicleID:item.FGUID,
							label: item.FVehicleName,
							subLabel: item.FAssetID,
							assetID: item.FAssetGUID,
							FVehicleGUID: item.FVehicleGUID,
							parentId:"@C"+item.FGroupGUID,
							FAlarmOffLine: item.FAlarmOffLine == null ? 1 : item.FAlarmOffLine,
							FCamera: item.FCamera ? item.FCamera:0,
							FRFID: item.FRFID ? item.FRFID:0,
							FScreen: item.FScreen ? item.FScreen:0,
							FStatus: item.FStatus ? item.FStatus:0,
							FTHS: item.FTHS ? item.FTHS:0,
							FTPMS: item.FTPMS ? item.FTPMS:0,
							FVideo: item.FVideo ? item.FVideo:0,
							ISConfigSensorid: item.ISConfigSensorid ? item.ISConfigSensorid:0,
							IsConfigFuel: item.FIsConfigFuel ? item.FIsConfigFuel:0,
							FVehicleSerialCode: item.FVehicleSerialCode ? item.FVehicleSerialCode:0,
							open: true,
							checked: false,
							nodeSelectNotAll: false,//新增参数，表示父框可以半钩状态
							visible: true,
							searched: false,
							message: null,
							lockStatus: item.FLockStatus ? item.FLockStatus:0, //锁状态
							FAssetTypeID: item.FAssetTypeID,//设备类型
							iconType: item.FAssetTypeID == 701 || item.FAssetTypeID == 735 || item.FAssetTypeID == 740 ? 1 : 0, //图标类型 0车 1锁
							disable: item.FAlarmOffLine || item.FLockStatus || item.FAssetTypeID == 717 || item.FAlarmOffLine == null?true:false
						}
						carOrAsset.push(asset);
						if (asset.iconType===1){
							eLock.push(asset);
							state.locksIDArr.push(item.FGUID)		
						}; 

					}


				});

				state.allCarsData = transTreeData(JSON.parse(JSON.stringify(company.concat(teamArr,carOrAsset))));
				state.LocksTree = transTreeData(JSON.parse(JSON.stringify(company.concat(teamArr,eLock))));
				//测试要求一个分组排序
				state.allCarsData[0].children=state.allCarsData[0].children.sort(function(a,b){
					return b['children'].length-a['children'].length
				});
				console.log("车辆列表",state.allCarsData);
				if (callback != null && callback != "") callback();

				function transTreeData(items) {
					if (items.length > 0) {
						var curparentId = 0 //parentId=0，为最上层节点 ，即无父节点
						var parent = findChild(curparentId,items);//数组
						return parent;
					} else {
						return [];
					}
				}
				//找子节点
				function findChild(curparentId,items) {
					//console.log(curparentId)
					var _arr = [];
					var length = items.length;
					for (var i = 0; i < length; i++) {
						if (items[i].parentId == curparentId) {
							var _obj = items[i];
							//_obj.children = findChild(_obj.id.replace(/@A|@B|@C/g, ''));
							_obj.children = findChild(_obj.id,items);
							$.each(_obj.children, function (index, item) {
								if (item.count != undefined) {
									_obj.count += item.count
								}else {
									_obj.count +=1
								}
							})
							//进行一个简单的排序 有内容的unshift 没内容的push
							if(_obj.count!=0){
								_arr.unshift(_obj);
							}else {
								_arr.push(_obj);
							}
						}
					}
					return _arr;
				}

			})

	},
    //电子锁数据
    getAllLocksData:(state,callback) =>{
		let url,action;

		switch(state.choiceSystemID){
		    case 2:
				url = "/web/Lock/Lock_LBS";
				action = "QueryLBSAssetListByFUserGUID";
				break;
			case 7:
				url = "/web/SmartDistribution/SmartDistribution_LBS";
				action = "QueryLBSAssetListByFUserGUID";
				break;
			default:
				return
		}

		$.post(url, {
				FTokenID: state.FTokenID,
				FAction: action,
				FVersion: "1.0.0"
			},
			function (res) {

				console.log("电子锁设备数据", res);
				if(res.Result==200){
					state.allLockList = res.FObject;
					state.allLocksData = [
						{
							FAssetID: "@A",
							FVehicleName: state.FShortName,
							count: res.FObject.length,
							children: res.FObject
						}
					];
					let lockArr=[];     //电子锁数组
					let lockID=[];     //电子锁ID数组
					res.FObject.map(function(item,index){
						lockID.push(item.FAssetGUID)
						//锁对象 (电子锁系统)
						let aLock = {
							id: item.FAssetGUID,
							label:item.FAssetID,
							subLabel:item.FVehicleName==null?'':item.FVehicleName,
							FVehicleGUID: item.FVehicleGUID,
							parentId:"@A",
							FAlarmOffLine: 0,
							FCamera: 0,
							FRFID: 0,
							FScreen: 0,
							FStatus: 0,
							FTHS: 0,
							FTPMS: 0,
							FVideo:0,
							ISConfigSensorid: 0,
							IsConfigFuel:0,
							FVehicleSerialCode: 0,
							open: true,
							checked: false,
							nodeSelectNotAll: false,//新增参数，表示父框可以半钩状态
							visible: true,
							searched: false,
							message: null,
							lockStatus:item.FLockStatus,
							FIsHaveTrip:item.FIsHaveTrip,
							iconType:1, //图标类型 0车 1锁
						}

						if(state.choiceSystemID===7) aLock.subLabel=null;

						if(item.FVehicleGUID==null || item.FVehicleGUID==""){
							lockArr.push(aLock);

						}else{
							lockArr.unshift(aLock);
							//vehicleIDArr.push(item.FVehicleGUID);
							//lockObj[item.FVehicleGUID]=item;
						}

					})
					state.allLockID = lockID;      //本系统下车辆ID
					//console.log("本系统全部锁ID列表",lockID);
					let maplock = {
						id: "@A",
						label: state.FShortName,
						parentId:0,
						count:lockArr.length,
						open: true,
						checked: false,
						nodeSelectNotAll: false,//新增参数，表示父框可以半钩状态
						visible: true,
						searched: false,
						children:lockArr,
						rootType:1
					};

					state.mapLocksData=[];
					state.mapLocksData.push(JSON.parse(JSON.stringify(maplock)));
				};

				if (callback != null && callback != "") {
					callback();
				}
			})

	},
	//用户公司树
    getuserCompany:(state,n)=>{
    	$.post("web/Combine/Combine_Common", {
				FTokenID: state.FTokenID,
				FAction: "QuerySuperAdminAgentList",
				FVersion: "1.0.0"
			},
		    function (res) {
				console.log("登录账号管理的公司", res);
				state.treeData=[];  
				var allId=[];         //保留所有公司id
				$.each(res.FObject,function (index,obj) {
					obj.isEdit=false;
					obj.type=1;   //区分公司与分组
					allId.push(obj.FGUID)
			    })
			    state.userCompanyAll=JSON.parse(JSON.stringify(res.FObject));   //全部公司数据
			    state.treeDataCompany=transTreeData(state.userCompanyAll);
			   // if(n==1){       //带分组的公司树
			    	$.post("web/Common/Common_Admin", {
						FTokenID: state.FTokenID,
						FAction: "QueryAdminGroupList",
						FVersion: "1.0.0"
					},
					function (res) {
						console.log("登录账号公司分组", res);
						//if(res.FObject.length>=1){
							state.groupNumber={};
							$.each(res.FObject,function (index,obj) {
								obj.FFatherAgentGUID = obj.FAgentGUID;
								obj.FShortName = obj.FGroupName;
								obj.isEdit=false;
								delete obj.FAgentGUID;
								delete obj.FGroupName;
								obj.type=0;   //区分公司与分组
								var r=state.groupNumber[obj.FFatherAgentGUID];
								if(r){
									state.groupNumber[obj.FFatherAgentGUID]+=1;
								}else{
									state.groupNumber[obj.FFatherAgentGUID]=1
								}
						    })
							state.userGroupAll=JSON.parse(JSON.stringify(res.FObject));   //全部公司数据
							let plusArr=state.userGroupAll.concat(JSON.parse(JSON.stringify(state.userCompanyAll)));
							state.treeData=transTreeData(plusArr);
						//}else{
							
							//state.treeData=transTreeData(state.userCompanyAll);
						//}
                        
					})
			    //}
				//下面还要成树
				function transTreeData(items){
					var joinParent=[];
					if(items.length>0){
						for(var m=0;m<items.length;m++){
							if(items[m].FFatherAgentGUID==null||(allId.indexOf(items[m].FFatherAgentGUID)==-1)){
								//var curPid=items[m].FFatherAgentGUID;
								var curPid=items[m].FGUID;
								items[m].children=findChild(curPid,items);

								/*items[m].children.sort(function(a, b) {
									if(state.choiceSystemID==1||state.choiceSystemID==4||state.choiceSystemID==6){
										return b.FVehicleCount - a.FVehicleCount;
									}else{
										return b.FAssetCount - a.FAssetCount;
									}

								});*/
								joinParent.push(items[m]);
								/*var parent=findChild(curPid,items);
								var joinParent=joinParent.concat(parent);*/
							}
						}
						return joinParent
					}else{
						return []
					}
				};

				function findChild(curPid,items) {
					var _arr = [];
					for (var i = 0; i <items.length; i++) {
						if (items[i].FFatherAgentGUID == curPid) {
							var _obj = items[i];
							_obj.children = findChild(_obj.FGUID,items);
							_arr.push(_obj);
							_arr.sort(function(a, b) {
								if(state.choiceSystemID==1||state.choiceSystemID==4||state.choiceSystemID==6){
									return b.FVehicleCount - a.FVehicleCount;
								}else{
									return b.FAssetCount - a.FAssetCount;
								}
							});
						}
					}
					return _arr;
				};
			})
    },
	/**
	 *
	 @method changeRoute (跳转路由)   调用 this.$store.commit("changeRoute", routeData);
	 *
	 @param {object} state     vuex状态参数
	 @param {object} routeData  {tabsText: '名称',router: 'routerPath'}
	 @param {function} callback  回调函数
	 *
	 @return {返回值类型} 无
	 */
	changeRoute:(state ,routeData, callback) =>{
		console.log('tab',window.sessionStorage.tabsData);
		if(typeof window.sessionStorage.tabsData!="undefined" && window.sessionStorage.tabsData!="") state.tabsData=JSON.parse(window.sessionStorage.tabsData);
		if (typeof window.sessionStorage.tabsData=="undefined" || window.sessionStorage.tabsData.indexOf(routeData.router) === -1) {
			state.tabsData.push(routeData);
			window.sessionStorage.tabsData=JSON.stringify(state.tabsData);
			setTimeout(function(){
				state.tabNavallwidth()
			},100)
		}
		//state.router.push(routeData.router);
	},
	//获取围栏数据 vue传入对象指针this
	getFenceData:(state,vue)=>{
		let postData={
			FTokenID: state.FTokenID,
			FAgentGUID: state.companyID,
			FAction:"QueryLBSGISFenceInfo",
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
			data:JSON.stringify(postData) ,
			success: function (res) {
				console.log("围栏数据",res);
				if(res.Result!=200) return;
				let fenceTeam=res.FObject.Table,
					fenceType=res.FObject.Table1,
					fenceData=res.FObject.Table2,
					teamObj = new Object(),
					teamTreeArr = [],
					teamArr=[],
					typeObj = new Object(),
					typeArr=[],					
					typeTreeArr = [];
				//分组树数据处理
				teamObj["none"]={
					name:"_未分组_",
					des:"",
					index:0,
					fenceArr:[]	
				};
				teamTreeArr.push({
					id:"none",
					label:"_未分组_",
					parentId:"@E",
					checked: false,
					visible: true,
					searched: false,
					open:false,
					children: [],
					count:0,
					iconType:4, //图标类型 0根节点图标 1公司节点图标 3 围栏图标  4分组图标
				});
				fenceTeam.map(function(item,index){
					//获得分组对象 后面围栏获得分组名称使用
					let oneTeam={
						name:item.FGroupName,
						ID:item.FGUID,
						des:item.FDescribe,
						index:index+1,
						fenceArr:[]
					};
					teamObj[item.FGUID]=oneTeam;
					teamArr.push(oneTeam);
					//分组树数据
					let treeTeam={
						id:item.FGUID,
						label:item.FGroupName,
						parentId:"@F",
						checked: false,
						visible: true,
						searched: false,
						open:false,
						children: [],
						count:0,
						iconType:4, //图标类型 0根节点图标 1公司节点图标 3 围栏图标  4分组图标
					};
					teamTreeArr.push(treeTeam)
				});
				

				//类型树数据处理
				fenceType.map(function (item, index) {
					let oneType={
						ID: item.FGUID,
						icon: item.FIcon,
						name: item.FName,
						strokeColor: item.FStrokeColor,
						fillColor: item.FFillColor,
						index:index,
						fenceArr:[]
					};
					typeObj[item.FGUID] =oneType;
					typeArr.push(oneType); 
					let treeType = {
						id:item.FGUID,
						label:item.FName,
						parentId:"@E",
						strokeColor: item.FStrokeColor,
						fillColor: item.FFillColor,
						icon: item.FIcon,
						checked: false,
						visible: true,
						searched: false,
						open:false,
						children: [],
						count:0,
						iconType:3, //图标类型 0车 1锁 3 围栏图标
					};
					typeTreeArr.push(treeType);
				})


				teamObj['all'] = new Array;
				typeObj['all'] = new Array;

				
				//围栏数据处理
				for (let index = 0; index < fenceData.length; index++) {
					const item = fenceData[index];
					//服务器存储的为WGS-84 坐标  需进行一下转换
					//转换中心点坐标
					let p={
						lng: item.FCenterLon,
						lat: item.FCenterLat
					};
					let centerPoint=vue.parsePoint(state.mapType,p);

					//转换围栏顶点坐标数组
					let fencePath=null
					if(item.FPath != "*"){
						fencePath=[];
						JSON.parse(item.FPath).map(function (item,index) {
							fencePath.push(vue.parsePoint(state.mapType,item));
						})
					}
					let teamID=item.FGISFenceTypeGroupGUID===null||item.FGISFenceTypeGroupGUID==="00000000-0000-0000-0000-000000000000"?"none":item.FGISFenceTypeGroupGUID;

					if (typeof typeObj[item.FFenceTypeGUID]==="undefined") break;
					let obj = {
						ID: item.FGUID,
						name: item.FName,	 //围栏名称
						number: item.FNumber == "*" ? "" : item.FNumber,   //自定义编号
						remark: item.FRemark == "*" ? "" : item.FRemark,   //备注
						area: item.FArea,     //面积
						formType: item.FFormType,     //类型  1圆 2矩形 3多边形
						fenceType: item.FFenceTypeGUID, //类型ID
						typeName: typeObj[item.FFenceTypeGUID].name,
						teamID:teamID,//分组ID
						teamName:teamObj[teamID].name, //分组名称
						path: fencePath,     //多边形&&矩形 各顶点坐标数组  {lng:"",lat:""}
						radius: item.FRadius,   //圆形半径
						center: centerPoint,            //围栏近似中心点坐标
						address: item.FAddress, //围栏近似中心点地址
						index: null,
						state: item.FStatus==1?true:false     //围栏状态
					};
					//console.log(obj);
					typeObj['all'].push(obj);
					typeObj[obj.fenceType].fenceArr.push(obj);
					teamObj['all'].push(obj);
					teamObj[obj.teamID].fenceArr.push(obj);

					//类型树数据填充
					typeTreeArr[typeObj[obj.fenceType].index].count=typeObj[obj.fenceType].fenceArr.length;
					typeTreeArr[typeObj[obj.fenceType].index].children.push({
						id:obj.ID,
						label:obj.name,
						parentId:obj.fenceType,
						strokeColor: typeObj[obj.fenceType].strokeColor,
						fillColor: typeObj[obj.fenceType].fillColor,
						icon: typeObj[obj.fenceType].icon,
						visible: true,
						searched: false,
						checked: false,
						iconType:2, //图标类型 0车 1锁 2 围栏类型 3围栏个体
					});
					//分组树数据填充
					teamTreeArr[teamObj[obj.teamID].index].count=teamObj[obj.teamID].fenceArr.length;
					teamTreeArr[teamObj[obj.teamID].index].children.push({
						id:obj.ID,
						label:obj.name,
						parentId:obj.teamID,
						strokeColor: typeObj[obj.fenceType].strokeColor,
						fillColor: typeObj[obj.fenceType].fillColor,
						icon: typeObj[obj.fenceType].icon,
						visible: true,
						searched: false,
						checked: false,
						iconType:2, //图标类型 0车 1锁 2 围栏类型 3围栏个体
					});
					
				}
				

				let allCount=fenceData.length;
				state.fenceTypeTree = [{
					id: "@E",
					label: "_全部围栏类型_",
					parentId:0,
					count:allCount,
					open: true,
					checked: false,
					nodeSelectNotAll: false,//新增参数，表示父框可以半钩状态
					visible: true,
					searched: false,
					children: typeTreeArr,
					rootType:1,
					iconType:1, 
				}];
				state.fenceTypeTree[0].children.sort(function (a,b) {
					return b.count-a.count
				});


				state.fenceTeamTree = [{
					id: "@F",
					label: "_全部围栏分组_",
					parentId:0,
					count:allCount,
					open: true,
					checked: false,
					nodeSelectNotAll: false,//新增参数，表示父框可以半钩状态
					visible: true,
					searched: false,
					children: teamTreeArr,
					rootType:1,
					iconType:1, 
				}];
				
				state.fenceTeamTree[0].children.sort(function (a,b) {
					return b.count-a.count
				});
				
				
				state.fenceTeamArr=teamArr;
				state.fenceTypeArr=typeArr;
				state.fenceTeamObj=teamObj;
				state.fenceTypeObj=typeObj;

				

			}
		})
	}

}


export default new Vuex.Store({
	state,mutations
})


