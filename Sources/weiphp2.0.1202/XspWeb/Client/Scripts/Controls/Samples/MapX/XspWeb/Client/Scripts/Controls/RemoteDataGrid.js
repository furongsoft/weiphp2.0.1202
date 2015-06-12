(function(window, $, namespace) {

    /**
     * 创建自定义显示列工具栏按钮
     * 
     * @param {Object}
     *        dataGrid RemoteDataGrid实例对象
     * @param {Array}
     *        columns 需自定义是否显示的列
     * @param {String}
     *        legend 标题说明
     * @param {Boolean}
     *        showDelimiter 工具栏按钮前面是否显示分隔符
     */
    function CreateCustomDisplayColumnToolbar(dataGrid, columns, legend, showDelimiter) {
        if (!(dataGrid && columns && columns.length))
            return;

        legend = legend || '';
        showDelimiter = showDelimiter || true;

        // 创建选择列容器
        var wrap;
        if (legend) {
            wrap = $('<fieldset></fieldset>');
            wrap.append('<legend>' + legend + '</legend>');
        }
        else {
            wrap = $('<div style="padding: 0 5px; overflow: hidden;"></div>');
        }

        // 创建选择列选项
        var table = $('<table><tr></tr></table>');
        var i, length = columns.length, column;
        var j, cols = (length / 5 | 0) || 1;
        var tableBody = [], checked;
        var id = dataGrid.mObject.attr('id') || 'datagridId';

        // 全选按钮
        var checkAll = null, isAllChecked = true;
        if (length) {
            checkAll = $('<input type="checkbox" id="_chkAll_' + id + '" />');
            checkAll.click(function() {
                var $this = $(this);
                var checked = $this.is(":checked");
                $this.parent().parent().parent().find('input:checkbox').attr("checked", checked);
            });

            table.append('<tr><td></td><td colspan="' + cols + '"><label for="_chkAll_' + id + '">全选</label></td></tr>');
            table.find('tr td:first-child').append(checkAll);
        }

        for (i = 0; i < length;) {
            tableBody.push('<tr>');
            for (j = cols; j > 0; j--) {
                column = columns[i];

                if (column) {
                    checked = (column["hidden"] == true) ? '' : 'checked="checked"';
                    if (!checked)
                        isAllChecked = false;

                    tableBody.push('<td>');
                    tableBody.push('<input type="checkbox" id="chkIsShow' + column.field + id + '" name="' + column.field + '" ' + checked + ' />');
                    tableBody.push('</td><td>');
                    tableBody.push('<label for="chkIsShow' + column.field + id + '">' + column.title + '</label>');
                    tableBody.push('</td>');
                }
                else {
                    tableBody.push('<td></td><td></td>');
                }

                i++;
            }
            tableBody.push('</tr>');
        }

        if (checkAll) {
            checkAll.attr("checked", isAllChecked);
        }

        table.append(tableBody.join(''));

        // 创建显示按钮
        var button = $('<a class="l-btn" href="javascript:void(0)" group=""><span class="l-btn-left"><span class="l-btn-text">显示</span></span></a>');
        button.click(function() {
            wrap.find("input:checkbox").each(function() {
                var field = $(this);
                var name = $(this).attr("name");
                if (name)
                    dataGrid.HideColumn(name, !field.is(":checked"));
            });
            $('#showFields_' + id).tooltip('hide');
        });

        // 创建关闭显示框按钮
        var btnCancel = $('<a class="l-btn" href="javascript:void(0)" group=""><span class="l-btn-left"><span class="l-btn-text">关闭</span></span></a>');
        btnCancel.click(function() {
            $('#showFields_' + id).tooltip('hide');
        });

        wrap.append(table).append(button).append(btnCancel).appendTo(window.document.body);

        // 创建工具栏按钮
        var toolbar = [];
        if (showDelimiter) {
            toolbar.push('-');
        }
        toolbar.push({
            id: 'showFields_' + id,
            text: '显示字段',
            iconCls: 'icon-edit',
            handler: wrap
        });

        return toolbar;
    }

    $.DeclareClass("XspWeb.Controls.RemoteDataGrid", {

        // 包容对象
        mObject: null,

        // 远程服务URL
        mUrl: null,

        // 添加行完成事件代理
        mOnAddRowCompleteHandler: null,

        // 删除行完成事件代理
        mOnDeleteRowCompleteHandler: null,

        // 修改行完成事件代理
        mOnEditRowCompleteHandler: null,

        // 保存修改完成事件代理
        mOnSaveChangesCompleteHandler: null,

        // 导出列表到 Excel 完成事件代理
        mOnExportToExcelCompleteHandler: null,

        /**
         * 初始化DataGrid
         * 
         * @param {String}
         *        selector DOM选择器
         * @param {String}
         *        url 远程服务URL
         * @param {Object}
         *        options DataGrid初始化属性
         * @return this
         */
        Initialize: function(selector, url, options) {

            if (!(selector && url)) {
                $.Assert("invalid argument");
                return this;
            }

            // 寻找指定对象
            this.mObject = $(selector);
            if (!(this.mObject && this.mObject.length)) {
                $.Assert("Object not found!");
                return this;
            }

            options = options || {};
            var opts = $.extend({}, {
                loadMsg: "数据加载中,请稍后...",
                fitColumns: true,
                autoRowHeight: false,
                pageNumber: 1,
                resizable: true,
                pageSize: 20,
                pagination: true,
                idField: "ID",
                pageList: [10, 20, 50, 100],
                singleSelect: true,
                checkOnSelect: false,
                selectOnCheck: false,
                fit: true,
                toolbar: null,
                showRefresh: true,
                showPageList: true
            }, options);

            // 加载默认配置
            this.mObject.datagrid(opts);

            // 保存远程服务URL
            this.mUrl = url;

            return this;
        },

        /**
         * 设置表格列信息
         * 
         * @param {Array}
         *        columns 表格列信息，该配置继承 EasyUI datagrid 组件的 Columns 属性配置，并新增以下属性： ContentType 单元格内容类型，可以配置为 button/text，默认为 text： button 为按钮列，可指定名称text及事件handler；text为字段列，取数据源中field字段的值. text ContentType 类型为 button 时的按钮名称. handler ContentType 类型为 button 时点击事件函数，拥有三个参数：rowIndex,row,value. CustomDisplay 该列是否可以自定义是否显示，配置为true时，工具栏增加显示字段按钮，用来控制该列显示.
         * @return this
         */
        SetColumns: function(columns) {
            var mObj = this.mObject;
            if (!mObj)
                return this;

            if (!(columns && columns.length && columns[0].length))
                return this;

            var opts = mObj.datagrid("options");

            // 解析特殊列
            var i, length, j, fieldCount, column, buttonColumns = [], customDisplayColumns = [], customDispalyColumnTitle;
            for (i = 0, length = columns.length; i < length; i++) {
                for (j = 0, fieldCount = columns[i].length; j < fieldCount; j++) {
                    column = columns[i][j];

                    // 未设置表头对齐方式情况下，表头和内容都默认居中
                    if (!column["halign"])
                        column["align"] = column["align"] || "center";

                    // 按钮列处理
                    if (column["ContentType"] == "button") {
                        column["width"] = column["width"] || 40;

                        formatter = column["formatter"];
                        if (typeof formatter != "function") {
                            column["formatter"] = function(v, row, index) {
                                if (this.text)
                                    return ("<a href='javascript:;'>" + this.text + "</a>");
                                else if (v)
                                    return ("<a href='javascript:;'>" + v + "</a>");
                                else
                                    return v;
                            };
                        }
                        buttonColumns.push(column);
                    }

                    // 自定义显示列
                    if ((opts.customDisplayLegend != false) && (typeof column["CustomDisplay"] != "undefined")) {
                        customDispalyColumnTitle = column["title"];
                        if (typeof column["CustomDisplay"] === "string") {
                            customDispalyColumnTitle = column["CustomDisplay"];
                        }

                        customDisplayColumns.push({
                            field: column["field"],
                            title: customDispalyColumnTitle,
                            hidden: column["hidden"]
                        });
                    }
                }
            }

            opts.columns = columns;

            // 绑定按钮列点击事件
            var onClickCell = opts.onClickCell;
            opts.onClickCell = function(rowIndex, field, value) {
                var j, l, handler;
                for (j = 0, l = buttonColumns.length; j < l; j++) {
                    if (buttonColumns[j]["field"] == field) {
                        handler = buttonColumns[j]["handler"];
                        break;
                    }
                }

                if (typeof handler === "function") {
                    var rows = $.data(mObj[0], "datagrid").data.rows;
                    handler(rowIndex, rows[rowIndex], value);
                }
                else if (typeof onClickCell === "function") {
                    onClickCell(rowIndex, field, value);
                }
            };

            mObj.datagrid(opts);

            // 自定义显示列按钮
            if (customDisplayColumns.length) {
                var showDelimiter = false;
                if (opts.toolbar && opts.toolbar.length) {
                    showDelimiter = true;
                }

                mObj.datagrid("addToolbarItem", CreateCustomDisplayColumnToolbar(this, customDisplayColumns, opts.customDisplayLegend, showDelimiter));
            }

            return this;
        },

        /**
         * 添加ToolBar
         * 
         * @param {Array}
         *        items ToolBar项配置
         */
        AddToolbarItem: function(items) {

            var mObj = this.mObject;
            if (!mObj)
                return this;

            mObj.datagrid("addToolbarItem", items);
        },

        /**
         * 设置加载完成事件代理
         * 
         * @param {Function}
         *        handler 加载完成事件代理
         * @return this
         */
        SetOnLoadCompleteHandler: function(handler) {

            if (!this.mObject)
                return this;

            var opts = this.mObject.datagrid("options");
            var onLoadSuccess = opts.onLoadSuccess;
            var onLoadError = opts.onLoadError;

            opts.onLoadSuccess = function(data) {
                if (typeof handler === "function")
                    handler(true, data);

                if (typeof onLoadSuccess === "function")
                    onLoadSuccess(data);
            };

            opts.onLoadError = function() {
                if (typeof handler === "function")
                    handler(false);

                if (typeof onLoadError === "function")
                    onLoadError();
            };

            this.mObject.datagrid(opts);

            return this;
        },

        /**
         * 设置添加行完成事件代理
         * 
         * @param {Function}
         *        handler 添加行完成事件代理
         * @return this
         */
        SetOnAddRowCompleteHandler: function(handler) {

            if (!this.mObject)
                return this;

            this.mOnAddRowCompleteHandler = handler;

            return this;
        },

        /**
         * 设置删除行完成事件代理
         * 
         * @param {Function}
         *        handler 删除行完成事件代理
         * @return this
         */
        SetOnDeleteRowCompleteHandler: function(handler) {

            if (!this.mObject)
                return this;

            this.mOnDeleteRowCompleteHandler = handler;

            return this;
        },

        /**
         * 设置保存修改完成事件代理
         * 
         * @param {Function}
         *        handler 保存修改完成事件代理
         * @return this
         */
        SetOnSaveChangesCompleteHandler: function(handler) {

            if (!this.mObject)
                return this;

            this.mOnSaveChangesCompleteHandler = handler;

            return this;
        },

        /**
         * 设置导出列表到 Excel 完成事件代理
         * 
         * @param {Function}
         *        handler 导出列表到 Excel 完成事件代理
         * @return this
         */
        SetOnExportToExcelCompleteHandler: function(handler) {

            if (!this.mObject)
                return this;

            this.mOnExportToExcelCompleteHandler = handler;

            return this;
        },

        /**
         * 设置表格数据内容
         * 
         * @param {JSON}
         *        dataSet 数据集合
         * @return this
         */
        SetDataSet: function(dataSet) {

            if (!this.mObject)
                return this;

            this.mObject.datagrid({
                data: dataSet
            });

            return this;
        },

        /**
         * 加载远程数据
         * 
         * @param {Object}
         *        params 条件参数.如果有值将替换初始化的 queryParams 参数
         * 
         * @return void
         */
        LoadRemoteData: function(params) {

            if (!this.mObject)
                return $.Assert("Object not found!");

            if (!this.mUrl)
                return $.Assert("invalid url.");

            this.mObject.datagrid("options").url = this.mUrl;
            this.mObject.datagrid("load", params);

            this.mObject.datagrid("clearSelections").datagrid("clearChecked");
        },

        /**
         * 添加行
         * 
         * @param {Object}
         *        data 行数据
         * @return void
         */
        AddRow: function(data) {
            if (!this.mUrl)
                return $.Assert("invalid url.");

            this._AjaxRequest(this.mUrl + "AddRow" + $.ServerPostfix, data, this.mOnAddRowCompleteHandler);
        },

        /**
         * 修改行
         * 
         * @param {Object}
         *        data 行数据
         * @return void
         */
        EditRow: function(data) {
            if (!this.mUrl)
                return $.Assert("invalid url.");

            this._AjaxRequest(this.mUrl + "EditRow" + $.ServerPostfix, data, this.mOnEditRowCompleteHandler);
        },

        /**
         * 删除行
         * 
         * @param {Object/String}
         *        data 要删除行的数据
         * @return void
         */
        DeleteRow: function(data) {
            var params = {};
            if (typeof data === "object") {
                params = data;
            }
            else if (typeof data === 'string') {
                params = {
                    "idList": data
                };
            }
            else {
                return $.Assert("invalid Data.");
            }
            this._AjaxRequest(this.mUrl + "DeleteRows" + $.ServerPostfix, params, this.mOnDeleteRowCompleteHandler);
        },

        /**
         * 删除选中的第一行
         * 
         * @return void
         */
        DeleteSelected: function() {
            if (!this.mObject)
                return $.Assert("Object not found!");

            var row = this.mObject.datagrid("getSelected");
            if (!row) {
                if (typeof this.mOnDeleteRowCompleteHandler === "function")
                    this.mOnDeleteRowCompleteHandler(false);
                return;
            }

            this.DeleteRow(row["Id"]);
        },

        /**
         * 删除所有选中行
         * 
         * @return void
         */
        DeleteSelections: function() {
            if (!this.mObject)
                return $.Assert("Object not found!");

            var rows = this.mObject.datagrid("getSelections");
            if (!rows || (rows.length == 0)) {
                if (typeof this.mOnDeleteRowCompleteHandler === "function")
                    this.mOnDeleteRowCompleteHandler(false);
                return;
            }

            var selections = [];
            for (var i = 0; i < rows.length; ++i) {
                selections.push(rows[i]["Id"]);
            }

            this._AjaxRequest(this.mUrl + "DeleteRows" + $.ServerPostfix, {
                "idList": selections.join(",")
            }, this.mOnDeleteRowCompleteHandler);
        },

        /**
         * 插入可编辑行
         * 
         * @param {Number}
         *        rowId 插入行索引
         * @param {JSON}
         *        rowData 可编辑行默认数据
         * @return void
         */
        InsertEditableRow: function(rowId, rowData) {
            if (!this.mObject)
                return $.Assert("Object not found!");

            this.mObject.datagrid("insertRow", {
                index: rowId,
                row: rowData
            });

            this.BeginEdit(rowId);
        },

        /**
         * 删除所有可编辑行
         * 
         * @return void
         */
        RemoveCheckedRow: function() {
            if (!this.mObject)
                return $.Assert("Object not found!");

            var rows = this.mObject.datagrid("getChecked");
            if (!rows || (rows.length == 0))
                return;

            for (var i = rows.length - 1; i >= 0; i--) {
                var rowId = this.mObject.datagrid("getRowIndex", rows[i]);
                this.mObject.datagrid("deleteRow", rowId);
            }
        },

        /**
         * 开始编辑行
         * 
         * @param {Number}
         *        rowId 编辑行索引
         * @return this
         */
        BeginEdit: function(rowId) {
            if (!this.mObject)
                return this;

            this.mObject.datagrid("beginEdit", rowId);

            return this;
        },

        /**
         * 停止所有行编辑
         * 
         * @return {Object} 返回所有编辑行数据
         */
        EndEdit: function() {
            if (!this.mObject)
                return this;

            var rows = this.mObject.datagrid("getRows");
            for (var i = 0; i < rows.length; ++i) {
                this.mObject.datagrid("endEdit", i);
            }

            return rows;
        },

        /**
         * 取消当前行编辑
         * 
         * @return this
         */
        CancelEdit: function() {
            if (!this.mObject)
                return this;

            var row = this.mObject.datagrid("getSelected");
            if (row) {
                var rowId = this.mObject.datagrid("getRowIndex", row);
                this.mObject.datagrid("cancelEdit", rowId);
            }

            return this;
        },

        /**
         * 保存表格所有修改
         * 
         * @return void
         */
        SaveChanges: function() {
            this.EndEdit();

            if (!this.mObject.datagrid("getChanges").length) {
                if (typeof this.mOnSaveChangesCompleteHandler === "function")
                    this.mOnSaveChangesCompleteHandler(false);
                return;
            }

            var inserted = this.mObject.datagrid("getChanges", "inserted");
            var deleted = this.mObject.datagrid("getChanges", "deleted");
            var updated = this.mObject.datagrid("getChanges", "updated");

            var effectRow = new Object();
            if (inserted.length)
                effectRow["inserted"] = JSON.stringify(inserted);

            if (deleted.length)
                effectRow["deleted"] = JSON.stringify(deleted);

            if (updated.length)
                effectRow["updated"] = JSON.stringify(updated);

            this.AjaxRequest(this.mUrl + "SaveChanges" + $.ServerPostfix, effectRow, this.mOnSaveChangesCompleteHandler);
        },

        /**
         * 获取 DataGrid 元素对象
         * 
         * @return Object
         */
        GetPanel: function() {
            if (!this.mObject)
                return $.Assert("Object not found!");

            return this.mObject.datagrid('getPanel');
        },

        /**
         * 获取选中第一行的单元格信息
         * 
         * @param {String}
         *        field 单元格字段名称
         * @return Object 选中单元格信息,未选中返回空
         */
        GetSelectedCellValue: function(field) {
            var rows = this.mObject.datagrid("getSelections");
            if (!rows || (rows.length == 0))
                return undefined;

            return rows[0][field];
        },

        /**
         * 获取所有 checkbox 被勾选的行记录
         * 
         * @return Array
         */
        GetCheckedRows: function() {
            if (!this.mObject)
                return [];

            return this.mObject.datagrid('getChecked');
        },

        /**
         * 获取第一个选中行，未选择行则返回null
         * 
         * @return Object
         */
        GetSelectedRow: function() {
            if (!this.mObject)
                return null;

            return this.mObject.datagrid('getSelected');
        },

        /**
         * 获取所有选中的行记录
         * 
         * @return Array
         */
        GetSelectedRows: function() {
            if (!this.mObject)
                return [];

            return this.mObject.datagrid('getSelections');
        },

        /**
         * 清除所有选中行
         * 
         * @return void
         */
        ClearCheckedRows: function() {
            if (!this.mObject)
                return;

            this.mObject.datagrid('clearChecked');
        },

        /**
         * 清除所有选中行
         * 
         * @return void
         */
        ClearSelectedRows: function() {
            if (!this.mObject)
                return;

            this.mObject.datagrid('clearSelections');
        },

        /**
         * 选中指定行
         * 
         * @param {Number}
         *        index 行的索引，从0开始
         * @return void
         */
        SelectRow: function(index) {
            if (!this.mObject)
                return;

            this.mObject.datagrid('selectRow', index);
        },

        /**
         * 显示/隐藏指定列
         * 
         * @param {String}
         *        field 列字段名
         * @param {boolean}
         *        isShow 为true，则隐藏该列
         * @return void
         */
        HideColumn: function(field, isShow) {
            if (isShow == true) {
                this.mObject.datagrid('hideColumn', field);
            }
            else if (isShow == false)
                this.mObject.datagrid('showColumn', field);
        },

        /**
         * 刷新数据
         * 
         * @return void
         */
        Reload: function() {
            if (!this.mObject)
                return;

            this.mObject.datagrid('reload').datagrid('uncheckAll');
        },

        /**
         * 返回指定行的索引号
         * 
         * @param {Object/String}
         *        row 一行记录或一个ID字段值
         * @return 索引号
         */
        GetRowIndex: function(row) {
            if (!this.mObject)
                return;

            return this.mObject.datagrid('getRowIndex', row);
        },

        /**
         * 更新指定行
         * 
         * @param {Int}
         *        indexRow 指定行的索引号
         * @param {Object}
         *        param 更新行的新数据
         * @return void
         */
        UpdateRow: function(indexRow, param) {
            this.mObject.datagrid('updateRow', {
                index: indexRow,
                row: param
            });
        },

        /**
         * 验证指定的行
         * 
         * @param {Int}
         *        indexRow 指定行的索引号
         * @return boolen
         */
        ValidateRow: function(indexRow) {
            if (!this.mObject)
                return;

            return this.mObject.datagrid('validateRow', indexRow);
        },

        /**
         * 勾选一行
         * 
         * @param {Int}
         *        index 指定行的索引号
         * @return void
         */
        CheckRow: function(index) {
            if (!this.mObject)
                return;

            this.mObject.datagrid('checkRow', index);
        },

        /**
         * 取消勾选当前页中的所有行
         * 
         * @return object
         */
        UncheckAll: function() {
            if (!this.mObject)
                return;

            return this.mObject.datagrid('uncheckAll');
        },

        /**
         * 导出数据到 Excel
         * 
         * @param {String}
         *        下载 Excel 文件的路径，不设置则从默认路径(数据源Url+ExportToExcel,如果数据源Url以.action结尾,则在.action前加ExportToExcel)下载
         * @return void
         */
        ExportToExcel: function(url) {
            if (!this.mObject)
                return $.Assert("Object not found!");

            if (!url) {
                if (!this.mUrl)
                    return $.Assert("Invalid url.");

                url = this.mUrl;
                var actionIndex = url.lastIndexOf(".action");
                if (actionIndex != -1)
                    url = url.substring(0, actionIndex) + "ExportToExcel" + url.substring(actionIndex, url.length);
                else
                    url = url + "ExportToExcel";
            }

            var iframeId = "iframe_Export_Excel_" + parseInt(Math.random() * 10000);
            var iframe = $("<iframe>").attr({
                id: iframeId,
                name: iframeId
            }).css({
                width: 0,
                height: 0,
                display: "none"
            });

            var form = $("<form>").attr({
                target: iframeId,
                method: "post",
                action: url
            });

            var opts = this.mObject.datagrid("options");
            var queryParams = opts.queryParams;
            for ( var param in queryParams) {
                form.append($("<input>").attr({
                    name: param,
                    value: queryParams[param]
                }));
            }

            if (opts.sortName) {
                form.append($("<input>").attr({
                    name: "sort",
                    value: opts.sortName
                })).append($("<input>").attr({
                    name: "order",
                    value: opts.sortOrder
                }));
            }

            $('body').append(iframe).append(form);
            form.submit();
            form.remove();

            if (typeof this.mOnExportToExcelCompleteHandler === "function")
                this.mOnExportToExcelCompleteHandler();
        },

        /**
         * AJAX请求服务
         * 
         * @param {String}
         *        action 请求服务URL
         * @param {Object}
         *        params 请求服务参数
         * @param {Function}
         *        callback 请求完成处理事件代理
         * @return void
         */
        _AjaxRequest: function(action, params, callback) {
            $.ajax({
                type: "POST",
                url: action,
                data: params,
                dataType: "json",
                success: function(data, textStatus) {
                    if (data && data.success) {
                        if (typeof callback === "function")
                            callback(true, data, params);
                    }
                    else {
                        callback(false, data, params);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof callback === "function")
                        callback(false, null, params);
                }
            });
        }
    });
})(window, jQuery, $.Namespace());