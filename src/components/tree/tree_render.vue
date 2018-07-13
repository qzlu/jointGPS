<template>
	<span class="tree-expand">
		<span  
		:class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
			<!-- <span>{{DATA.name}}</span> -->
			<i class='fa fa-home icon fa-lg' v-if='DATA.type==1'></i>
			<i class='fa fa-building icon' v-if='DATA.type==0'></i>
			<span>{{DATA.FShortName}}</span>
			<span style='color:#005fc6' v-if='DATA.type==1&&(renderID==2||renderID==3)'>[{{DATA.FVehicleCount}}]</span>
			<span style='color:#005fc6' v-if='DATA.type==1&&renderID==0'>[{{DATA.FAssetCount}}]</span>
			<span style='color:#005fc6' v-if='DATA.type==1&&renderID==1'>[{{DATA.FDriverCount}}]</span>
		</span>
		<span class="tree-btn" v-show="!DATA.isEdit">
			<i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"  title='_添加子公司_' v-if='renderID!==4&&DATA.type==1'></i>
			<i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"  title='_编辑公司_' v-if='renderID!==4&&DATA.FFatherAgentGUID!==null&&DATA.type==1'></i>
			<i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"  title='_删除公司_' v-if='renderID!==4&&DATA.FFatherAgentGUID!==null&&DATA.type==1'></i>
			<i class="el-icon-more" @click.stop="nodeDetail(STORE,DATA,NODE)"  title='_公司详情_' v-if='renderID!==4&&DATA.type==1'></i>
			<i class="el-icon-menu" @click.stop="groupAdd(STORE,DATA,NODE)"  title='_新建分组_'  v-if='renderID!==4&&DATA.type==1'></i>
			<i class="el-icon-delete" @click.stop="groupDel(STORE,DATA,NODE)"  title='_删除分组_' v-if='DATA.type==0'></i>
			<i class="el-icon-edit" @click.stop="groupEdit(STORE,DATA,NODE)"  title='_编辑分组_' v-if='DATA.type==0'></i>
		</span>
	</span>
</template>

<script>
	export default{
		// name: 'treeExpand',
		props: ['NODE', 'DATA', 'STORE', 'maxexpandId','renderID'],
		methods: {
			nodeAdd(s,d,n){//新增
				this.$emit('nodeAdd',s,d,n)
			},
			nodeEdit(s,d,n){//编辑
				/*d.isEdit = true;
				this.$nextTick(() => {
					this.$refs['treeInput'+d.id].$refs.input.focus()
				})*/
				this.$emit('nodeEdit',s,d,n);
			},
			nodeDetail(s,d,n){ //详情
				this.$emit('nodeDetail',s,d,n);
			},
			nodeDel(s,d,n){//删除
				this.$emit('nodeDel',s,d,n)
			},

			nodeEditPass(s,d,n){//编辑完成
				d.isEdit = false;
			},

			nodeEditFocus(){
				//阻止点击节点的事件冒泡
			},
			
			groupAdd(s,d,n){  //新增分组
				this.$emit('groupAdd',s,d,n)
			},
			groupDel(s,d,n){  //删
				this.$emit('groupDel',s,d,n)
			},
			groupEdit(s,d,n){  //改
				this.$emit('groupEdit',s,d,n)
			},
		}
	}
</script>

<style>
	.tree-expand{
		overflow:hidden;
	}
	.tree-expand .tree-label.tree-new{
		font-weight:600;
	}
	.tree-expand .tree-label{
		font-size:0.9em;
	}
	.tree-expand .tree-label .edit{
		width:80%;
	}
	.tree-expand .tree-btn{
		display:none;
		float:right;
		margin-right:20px;
	}
	.tree-expand .tree-btn i{
		color:#8492a6;
		font-size:0.9em;
		margin-right:3px;
	}
</style>