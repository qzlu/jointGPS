<template>
    <section style="height: 100%" class="row">
        <div class="vehicleList">
            <div class="carTeamList">
                <el-input class="filterInput" placeholder="_输入关键字_" v-model="filterText">
                </el-input>
                <el-tree class="filter-tree" :props="defaultProps" :highlight-current="true" :data="data3" :filter-node-method="filterNode"
                    :render-content="renderContent" @node-click="handleNodeClick" ref="tree2">
                </el-tree>
            </div>
        </div>
        <div class="configPanel">
            <header class="configCar">{{FVehicleName}}</header>
            <div style="height: 100%;position: relative">
                <div class="configPram">
                    <ul>
                        <li>
                            <h1>1</h1>
                            <p>ID：
                                <input type="text" v-model="SensorObj.FSensorID1" maxlength="10">
                            </p>
                            <p>_时间_：{{SensorObj.FSensor1GPSDateTime}}</p>
                            <p>_温度_：{{SensorObj.FTemperature1}}
                                <span v-if="SensorObj.FTemperature1!=null">°C</span>
                            </p>
                            <p>_湿度_：{{SensorObj.FHumidity1}}
                                <span v-if="SensorObj.FHumidity1!=null">%</span>
                            </p>
                            <p>_电量_：{{SensorObj.FBattery1?SensorObj.FBattery1.toFixed(2):SensorObj.FBattery1}}
                                <span v-if="SensorObj.FBattery1!=null&&SensorObj.FBattery1<5">V</span>
                                <span v-if="SensorObj.FBattery1!=null&&SensorObj.FBattery1>5">%</span>
                            </p>
                        </li>
                        <li>
                            <h1>2</h1>
                            <p>ID：
                                <input type="text" v-model="SensorObj.FSensorID2" maxlength="10">
                            </p>
                            <p>_时间_：{{SensorObj.FSensor2GPSDateTime}}</p>
                            <p>_温度_：{{SensorObj.FTemperature2}}
                                <span v-if="SensorObj.FTemperature2!=null">°C</span>
                            </p>
                            <p>_湿度_：{{SensorObj.FHumidity2}}
                                <span v-if="SensorObj.FHumidity2!=null">%</span>
                            </p>
                            <p>_电量_：{{SensorObj.FBattery2?SensorObj.FBattery2.toFixed(2):SensorObj.FBattery2}}
                                <span v-if="SensorObj.FBattery2!=null&&SensorObj.FBattery2<5">V</span>
                                <span v-if="SensorObj.FBattery2!=null&&SensorObj.FBattery1>5">%</span>
                            </p>
                        </li>
                        <li>
                            <h1>3</h1>
                            <p>ID：
                                <input type="text" v-model="SensorObj.FSensorID3" maxlength="10">
                            </p>
                            <p>_时间_：{{SensorObj.FSensor3GPSDateTime}}</p>
                            <p>_温度_：{{SensorObj.FTemperature3}}
                                <span v-if="SensorObj.FTemperature3!=null">°C</span>
                            </p>
                            <p>_湿度_：{{SensorObj.FHumidity3}}
                                <span v-if="SensorObj.FHumidity3!=null">%</span>
                            </p>
                            <p>_电量_：{{SensorObj.FBattery3?SensorObj.FBattery3.toFixed(2):SensorObj.FBattery3}}
                                <span v-if="SensorObj.FBattery3!=null&&SensorObj.FBattery3<5">V</span>
                                <span v-if="SensorObj.FBattery3!=null&&SensorObj.FBattery1>5">%</span>
                            </p>
                        </li>
                        <li>
                            <h1>4</h1>
                            <p>ID：
                                <input type="text" v-model="SensorObj.FSensorID4" maxlength="10">
                            </p>
                            <p>_时间_：{{SensorObj.FSensor4GPSDateTime}}</p>
                            <p>_温度_：{{SensorObj.FTemperature4}}
                                <span v-if="SensorObj.FTemperature4!=null">°C</span>
                            </p>
                            <p>_湿度_：{{SensorObj.FHumidity4}}
                                <span v-if="SensorObj.FHumidity4!=null">%</span>
                            </p>
                            <p>_电量_：{{SensorObj.FBattery4?SensorObj.FBattery4.toFixed(2):SensorObj.FBattery4}}
                                <span v-if="SensorObj.FBattery4!=null&&SensorObj.FBattery4<5">V</span>
                                <span v-if="SensorObj.FBattery4!=null&&SensorObj.FBattery1>5">%</span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="saveConfig">
                    <div class="carImgContainer">
                        <img src="/static/img/position-tem.png" alt="">
                    </div>
                    <div style="text-align: center;">
                        <el-button type="primary" @click="save()">_保存配置_</el-button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import baidu from '../../js/GIS/Baidu/BaiduAPI'
    let _this
    export default {
        data() {
            _this = this;
            return {
                loading: true,
                filterText: '',
                //data3: null,
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    id: 'id',
                },
                FVehicleName: null,
                FAssetGUID: null,
                FAssetID: null,
                success: false,
                error: false,
                SensorObj: {
                    //设备ID
                    SensorID1: null,
                    SensorID2: null,
                    SensorID3: null,
                    SensorID4: null,
                    //湿度
                    humidity1: null,
                    humidity2: null,
                    humidity3: null,
                    humidity4: null,
                    //温度
                    Temperature1: null,
                    Temperature2: null,
                    Temperature3: null,
                    Temperature4: null,
                    //电量
                    electricity1: null,
                    electricity2: null,
                    electricity3: null,
                    electricity4: null,
                }
            }
        },
        activated: function () {
        },
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },
        mounted() {

        },
        updated() {
            $('.configResult').eq($('.configResult').length - 1).css("border-bottom", "1px solid #ccc")
        },
        methods: {
            renderContent(h, { node, data, store }) {
                return (
                    <span class={{ "green": !data.FAlarmOffLine && data.id.indexOf("@A") == -1 && data.id.indexOf("@B") == -1 && data.id.indexOf("@C") == -1 }} style="height:100%;width:100%">
                        <i class="fa fa-home icon fa-lg" v-show={data.id.indexOf("@A") != -1}></i>
                        <i class="fa fa-building icon" v-show={data.id.indexOf("@B") != -1}></i>
                        <i class="fa fa-flag-checkered icon" v-show={data.id.indexOf("@C") != -1}></i>
                        <i class="fa fa-truck icon" v-show={data.id.indexOf("@B") == -1 & data.id.indexOf("@A") == -1 & data.id.indexOf("@C") == -1}></i>
                        {node.label}
                        <span v-show={data.id.indexOf("@B") != -1 || data.id.indexOf("@A") != -1 || data.id.indexOf("@C") != -1} style="font-weight:bold">[{data.count}]</span>
                        <span style="margin-left:10px" v-show={data.id.indexOf("@B") == -1 && data.id.indexOf("@A") == -1 && data.id.indexOf("@C") == -1 && data.FVehicleSerialCode}>({data.FVehicleSerialCode})</span>
                        <div class={{ "configResult": true, "green": data.message == "_保存成功_" }}>
                            <i class={{ "el-icon-loading": data.message == "_正在保存_", "el-icon-circle-check": data.message == "_保存成功_", "el-icon-circle-close": data.message == "_保存失败_" }}></i>
                            <span v-show={data.ISConfigSensorid && data.message == null}>_已配置_</span> <span v-show={data.message != null}>{data.message}</span></div>
                    </span>
                )
            },
            filterNode(value, data) {
                if (!value) return true;
                if (data.label) {
                    return data.label.indexOf(value) !== -1;
                }
            },
            handleNodeClick(data) {
                if (data.id.indexOf("@A") === -1 && data.id.indexOf("@B") === -1 && data.id.indexOf("@C") === -1) {
                    _this.FVehicleName = data.label;
                    _this.FAssetGUID = data.assetID; // 设备的GUID在store.js中改为了id字段.
                    let postData = {
                        FTokenID: _this.$store.state.FTokenID,
                        FAction: "QueryBindingSensor",
                        FAssetGUID: _this.FAssetGUID,
                        FVersion: "1.0.0"
                    };
                    $.ajax({
                        "url": "/web/Combine/Combine_TempSensorconfig",
                        "cache": false,
                        "async": true,
                        "type": "post",
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
                        "data": JSON.stringify(postData),
                        success: function (json) {
                            //console.log(json);
                            if (json.FObject[0]) {
                                let obj = json.FObject[0];
                                if (obj.FTemperature1 < -50 || obj.FTemperature1 == null) {
                                    obj.FTemperature1 = null;
                                } else {
                                    obj.FTemperature1 = obj.FTemperature1.toFixed(1);
                                }
                                if (obj.FTemperature2 < -50 || obj.FTemperature2 == null) {
                                    obj.FTemperature2 = null;
                                } else {
                                    obj.FTemperature2 = obj.FTemperature2.toFixed(1);
                                }
                                if (obj.FTemperature3 < -50 || obj.FTemperature3 == null) {
                                    obj.FTemperature3 = null;
                                } else {
                                    obj.FTemperature3 = obj.FTemperature3.toFixed(1);
                                }
                                if (obj.FTemperature4 < -50 || obj.FTemperature4 == null) {
                                    obj.FTemperature4 = null;
                                } else {
                                    obj.FTemperature4 = obj.FTemperature4.toFixed(1);
                                }
                                _this.SensorObj = json.FObject[0];
                                //console.log(_this.SensorObj);
                            } else {
                                _this.SensorObj = {
                                    //设备ID
                                    SensorID1: null,
                                    SensorID2: null,
                                    SensorID3: null,
                                    SensorID4: null,
                                    //湿度
                                    humidity1: null,
                                    humidity2: null,
                                    humidity3: null,
                                    humidity4: null,
                                    //温度
                                    Temperature1: null,
                                    Temperature2: null,
                                    Temperature3: null,
                                    Temperature4: null,
                                    //电量
                                    electricity1: null,
                                    electricity2: null,
                                    electricity3: null,
                                    electricity4: null,
                                }
                            }
                            if (_this.SensorObj.FSensor1GPSDateTime != null) {
                                _this.SensorObj.FSensor1GPSDateTime = _this.parseGMT(_this.SensorObj.FSensor1GPSDateTime);
                            }
                            if (_this.SensorObj.FSensor2GPSDateTime != null) {
                                _this.SensorObj.FSensor2GPSDateTime = _this.parseGMT(_this.SensorObj.FSensor2GPSDateTime);
                            }
                            if (_this.SensorObj.FSensor3GPSDateTime != null) {
                                _this.SensorObj.FSensor3GPSDateTime = _this.parseGMT(_this.SensorObj.FSensor3GPSDateTime);
                            }
                            if (_this.SensorObj.FSensor4GPSDateTime != null) {
                                _this.SensorObj.FSensor4GPSDateTime = _this.parseGMT(_this.SensorObj.FSensor4GPSDateTime)
                            }

                            /*    _this.SensorID1=json.FObject[0].FSensorID1;
                                _this.SensorID2=json.FObject[0].FSensorID2;
                                _this.SensorID3=json.FObject[0].FSensorID3;
                                _this.SensorID4=json.FObject[0].FSensorID4;
                                _this.Temperature1=json.FObject[0].FTemperature1;
                                _this.Temperature2=json.FObject[0].FTemperature2;
                                _this.Temperature3=json.FObject[0].FTemperature3;
                                _this.Temperature4=json.FObject[0].FTemperature4;
                                _this.electricity1=json.FObject[0].FBattery1;
                                _this.electricity2=json.FObject[0].FBattery2;
                                _this.electricity3=json.FObject[0].FBattery3;
                                _this.electricity4=json.FObject[0].FBattery4;
                                 _this.humidity1=json.FObject[0].FHumidity1;
                                 _this.humidity2=json.FObject[0].FHumidity2;
                                 _this.humidity3=json.FObject[0].FHumidity3;
                                 _this.humidity4=json.FObject[0].FHumidity4;*/
                        },
                        error: function () {

                        }
                    })
                }
            },
            save() {
                function findCarTeam(data, num) {
                    if (data.FAssetGUID == _this.FAssetGUID) {
                        if (num == undefined) {
                            data.message = "_正在保存_";
                        } else if (num) {
                            data.message = "_保存成功_";
                        } else {
                            data.message = "_保存失败_";
                        }
                        return
                    }
                    if (data.children.length) {
                        for (let i = 0; i < data.children.length; i++) {
                            findCarTeam(data.children[i], num)
                        }
                    } else {
                        return
                    }
                }
                //&&(_this.SensorObj.FSensorID1||_this.SensorObj.FSensorID2||_this.SensorObj.FSensorID3||_this.SensorObj.FSensorID4)
                if (_this.FAssetGUID != '' && _this.FAssetGUID != null) {
                    if (_this.SensorObj.FSensorID1 == null) {
                        _this.SensorObj.FSensorID1 = ""
                    }
                    if (_this.SensorObj.FSensorID2 == null) {
                        _this.SensorObj.FSensorID2 = ""
                    }
                    if (_this.SensorObj.FSensorID3 == null) {
                        _this.SensorObj.FSensorID3 = ""
                    }
                    if (_this.SensorObj.FSensorID4 == null) {
                        _this.SensorObj.FSensorID4 = ""
                    }
                    //不够10位在前面补0
                    if (_this.SensorObj.FSensorID1 != "") {
                        _this.SensorObj.FSensorID1 = (Array(11).join(0) + _this.SensorObj.FSensorID1).slice(-10);
                    }
                    if (_this.SensorObj.FSensorID2 != "") {
                        _this.SensorObj.FSensorID2 = (Array(11).join(0) + _this.SensorObj.FSensorID2).slice(-10);
                    }
                    if (_this.SensorObj.FSensorID3 != "") {
                        _this.SensorObj.FSensorID3 = (Array(11).join(0) + _this.SensorObj.FSensorID3).slice(-10);
                    }
                    if (_this.SensorObj.FSensorID4 != "") {
                        _this.SensorObj.FSensorID4 = (Array(11).join(0) + _this.SensorObj.FSensorID4).slice(-10);
                    }
                    //          _this.SensorObj.FSensorID2=(Array(11).join(0)+_this.SensorObj.FSensorID2).slice(-10);
                    //          _this.SensorObj.FSensorID3=(Array(11).join(0)+_this.SensorObj.FSensorID3).slice(-10);
                    //          _this.SensorObj.FSensorID4=(Array(11).join(0)+_this.SensorObj.FSensorID4).slice(-10);
                    let temp = [];
                    for (let i = 1; i <= 4; i++) {
                        var num = eval("_this.SensorObj.FSensorID" + i);
                        if (num != "") {
                            temp.push(num);
                        };
                    }
                    let nary = temp.sort();
                    for (let i = 0; i < temp.length; i++) {
                        if (nary[i] == nary[i + 1]) {
                            _this.$message({
                                showClose: true,
                                message: '_传感器_ ID:' + nary[i] + "_请勿重复添加_",
                                type: 'warning'
                            });
                            return
                        }
                    }

                    if (_this.SensorObj.FSensorID1 > 4294967295 || _this.SensorObj.FSensorID2 > 4294967295 || _this.SensorObj.FSensorID3 > 4294967295 || _this.SensorObj.FSensorID4 > 4294967295) {
                        if (_this.SensorObj.FSensorID1 > 4294967295) {
                            _this.$message({
                                showClose: true,
                                message: '1_号传感器ID输入不正确_',
                                type: 'warning'
                            });
                        } else if (_this.SensorObj.FSensorID2 > 4294967295) {
                            _this.$message({
                                showClose: true,
                                message: '2_号传感器ID输入不正确_',
                                type: 'warning'
                            });

                        } else if (_this.SensorObj.FSensorID3 > 4294967295) {
                            _this.$message({
                                showClose: true,
                                message: '3_号传感器ID输入不正确_',
                                type: 'warning'
                            });

                        } else if (_this.SensorObj.FSensorID4 > 4294967295) {
                            _this.$message({
                                showClose: true,
                                message: '4_号传感器ID输入不正确_',
                                type: 'warning'
                            });
                        }
                        return
                    }
                    findCarTeam(_this.data3[0]);
                    let postData = {
                        FTokenID:_this.$store.state.FTokenID,
                        FAction:"UpdateBindingSensor",
                        FAssetGUID:_this.FAssetGUID ,
                        FSensorID1:_this.SensorObj.FSensorID1 ,
                        FSensorID2:_this.SensorObj.FSensorID2 ,
                        FSensorID3:_this.SensorObj.FSensorID3 ,
                        FSensorID4:_this.SensorObj.FSensorID4 ,
                        FVersion:"1.0.0"
                    };
                    $.ajax({
                        "url": "/web/Combine/Combine_TempSensorconfig",
                        "cache": false,
                        "async": true,
                        "type": "post",
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
                        "data": JSON.stringify(postData),
                        success: function (json) {
                            console.log(json)
                            if (json.Result == 200) {
                                findCarTeam(_this.data3[0], 1);
                                _this.$message({
                                    showClose: true,
                                    message: '_保存成功_!',
                                    type: 'success'
                                });
                            } else {
                                findCarTeam(_this.data3[0], 0);
                                _this.$message({
                                    showClose: true,
                                    message: '_保存失败_!',
                                    type: 'error'
                                });
                            }
                        },
                        error: function () {

                        }
                    })
                } else if (_this.FAssetGUID == '' || _this.FAssetGUID == null) {
                    _this.$message({
                        showClose: true,
                        message: '_请选择车辆_/_箱号_',
                        type: 'warning'
                    });
                } else {
                    _this.$message({
                        showClose: true,
                        message: '_请输入传感器_ ID',
                        type: 'warning'
                    });
                }
            },

        },
        computed: {
            data3() {
                return _this.$store.state.allCarsData;
            }
        },
        components: {

        }
    }
</script>
<style>
    .vehicleList {
        height: 100%;
        padding-left: 16px;
        width: 390px;
        float: left
    }

    .configResult {
        float: right;
        width: 80px;
        height: 36px;
        background: white;
        border-left: 1px solid #ccc;
        text-align: center;
    }

    .configPanel {
        border: 1px solid #cccccc;
        background: white;
        padding-left: 0px;
        height: 100%;
        margin-left: 395px;
        margin-right: 20px;
    }

    .configPanel header {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #cccccc;
    }

    .configPram {
        width: 800px;
        height: 150px;
        margin: 50px auto;

    }

    .saveConfig {
        position: absolute;
        bottom: 120px;
        width: 100%
    }

    @media screen and (max-width: 1370px) {
        .carImgContainer img {
            width: 500px;
        }
    }

    .configPram ul li {
        width: 200px;
        height: 140px;
        box-sizing: border-box;
        border-right: 1px solid #cccccc;
        float: left;
    }

    .configPram ul li h1 {
        text-align: center;
        font-size: 26px;
        color: #005fc6;
        margin-top: -20px;
    }

    .configPram ul li p {
        padding-left: 5px;
        line-height: 24px;
        font-weight: bold;
    }

    .configPram ul li input {
        width: 90px;
        margin-left: 5px;
    }

    .configCar {
        line-height: 50px;
        padding-left: 20px;
        font-size: 20px;
        font-weight: bold;
    }

    .carImgContainer {}

    .carImgContainer img {
        display: block;
        margin: 0px auto;
    }
</style>