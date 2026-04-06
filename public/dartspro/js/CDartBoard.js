function CDartBoard(iX,iY,oSprite,oParentContainer){
    var iStartX = iX;
    var _oBoard;
    var _oContainer;
    var _oParentcontainer = oParentContainer;
    
    this._init = function(iX,iY,oSprite){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.regX = oSprite.width/2;
        _oContainer.regY = oSprite.height/2;
        _oParentcontainer.addChild(_oContainer);
        
        _oBoard = createBitmap(oSprite);       
        _oContainer.addChild(_oBoard);

    };
    
    this.moveX = function(){
        createjs.Tween.get(_oContainer,{loop:true}).to({x:iStartX + 400},3000,createjs.Ease.cubicOut).
                                    to({x:iStartX},3000,createjs.Ease.cubicIn).to({x:iStartX-400},3000,createjs.Ease.cubicOut);
    };
    
    this.resetX = function(){
        createjs.Tween.get(_oContainer).to({x:iStartX },1000,createjs.Ease.cubicOut)
    };
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getY = function(){
        return _oContainer.y;
    };
    
    this._init(iX,iY,oSprite);
}