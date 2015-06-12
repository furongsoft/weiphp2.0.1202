/**
 * Created by Alex on 2015/4/21.
 */
/**
 * 定义基础控件
 */
$.DeclareClass("XspWeb.Controls.MobileUI.Control", {
    /**
     * 构造函数
     *
     * @param VAR control 控件索引或DOM节点对象
     */
    Constructor: function (control) {
        this.Super();

        /**
         * 控件名称
         */
        this.mName = (typeof(control) === "string") ? control : null;

        /**
         * 控件对象
         */
        this.mControl = (typeof(control) === "string") ? $("#" + control)[0]: control;
    },

    /**
     * 获取控件名称
     *
     * @returns String 控件名称
     */
    GetName: function () {
        return this.mName;
    },

    /**
     * 获取控件名称
     *
     * @returns Object DOM节点对象
     */
    GetControl: function () {
        return this.mControl;
    }
});