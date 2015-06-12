(function(window, $, namespace) {

    $.DeclareClass("XspWeb.Controls.Tabs", {

        // 包容对象
        mObject: null,

        // Tab右键菜单对象
        mContextMenuObject: null,

        // 主页标题，该Tab页不可关闭
        mHomeTitle: "主页",

        /**
         * 构造函数
         * 
         * @param {String}
         *        objSelect Tabs元素选择器
         * @param {String}
         *        contextMenuSelector Tab右键菜单元素选择器
         */
        Constructor: function(objSelect, contextMenuSelector) {
            if (!objSelect) {
                $.Assert("Invalid argument!");
                return;
            }

            this.mObject = $(objSelect);
            if (!(this.mObject && this.mObject.length)) {
                $.Assert("Object not found!");
                return;
            }

            if (contextMenuSelector) {
                this.mContextMenuObject = $(contextMenuSelector);
            }
        },

        /**
         * 初始化Tabs
         * 
         * @param {Object}
         *        options Tabs配置属性
         * 
         * @return this
         */
        Initialize: function(options) {
            if (!this.mObject)
                return this;

            // Tabs默认配置参数
            var defaultOptions = {
                fit: true,
                border: false
            };

            options = options || {};
            var opts = $.extend({}, defaultOptions, options);
            this.mObject.tabs(opts);

            return this;
        },

        /**
         * 设置主页标题
         * 
         * @param {String}
         *        title 主页标题
         */
        SetHomeTitle: function(title) {
            this.mHomeTitle = title;
        },

        /**
         * 判断Tab页是否存在
         * 
         * @param {String/Number}
         *        which Tab页标题或Index
         * 
         * @return {Boolean} 是否存在
         */
        IsExists: function(which) {
            if (!this.mObject)
                return false;

            return this.mObject.tabs("exists", which);
        },

        /**
         * 获取指定Tab页
         * 
         * @param {String/Number}
         *        which Tab页标题或Index
         * 
         * return {Object} Tab对象
         */
        GetTab: function(which) {
            if (!this.mObject)
                return null;

            return this.mObject.tabs("getTab", which);
        },

        /**
         * 获取当前选中的Tab页
         * 
         * @param {Object}
         *        Tab对象
         */
        GetSelectedTab: function() {
            if (!this.mObject)
                return null;

            return this.mObject.tabs("getSelected");
        },

        /**
         * 选择Tab页
         * 
         * @param {String/Number}
         *        which Tab页标题或Index
         * 
         * @return this
         */
        SelectTab: function(which) {
            if (!this.mObject)
                return this;

            this.mObject.tabs("select", which);

            return this;
        },

        /**
         * 添加Tab页
         * 
         * @param {String}
         *        title Tab页标题
         * @param {String}
         *        url Tab页内容路径
         * @param {Object/JSON}
         *        Tab页配置
         * 
         * return this
         */
        AddTab: function(title, url, opts) {
            if (!this.mObject)
                return this;

            if (this.IsExists(title)) {
                this.SelectTab(title);
                this.RefreshTab();
            }
            else {
                opts = opts || {};
                opts = $.extend({}, {
                    closable: true
                }, opts);

                opts = $.extend({}, opts, {
                    title: title,
                    content: this.Private.CreateTabFrame(url)
                });

                this.mObject.tabs("add", opts);

                var currentTab = this.GetSelectedTab();
                currentTab.attr("style", currentTab.attr("style") + ";overflow:hidden;");
            }

            this.Private.BindTabHandler(this.mObject, this.mContextMenuObject);

            return this;
        },

        /**
         * 更新指定Tab页参数
         * 
         * @param {Object}
         *        tab 需要更新的Tab页的panel对象
         * @param {Object}
         *        options 更新的panel的属性
         * 
         * @return this
         */
        UpdateTab: function(tab, options) {
            if (!this.mObject)
                return this;

            this.mObject.tabs("update", {
                tab: tab,
                options: options
            });

            return this;
        },

        /**
         * 刷新Tab页
         * 
         * @param {String/Number}
         *        which 需要刷新的tab页的标题或Index，为空则取当前选中的Tab页
         * 
         * @return this
         */
        RefreshTab: function(which) {
            if (!this.mObject)
                return this;

            var currentTab = null;
            if (which) {
                currentTab = this.GetTab(which);
            }

            if (!currentTab) {
                currentTab = this.GetSelectedTab();
            }

            if (!currentTab)
                return this;

            var options = currentTab.panel("options");
            var url = $(options.content).attr("src");
            if (url && options != this.mHomeTitle) {
                this.UpdateTab(currentTab, {
                    content: this.Private.CreateTabFrame(url)
                });
            }

            return this;
        },

        /**
         * 关闭指定Tab页
         * 
         * @param {String/Number}
         *        which Tab页标题或Index
         */
        Close: function(which) {
            if (!this.mObject)
                return;

            this.mObject.tabs("close", which);
        },

        /**
         * 关闭所有的Tab页
         */
        CloseAll: function() {
            var obj = this.mObject;
            if (!obj)
                return;

            var homeTitle = this.mHomeTitle;

            $(".tabs-inner span.tabs-title", obj).each(function(i, v) {
                var title = $(v).text();
                if (title != homeTitle) {
                    obj.tabs("close", title);
                }
            });
        },

        /**
         * 除当前Tab之外全部关闭
         */
        CloseOthers: function() {
            var obj = this.mObject;
            if (!obj)
                return;

            var homeTitle = this.mHomeTitle;
            var selectedTab = $(".tabs-selected", obj);
            var prevAll = selectedTab.prevAll();
            var nextAll = selectedTab.nextAll();

            if (prevAll.length) {
                prevAll.each(function(i, v) {
                    var title = $("a:eq(0) span", $(v)).text();
                    if (title != homeTitle) {
                        obj.tabs("close", title);
                    }
                });
            }

            if (nextAll.length) {
                nextAll.each(function(i, v) {
                    var title = $("a:eq(0) span", $(v)).text();
                    if (title != homeTitle) {
                        obj.tabs("close", title);
                    }
                });
            }
        },

        /**
         * 关闭右键菜单指向的Tab页
         */
        CloseCurrentByContextMenu: function() {
            if (!this.mContextMenuObject)
                return;

            var currtab_title = this.mContextMenuObject.data("currentTab");
            this.Close(currtab_title);
        },

        /**
         * 隐藏Tab右键菜单
         */
        HideContextMenu: function() {
            if (this.mContextMenuObject) {
                this.mContextMenuObject.menu('hide');
            }
        },

        Private: {

            /**
             * 创建Tab页IFRAME内容
             * 
             * @param {String}
             *        url IFRAME路径
             */
            CreateTabFrame: function(url) {

                if (!url || url == "#")
                    return "该功能维护中，请稍后再试";

                if (url.indexOf(_RootPath) != 0)
                    url = _RootPath + "/" + url;

                return "<iframe src=\"" + url + "\" width=\"100%\" height=\"100%\" scrolling=\"auto\" frameborder=\"0\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" style=\"width:100%;height:100%;\"></iframe>";
            },

            /**
             * 绑定Tab页事件
             * 
             * @param {jQuery}
             *        tabs Tabs对象
             * @param {jQuery}
             *        contextMenu Tab右键菜单对象
             */
            BindTabHandler: function(tabs, contextMenu) {

                // 双击关闭TAB选项卡
                $(".tabs-inner").dblclick(function() {
                    var subtitle = $(this).children(".tabs-closable").text();
                    if (subtitle)
                        tabs.tabs("close", subtitle);
                });

                // 为选项卡绑定右键
                if (contextMenu && contextMenu.length) {
                    $(".tabs-inner").bind("contextmenu", function(e) {
                        var subtitle = $(this).children(".tabs-closable").text();
                        if (subtitle) {
                            contextMenu.menu("show", {
                                left: e.pageX,
                                top: e.pageY
                            });

                            contextMenu.data("currentTab", subtitle);
                            tabs.tabs("select", subtitle);
                        }

                        return false;
                    });
                }
            }
        }
    });
})(window, jQuery, $.Namespace());