/**
 * Created by Alex on 2015/3/4.
 */
(function (window, $, namespace) {

    /**
     * 定义消息队列类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.MessageQueue", XspWeb.Core.MessageQueue.MessageQueue, {

        OnHandler: function () {
            var i = 0;
            var message = null;
            if (!this.mTileCache)
                this.mTileCache = new XspWeb.Core.HashTable();
            this.mTileCache.Clear();

            // 合并WM_PAINT消息
            while (i < this.mList.Length()) {
                var item = this.mList.Get(i);
                if (item.mMessageId == XspWeb.Controls.GISControl.Common.MessageIds.WM_PAINT) {
                    if (message) {
                        this.mList.Remove(item);
                        var rect1 = message.mArguments[1];
                        var rect2 = item.mArguments[1];
                        message.mArguments[1] = rect1.GetUnion(rect2);
                    }
                    else {
                        message = item;
                        i++;
                    }
                }
                else {
                    i++;
                }
            }

            this.Super();
        }
    });

    /**
     * 定义渲染处理器类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.RenderHandler", XspWeb.Core.MessageQueue.Handler, {
        Constructor: function (gisControl) {
            this.Super(gisControl.mMessageQueue);

            /**
             * GIS控件
             */
            this.mGISControl = gisControl;

            /**
             * 每个图层对应的setTimeout函数的id列表
             */
            this.mTimerIdTable = new XspWeb.Core.HashTable();

            /**
             * 总的等待时间
             */
            this.mTotalTimeout = 0;

            this.mLastTime = null;
        },

        OnHandler: function (messageId) {
            switch (messageId) {
                case XspWeb.Controls.GISControl.Common.MessageIds.WM_PAINT:
                {
                    var rect = arguments[1];
                    this.mGISControl.mRenderable.ClearRect(rect.mX, rect.mY, rect.mWidth, rect.mHeight);
                    var length = this.mGISControl.mLayerList.Length();
                    for (var i = 0; i < length; ++i) {
                        var layer = this.mGISControl.mLayerList.Get(i);
                        layer.OnPaint(this.mGISControl.mRenderable,
                            XspWeb.Controls.GISControl.Projections.ScreenToLayerProjection.ToRect(rect, layer));
                    }
                    break;
                }

                case XspWeb.Controls.GISControl.Common.MessageIds.WM_LOADTILE:
                {
                    var target = arguments[2];
                    var handler = arguments[3];
                    var args = arguments[4];
                    target.OnLazyLoadHandler = handler;
                    target.OnLazyLoadHandler.apply(target, args);
                    break;
                }

                default:
                    break;
            }
        },

        /**
         * 延迟投递消息
         *
         * @param Int32 messageId 消息索引
         * @param Double timeout 延迟时间
         * @param Object target 处理对象
         * @param function handler 处理函数
         * @param Array args 参数
         */
        PostMessageLazy: function (messageId, timeout, target, handler, args) {

            if(!this.mLastTime)
                this.mLastTime = new Date();
            var currentTime = new Date();
            var currentTimeout = this.mTotalTimeout + (currentTime - this.mLastTime) + timeout;

            // 构造参数
            var args2 = new Array();
            for (var i = 0; i < arguments.length; ++i)
                args2[i] = arguments[i];

            // 异步投递消息
            var timerId = setTimeout(function () {
                var self = arguments[0];
                var messageId = arguments[1];
                var args = arguments[2];
                var timeout = arguments[3];
                var message = new XspWeb.Core.MessageQueue.Message(self, messageId, args);
                self.mMessageQueue.PostMessage(message);

                self.mTotalTimeout = (self.mTotalTimeout - timeout) < 0 ? 0 :  (self.mTotalTimeout - timeout);
                self.mLastTime = new Date();
            }, currentTimeout, this, messageId, args2, timeout);

            this.mTotalTimeout = currentTimeout;
            this.mLastTime = currentTime;

            var layerType= target.mLayerType;
            var timerIdList = this.mTimerIdTable.Get(layerType);
            if (!timerIdList) {
                timerIdList = new XspWeb.Core.List();
                this.mTimerIdTable.Add(layerType, timerIdList);
            }

            timerIdList.Add(timerId);
        },

        /**
         * 取消未投递的消息
         *
         * @param XspWeb.Controls.GISControl.Layer.LayerType layerType 图层类型
         */
        CancelMessage: function (layerType) {
            this.mLastTime = null;
            this.mTotalTimeout = 0;

            var timerIdList = this.mTimerIdTable.Get(layerType);
            if (timerIdList) {
                while (!timerIdList.IsEmpty())
                    clearTimeout(timerIdList.RemoveAtIndex(0));
            }
        }
    });

    /**
     * 定义可渲染对象类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.MyRenderable", XspWeb.Controls.GISControl.ClassFactory.GetRenderableClass(), {

        /**
         * 构造函数
         *
         * @param XspWeb.Controls.GISControl.GISControl gisControl GIS控件
         */
        Constructor: function (gisControl) {
            this.Super(gisControl.mContainer, gisControl.mSize);

            /**
             * GIS控件
             */
            this.mGISControl = gisControl;

            /**
             * 渲染处理器
             */
            this.mHandler = new XspWeb.Controls.GISControl.RenderHandler(gisControl);
        },

        InvalidateRect: function (layer, rect) {
            this.mHandler.PostMessage(XspWeb.Controls.GISControl.Common.MessageIds.WM_PAINT, rect);
        },

        /**
         * 延迟加载
         *
         * @param Double timeout 延迟时间
         * @param Object target 处理对象
         * @param function handler 处理函数
         * @param Array args 参数
         */
        LazyLoad: function (timeout, target, handler, args) {
            this.mHandler.PostMessageLazy(XspWeb.Controls.GISControl.Common.MessageIds.WM_LOADTILE, timeout, target, handler, args);
        },

        /**
         * 取消未投递的消息
         *
         * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层
         */
        CancelMessage: function (layer) {
            this.mHandler.CancelMessage(layer.mLayerType);
        }
    });

    /**
     * 定义GIS控件类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.GISControl", {

        /**
         * 构造函数
         *
         * @param Object container 容器控件
         */
        Constructor: function (container) {
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
            this.mSize = null;

            /**
             * 消息循环
             */
            this.mMessageQueue = new XspWeb.Controls.GISControl.MessageQueue();

            /**
            * 可渲染对象
            */
            this.mRenderable = null;

            /**
             * 图层列表
             */
            this.mLayerList = new XspWeb.Core.List();

            /**
             * 点击的点
             */
            this.mDownPoint = null;

            /**
             * 是否为无效的单击
             */
            this.mDirtyClick = false;
        },

        Dispose: function () {
            this.mRenderable.Dispose();
        },

        /**
         * 刷新
         */
        Update: function () {
            for (var i = 0; i < this.mLayerList.Length(); ++i) {
                this.mLayerList.Get(i).Update();
            }
        },

        /**
         * 添加图层
         *
         * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层
         */
        AddLayer: function (layer) {
            this.mLayerList.Add(layer);
        },

        /**
         * 获取图层列表
         *
         * @returns XspWeb.Core.List<XspWeb.Controls.GISControl.Layer.Layer> 图层列表
         */
        GetLayerList: function () {
            return this.mLayerList;
        },

        /**
         * 上移图层
         *
         * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层
         */
        MoveUpLayer: function (layer) {
            var layerList = this.GetLayerList();
            var i = 1;
            var length = layerList.Length();
            for (; i < length; i++) {
                var layer1 = layerList.Get(i);
                if (layer1 == layer)
                    break;
            }

            if (i == length)
                return;

            var layer2 = layerList.Get(i - 1);
            layerList.Set(i - 1, layer);
            layerList.Set(i, layer2);
        },

        /**
         * 上移图层
         *
         * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层
         */
        MoveDownLayer: function (layer) {
            var layerList = this.GetLayerList();
            var i = 0;
            var length = layerList.Length();
            for (; i < length; i++) {
                var layer1 = layerList.Get(i);
                if (layer1 == layer)
                    break;
            }

            if (i == (length - 1))
                return;

            var layer2 = layerList.Get(i + 1);
            layerList.Set(i + 1, layer);
            layerList.Set(i, layer2);
        },

        /**
         * 添加图层元素
         *
         * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层
         * @param XspWeb.Controls.GISControl.Element.Element element 元素
         * @returns Boolean 是否添加成功
         */
        AddLayerElement: function (layer, element) {
            if (!layer)
                throw $.AResult.AE_INVALIDARG();

            if (!layer.AddElement(element))
                return false;

            layer.Update();

            return true;
        },

        /**
         * 添加图层元素列表
         *
         * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层
         * @param XspWeb.Core.List elementList 元素列表
         */
        AddLayerElementList: function (layer, elementList) {
            if (!layer)
                throw $.AResult.AE_INVALIDARG();

            layer.BeginLock();

            for (var i = 0; i < elementList.Length(); i++) {
                var element = elementList.Get(i);
                layer.AddElement(element);
            }

            layer.EndLock();
            layer.Update();
        },

        /**
         * 移除图层元素
         *
         * @param XspWeb.Controls.GISControl.Element.Element element 元素
         * @returns Boolean 是否删除成功
         */
        RemoveLayerElement: function (layer, element) {
            if (!layer)
                throw $.AResult.AE_INVALIDARG();

            return layer.DeleteElement(element);
        },

        /**
         * 移除图层元素列表
         *
         * @param XspWeb.Core.List elementList 元素列表
         */
        RemoveLayerElementList: function (layer, elementList) {
            if (!layer)
                throw $.AResult.AE_INVALIDARG();

            layer.BeginLock();

            for (var i = 0; i < elementList.Length(); i++) {
                layer.DeleteElement(elementList.Get(i));
            }

            layer.EndLock();
            layer.Update();
        },

        // TODO: 是否需要还需探讨
        /**
         * 设置中心点经度度坐标
         *
         * @param Double longitude 经度坐标
         * @param Double latitude  纬度坐标
         */
        SetMapCenterLongLat: function (longitude, latitude) {
            if ((!longitude) || (!latitude))
                throw $.AResult.AE_INVALIDARG();

            for (var i = 0; i < this.mLayerList.Length(); ++i) {
                var layer = this.mLayerList.Get(i);
                if (layer["SetViewCenter"] === undefined)
                    continue;

                var point = new XspWeb.Controls.GISControl.Common.Point(longitude, latitude);
                point = XspWeb.Controls.GISControl.Projections.ProjectionUtil.GetProjectionPoint(point, layer.mProjectionType);

                layer.SetViewCenter(point);
                layer.Update();
            }
        },

        /**
         * 点击开始事件处理函数
         *
         * @param Double x 屏幕横坐标
         * @param Double y 屏幕纵坐标
         */
        OnClickStartHandler: function (x, y) {
            this.mDownPoint = {
                mX: x,
                mY: y
            };
        },

        /**
         * 点击结束事件处理函数
         *
         * @param Double x 屏幕横坐标
         * @param Double y 屏幕纵坐标
         */
        OnClickEndHandler: function (x, y) {
            this.mDownPoint = null;
        },

        /**
         * 移动事件处理函数
         *
         * @param Double x 屏幕横坐标
         * @param Double y 屏幕纵坐标
         */
        OnMoveHandler: function (x, y) {
            if (!this.mDownPoint)
                return;

            var offsetX = (x - this.mDownPoint.mX);
            var offsetY = (y - this.mDownPoint.mY);

            this.OnMoveByOffsetHandler(offsetX, offsetY);

            this.mDownPoint.mX = x;
            this.mDownPoint.mY = y;

            if ((Math.abs(offsetX) > 0) || (Math.abs(offsetY) > 0))
                this.mDirtyClick = true;
        },

        /**
         * 移出事件处理函数
         *
         * @param Double x 屏幕横坐标
         * @param Double y 屏幕纵坐标
         */
        OnMoveOutHandler: function (x, y) {
            this.mDownPoint = null;
        },

        /**
         * 单击事件处理函数
         *
         * @param Double x 屏幕横坐标
         * @param Double y 屏幕纵坐标
         */
        OnClickHandler: function (x, y) {
            if (this.mDirtyClick) {
                this.mDirtyClick = false;
                return;
            }

            if (this.mLayerList.Length() > 0)
                this.mLayerList.Get(this.mLayerList.Length() - 1).OnClickHandler(x, y);
        },

        /**
         * 双击事件处理函数
         *
         * @param Double x 屏幕横坐标
         * @param Double y 屏幕纵坐标
         */
        OnDBlclickHandler: function (x, y) {
            for (var i = 0; i < this.mLayerList.Length(); ++i)
                this.mLayerList.Get(i).OnDBlclickHandler(x, y);
        },

        /**
         * 图层级别缩放处理函数
         *
         * @param Int32 level 图层级别
         * @param Double zoom 缩放比例
         */
        OnZoomToLevelHandler: function (level, zoom) {
            for (var i = 0; i < this.mLayerList.Length(); ++i) {
                var layer = this.mLayerList.Get(i);
                if ((layer.mLayerType == XspWeb.Controls.GISControl.Layer.LayerType.OnlineMap)
                    || (layer.mLayerType == XspWeb.Controls.GISControl.Layer.LayerType.Normal)) {
                    layer.OnZoomToLevelHandler(level, zoom);
                }
            }
        },

        /**
         * 比例尺缩放处理函数
         *
         * @param Double scale 比例尺
         * @param Double zoom 缩放比例
         */
        OnZoomToScaleHandler: function (scale, zoom) {
            for (var i = 0; i < this.mLayerList.Length(); ++i) {
                var layer = this.mLayerList.Get(i);
                if ((layer.mLayerType == XspWeb.Controls.GISControl.Layer.LayerType.OnlineMap)
                    || (layer.mLayerType == XspWeb.Controls.GISControl.Layer.LayerType.Normal)) {
                    layer.OnZoomToScaleHandler(scale, zoom);
                }
            }
        },

        /**
         * 向上移动处理函数
         *
         * @param Double value 屏幕偏移量
         */
        OnTownUpHandler: function (value) {
            this.OnMoveByOffsetHandler(0, value);
        },

        /**
         * 向左移处理函数
         *
         * @param Double value 屏幕偏移量
         */
        OnTownLeftHandler: function (value) {
            this.OnMoveByOffsetHandler(value, 0);
        },

        /**
         * 向右移动处理函数
         *
         * @param Double value 屏幕偏移量
         */
        OnTownRightHandler: function (value) {
            this.OnMoveByOffsetHandler(-value, 0);
        },

        /**
         * 向下移动处理函数
         *
         * @param Double value 屏幕偏移量
         */
        OnTownDownHandler: function (value) {
            this.OnMoveByOffsetHandler(0, -value);
        },

        /**
         * 通过偏移量移动
         *
         * @param Double offsetX 屏幕横坐标偏移量
         * @param Double offsetY 屏幕纵坐标偏移量
         */
        OnMoveByOffsetHandler: function (offsetX, offsetY) {
            for (var i = 0; i < this.mLayerList.Length(); ++i) {
                var layer = this.mLayerList.Get(i);
                layer.OnMoveHandler(offsetX, offsetY);
            }
        }
    });
})(window, jQuery, $.Namespace());