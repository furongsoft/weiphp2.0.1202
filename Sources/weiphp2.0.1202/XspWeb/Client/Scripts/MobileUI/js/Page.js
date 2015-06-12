/**
 * Created by Alex on 2015/4/20.
 */
(function (window, $, namespace) {
    /**
     * 定义页面类型
     */
    $.DeclareClass("XspWeb.Controls.MobileUI.Page", {
        /**
         * 页面启动事件处理函数
         */
        OnStart: function () {
            this.InitializeComponent();
            this.OnResume();
        },

        OnResume: function () {
        },

        /**
         * 初始化界面组件
         */
        InitializeComponent: function () {
            if (typeof(InitializeComponent) === "function")
                InitializeComponent();
        }
    });
})(window, jQuery, jQuery.Namespace());