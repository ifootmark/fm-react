    "use strict";

    var lib={};
    lib.ajaxurl = '';
    lib.getJsonData = function (type, url, data, callfunc, errfunc) {
        var isJsonp=false;
        if(url.indexOf('jsonp!')>=0){
            isJsonp=true;
            url=url.replace(/jsonp!/,'');         
        }
        $.ajax({
            type: !type ? "get" : type,
            url: url,
            data: data,
            dataType: isJsonp?"jsonp":null,
            jsonp: isJsonp?"callback":null,
            success: function (data) {
                data = typeof(data) == "string" ? eval('('+data+')') : data;
                if (callfunc)
                    callfunc(data);
            },
            error: function (data) {
                if (errfunc)
                    errfunc(data);
            }
        });
    }

    //checkAll
    var checkAll = function (chkobj, hfselecter) {
        var parents = $(chkobj).parentsUntil("table");
        var table = $(parents[parents.length - 1]).parent();
        $(table).find("tbody tr").each(function () {
            $("#" + hfselecter).val($("#" + hfselecter).val() + $(this).attr("id").replace("row_", "") + ",");
        });
        if ($(chkobj).is(":checked")) {
            $(table).find("tbody tr :checkbox").prop('checked', true);
            $(table).find("tbody tr").css("background-color", "#ffffe1");
        }
        else {
            $(table).find("tbody tr :checkbox").prop("checked", false);
            $("#" + hfselecter).val("");
            $(table).find("tbody tr").css("background-color", "");
        }
    }

    //getParentNode
    lib.getParentNode = function (selecter, obj) {
        var parents = obj.parentsUntil(selecter);
        return $(parents[parents.length - 1]).parent();
    };

    lib.setFromData=function(target,param) {
        var startTime=new Date();
        var timer = null;
        timer = setInterval(function () {
            if ($(target).length > 0) {
                $('body').form('set values', param);
                clearInterval(timer);
            }
            var timeInterval=Date.now()-startTime.getTime();
            if(timeInterval>3000){
                clearInterval(timer);
            }
        }, 200)
    }

    lib.countdownResend = function (num, obj) {
        obj.attr("disabled", "disabled");
        obj.removeClass("gray").addClass("gray");
        var timer = null;
        obj.val(num + '秒后重发')
        timer = setInterval(function () {
            num--;
            obj.val(num + '秒后重发')
            if (num <= 0) {
                obj.val('重新获取验证码');
                obj.removeClass("gray");
                clearInterval(timer);
            }
        }, 1000)
    }

    lib.supportPlaceHolder = function () {
        var isSupportPlaceHolder = 'placeholder' in document.createElement('input');
        if (!isSupportPlaceHolder()) {
            $('[placeholder]').focus(function () {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function () {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur();
        };
    };

    //阻止事件冒泡
    lib.stopEventBubble=function(event){
        var e=event || window.event;
        if (e && e.stopPropagation){
            e.stopPropagation();    
        }
        else{
            e.cancelBubble=true;
        }
    }

    //取随机数
    lib.getRandomNum=function(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    //回车
    lib.keySubmit = function (event, selecter) {
        if (event.keyCode == 13)
        {
            event.returnValue = false;
            event.cancel = true;
            $(selecter).click();
        }
    }

    //获取浏览器参数
    lib.getQueryString=function(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); return null; 
    }
    //去掉首尾空格
    lib.trimSpace = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    //转换url中的&和+
    lib.filter = function (str) {
        str = str.replace(/\+/g, "%2B");
        str = str.replace(/\&/g, "%26");
        return str;
    }

    //validate
    lib.validate = {
        //校验是否为空
        isNull: function(s) {
            //s = s.replace(/&nbsp;/ig, ''); //去掉&nbsp;
            var patrn = /^\s*$/;
            if (!patrn.exec(s)) return false;
            return true;
        },
        //校验是否全由数字组成 
        isDigit: function(s) {
            var patrn = /^[0-9]{1,20}$/;
            if (!patrn.exec(s)) return false;
            return true;
        },
        //校验是否日期格式 
        isDate: function(s) {
            var r = s.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        },
        // 检查是否为有效的email
        isMail: function(str) {
            var myReg = /^[_\-\.a-zA-Z0-9]+@([_\-a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,3}$/;
            if (myReg.test(str))
                return true;
            return false;
        },
        // 检查是否为有效的用户名
        isName: function(str) {
            var myReg = /^[\u4E00-\u9FA5\uf900-\ufa2d\w]{2,16}$/;
            if (myReg.test(str))
                return true;
            return false;
        },
        //检测密码
        isPwd: function(str) {
            if (str.length < 6 || str.length > 16) {
                return false;
            }
            return true;
        },
        //校验是否全由数字或字母组成 
        isChar: function(s) {
            var patrn = /^[0-9a-zA-Z]*$/;
            if (!patrn.exec(s)) return false;
            return true;
        },
        //校验是否全由数字或两位小数点组成 
        isDigitFloat: function(s) {
            var patrn = /^[0-9]+(.[0-9]{1,2})?$/;
            if (!patrn.exec(s)) return false;
            return true;
        },
        //校验是否全由数字或三位小数点组成
        isDigitFloat3: function(s) {
            var patrn = /^[0-9]+(.[0-9]{1,3})?$/;
            if (!patrn.exec(s)) return false;
            return true;
        },
        /*验证手机号*/
        isPhoneNum: function(tel) {
            var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (reg.test(tel)) {
                return true;
            } else {
                return false;
            }
        },
        isWeixin: function() {
            var a = navigator.userAgent.toLowerCase();
            if (a.match(/MicroMessenger/i) == "micromessenger") {
                return true
            } else {
                return false
            }
        }
    }

    /*手机号格式化*/
    lib.phoneFormat=function(tel){
        if(!tel) tel="";
        var reg = /(\d{3})\d{4}(\d{4})/;
        var phone=tel.replace(reg,"$1****$2");
        return phone;
    }

    lib.dateFormat = function (date, format) {
        date = new Date(date);
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "H": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdHmsqS])+/g, function (all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            }
            else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    }

    /** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
       可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
       Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
    * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
    * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
    * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
    * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
    */
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }


    /**
    * iDialog
    * @param {String,String,Object,Object}
    * @call iDialog.show(id, content, options, callback)
    * @return {undefined}
    * @author xuxin
    * 2015.12.15
    */
    var iDialog = {
        _id: null,
        options: {},
        default: { width: 320, height: 180, lock: true, quickClose: false, auto: false, time: 2000, zindex: 98, closebtn: false, defaulttmpl: true, title: "提示", oktext: "确定", ok: null, canceltext: "取消", cancel: null, type: null },
        show: function (id, content, options, callback) {
            iDialog._id = !id ? "idlg" : id;
            if (iDialog.default != null && typeof (iDialog.default) != "undefined") {
                options = options == null ? {} : options;
                for (var key in iDialog.default) {
                    if (options[key] === undefined || options[key] === null) {
                        options[key] = iDialog.default[key];
                    }
                }
                iDialog.options[iDialog._id] = options;
            }
            if (iDialog.options[iDialog._id].defaulttmpl) {
                content = '<div class="confirmmsg" style="margin: auto;">' +
                    '<div class="ftitle" style="font-size: 16px; font-weight: bold; text-align: center; padding: 20px 0;">' + iDialog.options[iDialog._id].title + '</div>' +
                    '<div class="fcontent" style="color: #666666; padding: 10px 20px 20px 20px; text-align: center;">' + content + '</div>' +
                    '<div class="ffoot" style="margin: auto; padding: 10px 0; text-align: center;  color: #FFFFFF; font-size: 14px;">' +
                    '<div class="fok" style="display:inline-block;  padding: 6px 20px; cursor: pointer; background-color:#E05658; margin:0 20px; border-radius:5px;">' + iDialog.options[iDialog._id].oktext + '</div>' +
                    '<div class="fcancel" style="display:inline-block; padding: 6px 20px; cursor: pointer; background-color:#999; margin:0 20px; border-radius:5px;">' + iDialog.options[iDialog._id].canceltext + '</div></div></div>';
            }
            var tmplHtml = '<div id=' + iDialog._id + '><div class="imask" style="display: none;position: absolute;top: 0px;left: 0px;background-color: #333;z-index:' + iDialog.options[iDialog._id].zindex + ';opacity: 0.3;-moz-opacity: 0.3;filter: alpha(opacity=30);"></div>' +
                '<div class="ipopup" style="display: none;position: fixed;border: 1px solid rgba(178,178,178,.3);border-radius: 6px;background: #fff;z-index:' + (iDialog.options[iDialog._id].zindex + 1) + ';max-width:90%;">' +
                '<div class="iclose" style="position:absolute;top:-10px;right:-10px;width:22px;height:22px;border-radius: 16px;color:#f00;cursor:pointer;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3ZWY5MWU0Ny0zYTMzLTRjMWQtYmZkMy1jNThkZWI2M2IzYmEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RERGRTFFQTc5MzQxMTFFNTk4MzI5MTc3QjAzNDdGREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RERGRTFFQTY5MzQxMTFFNTk4MzI5MTc3QjAzNDdGREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjNzQ2MWJiMS0wNDU2LTRhNGQtYWM5Mi0zZjFmMGVhMjVhMmMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N2VmOTFlNDctM2EzMy00YzFkLWJmZDMtYzU4ZGViNjNiM2JhIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+otaq+gAAAKtQTFRF//zs//vp///9//74/7Oz/5qa/87O//f3/39//3Bw/1pa/6Oj/1RU/1VV/4WF/2tr/5mZ/6Ki/+fn/62t/11d//3z//76///+/6mp/1xc/8PD/8fH/6Sk/1lZ/8bG/+bm/4yM/4uL/1NT/1hY/4iI/3R0/7e3/2Nj/19f/4qK/2xs/2Vl//vq/1ZW/4aG/8HB/8LC//32/5eX/6ur/8jI/83N//vo/1BQ////K+jkbAAAADl0Uk5T//////////////////////////////////////////////////////////////////////////8AOqxlQAAAAY1JREFUeNqc1Xl3gjAMAPAiWFCuiRyizvs+59wI3/+TTfFogICy/Ff6e7zXpE1YnA6V64dNaBjh5qBzNbPJUis+3gOK/ZgX4l4DctH4IbGjARmak8fdJhREs5vFfSiJfhp/QGl8Y9yCF9ESuAsv4+uBneZr/OncsQZvhHbDPfRpvsJgNUeLXoJR3dp+DeWlXvPbqJZXzMW640tM6HqNSX5H7PILHolSBbsoeuqLjaJdIA4/iplqoj/L0lMnVpLRn02VcXwi5abrT6vgXc50oDRlQWcWUJqyYDEbKE1ZsJkLlKYsuMzIFVY5XfEpZ8HI4+Rs95xksUtZSaK0mz3gPWcype1M6h75VShtpYsiakFpPVVuXDdCc3yRpgGuxU0HU3yR0BWFtodrcdUeuv3j9OXfLjxcN0X2Flux/M08q+V5hk80Oy8zzyr1YEtiUL0VxM7nG01m+J/2Va0xVmu51Zp5HB+Lx8QxP4CGRQNoSI62ATXaBsVDc21iaa55yYRNxrFlh5NJaFut3Dj+E2AAm+xpzo21rlMAAAAASUVORK5CYII=) no-repeat center center; background-size: contain; background-origin: content-box;"></div>' +
                '<div class="icontent"></div></div></div>';
            var ele = $(tmplHtml);
            if ($('#' + iDialog._id).length <= 0) {
                $("body").append(ele);
            }

            var _dlg = $('#' + iDialog._id);
            var _dlg_id = _dlg.attr("id");
            _dlg.find('.icontent').html(content);
            _dlg.find('.fok').on({
                click: function () {
                    if (!iDialog.options[_dlg_id].ok) {

                    } else {
                        iDialog.options[_dlg_id].ok();
                    }
                    return false;
                }
            });
            _dlg.find('.fcancel').on({
                click: function () {
                    if (!iDialog.options[_dlg_id].cancel) {
                        iDialog.close(_dlg_id);
                    } else {
                        iDialog.options[_dlg_id].cancel();
                    }
                    return false;
                }
            });
            _dlg.find('.iclose').on({
                click: function () {
                    if (_dlg) {
                        iDialog.close(_dlg_id);
                    }
                    return false;
                }
            });

            if (!iDialog.options[iDialog._id].closebtn) {
                _dlg.find('.iclose').hide();
            }
            if (iDialog.options[iDialog._id].lock) {
                iDialog.showMask();
            }

            iDialog.showContent();

            if (iDialog.options[iDialog._id].auto) {
                setTimeout(function () {
                    if (_dlg) {
                        iDialog.close(_dlg_id);
                    }
                }, iDialog.options[iDialog._id].time);
            }

            if (callback != null && typeof (callback) != "undefined" && typeof (callback) == "function") {
                callback();
            }
        },
        showMask: function () {
            var documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            var documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
            $('#' + iDialog._id + ' .imask').css({ "height": documentHeight + "px", "width": documentWidth + "px" }).show();
            if (iDialog.options[iDialog._id].quickClose) {
                $('#' + iDialog._id + ' .imask').on("click", function () {
                    var dlg = $(this).parent();
                    iDialog.close(dlg.attr("id"));
                });
            }
        },
        showContent: function () {
            var ipopupobj = $('#' + iDialog._id + ' .ipopup');
            ipopupobj.show();
            iDialog.resize();
            iDialog.center(ipopupobj);
            ipopupobj.removeClass('animateOut').addClass('animateIn').removeClass('animated').addClass('animated');
        },
        resize: function () {
            var content = $('#' + iDialog._id + ' .icontent');
            var width = iDialog.options[iDialog._id].width;
            var height = iDialog.options[iDialog._id].height;
            content.removeAttr("style");
            if (content.children().length == 0) {
                content.css({ "padding": "16px" });
                if (!!iDialog.options[iDialog._id].type) {
                    $('#' + iDialog._id + ' .ipopup').removeClass(function (index, css) {
                        return (css.match(/\bmsg-\S+/g) || []).join('');
                    })
                    $('#' + iDialog._id + ' .ipopup').addClass("msg-" + iDialog.options[iDialog._id].type);
                }
                return false;
            }
            content.css({ "height": height + "px", "width": width + "px" });
        },
        center: function (obj) {
            var top = ($(window).height() - $(obj).height()) / 2;
            var left = ($(window).width() - $(obj).width()) / 2;
            $(obj).css({ "top": top + "px", "left": left + "px" });
        },
        close: function (id) {
            if ($('#' + id + ' .ipopup').css('animation-name') == 'none') {
                $('#' + id + ' .ipopup').hide();
            } else {
                setTimeout(function () {
                    $('#' + id + ' .ipopup').hide();
                }, 500);
            }
            $('#' + id + ' .ipopup').removeClass('animateIn').addClass("animateOut").removeClass('animated').addClass('animated');
            $('#' + id + ' .imask').hide();
        }
    }

    //简单调用
    lib.dialog={
        full: function (id, content, options, callback) {
            iDialog.show(id, content, options, callback);
        },
        show: function (content,ok) {
            iDialog.show("idlg", content, { ok: ok, cancel: function () { iDialog.close("idlg"); }, canceltext: "关闭" });
        },
        msg: function (msg, type) {
            iDialog.show("imsg", msg, { lock: false, auto: true, zindex: 999, defaulttmpl: false, type: type });
        },
        close: function (id) {
            iDialog.close(id);
        }
    }

    //cookies
    lib.cookies={
        // 添加Cookie
        addCookie: function(name, value, options) {
            if (arguments.length > 1 && name != null) {
                if (options == null) {
                    options = {};
                }
                if (value == null) {
                    options.expires = -1;
                }
                if (typeof options.expires == "number") {
                    var time = options.expires;
                    var expires = options.expires = new Date();
                    expires.setTime(expires.getTime() + time * 1000);
                }
                if (options.path == null) {
                    options.path = "/";
                }
                if (options.domain == null) {
                    options.domain = ".qccr.com";
                }
                document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires != null ? "; expires=" + options.expires.toUTCString() : "") + ("; path=/") + ("; domain=" + options.domain) + (options.secure != null ? "; secure" : "");
            }
        },
        // 获取Cookie
        getCookie: function(name) {
            if (name != null) {
                var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
                return value ? decodeURIComponent(value[1]) : null;
            }
        }
    }


    //page
    lib.loadPage = function () {
        var showPages = function (target, curPage, itemCount, navFunc, pagesize) { //初始化属性
            this.currentPage = curPage;         //当前页数
            this.totalPage = 1;    //总页数
            this.itemCount = itemCount;
            this.pageSize = pagesize;
            this.target = target;
            this.navFunc = navFunc;
        }
        showPages.prototype.checkPages = function () { //进行当前页数和总页数的验证
            if (isNaN(parseInt(this.currentPage))) this.currentPage = 1;
            if (this.currentPage < 1) this.currentPage = 1;
            this.currentPage = parseInt(this.currentPage);

            if (this.itemCount % this.pageSize == 0) {
                this.totalPage = this.itemCount / this.pageSize;
            } else {
                this.totalPage = this.itemCount / this.pageSize + 1;
            }

            if (isNaN(parseInt(this.totalPage))) this.totalPage = 1;
            if (this.totalPage < 1) this.totalPage = 1;
            if (this.currentPage > this.totalPage) this.currentPage = this.totalPage;
            this.totalPage = parseInt(this.totalPage);
        }
        showPages.prototype.createHtml = function () { //生成html代码
            var strHtml = '', prevPage = this.currentPage - 1, nextPage = this.currentPage + 1;
            strHtml += '<span class="number">';
            if (prevPage < 1) {
                strHtml += '<span title="首页" class="disabled">首页</span>';
                strHtml += '<span title="上一页" class="disabled">上一页</span>';
            } else {
                strHtml += '<span title="首页"><a href="javascript:void(0);" page="1">首页</a></span>';
                strHtml += '<span title="上一页"><a href="javascript:void(0);" page="' + prevPage + '">上一页</a></span>';
            }
            var startPage;
            if (this.currentPage % 10 == 0) {
                startPage = this.currentPage - 9;
            } else {
                startPage = this.currentPage - this.currentPage % 10 + 1;
            }
            if (startPage > 10) strHtml += '<span title="前十页"><a href="javascript:void(0);" page="' + (startPage - 1) + '">...</a></span>';
            for (var i = startPage; i < startPage + 10; i++) {
                if (i > this.totalPage) break;
                if (i == this.currentPage) {
                    strHtml += '<span class="current" title="第' + i + '页">' + i + '</span>';
                } else {
                    strHtml += '<span title="第' + i + '页"><a href="javascript:void(0);" page="' + i + '">' + i + '</a></span>';
                }
            }
            if (this.totalPage >= startPage + 10) strHtml += '<span title="后10页"><a href="javascript:void(0);" page="' + (startPage + 10) + '">...</a></span>';
            if (nextPage > this.totalPage) {
                strHtml += '<span title="下一页" class="disabled">下一页</span>';
                strHtml += '<span title="尾页" class="disabled">尾页</span>';
            } else {
                strHtml += '<span title="下一页"><a href="javascript:void(0);" page="' + nextPage + '">下一页</a></span>';
                strHtml += '<span title="尾页"><a href="javascript:void(0);" page="' + this.totalPage + '">尾页</a></span>';
            }
            strHtml += '</span><span class="pg_count">共' + this.itemCount + '条</span><div class=\"clear\"></div>';
            return strHtml;
        }
        showPages.prototype.createHtmlLite = function () { //生成html代码
            var strHtml = '', prevPage = this.currentPage - 1, nextPage = this.currentPage + 1;
            strHtml += '<span class="number lite">';
            if (prevPage < 1) {
                strHtml += '<span title="首页" class="disabled"><<</span>';
                strHtml += '<span title="上一页" class="disabled"><</span>';
            } else {
                strHtml += '<span title="首页"><a href="javascript:void(0);" page="1"><<</a></span>';
                strHtml += '<span title="上一页"><a href="javascript:void(0);" page="' + prevPage + '"><</a></span>';
            }
            var startPage;
            if (this.currentPage % 10 == 0) {
                startPage = this.currentPage - 9;
            } else {
                startPage = this.currentPage - this.currentPage % 10 + 1;
            }
            if (startPage > 10) strHtml += '<span title="前十页"><a href="javascript:void(0);" page="' + (startPage - 1) + '">...</a></span>';
            for (var i = startPage; i < startPage + 10; i++) {
                if (i > this.totalPage) break;
                if (i == this.currentPage) {
                    strHtml += '<span class="current" title="第' + i + '页">' + i + '</span>';
                } else {
                    strHtml += '<span title="第' + i + '页"><a href="javascript:void(0);" page="' + i + '">' + i + '</a></span>';
                }
            }
            if (this.totalPage >= startPage + 10) strHtml += '<span title="后10页"><a href="javascript:void(0);" page="' + (startPage + 10) + '">...</a></span>';
            if (nextPage > this.totalPage) {
                strHtml += '<span title="下一页" class="disabled">></span>';
                strHtml += '<span title="尾页" class="disabled">>></span>';
            } else {
                strHtml += '<span title="下一页"><a href="javascript:void(0);" page="' + nextPage + '">></a></span>';
                strHtml += '<span title="尾页"><a href="javascript:void(0);" page="' + this.totalPage + '">>></a></span>';
            }
            strHtml += '</span>';
            return strHtml;
        }
        showPages.prototype.printHtml = function () { //显示html代码
            this.checkPages();
            $(this.target).html(this.createHtml());
            var navPage = this.navFunc;
            $(this.target).find(".number a[page]").click(function () {
                navPage($(this).attr("page"));

                if(lib.searchKeywords){
                    lib.searchKeywords.keywords.pageNumber=$(this).attr("page");
                    lib.searchKeywords.set(lib.searchKeywords.keywords);
                }
            });
        }
        showPages.prototype.printHtmlLite = function () { //显示html代码
            this.checkPages();
            $(this.target).html(this.createHtmlLite());
            var navPage = this.navFunc;
            $(this.target).find(".number a[page]").click(function () {
                navPage($(this).attr("page"));

                if(lib.searchKeywords){
                    lib.searchKeywords.keywords.pageNumber=$(this).attr("page");
                    lib.searchKeywords.set(lib.searchKeywords.keywords);
                }
            });
        }
        return showPages;
    };


    /********   localStorage   *********/
    lib.localStorageUtils = {
        set: function (key, value) {
            localStorage.setItem(key, value);
        },
        get: function (key) {
            return localStorage.getItem(key);
        },
        remove: function (key) {
            return localStorage.removeItem(key);
        },
        clear: function () {
            return localStorage.clear();
        }
    };

    /********   localDataStore   *********/
    (function (window) {
        window.localDataStore = {
            hname: location.hostname ? location.hostname : 'localStatus',
            isLocalStorage: window.localStorage ? true : false,
            dataDom: null,
            initDom: function () {
                if (!this.dataDom) {
                    try {
                        this.dataDom = document.createElement('input');
                        this.dataDom.type = 'hidden';
                        this.dataDom.style.display = "none";
                        this.dataDom.addBehavior('#default#userData');
                        document.body.appendChild(this.dataDom);
                        var exDate = new Date();
                        exDate = exDate.getDate() + 365;
                        this.dataDom.expires = exDate.toUTCString();
                    } catch (ex) {
                        return false;
                    }
                }
                return true;
            },
            set: function (key, value) {
                if (this.isLocalStorage) {
                    window.localStorage.setItem(key, value);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        this.dataDom.setAttribute(key, value);
                        this.dataDom.save(this.hname)
                    }
                }
            },
            get: function (key) {
                if (this.isLocalStorage) {
                    return window.localStorage.getItem(key);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        return this.dataDom.getAttribute(key);
                    }
                }
            },
            remove: function (key) {
                if (this.isLocalStorage) {
                    localStorage.removeItem(key);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        this.dataDom.removeAttribute(key);
                        this.dataDom.save(this.hname)
                    }
                }
            }
        }
    })(window);


    /****************************************************************************/
    //初始化uploadify
    /*var ASPSESSID = "@Session.SessionID";
    var AUTHID = "@(Request.Cookies[FormsAuthentication.FormsCookieName] == null ? string.Empty : Request.Cookies[FormsAuthentication.FormsCookieName].Value)";
    */
    lib.initUploadify = function (target,queueID,uploadLimit,fileSizeLimit,callback,ASPSESSID, AUTHID) {
        //require('../3rd/uploadify/jquery-uploadify.js');
        //require('../3rd/uploadify/uploadify.css');
        uploadLimit = uploadLimit?uploadLimit:0;
        $("#"+target).uploadify({
            uploader: '/file/upload.json?FileType=image',
            swf: '/resources/3rd/uploadify/uploadify.swf',
            buttonImage: '/resources/3rd/uploadify/sltupload.gif',
            cancelImage: '/resources/3rd/uploadify/uploadify-cancel.png',
            fileTypeDesc: "All Files",
            fileTypeExts: '*.jpg; *.jpeg; *.gif; *.png; *.bmp;',
            fileSizeLimit: fileSizeLimit,
            multi: false,
            auto: true,
            removeCompleted: true,
            queueID: queueID,
            uploadLimit: uploadLimit,
            fileObjName: 'file',
            //formData: { ASPSESSID: ASPSESSID, AUTHID: AUTHID },
            onSelectError: function (file) {
                //showMsg("选择有误","error");
            },
            onUploadSuccess: function (file, data, response) {//上传完成时触发（每个文件触发一次）
                //var vals = eval("(" + unescape(data) + ")");
                if(callback)
                    callback(file, data);
                //上传成功的文件，点删除后无回调事件（不会触发onCancel事件），为canel按钮注册click事件
                var cancel = $("#" + file.id + " .cancel a");
                if (cancel) {
                    cancel.click(function () {
                        //通过uploadify的settings方式重置上传限制数量
                        $('#file_upload').uploadify('settings', 'uploadLimit', ++uploadLimit);
                        $(this).hide();
                    });
                }
            }
        });
    };
    var uploadfile = function () {
        //$('#file_upload').uploadify('upload', '*');
    };


    (function($) {
        $.fn.extend({
            uploader: function(options) {
                var settings = {
                    url: '/admin/file/upload.jhtml',
                    fileType: "image",
                    fileName: "file",
                    data: {},
                    maxSize: 10,
                    extensions: null,
                    before: null,
                    complete: null
                };
                $.extend(settings, options);
                
                if (settings.extensions == null) {
                    switch(settings.fileType) {
                        case "media":
                            settings.extensions = 'swf,flv,mp3,wav,avi,rm,rmvb';
                            break;
                        case "file":
                            settings.extensions = 'zip,rar,7z,doc,docx,xls,xlsx,ppt,pptx';
                            break;
                        default:
                            settings.extensions = 'jpg,jpeg,bmp,gif,png';
                    }
                }
                
                var $progressBar = $('<div class="progressBar"><\/div>').appendTo("body");
                return this.each(function() {
                    var element = this;
                    var $element = $(element);
                    
                    var webUploader = WebUploader.create({
                        swf: '/resources/admin/flash/webuploader.swf',
                        server: settings.url + (settings.url.indexOf('?') < 0 ? '?' : '&') + 'fileType=' + settings.fileType + '&token=' + getCookie("token"),
                        pick: {
                            id: element,
                            multiple: false
                        },
                        fileVal: settings.fileName,
                        formData: settings.data,
                        fileSingleSizeLimit: settings.maxSize * 1024 * 1024,
                        accept: {
                            extensions: settings.extensions
                        },
                        fileNumLimit: 1,
                        auto: true
                    }).on('beforeFileQueued', function(file) {
                        if ($.isFunction(settings.before) && settings.before.call(element, file) === false) {
                            return false;
                        }
                        if ($.trim(settings.extensions) == '') {
                            this.trigger('error', 'Q_TYPE_DENIED');
                            return false;
                        }
                        this.reset();
                        $progressBar.show();
                    }).on('uploadProgress', function(file, percentage) {
                        $progressBar.width(percentage * 100 + '%');
                    }).on('uploadAccept', function(file, data) {
                        $progressBar.fadeOut("slow", function() {
                            $progressBar.width(0);
                        });
                        if (data.message.type != 'success') {
                            $.message(data.message);
                            return false;
                        }
                        $element.prev("input:text").val(data.url);
                        if ($.isFunction(settings.complete)) {
                            setTimeout(function(){settings.complete.call(element, file, data);},1200);
                        }
                    }).on('error', function(type) {
                        switch(type) {
                            case "F_EXCEED_SIZE":
                                $.message("warn", "上传文件大小超出限制");
                                break;
                            case "Q_TYPE_DENIED":
                                $.message("warn", "上传文件格式不正确");
                                break;
                            default:
                                $.message("warn", "上传文件出现错误");
                        }
                    });
                    
                    $element.mouseover(function() {
                        webUploader.refresh();
                    });
                });
            }, 
            //ueditor      
            editor: function() {
                window.UEDITOR_CONFIG = {
                    UEDITOR_HOME_URL: '/resources/3rd/ueditor1.4.3.1/',
                    serverUrl: '/file/editor/upload.json',
                    imageActionName: "uploadImage",
                    imageFieldName: "file",
                    imageMaxSize: 10485760,
                    imageAllowFiles: ['.jpg', '.jpeg', '.bmp', '.gif', '.png'],
                    imageCompressEnable: false,
                    imageCompressBorder: 1600,
                    imageInsertAlign: "none",
                    imageUrlPrefix: "http://static.qichechaoren.com/upload/",
                    imagePathFormat: "",
                    videoActionName: "uploadMedia",
                    videoFieldName: "file",
                    videoMaxSize: 10485760,
                    videoAllowFiles: ['.swf', '.flv', '.mp3', '.wav', '.avi', '.rm', '.rmvb'],
                    videoUrlPrefix: "",
                    videoPathFormat: "",
                    fileActionName: "uploadFile",
                    fileFieldName: "file",
                    fileMaxSize: 10485760,
                    fileAllowFiles: ['.zip', '.rar', '.7z', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
                    fileUrlPrefix: "",
                    filePathFormat: "",
                    toolbars: [[
                        'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                        'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                        'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                        'print', 'preview', 'searchreplace', 'help', 'drafts'
                    ]],
                    wordCount: false
                };
                
                UE.Editor.prototype.getActionUrl = function(action) {
                    var serverUrl = this.getOpt('serverUrl');
                    switch(action) {
                        case "uploadImage":
                            return serverUrl + (serverUrl.indexOf('?') < 0 ? '?' : '&') + 'fileType=image';
                        case "uploadMedia":
                            return serverUrl + (serverUrl.indexOf('?') < 0 ? '?' : '&') + 'fileType=media';
                        case "uploadFile":
                            return serverUrl + (serverUrl.indexOf('?') < 0 ? '?' : '&') + 'fileType=file';
                    }
                    return null;
                };
                
                UE.Editor.prototype.loadServerConfig = function() {
                    this._serverConfigLoaded = true;
                };
                
                var ue=null;
                this.each(function() {
                    var element = this;
                    var $element = $(element);
                    ue=UE.getEditor($element.attr("id"));
                });

                return ue;
            }
        });
    })(jQuery);


    (function ($) {
        var loader = "<span class='loading'>处理中...</span>";
        $.extend({
            startSubmit:function (objid, isloader) {
                $("#" + objid).attr("disabled", true);
                $("#" + objid).unbind("click");
                if (isloader)
                    $("#" + objid).after(loader);
            },
            endSubmit:function (objid, isloader, handler) {
                $("#" + objid).attr("disabled", false);
                if (isloader)
                    $("#" + objid).next().remove();
                if (handler != null)
                    $("#" + objid).bind("click", handler);
            }
        });
    })(jQuery);


   (function($) {
        var ColorHex=new Array('00','33','66','99','CC','FF');
        var SpColorHex=new Array('FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF');
        $.fn.colorpicker = function(options) {
            var opts = jQuery.extend({}, jQuery.fn.colorpicker.defaults, options);
            initColor();
            return this.each(function(){
                var obj = $(this);
                obj.bind(opts.event,function(){
                    //定位
                    var ttop  = $(this).offset().top;     //控件的定位点高
                    var thei  = $(this).height();  //控件本身的高
                    var tleft = $(this).offset().left;    //控件的定位点宽
                    $("#colorpanelmask").show();
                    $("#colorpanel").css({
                        top:ttop+thei+22,
                        left:tleft
                    }).show();
                    var target = opts.target ? $(opts.target) : obj;
                    if(target.data("color") == null){
                        target.data("color",target.css("color"));
                    }
                    if(target.data("value") == null){
                        target.data("value",target.val());
                    }
              
                    $("#_creset").bind("click",function(){
                        target.css("color", target.data("color")).val(target.data("value"));
                        $("#colorpanel").hide();
                        $("#colorpanelmask").hide();
                        opts.reset(obj);
                    });
              
                    $("#CT tr td").unbind("click").mouseover(function(){
                        var color=$(this).css("background-color");
                        $("#DisColor").css("background",color);
                        $("#HexColor").val($(this).attr("rel"));
                    }).click(function(){
                        var color=$(this).attr("rel");
                        color = opts.ishex ? color : getRGBColor(color);
                        if(opts.fillcolor) target.val(color);
                        target.css("color",color);
                        $("#colorpanel").hide();
                        $("#colorpanelmask").hide();
                        $("#_creset").unbind("click");
                        opts.success(obj,color);
                    });
                });
            });
        
            function initColor(){
                $("body").append('<div id="colorpanelmask" style="display: none;position: absolute;top: 0px;left: 0px;width:100%;height:100%;z-index:998;background-color: #fff;opacity: 0;-moz-opacity: 0;filter: alpha(opacity=0);"></div>');
                $("body").append('<div id="colorpanel" style="position: absolute; display: none;z-index:999;"></div>');
                var colorTable = '';
                var colorValue = '';
                for(var i=0;i<2;i++){
                    for(var j=0;j<6;j++){
                        colorTable=colorTable+'<tr height=12>'
                        colorTable=colorTable+'<td width=11 rel="#000000" style="background-color:#000000">'
                        colorValue = i==0 ? ColorHex[j]+ColorHex[j]+ColorHex[j] : SpColorHex[j];
                        colorTable=colorTable+'<td width=11 rel="#'+colorValue+'" style="background-color:#'+colorValue+'">'
                        colorTable=colorTable+'<td width=11 rel="#000000" style="background-color:#000000">'
                        for (var k=0;k<3;k++){
                            for (var l=0;l<6;l++){
                                colorValue = ColorHex[k+i*3]+ColorHex[l]+ColorHex[j];
                                colorTable=colorTable+'<td width=11 rel="#'+colorValue+'" style="background-color:#'+colorValue+'">'
                            }
                        }
                    }
                }
                colorTable='<table width=233 border="0" cellspacing="0" cellpadding="0" style="border:1px solid #000;">'
                +'<tr height=30><td colspan=21 bgcolor=#cccccc>'
                +'<table cellpadding="0" cellspacing="1" border="0" style="border-collapse: collapse">'
                +'<tr><td width="3"><td><input type="text" id="DisColor" size="6" disabled style="border:solid 1px #000000;background-color:#ffff00"></td>'
                +'<td width="3"><td><input type="text" id="HexColor" size="7" style="border:inset 1px;font-family:Arial;" value="#000000"><a href="javascript:void(0);" id="_cclose">关闭</a> | <a href="javascript:void(0);" id="_creset">清除</a></td></tr></table></td></table>'
                +'<table id="CT" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000"  style="cursor:pointer;">'
                +colorTable+'</table>';
                $("#colorpanel").html(colorTable);
                $("#_cclose").on('click',function(){
                    $("#colorpanel").hide();
                    $("#colorpanelmask").hide();
                    return false;
                }).css({
                    "font-size":"12px",
                    "padding-left":"20px"
                });

                $("#colorpanelmask").click(function(){
                    $("#colorpanel").hide();
                    $("#colorpanelmask").hide();
                })
            }
            
            function getRGBColor(color) {
                var result;
                if ( color && color.constructor == Array && color.length == 3 )
                    color = color;
                if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
                    color = [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
                if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
                    color =[parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
                if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
                    color =[parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
                if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
                    color =[parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
                return "rgb("+color[0]+","+color[1]+","+color[2]+")";
            }
        };
        jQuery.fn.colorpicker.defaults = {
            ishex : true, 
            fillcolor:false,
            target: null,
            event: 'click',
            success:function(){},
            reset:function(){}
        };
    })(jQuery);


    lib.searchKeywords = {
        key:'',
        keywords:{},
        set: function (value) {
            if(this.key){
                var curTime = new Date();
                var hours = curTime.getHours();
                var ms = (24 - hours) * 60 * 60 * 1000;
                this.keywords.expire = currentTime() + ms;
                $.extend(true, this.keywords, value); 
                lib.localStorageUtils.set(this.key+'_keywords',JSON.stringify(this.keywords));
            }
        },
        get: function () {
            var val=lib.localStorageUtils.get(this.key+'_keywords');
            val=val?JSON.parse(val):{};
            if (val.expire && val.expire < currentTime()) {
                val = {};
            }
            return val;
        },
        remove: function () {
            return lib.localStorageUtils.remove(this.key+'_keywords');
        },
        clear: function () {
            return lib.localStorageUtils.clear();
        }
    };

    var currentTime = function () {
        return new Date().getTime();
    };


    module.exports=lib;
