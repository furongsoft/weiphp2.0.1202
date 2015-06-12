(function (window, $, namespace) {

    /**
     * 定义弹出框元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Popup", XspWeb.Controls.GISControl.Element.Element, {

        Static: {
            /**
             * 渲染对象缓存
             */
            sCachedRenderable: null,

            /**
             * 获取渲染对象缓存
             * @param Double width 容器宽度
             * @param Double height 容器高度
             * @returns XspWeb.Controls.GISControl.Renderable.Renderable 渲染对象缓存
             */
            GetCachedRenderable: function (layer, width, height) {
                if (!XspWeb.Controls.GISControl.Element.Popup.sCachedRenderable) {
                    XspWeb.Controls.GISControl.Element.Popup.sCachedRenderable = XspWeb.Controls.GISControl
                        .ClassFactory.CreateCachedRenderable(layer.mRenderable.mGISControl.mContainer, width, height);
                }

                return XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer.sCachedRenderable;
            }
        },

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Popup;

            /**
             * 原始坐标
             */
            this.mTopPoint = null;

            /**
             * 像素坐标
             */
            this.mTopPixelPoint = null;

            /**
             * 字体属性列表
             */
            this.mTextFontList = new XspWeb.Core.List();

            /**
             * 字体大小列表
             */
            this.mTextFontSizeList = new XspWeb.Core.List();

            /**
             * 字体填充颜色列表
             */
            this.mTextFillColorList = new XspWeb.Core.List();

            /**
             * 文本内容最大宽度
             */
            this.mTextMaxLineWidth = 0;

            /**
             * 文本内容行高
             */
            this.mTextLineHeight = 0;

            /**
             * 文本内容,按行保存
             */
            this.mTextRowList = new XspWeb.Core.List();

            /**
             * 主标题
             */
            this.mSubject = "";

            /**
             * 主标题大小
             */
            this.mSubjectSize = 0;

            /**
             * 主标题颜色
             */
            this.mSubjectColor = null;

            /**
             * 矩形颜色
             */
            this.mRectangleColor = null;

            /**
             * 矩形透明度
             */
            this.mRectangleAlpha = null;
        },

        SetTextRowList: function (textRowList) {
            this.mTextRowList = textRowList;
        },

        AddTextRow: function (textRow) {
            this.mTextRowList.Add(textRow);
        },

        SetTextMaxLineWidth: function (textMaxLineWidth) {
            this.mTextMaxLineWidth = textMaxLineWidth;
        },

        SetTextLineHeight: function (textLineHeight) {
            this.mTextLineHeight = textLineHeight;
        },

        SetTextFontList: function (textFontList) {
            this.mTextFontList = textFontList;
        },

        AddTextFont: function (font) {
            this.mTextFontList.Add(font);
        },

        SetTextFontSizeList: function (textFontSizeList) {
            this.mTextFontSizeList = textFontSizeList;
        },

        AddTextFontSize: function (size) {
            this.mTextFontSizeList.Add(size);
        },

        SetTextFillColorList: function (textFillColorList) {
            this.mTextFillColorList = textFillColorList;
        },

        AddTextFillColor: function (color) {
            this.mTextFillColorList.Add(color);
        },

        SetTopPoint: function (topPoint) {
            this.mTopPoint = topPoint;
        },

        SetSubject: function (subjuect) {
            this.mSubject = subjuect;
        },

        SetSubjectSize: function (size) {
            this.mSubjectSize = size;
        },

        SetSubjectColor: function (color) {
            this.mSubjectColor = color;
        },

        SetRectangleColor: function (rectangleColor) {
            this.mRectangleColor = rectangleColor;
        },

        SetRectangleAlpha: function (rectangleAlpha) {
            this.mRectangleAlpha = rectangleAlpha;
        },

        OnPrepare: function (rect) {
            if (!this.mIsVisible)
                return;

            var point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                this.mTopPoint,
                this.mLayer.mScale
            );

            this.mTopPixelPoint = point;

            if (!this.mTextMaxLineWidth) {
                for (var i = 0; i < this.mTextRowList.Length(); i++) {
                    var tempText = this.mTextRowList.Get(i);
                    var width = this.mLayer.mRenderable.MeasureTextWidth(tempText);
                    this.mTextMaxLineWidth = Math.max(this.mTextMaxLineWidth, width);
                }
            }

            var height = this.mTextRowList.Length() * this.mTextLineHeight;

            this.mArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                point.mX - this.mTextMaxLineWidth,
                point.mY + height,
                this.mTextMaxLineWidth, height);

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mArea) || (!this.mIsVisible) || (this.mTextRowList.Length() <= 0))
                return;

            var topScreenX = (this.mTopPixelPoint.mX - rect.mX) / this.mLayer.mZoom;
            var topScreenY = (this.mTopPixelPoint.mY - rect.mY) / this.mLayer.mZoom;

            var more = 10;
            var offsetX = -(this.mArea.mWidth / 2) + (10 / 2);
            var offsetY = this.mArea.mHeight + this.mTextLineHeight + 25 + 25;
            // 绘制圆角矩形 start
            var x = (topScreenX + offsetX),
                y = (topScreenY - offsetY),
                w = this.mArea.mWidth,
                h = this.mArea.mHeight + this.mTextLineHeight + more,
                r = 10;

            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            renderable.BeginPath();
            renderable.StrokeStyle("gray");
            renderable.FillStyle(this.mRectangleColor ? this.mRectangleColor : "white");
            renderable.GlobalAlpha(this.mRectangleAlpha ? this.mRectangleAlpha : 1.0);
            renderable.MoveTo(x + r, y);
            renderable.ArcTo(x + w, y, x + w, y + h, r);
            renderable.ArcTo(x + w, y + h, x, y + h, r);
            renderable.ArcTo(x, y + h, x, y, r);
            renderable.ArcTo(x, y, x + w, y, r);
            renderable.ClosePath();
            renderable.Fill();
            renderable.Stroke();
            // 绘制圆角矩形 end

            renderable.GlobalAlpha(1.0);

            renderable.DrawLine(
                topScreenX + 10,
                ((topScreenY - offsetY) + (this.mArea.mHeight + this.mTextLineHeight)) + more,
                topScreenX,
                topScreenY - 25 - 15 + more
            );


            renderable.DrawLine(
                (topScreenX - 10),
                ((topScreenY - offsetY) + (this.mArea.mHeight + this.mTextLineHeight)) + more,
                topScreenX,
                topScreenY - 25 - 15 + more
            );

            // 白色的线
            renderable.StrokeStyle("white");
            renderable.DrawLine(
                topScreenX + 10,
                ((topScreenY - offsetY) + (this.mArea.mHeight + this.mTextLineHeight)) + more,
                (topScreenX - 10),
                ((topScreenY - offsetY) + (this.mArea.mHeight + this.mTextLineHeight)) + more
            );
            renderable.StrokeStyle("black");

            // 主标题
            this.mSubjectSize = this.mSubjectSize ? this.mSubjectSize : XspWeb.Controls.GISControl.Element.ElementStyle.sFontSize;
            renderable.Font("bold " + this.mSubjectSize + "pt Calibri");
            renderable.FillStyle(this.mSubjectColor ? this.mSubjectColor : XspWeb.Controls.GISControl.Element.ElementStyle.sFillColor);
            renderable.DrawText(
                this.mSubject,
                (topScreenX + offsetX) + 60,
                ((topScreenY + this.mTextLineHeight) - offsetY)
            );

            // 信息列表
            for (var i = 0; i < this.mTextRowList.Length(); i++) {
                var size = this.mTextFontSizeList.Get(i) ? this.mTextFontSizeList.Get(i) : XspWeb.Controls.GISControl.Element.ElementStyle.sFontSize;
                renderable.Font(size + "pt Calibri");
                renderable.FillStyle(this.mTextFillColorList.Get(i) ? this.mTextFillColorList.Get(i) : XspWeb.Controls.GISControl.Element.ElementStyle.sFillColor);
                renderable.FillRect(
                    (topScreenX + offsetX) + 10,
                    ((i * this.mTextLineHeight) + ((topScreenY + (this.mTextLineHeight / 2)) - offsetY)) + this.mSubjectSize + 3,
                    10,
                    10
                );
                renderable.GlobalAlpha(1.0);

                renderable.FillStyle(XspWeb.Controls.GISControl.Element.ElementStyle.sFillColor);
                renderable.DrawText(this.mTextRowList.Get(i),
                    (topScreenX + offsetX) + 25,
                    ((i * this.mTextLineHeight) + ((topScreenY + this.mTextLineHeight) - offsetY)) + this.mSubjectSize + 5
                );
            }
        }
    });
})(window, jQuery, $.Namespace());