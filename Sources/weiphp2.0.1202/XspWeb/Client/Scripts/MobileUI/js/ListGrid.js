/**
 * Created by Alex on 2015/4/20.
 */
(function (window, $, namespace) {
    /**
     * Usage:
     *
     * HTML:
     * <div id="[ID]" class="mui-control-content mui-active">
     *     <div class="mui-scroll-wrapper">
     *         <div class="mui-scroll">
     *             <ul class="mui-table-view">
     *                 <li class="mui-table-view-cell">
     *                 </li>
     *                 <li class="mui-table-view-cell">
     *                 </li>
     *             </ul>
     *         </div>
     *     </div>
     * </div>
     */

    /**
     * 定义列表网格控件
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.ListGrid", XspWeb.Controls.MobileUI.Grid, {
        Static: {
            /**
             * 创建列表网格控件
             *
             * @param Object parent 父控件
             * @param String id 控件索引
             * @param Int32 columnCount 网格列数
             * @param Int32 itemCount 元素个数
             * @param String height 控件高度
             * @param XspWeb.Controls.MobileUI.GridItemAdapter gridItemAdapter 网格元素内容转换器
             * @returns XspWeb.Controls.MobileUI.ListGrid 按钮控件对象
             */
            Create: function (parent, id, columnCount, itemCount, height, gridItemAdapter) {
                var control = document.createElement("div");
                control.id = id;
                control.className = "mui-control-content mui-active";
                control.style.height = height;

                var group = document.createElement("div");
                group.className = "mui-scroll-wrapper";

                var item = document.createElement("div");
                item.className = "mui-scroll";

                var ul = document.createElement("ul");
                ul.className = "mui-table-view mui-grid-view mui-grid-9";

                for (var i = 0; i < itemCount; ++i) {
                    var li = document.createElement("li");
                    li.className = "mui-table-view-cell mui-media";
                    ul.appendChild(li);
                }

                item.appendChild(ul);
                group.appendChild(item);
                control.appendChild(group);

                if (parent)
                    parent.appendChild(control);

                var grid = new XspWeb.Controls.MobileUI.Grid(control, gridItemAdapter);
                grid.SetColumnCount(columnCount);
                grid.Refresh();

                // 注册滑动相关事件
                $.fn.scroll.call($.wrap([group]), {
                    indicators: true //是否显示滚动条
                });

                return grid;
            }
        }
    });
})(window, jQuery, jQuery.Namespace());