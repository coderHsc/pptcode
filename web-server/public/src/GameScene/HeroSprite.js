
var HeroSprite = cc.Sprite.extend
(
    {
        _leftAnimate:null,
        _rightAnimate:null,
        _upAnimate:null,
        _downAnimate:null,
        _speed:0,
        _winSize:0,
        _arg:null,

        //记录每次播放哪一帧
        _curUpCnt:0,
        _curDownCnt:0,
        _curLeftCnt:0,
        _curRightCnt:0,
        _passTime:0,
        ctor:function (arg)
        {
            _arg=arg;


            this._super();
            this._winSize   = cc.director.getWinSize();
            this._speed     = arg.speed;
            var spriteFrame = cc.SpriteFrame.create(arg.heroName,cc.rect(0,0,arg.heroWidth,arg.heroHeight));
            this.initWithSpriteFrame(spriteFrame);
            this.initAnimate(arg);

            //this._flippedX=false;
            //this.runAction(cc.RepeatForever.create(this._rightAnimate));

        },
        update:function (dt)
        {
            this._passTime+=dt;
            // Keys are only enabled on the browser
            if (!cc.sys.isNative)
            {
                if ((G_STATE.KEYS[cc.KEY.w] || G_STATE.KEYS[cc.KEY.up]) && this.y <= this._winSize.height)
                {
                    this.y += dt * this._speed;
                    if(this._passTime>=0.08)
                    {
                        this._curUpCnt++;
                        this._curUpCnt=this._curUpCnt%4;
                        this._passTime=0;
                    }
                    //this._curUpCnt++;
                    //this._curUpCnt=this._curUpCnt%4;
                    this.setSpriteFrame(cc.SpriteFrame.create(_arg.heroName,cc.rect(this._curUpCnt* _arg.heroWidth,_arg.heroHeight*2,_arg.heroWidth,_arg.heroHeight)));
                }
                else if ((G_STATE.KEYS[cc.KEY.s] || G_STATE.KEYS[cc.KEY.down]) && this.y >= 0)
                {
                    this.y -= dt * this._speed;
                    if(this._passTime>=0.08)
                    {
                        this._curDownCnt++;
                        this._curDownCnt = this._curDownCnt % 4;
                        this._passTime=0;
                    }
                    this.setSpriteFrame(cc.SpriteFrame.create(_arg.heroName,cc.rect(this._curDownCnt*_arg.heroWidth,_arg.heroHeight*1,_arg.heroWidth,_arg.heroHeight)));

                }
                else if ((G_STATE.KEYS[cc.KEY.a] || G_STATE.KEYS[cc.KEY.left]) && this.x >= 0)
                {
                    this.x -= dt * this._speed;
                    this._flippedX=true;
                    if(this._passTime>=0.08)
                    {
                        this._curLeftCnt++;
                        this._curLeftCnt = this._curLeftCnt % 4;
                        this._passTime=0;
                    }
                    this.setSpriteFrame(cc.SpriteFrame.create(_arg.heroName,cc.rect(this._curLeftCnt*_arg.heroWidth,0,_arg.heroWidth,_arg.heroHeight)));

                }
                else if ((G_STATE.KEYS[cc.KEY.d] || G_STATE.KEYS[cc.KEY.right]) && this.x <= this._winSize.width)
                {
                    this.x += dt * this._speed;
                    this._flippedX=false;
                    if(this._passTime>=0.08)
                    {
                        this._curRightCnt++;
                        this._curRightCnt = this._curRightCnt % 4;
                        this._passTime=0;
                    }
                    this.setSpriteFrame(cc.SpriteFrame.create(_arg.heroName,cc.rect(this._curRightCnt*_arg.heroWidth,0,_arg.heroWidth,_arg.heroHeight)));
                }
                else
                {
                    this.setSpriteFrame(cc.SpriteFrame.create(_arg.heroName,cc.rect(0,_arg.heroHeight*1,_arg.heroWidth,_arg.heroHeight)));
                }
            }

            //console.log(dt);
           // this.setPosition(this.x,this.y);

            //if (this.HP <= 0) {
            //    this.active = false;
            //     this.destroy();
            // }
            //this._timeTick += dt;
            //if (this._timeTick > 0.1) {
            //    this._timeTick = 0;
            //    if (this._hurtColorLife > 0) {
            //        this._hurtColorLife--;
            //    }
            //}
        },


        initAnimate:function(arg)
        {
            //向右动画
            var rightAnimation = cc.Animation.create();
            rightAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(0,0,arg.heroWidth,arg.heroHeight)));
            rightAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*1,0,arg.heroWidth,arg.heroHeight)));
            rightAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*2,0,arg.heroWidth,arg.heroHeight)));
            rightAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*3,0,arg.heroWidth,arg.heroHeight)));
            rightAnimation.setRestoreOriginalFrame(true);
            rightAnimation.setDelayPerUnit(0.1);
            this._rightAnimate=cc.Animate.create(rightAnimation);

            //向下动画
            var downAnimation = cc.Animation.create();
            downAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(0,arg.heroHeight,arg.heroWidth,arg.heroHeight)));
            downAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*1,arg.heroHeight,arg.heroWidth,arg.heroHeight)));
            downAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*2,arg.heroHeight,arg.heroWidth,arg.heroHeight)));
            downAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*3,arg.heroHeight,arg.heroWidth,arg.heroHeight)));
            downAnimation.setRestoreOriginalFrame(true);
            downAnimation.setDelayPerUnit(0.1);
            this._downAnimate=cc.Animate.create(downAnimation);
            //向上动画
            var upAnimation = cc.Animation.create();
            upAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(0,arg.heroHeight*2,arg.heroWidth,arg.heroHeight)));
            upAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*1,arg.heroHeight*2,arg.heroWidth,arg.heroHeight)));
            upAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*2,arg.heroHeight*2,arg.heroWidth,arg.heroHeight)));
            upAnimation.addSpriteFrame(cc.SpriteFrame.create(arg.heroName,cc.rect(arg.heroWidth*3,arg.heroHeight*2,arg.heroWidth,arg.heroHeight)));
            upAnimation.setRestoreOriginalFrame(true);
            upAnimation.setDelayPerUnit(0.1);
            this._upAnimate=cc.Animate.create(upAnimation);

        }

    }
)
HeroSprite.create = function(arg)
{
    var heroSprite = new HeroSprite(arg);
    return heroSprite;
}