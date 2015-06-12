/**
 * Created by Alex on 2015/3/15.
 */
(function (window, $, namespace) {
    /**
     * 定义大小尺寸类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Common.Size", {

        /**
         * 构造函数
         *
         * @param Double width 宽度
         * @param Double height 高度
         */
        Constructor: function (width, height) {
            this.Super();

            if (arguments.length == 2) {
                this.mWidth = width;
                this.mHeight = height;
            }
            else {
                this.mWidth = 0.0;
                this.mHeight = 0.0;
            }
        }
    });
})(window, jQuery, $.Namespace());