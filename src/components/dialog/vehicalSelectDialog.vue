<!-- content_header.vue -->
<template>
	<div class="container">
		<div class="modal fade carChoiselist noCheckBox" id="modal" tabindex="-1" role="dialog"
			 aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="myModalLabel"  style="color: white">_选择车辆_/_箱号_</h4>
					</div>
					<div class="modal-body">
						<el-input
							placeholder="_输入关键字_"
							v-model="filterText">
						</el-input>
						<el-tree
							class="filter-tree"
							:data="data3"
							show-checkbox
							node-key="id"
							:props="defaultProps"
							:expand-on-click-node="false"
							:default-expanded-keys='data3[0]?[data3[0].id]:[]'
							:filter-node-method="filterNode"
							@node-click="handleNodeClick"
							:render-content="renderContent"
							ref="tree2">
						</el-tree>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary " data-dismiss="modal" @click="getCheckedNodes">
							_确定_
						</button>
					</div>
				</div><!-- /.modal-content -->
			</div><!-- /.modal -->
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
			},
		},
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				if (data.label) {
					return data.label.indexOf(value) !== -1;
				}
			},
			handleNodeClick(data){
				var nodeArr = this.$refs.tree2.getCheckedNodes();
				if (nodeArr.indexOf(data) == -1&&!data.disabled) {
					this.$refs.tree2.setChecked(data, true, true)
				} else {
					this.$refs.tree2.setChecked(data, false, true)
				}
			},
			getCheckedNodes() {
				var nodeArr = this.$refs.tree2.getCheckedNodes();
				var temp = [];
				var carId = [];
				if (nodeArr.length)
					$.each(nodeArr, function (index, obj) {
						if (obj.id.indexOf("@A") === -1 && obj.id.indexOf("@B") === -1 && obj.id.indexOf("@C") === -1) {
							temp.push(obj.label)
							carId.push(obj.id)
						}
					});
				this.$emit("child", [temp, carId])
				//初始化搜索框,选完车辆后直接关闭
				this.filterText = '';
				this.$refs.tree2.setCheckedKeys([])
			},
			//elementUI 树形结构将数据解析成html
			renderContent(h, { node, data, store }){
				try {
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
						<span style="margin-left:10px" v-show={data.id.indexOf("@")==-1&&data.subLabel&&data.label=="_未绑定车辆设备_"}>({data.subLabel})</span>
					</span>
				)
					
				} catch (error) {
					console.log(123)
				}
			},
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
			}
		}
	};
</script>
