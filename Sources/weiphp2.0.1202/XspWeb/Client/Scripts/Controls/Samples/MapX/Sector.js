(function (window, $, namespace) {

    /**
     * 定义扇形元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Sector", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Sector;

            /**
             * 半径
             */
            this.mRadius = 0;

            /**
             * 方位角,以度计
             */
            this.mAzimuth = 0;

            /**
             * 矫正角度,以度计
             */
            this.mAdjustAngle = 0;

            /**
             * 扇形角度,以度计
             */
            this.mAngle = 0;

            /**
             * 起始角,以度计
             */
            this.mStartAngle = 0;

            /**
             * 结束角,以度计
             */
            this.mEndAngle = 0;

            /**
             * 笔触颜色
             */
            this.mStrokeColor = null;

            /**
             * 填充颜色
             */
            this.mFillColor = null;

            this.mCenterPoint = null;

            /**
             * 信息
             */
            this.mMessage = null;
        },

        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetRadius: function (radius) {
            this.mRadius = radius;
        },

        SetStrokeColor: function (strokeColor) {
            this.mStrokeColor = strokeColor;
        },

        SetFillColor: function (fillColor) {
            this.mFillColor = fillColor;
        },

        SetAdjustAngle: function (adjustAngle) {
            this.mAdjustAngle = adjustAngle;
        },

        SetAngle: function (angle) {
            this.mAngle = angle;
        },

        SetAzimuth: function (azimuth) {
            this.mAzimuth = azimuth;

            this.mStartAngle = (azimuth + this.mAdjustAngle) + (this.mAngle / 2);
            this.mEndAngle = (azimuth + this.mAdjustAngle) - (this.mAngle / 2);

            this.mStartAngle = this.mStartAngle * Math.PI / 180;
            this.mEndAngle = this.mEndAngle * Math.PI / 180;
        },

        SetStartAngle: function (startAngle) {
            this.mStartAngle = startAngle;
            this.mStartAngle = this.mStartAngle * Math.PI / 180;
        },

        SetEndAngle: function (endAngle) {
            this.mEndAngle = endAngle;
            this.mEndAngle = this.mEndAngle * Math.PI / 180;
        },

        SetMessage: function (message) {
            this.mMessage = message;
        },

        /**
         * 将原始坐标转换成像素坐标
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 像素渲染区域
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
                1.0);

            return this.mArea.HasIntersection(rect);
        },

        /**
         * 绘制元素
         *
         * @param XspWeb.Controls.GISControl.Renderable.Renderable renderable 可渲染对象
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 像素渲染区域
         */
        OnPaint: function (renderable, rect) {
            if ((!this.mArea.HasIntersection(rect)) || (!this.mIsVisible))
                return;

            if (!this.mStrokeColor)
                this.mStrokeColor = XspWeb.Controls.GISControl.Element.ElementStyle.sStrokeColor;
            if (!this.mFillColor)
                this.mFillColor = XspWeb.Controls.GISControl.Element.ElementStyle.sFillColor;

            renderable.BeginPath();
            renderable.StrokeStyle(this.mStrokeColor);

            /**
             * 1.绘制圆心到圆弧 线1
             */
            renderable.MoveTo(
                (this.mArea.mX + this.mRadius) - rect.mX,
                (this.mArea.mY + this.mRadius) - rect.mY
            );
            renderable.LineTo(
                (this.mArea.mX + this.mRadius) + (Math.cos(this.mEndAngle) * this.mRadius) - rect.mX,
                (this.mArea.mY + this.mRadius) + (Math.sin(this.mEndAngle) * this.mRadius) - rect.mY
            );

            /**
             * 2.绘制圆心到圆弧 线2
             */
            renderable.MoveTo(
                (this.mArea.mX + this.mRadius) - rect.mX,
                (this.mArea.mY + this.mRadius) - rect.mY
            );
            renderable.LineTo(
                (this.mArea.mX + this.mRadius) + (Math.cos(this.mStartAngle) * this.mRadius) - rect.mX,
                (this.mArea.mY + this.mRadius) + (Math.sin(this.mStartAngle) * this.mRadius) - rect.mY
            );

            /**
             * 3.绘制圆弧
             */
            renderable.Arc(
                this.mArea.mX + this.mRadius - rect.mX,
                this.mArea.mY + this.mRadius - rect.mY,
                this.mRadius, this.mStartAngle, this.mEndAngle, true
            );
            renderable.ClosePath();
            renderable.FillStyle(this.mFillColor);
            renderable.Fill();
            renderable.Stroke();
        }
    });
})(window, jQuery, $.Namespace());