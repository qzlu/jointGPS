<template>
	<span class="tree-expand">
		<span  
		:class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
			<span>{{DATA.FShortName}}</span>
		</span>
		<span class="tree-btn" v-show="!DATA.isEdit">
			<i class="el-icon-plus addFaster" @click.stop="nodeAdd(STORE,DATA,NODE)" title='_添加子公司_' ></i>
			<i class="el-icon-arrow-right editFaster" @click.stop="nodeEdit(STORE,DATA,NODE)"  title='_关联车辆_' v-if='(renderID==0||renderID==1)&&sysNum!==6'></i>
			<i class="el-icon-arrow-right editFaster" @click.stop="nodeEdit(STORE,DATA,NODE)"  title='_关联集装箱_' v-if='sysNum==6'></i>
			<i class="el-icon-d-arrow-right deleteFaster" @click.stop="nodeEdit(STORE,DATA,NODE)"  title='_关联设备与司机_' v-if='renderID==2'></i>
		</span>
	</span>
</template>

<script>
	export default{
		name: 'treeExpand',
		props: ['NODE', 'DATA', 'STORE', 'maxexpandId','renderID','sysNum'],
		methods: {
			nodeAdd(s,d,n){    //新增
				this.$emit('nodeAdd',s,d,n)
			},
			nodeEdit(s,d,n){  //关联车辆
				this.$emit('nodeEdit',s,d,n)
			},
			/*nodeDel(s,d,n){  
				this.$emit('nodeDel',s,d,n)
			},*/
			nodeEditFocus(){
				//阻止点击节点的事件冒泡
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
	.addFaster , .editFaster, .deleteFaster{
		display: inline-block;
		width:20px;
		height:20px;
		line-height: 20px;
		text-align: center;
	}
</style>