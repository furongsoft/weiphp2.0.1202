<?php

/**
 * Created by PhpStorm.
 * User: HY
 * Date: 2015/6/11
 * Time: 12:52
 */

namespace Addons\WeVote\Controller;

use Addons\WeVote\Controller\BaseController;
use Addons\WeVote\Model\HeadPictureManagementModel;

class HeadPictureManagementController extends BaseController
{

    public function Index()
    {
        $model = new HeadPictureManagementModel();

        $conditions = array();
        $conditions ['configid'] = array(
            $this->mActionId
        );

        if ((I('title'))) {
            $conditions ['title'] = array(
                'LIKE',
                '%' . I('title') . '%'
            );
        }

        $data = $model->where($conditions)->select();

        $this->assign('actionid', $this->mActionId);
        $this->assign('list_fields', $data);
        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/HeadPictureManagement/List.html');
    }


    public function AddView()
    {
        $this->assign('actionid', I('action_id'));
        $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/HeadPictureManagement/Add.html');
    }

    public function AddHeadPicture()
    {
        if (IS_POST) {
            $model = new HeadPictureManagementModel();
            $data = $model->create();
            if (empty($data))
                return $this->error("提交的参数错误！");
            else if (empty($data["picid"]))
                return $this->error("请上传图片信息！");

            $res = $model->add($data);
            if (!$res)
                $this->error("添加头部图片失败！");
            else
                $this->success('添加头部图片成功', addons_url('WeVote:/HeadPictureManagement/Index', array('action_id' => $this->mActionId)));
        } else {
            $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/HeadPictureManagement/List.html');
        }
    }

    public function EditHeadPicture()
    {
        $id = I("id");
        $this->assign('actionid', I('action_id'));
        $model = new HeadPictureManagementModel();
        if (IS_POST) {
            $data = $model->create();
            if (empty($data))
                return $this->error("提交的参数错误！");
            else if (empty($data["picid"]))
                return $this->error("请上传图片信息！");

            $res = $model->save($data);
            if (!$res)
                $this->error("修改头部图片失败！");
            else
                $this->success('更新成功', addons_url('WeVote:/HeadPictureManagement/Index', array('action_id' => $this->mActionId)));
        } else {
            $pic = $model->find($id);
            if (!$pic)
                $this->error('获取头部图片信息错误');

            $this->assign('pic', $pic);
            $this->display(ONETHINK_ADDON_PATH . 'WeVote/View/default/WeVote/Admin/HeadPictureManagement/Edit.html');
        }
    }

    public function DeletePicture()
    {
        $ids = array_unique((array)I('ids', null));
        if (empty($ids))
            return $this->error('请选择要删除行！');

        $data = array('id' => array('in', $ids));
        $model = new HeadPictureManagementModel();
        $res = $model->where($data)->delete();
        if (!$res)
            $this->error("删除图片失败");
        else
            $this->success('删除成功！', addons_url('WeVote:/HeadPictureManagement/Index', array('action_id' => $this->mActionId)));
    }
}