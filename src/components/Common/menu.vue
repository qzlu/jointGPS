<template>
	<div class="PathInner" id="PathInner" v-drag>

		<div class="PathMain" id="PathMain">

			<div class="Tmain" @click="PathRun">

				<div class="rotate"><span class="cover"></span></div>

			</div>
			<div class="contextMenu" id="hotkeys">
				<ul>
					<li id="openthis">_编辑快捷键_</li>
				</ul>
			</div>

		</div>

		<div class="PathItem" v-for="item in hotkeys">
			<a class="link" @click="goRoute(item)" :title="item.tabsText">
				<span class="menu-img" :class="item.img"></span>
			</a>
		</div>
	</div>
</template>
<script>

    let _this=null
	export default {
		data() {
			_this=this
			return {
				Offset:50,   //偏移距离
				PathStatus: 1, //是否展开 0关闭 1展开
				isClick:true, //是不是点击事件
				isInLeft:true, //是不是在屏幕左侧
				hotkeys:[]
			}
		},
		computed: {
			allHotkeys:{
				get(){

					console.log("快捷键",_this.$store.state.hotkeys)
					return _this.$store.state.hotkeys;
					/*if(_this.$store.state.hotkeys===null || _this.$store.state.choiceSystemID==null) return []
					let arr=_this.$store.state.hotkeys[_this.$store.state.choiceSystemID];
					console.log("快捷菜单数据",arr)

					if(typeof arr ==="undefined"){
						return []
					}else{
						let data=[];
						if(arr.length!=0){
							arr.map(function (item,index) {
								let menuObj=_this.parseRouteMenu(item-0);
								data.push({
									tabsText:menuObj.name,
									router:menuObj.path,
									img:menuObj.imgClass
								})
							})
						}
						return data
					}
*/
					//  data 数据类型 [{tabsText:"_实时监控_",router:"/monitor",img:"moment_icn_pic"}]
				}
			},
			systemID:{
				get(){
					return _this.$store.state.choiceSystemID;
				}
			}

		},
		mounted(){
			if(window.localStorage.hotkeysPosition){
				let arr=JSON.parse(window.localStorage.hotkeysPosition)
				$("#PathInner").css({"left":arr[0]+"px","top":arr[1]+"px"})
			}
			$('div.contextMenu').hide();
			$("#PathMain").contextMenu('hotkeys', {
				bindings: {
					'openthis': function (t) {
						_this.$store.state.dialogHotkeys=true;
						_this.PathStatus=1;
						_this.PathRun();
					}

				}
			});
			let direction="+"
			if(!_this.isInLeft) direction="-";
			setTimeout(function () {
				$(".PathItem").map(function(index,item){
					$(item).css("left",direction+_this.Offset*(index+1)+"px")
				})
			},500)

		},
		methods: {
			//展开闭合快捷窗口
			PathRun(){
				//判断是不是click事件  防止drag后click
				if(!_this.isClick) return;
				let direction="+"
				if(!_this.isInLeft) direction="-";

				if(this.hotkeys.length===0) {
					_this.$store.state.dialogHotkeys=true;
					return
				}

				if(this.PathStatus===0){
					this.PathStatus=1;
					$(".PathItem").map(function(index,item){
						$(item).css("left",direction+_this.Offset*(index+1)+"px")
					})
				}else{
					this.PathStatus=0;
					$(".PathItem").map(function(index,item){
						$(item).css("left",0)
					})
				}
			},
			//跳转页面
			goRoute(data){
				this.$store.commit("changeRoute", data);
				this.$router.push(data.router)
			},
			gethotkeys(){
				console.log("快捷键1",_this.$store.state.hotkeys)
				console.log("系统类型1",_this.$store.state.choiceSystemID)
				if(_this.allHotkeys===null || _this.systemID==null) return []
				let arr=_this.allHotkeys[_this.systemID];
				console.log("快捷菜单数据",arr)

				if(typeof arr ==="undefined"){
					_this.hotkeys=[]
				}else{
					let data=[];
					if(arr.length!=0){
						arr.map(function (item,index) {
							let menuObj=_this.parseRouteMenu(item-0);
							data.push({
								tabsText:menuObj.name,
								router:menuObj.path,
								img:menuObj.imgClass
							})
						})
					}
					_this.hotkeys=data
				}
			}
		},
		directives: {
			drag: {
				inserted: function (el) {
					var oDiv = el;
					function getPoint(obj) { //获取某元素以浏览器左上角为原点的坐标
						var t = obj.offsetTop; //获取该元素对应父容器的上边距
						var l = obj.offsetLeft; //对应父容器的上边距
						//判断是否有父容器，如果存在则累加其边距
						while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
							t += obj.offsetTop; //叠加父容器的上边距
							l += obj.offsetLeft; //叠加父容器的左边距
						}
						return {top: t, left: l}
					}

					oDiv.onmousedown = function (ev) {
						ev = ev || window.event; //兼容性
						ev.preventDefault();
						var oscrolltop = window.scrollTop;  //定义滚动条高度    并顾忌兼容性
						var disx = ev.clientX - getPoint(oDiv).left;    //鼠标点击点击时 在DIV上X轴到DIV左侧距离 = 鼠标x坐标 - DIV左侧至屏幕左侧距离
						var disy = ev.clientY - getPoint(oDiv).top;
						var w = oDiv.offsetWidth;
						var h = oDiv.offsetHeight;
						var W=document.body.clientWidth;
						var H=document.body.clientHeight;
						document.onmousemove = function (ev) {
							setTimeout(function () {
								_this.isClick=false;
							},100)

							ev = ev || window.event;
							var x = ev.clientX - disx ;   //DIVx坐标=鼠标x坐标-鼠标点击点击时 在DIV上X轴到DIV左侧距离
							var y = ev.clientY - disy ;
							//限制DIV在浏览器屏幕中移动
							if (x < 0) {
								x = 0;
							}
							if (x > W-w) {
								x = W-w;
							}
							if (y < 0) {          //此处Y最小应等于滚动条高度，适配网页中所有位置
								y = 0;
							}
							if (y >H-h) {
								y = H-h;
							}

							//判断点是不是在屏幕左侧
							if(x<=W/2-w){
								_this.isInLeft=true;
							}else{
								_this.isInLeft=false;
							}


							oDiv.style.left = x + 'px';   //确定DIV的  left值 和top值
							oDiv.style.top = y + 'px';

							window.localStorage.hotkeysPosition=JSON.stringify([x,y])
						}

						document.onmouseup = function () {
							document.onmousemove = null;
							document.onmouseup = null;
							setTimeout(function () {
								_this.isClick=true;
							},100)
						};

					};


				}
			},
		}
	}
</script>
<style>

	.PathInner {
		position:absolute;
		z-index:1050;
		width:60px;
		height:60px;
		top:550px;
		left:0px
	}

	.PathInner .PathItem {
		position:absolute;
		left:0;
		bottom:0;
		transition:all .5s;
	}

	.PathInner a { /* position:absolute; */
		display:block; /* overflow:hidden; */
		background-position:center;
		background-repeat:no-repeat;
		z-index:999;
	}

	.rotate {
		width:100%;
		height:100%;
		background-position:center;
		background-repeat:no-repeat;
		display:block;
		overflow:hidden;
		text-align:center;
		vertical-align:middle;
		position:absolute;
	}

	.PathInner .PathMain {
		z-index:1000;
		position:absolute;
		display:block; /* overflow:hidden; */
		background-position:center;
		background-repeat:no-repeat;
		bottom:0;
		left:0;
	}

	.PathInner .PathMain .Tmain {
		background-image:url(/static/img/menu/bg-2x.png);
		width:60px;
		height:60px;
	}

	.PathInner .PathMain .Tmain .rotate {
		background-image:url(/static/img/menu/icon-2x.png);
		-moz-transform:rotate(0deg);
		position:absolute;
		bottom:0;
		left:0;
	}

	.PathInner .cover {
		width:100%;
		height:100%;
		display:block;
		background:url(/static/img/menu/bg-hl-2x.png) center no-repeat;
		cursor:pointer;
		*filter:alpha(opacity=0);
		filter:alpha(opacity=0) \0;
		opacity:0;
		-webkit-transition:opacity .2s ease-out;
		-moz-transition:opacity .2s ease-out;
		-ms-transition:opacity .2s ease-out;
		-o-transition:opacity .2s ease-out;
	}

	.PathInner .cover:hover {
		opacity:0.2;
		*filter:alpha(opacity=20);
		filter:alpha(opacity=20) \0;
	}

	.PathItem .link {
		position:absolute;
		bottom:0;
		left:0;
		width:60px;
		height:60px;
		background-image:url(/static/img/menu/bg-item-2x.png);
	}

	.menu-img {
		position:absolute;
		width:40px;
		height:40px;
		display:block;
		top:9px;
		left:10px;
		overflow:hidden;
		text-align:center;
		vertical-align:middle;
		background-image:url(/static/img/menu/menu-list.png);
		background-repeat:no-repeat;
		background-position:-20px -20px;
	}


	.metaicondetail {
		background:#fff;
		color:#fff;
		border-radius:6px;
		border:1px #333 solid;
		min-width:100px;
		max-width:300px;
		overflow:hidden;
		text-align:center;
		position:absolute;
		display:none;
		top:-115px;
		left:-22px;
	}

	.metaicondetail .inner {
		border:2px #fff solid;
		border-radius:6px;
		background:#272727;
		font-size:14px;
		padding:5px;
	}

	.metaicondetail span {
		font-family:candara, arail;
		font-size:18px;
	}

	.metaicondetail s {
		border-color:#333 transparent transparent;
		border-style:solid dashed dashed;
		border-width:5px;
		clear:both;
		display:inline-block;
		font-size:0;
		height:0;
		margin-left:3px;
		overflow:hidden;
		position:absolute;
		right:50%;
		top:44px;
		width:0;
	}

</style>
