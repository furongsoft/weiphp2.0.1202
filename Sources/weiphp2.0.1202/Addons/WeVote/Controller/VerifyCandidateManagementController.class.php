<?php
/**
 * Created by PhpStorm.
 * User: Alex
 * Date: 2015/6/4
 * Time: 22:47
 */

namespace Addons\WeVote\Controller;

use Addons\WeVote\Controller\BaseController;

class VerifyCandidateManagementController extends BaseController
{
    // 查询所有待审核候选人SQL语句
    private $SQL_QUERY_CANDIDATES;

    // 查询所有待审核候选人总数SQL语句
    private $SQL_QUERY_CANDIDATES_COUNT;

    // 查询待审核候选人SQL语句
    private $SQL_QUERY_CANDIDATE;

    // 更新待审核候选人SQL语句
    private $SQL_UPDATE_CANDIDATE;

    // 验证待审核候选人SQL语句
    private $SQL_VERIFY_CANDIDATE;

    // 删除待审核候选人SQL语句
    private $SQL_DELETE_CANDIDATE;

    // 删除投票信息SQL语句
    private $SQL_DELETE_VOTE_INFO;

    public function __construct()
    {
        parent::__construct();

        // 查询所有待审核候选人SQL语句
        $this->SQL_QUERY_CANDIDATES =
            "SELECT *, COALESCE(T2.count2, 0) AS count FROM " . C('DB_PREFIX') . "wevote_candidates AS T1
LEFT JOIN (SELECT COUNT(id) AS count2, candidate_id FROM " . C('DB_PREFIX') . "wevote_info GROUP BY candidate_id) AS T2
ON T1.id = T2.candidate_id
WHERE (action_id = %d) AND (status = 0)
ORDER BY count DESC LIMIT %d, %d";

        // 查询所有待审核候选人总数SQL语句
        $this->SQL_QUERY_CANDIDATES_COUNT =
            "SELECT COUNT(id) AS count FROM " . C('DB_PREFIX') . "wevote_candidates WHERE (action_id = %d) AND  (status = 0)";

        // 查询待审核候选人SQL语句
        $this->SQL_QUERY_CANDIDATE = "SELECT * FROM " . C('DB_PREFIX') . "wevote_candidates WHERE (id = %d)";

        // 更新待审核候选人SQL语句
        $this->SQL_UPDATE_CANDIDATE = "UPDATE " . C('DB_PREFIX') . "wevote_candidates SET
title='%s', comment='%s', announce='%s', parent='%s', tel='%s', address='%s', cell='%s', picture='%s'
WHERE (id = %d)";

        // 验证待审核候选人SQL语句
        $this->SQL_VERIFY_CANDIDATE = "UPDATE " . C('DB_PREFIX') . "wevote_candidates SET status = 1 WHERE (id = %d)";

        // 删除待审核候选人SQL语句
        $this->SQL_DELETE_CANDIDATE = "DELETE FROM " . C('DB_PREFIX') . "wevote_candidates WHERE ";

        // 删除投票信息SQL语句
        $this->SQL_DELETE_VOTE_INFO = "DELETE FROM " . C('DB_PREFIX') . "wevote_info WHERE ";
    }

    public function Index()
    {
        // 获取参数
        $rows = 2;
        $page = (I('p', 1, 'intval') - 1) * $rows;

        // 进行查询
        $candidates = M();
        $sql = sprintf($this->SQL_QUERY_CANDIDATES, $this->mActionId, $page, $rows);
        $data = $candidates->query($sql);
        $sql = sprintf($this->SQL_QUERY_CANDIDATES_COUNT, $this->mActionId);
        $count = $candidates->query($sql);

        // 设置表头
        $fields = array();
        $fields[] = array('title' => '编号', 'name' => 'id', 'type' => 'num');
        $fields[] = array('title' => '名称', 'name' => 'title', 'type' => 'string');
        $fields[] = array('title' => '图片', 'name' => 'picture', 'type' => 'picture');

        // 设置参数
        $this->assign('list_fields', $fields);
        $this->assign('list_data', $data);
        $this->assign('remove_url', addons_url('WeVote:/VerifyCandidateManagement/RemoveAction', array('action_id' => $this->mActionId)));

        // 设置分页
        if ($count > $rows) {
            $page = new \Think\Page($count[0]['count'], $rows);
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
            $this->assign('_page', $page->show());
        }

        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/VerifyCandidateManagement/List.html');
    }

    public function Edit()
    {
        // 获取参数
        if (!I('id'))
            return $this->error('错误的参数');

        $id = I('id', 0, 'intval');

        $candidates = M();
        $sql = sprintf($this->SQL_QUERY_CANDIDATE, $id);
        $data = $candidates->query($sql);
        if (count($data) == 0)
            return $this->error('错误的参数');

        $field = $data[0];

        // 设置表头
        $fields = array();
        $fields[] = array('title' => '', 'remark' => '', 'name' => 'id', 'type' => 'num', 'value' => $id, 'is_show' => 4);
        $fields[] = array('title' => '', 'remark' => '', 'name' => 'action_id', 'type' => 'num', 'value' => $this->mActionId, 'is_show' => 4);
        $fields[] = array('title' => '名称', 'remark' => '', 'name' => 'title', 'type' => 'string', 'value' => $field['title'], 'is_show' => 1);
        $fields[] = array('title' => '自我介绍', 'remark' => '', 'name' => 'comment', 'type' => 'string', 'value' => $field['comment'], 'is_show' => 1);
        $fields[] = array('title' => '宣言', 'remark' => '', 'name' => 'announce', 'type' => 'string', 'value' => $field['announce'], 'is_show' => 1);
        $fields[] = array('title' => '家长姓名', 'remark' => '', 'name' => 'parent', 'type' => 'string', 'value' => $field['parent'], 'is_show' => 1);
        $fields[] = array('title' => '联系方式', 'remark' => '', 'name' => 'tel', 'type' => 'string', 'value' => $field['tel'], 'is_show' => 1);
        $fields[] = array('title' => '住宅名称', 'remark' => '', 'name' => 'address', 'type' => 'string', 'value' => $field['address'], 'is_show' => 1);
        $fields[] = array('title' => '楼层单元', 'remark' => '', 'name' => 'cell', 'type' => 'string', 'value' => $field['cell'], 'is_show' => 1);
        $fields[] = array('title' => '图片', 'remark' => '', 'name' => 'picture', 'type' => 'picture', 'value' => $field['picture'], 'is_show' => 1);

        // 设置参数
        $this->assign('fields', $fields);
        $this->assign('post_url', addons_url('WeVote:/VerifyCandidateManagement/EditAction'));

        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/VerifyCandidateManagement/Edit.html');
    }

    public function EditAction()
    {
        // 获取参数
        $id = I('id', NULL, 'intval');
        $title = I('title', '', 'string');
        $comment = I('comment', '', 'string');
        $announce = I('announce', '', 'string');
        $parent = I('parent', '', 'string');
        $tel = I('tel', '', 'string');
        $address = I('address', '', 'string');
        $cell = I('cell', '', 'string');
        $picture = I('picture', '', 'string');

        // 检查参数
        if ((empty($id))
            || ($title == '')
            || ($comment == '')
            || ($announce == '')
            || ($parent == '')
            || ($tel == '')
            || ($address == '')
            || ($cell == '')
            || ($picture == '')
        )
            return $this->error('错误的参数');

        // 执行修改
        $sql = sprintf($this->SQL_UPDATE_CANDIDATE, $title, $comment, $announce, $parent, $tel, $address, $cell, $picture, $id);
        $candidates = M();
        $result = $candidates->execute($sql);
        if ($result !== false)
            return $this->success('修改成功', addons_url('WeVote:/VerifyCandidateManagement/Index', array('action_id' => $this->mActionId)));
        else
            return $this->error('修改失败');
    }

    public function VerifyAction()
    {
        // 获取参数
        $id = I('id', NULL, 'intval');

        // 检查参数
        if (empty($id))
            return $this->error('错误的参数');

        // 执行修改
        $sql = sprintf($this->SQL_VERIFY_CANDIDATE, $id);
        $candidates = M();
        $result = $candidates->execute($sql);
        if ($result !== false)
            return $this->success('验证成功');
        else
            return $this->error('验证失败');
    }

    public function RemoveAction()
    {
        // 获取参数
        $ids = I('id', 0);
        if (empty ($ids))
            $ids = array_unique(( array )I('ids', 0));
        if (empty ($ids))
            return $this->error('请选择要操作的数据!');

        $sql1 = $this->SQL_DELETE_CANDIDATE;
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0)
                $sql1 = $sql1 . sprintf(" OR (id = %s)", $ids[$i]);
            else
                $sql1 = $sql1 . sprintf("(id = %s)", $ids[$i]);
        }

        $sql2 = $this->SQL_DELETE_VOTE_INFO;
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0)
                $sql2 = $sql2 . sprintf(" OR (candidate_id = %s)", $ids[$i]);
            else
                $sql2 = $sql2 . sprintf("(candidate_id = %s)", $ids[$i]);
        }

        $model = M();
        $model->startTrans();
        $ret1 = $model->execute($sql1);
        $ret2 = $model->execute($sql2);
        if (($ret1 !== false) && ($ret2 !== false)) {
            $model->commit();
            return $this->success('删除成功', addons_url('WeVote:/VerifyCandidateManagement/Index', array('action_id' => $this->mActionId)));
        } else {
            $model->rollback();
            return $this->error('删除失败');
        }
    }
}