(function (window, $, namespace) {
    /**
     * 定义屏幕坐标到像素坐标投影类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Projections.ScreenToLayerProjection", {
        Static: {
            /**
             * 像素坐标映射到屏幕坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Point src 像素坐标
             * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层对象
             * @returns XspWeb.Controls.GISControl.Common.Point 屏幕坐标
             */
            From: function (src, layer) {
                return new XspWeb.Controls.GISControl.Common.Point(
                    (src.mX - layer.mViewArea.mX) / layer.mZoom,
                    (src.mY - layer.mViewArea.mY)/ layer.mZoom);
            },

            /**
             * 屏幕坐标映射到像素坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Point dst 屏幕坐标
             * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层对象
             * @returns XspWeb.Controls.GISControl.Common.Point 像素坐标
             */
            To: function (dst, layer) {
                return new XspWeb.Controls.GISControl.Common.Point(
                    layer.mViewArea.mX + (dst.mX * layer.mZoom),
                    layer.mViewArea.mY + (dst.mY * layer.mZoom));
            },

            /**
             * 像素矩形映射到屏幕矩形
             *
             * @param XspWeb.Controls.GISControl.Common.Rectangle src 像素矩形
             * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层对象
             * @returns XspWeb.Controls.GISControl.Common.Rectangle 屏幕矩形
             */
            FromRect: function (src, layer) {
                return new XspWeb.Controls.GISControl.Common.Rectangle(
                    (src.mX - layer.mViewArea.mX) / layer.mZoom,
                    (src.mY - layer.mViewArea.mY) / layer.mZoom,
                    src.mWidth / layer.mZoom,
                    src.mHeight / layer.mZoom);
            },

            /**
             * 屏幕矩形映射到像素矩形
             *
             * @param XspWeb.Controls.GISControl.Common.Point Rectangle 屏幕矩形
             * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层对象
             * @returns XspWeb.Controls.GISControl.Common.Rectangle 像素矩形
             */
            ToRect: function (dst, layer) {
                return new XspWeb.Controls.GISControl.Common.Rectangle(
                    layer.mViewArea.mX + (dst.mX * layer.mZoom),
                    layer.mViewArea.mY + (dst.mY * layer.mZoom),
                    dst.mWidth * layer.mZoom,
                    dst.mHeight * layer.mZoom);
            }
        }
    });
})(window, jQuery, $.Namespace());