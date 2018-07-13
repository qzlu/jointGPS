<template>
	<section style='height:100%'>
		<div class='velcss'>
			<el-dialog title='_集装箱详情_' :visible.sync="CdetailView" >
				<table class="table detailTable" style='table-layout:fixed;'>
		            <tbody>
			            <tr>
			               	<td colspan="2" rowspan="3" width="40%">
			                  	<img v-if="conDataTrans.FImage" :src="conDataTrans.FImage"  style='border:1px solid #ccc;display:inline-block;width:209px;height:117px;'>
			                  	<img v-else  src='/static/img/containerDetail.png' style='border:1px solid #ccc;display:inline-block;width:209px;height:117px;'></img>
			               	</td>
			               <td width="25%" class='likeHeader'><b>_箱号_</b></td>
			               <td width="35%">{{conDataTrans.FVehicleName}}</td>
			            </tr>
			            <tr>
			               	<td class='likeHeader'><b>_箱型_</b></td><td>{{conDataTrans.FVIN}}</td>
			            </tr>
		             	<tr>
			               	<td class='likeHeader'><b>_尺寸_</b></td><td>{{conDataTrans.FVehicleSerialCode}}</td>
			            </tr>
			            <tr style='height:44px'>
			               	<td class='likeHeader'><b>_状态_</b></td><td>{{conDataTrans.FStatus}}</td>
			               	<td class='likeHeader'><b>_邮箱_</b></td><td>{{conDataTrans.FEMailAddress}}</td>
			            </tr>
			            <tr style='height:44px'>
			               	<td class='likeHeader'><b>_联系方式_</b></td><td>{{conDataTrans.FTelephone}}</td>
			               	<td class='likeHeader'><b>_关联设备_</b></td><td>{{conDataTrans.FAssetID}}</td>
			            </tr>
			            <tr style='height:44px'>
			               <td class='likeHeader'><b>_描述_</b></td>
			               <td colspan="3" style='word-wrap:break-word'>{{conDataTrans.FDescription}}</td>
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
				conDataTrans:'',  //车辆详情数据
				CdetailView:false
				//imageUrl3:'',
			}
		},
		methods: {
			getConInfo(ID){
				var _this = this;
				let TokenID = this.$store.state.FTokenID;
				$.ajax({
					"url": "web/Common/Common_Admin",
					"cache": false,
					"async": true,
					"type": "post",
					"dataType": "json",
					"contentType": "application/json; charset=utf-8",
					"data": '{"FTokenID": "' + TokenID + '","FAction": "QueryAdminVehicleByFGUID","FVersion": "1.0.0","FGUID":"' + ID + '"}',
					success: function (data) {
						console.log('集装箱详情',data);
						_this.conData=_this.deepCopy(data.FObject[0]);
						_this.conDataTrans=_this.deepCopy(data.FObject[0]);
						_this.conDataTrans.FStatus=(_this.conDataTrans.FStatus)?'_启用_':'_禁用_';
						_this.CdetailView=true;
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



