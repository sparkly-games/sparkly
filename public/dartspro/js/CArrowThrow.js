function CArrowThrow(iX,iY,oParentContainer){
    var _oContainer;

    var _oArrowMask;
    var _oArrow;
    var _oArrowFill;
    var _iMaskWidth;
    var _iMaskHeight;
    var _oThis;
    var _oParentContainer;

    this._init = function (iX, iY) {
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
         
        var oSpriteArrow = s_oSpriteLibrary.getSprite("arrow");
        _oArrow = createBitmap(oSpriteArrow);
        _oArrow.regY = oSpriteArrow.height;
        _oContainer.addChild(_oArrow);
        
        _oArrowFill = createBitmap(s_oSpriteLibrary.getSprite("arrow_fill"));
        _oArrowFill.regY = oSpriteArrow.height;
        _oContainer.addChild(_oArrowFill);
        
        _iMaskWidth = oSpriteArrow.width;
        _iMaskHeight = oSpriteArrow.height;
        
        _oArrowMask = new createjs.Shape();
        _oArrowMask.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(_oArrow.x, _oArrow.y, _iMaskWidth, _iMaskHeight);
        _oArrowMask.regY = _iMaskHeight;
        _oContainer.addChild(_oArrowMask);

        
        
        _oArrowFill.mask = _oArrowMask;
        
        _oContainer.regX = oSpriteArrow.width/2;
    };

    this.unload = function () {
        createjs.Tween.removeTweens(_oArrowMask);
        _oParentContainer.removeChild(_oContainer);
    };

    this.setVisible = function (bVisible) {
        _oContainer.rotation = 0;
        this.mask(0);
        _oContainer.visible = bVisible;
        
    };
    
    this.setAngle = function (iRotation) {
        _oContainer.rotation = iRotation;
    };
    
    this.animHelp = function(iTime){
        _oArrowMask.scaleX = 0;
        createjs.Tween.get(_oArrowMask).to({scaleX: 1}, iTime, createjs.Ease.cubicInOut).call(function () {
            createjs.Tween.get(_oArrowMask).to({scaleX: 0}, iTime, createjs.Ease.cubicInOut).call(function () {
                _oThis.animHelp(iTime);
            });
        });
    };
    
    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };
    
    this.mask = function (iVal) {
        _oArrowMask.graphics.clear();
        var iNewMaskHeight = Math.floor((iVal * _iMaskHeight) / _iMaskHeight);
        _oArrowMask.regY = iNewMaskHeight;
        _oArrowMask.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(_oArrow.x, _oArrow.y, _iMaskWidth, iNewMaskHeight);
    };
    
    this.setX = function (iXPos) {
        _oContainer.x = iXPos;
    };

    this.setY = function (iYPos) {
        _oContainer.y = iYPos;
    };

    this.getX = function () {
        return _oContainer.x;
    };

    this.getY = function () {
        return _oContainer.y;
    };

    this.getHeight = function(){
        return _iMaskHeight;
    };

    _oParentContainer = oParentContainer;

    _oThis = this;
    this._init(iX, iY);
}