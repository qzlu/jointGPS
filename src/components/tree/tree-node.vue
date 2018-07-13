<template>
	<ul>
		<li v-for='(item, index) in nodeData'
			v-show="item.visible"
			:class="[(item.children && item.children.length > 0) ? '':'leaf']">

			<i v-if="item.children && item.children.length > 0" @click.stop='handleNodeExpand(item)'
			   :class="[item.open? 'tree-open':'tree-close','icon']">
			</i>
			<div v-show="options.showCheckbox && options.halfCheckedStatus"
				 class="inputCheck" :class="{notAllNodes:item.nodeSelectNotAll}"
				 :style="{width:inputWidth+'px', height:inputWidth+'px'}" @click="walkCheckBox(item)">
				<input type="checkbox" class="check" v-model='item.checked' @change="handlecheckedChange(item)"
					   v-if="options.showCheckbox && options.halfCheckedStatus  &&  !item.nodeSelectNotAll"/>
			</div>
			<span @click="handleNode(item)" :class="{'node-selected':(item.checked && !options.showCheckbox) || item.searched }"
				  draggable='true' @dragstart='dragStart' @dragover='dragOver' @dragenter='dragEnter' @dragleave='dragLeave'
				  @drop='drop' @dragend='dragEnd'  @mouseover='mouseOver' @mouseout='mouseOut'>

				<!--公司 车队 车辆 电子锁图标-->
				<i v-if="item.iconType!=3" class="fa" :class="{'fa-home fa-lg':getIconType(item)===1,
					   'fa-flag-checkered ':getIconType(item)===2}"></i>
				<!--围栏图标-->
				<i v-if="item.iconType==3" class="img-fence fence-icon" :class="'fencetype-icon'+item.icon"></i>


				<span class="txt-label" :class="{'txt-company':item.rootType=='1','txt-carTeam':item.rootType=='2'}">{{item.label}}</span>
				<!--围栏类型 编辑 删除 颜色展示 图标-->
				<span v-if="item.iconType===3" class="fence-lable">
					<i class="color-box" :style="{borderColor:item.strokeColor,backgroundColor:item.fillColor}"></i>
				    <i class="fa fa-edit fa-lg text-blue tree-redact" @click.stop="redactFenceType(item)" title="_编辑_"></i>
				    <i class="fa fa-trash fa-lg text-red tree-delete"  @click.stop="deleteFenceType(item.id)" title="_删除_"></i>
				</span>

				<!--围栏 编辑 删除-->
				<span v-if="item.iconType===2" class="fence-lable">
					<i class="bing_fence" @click="fenceConfig(item.id)"></i>
					<i class="color-box img-fence fence-icon" :class="'fencetype-icon'+item.icon"></i>
				    <i class="fa fa-edit fa-lg text-blue tree-redact" @click="redactFence" title="_编辑_"></i>
				    <i class="fa fa-trash fa-lg text-red tree-delete"  @click="deleteFence(item.id)" title="_删除_"></i>
				</span>

				<!--围栏分组 编辑 删除-->
				<span v-if="item.iconType===4&&item.id!=='none'" class="fence-lable">
				    <i class="fa fa-edit fa-lg text-blue tree-redact" @click.stop="redactFenceTeam(item.id)" title="_编辑_"></i>
				    <i class="fa fa-trash fa-lg text-red tree-delete"  @click.stop="deleteFenceTeam(item.id)" title="_删除_"></i>
				</span>
				

				<!--数据副label-->
				<span class="sub-label" v-if="item.subLabel&&item.subLabel!=null">【{{item.subLabel}}】</span>
				<!--公司和车队 车辆数-->
				<span v-if="item.count!=null">【{{item.count}}】</span>
				<!--新建围栏类型-->
				<i v-if="getIconType(item)===3" @click.stop="addFenceType" class="fa fa-plus-square-o fa-lg text-blue" ></i>
				<!--新建围栏分组-->
				<i v-if="getIconType(item)===4" @click.stop="addFenceTeam" class="fa fa-plus-square-o fa-lg text-blue" ></i>
				<!--车辆设备状态图标-->
				<span v-if="item.iconType===1">
					<i v-show="item.IsConfigFuel==1" class="img-icon carChoiceList-icon ChoiceListIcon-0a"
					   title="_有油位设备_"></i>
					<i v-show="item.FVideo==1 || item.FVideo==2" class="img-icon carChoiceList-icon"
					   :class="{'ChoiceListIcon-1a':item.FVideo==1,'ChoiceListIcon-1b':item.FVideo==2}"
					   :title="item.FVideo==1?'_摄像头正常_':'_摄像头异常_'"></i>
					<i v-show="item.FTHS==1 || item.FTHS==2" class="img-icon carChoiceList-icon"
					   :class="{'ChoiceListIcon-2a':item.FTHS==1,'ChoiceListIcon-2b':item.FTHS==2}"
					   :title="item.FTHS==1?'_温湿度正常_':'_温湿度 异常_'"></i>
					<i v-show="item.FCamera==1 || item.FCamera==2" class="img-icon carChoiceList-icon"
					   :class="{'ChoiceListIcon-3a':item.FCamera==1,'ChoiceListIcon-3b':item.FCamera==2}"
					   :title="item.FCamera==1?'_视频监控正常_':'_视频监控异常_'"></i>
					<i v-show="item.FRFID==1 || item.FRFID==2" class="img-icon carChoiceList-icon"
					   :class="{'ChoiceListIcon-4a':item.FRFID==1,'ChoiceListIcon-4b':item.FRFID==2}"
					   :title="item.FRFID==1?'_RFID刷卡正常_':'_RFID刷卡异常_'"></i>
					<i v-show="item.FTPMS==1 || item.FTPMS==2" class="img-icon carChoiceList-icon"
					   :class="{'ChoiceListIcon-5a':item.FTPMS==1,'ChoiceListIcon-5b':item.FTPMS==2}"
					   :title="item.FTPMS==1?'_胎温胎压正常_':'_胎温胎压异常_'"></i>
					<i v-show="item.FScreen==1 || item.FScreen==2" class="img-icon carChoiceList-icon"
					   :class="{'ChoiceListIcon-6a':item.FScreen==1,'ChoiceListIcon-6b':item.FScreen==2}"
					   :title="item.FScreen==1?'_调度屏正常_':'_调度屏异常_'"></i>
				</span>
				

			</span>
			<tree-node v-if="item.children && item.children.length > 0"
					   :options="options"
					   @handlecheckedChange="handlecheckedChange"
					   @deleteFenceType="deleteFenceType"
					   @redactFenceType="redactFenceType"
					   @deleteFence="deleteFence"
					   @redactFence="redactFence"
					   @deleteFenceTeam="deleteFenceTeam"
					   @redactFenceTeam="redactFenceTeam"
					   @fenceConfig="fenceConfig"
					   v-show='item.open'
					   :tree-data="item.children">
			</tree-node>
		</li>
	</ul>
</template>
<script>
	export default {
		name: 'treeNode',
		props: {
			treeData: [Array],
			options: [Object]
		},
		data () {
			return {
				nodeData: []
			}
		},
		created () {
			const parent = this.$parent
			if (parent.isTree) {
				this.tree = parent
			} else {
				this.tree = parent.tree
			}

			const tree = this.tree
			if (!tree) {
				console.warn('找不到树节点')
			}
			this.nodeData = (this.treeData || []).slice(0)
		},
		computed: {
			inputWidth: function () {
				if (this.checkFirfox()) {
					return 13
				}
				return 13
			}
		},
		watch: {
			treeData: function (data) {
				this.nodeData = (data || []).slice(0)
			}
		},
		methods: {
			//获得图标类型
			getIconType(obj){
				let id = obj.id;
				if (id.indexOf("@A") != -1) return 1; //设备列表home图标
				if (id.indexOf("@C") != -1) return 2; //分组类型
				if (id.indexOf("@E") != -1) return 3; //围栏类型home类型
				if (id.indexOf("@F") != -1) return 4; //围栏分组home类型
				if (obj.iconType === 4) return 2; //分组类型
				return -1;

			},
			checkFirfox(){
				let u = navigator.userAgent
				if (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1) {
					return true
				}
				return false
			},
			walkCheckBox(node){
				if (node.nodeSelectNotAll) {
					node.checked = !node.checked
					this.handlecheckedChange(node)
				}
			},
			handleNodeExpand (node) {
				node.open = !node.open
			},
			handlecheckedChange (node) {
				this.$emit('handlecheckedChange', node)
			},
			handleNode (node) {
				if (this.tree.options.showCheckbox) {
					node.checked = !node.checked;
					this.$emit('handlecheckedChange', node)
				} else {                            //单选状态下  点击lable
					if (this.tree.store.last) {
						if (this.tree.store.last.id === node.id) {
							this.tree.store.last.checked = !this.tree.store.last.checked
						} else {
							this.tree.store.last.checked = false
							node.checked = true
							this.tree.store.last = node
						}
					} else {
						this.tree.store.last = node
						node.checked = true
					}
					this.tree.$emit('node-click', node);
				}

			},
			//增加围栏类型
			addFenceType (){
				this.$emit('addFenceType')
	        },
			//增加围栏分组
			addFenceTeam (){
				this.$emit('addFenceTeam')
	        },
            //删除围栏类型
			deleteFenceType (ID){
				this.$emit('deleteFenceType',ID)
			},
			//编辑围栏类型
			redactFenceType (data){
				this.$emit('redactFenceType',data)
			},
			//删除围栏类型
			deleteFence (ID){
				this.$emit('deleteFence',ID)
			},
			//编辑围栏类型
			redactFence (){
				setTimeout(() => {
					this.$emit('redactFence')
				}, 100);
			},
			//删除围栏分组
			deleteFenceTeam (ID){
				this.$emit('deleteFenceTeam',ID)
			},
			//编辑围栏分组
			redactFenceTeam (ID){
				this.$emit('redactFenceTeam',ID)
			},
			// [配置围栏]
			fenceConfig(ID){
				this.$emit('fenceConfig',ID)
			},

			dragStart(){
				console.log(1111)
			},
			dragOver(){},
			dragEnter(){},
			dragLeave(){},

			dragEnd(e) {
			},
			drop(e) {
				// toData = this.model
				// e.target.style.background = '#7B1FA2'
			},
			mouseOver(e) {
/*
				if ((this.styleObj.background != '#99A9BF' || this.styleObj.background != this.hightlightColor) && e.target.className === 'treeNodeText') {
					e.target.style.background = this.hoverColor ? this.hoverColor : '#E5E9F2'
				}
*/
			},
			mouseOut(e) {
/*
				if ((this.styleObj.background != '#99A9BF' || this.styleObj.background != this.hightlightColor) && e.target.className === 'treeNodeText') {
					e.target.style.background = 'white'
				}
*/
			}


		}
	}
</script>
<style>
	li:hover {
		cursor:pointer;
	}

	.icon {
		width:14px;
		height:14px;
		display:inline-block;
		margin-right:10px;
		vertical-align:middle;
	}

	.halo-tree {
		font-size:14px;
		min-height:20px;
/*
		-webkit-border-radius:4px;
		-moz-border-radius:4px;
		border-radius:4px;
*/
	}

	.node-selected {
		background-color:#ddd;
	}
	.halo-tree .label{
		color:#666;
	}
	.halo-tree .txt-company{
		color:#000;
	}
	.halo-tree .txt-carTeam{
		color:#333;
	}

	.sub-label{
		font-size:12px;
		color:#005fc6;
	}
	.halo-tree li {
		line-height:15px;
		position:relative;
	}

	.halo-tree li > span,
	.halo-tree li > i,
	.halo-tree li > a {
		vertical-align:middle;
	}

	.halo-tree ul ul li:hover {
		background:rgba(0,95,198, .1)
	}

	.halo-tree li:after,
	.halo-tree li:before {
		content:'';
		position:absolute;
		left:-8px;
		z-index:-1;
		right:auto;
		border-width:1px
	}

	.halo-tree li:before {
		border-left:1px dashed #999;
		bottom:50px;
		height:100%;
		top:-12px;
		width:1px;
	}

	.halo-tree li:after {
		border-top:1px dashed #999;
		height:20px;
		top:14px;
		width:12px
	}

	.halo-tree li span {
		display:inline-block;
		padding:4px 0 4px 2px;
		text-decoration:none;
		border-radius:3px;
	}

	.halo-tree li:last-child::before {
		height:26px
	}

	.halo-tree > ul {
		padding-left:0
	}

	.halo-tree ul ul {
		padding-left:15px;
	}

	.halo-tree li.leaf {
		padding-left:4px;
	}

	.halo-tree li.leaf:after {
		content:'';
		left:-8px;
		position:absolute;
		right:auto;
		border-width:1px;
		border-top:1px dashed #999;
		height:20px;
		top:14px;
		width:12px;
	}

	.check {
		display:inline-block;
		position:relative;
		top:4px;
	}

	.halo-tree .icon {
		margin-right:0;
	}

	.halo-tree .tree-close {
		background-size:cover;
		background-image:url("/static/img/treeOpen-1.png");
	}

	.halo-tree .tree-open {
		background-size:cover;
		background-image:url("/static/img/treeClose-2.png");
	}

	.halo-tree .search {
		width:10px;
		height:10px;
		background-size:cover;
		background-image:url("/static/img/search.png");
	}

	.check.notAllNodes {
		-webkit-appearance:none;
		-moz-appearance:none;
		-ms-appearance:none;
		width:13px;
	}

	.inputCheck {
		display:inline-block;
		position:relative;
	}

	.inputCheck.notAllNodes:before {
		content:"";
		display:inline-block;
		position:absolute;
		width:100%;
		height:100%;
		z-index:10;
		top:50%;
		left:50%;
		transform:translate3d(-50%, -20%, 0);
		/*background-image: url("/../../assets/img/half.png");*/
		background-image:url("../../../static/img/half.jpg");
	}

	.carChoiceList-icon {
		display:inline-block;
		width:14px;
		height:14px;
	}

	.ChoiceListIcon-0a {background-position:1px -174px}
	.ChoiceListIcon-1a {background-position:-13px -174px}
	.ChoiceListIcon-2a {background-position:-27px -174px}
	.ChoiceListIcon-3a {background-position:-41px -174px}
	.ChoiceListIcon-4a {background-position:-55px -174px}
	.ChoiceListIcon-5a {background-position:-69px -174px}
	.ChoiceListIcon-6a {background-position:-83px -174px}

	.ChoiceListIcon-0b {background-position:1px -160px}
	.ChoiceListIcon-1b {background-position:-13px -160px}
	.ChoiceListIcon-2b {background-position:-27px -160px}
	.ChoiceListIcon-3b {background-position:-41px -160px}
	.ChoiceListIcon-4b {background-position:-55px -160px}
	.ChoiceListIcon-5b {background-position:-69px -160px}
	.ChoiceListIcon-6b {background-position:-83px -160px}

	/*围栏相关 样式*/
	.fence-icon{
		float:left;
		width: 24px;
		height: 24px;
		border: none;
	}

	.fence-lable {
		padding: 0!important;
		float:right;
	}
	.tree-redact{
		position:absolute;
		top:12px;
		right:58px;
	}
	.tree-delete{
		position:absolute;
		top:10px;
		right:36px;
	}
	.bing_fence{
		position: absolute;
		top: 6px;
		right: 84px;
		width: 24px;
		height: 24px;
		background: url("/static/img/LBS/bing_fence.png") no-repeat;
	}
</style>
