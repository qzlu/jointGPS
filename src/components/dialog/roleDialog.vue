<template>
	<div class='role-dialog'>
		<el-dialog title='_角色配置_' :visible.sync="roleView" custom-class="role-dialog">
			<div style='height:460px;'>
				<el-table :data="tableData3" :span-method="objectSpanMethod" :height="460" style="width: 100%">
					<el-table-column prop="date" width="140" label='_全选_' :render-header='renderHeader' align='left' class-name='renderHH'>
						<template scope="scope">
							<el-checkbox @change='choiceMainMenu(scope.$index, scope.row)' v-model='scope.row.row0'></el-checkbox>
							<span>{{scope.row.date}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="name" width="160" label='_子菜单_' align='left'>
						<template scope="scope">
							<el-checkbox @change='choiceOneRow(scope.$index, scope.row)' v-model='scope.row.row1'></el-checkbox>
							<span>{{scope.row.name}}</span>
						</template>
					</el-table-column>
					<el-table-column width="190" label='_接甩挂_' :render-header='renderHeader' align='left'>
						<template scope="scope">
							<el-checkbox :disabled='!scope.row.able2' v-model='scope.row.status2'></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column width="110" label='_电子锁_' :render-header='renderHeader' align='left'>
						<template scope="scope">
							<el-checkbox :disabled='!scope.row.able3' v-model='scope.row.status3'></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column width="160" label='_车队管理_' :render-header='renderHeader' align='left'>
						<template scope="scope">
							<el-checkbox :disabled='!scope.row.able4' v-model='scope.row.status4'></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column width="190" label='_集装箱管理_' :render-header='renderHeader' align='left'>
						<template scope="scope">
							<el-checkbox :disabled='!scope.row.able5' v-model='scope.row.status5'></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column width="180" label='_智能配送_' :render-header='renderHeader' align='left'>
						<template scope="scope">
							<el-checkbox :disabled='!scope.row.able6' v-model='scope.row.status6'></el-checkbox>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="roleView = false" class='el-button el-button--default cancel el-button--primary'>_取消_</el-button>
				<el-button type="primary" @click="saveMenu">_确定_</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	let _this
	export default {
		data() {
			_this = this
			return {
				checked: true,
				tableData3: [],
				roleView: false,
				roleID: null,
				tempparentmenu: [],
				oneOnly: [],
				systemMenu: {},//各个系统菜单数据对象
				menuObj: {},//菜单选择相关数据对象
				aa: false,
			}
		},
		mounted() {
			setTimeout(() => {
				this.getAccountMenuList();
			}, 100);
		},
		methods: {
			saveMenu() {
				let tempArr = [];
				let saveArr = [];
				$.each(this.tableData3, function (index, obj) {
					for (let i = 2; i <= 6; i++) {
						if (obj['able' + i] && obj['status' + i]) {
							tempArr.push(obj['id' + i].ID)
							tempArr.push(obj['id' + i].parentID)
						}
					}
				})
				if (tempArr.length == 0) {
					_this.message('_请先勾选_', 'warning');
					return
				} else {
					const set = new Set(tempArr);
					saveArr = Array.from(set);
					console.log('saveArr', saveArr);
				}
				let postData = {
					FTokenID: _this.$store.state.FTokenID,
					FAction: "AddAdminRoleAllMenu",
					FRoleGUID: _this.roleID,
					FMenuGUIDs: saveArr.join(","),
					FVersion: "1.0.0"
				}
				$.ajax({
					"url": "/web/Common/Common_Admin",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": JSON.stringify(postData),
					success: function (json) {
						if (json.Result == 200) {
							_this.$message({
								message: '_保存成功_',
								type: 'success'
							});
							_this.roleView = false;

						} else {
							_this.$message({
								message: '_保存失败_',
								type: 'error'
							})
						}
					}
				})
			},
			showMenu() {
				this.tableData3 = [];
				console.log('only', this.oneOnly)
				$.each(this.oneOnly, function (index, obj) {
					for (let i = 0; i < obj.children.length; i++) {
						let t = (i == 0) ? obj.children.length : 0;
						let able2 = (_this.menuObj.system1.indexOf(obj.children[i].FICONURLAddress) == -1) ? false : true;
						let able3 = (_this.menuObj.system2.indexOf(obj.children[i].FICONURLAddress) == -1) ? false : true;
						let able4 = (_this.menuObj.system4.indexOf(obj.children[i].FICONURLAddress) == -1) ? false : true;
						let able5 = (_this.menuObj.system6.indexOf(obj.children[i].FICONURLAddress) == -1) ? false : true;
						let able6 = (_this.menuObj.system7.indexOf(obj.children[i].FICONURLAddress) == -1) ? false : true;
						if (typeof (_this.systemMenu[1]) !== 'undefined') {
							var id2 = ((_this.systemMenu[1]).hasOwnProperty(obj.children[i].FICONURLAddress)) ? (_this.systemMenu[1][obj.children[i].FICONURLAddress]) : null;
						} else {
							var id2 = null
						}
						if (typeof (_this.systemMenu[2]) !== 'undefined') {
							var id3 = ((_this.systemMenu[2]).hasOwnProperty(obj.children[i].FICONURLAddress)) ? (_this.systemMenu[2][obj.children[i].FICONURLAddress]) : null;
						} else {
							var id3 = null
						}
						if (typeof (_this.systemMenu[4]) !== 'undefined') {
							var id4 = ((_this.systemMenu[4]).hasOwnProperty(obj.children[i].FICONURLAddress)) ? (_this.systemMenu[4][obj.children[i].FICONURLAddress]) : null;
						} else {
							var id4 = null
						}
						if (typeof (_this.systemMenu[6]) !== 'undefined') {
							var id5 = ((_this.systemMenu[6]).hasOwnProperty(obj.children[i].FICONURLAddress)) ? (_this.systemMenu[6][obj.children[i].FICONURLAddress]) : null;
						} else {
							var id5 = null
						}
						if (typeof (_this.systemMenu[7]) !== 'undefined') {
							var id6 = ((_this.systemMenu[7]).hasOwnProperty(obj.children[i].FICONURLAddress)) ? (_this.systemMenu[7][obj.children[i].FICONURLAddress]) : null;
						} else {
							var id6 = null
						}
						_this.tableData3.push({
							date: obj.label,
							name: obj.children[i].label,
							able2: able2,
							able3: able3,
							able4: able4,
							able5: able5,
							able6: able6,
							status2: false,
							status3: false,
							status4: false,
							status5: false,
							status6: false,
							row0: false,
							row1: false,
							span: t,
							id2: id2,
							id3: id3,
							id4: id4,
							id5: id5,
							id6: id6,
							FICONURLAddress: obj.children[i].FICONURLAddress
						})
					}
				})
			},
			renderHeader(createElement, { column, $index }) {
				let label = column.label
				return createElement(
					'div',
					{
						'class': 'renderTableHead'
					},
					[
						createElement('el-checkbox', {
							attrs: { 'v-model': _this.menuObj["allSystem" + $index] },
							on: {
								change: function () {

									_this.menuObj["allSystem" + $index] = !_this.menuObj["allSystem" + $index]
									let t = _this.menuObj["allSystem" + $index];
									if ($index == 0) {  //全选
										$.each(_this.tableData3, function (index, obj) {
											obj.row0 = t;
											obj.row1 = t;
											for (let i = 2; i <= 6; i++) {
												if (obj['able' + i]) {
													obj['status' + i] = t;
												}
											}
										})
									} else {          //全选某一个系统
										$.each(_this.tableData3, function (index, obj) {
											if (obj['able' + $index]) {
												obj['status' + $index] = t;
											}
										})
									}
								}
							}
						}, label
						),
					]
				);
			},
			choiceMainMenu(index, row) {
				console.log(row)
				let temp = this.tableData3.slice(index, index + row.span)
				$.each(temp, function (index, obj) {
					obj.row1 = row.row0;
					for (let i = 2; i <= 6; i++) {
						if (obj['able' + i]) {
							obj['status' + i] = row.row0;
						}
					}
				})
			},
			choiceOneRow(index, row) {
				for (let i = 2; i <= 6; i++) {
					if (row['able' + i]) {
						row['status' + i] = row.row1;
					}
				}
			},
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {   //7行
				if (columnIndex === 0) {
					if (row.span > 1) {
						return {
							rowspan: row.span,
							colspan: 1
						};
					} else if (row.span === 0) {
						return {
							rowspan: 0,
							colspan: 0
						};
					} else {
						return {
							rowspan: 1,
							colspan: 1
						};
					}
				}
			},
			//打开dialog
			openDialog(id) {
				_this.treeLoading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					customClass: "loading-bg"
				});
				this.roleID = id;
				this.menuConfig(this.roleID); //获取该用户已经有的权限
			},
			menuConfig(index, row) {
				let FGUID = this.roleID;
				let TokenID = this.$store.state.FTokenID;
				$.post("web/Common/Common_Admin", {
					FTokenID: TokenID,
					FAction: "QueryAdminMenuListByRoleGUID",
					FRoleGUID: FGUID,
					FVersion: "1.0.0"
				}, function (data) {
					if (data.Result == "200") {
						console.log('a角色的权限', data);
						$.each(_this.tableData3, function (index, obj) {
							obj.row0 = false;
							obj.row1 = false;
							for (let i = 2; i <= 6; i++) {
								obj['status' + i] = false;
							}
						})
						_this.menuObj.allSystem0 = false;
						_this.menuObj.allSystem2 = false;
						_this.menuObj.allSystem3 = false;
						_this.menuObj.allSystem4 = false;
						_this.menuObj.allSystem5 = false;
						_this.menuObj.allSystem6 = false;

						if (data.FObject.length > 0) {
							$.each(data.FObject, function (index, obj) {
								if (obj.FMenuLevle == 2) {
									$.each(_this.tableData3, function (ix, item) {
										if (item.FICONURLAddress == obj.FICONURLAddress) {
											switch (obj.FSystemType) {
												case 1:
													_this.tableData3[ix].status2 = true;
													break
												case 2:
													_this.tableData3[ix].status3 = true;
													break
												case 4:
													_this.tableData3[ix].status4 = true;
													break
												case 6:
													_this.tableData3[ix].status5 = true;
													break
												case 7:
													_this.tableData3[ix].status6 = true;
													break
											}
										}
									})
								}
							})
						};
						_this.treeLoading.close();
						_this.roleView = true;
					}
				}).error(function () {
					console.log('_请求失败_')
				});
			},
			//获取登录账号权限
			getAccountMenuList() {
				let SystemType = this.$store.state.choiceSystemID;
				let TokenID = this.$store.state.FTokenID;
				$.post("web/Common/Common", {
					FTokenID: TokenID,
					FAction: "QueryMenuList",
					FSystemType: 0,
					FVersion: "1.0.0"
				}, function (data) {
					//var ii=0;
					console.log('登录角色权限', data);
					//找一级菜单
					_this.menuObj = { //每个系统菜单自定义ID
						system1: [],
						system2: [],
						system4: [],
						system6: [],
						system7: [],
						obj1: {},
						obj2: {},
						obj4: {},
						obj6: {},
						obj7: {},
						switch: false,    //触发DOM渲染开关
						allSystem1: false,  //按系统类型全选开关
						allSystem2: false,
						allSystem4: false,
						allSystem6: false,
						allSystem7: false,
						row: {}, //每行全选开关
						allSystem0: false //全选开关
					};

					$.each(data.FObject, function (index, obj) {
						if (obj.FMenuLevle == 1) {
							_this.tempparentmenu.push({
								//parentID:obj.FParentGUID,
								id: obj.FGUID,
								FICONURLAddress: obj.FICONURLAddress,
								label: _this.parseRouteMenu(obj.FICONURLAddress - 0).name,
								children: [],
							})
						}
						_this.systemMenu[obj.FSystemType] = new Object();

						_this.menuObj.row[obj.FICONURLAddress] = false;

						switch (obj.FSystemType - 0) {
							case 1:
								_this.menuObj.system1.push(obj.FICONURLAddress - 0);  //系统1的所有icon
								_this.menuObj.obj1[obj.FICONURLAddress] = false;      //对应obj1里面的icon:false
								break;
							case 2:
								_this.menuObj.system2.push(obj.FICONURLAddress - 0);
								_this.menuObj.obj2[obj.FICONURLAddress] = false;
								break;
							case 4:
								_this.menuObj.system4.push(obj.FICONURLAddress - 0);
								_this.menuObj.obj4[obj.FICONURLAddress] = false;
								break;
							case 6:
								_this.menuObj.system6.push(obj.FICONURLAddress - 0);
								_this.menuObj.obj6[obj.FICONURLAddress] = false;
								break;
							case 7:
								_this.menuObj.system7.push(obj.FICONURLAddress - 0);
								_this.menuObj.obj7[obj.FICONURLAddress] = false;
								break;
						}
					})					//找二级
					$.each(data.FObject, function (index, obj) {    //整理出一个
						_this.systemMenu[obj.FSystemType][obj.FICONURLAddress] = {
							ID: obj.FGUID,
							parentID: obj.FParentGUID
						}
						for (var j = 0; j < _this.tempparentmenu.length; j++) {
							var obj_p = _this.tempparentmenu[j];
							if (obj.FMenuLevle == "2" && obj_p.id == obj.FParentGUID) {
								obj_p.children.push({
									id: obj.FGUID,
									FICONURLAddress: obj.FICONURLAddress - 0,
									p_id: obj_p.id,
									label: _this.parseRouteMenu(obj.FICONURLAddress - 0).name,
									children: [],
									FSystemType: obj.FSystemType
								});
							}
						}
					})
					//去掉重复一级菜单
					let obj = {};
					_this.oneOnly = [];      //保存先找到的一级菜单
					let oneRepeat = [];    //保存重复的一级菜单
					for (let i = 0; i < _this.tempparentmenu.length; i++) {
						let p = _this.tempparentmenu[i];
						if (!obj[p.FICONURLAddress]) {
							_this.oneOnly.push(p);
							obj[p.FICONURLAddress] = true;
						}
						else {
							oneRepeat.push(p)
						}
					}
					//连接相同一级菜单的二级菜单
					for (let m = 0; m < _this.oneOnly.length; m++) {
						for (let n = 0; n < oneRepeat.length; n++) {
							let arrChildren = [];
							let onlyChildren = [];
							if (_this.oneOnly[m].FICONURLAddress == oneRepeat[n].FICONURLAddress) {
								arrChildren = _this.oneOnly[m].children.concat(oneRepeat[n].children)
								let objAll = {};
								for (let k = 0; k < arrChildren.length; k++) {
									if (!objAll[arrChildren[k].FICONURLAddress]) {
										onlyChildren.push(arrChildren[k]);
										objAll[arrChildren[k].FICONURLAddress] = true;
									}
								}
								_this.oneOnly[m].children = onlyChildren;
							}
						}
					}
					console.log('caidan', _this.oneOnly)
					_this.showMenu()
				});

			},
		},

		/* watch: {
			roleView:function(val){
				if(val){
					this.$nextTick(function () {
	    				this.menuConfig(this.roleID);
	    			})
				}
			}
		}, */
		computed: {


		},
	};
</script>
<style>
	.el-dialog .el-dialog__body {
		overflow: hidden;
	}

	.role-dialog .el-dialog {
		width: 1190px;
	}

	.role-dialog .el-table__header-wrapper thead div {
		text-align: left
	}

	.role-dialog .el-table .cell,
	.role-dialog .el-table th div,
	.role-dialog .el-table--border td:first-child .cell,
	.role-dialog .el-table--border th:first-child .cell {
		padding-left: 0;
	}

	.renderHH label.el-checkbox {
		padding-left: 10px;
	}
</style>