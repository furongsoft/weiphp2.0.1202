(function (window, $, namespace) {

    /**
     * 定义矩形元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Rectangle", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Rectangle;

            this.mCenterPoint = null;

            this.mWidth = null;

            this.mHeight = null;

            /**
             * 笔触颜色
             */
            this.mStrokeColor = null;
        },

        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetWidth: function (width) {
            this.mWidth = width;
        },

        SetHeight: function (height) {
            this.mHeight = height;
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

            this.mArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                point.mX - this.mWidth / 2,
                point.mY - this.mHeight / 2,
                this.mWidth * this.mLayer.mZoom, this.mHeight * this.mLayer.mZoom
            );

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            if (!this.mStrokeColor)
                this.mStrokeColor = XspWeb.Controls.GISControl.Element.ElementStyle.sStrokeColor;

            renderable.DrawRectangle(
                this.mArea.mX - rect.mX,
                this.mArea.mY - rect.mY,
                this.mWidth, this.mHeight
            );
        }
    });
})(window, jQuery, $.Namespace());