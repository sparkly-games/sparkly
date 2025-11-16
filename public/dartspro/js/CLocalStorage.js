var PREFIX_STORAGE = "darts_pro_";

function setLocalStorageLevel(iLevel){
    if(s_iLastLevel < iLevel){
        s_iLastLevel = iLevel;
        saveItem(PREFIX_STORAGE+"level", s_iLastLevel);
    }
};

function setLocalStorageScore(iCurScore,iLevel){
    saveItem(PREFIX_STORAGE+"score_level_"+iLevel, iCurScore);
};

function setScoreSingleMode(iScore){
    saveItem(PREFIX_STORAGE+"score", iScore);
}

function setBestScoreSingleMode(iBest){
    saveItem(PREFIX_STORAGE+"best_score", iBest);
}

function clearLocalStorage(){
    s_iLastLevel = 1;
    if(s_bStorageAvailable){
        localStorage.clear();
    }
};

function getBestScoreSingleMode(){
    if(!s_bStorageAvailable){
        return 0;
    }
    
    var iBest = getItem(PREFIX_STORAGE+"best_score");
    if(iBest === null){
        return 0;
    }else{
        return iBest;
    }
};

function getLastLevel(){
    if(!s_bStorageAvailable){
        return 1;
    } 
    
    var iLevel = getItem(PREFIX_STORAGE+"level");
    
    if(iLevel === null){
        return 1;
    }else{
        return iLevel;
    }
};

function getScoreTillLevel(iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }

    var iScore = 0;
    for(var i=0;i<iLevel-1;i++){
        iScore += parseInt(getItem(PREFIX_STORAGE+"score_level_"+(i+1) ));
    }

    return iScore;
};