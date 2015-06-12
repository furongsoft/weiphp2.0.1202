<?php
/**
 * User: hy
 * Date: 2015-06-05
 * Time: 14:24
 */

namespace Common\Api;
class WeixinApi {

	//获取access_token
	public function get_access_token(){
	
		$map ['token'] = get_token ();
		$access_token = M('access_token')->where($map)->find();
		if (!empty($access_token['access_token']) && $access_token['expires_in'] + $access_token['create_time'] >= time()){
			return $access_token;
		}else{
			$info = M ( 'member_public' )->where ( $map )->find ();
			$url_get = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $info ['appid'] . '&secret=' . $info ['secret'];
			$data = json_decode(self::curlGet($url_get), true);
			if ($data ['errcode'] == 0) {
				$data['token'] = get_token();
				$data['create_time'] = time();
				if(empty($access_token)){
					M('access_token')->add($data);
				}else{
					M('access_token')->where($map)->setField($data);
				}
				return $data;
			}else{
				return $data;
			}
		}
	}
	
	public function curlPost($url, $data){
		$ch = curl_init();
		$header = "Accept-Charset: utf-8";
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$tmpInfo = curl_exec($ch);
		return $tmpInfo;
	}
	
    public function curlGet($url){
		$ch = curl_init();
		$header = "Accept-Charset: utf-8";
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$temp = curl_exec($ch);
		return $temp;
	}

	 public function getError($data=array()){
		switch ($data['errcode'])
		{
			case "-1":
				$data['errmsg'] = '系统繁忙';
			break;
			case "0":
				$data['errmsg'] = '请求成功';
			break;
			case "40001":
				$data['errmsg'] = '获取access_token时AppSecret错误，或者access_token无效';
			break;
			case "40002":
				$data['errmsg'] = '不合法的凭证类型';
			break;
			case "40003":
				$data['errmsg'] = '不合法的OpenID';
			break;
			case "40004":
				$data['errmsg'] = '不合法的媒体文件类型';
			break;
			case "40005":
				$data['errmsg'] = '不合法的文件类型';
			break;
			case "40005":
				$data['errmsg'] = '不合法的文件类型';
			break;
			case "40006":
				$data['errmsg'] = '不合法的文件大小';
			break;
			case "40007":
				$data['errmsg'] = '不合法的媒体文件id';
			break;
			case "40008":
				$data['errmsg'] = '不合法的消息类型';
			break;
			case "40009":
				$data['errmsg'] = '不合法的图片文件大小';
			break;
			case "40010":
				$data['errmsg'] = '不合法的语音文件大小';
			break;
			case "40011":
				$data['errmsg'] = '不合法的视频文件大小';
			break;
			case "40012":
				$data['errmsg'] = '不合法的缩略图文件大小';
			break;
			case "40013":
				$data['errmsg'] = '不合法的APPID';
			break;
			case "40014":
				$data['errmsg'] = '不合法的access_token';
			break;
			case "40029":
				$data['errmsg'] = '不合法的oauth_code';
			break;
			case "40030":
				$data['errmsg'] = '不合法的refresh_token';
			break;
			case "40031":
				$data['errmsg'] = '不合法的openid列表';
			break;
			case "40032":
				$data['errmsg'] = '不合法的openid列表长度';
			break;
			case "40033":
				$data['errmsg'] = '不合法的请求字符，不能包含\uxxxx格式的字符';
			break;
			case "40035":
				$data['errmsg'] = '不合法的参数';
			break;
			case "40038":
				$data['errmsg'] = '不合法的请求格式';
			break;
			case "40039":
				$data['errmsg'] = '不合法的URL长度';
			break;
			case "40050":
				$data['errmsg'] = '不合法的分组id';
			break;
			case "40051":
				$data['errmsg'] = '分组名字不合法';
			break;
			case "41001":
				$data['errmsg'] = '缺少access_token参数';
			break;
			case "41002":
				$data['errmsg'] = '缺少appid参数';
			break;
			case "41003":
				$data['errmsg'] = '缺少refresh_token参数';
			break;
			case "41004":
				$data['errmsg'] = '缺少secret参数';
			break;
			case "41005":
				$data['errmsg'] = '缺少多媒体文件数据';
			break;
			case "41006":
				$data['errmsg'] = '缺少media_id参数';
			break;
			case "41007":
				$data['errmsg'] = '缺少子菜单数据';
			break;
			case "41008":
				$data['errmsg'] = '缺少oauth code';
			break;
			case "41009":
				$data['errmsg'] = '缺少openid';
			break;
			case "42001":
				$data['errmsg'] = 'access_token超时';
			break;
			case "42002":
				$data['errmsg'] = 'refresh_token超时';
			break;
			case "42003":
				$data['errmsg'] = 'oauth_code超时';
			break;
			case "43001":
				$data['errmsg'] = '需要GET请求';
			break;
			case "43002":
				$data['errmsg'] = '需要POST请求';
			break;
			case "43003":
				$data['errmsg'] = '需要HTTPS请求';
			break;
			case "43004":
				$data['errmsg'] = '需要接收者关注';
			break;
			case "43005":
				$data['errmsg'] = '需要好友关系';
			break;
			case "44001":
				$data['errmsg'] = '多媒体文件为空';
			break;
			case "44002":
				$data['errmsg'] = 'POST的数据包为空';
			break;
			case "44003":
				$data['errmsg'] = '图文消息内容为空';
			break;
			case "44004":
				$data['errmsg'] = '文本消息内容为空';
			break;
			case "45001":
				$data['errmsg'] = '多媒体文件大小超过限制';
			break;
			case "45002":
				$data['errmsg'] = '消息内容超过限制';
			break;
			case "45003":
				$data['errmsg'] = '标题字段超过限制';
			break;
			case "45004":
				$data['errmsg'] = '描述字段超过限制';
			break;
			case "45005":
				$data['errmsg'] = '链接字段超过限制';
			break;
			case "45006":
				$data['errmsg'] = '图片链接字段超过限制';
			break;
			case "45007":
				$data['errmsg'] = '语音播放时间超过限制';
			break;
			case "45008":
				$data['errmsg'] = '图文消息超过限制';
			break;
			case "45009":
				$data['errmsg'] = '接口调用超过限制';
			break;
			case "45015":
				$data['errmsg'] = '回复时间超过限制';
			break;
			case "45016":
				$data['errmsg'] = '系统分组，不允许修改';
			break;
			case "45017":
				$data['errmsg'] = '分组名字过长';
			break;
			case "45018":
				$data['errmsg'] = '分组数量超过上限';
			break;
			case "46001":
				$data['errmsg'] = '不存在媒体数据';
			break;
			case "46004":
				$data['errmsg'] = '不存在的用户';
			break;
			case "47001":
				$data['errmsg'] = '解析JSON/XML内容错误';
			break;
			case "48001":
				$data['errmsg'] = 'api功能未授权';
			break;
			case "50001":
				$data['errmsg'] = '用户未授权该api';
			break;
		}
		return $data;
	 }
}