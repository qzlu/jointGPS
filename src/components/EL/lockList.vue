<!-- content_header.vue -->
<template>
	<div class="container">
		<div class="modal fade carChoiselist" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
			 aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="myModalLabel" style="color: white">_选择设备_</h4>
					</div>
					<div class="modal-body">
						<el-input
							placeholder="_输入关键字_"
							v-model="filterText">
						</el-input>
						<el-tree
							class="filter-tree"
							:data="data3"
							:props="defaultProps"
							default-expand-all
							:render-content="renderContent"
							:filter-node-method="filterNode"
							@node-click="handleNodeClick"
							ref="tree2">
						</el-tree>
					</div>
					<!--
										<div class="modal-footer">
											&lt;!&ndash; <button type="button" class="btn btn-primary " data-dismiss="modal" >确定</button> &ndash;&gt;
										</div>
					-->
				</div>
			</div>
		</div>
	</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'FAssetID'
				}
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree2.filter(val);
			}
		},
		computed:{
			data3(){
				return this.$store.state.allLocksData;
			}
		},
		methods: {
			renderContent(h, { node, data, store }){
				return (
					<span>
						<span v-show={data.FAssetID.indexOf("@A")!=-1}>
							<i class="fa fa-home icon fa-lg"></i>
							<span>{data.FVehicleName}</span>
							<span style="margin-left:10px">[{data.count}]</span>
						</span>
						<span v-show={data.FAssetID.indexOf("@A")==-1}>
							<i class="fa fa-home icon fa-lock"></i>
							<span >{data.FAssetID}</span>
							<span class="sub-label" style="margin-left:10px" v-show={data.FVehicleName!=null}>({data.FVehicleName})
							</span>

						</span>
					</span>
				)
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.FAssetID.indexOf(value) !== -1;
			},
			handleNodeClick(data) {
				//console.log(data)
				var temp;
				var carId;
				if (data.FAssetID.indexOf("@A") === -1 && data.FAssetID.indexOf("@B") === -1 && data.FAssetID.indexOf("@C") === -1) {
					temp = data.FAssetID;
					carId = data.FAssetGUID;
					$('#modal').modal('hide')
				}
				this.$emit("child", [temp, carId]);
				//初始化搜索框,选完车辆后直接关闭
				this.filterText = ''
			},
//      getCheckedNodes() {
//        var nodeArr=this.$refs.tree2.getCheckedNodes();
//        var reg=/[\u4e00-\u9fa5_a-zA-Z0-9_]{7}/g;
//        var temp=[];
//        var carId=[];
//        $.each(nodeArr,function (index,obj) {
//          if(obj.label.match(reg)!=null){
//            temp.push(obj.label)
//            carId.push(obj.id)
//          }
//        })
//      },
		},
		mounted(){
			var _this = this;
			/* 模态框垂直居中,兼容小屏幕太向下的问题*/
			$('#modal').on('shown.bs.modal', function (e) {
				// 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
				$(this).css('display', 'block');
				var modalHeight = $(window).height() / 2 - $('#modal .modal-dialog').height() / 2;
				$(this).find('.modal-dialog').css({
					'margin-top': modalHeight
				});
			});
		},
	};
</script>

