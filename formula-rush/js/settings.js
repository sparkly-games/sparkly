var CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT = 1920;

var EDGEBOARD_X = 0;
var EDGEBOARD_Y = 0;

var FPS = 60;
var FPS_DT = 1/FPS;
var FPS_TIME      = 1000/FPS;
var DISABLE_SOUND_MOBILE = false;

var GAME_NAME = "formula_rush";

var PRIMARY_FONT = "alegreya_sans_scblack";
var SECONDARY_FONT = "Digital";
var THIRD_FONT = "ArialBold"
var PRIMARY_FONT_COLOUR = "#000000";

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var ON_PLAYER_PASSED_LAP = 0;
var ON_PLAYER_COMPLETE_LAP = 2;
var ON_PLAYER_COMPLETE_TRACK = 3;
var ON_PLAYER_CHANGE_RANK = 4;

var ON_ENEMY_HIT = 0;
var ON_ENEMY_DEAD = 1;

var MODE_CLASSIC = 0;
var MODE_ADVENTURE = 1;
var MODE_SURVIVAL = 2;

var STATE_GAME_START = 0;
var STATE_GAME_RACE = 1;
var STATE_GAME_END = 2;

var STATE_RUNNER_RUN = 0;
var STATE_RUNNER_ATTACK = 1;
var STATE_RUNNER_DEATH = 2;
var STATE_RUNNER_HURTED = 3;

var OPPONENT_RUN_STATE_ACCELERATE = "accelerate";
var OPPONENT_RUN_STATE_DECELERATE = "decelerate";
var OPPONENT_RUN_STATE_BRAKE = "brake";

var ATTACK_SIDE_LEFT = "left";
var ATTACK_SIDE_RIGHT = "right";

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_RIGHT = 39;
var KEY_LEFT = 37;
var KEY_SPACE = 32;
var KEY_UP_W = 87;
var KEY_DOWN_S = 83;
var KEY_RIGHT_D = 68;
var KEY_LEFT_A = 65;


var ROTATE_LEFT = 0;
var ROTATE_RIGHT = 1;
var ROTATE_CENTER = 2;

var NUM_WORLDS = 1;
var NUM_TRACKS_PER_WORLD = 3;

var OVERALL_DIFFICULTY;

var MIN_RANK_FOR_WIN = 3;
var PLAYER_CAR_TYPE = 0;
var TYPE_CAR_IN_GAME =[
    
    PLAYER_CAR_TYPE,0,
    1,1,
    2,2,
    3,3,
    4,4,
    5,5,
    6,6,
    7,7,
    8,8,
    9,9,/**/
]

var START_COUNTDOWN = 3000;


////////////////////CAMERA SETTINGS ///////////////////////////////////
var FOV = 100;                  // angle (degrees) for field of view
var CAMERA_HEIGHT = 1000;       // z height of camera
var CAMERA_DEPTH = 1 / Math.tan((FOV/2) * Math.PI/180);         // z distance camera is from screen (computed)
var CAMERA_OFFSET_Z = -200;     ///USE THIS TO MOVE CAMERA BEHIND THE PLAYER. Limit is when PLAYER_Z_FROMCAMERA goes < 0. 
                                //IF YOU CHANGE THIS, YOU NEED TO SYNC PLAYER SPRITE AND COLLISION PROPERLY 
var PLAYER_Z_FROMCAMERA = (CAMERA_HEIGHT * CAMERA_DEPTH) + CAMERA_OFFSET_Z;      
var CAR_SIDEVIEW_OFFSET = 0.2;
var CAR_FARVIEW_OFFSET = 2600;
var CAR_CURVEVIEW_OFFSET = 0.4;
var FRAMESPEED_ROTATION = 100;
var MAX_ROTATION = 10;
var HEIGHT_ROTATION_VIEW = CANVAS_HEIGHT +300;
var WIDTH_ROTATION_VIEW = CANVAS_WIDTH +150;
var START_X_ROTATION_VIEW = (CANVAS_WIDTH - WIDTH_ROTATION_VIEW)/2;
var START_Y_ROTATION_VIEW = (CANVAS_HEIGHT - HEIGHT_ROTATION_VIEW)/2;

////////////////////PARALLAX SETTINGS ///////////////////////////////////
var PARALLAX_RATIO_X_1 = 2;
var PARALLAX_RATIO_X_2 = 2.4;
var PARALLAX_RATIO_Y_0 = 0.004;
var PARALLAX_RATIO_Y_1 = 0.005;
var PARALLAX_RATIO_Y_2 = 0.006;

////////////////// PLAYER SETTINGS  //////////////////////////////////
var PLAYER_MAX_SPEED;                       // player max speed
var PLAYER_MIN_SPEED = 3000;                // player never stop, set 0 if you want him able to stop
var PLAYER_ACCELERATION;                    // player acceleration
var PLAYER_DECELERATION;                    // player deceleration
var PLAYER_REAL_MAX_SPEED;
var PLAYER_LOW_SPEED_LIMIT = 0.5;
var PLAYER_LOW_SPEED_CORNERING_RATIO = 0.5;
var PLAYER_CORNERING_WEIGHT = 25;
var PLAYER_CORNERING_INCREASE_RATIO = 4;

var PLAYER_COLLISION_FRONT_DISTANCE = 0;        ///NUMBER SEGMENTS TO CHECK IN FRONT OF PLAYER FOR COLLISION 
var PLAYER_RELATIVE_DAMAGE_X_DISTANCE = 0.18;     //DISTANCE FROM AN ENEMY TO START AN ATTACK
var PLAYER_DEPTH_SWAP = 0.0008//0.0011;                 //BECAUSE PLAYER IS NOT IN RENDERING ENGINE, NEEDS TO MANUAL CALCULATE HIS DEPTH. BASED ON ABSOLUTE LEVEL SCALE OF OBJECTS IN SCREEN
var PLAYER_SPEED_LOST_WHEN_COLLIDED = 1000;

////////////////// ENEMY SETTINGS  //////////////////////////////////
var ENEMY_FLANKING_Z_OFFSET = 400;


var GENERAL_X_SHIFTING_SPEED = 0.01;
var APPROACH_X_SHIFTING_SPEED = 0.005;


////////////////// PHYSICS SETTINGS //////////////////////////////////
var CENTRIFUGAL_FORCE;                     // centrifugal force multiplier when going around curves
var PLAYER_COLLIDER_WIDTH = 0.1;//0.22;                    // collider width. the number is in respect to road width (1 = half road width)
var PLAYER_MIN_SPEED_DAMAGE;   // player minimum speed to being damaged

////////////////// TERRAIN SETTINGS  //////////////////////////////////
var TERRAIN_MAX_INERTIA = 0.03;                      //terrain inertia when steer
var TERRAIN_INCREASE_INERTIA = 0.005;                //terrain increase inertia
var TERRAIN_DECREASE_INERTIA = 0.002;                //terrain decrease inertia
var TERRAIN_ADHERENCE = 1;                           //terrain adherence


///////////////// ROAD SETTINGS //////////////////////////////////////
var DRAW_DISTANCE = 250;                     // number of segments to draw
var ROAD_WIDTH = 2000;                    // actually half the roads width, easier math if the road spans from -roadWidth to +roadWidth
var NUM_LANES = 4;                       // number of lanes
var SEGMENT_LENGTH = 200;                // length of a single segment
var RUMBLE_LENGTH = 3;                       // number of segments per red/white rumble strip
var TRACK_LENGTH;                       // z length of entire track (computed)
var ROAD_BOUNDS = 2;                    // ROAD CROSS LIMITS
var STARTING_GRID_X_OFFSET = 0.4;
var STARTING_GRID_Z_OFFSET = 6;


//////////////// ENVIRONMENT SETTINGS ///////////////////////////////
var FOG_DENSITY = 5;                       // exponential fog density
var DEPTH_DISTANCE_TO_FADE_ELEMENTS = PLAYER_DEPTH_SWAP*3;   //DISTANCE BEHIND THE PLAYER TO FADE OFF ELEMENTS TO NOT CLUTTER THE CAMERA

var ELEMENT_TYPE_STATIC = "static";
var ELEMENT_TYPE_ANIMATED = "animated";
var ELEMENT_TYPE_LIGHT = "light";

var ANIMATE_GROUP = {
    QTY: {NONE:0, ALL:1, RANDOM:2},    
    //MOVEMENT: {SYNCRO:0, RANDOM:1},
    EFFECT:{NONE:0, SYNCRO: 1, RANDOM:2, LIGHT_BROKEN:3, LIGHT_REGULAR:4, WATERFALL:5}
};

var ROAD = {
    TYPE:   {STANDARD:0, CURVE_S:1, BUMPS:2, FINAL:3},
    LENGTH: { NONE: 0, SHORT:  25, MEDIUM:  50, LONG:  100, EXTRALONG: 200}, // num segments
    HILL:   { NONE: 0, LOW:    20, MEDIUM:  40, HIGH:   60, VERYHIGH:80 },
    CURVE:  { NONE: 0, EASY:    2, MEDIUM:   4, HARD:    6, VERYHARD:8 }
};

var AMBIENT = {
    DISPOSITION: {PRECISE:0, DENSITY:1},
    SIDE: { CENTER:0, LEFT:-1, RIGHT:1, BOTH:2 },
    TYPE : {NORMAL: 0, FILL_TRACK:1, FILL_STRAIGHT:2, FILL_CURVE: 3, FINISH:4, ANIMATION:5}
};

var COLORS = {
  LIGHT:  { road: '#6B6B6B', grass: "#96a54b", rumble: '#555555', lane: '#CCCCCC'  },
  DARK:   { road: '#696969', grass: "#7e8b3e", rumble: '#BBBBBB'                   },
  START:  { road: 'white',   grass: 'white',   rumble: 'white'                     },
  FINISH: { road: 'black',   grass: 'black',   rumble: 'black'                     }
};

var SPRITES = {
    //DAY
    
  BILLBOARD_0:              {name: "billboard_0",       physics:{center:152, width:290}   },
  BILLBOARD_1:              {name: "billboard_1",       physics:{center:98, width:50}    },
  BILLBOARD_2:              {name: "billboard_2",       physics:{center:100, width:60}    },
  BILLBOARD_3:              {name: "billboard_3",       physics:{center:152, width:290}   },
  BILLBOARD_4:              {name: "billboard_4",       physics:{center:107, width:50}    },
  BILLBOARD_5:              {name: "billboard_5",       physics:{center:107, width:50}    },
 
  BILLBOARD_ARC_0:            {name: "billboard_arc_0",               physics:{base:30, width:880} },
  BILLBOARD_ARC_1:            {name: "billboard_arc_1",               physics:{base:30, width:880} },
  BILLBOARD_ARC_2:            {name: "billboard_arc_2",               physics:{base:30, width:880} },
  BILLBOARD_ARC_3:            {name: "billboard_arc_3",               physics:{base:30, width:880} },
  BILLBOARD_ARC_4:            {name: "billboard_arc_4",               physics:{base:30, width:880} },
  FINISH:                   {name: "finish",               physics:{base:100, width:880} },
  
  SECURITY_WALL:                   {name: "security_wall",               physics:{width:700} },
  
  
};


////THE SCALE ARE NOT PROPORTIONAL
SPRITES.SCALE = 0.00375;//0.3 * (1/SPRITES.PLAYER_STRAIGHT.w) // the reference sprite width should be 1/3rd the (half-)roadWidth
//SPRITES.ANIMATED = {SCALE:0.00049, PLAYER_ALIGN:800};
SPRITES.ANIMATED = {SCALE:0.00064, PLAYER_ALIGN:800};


var TYPE_CAR_COLOR = [
    ["#ff352d","#ff352d"],
    ["#f77d27","#075c81"],
    ["#f6faff","#f6faff"],
    ["#aab5c8","#ff3035"],
    ["#3f9b91","#3f9b91"],
    ["#530f5f","#530f5f"],
    ["#530f5f","#bd1310"],
    ["#5a86a4","#5a86a4"],
    ["#295da5","#8effff"],
    ["#cc365e","#ffffff"],
];

var TYPE_CUP_COLOR = [
    ["#FFD700","#CD7F32"],     //GOLD
    ["#C0C0C0", "#555"],     //SILVER
    ["#99622b", "#5f3f20"],     //BRONZE
    ["#FFF","#000"]      //GENERAL
];

/////////////////PARAMS FOR OPTIMIZATION
var HALF_CANVAS_WIDTH = CANVAS_WIDTH/2;
var HALF_CANVAS_HEIGHT = CANVAS_HEIGHT/2;
var ROAD_PER_HALF_CANVAS_WIDTH = HALF_CANVAS_WIDTH * ROAD_WIDTH;
var ROAD_PER_SCALE_PER_HALF_CANVAS_WIDTH = SPRITES.SCALE * ROAD_PER_HALF_CANVAS_WIDTH;
var ROAD_PER_SCALE_PER_HALF_CANVAS_WIDTH_ANIMATED = SPRITES.ANIMATED.SCALE * ROAD_PER_HALF_CANVAS_WIDTH;
var PLAYER_SPEED_CONVERSION_RATIO = PLAYER_REAL_MAX_SPEED/PLAYER_MAX_SPEED; 

var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;

var SOUNDTRACK_VOLUME_IN_GAME  = 0.3;
var POINTS_PER_RANK;
var AD_SHOW_COUNTER;