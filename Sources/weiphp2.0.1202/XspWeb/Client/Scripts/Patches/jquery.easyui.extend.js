/**
 * 基于 jQuery EasyUI 1.3.3 的扩展
 */

/**
 * 扩展EasyUI的validator插件rules,支持更多类型验证
 */
$.extend($.fn.validatebox.defaults.rules, {
    notnull: {
        validator: function(value) {
            return $.trim(value) != "";
        },
        message: $.fn.validatebox.defaults.missingMessage
    },
    date: {
        validator: function(value) {
            return /^\d{4}(-|\/)\d{2}(-|\/)\d{2}$/i.test(value);
        },
        message: '日期格式不正确'
    },
    datetime: {
        validator: function(value) {
            return /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(value);
        },
        message: '长时间格式不正确'
    },
    datetimenoseconds: {
        validator: function(value) {
            return /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/.test(value);
        },
        message: '时间格式不正确'
    },
    minLength: { // 判断最小长度
        validator: function(value, param) {
            return value.length >= param[0];
        },
        message: '最少输入 {0} 个字符。'
    },
    phone: {// 验证电话号码
        validator: function(value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-88888888'
    },
    mobile: {// 验证手机号码
        validator: function(value) {
            return /^(13|15|18)\d{9}$/i.test(value);
        },
        message: '手机号码格式不正确'
    },
    idcard: {// 验证身份证
        validator: function(value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    intOrFloat: {// 验证整数或小数
        validator: function(value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    currency: {// 验证货币
        validator: function(value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    qq: {// 验证QQ,从10000开始
        validator: function(value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    integer: {// 验证整数
        validator: function(value) {
            return /^[+]?[1-9]+\d*$/i.test(value);
        },
        message: '请输入整数'
    },
    chinese: {// 验证中文
        validator: function(value) {
            return /^[\u0391-\uFFE5]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语
        validator: function(value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符
        validator: function(value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名
        validator: function(value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno: {// 验证传真
        validator: function(value) {
            // return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[
            // ]){1,12})+$/i.test(value);
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '传真号码不正确'
    },
    zip: {// 验证邮政编码
        validator: function(value) {
            return /^[1-9]\d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    ip: {// 验证IP地址
        validator: function(value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文
        validator: function(value) {
            return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    carNo: {
        validator: function(value) {
            return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(value);
        },
        message: '车牌号码无效（例：粤J12350）'
    },
    carenergin: {
        validator: function(value) {
            return /^[a-zA-Z0-9]{16}$/.test(value);
        },
        message: '发动机型号无效(例：FG6H012345654584)'
    },
    msn: {
        validator: function(value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    },
    same: {
        validator: function(value, param) {
            if ($("#" + param[0]).val() != "" && value != "") {
                return $("#" + param[0]).val() == value;
            }
            else {
                return true;
            }
        },
        message: '两次输入的密码不一致！'
    }
});

$.extend($.fn.tabs.methods, {
    /**
     * 显示遮罩层
     */
    loading: function(jq, msg) {
        return jq.each(function() {
            var panel = $(this).tabs("getSelected");
            if (msg == undefined) {
                msg = "正在加载数据中，请稍候...";
            }
            $("<div class=\"datagrid-mask\"></div>").css({
                display: "block",
                width: panel.width(),
                height: panel.height()
            }).appendTo(panel);
            $("<div class=\"datagrid-mask-msg\"></div>").html(msg).appendTo(panel).css({
                display: "block",
                left: (panel.width() - $("div.datagrid-mask-msg", panel).outerWidth()) / 2,
                top: (panel.height() - $("div.datagrid-mask-msg", panel).outerHeight()) / 2
            });
        });
    },

    /**
     * 隐藏遮罩层
     */
    loaded: function(jq) {
        return jq.each(function() {
            var panel = $(this).tabs("getSelected");
            panel.find("div.datagrid-mask-msg").remove();
            panel.find("div.datagrid-mask").remove();
        });
    }
});

/**
 * 扩展EasyUI datagrid的方法
 */
$.extend($.fn.datagrid.methods, {
    /**
     * 动态添加toolbar的项
     */
    addToolbarItem: function(jq, items) {
        /**
         * 显示 tooltip
         * 
         * @param {JQuery}
         *            $el
         * @param {JQuery/JQuery
         *            selector} content 内容所在元素的 JQuery 对象或 JQuery 选择器。 为 null
         *            或找不到该元素时，则通过 href 参数获取内容。
         * @param {String}
         *            href 提示内容 URL, content 为 null 或找不到元素时有效
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
                hideEvent: 'none',
                onUpdate: function(content) {
                    if (onUpdate)
                        onUpdate(content);

                    var t = $(this);
                    var tip = t.tooltip('tip');
                    t.parents('div.easyui-layout').bind('scroll', function() {
                        if (tip.css('display') != 'none') {
                            t.click();
                        }
                    });
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
                }
            });
        }

        return jq.each(function() {
            var dpanel = $(this).datagrid('getPanel');
            var toolbar = dpanel.children("div.datagrid-toolbar");
            if (!toolbar.length) {
                toolbar = $("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(dpanel);
                $(this).datagrid('resize');
            }

            var tr = toolbar.find("tr");
            for (var i = 0; i < items.length; i++) {
                var btn = items[i];
                var td = $("<td></td>");
                if (btn == "-") {
                    td.append("<div class=\"datagrid-btn-separator\"></div>");
                }
                else if (typeof btn === "string") {
                    if ($(btn).length) {
                        td.append($(btn).show());
                    }
                    else {
                        td.append(btn);
                    }
                }
                else {
                    var b = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
                    switch (typeof btn.handler) {
                        case 'function':
                            b[0].onclick = eval(btn.handler || function() {});
                            break;
                        case 'string':
                        case 'object':
                            ShowToolTip(b, btn.handler, btn.handler);
                            break;
                        default:
                            b[0].onclick = function() {};
                            break;
                    }
                    b.linkbutton($.extend({}, btn, {
                        plain: true
                    }));
                }

                td.appendTo(tr);
            }
        });
    },

    /**
     * 动态删除toolbar的项
     */
    removeToolbarItem: function(jq, param) {
        return jq.each(function() {
            var dpanel = $(this).datagrid('getPanel');
            var toolbar = dpanel.children("div.datagrid-toolbar");
            var cbtn = null;
            if (typeof param == "number") {
                cbtn = toolbar.find("td").eq(param).find('span.l-btn-text');
            }
            else if (typeof param == "string") {
                cbtn = toolbar.find("span.l-btn-text:contains('" + param + "')");
            }

            if (cbtn && cbtn.length > 0) {
                cbtn.closest('td').remove();
                cbtn = null;
            }
        });
    },

    /**
     * 动态设置列标题
     * 
     * @param {Object}
     *            options param 包含两个参数： field：列名 text：更新后的列标题
     */
    setColumnTitle: function(jq, option) {
        if (option.field) {
            return jq.each(function() {
                var $panel = $(this).datagrid("getPanel");
                var $field = $('td[field=' + option.field + ']', $panel);
                if ($field.length) {
                    var $span = $("span", $field).eq(0);
                    $span.html(option.text);
                }
            });
        }
        return jq;
    }
});