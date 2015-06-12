CREATE TABLE `wp_wevote_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `introduce` text COMMENT '投票介绍',
  `datetime` text COMMENT '活动时间',
  `startSignUpDateTime` datetime DEFAULT NULL COMMENT '报名开始时间',
  `stopSignUpDateTime` datetime DEFAULT NULL COMMENT '报名截至时间',
  `stopDateTime` datetime DEFAULT NULL COMMENT '活动截至时间',
  `votePerDay` int(10) unsigned DEFAULT NULL COMMENT '每天投票次数',
  `shareUrl` text COMMENT '推广页面',
  `afterShareUrl` text COMMENT '分享后跳转页面',
  `shareTitle` text COMMENT '分享标题',
  `shareDesc` text COMMENT '分享描述',
  `shareImageUrl` text COMMENT '分享图片链接',
  `pictures` text COMMENT '轮播图片',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='投票活动配置';

CREATE TABLE IF NOT EXISTS `wp_wevote_candidates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action_id` int(10) unsigned NOT NULL COMMENT '投票活动索引',
  `openid` varchar(64) NOT NULL,
  `title` text COMMENT '标题或人名',
  `comment` text COMMENT '自我介绍',
  `announce` text COMMENT '宣言',
  `parent` text COMMENT '家长姓名',
  `tel` text COMMENT '联系方式',
  `address` text COMMENT '住宅名称',
  `cell` text COMMENT '楼层单元',
  `picture` text COMMENT '照片路径',
  `datetime` datetime NOT NULL COMMENT '报名时间',
  `status` int(10) NOT NULL COMMENT '候选人状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='候选人表';

CREATE TABLE IF NOT EXISTS `wp_wevote_info` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action_id` int(10) unsigned NOT NULL COMMENT '投票活动索引',
  `voter_id` int(10) unsigned NOT NULL COMMENT '投票人',
  `candidate_id` int(10) unsigned NOT NULL COMMENT '候选人',
  `datetime` datetime NOT NULL COMMENT '投票日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='投票信息表';

CREATE TABLE IF NOT EXISTS `wp_wevote_voters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action_id` int(10) unsigned NOT NULL COMMENT '投票活动索引',
  `openid` varchar(64) NOT NULL,
  `datetime` datetime NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid_UNIQUE` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='投票人表';

CREATE TABLE `wp_wevote_visitors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action_id` int(10) unsigned NOT NULL COMMENT '投票活动索引',
  `openid` varchar(64),
  `datetime` datetime NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户访问表';

CREATE TABLE `wp_wevote_share` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action_id` int(10) unsigned NOT NULL COMMENT '投票活动索引',
  `openid` varchar(64),
  `datetime` datetime NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户分享表';

CREATE TABLE `wp_wevote_headpicture` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `picid` int(10) unsigned DEFAULT NULL COMMENT 'wp_picture表id',
  `picurl` varchar(300) DEFAULT NULL COMMENT '图片url',
  `title` varchar(100) DEFAULT NULL COMMENT '图片名称',
  `configid` int(10) unsigned DEFAULT NULL COMMENT 'wp_wevote_config表id',
  `orderno` int(10) unsigned DEFAULT NULL COMMENT '图片顺序',
  `remark` varchar(300) DEFAULT NULL COMMENT '图片备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='头部图片表';