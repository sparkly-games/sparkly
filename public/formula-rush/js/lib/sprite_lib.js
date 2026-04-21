function CSpriteLibrary(){

    var _oLibSprites = {};
    var _oSpritesToLoad;
    var _iNumSprites;
    var _iCntSprites;
    var _cbCompleted;
    var _cbTotalCompleted;
    var _cbOwner;
    
    var _aGroupElements;
    var _iCurGroupLoad;
    
    this.init = function( cbCompleted,cbTotalCompleted, cbOwner ){
        _oSpritesToLoad = {};
        _iNumSprites = 0;
        _iCntSprites = 0;
        _cbCompleted = cbCompleted;
        _cbTotalCompleted = cbTotalCompleted;
        _cbOwner     = cbOwner;
    };
    
    this.addSprite = function( szKey, szPath ){
        if ( _oLibSprites.hasOwnProperty(szKey) ){
            return false;
        }
        
        var oImage = new Image();
        _oLibSprites[szKey] = _oSpritesToLoad[szKey] = { szPath:szPath, oSprite: oImage ,bLoaded:false};
        _iNumSprites++;
        
        return true;
    };
    
    this.getSprite = function( szKey ){
        if (!_oLibSprites.hasOwnProperty(szKey)){
            return null;
        }else{
            return _oLibSprites[szKey].oSprite;
        }
    };
    
    this._onSpritesLoaded = function(){
        _iNumSprites = 0;
        _cbTotalCompleted.call(_cbOwner);
    };

    this._onSpriteLoaded = function(){
        _cbCompleted.call(_cbOwner);
        if (++_iCntSprites === _iNumSprites) {
            this._onSpritesLoaded();
        }
        
    };    


    this.loadSprites = function(iNumGroup){
        var iTotalElements = Object.keys(_oSpritesToLoad).length;
        var iMaxNumPerGroup = iTotalElements;
        if(iNumGroup){
            iMaxNumPerGroup = Math.ceil( iTotalElements/iNumGroup );
        }
        
        this._fillGroup(iTotalElements, iMaxNumPerGroup);

        this._startLoadingGroup();
    };

    this._fillGroup = function(iTotalElements, iMaxNumPerGroup){
        _aGroupElements = new Array(); 
        var iCounter = 0;
        var iIndex = 0;
        _aGroupElements[iIndex] = {};
        for (var szKey in _oSpritesToLoad) {
            _aGroupElements[iIndex][szKey] = _oSpritesToLoad[szKey];

            iCounter++;
            iTotalElements--;
            if(iCounter === iMaxNumPerGroup){
                iCounter = 0;
                iIndex++;
                if(iTotalElements > 0){
                    _aGroupElements[iIndex] = {};
                }
            }
        }
        
        
    };

    this._startLoadingGroup = function(){
        _iCurGroupLoad = 0;
        this._loadSpriteGroup(_aGroupElements[_iCurGroupLoad]);
        
    };

    this._onGroupLoaded = function(){
        _iCurGroupLoad++;
        if(_iCurGroupLoad<_aGroupElements.length){
            this._loadSpriteGroup(_aGroupElements[_iCurGroupLoad]);
        }
    };

    this._loadSpriteGroup = function(oGroup){
        var iCounter = Object.keys(oGroup).length;

        for (var szKey in oGroup) {
            
            oGroup[szKey].oSprite["oSpriteLibrary"] = this;
            oGroup[szKey].oSprite["szKey"] = szKey;
            oGroup[szKey].oSprite.onload = function(){
                this.oSpriteLibrary.setLoaded(this.szKey);
                this.oSpriteLibrary._onSpriteLoaded(this.szKey);
                
                iCounter--;
                if(iCounter === 0){
                    //SEND NOTIFY
                    this.oSpriteLibrary._onGroupLoaded();
                }
            };
            oGroup[szKey].oSprite.onerror  = function(evt){
                var oSpriteToRestore = evt.currentTarget;
                
                setTimeout(function(){
                        oGroup[oSpriteToRestore.szKey].oSprite.src = oGroup[oSpriteToRestore.szKey].szPath;
                },500);
            };
            oGroup[szKey].oSprite.src = oGroup[szKey].szPath;
        }
    };
    
    
    
    this.setLoaded = function(szKey){
        _oLibSprites[szKey].bLoaded = true;
    };
    
    this.isLoaded = function(szKey){
        return _oLibSprites[szKey].bLoaded;
    };
    
    this.getNumSprites=function(){
        return _iNumSprites;
    };
}