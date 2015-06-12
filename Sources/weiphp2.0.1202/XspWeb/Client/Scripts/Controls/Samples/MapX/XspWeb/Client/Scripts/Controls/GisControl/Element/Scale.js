(function (window, $, namespace) {

    /**
     * 定义比例尺元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Scale", XspWeb.Controls.GISControl.Element.Element, {

        Static: {
            sScaleArray: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000,
                20000, 50000, 100000, 200000, 500000, 1000000,
                2000000, 5000000, 10000000, 20000000]
        },

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Scale;

            /**
             * 左上角图层屏幕坐标
             */
            this.mLeftTopLayerScreenPoint = null;

            /**
             * 比例线长
             */
            this.mScaleLineLength = 0;

            /**
             * 文本内容
             */
            this.mText = null;
        },

        SetLeftTopLayerScreenPoint: function (leftTopLayerScreenPoint) {
            this.mLeftTopLayerScreenPoint = leftTopLayerScreenPoint;
        },

        OnPrepare: function (rect) {
            if (!this.mIsVisible || !this.mLeftTopLayerScreenPoint)
                return;

            var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(this.mLayer.mScale);

            var scaleArray = XspWeb.Controls.GISControl.Element.Scale.sScaleArray
            var length = scaleArray.length;

            /**
             * 比例线长
             */
            this.mScaleLineLength = (100 * 96 * scaleArray[length - 1 - level] * this.mLayer.mScale / 2.54) | 0;

            /**
             * 文本内容
             */
            if (level > 13)
                this.mText = scaleArray[length - 1 - level] + XspWeb.Misc.Language.GISControl.Metre;
            else
                this.mText = scaleArray[length - 1 - level] / 1000 + XspWeb.Misc.Language.GISControl.Kilometre;
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mLeftTopLayerScreenPoint))
                return;

            renderable.StrokeStyle("black");
            var offsetY = 8;
            renderable.DrawLine(
                this.mLeftTopLayerScreenPoint.mX,
                this.mLeftTopLayerScreenPoint.mY + (offsetY - 2),
                this.mLeftTopLayerScreenPoint.mX,
                this.mLeftTopLayerScreenPoint.mY + (offsetY + 2)
            );

            renderable.DrawLine(
                this.mLeftTopLayerScreenPoint.mX,
                this.mLeftTopLayerScreenPoint.mY + offsetY,
                this.mLeftTopLayerScreenPoint.mX + this.mScaleLineLength,
                this.mLeftTopLayerScreenPoint.mY + offsetY
            );

            renderable.DrawLine(
                this.mLeftTopLayerScreenPoint.mX + this.mScaleLineLength,
                this.mLeftTopLayerScreenPoint.mY + (offsetY - 2),
                this.mLeftTopLayerScreenPoint.mX + this.mScaleLineLength,
                this.mLeftTopLayerScreenPoint.mY + (offsetY + 2)
            );

            renderable.Font("10pt Calibri");
            renderable.FillStyle("black");
            renderable.DrawText(
                this.mText,
                this.mLeftTopLayerScreenPoint.mX + (this.mScaleLineLength / 4),
                this.mLeftTopLayerScreenPoint.mY
            );
        }
    });
})(window, jQuery, $.Namespace());