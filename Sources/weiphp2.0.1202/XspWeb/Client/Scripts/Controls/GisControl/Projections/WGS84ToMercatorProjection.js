/**
 * Created by Alex on 2015/3/13.
 */
(function (window, $, namespace) {
    /**
     * 定义经纬度到墨卡托坐标投影类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Projections.WGS84ToMercatorProjection", {
        Static: {
            mMaxLat: 85.05112877980659,
            mMinLat: 85.05112877980659,
            mMaxLng: 180,
            mMinLng: -180,
            mRadius: 6378137,
            mMaxX: 20037508.3427892,
            mMinX: -20037508.3427892,
            mMaxY: 20037508.3427892,
            mMinY: -20037508.3427892,

            /**
             * 墨卡托坐标映射到经纬度坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Point dst 墨卡托坐标
             * @returns XspWeb.Controls.GISControl.Common.LongLatPoint 经纬度坐标
             */
            From: function (dst) {
                var x = (dst.mX * 180.0) / (6378137.0 * Math.PI);
                var y = ((360 * Math.atan(Math.pow(Math.E, dst.mY / 6378137))) / Math.PI) - 90;

                return new XspWeb.Controls.GISControl.Common.LongLatPoint(x, y);
            },

            /**
             * 经纬度坐标映射到墨卡托坐标
             *
             * @param XspWeb.Controls.GISControl.Common.LongLatPoint src 经纬度坐标
             * @returns XspWeb.Controls.GISControl.Common.Point 墨卡托坐标
             */
            To: function (src) {
                var x = (src.mLongitude * Math.PI * 6378137.0) / 180.0;
                var y = (Math.log(Math.tan((0.25 + src.mLatitude / 360) * Math.PI))) * 6378137.0;

                return new XspWeb.Controls.GISControl.Common.Point(x, y);
            }
        }
    });
})(window, jQuery, $.Namespace());