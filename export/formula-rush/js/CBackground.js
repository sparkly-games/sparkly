function CBackground(oSprite, oParentContainer){
    
    var _iLimitY;
    
    var _aLayer;
    
    var _oBg;
    
    
    this._init = function(){
        
        _iLimitY = oSprite.height/2 - (CANVAS_HEIGHT - 2*s_iOffsetY)/2;
        
        _oBg = new createjs.Container();
        oParentContainer.addChild(_oBg);
        
        _aLayer = new Array();
        
        for(var i=0; i<2; i++){
            _aLayer[i] = createBitmap(oSprite);
            _aLayer[i].x = i*oSprite.width;
            _oBg.addChild(_aLayer[i]);
            
            _aLayer[i].cache(0,0, oSprite.width, oSprite.height);
        }
    };
    
    this.restart = function(){
        _oBg.x = 0;
        _oBg.y = 0;
        
        for(var i=0; i<2; i++){
            _aLayer[i].x = i*oSprite.width;
        }
    };
    
    this.moveX = function(iValue){
        _oBg.x += iValue;

        var iStartX = Math.floor( (-_oBg.x+HALF_CANVAS_WIDTH) / oSprite.width)*oSprite.width;
        for(var i=0; i<2; i++){
            _aLayer[i].x = iStartX + i*oSprite.width;
        }
    };
    
    this.moveY = function(iValue){
        
        if(iValue < -_iLimitY){
            iValue = -_iLimitY;
        }
        if(iValue > _iLimitY){
            iValue = _iLimitY;
        }
        
        _oBg.y = iValue;
    };
    
    this._init();
}


