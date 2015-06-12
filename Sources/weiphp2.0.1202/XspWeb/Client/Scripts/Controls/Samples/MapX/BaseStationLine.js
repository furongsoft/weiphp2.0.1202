(function (window, $, namespace) {

    /**
     * 定义基站连线元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.BaseStationLine", XspWeb.Controls.GISControl.Element.Element, {
        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Line;

            /**
             * 原始坐标
             */
            this.mStartPoint = null;

            this.mEndPoint = null;

            /**
             * 像素坐标
             */
            this.mStartPixelPoint = null;

            this.mEndPixelPoint = null;

            /**
             * 笔触颜色
             */
            this.mStrokeColor = null;

            /**
             * 方位角,以度计
             */
            this.mAzimuth = 0;

            /**
             * 矫正角度,以度计
             */
            this.mAdjustAngle = 0;

            /**
             * 矫正半径
             */
            this.mAdjustRadius = 0;
        },

        SetStartPoint: function (startCoordinate) {
            this.mStartPoint = startCoordinate;
        },

        SetEndPoint: function (endCoordinate) {
            this.mEndPoint = endCoordinate;
        },

        SetStrokeColor: function (strokeColor) {
            this.mStrokeColor = strokeColor;
        },

        SetAdjustAngle: function (adjustAngle) {
            this.mAdjustAngle = adjustAngle;
        },

        SetAzimuth: function (azimuth) {
            this.mAzimuth = azimuth;
        },

        SetAdjustRadius: function (adjustRadius) {
            this.mAdjustRadius = adjustRadius;
        },

        OnPrepare: function (rect) {
            if (!this.mIsVisible)
                return false;

            var startPoint = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                this.mStartPoint,
                this.mLayer.mScale
            );

            var endPoint = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                this.mEndPoint,
                this.mLayer.mScale
            );

            endPoint.mX += (Math.cos(((this.mAzimuth + this.mAdjustAngle) * Math.PI) / 180) * this.mAdjustRadius);
            endPoint.mY += (Math.sin(((this.mAzimuth + this.mAdjustAngle) * Math.PI) / 180) * this.mAdjustRadius);

            this.mArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                Math.min(startPoint.mX, endPoint.mX),
                Math.min(startPoint.mY, endPoint.mY),
                Math.abs(startPoint.mX - endPoint.mX),
                Math.abs(startPoint.mY - endPoint.mY)
            );

            this.mStartPixelPoint = startPoint;
            this.mEndPixelPoint = endPoint;

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            if (!this.mStrokeColor)
                this.mStrokeColor = XspWeb.Controls.GISControl.Element.ElementStyle.sStrokeColor;

            renderable.StrokeStyle(this.mStrokeColor);
            renderable.DrawLine(
                (this.mStartPixelPoint.mX - rect.mX) / this.mLayer.mZoom,
                (this.mStartPixelPoint.mY - rect.mY) / this.mLayer.mZoom,
                (this.mEndPixelPoint.mX - rect.mX) / this.mLayer.mZoom,
                (this.mEndPixelPoint.mY - rect.mY) / this.mLayer.mZoom
            );
        }
    });
})(window, jQuery, $.Namespace());