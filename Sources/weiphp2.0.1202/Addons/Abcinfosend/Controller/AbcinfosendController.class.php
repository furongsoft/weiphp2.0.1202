<?php

namespace Addons\Abcinfosend\Controller;
use Home\Controller\AddonsController;
use Addons\Abcinfosend\Api\Wechat;

class AbcinfosendController extends AddonsController{
	/**
	 * 显示列表数据
	 */
	public function lists() {
		$token = get_token ();
		$mapinfo['token'] = $token;
	    $info = M ( 'member_public' )->where ( $mapinfo )->find ();
		$this->assign ( 'info', $info );
		$options = array(
			'token'=>'weiphp', //填写你设定的key,本系统中固定weiphp
			'appid'=>$info['appid'], 
			'appsecret'=>$info['secret'], 
		);

	 	$weObj = new Wechat($options);
		//$accesstoken = $weObj->checkAuth($info['appid'],$info['secret']);

	 	$togroup = $weObj->getGroup();
	 	$this->assign ( 'togroup', $togroup['groups'] );

		$model = $this->getModel ( 'abcinfosend' );

		$list_grids = $this->_list_grid ( $model );

		parent::common_lists ( $model );


	}

	/**
	 * 发布推送的信息到所有关注用户
	 */
	public function send(){

       // $this->error ( '群发失败！错误:');
       // return;
		$togroup = I("togroup");




		//生成需要发送的数据
		is_array ( $model ) || $model = $this->getModel ( $model );
		
		! empty ( $ids ) || $ids = I ( 'id' );
		! empty ( $ids ) || $ids = array_unique ( ( array ) I ( 'ids', 0 ) );
		! empty ( $ids ) || $this->error ( '请选择要操作的数据!' );
		
		$Model = M ( get_table_name ( $model ['id'] ) );
		$map ['id'] = array (
				'in',
				$ids 
		);

		// 插件里的操作自动加上Token限制
		$token = get_token ();
		if (defined ( 'ADDON_PUBLIC_PATH' ) && ! empty ( $token )) {
			$map ['token'] = $token;
		}

		$sendlists = $Model->where ( $map )->order('sort asc')->select();

		if (!$sendlists) {
			$this->error ( '请选择要操作的数据!' );
		};

		$senddata = array("articles"=>array());

		foreach ($sendlists as $key => $value) {
			$senddata['articles'][]=array(
				'thumb_media_id'=>$value['thumb_media_id'],
				'author'=>$value['author'],
				'title'=>$value['title'],
				'content_source_url'=>$value['content_source_url'],
				'content'=>$value['content'],
				'digest'=>$value['digest'],
				'show_cover_pic'=>$value['show_cover_pic']
				);
		};

		//发送数据操作
		$mapinfo['token'] = $token;
	    $info = M ( 'member_public' )->where ( $mapinfo )->find ();
		$this->assign ( 'info', $info );

		$options = array(
			'token'=>'weiphp', //填写你设定的key,本系统中固定weiphp
			'appid'=>$info['appid'], 
			'appsecret'=>$info['secret'], 
		);

	 	$weObj = new Wechat($options);
	 	$accesstoken = $weObj->checkAuth($info['appid'],$info['secret']);

	 	$result = $weObj->uploadnews($senddata);
	 	if (!$result) {
	 		$this->error ( '推送信息生成失败：'.$weObj->errCode.$weObj->errmsg );
	 	};

	 	$sendmedia_id = $result['media_id'];
		

		if ($togroup == -1) {
			
		}
		else
		{
			$result = $weObj->sendall($togroup,$sendmedia_id);
			if ($result) {
	 			if ($result['errcode']!=0) {
	 				$this->error ( '群发失败！错误:'.$result['errcode'].$result['errmsg'] );

	 			}
	 			else{
	 				$this->success ( '群发完成:'.$result['errmsg'] );
	 			}
	 		}
	 		else {
	 			$this->error ( '群发失败！');
	 		}
		}
	}

	/**
	 * 上传图片到公众平台
	 */
	public function createthumbID() {
		$map ['token'] = get_token ();
	    $info = M ( 'member_public' )->where ( $map )->find ();
		$this->assign ( 'info', $info );


		$options = array(
			'token'=>'weiphp', //填写你设定的key
			'appid'=>$info['appid'], //填写高级调用功能的app id
			'appsecret'=>$info['secret'], //填写高级调用功能的密钥
		);

	 	$weObj = new Wechat($options);
	 	$accessToken = $weObj->checkAuth($info['appid'],$info['secret']);

		$imgid = I('thumbimgid');

		$imgpath = get_cover($imgid,'path');

		$file = realpath(substr($imgpath,1)); //要上传的文件
		$fields['media'] = '@'.$file;
		$ch = curl_init();

		$apipath = "http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token=$accessToken&type=image";
		curl_setopt($ch, CURLOPT_URL,$apipath);
		curl_setopt($ch, CURLOPT_POST, 1 );
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);


        $sContent =curl_exec ($ch);
        $sContent1 =$sContent;
        $aStatus = curl_getinfo($ch);
		curl_close ($ch);

	}



}
