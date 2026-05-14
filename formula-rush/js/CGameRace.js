function CGameRace(oData, iLevel){
    CGameBase.call(this, oData, iLevel);

    this._iCurPlayerLap;
    this._iTotLap;
    this._aRankPositions;

    this._startGame();
};

CGameRace.prototype = Object.create(CGameBase.prototype);

CGameRace.prototype._startGame = function(){
    this._iCurPlayerLap = 1;
    this._iTotLap = LEVEL_INFO[this._iLevel].num_laps;

    
    this._oPlayer.addEventListener(ON_PLAYER_COMPLETE_LAP, this.playerLapCompleted, this);
    this._oPlayer.addEventListener(ON_PLAYER_CHANGE_RANK, this.playerRankChanged, this);

    var aStartingGrid = this.getStartingGrid(STARTING_GRID_X_OFFSET, STARTING_GRID_Z_OFFSET, TYPE_CAR_IN_GAME.length);

    var aOpponentTypeList = copyObjectByValue(TYPE_CAR_IN_GAME);
    aOpponentTypeList.shift(); //remove player
    
    shuffle(aOpponentTypeList);

    
    for(var i=0; i<aOpponentTypeList.length; i++){

        var iType = aOpponentTypeList[i];
        var iIndex = i;
        
        var iSkillLevel =  Math.random()*OVERALL_DIFFICULTY;
        
        this.createOpponent(iType, iSkillLevel, iIndex);
    }

    var aCarsOrderedByRank = this._aEnemy.concat([this._oPlayer]);
    
    this.setStartingGrid(aCarsOrderedByRank, aStartingGrid);


    var oCursor = this._oPlayer.getCursor();
    this._oInterface.addMiniMapCursor(oCursor, this._oPlayer);

    this._oInterface.refreshLap(this._iCurPlayerLap, this._iTotLap);

    
    
    
    
    this._oRoad.clearElementsInSegments(0,this._aSegments.length);
    this.updateOpponents(0);


    this.refreshRanks();

};

CGameRace.prototype.getStartingGrid = function(iXOffset, iZOffset, iNumSlot){
    var aGridParam = new Array();
    var iDir = -1;
    var iX = iDir*iXOffset;
    var iZ = 10 + iZOffset;
    for(var i=0; i<iNumSlot; i++){
        
        aGridParam.push({x:iX, z:iZ});
        
        iZ += iZOffset;
        iX *= -1;
    }
    
    return aGridParam;
};

CGameRace.prototype.setStartingGrid = function(aListOrderCars, aStartingGrid){
    for(var i=0; i<aListOrderCars.length; i++){
        var oCar = aListOrderCars[i];
        var iX = aStartingGrid[i].x;
        var iZ = (this._aSegments.length - aStartingGrid[i].z)*SEGMENT_LENGTH;
        oCar.setPosition(iZ);
        oCar.setXOffset(iX);
    }
};

CGameRace.prototype.createOpponent = function(iType, oDifficultyParams, iIndex){
    var offset = 0;
    var z      = 0;
    var speed = 0;

    var oEnemy = new COpponent(iType, offset, z, speed, this._oElementContainer, iIndex);
    oEnemy.addEventListener(ON_PLAYER_COMPLETE_LAP, this.enemyLapCompleted, this);
    oEnemy.setDifficultyParams(oDifficultyParams);

    var oCursor = oEnemy.getCursor();
    this._oInterface.addMiniMapCursor(oCursor, oEnemy);

    this._aEnemy.push(oEnemy);

};


CGameRace.prototype.enemyLapCompleted = function(iCurLap, oOpponent){

    var iZOpponentDistance = oOpponent.getRunDistance(oOpponent);
    var iZPlayerDistance = this._oPlayer.getRunDistance(oOpponent);
    
    var iZDifference = iZPlayerDistance - iZOpponentDistance;
    
    var iTrackLenght = this._oRoad.getTrackLength();
    
    var iPercentDifference = iZDifference/iTrackLenght*100;

    var iEnemySkill = oOpponent.getSkillLevel();
    
    
    var iLapRemaining = this._iTotLap - iCurLap;
    var iSkillBasedOnLapRemaining;
    if(iPercentDifference < 0){
        
        var iSkill = 0;
        if(iPercentDifference > -5){
            //PLAYER IS BEHIND, SET LESS DIFFICULTY
            iSkill = 0.5;
        }else if(iPercentDifference<-5){
            //PLAYER IS FAR MORE BEHIND, REDUCE MORE DIFFICULTY
            iSkill = 1;
        }
        
        iSkillBasedOnLapRemaining = linearFunction(iLapRemaining, 1,this._iTotLap, iSkill, 0);
        iEnemySkill -= iSkill + iSkillBasedOnLapRemaining;
        
    }else{
        //PLAYER IS FRONT, SET MORE DIFFICULTY
        var iSkill = 0;
        //IF IS LESS THEN 5% DISTANCE, THE DIFFICULTY IS GOOD
        if(iPercentDifference>5){
            iSkill = 0.5; 
        }
        if(iPercentDifference>50 && iPercentDifference<100){
            iSkill = 1; 
        }
        iSkillBasedOnLapRemaining = linearFunction(iLapRemaining, 1,this._iTotLap, 0, iSkill);
        
        iEnemySkill += iSkill + iSkillBasedOnLapRemaining;
    }

    oOpponent.setDifficultyParams(iEnemySkill)
};

CGameRace.prototype.playerLapCompleted = function(iCurLap){
    this._iCurPlayerLap = iCurLap;
    if(this._iCurPlayerLap >= this._iTotLap){
        ///END RACE
        this.trackCompleted();
    }else {

        this._iTimeElaps = 0;
    }
    this._oInterface.refreshLap(this._iCurPlayerLap, this._iTotLap);
};

CGameRace.prototype.playerRankChanged = function(iNewRank){
    this._oInterface.refreshRankPosition(iNewRank);
};

CGameRace.prototype.getRankList = function(){
    var iPlayerRunDistance = this._oPlayer.getRunDistance();
    
    var aDistanceList = new Array();
    for(var i=0; i<this._aEnemy.length; i++){
        aDistanceList.push(
                {
                    index:i,
                    distance:this._aEnemy[i].getRunDistance()
                });
    }
    aDistanceList.push({
                    index:"player",
                    distance:iPlayerRunDistance
                });

    aDistanceList.sort(function(a, b) { return b.distance - a.distance; });

    ///CONSIDER TO GET ALL THE ARRAY
    return aDistanceList;
};

CGameRace.prototype.refreshRanks = function(){
    this._aRankPositions = this.getRankList();
    for(var i=0; i<this._aRankPositions.length; i++){
        var oPlace = this._aRankPositions[i];
        var iRank = i+1;
        if(oPlace.index !== "player"){
            this._aEnemy[oPlace.index].setRank(iRank);
        }else{
            this._oPlayer.setRank(iRank);
        }
    }
};

CGameRace.prototype.trackCompleted = function(){
    if(this._iGameState === STATE_GAME_END){
        ///TIME ALREADY ENDS
        return;
    }
    $(s_oMain).trigger("end_level",this._iLevel);
    $(s_oMain).trigger("show_interlevel_ad");
    
    this._iGameState = STATE_GAME_END;

    s_oGame.stopPlayer();

   
    var iPlayerRank = this._oPlayer.getRank();

    //////NEXTLEVELPANEL
    if(iPlayerRank <= MIN_RANK_FOR_WIN){
        this._iScore = Math.floor(POINTS_PER_RANK[iPlayerRank-1]);
        var oNextLevelPanel = new CNextLevelPanel(iPlayerRank, this._iScore, this._iLevel); 
        
         
        
        if(this._iScore > s_aLevelScore[this._iLevel] ){
            s_aLevelScore[this._iLevel] = this._iScore;
            s_oLocalStorage.saveData();     
        }
        
        var iTotalScore = 0;
        for(var i=0; i<s_aLevelScore.length; i++){
            iTotalScore += s_aLevelScore[i];

        }
        $(s_oMain).trigger("save_score", iTotalScore);     
        
    }else{

        var oLosePanel = new CLosePanel(iPlayerRank);
        oLosePanel.show();
    }
    
};

CGameRace.prototype.updateOpponents = function(iDt){
    for(var i=0; i<this._aEnemy.length; i++){
        this._aEnemy[i].update(iDt, this._oPlayer);
    }
};

CGameRace.prototype.updateRace = function(iDt){
    this.updateOpponents(iDt);
                
    this.refreshRanks();
};
