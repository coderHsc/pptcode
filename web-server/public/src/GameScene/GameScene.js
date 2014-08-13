//创建游戏场景
var GameScene = cc.Scene.extend(
    {
        onEnter:function()
        {
            this._super();
            var layer = new GameLayer();
            this.addChild(layer);
        }
    }
);
//创建游戏层
GameLayer = cc.Layer.extend(
    {
        m_heroSprite:null,
        ctor: function ()
        {
            this._super();

            var bg,winSize;
            winSize = cc.director.getWinSize();
            //地图
            var m_mapLayer = MapLayer.create(res.Level1_1_tmx);
            this.addChild(m_mapLayer);

            //玩家
            m_heroSprite  = HeroSprite.create(HeroType[0]);
            m_heroSprite.setPosition(winSize.width/2,winSize.height/2);
            this.addChild(m_heroSprite);

            //监听键盘按键事件
            if (cc.sys.capabilities.hasOwnProperty('keyboard'))
                cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed:function (key, event) {
                        G_STATE.KEYS[key] = true;
                    },
                    onKeyReleased:function (key, event) {
                        G_STATE.KEYS[key] = false;
                    }
                }, this);

            //开始更新
            this.scheduleUpdate();
            return true;
        },
        update:function(dt)
        {
            m_heroSprite.update(dt);
            //m_heroSprite.setPosition(m_heroSprite.x,m_heroSprite.y);
            //console.log(this.m_heroSprite.getPositionX());
        },
        onKeyUp:function(e)
        {
            console.log("keyup");
        }
    }
);