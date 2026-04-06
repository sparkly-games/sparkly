function CEndPanelSingleMode(){
    var _iStartY;
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oFade;
    var _oLevelClearedText;
    var _oTotScoreText;
    var _oBestScoreText;
    var _oNumThrowText;
    var _oButHome;
    var _oButRestart;
    var _oContainer;
    var _oContainerPanel;
    
    var _oThis = this;

    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);

        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        _oLevelClearedText = new createjs.Text("", "70px " + FONT, "#fff");
        _oLevelClearedText.x = oSpriteBg.width/2;
        _oLevelClearedText.y = oSpriteBg.height/2-160;
        _oLevelClearedText.textAlign = "center";
        _oLevelClearedText.textBaseline = "alphabetic";
        _oLevelClearedText.lineWidth = oSpriteBg.width -40;
        _oContainerPanel.addChild(_oLevelClearedText);

        _oNumThrowText = new createjs.Text("", "50px " + FONT, "#fff");
        _oNumThrowText.x = oSpriteBg.width/2;
        _oNumThrowText.y = oSpriteBg.height/2-50;
        _oNumThrowText.textAlign = "center";
        _oNumThrowText.textBaseline = "alphabetic";
        _oContainerPanel.addChild(_oNumThrowText);
        
        
        _oTotScoreText = new createjs.Text("", "50px " + FONT, "#fff");
        _oTotScoreText.x = oSpriteBg.width/2;
        _oTotScoreText.y = oSpriteBg.height/2+10;
        _oTotScoreText.textAlign = "center";
        _oTotScoreText.textBaseline = "alphabetic";
        _oContainerPanel.addChild(_oTotScoreText);
        
        
        _oBestScoreText = new createjs.Text("", "50px " + FONT, "#fff");
        _oBestScoreText.x = oSpriteBg.width/2;
        _oBestScoreText.y = oSpriteBg.height/2+70;
        _oBestScoreText.textAlign = "center";
        _oBestScoreText.textBaseline = "alphabetic";
        _oContainerPanel.addChild(_oBestScoreText);

        _oButHome = new CGfxButton(oSpriteBg.width/2 - 190,oSpriteBg.height/2 + 180,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(oSpriteBg.width/2 + 190,oSpriteBg.height/2+180,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _iStartY = -oSpriteBg.height/2;
        
        _oContainerPanel.regX = oSpriteBg.width/2;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButRestart.unload();
        
        _oFade.off("click", _oListener);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(iTotScore,iThrows){
        playSound("win",1,false);
        
        _oLevelClearedText.text = TEXT_GAME_OVER;
        _oTotScoreText.text = TEXT_SCORE+": "+iTotScore;
        _oBestScoreText.text = TEXT_BEST_SCORE+": "+getBestScoreSingleMode();
        _oNumThrowText.text = TEXT_THROWS + ": "+iThrows;

        _oFade.alpha=0;
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        

        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        createjs.Tween.get(_oContainerPanel).wait(400).to({y:CANVAS_HEIGHT/2}, 1000,createjs.Ease.cubicOut);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainerPanel).to({y:_iStartY}, 1000,createjs.Ease.backIn).call(function(){
                                                                                                        _oContainer.visible = false;
                                                                    
                                                                                                        if(_aCbCompleted[_iEventToLaunch]){
                                                                                                            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
                                                                                                        }
                                                                });
    };
    
    this._onHome = function(){
        _iEventToLaunch = ON_BACK_MENU;
        
        _oThis.hide();
    };
    
    this._onRestart = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        
        _iEventToLaunch = ON_RESTART;
        
        _oThis.hide();
    };
    
    this._init();
}
