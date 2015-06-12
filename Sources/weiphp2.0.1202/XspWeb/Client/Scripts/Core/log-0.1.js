/**
 * 输出信息日志
 *
 * @param {Object}
 *        message 信息日志
 */
$.LogI = function (message) {

    var date = new Date();
    document.writeln("[" + date.toTimeString() + " " + date.getMilliseconds() + "] " + message);
};