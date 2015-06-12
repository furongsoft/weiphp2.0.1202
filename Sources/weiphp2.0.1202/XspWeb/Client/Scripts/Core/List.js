/**
 * Created by antelop on 2015/3/9.
 */
(function (window, $, namespace) {

    /**
     * 定义链表
     */
    $.DeclareClass("XspWeb.Core.List", {

        /**
         * 构造函数
         */
        Constructor: function () {
            this.Super();
            this.mList = new Array();
        },

        /**
         * 添加
         *
         * @param Object object 对象
         * @returns this 链表对象
         */
        Add: function (object) {
            this.mList[this.mList.length] = object;
            return this;
        },

        /**
         * 移除此列表中指定位置上的元素
         *
         * @param Int32 index 指定位置
         * @return Object 此位置的元素
         */
        RemoveAtIndex: function (index) {
            if ((index < 0) || (index >= this.mList.length))
                return null;

            var object = this.mList[index];
            this.mList.splice(index, 1);

            return object;
        },

        /**
         * 移除此列表中指定元素
         *
         * @param Object object 指定元素
         * @return Object 此位置的元素
         */
        Remove: function (object) {
            for (var i = 0; i < this.mList.length; i++) {
                if (this.mList[i] === object)
                    return this.RemoveAtIndex(i);
            }

            return null;
        },

        /**
         * 获得列表中指定元素
         *
         * @param Int32 index 元素索引
         * @return Object 此位置的元素
         */
        Get: function (index) {
            return this.mList[index];
        },

        /**
         * 设置列表中指定元素
         *
         * @param Int32 index 元素索引
         * @param Object object 指定元素
         * @returns Boolean 是否设置成功
         */
        Set: function (index, object) {
            if ((index < 0) || (index >= this.mList.length))
                return false;

            this.mList[index] = object;

            return true;
        },

        /**
         * 移除此列表中的所有元素
         */
        Clear: function () {
            this.mList.splice(0, this.mList.length);
        },

        /**
         * 返回此列表中的元素数
         *
         * @return Int32 元素数量
         */
        Length: function () {
            return this.mList.length;
        },

        /**
         * 判断列表是否包含元素
         *
         * @return Boolean 是否不包含元素
         */
        IsEmpty: function () {
            return (this.mList.length == 0);
        },

        /**
         * 判断列表是否包含指定元素
         *
         * @param Object object 指定元素
         * @return Boolean 是否包含元素
         */
        Contains: function (object) {
            for (var i = 0; i < this.mList.length; ++i) {
                if (this.mList[i] === object)
                    return true;
            }

            return false;
        }
    });
})(window, jQuery, $.Namespace());