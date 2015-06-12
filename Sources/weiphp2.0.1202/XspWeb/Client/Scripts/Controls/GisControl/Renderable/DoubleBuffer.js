/**
 * Created by Alex on 2015/3/19.
 */
(function (window, $, namespace) {
    /**
     * 定义双缓冲对象接口
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Renderable.DoubleBuffer", XspWeb.Controls.GISControl.Renderable.Renderable, {

        /**
         * 构造函数
         *
         * @param Object container 容器控件
         */
        Constructor: function (container) {
            this.Super(container);
        },

        /**
         * 获取帧缓冲区
         */
        GetFrameBuffer: function () {
        },

        /**
         * 清除备份缓冲区
         *
         * @param x
         * @param y
         * @param w
         * @param h
         */
        Clear: function (x, y, w, h) {
        },

        /**
         * 复制帧缓冲区内容到备份缓冲区
         *
         * @param dx_or_sx
         * @param dy_or_sy
         * @param dw_or_sw
         * @param dh_or_sh
         * @param dx
         * @param dy
         * @param dw
         * @param dh
         */
        Duplicate: function (dx_or_sx, dy_or_sy, dw_or_sw, dh_or_sh, dx, dy, dw, dh) {
        },

        /**
         * 同步帧缓冲区
         */
        Sync: function () {
        }
    });
})(window, jQuery, $.Namespace());