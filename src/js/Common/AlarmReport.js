//报警报表公用
export default{
  install(Vue, options){
    Vue.prototype.getDate=function (datestr) {
      var temp = datestr.split("-");
      temp[1]=(temp[1]-1).toString();
      var date = new Date(temp[0], temp[1], temp[2]);
      return date;
    };
    //报警报表查看位置
    Vue.prototype.showHistory= async function (index,row) {
      if (row.FStartDateTime=="--"||row.FEndDateTime=="--"){
        this.$message({
          showClose: true,
          message: '_暂无轨迹信息_',
          type: 'warning'
        });
        return
      }
      var _this=this;
      this.FVehicleName=row.FVehicleName;
      this.FStartDateTime=row.FStartDateTime;
      this.FEndDateTime=row.FEndDateTime;
      this.FKeepSeconds=this.formatSeconds(row.FKeepSeconds);
      this.startAdress=row.starAdress;
      this.endAdress=row.endAdress;
      if (this.SystemID == 2) {
        this.FAssetID = row.FAssetID
      }
      if (row.FOpenType){
        this.FOpenType = row.FOpenType
      }
      let points=[];
      let startTime=this.parseUTC(row.FStartDateTime.replace(/T/ig,' ').substring(0,19));
      let endTime=this.parseUTC(row.FEndDateTime.replace(/T/ig,' ').substring(0,19));
      //let FTableDate=_this.timeChange(startTime).replace(/-/ig,'');
      let FTableDate=startTime.replace(/-/ig,'').substring(0,8);
      let action1;
      let Guids;
      let url;
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
        url='/web/Lock/Lock_LBS'
      }else {
        action1='QueryLBSTrackListByFVehicleGUID';
        Guids='FVehicleGUID';
        FVehicleID = row.FVehicleGUID;
        url='/web/Common/Common_LBS'
      }
      if(timeArr.length==1){
        $.ajax({
          'url':url,
          'cache':false,
          'async':true,
          'type':'Post',
          'dataType':'json',
          'contentType':'application/json;charset=utf-8',
          'data': '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"' + action1 + '","' + Guids + '":"' + FVehicleID + '","FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FTableDate":"' + FTableDate + '","FSystemType":"' + _this.$store.state.choiceSystemID + '","FState":"-1","FVersion":"1.0.0"}',
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
                  message: '_暂无轨迹信息_',
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
              'url':url,
              'cache':false,
              'async':true,
              'type':'Post',
              'dataType':'json',
              'contentType':'application/json;charset=utf-8',
              'data': '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"' + action1 + '","' + Guids + '":"' + FVehicleID + '","FStartTime":"' + sTime + '","FEndTime":"' + eTime + '","FTableDate":"' + FTableDate + '","FSystemType":"' + _this.$store.state.choiceSystemID +'","FState":"-1","FVersion":"1.0.0"}',
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
                    Fobj.FObject=JSON.hunpack(eval(Fobj.FObject),4);
                    positionArr=positionArr.concat(Fobj.FObject);
                    resove();
                  }else {
                    _this.$message({
                      showClose: true,
                      message: '_暂无轨迹信息_',
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
    };
    //排序
    Vue.prototype.sortMethod=function (a,b) {
      if(a.FKeepSeconds-b.FKeepSeconds>0){
        return true
      }else {
        return false
      }
    };
    //设置处理过的不能选择
    Vue.prototype.check=function (row,index) {
      if(row.FProcessStatus=='_未处理_'){
        return true
      }else {
        return false
      }
    };
    //重置
    Vue.prototype.reset=function () {
      $('.search-input').val('');
      $('.search-input').removeAttr('fguid');
      $('.search-input').removeAttr('title');
      this.value3=[new Date(),new Date()];
      this.table0=null;
      this.table1=null;
      this.table2=null;
      this.table3=null;
      this.editableTabs=[];
      this.total0=0;
      this.total1=0;
      this.total2=0;
      this.total3=0;
      this.total4=0;
      this.activeName='all';
      if(this.SystemID==2){
        this.$refs.lock.$children[1].setCheckedKeys([]);
      }else {
        this.$refs.vehicle.$children[1].setCheckedKeys([]);
      }
    };
    //关闭地图弹窗
    Vue.prototype.closeMymodal=function () {
      $(".mymodal").css('visibility','hidden')
    };
    Vue.prototype.queryCount=async function (a,b) {
      //a：报表分类（汇总），0：请求所有的，1：请求汇总，2：全部，3：已读，4：未读
      //b：报警类型
      var _this=this;
      var FVehicleID = $(".search-input").attr("fguid");
      var startTime;
      var endTime;
      if(arguments[2]===undefined){
        _this.removeTab("forth");
      }
      if(this.value3){
        var time0=moment(this.value3[0]).format("YYYY-MM-DD");
        var time1=moment(this.value3[1]).format("YYYY-MM-DD");
        startTime = this.parseUTC(time0 + ' 00:00:00');
        endTime = this.parseUTC(time1 + ' 23:59:59');
      }else{
        _this.$message({
          showClose: true,
          message: '_请选择时间_',
          type: 'warning'
        });
        return
      }
      let t1=new Date(this.value3[0]).getTime();
      let t2 = new Date(this.value3[1]).getTime();
      if(t2-t1>(31*24*60*60*1000)){
        _this.$message({
          showClose: true,
          message: '_开始时间与结束时间不能大于31天_',
          type: 'warning'
        });
        return
      }
      if ( FVehicleID!=undefined&&FVehicleID!=""){
        this.loading=true;
        let action;
        let action1;
        let Guids;
        if(this.SystemID==2){
          action='QueryMessageAlarmCountByFAssetGUIDs';
          action1='QueryMessageAlarmByFAssetGUIDs';
          Guids='FAssetGUIDs'
        }else if(this.SystemID==7){
          action="QueryMessageAlarmCountByFAssetGUIDs";
          action1="QueryMessageAlarmByFAssetGUIDs";
          Guids='FAssetGUIDs';
        }else {
          action='QueryMessageAlarmCountByFVehicleGUIDs';
          action1='QueryMessageAlarmByFVehicleGUIDs';
          Guids='FVehicleGUIDs'
        }
        if(a==0){
          if(this.editableTabs.length!=0){
            // this.editableTabs=[];
            // if(this.activeName!=="all"&&this.activeName!=="first"&&this.activeName!=="second"&&this.activeName!=="third"){
            //   this.activeName='all';
            // }
            this.checkDetail(b);
          }
          this.pageIndex0=1;
          this.pageIndex1=1;
          this.pageIndex2=1;
          this.pageIndex3=1;
          this.pageIndex4=1;
          this.tabel0=[];
          this.tabel1=[];
          this.tabel2=[];
          this.tabel3=[];
          //汇总
          $.ajax({
            'url':_this.url,
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action+'","'+Guids+'":"'+FVehicleID+'",' +
            '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+b+'","FState":-1,"FPageSize":"'+_this.pageSize0+'","FPageIndex":"'+_this.pageIndex0+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (data) {
              _this.loading = false;
                console.log(data);
                if (data.Result == 104) {
                  _this.$message({
                    showClose: true,
                    message: '_登录超时_,_五秒后跳转到登录页面_',
                    type: 'warning'
                  });
                  setTimeout(function () {
                    _this.$store.commit("goLogin");
                  }, 5000)
                  return
                } else if (data.Result == 200) {
                  var fobj = data;
                  _this.total0 = FVehicleID.split(",").length;
                  _this.table0 = fobj.FObject.Table1 ? fobj.FObject.Table1:[];
                  if (_this.table0.length == 0) {
                    _this.$message({
                      showClose: true,
                      message: '_未查询到数据_',
                      type: 'warning'
                    });
                  } else {
                    $.each(_this.table0, function (index, obj) {
                      if (obj.FAlarmCount == null) {
                        obj.FAlarmCount = 0;
                        obj.FMaxSpeed = "--"
                      }
                    })
                  }
                }
            },
            error:function () {
              console.log("请求失败")
            }
          });
          //全部
          await new Promise(resove=>{
            $.ajax({
              'url': _this.url,
              'cache': false,
              'async': true,
              'type': 'Post',
              'dataType': 'json',
              'contentType': 'application/json;charset=utf-8',
              'data': '{"FTokenID":"' + _this.$store.state.FTokenID + '","FAction":"' + action1 + '","' + Guids + '":"' + FVehicleID + '",' +
                '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"' + b + '","FState":-1,"FPageSize":"' + _this.pageSize1 + '","FPageIndex":"' + _this.pageIndex1 + '","FSystemType":"' + _this.$store.state.choiceSystemID + '","FVersion":"1.0.0"}',
              success: function (data) {
                var fobj = data;
                _this.total1 = fobj.FObject.Table[0].FTotalCount;
                _this.table1 = fobj.FObject.Table1;
                $.each(_this.table1, function (index, obj) {
                  if (obj.FProcessStatus == 0) {
                    obj.FProcessStatus = "_未处理_"
                  } else if (obj.FProcessStatus == 1) {
                    obj.FProcessStatus = "_已处理_"
                  }
                  if (obj.FProcessContext == '' || obj.FProcessContext == null) {
                    obj.FProcessContext = '--'
                  }
                  obj.FStartDateTime = _this.parseGMT(obj.FStartDateTime.replace(/T/ig, ' '));
                  obj.FEndDateTime = _this.parseGMT(obj.FEndDateTime.replace(/T/ig, ' '));
                  if (obj.FProcessDateTime) {
                    obj.FProcessDateTime = _this.parseGMT(obj.FProcessDateTime.replace(/T/ig, ' '));
                  } else {
                    obj.FProcessDateTime = "--"
                  }
                  _this.$set(obj, "starAdress", null);
                  _this.$set(obj, "endAdress", null);
                  _this.getUsableData1(obj);
                  if (obj.FStartLatitude > 0 && obj.FStartLongitude > 0) {
                    var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                    _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                  }
                  if (obj.FEndLatitude > 0 && obj.FEndLongitude > 0) {
                    var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                    _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "endAdress");
                  }
              /*     var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                  var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress"); */
                  if (obj.FDescribeJSON && b != 6) {
                    obj.FDescribeJSON = $.parseJSON(obj.FDescribeJSON);
                    obj.FDescribeJSON.sort(function (a, b) {
                      return a.N - b.N
                    });
                    $.each(obj.FDescribeJSON, function (i, item) {
                      if (item.S) {
                        let arr = item.S.split(',');
                        item.S = arr;
                      }
                    });
                  }
                });
                console.log(_this.table1)
                resove()
              },
              error: function () {
                console.log("请求失败")
              }
            });
          })
          //未读
          $.ajax({
            'url':_this.url,
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
            '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+b+'","FState":0,"FPageSize":"'+_this.pageSize3+'","FPageIndex":"'+_this.pageIndex3+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (data) {
              _this.loading = false;
                var fobj = data;
                _this.total3 = fobj.FObject.Table[0].FTotalCount;
                _this.table3 = fobj.FObject.Table1;
                $.each(_this.table3, function (index, obj) {
                  obj.FStartDateTime = _this.parseGMT(obj.FStartDateTime.replace(/T/ig, ' '));
                  obj.FEndDateTime = _this.parseGMT(obj.FEndDateTime.replace(/T/ig, ' '));
                /*   _this.$set(obj, "starAdress", null);
                  _this.$set(obj, "endAdress", null);
                  var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                  var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress"); */
                  if (obj.FDescribeJSON && b != 6) {
                    obj.FDescribeJSON = $.parseJSON(obj.FDescribeJSON);
                    obj.FDescribeJSON.sort(function (a, b) {
                      return a.N - b.N
                    });
                    $.each(obj.FDescribeJSON, function (i, item) {
                      if (item.S) {
                        let arr = item.S.split(',');
                        item.S = arr;
                      }
                    });
                  }
                  _this.$set(obj, "starAdress", null);
                  _this.$set(obj, "endAdress", null);
                  _this.getUsableData1(obj);
                  //过滤相同地址重复解析
                  $.each(_this.table1,function (i,item) {
                    if (obj.FStartLatitude == item.FStartLatitude && obj.FStartLongitude == item.FStartLongitude) {
                      obj.starAdress = item.starAdress;
                    }
                    if (obj.FEndLatitude == item.FEndLatitude && obj.FEndLongitude == item.FEndLongitude) {
                      obj.starAdress = item.starAdress;
                    }
                  });
                  if (obj.starAdress == null && obj.FStartLatitude > 0 && obj.FStartLongitude > 0){
                    var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                    _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                  }
                  if (obj.endAdress == null && obj.FEndLatitude > 0 && obj.FEndLongitude > 0) {
                    var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                    _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "endAdress");
                  }
                });            
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
            '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+b+'","FState":1,"FPageSize":"'+_this.pageSize2+'","FPageIndex":"'+_this.pageIndex2+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (data) {
              _this.loading = false;
              var fobj = data;
              _this.total2 = fobj.FObject.Table[0].FTotalCount;
              _this.table2 = fobj.FObject.Table1;
              $.each(_this.table2,function (index,obj) {
                if(obj.FProcessContext==''||obj.FProcessContext==null){
                  obj.FProcessContext='--'
                }
                obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                if(obj.FProcessDateTime){
                  obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                }
            /*     _this.$set(obj, "starAdress", null);
                _this.$set(obj, "endAdress", null);
                var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress"); */
                if (obj.FDescribeJSON && b != 6) {
                  obj.FDescribeJSON = $.parseJSON(obj.FDescribeJSON);
                  obj.FDescribeJSON.sort(function (a, b) {
                    return a.N - b.N
                  });
                  $.each(obj.FDescribeJSON, function (i, item) {
                    if (item.S) {
                      let arr = item.S.split(',');
                      item.S = arr;
                    }
                  });
                }
                _this.$set(obj, "starAdress", null);
                _this.$set(obj, "endAdress", null);
                _this.getUsableData1(obj);
                //过滤相同地址重复解析
                $.each(_this.table1, function (i, item) {
                  if (obj.FStartLatitude == item.FStartLatitude && obj.FStartLongitude == item.FStartLongitude) {
                    obj.starAdress = item.starAdress;
                  }
                  if (obj.FEndLatitude == item.FEndLatitude && obj.FEndLongitude == item.FEndLongitude) {
                    obj.starAdress = item.starAdress;
                  }
                });
                if (obj.starAdress == null && obj.FStartLatitude != null && obj.FStartLongitude != null) {
                  var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                }
                if (obj.endAdress == null && obj.FEndLatitude != null && obj.FEndLongitude != null) {
                  var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "endAdress");
                }
              });
            },
            error:function () {
              console.log("请求失败")
            }
          });
        }else if (a==1){
          $.ajax({
            'url':_this.url,
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action+'","'+Guids+'":"'+FVehicleID+'",' +
            '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+b+'","FState":-1,"FPageSize":"'+_this.pageSize0+'","FPageIndex":"'+_this.pageIndex0+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (data) {
              _this.loading = false;
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
                    if(obj.FAlarmCount==null){
                      obj.FAlarmCount=0
                    }
                  })
                }
              }
              
            },
            error:function () {
              console.log("请求失败")
            }
          });
        }else if(a==2){
          $.ajax({
            'url':_this.url,
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
            '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+b+'","FState":-1,"FPageSize":"'+_this.pageSize1+'","FPageIndex":"'+_this.pageIndex1+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (data) {
              _this.loading = false;
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
                _this.total1 = fobj.FObject.Table[0].FTotalCount;
                _this.table1 = fobj.FObject.Table1;
                $.each(_this.table1,function (index,obj) {
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
                  _this.$set(obj,"starAdress",null);
                  _this.$set(obj, "endAdress", null);
                  _this.getUsableData1(obj);
                  var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                  var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress");
                  if (obj.FDescribeJSON && b != 6) {
                    obj.FDescribeJSON = $.parseJSON(obj.FDescribeJSON);
                    obj.FDescribeJSON.sort(function (a, b) {
                      return a.N - b.N
                    });
                    $.each(obj.FDescribeJSON, function (i, item) {
                      if (item.S) {
                        let arr = item.S.split(',');
                        item.S = arr;
                      }
                    });
                  }
                });
              }
              console.log(_this.table1)
            },
            error:function () {
              console.log("请求失败")
            }
          });
        }else if(a==3){
          $.ajax({
            'url':_this.url,
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
            '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+b+'","FState":1,"FPageSize":"'+_this.pageSize2+'","FPageIndex":"'+_this.pageIndex2+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (data) {
              _this.loading = false;
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
                _this.total2 = fobj.FObject.Table[0].FTotalCount;
                _this.table2 = fobj.FObject.Table1;
                $.each(_this.table2,function (index,obj) {
                  if(obj.FProcessContext==''||obj.FProcessContext==null){
                    obj.FProcessContext='--'
                  }
                  obj.FKeepSeconds=_this.formatSeconds(obj.FKeepSeconds);
                  obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                  if(obj.FProcessDateTime){
                    obj.FProcessDateTime=_this.parseGMT(obj.FProcessDateTime.replace(/T/ig,' '));
                  }
                  _this.$set(obj, "starAdress", null);
                  _this.$set(obj, "endAdress", null);
                  _this.getUsableData1(obj);
                  var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                  var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress");
                  if (obj.FDescribeJSON && b != 6) {
                    obj.FDescribeJSON = $.parseJSON(obj.FDescribeJSON);
                    obj.FDescribeJSON.sort(function (a, b) {
                      return a.N - b.N
                    });
                    $.each(obj.FDescribeJSON, function (i, item) {
                      if (item.S) {
                        let arr = item.S.split(',');
                        item.S = arr;
                      }
                    });
                  }
                });
              }
              
            },
            error:function () {
              console.log("请求失败")
            }
          });
        }else if(a==4){
          $.ajax({
            'url':_this.url,
            'cache': false,
            'async': true,
            'type': 'Post',
            'dataType': 'json',
            'contentType': 'application/json;charset=utf-8',
            'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
            '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+b+'","FState":0,"FPageSize":"'+_this.pageSize3+'","FPageIndex":"'+_this.pageIndex3+'","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
            success: function (data) {
              _this.loading = false;
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
                _this.total3 = fobj.FObject.Table[0].FTotalCount;
                _this.table3 = fobj.FObject.Table1;
                $.each(_this.table3,function (index,obj) {
                  obj.FStartDateTime=_this.parseGMT(obj.FStartDateTime.replace(/T/ig,' '));
                  obj.FEndDateTime=_this.parseGMT(obj.FEndDateTime.replace(/T/ig,' '));
                  _this.$set(obj, "starAdress", null);
                  _this.$set(obj, "endAdress", null);
                  _this.getUsableData1(obj);
                  var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                  var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                  _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress");
                  if (obj.FDescribeJSON && b != 6) {
                    obj.FDescribeJSON = $.parseJSON(obj.FDescribeJSON);
                    obj.FDescribeJSON.sort(function (a, b) {
                      return a.N - b.N
                    });
                    $.each(obj.FDescribeJSON, function (i, item) {
                      if (item.S) {
                        let arr = item.S.split(',');
                        item.S = arr;
                      }
                    });
                  }
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
        let systemType=_this.$store.state.choiceSystemID;
        this.$message({
          showClose: true,
          message: systemType==2||systemType==6||systemType==7?'_请选择设备_':'_请选择车辆_/_箱号_',
          type: 'warning'
        });
      }
    };
    //查看详情
    Vue.prototype.addTab=function (index, row,a) {
      this.objDetail=row;
      var _this = this;
      let newTabName ='forth';
      let table = "mytable" + newTabName;
      var tabName ;
      if(this.SystemID==2){
        tabName = row.FAssetID;
      }else {
        tabName = row.FVehicleName;
      }
      this.editableTabs.length = 0;
      this.editableTabs.push({
        title: tabName,
        name: newTabName,
        table: table,
      });
      this.activeName = newTabName;
      this.checkDetail(a);
    };
    //查看详情时请求的数据
    Vue.prototype.checkDetail=function (a) {
      this.loading=true;
      var _this=this;
      var startTime;
      var endTime;
      var curpageIndex = this.pageIndex4;
      var curpageSize = this.pageSize4;
      var time0 = moment(this.value3[0]).format("YYYY-MM-DD");
      var time1 = moment(this.value3[1]).format("YYYY-MM-DD");
      startTime = this.parseUTC(time0 + ' 00:00:00');
      endTime = this.parseUTC(time1 + ' 23:59:59');
      let action;
      let action1;
      let Guids;
      var FVehicleID ;
      if(this.SystemID==2){
        action1='QueryMessageAlarmByFAssetGUIDs';
        Guids='FAssetGUIDs';
        FVehicleID = this.objDetail.FAssetGUID;
      }else if(this.SystemID==7){
        action="QueryMessageAlarmCountByFAssetGUIDs";
        action1="QueryMessageAlarmByFAssetGUIDs";
        Guids='FAssetGUIDs';
        FVehicleID = this.objDetail.FAssetGUID;
      }else {
        action1='QueryMessageAlarmByFVehicleGUIDs';
        Guids='FVehicleGUIDs'
        FVehicleID = this.objDetail.FVehicleGUID;
      }
      $.ajax({
        'url':_this.url,
        'cache': false,
        'async': true,
        'type': 'Post',
        'dataType': 'json',
        'contentType': 'application/json;charset=utf-8',
        'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"'+action1+'","'+Guids+'":"'+FVehicleID+'",' +
        '"FStartTime":"' + startTime + '","FEndTime":"' + endTime + '","FDataType":"'+a+'","FState":-1,"FPageSize":"' + curpageSize + '","FPageIndex":"' + curpageIndex + '","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
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
            try{
              var fobj = data;
              _this.total4 = fobj.FObject.Table[0].FTotalCount;
              _this.mytable = fobj.FObject.Table1;
              $.each(_this.mytable, function (index, obj) {
                if (obj.FProcessStatus == 0) {
                  obj.FProcessStatus = "_未处理_"
                } else if (obj.FProcessStatus == 1) {
                  obj.FProcessStatus = "_已处理_"
                }
                if (obj.FProcessContext == '' || obj.FProcessContext == null) {
                  obj.FProcessContext = '--'
                }
                obj.FStartDateTime = _this.parseGMT(obj.FStartDateTime.replace(/T/ig, ' '));
                obj.FEndDateTime = _this.parseGMT(obj.FEndDateTime.replace(/T/ig, ' '));
                if (obj.FProcessDateTime) {
                  obj.FProcessDateTime = _this.parseGMT(obj.FProcessDateTime.replace(/T/ig, ' '));
                } else {
                  obj.FProcessDateTime = "--"
                }
                _this.$set(obj, "starAdress", null);
                _this.$set(obj, "endAdress", null);
                _this.getUsableData1(obj);
                var ponit0 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FStartLatitude, lng: obj.FStartLongitude });
                _this.geocoder(_this.$store.state.globalMapType, ponit0, obj, "starAdress");
                var ponit1 = _this.parsePoint(_this.$store.state.globalMapType, { lat: obj.FEndLatitude, lng: obj.FEndLongitude });
                _this.geocoder(_this.$store.state.globalMapType, ponit1, obj, "endAdress");
                if (obj.FDescribeJSON&&a!=6) {
                  obj.FDescribeJSON = $.parseJSON(obj.FDescribeJSON);
                  obj.FDescribeJSON.sort(function (a, b) {
                    return a.N - b.N
                  });
                  $.each(obj.FDescribeJSON, function (i, item) {
                    if (item.S) {
                      let arr = item.S.split(',');
                      item.S = arr;
                    }
                  });
                }
              });
              _this.loading = false
            } catch(err){
              _this.loading = false;
            }
          }
        },
        error: function () {
          console.log("请求失败")
        }
      });
    };
    Vue.prototype.getUsableData1=function(obj){
      let AlarmTypeForSeven=[
        {
          "FDataType": "1",
          "alarmName": "_超速报警_",
        }, {
          "FDataType": "6",
          "alarmName": "_低电量报警_",
        }, {
          "FDataType": "7",
          "alarmName": "_温度报警_",
        }, {
          "FDataType": "9",
          "alarmName": "_刷非法卡_",
        }, {
          "FDataType": "10",
          "alarmName": "_锁挂绳剪断报警_",
        }, {
          "FDataType": "11",
          "alarmName": "_长时间开锁_",
        }, {
          "FDataType": "12",
          "alarmName": "_密码错误报警_",
        }, {
          "FDataType": "13",
          "alarmName": "_震动报警_",
        },{
          "FDataType": "14",
          "alarmName": "_进电子围栏报警_",
        }, {
          "FDataType": "15",
          "alarmName": "_出电子围栏报警_",
        }, {
          "FDataType": "16",
          "alarmName": "_锁低电报警_ (<30%)",
        }, {
          "FDataType": "17",
          "alarmName": "_开后盖报警_",
        },{
          "FDataType": "18",
          "alarmName": "_卡锁报警_",
        }, {
          "FDataType": "24",
          "alarmName": "_进道路报警_",
        }, {
          "FDataType": "25",
          "alarmName": "_出道路报警_",
        }, {
          "FDataType": "26",
          "alarmName": "_道路偏移报警_",
        }, {
          "FDataType": "35",
          "alarmName": "_锁异常报警_",
        }, {
          "FDataType": "36",
          "alarmName": "_非许可区域报警_",
        }, {
          "FDataType": "37",
          "alarmName": "_上盖被破坏报警_",
        }, {
          "FDataType": "38",
          "alarmName": "_控制板通讯异常报警_",
        }, {
          "FDataType": "40",
          "alarmName": "_姿态异常报警_",
        }
      ];
      //console.log(obj);
      for(let i=0;i<AlarmTypeForSeven.length;i++){
        //console.log(AlarmTypeForSeven[i].FDataType+","+obj.FDataType);
        if(AlarmTypeForSeven[i].FDataType==obj.FDataType){
          obj.FDataType=AlarmTypeForSeven[i].alarmName;
          //console.log(obj.FDataType);
        }
      }
    };
    Vue.prototype.removeTab=function (targetName) {
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
    };
    //设为已读
    Vue.prototype.setToRead=function (a,b) {
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
          'url':'/web/Common/Common_Message',
          'cache': false,
          'async': true,
          'type': 'Post',
          'dataType': 'json',
          'contentType': 'application/json;charset=utf-8',
          'data': '{"FTokenID":"'+_this.$store.state.FTokenID+'","FAction":"UpdateMessageAlarmStatus","FGUIDs":"' + str + '","FState":"1","FSystemType":"'+_this.$store.state.choiceSystemID+'","FVersion":"1.0.0"}',
          success:function (json) {
            if(json.Result==200){
              _this.queryCount(a,b,false);  // false 为重新查询时不关闭临时标签页
              _this.$message({
                showClose: true,
                message: '_处理成功_',
                type: 'success'
              });
            }else if(data.Result==104) {
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
    };
    //处理
    Vue.prototype.handle=function (a,b) {
      var _this=this;
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
            console.log(json);
            if(json.Result==200){
              _this.queryCount(a,b);
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
    };
    //报表导出
   /*  Vue.prototype.export2Excel=function (th,tb,table,name) {
        //th:表头字段，tb：表格内容，name：表名
        function formatJson(filterVal, jsonData){
        　　　　　　return jsonData.map(v => filterVal.map(j => v[j]))
      　}
        require.ensure([], () => {
        　　　　　　　　const { export_json_to_excel } = require('../../vendor/Export2Excel');
        　　　　　　　　const tHeader = th; //对应表格输出的title
        　　　　　　　　const filterVal = tb; // 对应表格输出的数据
        　　　　　　　　const list = table;
        　　　　　　　　const data = formatJson(filterVal, list);
        　　　　　　　　export_json_to_excel(tHeader, data, name); //对应下载文件的名字
      　})
    } */
  }
}


