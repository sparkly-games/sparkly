function CMenu(){
    var _oBg;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oCreditsBut;
    var _oButFullscreen;
    var _oButDelete;
    var _oScoreText;
    var _oScoreContainer;
    var _oLogo;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _pStartPosDelete;

    this._init = function(){
        //console.clear();
        var oSprite = s_oSpriteLibrary.getSprite('bg_menu');
        _oBg = createBitmap(oSprite);
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oBg.regX = oSprite.width/2;
        _oBg.regY = oSprite.height/2;
        s_oStage.addChild(_oBg);

       
        var oSprite = s_oSpriteLibrary.getSprite('logo_menu');
        _oLogo = createBitmap(oSprite);
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oLogo.x = CANVAS_WIDTH/2;
        _oLogo.y = CANVAS_HEIGHT/2-350;
        _oLogo.scale = 0.69;
        s_oStage.addChild(_oLogo);

        var oSpriteStart = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 500,oSpriteStart,s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();

        
        _oScoreContainer = new createjs.Container();
        _oScoreContainer.x = _oButPlay.getX();
        _oScoreContainer.y = _oButPlay.getY()+210;
        s_oStage.addChild(_oScoreContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('star');
        var oStar = createBitmap(oSprite);
        oStar.regX = oSprite.width/2;
        oStar.regY = oSprite.height/2;
        _oScoreContainer.addChild(oStar);
        
        var iTotalScore = 0;
        for(var i=0; i<s_aLevelScore.length; i++){
            iTotalScore += s_aLevelScore[i];
            
        }

        _oScoreText =  new CTLText(_oScoreContainer, 
                    50, -50, 250, 100, 
                    80, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    iTotalScore+"",
                    true, true, false,
                    false );
        _oScoreText.setStroke(10,"#000");

        ///CENTER THE TEXT
        _oScoreContainer.x = _oButPlay.getX() - _oScoreText.getTextWidth()/2;

        //var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        //_pStartPosCredits = {x: (oSprite.width/2) + 10, y: (oSprite.height/2) + 10};            
        //_oCreditsBut = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite, s_oStage);
        //_oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
     

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this); 
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_delete_saving');
        _pStartPosDelete = {x: CANVAS_WIDTH - (oSprite.width/2) - 12, y: CANVAS_HEIGHT - (oSprite.height/2) - 16};            
        _oButDelete = new CGfxButton(_pStartPosDelete.x,_pStartPosDelete.y,oSprite, s_oStage);
        _oButDelete.addEventListener(ON_MOUSE_UP, this._onDeleteBut, this);
            
        if(!s_oLocalStorage.isDirty()){
            _oButDelete.setVisible(false);
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
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }



        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos();
        
        if(!s_oLocalStorage.isUsed()){
            new CMsgBox(TEXT_IOS_PRIVATE);
        }
    };
    
    this.unload = function(){
        _oButPlay.unload();
        //_oCreditsBut.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.unload();
        }

        s_oMenu = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(){
        if(s_bLandscape){
            _oButPlay.setPosition(CANVAS_WIDTH/2, CANVAS_HEIGHT-150-s_iOffsetY);
            _oScoreContainer.x = s_iOffsetX + 60;
            _oScoreContainer.y = CANVAS_HEIGHT - 60 -s_iOffsetY;
            
            _oLogo.y = CANVAS_HEIGHT/2-310;
        }else{
            _oButPlay.setPosition(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 500);
            _oScoreContainer.y = _oButPlay.getY()+210;
            _oScoreContainer.x = _oButPlay.getX() - _oScoreText.getTextWidth()/2;
            
            _oLogo.y = CANVAS_HEIGHT/2-350;
        }
    
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        //_oCreditsBut.setPosition(_pStartPosCredits.x + s_iOffsetX,s_iOffsetY + _pStartPosCredits.y);
        _oButDelete.setPosition(_pStartPosDelete.x - s_iOffsetX,_pStartPosDelete.y - s_iOffsetY);
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
    
    this._onCreditsBut = function(){
        //new CCreditsPanel();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onDeleteBut = function(){
        var oPanel = new CAreYouSurePanel(s_oMenu.deleteSavings);
        oPanel.changeMessage(TEXT_SAVE_REMOVE, 24);
        
        _oScoreText.refreshText(0);
    };
    
    this.deleteSavings = function(){
        s_oLocalStorage.deleteData();
        s_oLocalStorage.resetData();
        _oButDelete.unload();
    };
    
    this._onButPlayRelease = function(){
        s_oMenu.unload();

        $(s_oMain).trigger("start_session");

        s_oMain.gotoGame(0);
    };
	
        
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;