function CMenu(){
   
    var _oButPlay;
    var _oCreditsBut;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oBg;
    var _oAudioToggle;
    var _oButFullscreen;
    
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;

    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        
        
        
        _oButPlay = new CGfxButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 300,s_oSpriteLibrary.getSprite('but_play'),s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this, 0);

        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 10};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x: (oSprite.width/2) + 10, y: (oSprite.height/2) + 10};            
        _oCreditsBut = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite, s_oStage);
        _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }


        if(!s_bStorageAvailable){
            new CMsgBox();
        }else{
            s_iLastLevel = getLastLevel();
        }
        
        

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 1000).call(function(){oFade.visible = false;}); 
        
        setVolume("soundtrack",1);
        
        this.refreshButtonPos();
    };  
    
    this.unload = function(){
        _oButPlay.unload();
        _oCreditsBut.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        s_oMenu = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oCreditsBut.setPosition(_pStartPosCredits.x + s_iOffsetX,s_iOffsetY + _pStartPosCredits.y);
        

       
    };

    this._onButPlayRelease = function(){
        if(s_bPokiFirstTimePlay){
            s_oMain.pokiShowCommercial(s_oMenu._startGame);
        } else {
            s_oMenu._startGame();
        }
    };

    this._startGame = function(){
        $(s_oMain).trigger("start_session");
        s_oMenu.unload();
        s_oMain.gotoModePanel();
        
        s_bPokiFirstTimePlay = false;
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onCreditsBut = function(){
        new CCreditsPanel();
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

    
    s_oMenu = this;        
    this._init();
    
    
};

var s_oMenu = null;