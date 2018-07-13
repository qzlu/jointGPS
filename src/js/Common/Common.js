/**
 * Created by JiaXin on 2017/6/22.
 */
import booleanPointInPolygon from 'js/GIS/@turf/boolean-point-in-polygon';
let GPS = {
	PI: 3.14159265358979324,
	x_pi: 3.14159265358979324 * 3000.0 / 180.0,
	delta: function (lat, lng) {
		// Krasovsky 1940
		//
		// a = 6378245.0, 1/f = 298.3
		// b = a * (1 - f)
		// ee = (a^2 - b^2) / a^2;
		var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
		var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
		var dLat = this.transformLat(lng - 105.0, lat - 35.0);
		var dlng = this.transformLng(lng - 105.0, lat - 35.0);
		var radLat = lat / 180.0 * this.PI;
		var magic = Math.sin(radLat);
		magic = 1 - ee * magic * magic;
		var sqrtMagic = Math.sqrt(magic);
		dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
		dlng = (dlng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
		return { 'lat': dLat, 'lng': dlng };
	},

	//WGS-84 to GCJ-02
	gcj_encrypt: function (wgsLat, wgslng) {
		if (this.outOfChina(wgsLat, wgslng)) return { 'lat': wgsLat, 'lng': wgslng };

		var d = this.delta(wgsLat, wgslng);
		return { 'lat': wgsLat + d.lat, 'lng': wgslng + d.lng };
	},
	//GCJ-02 to WGS-84
	gcj_decrypt: function (gcjLat, gcjlng) {
		if (this.outOfChina(gcjLat, gcjlng))
			return { 'lat': gcjLat, 'lng': gcjlng };

		var d = this.delta(gcjLat, gcjlng);
		return { 'lat': gcjLat - d.lat, 'lng': gcjlng - d.lng };
	},
	//GCJ-02 to WGS-84 exactly
	gcj_decrypt_exact: function (gcjLat, gcjlng) {
		var initDelta = 0.01;
		var threshold = 0.000000001;
		var dLat = initDelta, dlng = initDelta;
		var mLat = gcjLat - dLat, mlng = gcjlng - dlng;
		var pLat = gcjLat + dLat, plng = gcjlng + dlng;
		var wgsLat, wgslng, i = 0;
		while (1) {
			wgsLat = (mLat + pLat) / 2;
			wgslng = (mlng + plng) / 2;
			var tmp = this.gcj_encrypt(wgsLat, wgslng)
			dLat = tmp.lat - gcjLat;
			dlng = tmp.lng - gcjlng;
			if ((Math.abs(dLat) < threshold) && (Math.abs(dlng) < threshold))
				break;

			if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
			if (dlng > 0) plng = wgslng; else mlng = wgslng;

			if (++i > 10000) break;
		}
		return { 'lat': wgsLat, 'lng': wgslng };
	},
	//GCJ-02 to BD-09
	bd_encrypt: function (gcjLat, gcjlng) {
		var x = gcjlng, y = gcjLat;
		var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
		var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
		var bdlng = z * Math.cos(theta) + 0.0065;
		var bdLat = z * Math.sin(theta) + 0.006;
		return { 'lat': bdLat, 'lng': bdlng };
	},
	//BD-09 to GCJ-02
	bd_decrypt: function (bdLat, bdlng) {
		var x = bdlng - 0.0065, y = bdLat - 0.006;
		var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
		var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
		var gcjlng = z * Math.cos(theta);
		var gcjLat = z * Math.sin(theta);
		return { 'lat': gcjLat, 'lng': gcjlng };
	},
	//WGS-84 to Web mercator
	//mercatorLat -> y mercatorlng -> x
	mercator_encrypt: function (wgsLat, wgslng) {
		var x = wgslng * 20037508.34 / 180.;
		var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
		y = y * 20037508.34 / 180.;
		return { 'lat': y, 'lng': x };
		/*
		 if ((Math.abs(wgslng) > 180 || Math.abs(wgsLat) > 90))
		 return null;
		 var x = 6378137.0 * wgslng * 0.017453292519943295;
		 var a = wgsLat * 0.017453292519943295;
		 var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
		 return {'lat' : y, 'lng' : x};
		 //*/
	},
	// Web mercator to WGS-84
	// mercatorLat -> y mercatorlng -> x
	mercator_decrypt: function (mercatorLat, mercatorlng) {
		var x = mercatorlng / 20037508.34 * 180.;
		var y = mercatorLat / 20037508.34 * 180.;
		y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
		return { 'lat': y, 'lng': x };
		/*
		 if (Math.abs(mercatorlng) < 180 && Math.abs(mercatorLat) < 90)
		 return null;
		 if ((Math.abs(mercatorlng) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
		 return null;
		 var a = mercatorlng / 6378137.0 * 57.295779513082323;
		 var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
		 var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
		 return {'lat' : y, 'lng' : x};
		 //*/
	},
	// two point's distance
	distance: function (latA, lngA, latB, lngB) {
		var earthR = 6371000.;
		var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lngA - lngB) * this.PI / 180);
		var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
		var s = x + y;
		if (s > 1) s = 1;
		if (s < -1) s = -1;
		var alpha = Math.acos(s);
		var distance = alpha * earthR;
		return distance;
	},
	outOfChina: function (lat, lng) {
		if (lng < 72.004 || lng > 137.8347) return true;
		if (lat < 5 || lat > 55.8271) return true;

		var pt = turf.point([lng, lat]);
		//下面为中国轮廓数据(非精确)
		var poly = turf.polygon([[
			[87.409554, 49.168951],
			[90.279532, 47.712378],
			[91.125808, 45.493742],
			[95.504365, 44.343478],
			[104.99737, 41.753383],
			[111.951548, 45.078147],
			[115.483829, 47.848784],
			[121.922883, 53.673221],
			[131.011148, 48.169766],
			[134.837785, 48.464274],
			[132.482931, 45.025982],
			[124.535299, 39.908958],
			[122.474802, 22.437462],
			[119.089699, 17.71086],
			[115.557418, 7.901854],
			[110.258997, 11.551766],
			[107.536197, 20.716658],
			[106.174797, 23.153915],
			[102.642516, 22.471665],
			[101.3915, 21.166046],
			[97.564862, 23.967994],
			[97.564862, 24.103175],
			[97.859219, 28.154253],
			[86.673662, 28.023721],
			[78.431673, 32.056196],
			[73.354019, 39.024843],
			[79.903457, 44.738218],
			[87.409554, 49.168951]
		]]);

		return !turf.booleanPointInPolygon(pt, poly);


		// if (lng < 72.004 || lng > 137.8347)
		// 	return true;
		// if (lat < 18.173 || lat > 55.8271)
		// 	return true;
		// return false;
	},
	transformLat: function (x, y) {
		var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
		ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
		return ret;
	},
	transformLng: function (x, y) {
		var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
		ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
		return ret;
	}
};

export default {
	install(Vue, options) {

		/*二/三元素高度弹性布局
		 *childFocus  焦点元素ID
		 *father      父元素ID
		 *childTop    子元素A ID
		 *childBot    子元素B ID 为空则为两元素弹性布局
		 */
		Vue.prototype.elementsFlex = function (childFocus, father, childA, childB, onlyNum) {
			let focus = $("#" + childFocus);
			let fatherHeight = $("#" + father).height();
			let childAHeight = $("#" + childA).height();
			let childBHeight;
			if (childB == null || childB == "") {
				childBHeight = 0;
			} else {
				childBHeight = $("#" + childB).height();
			}
			var Num = "";
			if (onlyNum) {
				return Num = fatherHeight - childAHeight - childBHeight - 20
			} else {
				focus.height(fatherHeight - childAHeight - childBHeight - 20);
			}

			//console.log(fatherHeight,childAHeight,childBHeight);
		};
		//获取元素到浏览器上部和左侧的像素
		Vue.prototype.getDivPoint = (div) => {
			var t = div.offsetTop; //获取该元素对应父容器的上边距
			var l = div.offsetLeft; //对应父容器的上边距
			//判断是否有父容器，如果存在则累加其边距
			while (div = div.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
				t += div.offsetTop; //叠加父容器的上边距
				l += div.offsetLeft; //叠加父容器的左边距
			}
			return { top: t, left: l }
		};


		//转换时间戳
		Vue.prototype.GetDateSeconds = (datestr) => {
			var date = new Date($.trim(datestr).replace(/-/g, "/"));
			var DefaultDate = new Date("2016/06/06 06:06:00");
			var date1 = new Date();
			var seconds = ((date.getTime() - DefaultDate.getTime()) / 1000) + date1.getTimezoneOffset() * 60;
			return seconds;
		}
		//解析时间戳
		Vue.prototype.transDate = function (date) {
			var DefaultDate = new Date("2016/06/06 06:06:06");

			function GetTimeZone() {
				var date1 = new Date();
				var a = date1.getTimezoneOffset() * 60;
				return a;
			}

			var m = parseInt(date - GetTimeZone());
			DefaultDate.setSeconds(m);
			// alert("3." + DefaultDate.pattern("yyyy-MM-dd HH:mm:ss"));
			Date.prototype.pattern = function (fmt) {

				var o = {

					"M+": this.getMonth() + 1, //月份

					"d+": this.getDate(), //日

					"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时

					"H+": this.getHours(), //小时

					"m+": this.getMinutes(), //分

					"s+": this.getSeconds(), //秒

					"q+": Math.floor((this.getMonth() + 3) / 3), //季度

					"S": this.getMilliseconds() //毫秒

				};

				var week = {

					"0": "\u65e5",

					"1": "\u4e00",

					"2": "\u4e8c",

					"3": "\u4e09",

					"4": "\u56db",

					"5": "\u4e94",

					"6": "\u516d"

				};

				if (/(y+)/.test(fmt)) {

					fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

				}

				if (/(E+)/.test(fmt)) {

					fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);

				}

				for (var k in o) {

					if (new RegExp("(" + k + ")").test(fmt)) {

						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

					}

				}

				return fmt;

			}

			return DefaultDate.pattern("yyyy-MM-dd HH:mm:ss");
		};
		//highchart 解析时间戳  国际惯例
		Vue.prototype.getUTCTime = function (t) {
			//let str = result[i].FGPSDateTime;
			let year = t.substring(0, 4);
			let month = t.substring(5, 7);
			let day = t.substring(8, 10);
			let hour = t.substring(11, 13);
			let minutes = t.substring(14, 16);
			let seconds = t.substring(17, 19);
			return Date.UTC(year, month - 1, day, hour, minutes, seconds);
		};
		//将秒数转换成时间格式
		Vue.prototype.formatSeconds = (value) => {
			if (isNaN(parseInt(value)) || value < 0) return "--";
			var theTime = parseInt(value);// 秒
			var theTime1 = 0;// 分
			var theTime2 = 0;// 小时
			var theTime3 = 0;// 天
			if (theTime > 60) {
				theTime1 = parseInt(theTime / 60);
				theTime = parseInt(theTime % 60);
				if (theTime1 > 60) {
					theTime2 = parseInt(theTime1 / 60);
					theTime1 = parseInt(theTime1 % 60);
					if (theTime2 > 24) {
						theTime3 = parseInt(theTime2 / 24);
						theTime2 = parseInt(theTime2 % 24);
					}
				}
			}
			//精确到时分  忽略秒
			var result = "";
			if (theTime3 > 0) {
				result += "" + parseInt(theTime3) + "_天_";
			}
			if (theTime2 > 0) {
				result += "" + parseInt(theTime2) + "_时_";
			}
			if (theTime1 > 0) {
				result += "" + parseInt(theTime1) + "_分_";
			}
			if (theTime2 == 0 && theTime1 == 0) {
				if (theTime == 0) {
					result += 0;
				} else {
					result += "" + parseInt(theTime) + "_秒_";
				}


			}

			//精确到时分秒
			/*var result = "" + parseInt(theTime) + " " + "秒";
			 if (theTime1 > 0) {
			 result = "" + parseInt(theTime1) + " " + "分" + result;
			 }
			 if (theTime2 > 0) {
			 result = "" + parseInt(theTime2) + " " + "时" + result;
			 }*/
			return result;
		};
		//将分钟转换成天/小时/分钟格式
		Vue.prototype.formatMinute = (value) => {
			if (value == null || value < 0) {
				return "--";
			}
			if (value < 60) {
				let m = value + "_分_";
				return m;
			}
			if (value > 60 && value < 1440) {
				let h = (value - value % 60) / 60;
				let m = value % 60;
				return h + "_时_" + m + "_分_";
			}
			if (value > 1440) {
				let m = (value % 1440) % 60;
				let h = ((value % 1440) - (value % 1440) % 60) / 60;
				let d = (value - value % 1440) / 1440;
				return d + "_天_" + h + "_时_" + m + "_分_";
			}
		};
		//将秒数转换成 小时和分钟
		Vue.prototype.parseHAndM = (value) => {
			if (isNaN(parseInt(value))) return { H: 0, M: 0 };
			var theTime = parseInt(value);// 秒
			var theTime1 = 0;// 分
			var theTime2 = 0;// 小时
			if (theTime > 60) {
				theTime1 = parseInt(theTime / 60);
				theTime = parseInt(theTime % 60);
				if (theTime1 > 60) {
					theTime2 = parseInt(theTime1 / 60);
					theTime1 = parseInt(theTime1 % 60);
				}
			}
			//精确到时分  忽略秒
			let H, M;
			H = parseInt(theTime2);
			M = parseInt(theTime1);

			return { H: H, M: M };
		};
		//计算时间差值
		Vue.prototype.getTimeDifference = (startTime, endTime) => {
			if (startTime == null || endTime == null || startTime == "--" || endTime == "--") return "--";
			let stratVal = Vue.prototype.GetDateSeconds(startTime),
				endVal = Vue.prototype.GetDateSeconds(endTime);
			return Vue.prototype.formatSeconds(endVal - stratVal);
		},
			//用户时差与默认时差
			Vue.prototype.parseUser = (time) => {
				if (time === 0) {
					return moment().utc().format("YYYY-MM-DD HH:mm:ss")
				} else {
					let t = window.sessionStorage.timeDifferent - 0;
					let uom1 = new Date(new Date(moment(time)).getTime() - t * 60 * 1000);
					var year = uom1.getFullYear();
					var month = (uom1.getMonth() + 1).toString().length == 1 ? "0" + (uom1.getMonth() + 1).toString() : (uom1.getMonth() + 1);
					var date = uom1.getDate().toString().length == 1 ? "0" + uom1.getDate() : uom1.getDate();
					var hour = uom1.getHours().toString().length == 1 ? "0" + uom1.getHours() : uom1.getHours();
					var minute = uom1.getMinutes().toString().length == 1 ? "0" + uom1.getMinutes() : uom1.getMinutes();
					var second = uom1.getSeconds().toString().length == 1 ? "0" + uom1.getSeconds() : uom1.getSeconds();
					return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
				}
			};
		//格林尼治时间转换本地时间 time格式为 2017-08-11T12:25:25 服务器返回时间
		Vue.prototype.parseGMT = (time) => {
			let t = window.sessionStorage.timeDifferent - 0;   //转换为分钟
			if (time == null || time == "") {
				return "--";
			} else {
				return moment.parseZone(time + "+00:00").utcOffset(t).format("YYYY-MM-DD HH:mm:ss");
			}
		};
		//本地时间转换格林尼治时间   time为空时获得当前时间的UTC格式 time格式为 2017-08-11 12:25:25（中间为空格不带T）
		Vue.prototype.parseUTC = (time) => {
			//let t=window.sessionStorage.timeDifferent-0;   //转换为分钟
			//let zone=moment().utcOffset(t).format('Z');
			if (time === 0) {
				return moment().utc().format("YYYY-MM-DD HH:mm:ss")
			} else {
				//return moment(time+zone).parseZone(t).utc().format("YYYY-MM-DD HH:mm:ss");
				return moment(time).utc().format("YYYY-MM-DD HH:mm:ss")
			}
		};
		//获取day天前的时间(格林尼治时间) getSomeDayBefore(2,"begin")+","+getSomeDayBefore(0,"end")->2017-08-29 16:00:00,2017-08-30 15:59:59
		Vue.prototype.getSomeDayBefore = (day, type) => {
			let needTime;
			let tempTime;
			if (type == "begin") {
				tempTime = moment().subtract(day, 'days').format("YYYY-MM-DD 00:00:00");
				needTime = Vue.prototype.parseUTC(tempTime);
			}
			if (type == "end") {
				tempTime = moment().subtract(day, 'days').format("YYYY-MM-DD 23:59:59");
				needTime = Vue.prototype.parseUTC(tempTime);
			}
			return needTime;

		};



		//获取当前地图的缩放
		Vue.prototype.getViewBounds = (map) => {
			var boundsObj = map.getBounds();
			var neObj = boundsObj.getNorthEast();
			var ne = {
				lng: neObj.lng,
				lat: neObj.lat
			};
			var swObj = boundsObj.getSouthWest();
			var sw = {
				lng: swObj.lng,
				lat: swObj.lat
			};
			var rObj = {
				ne: ne,
				sw: sw
			};
			return rObj
		};
		//gps地址纠正 得到百度坐标系
		Vue.prototype.parsePointBD = (point) => {
			var gcjlatlng = GPS.gcj_encrypt(point.lat, point.lng);
			var bdlatlng = GPS.bd_encrypt(gcjlatlng.lat, gcjlatlng.lng);
			return bdlatlng
		};
		//gps地址纠正 得到谷歌，腾讯，高德坐标系
		Vue.prototype.parsePointGCJ = (point) => {
			var gcjlatlng = GPS.gcj_encrypt(point.lat, point.lng);
			return gcjlatlng
		};
		//根据系统转换相应地图坐标系   gps坐标  转 地图坐标
		Vue.prototype.parsePoint = (type, point) => {
			let newpoint = {
				lng: isNaN(parseFloat(point.lng)) ? 0 : parseFloat(point.lng),
				lat: isNaN(parseFloat(point.lat)) ? 0 : parseFloat(point.lat)
			};
			if (newpoint.lng == 0 && newpoint.lat == 0) return newpoint;
			switch (type) {
				case 0:
					var gcjlatlng = GPS.gcj_encrypt(point.lat, point.lng);
					var bdlatlng = GPS.bd_encrypt(gcjlatlng.lat, gcjlatlng.lng);
					return bdlatlng
				case 1:
					var gcjlatlng = GPS.gcj_encrypt(point.lat, point.lng);
					return gcjlatlng
			}
		};
		//根据系统转换相应gps坐标系(WGS-84)   地图坐标  转 gps坐标
		Vue.prototype.parseWGS = (type, point) => {
			let WGS = null;
			switch (type) {
				case 0:
					let gcjlatlng = GPS.bd_decrypt(point.lat, point.lng);
					WGS = GPS.gcj_decrypt(gcjlatlng.lat, gcjlatlng.lng);
					break;
				case 1:
					WGS = GPS.gcj_decrypt(point.lat, point.lng);
					break;
			}
			return WGS
		};
		//逆转译地理编码  obj为对象{key:''}
		Vue.prototype.geocoder = (type, point, obj, key, callback) => {

			if (point.lng == 0 && point.lat == 0) {
				obj[key] = "_无定位数据_";
				if (callback != null && callback != "") callback();
				return
			}

			switch (type) {
				case 0:
					//高德反地理编码
					// var geocoder = new AMap.Geocoder({
					// 	radius: 1000,
					// 	extensions: "base"
					// });

					//百度转高德坐标系
					// let p=GPS.bd_decrypt(point.lat, point.lng);
					// let  lnglatXY = [p.lng, p.lat];
					// geocoder.getAddress(lnglatXY, function(status, result) {
					// 	if (status === 'complete' && result.info === 'OK') {
					// 		geocoder_CallBack(result);
					// 	}
					// });

					// function geocoder_CallBack(data) {
					// 	var address = data.regeocode.formattedAddress; //返回地址描述
					// 	//console.log(address);
					// 	obj[key] = address;
					// 	if(callback!=null && callback!="") callback();
					// }


					// let Apoint=new BMap.Point(point.lng,point.lat);
					// let Aurl="http://restapi.amap.com/v3/geocode/regeo?output=json&location="+p.lng+","+ p.lat+"&key=17c9a68e0238ef15a59887ea6a90295b`&radius=1000&extensions=all";

					// $.ajax({
					// 	url: Aurl,
					// 	type: 'get',
					// 	dataType: 'jsonp',  // 请求方式为jsonp
					// 	global:false,
					// 	success: function(data){
					// 		console.log("results",data);
					// 		obj[key]=data.result.formatted_address+data.result.sematic_description;
					// 		if(callback!=null && callback!="") callback();
					// 	}
					// });



					//百度 Geocoding API v2 反地理编码  优点 返回数据信息更丰富     缺点 有访问上限
					let Bpoint = new BMap.Point(point.lng, point.lat);
					let Burl = "http://api.map.baidu.com/geocoder/v2/?location=" + Bpoint.lat + "," + Bpoint.lng + "&output=json&pois=1&ak=6CxnMF8ccGdkQTNvahrOsokSil0EHHbI";

					$.ajax({
						url: Burl,
						type: 'get',
						dataType: 'jsonp',  // 请求方式为jsonp
						global: false,
						success: function (data) {
							//console.log("results",data);
							obj[key] = data.result.formatted_address + data.result.sematic_description;
							if (callback != null && callback != "") callback();
						}
					});

					//baidu Javascript API 反地理编码方法 缺点 返回地址数据有限 暂不使用  优点 无限次调用
					/*let myGeo = new BMap.Geocoder();
					myGeo.getLocation(new BMap.Point(point.lng,point.lat), function (rs) {
						//console.log(rs);
						let addComp = rs.addressComponents;
						obj[key] ="["+ addComp.province +"]"+ addComp.city + addComp.district + addComp.street + addComp.streetNumber;

						if(rs.surroundingPois.length!=0) obj[key]+="("+rs.surroundingPois[0].title+"_附近_)";
						console.log(obj[key]);
						if(callback!=null && callback!="") callback();
					},{
						poiRadius:100,
					    numPois:1
					})*/
					break;
				case 1:
					// 使用OpenStreetMap 反地理编码
					let url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en&lat=" + point.lat + "&lon=" + point.lng;
					$.ajax({
						url: url,
						type: 'get',
						dataType: 'json',
						global: false,
						success: function (data) {
							//console.log("results",data);
							obj[key] = data.display_name;
						},
						error: function () {
							obj[key] = "_获取位置失败_"
						}
					});



					// 使用google反地理编码
					// let url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+point.lat+","+point.lng+"&key=AIzaSyAkkEYjEUAgrSC3NVIOlUX3a_SiMe9JL7Q";
					// $.ajax({
					// 	url: url,
					// 	type: 'get',
					// 	dataType: 'json',
					// 	global:false,
					// 	success: function(data){
					// 		//console.log("results",data);
					// 		if (data.status == "OK") {
					// 			obj[key]= data.results[0].formatted_address;
					// 		} else {
					// 			obj[key]="_获取位置_"
					// 		}
					// 		if(callback!=null && callback!="") callback();
					// 	},
					// 	error:function(){
					// 		obj[key]="_获取位置失败_"
					// 	}
					// });


					/*
					 let geocoder = new google.maps.Geocoder();
					 geocoder.geocode({'location':new google.maps.LatLng(point.lat,point.lng)}, function geoResults(results, status){
					 console.log("results",results,status);
					 if (status == google.maps.GeocoderStatus.OK) {

					 obj[key]= results[0].formatted_address;

					 } else {
					 obj[key]="_获取位置_"

					 }
					 if(callback!=null && callback!="") callback();
					 })
					 */
					break;
			}


		};


		//数组修改active状态 设置激活状态
		Vue.prototype.changeActive = (array, index) => {
			array.forEach(function (item, i) {
				if (i === index)
					item.active = true;
				else
					item.active = false;
			})

		};
		//正则去左右两端空格
		Vue.prototype.removeBlank = (str) => {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		};
		//设置纵向滚动条
		Vue.prototype.setScroll = (id, h) => {
			$("#" + id).slimScroll({
				//width: 'auto', //可滚动区域宽度
				height: h + 'px', //可滚动区域高度
				size: '14px', //组件宽度
				color: '#00aff0', //滚动条颜色
				position: 'right', //组件位置：left/right
				distance: '0px', //组件与侧边之间的距离
				start: 'top', //默认滚动位置：top/bottom
				opacity: .8, //滚动条透明度
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
				borderRadius: '0', //滚动条圆角
				railBorderRadius: '0' //轨道圆角
			});

		};
		//深拷贝
		Vue.prototype.deepCopy = (data) => {
			return JSON.parse(JSON.stringify(data))
		};

		//解析电子锁姿态
		Vue.prototype.parseLockPose = (string) => {
			//1正立 2前倾 3后倾 4左倾 5右倾 6侧立 7倒立 8平躺
			let arr = string.split(",")
			let [x, y, z] = [arr[0] - 0, arr[1] - 0, arr[2] - 0]
			if (y < -10) {
				return 7
			}
			else if (y >= -10 && y <= 20 && (x >= 0 && x <= 90 || x >= -180 && x <= -90)) {
				return 6
			}
			else if (y >= -10 && y <= 20 && (x > 90 && x <= 180 || x > -90 && x < 0)) {
				return 8
			}
			else if (y >= 20 && y <= 60 && x >= -90 && x <= 0) {
				return 2
			}
			else if (y >= 20 && y <= 60 && x >= 90 && x <= 180) {
				return 3
			}
			else if (y > 20 && y <= 80 && x >= 0 && x <= 90) {
				return 4
			}
			else if (y > 20 && y <= 80 && x >= -180 && x <= -90) {
				return 5
			}
			else {
				return 1
			}
		};

		//解析路由菜单
		Vue.prototype.parseRouteMenu = (ID) => {
			let obj = {
				name: null,
				path: null,
				icon: null
			}

			switch (ID) {
				case 1:
					obj.name = "_位置服务_";
					obj.icon = "icon-1";
					break;
				case 2:
					obj.name = "_实时监控_";
					obj.path = "monitor";
					obj.imgClass = "M-A1";
					break;
				case 3:
					obj.name = "_轨迹回放_";
					obj.path = "historical_route";
					obj.imgClass = "M-B1";
					break;
				case 4:
					obj.name = "_围栏管理_";
					obj.path = "fence_manage";
					obj.imgClass = "M-A2";
					break;
				case 65:
					obj.name = "_全览表_";
					obj.path = "all_list";
					obj.imgClass = "M-A2";
					break;


				case 10:
					obj.name = "_报警报表_";
					obj.icon = "icon-2";
					break;
				case 60:
					obj.name = "_报警报表_";
					obj.path = "alarm_list";
					obj.imgClass = "M-E3";
					break;

				case 23:
					obj.name = "_管理员_";
					obj.icon = "icon-5";
					break;
				case 24:
					obj.name = "_角色管理_";
					obj.path = "juese";
					obj.imgClass = "M-H6";
					break;
				case 25:
					obj.name = "_用户管理_";
					obj.path = "user";
					obj.imgClass = "M-A7";
					break;
				case 26:
					obj.name = "_司机管理_";
					obj.path = "driver";
					obj.imgClass = "M-J6";
					break;
				case 27:
					obj.name = "_设备管理_";
					obj.path = "equipment";
					obj.imgClass = "M-I6";
					break;
				case 28:
					obj.name = "_车辆管理_";
					obj.path = "vehicalmanage";
					obj.imgClass = "M-G6";
					break;
				case 50:
					obj.name = "_集装箱管理_";
					obj.path = "containerManage";
					obj.imgClass = "M-G6";
					break;


				case 15:
					obj.name = "_报表分析_";
					obj.icon = "icon-3";
					break;
				case 16:
					obj.name = "_行驶统计_";
					obj.path = "xingshi";
					obj.imgClass = "M-F1";
					break;
				case 17:
					obj.name = "_运行效率分析_";
					obj.path = "xiaolv";
					obj.imgClass = "M-G1";
					break;
				case 18:
					obj.name = "_历史轨迹报表_";
					obj.path = "lishiguiji";
					obj.imgClass = "M-H1";
					break;
				case 19:
					obj.name = "_停车报表_";
					obj.path = "park";
					obj.imgClass = "M-I1";
					break;
				case 38:
					obj.name = "_开关锁报表_";
					obj.path = "tripReport";
					obj.imgClass = "M-E2";
					break;
				case 48:
					obj.name = "_箱门状态报表_";
					obj.path = "onOffReport";
					obj.imgClass = "M-A6";
					break;
				case 6:
					obj.name = "_胎压曲线_";
					obj.path = "TireTrack";
					obj.imgClass = "M-C1";
					break;
				case 40:  // 温度监控 （冷链）温度曲线  区别 报表类 （集装箱）温度曲线
					obj.name = "_温度曲线_";
					obj.path = "temperatureCurve";
					obj.imgClass = "M-H2";
					break;
				case 45:
					obj.name = "_油耗分析_";
					obj.path = "OilWear";
					obj.imgClass = "M-F2";
					break;
				case 9:
					obj.name = "_接甩挂分析_";
					obj.path = "TrailerReport";
					obj.imgClass = "M-E1";
					break;


				case 20:
					obj.name = "_消息中心_";
					obj.icon = "icon-4";
					break;
				case 21:
					obj.name = "_系统消息_";
					obj.path = "systemInfo";
					obj.imgClass = "M-E6";
					break;
				case 22:
					obj.name = "_事件_";
					obj.path = "event";
					obj.imgClass = "M-F6";
					break;

				case 29:
					obj.name = "_设置_";
					obj.icon = "icon-6";
					break;
				case 36:
					obj.name = "_终端密码维护_";
					obj.path = "changePassword";
					obj.imgClass = "M-D2";
					break;
				case 30:
					obj.name = "_报警设置_";
					obj.path = "alarmconfiggather";
					obj.imgClass = "M-B2";
					break;
				case 42:
					obj.name = "_传感器配置_";
					obj.path = "sensorConfig";
					obj.imgClass = "M-J2";
					break;
				case 35:
					obj.name = "RFID _卡授权_";
					obj.path = "cardConfig";
					obj.imgClass = "M-C2";
					break;
				case 62:
					obj.name = "_胎压白名单_";
					obj.path = "white_list_config";
					obj.imgClass = "M-C2";
					break;
				case 46:
					obj.name = "_油箱配置_";
					obj.path = "OilBoxConfig";
					obj.imgClass = "M-G2";
					break;
				case 61:
					obj.name = "_胎压传感器配置_";
					obj.path = "TPMS_config";
					obj.imgClass = "M-C2";
					break;
				case 64:
					obj.name = "_系统设置_";
					obj.path = "system_config";
					obj.imgClass = "M-C2";
					break;
				case 66:
					obj.name = "_发送指令_";
					obj.path = "command";
					obj.imgClass = "M-C2";
					break;
				// case 56:
				// 	obj.name = "_配送点管理_";
				// 	obj.path = "distributionManagement";
				// 	obj.imgClass = "M-B2";
				// 	break;
				// case 57:
				// 	obj.name = "_开关锁报表_";
				// 	obj.path = "switchLockReport";
				// 	obj.imgClass = "M-B2";
				// 	break;




				// case 49:    //报表类 （集装箱）温度曲线 区别 温度监控 （冷链）温度曲线
				// 	obj.name="_箱温曲线_";
				// 	obj.path="ContainerTemperatureCurve";
				// 	obj.imgClass="M-H2";
				// 	break;
				// case 53:
				// 	obj.name="_发货报表_";
				// 	obj.path="shipmentsReport";
				// 	obj.imgClass="M-H1";
				// 	break;
				// case 54:
				// 	obj.name="_异常报表_";
				// 	obj.path="abnormalReport";
				// 	obj.imgClass="M-A6";
				// 	break;
				// case 55:
				// 	obj.name="_发货单开锁统计_";
				// 	obj.path="UnlockTimesCounting";
				// 	obj.imgClass="M-D6";
				// 	break;

				case 5:
					obj.name = "_胎压监测_";
					obj.icon = "icon-2";
					break;

				case 7:
					obj.name = "_胎温胎压报警_";
					obj.path = "TireTemAlarm";
					obj.imgClass = "M-D1";
					break;




				case 51:
					obj.name = "_实时调度_";
					obj.icon = "icon-2";
					break;
				case 52:
					obj.name = "_实时调度_";
					obj.path = "scheduling";
					obj.imgClass = "M-B6";
					break;


				// case 11:
				// 	obj.name="_疲劳驾驶报警_";
				// 	obj.path="fatigueDrivingAlarm";
				// 	obj.imgClass="M-E3";
				// 	break;
				// case 12:
				// 	obj.name="_超速报警_";
				// 	obj.path="speedAlarm";
				// 	obj.imgClass="M-A3";
				// 	break;
				// case 13:
				// 	obj.name="_超时停车报警_";
				// 	obj.path="stopAlarm";
				// 	obj.imgClass="M-D4";
				// 	break;
				// case 14:
				// 	obj.name="_低电量报警_";
				// 	obj.path="lowBatteryAlarm";
				// 	obj.imgClass="M-F3";
				// 	break;
				// case 37:
				// 	obj.name="_开关锁异常报表_";
				// 	obj.path="abnormal";
				// 	obj.imgClass="M-D6";
				// 	break;



				case 39:
					obj.name = "_温度监控_";
					obj.icon = "icon-11";
					break;
				case 41:
					obj.name = "_温度异常报表_";
					obj.path = "temperatureAlarm";
					obj.imgClass = "M-I2";
					break;

				case 43:
					obj.name = "_远程指令开锁_";
					obj.path = "remoteUnlock";
					obj.imgClass = "M-J1";
					break;

				case 31:
					obj.name = "_电子锁配置_";
					obj.icon = "icon-10";
					break;
				case 33:
					obj.name = "_开锁围栏设置_";
					obj.path = "UnlockConfig";
					obj.imgClass = "M-A2";
					break;
				case 32:
					obj.name = "_远程指令开锁_";
					obj.path = "remoteUnlock";
					obj.imgClass = "M-J1";
					break;
				case 34:
					obj.name = "_终端报警设置_";
					obj.path = "lockAlarmConfig";
					obj.imgClass = "M-B2";
					break;


				case 44:
					obj.name = "_油耗监控_";
					obj.icon = "icon-13";
					break;





				case 56:
					obj.name = "_配送点管理_";
					obj.path = "distributionManagement";
					obj.imgClass = "";
					break;


			}
			return obj
		}

		//解析文本  将null或“” 转换成"--"
		Vue.prototype.parseTxt = (str) => {
			if (str == null || str == "") {
				return "--"
			} else {
				return str
			}
		}

		//解析温度数据  将小于-50℃ 转换成"--" 保留一位小数
		Vue.prototype.parseTemperature = (t) => {
			if (t == null || t == "" || t <= -50) {
				return "--"
			} else if (t >= 85) {
				return 85;
			} else {
				return parseFloat(t).toFixed(1);
			}
		}
		Vue.prototype.transFAssetType=(id)=>{
			switch (id) {
				case 701:
					return "JT701";

				case 735:
					return "JT702";

				case 740:
					return "JT705";

				case 717:
					return "JT707";
				case 703:
					return "JT703";
				case 704:
					return "JT704";
				case 714:
					return "JT704B";
				case 750:
					return "JT704C";
				case 716:
					return "JT706";
				case 400:
					return "GP4000";
				case 600:
					return "GP6000";
				case 603:
					return "GP6000F";
				default:
					break;
			}
		}
	}
}


