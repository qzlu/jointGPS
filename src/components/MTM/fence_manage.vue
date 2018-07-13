<template>
	<div id="map-template" class="map-template"
		 :class="{'full-screen':IsActive.isFullScreen,'':!IsActive.isFullScreen}">
		<baidu-map ref="map" @fullScreen="changefullScreen" @refresh="getFenceData" :fa-data="[mapToolShow]"></baidu-map>
		<!--智能搜索-->
		<div id="select-car">
			<!--分组 和 类型列表 切换开关-->
			<ul class="status-switch">
				<li class="item" :class="{'active':rightListState}" title="_按类型查看_" @click="rightListState=true">
					<i class="fa fa-list"></i>
				</li>
				<li  class="item item1" :class="{'active':!rightListState}" title="_按分组查看_" @click="rightListState=false">
					<i class="fa fa-file-text-o"></i>
				</li>
			</ul>
			<!--智能搜索-->
			<div class="search-module">
				<!--操作选择车辆列表显示隐藏-->
				<div class="operate-module" @click="isShowSelectCarList=!isShowSelectCarList"></div>

				<!--围栏列表-->
				<car-tree v-if="rightListState" ref='tree' :treeData="typeTree" :options="options"
					@addFenceType="addFenceType"
					@deleteFenceType="deleteFenceType"
					@redactFenceType="redactFenceType"
					@deleteFence="deleteFence"
					@redactFence="redactFence"
					@fenceConfig="fenceConfig"
					@refresh="getFenceData"
					@node-click="drawFenceByType">
				</car-tree>
				<car-tree v-if="!rightListState" ref='tree' :treeData="teamTree" :options="options"
					@addFenceTeam="addFenceTeam"
					@deleteFenceTeam="deleteFenceTeam"
					@redactFenceTeam="redactFenceTeam"
					@deleteFence="deleteFence"
					@redactFence="redactFence"
					@refresh="getFenceData"
					@fenceConfig="fenceConfig"
					@node-click="drawFenceByTeam">
				</car-tree>
			</div>

		</div>
	

		<el-dialog custom-class="fenceTypeBox" :visible.sync="fenceTypeDialog">
			<span slot="title" v-if="!fenceTypeBoxType">_新建围栏类型_</span>
			<span slot="title" v-if="fenceTypeBoxType">_编辑围栏类型_</span>
			<div class="panel-body">
				<el-form :model="fenceTypeInitData" :rules="rules" ref="fenceTypeInitData">
					<table>
						<tbody>
							<tr>
								<td>_类型名称_：</td>
								<td>
									<el-form-item prop="name" >
										<el-input v-model="fenceTypeInitData.name"  placeholder="_请输入用户名_"></el-input>
									</el-form-item>
								</td>
							</tr>
							<tr>
								<td>_中心图标_：</td>
								<td>
								
									<div class="el-color-picker" @click="isShowIconBox=true">
										<div class="el-color-picker__trigger">
											<span class="el-color-picker__color fencetypeicon img-fence no-border" :class="'fencetype-icon'+fenceTypeInitData.icon">
											</span>
										</div>
									
										<div v-show="isShowIconBox"  class="el-color-dropdown el-color-picker__panel fence-icon-box" x-placement="bottom">
											<div class="el-color-dropdown__main-wrapper">
												<ul>
													<li v-for="n in 24" @click.stop="choiceFenceIcon(n)" class="img-fence icon-item" :class="'fencetype-icon'+n"></li>
												</ul>

											</div>

										</div>
									</div>

								</td>
							</tr>
							<tr>
								<td>_描边颜色_：</td>
								<td><el-color-picker v-model="fenceTypeInitData.strokeColor" show-alpha></el-color-picker></td>
							</tr>
							<tr>
								<td>_填充颜色_：</td>
								<td><el-color-picker v-model="fenceTypeInitData.fillColor" show-alpha></el-color-picker></td>
							</tr>

						</tbody>
					</table>

					<div class="text-center">
						<el-form-item>
							<el-button v-if="!fenceTypeBoxType" @click="saveFenceType('fenceTypeInitData')"  type="primary">_新建_</el-button>
							<el-button v-if="fenceTypeBoxType" @click="saveFenceType('fenceTypeInitData',1)"  type="primary">_保存_</el-button>
							<el-button  @click="fenceTypeDialog=false"  type="button" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
						</el-form-item>
					</div>
				</el-form>
			</div>
		</el-dialog>
		<el-dialog custom-class="fenceConfig" :visible.sync="fenceConfigDialog">
			<span slot="title">_配置围栏_</span>
			<div class="panel-body">
				<el-row>
					<el-col :span="12">
						<h4>_电子锁列表_</h4>
						<div class="list">
							 <el-input
							  	class="fence_search"
								placeholder="_输入关键字_"
								v-model="filterText">
							</el-input>
							<el-tree
								class="lock-tree"
								:props="defaultProps"
								:highlight-current="true"
								:data="LocksTree"
								:load="loadTree"
								default-expand-all
								:filter-node-method="filterNode"
								:render-content="renderContent"
								ref="tree2">
							</el-tree>
						</div>
					</el-col>
					<el-col :span="12">
						<h4>_配置列表_</h4>
						<div class="list">
							<ul class="asset_list">
								<li v-for="(item,index) in choiceAsset.data">
									<div class="btn_list">
										<i class="fa fa-trash fa-lg text-red"  @click="deleteAsset(index)" title="_删除_"></i>
										<span class="describe" v-show="item.type!==-1">
											<i v-show="item.type===2" class="el-icon-loading text-green"  title="_配置中_"></i>
											<i v-show="item.type===1" class="text-green">_配置成功_</i>
											<i v-show="item.type===0" class="text-red">_配置失败_</i>
										</span>
									</div>
									{{item.label}}&nbsp;&nbsp;[{{item.subLabel}}]
								</li>
							</ul>
						</div>
						</el-col>
				</el-row>
				<div class="config_footer">	
					<el-button @click="deleteChoiceAsset"  class='el-button  el-button--default cancel el-button--primary'>_清空右侧选项_</el-button>
					<el-button @click="saveConfig"  type="primary">_保存配置_</el-button>
					
				</div>
				

			</div>
		</el-dialog>

	</div>
</template>
<script>
	import baiduMap from "components/Common/baidu_map.vue"
	import carTree from "components/tree/tree.vue"
	//require("plugins/flatpickr/flatpickr.js")
	//require("!style!css!plugins/flatpickr/flatpickr.min.css")
	let _this = null
	export default{
		data(){
			_this = this
			const validateFenceName = (rule,value,callback) => {
				function getByteLen(val) {
					var len = 0;
					for (var i = 0; i < val.length; i++) {
						var a = val.charAt(i);
						if (a.match(/[^\x00-\xff]/ig) != null) {
							len += 2;
						}
						else {
							len += 1;
						}
					}
					return len;
				}
				if(!value) {
					return callback(new Error('_请输入类型名称_'));
				}
				else if(value.length>=2 && value.length<=16){
					callback();
				} else{
					callback(new Error('_名称长度_2-16'));
				}
			}
			return {
				maxHeight: 0,    //下侧列表最大高度
				rightListState:true, //右侧列表类型
				subMenu: [
					{active: true},
					{active: false},
					{active: false}
				],
				IsActive: {
					isFullScreen: false,//地图全屏开关
					pointType: 0 //下部菜单显示车辆类型
					// 0 轨迹点 1运行段/趟次 2停车 3胎压报警 4异常报表 5温度曲线 6油位曲线 7发货单 8站点
				},
				isShowSearchCarName: false, //是不是显示下部搜索框
				isShowSelectCarList: true,//右侧车辆搜索栏开关
				//初始化显示工具栏
				mapToolShow: true,
				choiceFenceType:{
					ID:null,
					name:null,
					count:null
				},
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
				searchFenceName:"",    //搜索围栏名称关键字

				fenceTypeDialog:false,  //围栏类型弹窗开关
				fenceConfigDialog:false,  //围栏配置弹窗开关
				isShowIconBox:false,    //显示图标选择窗口
				fenceTypeInitData:{
					name:"",
					icon:"0",
					strokeColor:"rgba(53,106,195,.8)", //描边颜色
					fillColor:"rgba(53,106,195,.4)"    //填充颜色
				},
				fenceTypeBoxType:0,  //围栏窗口类型 0新建 1编辑
				rules: {
					name: [{required: true, validator: validateFenceName}],
				},
				// 电子锁列表数据
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'label',
					id:'id',
				},
				choiceAsset:{
					IDArr:[],
					data:[]
				},
				configFenceID:null
			}
		},
		activated: function () {

			this.getFenceData();

		},
		props: {
			screenHeight: Number
		},
		components: {
			baiduMap: baiduMap,
			carTree: carTree
		},
		mounted(){
			setTimeout(function () {
				_this.adjustPage();
				_this.$refs.map.initMap();
			}, 100);
		},
		//updated(){
		//},
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				let a,b;
				if(data.label) a=data.label.indexOf(value) !== -1;
				if(data.subLabel) b=data.subLabel.indexOf(value) !== -1;
				return a||b;
     		},
			renderContent(h, { node, data, store }){
				return(
					<span>
						<i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A")!=-1}></i>
						<i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C")!=-1}></i>
						<i class="fa fa-lock icon" v-show={data.id.indexOf("@")==-1&&!data.lockStatus}></i>
						<i class="fa fa-unlock icon" v-show={data.id.indexOf("@")==-1&&data.lockStatus}></i>
						<span>{data.label}</span>
						<span v-show={data.id.indexOf("@")!=-1} style="font-weight:bold">[{data.count}]</span>
						<span style="margin-left:10px" v-show={data.id.indexOf("@")==-1&&data.subLabel}>({data.subLabel})</span>
						<i v-show={data.id.indexOf("@")==-1} style="margin-left:10px" onClick={()=>{this.addAsset(data)}} class="fa fa-plus-square-o fa-lg text-blue" ></i>
					</span>
				)
			},
			// [配置围栏]
			fenceConfig(ID){
				this.configFenceID=ID;
				this.fenceConfigDialog=true;
				this.deleteChoiceAsset();
			},
			// 点击左侧列表尾部添加图标 增加到右侧列表
			addAsset(data){
				if (this.choiceAsset.IDArr.indexOf(data.assetID)===-1) {
					$.post("/web/Combine/Combine_LBS", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "QueryLBSGISUnLockFenceByFAssetGUID",
						FAssetGUID: data.assetID,
						FVersion: "1.0.0"
					},function (res) {
						console.log(res);
						if (res.FObject.length===0) {
							_this.choiceAsset.IDArr.push(data.assetID);
							_this.choiceAsset.data.push({
								ID:data.assetID,
								label:data.label,
								index:0,
								subLabel:data.subLabel,
								type:-1  //-1 不显示 0失败 1成功 2进行中
							});
						} else if(res.FObject.length===10){
							_this.$message("_此设备配置围栏数量已达上限_");
						}else {
							let indexArr=[1,2,3,4,5,6,7,8,9,10],
								fenceIDArr=[];
							res.FObject.map(function (item,index) {
								indexArr.splice(indexArr.indexOf(item.FIndex),1);
								fenceIDArr.push(item.FFenceGUID);
							});
							if (fenceIDArr.indexOf(_this.configFenceID)===-1) {
								_this.choiceAsset.IDArr.push(data.assetID);
								_this.choiceAsset.data.push({
									ID:data.assetID,
									label:data.label,
									index:indexArr[0],
									subLabel:data.subLabel,
									type:-1  //-1 不显示 0失败 1成功 2进行中
								});
								// console.log( indexArr[0]);	
							} else {
								_this.$message("_此设备已配置过选中围栏_");
							}
						}
					})
				}else{
					_this.$message("_已选择_");
				}
				
			},
			// 删除右侧列表设备
			deleteAsset(index){
				this.choiceAsset.IDArr.splice(index,1);
				this.choiceAsset.data.splice(index,1);
			},
			// 清空右侧列表设备
			deleteChoiceAsset(){
				this.choiceAsset.IDArr=[];
				this.choiceAsset.data=[];	
			},
			saveConfig(){
				_this.treeLoading = this.$loading({
					// target:document.getElementById("select-car"),
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					customClass:"loading-bg"
				});
				if(this.choiceAsset.data.length===0){
					this.$message("_请先选择设备_");
					return;	
				};
				this.choiceAsset.data.map(function (item,index) {
					if (item.type!==1) {
						$.post("/web/Combine/Combine_LBS", {
							FTokenID: _this.$store.state.FTokenID,
							FAction: "SetLBSGISUnLockFence",
							FAssetGUID: item.ID,
							FFenceGUID: _this.configFenceID,
							FIndex: item.index,
							FVersion: "1.0.0"
						},
						function (res) {
							if (res.Result===200) {
								item.type=2;
							}else{
								item.type=0;	
							}
						})
					}
					
				})	
				setTimeout(() => {
					_this.choiceAsset.data.map(function (item,index) {
						if (item.type!==1) {
							$.post("/web/Combine/Combine_LBS", {
								FTokenID: _this.$store.state.FTokenID,
								FAction: "QueryLBSGISBoundFenceStatus",
								FAssetGUID: item.ID,
								FFenceGUID: _this.configFenceID,
								FIndex: item.index,
								FVersion: "1.0.0"
							},
							function (res) {
								if (res.Result===200) {
									item.type=1;
								}else{
									item.type=0;	
								}
							})
						}
					})		
					_this.treeLoading.close();			
				}, 10*1000);



			},
			//element  table  选择当前行 改变行样式
			choiceRow(row, index){
				if (row.active) {
					return "list-active"
				} else {
					return "cursor-pointer"
				}
			},
			//开启关闭车辆选择搜索input
			showCarNameSearch(){
				this.isShowSearchCarName = !this.isShowSearchCarName;
				if (!this.isShowSearchCarName) this.searchFenceName = "";
				setTimeout(function () {
					$("#searchFenceName").focus();
				}, 200)
			},

			//动态调整页面布局
			adjustPage(){
				this.elementsFlex("map-wrapper", "map-template", "map-tool");
				this.elementsFlex("select-car", "map-template", "map-tool");
				setTimeout(function () {
					let h = _this.elementsFlex("tree-body", "select-car", "tree-header", "tree-footer", true) ;
					_this.setScroll("tree-body", h);
					let tableHeight = $('#table-wrap').height();
					let trHight = $('#table-wrap').find("tr").height();
					let n = Math.floor(tableHeight / trHight);
				}, 250)

			},
			//全屏
			changefullScreen(meg){
				this.IsActive.isFullScreen = meg;
				this.IsActive.menuFull = false;
				

				setTimeout(function () {
					_this.adjustPage()
				}, 100)
			},

			//获取围栏相关数据  分组 类型 围栏数据
			getFenceData(){
				this.$store.commit('getFenceData',this);
			},
			//绘制选中类型围栏
			drawFenceByType(data){
				if(data.id=="@A") return;
				if(data.count===0) {
					this.$message("_暂无围栏数据_");
					return
				}
				//this.choiceFenceType.ID=data.id;
				//this.choiceFenceType.name=data.label;
				//this.choiceFenceType.count=data.count;
				
				if (typeof _this.typeObj[data.id]==="undefined") {
					_this.typeObj["all"].map(function (item,index) {
						if (item.ID===data.id) {
							_this.$refs.map.showFencePlace(item)
						}
					})
					
				} else {
					this.$refs.map.showFence(_this.typeObj[data.id])
				}
				
			},
			//绘制选中分组围栏
			drawFenceByTeam(data){
				if(data.id=="@A") return;
				if(data.count===0) {
					this.$message("_暂无围栏数据_");
					return
				}
				//this.choiceFenceType.ID=data.id;
				//this.choiceFenceType.name=data.label;
				//this.choiceFenceType.count=data.count;
				if (typeof _this.teamObj[data.id]==="undefined") {
					_this.teamObj["all"].map(function (item,index) {
						if (item.ID===data.id) {
							_this.$refs.map.showFencePlace(item)
						}
					})
					
				} else {
					this.$refs.map.showFence(_this.teamObj[data.id])
				}
				
			},
			//修改围栏
			changeFenceState(val,data){
				//console.log(val,data);
				let centerPoint=_this.parseWGS(_this.mapType,data.center);
				//转换围栏顶点坐标数组
				let fencePath="*";
				if(data.path != null){
					let arr=[];

					data.path.map(function (item,index) {
						arr.push(_this.parseWGS(_this.mapType,item));
					})
					fencePath=JSON.stringify(arr)
				}
				let FT_LBSGISFence = {
					FAgentGUID: _this.$store.state.companyID,
					FName: data.name,
					FNumber: data.number == "" ? "*" : data.number,
					FRemark: data.remark == "" ? "*" : data.remark,
					FArea: parseFloat(data.area),
					FFormType: data.formType,
					FFenceTypeGUID: data.fenceType,
					FPath:fencePath,
					FRadius: data.radius == null ? 0 : parseFloat(data.radius),
					FCenterLon: centerPoint.lng,
					FCenterLat: centerPoint.lat,
					FAddress: data.address,
					FStatus:data.state?1:0
				};
				$.post("/web/Common/Common_LBS", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "UpdateLBSGISFence",
						FGUID: data.ID,
						FT_LBSGISFence: FT_LBSGISFence,
						FVersion: "1.0.0"
					},
					function (res) {
						if (res.Result == 200) {

							_this.$message({
								type:"success",
								message: '_修改成功_',
							})
							_this.$refs.map.showFence(data.fenceType)
						} else {
							_this.$message({
								type:"waring",
								message: '_修改失败_',
							})

						}
					})

			},
			//显示选中  围栏
			showChoiceFence(data){
				console.log(213123123,data)
				this.$refs.map.showFencePlace(data);
				//_this.changeActive(data, index);
			},
			//编辑围栏
			redactFence(){
				this.$refs.map.redactFence(0)
			},
			//删除围栏
			deleteFence(ID){
				this.$refs.map.deleteFence(ID,0)
			},
			//增加围栏类型
			addFenceType(){
				this.fenceTypeDialog=true;
				this.fenceTypeBoxType=0;
				this.fenceTypeInitData={
					name:"",
					icon:"0",
					strokeColor:"rgba(53,106,195,.8)", //描边颜色
					fillColor:"rgba(53,106,195,.4)"    //填充颜色
				}
			},
			//增加围栏分组
			addFenceTeam(){
				 this.$prompt('_请输入分组名称_', '_新建分组_', {
					confirmButtonText: '_保存_',
					cancelButtonText: '_取消_',
					inputPattern:/^[a-zA-Z0-9\u4E00-\u9FA5_-]{4,16}$/,
					inputErrorMessage: '_请输入_(4~16)_位字母_、_汉字_、_数字_、_、-'
				}).then(({ value }) => {
					
					$.post("/web/Combine/Combine_LBS", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "AddLBSGISFenceTypeGroup",
						FAgentGUID: _this.$store.state.companyID,
						FGroupName: value,
						FDescribe: "*",
						FVersion: "1.0.0"
					},
					function (res) {
						if (res.Result == 200) {
							_this.$message({
								type:"success",
								message: '_保存成功_',
							})
							_this.$store.commit('getFenceData',_this);
						} else if (res.Result == 107) {
							_this.$message({
								type:"waring",
								message: '_名称已存在_,_请重命名_',
							})

						} else {
							_this.$message({
								type:"waring",
								message: '_保存失败_',
							})

						}
					})	
        		}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});       
        		});
			},
			//选择围栏中心图标
			choiceFenceIcon(n){
				this.fenceTypeInitData.icon=n;
				this.isShowIconBox=false;
			},
			//保存围栏类型
			saveFenceType(formName,type){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(type==1){ //编辑模式
							let postData={
								FTokenID:_this.$store.state.FTokenID,
								FAction:"UpdateLBSGISFenceType",
								FAgentGUID: _this.$store.state.companyID,
								FGUID:_this.fenceTypeInitData.ID,
								FT_LBSGISFenceType:{
									FIcon:_this.fenceTypeInitData.icon,
									FName:_this.removeBlank(_this.fenceTypeInitData.name),
									FStrokeColor:_this.fenceTypeInitData.strokeColor,
									FFillColor:_this.fenceTypeInitData.fillColor,
								},
								FVersion:"1.0.0"
							};
							$.ajax({
								url: "/web/Common/Common_LBS",
								cache: false,
								async: true,
								type: 'Post',
								dataType: 'json',
								contentType: 'application/json;charset=utf-8',
								global: false,
								data:JSON.stringify(postData) ,
								success: function (res) {
									console.log("修改围栏类型",res);
									if(res.Result==200){
										_this.fenceTypeDialog=false;
										_this.$message({
											type:"success",
											message:"_修改成功_"
										})
										_this.getFenceData();
									}else {
										_this.$message({
											type:"error",
											message:"_修改失败_"
										})
									}

								}
							})
						}else {
							let postData={
								FTokenID:_this.$store.state.FTokenID,
								FAction:"AddLBSGISFenceType",
								FAgentGUID: _this.$store.state.companyID,
								FT_LBSGISFenceType:{
									FIcon:_this.fenceTypeInitData.icon,
									FName:_this.removeBlank(_this.fenceTypeInitData.name),
									FStrokeColor:_this.fenceTypeInitData.strokeColor,
									FFillColor:_this.fenceTypeInitData.fillColor,
								},
								FVersion:"1.0.0"
							};
							$.ajax({
								url: "/web/Common/Common_LBS",
								cache: false,
								async: true,
								type: 'Post',
								dataType: 'json',
								contentType: 'application/json;charset=utf-8',
								global: false,
								data:JSON.stringify(postData) ,
								success: function (res) {
									console.log("新增围栏类型",res);
									if(res.Result==200){
										_this.fenceTypeDialog=false;
										_this.$message({
											type:"success",
											message:"_新建成功_"
										})
										_this.getFenceData();
									}else {
										_this.$message({
											type:"error",
											message:"_新建失败_"
										})
									}

								}
							})
						}


					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//删除围栏类型
			deleteFenceType(ID){
				if (this.typeObj[ID].fenceArr.length!==0) {
					_this.$message({
						type:"warning",
						message:"_该类型下存在围栏_,_清空围栏后方可删除_"
					});
					return;
				};	
				this.$confirm('_此操作将永久删除该围栏类型_, _是否继续_?', '_提示_', {
					confirmButtonText: '_确定_',
					confirmButtonClass: "search",
					cancelButtonText: '_取消_',
					cancelButtonClass: "cancel el-button--primary",
					type: 'warning'
				}).then(() => {

					$.post("/web/Common/Common_LBS", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "DeleteLBSGISFenceType",
						FGUID: ID,
						FVersion: "1.0.0"
					},
					function (res) {
						if (res.Result == 200) {
							_this.$message({
								type:"success",
								message:"_删除成功_"
							})
							_this.getFenceData();
						}else {
							_this.$message({
								type:"error",
								message:"_删除失败_"
							})
						}
					})
				}).catch(() => {});
				
			},
			//编辑围栏类型
			redactFenceType(data){
				this.fenceTypeDialog=true;
				this.fenceTypeBoxType=1;
				this.fenceTypeInitData={
					name:data.label,
					icon:data.icon,
					strokeColor:data.strokeColor, //描边颜色
					fillColor:data.fillColor,   //填充颜色
					ID:data.id
				}
			},
			//编辑围栏分组
			redactFenceTeam(ID){
				 this.$prompt('_请输入分组名称_', '_编辑分组_', {
					confirmButtonText: '_保存_',
					cancelButtonText: '_取消_',
					inputPattern:/^[a-zA-Z0-9\u4E00-\u9FA5_-]{4,16}$/,
					inputErrorMessage: '_请输入_(4~16)_位字母_、_汉字_、_数字_、_、-'
				}).then(({ value }) => {
					
					$.post("/web/Combine/Combine_LBS", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "UpdateLBSGISFenceTypeGroup",
						FGUID: ID,
						FGroupName: value,
						FDescribe: "*",
						FVersion: "1.0.0"
					},
					function (res) {
						if (res.Result == 200) {
							_this.$message({
								type:"success",
								message: '_保存成功_',
							})
							_this.$store.commit('getFenceData',_this);
						} else if (res.Result == 107) {
							_this.$message({
								type:"waring",
								message: '_名称已存在_,_请重命名_',
							})

						} else {
							_this.$message({
								type:"waring",
								message: '_保存失败_',
							})

						}
					})	
        		}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});       
        		});
			},
			//删除围栏类型
			deleteFenceTeam(ID){
				if (this.teamObj[ID].fenceArr.length!==0) {
					_this.$message({
						type:"warning",
						message:"_该分组下存在围栏_,_清空围栏后方可删除_"
					});
					return;
				};	
				this.$confirm('_此操作将永久删除该围栏分组_, _是否继续_?', '_提示_', {
					confirmButtonText: '_确定_',
					confirmButtonClass: "search",
					cancelButtonText: '_取消_',
					cancelButtonClass: "cancel el-button--primary",
					type: 'warning'
				}).then(() => {

					$.post("/web/Combine/Combine_LBS", {
						FTokenID: _this.$store.state.FTokenID,
						FAction: "DeleteLBSGISFenceTypeGroup",
						FGUID: ID,
						FVersion: "1.0.0"
					},
					function (res) {
						if (res.Result == 200) {
							_this.$message({
								type:"success",
								message:"_删除成功_"
							})
							_this.getFenceData();
						}else {
							_this.$message({
								type:"error",
								message:"_删除失败_"
							})
						}
					})
				}).catch(() => {});
				
			},

		},
		watch: {
			filterText(val) {
				this.$refs.tree2.filter(val);
			},
			screenHeight () {
				this.adjustPage()
			}
		},
		computed: {
			systemID: {
				get () {
					return this.$store.state.choiceSystemID
				}
			},
			mapType: {
				get () {
					return this.$store.state.mapType
				}
			},
			typeTree: {//类型树
				get () {
					return this.$store.state.fenceTypeTree
				}
			},
			teamTree: {//分组树
				get () {
					return this.$store.state.fenceTeamTree
				}
			}, 
			typeObj: {//围栏类型对象
				get () {
					return this.$store.state.fenceTypeObj
				}
			},    
			teamObj: {//围栏分组对象
				get () {

					return this.$store.state.fenceTeamObj
				}
			},
			LocksTree: {//电子锁数据
				get () {
					return this.$store.state.LocksTree
				}
			},
			locksIDArr: {//电子锁ID数据
				get () {
					return this.$store.state.locksIDArr
				}
			}
			
		}
	}
</script>
<style>


	.fence_btn{
		display:inline-block;
		width:20px;
		height:20px;
	}
	.deleteFence{
		background:url(/static/img/carIcon/delete.png) no-repeat center;
	}
	.redactFence{
		background:url(/static/img/carIcon/redact.png) no-repeat center;
	}

	.fenceTypeBox{
		width:450px!important;
	}
	.fenceTypeBox .el-dialog__body{
		padding: 5px 20px
	}
	.fenceTypeBox td {
		height:58px;
		line-height:58px;
	}

	.fenceTypeBox input {
		width:190px;
		height:24px;
		line-height:25px;
		border:1px solid #a9a9a9;
	}
	.fence-icon-box{
		position:absolute;
		top:0;
		left:58px;
		width:200px;
	}
	.fence-icon-box .icon-item{
		display:inline-block;
		width:24px;
		height:24px;
		margin:3px;
	}
	.fenceTypeBox .el-color-picker{
		top:9px;
	}
	.fencetypeicon{
		margin: 2px 0 0 2px;
		width:24px;
		height:24px;
	}
	/* 配置围栏弹窗样式 */
	.fenceConfig{
		width: 900px!important;
	}
	.fenceConfig .el-dialog__body{
		padding:10px;
	}
	.fenceConfig .list{
		margin-right: 5px;
		height:400px;
		border: 2px solid #1970cf;
	}
	.fence_search{
		height: 34px;
	}
	.fence_search .el-input__inner {
    	height: 34px;
		border-bottom: 1px solid #1970cf;
	}
	.lock-tree{
		height: 361px;
		overflow-y: auto;
	}
	.lock-tree .el-tree-node__content{
		border-bottom: 1px solid #1970cf;
	}
	.asset_list{
		height: 100%;
		overflow-y: auto;
	}
	.asset_list li{
		position: relative;
		padding-left: 10px;
		height: 36px;
		line-height: 36px;
		border-bottom: 1px solid #1970cf;
	}
	.asset_list .btn_list{
		position: absolute;
		right: 5px;
		top: 0;
		display: inline-block;
	}
	.asset_list .describe{
		display: inline-block;
		text-align: center;
		width: 120px;
	}
	.config_footer{
		margin-top: 10px;
		text-align: right;
	}
</style>

