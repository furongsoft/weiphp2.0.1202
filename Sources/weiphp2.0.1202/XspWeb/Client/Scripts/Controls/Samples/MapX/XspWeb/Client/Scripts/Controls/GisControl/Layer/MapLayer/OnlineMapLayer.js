/**
 * Created by Alex on 2015/3/4.
 */
(function (window, $, namespace) {

    /**
     * 定义在线地图图层类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.MapLayer.OnlineMapLayer", XspWeb.Controls.GISControl.Layer.MapLayer, {

        /**
         * 构造函数
         *
         * @param XspWeb.Controls.GISControl.Renderable.Renderable renderable 可渲染对象
         */
        Constructor: function (renderable) {
            this.Super(renderable);

            this.mLayerType = XspWeb.Controls.GISControl.Layer.LayerType.OnlineMap;

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
        },

        OnPrepare: function (rect) {
            // 取消不需要做的动作
            this.mRenderable.CancelMessage(this);

            // 从缓存中获取需要显示的瓦片
            var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(this.mScale);

            var leftBottom = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(this.mViewArea.GetLeftTopPoint(), this.mScale);
            var rightTop = XspWeb.Controls.GISControl.Projections.CoordinateConverter.PointToLongLatPoint(this.mViewArea.GetRightBottomPoint(), this.mScale);
            var blTile = XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToTilePoint(leftBottom, level);
            var trTile = XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToTilePoint(rightTop, level);
            var maxTile = Math.pow(2, level);

            this.mTileList.Clear();
            // 缓存中不存在的瓦片
            var notInCacheTileList = new XspWeb.Core.List();

            for (var x = (blTile.mX < 0 ? 0 : blTile.mX - 1); (x <= trTile.mX) && (x < maxTile); ++x) {
                for (var y = (trTile.mY < 0 ? 0 : blTile.mY - 1); (y <= trTile.mY) && (y < maxTile); ++y) {
                    var url = "http://mt2.google.cn/vt/lyrs=m@170000000&hl=zh-CN&gl=cn&x=" + x + "&y=" + y + "&z=" + level + "&s=Galil";
                    var point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.TilePointToLongLatPint(x, y, level);
                    point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.LongLatPointToPoint(point, this.mScale);
                    var tile = this.GetTileFromCache(x, y, level);
                    if (!tile) {
                        tile = new XspWeb.Controls.GISControl.Layer.MapLayer.MapLayerTile(
                            x, y, level, point.mX, point.mY);
                        tile.mUrl = url;
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
                this.LazyLoad(50, this.OnLoadTileListHandler, args);
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
         * 获取缓存的瓦片地图
         *
         * @param Int32 x 横坐标
         * @param Int32 y 纵坐标
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

            if (hashTable2.ContainsKey(tile.mY))
                return;

            hashTable2.Add(tile.mY, tile);
            this.mTileCacheList.Add(tile);

            // FIFO
            while (this.mTileCacheList.Length() > 200) {
                tile = this.mTileCacheList.RemoveAtIndex(0);
                hashTable1 = this.mTileCache.Get(tile.mLevel);
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
            var center = new XspWeb.Controls.GISControl.Common.Point(rect.mX + (rect.mWidth / 2), rect.mY + (rect.mHeight / 2));
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
         * 加载缓存中不存在的瓦片
         *
         * @param XspWeb.Core.List<XspWeb.Controls.GISControl.Layer.MapLayer.MapLayerTile> tileList
         */
        OnLoadTileListHandler: function (tileList) {
            var timeout = 20;
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
            for (var i = 0; i < tileList.Length(); i++)
                this.LoadTileImage(tileList.Get(i));
        },

        /**
         * 加载图片
         *
         * @param XspWeb.Controls.GISControl.Layer.MapLayerTile tile 瓦片信息对象
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