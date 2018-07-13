// router
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store.js'

import home from './components/Common/home.vue'


/**********************************  同步加载    ******************************/
//位置服务
import monitor from 'components/MTM/Monitor.vue'
import historical_route from 'components/MTM/historical_route.vue'
import fence_manage from 'components/MTM/fence_manage.vue'
import all_list from 'components/Common/all_list.vue'

//报警报表
import alarm_list from './components/Common/alarm_list.vue'
// import fatigueDrivingAlarm from './components/Trailer/fatigueDrivingAlarm.vue'
// import speedAlarm from './components/Trailer/speedAlarm.vue'
// import DeviceAlarm from './components/Trailer/deviceOffline.vue'
// import stopAlarm from './components/Trailer/stopAlarm.vue'
// import lowBatteryAlarm from './components/Trailer/lowBatteryAlarm.vue'
//管理员
import user from './components/Admin/user.vue'
import juese from './components/Admin/juese.vue'
import vehicalmanage from './components/Admin/vehicalManage.vue'
import equipment from './components/Admin/Equipment-manage.vue'
import companyManage from './components/Admin/companyManage.vue'
import sim from './components/Admin/SIM-manage.vue'
import driver from './components/Admin/driver.vue'
import containerManage from './components/Admin/containerManage.vue'


//报表分析
import xingshi from './components/Report/xingshi.vue'  //行驶统计
import xiaolv from './components/Report/xiaolv.vue'		//运行效率
import lishiguiji from './components/Report/lishiguiji.vue' //历史轨迹
import park from './components/Report/park.vue'				//停车报表
import TrailerReport from './components/Report/TrailerReport.vue' //接甩挂分析
import OilWear from './components/Report/OilWear.vue' //油耗分析
import TireTrack from './components/Report/TireTrack.vue' //胎压曲线
import temperatureCurve from './components/Report/temperatureCurve.vue'  //温度曲线
import onOffReport from './components/Report/onOffReport.vue'    //开关门报表
import tripReport from './components/Report/tripReport.vue'          //开关锁报表


//设置
import changePassword from'./components/Config/changePassword.vue' //终端密码维护
import cardConfig from './components/Config/cardConfig.vue'		//RFID 授权
import sensorConfig from './components/Config/sensorConfig.vue' //温度传感器配置
import alarmconfiggather from './components/Config/AlarmConfigGather.vue' //报警设置
import white_list_config from './components/Config/white_list_config.vue' //胎压白名单设置
import system_config from './components/Config/system_config.vue' //系统设置
import TPMS_config from './components/Config/TPMS_config.vue' //胎压传感器设置
import OilBoxConfig from './components/Config/OilBoxConfig.vue' //油箱配置
import command from './components/Config/command.vue' //指令发送


//消息中心
import systemInfo from './components/Message/systemInfo.vue'
import event from './components/Message/event.vue'

//温度监控
import temperatureAlarm from './components/CCl/temperatureAlarm.vue'
import alarmConfig from './components/CCl/alarmConfig.vue'

//智能电子锁
import remoteUnlock from'./components/EL/remoteUnlock.vue'
import UnlockConfig from'./components/EL/UnlockConfig.vue'
import switchLock from'./components/EL/switchLock.vue'
import abnormal from'./components/EL/abnormal.vue'

import lockAlarmConfig from './components/EL/lockAlarmConfig.vue'



//智能配送
// import scheduling from './components/EL/scheduling'

//智能集装箱
import ContainerTrackReport from './components/Container/ContainerTrackReport.vue'
import ContainerTemperatureCurve from './components/Container/ContainerTemperatureCurve.vue'

// import TireTemAlarm from './components/Trailer/TireTemAlarm.vue' //胎温胎压报警

//智能配送
// import shipmentsReport from './components/IPS/shipmentsReport.vue'//发货报表
// import abnormalReport from './components/IPS/abnormalReport.vue'//异常报表
// import UnlockTimesCounting from './components/IPS/UnlockTimesCounting.vue'//发货单开锁统计
// import distributionManagement from './components/IPS/distributionManagement.vue'//配送点管理
// import switchLockReport from './components/IPS/switchLockReport.vue'//开关锁报表


/***************************************  异步加载    *************************************/
////位置服务
//const monitor = r => require.ensure([], () => r(require('components/Trailer/MTM/Monitor.vue')))
//const historical_route = r => require.ensure([], () => r(require('components/Trailer/MTM/historical_route.vue')))
//
////胎压监控
//const TireTrack = r => require.ensure([], () => r(require('./components/Trailer/TireTrack.vue')))
//const TireTemAlarm = r => require.ensure([], () => r(require('./components/Trailer/TireTemAlarm.vue')))
//
////报警报表
//const fatigueDrivingAlarm = r => require.ensure([], () => r(require('./components/Trailer/fatigueDrivingAlarm.vue')))
//const speedAlarm = r => require.ensure([], () => r(require('./components/Trailer/speedAlarm.vue')))
//const DeviceAlarm = r => require.ensure([], () => r(require('./components/Trailer/deviceOffline.vue')))
//const stopAlarm = r => require.ensure([], () => r(require('./components/Trailer/stopAlarm.vue')))
//const lowBatteryAlarm = r => require.ensure([], () => r(require('./components/Trailer/lowBatteryAlarm.vue')))
//
////管理员
//const user = r => require.ensure([], () => r(require('./components/Common/user.vue')))
//const juese = r => require.ensure([], () => r(require('./components/Common/juese.vue')))
//const vehicalmanage = r => require.ensure([], () => r(require('./components/Trailer/vehicalManage.vue')))
//const equipment = r => require.ensure([], () => r(require('./components/Common/Equipment-manage.vue')))
//const companyManage = r => require.ensure([], () => r(require('./components/Common/companyManage.vue')))
//const sim = r => require.ensure([], () => r(require('./components/Common/SIM-manage.vue')))
//const driver = r => require.ensure([], () => r(require('./components/Common/driver.vue')))
//const motorcade = r => require.ensure([], () => r(require('./components/Common/motorcade.vue')))
//
////报表分析
//const xingshi = r => require.ensure([], () => r(require('./components/Common/xingshi.vue')))
//const xiaolv = r => require.ensure([], () => r(require('./components/Common/xiaolv.vue')))
//const lishiguiji = r => require.ensure([], () => r(require('./components/Common/lishiguiji.vue')))
//const park = r => require.ensure([], () => r(require('./components/Common/park.vue')))
//
////接甩挂分析
//const TrailerReport = r => require.ensure([], () => r(require('./components/Trailer/TrailerReport.vue')))
//
////报警设置
//const alarmconfiggather = r => require.ensure([], () => r(require('./components/Common/AlarmConfigGather.vue')))
//
////消息中心
//const systemInfo = r => require.ensure([], () => r(require('./components/Common/systemInfo.vue')))
//const event = r => require.ensure([], () => r(require('./components/Common/event.vue')))
//
////温度监控
//const temperatureCurve = r => require.ensure([], () => r(require('./components/CCl/temperatureCurve.vue')))
//const temperatureAlarm = r => require.ensure([], () => r(require('./components/CCl/temperatureAlarm.vue')))
//const sensorConfig = r => require.ensure([], () => r(require('./components/CCl/sensorConfig.vue')))
//const alarmConfig = r => require.ensure([], () => r(require('./components/CCl/alarmConfig.vue')))
//
//
////智能电子锁
//const remoteUnlock = r => require.ensure([], () => r(require('./components/EL/remoteUnlock.vue')))
//const UnlockConfig = r => require.ensure([], () => r(require('./components/EL/UnlockConfig.vue')))
//const switchLock = r => require.ensure([], () => r(require('./components/EL/switchLock.vue')))
//const abnormal = r => require.ensure([], () => r(require('./components/EL/abnormal.vue')))
//const changePassword = r => require.ensure([], () => r(require('./components/EL/changePassword.vue')))
//
//
////油耗分析
//const OilWear = r => require.ensure([], () => r(require('./components/FM/OilWear.vue')))
//const OilBoxConfig = r => require.ensure([], () => r(require('./components/FM/OilBoxConfig.vue')))


Vue.use(VueRouter)
import index from './index'

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   render: h => h(App)
// })
// 0. 如果使用模块化机制编程， 要调用 Vue.use(VueRouter)

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点在讨论嵌套路由。
const routes = [
	{ name:"home", path: '/',component: home},

	//位置服务
	{ name:"monitor", path: '/monitor', component: monitor},
	{ name:"historical_route", path: '/historical_route', component: historical_route},
	{ name:"fence_manage", path: '/fence_manage', component: fence_manage},
	{ name:"all_list", path: '/all_list', component: all_list},

	//报警报表
	{ path: '/alarm_list',component:alarm_list},

	//管理员
	{ name:"vehicalmanage", path:'/vehicalManage',component:vehicalmanage},
	{ path: '/user',component: user},
	{ path: '/juese',component:juese},
	{ path: '/companyManage',component:companyManage},
	{ path: '/sim',component:sim},
	{ path: '/driver',component:driver},
	{ path:'/containerManage',component:containerManage},  //集装箱管理
	{ path: '/equipment',component:equipment},

	//报表分析
	{ path: '/xingshi',component: xingshi},
	{ path: '/xiaolv',component: xiaolv},
	{ path: '/lishiguiji',component: lishiguiji},
	{ path: '/park',component: park},
	{ path:'/OilWear',component:OilWear},
	{ path: '/TireTrack',component:TireTrack },
	{ path:'/temperatureCurve',component:temperatureCurve},
	{ path:'/TrailerReport',component:TrailerReport},//接甩挂分析
	{ path: '/onOffReport', component: onOffReport},  //开关门报表
	{ name: 'tripReport', path:'/tripReport', component: tripReport },   //开关锁报表                     //趟次报表

	//设置
	{ path:'/changePassword',component:changePassword},  //终端密码维护
	{ path:'/cardConfig', component: cardConfig },       //RFID卡授权
    { path:'/sensorConfig',component:sensorConfig},      //温度传感器配置
	{ path: '/alarmconfiggather',component:alarmconfiggather}, //报警设置
	{ path: '/white_list_config',component:white_list_config}, //胎压白名单设置
	{ path: '/system_config',component:system_config}, //系统设置
	{ path: '/TPMS_config',component:TPMS_config}, //胎压传感器设置
	{ path: '/command', component: command}, //指令发送
	{ path:'/OilBoxConfig',component:OilBoxConfig}, //油箱配置

	
	//消息中心
	{ path: '/systemInfo',component:systemInfo},
	{ name:"event", path: '/event',component:event},



	// { path: '/TireTemAlarm',component:TireTemAlarm },//胎压报警	
	// { path: '/fatigueDrivingAlarm',component:fatigueDrivingAlarm},
	// { path:'/speedAlarm',component:speedAlarm},
	// { path:'/DeviceAlarm', component:DeviceAlarm},
	// { path:'/stopAlarm', component:stopAlarm},
    // { path:'/lowBatteryAlarm', component:lowBatteryAlarm},
	// { path:'/switchLock',component:switchLock},                          //
	// { path:'/abnormal',component:abnormal},                               //开关锁异常报表
	// { path:'/temperatureAlarm',component:temperatureAlarm}, //温度报警


	
	
	//温度监控
	
    { path:'/alarmConfig',component:alarmConfig},    //传感器报警配置
    //智能电子锁
    { name:"remoteUnlock", path:'/remoteUnlock',component:remoteUnlock},  //远程开锁指令
    { name:"UnlockConfig", path:'/UnlockConfig',component:UnlockConfig},  //开锁围栏设置
	{ path:'/lockAlarmConfig', component: lockAlarmConfig },              //终端报警设置

	
	//智能配送
	// { path: '/scheduling', component: scheduling},  //实时调度

    //智能集装箱
    { path: '/ContainerTrackReport', component: ContainerTrackReport},//历史轨迹报表
    { path: '/ContainerTemperatureCurve', component: ContainerTemperatureCurve},//箱温曲线

    //智能配送
    // { name:"shipmentsReport", path: '/shipmentsReport', component: shipmentsReport},//发货报表
    // { path: '/abnormalReport', component: abnormalReport},//异常报表
	// { path: '/UnlockTimesCounting', component: UnlockTimesCounting},//发货单开锁统计
	// { path: '/distributionManagement', component: distributionManagement },//配送点管理
	// { path: '/switchLockReport', component: switchLockReport },//开关锁报表
	// { path: '/command', component: command }, //指令发送
]


// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
	mode: 'hash',
	hashbang: true,
	routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
	 store,
	router,
	render: h => h(index)
}).$mount('#app')

// 现在，应用已经启动了！

//路由守卫  根据用户权限限制用户页面访问权限
router.beforeEach((to, from, next) => {
	//console.log("有权限的路由",store.state.routerArr)
	//console.log("进入的路由",to);
	if(to.path=="/" ||store.state.routerArr.indexOf(to.path.replace("/",""))>=0){
		next()
	}else {
		next(false)
	}

});
