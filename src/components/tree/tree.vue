<template>
	<div class="halo-tree">
		<div class="tree-header" id="tree-header">
			<div class="lockbtn-list" v-if="options.isShowLockBtn&&systemID==2">
				<div class="btn-item">
					<i class="fa fa-unlock" @click="handleLockStatus(1)" :class="{'text-yellow':btnClassName==1}" title="_只选择开锁设备_"></i>
				</div>
				<div class="btn-item">
					<i class="fa fa-lock" @click="handleLockStatus(0)" :class="{'text-yellow':btnClassName==0}" title="_只选择上锁设备_"></i>
				</div>
			</div>
			<div class="lockbtn-list" v-if="options.isShowLockBtn&&systemID==7">
				<div class="btn-item">
					<i class="fa fa-file-text" @click="handleWaybillStatus(1)" :class="{'text-yellow':btnClassName==1}" title="_只选择有单设备_"></i>
				</div>
				<div class="btn-item">
					<i class="fa fa-file-text-o" @click="handleWaybillStatus(0)" :class="{'text-yellow':btnClassName==0}" title="_只选择无单设备_"></i>
				</div>
			</div>
			<div class="input-wrap" :class="{'float-left':options.isShowLockBtn&&(systemID==2 || systemID==7)}">
				<input type="text" class="input-custom no-border search-car-input" placeholder="_请输入关键字_" v-model="search">
				<span class="search-car-btn"><i class="fa fa-search fa-lg"></i></span>
				<span @click="refreshCarData" class="refresh-car-btn"><i class="fa fa-refresh fa-lg"></i></span>

			</div>

		</div>
		<div id="tree-body">
			<tree-node :treeData='store.root' :options="options"
					   @handlecheckedChange="handlecheckedChange"
					   @deleteFenceType="deleteFenceType"
					   @redactFenceType="redactFenceType"
					   @deleteFence="deleteFence"
					   @redactFence="redactFence"
					   @deleteFenceTeam="deleteFenceTeam"
					   @redactFenceTeam="redactFenceTeam"
					   @addFenceTeam="addFenceTeam"
					   @fenceConfig="fenceConfig"
					   @addFenceType="addFenceType"></tree-node>
		</div> 

	</div>
</template>
<script>
	import TreeNode from 'components/tree/tree-node.vue'
	import TreeStore from 'js/Common/tree-store'
	export default {
		name: 'tree',
		props: {
			treeData: [Array],
			options: [Object]
		},
		data () {
			return {
				search: null,
				store: {
					root: [],
					last: null
				},
				btnClassName:null
			}
		},
		created () {
			this.isTree = true
			this.store = new TreeStore({
				root: (this.treeData || []).slice(0),
				last: null
			})
		},
		watch: {
			search: function (val) {
				this.store.filterNodes(val, this.options.search)
				if(!this.treeData[0]) return
				if(val=="") {
					this.treeData[0].open=true;
					this.treeData[0].children.map(function(item,index){
						if(!item.rootType){
							item.open=false
						}
					})
					return;
				}
			},
			treeData: function (data) {
				this.store = new TreeStore({
					root: (this.treeData || []).slice(0),
					last: null
				})
			}
		},
		methods: {
			handlecheckedChange (node) {
				this.btnClassName=null;
				console.log(this.options.halfCheckedStatus)
				if (this.options.halfCheckedStatus) {
					this.store.changeCheckHalfStatus(node)
				} else {
					this.store.changeCheckStatus(node)
				}
				this.getSelectedNodeIds()
			},
			getSelectedNodes () {
				const allnodes = this.store.datas
				let selectedNodes = []
				for (let [, node] of allnodes) {
					if (node.checked) {
						selectedNodes.push(node)
					}
				}
				return selectedNodes
			},
			getSelectedNodeIds () {
				const allnodes = this.store.datas
				let selectedNodeIds = []
				for (let [, node] of allnodes) {
					if (node.checked) {
						selectedNodeIds.push(node.id)
					}
				}

				this.$emit('choiceCarId', selectedNodeIds)
				return selectedNodeIds
			},
			//调用父组件 刷新数据
			refreshCarData(){
				this.search="";
				this.$emit('refresh'); //向服务器刷新数据

			},
			//选择有无上锁
			handleLockStatus(type){
				this.$emit('handleLockStatus',type);
				this.btnClassName=type
			},
			//选择有单 或者无单
			handleWaybillStatus(type){
				this.$emit('handleWaybillStatus',type);
				this.btnClassName=type
			},
			//增加围栏类型
			addFenceType (){
				this.$emit('addFenceType')
			},
			//增加围栏类型
			addFenceTeam (){
				this.$emit('addFenceTeam')
			},
			//删除围栏类型
			deleteFenceType(ID){
				this.$emit('deleteFenceType',ID)
			},
			//编辑围栏类型
			redactFenceType (data){
				this.$emit('redactFenceType',data)
			},
			//删除围栏类型
			deleteFence(ID){
				this.$emit('deleteFence',ID)
			},
			//编辑围栏类型
			redactFence (ID){
				this.$emit('redactFence',ID)
			},
			//删除围栏分组
			deleteFenceTeam (ID){
				this.$emit('deleteFenceTeam',ID)
			},
			//编辑围栏分组
			redactFenceTeam (ID){
				this.$emit('redactFenceTeam',ID)
			},
			// [配置围栏]
			fenceConfig(ID){
				this.$emit('fenceConfig',ID)
			}
		},
		components: {TreeNode},
		computed:{
			systemID:{
				get () {
					return this.$store.state.choiceSystemID
				}
			}
		}

	}
</script>
<style>

	.halo-tree {
		font-size:14px;
		min-height:20px;
	}

	#tree-body {
		height:700px;
		overflow:auto;
		padding:5px 0 0 5px;
		font-size: 13px;

	}
	.tree-header{
		position:relative;
		width:100%;
		height:30px;
		overflow:hidden;
		background:#fbfbfb;
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fbfbfb', endColorstr='#e4e4e4',gradientType=0);
		background:-moz-linear-gradient(top, #fbfbfb, #e4e4e4);
		background:-o-linear-gradient(top, #fbfbfb, #e4e4e4);
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #fbfbfb), color-stop(100%, #e4e4e4));
		background:-webkit-linear-gradient(top, #fbfbfb 0%, #e4e4e4 100%);
		background: -ms-linear-gradient(top, #fbfbfb 0%, #e4e4e4 100%);
		background: linear-gradient(to bottom, #fbfbfb 0%, #e4e4e4 100%);
	}
	.input-wrap{
		position:relative;
	}

	.search-car-input {
		border-bottom:1px solid #d9d9d9;
		width:100%;
		height:30px;
		outline:none;
		padding:0 25px;
		position:relative;
		background:transparent;
	}
	.search-car-btn {
		position:absolute;
		left:5px;
		top:5px;
	}

	.refresh-car-btn {
		cursor:pointer;
		position:absolute;
		right:5px;
		top:5px;
	}
	.lockbtn-list{
		width:60px;
		float:left;
		text-align:center;
		font-size:24px;
	}
	.btn-item{
		display:block;
		float:left;
		width:30px;
		height:30px;
		line-height:30px;
		color:#000;
		cursor:pointer;
	}
</style>

