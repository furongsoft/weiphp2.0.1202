(function(window, $, namespace) {
    var topWindow = window.top;
    var $top = topWindow.jQuery;

    // 保存所有实例化打开的对话框的 ID的集合名称
    var listDialogName = "_ListDialog";

    // 对话框默认配置
    var defaultDialogOptions = {
        width: 800,
        height: 520,
        cache: false,
        maximizable: true,
        resizable: true,
        modal: true
    };

    // 获取对话框包容对象
    var getObject = function(id) {
        var obj = $top("#" + id);
        if (!obj.length)
            obj = $top("<div id=\"" + id + "\"></div>").appendTo(topWindow.document.body);

        return obj;
    };

    // 获取对话框配置属性
    var mergerOpts = function(id, options) {
        options = options || {};

        // 指定对话框 iframe 路径(IE9 下直接指定 iframe src 属性会出现Array/$/jQuery未定义问题)
        var iframe = '<iframe id="' + id + '_content_iframe" src="" width="100%" height="100%" scrolling="auto" frameborder="0" border="0"' + ' marginwidth="0" marginheight="0" style="width:100%;height:100%;"></iframe>';

        return $.extend({}, defaultDialogOptions, options, {
            content: iframe
        });
    };

    // iframe 加载页面数据
    var iframeRefresh = function(id, url, SharedData, callbacks) {
        // 指定对话框 iframe 路径(IE9 下直接指定 iframe src 属性会出现Array/$/jQuery未定义问题)
        var iframe = $top("#" + id + "_content_iframe");
        if (iframe && iframe.length) {
            iframeOnload(iframe[0], SharedData, callbacks);
            iframe[0].contentWindow.location = url;

            return iframe[0];
        }

        return null;
    };

    // iframe 文档加载完成操作，用于绑定回调事件
    var iframeOnload = function(iframe, SharedData, callbacks) {
        if (!iframe)
            return;

        if (iframe.attachEvent) {
            iframe.attachEvent("onload", onload);
        }
        else {
            iframe.onload = onload;
        }

        function onload() {
            var win = iframe.contentWindow;

            // 设置共享数据
            if (SharedData && SharedData.length) {
                var sharedDataNamespace = $.CreateNamespace(win, "XspWeb.Controls.Dialog.SharedData");
                $.each(SharedData, function(i, v) {
                    sharedDataNamespace[v.key] = v.value;
                });
            }

            // 设置回调
            if (callbacks && callbacks.length) {
                var callbackNamespace = $.CreateNamespace(win, "XspWeb.Controls.Dialog.Callbacks");
                $.each(callbacks, function(i, v) {
                    if (!v.name && (typeof v.callback != "function"))
                        return;

                    callbackNamespace[v.name] = v.callback;
                });
            }
        }
    };

    // 设置默认回调
    var setDefaultCallback = function(obj, id, callbacks) {
        if (callbacks) {
            var callbackName;
            for (var i = (callbacks.length - 1); i >= 0; i--) {
                callbackName = callbacks[i].name;
                if ((callbackName == "Close") || (callbackName == "Destory")) {
                    callbacks.removeAt(i);
                }
            }
        }

        callbacks.push({
            name: "Close",
            callback: function() {
                obj.dialog("close");
            }
        }, {
            name: "Destroy",
            callback: function() {
                obj.dialog("destroy");

                var dialogs = XspWeb.Controls.SharedData.Get(listDialogName);
                if (dialogs && dialogs.length) {
                    if (dialogs.indexOf(id) != -1)
                        dialogs.remove(id);
                }
            }
        });
    };

    // 设置 iframe 页面父级div的overflow属性，去除多余滚动条
    var setPanelOverflow = function(id) {
        var panel = $top("#" + id + "_content_iframe").parent();
        panel.attr("style", panel.attr("style") + ";overflow:hidden;");
    };

    $.DeclareClass("XspWeb.Controls.Dialog", {

        // 对话框ID，用于唯一标识对话框
        mId: null,

        // 包容对象
        mObject: null,

        // 对话框中IFRAME路径
        mUrl: null,

        // 传递给对话框的数据
        mSharedData: [],

        // 对话框的回调函数集合
        mCallbacks: [],

        /**
         * 构造函数
         * 
         * @param {String}
         *        id 对话框ID
         */
        Constructor: function(id) {
            if (typeof id === "undefind")
                id = "_SharedDialog";
            else if (typeof id != "string")
                return;

            this.mId = id;
            this.mObject = getObject(id);
        },

        /**
         * 静态成员
         */
        Static: {
            /**
             * 设置工具栏按钮
             * 
             * @param {Array}
             *        items 工具栏按钮配置集合，集合中对象配置参数为 easyui linkbutton 的配置参数。 同时 handler 参数进行了扩展，支持 function/string/object： function 为按钮点击事件； string 为点击后弹出的 tooltip 中元素所在的元素ID； object 为点击后弹出的 tooltip 中元素所在元素的 jQuery 对象；
             * @param {String}
             *        wrapId 工具栏所在元素ID，默认 ID 为 wrapToolbars，该 div 需设置样式为 datagrid-toolbar
             */
            SetToolbars: function(items, wrapId) {
                wrapId = wrapId || "wrapToolbars";

                var objWrap = $("#" + wrapId);
                if (!objWrap.length)
                    return;

                objWrap.html("<table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table>");
                var tr = objWrap.find("tr");
                var i, length, btn, td, b;
                for (i = 0, length = items.length; i < length; i++) {
                    btn = items[i];
                    if (btn == "-") {
                        $("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
                    }
                    else {
                        td = $("<td></td>").appendTo(tr);
                        b = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
                        switch (typeof btn.handler) {
                            case 'function':
                                b[0].onclick = eval(btn.handler || function() {});
                                break;
                            case 'string':
                            case 'object':
                                ShowToolTip(b, btn.handler, btn.handler);
                                delete btn.handler;
                                break;
                            default:
                                b[0].onclick = function() {};
                                break;
                        }
                        b.linkbutton($.extend({}, btn, {
                            plain: true
                        }));
                    }
                }

                /**
                 * 显示tooltip
                 * 
                 * @param {JQuery}
                 *        $el
                 * @param {JQuery/JQuery
                 *        selector} content 内容所在元素的 JQuery 对象或 JQuery 选择器。 为 null 或找不到该元素时，则通过 href 参数获取内容。
                 * @param {String}
                 *        href 提示内容 URL, content 为 null 或找不到元素时有效
                 */
                function ShowToolTip($el, content, href) {
                    var c = content, onUpdate = null;
                    if (!($el && $el.length && (typeof $el.tooltip === 'function')))
                        return;

                    if (typeof c === 'string') {
                        c = $(content);
                        if (!(c && c.length))
                            return;
                    }

                    if (c && c.length) {
                        href = null;
                        c.show();
                    }
                    else
                        c = null;
                    if (!(c || href))
                        return;

                    if (href) {
                        c = $('<div></div>');
                        onUpdate = function(content) {
                            content.panel({
                                fit: true,
                                border: false,
                                href: href
                            });
                        };
                    }

                    $el.tooltip({
                        content: c,
                        showEvent: 'click',
                        onUpdate: function(content) {
                            if (onUpdate)
                                onUpdate(content);
                        },
                        onShow: function() {
                            var t = $(this);
                            var tip = t.tooltip('tip');

                            if (tip.offset().left < 0) {
                                tip.offset({
                                    left: 0
                                }).find('div.tooltip-arrow-outer').offset({
                                    left: t.offset().left
                                }).end().find('div.tooltip-arrow').offset({
                                    left: t.offset().left
                                }).end();
                            }

                            tip.unbind().bind('mouseenter', function() {
                                t.tooltip('show');
                            }).bind('mouseleave', function() {
                                t.tooltip('hide');
                            }).show();
                        }
                    });
                }
            }
        },

        /**
         * 设置对话框中iframe的路径
         * 
         * @return this
         */
        SetUrl: function(url) {
            this.mUrl = url;

            return this;
        },

        /**
         * 添加传递给 iframe 的数据，参数有两种情况： 一、
         * 
         * @param {String}
         *        key 传递的数据名
         * @param {Any}
         *        value 将要传递的任意数据 二、
         * @param {Array}
         *        要传递的数据的集合，组成数组的对象包含 key 和 value 两个属性
         * @return this
         */
        SetSharedData: function() {
            if (!arguments.length)
                return this;

            this.mSharedData = [];
            var SharedData = this.mSharedData;

            var type = typeof arguments[0];
            if (type === "string") {
                if ((arguments.length != 2) || (arguments[1] == undefined))
                    return this;

                if (SharedData.indexOf(arguments[0]) != -1)
                    SharedData.Remove(arguments[0]);

                SharedData.push({
                    key: arguments[0],
                    value: arguments[1]
                });
            }
            else if ((type === "object") && arguments[0].length) {
                $.each(arguments[0], function(i, v) {
                    if (!(v.key && v.value))
                        return;

                    if (SharedData.indexOf(v.key) != -1)
                        SharedData.Remove(v.key);

                    SharedData.push(v);
                });
            }

            this.mSharedData = SharedData;

            return this;
        },

        /**
         * 设置对话框回调函数
         * 
         * @param {Function/Object/Array}
         *        callbacks 对话框回调函数，该参数有三中情况： 一、Function 类型：指定一个名称为 OK 的回调函数； 二、Object 类型：指定某个按钮的回调函数，此时参数对象包含按钮 ID(name)和回调函数(callback)两个属性； 三、Array 类型：指定多个按钮的回调函数，此时参数为情况二的对象组成的数组；
         * @return this
         */
        SetCallback: function(callbacks) {
            if (!callbacks)
                return this;

            this.mCallbacks = [];
            var tempCallbacks = this.mCallbacks;

            var type = typeof callbacks;
            if (type === "function") {
                if (tempCallbacks.indexOf("OK") != -1)
                    tempCallbacks.remove("OK");

                tempCallbacks.push({
                    name: "OK",
                    callback: callbacks
                });
            }
            else if ((type === "object") && callbacks.length) {
                $.each(callbacks, function(i, v) {
                    if (!(v.name && v.callback))
                        return;

                    if (tempCallbacks.indexOf(v.name) != -1)
                        tempCallbacks.remove(v.name);

                    tempCallbacks.push(v);
                });
            }
            else if ((type === "object") && callbacks.name && callbacks.callback) {
                if (tempCallbacks.indexOf(callbacks.name) != -1)
                    tempCallbacks.remove(callbacks.name);

                tempCallbacks.push(callbacks);
            }

            this.mCallbacks = tempCallbacks;

            return this;
        },

        /**
         * 判断对话框是否存在
         * 
         * @return Boolean 是否存在
         */
        IsExists: function() {
            if (!this.mId)
                return false;

            var dialogs = XspWeb.Controls.SharedData.Get(listDialogName);
            if (!(dialogs && dialogs.length))
                return false;

            if (dialogs.indexOf(this.mId) != -1)
                return true;

            return false;
        },

        /**
         * 显示对话框，两种参数情况： 一、指定 options 和 refresh：
         * 
         * @param {Object}
         *        options 对话框配置属性
         * @param {Boolean}
         *        refresh 已经初始化过的对话框是否重新刷新加载数据，默认为 false 二、指定 refresh
         * @param {Booean}
         *        refresh 已经初始化过的对话框是否重新刷新加载数据，默认为 false
         * 
         * @return void
         */
        Show: function() {
            if (!this.mUrl)
                return;

            // 参数解析
            var options = undefined, refresh = false;
            if (arguments && arguments.length) {
                if (typeof arguments[0] === 'boolean')
                    refresh = arguments[0];
                else if (typeof arguments[0] === 'object') {
                    options = arguments[0];

                    if ((arguments.length > 1) && (typeof arguments[1] === 'boolean')) {
                        refresh = arguments[1];
                    }
                }
            }

            // 是否打开已经打开过的对话框
            if (!refresh && this.IsExists()) {
                this.mObject.dialog("open");
                return;
            }

            // 初始化对话框
            options = mergerOpts(this.mId, options);
            this.mObject.dialog(options);

            // 设置默认回调函数
            setDefaultCallback(this.mObject, this.mId, this.mCallbacks);

            // 设置对话框内容 iframe
            iframeRefresh(this.mId, this.mUrl, this.mSharedData, this.mCallbacks);

            // 去除父级元素滚动条
            setPanelOverflow(this.mId);

            // 标记对话框存在
            var dialogs = XspWeb.Controls.SharedData.Get(listDialogName);
            if (!(dialogs && dialogs.length))
                dialogs = [];
            if (dialogs.indexOf(listDialogName) == -1)
                dialogs.push(this.mId);
            XspWeb.Controls.SharedData.Add(listDialogName, dialogs);
        },

        /**
         * 隐藏对话框
         * 
         * @return void
         */
        Hide: function() {
            if (!this.mObject)
                return;

            this.mObject.dialog("close");
        },

        /**
         * 销毁对话框
         * 
         * @return void
         */
        Destroy: function() {
            if (!this.mObject)
                return;

            this.mObject.dialog("destroy");
        }
    });
})(window, jQuery, $.Namespace());