/**
 * Created by hushencheng on 14-7-22.
 */

var pomelo = window.pomelo;

var g_PlayerId = 0;

var GameLobbyScene = cc.Scene.extend(
    {
        onEnter:function()
        {
            this._super();

            var layer = new GameLobbyLayer();
            this.addChild(layer);
        }
    }
)
var GameLobbyLayer = cc.Layer.extend({
        _winSize:null,
        _roomIdList:[],
        _roomNumPerPage:9,
        _roomNameStr:"paopaotang",
        _roomNameList:[],
        _roomPlayerNumList:[],
        _roomNameEdit:null,
        _playerNumberEdit:null,

        _curPageNum:1,
        _maxPageNum:1,
        _labelCurPage:null,
        //房间号
        _roomId:0,
        _enterRoomMenuList:[],
        _exitRoomMenuList:[],
        _createRoomBtnMenu:null,
        ctor:function(){
            this._super();
            this._init();
        },
        _init: function (){

            _winSize = cc.director.getWinSize();
            var bgSprite = cc.Sprite.create(res.inputPanelBg_png);
            bgSprite.setScaleX(_winSize.width/bgSprite.getContentSize().width);
            bgSprite.setScaleY(_winSize.height/bgSprite.getContentSize().height);
            bgSprite.setPosition(_winSize.width/2,_winSize.height/2);
            this.addChild(bgSprite,1);

            var lobbyBgSprite = cc.Sprite.create(res.gameLobby_png);
            lobbyBgSprite.setScaleX(_winSize.width/lobbyBgSprite.getContentSize().width*0.8);
            lobbyBgSprite.setScaleY(_winSize.height/lobbyBgSprite.getContentSize().height*0.8);
            lobbyBgSprite.setPosition(_winSize.width/2,_winSize.height/2);
            this.addChild(lobbyBgSprite,2);

            //room id list
            for(var i=0;i<this._roomNumPerPage+1;i++)
            {
                var tempId=i+1;
                if(i>=this._roomNumPerPage)
                {
                    tempId='***';
                }
                this._roomIdList[i]=cc.LabelTTF.create(tempId,'Arial',16);
                this._roomIdList[i].setPosition(_winSize.width*0.168,_winSize.height*0.8-i*_winSize.height*0.068);
                this._roomIdList[i].setColor(new cc.color(48, 199, 106));
                this._roomIdList[i].setVisible(i>=this._roomNumPerPage);
                this.addChild(this._roomIdList[i],3);
            }
            //room name

            for(var i=0;i<this._roomNumPerPage;i++)
            {
                this._roomNameList[i] = cc.LabelTTF.create(this._roomNameStr, 'Arial', 16);
                this._roomNameList[i].setPosition(_winSize.width*0.322,_winSize.height*0.8-i*_winSize.height*0.068);
                this._roomNameList[i].setColor(new cc.color(73, 216, 222));
                this._roomNameList[i].setVisible(false);
                this.addChild(this._roomNameList[i],3);
            }
            //player num
            for(var i=0;i<this._roomNumPerPage;i++)
            {
                this._roomPlayerNumList[i]=cc.LabelTTF.create('6/6','Arial',16);
                this._roomPlayerNumList[i].setPosition(_winSize.width*0.465,_winSize.height*0.8-i*_winSize.height*0.068);
                this._roomPlayerNumList[i].setColor(new cc.color(73, 216, 222));
                this._roomPlayerNumList[i].setVisible(false);
                this.addChild(this._roomPlayerNumList[i],3);
            }

            //change room name edit
            blockSize = cc.size(130, 35);
            this._roomNameEdit = cc.EditBox.create(blockSize, cc.Scale9Sprite.create(res.inputNameEdit_png));
            this._roomNameEdit.setPlaceholderFontColor(cc.color(73, 216, 222));
            this._roomNameEdit.setPlaceHolder(this._roomNameStr);
            this._roomNameEdit.setPosition(_winSize.width*0.32,_winSize.height*0.185);
            this._roomNameEdit.setDelegate(this);
            this._roomNameEdit.setFontColor(cc.color(73, 216, 222));
            this._roomNameEdit.setMaxLength(12);
            this.addChild(this._roomNameEdit,3);

            //change player number edit
            blockSize = cc.size(70, 35);
            this._playerNumberEdit = cc.EditBox.create(blockSize, cc.Scale9Sprite.create(res.inputNameEdit_png));
            this._playerNumberEdit.setPlaceholderFontColor(cc.color(73, 216, 222));
            this._playerNumberEdit.setPlaceHolder(1);
            this._playerNumberEdit.setPosition(_winSize.width*0.465,_winSize.height*0.185);
            this._playerNumberEdit.setDelegate(this);
            this._playerNumberEdit.setFontColor(cc.color(73, 216, 222));
            this._playerNumberEdit.setMaxLength(1);
            this.addChild(this._playerNumberEdit,3);


            //create room button

            cc.spriteFrameCache.addSpriteFrames(res.createRoom_plist);

            var createRoomBtn = cc.MenuItemSprite.create(
                cc.Sprite.create("#createRoom_1.png"),
                cc.Sprite.create("#createRoom_2.png"),
                cc.Sprite.create("#createRoom_2.png"),
                this._createRoomBtnCb,
                this
            );

            createRoomBtn.setPosition(_winSize.width*0.57, _winSize.height*0.185);
            _createRoomBtnMenu = cc.Menu.create(createRoomBtn);
            _createRoomBtnMenu.setPosition(0,0);
            this.addChild(_createRoomBtnMenu,3);

            //page
            this._labelCurPage = cc.LabelTTF.create(this._curPageNum + ' / ' + this._maxPageNum + ' 页', 'Arial', 16);
            this._labelCurPage.setPosition(138, 84);
            this._labelCurPage.setColor(new cc.color(255, 255, 255));
            this.addChild(this._labelCurPage,3);

            cc.spriteFrameCache.addSpriteFrames(res.preNextPage_plist);

            //previous page
            var prePageBtn = cc.MenuItemSprite.create(
                cc.Sprite.create("#preNextPage_1.png"),
                cc.Sprite.create("#preNextPage_3.png"),
                cc.Sprite.create("#preNextPage_3.png"),
                this._prePageBtnCb,
                this
            );
            prePageBtn.setPosition(410, 84);
            var prePageMenu = cc.Menu.create(prePageBtn);
            prePageMenu.setPosition(0,0);
            this.addChild(prePageMenu,3);

            //next page
            var nectPageBtn = cc.MenuItemSprite.create(
                cc.Sprite.create("#preNextPage_5.png"),
                cc.Sprite.create("#preNextPage_7.png"),
                cc.Sprite.create("#preNextPage_7.png"),
                this._nextPageBtnCb,
                this
            );
            nectPageBtn.setPosition(500, 84);
            var nectPageMenu = cc.Menu.create(nectPageBtn);
            nectPageMenu.setPosition(0,0);
            this.addChild(nectPageMenu,3);

            cc.spriteFrameCache.addSpriteFrames(res.refreshBtn_plist);
            // refresh page
            var refreshBtn = cc.MenuItemSprite.create(
                cc.Sprite.create("#refreshBtn_1.png"),
                cc.Sprite.create("#refreshBtn_3.png"),
                cc.Sprite.create("#refreshBtn_3.png"),
                this._refreshRoomListCb,
                this
            );
            refreshBtn.setPosition(360, 84);
            var refreshMenu = cc.Menu.create(refreshBtn);
            refreshMenu.setPosition(0,0);
            this.addChild(refreshMenu,3);

            //enter room menu and exit room menu
            cc.spriteFrameCache.addSpriteFrames(res.enterRoom_plist);
            cc.spriteFrameCache.addSpriteFrames(res.exitRoom_plist);
            for(var i=0;i<this._roomNumPerPage;i++)
            {
                //enter room
                var enterRoomBtn = cc.MenuItemSprite.create(
                    cc.Sprite.create("#enterRoom_1.png"),
                    cc.Sprite.create("#enterRoom_2.png"),
                    cc.Sprite.create("#enterRoom_2.png"),
                    this['enterRoomBtnCb_' + i],
                    this
                )
                enterRoomBtn.setPosition(_winSize.width*0.57,_winSize.height*0.8-i*_winSize.height*0.068);
                this._enterRoomMenuList[i] = cc.Menu.create(enterRoomBtn);
                this._enterRoomMenuList[i].setPosition(0, 0);
                this._enterRoomMenuList[i].setVisible(false);
                this.addChild(this._enterRoomMenuList[i],3);

                //exit room
                var enterRoomBtn = cc.MenuItemSprite.create(
                    cc.Sprite.create("#exitRoom_1.png"),
                    cc.Sprite.create("#exitRoom_1.png"),
                    cc.Sprite.create("#exitRoom_2.png"),
                    this._exitRoomBtnCb,
                    this
                )
                enterRoomBtn.setPosition(_winSize.width*0.57,_winSize.height*0.8-i*_winSize.height*0.068);
                this._exitRoomMenuList[i] = cc.Menu.create(enterRoomBtn);
                this._exitRoomMenuList[i].setPosition(0, 0);
                this._exitRoomMenuList[i].setVisible(false);
                this.addChild(this._exitRoomMenuList[i],3);
            }

        },
        //创建房间回调函数
        _createRoomBtnCb:function(sender)
        {
            var realplayerNum = this._playerNumberEdit.getString();
            var roomName  = this._roomNameEdit.getString();
            //用来标识一个具体服务或者客户端接受服务端推送消息的位置
            var route = "connector.entryHandler.enterRoom";
            pomelo.request(route,{
                //
                playerId: g_PlayerId,
                playerName:"zhangsan",
                roomId:-1,
                roomName:roomName,
                realplayerNum:realplayerNum

            },function(data){
                this._roomId = parseInt(data.roomId);
                ///////////

                //this._refreshRoomListCb();

            })

        },
        _prePageBtnCb:function(sender)
        {

        },
        _nextPageBtnCb:function(sender)
        {

        },
        _refreshRoomListCb:function(sender)
        {
            this._getRoomList(this._curPageNum);
        },
        _getRoomList:function(pageNum)
        {
            var route="game.gameHandler.getRoomList";
            pomelo.request(route,{
                pageNum:pageNum
            }),function(data)
            {
                this._updateRoomList(data.ret);
            }
        },
        _updateRoomList:function(data)
        {
            if(!data){  return;  }
            if((!!data.curPageNum) && (!!data.maxPageNum))
            {
                this._curPageNum=data.curPageNum;
                this._maxPageNum=data._maxPageNum;
                this._labelCurPage.setString(this._curPageNum + ' / ' + this._maxPageNum + ' 页')
            }

            for(var i=0;i<this._roomNumPerPage;i++)
            {
                this._roomIdList[i].setVisible(false);
                this._roomNameList[i].setVisible(false);
                this._roomPlayerNumList[i].setVisible(false);
                this._enterRoomMenuList[i].setVisible(false);
                this._exitRoomMenuList[i].setVisible(false);
            }
            this._createRoomBtnMenu.setVisible(false);
            var j=0;

            for(var k in data.roomInfoList)
            {
                var d = data.roomInfoList[k];
                this._roomIdList[j].setString(d.roomId);
                this._roomIdList[j].setVisible(true);

                this._roomNameList[j].setString(d.roomName);
                this._roomNameList[j].setVisible(true);

                this._roomPlayerNumList[j].setString(d.playerNum);
                this._roomPlayerNumList[j].setVisible(true);

                //if(this._)
                //this._
                ++j;
            }

            //var is



        },
        _exitRoomBtnCb:function(sender)
        {
            var route = "game.gameHandler.exitRoom";
            pomelo.request(route,{
                //PlayerId:
            },function(data){


            })


        }

    }
)