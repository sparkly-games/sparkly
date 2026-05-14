var ROAD_INFO = new Array();
var AMBIENT_INFO = new Array();
var LEVEL_INFO = new Array();
var ELEMENT_INFO = new Array([],[],[],[],[],[],[],[],[],);


//////////////////////////////////////// WORLD 1 ///////////////////////////////////////////////
ROAD_INFO[0] = [
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":ROAD.CURVE.EASY },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,   "curve":ROAD.CURVE.MEDIUM},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,   "curve":-ROAD.CURVE.MEDIUM},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":-ROAD.CURVE.EASY,           },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,                                        },
    {"roadtype": ROAD.TYPE.CURVE_S,  "length":ROAD.LENGTH.LONG,     "curve":ROAD.CURVE.MEDIUM},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,   "curve":ROAD.CURVE.HARD},
    {"roadtype": ROAD.TYPE.CURVE_S, "length":ROAD.LENGTH.MEDIUM,    "curve":ROAD.CURVE.MEDIUM},
   

    {"roadtype": ROAD.TYPE.CURVE_S, "length":ROAD.LENGTH.MEDIUM,    "curve":ROAD.CURVE.MEDIUM,          },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,   "curve":ROAD.CURVE.HARD},
    {"roadtype": ROAD.TYPE.CURVE_S,  "length":ROAD.LENGTH.LONG,     "curve":ROAD.CURVE.MEDIUM},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG-2},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":-ROAD.CURVE.EASY},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,   "curve":-ROAD.CURVE.MEDIUM},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,   "curve":ROAD.CURVE.MEDIUM},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":ROAD.CURVE.EASY },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,    "curve":ROAD.CURVE.MEDIUM},

   
    {"roadtype": ROAD.TYPE.FINAL, "length":ROAD.LENGTH.LONG-12,      }
]
LEVEL_INFO[0] = {   "time":70000, "num_cars":0, "num_laps":5,
                    "minimap":{x:0,y:0,scale:0.48,rot:-90},
                    "terrain":{ "roadbounds":2, "num_lanes":1, "adherence":1, "max_inertia":0.03, 
                                "color": {
                                        "light":  { road: '#444444', grass: "#45773f", rumble: '#fff', lane: '#fff'  },
                                        "dark":   { road: '#141414', grass: "#1d3f1b", rumble: '#8a1515'                }
                                    },
                                    "color_alt": {
                                        "light":  { road: '#444444', grass: "#45773f", rumble: '#0d6b92', lane: '#fff'  },
                                        "dark":   { road: '#141414', grass: "#1d3f1b", rumble: '#0d6b92'                }
                                    }
                            }
                };
AMBIENT_INFO[0] = [
    {"type":AMBIENT.TYPE.FILL_TRACK, "sprite": SPRITES.SECURITY_WALL, "position":8, "repetitionevery": 10, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"type":AMBIENT.TYPE.FINISH, "sprite": SPRITES.FINISH},

    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[50, 50], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[300, 300], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[450, 450], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[650, 650], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_4, "position":0, "segments":[850, 1250], "repetitionevery": 40, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[1850, 1850], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[2150, 2150], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_0, "position":0, "segments":[2400, 2400], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_5, "position":2, "segments":[2700, 2700], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_5, "position":2, "segments":[2850, 2850], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_0, "position":0, "segments":[3000, 4400], "repetitionevery": 30, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_5, "position":2, "segments":[4550, 4550], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[4850, 4850], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_2, "position":2, "segments":[5150, 5150], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_1, "position":2, "segments":[5450, 5450], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_1, "position":2, "segments":[5750, 5750], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_2, "position":0, "segments":[5950, 7250], "repetitionevery": 100, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_3, "position":0, "segments":[6000, 7200], "repetitionevery": 100, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.RIGHT, "sprite": SPRITES.BILLBOARD_1, "position":2, "segments":[7500, 7700], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.LEFT, "sprite": SPRITES.BILLBOARD_5, "position":2, "segments":[7500, 7700], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
]    

////////////////
ROAD_INFO[1] = [
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,    "curve":-ROAD.CURVE.EASY,},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,    "curve":ROAD.CURVE.EASY,},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,    "curve":-ROAD.CURVE.EASY,},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,    "curve":-ROAD.CURVE.MEDIUM,},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,    "curve":ROAD.CURVE.MEDIUM,},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,    "curve":-ROAD.CURVE.HARD,                              },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,                                  },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,    "curve":ROAD.CURVE.HARD,                              },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,                                  },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,    "curve":ROAD.CURVE.MEDIUM},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                                  },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,                                  },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,    "curve":ROAD.CURVE.MEDIUM,                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.SHORT,    "curve":ROAD.CURVE.VERYHARD,                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG-65,                       },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.SHORT,    "curve":-ROAD.CURVE.VERYHARD,                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                          },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,    "curve":ROAD.CURVE.MEDIUM,           },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                         },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                         },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,    "curve":ROAD.CURVE.MEDIUM,    },
    
    {"roadtype": ROAD.TYPE.FINAL, "length":ROAD.LENGTH.MEDIUM-24}
]

LEVEL_INFO[1] = {   "time":65000, "num_cars":0, "num_laps":5,
                    "minimap":{x:0,y:18,scale:0.54,rot:-30},
                    "terrain":{ "roadbounds":2, "num_lanes":1, "adherence":1, "max_inertia":0.03, 
                                "color": {
                                        "light":  { road: '#444444', grass: "#45773f", rumble: '#fff', lane: '#fff'  },
                                        "dark":   { road: '#141414', grass: "#1d3f1b", rumble: '#8a1515'                }
                                    },
                                    "color_alt": {
                                        "light":  { road: '#444444', grass: "#45773f", rumble: '#0d6b92', lane: '#fff'  },
                                        "dark":   { road: '#141414', grass: "#1d3f1b", rumble: '#0d6b92'                }
                                    }
                            }
                };

AMBIENT_INFO[1] = [
    //{"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.SECURITY_WALL, "segments":[0, 2450], "position":10, "repetitionevery": 10, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"type":AMBIENT.TYPE.FILL_TRACK, "sprite": SPRITES.SECURITY_WALL, "position":8, "repetitionevery": 10, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"type":AMBIENT.TYPE.FILL_TRACK, "sprite": SPRITES.BILLBOARD_2, "position":5, "repetitionevery": 500, "occurrence": 30},
    {"type":AMBIENT.TYPE.FINISH, "sprite": SPRITES.FINISH},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_0, "position":0, "segments":[200, 400], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_3, "position":0, "segments":[4500, 5400], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_0, "segments":[5700, 6000], "position":2, "occurrence": 30, "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.DENSITY},
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_1, "segments":[6100, 6500], "position":2, "occurrence": 30, "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.DENSITY},
    
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_0, "segments":[6600, 7200], "position":2, "occurrence": 30, "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.DENSITY},
    
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_1, "segments":[7500, 8800], "position":3, "occurrence": 50, "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.DENSITY},
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_0, "position":0, "segments":[7500, 8800], "repetitionevery": 100, "disposition":AMBIENT.DISPOSITION.PRECISE},

];

////////////////
ROAD_INFO[2] = [
{"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,                                        },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,   "curve":-ROAD.CURVE.MEDIUM,        },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,                                         },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":-ROAD.CURVE.VERYHARD},  
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":ROAD.CURVE.VERYHARD},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,                                        },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.SHORT,    "curve":-ROAD.CURVE.VERYHARD},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                                         },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":-ROAD.CURVE.MEDIUM                                    },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                                                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":-ROAD.CURVE.VERYHARD},
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG-30,                                                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.LONG,     "curve":ROAD.CURVE.VERYHARD,         },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                                                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,                                                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG, "curve":ROAD.CURVE.VERYHARD,                                                            },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,     "curve":-ROAD.CURVE.HARD,                                                           },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,     "curve":-ROAD.CURVE.MEDIUM,                                                           },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.EXTRALONG,                                                                },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM,     "curve":ROAD.CURVE.EASY,        },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.MEDIUM+20, },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.SHORT, "curve":-ROAD.CURVE.HARD,  },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.SHORT, "curve":-ROAD.CURVE.HARD,  },
    {"roadtype": ROAD.TYPE.STANDARD, "length":ROAD.LENGTH.SHORT, "curve":-ROAD.CURVE.MEDIUM,  },

    {"roadtype": ROAD.TYPE.FINAL, "length":ROAD.LENGTH.MEDIUM+28,      }
]
LEVEL_INFO[2] = {   "time":70000, "num_cars":0, "num_laps":5,
                    "minimap":{x:0,y:0,scale:0.60,rot:0},
                    "terrain":{ "roadbounds":2, "num_lanes":1, "adherence":1, "max_inertia":0.03, 
                                "color": {
                                        "light":  { road: '#444444', grass: "#45773f", rumble: '#fff', lane: '#fff'  },
                                        "dark":   { road: '#141414', grass: "#1d3f1b", rumble: '#8a1515'                }
                                    },
                                    "color_alt": {
                                        "light":  { road: '#444444', grass: "#45773f", rumble: '#0d6b92', lane: '#fff'  },
                                        "dark":   { road: '#141414', grass: "#1d3f1b", rumble: '#0d6b92'                }
                                    }
                            }
                };
AMBIENT_INFO[2] = [
    {"type":AMBIENT.TYPE.FILL_TRACK, "sprite": SPRITES.SECURITY_WALL, "position":8, "repetitionevery": 10, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"type":AMBIENT.TYPE.FINISH, "sprite": SPRITES.FINISH},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_1, "position":0, "segments":[200, 750], "repetitionevery": 30, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_2, "position":0, "segments":[1350, 1600], "repetitionevery": 40, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_2, "position":0, "segments":[1700, 2300], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.BOTH, "sprite": SPRITES.BILLBOARD_4, "position":2, "segments":[2350, 2350], "repetitionevery": 50, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_1, "position":0, "segments":[2600, 3200], "repetitionevery": 60, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_0, "position":0, "segments":[3500, 4000], "repetitionevery": 60, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.LEFT, "sprite": SPRITES.BILLBOARD_3, "position":2, "segments":[4300, 5100], "repetitionevery": 100, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.RIGHT, "sprite": SPRITES.BILLBOARD_3, "position":2, "segments":[4350, 5150], "repetitionevery": 100, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.CENTER, "sprite": SPRITES.BILLBOARD_ARC_1, "position":0, "segments":[6000, 6900], "repetitionevery": 100, "disposition":AMBIENT.DISPOSITION.PRECISE},
    
    {"side":AMBIENT.SIDE.RIGHT, "sprite": SPRITES.BILLBOARD_3, "position":2, "segments":[6050, 6900], "repetitionevery": 300, "disposition":AMBIENT.DISPOSITION.PRECISE},
    {"side":AMBIENT.SIDE.LEFT, "sprite": SPRITES.BILLBOARD_4, "position":2, "segments":[6850, 6850], "repetitionevery": 300, "disposition":AMBIENT.DISPOSITION.PRECISE},
]

////////////////