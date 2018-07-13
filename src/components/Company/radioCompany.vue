<template>
	<section style='height:100%'>
		<!-- 设备单选关联车辆/集装箱 -->
		<div class='relateV' v-if='typeTable==0'>	
			<el-dialog  :title="SystemID==6?'_关联集装箱_':'_关联车辆_'":visible.sync="ErelateViewV" top='22vh'>
				<div class='a' style='float:left;display:inline-block;width:98%'>
					<div class='clearfix'>
						<div class='pull-left'>
							<input type="text" placeholder="_请输入车牌_" v-model="velKey0" @keyup.enter="searchList(0)" v-if='SystemID!==6'></input>
							<input type="text" placeholder="_请输入箱号_" v-model="velKey0" @keyup.enter="searchList(0)" v-if='SystemID==6'></input>
						</div>
						<div class='pull-right'>
							<button class='extraButton' @click='searchList(0)' v-if='SystemID!==6' >_搜索_</button>
							<button class='extraButton' @click='newAddV' v-if='SystemID!==6'>_新增_</button>
							<button class='extraButton' @click='searchList(0)' v-if='SystemID==6' >_搜索_</button>
							<button class='extraButton' @click='newAddCon' v-if='SystemID==6'>_新增_</button>
						</div>
					</div>
					<div style='height:2px;background:#1970cf7a;margin:3px 0'></div>
					<div style='height:250px; margin:5px;'>
						<el-table :data="velList" 
								  :height="table_height" stripe style="width: 100%;" empty-text='_暂无数据_'>
							<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>	  
							<el-table-column label="_操作_" width="100" align='center'>
								<template scope="scope">
		                    		<a href="javascript:"  @click="chooseVel(scope.$index,scope.row)">_选择_</a>
								</template>
							</el-table-column>
							<el-table-column prop="FVehicleName"  label="_车牌号_" min-width="100"  align='center' v-if='SystemID!==6'></el-table-column>
							<el-table-column prop="FVehicleName"  label="_箱号_" min-width="100"  align='center' v-if='SystemID==6'></el-table-column>
						</el-table>
					</div>
				</div>
				<div  class='treeFooter clearfix' style='clear:both;text-align:center;margin:5px 0;padding:15px 0'>
				</div>
			</el-dialog>
		</div>
		<!-- 司机多选关联车辆 -->
		<div class='relateV' v-if='typeTable==1'>	
			<el-dialog title='_关联车辆_' :visible.sync="DrelateViewV" top='22vh'>
				<div class='a' style='float:left;display:inline-block;width:98%'>
					<!-- <div style='position:relative'>
					    <input type="text" placeholder="_请输入车牌_" v-model="velKey1" @keyup.enter="searchList(1)" style='width:69%'></input>
						<button class="glyphicon glyphicon-search searchBtn" @click='searchList(1)'></button>
						<button type='button' class='el-button el-button--primary el-button--small' style='padding:6px 20px' @click='newAddV'>_新增_</button>
					</div> -->
					<div class='clearfix'>
						<div class='pull-left'>
							<input type="text" placeholder="_请输入车牌_" v-model="velKey1" @keyup.enter="searchList(1)" ></input>
						</div>
						<div class='pull-right'>
							<button class='extraButton' @click='searchList(1)'>_搜索_</button>
							<button class='extraButton' @click='newAddV'>_新增_</button>
						</div>
					</div>
					<div style='height:2px;background:#1970cf7a;margin:3px 0'></div>
					<div style='height:250px ;margin:5px;'>
						<el-table :data="velList" ref="velRef" @selection-change="relateChooseV"
								  :height="table_height" stripe style="width: 100%;" empty-text='_暂无数据_'>
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="RowNo" label="_序号_" width="100"></el-table-column>
							<el-table-column prop="FVehicleName"  label="_车牌号_" min-width="150" show-overflow-tooltip ></el-table-column>
						</el-table>
					</div>
				</div>
				<div  class='treeFooter clearfix' style='clear:both;text-align:center;margin:5px 0;padding:15px 0'>
					<el-button  type="primary" @click='checkedVel'>_确定_</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 车辆关联司机和设备 -->
		<div class='relateDE' v-if='typeTable==2'>	
			<el-dialog title='_关联终端与司机_' :visible.sync="relateViewDE" top='22vh'>
				<div class='aa' style='float:left;display:inline-block;width:55%'>
					<div class='clearfix'>
						<div class='pull-left'>
							<input type="text" placeholder="_请输入终端号_" v-model="equKey2.key" class='textDE'></input>
							<select v-model="equKey2.type" class='selectDE'>
								<option value="">_请选择类型_</option>  
								<option v-for="item in FAssetTypeIDs" :key="item.value" :label="item.label" :value="item.value"></option>
							</select>
						</div>
						<div class='pull-right'>
							<button class='extraButton' @click='searchList(2)'>_搜索_</button>
							<button class='extraButton' @click='newAddE'>_新增_</button>
						</div>
					</div>
					<div style='height:2px;background:#1970cf7a;margin:3px 0'></div>
					<div style='height:250px ;margin:5px;'>
						<el-table :data="equTableList" 
								  :height="table_height" stripe style="width: 100%;" empty-text='_暂无数据_'>
							<el-table-column prop="RowNo" label="_序号_" width="70"></el-table-column>
							<el-table-column label="_操作_" width="80" align='center'>
								<template scope="scope">
		                    		<a href="javascript:"  @click="chooseEqu(scope.$index,scope.row)">_选择_</a>
								</template>
							</el-table-column>
							<el-table-column prop="FAssetID"  label="_终端号_" width="120" show-overflow-tooltip ></el-table-column>
							<el-table-column prop="FAssetTypeID"  label="_终端类型_" min-width="120" show-overflow-tooltip ></el-table-column>
						</el-table>
					</div>
					<div  class='treeFooter clearfix' style='clear:both;text-align:center;margin:5px 0;padding:15px 0'></div>
				</div>
				<div  class='b' style='float:left;display:inline-block;width:2%;visibility:hidden'>--</div>
				<div class='c'style='float:left;display:inline-block;width:42%'>
					<!-- <div style='position:relative'>
					    <input type="text" placeholder="_请输入司机姓名_" v-model="driKey3" @keyup.enter="searchList(3)" style='width:48%'></input>
						<button type='button' class='el-button el-button--primary el-button--small' style='padding:6px 18px' @click='searchList(3)'>_搜索_</button>
						<button type='button' class='el-button el-button--primary el-button--small' style='padding:6px 18px' @click='newAddD'>_新增_</button>
					</div> -->
					<div class='clearfix'>
						<div class='pull-left'>
							<input type="text" placeholder="_请输入司机姓名_" v-model="driKey3" @keyup.enter="searchList(3)" ></input>
						</div>
						<div class='pull-right'>
							<button class='extraButton' @click='searchList(3)'>_搜索_</button>
							<button class='extraButton' @click='newAddD'>_新增_</button>
						</div>
					</div>
					<div style='height:2px;background:#1970cf7a;margin:3px 0'></div>
					<div style='height:250px;margin:5px;'>
						<el-table :data="driTableList" ref="driRef"
								  :height="table_height" stripe style="width: 100%;" empty-text='_暂无数据_'>
							<el-table-column prop="RowNo" label="_序号_" width="80"></el-table-column>
							<el-table-column label="_操作_" width="100" align='center'>
								<template scope="scope">
									<a href="javascript:"  @click="chooseDri(scope.$index,scope.row)">_选择_</a>
								</template>
							</el-table-column>
							<el-table-column prop="FDriverName"  label="_司机_" min-width="100" show-overflow-tooltip align='center'></el-table-column>
						</el-table>
					</div>
					<div  class='treeFooter clearfix' style='clear:both;text-align:center;margin:5px 0;padding:15px 0'>
						<!-- <el-button  type="primary" @click='checkedDri'>_确定_</el-button> -->
					</div>
				</div>
			</el-dialog>
		</div>
		<!-- 集装箱单选关联设备 -->
		<div class='relateCon' v-if='typeTable==3'>	
			<el-dialog title='_关联设备_' :visible.sync="CrelateViewE" top='22vh'>
				<div class='a' style='float:left;display:inline-block;width:98%'>
					<div style='position:relative'>
					   	<input type="text" placeholder="_请输入终端号_" v-model="equKey4.key" style='width:28%;height:28px'></input>
					    <el-select v-model="equKey4.type" placeholder="_请选择类型_"  style='width:32%'>
								                <el-option v-for="item in FAssetTypeIDs" :key="item.value" :label="item.label" :value="item.value"></el-option>
								            </el-select>
						<button type='button' class='el-button el-button--primary el-button--small' style='padding:6px 18px' @click='searchList(4)'>_搜索_</button>
						<button type='button' class='el-button el-button--primary el-button--small' style='padding:6px 18px;' @click='newAddE'>_新增_</button>
					</div> 
					<div style='height:2px;background:#1970cf7a;margin:3px 0'></div>
					<div style='height:250px;margin:5px;'>
						<el-table :data="equTableList" 
								  :height="table_height" stripe style="width: 100%;" empty-text='_暂无数据_'>
							<el-table-column prop="RowNo" label="_序号_" width="70"></el-table-column>	  
							<el-table-column label="_操作_" width="80" align='center'>
								<template scope="scope">
		                    		<a href="javascript:"  @click="chooseEquCon(scope.$index,scope.row)">_选择_</a>
								</template>
							</el-table-column>
							<el-table-column prop="FAssetID"  label="_终端号_" width="120" show-overflow-tooltip ></el-table-column>
							<el-table-column prop="FAssetTypeID"  label="_终端类型_" min-width="120" show-overflow-tooltip ></el-table-column>
						</el-table>
					</div>
				</div>
				<div  class='treeFooter clearfix' style='clear:both;text-align:center;margin:5px 0;padding:15px 0'>
				</div>
			</el-dialog>
		</div>
		<div class='companyTree'>
	        <el-dialog title="_选择公司_" :visible.sync="radioCompanyDialog" top='22vh'>
	            <div class='treeContent'>
		        	<div class='treeInput' style='height:30px;margin-bottom:2px'>
		        		<el-input
		        			placeholder="_输入关键字_"
		        			v-model="filterTextOne">
		        		</el-input>          
		        	</div>
		        	<div style='overflow:auto;height:350px;border:1px solid #999'>
			            <div>
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
				<div class="mincreate">
					<el-button  type="primary" @click="newSubmitC('checkCompanyForm')">_创建_</el-button>
				</div>
				<!-- <span class='newArrow'></span> -->
        	</el-dialog>
        </div>
        <!-- 快捷创建车辆弹框 -->			
		<div class='newCompany'>		
        	<el-dialog title="_新增车辆_" :visible.sync="newvelView" top='22vh'>
        		<el-form :model="checkVelForm" :rules="rulesv" ref="checkVelForm" label-width="110px" >
					<el-row>
						<el-form-item label="_车牌_" prop="FVehicleName" >
							<el-input v-model="checkVelForm.FVehicleName"></el-input>
						</el-form-item>
						<el-form-item label="_分组_" prop="FGroupGUID" >
							<el-select v-model="checkVelForm.FGroupGUID" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in radioGroups" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
					</el-row>
				</el-form>
				<div class="mincreate">
					<el-button  type="primary" @click="newSubmitV('checkVelForm')">_创建_</el-button>
				</div>
				<!-- <span class='newArrow'></span> -->
        	</el-dialog>
        </div>
        <!-- 快捷创建设备弹框 -->			
		<div class='newCompany'>		
        	<el-dialog title="_新增设备_" :visible.sync="newequView" top='22vh'>
        		<el-form :model="checkEquForm" :rules="rulese" ref="checkEquForm" label-width="110px" >
					<el-row>
						<el-form-item label="_终端号_" prop="FAssetID" >
							<el-input v-model.trim="checkEquForm.FAssetID"></el-input>
						</el-form-item>
						<el-form-item label="_类型_" prop="FAssetTypeID" >
							<el-select v-model.number="checkEquForm.FAssetTypeID" placeholder="_请选择_" style="width:100%;">
			                  	<el-option v-for="item in FAssetTypeIDs" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
			            </el-form-item>
			            <el-form-item label="_分组_" prop="FGroupGUID" >
							<el-select v-model="checkEquForm.FGroupGUID" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in radioGroups" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
						<el-form-item label="SIM_卡号_" prop="FSIMNumber" >
							<el-input v-model.trim="checkEquForm.FSIMNumber"></el-input>
						</el-form-item>
					</el-row>
				</el-form>
				<div class="mincreate">
					<el-button  type="primary" @click="newSubmitE('checkEquForm')">_创建_</el-button>
				</div>
				<!-- <span class='newArrow'></span> -->
        	</el-dialog>
        </div>
        <!-- 快捷创建司机弹框 -->			
		<div class='newCompany'>		
        	<el-dialog title="_新增司机_" :visible.sync="newdriView" top='22vh'>
        		<el-form :model="checkDriForm" :rules="rulesd" ref="checkDriForm" label-width="110px" >
					<el-row>
						<el-form-item label="_姓名_" prop="FDriverName" >
							<el-input v-model="checkDriForm.FDriverName"></el-input>
						</el-form-item>
						<el-form-item label="_电话_" prop="FPhoneNumber" >
							<el-input v-model="checkDriForm.FPhoneNumber"></el-input>
						</el-form-item>
						<el-form-item label="_分组_" prop="FGroupGUID" >
							<el-select v-model="checkDriForm.FGroupGUID" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in radioGroups" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
					</el-row>
				</el-form>
				<div class="mincreate">
					<el-button  type="primary" @click="newSubmitD('checkDriForm')">_创建_</el-button>
				</div>
				<!-- <span class='newArrow'></span> -->
        	</el-dialog>
        </div>
        <!-- 快捷集装箱弹框 -->			
		<div class='newCompany'>		
        	<el-dialog title="_新增集装箱_" :visible.sync="newconView" top='22vh'>
        		<el-form :model="checkConForm" :rules="rulescon" ref="checkConForm" label-width="120px" >
					<el-row>
						<el-form-item label="Container No.
" prop="FVehicleName" >
							<el-input v-model.trim="checkConForm.FVehicleName" style='width:70%' placeholder='_例_:ABCD123456'></el-input><el-input  v-model='containerCode'  style='width:20%' disabled></el-input>
						    <span class="glyphicon glyphicon-heart" style='color:#bbb' :title='tooltip'></span>
						</el-form-item>
						<el-form-item label="_尺寸_" prop="FVehicleSerialCode" >
							<el-select v-model.trim="checkConForm.FVehicleSerialCode" placeholder="_请选择_" style='width:90%'>
			                  	<el-option v-for="item in FVehicleSerialCodes" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
						<el-form-item label="_类型_" prop="FVIN" >
							<el-select v-model.trim="checkConForm.FVIN" placeholder="_请选择_" style='width:90%'>
			                  	<el-option v-for="item in FVINs" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
						<el-form-item label="_分组_" prop="FGroupGUID" >
							<el-select v-model="checkConForm.FGroupGUID" placeholder="_请选择_" style='width:100%'>
			                  	<el-option v-for="item in radioGroups" :key="item.value" :label="item.label" :value="item.value"></el-option>
			                </el-select>
						</el-form-item>
					</el-row>
				</el-form>
				<div class="mincreate">
					<el-button  type="primary" @click="newSubmitCon('checkConForm')">_创建_</el-button>
				</div>
				<!-- <span class='newArrow'></span> -->
        	</el-dialog>
        </div>
    </section>
</template>
<script>
	//import api from './api.js'
	//import TreeCreate from './tree_create'
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
		    const checkFAssetID = (rule, value, callback) => {
		        var uPattern = /^[0-9]{1,12}$/g;
	            if(!value) {
	                return callback(new Error('_请输入终端号_'));
	              }
	            else if(value&& uPattern.test(value)){
	            	console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	            	callback(new Error('_请输入数字_(1-12)'));
	            }
		    }; 
		    const checkCon = (rule,value,callback) => {  //箱号
		        var par1=/^[A-Z]{4}[0-9]{6}$/g;   //大写字母加数字：
		        if(!par1.test(value)){
		            callback(new Error('_请输入正确格式_'));
		        }else{
		            callback();
		        } 
	        };
	       const checkFVehicleName = (rule, value, callback) => {
		        var uPattern = /^.{1,16}$/g;
	            if(!value) {
	                return callback(new Error('_请输入车牌号_'));
	              }
	            else if(value&&uPattern.test(value)){
	             	callback();
	            } else{
	            	callback(new Error('_请输入少于十六个字符_'));
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
		    const FSIMNumber = (rule, value, callback) => {
		        var uPattern = /^[0-9a-zA-Z]{1,15}$/g;
	            if(!value) {
	                return callback(new Error('_请输入卡号_'));
	              }
	            else if(value&& uPattern.test(value)){
	            	console.log('succ')
	             	callback();
	            } else{
	            	console.log('error')
	            	callback(new Error('_请输入十五位以内数字_'));
	            }
		    };
			return {
				//velTableList:[],     //司机多车
				//velTableListr:[],  //设备单车
				radioGroups:[],
				velList:[],
				velKey0:"",       //设备单搜车
				velKey1:"",       //司机多搜车
				//equKey2:'',       //车辆单搜设备
				equKey2:{
					key:'',
					type:''
				},
				driKey3:'',       //车辆多搜司机
				equKey4:{     //集装箱绑设备
					key:'',
					type:''
				},       
				driTableList:[],
				equTableList:[],     //未配备车辆设备
				equconTableList:[],  //未配备集装箱设备
				conTableList:[],
				DrelateViewV:false,
				ErelateViewV:false,
				CrelateViewE:false,
				relateViewDE:false,
				radionameEC:'',   //新增设备选中的公司名称
				radioIdEC:'',     //新增设备选中的公司id
				checknameEV:'',   //新增设备选中的车辆名称
				checkIdEV:'',     //新增设备选中的车辆id
				radionameDC:'',   //新增司机选中的公司名称
				radioIdDC:'',     //新增司机选中的公司id
				checknameDV:'',   //新增司机选中的车辆名称
				checkIdDV:'',     //新增司机选中的车辆id
				radionameVC:'',   //新增车辆选中的公司名称
				radioIdVC:'',     //新增车辆选中的公司id
				checknameVE:'',   //新增车辆选中的设备名称
				checkIdVE:'',     //新增车辆选中的设备id
				checknameVD:'',   //新增车辆选中的司机名称
				checkIdVD:'',     //新增车辆选中的司机id
				radionameCC:'',   //新增集装箱选中的公司名称
				radioIdCC:'',     //新增集装箱选中的公司id
				checknameCE:'',   //新增集装箱选中的设备名称
				checkIdCE:'',     //新增集装箱选中的设备id
				FGroupGUIDs:[],   //分组数据
				filterTextOne:'',
				newCompanyKey:'',  //快捷创建公司id
				isCreate:false,
				newcompanyView:false,
				newvelView:false,
				newequView:false,
				newdriView:false,
				newconView:false,
				table_height:'280',
				tooltip:'_格式_:_四位大写字母_+_六位数字_',
				containerCode:'',
				//maxexpandId: api.maxexpandId,//新增节点开始id
		        //non_maxexpandId: api.maxexpandId,//新增节点开始id(不更改)
		        isLoadingTree: false,//是否加载节点树
		        //setTree: api.treelist,//节点树数据
		        defaultProps: {
		          children: 'children',
		          label: 'FShortName'
		        },
        		defaultExpandKeys: [], //默认展开节点列表
        		//companyData:'',
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
				timeZone:{
					sign:['+','-'],
					hour:[
						0,1,2,3,4,5,6,7,8,9,10,11,12
					],
					minute:[0,30,45]
				},
				checkVelForm:{
					FVehicleName:'',
					FGroupGUID:''
				},
				checkEquForm:{
					FAssetID:'',
					FAssetTypeID:'',
					FGroupGUID:'',
					FSIMNumber:''
				},
				checkDriForm:{
					FDriverName:'',
					FPhoneNumber:'',
					FGroupGUID:''
				},
				checkConForm:{
					FVehicleName:'',
					FVehicleSerialCode:'',
					FVIN:'',
					FGroupGUID:''
				},
				rulesc: {
					FShortName: [{required: true,validator: checkFshortname }],
					FFullName: [{required: true,validator: checkFFullName }],
					FContacts: [{required: true, message: '_请输入联系人_'}],
					FTelephone:[{required: true, validator: checkFPhoneNumber }],
					FGroupName: [{required: true, validator: FGroupName}],
				},
				rulesv: {
					FVehicleName: [{required: true, validator: checkFVehicleName}],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
				},
				rulese: {
                    FAssetID: [{required: true, validator: checkFAssetID}],
					FAssetTypeID: [{required: true, message: '_请输入终端类型_'}],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
					FSIMNumber: [{required: true, validator: FSIMNumber}],
				},
				rulesd: {
					FDriverName: [{required: true, message: '_请输入司机姓名_'}],
					FPhoneNumber: [{required: true, validator: checkFPhoneNumber }],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
				},
				rulescon: {
					FVehicleName: [{required: true,validator: checkCon }],
					FVehicleSerialCode: [{required: true, message: '_请选择尺寸_'}],
					FVIN: [{required: true, message: '_请选择类型_'}],
					FGroupGUID: [{required: true, message: '_请选择分组_'}],
				},
				 //设备类型
		        FAssetTypeIDs: [{
		          label: 'JT701',
		          value: 701
		        },{
		          label: 'JT702',
		          value: 735
		        },{
		          label: 'JT703',
		          value: 703
		        },{
	              label: 'JT703T',
	              value: 707
	            },{
		          label: 'JT704',
		          value: 704
		        },{
		          label: 'JT704B',
		          value: 714
		        },{
		          label: 'JT705',
		          value: 740
		        },{
		          label: 'JT706',
		          value: 716
		        },{
		          label: 'JT707',
		          value: 717
		        },{
		          label: 'JT600C',
		          value: 303
		        },
		        {
		          label: 'GP4000',
		          value: 400
		        },{
		          label: 'GP6000',
		          value: 600
		        },{
		          label: 'GP6000F',
		          value: 603
		        },{
		          label: 'GP4000M',
		          value: 404
		        },{
		          label: 'JT500BD_一体机_',
		          value: 607
		        }
		        ,{
		          label: 'JT500BD_一体机新线束_',
		          value: 608
		        }
		        ,{
		          label: 'HB_R03GBD08',
		          value: 669
		        }
		        ,{
		          label: '_首航_SF110-GS',
		          value: 682
		        },{
		          label: '_中集_ZNM801-6',
		          value: 750
		        }], 
		        //集装箱尺寸
		        FVehicleSerialCodes: [{
		          label: 22,
		          value: 22
		        },{
		          label: 25,
		          value: 25
		        },{
		          label: 42,
		          value: 42
		        },{
		          label: 45,
		          value: 45
		        },{
		          label: 'L2',
		          value: 'L2'
		        },{
		          label: 'L5',
		          value: 'L5'
		        }],
		        //集装箱型
		        FVINs:[
			        {
			            label: 'G1',
			            value: 'G1'
			        },
			        {
			            label: 'P1',
			            value: 'P1'
			        },
			        {
			            label: 'R1',
			            value: 'R1'
		          	},
			        {
			            label: 'T1',
			            value: 'T1'
		         	},
		         	{
			            label: 'U1',
			            value: 'U1'
		          	},
		         	{
			            label: 'V1',
			            value: 'V1'
		          	},
		        ], 
			}
		},
		//props: ['radioCompanyDialog','typeTable','SystemID'],
		props: ['radioCompanyDialog','typeTable'],
		methods: {
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
			filterOne(value, data) {
		        if (!value) return true;
		        return data.FShortName.indexOf(value) !== -1;
		    },
		    renderContent(h,{node,data,store}){//加载节点
		    	var _this=this;
		        return h(TreeCreate,{
		          props: {
		            DATA: data,
		            NODE: node,
		            STORE: store,
		            renderID:this.typeTable,
		            sysNum:this.SystemID,
		            maxexpandId: _this.non_maxexpandId
		          },
		          on: {
		            nodeAdd: ((s,d,n) => _this.handleAdd(s,d,n)),
		            nodeEdit: ((s,d,n) => _this.linkV(s,d,n)),
		            nodeDel: ((s,d,n) => _this.handleDelete(s,d,n))
		          }
		        });
		    },
		    //关联车辆、司机、设备、列表
		    linkV(s,d,n){
		    	var _this=this;
            	console.log('关联d',d);
            	switch(this.typeTable){
            		case 0:           /*设备单选车*/
            		    /*if(this.SystemID==6){
            		    	this.radionameEC=d.FShortName;
	            			console.log('this.radionameEC',this.radionameEC)
							this.radioIdEC=d.FGUID;

            		    }else{*/
            		    	this.radionameEC=d.FShortName;
	            			console.log('this.radionameEC',this.radionameEC)
							this.radioIdEC=d.FGUID;
							this.checknameEV='';
							this.checkIdEV='';
							this.$emit("radiochangeC", false);
							this.ErelateViewV=true;
							this.FGroupGUIDs=this.getGroup(this.radioIdEC);
		            		this.$emit("radiochildrenC",[_this.radionameEC,_this.radioIdEC,_this.FGroupGUIDs]);                 //先传递公司数据
		            		this.$emit("radiochildrenV", ['', '']);
		            		//_this.velTable(1,999999,1,'',this.radioIdEC,'UnBindAsset');
		            		var obj={
		            			id:this.radioIdEC,
								name:this.radionameEC,
								fatherId:'',
								type:1
		            		}
		            		console.log('obj',obj)
		            		_this.velTable(1,999999,1,'',obj,'UnBindAsset');
		            		this.filterTextOne = '';
		            		break;
            		    //}
            			
            		case 1:         /*司机多选车*/
            			this.velKey1='',
            			this.radionameDC=d.FShortName;  /*记录公司信息选择设备的时候使用*/
		            	this.radioIdDC=d.FGUID;
		            	this.checknameDV='';         /*改了公司旧车辆数据即失效*/
		            	this.checkIdDV='';
		            	this.$emit("radiochangeC", false);
		            	this.DrelateViewV=true;
		            	this.FGroupGUIDs=this.getGroup(this.radioIdDC);
		            	this.$emit("radiochildrenC",[_this.radionameDC,_this.radioIdDC,_this.FGroupGUIDs]);
		            	this.$emit("checkchildrenV",['', '']);
		            	var obj={
	            			id:this.radioIdDC,
							name:this.radionameDC,
							fatherId:'',
							type:1
	            		}
	            		_this.velTable(1,999999,1,'',obj,'UnBindDriver');	
		            	this.filterTextOne = '';
		            	break;
            		case 2:       /*车辆单选设备和单选司机*/
            			this.equKey2={
							key:'',
							type:''
						},
            			this.radionameVC=d.FShortName;          //新增车辆选中的公司名称
						this.radioIdVC=d.FGUID;              //新增车辆选中的公司id
						this.checknameVE='';             //换公司旧司机设备失效
						this.checkIdVE='';               
						this.checknameVD='';            
						this.checkIdVD='';
						this.$emit("radiochangeC", false);
						this.relateViewDE=true;
						this.FGroupGUIDs=this.getGroup(this.radioIdVC);
						this.$emit("radiochildrenC",[_this.radionameVC,_this.radioIdVC,_this.FGroupGUIDs]);
						this.$emit("radiochildrenE", ['', '']);
						this.$emit("radiochildrenD", ['', '']);
						_this.equipAble(1,999999,'',-1,this.radioIdVC);
						_this.driverAble(1,999999,'',this.radioIdVC);
						this.filterTextOne = '';	
		            	break; 
		            case 3:           /*集装箱单选设备*/
            			this.radionameCC=d.FShortName;
            			console.log('this.radionameCC',this.radionameCC)
						this.radioIdCC=d.FGUID;
						this.checknameCE='';
						this.checkIdCE='';
						this.$emit("radiochangeC", false);
						this.CrelateViewE=true;
						this.FGroupGUIDs=this.getGroup(this.radioIdCC);
	            		this.$emit("radiochildrenC",[_this.radionameCC,_this.radioIdCC,_this.FGroupGUIDs]);   //先传递公司数据
	            		this.$emit("radiochildrenE", ['', '']);
	            		_this.equipAble(1,999999,'',-1,this.radioIdCC);
	            		this.filterTextOne = '';
	            		break; 
            	}
		    },
            //点击节点选中公司
            handleNodeClick(s,d,n){
            	var _this=this;
            	console.log('handle操作s',s);
            	switch(this.typeTable){
            		case 0:          /*设备单选车*/
            			this.velKey0='',
            			this.radionameEC=s.FShortName;
						this.radioIdEC=s.FGUID;
						this.checknameEV='';
						this.checkIdEV='';
						this.FGroupGUIDs=this.getGroup(this.radioIdEC);
						this.$emit("radiochangeC", false);
	            		this.$emit("radiochildrenC",[_this.radionameEC,_this.radioIdEC,_this.FGroupGUIDs]);  //传递公司数据
	            		this.$emit("radiochildrenV", ['', '']);
	            		this.filterTextOne = '';
	            		break;
            		case 1:        /*司机多选车*/
            			this.radionameDC=s.FShortName;  /*记录公司信息选择设备的时候使用*/
		            	this.radioIdDC=s.FGUID;
		            	this.checknameDV='';         /*改了公司旧车辆数据即失效*/
		            	this.checkIdDV='';
		            	this.FGroupGUIDs=this.getGroup(this.radioIdDC);
		            	this.$emit("radiochangeC", false);
		            	this.$emit("radiochildrenC",[_this.radionameDC,_this.radioIdDC,_this.FGroupGUIDs]);
		            	this.$emit("checkchildrenV",['', '']);	
		            	this.filterTextOne = '';
		            	break;
            		case 2:       /*车辆单选设备和单选司机*/
            			this.radionameVC=s.FShortName;          //新增车辆选中的公司名称
						this.radioIdVC=s.FGUID;              //新增车辆选中的公司id
						this.checknameVE='';             //换公司旧司机设备失效
						this.checkIdVE='';               
						this.checknameVD='';            
						this.checkIdVD='';
						this.FGroupGUIDs=this.getGroup(this.radioIdVC);
						this.$emit("radiochangeC", false);
	            		this.$emit("radiochildrenC",[_this.radionameVC,_this.radioIdVC,_this.FGroupGUIDs]);
	            		this.$emit("radiochildrenE", ['', '']);
						this.$emit("radiochildrenD", ['', '']);	
		            break;
		            case 3:       /*集装箱选择公司*/
            			this.radionameCC=s.FShortName;          //新增集装箱选中的公司名称
						this.radioIdCC=s.FGUID;              //新增集装箱选中的公司id
						this.checknameCE='';
						this.checkIdCE='';
						this.FGroupGUIDs=this.getGroup(this.radioIdCC);
						this.$emit("radiochangeC", false);
	            		this.$emit("radiochildrenC",[_this.radionameCC,_this.radioIdCC,_this.FGroupGUIDs]);
	            		this.$emit("checkchildrenV",['', '']);	
		            break;   
            	}	
            },
            //获取关联的车辆
            relateChooseV(val){
            	let arr=val;
				let temp1=[];
				let temp2=[];
				arr.forEach(obj=> {
					temp1.push(obj.FGUID);
					temp2.push(obj.FVehicleName);
				})
				this.checknameDV=temp1.join(',');
				this.checkIdDV=temp2.join(',');
            },
            //司机多选车辆确定
            checkedVel(){
            	this.DrelateViewV=false;
            	if(this.checknameDV){
            		this.$emit("checkchildrenV",[this.checknameDV, this.checkIdDV]);
            	}else{
            		this.message('_未关联车辆_', 'warning');
            	}
            },
            //设备单选车辆确定
            chooseVel(index,row){
            	this.ErelateViewV=false;
            	console.log('row',row)
            	this.checknameEV=row.FGUID;
            	this.checkIdEV=row.FVehicleName;
            	let type=row.FSystemType;
            	this.$emit("radiochildrenV", [this.checknameEV, this.checkIdEV,type]);
            },
            //车辆单选设备确定
            chooseEqu(index,row){
            	console.log('row',row)
            	this.checknameVE=row.FGUID;
            	this.checkIdVE=row.FAssetID;
            	let type=row.FSystemType;
            	this.$emit("radiochildrenE", [this.checknameVE, this.checkIdVE,type]);
            	//this.relateViewDE=false;
            },
            //获取关联的司机
            relateChooseD(val){
            	let arr=val;
				let temp1=[];
				let temp2=[];
				arr.forEach(obj=> {
					temp1.push(obj.FGUID);
					temp2.push(obj.FDriverName);
				})
				this.checknameVD=temp1.join(',');
				this.checkIdVD=temp2.join(',');
            },
            //车辆多选司机确定
            /*checkedDri(){
            	if(this.checknameVD){
            		this.$emit("radiochildrenD",[this.checknameVD, this.checkIdVD]);
            	}else{
            		this.message('_未关联司机_', 'warning');
            	}
            },*/
            //车辆单选司机确定
            chooseDri(index,row){
            	console.log('row',row)
            	this.checknameVD=row.FGUID;
            	this.checkIdVD=row.FDriverName;
            	this.$emit("radiochildrenD", [this.checknameVD, this.checkIdVD]);
            	this.relateViewDE=false;
            },
            //集装箱单选设备确定
            chooseEquCon(index,row){
            	this.CrelateViewE=false;
            	console.log('row',row)
            	this.checknameCE=row.FGUID;
            	this.checkIdCE=row.FAssetID;
            	this.$emit("radiochildrenE", [this.checknameCE, this.checkIdCE]);
            },
            //搜索关联列表
			searchList(parm){
				switch(parm){
					case 0:
						let key0=this.velKey0;
						if(this.SystemID==6){
							var obj={
		            			id:this.radioIdEC,
								name:this.radionameEC,
								fatherId:'',
								type:1
		            		}
							this.velTable(1,999999,1,key0,obj,'UnBindAsset');
						}else{
							var obj={
		            			id:this.radioIdEC,
								name:this.radionameEC,
								fatherId:'',
								type:1
		            		}
							this.velTable(1,999999,1,key0,obj,'UnBindAsset');
						}
					break;
					case 1:
						let key1=this.velKey1;
						var obj={
	            			id:this.radioIdDC,
							name:this.radionameDC,
							fatherId:'',
							type:1
	            		}
						this.velTable(1,999999,1,key1,obj,'UnBindDriver');
					break;
					case 2:
						let key2=this.equKey2.key;
						let type2=(this.equKey2.type)?(this.equKey2.type):-1;
						let id2=this.radioIdVC;
						/*var obj={
	            			id:this.radioIdVC,
							name:this.radionameVC,
							fatherId:'',
							type:1
	            		}*/
						this.equipAble(1,999999,key2,type2,id2);
					break;
					case 3:
						let key3=this.driKey3;
						let id3=this.radioIdVC;
						/*var obj={
	            			id:this.radioIdVC,
							name:this.radionameVC,
							fatherId:'',
							type:1
	            		}*/
						this.driverAble(1,999999,key3,id3);
					break;
					case 4:
						let key4=this.equKey4.key;
						let type4=(this.equKey4.type)?(this.equKey4.type):-1;
						let id4=this.radioIdCC;
						/*var obj={
	            			id:this.radioIdCC,
							name:this.radionameCC,
							fatherId:'',
							type:1
	            		}*/
						this.equipAble(1,999999,key4,type4,id4);
					break;
				}
			},
			//快捷建车
		    newAddV(){
		    	this.newvelView=true;
		    	this.checkVelForm={
		    		FVehicleName:'',
		    		FGroupGUID:''
		    	};
		    	switch(this.typeTable){
		    		case 0:
		    			this.radioGroups=this.getGroup(this.radioIdEC);
		    		break;
		    		case 1:
		    			this.radioGroups=this.getGroup(this.radioIdDC);
		    		break;
		    	}
		    },
		    //提交新车
		    newSubmitV(formName){
		    	var _this=this;
		    	this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this.deepCopy(this.$store.state.copyVelData);
			            JsonObj.FVehicleName=this[formName].FVehicleName;
			            JsonObj.FInsuDate=this.timeChange(JsonObj.FInsuDate);
			            JsonObj.FPurchaseDate=this.timeChange(JsonObj.FPurchaseDate);
			            JsonObj.FRegisDate=this.timeChange(JsonObj.FRegisDate);
			            JsonObj.FRoadTranDate=this.timeChange(JsonObj.FRoadTranDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
			            JsonObj.FSystemType=this.SystemID;
			            let FGroupGUID=this[formName].FGroupGUID;
			           // delete JsonObj.FGroupGUID;
			            if(this.typeTable==0){
			            	JsonObj.FAgentGUID=this.radioIdEC;
			            }else if(this.typeTable==1){
			            	JsonObj.FAgentGUID=this.radioIdDC;
			            }
			            var JsonStr;
			            JsonStr=JSON.stringify({FTokenID:TokenID,FAction:"AddAdminVehicle",FT_AdminVehicle:JsonObj,FVersion:"1.0.0",'FGroupGUID':FGroupGUID});
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log('新增车辆',data);
				                if(data.Result==105){
				                  _this.message('_该车牌号已占用_', 'warning');
				                };
				                if(data.Result==200){  
				                	_this.message('_新增成功_', 'success');
				                	_this.newvelView=false;
				                	_this.$store.commit('getuserCompany','');
				                	if(_this.typeTable==0){
				                		var obj={
					            			id:_this.radioIdEC,
											name:_this.radionameEC,
											fatherId:'',
											type:1
					            		}
						            	_this.velTable(1,999999,-1,'',obj,'UnBindAsset');
						            }else if(_this.typeTable==1){
						            	var obj={
					            			id:_this.radioIdDC,
											name:_this.radionameDC,
											fatherId:'',
											type:1
					            		}
						            	_this.velTable(1,999999,-1,'',obj,'UnBindDriver');
						            }
				                }
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					}  
					else {
						console.log('error submit!!');
						return false;
					}
				});
		    },
		    //快捷建设备
		    newAddE(){
		    	this.newequView=true;
		    	this.checkEquForm={
		    		FAssetID:'',
		    		FAssetTypeID:'',
		    		FGroupGUID:'',
		    		FSIMNumber:''
		    	};
		    	switch(this.typeTable){
		    		case 2:
		    			this.radioGroups=this.getGroup(this.radioIdVC);
		    		break;
		    		case 3:
		    			this.radioGroups=this.getGroup(this.radioIdCC);
		    		break;
		    	}
		    },
		    //提交新设备
		    newSubmitE(formName){
		    	var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this.deepCopy(this.$store.state.copyEquipData);
						JsonObj.FAssetID=this[formName].FAssetID;
						JsonObj.FAssetTypeID=this[formName].FAssetTypeID;
						let FGroupGUID=this[formName].FGroupGUID;
						let FAgentGUID=(this.SystemID==6)?this.radioIdCC:this.radioIdVC;
						let FVehicleGUID=JsonObj.FVehicleGUID;
						JsonObj.FManufactureDate=this.timeChange(JsonObj.FManufactureDate);
						JsonObj.FSystemType=this.SystemID;
						JsonObj.FTHS=0;
						JsonObj.FVideo=0;
						JsonObj.FRFID=0;
						JsonObj.FTPMS=0;
						JsonObj.FScreen=0;
						JsonObj.FCamera=0;
						/*delete JsonObj.FAgentGUID;
						delete JsonObj.FVehicleGUID;
						delete JsonObj.FGroupGUID;*/
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "AddAdminAsset",
								FAgentGUID:FAgentGUID,
								FVehicleGUID:FVehicleGUID,
								FGroupGUID:FGroupGUID,
								FT_AdminAsset:JsonObj,
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
								console.log('新增设备',data);
								if(data.Result==105){
				                   _this.message('_该终端号已占用_', 'warning');
				                };
				                if(data.Result==200){
				                	_this.message('_新增成功_', 'success');
				                	_this.$store.commit('getuserCompany','');
				                	_this.newequView=false;
									_this.equipAble(1,999999,'',-1,FAgentGUID);
				                }
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					} 
					else {
						console.log('error submit!!');
						return false;
					}
				});
		    },
		    //快捷建司机
		    newAddD(){
		    	this.newdriView=true;
		    	this.checkDriForm={
		    		FDriverName:'',
		    		FPhoneNumber:'',
		    		FGroupGUID:''
		    	};
		    	this.radioGroups=this.getGroup(this.radioIdVC);
		    },
		    //提交新司机
		    newSubmitD(formName){
		    	var _this=this;
		    	this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this.deepCopy(this.$store.state.copyDriverData);
						JsonObj.FDriverName=this[formName].FDriverName;
						JsonObj.FPhoneNumber=this[formName].FPhoneNumber;
						let FAgentGUID=this.radioIdVC;
						let FVehicleGUIDs=JsonObj.FVehicleGUIDs;
						let FGroupGUID=this[formName].FGroupGUID;
						JsonObj.FDrivingStartDate=this.timeChange(JsonObj.FDrivingStartDate);
 						JsonObj.FDrivingEndDate=this.timeChange(JsonObj.FDrivingEndDate);
 						/*delete JsonObj.FAgentGUID;
						delete JsonObj.FVehicleGUIDs;
						delete JsonObj.FGroupGUID;*/
						console.log('JsonObj',JsonObj);
						let postData={
								FTokenID: TokenID,
								FAction: "AddAdminDriver",
								FT_AdminDriver:JsonObj,
								FAgentGUID:FAgentGUID,
								FVehicleGUIDs:FVehicleGUIDs,
								FGroupGUID:FGroupGUID,
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
								console.log('新增司机',data);
				                if(data.Result==200){
				                	_this.message('_新增成功_', 'success');
				                	_this.$store.commit('getuserCompany','');
				                	_this.newdriView=false;
									_this.driverAble(1,999999,'',_this.radioIdVC);
				                }
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					} 
					else {
						console.log('error submit!!');
						return false;
					}
				});
		    },
		    //快捷建集装箱
		    newAddCon(){
		    	this.newconView=true;
		    	this.checkConForm={
		    		FVehicleName:'',
					FVehicleSerialCode:'',
					FVIN:'',
					FGroupGUID:''
		    	};
		    	this.radioGroups=this.getGroup(this.radioIdEC);
		    },
		    //提交新箱
		    newSubmitCon(formName){
		    	var _this=this;
		    	this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this.deepCopy(this.$store.state.copyVelData);
						JsonObj.FVehicleName=this[formName].FVehicleName+this.containerCode;
						JsonObj.FVehicleSerialCode=this[formName].FVehicleSerialCode;
						JsonObj.FVIN=this[formName].FVIN;
						JsonObj.FAgentGUID=this.radioIdEC;
						//alert(this.radioIdEC)
						let FAgentGUID=this.radioIdEC;
						JsonObj.FInsuDate=this.timeChange(JsonObj.FInsuDate);
			            JsonObj.FPurchaseDate=this.timeChange(JsonObj.FPurchaseDate);
			            JsonObj.FRegisDate=this.timeChange(JsonObj.FRegisDate);
			            JsonObj.FRoadTranDate=this.timeChange(JsonObj.FRoadTranDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
			            JsonObj.FTechRegDate=this.timeChange(JsonObj.FTechRegDate);
						JsonObj.FSystemType=6;
						//delete JsonObj.ce;
						let FGroupGUID=this[formName].FGroupGUID;
			            //delete JsonObj.FGroupGUID;
 						var JsonStr;
			            JsonStr=JSON.stringify({FTokenID:TokenID,FAction:"AddAdminVehicle",FT_AdminVehicle:JsonObj,FVersion:"1.0.0",'FGroupGUID':FGroupGUID});
						$.ajax({
							"url": "web/Common/Common_Admin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data": JsonStr,
							success: function (data) {
								console.log('快捷建箱',JsonStr);
				                if(data.Result==105){
				                  _this.message('_该箱号已占用_', 'warning');
				                };
				                if(data.Result==200){  
				                	_this.message('_新增成功_', 'success');
				                	_this.newconView=false;
				                	var obj={
				            			id:_this.radioIdEC,
										name:_this.radionameEC,
										fatherId:'',
										type:1
				            		}
				            		_this.conTable(1,999999,-1,'',obj,'UnBindAsset');
				                }
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					} 
					else {
						console.log('error submit!!');
						return false;
					}
				});
		    },
		    //提示信息
			message(msg, type){
				this.$message({
				  showClose: true,
				  message: msg,
				  type: type
				});
			},
			//获取公司信息
			/*companyDetail(){
				let _this=this;
				return new Promise(resove=>{
			    let FGUID='6226ad1b-90fa-46ac-b095-50922231601d';
				let TokenID = this.$store.state.FTokenID;
				//获取公司详情
				$.ajax({
				        "url": "web/Common/Common_SuperAdmin",
				        "cache": false,
				        "async": true,
				        "type": "post",
				        "dataType": "json",
				        "contentType": "application/json; charset=utf-8",
				        "data": '{"FTokenID": "' + TokenID + '","FAction": "QuerySuperAdminAgentByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}', 
				        success: function (data) {
				            console.log('data',data);
				            _this.companyData= data.FObject[0];
				            resove();
				        },
				        error: function () {
				            console.log('_请求失败_')
				        }
			        });	
				})
			},*/
			//选中公司传递给父组件
			/*checkedCompany(){
				var nodeArr = this.$refs.expandMore.getCheckedNodes();
				var temp = [];
				var companyId = [];
				if (nodeArr.length)
					$.each(nodeArr, function (index, obj) {
						temp.push(obj.FShortName)
						companyId.push(obj.id)
					});
				this.$emit("children", [temp, companyId])
				//初始化搜索框,选完公司后直接关闭
				this.filterTextMore = '';
				this.$refs.expandMore.setCheckedKeys([])
			},*/
			
			closeNew(){
				
			}
		},
		mounted(){
			this.initExpand()
      		this.$store.commit('getuserCompany','');
			/*var _this = this;
			//模态框垂直居中,兼容小屏幕太向下的问题
			$('#modal').on('shown.bs.modal', function (e) {
				// 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
				$(this).css('display', 'block');
				var modalHeight = $(window).height() / 2 - $('#modal .modal-dialog').height() / 2;
				$(this).find('.modal-dialog').css({
					'margin-top': modalHeight
				});
			});
			//获取所有车辆列表
			if (this.$store.state.allCarsList != null) {
				setData()
			} else {
				this.$store.commit('getAllCarsData', setData)
			}
			function setData() {
				_this.data3 = _this.$store.state.allCarsData;
			}*/
      		
		},
		computed:{
			setTree:function(){  //请求store中tree数据	
				return this.$store.state.treeDataCompany;	
			},
			SystemID(){
		        return this.$store.state.choiceSystemID;
		    },
		},
		watch:{
			radioCompanyDialog:function(val){
				this.$emit("radiochangeC", val)
			},
			filterTextOne(val) {
		        this.$refs.expandOne.filter(val);
		    },
		    "checkConForm.FVehicleName" (val){
				var par1=/^[A-Z]{4}[0-9]{6}$/g;   //大写字母加数字：
				if(par1.test(val)){
					this.containerCode=this.Checkcode(val);
				}else{
					this.containerCode='';
				}
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
/* 	.newCompany .el-input__inner {
    height:28px;
    border-radius:0;
} */
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
	.relateV .el-dialog__body,.relateDE .el-dialog__body,.relateCon .el-dialog__body{
		padding:5px 15px;
	}
	.relateV .el-dialog,.relateDE .el-dialog{
		/*left:65.5%;*/
	}
	.relateV input,.relateDE input{
		border:1px solid #1970cf;
		height:28px;
		box-shadow: none !important;
	    padding-left: 10px;
	}


	.relateDE .el-button+.el-button,.relateCon .el-button+.el-button{
		margin:0;
	}
	/* .relateV .searchBtn,.relateDE .searchBtn{
		border: none;
	    background-color: white;
	    box-shadow: none;
	    height: 20px !important;
	    outline: none;
	    position: absolute;
	    top:5px;
	}
	.relateV .searchBtn{
		right:35%;
	}
	.relateDE .searchBtn{
		right:34%;
	} */
	.relateV .el-table,.relateDE .el-table{
		border-bottom: 1px solid #ccc;
	}
	.newCompany .el-form-item{
    	margin-bottom: 14px;
    }
    .extraButton{
    	padding: 3px 5px;
    	color:#fff;
    	border:none;
    	background:#4db3ff
    } 
    .relateDE .textDE {
    	width:130px;
    }
    .relateDE .selectDE{
		width:160px;
		height:28px;
    }
</style>


