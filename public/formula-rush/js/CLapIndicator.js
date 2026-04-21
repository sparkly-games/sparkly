function CLapIndicator(iX, iY, oParentContainer){
    var _oContainer;
    var _oText;
    
    var _pStartPos;
    
    this._init = function(){
        _pStartPos = {x: iX, y:iY};
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('lap_panel');
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = 0;
        _oContainer.addChild(oBg);
        
        var iWidth = 140;
        var iHeight = 70;
        var iTextX = 50;
        var iTextY = 54;
        _oText = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    70, "center", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_LAP, 0, 0),
                    true, true, false,
                    false );
        _oText.setStroke(10,"#000");
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setPosition = function(){
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y + s_iOffsetY;
    };
    
    this.refreshLap = function(iCur, iTot){
        var szText = sprintf(TEXT_LAP, iCur, iTot);
        
        _oText.refreshText(szText);
    };
    
    this.setVisible = function(bVal){
        _oContainer.visible = bVal;
    };
    
    this._init();
}


