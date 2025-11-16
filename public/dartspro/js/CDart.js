function CDart(iX,iY,iType,pEndDartPos,oParentContainer){
    var _iNewX;
    var _iNewY;
    var _iStartX = iX;
    var _pEndDartPos = pEndDartPos;
    var _oDart;
    var _oContactAnim;
    var _oSwipeAnim;
    var _oShadow;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iX,iY,iType){
        _oContainer = new createjs.Container();
        
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.alpha = 0;
        _oParentContainer.addChild(_oContainer);
        
        var oPressSprite = s_oSpriteLibrary.getSprite("contact_effect");
        _oContactAnim = createBitmap(oPressSprite);
        _oContactAnim.regX = oPressSprite.width * 0.5;
        _oContactAnim.regY = oPressSprite.height * 0.5;
        _oContactAnim.visible = false;
        _oContactAnim.scaleX = 0;
        _oContactAnim.scaleY = 0;
        _oContainer.addChild(_oContactAnim);
        /*
        var oCircle = new createjs.Shape();
        oCircle.graphics.beginFill("red").drawCircle(0,0,50);
        _oContainer.addChild(oCircle);
        */
       
        _oShadow = createBitmap(s_oSpriteLibrary.getSprite("dart_shadow"));
        _oShadow.visible = false;
        _oShadow.x = -50;
        _oContainer.addChild(_oShadow);
       
        var aSprites = new Array();
        for(var i=0;i<NUM_SPRITE_DART;i++){
            aSprites.push(s_oSpriteLibrary.getSprite("dart_"+iType+"_"+i));
        }
        
        var oData = {   
                        images: aSprites, 
                        // width, height & registration point of each sprite
                        frames: {width: DART_WIDTH, height: DART_HEIGHT, regX: DART_WIDTH/2, regY: DART_HEIGHT-170}, 
                        animations: {start:0,anim:[0,NUM_SPRITE_DART-1,"stop_anim"],stop_anim:NUM_SPRITE_DART-1}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oDart = createSprite(oSpriteSheet,"start",DART_WIDTH/2,DART_HEIGHT-170,DART_WIDTH,DART_HEIGHT);
        _oContainer.addChild(_oDart);
        
        _oSwipeAnim = createBitmap(s_oSpriteLibrary.getSprite("hand_swipe"));
        _oSwipeAnim.x = DART_WIDTH/2;
        _oSwipeAnim.alpha = 0;
        _oSwipeAnim.y = 0;
        _oContainer.addChild(_oSwipeAnim);

        createjs.Tween.get(_oContainer).to({alpha:1}, 500, createjs.Ease.cubicOut).call(function(){_oThis._playTweenX()});
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.startAnim = function(iOffsetX,iOffsetY,iRotOffset){
        createjs.Tween.removeTweens(_oSwipeAnim);
        
        _oContainer.removeChild(_oSwipeAnim);
        _oContainer.alpha = 1;
        
        _oDart.gotoAndPlay("anim");
        _iNewX = _oContainer.x +iOffsetX;
        _iNewY = MAX_FORCE-iOffsetY;

        createjs.Tween.get(_oContainer).to({x:_iNewX,rotation:MAX_DART_ANGLE_ROT*iRotOffset}, 500);
        
        createjs.Tween.get(_oContainer).to({y:_iNewY}, 600, createjs.Ease.backOut).call(function(){
                                                                                    _oShadow.visible = true;
                                                                                    _oShadow.rotation = -_oContainer.rotation;
                                                                                    s_oGame._endThrow();
                                                                                    _oThis.drawCollisionPoint();
                                                                                });
        createjs.Tween.get(_oContainer).to({scaleX:0.5,scaleY:0.5}, 800, createjs.Ease.cubicOut);
    };
    
    this._playTweenX = function(){
        createjs.Tween.get(_oContainer, {loop: true}).to({x: _pEndDartPos.x }, TIME_DART_MOVE_X, createjs.Ease.quadInOut).
                to({x: _iStartX }, TIME_DART_MOVE_X, createjs.Ease.quadInOut);
    };
    
    this.stopTween = function(){
        createjs.Tween.removeTweens(_oContainer);
    };
    
    this.drawCollisionPoint = function(){
        _oContactAnim.visible = true;
        new createjs.Tween.get(_oContactAnim).to({scaleX:1, scaleY:1},1500, createjs.Ease.cubicOut).call(function(){
            
        });
        
        new createjs.Tween.get(_oContactAnim).to({alpha:0},1500, createjs.Ease.cubicOut)
    };
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getY = function(){
        return _oContainer.y;
    };
    
    this.getPos = function(){
        return {x:_oContainer.x,y:_oContainer.y};
    };
    
    this.getDartTip = function(){
        return {x:_oContainer.x,y:_oContainer.y-DART_HEIGHT+170};
    };
    
    this.getNewX = function(){
        return _iNewX;
    };
    
    this.getNewY = function(){
        return _iNewY;
    };
    
    this.setX = function(iNewX){
        _oContainer.x = iNewX;
    };
    
    this._init(iX,iY,iType);
}