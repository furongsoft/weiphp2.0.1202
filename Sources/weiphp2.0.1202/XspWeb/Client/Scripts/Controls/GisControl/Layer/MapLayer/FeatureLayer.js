(function (window, $, namespace) {

    /**
     * 定义矢量图层类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.MapLayer.FeatureLayer", XspWeb.Controls.GISControl.Layer.MapLayer, {
        Constructor: function (renderable) {
            this.Super(renderable);

            /**
             * 图层类型
             */
            this.mLayerType = XspWeb.Controls.GISControl.Layer.LayerType.Normal;
        },

        /**
         * 添加元素
         *
         * @param XspWeb.Controls.GISControl.Element.Element element 元素
         * @returns Boolean 是否添加成功
         */
        AddElement: function (element) {
            return this.mElementList.Add(element) ? true : false;
        },

        /**
         * 删除元素
         *
         * @param XspWeb.Controls.GISControl.Element.Element element 元素
         * @returns Boolean 是否删除成功
         */
        DeleteElement: function (element) {
            return this.mElementList.Remove(element) ? true : false;
        },

        /**
         * 通过屏幕坐标获取顶层元素
         *
         * @param XspWeb.Controls.GISControl.Common.Point point 屏幕坐标
         * @returns Element 有交集的顶层元素
         */
        GetTopElementByCoordinate: function (point) {
            point = XspWeb.Controls.GISControl.Projections.ScreenToLayerProjection.To(point, this);

            var element = null;
            for (var i = (this.mElementList.Length() - 1); i >= 0; i--) {
                var element1 = this.mElementList.Get(i);
                if (element1.mArea.HasIntersectionPoint(point)) {
                    element = element1;
                    break;
                }
            }

            return element;
        },

        /**
         * 清空图层中所有元素
         */
        Clear: function () {
            this.mElementList.Clear();
        },

        OnPrepare: function (rect) {
            for (var i = 0; i < this.mElementList.Length(); i++) {
                var element = this.mElementList.Get(i);
                element.OnPrepare(this.mViewArea);
            }

            return this.Super(rect);
        },

        OnPaint: function (renderable, rect) {
            for (var i = 0; i < this.mElementList.Length(); i++) {
                var element = this.mElementList.Get(i);
                element.OnPaint(renderable, this.mViewArea);
            }
        },

        /**
         * 图层单击事件处理函数
         *
         * @param Double x 单击点的屏幕横坐标
         * @param Double y 单击点的屏幕纵坐标
         */
        OnClickHandler: function (x, y) {
            var point = this.mRenderable.GetPointOnContainer(x, y);
            var element = this.GetTopElementByCoordinate(point);
            if (element)
                element.OnClickHandler(point);
        },

        /**
         * 图层双击事件处理函数
         *
         * @param Double x 点击点的屏幕横坐标
         * @param Double y 点击点的屏幕纵坐标
         */
        OnDBlclickHandler: function (x, y) {
            var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(this.mScale);
            this.OnZoomToLevelHandler(++level);
        },

        /**
         * 图层移动事件处理函数
         *
         * @param Double offsetX 屏幕横坐标偏移量
         * @param Double offsetY 屏幕纵坐标偏移量
         */
        OnMoveHandler: function (offsetX, offsetY) {
            var rect = this.GetViewArea();
            rect.SetLeftTopPoint(rect.mX - offsetX * this.mZoom, rect.mY - offsetY * this.mZoom);
            this.SetViewArea(rect);
        },

        /**
         * 图层级别缩放处理函数
         *
         * @param Int32 level 图层级别
         * @param Double zoom 缩放比例
         */
        OnZoomToLevelHandler: function (level, zoom) {
            var layer = this;
            var scale = layer.GetScale();
            var rect = layer.GetViewArea();
            var center = new XspWeb.Controls.GISControl.Common.Point(rect.mX + (rect.mWidth / 2), rect.mY + (rect.mHeight / 2));
            center = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(center, scale);

            scale = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level);

            layer.BeginLock();
            layer.SetScale(scale);
            if (zoom)
                this.SetZoom(zoom);
            layer.SetViewCenter(center);
            layer.EndLock();
            layer.Update();
        },

        /**
         * 比例尺缩放处理函数
         *
         * @param Double scale 比例尺
         * @param Double zoom 缩放比例
         */
        OnZoomToScaleHandler: function (scale, zoom) {
            var layer = this;
            var oldScale = layer.GetScale();
            var rect = layer.GetViewArea();
            var center = new XspWeb.Controls.GISControl.Common.Point(rect.mX + (rect.mWidth / 2), rect.mY + (rect.mHeight / 2));
            center = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(center, oldScale);

            layer.BeginLock();
            layer.SetScale(scale);
            if (zoom)
                this.SetZoom(zoom);
            layer.SetViewCenter(center);
            layer.EndLock();
            layer.Update();
        }
    });
})(window, jQuery, $.Namespace());