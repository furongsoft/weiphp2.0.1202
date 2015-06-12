/**
 * Created by chenfuqian on 2015/4/28.
 */
(function (window, $, namespace) {
    /**
     * 定义datagrid第一行数据
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.ColumnSet", {
        /**
         *
         * @param Array field 字段值
         * @param Array title 字段名称
         * @param Int[] width 字段宽度
         * @constructor
         */
        Constructor: function (field, title, width) {
            this.mField = field;
            this.mTitle = title;
            this.mWidth = width;
            this.mTotalWidth = 0;
            for (var i in this.mWidth) {
                this.mTotalWidth = this.mTotalWidth + this.mWidth[i];
            }
        },

        GetField: function () {
            return this.mField;
        },

        GetTitle: function () {
            return this.mTitle;
        },

        GetWidth: function () {
            return this.mWidth;
        },

        SetWidth: function (width) {
            this.mWidth = width;
            for (var i in this.mWidth) {
                this.mTotalWidth = this.mTotalWidth + this.mWidth[i];
            }
        },

        GetTotalWidth: function () {
            return this.mTotalWidth + "px";
        }
    });
})(window, jQuery, jQuery.Namespace());