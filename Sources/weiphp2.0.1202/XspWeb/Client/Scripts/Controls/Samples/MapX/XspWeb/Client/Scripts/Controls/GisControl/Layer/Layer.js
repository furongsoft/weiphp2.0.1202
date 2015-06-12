/**
 * Created by Alex on 2015/3/12.
 */
(function (window, $, namespace) {
    /**
     * 定义图层类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.LayerType", {
        Static: {
            OnlineMap: 0, // 在线地图
            OfflineMap: 1, // 离线地图
            Normal: 2 // 普通地图
        }
    });

    /**
     * 定义图层接口
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Layer.Layer", {

        /**
         * 构造函数
         *
         * @param XspWeb.Controls.GISControl.Renderable.Renderable renderable 可渲染对象
         */
        Constructor: function (renderable) {
            if (!renderable)
                throw $.AResult.AE_INVALIDARG();

            this.Super();

            /**
             * 可渲染对象
             */
            this.mRenderable = renderable;

            /**
             * 图层名称
             */
            this.mName = "";

            /**
             * 图层类型
             */
            this.mLayerType = null;

            /**
             * 获取和设置是否显示
             */
            this.mIsVisible = true;

            /**
             * 获取和设置是否可编辑
             */
            this.mIsEditable = true;

            /**
             * 是否上锁图层
             */
            this.mIsLocked = false;

            /**
             * 缩放比率
             */
            this.mZoom = 1.0;

            /**
             * 大小尺寸
             */
            this.mSize = new XspWeb.Controls.GISControl.Common.Size();

            /**
             * 显示区域
             */
            this.mViewArea = new XspWeb.Controls.GISControl.Common.Rectangle();

            /**
             * 元素列表
             */
            this.mElementList = new XspWeb.Core.List();
        },

        /**
         * 获取图层是否可见
         *
         * @returns Boolean 是否可见
         */
        GetVisible: function () {
            return this.mIsVisible;
        },

        /**
         * 设置图层是否可见
         *
         * @param Boolean isVisible 是否可见
         */
        SetVisible: function (isVisible) {
            if (this.mIsVisible === isVisible)
                return;

            this.mIsVisible = isVisible;
            this.Update();
        },

        /**
         * 获取图层是否可编辑
         *
         * @returns Boolean 是否可编辑
         */
        GetEditable: function () {
            return this.mIsEditable;
        },

        /**
         * 设置图层是否可编辑
         *
         * @param Boolean isEditable 是否可编辑
         */
        SetEditable: function (isEditable) {
            this.mIsEditable = isEditable;
        },

        /**
         * 上锁图层
         */
        BeginLock: function () {
            this.mIsLocked = true;
        },

        /**
         * 解锁图层
         */
        EndLock: function () {
            this.mIsLocked = false;
        },

        /**
         * 获取缩放比率
         *
         * @returns Double 缩放比率
         */
        GetZoom: function () {
            return this.mZoom;
        },

        /**
         * 设置缩放比率
         *
         * @param Double zoom 缩放比率
         */
        SetZoom: function (zoom) {
            this.mZoom = zoom;
            this.Update();
        },

        /**
         * 获取大小尺寸
         *
         * @returns Double 大小尺寸
         */
        GetSize: function () {
            return this.mSize;
        },

        /**
         * 设置大小尺寸
         *
         * @param Double size 大小尺寸
         */
        SetSize: function (size) {
            this.mSize = size;
            this.Update();
        },

        /**
         * 获取显示区域
         *
         * @returns XspWeb.Controls.GISControl.Common.Rectangle 显示区域
         */
        GetViewArea: function () {
            return this.mViewArea;
        },

        /**
         * 设置显示区域
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 显示区域
         */
        SetViewArea: function (rect) {
            this.mViewArea = rect;
            this.Update();
        },

        /**
         * 添加元素
         *
         * @param IElement element 元素
         * @returns Boolean 是否添加成功
         */
        AddElement: function (element) {
        },

        /**
         * 删除元素
         *
         * @param IElement element 元素
         * @returns Boolean 是否删除成功
         */
        DeleteElement: function (element) {
        },

        /**
         * 通过屏幕坐标获取元素
         *
         * @param XspWeb.Controls.GISControl.Common.Point point 屏幕坐标
         * @returns List<IElement> 有交集的元素列表
         */
        GetElementsByCoordinate: function (point) {
        },

        /**
         * 通过屏幕坐标获取顶层元素
         *
         * @param XspWeb.Controls.GISControl.Common.Point point 屏幕坐标
         * @returns IElement 有交集的顶层元素列表
         */
        GetTopElementByCoordinate: function (point) {
        },

        /**
         * 通过经纬度获取元素
         *
         * @param XspWeb.Controls.GISControl.Common.LongLatPoint longitudeAndLatitude 经纬度
         * @returns List<IElement> 有交集的元素列表
         */
        GetElementsByLongitudeAndLatitude: function (longitudeAndLatitude) {
        },

        /**
         * 通过经纬度获取顶层元素
         *
         * @param XspWeb.Controls.GISControl.Common.LongLatPoint longitudeAndLatitude 经纬度
         * @returns IElement 有交集的顶层元素列表
         */
        GetTopElementByLongitudeAndLatitude: function (longitudeAndLatitude) {
        },

        /**
         * 根据元素索引查找元素
         *
         * @param Int32 id 元素索引
         * @returns IElement 元素
         */
        GetElementById: function (id) {
        },

        /**
         * 移动元素
         *
         * @param Int32 oldId 要移动的元素索引
         * @param Int32 newId 移动至新的索引
         * @returns Boolean 是否移动成功
         */
        MoveElement: function (oldId, newId) {
        },

        /**
         * 清空图层中所有元素
         */
        Clear: function () {
        },

        /**
         * 更新区域
         */
        Update: function () {
            if (this.mIsLocked)
                return;

            var rect = XspWeb.Controls.GISControl.Projections.ScreenToLayerProjection.ToRect(
                new XspWeb.Controls.GISControl.Common.Rectangle(0, 0, this.mSize.mWidth, this.mSize.mHeight), this
            );

            if (this.OnPrepare(rect))
                this.InvalidateRect(rect);
        },

        /**
         * 更新区域
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 矩形区域
         */
        UpdateRect: function (rect) {
            if (this.mIsLocked)
                return;

            rect = XspWeb.Controls.GISControl.Projections.ScreenToLayerProjection.ToRect(rect, this);
            if (this.OnPrepare(rect))
                this.InvalidateRect(rect);
        },

        /**
         * 设置无效区域
         */
        Invalidate: function () {
            if (this.mIsLocked)
                return;

            var rect = XspWeb.Controls.GISControl.Projections.ScreenToLayerProjection.FromRect(this.mViewArea, this);
            this.mRenderable.InvalidateRect(this, rect);
        },

        /**
         * 设置无效区域
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 无效矩形区域
         */
        InvalidateRect: function (rect) {
            if (this.mIsLocked)
                return;

            rect = XspWeb.Controls.GISControl.Projections.ScreenToLayerProjection.FromRect(rect, this);
            this.mRenderable.InvalidateRect(this, rect);
        },

        /**
         * 准备绘制事件处理函数
         *
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 绘制矩形区域
         * @returns Boolean 是否准备成功
         */
        OnPrepare: function (rect) {
            return true;
        },

        /**
         * 绘制事件处理函数
         *
         * @param XspWeb.Controls.GISControl.Renderable.Renderable renderable 可渲染对象
         * @param XspWeb.Controls.GISControl.Common.Rectangle rect 绘制矩形区域
         */
        OnPaint: function (renderable, rect) {
        },

        /**
         * 单击事件处理函数
         *
         * @param Double x 单击点的 屏幕 x 轴坐标
         * @param Double y 单击点的 屏幕 y 轴坐标
         */
        OnClickHandler: function (x, y) {
        },

        /**
         * 双击事件处理函数
         *
         * @param Double x 双击点的 x 轴坐标
         * @param Double y 双击点的 y 轴坐标
         */
        OnDBlclickHandler: function (x, y) {
        },

        /**
         * 移动事件处理函数
         *
         * @param Double offsetX x轴偏移量
         * @param Double offsetY y轴偏移量
         */
        OnMoveHandler: function (offsetX, offsetY) {
        },

        /**
         * 延迟加载
         *
         * @param Double timeout 延迟时间
         * @param function handler 处理函数
         * @param Array args 参数
         */
        LazyLoad: function (timeout, handler, args) {
            this.mRenderable.LazyLoad(timeout, this, handler, args);
        }
    });
})(window, jQuery, $.Namespace());