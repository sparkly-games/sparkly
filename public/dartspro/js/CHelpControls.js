function CHelpControls(){
    var _oTextHelp;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2-350;
        s_oStage.addChild(_oContainer);
        
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("help_box");
        var oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(oBg);
        
        _oTextHelp = new createjs.Text( TEXT_HELP_CONTROLS_1,"40px "+FONT, "#fff");
        _oTextHelp.x = oSpriteBg.width/2;
        _oTextHelp.y = 55;
        _oTextHelp.textAlign = "center";
        _oTextHelp.lineWidth = oSpriteBg.width-20;
        _oTextHelp.textBaseline = "alphabetic";
        _oContainer.addChild(_oTextHelp);
        
        
        _oContainer.regX = oSpriteBg.width/2;
        _oContainer.regY = oSpriteBg.height/2;
        
        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer).to({alpha:1}, 500,createjs.Ease.cubicOut);
        
    };
    
    this.refreshButtonPos = function(){
        if(s_bLandscape){
            _oContainer.y = s_iOffsetY + _oContainer.regY + 100
        }else{
            _oContainer.y = CANVAS_HEIGHT/2-350;
        }
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 400,createjs.Ease.cubicOut);
    };
    
    this.nextHelp = function(){
        _oTextHelp.text = TEXT_HELP_CONTROLS_2;
    };
    
    this._init();
}