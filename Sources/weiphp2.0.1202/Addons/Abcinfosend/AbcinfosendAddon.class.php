<?php

namespace Addons\Abcinfosend;
use Common\Controller\Addon;

/**
 * 微信公众平台信息推送插件
 * @author 和蔼的木Q
 */

    class AbcinfosendAddon extends Addon{

        public $info = array(
            'name'=>'Abcinfosend',
            'title'=>'图文信息群发',
            'description'=>'通过高级群发接口推送图文信息',
            'status'=>1,
            'author'=>'和蔼的木Q',
            'version'=>'0.1',
            'has_adminlist'=>1,
            'type'=>1         
        );

	public function install() {
		$install_sql = './Addons/Abcinfosend/install.sql';
		if (file_exists ( $install_sql )) {
			execute_sql_file ( $install_sql );
		}
		return true;
	}
	public function uninstall() {
		$uninstall_sql = './Addons/Abcinfosend/uninstall.sql';
		if (file_exists ( $uninstall_sql )) {
			execute_sql_file ( $uninstall_sql );
		}
		return true;
	}

        //实现的weixin钩子方法
        public function weixin($param){

        }

    }