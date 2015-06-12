/**
 * 地图控件
 */
$.DeclareClass("XspWeb.Controls.MapX", XspWeb.Controls.GISControl.GISControl, {
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
            if (!XspWeb.Controls.MapX.sCachedRenderable) {
                XspWeb.Controls.MapX.sCachedRenderable = XspWeb.Controls.GISControl.ClassFactory.
                    CreateCachedRenderable(renderable.GetContainer(), width, height);
            }

            return XspWeb.Controls.MapX.sCachedRenderable;
        }
    },

    /**
     * 构造函数
     *
     * @param Object container 容器控件
     */
    Constructor: function (container) {
        if (!container)
            throw $.AResult.AE_INVALIDARG();

        this.Super(container);

        /**
         * 缩放比率
         */
        this.mZoom = 1.0;

        /**
         * 比例尺
         */
        this.mScale = 0.0;

        /**
         * 当前位置图层
         */
        this.mCurrentLayer = null;

        /**
         * 基站打点拉线图层
         */
        this.mLineToBaseStationLayer = null;

        /**
         * 工具图层
         */
        this.mToolLayer = null;

        /**
         * 用户自定义图层列表
         */
        this.mUserLayerList = new XspWeb.Core.List();

        /**
         * 触屏时两个手指的距离
         */
        this.mDistance = null;

        /**
         * 最大图层级别
         */
        this.mMaxLevel = 18;

        /**
         * 最小图层级别
         */
        this.mMinLevel = 3;

        /**
         * 截屏可渲染对象
         */
        this.mPrintScreenRenderable = null;

        /**
         * 截屏是否有效
         */
        this.mValidPrintScreen = false;

        /**
         * 手指列表
         */
        this.mTouchList = new XspWeb.Core.List();
    },

    SetZoom: function (zoom) {
        this.mZoom = zoom;
    },

    GetZoom: function () {
        return this.mZoom;
    },

    SetScale: function (scale) {
        this.mScale = scale;
    },

    GetScale: function () {
        return this.mScale;
    },

    /**
     * 添加图层
     *
     * @param XspWeb.Controls.GISControl.Layer.Layer layer 图层
     */
    AddLayer: function (layer) {
        var i = 0;
        for (; i < this.mLayerList.Length(); i++) {
            if (this.mLayerList.Get(i).mLayerType === XspWeb.Controls.GISControl.Layer.LayerType.OnlineMap)
                break;
        }
        var tempLayer = layer;

        if ((layer != this.mToolLayer) && (layer != this.mLineToBaseStationLayer) && (layer != this.mCurrentLayer)) {
            this.mUserLayerList.Add(layer);
            var currentLayer;
            for (++i; i < this.mLayerList.Length(); i++) {
                currentLayer = this.mLayerList.Get(i);
                this.mLayerList.Set(i, tempLayer);
                tempLayer = currentLayer;
            }
            this.mLayerList.Add(tempLayer);
        }
        else
            this.mLayerList.Add(layer);
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

        var layer = this.GetLineToBaseStationLayer();


        if (layer.mLastPopupElement) {
            layer.DeleteElement(layer.mLastPopupElement);
            layer.Update();
        }

        var userLayerList = this.GetUserLayerList();

        if (userLayerList.Length() == 0)
            return;

        for (var i = userLayerList.Length() - 1; i >= 0; i--) {
            var layer1 = userLayerList.Get(i);
            var point = new XspWeb.Controls.GISControl.Common.Point(x, y);
            var topElement = layer1.GetTopElementByCoordinate(point);
            if (topElement) {
                topElement.OnClickHandler(x, y);
                break;
            }
        }
    },

    /**
     * 初始化地图
     *
     * @param Double width 地图宽度
     * @param Double height 地图高度
     * @param Double level 地图层级
     * @param Double longitude 经度
     * @param Double latitude 纬度
     */
    Initialize: function (width, height, level, longitude, latitude) {
        var size = new XspWeb.Controls.GISControl.Common.Size(width, height);
        this.mSize = size;

        // 可渲染对象
        this.mRenderable = new XspWeb.Controls.GISControl.MyRenderable(this);
        // 截屏可渲染对象
        this.mPrintScreenRenderable = XspWeb.Controls.MapX.GetCachedRenderable(this.mRenderable, size.mWidth, size.mHeight);

        // 注册地图事件
        this.RegisterMoblieEvent();
        this.mScale = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level);
        this.mZoom = 1.0;
        // 1.初始化在线图层
        var layer = new XspWeb.Controls.GISControl.Layer.MapLayer.OnlineMapLayer(this.mRenderable);
        layer.BeginLock();
        layer.mName = "OnlineMapLayer";
        layer.SetSize(size);
        layer.SetScale(this.mScale);
        layer.SetZoom(this.mZoom);
        layer.SetViewCenter(new XspWeb.Controls.GISControl.Common.LongLatPoint(longitude, latitude));
        layer.EndLock();
        this.mLayerList.Add(layer);
        layer.Update();

        // 2.初始化用户当前位置
        this.mCurrentLayer = new XspWeb.Controls.GISControl.Layer.MapLayer.FeatureLayer(this.mRenderable);
        // 锁定图层
        this.mCurrentLayer.BeginLock();
        this.mCurrentLayer.mName = "mCurrentLayer";
        this.mCurrentLayer.SetSize(size);
        this.mCurrentLayer.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        this.mCurrentLayer.SetZoom(this.mZoom);
        this.mCurrentLayer.SetViewCenter(new XspWeb.Controls.GISControl.Common.LongLatPoint(longitude, latitude));
        this.mCurrentLayer.EndLock();
        this.mCurrentLayer.Update();
        this.AddLayer(this.mCurrentLayer);

        // 3.初始化基站打点拉线图层
        this.mLineToBaseStationLayer = new XspWeb.Controls.GISControl.Layer.MapLayer.FeatureLayer(this.mRenderable);
        // 锁定图层
        this.mLineToBaseStationLayer.BeginLock();
        this.mLineToBaseStationLayer.mName = "mLineToBaseStationLayer";
        this.mLineToBaseStationLayer.SetSize(size);
        this.mLineToBaseStationLayer.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        this.mLineToBaseStationLayer.SetZoom(this.mZoom);
        this.mLineToBaseStationLayer.SetViewCenter(new XspWeb.Controls.GISControl.Common.LongLatPoint(longitude, latitude));
        this.mLineToBaseStationLayer.EndLock();
        this.mLineToBaseStationLayer.Update();
        this.AddLayer(this.mLineToBaseStationLayer);

        // 4.初始化工具图层
        this.mToolLayer = new XspWeb.Controls.GISControl.Layer.MapLayer.FeatureLayer(this.mRenderable);
        // 锁定图层
        this.mToolLayer.BeginLock();
        this.mToolLayer.mName = "mToolLayer";
        this.mToolLayer.SetSize(size);
        this.mToolLayer.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        this.mToolLayer.SetZoom(this.mZoom);
        this.mToolLayer.SetViewCenter(new XspWeb.Controls.GISControl.Common.LongLatPoint(longitude, latitude));
        this.mToolLayer.EndLock();
        this.mToolLayer.Update();
        this.AddLayer(this.mToolLayer);

        // 添加比例尺
        var position = new XspWeb.Controls.GISControl.Common.Point(8, size.mHeight - 30);
        this.AddScale(position);
    },

    /**
     * 注册地图事件
     */
    RegisterEvent: function () {

        var self = this;

        /**
         * 鼠标滚动事件
         */
        if (this.mContainer.addEventListener) {
            this.mContainer.addEventListener("DOMMouseScroll", function (e) {
                self.MouseWheelHandler(e); // Firefox
            }, false);
        }

        this.mContainer.onmousewheel = function (e) {
            self.MouseWheelHandler(e); // IE/Opera/Chrome
        };

        /**
         * 鼠标双击事件
         */
        this.mContainer.ondblclick = function (e) {
            var scale = self.GetScale();
            var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);
            level++;
            if (level > self.mMaxLevel)
                return;

            self.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
            self.MouseDBlclickHandler(e);
        };

        /**
         * 鼠标上的按钮被按下事件
         */
        this.mContainer.onmousedown = function (e) {
            self.MouseDownHandler(e);
        };

        /**
         * 鼠标按下后,松开事件
         */
        this.mContainer.onmouseup = function (e) {
            self.MouseUpHandler(e);
        };

        /**
         * 鼠标移动事件
         */
        this.mContainer.onmousemove = function (e) {
            self.MouseMoveHandler(e);
        };

        /**
         * 鼠标移出事件
         */
        this.mContainer.onmouseout = function (e) {
            self.MouseOutHandler(e);
        };

        /**
         * 鼠标点击事件
         */
        this.mContainer.onclick = function (e) {
            self.MouseClickHandler(e);
        };
    },

    /**
     * 注册手机相关事件
     */
    RegisterMoblieEvent: function () {

        var self = this;

        /**
         * 手机端单击事件
         */
        $(this.mContainer).on("tap", function (e) {
            e.preventDefault();
            self.OnClickHandler(e.pageX, e.pageY);
        });

        /**
         * 手机端双击事件
         */
        $$(this.mContainer).on("doubleTap", function (e) {
            e.preventDefault();

            var now = new Date();
            if (self.mLastDBLClickTime && ((now - self.mLastDBLClickTime) < 400))
                return;

            self.mLastDBLClickTime = now;
            var scale = self.GetScale();
            var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);
            level++;
            if (level > self.mMaxLevel) {
                if (self.GetZoom() == 1)
                    return;
                else
                    level = self.mMaxLevel;
            }

            self.OnZoomToLevelHandler(level, 1.0);
            self.SetZoom(1.0);
            self.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        });

        /**
         * 手机端触屏事件
         */
        this.mContainer.addEventListener("touchstart", function (e) {
            self.TouchStartHandler(e);
        });

        /**
         * 手机端触屏事件
         */
        this.mContainer.addEventListener("touchend", function (e) {
            self.TouchEndHandler(e);
        });

        /**
         * 手机端触屏移动事件
         */
        this.mContainer.addEventListener("touchmove", function (e) {
            e.preventDefault();// 阻止浏览器默认事件
            self.TouchMoveHandler(e);
        });

        /**
         * 手机端滑动事件
         */
        $(this.mContainer).on("swipe", function (e) {
            e.preventDefault();
            self.OnClickHandler(e.pageX, e.pageY);
        });
    },

    /**
     * 鼠标滚动事件
     *
     * @param e
     */
    MouseWheelHandler: function (e) {
        var e = window.event || e;
        if (e.preventDefault) {
            // Firefox
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            // IE
            e.cancelBubble = true;
            e.returnValue = false;
        }

        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta == 1)
            this.OnZoomInHandler();
        else
            this.OnZoomOutHandler();

        return false;
    },

    /**
     * 鼠标上的按钮被按下事件
     *
     * @param e
     */
    MouseDownHandler: function (e) {
        this.OnClickStartHandler(e.pageX, e.pageY);
    },

    /**
     * 鼠标按下后,松开事件
     *
     * @param e
     */
    MouseUpHandler: function (e) {
        this.OnClickEndHandler(e.pageX, e.pageY);
    },

    /**
     * 鼠标移动事件
     *
     * @param e
     */
    MouseMoveHandler: function (e) {
        this.OnMoveHandler(e.pageX, e.pageY);
    },

    /**
     * 鼠标双击事件
     *
     * @param e
     */
    MouseDBlclickHandler: function (e) {
        this.OnDBlclickHandler(e.pageX, e.pageY);
    },

    /**
     * 鼠标移出事件
     *
     * @param e
     */
    MouseOutHandler: function (e) {
        this.OnMoveOutHandler(e.pageX, e.pageY);
    },

    /**
     * 鼠标单击事件
     *
     * @param e
     */
    MouseClickHandler: function (e) {
        this.OnClickHandler(e.pageX, e.pageY);
    },

    /**
     * 手机端触屏开始事件
     *
     * @param e
     */
    TouchStartHandler: function (e) {
        this.mTouchList.Clear();
        for (var i = 0; i < e.targetTouches.length; i++)
            this.mTouchList.Add(e.targetTouches[i]);

        // 一个手指
        if (this.mTouchList.Length() == 1)
            this.OnClickStartHandler(this.mTouchList.Get(0).pageX, this.mTouchList.Get(0).pageY);
        // 两个手指
        else if (this.mTouchList.Length() == 2) {
            // 截屏
            this.PrintScreen();
            this.mDistance = this.GetDistance(this.mTouchList.Get(0), this.mTouchList.Get(1));
        }
    },

    /**
     * 手机端触屏移动事件
     *
     * @param e
     */
    TouchMoveHandler: function (e) {
        // 一个手指
        if (this.mTouchList.Length() == 1) {
            this.OnMoveHandler(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
        }
        // 两个手指
        else if (this.mTouchList.Length() == 2) {
            var currentDistance = this.GetDistance(e.targetTouches[0], e.targetTouches[1]);
            if (this.mDistance) {
                if (this.mPrintScreenRenderable && this.mValidPrintScreen) {
                    var delat = currentDistance / this.mDistance;
                    var zoom = this.GetZoom();
                    zoom = zoom - (delat - 1);
                    if (zoom < 0.1)
                        zoom = 0.1;

                    this.SetZoom(zoom);

                    var scale = this.GetScale();
                    var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);
                    if (((level <= this.mMinLevel) && (this.GetZoom() > 1)) || ((level >= this.mMaxLevel) && (this.GetZoom() < 1))) {
                        this.SetZoom(1.0);
                        return;
                    }

                    var size = this.mRenderable.GetContainerSize();
                    var center = new XspWeb.Controls.GISControl.Common.Point(size.mWidth / 2, size.mHeight / 2);
                    var viewArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                        center.mX - ((size.mWidth / this.GetZoom()) / 2),
                        center.mY - ((size.mHeight / this.GetZoom()) / 2),
                        size.mWidth / this.GetZoom(),
                        size.mHeight / this.GetZoom()
                    );
                    setTimeout(function () {
                        var size = arguments[1];
                        arguments[0].mRenderable.ClearRect(0, 0, size.mWidth, size.mHeight);
                        arguments[0].mRenderable.DrawContext(arguments[0].mPrintScreenRenderable.mContext, viewArea.mX, viewArea.mY, viewArea.mWidth, viewArea.mHeight);
                    }, 1, this, size);
                }
            }
            this.mDistance = currentDistance;
        }
    },

    /**
     * 截屏
     */
    PrintScreen: function () {
        var self = this;
        setTimeout(function () {
            var size = self.mRenderable.GetContainerSize();
            if (!self.mPrintScreenRenderable)
                self.mPrintScreenRenderable = XspWeb.Controls.MapX.GetCachedRenderable(self.mRenderable, size.mWidth, size.mHeight);

            self.mPrintScreenRenderable.ClearRect(0, 0, size.mWidth, size.mHeight);

            var center = new XspWeb.Controls.GISControl.Common.Point(size.mWidth / 2, size.mHeight / 2);
            var viewArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                center.mX - ((size.mWidth * self.GetZoom()) / 2),
                center.mY - ((size.mHeight * self.GetZoom()) / 2),
                size.mWidth * self.GetZoom(),
                size.mHeight * self.GetZoom()
            );

            self.mPrintScreenRenderable.DrawContext(self.mRenderable.mContext, viewArea.mX, viewArea.mY, viewArea.mWidth, viewArea.mHeight);
            self.mValidPrintScreen = true;
        }, 1);
    },

    /**
     * 获取两个手指之间的距离
     *
     * @param a
     * @param b
     * @returns Double 返回两个手指的距离
     */
    GetDistance: function (a, b) {
        var x = a.pageX - b.pageX;
        var y = a.pageY - b.pageY;
        return Math.sqrt(x * x + y * y);
    },

    /**
     * 手机端触屏结束事件
     *
     * @param e
     */
    TouchEndHandler: function (e) {
        if (this.mTouchList.Length() == 1)
            this.OnClickEndHandler(this.mTouchList.Get(0).pageX, this.mTouchList.Get(0).pageY);
        else if (this.mTouchList.Length() >= 2) {
            if (!this.mValidPrintScreen)
                return;

            this.mValidPrintScreen = false;

            // 更新地图
            this.UpdateByZoomAndScale();
        }
    },

    /**
     * 地图放大事件处理函数
     */
    OnZoomInHandler: function () {
        var scale = this.GetScale();
        var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);
        if (level < this.mMaxLevel)
            level++;
        this.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        this.OnZoomToLevelHandler(level, this.GetZoom());

    },

    /**
     * 地图缩小事件处理函数
     */
    OnZoomOutHandler: function () {
        var scale = this.GetScale();
        var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);
        if (level > this.mMinLevel)
            level--;
        this.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        this.OnZoomToLevelHandler(level, this.GetZoom());

    },

    /**
     * 通过图层类型获取图层列表
     *
     * @param layerType XspWeb.Controls.GISControl.Layer.LayerType layerType 图层类型
     * @returns XspWeb.Core.List<XspWeb.Controls.GISControl.Layer.Layer> 图层列表
     */
    GetLayerListByLayerType: function (layerType) {
        var layers = new XspWeb.Core.List();

        var layerList = this.GetLayerList();
        for (var i = 0; i < layerList.Length(); i++) {
            var layer = layerList.Get(i);
            if (layer.mLayerType === layerType) {
                layers.Add(layer);
            }
        }

        return layers;
    },

    /**
     * 通过图层类型获取图层
     *
     * @param XspWeb.Controls.GISControl.Layer.LayerType layerType 图层类型
     * @returns XspWeb.Controls.GISControl.Layer.Layer 返回图层
     */
    GetLayerByLayerType: function (layerType) {
        var layerList = this.GetLayerList();
        for (var i = 0; i < layerList.Length(); i++) {
            var layer = layerList.Get(i);
            if (layer.mLayerType === layerType) {
                return layer;

                break;
            }
        }
    },

    /**
     * 获取普通图层列表
     *
     * @returns XspWeb.Core.List<XspWeb.Controls.GISControl.Layer.Layer> 普通图层列表
     */
    GetNormalLayerList: function () {
        return this.GetLayerListByLayerType(XspWeb.Controls.GISControl.Layer.LayerType.Normal);
    },

    /**
     * 获取在线地图图层
     *
     * @returns XspWeb.Controls.GISControl.Layer.OnlineMapLayer 在线地图图层
     */
    GetOnlineMapLayer: function () {
        return this.GetLayerByLayerType(XspWeb.Controls.GISControl.Layer.LayerType.OnlineMap);
    },

    /**
     * 添加指南针
     *
     * @param XspWeb.Controls.GISControl.Common.Point position 指南针位置
     */
    AddCompass: function (position) {
        var layer = this.GetToolLayer();

        // 添加罗盘
        var element = new XspWeb.Controls.GISControl.Element.Compass(layer);
        element.SetRadius(40);
        element.SetLength(40);
        element.SetAdjustAngle(-90);
        element.SetText("北");
        element.SetCenterCoordinate(position);
        this.AddLayerElement(layer, element);
    },

    /**
     * 添加比例尺
     *
     * @param XspWeb.Controls.GISControl.Common.Point position 比例尺位置
     * @param XspWeb.Controls.GISControl.Common.Size size 图层大小
     * @param Int32 level 图层级别
     */
    AddScale: function (position, size, level) {
        var layer = this.GetToolLayer();

        // 添加比例尺
        var element = new XspWeb.Controls.GISControl.Element.Scale(layer);
        element.SetLeftTopLayerScreenPoint(position);
        this.AddLayerElement(layer, element);
        layer.Update();
    },

    /**
     * 创建栅格图层
     *
     * @param String name 图层名称
     * @returns XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer 返回栅格图层
     */
    CreateRasterLayer: function (name) {
        var onlineLayer = this.GetOnlineMapLayer();
        if (!onlineLayer)
            throw $.AResult.AE_INVALIDARG();
        var center = onlineLayer.GetViewCenter();

        var layer = new XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer(this.mRenderable);
        // 锁定图层
        layer.BeginLock();
        layer.mName = name;
        var size = this.mRenderable.GetContainerSize();
        layer.SetSize(size);
        var scale = this.GetScale();
        var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);
        layer.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        layer.SetZoom(this.mZoom);
        layer.SetViewCenter(center);
        layer.EndLock();
        layer.Update();
        this.AddLayer(layer);

        return layer;
    },

    /**
     * 创建矢量图层
     *
     * @param String name 图层名称
     * @returns XspWeb.Controls.GISControl.Layer.MapLayer.FeatureLayer 返回矢量图层
     */
    CreateFeatureLayer: function (name) {
        var onlineLayer = this.GetOnlineMapLayer();
        if (!onlineLayer)
            throw $.AResult.AE_INVALIDARG();
        var center = onlineLayer.GetViewCenter();

        var layer = new XspWeb.Controls.GISControl.Layer.MapLayer.FeatureLayer(this.mRenderable);
        // 锁定图层
        layer.BeginLock();
        layer.mName = name;
        var size = this.mRenderable.GetContainerSize();
        layer.SetSize(size);
        var scale = this.GetScale();
        var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);
        layer.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        layer.SetZoom(this.mZoom);
        layer.SetViewCenter(center);
        layer.EndLock();
        layer.Update();
        this.AddLayer(layer);

        return layer;
    },

    /**
     * 获取工具图层
     *
     * @returns XspWeb.Controls.GISControl.Layer.ToolLayer 在线地图图层
     */
    GetToolLayer: function () {
        return this.mToolLayer;
    },

    /**
     * 获取用户自定义图层列表
     *
     * @returns XspWeb.Core.List<XspWeb.Controls.GISControl.Layer.Layer> 图层列表
     */
    GetUserLayerList: function () {
        return this.mUserLayerList;
    },

    /**
     * 获取用户当前位置图层
     *
     * @returns XspWeb.Controls.GISControl.Layer.UserMapLayer 用户图层
     */
    GetCurrentLayer: function () {
        return this.mCurrentLayer;
    },

    /**
     * 获取基站打点图层
     *
     * @returns XspWeb.Controls.GISControl.Layer.CommonLayer 用户图层
     */
    GetLineToBaseStationLayer: function () {
        return this.mLineToBaseStationLayer;
    },

    /**
     * 获取基站图层
     *
     * @returns XspWeb.Controls.GISControl.Layer.MapLayer.RasterLayer 返回基站图层
     */
    GetBaseStationLayer: function () {
        if (!this.mBaseStationLayer)
            this.mBaseStationLayer = this.CreateRasterLayer("BaseStationLayer");

        return this.mBaseStationLayer;
    },

    /**
     * 基站拉线
     *
     * @param Double cellId 点的cellId
     * @param Double pointLongitude 点的经度
     * @param Double pointLatitude 点的纬度
     * @param Double rgbRed 线的rgb红色色分量
     * @param Double rgbGreen 线的rgb绿色分量
     * @param Double rgbBlue 线的rgb蓝色分量
     */
    LineToBaseStation: function (cellId, pointLongitude, pointLatitude, rgbRed, rgbGreen, rgbBlue) {
        var layer = this.GetLineToBaseStationLayer();
        var currentLocation = new XspWeb.Controls.GISControl.Common.Point(pointLongitude, pointLatitude);

        var commonLayers = this.GetUserLayerList();
        var isOk = true;
        for (var j = 0; (j < commonLayers.Length()) && isOk; ++j) {
            var layer1 = commonLayers.Get(j);
            for (var i = 0; i < layer1.mLastElementList.Length() && isOk; ++i) {
                var baseStation = layer1.mLastElementList.Get(i);
                var sectorList = baseStation.GetSectorList();
                for (var k = 0; k < sectorList.Length() && isOk; ++k) {
                    var sector = sectorList.Get(k);
                    // 判断 信息是否与基站信息匹配,匹配成功画线
                    if (sector.GetId() == cellId) {
                        var line = new XspWeb.Controls.GISControl.Element.BaseStationLine(layer);
                        var color = "rgb(" + (rgbRed * 100) + "%, " + (rgbGreen * 100) + "%, " + (rgbBlue * 100) + "%)";
                        line.SetStrokeColor(color);
                        line.SetStartPoint(currentLocation);

                        var center = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                            layer1.mProjectionType,
                            XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                            sector.mCenterPoint,
                            layer1.mScale
                        );

                        var p = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                            XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                            layer1.mProjectionType,
                            center,
                            layer1.mScale
                        );

                        var longLat = new XspWeb.Controls.GISControl.Common.Point(p.mLongitude, p.mLatitude);

                        line.SetAdjustAngle(sector.mAdjustAngle);
                        line.SetAzimuth(sector.mAzimuth);
                        line.SetAdjustRadius(sector.mRadius);
                        line.SetEndPoint(longLat);
                        this.AddLayerElement(layer, line);
                        isOk = false;
                    }
                }
            }
        }
        layer.Update();
    },

    /**
     * 导入基站
     *
     * @param Array baseStationStr 基站数组
     */
    ImportBaseStation: function (baseStationStr) {
        var baseStationJson = eval('(' + baseStationStr + ')');
        var layer = this.GetBaseStationLayer();

        var baseStation = new XspWeb.Controls.GISControl.Element.BaseStation(layer);
        baseStation.SetMessage(baseStationJson.Name);
        var self = this;
        // 添加基站的点击事件
        baseStation.SetOnClickHandler(function (point) {
            var layer = self.GetLineToBaseStationLayer();

            var p = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetCenterByArea(this.mArea),
                this.mLayer.mScale
            );

            // 添加标注
            var element = new XspWeb.Controls.GISControl.Element.Popup(layer);
            element.SetTopPoint(new XspWeb.Controls.GISControl.Common.Point(p.mLongitude, p.mLatitude));
            element.SetTextMaxLineWidth(250);
            element.SetTextLineHeight(15);
            element.SetSubject(this.mMessage);
            element.SetSubjectSize(11);
            element.SetSubjectColor("black");
            element.SetRectangleAlpha(0.8);
            for (var i = 0; i < this.mSectorList.Length(); i++) {
                var sector = this.mSectorList.Get(i);
                element.AddTextRow(sector.mMessage);
                element.AddTextFontSize(11);
                element.AddTextFillColor(sector.mFillColor);
            }
            self.AddLayerElement(layer, element);
            layer.mLastPopupElement = element;
            layer.Update();
        });

        var sectorList = new XspWeb.Core.List();
        var longitude = baseStationJson.Longitude;
        var latitude = baseStationJson.Latitude;
        for (var j = 0; j < baseStationJson.Color.length; j++) {
            var rgbRed = baseStationJson.Color[j][0] * 100;
            var rgbGreen = baseStationJson.Color[j][1] * 100;
            var rgbBlue = baseStationJson.Color[j][2] * 100;
            var color = "rgb(" + rgbRed + "%, " + rgbGreen + "%, " + rgbBlue + "%)";
            var info = baseStationJson.Info[j];
            var azimuth = baseStationJson.Azimuth[j];
            var cellId = baseStationJson.CellId[j];

            var element = new XspWeb.Controls.GISControl.Element.Sector(layer);
            element.SetRadius(25);
            element.SetAngle(40);
            element.SetAdjustAngle(-90);
            element.SetFillColor(color);
            element.SetAzimuth(azimuth);
            element.SetMessage(info);
            element.SetId(cellId);
            var point = new XspWeb.Controls.GISControl.Common.Point(longitude, latitude);
            element.SetCenterPoint(point);
            sectorList.Add(element);
        }
        baseStation.SetSectorList(sectorList);
        this.AddLayerElement(layer, baseStation);
    },

    /**
     * 设置当前位置
     *
     * @param Double longitude 经度
     * @param Double latitude 纬度
     * @param Double radius 点半径
     * @param Double rgbRed rgb红色色分量
     * @param Double rgbGreen rgb绿色分量
     * @param Double rgbBlue rgb蓝色分量
     */
    SetCurrentLocation: function (longitude, latitude, radius, rgbRed, rgbGreen, rgbBlue) {
        var layer = this.GetCurrentLayer();
        if (!layer)
            throw $.AResult.AE_INVALIDARG();

        layer.BeginLock();
        var element = new XspWeb.Controls.GISControl.Element.Point(layer);
        element.SetRadius(radius);
        var color = "rgb(" + (rgbRed * 100) + "%, " + (rgbGreen * 100) + "%, " + (rgbBlue * 100) + "%)";
        element.SetFillColor(color);
        element.SetCenterPoint(new XspWeb.Controls.GISControl.Common.Point(longitude, latitude));
        this.AddLayerElement(layer, element);

        // 设置中心点
        this.SetMapCenterLongLat(longitude, latitude);

        layer.EndLock();
        layer.Update();
    },

    /**
     * 设置当前位置图片
     *
     * @param String imageName 文件名
     * @param Double longitude 经度
     * @param Double latitude 纬度
     */
    SetLocationImage: function (imageName, longitude, latitude) {
        var layer = this.GetCurrentLayer();
        var image = new XspWeb.Controls.GISControl.Element.Image(layer);
        image.SetUrl("Images/" + imageName);
        image.SetCenterPoint(new XspWeb.Controls.GISControl.Common.Point(longitude, latitude));
        image.SetWidth(40);
        image.SetHeight(40);
        this.AddLayerElement(layer, image);
        layer.Update();
    },

    /**
     * 锁定控件
     */
    BeginLockMap: function () {
        var layerList = this.GetLayerList();
        for (var i = 0; i < layerList.Length(); i++) {
            layerList.Get(i).BeginLock();
        }
    },

    /**
     * 解锁控件
     */
    EndLockMap: function () {
        var layerList = this.GetLayerList();
        for (var i = 0; i < layerList.Length(); i++) {
            layerList.Get(i).EndLock();
        }
    },

    /**
     * 更新控件
     */
    UpdateMap: function () {
        this.Update();
    },

    /**
     * 锁定基站图层
     */
    BeginLockBaseStationLayer: function () {
        var layer = this.GetBaseStationLayer();
        layer.BeginLock();
    },

    /**
     * 解锁基站图层
     */
    EndLockBaseStationLayer: function () {
        var layer = this.GetBaseStationLayer();
        layer.EndLock();
    },

    /**
     * 更新基站图层
     */
    UpdateBaseStationLayer: function () {
        var layer = this.GetBaseStationLayer();
        layer.Update();
    },

    /**
     * 清空基站图层
     */
    ClearBaseStation: function () {
        var layer = this.GetBaseStationLayer();
        layer.Clear();
        layer.Update();
    },

    /**
     * 清空位置
     */
    ClearLocation: function () {
        // 清空位置
        var layer = this.GetCurrentLayer();
        layer.Clear();
        layer.Update();
    },

    /**
     * 清空基站的连线
     */
    ClearBaseStationLine: function () {
        // 清空基站拉线
        var layer = this.GetLineToBaseStationLayer();
        layer.Clear();
        layer.Update();
    },

    /**
     * 更新
     */
    UpdateByZoomAndScale: function () {
        var scale = this.GetScale();
        var level = XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetLevelByScale(scale);

        var zoom = this.GetZoom();
        if (((level <= this.mMinLevel) && (zoom > 1)) || ((level >= this.mMaxLevel) && (zoom < 1))) {
            this.SetZoom(1.0);
            return;
        }
        // 1. 0.75 ~ 1 level 不变 当前图层放大

        // 2. 0.5 ~ 0.75 level++ 目标图层缩小  zoom = 1.5 + ((zoom - 0.75) * 2);
        if ((zoom > 0.5) && (zoom <= 0.75)) {
            level++;
            if (level >= this.mMaxLevel) {
                level = this.mMaxLevel;
                zoom = 1.0;
            }
            else
                zoom = 1.5 + ((zoom - 0.75) * 2);
        }
        // 3. 0.25 ~ 0.5 level+1 目标图层放大 zoom = 1.0 - (0.5 - zoom) * 2;
        else if ((zoom > 0.25) && (zoom <= 0.5)) {
            level += 1;
            if (level >= this.mMaxLevel) {
                level = this.mMaxLevel;
                zoom = 1.0;
            }
            else
                zoom = 1.0 - (0.5 - zoom) * 2;
        }
        // 4. 0 ~ 0.25 level+2 目标图层放大 zoom = 1.0 + (0.25 - zoom) * 4;
        else if ((zoom > 0) && (zoom <= 0.25)) {
            level += 2;
            if (level >= this.mMaxLevel) {
                level = this.mMaxLevel;
                zoom = 1.0;
            }
            else
                zoom = 1.0 - (0.25 - zoom) * 4;
        }

        //  5. 1 ~ 1.5 level 不变 当前图层缩小

        // 6. 1.5 ~ 2 level-- 目标图层放大
        else if ((zoom >= 1.5) && (zoom <= 2)) {
            level--;
            if (level <= this.mMinLevel) {
                level = this.mMinLevel;
                zoom = 1.0;
            }
            else
                zoom = 1.0 - ((2 - zoom) / 2);
        }
        // 7. 2 ~ 2.5 level-- 目标图层缩小 zoom =1.0 + (zoom - 2) / 2;
        else if ((zoom >= 2) && (zoom <= 2.5)) {
            level--;
            if (level <= this.mMinLevel) {
                level = this.mMinLevel;
                zoom = 1.0;
            }
            else
                zoom = 1.0 + (zoom - 2) / 2;
        }
        // 8. 2.5 ~ 3 level-2 目标图层放大
        else if (zoom > 2) {
            level -= 2;
            if (level <= this.mMinLevel) {
                level = this.mMinLevel;
                zoom = 1.0;
            }
            else
                zoom = 1.0 - ((3 - zoom) / 2);
        }

        this.SetZoom(zoom);
        this.SetScale(XspWeb.Controls.GISControl.Projections.CoordinateConverter.GetScaleByLevel(level));
        this.OnZoomToLevelHandler(level, zoom);
    }
});