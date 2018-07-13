<template>
	<el-dialog title='_时区选择_' :visible.sync="dialogSwicth" custom-class="role-dialog">
		<div id="timezone-map" class="timezone-map" @click="clickTimezone"></div>
		<el-row :gutter="20">
			<el-col :span="5">
				<p class="zone-text">GMT</p>
			</el-col>
			<el-col :span="5">
				<el-select v-model="timeZone.sign">
					<el-option
						v-for="item in timeZoneOption.sign"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="5">
				<el-select v-model="timeZone.hour">
					<el-option
						v-for="item in timeZoneOption.hour"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="1">
				<p class="zone-text">:</p>
			</el-col>
			<el-col :span="5">
				<el-select v-model="timeZone.minute">
					<el-option
						v-for="item in timeZoneOption.minute"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-col>
		</el-row>
		<div class="btn-list">
			<button @click="setlocalTime" type="button"
					class="el-button cancel el-button--primary">_本地时差_
			</button>
			<button @click="setTimeZone" type="button" class="el-button search el-button--primary">
				_保存_
			</button>
		</div>
	</el-dialog>
</template>
<script>
	require('plugins/timezone-picker-master/js/moment-with-locales.min.js')
	require('plugins/timezone-picker-master/js/moment-timezone-with-data-2010-2020.min.js')
	require('plugins/timezone-picker-master/WorldMapGenerator.js')
    let _this=null
	export default {
		data() {
			_this=this
			return {
				dialogSwicth:false,
				isLoadDom:true,
				timeZoneOption:{
					sign:['+','-'],
					hour:[
						0,1,2,3,4,5,6,7,8,9,10,11,12,13
					],
					minute:[0,30,45]
				},
				timeZone:{
					sign:null,
					hour:null,
					minute:null,
					data:null
				}

			}
		},
		methods: {
			openDialog(){
				this.dialogSwicth=true;
				if(!this.isLoadDom) return
				this.isLoadDom=false;
				setTimeout(function () {
					$("#timezone-map").WorldMapGenerator(
						{	height:210,
							quickLink: [{
								/*"PST": "PST",
								 "MST": "MST",
								 "CST": "CST",
								 "EST": "EST",
								 "GMT": "GMT",
								 "IST": "IST"*/
							}]
						}
					);
					_this.setlocalTime();
				},100)
			},
			clickTimezone(){
				let t=$("#timezone-map").data('WorldMapGenerator').getValue()[0];
				let z=t.offset*60;
				_this.timeZone=_this.parseZone(z);
				console.log(_this.timeZone.sign,_this.timeZone.hour,_this.timeZone.minute)

			},
			setlocalTime(){
				let zone=moment().utcOffset();
				_this.timeZone=_this.parseZone(zone);
			},
			setTimeZone(){
				_this.timeZone.data=_this.timeZone.sign+((_this.timeZone.hour*60)+_this.timeZone.minute);
				window.sessionStorage.timeDifferent=_this.timeZone.data;
				this.$router.push('/');
				window.location.reload();
			},

			parseZone(minute){
				let obj={
					sige:null,
					hour:null,
					minute:null,
					data:minute
				}
				if(minute>=0){
					obj.sign="+"
				}else{
					obj.sign="-"
				}
				obj.hour=Math.abs(parseInt(minute/60));
				obj.minute=minute%60;
				return obj
			}
		}

	}
</script>
<style>
	.hoverZone{
		display:block;
		width:100%;
		height:30px;
	}
</style>
<style scoped>
	/*时差选择*/
	.timezone-wrap{
		width:700px!important;
		height:500px;
	}

	.timezone-map{
		width:98%;
		margin:1%;
	}
	.hoverZone{
		display:block;
		width:100%;
		height:30px;
	}
	.zone-text{
		text-align:center;
		line-height:36px;
		font-size:28px;
	}
	.btn-list{
		height:50px;
		line-height:50px;
		text-align:center;
	}
</style>
