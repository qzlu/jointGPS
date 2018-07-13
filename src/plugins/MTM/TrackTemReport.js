jQuery(function ($) {
    //多语言
    registerWords();
    var path = "/Language/MTM/TrackTemReport/";
    translate(path);
    $("#mFKey").attr("placeholder", __tr("enter in vehicle plate NO"));
    //功能选择弹窗
    seajs.config({
        alias: {
            "jquery": "jquery-1.10.2.min"
        }
    });
    // demo
    window.console = window.console || { log: function () { } }
    seajs.use(['jquery'], function ($) {

        $('#ProdlTypeSelectQuery').on('click', function () {
            top.dialog({
                id: 'test-dialog',
                title: __tr("choose product type"),
                width: '1100',
                height: '530',
                url: '/MDDialog/ProdTypeDialog',
                onclose: function () {
                    if (this.returnValue) {
                        var json = $.parseJSON(this.returnValue);
                        $("#mFProdTypeID").val(json.mFName);
                        $("#mFProdTypeID").attr("mFID", json.mFid);

                    }
                    //console.log('onclose');
                }

            })
                .showModal();
            return false;
        });

        //$('#VehicleIDSelectQuery').on('click', function () {
        //    var uri = '/JVMDDialog/VehicleMultipleTreeDialog';
        //    if ($("#mFVehicleID").attr("mFID") != "") {
        //        uri += "?checkedIds=" + $("#mFVehicleID").attr("mFID");
        //    }
        //    top.dialog({
        //        id: 'test-dialog',
        //        title: __tr("choose vehicle"),
        //        width: '300',
        //        height: '530',
        //        //url: '/JVMDDialog/VehicleMultipleDialog',
        //        url: uri,
        //        onclose: function () {
        //            if (this.returnValue != "") {
        //                var json = $.parseJSON(this.returnValue);
        //                var names = "";
        //                var ids = "";
        //                $.each(json, function (index, obj) {
        //                    names += obj.name + ",";
        //                    ids += obj.id + ",";
        //                });
        //                names = names.substr(0, names.length - 1);
        //                ids = ids.substr(0, ids.length - 1);
        //                $("#mFVehicleID").val(names);
        //                $("#mFVehicleID").attr("title", names);
        //                $("#mFVehicleID").attr("mFID", ids);

        //            } else {
        //                $("#mFVehicleID").val("");
        //                $("#mFVehicleID").attr("mFID", "");
        //                $("#mFVehicleID").attr("title", "");
        //            }
        //            //console.log('onclose');
        //        }

        //    })
        //        .showModal();
        //    return false;
        //});

        $('button[data-event=reload]').on('click', function () {
            location.reload();
            return false;
        });

    });


    //导出csv文件
    $("#export_csv").click(function () {
        openloading();
        exportFile("csv");
    });

    $("#export_pdf").click(function () {
        openloading();
        exportFile("pdf");

    });

    function exportFile(fileType) {
        $.post("/CCM/TempTrack/ExportQuery", {
            mFVehicleLicense: varmFKey,
            mFVehicleID: varmFVehicleID,
            mFTrackTimeB: varmFStartDateTimeB,
            mFTrackTimeE: varmFStartDateTimeE,
            mPageIndex: pageIndex,
            mPageSize: 10,
            lang:__tr("lang"),
            fileType: fileType
        }, function (data) {
            closeloading();
            //alert(data);
            if (!CheckDataStatus(data, $)) return;
            var json = $.parseJSON(data);
            // if (fileType == "csv")
            location.href = json.mObject;
           
            // else
            //     window.open(json.mObject);
        });
    }


    $("#BtnQuery").click(function () {
        openloading();
        //searchType = "q";
        pageIndex = 1;
        doQuery();
    });


    $(".searchbtn").click(function () {
        //searchType = "s";
        pageIndex = 1;
        doQuery();
    });

    $("#selectDate").change(function () {
        switch ($(this).select().val()) {
            case "1":
                $("#mFStartDateTimeB").val(formatDate(0));
                $("#mFStartDateTimeE").val(formatDate(0));
                break;
            case "2":
                $("#mFStartDateTimeB").val(formatDate(1));
                $("#mFStartDateTimeE").val(formatDate(1));
                break;
            case "3":
                $("#mFStartDateTimeB").val(formatDate(2));
                $("#mFStartDateTimeE").val(formatDate(2));
                break;
            default:
        }
    });

    $("#mFStartDateTimeB").val(formatDate(0));
    $("#mFStartDateTimeE").val(formatDate(0));

    var pageIndex = 1;
    var pageSize = 10;
    var pageCount = 0;
    var searchType = "s";
    var varmFKey = "";
    var varmFVehicleID = "";
    var varmFStartDateTimeB = GetDateSeconds($("#mFStartDateTimeB").val() + " 00:00:00");
    var varmFStartDateTimeE
    function doQuery() {
        $("#export_tool").hide();
        //varmFKey = "";
        //varmFVehicleID = "";
        //if (searchType == "s") {
        //    varmFKey = $("#mFKey").val();
        //} else if (searchType == "q") {
        //    varmFKey = $("#mFVehicleID").val();
        //} else {
        //    varmFVehicleID = $("#vehicleID").attr("mFID");
        //    if (typeof varmFVehicleID == "undefined" || varmFVehicleID == "" || varmFVehicleID == null) { varmFVehicleID = ""; }
        //}
        //if (varmFKey == "" && varmFVehicleID == "") {
        //    $("#mFStartDateTimeB").val(formatDate(0));
        //    $("#mFStartDateTimeE").val(formatDate(0));
        //    $("#selectDate").val("1");
        //    $("#ReportTable").html("");
        //    return;
        //}
        varmFVehicleID = $("#vehicleID").attr("mfid");
        varmFStartDateTimeB = GetDateSeconds($("#mFStartDateTimeB").val() + " 00:00:00");
        varmFStartDateTimeE = GetDateSeconds($("#mFStartDateTimeE").val() + " 23:59:59");
        if ((typeof varmFVehicleID == "undefined" || varmFVehicleID == "" || varmFVehicleID == null) && varmFKey == "") { showMsg($, __tr("please choose vehicle")); return; }

        if ($("#mFStartDateTimeB").val() == "" || $("#mFStartDateTimeE").val() == "") {
            $("#mFStartDateTimeB").val(formatDate(0));
            $("#mFStartDateTimeE").val(formatDate(0));
            varmFStartDateTimeB = GetDateSeconds($("#mFStartDateTimeB").val() + " 00:00:00");
            varmFStartDateTimeE = GetDateSeconds($("#mFStartDateTimeB").val() + " 23:59:59");
        }

        //清空报表数据
        $("#ReportTable").html("");

        $.post("/CCM/TempTrack/doQueryByPage", {
            mFVehicleLicense: varmFKey,
            mFVehicleID: varmFVehicleID,
            mFTrackTimeB: varmFStartDateTimeB,
            mFTrackTimeE: varmFStartDateTimeE,
            mPageIndex: pageIndex,
            mPageSize: pageSize
        }, function (data) {
            closeloading();
            if (!CheckDataStatus(data, $)) return;
            var json = $.parseJSON(data);
            var temp = "";
            if (json.mRecords.length > 0)
                $("#export_tool").show();
            for (var i = 0; i < json.mRecords.length; i++) {
                temp += "<tr>";
                temp += "<td class='xj-width-60'>" + parseInt((pageIndex - 1) * pageSize + i + 1) + "</td>";
                temp += "<td class='xj-width-110'>" + FormatText(json.mRecords[i].mFVehicleLicense) + "</td>";
                temp += "<td class='xj-width-95'>" + FormatText(json.mRecords[i].mFProdNumber) + "</td>";
                temp += "<td class='xj-width-135'>" + FormatText(json.mRecords[i].mFProdType) + "</td>";
                temp += "<td class='xj-width-150'>" + FormatText(json.mRecords[i].mFSensorSeq) + "</td>";
                temp += "<td class='xj-width-190'>" + FormatText(TransDate(json.mRecords[i].mFTrackTime)) + "</td>";
                temp += "<td class='xj-width-135'>" + FormatText(json.mRecords[i].mFLng) + "</td>";
                temp += "<td class='xj-width-195'>" + FormatText(json.mRecords[i].mFLat) + "</td>";
                temp += "<td class='xj-width-115'>" + FormatText(json.mRecords[i].mFTemp) + "℃</td>";
                var mFMoisture = FormatText(json.mRecords[i].mFMoisture) == "" ? "-" : FormatText(json.mRecords[i].mFMoisture) + "％";
                var mFVoltage = FormatText(json.mRecords[i].mFVoltage) == "" ? "-" : FormatText(json.mRecords[i].mFVoltage) + "V";
                var mFSensorNetMAC = FormatText(json.mRecords[i].mFSensorNetMAC) == "" ? "-" : FormatText(json.mRecords[i].mFSensorNetMAC);
                temp += "<td class='xj-width-180'>" + mFMoisture + "</td>";
                temp += "<td class='xj-width-145'>" + mFVoltage + "</td>";
                temp += "<td class='xj-width-175'>" + mFSensorNetMAC + "</td>";
                temp += "</tr>";
            }
            $("#ReportTable").html(temp);
            $(".dataTables_info").remove();
            pageCount = parseInt(parseInt(json.mTotalCount - 1) / pageSize) + 1;
            BindPageClick(pageCount);
            closeloading();
        }); 
    }

    //03.15

    companyinfo = GetLoginUserCompanyInfo();
    $.post("/MTM/Monitor/QueryVehicle", { mFStatus: 10, mFOUID: companyinfo.mFID }, function (data) {
        
        var json = $.parseJSON(data);
        $.post("/ORGDialog/ORGDialog/doQuery", { mFOUID: companyinfo.mFOUID }, function (data) {

            BindData(data, json);
        });
    });
    //03.15

    //03.15
    function BindData(data, carjson) {
        json = $.parseJSON(data);
        var tabletemp = "<ul>";
        tabletemp += takeMenu(json.mObject, companyinfo.mFID, true, carjson);
        tabletemp += "</ul>";
        $("#vehicleTree").html(tabletemp);
        _html = "";
        BindOpenCloseClick();
        BindCarClick();
    }

    //doQuery();
    var _html = "";
    function BindCarData(json, carjson) {
        $.each(carjson.mRecords, function (index, obj) {
            if (json.mFID == obj.mFDeptID) {

                _html += '<li class="parent_li"><span class="width100 CheckCar" mFID="' + obj.mFID + '" mFLicense="' + obj.mFLicense + '"><i class="icon-folder-open"></i>' + obj.mFLicense + '</span>';
            }
            else if (obj.mFDeptID == "" && json.mFID == obj.mFOUID) {
                _html += '<li class="parent_li"><span class="width100 CheckCar" mFID="' + obj.mFID + '" mFLicense="' + obj.mFLicense + '"><i class="icon-folder-open"></i>' + obj.mFLicense + '</span>';
            }
        });
    }


    function takeMenu(all, id, bool, carjson) {
        for (var i = 0; i < all.length; i++) {

            var tempStart = "";
            var tempEnd = "";
            //以上定义按钮
            if (bool) {
                if (all[i].mFID == id) {
                    _html += "<li>";
                    _html += "<span class='width100 MotorcadeName'><i class='icon-folder-open'  value='" + all[i].mFID + "'></i><i class='ace-icon fa closeTree'></i>" + all[i].mFName + "</span>";

                    //_html += "<a>" + all[i].mFStatusText + "</a>";

                    _html += "" + tempStart + "" + tempEnd + "<ul>";
                    takeMenu(all, all[i].mFID, false, carjson);
                    BindCarData(all[i], carjson);
                    _html += "</ul></li>";
                }
            } else {
                if (all[i].mFParentID == id) {
                    _html += "<li>";
                    _html += "<span class='width100 MotorcadeName'><i class='icon-folder-open'  value='" + all[i].mFID + "'></i><i class='ace-icon fa closeTree'></i>" + all[i].mFName + "</span>";

                    //_html += "<a>" + all[i].mFStatusText + "</a>";

                    _html += "" + tempStart + "" + tempEnd + "<ul>";
                    takeMenu(all, all[i].mFID, false, carjson);
                    BindCarData(all[i], carjson);
                    _html += "</ul></li>";
                }
            }

        }
        return _html;
    }

    $("#mFVehicleID").focus(function () {
        $("#vehicleTree").removeClass("hide");

    });

    $("#mFVehicleID").focusout(function () {
        setTimeout(HideCarTree, 300);

    });

    function HideCarTree() {
        $("#vehicleTree").addClass("hide");
    }

    $("#vehicleName").focusout(function () {
        setTimeout(HideCarTree, 300);

    });

    function BindCarClick() {
        $(".CheckCar").click(function () {
            $("#mFVehicleID").val($(this).attr("mFLicense"));
            $("#vehicleID").attr("mfid", $(this).attr("mfid"));
            $("#vehicleTree").addClass("hide");
        });
    }

    function BindOpenCloseClick() {
        $(".closeTree").unbind("click").click(function () {
            $(this).removeClass("closeTree");
            $(this).addClass("openTree");
            $(this).parent().parent().children("ul").addClass("hide");
            BindOpenCloseClick();
        });

        $(".openTree").unbind("click").click(function () {
            $(this).removeClass("openTree");
            $(this).addClass("closeTree");
            $(this).parent().parent().children("ul").removeClass("hide");
            BindOpenCloseClick();
        });
    }
    //03.15

    //03.16
    //车辆模糊查询
    $("#mFVehicleID").keyup(function () {
        var searchValue = $(this).val();
        var lilist = $("#vehicleTree").children("ul").find("li");
        var Motorcadelilist = $("#vehicleTree").find(".MotorcadeName");
        if (searchValue == "") {
            lilist.removeClass("hide");
        } else {
            lilist.addClass("hide");
            lilist.each(function (index, obj) {
                var name = $(this).children(".CheckCar").attr("mflicense");
                //console.info(name);
                if (name != undefined && name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    $(this).removeClass("hide");
                    $(this).parents("li").removeClass("hide");
                    //console.info(name);
                }
            });
        }
        if (searchValue == "") {
            lilist.removeClass("hide");
        } else {
            //lilist.addClass("hide");
            Motorcadelilist.each(function (index, obj) {
                var name = removeHTMLTag($(this).html());
                if (name != undefined && name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    $(this).parents("li").removeClass("hide");
                    $(this).parent("li").find("li").removeClass("hide");
                    //console.info(name);
                }
            });
        }
    });
    //去掉标签的正则
    function removeHTMLTag(str) {
        return str = str.replace(/<\/?[^>]*>/g, "");
    }
    //03.16

    //创建分页页码
    function BindPageClick(pageCount) {
        CreatePageInfo(pageCount, pageIndex, "footer-content");
        $("#PageSize").change(function () {
            pageSize = $(this).select().val();
            pageIndex = 1;
            doQuery();

        });

        $("#PageSize").children().eq((pageSize / 10) - 1).attr("selected", true);
        $(".pagination li").on("click", function () {
            openloading();
            if ($(this).hasClass("disabled")) {
                return;
            }
            pageIndex = parseInt($(this).children("a").attr("index"));
            if (pageIndex < 1) {
                showMsg($, __tr("It's the first page!"));
                pageIndex = 1;
                return;
            } else if (pageIndex > pageCount) {
                showMsg($, __tr("It's the last page!"));
                pageIndex = pageCount;
                return;
            }
            $(".pagination li").removeClass("active");
            $("#pagepre").attr("index", pageIndex - 1);
            $("#pagenext").attr("index", pageIndex + 1);
            doQuery();
        });
    }

});