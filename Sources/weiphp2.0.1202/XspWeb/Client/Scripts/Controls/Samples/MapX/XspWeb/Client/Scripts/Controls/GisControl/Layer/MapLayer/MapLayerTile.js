(function (window, $, namespace) {

    /**
     * 定义瓦片地图信息类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.MapLayer.MapLayerTile", {

        /**
         *
         * @param Int32 tileX 瓦片x轴坐标
         * @param Int32 tileY 瓦片y轴坐标
         * @param Int32 level 图层级别
         * @param Double x 像素x轴坐标
         * @param Double y 像素x轴坐标
         */
        Constructor: function (tileX, tileY, level, x, y) {
            this.Super();

            /**
             * 横坐标
             */
            this.mX = tileX.toString();

            /**
             * 纵坐标
             */
            this.mY = tileY.toString();

            /**
             * 显示矩形区域
             */
            this.mArea = new XspWeb.Controls.GISControl.Common.Rectangle(x, y, 256, 256);

            /**
             * 缩放级别
             */
            this.mLevel = level.toString();

            /**
             * 瓦片地图URL
             */
            this.mUrl = "";

            /**
             * 瓦片地图
             */
            this.mImage = null;
        }
    });
})(window, jQuery, $.Namespace());