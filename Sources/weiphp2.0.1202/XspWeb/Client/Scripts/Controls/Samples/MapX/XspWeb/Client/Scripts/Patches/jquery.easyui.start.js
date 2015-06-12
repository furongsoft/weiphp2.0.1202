/*******************************************************************************
 * 作用：在DOM加载完成后启动easyui parse. 来源:从jquery.easyui.js $.parser中剪切出来
 * 解决bug：该脚本引用需放在 HTML 代码后面，其他脚本引用前面，防止出现在IE、360等奇葩浏览器中，Dialog窗口中的Buttons不显示bug
 * 修改人：zgl 20130929
 ******************************************************************************/
$(function() {
    var d = $("<div style=\"position:absolute;top:-1000px;width:100px;height:100px;padding:5px\"></div>").appendTo("body");
    $._boxModel = parseInt(d.width()) == 100;
    d.remove();
    if (!window.easyloader && $.parser.auto) {
        $.parser.parse();
    }
});