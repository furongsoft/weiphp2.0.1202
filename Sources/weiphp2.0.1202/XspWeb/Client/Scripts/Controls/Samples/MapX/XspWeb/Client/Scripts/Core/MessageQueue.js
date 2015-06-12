/**
 * Created by Alex on 2015/3/11.
 */
(function (window, $, namespace) {

    /**
     * 定义消息
     */
    $.DeclareClass("XspWeb.Core.MessageQueue.Message", {

        /**
         * 构造函数
         *
         * @param XspWeb.Core.MessageQueue.Handler handler 消息处理器
         * @param Int32 messageId 消息索引
         * @param ... args 消息参数
         */
        Constructor: function (handler, messageId, args) {
            if (!handler || !messageId)
                throw $.AResult.AE_INVALIDARG();

            this.Super();
            this.mHandler = handler;
            this.mMessageId = messageId;
            this.mArguments = args;
        }
    });

    /**
     * 定义消息处理器
     */
    $.DeclareClass("XspWeb.Core.MessageQueue.Handler", {

        /**
         * 构造函数
         *
         * @param XspWeb.Core.MessageQueue mq 消息队列
         */
        Constructor: function (mq) {
            if (!mq)
                throw $.AResult.AE_INVALIDARG();

            this.Super();
            this.mMessageQueue = mq;
        },

        /**
         * 投递消息
         *
         * @param Int32 messageId 消息索引
         * @param ... 其他参数
         */
        PostMessage: function (messageId) {
            var args = new Array();
            for (var i = 0; i < arguments.length; ++i)
                args[i] = arguments[i];

            var message = new XspWeb.Core.MessageQueue.Message(this, messageId, args);
            this.mMessageQueue.PostMessage(message);
        },

        /**
         * 消息处理函数
         *
         * @param Int32 messageId 消息索引
         * @param ... 其他参数
         */
        OnHandler: function (messageId) {
        }
    });

    /**
     * 定义消息队列类型
     */
    $.DeclareClass("XspWeb.Core.MessageQueue.MessageQueue", {

        /**
         * 构造函数
         */
        Constructor: function () {
            this.Super();
            this.mList = new XspWeb.Core.List();
            this.mTimerId = null;
        },

        /**
         * 投递消息
         *
         * @param XspWeb.Core.MessageQueue.Message message 消息
         */
        PostMessage: function (message) {
            if (!message)
                throw $.AResult.AE_INVALIDARG();

            this.mList.Add(message);

            if (this.mTimerId)
                clearTimeout(this.mTimerId);

            this.mTimerId = setTimeout(function () {
                arguments[0].OnHandler();
            }, 1, this);
        },

        /**
         * 消息处理函数
         */
        OnHandler: function () {
            while (!this.mList.IsEmpty()) {
                var item = this.mList.RemoveAtIndex(0);
                item.mHandler.OnHandler.apply(item.mHandler, item.mArguments);
            }
        }
    });
})(window, jQuery, $.Namespace());