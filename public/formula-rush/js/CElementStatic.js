function CElementStatic(oData, iXOffset, iSegmentIndex, oParentContainer){
    CElement.call(this, oData, iXOffset, iSegmentIndex, oParentContainer);
};

CElementStatic.prototype = Object.create(CElement.prototype);

CElementStatic.prototype._createElement = function(){
    
    var oSprite = s_oSpriteLibrary.getSprite(this._oData.name);
    this._oElement = createBitmap(oSprite);

};

CElementStatic.prototype.setCollided = function(bVal){
    this._bCollided = bVal;
};


