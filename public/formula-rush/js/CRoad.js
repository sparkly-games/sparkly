function CRoad(oRoadDrawingLevel, oElementContainer, iLevel, oRumbleDrawingLevel, oGrassDrawingLevel, oLaneDrawingLevel, oRumbleStrokeLevel){    
    var _iTrackLength;      // z length of entire track (computed)
    var _iCameraDepth;
    var _iAlphaDrawDistance;
    
    var _aSegments;         // array of road segments
    var _oLastVisibleSegment;
    
    var _aElementsToOrder;
    
    var _oZViewPosition;
    
    this._init = function(oRoadDrawingLevel, oElementContainer, iLevel){
        _iTrackLength = null;
        _iCameraDepth = CAMERA_DEPTH;
        //_iCameraDepth = 0.5;
        _iAlphaDrawDistance = DRAW_DISTANCE*0.5;
        //console.log(CAMERA_DEPTH)
        _aSegments = new Array();
        
        this.resetRoad();
    };

    this.findSegment = function(z) {
        //console.log(Math.floor(z/SEGMENT_LENGTH) % _aSegments.length)
        return _aSegments[Math.floor(z/SEGMENT_LENGTH) % _aSegments.length];
    };
   
    this.getLastVisibleSegment = function(){
        return _oLastVisibleSegment;
    };
   
    //=========================================================================
    // BUILD ROAD GEOMETRY
    //=========================================================================

    this.lastX = function(){
        return (_aSegments.length === 0) ? 0 : _aSegments[_aSegments.length-1].p2.world.x;
    };

    this.lastY = function() { 
        return (_aSegments.length === 0) ? 0 : _aSegments[_aSegments.length-1].p2.world.y; 
    };

    this.addSegment = function(curve, y) {
      var n = _aSegments.length;
      _aSegments.push({
         index: n,
            p1: { world: {x: this.lastX(), y: this.lastY(),  z:  n   *SEGMENT_LENGTH }, camera: {}, screen: {}, projectX:0 },
            p2: { world: {x: this.lastX() + curve , y: y,        z: (n+1)*SEGMENT_LENGTH }, camera: {}, screen: {}, projectX:0},
         curve: curve,
         elements: [],
         cars: [],
         enemy:[],
         color: Math.floor(n/RUMBLE_LENGTH)%2 ? COLORS.DARK : COLORS.LIGHT,
         color_alt: Math.floor(n/RUMBLE_LENGTH)%2 ? LEVEL_INFO[0].terrain.color_alt.dark : LEVEL_INFO[0].terrain.color_alt.light,
      });
    };

    this.addRoad = function(enter, hold, leave, curve, y) {
        var startY   = this.lastY();
        var endY     = startY + (Util.toInt(y, 0) * SEGMENT_LENGTH);
        var n, total = enter + hold + leave;

        for(n = 0 ; n < enter ; n++)
          this.addSegment(Util.easeIn(0, curve, n/enter), Util.easeInOut(startY, endY, n/total));
        for(n = 0 ; n < hold  ; n++)
          this.addSegment(curve, Util.easeInOut(startY, endY, (enter+n)/total));
        for(n = 0 ; n < leave ; n++)
          this.addSegment(Util.easeInOut(curve, 0, n/leave), Util.easeInOut(startY, endY, (enter+hold+n)/total));
    };

    this.addStraight = function(num) {
        num = num || ROAD.LENGTH.MEDIUM;
        this.addRoad(num, num, num, 0);
    };

    this.addHill = function(num, height) {
        num    = num    || ROAD.LENGTH.MEDIUM;
        height = height || ROAD.HILL.MEDIUM;
        this.addRoad(num, num, num, 0, height);
    };

    this.addCurve = function(num, curve, height) {
        num    = num    || ROAD.LENGTH.MEDIUM;
        curve  = curve  || ROAD.CURVE.MEDIUM;
        height = height || ROAD.HILL.NONE;
        this.addRoad(num, num, num, curve);
    };
    
    this.addStandardRoad = function(num, curve, height){
        num    = num    || ROAD.LENGTH.MEDIUM;
        curve  = curve  || ROAD.CURVE.NONE;
        height = height || ROAD.HILL.NONE;
        this.addRoad(num, num, num, curve, height);
    };
    
    this.addLowRollingHills = function(num, height) {
        num    = num    || ROAD.LENGTH.SHORT;
        height = height || ROAD.HILL.LOW;
        this.addRoad(num, num, num,  0,  height/2);
        this.addRoad(num, num, num,  0, -height);
        this.addRoad(num, num, num,  ROAD.CURVE.EASY,  height);
        this.addRoad(num, num, num,  0,  0);
        this.addRoad(num, num, num,  -ROAD.CURVE.EASY,  height/2);
        this.addRoad(num, num, num,  0,  0);        
    };
                            
    this.addSCurves = function(num, firstCurve, firstHill) {

        num    = num    || ROAD.LENGTH.MEDIUM;
        firstCurve  = firstCurve  || ROAD.CURVE.MEDIUM;
        firstHill = firstHill || ROAD.HILL.NONE;
        
        var iCurveDir;
        if(firstCurve >= 0){
            iCurveDir = 1;
        } else {
            iCurveDir = -1;
        }

        var iHillDir;
        if(firstHill >= 0){
            iHillDir = 1;
        } else {
            iHillDir = -1;
        }

        firstCurve = Math.abs(firstCurve);
        firstHill = Math.abs(firstHill);


        var iLightCurveParam;
        var iHeavyCurveParam;
        switch(firstCurve){
            case ROAD.CURVE.EASY:{
                    iLightCurveParam = ROAD.CURVE.NONE;
                    iHeavyCurveParam = ROAD.CURVE.EASY;
                    break;
            }
            case ROAD.CURVE.MEDIUM:{
                    iLightCurveParam = ROAD.CURVE.EASY;
                    iHeavyCurveParam = ROAD.CURVE.MEDIUM;
                    break;
            }
            case ROAD.CURVE.HARD:{
                    iLightCurveParam = ROAD.CURVE.MEDIUM;
                    iHeavyCurveParam = ROAD.CURVE.HARD;
                    break;
            }
        }
        
        var iLightHillParam;
        var iHeavyHillParam;
        switch(firstHill){
            case ROAD.HILL.EASY:{
                    iLightHillParam = ROAD.HILL.NONE;
                    iHeavyHillParam = ROAD.HILL.LOW;
                    break;
            }
            case ROAD.HILL.MEDIUM:{
                    iLightHillParam = ROAD.HILL.LOW;
                    iHeavyHillParam = ROAD.HILL.MEDIUM;
                    break;
            }
            case ROAD.HILL.HIGH:{
                    iLightHillParam = ROAD.HILL.MEDIUM;
                    iHeavyHillParam = ROAD.HILL.HIGH;
                    break;
            }
        }

        this.addRoad(num, num, num,   iCurveDir*iLightCurveParam,   ROAD.HILL.NONE);
        this.addRoad(num, num, num,   iCurveDir*iHeavyCurveParam,   iHillDir*iHeavyHillParam);
        this.addRoad(num, num, num,   iCurveDir*iLightCurveParam,   -iHillDir*iLightHillParam);
        this.addRoad(num, num, num,  -iCurveDir*iLightCurveParam,   iHillDir*iHeavyHillParam);
        this.addRoad(num, num, num,  -iCurveDir*iHeavyCurveParam,   -iHillDir*iLightHillParam);
    };

    this.addBumps = function(num, curve) {
        
        num    = num    || ROAD.LENGTH.SHORT/2;
        curve  = curve  || ROAD.CURVE.NONE;

        this.addRoad(num, num, num, 0,  num/2.5);
        this.addRoad(num, num, num, 0, -num/6.25);
        this.addRoad(num, num, num, curve, -num/2.5);
        this.addRoad(num, num, num, 0,  num/1,5625);
        this.addRoad(num, num, num, 0,  num/2.5);
        this.addRoad(num, num, num, -curve, -num/1.785);
        this.addRoad(num, num, num, 0,  num/2.5);
        this.addRoad(num, num, num, 0, -num/6.25);
    };

    this.addDownhillToEnd = function(num, curve) {
        num = num || 200;
        curve  = curve  || ROAD.CURVE.NONE;
        
        this.addRoad(num, num, num, curve, -Math.round(this.lastY()/SEGMENT_LENGTH));
    };

    this.resetRoad = function() {
        _aSegments = [];
        
        
        var oLevelInfo = ROAD_INFO[iLevel];
        
        for(var i=0; i<oLevelInfo.length; i++){
            
            var oRoadSegment = oLevelInfo[i];

            switch(oRoadSegment.roadtype){
                case ROAD.TYPE.STANDARD:{
                        this.addStandardRoad(oRoadSegment.length, oRoadSegment.curve, oRoadSegment.hill);
                        break;
                }
                case ROAD.TYPE.CURVE_S:{
                        this.addSCurves(oRoadSegment.length, oRoadSegment.curve, oRoadSegment.hill);
                        break;
                }
                case ROAD.TYPE.BUMPS:{
                        this.addBumps(oRoadSegment.length, oRoadSegment.curve);
                        break;
                }
                case ROAD.TYPE.FINAL:{
                        this.addDownhillToEnd(oRoadSegment.length, oRoadSegment.curve);
                        break;
                }
                
            }
        }
        
        
        _aSegments[this.findSegment(PLAYER_Z_FROMCAMERA).index + 2].color = COLORS.START;
        _aSegments[this.findSegment(PLAYER_Z_FROMCAMERA).index + 3].color = COLORS.START;
        
        //_aSegments[this.findSegment(PLAYER_Z_FROMCAMERA).index + 2].start = true;
        //_aSegments[this.findSegment(PLAYER_Z_FROMCAMERA).index + 3].start = true;
        
        //console.log(this.findSegment(PLAYER_Z_FROMCAMERA).index + 2)

        for(var n = 0 ; n < RUMBLE_LENGTH ; n++){
            _aSegments[_aSegments.length-1-n].color       = COLORS.FINISH;
            //_aSegments[_aSegments.length-1-n].end = true;
        }
      
          //console.log(_aSegments)

        _iTrackLength = _aSegments.length * SEGMENT_LENGTH;
        
        
        //console.log(copyObjectByValue(_aSegments))
    };
   
    this.setCameraDepth = function(iValue){
        _iCameraDepth = iValue;
    };
  
    this.update = function(oPlayerPos){
        oRoadDrawingLevel.graphics.clear();
        oRumbleDrawingLevel.graphics.clear();
        oGrassDrawingLevel.graphics.clear();
        oLaneDrawingLevel.graphics.clear();
        oRumbleStrokeLevel.graphics.clear();

        _oZViewPosition = oPlayerPos.z - PLAYER_Z_FROMCAMERA;
        var oXViewPosition = oPlayerPos.x;

        //THIS MODULE GET EVEN NEGATIVE NUMBERS
        _oZViewPosition = getModule(_oZViewPosition, _iTrackLength);//((_oZViewPosition % _iTrackLength) + _iTrackLength) % _iTrackLength;

        
        var baseSegment = this.findSegment(_oZViewPosition);
        var basePercent = Util.percentRemaining(_oZViewPosition, SEGMENT_LENGTH);
        //console.log(baseSegment)//1440
        
        var playerSegment = this.findSegment(_oZViewPosition+PLAYER_Z_FROMCAMERA);
        var playerPercent = Util.percentRemaining(_oZViewPosition+PLAYER_Z_FROMCAMERA, SEGMENT_LENGTH);
        //console.log(playerSegment)//1444
        var playerY       = Util.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);

        var maxy        = HEIGHT_ROTATION_VIEW;

        var x = 0;
        var dx = -(baseSegment.curve * basePercent);

        var n, segment;

        var xProject = oXViewPosition * ROAD_WIDTH;
        var yProject = playerY + CAMERA_HEIGHT;
        
        
        var fAngle = baseSegment.curve > 8 ? 8 : baseSegment.curve;
        var vGradientDir = rotateSimpleVector2D((fAngle/5) * -1, { x: 1, y: 0 });
        
        var iLightColor = LEVEL_INFO[iLevel].terrain.color.light.grass;
        var iDarkColor = LEVEL_INFO[iLevel].terrain.color.dark.grass;
        oGrassDrawingLevel.graphics.beginLinearGradientFill(
                            [iDarkColor,iLightColor, iLightColor, iLightColor, iDarkColor], 
                            [0.1, 0.4, 0.5, 0.6, 0.9], 
                            0, 0, CANVAS_WIDTH, vGradientDir.y*CANVAS_HEIGHT
                        );
        
        var iLightColor = LEVEL_INFO[iLevel].terrain.color.light.road;
        var iDarkColor = LEVEL_INFO[iLevel].terrain.color.dark.road;
        oRoadDrawingLevel.graphics.beginLinearGradientFill(
                            [iDarkColor,iLightColor, iLightColor, iLightColor, iDarkColor], 
                            [0.1, 0.4, 0.5, 0.6, 0.9], 
                            0, 0, CANVAS_WIDTH, vGradientDir.y*CANVAS_HEIGHT
                        );
                
        
                
        //var iRumbleColor = LEVEL_INFO[iLevel].terrain.color.dark.rumble;
        //oRumbleDrawingLevel.graphics.beginFill(iRumbleColor);
        //oRumbleDrawingLevel.graphics.setStrokeStyle(3);
        //oRumbleDrawingLevel.graphics.beginStroke("#fff");
        
        //var iLaneColor = LEVEL_INFO[iLevel].terrain.color.light.lane;
        //oLaneDrawingLevel.graphics.beginFill(iLaneColor);
        
        
        var iRumbleStrokeColor = LEVEL_INFO[iLevel].terrain.color.light.rumble;
        oRumbleStrokeLevel.graphics.setStrokeStyle(2);
        oRumbleStrokeLevel.graphics.beginStroke(iRumbleStrokeColor);
        
        
        _aElementsToOrder = new Array();
        
        for(n = 0 ; n < DRAW_DISTANCE ; n++) {
            var iIndex = (baseSegment.index + n) % _aSegments.length;
            
            segment        = _aSegments[iIndex];
            segment.looped = segment.index < baseSegment.index;
            segment.clip   = maxy;

            var zProject = _oZViewPosition - (segment.looped ? _iTrackLength : 0);

            var iXDifference = xProject - x;

            Util.project(segment.p1, iXDifference,        yProject, zProject, _iCameraDepth);
            Util.project(segment.p2, iXDifference - dx,   yProject, zProject, _iCameraDepth);

            x = x + dx;
            dx = dx + segment.curve;

            
            if (
                (segment.p1.camera.z <= _iCameraDepth) || // behind us
                (segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
                (segment.p2.screen.y >= maxy)// clip by (already rendered) segment
                        )          
              continue;
          
            var oPoints =  {
                x1: Math.round(segment.p1.screen.x),
                y1: Math.round(segment.p1.screen.y),
                w1: Math.round(segment.p1.screen.w),
                x2: Math.round(segment.p2.screen.x),
                y2: Math.round(segment.p2.screen.y),
                w2: Math.round(segment.p2.screen.w),
            }
              
            //////START/ENDING LANE
            if(segment.start || segment.end){
                Render.segment(oLaneDrawingLevel, WIDTH_ROTATION_VIEW, NUM_LANES,                           
                        oPoints.x1,
                        oPoints.y1,
                        oPoints.w1,
                        oPoints.x2,
                        oPoints.y2,
                        oPoints.w2,

                        segment.color);
            }
            

            Render.grass(oGrassDrawingLevel, WIDTH_ROTATION_VIEW, NUM_LANES,
                           oPoints.x1,
                           oPoints.y1,
                           oPoints.w1,
                           oPoints.x2,
                           oPoints.y2,
                           oPoints.w2,
                           //segment.color,
                           );
            
            Render.simpleSegment(oRoadDrawingLevel, WIDTH_ROTATION_VIEW, NUM_LANES,
                           oPoints.x1,
                           oPoints.y1,
                           oPoints.w1,
                           oPoints.x2,
                           oPoints.y2,
                           oPoints.w2,
                           //segment.color,
                           );
            
            if(s_oGame.rumbleCondition(segment)){
                Render.rumble(oRumbleDrawingLevel, WIDTH_ROTATION_VIEW, NUM_LANES,
                           oPoints.x1,
                           oPoints.y1,
                           oPoints.w1,
                           oPoints.x2,
                           oPoints.y2,
                           oPoints.w2,
                           segment.color,
                    );
            }else{
                Render.rumble(oRumbleDrawingLevel, WIDTH_ROTATION_VIEW, NUM_LANES,
                           oPoints.x1,
                           oPoints.y1,
                           oPoints.w1,
                           oPoints.x2,
                           oPoints.y2,
                           oPoints.w2,
                           segment.color_alt,
                    );
            }
                                
                    
                    /*
            Render.centralLane(oLaneDrawingLevel, WIDTH_ROTATION_VIEW, NUM_LANES,
                           oPoints.x1,
                           oPoints.y1,
                           oPoints.w1,
                           oPoints.x2,
                           oPoints.y2,
                           oPoints.w2,
                           segment.color,
            );
                            */
                 
            Render.stroke(oRumbleStrokeLevel, WIDTH_ROTATION_VIEW, NUM_LANES,
                           oPoints.x1,
                           oPoints.y1,
                           oPoints.w1,
                           oPoints.x2,
                           oPoints.y2,
                           oPoints.w2,
                           segment.color,
                    );
            
                           
            maxy = segment.p2.screen.y;
        }

        var car;
        var sprite;
        var spriteScale;
        var spriteX;
        var spriteY;

        
        var iDepth = 0;
        var iAlphaDistance = 1;
        
        
        for(n = (DRAW_DISTANCE-1) ; n > 0 ; n--) {
            segment = _aSegments[(baseSegment.index + n) % _aSegments.length];           
            
            
            iAlphaDistance = linearFunction(n, DRAW_DISTANCE, _iAlphaDrawDistance, 0, 1);
            
            //////////////////RENDER CARS
            for(var i = 0 ; i < segment.cars.length ; i++) {
                car         = segment.cars[i];

                var iRelativeZ = car.getZ() - _oZViewPosition;
                var iRelativeXPos = car.getOffset() - oXViewPosition;
                
                if(iRelativeZ > CAR_FARVIEW_OFFSET){
                    if(segment.curve > -CAR_CURVEVIEW_OFFSET && segment.curve < CAR_CURVEVIEW_OFFSET){
                        car.setDirection(CAR_CENTER);
                    } else if(segment.curve < CAR_CURVEVIEW_OFFSET){
                        car.setDirection(CAR_LEFT);
                    } else {
                        car.setDirection(CAR_RIGHT);
                    }
                } else {
                    if(iRelativeXPos > -CAR_SIDEVIEW_OFFSET && car.getOffset() - oXViewPosition < CAR_SIDEVIEW_OFFSET){
                        car.setDirection(CAR_CENTER);
                    } else if (iRelativeXPos < -CAR_SIDEVIEW_OFFSET){
                        car.setDirection(CAR_RIGHT);
                    } else {
                        car.setDirection(CAR_LEFT);
                    }
                }
                        

                sprite      = car.getSprite();
                spriteScale = Util.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.getPercent());
                spriteX     = Util.interpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.getPercent()) + (spriteScale * car.getOffset() * ROAD_PER_HALF_CANVAS_WIDTH);
                spriteY     = Util.interpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.getPercent());

                car.setVisible(true);
                //oElementContainer.setChildIndex(car.getCar(), iDepth++);
                this._addToDepthArray(car, spriteScale);
                
                
                var iProportion = spriteScale * ROAD_PER_SCALE_PER_HALF_CANVAS_WIDTH_ANIMATED
                Render.sprite(sprite, car.getContainer(), iProportion, spriteX, spriteY, -0.5, -1, segment.clip);
            }
            
            //////////////////RENDER ENEMY
            var enemy;
            for(var i = 0 ; i < segment.enemy.length ; i++) {
                enemy         = segment.enemy[i];

                var spriteBounds      = enemy.getSpriteBounds();
                
                /*
                CRoad.js:463 132--> diff:176.42288231933912 ## spriteY:1210.149484421695  %0.31970424635708694
                CRoad.js:463 132--> diff:221.1656696670393 ## spriteY:1221.3496630146697  %0.6586872972045421
                CRoad.js:463 132--> diff:285.1494467511818 ## spriteY:1214.3942367682607  %0.9976703480519973
                */
                
                var iHeight = Util.interpolate(segment.p1.world.y,     segment.p2.world.y,     enemy.getPercent());
                var iRoadXPosition = enemy.getOffset() * ROAD_WIDTH;
                
                ///THE ROAD CURVES AREN'T DRAWN BY THEIR X POSITION, BUT BY THE CURVE VALUE EVERY TIME, SO WE HAVE TO GET THE X PROJECTION EVERYTIME
                var iProjectX = Util.interpolate(segment.p1.projectX,     segment.p2.projectX,     enemy.getPercent());

                var p = {x: iRoadXPosition, y:iHeight, z:enemy.getZ()};

                ///zProject NEED TO BE RECALCULATED
                var zProject = _oZViewPosition - (segment.looped ? _iTrackLength : 0);
                var coord = Util.get3dto2dCoord(p, iProjectX, yProject, zProject, _iCameraDepth);

                spriteScale = coord.scale;
                spriteX = coord.x;
                spriteY = coord.y;

                //console.log(p, iProjectX, yProject, zProject, _iCameraDepth)

                //spriteScale = Util.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, enemy.getPercent());
                //spriteX     = Util.interpolate(segment.p1.screen.x,     segment.p2.screen.x,     enemy.getPercent()) + (spriteScale * enemy.getOffset() * ROAD_PER_HALF_CANVAS_WIDTH);
                //spriteY     = Util.interpolate(segment.p1.screen.y,     segment.p2.screen.y,     enemy.getPercent());

                enemy.setVisible(true);
                
                enemy.setAlpha( iAlphaDistance );
                
                //oElementContainer.setChildIndex(enemy.getContainer(), iDepth++);
                this._addToDepthArray(enemy, spriteScale);
                //Render.sprite(sprite, enemy.getElement(), spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
                
                var iProportion = spriteScale * ROAD_PER_SCALE_PER_HALF_CANVAS_WIDTH_ANIMATED;
                Render.spriteWithMask(spriteBounds, enemy.getContainer(), iProportion, spriteX, spriteY, -0.5, -1, segment.clip, enemy.getMask());
                
            }

            
            //////////////////RENDER ELEMENTS OLD STYLE    
            /*
            for(var i = 0 ; i < segment.elements.length ; i++) {
                //return;
                sprite      = segment.elements[i];
                spriteScale = segment.p1.screen.scale;
                spriteX     = segment.p1.screen.x + (spriteScale * sprite.offset * ROAD_PER_HALF_CANVAS_WIDTH);
                spriteY     = segment.p1.screen.y//599

                sprite.source.alpha = iAlphaDistance;

                sprite.source.visible= true;
                oElementContainer.setChildIndex(sprite.source, iDepth++);

                //console.log(sprite);

                Render.sprite(sprite.bounds, sprite.source, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip);
            }
            */
           
           
            //////////////////RENDER ELEMENTS
            for(var i = 0 ; i < segment.elements.length ; i++) {
                sprite      = segment.elements[i].source;
                
                var spriteBounds      = sprite.getContainer().getBounds();
                
                spriteScale = segment.p1.screen.scale;
                spriteX     = segment.p1.screen.x + (spriteScale * sprite.getOffset() * ROAD_PER_HALF_CANVAS_WIDTH);
                spriteY     = segment.p1.screen.y;
                
                sprite.setVisible(true);
                //sprite.setAlpha( 1 );
                sprite.setAlpha( iAlphaDistance );
                
                //oElementContainer.setChildIndex(sprite.getContainer(), iDepth++);
                this._addToDepthArray(sprite, spriteScale);
                var iProportion = spriteScale * ROAD_PER_SCALE_PER_HALF_CANVAS_WIDTH;
                Render.spriteWithMask(spriteBounds, sprite.getContainer(), iProportion, spriteX, spriteY, 0, -1, segment.clip, sprite.getMask());
            }
            
        }

        this._addToDepthArray(s_oGame.getPlayer(), /*PLAYER_DEPTH_SWAP*/0.0008);

        //SORT OBJECT IN ELEMENTS CONTAINER
        this.sortElementsDepth();
        
        //CLEAN SPRITES BEHIND
        this.clearElementsBehind(baseSegment);
        
    };
   
    this._addToDepthArray = function(oElement, iZScale){
        ///THE iZScale, WORKS AS DEPTH
            //0.0011

        _aElementsToOrder.push({obj:oElement, depth:iZScale});
    };
   
    this.sortElementsDepth = function(){
        _aElementsToOrder.sort(this._sortDepthFunction);

        for(var i=0; i<_aElementsToOrder.length; i++){
            var oContainer = _aElementsToOrder[i].obj.getContainer();
            var iDepth = _aElementsToOrder[i].depth;
            
            oElementContainer.setChildIndex(oContainer, i);
            
            if(iDepth>PLAYER_DEPTH_SWAP){
                oContainer.alpha = linearFunction(iDepth, PLAYER_DEPTH_SWAP, DEPTH_DISTANCE_TO_FADE_ELEMENTS, 1, 0);
            }
        }
    };
   
    this._sortDepthFunction = function(obj1, obj2){
        if (obj1.depth > obj2.depth) { return 1; }
        if (obj1.depth < obj2.depth) { return -1; }
        return 0;
    };
   
    this.clearElementsBehind = function(oStartSegment){
        var iLookBehind = 25;
        var iStartIndex = (oStartSegment.index - iLookBehind) % _aSegments.length;
        if(iStartIndex>0){
            this.clearElementsInSegments(iStartIndex, iStartIndex+iLookBehind);
        }else {
            ////END OF TRACK
            var iNewStartIndex = _aSegments.length + iStartIndex -1;
            this.clearElementsInSegments(iNewStartIndex, _aSegments.length);
        }
    };
   
    this.clearElementsInSegments = function(iStartSegmentIndex, iEndSegmentIndex){
        var segment, sprite, car, enemy;
        
        for(var j=iStartSegmentIndex; j<iEndSegmentIndex; j++){
            segment = _aSegments[j];
            /*
            for(var i = 0 ; i < segment.sprites.length ; i++) {
                sprite      = segment.sprites[i];
                sprite.source.visible= false;
            }
            */
            ///////
            
            for(var i = 0 ; i < segment.elements.length ; i++) {
                /*
                sprite      = segment.elements[i];
                sprite.source.visible= false;
                */
                
                sprite      = segment.elements[i].source;
                sprite.setVisible( false );
                
            }
            ///////
            for(var i = 0 ; i < segment.cars.length ; i++) {
                car      = segment.cars[i];
                car.setVisible(false);
            }
            for(var i = 0 ; i < segment.enemy.length ; i++) {
                enemy      = segment.enemy[i];
                enemy.setVisible(false);
            }
        }
    };
   
    this.exponentialFog =   function(distance, density) {
        return 1 / (Math.pow(Math.E, (distance * distance * density))); 
    };
   
    this.getTrackLength = function(){
        return _iTrackLength;
    };
   
    this.getSegments = function(){
        return _aSegments;
    };
   
    
   
    this._init(oRoadDrawingLevel, oElementContainer, iLevel);
}


