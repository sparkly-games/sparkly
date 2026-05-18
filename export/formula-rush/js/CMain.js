function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oSelectCharacterMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = isMobile();
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        
        s_oLocalStorage = new CLocalStorage(GAME_NAME);
    };
    
    this.preloaderReady = function(){
        this._loadImages();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }

        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);


        s_aSoundsInfo = new Array();
        
        s_aSoundsInfo.push({path: './sounds/',filename:'menu_soundtrack',loop:true,volume:1, ingamename: 'menu_soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_soundtrack',loop:true,volume:1, ingamename: 'game_soundtrack'});
        
        s_aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'1',loop:false,volume:1, ingamename: '1'});
        s_aSoundsInfo.push({path: './sounds/',filename:'2',loop:false,volume:1, ingamename: '2'});
        s_aSoundsInfo.push({path: './sounds/',filename:'3',loop:false,volume:1, ingamename: '3'});
        s_aSoundsInfo.push({path: './sounds/',filename:'go',loop:false,volume:1, ingamename: 'go'});
        s_aSoundsInfo.push({path: './sounds/',filename:'arrive_lose',loop:false,volume:1, ingamename: 'arrive_lose'});
        s_aSoundsInfo.push({path: './sounds/',filename:'arrive_win',loop:false,volume:1, ingamename: 'arrive_win'});
        
        s_aSoundsInfo.push({path: './sounds/',filename:'sprint_start',loop:false,volume:1, ingamename: 'sprint_start'});
        s_aSoundsInfo.push({path: './sounds/',filename:'crash',loop:false,volume:1, ingamename: 'crash'});
        s_aSoundsInfo.push({path: './sounds/',filename:'brake',loop:false,volume:1, ingamename: 'brake'});
        s_aSoundsInfo.push({path: './sounds/',filename:'engine',loop:true,volume:1, ingamename: 'engine'});
        s_aSoundsInfo.push({path: './sounds/',filename:'engine_stall',loop:true,volume:1, ingamename: 'engine_stall'});
        s_aSoundsInfo.push({path: './sounds/',filename:'engine_reverse',loop:true,volume:1, ingamename: 'engine_reverse'});

        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
    };
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
        
        
    };


    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("keys","./sprites/keys.png");
        s_oSpriteLibrary.addSprite("star","./sprites/star.png");
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_delete_saving","./sprites/but_delete_saving.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg"); 
        
        s_oSpriteLibrary.addSprite("logo_menu","./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");

        ////////////
        
        s_oSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");


        for(var i=0; i<NUM_WORLDS; i++){
            s_oSpriteLibrary.addSprite("w"+i+"_patch","./sprites/backgrounds/world_"+i+"/patch.png");
            s_oSpriteLibrary.addSprite("w"+i+"_bg0","./sprites/backgrounds/world_"+i+"/bg0.png");
            s_oSpriteLibrary.addSprite("w"+i+"_bg1","./sprites/backgrounds/world_"+i+"/bg1.png");
            s_oSpriteLibrary.addSprite("w"+i+"_bg2","./sprites/backgrounds/world_"+i+"/bg2.png");

        }
        
        s_oSpriteLibrary.addSprite("key_up","./sprites/key_up.png");
        s_oSpriteLibrary.addSprite("key_down","./sprites/key_down.png");
        s_oSpriteLibrary.addSprite("key_left","./sprites/key_left.png");
        s_oSpriteLibrary.addSprite("key_right","./sprites/key_right.png");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_next","./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("tachometer","./sprites/tachometer.png");
        //s_oSpriteLibrary.addSprite("hit_contact","./sprites/hit_contact.png");
        
        for(var i=0; i<30; i++){
            s_oSpriteLibrary.addSprite("hit_contact_"+i,"./sprites/hit_contact/hit_contact_"+i+".png");
        }

        for(var i=0; i<5; i++){
            s_oSpriteLibrary.addSprite("billboard_"+i,"./sprites/elements/day/billboard_"+i+".png");
            s_oSpriteLibrary.addSprite("billboard_arc_"+i,"./sprites/elements/day/billboard_arc_"+i+".png");
        }
        s_oSpriteLibrary.addSprite("billboard_"+5,"./sprites/elements/day/billboard_"+5+".png");

        s_oSpriteLibrary.addSprite("finish","./sprites/elements/day/finish.png");
        s_oSpriteLibrary.addSprite("security_wall","./sprites/elements/day/security_wall.png");


        
        for(var i=0; i<s_aFolderName.length; i++){
            for(var j=0; j<5; j++){
                s_oSpriteLibrary.addSprite(s_aFileName[i]+"_"+j,"./sprites/cars/"+s_aFolderName[i]+"/"+s_aFileName[i]+"_"+j+".png");
            }
        }

        for(var i=0; i<5; i++){
            s_oSpriteLibrary.addSprite("car_shadow_"+i,"./sprites/cars/car_shadow/car_shadow_"+i+".png");
        }

        s_oSpriteLibrary.addSprite("map_panel","./sprites/map_panel.png");
        s_oSpriteLibrary.addSprite("end_icon_map","./sprites/end_icon_map.png");
        
        s_oSpriteLibrary.addSprite("lap_panel","./sprites/lap_panel.png");
        
        s_oSpriteLibrary.addSprite("gold_cup","./sprites/gold_cup.png");
        s_oSpriteLibrary.addSprite("silver_cup","./sprites/silver_cup.png");
        s_oSpriteLibrary.addSprite("bronze_cup","./sprites/bronze_cup.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites(5);
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();
            
        playSound("menu_soundtrack", 1, true);

        var oAnimationSettings = new CAnimSettings();

        this.gotoMenu();
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoModeMenu = function(){
        _oModeMenu = new CModeMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoSelectCharacterMenu = function(){
        _oSelectCharacterMenu = new CSelectCharacterMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoWorldMenu = function(){
        
        _oModeMenu = new CWorldMenu();
        _iState = STATE_MENU;
        
    };
    

    this.gotoGame = function(iLevel){
        s_oGame = _oGame = new CGameRace(_oData, iLevel);   
        
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        Howler.mute(true);
     };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");

        if(s_bAudioActive){
                Howler.mute(false);
        }
    };
    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
  
        s_oStage.update(event);        
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        

    };
    
    s_oMain = this;
    
    _oData = oData;
    
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    s_bAudioActive = oData.audio_enable_on_startup;

    
    PLAYER_MAX_SPEED = oData.player_max_speed;
    PLAYER_ACCELERATION = PLAYER_MAX_SPEED/5; 
    PLAYER_BRAKING_RATE = PLAYER_MAX_SPEED/2;
    PLAYER_DECELERATION = PLAYER_MAX_SPEED/14;
    PLAYER_MIN_SPEED_DAMAGE = PLAYER_MAX_SPEED/3;   // player minimum speed to being damaged

    PLAYER_REAL_MAX_SPEED = oData.player_maxspeed_indicator;
    PLAYER_SPEED_CONVERSION_RATIO = PLAYER_REAL_MAX_SPEED/PLAYER_MAX_SPEED;
    
    CENTRIFUGAL_FORCE = oData.player_centrifugal_force;
    
    POINTS_PER_RANK = oData.points_per_rank;

    OVERALL_DIFFICULTY = oData.overall_difficulty;

    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 1/FPS_DT;
var s_bFullscreen = false;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oGame = null;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_oCanvas;
var s_oLocalStorage;
var s_aSounds = new Array();
var s_aSoundsInfo;
var s_aFolderName = ["car_0", "car_1", "car_2", "car_3", "car_4", "car_5", "car_6", "car_7", "car_8", "car_9"];
var s_aFileName = ["car_0", "car_1", "car_2", "car_3", "car_4", "car_5", "car_6", "car_7", "car_8", "car_9"];

var s_iCharacterSelected = 0;