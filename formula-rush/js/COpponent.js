function COpponent(iType, iOffset, iZ, iSpeed, oElementContainer, iIndex){
    
    var _iXOffset;
    var _iZ;
    var _iSpeed;
    var _iPercent;
    var _iIndex;
    var _iLife;
    var _iDamagePower;
    
    var _iRelativeX;

    var _oParent;
    var _oEnemy;

    var _oMask;
    var _oEnemySprite;
    var _oBounds;
    
    var _iCorneringStage;
    var _iState;
    var _bCanBeRemoved;


    var _oCurSegment;

    var _aCbCompleted;
    var _aCbOwner;

    var _iMaxSpeed;
    var _iMinSpeed;
    var _iAccelerationRate;

    var _iBrakingRate;
    var _iDecelerationRate;

    var _iAccelerationRef;
   
    var _szRunState;
    
    var _iAccelerationRate;
    
    var _iSkillLevel;
    
    var _oShadow;
    var _oRankIndicator;
    var _iRank;
    
    var _iCurLap;
    var _bStartSprint;
    
    this._init = function(iType, iOffset, iZ, iSpeed, oElementContainer, iIndex){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _iXOffset = iOffset;
        _iZ = iZ;
        _iIndex = iIndex;
        _iRank = iIndex+1;
        _iSpeed = 0;
        _iCurLap = 0;
        _iRelativeX = 0;
        _iCorneringStage = 0;
        _iState = STATE_RUNNER_RUN;
        
        _bStartSprint = true;
        _bCanBeRemoved = false;


        _szRunState = OPPONENT_RUN_STATE_ACCELERATE;

        var iYOffset = 0;


        var szTag = s_aFileName[iType];
        //console.log(szTag)
        var oRefSprite = s_oSpriteLibrary.getSprite(szTag+"_0");
        
        _oBounds = {x:0,y:0,width:oRefSprite.width, height:oRefSprite.height}; ///709 is the height of the tallest anim (death)

        _oEnemy = new createjs.Container();
        //_oEnemy.x = 500;
        _oEnemy.visible = false;
        oElementContainer.addChild(_oEnemy);

        _oShadow = new CCarShadow(_oBounds.width/2,_oBounds.height + iYOffset,_oEnemy);
        _oShadow.setFrame("center");
       
        _oEnemySprite = createSprite(s_aSpriteSheetCharacters[iType], "center",0,0,0,0);
        _oEnemySprite.x = _oBounds.width/2;
        _oEnemySprite.y = _oBounds.height + iYOffset; 
        _oEnemy.addChild(_oEnemySprite);

        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(_oBounds.x, _oBounds.y, _oBounds.width, _oBounds.height);

        _oEnemySprite.mask = _oMask;

        var iTextX = _oBounds.width/2// - iWidth/2
        _oRankIndicator = new CRankIndicator(iTextX, -50, _oEnemy, 200);
        _oRankIndicator.refreshRank(_iRank);

        this.moveOnSegment();
    };
    
    this.unload = function(){
        oElementContainer.removeChild(_oEnemy);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.setDifficultyParams = function(iSkillLevel){
        _iSkillLevel = iSkillLevel;
        
        var iMaxSpeedRef = percentScale(PLAYER_MAX_SPEED,85);
        var iMinSpeedRef = percentScale(PLAYER_MAX_SPEED,70);

        var iBestSkill = 10;
        var iValue = iBestSkill - iSkillLevel;
        var iNegativePercent = 100 - iValue;
        var iNegativeSquarePerc = 100 - iValue*2;
        var iPositivePercent = 100 + iValue;
        var iPositiveSquarePercent = 100 + iValue*2;

        _iMaxSpeed = percentScale(iMaxSpeedRef,iNegativePercent);              
        _iMinSpeed = percentScale(iMinSpeedRef,iNegativeSquarePerc);            
        //_iAccelerationRate = percentScale(PLAYER_ACCELERATION,iNegativePercent);   
        _iAccelerationRef = percentScale(PLAYER_ACCELERATION,iNegativeSquarePerc);
        _iBrakingRate = percentScale(-PLAYER_BRAKING_RATE,iPositiveSquarePercent);         //LESS IS FASTER
        _iDecelerationRate = percentScale(-PLAYER_DECELERATION,iPositivePercent);    //LESS IS FASTER
        
        
        
        
        /*
        console.log("MAX_speed_ref:"+iMaxSpeedRef)
        console.log("min_speed_ref:"+iMinSpeedRef)
        console.log("accel_ref:"+PLAYER_ACCELERATION)
        console.log("brake_ref:"+-PLAYER_BRAKING_RATE)
        console.log("decel_ref:"+-PLAYER_DECELERATION)
        console.log("##############")
        console.log(_iMaxSpeed)
        console.log(_iMinSpeed)
        console.log(_iAccelerationRef)
        console.log(_iBrakingRate)
        console.log(_iDecelerationRate)
        
        console.log("=======================")
        */
    };
    
    this.getContainer = function(){
        return _oEnemy;
    };
    
    this.getSpriteBounds = function(){
        return _oBounds;
    };
    
    this.getOffset = function(){
        return _iXOffset;
    };
    
    this.getZ = function(){
        return _iZ;
    };
    
    this.getRunDistance = function(){
        return _iZ + (_iCurLap-1)*TRACK_LENGTH;
    };
    
    this.getSpeed = function(){
        return _iSpeed;
    };
    
    this.getPercent = function(){
        return _iPercent;
    };
    
    this.getMask = function(){
        return _oMask;
    };
    
    this.getState = function(){
        return _iState;
    };
    
    this.getIndex = function(){
        return _iIndex;
    };
    
    this.getCurLife = function(){
        return _iLife;
    };
    
    this.getDamagePower = function(){
        return _iDamagePower;
    };
    
    this.canBeRemoved = function(){
        return _bCanBeRemoved;
    };
    
    this.setRank = function(iNewRank){
        if(_iRank !== iNewRank){
            _iRank = iNewRank;
            _oRankIndicator.refreshRank(_iRank);
        }
    };
    
    this.getRank = function(){
        return _iRank;
    };
    
    this.setPosition = function(iZ){
        _iZ = iZ;
    };
    
    this.setXOffset = function(iX){
        _iXOffset = iX;
    };
    
    this.setVisible = function(bVal){
        _oEnemy.visible = bVal;
    };
    
    this.setAlpha = function(iAlpha){
        _oEnemy.alpha = iAlpha;
    };
    
    

    this.getSkillLevel = function(){
        return _iSkillLevel;
    };

    
   
    this._setDirectionFromCornering = function(){
        var szSide = this._getSideFromCornering();
        _oShadow.setFrame(szSide)
        _oEnemySprite.gotoAndStop(szSide);
        //console.log(szSide)
        //_oWheel.playAnim(szSide);
    };

    this._calculateCornering = function(){
        var iNewRelativeX = s_oGame.getRelativeEnemyPosToPlayer(this);
        var oPlayer = s_oGame.getPlayer();

        var iCornering;

        
        if(iNewRelativeX !== _iRelativeX){
            ///ENEMY MOVED 
            //PROBABLY THE RANGE NEEDS TO BE LIMITED
            
            iCornering = linearFunction(_iRelativeX,-1,1, 4, -4);
        }else{
            //ENEMY IN CURVE (COMPUTED ONLY AFTER IS MOVING)
            iCornering = linearFunction(_oCurSegment.curve,ROAD.CURVE.VERYHARD,-ROAD.CURVE.VERYHARD, 4, -4);
        }
        
        var iNewCorneringStage = Math.round(iCornering);
        
        return iNewCorneringStage;
    };

    this._getSideFromCornering = function(){
        var szSide = "center";
        if(_iCorneringStage>0){
            var iIndex = _iCorneringStage-1;
             szSide = "right_"+iIndex;
        }else if(_iCorneringStage<0){
            var iIndex = -_iCorneringStage-1;
            szSide = "left_"+iIndex;
        }
        
        return szSide;
    };
    
    
    
    this._updateXOffset = function(oEnemySegment, oPlayer) {
        var i, j, dir, segment, otherEnemy, otherEnemyW; 
        var enemyW = _oParent.getSpriteBounds().width * SPRITES.ANIMATED.SCALE;
        var otherCar, otherCarW;
        
        var aSegments = s_oGame.getSegments();

        if ((oEnemySegment.index - oPlayer.getPlayerSegment().index) > DRAW_DISTANCE){
              //////SET VISIBLE TO FALSE, PREVENT TO SEE ENEMY IF ARE NOT IN SIGHT VIEW. 
              _oEnemy.visible = false;
              return 0;
        }
        
        //STAY AWAY FROM PLAYER X, IF COME FROM BEHIND
        var lookahead = 20;
        var iStartCheck = 3;
        for(i = iStartCheck ; i < lookahead ; i++) {
            segment = aSegments[(oEnemySegment.index+i)%aSegments.length];
            
            if ((segment === oPlayer.getPlayerSegment()) && (_iSpeed > oPlayer.getCurSpeed()) && (Util.overlap(oPlayer.getPosition().x, oPlayer.getPlayerWidth(), _iXOffset, enemyW, 0.8))) {
                if (oPlayer.getPosition().x > 0.5)
                    dir = -1;
                else if (oPlayer.getPosition().x < -0.5)
                    dir = 1;
                else
                    dir = (_iXOffset > oPlayer.getPosition().x) ? 1 : -1;

                return dir * 1/i * (_iSpeed-oPlayer.getCurSpeed())/oPlayer.getMaxSpeed(); // the closer the enemies (smaller i) and the greated the speed ratio, the larger the offset
            }
        }
        
       
        //AVOID OTHER ENEMIES
        var lookahead = 20;
        for(i = 1 ; i < lookahead ; i++) {
            segment = aSegments[(oEnemySegment.index+i)%aSegments.length];

            for(j = 0 ; j < segment.enemy.length ; j++) {
                otherEnemy  = segment.enemy[j];
                otherEnemyW = otherEnemy.getSpriteBounds().width * SPRITES.ANIMATED.SCALE;

                if ((_iSpeed > otherEnemy.getSpeed()) && Util.overlap(_iXOffset, enemyW, otherEnemy.getOffset(), otherEnemyW, 0.5)) {
                    if (otherEnemy.getOffset() > 0.5)
                        dir = -GENERAL_X_SHIFTING_SPEED;
                    else if (otherEnemy.getOffset() < -0.5)
                        dir = GENERAL_X_SHIFTING_SPEED;
                    else
                        dir = (_iXOffset > otherEnemy.getOffset()) ? GENERAL_X_SHIFTING_SPEED : -GENERAL_X_SHIFTING_SPEED;
                    //return dir * 1/i * (_iSpeed-otherEnemy.getSpeed())/oPlayer.getMaxSpeed();
                        return dir;
                }
            }
            
            for(j = 0 ; j < segment.cars.length ; j++) {
                otherCar  = segment.cars[j];
                otherCarW = otherCar.getSprite().width * SPRITES.ANIMATED.SCALE;

                if ((_iSpeed > otherCar.getSpeed()) && Util.overlap(_iXOffset, enemyW, otherCar.getOffset(), otherCarW, 0.5)) {
                  if (otherCar.getOffset() > 0.5)
                    dir = -GENERAL_X_SHIFTING_SPEED;
                  else if (otherCar.getOffset() < -0.5)
                    dir = GENERAL_X_SHIFTING_SPEED;
                  else
                    dir = (_iXOffset > otherCar.getOffset()) ? GENERAL_X_SHIFTING_SPEED : -GENERAL_X_SHIFTING_SPEED;
                    //return dir * 1/i * (_iSpeed-otherCar.getSpeed())/oPlayer.getMaxSpeed();
                    return dir;
                }
            }
        }
        
        //APPROACH PLAYER
        if(this._isAnyoneInTheMiddle(/*aSegments, */oEnemySegment) ){
            return 0;
        }

        // if no enemies ahead, but I have somehow ended up off road, then steer back on
        
        if (_iXOffset < -0.9)
              return 0.1;
        else if (_iXOffset > 0.9)
              return -0.1;
        else
              return 0;
    };
    
    
    
    this._isAnyoneInTheMiddle = function(oEnemySegment){
        var iStartCheck = -10;
        var iEndCheckCheck = 10;
        var segment, otherEnemy;

        for(var i = iStartCheck; i < iEndCheckCheck ; i++) {
            var iSegmentIndex = oEnemySegment.index + i;
            segment = s_oGame.getValidSegment(iSegmentIndex);

            for(var j = 0 ; j < segment.enemy.length ; j++) {
                otherEnemy  = segment.enemy[j];

                var iOtherEnemyRelativeX = s_oGame.getRelativeEnemyPosToPlayer(otherEnemy);

                if(iOtherEnemyRelativeX < 0 && _iRelativeX < 0){
                    //BOTH ENEMY TO THE LEFT OF THE PLAYER. CHECK FOR SOMEONE IN THE MIDDLE
                    if(iOtherEnemyRelativeX>_iRelativeX){
                        return true;
                    }
                }else if(iOtherEnemyRelativeX > 0 && _iRelativeX > 0){
                    //BOTH ENEMY TO THE RIGHT
                    if(iOtherEnemyRelativeX<_iRelativeX){
                        return true;
                    }
                }
            }
            
            for(var j = 0 ; j < segment.cars.length ; j++) {
                otherEnemy  = segment.cars[j];

                var iOtherEnemyRelativeX = s_oGame.getRelativeEnemyPosToPlayer(otherEnemy);

                if(iOtherEnemyRelativeX < 0 && _iRelativeX < 0){
                    //BOTH ENEMY TO THE LEFT OF THE PLAYER. CHECK FOR SOMEONE IN THE MIDDLE
                    if(iOtherEnemyRelativeX>_iRelativeX){
                        return true;
                    }
                }else if(iOtherEnemyRelativeX > 0 && _iRelativeX > 0){
                    //BOTH ENEMY TO THE RIGHT
                    if(iOtherEnemyRelativeX<_iRelativeX){
                        return true;
                    }
                }
            }
        }
        
        return false;
    };


    
    //////////ACCELERATION CONTROLLERS
    this._accelerate = function(v, accel, dt){ 
        var iAcceleration = v + (accel * dt);
       
        return iAcceleration;                                       
    };
   
    this._updateSpeed = function(dt){
        _iAccelerationRate = linearFunction(_iSpeed, 0,_iMaxSpeed, _iAccelerationRef, 0);

        var aSegments = s_oGame.getSegments();
        var lookahead = 20;
        
        _szRunState = OPPONENT_RUN_STATE_ACCELERATE;

        var segment = aSegments[(_oCurSegment.index+lookahead)%aSegments.length];

        ///DYNAMIC SLOW CALCULATION, CURVE BASED
        //LINEAR, IS NOT GOOD BECAUSE IN LIGHT CURVES APPLY A BIG DECREASE
        //var iPercent = linearFunction(segment.curve,0,ROAD.CURVE.VERYHARD,0,30);

        var iCurveRatio = segment.curve/ROAD.CURVE.VERYHARD;
        var iPercent = Util.easeIn(0,30,iCurveRatio);

        var iReducedVal = percentScale(_iMinSpeed,iPercent);
        if(iReducedVal<0){
            iReducedVal*=-1;
        }
        var iMinLimitSpeed = _iMinSpeed - iReducedVal;


        if(segment.curve !== 0){
            if(_iSpeed>=iMinLimitSpeed){
                //IF MY SPEED IS NOT LOW, I CAN DECELERATE
                if(segment.curve > ROAD.CURVE.MEDIUM || segment.curve < -ROAD.CURVE.MEDIUM){
                    _szRunState = OPPONENT_RUN_STATE_BRAKE;
                }else{
                    _szRunState = OPPONENT_RUN_STATE_DECELERATE;
                }
            }
        }


        switch (_szRunState){
            case OPPONENT_RUN_STATE_BRAKE:{
                    _iSpeed = this._accelerate(_iSpeed, _iBrakingRate, dt);
                    if(_iSpeed<iMinLimitSpeed){
                        _iSpeed = iMinLimitSpeed;
                    }
                    break;
            }
            case OPPONENT_RUN_STATE_DECELERATE:{
                    _iSpeed = this._accelerate(_iSpeed, _iDecelerationRate, dt);
                    if(_iSpeed<iMinLimitSpeed){
                        _iSpeed = iMinLimitSpeed;
                    }

                    break;
            }
            default:{
                    _iSpeed = this._accelerate(_iSpeed, _iAccelerationRate, dt);
                    if(_iSpeed > _iMaxSpeed){
                        _iSpeed = _iMaxSpeed;
                    }
                    break;
            }
        }
        
    };
    
    this.lateralCollision = function(iRelativeXPos){
        var oProp = {value: 0};
        var iDir = 1;
        if(iRelativeXPos < 0){
            iDir = -1;
        }

        var oThis = this;
        createjs.Tween.get(oProp).to({value:iDir*4}, 200, createjs.Ease.cubicOut).call(function(){

        }).on("change", function(){

            _iXOffset += iDir/200;
        });
    };
    
    this._move = function(dt){
        var iPrevZ = _iZ;
        _iZ       = Util.increase(_iZ, dt * _iSpeed, TRACK_LENGTH);
        
        if(_iZ < iPrevZ){
            _iCurLap++;
            
            if(_bStartSprint){
                _bStartSprint = false;
            }else{
                
                if(_aCbCompleted[ON_PLAYER_COMPLETE_LAP]){
                    _aCbCompleted[ON_PLAYER_COMPLETE_LAP].call(_aCbOwner[ON_PLAYER_COMPLETE_LAP], _iCurLap, this);
                }
                
            }
        }
    };
    
    this.getPlayerSegment = function(){
        return s_oGame.findSegment(_iZ);
    };
    
    this.getCursor = function(){
        var iSize = 10;
        
        var oCursor = new createjs.Shape();
        oCursor.graphics.beginFill(TYPE_CAR_COLOR[iType][0]);
        oCursor.graphics.drawCircle(0,0,iSize*2);

        oCursor.graphics.beginFill(TYPE_CAR_COLOR[iType][1]);
        oCursor.graphics.drawCircle(0,0,iSize);
        
        return oCursor;
    };
    
    this._updateRunAnimation = function(){
        var iNewCorneringStage = this._calculateCornering();

        if(iNewCorneringStage !== _iCorneringStage){
            _iCorneringStage = iNewCorneringStage;
            
            this._setDirectionFromCornering();
        }
    };
    
    this.update = function(dt, oPlayer){
        this._updateRunAnimation();
        this._updateSpeed(dt, oPlayer);
        
        this._move(dt);
        
        _iRelativeX = s_oGame.getRelativeEnemyPosToPlayer(this);

        
        _iXOffset  = _iXOffset + this._updateXOffset(_oCurSegment, oPlayer);

       
        _iPercent = Util.percentRemaining(_iZ, SEGMENT_LENGTH); // useful for interpolation during rendering phase
        var newSegment  = s_oGame.findSegment(_iZ);

        if (_oCurSegment.index !== newSegment.index) {
            var index = _oCurSegment.enemy.indexOf(_oParent);
            _oCurSegment.enemy.splice(index, 1);
            newSegment.enemy.push(_oParent);
            
            _oCurSegment = newSegment;
        }
    };
    
    this.moveOnSegment = function(){
        _iPercent = Util.percentRemaining(_iZ, SEGMENT_LENGTH); // useful for interpolation during rendering phase
        _oCurSegment  = s_oGame.findSegment(_iZ);

        _oCurSegment.enemy.push(_oParent);
    };
    
    
    
    _oParent = this;
    this._init(iType, iOffset, iZ, iSpeed, oElementContainer, iIndex);
}


