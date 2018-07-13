<template>
	<section style='height:100%'>
		<div class='velcss'>
			<el-dialog title='_车辆详情_' :visible.sync="VdetailView" top='25%'>
				<table class="table detailTable" style='table-layout:fixed;'>
		            <tbody>
			            <tr>
			               	<td colspan="2" rowspan="3" width="40%">
			                  	<img v-if="velDataTrans.FImage" :src="velDataTrans.FImage"  style='border:1px solid #ccc;display:inline-block;width:209px;height:117px;'>
			                  	<img v-else  src='/static/img/details.png' style='border:1px solid #ccc;display:inline-block;width:209px;height:117px;'></img>
			               	</td>
			               <td width="25%" class='likeHeader'><b>_车牌_</b></td>
			               <td width="35%">{{velDataTrans.FVehicleName}}</td>
			            </tr>
			            <tr>
			               	<td class='likeHeader'><b>_司机_</b></td><td>{{velDataTrans.FDriverName}}</td>
			            </tr>
		             	<tr>
			               	<td class='likeHeader'><b>_自编号_</b></td><td>{{velDataTrans.FVehicleSerialCode}}</td>
			            </tr>
		            	<tr style='height:44px'>
			               	<td class='likeHeader'><b>_设备_</b></td><td>{{velDataTrans.FAssetID}}</td>
			               	<td class='likeHeader'><b>SIM_卡号_</b></td><td>{{velDataTrans.FSIMNumber}}</td>
			            </tr>
			            <tr style='height:44px'>
			               	<td class='likeHeader'><b>_状态_</b></td><td>{{velDataTrans.FStatus}}</td>
			               	<td class='likeHeader'><b>_运营类型_</b></td><td>{{velDataTrans.FOperateType}}</td>
			            </tr>
						<tr style='height:44px'>
			               	<td class='likeHeader'><b>_司机电话_</b></td><td>{{velDataTrans.FPhoneNumber}}</td>
			               	<td class='likeHeader'><b>_车辆类型_</b></td><td>{{velDataTrans.FVehicleTypeID}}</td>
			            </tr>
			            <tr style='height:44px'>
			               <td class='likeHeader'><b>_描述_</b></td>
			               <td colspan="3" style='word-wrap:break-word'>{{velDataTrans.FDescription}}</td>
			            </tr>
		           </tbody>
		       </table>
			</el-dialog>
	    </div>
    </section>
</template>
<script>

	export default {
		data(){
			return {
				velDataTrans:'',  //车辆详情数据
				VdetailView:false
			}
		},
		methods: {
			getVelInfo(val){
				var _this = this;
				let TokenID = this.$store.state.FTokenID;
				$.ajax({
					"url": "web/Common/Common_Admin",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminVehicleByFGUID","FVersion": "1.0.0","FGUID":"' + val + '"}',
					success: function (data) {
						console.log('车辆详情', data);
						_this.velData = _this.deepCopy(data.FObject[0]);
						_this.velDataTrans = _this.deepCopy(data.FObject[0]);
						_this.velDataTrans.FStatus = (_this.velDataTrans.FStatus) ? '_启用_' : '_禁用_';
						_this.velDataTrans.FVehicleTypeID = _this.velDataTrans.FVehicleTypeID == 0 ? '_厢车_' : _this.velDataTrans.FVehicleTypeID == 1 ? '_罐车_' : _this.velDataTrans.FVehicleTypeID == 2 ? '_其他_' : '_厢车_';
						_this.velDataTrans.FOperateType = _this.velDataTrans.FOperateType == '0' ? '_经营租赁_' : _this.velDataTrans.FOperateType == '1' ? '_以租代售_' : _this.velDataTrans.FOperateType == '2' ? '_直销_' : _this.velDataTrans.FOperateType == '3' ? '_自营_' : _this.velDataTrans.FOperateType == '4' ? '_试车_' : _this.velDataTrans.FOperateType == '5' ? '_融资租赁_' : _this.velDataTrans.FOperateType == '6' ? '_其他_' : '_其他_';
						_this.VdetailView=true
					},
					error: function () {
						console.log('_请求失败_')
					}
				});
			}
		}
	};
</script>
<style>
	
	.velcss .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
		border:1px solid #97a8be85;
		vertical-align:middle;
	}
</style>



