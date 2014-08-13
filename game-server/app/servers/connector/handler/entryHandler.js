module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app  = app;
};

//简单数据库
var map = {};



Handler.prototype.dealLogin = function(msg,session,next)
{
    //var self = this;

    var sessionService = this.app.get('sessionService');
    var username = msg.username;
    var userpassword = msg.password;

    console.log(username.length,userpassword.length);

    if(username.length==0||username=="Name:")
    {
        console.log("username is 0");
        next(null, {code: 1});
        return ;
    }
    if(userpassword.length==0||userpassword=="Channel:")
    {
        console.log("userpassword is 0");
        next(null, {code: 2});
        return ;
    }
    if(map[username]===undefined)
    {
        map[username]=userpassword;
        session.bind(username);
        session.set('username', username);
        session.on('closed', onPlayerLeave.bind(null, this.app));

        session.pushAll(
            function() {
                next(null, {
                    code: 4,
                    username: username
                });
            }
        );
    }
    else
    {
        next(null, {code: 3});
        return ;
    }

}
/**
 * New client entry game server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.enterRoom = function(msg, session, next) {
    msg.serverId = this.app.get('serverId');

    console.log("msg.serverId:"+msg.serverId);
    // put player into room
    this.app.rpc.game.gameRemote.enterRoom(session, msg, function(data) {
        if(!!data.roomId && data.roomId > 0) {
            session.set('roomId', data.roomId);
        }

        session.push('roomId', function(err) {
            if(err) {
                console.error('Set roomId for session service failed! error is : %j', err.stack);
            } else {
                next(null, {
                    roomId: data.roomId,
                    seatNum: data.seatNum
                });
            }
        });
    });
};
/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onPlayerLeave = function(app, session) {
    if(!session || !session.uid) {
        return;
    }
    var d = {roomId: session.get('roomId'), username: session.get('username'), serverId: app.get('serverId')};
    app.rpc.game.gameRemote.kick(session, d, null);
};