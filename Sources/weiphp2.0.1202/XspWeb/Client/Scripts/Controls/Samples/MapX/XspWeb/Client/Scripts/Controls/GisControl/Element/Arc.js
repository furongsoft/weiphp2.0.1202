(function (window, $, namespace) {

    /**
     * 定义圆弧元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Arc", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Arc;

            /**
             * 半径
             */
            this.mRadius = 0;

            /**
             * 起始角,角度计(弧的圆形的三点钟位置是 0 度)
             */
            this.mStartAngle = 0;

            /**
             * 结束角,以角度计
             */
            this.mEndAngle = 0;

            /**
             * 图层坐标系对应的中心点坐标
             */
            this.mCenterPoint = null;

            /**
             * 笔触颜色
             */
            this.mStrokeColor = null;
        },

        /**
         * 设置图层坐标系对应的中心点坐标
         *
         * @param XspWeb.Controls.GISControl.Common.Point centerPoint 中心点坐标
         */
        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetRadius: function (radius) {
            this.mRadius = radius;
        },

        SetStartAngle: function (startAngle) {
            this.mStartAngle = startAngle;
        },

        SetEndAngle: function (endAngle) {
            this.mEndAngle = endAngle;
        },

        SetStrokeColor: function (strokeColor) {
            this.mStrokeColor = strokeColor;
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

            if (!this.mStrokeColor)
                this.mStrokeColor = XspWeb.Controls.GISControl.Element.ElementStyle.sStrokeColor;

            renderable.StrokeStyle(this.mStrokeColor);
            renderable.DrawArc(
                (this.mArea.mX + this.mRadius) - rect.mX,
                (this.mArea.mY + this.mRadius) - rect.mY,
                this.mRadius, Math.PI * this.mStartAngle / 180, Math.PI * this.mEndAngle / 180, true
            );
        }
    });
})(window, jQuery, $.Namespace());