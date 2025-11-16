function CInterface(iNumPlayer,aPlayerNames){
    var _aDartSprite;
    var _aScoreGUI;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButExit;
    var _oButHelp;
    var _oGUIExpandible;
    var _oDartContainer;
    var _oRollingScore;
    var _oBestScoreNum;
    var _oHelpPanel;
    var _oContainerScore;
    
    var _pStartPosScore;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosDart;
    var _pStartPosBest;
    
    this._init = function(iNumPlayer,aPlayerNames){ 
        var oSpriteBg = s_oSpriteLibrary.getSprite("bg_score");
        _pStartPosScore = {x:CANVAS_WIDTH-oSpriteBg.width-10,y:CANVAS_HEIGHT-190};
        _oContainerScore = new createjs.Container();
        _oContainerScore.x = _pStartPosScore.x;
        _oContainerScore.y = _pStartPosScore.y;
        s_oStage.addChild(_oContainerScore);
        
        var oSpriteInfo = s_oSpriteLibrary.getSprite("bg_score_info");
        var oScoreInfoBg = createBitmap(oSpriteInfo);
        oScoreInfoBg.x = 310;
        _oContainerScore.addChild(oScoreInfoBg);
        
        var oText1 = new createjs.Text("1","40px "+FONT, "#fff");
        oText1.x = 340;
        oText1.y = 44;
        oText1.textAlign = "center";
        oText1.textBaseline = "alphabetic";
        _oContainerScore.addChild(oText1);
        
        
        var oText2 = new createjs.Text("2","40px "+FONT, "#fff");
        oText2.x = 400;
        oText2.y = 44;
        oText2.textAlign = "center";
        oText2.textBaseline = "alphabetic";
        _oContainerScore.addChild(oText2);
        
        
        var oText3 = new createjs.Text("3","40px "+FONT, "#fff");
        oText3.x = 460;
        oText3.y = 44;
        oText3.textAlign = "center";
        oText3.textBaseline = "alphabetic";
        _oContainerScore.addChild(oText3);
        
        var oTextPt = new createjs.Text(TEXT_PT,"40px "+FONT, "#fff");
        oTextPt.x = 540;
        oTextPt.y = 44;
        oTextPt.textAlign = "center";
        oTextPt.textBaseline = "alphabetic";
        _oContainerScore.addChild(oTextPt);
        
        _aScoreGUI = new Array();
        
        var iXPos = 0;
        var iYPos = oSpriteInfo.height;
        for(var i=0;i<iNumPlayer;i++){
            _aScoreGUI[i] = new CScoreGUI(iXPos,iYPos,oSpriteBg,aPlayerNames[i],_oContainerScore);
            
            iYPos += oSpriteBg.height/2;
        }
        
        _aScoreGUI[0].showTurn();
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) -10,y:(oSprite.height/2) +10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_pStartPosExit.x - oSprite.width,y:_pStartPosExit.y}
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2,y:_pStartPosAudio.y};
        }else{
            _pStartPosFullscreen = {x:_pStartPosExit.x - oSprite.width,y:_pStartPosExit.y}
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oButHelp = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,s_oSpriteLibrary.getSprite("but_help"),s_oStage);
        _oButHelp.addEventListener(ON_MOUSE_UP,this._onHelp,this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_settings');
        _oGUIExpandible = new CGUIExpandible(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oGUIExpandible.addButton(_oButExit);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oGUIExpandible.addButton(_oAudioToggle);
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }

        _oGUIExpandible.addButton(_oButHelp);
        
        if(s_iCurMode === MODE_SINGLE){
            _pStartPosBest = {x:20,y:70};
            _oBestScoreNum = new createjs.Text(TEXT_BEST + " " + getBestScoreSingleMode(),"70px "+FONT, "#fff");
            _oBestScoreNum.x = _pStartPosBest.x;
            _oBestScoreNum.y = _pStartPosBest.y;
            _oBestScoreNum.textAlign = "left";
            _oBestScoreNum.textBaseline = "alphabetic";
            s_oStage.addChild(_oBestScoreNum);
        }
        
        var oSpriteDart = s_oSpriteLibrary.getSprite("dart_icon");
        _pStartPosDart = {x:20,y:CANVAS_HEIGHT-oSpriteDart.height - 20};
        _oDartContainer = new createjs.Container();
        _oDartContainer.x = _pStartPosDart.x;
        _oDartContainer.y = _pStartPosDart.Y;
        s_oStage.addChild(_oDartContainer);
        
        _aDartSprite = new Array();
        var iX = 0;
        for(var i=0;i<NUM_THROW_PER_TURN;i++){
            var oDart = createBitmap(oSpriteDart);
            oDart.x = iX;
            _oDartContainer.addChild(oDart);
            
            iX += oSpriteDart.width+10;
            
            _aDartSprite.push(oDart);
            
            if(i>=NUM_THROW_PER_TURN){
                oDart.visible = false;
            }
        }
        
        _oRollingScore = new CRollingScore();
        
        _oHelpPanel = new CHelpPanel();
    };
    
    this.unload = function(){
        _oGUIExpandible.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        _oButHelp.unload();
        _oHelpPanel.unload();

        s_oInterface = null;
    };
        
    this.refreshButtonPos = function(){
        _oGUIExpandible.refreshPos();
        
        _oDartContainer.x = _pStartPosDart.x + s_iOffsetX;
        _oDartContainer.y = _pStartPosDart.y - s_iOffsetY;

        if(s_iCurMode === MODE_SINGLE){
            _oBestScoreNum.x = _pStartPosBest.x + s_iOffsetX;
            _oBestScoreNum.y = _pStartPosBest.y + s_iOffsetY;
        }
        
        _oContainerScore.x = _pStartPosScore.x - s_iOffsetX;
        _oContainerScore.y = _pStartPosScore.y - s_iOffsetY;
    };
    
    this.reset = function(){
        if(s_iCurMode === MODE_SINGLE){
            _oBestScoreNum.text = TEXT_BEST + " " + getBestScoreSingleMode();
        }
        
        this.resetNumThrow();
        
        this.resetScoreGUI();
    };
    
    this.changeTurn = function(iTurn,iPrevTurn){
        //this.resetScoreGUI();
        
        _aScoreGUI[iTurn].showTurn();
        _aScoreGUI[iPrevTurn].hideTurn();
    };
    
    this.resetPlayerScore = function(iPlayer){
        _aScoreGUI[iPlayer].resetPlayerScore();
    };

    this.addThrows = function(iNum){
        for(var i=0;i<iNum;i++){
            _aDartSprite[i].visible = true;
        }
    };
    
    this.resetScoreGUI = function(){
        for(var k=0;k<_aScoreGUI.length;k++){
            _aScoreGUI[k].reset();
        }
    };
    
    this.resetNumThrow = function(){
        for(var i=0;i<_aDartSprite.length;i++){
            _aDartSprite[i].visible = true;
        } 
    };
    
    this.refreshNumThrow = function(iNum){
        _aDartSprite[iNum].visible = false;
    };
    
    this.refreshScore = function(iScore){
        _oRollingScore.rolling(_oPointText, null, iScore);
    };

    
    this.showDartScore = function(iTurn,iThrow,iScore,iTotScore){
        _aScoreGUI[iTurn].showNextScore(iThrow,iScore,iTotScore);
    };
    
    this.refreshPlayerScore = function(iTurn,iPlayerScore){
        _aScoreGUI[iTurn].refreshPlayerScore(iPlayerScore);
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        s_oGame.onExit();
    };
    
    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
        
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onHelp = function(){
        _oHelpPanel.show();
    };
    
    s_oInterface = this;
    
    this._init(iNumPlayer,aPlayerNames);
    
    return this;
}

var s_oInterface = null;