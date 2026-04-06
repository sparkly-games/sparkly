function CGame(){
    var _bCPUTurn;
    var _bUpdateAI;
    var _bDouble;
    var _iScore;  
    var _iLastThrowScore;
    var _iTotDartScore;
    var _iTotThrows;
    var _iStartXDartBoard;
    var _iNumThrow;
    var _iHeightDartBoard;
    var _iAngleArrow;
    var _iThrowState;
    var _iNumPlayer;
    var _iCurTurn;
    var _iAccuracyAI;
    var _fForceDart;

    var _aPlayerScore;
    var _aPlayerNames;
    var _aDartThrown = new Array();
    var _pStartDartPos;
    var _pEndDartPos;
    var _oPressPoint;
    var _oReleasePoint;
    var _oListenerDown;
    var _oListenerUp;
    var _oListenerMove;
    var _oInfoCPUGoal;
    var _oCurDart;

    var _oHitArea;
    var _oAlertText;
    var _oInterface;
    var _oArrowThrow;
    var _oAreYouSurePanel;
    var _oBoardDart;
    var _oContainerDartBoard;
    var _oContainerDart;
    var _oContainerGame;
    var _oContainerBg;
    var _oGameOver;
    var _oHelpControls = null;
    
    
    this._init = function(){
        setVolume("soundtrack",0.1);
        
        if(s_iCurMode !== MODE_VS_HUMAN){
            _iScore = getScoreTillLevel(s_iCurLevel);
            _iTotThrows = 0;
        }
        
        this.reset();
        
        if(s_iCurMode === MODE_VS_CPU){
            _iAccuracyAI = AI_ACCURACY[s_iCurLevel-1];
        }
        
        
        _oContainerGame = new createjs.Container();
        _oContainerGame.x = CANVAS_WIDTH/2;
        _oContainerGame.regX = CANVAS_WIDTH/2;
        s_oStage.addChild(_oContainerGame);
        
        
        this._initMode();
        this._initDartBoard();
        
        var pPos = _oCurDart.getDartTip();
        _oArrowThrow = new CArrowThrow(pPos.x,pPos.y,_oContainerDartBoard);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oContainerGame.addChild(_oHitArea);
        
        
        if(s_bFirstPlay){
            _oHelpControls = new CHelpControls();
        }
        
        
        _oInterface = new CInterface(_iNumPlayer,_aPlayerNames);
        
        
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this.onConfirmExit,this);
        
        this._initGameOverPanel();
        
        
        _oAlertText = new CAlertText();

        this.refreshButtonPos();
        
        this._resetHitArea();
        
        PokiSDK.gameplayStart();
    };
    
    
    this.unload = function(){
        _oInterface.unload();
        
        _oGameOver.unload();
        
       _oHitArea.off('mousedown', _oListenerDown);
       _oHitArea.off('click', _oListenerUp);
       
        s_oGame = null;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren(); 
    };
    
    this.refreshButtonPos = function(){
        _oContainerDartBoard.y = s_iOffsetY + 20;
        this.refreshGridScale();

        _oInterface.refreshButtonPos();
        
        if(_oHelpControls !== null){
            _oHelpControls.refreshButtonPos();
        }
    };

    
    this.refreshGridScale = function(){
        var iGUIHeight = 100;
        var iMaxGridSizeHeight = (CANVAS_HEIGHT - (s_iOffsetY*2))  - iGUIHeight;

        CUR_GRID_SCALE = iMaxGridSizeHeight/_iHeightDartBoard;
        CUR_GRID_SCALE = parseFloat(CUR_GRID_SCALE.toFixed(2));
        _oContainerDartBoard.scaleX = _oContainerDartBoard.scaleY = CUR_GRID_SCALE;

       _oContainerBg.regX = (CANVAS_WIDTH/2);
       _oContainerBg.x = (CANVAS_WIDTH/2);
       _oContainerBg.regY = CANVAS_HEIGHT/2;
       _oContainerBg.y = CANVAS_HEIGHT/2;
       
       
        _oContainerBg.scaleX = _oContainerBg.scaleY = 1/CUR_GRID_SCALE;

        _oContainerBg.scaleX = _oContainerBg.scaleY *= 1.5;
    };
    
    this.reset = function(){
        _bCPUTurn = false;
        _bUpdateAI = false;
        _iTotDartScore = 0;
        _iThrowState = 0;

        _iNumThrow = NUM_THROW_PER_TURN;
        
        for(var i=0;i<_aDartThrown.length;i++){
            _aDartThrown[i].unload();
        }
        
        _aDartThrown = new Array();
    };
    
    this._initMode = function(){
        _iCurTurn = 0;
        _aPlayerNames = new Array();
        _aPlayerNames.push(TEXT_PLAYER_NAME[0]);
        
        if(s_iCurMode === MODE_SINGLE){
            _iNumPlayer = 1;
        }else{
            _iNumPlayer = 2;
            if(s_iCurMode === MODE_VS_CPU){
                _aPlayerNames.push(TEXT_CPU);
            }else{
                _aPlayerNames.push(TEXT_PLAYER_NAME[1]);
            }
        }
        
        _aPlayerScore = new Array();
        for(var i=0;i<_iNumPlayer;i++){
            _aPlayerScore[i] = STARTING_SCORE;
        }
    };
    
    this._initBg = function(){
        _oContainerBg = new createjs.Container();
        _oContainerDartBoard.addChild(_oContainerBg);

        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        _oContainerBg.addChild(oBg); 
    };
    
    this._initDartBoard = function(){
        _oContainerDartBoard = new createjs.Container();
        _oContainerGame.addChild(_oContainerDartBoard);

        this._initBg();
        
        var oSpriteBoard = s_oSpriteLibrary.getSprite("dartboard");
        _oBoardDart = new CDartBoard(_oContainerBg.getBounds().width/2,oSpriteBoard.height/2,oSpriteBoard,_oContainerDartBoard)

        
        _oContainerDart = new createjs.Container();
        _oContainerDartBoard.addChild(_oContainerDart);
        
        _pStartDartPos = {x:_oContainerBg.getBounds().width/2-700,y:oSpriteBoard.height-200+DART_HEIGHT};
        _pEndDartPos = {x:_oContainerBg.getBounds().width/2+700,y:oSpriteBoard.height-200+DART_HEIGHT};
        
        this._createDart();
        /*
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("rgba(255,0,255,1)").drawCircle(AI_INFO_HIT["center"].x,AI_INFO_HIT["center"].y,20);
        _oContainerDartBoard.addChild(oFade);
        */
        _iHeightDartBoard = _pStartDartPos.y;

        _oContainerDartBoard.regX = _oContainerDartBoard.getBounds().width/2;
        
        _oContainerDartBoard.x = _iStartXDartBoard = CANVAS_WIDTH/2;
    };
    
    this._initGameOverPanel = function(){
        switch(s_iCurMode){
            case MODE_SINGLE:{
                    _oGameOver = new CEndPanelSingleMode();
                    _oGameOver.addEventListener(ON_BACK_MENU,this.onConfirmExit,this);
                    _oGameOver.addEventListener(ON_RESTART,this._restartGame,this);
        
                    
                    break;
            }
            case MODE_VS_CPU:{
                    _oGameOver = new CEndPanelVsCpu();
                    _oGameOver.addEventListener(ON_BACK_MENU,this.onConfirmExit,this);
                    _oGameOver.addEventListener(ON_RESTART,this._restartGame,this);
                    _oGameOver.addEventListener(ON_NEXT,this._nextLevel,this);
                    break;
            }
            case MODE_VS_HUMAN:{
                    _oGameOver = new CEndPanelVsHuman();
                    _oGameOver.addEventListener(ON_BACK_MENU,this.onConfirmExit,this);
                    _oGameOver.addEventListener(ON_RESTART,this._restartGame,this);
                    break;
            }
        }
    };
    
    this._restartGame = function(){
        PokiSDK.gameplayStart();
        
        this.reset();
        
        //REMOVE ALL DARTS
        _oContainerDart.removeAllChildren();
        
        //RESET SCORES
        _aPlayerScore = new Array();
        for(var i=0;i<_iNumPlayer;i++){
            _aPlayerScore[i] = STARTING_SCORE;
            _oInterface.resetPlayerScore(i);
        }
        
        _iCurTurn = 0;
        
        this._createDart();

        _oInterface.reset();
        
        
        this._resetHitArea();
    };
    
    this._nextLevel = function(){
        s_iCurLevel++;
        _iAccuracyAI = AI_ACCURACY[s_iCurLevel-1];

        
        this._restartGame();
    };
    
    this._createDart = function(){
        _fForceDart = 0;
        
        var iType = _iCurTurn;

        var oDart = new CDart(_pStartDartPos.x,_pStartDartPos.y,iType,_pEndDartPos,_oContainerDart);
        
        _oCurDart = oDart;
        _aDartThrown.push(oDart);
        
        if(s_iCurMode !== MODE_VS_CPU || (s_iCurMode === MODE_VS_CPU && _iCurTurn === 0)){
            if(_aPlayerScore[_iCurTurn] < 41 && _aPlayerScore[_iCurTurn]%2 === 0){
                var iNumToHit = _aPlayerScore[_iCurTurn]/2;
                _oAlertText.show(TEXT_HINT1 + " " + iNumToHit + " "+TEXT_HINT2);
            }
        }
        
    };
    
    this._resetHitArea = function(){
        _oListenerDown = _oHitArea.on('mousedown', this.onMouseDown);
    };
    
    this.onMouseDown = function (e) {
        if(!_bCPUTurn){
            _oHitArea.off('mousedown', _oListenerDown);
        }

        if(_iThrowState === 0){
            _oCurDart.stopTween();

            if(!_bCPUTurn){
                s_oGame._resetHitArea();
            }else{
                _bUpdateAI = true;
                
            }
            
            _iThrowState++;
            
            if(s_bFirstPlay){
                _oHelpControls.nextHelp();
            }
        }else{
            _oListenerUp = _oHitArea.on('click', s_oGame.onPressUp);
            _oListenerMove = _oHitArea.on('pressmove', s_oGame.onPressMove);
        
            _oPressPoint = {x:s_oStage.mouseX*s_iScaleFactor,y:s_oStage.mouseY*s_iScaleFactor};
            _oReleasePoint = {x:s_oStage.mouseX*s_iScaleFactor,y:s_oStage.mouseY*s_iScaleFactor};
            
            var pPos = _oCurDart.getDartTip();
            _oArrowThrow.setPosition(pPos.x,pPos.y);
            _oArrowThrow.setVisible(true);
        }

    };

    
    this.onPressUp = function (){
        if(!_bCPUTurn){
            if(s_bFirstPlay){
                s_bFirstPlay = false;
                _oHelpControls.hide();
                _oHelpControls = null;
            }
            
            _oHitArea.off('click', _oListenerUp);
            _oHitArea.off('pressmove', _oListenerMove);

            _oReleasePoint.x = 0;
            _oReleasePoint.y = 0;
            _oArrowThrow.setVisible(false);

            if(_fForceDart === 0){
                s_oGame._resetHitArea();
                return;
            }
        }
        

        var iOffsetX = (_iAngleArrow-360)/50;

        _oCurDart.startAnim((CANVAS_WIDTH/2 * iOffsetX),_fForceDart,iOffsetX);

        s_oGame._prepareLaunchDart();
    };
    
    this._prepareLaunchDart = function(){
        _oAlertText.hide();
        
        var iNewX = CANVAS_WIDTH/2+(CANVAS_WIDTH/2-_oCurDart.getNewX());
        var iNewY = -(_oCurDart.getNewY()-_oContainerDartBoard.y);
        
        if(!s_bLandscape){
            iNewY += CANVAS_HEIGHT/3;
        }else{
            iNewY += CANVAS_HEIGHT/5
        }
        
        createjs.Tween.get(_oContainerDartBoard).to({y:iNewY+200}, 500, createjs.Ease.cubicOut).to({y:iNewY}, 500, createjs.Ease.sineIn);
        createjs.Tween.get(_oContainerDartBoard).to({x:iNewX}, 1500, createjs.Ease.cubicOut);
        
        createjs.Tween.get(_oContainerDartBoard).to({scaleX:1.5,scaleY:1.5}, 1500, createjs.Ease.cubicOut);

        s_oGame.decreaseNumThrow();
        
        playSound("launch",1,false);
    };
    
    this._aiShot = function(iOffsetX){
        _oCurDart.startAnim(iOffsetX,_fForceDart,iOffsetX/700);
        
        this._prepareLaunchDart();
    };
    
    this.onPressMove = function(){
        _oReleasePoint = {x:s_oStage.mouseX*s_iScaleFactor,y:s_oStage.mouseY*s_iScaleFactor};
        
        s_oGame.arrowUpdate();
    };
    
    this.arrowUpdate = function () {
        this.angleArrow();
        this.arrowMask();
    };
    
    this.angleArrow = function () {
        var oDif = {x: _oReleasePoint.x - _oPressPoint.x, y: _oReleasePoint.y - _oPressPoint.y};
        var iAngle = Math.atan2(_oPressPoint.y, oDif.x);
        
        
        _iAngleArrow= iAngle * (180 / Math.PI) + 270;
        _oArrowThrow.setAngle(_iAngleArrow);
    };
    
    this.arrowMask = function () {
        var fDistance = Math.abs(_oPressPoint.y-_oReleasePoint.y)
        
        if(_oReleasePoint.y < _oPressPoint.y){
            return;
        }


        if (fDistance > _oArrowThrow.getHeight()) {
            fDistance = _oArrowThrow.getHeight();
        }
      
        _fForceDart = fDistance * FORCE_MULTIPLIER;
        _oArrowThrow.mask(fDistance);
    };
    
    
    var sortFunction = function(obj1, obj2, options) {
        if (obj1.y > obj2.y) { return -1; }
        if (obj1.y < obj2.y) { return 1; }
        return 0;
    };

 
    this._endThrow = function(){  
        if(_iCurTurn === 0 && s_iCurMode !== MODE_VS_HUMAN){
            _iTotThrows++;
        }
        
        _oContainerDart.sortChildren(sortFunction);

        this._checkThrowPoint();

        createjs.Tween.get(_oContainerDartBoard).wait(1000).to({scaleX:CUR_GRID_SCALE,scaleY:CUR_GRID_SCALE,x:_iStartXDartBoard,y:s_iOffsetY + 20},1000,createjs.Ease.cubicInOut).call(function(){
                                                                                        s_oGame._resetShot();
                                                                                });
    };
    
    this._checkThrowPoint = function(){
        _bDouble = false;

        var iAngle = angleBetweenVectors(new CVector2(_oCurDart.getX()-_oBoardDart.getX(),_oCurDart.getY()-_oBoardDart.getY()),new CVector2(0,-1) );
        
        iAngle = toDegree(iAngle);
        
        //CHECK THE POINT INSIDE THE SLICE
        var iDist = distanceV2( _oCurDart.getPos(), {x:_oBoardDart.getX(),y:_oBoardDart.getY()});
        
        var iId = -1;
        for(var k=0;k<DIST_SLICES.length;k++){
            if(iDist < DIST_SLICES[k]){
                iId = k;
                break;
            }
        }
        
        //FIND THE TARGET SLICE
        _iLastThrowScore = 0;
        if(iId > 1){
            var iRet = Math.floor(iAngle/SLICE_ANGLE + 0.5);
            
            if(_oCurDart.getX() > _oBoardDart.getX()){
                _iLastThrowScore = SLICE_VALUES_RIGHT[iRet];
                
            }else{
                _iLastThrowScore = SLICE_VALUES_LEFT[iRet];
            }
            
            if(iId === 3){
                //TRIPLE YOUR SCORE
                _iLastThrowScore *= 3;
            }else if(iId === 5){
                //DOUBLE YOUR SCORE
                _iLastThrowScore *=2;
                _bDouble = true;
            }
        }else if(iId !== -1){
            _iLastThrowScore = POINTS_DARTBOARD_CENTER[iId];
            if(iId === 0){
                _bDouble = true;
            }
        }

        
        if(_iLastThrowScore >0){
            playSound("hit",1,false);

            new CScoreText (_iLastThrowScore,_oCurDart.getPos().x,_oCurDart.getPos().y,"#fff",_oContainerDartBoard);
            
            
        }else{
            playSound("miss",1,false);
        }
        
        _iTotDartScore += _iLastThrowScore;

        _oInterface.showDartScore(_iCurTurn,NUM_THROW_PER_TURN-_iNumThrow-1,_iLastThrowScore,_iTotDartScore);
    };

    
    this._resetShot = function(){
        //DECREASE SCORE FOR THE CURRENT PLAYER
        _aPlayerScore[_iCurTurn] -= _iLastThrowScore;

        //CHECK IF CURRENT PLAYER FINALIZED THE MATCH WITH A DOUBLE
        var bForceChangeTurn = false;
        if(_aPlayerScore[_iCurTurn] === 0){
            if(_bDouble){
                //PLAYER WINS
                _oInterface.refreshPlayerScore(_iCurTurn,0);
                if(_iCurTurn === 0){
                    PokiSDK.happyTime(1);
                }
                this.gameOver();
                return;
            }else{
                bForceChangeTurn = true;
            }
        }else if(_aPlayerScore[_iCurTurn] < 0 || _aPlayerScore[_iCurTurn] === 1){
            bForceChangeTurn = true;
        }else{
            _oInterface.refreshPlayerScore(_iCurTurn,_aPlayerScore[_iCurTurn]);
            
            if(_iCurTurn === 0){
                if(_iLastThrowScore>=50){
                    PokiSDK.happyTime(1);
                } else if(_iLastThrowScore>=25){
                    PokiSDK.happyTime(0.5);
                }
            }
            
        }
            
        if(_iNumThrow === 0 || bForceChangeTurn){
            _iNumThrow = 0;
            if(_aPlayerScore[_iCurTurn] <= 1){
                _aPlayerScore[_iCurTurn] += _iTotDartScore;
            }
            
            _oInterface.refreshPlayerScore(_iCurTurn,_aPlayerScore[_iCurTurn]);
            setTimeout(function(){s_oGame._changeTurn();},2000);    
            
        }else{  
            _iThrowState = 0;
            this._createDart();
            
            if(_bCPUTurn){
                this._calculateCPUGoal();
                _bUpdateAI = true;
            }else{
                this._resetHitArea();
            }
        }    
    };
    
    this.decreaseNumThrow = function(){
        _iNumThrow--;
        
        _oInterface.refreshNumThrow(_iNumThrow);
    };

    this._manageAIThrow = function(){
        switch(_iThrowState){
            case 0:{
                //AI WILL TRY TO CENTER THE DART 
            
                if(_oCurDart.getX() > _oInfoCPUGoal.x  - (300*_iAccuracyAI) ){
                    _bUpdateAI = false;
                    var iTime = 400*_iAccuracyAI;
                    var iRandTime = Math.floor(Math.random()*iTime);
                    setTimeout(function(){s_oGame.onMouseDown();},iRandTime);
                }
                break;
            }
            case 1:{
                    _bUpdateAI = false;
                    
                    //DIRTY FORCE VALUE 
                    var iRandNoise = Math.floor(Math.random() * 201) -100;
                    
                    _fForceDart = _oInfoCPUGoal.force + (iRandNoise  *_iAccuracyAI);

                    //CALCULATE DIR VECTOR
                    
                    var pPos = _oCurDart.getDartTip();
                    _oArrowThrow.setPosition(pPos.x,pPos.y);
                    
                    var iDiff = _oInfoCPUGoal.x-_oArrowThrow.getX();
                   
                    //DIRTY DART X
                    var iRandNoise = Math.floor(Math.random() * 101) -50;
                   
                    iDiff += iRandNoise*_iAccuracyAI;
                   
                    
                    setTimeout(function(){s_oGame._aiShot(iDiff);},1000);
                    break;
            }
            
        }
    };
    
    
    
    this._calculateAiGoal = function(){
        var iGoal = _aPlayerScore[1];

        switch(iGoal){
            case 24:{
                    return "double_12";     
            }
            case 36:{
                    return "double_18";
            }
            case 50:{
                    return "bulls_eye";
            }
            case 81:{
                    return "triple_19";
                    
            }
            case 84:{
                    return "triple_16";
            }
            
            default:{
                    if(iGoal > 61){
                        //TRY TO HIT TRIPLE 20
                        return "triple_20";
                    }else if(iGoal>40){
                        var iDiff = iGoal-40;
                        if(iDiff%2>0){
                            iDiff++;
                        }
                        return ""+iDiff;
                    }else if(iGoal%2===0){
                        return "double_"+(iGoal/2);
                    }else{
                        return "1";
                    }
            }
        }
    };
    
    this.onExit = function(){
        _oAreYouSurePanel.show(TEXT_ARE_YOU_SURE,90);
    };
    
    this.onConfirmExit = function(){
        this.unload();
        
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        
        s_oMain.gotoMenu();
    };
    
    this._changeTurn = function(){
        if(s_iCurMode !== MODE_SINGLE){
            var iPrev = _iCurTurn;
            _iCurTurn++;
            if(_iCurTurn === _aPlayerScore.length){
                _iCurTurn = 0;
                _oInterface.resetScoreGUI();
            }
            
            _oInterface.changeTurn(_iCurTurn,iPrev);
        }else{
            _oInterface.resetScoreGUI();
        }
        
        this.reset();

        _oInterface.resetNumThrow();
        
        this._createDart();
        
        _bCPUTurn = false;
        _bUpdateAI = false;
        if(_iCurTurn === 1 && s_iCurMode === MODE_VS_CPU){
            this._calculateCPUGoal();
                
            _bCPUTurn = true;
            _bUpdateAI = true;
        }else{
            this._resetHitArea();
        }
        
    };
    
    this._calculateCPUGoal = function(){
        //CPU TURN
        var szGoal = this._calculateAiGoal();
        _oInfoCPUGoal = AI_INFO_HIT[szGoal];
    };
    
    this.gameOver = function(){   
        PokiSDK.gameplayStop();
        
        if(s_iCurMode === MODE_SINGLE){
            this.refreshScore(true);
            
            if(getBestScoreSingleMode() < _iScore){
                setBestScoreSingleMode(_iScore);
            }
            
            _oGameOver.show(_iScore,_iTotThrows);
        }else{
            if(s_iCurMode === MODE_VS_CPU){
                var iLevelScore = this.refreshScore(false);
                
                var bGameOver = true;

                if(s_iCurLevel+1 === NUM_LEVELS){
                    bGameOver = false;
                }

                _oGameOver.show(_iCurTurn,iLevelScore,_iScore,bGameOver);
            }else{
                _oGameOver.show(_iCurTurn,_aPlayerNames[_iCurTurn],_aPlayerNames,_aPlayerScore);
            }
            
            
        }
    };
    
    this.refreshScore = function(bSingleMode){
        var iLevelScore = MAX_NUM_THROW-_iTotThrows;
        if(iLevelScore < 0){
            iLevelScore = 0;
        }

        _iScore += iLevelScore;
        
        if(bSingleMode){
            setScoreSingleMode(_iScore);
        }else{
            setLocalStorageScore(iLevelScore,s_iCurLevel);
        }
        

        $(s_oMain).trigger("save_score",_iScore);
        $(s_oMain).trigger("share_event",_iScore);
        
        return iLevelScore;
    };
    
    this.update = function(){
        if(_bUpdateAI){
            this._manageAIThrow();
        }
    };

    s_oGame = this;
    
    this._init();
}

var s_oGame = null;
