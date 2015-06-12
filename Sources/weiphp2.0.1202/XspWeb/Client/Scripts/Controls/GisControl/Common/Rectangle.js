/**
 * Created by Alex on 2015/3/13.
 */
(function (window, $, namespace) {
    /**
     * 定义矩形区域类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Common.Rectangle", {

        /**
         * 构造函数
         *
         * @param Double x 左上角横坐标
         * @param Double y 左上角纵坐标
         * @param Double width 宽度
         * @param Double height 高度
         */
        Constructor: function (x, y, width, height) {
            this.Super();

            if (arguments.length == 4) {
                this.mX = x;
                this.mY = y;
                this.mWidth = width;
                this.mHeight = height;
                this.mRight = x + width;
                this.mBottom = y + height;
            }
            else {
                this.mX = 0.0;
                this.mY = 0.0;
                this.mWidth = 0.0;
                this.mHeight = 0.0;
                this.mRight = 0.0;
                this.mBottom = 0.0;
            }
        },

        /**
         * 拷贝矩形区域
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形区域
         */
        Copy: function (rect) {
            this.mX = rect.mX;
            this.mY = rect.mY;
            this.mWidth = rect.mWidth;
            this.mHeight = rect.mHeight;
            this.mRight = rect.mRight;
            this.mBottom = rect.mBottom;
        },

        /**
         * 判断矩形区域是否相等
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形区域
         * @returns Boolean 是否相等
         */
        Equals: function (rect) {
            return ((this.mX === rect.mX)
            && (this.mY === rect.mY)
            && (this.mWidth === rect.mWidth)
            && (this.mHeight === rect.mHeight));
        },

        /**
         * 设置左上角坐标
         *
         * @param Double x 左上角横坐标
         * @param Double y 左上角纵坐标
         */
        SetLeftTopPoint: function (x, y) {
            this.mX = x;
            this.mY = y;
            this.mRight = x + this.mWidth;
            this.mBottom = y + this.mHeight;
        },

        /**
         * 设置大小尺寸
         *
         * @param XspWeb.Controls.GISControl.Common.Size size 大小尺寸
         */
        SetSize: function (size) {
            this.mWidth = size.mWidth;
            this.mHeight = size.mHeight;
            this.mRight = x + size.mWidth;
            this.mBottom = y + size.mHeight;
        },

        /**
         * 获取左上角点坐标
         *
         * @returns XspWeb.Controls.GISControl.Common.Point 左上角点坐标
         */
        GetLeftTopPoint: function () {
            return new XspWeb.Controls.GISControl.Common.Point(this.mX, this.mY);
        },

        /**
         * 获取右下角点坐标
         *
         * @returns XspWeb.Controls.GISControl.Common.Point 右下角点坐标
         */
        GetRightBottomPoint: function () {
            return new XspWeb.Controls.GISControl.Common.Point(this.mRight, this.mBottom);
        },

        /**
         * 判断点是否在矩形区域内
         *
         * @param XspWeb.Controls.GISControl.Common.Point point 点
         * @returns Boolean 点是否在矩形区域内
         */
        HasIntersectionPoint: function (point) {
            return ((point.mX >= this.mX)
            && (point.mX <= this.mRight)
            && (point.mY >= this.mY)
            && (point.mY <= this.mBottom));
        },

        /**
         * 判断矩形是否是该矩形的子集
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形
         * @returns Boolean 矩形是否是该矩形的子集
         */
        IsSubset: function (rect) {
            return ((this.mX >= rect.mX)
            && (this.mRight <= rect.mRight)
            && (this.mY >= rect.mY)
            && (this.mBottom <= rect.mBottom));
        },

        /**
         * 判断矩形是否相交
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形
         * @returns Boolean 是否相交
         */
        HasIntersection: function (rect) {
            return ((this.mRight > rect.mX)
            && (this.mX < rect.mRight)
            && (this.mBottom > rect.mY)
            && (this.mY < rect.mBottom));
        },

        /**
         * 获取矩形交集
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形
         * @returns XspWeb.Controls.GISControl.Common.Rectangle 交集矩形,不相交返回空
         */
        GetIntersection: function (rect) {

            if (this.HasIntersection(rect)) {
                var x = (this.mX > rect.mX) ? this.mX : rect.mX;
                var y = (this.mY > rect.mY) ? this.mY : rect.mY;
                var w = ((this.mRight < rect.mRight) ? this.mRight : rect.mRight) - x;
                var h = ((this.mBottom < rect.mBottom) ? this.mBottom : rect.mBottom) - y;

                return new XspWeb.Controls.GISControl.Common.Rectangle(
                    x, y, w, h
                );
            }
            else {
                return null;
            }
        },

        /**
         * 获取矩形并集
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形
         * @returns XspWeb.Controls.GISControl.Common.Rectangle 并集矩形
         */
        GetUnion: function (rect) {

            var x = (this.mX < rect.mX) ? this.mX : rect.mX;
            var y = (this.mY < rect.mY) ? this.mY : rect.mY;
            var w = ((this.mRight > rect.mRight) ? this.mRight : rect.mRight) - x;
            var h = ((this.mBottom > rect.mBottom) ? this.mBottom : rect.mBottom) - y;

            return new XspWeb.Controls.GISControl.Common.Rectangle(
                x, y, w, h
            );
        }
    });
})(window, jQuery, $.Namespace());