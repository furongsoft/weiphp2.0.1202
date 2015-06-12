/**
 * 创建命名空间和类
 */
$.DeclareClass = function (name, prototype) {
    prototype = prototype || {};

    // 命名空间
    var parentPackage = window;
    var nameSpace = [];
    var className = "";

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
        if (!(arguments && arguments.length)) {
            this.Constructor();
            return;
        }

        if (arguments.length == 1) {
            if (typeof arguments[0] == "object")
                this.options = $.extend(true, {}, $.BaseClass.defaults, nameSpace[className].defaults, arguments[0]);

            this.Constructor(arguments[0]);
        }
        else if (arguments.length == 2)
            this.Constructor(arguments[0], arguments[1]);
        else if (arguments.length == 3)
            this.Constructor(arguments[0], arguments[1], arguments[2]);
        else
            this.Constructor(arguments);
    };

    // 静态成员
    if (typeof prototype.Static === "object")
        $.extend(nameSpace[className], prototype.Static);

    // 继承BaseClass类基本属性
    $.extend(true, nameSpace[className].prototype, $.BaseClass.prototype);

    // 实现接口
    if (prototype.Implements && prototype.Implements.length) {
        $.each(prototype.Implements, function (i, inter) {
            $.Implements(nameSpace[className], inter);
        });
    }

    // 继承基类
    if (prototype.Extends && prototype.Extends.length) {
        $.each(prototype.Extends, function (i, sub) {
            $.Extends(nameSpace[className], sub);
        });
    }

    // 本身属性及实现
    $.extend(true, nameSpace[className].prototype, prototype);
};

$.BaseClass = {};
$.BaseClass.defaults = {
    Enabled: true
};
$.BaseClass.prototype = {
    Extends: [],
    Implements: [],
    Constructor: function () {
    },
    Destructor: function () {
    },

    // 是否实现某些接口
    IsImp: function () {
        var checkResult = true;
        var object = this;

        if ((!object) && (typeof (object) != "function"))
            return false;

        $.each(arguments, function (i, interFace) {
            var result = $.grep(object.Implements, function (inter, i) {
                return inter = interFace;
            });

            if (result.length <= 0) {
                checkResult = false;
                return;
            }
        });

        return checkResult;
    },

    // 是否扩展自某些基类
    IsExt: function () {
        var checkResult = true;
        var object = this;

        if ((!object) && (typeof (object) != "function"))
            return false;

        $.each(arguments, function (i, supperClass) {
            var result = $.grep(object.Extends, function (sup, i) {
                return sup = supperClass;
            });

            if (result.length <= 0) {
                checkResult = false;
                return;
            }
        });

        return checkResult;
    }
};

/**
 * 接口
 */
$.DeclareInterface = function (name, prototype) {
    // 命名空间
    var parentPackage = window;
    var nameSpace = [];
    var interfaceName = "";

    var CreateNameSpace = function (str) {
        parentPackage[str] = parentPackage[str] || {};
        nameSpace = parentPackage[str];
        parentPackage = nameSpace;
    };

    var namespaces = name.split(".");
    $.each(namespaces, function (i, str) {
        if (i == (namespaces.length - 1))
            interfaceName = str;
        else
            CreateNameSpace(str);
    });

    nameSpace[interfaceName] = function (options) {
        this.options = $.extend({}, $.BaseInterface.defaults, nameSpace[interfaceName].defaults, options);
        this.Constructor();
        return null;
    };

    // 继承BaseInterface类基本属性
    nameSpace[interfaceName].prototype = $.extend({}, $.BaseInterface.prototype);

    // 继承其他接口
    if (prototype.Extends) {
        $.each(prototype.Extends, function (i, subInterface) {
            $.Extends(nameSpace[interfaceName], subInterface);
        });
    }

    // 本身属性及实现
    $.extend(nameSpace[interfaceName].prototype, prototype);

    // 接口方法
    if (prototype.Methods) {
        $.each(prototype.Methods, function (i, method) {
            nameSpace[interfaceName].prototype[method] = function () {
                $.alert("This is a interface method!");
            };
        });
    }
};

$.BaseInterface = {};
$.BaseInterface.defaults = {
    Enabled: true
};
$.BaseInterface.prototype = {
    Extends: [],
    Methods: [],
    Constructor: function () {
        $.alert("This is a interface!");
    },
    Destructor: function () {
    }
};

/**
 * 继承基类属性
 */
$.Extends = function (clazz) {
    if ((!clazz) && (typeof (clazz) != 'function'))
        return;

    $.each(arguments, function (i) {
        if (i > 0) {
            $.extend(true, clazz.prototype, this.prototype);
            clazz.prototype.Extends.push(this);
        }
    });
};

/**
 * 实现接口属性
 */
$.Implements = function (clazz) {
    if ((!clazz) && (typeof (clazz) != "function"))
        return;

    $.each(arguments, function (i) {
        if (i > 0) {
            clazz.prototype.Implements.push(this);
            $.extend(true, clazz.prototype, this.prototype);
        }
    });
};