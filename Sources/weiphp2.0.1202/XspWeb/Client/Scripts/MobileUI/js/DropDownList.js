/**
 * Created by Alex on 2015/4/20.
 */
(function (window, $, namespace) {
    /**
     * Usage:
     *
     * HTML:
     * <div id="[ID]">
     *     <a href="#[ID]_Popup" class="mui-btn mui-btn-primary mui-btn-block mui-btn-outlined">
     *          <input type="text" class="mui-input-dropdownlist">
     *     </a>
     *     <div id="[ID]_Popup" class="mui-popover">
     *         <div class="mui-scroll-wrapper">
     *             <div class="mui-scroll">
     *                 <ul class="mui-table-view">
     *                     <li class="mui-table-view-cell"></li>
     *                     <li class="mui-table-view-cell"></li>
     *                 </ul>
     *             </div>
     *         </div>
     *     </div>
     * </div>
     */

    /**
     * 定义下拉列表控件
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.DropDownList", XspWeb.Controls.MobileUI.Control, {
        Static: {
            /**
             * 创建下拉列表控件
             *
             * @param Object parent 父控件
             * @param String id 控件索引
             * @param String content 控件默认内容
             * @param XspWeb.Core.List list 下拉框选项内容
             * @returns XspWeb.Controls.MobileUI.DropDownList 下拉列表控件对象
             */
            Create: function (parent, id, content, list) {
                var control = document.createElement("div");
                control.id = id;

                var a = document.createElement("a");
                a.href = "#" + id + "_Popup";

                var input = document.createElement("input");
                input.type = "text";
                input.value = content;
                input.className = "mui-input-dropdownlist";
                input.setAttribute("readonly","readonly");

                a.appendChild(input);
                control.appendChild(a);

                // mui-popover 默认宽度280PX 高度150PX
                var popup = document.createElement("div");
                popup.id = id + "_Popup";
                popup.className = "mui-popover";
                popup.style.height = "150px";

                var wrapper = document.createElement("div");
                wrapper.className = "mui-scroll-wrapper";
                popup.appendChild(wrapper);

                var scroll = document.createElement("div");
                scroll.className = "mui-scroll";
                wrapper.appendChild(scroll);

                var ul = document.createElement("ul");
                ul.className = "mui-table-view";
                scroll.appendChild(ul);

                if (list !== null) {
                    for (var i = 0; i < list.Length(); ++i) {
                        var li = document.createElement("li");
                        li.className = "mui-table-view-cell mui-dropdownlist-li";
                        li.innerHTML = list.Get(i);
                        li.onclick = function () {
                            input.value = this.innerHTML;
                            mui('.mui-popover').popover("hide");
                        };
                        ul.appendChild(li);
                    }
                }

                control.appendChild(popup);

                if (parent)
                    parent.appendChild(control);

                // 注册滑动相关事件
                $.fn.scroll.call($.wrap([wrapper]));

                return new XspWeb.Controls.MobileUI.DropDownList(control);
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
            this.mInput = this.mControl.querySelector("input");

            /**
             * 输入内部控件
             */
            this.mPopup = this.mControl.querySelector(".mui-popover");

            /**
             * ul控件
             */
            this.mUlList = this.mControl.querySelector("ul");

            /**
             * a标签
             */
            this.mAhref = this.mControl.querySelector("a");
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
         * 设置输入框是否可选
         *
         * @param boolean visible
         */
        SetVisible:function(visible){
            if (visible)
                this.mAhref.href = "#" + this.mPopup.id;
            else
                this.mAhref.href = "#";
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
        },

        /**
         * 设置宽度
         *
         * @param String width 宽度
         */
        SetWidth: function (width) {
            this.mControl.style.width = width;
        },

        /**
         * 设置弹出框宽度
         *
         * @param String width
         */
        SetPopupWidth: function (width) {
            this.mPopup.style.width = width;
        },

        /**
         * 设置弹出框高度
         *
         * @param String height
         */
        SetPopupHeight: function (height) {
            this.mPopup.style.height = height;
        },

        /**
         * 增加下拉框数据
         */
        AddItems: function (list) {
            var input = this.mInput;
            for (var i = 0; i < list.Length(); ++i) {
                var li = document.createElement("li");
                li.className = "mui-table-view-cell mui-dropdownlist-li";
                li.innerHTML = list.Get(i);
                li.onclick = function () {
                    input.value = this.innerHTML;
                    mui('.mui-popover').popover("hide");
                };
                this.mUlList.appendChild(li);
            }
        },

        /**
         * 清除下拉框值
         */
        Clear: function () {
            var length = this.mUlList.childNodes.length;
            for (var i = 0; i < length; i++) {
                this.mUlList.removeChild(this.mUlList.childNodes[0]);
            }
        }

    });
})(window, jQuery, jQuery.Namespace());