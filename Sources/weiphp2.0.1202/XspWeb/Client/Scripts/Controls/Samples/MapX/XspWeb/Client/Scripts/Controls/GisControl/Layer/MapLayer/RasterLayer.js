/**
 * Created by Alex on 2015/3/4.
 */
(function (window, $, namespace) {

    /**
     * 定义栅格图层类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer", XspWeb.Controls.GISControl.Layer.MapLayer, {

        Static: {
            /**
             * 渲染对象缓存
             */
            sCachedRenderable: null,

            /**
             * 获取渲染对象缓存
             *
             * @param XspWeb.Controls.GISControl.Renderable.Renderable 渲染对象
             * @param Double width 容器宽度
             * @param Double height 容器高度
             * @returns XspWeb.Controls.GISControl.Renderable.Renderable 返回渲染对象缓存
             */
            GetCachedRenderable: function (renderable, width, height) {
                if (!XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer.sCachedRenderable) {
                    XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer.sCachedRenderable = XspWeb.Controls.GISControl
                        .ClassFactory.CreateCachedRenderable(renderable.GetContainer(), width, height);
                }

                return XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer.sCachedRenderable;
            }
        },

        /**
         * 构造函数
         *
         * @param XspWeb.Controls.GISControl.Renderable.Renderable renderable 可渲染对象
         */
        Constructor: function (renderable) {
            this.Super(renderable);

            /**
             * 图层类型
             */
            this.mLayerType = XspWeb.Controls.GISControl.Layer.LayerType.Normal;

            /**
             * 瓦片地图信息列表
             */
            this.mTileList = new XspWeb.Core.List();

            /**
             * 瓦片地图缓存
             */
            this.mTileCache = new XspWeb.Core.HashTable();

            /**
             * 瓦片地图缓存列表
             */
            this.mTileCacheList = new XspWeb.Core.List();

            /**
             * 最后一次访问的区域
             */
            this.mLastArea = null;

            /**
             * 最后一次访问的元素列表
             */
            this.mLastElementList = new XspWeb.Core.List();

            /**
             * 最后一次访问的比例尺缓存
             */
            this.mLastScale = 0;
        },

        /**
         * 添加元素
         *
         * @param XspWeb.Controls.GISControl.Element.Element element 元素
         * @returns Boolean 是否添加成功
         */
        AddElement: function (element) {
            if (this.mLastElementList.Length() > 0) {
                if (element.OnPrepare(this.mLastArea)) {
                    this.mLastElementList.Add(element);

                    var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(this.mScale);
                    var longLat = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(
                        new XspWeb.Controls.GISControl.Common.Point(element.mArea.mX, element.mArea.mY), this.mScale);
                    var tilePoint = XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToTilePoint(longLat, level);

                    this.RemoveTileFromCache(tilePoint.mX, tilePoint.mY, level);
                }
            }

            return this.mElementList.Add(element) ? true : false;
        },

        /**
         * 删除元素
         *
         * @param XspWeb.Controls.GISControl.Element.Element element 元素
         * @returns Boolean 是否删除成功
         */
        DeleteElement: function (element) {
            if (this.mLastElementList.Contains(element))
                this.mLastElementList.Remove(element);

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
            for (var i = (this.mLastElementList.Length() - 1); i >= 0; i--) {
                var element1 = this.mLastElementList.Get(i);
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
            this.mLastElementList.Clear();
            this.mTileList.Clear();
            this.mTileCache.Clear();
            this.mTileCacheList.Clear();
            this.mLastArea = null;
        },

        OnPrepare: function (rect) {
            // 清除不需要做的动作
            this.mRenderable.CancelMessage(this);

            // 从缓存中获取需要显示的瓦片
            var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(this.mScale);
            var leftBottom = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(this.mViewArea.GetLeftTopPoint(), this.mScale);
            var rightTop = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(this.mViewArea.GetRightBottomPoint(), this.mScale);
            var blTile = XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToTilePoint(leftBottom, level);
            var trTile = XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToTilePoint(rightTop, level);
            var maxTile = Math.pow(2, level);

            this.mTileList.Clear();
            var notInCacheTileList = new XspWeb.Core.List();

            for (var x = (blTile.mX < 0 ? 0 : blTile.mX - 1); (x <= trTile.mX) && (x < maxTile); ++x) {
                for (var y = (trTile.mY < 0 ? 0 : blTile.mY - 1); (y <= trTile.mY) && (y < maxTile); ++y) {
                    var point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.TilePointToLongLatPint(x, y, level);
                    point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToPoint(point, this.mScale);
                    var tile = this.GetTileFromCache(x, y, level);
                    if (!tile) {
                        tile = new XspWeb.Controls.GISControl.Layer.MapLayer.MapLayerTile(
                            x, y, level, point.mX, point.mY);
                        notInCacheTileList.Add(tile);
                    }
                    else
                        this.mTileList.Add(tile);
                }
            }

            // 延迟准备缓存中不存在的瓦片
            if (notInCacheTileList.Length() > 0) {
                var args = new Array();
                args[0] = notInCacheTileList;
                this.LazyLoad(300, this.OnLoadTileListHandler, args);
            }

            return this.Super(rect);
        },

        OnPaint: function (renderable, rect) {
            for (var i = 0; i < this.mTileList.Length(); ++i) {
                var tile = this.mTileList.Get(i);
                if ((tile.mImage) && (rect.HasIntersection(tile.mArea))) {
                    var x = ((tile.mArea.mX - this.mViewArea.mX) / this.mZoom);
                    var y = ((tile.mArea.mY - this.mViewArea.mY) / this.mZoom);
                    var width = tile.mArea.mWidth / this.mZoom;
                    var height = tile.mArea.mHeight / this.mZoom;
                    if (this.mZoom == 1) {
                        x = x | 0;
                        y = y | 0;
                    }
                    renderable.DrawImage(tile.mImage, x, y, width, height);
                }
            }
        },

        /**
         * 图层单击事件处理函数
         *
         * @param Double x 单击点的屏幕横坐标
         * @param Double y 单击点的屏幕纵坐标
         */
        OnClickHandler: function (x, y) {
            var point = new XspWeb.Controls.GISControl.Common.Point(x, y);
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
            var scale = this.GetScale();
            var rect = this.GetViewArea();
            var center = new XspWeb.Controls.GISControl.Common.Point(
                rect.mX + (rect.mWidth / 2), rect.mY + (rect.mHeight / 2));
            center = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(center, scale);
            scale = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level);

            this.BeginLock();
            this.SetScale(scale);
            if (zoom)
                this.SetZoom(zoom);
            this.SetViewCenter(center);
            this.EndLock();
            this.Update();
        },

        /**
         * 比例尺缩放处理函数
         *
         * @param Double scale 比例尺
         * @param Double zoom 缩放比例
         */
        OnZoomToScaleHandler: function (scale, zoom) {
            var oldScale = this.GetScale();
            var rect = this.GetViewArea();
            var center = new XspWeb.Controls.GISControl.Common.Point(
                rect.mX + (rect.mWidth / 2), rect.mY + (rect.mHeight / 2));
            center = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(center, oldScale);

            this.BeginLock();
            this.SetScale(scale);
            if (zoom)
                this.SetZoom(zoom);
            this.SetViewCenter(center);
            this.EndLock();
            this.Update();
        },

        /**
         * 获取缓存的瓦片地图
         *
         * @param Int32 x 瓦片横坐标
         * @param Int32 y 瓦片纵坐标
         * @param Int32 level 缩放级别
         * @returns XspWeb.Controls.GISControl.Layer.MapLayerTile 瓦片地图信息对象
         */
        GetTileFromCache: function (x, y, level) {
            var hashTable1 = this.mTileCache.Get(level.toString());
            if (!hashTable1)
                return null;

            var hashTable2 = hashTable1.Get(x.toString());
            if (!hashTable2)
                return null;

            return hashTable2.Get(y.toString());
        },

        /**
         * 删除缓存的瓦片地图
         *
         * @param Int32 x 瓦片横坐标
         * @param Int32 y 瓦片纵坐标
         * @param Int32 level 缩放级别
         */
        RemoveTileFromCache: function (x, y, level) {
            var hashTable1 = this.mTileCache.Get(level.toString());
            if (!hashTable1)
                return null;

            var hashTable2 = hashTable1.Get(x.toString());
            if (!hashTable2)
                return null;

            hashTable2.Remove(y.toString());
        },

        /**
         * 添加瓦片地图信息对象进入缓存
         *
         * @param XspWeb.Controls.GISControl.Layer.MapLayerTile tile 瓦片地图信息对象
         */
        AddTileToCache: function (tile) {
            var hashTable1 = this.mTileCache.Get(tile.mLevel);
            if (!hashTable1) {
                hashTable1 = new XspWeb.Core.HashTable();
                this.mTileCache.Add(tile.mLevel, hashTable1);
            }

            var hashTable2 = hashTable1.Get(tile.mX);
            if (!hashTable2) {
                hashTable2 = new XspWeb.Core.HashTable();
                hashTable1.Add(tile.mX, hashTable2);
            }

            if (hashTable2.ContainsKey(tile.mY)) {
                hashTable2.Remove(tile.mY);
                hashTable2.Add(tile.mY, tile);
                this.mTileCacheList.Add(tile);

                // FIFO
                if (this.mTileCacheList.Length() > 200) {
                    tile = this.mTileCacheList.RemoveAtIndex(0);
                    hashTable1 = this.mTileCache.Get(tile.mLevel);
                    if (!hashTable1)
                        return;
                    hashTable2 = hashTable1.Get(tile.mX);
                    if (!hashTable2)
                        return;

                    hashTable2.Remove(tile.mY);
                    if (hashTable2.Length() == 0)
                        hashTable1.Remove(tile.mX);
                    if (hashTable1.Length() == 0)
                        this.mTileCache.Remove(tile.mLevel);
                }
                return;
            }

            hashTable2.Add(tile.mY, tile);
            this.mTileCacheList.Add(tile);

            // FIFO
            if (this.mTileCacheList.Length() > 200) {
                tile = this.mTileCacheList.RemoveAtIndex(0);
                hashTable1 = this.mTileCache.Get(tile.mLevel);
                if (!hashTable1)
                    return;
                hashTable2 = hashTable1.Get(tile.mX);
                if (!hashTable2)
                    return;

                hashTable2.Remove(tile.mY);
                if (hashTable2.Length() == 0)
                    hashTable1.Remove(tile.mX);
                if (hashTable1.Length() == 0)
                    this.mTileCache.Remove(tile.mLevel);
            }
        },

        /**
         * 准备需要绘制的元素
         *
         * @returns Boolean 准备成功返回true,否则返回false
         */
        PrepareElement: function () {
            if (this.mElementList.Length() <= 0)
                return false;

            // 比例尺改变,或者移出缓存区域时,更新最后一次访问的元素列表
            if ((!this.mLastArea) || (this.mScale != this.mLastScale) || (!this.mViewArea.IsSubset(this.mLastArea))) {
                this.mLastArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                    this.mViewArea.mX - (this.mViewArea.mWidth * 5),
                    this.mViewArea.mY - (this.mViewArea.mHeight * 5),
                    this.mViewArea.mWidth * 10,
                    this.mViewArea.mHeight * 10
                );

                // 准备最后一次访问的元素列表
                this.mLastElementList.Clear();
                for (var i = 0; i < this.mElementList.Length(); i++) {
                    var element = this.mElementList.Get(i);
                    if (element.OnPrepare(this.mLastArea))
                        this.mLastElementList.Add(element);
                }
            }
            this.mLastScale = this.mScale;

            return (this.mLastElementList.Length() > 0);
        },

        /**
         *
         * @param XspWeb.Core.List<XspWeb.Controls.GISControl.Layer.MapLayer.MapLayerTile> tileList 瓦片信息列表
         */
        OnLoadTileListHandler: function (tileList) {
            var timeout = 500;
            // 判断是否准备成功
            if (!this.PrepareElement())
                return;

            var tileArgs = new XspWeb.Core.List();
            for (var i = 0; i < tileList.Length(); i++) {
                var tile = tileList.Get(i);
                tileArgs.Add(tile);
                if (tileArgs.Length() > 4) {
                    var args = new Array();
                    args[0] = tileArgs;
                    this.LazyLoad(timeout, this.OnLoadTile, args);
                    tileArgs = new XspWeb.Core.List();
                }
            }

            if (tileArgs.Length() > 0) {
                var args = new Array();
                args[0] = tileArgs;
                this.LazyLoad(timeout, this.OnLoadTile, args);
            }
        },

        /**
         * 加载瓦片
         *
         * @param XspWeb.Core.List<XspWeb.Controls.GISControl.Layer.MapLayer.MapLayerTile> tileList 瓦片信息列表
         */
        OnLoadTile: function (tileList) {
            for (var j = 0; j < tileList.Length(); j++) {
                var tile = tileList.Get(j);

                var renderable = XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer.GetCachedRenderable(
                    this.mRenderable, tile.mArea.mWidth, tile.mArea.mHeight);
                renderable.ClearRect(0, 0, tile.mArea.mWidth, tile.mArea.mHeight);
                for (var i = 0; i < this.mLastElementList.Length(); i++) {
                    var element = this.mLastElementList.Get(i);
                    element.OnPaint(renderable, tile.mArea);
                }
                tile.mUrl = renderable.ToDataURL();

                this.LoadTileImage(tile);
            }
        },

        /**
         * 加载图片
         *
         * @param XspWeb.Controls.GISControl.Layer.MapLayer.MapLayerTile tile
         */
        LoadTileImage: function (tile) {
            var image = new Image();
            image.self = this;
            image.tile = tile;
            image.onload = function () {
                this.tile.mImage = this;
                this.self.mTileList.Add(this.tile);
                this.self.AddTileToCache(this.tile);
                this.self.InvalidateRect(this.tile.mArea);
            };
            image.src = tile.mUrl;
        }
    });
})(window, jQuery, $.Namespace());