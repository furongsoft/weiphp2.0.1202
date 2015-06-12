CREATE TABLE IF NOT EXISTS `wp_xydzp` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`keyword`  varchar(255) NOT NULL   COMMENT '关键词',
`start_date`  int(10) NOT NULL   COMMENT '开始时间',
`end_date`  int(10) NOT NULL   COMMENT '结束日期',
`cTime`  int(10) NOT NULL   COMMENT '活动创建时间',
`states`  char(10) NOT NULL   DEFAULT 0 COMMENT '活动状态',
`picurl`  int(10) unsigned NOT NULL   COMMENT '封面图片',
`title`  varchar(255) NOT NULL   COMMENT '活动标题',
`choujnum`  int(10) unsigned NOT NULL   DEFAULT 0 COMMENT '每日抽奖次数',
`des`  text NOT NULL   COMMENT '活动规则',
`des_jj`  text NOT NULL   COMMENT '活动介绍简介',
`token`  varchar(255) NOT NULL  COMMENT 'Token',
`gzurl`  text NOT NULL  COMMENT '新增关注url',
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci CHECKSUM=0 ROW_FORMAT=DYNAMIC DELAY_KEY_WRITE=0;
INSERT INTO `wp_model` (`name`,`title`,`extend`,`relation`,`need_pk`,`field_sort`,`field_group`,`attribute_list`,`template_list`,`template_add`,`template_edit`,`list_grid`,`list_row`,`search_key`,`search_list`,`create_time`,`update_time`,`status`,`engine_type`) VALUES ('xydzp','幸运大转盘','0','','1','{"1":["keyword","title","start_date","end_date","picurl","guiz","des","des_jj","choujnum"]}','1:基础','','','','','id:编号\r\nkeyword:触发关键词\r\ntitle:标题\r\nstart_date|time_format:开始时间\r\nend_date|time_format:结束日期\r\nchoujnum:每日抽奖次数\r\nid:操作:show?id=[id]|预览,zjloglists?id=[id]|中奖记录,jplists?xydzp_id=[id]|奖品设置,[EDIT]|编辑,[DELETE]|删除','10','title','des','1395395179','1396703468','1','MyISAM');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('keyword','关键词','varchar(255) NOT NULL ','string','','用户发送 “关键词” 触发','1','','0','0','1','1395395713','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('start_date','开始时间','int(10) NOT NULL ','datetime','','','1','','0','0','1','1395395676','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('end_date','结束日期','int(10) NOT NULL ','datetime','','','1','','0','0','1','1395395670','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('cTime','活动创建时间','int(10) NOT NULL ','datetime','','','0','','0','0','1','1395395963','1395395179','','3','','regex','time','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('states','活动状态','char(10) NOT NULL ','radio','0','','0','0:未开始\r\n1:已结束','0','0','1','1395395602','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('picurl','封面图片','int(10) unsigned NOT NULL ','picture','','','1','','0','0','1','1395395545','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('title','活动标题','varchar(255) NOT NULL ','string','','','1','','0','0','1','1395395535','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('choujnum','每日抽奖次数','int(10) unsigned NOT NULL ','num','0','','1','','0','0','1','1395395485','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('des','活动规则','text NOT NULL ','editor','','','1','','0','0','1','1415859409','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('des_jj','活动介绍简介','text NOT NULL ','textarea','','活动介绍简介 用于给用户发送消息时候的图文描述','1','','0','0','1','1395395316','1395395179','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('token','Token','varchar(255) NOT NULL','string','','','0','','0','0','1','1395396571','1395396571','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('gzurl','新增关注url','text NOT NULL','string','','填写关注公众账号的引导页','1','','0','1','1','1415840329','1415840279','','3','','regex','','3','function');
UPDATE `wp_attribute` SET model_id= (SELECT MAX(id) FROM `wp_model`) WHERE model_id=0;
CREATE TABLE IF NOT EXISTS `wp_xydzp_jplist` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`gailv`  int(10) UNSIGNED NOT NULL  DEFAULT 0 COMMENT '中奖概率',
`gailv_str`  varchar(255) NOT NULL  COMMENT '参数',
`xydzp_id`  int(10) UNSIGNED NOT NULL  DEFAULT 0 COMMENT '幸运大转盘关联的活动id',
`jlnum`  int(10) UNSIGNED NOT NULL  DEFAULT 0 COMMENT '奖励数量',
`type`  char(50) NOT NULL  DEFAULT 0 COMMENT '奖品中奖方式',
`gailv_maxnum`  int(10) UNSIGNED NOT NULL  DEFAULT 0 COMMENT '单日发放上限',
`xydzp_option_id`  int(10) UNSIGNED NOT NULL  COMMENT '幸运大转盘关联的全局奖品id',
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci CHECKSUM=0 ROW_FORMAT=DYNAMIC DELAY_KEY_WRITE=0;
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('23','4','','6','1','0','20','23');
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('22','0','','6','0','0','0','22');
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('21','5','','6','1','0','50','19');
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('20','1','','6','1','0','10','20');
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('17','40','','6','1','0','200','15');
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('16','4','','6','1','0','99999999','18');
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('19','2','','6','1','0','99999999','21');
INSERT INTO `wp_xydzp_jplist` (`id`,`gailv`,`gailv_str`,`xydzp_id`,`jlnum`,`type`,`gailv_maxnum`,`xydzp_option_id`) VALUES ('18','1000','','6','1','0','99999999','16');
INSERT INTO `wp_model` (`name`,`title`,`extend`,`relation`,`need_pk`,`field_sort`,`field_group`,`attribute_list`,`template_list`,`template_add`,`template_edit`,`list_grid`,`list_row`,`search_key`,`search_list`,`create_time`,`update_time`,`status`,`engine_type`) VALUES ('xydzp_jplist','幸运大转盘奖品列表','0','','1','{"1":["type","gailv","gailv_str","gailv_maxnum","jlnum"]}','1:基础','','','','','type:中奖方式\r\ngailv_str:中奖概率或参数\r\ngailv_maxnum:单日发放上限\r\njlnum:奖励数量\r\nid:操作:jpedit?id=[id]|编辑,jpdel?id=[id]|删除','10','','','1395554963','1395921237','1','MyISAM');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('gailv','中奖概率','int(10) UNSIGNED NOT NULL','num','0','请输入0-100之间书正整数','1','','0','0','1','1395559151','1395559151','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('gailv_str','参数','varchar(255) NOT NULL','string','','请输入对应中奖方式的相应值 多个以英文状态下的 逗号(,)分隔','1','','0','0','1','1395559219','1395559219','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('xydzp_id','幸运大转盘关联的活动id','int(10) UNSIGNED NOT NULL','num','0','幸运大转盘关联的活动id','0','','0','0','1','1395555019','1395555019','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('jlnum','奖励数量','int(10) UNSIGNED NOT NULL','num','0','中奖后，获得该奖品的数量','1','','0','1','1','1395559386','1395559386','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('type','奖品中奖方式','char(50) NOT NULL','select','0','选择奖品中奖的方式','1','0:按概率中奖\r\n1:按时间中奖(未启用)\r\n2:按顺序中奖(未启用)\r\n3:按指定用户id中奖(未启用)','0','0','1','1396253189','1395559102','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('gailv_maxnum','单日发放上限','int(10) UNSIGNED NOT NULL','num','0','每天最多发放奖品的数量','1','','0','0','1','1395559281','1395559281','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('xydzp_option_id','幸运大转盘关联的全局奖品id','int(10) UNSIGNED NOT NULL','num','','幸运大转盘关联的全局奖品id','0','','0','0','1','1395555085','1395555085','','3','','regex','','3','function');
UPDATE `wp_attribute` SET model_id= (SELECT MAX(id) FROM `wp_model`) WHERE model_id=0;
CREATE TABLE IF NOT EXISTS `wp_xydzp_log` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`zjdate`  int(10) UNSIGNED NOT NULL  COMMENT '中奖时间',
`xydzp_id`  int(10) unsigned NOT NULL   DEFAULT 0 COMMENT '活动id',
`xydzp_option_id`  int(10) unsigned NOT NULL   DEFAULT 0 COMMENT '奖品id',
`state`  tinyint(2) NOT NULL  DEFAULT 0 COMMENT '领奖状态',
`zip`  int(10) unsigned NOT NULL   COMMENT '邮编',
`iphone`  varchar(255) NOT NULL   COMMENT '电话',
`address`  text NOT NULL   COMMENT '收件地址',
`message`  text NOT NULL   COMMENT '留言',
`uid`  varchar(255) NOT NULL  COMMENT '用户openid',
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci CHECKSUM=0 ROW_FORMAT=DYNAMIC DELAY_KEY_WRITE=0;
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('284','1415870043','6','15','0','0','','','','oP0R2jkfSSHncaMRWnJGvwAVzFp4');
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('283','1415870022','6','19','0','0','','','','oP0R2jkfSSHncaMRWnJGvwAVzFp4');
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('281','1415867354','6','15','0','0','','','','oP0R2jgA7sIHK5djE3WoUn7tdIE8');
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('280','1415858737','6','23','0','0','','','','oP0R2joD1CYPzhpkDGnEUL3b55wc');
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('279','1415858643','6','19','0','0','','','','oP0R2joD1CYPzhpkDGnEUL3b55wc');
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('282','1415869809','6','23','0','0','','','','oP0R2jkfSSHncaMRWnJGvwAVzFp4');
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('277','1415838251','6','15','0','0','','','','oP0R2jtalCYuzr9T8mr8ehFCO9Sg');
INSERT INTO `wp_xydzp_log` (`id`,`zjdate`,`xydzp_id`,`xydzp_option_id`,`state`,`zip`,`iphone`,`address`,`message`,`uid`) VALUES ('276','1415806461','6','15','0','0','','','','oP0R2joD1CYPzhpkDGnEUL3b55wc');
INSERT INTO `wp_model` (`name`,`title`,`extend`,`relation`,`need_pk`,`field_sort`,`field_group`,`attribute_list`,`template_list`,`template_add`,`template_edit`,`list_grid`,`list_row`,`search_key`,`search_list`,`create_time`,`update_time`,`status`,`engine_type`) VALUES ('xydzp_log','幸运大转盘中奖列表','0','','1','{"1":["xydzp_id","xydzp_option_id","zip","iphone","address","message"]}','1:基础','','','','','id:编号\r\nnickname:用户名称\r\nopenid:用户ID\r\nmobile:联系电话\r\nxydzp_id:活动ID\r\ntitle:奖品名称\r\nstate|get_name_by_status:领奖状态\r\nzjdate|time_format:中奖时间\r\nid:标记:ylingqu?id=[id]|已领取,wlingqu?id=[id]|未领取','10','','','1395395200','1396705134','1','MyISAM');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('zjdate','中奖时间','int(10) UNSIGNED NOT NULL','num','','','0','','0','0','1','1396191999','1396191999','','3','','regex','time()','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('xydzp_id','活动id','int(10) unsigned NOT NULL ','string','0','','1','','0','0','1','1395395200','1395395200','','0','','','','0','');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('xydzp_option_id','奖品id','int(10) unsigned NOT NULL ','string','0','','1','','0','0','1','1395395200','1395395200','','0','','','','0','');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('state','领奖状态','tinyint(2) NOT NULL','bool','0','','0','0:未领取\r\n1:已领取','0','0','1','1396705093','1395395200','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('zip','邮编','int(10) unsigned NOT NULL ','string','','','1','','0','0','1','1395395200','1395395200','','0','','','','0','');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('iphone','电话','varchar(255) NOT NULL ','string','','','1','','0','0','1','1395395200','1395395200','','0','','','','0','');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('address','收件地址','text NOT NULL ','string','','','1','','0','0','1','1395395200','1395395200','','0','','','','0','');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('message','留言','text NOT NULL ','string','','','1','','0','0','1','1395395200','1395395200','','0','','','','0','');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('uid','用户openid','varchar(255) NOT NULL','string','','','0','','0','0','1','1396686415','1396686415','','3','','regex','','3','function');
UPDATE `wp_attribute` SET model_id= (SELECT MAX(id) FROM `wp_model`) WHERE model_id=0;
CREATE TABLE IF NOT EXISTS `wp_xydzp_option` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`duijma`  text NOT NULL  COMMENT '兑奖码',
`title`  varchar(255) NOT NULL   COMMENT '奖品名称',
`pic`  int(10) unsigned NOT NULL   COMMENT '奖品图片',
`miaoshu`  text NOT NULL   COMMENT '奖品描述',
`num`  int(10) unsigned NOT NULL   DEFAULT 0 COMMENT '库存数量',
`jptype`  char(10) NOT NULL   DEFAULT 0 COMMENT '奖品类型',
`token`  varchar(255) NOT NULL  COMMENT 'Token',
`isdf`  tinyint(2) NOT NULL  DEFAULT 0 COMMENT '是否为谢谢惠顾类',
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci CHECKSUM=0 ROW_FORMAT=DYNAMIC DELAY_KEY_WRITE=0;
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('23','','50元话费','0','','198','0','gh_9188fd99c051','0');
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('21','','不要灰心','0','','999999996','0','gh_9188fd99c051','1');
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('20','','充电宝','0','','200','1','gh_9188fd99c051','0');
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('22','','苹果手机6','0','','0','1','gh_9188fd99c051','0');
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('19','','U盘','0','','498','1','gh_9188fd99c051','0');
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('18','','再接再厉','0','','99999923','0','gh_9188fd99c051','1');
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('16','','谢谢惠顾','0','','9999699','0','gh_9188fd99c051','1');
INSERT INTO `wp_xydzp_option` (`id`,`duijma`,`title`,`pic`,`miaoshu`,`num`,`jptype`,`token`,`isdf`) VALUES ('15','','灭火器','0','<p>汽车灭火器</p>','998','1','gh_9188fd99c051','0');
INSERT INTO `wp_model` (`name`,`title`,`extend`,`relation`,`need_pk`,`field_sort`,`field_group`,`attribute_list`,`template_list`,`template_add`,`template_edit`,`list_grid`,`list_row`,`search_key`,`search_list`,`create_time`,`update_time`,`status`,`engine_type`) VALUES ('xydzp_option','幸运大转盘奖品库设置','0','','1','{"1":["title","jptype","num","pic","miaoshu"]}','1:基础','','','','','pic:奖品图片\r\ntitle:奖品名称\r\njptype:奖品类型\r\nnum:库存数量\r\nmiaoshu:奖品介绍\r\nid:操作:jpopedit?id=[id]|编辑,jpopdel?id=[id]|删除','10','title','','1395395190','1395558485','1','MyISAM');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('duijma','兑奖码','text NOT NULL','textarea','','请输入兑奖码，一行一个','1','','0','0','1','1396253842','1396253842','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('title','奖品名称','varchar(255) NOT NULL ','string','','','1','','0','0','1','1395495283','1395395190','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('pic','奖品图片','int(10) unsigned NOT NULL ','picture','','','1','','0','0','1','1395495279','1395395190','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('miaoshu','奖品描述','text NOT NULL ','editor','','','1','','0','0','1','1395498375','1395395190','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('num','库存数量','int(10) unsigned NOT NULL ','num','0','','1','','0','0','1','1396667941','1395395190','','0','','regex','','0','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('jptype','奖品类型','char(10) NOT NULL ','select','0','奖品的类型','1','0:虚拟\r\n1:实物\r\n2:优惠券类（需要填写兑奖码且奖品数量为兑奖码数）','0','0','1','1396667895','1395395190','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('token','Token','varchar(255) NOT NULL','string','','','0','','0','0','1','1395554191','1395554191','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('isdf','是否为谢谢惠顾类','tinyint(2) NOT NULL','bool','0','','1','0:中奖品\r\n1:该奖为谢谢惠顾类','0','0','1','1396338661','1396191564','','3','','regex','','3','function');
UPDATE `wp_attribute` SET model_id= (SELECT MAX(id) FROM `wp_model`) WHERE model_id=0;
CREATE TABLE IF NOT EXISTS `wp_xydzp_userlog` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`uid`  varchar(255) NOT NULL  COMMENT '用户id',
`xydzp_id`  int(10) UNSIGNED NOT NULL  COMMENT '幸运大转盘关联的活动id',
`num`  int(10) UNSIGNED NOT NULL  DEFAULT 0 COMMENT '已经抽奖的次数',
`extra_num`  int(10) UNSIGNED NOT NULL  DEFAULT 0 COMMENT '额外抽奖的次数',
`cjdate`  int(10) NOT NULL  COMMENT '抽奖日期',
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci CHECKSUM=0 ROW_FORMAT=DYNAMIC DELAY_KEY_WRITE=0;
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('12','oP0R2joD1CYPzhpkDGnEUL3b55wc','6','80','1415872938');
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('3','oP0R2jnTV10qpE6D9X0USLMzWg9A','6','0','1415442751');
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('4','oP0R2jtalCYuzr9T8mr8ehFCO9Sg','6','10','1415838661');
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('5','oP0R2jnGuNHiGmwNT02sMGM-pwAQ','6','2','1415869027');
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('13','oP0R2jkfSSHncaMRWnJGvwAVzFp4','6','19','1415873047');
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('7','oP0R2jgA7sIHK5djE3WoUn7tdIE8','6','20','1415870467');
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('8','oP0R2jmPeDnjk3eU1lRs3vV867PM','6','0','1415699683');
INSERT INTO `wp_xydzp_userlog` (`id`,`uid`,`xydzp_id`,`num`,`cjdate`) VALUES ('9','oP0R2jgBl3MqZmt8WEG1gp8L_rxE','6','2','1415762708');
INSERT INTO `wp_model` (`name`,`title`,`extend`,`relation`,`need_pk`,`field_sort`,`field_group`,`attribute_list`,`template_list`,`template_add`,`template_edit`,`list_grid`,`list_row`,`search_key`,`search_list`,`create_time`,`update_time`,`status`,`engine_type`) VALUES ('xydzp_userlog','幸运大转盘用户抽奖记录','0','','1','','1:基础','','','','','','10','','','1395567366','1395567366','1','MyISAM');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('uid','用户id','varchar(255) NOT NULL','string','','用户id','0','','0','0','1','1395567404','1395567404','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('xydzp_id','幸运大转盘关联的活动id','int(10) UNSIGNED NOT NULL','num','','幸运大转盘关联的活动id','0','','0','0','1','1395567452','1395567452','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('num','已经抽奖的次数','int(10) UNSIGNED NOT NULL','num','0','','1','','0','0','1','1395567486','1395567486','','3','','regex','','3','function');
INSERT INTO `wp_attribute` (`name`,`title`,`field`,`type`,`value`,`remark`,`is_show`,`extra`,`model_id`,`is_must`,`status`,`update_time`,`create_time`,`validate_rule`,`validate_time`,`error_info`,`validate_type`,`auto_rule`,`auto_time`,`auto_type`) VALUES ('cjdate','抽奖日期','int(10) NOT NULL','datetime','','','1','','0','0','1','1395567537','1395567537','','3','','regex','time','3','function');
UPDATE `wp_attribute` SET model_id= (SELECT MAX(id) FROM `wp_model`) WHERE model_id=0;