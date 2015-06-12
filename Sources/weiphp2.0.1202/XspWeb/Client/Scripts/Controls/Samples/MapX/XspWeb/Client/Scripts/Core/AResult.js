/**
 * Created by Alex on 2015/3/11.
 */
$.AResult = {
    AE_FAIL: function () {
        return new Error("AE_FAIL");
    },

    AE_INVALID_OPERATION: function () {
        return new Error("AE_INVALID_OPERATION");
    },

    AE_INVALIDARG: function () {
        return new Error("AE_INVALIDARG");
    }
};