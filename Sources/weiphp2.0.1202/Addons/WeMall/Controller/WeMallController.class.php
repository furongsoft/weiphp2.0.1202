<?php

namespace Addons\WeMall\Controller;

use Home\Controller\AddonsController;

class WeMallController extends AddonsController
{
    public function Config()
    {
        // $this->display(addons_url('WeMall://Admin/Index'));
        $this->display(ONETHINK_ADDON_PATH . 'WeMall/View/default/WeMall/Admin/Config.html');
    }
}