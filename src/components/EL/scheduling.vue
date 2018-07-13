<template>
  <section class="bg-white">
      <div class="taskCount">
          <span>_任务总数_:{{totalCount.FTripCount?totalCount.FTripCount:'--'}}</span>
          <span>_配送点总数_:{{totalCount.FAllAgentCodeCount?totalCount.FAllAgentCodeCount:'--'}}</span>
          <span>_绿通开锁次数_:{{totalCount.FGreenOpenLockCount?totalCount.FGreenOpenLockCount:'--'}}</span>
          <span>_其他开锁次数_:{{totalCount.FOtherOpenLockCount?totalCount.FOtherOpenLockCount:'--'}}</span>
          <span>_已配送点_:{{totalCount.FAllFinishCount?totalCount.FAllFinishCount:'--'}}</span>
          <span>_待配送点_:{{totalCount.FAllAgentCodeCount-totalCount.FAllFinishCount}}</span>
          <!-- <span>_平均配送时间_:{{aTime}}</span> -->
          <div class="search-input">
            <i class="fa fa-search"></i>   
            <el-input
                placeholder="_请输入关键字_"
                v-model="searchKey"
                clearable>
            </el-input>              
          </div>
      </div>
      <div class="taskList">
        <!-- <div class="panel panel-default list" v-for="(item,index) in totalJobArr">
			<div class="panel-heading " >
				<span class="circle">{{index+1}}</span>{{item.FCargoName}}
			</div>
			<div class="panel-body">
                <el-collapse v-model="activeNames">
                    <el-collapse-item :name="index">
                        <template slot="title" class="slotTitle">
                            <ul>
                                <li><span>_发货时间_:</span>{{item.FDeliveryTime}}</li>
                                <li><span>_设备ID_:</span>{{item.FAssetID}}</li>
                                <li><span>_车牌_:</span>{{item.FVehicleName}}</li>
                                <li><span>_当前进度_:</span>{{item.FinishProgress}}</li>
                                <li><span>_下一站_:</span>{{item.FNextAgentCode}}</li>
                                <li><span>_预计到达时间_:</span></li>
                            </ul>                        
                        </template>
                        <ul class="FCargoInfo">
                            <li><span class="circle">{{index+1}}</span><span>_订单号_:</span>{{item.FCargoCode}}</li>
                            <li><span>_设备ID_:</span>{{item.FAssetID}}</li>
                            <li><span>_车牌_:</span>{{item.FVehicleName}}</li>
                            <li><span>_货物简称_:</span>{{item.FCargoName}}</li>
                            <li><span>_承运人_:</span>{{item.FCargoCode}}</li>
                            <li><span>_司机_:</span>{{item.FCargoCode}}</li>
                            <li><span>_电话_:</span>{{item.FCargoCode}}</li>
                        </ul>
                        <div class="car_scheduling" >
                            {{item.FVehicleName}}
                        </div>
                        <el-steps :active="item.aa+1" finish-status="finish">
                        <el-step >
                            <template slot="icon">
                                <div class="startIcon">
                                    <img src="/static/img/home.png" alt="">
                                </div>
                            </template>
                        </el-step>
                        <el-step  v-for="step in item.num" >
                             <template slot="icon">
                                <div>
                                   {{step}}
                                </div>
                            </template>
                            <template slot="title">
                                <el-popover
                                placement="top"
                                width="200"
                                trigger="click"
                                >
                                <div>
                                    <ul>
                                        <li><span>_门店名称_:</span></li>
                                        <li><span>_收货人_:</span></li>
                                        <li><span>_收货人电话_:</span></li>
                                        <li><span>_收货时间_:</span></li>
                                        <li><span>_耗时_:</span></li>
                                        <li><span>_承运人_:</span></li>
                                        <li><span>_开锁_:</span></li>
                                        <li><span>_卸货信息_:</span></li>
                                        <li><span>_地址_:</span></li>
                                    </ul>
                                </div>
                                <div class="tooltipBlock" :class="{unFinsh:step>(item.aa)}" slot="reference">{{item.FNextAgentCode}}</div>
                                </el-popover>                               
                                <div class="triangle" :class="{unFinshTriangle:step>(item.aa)}"></div>                                    
                            </template>    
                        </el-step>
                        </el-steps>
                    </el-collapse-item>  
                </el-collapse>             
			</div>
		</div> -->
        <transition-group name="list" tag="p">
            <div v-for="(item,index) in arr" v-bind:key="item.FGUID">
                <div class="panel-body list">
                            <div style="height:50px;padding-top:10px">
                                <ul class="FCargoInfo" style="float:left;">
                                    <li style="width:15%" :title="item.TripDetailList.Table1[0].FCargoCode"><nobr><span class="circle">{{item.RowNo}}</span><span>_订单号_:</span>{{item.TripDetailList.Table1[0].FCargoCode?item.TripDetailList.Table1[0].FCargoCode:'--'}}</nobr></li>
                                    <li style="width:14%" :title="item.FAssetID"><nobr><span>_设备_ID:</span>{{item.FAssetID}}</nobr></li>
                                    <li style="width:12%" :title="item.TripDetailList.Table1[0].FVehicleName"><nobr><span>_车牌_:</span>{{item.TripDetailList.Table1[0].FVehicleName?item.TripDetailList.Table1[0].FVehicleName:'--'}}</nobr></li>
                                    <li style="width:12%" :title="item.TripDetailList.Table1[0].FCargoName"><nobr><span>_货物简称_:</span>{{item.TripDetailList.Table1[0].FCargoName?item.TripDetailList.Table1[0].FCargoName:'--'}}</nobr></li>
                                    <li style="width:11%" :title="item.TripDetailList.Table1[0].FCarrier"><nobr><span>_承运商_:</span>{{item.TripDetailList.Table1[0].FCarrier?item.TripDetailList.Table1[0].FCarrier:'--'}}</nobr></li>
                                    <li style="width:11%" :title="item.TripDetailList.Table1[0].FDriverName"><nobr><span>_司机_:</span>{{item.TripDetailList.Table1[0].FDriverName?item.TripDetailList.Table1[0].FDriverName:'--'}}</nobr></li>
                                    <li style="width:15%" :title="item.TripDetailList.Table1[0].FDriverPhone"><nobr><span>_司机电话_:</span>{{item.TripDetailList.Table1[0].FDriverPhone?item.TripDetailList.Table1[0].FDriverPhone:'--'}}</nobr></li>
<!--                                     <li><span>_当前位置_:</span>{{item.TripDetailList.Table1[0].curPosition}}</li>
                                    <li><span>_最后定位时间_:</span>{{item.TripDetailList.Table1[0].FNowGPSDateTime}}</li> -->
                                </ul>
                                <div style="float:right;margin-right:20px;margin-top:-10px;width:2%">
                                    <a style="font-size:24px" @click="hide(item,index)"><span class="fa fa-minus"></span></a>
                                </div>
                            </div>
                            <div>
                                <div class="car_scheduling" >
                                    <div  :class="{'left-60':item.TripDetailList.Table1[0].left=='100%'}">
                                        <span style="display:inline-block;width:58px;overflow:hidden;text-overflow: ellipsis;" :title="item.TripDetailList.Table1[0].FVehicleName">
                                            <nobr>
                                                {{item.TripDetailList.Table1[0].FVehicleName}}
                                            </nobr>
                                        </span>
                                    </div>
                                </div>
                                <my-steps :active="item.TripDetailList.Table1[0].active" finish-status="finish" >
                                    <my-step :styles="item.TripDetailList.Table1[0].width" :width="item.TripDetailList.Table1[0].progress">
                                        <template slot="icon">
                                            <div class="startIcon">
                                                <img src="/static/img/dispatching/origin.png" alt="" width="50" height="50">
                                            </div>
                                        </template>
                                    </my-step>
                                    <my-step  v-for="(step,index) in item.TripDetailList.Table" v-if="step.FIndex" :styles="step.width" :width="step.progress">
                                        <template slot="icon">
                                            <div style="cursor:pointer" @click="step.show=!step.show" >
                                            {{step.FIndex}}
                                            </div>
                                        </template>
                                        <template slot="title">
                                            <el-popover
                                            placement="top"
                                            width="200"
                                            v-if="step.show"
                                            trigger="click"
                                            >
                                                <div>
                                                    <ul class="infoDetail">
                                                        <li :title="step.FStoreName"><nobr><span>_门店名称_:<b>{{step.FStoreName&&step.FStoreName!='绿通开锁'?step.FStoreName:'--'}}</b></span></nobr></li>
                                                        <li><span>_收货人_:<b>{{step.FContacts?step.FContacts:'--'}}</b></span></li>
                                                        <li><span>_收货人电话_:<b>{{step.FTelephone?step.FTelephone:'--'}}</b></span></li>
                                                        <li v-if="step.FStoreName=='绿通开锁'"><span>_开锁时间_:<b>{{step.FIsFinish?step.FOpenLockTime:"--"}}</b></span></li>
                                                        <li v-if="step.FStoreName!='绿通开锁'" :title="step.FOpenLockTime"><nobr><span>_收货时间_:<b>{{step.FIsFinish?step.FOpenLockTime:"--"}}</b></span></nobr></li>
                                                        <li><span>_耗时_:<b>{{step.times?step.times:'--'}}</b></span></li>
                                                        <li><span>_承运商_:<b>{{item.TripDetailList.Table1[0].FCarrier?item.TripDetailList.Table1[0].FCarrier:'--'}}</b></span></li>
                                                        <li><span>_开锁_:<b>{{step.FOpenType?step.FOpenType:'--'}}</b></span></li>
                                                        <li :title="step.FDischargeCargo"><nobr><span>_卸货信息_:<b>{{step.FDischargeCargo?step.FDischargeCargo:'--'}}</b></span></nobr></li>
                                                        <li :title="step.FAddress"><nobr><span>_地址_:<b>{{step.FAddress?step.FAddress:'--'}}</b></span></nobr></li>
                                                    </ul>
                                                </div>
                                                <div class="tooltipBlock" :class="{unFinsh:!step.FIsFinish,GreenOpenLock:step.FStoreName=='绿通开锁',nextAgent:item.TripDetailList.Table1[0].FNextAgentCode==step.FStoreName}" slot="reference" >{{step.FStoreName}}<span v-if="item.TripDetailList.Table1[0].FNextAgentCode==step.FStoreName">({{item.TripDetailList.Table1[0].time?"预计"+item.TripDetailList.Table1[0].time+"内到达":null}})</span></div>
                                            </el-popover>                               
                                            <div class="triangle" :class="{unFinshTriangle:!step.FIsFinish,green:step.FStoreName=='绿通开锁'}" v-if="step.show"></div>                                    
                                        </template>
                                        <template slot="description" >
                                                <div class="GreenOpenLock" :style="{left:step.left}" v-if="step.greenTable.length"> 
                                                    <el-popover placement="top" trigger="click" >
                                                        <ul>
                                                            <li v-for="i in step.greenTable" :class="{GreenOpenLockInfo:step.greenTable.length>1}" class="openLockInfo">
                                                                <p>时间:{{i.FOpenLockTime}}</p>
                                                                <p :title="i.FDischargeCargo"><nobr><span>卸货信息:{{i.FDischargeCargo}}</span></nobr></p>
                                                                <p :title="i.openLockAdress"><nobr>位置:{{i.openLockAdress}}</nobr></p>
                                                            </li>
                                                        </ul>
                                                        <a slot="reference" class="greenOpenLockImg"></a>
                                                    </el-popover>  
                                                    <el-badge :value="step.otherTable.length" :class="{r32:item.FNextAgentCode==step.FStoreName}" v-if="step.otherTable.length">
                                                        <el-popover placement="top" trigger="click">
                                                            <h3>【其他开锁】</h3>
                                                            <ul>
                                                                <li v-for="i in step.otherTable" :class="{GreenOpenLockInfo:step.otherTable.length>1}" class="openLockInfo">
                                                                    <p>时间:{{i.FOpenLockTime}}</p>
                                                                    <p :title="i.FDischargeCargo"><nobr><span>卸货信息:{{i.FDischargeCargo}}</span></nobr></p>
                                                                    <p :title="i.openLockAdress"><nobr>位置:{{i.openLockAdress}}</nobr></p>
                                                                </li>
                                                            </ul>
                                                            <a slot="reference" class="otherOpenLockImg"></a>
                                                        </el-popover>  
                                                    </el-badge>
                                                </div>
                                        </template>    
                                    </my-step>
                                </my-steps>    
                            </div>
                </div>
            </div>z
        </transition-group>
      </div>
        <div class="cardList">
            <transition-group name="flip-list" tag="ul">
                <div class="card" v-for="(item,index) in totalJobArr" v-bind:key="item.FGUID">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <span class="circle">{{item.RowNo}}</span>{{item.FCargoName}}
                        </div>
                        <div class="panel-body">
                            <ul>
                                    <li><span>_发货时间_:</span>{{item.FDeliveryTime}}</li>
                                    <li><span>_设备_ID:</span>{{item.FAssetID}}</li>
                                    <li><span>_车牌_:</span>{{item.FVehicleName}}</li>
                                    <li><span>_当前进度_:</span>{{item.FFinishProgress}}</li>
                                    <li><span>_下一站_:</span>{{item.FNextAgentCode}}</li>
                                    <li><span>_预计到达时间_:{{item.time?item.time+"内到达":null}}</span></li>
                            </ul> 
                            <el-button @click="detail(item,index)">展开</el-button>                       
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
        <div id="allmap"></div>
  </section>
</template>
<script>
import mySteps from "./mySteps.vue";
import myStep from "./myStep.vue";
let _this;
export default {
    data(){
        _this=this;
        return{
            //统计数据
            totalCount:{},          
            activeNames:[],
            //任务列表
            totalJobArr:[],
            //任务详情
            arr:[],
            pageSize:10,
            pageIndex:1,
            map:null,
            searchKey:null,
        }
    },
    props:{
        screenHeight: Number
    },
    watch:{
        screenHeight(){
            let h=$(".bg-white").height()-270;
            $(".taskList").css("max-height",h);
            $.each(_this.arr,function(index,item){
                _this.detail(item)
            })           
        }, 
        searchKey(){
            let fn=this.queryAll;
            clearTimeout(fn.timer);
            fn.timer=setTimeout(() => {
               fn.call(null,_this.searchKey)
            }, 500);
        },
    },
   updated(){
     
   },
    computed:{
/*         filterArr(){
             console.log('22',_this.totalJobArr)
            if(_this.totalJobArr.length!=0&&_this.arr.length!=0){
                $.each(_this.totalJobArr,function(index,item){
                    $.each(_this.arr,function(j,obj){
                        console.log(item,obj)
                        if(item.FAssetID==obj.FAssetID){
                            _this.totalJobArr.splice(index,1)
                        }
                    })
                })
            }
            return _this.totalJobArr
        } */
    },
    created(){
    },
    beforeMount(){
        _this.map = new BMap.Map("allmap");
    },
    mounted(){
        this.$nextTick(function () {
			$(".cardList").scroll(function(){
				if((this.clientWidth+this.scrollLeft)==this.scrollWidth){
                    _this.pageIndex++;
					_this.queryAll()
				}
            })
            _this.queryAll()
            let h=$(".bg-white").height()-250;
             $(".taskList").css("max-height",h);
        })    
    },
    activated(){
        $.each(_this.arr,function(index,item){
            _this.detail(item)
        })
        setInterval(function(){
            $.each(_this.arr,function(index,item){
                _this.detail(item)
            })
        },1000*60*3)
    },
    methods:{
        //点击展开查看详情
        detail(obj,index){
            if(index!=undefined){
                _this.totalJobArr.splice(index,1)
            }
            $.ajax({
                url:"/web/SmartDistribution/SmartDistribution_Trip",
				cache: false,
				async: true,
				type: 'Post',
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
                global: false,
                data:'{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"QueryTripAndTripDetailListByFTripGUID","FTripGUID":"'+obj.FGUID+'","FVersion":"1.0.0"}',
                success:function(json){
                    let a=json.FObject.Table1[0];
                    if(index==undefined){//定时刷新
                        //防止每次刷新回到起点
                        // console.log(123);
                        // let i=_this.arr.indexOf(obj);
                        // $('.taskList .panel-body').eq(i).find(".car_scheduling div").left=obj.TripDetailList.Table1[0].left;
                        $.each(obj.TripDetailList.Table,function (index,item) {
                            json.FObject.Table[index].progress=item.progress
                        })
                        a.progress=obj.TripDetailList.Table1[0].progress;
                        // a.left=obj.TripDetailList.Table1[0].left;
                        obj.TripDetailList=json.FObject;
                        obj.FFinishProgress=json.FObject.Table1[0].FFinishProgress;
                        obj.FNextAgentCode=json.FObject.Table1[0].FNextAgentCode;
                    }else{//点击展开时
                        _this.$set(a,'left',0);
                        _this.$set(obj,'TripDetailList',json.FObject)
                        _this.arr.push(obj);
                    }
                    //计算车辆位置
                    let temp=a.FFinishProgress.split('/')
                    temp[0]=parseInt(temp[0]);
                    temp[1]=parseInt(temp[1]);
                    a.active=temp[0]+1;
                    a.FFinishProgress=temp.join('/');
                    if(a.FNowGPSDateTime){
                        a.FNowGPSDateTime=_this.parseGMT(a.FNowGPSDateTime.replace(/T/ig,' '));
                    }
                    _this.$set(a, "curPosition", null);
                    let arr1=[];//统计绿通开锁
                    let arr2=[];//统计其他开锁
                    for (let i = 0; i < obj.TripDetailList.Table.length; i++) {
                        let item=obj.TripDetailList.Table[i]
                        if(item.FStoreName=="绿通开锁"){
                            item.FOpenLockTime=_this.parseGMT(item.FOpenLockTime.replace(/T/ig,' '));
                            arr1.push(item);
                            obj.TripDetailList.Table.splice(i--,1)
                        }else if(item.FStoreName=="其他开锁"){
                            item.FOpenLockTime=_this.parseGMT(item.FOpenLockTime.replace(/T/ig,' '));
                            arr2.push(item);
                            obj.TripDetailList.Table.splice(i--,1)
                        }else{
                            item.greenTable=arr1//到达站点之前的绿通开锁
                            item.otherTable=arr2//到达站点之前的其他开锁
                            arr1=[];
                            arr2=[];
                        }                        
                        
                    }
                    $.each(obj.TripDetailList.Table,function(index,item){
                        if(item.FOpenLockTime){
                            if(item.FIsFinish){
                                item.FOpenLockTime=_this.parseGMT(item.FOpenLockTime.replace(/T/ig,' '));
                                let time1=Date.parse(new Date(obj.FDeliveryTime));
                                let time2=Date.parse(new Date(item.FOpenLockTime));
                                let s=_this.formatSeconds((time2-time1)/1000);//计算到达所需时间
                                _this.$set(item,'times',s)
                            }
                        }
                        if(item.FOpenType==1){
                        item.FOpenType="_刷卡开锁_"
                        }else if(item.FOpenType==2){
                        item.FOpenType="_远程开锁_"
                        }else if(item.FOpenType==3){
                        item.FOpenType="_蓝牙开锁_"
                        }else {
                        item.FOpenType="--"
                        }
                        //已完成站点收缩
                        if(temp[0]==0){
                            _this.$nextTick(function () {
                                let L=$('.el-steps').width()-90*obj.TripDetailList.Table.length+'px';
                                _this.$set(a, "width", {width:L});
                            });
                        }
                        _this.$set(a, "width", {width:'90px'});
                        if(index==temp[0]-1){
                            _this.$nextTick(function () {
                                let L=$('.el-steps').width()-90*obj.TripDetailList.Table.length+'px'
                                _this.$set(item, "width", {width:L});
                            });
                            
                        }else{
                            _this.$set(item, "width", {width:'90px'});
                        }
                        //下一站显示站点
                        if(index==temp[0]){
                            _this.$nextTick(function () {
                                let L=$('.el-steps').width()-90*obj.TripDetailList.Table.length+'px'
                                _this.$set(item, "left", "-"+L);
                            });
                            _this.$set(item, "show", true);
                        }else{
                            _this.$set(item, "show", false);
                            _this.$set(item, "left", '-90px');
                        }
                        _this.$set(item, "openLockAdress", null);
                        var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: item.FOpenLatitude, lng: item.FOpenLongitude });
                        _this.geocoder(_this.$store.state.globalMapType, ponit0, item, "openLockAdress");
                    })
                    let point= _this.parsePoint(_this.$store.state.globalMapType, { lat: a.FNowLatitude, lng: a.FNowLongitude });
                    _this.geocoder(_this.$store.state.globalMapType, point, json.FObject.Table1[0], "curPosition");
                    //获取预计到下一站的时间，距离
                    if(a.FNowLongitude>0&&a.FNowLatitude>0&&a.FNextLongitude>0&&a.FNextLatitude>0){
                        let time;
                        let distance;
                        let p1=new BMap.Point(a.FNowLongitude,a.FNowLatitude);
                        let p2=new BMap.Point(a.FNextLongitude,a.FNextLatitude);
                        var searchComplete = function (results){
                                if (transit.getStatus() != BMAP_STATUS_SUCCESS){
                                        return ;
                                }
                                var plan = results.getPlan(0);
                                time= plan.getDuration(true);//获取时间
                                distance=plan.getDistance(true) //获取距离
                        }
                        var transit = new BMap.DrivingRoute(_this.map, {renderOptions: {map:_this.map},
                            onSearchComplete: searchComplete,
                            onPolylinesSet: function(){
                                _this.$set(a,'time',time); 
                                // _this.$set(a,'distance',distance); //距下一站的距离
                                obj.time=time;
                                let p,distance1;
                                if(temp[0]==0){
                                    p=a.FDeliveryAddress
                                }else{
                                    p=new BMap.Point(json.FObject.Table[temp[0]-1].FLongitude,json.FObject.Table[temp[0]-1].FLatitude);
                                }
                                var searchComplete1 = function (results){
                                        if (transit.getStatus() != BMAP_STATUS_SUCCESS){
                                                return ;
                                        }
                                        if (results) {
                                            var plan = results.getPlan(0);
                                            distance1=plan.getDistance(true) //获取距离(兩站之間的距离)
                                        }
                                }
                                var transit1 = new BMap.DrivingRoute(_this.map, {renderOptions: {map:_this.map},
                                    onSearchComplete: searchComplete1,
                                    onPolylinesSet: function(){
                                        //车辆位置
                                        let i=_this.arr.indexOf(obj);
                                        if(temp[0]==temp[1]){
                                            $('.taskList .panel-body').eq(i).find(".car_scheduling div").animate({left:left});
                                            a.left='100%'
                                        }
                                        if(distance.indexOf('米') != -1){
                                            distance=parseFloat(distance)/1000
                                        }else{
                                            distance=parseFloat(distance);
                                        }
                                        if(distance1.indexOf('米') != -1){
                                            distance1=parseFloat(distance1)/1000
                                        }else{
                                            distance1=parseFloat(distance1);
                                        }
                                        if(distance>=distance1){
                                            let left=90*temp[0]+"px";
                                            $('.taskList .panel-body').eq(i).find(".car_scheduling div").animate({left:left});
                                            // a.left=left;                                      
                                        } else{
                                            let left=(distance1-distance)/distance1*($('.el-steps').width()-90*temp[1])+90*temp[0]+'px';
                                            $('.taskList .panel-body').eq(i).find(".car_scheduling div").animate({left:left});
                                            // a.left=left;
                                        }
                                        //进度条进度
                                        if(temp[0]==0){
                                            if(distance>=distance1){
                                                _this.$set(a,'progress',{width:'0%'})
                                            }else{
                                                let wh=(distance1-distance)/distance1*100+'%';
                                                _this.$set(a,'progress',{width:wh})
                                            }
                                        }else{
                                            _this.$set(a,'progress',{width:'100%'})
                                        }
                                        $.each(obj.TripDetailList.Table,function (index,item) {
                                            if(index<temp[0]-1){
                                                _this.$set(item,'progress',{width:'100%'})
                                            }else if(index==temp[0]-1){
                                                if(distance>=distance1){
                                                    _this.$set(item,'progress',{width:'0px'})
                                                }else{
                                                    let wh=(distance1-distance)/distance1*100+'%';
                                                    _this.$set(item,'progress',{width:wh})
                                                }
                                            }
                                        })
                                }});
                                transit1.search(p,p2)
                        }});
                        transit.search(p1, p2);
                    }
                    if(_this.totalJobArr.length==0){
                        let h=$(".bg-white").height()-50;
                        $(".taskList").css("max-height",h);               
                    }
                    // obj.TripDetailList.Table=arr2
                    //  console.log("调度",obj)
                },
                error:function(){
                    alert("服務器錯誤")
                }
            })
        },
        hide(obj,index){
            _this.arr.splice(index,1);
            _this.totalJobArr.push(obj);
            _this.totalJobArr.sort(function (a,b) {
                return a.RowNo-b.RowNo
            });
            if(_this.totalJobArr.length!=0){
                let h=$(".bg-white").height()-250;
                $(".taskList").css("max-height",h);               
            }

        },
        queryAll(key){
            _this.map=new BMap.Map("allmap");
            let FKey;
            if(key){
                FKey=key
            }else{
                FKey=""
            }
            $.post("/web/SmartDistribution/SmartDistribution_Trip",{
                'FTokenID':_this.$store.state.FTokenID,
                'FAction':'QueryNoFinishTripListByFUserGUID',
                'FPageSize':_this.pageSize,
                'FPageIndex':_this.pageIndex,
                'FKey':FKey,
                'FVersion':"1.0.0"
            },
            function(json){
                console.log('所有未完成订单',json)
                if(json.Result==104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function(){
                    _this.$store.commit("goLogin");
                  },5000)
                  return
                }else {
                    _this.totalCount=json.FObject.Table[0];
                    if(key==undefined){
                        if(json.FObject.Table1.length==0&&_this.pageIndex!=1){
                            _this.pageIndex=_this.pageIndex-1
                        }
                        _this.totalJobArr=_this.totalJobArr.concat(json.FObject.Table1);
                    }else{
                        _this.arr.length=0;
                        _this.totalJobArr=json.FObject.Table1;
                    }
                    $.each(_this.totalJobArr,function(index,obj){
                        obj.FDeliveryTime=_this.parseGMT(obj.FDeliveryTime.replace(/T/ig,' '))
                        //获取预计到下一站的时间
                        if(obj.FNowLongitude>0&&obj.FNowLatitude>0&&obj.FNextLongitude>0&&obj.FNextLatitude>0){
                            let time;
                            let p1=new BMap.Point(obj.FNowLongitude,obj.FNowLatitude);
                            let p2=new BMap.Point(obj.FNextLongitude,obj.FNextLatitude);
                            var searchComplete = function (results){
                                if (transit.getStatus() != BMAP_STATUS_SUCCESS){
                                    return ;
                                }
                                var plan = results.getPlan(0);
                                time= plan.getDuration(true);                //获取时间
                            }
                            var transit = new BMap.DrivingRoute(_this.map, {renderOptions: {map:_this.map},
                                onSearchComplete: searchComplete,
                                onPolylinesSet: function(){
                                    _this.$set(obj,'time',time);
                            }});
                            transit.search(p1, p2);
                        }
                    });
                }
            })
        },

    },
    components:{
        mySteps,
        myStep
    }
}
</script>
<style>
.bg-white{
    background: white;
    height: 100%;
    margin-right: 10px;
}
.taskCount{
    height: 40px;
    line-height:40px;
    font-size: 14px;
    font-weight: bold;
}
.taskCount>span{
    margin-left:20px;
}
.taskCount .el-input,.taskCount .el-input__inner{
    width: 280px;
    height: 30px;
    right: 70px;
    padding-left: 30px;
}
.taskCount .search-input{
    height: 40px;
    width: 280px;
    line-height: 40px;
    float: right;
    border: none;
    position: relative;
}
.taskCount .search-input .fa-search{
    position:absolute;
    top: 12px;
    font-size: 16px;
    z-index: 100;
    left: -30px;
}
.taskList{
    width: 100%;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
}
.cardList .panel-heading{
    height: 30px;
    text-align: center;
    padding-top: 4px;
}
.taskList .panel-body{
    padding: 0px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
}
.taskList .panel-body .el-collapse{
    border: none
}
.taskList .panel-body .slotTitle{
    float: left;
}
.taskList .list.panel-body{
    background: #ccc;
    margin-bottom: 6px;
    border-radius: 4px;
    padding-left: 20px;
}
.el-popover{
    border-radius: 6px
}
.taskList .list.panel-body ul li{
    display: inline-block;
    margin-left: 10px;
}
.taskList .panel-body .el-collapse .el-icon-arrow-right{
    float: right;
    line-height: 36px;
}
.taskList .circle,.cardList .circle{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: #7a7a7a;
    margin-right: 10px;
    color: white;
    text-align: center;
}
.taskList .FCargoInfo{
    width: 98%;
    margin-bottom: 20px;
    margin-left: -20px;
}
.taskList .panel-body .FCargoInfo li{
    overflow: hidden;
    text-overflow: ellipsis
}
.startIcon{
    float: left;
    margin-top: -18px;
    margin-left: -20px;
}
.taskList .el-collapse-item__wrap{
    background-color: #ccc;
}
/* 进度条悬浮窗*/
.tooltipBlock{
    width: 64px;
    height: 34px;
    background: #ffffff;
    border-radius: 6px;
    color: #999999;
    font-size: 12px;
    margin-top: 10px;
    font-weight: normal;
    cursor: pointer;
    word-break: break-all;
    line-height: 14px;
    padding: 4px;
    margin-left: 0px;
    text-align: left;
    overflow: hidden;
}
.nextAgent{
    width: 120px;
    margin-left: -30px;
}
/* 进度条悬浮窗（未完成时）*/
.unFinsh{
    background: #ffa81c;
    color:white;
}
/* 进度条悬浮窗（绿通开锁）*/
.GreenOpenLock{
    width: 64px;
    margin-left: 26px;
    height: 22px;
    position: absolute;
    top: 4px;
    /* left: -90px; */
    color: white;
    text-align: center;
    line-height: 23px;
    /* letter-spacing: 20px; */
    z-index: 1000;
}
.GreenOpenLock .el-badge__content.is-fixed{
    right: 0px;
}
.GreenOpenLock .r32 .el-badge__content.is-fixed{
    right: 32px;
}
.GreenOpenLock a,.GreenOpenLock a:hover{
    color: white;
    text-decoration: none;
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
}
.GreenOpenLock .el-badge{
    vertical-align: top;
    letter-spacing: 0px;
}
.GreenOpenLock .el-badge__content{
    background: #d58607
}
.GreenOpenLock a.greenOpenLockImg{
    background: url('/static/img/greenOpen.png') no-repeat center
}
.GreenOpenLock a.otherOpenLockImg{
    background: url('/static/img/otherOpen.png') no-repeat center;
}
ul li.GreenOpenLockInfo{
    border-bottom: 1px solid #ccc
}
/* 悬浮窗三角形位置 */
.taskList .el-step .triangle{
    border: 6px solid;
    border-color: #ffffff transparent transparent transparent;
    width: 0px;
    height: 0px;
    position: relative;
    left: 20px;   
}
/* 悬浮窗三角形位置（未完成） */
.taskList .el-step .triangle.unFinshTriangle{
    border-color: #ffa81c transparent transparent transparent;
}
/* 悬浮窗三角形位置（绿通开锁） */
.taskList .el-step .triangle.green{
    border-color: #118b2b transparent transparent transparent;
}
/* 悬浮窗三角形位置（偶数） */
/* .taskList .el-step:nth-of-type(even) .triangle{
    border: 6px solid;
    border-color:transparent transparent #ffffff transparent;
    width: 0px;
    height: 0px;
    position: relative;
    left: 24px;
    top: -51px;
} */
/* .taskList .el-step:nth-of-type(even) .triangle.unFinshTriangle{
    border-color:  transparent transparent #ffa81c transparent;
} */
.taskList .el-step .el-step__main{
    margin-top: -76px;
    margin-left: -16px!important;
}
/* 悬浮窗位置（偶数） */
/* .taskList .el-step:nth-of-type(even) .el-step__main{
    margin-top: 10px;
    margin-left: -16px!important;
} */
/* 未完成时进度条的颜色 */
.taskList .el-step__head.is-text,.taskList .el-step__head.is-text.is-process,.taskList .el-step__head.is-text.is-wait{
    /* background-color:#4fb600; */
    /* border-color:#80e82f; */
    border-color: #4fb600;
    border-width: 3px;
    opacity: 0.86;
}
.taskList .el-step__head.is-text .el-step__line{
    background-color: #4fb600;
}
/* 完成时进度条的颜色 */
.taskList .el-step__head.is-text.is-finish{
    /* background-color:#999999; */
    /* border-color: #dbdbdb; */
    /* background-color: white; */
    border-color: #dbdbdb;
    border-width: 3px;
}
.taskList .el-step:first-of-type .el-step__line.is-horizontal{
    /* width: 90%; */
    margin-left: 34px;
}
/* 进度条大小 */
.taskList .el-step.is-horizontal .el-step__line{
    height: 6px;
    top: 12px;
    left: 28px;
    border-radius: 3px;
}
.taskList .el-step__line-inner{
    border-width: 3px!important;
    border-radius: 3px;
}
.taskList .el-step__icon{
    color:#000;
    line-height: 22px;
}
/* .taskList .el-step__head.is-text.is-finish .el-step__line{
    background-color: #ccc;
} */
.car_scheduling{
    width: 100%;
    height: 45px;
    font-size: 12px;
    position: relative;
    top:4px;
    left: 0%;
}
.car_scheduling div{
    position: absolute;
    width: 74px;
    /* padding-top: 8px; */
    height: 54px;
    z-index: 100;
    padding-top: 2px;
    color: white;
    text-indent: 3px;
    background: url('/static/img/car_scheduling.png') no-repeat left;
}
.unFinshTriangle.triangle{
     border-color: #ffa81c transparent transparent transparent;
}
.cardList{
    width: 100%;
    overflow-y: hidden;
    white-space: nowrap;
}
 .cardList .card{
    display: inline-block;
    box-sizing: border-box; 
    height: 196px;
    width: 16.66%;
    margin-bottom: 10px;
    /* width: 180px; */
    padding: 4px;
}
.cardList .panel-body{
    font-size: 12px;
    padding-left: 10px;
    padding-top: 4px;
    height: 154px;
    font-weight: 100
}
.cardList .panel-body button{
    width: 96%;
    border-radius: 4px;
    margin-top: 4px;
    background: #ffa81c
}
.flip-list-move {
  transition: transform 0.5s;
}
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.infoDetail li{
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.openLockInfo p{
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
}
.el-steps{
    height: 40px;
    padding-left: 10px;
}
</style>
