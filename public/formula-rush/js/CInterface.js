function CInterface(){
    var _oAudioToggle;
    var _oButExit;
    var _oTimer;

    var _oTachometer;
    var _oCountdownTextStroke;
    var _oCountdownText;
    var _oButUp;
    var _oButDown;
    var _oButLeft;
    var _oButRight;
    var _oButFullscreen;
    var _oGUIExpandible;
    
    var _aNumCountDown;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosUp;
    var _pStartPosDown;
    var _pStartPosLeft;
    var _pStartPosRight;
    var _pStartPosGUI;
    var _pStartPosMiniMap;
    
    var _oMiniMap;
    var _oLapIndicator;
    var _oRankContainer;
    var _oRankIndicator;
    var _pStartRankPos;
    
    this._init = function(){          
        var aButtonList = new Array();
        
        var oInterfaceContainer = new createjs.Container();
        s_oStage.addChild(oInterfaceContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(0, 0, oSprite, oInterfaceContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(0,0,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);  
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _oButFullscreen = new CToggle(0,0,oSprite,s_bFullscreen, oInterfaceContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
            aButtonList.push(_oButFullscreen);
        }

        var oSprite = s_oSpriteLibrary.getSprite('but_settings');
        _pStartPosGUI = {x:CANVAS_WIDTH - (oSprite.width/2) -10,y:(oSprite.height/2) +10};
        _oGUIExpandible = new CGUIExpandible(_pStartPosGUI.x, _pStartPosGUI.y, oSprite, oInterfaceContainer);
        _oGUIExpandible.addButton(_oButExit);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oGUIExpandible.addButton(_oAudioToggle);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }


        ///////SET SPEED INDICATOR
        _oTachometer = new CTachometer(206, CANVAS_HEIGHT-12, oInterfaceContainer);

        ///////SET MINIMAP
        _pStartPosMiniMap = {x: CANVAS_WIDTH-162, y: CANVAS_HEIGHT-226};
        _oMiniMap = new CMiniMap(_pStartPosMiniMap.x, _pStartPosMiniMap.y, oInterfaceContainer);
        _oMiniMap.setPath(s_oGame.getSegments());

        ///////LAP INDICATOR
        _oLapIndicator = new CLapIndicator(CANVAS_WIDTH/2, 10, s_oStage);

        ///////RANK INDICATOR
        _pStartRankPos = {x:20, y:0}
        _oRankContainer = new createjs.Container();
        _oRankContainer.x = _pStartRankPos.x;
        _oRankContainer.y = _pStartRankPos.y;
        oInterfaceContainer.addChild(_oRankContainer);

        
        _oRankIndicator = new CRankIndicator(150, 70, _oRankContainer, 150);

        _oCountdownTextStroke = new createjs.Text(""," 300px "+PRIMARY_FONT, "#000");
        _oCountdownTextStroke.x = CANVAS_WIDTH/2;
        _oCountdownTextStroke.y = CANVAS_HEIGHT/2;
        _oCountdownTextStroke.textAlign = "center";
        _oCountdownTextStroke.textBaseline = "middle";
        _oCountdownTextStroke.lineWidth = 200;
        _oCountdownTextStroke.outline = 20;
        oInterfaceContainer.addChild(_oCountdownTextStroke);

        _oCountdownText = new createjs.Text(""," 300px "+PRIMARY_FONT, "#fff");
        _oCountdownText.x = CANVAS_WIDTH/2;
        _oCountdownText.y = CANVAS_HEIGHT/2;
        _oCountdownText.textAlign = "center";
        _oCountdownText.textBaseline = "middle";
        _oCountdownText.lineWidth = 200;
        oInterfaceContainer.addChild(_oCountdownText);

        if(s_bMobile){
            var iY = CANVAS_HEIGHT-300;
            var iX = 180;
            
            ///////////// MOVEMENT
            var oSprite = s_oSpriteLibrary.getSprite('key_up');
            _pStartPosUp = {x: CANVAS_WIDTH-iX +oSprite.width/2, y: iY};
            _oButUp = new CGfxButton(_pStartPosUp.x, _pStartPosUp.y, oSprite, oInterfaceContainer);
            _oButUp.addEventListenerWithParams(ON_MOUSE_UP, s_oGame.onKeyUp, s_oGame, KEY_UP);
            _oButUp.addEventListenerWithParams(ON_MOUSE_DOWN, s_oGame.onKeyDown, s_oGame, KEY_UP);
            
            var oSprite = s_oSpriteLibrary.getSprite('key_down');
            _pStartPosDown = {x: CANVAS_WIDTH-iX -oSprite.width/2, y: iY};
            _oButDown = new CGfxButton(_pStartPosDown.x, _pStartPosDown.y, oSprite, oInterfaceContainer);
            _oButDown.addEventListenerWithParams(ON_MOUSE_UP, s_oGame.onKeyUp, s_oGame, KEY_DOWN);
            _oButDown.addEventListenerWithParams(ON_MOUSE_DOWN, s_oGame.onKeyDown, s_oGame, KEY_DOWN);
            
            ///////////// DIRECTION
            var oSprite = s_oSpriteLibrary.getSprite('key_left');
            _pStartPosLeft = {x:iX-oSprite.width/2, y: iY};
            _oButLeft = new CGfxButton(_pStartPosLeft.x, _pStartPosLeft.y, oSprite, oInterfaceContainer);
            _oButLeft.addEventListenerWithParams(ON_MOUSE_UP, s_oGame.onKeyUp, s_oGame, KEY_LEFT);
            _oButLeft.addEventListenerWithParams(ON_MOUSE_DOWN, s_oGame.onKeyDown, s_oGame, KEY_LEFT);
            
            var oSprite = s_oSpriteLibrary.getSprite('key_right');
            _pStartPosRight = {x:iX+oSprite.width/2, y: iY};
            _oButRight = new CGfxButton(_pStartPosRight.x, _pStartPosRight.y, oSprite, oInterfaceContainer);
            _oButRight.addEventListenerWithParams(ON_MOUSE_UP, s_oGame.onKeyUp, s_oGame, KEY_RIGHT);
            _oButRight.addEventListenerWithParams(ON_MOUSE_DOWN, s_oGame.onKeyDown, s_oGame, KEY_RIGHT);
            
        }

        _aNumCountDown = new Array();
        for(var i=0; i<=3; i++){
            _aNumCountDown[i] = false;
        }

        this.refreshButtonPos();
    };
    
    this.unload = function(){
        _oGUIExpandible.unload();

        s_oInterface = null;
        
        if(s_bMobile){
            _oButUp.unload();
            _oButDown.unload();
            _oButLeft.unload();
            _oButRight.unload();
        }
        
    };
    
    this.refreshButtonPos = function(){
        _oGUIExpandible.refreshPos();

        if(s_bMobile){
            _oButUp.setPosition(_pStartPosUp.x - s_iOffsetX, _pStartPosUp.y - s_iOffsetY);
            _oButDown.setPosition(_pStartPosDown.x - s_iOffsetX, _pStartPosDown.y - s_iOffsetY);
            _oButLeft.setPosition(_pStartPosLeft.x + s_iOffsetX, _pStartPosLeft.y - s_iOffsetY);
            _oButRight.setPosition(_pStartPosRight.x + s_iOffsetX, _pStartPosRight.y - s_iOffsetY);
        }

        _oTachometer.updateOffset(s_iOffsetX, s_iOffsetY);

        _oMiniMap.setPosition(_pStartPosMiniMap.x- s_iOffsetX, _pStartPosMiniMap.y - s_iOffsetY);
        
        _oLapIndicator.setPosition();

        _oRankContainer.x = _pStartRankPos.x + s_iOffsetX;
        _oRankContainer.y = _pStartRankPos.y + s_iOffsetY;
        
        
        
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
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


    this.refreshFPS = function(iValue){
        _oTimer.setTime(iValue);
    };

    this.refreshLap = function(iCur, iTot){
        _oLapIndicator.refreshLap(iCur, iTot);
    };

    this.refreshRankPosition = function(iPos){
        _oRankIndicator.refreshRank(iPos);
        _oRankIndicator.alignLeft();
    };

    this.refreshCountdown = function(iTime){
        var iIntNum = Math.ceil(iTime/1000);  
        var iNum = (iIntNum * 1000 - iTime)/1000;

        _oCountdownText.alpha = 1-iNum;
        _oCountdownText.scaleX = _oCountdownText.scaleY = iNum;
        _oCountdownText.text = Math.ceil(iTime/1000);

        _oCountdownTextStroke.alpha = _oCountdownText.alpha;
        _oCountdownTextStroke.scaleX = _oCountdownTextStroke.scaleY = iNum;
        _oCountdownTextStroke.text = _oCountdownText.text;

        
        if(iIntNum === 3 && !_aNumCountDown[3]){
            _aNumCountDown[3] = true;
            playSound('3', 1, 0);
        } else if(iIntNum === 2 && !_aNumCountDown[2]){
            _aNumCountDown[2] = true;
            playSound('2', 1, 0);
        } else if(iIntNum === 1 && !_aNumCountDown[1]){
            _aNumCountDown[1] = true;
            playSound('1', 1, 0);
        } else if(iIntNum === 0){
            _aNumCountDown[0] = true;
            playSound('go', 1, 0);
            
            for(var i=0; i<_aNumCountDown.length; i++){
                _aNumCountDown[i] = false;
            }
        }
        
    };
    
    this.refreshSpeed = function(iValue){
        _oTachometer.setSpeedIndicator(iValue);
    };

    this.countDownGo = function(){
        _oCountdownText.scaleX = _oCountdownText.scaleY = 1;
        _oCountdownTextStroke.scaleX = _oCountdownTextStroke.scaleY = _oCountdownText.scaleY;
        
        _oCountdownText.text = TEXT_GO;
        _oCountdownTextStroke.text = TEXT_GO;
        
        createjs.Tween.get(_oCountdownText).wait(500).to({alpha:0}, 1000, createjs.Ease.cubicIn);
        createjs.Tween.get(_oCountdownTextStroke).wait(500).to({alpha:0}, 1000, createjs.Ease.cubicIn);
        
    };

    this.addMiniMapCursor = function(oCursor, oReference){
        _oMiniMap.addCursor(oCursor, oReference);
    };

    this.refreshMiniMap = function(iPlayerSegment){
        _oMiniMap.update(iPlayerSegment);
    };

    this.setLevelInfo = function(iLevel){       
        var iX = LEVEL_INFO[iLevel].minimap.x;
        var iY = LEVEL_INFO[iLevel].minimap.y;
        var iScale = LEVEL_INFO[iLevel].minimap.scale;
        var iRot = LEVEL_INFO[iLevel].minimap.rot;
        _oMiniMap.setMapViewInfo(iX,iY,iScale, iRot);
        
        _oMiniMap.setLabel(sprintf(TEXT_TRACK,iLevel+1));
    };

    this._onButRestartRelease = function(){
        
        _aNumCountDown = new Array();
        for(var i=0; i<=3; i++){
            _aNumCountDown[i] = false;
        }
        
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        s_oGame.setPause();
        var oPanel = new CAreYouSurePanel(s_oGame.onExit, s_oGame.setResume);
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;