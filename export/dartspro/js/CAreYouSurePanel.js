function CAreYouSurePanel(oParentContainer) {
    var _iStartY;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oBg;
    var _oMsg;
    var _oButYes;
    var _oButNo;
    var _oContainer;
    var _oParentContainer;
    var _oFade;
    var _oPanelContainer;
    
    var _oThis = this;

    this._init = function () {
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
        _oPanelContainer = new createjs.Container();   
        _oContainer.addChild(_oPanelContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oPanelContainer.addChild(_oBg);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = _iStartY = - oSpriteBg.height/2;    
        
        _oMsg = new createjs.Text("", "90px " + FONT, "#fff");
        _oMsg.x = 0;
        _oMsg.y = -120;
        _oMsg.textAlign = "center";
        _oMsg.textBaseline = "middle";
        _oMsg.lineWidth = oSpriteBg.width -50;
        _oPanelContainer.addChild(_oMsg);
        
        

        _oButYes = new CGfxButton(190, 180, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(-170, 180, s_oSpriteLibrary.getSprite('but_exit'), _oPanelContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
    };
    
    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };
    
    this.show = function (szText,iSize) {
        PokiSDK.gameplayStop();
        
        _oMsg.text = szText;
        _oMsg.font = iSize+"px " + FONT;
        _oPanelContainer.y = _iStartY;
        _oContainer.visible = true;
        createjs.Tween.get(_oPanelContainer).to({y: CANVAS_HEIGHT/2}, 1000, createjs.Ease.cubicOut).call(function(){s_oMain.stopUpdateNoBlock();});
    };
    
    this.hide = function(){
        s_oMain.startUpdateNoBlock();
        _oContainer.visible = false;
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
        _oFade.off("click",_oListener);
    };

    this._onButYes = function () {
        _oThis.hide();
        
        if (_aCbCompleted[ON_BUT_YES_DOWN]) {
            _aCbCompleted[ON_BUT_YES_DOWN].call(_aCbOwner[ON_BUT_YES_DOWN]);
        }
    };

    this._onButNo = function () {
        PokiSDK.gameplayStart();
        _oThis.hide();
    };

    _oParentContainer = oParentContainer;

    this._init();
}