function CLevelBuilder(oPlayer, aCars, aEnemy, oElementContainer, iLevel){
    
    var _iTotalCars;
    var _iCurLeftSegment;
    var _iCurRightSegment;

    this._init = function(oPlayer, aCars, aEnemy, oElementContainer, iLevel){
        _iTotalCars = LEVEL_INFO[iLevel].num_cars; // total number of cars on the road ///100
        
        _iCurLeftSegment = 0;
        _iCurRightSegment = 0;
        
        this._initTerrainInfo();
        //this._initFinishLane();
        this._initSprites();
        this._initCars();
        //this._initEnemy();
        
        //this._initElements();
        
    };
    
    this._attachSprites = function(){
        for(var i=0; i<s_oGame.getSegments().length; i++){
            var aElements = s_oGame.getSegments()[i].elements;
            for(var j=0; j<aElements.length; j++){
                oElementContainer.addChildAt(aElements[j].source,0);
            }
        };
    };

    this._addSprite = function(n, oDataElement, offset) {
        if(s_oGame.getSegments()[n] === undefined){
            return;
        }

        var iType = oDataElement.type || ELEMENT_TYPE_STATIC;

        switch(iType){
            case ELEMENT_TYPE_STATIC:{
                    var oElement = new CElementStatic(oDataElement, offset, n, oElementContainer);
                    
                    break;
            }
            case ELEMENT_TYPE_ANIMATED:{
                    var oElement = new CElementAnimated(oDataElement, offset, n, oElementContainer);
                    oElement.stopAnim();

                    break;
            }
            case ELEMENT_TYPE_LIGHT:{
                    var oElement = new CElementLight(oDataElement, offset, n, oElementContainer);

                    break;
            }
        }

        s_oGame.getSegments()[n].elements.push({source: oElement, offset: offset, bounds:oElement.getContainer().getBounds(), name:oDataElement.name/*, class: oElement*/});
        
    };

    this._addDensityElements = function(iSide, oSprite, iStartSegment, iFinalSegment, iPosition, iOccurrence, iRepetition){

        iOccurrence = iOccurrence || 100;
        iRepetition = iRepetition || 1;

        if(iSide === AMBIENT.SIDE.BOTH){
            /// RECURSIVE
            this._addDensityElements(AMBIENT.SIDE.RIGHT, oSprite, iStartSegment, iFinalSegment, iPosition, iOccurrence, iRepetition);
            this._addDensityElements(AMBIENT.SIDE.LEFT, oSprite, iStartSegment, iFinalSegment, iPosition, iOccurrence, iRepetition);
            
        } else {
            for(var i=iStartSegment; i<=iFinalSegment; i+=iRepetition){
                if(Math.random()*100 <= iOccurrence){
                    var iYPosition = i + Util.randomInt(0,5);
                    var iXPosition = iSide + iSide*iPosition  + iSide*(Math.random() * 2);
                    this._addSprite(iYPosition, oSprite, iXPosition);
                }
            }
        }
    };

    this._addPreciseElements = function(iSide, oSprite, iStartSegment, iFinalSegment, iPosition, iOccurrence, iRepetition){
        iOccurrence = iOccurrence || 100;
        iRepetition = iRepetition || 1;


        if(iSide === AMBIENT.SIDE.BOTH){
            /// RECURSIVE
            this._addPreciseElements(AMBIENT.SIDE.RIGHT, oSprite, iStartSegment, iFinalSegment, iPosition, iOccurrence, iRepetition);
            this._addPreciseElements(AMBIENT.SIDE.LEFT, oSprite, iStartSegment, iFinalSegment, iPosition, iOccurrence, iRepetition);

        } else {
            for(var i=iStartSegment; i<=iFinalSegment; i+=iRepetition){
                if(Math.random()*100 <= iOccurrence){
                    var iYPosition = i;
                    var iXPosition = iSide + iSide*iPosition;
                    if(iSide === AMBIENT.SIDE.CENTER){
                        var iXPosition = iPosition;
                    }
                    this._addSprite(iYPosition, oSprite, iXPosition);
                }
            }
        } 



        
    };

    this._initSprites = function() {
        var n, i;

        var oLevelInfo = AMBIENT_INFO[iLevel];
        
        for(var i=0; i<oLevelInfo.length; i++){
            
            var oAmbientArea = oLevelInfo[i];
            
            switch(oAmbientArea.type){
                case AMBIENT.TYPE.FILL_TRACK:{
                        this._processFillTrack(oAmbientArea);
                        break;
                }
                case AMBIENT.TYPE.FILL_CURVE:{
                        this._processFillCurve(oAmbientArea);
                        break;
                }
                case AMBIENT.TYPE.FINISH:{
                        this._initFinishLane(oAmbientArea);
                        break;
                }
                case AMBIENT.TYPE.ANIMATION:{
                        this._initAnimationGroup(oAmbientArea);
                        break;
                }
                default:{
                        this._processNormalType(oAmbientArea);
                        break;
                }
            }
            
        }
    };
    
    this._initAnimationGroup = function(oAmbientArea){
        console.log(oAmbientArea)
        
        ///CREATE ELEMENTS
        this._processNormalType(oAmbientArea);
        
        ///PICK CREATED ELEMENTS
        var oProperty = this._getAnimationProperty(oAmbientArea);

        ///APPLY ANIMATION PROPERTY
        this._applyAnimationEffects(oAmbientArea, oProperty);
        
    };
    
    this._getAnimationProperty = function(oAmbientArea, ){
        var oRange = this._getSegmentRange(oAmbientArea.segments);
        var iStartSegment = oRange.start;
        var iFinalSegment = oRange.end;
        
        var aSegments = s_oGame.getSegments();
        
        var aAnimGroup = new Array();
        for(var i=iStartSegment; i<=iFinalSegment; i++){
            var aElements = aSegments[i].elements;
            for(var j=0; j<aElements.length; j++){
                var oElement = aElements[j];
                if(oElement.name === oAmbientArea.sprite.name){
                    aAnimGroup.push(oElement);
                    //oElement.source.stopAnim();
                }
            }
        }
        
        ///SET DEFAULT ANIMATION PROPERTY TO GROUP
        //console.log(oAmbientArea.animate)
        var aIndexToAnimate = new Array();
        for(var i=0; i<aAnimGroup.length; i++){
            aIndexToAnimate.push(i);
        }
        var oEffect = ANIMATE_GROUP.EFFECT.NONE;
        
        ///GET USER ANIMATION PROPERTY
        if(oAmbientArea.animate !== undefined){
            switch(oAmbientArea.animate.index){
                case ANIMATE_GROUP.QTY.ALL:{
                        break;
                }
                case ANIMATE_GROUP.QTY.RANDOM:{
                        var iRandomStrength = 0.5;
                        if(oAmbientArea.animate.random_strenght!== undefined){
                            iRandomStrength = oAmbientArea.animate.random_strenght;
                        }
                        for(var i=0; i<aIndexToAnimate.length; i++){
                            if(Math.random()>iRandomStrength){
                                aIndexToAnimate.splice(i,1);
                                i--;
                            }
                        }
                        break;
                }
                default :{
                        ///DECIDE IN SETTINGS NUMBER OF INDEX TO ANIMATE
                        aIndexToAnimate = oAmbientArea.animate.index;
                        break;
                }
            }

            if(oAmbientArea.animate.effect !== undefined){
                oEffect = oAmbientArea.animate.effect;
            }
            
        }
        
        var aAnimatedElements = new Array();
        for(var i=0; i<aIndexToAnimate.length; i++){
            var iIndex = aIndexToAnimate[i];
            aAnimatedElements.push(aAnimGroup[iIndex]);
        }
        
        var oProperty = {elements_to_animate:aAnimatedElements, effect: oEffect};
        
        return oProperty;
    };
    
    this._applyAnimationEffects = function(oAmbientArea, oProperty){
        var aAnimatedElements = oProperty.elements_to_animate;
        var oEffect = oProperty.effect;
        
        switch (oAmbientArea.sprite.type){
            case ELEMENT_TYPE_ANIMATED:{
                    var oSpriteSheet = s_aSpriteSheetElements[oAmbientArea.sprite.name];
                    for(var i=0; i<aAnimatedElements.length; i++){
                        var iFrame = 0;
                        if(oEffect === ANIMATE_GROUP.EFFECT.RANDOM){
                            iFrame = Math.floor( Math.random()*oSpriteSheet.getNumFrames("anim")  );
                        }
                        aAnimatedElements[i].source.playAtFrame(iFrame);
                    }
                    break;
            }
            case ELEMENT_TYPE_LIGHT:{
                    switch(oEffect){
                        case ANIMATE_GROUP.EFFECT.LIGHT_BROKEN:{
                                for(var i=0; i<aAnimatedElements.length; i++){
                                    aAnimatedElements[i].source.brokenInterval(200);
                                }
                                break;
                        }
                        case ANIMATE_GROUP.EFFECT.LIGHT_REGULAR:{
                                for(var i=0; i<aAnimatedElements.length; i++){
                                    aAnimatedElements[i].source.regularInterval(600);
                                }
                                break;
                        }
                        case ANIMATE_GROUP.EFFECT.WATERFALL:{
                                var iDelay = 0;
                                var iInterval = 300;
                                var iEndWait = iInterval*aAnimatedElements.length;
                                var iSpeed = 2800;
                                console.log(aAnimatedElements.length)
                                for(var i=0; i<aAnimatedElements.length; i++){
                                    var oElement = aAnimatedElements[i].source;
                                    oElement.intensity(0);
                                    
                                    iDelay = i*iInterval;
                                    
                                    oElement.lit(iDelay,iInterval,iEndWait,iSpeed);
                                    
                                }
                                break;
                        }
                    }
                    

                    break;
            }
        }
        
    };
    
    this._processFillTrack = function(oAmbientArea){
        var aSegments = s_oGame.getSegments();

        var iOccurrence = oAmbientArea.repetitionevery;

        var szDisposition = AMBIENT.DISPOSITION.DENSITY;

        if(oAmbientArea.disposition !== undefined){
            szDisposition = oAmbientArea.disposition;
        }
        
        var szSide = AMBIENT.SIDE.BOTH;
        if(oAmbientArea.side !== undefined){
            szSide = oAmbientArea.side;
        }
        
        var szSprite = oAmbientArea.sprite;
        
        
        if(szDisposition === AMBIENT.DISPOSITION.DENSITY){
            this._addDensityElements(szSide, szSprite, 0, aSegments.length, oAmbientArea.position, oAmbientArea.occurrence, oAmbientArea.repetitionevery);
        }else{
            this._addPreciseElements(szSide, szSprite, 0, aSegments.length, oAmbientArea.position, oAmbientArea.occurrence, oAmbientArea.repetitionevery);
        };
    };
    
    this._processFillCurve = function(oAmbientArea){
        var aSegments = s_oGame.getSegments();

        var iOccurrence = oAmbientArea.repetitionevery;

        for(var i=0; i<aSegments.length; i++){
            var iCurve = aSegments[i].curve;
            
            if(iCurve < 0){
                iOccurrence--;
                if(iOccurrence<=0){
                    iOccurrence = oAmbientArea.repetitionevery;
                    var szLeftSprite = oAmbientArea.sprite[0];
                    this._addPreciseElements(AMBIENT.SIDE.RIGHT, szLeftSprite, i, i, oAmbientArea.position, oAmbientArea.occurrence, oAmbientArea.repetitionevery);
                }
                
            }else if(iCurve > 0){
                iOccurrence--;
                if(iOccurrence<=0){
                    iOccurrence = oAmbientArea.repetitionevery;
                    var szRightSprite = oAmbientArea.sprite[1];
                    this._addPreciseElements(AMBIENT.SIDE.LEFT, szRightSprite, i, i, oAmbientArea.position, oAmbientArea.occurrence, oAmbientArea.repetitionevery);
                }
            } else {
                iOccurrence = oAmbientArea.repetitionevery;
            }
        };
    };
    
    this._processNormalType = function(oAmbientArea){
        var oRange = this._getSegmentRange(oAmbientArea.segments);
        var iStartSegment = oRange.start;
        var iFinalSegment = oRange.end;

        switch(oAmbientArea.disposition){
            case AMBIENT.DISPOSITION.PRECISE:{
                    this._addPreciseElements(oAmbientArea.side, oAmbientArea.sprite, iStartSegment, iFinalSegment, oAmbientArea.position, oAmbientArea.occurrence, oAmbientArea.repetitionevery);

                    break;
            }
            case AMBIENT.DISPOSITION.DENSITY:{
                    this._addDensityElements(oAmbientArea.side, oAmbientArea.sprite, iStartSegment, iFinalSegment, oAmbientArea.position, oAmbientArea.occurrence, oAmbientArea.repetitionevery);

                    break;
            }
        }
    };
    
    
    this._getSegmentRange = function(oData){
        var iStartSegment;
        var iFinalSegment;
        if(oData.constructor === Array){
            iStartSegment = oData[0];
            iFinalSegment = oData[1];
        } else {
            iStartSegment = oData;
            iFinalSegment = oData;
        }
        
        return {start: iStartSegment, end: iFinalSegment};
    };
    
    this._initFinishLane = function(oAmbientArea){      
        var iIndex = s_oGame.getSegments().length-1;

        this._addSprite(iIndex, oAmbientArea.sprite, 0);
    };

    this._initCars = function() {
        var n, car, segment, offset, z, sprite, speed;
        for (var n = 0 ; n < _iTotalCars ; n++) {
            offset = Math.random() * Util.randomChoice([-0.8, 0.8]);
            z      = Math.floor(Math.random() * s_oGame.getSegments().length) * SEGMENT_LENGTH;

            sprite = Util.randomChoice(SPRITES.CARS);
            speed  = oPlayer.getMaxSpeed()/4 + Math.random() * oPlayer.getMaxSpeed()/(sprite == SPRITES.SEMI ? 4 : 2);

            var oCar = new CCar(sprite, offset, z, speed, oElementContainer);

            segment = s_oGame.findSegment(z);
            segment.cars.push(oCar);
            aCars.push(oCar);
        }        
    };
    
    this._initEnemy = function() {
        var n, car, segment, offset, z, sprite, speed;
        for (var n = 0 ; n < _iTotalCars ; n++) {
            offset = Math.random() * Util.randomChoice([-0.8, 0.8]);
            z      = Math.floor(Math.random() * s_oGame.getSegments().length) * SEGMENT_LENGTH;

            sprite = Util.randomChoice(SPRITES.CARS);
            speed  = oPlayer.getMaxSpeed()/4 + Math.random() * oPlayer.getMaxSpeed()/(/*sprite == SPRITES.SEMI ? 4 : 2*/8);

            var oEnemy = new COpponent(sprite, offset, z, speed, oElementContainer);

            segment = s_oGame.findSegment(z);
            segment.enemy.push(oEnemy);
            aEnemy.push(oEnemy);
        }        
    };
    
    
    
    this._initTerrainInfo = function(){
        
        COLORS.LIGHT.road = LEVEL_INFO[iLevel].terrain.color.light.road;
        COLORS.LIGHT.grass = LEVEL_INFO[iLevel].terrain.color.light.grass;
        COLORS.LIGHT.rumble = LEVEL_INFO[iLevel].terrain.color.light.rumble;
        COLORS.LIGHT.lane = LEVEL_INFO[iLevel].terrain.color.light.lane;
        
        COLORS.DARK.road = LEVEL_INFO[iLevel].terrain.color.dark.road;
        COLORS.DARK.grass = LEVEL_INFO[iLevel].terrain.color.dark.grass;
        COLORS.DARK.rumble = LEVEL_INFO[iLevel].terrain.color.dark.rumble;
        
        
        TERRAIN_ADHERENCE = LEVEL_INFO[iLevel].terrain.adherence;
        TERRAIN_MAX_INERTIA = LEVEL_INFO[iLevel].terrain.max_inertia;
        
        NUM_LANES = LEVEL_INFO[iLevel].terrain.num_lanes;
        
        ROAD_BOUNDS = LEVEL_INFO[iLevel].terrain.roadbounds;
    };
    
    this._init(oPlayer, aCars, aEnemy, oElementContainer, iLevel);
}


