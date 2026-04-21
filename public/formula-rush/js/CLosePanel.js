function CLosePanel(iPlayerRank){
    
    var _oFade;
    var _oPanelContainer;
    var _oExitBut;
    var _oRestartBut;
    var _oParent;
    
    var _pStartPanelPos;
    this._init = function(){
        
        setVolume(s_aSounds["game_soundtrack"], SOUNDTRACK_VOLUME_IN_GAME);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;   
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2},500, createjs.Ease.quartIn);

        var oTitle = new CTLText(_oPanelContainer, 
                    -300,-100, 600, 120, 
                    60, "center", "#fff", PRIMARY_FONT, 1.2,
                    0, 0,
                    sprintf(TEXT_LOSE,ordinal(iPlayerRank),ordinal(MIN_RANK_FOR_WIN)),
                    true, true, true,
                    false );
        oTitle.setStroke(10,"#000");
                    
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oExitBut = new CGfxButton(0, 100, oSprite,_oPanelContainer);
        _oExitBut.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _oRestartBut = new CGfxButton(-120, 100, oSprite,_oPanelContainer);
        _oRestartBut.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        _oRestartBut.setVisible(false);
        
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oPanelContainer);
        _oFade.off("mousedown",function(){});
        
        _oExitBut.unload();
        _oRestartBut.unload();
    };

    
    this.show = function(){
        playSound("arrive_lose",1,0);
    };
    
    this._onExit = function(){

        _oFade.off("mousedown",function(){});
        s_oStage.removeChild(_oPanelContainer);
        
        s_oGame.onExit();
    };
    
    this._onRestart = function(){

        _oRestartBut.setClickable(false);
        _oExitBut.setClickable(false);

        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            _oParent.unload();
            s_oGame.restartGame();
        }); 
    };
    
    _oParent = this;
    this._init();
    
    return this;
}
