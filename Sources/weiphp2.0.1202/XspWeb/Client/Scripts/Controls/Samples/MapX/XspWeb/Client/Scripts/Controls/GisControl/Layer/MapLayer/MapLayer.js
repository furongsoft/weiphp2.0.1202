/**
 * Created by Alex on 2015/3/12.
 */
(function (window, $, namespace) {

    /**
     * 定义普通图层类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.MapLayer", XspWeb.Controls.GISControl.Layer.Layer, {

        /**
         * 构造函数
         */
        Constructor: function (renderable) {
            this.Super(renderable);

            /**
             * 比例尺
             */
            this.mScale = 0.0;

            /**
             * 坐标系类型
             */
            this.mProjectionType = XspWeb.Controls.GISControl.Projections.ProjectionType.WGS84;
        },

        /**
         * 获取比例尺
         *
         * @returns Double 比例尺
         */
        GetScale: function () {
            return this.mScale;
        },

        /**
         * 设置比例尺
         *
         * @param Double scale 比例尺
         */
        SetScale: function (scale) {
            this.mScale = scale;
            this.Update();
        },

        /**
         * 获取中心经纬度
         *
         * @returns XspWeb.Controls.GISControl.Common.LongLatPoint 中心经纬度
         */
        GetViewCenter: function () {
            var center = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetCenterByArea(this.mViewArea);
            return XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(
                center, this.mScale);
        },

        /**
         * 设置中心经纬度
         *
         * @param XspWeb.Controls.GISControl.Common.LongLatPoint point 中心经纬度
         */
        SetViewCenter: function (point) {
            this.mViewArea = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetAreaByCenter(
                XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToPoint(point, this.mScale),
                this.mSize.mWidth,
                this.mSize.mHeight,
                this.mZoom);
            this.Invalidate();
        },

        /**
         * 图层级别缩放处理函数
         *
         * @param Int32 level 图层级别
         * @param Doulbe zoom 缩放级别
         */
        OnZoomToLevelHandler: function (level, zoom) {
        },

        /**
         * 比例尺缩放处理函数
         *
         * @param Double scale 比例尺
         * @param Doulbe zoom 缩放级别
         */
        OnZoomToScaleHandler: function (scale, zoom) {
        }
    });
})(window, jQuery, $.Namespace());