 $(function() {
				if(jplist == null){jplist={};}
 
				$("#wheelcanvas").rotate({
                                        duration: 1000,
                                        angle: 0,
                                        animateTo: -90,
                                        easing: $.easing.easeOutSine
										});	
                var jsonData = {};
                var isStart = false;
                function lottery() {
                    var start = function() {
                        if (isStart) {
                            return false
                        }
                        isStart = true;
                        $.ajax({
                            type: 'POST',
                            url: joinurl,
                            dataType: 'json',
                            cache: false,
                            error: function() {
								alert('哎呀，转盘罢工了,快联系客服来修理吧！');                                
								isStart = false;
                            },
                            success: function(json) {
								switch(json.type.toString()){
									case "0":
										alert("您已经没有抽奖次数了！感谢您的参与，明天可以再抽哦！");
										isStart = false;
										break;
									case "1":
									case "5":
									case "6":										
									case "2":
										var a = parseInt(json.angle);
										var p = json.praisename;	
										var n = json.num;
										var t = json.jptype;
										var u = json.npcurl;
										var hdid = json.hdid;
										var token = json.token;
										var openid = json.openid;
										if (p != "") {
											$("#count").html(n);
											document.getElementById("playyy").play();
											$("#wheelcanvas").rotate({
												duration: 10000,
												angle: -90,
												animateTo: 3600+a,
												easing: $.easing.easeOutSine,
												callback: function() {
													if(json.type.toString() == "1"){
														alert("哎呀,这个奖品已经被抽完了啊,下次记到早点来！");														
													}else if(json.type.toString() == "5"){
														alert("您已经中过该奖品了，请尽快到米车网服务中心领取！");
													}else if(json.type.toString() == "6"){
														alert("哎呀,这个奖品已经被抽完了啊,明天记到早点来！");
													}else{
														if (t==1) {
															alert('哎呀,您未抽中,再来一次吧！');
														}else{
															alert('恭喜您抽中了"'+p+'"');
															if (u!='') {
																top.window.location='/index.php?s=/addon/Xydzp/Xydzp/formshow/id/'+hdid+'/token/'+token+'/openid/'+openid+'.html';
															};
															
														}
														//$("#result").show();
														//$("#prizetype").html(p);
													}
													isStart = false;
													
												}
											});
										} else {
											alert("没有设置奖品名称哦");
											isStart = false;
										}
										break;
									case "3":
										alert("活动还没有开始哦!");
										isStart = false;
										break;
									case "4":
										alert("活动已经结束啦！");
										isStart = false;
										break;
								}
                                
                            }
                        });
                    };
                    $("#startbtn").bind("click", start)
                }
                var colors = ["#feac01", "#e9e8e5", "#FFFFFF"];     
				var colors1 = ["#e9e8e5", "#FFFFFF"];     				
                var cwidth = 327;
                var startAngle = 0;
                var arc = Math.PI / jplist.length*2;
                var spinTimeout = null;
                var spinArcStart = 10;
                var spinTime = 0;
                var spinTimeTotal = 0;
                var ctx;
                function draw() {
                    drawRouletteWheel()
                }
                function drawRouletteWheel() {
                    var canvas = document.getElementById("wheelcanvas");
                    if (canvas.getContext) {
                        var outsideRadius = 124;
                        var textRadius = 100;
                        var insideRadius = 20;
                        ctx = canvas.getContext("2d");
						//创建新的图片对象
						var img = new Image();						
						//指定图片的URL						
						img.src = zpimg;					
						//浏览器加载图片完毕后再绘制图片						
						img.onload = function(){						
							ctx.clearRect(0, 0, 327, 327);
							ctx.drawImage(img, 0, 0);
							ctx.strokeStyle = "#e9e8e5";
							ctx.lineWidth = 1;
							ctx.font = 'normal 14px tohoma';
							for (var i = 0; i < jplist.length; i++) {
								var angle = startAngle + i * arc;
								if (i % 2 == 1) {
									gradient = ctx.createRadialGradient(cwidth / 2, cwidth / 2, 0, cwidth / 2, cwidth / 2, cwidth / 2);
									//gradient.addColorStop(0.1, '#fff');
									gradient.addColorStop(0.7, '#b73920');
									ctx.fillStyle = gradient
								} else {
									ctx.fillStyle = colors[(i % 2)];
								}
								ctx.beginPath();
								//计算片数								
								ctx.arc(cwidth / 2, cwidth / 2, outsideRadius, angle, angle + arc, false);
								ctx.arc(cwidth / 2, cwidth / 2, insideRadius, angle + arc, angle, true);
								ctx.shadowBlur = 5;
								ctx.shadowColor = "#666";
								ctx.stroke();
								ctx.fill();
								ctx.save();
								ctx.shadowOffsetX = -1;
								ctx.shadowOffsetY = -1;
								ctx.shadowBlur = 0;
								ctx.shadowColor = "rgb(220,220,220)";
								ctx.fillStyle = "black";
								ctx.translate(cwidth / 2 + Math.cos(angle + arc / 2) * textRadius, cwidth / 2 + Math.sin(angle + arc / 2) * textRadius);
								ctx.rotate(angle + arc / 2 + Math.PI / 2);
								var text = jplist[i].title;
								//绘制文字
								drawText(text,ctx,colors1[(i % 2)]);
								//ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
								ctx.restore()
							}
						};
                    }
                } 
				
				function drawText(text,ctx,c){	
					ctx.fillStyle = c;
					for(var i=0;i<text.length;i++){						
						ctx.fillText(text[i], -ctx.measureText(text[i]).width / 2, i*13);
					}
				}
				
                draw();
                lottery();		
            });