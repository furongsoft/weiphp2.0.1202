(function (window, $, namespace) {

    /**
     *  定义交叉元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Cross", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Cross;

            this.mCenterPoint = null;

            /**
             * 交叉水平长度和垂直长度
             */
            this.mLength = 0;

            /**
             * 笔触颜色
             */
            this.mStrokeColor = null;
        },

        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetLength: function (length) {
            this.mLength = length;
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
                this.mLength,
                this.mLength,
                this.mLayer.mZoom);

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            if (!this.mStrokeColor)
                this.mStrokeColor = XspWeb.Controls.GISControl.Element.ElementStyle.sStrokeColor;

            renderable.StrokeStyle(this.mStrokeColor);
            //first line
            renderable.DrawLine(
                this.mArea.mX - rect.mX,
                this.mArea.mY - rect.mY,
                (this.mArea.mX + this.mLength) - rect.mX,
                (this.mArea.mY + this.mLength) - rect.mY
            );
            //second line
            renderable.DrawLine(
                (this.mArea.mX + this.mLength) - rect.mX,
                this.mArea.mY - rect.mY,
                this.mArea.mX - rect.mX,
                (this.mArea.mY + this.mLength) - rect.mY
            );
        }
    });
})(window, jQuery, $.Namespace());