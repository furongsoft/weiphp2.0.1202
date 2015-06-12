/**
 * Created by Alex on 2015/3/13.
 */
(function (window, $, namespace) {
    /**
     * 定义经纬度矩形区域类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Common.LongLatRectangle", {

        /**
         * 构造函数
         *
         * @param Double leftTopLongitude 左上角经度
         * @param Double leftTopLatitude 左上角纬度
         * @param Double rightBottomLongitude 右下角经度
         * @param Double rightBottomLatitude 右下角纬度
         */
        Constructor: function (leftTopLongitude, leftTopLatitude, rightBottomLongitude, rightBottomLatitude) {
            this.Super();

            if (arguments.length == 4) {
                this.mLeftTopLongitude = leftTopLongitude;
                this.mLeftTopLatitude = leftTopLatitude;
                this.mRightBottomLongitude = rightBottomLongitude;
                this.mRightBottomLatitude = rightBottomLatitude;
            }
            else {
                this.mLeftTopLongitude = 0.0;
                this.mLeftTopLatitude = 0.0;
                this.mRightBottomLongitude = 0.0;
                this.mRightBottomLatitude = 0.0;
            }
        },

        GetLeftBottomPoint: function () {
            return new XspWeb.Controls.GISControl.Common.Point(
                this.mLeftTopLongitude, this.mRightBottomLatitude
            );
        },

        GetRightTopPoint: function () {
            return new XspWeb.Controls.GISControl.Common.Point(
                this.mRightBottomLongitude, this.mLeftTopLatitude
            );
        }
    });
})(window, jQuery, $.Namespace());