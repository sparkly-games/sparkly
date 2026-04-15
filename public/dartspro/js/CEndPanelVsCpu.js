function CEndPanelVsCpu(){
    var _iStartY;
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oSpriteBg;
    var _oFade;
    var _oTitleText;
    var _oTotScoreText;
    var _oLevelScoreText;
    var _oButHome;
    var _oButRestart;
    var _oButNext;
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
        
        _oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(_oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        _oTitleText = new createjs.Text("", "70px " + FONT, "#fff");
        _oTitleText.x = _oSpriteBg.width/2;
        _oTitleText.y = _oSpriteBg.height/2-160;
        _oTitleText.textAlign = "center";
        _oTitleText.textBaseline = "alphabetic";
        _oTitleText.lineWidth = _oSpriteBg.width -40;
        _oContainerPanel.addChild(_oTitleText);

        
        _oLevelScoreText = new createjs.Text("", "50px " + FONT, "#fff");
        _oLevelScoreText.x = _oSpriteBg.width/2;
        _oLevelScoreText.y = _oSpriteBg.height/2+10;
        _oLevelScoreText.textAlign = "center";
        _oLevelScoreText.textBaseline = "alphabetic";
        _oLevelScoreText.lineWidth = _oSpriteBg.width -100;
        _oContainerPanel.addChild(_oLevelScoreText);
        
        
        _oTotScoreText = new createjs.Text("", "50px " + FONT, "#fff");
        _oTotScoreText.x = _oSpriteBg.width/2;
        _oTotScoreText.y = _oSpriteBg.height/2+70;
        _oTotScoreText.textAlign = "center";
        _oTotScoreText.textBaseline = "alphabetic";
        _oTotScoreText.lineWidth = _oSpriteBg.width -100;
        _oContainerPanel.addChild(_oTotScoreText);
        
        _oButHome = new CGfxButton(_oSpriteBg.width/2 - 190,_oSpriteBg.height/2 + 180,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(_oSpriteBg.width/2,_oSpriteBg.height/2+180,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _oButNext = new CGfxButton(_oSpriteBg.width/2 + 190,_oSpriteBg.height/2+180,s_oSpriteLibrary.getSprite("but_next"),_oContainerPanel);
        _oButNext.addEventListener(ON_MOUSE_UP,this._onNext,this);
        
        _iStartY = -_oSpriteBg.height/2;
        
        _oContainerPanel.regX = _oSpriteBg.width/2;
        _oContainerPanel.regY = _oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButRestart.unload();
        _oButNext.unload();
        
        _oFade.off("click", _oListener);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(iWinner,iLevelScore,iTotScore,bGameOver){

        if(iWinner === 0){
            playSound("win",1,false);
            if(!bGameOver){
                _oTitleText.text = TEXT_YOU_WIN;
                _oButNext.setVisible(true);
                _oButRestart.setX(_oSpriteBg.width/2);
                
                setLocalStorageLevel(s_iCurLevel+1);
            }else{
                _oTitleText.text = TEXT_CONGRATS;
                _oButNext.setVisible(false);
                _oButRestart.setX(_oSpriteBg.width/2 + 190);
            }
        }else{
            playSound("game_over",1,false);
            _oTitleText.text = TEXT_YOU_LOSE;
            _oButNext.setVisible(false);
            _oButRestart.setX(_oSpriteBg.width/2 + 190);
        }

        
        _oLevelScoreText.text = TEXT_LEVEL_SCORE +" : " + iLevelScore;
        _oTotScoreText.text = TEXT_TOT_SCORE +" : "+ iTotScore;

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
    
    this._onNext = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        
        _iEventToLaunch = ON_NEXT;
        
        _oThis.hide();
    };
    
    this._init();
}