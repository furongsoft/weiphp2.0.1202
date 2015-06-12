/**
 * Created by zhoudingyun on 2015/6/9.
 */
var link;
window.onload = function(){
    link = window.location.href;
    InitConfig(link);
}

function InitConfig(url){
    mui.post('http://weixin.furongsoft.com/index.php?s=/Home/WXShare/GetConfig',{url:url},
        function(data){
            wx.config({
                debug: false,
                appId:data.appId,
                timestamp: data.timestamp,
                nonceStr:data.nonceStr,
                signature:data.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'onVoicePlayEnd',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'translateVoice',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            });
            wx.error(function(res){
                InitConfig(url);
                return;
            });
            Ready(url);
        },'json');
}

function Ready(link){
    wx.ready(function () {
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            complete: function (res) {
                SaveWXShare('','',link,'',res.errMsg);
            }
        });

        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
            complete: function (res) {
                SaveWXShare('','',link,'',res.errMsg);
            }
        });

        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareQQ({
            complete: function (res) {
                SaveWXShare('','',link,'',res.errMsg);
            }
        });

        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareWeibo({
            complete: function (res) {
                SaveWXShare('','',link,'',res.errMsg);
            }
        });
    });
}

function SaveWXShare(title,desc,link,imgUrl,rs){
    mui.post ('http://weixin.furongsoft.com/index.php?s=/Home/WXShare/SaveWXShare',{
        title:title,
        desc:desc,
        link:link,
        imgUrl:imgUrl,
        share_result:rs
    });
}