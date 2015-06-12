<?php

namespace Addons\WeVote\Controller;

use Addons\WeVote\Controller\BaseController;
use Addons\WeVote\Model\WeVoteConfigModel;
use Addons\WeVote\Model\WeVoteVisitorsModel;

class WeVoteController extends BaseController
{
    // 删除活动配置SQL语句
    private $SQL_DELETE_CONFIG;

    // 删除候选人SQL语句
    private $SQL_DELETE_CANDIDATE;

    // 删除投票信息SQL语句
    private $SQL_DELETE_VOTE_INFO;

    // 删除投票人信息SQL语句
    private $SQL_DELETE_VOTER_INFO;

    // 删除访问者信息SQL语句
    private $SQL_DELETE_VISITOR;

    public function __construct()
    {
        parent::__construct();

        // 删除活动配置SQL语句
        $this->SQL_DELETE_CONFIG = "DELETE FROM " . C('DB_PREFIX') . "wevote_config WHERE ";

        // 删除候选人SQL语句
        $this->SQL_DELETE_CANDIDATE = "DELETE FROM " . C('DB_PREFIX') . "wevote_candidates WHERE ";

        // 删除投票信息SQL语句
        $this->SQL_DELETE_VOTE_INFO = "DELETE FROM " . C('DB_PREFIX') . "wevote_info WHERE ";

        // 删除投票人信息SQL语句
        $this->SQL_DELETE_VOTER_INFO = "DELETE FROM " . C('DB_PREFIX') . "wevote_voters WHERE ";

        // 删除访问者信息SQL语句
        $this->SQL_DELETE_VISITOR = "DELETE FROM " . C('DB_PREFIX') . "wevote_visitors WHERE ";
    }

    public function Config()
    {
        // 获取参数
        $rows = 10;
        $page = (I('p', 1, 'intval') - 1) * $rows;

        // 进行查询
        $model = new WeVoteConfigModel();
        $data = $model->select();
        $count = $model->count();

        // 设置表头
        $fields = array();
        $fields[] = array('title' => '编号', 'name' => 'id', 'type' => 'num');
        $fields[] = array('title' => '活动介绍', 'name' => 'introduce', 'type' => 'string');
        $fields[] = array('title' => '活动日期', 'name' => 'datetime', 'type' => 'string');
        $fields[] = array('title' => '报名开始日期', 'name' => 'startSignUpDateTime', 'type' => 'datetime');
        $fields[] = array('title' => '报名截至日期', 'name' => 'stopSignUpDateTime', 'type' => 'datetime');
        $fields[] = array('title' => '活动截至日期', 'name' => 'stopDateTime', 'type' => 'datetime');
        $fields[] = array('title' => '每天投票次数', 'name' => 'votePerDay', 'type' => 'num');

        // 设置参数
        $this->assign('list_fields', $fields);
        $this->assign('list_data', $data);

        // 设置分页
        if ($count > $rows) {
            $page = new \Think\Page($count[0]['count'], $rows);
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
            $this->assign('_page', $page->show());
        }

        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/Config/List.html');
    }

    public function Add()
    {
        // 设置编辑内容
        $fields = array();
        $fields[] = array('title' => '活动介绍', 'name' => 'introduce', 'type' => 'string', 'value' => '', 'is_show' => 1);
        $fields[] = array('title' => '活动日期', 'name' => 'datetime', 'type' => 'string', 'value' => '', 'is_show' => 1);
        $fields[] = array('title' => '报名开始日期', 'name' => 'startSignUpDateTime', 'type' => 'datetime', 'value' => '', 'is_show' => 1);
        $fields[] = array('title' => '报名截至日期', 'name' => 'stopSignUpDateTime', 'type' => 'datetime', 'value' => '', 'is_show' => 1);
        $fields[] = array('title' => '活动截至日期', 'name' => 'stopDateTime', 'type' => 'datetime', 'value' => '', 'is_show' => 1);
        $fields[] = array('title' => '每天投票次数', 'name' => 'votePerDay', 'type' => 'num', 'value' => '', 'is_show' => 1);
        $fields[] = array('title' => '推广页面', 'remark' => '', 'name' => 'shareUrl', 'type' => 'string', 'value' => $field['shareUrl'], 'is_show' => 1);
        $fields[] = array('title' => '分享后跳转页面', 'remark' => '', 'name' => 'afterShareUrl', 'type' => 'string', 'value' => $field['afterShareUrl'], 'is_show' => 1);
        $fields[] = array('title' => '分享标题', 'remark' => '', 'name' => 'shareTitle', 'type' => 'string', 'value' => $field['shareTitle'], 'is_show' => 1);
        $fields[] = array('title' => '分享描述', 'remark' => '', 'name' => 'shareDesc', 'type' => 'string', 'value' => $field['shareDesc'], 'is_show' => 1);
        $fields[] = array('title' => '分享图片链接', 'remark' => '', 'name' => 'shareImageUrl', 'type' => 'string', 'value' => $field['shareImageUrl'], 'is_show' => 1);

        // 设置参数
        $this->assign('fields', $fields);
        $this->assign('post_url', addons_url('WeVote:/WeVote/AddAction'));

        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/Config/Add.html');
    }

    public function AddAction()
    {
        // 获取参数
        $introduce = I('introduce', '', 'string');
        $datetime = I('datetime', '', 'string');
        $startSignUpDateTime = I('startSignUpDateTime', '', 'string');
        $stopSignUpDateTime = I('stopSignUpDateTime', '', 'string');
        $stopDateTime = I('stopDateTime', '', 'string');
        $votePerDay = I('votePerDay', '', 'string');
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

        // 执行添加
        $model = new WeVoteConfigModel();
        $result = $model->data($data)->add();
        if ($result !== false)
            return $this->success('添加成功', addons_url('WeVote:/WeVote/Config'));
        else
            return $this->error('添加失败');
    }

    public function RemoveAction()
    {
        // 获取参数
        $ids = I('id', 0);
        if (empty ($ids))
            $ids = array_unique(( array )I('ids', 0));
        if (empty ($ids))
            return $this->error('请选择要操作的数据!');

        $sql1 = $this->SQL_DELETE_CONFIG;
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0)
                $sql1 = $sql1 . sprintf(" OR (id = %s)", $ids[$i]);
            else
                $sql1 = $sql1 . sprintf("(id = %s)", $ids[$i]);
        }

        $sql2 = $this->SQL_DELETE_CANDIDATE;
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0)
                $sql2 = $sql2 . sprintf(" OR (action_id = %s)", $ids[$i]);
            else
                $sql2 = $sql2 . sprintf("(action_id = %s)", $ids[$i]);
        }

        $sql3 = $this->SQL_DELETE_VOTE_INFO;
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0)
                $sql3 = $sql3 . sprintf(" OR (action_id = %s)", $ids[$i]);
            else
                $sql3 = $sql3 . sprintf("(action_id = %s)", $ids[$i]);
        }

        $sql4 = $this->SQL_DELETE_VOTER_INFO;
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0)
                $sql4 = $sql4 . sprintf(" OR (action_id = %s)", $ids[$i]);
            else
                $sql4 = $sql4 . sprintf("(action_id = %s)", $ids[$i]);
        }

        $sql5 = $this->SQL_DELETE_VISITOR;
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0)
                $sql5 = $sql5 . sprintf(" OR (action_id = %s)", $ids[$i]);
            else
                $sql5 = $sql5 . sprintf("(action_id = %s)", $ids[$i]);
        }

        $model = M();
        $model->startTrans();
        $ret1 = $model->execute($sql1);
        $ret2 = $model->execute($sql2);
        $ret3 = $model->execute($sql3);
        $ret4 = $model->execute($sql4);
        $ret5 = $model->execute($sql5);
        if (($ret1 !== false) && ($ret2 !== false) && ($ret3 !== false) && ($ret4 !== false) && ($ret5 !== false)) {
            $model->commit();
            return $this->success('删除成功', addons_url('WeVote:/WeVote/Config'));
        } else {
            $model->rollback();
            return $this->error('删除失败');
        }
    }
}