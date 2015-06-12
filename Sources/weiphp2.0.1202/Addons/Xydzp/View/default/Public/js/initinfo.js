function HideDiv() {
            $("#dail").hide(); $("#dail2").hide();
            $("#lean_overlay").fadeOut(200);
}
function ShowDiv() {
            var sig = $("#dail").outerWidth();
            /*加入遮罩层到Body*/
            var _3 = $("<div id='lean_overlay'>&nbsp;</div>");
            $("body").append(_3);
             /*边框DIV*/　
            $("#dail").css(
                 {
                     "display": "block",
                     "position": "fixed",
                     "opacity": 0,
                     "z-index": 11000,
                     "left": 53 + "%",
                     "margin-left": -(sig / 2) - 10 + "px",
                     "top": 170 + "px",
                     "padding": "5px 0px 0px 0px",

                 });
                 /*最上层DIV*/
            $("#dail2").css(
                 {
                     "display": "block",
                     "position": "fixed",
                     "opacity": 0,
                     "z-index": 11001,
                     "left": 53 + "%",
                     "margin-left": -(sig / 2) + "px",
                     "top": "180" + "px",
                     "padding": "5px 0px 0px 0px",

                 });

            /*边框DIV 透明到0.5*/　
            $("#dail").fadeTo(200, 0.5);
                 /*最上层DIV 不透明*/
            $("#dail2").fadeTo(100, 1);
            /*遮罩层 透明到0.1*/
            $("#lean_overlay").fadeTo(200, 0.6);            
            //$("#lean_overlay").click(HideDiv);
            $("#lean_overlay").show();

}
