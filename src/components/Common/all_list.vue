<template>
  <!--<section>-->
    <!--&lt;!&ndash;处理弹框&ndash;&gt;-->
    <!--<div class="modal fade" id="modal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">-->
      <!--<div class="modal-dialog">-->
        <!--<div class="modal-content" >-->
          <!--<div class="modal-header" style="height: 20px;width: 20px;position: relative;padding: 0px;left: 95%;border-bottom-width: 0px;background:none">-->
            <!--<button type="button" class="close mybtn" data-dismiss="modal" aria-hidden="true" style="background: white;width: 28px" @click="clearText()">&times;</button>-->
          <!--</div>-->
          <!--<div class="modal-body" style="height: 100%">-->
            <!--<textarea style="height:190px;width:100%;text-indent: 2em;padding: 4px" placeholder="_输入处理意见_" id="myinput"></textarea>-->
          <!--</div>-->
          <!--<div class="modal-footer" style="margin-right: 10px">-->
            <!--<div class="btn btn-primary btn-sm" style="height: 30px;padding: 0px">-->
              <!--<button type="button" class="btn  btn-xs mybtn" data-dismiss="modal" @click="handle(0,1)" style="width: 40px">_提交_</button>-->
              <!--<el-dropdown trigger="click" @command="handleCommand">-->
                <!--<el-button type="primary" size="mini" style="width: 20px;" class="mybtn">-->
                  <!--<i class="el-icon-caret-bottom el-icon&#45;&#45;right" style="margin-left: 0px"></i>-->
                <!--</el-button>-->
                <!--<el-dropdown-menu slot="dropdown">-->
                  <!--<el-dropdown-item command="_我已阅读_">_我已阅读_</el-dropdown-item>-->
                  <!--<el-dropdown-item command="_已通知相关人员处理_">_已通知相关人员处理_</el-dropdown-item>-->
                  <!--<el-dropdown-item command="_已经联系司机确认_">_已经联系司机确认_</el-dropdown-item>-->
                <!--</el-dropdown-menu>-->
              <!--</el-dropdown>-->
            <!--</div>-->
            <!--<button type="reset" class="btn btn-default" data-dismiss="modal" @click="clearText()">_取消_</button>-->
          <!--</div>-->
        <!--</div>&lt;!&ndash; /.modal-content &ndash;&gt;-->
      <!--</div>&lt;!&ndash; /.modal &ndash;&gt;-->
    <!--</div>-->
    <!--&lt;!&ndash;地图弹框&ndash;&gt;-->
	  <!--<div class="mymodal" style="height: 570px;width: 920px;margin-left:-320px;margin-top: -230px;position: fixed;left: 50%;top: 50%;z-index:999;visibility: hidden">-->
		  <!--<div class="modal-header" style="position: absolute;left: 890px;height: 20px;width: 20px;border: none;padding: 0px;z-index: 2;">-->
			  <!--<button type="button" @click="closeMymodal" style="height: 30px;width: 30px;background:transparent;outline:none;border: none;">-->
				  <!--&lt;!&ndash;<span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal"></span>&ndash;&gt;-->
				  <!--<i class="fa fa-times" aria-hidden="true" style="font-size: 24px;"></i>-->
			  <!--</button>-->
      <!--</div>-->
      <!--<div class="modal-body"  style="padding: 0px">-->
        <!--<baidu-map ref="map" :fa-data="[mapToolShow]" ></baidu-map>-->
      <!--</div>-->
      <!--<div class="mapModal">-->
        <!--<header style="background: #f9f9f9 ;height:34px;padding: 10px">-->
          <!--<h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{FVehicleName}}</h4>-->
        <!--</header>-->
        <!--<div style="padding: 15px">-->
          <!--<p><span>_开始时间_：</span>{{FStartDateTime}}</p>-->
          <!--<p><span>_结束时间_：</span>{{FEndDateTime}}</p>-->
          <!--<p><span>_持续时长_：</span>{{FKeepSeconds}}</p>-->
          <!--<p :title="startAdress"><nobr><span>_开始位置_：</span>{{startAdress}}</nobr></p>-->
          <!--<p :title="endAdress"><nobr><span>_结束位置_：</span>{{endAdress}}</nobr></p>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>&lt;!&ndash; /.modal-content &ndash;&gt;-->
    <!--<vehical-select-dialog v-on:child="get" v-if="showVehicalList"  ref="vehicle"></vehical-select-dialog>-->
    <!--&lt;!&ndash; <lock-select-dialog v-on:child="get" v-if="SystemID==2&&showVehicalList" ref="lock"></lock-select-dialog> &ndash;&gt;-->
    <!--<div id="operate_wrapper">-->
      <!--<div class="box-header">-->
        <!--<div class="block">-->
          <!--<span class="operatExp" v-if="SystemID!==2">_选择车辆_</span>-->
          <!--<span class="operatExp" v-if="SystemID==2">_选择设备_</span>-->
          <!--<div class="search-input-wrap" data-toggle="modal" data-target="#modal">&lt;!&ndash;&ndash;&gt;-->
            <!--<a href="javascript:;" class="get-carList-dialog">-->
              <!--<i class="img-icon icon-carList-dialog"  v-if="SystemID!==2"></i>-->
              <!--<i class="fa fa-lock" style="font-size: 18px"  v-if="SystemID==2"></i>-->
            <!--</a>-->
            <!--<input type="text" class="search-input" readonly="readonly">-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="block">-->
          <!--<span class="operatExp">_选择时间_</span>-->
          <!--<el-date-picker-->
            <!--size="small"-->
            <!--v-model="value3"-->
            <!--:clearable="false"-->
            <!--type="daterange"-->
            <!--@change="getTime"-->
            <!--:picker-options="pickerOptions2"-->
            <!--placeholder="_选择时间范围_">-->
          <!--</el-date-picker>-->
        <!--</div>-->
        <!--<div class="btnList">-->
          <!--<el-button type="primary" class="search" @click="queryCount(0,1)">_查询_</el-button>-->
          <!--<el-button type="primary" class="reset" @click="reset()">_重置_</el-button>-->
          <!--<el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>_导出文件_</el-button>-->
          <!--<el-button type="primary" class="read" @click="setToRead(0,1)"><i class="fa fa-envelope-open-o"></i>_设为已读_</el-button>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<el-tabs v-model="activeName" @tab-remove="removeTab('forth')">-->
      <!--<el-tab-pane label="_汇总_" name="all">-->
        <!--<div class="el_table_wrap" id="el_table_wrap">-->
          <!--<el-table-->
            <!--:data="table0"-->
            <!--v-loading="loading"-->
            <!--element-loading-text="_拼命加载中_"-->
            <!--empty-text="_暂无数据_"-->
            <!--stripe-->
            <!--:height="table_height"-->
            <!--align="left"-->
            <!--style="width: 100%">-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--label="_序号_"-->
              <!--width="80">-->
                    <!--<template scope="scope">-->
                        <!--{{scope.$index+1+pageSize0*(pageIndex0-1)}}-->
                    <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--width="120"-->
              <!--label="_操作_">-->
              <!--<template scope="scope">-->
                <!--<a href="javascript:" @click="addTab(scope.$index,scope.row,1)" v-if="scope.row.FAlarmCount!=0">_详情_</a>-->
                <!--<a href="javascript:" v-if="scope.row.FAlarmCount==0" style="cursor: not-allowed;color:#cccccc">_详情_</a>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FShortName"-->
              <!--label="_公司简称_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
           <!--<el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FVehicleName"-->
              <!--sortable-->
              <!--label="_车牌号_"-->
              <!--width="100">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FDriverName"-->
              <!--label="_司机_"-->
              <!--width="80">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FAlarmCount"-->
              <!--sortable-->
              <!--label="_超速次数_"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FMaxSpeed"-->
              <!--sortable-->
              <!--label="_最高速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="" min-width="100"></el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
        <!--<div  class="pagination">-->
          <!--<div class="block">-->
            <!--<el-pagination-->
              <!--@size-change="handleSizeChange0"-->
              <!--@current-change="handleCurrentChange0"-->
              <!--:current-page="pageIndex0"-->
              <!--:page-sizes="[10, 20, 30,]"-->
              <!--:page-size="pageSize0"-->
              <!--layout="prev, pager, next, jumper,total,sizes"-->
              <!--:total="total0">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="_全部_" name="first">-->
        <!--<div class="el_table_wrap" >-->
          <!--<el-table-->
            <!--:data="table1"-->
            <!--v-loading="loading"-->
            <!--element-loading-text="_拼命加载中_"-->
            <!--empty-text="_暂无数据_"-->
            <!--ref="multipleTable"-->
            <!--@selection-change="handleSelectionChange"-->
            <!--stripe-->
            <!--:height="table_height"-->
            <!--align="left"-->
            <!--style="width: 100%">-->
            <!--<el-table-column-->
              <!--type="selection"-->
              <!--:selectable="check"-->
              <!--width="55">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--label="_序号_"-->
              <!--width="80">-->
                    <!--<template scope="scope">-->
                        <!--{{scope.$index+1+pageSize1*(pageIndex1-1)}}-->
                    <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessStatus"-->
              <!--label="_状态_"-->
              <!--width="100">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--width="140"-->
              <!--label="_操作_">-->
              <!--<template scope="scope">-->
                <!--<a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1" v-if="scope.row.FProcessStatus=='_未处理_'">_处理_</a>-->
                <!--<a href="javascript:"style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看位置_</a>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FShortName"-->
              <!--label="_公司简称_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
           <!--<el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FVehicleName"-->
              <!--sortable-->
              <!--label="_车牌号_"-->
              <!--width="100">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FDriverName"-->
              <!--label="_司机_"-->
              <!--width="80">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FMaxSpeed"-->
              <!--sortable-->
              <!--label="_最高速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FAverageSpeed"-->
              <!--sortable-->
              <!--label="_平均速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FStartDateTime"-->
              <!--sortable-->
              <!--label="_开始时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FEndDateTime"-->
              <!--sortable-->
              <!--label="_结束时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FKeepSeconds"-->
              <!--sortable-->
              <!--:sort-method="sortMethod"-->
              <!--:formatter="formatter"-->
              <!--label="_持续时长_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="starAdress"-->
              <!--show-overflow-tooltip-->
              <!--label="_开始位置_"-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="endAdress"-->
              <!--show-overflow-tooltip-->
              <!--label="_结束位置_"-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessContext"-->
              <!--show-overflow-tooltip-->
              <!--label="_处理结果_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessDateTime"-->
              <!--sortable-->
              <!--label="_处理时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="" min-width="100"></el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
        <!--<div id="pagination" class="pagination">-->
          <!--<div class="block">-->
            <!--<el-pagination-->
              <!--@size-change="handleSizeChange1"-->
              <!--@current-change="handleCurrentChange1"-->
              <!--:current-page="pageIndex1"-->
              <!--:page-sizes="[10, 20, 30,]"-->
              <!--:page-size="pageSize1"-->
              <!--layout="prev, pager, next, jumper,total,sizes"-->
              <!--:total="total1">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="_已读_" name="second">-->
        <!--<div class="el_table_wrap" >-->
          <!--<el-table-->
            <!--:data="table2"-->
            <!--v-loading="loading"-->
            <!--element-loading-text="_拼命加载中_"-->
            <!--empty-text="_暂无数据_"-->
            <!--ref="multipleTable"-->
            <!--@selection-change="handleSelectionChange"-->
            <!--stripe-->
            <!--:height="table_height"-->
            <!--align="left"-->
            <!--style="width: 100%">-->
            <!--<el-table-column-->
              <!--type="selection"-->
              <!--width="55">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--label="_序号_"-->
              <!--width="80">-->
                    <!--<template scope="scope">-->
                        <!--{{scope.$index+1+pageSize2*(pageIndex2-1)}}-->
                    <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--width="120"-->
              <!--label="_操作_">-->
              <!--<template scope="scope">-->
                <!--<a href="javascript:" style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看位置_</a>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FShortName"-->
              <!--label="_公司简称_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
           <!--<el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FVehicleName"-->
              <!--sortable-->
              <!--label="_车牌号_"-->
              <!--width="100">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FDriverName"-->
              <!--label="_司机_"-->
              <!--width="80">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FMaxSpeed"-->
              <!--sortable-->
              <!--label="_最高速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FAverageSpeed"-->
              <!--sortable-->
              <!--label="_平均速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FStartDateTime"-->
              <!--show-overflow-tooltip-->
              <!--sortable-->
              <!--label="_开始时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FEndDateTime"-->
              <!--sortable-->
              <!--label="_结束时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FKeepSeconds"-->
              <!--sortable-->
              <!--:sort-method="sortMethod"-->
              <!--:formatter="formatter"-->
              <!--label="_持续时长_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="starAdress"-->
              <!--show-overflow-tooltip-->
              <!--label="_开始位置_"-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="endAdress"-->
              <!--show-overflow-tooltip-->
              <!--label="_结束位置_"-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessContext"-->
              <!--show-overflow-tooltip-->
              <!--label="_处理结果_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessDateTime"-->
              <!--sortable-->
              <!--label="_处理时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="" min-width="100"></el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
        <!--<div  class="pagination">-->
          <!--<div class="block">-->
            <!--<el-pagination-->
              <!--@size-change="handleSizeChange2"-->
              <!--@current-change="handleCurrentChange2"-->
              <!--:current-page="pageIndex2"-->
              <!--:page-sizes="[10, 20, 30,]"-->
              <!--:page-size="pageSize2"-->
              <!--layout="prev, pager, next, jumper,total,sizes"-->
              <!--:total="total2">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="_未读_" name="third">-->
        <!--<div class="el_table_wrap" >-->
          <!--<el-table-->
            <!--:data="table3"-->
            <!--v-loading="loading"-->
            <!--element-loading-text="_拼命加载中_"-->
            <!--empty-text="_暂无数据_"-->
            <!--ref="multipleTable"-->
            <!--@selection-change="handleSelectionChange"-->
            <!--stripe-->
            <!--:height="table_height"-->
            <!--align="left"-->
            <!--style="width: 100%">-->
            <!--<el-table-column-->
              <!--type="selection"-->
              <!--width="55">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--label="_序号_"-->
              <!--width="80">-->
                    <!--<template scope="scope">-->
                        <!--{{scope.$index+1+pageSize3*(pageIndex3-1)}}-->
                    <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--width="140"-->
              <!--label="_操作_">-->
              <!--<template scope="scope">-->
                <!--<a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1">_处理_</a>-->
                <!--<a href="javascript:"style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看位置_</a>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FShortName"-->
              <!--label="_公司简称_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
           <!--<el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FVehicleName"-->
              <!--sortable-->
              <!--label="_车牌号_"-->
              <!--width="100">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FDriverName"-->
              <!--label="_司机_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FMaxSpeed"-->
              <!--sortable-->
              <!--label="_最高速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FAverageSpeed"-->
              <!--sortable-->
              <!--label="_平均速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FStartDateTime"-->
              <!--sortable-->
              <!--label="_开始时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FEndDateTime"-->
              <!--sortable-->
              <!--label="_结束时间_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FKeepSeconds"-->
              <!--sortable-->
              <!--:sort-method="sortMethod"-->
              <!--:formatter="formatter"-->
              <!--label="_持续时长_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="starAdress"-->
              <!--show-overflow-tooltip-->
              <!--label="_开始位置_"-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="endAdress"-->
              <!--label="_结束位置_"-->
              <!--show-overflow-tooltip-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="" min-width="100"></el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
        <!--<div  class="pagination">-->
          <!--<div class="block">-->
            <!--<el-pagination-->
              <!--@size-change="handleSizeChange3"-->
              <!--@current-change="handleCurrentChange3"-->
              <!--:current-page="pageIndex3"-->
              <!--:page-sizes="[10, 20, 30,]"-->
              <!--:page-size="pageSize3"-->
              <!--layout="prev, pager, next, jumper,total,sizes"-->
              <!--:total="total3">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane-->
        <!--v-for="(item, index) in editableTabs"-->
        <!--:key="item.name"-->
        <!--closable-->
        <!--:label="item.title"-->
        <!--:name="item.name"-->
      <!--&gt;-->
        <!--<div class="el_table_wrap" >-->
          <!--<el-table-->
            <!--:data="mytable"-->
            <!--v-loading="loading"-->
            <!--element-loading-text="_拼命加载中_"-->
            <!--empty-text="_暂无数据_"-->
            <!--ref="multipleTable"-->
            <!--@selection-change="handleSelectionChange"-->
            <!--stripe-->
            <!--:height="table_height"-->
            <!--align="left"-->
            <!--style="width: 100%">-->
            <!--<el-table-column-->
              <!--type="selection"-->
              <!--:selectable="check"-->
              <!--width="55">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--label="_序号_"-->
              <!--width="80">-->
                    <!--<template scope="scope">-->
                        <!--{{scope.$index+1+pageSize4*(pageIndex4-1)}}-->
                    <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessStatus"-->
              <!--label="_状态_"-->
              <!--width="100">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop=""-->
              <!--width="140"-->
              <!--label="_操作_">-->
              <!--<template scope="scope">-->
                <!--<a href="javascript:" @click="clickHandleBtn(scope.row)" data-toggle="modal" data-target="#modal1" v-if="scope.row.FProcessStatus=='_未处理_'">_处理_</a>-->
                <!--<a href="javascript:"style="color: #4aae58" @click="showHistory(scope.$index,scope.row)">_查看位置_</a>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FShortName"-->
              <!--label="_公司简称_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
           <!--<el-table-column prop="FAssetID" label="_终端号_" width="120" sortable v-if="SystemID==2"></el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FVehicleName"-->
              <!--sortable-->
              <!--label="_车牌号_"-->
              <!--width="100">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FDriverName"-->
              <!--label="_司机_"-->
              <!--width="80">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FMaxSpeed"-->
              <!--sortable-->
              <!--label="_最高速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FAverageSpeed"-->
              <!--sortable-->
              <!--label="_平均速_（km/h）"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FStartDateTime"-->
              <!--sortable-->
              <!--label="_开始时间_"-->
              <!--width="160">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FEndDateTime"-->
              <!--sortable-->
              <!--label="_结束时间_"-->
              <!--width="160">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FKeepSeconds"-->
              <!--sortable-->
              <!--:sort-method="sortMethod"-->
              <!--:formatter="formatter"-->
              <!--label="_持续时长_"-->
              <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="starAdress"-->
              <!--show-overflow-tooltip-->
              <!--label="_开始位置_"-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="endAdress"-->
              <!--show-overflow-tooltip-->
              <!--label="_结束位置_"-->
              <!--width="240">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessContext"-->
              <!--show-overflow-tooltip-->
              <!--label="_处理结果_"-->
              <!--width="200">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="FProcessDateTime"-->
              <!--sortable-->
              <!--label="_处理时间_"-->
              <!--width="160">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="" min-width="100"></el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
        <!--<div class="pagination">-->
          <!--<div class="block">-->
            <!--<el-pagination-->
              <!--@size-change="handleSizeChange4"-->
              <!--@current-change="handleCurrentChange4"-->
              <!--:current-page="pageIndex4"-->
              <!--:page-sizes="[10, 20, 30,]"-->
              <!--:page-size="pageSize4"-->
              <!--layout="prev, pager, next, jumper,total,sizes"-->
              <!--:total="total4">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-tab-pane>-->
    <!--</el-tabs>-->
  <!--</section>-->
  <section>
    <!--处理弹框-->
    <div class="modal fade" id="modal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    </div>
    <!--地图弹框-->
    <div class="mymodal" style="height: 570px;width: 920px;margin-left:-450px;margin-top: -230px;position: fixed;left: 50%;top: 50%;z-index:999;visibility: hidden">
    <!--<div class="mymodal" style="height: 570px;width: 920px;margin-left:-320px;margin-top: -230px;position: fixed;left: 50%;top: 50%;z-index:999;">-->
      <div class="modal-header" style="position: absolute;left: 890px;height: 20px;width: 20px;border: none;padding: 0px;z-index: 2;">
        <button type="button" @click="closeMymodal" style="height: 30px;width: 30px;background:transparent;outline:none;border: none;">
          <!--<span class="glyphicon glyphicon-remove" style="font-size:14px;font-weight: normal"></span>-->
          <i class="fa fa-times" aria-hidden="true" style="font-size: 24px;"></i>
        </button>
      </div>
      <div class="modal-body"  style="padding: 0px">
        <!--<baidu-map ref="baiduMap" :fa-data="[mapToolShow]" ></baidu-map>-->
        <baidu-map ref="baiduMap" :fa-data="[mapToolShow]" ></baidu-map>
      </div>
      <div class="mapModal">
        <header style="background: #f9f9f9 ;height:34px;padding: 10px">
          <h4 style="font-size: 14px;color: #005ec5;font-weight: bold">{{FVehicleName}}[{{FAssetID}}]</h4>
        </header>
        <div style="padding: 15px">
          <p style="margin-top: -10px"><span>_公司简称_：</span>{{FShortName}}</p>
          <p><span>_状态_：</span>{{ FLockStatus?'_开锁_':'_上锁_' }}</p>
          <p><span>_里程_(km)：</span>{{FMileage}}</p>
          <p><span>_速度_(km/h)：</span>{{FSpeed}}</p>
          <p><span>_电量_(%)：</span>{{FBatteryPercent}}</p>
          <p><span>_更新时间_：</span>{{FRecvDateTime}}</p>
        </div>
      </div>
    </div><!-- /.modal-content -->
    <vehical-select-dialog v-on:child="get" v-if="showVehicalList"  ref="vehicle"></vehical-select-dialog>
    <!-- <lock-select-dialog v-on:child="get" v-if="SystemID==2&&showVehicalList" ref="lock"></lock-select-dialog> -->
    <div id="operate_wrapper">
      <div class="box-header">
        <div class="block">
          <!--<span class="operatExp" v-if="SystemID!==2">_选择车辆_</span>-->
          <!--<span class="operatExp" v-if="SystemID==2">_选择设备_</span>-->
          <span class="operatExp" >_选择设备_</span>
          <div class="search-input-wrap" data-toggle="modal" data-target="#modal"><!---->
            <a href="javascript:;" class="get-carList-dialog">
              <i class="img-icon icon-carList-dialog"  v-if="SystemID!==2"></i>
              <i class="fa fa-lock" style="font-size: 18px"  v-if="SystemID==2"></i>
            </a>
            <input type="text" class="search-input" readonly="readonly">
          </div>
        </div>
        <div class="btnList">
          <!--<el-button type="primary" class="search" @click="queryCount(0,1)">_查询_</el-button>-->
          <el-button type="primary" class="search" @click="getSelectList()">_查询_</el-button>
          <el-button type="primary" class="reset" @click="reset()">_重置_</el-button>
          <el-button type="primary" class="export"><i class="fa fa-share-square-o"></i>_导出文件_</el-button>
        </div>
      </div>
    </div>
    <!--数据列表展示-->
    <div class="data-list" style="width: 100%">
      <el-table id="_showTableData" :data="_showTableData"  :height="table_data_height"  border style="width: 100% ;">
        <el-table-column type="" label="_序号_"  width="70">
          <template slot-scope="scope">
            <!--将序号进行处理，分页时能正确显示-->
            <span>{{ scope.$index + 1 + (page-1)*page_size }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="_操作_" width="80">
          <template slot-scope="scope">
                <a style="margin-right: 2px;"><i class="el-icon-document" title="_查看详情_" @click = "getOneCarInfo(scope.row.FVehicleGUID)"></i></a>
                <a><i class="el-icon-location" title="_查看定位_" @click = 'showMapData(scope.row)'></i></a>
          </template>
        </el-table-column>
        <el-table-column prop="FVehicleName" :render-header="setHead" label='{"value":"FVehicleName","title":"_车牌号_/_箱号_","label":"_车牌号_/_箱号_"}' width="150"></el-table-column>
        <el-table-column prop="FAssetID" 	:render-header="setHead"
                         label='{"value":"FAssetID","title":"_设备_ID","label":"_设备_ID"}'
                          width="150"></el-table-column>
        <el-table-column prop="FAssetTypeID" :render-header="setHead"
                         label='{"value":"FAssetTypeID","title":"_设备类型_","label":"_设备类型_"}'
                         width="110"></el-table-column>
        <el-table-column prop="FGPSDateTime" :render-header="setHead"
                         label='{"value":"FGPSDateTime","title":"_定位时间_","label":""}'
                         width="160"></el-table-column>
        <el-table-column prop="FRecvDateTime" :render-header="setHead"
                         label='{"value":"FRecvDateTime","title":"_数据接收时间_","label":""}'
                         width="160"></el-table-column>
        <el-table-column prop="" :render-header="setHead"
                         label='{"value":"FAddress","title":"_当前位置_","label":""}'
                         width="300">
            <template scope = 'scope'>
              <span :title="scope.row.Address">{{scope.row.Address}}</span>
            </template>
        </el-table-column>
        <el-table-column  :render-header="setHead"
                          label='{"value":"FLocationType","title":"_定位状态_","label":""}'
                          width="100">
          <template scope="scope">
            <i class="img-icon" :class="{'gps-light':scope.row.FLocationType==1,
											   'net-light':scope.row.FLocationType==2,
											   'wifi-light':scope.row.FLocationType==3,
											   'red-light':scope.row.FLocationType==0}"
               :title="scope.row.FLocationType==1?'GPS':(scope.row.FLocationType==2?'_基站定位_':(scope.row.FLocationType==3?'WIFI':'_不定位_'))"></i>
          </template>
        </el-table-column>
        <el-table-column prop="FSpeed" :render-header="setHead"
                         label='{"value":"FSpeed","title":"_速度_","label":""}'
                         width="100"></el-table-column>
        <el-table-column prop="FMileage" :render-header="setHead"
                         label='{"value":"FMileage","title":"_里程_","label":""}'
                         width="100"></el-table-column>
        <el-table-column prop="batteryPercent" :render-header="setHead"
                         label='{"value":"FBatteryPercent","title":"_电量_","label":""}'
                         width="90"></el-table-column>
        <el-table-column  :render-header="setHead"
                          label='{"value":"FLockStatus","title":"_锁状态_","label":""}'
                          width="90">
          <template scope="scope">
            <span v-if="scope.row.FLockStatus==-1||!(scope.row.FAssetTypeID==701||scope.row.FAssetTypeID==735||scope.row.FAssetTypeID==740)">--</span>
            <el-popover v-if="scope.row.FLockStatus!=-1"
                        placement="top-start"
                        width="460"
                        offset="350"
                        popper-class="popover-box"
                        trigger="hover"
                        :disabled="scope.row.attitude==null">
              <i slot="reference" class="img-icon lock-state" :class="{'normal-lock':!scope.row.FLockStatus&&scope.row.attitude<=1,
														'abnormal-lock':!scope.row.FLockStatus&&scope.row.attitude>1,
														'normal-unlock':scope.row.FLockStatus&&scope.row.attitude<=1,
														'abnormal-unlock':scope.row.FLockStatus&&scope.row.attitude>1}"
                 :title="scope.row.FLockStatus?'_开锁_':'_上锁_'"></i>

              <div class="pose-wrap">
                <img v-if="scope.row.attitude!=null"
                     :src="'/static/img/pose/pose'+scope.row.attitude+'.png'">
                <p class="top-left">_左视图_</p>
                <p class="top-right">_俯视图_</p>
                <p class="bom">_正视图_</p>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :render-header="setHead"
                         label='{"value":"FTemperature","title":"_箱内_/_箱外温度_/_温湿度_","label":""}'
                         width="180">
          <template scope="scope">
            <span>{{ scope.row.FTemperature2}}/{{ scope.row.FTemperature1}}/{{ scope.row.FTemperature3}}/{{ scope.row.FTemperature4}}</span>
          </template>
        </el-table-column>
        <el-table-column  	:render-header="setHead"
                            label='{"value":"FIsLock","title":"_远程开锁_","label":""}'
                            width="90">
          <template scope="scope">
            <p v-if="!(scope.row.FAssetTypeID==701||scope.row.FAssetTypeID==735||scope.row.FAssetTypeID==740)">--</p>
            <a v-if="!scope.row.isShowKeyBtn" class="img-icon monitor-icon no-icon-key" title="_不支持远程开锁_"></a>
            <a v-if="scope.row.isShowKeyBtn" class="img-icon monitor-icon icon-key" title="_远程开锁_"></a>
          </template>
        </el-table-column>
        <el-table-column prop=""
                         :render-header="setHead"
                         label='{"value":"FDetail","title":"_查看详情_","label":""}'
                         width="90">
          <template slot-scope="scope">
            <a @click="getOneCarInfo(scope.row.FVehicleGUID)"
               class="img-icon monitor-icon icon-info" title="_查看详情_">
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="" :render-header="setHead"
                         label='{"value":"FOil","title":"_油位_","label":""}' width="100">
          <template scope="scope">
            <span v-if="!scope.row.fuelValue||!scope.row.fuelValue.length">--</span>
            <span v-for="obj in scope.row.fuelValue" v-else>
										<i class="tire" v-show="scope.row.fuelValue.length!=1 && obj.number!=1">{{obj.number}}</i>{{obj.value}}&nbsp;
									</span>
          </template>
        </el-table-column>
        <el-table-column
                         :render-header="setHead"
                         label='{"value":"FCouplingStatus","title":"_接甩挂_","label":""}'
                         width="110">
          <template scope="scope">
            <!--<span v-show="scope.row.FAssetTypeID!==703">&#45;&#45;</span>-->
            <span>{{scope.row.couplingStatusTitle}}</span>
            <!--<i v-show="scope.row.couplingStatus==1 || scope.row.couplingStatus==0" class="img-icon"-->
               <!--:class="{'online-coupling':scope.row.couplingStatus==1&&scope.row.alarmOffLine!=1,-->
												<!--'online-unCoupling':scope.row.couplingStatus==0&&scope.row.alarmOffLine!=1,-->
												<!--'offline-Coupling':scope.row.couplingStatus==1&&scope.row.alarmOffLine==1,-->
												<!--'offline-unCoupling':scope.row.couplingStatus==0&&scope.row.alarmOffLine==1}"-->
               <!--:title="scope.row.couplingStatusTitle"></i>-->
          </template>
        </el-table-column>
        <el-table-column  	:render-header="setHead"
                            label='{"value":"FTireTemperature","title":"_胎温胎压_","label":""}'
                            width="90">
          <template scope="scope">
            <span v-show="scope.row.isHaveTyreContent==0">--</span>
            <el-popover v-show="scope.row.isHaveTyreContent==1"
                        placement="top"
                        width="460"
                        offset="350"
                        popper-class="popover-box"
                        trigger="click">
													<span @click="getCarTireData(scope.row.FAssetGUID)" slot="reference">
														<i class="img-icon carChoiceList-icon ChoiceListIcon-5a cursor-pointer"></i>
													</span>

              <div style="min-height:400px">
                <table class="popover-table" width="100%">
                  <thead>
                  <tr>
                    <th colspan="2">_设备_ID:{{tireData.ID}}</th>
                    <th colspan="2">_上传时间_:{{tireData.time}}</th>
                  </tr>
                  <tr>
                    <th width="10%">_序号_</th>
                    <th width="20%">_胎压_(Bar)</th>
                    <th width="20%">_胎温_(℃)</th>
                    <th width="50%">_状态_</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="value in tireData.data">
                    <td align="center">{{value.N}}</td>
                    <td align="center">{{value.P}}</td>
                    <td align="center">{{value.T}}</td>
                    <td align="left">
                      &nbsp;&nbsp;{{value.state}}
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div class="popover-img img-tire"></div>
              </div>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column prop="FIsLoaded" :render-header="setHead" label='{"value":"FBoxLoadedStatus","title":"_空重载状态_","label":""}' width="100"></el-table-column>
        <el-table-column prop="FIsOpenDoor" :render-header="setHead" label='{"value":"FBoxDoorStatus","title":"_箱门状态_","label":""}' width="100"></el-table-column>
        <el-table-column prop="FSwitchDoorTimes" :render-header="setHead" 	label='{"value":"FSwitchDoorTimes","title":"_开关门次数_","label":""}' width="100"></el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        background
        @size-change="SizeChange"
        @current-change="CurrentChange"
        layout="sizes,prev, pager, next"
        :page-sizes="[20, 40, 60]"
        :page-size="20"
        :total="data_total">
      </el-pagination>
    </div>
    <vel-detail  ref="velDatail"></vel-detail>
    <div class="searchTips"  v-if="searchTips">
      <div class="loading">
        <i class="el-icon-loading"></i>
        <span >loading......</span>
      </div>
    </div>

  </section>
</template>
<script>
  import baiduMap from '../Common/baidu_map.vue'
  // import  velDetail from '/components/dialog/velDetail.vue'
  import  velDetail from '../dialog/velDetail.vue'
  import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
  // import lockSelectDialog from './../EL/lockSelectDialog.vue'
  import baidu  from '../../js/GIS/Baidu/BaiduAPI'
  import axios from 'axios'
  let _this;
  export default{
    data(){
      _this=this;
      return {
        showVehicalList:false,
        loading:false,
        Area:"深圳",
        mapToolShow:false,
        currentPage:1,
        activeName:'all',
        total0:0,
        total1:0,
        total2:0,
        total3:0,
        total4:0,
        pageSize0:20,
        pageSize1:20,
        pageSize2:20,
        pageSize3:20,
        pageSize4:20,
        pageIndex0:1,
        pageIndex1:1,
        pageIndex2:1,
        pageIndex3:1,
        pageIndex4:1,
        pickerOptions2: {
          shortcuts: [{
            text: '_今天_',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              //start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '_昨天_',
            onClick(picker) {
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              const end = start;
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '_最近三天_',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '_最近一周_',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '_最近三十天_',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value3: [new Date(), new Date()],
        value4:'',
        table_height: null,
        table_data_height: null,
        table0:null,
        table1:null,
        table2:null,
        table3:null,
        table4:null,
        editableTabs:[],
        tabIndex: 4,
        multipleSelection: [],
        objDetail:'',
        handleObj:'',
        FVehicleName:'',
        startAdress:'',
        endAdress:'',
        FStartDateTime:'',
        FEndDateTime:'',
        FKeepSeconds:'',
        SelectList:[],  // 已选择的设备/车辆列表
        tableData:[], // 设备/车辆列表的总数据
        tireData: { //轮胎数据
          ID: null,
          time: null,
          data: []
        },
        searchTips:false, //查询时提示的tips
        FShortName:"", // 公司简称
        FLockStatus:'', // 锁状态
        FMileage: '' ,// 里程
        FAssetID: '' ,// 设备ID

        // _showTableData:[], // 需要显示设备/车辆列表的数据
        // _page_total:1 ,//总页数
        page:1  ,// 当前页数
        page_size:20, // 分页大小
        treeLoading:"",
      }
    },
    props: {
      screenHeight: Number
    },
    computed:{
      SystemID(){
        return this.$store.state.choiceSystemID
      },
      url(){
        if(this.$store.state.choiceSystemID==2){
          return '/web/Lock/Lock_Message';
        }else{
          return '/web/Common/Common_Message';
        }
      },
      mapType:{
        get(){
          return _this.$store.state.mapType
        }
      },
      _showTableData:{
        get(){
          return _this.tableData.slice((_this.page-1)*_this.page_size,_this.page*_this.page_size)
        }
      },
      data_total(){
        return _this.tableData.length
      }

    },
    mounted(){
      var _this=this;
      //加载地图
      this.$refs.baiduMap.initMap();
      $("#map-wrapper").height(570);
      setTimeout(() => {
        this.adjustPage();
        this.getDataTableHeight()

      },100);
    },
    activated(){
      this.showVehicalList=true;
    },
    methods: {
      formatter(row,column,cellValue){
        return this.formatSeconds(cellValue)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange0(val){
        this.pageSize0 = val;
        this.queryCount(1,1)
      },
      handleSizeChange1(val) {
        this.pageSize1 = val;
        this.queryCount(2,1)
      },
      handleSizeChange2(val){
        this.pageSize2 = val;
        this.queryCount(3,1)
      },
      handleSizeChange3(val){
        this.pageSize3 = val;
        this.queryCount(4,1)
      },
      handleSizeChange4(val){
        this.pageSize4 = val;
        this.checkDetail(1)
      },
      handleCurrentChange0(val){
        this.pageIndex0 = val;
        this.queryCount(1,1)
      },
      handleCurrentChange1(val) {
        this.pageIndex1=val;
        this.queryCount(2,1)
      },
      handleCurrentChange2(val){
        this.pageIndex2=val;
        this.queryCount(3,1)
      },
      handleCurrentChange3(val){
        this.pageIndex3=val;
        this.queryCount(4,1)
      },
      handleCurrentChange4(val){
        this.pageIndex4 = val;
        this.checkDetail(1);
      },
      adjustPage(){
        this.table_height = this.elementsFlex("el_table_wrap", "main-content", "operate_wrapper", "", true) - 60;
      },
      // 设置中间表格高度
      getDataTableHeight(){
        _this.table_data_height = this.elementsFlex('_showTableData','main-content','operate_wrapper','',true) - 5
      },
      get: function (data) {
        if(this.SystemID==2){
          $('.search-input').val("_已选_"+data[0].length);
        }else {
          $('.search-input').val("_已选_"+data[0].length+"_辆_");
        }
        $('.search-input').attr('title',data[0])
        $('.search-input').attr('fguid',data[1])
        this.SelectList = data[1] // 已选的车辆FVehicleGUIDs []

      },
      getTime:function (value) {
        return this.value4=value;
      },
      // 分页大小变化时
      SizeChange(val){
        _this.page_size = val
      },
      // 选择页数发生变化时
      CurrentChange(val){
        _this.page = val
      },
      // 头部列表处理
      setHead(h,{ column, $index }){
        let obj=JSON.parse(column.label)
        return(<span title={obj.title} style="cursor: pointer;"><i class={['statu-icon',obj.value]}></i>{obj.label}</span>)
      },
     /* doQuery:function (pageSize,pageIndex) {
        var curpageIndex;
        var curpageSize;
        var _this=this;
        var FVehicleID = $(".search-input").attr("fguid");
        var startTime;
        var endTime;
        var year=new Date().getFullYear();
        var month=new Date().getMonth()+1;
        var date=new Date().getDate();
        var today=year+'-'+month+'-'+date;
        if(this.value4==''){
          startTime=this.parseUTC(today+' 00:00:00');
          endTime=this.parseUTC(today+' 23:59:59');
        }else {
          var time=this.value4.split(' - ');
          startTime=this.parseUTC(time[0]+' 00:00:00');
          endTime=this.parseUTC(time[1]+' 23:59:59');
        };
        if(arguments.length==0){
          curpageIndex=1;
          curpageSize=20
        } else {
          curpageIndex=this[pageIndex];
          curpageSize=this[pageSize]
        };
        let d1=startTime.substr(0,10).split("-")
        let t1=new Date(d1[0],d1[1]-1,d1[2]).getTime();
        let d2=endTime.substr(0,10).split("-")
        let t2=new Date(d2[0],d2[1]-1,d2[2]).getTime();
        if(t2-t1>(31*24*60*60*1000)){
          _this.$message({
            showClose: true,
            message: '开始时间与结束时间不能大于31天',
            type: 'warning'
          });
          return
        }
        if ( FVehicleID!=undefined){
          this.loading=true;
          let action;
          let action1;
          let Guids;
          if(this.SystemID==2){
            action='QueryMessageAlarmCountByFAssetGUIDs';
            action1='QueryMessageAlarmByFAssetGUIDs';
            Guids='FAssetGUIDs'
          }else {
            action='QueryMessageAlarmCountByFVehicleGUIDs';
            action1='QueryMessageAlarmByFVehicleGUIDs';
            Guids='FVehicleGUIDs'
          }
          if(arguments.length==0){
            if(this.editableTabs.length!=0){
              this.editableTabs=[];
              if(this.activeName!=="all"&&this.activeName!=="first"&&this.activeName!=="second"&&this.activeName!=="third"){
                this.activeName='all';
              }
            }
            this.pageIndex0=1;
            this.pageIndex1=1;
            this.pageIndex2=1;
            this.pageIndex3=1;
            //汇总
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":-1,"FPageSize":"'+_this.pageSize0+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                console.log(data);
                if(data.Result==104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function(){
                    _this.$store.commit("goLogin");
                  },5000)
                  return
                }else if(data.Result==200){
                  var fobj = data;
                  _this.total0 = FVehicleID.split(",").length;
                  _this.table0 = fobj.FObject.Table1;
                  if(_this.table0.length==0){
                    _this.$message({
                      showClose: true,
                      message: '_未查询到数据_',
                      type: 'warning'
                    });
                  }else {
                    $.each(_this.table0,function (index,obj) {
                      if(obj.FAlarmCount==null|| obj.FAlarmCount==0){
                        obj.FAlarmCount=0;
                        obj.FMaxSpeed="--"
                      }
                    })
                  }
                }
                _this.loading=false;
              },
              error:function () {
                console.log("请求失败")
              }
            });
            //全部
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":-1,"FPageSize":"'+_this.pageSize1+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                var fobj = data;
                var Baidu= new baidu.baiduAPI();
                _this.total1 = fobj.FObject.Table[0].FTotalCount;
                _this.table1 = fobj.FObject.Table1;
                $.each(fobj.FObject.Table1, function (index, obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                  var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table1[index],'starAdress',address);
                  });
                  Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table1[index],'endAdress',address);
                  });
                });
                $.each(_this.table1,function (index,obj) {
                  if (obj.FProcessStatus==0){
                    obj.FProcessStatus="_未处理_"
                  }else if(obj.FProcessStatus==1){
                    obj.FProcessStatus="_已处理_"
                  }
                  if(obj.FProcessContext==''||obj.FProcessContext==null){
                    obj.FProcessContext='--'
                  }
                  obj.FStartDateTime= _this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                  if(obj.FProcessDateTime){
                    obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                  }else {
                    obj.FProcessDateTime="--"
                  }
                });
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
            //未读
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":0,"FPageSize":"'+_this.pageSize3+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                var fobj = data;
                var Baidu= new baidu.baiduAPI();
                _this.total3 = fobj.FObject.Table[0].FTotalCount;
                _this.table3 = fobj.FObject.Table1;
                $.each(fobj.FObject.Table1, function (index, obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                  var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table3[index],'starAdress',address);
                  });
                  Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table3[index],'endAdress',address);
                  });
                });
                $.each(_this.table3,function (index,obj) {
                  obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                });
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
            // 已读
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":1,"FPageSize":"'+_this.pageSize2+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                var fobj = data;
                var Baidu= new baidu.baiduAPI();
                _this.total2 = fobj.FObject.Table[0].FTotalCount;
                _this.table2 = fobj.FObject.Table1;
                $.each(fobj.FObject.Table1, function (index, obj) {
                  var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                  var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                  var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                  var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                  var geoc = Baidu.GetClientGeocoder();
                  Baidu.Geoco_GetLocation(geoc, point, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table2[index],'starAdress',address);
                  });
                  Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                    var address;
                    if(json.address==''){
                      address='--'
                    }else {
                      address = json.address;
                    }
                    _this.$set(_this.table2[index],'endAdress',address);
                  });
                });
                $.each(_this.table2,function (index,obj) {
                  if(obj.FProcessContext==''||obj.FProcessContext==null){
                    obj.FProcessContext='--'
                  }
                  obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                  if(obj.FProcessDateTime){
                    obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                  }
                });
                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize0"){
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":-1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                if(data.Result==104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function(){
                    _this.$store.commit("goLogin");
                  },5000)
                  return
                }else if(data.Result==200){
                  var fobj = data;
                  _this.total0 = FVehicleID.split(",").length;
                  _this.table0 = fobj.FObject.Table1;
                  $.each(_this.table0,function (index,obj) {
                    if(obj.FAlarmCount==null){
                      obj.FAlarmCount=0;
                      obj.FMaxSpeed="--"
                    }
                  })
                }
                _this.loading=false;
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize1"){
            console.log("全部")
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":-1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                if(data.Result==104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function(){
                    _this.$store.commit("goLogin");
                  },5000)
                  return
                }else if(data.Result==200){
                  var fobj = data;
                  var Baidu= new baidu.baiduAPI();
                  _this.total1 = fobj.FObject.Table[0].FTotalCount;
                  _this.table1 = fobj.FObject.Table1;
                  $.each(fobj.FObject.Table1, function (index, obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                    var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table1[index],'starAdress',address);
                    });
                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table1[index],'endAdress',address);
                    });
                  });
                  $.each(_this.table1,function (index,obj) {
                    if (obj.FProcessStatus==0){
                      obj.FProcessStatus="_未处理_"
                    }else if(obj.FProcessStatus==1){
                      obj.FProcessStatus="_已处理_"
                    }
                    if(obj.FProcessContext==''||obj.FProcessContext==null){
                      obj.FProcessContext='--'
                    }
                    obj.FStartDateTime= _this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                    if(obj.FProcessDateTime){
                      obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                    }else {
                      obj.FProcessDateTime="--"
                    }
                  });
                }

                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize2"){
            console.log("已读")
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":1,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                if(data.Result==104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function(){
                    _this.$store.commit("goLogin");
                  },5000)
                  return
                }else if(data.Result==200){
                  var fobj = data;
                  var Baidu= new baidu.baiduAPI();
                  _this.total2 = fobj.FObject.Table[0].FTotalCount;
                  _this.table2 = fobj.FObject.Table1;
                  $.each(fobj.FObject.Table1, function (index, obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                    var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table2[index],'starAdress',address);
                    });
                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table2[index],'endAdress',address);
                    });
                  });
                  $.each(_this.table2,function (index,obj) {
                    if(obj.FProcessContext==''||obj.FProcessContext==null){
                      obj.FProcessContext='--'
                    }
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                    if(obj.FProcessDateTime){
                      obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                    }
                  });
                }

                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }else if(arguments[0]=="pageSize3"){
            console.log("未读")
            $.ajax({
              'url':_this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
              '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":0,"FPageSize":"'+curpageSize+'","FPageIndex":"'+curpageIndex+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success: function (data) {
                if(data.Result==104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function(){
                    _this.$store.commit("goLogin");
                  },5000)
                  return
                }else if(data.Result==200){
                  var fobj = data;
                  var Baidu= new baidu.baiduAPI();
                  _this.total3 = fobj.FObject.Table[0].FTotalCount;
                  _this.table3 = fobj.FObject.Table1;
                  $.each(fobj.FObject.Table1, function (index, obj) {
                    var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                    var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                    var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                    var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                    var geoc = Baidu.GetClientGeocoder();
                    Baidu.Geoco_GetLocation(geoc, point, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table3[index],'starAdress',address);
                    });
                    Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                      var address;
                      if(json.address==''){
                        address='--'
                      }else {
                        address = json.address;
                      }
                      _this.$set(_this.table3[index],'endAdress',address);
                    });
                  });
                  $.each(_this.table3,function (index,obj) {
                    obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                    obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                  });
                }

                _this.loading=false
              },
              error:function () {
                console.log("请求失败")
              }
            });
          }
        }else {
          this.$message({
            showClose: true,
            message: '_请选择车辆_/_箱号_',
            type: 'warning'
          });
        }

      },
      //查看详情
      addTab: function (index, row) {
        this.objDetail=row;
        var _this = this;
        let newTabName = ++this.tabIndex + '';
        let table = "mytable" + newTabName;
        this.editableTabs.length = 0;
        var tabName ;
        if(this.SystemID==2){
          tabName = row.FAssetID;
        }else {
          tabName = row.FVehicleName;
        }
        this.editableTabs.push({
          title: tabName,
          name: newTabName,
          table: table,
        });
        this.activeName = newTabName;
        this.checkDetail();
      },
      //查看详情时请求数据
      checkDetail:function () {
        this.loading=true;
        var _this=this;
        var startTime;
        var endTime;
        var curpageIndex = this.pageIndex4;
        var curpageSize = this.pageSize4;
        console.log(this.objDetail.carNum,curpageIndex,curpageSize)
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        var date = new Date().getDate();
        var today = year + '-' + month + '-' + date;
        if (this.value4 == '') {
          startTime=this.parseUTC(today+' 00:00:00');
          endTime=this.parseUTC(today+' 23:59:59');
        } else {
          var time = this.value4.split(' - ');
          startTime=this.parseUTC(time[0]+' 00:00:00');
          endTime=this.parseUTC(time[1]+' 23:59:59');
        }
        let action1;
        let Guids;
        var FVehicleID ;
        if(this.SystemID==2){
          action1='QueryMessageAlarmByFAssetGUIDs';
          Guids='FAssetGUIDs';
          FVehicleID = this.objDetail.FAssetGUID;
        }else {
          action1='QueryMessageAlarmByFVehicleGUIDs';
          Guids='FVehicleGUIDs';
          FVehicleID = this.objDetail.FVehicleGUID;
        }
        $.ajax({
          'url':_this.url,
          'cache': false,
          'async': true,
          'type': 'Post',
          'dataType': 'json',
          'contentType': 'application/json;charset=utf-8',
          'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"' + FVehicleID + '",' +
          '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"1","FState":-1,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
          success: function (data) {
            if(data.Result==104) {
              _this.$message({
                showClose: true,
                message: '_登录超时_,_五秒后跳转到登录页面_',
                type: 'warning'
              });
              setTimeout(function(){
                _this.$store.commit("goLogin");
              },5000)
              return
            }else if(data.Result==200){
              var fobj = data;
              var Baidu= new baidu.baiduAPI();
              _this.total4 = fobj.FObject.Table[0].FTotalCount;
              _this.mytable = fobj.FObject.Table1;
              $.each(fobj.FObject.Table1, function (index, obj) {
                var ponit0=_this.parsePointBD(new BMap.Point(obj.FStartLongitude,obj.FStartLatitude));
                var point = Baidu.GetPosition(ponit0.lng,ponit0.lat);
                var endponit=_this.parsePointBD(new BMap.Point(obj.FEndLongitude,obj.FEndLatitude));
                var point1 = Baidu.GetPosition(endponit.lng,endponit.lat);
                var geoc = Baidu.GetClientGeocoder();
                Baidu.Geoco_GetLocation(geoc, point, function (json) {
                  var address = json.address;
                  _this.$set(_this.mytable[index],'starAdress',address);
                });
                Baidu.Geoco_GetLocation(geoc, point1, function (json) {
                  var address = json.address;
                  _this.$set(_this.mytable[index],'endAdress',address);
                });
              });
              $.each(_this.mytable,function (index,obj) {
                if (obj.FProcessStatus==0){
                  obj.FProcessStatus="_未处理_"
                }else if(obj.FProcessStatus==1){
                  obj.FProcessStatus="_已处理_"
                }
                if(obj.FProcessContext==''||obj.FProcessContext==null){
                  obj.FProcessContext='--'
                }
                obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                if(obj.FProcessDateTime){
                  obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                }else {
                  obj.FProcessDateTime="--"
                }
              });
            }

            _this.loading=false
          },
          error: function () {
            console.log("请求失败")
          }
        });
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.activeName;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.activeName = 'all';
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        this.pageIndex4=1;
      },
      //设为已读
      setToRead:function () {
        var _this=this;
        var str = '';
        var temp=[];
        this.multipleSelection.forEach(obj=> {
          if(obj.FProcessStatus=="_未处理_"||obj.FProcessStatus==0){
            temp.push(obj.FGUID);
          }
        });
        str=temp.join(',');
        if(str!=''){
          $.ajax({
            'url': '/web/Common/Common_Message',
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"UpdateMessageAlarmStatus","FGUIDs":"' + str + '","FState":"1","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success:function (json) {
              if(json.Result==200){
                _this.doQuery();
                _this.$message({
                  showClose: true,
                  message: '_处理成功_',
                  type: 'success'
                });
              }else if(json.Result==104) {
                _this.$message({
                  showClose: true,
                  message: '_登录超时_,_五秒后跳转到登录页面_',
                  type: 'warning'
                });
                setTimeout(function(){
                  _this.$store.commit("goLogin");
                },5000)
                return
              }
            },
            error:function () {
              console.log("请求失败")
            }
          })
        }
      },
      getDate: function (datestr) {
        var temp = datestr.split("-");
        temp[1]=(temp[1]-1).toString();
        var date = new Date(temp[0], temp[1], temp[2]);
        return date;
      },*/
      /*async showHistory (index,row) {
        var _this=this;
        this.FVehicleName=row.FVehicleName;
        this.FStartDateTime=row.FStartDateTime;
        this.FEndDateTime=row.FEndDateTime;
        this.FKeepSeconds=this.formatSeconds(row.FKeepSeconds);
        this.startAdress=row.starAdress;
        this.endAdress=row.endAdress;
        let points=[];
        let startTime=this.parseUTC(row.FStartDateTime.replace(/T/ig,' ').substring(0,19));
        let endTime=this.parseUTC(row.FEndDateTime.replace(/T/ig,' ').substring(0,19));
        //let FTableDate=_this.timeChange(startTime).replace(/-/ig,'');
        let FTableDate=startTime.replace(/-/ig,'').substring(0,8);
        let action1;
        let Guids;
        var FVehicleID ;
        var timeArr=[];
        //获取开始时间跟结束之间的每一天
        var startTime1 = _this.getDate(startTime.slice(0, 11));
        var endTime1 = _this.getDate(endTime.slice(0, 11));
        while ((endTime1.getTime() - startTime1.getTime()) >= 0) {
          var year = startTime1.getFullYear();
          var month = (startTime1.getMonth()+1).toString().length == 1 ? "0" + (startTime1.getMonth()+1).toString(): startTime1.getMonth()+1;
          var day = startTime1.getDate().toString().length == 1 ? "0" + startTime1.getDate() : startTime1.getDate();
          var dateStr = year + "-" + month + "-" + day;
          timeArr.push(dateStr);
          startTime1.setDate(startTime1.getDate() + 1);
        }
        if(this.SystemID==2){
          action1='QueryLBSTrackListByFAssetGUID';
          Guids='FAssetGUID';
          FVehicleID = row.FAssetGUID;
        }else {
          action1='QueryLBSTrackListByFVehicleGUID';
          Guids='FVehicleGUID';
          FVehicleID = row.FVehicleGUID;
        }
        if(timeArr.length==1){
          $.ajax({
            'url':_this.url1,
            'cache':false,
            'async':true,
            'type':'Post',
            'dataType':'json',
            'contentType':'application/json;charset=utf-8',
            'data':'{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'","FStartTime":"'+startTime+'","FEndTime":"'+endTime+'","FTableDate":"'+FTableDate+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success:function (data) {
              console.log(data)
              if(data.Result==104) {
                _this.$message({
                  showClose: true,
                  message: '_登录超时_,_五秒后跳转到登录页面_',
                  type: 'warning'
                });
                setTimeout(function(){
                  _this.$store.commit("goLogin");
                },5000)
                return
              }else if(data.Result==200){
                var Fobj=data;
                Fobj.FObject=JSON.hunpack(eval(Fobj.FObject),4)
                if(Fobj.FObject.length!=0){
                  $(".mymodal").css('visibility', 'visible');
                  $.each(Fobj.FObject, function (index, obj) {
                    if(obj.FLongitude!=0&&obj.FLatitude!=0){
                      let point=_this.parsePointBD(new BMap.Point(obj.FLongitude,obj.FLatitude));
                      points.push(new BMap.Point(point.lng,point.lat))
                    }
                  });
                  _this.$refs.map.showCarRoute([],points);
                }else {
                  _this.$message({
                    showClose: true,
                    message: '_暂无位置信息_',
                    type: 'warning'
                  });
                }
              }
            },
            error:function () {
              console.log('_请求失败_')
            }
          });
        }else {
          var sTime;
          var eTime;
          var positionArr=[];
          for(var i=0;i<timeArr.length;i++){
            if(i==0){
              sTime=timeArr[i]+" "+startTime.slice(11);
              eTime=timeArr[i]+ " 23:59:59";
            }else if(i==timeArr.length-1){
              sTime=timeArr[i]+ " 00:00:00";
              eTime=timeArr[i]+" "+endTime.slice(11);
            }else {
              sTime=timeArr[i]+ " 00:00:00";
              eTime=timeArr[i]+ " 23:59:59";
            }
            FTableDate=timeArr[i].replace(/-/ig,'');
            await new Promise(resove=>{
              $.ajax({
              'url':_this.url1,
              'cache':false,
              'async':true,
              'type':'Post',
              'dataType':'json',
              'contentType':'application/json;charset=utf-8',
              'data':'{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'","FStartTime":"'+sTime+'","FEndTime":"'+eTime+'","FTableDate":"'+FTableDate+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
              success:function (data) {
                console.log(data)
                if(data.Result==104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function(){
                    _this.$store.commit("goLogin");
                  },5000)
                  return
                }else if(data.Result==200){
                  var Fobj=data;
                  if(Fobj.FObject.length!=0){
                    Fobj.FObject=JSON.hunpack(eval(Fobj.FObject),4)
                    positionArr=positionArr.concat(Fobj.FObject);
                    resove();
                    /!*         $(".mymodal").css('visibility', 'visible');
                     $.each(Fobj.FObject, function (index, obj) {
                     if(obj.FLongitude!=0&&obj.FLatitude!=0){
                     let point=_this.parsePointBD(new BMap.Point(obj.FLongitude,obj.FLatitude));
                     points.push(new BMap.Point(point.lng,point.lat))
                     }
                     });
                     _this.$refs.map.showCarRoute([],points);*!/
                  }else {
                    _this.$message({
                      showClose: true,
                      message: '_暂无位置信息_',
                      type: 'warning'
                    });
                  }
                }
              },
              error:function () {
                console.log('_请求失败_')
              }
            });
          });
          }
          $(".mymodal").css('visibility', 'visible');
          $.each(positionArr, function (index, obj) {
            if(obj.FLongitude!=0&&obj.FLatitude!=0){
              let point=_this.parsePointBD(new BMap.Point(obj.FLongitude,obj.FLatitude));
              points.push(new BMap.Point(point.lng,point.lat))
            }
          });
          _this.$refs.map.showCarRoute([],points)
        }
        /!*    let i=0;
         while (i<timeArr.length){
         if(i=0){
         let sTime=timeArr[i]
         }
         }*!/
        /!*  $.ajax({
         'url':_this.url1,
         'cache':false,
         'async':true,
         'type':'Post',
         'dataType':'json',
         'contentType':'application/json;charset=utf-8',
         'data':'{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'","FStartTime":"'+startTime+'","FEndTime":"'+endTime+'","FTableDate":"'+FTableDate+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
         success:function (data) {
         console.log(data)
         if(data.Result==104) {
         _this.$message({
         showClose: true,
         message: '_登录超时_,_五秒后跳转到登录页面_',
         type: 'warning'
         });
         setTimeout(function(){
         _this.$store.commit("goLogin");
         },5000)
         return
         }else if(data.Result==200){
         var Fobj=data;
         if(Fobj.FObject.length!=0){
         $(".mymodal").css('visibility', 'visible');
         $.each(Fobj.FObject, function (index, obj) {
         if(obj.FLongitude!=0&&obj.FLatitude!=0){
         let point=_this.parsePointBD(new BMap.Point(obj.FLongitude,obj.FLatitude));
         points.push(new BMap.Point(point.lng,point.lat))
         }
         });
         _this.$refs.map.showCarRoute([],points);
         }else {
         _this.$message({
         showClose: true,
         message: '_暂无位置信息_',
         type: 'warning'
         });
         }
         }
         },
         error:function () {
         console.log('_请求失败_')
         }
         });*!/
      },*/
     closeMymodal:function () {
        $(".mymodal").css('visibility','hidden')
        // _this.$refs.baiMap.deleteLately()
       },
      handleCommand(command) {
        $("#myinput").val(command)
      },
      //点击处理时，存取要处理的对象
      clickHandleBtn:function (row) {
        this.handleObj=row
      },
      //处理
    /*  handle: function () {
        var handleContent = $("#myinput").val();
        var FVehicleID = this.handleObj.FGUID;
        if (handleContent==''){
          this.$message({
            showClose: true,
            message: '_请输入处理方式_',
            type: 'warning'
          });
        }else {
          $.ajax({
            'url':'/web/Common/Common_Message',
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"UpdateMessageAlarmByFMessageGUID",' +
            '"FT_Message":{"FMessageGUID":"' + FVehicleID + '","FProcessStatus":"1","FProcessContext":"' + handleContent + '"},"FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (json) {
              if(json.Result==200){
                _this.doQuery();
                _this.clearText()
                _this.$message({
                  showClose: true,
                  message: '_处理成功_',
                  type: 'success'
                });
              }else if(json.Result==104) {
                _this.$message({
                  showClose: true,
                  message: '_登录超时_,_五秒后跳转到登录页面_',
                  type: 'warning'
                });
                setTimeout(function(){
                  _this.$store.commit("goLogin");
                },5000)
                return
              }
            },
            error: function () {
              console.log("请求失败")
            }
          });
        }
      },*/
      clearText(){
        $("#myinput").val("")
      },

      // 获取单个车辆详情
      getOneCarInfo(val){
        _this.$refs.velDatail.getVelInfo(val)
        // let url = "web/Common/Common_Admin"
        // let postData={
        //   FTokenID:_this.$store.state.FTokenID,
        //   FAction:"QueryAdminVehicleByFGUID",
        //   FGUID:val,
        //   FVersion:"1.0.0"
        // }
        // axios.post(url,postData).then(function (res) {
        //     console.log(res)
        // }).catch(function (error) {
        //   alert(error)
        // })
      },
      // 展现地图内容
      showMapData(val){
        console.log('map_point',val)
        _this.mapToolShow = false
        _this.FShortName = val.FShortName // 公司简称
        _this.FLockStatus = val.FLockStatus // 锁状态
        _this.FMileage = val.FMileage // 锁状态
        _this.FSpeed = val.FSpeed // 速度
        _this.FBatteryPercent = val.batteryPercent // 电量
        _this.FRecvDateTime = val.FRecvDateTime // 更新时间
        _this.FVehicleName = val.FVehicleName // 车牌号/箱号
        _this.FAssetID = val.FAssetID // 设备ID

        $(".mymodal").css('visibility', 'visible');
        let point_list = []
        let map_data_list = []
        point_list.push(val.point)
        val.assetID = val.FAssetID
        map_data_list.push(val)
        _this.$refs.baiduMap.getLatelyData( map_data_list,point_list)
        if(val.Address == '_无定位数据_'){
          _this.$refs.baiduMap.showError('_无定位数据_')
        }else {
        let Mpoint= _this.$refs.baiduMap.getMapPoint( val.point)
        _this.$refs.baiduMap.centerAndZoom( Mpoint,8)
        _this.$refs.baiduMap.centerAndZoom( Mpoint,11)
        }
      },
      // 获取胎温胎压数据
      getCarTireData(ID){
        this.tireData= {    //初始轮胎数据
          ID: null,
          time: null,
          data: []
        };
        let tireData=this.tireData;

        $.post("/web/Trailer/Trailer_LBS", {
            FTokenID: _this.$store.state.FTokenID,
            FAction: "QueryLBSMonitorTPMSByFVehicleGUID",
            FVehicleGUID: ID,
            FVersion: "1.0.0"
          },
          function (res) {
            //console.log("所选车辆胎压数据", res.Result, res.Message, res.FObject);
            if (res.Result == 104) {
              _this.$refs.map.showError("登录超时，5秒后返回登录页面");
              setTimeout(function () {
                _this.$store.commit("goLogin");
              }, 5000)
              return
            }
            if (res.Result == 200) {
              if (res.FObject.length == 0) return;
              let json = JSON.parse(res.FObject[0].FTyreContent);
              //console.log(json);
              tireData.ID = res.FObject[0].FAssetID;
              tireData.time = _this.parseGMT(res.FObject[0].FGPSDateTime);
              for (var i = 0; i < json.length; i++) {
                let obj = json[i];
                let arr = obj.S.split(',');
                let state = "";
                if (arr.indexOf('LB') != -1) state += "_低电量_; ";
                //if(arr.indexOf('BN')!=-1) state+="_电量正常_";
                if (arr.indexOf('PN') != -1) state += "_胎压正常_; ";
                if (arr.indexOf('HP') != -1) state += "_高胎压_; ";
                if (arr.indexOf('LP') != -1) state += "_低胎压_; ";

                if (arr.indexOf('LE') != -1) state += "_急泄漏_; ";
                if (arr.indexOf('L') != -1) state += "_泄露_; ";

                if (arr.indexOf('TN') != -1) state += "_胎温正常_; ";
                if (arr.indexOf('HT') != -1) state += "_高胎温_; ";
                obj.state = state
              }

              tireData.data = json;
            }
          })

      },
      // 获取的设备列表数据处理
      dataProcessing(val){
          if(val.length === 0){
            return []
          }
          for(let i = 0;i<val.length;i++){
              let each = val[i]
              let point = {
                lng: each.FLongitude,
                lat: each.FLatitude
              };

              //一些通用的字段处理，为了兼容baidu_map组件里面的字段
              each['company'] = each['FShortName']
              each['mileage'] = each['FMileage']
              each['speed'] =  each['FSpeed']
              each['batteryPercent'] = each.FBatteryPercent > 100 ? "_充电中_" :(each.FBatteryPercent==-1?"--":each.FBatteryPercent)
              each['time'] = _this.parseGMT(each.FGPSDateTime)

              each['type'] = 1 // 设备状态，默认是在线正常
            //实时车辆状态 筛选优先顺序  离线>报警>停车>运行
              if (each['FAlarmOffLine']){
                each['type'] = 3 // 离线
              }
              else if(each.FAlarmOverSpeed == 1
              || each.FLockRope == 1
              || each.FAlarmOffsetRoad == 1
              || each.FAlarmLowPower == 1
              || each.FUnCoverBack == 1
              || each.FLongTimeOpened == 1
              || each.FFivePasswordError == 1
              || each.FIllegalCard == 1
              || each.FForbiddenAreaOpen==1
              || each.FAlarmFatigue == 1){
                each['type'] = 4 //报警
              }
              else if(each['FSpeed'] == 0){
                each['type'] = 2  // 停车
              }
              each['attitude'] = null        //锁姿态  无姿态数据为null 数据格式 字符串 x轴，y轴，z轴
              if (each.FAttitude != null && each.FAttitude != '') {
                //console.log("转译前倾斜状态",oResData.FAttitude);
                each.attitude = _this.parseLockPose(each.FAttitude);

              }

              each['FGPSDateTime'] = _this.parseGMT(each['FGPSDateTime'])
              each['FRecvDateTime'] = _this.parseGMT(each['FRecvDateTime'])
              each['Address'] = '_获取位置信息中_'
              let pointCover = _this.parsePoint(_this.$store.state.globalMapType, point);
              each['point'] = pointCover
              _this.geocoder(_this.mapType,pointCover,each,'Address')
              if(each.FAttitude){
                each.attitude = _this.parseLockPose(each.FAttitude) // 锁状态
              }

              each['couplingStatus'] = each.FCouplingStatus  // 接甩锁
              each['alarmOffLine'] = each.FAlarmOffLine //离线状态
              each['couplingStatusTitle'] = ''
              //分析接甩挂title
              if (each.alarmOffLine) {
                each.couplingStatusTitle += "_离线_&"
              } else {
                each.couplingStatusTitle += "_在线_&"
              }
              if (each.couplingStatus) {
                each.couplingStatusTitle += "_接挂_"
              } else {
                each.couplingStatusTitle += "_甩挂_"
              }
              each['FIsLoaded'] = each.FBoxLoadedStatus?each.FBoxLoadedStatus==-1?"--":(each.FBoxLoadedStatus?"_重载_":"_空载_"):"--"
              each['FIsOpenDoor'] = each.FBoxDoorStatus?each.FBoxDoorStatus==-1?"--":(each.FBoxDoorStatus?"_开启_":"_关闭_"):"--"  // 箱门状态
              each['batteryPercent'] = each.FBatteryPercent > 100 ? "_充电中_" :((each.FBatteryPercent==-1||each.FBatteryPercent== null)?"--":each.FBatteryPercent)


            const isShowKeyBtn =(data)=>{
                if ((data.FAssetTypeID==701||data.FAssetTypeID==735||data.FAssetTypeID==740)&&!data.FAlarmOffLine) {
                  return true
                }else{
                  return false
                }
              }  // 判断是否支持远程开锁
              each['isShowKeyBtn'] = isShowKeyBtn(each)

              each['fuelValue'] = [] // 油位数据 以及处理方式
              each['fuel'] = 0
              each['fuelAngle'] = -112
              let fuelValue = each.fuelValue
              for (let j = 1; j < 4; j++) {
                if (each['FFuelValue' + j]>=0) {
                  let item = {
                    number: j,
                    value: each['FFuelValue' + j]
                  }
                  fuelValue.push(item);
                  // if(j == 1){
                  //   let value= each['FFuelValue' + j],
                  //     maxValue=each["FFullFuelValue"+j]>0?each["FFullFuelValue"+j]:400;
                  //   oCarPonitData.fuel=value;
                  //   oCarPonitData.fuelAngle=(value*224)/maxValue-112;
                  // }
                }
              }

              // 是否有胎温胎压数据
              each['isHaveTyreContent'] = each.FIsHaveTyreContent? parseInt(each.FIsHaveTyreContent):0 //0 无   1有

              // 温度处理
              each['FTemperature1']=each.FTemperature1&&each.FTemperature1!==-1000?each.FTemperature1+'°C':"--"//(如果是704/706则 箱外温度 -1000 不存在)
              each['FTemperature2']=each.FTemperature2&&each.FTemperature2!==-1000?each.FTemperature2+'°C':"--"//(如果是704/706则 箱外温度 -1000 不存在)
              each['FTemperature3']=each.FTemperature3&&each.FTemperature3!==-1000?each.FTemperature3+'°C':"--"
              each['FTemperature4']=each.FTemperature4&&each.FTemperature4!==-1000?each.FTemperature4+'°C':"--"


          }
          return val
      },
      /*查找已选择的车辆具体数据*/
      getSelectList(){
          let _this = this
          let url = '/web/Combine/Combine_LBS'
          let postData={
          FTokenID:_this.$store.state.FTokenID,
          FAction:"QueryLBSMonitorListByFVehicleGUIDs",
          FVehicleGUIDs:_this.SelectList.join(','),
          FMonitorParameter:"",
          FVersion:"1.0.0"
          };
          // _this.searchTips = true
          _this.treeLoading = this.$loading({
            // target:document.getElementById("select-car"),
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            customClass:"loading-bg"
          });
          axios.post(url,postData).then(function (res) {
            // _this.searchTips = false
            _this.treeLoading.close();
            console.log(res)
            if (res.data.Result == 104) {
              alert("_登录超时_，_五秒后返回登录页面_")
              setTimeout(function () {
                _this.$store.commit("goLogin");
              }, 5000)
              return
            }
            if(res.status ==200 && res.data.Result == 200){
                _this.tableData = _this.dataProcessing(res.data.FObject)
              }
          }).catch(function (error) {
            // _this.searchTips = false
            _this.treeLoading.close();
            alert(error)
          })
      }
    },
    watch: {
      screenHeight () {
        this.adjustPage();
      }
    },
    components: {
      baiduMap,
      VehicalSelectDialog,
      velDetail
      // lockSelectDialog
    },
    deactivated(){
      this.showVehicalList=false;
    }
  }
</script>
<style scoped>
  .block {
    float:left;
    margin-left:20px;

  }

  .block:nth-child(1) {
    margin-left:0;
  }



  .search-input-wrap {
    float:left;
    margin:9px 0 0 10px;
  }

  .search-input {
    float:left;
    width:120px;
    height:28px;
    border:1px solid #e6e6e6;
    line-height: 28px;
  }

  .operatExp {
    float:left;
    font-size:12px;
  }

  .get-carList-dialog {
    float:left;
    display:flex;
    justify-content:center;
    align-items:center;
    width:28px;
    height:28px;
    border:1px solid #e6e6e6;
    border-right:none;
    text-align:center;
  }
  /*按钮样式 可用于全局 也可单独用在组件，主要看以后表格内的按钮怎么命名*/
  .search {
    background-color:#005fc6;
  }
  .reset {
    background-color:#547ca9;
  }
  .export {
    background-color:#4aae58;
    padding:8px 16px;
  }
  .read {
    background-color:#f39b2a;
    padding:8px 16px;
  }

  /*fontawesome 里面字体图标的样式*/
  .fa-share-square-o {
    margin-right:3px;
  }
  .fa-envelope-open-o {
    margin-right:3px;
  }
  /*不能全局可能有些报表内部会用到饿了么的按钮组件*/
  .el-button {
    border:none;
    border-radius:0;
    padding:8px 26px;
  }
  .mybtn{
    margin: 0px;
    padding: 0px;
    height: 28px;
    border: none ;
    background: none;
  }
  .mapModal{
    position: absolute;
    height:180px;
    width:350px;
    margin-top:-180px;
    z-index: 10;
    right: 0px;
    background: white;
    border: 1px solid #cccccc
  }
  .mapModal p{
    font-size: 12px;
    margin-bottom: 6px;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .mapModal p span{
    font-weight: bold;
  }

  .searchTips {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(101, 104, 105, 0.64);
    /*opacity: 0.4;*/
    z-index: 1000;
  }
  .loading{
    background-color: white;
    line-height: 50px;
    font-size: larger;
    width: 200px;
    height: 50px;
    position: absolute;
    right: 0;
    top:0;
    left:0;
    bottom: 0;
    margin:auto;
    border-radius: 5px;
  }

  /* 头部字段选择状态图标 */
  .statu-icon{
    display: inline-block;
    width:16px;
    height: 16px;
    position: relative;
    top: 4px;
    margin-right: 4px;
    background-image: url("/static/img/LBS/status.png");
  }
  .FLocationType{
    background-position: -112px 0px;
  }
  .FSpeed{
    background-position: -80px -16px;
  }
  .FMileage{
    background-position: -16px -16px;
  }
  .FBatteryPercent{
    background-position: -80px 0px;
  }
  .FLockStatus{
    background-position: -96px -16px;
  }
  .FBoxLoadedStatus{
    background-position: 0px -16px;
  }
  .FTemperature{
    background-position: -144px -16px;
  }
  .FBoxDoorStatus{
    background-position: -128px -16px;
  }
  .FDetail{
    background-position: 0px -32px;
  }
  .FOil{
    background-position: -32px -32px;
  }
  .FSwitchDoorTimes{
    background-position: -144px 0px;
  }
  .FCouplingStatus{
    background-position: -128px 0px;
  }
  .FTireTemperature{
    background-position: -112px -16px;
  }
  .FIsLock{
    background-position: -16px -32px;
  }
  .FVehicleName{
    background-position: 0px 0px;
  }
  .FAssetID{
    background-position: -16px 0px;
  }
  .FAssetTypeID{
    background-position: -48px -16px;
  }
  .FGPSDateTime{
    background-position: -96px 0px;
  }
  .FRecvDateTime{
    background-position: -64px -16px;
  }
  .FAddress{
    background-position: -64px 0px;
  }
  .FAlarm{
    background-position: -32px 0px;
  }

  /*锁状态图标对应*/
  .normal-lock {
    background-position:0 -112px;
  }

  .abnormal-lock {
    background-position:-19px -112px;
  }

  .normal-unlock {
    background-position:-39px -112px;
  }

  .abnormal-unlock {
    background-position:-59px -112px;
  }

</style>

