/**
 * 创建命名空间和类
 */
$.DeclareClass = function (name, extend, prototype) {
    if (arguments.length == 2) {
        prototype = extend;
        extend = $.BaseClass;
    }
    else if (!extend) {
        extend = $.BaseClass;
    }

    prototype = prototype || {};

    // 命名空间
    var parentPackage = window;
    var nameSpace = [];
    var className = "";

    // 创建命名空间
    var CreateNameSpace = function (str) {
        parentPackage[str] = parentPackage[str] || {};
        nameSpace = parentPackage[str];
        parentPackage = nameSpace;
    };

    var namespaces = name.split(".");
    $.each(namespaces, function (i, str) {
        if (i == (namespaces.length - 1))
            className = str;
        else
            CreateNameSpace(str);
    });

    // 构造函数
    nameSpace[className] = function () {
        if (this.Constructor)
            this.Constructor.apply(this, arguments);
        else
            extend.prototype.Constructor.apply(this, arguments);
    };

    // 继承父类基本属性
    $.extend2(true, nameSpace[className].prototype, extend.prototype);

    // 本身属性及实现
    $.extend2(true, nameSpace[className].prototype, prototype);

    // 静态成员
    if (typeof(prototype.Static) === "object")
        $.extend2(true, nameSpace[className], prototype.Static);

    // 设置父类原型
    nameSpace[className].prototype["Name"] = name;
    nameSpace[className].prototype["Extends"] = extend.prototype;
};

/**
 * 定义基础类型
 */
$.BaseClass = {};
$.BaseClass.prototype = {
    // 类型名称
    Name: "BaseClass",

    //  父类型
    Extends: null,

    /**
     * 构造函数
     */
    Constructor: function () {
    },

    /**
     * 清理函数
     */
    Dispose: function () {
    },

    /**
     * 调用父类函数
     */
    Super: function () {
        var func = this.Super.caller.prototype["__parent_func__"];
        if (func)
            return func.apply(this, arguments);
    }
};

/**
 * 构造类型
 *
 * @param Class clazz 类型
 * @param args 构造参数
 * @returns Object 类型实例
 */
$.CreateClass = function (clazz, args) {
    function F() {
        return clazz.apply(this, args);
    }

    F.prototype = clazz.prototype;

    var f = new F();
    f.constructor = constructor;

    return f;
};

/**
 * 基于JQuery.extend扩展实现类型函数调用链
 */
jQuery.extend2 = jQuery.fn.extend2 = function () {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (length === i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) )) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = jQuery.extend2(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    //ALEX[[[
                    // 实现类型函数调用链
                    if ((target[name] !== undefined)
                        && (jQuery.isFunction(target[name]))
                        && (jQuery.isFunction(copy))) {
                        copy.prototype["__parent_func__"] = target[name];
                    }
                    //]]]ALEX
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};