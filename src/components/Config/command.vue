<template>
    <div>
        <div class="command-header flex-box">
            <div class="header-left flex-box">
                <el-input placeholder="_请输入关键字_" class="com-search" v-model="filterText">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button class="com-header-button clear-success" @click="clearCheck">_撤销勾选_</el-button>
            </div>
            <el-button class="com-header-button clear-success" @click="sendCommand">_发送指令_</el-button>
        </div>
        <div class="com-main">
            <div class="com-mian-left">
                <div class="list-header flex-box">
                    <p class="wh-110">_车牌_/_箱号_</p>
                    <p class="wh-110">_设备类型_</p>
                    <p class="wh-110">_设备_ID</p>
                </div>
                <div class="list-content">
                    <el-tree
                    class="filter-tree"
                    :props="defaultProps"
                    :highlight-current="true"
                    :data="data"
                    node-key="id"
                    show-checkbox
                    :load="loadTree"
                    default-expand-all
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    :render-content="renderContent"
                    @node-click="handleNodeClick"
                    @check-change="handleCheckChange"
                    ref="tree2">
                    </el-tree>
                </div>
            </div>
            <div class="com-mian-right">
                <div class="command-list">
                    <el-tree                    
                    :highlight-current="true"
                     default-expand-all
                      @node-click="selectCommand"
                    :data="commandData">

                    </el-tree>
                </div>
                <div class="command-pram">
                    <h4>{{command}}</h4>
                    <div v-if="commandID=='P01'"></div>
                    <div v-if="commandID=='P04'" class="P04">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P04.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P04.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_数据上传间隔_（_秒_）[5~600]</span><p><input type="number" v-model="P04.FUpLoadInterval" value="5" min="5" max="600"></p></li>
                            <li><span>_休眠自动唤醒间隔_（_分钟_）[30~1440]</span><p><input type="number" v-model="P04.FAwakenInterval" value="30" min="30" max="1440"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P06'" class="P06">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P06.FOperationType" label="0">0: _卡_1_查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P06.FOperationType" label="1">1: _卡_1_设置_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P06.FOperationType" label="2">2: _卡_2_查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P06.FOperationType" label="3">3: _卡_2 _设置_</el-radio></p></li>
                            <li><span>_域名或_IP_地址_</span><p><input type="text" v-model="P06.FIP"></p></li>
                            <li><span>_端口号_</span><p><input type="number" value="1024" v-model="P06.FPort"></p></li>
                            <li><span>_接入点名称_</span><p><input type="text" v-model="P06.FPort"></p></li>
                            <li><span>APN _用户名_</span><p><input type="text" v-model="P06.FAPN"></p></li>
                            <li><span>APN_密码_</span><p><input type="password" v-model="P06.FPassword"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P10'" class="P10">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P10.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P10.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_时差_（_分钟_）</span><p><input type="text" v-model="P10.FTimeDifference"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P11'">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P11.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P11.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_序号_[1~5]</span><p><input type="number" v-model="P11.FIndex" value="1" min="1" max="5"></p></li>
                            <li><span>VIP_电话号码_</span><p><input type="number" v-model="P11.FPhone" ></p></li>
                         </ul>
                    </div>
                    <div v-if="commandID=='P13'">
                    </div>
                    <div v-if="commandID=='P14'"></div>
                    <div v-if="commandID=='P15'"></div>
                    <div v-if="commandID=='P23'" class="P23">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P23.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P23.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_功能_</span><p><el-radio v-model="P23.FAwakenState" label="0">0: _取消设置_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P23.FAwakenState" label="1">1: _允许短信_、_电话可唤醒功能_</el-radio></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P37'" class="P37">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P37.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P37.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>G-sensor(mg)[63~8000]</span><p><input type="number" v-model="P37.FParameter" min="63" max="8000"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P38'" class="P38">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P38.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P38.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_时间间隔_（_分钟_）[3~180]</span><p><input type="number" v-model="P38.FParameter" min="3" max="180"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P39'"  class="P39">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="P39.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="P39.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_工作时间_（_分钟_）[3~10]</span><p><input type="number" v-model="P39.FParameter" min="3" max="10"></p></li>
                        </ul>
                    </div>
                    <!-- 暂时屏蔽 -->
                    <div v-if="commandID=='P40'" style="overflow:auto">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="radio" label="1">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: _设置_</el-radio></p></li>
                            <li><span>enter geo-fence alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>exit geo-fence alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>vibration alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>steel string cut off alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>unlocking alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>low battery alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>Open Back Cap alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>Password illegal alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                            <li><span>Swiping Car alarm</span><p><el-radio v-model="radio" label="1">0: All Close</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">1: GPRS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">2: SMS</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="radio" label="1">3: All Open</el-radio></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P43'">
                        <ul>
                            <li><span>Unlock Code value</span><p><input type="number"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='P44'">
                        <ul>
                            <li><span>Old Code </span><p><input type="number"></p></li>
                            <li><span>New Code </span><p><input type="number"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='BASE6'"  class="BASE6">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="BASE6.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE6.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_数据上传间隔_（_秒_）[5~600]</span><p><input type="number" v-model="BASE6.FUpLoadInterval" value="5" min="5" max="600"></p></li>
                            <li><span>_休眠自动唤醒间隔_（_分钟_）[30~1440]</span><p><input type="number" v-model="BASE6.FAwakenInterval" value="30" min="30" max="1440"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='BASE7'"  class="">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="BASE7.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE7.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_休眠模式_</span><p><el-radio v-model="BASE7.FSleepMode" label="0">0: RTC _可以唤醒_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE7.FSleepMode" label="1">1: _短信电话可以唤醒_</el-radio></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='BASE8'"  class="P38">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="BASE8.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE8.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_时差_（_分钟_）[-720-780]</span><p><input type="number" v-model="BASE8.FTimeDifference" min="-720" max="780"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='BASE9'"  class="">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="BASE9.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE9.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>VIP1 _手机号码_</span><p><input type="text" v-model="BASE9.FVIP1" maxlength="25"></p></li>
                            <li><span>VIP2 _手机号码_</span><p><input type="text" v-model="BASE9.FVIP2" maxlength="25"></p></li>
                            <li><span>VIP3 _手机号码_</span><p><input type="text" v-model="BASE9.FVIP3" maxlength="25"></p></li>
                            <li><span>VIP4 _手机号码_</span><p><input type="text" v-model="BASE9.FVIP4" maxlength="25"></p></li>
                            <li><span>VIP5 _手机号码_</span><p><input type="text" v-model="BASE9.FVIP5" maxlength="25"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='BASE10'" class="P06">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="BASE10.FOperationType" label="0">0:_查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE10.FOperationType" label="1">1:_设置_</el-radio></p></li>
                            <li><span>_主_ IP</span><p><input type="text" v-model="BASE10.FMainIP"></p></li>
                            <li><span>_主端口号_</span><p><input type="number" value="1024" v-model="BASE10.FMainPort"></p></li>
                            <li><span>_从_ IP</span><p><input type="text" v-model="BASE10.FSubIP"></p></li>
                            <li><span>_从端口号_</span><p><input type="number" value="1024" v-model="BASE10.FSubPort"></p></li>
                            <li><span>_接入点名称_</span><p><input type="text" v-model="BASE10.FCMNET" maxlength="32"></p></li>
                            <li><span>APN _用户名_</span><p><input type="text" v-model="BASE10.FAPN" maxlength="20"></p></li>
                            <li><span>APN _密码_</span><p><input type="password" v-model="BASE10.FPassword" maxlength="20"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='BASE21'"  class="BASE21">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="BASE21.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE21.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_加快上传频率_（_秒_）[5~43200]</span><p><input type="number" v-model="BASE21.FSpeedUp" value="5" min="5" max="43200"></p></li>
                            <li><span>_减慢上传频率_（_秒_）[15~43200]</span><p><input type="number" v-model="BASE21.FSlowDown" value="15" min="15" max="43200"></p></li>
                            <li><span>_震动唤醒模式_</span><p><el-radio v-model="BASE21.FShockModel" label="1">1: _默认_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="BASE21.FShockModel" label="2">2: _关闭_</el-radio></p></li>
                            <li><span>_低电工作模式电量_（%）[5~50]</span><p><input type="number" v-model="BASE21.FLowPower" value="5" min="5" max="50"></p></li>
                            <li><span>_唤醒时间_（_分钟_）[2~20]</span><p><input type="number" v-model="BASE21.FAwakenWork" value="2" min="2" max="20"></p></li>
                            <li><span>_唤醒源_</span><p><input type="number" v-model="BASE21.FAwakenSource" maxlength="20"></p></li>
                            <li><span>_无震动进入休眠时间_(_分钟_)[5-60]</span><p><input type="number" v-model="BASE21.FSleepTime" min="5" max="60"></p></li>
                            <li><span>_低电休眠模式_（%）[2~15]</span><p><input type="number" v-model="BASE21.FSleepModel" min="2" max="15"></p></li>

                        </ul>
                    </div>
                    <div v-if="commandID=='GSENS2'"  class="P37">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="GSENS2.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="GSENS2.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_报警值_ (mg)[500-8000]</span><p><input type="number" v-model="GSENS2.FAlarmValue" min="500" max="8000"></p></li>
                            <li><span>_唤醒值_ (mg)[63-504]</span><p><input type="number" v-model="GSENS2.FAwakenValue" min="63" max="504"></p></li>
                        </ul>
                    </div>
                    <div v-if="commandID=='ELOCK2'"  class="P38">
                        <ul>
                            <li><span>_功能_</span><p><el-radio v-model="ELOCK2.FOperationType" label="0">0: _查询_</el-radio></p></li>
                            <li><span></span><p><el-radio v-model="ELOCK2.FOperationType" label="1">1: _设置_</el-radio></p></li>
                            <li><span>_开锁提醒间隔_(_秒_)[60-600]</span><p><input type="number" v-model="ELOCK2.FRemindTime" min="60" max="600"></p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="com-table">
             <div class="command-header flex-box">
                    <div>
                       <!--  <el-button class="com-header-button broadcoast">command broadcoast</el-button> -->
                    </div>
                    <div>
                        <el-button class="com-header-button clear-success" @click="clear(0)">_清除成功_</el-button>
                        <el-button class="com-header-button clear-success" @click="clear(1)">_清除所有_</el-button>
                        <el-button class="com-header-button clear-success" @click="sendAgain">_重新发送_</el-button>
                    </div>
             </div>
            <el-table
                :data="tabelData"
                :height="tableHeght"
                style="width: 100%;height:100%"
                 @selection-change="handleSelectionChange"
                >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="FAssetID"
                label="_设备_ID"
                 width="150">
                </el-table-column>
                <el-table-column
                prop="FAssetTypeID"
                label="_设备类型_"
                width="120">
                </el-table-column>
                <el-table-column
                prop="FInsType"
                 width="120"
                label="_指令类型_">
                </el-table-column>
                <el-table-column
                prop="FInsContent"
                show-overflow-tooltip
                 width="260"
                label="_指令内容_">
                </el-table-column>
                <el-table-column
                prop="FBackContent"
                show-overflow-tooltip
                 width="260"
                label="_返回内容_">
                </el-table-column>
                <el-table-column
                prop=""
                width="120"
                label="_执行状态_">
                    <template scope="scope">
                        <span v-if="scope.row.FExecutionState">_完成_</span>
                        <span v-else>_失败_</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="FCreator"
                width="120"
                label="_操作人_">
                </el-table-column>
                <el-table-column
                prop="FSendTime"
                width="160"
                label="_发送指令时间_">
                </el-table-column>
                <el-table-column
                prop="FFinishTime"
                width="160"
                label="_指令完成时间_">
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
let _this;
export default {
    data(){
         _this=this;
        return{
            commandData:[{
                label: '701',
                id:null,
                name:"",
                children: [{
                    label: 'JT701_设置指令_',
                    name:"",
                    id:null,
                    children: [{
                    label: '(P01) _查询终端版本_',
                    name:"_查询终端版本_",
                    id:"P01",
                    },{
                    label: '(P04) _设置_/_查询数据上传间隔和休眠自动唤醒间隔_',
                    name:"_设置_/_查询数据上传间隔和休眠自动唤醒间隔_",
                    id:"P04",
                    },{
                    label: '(P06) _设置_/_查询监控中心_ IP _与端口_、APN',
                    name:"_设置_/_查询监控中心_IP_与端口_、APN",
                    id:"P06",
                    },{
                    label: '(P10) _设置_/_查询时差_',
                    name:"_设置_/_查询时差_",
                    id:"P10",
                    },{
                    label: '(P11) _设置_/_查询_ VIP _手机号码_',
                    name:"_设置_/_查询_ VIP _手机号码_",
                    id:"P11",
                    },{
                    label: '(P13) _恢复出厂设置_',
                    name:"_恢复出厂设置_",
                    id:"P13",
                    },{
                    label: "(P14) _读取终端的_ IMEI _号_",
                    name:"_读取终端的_ IMEI _号_",
                    id:"P14",
                    },{
                    label: '(P15) _终端重启指令_',
                    name:"_终端重启指令_",
                    id:"P15",
                    },{
                    label: '(P23) _短信_、_电话唤醒功能设置指令_',
                    name:"_短信_、_电话唤醒功能设置指令_",
                    id:"P23",
                    },{
                    label: '(P37) _设置_ G-sensor _参数_',
                    name:"_设置_ G-sensor _参数_",
                    id:"P37",
                    },{
                    label: '(P38) _开锁报警时间间隔设置指令_',
                    name:"_开锁报警时间间隔设置指令_",
                    id:"P38",
                    },{
                    label: '(P39) _唤醒工作时长参数设置指令_',
                    name:"_唤醒工作时长参数设置指令_",
                    id:"P39"}]
                    // },{
                    // label: '(P40) Set/Query alarm switch',
                    // name:"Set/Query alarm switch",
                    // id:"P40",
                    // },{
                    // label: '(P43) Unlock the device Remotely',
                    // name:"Unlock the device Remotely",
                    // id:"P43",
                    // },{
                    // label: '(P44) Change the Unlocking Password',
                    // name:"Change the Unlocking Password",
                    // id:"P44",
                    // }]
             }]
            },{
                label:"_通用_(701_设备不支持_)",
                id:null,
                name:"",
                children:[{
                    label:"_通用指令_",
                    id:null,
                    name:"",
                    children:[{
                        label:"(BASE6) _设置_/_查询数据上传间隔和休眠自动唤醒间隔_",
                        name:"_设置_/_查询数据上传间隔和休眠自动唤醒间隔_",
                        id:"BASE6"
                    },{
                        label:"(BASE7) _查询_/_设置终端休眠模式_",
                        name:"_查询_/_设置终端休眠模式_",
                        id:"BASE7"
                    },{
                        label:"(BASE8) _查询_/_设置终端本地时差_",
                        name:"_查询_/_设置终端本地时差_",
                        id:"BASE8"
                    },{
                        label:"(BASE9) _查询_/_设置VIP号码_",
                        name:"_查询_/_设置VIP号码_",
                        id:"BASE9"
                    },{
                        label:"(BASE10) _查询_/_设置主从_ IP _地址与端口号_ 、APN _及用户名与密码等参数_",
                        name:"_查询_/_设置主从_ IP _地址与端口号_ 、APN _及用户名与密码等参数_",
                        id:"BASE10"
                    },{
                        label:"(BASE21) _查询_/_设置工作模式管理_",
                        name:"_查询_/_设置工作模式管理_",
                        id:"BASE21"
                    },{
                        label:"(GSENS2) _查询_/_设置震动报警、唤醒值_",
                        name:"_查询_/_设置震动报警、唤醒值_",
                        id:"GSENS2"
                    },{
                        label:"(ELOCK2) _终端主动上报动态密码给平台_",
                        name:"_终端主动上报动态密码给平台_",
                        id:"ELOCK2"
                    }]
                }]
            }],//701全部指令
            commandID:null,//选中的指令类型
            command:"",//选中的指令描述
            // defaultProps:{disabled:'commandDisabel'},
            filterText:"",
            tabelData:[],
            tableHeght:null,
            GUIDArr:[],//选中的终端GUID
            checkNode:[],//选中的节点GUID
            P04:{FOperationType:"0", FUpLoadInterval:5,FAwakenInterval:30,},//p04指令参数,
            P06:{FOperationType:"0",FIP:"",FPort:1024,FAPN:"",FPassword:""},
            P10:{FOperationType:"0",FTimeDifference:""},
            P11:{FOperationType:"0",FIndex:1,FPhone:0},
            P23:{FOperationType:"0",FAwakenState:"0"},
            P37:{FOperationType:"0",FParameter:63},
            P38:{FOperationType:"0",FParameter:3},
            P39:{FOperationType:"0",FParameter:3},
            BASE6:{FAssetID:"",FOperationType:"0", FUpLoadInterval:5,FAwakenInterval:30,},
            BASE7:{FAssetID:"",FOperationType:"0", FSleepMode:"0"},
            BASE8:{FAssetID:"",FOperationType:"0", FTimeDifference:480},
            BASE9:{FAssetID:"",FOperationType:"0", FVIP1:"",FVIP2:"",FVIP3:"",FVIP4:"",FVIP5:""},
            BASE10:{FAssetID:"",FOperationType:"0", FMainIP:"",FMainPort:"",FSubIP:"",FSubPort:"",FCMNET:"",FAPN:"",FPassword:""},
            BASE21:{FAssetID:"",FOperationType:"0", FSpeedUp:5,FSlowDown:15,FShockModel:"1",FLowPower:5,FAwakenWork:2,FAwakenSource:"",FSleepTime:10,FSleepModel:5},
            GSENS2:{FAssetID:"",FOperationType:"0", FAlarmValue:500,FAwakenValue:126},
            ELOCK2:{FAssetID:"",FOperationType:"0", FRemindTime:60},
            n:0,//判断循环下发指令完成
            m:0,//判断循环下发指令完成（重新发送）
            Selection: []
           
        }
    },
    props: {
      screenHeight: Number,
    },
    beforeCreate(){

    },
    created(){

    },
    computed:{
        data(){
            return this.$store.state.allCarsData
        }
    },
    watch:{
        filterText(val) {
        this.$refs.tree2.filter(val);
        },
        screenHeight(){
            this.getTableHeght()
        },
        n(){
            if(this.n===this.GUIDArr.length){
                this.QueryCheckDevice(this.GUIDArr.join(","))
                .then(val=>{
                    setTimeout(() => {
                        $.post("/web/Combine/Combine_Instruction",{
                            FTokenID:_this.$store.state.FTokenID,
                            FAction:"QueryFExecutionState",
                            FGUIDs:val.join(","),
                            FVersion:"1.0.0"
                        },
                        function (res) {
                            $.each(res.FObject,function (index,obj) {
                                $.each(_this.tabelData,function (i,item) {
                                    if(obj.FGUID===item.FGUID){
                                        item.FExecutionState=obj.FExecutionState;
                                        item.FFinishTime=_this.parseGMT(obj.FFinishTime)
                                    }
                                })
                            })
                        })
                    }, 1000*4);
                })
                this.n=0;
            }
        },
        m(){
             if(this.m===this.Selection.length){
                this.QueryCheckDevice(this.GUIDArr.join(","))
                .then(val=>{
                    setTimeout(() => {
                        $.post("/web/Combine/Combine_Instruction",{
                            FTokenID:_this.$store.state.FTokenID,
                            FAction:"QueryFExecutionState",
                            FGUIDs:val.join(","),
                            FVersion:"1.0.0"
                        },
                        function (res) {
                            $.each(res.FObject,function (index,obj) {
                                $.each(_this.tabelData,function (i,item) {
                                    if(obj.FGUID===item.FGUID){
                                        item.FExecutionState=obj.FExecutionState;
                                        item.FFinishTime=_this.parseGMT(obj.FFinishTime)
                                    }
                                })
                            })
                        })
                    }, 1000*4);
                })
                this.m=0;
             }
        }
    },
    updated(){
        this.getTableHeght()
    },
    mounted(){
        this.$nextTick(()=>{
            this.getTableHeght()
        });
    },
    methods:{
        renderContent(h, { node, data, store }){
            return(
                <div class="" class={{green:!data.FAlarmOffLine&&data.FAlarmOffLine!=null&&data.id.indexOf("@")==-1,noclick:data.FAlarmOffLine||data.FAlarmOffLine==null&&data.id.indexOf("@")==-1,"tree-node":true,"flex-box":true}}> 
                    <div class="wh-110">{data.label}</div>
                    <div class="wh-110" style="margin-left:20px">{_this.transFAssetType(data.FAssetTypeID)}</div>
                    <div class="wh-110" style="">{data.subLabel}</div>
                </div>            )
        },
        filterNode(value, data) {
            if (!value) return true;
            if(data.label){
                return data.label.indexOf(value) !== -1;
            }
        },
        getTableHeght(){
            this.tableHeght=$(".content").height()-34*2-450;
        },
        handleNodeClick(data){
        },
        getCheckedNodes(){
            let nodeArr = this.$refs.tree2.getCheckedNodes();
            let GUIDArr=[];
            _this.checkNode=[];
            $.each(nodeArr,function (index,obj) {
                if(obj.id.indexOf("@") === -1&&obj.assetID!=null&&obj.assetID!=""){
                    GUIDArr.push(obj.assetID);
                    _this.checkNode.push(obj)
                }
            });
            this.GUIDArr=GUIDArr;
            if (!GUIDArr.length) {
                _this.tabelData=[];
                return
            }
            this.QueryCheckDevice(GUIDArr.join(","));
        },
        handleCheckChange(){
            clearTimeout(this.getCheckedNodes.timer);
            this.getCheckedNodes.timer=setTimeout(() => {
                this.getCheckedNodes()
            }, 1000);
        },
        handleSelectionChange(val) {
            this.Selection = val;
        },
        //撤销勾选
        clearCheck(){
            this.$refs.tree2.setCheckedNodes([])
        },
        selectCommand(data){
            this.commandID=data.id;
            this.command=data.name
        },
        //发送指令
        commandPram(a,obj){
            //a：指令类型，obj：终端 
            let Pram;
            let reg= "^(((\\+\\d{2}-)?0\\d{2,3}-\\d{7,8})|((\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})))$";//验证国际手机号和固话
            if (a==="P04"||a==="BASE6") {
                if(this[a].FUpLoadInterval<5||this[a].FUpLoadInterval>600){
                    _this.$message({
                        showClose: true,
                        message: '_数据上传间隔不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
                if(this[a].FAwakenInterval<30||this[a].FAwakenInterval>1440){
                    _this.$message({
                        showClose: true,
                        message: '_休眠自动唤醒间隔不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="P11"){
                if(this[a].FPhone!==""&&!!reg.test(this[a].FPhone)){
                    _this.$message({
                        showClose: true,
                        message: '_手机号码不正确_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="P37"){
                if(this.P37.FParameter<63||this.P37.FParameter>8000){
                    _this.$message({
                        showClose: true,
                        message: 'G-sensor_不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="P38"){
                if(this.P38.FParameter<3||this.P38.FParameter>180){
                    _this.$message({
                        showClose: true,
                        message: '_时间间隔不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="P39"){
                if(this.P39.FParameter<3||this.P39.FParameter>10){
                    _this.$message({
                        showClose: true,
                        message: '_工作时间不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="BASE8"){
                if(this[a].FTimeDifference<-720||this[a].FTimeDifference>780){
                    _this.$message({
                        showClose: true,
                        message: '_时差不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="BASE9"){
                if(this[a].FVIP1!==""&&!reg.test(this[a].FVIP1)){
                    _this.$message({
                        showClose: true,
                        message: '_手机号码不正确_',
                        type: 'warning'
                    });
                    return
                }
                if (this[a].FVIP2!==""&&!reg.test(this[a].FVIP2)){
                    _this.$message({
                        showClose: true,
                        message: '_手机号码不正确_',
                        type: 'warning'
                    });
                    return
                }
                if (this[a].FVIP3!==""&&!reg.test(this[a].FVIP3)){
                    _this.$message({
                        showClose: true,
                        message: '_手机号码不正确_',
                        type: 'warning'
                    });
                    return
                }
                if (this[a].FVIP4!==""&&!reg.test(this[a].FVIP4)){
                    _this.$message({
                        showClose: true,
                        message: '_手机号码不正确_',
                        type: 'warning'
                    });
                    return
                }
                if (this[a].FVIP5!==""&&!reg.test(this[a].FVIP5)){
                    _this.$message({
                        showClose: true,
                        message: '_手机号码不正确_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="BASE21"){
                if(this[a].FSpeedUp<5||this[a].FSpeedUp>43200){
                    _this.$message({
                        showClose: true,
                        message: '_加快上传频率不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
                if(this[a].FSlowDown<15||this[a].FSlowDown>43200){
                    _this.$message({
                        showClose: true,
                        message: '_减慢上传频率不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
                if(this[a].FLowPower<5||this[a].FLowPower>50){
                    _this.$message({
                        showClose: true,
                        message: '_进入低电工作模式电量不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
                if(this[a].FAwakenWork<2||this[a].FAwakenWork>20){
                    _this.$message({
                        showClose: true,
                        message: '_进入休眠时间不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="GSENS2"){
                if(this[a].FAlarmValue<500||this[a].FAlarmValue>8000){
                    _this.$message({
                        showClose: true,
                        message: '_报警值不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
                if(this[a].FAwakenValue<63||this[a].FAwakenValue>504){
                    _this.$message({
                        showClose: true,
                        message: '_唤醒值不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }else if(a==="ELOCK2"){
                if(this[a].FRemindTime<60||this[a].FRemindTime>600){
                    _this.$message({
                        showClose: true,
                        message: '_提醒时间不在有效值范围内_',
                        type: 'warning'
                    });
                    return
                }
            }
            if(a=="P04"||a=="P06"||a=="P10"||a=="P11"||a=="P23"||a.indexOf("BASE")!==-1||a=="GSENS2"||a=="ELOCK2"){
                Pram="FT_Combine_"+a
            }else if(a=="P37"||a=="P38"||a=="P39"){
                Pram="FT_Combine_Parameter"
            }else if(a==null){
                return
            }else{
                Pram=''
            }
            if(a.indexOf("P")===-1){
                _this[a].FAssetID=obj.subLabel
            }
            if (a.indexOf("P")!==-1&&obj.FAssetTypeID!==701) {
                return new Promise(resove=>{resove()})
            }
            if(a.indexOf("P")===-1&&obj.FAssetTypeID===701){
                return new Promise(resove=>{resove()})
            }
            return new Promise(resove=>{
                $.post("/web/Combine/Combine_Instruction",
                {
                    FTokenID:_this.$store.state.FTokenID,
                    FAction:"CommandInstruction",
                    FAssetGUID:obj.assetID,
                    FInsType:a,
                    [Pram]:_this[a]?_this[a]:'',
                    FVersion:"1.0.0"
                },
                function (res) {
                    console.log(res)
                    resove()
                })
            })

        },
        QueryCheckDevice(idStr){
            return new Promise(resove=>{
                $.post("/web/Combine/Combine_Instruction",
                {
                    FTokenID:_this.$store.state.FTokenID,
                    FAction:"QueryNoReadIns",
                    FAssetGUIDs:idStr,
                    FState:1,
                    FVersion:"1.0.0"
                },
                function (res) {
                    let arr=[];
                    _this.tabelData=res.FObject;
                    $.each(_this.tabelData,function (index,obj) {
                        obj.FSendTime= _this.parseGMT(obj.FSendTime);
                        obj.FFinishTime=_this.parseGMT(obj.FFinishTime);
                        arr.push(obj.FGUID)
                    })
                    resove(arr)
                })
            })
        },
        //点击发送指令
        sendCommand(){
            if (this.checkNode.length==0){
                _this.$message({
                  showClose: true,
                  message: '_请选择设备_',
                  type: 'warning'
                });
                return
            }
            if(this.commandID==null){
                _this.$message({
                  showClose: true,
                  message: '_请选择指令_',
                  type: 'warning'
                });
                return
            }
            this.n=0;
            for (let i = 0; i < this.checkNode.length; i++) {
                const obj = this.checkNode[i];
                _this.commandPram(this.commandID,obj).then(()=>{ _this.n++;})
            }
        },
        //清除
        clear(state){
            let idArr=[];
            $.each(this.Selection,function (index,obj) {
                idArr.push(obj.FGUID)
            });
            if (!idArr.length) {
                return
            }
            $.post("/web/Combine/Combine_Instruction",{
                FTokenID:_this.$store.state.FTokenID,
                FAction:"UpdateInstruction",
                FGUIDs:idArr.join(','),
                FState:state,
                FVersion:"1.0.0"
            },function (res) {
                if (res.Result===200) {
                    _this.QueryCheckDevice(_this.GUIDArr.join(","));
                }
            })
        },
        //重新发送
        sendAgain(){
            this.m=0
            $.each(this.Selection,function (index,obj) {
                console.log(obj)
                if(!obj.FExecutionState){
                    $.post("/web/Combine/Combine_Instruction",{
                        FTokenID:_this.$store.state.FTokenID,
                        FAction:"CommandAgain",
                        FGUID:obj.FGUID,
                        FAssetID:obj.FAssetID,
                        FAssetTypeID:obj.FAssetTypeID,
                        FInsContent:obj.FInsContent,
                        FVersion:"1.0.0"
                        },
                        function (res) {
                            _this.m++
                    })
                }else{
                    _this.m++
                }
            });
        }
    }
}
</script>

<style>
.flex-box{
    display: flex;
    justify-content: space-between
}
/* header start*/
.command-header{
    height: 34px;
    line-height: 34px;
    padding-right: 20px;
    /* padding: 0 20px; */
}
.header-left{
    width: 450px;
}
.command-header .com-search{
    width: 260px;
}
.command-header .com-search .el-input__inner{
    height: 30px;
    border-radius: 0px;
/*     border-top-left-radius: 8px;
    border-bottom-left-radius: 8px; */
    outline: none;
}
.command-header .el-input-group__append{
    border-radius: 0px;
}
.command-header .el-input-group__append .el-icon-search{
    color: #999;
    font-size: 16px;
}
.com-header-button{
    height: 30px!important;
    /* border-radius: 8px!important; */
    color: white!important
}
.com-reset{
    background: #ff7769!important
}
.com-send{
    background: #47d6a1!important
}
/* header end*/
/* com-main start*/
.com-main{
    height: 460px;
    /* padding: 0 20px; */
    background: white
}
.com-mian-left{
    width: 450px;
    float: left;
    height: 100%;
}
.com-mian-right{
    margin-left: 450px;
    height: 100%;
}
.com-mian-left .list-header{
    padding: 0 20px 0 60px!important;
    height: 36px;
    line-height: 36px;
    /* border-radius: 8px; */
    background: #dbecfe;
    /* color: white!important; */
    text-align: center;
}
.list-content{
    height: 424px;
    padding-bottom: 20px;
    overflow: auto
}
.tree-node{
    width: 100%
}
.wh-110{
    width: 110px;
    box-sizing: border-box
}

.command-list{
    width: 450px;
    height: 100%;
    float: left;
    border-right: 1px solid #cccccc;
    overflow: auto;
}
.command-list .el-tree-node>.el-tree-node__children{
    overflow:visible
}
.command-pram{
    height: 100%;
    margin-left: 450px;
    padding-top: 30px;
    text-align: center
}
.command-pram>div{
    width: 100%;
    height: 390px;
    overflow: auto;
    white-space: nowrap;
    margin-top: 10px
}
.command-pram ul li{
    height: 30px;
}
.command-pram ul li>span {
    display: inline-block;
    width: 120px;
    margin-right: 20px;
    text-align: right; 
}
.command-pram .P04 ul li>span,.command-pram .BASE6 ul li>span{
     width: 250px;
}
.command-pram .P23 ul li>span{
     width: 50px;
}
.command-pram .P06 ul li>span,.command-pram .P37 ul li>span{
     width: 160px;
}
.command-pram .P38 ul li>span{
    width: 200px;
}
.command-pram .P39 ul li>span{
     width: 180px;
}
.command-pram .BASE21 ul li>span{
     width: 310px;
}
.command-pram ul li>p{
    display: inline-block;
    width: 170px;
    text-align: left
}
.command-pram .P23 ul li>p{
    width: 190px;
}
.command-pram .P04 ul li>p,.command-pram .P37 ul li>p,.command-pram .P38 ul li>p,.command-pram .P39 ul li>p,.command-pram .BASE6 ul li>p{
     width: 80px;
}
.broadcoast{
    background: #16a4e3!important
}
.clear-success{
    background: #43acee!important
}
.clear-all{
    background: #ff7769!important
}
.re-send{
     background: #47d6a1!important
}

</style>
<style lang="css" scoped>
    ::-webkit-scrollbar{
        position:relative;
        width:14px;
        height:14px
    }
    ::-webkit-scrollbar-track{background-color:#ecf5ff;}
    ::-webkit-scrollbar-thumb{background-color: #ccc;}
    ::-webkit-scrollbar-thumb:hover {background-color: #999999;}
    ::-webkit-scrollbar-thumb:active {background-color: #999999;}

</style>

