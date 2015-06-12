/**
 * Created by Alex on 2015/3/14.
 */
(function (window, $, namespace) {

    /**
     * 坐标系类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Projections.ProjectionType", {
        Static: {
            WGS84: 0, // 经纬度坐标系
            Pixel: 1, // 像素坐标系
            Screen: 2 // 屏幕坐标系
        }
    });

    /**
     * 坐标工具类
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Projections.ProjectionUtil", {
        Static: {

            /**
             * 通过坐标系类型获取的坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Point point
             * @param XspWeb.Controls.GISControl.Projections.ProjectionType projectionType 坐标系类型
             * @returns 目标系统坐标
             */
            GetProjectionPoint: function (point, projectionType) {
                if (projectionType == XspWeb.Controls.GISControl.Projections.ProjectionType.WGS84) {
                    return new XspWeb.Controls.GISControl.Common.LongLatPoint(point.mX, point.mY);
                }
                else if (projectionType == XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel) {
                    return new XspWeb.Controls.GISControl.Common.Point(point.mX, point.mY);
                }
                else if (projectionType == XspWeb.Controls.GISControl.Projections.ProjectionType.Tile) {
                    return new XspWeb.Controls.GISControl.Common.TilePoint(point.mX, point.mY);
                }
            }
        }
    });

    /**
     * 定义坐标转换器类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Projections.CoordinateConverter", {
        Static: {

            /**
             * 坐标转换
             *
             * @param XspWeb.Controls.GISControl.Projections.ProjectionType source 源坐标系统
             * @param XspWeb.Controls.GISControl.Projections.ProjectionType destination 目标坐标系统
             * @param XspWeb.Controls.GISControl.Common.Point point 源坐标系统坐标
             * @param Double scale 比例尺
             * @returns 目标系统坐标
             */
            Transform: function (source, destination, point, scale) {
                if (source === destination) {
                    return point;
                }
                // 经纬度转像素坐标
                else if ((source == XspWeb.Controls.GISControl.Projections.ProjectionType.WGS84)
                    && (destination == XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel)) {

                    if (!scale)
                        throw $.AResult.AE_INVALIDARG();

                    point = XspWeb.Controls.GISControl.Projections.ProjectionUtil.GetProjectionPoint(point, source);
                    return this.LongLatPointToPoint(point, scale);
                }
                // 像素坐标转经纬度
                else if ((source == XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel)
                    && (destination == XspWeb.Controls.GISControl.Projections.ProjectionType.WGS84)) {

                    if (!scale)
                        throw $.AResult.AE_INVALIDARG();

                    point = XspWeb.Controls.GISControl.Projections.ProjectionUtil.GetProjectionPoint(point, source);
                    return this.PointToLongLatPoint(point, scale);
                }
            },

            /**
             * 经纬度坐标映射到像素坐标
             *
             * @param XspWeb.Controls.GISControl.Common.LongLatPoint point 经纬度坐标
             * @param Double scale 比例尺
             * @returns XspWeb.Controls.GISControl.Common.Point 像素坐标
             */
            LongLatPointToPoint: function (point, scale) {
                point = XspWeb.Controls.GISControl.Projections.WGS84ToMercatorProjection.To(point);
                return XspWeb.Controls.GISControl.Projections.MercatorToScreenProjection.To(point, scale);
            },

            /**
             * 像素坐标映射到经纬度坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Point point 像素坐标
             * @param Double scale 比例尺
             * @returns XspWeb.Controls.GISControl.Common.LongLatPoint 经纬度坐标
             */
            PointToLongLatPoint: function (point, scale) {
                point = XspWeb.Controls.GISControl.Projections.MercatorToScreenProjection.From(point, scale);
                return XspWeb.Controls.GISControl.Projections.WGS84ToMercatorProjection.From(point);
            },

            /**
             * 根据像素坐标中心点坐标和宽度高度获取显示区域
             *
             * @param XspWeb.Controls.GISControl.Common.Point point 像素坐标中心点
             * @param Double width 宽度
             * @param Double height 高度
             * @param Double zoom 缩放比率
             * @returns XspWeb.Controls.GISControl.Common.Rectangle 显示区域
             */
            GetAreaByCenter: function (point, width, height, zoom) {
                width *= zoom;
                height *= zoom;

                return new XspWeb.Controls.GISControl.Common.Rectangle(
                    point.mX - (width / 2), point.mY - (height / 2), width, height);
            },

            /**
             * 根据显示区域获取像素坐标中心点坐标
             *
             * @param XspWeb.Controls.GISControl.Common.Rectangle 显示区域
             * @returns XspWeb.Controls.GISControl.Common.Point point 像素坐标中心点
             */
            GetCenterByArea: function (rect) {
                return new XspWeb.Controls.GISControl.Common.Point(
                    rect.mX + (rect.mWidth / 2), rect.mY + (rect.mHeight / 2));
            },

            /**
             * 根据缩放级别获取比例尺
             *
             * @param Int32 level 缩放级别
             * @returns Double 比例尺
             */
            GetScaleByLevel: function (level) {
                var span = Math.abs(XspWeb.Controls.GISControl.Projections.WGS84ToMercatorProjection.mMaxX - XspWeb.Controls.GISControl.Projections.WGS84ToMercatorProjection.mMinX);
                var screenDistance = (Math.pow(2, level) * 256 * 0.0254) / 96;

                return screenDistance / span;
            },

            /**
             * 根据比例尺获取缩放级别
             *
             * @param Double scale 比例尺
             * @returns Int32 缩放级别
             */
            GetLevelByScale: function (scale) {
                var r = scale * (XspWeb.Controls.GISControl.Projections.WGS84ToMercatorProjection.mMaxX - XspWeb.Controls.GISControl.Projections.WGS84ToMercatorProjection.mMinX) / (256 * 0.0254 / 96);
                var level = Math.logBase(r, 2);

                return ((level + 0.5) | 0);
            },

            /**
             * 瓦片坐标映射到经纬度坐标
             *
             * @param Int32 x 瓦片横坐标
             * @param Int32 y 瓦片纵坐标
             * @param Int32 level 缩放级别
             * @returns XspWeb.Controls.GISControl.Common.LongLatPoint 经纬度坐标
             */
            TilePointToLongLatPint: function (x, y, level) {

                var floor = Math.pow(2, level);
                var longitude = ((x / floor) * 360.0) - 180.0;
                var eValue = Math.PI * (1 - ((2 * y) / floor));
                var sinhValue = (Math.exp(eValue) - Math.exp(-eValue)) / 2;
                var latitude = Math.atan(sinhValue) / (Math.PI / 180);

                return new XspWeb.Controls.GISControl.Common.LongLatPoint(longitude, latitude);
            },

            /**
             * 经纬度坐标映射到瓦片坐标
             *
             * @param XspWeb.Controls.GISControl.Common.LongLatPoint point 经纬度坐标
             * @param Int32 level 缩放级别
             * @returns XspWeb.Controls.GISControl.Common.TilePoint 瓦片坐标
             */
            LongLatPointToTilePoint: function (point, level) {

                var floor = Math.pow(2, level);
                var x = ((point.mLongitude + 180) / 360) * floor;
                var pi = point.mLatitude * (Math.PI / 180);
                var y = (1 - (Math.log(Math.tan(pi) + (1 / Math.cos(pi))) / Math.PI)) / 2 * floor;

                return new XspWeb.Controls.GISControl.Common.TilePoint(x, y);
            }
        }
    });
})(window, jQuery, $.Namespace());