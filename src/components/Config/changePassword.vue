<template>
    <section>
        <div class="modal fade" id="modal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="height: 32px;padding: 10px;background:#1970cf;">
                        <button type="button" class="close mybtn" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h5 class="modal-title" style="color: white" v-if="changeType==0">{{FAssetID}}</h5>
                        <h5 class="modal-title" style="color: white" v-else>_已选_{{multipleSelection.length}}_台_</h5>
                    </div>
                    <div class="modal-body" style="height: 100%;margin:20px 0">
                        <input type="text" placeholder="_请输入六位数字新密码_" style="width: 100%" id="newPsd" v-model="password" maxlength="6">
                        <!--<input type="password" placeholder="_请再次输入新密码_" style="width: 100%;margin-top: 10px" id="rePsd">-->
                        <span id="error" style="font-size: 12px;color:red;display: none">_输入的密码不符合_</span>
                    </div>
                    <div class="modal-footer" style="margin-right: 10px">
                        <button type="submit" class="btn btn-primary submit" @click="changePsd()" v-if="changeType==0">_确定_</button>
                        <button type="submit" class="btn btn-primary submit" @click="changePsds()" v-if="changeType==1">_确定_</button>
                        <button type="reset" class="btn btn-default" data-dismiss="modal">_取消_</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
        <vehical-select-dialog v-on:child="get" ref="vehicle"></vehical-select-dialog>
        <div id="operate_wrapper">
            <div class="box-header">
                <div class="block" style="margin-right: 20px">
                    <span class="operatExp">_选择设备_</span>
                    <div class="search-input-wrap" data-toggle="modal" data-target="#modal">
                        <!---->
                        <a href="javascript:;" class="get-carList-dialog">
                            <i class="fa fa-lock" style="font-size: 18px"></i>
                        </a>
                        <input type="text" class="search-input" readonly="readonly">
                    </div>
                </div>
                <div class="btnList">
                    <!-- <el-button type="primary" class="search" @click="doQuery()">_查询_</el-button> -->
                    <el-button type="primary" class="reset" @click="reset">_重置_</el-button>
                    <el-button type="primary" class="search" @click="changeType=1;password=null;" data-toggle="modal" data-target="#modal1">_修改密码_</el-button>
                </div>
            </div>
        </div>
        <div class="el_table_wrap" id="el_table_wrap">
            <!--   <div v-bind:height="table_height"> -->
            <el-table :data="table" empty-text="_暂无数据_" stripe :height="table_height" style="width:100%" @selection-change="handleSelectionChange"
                v-loading="loading" element-loading-text="_正在修改中_">
                <el-table-column type="selection" align="center" :selectable="check" width="55">
                </el-table-column>
                <el-table-column prop="" label="_序号_" align="center" width="80">
                    <template scope="scope">
                        {{scope.$index+1+pageSize*(pageIndex-1)}}
                    </template>
                </el-table-column>
                <el-table-column prop="" width="140" align="center" label="_操作_">
                    <template scope="scope">
                        <a href="javascript:" style="cursor:not-allowed;color: #cccccc " v-if="scope.row.FAlarmOffLine" title="_离线状态不可修改_">_修改密码_</a>
                        <a href="javascript:" style="cursor:not-allowed;color: #cccccc " v-else-if="scope.row.FAssetTypeID==717" title="_该设备不支持_">--</a>
                        <a href="javascript:" data-toggle="modal" data-target="#modal1" @click="change(scope.row)" v-else>_修改密码_</a>
                    </template>
                </el-table-column>
                <el-table-column prop="" width="140" align="center" label="_开启动态密码_">
                    <template scope="scope">
                        <a href="javascript:" style="cursor:not-allowed;color: #cccccc " v-if="scope.row.FAssetTypeID==717" title="_该设备不支持_">--</a>
                        <a href="javascript:" style="cursor:not-allowed;color: #cccccc " v-else-if="!scope.row.FDynamicPasswordStatus&&scope.row.FAlarmOffLine"
                            title="离线状态不可修改">_开启_</a>
                        <a href="javascript:" v-else-if="!scope.row.FDynamicPasswordStatus&&!scope.row.FAlarmOffLine" @click="OpenCloseDynamicPassword(scope.row,!scope.row.FDynamicPasswordStatus)">_开启_</a>
                        <a href="javascript:" style="cursor:not-allowed;color: #cccccc " v-else-if="scope.row.FDynamicPasswordStatus&&scope.row.FAlarmOffLine"
                            title="离线状态不可修改">_关闭_</a>
                        <a href="javascript:" v-else-if="scope.row.FDynamicPasswordStatus&&!scope.row.FAlarmOffLine" @click="OpenCloseDynamicPassword(scope.row,!scope.row.FDynamicPasswordStatus)">_关闭_</a>
                    </template>
                </el-table-column>
                <el-table-column prop="FAssetID" label="_终端号_" align="center" width="120" sortable></el-table-column>
                <el-table-column prop="FAlarmOffLine" label="_状态_" width="100" align="center" sortable>
                    <template scope="scope">
                        <span v-if="scope.row.FAlarmOffLine">_离线_</span>
                        <span v-else class="green">_在线_</span>
                    </template>
                </el-table-column>
                <el-table-column prop="FStaticPassword" label="_密码_" width="100" align="center" sortable></el-table-column>
                <el-table-column prop="FVehicleName" sortable label="_车牌号_" width="100" align="center"></el-table-column>
                <el-table-column prop="" label="_修改进度_" width="140" class-name="changeProgress">
                    <template scope="scope">
                        <span v-bind:class="{error:scope.row.progress=='_修改失败_',green:scope.row.progress=='_修改成功_'}">{{scope.row.progress}}
                            <img src="/static/img/myloading.gif" alt="" v-if="scope.row.progress=='_正在修改中_'">
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="" min-width="100"></el-table-column>
            </el-table>
            <!-- </div>  -->
        </div>
        <div class="pagination">
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30,]"
                    :page-size="pageSize" layout="prev, pager, next, jumper,total,sizes" :total="total">
                </el-pagination>
            </div>
        </div>
    </section>
</template>
<script>
    // import lockSelectDialog from "./lockSelectDialog.vue";
    import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
    let _this;
    export default {
        data() {
            _this = this;
            return {
                total: 0,
                pageSize: 20,
                pageIndex: 1,
                table_height: null,
                table: null,
                FAssetID: null,
                FAssetGUID: null,
                changeObj: null,
                loading: false,
                multipleSelection: [],
                changeType: null,
                changeNum: 0,
                password: null,
                FAssetTypeID: null,
                url: "/web/Combine/Combine_Instruction"
            };
        },
        props: {
            screenHeight: Number
        },
        mounted() {
            setTimeout(() => {
                this.adjustPage();
            }, 100);
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
                this.doQuery();
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.doQuery();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            check(row, index) {
                if (row.FAlarmOffLine || row.FAssetTypeID == 717) {
                    return false;
                } else {
                    return true;
                }
            },
            tableRowClassName(row, index) {
                if (row.FAlarmOffLine == "_在线_") {
                    return "positive-row"
                }
            },
            doQuery() {
                var FVehicleID = $(".search-input").attr("fguid");
                $.post(
                    _this.url,
                    {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryLockAndOpenPasswordInfo",
                        FAssetGUIDs: FVehicleID,
                        FPageSize: _this.pageSize,
                        FPageIndex: _this.pageIndex,
                        FVersion: "1.0.0"
                    },
                    function (json) {
                        console.log(json);
                        let totalArr = FVehicleID.split(",");
                        _this.total = totalArr.length;
                        _this.table = json.FObject;
                    }
                );
            },
            change(row) {
                $("#error").css("display", "none");
                this.changeType = 0;
                this.FAssetID = row.FAssetID;
                this.FAssetGUID = row.FAssetGUID;
                this.changeObj = row;
                this.password = null;
                this.FAssetTypeID = row.FAssetTypeID
            },
            //修改密码（单个）
            async changePsd() {
                let reg;
                let psd = this.password;
                let FAssetGUID = _this.FAssetGUID;
                let FAssetID = _this.FAssetID;
                let oldPsd = _this.changeObj.FStaticPassword;
                let i = 0;
                let timer;
                let a;
                if (this.FAssetTypeID == 735) {
                    reg = new RegExp(/^[0-6]{6}$/);
                } else {
                    reg = new RegExp(/^\d{6}$/);
                }
                if (!reg.test(psd)) {
                    $("#error").css("display", "inline");
                    if (this.FAssetTypeID == 735) {
                        $("#error").text("_输入的密码不符合_(_只能由_0-6_的数字组成的6位密码_)")
                    } else {
                        $("#error").text("_输入的密码不符合_")
                    }
                    if ($(".submit").attr("data-dismiss")) {
                        $(".submit").removeAttr("data-dismiss");
                    }
                    return
                } else {
                    $("#error").css("display", "none");
                    $(".submit").attr("data-dismiss", "modal");
                    $.each(_this.table, function (index, obj) {
                        if (obj.FAssetID == _this.FAssetID) {
                            a = index;
                            _this.$set(_this.table[index], "progress", "_正在修改中_");
                        }
                    });
                    await new Promise(resove => {
                        $.post(
                            _this.url,
                            {
                                FTokenID: _this.$store.state.FTokenID,
                                FAction: "UpdateStaticPassword",
                                FAssetID: FAssetID,
                                FNewStaticPassword: psd,
                                FOldStaticPassword: oldPsd,
                                FAssetGUID: FAssetGUID,
                                FVersion: "1.0.0"
                            },
                            function (json) {
                                if (json.Result == 200) {
                                    resove();
                                } else if (json.Result == 104) {
                                    _this.$message({
                                        showClose: true,
                                        message: "_登录超时,_五秒后跳转到登录页面_",
                                        type: "warning"
                                    });
                                    setTimeout(function () {
                                        _this.$store.commit("goLogin");
                                    }, 5000);
                                } else {
                                    _this.$set(_this.table[a], "progress", "_修改失败_");
                                }
                            }
                        );
                    });
                    timer = setInterval(function () {
                        i++;
                        if (i > 5) {
                            clearInterval(timer);
                            _this.$set(_this.table[a], "progress", "_修改失败_");
                        } else {
                            $.post(
                                _this.url,
                                {
                                    FTokenID: _this.$store.state.FTokenID,
                                    FAction: "QueryNewOpenPasswordInfo",
                                    FAssetGUID: FAssetGUID,
                                    FVersion: "1.0.0"
                                },
                                function (json) {
                                    console.log(json);
                                    if (json.Result == 200) {
                                        if (json.FObject[0].FStatus == 1) {
                                            clearInterval(timer);
                                            _this.$set(_this.table[a], "progress", "_修改成功_");
                                            _this.table[a].FStaticPassword = json.FObject[0].FStaticPassword;
                                        }
                                    } else {
                                    }
                                }
                            );
                        }
                    }, 2000);
                }
            },
            //修改密码（多个）
            async changePsds() {
                if (_this.multipleSelection.length == 0) {
                    _this.$message({
                        showClose: true,
                        message: "_请选择设备_",
                        type: "warning"
                    });
                }
                $.each(_this.multipleSelection, async function (index, obj) {
                    _this.FAssetID = obj.FAssetID;
                    _this.FAssetGUID = obj.FAssetGUID;
                    _this.changeObj = obj;
                    this.FAssetTypeID = obj.FAssetTypeID
                    _this.changePsd();
                });
            },
            async OpenCloseDynamicPassword(row, a) {
                let timer;
                let i = 0;
                _this.$set(row, "progress", "_修改中_");
                await new Promise(resove => {
                    $.post(_this.url,
                        {
                            FTokenID: _this.$store.state.FTokenID,
                            FAction: "OpenCloseDynamicPassword",
                            FAssetID: row.FAssetID,
                            FState: Number(a),
                            FVersion: "1.0.0"
                        }, function (json) {
                            if (json.Result == 200) {
                                resove()
                            } else {
                                _this.$set(row, "progress", "_修改失败_");
                            }
                        })
                });
                timer = setInterval(function () {
                    i++;
                    if (i > 5) {
                        clearInterval(timer);
                        _this.$set(row, "progress", "_修改失败_");
                    } else {
                        $.post(
                            _this.url,
                            {
                                FTokenID: _this.$store.state.FTokenID,
                                FAction: "QueryOpenCloseDynamicPasswordStatus",
                                FAssetID: row.FAssetID,
                                FAssetGUID: row.FAssetGUID,
                                FState: Number(a),
                                FVersion: "1.0.0"
                            },
                            function (json) {
                                console.log(json);
                                if (json.Result == 200) {
                                    clearInterval(timer);
                                    _this.$set(row, "progress", "_修改成功_");
                                    row.FDynamicPasswordStatus = Number(a);
                                }
                            }
                        );
                    }
                }, 2000)
            },
            adjustPage() {
                this.table_height =
                    this.elementsFlex(
                        "el_table_wrap",
                        "main-content",
                        "operate_wrapper",
                        "pagination",
                        true
                    ) - 20;
            },
            get: function (data) {
                $(".search-input").val("_已选_" + data[0].length);
                $(".search-input").attr("title", data[0]);
                $(".search-input").attr("fguid", data[1]);
                this.doQuery();
                this.$refs.vehicle.$children[1].setCheckedKeys([]);
            },
            //重置表单
            reset: function () {
                $(".search-input").val("");
                $(".search-input").removeAttr("fguid");
                this.table = null;
                this.total = 0;
                this.$refs.vehicle.$children[1].setCheckedKeys([]);
            }
        },
        watch: {
            screenHeight() {
                this.adjustPage();
            }
        },
        components: {
            // lockSelectDialog
            VehicalSelectDialog
        }
    };
</script>
<style>
    .error {
        color: red;
    }
</style>