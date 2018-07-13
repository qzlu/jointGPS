<template>
	<div class="modal fade" id="openLockBox" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
		 aria-hidden="true">
		<div class="modal-dialog openLock-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="" style="color: white">_设备_ID:&nbsp;&nbsp;{{lockAssetData.ID}}</h4>
				</div>
				<div class="modal-body openImg">
					<ul class="clearfix">
						<li>
							<img src="/static/img/lock/user.png" alt="_用户_" title="_用户_">
						</li>
						<li :class="{'hideStatus':lockAssetData.serverData.status==null}">
							<el-progress :percentage="lockAssetData.serverData.precent" :status="lockAssetData.serverData.status"></el-progress>
						</li>
						<li>
							<img src="/static/img/lock/server.png" alt="_服务器_" title="_服务器_">
						</li>
						<li :class="{'hideStatus':lockAssetData.lockData.status==null}">
							<el-progress :percentage="lockAssetData.lockData.precent" :status="lockAssetData.lockData.status"></el-progress>
						</li>
						<li :class="{'img-lock':lockAssetData.lockData.status=='success','img-unlock':lockAssetData.lockData.status!='success'}">
						</li>
					</ul>
					<ol class="openLockText">
						<li v-for="item in lockAssetData.text">{{item}}</li>
					</ol>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="lockAssetData.btnDisabled" @click="openLock">_开锁_</button>
					<button type="button" class="btn cancel text-white" data-dismiss="modal" >_取消_</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
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
				//第二次查询开锁状态间隔时间   毫秒
				interval:6000
			}
		},
		methods: {
			//打开开锁窗口
			openLockBox(ID,guid,quicklyOpen){
				this.lockAssetData={
					ID:ID,
					guid:guid,
					text:[],
					button:true,
					serverData:{
						precent:0,
						status:null
					},
					lockData:{
						precent:0,
						status:null
					}
				};
				$("#openLockBox").modal("show");
				if(quicklyOpen) this.openLock();
			},
			//开始开锁
			openLock(){
				let _this=this,
				    url,
				    LAD=this.lockAssetData;
				switch(this.$store.state.choiceSystemID){
				    case 2:
						url="/web/Lock/Lock_SmartLock";
				        break;
					case 4:
						url="/web/FleetManager/FleetManager_SmartLock";
						break;
					case 7:
						url="/web/SmartDistribution/SmartDistribution_SmartLock";
						break;
				};


				LAD.text.length=0;
				LAD.btnDisabled=true;
				LAD.serverData={
					precent:0,
					status:null
				};
				LAD.lockData={
					precent:0,
					status:null
				};

				let postData1 = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "QueryLockStatus",
					FAssetID: LAD.ID,
					FAssetGUID:LAD.guid,
					FVersion: "1.0.0"
				};
				LAD.btnDisabled=true;
				//先判断锁状态是否为开启，如果开启则提示用户无需开锁，否则进入下面开锁环节
				// $.ajax({
				// 	"url": url,
				// 	"cache": false,
				// 	"async": false,
				// 	"global":true,
				// 	"type": "post",
				// 	"dataType": "json",
				// 	"contentType": "application/json; charset=utf-8",
				// 	"data": JSON.stringify(postData1),
				// 	success: function (json) {
				// 		if (json.Result == 200) {
				// 			LAD.text.push("_锁已开启_,_无需重复开锁_");
				// 			LAD.btnDisabled=false;
				// 			return;
				// 		}else{
				// 			oepnLcok();
				// 		}
				// 	},
				// 	error:function(){
				// 		changeLinkStatus(LAD,"serverData", ["exception","_服务器出错_"],15)
				// 	}
				// });
				oepnLcok();
				//开锁指令
				function oepnLcok(){
					LAD.text.push("_向服务器发送开锁请求_");
					let postData = {
						FTokenID: _this.$store.state.FTokenID,
						FAction:"OpenLockControl",
						FAssetID: LAD.ID,
						FAssetGUID:LAD.guid,
						FVersion: "1.0.0"
					};
				
					$.ajax({
						"url": url,
						"cache": false,
						"async": true,
						"global":"false",
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": JSON.stringify(postData),
						success: function (json) {
							if (json.Result == 200) {
								changeLinkStatus(LAD,"serverData",["success","_服务器连接成功_"],15,function(){
									LAD.text.push("_服务器请求开锁中_");


									let interval=changeLinkStatus(LAD,"lockData",["success","_开锁成功_"],100);
									$.ajax({
										"url": url,
										"cache": false,
										"async": true,
										"global":"false",
										"type": "post",
										"dataType": "json",
										"contentType": "application/json; charset=utf-8",
										"data": JSON.stringify(postData1),
										success: function (json) {
											if (json.Result == 200) {
												clearInterval(interval);
												changeLinkStatus(LAD,"lockData",["success","_开锁成功_"],5);
												LAD.btnDisabled=false;
											}else {
												setTimeout(function(){
													$.ajax({
														"url": url,
														"cache": false,
														"async": true,
														"global":"false",
														"type": "post",
														"dataType": "json",
														"contentType": "application/json; charset=utf-8",
														"data": JSON.stringify(postData1),
														success: function (json) {
															clearInterval(interval);
															LAD.btnDisabled=false;
															if (json.Result == 200) {
																changeLinkStatus(LAD,"lockData",["success","_开锁成功_"],5);
															}else {
																changeLinkStatus(LAD,"lockData",["exception","_开锁失败_,_请检查锁状态后重试_"],5)
															};
															
														}

													});
												},_this.interval)

											}
										},
										error:function(){
											clearInterval(interval);
											changeLinkStatus(LAD,"serverData", ["exception","_服务器出错_"],15);
										}

									});
								
								})
							}else{
								changeLinkStatus(LAD,"serverData", ["exception","_服务器连接失败_"],15)
							}
						},
						error:function(){
							changeLinkStatus(LAD,"serverData", ["exception","_服务器连接失败_"],15)
						}

					});	
					
				};

				//更改状态
				function changeLinkStatus(obj,key,arr,time,callback){

					let t = setInterval(function () {
						obj[key].precent++;
						if (obj[key].precent >= 100) {
							obj[key].precent=100;
							obj[key].status = arr[0];
							obj.text.push(arr[1]);
							clearInterval(t);
							if(callback!="" && callback!=null) callback();
						}
					}, time);
					return t;
				}
			},

		}

	}
</script>
<style>
	.openLock-dialog{
		margin-top:150px!important;
		width:500px!important;
	}
	.openLock-dialog .modal-header {
		background-color:#005fc6;
	}

	#openLockBox .openImg{
		padding:40px 40px 0;
	}
	#openLockBox .openImg ul{
		width:100%;
	}

	.openImg ul li{
		width:80px;
		height:80px;
		line-height:80px;
		float:left;
		text-align:center;
	}
	.img-lock{
		background:url(/static/img/lock/lock.png) no-repeat ;
	}
	.img-unlock{
		background:url(/static/img/lock/unlock.png) no-repeat ;
	}

	.openImg  li .el-progress{
		top:29px;
	}
	.openImg h5{
		height:50px;
		line-height:50px;
	}
	.openLockText{
		height:105px;
	}
	.openImg   .el-progress-bar{
		padding:0;
		margin:0;
	}
	.hideStatus .el-progress__text{
		display:none;
	}

</style>
