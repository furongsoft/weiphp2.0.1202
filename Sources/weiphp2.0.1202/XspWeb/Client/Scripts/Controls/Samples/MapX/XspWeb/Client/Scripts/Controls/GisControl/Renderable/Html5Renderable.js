/**
 * Created by Alex on 2015/3/12.
 */
(function (window, $, namespace) {
    /**
     * 定义HTML5可渲染对象类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Renderable.Html5Renderable", XspWeb.Controls.GISControl.Renderable.Renderable, {

        /**
         * 构造函数
         *
         * @param Object container 容器控件
         * @param XspWeb.Controls.GISControl.Common.Size size 容器大小
         */
        Constructor: function (container, size) {
            this.Super(container, size);

            // 创建Canvas元素
            var canvas = document.createElement("canvas");
            if (size) {
                canvas.width = size.mWidth;
                canvas.height = size.mHeight;
            }
            else {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                this.mSize = new XspWeb.Controls.GISControl.Common.Size(container.clientWidth, container.clientHeight);
            }

            container.appendChild(canvas);

            /**
             * 上下文
             */
            this.mContext = canvas.getContext("2d");

            /**
             * 画布
             */
            this.mCanvas = canvas;
        },

        /**
         * 显示画布
         */
        Show: function () {
            this.mCanvas.style.display = "";
        },

        /**
         * 隐藏画布
         */
        Hide: function () {
            this.mCanvas.style.display = "none";
        },

        Dispose: function () {
            this.mContainer.removeChild(this.mCanvas);
        },

        InvalidateRect: function (rect) {
        },

        DrawImage: function (img_elem, dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {
            return this.mContext.drawImage.apply(this.mContext, arguments);
        },

        DrawContext: function (context, dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {
            if (arguments.length <= 0)
                return;

            var context = arguments[0];
            arguments[0] = context.canvas;

            return this.mContext.drawImage.apply(this.mContext, arguments);
        },

        ClearRect: function (x, y, w, h) {
            return this.mContext.clearRect.apply(this.mContext, arguments);
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
            this.mContext.fillText.apply(this.mContext, arguments);
        },

        /**
         * 绘制点
         *
         * @param Double x 圆的中心的 x 坐标
         * @param Double y 圆的中心的 y 坐标
         * @param Double radius 圆的半径。
         * @param Double startAngle 起始角，以弧度计（弧的圆形的三点钟位置是 0 度）
         * @param Double endAngle 结束角，以弧度计。
         * @param Boolean anticlockwise 可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针
         */
        DrawPoint: function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.mContext.beginPath.apply(this.mContext);
            this.mContext.arc.apply(this.mContext, arguments);
            this.mContext.closePath.apply(this.mContext);
            this.mContext.fill.apply(this.mContext);
        },

        /**
         * 绘制圆弧
         *
         * @param Double x 圆的中心的 x 坐标
         * @param Double y 圆的中心的 y 坐标
         * @param Double radius 圆的半径。
         * @param Double startAngle 起始角，以弧度计（弧的圆形的三点钟位置是 0 度）
         * @param Double endAngle 结束角，以弧度计。
         * @param Boolean anticlockwise 可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针
         */
        DrawArc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.mContext.beginPath.apply(this.mContext);
            this.mContext.arc.apply(this.mContext, arguments);
            this.mContext.stroke.apply(this.mContext);
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
            this.mContext.beginPath();
            this.mContext.moveTo(startX, startY);
            this.mContext.lineTo(endX, endY);
            this.mContext.stroke();
        },

        /**
         * 绘制折线
         *
         * @param XspWeb.Core.List pointList 折线的点列表
         */
        DrawMultiLine: function (pointList) {
            var startPoint = pointList.Get(0);
            this.mContext.beginPath();
            this.mContext.moveTo(startPoint.mX, startPoint.mY);
            for (var i = 1; i < pointList.Length(); i++) {
                var currentPoint = pointList.Get(i);
                this.mContext.lineTo(currentPoint.mX, currentPoint.mY);
            }
            this.mContext.stroke();
        },

        /**
         * 绘制椭圆
         * @param Double x 椭圆中心的 x 坐标
         * @param Double y 椭圆中心的 y 坐标
         * @param Double xAxisRadius X轴半径
         * @param Double yAxisRadius Y轴半径
         */
        DrawEllipse: function (x, y, xAxisRadius, yAxisRadius) {
            var ox = 0.5 * xAxisRadius;
            var oy = 0.6 * yAxisRadius;

            this.mContext.save();
            this.mContext.translate(x, y);
            this.mContext.beginPath();

            this.mContext.moveTo(0, yAxisRadius);
            this.mContext.bezierCurveTo(ox, yAxisRadius, xAxisRadius, oy, xAxisRadius, 0);
            this.mContext.bezierCurveTo(xAxisRadius, -oy, ox, -yAxisRadius, 0, -yAxisRadius);
            this.mContext.bezierCurveTo(-ox, -yAxisRadius, -xAxisRadius, -oy, -xAxisRadius, 0);
            this.mContext.bezierCurveTo(-xAxisRadius, oy, -ox, yAxisRadius, 0, yAxisRadius);
            this.mContext.closePath();
            this.mContext.stroke();
            this.mContext.restore();
        },

        /**
         * 获取字符串包含的以像素计的宽度。
         *
         * @param String text
         * @returns Int32 字符串包含的以像素计的宽度
         */
        MeasureTextWidth: function (text) {
            var metrics = this.mContext.measureText(text);
            return metrics.width;
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
            this.mContext.strokeRect.apply(this.mContext, arguments);
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
            this.mContext.fillRect.apply(this.mContext, arguments);
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
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.mContext.beginPath();
            this.mContext.moveTo(x + r, y);
            this.mContext.arcTo(x + w, y, x + w, y + h, r);
            this.mContext.arcTo(x + w, y + h, x, y + h, r);
            this.mContext.arcTo(x, y + h, x, y, r);
            this.mContext.arcTo(x, y, x + w, y, r);
            this.mContext.closePath();
            this.mContext.stroke();
        },

        GetPointOnContainer: function (x, y) {
            var container = this.mContext.canvas;
            var bbox = container.getBoundingClientRect();

            return new XspWeb.Controls.GISControl.Common.Point(
                x - bbox.left * (container.width / bbox.width),
                y - bbox.top * (container.height / bbox.height)
            );
        },

        BeginPath: function () {
            this.mContext.beginPath.apply(this.mContext);
        },

        Font: function (font) {
            this.mContext.font = font;
        },

        Fill: function () {
            this.mContext.fill.apply(this.mContext);
        },

        FillStyle: function (fillStyle) {
            this.mContext.fillStyle = fillStyle;
        },

        StrokeStyle: function (strokeStyle) {
            this.mContext.strokeStyle = strokeStyle;
        },

        ClosePath: function () {
            this.mContext.closePath.apply(this.mContext);
        },

        Stroke: function () {
            this.mContext.stroke.apply(this.mContext);
        },

        MoveTo: function (x, y) {
            this.mContext.moveTo.apply(this.mContext, arguments);
        },

        LineTo: function (x, y) {
            this.mContext.lineTo.apply(this.mContext, arguments);
        },

        Arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.mContext.arc.apply(this.mContext, arguments);
        },

        ToDataURL: function (type, args) {
            return this.mCanvas.toDataURL.apply(this.mCanvas, arguments);
        },

        ArcTo: function (x1, y1, x2, y2, radius) {
            this.mContext.arcTo.apply(this.mContext, arguments);
        },

        GlobalAlpha: function (globalAlpha) {
            this.mContext.globalAlpha = globalAlpha;
        },

        GetContainerSize: function () {
            return this.mSize;
        },

        GetContainer: function () {
            return this.mContainer;
        }
    });
})(window, jQuery, $.Namespace());