function CHelpPanel(){
    var _bExitPanel;
    
    var _oText1;
    var _oText2;

    var _oFade;
    var _oPanelContainer;
    var _oParent;

    var _pStartPanelPos;

    this._init = function(){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 1;
        _oFade.on("mousedown",function(){_oParent._onExitHelp()});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();     
        _oPanelContainer.on("pressup",function(){_oParent._onExitHelp()});
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 - 40},500, createjs.Ease.cubicOut);

        if(s_bMobile){
            var oText1Pos = {x: -250, y: -180};

            _oText1 = new CTLText(_oPanelContainer, 
                    oText1Pos.x, oText1Pos.y, 500, 48, 
                    30, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1_MOBILE,
                    true, true, true,
                    false );
            _oText1.setStroke(6,"#000");        


            var oSprite = s_oSpriteLibrary.getSprite('key_left');
            var oKeys = createBitmap(oSprite);
            oKeys.x = -170;
            oKeys.y = -70;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);

            var oSprite = s_oSpriteLibrary.getSprite('key_right');
            var oKeys = createBitmap(oSprite);
            oKeys.x = -80;
            oKeys.y = -70;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);
            
            var oSprite = s_oSpriteLibrary.getSprite('key_down');
            var oKeys = createBitmap(oSprite);
            oKeys.x = 80;
            oKeys.y = -70;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);
            
            var oSprite = s_oSpriteLibrary.getSprite('key_up');
            var oKeys = createBitmap(oSprite);
            oKeys.x = 170;
            oKeys.y = -70;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);

            
        }else {
            var oText1Pos = {x: -300, y: -170};

            _oText1 = new CTLText(_oPanelContainer, 
                    oText1Pos.x, oText1Pos.y, 350, 140, 
                    30, "center", "#fff", PRIMARY_FONT, 1.1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );
            _oText1.setStroke(6,"#000");

            var oSprite = s_oSpriteLibrary.getSprite('keys');
            var oKeys = createBitmap(oSprite);
            oKeys.x = 130;
            oKeys.y = -100;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            _oPanelContainer.addChild(oKeys);
        }
        
        
  
        var oText2Pos = {x: 10, y:24};
  
        _oText2 = new CTLText(_oPanelContainer, 
                    oText2Pos.x, oText2Pos.y, 330, 140, 
                    30, "left", "#fff", PRIMARY_FONT, 1.1,
                    0, 0,
                    sprintf(TEXT_HELP2,ordinal(MIN_RANK_FOR_WIN) ),
                    true, true, true,
                    false );
        _oText2.setStroke(6,"#000");


        var oCarContainer = new createjs.Container();
        oCarContainer.x = -160;
        oCarContainer.y = 130;
        oCarContainer.scaleX = oCarContainer.scaleY = 0.4;
        _oPanelContainer.addChild(oCarContainer);

        var oSprite = s_oSpriteLibrary.getSprite('finish');
        var oFinish = createBitmap(oSprite);
        oFinish.regX = oSprite.width/2;
        oFinish.regY = oSprite.height;
        oFinish.scale = 0.45;
        oCarContainer.addChild(oFinish);
        
        var oPlayer = new CPlayer(0,150, oCarContainer);
    };

    this.unload = function(){
        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oPanelContainer.off("pressup",function(){_oParent._onExitHelp()});
        _oFade.off("pressup",function(){_oParent._onExitHelp()});

    };

    this._onExitHelp = function(){
        if(_bExitPanel){
            return;
        }
        _bExitPanel = true;

        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){

            _oParent.unload();
            s_oGame._onExitHelp();
        });
    };

    _oParent=this;
    this._init();

}
