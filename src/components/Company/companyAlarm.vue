<template>
	<div style="height: 100%">
		<!-- 树 -->
		<div class="carTeamList">
			<el-input
				class="filterInput treeInput"
				placeholder="_输入关键字_"
				v-model="filterTextOne">
			</el-input>
			<el-tree ref="expandOne" class="expand-tree"
					 v-if="isLoadingTree"
					 :data="setTree"
					 node-key="id"
					 highlight-current
					 :props="defaultProps"
					 :expand-on-click-node="false"
					 :render-content="renderContent"
					 default-expand-all
					 :filter-node-method="filterOne"
					 @node-click="handleNodeClick">
			</el-tree>
	    </div>
	</div>
</template>
<script>
	//import TreeRender from './tree_render'
	import  TreeRender from 'components/tree/tree_render.vue'
	export default {
		data(){
	        const checkFPhoneNumber = (rule, value, callback) => {
		        var uPattern = /^[0-9\-\+\(\)]{1,18}$/g;
		        if(!value) {
	                return callback(new Error('_请输入有效号码_'));
	            }
				else if(value&& !uPattern.test(value)){
	            	console.log('error')
	             	callback(new Error('_请输入有效号码_'));
	            } else{
	            	console.log('succ')
	            	callback();
	            }
		    };
		    const checkFshortname = (rule, value, callback) => {   //公司简称长度检测
		        var uPattern = /^[\u4e00-\u9fa5]{1,10}$|^[A-Za-z]{1,20}$/g;  //10中文或20英文
		        if(!value) {
	                return callback(new Error('_请输入公司简称_'));
	            }
				else if(value&& !uPattern.test(value)){
	            	console.log('error')
	             	callback(new Error('_请输入十位内中文或者二十位内英文_'));
	            } else{
	            	console.log('succ')
	            	callback();
	            }
		    };
		    const checkFFullName = (rule, value, callback) => {   //公司简称长度检测
		        var uPattern = /^[\u4e00-\u9fa5]{1,15}$|^[A-Za-z]{1,30}$/g;  //10中文或20英文
		        if(!value) {
	                return callback(new Error('_请输入公司全称_'));
	            }
				else if(value&& !uPattern.test(value)){
	            	console.log('error')
	             	callback(new Error('_请输入十五位内中文或者三十位内英文_'));
	            } else{
	            	console.log('succ')
	            	callback();
	            }
		    };
			return {
				filterTextOne:'',
				comDetail:'',  //公司详情数据

		        isLoadingTree: false,//是否加载节点树

		        defaultProps: {
		          children: 'children',
		          label: 'FShortName'
		        },
        		defaultExpandKeys: [],//默认展开节点列表
			}
		},
		watch: {
			filterTextOne(val) {
		        this.$refs.expandOne.filter(val);
		    },
		    screenHeight () {
		        this.adjustPage();
		    },
		},
		props: ['typeTable'],
		methods: {
		    //重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//取消提交
			cancelForm(formName){
				this.companyView=false
			},

			adjustPage(){
				console.log('this.tree_height',this.tree_height);
			},
			//搜索树
			filterOne(value, data) {
		        if (!value) return true;
		        return data.FShortName.indexOf(value) !== -1;
		    },
			initExpand(){
		        this.setTree.map((a) => { 
		        	this.defaultExpandKeys.push(a.FGUID) 
		        });
		        this.isLoadingTree = true;
		        console.log('this.setTree',this.setTree)
		    },
		    handleNodeClick(d,n,s){
		    	console.log('d',d)
		        //d.isEdit = false;   //放弃编辑状态
		        let id=d.FGUID;
		        let name=d.FShortName;
		        let fatherId=d.FFatherAgentGUID;
		        let type=d.type;
            	this.$emit("treeId",[id,name,fatherId,type]);  //查询该公司名下的直属全部数据
		    },
		    renderContent(h,{node,data,store}){//加载节点
		    	let _this=this;
		        return h(TreeRender,{
		          props: {
		            DATA: data,
		            NODE: node,
		            STORE: store,
		            renderID:this.typeTable,
		            maxexpandId: _this.non_maxexpandId
		          },
		          on: {
		            nodeAdd: ((s,d,n) => _this.handleAdd(s,d,n)),
		            nodeEdit: ((s,d,n) => _this.handleEdit(s,d,n)),
		            nodeDel: ((s,d,n) => _this.handleDelete(s,d,n)),
		            nodeDetail: ((s,d,n) => _this.handleDetail(s,d,n)),
		            groupAdd: ((s,d,n) => _this.groupHandleAdd(s,d,n)),
		            groupDel: ((s,d,n) => _this.groupHandleDelete(s,d,n)),
		            groupEdit: ((s,d,n) => _this.groupHandleEdit(s,d,n))
		          }
		        });
		    },

		},
		mounted(){
			var _this=this;
			this.initExpand()
      		this.$store.commit('getuserCompany','');
      		setTimeout(() => {
		        this.adjustPage();
		    },100);
		},
		computed:{
			setTree:function(){  //请求store中tree数据
				return this.$store.state.treeDataCompany;	
			},
		},
	};
</script>
<style>
	.expand-tree{
	  border:none;
	  margin:5px 0 0 2px;
	}
	.expand-tree .el-tree-node.is-current,
	.expand-tree .el-tree-node:hover{
	  overflow:hidden;
	}
	.expand-tree .is-current>.el-tree-node__content .tree-btn,
	.expand-tree .el-tree-node__content:hover .tree-btn{
	  display:inline-block;
	}
	.expand-tree .is-current>.el-tree-node__content .tree-label{
	  font-weight:600;
	  white-space:normal;
	}
	.describeArea{
		margin-top: 3px;
	}
	.footButton{
		height:35px;
		margin:12px 10px 0 10px;
	}
	.comcss td{
		/*vertical-align: middle;*/
	}
	/* .carTeamList{
		width:100%;
	}
	.carTeamList .el-tree{
		overflow-x:auto;
		height:94%;
	} */
/*
	.zy{
		height:100%;
		white-space: nowrap;
		width:100%;
	}
*/
	.tree-expand{
		white-space: normal;
		/*display:inline-block;*/
	}
	.tree-expand .tree-btn{
		/*float:none;*/
		/*margin-left:100px;*/
	}
	.companyDialog .el-form-item{
    	margin-bottom: 14px;
    }
</style>


