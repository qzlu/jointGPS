//根据公司id查询车辆、设备、司机
export default{
  install(Vue, options){    
	  
	    Vue.prototype.velTable=function (index,size,state,key,obj,bind) {   //公司id的直属车,bind代表是否绑定过

	        let _this = this;            /*（当前页，码，启禁，关键字，公司id,绑定类别）    */
	        let FTokenID=_this.$store.state.FTokenID;
	        let FIsAll=obj.type?0:2;
			let FAgentGUID=obj.type?obj.id:obj.fatherId;
			let FGroupGUID=obj.type?'':obj.id;
			let postData={
				FTokenID: FTokenID,
				FAction: "QueryAdminVehicleList",
				FAgentGUID:FAgentGUID,
				FIsAll:FIsAll,
				FGroupGUID:FGroupGUID,
				FState:state,
				FType:bind,
				FKey:key,
				FPageSize:size,
				FPageIndex:index,
				FVehicleType:2,
				FVersion: "1.0.0"
			};
			$.ajax({
				"url": "web/Combine/Combine_Common",
				"cache": false,
				"async": true,
				"type": "post",
				"dataType": "json",
				"contentType": "application/json; charset=utf-8",
				"data": JSON.stringify(postData),
				success: function (data) {
					console.log('data',JSON.stringify(postData))
					console.log('公司直属车辆',data);
					var Fobj=data;
					_this.velList = [];
					if(data.Result==200){
						$.each(Fobj.FObject.Table1, function (index, obj) {
							obj.FStatus=(obj.FStatus==1)?true:false;
							obj.FVehicleTypeID=obj.FVehicleTypeID=='0'?'_厢车_':obj.FVehicleTypeID=='1'?'_罐车_':obj.FVehicleTypeID=='2'?'_其他_':'_厢车_';
							_this.velList.push(obj);
						})
						_this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
					}
				},
				error: function () {
					console.log('_请求失败_')
				}
			});		
	    };
	    Vue.prototype.velTableAll=function (index,size,state,key,obj,bind) {   //公司id的全部车
	        let _this = this;      /*（当前页，码，启禁，关键字，公司id,绑定类别）    */
	        let FTokenID=_this.$store.state.FTokenID;
	        let FAgentGUID=obj.id;
			let postData={
				FTokenID: FTokenID,
				FAction: "QueryAdminVehicleList",
				FAgentGUID:FAgentGUID,
				FIsAll:1,
				FGroupGUID:'',
				FState:state,
				FType:bind,
				FKey:key,
				FPageSize:size,
				FPageIndex:index,
				FVehicleType:2,
				FVersion: "1.0.0"
			}
			$.ajax({
				"url": "web/Combine/Combine_Common",
				"cache": false,
				"async": true,
				"type": "post",
				"dataType": "json",
				"contentType": "application/json; charset=utf-8",
				"data": JSON.stringify(postData),
				success: function (data) {
					console.log('公司全部车辆',data);
					var Fobj=data;
					_this.velListAll = [];
					if(data.Result==200){
						$.each(Fobj.FObject.Table1, function (index, obj) {
							obj.FStatus=(obj.FStatus==1)?true:false;
							obj.FVehicleTypeID=obj.FVehicleTypeID=='0'?'_厢车_':obj.FVehicleTypeID=='1'?'_罐车_':obj.FVehicleTypeID=='2'?'_其他_':'_厢车_';
							_this.velListAll.push(obj);
						})
						_this.FTotalCount2 = Fobj.FObject.Table[0].FTotalCount;
					}
				},
				error: function () {
					console.log('_请求失败_')
				}
			});		
	    };
	    Vue.prototype.equipAble=function (index,size,key,type,id) {   //公司id的可用设备
	        let _this = this;             /*（当前页，码，关键字，设备类型，公司id）    */
	        let FTokenID=_this.$store.state.FTokenID;
			let postData={
				FTokenID: FTokenID,
				FAction: "QueryAdminAssetNoUseList",
				FAgentGUID:id,
				FKey:key,
				FType:type,
				FPageSize:size,
				FPageIndex:index,
				FVersion: "1.0.0"
			}
			$.ajax({
				"url": "web/Combine/Combine_Common",
				"cache": false,
				"async": true,
				"type": "post",
				"dataType": "json",
				"contentType": "application/json; charset=utf-8",
				"data": JSON.stringify(postData),
				success: function (data) {
					console.log('ji',JSON.stringify(postData))
					console.log('公司可用设备',data);
					var Fobj=data;
					_this.equTableList = [];
					if(data.Result==200){
						$.each(Fobj.FObject.Table1, function (index, obj) {
							_this.equipTranslate(obj);
							_this.equTableList.push(obj);
						})
					}
					/*return data.FObject.Table1;*/
				},
				error: function () {
					console.log('_请求失败_')
				}
			});		
	    };
	    Vue.prototype.equipTranslate=function (obj) { 
	    	obj.FAssetTypeID=obj.FAssetTypeID=='701'?'JT701':obj.FAssetTypeID=='735'?'JT702':
	    	obj.FAssetTypeID=='703'?'JT703':obj.FAssetTypeID=='707'?'JT703T':obj.FAssetTypeID=='704'?'JT704':
	    	obj.FAssetTypeID=='714'?'JT704B':
	    	obj.FAssetTypeID=='740'?'JT705':obj.FAssetTypeID=='716'?'JT706':obj.FAssetTypeID=='717'?'JT707':
	    	obj.FAssetTypeID=='303'?'JT600C':
	    	obj.FAssetTypeID=='400'?'GP4000':obj.FAssetTypeID=='600'?'GP6000':obj.FAssetTypeID=='603'?'GP6000F':
	    	obj.FAssetTypeID=='404'?'GP4000M':obj.FAssetTypeID=='607'?'JT500BD_一体机_':
	    	obj.FAssetTypeID=='608'?'JT500BD_一体机新线束_':obj.FAssetTypeID=='669'?'HB_R03GBD08':
	    	obj.FAssetTypeID=='682'?'_首航_SF110-GS':obj.FAssetTypeID=='750'?'_中集_ZNM801-6':'JT701';
	    },
	    Vue.prototype.driverAble=function (index,size,key,id) {   //公司id的可用司机
	        let _this = this;
	        let FTokenID=_this.$store.state.FTokenID;
			let postData={
				FTokenID: FTokenID,
				FAction: "QueryAdminDriverEnableList",
				FAgentGUID:id,
				FKey:key,
				FPageSize:size,
				FPageIndex:index,
				FVersion: "1.0.0"
			}
			$.ajax({
				"url": "web/Common/Common_Admin",
				"cache": false,
				"async": true,
				"type": "post",
				"dataType": "json",
				"contentType": "application/json; charset=utf-8",
				"data": JSON.stringify(postData),
				success: function (data) {
					console.log('公司可用司机',data);
					var Fobj=data;
					_this.driTableList = [];
					if(data.Result==200){
						$.each(Fobj.FObject.Table1, function (index, obj) {
							_this.driTableList.push(obj);
						})
					}
					//return Fobj.FObject.Table1;
				},
				error: function () {
					console.log('_请求失败_')
				}
			});		
	    };
	    Vue.prototype.VelDetailGet=function (parm){    //获取车辆详情
	    	var _this=this;
			return new Promise(resove=>{
		    let FGUID=parm;
			let TokenID = this.$store.state.FTokenID;
			$.ajax({
			        "url": "web/Common/Common_Admin",
			        "cache": false,
			        "async": true,
			        "type": "post",
			        "dataType": "json",
			        "contentType": "application/json; charset=utf-8",
			        "data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminVehicleByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
			        success: function (data) {
			            console.log('车辆详情',data);
			            _this.velData=_this.deepCopy(data.FObject[0]);
			            _this.velDataTrans=_this.deepCopy(data.FObject[0]);
			            _this.velDataTrans.FStatus=(_this.velDataTrans.FStatus)?'_启用_':'_禁用_';
			            _this.velDataTrans.FVehicleTypeID=_this.velDataTrans.FVehicleTypeID==0?'_厢车_':_this.velDataTrans.FVehicleTypeID==1?'_罐车_':_this.velDataTrans.FVehicleTypeID==2?'_其他_':'';
			            _this.velDataTrans.FOperateType=_this.velDataTrans.FOperateType=='0'?'_经营租赁_':_this.velDataTrans.FOperateType=='1'?'_以租代售_':_this.velDataTrans.FOperateType=='2'?'_直销_':_this.velDataTrans.FOperateType=='3'?'_自营_':_this.velDataTrans.FOperateType=='4'?'_试车_':_this.velDataTrans.FOperateType=='5'?'_融资租赁_':_this.velDataTrans.FOperateType=='6'?'_其他_':'';
			            resove();
			        },
			        error: function () {
			            console.log('_请求失败_')
			        }
		        });	
			})
	    };
	    Vue.prototype.conTable=function (index,size,state,key,obj,bind) {   //公司id的直属箱,bind代表是否绑定过
	        let _this = this;            /*（当前页，码，启禁，关键字，公司id,绑定类别）    */
	        let FTokenID=_this.$store.state.FTokenID;
	        let FIsAll=obj.type?0:2;
			let FAgentGUID=obj.type?obj.id:obj.fatherId;
			let FGroupGUID=obj.type?'':obj.id;
			let postData={
				FTokenID: FTokenID,
				FAction: "QueryAdminVehicleList",
				FAgentGUID:FAgentGUID,
				FIsAll:FIsAll,
				FGroupGUID:FGroupGUID,
				FState:state,
				FType:bind,
				FKey:key,
				FPageSize:size,
				FPageIndex:index,
				FVehicleType:3,
				FVersion: "1.0.0"
			};
			$.ajax({
				"url": "web/Combine/Combine_Common",
				"cache": false,
				"async": true,
				"type": "post",
				"dataType": "json",
				"contentType": "application/json; charset=utf-8",
				"data": JSON.stringify(postData),
				success: function (data) {
					console.log('公司直属集装箱',data);
					var Fobj=data;
					if(_this.SystemID==6&&_this.typeTable==0){
						_this.velList = [];
						if(data.Result==200){
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus=(obj.FStatus==1)?true:false;

								_this.velList.push(obj);
							})
							_this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
						}
					}else{
						_this.conList = [];
						if(data.Result==200){
							$.each(Fobj.FObject.Table1, function (index, obj) {
								obj.FStatus=(obj.FStatus==1)?true:false;

								_this.conList.push(obj);
							})
							_this.FTotalCount1 = Fobj.FObject.Table[0].FTotalCount;
						}
					}
					
				},
				error: function () {
					console.log('_请求失败_')
				}
			});		
	    };
	    Vue.prototype.conTableAll=function (index,size,state,key,obj,bind) {   //公司id的全部箱
	        let _this = this;      /*（当前页，码，启禁，关键字，公司id,绑定类别）    */
	        let FTokenID=_this.$store.state.FTokenID;
	        let FAgentGUID=obj.id;
			let postData={
				FTokenID: FTokenID,
				FAction: "QueryAdminVehicleList",
				FAgentGUID:FAgentGUID,
				FIsAll:1,
				FState:state,
				FType:bind,
				FKey:key,
				FPageSize:size,
				FPageIndex:index,
				FVehicleType:3,
				FVersion: "1.0.0"
			}
			$.ajax({
				"url": "web/Combine/Combine_Common",
				"cache": false,
				"async": true,
				"type": "post",
				"dataType": "json",
				"contentType": "application/json; charset=utf-8",
				"data": JSON.stringify(postData),
				success: function (data) {
					console.log('公司全部集装箱',data);
					var Fobj=data;
					_this.conListAll = [];
					if(data.Result==200){
						$.each(Fobj.FObject.Table1, function (index, obj) {
							obj.FStatus=(obj.FStatus==1)?true:false;
							
							_this.conListAll.push(obj);
						})
						_this.FTotalCount2 = Fobj.FObject.Table[0].FTotalCount;
					}
				},
				error: function () {
					console.log('_请求失败_')
				}
			});		
	    };
	    Vue.prototype.ConDetailGet=function (parm){    //获取集装箱详情
	    	var _this=this;
			return new Promise(resove=>{
		    let FGUID=parm;
			let TokenID = this.$store.state.FTokenID;
			$.ajax({
			        "url": "web/Common/Common_Admin",
			        "cache": false,
			        "async": true,
			        "type": "post",
			        "dataType": "json",
			        "contentType": "application/json; charset=utf-8",
			        "data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminVehicleByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
			        success: function (data) {
			            console.log('集装箱详情',data);
			            _this.conData=_this.deepCopy(data.FObject[0]);
			            _this.conDataTrans=_this.deepCopy(data.FObject[0]);
			            _this.conDataTrans.FStatus=(_this.conDataTrans.FStatus)?'_启用_':'_禁用_';
			            resove();
			        },
			        error: function () {
			            console.log('_请求失败_')
			        }
		        });	
			})
	    };
	    Vue.prototype.timeChange=function(time){
	    	var time1=Date.parse(new Date(time));
			var uom1=new Date(time1);
		    var month1=(uom1.getMonth()+1).toString().length==1?"0"+(uom1.getMonth()+1).toString():(uom1.getMonth()+1);
		    var day1=uom1.getDate().toString().length==1?"0"+uom1.getDate():uom1.getDate();
		    return uom1.getFullYear()+'-'+month1+'-'+day1;
	    };
	    Vue.prototype.getTimeZone=function(timeZoneSign,hour,minute){   //时差符号化作数字
	    	let t=null;
			if(timeZoneSign=="+"){
				t=(hour*60+minute)*60;
			}else {
				t=-(hour*60+minute)*60;
			};
			return t;
	    },
	    Vue.prototype.parseTimeZone=function(timeZone){     //数字转成时差符号
	    	let timeZoneSign,hour,minute;
			if (timeZone<0){
				timeZoneSign='-'
			}else {
				timeZoneSign='+'
			};
			let t=Math.abs(timeZone);
			hour=Math.floor(t/3600);
			minute=(t/60)%60;
			let obj={
				timeZoneSign:timeZoneSign,
				hour:hour,
				minute:minute,
			}
			return obj
	    },
	    Vue.prototype.getLocalTimeZone=function(){     //数字转成时差符号
	    	var d=new Date();
	    	let Obj={
	    		timeZoneSign:'',
	    		hour:'',
	    		minute:''
	    	}
			let TimezoneOffset=d.getTimezoneOffset();
			if(TimezoneOffset<0){
				Obj.timeZoneSign='+'
			}else {
				Obj.timeZoneSign='-'
			};
			let t=Math.abs(TimezoneOffset);
			Obj.hour=Math.floor(t/60);
			Obj.minute=Math.round(t%60);
			return Obj;
	    },
	    Vue.prototype.timeObj=function(obj){      //时差转化为'+'
	    	let timeDifferent=Math.abs(obj.FTimeDifferent);
			let hour=Math.floor(timeDifferent/3600);
			let minute=(timeDifferent/60)%60;
			if(hour<10){
				hour='0'+hour;
			}
			if(minute==0){
				minute='00';
			}
			let n=hour+':'+minute;
			if(obj.FTimeDifferent>0){
				obj.timeZone='+'+n;
			}else {
				obj.timeZone='-'+n;
			}
	    },
	    Vue.prototype.message=function(msg, type){
	        this.$message({
	          showClose: true,
	          message: msg,
	          type: type
	        });
	    }
	    Vue.prototype.Checkcode=function(msg){  //求取集装箱校验码
	    	let arr=msg.split('');
			var  sum=0;
	    	for(var i=0;i<10;i++){
				switch(arr[i]){
					case '0':
					   sum=sum+0;
					break;
					case '1':
					   sum=sum+1*Math.pow(2,i);
					break;
					case '2':
					   sum=sum+2*Math.pow(2,i);
					break;
					case '3':
					   sum=sum+3*Math.pow(2,i);
					break;
					case '4':
					   sum=sum+4*Math.pow(2,i);
					break;
					case '5':
					   sum=sum+5*Math.pow(2,i);
					break;
					case '6':
					   sum=sum+6*Math.pow(2,i);
					break;
					case '7':
					   sum=sum+7*Math.pow(2,i);
					break;
					case '8':
					   sum=sum+8*Math.pow(2,i);
					break;
					case '9':
					   sum=sum+9*Math.pow(2,i);
					break;
					case 'A':
					   sum=sum+10*Math.pow(2,i);
					break;
					case 'B':
					   sum=sum+12*Math.pow(2,i);
					break;
					case 'C':
					   sum=sum+13*Math.pow(2,i);
					break;
					case 'D':
					   sum=sum+14*Math.pow(2,i);
					break;
					case 'E':
					   sum=sum+15*Math.pow(2,i);
					break;
					case 'F':
					   sum=sum+16*Math.pow(2,i);
					break;
					case 'G':
					   sum=sum+17*Math.pow(2,i);
					break;
					case 'H':
					   sum=sum+18*Math.pow(2,i);
					break;
					case 'I':
					   sum=sum+19*Math.pow(2,i);
					break;
					case 'J':
					   sum=sum+20*Math.pow(2,i);
					break;
					case 'K':
					   sum=sum+21*Math.pow(2,i);
					break;
					case 'L':
					   sum=sum+23*Math.pow(2,i);
					break;
					case 'M':
					   sum=sum+24*Math.pow(2,i);
					break;
					case 'N':
					   sum=sum+25*Math.pow(2,i);
					break;
					case 'O':
					   sum=sum+26*Math.pow(2,i);
					break;
					case 'P':
					   sum=sum+27*Math.pow(2,i);
					break;
					case 'Q':
					   sum=sum+28*Math.pow(2,i);
					break;
					case 'R':
					   sum=sum+29*Math.pow(2,i);
					break;
					case 'S':
					   sum=sum+30*Math.pow(2,i);
					break;
					case 'T':
					   sum=sum+31*Math.pow(2,i);
					break;
					case 'U':
					   sum=sum+32*Math.pow(2,i);
					break;
					case 'V':
					   sum=sum+34*Math.pow(2,i);
					break;
					case 'W':
					   sum=sum+35*Math.pow(2,i);
					break;
					case 'X':
					   sum=sum+36*Math.pow(2,i);
					break;
					case 'Y':
					   sum=sum+37*Math.pow(2,i);
					break;
					case 'Z':
					   sum=sum+38*Math.pow(2,i);
					break;
				}
			}
    		return (sum%11)==10?0:(sum%11);
	    }
	    Vue.prototype.getGroup=function(id){
	    	let groupArr=[];
	    	$.each(this.$store.state.userGroupAll,function(index,obj){
	    		if(obj.FFatherAgentGUID==id){
	    			groupArr.push({
	    				value:obj.FGUID,
	    				label:obj.FShortName
	    			})
	    		}
	    	})
	    	return groupArr
	    }
	    Vue.prototype.getLabel=function(id){
	    	let name='';
	    	$.each(this.groups,function(index,obj){
	    		if(obj.value==id){
	    			name=obj.label
	    		}
	    	})
	    	return name
	    }
	    Vue.prototype.strlen=function(str){
	    	var len=0;
			for(var i=0;i<str.length;i++){
				if(str.charCodeAt(i)>127||str.charCodeAt(i)==94){
					len+=2;
				}else{
					len++;
				}
			}
			return len
	    }
	    Vue.prototype.sysTrans=function(arr){
	    	this.sysArrs=[];
	    	let temp1 = {};
			let temp2 = {};
			let temp4 = {};
			let temp6 = {};
			let temp7 = {};
	    	for(let i=0;i<arr.length;i++){
	    		if(arr[i]==1){
	    			temp1.value = 1;
					temp1.label = "_接甩挂_";
					this.sysArrs.push(temp1);
	    		}
	    		if(arr[i]==2){
	    			temp2.value = 2;
					temp2.label = "_智能电子锁_";
					this.sysArrs.push(temp2);
	    		}
	    		if(arr[i]==4){
	    			temp4.value = 4;
					temp4.label = "_车队管理_";
					this.sysArrs.push(temp4);
	    		}
	    		if(arr[i]==6){
	    			temp6.value = 6;
					temp6.label = "_集装箱管理_";
					this.sysArrs.push(temp6);
	    		}
	    		if(arr[i]==7){
	    			temp7.value = 7;
					temp7.label = "_智能配送_";
					this.sysArrs.push(temp7);
	    		}
	    	}
	    }
	}
}


