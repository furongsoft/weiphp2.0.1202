/**
 * Created by Alex on 2015/3/12.
 */
(function (window, $, namespace) {
    /**
     * 定义可渲染对象接口
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Renderable.Renderable", {

        /**
         * 构造函数
         *
         * @param Object container 容器控件
         * @param XspWeb.Controls.GISControl.Common.Size size 容器大小
         */
        Constructor: function (container, size) {
            if (!container)
                throw $.AResult.AE_INVALIDARG();

            this.Super();

            /**
             * 容器控件
             */
            this.mContainer = container;

            /**
             * 容器大小
             */
            this.mSize = size;
        },

        /**
         * 设置无效区域
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 无效矩形区域
         */
        InvalidateRect: function (rect) {
        },

        /**
         * 绘制图像
         *
         * @param Image img_elem 图像
         * @param Int32 dx_or_sx
         * @param Int32 dy_or_sy
         * @param Int32 dw_or_sw
         * @param Int32 dh_or_sh
         * @param Int32 dx
         * @param Int32 dy
         * @param Int32 dw
         * @param Int32 dh
         */
        DrawImage: function (img_elem, dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {
        },

        /**
         * 绘制上下文
         *
         * @param Object context 上下文
         * @param Int32 dx_or_sx
         * @param Int32 dy_or_sy
         * @param Int32 dw_or_sw
         * @param Int32 dh_or_sh
         * @param Int32 dx
         * @param Int32 dy
         * @param Int32 dw
         * @param Int32 dh
         */
        DrawContext: function (context, dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {
        },

        /**
         * 清除矩形区域
         *
         * @param x
         * @param y
         * @param w
         * @param h
         */
        ClearRect: function (x, y, w, h) {
        },

        /**
         * 文本内容
         *
         * @param String text
         * @param Double x
         * @param Double y
         * @param Double maxWidth
         */
        DrawText: function (text, x, y, maxWidth) {
        },

        /**
         * 绘制点
         *
         * @param Double x 圆的中心的 x 坐标
         * @param Double y 圆的中心的 y 坐标
         * @param Double radius 圆的半径.
         * @param Double startAngle 起始角,以弧度计(弧的圆形的三点钟位置是 0 度)
         * @param Double endAngle 结束角,以弧度计.
         * @param Boolean anticlockwise 可选.规定应该逆时针还是顺时针绘图.false = 顺时针，true = 逆时针
         */
        DrawPoint: function (x, y, radius, startAngle, endAngle, anticlockwise) {
        },

        /**
         * 绘制圆弧
         *
         * @param Double x 圆的中心的 x 坐标
         * @param Double y 圆的中心的 y 坐标
         * @param Double radius 圆的半径.
         * @param Double startAngle 起始角,以弧度计(弧的圆形的三点钟位置是 0 度)
         * @param Double endAngle 结束角,以弧度计.
         * @param Boolean anticlockwise 可选.规定应该逆时针还是顺时针绘图.false = 顺时针，true = 逆时针
         */
        DrawArc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
        },

        /**
         * 绘制线
         *
         * @param Double startX 路径的起始位置的 x 坐标
         * @param Double startY 路径的起始位置的 x 坐标
         * @param Double endX 路径的目标位置的 x 坐标
         * @param Double endY 路径的目标位置的 y 坐标
         */
        DrawLine: function (startX, startY, endX, endY) {
        },

        /**
         * 绘制折线
         *
         * @param XspWeb.Core.List pointList 折线的点列表
         */
        DrawMultiLine: function (pointList) {
        },

        /**
         * 绘制椭圆
         * @param Double x 椭圆中心的 x 坐标
         * @param Double y 椭圆中心的 y 坐标
         * @param Double xAxisRadius X轴半径
         * @param Double yAxisRadius Y轴半径
         */
        DrawEllipse: function (x, y, xAxisRadius, yAxisRadius) {
        },

        /**
         * 获取字符串包含的以像素计的宽度.
         *
         * @param String text
         * @returns Int32 字符串包含的以像素计的宽度
         */
        MeasureTextWidth: function (text) {
        },

        /**
         * 绘制矩形
         *
         * @param Double x
         * @param Double y
         * @param Double w
         * @param Double h
         */
        DrawRectangle: function (x, y, w, h) {
        },

        /**
         * 填充矩形
         *
         * @param x
         * @param y
         * @param w
         * @param h
         */
        FillRect: function (x, y, w, h) {
        },

        /**
         * 绘制圆角矩形
         *
         * @param Double x 左上角点x轴坐标
         * @param Double Double y 左上角点y轴坐标
         * @param Double w 宽度
         * @param Double h 高度
         * @param Double r 控制圆角的半径
         */
        DrawRoundRect: function (x, y, w, h, r) {
        },

        /**
         * 得到容器上点的坐标
         *
         * @param Double x 屏幕横坐标
         * @param Double y 屏幕纵坐标
         * @returns XspWeb.Controls.GISControl.Common.Point 返回
         */
        GetPointOnContainer: function (x, y) {
        },

        /**
         * 起始一条路径,或重置当前路径
         */
        BeginPath: function () {
        },

        /**
         * 设置或返回文本内容的当前字体属性
         *
         * @param String font (默认值:10px sans-serif; JavaScript 语法:context.font="italic small-caps bold 12px arial";)
         */
        Font: function (font) {
        },

        /**
         * 填充当前绘图(路径)
         */
        Fill: function () {
        },

        /**
         * 设置或返回用于填充绘画的颜色.渐变或模式
         *
         * @param String fillStyle
         */
        FillStyle: function (fillStyle) {
        },

        /**
         * 设置或返回用于笔触的颜色.渐变或模式
         *
         * @param String strokeStyle
         */
        StrokeStyle: function (strokeStyle) {
        },

        /**
         * 创建从当前点回到起始点的路径
         */
        ClosePath: function () {
        },

        /**
         * 绘制已定义的路径
         */
        Stroke: function () {
        },

        /**
         * 把路径移动到画布中的指定点,不创建线条
         *
         * @param Double x
         * @param Double y
         */
        MoveTo: function (x, y) {
        },

        /**
         * 添加一个新点,然后在画布中创建从该点到最后指定点的线条
         *
         * @param Double x
         * @param Double y
         */
        LineTo: function (x, y) {
        },

        /**
         * 创建弧/曲线(用于创建圆形或部分圆)
         *
         * @param Double x 圆的中心的 x 坐标
         * @param Double y 圆的中心的 y 坐标
         * @param Double radius 圆的半径.
         * @param Double startAngle 起始角,以弧度计(弧的圆形的三点钟位置是 0 度)
         * @param Double endAngle 结束角,以弧度计.
         * @param Boolean anticlockwise 可选.规定应该逆时针还是顺时针绘图.false = 顺时针，true = 逆时针
         */
        Arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
        },

        /**
         * 返回画布数据,默认类型为: image/png
         *
         * @param String type 指定返回画布数据的类型
         * @param args
         * @returns String 画布数据
         */
        ToDataURL: function (type, args) {
        },

        /**
         * 在画布上创建介于两个切线之间的弧/曲线
         *
         * @param Double x1 弧的起点的 x 坐标
         * @param Double y1 弧的起点的 y 坐标
         * @param Double x2 弧的终点的 x 坐标
         * @param Double y2 弧的终点的 y 坐标
         * @param Double radius 弧的终点的 y 坐标
         */
        ArcTo: function (x1, y1, x2, y2, radius) {
        },

        /**
         * 设置透明值.
         *
         * @param Double globalAlpha 透明值,必须介于 0.0(完全透明) 与 1.0(不透明) 之间。
         */
        GlobalAlpha: function (globalAlpha) {
            this.mContext.globalAlpha = globalAlpha;
        },

        /**
         * 得到容器的大小
         *
         * @returns XspWeb.Controls.GISControl.Common.Size 返回容器大小
         */
        GetContainerSize: function () {
        },

        /**
         * 获取容器
         *
         * @returns Object container 返回容器
         */
        GetContainer: function () {
        }
    });
})(window, jQuery, $.Namespace());