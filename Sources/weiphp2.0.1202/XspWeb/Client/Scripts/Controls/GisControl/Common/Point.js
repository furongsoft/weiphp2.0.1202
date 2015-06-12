/**
 * Created by Alex on 2015/3/13.
 */
(function (window, $, namespace) {
    /**
     * 定义点类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Common.Point", {

        /**
         * 构造函数
         *
         * @param Double x 横坐标
         * @param Double y 纵坐标
         */
        Constructor: function (x, y) {
            this.Super();

            if (arguments.length == 2) {
                this.mX = x;
                this.mY = y;
            }
            else {
                this.mX = 0.0;
                this.mY = 0.0;
            }
        },

        /**
         * 判断点是否在矩形区域内
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形区域
         * @returns Boolean 点是否在矩形区域内
         */
        HasIntersection: function (rect) {
            return rect.HasIntersection(this);
        }
    });
})(window, jQuery, $.Namespace());