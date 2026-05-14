function CHelpPanel(){
    var _iStartY;
    
    var _oSpriteBg;
    var _oTextHelp;
    var _oButSkip;
    var _oContainer;
    var _oContainerPanel;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        var oMainBg = createBitmap(s_oSpriteLibrary.getSprite('bg_select_mode'));
        _oContainer.addChild(oMainBg);

        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainer.addChild(_oContainerPanel);
        
        _oSpriteBg = s_oSpriteLibrary.getSprite("bg_level_selection");
        var oBg = createBitmap(_oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        _oTextHelp = new createjs.Text(TEXT_HELP ,"36px "+FONT, "#fff");
        _oTextHelp.x = _oSpriteBg.width/2;
        _oTextHelp.y = 50;
        _oTextHelp.textAlign = "center";
        _oTextHelp.lineWidth = _oSpriteBg.width-100;
        _oTextHelp.textBaseline = "alphabetic";
        _oTextHelp.lineHeight = 40;
        _oContainerPanel.addChild(_oTextHelp);
        
        var oDartBoard = createBitmap(s_oSpriteLibrary.getSprite("dartboard_help"));
        oDartBoard.x = _oSpriteBg.width/2 - 450;
        oDartBoard.y = 180;
        _oContainerPanel.addChild(oDartBoard);
        
        var oText = new createjs.Text(TEXT_DOUBLE + " (X2)" ,"32px "+FONT, "#ec0000");
        oText.x = _oSpriteBg.width/2 - 65;
        oText.y = 195;
        oText.textAlign = "left";
        oText.textBaseline = "alphabetic";
        _oContainerPanel.addChild(oText);
        
        
        var oText = new createjs.Text(TEXT_TRIPLE + " (X3)","32px "+FONT, "#ec0000");
        oText.x = _oSpriteBg.width/2 + 10;
        oText.y = 270;
        oText.textAlign = "left";
        oText.textBaseline = "alphabetic";
        _oContainerPanel.addChild(oText);
        
        
        var oText = new createjs.Text(TEXT_CENTER +" ("+POINTS_DARTBOARD_CENTER[1]+")" ,"32px "+FONT, "#ec0000");
        oText.x = _oSpriteBg.width/2 + 65;
        oText.y = 445;
        oText.textAlign = "left";
        oText.textBaseline = "alphabetic";
        _oContainerPanel.addChild(oText);
        
        
        var oText = new createjs.Text(TEXT_BULLSEYE +" ("+POINTS_DARTBOARD_CENTER[0]+")" ,"32px "+FONT, "#ec0000");
        oText.x = _oSpriteBg.width/2 + 10;
        oText.y = 630;
        oText.textAlign = "left";
        oText.textBaseline = "alphabetic";
        _oContainerPanel.addChild(oText);
        
        
        _oContainerPanel.regX = _oSpriteBg.width/2;
        _oContainerPanel.regY = _oSpriteBg.height/2;
        
        _iStartY = -_oSpriteBg.height/2;
        _oContainerPanel.y = _iStartY;

        
        _oButSkip = new CGfxButton(_oSpriteBg.width/2 + 400,570,s_oSpriteLibrary.getSprite("but_next"),_oContainerPanel);
        _oButSkip.addEventListener(ON_MOUSE_UP,this._onSkip,this);
        
        
    };
    
    this.unload = function(){
        _oButSkip.unload();
    };
    
    this.show = function(){
        PokiSDK.gameplayStop();
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        _oContainerPanel.y = _iStartY;
        
        createjs.Tween.get(_oContainer).to({alpha:1}, 400,createjs.Ease.cubicOut);
        createjs.Tween.get(_oContainerPanel).to({y:CANVAS_HEIGHT/2}, 1000,createjs.Ease.cubicOut);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 500,createjs.Ease.cubicOut);
    };
    
    this._onSkip = function(){
        PokiSDK.gameplayStop();
        
        _oThis.hide();
    };
    
    this._init();
}