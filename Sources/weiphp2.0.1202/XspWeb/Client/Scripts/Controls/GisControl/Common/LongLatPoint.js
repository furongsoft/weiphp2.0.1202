/**
 * Created by Alex on 2015/3/13.
 */
(function (window, $, namespace) {
    /**
     * 定义经纬度点类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Common.LongLatPoint", XspWeb.Controls.GISControl.Common.Point, {

        /**
         * 构造函数
         *
         * @param Double longitude 经度
         * @param Double latitude 纬度
         */
        Constructor: function (longitude, latitude) {
            this.Super();

            if (arguments.length == 2) {
                this.mLongitude = longitude;
                this.mLatitude = latitude;
            }
            else {
                this.mLongitude = 0.0;
                this.mLatitude = 0.0;
            }
        }
    });
})(window, jQuery, $.Namespace());