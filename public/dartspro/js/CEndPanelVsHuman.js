function CEndPanelVsHuman(){
    var _iStartY;
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oFade;
    var _oTitleText;
    var _oScorePlayer1Text;
    var _oScorePlayer2Text;
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
        
        _oTitleText = new createjs.Text("", "70px " + FONT, "#fff");
        _oTitleText.x = oSpriteBg.width/2;
        _oTitleText.y = oSpriteBg.height/2-160;
        _oTitleText.textAlign = "center";
        _oTitleText.textBaseline = "alphabetic";
        _oTitleText.lineWidth = oSpriteBg.width -40;
        _oContainerPanel.addChild(_oTitleText);

        
        _oScorePlayer1Text = new createjs.Text("", "50px " + FONT, "#fff");
        _oScorePlayer1Text.x = oSpriteBg.width/2;
        _oScorePlayer1Text.y = oSpriteBg.height/2+10;
        _oScorePlayer1Text.textAlign = "center";
        _oScorePlayer1Text.textBaseline = "alphabetic";
        _oScorePlayer1Text.lineWidth = oSpriteBg.width -100;
        _oContainerPanel.addChild(_oScorePlayer1Text);
        
        
        _oScorePlayer2Text = new createjs.Text("", "50px " + FONT, "#fff");
        _oScorePlayer2Text.x = oSpriteBg.width/2;
        _oScorePlayer2Text.y = oSpriteBg.height/2+70;
        _oScorePlayer2Text.textAlign = "center";
        _oScorePlayer2Text.textBaseline = "alphabetic";
        _oScorePlayer2Text.lineWidth = oSpriteBg.width -100;
        _oContainerPanel.addChild(_oScorePlayer2Text);
        
        _oButHome = new CGfxButton(oSpriteBg.width/2 - 190,oSpriteBg.height/2 + 180,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(oSpriteBg.width/2+190,oSpriteBg.height/2+180,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
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
    
    this.show = function(iWinner,szWinner,aPlayerNames,aScores){
        playSound("game_over",1,false);

        _oTitleText.text = szWinner + " " + TEXT_WINS;
        
        
        _oScorePlayer1Text.text = aPlayerNames[0] + " " + TEXT_SCORE +" : " + aScores[0];
        _oScorePlayer2Text.text = aPlayerNames[1] + " " + TEXT_SCORE +" : "+ aScores[1];


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