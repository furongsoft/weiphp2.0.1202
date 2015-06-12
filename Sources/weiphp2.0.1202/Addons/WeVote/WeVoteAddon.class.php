<?php

namespace Addons\WeVote;

use Common\Controller\Addon;

/**
 * 微投票插件
 * @author Alex
 */
class WeVoteAddon extends Addon
{

    public $info = array(
        'name' => 'WeVote',
        'title' => '微投票',
        'description' => '',
        'status' => 1,
        'author' => 'Alex',
        'version' => '0.1',
        'has_adminlist' => 0,
        'type' => 1
    );

    public function install()
    {
        $install_sql = './Addons/WeVote/install.sql';
        if (file_exists($install_sql)) {
            execute_sql_file($install_sql);
        }
        return true;
    }

    public function uninstall()
    {
        $uninstall_sql = './Addons/WeVote/uninstall.sql';
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