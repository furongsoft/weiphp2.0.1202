(function (window, $, namespace) {

    /**
     * 定义罗盘元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Compass", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Compass;

            /**
             * 中心点坐标
             */
            this.mCenterCoordinate = null;

            /**
             * 偏移角度 (以正东方向为0度方向,顺时针为正方向)
             */
            this.mOffsetAngle = 0;

            /**
             * 矫正角度 (以正东方向为0度方向,顺时针为正方向)
             */
            this.mAdjustAngle = 0;

            /**
             * 半径
             */
            this.mRadius = 0;

            /**
             * 箭头长度
             */
            this.mLength = 0;

            /**
             * 罗盘上显示的字
             */
            this.mText = "";
        },

        SetCenterCoordinate: function (centerCoordinate) {
            this.mCenterCoordinate = centerCoordinate;
        },

        SetOffsetAngle: function (offsetAngle) {
            this.mOffsetAngle = offsetAngle;
        },

        SetAdjustAngle: function (adjustAngle) {
            this.mAdjustAngle = adjustAngle;
        },

        SetRadius: function (radius) {
            this.mRadius = radius;
        },

        SetLength: function (length) {
            this.mLength = length;
        },

        SetText: function (text) {
            this.mText = text;
        },

        OnPrepare: function (rect) {
            if ((!this.mIsVisible) || (!this.mCenterCoordinate) || (!this.mLayer.mOffsetAngle))
                return;

            this.mOffsetAngle = this.mLayer.mOffsetAngle;
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mCenterCoordinate))
                return;

            /**
             * 画圆
             */
            renderable.DrawArc(
                this.mCenterCoordinate.mX,
                this.mCenterCoordinate.mY,
                this.mRadius,
                0,
                Math.PI * 2,
                true
            );

            // 画刻度
            var delatAngle = 45;
            for (var i = 0; i < 8; i++) {
                renderable.DrawLine(
                    this.mCenterCoordinate.mX + ((Math.cos(((Math.PI * delatAngle) * i) / 180) * this.mRadius) * 0.8),
                    this.mCenterCoordinate.mY + ((Math.sin(((Math.PI * delatAngle) * i) / 180) * this.mRadius) * 0.8),
                    this.mCenterCoordinate.mX + (Math.cos(((Math.PI * delatAngle) * i) / 180) * this.mRadius),
                    this.mCenterCoordinate.mY + (Math.sin(((Math.PI * delatAngle) * i) / 180) * this.mRadius)
                );
            }
            renderable.StrokeStyle("red");
            delatAngle = 9;
            for (var i = 0; i < 40; i++) {
                renderable.DrawLine(
                    this.mCenterCoordinate.mX + ((Math.cos(((Math.PI * delatAngle) * i) / 180) * this.mRadius) * 0.95),
                    this.mCenterCoordinate.mY + ((Math.sin(((Math.PI * delatAngle) * i) / 180) * this.mRadius) * 0.95),
                    this.mCenterCoordinate.mX + (Math.cos(((Math.PI * delatAngle) * i) / 180) * this.mRadius),
                    this.mCenterCoordinate.mY + (Math.sin(((Math.PI * delatAngle) * i) / 180) * this.mRadius)
                );
            }

            renderable.StrokeStyle("black");

            // 箭头的上部分与箭头的夹角
            var angel = 15;
            var angel1 = this.mOffsetAngle + this.mAdjustAngle;
            // 箭头的上部分
            renderable.DrawLine(
                this.mCenterCoordinate.mX + Math.cos((Math.PI * (angel1 - angel)) / 180) * (this.mLength * 0.24),
                this.mCenterCoordinate.mY + Math.sin((Math.PI * (angel1 - angel)) / 180) * (this.mLength * 0.24),
                this.mCenterCoordinate.mX + Math.cos((Math.PI * angel1) / 180) * (this.mLength * 0.3),
                this.mCenterCoordinate.mY + Math.cos((Math.PI * angel1) / 180) * (this.mLength * 0.3)
            );

            // 箭头
            renderable.DrawLine(
                this.mCenterCoordinate.mX + Math.cos((Math.PI * (angel1 + 180)) / 180) * (this.mLength * 0.7),
                this.mCenterCoordinate.mY + Math.sin((Math.PI * (angel1 + 180)) / 180) * (this.mLength * 0.7),
                this.mCenterCoordinate.mX + Math.cos((Math.PI * angel1) / 180) * (this.mLength * 0.3),
                this.mCenterCoordinate.mY + Math.sin((Math.PI * angel1) / 180) * (this.mLength * 0.3)
            );

            // 箭头的下部分
            renderable.DrawLine(
                this.mCenterCoordinate.mX + Math.cos((Math.PI * (angel1 + angel)) / 180) * (this.mLength * 0.24),
                this.mCenterCoordinate.mY + Math.sin((Math.PI * (angel1 + angel)) / 180) * (this.mLength * 0.24),
                this.mCenterCoordinate.mX + Math.cos((Math.PI * angel1) / 180) * (this.mLength * 0.3),
                this.mCenterCoordinate.mY + Math.sin((Math.PI * angel1) / 180) * (this.mLength * 0.3)
            );

            renderable.Font("Bauhaus 93");
            renderable.FillStyle("black");
            renderable.DrawText(this.mText,
                this.mCenterCoordinate.mX + Math.cos((Math.PI * angel1) / 180) * (this.mLength * 0.5) - 5,
                this.mCenterCoordinate.mY + Math.sin((Math.PI * angel1) / 180) * (this.mLength * 0.5) + 5,
                this.mCenterCoordinate.mY - (this.mRadius / 2)
            );
        }
    });
})(window, jQuery, $.Namespace());