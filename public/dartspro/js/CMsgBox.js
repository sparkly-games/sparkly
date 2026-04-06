function CMsgBox(){
    var _iStartY;
    var _oListener;
    var _oButYes;
    var _oFade;
    var _oPanelContainer;
    var _oContainer;
    
    this._init = function () {
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oListener =_oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
        _oPanelContainer = new createjs.Container();   
        _oContainer.addChild(_oPanelContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        var oBg = createBitmap(oSpriteBg);
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oPanelContainer.addChild(oBg);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = _iStartY = - oSpriteBg.height/2;    
        
        var oMsg = new createjs.Text(TEXT_ERR_LS, "24px " + FONT, "#ffb557");
        oMsg.x = 0;
        oMsg.y = -180;
        oMsg.textAlign = "center";
        oMsg.textBaseline = "middle";
        oMsg.lineWidth = oSpriteBg.width -100;
        _oPanelContainer.addChild(oMsg);
        

        _oButYes = new CGfxButton(0, 160, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        
        createjs.Tween.get(_oPanelContainer).to({y: CANVAS_HEIGHT/2}, 1000, createjs.Ease.cubicOut);
    };
    
    
    this._onButYes = function(){
        _oButYes.unload();
        _oFade.off("click",_oListener);
        
        s_oStage.removeChild(_oContainer);
    };
    
    this._init();
}