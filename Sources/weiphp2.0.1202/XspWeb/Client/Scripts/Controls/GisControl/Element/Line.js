(function (window, $, namespace) {

    /**
     * 定义线元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Line", XspWeb.Controls.GISControl.Element.Element, {
        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Line;

            /**
             * 原始坐标
             */
            this.mStartPoint = null;

            this.mEndPoint = null;

            /**
             * 屏幕坐标
             */
            this.mStartScreenPoint = null;

            this.mEndScreenPoint = null;

            /**
             * 笔触颜色
             */
            this.mStrokeColor = null;
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

            this.mArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                Math.min(startPoint.mX, endPoint.mX),
                Math.min(startPoint.mY, endPoint.mY),
                Math.abs(startPoint.mX - endPoint.mX) * this.mLayer.mZoom,
                Math.abs(startPoint.mY - endPoint.mY) * this.mLayer.mZoom
            );

            this.mStartScreenPoint = startPoint;
            this.mEndScreenPoint = endPoint;

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            if (!this.mStrokeColor)
                this.mStrokeColor = XspWeb.Controls.GISControl.Element.ElementStyle.sStrokeColor;

            renderable.StrokeStyle(this.mStrokeColor);
            renderable.DrawLine(
                (this.mStartScreenPoint.mX - rect.mX) / this.mLayer.mZoom,
                (this.mStartScreenPoint.mY - rect.mY) / this.mLayer.mZoom,
                (this.mEndScreenPoint.mX - rect.mX) / this.mLayer.mZoom,
                (this.mEndScreenPoint.mY - rect.mY) / this.mLayer.mZoom
            );
        }
    });
})(window, jQuery, $.Namespace());