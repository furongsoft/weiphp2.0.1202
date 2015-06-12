(function(config) {

    config["zIndex"] = 10000;
})($.dialog.defaults);

/**
 * 定义常量
 */
$.DeclareClass("XspWeb.Constant", {
    /**
     * 静态成员
     */
    Static: {
        AjaxTimeout: 30000,
        ItemsPerPage: 25
    }
});

/**
 * 定义浏览器版本帮助函数
 */
$.DeclareClass("XspWeb.Misc.Browser", {
    /**
     * 静态成员
     */
    Static: {
        Version: $.browser.version,
        IsMozilla: !!$.browser.mozilla,
        IsWebkit: (!!$.browser.webkit) || (!!$.browser.safari),
        IsMSIE: !!$.browser.msie,
        IsIE6: (!!$.browser.msie) && ($.browser.version == 6)
    }
});

/**
 * 杂项函数
 */
$.DeclareClass("XspWeb.Misc", {
    /**
     * 静态成员
     */
    Static: {
        /**
         * 获取网站根路径
         */
        GetRootPath: function() {
            return location.protocol + "//" + location.host;
        },

        /**
         * 通过正则表达式获取URL参数
         * 
         * @param {String}
         *        URL
         * @param {String}
         *        name 需获取的URL参数名称
         */
        GetQueryString: function(url, name) {

            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = url.search.substr(1).match(reg);
            if (r != null)
                return decodeURIComponent(unescape(r[2]));
            else
                return null;
        },

        /**
         * 获取URL参数,返回参数数组
         * 
         * @param {String}
         *        URL
         */
        GetRequest: function(url) {

            // 获取URL中"?"符后的字串
            url = url.search;
            url = decodeURI(url);
            var request = new Object();

            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }

            return request;
        },

        /**
         * 页面重定向
         * 
         * @param {String}
         *        URL 重定向的路径
         * @param {Boolean}
         *        parent 是否父级页面重定向
         */
        RedirectTo: function(url, parent) {

            if ((url == "") || (url == "#"))
                return;

            var rootPath = this.GetRootPath();
            if (rootPath.charAt(rootPath.length - 1) == '/')
                rootPath += '/';

            if (url.charAt(0) == '/')
                url.substr(1);

            url = rootPath + url;

            if (parent)
                window.parent.document.location = url;
            else
                window.document.location = url;
        },

        /**
         * 添加新tab页面
         * 
         * @param {String}
         *        tab XspWeb.Controls.Tabs对象
         * @param {String}
         *        title Tab标题
         * @param {String}
         *        url Tab内容AJAX请求地址
         * @param {JSON}
         *        options Tab其他配置项
         */
        AddNewTabMenu: function(tab, title, url, options) {

            if (!(tab && title && url))
                return;

            tab.AddTab(title, url, options);
        },

        /**
         * 触发菜单按钮
         * 
         * @param {String/jQuery}
         *        tabId菜单ID或菜单jQuery对象
         */
        ClickTabMenu: function(tabId) {

            var id = tabId;

            if (typeof tabId === "string") {
                id = "btnNewTab_" + tabId;
                tabId = $("#" + id);
            }

            if (!(tabId && tabId.length)) {
                if (typeof id === "string") {
                    tabId = $(window.parent[id]);
                    if (!(tabId && tabId.length))
                        return;
                }
                else
                    return;
            }

            tabId.click();
        },

        /**
         * 转化为标准的时间格式
         * 
         * @param {DateTime}
         *        value DateTime格式数据值
         * @param {Boolean}
         *        canShowTime 是否显示时间部分,可不传,默认显示
         */
        ChangeDateFormat: function(value, canShowTime) {

            if (!value)
                return "";

            if (this.IsNumber(value))
                value = new Date(value);

            if (this.IsDate(value))
                value = this.DateFormat(value, "yyyy-MM-dd hh:mm:ss");

            if (this.ValidateDateTime(value)) {
                if ((typeof canShowTime != "undefined") && (!canShowTime))
                    return value.split(' ')[0];
                else
                    return value;
            }

            if (value.toString().indexOf("/Date(") == -1) {
                if ((typeof canShowTime != "undefined") && (!canShowTime))
                    return value.split(' ')[0];
                else
                    return value;
            }

            try {
                var date = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
                var month = (date.getMonth() + 1 < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
                var currentDate = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();

                if ((typeof (canShowTime) != "undefined") && (!canShowTime)) {
                    return date.getFullYear() + '-' + month + '-' + currentDate;
                }
                else {
                    var hours = date.getHours();
                    hours = (hours < 10) ? "0" + hours : hours;
                    var monitues = date.getMinutes();
                    monitues = (monitues < 10) ? "0" + monitues : monitues;
                    var seconds = date.getSeconds();
                    seconds = (seconds < 10) ? "0" + seconds : seconds;
                    return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + monitues + ":" + seconds;
                }
            }
            catch (e) {
                return value;
            }
        },

        /**
         * 获取当前时间
         */
        GetCurrentTime: function() {

            var now = new Date();
            var year = now.getFullYear(); // 年
            var month = now.getMonth() + 1; // 月
            var day = now.getDate(); // 日

            var hh = now.getHours(); // 时
            var mm = now.getMinutes(); // 分

            var clock = year + "-";

            if (month < 10)
                clock += "0";
            clock += month + "-";

            if (day < 10)
                clock += "0";
            clock += day + " ";

            if (hh < 10)
                clock += "0";
            clock += hh + ":";

            if (mm < 10)
                clock += '0';
            clock += mm;

            return clock;
        },

        /**
         * Date对象格式化
         * 
         * @param {Object}
         *        date Date对象
         * @param {String}
         *        format 指定的格式,可以用1~4个占位符的格式:年(y),可以用1~2个占位符的格式:月(M)/日(d)/小时(h)/分(m)/秒(s)/季度(q),只能用1个占位符的格式:毫秒(S)(是1~3位的数字)
         * 
         * @example
         * 
         * DateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S")==>"2014-02-20 11:18:32.520"
         * 
         * DateFormat(new Date(),"yyyy-M-d h:m:s.S")==>"2014-2-20 11:18:32.228"
         */
        DateFormat: function(date, format) {
            if (!this.IsDate(date))
                return null;

            var o = {
                // 月份
                "M+": date.getMonth() + 1,

                // 日
                "d+": date.getDate(),

                // 小时
                "h+": date.getHours(),

                // 分
                "m+": date.getMinutes(),

                // 秒
                "s+": date.getSeconds(),

                // 季度
                "q+": Math.floor((date.getMonth() + 3) / 3),

                // 毫秒
                "S": date.getMilliseconds()
            };

            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

            for ( var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

            return format;
        },

        /**
         * 日期验证
         * 
         * @param {String}
         *        value 要验证的日期
         */
        ValidateDate: function(value) {
            return $.fn.validatebox.defaults.rules.date.validator(value);
        },

        /**
         * 长时间格式验证,例如:2013-08-11 11:13:14
         * 
         * @param {String}
         *        value 要验证的长时间
         */
        ValidateDateTime: function(value) {
            return $.fn.validatebox.defaults.rules.datetime.validator(value);
        },

        /**
         * 时间格式验证,不带秒,例如:2013-08-11 11:13
         * 
         * @param {String}
         *        value 要验证的长时间
         */
        ValidateDateTimeNoSeconds: function(value) {
            return $.fn.validatebox.defaults.rules.datetimenoseconds.validator(value);
        },

        /**
         * 格式化字符串,变长参数
         */
        StringFormat: function() {

            if (arguments.length == 0)
                return null;

            var str = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp("\\{' + (i - 1) + '\\}", "gm");
                str = str.replace(re, arguments[i]);
            }

            return str;
        },

        /**
         * 合并两个JSON对象
         * 
         * @param {Array/JSON}
         *        json 需合并的JSON对象数组,或者是需合并的JSON对象
         * @param {JSON}
         *        merger 合并后的JSON对象
         * @param {Boolean}
         *        canOverride 相同的name是否被后面的覆盖,默认为不覆盖
         * 
         * @example
         * <li>var a ={"a":"1","b":"2","c":"c"}</li>
         * <li>var b ={"c":"3","d":"4","e":"5"}</li>
         * <li>var c = MergerJson([a,b]); // c={"a":"1","b":"2","c":"c","d":"4","e":"5"}</li>
         * <li>MergerJson([a,b],d,true); // d={"a":"1","b":"2","c":"3","d":"4","e":"5"}</li>
         */
        MergerJson: function(json, merger, canOverride) {

            if ((typeof merger === "undefined") || (merger == null))
                merger = {};

            if ((typeof canOverride === "undefined") || (canOverride == null))
                canOverride = false;

            if (json instanceof Array) {
                for (var i = 0, len = json.length; i < len; i++) {
                    this.MergerJson(json[i], merger, canOverride);
                }
            }
            else {
                for ( var j in json) {
                    if (canOverride || !(j in merger)) {
                        merger[j] = json[j];
                    }
                }
            }

            return merger;
        },

        /**
         * 判断函数是否存在
         * 
         * @param {String/Function}
         *        func 函数或函数名
         */
        IsFunction: function(func) {

            if (typeof func === "function") {
                return true;
            }
            else if (typeof func === "string") {
                try {
                    if (typeof (eval(func)) === "function")
                        return true;
                }
                catch (e) {
                }
            }

            return false;
        },

        /**
         * 判断字符变量是否存在
         * 
         * @param {String}
         *        str 字符变量或字符变量名
         */
        IsString: function(str) {

            if (typeof str === "string")
                return true;

            try {
                if (typeof (eval(str)) === "string")
                    return true;
            }
            catch (e) {
            }

            return false;
        },

        /**
         * 判断是否为数字类型
         * 
         * @param num
         *        数字或数字对象名
         */
        IsNumber: function(num) {

            if (typeof num === "number")
                return true;

            try {
                if (typeof (eval(num)) === "number")
                    return true;
            }
            catch (e) {
            }

            return false;
        },

        /**
         * 判断是否为Date对象
         * 
         * @param {Object}
         *        date Date对象
         */
        IsDate: function(date) {

            if (this.IsObject(date) && (date instanceof Date))
                return true;

            return false;
        },

        /**
         * 判断是否为对象
         * 
         * @param {String/Object}
         *        obj 对象或对象名
         */
        IsObject: function(obj) {

            if (typeof obj === "object")
                return true;

            try {
                if (typeof (eval(obj)) === "object")
                    return true;
            }
            catch (e) {
            }

            return false;
        },

        /**
         * 信息提示
         * 
         * @param {String}
         *        message 提示信息
         * @param {Function}
         *        callback 回调函数
         */
        Alert: function(message, callback) {

            $.dialog.alert(message, callback);
        },

        /**
         * 确认提示
         * 
         * @param {String}
         *        message 提示信息
         * @param {Function}
         *        callback 确认回调事件
         * @param {Function/String}
         *        cancelCallback 取消回调事件,或取消提示的消息
         */
        Confirm: function(message, callback, cancelCallback) {

            $.dialog.confirm(message, callback, cancelCallback);
        },

        /**
         * 输入提示
         * 
         * @param {String}
         *        message 提示信息
         * @param {String}
         *        value 提示值
         * @param {Function}
         *        callback 确认回调事件
         */
        Prompt: function(message, value, callback) {

            $.dialog.prompt(message, callback, value);
        },

        /**
         * 短暂信息提示
         * 
         * @param {String}
         *        message 提示信息
         * @param {Number}
         *        time 显示的时间(毫秒)
         */
        Tips: function(message, time) {

            $.dialog.tips(message, time);
        },

        /**
         * 时间倒计时信息提示
         * 
         * @param {String}
         *        message 提示信息
         * @param {Number}
         *        time 倒计时时间(秒)
         * @param {Function}
         *        callback 确认回调事件
         */
        Timer: function(message, time, callback) {

            var timer = null;
            $.dialog.through({
                title: false,
                cancel: false,
                esc: false,
                fixed: true,
                lock: true,
                content: "<div style=\"padding: 0 1em;\">" + message + "</div>",
                init: function() {
                    var that = this, i = time;
                    var fn = function() {
                        if (typeof callback === "function")
                            callback(that, i);

                        !i && that.close();
                        i--;
                    };
                    timer = setInterval(fn, 1000);
                    fn();
                },
                close: function() {
                    clearInterval(timer);
                }
            }).show();
        },

        /**
         * 对话框
         * 
         * @param {jQuery}
         *        element jQuery对象元素
         * @param {Object}
         *        options 对话框配置参数
         */
        Dialog: function(element, options) {

            options = this.MergerJson([{
                width: 800,
                height: 520,
                closed: false,
                cache: false,
                maximizable: true,
                resizable: true,
                modal: true
            }, options], {}, true);

            return element.dialog(options);
        },

        /**
         * 顶级窗口的对话框
         * 
         * @param {Object}
         *        options 对话框配置参数
         * @param {String}
         *        id 对话框id,一个id只能打开一个窗口,默认为DialogTopWindow
         */
        TopDialog: function(options, id) {

            if (!id)
                id = "DialogTopWindow";

            var markup = window.top.$("#" + id);
            if (!markup.length)
                markup = window.top.$("<div id=\"" + id + "\"></div>").appendTo(window.top.document.body);

            options = $.extend({}, {
                width: 800,
                height: 520,
                cache: false,
                maximizable: true,
                resizable: true,
                modal: true
            }, options);

            return markup.dialog(options);
        },

        /**
         * 打开新窗口页面
         * 
         * @param {String}
         *        url 页面路径
         */
        OpenNewWindow: function(url) {

            if ((url == "") || (url == "#"))
                return;

            window.open(url);
        },

        /**
         * Ajax请求处理
         * 
         * @param {Object}
         *        settings 参数key/value对象,包含各配置及回调函数信息
         */
        Ajax: function(settings) {

            $.ajax({
                // (默认: "POST") 请求方式 ("POST" 或
                // "GET")注意:其它HTTP请求方法,如PUT和DELETE也可以使用,但仅部分浏览器支持
                type: (!settings.type) ? "POST" : settings.type,

                // (默认: true) 默认设置下,所有请求均为异步请求如果需要发送同步请求,请将此选项设置为
                // false注意,同步请求将锁住浏览器,用户其它操作必须等待请求完成才可以执行
                async: (typeof settings.async != "boolean") ? true : settings.async,

                // (默认:false) 是否从浏览器缓存中请求信息
                cache: "false",

                // 发送请求的地址
                url: this.GetRootPath() + settings.action,

                // 发送到服务器的数据将自动转换为请求字符串格式GET请求中将附加在URL后
                // 查看processData选项说明以禁止此自动转换 必须为Key/Value格式如果为数组
                // jQuery将自动为不同值对应同一个名称
                // 如{foo:["bar1", "bar2"]}转换为"&foo=bar1&foo=bar2"
                data: (!settings.data) ? {} : settings.data,

                // (默认:10秒) 设置请求超时时间(毫秒)此设置将覆盖全局设置
                timeout: (!settings.timeout) ? XspWeb.Constant.AjaxTimeout : settings.timeout,

                /**
                 * (默认:json) 预期服务器返回的数据类型如果不指定,jQuery 将自动根据 HTTP 包 MIME 信息返回 responseXML 或 responseText,并作为回调函数参数传递,可用值: "text":返回纯文本字符串 "xml": 返回 XML 文档,可用 jQuery 处理 "html": 返回纯文本 HTML 信息；包含的script标签会在插入dom时执行 "script": 返回纯文本 JavaScript 代码不会自动缓存结果除非设置了"cache"参数 "json": 返回 JSON 数据 "jsonp": JSONP 格式使用 JSONP 形式调用函数时,如 "myurl?callback=?" jQuery 将自动替换 ? 为正确的函数名,以执行回调函数
                 */
                dataType: (!settings.dataType) ? "text" : settings.dataType,

                /**
                 * 发送请求前可修改xmlHttpRequest对象的函数,如添加自定义HTTP头如果返回false可以取消本次ajax请求
                 * 
                 * @param {xmlHttpRequest}
                 */
                beforeSend: function(xmlHttpRequest) {
                    if (typeof settings.beforeSend === "function")
                        settings.beforeSend(xmlHttpRequest);
                },

                /**
                 * 请求成功后回调函数
                 * 
                 * @param {根据dataType配置生成的数据类型}
                 *        data 服务器返回数据,可能是 xmlDoc, jsonObj, html, text, 等等...
                 * @param {String}
                 *        textStatus 返回状态
                 */
                success: function(data, textStatus) {

                    if (typeof settings.success === "function") {
                        if ((typeof data != "undefined") && (data != null) && (data != "")) {
                            var temp = eval("(" + data + ")");
                            if (!temp)
                                data = null;
                            else
                                data = temp;
                        }

                        settings.success(data, textStatus);
                    }
                },

                /**
                 * (默认: 自动判断(xml或html))请求失败时将调用此方法
                 * 
                 * @param {Object}
                 *        jqXHR XMLHttpRequest对象
                 * @param {String或者异常对象}
                 *        textStatus 错误信息,除了null,还可能为"timeout", "error", "abort", and "parsererror"
                 * @param {Object}
                 *        errorThrown (可能)捕获的错误对象,HTTP错误发生时,errorThrown接收HTTP状态的文字部分,如“Not Found”或“内部服务器错误"
                 */
                error: function(jqXHR, textStatus, errorThrown) {

                    var msg = "";
                    XspWeb.Misc.Tips("Ajax请求异常", XspWeb.Constant.AjaxTimeout);

                    if (settings.showerror != false) {
                        switch (textStatus) {
                            case "timeout":
                                msg = XspWeb.Misc.Language.Ajax.Timeout;
                                break;
                            case "error":
                                if (errorThrown != "Not Found")
                                    msg = XspWeb.Misc.Language.Ajax.Error;
                                else
                                    msg = XspWeb.Misc.Language.Ajax.NotFound;
                                break;
                            case "abort":
                                msg = XspWeb.Misc.Language.Ajax.Abort;
                                break;
                            case "parsererror":
                                msg = XspWeb.Misc.Language.Ajax.ParserError;
                                break;
                            default:
                                msg = XspWeb.Misc.StringFormat(XspWeb.Misc.Language.Ajax.Unknown, textStatus + errorThrown);
                                break;
                        }

                        XspWeb.Misc.Alert(msg);
                    }

                    if (typeof settings.error === "function")
                        settings.error(jqXHR, textStatus, errorThrown, msg);
                },

                /**
                 * 请求完成后回调函数 (请求成功或失败时均调用)
                 * 
                 * @param {Object}
                 *        jqXHR XMLHttpRequest对象
                 * @param {String}
                 *        textStatus 成功信息字符串:"success", "notmodified", "error", "timeout", "abort", or "parsererror"
                 */
                complete: function(jqXHR, textStatus) {

                    if (typeof settings.complete === "function")
                        settings.complete(jqXHR, textStatus);

                    jqXHR = null;
                },

                /**
                 * 一组数值的HTTP代码和函数对象,当响应时调用了相应的代码
                 */
                statusCode: {
                    404: function() {
                        XspWeb.Misc.Alert(XspWeb.Misc.Language.Ajax.NotFound);
                    }
                }
            });
        },

        /**
         * 转化时间格式
         * 
         * @param {DateTime}
         *        value DateTime格式数据值
         * @param {Boolean}
         *        canShowTime 是否显示时间部分,可不传,默认显示
         */
        ConvertDateFormat: function(value, canShowTime) {

            if (!value)
                return "";

            if (this.ValidateDateTime(value)) {
                if ((typeof (canShowTime) != "undefined") && (!canShowTime)) {
                    return value.split(' ')[0];
                }

                return value;
            }

            if (value.toString().indexOf("/Date(") == -1)
                return value;

            try {
                var date = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
                var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

                if ((typeof (canShowTime) != "undefined") && (!canShowTime)) {
                    return date.getFullYear() + '-' + month + '-' + currentDate;
                }
                else {
                    var hours = date.getHours();
                    hours = hours < 10 ? "0" + hours : hours;
                    var monitues = date.getMinutes();
                    monitues = monitues < 10 ? "0" + monitues : monitues;
                    var seconds = date.getSeconds();
                    seconds = seconds < 10 ? "0" + seconds : seconds;
                    return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + monitues + ":" + seconds;
                }
            }
            catch (e) {
                return value;
            }
        },

        /**
         * 日期验证
         * 
         * @param {String}
         *        value 要验证的日期
         */
        ValidateDate: function(value) {
            return $.fn.validatebox.defaults.rules.date.validator(value);
        },

        /**
         * 长时间格式验证 例如: 2013-08-11 11:13:14
         * 
         * @param {String}
         *        value 要验证的长时间
         */
        ValidateDateTime: function(value) {
            return $.fn.validatebox.defaults.rules.datetime.validator(value);
        },

        /**
         * 下载文件
         * 
         * @param {String}
         *        url 下载文件路径
         * @param {String}
         *        conditions 下载条件
         */
        Download: function(url, conditions) {

            var iframeId = "iframe_DownLoad_" + parseInt(Math.random() * 10000);
            var iframe = $("<iframe>").attr({
                id: iframeId,
                name: iframeId
            }).css({
                width: 0,
                height: 0,
                display: "none"
            });

            var form = $("<form>").attr({
                target: iframeId,
                method: "post",
                action: url
            });

            if (conditions) {
                if (XspWeb.Misc.IsString(conditions))
                    conditions = {
                        conditions: conditions
                    };

                for ( var param in conditions) {
                    form.append($("<input>").attr({
                        name: param,
                        value: conditions[param]
                    }));
                }
            }

            $('body').append(iframe).append(form);

            form.submit();
        }
    }
});

// 去掉字符两端的空白字符
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return $.trim(this);
    };
}

// 去掉字符左边的空白字符
if (!String.prototype.trimLeft) {
    String.prototype.trimLeft = function() {
        return this.replace(/^[\t\n\r]/g, '');
    };
}

// 去掉字符右边的空白字符
if (!String.prototype.trimRight) {
    String.prototype.trimRight = function() {
        return this.replace(/[\t\n\r]*$/g, '');
    };
}

/**
 * 扩展Array属性，增加indexOf,isContain,remove和removeAt方法 indexOf：获取数组中值的索引 isContain：判断值是否包含于数据中 removeAt：移除数组中指定下标的值 remove：移除数组中指定值
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(value) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] === value)
                return i;
        }

        return -1;
    };
}

if (!Array.prototype.isContain) {
    Array.prototype.isContain = function(value) {
        var index = this.indexOf(value);
        if (index >= 0)
            return true;
        else
            return false;
    };
}

if (!Array.prototype.removeAt) {
    Array.prototype.removeAt = function(index) {
        this.splice(index, 1);
    };
}

if (!Array.prototype.remove) {
    Array.prototype.remove = function(value) {
        var index = this.indexOf(value);
        if (index >= 0) {
            this.removeAt(index);
        }
    };
}

/**
 * 对于成员为对象的数组，通过成员对象主键(值唯一)来查找并返回该成员，未找到则返回null
 * 
 * @param {String}
 *        id 数组成员对象主键名称
 * @param {Object}
 *        value 数组成员对象主键值
 */
if (!Array.prototype.getChildObj) {
    Array.prototype.getChildObj = function(id, value) {
        for (var i = 0, l = this.length; i < l; i++) {
            var arr = this[i];
            if (arr[id] == value)
                return arr;
        }

        return null;
    };
}