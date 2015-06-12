<?php

namespace Addons\Xydzp\Controller;

use Home\Controller\AddonsController;

class XydzpController extends AddonsController
{
    protected $model;
    protected $option;
    protected $jplist;

    public function __construct()
    {
        parent::__construct();
        $this->model = M('Model')->getByName($_REQUEST['_controller']);
        $this->model || $this->error('模型不存在！');

        $this->assign('model', $this->model);

        $this->option = M('Model')->getByName('xydzp_option');
        $this->assign('option', $this->option);

        $this->jplist = M('Model')->getByName('xydzp_jplist');
        $this->assign('jplist', $this->jplist);
    }

    /**
     * 显示指定模型列表数据
     */
    public function lists()
    {
        $page = I('p', 1, 'intval'); // 默认显示第一页数据

        // 解析列表规则
        $fields = array();
        $grids = preg_split('/[;\r\n]+/s', $this->model['list_grid']);
        foreach ($grids as &$value) {
            // 字段:标题:链接
            $val = explode(':', $value);
            // 支持多个字段显示
            $field = explode(',', $val[0]);
            $value = array(
                'field' => $field,
                'title' => $val[1]
            );
            if (isset($val[2])) {
                // 链接信息
                $value['href'] = $val[2];
                // 搜索链接信息中的字段信息
                preg_replace_callback('/\[([a-z_]+)\]/', function ($match) use (&$fields) {
                    $fields[] = $match[1];
                }, $value['href']);
            }
            if (strpos($val[1], '|')) {
                // 显示格式定义
                list($value['title'], $value['format']) = explode('|', $val[1]);
            }
            foreach ($field as $val) {
                $array = explode('|', $val);
                $fields[] = $array[0];
            }
        }
        // 过滤重复字段信息
        $fields = array_unique($fields);
        // 关键字搜索
        $map['token'] = get_token();
        $key = $this->model['search_key'] ? $this->model['search_key'] : 'title';
        if (isset($_REQUEST[$key])) {
            $map[$key] = array(
                'like',
                '%' . htmlspecialchars($_REQUEST[$key]) . '%'
            );
            unset($_REQUEST[$key]);
        }
        // 条件搜索
        foreach ($_REQUEST as $name => $val) {
            if (in_array($name, $fields)) {
                $map[$name] = $val;
            }
        }
        $row = empty($this->model['list_row']) ? 20 : $this->model['list_row'];

        // 读取模型数据列表     
        empty($fields) || in_array('id', $fields) || array_push($fields, 'id');
        $name = parse_name(get_table_name($this->model['id']), true);
        $data = M($name)->field(empty($fields) ? true : $fields)->where($map)->order('id DESC')->page($page, $row)->select();
        /* 查询记录总数 */
        $count = M($name)->where($map)->count();
        // 分页
        if ($count > $row) {
            $page = new \Think\Page($count, $row);
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
            $this->assign('_page', $page->show());
        }
        $this->assign('list_grids', $grids);
        $this->assign('list_data', $data);
        $this->meta_title = $this->model['title'] . '列表';
        $this->display(T('Addons://Xydzp@Xydzp/lists'));
    }

    public function add()
    {
        if (IS_POST) {
            // 自动补充token
            $_POST['token'] = get_token();
            $Model = D(parse_name(get_table_name($this->model['id']), 1));
            // 获取模型的字段信息
            $Model = $this->checkAttr($Model, $this->model['id']);
            if ($Model->create() && $xydzp_id = $Model->add()) {
                // 保存关键词
                D('Common/Keyword')->set(I('keyword'), 'Xydzp', $xydzp_id);

                $this->success('添加' . $this->model['title'] . '成功！', U('lists?model=' . $this->model['name']));
            } else {
                $this->error($Model->getError());
            }
        } else {

            $xydzp_fields = get_model_attribute($this->model['id']);
            $this->assign('fields', $xydzp_fields);
            // 奖品表
            $option_fields = get_model_attribute($this->option['id']);
            $this->assign('option_fields', $option_fields);

            $this->meta_title = '新增' . $this->model['title'];
            $this->display($this->model['template_add'] ? $this->model['template_add'] : T('Addons://Xydzp@Xydzp/add'));
        }
    }

    public function del()
    {
        $ids = I('id', 0);
        if (empty($ids)) {
            $ids = array_unique(( array )I('ids', 0));
        }
        if (empty($ids)) {
            $this->error('请选择要操作的数据!');
        }

        $Model = M(get_table_name($this->model['id']));
        $map = array(
            'id' => array(
                'in',
                $ids
            )
        );
        if ($Model->where($map)->delete()) {
            $this->success('删除成功');
        } else {
            $this->error('删除失败！');
        }
    }

    public function edit()
    {
        // 获取模型信息
        $id = I('id', 0, 'intval');

        if (IS_POST) {
            $Model = D(parse_name(get_table_name($this->model['id']), 1));
            // 获取模型的字段信息
            $Model = $this->checkAttr($Model, $this->model['id']);
            if ($Model->create() && $Model->save()) {
                // 保存关键词
                D('Common/Keyword')->set(I('keyword'), 'Xydzp', $id);

                $this->success('保存' . $this->model['title'] . '成功！', U('lists'));
            } else {
                $this->error($Model->getError());
            }
        } else {
            $fields = get_model_attribute($this->model['id']);

            // 获取数据
            $data = M(get_table_name($this->model['id']))->find($id);
            $data || $this->error('数据不存在！');

            $option_list = M('xydzp_option')->where('xydzp_id=' . $id)->select();
            $this->assign('option_list', $option_list);

            $this->assign('fields', $fields);
            $this->assign('data', $data);
            $this->meta_title = '编辑' . $this->model['title'];
            $this->display(T('Addons://Xydzp@Xydzp/edit'));
        }
    }

    /**
     * **************************中奖记录************************************
     */
    public function zjloglists()
    {
        $page = I('p', 1, 'intval'); // 默认显示第一页数据
        $xydzp_id = I('get.id', 0, "intval");
        $zjlog = M('Model')->getByName('xydzp_log');
        $grids = preg_split('/[;\r\n]+/s', $zjlog['list_grid']);
        // 解析列表规则
        $fields = array();
        foreach ($grids as &$value) {
            // 字段:标题:链接
            $val = explode(':', $value);
            // 支持多个字段显示
            $field = explode(',', $val[0]);
            $value = array(
                'field' => $field,
                'title' => $val[1]
            );
            if (isset($val[2])) {
                // 链接信息
                $value['href'] = $val[2];
                // 搜索链接信息中的字段信息
                preg_replace_callback('/\[([a-z_]+)\]/', function ($match) use (&$fields) {
                    $fields[] = $match[1];
                }, $value['href']);
            }
            if (strpos($val[1], '|')) {
                // 显示格式定义
                list($value['title'], $value['format']) = explode('|', $val[1]);
            }
            foreach ($field as $val) {
                $array = explode('|', $val);
                $fields[] = $array[0];
            }
        }
        $fix = C("DB_PREFIX");
        // 过滤重复字段信息
        $fields = array_unique($fields);
        $row = empty($zjlog['list_row']) ? 20 : $zjlog['list_row'];
        //添加奖品关联
        $fields[] = $fix . "xydzp_option.title";
        $key = array_search('id', $fields);
        if (false === $key) {
            array_push($fields, "{$fix}xydzp_log.id as id");
        } else {
            $fields[$key] = "{$fix}xydzp_log.id as id";
        }

        $key = array_search('openid', $fields);
        if (false === $key) {
            array_push($fields, "{$fix}follow.openid as openid");
        } else {
            $fields[$key] = "{$fix}follow.openid as openid";
        }

        $key = array_search('nickname', $fields);
        if (false === $key) {
            array_push($fields, "{$fix}follow.nickname as nickname");
        } else {
            $fields[$key] = "{$fix}follow.nickname as nickname";
        }

        $key = array_search('mobile', $fields);
        if (false === $key) {
            array_push($fields, "{$fix}follow.mobile as mobile");
        } else {
            $fields[$key] = "{$fix}follow.mobile as mobile";
        }

        //中奖列表
        $sqlqu = M('xydzp_log')
            ->join('left join ' . $fix . 'follow on ' . $fix . 'xydzp_log.uid=' . $fix . 'follow.openid')
            ->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_log.xydzp_option_id=' . $fix . 'xydzp_option.id')
            ->field(empty($fields) ? true : $fields)
            ->where(array('xydzp_id' => $xydzp_id, $fix . 'follow.token' => get_token()));
        $data = $sqlqu->order("zjdate desc")
            ->page($page, $row)
            ->select();

        /* 查询记录总数 */
        $count = $sqlqu->count();

        // 分页
        if ($count > $row) {
            $page = new \Think\Page($count, $row);
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
            $this->assign('_page', $page->show());
        }
        $this->assign('xydzp_id', $xydzp_id);
        $this->assign('list_grids', $grids);
        $this->assign('list_data', $data);
        $this->display(T('Addons://Xydzp@Xydzp/zjloglists'));
    }

    function ylingqu()
    {
        // 获取模型信息
        $id = I('id', 0, 'intval');
        M("xydzp_log")
            ->where(array('id' => $id))
            ->data(array("state" => 1))
            ->save();
        $xydzp_log = M("xydzp_log")->where(array('id' => $id))->find();
        $this->success('已标记为已领取状态！', U('zjloglists?id=' . $xydzp_log["xydzp_id"]));
    }

    function wlingqu()
    {
        // 获取模型信息
        $id = I('id', 0, 'intval');
        M("xydzp_log")
            ->where(array('id' => $id))
            ->data(array("state" => 0))
            ->save();
        $xydzp_log = M("xydzp_log")->where(array('id' => $id))->find();
        $this->success('已标记为未领取状态！', U('zjloglists?id=' . $xydzp_log["xydzp_id"]));
    }

    /**
     * **************************奖品库设置功能************************************
     */
    public function jpoplists()
    {
        $grids = preg_split('/[;\r\n]+/s', $this->option['list_grid']);
        // 解析列表规则
        $fields = array();
        foreach ($grids as &$value) {
            // 字段:标题:链接
            $val = explode(':', $value);
            // 支持多个字段显示
            $field = explode(',', $val[0]);
            $value = array(
                'field' => $field,
                'title' => $val[1]
            );
            if (isset($val[2])) {
                // 链接信息
                $value['href'] = $val[2];
                // 搜索链接信息中的字段信息
                preg_replace_callback('/\[([a-z_]+)\]/', function ($match) use (&$fields) {
                    $fields[] = $match[1];
                }, $value['href']);
            }
            if (strpos($val[1], '|')) {
                // 显示格式定义
                list($value['title'], $value['format']) = explode('|', $val[1]);
            }
            foreach ($field as $val) {
                $array = explode('|', $val);
                $fields[] = $array[0];
            }
        }
        // 过滤重复字段信息
        $fields = array_unique($fields);
        // 条件
        $map['token'] = get_token();

        $data = M("xydzp_option")->field(empty($fields) ? true : $fields)->where($map)->order('id DESC')->select();

        $this->assign('list_grids', $grids);
        $this->assign('list_data', $data);
        $this->display(T('Addons://Xydzp@Xydzp/jpoplists'));
    }

    public function jpopadd()
    {
        if (IS_POST) {
            // 自动补充token
            $_POST['token'] = get_token();
            $Model = D(parse_name(get_table_name($this->option['id']), 1));
            // 获取模型的字段信息
            $Model = $this->checkAttr($Model, $this->option['id']);
            if ($Model->create() && $xydzp_option_id = $Model->add()) {
                if ($_POST['isjx'] == "1") {
                    $this->success('添加' . $this->option['title'] . '成功！<br/>将继续进行新增奖品', U('jpopadd'));
                } else {
                    $this->success('添加' . $this->option['title'] . '成功！', U('jpoplists'));
                }
            } else {
                $this->error($Model->getError());
            }
        } else {
            $xydzp_option_fields = get_model_attribute($this->option['id']);
            $this->assign('fields', $xydzp_option_fields);
            $this->meta_title = '新增奖品';
            $this->display($this->model['template_add'] ? $this->model['template_add'] : T('Addons://Xydzp@Xydzp/jpopadd'));
        }
    }

    public function jpopedit()
    {
        // 获取模型信息
        $id = I('id', 0, 'intval');

        if (IS_POST) {
            $Model = D(parse_name(get_table_name($this->option['id']), 1));
            // 获取模型的字段信息
            $Model = $this->checkAttr($Model, $this->option['id']);
            if ($Model->create() && $Model->save()) {
                $this->success('保存' . $this->option['title'] . '成功！', U('jpoplists'));
            } else {
                $this->error($Model->getError());
            }
        } else {
            $fields = get_model_attribute($this->option['id']);

            // 获取数据
            $data = M(get_table_name($this->option['id']))->find($id);
            $data || $this->error('数据不存在！');

            $this->assign('fields', $fields);
            $this->assign('data', $data);
            $this->meta_title = '编辑' . $this->option['title'];
            $this->display(T('Addons://Xydzp@Xydzp/jpopedit'));
        }
    }

    public function jpopdel()
    {
        $ids = I('id', 0);
        if (empty($ids)) {
            $ids = array_unique(( array )I('ids', 0));
        }
        if (empty($ids)) {
            $this->error('请选择要操作的数据!');
        }

        $Model = M(get_table_name($this->option['id']));
        $map = array(
            'id' => array(
                'in',
                $ids
            )
        );
        if ($Model->where($map)->delete()) {
            $this->success('删除成功');
        } else {
            $this->error('删除失败！');
        }
    }

    /**
     * **************************活动奖品设置************************************
     */
    public function jplists()
    {
        $xydzp_id = I('get.xydzp_id', 0, "intval");
        $grids = preg_split('/[;\r\n]+/s', $this->jplist['list_grid']);
        // 解析列表规则
        $fields = array();
        foreach ($grids as &$value) {
            // 字段:标题:链接
            $val = explode(':', $value);
            // 支持多个字段显示
            $field = explode(',', $val[0]);
            $value = array(
                'field' => $field,
                'title' => $val[1]
            );
            if (isset($val[2])) {
                // 链接信息
                $value['href'] = $val[2];
                // 搜索链接信息中的字段信息
                preg_replace_callback('/\[([a-z_]+)\]/', function ($match) use (&$fields) {
                    $fields[] = $match[1];
                }, $value['href']);
            }
            if (strpos($val[1], '|')) {
                // 显示格式定义
                list($value['title'], $value['format']) = explode('|', $val[1]);
            }
            foreach ($field as $val) {
                $array = explode('|', $val);
                $fields[] = $array[0];
            }
        }

        // 过滤重复字段信息
        $fields = array_unique($fields);
        // 条件
        $map['xydzp_id'] = $xydzp_id;
        $fix = C("DB_PREFIX");
        //添加奖品关联
        $fields[] = $fix . "xydzp_option.title";
        array_unshift($grids, array(
            "field" => array(
                "title"
            ),
            "title" => "奖品名称"
        ));

        $key = array_search('id', $fields);
        if (false === $key) {
            array_push($fields, "{$fix}xydzp_jplist.id as id");
        } else {
            $fields[$key] = "{$fix}xydzp_jplist.id as id";
        }

        $key = array_search('gailv_str', $fields);
        if (false != $key) {
            $fields[$key] = "(case when type='0' then gailv else gailv_str end) as gailv_str";
        }

        $data = M('xydzp_jplist')->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_jplist.xydzp_option_id=' . $fix . 'xydzp_option.id')->field(empty($fields) ? true : $fields)->where($map)->order('type asc,gailv asc')->select();
        $this->assign('list_grids', $grids);
        $this->assign('list_data', $data);
        $this->assign('xydzp_id', $xydzp_id);
        $this->display(T('Addons://Xydzp@Xydzp/jplists'));
    }

    public function jpadd()
    {
        $xydzp_id = I('get.xydzp_id', 0, "intval");
        if (IS_POST) {
            $Model = D(parse_name(get_table_name($this->jplist['id']), 1));
            // 获取模型的字段信息
            $Model = $this->checkAttr($Model, $this->jplist['id']);
            if ($Model->create() && $xydzp_jplist_id = $Model->add()) {
                if ($_POST['isjx'] == "1") {
                    $this->success('添加成功！<br/>将继续进行新增奖品', U('jpadd?xydzp_id=' . $xydzp_id));
                } else {
                    $this->success('添加成功！', U('jplists?xydzp_id=' . $xydzp_id));
                }
            } else {
                $this->error($Model->getError());
            }
        } else {
            $jplist_fields = get_model_attribute($this->jplist['id']);
            $this->assign('fields', $jplist_fields);
            // 过滤重复字段信息
            $fields = array_unique($fields);
            $map['token'] = get_token();
            $jpdata = M("xydzp_option")->field(array(
                "title",
                "id"
            ))->where($map)->order('id DESC')->select();
            $this->assign('jpdata', $jpdata);
            $this->assign('xydzp_id', $xydzp_id);
            $this->meta_title = '新增奖品';
            $this->display($this->model['template_add'] ? $this->model['template_add'] : T('Addons://Xydzp@Xydzp/jpadd'));
        }
    }

    public function jpedit()
    {
        // 获取模型信息
        $id = I('id', 0, 'intval');
        $xydzp_id = I('get.xydzp_id', 0, "intval");

        if (IS_POST) {
            $Model = D(parse_name(get_table_name($this->jplist['id']), 1));
            // 获取模型的字段信息
            $Model = $this->checkAttr($Model, $this->jplist['id']);
            if ($Model->create() && $Model->save()) {
                $this->success('保存成功！', U('jplists?xydzp_id=' . $xydzp_id));
            } else {
                $this->error($Model->getError());
            }
        } else {
            $fields = get_model_attribute($this->jplist['id']);

            // 获取数据
            $data = M(get_table_name($this->jplist['id']))->find($id);
            $data || $this->error('数据不存在！');
            $xydzp_id = $data["xydzp_id"];
            $jpdata = M("xydzp_option")->field(array(
                "title",
                "id"
            ))->where($map)->order('id DESC')->select();
            $this->assign('jpdata', $jpdata);
            $this->assign('seljpdata', $data["xydzp_option_id"]);
            $this->assign('fields', $fields);
            $this->assign('data', $data);
            $this->assign('xydzp_id', $xydzp_id);
            $this->meta_title = '编辑';
            $this->display(T('Addons://Xydzp@Xydzp/jpedit'));
        }
    }

    public function jpdel()
    {
        $ids = I('id', 0);
        if (empty($ids)) {
            $ids = array_unique(( array )I('ids', 0));
        }
        if (empty($ids)) {
            $this->error('请选择要操作的数据!');
        }

        $Model = M(get_table_name($this->jplist['id']));
        $map = array(
            'id' => array(
                'in',
                $ids
            )
        );
        if ($Model->where($map)->delete()) {
            $this->success('删除成功');
        } else {
            $this->error('删除失败！');
        }
    }

    /**
     * **************************微信上的操作功能************************************
     */
    function formshow()
    {
        $xydzp_id = I('id', 0, 'intval');
        $openid = get_openid();
        $token = get_token();

        $this->assign('openid', $openid);
        $this->assign('token', $token);
        $this->assign('xydzp_id', $xydzp_id);
        //查询绑定的信息
        $npcuser = M('follow')->where(array(
            "openid" => $openid,
            "token" => $token
        ))->find();
        $npcparam['token'] = $token;
        $npcparam['openid'] = $openid;
        $npcparam['id'] = $xydzp_id;
        //如果没有昵称或手机关联公众账号
        if ($npcuser["nickname"] == "" || $npcuser["mobile"] == "") {
            $npcurl = addons_url('Xydzp://Xydzp/info', $npcparam);
        }
        $showurl = addons_url('Xydzp://Xydzp/show', $npcparam);
        $this->assign('showurl', $showurl);
        $this->assign('isinfo_url', $npcurl);
        $this->display(T('Addons://Xydzp@Xydzp/formshow'));
    }

    function show()
    {
        $xydzp_id = I('id', 0, 'intval');

        //ALEX[[[
        $openid = I('open_id', NULL, "string");
        if (!$openid)
            $openid = get_openid();

        $token = I('token', NULL, "string");
        if (!$token)
            $token = get_token();

        $this->AutoFollow($openid, $token);

        $extra_num = I('request.extra_num_c87595d2400cdd50cd930aef9085716a', NULL, 'string');
        if (!empty($extra_num)) {
            $this->AddExtraCjNum($xydzp_id, $openid);
            return;
        }

        // $openid = get_openid();
        // $token = get_token();
        //]]]ALEX

        $this->assign('openid', $openid);
        $this->assign('token', $token);
        $this->assign('xydzp_id', $xydzp_id);

        //是否已经结束 
        $isend = $this->_is_overtime($xydzp_id);
        if ($isend) {
            $this->assign('isend', $isend);
        } else {
            $xydzpfx = M('xydzp')
                ->field("id", "picurl", "title", "des_jj", "gzurl")
                ->where(array('id' => $xydzp_id, 'token' => $token))
                ->find();
            //查询是否绑定了信息
            $user = M('follow')->where(array(
                "openid" => $openid,
                "token" => $token
            ))->find();
            $param['token'] = $token;
            $param['openid'] = $openid;
            $param['id'] = $xydzp_id;
            $url = "";
            //如果没有关注或关联公众账号
            if (empty($user)) {
                $url = addons_url('Xydzp://Xydzp/info', $param);
            }

            $this->assign('isgz_url', $url);
            //关注url
            $this->assign('gzurl', $xydzpfx['gzurl']);
            if ($url == "") {
                $joinurl = addons_url('Xydzp://Xydzp/join', $param);
                $info = $this->_getXydzpInfo($xydzp_id);
                $cjnum = ($this->is_Maxjoin($xydzp_id, $openid, $token));
                $canJoin = !empty($openid) && !empty($token) && $cjnum != 0;
                //查询奖品列表        
                $fix = C("DB_PREFIX");
                $jplist = M('xydzp_jplist')
                    ->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_jplist.xydzp_option_id=' . $fix . 'xydzp_option.id')
                    ->field($fix . "xydzp_option.title,pic," . $fix . "xydzp_option.miaoshu," . $fix . "xydzp_option.isdf")
                    ->where(array('xydzp_id' => $xydzp_id))
                    ->order("type asc,gailv asc")
                    ->select();
                $this->assign('jplist', urldecode(json_encode($jplist)));
                $this->assign('jplists', $jplist);
                // 活动数据
                $data = M(get_table_name($this->model['id']))->find($xydzp_id);
                $data["start_date"] = date('Y-m-d H:i:s', $data["start_date"]);
                $data["end_date"] = date('Y-m-d H:i:s', $data["end_date"]);
                $this->assign('hddata', $data);
                //中奖列表
                $zjuserlist = M('xydzp_log')
                    ->join('left join ' . $fix . 'follow on ' . $fix . 'xydzp_log.uid=' . $fix . 'follow.openid')
                    ->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_log.xydzp_option_id=' . $fix . 'xydzp_option.id')
                    ->field($fix . "xydzp_log.id," . $fix . "follow.nickname," . $fix . "xydzp_option.title,zjdate")
                    ->where(array('xydzp_id' => $xydzp_id, $fix . 'follow.token' => $token))
                    ->order("zjdate desc")
                    ->limit(10)
                    ->select();
                $this->assign('zjuserlist', $zjuserlist);
                $this->assign('canJoin', $canJoin);
                $this->assign('cjnum', $cjnum);
                $this->assign('joinurl', $joinurl);
                //分享数据
                $npcparam['id'] = $xydzp_id;
                $showurl = addons_url('Xydzp://Xydzp/show', $npcparam);
                $fxpic = M('picture')
                    ->field("id", "path")
                    ->where(array('id' => $xydzpfx['picurl']))
                    ->find();
                $fxappid = M('member_public')
                    ->field("token", "appid")
                    ->where(array('token' => $token))
                    ->find();
                $site_url = 'http://' . $_SERVER['HTTP_HOST'];
                $this->assign('fxpic', $site_url . $fxpic['path']);
                $this->assign('fxurl', $showurl);
                $this->assign('fxdes', trim(preg_replace("{\r\n}", "", $xydzpfx['des_jj'])));
                $this->assign('fxtitle', $xydzpfx['title']);
                $this->assign('fxappid', $fxappid['appid']);
            }
        }
        $this->display(T('Addons://Xydzp@Xydzp/show'));
    }

    function _getXydzpInfo($id)
    {
        // 检查ID是否合法
        if (empty($id) || 0 == $id) {
            $this->error("错误的幸运大转盘ID");
        }

        $map['id'] = $map2['xydzp_id'] = intval($id);
        $info = M('xydzp')->where($map)->find();
        // dump(M ( 'xydzp' )->getLastSql());
        $this->assign('info', $info);

        // dump($info);
        $opts = M('xydzp_jplist')->where($map2)->select();

        // dump($opts);
        $this->assign('opts', $opts);
        $this->assign('num_total', $total);
        return $info;
    }

    //中奖信息
    function zjinfo()
    {
        $xydzp_id = I('id', 0, 'intval');
        $openid = get_openid();
        $token = get_token();
        $fix = C("DB_PREFIX");
        //中奖列表
        $zjuserlist = M('xydzp_log')
            ->join('left join ' . $fix . 'follow on ' . $fix . 'xydzp_log.uid=' . $fix . 'follow.openid')
            ->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_log.xydzp_option_id=' . $fix . 'xydzp_option.id')
            ->field($fix . "xydzp_log.id," . $fix . "follow.nickname," . $fix . "xydzp_option.title,zjdate")
            ->where(array('xydzp_id' => $xydzp_id, $fix . 'follow.token' => $token, $fix . 'xydzp_log.uid' => $openid))
            ->order("zjdate desc")
            ->select();

        $this->assign('zjuserlist', $zjuserlist);
        $this->display(T('Addons://Xydzp@Xydzp/zjinfo'));
    }

    //[Ajax]保存用户信息
    function info()
    {
        $data['openid'] = get_openid();
        $data['token'] = get_token();
        // 保存用户信息
        $nickname = I('nickname');
        if (!empty($nickname)) {
            $follow['nickname'] = $nickname;
        }
        $mobile = I('mobile');
        if (!empty($mobile)) {
            $follow['mobile'] = $mobile;
        }
        if (!empty($follow)) {
            M('follow')->where($data)->save($follow);
        }
        $array = array("result" => 0);
        $json = json_encode($array);
        echo urldecode($json);
    }

    //[Ajax]开始转
    function join()
    {
        $xydzp_id = I('get.id', 0, 'intval');
        if ($this->_is_starttime($xydzp_id)) {
            if ($this->_is_overtime($xydzp_id)) {
                $json = json_encode(array("type" => 4));
                echo urldecode($json);
            } else {
                $openid = I('get.openid');
                $token = I('get.token');
                $fix = C("DB_PREFIX");
                //查询奖品列表
                $jplist = M('xydzp_jplist')->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_jplist.xydzp_option_id=' . $fix . 'xydzp_option.id')->field($fix . "xydzp_option.title,gailv,xydzp_id,xydzp_option_id,isdf," . $fix . "xydzp_option.num as kcnum," . $fix . "xydzp_option.miaoshu," . $fix . "xydzp_jplist.gailv_maxnum")->where("xydzp_id=$xydzp_id")->order('type asc,gailv asc')->select();
                //按奖品等级计算概率
                echo $this->getResult($jplist, $xydzp_id, $openid, $token);
            }
        } else {
            $json = json_encode(array("type" => 3));
            echo urldecode($json);
        }
    }

    //获得中奖结果
    /*
    $result['type'] 奖品回调类型  
    0: 抽奖次数用完
    1：奖品库存为0
    2：成功    
    3: 活动时间未到
    4: 活动已经结束
    */
    private function getResult($jplist, $xydzp_id, $openid, $token)
    {
        //$fix = C("DB_PREFIX");
        //$xydzp_id = 6;
        //$openid='oP0R2joD1CYPzhpkDGnEUL3b55wc';
        //$token='gh_9188fd99c051';
        //$jplist = M('xydzp_jplist')->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_jplist.xydzp_option_id=' . $fix . 'xydzp_option.id')->field($fix . "xydzp_option.title,gailv,xydzp_id,xydzp_option_id,isdf," . $fix . "xydzp_option.num as kcnum," . $fix . "xydzp_option.miaoshu,". $fix . "xydzp_jplist.gailv_maxnum")->where("xydzp_id=$xydzp_id")->order('type asc,gailv asc')->select();

        $row = $this->is_Maxjoin($xydzp_id, $openid, $token);
        if ($row != 0) {
            $arr = array();
            //按概率计算
            foreach ($jplist as $key => $val) {
                //每个奖品的概率
                $arr[] = $val['gailv'];
            }
            $rid = $this->getRand($arr); //根据概率获取奖项id
            $res = $jplist[$rid]; //中奖项
            $num = $row - 1;
            //用户抽奖次数减1
            //是否第一次参加
            $list = M("xydzp_userlog")->where("xydzp_id=$xydzp_id AND uid='$openid' ")->find();
            if ($list["id"] > 0) {
                M("xydzp_userlog")->where(array(
                    'xydzp_id' => $res['xydzp_id'],
                    'uid' => $openid
                ))->data(array(
                    'num' => $list["num"] + 1,
                    'cjdate' => time()
                ))->save();
            } else {
                M("xydzp_userlog")->add(array(
                    'uid' => $openid,
                    'xydzp_id' => $xydzp_id,
                    'cjdate' => time(),
                    'num' => 1
                ));
            }

            //中奖列表
            $zjuserlist = M('xydzp_log')
                ->join('left join ' . $fix . 'follow on ' . $fix . 'xydzp_log.uid=' . $fix . 'follow.openid')
                ->join('left join ' . $fix . 'xydzp_option on ' . $fix . 'xydzp_log.xydzp_option_id=' . $fix . 'xydzp_option.id')
                ->field($fix . "xydzp_log.id,xydzp_id,xydzp_option_id,uid," . $fix . "follow.nickname," . $fix . "xydzp_option.title,zjdate")
                ->where(array('xydzp_id' => $xydzp_id, $fix . 'follow.token' => $token, $fix . 'xydzp_log.uid' => $openid))
                ->order("zjdate desc")
                ->select();

            //限制用户中奖一个奖品的次数
            $zjwhere['xydzp_id'] = $xydzp_id;//活动id
            $zjwhere['xydzp_option_id'] = $res['xydzp_option_id'];//奖品id
            $zjwhere['uid'] = $openid;//用户uid
            $zjnum = M('xydzp_log')->where($zjwhere)->count();//同个活动，同个奖项,同个id的中奖次数

            //限制每天的中奖个数
            $y = date("Y");//首先用php获取当天的年份
            $m = date("m");//首先用php获取当天的月份
            $d = date("d");//首先用php获取当天的号数
            $day_start = mktime(0, 0, 0, $m, $d, $y);//开始时间
            $day_end = mktime(23, 59, 59, $m, $d, $y);//结束时间
            $zjxzwhere['xydzp_id'] = $xydzp_id;//活动id
            $zjxzwhere['xydzp_option_id'] = $res['xydzp_option_id'];//奖品id
            $zjxzwhere['zjdate'] = array('between', array($day_start, $day_end));//时间范围
            $zjxznum = M('xydzp_log')->where($zjxzwhere)->count();//同个活动，同个奖项一天内的中奖次数

            $npcurl = "";
            //保存用户的中奖信息(排除谢谢惠顾和库存为0,中奖次数，单日发放数量)
            if ($res["isdf"] != 1 && $res['kcnum'] != 0 && $zjnum < 1 && $zjxznum < $res['gailv_maxnum']) {
                M("xydzp_log")->add(array(
                    'xydzp_id' => $xydzp_id,
                    'uid' => $openid,
                    'xydzp_option_id' => $res['xydzp_option_id'],
                    'zjdate' => time(),
                    'state' => 0
                ));
                //查询绑定的信息
                $npcuser = M('follow')->where(array(
                    "openid" => $openid,
                    "token" => $token
                ))->find();
                $npcparam['token'] = $token;
                $npcparam['openid'] = $openid;
                $npcparam['id'] = $xydzp_id;
                //如果没有昵称或手机关联公众账号
                if ($npcuser["nickname"] == "" || $npcuser["mobile"] == "") {
                    $npcurl = addons_url('Xydzp://Xydzp/info', $npcparam);
                }
            }
            $result['type'] = 2;

            if ($res['kcnum'] == 0) {
                $result['type'] = 1;
            } elseif ($zjnum >= 1) {
                $result['type'] = 5;
            } elseif ($zjxznum >= $res['gailv_maxnum']) {
                $result['type'] = 6;
            } else {
                //用户抽取的那个奖项库存减1         
                M("xydzp_option")->where(array(
                    'id' => $res['xydzp_option_id']
                ))->save(array(
                    'num' => ($res['kcnum'] - 1)
                ));
            }

            $result['num'] = $num;
            //计算中奖角度的位置             
            $result['angle'] = 360 - (360 / sizeof($jplist) / 2) - (360 / sizeof($jplist) * ($rid)) - 90;
            $result['praisename'] = $res["title"];
            $result['jptype'] = $res["isdf"];
            $result['npcurl'] = $npcurl;
            $result['hdid'] = $xydzp_id;
            $result['token'] = $token;
            $result['openid'] = $openid;
        } else {
            $result['type'] = 0;
            $result['num'] = $num;
            //计算中奖角度的位置             
            $result['angle'] = -90;
            $result['praisename'] = "";
        }
        return $this->json($result);
    }

    private function getRand($proArr)
    {
        $result = '';

        //概率数组的总概率精度 
        $proSum = array_sum($proArr);
        //概率数组循环 
        foreach ($proArr as $key => $proCur) {
            $randNum = mt_rand(1, $proSum);
            if ($randNum <= $proCur) {
                $result = $key;
                break;
            } else {
                $proSum -= $proCur;
            }
        }
        unset($proArr);
        return $result;
    }

    private function json($array)
    {
        $this->arrayRecursive($array, 'urlencode', true);
        $json = json_encode($array);
        return urldecode($json);
    }

    //对数组中所有元素做处理
    private function arrayRecursive(&$array, $function, $apply_to_keys_also = false)
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                arrayRecursive($array[$key], $function, $apply_to_keys_also);
            } else {
                $array[$key] = $function($value);
            }
            if ($apply_to_keys_also && is_string($key)) {
                $new_key = $function($key);
                if ($new_key != $key) {
                    $array[$new_key] = $array[$key];
                    unset($array[$key]);
                }
            }
        }
    }
    /**
     * **************************公用功能************************************
     */
    //查询参加次数是否超标 反回剩余次数
    private function is_Maxjoin($xydzp_id, $user_id, $token)
    {
        //$xydzp_id = 6;
        //$user_id='oP0R2joD1CYPzhpkDGnEUL3b55wc';
        //$token='gh_9188fd99c051';

        $huodong = M("xydzp")->where("id=$xydzp_id And token='$token'")->find();
        //限制每天的抽奖次数
        $y = date("Y");//首先用php获取当天的年份
        $m = date("m");//首先用php获取当天的月份
        $d = date("d");//首先用php获取当天的号数
        $day_start = mktime(0, 0, 0, $m, $d, $y);//开始时间
        $day_end = mktime(23, 59, 59, $m, $d, $y);//结束时间
        $userlogwhere['xydzp_id'] = $xydzp_id;//活动id
        $userlogwhere['uid'] = $user_id;//用户id
        $userlogwhere['cjdate'] = array('between', array($day_start, $day_end));//时间范围
        $list = M("xydzp_userlog")->where($userlogwhere)->find();
        if ($list["id"] > 0) {
            //ALEX[[[
            if ($list["num"] > ($huodong["choujnum"] + $list["extra_num"])) {
                return 0;
            } else {
                return (($huodong["choujnum"] + $list["extra_num"]) - $list["num"]);
            }
            // if ($list["num"] > $huodong["choujnum"]) {
            //     return 0;
            // } else {
            //     return ($huodong["choujnum"] - $list["num"]);
            // }
            //]]]ALEX
        }
        $datawhere['xydzp_id'] = $xydzp_id;//活动id
        $datawhere['uid'] = $user_id;//用户id
        $data['num'] = 0;
        M("xydzp_userlog")->where($datawhere)->save($data);
        return $huodong["choujnum"];
    }

    //活动期限过期与否
    private function _is_overtime($xydzp_id)
    {
        $the_vote = M("xydzp")->where("id=$xydzp_id")->find();
        if ($the_vote['end_date'] <= time()) {
            return true;
        }
        return false;
    }

    //活动是否开始
    private function _is_starttime($xydzp_id)
    {
        $the_vote = M("xydzp")->where(array("id" => $xydzp_id))->find();
        if ($the_vote['start_date'] <= time()) {
            return true;
        }
        return false;
    }

    protected function checkAttr($Model, $model_id)
    {
        $fields = get_model_attribute($model_id, false);
        $validate = $auto = array();
        foreach ($fields as $key => $attr) {
            if ($attr['is_must']) { // 必填字段
                $validate[] = array(
                    $attr['name'],
                    'require',
                    $attr['title'] . '必须!'
                );
            }
            // 自动验证规则
            if (!empty($attr['validate_rule'])) {
                $validate[] = array(
                    $attr['name'],
                    $attr['validate_rule'],
                    $attr['error_info'] ? $attr['error_info'] : $attr['title'] . '验证错误',
                    0,
                    $attr['validate_type'],
                    $attr['validate_time']
                );
            }
            // 自动完成规则
            if (!empty($attr['auto_rule'])) {
                $auto[] = array(
                    $attr['name'],
                    $attr['auto_rule'],
                    $attr['auto_time'],
                    $attr['auto_type']
                );
            } elseif ('checkbox' == $attr['type']) { // 多选型
                $auto[] = array(
                    $attr['name'],
                    'arr2str',
                    3,
                    'function'
                );
            } elseif ('datetime' == $attr['type']) { // 日期型
                $auto[] = array(
                    $attr['name'],
                    'strtotime',
                    3,
                    'function'
                );
            }
        }
        return $Model->validate($validate)->auto($auto);
    }

    //ALEX[[[
    private function AddExtraCjNum($xydzp_id, $user_id)
    {
        // 新增额外当天抽奖的次数
        $list = M("xydzp_userlog")->where("xydzp_id=$xydzp_id AND uid='$user_id' ")->find();
        if ($list["id"] > 0) {
            if ($list['extra_num'] >= 3)
                return;
            M("xydzp_userlog")->where(array(
                'xydzp_id' => $xydzp_id,
                'uid' => $user_id
            ))->data(array(
                'extra_num' => $list['extra_num'] + 1
            ))->save();
        } else {
            M("xydzp_userlog")->add(array(
                'uid' => $user_id,
                'xydzp_id' => $xydzp_id,
                'cjdate' => time(),
                'num' => 0,
                'extra_num' => 1,
            ));
        }
    }

    private function AutoFollow($openId, $token)
    {
        $model = M('follow');
        $data = $model->where('openid = ' . $openId)->find();
        if (!empty($data))
            return;

        $data = array(
            'token' => $token,
            'openid' => $openId,
            'nickname' => 'UNKNOWN',
            'sex' => 0,
            'city' => 'UNKNOWN',
            'province' => 'UNKNOWN',
            'country' => 'UNKNOWN',
            'language' => 'UNKNOWN',
            'headimgurl' => 'UNKNOWN',
            'subscribe_time' => time(),
            'mobile' => 'UNKNOWN',
            'status' => 1,
            'score' => 0,
            'experience' => 0,
            'mTime' => time()
        );

        $model->data($data)->add();
    }
    //]]]ALEX
}
