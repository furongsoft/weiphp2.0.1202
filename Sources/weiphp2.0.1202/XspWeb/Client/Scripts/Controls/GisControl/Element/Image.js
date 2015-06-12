(function (window, $, namespace) {

    /**
     * 定义图片元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Image", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Image;

            this.mImage = null;

            /**
             * 图标路径
             */
            this.mUrl = null;

            /**
             * 图标高
             */
            this.mHeight = 0;

            /**
             * 图标宽
             */
            this.mWidth = 0;

            /**
             * 原始中心坐标
             */
            this.mCenterPoint = null;

            /**
             * 图片是否已经加载成功
             */
            this.mImageOnloaded = false;
        },

        SetImage: function (image) {
            this.mImage = image;
        },

        SetCenterPoint: function (centerPoint) {
            this.mCenterPoint = centerPoint;
        },

        SetUrl: function (url) {
            this.mUrl = url;
        },

        SetHeight: function (height) {
            this.mHeight = height;
        },

        SetWidth: function (width) {
            this.mWidth = width;
        },

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
                this.mWidth,
                this.mHeight,
                this.mLayer.mZoom);

            var isOk = this.mArea.HasIntersection(rect);
            if (isOk && (!this.mImageOnloaded)) {
                this.mImage = new Image();
                var self = this;
                this.mImage.onload = function () {
                    self.mImageOnloaded = true;
                    self.mLayer.InvalidateRect(self.mArea);
                };
                this.mImage.src = this.mUrl;
            }

            return isOk;
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)) || (!this.mImage))
                return;

            renderable.DrawImage(
                this.mImage,
                (this.mArea.mX - rect.mX) / this.mLayer.mZoom,
                (this.mArea.mY - rect.mY) / this.mLayer.mZoom,
                this.mWidth,
                this.mHeight
            );
        }
    });
})(window, jQuery, $.Namespace());