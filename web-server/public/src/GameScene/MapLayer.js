
var MapLayer;
MapLayer = cc.Layer.extend(
    {
        ctor:function()
        {
            this._super();
        },
        initMap: function (mapPath) {
            var m_map = cc.TMXTiledMap.create(mapPath);
            this.addChild(m_map);
            return true;
        }

    }
)
MapLayer.create = function(mapPath)
{
    var mapLayer = new MapLayer();
    if(mapLayer&&mapLayer.initMap(mapPath))
    {
        return mapLayer;
    }
    return null;
}
