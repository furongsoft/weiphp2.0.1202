<?php
        	
namespace Addons\WeVote\Model;
use Home\Model\WeixinModel;
        	
/**
 * WeVote的微信模型
 */
class WeixinAddonModel extends WeixinModel{
	function reply($dataArr, $keywordArr = array()) {
		//$config = getAddonConfig ( 'WeVote' ); // 获取后台插件的配置参数
		//dump($config);
        $param ['token'] = get_token ();
        $param ['openid'] = get_openid ();
        $url = addons_url ( 'WeVote://Home/WeVote', $param );
        $articles [0] = array (
            'Title' => '投票',
            'Description' => '第一武道会正式开始',
            'PicUrl' => ADDON_PUBLIC_PATH.'/images/a.jpg',
            'Url' => $url
        );

        $res = $this->replyNews ( $articles );

	}

	// 关注公众号事件
	public function subscribe() {
		return true;
	}
	
	// 取消关注公众号事件
	public function unsubscribe() {
		return true;
	}
	
	// 扫描带参数二维码事件
	public function scan() {
		return true;
	}
	
	// 上报地理位置事件
	public function location() {
		return true;
	}
	
	// 自定义菜单事件
	public function click() {
		return true;
	}	
}
        	