/**
 * Created by Alex on 2015/4/23.
 */
// 取消浏览器的所有事件，使得active的样式在手机上正常生效
document.addEventListener("touchstart", function () {
    return false;
}, true);

// 禁止选择
document.oncontextmenu = function () {
    return false;
};

function PlusReady() {
    // 隐藏滚动条
    plus.webview.currentWebview().setStyle({scrollIndicator: "none"});

    // Android处理返回键
    plus.key.addEventListener("backbutton", function () {
        if (confirm('确认退出？'))
            plus.runtime.quit();
    }, false);

    CompatibleAdjust();
}

if (window.plus)
    PlusReady();
else
    document.addEventListener("plusready", PlusReady, false);

// DOMContentLoaded事件处理
var _domReady = false;
// 页面类型对象
var sPage = null;
document.addEventListener("DOMContentLoaded", function () {
    _domReady = true;

    // 初始化页面
    if (typeof(CreatePage) === "function")
        sPage = CreatePage();
    else
        sPage = new XspWeb.Controls.MobileUI.Page();

    // 初始化MUI
    mui.init();
    mui.plusReady(PlusReady);
    mui.ready(function () {
        sPage.OnStart();
    });

    CompatibleAdjust();
}, false);

// 兼容性样式调整
var _adjust = false;
function CompatibleAdjust() {
    if (_adjust || !window.plus || !_domReady)
        return;

    _adjust = true;

    // iOS平台使用div的滚动条
    if ("iOS" == plus.os.name) {
        as = "pop-in";
        at = 300;
        document.getElementById("content").className = "scontent";
    }

    // 关闭启动界面
    setTimeout(function () {
        plus.navigator.closeSplashscreen();
    }, 500);
}