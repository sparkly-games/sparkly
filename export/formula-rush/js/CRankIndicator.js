function CRankIndicator(iX, iY, oParentContainer, iSize){
    var _oContainer;
    var _oText;
    var _oTextSuffix;
    
    var _pStartPos;
    
    this._init = function(){
        _pStartPos = {x: iX, y:iY};
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var iWidth = 100;
        var iHeight = 100;
        var iTextX = -iWidth;
        var iTextY = 0;
        _oText = new CTLText(_oContainer, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    iSize, "right", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    "--",
                    true, true, false,
                    false );
                    
        var iWidth = 70;
        var iHeight = 70;
        var iTextX = 0;
        var iTextY = -15;
        _oTextSuffix = new CTLText(_oContainer, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    iSize/2, "left", "#fff", THIRD_FONT, 1,
                    2, 2,
                    "-",
                    true, true, false,
                    false );

    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.refreshPosition = function(iNewX, iNewY){
        _oContainer.x = _pStartPos.x + iNewX;
        _oContainer.y = _pStartPos.y + iNewY;
    };
    
    this.refreshRank = function(iPos){
        _oText.refreshText(iPos.toString());

        var szSuffix = ordinalSuffix(iPos);
        
        _oTextSuffix.refreshText(szSuffix);

        this.setColorBasedOnRank(iPos);
    };
    
    this.center = function(){
        
        var iMainNumWidth = _oText.getText().getBounds().width;
        var iSuffixNumWidth = _oTextSuffix.getText().getBounds().width;

        var iTotWidth = iMainNumWidth+iSuffixNumWidth;

        _oContainer.x = -iSuffixNumWidth + iTotWidth/2+120;
    };
    
    this.alignLeft = function(){
        
        var iMainNumWidth = _oText.getText().getBounds().width;
        var iSuffixNumWidth = _oTextSuffix.getText().getBounds().width;

        var iTotWidth = iMainNumWidth+iSuffixNumWidth;

        _oContainer.x = -iSuffixNumWidth + iTotWidth;
    };
    
    this.setColorBasedOnRank = function(iPos){
        var iIndexColor = iPos-1;
        var szColor = TYPE_CUP_COLOR[3][0];
        var szOutlineColor = TYPE_CUP_COLOR[3][1]
        if(iPos<=MIN_RANK_FOR_WIN){
            szColor = TYPE_CUP_COLOR[iIndexColor][0];
            szOutlineColor = TYPE_CUP_COLOR[iIndexColor][1];
        }
        
        _oText.setColor(szColor);
        _oTextSuffix.setColor(szColor);
        
        _oText.setStroke(10,szOutlineColor);
        _oTextSuffix.setStroke(10,szOutlineColor);
    };
    
    this.setOutline = function(){
        _oText.setStroke(10,"#000");
        _oTextSuffix.setStroke(10,"#000");
    };
    
    this._init();
}



