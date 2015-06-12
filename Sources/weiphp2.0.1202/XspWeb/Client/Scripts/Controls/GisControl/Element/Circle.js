(function (window, $, namespace) {

    /**
     * 定义圆元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Circle", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Circle;

            /**
             * 图层坐标系对应的中心点坐标
             */
            this.mCenterPoint = null;

            /**
             * 半径
             */
            this.mRadius = 0;
        },

        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetRadius: function (radius) {
            this.mRadius = radius;
        },

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
                this.mLayer.mZoom
            );

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            renderable.StrokeStyle(this.mStrokeColor);
            renderable.DrawArc(
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