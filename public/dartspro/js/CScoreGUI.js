function CScoreGUI(iX,iY,oSpriteBg,szNickname,oParentContainer){
    var _iCurGUI;
    var _aDartScoreText;
    var _pStartPos;
    
    var _oTextNickName;
    var _oTextTotScore;
    var _oBgNickname;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY,oSpriteBg,szNickname){
        _iCurGUI = 0;
        
        _pStartPos = {x:iX,y:iY};
        _oContainer = new createjs.Container();
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
        _oParentContainer.addChild(_oContainer);
        
        
        var oData = {   
                        images: [oSpriteBg], 
                        // width, height & registration point of each sprite
                        frames: {width: oSpriteBg.width, height: oSpriteBg.height/2}, 
                        animations: {on:0,off:1}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oBgNickname = createSprite(oSpriteSheet,"off",0,0,oSpriteBg.width,oSpriteBg.height/2);
        _oContainer.addChild(_oBgNickname);

        
        _oTextNickName = new createjs.Text(szNickname, "38px " + FONT, "#fff");
        _oTextNickName.x = 20;
        _oTextNickName.y = 42;
        _oTextNickName.textAlign = "left";
        _oTextNickName.textBaseline = "alphabetic";
        _oContainer.addChild(_oTextNickName);
        
        _aDartScoreText = new Array();
        var iXPos = 340;
        for(var i=0;i<NUM_THROW_PER_TURN;i++){
            var oText = new createjs.Text("0", "38px " + FONT, "#fff");
            oText.x = iXPos;
            oText.y = 46;
            oText.textAlign = "center";
            oText.textBaseline = "alphabetic";
            _oContainer.addChild(oText);
            
            _aDartScoreText.push(oText);
            
            iXPos += 58;
        }
        
        _oTextTotScore = new createjs.Text(STARTING_SCORE, "44px " + FONT, "#f6ed00");
        _oTextTotScore.x = 510;
        _oTextTotScore.y = 46;
        _oTextTotScore.textAlign = "left";
        _oTextTotScore.textBaseline = "alphabetic";
        _oContainer.addChild(_oTextTotScore);
    };
    
    this.refreshButtonPos = function(){
        _oContainer.x = _pStartPos.x - s_iOffsetX;
        _oContainer.y = _pStartPos.y - s_iOffsetY;
    };
    
    this.reset = function(){
        for(var i=0;i<_aDartScoreText.length;i++){
            _aDartScoreText[i].text = "0";
        }
    };
    
    this.resetPlayerScore = function(){
        _oTextTotScore.text = STARTING_SCORE;
    };
    
    this.showTurn = function(){
        _oBgNickname.gotoAndStop("on");
    };
    
    this.hideTurn = function(){
         _oBgNickname.gotoAndStop("off");
    };
    
    this.showNextScore = function(iThrow,iScore){
        _aDartScoreText[iThrow].text = iScore;
    };
    
    this.refreshPlayerScore = function(iScore){
        _oTextTotScore.text = iScore;
    };

    this._init(iX,iY,oSpriteBg,szNickname);
}