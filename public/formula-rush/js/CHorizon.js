function CHorizon(iLevel, oParentContainer){
    
    var _oPrevCameraPos;
    
    var _aLevelBG;
    
    var _oHorizon;

    this._init = function(iLevel){
        
        _oPrevCameraPos = {x: 0, y: 0};
        
        _oHorizon = new createjs.Container();
        _oHorizon.x = -HALF_CANVAS_WIDTH;
        oParentContainer.addChild(_oHorizon);
        
        _aLevelBG = new Array();

        var iWorldNum = Math.floor(iLevel/NUM_TRACKS_PER_WORLD);
        var szSprite0 = "w"+iWorldNum+"_bg0";
        var szSprite1 = "w"+iWorldNum+"_bg1";
        var szSprite2 = "w"+iWorldNum+"_bg2";

        var oSprite = s_oSpriteLibrary.getSprite(szSprite0);
        this._addBG(oSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite(szSprite1);
        this._addBG(oSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite(szSprite2);
        this._addBG(oSprite);
    };
    
    this._addBG = function(oSprite){
       
        var oBg = new CBackground(oSprite, _oHorizon);
       
        
        _aLevelBG.push(oBg);
    };
    
    this.resetPos = function(){
        _oPrevCameraPos = {x: 0, y: 0};
    };
    
    this.restart = function(){
        for(var i=0; i<_aLevelBG.length; i++){
            _aLevelBG[i].restart();
        }
    };
    
    this.move = function(oCameraPos){
        var oPosXToAdd  = _oPrevCameraPos.x - oCameraPos.x;////X IS INCREMENTAL, CAUSE WHEN THE TRACK ENDS, THE X IS NOT 0

        _aLevelBG[0].moveX(oPosXToAdd);
        _aLevelBG[1].moveX(oPosXToAdd*PARALLAX_RATIO_X_1);
        _aLevelBG[2].moveX(oPosXToAdd*PARALLAX_RATIO_X_2);
       
        _oPrevCameraPos = {x: oCameraPos.x, y: oCameraPos.y};
    };
    
    this._init(iLevel);
}


