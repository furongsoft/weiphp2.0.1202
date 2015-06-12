/**
 * Created by Alex on 2015/4/20.
 */
(function (window, $, namespace) {
    /**
     * Usage:
     *
     * HTML:
     * <div id="[ID]" class="mui-slider">
     *     <div class="mui-slider-group">
     *         <div class="mui-slider-item">
     *             <ul class="mui-table-view mui-grid-view mui-grid-9">
     *                 <li class="mui-table-view-cell mui-media">
     *                 </li>
     *                 <li class="mui-table-view-cell mui-media">
     *                 </li>
     *             </ul>
     *         </div>
     *     </div>
     *     <div class="mui-slider-indicator">
     *         <div class="mui-indicator mui-active"></div>
     *         <div class="mui-indicator"></div>
     *         <div class="mui-indicator"></div>
     *     </dev>
     * </div>
     */

    /**
     * 定义网格控件元素内容转换器
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.GridItemAdapter", {

        /**
         * 获取元素视图
         *
         * @param Int32 id 元素索引
         * @return VAR DOM节点对象或字符串
         */
        GetView: function (id) {
        }
    });

    /**
     * 定义网格控件
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.Grid", XspWeb.Controls.MobileUI.Control, {
        Static: {
            /**
             * 创建网格控件
             *
             * @param Object parent 父控件
             * @param String id 控件索引
             * @param Int32 columnCount 网格列数
             * @param Int32 itemCount 元素个数
             * @param Int32 itemsPerPage 每页面元素个数
             * @param XspWeb.Controls.MobileUI.GridItemAdapter gridItemAdapter 网格元素内容转换器
             * @returns XspWeb.Controls.MobileUI.Grid 按钮控件对象
             */
            Create: function (parent, id, columnCount, itemCount, itemsPerPage, gridItemAdapter) {
                var control = document.createElement("div");
                control.id = id;
                control.className = "mui-slider";

                var group = document.createElement("div");
                group.className = "mui-slider-group";

                var pages = ((itemsPerPage > 0) && (itemCount > itemsPerPage))
                    ? ((itemCount - 1) / itemsPerPage) : 1;
                for (var page = 0; page < pages; ++page) {
                    var item = document.createElement("div");
                    item.className = "mui-slider-item";

                    var ul = document.createElement("ul");
                    ul.className = "mui-table-view mui-grid-view mui-grid-9";

                    var start, end;
                    if (itemsPerPage == 0) {
                        start = 0;
                        end = itemCount;
                    }
                    else {
                        start = itemsPerPage * page;
                        end = Math.min(start + itemsPerPage, itemCount);
                    }

                    for (var i = start; i < end; ++i) {
                        var li = document.createElement("li");
                        li.className = "mui-table-view-cell mui-media";
                        ul.appendChild(li);
                    }

                    item.appendChild(ul);
                    group.appendChild(item);
                }

                control.appendChild(group);

                if (pages > 1) {
                    var indicator = document.createElement("div");
                    indicator.className = "mui-slider-indicator";

                    for (var i = 0; i < pages; ++i) {
                        var item = document.createElement("div");
                        if (i == 0)
                            item.className = "mui-indicator mui-active";
                        else
                            item.className = "mui-indicator";
                        indicator.appendChild(item);
                    }

                    control.appendChild(indicator);
                }

                if (parent)
                    parent.appendChild(control);

                var grid = new XspWeb.Controls.MobileUI.Grid(control, gridItemAdapter);
                grid.SetColumnCount(columnCount);
                grid.Refresh();

                // 注册滑动相关事件
                $.fn.slider.call($.wrap([control]));
                $.fn.scroll.call($.wrap([control]), {
                    scrollY: false,
                    scrollX: true,
                    indicators: false,
                    snap: ".mui-control-item"
                });

                return grid;
            }
        },

        /**
         * 构造函数
         *
         * @param VAR control 控件索引或DOM节点对象
         * @param XspWeb.Controls.MobileUI.GridItemAdapter gridItemAdapter 网格元素内容转换器
         */
        Constructor: function (control, gridItemAdapter) {
            this.Super(control);

            /**
             * 控件内部元素列表
             */
            this.mItems = new XspWeb.Core.List(this.mControl.querySelectorAll("li"));

            /**
             * 选择器控件
             */
            this.mIndicator = this.mControl.querySelector(".mui-slider-indicator");

            /**
             * 选择器子内部元素列表
             */
            this.mIndicatorItems = (this.mIndicator) ?
                new XspWeb.Core.List(this.mIndicator.querySelectorAll("div")) : null;

            /**
             * 页面数量
             */
            this.mPageCount = (this.mIndicator) ? this.mIndicatorItems.Length() : 1;

            /**
             * 每页面元素个数
             */
            this.mItemsPerPage = (this.mPageCount == 1) ? 0 : ((this.mItems.Length() / this.mPageCount) | 0);

            /**
             * 当前页面
             */
            this.mCurrentPage = 0;

            /**
             * 网格元素内容转换器
             */
            this.mGridItemAdapter = gridItemAdapter;

            // 注册当前页面改变事件处理函数
            var self = this;
            this.mControl["OnPageChanged"] = function (currentPage) {
                self.OnPageChanged.call(self, currentPage);
            }
        },

        /**
         * 设置网格列数
         *
         * @param Int32 count 列数
         * @exceptions AE_INVALIDARG 参数错误
         */
        SetColumnCount: function (count) {
            if ((!count) || (count < 1))
                throw $.AResult.AE_INVALIDARG();

            var width = (100 / count) + "%";
            for (var i = 0; i < this.mItems.Length(); ++i) {
                this.mItems.Get(i).style.width = width;
            }
        },

        /**
         * 刷新网格控件
         */
        Refresh: function () {
            for (var i = 0; i < this.mItems.Length(); ++i) {
                var view = (this.mGridItemAdapter) ? this.mGridItemAdapter.GetView(i) : null;
                var parent = this.mItems.Get(i);
                var children = parent.childNodes;
                if ((!children) || (children[0] !== view)) {
                    while (parent.hasChildNodes())
                        parent.removeChild(parent.lastChild);

                    if (!view)
                        continue;
                    else if (typeof(view) === "object")
                        parent.appendChild(view);
                    else
                        parent.innerHTML = view;
                }
            }
        },

        /**
         * 当前页面变化事件处理函数
         *
         * @param Int32 currentPage 当前页面索引
         */
        OnPageChanged: function (currentPage) {
            this.mCurrentPage = currentPage;
        }
    });
})(window, jQuery, jQuery.Namespace());