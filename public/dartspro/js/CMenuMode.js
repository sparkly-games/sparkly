function CMenuMode(){
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosExit;
    
    var _oTextSelect;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButExit;
    var _oButSingle;
    var _oButVsCpu;
    var _oButVsHuman;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_select_mode"));
        _oContainer.addChild(oBg);

        var oSprite = s_oSpriteLibrary.getSprite("but_exit");
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP,this._onExit,this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - oSprite.width/2 - 10, y: _pStartPosExit.y};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        
        //ATTACH MODE BUTTONS
        _oButSingle = new CGfxButton(0,0,s_oSpriteLibrary.getSprite("but_single"),_oContainer);
        _oButSingle.addEventListener(ON_MOUSE_DOWN,this._onSingle,this);
        
        _oButVsCpu = new CGfxButton(0,0,s_oSpriteLibrary.getSprite("but_vs_cpu"),_oContainer);
        _oButVsCpu.addEventListener(ON_MOUSE_DOWN,this._onVsCpu,this);
        
        _oButVsHuman = new CGfxButton(0,0,s_oSpriteLibrary.getSprite("but_vs_human"),_oContainer);
        _oButVsHuman.addEventListener(ON_MOUSE_DOWN,this._onVsHuman,this);
        
        _oTextSelect = new createjs.Text(TEXT_SELECT_MODE,"110px "+FONT, "#fff");
        _oTextSelect.x = CANVAS_WIDTH/2;
        _oTextSelect.y = 100;
        _oTextSelect.textAlign = "center";
        _oTextSelect.textBaseline = "alphabetic";
        _oContainer.addChild(_oTextSelect);
        
        this.refreshButtonPos();
    };

    this.unload = function(){
        _oButExit.unload();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }

        s_oStage.removeAllChildren();
        s_oModeMenu = null;
    };
    
    this.refreshButtonPos = function(){
        _oButExit.setPosition(_pStartPosExit.x-s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,_pStartPosAudio.y + s_iOffsetY);
        }
                
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        
        if(s_bLandscape){
            _oButSingle.setPosition(CANVAS_WIDTH/2 - 500,CANVAS_HEIGHT/2);
            _oButVsCpu.setPosition(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
            _oButVsHuman.setPosition(CANVAS_WIDTH/2 + 500,CANVAS_HEIGHT/2);
        }else{
            _oButSingle.setPosition(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 - 400);
            _oButVsCpu.setPosition(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
            _oButVsHuman.setPosition(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 400);
        }
        
        _oTextSelect.y = _oButSingle.getY() - 300;
    };
    
    this._onSingle = function(){
        s_oModeMenu.unload();
        s_oMain.modeSelected(MODE_SINGLE);
    };
    
    this._onVsCpu = function(){
        s_oModeMenu.unload();
        s_oMain.modeSelected(MODE_VS_CPU);
    };
    
    this._onVsHuman = function(){
        s_oModeMenu.unload();
        s_oMain.modeSelected(MODE_VS_HUMAN);
    };
    
    this._onExit = function(){
        s_oModeMenu.unload();
        s_oMain.gotoMenu();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
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
    
    s_oModeMenu = this;
    
    this._init();
}

var s_oModeMenu = null;