/**
 * 定义杂项中文
 */
$.DeclareClass("XspWeb.Misc.Language", {
    /**
     * 静态成员
     */
    Static: {
        Tips: {
            CancelTheOperation: '操作取消。'
        },

        Ajax: {
            Timeout: '服务连接超时，可能原因：<br>1.网络断开或不稳定，请检查网络连接<br>2.服务未开启，请启动服务<br>3.服务配置出错，请检查web配置',
            Error: '服务连接出错。',
            NotFound: '404错误，可能原因：<br>1.文件路径指定出错，或者被修改<br>2.文件被移除<br><br>若有备份，请从备份中还原文件！',
            Abort: '服务已退出。',
            ParserError: '服务出错，可能原因：<br>1.返回XML类型数据<br>2.返回数据的头类型<br>3.编码问题',
            Unknown: '服务出错{0}。'
        },

        Pagination: {
            First: '第一页',
            Previous: '上一页',
            Next: '下一页',
            Last: '最后一页',
            Message: '当前第 {0} 页 / 共 {1} 页'
        },

        GISControl: {
            Metre: '米',
            Kilometre: '公里'
        }
    }
});