<!-- content_header.vue -->
<template>
	<div class="container">
		<div class="modal fade carChoiselist" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="z-index:20017;"
			 aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="myModalLabel" v-if="SystemID===2||SystemID===7" style="color: white">_选择设备_</h4>
						<h4 class="modal-title" id="myModalLabel" v-else-if="SystemID===6" style="color: white">_选择箱号_</h4>
						<h4 class="modal-title" id="myModalLabel" v-else style="color: white">_选择车辆_</h4>
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
							node-key="id"
							:default-expanded-keys='data3[0]?[data3[0].id]:[]'
							:filter-node-method="filterNode"
							@node-click="handleNodeClick"
							:render-content="renderContent"
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
					label: 'label'
				}
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree2.filter(val);
			}
		},

		methods: {
			filterNode(value, data) {
				if (!value) return true;
				if(data.label){
				  return data.label.indexOf(value) !== -1;
				}
			},
			handleNodeClick(data) {
				//console.log(data)
				var temp;
				var carId;
				if(data.id.indexOf("@A")===-1 && data.id.indexOf("@B")===-1 && data.id.indexOf("@C")===-1){
					temp = data.label;
					carId = data.id;
					console.log("所选车辆ID",carId);
					$('#modal').modal('hide')
				}
				this.$emit("child", [temp, carId]);
				//初始化搜索框,选完车辆后直接关闭
				this.filterText = ''
			},
			//elementUI 树形结构将数据解析成html
			renderContent(h, { node, data, store }){
				return (
					<span>
						<i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A")!=-1}></i>
						<i class="fa fa-building icon" v-show={data.id.indexOf("@B")!=-1}></i>
						<i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C")!=-1}></i>
						<i class="fa fa-truck icon"
						   v-show={data.id.indexOf("@B")==-1&data.id.indexOf("@A")==-1&data.id.indexOf("@C")==-1}></i>
						{node.label}
						<span style="margin-left:10px"
							  v-show={data.id.indexOf("@B")!=-1||data.id.indexOf("@A")!=-1||data.id.indexOf("@C")!=-1}>
							({data.count})
						</span>
					</span>
				)
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
			//获取所有车辆列表
			if (this.$store.state.allCarsList == null) {
				this.$store.commit('getAllCarsData')
			}
		},
		computed:{
			data3:{
				get(){
					return this.$store.state.allCarsData;
				}
			},
			SystemID(){
				return this.$store.state.choiceSystemID;
			}
		}
	};
</script>
