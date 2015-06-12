/**
 * Created by Alex on 2015/3/4.
 */
(function (window, $, namespace) {
    /**
     * 定义哈希表
     */
    $.DeclareClass("XspWeb.Core.HashTable", {

        /**
         * 构造函数
         */
        Constructor: function () {
            this.Super();
            this.mList = new Object();
            this.mCount = 0;
        },

        /**
         * 添加
         *
         * @param Object key 键值
         * @param Object object 对象
         * @returns this 哈希表对象
         */
        Add: function (key, object) {
            this.mList[key] = object;
            this.mCount++;
            return this;
        },

        /**
         * 移除哈希表中指定元素
         *
         * @param Object key 键值
         * @return Object 此键值对应的元素
         */
        Remove: function (key) {
            var object = this.mList[key];
            if (object) {
                delete this.mList[key];
                this.mCount--;
                return object;
            }
            else {
                return null;
            }
        },

        /**
         * 获得哈希表中指定元素
         *
         * @param Object key 键值
         * @return Object 此键值对应的元素
         */
        Get: function (key) {
            var object = this.mList[key];
            return (object !== undefined) ? object : null;
        },

        /**
         * 移除此哈希表中的所有元素
         */
        Clear: function () {
            this.mList = new Object();
            this.mCount = 0;
        },

        /**
         * 返回此哈希表中的元素数
         *
         * @return Int32 元素数量
         */
        Length: function () {
            return this.mCount;
        },

        /**
         * 判断哈希表是否包含元素
         *
         * @return Boolean 是否不包含元素
         */
        IsEmpty: function () {
            return (this.mList.length == 0);
        },

        /**
         * 判断哈希表是否包含指定元素
         *
         * @param Object object 指定元素
         * @return Boolean 是否包含元素
         */
        Contains: function (object) {
            for (var key in this.mList) {
                if (this.mList[key] === object)
                    return true;
            }

            return false;
        },

        /**
         * 判断哈希表是否包含指定元素
         *
         * @param Object key 键值
         * @return Boolean 是否包含元素
         */
        ContainsKey: function (key) {
            return (this.mList[key] !== undefined);
        }
    });
})(window, jQuery, $.Namespace());