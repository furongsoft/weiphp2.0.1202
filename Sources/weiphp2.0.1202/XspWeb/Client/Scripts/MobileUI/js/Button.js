/**
 * Created by Alex on 2015/4/20.
 */
(function (window, $, namespace) {
    /**
     * Usage:
     *
     * HTML:
     * <button id="[ID]" type="button" class="mui-btn">
     * </button>
     */

    /**
     * 定义按钮控件
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.Button", XspWeb.Controls.MobileUI.Control, {
        Static: {
            /**
             * 创建按钮控件
             *
             * @param Object parent 父控件
             * @param String id 控件索引
             * @param String content 控件内容
             * @returns XspWeb.Controls.MobileUI.Button 按钮控件对象
             */
            Create: function (parent, id, content) {
                var control = document.createElement("button");
                control.id = id;
                control.type = "button";
                control.className  = "mui-btn";
                control.innerHTML = content;
                if (parent)
                    parent.appendChild(control);

                return new XspWeb.Controls.MobileUI.Button(control);
            }
        },

        /**
         * 设置单击事件处理函数
         *
         * @param function method 单击事件处理函数
         */
        SetOnClickHandler: function (method) {
            this.mControl.onclick = method;
        }
    });
})(window, jQuery, jQuery.Namespace());