/**
 * @requires Element/Element.js
 */

(function (window, $, namespace) {

    /**
     * 定义点元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Point", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Point;

            /**
             * 半径
             */
            this.mRadius = 0;

            /**
             * 中心点坐标
             */
            this.mCenterPoint = null;

            /**
             * 填充颜色
             */
            this.mFillColor = null;
        },

        SetRadius: function (radius) {
            this.mRadius = radius;
        },

        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetFillColor: function (fillColor) {
            this.mFillColor = fillColor;
        },

        /**
         * 将屏幕坐标转换成图层屏幕坐标
         *
         * @param rect
         */
        OnPrepare: function (rect) {
            if (!this.mIsVisible)
                return false;

            var point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                this.mCenterPoint,
                this.mLayer.mScale
            );

            this.mArea = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetAreaByCenter(
                point,
                this.mRadius * 2,
                this.mRadius * 2,
                this.mLayer.mZoom);

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            if (!this.mFillColor)
                this.mFillColor = XspWeb.Controls.GISControl.Element.ElementStyle.sFillColor;

            renderable.FillStyle(this.mFillColor);
            renderable.DrawPoint(
                ((this.mArea.mX + this.mRadius) - rect.mX) / this.mLayer.mZoom,
                ((this.mArea.mY + this.mRadius) - rect.mY) / this.mLayer.mZoom,
                this.mRadius,
                0,
                Math.PI * 2,
                true
            );
        }
    });
})(window, jQuery, $.Namespace());