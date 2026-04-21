function CEndPanel(){
    
    var _oFade;
    var _oPanelContainer;
    var _oHomeBut;
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
                    -300,-oSprite.height/2 + 30, 600, 120, 
                    60, "center", "#fff", PRIMARY_FONT, 1.2,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, true,
                    false );
        oTitle.setStroke(10,"#000");
               
        var oSprite = s_oSpriteLibrary.getSprite('finish');
        var oFinish = createBitmap(oSprite);
        oFinish.regX = oSprite.width/2;
        oFinish.regY = oSprite.height;
        oFinish.y = 154;
        oFinish.scaleX = oFinish.scaleY = 0.3;
        _oPanelContainer.addChild(oFinish);
       
        var oSprite = s_oSpriteLibrary.getSprite('but_home');
        _oHomeBut = new CGfxButton(0, 100, oSprite,_oPanelContainer);
        _oHomeBut.addEventListener(ON_MOUSE_UP, this._onHome, this);
        _oHomeBut.pulseAnimation();
        
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oPanelContainer);
        _oFade.off("mousedown",function(){});
        
        _oHomeBut.unload();
    };

    
    this.show = function(){
        playSound("arrive_win",1,0);
        
        $(s_oMain).trigger("share_event",s_iTotalScore);
    };
    
    this._onHome = function(){
        _oFade.off("mousedown",function(){});
        s_oStage.removeChild(_oPanelContainer);
        
        s_oGame.onExit();
    };
    
    _oParent = this;
    this._init();
    
    return this;
}
