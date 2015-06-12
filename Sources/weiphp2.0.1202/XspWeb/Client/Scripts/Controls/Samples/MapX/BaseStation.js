(function (window, $, namespace) {
    /**
     * 定义基站元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.BaseStation", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);


            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.BaseStation;

            /**
             * 扇形列表
             */
            this.mSectorList = new XspWeb.Core.List();

            /**
             * 基站宽
             */
            this.mWidth = 0;

            /**
             * 基站高
             */
            this.mHeight = 0;

            /**
             * 主标题
             */
            this.mMessage = null;
        },

        SetWidth: function (width) {
            this.mWidth = width;
        },

        SetHeight: function (height) {
            this.mHeight = height;
        },

        SetSectorList: function (sectorList) {
            this.mSectorList = sectorList;
        },

        GetSectorList: function () {
            return this.mSectorList;
        },

        AddSector: function (sector) {
            this.mSectorList.Add(sector);
        },

        SetMessage: function (message) {
            this.mMessage = message;
        },

        OnPrepare: function (rect) {
            if (!this.mIsVisible)
                return false;

            var areaTemp = new XspWeb.Controls.GISControl.Common.Rectangle();
            for (var i = 0; i < this.mSectorList.Length(); i++) {
                var sector = this.mSectorList.Get(i);
                sector.OnPrepare(rect);
                if (i == 0)
                    areaTemp = sector.mArea;
            }

            this.mArea = areaTemp;

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if (!this.mArea.HasIntersection(rect) || this.mSectorList.Length() <= 0)
                return;

            for (var i = 0; i < this.mSectorList.Length(); i++) {
                var sector = this.mSectorList.Get(i);
                sector.OnPaint(renderable, rect);
            }
        }
    });
})
(window, jQuery, $.Namespace());