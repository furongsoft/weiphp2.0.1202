<?php
/**
 * Created by PhpStorm.
 * User: Alex
 * Date: 2015/5/31
 * Time: 0:27
 */

namespace Addons\WeMall\Controller;

use Home\Controller\AddonsController;

class AdminController extends AddonsController
{
    public function Index()
    {
        for ($i = 0; $i < 100; ++$i)
            echo "Hello</br>";
    }
}