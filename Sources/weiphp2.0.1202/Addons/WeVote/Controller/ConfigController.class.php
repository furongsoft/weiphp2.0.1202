<?php

namespace Addons\WeVote\Controller;

use Addons\WeVote\Controller\BaseController;
use Addons\WeVote\Model\WeVoteConfigModel;
use Addons\WeVote\Model\WeVoteVisitorsModel;

class ConfigController extends BaseController
{
    public function Index()
    {
        $model = new WeVoteConfigModel();
        $data = $model->where('id = ' . $this->mActionId)->select();
        if (empty($data) || (count($data) == 0))
            return $this->error('配置文件不存在');

        $field = $data[0];

        // 设置编辑内容
        $fields = array();
        $fields[] = array('title' => '', 'remark' => '', 'name' => 'action_id', 'type' => 'num', 'value' => $this->mActionId, 'is_show' => 4);
        $fields[] = array('title' => '活动介绍', 'remark' => '', 'name' => 'introduce', 'type' => 'string', 'value' => $field['introduce'], 'is_show' => 1);
        $fields[] = array('title' => '活动日期', 'remark' => '', 'name' => 'datetime', 'type' => 'string', 'value' => $field['datetime'], 'is_show' => 1);
        $fields[] = array('title' => '报名开始日期', 'remark' => '', 'name' => 'startSignUpDateTime', 'type' => 'datetime', 'value' => $field['startSignUpDateTime'], 'is_show' => 1);
        $fields[] = array('title' => '报名截至日期', 'remark' => '', 'name' => 'stopSignUpDateTime', 'type' => 'datetime', 'value' => $field['stopSignUpDateTime'], 'is_show' => 1);
        $fields[] = array('title' => '活动截至日期', 'remark' => '', 'name' => 'stopDateTime', 'type' => 'datetime', 'value' => $field['stopDateTime'], 'is_show' => 1);
        $fields[] = array('title' => '每天投票次数', 'remark' => '', 'name' => 'votePerDay', 'type' => 'num', 'value' => $field['votePerDay'], 'is_show' => 1);
        $fields[] = array('title' => '推广页面', 'remark' => '', 'name' => 'shareUrl', 'type' => 'string', 'value' => $field['shareUrl'], 'is_show' => 1);
        $fields[] = array('title' => '分享后跳转页面', 'remark' => '', 'name' => 'afterShareUrl', 'type' => 'string', 'value' => $field['afterShareUrl'], 'is_show' => 1);
        $fields[] = array('title' => '分享标题', 'remark' => '', 'name' => 'shareTitle', 'type' => 'string', 'value' => $field['shareTitle'], 'is_show' => 1);
        $fields[] = array('title' => '分享描述', 'remark' => '', 'name' => 'shareDesc', 'type' => 'string', 'value' => $field['shareDesc'], 'is_show' => 1);
        $fields[] = array('title' => '分享图片链接', 'remark' => '', 'name' => 'shareImageUrl', 'type' => 'string', 'value' => $field['shareImageUrl'], 'is_show' => 1);

        // 设置参数
        $this->assign('fields', $fields);
        $this->assign('post_url', addons_url('WeVote:/Config/EditAction'));

        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/Config/Config.html');
    }

    public function EditAction()
    {
        $introduce = I('introduce', '', 'string');
        $datetime = I('datetime', '', 'string');
        $startSignUpDateTime = I('startSignUpDateTime', '', 'string');
        $stopSignUpDateTime = I('stopSignUpDateTime', '', 'string');
        $stopDateTime = I('stopSignUpDateTime', '', 'string');
        $votePerDay = I('votePerDay', 0, 'intval');
        $shareUrl = I('shareUrl', '', 'string');
        $afterShareUrl = I('afterShareUrl', '', 'string');
        $shareTitle = I('shareTitle', '', 'string');
        $shareDesc = I('shareDesc', '', 'string');
        $shareImageUrl = I('shareImageUrl', '', 'string');

        // 检查参数
        if (($introduce == '')
            || ($datetime == '')
            || ($startSignUpDateTime == '')
            || ($stopSignUpDateTime == '')
            || ($stopDateTime == '')
            || ($votePerDay == '')
            || ($shareUrl == '')
            || ($afterShareUrl == '')
            || ($shareTitle == '')
            || ($shareDesc == '')
            || ($shareImageUrl == '')
        )
            return $this->error('错误的参数');

        $data = array(
            'introduce' => $introduce,
            'datetime' => $datetime,
            'startSignUpDateTime' => $startSignUpDateTime,
            'stopSignUpDateTime' => $stopSignUpDateTime,
            'stopDateTime' => $stopDateTime,
            'votePerDay' => $votePerDay,
            'shareUrl' => $shareUrl,
            'afterShareUrl' => $afterShareUrl,
            'shareTitle' => $shareTitle,
            'shareDesc' => $shareDesc,
            'shareImageUrl' => $shareImageUrl,
        );

        // 执行修改
        $model = new WeVoteConfigModel();
        $result = $model->where('id = ' . $this->mActionId)->save($data);
        if ($result !== false)
            return $this->success('修改成功');
        else
            return $this->error('修改失败');
    }
}