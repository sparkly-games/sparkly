function CLevelMenu(){
    var _iCurPage;
    var _iStartY;
    var _iHeightToggle;
    var _aLevelButs;
    var _aPointsX;
    var _aContainerPage;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oSpriteBg;
    var _oContainerPanel;
    var _oButExit;
    var _oAudioToggle;
    var _oArrowRight = null;
    var _oArrowLeft = null;
    var _oTextLevel;
    var _oContainer;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        _iCurPage = 0;
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oMainBg = createBitmap(s_oSpriteLibrary.getSprite('bg_select_mode'));
        _oContainer.addChild(oMainBg);

        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainer.addChild(_oContainerPanel);
        
        _oSpriteBg = s_oSpriteLibrary.getSprite("bg_level_selection");
        var oBg = createBitmap(_oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        _oTextLevel = new createjs.Text(TEXT_SELECT_LEVEL ,"90px "+FONT, "#fff");
        _oTextLevel.x = _oSpriteBg.width/2;
        _oTextLevel.y = 100;
        _oTextLevel.textAlign = "center";
        _oContainerPanel.addChild(_oTextLevel);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2)-10,y:(oSprite.height/2)+10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        _oContainerPanel.regX = _oSpriteBg.width/2;
        _oContainerPanel.regY = _oSpriteBg.height/2;
        
        _iStartY = -_oSpriteBg.height/2;
        _iHeightToggle = oSprite.height;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x -(oSprite.width/2) - 10, y: _pStartPosExit.y};
            
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
        
        
        this._checkBoundLimits();
        
        //FIND X COORDINATES FOR LEVEL BUTS
        _aPointsX = new Array();
        var iWidth = _oSpriteBg.width - 100 ;
        var iOffsetX = Math.floor(iWidth/NUM_COLS_PAGE_LEVEL)/2;
        var iXPos = 0;
        for(var i=0;i<NUM_COLS_PAGE_LEVEL;i++){
            _aPointsX.push(iXPos);
            iXPos += iOffsetX*2;
        }
        
        _aContainerPage = new Array();
        this._createNewLevelPage(0,NUM_LEVELS);

        
        this.refreshButtonPos();	
        
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oContainerPanel).to({y:CANVAS_HEIGHT/2}, 1000,createjs.Ease.cubicOut);
    };
    
    this.unload = function(){
        for(var i=0;i<_aLevelButs.length;i++){
            _aLevelButs[i].unload();
        }  
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        
        if(_oArrowLeft !== null){
            _oArrowLeft.unload();
            _oArrowRight.unload();
        }
        
        s_oStage.removeAllChildren();
        s_oLevelMenu = null;
    };
    
    this.refreshButtonPos = function(){

        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this._checkBoundLimits = function(){
        var oSprite = s_oSpriteLibrary.getSprite('but_level');
        var iY = 0;
        
        var iHeightBound = CANVAS_HEIGHT - (EDGEBOARD_Y*2) - (_iHeightToggle * 2);
        var iNumRows = 0;

        while(iY < iHeightBound){
            iY += oSprite.height + 20;
            iNumRows++;
        }

        if(NUM_ROWS_PAGE_LEVEL > iNumRows){
            NUM_ROWS_PAGE_LEVEL = iNumRows;
        }
        
        
        var iNumCols = 0;
        var iX = 0;
        var iWidthBounds = CANVAS_WIDTH - (EDGEBOARD_X*2);
        var oSprite = s_oSpriteLibrary.getSprite('but_level'); 

        while(iX < iWidthBounds){
            iX += (oSprite.width/2) + 5;
            iNumCols++;  
        }
        if(NUM_COLS_PAGE_LEVEL > iNumCols){
            NUM_COLS_PAGE_LEVEL = iNumCols;
        }
    };
    
    this._createNewLevelPage = function(iStartLevel,iEndLevel){
        var oContainerLevelBut = new createjs.Container();
        _oContainerPanel.addChild(oContainerLevelBut);
        _aContainerPage.push(oContainerLevelBut);
        
        _aLevelButs = new Array();
        var iCont = 0;
        var iY = 0;
        var iNumRow = 1;
        var bNewPage = false;
        var oSprite = s_oSpriteLibrary.getSprite('but_level');

        for(var i=iStartLevel;i<iEndLevel;i++){
            var oBut = new CLevelBut(_aPointsX[iCont] + oSprite.width/4, iY + oSprite.height/2, i+1,oSprite, (i+1)>s_iLastLevel?false:true,oContainerLevelBut);
            oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onButLevelRelease, this,i);
            _aLevelButs.push(oBut);
            
            iCont++;
            if(iCont === _aPointsX.length){
                iCont = 0;
                iY += oSprite.height + 70;
                iNumRow++;
                if(iNumRow > NUM_ROWS_PAGE_LEVEL && i!==iEndLevel-1){
                    bNewPage = true;
                    break;
                }
            }
        }
        
        oContainerLevelBut.x = _oSpriteBg.width/2 ;
        oContainerLevelBut.y = _oSpriteBg.height/2+100;
        oContainerLevelBut.regX = oContainerLevelBut.getBounds().width/2;
        oContainerLevelBut.regY = oContainerLevelBut.getBounds().height/2;
        
        if(bNewPage){
            //ADD A PAGE
            this._createNewLevelPage(i+1,iEndLevel);
        }
        
    };
    
    this._onRight = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage++;
        if(_iCurPage >=  _aContainerPage.length){
            _iCurPage = 0;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this._onLeft = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage--;
        if(_iCurPage <  0){
            _iCurPage =_aContainerPage.length-1;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this._onButLevelRelease = function(iLevel){
        s_oLevelMenu.unload();
        
        s_oMain.levelSelected(iLevel+1);
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
    
    this._onExit = function(){
        s_oLevelMenu.unload();
        s_oMain.gotoModePanel();
    };

    s_oLevelMenu = this;
    this._init();
}

var s_oLevelMenu = null;