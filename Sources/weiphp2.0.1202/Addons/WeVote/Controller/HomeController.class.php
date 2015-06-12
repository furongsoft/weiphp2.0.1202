<?php
/**
 * User:chenfuqian
 * Date: 2015/6/6
 * Time: 17:14
 * Description：
 */
namespace Addons\WeVote\Controller;

use Home\Model\PictureModel;
use Home\Controller\AddonsController;
use Addons\WeVote\Model\WeVoteConfigModel;
use Addons\WeVote\Model\WeVoteVotersModel;
use Addons\WeVote\Model\WeVoteCandidatesModel;
use Addons\WeVote\Model\WeVoteInfoModel;
use Addons\WeVote\Model\WeVoteVisitorsModel;
use Addons\WeVote\Model\WeVoteShareModel;
use Addons\WeVote\Model\HeadPictureManagementModel;

class HomeController extends AddonsController
{
    // 图片保存路径
    const PICTURE_PATH = 'Uploads/Picture/';

    // 查询得票最高候选人SQL语句
    private $SQL_QUERY_CANDIDATES;

    // 查询最新候选人SQL语句
    private $SQL_QUERY_CANDIDATES_LATEST;

    // 查询所有候选人SQL语句
    private $SQL_QUERY_CANDIDATES_ALL;

    // 查询投票情况SQL语句
    private $SQL_QUERY_VoteInfo;

    // 查询所有候选人SQL语句条件
    const SQL_QUERY_CANDIDATES_CONDITION_BY_ID = " AND (T1.id = %s)";

    // 查询所有候选人SQL语句条件
    const SQL_QUERY_CANDIDATES_CONDITION_BY_TITLE = " AND (T1.title LIKE '%%%s%%')";

    public function __construct()
    {
        parent::__construct();

        $this->SQL_QUERY_CANDIDATES =
            "SELECT *, COALESCE(T2.count2, 0) AS count FROM " . C('DB_PREFIX') . "wevote_candidates AS T1
LEFT JOIN (SELECT COUNT(id) AS count2, candidate_id FROM " . C('DB_PREFIX') . "wevote_info GROUP BY candidate_id) AS T2
ON T1.id = T2.candidate_id
WHERE (action_id = %d) AND (status = 1) %s
ORDER BY count DESC LIMIT %d, %d";

        $this->SQL_QUERY_CANDIDATES_LATEST =
            "SELECT *, COALESCE(T2.count2, 0) AS count FROM " . C('DB_PREFIX') . "wevote_candidates AS T1
LEFT JOIN (SELECT COUNT(id) AS count2, candidate_id FROM " . C('DB_PREFIX') . "wevote_info GROUP BY candidate_id) AS T2
ON T1.id = T2.candidate_id
WHERE (action_id = %d) AND (status = 1) %s
ORDER BY T1.datetime DESC LIMIT %d, %d";

        $this->SQL_QUERY_CANDIDATES_ALL =
            "SELECT *, COALESCE(T2.count2, 0) AS count FROM " . C('DB_PREFIX') . "wevote_candidates AS T1
LEFT JOIN (SELECT COUNT(id) AS count2, candidate_id FROM " . C('DB_PREFIX') . "wevote_info GROUP BY candidate_id) AS T2
ON T1.id = T2.candidate_id
WHERE (action_id = %d) AND (status = 1) %s
ORDER BY T1.id DESC LIMIT %d, %d";

        $this->SQL_QUERY_VoteInfo =
            "SELECT c.title,COUNT(0) num FROM " . C('DB_PREFIX') . "wevote_voters AS v
LEFT JOIN  " . C('DB_PREFIX') . "wevote_info i ON v.id = i.voter_id
LEFT JOIN " . C('DB_PREFIX') . "wevote_candidates c ON i.candidate_id = c.id
WHERE (v.openid = '%s') AND (v.action_id = %d) GROUP BY c.title";
    }

    public function Index()
    {
        $openId = I('request.open_id', NULL, "string");
        if (!$openId)
            $openId = get_openid();

        $actionId = I('action_id', 0, "intval");
        $type = I('type', 'latest', "string");
        $query = I('query', NULL, "string");

        // 增加访问记录
        $this->AddVisitor($actionId, $openId);

        $model = new WeVoteCandidatesModel();
        $candidatesCount = $model->where('action_id = ' . $actionId)->count();

        $model = new WeVoteInfoModel();
        $voteCount = $model->where('action_id = ' . $actionId)->count();

        $model = new WeVoteVisitorsModel();
        $visitCount = $model->where('action_id = ' . $actionId)->count();

        if (strcasecmp($type, 'latest') == 0)
            $candidatesData = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_LATEST, $actionId, $query, 1, 10);
        else
            $candidatesData = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_ALL, $actionId, $query, 1, 10);

        $model = new WeVoteConfigModel();
        $data = $model->where('id = ' . $actionId)->find();
        if (($data === FALSE) || (!$data))
            return $this->error('活动已失效');

        $model=new HeadPictureManagementModel();
        $picdata = $model->field('picurl,picid')->where(array('configid' => $actionId))->order('orderno')->select();

        $this->assign('action_id', $actionId);
        $this->assign('candidatesCount', $candidatesCount);
        $this->assign('voteCount', $voteCount);
        $this->assign('visitCount', $visitCount);
        $this->assign('type', $type);
        $this->assign('introduce', $data['introduce']);
        $this->assign('datetime', $data['datetime']);
        $this->assign('candidatesData', $candidatesData);
        $this->assign('currentPage', 1);
        $this->assign('signPackage', GetSignPackage());
        $this->assign('share_url', addons_url('WeVote:/Home/ShareAction'));
        $this->assign('shareUrl', $data['shareUrl']);
        $this->assign('afterShareUrl', $data['afterShareUrl']);
        $this->assign('shareTitle', $data['shareTitle']);
        $this->assign('shareDesc', $data['shareDesc']);
        $this->assign('shareImageUrl', $data['shareImageUrl']);
        $this->assign('headpic', $picdata);

        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Home/Index.html');
    }

    public function GetCandidatesAction()
    {
        $type = I('type', 'latest', "string");
        $actionId = I('action_id', 0, "intval");
        $query = I('query', NULL, "string");
        $page = I('page', 1, 'intval');
        $rows = I('rows', 1, 'intval');

        if (strcasecmp($type, 'latest') == 0) {
            $data = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_LATEST, $actionId, $query, $page, $rows);
            echo json_encode(array('data' => $data, 'currentType' => $type, 'currentPage' => $page));
        } else if (strcasecmp($type, 'all') == 0) {
            $data = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_ALL, $actionId, $query, $page, $rows);
            echo json_encode(array('data' => $data, 'currentType' => $type, 'currentPage' => $page));
        } else {
            $data = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_ALL, $actionId, $query, $page, $rows);
            echo json_encode(array('data' => $data, 'currentType' => $type, 'currentPage' => $page));
        }
    }

    /**
     * 报名
     */
    public function Registration()
    {
        // 获取参数
        if (!I('action_id'))
            return $this->error('错误的参数');

        $actionId = I('action_id', 0, "intval");
        $openId = I('open_id', NULL, "string");

        // 检查报名时间
        $checkSignUpDateTime = $this->CheckSignUpDateTime($actionId);
        if ($checkSignUpDateTime == 'fail')
            return $this->error('错误的参数');
        else if ($checkSignUpDateTime == 'nonStart')
            return $this->error('活动未开始');
        else if ($checkSignUpDateTime == 'over')
            return $this->error('报名已结束');

        if (IS_POST) {
            // 获取参数
            $title = I('title', '', 'string');
            $comment = I('comment', '', 'string');
            $announce = I('announce', '', 'string');
            $parent = I('parent', '', 'string');
            $tel = I('tel', '', 'string');
            $address = I('address', '', 'string');
            $cell = I('cell', '', 'string');

            // 检查参数
            if (($title == '')
                || ($comment == '')
                || ($announce == '')
                || ($parent == '')
                || ($tel == '')
                || ($address == '')
                || ($cell == '')
            )
                return $this->error('请填写必填内容');

            if (empty($_FILES['cameraInput']['name']))
                return $this->error('请上传照片');

            srand(microtime(true) * 1000);
            $_FILES['cameraInput']['name'] = time() . rand(1, 1000) . $_FILES['cameraInput']['name'];

            $picture = D('Picture');
            $picDriver = C('PICTURE_UPLOAD_DRIVER');
            $info = $picture->upload(
                $_FILES,
                C('PICTURE_UPLOAD'),
                C('PICTURE_UPLOAD_DRIVER'),
                C("UPLOAD_{$picDriver}_CONFIG")
            );

            $data = array(
                'action_id' => $actionId,
                'openid' => $openId,
                'title' => $title,
                'comment' => $comment,
                'announce' => $announce,
                'parent' => $parent,
                'picture' => $info['cameraInput']['id'],
                'address' => $address,
                'cell' => $cell,
                'tel' => $tel,
                'datetime' => date('Y-m-d H:i:s', time()),
                'status' => '0'
            );

            $model = new WeVoteCandidatesModel();
            $ret = $model->data($data)->add();
            if ($ret !== false)
                return $this->success('报名成功,请等待审核', addons_url('WeVote:/Home/Index', array('action_id' => $actionId)));
            else
                return $this->error('报名失败,请稍后再试', addons_url('WeVote:/Home/Index', array('action_id' => $actionId)));
        } else {
            $this->assign('action_id', $actionId);
            $this->assign('open_id', ($openId || get_openid()));
            $this->assign('signPackage', GetSignPackage());
            $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Home/Registration.html');
        }
    }

    public function Detail()
    {
        // 获取参数
        if (!I('action_id'))
            return $this->error('错误的参数');

        $actionId = I('action_id', 0, "intval");
        $id = I('id', 1, "intval");

        $model = new WeVoteCandidatesModel();
        $candidates = $model->field('id, title, comment, announce, picture')->where('id = ' . $id)->select();
        if (empty($candidates) || (count($candidates) != 1))
            return $this->error('错误的参数');

        $model = new WeVoteCandidatesModel();
        $candidatesCount = $model->count();

        $model = new WeVoteInfoModel();
        $voteCount = $model->count();

        $model = new WeVoteVisitorsModel();
        $visitCount = $model->count();

        $oneData = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_ALL, $actionId, $id, 1, 1);
        $topData = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_ALL, $actionId, null, 1, 10);
        $index = 0;
        foreach ($topData as &$vo) {
            $vo['no'] = ++$index;
        }

        $model = new WeVoteConfigModel();
        $data = $model->where('id = ' . $actionId)->find();
        if (($data === FALSE) || (!$data))
            return $this->error('活动已失效');

        $this->assign('action_id', $actionId);
        $this->assign('candidate', $candidates[0]);
        $this->assign('candidatesCount', $candidatesCount);
        $this->assign('oneData', $oneData[0]);
        $this->assign('topData', $topData);
        $this->assign('introduce', $data['introduce']);
        $this->assign('datetime', $data['datetime']);
        $this->assign('voteCount', $voteCount);
        $this->assign('visitCount', $visitCount);
        $this->assign('signPackage', GetSignPackage());
        $this->assign('currentLatestPage', 1);
        $this->assign('currentAllPage', 1);
        $this->assign('share_url', addons_url('WeVote:/Home/ShareAction'));
        $this->assign('shareUrl', $data['shareUrl']);
        $this->assign('afterShareUrl', $data['afterShareUrl']);
        $this->assign('shareTitle', $data['shareTitle']);
        $this->assign('shareDesc', $data['shareDesc']);
        $this->assign('shareImageUrl', $data['shareImageUrl']);

        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Home/Detail.html');
    }

    // 投票
    public function VoteAction()
    {
        if (!I('action_id')
            || !I('candidate_id')
        )
            return $this->error('错误的参数');

        $actionId = I('action_id', 0, "intval");
        $openId = I('open_id', NULL, "string");
        if (!$openId)
            $openId = get_openid();
        $candidateId = I('candidate_id', 0, "intval");

        // 检查报名时间
        $checkVoteDateTime = $this->checkVoteDateTime($actionId);
        if ($checkVoteDateTime == 'fail')
            return $this->error('错误的参数');
        else if ($checkVoteDateTime == 'nonStart')
            return $this->error('投票未开始');
        else if ($checkVoteDateTime == 'over')
            return $this->error('活动已结束');

        $model = new WeVoteConfigModel();
        $config = $model->where('id = ' . $actionId)->find();
        if (($config === false) || (empty($config)))
            return $this->error('错误的参数');

        $model = new WeVoteVotersModel();
        $voter = $model->where('openid = \'' . $openId . '\'')->find();
        if (($voter !== false) && (!empty($voter))) {
            $model = new WeVoteInfoModel();
            $y = date("Y"); // 首先用php获取当天的年份
            $m = date("m"); // 首先用php获取当天的月份
            $d = date("d"); // 首先用php获取当天的号数
            $day_start = mktime(0, 0, 0, $m, $d, $y); // 开始时间
            $day_end = mktime(23, 59, 59, $m, $d, $y); // 结束时间

            $conditions = array(
                'action_id' => $actionId,
                'voter_id' => $voter['id'],
                'datetime' => array('between', array(date('Y-m-d H:i:s', $day_start), date('Y-m-d H:i:s', $day_end)))
            );

            $count = $model->where($conditions)->count();
            if ($count >= $config['votePerDay'])
                return $this->ajaxReturn(array('status' => 0, 'info' => '对不起，您超过今天的投票次数!'));
        }

        $model = new WeVoteVotersModel();
        $data = array(
            'action_id' => $actionId,
            'openid' => $openId,
            'datetime' => date('Y-m-d H:i:s', time())
        );
        $model->data($data)->add();

        $model = new WeVoteVotersModel();
        $data = $model->field('id')->where('openid = \'' . $openId + '\' AND action_id = ' + $actionId)->find();

        if (empty($candidateId) || empty($openId) || empty($data))
            return $this->ajaxReturn(array('status' => 0, 'info' => '投票失败,请稍后重试!'));

        $data = array(
            'action_id' => $actionId,
            'voter_id' => $voter['id'],
            'candidate_id' => $candidateId,
            'datetime' => date('Y-m-d H:i:s', time())
        );

        $model = new WeVoteInfoModel();
        $ret = $model->data($data)->add();
        if (!$ret)
            return $this->ajaxReturn(array('status' => 0, 'info' => '投票失败,请稍后重试!'));
        else
            return $this->ajaxReturn(array('status' => 1, 'info' => '投票成功', 'id' => $ret));
    }

    public function ShareAction()
    {
        if (!I('action_id'))
            return $this->error('错误的参数');

        $actionId = I('action_id', 0, "intval");
        $openId = I('open_id', NULL, "string");
        if (!$openId)
            $openId = get_openid();

        $data = array(
            'action_id' => $actionId,
            'openid' => $openId,
            'datetime' => date('Y-m-d H:i:s', time())
        );

        $model = new WeVoteShareModel();
        $ret = $model->data($data)->add();
        if (!$ret)
            return $this->ajaxReturn(array('status' => -1, 'info' => '分享失败'));

        return $this->ajaxReturn(array('status' => 0, 'info' => '分享成功', 'id' => $ret));
    }

    // 获取排行榜
    public function GetTopAction()
    {
        $actionId = I('action_id', 0, "intval");
        $topData = $this->GetCandidates($this->SQL_QUERY_CANDIDATES_ALL, $actionId, null, 1, 10);
        echo json_encode(array('topData' => $topData));
    }

    // 获取投票情况
    public function GetVoteInfoAction()
    {
        $actionId = I('action_id', 0, "intval");
        $openId = I('open_id', NULL, "string");
        if (!$openId)
            $openId = get_openid();

        $sql = sprintf($this->SQL_QUERY_VoteInfo, $openId, $actionId);
        $model = M();
        $list = $model->query($sql);

        echo json_encode(array('data' => $list));
    }

    /**
     * 注册访问者
     *
     * @param $openid 访问者openId
     */
    private function AddVisitor($actionId, $openid)
    {
        $model = new WeVoteVisitorsModel();
        $data = array(
            'action_id' => $actionId,
            'openid' => $openid,
            'datetime' => date('Y-m-d H:i:s', time())
        );
        $model->create($data);
        $model->add();
    }

    private function GetCandidates($sql, $actionId, $query, $page, $rows)
    {
        if ($page < 0)
            return;
        else
            $page = ($page - 1) * $rows;

        // 进行查询
        if (empty($query))
            $query = '';
        else if (preg_match("/^\d*$/", $query))
            $query = sprintf(self::SQL_QUERY_CANDIDATES_CONDITION_BY_ID, $query);
        else
            $query = sprintf(self::SQL_QUERY_CANDIDATES_CONDITION_BY_TITLE, $query);

        $candidates = M();
        $sql = sprintf($sql, $actionId, $query, $page, $rows);
        $list = $candidates->query($sql);

        $data = array();
        foreach ($list as $item) {
            $data[] = array(
                'id' => $item['id'],
                'title' => $item['title'],
                'picture' => get_cover_url($item['picture']),
                'count' => $item['count']
            );
        }

        return $data;
    }

    private function CheckSignUpDateTime($actionId)
    {
        $model = new WeVoteConfigModel();
        $data = $model->where('id = ' . $actionId)->find();
        if (($data === FALSE) || (!$data))
            return 'fail';

        $startSignUpDateTime = strtotime($data['startSignUpDateTime']);
        $stopSignUpDateTime = strtotime($data['stopSignUpDateTime']);
        $time = time();

        if ($time < $startSignUpDateTime)
            return 'nonStart';
        else if ($time > $stopSignUpDateTime)
            return 'over';
        else
            return 'ok';
    }

    private function CheckVoteDateTime($actionId)
    {
        $model = new WeVoteConfigModel();
        $data = $model->where('id = ' . $actionId)->find();
        if (($data === FALSE) || (!$data))
            return 'fail';

        $stopSignUpDateTime = strtotime($data['stopSignUpDateTime']);
        $stopDateTime = strtotime($data['stopDateTime']);
        $time = time();

        if ($time < $stopSignUpDateTime)
            return 'nonStart';
        else if ($time > $stopDateTime)
            return 'over';
        else
            return 'ok';
    }
}