// 调试模式
$.DebugMode = false;

// 服务端脚本后缀
$.ServerPostfix = "";

/**
 * 命名空间
 */
$.Namespace = function () {
    if (typeof XspWeb === "undefined")
        XspWeb = {};

    return XspWeb;
};

/**
 * 创建命名空间
 *
 * @param {Object}
 *        parentPakege 创建的命名空间所在的对象
 * @param {String}
 *        name 需要创建的命名空间
 */
$.CreateNamespace = function (parentPakege, name) {

    var nameSpace = [];
    var className = "";

    var createNameSpace = function (str) {
        parentPakege[str] = parentPakege[str] || {};
        nameSpace = parentPakege[str];
        parentPakege = nameSpace;
    };

    var namespaces = name.split(".");
    $.each(namespaces, function (i, str) {
        if (i == (namespaces.length - 1)) {
            className = str;
        }
        else {
            createNameSpace(str);
        }
    });

    nameSpace[className] = nameSpace[className] || {};

    return nameSpace[className];
};

/**
 * 提示错误信息
 *
 * @param {String}
 *        message 错误信息
 */
$.Assert = function (message) {

    if ($.Debug) {
        if (typeof console != "undefined")
            console.log(message);
        else
            alert(message);
    }
};

/**
 * 信息提醒
 *
 * @param {String}
 *        message 提醒信息
 * @param {Number}
 *        time 显示的时间(毫秒)
 */
$.Hint = function (message, time) {

    if (typeof time != "number")
        time = 2000;

    window.top.$.messager.show({
        id: "tipMessage",
        title: "提示",
        msg: message,
        showType: "slide",
        showSpeed: 300,
        timeout: time,
        style: {
            right: "",
            top: window.top.document.body.scrollTop + window.top.document.documentElement.scrollTop,
            bottom: ""
        }
    });
};

/**
 * 取值的对数
 *
 * @param Double n 值
 * @param base 底数
 * @returns Double 对数
 */
Math.logBase = function (n, base) {
    return Math.log(n) / Math.log(base);
};