<template>
	<section style='height:100%'>
		<div class='companyTree'>
	        <el-dialog title="_选择公司_" :visible.sync="checkCompanyDialog" top='22vh'>
	            <div class='treeContent'>
		        	<div class='treeInput' style='height:30px;margin-bottom:2px'>
		        		<el-input
		        			placeholder="_输入关键字_"
		        			v-model="filterTextMore">
		        		</el-input>          
		        	</div>
		        	<div style='overflow:auto;height:350px;border:1px solid #999'>
			            <div>
				            <el-tree ref="expandMore" class="expand-tree"
			    		        v-if="isLoadingTree"
			    		        :data="setTree"
			    		        show-checkbox
			    		        node-key="FGUID"
			    		        highlight-current
			    		        :props="defaultProps"
			    		        :expand-on-click-node="false"
			    		        :render-content="renderContent"
			    		        default-expand-all
			    		        :filter-node-method="filterMore"
			    		        :default-checked-keys="crr"
			    		        @node-click="handleNodeClick">
			    		    </el-tree>
		    		    </div>
		    		</div>
		    		<div  class='treeFooter'>
						<el-button  type="primary" @click='checkedCompany'>_确定_</el-button>
					</div>
			    </div>
	        </el-dialog>
	    </div>
    <!-- 快捷创建公司弹框 -->			
		<div class='newCompany'>		
        	<el-dialog title="_新增公司_" :visible.sync="newcompanyView" top='22vh'>
        		<el-form :model="checkCompanyForm" :rules="rulesc" ref="checkCompanyForm" label-width="120px" >
		  			<el-row>
						<el-form-item label="_公司简称_" prop="FShortName" >
							<el-input v-model="checkCompanyForm.FShortName"></el-input>
						</el-form-item>
						<el-form-item label="_公司全称_" prop="FFullName" >
							<el-input v-model="checkCompanyForm.FFullName"></el-input>
						</el-form-item>
						<el-form-item label="_联系人_" prop="FContacts" >
							<el-input v-model="checkCompanyForm.FContacts"></el-input>
						</el-form-item>
						<el-form-item label="_联系电话_" prop="FTelephone" >
							<el-input v-model="checkCompanyForm.FTelephone"></el-input>
						</el-form-item>
						<el-form-item label="_默认分组_" prop="FGroupName" >
							<el-input v-model="checkCompanyForm.FGroupName"></el-input>
						</el-form-item>
						<el-form-item label="_时差_"  class='timeZone'>
							<el-row >
								<el-col :span="8">
									<el-select v-model="checkCompanyForm.timeZoneSign" >
										<el-option
											v-for="item in timeZone.sign"
											:label="item"
											:value="item">
										</el-option>
									</el-select>
								</el-col>
								<el-col :span="7">
									<el-select v-model="checkCompanyForm.hour" >
										<el-option
											v-for="item in timeZone.hour"
											:label="item"
											:value="item">
										</el-option>
									</el-select>
								</el-col>
								<el-col :span="1">：</el-col>
								<el-col :span="8">
									<el-select v-model="checkCompanyForm.minute" >
										<el-option
											v-for="item in timeZone.minute"
											:label="item"
											:value="item">
										</el-option>
									</el-select>
								</el-col>
							</el-row>
						</el-form-item>
					</el-row>
				</el-form>
				<div  class="mincreate">
					<el-button  type="primary" @click="newSubmitC('checkCompanyForm')">_创建_</el-button>
				</div>
				<!-- <span class='newArrow'></span> -->
        	</el-dialog>
        </div>
    </section>
</template>
<script>
	/*import api from './api.js'*/
	import TreeCreate from 'components/tree/tree_create.vue'
	export default {
		data(){  
			const checkFshortname = (rule, value, callback) => {   //公司简称长度检测
		        //var uPattern = /^[\u4e00-\u9fa5]{1,10}$|^[A-Za-z]{1,20}$/g;  //10中文或20英文
		        var uPattern = /^.{1,15}$/g;
		        if(!value) {
	                return callback(new Error('_请输入公司简称_'));
	            }
				else if(value&&uPattern.test(value)){
	            	console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	            	callback(new Error('_请输入十五位以内简称_'));
	            }
		    };
		    const checkFFullName = (rule, value, callback) => {   //公司简称长度检测
		        //var uPattern = /^[\u4e00-\u9fa5]{1,15}$|^[A-Za-z]{1,30}$/g;  //10中文或20英文
		        var uPattern = /^.{1,20}$/g;
		        if(!value) {
	                return callback(new Error('_请输入公司全称_'));
	            }
				else if(value&&uPattern.test(value)){
					console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	             	callback(new Error('_请输入二十位以内全称_'));
	            }
		    };
		    const checkFPhoneNumber = (rule, value, callback) => {
		        var uPattern = /^[0-9\-\+\(\)]{1,18}$/g;
	            if(!value) {
	                return callback(new Error('_请输入有效号码_'));
	              }
	            else if(value&& uPattern.test(value)){
	            	console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	            	callback(new Error('_请输入有效号码_'));
	            }
		    };
		    const FGroupName = (rule, value, callback) => {   //公司简称长度检测
	            let t=this.strlen(value);
		        if(!value) {
	                return callback(new Error('_请输入分组名称_'));
	            }
				else if(value&&(t<=16)){
	             	callback();
	            } else{
	            	callback(new Error('_请输入少于十六个字符_'));
	            }
		    };
			return {
				filterTextMore:'',
				//isCreate:false,
				newcompanyView:false,
				//maxexpandId: api.maxexpandId,//新增节点开始id
		        //non_maxexpandId: api.maxexpandId,//新增节点开始id(不更改)
		       // non_maxexpandId:95,
		        isLoadingTree: false,//是否加载节点树
		        //setTree: api.treelist,//节点树数据*/
		        defaultProps: {
		            children: 'children',
					label: 'FShortName'
		        },
        		defaultExpandKeys: [],//默认展开节点列表
        		crr:[],
        		companyData:'',
        		newCompanyKey:'',
        		timeZone:{
					sign:['+','-'],
					hour:[
						0,1,2,3,4,5,6,7,8,9,10,11,12
					],
					minute:[0,30,45]
				},
				checkCompanyForm:{
					FShortName:'',
					FFullName:'',
					FContacts:'',
					FTelephone:'',
					FGroupName:'',
					timeZoneSign:'+',
					hour:0,
					minute:0,
				},
				rulesc: {
					FShortName: [{required: true,validator: checkFshortname }],
					FFullName: [{required: true,validator: checkFFullName }],
					FContacts: [{required: true, message: '_请输入联系人_'}],
					FTelephone:[{required: true, validator: checkFPhoneNumber }],
					FGroupName: [{required: true, validator: FGroupName}],
				},
			}
		},
		props: ['checkCompanyDialog','createUser','chooseCompanyId'],
		methods: {
			//选中公司传递给父组件
			checkedCompany(){
				var nodeArr = this.$refs.expandMore.getCheckedNodes();
				console.log('nodeArr',nodeArr)
				var temp = [];
				var companyId = [];
				var fatherId=[];
				if (nodeArr.length)
					$.each(nodeArr, function (index, obj) {
						temp.push(obj.FShortName)
						companyId.push(obj.FGUID)
						fatherId.push(obj.FFatherAgentGUID)
					});

				this.$emit("childrenC", [temp, companyId,fatherId]);
				this.$emit("checkchangeC",false);
				//初始化搜索框,选完公司后直接关闭
				//this.filterTextMore = '';
				//this.$refs.expandMore.setCheckedKeys([]);
			},
			//快捷创建公司
		    handleAdd(s,d,n){
		    	console.log('d',d)
		    	this.newCompanyKey=d.FGUID;
		    	this.newcompanyView=true;
		    	this.checkCompanyForm={
					FShortName:'',
					FFullName:'',
					FContacts:'',
					FTelephone:'',
					FGroupName:'',
					timeZoneSign:'+',
					hour:0,
					minute:0,
				};
				this.checkCompanyForm.timeZoneSign=this.getLocalTimeZone().timeZoneSign;
				this.checkCompanyForm.hour=this.getLocalTimeZone().hour;
				this.checkCompanyForm.minute=this.getLocalTimeZone().minute;
		    },
			//新增公司
			newSubmitC(formName) {
				var _this=this;
			    this.$refs[formName].validate((valid) => {
			        if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this.deepCopy(this.$store.state.copycompanyForm);
						JsonObj.FShortName=this[formName].FShortName;
						JsonObj.FFullName=this[formName].FFullName;
						JsonObj.FContacts=this[formName].FContacts;
						JsonObj.FTelephone=this[formName].FTelephone;
						let FGroupName=this[formName].FGroupName;
						JsonObj.FFatherAgentGUID=this.newCompanyKey;
						let FTimeDifferent=this.getTimeZone(this[formName].timeZoneSign,this[formName].hour,this[formName].minute);
						/*delete JsonObj.timeZoneSign;
						delete JsonObj.minute;
						delete JsonObj.hour;
						delete JsonObj.FTimeDifferent;
						delete JsonObj.FGroupName;*/
						var JsonStr;
 							JsonStr=JSON.stringify({"FTokenID":TokenID,"FAction":"AddSuperAdminAgent","FT_SuperAdminAgent":JsonObj,"FVersion":"1.0.0",'FTimeDifferent':FTimeDifferent,'FGroupName':FGroupName});
 							console.log('JsonStr',JsonStr)
						$.ajax({
							"url": "web/Common/Common_SuperAdmin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log(data);
								if(data.Result=="200"){
									_this.message('_新增成功_', 'success');
									_this.$store.commit('getuserCompany','');
									_this.newcompanyView=false;
								}else{
									_this.message('_该公司名称已占用_', 'warning');
								}
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					}
			        else{
			            console.log('error submit!!');
			            return false;
			        }
		        });
		    },
			initExpand(){
		        this.setTree.map((a) => { 
		        	this.defaultExpandKeys.push(a.FGUID) 
		        });
		        this.isLoadingTree = true;
		        console.log(this.setTree)
		    },
		    //搜索树
			filterMore(value, data) {
		        if (!value) return true;
		        console.log('datalabel',data);
		        return data.FShortName.indexOf(value) !== -1;
		    },
		    renderContent(h,{node,data,store}){//加载节点
		    	var  _this=this;
		        return h(TreeCreate,{
		          props: {
		            DATA: data,
		            NODE: node,
		            STORE: store,
		            maxexpandId: _this.non_maxexpandId
		          },
		          on: {
		            nodeAdd: ((s,d,n) => _this.handleAdd(s,d,n)),
		            nodeEdit: ((s,d,n) => _this.handleEdit(s,d,n)),
		            nodeDel: ((s,d,n) => _this.handleDelete(s,d,n))
		          }
		        });
		    },
		    
            //
            handleNodeClick(){

            },
            checkchange(s,d,n){
            	console.log('checkchange',s)
            	console.log('checkchange',d)
            	console.log('checkchange',n)
            },
			closeNew(){
				
			}
		},
		mounted(){
      		this.initExpand()
      		this.$store.commit('getuserCompany','');
		},
		computed:{
			setTree:function(){  //请求store中tree数据
				return this.$store.state.treeDataCompany;	
			},
		},
		watch:{
			checkCompanyDialog:function(val){
				this.$emit("checkchangeC", val)
		    	if(this.createUser){  //
		    		//this.crr=[];
		    		this.$refs.expandMore.setCheckedKeys([]);
		    	}else if(!this.createUser&&(val)){     //编辑且打开。。编辑且关闭不需要加载setCheckedKeys
		    		//let temp=[];
		    		/*if(this.chooseCompanyId.indexOf(',')==-1){  //只选一个公司
		    			temp.push(this.chooseCompanyId);
		    			console.log('temp',temp)
		    			this.$nextTick(function () {
		    				this.$refs.expandMore.setCheckedKeys(temp);
		    			})	
		    		}else{    //选多公司
		    			this.$nextTick(function () {
		    				this.$refs.expandMore.setCheckedKeys(this.chooseCompanyId.split(','));
		    			})
		    		}*/
		    		this.$nextTick(function () {
	    				this.$refs.expandMore.setCheckedKeys(this.chooseCompanyId.split(','));
	    			})
		    	}
		    	
			},
			filterTextMore(val) {
		        this.$refs.expandMore.filter(val);
		    },
		}
	};
</script>
<style>
	.expand-tree{
	  border:none;
	  margin-top:10px;
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
	.newCompany .el-input__inner {
	    height:28px;
	    border-radius:0;
	}
	.newCompany .el-dialog {    /*快捷公司弹框*/
		left:15%;
		border:1px solid  #298cce;
		width:360px;
	}
	.companyTree .el-dialog__body{
		height:450px;
		padding:0;
	}
	.companyTree .treeContent{
		height:448px;
		padding:10px 15px 0px 15px;
	}
	.companyTree .treeFooter{
		margin-top:12px;
		text-align:center;
	}
    .mincreate {
    	text-align:center;
    	margin-top:5px;
    }
	.newCompany  .el-dialog__body{
		padding: 20px 20px 20px 15px
	}
</style>


