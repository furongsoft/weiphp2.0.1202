/**
 * Created by Alex on 2015/3/13.
 */
(function (window, $, namespace) {
    /**
     * 定义墨卡托坐标到像素坐标投影类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Projections.MercatorToScreenProjection", {
        Static: {
            DPI: 96,

            /**
             * 像素坐标映射到墨卡托坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Point dst 像素坐标
             * @param Double scale 比例尺
             * @returns XspWeb.Controls.GISControl.Common.Point 墨卡托坐标
             */
            From: function (dst, scale) {
                var x = (dst.mX * 0.0254) / (scale * this.DPI);
                var y = (-dst.mY * 0.0254) / (scale * this.DPI);

                return new XspWeb.Controls.GISControl.Common.Point(x, y);
            },

            /**
             * 墨卡托坐标映射到像素坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Point src 墨卡托坐标
             * @param Double scale 比例尺
             * @returns XspWeb.Controls.GISControl.Common.Point 像素坐标
             */
            To: function (src, scale) {
                var x = (src.mX * scale * this.DPI) / 0.0254;
                var y = (-src.mY * scale * this.DPI) / 0.0254;

                return new XspWeb.Controls.GISControl.Common.Point(x, y);
            }
        }
    });
})(window, jQuery, $.Namespace());