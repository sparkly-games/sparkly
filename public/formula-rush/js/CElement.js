function CElement(oData, iXOffset, iSegmentIndex, oParentContainer){
    this._aCbCompleted;
    this._aCbOwner;
    this._aParams;

    this._bCollided;

    this._iXOffset;
    this._iSegmentIndex;

    this._oData;

    this._oSegment;
    this._oParentContainer;
    this._oGeneralContainer;
    this._oElement;
    this._oMask;
    
    this._init(oData, iXOffset, iSegmentIndex, oParentContainer);
};

CElement.prototype._init = function(oData, iXOffset, iSegmentIndex, oParentContainer){
    this._aCbCompleted=new Array();
    this._aCbOwner =new Array();
    this._aParams =new Array();

    this._bCollided = false;
    
    this._oParentContainer = oParentContainer;
    
    this._oGeneralContainer = new createjs.Container();
    //this._oGeneralContainer.regX =-100;
    this._oParentContainer.addChild(this._oGeneralContainer);
    
    this._oContainer = new createjs.Container();
    this._oGeneralContainer.addChild(this._oContainer);
    
    this._iXOffset = iXOffset;
    this._iSegmentIndex = iSegmentIndex;

    this._oData = oData;
    
    this._createElement();
    this._setPosition();
    this._setCollisor();
    
    this._oContainer.addChild(this._oElement);

    this._oGeneralContainer.visible = false;

    var oBounds = this._oContainer.getBounds();
    this._oGeneralContainer.setBounds(oBounds.x, oBounds.y, oBounds.width, oBounds.height);
    
    //this._oGeneralContainer.cache(oBounds.x, oBounds.y, oBounds.width, oBounds.height);
    //this._oContainer.cache(oBounds.x, oBounds.y, oBounds.width, oBounds.height);
    
    this._oMask = new createjs.Shape();
    this._oMask.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(oBounds.x, oBounds.y, oBounds.width, oBounds.height);
    //this._oContainer.addChild(this._oMask);


    this._oContainer.mask = this._oMask;  
    
    
};

CElement.prototype.unload = function(){
    this._oParentContainer.removeChild(this._oGeneralContainer);
};

CElement.prototype.getElement = function(){
    return this._oElement;
};

CElement.prototype.getContainer = function(){
    return this._oGeneralContainer;
};

CElement.prototype._setPosition = function(){
    this._oElement.regX = this._oElement.getBounds().width/2;
    
    var oPhysicsData = this._oData.physics;
    if(oPhysicsData){
        if(oPhysicsData.hasOwnProperty('center')){
            this._oElement.regX = oPhysicsData.center;
        }
        if(oPhysicsData.hasOwnProperty('base')){
            this._oElement.regY = -oPhysicsData.base;
        }
    }
};

CElement.prototype._setCollisor = function(){
    var iSpriteWidth = this._oElement.getBounds().width * SPRITES.SCALE;
    
    var oPhysicsData = this._oData.physics;
    
    var iCollisionCenter = this._iXOffset;
    var iCollisionWidth = iSpriteWidth;
    var iDebugCenter = 0;
    var iDebugHeight = 50;
    var iDebugWidth = this._oElement.getBounds().width;
    if(oPhysicsData){
        if(oPhysicsData.hasOwnProperty('center')){
            iCollisionCenter = this._iXOffset// + oCollisionData.center * SPRITES.SCALE;
            iDebugCenter = 0//oCollisionData.center;
        }
        if(oPhysicsData.hasOwnProperty('width')){
            iCollisionWidth = oPhysicsData.width * SPRITES.SCALE;
            iDebugWidth = oPhysicsData.width;
        }
    }
    

    this._oCollision = {center: iCollisionCenter, width: iCollisionWidth};
};

CElement.prototype.getCollisor = function(){
    return this._oCollision;
};

CElement.prototype.isCollided = function(){
    return this._bCollided;
};

CElement.prototype.pause = function(bVal){
    this._oElement.paused = bVal;
};

CElement.prototype.getOffset = function(){
    return this._iXOffset;
};

CElement.prototype.getMask = function(){
    return this._oMask;
};

CElement.prototype.setVisible = function(bVal){
    this._oGeneralContainer.visible = bVal;
};

CElement.prototype.setAlpha = function(iAlpha){
    this._oGeneralContainer.alpha = iAlpha;
};

CElement.prototype.setPosition = function(iX, iY){
    this._oElement.x = iX;
    this._oElement.y = iY;
};

CElement.prototype.getSegmentIndex = function(){
    return this._iSegmentIndex;
};


CElement.prototype.setScale = function(iScale){
    this._oElement.scale = iScale;
};

CElement.prototype.addEventListener = function( iEvent,cbCompleted, cbOwner, aParams ){
    this._aCbCompleted[iEvent]=cbCompleted;
    this._aCbOwner[iEvent] = cbOwner; 
    this._aParams = aParams;
};

CElement.prototype.triggerCollision = function(){
    if(this._aCbCompleted[ON_ITEM_COLLISION]){
        this._aCbCompleted[ON_ITEM_COLLISION].call(this._aCbOwner[ON_ITEM_COLLISION], this, this._aParams);
    }
};



