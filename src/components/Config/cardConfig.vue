<template>
    <section style="height: 100%" class="row">
        <vehical-list v-on:child="get"></vehical-list>
        <div class="col-md-3" style="height: 100%;padding-left:16px;padding-right: 10px">
            <div class="carTeamList" v-show="activeName=='all'">
                <el-input class="filterInput" placeholder="_输入关键字_" v-model="filterText">
                </el-input>
                <el-tree class="filter-tree" :props="defaultProps" :highlight-current="true" :data="data3" :load="loadTree" default-expand-all
                    :filter-node-method="filterNode" :render-content="renderContent" @node-click="handleNodeClick" ref="tree">
                </el-tree>
            </div>
            <div class="carTeamList" v-show="activeName=='first'">
                <el-input class="filterInput" placeholder="_输入关键字_" v-model="filterText">
                </el-input>
                <el-tree class="filter-tree" :props="defaultProps" :highlight-current="true" :data="data3" node-key="id" show-checkbox :load="loadTree"
                    default-expand-all :filter-node-method="filterNode" :render-content="renderContent" @check-change="handleCheckChange"
                    @node-click="handleNodeClick1" ref="tree2">
                </el-tree>
            </div>
        </div>
        <div class="col-md-9 unlockPanel" style="height: 100%">
            <el-tabs v-model="activeName">
                <el-tab-pane :label="labelName" name="all">
                    <div class="authorise">
                        <div>
                            <button @click="start()" class="swingCard" :class="{start:!authorise,starting:authorise}">
                                <span>_开始刷卡_</span>
                            </button>
                            <div class="loading-img">
                                <!-- <img src="../../../static/img/cardLoading.gif" alt="" v-if="authorise"> -->
                                <span v-if="progress==0">_请稍等_，_正在开启刷卡模式_...</span>
                                <span v-if="progress==1">_刷卡模式已开启_，_请刷卡_</span>
                                <span v-if="progress==2">_刷卡模式开启失败_，_请稍后重试_</span>
                                <span v-if="progress==3">_正在关闭刷卡模式_</span>
                                <span v-if="progress==4">_关闭刷卡模式成功_</span>
                                <span v-if="progress==5">_关闭刷卡模式失败_，_请重试_</span>
                            </div>
                            <button @click="end()" class="swingCard" :class="{end:!authorise,ending:authorise}">
                                <span>_结束刷卡_</span>
                            </button>
                        </div>
                    </div>
                    <div class="el_table_wrap" id="el_table_wrap">
                        <el-table ref="table0" :data="table0" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%">
                            <el-table-column prop="RowNo" label="_序号_" align="center" width="120"></el-table-column>
                            <el-table-column prop="FCardNo" label="_授权卡号_" align="center" width="200"></el-table-column>
                            <el-table-column prop="" width="100" label="_操作_">
                                <template scope="scope">
                                    <button class="noBg mgright-10" style="border:none;font-size:16px" :disabled="scope.row.FCardNo==='_无_'" @click="authorizeCard('RemotelyCancelCard',scope.row)"
                                        title="_删除_">
                                        <i class="el-icon-delete"></i>
                                    </button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="FAuthorizeTime" label="_授权时间_" width="160"></el-table-column>
                            <el-table-column prop="" min-width="100"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="_远程卡授权_" name="first">
                    <div class="remotelyAuthorizeCard">
                        <div class="operation">
                            <span style="display: inline-block;width:86px">_授权卡号_：</span>
                            <el-autocomplete class="inline-input" v-model="cardID" :fetch-suggestions="querySearch" placeholder="_请输入卡号_">
                            </el-autocomplete>
                            <!-- <input type="text" class="mgright-10" v-model="cardID" maxlength="10">       -->
                            <button class="noBg mgright-10" @click="add()">
                                <i class="el-icon-plus"></i>_添加_</button>
                            <!--                        <button class="noBg mgright-10" ><i class="glyphicon glyphicon-refresh" ></i>_刷新_</button>
                        <button class="noBg mgright-10" @click="authorizeCard('RemotelyCancelCard')"><i class="el-icon-delete"></i>_注销_</button> -->
                            <button class="noBg mgright-10" style="width:80px" data-target="#modal" data-toggle="modal">_选择设备_</button>
                            <button class="AuthorizeBtn" @click="authorizeCard('RemotelyAuthorizeCard')">_授权_</button>
                            <span class="el-icon-circle-cross" style="position: relative;left: -350px;font-size:12px" v-if="cardID!=null&&cardID!=''"
                                @click="cardID=null"></span>
                        </div>
                        <div class="cardTableContainer">
                            <div class="cardTable">
                                <el-table :data="cardtable1" empty-text="_暂无数据_" border style="width:100%">
                                    <el-table-column prop="index" label="_序号_" align="center" width="83"></el-table-column>
                                    <el-table-column prop="cardID" label="_授权卡号_" align="center" width="123"></el-table-column>
                                    <el-table-column prop="" width="92" align="center" label="_操作_">
                                        <template scope="scope">
                                            <el-button class="el-icon-circle-close" size="mini" v-if="scope.row.cardID!=null" @click="delCarID(scope.$index,scope.row)"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="cardTable">
                                <el-table :data="cardtable2" empty-text="_暂无数据_" border style="width:100%">
                                    <el-table-column prop="index" label="_序号_" align="center" width="83"></el-table-column>
                                    <el-table-column prop="cardID" label="_授权卡号_" align="center" width="123"></el-table-column>
                                    <el-table-column prop="" width="92" align="center" label="_操作_">
                                        <template scope="scope">
                                            <el-button class="el-icon-circle-close" size="mini" v-if="scope.row.cardID!=null" @click="delCarID(scope.$index,scope.row)"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    <el-tabs v-model="activeName1" @tab-remove="removeTab">
                        <el-tab-pane label="_汇总_" name="count">
                            <div class="el_table_wrap">
                                <el-table :data="table1" ref="table1" empty-text="_暂无数据_" stripe :height="tableHeght" style="width:100%">
                                    <el-table-column prop="RowNo" label="_序号_" align="center" width="80"></el-table-column>
                                    <el-table-column prop="FAssetID" label="_电子锁_ ID" align="center" width="120"></el-table-column>
                                    <el-table-column prop="FCardCount" label="_授权卡数_" align="center" width="120"></el-table-column>
                                    <el-table-column prop="" width="90" label="_操作_">
                                        <template scope="scope">
                                            <button class="noBg mgright-10" style="border:none;font-size:16px" :disabled="!scope.row.FCardCount" @click="delAllAuthorizeCard(scope.row)"
                                                title="_删除_">
                                                <i class="el-icon-delete"></i>
                                            </button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="_详情_" width="160">
                                        <template scope="scope">
                                            <a href="javascript:void(0)" @click="detail(scope.row)">_查看详情_</a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" min-width="100"></el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" closable :label="item.title" :name="item.name">
                            <el-table ref="table2" :data="table2" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%">
                                <el-table-column prop="RowNo" label="_序号_" align="center" width="120"></el-table-column>
                                <el-table-column prop="FCardNo" label="_授权卡号_" align="center" width="200"></el-table-column>
                                <el-table-column prop="" width="100" label="_操作_">
                                    <template scope="scope">
                                        <button class="noBg mgright-10" style="border:none;font-size:16px" :disabled="scope.row.FCardNo==='_无_'" @click="authorizeCard('RemotelyCancelCard',scope.row)"
                                            title="_删除_">
                                            <i class="el-icon-delete"></i>
                                        </button>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="FAuthorizeTime" label="_授权时间_" width="160"></el-table-column>
                                <el-table-column prop="" min-width="100"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-tab-pane>
            </el-tabs>
        </div>
    </section>
</template>
<script>
    import VehicalList from 'components/dialog/vehicalList.vue'
    let _this
    export default {
        data() {
            _this = this;
            return {
                ajaxUrl: "/web/Combine/Combine_Instruction",
                restaurants: [],
                activeName: 'all',
                activeName1: 'count',
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    id: 'id',
                    disabled: 'disable'
                },
                FVehicleName: null,
                FAssetID: null,
                FAssetGUID: null,
                table_height: null,
                tableHeght: null,
                table0: [],
                table1: [],
                table2: [],
                editableTabs: [],
                timer: null,
                timer1: null,//现在刷卡时定时查询绑定的卡号（定时器）
                cardID: null,
                progress: null,//0:正在开启，1：开启成功，2：开启失败，3：正在关闭，4，关闭失败，5：关闭成功
                authorise: false,//判断是否正在授权
                url: "../../../static/img/card.png",
                labelName: "_现场卡授权_",
                cardIDArr: [],
                cardtable: [
                    {
                        index: 1,
                        cardID: null,
                    },
                    {
                        index: 2,
                        cardID: null,
                    },
                    {
                        index: 3,
                        cardID: null,
                    },
                    {
                        index: 4,
                        cardID: null,
                    },
                    {
                        index: 5,
                        cardID: null,
                    },
                    {
                        index: 6,
                        cardID: null,
                    },
                    {
                        index: 7,
                        cardID: null,
                    },
                    {
                        index: 8,
                        cardID: null,
                    },
                    {
                        index: 9,
                        cardID: null,
                    },
                    {
                        index: 10,
                        cardID: null,
                    },
                    {
                        index: 11,
                        cardID: null,
                    },
                    {
                        index: 12,
                        cardID: null,
                    },
                    {
                        index: 13,
                        cardID: null,
                    },
                    {
                        index: 14,
                        cardID: null,
                    },
                    {
                        index: 15,
                        cardID: null,
                    },
                    {
                        index: 16,
                        cardID: null,
                    },
                    {
                        index: 17,
                        cardID: null,
                    },
                    {
                        index: 18,
                        cardID: null,
                    },
                    {
                        index: 19,
                        cardID: null,
                    },
                    {
                        index: 20,
                        cardID: null,
                    }

                ]

            }
        },
        props: {
            screenHeight: Number,
        },
        activated: function () {
        },
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
                this.$refs.tree.filter(val);
            },
            screenHeight() {
                _this.adjustPage();
            },
            authorise() {
                if (this.authorise) {
                    this.timer = setInterval(() => {
                        this.QueryLockAuthorizeCard();
                    }, 3000)
                } else {
                    clearInterval(this.timer)
                }
            },
            activeName() {
                if (this.activeName === "all") {
                    setTimeout(() => {
                        this.$refs.table0.doLayout()
                    }, 0);
                } else {
                    setTimeout(() => {
                        this.$refs.table1.doLayout()
                    }, 0);
                }
            }
        },
        computed: {
            cardtable1: function () {
                return this.cardtable.slice(0, 10)
            },
            cardtable2: function () {
                return this.cardtable.slice(10)
            },
            data3() {
                function findTree(arr) {
                    for (let i = 0; i < arr.length; i++) {
                        const element = arr[i];
                        if ((element.FAssetTypeID != "701" || element.FAlarmOffLine) && element.id.indexOf("@") == -1) {
                            element.disable = true
                        } else {
                            element.disable = false
                        }
                        if (element.children) {
                            findTree(element.children)
                        }
                    }
                    return arr
                }
                var arr = JSON.parse(JSON.stringify(_this.$store.state.allCarsData))
                return findTree(arr)
            },

        },
        updated() {
            _this.adjustPage();
        },
        mounted() {
            _this.adjustPage();
            _this.restaurants = _this.loadAll();
        },
        methods: {
            renderContent(h, { node, data, store }) {
                return (
                    <span class={{ green: !data.FAlarmOffLine && data.FAlarmOffLine != null && data.id.indexOf("@") == -1, noclick: data.FAlarmOffLine || data.FAlarmOffLine == null && data.id.indexOf("@") == -1 }}>
                        <i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A") != -1}></i>
                        <i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C") != -1}></i>
                        <i class="fa fa-lock icon" v-show={data.id.indexOf("@") == -1 && !data.lockStatus}></i>
                        <i class="fa fa-unlock icon" v-show={data.id.indexOf("@") == -1 && data.lockStatus}></i>
                        <span>{data.label}</span>
                        <span v-show={data.id.indexOf("@") != -1} style="font-weight:bold">[{data.count}]</span>
                        <span style="margin-left:10px" v-show={data.id.indexOf("@") == -1 && data.subLabel}>({data.subLabel})</span>
                    </span>
                )
            },
            filterNode(value, data) {
                if (!value) return true;
                if (data.FAssetID) {
                    return data.FAssetID.indexOf(value) !== -1;
                }
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAll() {
                let arr1 = [];
                if (localStorage.cardID) {
                    let arr = localStorage.cardID.split(',');
                    for (let i = 0; i < arr.length; i++) {
                        arr1.push({ "value": arr[i] })
                    }
                }
                return arr1
            },
            handleNodeClick(data) {
                if (this.authorise) {
                    _this.$message({
                        showClose: true,
                        message: '_请先结束刷卡模式_',
                        type: 'warning'
                    });
                    return;
                }
                if (data.id.indexOf("@") === -1 && !data.FAlarmOffLine && data.FAssetTypeID == 701) {
                    this.FAssetID = data.label;
                    this.FAssetGUID = data.id;
                    this.labelName = "_现场卡授权_" + "(" + this.FAssetID + ")";
                    this.progress = null;
                    this.QueryLockAuthorizeCard();
                } else if (data.FAlarmOffLine) {
                    _this.$message({
                        showClose: true,
                        message: '_离线状态不能授权_',
                        type: 'warning'
                    });
                } else if (data.id.indexOf("@") != -1) {

                } else {
                    _this.$message({
                        showClose: true,
                        message: '_该设备不支持_',
                        type: 'warning'
                    });
                }
            },
            handleNodeClick1(data) {
                var nodeArr = this.$refs.tree2.getCheckedNodes();
                if (nodeArr.indexOf(data) == -1 && !data.FAlarmOffLine && data.FAssetTypeID == 701) {
                    _this.$refs.tree2.setChecked(data, true, true)
                } else if (data.FAlarmOffLine) {
                    _this.$message({
                        showClose: true,
                        message: '_离线状态不能授权_',
                        type: 'warning'
                    });
                } else if (data.FAssetTypeID != 701 && data.id.indexOf("@") == -1) {
                    _this.$message({
                        showClose: true,
                        message: '_该设备不支持_',
                        type: 'warning'
                    });
                } else {
                    _this.$refs.tree2.setChecked(data, false, true)
                }
            },
            adjustPage() {
                this.table_height = $('.unlockPanel').height() - 276;
                this.tableHeght = $('.unlockPanel').height() - 406;

            },
            //获取某终端已绑定的卡号
            get(data) {
                $.post(this.ajaxUrl,
                    {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryLockAuthorizeCardByFAssetGUID",
                        FAssetGUID: data[1],
                        FPageSize: 9999999,
                        FPageIndex: 1,
                        FVersion: "1.0.0"
                    },
                    function (data) {
                        console.log(data);
                        if (data.Result === 200) {
                            if (data.FObject.Table1.length) {
                                var arr = data.FObject.Table1;
                                $.each(arr, function (i, item) {
                                    if (_this.cardIDArr.length > 19) {
                                        return
                                    }
                                    if (_this.cardIDArr.indexOf(item.FCardNo) !== -1) {
                                        return false;
                                    }
                                    _this.cardIDArr.push(item.FCardNo);
                                    $.each(_this.cardtable, function (index, obj) {
                                        if (obj.cardID == null) {
                                            obj.cardID = item.FCardNo;
                                            return false;
                                        }
                                    })
                                    /*                             let obj={index:i+1,cardID:item.FAssetID}
                                                                _this.cardtable.push(obj) */
                                })
                            }
                        } else {

                        }
                    })
            },
            //  开启现场刷卡
            async start() {
                let i = 0;
                if (this.FAssetID == null) {
                    _this.$message({
                        showClose: true,
                        message: '_请选择设备_',
                        type: 'warning'
                    });
                    return
                }
                await new Promise(resove => {
                    $.post(this.ajaxUrl,
                        {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "OpenCardAuthorize",
                            FAssetID: _this.FAssetID,
                            FAssetGUID: _this.FAssetGUID,
                            FVersion: "1.0.0"
                        },
                        function (data) {
                            console.log(data)
                            if (data.Result == 200) {
                                _this.progress = 0;
                                resove()
                            }
                        }
                    )
                });
                this.timer = setInterval(function () {
                    i++;
                    if (i > 5) {
                        clearInterval(_this.timer);
                        _this.progress = 2;
                        return
                    }
                    $.post(_this.ajaxUrl,
                        {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "QueryCardAuthorizeStatus",
                            FAssetGUID: _this.FAssetGUID,
                            FVersion: "1.0.0"
                        },
                        function (data) {
                            console.log(data)
                            if (data.Result == 200 && data.FObject[0]!=undefined&& data.FObject[0].FLockAuthorizeStatus) {
                                clearInterval(_this.timer);
                                _this.url = '../../../static/img/card2.png';
                                _this.authorise = true;
                                _this.progress = 1;
                            }
                        }
                    )
                }, 2000)


            },
            //查询已授权的卡号
            QueryLockAuthorizeCard() {
                $.post(this.ajaxUrl,
                    {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryLockAuthorizeCardByFAssetGUID",
                        FAssetGUID: _this.FAssetGUID,
                        FPageSize: 9999999,
                        FPageIndex: 1,
                        FVersion: "1.0.0"
                    },
                    function (data) {
                        console.log(data);
                        if (data.Result === 200) {
                            if (data.FObject.Table1.length) {
                                _this.table0 = data.FObject.Table1;
                                $.each(_this.table0, function (index, item) {
                                    item.FAuthorizeTime = _this.parseGMT(item.FAuthorizeTime.replace(/T/ig, ' '))
                                })
                            } else {
                                _this.table0 = [];
                                /*                         _this.table0=[{
                                                            FCardNo:"_无_",
                                                            FAssetID:_this.FAssetID,
                                                            RowNo:1
                                                        }] */
                            }
                        } else {

                        }
                    })
            },
            //结束现场刷卡
            async end() {
                if (this.progress !== 1 && this.progress !== 4) {
                    return
                }
                let i = 0;
                let timer;
                if (this.FAssetID == null) {
                    _this.$message({
                        showClose: true,
                        message: '_请选择设备_',
                        type: 'warning'
                    });
                    return
                }
                await new Promise(resove => {
                    $.post(this.ajaxUrl,
                        {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "CloseCardAuthorize",
                            FAssetID: _this.FAssetID,
                            FAssetGUID: _this.FAssetGUID,
                            FVersion: "1.0.0"
                        },
                        function (data) {
                            console.log(data)
                            if (data.Result == 200) {
                                _this.progress = 3;
                                resove()
                            }
                        }
                    )
                });
                timer = setInterval(function () {
                    i++;
                    if (i > 5) {
                        clearInterval(timer);
                        _this.progress = 5;
                        return
                    }
                    $.post(_this.ajaxUrl,
                        {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "QueryCardAuthorizeStatus",
                            FAssetGUID: _this.FAssetGUID,
                            FVersion: "1.0.0"
                        },
                        function (data) {
                            if (data.Result == 200 && !data.FObject[0].FLockAuthorizeStatus) {
                                clearInterval(timer);
                                _this.authorise = false;
                                _this.url = '../../../static/img/card.png';
                                _this.QueryLockAuthorizeCard();
                                _this.progress = 4;
                            }
                        }
                    )
                }, 2000)
            },
            //添加卡号
            add() {
                if (_this.cardID.length != 10) {
                    _this.$message({
                        showClose: true,
                        message: '_您输入的卡号不正确_',
                        type: 'warning'
                    });
                    return
                }
                if (_this.cardIDArr.indexOf(_this.cardID) !== -1) {
                    _this.$message({
                        showClose: true,
                        message: '_请勿重复添加_',
                        type: 'warning'
                    });
                    return
                }
                if (typeof (Storage) !== undefined) {
                    if (localStorage.cardID) {
                        if (localStorage.cardID.indexOf(_this.cardID) == -1 && !isNaN(_this.cardID)) {
                            localStorage.cardID = _this.cardID + ',' + localStorage.cardID;
                        }
                    } else {
                        localStorage.cardID = _this.cardID
                    }
                }
                _this.cardIDArr.push(_this.cardID);
                if (_this.cardID != null && _this.cardID != "") {
                    $.each(_this.cardtable, function (index, obj) {
                        if (obj.cardID == null) {
                            obj.cardID = _this.cardID;
                            return false;
                        }
                    })
                }
            },
            delCarID(index, row) {
                let i = _this.cardIDArr.indexOf(row.cardID);
                _this.cardIDArr.splice(i, 1);
                row.cardID = null;
            },
            getCheckedNodes() {
                let lockIdArr = [];
                let nodeArr = this.$refs.tree2.getCheckedNodes();
                for (let i = 0; i < nodeArr.length; i++) {
                    if (nodeArr[i].id.indexOf("@") === -1) {
                        lockIdArr.push(nodeArr[i].id);
                    }
                }
                let lockIdStr = lockIdArr.join(",");
                if (lockIdArr.length == 0) {
                    _this.table1 = []
                    return
                }
                $.post(this.ajaxUrl,
                    {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryLockAuthorizeCardCountByFAssetGUIDs",
                        FAssetGUIDs: lockIdStr,
                        FVersion: "1.0.0"
                    },
                    function (data) {
                        console.log(data);
                        if (data.Result === 200) {
                            if (data.FObject.length) {
                                _this.table1 = data.FObject;
                            }

                            console.log(_this.table1)
                        }
                    })

            },
            handleCheckChange() {
                let fn = _this.getCheckedNodes;
                clearTimeout(fn.timer);
                fn.timer = setTimeout(() => {
                    fn.call(null)
                }, 500);
            },
            //远程授权或注销、删除
            authorizeCard(a, obj) {
                let lockIdStr, cardIDStr;
                if (obj) {//删除
                    lockIdStr = obj.FAssetID;
                    cardIDStr = obj.FCardNo;
                } else {
                    let lockIdArr = [];
                    let nodeArr = this.$refs.tree2.getCheckedNodes();
                    for (let i = 0; i < nodeArr.length; i++) {
                        if (nodeArr[i].id.indexOf("@") === -1) {
                            lockIdArr.push(nodeArr[i].label);
                        }
                    }
                    lockIdStr = lockIdArr.join(",");
                    cardIDStr = _this.cardIDArr.join(',');
                    if (lockIdArr.length == 0) {
                        _this.$message({
                            showClose: true,
                            message: '_请选择设备_',
                            type: 'warning'
                        });
                        return
                    }
                    if (_this.cardIDArr.length == 0) {
                        _this.$message({
                            showClose: true,
                            message: '_请添加卡号_',
                            type: 'warning'
                        });
                        return
                    }
                }
                $.post(this.ajaxUrl,
                    {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: a,
                        FAssetID: lockIdStr,
                        FCardIDs: cardIDStr,
                        FVersion: "1.0.0"
                    },
                    function (data) {
                        console.log(data);
                        if (data.Result === 200) {
                            _this.$message({
                                showClose: true,
                                message: '_操作成功_',
                                type: 'warning'
                            });
                            if (_this.activeName === "all") {
                                setTimeout(() => {
                                    _this.QueryLockAuthorizeCard();
                                }, 1000 * 5);
                            }
                        }
                    })

            },
            //删除所有已授权的卡
            delAllAuthorizeCard(obj) {
                $.post(this.ajaxUrl,
                    {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "RemotelyCancelAllCard",
                        FAssetID: obj.FAssetID,
                        FVersion: "1.0.0"
                    },
                    function (data) {
                        console.log(data);
                        if (data.Result === 200) {
                            _this.getCheckedNodes()
                        }
                    })
            },
            detail: function (row) {
                this.table2 = [];
                this.objDetail = row;
                var _this = this;
                let newTabName = 'detail';
                let table = "mytable";
                var tabName;

                tabName = row.FAssetID;
                this.editableTabs.length = 0;
                this.editableTabs.push({
                    title: tabName,
                    name: newTabName,
                    content: table,
                });
                this.activeName1 = newTabName;
                $.post(this.ajaxUrl,
                    {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryLockAuthorizeCardByFAssetGUID",
                        FAssetGUID: row.FAssetGUID,
                        FPageSize: 9999999,
                        FPageIndex: 1,
                        FVersion: "1.0.0"
                    },
                    function (data) {
                        console.log(data);
                        if (data.Result === 200) {
                            if (data.FObject.Table1.length) {
                                _this.table2 = data.FObject.Table1;
                            } else {
                                /*                         _this.table0=[{
                                                            FCardNo:"_无_",
                                                            FAssetID:_this.FAssetID,
                                                            RowNo:1
                                                        }] */
                            }
                        } else {

                        }
                    })
            },
            removeTab(targetName) {
                this.activeName1 = "count";
                this.editableTabs = [];
            },
        },
        activated: function () {
        },
        components: {
            VehicalList
        }
    }
</script>
<style>
    .authorise {
        height: 240px;
        width: 100%;
        padding-top: 70px;
        border-top: 1px solid #ccc;
    }

    .authorise div {
        text-align: center
    }

    .authorise .loading-img {
        display: inline-block;
        width: 240px;
    }

    .remotelyAuthorizeCard {
        height: 370px;
        padding: 20px;
        border-top: 1px solid #ccc;
    }

    .operation {
        margin-bottom: 14px;
    }

    .operation input {
        height: 28px;
        width: 170px;
    }

    .operation button {
        width: 68px;
        height: 28px;
    }

    .noBg {
        background: none;
        border: 1px solid #005fc6;
        border-radius: 2px;
        color: #005fc6;
        outline: none;
    }

    .AuthorizeBtn {
        background: #005fc6;
        border: none;
        color: white;
        border-radius: 2px
    }

    .mgright-10 {
        margin-right: 10px
    }

    .cardTableContainer {
        height: 260px;
        padding-left: 86px;
    }

    .cardTable {
        width: 300px;
        height: 286px;
        float: left;
        margin-right: 10px;
        border: 1px solid #005fc6;
    }

    .cardTable .el-table__header-wrapper thead tr th,
    .cardTable .el-table__header-wrapper thead tr th .cell {
        background: #005fc6;
        color: white;
        font-size: 12px;
    }

    .cardTable .el-table td,
    .cardTable .el-table td .cell {
        height: 24px;
        line-height: 24px;
    }

    .swingCard {
        width: 100px;
        height: 100px;
        line-height: 150px
    }

    .swingCard.start {
        background: url('../../../static/img/card.png') no-repeat center;
    }

    .swingCard.starting {
        background: url('../../../static/img/card2.png') no-repeat center;
    }

    .swingCard.end {
        background: url('../../../static/img/card3.png') no-repeat center;
    }

    .swingCard.ending {
        background: url('../../../static/img/card4.png') no-repeat center;
    }
</style>