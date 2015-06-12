/**
 * Created by Alex on 2015/3/12.
 */
(function (window, $, namespace) {
    /**
     * 定义可渲染对象接口
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Common.Renderable", {

        /**
         * 构造函数
         */
        Constructor: function (container) {
            this.Super();

            /**
             * 容器控件
             */
            this.mContainer = container;
        },

        /**
         * 设置无效区域
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 无效矩形区域
         */
        InvalidateRect: function (rect) {}
    });
})(window, jQuery, $.Namespace());