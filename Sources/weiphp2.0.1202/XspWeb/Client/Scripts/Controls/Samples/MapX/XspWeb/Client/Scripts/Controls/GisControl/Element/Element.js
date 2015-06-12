(function (window, $, namespace) {
    /**
     * 定义元素类型枚举类
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.ElementType", {
        Static: {
            Arc: 0, // 圆弧
            Circle: 1, // 圆
            Compass: 2, // 罗盘
            Cross: 3, // 交叉线
            Ellipse: 4, // 椭圆
            Image: 5, // 图片
            Line: 6, // 线
            Point: 7, // 点
            Polygon: 8, // 多边形
            Rectangle: 9, // 矩形
            Scale: 10, // 比例尺
            Text: 11 // 文本
        }
    });

    /**
     * 定义元素默认样式
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.ElementStyle", {
        Static: {
            sStrokeColor: "black", // 笔触的颜色
            sFillColor: "black",  // 填充绘画的颜色
            sFont: "12pt Calibri", // 字体属性
            sFontSize: 12  // 字体大小
        }
    });

    /**
     * 定义元素接口
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Element", {
        Constructor: function (layer) {
            this.Super();

            /**
             * 元素所属图层
             */
            this.mLayer = layer;

            /**
             * 是否显示
             */
            this.mIsVisible = true;

            /**
             * id
             */
            this.mId = null;

            /**
             * 显示矩形区域
             */
            this.mArea = null;

            /**
             * 元素类型
             */
            this.mElementType = null;

            /**
             * 元素单击事件处理函数
             */
            this.mOnClickHandler = null;

            /**
             * 元素双击事件处理函数
             */
            this.mOnDBlclickHandler = null;

            /**
             * 元素移动事件处理函数
             */
            this.mOnMoveHandler = null;
        },

        SetVisible: function (visible) {
            this.mIsVisible = visible;
        },

        GetVisible: function () {
            return this.mIsVisible;
        },

        SetId: function (id) {
            this.mId = id;
        },

        GetId: function () {
            return this.mId;
        },

        SetOnClickHandler: function (clickHandler) {
            this.mOnClickHandler = clickHandler;
        },

        /**
         * 准备绘制事件处理函数
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 绘制矩形区域
         * @returns Boolean 是否准备成功
         */
        OnPrepare: function (rect) {
        },

        /**
         * 绘制事件处理函数
         *
         * @param XspWeb.Controls.GISControl.Renderable.Renderable renderable 可渲染对象
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 绘制矩形区域
         */
        OnPaint: function (renderable, rect) {
        },

        /**
         * 元素单击事件处理函数
         *
         * @param XspWeb.Controls.GISControl.Common.Point point 单击的点的像素坐标
         */
        OnClickHandler: function (point) {
            if (typeof(this.mOnClickHandler) !== "function")
                return false;

            this.mOnClickHandler(point);
        },

        /**
         * 元素双击事件处理函数
         *
         * @param Double x 双击点的 x 轴坐标
         * @param Double y 双击点的 y 轴坐标
         */
        OnDBlclickHandler: function (x, y) {
        },

        /**
         * 元素移动事件处理函数
         *
         * @param Double offsetX x轴偏移量
         * @param Double offsetY y轴偏移量
         */
        OnMoveHandler: function (offsetX, offsetY) {
        }
    });
})(window, jQuery, $.Namespace());