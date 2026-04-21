function CCarShadow(iX, iY, oParentContainer){
    var _oContainer;
    var _oShadow;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        _oShadow = createSprite(s_oSpriteSheetShadows, "center",0,0,0,0);
        _oShadow.gotoAndStop("center");
        _oContainer.addChild(_oShadow);
    };
    
    this.unload = function(){
        oParentContainer.removeAllChildren(_oContainer);
    };
    
    this.setFrame = function(szFrame){
        _oShadow.gotoAndStop(szFrame);
    };
    
    this._init();
}


