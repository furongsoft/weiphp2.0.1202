<?php

namespace Addons\AbcinfosendC;
use Common\Controller\Addon;

/**
 * 客服信息群发插件
 * @author 和蔼的木Q
 */

    class AbcinfosendCAddon extends Addon{

        public $info = array(
            'name'=>'AbcinfosendC',
            'title'=>'客服信息群发',
            'description'=>'只支持图文信息',
            'status'=>1,
            'author'=>'和蔼的木Q',
            'version'=>'0.1',
            'has_adminlist'=>1,
            'type'=>1         
        );

	public function install() {
		$install_sql = './Addons/AbcinfosendC/install.sql';
		if (file_exists ( $install_sql )) {
			execute_sql_file ( $install_sql );
		}
		return true;
	}
	public function uninstall() {
		$uninstall_sql = './Addons/AbcinfosendC/uninstall.sql';
		if (file_exists ( $uninstall_sql )) {
			execute_sql_file ( $uninstall_sql );
		}
		return true;
	}

        //实现的weixin钩子方法
        public function weixin($param){

        }

    }