//创建登陆场景
var pomelo = window.pomelo;
var LoginScene = cc.Scene.extend(
    {
        onEnter:function()
        {
            this._super();
            var layer = new loginLayer();
            this.addChild(layer);
        }
    }
)
//创建登陆层
loginLayer = cc.Layer.extend(
    {
        _username:null,
        _userpassword:null,
        //提示框
        _prompt:null,
        ctor:function()
        {
            this._super();
            //连接服务器
            this.connect2svr();

            var winSize = cc.director.getWinSize();

            //背景
            var bg = cc.Sprite.create(res.back_png);
            bg.setScaleX(winSize.width/bg.getContentSize().width);
            bg.setScaleY(winSize.width/bg.getContentSize().width);
            bg.setPosition(winSize.width/2,winSize.height/2);
            this.addChild(bg);

            //创建输入账号
            var size  = cc.size(200,50);
            var image = cc.Scale9Sprite.create(res.green_edit_png);
            this._username = cc.EditBox.create(size, image);
            this._username.setPosition(winSize.width/2,winSize.height/2*1.1);
            this._username.setPlaceHolder("Name:");
            this._username.setPlaceholderFontColor(cc.color.WHITE);
            this._username.setDelegate(this);
            this._username.setMaxLength(25);
            this.addChild(this._username);

            //创建输入密码
            var image2 = cc.Scale9Sprite.create(res.green_edit_png);
            this._userpassword = cc.EditBox.create(size, image2);
            this._userpassword.setPosition(winSize.width/2,winSize.height/2*0.9);
            this._userpassword.setPlaceHolder("Channel:");
            this._userpassword.setMaxLength(25);
            this._userpassword.setPlaceholderFontColor(cc.color.WHITE);
            //this._userpassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
            this.addChild(this._userpassword);

            //创建按钮
            var label = cc.LabelTTF.create("Login","Arial",40);
            label.setColor(cc.color.BLACK);
            var pMenuItem = cc.MenuItemLabel.create(label, this.onLogin,this);
            var pMenu = cc.Menu.create(pMenuItem);
            pMenu.setPosition(winSize.width/2,winSize.height/2*0.7);
            this.addChild(pMenu);

            //创建提示对话框

            _prompt = cc.LabelTTF.create("","Arial",30);
            _prompt.setColor(cc.color.BLACK);
            _prompt.setPosition(winSize.width/2,winSize.height/2*0.5);
            this.addChild(_prompt);


        },
        //监听editBox事件
        editBoxEditingDidBegin:function(editBox)
        {
            console.log("start edit");
        },
        editBoxEditingDidEnd:function(editBox)
        {
            console.log("end edit");
           // console.log(editBox.getString());
        },
        editBoxReturn:function(editBox)
        {
            //console.log("edit return");
        },
        editBoxTextChanged: function (editBox,text)
        {
            //console.log("text change");
        },
        onLogin :function(pSender)
        {
            var username = this._username.getString();
            var password = this._userpassword.getString();

            //console.log(username,password);
            var route = "connector.entryHandler.dealLogin";
            pomelo.request(route,{
                username:username,
                password:password
            },function(data)
            {
                //返回为
                if(data.code===1)
                {
                    this._prompt.setString("请输入账号");
                }
                else if(data.code===2)
                {
                    this._prompt.setString("请输入密码");
                }
                else if(data.code===3)
                {
                    this._prompt.setString("账号已存在");
                }
                else if(data.code===4)
                {
                    //this._prompt.setString("已登陆");
                    var nextScene = new GameLobbyScene();
                    cc.director.runScene(cc.TransitionCrossFade.create(1, nextScene));
                }

            });
        },
        //初始化pomelo服务器，首先连接到gate服务器，然后跳转到connector服务器
        connect2svr: function() {
            var host = "127.0.0.1";
            var port = "3014";
            pomelo.init(
                {
                    host: host,
                    port: port,
                    log: true
                }, function()
                {
                    var route = 'gate.gateHandler.queryEntry';
                    pomelo.request(route,{}, function(data) {
                        pomelo.disconnect();
                        pomelo.init(
                            {
                                host: data.host,
                                port: data.port,
                                log: true
                            }, function () {}
                        );
                });
            });
        }
    }
)

//查询connector
function queryEntry(uid, callback)
{
    var route = 'gate.gateHandler.queryEntry';
    pomelo.init(
        {
            host: window.location.hostname,
            port: 3014,
            log: true
        }, function()
        {
            pomelo.request(route,
                {
                    uid: uid
                }, function(data) {
                    pomelo.disconnect();
                    if(data.code === 500) {
                        showError(LOGIN_ERROR);
                        return;
                    }
                    callback(data.host, data.port);
                });
        });
};
