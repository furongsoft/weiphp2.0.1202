<?php
/**
 * Created by PhpStorm.
 * User: Alex
 * Date: 2015/6/4
 * Time: 22:52
 */

namespace Addons\WeVote\Controller;

use Home\Controller\AddonsController;

class BaseController extends AddonsController
{
    // 投票活动索引
    protected $mActionId;

    function _initialize()
    {
        // TAB分页界面管理
        $url = _CONTROLLER;
        $nav = array();

        if (strcasecmp($url, 'WeVote') == 0) {
            $res['title'] = '投票活动列表';
            $res['url'] = addons_url('WeVote:/WeVote/Config');
            $res['class'] = (strcasecmp($url, 'WeVote') == 0) ? 'current' : '';
            $nav[] = $res;
        } else {
            // 获取参数
            if (I('request.action_id'))
                $this->mActionId = I('request.action_id', 0, 'intval');
            else
                return $this->error('错误的参数');

            $res['title'] = '返回投票活动列表';
            $res['url'] = addons_url('WeVote:/WeVote/Config');
            $res['class'] = (strcasecmp($url, 'WeVote') == 0) ? 'current' : '';
            $nav[] = $res;

            $res['title'] = '投票配置';
            $res['url'] = addons_url('WeVote:/Config/Index', array('action_id' => $this->mActionId));
            $res['class'] = (strcasecmp($url, 'Config') == 0) ? 'current' : '';
            $nav[] = $res;

            $res['title'] = '图片配置';
            $res['url'] = addons_url('WeVote:/HeadPictureManagement/Index', array('action_id' => $this->mActionId));
            $res['class'] = (strcasecmp($url, 'HeadPictureManagement') == 0) ? 'current' : '';
            $nav[] = $res;

            $res['title'] = '候选人管理';
            $res['url'] = addons_url('WeVote:/CandidateManagement/Index', array('action_id' => $this->mActionId));
            $res['class'] = (strcasecmp($url, 'CandidateManagement') == 0) ? 'current' : '';
            $nav[] = $res;

            $res['title'] = '待验证管理';
            $res['url'] = addons_url('WeVote:/VerifyCandidateManagement/Index', array('action_id' => $this->mActionId));
            $res['class'] = (strcasecmp($url, 'VerifyCandidateManagement') == 0) ? 'current' : '';
            $nav[] = $res;
        }

        $this->assign('nav', $nav);
    }
}