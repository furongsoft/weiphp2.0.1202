/**
 * Created by Alex on 2015/4/20.
 */
(function (window, $, namespace) {
    /**
     * Usage:
     *
     * HTML:
     * <div id="[ID]" class="mui-input-row mui-search">
     *     <input type="search" class="mui-input-clear" placeholder="">
     * </div>
     */

    /**
     * 定义搜索控件
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.Search", XspWeb.Controls.MobileUI.Control, {
        Static: {
            /**
             * 创建搜索控件
             *
             * @param Object parent 父控件
             * @param String id 控件索引
             * @param String content 控件内容
             * @returns XspWeb.Controls.MobileUI.Search 搜索控件对象
             */
            Create: function (parent, id, content) {
                var div = document.createElement("div");
                div.id = id;
                div.className = "mui-input-row mui-search";

                var search = document.createElement("input");
                search.type = "search";
                search.className = "mui-input-clear";
                search.placeholder = content;
                div.appendChild(search);

                if (parent)
                    parent.appendChild(div);

                // 处理INPUT控件
                $.fn.input.call($.wrap([div]));
                $.fn.input.call($.wrap([search]));

                return new XspWeb.Controls.MobileUI.Search(div);
            }
        },

        /**
         * 构造函数
         *
         * @param VAR control 控件索引或DOM节点对象
         */
        Constructor: function (control) {
            this.Super(control);

            /**
             * 搜索内部控件
             */
            this.mSearch = this.mControl.querySelector("input");
        },

        /**
         * 设置内容改变事件处理函数
         *
         * @param function method 内容改变事件处理函数
         */
        SetOnChangedHandler: function (method) {
            this.mSearch.onchange = method;
            this.mSearch.oninput = method;

            // 注册内容清除事件处理函数
            this.mSearch.OnClear = method;
        },

        /**
         * 获取控件内容
         *
         * @returns String 控件内容
         */
        GetValue: function () {
            return this.mSearch.value;
        },

        /**
         * 设置控件内容
         *
         * @param String content 控件内容
         */
        SetValue: function (content) {
            this.mSearch.value = content;
        }
    });
})(window, jQuery, jQuery.Namespace());