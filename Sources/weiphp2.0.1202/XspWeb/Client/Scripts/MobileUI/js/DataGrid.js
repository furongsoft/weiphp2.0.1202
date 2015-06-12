/**
 * Created by Chenfq on 2015/4/23.
 */
(function (window, $, namespace) {
    /**
     *  <div id="Grid" class="mui-datagrid-content" style="width: 500px; height: 200px;">
     *     <div style="overflow-x: hidden; width: 500px;">
     *          <table class="mui-datagrid-view" style="width: 500px;">
     *              <tr class="mui-datagrid-bold-view-cell">
     *                  <th id="id">ID</th>
     *                      <th id="name">名字</th>
     *                      <th id="age">年龄</th>
     *              </tr>
     *          </table>
     *      </div>
     *      <div style="overflow: auto; height: 200px; width: 500px;">
     *          <table class="mui-datagrid-view" style="width: 500px;">
     *              <tr class="mui-datagrid-view-cell">
     *                  <td width="96">cxh</td>
     *                  <td width="202">man</td>
     *                  <td width="202">1</td>
     *              </tr>
     *              <tr>
     *                  <td>cxh23</td>
     *                  <td>man</td>
     *                  <td>21</td>
     *              </tr>
     *              <tr class="mui-datagrid-view-cell">
     *                  <td>cxh434</td>
     *                  <td>man53</td>
     *                  <td>8</td>
     *              </tr>
     *          </table>
     *      </div>
     *  </div>
     */

    $.DeclareClass("XspWeb.Controls.MobileUI.DataGrid", XspWeb.Controls.MobileUI.Grid, {
        Static: {
            /**
             *
             * @param Object parent
             * @param var id
             * @param String width
             * @param String height
             * @param gridItemAdapter
             * @returns {*}
             * @constructor
             */
            Create: function (parent, id, width, height, gridItemAdapter) {
                // 创建主DIV
                var control = document.createElement("div");
                control.id = id;
                control.className = "mui-datagrid-content";
                control.style.width = width;
                control.style.height = height;

                // 表头
                var columnSetDiv = document.createElement("div");
                columnSetDiv.style.overflowX = "hidden";

                var columnSetTable = document.createElement("table");
                columnSetTable.className = "mui-datagrid-view";

                columnSetDiv.appendChild(columnSetTable);
                control.appendChild(columnSetDiv);

                // 数据源
                var dataSourceDiv = document.createElement("div");
                dataSourceDiv.style.overflow = "auto";
                dataSourceDiv.onscroll = function () {
                    columnSetDiv.scrollLeft = dataSourceDiv.scrollLeft;
                };

                var dataSourceTable = document.createElement("table");
                dataSourceTable.className = "mui-datagrid-view";

                dataSourceDiv.appendChild(dataSourceTable);
                control.appendChild(dataSourceDiv);

                if (parent)
                    parent.appendChild(control);

                var grid = new XspWeb.Controls.MobileUI.DataGrid(control, gridItemAdapter);
                grid.Refresh();

                return grid;
            }
        },

        /**
         * 构造函数
         *
         * @param VAR control 控件索引或DOM节点对象
         */
        Constructor: function (control, gridItemAdapter) {
            this.Super(control, gridItemAdapter);

            /**
             * 表头集合
             */
            this.mColumnSet = null;

            /**
             * 数据源集合
             */
            this.mDataSource = null;

            /**
             * 表头默认显示
             */
            this.mColumnSetVisible = true;

            /**
             * 复选框默认显示
             */
            this.mCheckBoxVisible = true;

            /**
             * datadrid中的table
             */
            this.mControlTable = this.mControl.querySelectorAll("table");

            /**
             * datadrid中的div
             */
            this.mControlDiv = this.mControl.querySelectorAll("div");

            /**
             * 复选框集合
             */
            this.mDatagridViewCell = this.mControl.querySelectorAll("[name=mui-datagrid-view-checkbox]");
        },

        /**
         * 刷新表头
         */
        RefreshColumnSet: function () {
            if (!this.mColumnSet)
                throw $.AResult.AE_INVALIDARG();

            this.mControlDiv[0].style.width = this.mControl.style.width;
            if (this.mColumnSet.GetTotalWidth() === "0px")
                this.mControlTable[0].style.width = this.mControl.style.width;
            else
                this.mControlTable[0].style.width = this.mColumnSet.GetTotalWidth();

            // 获取datagrid字段值数组
            var fields = this.mColumnSet.GetField();

            // 获取datagrid字段名称数组
            var titles = this.mColumnSet.GetTitle();

            // 生成表头
            var columnSetTR = document.createElement("tr");
            columnSetTR.className = "mui-datagrid-bold-view-cell";

            if (this.mCheckBoxVisible) {
                var checkBoxTH = document.createElement("th");
                checkBoxTH.className = "mui-datagrid-checkbox";
                var columnSetCheckBox = document.createElement("input");
                columnSetCheckBox.setAttribute("type", "checkbox");
                checkBoxTH.appendChild(columnSetCheckBox);
                columnSetTR.appendChild(checkBoxTH);
                // 表头复选框选中事件
                columnSetCheckBox.onclick = function () {
                    var viewCheckbox = document.getElementsByName("mui-datagrid-view-checkbox");
                    if (columnSetCheckBox.checked) {
                        for (var i = 0; i < viewCheckbox.length; i++) {
                            viewCheckbox[i].checked = true;
                        }
                    } else {
                        for (var i = 0; i < viewCheckbox.length; i++) {
                            viewCheckbox[i].checked = false;
                        }
                    }
                };
            }

            // 遍历表头字段数组，增加表头
            for (var i in fields) {
                var columnSetTH = document.createElement("th");
                columnSetTH.innerHTML = titles[i];
                columnSetTH.id = fields[i];

                if (this.mColumnSet.GetWidth())
                    columnSetTH.style.width = this.mColumnSet.GetWidth()[i] + "px";

                columnSetTR.appendChild(columnSetTH);
            }

            // 如果有设置mColumnSetVisible 为false则隐藏表头
            if (!this.mColumnSetVisible)
                this.mControlDiv[0].style.display = "none";

            this.mControlTable[0].appendChild(columnSetTR);
            this.mControlDiv[0].appendChild(this.mControlTable[0]);

            this.mControl.appendChild(this.mControlDiv[0]);
        },

        /**
         * 刷新数据源
         * @constructor
         */
        RefreshDataSource: function () {
            if (!this.mDataSource)
                throw $.AResult.AE_INVALIDARG();

            this.mControlDiv[1].style.height = this.mControl.style.height;
            this.mControlDiv[1].style.width = this.mControl.style.width;

            if (this.mColumnSet.GetTotalWidth() === "0px")
                this.mControlTable[1].style.width = this.mControl.style.width;
            else
                this.mControlTable[1].style.width = this.mColumnSet.GetTotalWidth();

            var data = this.mDataSource.GetData(this.mColumnSet);

            for (var j in data) {
                var tRow = document.createElement("tr");

                    tRow.className = "mui-datagrid-view-cell";

                if (this.mCheckBoxVisible) {
                    var tCheckBox = document.createElement("input");
                    tCheckBox.setAttribute("type", "checkbox");
                    tCheckBox.name = "mui-datagrid-view-checkbox";
                    var checkBoxTD = document.createElement("td");
                    checkBoxTD.className = "mui-datagrid-checkbox";
                    checkBoxTD.appendChild(tCheckBox);
                    tRow.appendChild(checkBoxTD);
                }

                for (var k in data[j]) {
                    var tCell = document.createElement("td");
                    tCell.innerHTML = data[j][k];
                    if (j == 0 ) {
                        if (this.mCheckBoxVisible)
                            tCell.width = this.mControlTable[0].rows[0].cells[++k].offsetWidth;
                        else
                            tCell.width = this.mControlTable[0].rows[0].cells[k].offsetWidth;
                    }

                    tRow.appendChild(tCell);
                }

                this.mControlTable[1].appendChild(tRow);
            }

            this.mControlDiv[1].appendChild(this.mControlTable[1]);
            this.mControl.appendChild(this.mControlDiv[1]);
        },

        /**
         * 往最后增加一行并返回
         * @constructor
         */
        AddRow: function () {
            var dataSourceRow = document.createElement("tr");
            dataSourceRow.className = "mui-datagrid-view-cell";
            for (var i = 0; i < this.mControlTable[1].rows[0].cells.length; i++) {
                var dataSourceCell = document.createElement("td");
                var cellInput = document.createElement("input");
                if (i == 0 && this.mCheckBoxVisible) {
                    cellInput.setAttribute("type", "checkbox");
                    cellInput.name = "mui-datagrid-view-checkbox";
                    dataSourceCell.className = "mui-datagrid-checkbox";
                }

                cellInput.style.width = "100%";
                dataSourceCell.appendChild(cellInput);
                dataSourceRow.appendChild(dataSourceCell);
            }
            this.mControlTable[1].appendChild(dataSourceRow);

            return dataSourceRow;
        },

        /**
         * 返回选中行数据
         * @returns {Array}
         * @constructor
         */
        SelectRow: function () {
            var selectedData = [];

            for (var i in this.mDatagridViewCell) {
                if (this.mDatagridViewCell[i].checked)
                    selectedData.push(mControlTable[1].rows[i]);
            }
            return selectedData;
        },

        /**
         * 删除选中行
         * @constructor
         */
        DeleteRow: function () {
            for (var i = 0; i < this.mDatagridViewCell.length; i++) {
                if (this.mDatagridViewCell[i] && this.mDatagridViewCell[i].checked) {
                    this.mControlTable[1].removeChild(this.mDatagridViewCell[i].parentNode.parentNode);
                }
            }
        },

        GetDataSource: function () {
            return this.mDataSource;
        },

        SetDataSource: function (dataSource) {
            this.mDataSource = dataSource;
            this.RefreshDataSource();
        },

        GetColumnSet: function () {
            return this.mColumnSet;
        },

        SetColumnSet: function (columnSet) {
            this.mColumnSet = columnSet;
            this.RefreshColumnSet();
        },

        SetColumnSetVisible: function (columnSetVisible) {
            this.mColumnSetVisible = columnSetVisible;
        },

        SetCheckBoxVisible:function(checkBoxVisible){
            this.mCheckBoxVisible = checkBoxVisible;
        }
    });

})(window, jQuery, jQuery.Namespace());