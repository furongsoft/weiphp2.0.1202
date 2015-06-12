(function(window, $, namespace) {

    var defaultOptions = {
        idField: "PKID",
        treeField: "Name",
        fit: true,
        border: false,

        pagination: true,
        pageSize: 20,
        pageList: [10, 20, 50, 100],

        // 是否显示刷新按钮，默认为 false，为 true 时需配置 url 属性。
        showRefresh: false,

        // 是否级联勾选父子节点。singleSelect 为 false 时有效。
        cascadeCheck: true
    };

    // 用于判断节点是否正在异步加载子节点数据的字段名
    var isAjaxingField = 'isAjaxing';

    // 存储 treegrid 对象数据的 key
    var dataKey = 'wlantreegrid';

    /**
     * 初始化 treegrid 属性
     * 
     * @param {Object}
     *        treegrid TreeGrid对象
     * @param {JSON}
     *        options 配置属性
     */
    function mergerOpts(treegrid, options) {
        var opts = $.extend({}, defaultOptions, options);

        // 增加正在异步加载子节点标识列
        if (opts.columns && opts.columns.length) {
            opts.columns[0].push({
                field: isAjaxingField,
                hidden: true,
                rowspan: opts.columns.length
            });
        }

        var toolRefresh;

        // 工具栏增加刷新按钮
        if (opts.showRefresh) {
            toolRefresh = {
                iconCls: 'icon-refresh',
                handler: function() {
                    treegrid.LoadRemoteData();
                }
            };

            if (opts.toolbar && opts.toolbar.length) {
                opts.toolbar.insertAt(0, '-');
                opts.toolbar.insertAt(0, toolRefresh);
            }
            else
                opts.toolbar = [toolRefresh, '-'];
        }

        return opts;
    }

    /**
     * 创建自定义显示列工具栏按钮
     * 
     * @param {Object}
     *        treegrid TreeGrid实例对象
     * @param {Array}
     *        columns 需自定义是否显示的列
     * @param {String}
     *        legend 标题说明
     * @param {Boolean}
     *        showDelimiter 工具栏按钮前面是否显示分隔符
     */
    function createCustomDisplayColumnToolbar(treegrid, columns, legend, showDelimiter) {
        if (!(treegrid && columns && columns.length))
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
        var table = $('<table></table>');
        var i, length = columns.length, column;
        var j, cols = (length / 10 | 0) || 1;
        var tableBody = [], checked;
        var id = treegrid.mObject.attr('id') || 'treegridId';

        // 全选按钮
        var checkAll, isAllChecked = true;
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
                    tableBody.push('<input type="checkbox" id="_chkIsShow' + column.field + id + '" name="' + column.field + '" ' + checked + ' />');
                    tableBody.push('</td><td>');
                    tableBody.push('<label for="_chkIsShow' + column.field + id + '">' + column.title + '</label>');
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
                    treegrid.HideColumn(name, !field.is(":checked"));
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

    /**
     * 在元素上存放数据
     * 
     * @param {JQuery}
     *        $element JQuery对象
     * @param {String}
     *        dataKey 存储的数据名
     * @param {Any}
     *        value 将要存储的任意数据
     * @param {Boolean}
     *        merger 存储的数据为对象时，是否合并原先存储的数据，默认 false
     */
    function data($element, dataKey, value, merger) {
        if (!($element && $element.length && dataKey))
            return null;

        if (typeof value === 'undefined') {
            return $.data($element[0], dataKey);
        }
        else {
            if ((typeof merger === 'boolean') && merger) {
                var o = data($element, dataKey);
                value = $.extend({}, o, value);
            }

            $.data($element[0], dataKey, value);
            return $element;
        }
    }

    /**
     * 更新行的是否正在 ajax 请求子节点数据
     * 
     * @param {JQuery}
     *        $element JQuery对象
     * @param {String}
     *        idField treegrid column idField 属性
     * @param {Object}
     *        row treegrid row 对象
     * @param {Boolean}
     *        isAjaxing 是否正在请求子节点数据。默认false
     */
    function updateRowAjaxingStatus($element, idField, row, isAjaxing) {
        if (!($element && idField && row && (typeof $element.treegrid === 'function')))
            return;

        if (typeof isAjaxing != 'boolean')
            isAjaxing = false;

        row[isAjaxingField] = isAjaxing;
        $element.treegrid('update', {
            id: row[idField],
            row: row
        });

        if (isAjaxing)
            $element.treegrid('loading');
        else
            $element.treegrid('loaded');
    }

    /**
     * 发送 ajax 请求服务端数据
     * 
     * @param {JSON}
     *        opts ajax 请求参数： url：ajax 请求 URL 地址； params：ajax 请求参数；
     * @param {Function}
     *        success ajax请求成功回调函数
     * @param {Function}
     *        error ajax请求失败回调函数
     */
    function sendAjax(opts, success, error) {
        if (!(opts && opts.url))
            return;

        if (!opts.params)
            opts.params = null;

        $.ajax({
            type: 'POST',
            cache: false,
            url: opts.url,
            data: opts.params,
            timeout: timeout,
            success: function(data, textStatus) {
                if (data) {
                    try {
                        if (typeof data === 'string')
                            data = eval("(" + data + ")");

                        if (typeof success === 'function')
                            success(data, textStatus);

                        return;
                    }
                    catch (e) {
                    }
                }

                if (typeof error === 'function')
                    error(textStatus);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (typeof error === 'function')
                    error(textStatus);
            }
        });
    }

    /**
     * 附加节点的子节点数据
     * 
     * @param {JQuery}
     *        $element JQuery对象
     * @param {JSON}
     *        options treegrid options 配置参数
     * @param {String}
     *        url 服务端请求数据 URL
     * @param {Object}
     *        row treegrid row 对象
     */
    function append($element, options, url, row) {
        if (!($element && url && row && (typeof $element.treegrid === 'function')))
            return;

        if (!options)
            options = {};
        if (!options.idField)
            options.idField = defaultOptions.idField;

        updateRowAjaxingStatus($element, options.idField, row, true);
        delete row[isAjaxingField];

        var params = data($element, 'loadCondition');
        if (params)
            params = $.extend({}, params, row);
        else
            params = row;

        sendAjax({
            url: url,
            params: params
        }, function(data, textStatus) {
            updateRowAjaxingStatus($element, options.idField, row, false);
            $element.treegrid('append', {
                parent: row[options.idField],
                data: data
            }).treegrid('expand', row[options.idField]);

            if (typeof options.onLoaded === 'function')
                options.onLoaded(data, textStatus);
        }, function(textStatus) {
            updateRowAjaxingStatus($element, options.idField, row, false);
            $element.treegrid('expand', row[options.idField]);

            if (typeof options.onLoadedError === 'function')
                options.onLoadedError(textStatus);
        });
    }

    /**
     * 高亮显示行
     * 
     * @param {JQuery}
     *        $element JQuery对象
     * @param {String}
     *        id idField 字段的值
     */
    function highlightRow($element, id) {
        if (!($element && $element.length && (typeof $element.treegrid === 'function')))
            return;

        var el = $element[0];
        var opts = $.data(el, "treegrid").options;
        opts.finder.getTr(el, id).addClass("datagrid-row-over");
    }

    /**
     * 展开指定节点下指定属性值的所有子节点
     * 
     * @param {JQuery}
     *        $element JQuery对象
     * @param {Object}
     *        node 需要展开的节点对象，不传或为 null 则展开根节点下子节点
     */
    function expandChidlren($element, node) {
        if (!($element && $element.length && (typeof $element.treegrid === 'function')))
            return;

        var condition = data($element, "expandField");
        if (!condition)
            return;

        var opts = $.data($element[0], "treegrid").options;
        var id = opts.idField;

        var children, i, length, tmpNode, index;
        if (!node)
            children = $element.treegrid('getRoots');
        else
            children = $element.treegrid('getChildren', node[id]);

        if (children && children.length) {
            for (i = 0, length = children.length; i < length; i++) {
                tmpNode = children[i];
                if ((condition.checked) && (tmpNode[condition.field] == condition.checkedValue))
                    $element.treegrid('select', tmpNode[id]);

                if (tmpNode[condition.field] == condition.value) {
                    $element.treegrid('expand', tmpNode[id]);
                    highlightRow($element, tmpNode[id]);
                }
            }
        }
    }

    /**
     * 级联勾选节点的父节点
     * 
     * @param {JQuery}
     *        $element JQuery对象
     * @param {String}
     *        id 节点的 idField 属性值
     * @param {Boolean}
     *        status 节点勾选状态，true: 勾选, false: 未勾选。可以不传
     */
    function cascadeCheckParent($element, id, status) {
        var opts = data($element, "treegrid").options;
        if (opts.singleSelect && !opts.cascadeCheck)
            return;

        var tr, ck;
        if (typeof status === 'undefined') {
            status = false;

            tr = opts.finder.getTr($element[0], id);
            ck = tr.find("div.datagrid-cell-check input[type=checkbox]");
            if (ck.attr("checked"))
                status = true;
        }

        var parent = $element.treegrid('getParent', id);
        if (parent) {
            var parentId = parent[opts.idField];
            tr = opts.finder.getTr($element[0], parentId);

            if (status) {
                var ckStatus;
                ck = null;
                tr.next("tr.treegrid-tr-tree").find("div.datagrid-cell-check input[type=checkbox]").each(function() {
                    ckStatus = false;
                    if ($(this).attr('checked'))
                        ckStatus = true;
                    if (ck == null)
                        ck = ckStatus;

                    if (ck != ckStatus) {
                        status = false;
                        return false;
                    }
                });
            }

            tr.find("div.datagrid-cell-check input[type=checkbox]").attr('checked', status);

            if (opts.selectOnCheck) {
                if (status)
                    tr.find("tr.datagrid-row").addClass("datagrid-row-selected");
                else
                    tr.find("tr.datagrid-row").removeClass("datagrid-row-selected");
            }

            cascadeCheckParent($element, parentId, status);
        }
    }

    /**
     * 级联勾选节点的子节点
     * 
     * @param {JQuery}
     *        $element JQuery对象
     * @param {String}
     *        id 节点的 idField 属性值
     */
    function cascadeCheckChildren($element, id) {
        var opts = data($element, "treegrid").options;
        if (!opts.cascadeCheck)
            return;

        var node = $element.treegrid('find', id);
        if (node.children && node.children.length) {
            var tr = opts.finder.getTr($element[0], id);
            var ck = tr.find("div.datagrid-cell-check input[type=checkbox]");
            var status = false;
            if (ck.attr("checked"))
                status = true;

            var nextTr = tr.next("tr.treegrid-tr-tree");
            nextTr.find("div.datagrid-cell-check input[type=checkbox]").attr('checked', status);

            if (opts.selectOnCheck) {
                if (status)
                    nextTr.find("tr.datagrid-row").addClass("datagrid-row-selected");
                else
                    nextTr.find("tr.datagrid-row").removeClass("datagrid-row-selected");
            }
        }
    }

    /**
     * 绑定展开前事件
     * 
     * @param {JQuery}
     *        $element Jquery对象
     * @param {String}
     *        url 服务端请求数据 URL
     */
    function bindOnBeforeExpand($element, url) {
        if (!($element && url && (typeof $element.treegrid === 'function')))
            return;

        var opts = data($element, "treegrid").options;
        var onBeforExpand = opts.onBeforeExpand;

        opts.onBeforeExpand = function(row) {
            if (!row[isAjaxingField]) {
                var children = $element.treegrid('getChildren', row[opts.idField]);
                if ((children && children.length) || (typeof row[isAjaxingField] === 'boolean')) {
                    if (typeof onBeforExpand === 'function')
                        return onBeforExpand(row);

                    return true;
                }

                append($element, opts, url, row);
                return false;
            }

            return true;
        };
    }

    /**
     * 绑定节点展开事件
     * 
     * @param {JQuery}
     *        $element JQuery对象
     */
    function bindOnExpand($element) {
        if (!($element && (typeof $element.treegrid === 'function')))
            return;

        var opts = data($element, "treegrid").options;
        var onExpand = opts.onExpand;

        opts.onExpand = function(row) {
            expandChidlren($element, row);

            if (typeof onExpand === 'function')
                onExpand(row);
        };
    }

    /**
     * 绑定展开前事件
     * 
     * @param {JQuery}
     *        $element JQuery对象
     */
    function bindOnLoadSuccess($element) {
        if (!($element && (typeof $element.treegrid === 'function')))
            return;

        var opts = data($element, "treegrid").options;
        var onLoadSuccess = opts.onLoadSuccess;

        function _cascadeCheck(e) {
            var id = $(e).parent().parent().parent().attr("node-id");
            cascadeCheckChildren($element, id);
            cascadeCheckParent($element, id);
        }

        opts.onLoadSuccess = function(row, data) {
            if (opts.cascadeCheck) {
                if (row) {
                    var id = row[opts.idField];
                    var node = $element.treegrid('find', id);
                    if (node.children && node.children.length) {
                        var hasCheckedNode = false, i, length, childrenNode;
                        for (i = 0, length = node.children.length; i < length; i++) {
                            childrenNode = node.children[i];
                            if (childrenNode.checked) {
                                hasCheckedNode = true;
                            }
                            childrenNode.checked = false;
                        }

                        var tr = opts.finder.getTr($element[0], id);
                        tr.find("div.datagrid-cell-check input[type=checkbox]").change(function() {
                            _cascadeCheck(this);
                        });
                        tr.next("tr.treegrid-tr-tree").find("div.datagrid-cell-check input[type=checkbox]").change(function() {
                            _cascadeCheck(this);
                        });

                        if (!hasCheckedNode)
                            cascadeCheckChildren($element, row[opts.idField]);
                    }
                }
                else {
                    var body = $(this).treegrid("getPanel").find("div.datagrid-body");
                    body.find("div.datagrid-cell-check input[type=checkbox]").change(function() {
                        _cascadeCheck(this);
                    });;
                }
            }

            if (typeof onLoadSuccess === 'function')
                onLoadSuccess(row, data);
        };
    }

    /**
     * 绑定行点击事件
     * 
     * @param {JQuery}
     *        $element JQuery对象
     */
    function bindOnClickRow($element) {
        if (!($element && (typeof $element.treegrid === 'function')))
            return;

        var opts = data($element, "treegrid").options;
        var onClickRow = opts.onClickRow;

        opts.onClickRow = function(row) {
            if (opts.checkOnSelect && opts.cascadeCheck) {
                var tr = opts.finder.getTr($element[0], row[opts.idField]);
                tr.find("div.datagrid-cell-check input[type=checkbox]").change();
            }

            if (typeof onClickRow === 'function')
                onClickRow(row);
        };
    }

    /**
     * 获取勾选的父节点
     * 
     * @param {Object}
     *        $element JQuery对象
     * @param {String}
     *        id 节点 idField 属性值
     */
    function getCheckedParentNodeId($element, id) {
        var opts = data($element, "treegrid").options;
        var parentNode = $element.treegrid('getParent', id);
        if (parentNode) {
            var parentId = parentNode[opts.idField];
            var tr = opts.finder.getTr($element[0], parentId);
            var ck = tr.find("div.datagrid-cell-check input[type=checkbox]");
            if (!ck.attr('checked'))
                return id;

            return getCheckedParentNodeId($element, parentId);
        }

        return id;
    };

    /**
     * 递归获取包含父级节点字段的节点字段
     * 
     * @param {Object}
     *        $element jQuery对象
     * @param {String}
     *        field 要获取的字段
     * @param {String}
     *        id 节点 idField 属性值
     */
    function getFullNodeField($element, field, id) {
        var opts = data($element, "treegrid").options;
        var value = $element.treegrid('find', id)[field];

        var parentNode = $element.treegrid('getParent', id);
        if (parentNode) {
            var parentId = parentNode[opts.idField];
            value = getFullNodeField($element, field, parentId) + " > " + value;
        }

        return value;
    };

    /**
     * 筛选数据
     * 
     * @param {Object}
     *        $element jQuery对象
     * @param {String/Array}
     *        fields 要获取的节点字段，可为字段名称，或字段名称的集合。不传或为 null 则返回勾选节点的 row 数据
     * @param {String}
     *        groupField 分组字段名
     */
    function filterRowData($element, rows, field, groupField) {
        if (!(rows && rows.length))
            return null;
        if (!field)
            return rows;

        var opts = data($element, "treegrid").options;
        var i, length, j, fieldLength, row, filterData, value;

        function getFieldValue(row, field) {
            if (field.indexOf('_full_') >= 0) {
                field = field.substr(6);
                return getFullNodeField($element, field, row[opts.idField]);
            }
            else {
                return row[field];
            }
        }

        function push(row, value, field) {
            if (typeof value === 'undefined')
                return;

            if (groupField) {
                if (!filterData)
                    filterData = {};
                var gf = row[groupField];
                if (typeof gf === 'undefined')
                    gf = groupField;

                if (field) {
                    if (!filterData[gf])
                        filterData[gf] = {};
                    if (!filterData[gf][field])
                        filterData[gf][field] = [];
                    if (filterData[gf][field].indexOf(value) < 0)
                        filterData[gf][field].push(value);
                }
                else {
                    if (!filterData[gf])
                        filterData[gf] = [];
                    if (filterData[gf].indexOf(value) < 0)
                        filterData[gf].push(value);
                }
            }
            else {
                if (field) {
                    if (!filterData)
                        filterData = {};
                    if (!filterData[field])
                        filterData[field] = [];
                    if (filterData[field].indexOf(value) < 0)
                        filterData[field].push(value);
                }
                else {
                    if (!filterData)
                        filterData = [];
                    if (filterData.indexOf(value) < 0)
                        filterData.push(value);
                }
            }
        }

        for (i = 0, length = rows.length; i < length; i++) {
            row = rows[i];
            if (!row)
                continue;

            if (typeof field === 'string') {
                push(row, getFieldValue(row, field));
            }
            else if (field && field.length) {
                for (j = 0, fieldLength = field.length; j < fieldLength; j++) {
                    push(row, getFieldValue(row, field[j]), field[j]);
                }
            }
        }

        return filterData;
    }

    $.DeclareClass("XspWeb.Controls.TreeGrid", {

        // 包容对象
        mObject: null,

        // easyUI treegrid 配置属性 + 自定义属性
        mOptions: null,

        // 远程服务URL
        mUrl: null,

        // 工具栏
        mToolbar: null,

        /**
         * 构造函数
         * 
         * @param {String}
         *        selector JQuery选择器
         */
        Constructor: function(selector) {
            if (!selector) {
                $.Assert("Invalid argument!");
                return;
            }

            // 寻找指定对象
            this.mObject = $(selector);
            if (!(this.mObject && this.mObject.length)) {
                this.mObject = null;
                $.Assert("Object not found!");
                return;
            }
        },

        /**
         * 静态成员
         */
        Static: {
            /**
             * 获取 TreeGrid 对象
             * 
             * @param {String}
             *        selector JQuery选择器
             */
            get: function(selector) {
                return data($(selector), dataKey);
            }
        },

        /**
         * 初始化TreeGrid
         * 
         * @param {Object}
         *        options treegrid配置参数
         * @return this
         */
        Initialize: function(options) {
            if (!(this.mObject && this.mObject.length)) {
                $.Assert("Object not found!");
                return this;
            }

            var opts = mergerOpts(this, options);

            if (opts.toolbar && opts.toolbar.length) {
                this.mToolbar = opts.toolbar;
                delete opts.toolbar;
            }

            this.mUrl = opts.url;
            delete opts.url;
            this.mOptions = opts;

            this.mObject.treegrid(opts);

            // 动态添加 toolbar
            if (this.mToolbar && this.mToolbar.length)
                this.mObject.treegrid("addToolbarItem", this.mToolbar);

            bindOnBeforeExpand(this.mObject, this.mUrl);
            bindOnExpand(this.mObject);
            bindOnLoadSuccess(this.mObject);
            bindOnClickRow(this.mObject);

            data(this.mObject, dataKey, this);

            return this;
        },

        /**
         * 设置表格列信息
         * 
         * @param {Array}
         *        columns 表格列信息，该配置继承 EasyUI treegrid 组件的 Columns 属性配置，并新增以下属性： ContentType 单元格内容类型，可以配置为 button/text，默认为 text： button 为按钮列，可指定名称text及事件handler；text为字段列，取数据源中field字段的值。 text ContentType 类型为 button 时的按钮名称。 handler ContentType 类型为 button 时点击事件函数，拥有三个参数：rowIndex,row,value。 CustomDisplay 该列是否可以自定义是否显示，配置为true时，工具栏增加显示字段按钮，用来控制该列显示。
         * @return this
         */
        SetColumns: function(columns) {
            var mObj = this.mObject;
            if (!mObj)
                return this;

            if (!(columns && columns.length && columns[0].length))
                return this;

            var opts = mObj.treegrid('options');

            // 解析特殊列
            var i, length, j, fieldCount, column, formatter, buttonColumns = [], customDisplayColumns = [], customDispalyColumnTitle;
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
                                    return ("<a href='#'>" + this.text + "</a>");
                                else if (v)
                                    return ("<a href='#'>" + v + "</a>");
                                else
                                    return v;
                            }
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

                if (typeof handler === 'function') {
                    var rows = $.data(mObj[0], "treegrid").data.rows;
                    handler(rowIndex, rows[rowIndex], value);
                }
                else if (typeof onClickCell === 'function') {
                    onClickCell(rowIndex, field, value);
                }
            };

            mObj.treegrid(opts);

            // 动态添加 toolbar
            if (this.mToolbar && this.mToolbar.length)
                this.mObject.treegrid("addToolbarItem", this.mToolbar);

            // 自定义显示列按钮
            if (customDisplayColumns.length) {
                var showDelimiter = false;
                if (opts.toolbar && opts.toolbar.length) {
                    showDelimiter = true;
                }

                mObj.treegrid("addToolbarItem", createCustomDisplayColumnToolbar(this, customDisplayColumns, opts.customDisplayLegend, showDelimiter));
            }

            return this;
        },

        /**
         * 加载远程数据
         * 
         * @param {Object}
         *        param 条件参数。如果有值将替换初始化的 queryParams 参数
         * @return void
         */
        LoadRemoteData: function(params) {
            if (!this.mObject)
                return $.Assert("Object not found!");

            if (!this.mUrl)
                return $.Assert("Invalid url!");

            var options = this.mObject.treegrid("options");
            options.url = this.mUrl;

            if (params) {
                options.queryParams = params;
                data(this.mObject, "loadCondition", params);
            }

            this.mObject.treegrid("reload");
        },

        /**
         * 添加查询参数
         * 
         * @param {Object}
         *        param 条件参数。如果有值将替换初始化的 queryParams 参数
         * @return this
         */
        AddQueryParameters: function(params) {
            if (!this.mObject)
                return $.Assert("Object not found!");

            params = params || {};
            var options = this.mObject.treegrid("options");
            options.queryParams = $.extend({}, options.queryParams, params);
            data(this.mObject, "loadCondition", options.queryParams);

            return this;
        },

        /**
         * 清除 load 方法中配置的 Post 提交给服务端的条件数据
         * 
         * @return this
         */
        ClearConditions: function() {
            data(this.mObject, 'loadCondition', null);
            return this;
        },

        /**
         * 重新加载数据
         * 
         * @param {String}
         *        id idField 字段的值，如果不传或为null，则加载所有数据
         */
        Reload: function(id) {
            if (!id) {
                var params = data(this.mObject, "loadCondition");
                this.LoadRemoteData(params);
            }
            else {
                this.mObject.treegrid('removeChildren', id);
                this.AppendData({
                    parent: id
                });
            }

            return this;
        },

        /**
         * 加载子节点数据
         * 
         * @param {Object}
         *        param 参数 'param' 包含下列属性: parent: 父节点ID（idField），如果未指定，则默认为根节点。 data: Array，行数据。如果未指定，则根据指定的 url 属性从服务端获取数据。 onLoaded：未指定 data 时，数据加载成功事件。 onLoadedError：未指定 data 时，数据加载失败事件。
         */
        AppendData: function(param) {
            if (!(this.mObject && param))
                return this;

            if (param.data && param.data.length)
                this.mObject.treegrid('append', param);
            else {
                var node = this.mObject.treegrid('find', param.parent);
                if (node) {
                    var opts = {
                        idField: this.mOptions.idField,
                        onLoaded: (typeof param.onLoaded === 'function') ? param.onLoaded : this.mOptions.onLoaded,
                        onLoadedError: (typeof param.onLoadedError === 'function') ? param.onLoadedError : this.mOptions.onLoadedError
                    };
                    append(this.mObject, opts, this.mUrl, node);
                }
            }

            return this;
        },

        /**
         * 显示/隐藏指定列
         * 
         * @param {String}
         *        field 需隐藏的列的 field 属性
         * @param {Boolean}
         *        isHidden 是否隐藏。默认为隐藏 true。为 false 则显示列
         */
        HideColumn: function(field, isHidden) {
            if (typeof isHidden != 'boolean')
                isHidden = true;

            var method = 'hideColumn';
            if (!isHidden)
                method = 'showColumn';

            this.mObject.treegrid(method, field);

            return this;
        },

        /**
         * 展开指定属性值的所有节点
         * 
         * @param {String}
         *        field 需要展开节点的 field 属性
         * @param {String}
         *        value 需要展开节点的 field 属性值
         * @param {Boolean}
         *        checked 是否勾选节点，默认为false
         * @param {String}
         *        checkedValue 要勾选的节点的 field 属性值，不传或为 null 则为 value 参数值
         */
        ExpandAll: function(field, value, checked, checkedValue) {
            if (!(this.mObject && this.mObject.length))
                return this;

            if ((typeof checkedValue === 'undefined') || checkedValue == null)
                checkedValue = value;
            data(this.mObject, "expandField", {
                field: field,
                value: value,
                checked: checked,
                checkedValue: checkedValue
            });

            expandChidlren(this.mObject);

            return this;
        },

        /**
         * 高亮显示行
         * 
         * @param {String}
         *        id idField 字段的值
         */
        HighlightRow: function(id) {
            highlightRow(this.mObject, id);
            return this;
        },

        /**
         * 递归获取包含父级节点字段的节点字段
         * 
         * @param {String}
         *        field 需要获取的节点的 field 属性
         * @param {String}
         *        id 需要获取的节点的 idField 字段的值
         */
        GetFullNodeField: function(field, id) {
            return getFullNodeField(this.mObject, field, id);
        },

        /**
         * 获取勾选节点
         * 
         * @param {String/Array}
         *        fields 要获取的勾选节点字段，可为字段名称，或字段名称的集合。不传或为 null 则返回勾选节点的 row 数据
         * @param {String}
         *        groupField 分组字段名。指定了该值，则返回 Object 类型数据，该 Object 包含分组字段值的属性
         */
        GetChecked: function(fields, groupField) {
            var $el = this.mObject;
            var opts = data($el, "datagrid").options;
            var ck = opts.finder.getTr($el[0], "", "checked");
            var condition = data($el, 'loadCondition');

            if (!ck.length) {
                var d = [];
                if (groupField)
                    d = null;

                return {
                    params: condition,
                    data: d
                };
            }

            var checkedNode = [], id, row;
            ck.each(function() {
                id = getCheckedParentNodeId($el, $(this).attr('node-id'));
                row = $el.treegrid('find', id);
                if (checkedNode.indexOf(row) < 0)
                    checkedNode.push(row);
            });

            return {
                params: data($el, 'loadCondition'),
                data: filterRowData($el, checkedNode, fields, groupField)
            };
        },

        /**
         * 获取选择的节点
         */
        GetSelected: function() {
            return this.mObject.treegrid('getSelected');
        },

        /**
         * 更新节点
         */
        UpdateNode: function(param) {
            this.mObject.treegrid('update', param);
        },

        /**
         * 删除节点
         */
        Remove: function(PKID) {
            this.mObject.treegrid("remove", PKID);
        },

        /**
         * 获取父节点
         */
        GetParent: function(PKID) {
            return this.mObject.treegrid("getParent", PKID);
        },

        /**
         * 获取子节点
         */
        GetChildren: function(PKID) {
            return this.mObject.treegrid('getChildren', PKID);
        },

        /**
         * 取消所有被选择的节点
         */
        UnselectAll: function() {
            this.mObject.treegrid('unselectAll');
        },

        /**
         * 取消所有勾选的节点
         */
        UncheckAll: function() {
            this.mObject.treegrid('uncheckAll');
        }

    });

})(window, jQuery, $.Namespace());