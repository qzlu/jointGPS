jQuery(function ($) {
    //多语言
    registerWords();
    var path = "/Language/MTM/TrackReport/";
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

        //03.15

        //03.15





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
        mStartTime = getDate($("#mFStartDateTimeB").val());
        mEndTime = getDate($("#mFStartDateTimeE").val());
        var FDateList = "";
        while ((mEndTime.getTime() - mStartTime.getTime()) >= 0) {
            if (FDateList == "")
                FDateList = getFDate();
            else
                FDateList += "," + getFDate();
            mStartTime.setDate(mStartTime.getDate() + 1);
        }
        $.post("/MTM/Track/ExportQuery", {
            mFVehicleLicense: varmFKey,
            mFVehicleID: varmFVehicleID,
            mFTrackTimeB: varmFStartDateTimeB,
            mFTrackTimeE: varmFStartDateTimeE,
            FDateList: FDateList,
            mPageIndex: pageIndex,
            mPageSize: 10,
            lang: __tr("lang"),
            fileType: fileType
        }, function (data) {
            //alert(data);
            closeloading();
            if (!CheckDataStatus(data, $)) return;
            var json = $.parseJSON(data);
            // if (fileType == "csv")
            location.href = json.mObject;
            // else
            //     window.open(json.mObject);
        });
    }
    //日期插件初始化
    $("#mFStartDateTimeB,#mFStartDateTimeE").flatpickr({
        enableTime: true,
        enableSeconds: true,
        time_24hr: true,
        minuteIncrement: 1,
        allowInput: true,
        defaultDate: "today",
    });
    $("#mFStartDateTimeE").flatpickr({
        enableTime: true,
        enableSeconds: true,
        time_24hr: true,
        minuteIncrement: 1,
        allowInput: true,
        defaultDate: formatDate(0) + " 23:59:59"
    });

    //日期插件翻译
    zhWeekdaysArr = [__tr("Sun"), __tr("Mon"), __tr("Tue"), __tr("Wed"), __tr("Thu"), __tr("Fri"), __tr("Sat")];
    zhMonthJson = { "January ": __tr("January") + " ", "February ": __tr("February") + " ", "March ": __tr("March") + " ", "April ": __tr("April") + " ", "May ": __tr("May") + " ", "June ": __tr("June") + " ", "July ": __tr("July") + " ", "August ": __tr("August") + " ", "September ": __tr("September") + " ", "October ": __tr("October") + " ", "November ": __tr("November") + " ", "December ": __tr("December") + " " };
    $(document).on("click", ".flatpickr-calendar", function () {
        translateDate();
    })
    translateDate();
    function translateDate() {
        $(".flatpickr-weekdays").each(function (index, item) {
            $(this).find(".flatpickr-weekday").each(function (index, item) {
                $(this).html(zhWeekdaysArr[index]);
            });
        });

        for (var key in zhMonthJson) {
            if ($(".cur_month").html() == key) {
                $(".cur_month").html(zhMonthJson[key]);
            }
        }
    }

    $("#BtnQuery").click(function () {
        //searchType = "q";
        pageIndex = 1;
        var mFStartDateTimeB = GetDateSeconds($("#mFStartDateTimeB").val());
        var mFStartDateTimeE = GetDateSeconds($("#mFStartDateTimeE").val());

        if (mFStartDateTimeE < mFStartDateTimeB) {
            closeloading();
            showMsg($, __tr("End time must be greater than start time!"));
            return;
        } else {
            doQuery();
        }

    });


    //$(".searchbtn").click(function () {
    //    searchType = "s";
    //    pageIndex = 1;
    //    doQuery();
    //});

    $("#selectDate").change(function () {
        switch ($(this).select().val()) {
            case "1":
                $("#mFStartDateTimeB").val(formatDate(0) + " 00:00:00");
                $("#mFStartDateTimeE").val(formatDate(0) + " 23:59:59");
                break;
            case "2":
                $("#mFStartDateTimeB").val(formatDate(1) + " 00:00:00");
                $("#mFStartDateTimeE").val(formatDate(1) + " 23:59:59");
                break;
            case "3":
                $("#mFStartDateTimeB").val(formatDate(2) + " 00:00:00");
                $("#mFStartDateTimeE").val(formatDate(2) + " 23:59:59");
                break;
            default:
        }
    });

    //$("#mFStartDateTimeB").val(formatDate(0));
    //$("#mFStartDateTimeE").val(formatDate(0));

    function getDate(datestr) {
        var temp = datestr.substring(0, 10).split("-");
        var date = new Date(temp[0], temp[1], temp[2]);
        return date;
    }

    function getFDate() {
        var year = mStartTime.getFullYear();
        var month = mStartTime.getMonth().toString().length == 1 ? "0" + mStartTime.getMonth().toString() : mStartTime.getMonth();
        var day = mStartTime.getDate().toString().length == 1 ? "0" + mStartTime.getDate() : mStartTime.getDate();
        return year + "_" + month + "_" + day;
    }

    var mFDate;
    var mStartTime;
    var mEndTime;
    var pageIndex = 1;
    var pageSize = 20;
    var pageCount = 0;
    var searchType = "s";
    var varmFKey = "";
    var varmFVehicleID = "";
    var varmFStartDateTimeB = "";
    var varmFStartDateTimeE = "";
    function doQuery() {

        $("#export_tool").hide();

        varmFVehicleID = $("#vehicleID").attr("mfid");
        varmFStartDateTimeB = GetDateSeconds($("#mFStartDateTimeB").val());
        varmFStartDateTimeE = GetDateSeconds($("#mFStartDateTimeE").val());

        if ((typeof varmFVehicleID == "undefined" || varmFVehicleID == "" || varmFVehicleID == null) && varmFKey == "") { showMsg($, __tr("please choose vehicle")); return; }
        if ($("#mFStartDateTimeB").val() == "" || $("#mFStartDateTimeE").val() == "") {
            $("#mFStartDateTimeB").val(formatDate(0));
            $("#mFStartDateTimeE").val(formatDate(0));
            varmFStartDateTimeB = GetDateSeconds($("#mFStartDateTimeB").val());
            //起始时间加上23:59:59
            varmFStartDateTimeE = GetDateSeconds($("#mFStartDateTimeB").val());
        }
        //清空报表数据
        openloading();
        $("#ReportTable").html("");

        mStartTime = getDate($("#mFStartDateTimeB").val());
        mEndTime = getDate($("#mFStartDateTimeE").val());
        mFDate = getFDate();
        mStartTime.setMonth((mStartTime.getMonth() - 1));
        mStartTime.setDate(mStartTime.getDate() + 1);
        mStartTime.setMonth((mStartTime.getMonth() + 1));
        //console.log(varmFStartDateTimeB + "," + varmFStartDateTimeE);
        QueryTrack();

    }
    var _AllTrackList = null;
    function QueryTrack() {
        $.post("/MTM/Track/doQueryByDate", {
            mFVehicleLicense: varmFKey,
            mFVehicleID: varmFVehicleID,
            mFTrackTimeB: varmFStartDateTimeB,
            mFTrackTimeE: varmFStartDateTimeE,
            mSort: "mFTrackTime",
            offsetName: "Baidu",
            IsGetTemTrack: false,
            mFDate: mFDate,
            mPageIndex: pageIndex,
            mPageSize: pageSize
        }, function (data) {
            closeloading();
            if (!CheckDataStatus(data, $)) return;
            var json = $.parseJSON(data);
            var temp = "";
            //console.log(json);
            if (json.Result != "100") {
                if (_AllTrackList == null) {
                    _AllTrackList = json;
                    mTotalCount = json.mTotalCount;
                    if (mTotalCount > 2000)
                        _AllTrackList.mObject = JSON.hunpack(eval(_AllTrackList.mObject), 4);
                } else {
                    if (json.mTotalCount > 2000)
                        json.mObject = JSON.hunpack(eval(json.mObject), 4);
                    $.each(json.mObject, function (index, obj) {
                        _AllTrackList.mObject.push(obj);
                    });
                }

                if ((mEndTime.getTime() - mStartTime.getTime()) >= 0) {
                    mFDate = getFDate();
                    mStartTime.setMonth((mStartTime.getMonth() - 1));
                    mStartTime.setDate(mStartTime.getDate() + 1);
                    mStartTime.setMonth((mStartTime.getMonth() + 1));
                    QueryTrack();
                }
                else {
                    json.mObject = _AllTrackList.mObject;
                    json.mObject_1 = _AllTrackList.mObject_1;
                    if (json.mObject.length > 0)
                        $("#export_tool").show();
                    pageCount = parseInt(json.mObject.length / pageSize) + 1;
                    var pageTrades = pagination(pageIndex, pageSize, json.mObject);
                    for (var i = 0; i < pageTrades.length; i++) {
                        temp += "<tr>";
                        temp += "<td class='xj-width-40'>" + parseInt((pageIndex - 1) * pageSize + i + 1) + "</td>";
                        temp += "<td class='xj-width-60'>" + FormatText(pageTrades[i].mFVehicleLicense) + "</td>";
                        temp += "<td class='xj-width-100'>" + FormatText(pageTrades[i].S3) + "</td>";
                        temp += "<td class='xj-width-100'>" + FormatText(pageTrades[i].S4N) + "</td>";
                        temp += "<td class='xj-width-100'>" + FormatText(TransDate(pageTrades[i].S6)) + "</td>";
                        temp += "<td class='xj-width-100 text-align-left padding-l-36'>" + FormatText(Number(pageTrades[i].S7).toFixed(6)) + "</td>";
                        temp += "<td class='xj-width-100 text-align-left padding-l-36'>" + FormatText(Number(pageTrades[i].S8).toFixed(6)) + "</td>";
                        temp += "<td class='xj-width-80'>" + FormatText(pageTrades[i].SA) + "&nbsp;km/h</td>";
                        temp += "<td class='xj-width-100'>" + FormatText(pageTrades[i].SC) + "&nbsp;km</td>";
                        temp += "</tr>";
                    }
                    $("#ReportTable").html(temp);
                    BindPageClick(pageCount, json);
                    $(".dataTables_info").remove();
                }
            }
        });

    }


    function pagination(pageIndex, pageSize, array) {
        var offset = (pageIndex - 1) * pageSize;
        return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    }





    $(".footer-inner").attr("style", "z-index:-1");
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

    //创建分页页码
    function BindPageClick(pageCount, json) {
        CreatePageInfo(pageCount, pageIndex, "footer-content");
        $("#PageSize").change(function () {
            pageSize = $(this).select().val();
            pageIndex = 1;
            doQuery();

        });

        $("#PageSize").children().eq((pageSize / 10) - 1).attr("selected", true);
        $(".pagination li").on("click", function () {
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
            //console.log(pageSize);
            doQuery();
        });
    }

});