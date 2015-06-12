/**
 * Created by Alex on 2015/4/20.
 */
(function (window, $, namespace) {
    /**
     * Usage:
     *
     * HTML:
     * <div id="[ID]" class="mui-input-row">
     *     <label>Input</label>
     *     <input type="text" class="mui-input-clear" placeholder="">
     * </div>
     */

    /**
     * 定义输入控件
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.Input", XspWeb.Controls.MobileUI.Control, {
        Static: {
            /**
             * 创建搜索控件
             *
             * @param Object parent 父控件
             * @param String id 控件索引
             * @param String title 控件标题
             * @param String content 控件内容
             * @returns XspWeb.Controls.MobileUI.Input 输入控件对象
             */
            Create: function (parent, id, title, content) {
                var div = document.createElement("div");
                div.id = id;
                div.className = "mui-input-row";

                var label = document.createElement("label");
                label.innerHTML = title;
                div.appendChild(label);

                var text = document.createElement("input");
                text.type = "text";
                text.className = "mui-input-clear";
                text.placeholder = content;
                div.appendChild(text);

                if (parent)
                    parent.appendChild(div);

                // 处理INPUT控件
                $.fn.input.call($.wrap([div]));
                $.fn.input.call($.wrap([text]));

                return new XspWeb.Controls.MobileUI.Input(div);
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
             * 输入内部控件
             */
            this.mLabel = this.mControl.querySelector("label");

            /**
             * 输入内部控件
             */
            this.mInput = this.mControl.querySelector("input");
        },

        /**
         * 设置内容改变事件处理函数
         *
         * @param function method 内容改变事件处理函数
         */
        SetOnChangedHandler: function (method) {
            this.mInput.onchange = method;
            this.mInput.oninput = method;

            // 注册内容清除事件处理函数
            this.mInput.OnClear = method;
        },

        /**
         * 获取控件标题
         *
         * @returns String 控件内容
         */
        GetTitle: function () {
            return this.mLabel.innerHTML;
        },

        /**
         * 设置控件标题
         *
         * @param String content 控件内容
         */
        SetTitle: function (content) {
            this.mLabel.innerHTML = content;
        },

        /**
         * 获取控件内容
         *
         * @returns String 控件内容
         */
        GetValue: function () {
            return this.mInput.value;
        },

        /**
         * 设置控件内容
         *
         * @param String content 控件内容
         */
        SetValue: function (content) {
            this.mInput.value = content;
        }
    });
})(window, jQuery, jQuery.Namespace());