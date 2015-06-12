/**
 * Created by Alex on 2015/3/13.
 */
(function (window, $, namespace) {
    /**
     * 定义经纬度点类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Common.TilePoint", XspWeb.Controls.GISControl.Common.Point, {

        /**
         * 构造函数
         *
         * @param Double x 横坐标
         * @param Double y 纵坐标
         */
        Constructor: function (x, y) {
            this.Super(x, y);

            if (arguments.length == 2) {
                this.mX = (x + 0.5) | 0;
                this.mY = (y + 0.5) | 0;
            }
            else {
                this.mX = 0;
                this.mY = 0;
            }
        }
    });
})(window, jQuery, $.Namespace());