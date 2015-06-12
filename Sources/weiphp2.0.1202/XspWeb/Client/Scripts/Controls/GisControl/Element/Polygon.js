(function (window, $, namespace) {

    /**
     *  定义多边形元素类型
     */
    $.DeclareClass("XspWeb.Controls.GISControl.Element.Polygon", XspWeb.Controls.GISControl.Element.Element, {

        Constructor: function (layer) {
            this.Super(layer);

            this.mElementType = XspWeb.Controls.GISControl.Element.ElementType.Polygon;

            /**
             * 像素坐标点列表
             */
            this.mCoordinateList = new XspWeb.Core.List();

            /**
             * 屏幕坐标点列表
             */
            this.mScreenCoordinateList = new XspWeb.Core.List();
        },

        AddCoordinate: function (coordinateList) {
            this.mCoordinateList.Add(coordinateList);
        },

        OnPrepare: function (rect) {
            if (!this.mIsVisible)
                return false;

            var length = this.mCoordinateList.Length();
            if (length < 3)
                return;

            this.mScreenCoordinateList.Clear();
            var coordinate = this.mCoordinateList.Get(0);
            var point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                this.mLayer.mProjectionType,
                XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                coordinate,
                this.mLayer.mScale
            );
            this.mScreenCoordinateList.Add(point);
            var maxX = point.mX, maxY = point.mY, minX = point.mX, minY = point.mY;

            for (var i = 1; i < length; i++) {
                coordinate = this.mCoordinateList.Get(i);
                point = XspWeb.Controls.GISControl.Projections.CoordinateConverter.Transform(
                    this.mLayer.mProjectionType,
                    XspWeb.Controls.GISControl.Projections.ProjectionType.Pixel,
                    coordinate,
                    this.mLayer.mScale
                );

                point.mX = point.mX | 0;
                point.mY = point.mY | 0;

                this.mScreenCoordinateList.Add(point);

                maxX = Math.max(point.mX, maxX);
                maxY = Math.max(point.mY, maxY);
                minX = Math.min(point.mX, minX);
                minY = Math.min(point.mY, minY);
            }

            this.mArea = new XspWeb.Controls.GISControl.Common.Rectangle(
                minX,
                minY,
                maxX - minX,
                maxY - minY
            );

            return this.mArea.HasIntersection(rect);
        },

        OnPaint: function (renderable, rect) {
            if ((!this.mIsVisible) || (!this.mArea.HasIntersection(rect)))
                return;

            var pointList = this.mScreenCoordinateList;
            var startPoint = pointList.Get(0);
            renderable.BeginPath();
            renderable.MoveTo(startPoint.mX - rect.mX, startPoint.mY - rect.mY);
            for (var i = 1; i < pointList.Length(); i++) {
                var currentPoint = pointList.Get(i);
                renderable.LineTo((currentPoint.mX - rect.mX) / this.mLayer.mZoom, (currentPoint.mY - rect.mY) / this.mLayer.mZoom);
            }
            renderable.ClosePath();
            renderable.Stroke();
        }
    });
})(window, jQuery, $.Namespace());