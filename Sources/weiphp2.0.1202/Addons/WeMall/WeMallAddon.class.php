<?php

namespace Addons\WeMall;

use Common\Controller\Addon;

/**
 * 微商城A1插件
 * @author Alex
 */
class WeMallAddon extends Addon
{

    public $info = array(
        'name' => 'WeMall',
        'title' => '微商城A1',
        'description' => '微商城',
        'status' => 1,
        'author' => 'Alex',
        'version' => '0.1',
        'has_adminlist' => 0,
        'type' => 1
    );

    public function install()
    {
        $install_sql = './Addons/WeMall/install.sql';
        if (file_exists($install_sql)) {
            execute_sql_file($install_sql);
        }
        return true;
    }

    public function uninstall()
    {
        $uninstall_sql = './Addons/WeMall/uninstall.sql';
        if (file_exists($uninstall_sql)) {
            execute_sql_file($uninstall_sql);
        }
        return true;
    }

    //实现的weixin钩子方法
    public function weixin($param)
    {

    }
}