module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app  = app;
};


Handler.prototype.queryEntry = function(msg,session,next)
{
    var connectors = this.app.getServersByType('connector');
    if(!connectors ||connectors.length===0)
    {
        next(null,{code:500});
        return ;
    }
    var res = connectors[0];
    //error.log(res.host,res.clientPort);

    next(null,{code:200,host:res.host,port:res.clientPort});
}
/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
    next(null, {code: 200, msg: 'game server is ok.'});
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
    var result = {
        topic: 'publish',
        payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
    };
    next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
    var result = {
        topic: 'subscribe',
        payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
    };
    next(null, result);
};