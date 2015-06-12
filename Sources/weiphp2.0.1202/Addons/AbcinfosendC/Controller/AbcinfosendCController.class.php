<?php

namespace Addons\AbcinfosendC\Controller;
use Home\Controller\AddonsController;
use Addons\Abcinfosend\Api\Wechat;

class AbcinfosendCController extends AddonsController{
	/**
	 * 显示列表数据
	 */
	public function lists() {
		$token = get_token ();
		// $mapinfo['token'] = $token;
	 //    $info = M ( 'member_public' )->where ( $mapinfo )->find ();
		// $this->assign ( 'info', $info );
		// $options = array(
		// 	'token'=>'weiphp', //填写你设定的key,本系统中固定weiphp
		// 	'appid'=>$info['appid'], 
		// 	'appsecret'=>$info['secret'], 
		// );

	 // 	$weObj = new Wechat($options);
		// //$accesstoken = $weObj->checkAuth($info['appid'],$info['secret']);

	 // 	$togroup = $weObj->getGroup();
	 // 	$this->assign ( 'togroup', $togroup['groups'] );

		$model = $this->getModel ( 'abcinfosendc' );

		$list_grids = $this->_list_grid ( $model );

		parent::common_lists ( $model );

	}



	/**
	 * 发布推送的信息到所有关注用户
	 */
	public function send(){

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

		foreach ($sendlists as $key => $value) {
			$newdata['articles'][] = array(
				"title"=>$value['title'],
				"description"=>$value['description'],
				"url"=>$value['url'],
				"picurl"=>$value['picurl']
				);
		}


		$senddata = array(
			'touser' => '',
			'msgtype' => 'news',
			'news' => $newdata
			);

		$mapinfo['token'] = $token;
	    $info = M ( 'member_public' )->where ( $mapinfo )->find ();
		$this->assign ( 'info', $info );

		$options = array(
			'token'=>'weiphp', //填写你设定的key,本系统中固定weiphp
			'appid'=>$info['appid'], 
			'appsecret'=>$info['secret'], 
		);

	 	$weObj = new Wechat($options);
		$userlist = $weObj->getUserList();
		$oksum = 0;
		foreach ($userlist['data']['openid'] as $key => $value) {
			$senddata['touser'] = $value;
			$result = $weObj->sendCustomMessage($senddata);
			if ($result) {
				$oksum++;
			}
		}

		$this->success ( '消息群发完成，共计'.$oksum.'用户接收消息。' );

	}







}
