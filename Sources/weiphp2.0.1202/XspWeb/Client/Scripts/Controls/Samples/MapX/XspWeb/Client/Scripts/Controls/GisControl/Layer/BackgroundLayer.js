(function (window, $, namespace) {

    /**
     * 背景图层
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.BackgroundLayer", XspWeb.Controls.GISControl.Layer.Layer, {
        Constructor: function (renderable) {
            this.Super(renderable);

            /**
             * 图层类型
             */
            this.mLayerType = XspWeb.Controls.GISControl.Layer.LayerType.Background;
        },

        OnPrepare: function (rect) {

        },

        OnPaint: function (renderable, rect) {

        }

    });
})(window, jQuery, $.Namespace());