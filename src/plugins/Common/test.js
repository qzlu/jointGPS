jQuery(function ($) {
    //多语言
    registerWords();
    var path = "/Language/JAAM/Alarm/";
    translate(path);
    $("#mFKey").attr("placeholder", __tr("type in key words"));
    //功能选择弹窗
    seajs.config({
        alias: {
            "jquery": "jquery-1.10.2.min"
        }
    });
    // demo
    window.console = window.console || { log: function () { } }
    seajs.use(['jquery'], function ($) {

        $('#CompanySelect').on('click', function () {
            top.dialog({
                id: 'test-dialog',
                title: __tr("choose company"),
                width: '1100',
                height: '530',
                url: '/ORGDialog/CompanyDialog',
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

        $('#VehicleIDSelectQuery').on('click', function () {
            var uri = '/JVMDDialog/VehicleMultipleTreeDialog';
            if ($("#mFVehicleID").attr("mFID") != "") {
                uri += "?checkedIds=" + $("#mFVehicleID").attr("mFID");
            }
            top.dialog({
                id: 'test-dialog',
                title: __tr("choose vehicle"),
                width: '300',
                height: '530',
                //url: '/JVMDDialog/VehicleMultipleDialog',
                url: uri,
                onclose: function () {
                    if (this.returnValue != "") {
                        var json = $.parseJSON(this.returnValue);
                        var names = "";
                        var ids = "";
                        $.each(json, function (index, obj) {
                            names += obj.name + ",";
                            ids += obj.id + ",";
                        });
                        names = names.substr(0, names.length - 1);
                        ids = ids.substr(0, ids.length - 1);
                        $("#mFVehicleID").val(names);
                        $("#mFVehicleID").attr("title", names);
                        $("#mFVehicleID").attr("mFID", ids);

                    } else {
                        $("#mFVehicleID").val("");
                        $("#mFVehicleID").attr("mFID", "");
                        $("#mFVehicleID").attr("title", "");
                    }
                    //console.log('onclose');
                }

            })
                .showModal();
            return false;
        });

        $('button[data-event=reload]').on('click', function () {
            location.reload();
            return false;
        });

    });


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
        // openloading();
        doQuery();
    });


    $(".searchbtn").click(function () {
        doQuery();
    });

    //初始化变量
    var pageIndex = 1;
    var pageSize = 20;
    var pageCount = 0;

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

    function doQuery() {
        var varmFStartDateTimeB = GetDateSeconds($("#mFStartDateTimeB").val());
        var varmFStartDateTimeE = GetDateSeconds($("#mFStartDateTimeE").val());
        var varmFVehicleID = $("#mFVehicleID").attr("mfid");
        var varmFLicense = $("#mFVehicleID").val();
       // openloading();

        //清空报表数据
        $("#ReportTable").html("");
        var varmFStatus = 0;
        var data = [];
        CheckDataStatus(data, $);
    }


    function pagination(pageIndex, pageSize, array) {
        var offset = (pageIndex - 1) * pageSize;
        return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    }


    function BindBtn() {
        $(".ProdTypeEdit").on('click', function () {

            var varmFID = $(this).attr("mFID");

            $.get("/JAAM/Event/doGetEntity", { FID: varmFID }, function (data) {
                var json = $.parseJSON(data);
                var obj = json.mObject
                //console.log(obj);
                $("#mFLicense").val(obj.mFLicense);
                $("#mFType").val(obj.mFType);
                $("#mFStartDateTime").val(TransDate(obj.mFStartDateTime));
                $("#mFEndDateTime").val(TransDate(obj.mFEndDateTime));
                $("#mFStartPosition").val(obj.mFStartPosition);
                $("#mFStartPosition").val(FormatText(obj.mFStartPosition));
                $("#mFEndPosition").val(FormatText(obj.mFEndPosition));
                $("#mFid").val(obj.mFID);
                $("#mFid").attr("mFStatus", obj.mFStatus);
            });

            $("#AbnormalDeal").removeClass('hide').dialog({
                modal: true,
                title: __tr("deal with"),
                title_html: true,
                width: '60.5%',
                height: 560,
                position: {
                    using: function (pos) {
                        var topOffset = $(this).css(pos).offset().top;
                        if (topOffset = 0 || topOffset > 0) {
                            $(this).css({ 'top': '21.5%' });
                        }
                    }
                },
                buttons: [
                    {
                        text: __tr("Save"),
                        "class": "btn btn-sm btn-primary btn-round padding-lr-36 isDetails",
                        click: function () {
                            if (!Save()) return;
                            $(this).dialog("close");
                            doQuery();
                        }
                    },
                    {
                        text: __tr("Close"),
                        "class": "btn btn-white btn-primary btn-round  padding-lr-36 margin-l-15",
                        click: function () {
                            $(this).dialog("close");
                        }
                    },
                ]
            });
            if ($(this).hasClass("details")) {
                $(".isDetails").addClass("hide");
                $("#mFProcStatusText").attr("disabled", "disabled");
            } else {
                $("#mFProcStatusText").attr("disabled", false);
            }

        });
    }


    //分页
    function BindPageClick(pageCount) {
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
            doQuery();
        });
    }

    //翻译
    TranslateThead();
    function TranslateThead() {
        $(document).find("span").each(function () {
            $(this).html(__tr($(this).attr("i")));
        });
        $(".customFixedTable thead").find("td").each(function () {
            $(this).html(__tr($(this).attr("i")));
        });
    }

})