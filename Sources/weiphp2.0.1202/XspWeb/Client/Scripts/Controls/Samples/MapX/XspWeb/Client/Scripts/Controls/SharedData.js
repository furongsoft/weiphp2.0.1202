/**
 * 跨框架数据共享插件
 */
(function(window, $) {

    function GetSharedData(key, value) {
        var top = window.top, cache = top['_CACHE'] || {};
        top['_CACHE'] = cache;

        return (value !== undefined) ? (cache[key] = value) : cache[key];
    };

    $.DeclareClass("XspWeb.Controls.SharedData", {

        Static: {

            /**
             * 添加跨框架共享数据
             * 
             * @param {String}
             *        key 存储的数据名
             * @param {Any}
             *        value 将要存储的任意数据
             */
            Add: function(key, value) {
                return GetSharedData(key, value);
            },

            /**
             * 获取跨框架共享数据
             * 
             * @param {String}
             *        key 存储的数据名
             */
            Get: function(key) {
                return GetSharedData(key);
            },

            /**
             * 删除跨框架共享数据
             * 
             * @param {String}
             *        key 删除的数据名
             */
            Remove: function(key) {
                var cache = window.top["_CACHE"];
                if (cache && cache[key])
                    delete cache[key];
            }
        }
    });
})(window, jQuery);