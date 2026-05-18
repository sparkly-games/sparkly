function CPlayer(iX, iY, oParentContainer){
    var _bKeyLeft;
    var _bKeyRight;
    var _bKeyAccelerate;
    var _bKeyBrake;
    var _bOutOfRoad;
    var _bDamageAnim;
    //var _bAttack;
    
    var _iCurPositionZ;
    var _iCurPositionX;
    var _iCurSpeed;
    var _iMaxSpeed;
    var _iAccelerationRate;     // acceleration rate - tuned until it 'felt' right
    var _iBrakingRate;         // deceleration rate when braking
    var _iDecelerationRate;     // 'natural' deceleration rate when neither accelerating, nor braking
    var _iOffRoadDecel;             // off road deceleration is somewhere in between
    var _iOffRoadLimit;             // limit when off road deceleration no longer applies (e.g. you can always go at least this speed even when off road)
    var _iPlayerWidth;
    var _iPlayerHeight;
    var _iXInertia;
    var _iCorneringSrength;
    var _iCorneringStage;
    var _iPlayerState;
    //var _iLife;
    
    var _iCurLap;
    var _bStartSprint;
    
    var _oWheel;
    var _oPlayer;
    var _oPlayerSegment;
    //var _oDamageSprite;
    var _oHitParticle;
    
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oPlayerContainer;
    var _oShadow;
    
    var _iRank;
    
    this._init = function(iX, iY, oParentContainer){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        _iMaxSpeed = PLAYER_MAX_SPEED;
        _iAccelerationRate = PLAYER_ACCELERATION;
        
        _iBrakingRate = -PLAYER_BRAKING_RATE;
        _iDecelerationRate = -PLAYER_DECELERATION;

        _iOffRoadDecel  = -_iMaxSpeed/2;
        _iOffRoadLimit  =  _iMaxSpeed/4;
        
        _iCurLap = 0;
        _bStartSprint = true;
        
        _iRank = 0;
        
        _oPlayerContainer = new createjs.Container();
        _oPlayerContainer.x = iX;
        _oPlayerContainer.y = iY;
        oParentContainer.addChild(_oPlayerContainer);
        
        _oShadow = new CCarShadow(0,0,_oPlayerContainer);
        _oShadow.setFrame("center");

        _oHitParticle = new CHitParticle(0, -340, _oPlayerContainer);
       
        _oPlayer = createSprite(s_aSpriteSheetCharacters[PLAYER_CAR_TYPE], "center",0,0,0,0);
        _oPlayer.gotoAndStop("center");
        _oPlayerContainer.addChild(_oPlayer);

        
       
        _iPlayerWidth = PLAYER_COLLIDER_WIDTH;
        _iPlayerHeight = s_oSpriteLibrary.getSprite("car_"+0+'_'+0).height;

        this.reset();
    };

    this.reset = function(){
        _bKeyLeft = false;
        _bKeyRight = false;
        _bKeyAccelerate = false;
        _bKeyBrake = false;
        _bDamageAnim = false;
        
        _bOutOfRoad = false;  

        _iCurPositionZ = 0;
        _iCurPositionX = 0;
        _iCurSpeed = 0;
        _iXInertia = 0;
        _iCorneringSrength = 0;
        _iCorneringStage = 0;
        
        _iPlayerState = STATE_RUNNER_RUN;
        
        _oPlayerSegment = s_oGame.findSegment(_iCurPositionZ + PLAYER_Z_FROMCAMERA);
        
        _oShadow.setFrame("center");
        _oPlayer.gotoAndStop("center");
    };
    this.setY = function(iY){
        _oPlayerContainer.y = iY;
    };
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };

    this.setAcceleration = function(iVal){
        _iAccelerationRate = iVal;
    };
    
    this.setMaxSpeed = function(iVal){
        _iMaxSpeed = iVal;

        _iBrakingRate = -_iMaxSpeed;
        _iDecelerationRate = -PLAYER_DECELERATION;

        _iOffRoadDecel  = -_iMaxSpeed/2;
        _iOffRoadLimit  =  _iMaxSpeed/4;
    };
    
    this.stopAll = function(){
        this.stopLeft();
        this.stopRight();
        this.stopAccelerate();
    };
    
    this.stopLeft = function(){
        if(!_bKeyLeft){
            return;
        }
        _bKeyLeft = false;
        //_oPlayer.gotoAndStop("center");
        stopSound(s_aSounds["brake"]);
    };
    
    this.stopRight = function(){
        if(!_bKeyRight){
            return;
        }
        _bKeyRight = false;
        //_oPlayer.gotoAndStop("center");
        stopSound(s_aSounds["brake"]);
    };
    
    this.stopAccelerate = function(){
        _bKeyAccelerate = false;
        stopSound(s_aSounds["engine"]);
    };
    
    this.stopBrake = function(){
        _bKeyBrake = false;
    };
    
    this.moveLeft = function(){
        if(_iCurSpeed === 0){
            return;
        }
        if(!soundPlaying(s_aSounds["brake"])){
            playSound("brake", 0.5, false);
        }
        _bKeyRight = false;
        _bKeyLeft = true;
        //_oPlayer.gotoAndStop("left_0");
    };
    
    this.moveRight = function(){
        if(_iCurSpeed === 0){
            return;
        }
        if(!soundPlaying(s_aSounds["brake"])){
            playSound("brake", 0.5, false);
        }
        _bKeyLeft = false;
        _bKeyRight = true;
        //_oPlayer.gotoAndStop("right_0");
    };
    
    this.moveAccelerate = function(){
        _bKeyBrake = false;
        _bKeyAccelerate = true;       
    };
    
    this.moveBrake = function(){
        _bKeyAccelerate = false;
        _bKeyBrake = true;
    };
    
    this.getCursor = function(){
        var iSize = 30;
        
        var oCursor = new createjs.Shape();
        oCursor.graphics.beginFill(TYPE_CAR_COLOR[s_iCharacterSelected][0]);
        oCursor.graphics.moveTo(0,-iSize);
        oCursor.graphics.lineTo(-iSize,iSize);
        oCursor.graphics.lineTo(0,0);
        oCursor.graphics.lineTo(0,-iSize);
        
        oCursor.graphics.beginFill(TYPE_CAR_COLOR[s_iCharacterSelected][1]);
        oCursor.graphics.moveTo(0,-iSize);
        oCursor.graphics.lineTo(iSize,iSize);
        oCursor.graphics.lineTo(0,0);
        oCursor.graphics.lineTo(0,-iSize);
        
        return oCursor;
    };
    
   
    this._increase = function(start, increment, max) { // with looping
        var result = start + increment;
        while (result >= max){
            result -= max;
            ///WE NEED TO COUNT LAP IN THE START GRID TOO
            ///BECAUSE WE NEED TO CALCULATE THE RANKING IN THE START SPRINT
            _iCurLap++;
            if(_aCbCompleted[ON_PLAYER_PASSED_LAP]){
                _aCbCompleted[ON_PLAYER_PASSED_LAP].call(_aCbOwner[ON_PLAYER_PASSED_LAP], _iCurLap);
            }
            
            if(_bStartSprint){
                _bStartSprint = false;
            }else{
                if(_aCbCompleted[ON_PLAYER_COMPLETE_LAP]){
                    _aCbCompleted[ON_PLAYER_COMPLETE_LAP].call(_aCbOwner[ON_PLAYER_COMPLETE_LAP], _iCurLap);
                }
            }
        }
          
        while (result < 0){
            result += max;
        }
          
        return result;
    };
    
    this._accelerate = function(v, accel, dt){ 
        var iAcceleration = v + (accel * dt);
       
        return iAcceleration;                                       
    };
    
    this._limit = function(value, min, max){
        return Math.max(min, Math.min(value, max));
    };
    
    this.getPlayerWidth = function(){
        return _iPlayerWidth;
    };
    
    this.getSpriteCenterPos = function(){
        return {x: iX, y: iY-_iPlayerHeight/2-100};
    };
    
    this.getPosition = function(){
        return {x: _iCurPositionX, z:_iCurPositionZ};
    };
    
    this.setPosition = function(iValue){
        _iCurPositionZ = iValue;
    };

    this.setXOffset = function(iOffset){
        _iCurPositionX = iOffset;
    };
    
    this.getRunDistance = function(){
        return _iCurPositionZ + (_iCurLap-1)*TRACK_LENGTH + ENEMY_FLANKING_Z_OFFSET;
    };

   
    this.autoAcceleration = function(){
        /*
        if(!_bKeyBrake){
            this.moveAccelerate(); 
        }*/
    };
    
    this.autoPilot = function(){
        if(_iCurPositionX > 0.5){
            _bKeyRight = false;
            _bKeyLeft = true;
        } else if(_iCurPositionX < -0.5){
            _bKeyRight = true;
            _bKeyLeft = false;
        } else if(_iCurPositionX <= 0.1 && _iCurPositionX >= -0.1){
            _bKeyLeft = false;
            _bKeyRight = false;
        }
    };
    
    this.getMaxSpeed = function(){
        return _iMaxSpeed;
    };
    
    this.getCurSpeed = function(){
        return _iCurSpeed;
    };
    
    this.setCurSpeed = function(iValue){
        _iCurSpeed = iValue;
    };
    
    this.setRank = function(iNewRank){
        if(_iRank !== iNewRank){
            _iRank = iNewRank;
            if(_aCbCompleted[ON_PLAYER_CHANGE_RANK]){
                _aCbCompleted[ON_PLAYER_CHANGE_RANK].call(_aCbOwner[ON_PLAYER_CHANGE_RANK], _iRank);
            }
        }
    };
    
    this.getRank = function(){
        return _iRank;
    };
    
    this.getPlayerSegment = function(){
        return _oPlayerSegment;
    };
    
    this.getFrontPlayerSegment = function(){
        return s_oGame.findSegment(_iCurPositionZ+SEGMENT_LENGTH + PLAYER_Z_FROMCAMERA);
    };
    
    this.getContainer = function(){
        return _oPlayerContainer;
    };
    
    this.damageAnim = function(iRelativeX, iRelativeZ){
        if(iRelativeZ > 0){
            iY = 0;
            if(iRelativeZ<100){
                iY = 80;
                if(iRelativeX>0){
                    iRelativeX = PLAYER_RELATIVE_DAMAGE_X_DISTANCE;
                }else{
                    iRelativeX = -PLAYER_RELATIVE_DAMAGE_X_DISTANCE;
                }
                
            }
        }else{
            iY = 240;
        }
        
        var iX = linearFunction(
                iRelativeX,
                -PLAYER_RELATIVE_DAMAGE_X_DISTANCE, PLAYER_RELATIVE_DAMAGE_X_DISTANCE, 
                -120, 120
                );

        _oHitParticle.play(iX, iY);
        
    };
    
    this.isOutOfRoad = function(){
        return _bOutOfRoad;
    };
    
    this.stopEngineSound = function(){
        stopSound(s_aSounds["engine"]);
        stopSound(s_aSounds["engine_stall"]);
        
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
    
    this._setDirectionFromCornering = function(){
        var szSide = this._getSideFromCornering();
        _oShadow.setFrame(szSide);
        _oPlayer.gotoAndStop(szSide);
    };
    
   
    this._updateCornering = function(iSpeedRatio){
        var iCorneringIncreaseRatio = PLAYER_CORNERING_INCREASE_RATIO;

        if (_bKeyLeft){
            _iCorneringSrength -= iCorneringIncreaseRatio;

        }else if (_bKeyRight){
            _iCorneringSrength += iCorneringIncreaseRatio;

        } else {           
            if(_iCorneringSrength > 0){
                _iCorneringSrength -= iCorneringIncreaseRatio;
                if(_iCorneringSrength <0){
                    _iCorneringSrength = 0;
                }
            } else if(_iCorneringSrength < 0) {
                _iCorneringSrength += iCorneringIncreaseRatio;
                if(_iCorneringSrength >0){
                    _iCorneringSrength = 0;
                }
            }
        }

        if(_iCorneringSrength>PLAYER_CORNERING_WEIGHT){
            _iCorneringSrength = PLAYER_CORNERING_WEIGHT;
        }else if(_iCorneringSrength<-PLAYER_CORNERING_WEIGHT){
            _iCorneringSrength = -PLAYER_CORNERING_WEIGHT;
        }
    };
    
    this._updateXMovement = function(dx, iSpeedRatio){
        var iCurveCentrifugalForce;
        iCurveCentrifugalForce = (dx * iSpeedRatio * iSpeedRatio * _oPlayerSegment.curve * CENTRIFUGAL_FORCE)/TERRAIN_ADHERENCE;

        dx = linearFunction(_iCorneringSrength,-PLAYER_CORNERING_WEIGHT, PLAYER_CORNERING_WEIGHT, -0.044, 0.044)*iSpeedRatio;


        _iCurPositionX = _iCurPositionX - iCurveCentrifugalForce + dx;
    };
    
    this._calculateCornering = function(){
        var iCornering = linearFunction(_iCorneringSrength,PLAYER_CORNERING_WEIGHT,-PLAYER_CORNERING_WEIGHT, 4, -4);
        var iNewCorneringStage = Math.round(iCornering);
        
        return iNewCorneringStage;
    };
    
    this._updateRunAnimation = function(){
        var iNewCorneringStage = this._calculateCornering();

        if(iNewCorneringStage !== _iCorneringStage){
            _iCorneringStage = iNewCorneringStage;
            
            this._setDirectionFromCornering();
        }
    };

    
    this.frontCollision = function(){

        _iCurSpeed -= PLAYER_SPEED_LOST_WHEN_COLLIDED;

    };
    
    this.lateralCollision = function(iRelativeXPos, oEnemy){
        _iPlayerState = STATE_RUNNER_HURTED;
        
        
        
        var oProp = {value: _iCorneringStage};

        var iDir = -1;
        if(iRelativeXPos < 0){
            iDir = 1;
        }
        
        _iCurSpeed -= PLAYER_SPEED_LOST_WHEN_COLLIDED;
        
        var oThis = this;
        createjs.Tween.get(oProp).to({value:4*iDir}, 200, createjs.Ease.cubicOut).call(function(){
                _iPlayerState = STATE_RUNNER_RUN;

        }).on("change", function(){
            _iCorneringStage = Math.round(oProp.value);
            _iCurPositionX += _iCorneringStage*0.002;
            _iCorneringSrength = iDir*0.1;
            
            oThis._setDirectionFromCornering();
        });
    };
    
    this.checkOutOfRoad = function(){
        _bOutOfRoad = false; 
        var iCarNormalizedHalfWidth = 0.1;
        var iRoadWidth = s_oGame.rumbleCondition(_oPlayerSegment) ? 1.35 : 1;
        var iRoadLimit = iRoadWidth - iCarNormalizedHalfWidth;
        if ( (_iCurPositionX < -iRoadLimit) || (_iCurPositionX > iRoadLimit) ){
            
            
            _bOutOfRoad = true;
        }
    };
    
    this.update = function(dt){
        //_iCurSpeed = 0;
        _oPlayerSegment = s_oGame.findSegment(_iCurPositionZ + PLAYER_Z_FROMCAMERA);
        var iSpeedRatio = _iCurSpeed/_iMaxSpeed;
        
        _iCurPositionZ = this._increase(_iCurPositionZ, dt * _iCurSpeed, TRACK_LENGTH);

        var dx = dt * 2*TERRAIN_ADHERENCE * iSpeedRatio; // at top speed, should be able to cross from left to right (-1 to 1) in 1 second

        
        if(_iPlayerState !== STATE_RUNNER_HURTED && _iPlayerState !== STATE_RUNNER_DEATH){
            this._updateCornering(iSpeedRatio);
            this._updateXMovement(dx, iSpeedRatio);
        }
        
        
        
        if(_iPlayerState === STATE_RUNNER_RUN){
            this._updateRunAnimation(iSpeedRatio);
        }

        
        _iAccelerationRate = linearFunction(_iCurSpeed, 0,PLAYER_MAX_SPEED, PLAYER_ACCELERATION, 0);

        if (_bKeyAccelerate){
          _iCurSpeed = this._accelerate(_iCurSpeed, _iAccelerationRate, dt);
     
            if(iSpeedRatio === 1){
                if(!soundPlaying(s_aSounds["engine_stall"])){
                    stopSound(s_aSounds["engine"]);
                    stopSound(s_aSounds["engine_reverse"]);
                    playSound("engine_stall", 0.7, true);
                }
            } else {
                if(_iCurSpeed>0 && !soundPlaying(s_aSounds["engine"]) && !s_oGame.playerCollide()){
                    stopSound(s_aSounds["brake"]);
                    stopSound(s_aSounds["engine_stall"]);
                    stopSound(s_aSounds["engine_reverse"]);
                    playSound("engine", 0.7, false);
                    //var iStartAudio = linearFunction(iSpeedRatio, 0,1,0,soundDuration(s_aSounds["engine"]));
                    var iStartAudio = 0.15;
                    //console.log(soundDuration(s_aSounds["engine"]))
                    soundSeek(s_aSounds["engine"], iStartAudio);
                }
            }
     
            
        
        }else if (_bKeyBrake) {
          _iCurSpeed = this._accelerate(_iCurSpeed, _iBrakingRate, dt);
          
            if(_iCurSpeed > 0){
                stopSound(s_aSounds["engine"]);
                stopSound(s_aSounds["engine_stall"]);
                stopSound(s_aSounds["engine_reverse"]);
                if(!soundPlaying(s_aSounds["brake"])){
                    playSound("brake", 0.5, false);
                }
            }
      
        }else{
          _iCurSpeed = this._accelerate(_iCurSpeed, _iDecelerationRate, dt);
          
          if(_iCurSpeed > 0 && !soundPlaying(s_aSounds["engine_reverse"])){
                stopSound(s_aSounds["brake"]);
                stopSound(s_aSounds["engine_stall"]);
                stopSound(s_aSounds["engine"]);
                playSound("engine_reverse", 0.7, false);
                var iStartAudio = linearFunction(iSpeedRatio, 0,1,soundDuration(s_aSounds["engine_reverse"]),0);

                soundSeek(s_aSounds["engine_reverse"], iStartAudio);
            }
          
        }

        this.checkOutOfRoad();
        
        if(_iCurSpeed > _iOffRoadLimit && _bOutOfRoad){
            //Decelerate
            _iCurSpeed = this._accelerate(_iCurSpeed, _iOffRoadDecel, dt);
        }
        
        //_iCurSpeed = 10000;
          
        _iCurPositionX = this._limit(_iCurPositionX, -ROAD_BOUNDS, ROAD_BOUNDS);     // dont ever let player go too far out of bounds
        _iCurSpeed   = this._limit(_iCurSpeed, 0, _iMaxSpeed); // or exceed _iMaxSpeed

        //console.log("PLAYER:"+_iCurSpeed)
        //console.log("playerZ ---> "+ _iCurPositionZ)
        //console.log("seg:"+ _oPlayerSegment.curve)
    };
    
    
    
    this._init(iX, iY, oParentContainer);
}


