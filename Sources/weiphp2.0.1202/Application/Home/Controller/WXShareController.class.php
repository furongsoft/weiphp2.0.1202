<?php

namespace Home\Controller;

use Home\Controller\AddonsController;

class WXShareController extends AddonsController
{

    /**
     * 保存分享信息
     */
    public function SaveWXShare(){
        $open_id = get_openid();
        $title = $_POST["title"];
        $content = $_POST["desc"];
        $link = $_POST["link"];
        $imgUrl = $_POST["imgUrl"];
        $share_result = $_POST["share_result"];

        // 执行新增
        $sql = "INSERT INTO wp_wxshare(open_id,title,content,link,imgUrl,share_result) VALUES('".$open_id."','".$title."','".$content."','".$link."','".$imgUrl."','".$share_result."')";
        $model = M();
        $result = $model->execute($sql);
   }

    /**
     * 异步获取配置信息
     */
    public function GetConfig(){
        $url = $_POST["url"];
        $this->InitConfig($url);
    }

    /**
     * 组装配置信息
     * @param $url
     * return json
     */
    public function InitConfig($url)
    {
        $info = get_token_appinfo();
        //appId $appid = 'wxaa3ddf43e19630ee';    //$secret = '2946a5c98f49087208212f9bcba69379';
        $appid = $info['appid'];
        $secret = $info ['secret'];
        //生成签名的时间戳  //生成签名的随机串
        $nonceStr = $timestamp = 12345678901;
        $access_token = get_access_token();

        if(empty($access_token)){
            $auth = file_get_contents("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appid."&secret=".$secret);
            $token = json_decode($auth);
            $t = get_object_vars($token);//转换成数组
            $access_token = $t['access_token'];//输出access_token
        }

        $jsapi_contents  = file_get_contents("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=".$access_token."&type=jsapi");
        $jsapi = json_decode($jsapi_contents);
        $j = get_object_vars($jsapi);
        $jsapi_ticket = $j['ticket'];//get JSAPI

        $and = "jsapi_ticket=".$jsapi_ticket."&noncestr=".$nonceStr."&timestamp=".$timestamp."&url=".$url."";
        $signature = sha1($and);

        $arr['appId'] = $appid;
        $arr['timestamp'] = $timestamp;
        $arr['nonceStr'] = $nonceStr;
        $arr['signature'] = $signature;

        echo json_encode($arr); //输出json数据
    }
}