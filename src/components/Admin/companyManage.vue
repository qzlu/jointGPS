<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
	<section>
	    <!-- 编辑公司-->
	    <div class='addCompany'>
			 <el-dialog  title='_公司管理_-_修改公司_' :visible.sync="editEquipment" >
				<el-form :model="objDetail" :rules="rules" ref="objDetail" label-width="110px" >
					<el-row>
						<el-col :span="10">
							<el-form-item label="_公司代号_" prop="FAgentCode">
								<el-input v-model="objDetail.FAgentCode"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_公司简称_" prop="FShortName" label-width="160px">
								<el-input v-model="objDetail.FShortName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_公司全称_" prop="FFullName">
								<el-input v-model="objDetail.FFullName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_联系人_" prop="FContacts" label-width="160px">
								<el-input v-model="objDetail.FContacts"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_联系人电话_" prop="FTelephone">
								<el-input v-model="objDetail.FTelephone"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_邮箱_" prop="FEMailAddress" label-width="160px">
								<el-input v-model="objDetail.FEMailAddress"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_所属国家_" prop="FCountry">
								<input type="text" id="quickFilterInput" v-model="objDetail.FCountry" class="el-input__inner" placeholder="_请输入国家英文名称_" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_所属洲_" prop="FContinent" label-width="160px">
								<el-select v-model="objDetail.FContinent" placeholder="_请选择_" style="width: 100%;">
							      <el-option label="Asia" value="Asia"></el-option>
							      <el-option label="Europe" value="Europe"></el-option>
							      <el-option label="North America" value="North America"></el-option>
							      <el-option label="South America" value="South America"></el-option>
							      <el-option label="Africa" value="Africa"></el-option>
							      <el-option label="Oceania" value="Oceania"></el-option>
							      <el-option label="Antarctica" value="Antarctica"></el-option>
							    </el-select>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<div class='text-area' >
						<el-row>
							<el-col :span="22">
								<el-form-item label="_描述_" prop="FDescribe">
									<el-input type="textarea" v-model="objDetail.FDescribe" :maxlength="200"  :autosize="{minRows: 2, maxRows:3}"
											  placeholder='_最多输入_200_字_'></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="submitForm11('objDetail')">_保存_</el-button>
					<el-button @click="res" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 新增公司-->
		 <div class='addCompany'>
			<el-dialog  title='_公司管理_-_新增公司_' :visible.sync="addEquipment" >
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
					<el-row>
						<el-col :span="10">
							<el-form-item label="_公司代号_" prop="FAgentCode">
								<el-input v-model="ruleForm.FAgentCode"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_公司简称_" prop="FShortName" label-width="160px">
								<el-input v-model="ruleForm.FShortName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_公司全称_" prop="FFullName">
								<el-input v-model="ruleForm.FFullName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_联系人_" prop="FContacts" label-width="160px">
								<el-input v-model="ruleForm.FContacts"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_联系人电话_" prop="FTelephone">
								<el-input v-model="ruleForm.FTelephone"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_邮箱_" prop="FEMailAddress" label-width="160px">
								<el-input v-model="ruleForm.FEMailAddress"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="_所属国家_" prop="FCountry">
								<!-- <el-input v-model="ruleForm.FCountry"></el-input> -->
								<input type="text" id="quickFilterInput" v-model="ruleForm.FCountry" class="el-input__inner" placeholder="_请输入国家英文名称_" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="_所属洲_" prop="FContinent" label-width="160px">
								<el-select v-model="ruleForm.FContinent" placeholder="_请选择_" style="width: 100%;">
							      <el-option label="Asia" value="Asia"></el-option>
							      <el-option label="Europe" value="Europe"></el-option>
							      <el-option label="North America" value="North America"></el-option>
							      <el-option label="South America" value="South America"></el-option>
							      <el-option label="Africa" value="Africa"></el-option>
							      <el-option label="Oceania" value="Oceania"></el-option>
							      <el-option label="Antarctica" value="Antarctica"></el-option>
							    </el-select>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
					<div class='text-area' >
						<el-row>
							<el-col :span="22">
								<el-form-item label="_描述_" prop="FDescribe">
									<el-input type="textarea" v-model="ruleForm.FDescribe" :maxlength="200" :autosize="{minRows: 2, maxRows:3}" :resize='none' placeholder='_最多输入_200_字_'></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer" >
					<el-button type="primary" @click="submitForm('ruleForm')">_保存_</el-button>
					<el-button @click="resetForm('ruleForm')" type="button" class='el-button el-button--default cancel el-button--primary'>_重置_</el-button>
				</div>
			</el-dialog>
		 </div>

		<div id="operate_wrapper">
			<div class='box-header'>
				<div class="leftbtn">
					<el-button type="primary" icon="edit" size="small" @click='ad'><span
						style="color: white">_新建_</span>
					</el-button>
					<el-button type="primary" icon="caret-right" size="small" @click='changeStatus(true)'>_启用_</el-button>
					<el-button type="primary" icon="circle-close" size="small" @click='changeStatus(false)'>_禁用_</el-button>
					<el-button type="primary" class="glyphicon glyphicon-refresh" size="small" @click="reload">_刷新_
                </el-button>  
				</div>
				<div class="rightinput" style="position: relative">
					<input type="text" placeholder="_请输入公司简称_" v-model="searchCondition.FKey" @keyup.enter="doQuery">
					<button class="glyphicon glyphicon-search searchBtn" style="height: 28px;"
							@click="doQuery"></button>
					<button class="glyphicon glyphicon-chevron-down" @click="dialogVisible=!dialogVisible"></button>
					<div class="mymodal"
						 style="position:absolute;left:-160px;z-index:999;visibility: hidden;border: 1px solid #ccc;background: white;padding-top: 10px">
						<div class="modal-body" style="padding: 0px">
							<el-form :model='searchCondition' ref="ruleForm1" label-width="100px">
								<el-form-item label="_关键字_" prop="FKey">
									<el-input class="col-md-12" v-model="searchCondition.FKey" placeholder="_请输入公司简称_"></el-input>
								</el-form-item>
								<el-form-item label="_状态_" prop="FState">
									<el-select class="col-md-12" v-model="searchCondition.FState" placeholder="_请选择_">
										<el-option label="_全部_" value="-1" selected="selected"></el-option>
										<el-option label="_已启用_" value="1"></el-option>
										<el-option label="_已禁用_" value="0"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<div class="btnList">
										<el-button type="primary" @click="doQuery">_提交_</el-button>
										<!-- <el-button type="text" class="reset" @click="resetForm('ruleForm1')">_重置_
										</el-button> -->
										<el-button @click="resetForm('ruleForm1')" class='reset el-button el-button--default cancel el-button--primary'>_重置_</el-button>
									</div>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--设备列表-->
		<div id="el_table_wrap" class="el_table_wrap">
			<el-table :data="equipmentList" ref="multipleTable" @selection-change="handleSelectionChange"
					  :height="table_height" stripe style="width: 100%;" empty-text='_暂无数据_'>
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="RowNo" label="_序号_" width="70"></el-table-column>
				<el-table-column label="_操作_" width="90">
					<template scope="scope">
						<el-button  type="text" size="small" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button  type="text" size="small"  @click="ondelete(scope.$index,scope.row)"><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
				<el-table-column label="_状态_" width="70">
					<template scope="scope">
						<el-switch  v-model="scope.row.FStatus" @change='onlyChange(scope.$index, scope.row)'></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="FAgentCode"  label="_公司编号_" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FFullName"   label="_公司全称_" width="180" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FShortName"  label="_公司简称_" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FContacts"   label="_联系人_" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FTelephone"  label="_电话_" width="180" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FEMailAddress" label="_邮箱_" width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="position" label="_公司区域_" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="FDescribe" show-overflow-tooltip label="_说明_" width="180"></el-table-column>
				<el-table-column prop="" show-overflow-tooltip label="" min-width="1"></el-table-column>
			</el-table>
		</div>
		<!--分页-->
		<div class="pagination" id='pagination'>
			<div class="block">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="pageIndex"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize"
					layout="prev, pager, next, jumper,total,sizes"
					:total="FTotalCount">
				</el-pagination>
			</div>
		</div>
	</section>
</template>
<script >
	require("!style!css!plugins/Autocomplete/Autocomplete.css")
	require("plugins/Autocomplete/Autocomplete.js")
	/*require("plugins/jQuery/jquery-2.2.3.min.js")
	require("plugins/jQueryUI/jquery-ui.min.js")*/
	let _this
	export default {
		data() {
			_this=this;
			const checkFDescribe = (rule,value,callback) => {  
 				if(value.length==200){
 					callback(new Error('_最多输入_200_字_'));
 				}else{
 					callback();
 				}
	        };
	        const checkFPhoneNumber = (rule, value, callback) => {
			        var uPattern = /^[0-9\-\+\(\)]{1,18}$/g;
					if(value&& !uPattern.test(value)){
		            	console.log('error')
		             	callback(new Error('_请输入有效号码_'));
		            } else{
		            	console.log('succ')
		            	callback();
		            }
			    }; 
			return {
				fguid:'',
				bool:false,
				pageSize: 20,
				pageIndex: 1,
				FTotalCount: 0,
				dialogVisible: false,
				FGUIDs: '',
				table_height: null,
				anycheck: [],
				relatierol: false,
				addEquipment: false,
				editEquipment: false,
				//搜索关键字
				searchCondition: {
					"FState": "",
					"FKey": ""
				},
				//新增设备
				ruleForm: {
					FAgentCode:'',
					FShortName:'',
					FFullName:'',
					FDescribe:'',
					FContacts:'',
					FTelephone:'',
					FEMailAddress:'',
					FContinent:'',
					FCountry:'',
					FStatus:1,
				},
				objDetail:{},
				rules: {
					FAgentCode: [{required: true, message: '_请输入公司代号_'}],
					FShortName: [{required: true, message: '_请输入公司简称_'}],
					FFullName: [{required: true, message: '_请输入公司全称_'}],
					FContacts: [{required: true, message: '_请输入联系人_'}],
					FEMailAddress: [{type: 'email', message: '_请输入正确的邮箱地址_'}],
					FTelephone:[{ validator: checkFPhoneNumber }],
					// FDescribe: [{validator: checkFDescribe}],
				},
				allcheck: {
					ischeck: false,
				},
				equipmentList: [],
			}
		},
		props: {
			screenHeight: Number
		},
		mounted(){
			setTimeout(() => {
				this.adjustPage();
			}, 100);
			//右边搜索区域取消默认
			/*$('form').on("click", function (e) {
				e.stopPropagation();
			});*/
			var _this = this;
			this.doQuery();
		},
		methods: {
			//实例化国家地区选择
			initCountry(){
				var quickList=[{"cc":"AF","name":"Afghanistan"},{"cc":"AL","name":"Albania"},{"cc":"DZ","name":"Algeria"},{"cc":"AS","name":"American Samoa"},{"cc":"AD","name":"Andorra"},{"cc":"AO","name":"Angola"},{"cc":"AI","name":"Anguilla"},{"cc":"AQ","name":"Antarctica"},{"cc":"AG","name":"Antigua and Barbuda"},{"cc":"AR","name":"Argentina"},{"cc":"AM","name":"Armenia"},{"cc":"AW","name":"Aruba"},{"cc":"AC","name":"Ascension Islands"},{"cc":"AU","name":"Australia"},{"cc":"AT","name":"Austria"},{"cc":"AZ","name":"Azerbaijan"},{"cc":"BS","name":"Bahamas"},{"cc":"BH","name":"Bahrain"},{"cc":"BD","name":"Bangladesh"},{"cc":"BB","name":"Barbados"},{"cc":"BY","name":"Belarus"},{"cc":"BE","name":"Belgium"},{"cc":"BZ","name":"Belize"},{"cc":"BJ","name":"Benin"},{"cc":"BM","name":"Bermuda"},{"cc":"BT","name":"Bhutan"},{"cc":"BO","name":"Bolivia"},{"cc":"BA","name":"Bosnia and Herzegovina"},{"cc":"BW","name":"Botswana"},{"cc":"BR","name":"Brazil"},{"cc":"IO","name":"British Indian Ocean Territory"},{"cc":"BN","name":"Brunei"},{"cc":"BG","name":"Bulgaria"},{"cc":"BF","name":"Burkina Faso"},{"cc":"BI","name":"Burundi"},{"cc":"KH","name":"Cambodia"},{"cc":"CM","name":"Cameroon"},{"cc":"CA","name":"Canada"},{"cc":"CV","name":"Cape Verde"},{"cc":"KY","name":"Cayman Islands"},{"cc":"CF","name":"Central African Republic"},{"cc":"TD","name":"Chad"},{"cc":"CL","name":"Chile"},{"cc":"CN","name":"China"},{"cc":"CO","name":"Colombia"},{"cc":"KM","name":"Comoros"},{"cc":"CG","name":"Congo"},{"cc":"CD","name":"Congo, The Democratic Republic of the"},{"cc":"CK","name":"Cook Islands"},{"cc":"CR","name":"Costa Rica"},{"cc":"CI","name":"Cote D’Ivoire"},{"cc":"HR","name":"Croatia"},{"cc":"CU","name":"Cuba"},{"cc":"CY","name":"Cyprus"},{"cc":"CZ","name":"Czech Republic"},{"cc":"DK","name":"Denmark"},{"cc":"DJ","name":"Djibouti"},{"cc":"DM","name":"Dominica"},{"cc":"DO","name":"Dominican Republic"},{"cc":"EC","name":"Ecuador"},{"cc":"EG","name":"Egypt"},{"cc":"SV","name":"El Salvador"},{"cc":"GQ","name":"Equatorial Guinea"},{"cc":"ER","name":"Eritrea"},{"cc":"EE","name":"Estonia"},{"cc":"ET","name":"Ethiopia"},{"cc":"FK","name":"Falkland Islands (Malvinas)"},{"cc":"FO","name":"Faroe Islands"},{"cc":"FJ","name":"Fiji"},{"cc":"FI","name":"Finland"},{"cc":"FR","name":"France"},{"cc":"GF","name":"French Guiana"},{"cc":"PF","name":"French Polynesia"},{"cc":"GA","name":"Gabon"},{"cc":"GM","name":"Gambia"},{"cc":"GE","name":"Georgia"},{"cc":"DE","name":"Germany"},{"cc":"GH","name":"Ghana"},{"cc":"GI","name":"Gibraltar"},{"cc":"GR","name":"Greece"},{"cc":"GL","name":"Greenland"},{"cc":"GD","name":"Grenada"},{"cc":"GP","name":"Guadeloupe"},{"cc":"GU","name":"Guam"},{"cc":"GT","name":"Guatemala"},{"cc":"GN","name":"Guinea"},{"cc":"GW","name":"Guinea-Bissau"},{"cc":"GY","name":"Guyana"},{"cc":"HT","name":"Haiti"},{"cc":"HN","name":"Honduras"},{"cc":"HK","name":"Hong Kong S.A.R., China"},{"cc":"HU","name":"Hungary"},{"cc":"IS","name":"Iceland"},{"cc":"IN","name":"India"},{"cc":"ID","name":"Indonesia"},{"cc":"SS","name":"Inmarsat"},{"cc":"IR","name":"Iran"},{"cc":"IQ","name":"Iraq"},{"cc":"IE","name":"Ireland"},{"cc":"IL","name":"Israel"},{"cc":"IT","name":"Italy"},{"cc":"JM","name":"Jamaica"},{"cc":"JP","name":"Japan"},{"cc":"JO","name":"Jordan"},{"cc":"KZ","name":"Kazakhstan"},{"cc":"KE","name":"Kenya"},{"cc":"KI","name":"Kiribati"},{"cc":"KP","name":"Korea, North"},{"cc":"KR","name":"Korea, South"},{"cc":"KW","name":"Kuwait"},{"cc":"KG","name":"Kyrgyzstan"},{"cc":"LA","name":"Laos"},{"cc":"LV","name":"Latvia"},{"cc":"LB","name":"Lebanon"},{"cc":"LS","name":"Lesotho"},{"cc":"LR","name":"Liberia"},{"cc":"LY","name":"Libya"},{"cc":"LI","name":"Liechtenstein"},{"cc":"LT","name":"Lithuania"},{"cc":"LU","name":"Luxembourg"},{"cc":"MO","name":"Macao"},{"cc":"MK","name":"Macedonia"},{"cc":"MG","name":"Madagascar"},{"cc":"MW","name":"Malawi"},{"cc":"MY","name":"Malaysia"},{"cc":"MV","name":"Maldives"},{"cc":"ML","name":"Mali"},{"cc":"MT","name":"Malta"},{"cc":"MH","name":"Marshall Islands"},{"cc":"MQ","name":"Martinique"},{"cc":"MR","name":"Mauritania"},{"cc":"MU","name":"Mauritius"},{"cc":"YT","name":"Mayotte"},{"cc":"MX","name":"Mexico"},{"cc":"FM","name":"Micronesia, Federated States Of"},{"cc":"MD","name":"Moldova"},{"cc":"MC","name":"Monaco"},{"cc":"MN","name":"Mongolia"},{"cc":"ME","name":"Montenegro"},{"cc":"MS","name":"Montserrat"},{"cc":"MA","name":"Morocco"},{"cc":"MZ","name":"Mozambique"},{"cc":"MM","name":"Myanmar"},{"cc":"NA","name":"Namibia"},{"cc":"NR","name":"Nauru"},{"cc":"NP","name":"Nepal"},{"cc":"NL","name":"Netherlands"},{"cc":"AN","name":"Netherlands Antilles"},{"cc":"NC","name":"New Caledonia"},{"cc":"NZ","name":"New Zealand"},{"cc":"NI","name":"Nicaragua"},{"cc":"NE","name":"Niger"},{"cc":"NG","name":"Nigeria"},{"cc":"NU","name":"Niue"},{"cc":"MP","name":"Northern Mariana Islands"},{"cc":"NO","name":"Norway"},{"cc":"OM","name":"Oman"},{"cc":"PK","name":"Pakistan"},{"cc":"PW","name":"Palau"},{"cc":"PS","name":"Palestinian Territory"},{"cc":"PA","name":"Panama"},{"cc":"PG","name":"Papua New Guinea"},{"cc":"PY","name":"Paraguay"},{"cc":"PE","name":"Peru"},{"cc":"PH","name":"Philippines"},{"cc":"PL","name":"Poland"},{"cc":"PT","name":"Portugal"},{"cc":"PR","name":"Puerto Rico"},{"cc":"QA","name":"Qatar"},{"cc":"RE","name":"Reunion"},{"cc":"RO","name":"Romania"},{"cc":"RU","name":"Russia"},{"cc":"RW","name":"Rwanda"},{"cc":"SH","name":"Saint Helena"},{"cc":"KN","name":"Saint Kitts and Nevis"},{"cc":"LC","name":"Saint Lucia"},{"cc":"PM","name":"Saint Pierre and Miquelon"},{"cc":"VC","name":"Saint Vincent and the Grenadines"},{"cc":"WS","name":"Samoa"},{"cc":"SM","name":"San Marino"},{"cc":"ST","name":"Sao Tome and Principe"},{"cc":"SA","name":"Saudi Arabia"},{"cc":"SN","name":"Senegal"},{"cc":"RS","name":"Serbia"},{"cc":"SC","name":"Seychelles"},{"cc":"SL","name":"Sierra Leone"},{"cc":"SG","name":"Singapore"},{"cc":"SK","name":"Slovakia"},{"cc":"SI","name":"Slovenia"},{"cc":"SB","name":"Solomon Islands"},{"cc":"SO","name":"Somalia"},{"cc":"ZA","name":"South Africa"},{"cc":"ES","name":"Spain"},{"cc":"LK","name":"Sri Lanka"},{"cc":"SD","name":"Sudan"},{"cc":"SR","name":"Suriname"},{"cc":"SZ","name":"Swaziland"},{"cc":"SE","name":"Sweden"},{"cc":"CH","name":"Switzerland"},{"cc":"SY","name":"Syria"},{"cc":"TW","name":"Taiwan"},{"cc":"TJ","name":"Tajikistan"},{"cc":"TZ","name":"Tanzania"},{"cc":"TH","name":"Thailand"},{"cc":"TL","name":"Timor-Leste"},{"cc":"TG","name":"Togo"},{"cc":"TK","name":"Tokelau"},{"cc":"TO","name":"Tonga"},{"cc":"TT","name":"Trinidad and Tobago"},{"cc":"TN","name":"Tunisia"},{"cc":"TR","name":"Turkey"},{"cc":"TM","name":"Turkmenistan"},{"cc":"TC","name":"Turks and Caicos Islands"},{"cc":"TV","name":"Tuvalu"},{"cc":"UG","name":"Uganda"},{"cc":"UA","name":"Ukraine"},{"cc":"AE","name":"United Arab Emirates"},{"cc":"GB","name":"United Kingdom"},{"cc":"US","name":"United States"},{"cc":"UY","name":"Uruguay"},{"cc":"UZ","name":"Uzbekistan"},{"cc":"VU","name":"Vanuatu"},{"cc":"VA","name":"Vatican City State (Holy See)"},{"cc":"VE","name":"Venezuela"},{"cc":"VN","name":"Vietnam"},{"cc":"VG","name":"Virgin Islands, British"},{"cc":"VI","name":"Virgin Islands, US"},{"cc":"WF","name":"Wallis and Futuna"},{"cc":"YE","name":"Yemen"},{"cc":"ZM","name":"Zambia"},{"cc":"ZW","name":"Zimbabwe"},{"cc":"VO","name":"iNum"}]

				//focus function for the country filter
				$("#quickFilterInput").focus(function(){
					console.log('aaa')
					if($(this).val() == '_请输入国家英文名称_'){
						$(this).val('');
						$(this).removeClass('color-grey');
					}
				});
				//blur function for the country filter
				$("#quickFilterInput").blur(function(){
					if($(this).val() == ''){
						$(this).val('_请输入国家英文名称_');
						$(this).addClass('color-grey');
					}
				});

				//init country filter based on jquery autocomplete
				$("#quickFilterInput").autocomplete(quickList, {
					minChars: 1,
					width: 310,
					matchContains: true,
					max: 10,
					scroll: false,
					formatItem: function(row, i, max) {
						return "<span class=\" flag " + row.cc + "\"></span>"  + row.name;
					},
					formatMatch: function(row, i, max) {
						return "<span class=\" flag " + row.cc + "\"></span>" +  row.name;
					},
					formatResult: function(row) {
						return row.name;
					}
				}).result(function(event, item) {
					if(_this.addEquipment){
						_this.ruleForm.FCountry=item.name;
					}else{
						_this.objDetail.FCountry=item.name;
					}
				});

			},
			ad(){
				this.addEquipment=true;
				setTimeout(() => {
					this.initCountry();
				},300);
			},
			reload(){
				this.doQuery();
				console.log(this.equipmentList);
			},
			res(){  //重置后不改变原始状态
				let _this=this;
				if(this.objDetail.FStatus){  //不重置FStatus
                  	_this.objDetail={
						FAgentCode:'',
						FShortName:'',
						FFullName:'',
						FDescribe:'',
						FContacts:'',
						FTelephone:'',
						FEMailAddress:'',
						FContinent:'',
						FCountry:'',
						FStatus:1,
					}
				}else{                          //不重置FStatus
					_this.objDetail={
						FAgentCode:'',
						FShortName:'',
						FFullName:'',
						FDescribe:'',
						FContacts:'',
						FTelephone:'',
						FEMailAddress:'',
						FContinent:'',
						FCountry:'',
						FStatus:0,
					}
				}
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.doQuery();
			},
			handleCurrentChange(val) {
				this.pageIndex = val;
				this.doQuery();
			},
			adjustPage(){
				this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "pagination", true) + 8;
			},
			//重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//搜索框查询
			doQuery(){
				let _this = this;
				let TokenID = this.$store.state.FTokenID;
				let FKey = this.searchCondition.FKey;
				let FState = this.searchCondition.FState;
				FState==""?FState=-1:FState=FState;
				let PageSize = this.pageSize;
				let pageIndex = this.pageIndex;
				$.ajax({
					"url": "web/Common/Common_SuperAdmin",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": '{"FTokenID": "' + TokenID + '","FAction": "QuerySuperAdminAgentList","FVersion": "1.0.0","FKey":"' + FKey + '","FState":"' + FState + '","FPageSize":"' + PageSize + '","FPageIndex":"' + pageIndex + '"}',
					success: function (data) {
						console.log(data);
						var Fobj = data;
						_this.equipmentList = [];
						$.each(Fobj.FObject.Table1, function (index, obj) {
							if(obj.FStatus==1){
								obj.FStatus=true
							}else{
								obj.FStatus=false
							}
							//区域州
							if(obj.FContinent&&obj.FCountry){
								obj.position=obj.FContinent+'-'+obj.FCountry;
							}else if(obj.FContinent){
								obj.position=obj.FContinent;
							}else if(obj.FCountry){
								obj.position=obj.FCountry;
							}else{
								obj.position='--'
							}
							obj.FTelephone=obj.FTelephone?obj.FTelephone:'--';
							obj.FEMailAddress=obj.FEMailAddress?obj.FEMailAddress:'--';
							obj.FDescribe=obj.FDescribe?obj.FDescribe:'--';
							_this.equipmentList.push(obj);
						});
						_this.FTotalCount = Fobj.FObject.Table[0].FTotalCount;
						//搜索表单重置
						// _this.resetForm('ruleForm1');
						_this.dialogVisible=false;
					},
					error: function () {
						console.log('_请求失败_')
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
			//判断是否有数据被选中
			handleSelectionChange(val) {
				this.anycheck = val;
				console.log(this.anycheck);
				let arrFGUID = [];
				this.anycheck.forEach(obj=> {
					arrFGUID.push(obj.FGUID);
				})
				this.FGUIDs = arrFGUID.join(',');
			},
			//删除数据
			ondelete: function (index,row) {
				this.$confirm('_此操作将永久删除_,_是否继续_?', '_提示_', {
						confirmButtonText: '_确定_',
						confirmButtonClass: "search",
						cancelButtonText: '_取消_',
						cancelButtonClass: "cancel el-button--primary",
						type: 'warning'
				    })
					.then(() => {
						let _this = this;
						var deleteFGUID = row.FGUID;
                        let TokenID = this.$store.state.FTokenID;
						$.ajax({
							"url": "web/Common/Common_SuperAdmin",
							"cache": false,
							"async": true,
							"type": "post",
							"dataType": "json",
							"contentType": "application/json; charset=utf-8",
							"data":'{"FTokenID": "'+TokenID+'","FAction": "DeleteSuperAdminAgentByFGUID","FVersion": "1.0.0","FGUID":"'+deleteFGUID+'"}',
							success: function (data) {
								console.log(data);
								if(data.Result!==200){
				                  _this.message('_该公司有子账户_，_无法删除_', 'warning');
				                }else {
					              _this.message('_修改成功_', 'success');
					              _this.anycheck=[];
					              _this.$refs.multipleTable.clearSelection();
					            }
								_this.doQuery();
							},
							error: function () {
								console.log('_请求失败_')
							}
						});
					})
					.catch(() => {
						this.$message.info('_已取消操作_!');
						this.anycheck=[];
						this.$refs.multipleTable.clearSelection();
					});
			},
			//多选修改设备状态
			changeStatus: function (parm) {
				var _this = this;
				if (this.anycheck.length == 0) {
					this.message('_请先勾选_', 'warning');
				} else {
					let TokenID = this.$store.state.FTokenID;
					let FGUIDs = this.FGUIDs;
					let FState=parm?1:0;
					$.ajax({
						"url": "web/Common/Common_SuperAdmin",
						"cache": false,
						"async": true,
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": '{"FTokenID":"' + TokenID + '","FAction":"UpdateSuperAdminAgentStatus","FGUIDs":"' + FGUIDs + '","FVersion":"1.0.0","FState":"' + FState + '"}',
						success: function (data) {
							console.log(data);
							_this.equipmentList=[];
							_this.doQuery();
							_this.message('_修改成功_','success');
							_this.anycheck=[];
						},
						error: function () {
							console.log('_请求失败_')
						}
					});
				}
			},
			//单选修改设备状态
			onlyChange(index,row){
				let _this=this;
				let TokenID = this.$store.state.FTokenID;
			    let FState=row.FStatus?1:0;
 				let FGUIDs = row.FGUID;
 				$.ajax({
						"url": "web/Common/Common_SuperAdmin",
						"cache": false,
						"async": true,
						"type": "post",
						"dataType": "json",
						"contentType": "application/json; charset=utf-8",
						"data": '{"FTokenID":"' + TokenID + '","FAction":"UpdateSuperAdminAgentStatus","FGUIDs":"' + FGUIDs + '","FVersion":"1.0.0","FState":"' + FState + '"}',
						success: function (data) {
							console.log(data);
							/*_this.equipmentList=[];
							_this.doQuery();
							_this.message('_修改成功_','success');
							_this.anycheck=[];*/
							if(data.Result!="200"){
				                _this.equipmentList[index].FStatus=_this.equipmentList[index].FStatus;
				            }else {
				              _this.message('_修改成功_', 'success');
				              _this.anycheck=[];
				              _this.$refs.multipleTable.clearSelection();
				            }
			                _this.anycheck=[];
						},
						error: function () {
							console.log('_请求失败_')
						}
					});
			},
			//编辑数据
			handleEdit(index,row) {
               this.fguid=row.FGUID;
               /*setTimeout(() => {
					this.initCountry();
				},300);*/
               let FGUID=this.fguid;
		       let _this = this;
		       let TokenID = this.$store.state.FTokenID;
		        //获取司机详情
		        $.ajax({
		          "url": "web/Common/Common_SuperAdmin",
		          "cache": false,
		          "async": true,
		          "type": "post",
		          "dataType": "json",
		          "contentType": "application/json; charset=utf-8",
		          "data": '{"FTokenID": "' + TokenID + '","FAction": "QuerySuperAdminAgentByFGUID","FVersion": "1.0.0","FGUID":"' + FGUID + '"}',
		          success: function (data) {
		            console.log(data);
		            _this.editEquipment=true;
		            var Fobj = data;
		            _this.objDetail=Fobj.FObject[0];
		            setTimeout(() => {
						_this.initCountry();
					},300);
		          },
		          error: function () {
		            console.log('_请求失败_')
		          }
		        });
			},
			//提价新表单
			submitForm(formName) {
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						var JsonStr;
 							JsonStr=JSON.stringify({"FTokenID":TokenID,"FAction":"AddSuperAdminAgent","FT_SuperAdminAgent":JsonObj,"FVersion":"1.0.0"});
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
									_this.doQuery();
									_this.resetForm(formName);
							    	_this.addEquipment=false;
								}else{
									_this.message('_该公司名称已占用_', 'warning');
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
			//编辑新表单
			submitForm11(formName) {
				var _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let TokenID = this.$store.state.FTokenID;
						let JsonObj=this[formName];
						var FGUID=this.fguid;
						var JsonStr;
 							JsonStr=JSON.stringify({"FTokenID":TokenID,"FAction":"UpdateSuperAdminAgent","FGUID":FGUID,"FT_SuperAdminAgent":JsonObj,"FVersion":"1.0.0"});
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
									_this.equipmentList=[];
									_this.doQuery();
							    	_this.editEquipment=false;
								}else{
									_this.message('_该公司名称已占用_', 'warning');
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
		},
		watch: {
			screenHeight () {
				this.adjustPage();
			},
			dialogVisible: function () {
				if (this.dialogVisible) {
					$(".mymodal").css('visibility', 'visible');
				} else {
					$(".mymodal").css('visibility', 'hidden');
				}
			},
			addEquipment: {
				handler () {
					this.ruleForm={
							FAgentCode:'',
							FShortName:'',
							FFullName:'',
							FDescribe:'',
							FContacts:'',
							FTelephone:'',
							FEMailAddress:'',
							FContinent:'',
							FCountry:'',
							FStatus:1,
						}
				},
				//deep: true
			},
			/*editEquipment:{
				handler () {
					this.doQuery();
				}
			}*/
		},
		created: function () {

		}
	}
</script>
<style scoped>


	.leftbtn {
		float:left;
	}

	.rightinput {
		float:right;
		margin-right:10px;
	}

	.rightinput input {
		border:1px solid #1970cf;
		height:28px;
		border-radius:15px;
		box-shadow:none !important;
		width:180px;
		padding-left:10px;

	}

	.rightinput input:active {
		box-shadow:none !important;
		outline:none;
	}

	.rightinput input:focus {
		box-shadow:none !important;
		outline:none;
	}

	.searchBtn {
		border:none;
		background-color:white;
		margin-left:-40px;
		box-shadow:none;
		height:20px !important;
		outline:none;
	}

	.glyphicon-chevron-down {
		margin-left:30px;
		width:28px;
		height:28px;
		border-radius:50%;
		outline:none;
		background-color:white;
		border:1px solid #1970cf;
	}

	#el_table_wrap .el-button {
		padding:0;
	}

	.el-popover .el-form-item {
		margin-bottom:0px;
	}

	.el-form-item .el-input__inner {
		height:28px;
	}
</style>
<style>
	.equiment .el-form-item .el-input__inner {
		height:28px;
		border-radius:0;
	}

	.equiment .btnList {
		text-align:right;
		width:100%;
		padding-right:25px;
	}

	.equiment .btnList .reset {
		padding:7px 25px;
		border:1px solid #ccc;
		background-color:#fff;
	}
	.addCompany .el-dialog .el-dialog__body{
		max-height: 600px;
	}
	.addCompany .el-col{
		height: 50px
	}
	@media (min-width:1600px) {   
		.addCompany .el-dialog--small {
		    width: 36%;
		} 

    }
    @media (min-width:1300px) and (max-width:1599px){
    	.addCompany .el-dialog--small {
		    width: 45%;
		} 
    }
    @media (min-width:1200px) and (max-width:1299px){
    	.addCompany .el-dialog--small {
		    width: 52%;
		} 
    }
    @media (max-width:1199px) {
		.addCompany .el-dialog--small {
		    width: 50%;
		} 
    } 
	/*.addCompany .el-row:last-child{
		padding-bottom: 20px
	}*/
</style>