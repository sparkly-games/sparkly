function CTimer(iX, iY, oParentContainer, iSize, szColor, szSprite, szStrokeColor){
    
    var _oTimerContainer;
    var _oTimeStroke;
    var _oTime;
    
    this._init = function(iX, iY, oParentContainer, iSize, szColor, szSprite, szStrokeColor){
        _oTimerContainer = new createjs.Container();
        _oTimerContainer.x = iX;
        _oTimerContainer.y = iY;
        oParentContainer.addChild(_oTimerContainer)
        
        var iTimeX = 0;
        
        if(szSprite){
            var oSprite = s_oSpriteLibrary.getSprite(szSprite);
            var oTimer = createBitmap(oSprite);
            oTimer.regY = oSprite.height/2;
            _oTimerContainer.addChild(oTimer);
            iTimeX = oSprite.width;
        }
        
        
        _oTimeStroke = new createjs.Text("00:00"," "+iSize+"px "+PRIMARY_FONT, szStrokeColor);
        _oTimeStroke.x = iTimeX + 10;
        _oTimeStroke.textAlign = "left";
        _oTimeStroke.textBaseline = "middle";
        _oTimeStroke.lineWidth = 500;
        _oTimeStroke.outline = 6;
        _oTimerContainer.addChild(_oTimeStroke);
        
        _oTime = new createjs.Text(_oTimeStroke.text," "+iSize+"px "+PRIMARY_FONT, szColor);
        _oTime.x = _oTimeStroke.x;
        _oTime.y = _oTimeStroke.y;
        _oTime.textAlign = _oTimeStroke.textAlign;
        _oTime.textBaseline = _oTimeStroke.textBaseline;
        _oTime.lineWidth = _oTimeStroke.lineWidth;
        _oTimerContainer.addChild(_oTime);

        _oTimerContainer.regX = _oTimerContainer.getBounds().width/2;
    };
    
    this.setVisible = function(bVal){
        _oTimerContainer.visible = bVal;
    };
    
    this.setTime = function(iTime){
        _oTimeStroke.text = iTime;
        _oTime.text = iTime;
    };
    
    this.setDecimalTime = function(iValue){
        var iTime = formatTime(iValue);
        
        _oTimeStroke.text = iTime;
        _oTime.text = iTime;
    };
    
    this.setIntTime = function(iValue){
        var iTime = Math.floor(iValue/1000);
        
        _oTimeStroke.text = iTime;
        _oTime.text = iTime;
    };
    
    this.setSpeedIndicator = function(iValue){
        var iSpeed = Math.floor(iValue);
        
        _oTimeStroke.text = iSpeed;
        _oTime.text = iSpeed;
    };
    
    this.setAlign = function(szAlign, szBaseline){
        _oTimeStroke.textAlign = szAlign;
        _oTimeStroke.textBaseline = szBaseline;
        
        _oTime.textAlign = _oTimeStroke.textAlign;
        _oTime.textBaseline = _oTimeStroke.textBaseline;
    };
    
    this.resetTextRelativePos = function(){
        _oTimeStroke.x = 0;
        _oTimeStroke.y = 0;
        
        _oTime.x = _oTimeStroke.x;
        _oTime.y = _oTimeStroke.y;
        
        _oTimerContainer.regX = 0;
    };
    
    this.setPos = function(iXPos, iYPos){
        _oTimerContainer.x = iXPos;
        _oTimerContainer.y = iYPos;
    };
    
    this._init(iX, iY, oParentContainer, iSize, szColor, szSprite, szStrokeColor);
    
}


