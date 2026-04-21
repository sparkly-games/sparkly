function CMiniMap(iX, iY, oParentContainer){
    var _iLineLength;
    var _iLineWidth;
    var _iCurveStrength;
    
    var _rRectView;
    
    var _aPoints;
    
    var _oContainer;
    var _oContentContainer;
    var _oMapContainer;
    var _oCursorContainer;
    var _oIconContainer;
    var _oLabelText;
    
    var _aListCursors;
    
    
    this._init = function(){
        _iLineLength = 0.2;
        _iLineWidth = 20;
        _iCurveStrength = 0.122727;
        
        _oContainer = new createjs.Container();
        oParentContainer.addChild(_oContainer);
        
        var iWidth = 350;
        var iHeight = 225;
        _rRectView = new createjs.Rectangle(-iWidth/2, -iHeight/2, iWidth, iHeight);
        
        var oSprite = s_oSpriteLibrary.getSprite('map_panel');
        var oPanel = createBitmap(oSprite);
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oContainer.addChild(oPanel);
        
        var iWidth = oSprite.width;
        var iHeight = 50;
        var iTextX = -iWidth/2;
        var iTextY = -oSprite.height/2 -iHeight ;
        _oLabelText = new CTLText(_oContainer, 
                    iTextX, iTextY, iWidth, iHeight, 
                    50, "center", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        _oLabelText.setStroke(8,"#000")
        
        /*
        var oRectDebug = new createjs.Shape();
        oRectDebug.graphics.beginFill("black");
        oRectDebug.graphics.drawRect(_rRectView.x,_rRectView.y,_rRectView.width,_rRectView.height);
        oRectDebug.alpha = 0.6;
        _oContainer.addChild(oRectDebug);
        */
        
        _oContentContainer = new createjs.Container();
        _oContainer.addChild(_oContentContainer);
        
        _oMapContainer = new createjs.Container();
        _oContentContainer.addChild(_oMapContainer);
        
        _aPoints = new Array();
        

        _oCursorContainer = new createjs.Container();
        //_oCursorContainer.visible = false;
        _oContentContainer.addChild(_oCursorContainer);
        
        _oIconContainer = new createjs.Container();
        _oContentContainer.addChild(_oIconContainer);
        
        _aListCursors = new Array();
        
        //var iSize = _iLineWidth*2;

    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setPosition = function(iX, iY){
        ///BOTTOM-RIGHT
        _oContainer.x = iX// + _rRectView.width/2;
        _oContainer.y = iY + _rRectView.height/2;
    };
    
    this.setPath = function(aSegments){
        var vDirVect = {x:0, y:-1};
        var vCurPoint = {x:0, y:0, angle:0};
        
        var oMap = new createjs.Shape();
        oMap.graphics.setStrokeStyle(_iLineWidth);
        oMap.graphics.beginStroke("white");
        oMap.graphics.moveTo(vCurPoint.x,vCurPoint.y);
        _oMapContainer.addChild(oMap);

        var iCurAngle = 0;

        var iMinX = vCurPoint.x;
        var iMaxX = vCurPoint.x;
        var iMinY = vCurPoint.y;
        var iMaxY = vCurPoint.y;

        for(var i=0; i<aSegments.length; i++){
            var iCurve = -aSegments[i].curve*_iCurveStrength;
            iCurAngle -= iCurve;

            var iRad = degreesToRadians(iCurve);

            vDirVect = rotateSimpleVector2D(iRad, vDirVect);
            
            var vLengthVect = {x:vDirVect.x*_iLineLength, y:vDirVect.y*_iLineLength};

            
            vCurPoint = {x:vCurPoint.x + vLengthVect.x, y:vCurPoint.y + vLengthVect.y, angle:iCurAngle};

            oMap.graphics.lineTo(vCurPoint.x, vCurPoint.y);
            
            _aPoints.push(vCurPoint);
            
            if(vCurPoint.x < iMinX){
                iMinX = vCurPoint.x;
            }
            if(vCurPoint.x > iMaxX){
                iMaxX = vCurPoint.x;
            }
            if(vCurPoint.y < iMinY){
                iMinY = vCurPoint.y;
            }
            if(vCurPoint.y > iMaxY){
                iMaxY = vCurPoint.y;
            }
            
        }
        
        //_oContentContainer.rotation = -45
        
        
        //THE SHAPE HAVE NO BOUNDS, SO WE NEED TO SET MANUALLY
        oMap.setBounds(iMinX, iMinY, iMaxX-iMinX, iMaxY-iMinY);

        _oContentContainer.regX = oMap.getBounds().x + oMap.getBounds().width/2;
        _oContentContainer.regY = oMap.getBounds().y + oMap.getBounds().height/2;
        
        //console.log(_aPoints);
        
        this._setMapInRectView();
        
        //_oContentContainer.y = (-_rRectView.height/2 + (oMap.getBounds().height/2 +_iLineWidth/2)*_oContentContainer.scale)
        
        this._addIcon();
    };
    
    this._setMapInRectView = function(){
        var iMargin = 50;
        
        var iWidth = _rRectView.width-iMargin;
        var iHeight = _rRectView.height-iMargin;
       
        var iScale = inRectResize(_oContentContainer.getBounds(), iWidth, iHeight);

        _oContentContainer.scale = iScale;
    };
    
    this._addIcon = function(){
        var oLastPoint = _aPoints[_aPoints.length-1];
        
        var oSprite = s_oSpriteLibrary.getSprite('end_icon_map');
        var oIcon = createBitmap(oSprite);
        oIcon.regX = oSprite.width/2;
        oIcon.regY = oSprite.height/2;
        oIcon.x = oLastPoint.x;
        oIcon.y = oLastPoint.y;
        oIcon.rotation  = oLastPoint.angle;
        oIcon.scale = 2;
        _oIconContainer.addChild(oIcon);
    };
    
    this.addCursor = function(oCursor, oReference){
        _aListCursors.push({image: oCursor, owner: oReference})
        
        _oCursorContainer.addChild(oCursor);
    };
    
    this.setMapViewInfo = function(iX, iY, iScale, iRot){
        _oContentContainer.x = iX;
        _oContentContainer.y = iY;
        _oContentContainer.scale = iScale;
        _oContentContainer.rotation = iRot;
    };
    
    this.setLabel = function(szLabel){
        //_oLabelText.refreshText( szLabel );
    };
    
    this.setScale = function(iScale){
        _oContainer.scale = iScale;
    };
    
    this.update = function(){
       
        for(var i=0; i<_aListCursors.length; i++){
            var oCursorData = _aListCursors[i];
            var iSegmentIndex = oCursorData.owner.getPlayerSegment().index;
            var oPos = _aPoints[iSegmentIndex];
            oCursorData.image.x = oPos.x;
            oCursorData.image.y = oPos.y;
            oCursorData.image.rotation = oPos.angle;
        }
    };
    
    
    
    this._init();
};


