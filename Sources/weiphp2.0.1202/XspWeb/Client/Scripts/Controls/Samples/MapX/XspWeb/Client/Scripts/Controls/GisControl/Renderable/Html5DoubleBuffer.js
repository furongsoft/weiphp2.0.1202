/**
 * Created by Alex on 2015/3/19.
 */
(function (window, $, namespace) {
    /**
     * 定义HTML5双缓冲对象类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Renderable.Html5DoubleBuffer", XspWeb.Controls.GISControl.Renderable.DoubleBuffer, {

        /**
         * 构造函数
         *
         * @param Object container 容器控件
         */
        Constructor: function (container) {
            this.Super(container);

            // 创建Canvas元素
            this.mCanvas = document.createElement("canvas");
            this.mCanvas.width = container.clientWidth;
            this.mCanvas.height = container.clientHeight;
            this.mCanvas.style.position = "absolute";
            this.mCanvas.style.left = "0px";
            this.mCanvas.style.top = "0px";
            this.mCanvas.style.visibility = "hidden";
            container.appendChild(this.mCanvas);

            /**
             * 帧缓冲区
             */
            this.mFrameBuffer = this.mCanvas.getContext("2d");

            /**
             * 备份缓冲区
             */
            this.mBackBuffer = this.mCanvas.getContext("2d");
        },

        Dispose: function () {
            this.mContainer.removeChild(this.mCanvas);
        },

        GetFrameBuffer: function () {
            return this.mFrameBuffer;
        },

        Clear: function (x, y, w, h) {
            return this.mBackBuffer.clearRect(x, y, w, h);
        },

        Duplicate: function (dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {

            if (dw === null)
                dw = dw_or_sw;

            if (dh === null)
                dh = dh_or_sh;

            return this.mBackBuffer.drawImage(
                this.mFrameBuffer.canvas,
                dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh,
                dx, dy, dw, dh);
        },

        Sync: function () {
            var temp = this.mFrameBuffer;
            this.mFrameBuffer = this.mBackBuffer;
            this.mBackBuffer = temp;
        },

        DrawImage: function (img_elem, dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {
            return this.mBackBuffer.drawImage.apply(this.mBackBuffer, arguments);
        },

        DrawContext: function (context, dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {
            if (arguments.length <= 0)
                return;

            var context = arguments[0];
            arguments[0] = context.canvas;

            return this.mBackBuffer.drawImage.apply(this.mBackBuffer, arguments);
        },

        ClearRect: function (x, y, w, h) {
            return this.mBackBuffer.clearRect.apply(this.mBackBuffer, arguments);
        }
    });
})(window, jQuery, $.Namespace());