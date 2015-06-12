/**
 * Created by Chenfq on 2015/4/28.
 */
(function (window, $, namespace) {
    $.DeclareClass("XspWeb.Controls.MobileUI.DataSource", {

        /**
         * 构造DataSource
         * @param dataSource 目前只支持array 和 json
         * @constructor
         */
        Constructor: function (dataSource) {
            this.mDataType = "";
            if (this.IsJson(dataSource[0]))
                this.mDataType = "json";
            else if (jQuery.isArray(dataSource[0]))
                this.mDataType = "array";
            else
                throw $.AResult.AE_INVALIDARG();

            this.mDataSource = dataSource;
        },

        /**
         * 返回数据源数组
         * @param columnSet
         * @returns {*}
         * @constructor
         */
        GetData: function (columnSet) {
            if (this.mDataType === "array")
                return this.mDataSource;
            else {
                var fields = columnSet.GetField();
                var datas = [];
                for (var i in this.mDataSource) {
                    var data = [];
                    for (var j in fields) {
                        data.push(this.mDataSource[i][fields[j]]);
                    }
                    datas.push(data);
                }

                return datas;
            }
        },
        /**
         * 判断是否是json
         * @param object
         * @returns {boolean}
         * @constructor
         */
        IsJson: function (object) {
            return (typeof(object) == "object") && (Object.prototype.toString.call(object).toLowerCase() == "[object object]") && (!object.length);
        }
    });
})(window, jQuery, jQuery.Namespace());