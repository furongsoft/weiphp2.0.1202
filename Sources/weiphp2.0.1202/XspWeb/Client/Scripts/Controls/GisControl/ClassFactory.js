/**
 * Created by Alex on 2015/3/19.
 */
(function (window, $, namespace) {
    /**
     * 定义类型工厂类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.ClassFactory", {
        Static: {
            /**
             * 获取默认可渲染对象类型
             *
             * @returns Class 默认可渲染对象类型
             */
            GetRenderableClass: function () {
                return XspWeb.Controls.GISControl.Renderable.Html5Renderable;
            },

            /**
             * 创建默认双缓冲对象实例
             *
             * @returns XspWeb.Controls.GISControl.Renderable.DoubleBuffer 默认双缓冲对象实例
             */
            CreateDoubleBuffer: function () {
                return $.CreateClass(XspWeb.Controls.GISControl.Renderable.Html5DoubleBuffer, arguments);
            },

            /**
             * 创建可渲染对象缓存
             *
             * @param Object container 容器控件
             * @param Double width canvas宽
             * @param Double height canvas高
             * @returns XspWeb.Controls.GISControl.Renderable.Html5Renderable 可渲染对象缓存
             */
            CreateCachedRenderable: function (container, width, height) {
                var size = new XspWeb.Controls.GISControl.Common.Size(width, height);
                var renderable = new XspWeb.Controls.GISControl.Renderable.Html5Renderable(container, size);
                renderable.Hide();

                return renderable;
            }
        }
    });
})(window, jQuery, $.Namespace());