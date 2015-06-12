(function (window, $, namespace) {

    /**
     *  定义椭圆元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Ellipse", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mCenterPoint = null;

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Ellipse;

            /**
             * X轴半径
             */
            this.mXAxisRadius = 0;

            /**
             * Y轴半径
             */
            this.mYAxisRadius = 0;

            /**
             * 笔触颜色
             */
            this.mStrokeColor = null;
        },

        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetXAxisRadius: function (xAxisRadius) {
            this.mXAxisRadius = xAxisRadius;
        },

        SetYAxisRadius: function (yAxisRadius) {
            this.mYAxisRadius = yAxisRadius;
        },

        SetStrokeColor: function (strokeColor) {
            this.mStrokeColor = strokeColor;
        },

        OnPrepare: function (rect) {
            if (!this.mIsVisible)
                return;

            var point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                this.mCenterPoint,
                this.mLayer.mScale
            );

            this.mArea = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetAreaByCenter(
                point,
                this.mXAxisRadius * 2,
                this.mYAxisRadius * 2,
                this.mLayer.mZoom
            );

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            if (!this.mStrokeColor)
                this.mStrokeColor = XspWeb.Controls.GISControl.Element.ElementStyle.sStrokeColor;

            renderable.StrokeStyle(this.mStrokeColor);
            renderable.DrawEllipse(
                (this.mArea.mX + this.mXAxisRadius) - rect.mX,
                (this.mArea.mY + this.mYAxisRadius) - rect.mY,
                this.mXAxisRadius, this.mYAxisRadius
            );
        }
    });
})(window, jQuery, $.Namespace());