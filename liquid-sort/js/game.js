////////////////////////////////////////////////////////////
// GAME v1.7
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

var tubes_arr = [
	{
		imageBack:"page/liquid_sort4/assets/tube_back_01.png",
		imageFront:"page/liquid_sort4/assets/tube_front_01.png",
		regX:44,
		regY:310,
		fillW:50,
		fillH:250,
		tubeW:86,
		tubeH:300,
		perspective:true,
		shape:[
			{x:-25, y:-277},
			{x:-25, y:-141},
			{x:-25, y:-22},
			{x:-19, y:1},
			{x:1, y:0},
			{x:18, y:0},
			{x:25, y:-22},
			{x:25, y:-132},
			{x:25, y:-276},
			{x:1, y:-271},
			{x:-25, y:-277},
			],
	},

	{
		imageBack:"page/liquid_sort4/assets/tube_back_02.png",
		imageFront:"page/liquid_sort4/assets/tube_front_02.png",
		regX:44,
		regY:310,
		fillW:54,
		fillH:250,
		tubeW:86,
		tubeH:300,
		perspective:true,
		shape:[
			{x:-27, y:-287},
			{x:-27, y:-141},
			{x:-27, y:-27},
			{x:-25, y:-3},
			{x:1, y:-4},
			{x:26, y:-4},
			{x:27, y:-26},
			{x:27, y:-132},
			{x:27, y:-287},
			{x:1, y:-281},
			{x:-27, y:-287},
			],
	},

	{
		imageBack:"page/liquid_sort4/assets/tube_back_03.png",
		imageFront:"page/liquid_sort4/assets/tube_front_03.png",
		regX:104,
		regY:310,
		fillW:40,
		fillH:250,
		tubeW:205,
		tubeH:300,
		perspective:false,
		shape:[
			{x:-20, y:-287},
			{x:-20, y:-229},
			{x:-20, y:-172},
			{x:-20, y:-155},
			{x:-25, y:-144},
			{x:-53, y:-90},
			{x:-92, y:-19},
			{x:-99, y:-4},
			{x:-84, y:-5},
			{x:3, y:-4},
			{x:83, y:-5},
			{x:99, y:-2},
			{x:91, y:-18},
			{x:53, y:-90},
			{x:26, y:-141},
			{x:19, y:-154},
			{x:19, y:-171},
			{x:19, y:-287},
			{x:19, y:-287},
			{x:1, y:-285},
			{x:-20, y:-287},
			],
	},

	{
		imageBack:"page/liquid_sort4/assets/tube_back_04.png",
		imageFront:"page/liquid_sort4/assets/tube_front_04.png",
		regX:90,
		regY:310,
		fillW:150,
		fillH:250,
		tubeW:181,
		tubeH:300,
		perspective:false,
		shape:[
			{x:-75, y:-287},
			{x:-75, y:-141},
			{x:-75, y:-22},
			{x:-74, y:-3},
			{x:-50, y:-3},
			{x:3, y:-3},
			{x:50, y:-3},
			{x:76, y:-5},
			{x:75, y:-22},
			{x:75, y:-132},
			{x:76, y:-287},
			{x:1, y:-278},
			{x:-75, y:-287},
			],
	},

	{
		imageBack:"page/liquid_sort4/assets/tube_back_05.png",
		imageFront:"page/liquid_sort4/assets/tube_front_05.png",
		regX:96,
		regY:310,
		fillW:40,
		fillH:250,
		tubeW:192,
		tubeH:300,
		perspective:false,
		shape:[
			{x:-20, y:-287},
			{x:-20, y:-229},
			{x:-20, y:-182},
			{x:-63, y:-172},
			{x:-81, y:-133},
			{x:-101, y:-94},
			{x:-79, y:-50},
			{x:-57, y:-9},
			{x:-2, y:-2},
			{x:50, y:-5},
			{x:73, y:-41},
			{x:103, y:-84},
			{x:81, y:-134},
			{x:62, y:-173},
			{x:20, y:-182},
			{x:20, y:-232},
			{x:20, y:-287},
			],
	},

	{
		imageBack:"page/liquid_sort4/assets/tube_back_06.png",
		imageFront:"page/liquid_sort4/assets/tube_front_06.png",
		regX:44,
		regY:310,
		fillW:54,
		fillH:250,
		tubeW:86,
		tubeH:300,
		perspective:false,
		shape:[
			{x:-27, y:-287},
			{x:-27, y:-141},
			{x:-27, y:-27},
			{x:-25, y:-3},
			{x:1, y:-4},
			{x:26, y:-4},
			{x:27, y:-26},
			{x:27, y:-132},
			{x:27, y:-287},
			{x:1, y:-281},
			{x:-27, y:-287},
			],
	},
];

var bubbles_arr = [
	"page/liquid_sort4/assets/bubble_01.png",
	"page/liquid_sort4/assets/bubble_02.png",
	"page/liquid_sort4/assets/bubble_03.png",
	"page/liquid_sort4/assets/bubble_04.png",
	"page/liquid_sort4/assets/bubble_05.png",
];

var colors_arr = [
	{fill:"#07E021", surface:"#64FF76"},
	{fill:"#8D06C6", surface:"#9A29D6"},
	{fill:"#B51D1D", surface:"#DD4545"},
	{fill:"#E27C03", surface:"#F5AA1B"},
	{fill:"#203DE5", surface:"#4363ED"},
	{fill:"#0EC1C1", surface:"#20DEE2"},
	{fill:"#0ABF71", surface:"#27D894"},
	{fill:"#DD0AA6", surface:"#EF2EC6"},
	{fill:"#B5B5B5", surface:"#D6D6D6"},
	{fill:"#333333", surface:"#545454"},
	{fill:"#CCBE06", surface:"#EDE14C"},
	{fill:"#CC50A9", surface:"#E073C7"},
];

//game settings
var gameSettings = {
	timer:{
		color:"#fff",
		width:400,
		height:5,
		radius:3
	},
	score:30,
	moveSpeed:.2,
	fillSpeed:.8,
	autoFill:true, //auto fill last tube color
}

//game text display
var textDisplay = {
					selectTube:"SELECT TUBE",
					selectLevel:"SELECT LEVEL",
					level:"LVL[NUMBER]",
					clear:"LVL[NUMBER] CLEAR",
					score:"[NUMBER]PTS",
					timesup:"TIME\'S UP!",
					exitTitle:'EXIT GAME',
					exitMessage:'ARE YOU SURE\nYOU WANT TO\nQUIT THE GAME?',
					share:'SHARE YOUR SCORE',
					resultTitle:'GAME OVER',
					resultLevelTitle:'LEVEL [NUMBER]',
					resultDesc:'[NUMBER]PTS'
				}

//Social share, [SCORE] will replace with game score
var shareEnable = false; //toggle share
var shareTitle = 'Highscore on Liquid Sort is [SCORE]PTS';//social share score title
var shareMessage = '[SCORE]PTS is mine new highscore on Liquid Sort Game game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0};
var gameData = {paused:true, action:false, tubes:[], colorsArr:[], colorIndex:0, tubesArr:[], tubesArrIndex:0, stageNum:0, stage:{}, levelNum:0, challengeNum:0, tubeNum:0, complete:false, levelCompleted:1};
var tweenData = {score:0, tweenScore:0};
var timeData = {enable:false, startDate:null, sessionDate:null, nowDate:null, sessionTimer:0, timer:0, oldTimer:0, accumulate:0};
var selectData = {page:0, total:1, max:20, column:5, row:4};
var cookieName = 'liquidsort2022';

/*!
 * 
 * DATA UPDATE - This is the function that runs to update data
 * 
 */
function retrieveLevelData(){
	var curLevel = Cookies.get(cookieName);
	if(curLevel != undefined){
		gameData.levelCompleted = Number(curLevel);
		gameData.levelCompleted = gameData.levelCompleted >= levelSettings.length ? levelSettings.length : gameData.levelCompleted;
		findSelectPage(gameData.levelCompleted);
	}
}

function saveLevelData(){
	if(Number(gameData.levelNum) >= gameData.levelCompleted){
		gameData.levelCompleted = Number(gameData.levelNum)+1;
		gameData.levelCompleted = gameData.levelCompleted >= levelSettings.length ? levelSettings.length : gameData.levelCompleted;
		Cookies.set(cookieName, gameData.levelCompleted, {expires:360});
	}
}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		gameData.type = "challenge";
		playSound('soundButton');
		goPage('select');
	});

	buttonLevels.cursor = "pointer";
	buttonLevels.addEventListener("click", function(evt) {
		gameData.type = "level";
		playSound('soundButton');
		goPage('level');
	});

	buttonLevelArrowL.cursor = "pointer";
	buttonLevelArrowL.addEventListener("click", function(evt) {
		toggleSelect(false);
	});

	buttonLevelArrowR.cursor = "pointer";
	buttonLevelArrowR.addEventListener("click", function(evt) {
		toggleSelect(true);
	});

	buttonSelect.cursor = "pointer";
	buttonSelect.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('game');
	});

	buttonBack.cursor = "pointer";
	buttonBack.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});

	buttonArrowL.cursor = "pointer";
	buttonArrowL.addEventListener("click", function(evt) {
		playSound('soundMatch');
		toggleTube(false);
	});

	buttonArrowR.cursor = "pointer";
	buttonArrowR.addEventListener("click", function(evt) {
		playSound('soundMatch');
		toggleTube(true);
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		if(gameData.type == "level"){
			goPage('level');
		}else{
			goPage('main');
		}
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	for(var n=0; n<tubes_arr.length; n++){
		gameData.tubesArr.push(n);
	}

	for(var n=0; n<colors_arr.length; n++){
		gameData.colorsArr.push(n);
	}

	shuffle(gameData.tubesArr);
	buildSelectLevel();
}

function toggleTube(con){
	if(con){
		gameData.tubeNum++;
		gameData.tubeNum = gameData.tubeNum > tubes_arr.length-1 ? 0 : gameData.tubeNum;
	}else{
		gameData.tubeNum--;
		gameData.tubeNum = gameData.tubeNum < 0 ? tubes_arr.length-1 : gameData.tubeNum;
	}

	selectTube();
}

function selectTube(){
	var randomColor = Math.floor(Math.random()*colors_arr.length);

	prepareStage();
	createTube(0,0);
	pushColours(0,randomColor,tubes_arr[gameData.tubeNum].fillH);
	fillLiquid(0);
	updateTubeData(gameData.tubes[0]);

	gameData.tubes[0].scaleX = gameData.tubes[0].scaleY = .8;
	gameData.offsetY = (tubes_arr[gameData.tubeNum].fillH/2) * .8;

}

/*!
 * 
 * SELECT LEVEL - This is the function that runs to display select levels
 * 
 */
function buildSelectLevel(){
	selectData.total = levelSettings.length/selectData.max;
	
	if (String(selectData.total).indexOf('.') > -1){
		selectData.total=Math.floor(selectData.total)+1;
	}
	toggleSelect(false);
	for(var r=0; r<selectData.row; r++){
		for(var c=0; c<selectData.column; c++){
			$.level[r+'_unlock_'+c].cursor = "pointer";
			$.level[r+'_unlock_'+c].addEventListener("click", function(evt) {
				gameData.levelNum = Number(evt.target.text.text) - 1;
				playSound('soundButton');
				goPage("select");
			});
		}
	}
}

function toggleSelect(con){
	if(con){
		selectData.page++;
		selectData.page = selectData.page > selectData.total ? selectData.total : selectData.page;
	}else{
		selectData.page--;
		selectData.page = selectData.page < 1 ? 1 : selectData.page;
	}
	selectPage(selectData.page);
}

function selectPage(num){
	selectData.page = num;
	selectData.page = selectData.page < 1 ? 1 : selectData.page;
	
	var startNum = (selectData.page-1) * selectData.max;
	for(var r=0; r<selectData.row; r++){
		for(var c=0; c<selectData.column; c++){
			$.level[r+'_unlock_'+c].visible = false;
			if(startNum < levelSettings.length){
				$.level[r+'_text_'+c].text = startNum+1;
				$.level[r+'_unlock_'+c].text.visible = true;
				$.level[r+'_'+c].visible = true;
			}else{
				$.level[r+'_'+c].visible = false;
				$.level[r+'_unlock_'+c].text.visible = false;
			}

			if((startNum) < gameData.levelCompleted){
				if(gameData.revealLevel && (gameData.levelNum+1) == $.level[r+'_text_'+c].text){
					unlockLevelTween(r,c);
				}else{
					$.level[r+'_unlock_'+c].visible = true;
				}
			}
			startNum++;
		}
	}
	
	if(selectData.page == 1){
		buttonLevelArrowL.visible = false;
	}else{
		buttonLevelArrowL.visible = true;
	}
	
	if(selectData.page == selectData.total || selectData.total == 1){
		buttonLevelArrowR.visible = false;
	}else{
		buttonLevelArrowR.visible = true;
	}
}

function unlockLevelTween(r,c){
	gameData.revealLevel = false;
	$.level[r+'_unlock_'+c].visible = true;
	$.level[r+'_unlock_'+c].alpha = 0;

	TweenMax.to($.level[r+'_unlock_'+c], .2, {delay:.5, alpha:1, scaleX:1.2, scaleY:1.2, overwrite:true, onComplete:function(){
		TweenMax.to($.level[r+'_unlock_'+c], .2, {alpha:1, scaleX:1, scaleY:1, overwrite:true});
	}});
}

function findSelectPage(level){
	for(var n=0; n<10; n++){
		var startNum = (n+1) * selectData.max;
		if(level <= startNum){
			selectData.page = n+1;
			n = 10;
		}
	}
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	levelContainer.visible = false;
	selectContainer.visible = false;
	gameContainer.visible = false;
	waterContainer.visible = false;
	resultContainer.visible = false;
	stopMusicLoop("musicGame");

	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			playMusicLoop("musicMain");
		break;

		case 'level':
			targetContainer = levelContainer;
			selectPage(selectData.page);
		break;

		case 'select':
			targetContainer = selectContainer;
			waterContainer.visible = true;
			selectTube();
		break;
		
		case 'game':
			targetContainer = gameContainer;
			waterContainer.visible = true;
			startGame();
			if(!$.editor.enable){
				stopMusicLoop("musicMain");
				playMusicLoop("musicGame");
			}
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			playSound('soundResult');
			if(gameData.type == "level"){
				resultTitleTxt.text = textDisplay.resultLevelTitle.replace("[NUMBER]", gameData.challengeNum);
			}else{
				resultTitleTxt.text = textDisplay.resultTitle;
			}

			tweenData.tweenScore = 0;
			TweenMax.to(tweenData, .5, {tweenScore:playerData.score, overwrite:true, onUpdate:function(){
				resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', addCommas(Math.floor(tweenData.tweenScore)));
			}});
			saveGame(playerData.score);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	if($.editor.enable){
		return;
	}
	
	gameData.paused = false;
	gameData.action = false;
	gameData.offsetY = 0;
	gameData.resize = false;

	if(gameData.type == "challenge"){
		gameData.levelNum = 0;
	}
	gameData.challengeNum = gameData.levelNum+1;

	setupStage();
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll(false, true, false);
	toggleGameTimer(false);
	waterContainer.removeAllChildren();
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

function resizeGameUI(){
	waterContainer.x = canvasW/2;
	waterContainer.y = canvasH/2 + gameData.offsetY;
	editContainer.x = canvasW/2;
	editContainer.y = canvasH/2 + gameData.offsetY;

	levelDisplayContainer.x = offset.x + 100;
	levelDisplayContainer.y = offset.y + 40;

	levelContainer.x = canvasW/2;
	levelContainer.y = canvasH/2;

	if(viewport.isLandscape){
		timerShape.x = timerShapeBg.x = (canvasW/2) - (gameSettings.timer.width/2);
		timerShape.y = timerShapeBg.y = canvasH/100 * 85;

		statusContainer.x = canvasW/2;
		statusContainer.y = timerShape.y - 20;

		selectLevelTitleTxt.y = -(canvasH/100 * 25);
		buttonLevelArrowL.x = -300;
		buttonLevelArrowR.x = 300;
		buttonLevelArrowL.y = 0;
		buttonLevelArrowR.y = 0;

		buttonBack.y = canvasH/100 * 30;
	}else{
		timerShape.x = timerShapeBg.x = (canvasW/2) - (gameSettings.timer.width/2);
		timerShape.y = timerShapeBg.y = canvasH/100 * 92;

		statusContainer.x = canvasW/2;
		statusContainer.y = timerShape.y - 20;

		selectLevelTitleTxt.y = -(canvasH/100 * 25);
		buttonLevelArrowL.x = -270;
		buttonLevelArrowR.x = 270;
		buttonLevelArrowL.y = 0;
		buttonLevelArrowR.y = 0;

		buttonBack.y = canvasH/100 * 30;
	}

	if(curPage == 'game'){
		if(gameData.filling){
			gameData.resize = true;
		}else{
			positionTubes();
		}
	}
}

function positionTubes(){
	if($.editor.enable && edit.option == 'tubes'){
		return;
	}

	if(gameData.tube == undefined){
		return;
	}

	var positionData = {x:0, y:0, sX:0, sY:0, col:0, width:0, height:0, totalTubes:0, totalCol:0, totalRow:0, totalWidth:0, totalHeight:0};

	positionData.totalTubes = gameData.tubes.length;
	if(viewport.isLandscape){
		gameData.marginX = levelSettings[gameData.levelNum].marginX;
		gameData.marginY = levelSettings[gameData.levelNum].marginY;
		positionData.totalCol = levelSettings[gameData.levelNum].column;
	}else{
		gameData.marginX = levelSettings[gameData.levelNum].portrait.marginX;
		gameData.marginY = levelSettings[gameData.levelNum].portrait.marginY;
		positionData.totalCol = levelSettings[gameData.levelNum].portrait.column;
	}

	positionData.width = gameData.tube.w;
	positionData.height = gameData.tube.h;

	positionData.totalRow = positionData.totalTubes/positionData.totalCol;
	if (String(positionData.totalRow).indexOf('.') > -1){
		positionData.totalRow=Math.floor(positionData.totalRow)+1;
	}
	positionData.totalWidth = (positionData.totalCol-1) * (positionData.width + gameData.marginX);
	positionData.totalHeight = (positionData.totalRow-1) * (positionData.height + gameData.marginY);
	positionData.sX = -(positionData.totalWidth/2);
	positionData.sY = -(positionData.totalHeight/2);

	positionData.x = positionData.sX;
	positionData.y = positionData.sY;
	
	for(var n=0; n<gameData.tubes.length; n++){
		var thisTube = gameData.tubes[n];
		thisTube.x = thisTube.data.x = positionData.x;
		thisTube.y = thisTube.data.y = positionData.y + ((positionData.height/2));
		positionData.x += positionData.width + gameData.marginX;

		positionData.col++;
		if(positionData.col > positionData.totalCol-1){
			positionData.col = 0;

			var leftTubes = gameData.tubes.length - (n+1);
			if(leftTubes <= positionData.totalCol){
				var lastRowWidth = (leftTubes-1) * (positionData.width + gameData.marginX);
				positionData.sX = -(lastRowWidth/2);
			}
			
			positionData.x = positionData.sX;
			positionData.y += positionData.height + gameData.marginY;
		}
	}

	var finalW = positionData.totalWidth + positionData.width + gameData.marginX;
	var finalH = positionData.totalHeight + positionData.height + gameData.marginY;
	var maxWidth = 1000;
	var maxHeight = 500;
	var scaleX = 1;
	var scaleY = 1;
	
	if(viewport.isLandscape){
		
	}else{
		maxWidth = 500;
		maxHeight = 800;
	}

	if(finalW > maxWidth){
		scaleX = maxWidth/finalW;
	}

	if(finalH > maxHeight){
		scaleY = maxHeight/finalH;
	}

	gameData.scale = 1;
	gameData.scale = scaleX > scaleY ? scaleY : scaleX;
	waterContainer.scaleX = waterContainer.scaleY = gameData.scale;
}

/*!
 * 
 * PREPARE STAGE - This is the function that runs to prepare stage
 * 
 */
function prepareStage(){
	tweenData.tweenScore = 0;
	statusTxt.text = '';

	waterContainer.removeAllChildren();
	timerContainer.visible = false;

	gameData.tubes = [];
	gameData.pouring = [];
	gameData.filling = false;

	gameData.tube = {w:0, h:0, colorW:0, fillW:0, fillH:0, fillX:0, fillY:0, fillPercent:0, pourW:10, pourH:0, surfaceScale:.3};
	gameData.tube.w = tubes_arr[gameData.tubeNum].tubeW;
	gameData.tube.h = tubes_arr[gameData.tubeNum].tubeH;
	gameData.tube.fillW = tubes_arr[gameData.tubeNum].fillW;
	gameData.tube.fillH = tubes_arr[gameData.tubeNum].fillH;

	gameData.tube.fillPercent = gameData.tube.fillH + 150;
	gameData.tube.colorW = gameData.tube.fillH*3;
	gameData.tube.fillX = gameData.tube.fillW/1.5; //tube fill position x
	gameData.tube.fillY = gameData.tube.h + (gameData.tube.fillW * 1.5); //tube fill position y
	gameData.tube.pourH = gameData.tube.h + (gameData.tube.fillW * 1.05);

	gameData.stage.timer = levelSettings[gameData.levelNum].timer;
	gameData.stage.score = levelSettings[gameData.levelNum].score;
	timeData.countdown = levelSettings[gameData.levelNum].timer;
}

/*!
 * 
 * SETUP STAGE - This is the function that runs to setup stage
 * 
 */
function setupStage(){
	prepareStage();
	
	/*createTube(-50, 50);
	createTube(50, 50);
	createTube(150, 50);
	createTube(200, 50);

	pushColours(0, 0, 124);
	pushColours(0, 1, 124);
	pushColours(1, 1, 124);
	pushColours(2, 0, 62);
	pushColours(3, 0, 62);

	fillLiquid(0);
	fillLiquid(1);
	fillLiquid(2);
	fillLiquid(3);

	updateTubeData(gameData.tubes[0]);
	updateTubeData(gameData.tubes[1]);
	updateTubeData(gameData.tubes[2]);
	updateTubeData(gameData.tubes[3]);*/

	for(var n=0; n<levelSettings[gameData.levelNum].tubes; n++){
		createTube(0,0);
	}

	fillAllTubes();
	resizeGameUI();

	updateGameLevel();
	
	waterContainer.alpha = 0;
	if(!$.editor.enable){
		TweenMax.to(waterContainer, 1, {alpha:1, overwrite:true, onComplete:function(){
			gameData.action = true;
			playSound('soundStart');
			timerContainer.visible = true;
			toggleGameTimer(true);
			toggleGameSessionTimer(true);
		}});
	}else{
		waterContainer.alpha = 1;
	}
}

function fillAllTubes(){
	var emptyTubesArr = [];
	var tubeArr = [];
	var storeColorArr = [];

	//store empty tubes
	var totalEmpty = levelSettings[gameData.levelNum].empty;
	totalEmpty = totalEmpty < 0 ? 1 : totalEmpty;

	for(var n=0; n<gameData.tubes.length; n++){
		tubeArr.push(n);
	}
	shuffle(tubeArr);
	for(var n=0; n<totalEmpty; n++){
		emptyTubesArr.push(tubeArr[n]);
	}

	//store tubes
	tubeArr = [];
	for(var n=0; n<gameData.tubes.length; n++){
		if(emptyTubesArr.indexOf(n) == -1){
			tubeArr.push(n);
		}
	}

	//store colors
	gameData.colorIndex = 0;
	shuffle(gameData.colorsArr);
	for(var n=0; n<tubeArr.length; n++){
		var colorIndex = getTubeColor();
		for(var l=0; l<levelSettings[gameData.levelNum].levels; l++){
			var heightNum = Math.floor(gameData.tube.fillH / levelSettings[gameData.levelNum].levels);
			storeColorArr.push({height:heightNum, color:colorIndex});
		}
	}

	//insert store colors to tubes
	shuffle(storeColorArr);
	shuffle(tubeArr);
	  
	var tubeIndex = 0;
	for(var n=0; n<storeColorArr.length; n++){
		var tubeIndex = tubeArr[tubeIndex];
		var thisTube = gameData.tubes[tubeIndex];

		if(thisTube.data.fill + storeColorArr[n].height <= gameData.tube.fillH){
			thisTube.data.fill += storeColorArr[n].height;
			pushColours(tubeIndex, storeColorArr[n].color, storeColorArr[n].height);
		}else{
			n--;
		}

		tubeIndex++;
		if(tubeIndex > tubeArr.length-1){
			tubeIndex = 0;
			shuffle(tubeArr);
		}
	}

	//fill tubes
	for(var n=0; n<tubeArr.length; n++){
		var tubeIndex = tubeArr[n];

		mixSameLiquid(tubeIndex);
		fillLiquid(tubeIndex);
		updateTubeData(gameData.tubes[tubeIndex]);
	}

	if(checkLiquidComplete(false)){
		setupStage();
	};
}

function getTubeColor(){
	var colourIndex = gameData.colorsArr[gameData.colorIndex];
	gameData.colorIndex++;
	if(gameData.colorIndex > gameData.colorsArr.length-1){
		gameData.colorIndex = 0;
		shuffle(gameData.colorsArr);
	}

	return colourIndex;
}

function pushColours(index, color, height){
	var thisLiquid = gameData.tubes[index];
	thisLiquid.data.colors.push({shape:null, surface:null, bottom:null, index:color, height:height});
}

/*!
 * 
 * CREATE TUBE - This is the function that runs to create tube
 * 
 */
function createTube(x, y){
	var newLiquidContainer = new createjs.Container();
	newLiquidContainer.active = true;
	newLiquidContainer.data = {active:true, index:gameData.tubes.length, x:x, y:y, fill:0, fillShape:null, container:null, bubble:[], bottom:null, surface:null, colors:[], imageBack:null, imageFront:null, mask:null, direction:"", temp:[]};

	if($.editor.enable && edit.option == 'tubes'){
		newLiquidContainer.data.imageBack = new createjs.Bitmap(tubeLoader.getResult('tubeBack' + gameData.tubeNum));
		newLiquidContainer.data.imageFront = new createjs.Bitmap(tubeLoader.getResult('tubeFront' + gameData.tubeNum));
	}else{
		newLiquidContainer.data.imageBack = new createjs.Bitmap(loader.getResult('tubeBack' + gameData.tubeNum));
		newLiquidContainer.data.imageFront = new createjs.Bitmap(loader.getResult('tubeFront' + gameData.tubeNum));
	}

	newLiquidContainer.data.imageBack.regX = tubes_arr[gameData.tubeNum].regX;
	newLiquidContainer.data.imageBack.regY = tubes_arr[gameData.tubeNum].regY;
	newLiquidContainer.data.imageFront.regX = tubes_arr[gameData.tubeNum].regX;
	newLiquidContainer.data.imageFront.regY = tubes_arr[gameData.tubeNum].regY;

	newLiquidContainer.data.fillShape = new createjs.Shape();
	newLiquidContainer.data.fillShape.visible = false;

	newLiquidContainer.data.mask = new createjs.Shape();
	newLiquidContainer.data.mask.graphics.beginFill("#ccff00").moveTo(tubes_arr[gameData.tubeNum].shape[0].x, tubes_arr[gameData.tubeNum].shape[0].y);
	for(var n=0;n<tubes_arr[gameData.tubeNum].shape.length;n++){
		if(tubes_arr[gameData.tubeNum].shape.length - n > 2 && isEven(n)){
			newLiquidContainer.data.mask.graphics.curveTo(tubes_arr[gameData.tubeNum].shape[n+1].x, tubes_arr[gameData.tubeNum].shape[n+1].y, tubes_arr[gameData.tubeNum].shape[n+2].x, tubes_arr[gameData.tubeNum].shape[n+2].y);
		}
	}

	var liquidWaterContainer = new createjs.Container();
	var liquidSurfaceContainer = new createjs.Container();
	var liquidBottomContainer = new createjs.Container();
	var liquidBubbleContainer = new createjs.Container();
	newLiquidContainer.data.container = liquidWaterContainer;
	newLiquidContainer.data.surface = liquidSurfaceContainer;
	newLiquidContainer.data.bottom = liquidBottomContainer;
	newLiquidContainer.data.bubble = liquidBubbleContainer;
	liquidWaterContainer.mask = newLiquidContainer.data.mask;
	liquidSurfaceContainer.mask = newLiquidContainer.data.mask;
	liquidBottomContainer.mask = newLiquidContainer.data.mask;
	liquidBubbleContainer.mask = newLiquidContainer.data.mask;

	newLiquidContainer.addChild(newLiquidContainer.data.imageBack, newLiquidContainer.data.fillShape, liquidWaterContainer, liquidBottomContainer, liquidSurfaceContainer, newLiquidContainer.data.bubble, newLiquidContainer.data.imageFront);
	newLiquidContainer.x = x;
	newLiquidContainer.y = y;
	
	var newShape = new createjs.Shape()
	newLiquidContainer.data.temp.push(newShape);
	var newShape = new createjs.Shape()
	newLiquidContainer.data.temp.push(newShape);
	var newShape = new createjs.Shape()
	newLiquidContainer.data.temp.push(newShape);

	gameData.tubes.push(newLiquidContainer);
	waterContainer.addChild(newLiquidContainer);

	var tubeEvent = true;
	if($.editor.enable){
		tubeEvent = false;
	}

	if(curPage != "game"){
		tubeEvent = false;
	}

	if(tubeEvent){
		newLiquidContainer.cursor = "pointer";
		newLiquidContainer.addEventListener("click", function(evt) {
			if(gameData.paused){
				return;
			}

			if(!gameData.action){
				return;
			}

			if(!evt.currentTarget.data.active){
				return;
			}

			actionTube(evt.currentTarget);
		});
	}
}

function actionTube(obj){
	var pourIndex = getPouringIndex();
	if(gameData.pouring[pourIndex].from == null){
		if(obj.data.colors.length > 0){
			gameData.pouring[pourIndex].from = obj;
			focusTube(gameData.pouring[pourIndex].from, true);
			waterContainer.setChildIndex(gameData.pouring[pourIndex].from, waterContainer.numChildren-1);
			playSound("soundSelect");
		}
	}else if(gameData.pouring[pourIndex].from.data.index == obj.data.index){
		playSound("soundError");
		focusTube(gameData.pouring[pourIndex].from, false);
		gameData.pouring[pourIndex].from = null;
	}else if(gameData.pouring[pourIndex].to == null){
		gameData.pouring[pourIndex].to = obj;
		if(gameData.pouring[pourIndex].from.data.index != obj.data.index){
			var shapeIndex = gameData.pouring[pourIndex].from.data.colors.length-1;
			var thisHeight = gameData.pouring[pourIndex].from.data.colors[shapeIndex].height;

			if(gameData.pouring[pourIndex].to.data.fill + thisHeight <= gameData.tube.fillH){
				moveTube(pourIndex);
				focusTube(gameData.pouring[pourIndex].to, false);
			}else{
				playSound("soundError");
				focusTube(gameData.pouring[pourIndex].from, false);
				gameData.pouring[pourIndex].from = null;
				gameData.pouring[pourIndex].to = null;
			}
		}else{
			playSound("soundError");
			gameData.pouring[pourIndex].to = null;
		}
	}
}

function getPouringIndex(){
	var pushNewArr = false;
	var pourIndex = gameData.pouring.length-1;

	if(gameData.pouring.length == 0){
		pushNewArr = true;
	}else if(gameData.pouring[pourIndex].from == null || gameData.pouring[pourIndex].to == null){

	}else{
		pushNewArr = true;
	}

	if(pushNewArr){
		gameData.pouring.push({from:null, to:null, filling:false, complete:false});
		pourIndex = gameData.pouring.length-1;
	}

	return pourIndex;
}

function clearPourArray(){
	var filling = false;
	for(var n=0; n<gameData.pouring.length; n++){
		if(gameData.pouring[n].filling){
			filling = true;
		}
	}

	if(!filling){
		for(var n=0; n<gameData.pouring.length; n++){
			if(gameData.pouring[n].complete){
				gameData.pouring.splice(n,1);
			}
		}
	}
}

/*!
 * 
 * FILL LIQUID - This is the function that runs to fill liquid
 * 
 */
function mixSameLiquid(index){
	var thisLiquid = gameData.tubes[index];
	var currentIndex = 0;
	
	for(var n=0; n<thisLiquid.data.colors.length; n++){
		if(n>0){
			if(thisLiquid.data.colors[currentIndex].index == thisLiquid.data.colors[n].index){
				thisLiquid.data.colors[currentIndex].height += thisLiquid.data.colors[n].height;
				thisLiquid.data.colors.splice(n,1);
				n--;
			}else{
				currentIndex = n;
			}
		}
	}
}

function fillLiquid(index){
	var thisLiquid = gameData.tubes[index];
	thisLiquid.data.bottom.removeAllChildren();
	thisLiquid.data.surface.removeAllChildren();
	thisLiquid.data.container.removeAllChildren();
	
	var pos = {x:0, y:0, w:gameData.tube.colorW};
	for(var n=0; n<thisLiquid.data.colors.length; n++){
		var thisArray = thisLiquid.data.colors[n];
		thisArray.shape = new createjs.Shape();

		thisArray.shape.extraH = n == 0 ? gameData.tube.fillH/2 : 0;
		thisArray.shape.graphics.beginFill(colors_arr[thisLiquid.data.colors[n].index].fill).drawRect(-(pos.w/2), thisArray.shape.extraH, (pos.w), -(thisArray.height+thisArray.shape.extraH));
		thisArray.shape.fillH = -thisArray.height;
		thisArray.shape.color = thisLiquid.data.colors[n].index;

		thisArray.surface = new createjs.Shape();
		thisArray.surface.graphics.beginFill(colors_arr[thisLiquid.data.colors[n].index].surface).drawCircle(0, 0, gameData.tube.fillW/2);
		thisArray.surface.color = thisLiquid.data.colors[n].index;

		thisArray.bottom = new createjs.Shape();
		thisArray.bottom.graphics.beginFill(colors_arr[thisLiquid.data.colors[n].index].fill).drawCircle(0, 0, gameData.tube.fillW/2);
		thisArray.bottom.color = thisLiquid.data.colors[n].index;

		thisArray.surface.scaleY = thisArray.bottom.scaleY = gameData.tube.surfaceScale;
		thisArray.surface.visible = n == thisLiquid.data.colors.length-1 ? true : false;
		thisArray.bottom.visible = n == 0 ? false : true;

		if(!tubes_arr[gameData.tubeNum].perspective){
			thisArray.surface.visible = false;
			thisArray.bottom.visible = false;
		}
		
		thisArray.shape.y = pos.y;
		thisArray.bottom.y = pos.y;

		pos.y -= thisArray.height;
		thisArray.surface.y = pos.y;

		thisLiquid.data.fill = Math.abs(pos.y);
		thisLiquid.data.surface.addChild(thisArray.surface);
		thisLiquid.data.bottom.addChild(thisArray.bottom);
		thisLiquid.data.container.addChild(thisArray.shape);
	}
}

/*!
 * 
 * MOVE TUBE - This is the function that runs to move tube
 * 
 */
function focusTube(obj, con){
	var posY = con == true ? obj.data.y - 50 : obj.data.y;
	TweenMax.to(obj, .2, {y:posY, overwrite:true});
}

function moveTube(pourIndex){
	playSound('soundMatch');
	var thisLiquid = gameData.pouring[pourIndex].from;
	var thisFillLiquid = gameData.pouring[pourIndex].to;
	thisLiquid.data.active = false;
	thisFillLiquid.data.active = false;

	gameData.pouring[pourIndex].filling = true;

	thisLiquid.data.direction = thisLiquid.x > thisFillLiquid.x ? "right" : "left";
	updateTubeData(thisLiquid);
	updateTubeData(thisFillLiquid);

	var pos = {x:0, y:0};
	if(thisLiquid.data.direction == "left"){
		pos.x = ((thisFillLiquid.x - (gameData.tube.fillX)) - thisLiquid.data.tubePos.x) + thisLiquid.data.containerY;
	}else{
		pos.x = ((thisFillLiquid.x + (gameData.tube.fillX)) - thisLiquid.data.tubePos.x) - thisLiquid.data.containerY;
	}

	pos.y = (thisFillLiquid.y - thisLiquid.data.tubePos.y) - (gameData.tube.fillY);

	TweenMax.to(thisLiquid, gameSettings.moveSpeed, {x:pos.x, y:pos.y, ease:Linear.easeNone, overwrite:true, onUpdate:function(){
		updateTubeData(thisLiquid);
		updateTubeData(thisFillLiquid);
	}, onComplete:function(){
		pourLiquid(pourIndex);
	}});
	TweenMax.to(thisLiquid.data.mask, gameSettings.moveSpeed, {rotation:thisLiquid.data.rotateNum, ease:Linear.easeNone, overwrite:true});
	TweenMax.to(thisLiquid.data.imageBack, gameSettings.moveSpeed, {rotation:thisLiquid.data.rotateNum, ease:Linear.easeNone, overwrite:true});
	TweenMax.to(thisLiquid.data.imageFront, gameSettings.moveSpeed, {rotation:thisLiquid.data.rotateNum, ease:Linear.easeNone, overwrite:true});
	TweenMax.to(thisLiquid.data.container, gameSettings.moveSpeed, {y:thisLiquid.data.containerY, ease:Linear.easeNone, overwrite:true});
}

/*!
 * 
 * POUR LIQUID - This is the function that runs to pour liquid
 * 
 */
function pourLiquid(pourIndex){
	var randomPour = Math.floor(Math.random()*3)+1;
	playSound('soundPour' + randomPour);
	gameData.filling = true;

	var thisLiquid = gameData.pouring[pourIndex].from;
	var thisFillLiquid = gameData.pouring[pourIndex].to;

	//from
	var shapeIndex = thisLiquid.data.colors.length-1;
	var thisShape = thisLiquid.data.colors[shapeIndex].shape;
	var thisSurface = thisLiquid.data.colors[shapeIndex].surface;
	var colorIndex = thisShape.color;
	
	TweenMax.to(thisShape, gameSettings.fillSpeed, {fillH:0, overwrite:true, ease:Linear.easeNone, onUpdate:function(){
		thisLiquid.data.fill = Math.abs(thisShape.y + thisShape.fillH);
		thisShape.graphics.clear().beginFill(colors_arr[colorIndex].fill).drawRect(-(gameData.tube.colorW/2), thisShape.extraH, (gameData.tube.colorW), thisShape.fillH-thisShape.extraH);
		thisSurface.y = thisShape.y + thisShape.fillH;
		updateLiquid(pourIndex);
		updateTubeData(thisLiquid);
		updateTubeData(thisFillLiquid);
		updateFilling(pourIndex);
	},onComplete:pourLiquidComplete, onCompleteParams:[pourIndex]});

	//to
	pushColours(thisFillLiquid.data.index, colorIndex, 0);
	fillLiquid(thisFillLiquid.data.index);

	var shapeFillIndex = thisFillLiquid.data.colors.length-1;
	var thisFillShape = thisFillLiquid.data.colors[shapeFillIndex].shape;
	thisFillLiquid.data.fillShape.graphics.clear().setStrokeStyle(gameData.tube.pourW, 'round', 'round').beginStroke(colors_arr[colorIndex].fill).mt(0,0).lt(0,-gameData.tube.pourH);

	TweenMax.to(thisFillShape, gameSettings.fillSpeed, {fillH:thisShape.fillH, overwrite:true, ease:Linear.easeNone, onUpdate:function(){
		thisFillLiquid.data.fill = Math.abs(thisFillShape.y + thisFillShape.fillH);
		thisFillShape.graphics.clear().beginFill(colors_arr[colorIndex].fill).drawRect(-(gameData.tube.colorW/2), 0, (gameData.tube.colorW), thisFillShape.fillH);
	}, onComplete:function(){
		thisFillLiquid.data.colors[thisFillLiquid.data.colors.length-1].height = Math.abs(thisFillShape.fillH);
	}});

	waterContainer.setChildIndex(thisLiquid, waterContainer.numChildren-1);
	waterContainer.setChildIndex(thisFillLiquid, waterContainer.numChildren-1);
}

function pourLiquidComplete(pourIndex){
	var thisLiquid = gameData.pouring[pourIndex].from;
	var thisFillLiquid = gameData.pouring[pourIndex].to;
	var lastColorIndex = thisLiquid.data.colors.length-1;
	thisLiquid.data.colors.splice(lastColorIndex, 1);

	fillLiquid(thisLiquid.data.index);

	thisLiquid.data.fillShape.graphics.clear();
	thisFillLiquid.data.fillShape.graphics.clear();
	thisLiquid.data.fillShape.visible = false;
	thisFillLiquid.data.fillShape.visible = false;

	TweenMax.to(thisLiquid, gameSettings.moveSpeed, {x:thisLiquid.data.x, y:thisLiquid.data.y, ease:Linear.easeNone, overwrite:true, onUpdate:function(){
		updateTubeData(thisLiquid);
		updateTubeData(thisFillLiquid);
	}, onComplete:function(){
		mixSameLiquid(thisFillLiquid.data.index);
		fillLiquid(thisFillLiquid.data.index);

		gameData.filling = false;
		thisLiquid.data.active = true;
		thisFillLiquid.data.active = true;
		gameData.pouring[pourIndex].filling = false;
		gameData.pouring[pourIndex].complete = true;
		clearPourArray();
		checkLiquidComplete(true);
		if(gameData.resize){
			positionTubes();
		}
	}});
	TweenMax.to(thisLiquid.data.mask, gameSettings.moveSpeed, {rotation:0, ease:Linear.easeNone, overwrite:true});
	TweenMax.to(thisLiquid.data.imageBack, gameSettings.moveSpeed, {rotation:0, ease:Linear.easeNone, overwrite:true});
	TweenMax.to(thisLiquid.data.imageFront, gameSettings.moveSpeed, {rotation:0, ease:Linear.easeNone, overwrite:true});
	TweenMax.to(thisLiquid.data.container, gameSettings.moveSpeed, {y:0, ease:Linear.easeNone, overwrite:true});
}

/*!
 * 
 * CHECK LIQUID COMPLETE - This is the function that runs to check liquid complete
 * 
 */
function checkLiquidComplete(con){
	var leftTubesArr = [];
	for(var n=0; n<gameData.tubes.length; n++){
		var checkColor = -1;
		var completeColor = true;
		
		for(var c=0; c<gameData.tubes[n].data.colors.length; c++){
			//reset surface
			var thisArray = gameData.tubes[n].data.colors[c];
			thisArray.surface.x = 0;
			thisArray.bottom.x = 0;
			thisArray.surface.scaleX = thisArray.bottom.scaleX = 1;

			//check same color
			if(gameData.tubes[n].data.fill >= gameData.tube.fillH - 5){
				if(checkColor == -1){
					checkColor = gameData.tubes[n].data.colors[c].index;
				}else if(checkColor != gameData.tubes[n].data.colors[c].index){
					completeColor = false;
				}
			}else{
				completeColor = false;
			}
		}

		if(gameData.tubes[n].data.fill == 0){
			completeColor = false;
		}

		if(!completeColor){
			if(gameData.tubes[n].data.fill > 0){
				leftTubesArr.push(gameData.tubes[n]);
			}
		}
	}

	var autoFill = false;
	if(leftTubesArr.length == 2 && gameSettings.autoFill){
		var tubeColor = -1;
		var fillPercent = 0;
		for(var n=0; n<leftTubesArr.length; n++){
			if(leftTubesArr[n].data.colors.length == 1){
				if(tubeColor == -1){
					tubeColor = leftTubesArr[n].data.colors[0].index;
				}

				if(tubeColor == leftTubesArr[n].data.colors[0].index){
					fillPercent += leftTubesArr[n].data.fill;
				}
			}
		}
		if(fillPercent >= gameData.tube.fillH - 5){
			autoFill = true;
		}
	}

	if(con){
		if(autoFill){
			var pourIndex = getPouringIndex();
			gameData.pouring[pourIndex].from = null;
			
			gameData.action = false;
			var delayNum = .2;
			var delayCount = 0;
			for(var n=0; n<leftTubesArr.length; n++){
				var thisTube = leftTubesArr[n];
				TweenMax.to(thisTube, delayCount, {overwrite:true, onComplete:actionTube, onCompleteParams:[thisTube]});
				delayCount += delayNum;
			}
		}

		if(leftTubesArr.length == 0){
			gameData.action = false;
			animateBubbles();
			calculateScore();
			toggleGameSessionTimer(false);
			toggleGameTimer(false);
		}
	}else{
		if(leftTubesArr.length == 0){
			return true;
		}else{
			return false;
		}
	}
}

function animateBubbles(){
	var totalBubblesRandom = Math.floor(100/gameData.tubes.length);

	for(var n=0; n<gameData.tubes.length; n++){
		var thisTube = gameData.tubes[n];
		if(thisTube.data.colors.length > 0){
			var totalBubbles = randomIntFromInterval(totalBubblesRandom,totalBubblesRandom+5);

			for(var b=0; b<totalBubbles; b++){
				var randomBubbleIndex = Math.floor(Math.random()*bubbles_arr.length);
				var newBubble = new createjs.Bitmap(loader.getResult('bubble' + randomBubbleIndex));
				centerReg(newBubble);

				animateBubble(newBubble, -(thisTube.data.fill));
				thisTube.data.bubble.addChild(newBubble);
			}
		}
	}
}

function animateBubble(newBubble,y){
	newBubble.x = randomIntFromInterval(-gameData.tube.fillW,gameData.tube.fillW);
	newBubble.y = 10;
	var tweenSpeed = randomIntFromInterval(5,20) * .1;
	var delayNum = randomIntFromInterval(0,15) * .1;
	TweenMax.to(newBubble, tweenSpeed, {delay:delayNum, y:y, onComplete:function(){
		newBubble.visible = false;
	}});
}

/*!
 * 
 * UPDATE TUBE DATA - This is the function that runs to update tube data
 * 
 */
function updateTubeData(thisLiquid){
	var fillPercentH = gameData.tube.fillPercent;
	var rotateDistance = (fillPercentH - thisLiquid.data.fill)/fillPercentH * 90;
	var rotateNum = thisLiquid.data.direction == "right" ? -rotateDistance : rotateDistance;
	var tubePos = getAnglePosition(0, 0, gameData.tube.h, rotateNum-90);
	var containerY = rotateDistance/90 * (gameData.tube.fillW/2);
	var pourX = 0;
	var pourY = 80 - (rotateDistance/90 * (80));

	var radiusNum = thisLiquid.data.direction == "right" ? -(gameData.tube.fillW/2) : gameData.tube.fillW/2;
	var cornerPosA = getAnglePosition(0, 0, radiusNum, thisLiquid.data.imageFront.rotation);
	var cornerPosB = getAnglePosition(cornerPosA.x, cornerPosA.y - containerY, gameData.tube.h, thisLiquid.data.imageFront.rotation - 90);
	var radiusDistance = getDistance(cornerPosA.x, cornerPosA.y, cornerPosB.x, cornerPosB.y) - 3;

	thisLiquid.data.rotateNum = rotateNum;
	thisLiquid.data.tubePos = tubePos;
	thisLiquid.data.containerY = containerY;
	thisLiquid.data.pourX = pourX;
	thisLiquid.data.pourY = pourY;
	thisLiquid.data.cornerPosA = cornerPosA;
	thisLiquid.data.cornerPosB = cornerPosB;

	var scalePercentH = gameData.tube.h * 1.35;
	var scaleX = 1;
	for(var n=thisLiquid.data.colors.length-1; n>=0; n--){
		var thisShape = thisLiquid.data.colors[n].shape;
		var thisSurface = thisLiquid.data.colors[n].surface;

		var percent = Math.abs(thisShape.y) + Math.abs(thisShape.fillH);
		var newPercent = percent/Math.abs(cornerPosB.y) * radiusDistance;
		newPercent = newPercent > radiusDistance ? radiusDistance : newPercent;
		var surfacePos = getAnglePosition(cornerPosA.x, cornerPosA.y, newPercent, thisLiquid.data.imageFront.rotation-90);

		var scaleDown = (scalePercentH - (Math.abs(thisShape.y) + Math.abs(thisShape.fillH))) * .0058;
		scaleX = Math.abs(0 - thisLiquid.data.imageFront.rotation) * .035;
		scaleX = scaleX * scaleDown;
		scaleX = scaleX < 1 ? 1 : scaleX;

		if(thisLiquid.data.direction == "right"){
			thisSurface.x = surfacePos.x + ((gameData.tube.fillW/2) * scaleX);
		}else{
			thisSurface.x = surfacePos.x - ((gameData.tube.fillW/2) * scaleX);
		}
		thisSurface.y = surfacePos.y;
		thisSurface.scaleX = scaleX;

		if(n < thisLiquid.data.colors.length-1){
			var thisBottom = thisLiquid.data.colors[n+1].bottom;
			if(thisLiquid.data.direction == "right"){
				thisBottom.x = surfacePos.x + ((gameData.tube.fillW/2) * scaleX);
			}else{
				thisBottom.x = surfacePos.x - ((gameData.tube.fillW/2) * scaleX);
			}
			thisBottom.y = surfacePos.y;
			thisBottom.scaleX = scaleX;
		}
	}
}

function updateFilling(pourIndex){
	var thisLiquid = gameData.pouring[pourIndex].from;
	var thisFillLiquid = gameData.pouring[pourIndex].to;

	var radiusNum = thisLiquid.data.direction == "right" ? -(gameData.tube.fillW/2) : gameData.tube.fillW/2;
	var fillPos = getAnglePosition(thisLiquid.data.tubePos.x, thisLiquid.data.tubePos.y, radiusNum, thisLiquid.data.rotateNum);
	thisLiquid.data.fillShape.x = fillPos.x;
	thisLiquid.data.fillShape.y = fillPos.y;

	var fillX = thisLiquid.data.imageFront.rotation/90 * (gameData.tube.fillW/5);
	thisFillLiquid.data.fillShape.x = thisLiquid.data.direction == "right" ? Math.abs(fillX) : -fillX;
	thisFillLiquid.data.fillShape.y = -10;
	thisFillLiquid.data.fillShape.scaleY = 1;

	thisLiquid.data.fillShape.visible = false;
	thisFillLiquid.data.fillShape.visible = true;
}

function updateLiquid(pourIndex){
	var thisLiquid = gameData.pouring[pourIndex].from;
	var thisFillLiquid = gameData.pouring[pourIndex].to;

	updateTubeData(thisLiquid);
	updateTubeData(thisFillLiquid);

	thisLiquid.data.container.y = thisLiquid.data.containerY;
	thisLiquid.data.mask.rotation = thisLiquid.data.rotateNum;
	thisLiquid.data.imageBack.rotation = thisLiquid.data.rotateNum;
	thisLiquid.data.imageFront.rotation = thisLiquid.data.rotateNum;

	if(thisLiquid.data.direction == "left"){
		thisLiquid.x = ((thisFillLiquid.x - (gameData.tube.fillX)) - thisLiquid.data.tubePos.x) + thisLiquid.data.containerY;
	}else{
		thisLiquid.x = ((thisFillLiquid.x + (gameData.tube.fillX)) - thisLiquid.data.tubePos.x) - thisLiquid.data.containerY;
	}
	thisLiquid.y = (thisFillLiquid.y - thisLiquid.data.tubePos.y) - (gameData.tube.fillY);
}


/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){	
	if(con){
		timeData.startDate = new Date();
	}else{
		
	}
	timeData.enable = con;
}

function toggleGameSessionTimer(con){	
	if(con){
		timerShape.alpha = 1;
		timeData.oldTimer = -1;
		timeData.accumulate = 0;
		timeData.sessionDate = new Date();
	}else{
		timeData.accumulate = timeData.countdown - timeData.sessionTimer;
	}
	timeData.enable = con;
}


/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		if(timeData.enable){
			timeData.nowDate = new Date();
			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.startDate.getTime()));
			timeData.timer = (timeData.elapsedTime);

			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.sessionDate.getTime()));
			timeData.sessionTimer = Math.floor((timeData.countdown) - (timeData.elapsedTime));

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				postSocketUpdate('updatetimer', timeData.sessionTimer);
			}else{
				updateTimer();
			}
		}
	}
}

function updateTimer(){
	if(timeData.oldTimer == -1){
		timeData.oldTimer = timeData.sessionTimer;
	}
	
	if(timeData.sessionTimer <= 0){
		//stop
		timeData.sessionTimer = 0;
		playSound('soundTimerEnd');
		showGameStatus("timesup");
		endGame();
	}else{
		if((timeData.oldTimer - timeData.sessionTimer) > 1000){
			if(timeData.sessionTimer < 5000){
				animateTimer()
				playSound('soundTimer');
			}
			timeData.oldTimer = timeData.sessionTimer;
		}
	}

	updateTimerBar();
}

function animateTimer(){
	var tweenSpeed = .8;
	timerShape.alpha = .2;
	TweenMax.to(timerShape, tweenSpeed, {alpha:1});
	timerShapeBg.alpha = 0;
	TweenMax.to(timerShapeBg, tweenSpeed, {alpha:.3});
}

function updateTimerBar(){
	timerShape.graphics.clear();
	timerShape.graphics.beginFill(gameSettings.timer.color);
	
	timerShapeBg.graphics.clear();
	timerShapeBg.graphics.beginFill(gameSettings.timer.color);
	timerShapeBg.alpha = .3;
	
	var totalW = timeData.sessionTimer/timeData.countdown * gameSettings.timer.width;
	totalW = totalW < 5 ? 5 : totalW;
	var radius = gameSettings.timer.radius;
	timerShape.graphics.drawRoundRectComplex(0, 0, totalW, gameSettings.timer.height, radius, radius, radius, radius);
	timerShapeBg.graphics.drawRoundRectComplex(0, 0, gameSettings.timer.width, gameSettings.timer.height, radius, radius, radius, radius);
}

/*!
 * 
 * GAME SCORE - This is the function that runs to show game score
 * 
 */
function calculateScore(){
	playSound("soundScore");
	statusContainer.alpha = 1;
	
	var scorePercentage = gameData.stage.score/gameData.stage.timer;
	TweenMax.to(timeData, 1, {sessionTimer:0, overwrite:true, onUpdate:function(){
		var calTimer = timeData.countdown - timeData.sessionTimer;
		var totalScore = Math.floor((calTimer - timeData.accumulate) * scorePercentage);
		statusTxt.text = textDisplay.score.replace("[NUMBER]", addCommas(totalScore));
		updateTimerBar();
	}, onComplete:function(){
		var calTimer = timeData.countdown - timeData.sessionTimer;
		var totalScore = Math.floor((calTimer - timeData.accumulate) * scorePercentage);
		playerData.score += totalScore;

		TweenMax.to(timerContainer, 1, {overwrite:true, onComplete:function(){
			statusTxt.text = "";

			playSound('soundClear');
			showGameStatus("clear");
			var tweenSpeed = gameData.type == "level" ? 0 : 2;
			TweenMax.to(timerContainer, tweenSpeed, {overwrite:true, onComplete:function(){
				gameData.revealLevel = false;
				gameData.levelNum++;
				if(gameData.levelNum >= gameData.levelCompleted && gameData.levelNum < levelSettings.length){
					gameData.revealLevel = true;
				}
				var nextLevel = gameData.levelNum+1;
				nextLevel = nextLevel > levelSettings.length ? levelSettings.length : nextLevel;
				findSelectPage(nextLevel);
				saveLevelData();

				if(gameData.type == "level"){
					endGame();
				}else{
					gameData.levelNum--;
					proceedNextStage();
				}
			}});
		}});
	}});
}

function proceedNextStage(){
	gameData.challengeNum++;
	gameData.levelNum++;
	gameData.levelNum = gameData.levelNum > levelSettings.length-1 ? levelSettings.length-1 : gameData.levelNum;

	setupStage();
}

/*!
 * 
 * GAME STATS - This is the function that runs to update game stats
 * 
 */
function updateGameLevel(){
	levelTxt.text = textDisplay.level.replace("[NUMBER]", gameData.challengeNum);
}

function showGameStatus(con){
	var delay = 2;
	if(con == 'timesup'){
		statusTxt.text = textDisplay.timesup;
	}else if(con == 'clear'){
		if(gameData.type == "level"){
			statusTxt.text = textDisplay.clear.replace("[NUMBER]", gameData.levelNum+1);
		}else{
			statusTxt.text = textDisplay.clear.replace("[NUMBER]", gameData.challengeNum);
		}
	}

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(statusContainer, .5, {delay:delay, alpha:0, overwrite:true});
	}});
}

/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	gameData.paused = true;
	TweenMax.to(gameContainer, 3, {overwrite:true, onComplete:function(){
		goPage('result');
	}});
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", addCommas(playerData.score));
	text = shareMessage.replace("[SCORE]", addCommas(playerData.score));
	
	var shareurl = '';
	
	
	window.open(shareurl);
}