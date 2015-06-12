(function (window, $, namespace) {

    /**
     * 定义文本元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Text", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Text;

            this.mCenterPoint = null;

            /**
             * 字体属性
             */
            this.mFont = null;

            /**
             * 填充颜色
             */
            this.mFillColor = null;

            /**
             * 行高
             */
            this.mLineHeight = 0;

            /**
             * 文本宽度
             */
            this.mWidth = 0;

            /**
             * 文本列表
             */
            this.mRowList = new XspWeb.Core.List();
        },

        SetRowList: function (rowList) {
            this.mRowList = rowList;
        },

        AddRow: function (text) {
            this.mRowList.Add(text);
        },

        SetFont: function (font) {
            this.mFont = font;
        },

        SetFillStyle: function (fillStyle) {
            this.mFillStyle = fillStyle;
        },

        SetCenterPoint: function (centerCoordinate) {
            this.mCenterPoint = centerCoordinate;
        },

        SetLineHeight: function (lineHeight) {
            this.mLineHeight = lineHeight;
        },

        OnPrepare: function (rect) {
            if (!this.mIsVisible || this.mRowList.Length() <= 0)
                return;

            var point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                this.mCenterPoint,
                this.mLayer.mScale
            );

            var maxLength = 0;
            for (var i = 0; i < this.mRowList.Length(); i++) {
                var tempText = this.mRowList.Get(i);
                var width = this.mLayer.mRenderable.MeasureTextWidth(tempText);
                maxLength = Math.max(maxLength, width);
            }
            var height = this.mRowList.Length() * this.mLineHeight;

            this.mArea = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetAreaByCenter(
                point,
                maxLength,
                height,
                this.mLayer.mZoom);

            this.mWidth = maxLength;
            this.mHeight = height;
            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mArea.HasIntersection(rect)) || (!this.mIsVisible) || (this.mRowList.Length() <= 0) || (!this.mArea))
                return;

            if (!this.mFont)
                this.mFont = XspWeb.Controls.GISControl.Element.ElementStyle.sFont;
            if (!this.mFillColor)
                this.mFillColor = XspWeb.Controls.GISControl.Element.ElementStyle.sFillColor;

            for (var i = 0; i < this.mRowList.Length(); i++) {
                renderable.Font(this.mFont);
                renderable.FillStyle(this.mFillStyle);
                renderable.DrawText(this.mRowList.Get(i),
                    (this.mArea.mX + this.mWidth) - rect.mX,
                    ((i * this.mLineHeight) + (this.mArea.mY + (this.mHeight / 2))) - rect.mY
                );
            }
        }
    });
})(window, jQuery, $.Namespace());