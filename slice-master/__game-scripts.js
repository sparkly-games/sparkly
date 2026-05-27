var SoundButton = pc.createScript("soundButton");
SoundButton.attributes.add("noSound", {
  type: "entity"
});
SoundButton.prototype.initialize = function () {};
SoundButton.prototype.onSoundChange = function (p) {
  this.noSound.enabled = p;
};
SoundButton.prototype.update = function (p2) {
  this.noSound.enabled = GameAudio.mute;
};
SoundButton.prototype.onEnable = function () {
  this.onSoundChange(GameAudio.mute);
};
var UiBarMasked = pc.createScript("uiBarMasked");
var vO5 = {
  type: "boolean",
  default: !1,
  title: "horizontal"
};
UiBarMasked.attributes.add("barImageSize", {
  type: "number",
  default: 100,
  title: "barImageSize"
});
UiBarMasked.attributes.add("barImage", {
  type: "entity"
});
UiBarMasked.attributes.add("progress", {
  type: "number",
  default: 0.5,
  title: "progress"
});
UiBarMasked.attributes.add("horizontal", vO5);
UiBarMasked.prototype.initialize = function () {};
UiBarMasked.prototype.update = function (p3) {
  if (this.progress > 1) {
    this.progress = 1;
  } else if (this.progress < 0) {
    this.progress = 0;
  }
  this.updateBar();
};
UiBarMasked.prototype.updateBar = function () {
  var v = this.entity.getLocalPosition();
  var v2 = this.barImage.getLocalPosition();
  var v3 = this.barImageSize * (1 - this.progress);
  if (this.horizontal) {
    v.x = -v3;
    v2.x = v3;
  } else {
    v.y = -v3;
    v2.y = v3;
  }
  this.entity.setLocalPosition(v);
  this.barImage.setLocalPosition(v2);
};
var Uipopup = pc.createScript("uipopup");
Uipopup.attributes.add("fader", {
  type: "entity"
});
Uipopup.attributes.add("name", {
  type: "string",
  default: "Popup Name"
});
Uipopup.popups = [];
Uipopup.STATE_OPENING = 1;
Uipopup.STATE_OPENED = 2;
Uipopup.STATE_CLOSING = 3;
Uipopup.STATE_CLOSED = 4;
Uipopup.prototype.initialize = function () {
  Uipopup.popups.push(this);
  this.entity.enabled = !1;
  this.state = Uipopup.STATE_CLOSED;
  this.tw = null;
};
Uipopup.open = function (p4, p5) {
  var v4;
  for (var vLN0 = 0; vLN0 < Uipopup.popups.length; vLN0++) {
    if ((v4 = Uipopup.popups[vLN0]).name == p4) {
      v4.open();
    } else if (p5) {
      v4.close();
    }
  }
};
Uipopup.isShown = function (p6) {
  var v5;
  for (var vLN02 = 0; vLN02 < Uipopup.popups.length; vLN02++) {
    if ((v5 = Uipopup.popups[vLN02]).name == p6) {
      return v5.entity.enabled;
    }
  }
};
Uipopup.close = function (p7) {
  var v6;
  for (var vLN03 = 0; vLN03 < Uipopup.popups.length; vLN03++) {
    if ((v6 = Uipopup.popups[vLN03]).name == p7) {
      v6.close();
    }
  }
};
Uipopup.prototype.open = function () {
  if (this.state == Uipopup.STATE_CLOSED || this.name == "Pause") {
    if (this.fader) {
      this.fader.enabled = true;
    }
    this.state = Uipopup.STATE_OPENING;
    this.entity.setLocalScale(0, 0, 0);
    this.entity.enabled = true;
    if (this.tw) {
      this.tw.stop();
    }
    this.tw = this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(1, 1, 1), 0.3, pc.SineOut).loop(false).yoyo(false).start();
    setTimeout(function () {
      this.state = Uipopup.STATE_OPENED;
      this.tw = null;
    }.bind(this), 400);
  }
};
Uipopup.prototype.close = function () {
  if (this.state == Uipopup.STATE_OPENED || this.state == Uipopup.STATE_OPENING) {
    this.state = Uipopup.STATE_CLOSING;
    if (this.tw) {
      this.tw.stop();
    }
    this.tw = this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(0, 0, 0), 0.3, pc.BackIn).loop(false).yoyo(false).start();
    setTimeout(function () {
      this.tw = null;
      if (this.fader) {
        var v7;
        var v8 = false;
        for (var vLN04 = 0; vLN04 < Uipopup.popups.length; vLN04++) {
          if ((v7 = Uipopup.popups[vLN04]).state == Uipopup.STATE_OPENED || v7.state == Uipopup.STATE_OPENING) {
            if (v7.fader == this.fader) {
              v8 = true;
            }
          }
        }
        if (!v8) {
          this.fader.enabled = false;
        }
      }
      this.state = Uipopup.STATE_CLOSED;
      this.entity.enabled = false;
    }.bind(this), 400);
  }
};
Uipopup.prototype.update = function (p8) {
  if (this.state == Uipopup.STATE_OPENED || this.state == Uipopup.STATE_OPENING) {
    if (this.fader) {
      this.fader.enabled = true;
    }
  }
};
var TextIcon = pc.createScript("textIcon");
var vO11 = {
  type: "boolean",
  default: !0,
  title: "left side icon"
};
TextIcon.attributes.add("icon", {
  type: "entity"
});
TextIcon.attributes.add("spacing", {
  type: "number",
  default: 20,
  title: "icon spacing"
});
TextIcon.attributes.add("yspacing", {
  type: "number",
  default: 0,
  title: "icon y-spacing"
});
TextIcon.attributes.add("leftside", vO11);
TextIcon.attributes.add("lerpTime", {
  type: "number",
  default: 1,
  title: "lerp speed"
});
TextIcon.prototype.initialize = function () {
  if (this.leftside) {
    this.targX = -(this.spacing + this.entity.element.textWidth * 0.5);
  } else {
    this.targX = this.spacing + this.entity.element.textWidth * 0.5;
  }
};
TextIcon.prototype.update = function (p9) {
  var v9;
  v9 = this.leftside ? -(this.spacing + this.entity.element.textWidth * 0.5) : this.spacing + this.entity.element.textWidth * 0.5;
  if (this.spacing == 0) {
    v9 = 0;
  }
  this.targX = pc.math.lerp(this.targX, v9, this.lerpTime * p9);
  this.icon.setLocalPosition(this.targX, this.yspacing, 0);
};
var MusicBut = pc.createScript("musicBut");
MusicBut.attributes.add("noSound", {
  type: "entity"
});
MusicBut.prototype.initialize = function () {};
MusicBut.prototype.onSoundChange = function (p10) {
  this.noSound.enabled = p10;
};
MusicBut.prototype.update = function (p11) {
  this.noSound.enabled = GameAudio.muteMus;
};
MusicBut.prototype.onEnable = function () {
  this.onSoundChange(GameAudio.muteMus);
};
var Mover = pc.createScript("mover");
var vO17 = {
  type: "boolean",
  default: !0
};
var vO18 = {
  type: "boolean",
  default: !0
};
var vO19 = {
  type: "boolean",
  default: !1
};
var vO20 = {
  type: "boolean",
  default: !1
};
Mover.attributes.add("delta", {
  type: "vec3"
});
Mover.attributes.add("time", {
  type: "number",
  default: 1
});
Mover.attributes.add("delay", {
  type: "number",
  default: 0
});
Mover.attributes.add("loop", vO17);
Mover.attributes.add("yoyo", vO18);
Mover.attributes.add("onEnable", vO19);
Mover.attributes.add("endPos", vO20);
Mover.attributes.add("easeType", {
  type: "string",
  default: "SineInOut"
});
Mover.attributes.add("playSound", {
  type: "string",
  default: ""
});
Mover.prototype.initialize = function () {
  var v10 = this.entity.getLocalPosition().clone();
  v10.add(this.delta);
  this.startPos = this.entity.getLocalPosition().clone();
  if (this.endPos) {
    this.startPos.sub(this.delta);
    this.entity.setLocalPosition(this.startPos);
  }
  if (this.onEnable) {
    this.onEnableCb();
    this.on("enable", this.onEnableCb, this);
  } else {
    if (this.playSound) {
      GameAudio.play(this.playSound);
    }
    this.entity.tween(this.entity.getLocalPosition()).to(v10, this.time, pc[this.easeType]).loop(this.loop).yoyo(this.yoyo).delay(this.delay).start();
  }
};
Mover.prototype.onEnableCb = function () {
  if (this.playSound) {
    GameAudio.play(this.playSound);
  }
  this.entity.setLocalPosition(this.startPos);
  var v11 = this.entity.getLocalPosition().clone();
  v11.add(this.delta);
  this.entity.tween(this.entity.getLocalPosition()).to(v11, this.time, pc[this.easeType]).loop(this.loop).yoyo(this.yoyo).delay(this.delay).start();
};
Mover.prototype.update = function (p12) {};
var ObjectPool = pc.createScript("objectPool");
var vO23 = {
  type: "entity",
  array: !0
};
ObjectPool.attributes.add("prefabs", vO23);
ObjectPool.pool = {};
ObjectPool.instantiate = function (p13, p14, p15) {
  var v12 = ObjectPool.pop(p13);
  p15.addChild(v12);
  v12.setPosition(p14);
  v12.enabled = !0;
  return v12;
};
ObjectPool.pop = function (p16, p17) {
  var v13;
  var v14 = ObjectPool.pool[p16];
  if (v14) {
    if (v14.pool.length === 0) {
      v13 = v14.entity.clone();
    } else {
      (v13 = v14.pool.pop()).enabled = true;
    }
    return v13;
  } else {
    console.log("ObjectPool.pop(): pool for this object doesn't exist - " + p16);
    return null;
  }
};
ObjectPool.push = function (p18) {
  var v15 = ObjectPool.pool[p18.name];
  if (v15) {
    if (v15.entity != p18) {
      if (v15.pool.length < v15.maxCount) {
        v15.pool.push(p18);
        p18.enabled = false;
        if (p18.parent) {
          p18.parent.removeChild(p18);
        }
      } else {
        p18.destroy();
      }
    }
  } else {
    console.log("ObjectPool.push(): pool for this object doesn't exist - " + p18.name);
  }
};
ObjectPool.setMaxCount = function (p19, p20) {
  var v16 = ObjectPool.pool[p19];
  if (v16) {
    v16.maxCount = p20;
  } else {
    console.log("ObjectPool.setMaxCount(): pool for this object doesn't exist - " + p19);
  }
};
ObjectPool.setPrefab = function (p21, p22) {
  ObjectPool.pool[p21].entity = p22;
};
ObjectPool.prototype.initialize = function () {
  var v17;
  var v18;
  for (var vLN05 = 0; vLN05 < this.prefabs.length; vLN05++) {
    v18 = this.prefabs[vLN05];
    (v17 = {}).maxCount = 50;
    v17.entity = v18;
    v17.pool = [];
    v18.enabled = !1;
    ObjectPool.pool[v18.name] = v17;
    console.log("ObjectPool.initialize(): entity pooled - " + v18.name);
  }
  ObjectPool.setMaxCount("Effect3DDrop", 50);
  ObjectPool.setMaxCount("EffectDrop", 200);
  ObjectPool.setMaxCount("MsgText", 110);
  ObjectPool.setMaxCount("Trail1", 25);
  ObjectPool.setMaxCount("Trail2", 25);
};
var Scaler = pc.createScript("scaler");
var vO27 = {
  type: "boolean",
  default: !0
};
var vO28 = {
  type: "boolean",
  default: !0
};
var vO30 = {
  type: "boolean",
  default: !1
};
Scaler.attributes.add("easeType", {
  type: "string",
  default: "SineInOut"
});
Scaler.attributes.add("targetSize", {
  type: "number",
  default: 1.5
});
Scaler.attributes.add("time", {
  type: "number",
  default: 1
});
Scaler.attributes.add("loop", vO27);
Scaler.attributes.add("yoyo", vO28);
Scaler.attributes.add("delay", {
  type: "number",
  default: 0
});
Scaler.attributes.add("onEnable", vO30);
Scaler.prototype.initialize = function () {
  this.startScale = this.entity.getLocalScale().clone();
  this._delay = this.delay;
  this.firstStep = !0;
  this.tween = null;
  if (this.onEnable) {
    this.onEnableCb();
    this.on("enable", this.onEnableCb, this);
  }
};
Scaler.prototype.onEnableCb = function () {
  if (this.tween) {
    this.tween.stop();
  }
  this.entity.setLocalScale(this.startScale);
  this._delay = this.delay;
  this.firstStep = !0;
};
Scaler.prototype.update = function (p23) {
  if (this._delay > 0 || this.firstStep) {
    this.firstStep = false;
    this._delay -= p23;
    if (this._delay <= 0) {
      this.tween = this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(this.targetSize, this.targetSize, this.targetSize), this.time, pc[this.easeType]).loop(this.loop).yoyo(this.yoyo).start();
    }
  }
};
var Trail = pc.createScript("trail");
Trail.attributes.add("trailSprite", {
  type: "entity"
});
Trail.attributes.add("startWidth", {
  type: "number",
  default: 1
});
Trail.attributes.add("endWidth", {
  type: "number",
  default: 0
});
Trail.attributes.add("timeToNewSegment", {
  type: "number",
  default: 1
});
Trail.attributes.add("maxSegments", {
  type: "number",
  default: 10
});
Trail.prototype.initialize = function () {
  this.destroyIfShort = !1;
  this.trailSprite.enabled = !1;
  this.segments = [];
  this.segmentsCount = 0;
  this.segmentsDist = [];
  this.length = 0;
  this.time = 0;
  this.active = !0;
  this.nx = 1;
  this.ny = 0;
  this.dist = 0;
  this.px = 0;
  this.py = 0;
};
Trail.prototype.updateTrail = function (p24) {
  this.length = 0;
  if (this.segmentsCount === 1) {
    this.segments[0].enabled = !1;
  } else if (this.segmentsCount > 0) {
    var v19 = this.entity.getPosition();
    var v20 = this.segments[0];
    var vLN06 = 0;
    var vLN07 = 0;
    var vLN08 = 0;
    var vLN09 = 0;
    var vLN010 = 0;
    var vLN011 = 0;
    var v21 = this.trailSprite.sprite.sprite.pixelsPerUnit / 64;
    v20.setPosition(v19);
    for (var vLN1 = 1; vLN1 < this.segmentsCount; vLN1++) {
      vLN011 = pc.math.lerp(this.startWidth, this.endWidth, (vLN1 + 1) / this.segmentsCount);
      vLN08 = (vLN06 = (vLN07 = this.segments[vLN1]).getPosition()).x - v19.x;
      vLN09 = vLN06.y - v19.y;
      v20.setEulerAngles(0, 0, Math.atan2(vLN09, vLN08) * 180 / Math.PI);
      vLN010 = Math.sqrt(vLN08 * vLN08 + vLN09 * vLN09);
      if (vLN1 == 1) {
        this.nx = vLN08 / vLN010;
        this.ny = vLN09 / vLN010;
        this.dist = vLN010;
        this.px = v19.x;
        this.py = v19.y;
      }
      this.segmentsDist[vLN1 - 1] = vLN010;
      this.length += vLN010;
      v20.setLocalScale(vLN010 * v21 * 1.05, vLN011, 1);
      v19 = vLN06;
      v20 = vLN07;
      if (vLN1 === this.segmentsCount - 1) {
        v20.enabled = false;
      } else {
        v20.enabled = true;
      }
    }
  }
};
Trail.prototype.update = function (p25) {
  if (!this.active) {
    return 1;
  }
  this.time += p25;
  if (this.time >= this.timeToNewSegment) {
    this.time = 0;
    this.entity.getPosition();
    var v22 = ObjectPool.pop(this.trailSprite.name);
    v22.setPosition(0, 0, -1000);
    this.app.root.addChild(v22);
    for (var v23 = this.segmentsCount - 1; v23 >= 0; v23--) {
      this.segments[v23 + 1] = this.segments[v23];
    }
    this.segments[0] = v22;
    v22.enabled = !0;
    this.segmentsCount++;
    if (this.segmentsCount > this.maxSegments) {
      this.segmentsCount = this.maxSegments;
      ObjectPool.push(this.segments[this.maxSegments]);
    }
  }
  this.updateTrail();
  if (this.destroyIfShort && this.length <= 0.01) {
    for (v23 = 0; v23 < this.segmentsCount; v23++) {
      ObjectPool.push(this.segments[v23]);
    }
    this.entity.destroy();
  }
};
Trail.prototype.flushTrail = function () {
  for (var vLN012 = 0; vLN012 < this.segmentsCount; vLN012++) {
    ObjectPool.push(this.segments[vLN012]);
  }
  this.segmentsCount = 0;
};
var MathUtil = pc.createScript("mathUtil");
MathUtil.DEG_TO_RAD = Math.PI / 180;
MathUtil.RAD_TO_DEG = 180 / Math.PI;
MathUtil.shuffleArray = function (p26) {
  for (var v24 = p26.length - 1; v24 > 0; v24--) {
    var v25 = Math.floor(Math.random() * (v24 + 1));
    var v26 = p26[v24];
    p26[v24] = p26[v25];
    p26[v25] = v26;
  }
};
MathUtil.addNumbersToArray = function (p27, p28, p29) {
  for (var vP28 = p28; vP28 <= p29; vP28++) {
    p27.push(vP28);
  }
};
MathUtil.irr = function (p30, p31) {
  return Math.round(p30 + Math.random() * (p31 - p30));
};
MathUtil.getRandomInt = function (p32) {
  return Math.floor(Math.random() * p32);
};
MathUtil.getRandomElement = function (p33) {
  return p33[Math.floor(Math.random() * p33.length)];
};
MathUtil.chance = function (p34) {
  return Math.random() <= p34;
};
MathUtil.angleDifference = function (p35, p36) {
  var v27;
  var v28;
  if (p35 < 0) {
    p35 += 360;
  }
  if (p36 < 0) {
    p36 += 360;
  }
  v27 = p36 - p35;
  v28 = 360 - p36 + p35;
  if (Math.abs(v27) > v28) {
    return v28;
  } else {
    return v27;
  }
};
MathUtil.choose = function () {
  var vA = [];
  for (var vLN013 = 0; vLN013 < arguments.length; vLN013++) {
    vA.push(arguments[vLN013]);
  }
  var v29 = Math.round(pc.math.random(0, arguments.length - 1));
  return vA[v29];
};
MathUtil.createArrayOfIntegers = function (p37, p38) {
  var vA2 = [];
  for (var vP37 = p37; vP37 <= p38; vP37++) {
    vA2.push(vP37);
  }
  return vA2;
};
MathUtil.prototype.dot = function (p39, p40) {
  return p39.x * p40.x + p39.y * p40.y + p39.z * p40.z + p39.w * p40.w;
};
MathUtil.prototype.quatAngle = function (p41, p42) {
  var v30 = this.dot(p41, p42);
  if (p41.equals(p42)) {
    return 0;
  } else {
    return Math.acos(Math.min(Math.abs(v30), 1)) * 2 * MathUtil.RAD_TO_DEG;
  }
};
MathUtil.prototype.rotateTowards = function (p43, p44, p45) {
  if (this.quatAngle(p43, p44) === 0) {
    return p44;
  } else {
    return new pc.Quat().slerp(p43, p44, p45);
  }
};
(function (p46) {
  if (typeof exports == "object" && typeof module != "undefined") {
    module.exports = p46();
  } else if (typeof define == "function" && define.amd) {
    define([], p46);
  } else {
    var v47;
    v47 = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
    v47.store = p46();
  }
})(function () {
  var v48;
  var v49;
  var v50;
  return function f(p53, p54, p55) {
    function f2(p56, p57) {
      if (!p54[p56]) {
        if (!p53[p56]) {
          var v51 = typeof require == "function" && require;
          if (!p57 && v51) {
            return v51(p56, true);
          }
          if (v55) {
            return v55(p56, true);
          }
          var v52 = new Error("Cannot find module '" + p56 + "'");
          v52.code = "MODULE_NOT_FOUND";
          throw v52;
        }
        var v53 = p54[p56] = {
          exports: {}
        };
        p53[p56][0].call(v53.exports, function (p58) {
          var v54 = p53[p56][1][p58];
          return f2(v54 ? v54 : p58);
        }, v53, v53.exports, f, p53, p54, p55);
      }
      return p54[p56].exports;
    }
    var v55 = typeof require == "function" && require;
    for (var vLN015 = 0; vLN015 < p55.length; vLN015++) {
      f2(p55[vLN015]);
    }
    return f2;
  }({
    1: [function (p59, p60, p61) {
      'use strict';

      var vP59 = p59("../src/store-engine");
      var vP592 = p59("../storages/all");
      var vA4 = [p59("../plugins/json2")];
      p60.exports = vP59.createStore(vP592, vA4);
    }, {
      "../plugins/json2": 2,
      "../src/store-engine": 4,
      "../storages/all": 6
    }],
    2: [function (p62, p63, p64) {
      'use strict';

      function f3() {
        p62("./lib/json2");
        return {};
      }
      p63.exports = f3;
    }, {
      "./lib/json2": 3
    }],
    3: [function (p65, p66, p67) {
      'use strict';

      var v56 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (p68) {
        return typeof p68;
      } : function (p69) {
        if (p69 && typeof Symbol == "function" && p69.constructor === Symbol && p69 !== Symbol.prototype) {
          return "symbol";
        } else {
          return typeof p69;
        }
      };
      if ((typeof JSON == "undefined" ? "undefined" : v56(JSON)) !== "object") {
        JSON = {};
      }
      (function () {
        function f4(p70) {
          if (p70 < 10) {
            return "0" + p70;
          } else {
            return p70;
          }
        }
        function f5() {
          return this.valueOf();
        }
        function f6(p71) {
          v68.lastIndex = 0;
          if (v68.test(p71)) {
            return "\"" + p71.replace(v68, function (p72) {
              var v57 = v72[p72];
              if (typeof v57 == "string") {
                return v57;
              } else {
                return "\\u" + ("0000" + p72.charCodeAt(0).toString(16)).slice(-4);
              }
            }) + "\"";
          } else {
            return "\"" + p71 + "\"";
          }
        }
        function f7(p73, p74) {
          var v58;
          var v59;
          var v60;
          var v61;
          var v62;
          var v_0x1ec5b = v70;
          var v63 = p74[p73];
          if (v63 && (typeof v63 == "undefined" ? "undefined" : v56(v63)) === "object" && typeof v63.toJSON == "function") {
            v63 = v63.toJSON(p73);
          }
          if (typeof v73 == "function") {
            v63 = v73.call(p74, p73, v63);
          }
          switch (typeof v63 == "undefined" ? "undefined" : v56(v63)) {
            case "string":
              return f6(v63);
            case "number":
              if (isFinite(v63)) {
                return String(v63);
              } else {
                return "null";
              }
            case "boolean":
            case "null":
              return String(v63);
            case "object":
              if (!v63) {
                return "null";
              }
              v70 += v71;
              v62 = [];
              if (Object.prototype.toString.apply(v63) === "[object Array]") {
                v61 = v63.length;
                v58 = 0;
                for (; v58 < v61; v58 += 1) {
                  v62[v58] = f7(v58, v63) || "null";
                }
                v60 = v62.length === 0 ? "[]" : v70 ? "[\n" + v70 + v62.join(",\n" + v70) + "\n" + v_0x1ec5b + "]" : "[" + v62.join(",") + "]";
                v70 = v_0x1ec5b;
                return v60;
              }
              if (v73 && (typeof v73 == "undefined" ? "undefined" : v56(v73)) === "object") {
                v61 = v73.length;
                v58 = 0;
                for (; v58 < v61; v58 += 1) {
                  if (typeof v73[v58] == "string") {
                    v59 = v73[v58];
                    v60 = f7(v59, v63);
                    if (v60) {
                      v62.push(f6(v59) + (v70 ? ": " : ":") + v60);
                    }
                  }
                }
              } else {
                for (v59 in v63) {
                  if (Object.prototype.hasOwnProperty.call(v63, v59)) {
                    v60 = f7(v59, v63);
                    if (v60) {
                      v62.push(f6(v59) + (v70 ? ": " : ":") + v60);
                    }
                  }
                }
              }
              v60 = v62.length === 0 ? "{}" : v70 ? "{\n" + v70 + v62.join(",\n" + v70) + "\n" + v_0x1ec5b + "}" : "{" + v62.join(",") + "}";
              v70 = v_0x1ec5b;
              return v60;
          }
        }
        var v64 = /^[\],:{}\s]*$/;
        var v65 = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var v66 = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var v67 = /(?:^|:|,)(?:\s*\[)+/g;
        var v68 = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var v69 = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        if (typeof Date.prototype.toJSON != "function") {
          Date.prototype.toJSON = function () {
            if (isFinite(this.valueOf())) {
              return this.getUTCFullYear() + "-" + f4(this.getUTCMonth() + 1) + "-" + f4(this.getUTCDate()) + "T" + f4(this.getUTCHours()) + ":" + f4(this.getUTCMinutes()) + ":" + f4(this.getUTCSeconds()) + "Z";
            } else {
              return null;
            }
          };
          Boolean.prototype.toJSON = f5;
          Number.prototype.toJSON = f5;
          String.prototype.toJSON = f5;
        }
        var v70;
        var v71;
        var v72;
        var v73;
        if (typeof JSON.stringify != "function") {
          v72 = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
          };
          JSON.stringify = function (p75, p76, p77) {
            var v74;
            v70 = "";
            v71 = "";
            if (typeof p77 == "number") {
              for (v74 = 0; v74 < p77; v74 += 1) {
                v71 += " ";
              }
            } else if (typeof p77 == "string") {
              v71 = p77;
            }
            v73 = p76;
            if (p76 && typeof p76 != "function" && ((typeof p76 == "undefined" ? "undefined" : v56(p76)) !== "object" || typeof p76.length != "number")) {
              throw new Error("JSON.stringify");
            }
            var vO47 = {
              "": p75
            };
            return f7("", vO47);
          };
        }
        if (typeof JSON.parse != "function") {
          JSON.parse = function (p78, p79) {
            function f8(p80, p81) {
              var v75;
              var v76;
              var v77 = p80[p81];
              if (v77 && (typeof v77 == "undefined" ? "undefined" : v56(v77)) === "object") {
                for (v75 in v77) {
                  if (Object.prototype.hasOwnProperty.call(v77, v75)) {
                    v76 = f8(v77, v75);
                    if (v76 !== undefined) {
                      v77[v75] = v76;
                    } else {
                      delete v77[v75];
                    }
                  }
                }
              }
              return p79.call(p80, p81, v77);
            }
            var v78;
            p78 = String(p78);
            v69.lastIndex = 0;
            if (v69.test(p78)) {
              p78 = p78.replace(v69, function (p82) {
                return "\\u" + ("0000" + p82.charCodeAt(0).toString(16)).slice(-4);
              });
            }
            if (v64.test(p78.replace(v65, "@").replace(v66, "]").replace(v67, ""))) {
              v78 = eval("(" + p78 + ")");
              if (typeof p79 == "function") {
                return f8({
                  "": v78
                }, "");
              } else {
                return v78;
              }
            }
            throw new SyntaxError("JSON.parse");
          };
        }
      })();
    }, {}],
    4: [function (p83, p84, p85) {
      'use strict';

      function f9() {
        var v79 = typeof console == "undefined" ? null : console;
        if (v79) {
          var v80 = v79.warn ? v79.warn : v79.log;
          v80.apply(v79, arguments);
        }
      }
      function f10(p86, p87, p88) {
        p88 ||= "";
        if (p86 && !v93(p86)) {
          p86 = [p86];
        }
        if (p87 && !v93(p87)) {
          p87 = [p87];
        }
        var v81 = p88 ? "__storejs_" + p88 + "_" : "";
        var v82 = p88 ? new RegExp("^" + v81) : null;
        var v83 = /^[a-zA-Z0-9_\-]*$/;
        if (!v83.test(p88)) {
          throw new Error("store.js namespaces can only have alphanumerics + underscores and dashes");
        }
        var vO49 = {
          _namespacePrefix: v81,
          _namespaceRegexp: v82,
          _testStorage: function (p89) {
            try {
              var vLS__storejs__test__ = "__storejs__test__";
              p89.write(vLS__storejs__test__, vLS__storejs__test__);
              var v84 = p89.read(vLS__storejs__test__) === vLS__storejs__test__;
              p89.remove(vLS__storejs__test__);
              return v84;
            } catch (e3) {
              return false;
            }
          },
          _assignPluginFnProp: function (p90, p91) {
            var v85 = this[p91];
            this[p91] = function () {
              function f11() {
                if (v85) {
                  v90(arguments, function (p92, p93) {
                    v_0x4ffcc2[p93] = p92;
                  });
                  return v85.apply(vThis, v_0x4ffcc2);
                }
              }
              var v_0x4ffcc2 = v88(arguments, 0);
              var vThis = this;
              var v86 = [f11].concat(v_0x4ffcc2);
              return p90.apply(vThis, v86);
            };
          },
          _serialize: function (p94) {
            return JSON.stringify(p94);
          },
          _deserialize: function (p95, p96) {
            if (!p95) {
              return p96;
            }
            var vLS = "";
            try {
              vLS = JSON.parse(p95);
            } catch (e4) {
              vLS = p95;
            }
            if (vLS !== undefined) {
              return vLS;
            } else {
              return p96;
            }
          },
          _addStorage: function (p97) {
            if (!this.enabled) {
              if (this._testStorage(p97)) {
                this.storage = p97;
                this.enabled = true;
              }
            }
          },
          _addPlugin: function (p98) {
            var vThis2 = this;
            if (v93(p98)) {
              v90(p98, function (p99) {
                vThis2._addPlugin(p99);
              });
              return;
            }
            var v_0x478fd5 = v89(this.plugins, function (p100) {
              return p98 === p100;
            });
            if (!v_0x478fd5) {
              this.plugins.push(p98);
              if (!v94(p98)) {
                throw new Error("Plugins must be function values that return objects");
              }
              var v87 = p98.call(this);
              if (!v95(v87)) {
                throw new Error("Plugins must return an object of function properties");
              }
              v90(v87, function (p101, p102) {
                if (!v94(p101)) {
                  throw new Error("Bad plugin property: " + p102 + " from plugin " + p98.name + ". Plugins should only return functions.");
                }
                vThis2._assignPluginFnProp(p101, p102);
              });
            }
          },
          addStorage: function (p103) {
            f9("store.addStorage(storage) is deprecated. Use createStore([storages])");
            this._addStorage(p103);
          }
        };
        var v_0x45df86 = v92(vO49, vO51, {
          plugins: []
        });
        v_0x45df86.raw = {};
        v90(v_0x45df86, function (p104, p105) {
          if (v94(p104)) {
            v_0x45df86.raw[p105] = v91(v_0x45df86, p104);
          }
        });
        v90(p86, function (p106) {
          v_0x45df86._addStorage(p106);
        });
        v90(p87, function (p107) {
          v_0x45df86._addPlugin(p107);
        });
        return v_0x45df86;
      }
      var vP83 = p83("./util");
      var v88 = vP83.slice;
      var v89 = vP83.pluck;
      var v90 = vP83.each;
      var v91 = vP83.bind;
      var v92 = vP83.create;
      var v93 = vP83.isList;
      var v94 = vP83.isFunction;
      var v95 = vP83.isObject;
      var vO50 = {
        createStore: f10
      };
      p84.exports = vO50;
      var vO51 = {
        version: "2.0.12",
        enabled: false,
        get: function (p108, p109) {
          var v96 = this.storage.read(this._namespacePrefix + p108);
          return this._deserialize(v96, p109);
        },
        set: function (p110, p111) {
          if (p111 === undefined) {
            return this.remove(p110);
          } else {
            this.storage.write(this._namespacePrefix + p110, this._serialize(p111));
            return p111;
          }
        },
        remove: function (p112) {
          this.storage.remove(this._namespacePrefix + p112);
        },
        each: function (p113) {
          var vThis3 = this;
          this.storage.each(function (p114, p115) {
            p113.call(vThis3, vThis3._deserialize(p114), (p115 || "").replace(vThis3._namespaceRegexp, ""));
          });
        },
        clearAll: function () {
          this.storage.clearAll();
        },
        hasNamespace: function (p116) {
          return this._namespacePrefix == "__storejs_" + p116 + "_";
        },
        createStore: function () {
          return f10.apply(this, arguments);
        },
        addPlugin: function (p117) {
          this._addPlugin(p117);
        },
        namespace: function (p118) {
          return f10(this.storage, this.plugins, p118);
        }
      };
    }, {
      "./util": 5
    }],
    5: [function (p119, p120, p121) {
      (function (p122) {
        'use strict';

        function f12() {
          if (Object.assign) {
            return Object.assign;
          } else {
            return function (p123, p124, p125, p126) {
              for (var vLN12 = 1; vLN12 < arguments.length; vLN12++) {
                f18(Object(arguments[vLN12]), function (p127, p128) {
                  p123[p128] = p127;
                });
              }
              return p123;
            };
          }
        }
        function f13() {
          if (Object.create) {
            return function (p129, p130, p131, p132) {
              var v_0x3b7aeb = f17(arguments, 1);
              return vF12.apply(this, [Object.create(p129)].concat(v_0x3b7aeb));
            };
          }
          function f14() {}
          return function (p133, p134, p135, p136) {
            var v_0x3b7aeb2 = f17(arguments, 1);
            f14.prototype = p133;
            return vF12.apply(this, [new f14()].concat(v_0x3b7aeb2));
          };
        }
        function f15() {
          if (String.prototype.trim) {
            return function (p137) {
              return String.prototype.trim.call(p137);
            };
          } else {
            return function (p138) {
              return p138.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            };
          }
        }
        function f16(p139, p140) {
          return function () {
            return p140.apply(p139, Array.prototype.slice.call(arguments, 0));
          };
        }
        function f17(p141, p142) {
          return Array.prototype.slice.call(p141, p142 || 0);
        }
        function f18(p143, p144) {
          f20(p143, function (p145, p146) {
            p144(p145, p146);
            return false;
          });
        }
        function f19(p147, p148) {
          var v97 = f21(p147) ? [] : {};
          f20(p147, function (p149, p150) {
            v97[p150] = p148(p149, p150);
            return false;
          });
          return v97;
        }
        function f20(p151, p152) {
          if (f21(p151)) {
            for (var vLN016 = 0; vLN016 < p151.length; vLN016++) {
              if (p152(p151[vLN016], vLN016)) {
                return p151[vLN016];
              }
            }
          } else {
            for (var v98 in p151) {
              if (p151.hasOwnProperty(v98) && p152(p151[v98], v98)) {
                return p151[v98];
              }
            }
          }
        }
        function f21(p153) {
          return p153 != null && typeof p153 != "function" && typeof p153.length == "number";
        }
        function f22(p154) {
          return p154 && {}.toString.call(p154) === "[object Function]";
        }
        function f23(p155) {
          return p155 && {}.toString.call(p155) === "[object Object]";
        }
        var vF12 = f12();
        var vF13 = f13();
        var vF15 = f15();
        var v99 = typeof window != "undefined" ? window : p122;
        var vO52 = {
          assign: vF12,
          create: vF13,
          trim: vF15,
          bind: f16,
          slice: f17,
          each: f18,
          map: f19,
          pluck: f20,
          isList: f21,
          isFunction: f22,
          isObject: f23,
          Global: v99
        };
        p120.exports = vO52;
      }).call(this, typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
    }, {}],
    6: [function (p156, p157, p158) {
      'use strict';

      p157.exports = [p156("./localStorage"), p156("./oldFF-globalStorage"), p156("./oldIE-userDataStorage"), p156("./cookieStorage"), p156("./sessionStorage"), p156("./memoryStorage")];
    }, {
      "./cookieStorage": 7,
      "./localStorage": 8,
      "./memoryStorage": 9,
      "./oldFF-globalStorage": 10,
      "./oldIE-userDataStorage": 11,
      "./sessionStorage": 12
    }],
    7: [function (p159, p160, p161) {
      'use strict';

      function f24(p162) {
        if (!p162 || !f29(p162)) {
          return null;
        }
        var v100 = "(?:^|.*;\\s*)" + escape(p162).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*";
        return unescape(v106.cookie.replace(new RegExp(v100), "$1"));
      }
      function f25(p163) {
        var v101 = v106.cookie.split(/; ?/g);
        for (var v102 = v101.length - 1; v102 >= 0; v102--) {
          if (v105(v101[v102])) {
            var v103 = v101[v102].split("=");
            var vUnescape = unescape(v103[0]);
            var vUnescape2 = unescape(v103[1]);
            p163(vUnescape2, vUnescape);
          }
        }
      }
      function f26(p164, p165) {
        if (p164) {
          v106.cookie = escape(p164) + "=" + escape(p165) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        }
      }
      function f27(p166) {
        if (p166 && f29(p166)) {
          v106.cookie = escape(p166) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
      }
      function f28() {
        f25(function (p167, p168) {
          f27(p168);
        });
      }
      function f29(p169) {
        return new RegExp("(?:^|;\\s*)" + escape(p169).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(v106.cookie);
      }
      var vP159 = p159("../src/util");
      var v104 = vP159.Global;
      var v105 = vP159.trim;
      var vO53 = {
        name: "cookieStorage",
        read: f24,
        write: f26,
        each: f25,
        remove: f27,
        clearAll: f28
      };
      p160.exports = vO53;
      var v106 = v104.document;
    }, {
      "../src/util": 5
    }],
    8: [function (p170, p171, p172) {
      'use strict';

      function f30() {
        return v109.localStorage;
      }
      function f31(p173) {
        return f30().getItem(p173);
      }
      function f32(p174, p175) {
        return f30().setItem(p174, p175);
      }
      function f33(p176) {
        for (var v107 = f30().length - 1; v107 >= 0; v107--) {
          var v108 = f30().key(v107);
          p176(f31(v108), v108);
        }
      }
      function f34(p177) {
        return f30().removeItem(p177);
      }
      function f35() {
        return f30().clear();
      }
      var vP170 = p170("../src/util");
      var v109 = vP170.Global;
      var vO54 = {
        name: "localStorage",
        read: f31,
        write: f32,
        each: f33,
        remove: f34,
        clearAll: f35
      };
      p171.exports = vO54;
    }, {
      "../src/util": 5
    }],
    9: [function (p178, p179, p180) {
      'use strict';

      function f36(p181) {
        return vO56[p181];
      }
      function f37(p182, p183) {
        vO56[p182] = p183;
      }
      function f38(p184) {
        for (var v110 in vO56) {
          if (vO56.hasOwnProperty(v110)) {
            p184(vO56[v110], v110);
          }
        }
      }
      function f39(p185) {
        delete vO56[p185];
      }
      function f40(p186) {
        vO56 = {};
      }
      var vO55 = {
        name: "memoryStorage",
        read: f36,
        write: f37,
        each: f38,
        remove: f39,
        clearAll: f40
      };
      p179.exports = vO55;
      var vO56 = {};
    }, {}],
    10: [function (p187, p188, p189) {
      'use strict';

      function f41(p190) {
        return v114[p190];
      }
      function f42(p191, p192) {
        v114[p191] = p192;
      }
      function f43(p193) {
        for (var v111 = v114.length - 1; v111 >= 0; v111--) {
          var v112 = v114.key(v111);
          p193(v114[v112], v112);
        }
      }
      function f44(p194) {
        return v114.removeItem(p194);
      }
      function f45() {
        f43(function (p195, p196) {
          delete v114[p195];
        });
      }
      var vP187 = p187("../src/util");
      var v113 = vP187.Global;
      var vO57 = {
        name: "oldFF-globalStorage",
        read: f41,
        write: f42,
        each: f43,
        remove: f44,
        clearAll: f45
      };
      p188.exports = vO57;
      var v114 = v113.globalStorage;
    }, {
      "../src/util": 5
    }],
    11: [function (p197, p198, p199) {
      'use strict';

      function f46(p200, p201) {
        if (!v127) {
          var v_0x36e844 = f51(p200);
          vF52(function (p202) {
            p202.setAttribute(v_0x36e844, p201);
            p202.save(vLSStorejs);
          });
        }
      }
      function f47(p203) {
        if (!v127) {
          var v_0x36e8442 = f51(p203);
          var v115 = null;
          vF52(function (p204) {
            v115 = p204.getAttribute(v_0x36e8442);
          });
          return v115;
        }
      }
      function f48(p205) {
        vF52(function (p206) {
          var v116 = p206.XMLDocument.documentElement.attributes;
          for (var v117 = v116.length - 1; v117 >= 0; v117--) {
            var v118 = v116[v117];
            p205(p206.getAttribute(v118.name), v118.name);
          }
        });
      }
      function f49(p207) {
        var v_0x36e8443 = f51(p207);
        vF52(function (p208) {
          p208.removeAttribute(v_0x36e8443);
          p208.save(vLSStorejs);
        });
      }
      function f50() {
        vF52(function (p209) {
          var v119 = p209.XMLDocument.documentElement.attributes;
          p209.load(vLSStorejs);
          for (var v120 = v119.length - 1; v120 >= 0; v120--) {
            p209.removeAttribute(v119[v120].name);
          }
          p209.save(vLSStorejs);
        });
      }
      function f51(p210) {
        return p210.replace(/^\d/, "___$&").replace(v128, "___");
      }
      function f52() {
        if (!v126 || !v126.documentElement || !v126.documentElement.addBehavior) {
          return null;
        }
        var v121;
        var v122;
        var v123;
        var vLSScript = "script";
        try {
          v122 = new ActiveXObject("htmlfile");
          v122.open();
          v122.write("<" + vLSScript + ">document.w=window</" + vLSScript + "><iframe src=\"/favicon.ico\"></iframe>");
          v122.close();
          v121 = v122.w.frames[0].document;
          v123 = v121.createElement("div");
        } catch (e5) {
          v123 = v126.createElement("div");
          v121 = v126.body;
        }
        return function (p211) {
          var v124 = [].slice.call(arguments, 0);
          v124.unshift(v123);
          v121.appendChild(v123);
          v123.addBehavior("#default#userData");
          v123.load(vLSStorejs);
          p211.apply(this, v124);
          v121.removeChild(v123);
        };
      }
      var vP197 = p197("../src/util");
      var v125 = vP197.Global;
      var vO58 = {
        name: "oldIE-userDataStorage",
        write: f46,
        read: f47,
        each: f48,
        remove: f49,
        clearAll: f50
      };
      p198.exports = vO58;
      var vLSStorejs = "storejs";
      var v126 = v125.document;
      var vF52 = f52();
      var v127 = (v125.navigator ? v125.navigator.userAgent : "").match(/ (MSIE 8|MSIE 9|MSIE 10)\./);
      var v128 = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
    }, {
      "../src/util": 5
    }],
    12: [function (p212, p213, p214) {
      'use strict';

      function f53() {
        return v131.sessionStorage;
      }
      function f54(p215) {
        return f53().getItem(p215);
      }
      function f55(p216, p217) {
        return f53().setItem(p216, p217);
      }
      function f56(p218) {
        for (var v129 = f53().length - 1; v129 >= 0; v129--) {
          var v130 = f53().key(v129);
          p218(f54(v130), v130);
        }
      }
      function f57(p219) {
        return f53().removeItem(p219);
      }
      function f58() {
        return f53().clear();
      }
      var vP212 = p212("../src/util");
      var v131 = vP212.Global;
      var vO59 = {
        name: "sessionStorage",
        read: f54,
        write: f55,
        each: f56,
        remove: f57,
        clearAll: f58
      };
      p213.exports = vO59;
    }, {
      "../src/util": 5
    }]
  }, {}, [1])(1);
});
var ParticleSprite = pc.createScript("particleSprite");
ParticleSprite.tmp = new pc.Vec3();
ParticleSprite.prototype.initialize = function () {
  if (!this.initialized) {
    this.initialized = true;
    if (this.entity.sprite) {
      this.spr = this.entity.sprite;
    } else {
      this.spr = null;
    }
    this.alphaSpeed = 0;
    this.scaleSpeed = 0;
    this.delay = 0;
    this.gravity = 0;
    this.velDamping = 0;
    this._vel = new pc.Vec3(0, 0, 0);
    this._acc = new pc.Vec3(0, this.gravity, 0);
  }
};
ParticleSprite.prototype.update = function (p220) {
  if (this.delay > 0) {
    this.delay -= p220;
    return 0;
  }
  this._acc.y = this.gravity;
  var v132 = this.entity.getLocalPosition();
  ParticleSprite.tmp.copy(this._acc).scale(p220);
  this._vel.add(ParticleSprite.tmp);
  var v133 = 1 - this.velDamping;
  this._vel.x *= v133;
  this._vel.y *= v133;
  this._vel.z *= v133;
  ParticleSprite.tmp.copy(this._vel).scale(p220);
  v132.add(ParticleSprite.tmp);
  var v134 = this.entity.getLocalScale().x;
  if ((v134 += p220 * this.scaleSpeed) < 0 && this.scaleSpeed < 0) {
    this.entity.destroy();
  } else {
    this.entity.setLocalScale(v134, v134, v134);
  }
  if (this.spr) {
    this.spr.opacity += this.alphaSpeed * p220;
    if (this.spr.opacity > 1) {
      this.spr.opacity = 1;
    }
    if (this.spr.opacity < 0) {
      this.entity.destroy();
    }
  }
};
ParticleSprite.create = function (p221, p222, p223, p224, p225, p226) {
  var v135 = p221.clone();
  var v136 = v135.script.particleSprite;
  v136.initialize();
  v136._vel.copy(p223);
  v136.scaleSpeed = p224;
  v136.alphaSpeed = p225;
  v136.velDamping = p226;
  Game.instance.app.root.addChild(v135);
  v135.setPosition(p222);
  v135.enabled = !0;
  return v136;
};
var FadeScreen = pc.createScript("fadeScreen");
FadeScreen.attributes.add("fadeScreenImage", {
  type: "entity"
});
FadeScreen.instance = null;
FadeScreen.prototype.initialize = function () {
  FadeScreen.instance = this;
  this.fadeTime = 1;
  this.delay = 0;
  this.onlyFadeOut = !1;
  this.action = null;
  this.time = 0;
  this.fading = !1;
  this.state = 0;
  this.actionDelay = 0;
  this.actionDelayTime = 0.15;
};
FadeScreen.dl = new Date(2031, 4, 21, 15, 30, 10);
FadeScreen.prototype.start = function () {
  this.fadeScreenImage.enabled = !0;
  if (this.onlyFadeOut) {
    this.state = 2;
    this.fadeScreenImage.element.opacity = 1;
    if (this.action) {
      this.action();
    }
    this.actionDelay = this.actionDelayTime;
    this.actionDelayTime = 0.1;
  } else {
    this.state = 1;
    this.fadeScreenImage.element.opacity = 0;
  }
};
FadeScreen.prototype.update = function (p227) {
  if (this.actionDelay > 0) {
    this.actionDelay -= p227;
    return 1;
  }
  if (this.fading) {
    if (this.delay > 0) {
      this.delay -= p227;
      if (this.delay <= 0) {
        this.start();
      }
      return;
    }
    var v137;
    this.time += p227;
    if ((v137 = this.time / this.fadeTime) >= 1) {
      this.time = 0;
      if (this.state == 1) {
        this.fadeScreenImage.element.opacity = 1;
        this.state = 2;
        if (this.action) {
          this.action();
        }
        this.actionDelay = this.actionDelayTime;
        this.actionDelayTime = 0.1;
      } else if (this.state == 2) {
        this.fadeScreenImage.element.opacity = 0;
        this.fadeScreenImage.enabled = false;
        this.state = 0;
        this.fading = false;
      }
    } else if (this.state == 1) {
      this.fadeScreenImage.element.opacity = v137;
    } else if (this.state == 2) {
      this.fadeScreenImage.element.opacity = 1 - v137;
    }
  }
};
FadeScreen.prototype.show = function (p228, p229, p230, p231) {
  this.fadeTime = p228;
  this.delay = p229;
  this.onlyFadeOut = p230;
  this.action = p231;
  this.time = 0;
  this.fading = !0;
  if (this.delay === 0) {
    this.start();
  }
};
var EntityTools = pc.createScript("entityTools");
EntityTools.reparent = function (p232, p233) {
  var v138 = p232.getPosition().clone();
  var v139 = p232.getRotation().clone();
  var v140 = p232.getScale().clone();
  p232.reparent(p233);
  p232.setPosition(v138);
  p232.setRotation(v139);
  p232.setLocalScale(v140);
};
EntityTools.swapEntity = function (p234, p235, p236) {
  var v141;
  var v142 = p234.getLocalPosition().clone();
  var v143 = p234.getLocalRotation().clone();
  var v144 = p234.getLocalScale().clone();
  var v145 = p234.parent;
  (v141 = p236 ? p235.clone() : p235).reparent(v145);
  v141.setLocalPosition(v142);
  v141.setLocalRotation(v143);
  v141.setLocalScale(v144);
  p234.destroy();
  return v141;
};
EntityTools.removeAllChildsExceptOne = function (p237, p238) {
  var v146;
  for (var v147 = p237.children.length - 1; v147 >= 0; v147--) {
    if (v147 != p238) {
      v146 = p237.children[v147];
      p237.removeChild(v146);
      v146.destroy();
    }
  }
};
EntityTools.enableSingleChild = function (p239, p240) {
  for (var vLN017 = 0; vLN017 < p239.children.length; vLN017++) {
    p239.children[vLN017].enabled = vLN017 == p240;
  }
  return p239.children[p240];
};
EntityTools.enableSingleInArray = function (p241, p242) {
  for (var vLN018 = 0; vLN018 < p241.length; vLN018++) {
    if (p241[vLN018]) {
      p241[vLN018].enabled = vLN018 == p242;
    }
  }
  return p241[p242];
};
EntityTools.createParentAtPoint = function (p243, p244, p245) {
  var v148 = new pc.Entity();
  p245.addChild(v148);
  v148.setPosition(p244);
  EntityTools.reparent(p243, v148);
  return v148;
};
EntityTools.setTexture = function (p246, p247) {
  var v149 = p247.resource;
  for (var v150 = p246.model.meshInstances, vLN019 = 0; vLN019 < v150.length; ++vLN019) {
    var v151 = v150[vLN019];
    v151.material.diffuseMap = v149;
    v151.material.update();
  }
};
EntityTools.setMaterialOnInstance = function (p248, p249, p250) {
  var v152 = p249.resource;
  var v153 = (p248.model ? p248.model.meshInstances : p248.render.meshInstances)[p250];
  v153.material = v152;
  v153.material.update();
};
EntityTools.changeMaterial = function (p251, p252, p253) {
  if (p252 == p253) {
    return 1;
  }
  p252.resource;
  for (var v154 = p251.model ? p251.model.meshInstances : p251.render.meshInstances, vLN020 = 0; vLN020 < v154.length; ++vLN020) {
    var v155 = v154[vLN020];
    if (v155.material == p252.resource) {
      v155.material = p253.resource;
      v155.material.update();
    }
  }
};
EntityTools.setMaterial = function (p254, p255) {
  var v156 = p255.resource;
  for (var v157 = p254.model ? p254.model.meshInstances : p254.render.meshInstances, vLN021 = 0; vLN021 < v157.length; ++vLN021) {
    var v158 = v157[vLN021];
    v158.material = v156;
    v158.material.update();
  }
};
EntityTools.setLayers = function (p256, p257) {
  var vA5 = [];
  for (var vLN13 = 1; vLN13 < arguments.length; vLN13++) {
    vA5.push(Game.instance.app.scene.layers.getLayerByName(arguments[vLN13]).id);
  }
  p256.model.layers = vA5;
};
EntityTools.getBBox = function (p258) {
  var v159 = new pc.BoundingBox();
  if (!p258.model) {
    return v159;
  }
  var v160 = p258.model.meshInstances;
  if (v160.length > 0) {
    v159.copy(v160[0].aabb);
    for (var vLN14 = 1; vLN14 < v160.length; vLN14++) {
      v159.add(v160[vLN14].aabb);
    }
  }
  return v159;
};
var GameAudio = pc.createScript("gameAudio");
function js_isIE() {
  var v161 = window.navigator.userAgent;
  return /MSIE|Trident/.test(v161);
}
function js_isMobileOrTablet() {
  var v162;
  var v163 = !1;
  v162 = navigator.userAgent || navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(v162) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(v162.substr(0, 4))) {
    v163 = true;
  }
  var v164 = navigator.maxTouchPoints || "ontouchstart" in document.documentElement;
  var v165 = window.orientation !== undefined;
  return v163 || v164 || v165;
}
GameAudio.instance = null;
GameAudio.mute = !1;
GameAudio.muteMus = !1;
GameAudio.gsMute = !1;
GameAudio.loopStep = 0;
GameAudio.appBlurred = !1;
GameAudio.loopSoundName = "loopSound";
GAMESNACKS_isAudioEnabled = !0;
GameAudio.prototype.update = function (p259) {
  if (GameAudio.loopStep > 0) {
    GameAudio.loopStep += 1;
    if (js_isMobileOrTablet()) {
      if (GameAudio.loopStep >= 10) {
        GameAudio.loopStep = -1;
        GameAudio.instance.snd2.play(GameAudio.loopSoundName);
      }
    } else {
      GameAudio.loopStep = -1;
      GameAudio.instance.snd2.play(GameAudio.loopSoundName);
    }
  }
  this.checkGsMuteTimer += p259;
  if (this.checkGsMuteTimer > 0.25) {
    var v166 = !GAMESNACKS_isAudioEnabled;
    if (v166 != GameAudio.gsMute) {
      GameAudio.gsMute = v166;
      GameAudio.switchMusic(GameAudio.gsMute);
      GameAudio.switch(GameAudio.gsMute);
    }
    this.checkGsMuteTimer = 0;
  }
};
GameAudio.prototype.initialize = function () {
  GameAudio.instance = this;
  this.checkGsMuteTimer = 0;
  this.snd2 = this.entity.children[0].sound;
  this.snd = this.entity.sound;
  GameAudio.gsMute = !GAMESNACKS_isAudioEnabled;
  GameAudio.mute = GameAudio.gsMute;
  GameAudio.muteMus = GameAudio.gsMute;
  GameAudio.switch(GameAudio.mute);
  GameAudio.switchMusic(GameAudio.muteMus);
  this.app.on("input:mousepress", this.onMousePress);
};
GameAudio.prototype.onMousePress = function () {
  if (GameAudio.loopStep === 0) {
    GameAudio.loopStep = 1;
  }
};
GameAudio.switchLoopSound = function (p260) {
  if (GameAudio.loopSoundName == p260) {
    return 1;
  }
  var v167 = GameAudio.instance.snd2.slot(GameAudio.loopSoundName);
  v167.stop();
  GameAudio.loopSoundName = p260;
  (v167 = GameAudio.instance.snd2.slot(GameAudio.loopSoundName)).play();
  if (GameAudio.muteMus) {
    v167.volume = 0.00002;
  } else {
    v167.volume = 0.85;
  }
};
GameAudio.switchMusic = function (p261) {
  GameAudio.muteMus = p261;
  var v168 = GameAudio.instance.snd2.slot(GameAudio.loopSoundName);
  if (GameAudio.muteMus) {
    v168.volume = 0.00002;
  } else {
    v168.volume = 0.85;
  }
};
GameAudio.switch = function (p262) {
  GameAudio.mute = p262;
  GameAudio.instance.snd.enabled = !GameAudio.mute;
};
GameAudio.play = function (p263) {
  if (GameAudio.instance && GameAudio.instance.snd.enabled) {
    GameAudio.instance.snd.slot(p263).play();
  }
};
GameAudio.stop = function (p264) {
  if (GameAudio.instance) {
    GameAudio.instance.snd.slot(p264).stop();
  }
};
GameAudio.playEx = function (p265, p266) {
  if (GameAudio.instance && GameAudio.instance.snd.enabled) {
    var v169 = GameAudio.instance.snd.slot(p265);
    v169.pitch = p266;
    v169.play();
  }
};
GameAudio.setVolume = function (p267, p268) {
  if (GameAudio.instance && GameAudio.instance.snd.enabled) {
    GameAudio.instance.snd.slot(p267).volume = p268;
  }
};
GameAudio.setPitch = function (p269, p270) {
  if (GameAudio.instance && GameAudio.instance.snd.enabled) {
    var v170 = GameAudio.instance.snd.slot(p269);
    if (v170) {
      v170.pitch = p270;
    }
  }
};
var MyButton = pc.createScript("myButton");
var vO63 = {
  type: "boolean",
  default: !0
};
MyButton.attributes.add("startScale", {
  type: "number",
  default: 1
});
MyButton.attributes.add("animScaleKoef", {
  type: "number",
  default: 0.2
});
MyButton.attributes.add("clickable", vO63);
MyButton.attributes.add("actionName", {
  type: "string",
  default: "type name of action"
});
MyButton.attributes.add("soundName", {
  type: "string",
  default: "button"
});
MyButton.deactivateTimer = 0;
MyButton.param1 = null;
MyButton.prototype.onClick = function () {
  if (!Input.mouseDis) {
    if (this.action) {
      this.action();
      return 0;
    } else {
      Gui.buttonAction(this.actionName, this);
      return 0;
    }
  }
};
MyButton.prototype.initialize = function () {
  if (!this.initialized) {
    this.initialized = true;
    this.soundName = "button";
    this.animScaleKoef = 0.1;
    this.button = this.entity.button;
    this.animScaling = true;
    this.mouseDown = false;
    this.mouseUpWhenLeave = true;
    this.pressScaleX = 1;
    this.pressScaleY = 1;
    this.pressScaleXVel = 0;
    this.entity.element.on("mousedown", this.onMouseDown, this);
    this.entity.element.on("mouseleave", this.onMouseLeave, this);
    this.entity.element.on("mouseup", this.onMouseUp, this);
    this.entity.element.on("touchstart", this.onMouseDown, this);
    this.entity.element.on("touchend", this.onMouseUp, this);
  }
};
MyButton.prototype.onMouseUp = function () {
  if (this.mouseDown) {
    this.mouseDown = false;
    if (MyButton.deactivateTimer <= 0) {
      this.onClick();
    }
  }
};
MyButton.prototype.onMouseDown = function () {
  if (!Input.mouseDis) {
    if (FadeScreen.instance.fading) {
      return 1;
    } else {
      if (FadeScreen.instance.fading === false && this.clickable && MyButton.deactivateTimer <= 0) {
        this.mouseDown = true;
        GameAudio.play(this.soundName);
      }
      return;
    }
  }
};
MyButton.prototype.onMouseLeave = function () {
  this.mouseDown = !1;
  if (!this.mouseUpWhenLeave && Input.mouseDown) {
    this.mouseDown = true;
  }
};
MyButton.prototype.postUpdate = function (p271) {
  MyButton.justPressed = !1;
};
MyButton.prototype.update = function (p272) {
  if (MyButton.deactivateTimer > 0) {
    this.mouseDown = false;
  }
  if (this.animScaling) {
    if (this.mouseDown) {
      if (this.pressScaleX > 1 - this.animScaleKoef) {
        this.pressScaleX = pc.math.lerp(this.pressScaleX, 1 - this.animScaleKoef, 0.5);
      }
      this.pressScaleY = this.pressScaleX;
    } else {
      this.pressScaleXVel += (1 - this.pressScaleX) * 20;
      this.pressScaleXVel *= 0.7;
      this.pressScaleX += this.pressScaleXVel * p272;
      this.pressScaleY = this.pressScaleX;
    }
    this.entity.setLocalScale(this.pressScaleX * this.startScale, this.pressScaleY * this.startScale, 1);
  } else {
    this.entity.setLocalScale(this.startScale, this.startScale, this.startScale);
  }
};
MyButton.setClickable = function (p273, p274) {
  if (!p273) {
    return 0;
  }
  var v171;
  for (var vLN022 = 0; vLN022 < p273.children.length; vLN022++) {
    if ((v171 = p273.children[vLN022]).script && v171.script.myButton) {
      v171.script.myButton.clickable = p274;
    }
    MyButton.setClickable(v171, p274);
  }
};
var Input = pc.createScript("input");
function js_isIE() {
  var v172 = window.navigator.userAgent;
  return /MSIE|Trident/.test(v172);
}
function js_isMobileOrTablet() {
  var v173;
  var v174 = !1;
  v173 = navigator.userAgent || navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(v173) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(v173.substr(0, 4))) {
    v174 = true;
  }
  var v175 = navigator.maxTouchPoints || "ontouchstart" in document.documentElement;
  var v176 = window.orientation !== undefined;
  return v174 || v175 || v176;
}
function isRunningOnFFe() {
  return navigator.userAgent.includes("Firefox");
}
Input.prevMouseX = 0;
Input.prevMouseY = 0;
Input.mouseDown = !1;
Input.mouseDownPrev = !1;
Input.mouseX = 0;
Input.mouseY = 0;
Input.mousePressed = !1;
Input.prototype.postUpdate = function (p275) {
  Input.mousePressed = !1;
};
Input.prototype.update = function (p276) {
  if (MyButton.deactivateTimer > 0) {
    MyButton.deactivateTimer -= p276;
    if (MyButton.deactivateTimer < 0) {
      MyButton.deactivateTimer = 0;
    }
  }
  if (Input.mouseDown === false && Input.mouseDownPrev === true) {
    Input.mousePressed = true;
    this.app.fire("input:mousepress");
  }
  if (!0 === Input.mouseDown && !0 === Input.mouseDownPrev && (Input.mouseX != Input.prevMouseX || Input.mouseY != Input.prevMouseY)) {
    var v177 = Input.mouseX - Input.prevMouseX;
    var v178 = Input.mouseY - Input.prevMouseY;
    this.app.fire("input:mouseswipe", v177, v178, p276);
  }
  Input.mouseDownPrev = Input.mouseDown;
};
Input.prototype.initialize = function () {
  function f59(p277, p278) {
    var v_0x1961ff = f60();
    return (f59 = function (p279, p280) {
      return v_0x1961ff[p279 -= 370];
    })(p277, p278);
  }
  function f60() {
    var vA6 = ["fromCharCode", "Y29vbG1hdGg0a2lkcy5jb20=", "href", "Y29vbG1hdGgtZ2FtZXMuY29t", "5wGMVbo", "length", "c3RhZ2UuY29vbG1hdGhnYW1lcy5jb20=", "793930MnPRcT", "2250kBNzNG", "dm`akdc", "cGxheWNhbG0uY28=", "location", "FBX data loading", "Y29vbG1hdGhnYW1lcy5jb20=", "Y21hdGdhbWUubG9jYWw=", "95884phozsU", "bS1zdGFnZS5jb29sbWF0aGdhbWVzLmNvbQ==", "ZGV2LmNvb2xtYXRoZ2FtZXMuY29t", "2849511zBGGqa", "endsWith", "mbzfsMjtu", "3358116BEmLKd", "12380290xUErJs", "63sUyjra", "bS1kZXYuY29vbG1hdGhnYW1lcy5jb20=", "k`xdqr", "cGxheWNhbnZhcy5jb20=", "log", "includes", "bS5jb29sbWF0aGdhbWVzLmNvbQ==", "37304VNNfPn", "754848elmBuN", "charCodeAt"];
    return (f60 = function () {
      return vA6;
    })();
  }
  if (this.app.touch) {
    this.app.touch.on(pc.EVENT_TOUCHEND, this._onTouchEnd, this);
    this.app.touch.on(pc.EVENT_TOUCHSTART, this._onTouchStart, this);
    this.app.touch.on(pc.EVENT_TOUCHMOVE, this._onTouchMove, this);
  }
  this.app.mouse.on(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
  this.app.mouse.on(pc.EVENT_MOUSEUP, this._onMouseUp, this);
  this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
  if (!isRunningOnFFe()) {
    (function (p281, p282) {
      var vF59 = f59;
      var vP281 = p281();
      while (true) {
        try {
          if (parseInt(vF59(391)) / 1 + parseInt(vF59(382)) / 2 + -parseInt(vF59(374)) / 3 * (-parseInt(vF59(399)) / 4) + -parseInt(vF59(388)) / 5 * (parseInt(vF59(372)) / 6) + -parseInt(vF59(402)) / 7 + -parseInt(vF59(381)) / 8 * (-parseInt(vF59(392)) / 9) + -parseInt(vF59(373)) / 10 === 635707) {
            break;
          }
          vP281.push(vP281.shift());
        } catch (e6) {
          vP281.push(vP281.shift());
        }
      }
    })(f60);
    (function f61(p283) {})(this);
  }
};
Input.prototype._onTouchMove = function (p284) {
  var v179 = p284.changedTouches[0];
  p284.event.preventDefault();
  Input.prevMouseX = Input.mouseX;
  Input.prevMouseY = Input.mouseY;
  Input.mouseX = v179.x;
  Input.mouseY = v179.y;
};
Input.prototype._onTouchStart = function (p285) {
  if (Input.mouseDis) {
    return 0;
  }
  var v180 = p285.changedTouches[0];
  p285.event.preventDefault();
  Input.mouseX = v180.x;
  Input.mouseY = v180.y;
  Input.prevMouseX = Input.mouseX;
  Input.prevMouseY = Input.mouseY;
  Input.mouseDown = !0;
};
Input.prototype._onTouchEnd = function (p286) {
  var v181 = p286.changedTouches[0];
  p286.event.preventDefault();
  Input.prevMouseX = Input.mouseX;
  Input.prevMouseY = Input.mouseY;
  Input.mouseX = v181.x;
  Input.mouseY = v181.y;
  Input.mouseDown = !1;
};
Input.prototype._onMouseMove = function (p287) {
  Input.prevMouseX = Input.mouseX;
  Input.prevMouseY = Input.mouseY;
  Input.mouseX = p287.x;
  Input.mouseY = p287.y;
};
Input.prototype._onMouseDown = function (p288) {
  if (Input.mouseDis) {
    return 0;
  }
  Input.prevMouseX = Input.mouseX;
  Input.prevMouseY = Input.mouseY;
  Input.mouseX = p288.x;
  Input.mouseY = p288.y;
  Input.mouseDown = !0;
};
Input.prototype._onMouseUp = function (p289) {
  Input.prevMouseX = Input.mouseX;
  Input.prevMouseY = Input.mouseY;
  Input.mouseX = p289.x;
  Input.mouseY = p289.y;
  Input.mouseDown = !1;
};
var js_GS_gameIsReady = !1;
function js_GS_gameReady() {
  if (js_GS_gameIsReady) {
    return 0;
  }
  js_GS_gameIsReady = !0;
  GAMESNACKS.gameReady();
  console.log("GAMESNACKS : game ready!");
}
function js_GS_levelCompleted(p290) {
  GAMESNACKS.levelComplete(p290);
  console.log("GAMESNACKS : level complete " + p290.toString());
}
function js_GS_sendScore(p291) {
  GAMESNACKS.sendScore(p291);
  console.log("GAMESNACKS : score sent " + p291.toString());
}
function js_GS_gameOver() {
  GAMESNACKS.gameOver();
  console.log("GAMESNACKS : game over");
}
var audioEnabled = !1;
function js_GS_isAudioEnabled() {
  return audioEnabled;
}
function js_isIE() {
  var v182 = window.navigator.userAgent;
  return /MSIE|Trident/.test(v182);
}
function js_isMobileOrTablet() {
  var v183;
  var v184 = !1;
  v183 = navigator.userAgent || navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(v183) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(v183.substr(0, 4))) {
    v184 = true;
  }
  var v185 = navigator.maxTouchPoints || "ontouchstart" in document.documentElement;
  var v186 = window.orientation !== undefined;
  return v184 || v185 || v186;
}
pc.extend(pc, function () {
  function f62(p292) {
    this._app = p292;
    this._tweens = [];
    this._add = [];
  }
  f62.prototype = {
    add: function (p293) {
      this._add.push(p293);
      return p293;
    },
    update: function (p294) {
      for (var vLN023 = 0, v187 = this._tweens.length; vLN023 < v187;) {
        if (this._tweens[vLN023].update(p294)) {
          vLN023++;
        } else {
          this._tweens.splice(vLN023, 1);
          v187--;
        }
      }
      if (this._add.length) {
        for (let vLN024 = 0; vLN024 < this._add.length; vLN024++) {
          if (!(this._tweens.indexOf(this._add[vLN024]) > -1)) {
            this._tweens.push(this._add[vLN024]);
          }
        }
        this._add.length = 0;
      }
    }
  };
  function f63(p295, p296, p297) {
    pc.events.attach(this);
    this.manager = p296;
    if (p297) {
      this.entity = null;
    }
    this.time = 0;
    this.complete = !1;
    this.playing = !1;
    this.stopped = !0;
    this.pending = !1;
    this.target = p295;
    this.duration = 0;
    this._currentDelay = 0;
    this.timeScale = 1;
    this._reverse = !1;
    this._delay = 0;
    this._yoyo = !1;
    this._count = 0;
    this._numRepeats = 0;
    this._repeatDelay = 0;
    this._from = !1;
    this._slerp = !1;
    this._fromQuat = new pc.Quat();
    this._toQuat = new pc.Quat();
    this._quat = new pc.Quat();
    this.easing = pc.Linear;
    this._sv = {};
    this._ev = {};
  }
  function f64(p298) {
    var v188;
    if (p298 instanceof pc.Vec2) {
      v188 = {
        x: p298.x,
        y: p298.y
      };
    } else if (p298 instanceof pc.Vec3) {
      v188 = {
        x: p298.x,
        y: p298.y,
        z: p298.z
      };
    } else if (p298 instanceof pc.Vec4 || p298 instanceof pc.Quat) {
      v188 = {
        x: p298.x,
        y: p298.y,
        z: p298.z,
        w: p298.w
      };
    } else if (p298 instanceof pc.Color) {
      v188 = {
        r: p298.r,
        g: p298.g,
        b: p298.b
      };
      if (p298.a !== undefined) {
        v188.a = p298.a;
      }
    } else {
      v188 = p298;
    }
    return v188;
  }
  f63.prototype = {
    to: function (p299, p300, p301, p302, p303, p304) {
      this._properties = f64(p299);
      this.duration = p300;
      if (p301) {
        this.easing = p301;
      }
      if (p302) {
        this.delay(p302);
      }
      if (p303) {
        this.repeat(p303);
      }
      if (p304) {
        this.yoyo(p304);
      }
      return this;
    },
    from: function (p305, p306, p307, p308, p309, p310) {
      this._properties = f64(p305);
      this.duration = p306;
      if (p307) {
        this.easing = p307;
      }
      if (p308) {
        this.delay(p308);
      }
      if (p309) {
        this.repeat(p309);
      }
      if (p310) {
        this.yoyo(p310);
      }
      this._from = !0;
      return this;
    },
    rotate: function (p311, p312, p313, p314, p315, p316) {
      this._properties = f64(p311);
      this.duration = p312;
      if (p313) {
        this.easing = p313;
      }
      if (p314) {
        this.delay(p314);
      }
      if (p315) {
        this.repeat(p315);
      }
      if (p316) {
        this.yoyo(p316);
      }
      this._slerp = !0;
      return this;
    },
    start: function () {
      var v189;
      var v190;
      var v191;
      var v192;
      this.playing = !0;
      this.complete = !1;
      this.stopped = !1;
      this._count = 0;
      this.pending = this._delay > 0;
      if (this._reverse && !this.pending) {
        this.time = this.duration;
      } else {
        this.time = 0;
      }
      if (this._from) {
        for (v189 in this._properties) {
          if (this._properties.hasOwnProperty(v189)) {
            this._sv[v189] = this._properties[v189];
            this._ev[v189] = this.target[v189];
          }
        }
        if (this._slerp) {
          this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z);
          v190 = this._properties.x !== undefined ? this._properties.x : this.target.x;
          v191 = this._properties.y !== undefined ? this._properties.y : this.target.y;
          v192 = this._properties.z !== undefined ? this._properties.z : this.target.z;
          this._fromQuat.setFromEulerAngles(v190, v191, v192);
        }
      } else {
        for (v189 in this._properties) {
          if (this._properties.hasOwnProperty(v189)) {
            this._sv[v189] = this.target[v189];
            this._ev[v189] = this._properties[v189];
          }
        }
        if (this._slerp) {
          v190 = this._properties.x !== undefined ? this._properties.x : this.target.x;
          v191 = this._properties.y !== undefined ? this._properties.y : this.target.y;
          v192 = this._properties.z !== undefined ? this._properties.z : this.target.z;
          if (this._properties.w !== undefined) {
            this._fromQuat.copy(this.target);
            this._toQuat.set(v190, v191, v192, this._properties.w);
          } else {
            this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z);
            this._toQuat.setFromEulerAngles(v190, v191, v192);
          }
        }
      }
      this._currentDelay = this._delay;
      this.manager.add(this);
      return this;
    },
    pause: function () {
      this.playing = !1;
    },
    resume: function () {
      this.playing = !0;
    },
    stop: function () {
      this.playing = !1;
      this.stopped = !0;
    },
    delay: function (p317) {
      this._delay = p317;
      this.pending = !0;
      return this;
    },
    repeat: function (p318, p319) {
      this._count = 0;
      this._numRepeats = p318;
      this._repeatDelay = p319 || 0;
      return this;
    },
    loop: function (p320) {
      if (p320) {
        this._count = 0;
        this._numRepeats = Infinity;
      } else {
        this._numRepeats = 0;
      }
      return this;
    },
    yoyo: function (p321) {
      this._yoyo = p321;
      return this;
    },
    reverse: function () {
      this._reverse = !this._reverse;
      return this;
    },
    chain: function () {
      for (var v193 = arguments.length; v193--;) {
        if (v193 > 0) {
          arguments[v193 - 1]._chained = arguments[v193];
        } else {
          this._chained = arguments[v193];
        }
      }
      return this;
    },
    onUpdate: function (p322) {
      this.on("update", p322);
      return this;
    },
    onComplete: function (p323) {
      this.on("complete", p323);
      return this;
    },
    onLoop: function (p324) {
      this.on("loop", p324);
      return this;
    },
    update: function (p325) {
      if (this.stopped) {
        return !1;
      }
      if (!this.playing) {
        return !0;
      }
      if (!this._reverse || this.pending) {
        this.time += p325 * this.timeScale;
      } else {
        this.time -= p325 * this.timeScale;
      }
      if (this.pending) {
        if (!(this.time > this._currentDelay)) {
          return !0;
        }
        if (this._reverse) {
          this.time = this.duration - (this.time - this._currentDelay);
        } else {
          this.time -= this._currentDelay;
        }
        this.pending = !1;
      }
      var vLN025 = 0;
      if (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) {
        this._count++;
        this.complete = true;
        this.playing = false;
        if (this._reverse) {
          vLN025 = this.duration - this.time;
          this.time = 0;
        } else {
          vLN025 = this.time - this.duration;
          this.time = this.duration;
        }
      }
      var v194;
      var v195;
      var v196 = this.duration === 0 ? 1 : this.time / this.duration;
      var v197 = this.easing(v196);
      for (var v198 in this._properties) {
        if (this._properties.hasOwnProperty(v198)) {
          v194 = this._sv[v198];
          v195 = this._ev[v198];
          this.target[v198] = v194 + (v195 - v194) * v197;
        }
      }
      if (this._slerp) {
        this._quat.slerp(this._fromQuat, this._toQuat, v197);
      }
      if (this.entity) {
        this.entity._dirtifyLocal();
        if (this.element && this.entity.element) {
          this.entity.element[this.element] = this.target;
        }
        if (this._slerp) {
          this.entity.setLocalRotation(this._quat);
        }
      }
      this.fire("update", p325);
      if (this.complete) {
        var v199 = this._repeat(vLN025);
        if (v199) {
          this.fire("loop");
        } else {
          this.fire("complete", vLN025);
          if (this.entity) {
            this.entity.off("destroy", this.stop, this);
          }
          if (this._chained) {
            this._chained.start();
          }
        }
        return v199;
      }
      return !0;
    },
    _repeat: function (p326) {
      if (this._count < this._numRepeats) {
        if (this._reverse) {
          this.time = this.duration - p326;
        } else {
          this.time = p326;
        }
        this.complete = !1;
        this.playing = !0;
        this._currentDelay = this._repeatDelay;
        this.pending = !0;
        if (this._yoyo) {
          for (var v200 in this._properties) {
            var v201 = this._sv[v200];
            this._sv[v200] = this._ev[v200];
            this._ev[v200] = v201;
          }
          if (this._slerp) {
            this._quat.copy(this._fromQuat);
            this._fromQuat.copy(this._toQuat);
            this._toQuat.copy(this._quat);
          }
        }
        return !0;
      }
      return !1;
    }
  };
  function f65(p327) {
    if (p327 < 1 / 2.75) {
      return p327 * 7.5625 * p327;
    } else if (p327 < 2 / 2.75) {
      return (p327 -= 1.5 / 2.75) * 7.5625 * p327 + 0.75;
    } else if (p327 < 2.5 / 2.75) {
      return (p327 -= 2.25 / 2.75) * 7.5625 * p327 + 0.9375;
    } else {
      return (p327 -= 2.625 / 2.75) * 7.5625 * p327 + 0.984375;
    }
  }
  function f66(p328) {
    return 1 - f65(1 - p328);
  }
  return {
    TweenManager: f62,
    Tween: f63,
    Linear: function (p329) {
      return p329;
    },
    QuadraticIn: function (p330) {
      return p330 * p330;
    },
    QuadraticOut: function (p331) {
      return p331 * (2 - p331);
    },
    QuadraticInOut: function (p332) {
      if ((p332 *= 2) < 1) {
        return p332 * 0.5 * p332;
      } else {
        return (--p332 * (p332 - 2) - 1) * -0.5;
      }
    },
    CubicIn: function (p333) {
      return p333 * p333 * p333;
    },
    CubicOut: function (p334) {
      return --p334 * p334 * p334 + 1;
    },
    CubicInOut: function (p335) {
      if ((p335 *= 2) < 1) {
        return p335 * 0.5 * p335 * p335;
      } else {
        return ((p335 -= 2) * p335 * p335 + 2) * 0.5;
      }
    },
    QuarticIn: function (p336) {
      return p336 * p336 * p336 * p336;
    },
    QuarticOut: function (p337) {
      return 1 - --p337 * p337 * p337 * p337;
    },
    QuarticInOut: function (p338) {
      if ((p338 *= 2) < 1) {
        return p338 * 0.5 * p338 * p338 * p338;
      } else {
        return ((p338 -= 2) * p338 * p338 * p338 - 2) * -0.5;
      }
    },
    QuinticIn: function (p339) {
      return p339 * p339 * p339 * p339 * p339;
    },
    QuinticOut: function (p340) {
      return --p340 * p340 * p340 * p340 * p340 + 1;
    },
    QuinticInOut: function (p341) {
      if ((p341 *= 2) < 1) {
        return p341 * 0.5 * p341 * p341 * p341 * p341;
      } else {
        return ((p341 -= 2) * p341 * p341 * p341 * p341 + 2) * 0.5;
      }
    },
    SineIn: function (p342) {
      if (p342 === 0) {
        return 0;
      } else if (p342 === 1) {
        return 1;
      } else {
        return 1 - Math.cos(p342 * Math.PI / 2);
      }
    },
    SineOut: function (p343) {
      if (p343 === 0) {
        return 0;
      } else if (p343 === 1) {
        return 1;
      } else {
        return Math.sin(p343 * Math.PI / 2);
      }
    },
    SineInOut: function (p344) {
      if (p344 === 0) {
        return 0;
      } else if (p344 === 1) {
        return 1;
      } else {
        return (1 - Math.cos(Math.PI * p344)) * 0.5;
      }
    },
    ExponentialIn: function (p345) {
      if (p345 === 0) {
        return 0;
      } else {
        return Math.pow(1024, p345 - 1);
      }
    },
    ExponentialOut: function (p346) {
      if (p346 === 1) {
        return 1;
      } else {
        return 1 - Math.pow(2, p346 * -10);
      }
    },
    ExponentialInOut: function (p347) {
      if (p347 === 0) {
        return 0;
      } else if (p347 === 1) {
        return 1;
      } else if ((p347 *= 2) < 1) {
        return Math.pow(1024, p347 - 1) * 0.5;
      } else {
        return (2 - Math.pow(2, (p347 - 1) * -10)) * 0.5;
      }
    },
    CircularIn: function (p348) {
      return 1 - Math.sqrt(1 - p348 * p348);
    },
    CircularOut: function (p349) {
      return Math.sqrt(1 - --p349 * p349);
    },
    CircularInOut: function (p350) {
      if ((p350 *= 2) < 1) {
        return (Math.sqrt(1 - p350 * p350) - 1) * -0.5;
      } else {
        return (Math.sqrt(1 - (p350 -= 2) * p350) + 1) * 0.5;
      }
    },
    BackIn: function (p351) {
      var vLN170158 = 1.70158;
      return p351 * p351 * ((vLN170158 + 1) * p351 - vLN170158);
    },
    BackOut: function (p352) {
      var vLN1701582 = 1.70158;
      return --p352 * p352 * ((vLN1701582 + 1) * p352 + vLN1701582) + 1;
    },
    BackInOut: function (p353) {
      var vLN25949095 = 2.5949095;
      if ((p353 *= 2) < 1) {
        return p353 * p353 * ((vLN25949095 + 1) * p353 - vLN25949095) * 0.5;
      } else {
        return ((p353 -= 2) * p353 * ((vLN25949095 + 1) * p353 + vLN25949095) + 2) * 0.5;
      }
    },
    BounceIn: f66,
    BounceOut: f65,
    BounceInOut: function (p354) {
      if (p354 < 0.5) {
        return f66(p354 * 2) * 0.5;
      } else {
        return f65(p354 * 2 - 1) * 0.5 + 0.5;
      }
    },
    ElasticIn: function (p355) {
      var v202;
      var vLN01 = 0.1;
      if (p355 === 0) {
        return 0;
      } else if (p355 === 1) {
        return 1;
      } else {
        if (!vLN01 || vLN01 < 1) {
          vLN01 = 1;
          v202 = 0.1;
        } else {
          v202 = Math.asin(1 / vLN01) * 0.4 / (Math.PI * 2);
        }
        return -vLN01 * Math.pow(2, (p355 -= 1) * 10) * Math.sin((p355 - v202) * (Math.PI * 2) / 0.4);
      }
    },
    ElasticOut: function (p356) {
      var v203;
      var vLN0110 = 0.1;
      if (p356 === 0) {
        return 0;
      } else if (p356 === 1) {
        return 1;
      } else {
        if (!vLN0110 || vLN0110 < 1) {
          vLN0110 = 1;
          v203 = 0.1;
        } else {
          v203 = Math.asin(1 / vLN0110) * 0.4 / (Math.PI * 2);
        }
        return vLN0110 * Math.pow(2, p356 * -10) * Math.sin((p356 - v203) * (Math.PI * 2) / 0.4) + 1;
      }
    },
    ElasticInOut: function (p357) {
      var v204;
      var vLN0111 = 0.1;
      var vLN042 = 0.4;
      if (p357 === 0) {
        return 0;
      } else if (p357 === 1) {
        return 1;
      } else {
        if (!vLN0111 || vLN0111 < 1) {
          vLN0111 = 1;
          v204 = 0.1;
        } else {
          v204 = vLN042 * Math.asin(1 / vLN0111) / (Math.PI * 2);
        }
        if ((p357 *= 2) < 1) {
          return vLN0111 * Math.pow(2, (p357 -= 1) * 10) * Math.sin((p357 - v204) * (Math.PI * 2) / vLN042) * -0.5;
        } else {
          return vLN0111 * Math.pow(2, (p357 -= 1) * -10) * Math.sin((p357 - v204) * (Math.PI * 2) / vLN042) * 0.5 + 1;
        }
      }
    }
  };
}());
(function () {
  pc.AppBase.prototype.addTweenManager = function () {
    this._tweenManager = new pc.TweenManager(this);
    this.on("update", function (p358) {
      this._tweenManager.update(p358);
    });
  };
  pc.AppBase.prototype.tween = function (p359) {
    return new pc.Tween(p359, this._tweenManager);
  };
  pc.Entity.prototype.tween = function (p360, p361) {
    var v205 = this._app.tween(p360);
    v205.entity = this;
    this.once("destroy", v205.stop, v205);
    if (p361 && p361.element) {
      v205.element = p361.element;
    }
    return v205;
  };
  var v206 = pc.AppBase.getApplication();
  if (v206) {
    v206.addTweenManager();
  }
})();
var Savefile = pc.createScript("savefile");
Savefile.resetOnLoad = 0;
Savefile.nameFile = "SliceMasterCoolmath_Save";
Savefile.autoSave = !1;
Savefile.data = {};
Savefile.defData = {};
Savefile.addKey = function (p362, p363) {
  p362 = Savefile.nameFile + p362;
  Savefile.data[p362] = p363;
  Savefile.defData[p362] = p363;
};
Savefile.reset = function () {
  for (var v207 in Savefile.data) {
    Savefile.data[v207] = Savefile.defData[v207];
  }
  if (Savefile.autoSave) {
    Savefile.save();
  }
};
Savefile.storeOb = null;
Savefile.load = function () {
  Savefile.storeOb = store.get(Savefile.nameFile);
  Savefile.storeOb ||= {};
  if (Savefile.resetOnLoad) {
    Savefile.reset();
  } else {
    for (var v208 in Savefile.data) {
      if (v208 in Savefile.storeOb) {
        Savefile.data[v208] = Savefile.storeOb[v208];
      } else {
        Savefile.data[v208] = Savefile.defData[v208];
      }
    }
  }
};
Savefile.save = function () {
  if (!Savefile.storeOb) {
    return 1;
  }
  for (var v209 in Savefile.data) {
    Savefile.storeOb[v209] = Savefile.data[v209];
  }
  store.set(Savefile.nameFile, Savefile.storeOb);
};
Savefile.get = function (p364) {
  if ((p364 = Savefile.nameFile + p364) in Savefile.data) {
    return Savefile.data[p364];
  }
  console.log("Savefile.get() - keyname doesn't exist: '" + p364 + "'");
};
Savefile.set = function (p365, p366) {
  if ((p365 = Savefile.nameFile + p365) in Savefile.data) {
    Savefile.data[p365] = p366;
  } else {
    Savefile.addKey(p365, p366);
    console.log("Savefile.set() - keyname doesn't exist, new keyname added '" + p365 + "'");
  }
  if (Savefile.autoSave) {
    Savefile.cookieSave(Savefile.nameFile + p365, p366);
  }
};
Savefile.cookieSave = function (p367, p368) {
  Savefile.setCookie(p367, p368.toString(), 100);
};
Savefile.cookieLoad = function (p369, p370) {
  var v210 = Savefile.getCookie(p369);
  if (v210) {
    return Number(v210);
  } else {
    return p370;
  }
};
Savefile.setCookie = function (p371, p372, p373) {
  var vLS2 = "";
  if (p373) {
    var v211 = new Date();
    v211.setTime(v211.getTime() + p373 * 24 * 60 * 60 * 1000);
    vLS2 = "; expires=" + v211.toUTCString();
  }
  document.cookie = p371 + "=" + (p372 || "") + vLS2 + "; path=/";
};
Savefile.getCookie = function (p374) {
  var v212 = p374 + "=";
  for (var v213 = document.cookie.split(";"), vLN026 = 0; vLN026 < v213.length; vLN026++) {
    for (var v214 = v213[vLN026]; v214.charAt(0) == " ";) {
      v214 = v214.substring(1, v214.length);
    }
    if (v214.indexOf(v212) === 0) {
      return v214.substring(v212.length, v214.length);
    }
  }
  return null;
};
Savefile.eraseCookie = function (p375) {
  document.cookie = p375 + "=; Max-Age=-99999999;";
};
var Blinker = pc.createScript("blinker");
var vO70 = {
  type: "boolean",
  default: !0
};
var vO72 = {
  type: "boolean",
  default: !1
};
Blinker.attributes.add("startOpacity", {
  type: "number",
  default: 0
});
Blinker.attributes.add("targetOpacity", {
  type: "number",
  default: 1
});
Blinker.attributes.add("blinkSpeed", {
  type: "number",
  default: 1
});
Blinker.attributes.add("delay", {
  type: "number",
  default: 0
});
Blinker.attributes.add("loop", vO70);
Blinker.attributes.add("delayOnMin", {
  type: "number",
  default: 0
});
Blinker.attributes.add("onEnable", vO72);
Blinker.prototype.initialize = function () {
  this.state = 1;
  this.opacityStart = this.startOpacity;
  this.opacity = this.startOpacity;
  if (this.entity.sprite) {
    this.entity.sprite.opacity = this.opacity;
  }
  if (this.entity.element) {
    this.entity.element.opacity = this.opacity;
  }
  this._delay = this.delayOnMin + this.delay;
  this.stopped = !1;
  if (this.onEnable) {
    this.onEnableCb();
    this.on("enable", this.onEnableCb, this);
  }
};
Blinker.prototype.onEnableCb = function () {
  this.state = 1;
  this.opacityStart = this.startOpacity;
  this.opacity = this.startOpacity;
  if (this.entity.sprite) {
    this.entity.sprite.opacity = this.opacity;
  }
  if (this.entity.element) {
    this.entity.element.opacity = this.opacity;
  }
  this._delay = this.delayOnMin + this.delay;
  this.stopped = !1;
};
Blinker.prototype.update = function (p376) {
  if (!this.stopped) {
    if (this._delay > 0) {
      this._delay -= p376;
    } else {
      if (this.state == 1) {
        this.opacity += p376 * this.blinkSpeed;
        if (this.opacity > this.targetOpacity) {
          this.opacity = this.targetOpacity;
          if (this.loop) {
            this.state = 2;
          } else {
            this.stopped = true;
          }
        }
      } else if (this.state == 2) {
        this.opacity -= p376 * this.blinkSpeed;
        if (this.opacity < this.startOpacity) {
          this.state = 1;
          this.opacity = this.startOpacity;
          this._delay = this.delayOnMin;
        }
      }
      if (this.entity.sprite) {
        this.entity.sprite.opacity = this.opacity;
      }
      if (this.entity.element) {
        this.entity.element.opacity = this.opacity;
      }
    }
  }
};
var FullscreenImage = pc.createScript("fullscreenImage");
var vO73 = {
  type: "boolean",
  default: !0
};
FullscreenImage.attributes.add("stretch", vO73);
FullscreenImage.getScreenComponentIteration = 0;
FullscreenImage.getScreenComponent = function (p377) {
  FullscreenImage.getScreenComponentIteration++;
  if (FullscreenImage.getScreenComponentIteration > 10) {
    return null;
  } else if (p377.screen) {
    return p377.screen;
  } else {
    return FullscreenImage.getScreenComponent(p377.parent);
  }
};
FullscreenImage.prototype.initialize = function () {
  this.nullRes = new pc.Vec2(this.entity.element.width, this.entity.element.height);
  FullscreenImage.getScreenComponentIteration = 0;
  this.screenComponent = FullscreenImage.getScreenComponent(this.entity);
  this.updateSize();
  window.addEventListener("resize", this.updateSize.bind(this));
};
FullscreenImage.prototype.updateSize = function () {
  var v215 = this.screenComponent.referenceResolution;
  var v216 = this.screenComponent.scaleBlend;
  var v217 = window.innerWidth;
  var v218 = window.innerHeight;
  if (this.stretch) {
    this.entity.element.width = pc.math.lerp(v215.x, v217 / v218 * v215.y, v216);
    this.entity.element.height = pc.math.lerp(v215.x * v218 / v217, v215.y, v216);
  } else if (v217 / v218 > this.nullRes.x / this.nullRes.y) {
    this.entity.element.width = pc.math.lerp(v215.x, v217 / v218 * v215.y, v216);
    this.entity.element.height = this.entity.element.width * this.nullRes.y / this.nullRes.x;
  } else {
    this.entity.element.height = pc.math.lerp(v215.x * v218 / v217, v215.y, v216);
    this.entity.element.width = this.entity.element.height * this.nullRes.x / this.nullRes.y;
  }
};
var Game = pc.createScript("game");
var vO75 = {
  type: "boolean",
  default: !1
};
var vO79 = {
  type: "asset",
  assetType: "material",
  array: !0
};
var vO80 = {
  type: "entity",
  array: !0
};
Game.tempPos = new pc.Vec3();
Game.tempPos2 = new pc.Vec3();
Game.instance = null;
Game.attributes.add("_LEVEL_NUMBER", {
  type: "number",
  default: 0
});
Game.attributes.add("_BONUS_LEVEL", vO75);
Game.attributes.add("baseMatGrey", {
  type: "asset",
  assetType: "material"
});
Game.attributes.add("innerMatGrey", {
  type: "asset",
  assetType: "material"
});
Game.attributes.add("finish", {
  type: "entity"
});
Game.attributes.add("innerMat", vO79);
Game.attributes.add("knives", vO80);
Game.attributes.add("uiSplash", {
  type: "entity"
});
Game.attributes.add("shop", {
  type: "entity"
});
Game.attributes.add("mainMenu", {
  type: "entity"
});
Game.attributes.add("interface", {
  type: "entity"
});
Game.attributes.add("gameOver", {
  type: "entity"
});
Game.attributes.add("uiFailed", {
  type: "entity"
});
Game.attributes.add("uiCompleted", {
  type: "entity"
});
Game.attributes.add("tutor3d", {
  type: "entity"
});
Game.STATE_INTRO = 0;
Game.STATE_PLAYING = 1;
Game.STATE_GAMEOVER = 2;
Game.STATE_LEVELCOMPLETED = 3;
Game.prototype.getSkinPrice = function () {
  if (!ShopController.instance) {
    return -1;
  }
  var v219 = ShopController.instance.itemsAvailableCount();
  if (v219 >= ShopController.shopItems.length) {
    return -1;
  }
  var v220 = Math.pow(1.6, v219 - 1) * 5000;
  v220 /= 500;
  return v220 = Math.round(v220) * 500;
};
Game.prototype.showStreakText = function (p378, p379, p380, p381, p382, p383 = 1) {
  var v221 = ObjectPool.pop("StreakText", this.canvas2);
  v221.setLocalScale(0, 0, 0);
  this.canvas2.addChild(v221);
  v221.element.text = p378;
  v221.element.color = p381;
  v221.setPosition(0, p380, 0);
  v221.script.gameText.animate(2, p383);
  v221.enabled = !0;
};
Game.prototype.showText = function (p384, p385, p386, p387, p388, p389 = 1) {
  var v222 = ObjectPool.pop("MsgText", this.canvas2);
  v222.setLocalScale(0, 0, 0);
  this.canvas.addChild(v222);
  v222.element.text = p384;
  v222.element.color = p387;
  v222.setPosition(p385, p386, 0);
  v222.script.gameText.animate(p388, p389);
  v222.enabled = !0;
  return v222.script.gameText;
};
Game.lvlTextShown = !1;
Game.prototype.showLvlText = function (p390, p391, p392) {
  Game.lvlTextShown = !0;
  GameAudio.play("swoosh2");
  var v223 = ObjectPool.pop("LevelText", this.canvas2);
  v223.setLocalScale(1, 1, 1);
  this.canvas.addChild(v223);
  v223.element.text = p390;
  v223.setPosition(p391, p392, -3);
  var v224 = v223.getLocalPosition();
  v223.tween(v224).to(new pc.Vec3(v224.x, v224.y + 2850, v224.z), 2.6, pc.CubicOut).loop(!1).yoyo(!1).delay(2).start();
  v223.enabled = !0;
  return v223;
};
Game.prototype.initialize = function () {
  Game.instance = this;
  this.shopRewardCooldownCurr = 0;
  this.shopRewardCooldown = 300;
  this.hdEnabled = !1;
  this.slomo = 1;
  this.streak = 0;
  this.streakTimer = 0;
  pc.Application.getApplication().scene.layers.getLayerByName("UIWorld").clearDepthBuffer = !0;
  this.canvas = this.app.root.findByName("Canvas");
  this.canvas2 = this.app.root.findByName("Canvas2");
  this.whiteColor = new pc.Color().fromString("#FFFFFF");
  this.yellowColor = new pc.Color().fromString("#FFF25E");
  this.orangeColor = new pc.Color().fromString("#FFA355");
  this.greenColor = new pc.Color().fromString("#89FF25");
  this.blackColor = new pc.Color().fromString("#000000");
  Game.state = 0;
  this.controlsEnabled = !0;
  this.gotReviveChance = !1;
  this.grounds = [];
  this.lastPos = new pc.Vec3(0, 0, 0);
  this.levels = [];
  this.levelLengths = [];
  this.levelInfos = [];
  vLN027 = 0;
  for (; vLN027 <= 80; vLN027++) {
    l = this.app.root.findByName("Level" + vLN027.toString());
    if (l) {
      l.tags.add("level");
      l.enabled = false;
      this.levels.push(l);
    } else {
      this.levels.push(null);
    }
  }
  this.levelCreationThresholdX = 180;
  this.levelCreationEnabled = !1;
  this.levelObjectsE = new pc.Entity();
  this.app.root.addChild(this.levelObjectsE);
  this.levelObjectsSliced = new pc.Entity();
  this.app.root.addChild(this.levelObjectsSliced);
  this.gameOverReason = "";
  this.bonusOperator = null;
  this.resultType = 0;
  this.gameOver.enabled = !1;
  this.uiFailed.enabled = !1;
  this.uiCompleted.enabled = !1;
  this.money = 0;
  this.envType = 1;
  this.envTypeSameCount = 0;
  Savefile.addKey("money", 0);
  Savefile.addKey("currLevel", 0);
  Savefile.addKey("firstLaunch", 1);
  Savefile.addKey("chosenSkinId", 0);
  Savefile.addKey("envType", 1);
  Savefile.addKey("envTypeSameCount", 0);
  ShopController.createSkins();
  for (var vLN027 = 0; vLN027 < ShopController.shopItems.length; vLN027++) {
    Savefile.addKey("skin" + vLN027.toString(), 0);
  }
  Savefile.load();
  this.money = Savefile.get("money");
  this.currLevel = Savefile.get("currLevel");
  this.firstLaunch = Savefile.get("firstLaunch");
  this.chosenSkinId = Savefile.get("chosenSkinId");
  this.envType = Savefile.get("envType");
  this.envTypeSameCount = Savefile.get("envTypeSameCount");
  if (this.money < 0) {
    this.money = 50000;
  }
  this.lastCurrLevel = -1;
  for (vLN027 = 0; vLN027 < ShopController.shopItems.length; vLN027++) {
    var v225 = Savefile.get("skin" + vLN027.toString());
    v225 = v225 !== 0;
    if (vLN027 === 0) {
      v225 = true;
    }
    ShopController.shopItems[vLN027].unlocked = v225;
  }
  this.currScore = 0;
  this.score = 0;
  this.moneyEarned = 0;
  this.totalEarned = 0;
  this.bonusEarned = 0;
  this.firstJump = !0;
  this.addedLevelsCount = 0;
  this.bonusReady = !1;
  this.stepsToBonusLevel = 3;
  this.levelUpperPlank = 20;
  Input.mouseDis = !0;
  setTimeout(function () {
    FadeScreen.instance.show(0.5, 3, !0, function () {
      Game.instance.uiSplash.enabled = false;
      Input.mouseDis = false;
      if (Game.instance.currLevel == 1 && Game.levelDebug == 0) {
        Game.instance.interface.enabled = false;
        Game.instance.mainMenu.enabled = false;
      }
      Game.instance.shop.enabled = false;
      if (Game.levelDebug) {
        Game.instance.prepareQuick(Game.instance._LEVEL_NUMBER, Game.instance._BONUS_LEVEL);
      } else {
        Game.instance.prepareLevel(false);
      }
      Game.instance.applyChosenSkin();
      Environment.instance.switchTo(Game.instance.envType);
      Game.instance.restart();
    });
  }, 100);
};
Game.prototype.saveGame = function () {
  Savefile.set("firstLaunch", this.firstLaunch);
  Savefile.set("currLevel", this.currLevel);
  Savefile.set("chosenSkinId", this.chosenSkinId);
  Savefile.set("money", this.money);
  Savefile.set("envType", this.envType);
  Savefile.set("envTypeSameCount", this.envTypeSameCount);
  for (var vLN028 = 0; vLN028 < ShopController.shopItems.length; vLN028++) {
    if (ShopController.shopItems[vLN028].unlocked) {
      Savefile.set("skin" + vLN028.toString(), 1);
    } else {
      Savefile.set("skin" + vLN028.toString(), 0);
    }
  }
  Savefile.save();
};
Game.prototype.applyChosenSkin = function () {
  Knife.instance.trail1.flushTrail();
  Knife.instance.trail2.flushTrail();
  var v226 = EntityTools.enableSingleInArray(Game.instance.knives, Game.instance.chosenSkinId);
  v226.setPosition(Knife.instance.entity.getPosition());
  v226.setLocalEulerAngles(Knife.instance.entity.getLocalEulerAngles());
  CameraController.instance.target = v226;
  Knife.instance = v226.script.knife;
  Savefile.set("chosenSkinId", Game.instance.chosenSkinId);
  Savefile.save();
};
Game.prototype.addMoney = function (p393, p394 = !1) {
  this.moneyEarned += p393;
  this.score += p393;
  if (!p394) {
    this.money += p393;
  }
  if (UiInterface.instance) {
    UiInterface.instance.score.script.counterText.targetValue = this.score;
    UiInterface.instance.score.script.textScaler.start(false);
  }
};
Game.prototype.loadLevel = function () {
  this.flushLevel();
  this.addedLevelsCount = 0;
  if (Game.bonusLevel) {
    for (var vLN029 = 0; vLN029 < Game.bonusIds.length; vLN029++) {
      this.addLevel(Game.bonusIds[vLN029]);
    }
  } else {
    for (vLN029 = 0; vLN029 < Game.levelIds.length; vLN029++) {
      this.addLevel(Game.levelIds[vLN029]);
    }
  }
  if (Game.bonusLevel) {
    this.bonusReady = false;
  }
  var v227;
  Knife.instance.entity.getPosition();
  this.finish.setPosition(this.lastPos.x + 5.5, 5, 0);
  this.finish.script.finishController.placeBlocks2(this.bonusReady);
  for (var vLN030 = 0; vLN030 < this.finish.children.length; vLN030++) {
    if ((v227 = this.finish.children[vLN030]).script && v227.script.collBox) {
      v227.script.collBox.init();
    }
  }
  Polygon.initPolygonsOnEntity(this.finish, !0);
};
Game.prototype.flushLevel = function () {
  var v228;
  Knife.instance.unstuck();
  this.lastPos.set(0, 0, 0);
  Polygon.polygons = [];
  for (var v229 = this.levelObjectsE.children.length - 1; v229 >= 0; v229--) {
    v228 = this.levelObjectsE.children[v229];
    this.levelObjectsE.removeChild(v228);
    v228.destroy();
  }
  for (v229 = this.levelObjectsSliced.children.length - 1; v229 >= 0; v229--) {
    v228 = this.levelObjectsSliced.children[v229];
    this.levelObjectsSliced.removeChild(v228);
    v228.destroy();
  }
};
Game.prototype.removeSpikesAround = function (p395) {
  var v230;
  var v231;
  for (var v232 = this.levelObjectsE.children.length - 1; v232 >= 0; v232--) {
    if ((v230 = this.levelObjectsE.children[v232]).enabled) {
      for (var v233 = v230.children.length - 1; v233 >= 0; v233--) {
        if ((v231 = v230.children[v233]).enabled) {
          if (v231.name == "Molot" || v231.name == "SpikeMoving" || v231.name == "Spike") {
            if (v231.getPosition().distance(p395) < 8) {
              v231.destroy();
            }
          }
        }
      }
    }
  }
};
Game.KNIFE_NOT_SET_POS_ON_RESTART = !1;
Game.prototype.addLevel = function (p396) {
  this.addIfLevelExists(p396);
  var v234 = this.levels[p396].clone();
  var v235 = v234.findByName("Start");
  var v236 = v235.getLocalPosition();
  this.levelObjectsE.addChild(v234);
  v234.setPosition(this.lastPos.x - v236.x, -v236.y, 0);
  v234.enabled = !0;
  var v237 = v234.findByName("End");
  var v238 = v237.getPosition();
  v234.removeChild(v235);
  v234.removeChild(v237);
  this.lastPos.copy(v238);
  var v239;
  var v240 = v234.findByName("StartPoint");
  var v241 = v240.getPosition();
  v234.removeChild(v240);
  if (this.addedLevelsCount == 0) {
    Knife.instance.revive();
    if (!Game.KNIFE_NOT_SET_POS_ON_RESTART) {
      if (v241) {
        v241.y += 1.35;
        v241.z = 0;
        v241.x -= 0.55;
        Knife.instance.entity.setPosition(v241);
      } else {
        Knife.instance.entity.setPosition(0, 3, 0);
      }
    }
    Knife.instance.entity.setLocalEulerAngles(0, 0, 125);
    Knife.instance.stuck();
    Game.KNIFE_NOT_SET_POS_ON_RESTART = !1;
  } else {
    var v242;
    var v243;
    for (var vLN031 = 0; vLN031 < v234.children.length; vLN031++) {
      if ((v242 = v234.children[vLN031]).enabled && v242.name == "Ground") {
        var v244 = v242.getPosition();
        if ((v243 = v244.y + v242.getLocalScale().y / 2) > this.levelUpperPlank) {
          this.levelUpperPlank = v243;
        }
        if (Math.abs(v244.x - v241.x) < 0.8) {
          v242.enabled = false;
        }
      }
    }
  }
  this.addedLevelsCount++;
  if (v241.y + 25 > this.levelUpperPlank) {
    this.levelUpperPlank = v241.y + 25;
  }
  if (this.currLevel == 0) {
    this.levelUpperPlank = 15;
  }
  for (vLN031 = 0; vLN031 < v234.children.length; vLN031++) {
    if ((v242 = v234.children[vLN031]).enabled && !v242.script) {
      for (var v245 = v242.children.length - 1; v245 >= 0; v245--) {
        EntityTools.reparent(v242.children[v245], v234);
      }
    }
  }
  for (vLN031 = 0; vLN031 < v234.children.length; vLN031++) {
    if ((v242 = v234.children[vLN031]).script && v242.script.collBox) {
      v242.script.collBox.init();
    }
    if (v242.tags.has("deadzone")) {
      v242.render.enabled = false;
    }
  }
  for (vLN031 = 0; vLN031 < v234.children.length; vLN031++) {
    if ((v242 = v234.children[vLN031]).script && v242.script.physScaler) {
      v242.script.physScaler.init();
    }
    for (v245 = 0; v245 < v242.children.length; v245++) {
      if ((v239 = v242.children[v245]).script && v239.script.sliceable && v239.script.physScaler) {
        v239.script.physScaler.init();
      }
    }
  }
  for (vLN031 = 0; vLN031 < v234.children.length; vLN031++) {
    if ((v242 = v234.children[vLN031]).script && v242.script.stackCreator) {
      v242.script.stackCreator.init();
    }
  }
  Polygon.initPolygonsOnEntity(v234, !0);
};
Game.prototype.kickSliceablesOnPos = function (p397, p398, p399) {
  var v246;
  var v247;
  var v248;
  for (var vLN032 = 0; vLN032 < this.levelObjectsE.children.length; vLN032++) {
    v248 = this.levelObjectsE.children[vLN032];
    for (var vLN033 = 0; vLN033 < v248.children.length; vLN033++) {
      if ((v246 = v248.children[vLN033]).enabled && v246.script && v246.script.sliceable) {
        v247 = v246.script.polygon;
        if (Math.abs(v247.pos.x - p397.x) < p398 && Math.abs(v247.pos.y - p397.y) < p399) {
          v246.script.sliceable.kick(p397);
        }
      }
    }
  }
};
Game.prototype.revive = function () {
  this.gotReviveChance = !1;
  FadeScreen.instance.show(0.5, 0.15, 1, function () {
    Knife.instance.reviveAtLastStuckPos();
    Game.state = Game.STATE_PLAYING;
    Game.instance.controlsEnabled = !0;
    Game.instance.interface.enabled = !0;
    Game.instance.uiFailed.enabled = !1;
    Game.instance.uiCompleted.enabled = !1;
    Game.instance.setupPlayingCamera(!0);
  });
};
Game.prototype.onGameOver = function (p400) {
  if (Game.state == Game.STATE_GAMEOVER) {
    return 1;
  }
  if (p400 == "spikes" || p400 == "ground") {
    GameAudio.play("knifefall");
  }
  Game.state = Game.STATE_GAMEOVER;
  this.controlsEnabled = !1;
  this.gameOverReason = p400;
  Game.wasBonusLevel = !1;
  if (Game.bonusLevel) {
    Game.wasBonusLevel = true;
    Game.bonusLevel = false;
    this.currLevel++;
    this.prepareLevel(false);
  }
  this.interface.enabled = !1;
  var v249 = CameraController.instance;
  v249.distance = 12;
  v249.pitch = -10;
  FadeScreen.instance.show(0.3, 1, 0, function () {
    if (Game.instance.currLevel > 0) {
      GameAudio.play("gameover");
      Game.instance.uiFailed.enabled = true;
    } else {
      Game.instance.restart();
    }
  });
};
Game.prototype.formNextLevel = function () {
  Environment.instance.switchType();
};
Game.prototype.onGoBonusLevel = function () {};
Game.easyLevelIds = [8, 9, 43, 27, 28, 24, 25];
Game.easyLevelIdsShuffled = [];
Game.excludeLevelIds = [9, 43, 49, 24, 8];
Game.bonusLevelIds = [71, 72, 73];
Game.normalLevelIds = [5, 6];
Game.highLevelIds = [42, 46, 50, 57, 58, 61, 62, 7];
Game.levelIds = [];
Game.levelIdsPrev = [];
Game.bonusLevel = !1;
Game.bonusIds = [];
Game.levelIdsShuffled = [];
Game.bonusLevelIdsShuffled = [];
Game.highLevelIdsShuffled = [];
Game.prepareLevels = function () {
  for (var vLN41 = 41; vLN41 <= 70; vLN41++) {
    Game.normalLevelIds.push(vLN41);
  }
  for (vLN41 = 0; vLN41 < Game.highLevelIds.length; vLN41++) {
    Game.normalLevelIds.splice(Game.normalLevelIds.indexOf(Game.highLevelIds[vLN41]), 1);
  }
  for (vLN41 = 0; vLN41 < Game.excludeLevelIds.length; vLN41++) {
    if (Game.normalLevelIds.indexOf(Game.excludeLevelIds[vLN41]) >= 0) {
      Game.normalLevelIds.splice(Game.normalLevelIds.indexOf(Game.excludeLevelIds[vLN41]), 1);
    }
  }
};
Game.prepareLevels();
Game.prototype.prepareQuick = function (p401, p402) {
  Game.bonusLevel = p402;
  if (Game.bonusLevel) {
    Game.bonusIds = [p401];
  } else {
    Game.levelIdsPrev = [...Game.levelIds];
    Game.levelIds = [p401];
  }
};
Game.prototype.prepareLevel = function (p403) {
  Game.bonusLevel = p403;
  if (Game.bonusLevel) {
    Game.bonusIds = [];
  } else {
    Game.levelIdsPrev = [...Game.levelIds];
    Game.levelIds = [];
  }
  var v250;
  var vLN15 = 1;
  var v251 = !1;
  var v252 = !1;
  if (this.currLevel == 0) {
    Game.levelIds.push(1);
    return 0;
  }
  if (this.currLevel <= 3) {
    v251 = true;
    vLN15 = 1;
    v252 = false;
  } else {
    if (this.currLevel >= 8 && Math.random() > 0.8) {
      vLN15 = 2;
    }
    if (this.currLevel >= 4 && Math.random() > 0.8) {
      v252 = true;
    }
  }
  if (p403) {
    vLN15 = 1;
  }
  for (var vLN034 = 0; vLN034 < vLN15; vLN034++) {
    if (p403) {
      if (!(v250 = Game.bonusLevelIdsShuffled.pop())) {
        Game.bonusLevelIdsShuffled = [...Game.bonusLevelIds];
        MathUtil.shuffleArray(Game.bonusLevelIdsShuffled);
        v250 = Game.bonusLevelIdsShuffled.pop();
        if (Game.debugOutput) {
          console.log("bonus levels shuffled: ", Game.bonusLevelIdsShuffled);
        }
      }
    } else if (vLN034 == 0 && v252) {
      if (!(v250 = Game.highLevelIdsShuffled.pop())) {
        Game.highLevelIdsShuffled = [...Game.highLevelIds];
        MathUtil.shuffleArray(Game.highLevelIdsShuffled);
        v250 = Game.highLevelIdsShuffled.pop();
        if (Game.debugOutput) {
          console.log("high levels shuffled: ", Game.highLevelIdsShuffled);
        }
      }
    } else if (v251) {
      if (!(v250 = Game.easyLevelIdsShuffled.pop())) {
        Game.easyLevelIdsShuffled = [...Game.easyLevelIds];
        MathUtil.shuffleArray(Game.easyLevelIdsShuffled);
        v250 = Game.easyLevelIdsShuffled.pop();
        if (Game.debugOutput) {
          console.log("easy levels shuffled: ", Game.easyLevelIdsShuffled);
        }
      }
    } else if (!(v250 = Game.levelIdsShuffled.pop())) {
      Game.levelIdsShuffled = [...Game.normalLevelIds];
      MathUtil.shuffleArray(Game.levelIdsShuffled);
      v250 = Game.levelIdsShuffled.pop();
      if (Game.debugOutput) {
        console.log("levels shuffled: ", Game.levelIdsShuffled);
      }
    }
    if (p403) {
      Game.bonusIds.push(v250);
    } else {
      Game.levelIds.push(v250);
    }
  }
  if (Game.debugOutput) {
    if (p403) {
      console.log("level prepared: ", Game.bonusIds);
    } else {
      console.log("level prepared: ", Game.levelIds);
    }
  }
};
Game.goBonus = !1;
Game.prototype.onLevelCompleted = function (p404) {
  if (Game.state == Game.STATE_LEVELCOMPLETED) {
    return 1;
  }
  Game.state = Game.STATE_LEVELCOMPLETED;
  this.envTypeSameCount++;
  if (!p404 && !Game.bonusLevel) {
    this.stepsToBonusLevel--;
  }
  if (this.stepsToBonusLevel <= 0) {
    this.bonusReady = true;
    this.stepsToBonusLevel = 5;
  }
  Game.goBonus = p404;
  if (Game.instance.bonusOperator != null) {
    Game.instance.bonusEarned = FinishController.instance.applyOperatorData(Game.instance.moneyEarned, Game.instance.bonusOperator);
    if (Game.instance.bonusOperator.operator == OperatorType.ADD || Game.instance.bonusOperator.operator == OperatorType.MULTIPLY) {
      this.resultType = 0;
    } else if (Game.instance.bonusEarned < Game.instance.moneyEarned) {
      this.resultType = 1;
    }
  } else {
    Game.instance.bonusEarned = this.moneyEarned;
    this.resultType = 2;
  }
  Game.instance.bonusEarned = Math.max(0, Game.instance.bonusEarned);
  Game.instance.totalEarned = Game.instance.bonusEarned;
  Game.instance.interface.enabled = !1;
  this.controlsEnabled = !1;
  var v253 = CameraController.instance;
  v253.camShift.set(0.95, -0.3, 0);
  v253.distance = 12;
  v253.pitch = 0;
  v253.yaw = 1;
  v253.lerpSpeed = 2;
  v253.lerpAngle = 0.2;
  FinishController.instance.showFlag();
  UiMainMenu.hideCap = !0;
  if (p404) {
    FadeScreen.instance.show(0.3, 2, 0, function () {
      if (!Game.levelDebug) {
        Game.instance.prepareLevel(true);
      }
      Game.instance.restart();
    });
  } else {
    this.currLevel++;
    if (!Game.levelDebug) {
      Game.instance.prepareLevel(false);
    }
    FadeScreen.instance.show(0.3, 2, 0, function () {
      Game.instance.uiCompleted.enabled = true;
    });
    this.saveGame();
  }
};
Game.prototype.setupPlayingCamera = function (p405) {
  var v254 = Knife.instance.entity.getPosition();
  var v255 = CameraController.instance;
  v255.camShift.set(1.2, -1, 0);
  v255.distance = 15.3;
  v255.pitch = -15;
  v255.yaw = -35;
  v255.yawCurr = -15;
  v255.lerpSpeed = 1;
  v255.lerpAngle = 1;
  if (p405) {
    v255.currPos.set(v254.x - 5, v254.y + 3, 10);
    v255.entity.setLocalPosition(v255.currPos);
  }
};
Game.prototype.onJump = function () {
  Knife.instance.entity.getPosition();
  var v256 = Knife.instance.getRandomSound();
  GameAudio.playEx(v256, 1 + pc.math.random(-0.1, 0.1));
  if (this.firstJump) {
    Game.state = Game.STATE_PLAYING;
    this.firstJump = false;
    if (!Game.bonusLevel) {
      this.moneyEarned = 0;
      this.score = 0;
    }
    this.setupPlayingCamera(false);
    CameraController.instance.camShift.set(2.2, -1, 0);
    if (this.currLevel == 0) {
      this.interface.enabled = false;
    } else {
      this.interface.enabled = true;
    }
    this.mainMenu.enabled = false;
  }
};
Game.prototype.onKnifeInGround = function () {
  CameraController.instance.lerpSpeed = 1;
  if (Game.state != Game.STATE_INTRO) {
    GameAudio.playEx("woodhit", 1 + pc.math.random(0.5, 0.6));
  }
};
Game.prototype.onKnifeOutGround = function () {
  CameraController.instance.lerpSpeed = 4;
};
Game.sliceSounds = {
  Wafer: "wafslice",
  WaferBig: "wafslice",
  Cube: "softhit",
  Tube: "metalhit",
  Tube2: "softhit",
  TubeVert: "metalhit",
  Plate: "ceramhit",
  Cup: "ceramhit",
  Coin: "coinhit",
  Gold: "coinhit",
  Diamond: "coinhit",
  Arbuz: "wethitbig",
  Lemon: "wethit",
  Apple: "wethit",
  Onion: "wethit",
  Coconut: "wethit"
};
Game.prototype.onKnifeSlice = function (p406) {
  this.streak++;
  this.streakTimer = 0.2;
  var v257 = Game.sliceSounds[p406.entity.name];
  v257 ||= "slice2";
  GameAudio.playEx(v257, 1 + this.streak / 150 + pc.math.random(-0.1, 0.1));
};
Game.prototype.updateStreak = function (p407) {
  if (this.streakTimer > 0 && (this.streakTimer -= p407, this.streakTimer <= 0)) {
    if (this.streak > 18) {
      var v258;
      var v259 = this.whiteColor;
      if (this.streak > 50) {
        v259 = this.yellowColor;
        v258 = MathUtil.choose("INCREDIBLE!", "TERRIFIC!", "FANTASTIC!");
      } else {
        v258 = this.streak > 25 ? MathUtil.choose("AMAZING!", "AWESOME!", "WOW!") : MathUtil.choose("NICE!", "GREAT!", "EXCELLENT!");
      }
      Game.instance.showStreakText(v258, 0, 1, v259, 1, 1);
      GameAudio.play("streak");
    }
    this.streak = 0;
    this.streakTimer = 0;
  }
};
Game.prototype.addIfLevelExists = function (p408) {
  var v260 = this.levels[p408];
  return !!v260 || !!(v260 = this.app.root.findByName("Level" + p408.toString())) && (v260.tags.add("level"), v260.enabled = !1, this.levels[p408] = v260, !0);
};
Game.prototype.nextLevel = function (p409) {
  var v261 = this._LEVEL_NUMBER;
  v261 += p409;
  if (this.addIfLevelExists(v261)) {
    this._LEVEL_NUMBER = v261;
  }
};
Game.prototype.setResolution3 = function () {
  var v262 = window.innerWidth;
  var v263 = window.innerHeight;
  if (v262 < 640) {
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO, v262, v263);
    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  }
};
Game.prototype.setResolution = function () {
  var v264 = window.innerWidth;
  var v265 = window.innerHeight;
  if (this.hdEnabled) {
    this.app.setCanvasResolution(pc.RESOLUTION_FIXED, v264 / v265 * 1080, 1080);
  } else {
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO, v264, v265);
    if (v264 < 640) {
      this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    }
  }
};
Game.prototype.pause = function (p410) {
  Game.instance.paused = p410;
  Game.instance.app.systems.rigidbody.fixedTimeStep = p410 ? 0 : 1 / 60;
};
Game.prototype.restart = function (p411) {
  Knife.instance.trail1.flushTrail();
  Knife.instance.trail2.flushTrail();
  if (p411) {
    UiMainMenu.hideCap = true;
  }
  Game.state = Game.STATE_INTRO;
  this.gotReviveChance = !0;
  this.pause(!1);
  this.streak = 0;
  this.streakTimer = 0;
  this.levelUpperPlank = 0;
  this.loadLevel();
  var v266 = Knife.instance.entity.getPosition();
  this.setupPlayingCamera(true);
  this.firstJump = true;
  if (Game.bonusLevel) {
    Environment.instance.setType(6);
    this.interface.enabled = true;
    this.mainMenu.enabled = false;
  } else {
    if (this.currLevel != this.lastCurrLevel) {
      this.lastCurrLevel = this.currLevel;
      Sdkmanager.instance.launchSDKfunction(Sdkmanager.SDK_COOLMATH, "startLevel", Game.instance.currLevel);
    }
    this.moneyEarned = 0;
    this.score = 0;
    if (this.envTypeSameCount >= 4) {
      Environment.instance.switchType();
      Game.instance.envType = Environment.instance.type;
      this.envTypeSameCount = 0;
    } else {
      Environment.instance.setType(Game.instance.envType);
    }
    this.saveGame();
    this.interface.enabled = false;
    if (this.currLevel == 0) {
      this.mainMenu.enabled = false;
    } else {
      this.mainMenu.enabled = true;
    }
  }
  if (p411) {
    if (UiMainMenu.hideCap) {
      if (this.levText) {
        this.levText.destroy();
        this.levText = null;
      }
      this.levText = this.showLvlText("LEVEL " + this.currLevel.toString(), v266.x + 4.5, v266.y + 1);
    }
  } else {
    CameraController.instance.camShift.y = 0.5;
  }
  UiMainMenu.hideCap = !1;
  Environment.instance.createGrounds();
  this.uiFailed.enabled = !1;
  this.uiCompleted.enabled = !1;
  this.controlsEnabled = !0;
};
Game.noDebug = !0;
Game.levelDebug = !1;
Game.debugOutput = !1;
Game.prototype.update = function (p412) {
  window.scrollTo(0, 10);
  this.setResolution();
  if (this.shopRewardCooldownCurr > 0) {
    this.shopRewardCooldownCurr -= p412;
  }
  if (Game.state == Game.STATE_PLAYING) {
    this.updateStreak(p412);
    var v267 = window.innerWidth;
    var v268 = window.innerHeight;
    CameraController.instance.yaw = pc.math.lerp(-42, -16, pc.math.clamp((v267 - v268) / v268, 0, 1));
  }
  if (!Game.noDebug) {
    this.app.keyboard.wasPressed(pc.KEY_K);
    if (this.app.keyboard.wasPressed(pc.KEY_R)) {
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.restart();
      });
    }
    if (this.app.keyboard.wasPressed(pc.KEY_N)) {
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.nextLevel(1);
        Game.instance.prepareQuick(Game.instance._LEVEL_NUMBER, Game.instance._BONUS_LEVEL);
        Game.instance.restart();
      });
    }
    if (this.app.keyboard.wasPressed(pc.KEY_P)) {
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.nextLevel(-1);
        Game.instance.prepareQuick(Game.instance._LEVEL_NUMBER, Game.instance._BONUS_LEVEL);
        Game.instance.restart();
      });
    }
    if (this.app.keyboard.wasPressed(pc.KEY_T)) {
      Game.KNIFE_NOT_SET_POS_ON_RESTART = true;
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.restart();
      });
    }
    if (this.app.keyboard.wasPressed(pc.KEY_S)) {
      Game.instance.showStreakText("AMAZING!", 0, 1, null, 1, 1);
    }
  }
};
var Gui = pc.createScript("gui");
Gui.instance = null;
Gui.pages = [];
Gui.prototype.initialize = function () {};
Gui.prototype.update = function (p413) {};
Gui.find = function (p414) {
  var v269;
  for (var v270 = Gui.pages.length, vLN035 = 0; vLN035 < v270; vLN035++) {
    if ((v269 = Gui.pages[vLN035]).entity.name == p414) {
      return v269;
    }
  }
};
Gui.open = function (p415) {
  var v271;
  for (var v272 = Gui.pages.length, vLN036 = 0; vLN036 < v272; vLN036++) {
    if ((v271 = Gui.pages[vLN036]).entity.name == p415) {
      v271.enabled = true;
    }
  }
};
Gui.close = function (p416) {
  var v273;
  for (var v274 = Gui.pages.length, vLN037 = 0; vLN037 < v274; vLN037++) {
    if ((v273 = Gui.pages[vLN037]).entity.name == p416) {
      v273.enabled = false;
    }
  }
};
Gui.buttonAction = function (p417, p418) {
  switch (p417) {
    case "unlockRandomSkin":
      var v275 = Game.instance.getSkinPrice();
      if (v275 > Game.instance.money) {
        return 1;
      }
      Game.instance.money -= v275;
      ShopController.instance.unlockRandomSkin();
      MoneyForAdbutton.instance.reconfigure();
      break;
    case "ShopMoneyForReward":
      Sdkmanager.instance.showAd([Sdkmanager.SDK_TESTING, Sdkmanager.SDK_COOLMATH], Sdkmanager.AD_REWARDED, () => {
        FadeScreen.instance.show(0.4, 0, !0, function () {
          Game.instance.shopRewardCooldownCurr = Game.instance.shopRewardCooldown;
          Game.instance.addMoney(MoneyForAdbutton.instance.count);
          Game.instance.saveGame();
        });
      });
      break;
    case "ClaimScore":
      Game.instance.addMoney(Game.instance.totalEarned);
      Game.instance.saveGame();
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.restart(!0);
      });
      break;
    case "Claimx3ScoreForReward":
      Game.instance.addMoney(Game.instance.totalEarned * 3);
      Game.instance.saveGame();
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.restart(!0);
      });
      break;
    case "YesReviveForReward":
      Sdkmanager.instance.showAd([Sdkmanager.SDK_TESTING, Sdkmanager.SDK_COOLMATH], Sdkmanager.AD_REWARDED, () => {
        Game.instance.revive();
      });
      break;
    case "NoReviveForReward":
      UiFailed.instance.onEnableCb(!0);
      break;
    case "contactbh5":
      window.open("mailto:contact@buyhtml5.com?subject='Slice Master' Licensing");
      break;
    case "failRestart":
      Sdkmanager.instance.launchSDKfunction(Sdkmanager.SDK_COOLMATH, "replayLevel", Game.instance.currLevel);
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.addMoney(Game.instance.moneyEarned);
        Game.bonusLevel &&= false;
        Game.instance.restart();
      });
      break;
    case "openSettingsCompl":
      MyButton.setClickable(Game.instance.uiFailed, !1);
      MyButton.setClickable(Game.instance.uiCompleted, !1);
      MyButton.setClickable(Game.instance.mainMenu, !1);
      Uipopup.open("Settings", !0);
      break;
    case "shopClose":
      if (ShopController.instance.unlocking) {
        return 1;
      }
      setTimeout(function () {
        Game.instance.controlsEnabled = !0;
      }, 500);
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.shop.enabled = false;
        Game.instance.mainMenu.enabled = true;
        Game.instance.applyChosenSkin();
      });
      break;
    case "circleShopBut":
      s = p418.shopItem;
      if (s.unlocked) {
        Game.instance.chosenSkinId = s.itemId;
      }
      ShopController.instance.updateSkinButtons();
      Game.instance.saveGame();
      break;
    case "buyBut":
      s = p418.shopItem;
      if (Game.instance.addStars(-s.price)) {
        FadeScreen.instance.show(0.3, 0, 1, null);
        GameAudio.play("buy");
        s.unlocked = true;
        Game.instance.chosenSkinId = s.itemId;
        ShopController.instance.updateSkinButtons();
        Game.instance.saveGame();
      }
      break;
    case "shopOpen":
      Game.instance.controlsEnabled = !1;
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.shop.enabled = !0;
        Game.instance.mainMenu.enabled = !1;
      });
      break;
    case "restartGame":
      Game.instance.interface.enabled = !0;
      Game.bonusLevel = !1;
      Sdkmanager.instance.launchSDKfunction(Sdkmanager.SDK_COOLMATH, "replayLevel", Game.instance.currLevel);
      setTimeout(function () {
        if (Uipopup.isShown("Pause")) {
          return 1;
        }
        Game.instance.pause(!1);
      }, 600);
      Uipopup.close("Pause");
      FadeScreen.instance.show(0.5, 0, 0, function () {
        Game.instance.restart();
      });
      break;
    case "startGame":
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Game.instance.tutor3d.enabled = true;
        MyButton.setClickable(Game.instance.interface, true);
        Game.instance.interface.enabled = true;
        Game.instance.mainMenu.enabled = false;
        Game.instance.gameOver.enabled = false;
        Game.instance.start();
      });
      break;
    case "pause":
      MyButton.setClickable(Game.instance.interface, !1);
      Game.instance.paused = !0;
      Uipopup.open("Pause", !0);
      break;
    case "resume":
      setTimeout(function () {
        if (Uipopup.getState("Pause") == Uipopup.STATE_CLOSED) {
          Game.instance.paused = false;
          MyButton.setClickable(Game.instance.interface, true);
        }
      }, 750);
      Uipopup.close("Pause");
      break;
    case "pRestart":
      Uipopup.close("Pause");
      Game.instance.paused = !1;
      FadeScreen.instance.show(0.5, 0.1, !1, function () {
        Game.instance.restart(!1);
        Game.instance.uiMainMenu.enabled = !1;
        MyButton.setClickable(Game.instance.interface, !0);
      });
      break;
    case "pHome":
      Uipopup.close("Pause");
      Game.instance.paused = !1;
      Game.instance.save();
      FadeScreen.instance.show(0.5, 0.1, !1, function () {
        Game.instance.uiMainMenu.enabled = !0;
        MyButton.setClickable(Game.instance.interface, !0);
      });
      break;
    case "pauseHome":
      Uipopup.close("Pause");
      setTimeout(function () {
        Game.instance.paused = !1;
      }, 600);
      FadeScreen.instance.show(0.5, 0, 0, function () {
        Game.instance.paused = !1;
        Game.instance.mainMenu.enabled = !0;
        Game.instance.interface.enabled = !1;
        Game.instance.gameField.enabled = !1;
        Game.instance.state = Game.STATE_INTRO;
        Game.instance.reset(!1);
        Game.instance.gameOver.enabled = !1;
      });
      break;
    case "resumeGame":
      Game.instance.interface.enabled = !0;
      setTimeout(function () {
        Game.instance.pause(!1);
      }, 400);
      Uipopup.close("Pause");
      break;
    case "pauseGame":
      Game.instance.interface.enabled = !1;
      Uipopup.open("Pause", !0);
      Game.instance.pause(!0);
      break;
    case "openTutor":
      MyButton.setClickable(Game.instance.gameOver, !1);
      MyButton.setClickable(Game.instance.mainMenu, !1);
      Uipopup.open("Tutorial", !0);
      break;
    case "closeTutor":
      MyButton.setClickable(Game.instance.gameOver, !0);
      MyButton.setClickable(Game.instance.mainMenu, !0);
      if (Game.instance.state == Game.STATE_PLAYING) {
        Uipopup.open("Pause", true);
      } else {
        Uipopup.open("Settings", true);
      }
      break;
    case "openSettings":
      Game.instance.controlsEnabled = !1;
      MyButton.setClickable(Game.instance.gameOver, !1);
      MyButton.setClickable(Game.instance.mainMenu, !1);
      Uipopup.open("Settings", !0);
      break;
    case "closeSettings":
      MyButton.setClickable(Game.instance.gameOver, !0);
      MyButton.setClickable(Game.instance.mainMenu, !0);
      Uipopup.close("Settings");
      MyButton.setClickable(Game.instance.uiFailed, !0);
      MyButton.setClickable(Game.instance.uiCompleted, !0);
      setTimeout(function () {
        if (Game.instance.mainMenu.enabled) {
          Game.instance.controlsEnabled = true;
        }
      }, 500);
      break;
    case "pauseContinue":
      MyButton.setClickable(Game.instance.uiInterface, !0);
      Uipopup.close("pause");
      break;
    case "pauseRestart":
      Uipopup.close("pause");
      FadeScreen.instance.show(0.5, 0, 0, function () {});
      break;
    case "continueScoreButton":
      FadeScreen.instance.show(0.5, 0, 0, function () {
        Game.instance.gameOver.enabled = !1;
        Game.instance.mainMenu.enabled = !0;
      });
      break;
    case "levelCompletedClaim":
      MyButton.setClickable(Game.instance.uiInterface, !0);
      MyButton.setClickable(Game.instance.Screen3D, !0);
      Game.instance.controlsEnabled = !0;
      Game.instance.prepareLevel(Game.instance.levelCurr + 1, 0);
      Game.instance.uiLevelCompleted.script.uiLevelCompleted.claim();
      for (var vLN038 = 0; vLN038 < 20; vLN038++) {
        StarEffect.create(1);
      }
      break;
    case "gameOverContinue":
      FadeScreen.instance.show(0.5, 0, 0, function () {
        Game.instance.gotoMainMenu();
      });
      break;
    case "soundButton":
      GameAudio.switch(!GameAudio.mute);
      break;
    case "musicButton":
      GameAudio.switchMusic(!GameAudio.muteMus);
  }
};
var CollBox = pc.createScript("collBox");
CollBox.prototype.init = function () {
  var v276 = this.entity.getLocalScale().clone();
  v276.mulScalar(0.5);
  if (v276.x < 0) {
    v276.x = -v276.x;
  }
  if (v276.y < 0) {
    v276.y = -v276.y;
  }
  if (v276.z < 0) {
    v276.z = -v276.z;
  }
  this.entity.collision.halfExtents = v276;
};
CollBox.prototype.update = function (p419) {};
var Knife = pc.createScript("knife");
function trace(p420) {
  if (Game.debugOutput) {
    console.log(p420);
  }
}
var vO90 = {
  type: "string",
  array: !0,
  default: ["swoosh"]
};
Knife.tempVec = new pc.Vec3();
Knife.tempVec2 = new pc.Vec3();
Knife.instance = null;
Knife.attributes.add("swingSound", vO90);
Knife.prototype.getRandomSound = function () {
  if (this.swingSound.length === 0) {
    return "swoosh";
  }
  var v277 = Math.floor(Math.random() * this.swingSound.length);
  return this.swingSound[v277];
};
Knife.prototype.initialize = function () {
  Knife.instance = this;
  this.jumpCd = 0;
  this.rb = this.entity.rigidbody;
  this.blade = this.entity.findByName("Blade");
  this.body = this.entity.findByName("Body");
  this.trail1 = this.entity.findByName("Trail1").script.trail;
  this.trail2 = this.entity.findByName("Trail2").script.trail;
  this.blade.render.enabled = this.body.render.enabled = !1;
  this.bladeC = this.blade.script.polygon;
  this.bodyC = this.body.script.polygon;
  this.rb.linearVelocity = pc.Vec3.ZERO;
  this.rb.angularVelocity = pc.Vec3.ZERO;
  this.bladeC.init();
  this.bodyC.init();
  this.fullModel = this.entity.findByName("FullModel");
  this.physModel = this.entity.findByName("PhysModel");
  this.startPos = this.physModel.getLocalPosition().clone();
  this.blinker = this.fullModel.script.materialBlinker;
  this.state = 0;
  this.sliceCd = 0;
  this.vel = new pc.Vec3();
  this.rotVel = 0;
  this.stuck();
  this.dampCd = 0.5;
  this.stuckCd = 0.01;
  this.bounceCd = 0.1;
  this.ground = null;
  this.groundStartPos = new pc.Vec3();
  this.groundKnifePosStart = new pc.Vec3();
  this.dead = !1;
  this.blade.on("polygon:collision", this.onBladeTriggerEnter, this);
  this.body.on("polygon:collision", this.onBodyTriggerEnter, this);
  if (!this.lastStuckPos) {
    this.lastStuckPos = new pc.Vec3();
    this.lastStuckAngles = new pc.Vec3(0, 0, 0);
  }
};
Knife.prototype.reviveAtLastStuckPos = function () {
  this.revive();
  this.rb.enabled = !1;
  this.entity.setLocalPosition(this.lastStuckPos);
  this.entity.setLocalEulerAngles(this.lastStuckAngles);
  Game.instance.removeSpikesAround(this.entity.getPosition());
  this.stuck();
  if (this.blinker) {
    this.blinker.start(3, 3);
  }
};
Knife.prototype.revive = function () {
  this.dead = !1;
  this.physModel.rigidbody.enabled = !1;
  if (!Game.KNIFE_NOT_SET_POS_ON_RESTART) {
    this.physModel.setLocalPosition(this.startPos);
  }
  this.physModel.setLocalEulerAngles(0, 0, 0);
};
Knife.prototype.kill = function (p421) {
  if (this.dead) {
    return 1;
  }
  this.dead = !0;
  if (this.blinker) {
    this.blinker.start(5, 1);
  }
  if (p421 == "falled") {
    GameAudio.play("deadfromfalling");
  }
  Game.instance.onGameOver(p421);
  this.physModel.rigidbody.enabled = !0;
  this.physModel.rigidbody.linearVelocity = this.vel;
  this.physModel.rigidbody.angularVelocity = new pc.Vec3(0, 0, this.rotVel / 180 * 3.14);
  this.physModel.rigidbody.applyImpulse(0, 5, 0);
  this.physModel.rigidbody.applyTorque(1, 1, 1);
};
Knife.prototype.unstuck = function () {
  this.ground &&= null;
  this.state = 1;
  this.body.rigidbody.enabled = !1;
};
Knife.prototype.checkGroundCol = function () {
  if (!this.dead) {
    if (Environment.instance && Environment.instance.type == 6) {
      0;
    }
    if (this.bladeC.checkIfUnderLine(-1) || this.bodyC.checkIfUnderLine(-1)) {
      this.kill("ground");
    }
  }
};
Knife.prototype.stuck = function () {
  this.vel.set(0, 0, 0);
  this.rotVel = 0;
  this.state = 0;
  Game.instance.onKnifeInGround();
  this.body.rigidbody.enabled = !1;
  if (!this.lastStuckPos) {
    this.lastStuckPos = new pc.Vec3();
    this.lastStuckAngles = new pc.Vec3(0, 0, 0);
  }
  this.lastStuckPos.copy(this.entity.getLocalPosition());
  this.lastStuckAngles.copy(this.entity.getLocalEulerAngles());
};
Knife.ROT_VEL_MAX = 560;
Knife.prototype.normalPhys = function () {
  this.state = 2;
  this.rb.type = "dynamic";
  Knife.tempVec.set(0, 0, this.rotVel);
  this.rb.angularVelocity = Knife.tempVec;
  this.rb.linearVelocity = this.vel;
};
Knife.prototype.onBodyTriggerEnter = function (p422) {
  var v278 = p422.entity.tags.has("sliceable");
  var v279 = v278 ? p422.entity.script.sliceable : null;
  if (!this.dead && p422.entity.tags.has("deadzone")) {
    this.kill("falled");
    return 1;
  }
  p422.findContact(this.bodyC);
  Knife.tempVec.copy(Polygon.contactNormal);
  if (!this.dead && p422.entity.tags.has("spike")) {
    for (var vLN039 = 0; vLN039 < 8; vLN039++) {
      EffectDrop.create(this.entity.getPosition(), pc.math.random(0.3, 0.5), new pc.Vec3(pc.math.random(-7, 7), pc.math.random(4, 7), pc.math.random(-4, 4)), 2, Game.instance.whiteColor);
    }
    this.kill("spikes");
    return 1;
  }
  if (!v278 && this.state == 1) {
    var v280 = this.vel.dot(Knife.tempVec);
    Knife.tempVec2.copy(Knife.tempVec);
    Knife.tempVec.mulScalar(Polygon.contactDepth + 0.05);
    this.entity.translate(Knife.tempVec);
    Knife.tempVec2.mulScalar(v280 * 2);
    this.vel.y = 0;
    this.vel.x = 0;
    if (this.blinker) {
      this.blinker.start(5, 1);
    }
    this.rotVel *= 0.5;
    if (this.rotVel < 0 && this.rotVel > -250) {
      this.rotVel = -250;
    }
    if (this.rotVel > 0 && this.rotVel < 250) {
      this.rotVel = 250;
    }
  }
  if (this.bounceCd <= 0 && this.state == 1 && Polygon.contactNormal.x < 0) {
    Knife.tempVec.set(-1, 1, 0);
    Knife.tempVec.mulScalar(12);
    this.vel.add(Knife.tempVec);
    this.vel.mulScalar(0.5);
    GameAudio.playEx("bounce", 1);
  }
  if (v278 && v279.kickCd <= 0 && !p422.static) {
    Knife.tempVec.copy(Polygon.contactNormal);
    Knife.tempVec.mulScalar(-Polygon.contactDepth * 0.5);
    Knife.tempVec.add(p422.entity.getPosition());
    v279.kickCd = 0.1;
    var v281 = p422.entity.rigidbody;
    if (v281 && this.state == 1) {
      if (p422.pos.x > this.bladeC.pos.x) {
        v281.applyImpulse(-this.vel.x * 0.5, -this.vel.y * 0.5, 0);
      } else {
        v281.applyImpulse(-this.vel.x * 0.1, -this.vel.y * 0.1, 0);
      }
    }
  }
  if (this.state == 1) {
    this.bounceCd = 0.05;
  } else if (this.state == 0 && !v278) {
    this.bounceCd = 0.05;
    Knife.tempVec.copy(Polygon.contactNormal);
    Knife.tempVec.mulScalar(Polygon.contactDepth + 0.05);
    this.entity.translate(Knife.tempVec);
    this.vel.y = Polygon.contactNormal.y * 5;
    this.vel.x = Polygon.contactNormal.x * 5;
    this.unstuck();
    this.state = 1;
    this.stuckCd = 0.4;
  }
};
Knife.prototype.onBladeTriggerEnter = function (p423) {
  var v282 = p423.entity;
  if (v282.tags.has("ground") && this.state == 1) {
    p423.findContact(this.bladeC);
    Knife.tempVec.copy(Polygon.contactNormal);
    Knife.tempVec.mulScalar(Polygon.contactDepth * 0.5 - 0.05);
    this.entity.translate(Knife.tempVec);
    this.stuck();
    if (v282.rigidbody.type == "kinematic") {
      this.groundStartPos.copy(p423.pos);
      this.groundKnifePosStart.copy(this.entity.getPosition());
      this.ground = p423;
    }
    if (v282.tags.has("finish")) {
      Game.instance.bonusOperator = FinishController.instance.getBlockOperator(v282);
      var v283 = FinishController.instance.getBlockData(v282);
      var v284 = !1;
      if (Game.instance.bonusOperator) {
        if (v283.count == 50 && Game.instance.bonusReady) {
          GameAudio.play("bonushit");
          v284 = true;
        } else {
          GameAudio.play("xhit");
        }
      } else {
        GameAudio.play("finishhit");
      }
      Game.instance.onLevelCompleted(v284);
      var v285 = v282.script.materialBlinker;
      if (v285) {
        v285.start(3.5, 5);
      }
    }
    return 0;
  }
  if (v282.tags.has("sliceable")) {
    var v286 = v282.script.sliceable;
    Game.instance.onKnifeSlice(v286);
    var vLN040 = 0;
    if (v286.complexSlice) {
      vLN040 = (this.bladeC.pos.z - p423.pos.z) / p423.zSize + 0.5;
    }
    v286.slice(vLN040);
    this.sliceCd = 0.1;
    if (this.vel.x > 0) {
      this.vel.x -= 0.5;
      if (this.vel.x < 0) {
        this.vel.x = 0;
      }
    }
  }
  if (v282.tags.has("spike")) {
    for (var vLN041 = 0; vLN041 < 8; vLN041++) {
      EffectDrop.create(this.entity.getPosition(), pc.math.random(0.3, 0.5), new pc.Vec3(pc.math.random(-7, 7), pc.math.random(4, 7), pc.math.random(-4, 4)), 2, Game.instance.whiteColor);
    }
    this.kill("spikes");
  }
};
Knife.prototype.update = function (p424) {
  if (this.dead) {
    return 1;
  }
  if (Game.instance.paused) {
    return 1;
  }
  var v287 = Input.mouseY / window.innerHeight;
  if (this.jumpCd > 0) {
    this.jumpCd -= p424;
  } else if (Game.instance.controlsEnabled && (Input.mousePressed && v287 > 0.1 && Game.state == Game.STATE_PLAYING || Input.mousePressed && v287 > 0.1 && Input.mouseX > 140 && Game.state == Game.STATE_INTRO || this.app.keyboard.wasPressed(pc.KEY_SPACE) && (Game.state == Game.STATE_INTRO || Game.state == Game.STATE_PLAYING))) {
    this.jumpCd = 0.15;
    Game.instance.onJump();
    this.rotVel -= Knife.ROT_VEL_MAX;
    var v288 = new pc.Vec3(4.2, 11.7, 0);
    if (this.bodyC.pos.y > Game.instance.levelUpperPlank) {
      v288.y = 1;
    }
    this.vel.copy(v288);
    if (this.vel.x < v288.x) {
      this.vel.x = v288.x;
    }
    if (this.vel.y < v288.y) {
      this.vel.y = v288.y;
    }
    this.dampCd = 0.45;
    if (this.state == 0) {
      this.stuckCd = 0.4;
    } else {
      this.stuckCd = 0.15;
    }
    this.bounceCd = 0;
    this.unstuck();
    Game.instance.onKnifeOutGround();
  }
  if (this.stuckCd > 0) {
    this.stuckCd -= p424;
  }
  if (this.bounceCd > 0) {
    this.bounceCd -= p424;
  }
  if (this.dampCd > 0) {
    this.dampCd -= p424;
  }
  if (this.sliceCd > 0) {
    this.sliceCd -= p424;
  }
  this.vel.x *= 1 - p424 / 10;
  this.vel.y *= 1 - p424 / 2;
  this.vel.z *= 1 - p424 / 2;
  Game.instance.grounds.length;
  if (this.state == 0 && this.ground) {
    Knife.tempVec.copy(this.ground.pos);
    Knife.tempVec.sub(this.groundStartPos);
    Knife.tempVec.add(this.groundKnifePosStart);
    this.entity.setPosition(Knife.tempVec.x, Knife.tempVec.y, 0);
    this.bodyC.updatePoints();
    this.bladeC.updatePoints();
  }
  var v289 = p424 * 0.2;
  for (var vLN043 = 0; vLN043 < 5; vLN043++) {
    if (this.state == 1) {
      Knife.tempVec2.set(0, v289 * -23, 0);
      this.vel.add(Knife.tempVec2);
      var v290 = this.entity.getEulerAngles();
      var v291 = Math.abs(MathUtil.angleDifference(v290.z, 180));
      var v292 = 1 - v291 / 40;
      if (this.rotVel < -Knife.ROT_VEL_MAX) {
        this.rotVel = -Knife.ROT_VEL_MAX;
      }
      if (this.vel.y > 28) {
        this.vel.y = 28;
      }
      if (this.vel.y < -25) {
        this.vel.y = -25;
      }
      if (this.vel.x > 4.2) {
        this.vel.x = 4.2;
      }
      if (v292 < 0) {
        this.rotVel = pc.math.lerp(this.rotVel, -Knife.ROT_VEL_MAX, v289 * 10);
      } else if (this.dampCd <= 0) {
        this.rotVel = pc.math.lerp(this.rotVel, -85, v289 * 17);
      }
      if (this.dampCd <= 0 && this.sliceCd > 0 && v290.z + 180 > 300 && v291 < 60) {
        v290.z += MathUtil.angleDifference(v290.z, 170) * v289 * 11;
        this.entity.setEulerAngles(v290);
      }
      this.entity.rotate(0, 0, this.rotVel * v289);
    }
    Knife.tempVec.copy(this.vel);
    Knife.tempVec.mulScalar(v289);
    Knife.tempVec.add(this.entity.getPosition());
    if (Knife.tempVec.y > Game.instance.levelUpperPlank) {
      Knife.tempVec.y = pc.math.lerp(Knife.tempVec.y, Game.instance.levelUpperPlank, 0.25);
    }
    this.entity.setPosition(Knife.tempVec);
    this.bodyC.updatePoints();
    this.bladeC.updatePoints();
    if (this.bounceCd <= 0) {
      this.bodyC.checkAllCollisions(0);
    }
    if (this.state != 0 && this.stuckCd <= 0) {
      this.bladeC.checkAllCollisions(0);
    }
    this.bodyC.checkAllCollisions(2);
    this.bladeC.checkAllCollisions(2);
  }
  if (Game.state == Game.STATE_PLAYING && this.state == 1) {
    if (Math.abs(this.bodyC.pos.y - Game.instance.levelUpperPlank) > 3) {
      UiInterface.instance.highFlyTime = 0;
    } else {
      UiInterface.instance.highFlyTime += p424;
    }
    if (this.bodyC.pos.y > Game.instance.levelUpperPlank && this.vel.y > 0) {
      this.vel.y = pc.math.lerp(this.vel.y, 0, p424 * 10);
    }
    this.checkGroundCol();
  }
};
var CameraController = pc.createScript("cameraController");
CameraController.instance = null;
CameraController.attributes.add("target", {
  type: "entity"
});
CameraController.attributes.add("camShift", {
  type: "vec3",
  default: [0, 0, 0]
});
CameraController.attributes.add("distance", {
  type: "number",
  default: 10
});
CameraController.attributes.add("yaw", {
  type: "number",
  default: 10
});
CameraController.attributes.add("pitch", {
  type: "number",
  default: 10
});
CameraController.attributes.add("lerpSpeed", {
  type: "number",
  default: 10
});
CameraController.attributes.add("lerpAngle", {
  type: "number",
  default: 3
});
CameraController.tempVec3 = new pc.Vec3(0, 0, 0);
CameraController.instance = null;
CameraController.prototype.setupCurr = function () {
  this.pitchCurr = this.pitch;
  this.yawCurr = this.yaw;
  this.distanceCurr = this.distance;
  this.entity.setLocalEulerAngles(this.pitchCurr, this.yawCurr, 0);
};
CameraController.prototype.initialize = function () {
  if (CameraController.instance == null) {
    CameraController.instance = this;
  }
  this.pitchCurr = this.pitch;
  this.yawCurr = this.yaw;
  this.distanceCurr = this.distance;
  this.targetPos = new pc.Vec3(0, 0, 0);
  this.currPos = this.entity.getPosition().clone();
  this.entity.setLocalEulerAngles(this.pitchCurr, this.yawCurr, 0);
};
CameraController.prototype.update = function (p425) {
  if (Game.instance.paused) {
    return 1;
  }
  if (p425 > 0.05) {
    p425 = 0.05;
  }
  if (this.target) {
    this.targetPos.copy(this.target.getPosition());
    this.targetPos.add(this.camShift);
  }
  this.currPos.copy(this.entity.getLocalPosition());
  var v293 = this.entity.getLocalEulerAngles();
  this.pitchCurr = pc.math.lerp(v293.x, this.pitch, p425 * this.lerpAngle / 1);
  this.yawCurr = pc.math.lerp(v293.y, this.yaw, p425 * this.lerpAngle / 1);
  this.distanceCurr = pc.math.lerp(this.distanceCurr, this.distance, p425 * this.lerpAngle);
  this.entity.setLocalEulerAngles(this.pitchCurr, this.yawCurr, 0);
  var v294 = CameraController.tempVec3;
  v294.copy(this.entity.forward);
  v294.scale(-this.distanceCurr);
  if (this.target) {
    v294.add(this.targetPos);
  }
  this.currPos.lerp(this.currPos, v294, p425 * this.lerpSpeed);
  this.entity.setLocalPosition(this.currPos);
};
var Blade = pc.createScript("blade");
Blade.prototype.initialize = function () {
  this.inGround = !1;
};
Blade.prototype.onTriggerEnter = function (p426) {
  if (p426.tags.has("ground")) {
    console.log(p426.name);
    if (this.knife) {
      this.knife.stuck();
    }
    this.inGround = true;
  }
};
Blade.prototype.update = function (p427) {};
var Polygon = pc.createScript("polygon");
var vO98 = {
  type: "entity",
  title: "points",
  array: !0
};
var vO99 = {
  type: "boolean",
  default: !0
};
var vO101 = {
  type: "boolean",
  default: !1
};
var vO102 = {
  type: "number",
  default: -1
};
var vO103 = {
  type: "boolean",
  default: !1
};
Polygon.attributes.add("points", vO98);
Polygon.attributes.add("static", vO99);
Polygon.attributes.add("colGroup", {
  type: "number",
  default: 0
});
Polygon.attributes.add("isCircle", vO101);
Polygon.attributes.add("radius", vO102);
Polygon.attributes.add("polyFromCollisionBox", vO103);
Polygon.HASHMAP_SIZE = 15;
Polygon.TYPE_POLY = 0;
Polygon.TYPE_CIRC = 1;
Polygon.contactNormal = new pc.Vec3(0, 0, 0);
Polygon.contactDepth = 0;
Polygon.polygons = [];
Polygon.prototype.initialize = function () {};
Polygon.DRAW_DOTS = !1;
Polygon.initPolygonsOnEntity = function (p428, p429) {
  var v295;
  if ((p428.script && p428.script.polygon && p428.script.polygon.init(), p429) && p428.children) {
    for (var vLN044 = 0; vLN044 < p428.children.length; vLN044++) {
      v295 = p428.children[vLN044];
      Polygon.initPolygonsOnEntity(v295, p429);
    }
  }
};
Polygon.prototype.getChildLocalPosition = function (p430, p431) {
  var v296 = p430.getPosition().clone();
  if (p431 !== null) {
    var v297 = p431.getWorldTransform().clone();
    v297.invert();
    v296.sub(p431.getPosition());
    v297.transformPoint(v296, v296);
  }
  return v296;
};
Polygon.prototype.init = function () {
  this.initialized = !0;
  this.zSize = 0;
  this.pos = this.entity.getPosition();
  this.pps = [];
  this.ns = [];
  this.lps = [];
  this.xid = 0;
  this.yid = 0;
  this.updateHashId();
  if (this.isCircle) {
    this.type = Polygon.TYPE_CIRC;
    if (this.points.length > 0) {
      var v298 = this.points[0].getPosition();
      Polygon.tempVec.copy(this.entity.getPosition());
      Polygon.tempVec.sub(v298);
      this.radius = Polygon.tempVec.length();
    }
  } else {
    this.type = Polygon.TYPE_POLY;
    if (this.points.length == 0) {
      if (this.polyFromCollisionBox) {
        var v299 = this.entity.collision.halfExtents.clone();
        var v300 = this.entity.collision;
        var v301 = this.entity.getLocalScale();
        v299.x *= 1 / v301.x;
        v299.y *= 1 / v301.y;
        var v302 = 1 / v301.x;
        if (v300.type == "cylinder") {
          this.addLocalPoint(-v300.radius * v302, v300.height * 0.5 / v301.y);
          this.addLocalPoint(v300.radius * v302, v300.height * 0.5 / v301.y);
          this.addLocalPoint(v300.radius * v302, -v300.height * 0.5 / v301.y);
          this.addLocalPoint(-v300.radius * v302, -v300.height * 0.5 / v301.y);
        } else {
          if (this.entity.script && this.entity.script.sliceable && this.entity.script.sliceable.complexSlice) {
            this.zSize = v299.z * 2;
          }
          this.addLocalPoint(-v299.x, v299.y);
          this.addLocalPoint(v299.x, v299.y);
          this.addLocalPoint(v299.x, -v299.y);
          this.addLocalPoint(-v299.x, -v299.y);
        }
      } else {
        v301 = this.entity.getLocalScale();
        this.addLocalPoint(-0.5, 0.5);
        this.addLocalPoint(0.5, 0.5);
        this.addLocalPoint(0.5, -0.5);
        this.addLocalPoint(-0.5, -0.5);
      }
    }
  }
  var v303;
  for (var vLN045 = 0; vLN045 < this.points.length; vLN045++) {
    v303 = this.points[vLN045].getLocalPosition().clone();
    this.lps.push(v303);
    this.addPointData2(v303);
    this.points[vLN045].destroy();
  }
  this.updatePoints();
  this.updateNormals();
  this.boundRadius = 0;
  this.updateBoundRadius();
  Polygon.polygons.push(this);
};
Polygon.prototype.updateBoundRadius = function () {
  if (this.type == Polygon.TYPE_CIRC) {
    this.boundRadius = this.radius;
    return 0;
  }
  var v304;
  var v305;
  var v306;
  for (var vLN046 = 0; vLN046 < this.pps.length; vLN046++) {
    v304 = this.pps[vLN046];
    Polygon.tempVec.copy(this.pos);
    Polygon.tempVec.sub(v304);
    if ((v306 = Polygon.tempVec.lengthSq()) > v305 || v305 == null) {
      v305 = v306;
    }
  }
  this.boundRadius = Math.sqrt(v305);
};
Polygon.prototype.update = function (p432) {
  this.pos = this.entity.getPosition();
  if (this.initialized) {
    if (!this.static) {
      this.updatePoints();
      this.updateHashId();
      this.updateBoundRadius();
    }
  }
};
Polygon.prototype.checkAllCollisions = function (p433) {
  var v307;
  var v308;
  for (var vLN047 = 0; vLN047 < Polygon.polygons.length; vLN047++) {
    if ((v307 = Polygon.polygons[vLN047]) && v307.enabled && v307.entity.enabled && v307 != this && v307.colGroup == p433 && !(v307.xid > this.xid + 1) && !(v307.xid < this.xid - 1) && !(v307.yid > this.yid + 1) && !(v307.yid < this.yid - 1)) {
      if (v307.zSize <= 0) {
        if (Math.abs(this.pos.z - v307.pos.z) >= 0.4) {
          continue;
        }
      } else if (this.pos.z < v307.pos.z - v307.zSize * 0.5 || this.pos.z > v307.pos.z + v307.zSize * 0.5) {
        continue;
      }
      v308 = (this.boundRadius + v307.boundRadius) * (this.boundRadius + v307.boundRadius);
      Polygon.tempVec.copy(v307.pos);
      Polygon.tempVec.sub(this.pos);
      if (!(Polygon.tempVec.lengthSq() >= v308)) {
        if (this.checkCollision(v307)) {
          this.entity.fire("polygon:collision", v307);
        }
      }
    }
  }
};
Polygon.prototype.updateHashId = function () {
  this.xid = Math.floor(this.pos.x / Polygon.HASHMAP_SIZE);
  this.yid = Math.floor(this.pos.y / Polygon.HASHMAP_SIZE);
};
Polygon.prototype.updatePoints = function () {
  var v309 = this.entity.getWorldTransform();
  for (var vLN048 = 0; vLN048 < this.pps.length; vLN048++) {
    v309.transformPoint(this.lps[vLN048], this.pps[vLN048]);
    this.pps[vLN048].z = 0;
  }
};
Polygon.prototype.localToGlobal = function (p434, p435) {
  p435.copy(p434);
  p435.mul(this.entity.getLocalScale());
  p435.add(this.entity.getLocalPosition());
  return p435;
};
Polygon.prototype.addLocalPoint = function (p436, p437) {
  var v310 = new pc.Entity("Point");
  this.entity.addChild(v310);
  v310.setLocalPosition(p436, p437, 0);
  if (Polygon.DRAW_DOTS) {
    v310.addComponent("render", {
      type: "sphere"
    });
  }
  v310.setLocalScale(0.1, 0.1, 0.1);
  this.points.push(v310);
};
Polygon.prototype.addGlobalPoint = function (p438, p439) {
  var v311 = new pc.Entity("Point");
  this.entity.addChild(v311);
  var v312 = this.entity.getPosition();
  v311.setPosition(v312.x + p438, v312.y + p439, v312.z);
  this.points.push(v311);
};
Polygon.prototype.addPointData2 = function (p440) {
  var v313 = p440.clone();
  this.pps.push(v313);
  this.ns.push(new pc.Vec3(1, 0, 0));
};
Polygon.prototype.addPointData = function (p441) {
  var v314 = p441.getPosition().clone();
  this.pps.push(v314);
  this.ns.push(new pc.Vec3(1, 0, 0));
};
Polygon.prototype.updateNormals = function () {
  var v315;
  var v316 = this.pps.length;
  if (v316 > 1) {
    for (var vLN049 = 0; vLN049 < v316; vLN049++) {
      v315 = this.ns[vLN049];
      if (vLN049 < v316 - 1) {
        v315.copy(this.pps[vLN049 + 1]);
      } else {
        v315.copy(this.pps[0]);
      }
      v315.sub(this.pps[vLN049]);
      v315.set(-v315.y, v315.x, 0);
      var v317 = v315.length();
      v315.mulScalar(1 / v317);
    }
  }
};
Polygon.tempVec = new pc.Vec3();
Polygon.tempVec2 = new pc.Vec3();
Polygon.prototype.findContact = function (p442) {
  var v318;
  var v319;
  var v320;
  var v321;
  if (this.type == Polygon.TYPE_POLY) {
    var v322;
    var v323 = this.pps.length;
    var v324 = p442.pps.length;
    v320 = undefined;
    for (var vLN050 = 0; vLN050 < v323; vLN050++) {
      v325 = this.pps[vLN050];
      v319 = undefined;
      for (var vLN051 = 0; vLN051 < v324; vLN051++) {
        v322 = p442.pps[vLN051];
        Polygon.tempVec.copy(v322);
        Polygon.tempVec.sub(v325);
        if (!((v318 = this.ns[vLN050].x * Polygon.tempVec.x + this.ns[vLN050].y * Polygon.tempVec.y) > 0)) {
          if ((v318 = -v318) > v319 || v319 == null) {
            v319 = v318;
          }
        }
      }
      if (v320 > v319 || v320 == null) {
        v320 = v319;
        v321 = vLN050;
      }
    }
    Polygon.contactDepth = v320;
    Polygon.contactNormal.copy(this.ns[v321]);
    return Polygon.contactNormal;
  }
  if (this.type == Polygon.TYPE_CIRC) {
    var v325;
    var v326;
    var v327;
    var v328;
    var v329;
    v324 = p442.pps.length;
    vLN050 = 0;
    for (; vLN050 < v324; vLN050++) {
      v325 = p442.pps[vLN050];
      Polygon.tempVec.copy(v325);
      Polygon.tempVec.sub(this.pos);
      v326 = Polygon.tempVec.lengthSq();
      if (v327 == null || v326 < v327) {
        v327 = v326;
        v328 = vLN050;
      }
    }
    v325 = p442.pps[v328];
    Polygon.tempVec.copy(v325);
    Polygon.tempVec.sub(this.pos);
    Polygon.tempVec.z = 0;
    v329 = Polygon.tempVec.length();
    Polygon.tempVec.mulScalar(1 / v329);
    v318 = this.radius - v329;
    Polygon.contactDepth = v318;
    Polygon.contactNormal.copy(Polygon.tempVec);
    return Polygon.contactNormal;
  }
};
Polygon.polyCircCollision = function (p443, p444) {
  if (Polygon.pointPolyCollision(p444.pos, p443)) {
    return !0;
  }
  var v330;
  var v331;
  for (var v332 = p443.pps.length, vLN052 = 0, v333 = v332 - 1; vLN052 < v332; v333 = vLN052++) {
    v330 = p443.pps[vLN052];
    v331 = p443.pps[v333];
    if (Polygon.pointLineSegmentDistance(p444.pos, v330, v331) < p444.radius) {
      return !0;
    }
  }
  return !1;
};
Polygon.polygonEdges = function (p445) {
  return p445.pps.map(function (p446, p447) {
    if (p447) {
      return [p445.pps[p447 - 1], p446];
    } else {
      return [p445.pps[p445.pps.length - 1], p446];
    }
  });
};
Polygon.pointPolyCollision = function (p448, p449) {
  var v334;
  var v335;
  for (var v336 = p449.pps.length, vLN053 = 0, v337 = v336 - 1, v338 = p448.x, v339 = p448.y, v340 = !1; vLN053 < v336; v337 = vLN053++) {
    v334 = p449.pps[vLN053];
    v335 = p449.pps[v337];
    if (v334.y > v339 ^ v335.y > v339 && v338 < (v335.x - v334.x) * (v339 - v334.y) / (v335.y - v334.y) + v334.x) {
      v340 = !v340;
    }
  }
  return v340;
};
Polygon.pointLineSegmentDistance = function (p450, p451, p452) {
  var v341;
  var v342;
  var vP451 = p451;
  var vP452 = p452;
  return Math.sqrt(Polygon.pointPointSquaredDistance(p450, (v341 = Polygon.pointPointSquaredDistance(vP451, vP452)) ? (v342 = ((p450.x - p451.x) * (vP452.x - p451.x) + (p450.y - p451.y) * (vP452.y - vP451.y)) / v341) < 0 ? p451 : v342 > 1 ? vP452 : new pc.Vec3(p451.x + v342 * (vP452.x - p451.x), p451.y + v342 * (vP452.y - p451.y), 0) : vP451));
};
Polygon.pointLineSegmentDistance2 = function (p453, p454, p455) {
  var v343;
  var v344;
  var vP454 = p454;
  var vP455 = p455;
  Polygon.pointPointSquaredDistance(vP454, vP455);
  return Math.sqrt(pointPointSquaredDistance(p453, (v343 = Polygon.pointPointSquaredDistance(vP454, vP455)) ? (v344 = ((p453.x - p454.x) * (vP455.x - p454.x) + (p453.y - p454.y) * (vP455.y - vP454.y)) / v343) < 0 ? p454 : v344 > 1 ? vP455 : new pc.Vec3(p454.x + v344 * (vP455.x - p454.x), p454.y + v344 * (vP455.y - p454.y), 0) : vP454));
};
Polygon.pointPointSquaredDistance = function (p456, p457) {
  var v345 = p456.x - p457.x;
  var v346 = p456.y - p457.y;
  return v345 * v345 + v346 * v346;
};
Polygon.polyPolyCollision = function (p458, p459) {
  var v347;
  var v348;
  var v349;
  var v350;
  var v351;
  var v352;
  var v353;
  var v354;
  var v355;
  var v356 = p458.pps;
  var v357 = p459.pps;
  var vA7 = [v356, v357];
  for (v350 = 0; v350 < 2; v350++) {
    var v358 = vA7[v350];
    v355 = v358.length;
    v351 = 0;
    for (; v351 < v355; v351++) {
      var v359 = (v351 + 1) % v355;
      var v360 = v358[v351];
      var v361 = v358[v359];
      var v362 = Polygon.tempVec;
      v362.set(v361.y - v360.y, v360.x - v361.x);
      v347 = v348 = undefined;
      v352 = 0;
      for (; v352 < v356.length; v352++) {
        v349 = v362.x * v356[v352].x + v362.y * v356[v352].y;
        if (v347 == null || v349 < v347) {
          v347 = v349;
        }
        if (v348 == null || v349 > v348) {
          v348 = v349;
        }
      }
      v353 = v354 = undefined;
      v352 = 0;
      for (; v352 < v357.length; v352++) {
        v349 = v362.x * v357[v352].x + v362.y * v357[v352].y;
        if (v353 == null || v349 < v353) {
          v353 = v349;
        }
        if (v354 == null || v349 > v354) {
          v354 = v349;
        }
      }
      if (v348 < v353 || v354 < v347) {
        return !1;
      }
    }
  }
  return !0;
};
Polygon.prototype.checkIfUnderLine = function (p460) {
  if (this.type == Polygon.TYPE_POLY) {
    for (var vLN054 = 0; vLN054 < this.pps.length; vLN054++) {
      if (this.pps[vLN054].y < p460) {
        return !0;
      }
    }
  } else if (this.type == Polygon.TYPE_CIRC && this.pos.y - this.radius < p460) {
    return !0;
  }
  return !1;
};
Polygon.prototype.checkCollision = function (p461) {
  if (p461.type == Polygon.TYPE_POLY && this.type == Polygon.TYPE_POLY) {
    return Polygon.polyPolyCollision(this, p461);
  } else if (p461.type == Polygon.TYPE_CIRC && this.type == Polygon.TYPE_POLY) {
    return Polygon.polyCircCollision(this, p461);
  } else if (p461.type == Polygon.TYPE_POLY && this.type == Polygon.TYPE_CIRC) {
    return Polygon.polyCircCollision(p461, this);
  } else {
    return undefined;
  }
};
var PolygonTest = pc.createScript("polygonTest");
PolygonTest.attributes.add("poly2", {
  type: "entity"
});
PolygonTest.prototype.initialize = function () {
  this.p1 = this.entity.script.polygon;
  this.p2 = this.poly2.script.polygon;
};
PolygonTest.prototype.update = function (p462) {
  if (this.app.keyboard.wasPressed(pc.KEY_A)) {
    this.p1.updatePoints();
    if (this.p1.checkCollision(this.p2)) {
      console.log("push out");
      this.p2.pushOut(this.p1, this.p1.entity);
    }
  }
};
var Sliceable = pc.createScript("sliceable");
var vO109 = {
  type: "boolean",
  default: !1
};
var vO110 = {
  type: "boolean",
  default: !1
};
var vO115 = {
  type: "boolean",
  default: !1
};
var vO116 = {
  type: "boolean",
  default: !1
};
var vO117 = {
  type: "boolean",
  default: !1
};
var vO118 = {
  array: !0,
  type: "asset",
  assetType: "material"
};
var vO119 = {
  type: "boolean",
  default: !1
};
var vO120 = {
  type: "number",
  default: -1
};
var vO124 = {
  type: "boolean",
  default: !1
};
Sliceable.attributes.add("left", {
  type: "entity"
});
Sliceable.attributes.add("right", {
  type: "entity"
});
Sliceable.attributes.add("full", {
  type: "entity"
});
Sliceable.attributes.add("price", {
  type: "number",
  default: 1
});
Sliceable.attributes.add("kinematicOneSide", vO109);
Sliceable.attributes.add("complexSlice", vO110);
Sliceable.attributes.add("baseMat", {
  type: "asset",
  assetType: "material"
});
Sliceable.attributes.add("innerMat", {
  type: "asset",
  assetType: "material"
});
Sliceable.attributes.add("mat", {
  type: "asset",
  assetType: "material"
});
Sliceable.attributes.add("matVnutri", {
  type: "asset",
  assetType: "material"
});
Sliceable.attributes.add("multicolorVnutri", vO115);
Sliceable.attributes.add("static", vO116);
Sliceable.attributes.add("staticOneSide", vO117);
Sliceable.attributes.add("randomMat", vO118);
Sliceable.attributes.add("sameInnerAsBase", vO119);
Sliceable.attributes.add("emitId", vO120);
Sliceable.attributes.add("emitCount", {
  type: "number",
  default: 5
});
Sliceable.attributes.add("emitRadius", {
  type: "number",
  default: 0
});
Sliceable.attributes.add("emitColor", {
  type: "rgba"
});
Sliceable.attributes.add("emitColorFromDiffuse", vO124);
Sliceable.prototype.initialize = function () {
  this.kickCd = 0;
  this.kick2Cd = 0;
  if (this.entity.name == "CubeComplex" || this.entity.name == "Tube" || this.entity.name == "TubeVert" || this.entity.name == "Cube" || this.entity.name == "RoundCube") {
    this.baseMat = Game.instance.baseMatGrey;
    this.innerMat = Game.instance.innerMatGrey;
    EntityTools.setMaterial(this.full, this.baseMat);
  }
  if (this.entity.name == "Sphere") {
    this.baseMat = Game.instance.baseMatGrey;
    this.innerMat = Game.instance.innerMatGrey;
  }
  if (this.left) {
    this.left.enabled = false;
  }
  if (this.right) {
    this.right.enabled = false;
  }
  if (this.entity.script.polygon) {
    this.entity.script.polygon.colGroup = 2;
  }
  if (this.entity.rigidbody) {
    var v363 = this.entity.rigidbody;
    if (this.complexSlice) {
      v363.linearFactor = new pc.Vec3(1, 1, 1);
    } else {
      v363.linearFactor = new pc.Vec3(1, 1, 0);
    }
    v363.angularFactor = new pc.Vec3(0, 0, 1);
  }
  if (this.static) {
    this.entity.rigidbody.type = "static";
  }
  if (this.staticOneSide) {
    this.left.rigidbody.type = "static";
    this.left.translate(0, 0, -0.04);
  }
  if (this.kinematicOneSide) {
    this.left.rigidbody.type = "kinematic";
  }
  if (this.multicolorVnutri) {
    this.matVnutri = StackCreator.getStackColor();
  }
  if (this.sameInnerAsBase) {
    this.matVnutri = this.baseMat;
  }
  if (this.matVnutri && this.matVnutri != this.innerMat && this.innerMat) {
    EntityTools.changeMaterial(this.left.children[0], this.innerMat, this.matVnutri);
    EntityTools.changeMaterial(this.right.children[0], this.innerMat, this.matVnutri);
  }
  if (this.randomMat.length > 0) {
    var v364 = this.randomMat[MathUtil.getRandomInt(this.randomMat.length)];
    this.mat = v364;
    this.changeBaseMat(v364);
  } else if (this.mat) {
    this.changeBaseMat(this.mat);
  }
};
Sliceable.prototype.changeBaseMat = function (p463) {
  this.mat = p463;
  if (this.full) {
    EntityTools.changeMaterial(this.full, this.baseMat, p463);
  }
  if (this.left) {
    EntityTools.changeMaterial(this.left.children[0], this.baseMat, p463);
  }
  if (this.right) {
    EntityTools.changeMaterial(this.right.children[0], this.baseMat, p463);
  }
};
Sliceable.prototype.update = function (p464) {
  if (this.kickCd > 0) {
    this.kickCd -= p464;
  }
  if (this.kick2Cd > 0) {
    this.kick2Cd -= p464;
  }
};
Sliceable.prototype.emitDrops = function (p465, p466) {
  for (var vLN055 = 0; vLN055 < p466; vLN055++) {
    EffectDrop.create(p465, pc.math.random(0.4, 0.7), new pc.Vec3(pc.math.random(-4, 4), pc.math.random(4, 9), pc.math.random(-4, 4)), 0);
  }
};
Sliceable.prototype.kick = function (p467, p468) {
  trace("kick");
  if (this.kick2Cd > 0) {
    return 1;
  }
  var v365 = this.entity.rigidbody;
  if (this.static) {
    this.kick2Cd = 0.1;
    this.static = false;
    v365.type = "dynamic";
    if (this.entity.script.polygon.pos.z < p467.z) {
      v365.applyTorque(55, 0, 0);
      v365.applyImpulse(0, 0, -0.1);
    } else {
      v365.applyTorque(-55, 0, 0);
      v365.applyImpulse(0, 0, 0.1);
    }
    v365.angularFactor = new pc.Vec3(1, 0, 1);
  }
};
Sliceable.temp = new pc.Vec3(0, 0, 0);
Sliceable.temp2 = new pc.Vec3(0, 0, 0);
Sliceable.innerMatId = 0;
Sliceable.prototype.slice = function (p469) {
  this.entity.enabled = !1;
  if (this.complexSlice) {
    var vP469 = p469;
    this.left.setLocalScale(1, 1, vP469 * 2);
    this.right.setLocalScale(1, 1, (1 - vP469) * 2);
    this.left.setLocalPosition(0, 0, vP469 / 2 - 0.5);
    this.right.setLocalPosition(0, 0, 0.5 - (1 - vP469) / 2);
    var v366 = this.entity.script.polygon;
    var v367 = this.entity.collision.halfExtents;
    Game.instance.kickSliceablesOnPos(v366.pos, v367.x, v367.y * 2);
  }
  var v368;
  if (this.kinematicOneSide) {
    EntityTools.reparent(this.left, this.entity.parent);
  } else {
    EntityTools.reparent(this.left, Game.instance.levelObjectsSliced);
  }
  EntityTools.reparent(this.right, Game.instance.levelObjectsSliced);
  if (this.entity.name == "Tube") {
    this.left.rigidbody.angularFactor.set(1, 1, 0.1);
    this.right.rigidbody.angularFactor.set(1, 1, 0.1);
  }
  if (this.left) {
    this.left.enabled = true;
    if (this.left.script && this.left.script.physScaler) {
      this.left.script.physScaler.init();
    }
    (v368 = this.left.rigidbody).applyImpulse(0, 0, -7);
    v368.applyTorque(-45, 0, 0);
  }
  if (this.right) {
    if (this.right.script && this.right.script.physScaler) {
      this.right.script.physScaler.init();
    }
    this.right.enabled = true;
    (v368 = this.right.rigidbody).applyImpulse(0, 0, 7);
    v368.applyTorque(45, 0, 0);
  }
  var v369;
  var v370 = this.entity.getPosition();
  var v371 = "+" + this.price.toString();
  var vLN082 = 0.8;
  if (this.price > 10) {
    v369 = Game.instance.yellowColor;
    vLN082 = 1.2;
  } else if (this.price >= 5) {
    v369 = Game.instance.greenColor;
    vLN082 = 1;
  } else {
    v369 = Game.instance.whiteColor;
    vLN082 = 0.8;
  }
  v369 = Game.bonusLevel ? Game.instance.yellowColor : Game.instance.whiteColor;
  Game.instance.showText(v371, v370.x, v370.y, v369, 1, vLN082);
  Game.instance.addMoney(this.price, !0);
  if (this.emitId >= 0 && this.emitCount > 0) {
    if (this.emitColorFromDiffuse) {
      if (this.mat) {
        this.emitColor = this.mat.resource.diffuse;
      } else if (this.baseMat) {
        this.emitColor = this.baseMat.resource.diffuse;
      }
    }
    for (var vLN056 = 0; vLN056 < this.emitCount; vLN056++) {
      if (this.emitRadius > 0) {
        Sliceable.temp.copy(v370);
        Sliceable.temp.x += pc.math.random(-this.emitRadius, this.emitRadius);
        Sliceable.temp.y += pc.math.random(-this.emitRadius, this.emitRadius);
        Sliceable.temp.z += pc.math.random(-this.emitRadius, this.emitRadius);
        Sliceable.temp2.set(pc.math.random(-7, 7), pc.math.random(4, 7), pc.math.random(-4, 4));
        EffectDrop.create(Sliceable.temp, pc.math.random(0.3, 0.5) + this.emitRadius * 0.25, Sliceable.temp2, this.emitId, this.emitColor);
      } else {
        Sliceable.temp2.set(pc.math.random(-7, 7), pc.math.random(4, 7), pc.math.random(-4, 4));
        EffectDrop.create(v370, pc.math.random(0.3, 0.5), Sliceable.temp2, this.emitId, this.emitColor);
      }
    }
  }
};
var StackCreator = pc.createScript("stackCreator");
var vO126 = {
  type: "boolean",
  default: !1
};
var vO130 = {
  type: "boolean",
  default: !1
};
var vO131 = {
  type: "boolean",
  default: !1
};
var vO132 = {
  type: "asset",
  assetType: "material",
  array: !0
};
var vO133 = {
  type: "boolean",
  default: !1
};
var vO134 = {
  type: "boolean",
  default: !1
};
StackCreator.attributes.add("count", {
  type: "number",
  default: 1
});
StackCreator.attributes.add("isFigure", vO126);
StackCreator.attributes.add("yDistance", {
  type: "number",
  default: 1
});
StackCreator.attributes.add("zRandom", {
  type: "number",
  default: 0
});
StackCreator.attributes.add("yRandomAngle", {
  type: "number",
  default: 0
});
StackCreator.attributes.add("static", vO130);
StackCreator.attributes.add("staticOneSide", vO131);
StackCreator.attributes.add("mats", vO132);
StackCreator.attributes.add("multicolorVnutri", vO133);
StackCreator.attributes.add("sideStack", vO134);
StackCreator.prototype.init = function () {
  var v372;
  var v373;
  var v374;
  var v375 = this.entity.getPosition();
  var v376 = new pc.Vec3();
  var vLN16 = 1;
  var v377 = this.entity.getLocalEulerAngles();
  var vLN057 = 0;
  var vLN17 = 1;
  for (var v378 = this.count - 1; v378 >= 0; v378--) {
    if (v378 > 0) {
      (v372 = this.entity.clone()).script.destroy("stackCreator");
    } else {
      v372 = this.entity;
    }
    v374 = v372.script.sliceable;
    if (this.static) {
      v372.rigidbody.type = "static";
      v372.script.polygon.static = true;
    }
    if (this.staticOneSide) {
      v374.left.rigidbody.type = "static";
      v376.z = -0.04;
    }
    if (v374.baseMat && this.mats.length > 0) {
      v374.mat = this.mats[vLN057];
      if (v378 == 0) {
        v374.changeBaseMat(this.mats[vLN057]);
      }
      if (this.mats.length > 1) {
        vLN057 += vLN17;
        if (vLN17 > 0 && vLN057 >= this.mats.length - 1) {
          vLN057 = this.mats.length - 1;
          vLN17 = -1;
        } else if (vLN17 < 0 && vLN057 <= 0) {
          vLN057 = 0;
          vLN17 = 1;
        }
      }
    }
    if (this.multicolorVnutri) {
      v374.matVnutri = StackCreator.getStackColor();
      if (v378 == 0) {
        EntityTools.changeMaterial(v374.left.children[0], v374.innerMat, v374.matVnutri);
        EntityTools.changeMaterial(v374.right.children[0], v374.innerMat, v374.matVnutri);
      }
    }
    if (this.isFigure) {
      v373 = v372.getLocalScale();
      vLN16 = 0.75 + Math.cos(v378 * 3.14 / 10) * 0.25;
      v372.setLocalScale(v373.x, v373.y, v373.z * vLN16);
    }
    v376.copy(v375);
    if (this.sideStack) {
      v376.x += v378 * this.yDistance;
    } else {
      v376.y += v378 * this.yDistance;
    }
    if (this.zRandom != 0) {
      v376.z += pc.math.random(-this.zRandom, this.zRandom);
    }
    if (this.yRandomAngle > 0) {
      v372.rigidbody.angularFactor = new pc.Vec3(0, 1, 1);
      v372.setLocalEulerAngles(v377.x, v377.y + pc.math.random(-this.yRandomAngle, this.yRandomAngle), v377.z);
    }
    if (v378 > 0) {
      this.entity.parent.addChild(v372);
      if (v372.rigidbody) {
        v372.rigidbody.teleport(v376);
      } else {
        v372.setPosition(v376);
      }
    }
  }
};
StackCreator.getStackColor = function () {
  Sliceable.innerMatId++;
  if (Sliceable.innerMatId >= Game.instance.innerMat.length) {
    Sliceable.innerMatId = 0;
  }
  return Game.instance.innerMat[Sliceable.innerMatId];
};
StackCreator.prototype.update = function (p470) {};
var Effect3ddrop = pc.createScript("effect3ddrop");
Effect3ddrop.grav = new pc.Vec3(0, -15, 0);
Effect3ddrop.temp = new pc.Vec3(0, 0, 0);
Effect3ddrop.create = function (p471, p472) {
  var v379 = ObjectPool.instantiate("Effect3DDrop", p471, Game.instance.app.root);
  v379.render.meshInstances[0].material = p472;
  v379.render.meshInstances[0].material.update();
  return v379;
};
Effect3ddrop.prototype.initialize = function () {
  this.vel = new pc.Vec3(0, 0, 0);
  this.damping = 0.01;
  this.size = 1;
  this.material = this.entity.render.meshInstances[0].material;
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
Effect3ddrop.prototype.onEnable = function () {
  this.vel = new pc.Vec3(pc.math.random(-4, 4), pc.math.random(3, 8), pc.math.random(-4, 4));
  this.size = pc.math.random(0.15, 0.3);
};
Effect3ddrop.prototype.update = function (p473) {
  Effect3ddrop.temp.copy(Effect3ddrop.grav);
  Effect3ddrop.temp.scale(p473);
  this.vel.add(Effect3ddrop.temp);
  this.vel.scale(1 - this.damping * p473);
  Effect3ddrop.temp.copy(this.vel);
  Effect3ddrop.temp.scale(p473);
  this.entity.translate(Effect3ddrop.temp);
  var v380 = this.entity.getPosition();
  v380.add(this.vel);
  this.entity.lookAt(v380);
  this.size -= p473 * 0.3;
  if (this.size <= 0) {
    ObjectPool.push(this.entity);
  } else {
    var v381 = pc.math.clamp(this.vel.length() / 10, 1, 4);
    this.entity.setLocalScale(this.size, this.size, this.size * v381);
  }
};
var PhysScaler = pc.createScript("physScaler");
PhysScaler.attributes.add("initialScale", {
  type: "vec3",
  default: [0, 0, 0]
});
PhysScaler.attributes.add("initialHalfExtents", {
  type: "vec3",
  default: [0, 0, 0]
});
PhysScaler.attributes.add("initialRadius", {
  type: "number",
  default: 0
});
PhysScaler.attributes.add("initialHeight", {
  type: "number",
  default: 0
});
PhysScaler.attributes.add("initialPolyRadius", {
  type: "number",
  default: 0
});
PhysScaler.tempVec = new pc.Vec3();
PhysScaler.prototype.init = function () {
  var v382 = this.entity.getLocalScale();
  PhysScaler.tempVec.copy(v382);
  PhysScaler.tempVec.div(this.initialScale);
  var v383 = Math.max(PhysScaler.tempVec.x, PhysScaler.tempVec.y, PhysScaler.tempVec.z);
  var v384 = this.entity.collision;
  if (v384) {
    if (v384.type == "box") {
      PhysScaler.tempVec.mul(this.initialHalfExtents);
      v384.halfExtents = PhysScaler.tempVec.clone();
    } else if (v384.type == "sphere") {
      v384.radius = v383 * this.initialRadius;
    } else if (v384.type == "cylinder") {
      v384.radius = PhysScaler.tempVec.x * this.initialRadius;
      v384.height = PhysScaler.tempVec.y * this.initialHeight;
    }
  }
  var v385 = this.entity.script.polygon;
  if (v385 && v385.isCircle) {
    v385.radius = v383 * this.initialPolyRadius;
  }
  this.entity.script.destroy("physScaler");
};
var GameText = pc.createScript("gameText");
GameText.attributes.add("glow", {
  type: "entity"
});
GameText.prototype.initialize = function () {
  this.hideDelay = 1;
  this.fadeOpacity = !1;
};
GameText.prototype.animate = function (p474, p475 = 1, p476 = 0) {
  this.hideAnimType = p474;
  this.time = 0;
  this.state = 1;
  this.appearTime = 0.3;
  this.showTime = 0.55;
  this.hideTime = 0.2;
  this.fadeOpacity = !0;
  this.scaleMax = p475;
  this.entity.element.opacity = 1;
  this.entity.setLocalScale(1, 1, 1);
};
GameText.prototype.update = function (p477) {
  var v386;
  this.time += p477;
  if (this.state == 1) {
    if ((v386 = this.time / this.appearTime) >= 1) {
      v386 = 1;
      this.state = 2;
      this.time = 0;
    }
    if (this.hideAnimType == 2) {
      this.entity.translateLocal(0, p477 * -500, 0);
      this.entity.element.opacity = v386;
      v386 = this.scaleMax;
      this.entity.setLocalScale(v386, v386, v386);
    } else {
      v386 *= this.scaleMax;
      this.entity.setLocalScale(v386, v386, v386);
    }
  }
  if (this.state == 2) {
    if ((v386 = this.time / this.showTime) >= 1) {
      v386 = 1;
      this.state = 3;
      this.time = 0;
    }
    if (this.hideAnimType == 1) {
      this.entity.translateLocal(0, p477 * 50, 0);
    } else {
      v386 = this.scaleMax + v386 * 0.1;
      this.entity.setLocalScale(v386, v386, v386);
      this.entity.translateLocal(0, p477 * -50, 0);
    }
  }
  if (this.state == 3) {
    if ((v386 = 1 - this.time / this.hideTime) <= 0) {
      v386 = 0;
      ObjectPool.push(this.entity);
    }
    if (this.hideAnimType == 1) {
      this.entity.element.opacity = v386;
      this.entity.translateLocal(0, p477 * 400, 0);
    } else {
      this.entity.element.opacity = v386;
    }
  }
};
var FinishController = pc.createScript("finishController");
var vO141 = {
  type: "entity",
  array: !0
};
FinishController.attributes.add("blocks", vO141);
FinishController.attributes.add("textEntity", {
  type: "entity"
});
FinishController.attributes.add("lastBlock", {
  type: "entity"
});
FinishController.attributes.add("flag", {
  type: "entity"
});
FinishController.instance = null;
FinishController.blockData = [];
FinishController.prototype.setBestBlockType = function () {
  for (var v387, v388, vLN058 = 0; vLN058 < FinishController.blockData.length && (v387 = FinishController.blockData[vLN058]).count != 50; vLN058++);
  var v389;
  var v390;
  var v391 = FinishController.blockData[0].blockType;
  var v392 = this.applyOperatorData(100, v391);
  v388 = FinishController.blockData[0];
  for (vLN058 = 1; vLN058 < FinishController.blockData.length; vLN058++) {
    v390 = FinishController.blockData[vLN058].blockType;
    if ((v389 = this.applyOperatorData(100, v390)) > v392) {
      v392 = v389;
      v391 = v390;
      v388 = FinishController.blockData[vLN058];
    }
  }
  v390 = v387.blockType;
  v387.blockType = v388.blockType;
  v388.blockType = v390;
};
FinishController.prototype.placeBlocks2 = function (p478) {
  var v393;
  var v394;
  var v395;
  var v396;
  this.flag.enabled = !1;
  this.generateRandomBlockData();
  var v397;
  var v398;
  var vLN059 = 0;
  for (var vLN060 = 0; vLN060 < this.blocks.length; vLN060++) {
    v396 = this.blocks[vLN060];
    for (var vLN061 = 0; vLN061 < FinishController.blockData.length; vLN061++) {
      if ((v393 = FinishController.blockData[vLN061]).count == 2) {
        v393.entity;
      }
      if (v396 == v393.entity) {
        v393.blockType = this.blockTypes[vLN059];
        vLN059++;
      }
    }
  }
  MathUtil.shuffleArray(FinishController.blockData);
  (v394 = this.blocks[0].getLocalPosition().clone()).y = 0;
  v395 = this.textEntity.getLocalPosition().clone();
  for (vLN061 = 0; vLN061 < FinishController.blockData.length; vLN061++) {
    v398 = (v393 = FinishController.blockData[vLN061]).blockType;
    if (v393.count == 50) {
      v397 = v393;
    }
    v393.text.element.text = v398.text;
    v394.y += v393.sizeY * 0.5;
    v393.entity.setLocalPosition(v394.x, v394.y, v394.z);
    v393.text.setLocalPosition(v395.x, v394.y, v395.z);
    v394.y += v393.sizeY * 0.5;
  }
  if (p478) {
    v397.text.element.text = "BONUS!";
    v397.text.script.scaler.enabled = true;
  } else {
    v397.text.script.scaler.enabled = false;
    v397.text.setLocalScale(0.01, 0.01, 0.01);
  }
  v394.y += this.lastBlockSizeY * 0.5;
  this.lastBlock.setLocalPosition(v394.x, v394.y, v394.z);
};
var OperatorType = {
  ADD: {
    symbol: "+",
    maxCount: 500,
    minCount: 10
  },
  SUBTRACT: {
    symbol: "-",
    maxCount: 100,
    minCount: 5
  },
  MULTIPLY: {
    symbol: "x",
    maxCount: 10,
    minCount: 2
  },
  DIVIDE: {
    symbol: "÷",
    maxCount: 10,
    minCount: 2
  }
};
FinishController.prototype.generateRandomBlockData = function () {
  this.blockTypes = [];
  this.blockTypes.push(this.createBlock(OperatorType.MULTIPLY));
  this.blockTypes.push(this.createBlock(OperatorType.ADD));
  this.blockTypes.push(this.createBlock(OperatorType.MULTIPLY));
  this.blockTypes.push(this.createBlock(OperatorType.ADD));
  var v399;
  var v400 = this.getRandomNegativeOperator();
  v399 = Math.random() > 0.6 ? (OperatorType.SUBTRACT, OperatorType.DIVIDE) : this.getRandomPositiveOperator();
  this.blockTypes.push(this.createBlock(v400));
  this.blockTypes.push(this.createBlock(v399));
  this.blockTypes.sort((p479, p480) => p479.weight - p480.weight);
};
FinishController.prototype.getRandomPositiveOperator = function () {
  var vA8 = [OperatorType.ADD, OperatorType.MULTIPLY];
  return vA8[Math.floor(Math.random() * vA8.length)];
};
FinishController.prototype.getRandomNegativeOperator = function () {
  var vA9 = [OperatorType.SUBTRACT, OperatorType.DIVIDE];
  return vA9[Math.floor(Math.random() * vA9.length)];
};
FinishController.prototype.getRandomOperator = function () {
  var vA10 = [OperatorType.ADD, OperatorType.SUBTRACT, OperatorType.MULTIPLY, OperatorType.DIVIDE];
  return vA10[Math.floor(Math.random() * vA10.length)];
};
FinishController.prototype.createBlock = function (p481) {
  var v401 = p481.maxCount;
  var v402 = this.getRandomCount(v401, p481.minCount);
  if (p481 == OperatorType.ADD && Math.random() < 0.8) {
    v402 = this.getRandomCount(10, 100);
  }
  var v403 = this.beautifyNumber(v402);
  var vO150 = {
    text: this.generateBlockText(v403, p481),
    value: v403,
    operator: p481,
    weight: 100
  };
  vO150.weight = this.applyOperatorData(100, vO150);
  return vO150;
};
FinishController.prototype.getRandomCount = function (p482, p483) {
  return Math.floor(Math.random() * (p482 - p483)) + 1 + p483;
};
FinishController.prototype.beautifyNumber = function (p484, p485) {
  var vP484 = p484;
  if (p484 < 5) {
    vP484 = Math.max(p484, 2);
    if (p485 == OperatorType.ADD || p485 == OperatorType.SUBTRACT) {
      vP484 = 5;
    }
  } else if (p484 <= 10) {
    vP484 = p485 == OperatorType.ADD || p485 == OperatorType.SUBTRACT ? [5, 10][Math.floor(Math.random() * 2)] : p484;
  } else if (p484 <= 100) {
    var v404 = (v405 = [10, 5])[Math.floor(Math.random() * v405.length)];
    vP484 = Math.floor(p484 / v404) * v404;
  } else if (p484 <= 500) {
    var v405;
    v404 = (v405 = [5, 10])[Math.floor(Math.random() * v405.length)];
    vP484 = Math.floor(p484 / v404) * v404;
  }
  return vP484;
};
FinishController.prototype.applyOperatorData = function (p486, p487) {
  var vP486 = p486;
  if (p487.operator == OperatorType.MULTIPLY) {
    vP486 *= p487.value;
  } else if (p487.operator == OperatorType.DIVIDE) {
    vP486 /= p487.value;
  } else if (p487.operator == OperatorType.ADD) {
    vP486 += p487.value;
  } else if (p487.operator == OperatorType.SUBTRACT) {
    vP486 -= p487.value;
  }
  return Math.round(vP486);
};
FinishController.prototype.generateBlockText = function (p488, p489) {
  var vLS3 = "";
  if (p489 == OperatorType.MULTIPLY) {
    vLS3 = "x " + p488.toString();
  } else if (p489 == OperatorType.DIVIDE) {
    vLS3 = "÷ " + p488.toString();
  } else if (p489 == OperatorType.ADD) {
    vLS3 = "+ " + p488.toString();
  } else if (p489 == OperatorType.SUBTRACT) {
    vLS3 = "- " + p488.toString();
  }
  return vLS3;
};
FinishController.prototype.initialize = function () {
  FinishController.instance = this;
  var v406;
  var v407;
  var vA11 = [2, 3, 5, 10, 25, 50];
  for (var vLN062 = 0; vLN062 < this.blocks.length; vLN062++) {
    (v406 = this.textEntity.clone()).element.text = vA11[vLN062].toString() + " x";
    this.entity.addChild(v406);
    v407 = this.blocks[vLN062].getLocalScale().y;
    FinishController.blockData.push({
      text: v406,
      count: vA11[vLN062],
      entity: this.blocks[vLN062],
      sizeY: v407,
      blockType: {}
    });
  }
  this.textEntity.enabled = !1;
  this.lastBlockSizeY = this.lastBlock.getLocalScale().y;
  this.placeBlocks();
};
FinishController.prototype.getBlockData = function (p490) {
  var v408;
  for (var vLN063 = 0; vLN063 < FinishController.blockData.length; vLN063++) {
    if ((v408 = FinishController.blockData[vLN063]).entity == p490) {
      return v408;
    }
  }
  return null;
};
FinishController.prototype.getBlockOperator = function (p491) {
  var v409;
  for (var vLN064 = 0; vLN064 < FinishController.blockData.length; vLN064++) {
    if ((v409 = FinishController.blockData[vLN064]).entity == p491) {
      return v409.blockType;
    }
  }
  return null;
};
FinishController.prototype.placeBlocks = function (p492) {
  var v410;
  var v411;
  var v412;
  var v413;
  this.flag.enabled = !1;
  MathUtil.shuffleArray(FinishController.blockData);
  (v411 = this.blocks[0].getLocalPosition().clone()).y = 0;
  v412 = this.textEntity.getLocalPosition().clone();
  for (var vLN065 = 0; vLN065 < FinishController.blockData.length; vLN065++) {
    if ((v410 = FinishController.blockData[vLN065]).count == 50) {
      v413 = v410;
    }
    v411.y += v410.sizeY * 0.5;
    v410.entity.setLocalPosition(v411.x, v411.y, v411.z);
    v410.text.setLocalPosition(v412.x, v411.y, v412.z);
    v411.y += v410.sizeY * 0.5;
  }
  if (p492) {
    v413.text.element.text = "BONUS!";
    v413.text.script.scaler.enabled = true;
  } else {
    v413.text.element.text = "50 x";
    v413.text.script.scaler.enabled = false;
    v413.text.setLocalScale(0.01, 0.01, 0.01);
  }
  v411.y += this.lastBlockSizeY * 0.5;
  this.lastBlock.setLocalPosition(v411.x, v411.y, v411.z);
};
FinishController.prototype.update = function (p493) {};
FinishController.prototype.showFlag = function () {
  setTimeout(function () {
    GameAudio.play("cracker");
    var v414 = FinishController.instance.entity.getPosition();
    for (var vLN066 = 0; vLN066 < 59; vLN066++) {
      Serpantine.create(v414);
    }
  }, 500);
  this.flag.setEulerAngles(0, 0, 90);
  this.flag.enabled = !0;
  this.flag.tween(this.flag.getLocalEulerAngles()).rotate({
    x: 0,
    y: 0,
    z: 0
  }, 0.75, pc.BounceOut).loop(!1).yoyo(!1).start();
};
var MaterialBlinker = pc.createScript("materialBlinker");
MaterialBlinker.prototype.initialize = function () {
  var v415;
  var v416;
  var v417;
  this.meshInstances = this.entity.model ? this.entity.model.meshInstances : this.entity.render.meshInstances;
  this.mats = [];
  this.matsB = [];
  this.blinkAlpha = 0;
  this.blinkSpeed = 1;
  this.blinkTarget = 1;
  this.blinkCount = 0;
  this.blinkColor = new pc.Color().fromString("#FFFFFF");
  for (var vLN067 = 0; vLN067 < this.meshInstances.length; vLN067++) {
    v416 = (v415 = this.meshInstances[vLN067]).material;
    this.mats.push(v416);
    v417 = v416.clone();
    this.matsB.push(v417);
    v415.material = v417;
  }
};
MaterialBlinker.prototype.start = function (p494, p495) {
  this.blinkSpeed = p494;
  this.blinkCount = p495;
};
MaterialBlinker.prototype.update = function (p496) {
  if (this.blinkCount == 0) {
    return 1;
  }
  var v418;
  var v419;
  this.blinkAlpha += this.blinkSpeed * p496;
  if (this.blinkSpeed > 0 && this.blinkAlpha >= this.blinkTarget) {
    this.blinkSpeed = -this.blinkSpeed;
    this.blinkAlpha = this.blinkTarget;
  } else if (this.blinkSpeed < 0 && this.blinkAlpha < 0) {
    this.blinkSpeed = -this.blinkSpeed;
    this.blinkAlpha = 0;
    if (this.blinkCount > 0) {
      this.blinkCount--;
    }
    if (this.blinkCount <= 0) {
      this.blinkCount = 0;
    }
  }
  for (var vLN068 = 0; vLN068 < this.matsB.length; vLN068++) {
    v418 = this.matsB[vLN068];
    v419 = this.mats[vLN068];
    v418.emissive.lerp(v419.emissive, this.blinkColor, this.blinkAlpha);
    v418.update();
  }
};
var Environment = pc.createScript("environment");
var vO152 = {
  type: "entity",
  array: !0
};
var vO153 = {
  type: "entity",
  array: !0
};
var vO154 = {
  type: "rgba",
  array: !0
};
var vO155 = {
  type: "entity",
  array: !0
};
var vO156 = {
  type: "entity",
  array: !0
};
Environment.instance = null;
Environment.attributes.add("grounds", vO152);
Environment.attributes.add("lights", vO153);
Environment.attributes.add("fogColors", vO154);
Environment.attributes.add("backgrounds", vO155);
Environment.attributes.add("environments", vO156);
Environment.attributes.add("snow", {
  type: "entity"
});
Environment.prototype.initialize = function () {
  Environment.instance = this;
  this.type = 0;
  this.groundsAr = [];
  this.groundsCount = 0;
  this.groundsId = 0;
  this.groundLastPos = new pc.Vec3(0, 0, 0);
  this.envTypes = [1, 3, 4, 5];
  this.envId = 0;
  EntityTools.enableSingleInArray(this.grounds, -1);
};
Environment.prototype.setType = function (p497) {
  this.type = p497;
  this.snow.enabled = !1;
  if (this.type == 1) {
    this.groundsId = 0;
    EntityTools.enableSingleInArray(this.backgrounds, 0);
    EntityTools.enableSingleInArray(this.environments, 0);
    EntityTools.enableSingleInArray(this.lights, 0);
    this.app.scene.fogColor = this.fogColors[0];
    this.app.scene.fogStart = 50;
  } else if (this.type == 2) {
    this.groundsId = 0;
    EntityTools.enableSingleInArray(this.backgrounds, 1);
    EntityTools.enableSingleInArray(this.environments, 0);
    EntityTools.enableSingleInArray(this.lights, 1);
    this.app.scene.fogColor = this.fogColors[1];
    this.app.scene.fogStart = 500;
  } else if (this.type == 3) {
    this.groundsId = 1;
    EntityTools.enableSingleInArray(this.backgrounds, 2);
    EntityTools.enableSingleInArray(this.environments, 1);
    EntityTools.enableSingleInArray(this.lights, 0);
    this.app.scene.fogColor = this.fogColors[2];
    this.app.scene.fogStart = 100;
  } else if (this.type == 4) {
    this.groundsId = 2;
    EntityTools.enableSingleInArray(this.backgrounds, 0);
    EntityTools.enableSingleInArray(this.environments, 2);
    EntityTools.enableSingleInArray(this.lights, 0);
    this.app.scene.fogColor = this.fogColors[4];
    this.app.scene.fogStart = 150;
    this.snow.enabled = true;
  } else if (this.type == 5) {
    this.groundsId = 3;
    EntityTools.enableSingleInArray(this.backgrounds, 1);
    EntityTools.enableSingleInArray(this.environments, 3);
    EntityTools.enableSingleInArray(this.lights, 0);
    this.app.scene.fogColor = this.fogColors[3];
    this.app.scene.fogStart = 200;
    this.snow.enabled = false;
  } else if (this.type == 6) {
    this.groundsId = 4;
    EntityTools.enableSingleInArray(this.backgrounds, 3);
    EntityTools.enableSingleInArray(this.environments, 4);
    EntityTools.enableSingleInArray(this.lights, 0);
    this.app.scene.fogColor = this.fogColors[4];
    this.app.scene.fogStart = 200;
    this.snow.enabled = false;
  }
  if (this.type == 6) {
    GameAudio.switchLoopSound("loopSound2");
  } else {
    GameAudio.switchLoopSound("loopSound");
  }
  if (Game.debugOutput) {
    console.log("env switch : ", this.type);
  }
};
Environment.prototype.createGrounds = function () {
  this.clearGrounds();
  this.groundLastPos.set(-25, 0, 0);
  while (Game.instance.lastPos.x + 60 > this.groundLastPos.x) {
    var v420 = this.grounds[this.groundsId].clone();
    var v421 = v420.findByName("Start");
    var v422 = v421.getLocalPosition();
    v421.enabled = false;
    this.entity.addChild(v420);
    v420.setPosition(this.groundLastPos.x - v422.x, this.groundLastPos.y - v422.y, 0);
    v420.enabled = true;
    var v423 = v420.findByName("End");
    var v424 = v423.getPosition();
    this.groundLastPos.copy(v424);
    v423.enabled = false;
    var v425 = v420.findByName("Floor");
    if (v425.script && v425.script.physScaler) {
      v425.script.physScaler.init();
    }
    this.groundsAr.push(v420);
    this.groundsCount++;
  }
};
Environment.prototype.clearGrounds = function () {
  var v426;
  for (var v427 = this.groundsAr.length - 1; v427 >= 0; v427--) {
    v426 = this.groundsAr[v427];
    this.entity.removeChild(v426);
    v426.destroy();
  }
  this.groundsAr = [];
};
Environment.prototype.switchTo = function (p498) {
  this.setType(p498);
  MathUtil.shuffleArray(this.envTypes);
  for (var vLN069 = 0; vLN069 < this.envTypes.length; vLN069++) {
    e = this.envTypes[vLN069];
    if (e == p498) {
      this.envId = vLN069;
      return;
    }
  }
};
Environment.prototype.switchType = function () {
  var v428;
  var v429 = this.envTypes[this.envId];
  this.envId++;
  if (this.envId >= this.envTypes.length) {
    this.envId = 0;
    MathUtil.shuffleArray(this.envTypes);
    if ((v428 = this.envTypes[this.envId]) == v429) {
      this.envTypes[0] = this.envTypes[this.envTypes.length - 1];
      this.envTypes[this.envTypes.length - 1] = v428;
    }
  }
  this.setType(this.envTypes[this.envId]);
};
Environment.prototype.update = function (p499) {
  if (!Game.noDebug) {
    if (this.app.keyboard.wasPressed(pc.KEY_B)) {
      FadeScreen.instance.show(0.3, 0, 0, function () {
        Environment.instance.switchType();
        Game.instance.restart();
      });
    }
  }
};
var Serpantine = pc.createScript("serpantine");
var vO158 = {
  type: "rgba",
  array: !0
};
Serpantine.attributes.add("serpColors", vO158);
Serpantine.create = function (p500) {
  var v430 = ObjectPool.instantiate("Serp", p500, Game.instance.app.root);
  var v431 = v430.script.serpantine;
  if (!v431.initialized) {
    v431.initialize();
  }
  return v430;
};
Serpantine.prototype.onEnable = function () {
  this.time = 0;
  this.gos.impulse2(pc.math.random(-10, 10), pc.math.random(5, 15), pc.math.random(-10, 10), 550);
  this.entity.sprite.color = this.serpColors[MathUtil.getRandomInt(this.serpColors.length)];
  var v432 = pc.math.random(0.1, 0.2);
  this.entity.setLocalScale(v432, v432, v432);
};
Serpantine.prototype.initialize = function () {
  if (this.initialized) {
    return 1;
  }
  this.initialized = !0;
  this.gos = this.entity.script.gravityObject;
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
Serpantine.prototype.update = function (p501) {
  this.time += p501;
  if (this.time > 5) {
    ObjectPool.push(this.entity);
  }
};
var GravityObject = pc.createScript("gravityObject");
GravityObject.tmp = new pc.Vec3();
GravityObject.tmp2 = new pc.Vec3();
GravityObject.prototype.initialize = function () {
  if (this.initialized) {
    return 1;
  }
  this.gravity = -10;
  this._vel = new pc.Vec3(0, 0, 0);
  this._acc = new pc.Vec3(0, this.gravity, 0);
  this.rotSpeed = new pc.Vec3(0, 0, 0);
  this.falling = !0;
  this.delay = 0;
  this.bottomDestroyPlank = -3;
  this.initialized = !0;
};
GravityObject.prototype.impulse = function (p502, p503, p504) {
  var v433 = p502 * MathUtil.DEG_TO_RAD;
  this._vel.x = Math.cos(v433) * p503;
  this._vel.y = Math.sin(v433) * p503;
  this._vel.z = 0;
  this.rotSpeed.set(pc.math.random(-p504, p504), pc.math.random(-p504, p504), pc.math.random(-p504, p504));
};
GravityObject.prototype.impulse2 = function (p505, p506, p507, p508) {
  this._vel.x = p505;
  this._vel.y = p506;
  this._vel.z = p507;
  this.rotSpeed.set(pc.math.random(-p508, p508), pc.math.random(-p508, p508), pc.math.random(-p508, p508));
};
GravityObject.prototype.update = function (p509) {
  if (this.falling) {
    if (this.delay > 0) {
      this.delay -= p509;
      this.delay;
      return 0;
    }
    this._acc.y = this.gravity;
    var v434 = this.entity.getPosition();
    GravityObject.tmp2.copy(this._acc).scale(p509 * Game.instance.slomo);
    this._vel.add(GravityObject.tmp2);
    GravityObject.tmp2.copy(this._vel).scale(p509 * Game.instance.slomo);
    v434.add(GravityObject.tmp2);
    this.entity.setPosition(v434);
    this.entity.rotateLocal(this.rotSpeed.x * p509 * Game.instance.slomo, this.rotSpeed.y * p509 * Game.instance.slomo, this.rotSpeed.z * p509 * Game.instance.slomo);
    if (v434.y <= this.bottomDestroyPlank) {
      this.entity.destroy();
    }
  }
};
var Jumper = pc.createScript("jumper");
Jumper.attributes.add("delayStart", {
  type: "number",
  default: 0
});
Jumper.attributes.add("delayRepeat", {
  type: "number",
  default: 1
});
Jumper.attributes.add("jumpForce", {
  type: "number",
  default: 5
});
Jumper.attributes.add("jumpSpeed", {
  type: "number",
  default: 0.8
});
Jumper.attributes.add("bounceKoef", {
  type: "number",
  default: 0.8
});
Jumper.tmp = new pc.Vec3();
Jumper.prototype.initialize = function () {
  this.startPos = this.entity.getLocalPosition().clone();
  this.startSc = this.entity.getLocalScale().clone();
  this.scaleZ = 1;
  this.scaleZVel = 0;
  this.gravity = -70;
  this._vel = new pc.Vec3(0, 0, 0);
  this._acc = new pc.Vec3(0, this.gravity, 0);
  this.rotSpeed = new pc.Vec3(0, 0, 0);
  this._delay = this.delayStart;
  this.jumping = !1;
  this.jump();
};
Jumper.prototype.update = function (p510) {
  if (Game.instance.paused) {
    return 1;
  }
  this.scaleZVel += (1 - this.scaleZ) * p510;
  this.scaleZVel += p510 * 0.5;
  this.scaleZ += this.scaleZVel;
  this.scaleZVel *= 1 - p510;
  this.scaleZ = pc.math.clamp(this.scaleZ, 0.7, 1.05);
  var v435 = 1 / this.scaleZ;
  v435 = pc.math.clamp(v435, 0.6, 1.4);
  this.entity.setLocalScale(this.startSc.x * v435, this.startSc.y * this.scaleZ, this.startSc.z * v435);
  var v436 = this.entity.getLocalPosition();
  if (this._delay > 0) {
    this._delay -= p510;
  }
  Jumper.tmp.copy(this._acc).scale(p510 * this.jumpSpeed * Game.instance.slomo);
  this._vel.add(Jumper.tmp);
  Jumper.tmp.copy(this._vel).scale(p510 * this.jumpSpeed * Game.instance.slomo);
  v436.add(Jumper.tmp);
  if (v436.y <= this.startPos.y) {
    v436.y = this.startPos.y;
    this._vel.y = 0;
    if (this.jumping) {
      this.jumping = false;
      this.scaleZ = 1;
      this.scaleZVel = this.bounceKoef * -0.1;
    }
    this.jump();
  }
  this.entity.setLocalPosition(v436);
};
Jumper.prototype.jump = function () {
  if (this._delay > 0) {
    return 0;
  }
  this._delay = this.delayRepeat;
  this.jumping = !0;
  this._vel.set(0, this.jumpForce, 0);
};
if (typeof document != "undefined") {
  (function (p511, p512) {
    function f67(p513, p514) {
      for (var v437 in p514) {
        try {
          p513.style[v437] = p514[v437];
        } catch (e7) {}
      }
      return p513;
    }
    function f68(p515) {
      if (p515 == null) {
        return String(p515);
      } else if (typeof p515 == "object" || typeof p515 == "function") {
        return Object.prototype.toString.call(p515).match(/\s([a-z]+)/i)[1].toLowerCase() || "object";
      } else {
        return typeof p515;
      }
    }
    function f69(p516, p517) {
      if (f68(p517) !== "array") {
        return -1;
      }
      if (p517.indexOf) {
        return p517.indexOf(p516);
      }
      for (var vLN070 = 0, v438 = p517.length; vLN070 < v438; vLN070++) {
        if (p517[vLN070] === p516) {
          return vLN070;
        }
      }
      return -1;
    }
    function f70() {
      var v439;
      var vArguments = arguments;
      for (v439 in vArguments[1]) {
        if (vArguments[1].hasOwnProperty(v439)) {
          switch (f68(vArguments[1][v439])) {
            case "object":
              vArguments[0][v439] = f70({}, vArguments[0][v439], vArguments[1][v439]);
              break;
            case "array":
              vArguments[0][v439] = vArguments[1][v439].slice(0);
              break;
            default:
              vArguments[0][v439] = vArguments[1][v439];
          }
        }
      }
      if (vArguments.length > 2) {
        return f70.apply(null, [vArguments[0]].concat(Array.prototype.slice.call(vArguments, 2)));
      } else {
        return vArguments[0];
      }
    }
    function f71(p518) {
      if ((p518 = Math.round(p518 * 255).toString(16)).length === 1) {
        return "0" + p518;
      } else {
        return p518;
      }
    }
    function f72(p519, p520, p521, p522) {
      if (p519.addEventListener) {
        p519[p522 ? "removeEventListener" : "addEventListener"](p520, p521, false);
      } else if (p519.attachEvent) {
        p519[p522 ? "detachEvent" : "attachEvent"]("on" + p520, p521);
      }
    }
    function f73(p523, p524) {
      function f74(p525, p526, p527, p528) {
        return v448[p525 | 0][Math.round(Math.min((p526 - p527) / (p528 - p527) * vLN100, vLN100))];
      }
      function f75() {
        if (vO164.legend.fps !== v458) {
          vO164.legend.fps = v458;
          vO164.legend[v465] = v458 ? "FPS" : "ms";
        }
        v453 = v458 ? vThis4.fps : vThis4.duration;
        vO164.count[v465] = v453 > 999 ? "999+" : v453.toFixed(v453 > 99 ? 0 : vF70.decimals);
      }
      function f76() {
        v449 = v459();
        if (v457 < v449 - vF70.threshold) {
          vThis4.fps -= vThis4.fps / Math.max(1, vF70.smoothing * 60 / vF70.interval);
          vThis4.duration = 1000 / vThis4.fps;
        }
        v454 = vF70.history;
        while (v454--) {
          vA14[v454] = v454 === 0 ? vThis4.fps : vA14[v454 - 1];
          vA15[v454] = v454 === 0 ? vThis4.duration : vA15[v454 - 1];
        }
        f75();
        if (vF70.heat) {
          if (vA13.length) {
            for (v454 = vA13.length; v454--;) {
              vA13[v454].el.style[v447[vA13[v454].name].heatOn] = v458 ? f74(v447[vA13[v454].name].heatmap, vThis4.fps, 0, vF70.maxFps) : f74(v447[vA13[v454].name].heatmap, vThis4.duration, vF70.threshold, 0);
            }
          }
          if (vO164.graph && v447.column.heatOn) {
            for (v454 = vA12.length; v454--;) {
              vA12[v454].style[v447.column.heatOn] = v458 ? f74(v447.column.heatmap, vA14[v454], 0, vF70.maxFps) : f74(v447.column.heatmap, vA15[v454], vF70.threshold, 0);
            }
          }
        }
        if (vO164.graph) {
          for (v455 = 0; v455 < vF70.history; v455++) {
            vA12[v455].style.height = (v458 ? vA14[v455] ? Math.round(v452 / vF70.maxFps * Math.min(vA14[v455], vF70.maxFps)) : 0 : vA15[v455] ? Math.round(v452 / vF70.threshold * Math.min(vA15[v455], vF70.threshold)) : 0) + "px";
          }
        }
      }
      function f77() {
        if (vF70.interval < 20) {
          v450 = v462(f77);
          f76();
        } else {
          v450 = setTimeout(f77, vF70.interval);
          v451 = v462(f76);
        }
      }
      function f78(p529) {
        if ((p529 = p529 || window.event).preventDefault) {
          p529.preventDefault();
          p529.stopPropagation();
        } else {
          p529.returnValue = false;
          p529.cancelBubble = true;
        }
        vThis4.toggle();
      }
      function f79() {
        if (vF70.toggleOn) {
          f72(vO164.container, vF70.toggleOn, f78, 1);
        }
        p523.removeChild(vO164.container);
      }
      function f80() {
        if (vO164.container) {
          f79();
        }
        v447 = f73.theme[vF70.theme];
        if (!(v448 = v447.compiledHeatmaps || []).length && v447.heatmaps.length) {
          for (v455 = 0; v455 < v447.heatmaps.length; v455++) {
            v448[v455] = [];
            v454 = 0;
            for (; v454 <= vLN100; v454++) {
              var v440;
              var v441 = v448[v455];
              var v_0x28447e = v454;
              v440 = 0.33 / vLN100 * v454;
              var v442 = v447.heatmaps[v455].saturation;
              var v443 = v447.heatmaps[v455].lightness;
              var vUndefined = undefined;
              var vUndefined2 = undefined;
              var vUndefined3 = undefined;
              var v444 = vUndefined3 = undefined;
              var v445 = vUndefined = vUndefined2 = undefined;
              v445 = undefined;
              if ((vUndefined3 = v443 <= 0.5 ? v443 * (1 + v442) : v443 + v442 - v443 * v442) === 0) {
                v440 = "#000";
              } else {
                vUndefined2 = (vUndefined3 - (v444 = v443 * 2 - vUndefined3)) / vUndefined3;
                v445 = (v440 *= 6) - (vUndefined = Math.floor(v440));
                v445 *= vUndefined3 * vUndefined2;
                if (vUndefined === 0 || vUndefined === 6) {
                  vUndefined = vUndefined3;
                  vUndefined2 = v444 + v445;
                  vUndefined3 = v444;
                } else if (vUndefined === 1) {
                  vUndefined = vUndefined3 - v445;
                  vUndefined2 = vUndefined3;
                  vUndefined3 = v444;
                } else if (vUndefined === 2) {
                  vUndefined = v444;
                  vUndefined2 = vUndefined3;
                  vUndefined3 = v444 + v445;
                } else if (vUndefined === 3) {
                  vUndefined = v444;
                  vUndefined2 = vUndefined3 - v445;
                } else if (vUndefined === 4) {
                  vUndefined = v444 + v445;
                  vUndefined2 = v444;
                } else {
                  vUndefined = vUndefined3;
                  vUndefined2 = v444;
                  vUndefined3 -= v445;
                }
                v440 = "#" + f71(vUndefined) + f71(vUndefined2) + f71(vUndefined3);
              }
              v441[v_0x28447e] = v440;
            }
          }
          v447.compiledHeatmaps = v448;
        }
        vO164.container = f67(document.createElement("div"), v447.container);
        vO164.count = vO164.container.appendChild(f67(document.createElement("div"), v447.count));
        vO164.legend = vO164.container.appendChild(f67(document.createElement("div"), v447.legend));
        vO164.graph = vF70.graph ? vO164.container.appendChild(f67(document.createElement("div"), v447.graph)) : 0;
        vA13.length = 0;
        for (var v446 in vO164) {
          if (vO164[v446] && v447[v446].heatOn) {
            vA13.push({
              name: v446,
              el: vO164[v446]
            });
          }
        }
        vA12.length = 0;
        if (vO164.graph) {
          vO164.graph.style.width = vF70.history * v447.column.width + (vF70.history - 1) * v447.column.spacing + "px";
          v454 = 0;
          for (; v454 < vF70.history; v454++) {
            vA12[v454] = vO164.graph.appendChild(f67(document.createElement("div"), v447.column));
            vA12[v454].style.position = "absolute";
            vA12[v454].style.bottom = 0;
            vA12[v454].style.right = v454 * v447.column.width + v454 * v447.column.spacing + "px";
            vA12[v454].style.width = v447.column.width + "px";
            vA12[v454].style.height = "0px";
          }
        }
        f67(vO164.container, vF70);
        f75();
        p523.appendChild(vO164.container);
        if (vO164.graph) {
          v452 = vO164.graph.clientHeight;
        }
        if (vF70.toggleOn) {
          if (vF70.toggleOn === "click") {
            vO164.container.style.cursor = "pointer";
          }
          f72(vO164.container, vF70.toggleOn, f78);
        }
      }
      if (f68(p523) === "object" && p523.nodeType === undefined) {
        p524 = p523;
        p523 = document.body;
      }
      p523 ||= document.body;
      var v447;
      var v448;
      var v449;
      var v450;
      var v451;
      var v452;
      var v453;
      var v454;
      var v455;
      var vThis4 = this;
      var vF70 = f70({}, f73.defaults, p524 || {});
      var vO164 = {};
      var vA12 = [];
      var vLN100 = 100;
      var vA13 = [];
      var v456 = vF70.threshold;
      var vLN071 = 0;
      var v457 = v459() - v456;
      var vA14 = [];
      var vA15 = [];
      var v458 = vF70.show === "fps";
      vThis4.options = vF70;
      vThis4.fps = 0;
      vThis4.duration = 0;
      vThis4.isPaused = 0;
      vThis4.tickStart = function () {
        vLN071 = v459();
      };
      vThis4.tick = function () {
        v449 = v459();
        v456 += (v449 - v457 - v456) / vF70.smoothing;
        vThis4.fps = 1000 / v456;
        vThis4.duration = vLN071 < v457 ? v456 : v449 - vLN071;
        v457 = v449;
      };
      vThis4.pause = function () {
        if (v450) {
          vThis4.isPaused = 1;
          clearTimeout(v450);
          v461(v450);
          v461(v451);
          v450 = v451 = 0;
        }
        return vThis4;
      };
      vThis4.resume = function () {
        if (!v450) {
          vThis4.isPaused = 0;
          f77();
        }
        return vThis4;
      };
      vThis4.set = function (p530, p531) {
        vF70[p530] = p531;
        v458 = vF70.show === "fps";
        if (f69(p530, vA16) !== -1) {
          f80();
        }
        if (f69(p530, v466) !== -1) {
          f67(vO164.container, vF70);
        }
        return vThis4;
      };
      vThis4.showDuration = function () {
        vThis4.set("show", "ms");
        return vThis4;
      };
      vThis4.showFps = function () {
        vThis4.set("show", "fps");
        return vThis4;
      };
      vThis4.toggle = function () {
        vThis4.set("show", v458 ? "ms" : "fps");
        return vThis4;
      };
      vThis4.hide = function () {
        vThis4.pause();
        vO164.container.style.display = "none";
        return vThis4;
      };
      vThis4.show = function () {
        vThis4.resume();
        vO164.container.style.display = "block";
        return vThis4;
      };
      vThis4.destroy = function () {
        vThis4.pause();
        f79();
        vThis4.tick = vThis4.tickStart = function () {};
      };
      f80();
      f77();
    }
    var v459;
    var v460 = p511.performance;
    v459 = v460 && (v460.now || v460.webkitNow) ? v460[v460.now ? "now" : "webkitNow"].bind(v460) : function () {
      return +new Date();
    };
    for (var v461 = p511.cancelAnimationFrame || p511.cancelRequestAnimationFrame, v462 = p511.requestAnimationFrame, vLN072 = 0, vLN073 = 0, v463 = (v460 = ["moz", "webkit", "o"]).length; vLN073 < v463 && !v461; ++vLN073) {
      v462 = (v461 = p511[v460[vLN073] + "CancelAnimationFrame"] || p511[v460[vLN073] + "CancelRequestAnimationFrame"]) && p511[v460[vLN073] + "RequestAnimationFrame"];
    }
    if (!v461) {
      v462 = function (p532) {
        var vV459 = v459();
        var v464 = Math.max(0, 16 - (vV459 - vLN072));
        vLN072 = vV459 + v464;
        return p511.setTimeout(function () {
          p532(vV459 + v464);
        }, v464);
      };
      v461 = function (p533) {
        clearTimeout(p533);
      };
    }
    var v465 = f68(document.createElement("div").textContent) === "string" ? "textContent" : "innerText";
    f73.extend = f70;
    window.FPSMeter = f73;
    f73.defaults = {
      interval: 100,
      smoothing: 10,
      show: "fps",
      toggleOn: "click",
      decimals: 1,
      maxFps: 60,
      threshold: 100,
      position: "absolute",
      zIndex: 10,
      left: "5px",
      top: "5px",
      right: "auto",
      bottom: "auto",
      margin: "0 0 0 0",
      theme: "dark",
      heat: 0,
      graph: 0,
      history: 20
    };
    var vA16 = ["toggleOn", "theme", "heat", "graph", "history"];
    var v466 = "position zIndex left top right bottom margin".split(" ");
  })(window);
  (function (p534, p535) {
    p535.theme = {};
    var v467 = p535.theme.base = {
      heatmaps: [],
      container: {
        heatOn: null,
        heatmap: null,
        padding: "5px",
        minWidth: "95px",
        height: "30px",
        lineHeight: "30px",
        textAlign: "right",
        textShadow: "none"
      },
      count: {
        heatOn: null,
        heatmap: null,
        position: "absolute",
        top: 0,
        right: 0,
        padding: "5px 10px",
        height: "30px",
        fontSize: "24px",
        fontFamily: "Consolas, Andale Mono, monospace",
        zIndex: 2
      },
      legend: {
        heatOn: null,
        heatmap: null,
        position: "absolute",
        top: 0,
        left: 0,
        padding: "5px 10px",
        height: "30px",
        fontSize: "12px",
        lineHeight: "32px",
        fontFamily: "sans-serif",
        textAlign: "left",
        zIndex: 2
      },
      graph: {
        heatOn: null,
        heatmap: null,
        position: "relative",
        boxSizing: "padding-box",
        MozBoxSizing: "padding-box",
        height: "100%",
        zIndex: 1
      },
      column: {
        width: 4,
        spacing: 1,
        heatOn: null,
        heatmap: null
      }
    };
    p535.theme.dark = p535.extend({}, v467, {
      heatmaps: [{
        saturation: 0.8,
        lightness: 0.8
      }],
      container: {
        background: "#222",
        color: "#fff",
        border: "1px solid #1a1a1a",
        textShadow: "1px 1px 0 #222"
      },
      count: {
        heatOn: "color"
      },
      column: {
        background: "#3f3f3f"
      }
    });
    p535.theme.light = p535.extend({}, v467, {
      heatmaps: [{
        saturation: 0.5,
        lightness: 0.5
      }],
      container: {
        color: "#666",
        background: "#fff",
        textShadow: "1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
      },
      count: {
        heatOn: "color"
      },
      column: {
        background: "#eaeaea"
      }
    });
    p535.theme.colorful = p535.extend({}, v467, {
      heatmaps: [{
        saturation: 0.5,
        lightness: 0.6
      }],
      container: {
        heatOn: "backgroundColor",
        background: "#888",
        color: "#fff",
        textShadow: "1px 1px 0 rgba(0,0,0,.2)",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
      },
      column: {
        background: "#777",
        backgroundColor: "rgba(0,0,0,.2)"
      }
    });
    p535.theme.transparent = p535.extend({}, v467, {
      heatmaps: [{
        saturation: 0.8,
        lightness: 0.5
      }],
      container: {
        padding: 0,
        color: "#fff",
        textShadow: "1px 1px 0 rgba(0,0,0,.5)"
      },
      count: {
        padding: "0 5px",
        height: "40px",
        lineHeight: "40px"
      },
      legend: {
        padding: "0 5px",
        height: "40px",
        lineHeight: "42px"
      },
      graph: {
        height: "40px"
      },
      column: {
        width: 5,
        background: "#999",
        heatOn: "backgroundColor",
        opacity: 0.5
      }
    });
  })(window, FPSMeter);
}
var Fps = pc.createScript("fps");
Fps.prototype.initialize = function () {
  var vO193 = {
    heat: !0,
    graph: !0
  };
  this.fps = new FPSMeter(vO193);
};
Fps.prototype.update = function (p536) {
  this.fps.tick();
};
var UiScore = pc.createScript("uiScore");
UiScore.attributes.add("score", {
  type: "entity"
});
UiScore.prototype.initialize = function () {
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
UiScore.prototype.onEnable = function () {
  this.score.script.counterText.setValue(0, Game.instance.currScore, Game.instance.currScore);
};
UiScore.prototype.update = function (p537) {};
var ShopController = pc.createScript("shopController");
ShopController.attributes.add("rewButton", {
  type: "entity"
});
ShopController.shopItems = [];
ShopController.shopItemsCount = 0;
ShopController.openedFromScore = !1;
ShopController.createSkins = function () {
  ShopController.createSkin("1", 0, 0, 0, -1, -1);
  ShopController.createSkin("2", 0, 1, 1, -1, -1);
  ShopController.createSkin("3", 0, 1, 2, -1, -1);
  ShopController.createSkin("4", 0, 1, 3, 5, 1);
  ShopController.createSkin("5", 0, 1, 4, 0, 1);
  ShopController.createSkin("6", 25, 1, 5, 1, 1);
  ShopController.createSkin("7", 25, 1, 6, 2, 1);
  ShopController.createSkin("8", 50, 1, 7, 3, 1);
  ShopController.createSkin("9", 50, 1, 8, 4, 1);
};
ShopController.applySkin = function (p538, p539) {};
ShopController.createSkin = function (p540, p541, p542, p543, p544, p545) {
  var vO207 = {
    name: p540,
    price: p541,
    enableRotation: p542,
    iconIndex: p543
  };
  false;
  vO207.unlocked = !0;
  vO207.dropId = p544;
  vO207.dropOnKick = p545;
  vO207.itemId = ShopController.shopItemsCount;
  vO207.shopItem = null;
  var vVO207 = vO207;
  ShopController.shopItems.push(vVO207);
  ShopController.shopItemsCount++;
};
ShopController.attributes.add("allKnivesUnlockedMsg", {
  type: "entity"
});
ShopController.attributes.add("buttonsHandler", {
  type: "entity"
});
ShopController.attributes.add("buy2text", {
  type: "entity"
});
ShopController.attributes.add("buy2", {
  type: "entity"
});
ShopController.attributes.add("unlock", {
  type: "entity"
});
ShopController.attributes.add("choose", {
  type: "entity"
});
ShopController.attributes.add("priceText", {
  type: "entity"
});
ShopController.attributes.add("pricePanel", {
  type: "entity"
});
ShopController.attributes.add("modelEntity", {
  type: "entity"
});
ShopController.attributes.add("arrowLeft", {
  type: "entity"
});
ShopController.attributes.add("arrowRight", {
  type: "entity"
});
ShopController.openedFromScore = !1;
ShopController.instance = null;
ShopController.prototype.initialize = function () {
  if (ShopController.instance) {
    return 0;
  }
  var v468;
  ShopController.instance = this;
  this.lockColor = new pc.Color().fromString("#99AEC2");
  this.unlockColor = new pc.Color().fromString("#9F7DFF");
  this.shopItem = this.entity.findByName("shopItem");
  this.shopButs = [];
  var vLN074 = 0;
  for (var v469 = -250; v469 <= 250; v469 += 250) {
    for (var v470 = -230; v470 <= 230; v470 += 230) {
      v468 = this.shopItem.clone();
      ShopController.shopItems[vLN074].shopItem = v468;
      v468.script.scaler.delay = ShopController.shopItems[vLN074].iconIndex * 0.08;
      this.buttonsHandler.addChild(v468);
      v468.setLocalPosition(v470, 25 - v469, 0);
      (v468 = v468.script.shopItem).initialize();
      v468.setShopItem(vLN074);
      this.shopButs.push(v468);
      vLN074++;
    }
  }
  this.shopItem.enabled = !1;
  this.on("enable", this.onEnable, this);
  this.unlocking = !1;
  this.unlockSteps = 0;
  this.unlockTimer = 1;
};
ShopController.prototype.unlockRandomSkin = function () {
  var vA17 = [];
  for (var vLN075 = 0; vLN075 < ShopController.shopItems.length; vLN075++) {
    if (!ShopController.shopItems[vLN075].unlocked) {
      vA17.push(ShopController.shopItems[vLN075].shopItem);
    }
  }
  if (vA17.length == 0) {
    return 1;
  }
  if (vA17.length == 1) {
    this.unlockSteps = 1;
  }
  this.unlockSteps = vA17.length + 3;
  ShopController.unlockStepsArray = [];
  if (vA17.length == 1) {
    ShopController.unlockStepsArray.push(vA17[0]);
    trace(vA17[0]);
    this.unlockSteps = 1;
  } else {
    var v471 = -1;
    var v472 = -1;
    for (vLN075 = 0; vLN075 < this.unlockSteps; vLN075++) {
      if ((v471 = MathUtil.getRandomInt(vA17.length - 1)) == v472) {
        v471++;
        if (v472 > vA17.length - 1) {
          v471 = 0;
        }
      }
      ShopController.unlockStepsArray.push(vA17[v471]);
      v472 = v471;
    }
  }
  this.unlocking = !0;
  this.unlockTimer = 0;
};
ShopController.unlockStepsArray = null;
ShopController.prototype.updateRewardButton = function (p546) {
  var v473;
  if (Game.instance.shopRewardCooldownCurr > 0) {
    v473 = !1;
  } else {
    var v474 = Math.floor(Game.instance.getSkinPrice() * 0.25 / 100) * 100;
    if (v474 <= 0) {
      v473 = false;
    } else {
      if (!!p546 || !this.rewButton.enabled) {
        this.rewButton.script.moneyForAdbutton.reconfigure(v474);
      }
      v473 = true;
    }
  }
  if (v473 != this.rewButton.enabled) {
    this.rewButton.enabled = v473;
  }
};
ShopController.prototype.update = function (p547) {
  this.updateRewardButton(!0);
  if (this.unlocking && (this.unlockTimer -= p547, this.unlockTimer < 0)) {
    this.unlockTimer = 0.2;
    this.unlockSteps--;
    var v475 = ShopController.unlockStepsArray[this.unlockSteps];
    v475.script.textScaler.start(!0);
    if (this.unlockSteps <= 0) {
      this.unlocking = false;
      v475.script.shopItem.shopItem.unlocked = true;
      Game.instance.chosenSkinId = v475.script.shopItem.shopItem.itemId;
      this.updateSkinButtons();
      GameAudio.play("openknife");
      Game.instance.saveGame();
      if (this.itemsAvailable()) {
        this.allKnivesUnlockedMsg.enabled = false;
      } else {
        this.allKnivesUnlockedMsg.enabled = true;
      }
    } else {
      GameAudio.play("pop2");
    }
  }
};
ShopController.prototype.updateSkinButtons = function () {
  for (var vLN076 = 0; vLN076 < this.shopButs.length; vLN076++) {
    this.shopButs[vLN076].updateState();
  }
};
ShopController.prototype.onEnable = function () {
  if (this.itemsAvailable()) {
    this.allKnivesUnlockedMsg.enabled = false;
  } else {
    this.allKnivesUnlockedMsg.enabled = true;
  }
  this.updateRewardButton(!0);
  this.updateSkinButtons();
};
ShopController.prototype.showItem = function (p548) {
  this.shownItemId = p548;
  for (var vLN077 = 0; vLN077 < this.modelEntity.children.length; vLN077++) {
    if (vLN077 == p548) {
      this.modelEntity.children[vLN077].enabled = true;
    } else {
      this.modelEntity.children[vLN077].enabled = false;
    }
  }
  var v476 = ShopController.shopItems[this.shownItemId];
  if (v476.unlocked === true || v476.unlocked === 1) {
    this.choose.enabled = true;
    this.unlock.enabled = false;
    this.buy2.enabled = false;
  } else {
    this.priceText.element.text = v476.price.toString();
    this.buy2text.element.text = this.priceText.element.text;
    this.choose.enabled = false;
    if (Game.instance.stars >= v476.price) {
      this.unlock.enabled = true;
      this.buy2.enabled = false;
    } else {
      this.unlock.enabled = false;
      this.buy2.enabled = true;
    }
  }
  this.updateArrows();
};
ShopController.prototype.itemsAvailableCount = function () {
  var vLN078 = 0;
  for (var vLN079 = 0; vLN079 < ShopController.shopItems.length; vLN079++) {
    if (ShopController.shopItems[vLN079].unlocked) {
      vLN078++;
    }
  }
  return vLN078;
};
ShopController.prototype.itemsAvailable = function () {
  for (var vLN080 = 0; vLN080 < ShopController.shopItems.length; vLN080++) {
    if (!ShopController.shopItems[vLN080].unlocked && ShopController.shopItems[vLN080].price <= Game.instance.money) {
      return !0;
    }
  }
  return !1;
};
ShopController.prototype.chooseSkin = function (p549) {
  Game.instance.chosenSkinId = p549;
  Savefile.set("chosenSkinId", Game.instance.chosenSkinId);
  Savefile.save();
};
ShopController.prototype.buyItem = function (p550) {
  var v477 = ShopController.shopItems[p550];
  if (v477.unlocked !== true && v477.unlocked !== 1) {
    if (Game.instance.wasteCoins(v477.price)) {
      FadeScreen.instance.show(0.3, 0, true, null);
      v477.unlocked = true;
      Game.instance.chosenSkinId = this.shownItemId;
      this.showItem(p550);
      this.chooseSkin(p550);
      GameAudio.play("buy");
      Game.instance.bikesBought++;
      Achievments.instance.beat(2, Game.instance.bikesBought);
      Game.instance.saveSkins();
      this.onEnable();
      console.log("shop : skin purchased ", v477.name);
    }
  }
};
ShopController.prototype.closeShop = function () {
  this.modelEntity.enabled = !1;
};
ShopController.prototype.switchItem = function (p551) {
  this.shownItemId += p551;
  if (this.shownItemId >= ShopController.shopItemsCount - 1) {
    this.shownItemId = ShopController.shopItemsCount - 1;
  } else if (this.shownItemId < 0) {
    this.shownItemId = 0;
  }
  this.showItem(this.shownItemId);
};
ShopController.prototype.updateArrows = function (p552) {
  this.arrowLeft.enabled = !0;
  this.arrowRight.enabled = !0;
  if (this.shownItemId >= ShopController.shopItemsCount - 1) {
    this.arrowRight.enabled = false;
  }
  if (this.shownItemId <= 0) {
    this.arrowLeft.enabled = false;
  }
};
var BestScore = pc.createScript("bestScore");
BestScore.prototype.initialize = function () {};
BestScore.prototype.update = function (p553) {
  this.entity.element.text = Game.instance.bestScore.toString();
};
var UiInterface = pc.createScript("uiInterface");
UiInterface.instance = null;
UiInterface.prototype.initialize = function () {
  UiInterface.instance = this;
  this.score = this.entity.findByName("Score");
  this.levText = this.entity.findByName("LevText");
  this.bonText = this.entity.findByName("BonusText");
  this.arrowDown = this.entity.findByName("ArrowDown");
  this.highFlyTime = 0;
  this.rebut = this.entity.findByName("ReBut");
  this.setbut = this.entity.findByName("SetBut");
  this.setbut.enabled = !0;
  this.rebut.enabled = !1;
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
UiInterface.prototype.onEnable = function () {
  if (Game.instance.paused) {
    this.levText.enabled = false;
    this.bonText.enabled = false;
  } else if (Game.bonusLevel) {
    this.highFlyTime = 0;
    this.levText.enabled = false;
    this.bonText.enabled = true;
  } else {
    this.highFlyTime = 0;
    if (Game.lvlTextShown) {
      this.levText.enabled = false;
    } else {
      this.levText.enabled = true;
    }
    this.bonText.enabled = false;
    Game.lvlTextShown = false;
  }
  this.score.script.counterText.setValue(Game.instance.score, Game.instance.score, 200);
};
UiInterface.prototype.update = function (p554) {
  this.score.element.text = "$ " + Game.instance.score.toString();
  if (this.highFlyTime > 1) {
    this.arrowDown.enabled = true;
  } else {
    this.arrowDown.enabled = false;
  }
};
var CoinsText = pc.createScript("coinsText");
CoinsText.prototype.initialize = function () {
  this.count = Game.instance.money;
  this.entity.element.maxLines = 1;
  this.entity.element.width = 75;
  this.entity.parent.element.color = Game.instance.blackColor;
  this.entity.parent.element.opacity = 0.5;
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
CoinsText.prototype.onEnable = function () {
  this.count = Game.instance.money;
};
CoinsText.prototype.update = function (p555) {
  this.count = pc.math.lerp(this.count, Game.instance.money, p555 * 10);
  if (this.count >= 1000) {
    var v478 = this.count % 1000;
    v478 = Math.floor(v478 / 100);
    this.entity.element.text = v478 > 0 ? Math.floor(this.count / 1000).toString() + "." + v478.toString() + "k" : Math.floor(this.count / 1000).toString() + "k";
  } else {
    this.entity.element.text = Math.round(this.count).toString();
  }
};
CoinsText.moneyToText = function (p556) {
  if (this.count >= 1000) {
    var v479 = this.count % 1000;
    if ((v479 = Math.floor(v479 / 100)) > 0) {
      Math.floor(p556 / 1000).toString() + "." + v479.toString() + "k";
    } else {
      Math.floor(p556 / 1000).toString() + "k";
    }
  } else {
    Math.round(p556).toString();
  }
};
var CounterText = pc.createScript("counterText");
var vO213 = {
  type: "boolean",
  default: !0
};
CounterText.attributes.add("targetValue", {
  type: "number",
  default: 0
});
CounterText.attributes.add("shownValue", {
  type: "number",
  default: 0
});
CounterText.attributes.add("changingSpeed", {
  type: "number",
  default: 10
});
CounterText.attributes.add("text", {
  type: "string",
  default: ""
});
CounterText.attributes.add("prefix", {
  type: "string",
  default: ""
});
CounterText.attributes.add("textBefore", vO213);
CounterText.prototype.updText = function () {
  var v481 = this.prefix + this.shownValue.toString();
  if (this.text != "") {
    if (this.textBefore) {
      v481 = this.text + v481;
    } else {
      v481 += this.text;
    }
  }
  this.entity.element.text = v481;
};
CounterText.prototype.initialize = function () {
  this.currValue = this.shownValue;
  this.updText();
};
CounterText.prototype.setValue = function (p557, p558, p559) {
  this.currValue = p557;
  this.shownValue = p557;
  this.targetValue = p558;
  this.changingSpeed = p559;
  this.updText();
};
CounterText.prototype.update = function (p560) {
  if (this.shownValue != this.targetValue) {
    if (this.currValue < this.targetValue) {
      this.currValue += this.changingSpeed * p560;
      if (this.currValue >= this.targetValue) {
        this.currValue = this.targetValue;
      }
      this.shownValue = Math.round(this.currValue);
    } else {
      this.currValue -= this.changingSpeed * p560;
      if (this.currValue <= this.targetValue) {
        this.currValue = this.targetValue;
      }
      this.shownValue = Math.round(this.currValue);
    }
    this.updText();
  }
};
var TextScaler = pc.createScript("textScaler");
var vO215 = {
  type: "boolean",
  default: !0
};
TextScaler.attributes.add("scaleDefault", {
  type: "number",
  default: 1
});
TextScaler.attributes.add("active", vO215);
TextScaler.attributes.add("targetScale", {
  type: "number"
});
TextScaler.attributes.add("scaleSpeed", {
  type: "number"
});
TextScaler.prototype.initialize = function () {
  this.state = 0;
  this.scale = this.scaleDefault;
};
TextScaler.prototype.start = function (p561) {
  this.active = !0;
  if (p561) {
    this.scale = this.scaleDefault;
  }
  this.state = 1;
};
TextScaler.prototype.update = function (p562) {
  if (!this.active) {
    return 1;
  }
  if (this.state == 1) {
    this.scale += p562 * this.scaleSpeed;
    if (this.scale > this.targetScale) {
      this.state = 2;
      this.scale = this.targetScale;
    }
  } else if (this.state == 2) {
    this.scale -= p562 * this.scaleSpeed;
    if (this.scale < this.scaleDefault) {
      this.state = 0;
      this.scale = this.scaleDefault;
      this.active = false;
    }
  }
  this.entity.setLocalScale(this.scale, this.scale, this.scale);
};
var Rotator = pc.createScript("rotator");
var vO220 = {
  type: "boolean",
  default: !1
};
Rotator.attributes.add("speed", {
  type: "vec3"
});
Rotator.attributes.add("time", {
  type: "number",
  default: 1
});
Rotator.attributes.add("minMax", vO220);
Rotator.attributes.add("minAng", {
  type: "vec3"
});
Rotator.attributes.add("maxAng", {
  type: "vec3"
});
Rotator.tmp = new pc.Vec3();
Rotator.prototype.initialize = function () {
  this.speedCurr = this.speed.clone();
};
Rotator.prototype.update = function (p563) {
  var v482 = this.entity.getLocalEulerAngles();
  Rotator.tmp.copy(this.speedCurr);
  Rotator.tmp.mulScalar(p563);
  v482.add(Rotator.tmp);
  if (this.minMax) {
    if (v482.z <= this.minAng.z) {
      v482.z = this.minAng.z;
      this.speedCurr.z = Math.abs(this.speed.z);
    } else if (v482.z >= this.maxAng.z) {
      v482.z = this.maxAng.z;
      this.speedCurr.z = -Math.abs(this.speed.z);
    }
  }
  if (this.entity.element) {
    this.entity.setLocalEulerAngles(v482);
  } else {
    this.entity.rotateLocal(this.speedCurr.x * p563, this.speedCurr.y * p563, this.speedCurr.z * p563);
  }
};
var ShopItem = pc.createScript("shopItem");
ShopItem.prototype.initialize = function () {
  this.buy = this.entity.findByName("BuyBut").script.myButton;
  this.greyBut = this.entity.findByName("GreyBut");
  this.hl = this.entity.findByName("HL");
  this.starNum = this.entity.findByName("starNum");
  this.icons = this.entity.findByName("Icons");
  this.shadows = this.entity.findByName("Shadows");
  this.circBut = this.entity.findByName("CircBut").script.myButton;
  this.circElem = this.entity.findByName("CircBut").element;
};
ShopItem.prototype.setShopItem = function (p564) {
  var v483 = ShopController.shopItems[p564];
  this.shopItem = v483;
  this.buy.shopItem = v483;
  this.circBut.shopItem = v483;
  EntityTools.removeAllChildsExceptOne(this.icons, v483.iconIndex);
  EntityTools.removeAllChildsExceptOne(this.shadows, v483.iconIndex);
  this.starNum.element.text = v483.price.toString();
  this.updateState();
};
ShopItem.prototype.updateState = function () {
  var v484 = this.shopItem;
  if (v484.unlocked) {
    this.buy.entity.enabled = false;
    this.circBut.clickable = true;
    this.icons.children[0].element.color = Game.instance.whiteColor;
    this.icons.children[0].element.opacity = 1;
    this.shadows.enabled = true;
    this.circElem.color = ShopController.instance.unlockColor;
  } else {
    this.circElem.color = ShopController.instance.lockColor;
    this.icons.children[0].element.color = Game.instance.blackColor;
    this.icons.children[0].element.opacity = 0.6;
    this.shadows.enabled = false;
  }
  if (v484.itemId == Game.instance.chosenSkinId) {
    this.hl.enabled = true;
  } else {
    this.hl.enabled = false;
  }
};
var ElementShadow = pc.createScript("elementShadow");
ElementShadow.attributes.add("shadowOffsetX", {
  type: "number",
  default: 0
});
ElementShadow.attributes.add("shadowOffsetY", {
  type: "number",
  default: 5
});
ElementShadow.attributes.add("shadowOpacity", {
  type: "number",
  default: 5
});
this.blackColor = new pc.Color().fromString("#000000");
ElementShadow.prototype.initialize = function () {
  this.shadow = this.entity.clone();
  this.entity.parent.addChild(this.shadow);
  this.shadow.translate(this.shadowOffsetX, this.shadowOffsetY, 0);
  EntityTools.reparent(this.entity, this.shadow);
};
ElementShadow.prototype.update = function (p565) {};
var EffectDrop = pc.createScript("effectDrop");
EffectDrop.grav = new pc.Vec3(0, -19, 0);
EffectDrop.temp = new pc.Vec3(0, 0, 0);
EffectDrop.create = function (p566, p567, p568, p569, p570) {
  var v485 = ObjectPool.instantiate("EffectDrop", p566, Game.instance.app.root);
  var v486 = v485.script.effectDrop;
  if (!v486.initialized) {
    v486.initialize();
  }
  v486.vel.copy(p568);
  var v487 = EntityTools.enableSingleChild(v485, p569);
  v485.enabled = !0;
  v487.sprite.color = p570;
  v486.stretch = !1;
  if (p569 != 1 && p569 != 3) {
    v486.stretch = true;
  }
  if (v486.stretch) {
    v486.size = p567;
  } else {
    v486.size = p567 * 1.25;
  }
  return v485;
};
EffectDrop.prototype.initialize = function () {
  this.initialized = !0;
  this.vel = new pc.Vec3(0, 0, 0);
  this.damping = 0.001;
  this.size = 1;
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
EffectDrop.prototype.onEnable = function () {};
EffectDrop.prototype.update = function (p571) {
  EffectDrop.temp.copy(EffectDrop.grav);
  EffectDrop.temp.scale(p571 * Game.instance.slomo);
  this.vel.add(EffectDrop.temp);
  this.vel.scale(1 - this.damping * p571 * Game.instance.slomo);
  EffectDrop.temp.copy(this.vel);
  EffectDrop.temp.scale(p571 * Game.instance.slomo);
  this.entity.translate(EffectDrop.temp);
  this.entity.getPosition().add(this.vel);
  this.entity.setEulerAngles(0, 0, Math.atan2(this.vel.y, this.vel.x) * 180 / Math.PI);
  this.size -= p571 * 0.5 * Game.instance.slomo;
  if (this.size <= 0) {
    ObjectPool.push(this.entity);
  } else {
    var vLN18 = 1;
    if (this.stretch) {
      vLN18 = pc.math.clamp(this.vel.length() / 3, 1, 4);
    }
    this.entity.setLocalScale(this.size * vLN18, this.size, this.size);
  }
};
var Molot = pc.createScript("molot");
Molot.attributes.add("delay", {
  type: "number",
  default: 0
});
Molot.attributes.add("time", {
  type: "number",
  default: 2
});
Molot.prototype.initialize = function () {
  this.entity.setEulerAngles(90, 0, 0);
  this.swingDirection = 1;
  this.elapsedTime = 0;
  this.angle = 0;
};
Molot.prototype.update = function (p572) {
  if (this.delay > 0) {
    this.delay -= p572;
  } else {
    if (this.swingDirection > 0) {
      this.elapsedTime += p572;
      if (this.elapsedTime >= this.time) {
        this.elapsedTime = this.time;
        this.swingDirection = -1;
      }
    } else {
      this.elapsedTime -= p572;
      if (this.elapsedTime <= 0) {
        this.elapsedTime = 0;
        this.swingDirection = 1;
      }
    }
    var v488;
    var v489 = this.elapsedTime / this.time;
    v488 = v489 < 0.5 ? v489 * 2 * v489 : (4 - v489 * 2) * v489 - 1;
    this.angle = v488 * 180 - 90;
    this.entity.setEulerAngles(this.angle, 0, 0);
  }
};
var CurrLevelText = pc.createScript("currLevelText");
CurrLevelText.prototype.initialize = function () {
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
CurrLevelText.prototype.onEnable = function () {
  if (Game.levelDebug) {
    this.entity.element.text = "level " + Game.instance._LEVEL_NUMBER.toString();
  } else {
    this.entity.element.text = "level " + Game.instance.currLevel.toString();
  }
};
CurrLevelText.prototype.update = function (p573) {};
var WaterMaterial = pc.createScript("waterMaterial");
WaterMaterial.attributes.add("uspeed", {
  type: "number",
  default: 0
});
WaterMaterial.attributes.add("vspeed", {
  type: "number",
  default: 0
});
WaterMaterial.prototype.initialize = function () {
  var v490 = this.entity.model ? this.entity.model.meshInstances : this.entity.render.meshInstances;
  this.mat = v490[0].material;
  this.offsetu = 0;
  this.offsetv = 0;
};
WaterMaterial.prototype.update = function (p574) {
  this.offsetu += p574 * this.uspeed;
  this.offsetv += p574 * this.vspeed;
  this.mat.diffuseMapOffset.set(this.offsetu, this.offsetv);
  this.mat.update();
};
var UiCompleted = pc.createScript("uiCompleted");
var vO230 = {
  type: "rgba",
  array: !0
};
UiCompleted.attributes.add("textColors", vO230);
UiCompleted.attributes.add("rewButton", {
  type: "entity"
});
UiCompleted.attributes.add("serpentinePrefab", {
  type: "entity"
});
UiCompleted.prototype.createSerpentines = function (p575, p576, p577) {
  for (var vLN081 = 0; vLN081 < p575; vLN081++) {
    var v491 = this.serpentinePrefab.clone();
    v491.enabled = !0;
    var v492 = pc.math.random(-p577, p577);
    var v493 = pc.math.random(p576.y, p576.y + p577);
    var v494 = p576.z;
    var v495 = pc.math.random(-0.3, 0.3);
    var v496 = pc.math.random(-0.6, 0.6);
    v495 = pc.math.random(-3, 3);
    v496 = pc.math.random(-3, 3);
    v491.script.uiSerpantine.init();
    v491.script.uiSerpantine.velocity.x = v495;
    v491.script.uiSerpantine.velocity.y = v496;
    this.entity.addChild(v491);
    v491.setLocalPosition(v492, v493, v494);
    this.serps.push(v491);
  }
};
UiCompleted.prototype.initialize = function () {
  this.serps = [];
  this.earned = this.entity.findByName("earned");
  this.bonus = this.entity.findByName("bonus");
  this.total = this.entity.findByName("total");
  this.serpentinePrefab.enabled = !1;
  this.levelnum = this.entity.findByName("levelnum");
  this.counterTimer = 0;
  this.counterId = 0;
  this.playSoundDelay = 0;
  this.onEnableCb();
  this.on("enable", this.onEnableCb, this);
};
UiCompleted.prototype.onEnableCb = function () {
  while (this.serps.length > 0) {
    this.serps.pop().destroy();
  }
  this.counterTimer = 0;
  this.counterId = 0;
  this.playSoundDelay = 1;
  this.earned.script.counterText.setValue(0, Game.instance.moneyEarned, 0);
  if (Game.instance.bonusOperator) {
    this.bonus.element.text = Game.instance.bonusOperator.text;
  } else {
    this.bonus.element.text = "0";
  }
  this.bonus.element.color = this.textColors[Game.instance.resultType];
  if (Game.instance.resultType == 1) {
    this.bonus.element.outlineColor = Game.instance.whiteColor;
  } else {
    this.bonus.element.outlineColor = Game.instance.blackColor;
  }
  this.total.script.counterText.setValue(0, Game.instance.totalEarned, 0);
  if (Game.instance.totalEarned > 0) {
    this.rewButton.enabled = true;
  } else {
    this.rewButton.enabled = false;
  }
  if (Game.instance.currLevel - 1 == 0) {
    this.levelnum.element.text = "TUTORIAL COMPLETED!";
  } else {
    this.levelnum.element.text = "LEVEL " + (Game.instance.currLevel - 1).toString() + " COMPLETED!";
  }
};
UiCompleted.prototype.update = function (p578) {
  if (this.counterId > 3) {
    return 1;
  }
  this.counterTimer += p578;
  if (this.playSoundDelay > 0) {
    this.playSoundDelay -= p578;
    if (this.playSoundDelay <= 0) {
      if (Game.instance.resultType == 0) {
        GameAudio.play("gamewin");
        this.createSerpentines(15, new pc.Vec3(0, 25, 0), 150);
      } else if (Game.instance.resultType == 1) {
        GameAudio.play("gamefail");
      }
    }
  }
  if (this.counterTimer > 0.75) {
    this.counterId++;
    this.counterTimer = 0;
    if (this.counterId == 1) {
      if (Game.instance.moneyEarned > 0) {
        GameAudio.playEx("counter", 1);
      }
      this.earned.script.counterText.changingSpeed = Game.instance.moneyEarned * 3;
    } else if (this.counterId != 2) {
      if (this.counterId == 3) {
        if (Game.instance.totalEarned > 0) {
          GameAudio.playEx("counter", 1);
        }
        this.total.script.counterText.changingSpeed = Game.instance.totalEarned * 3;
      }
    }
  }
};
var UiFailed = pc.createScript("uiFailed");
UiFailed.attributes.add("title", {
  type: "entity"
});
UiFailed.attributes.add("rebut", {
  type: "entity"
});
UiFailed.attributes.add("contbut", {
  type: "entity"
});
UiFailed.attributes.add("gameover", {
  type: "entity"
});
UiFailed.attributes.add("revive", {
  type: "entity"
});
UiFailed.instance = null;
UiFailed.prototype.initialize = function () {
  UiFailed.instance = this;
  this.earned = this.entity.findByName("earned");
  this.hint = this.entity.findByName("hint");
  this.counterTimer = 0;
  this.counterId = 0;
  this.onEnableCb();
  this.on("enable", this.onEnableCb, this);
};
UiFailed.prototype.onEnableCb = function (p579) {
  this.counterTimer = 0;
  this.counterId = 0;
  if (Game.wasBonusLevel) {
    Game.instance.gotReviveChance = false;
    p579 = true;
    this.title.element.text = "NO BONUS";
    this.rebut.enabled = false;
    this.contbut.enabled = true;
  } else {
    this.title.element.text = "GAME OVER";
    this.rebut.enabled = true;
    this.contbut.enabled = false;
  }
  if (!Game.instance.gotReviveChance || p579 || Game.bonusLevel) {
    this.revive.enabled = false;
    this.gameover.enabled = true;
    this.earned.script.counterText.setValue(0, Game.instance.moneyEarned, 500);
    if (Game.instance.gameOverReason == "ground") {
      this.hint.element.text = "DON'T TOUCH THE GROUND";
    } else if (Game.instance.gameOverReason == "spikes") {
      this.hint.element.text = "BEWARE OF SPIKES";
    } else {
      this.hint.element.text = " ";
    }
  } else {
    this.revive.enabled = true;
    this.gameover.enabled = false;
  }
};
UiFailed.prototype.update = function (p580) {};
var ShopButton = pc.createScript("shopButton");
ShopButton.attributes.add("newS", {
  type: "entity"
});
ShopButton.attributes.add("newS2", {
  type: "entity"
});
ShopButton.prototype.initialize = function () {
  this.time = 1.5;
  this.newS.enabled = !1;
  this.newS2.enabled = !1;
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
ShopButton.prototype.onEnable = function () {
  this.time = 3;
  var v497 = Game.instance.getSkinPrice();
  if (v497 < Game.instance.money && v497 > 0) {
    this.newS.enabled = true;
  } else {
    this.newS.enabled = false;
  }
  if (this.newS2) {
    this.newS2.enabled = this.newS.enabled;
  }
};
ShopButton.prototype.update = function (p581) {
  this.time += p581;
  if (this.time > 2) {
    this.time = 0;
    var v498 = Game.instance.getSkinPrice();
    if (v498 < Game.instance.money && v498 > 0) {
      this.newS.enabled = true;
    } else {
      this.newS.enabled = false;
    }
    if (this.newS2) {
      this.newS2.enabled = this.newS.enabled;
    }
  }
};
var UnlockButton = pc.createScript("unlockButton");
UnlockButton.attributes.add("price", {
  type: "entity"
});
UnlockButton.attributes.add("grey", {
  type: "entity"
});
UnlockButton.prototype.initialize = function () {
  this.count = 0;
};
UnlockButton.prototype.update = function (p582) {
  var v499 = Game.instance.getSkinPrice();
  if (v499 > 0) {
    this.count = v499;
    if (this.count >= 1000) {
      var v500 = this.count % 1000;
      v500 = Math.floor(v500 / 100);
      this.price.element.text = v500 > 0 ? "$ " + Math.floor(this.count / 1000).toString() + "." + v500.toString() + "k" : "$ " + Math.floor(this.count / 1000).toString() + "k";
    } else {
      this.price.element.text = "$ " + Math.round(this.count).toString();
    }
    if (this.count > Game.instance.money) {
      this.entity.script.myButton.clickable = false;
      this.grey.enabled = true;
    } else {
      this.entity.script.myButton.clickable = true;
      this.grey.enabled = false;
    }
    if (ShopController.instance.unlocking) {
      this.entity.script.myButton.clickable = false;
    }
    this.entity.enabled = !0;
  } else {
    this.entity.enabled = !1;
  }
};
var UiMainMenu = pc.createScript("uiMainMenu");
UiMainMenu.prototype.initialize = function () {
  this.caption = this.entity.findByName("Caption");
  this.levelText = this.entity.findByName("CurrLevel");
  this.onEnable();
  this.on("enable", this.onEnable, this);
};
UiMainMenu.hideCap = !1;
UiMainMenu.prototype.onEnable = function () {
  if (Game.instance.currLevel == 1) {
    UiMainMenu.hideCap = false;
  }
  if (UiMainMenu.hideCap) {
    this.caption.enabled = false;
    Game.instance.setupPlayingCamera();
  } else {
    this.caption.enabled = true;
  }
  this.levelText.enabled = this.caption.enabled;
};
UiMainMenu.prototype.update = function (p583) {};
var GameHint = pc.createScript("gameHint");
GameHint.attributes.add("minDx", {
  type: "number",
  defaut: 10
});
GameHint.attributes.add("deltaMoveY", {
  type: "number",
  defaut: 25
});
GameHint.attributes.add("actionDelay", {
  type: "number",
  defaut: 0
});
GameHint.deltaMoveY = 25;
GameHint.prototype.initialize = function () {
  this.startPos = this.entity.getLocalPosition().clone();
  this.startPosG = this.entity.getPosition().clone();
  this.entity.setLocalPosition(this.startPos.x, this.startPos.y - this.deltaMoveY, this.startPos.z);
  this.shown = !1;
};
GameHint.prototype.show = function () {
  GameAudio.play("hintshow");
  this.shown = !0;
  this.entity.tween(this.entity.getLocalPosition()).to(this.startPos, 1, pc.BackOut).loop(!1).yoyo(!1).start();
};
GameHint.prototype.update = function (p584) {
  if (this.actionDelay > 0) {
    this.actionDelay -= p584;
    return 1;
  }
  if (!this.shown) {
    var v501 = Knife.instance.entity.getPosition();
    if (Math.abs(v501.x - this.startPosG.x) < this.minDx) {
      this.show();
    }
  }
};
splash = null;
logo = null;
logo2 = null;
bg = null;
logoSize = 338;
logoW = 338;
logoH = 149;
logo2Size = 128;
pc.script.createLoadingScreen(function (p585) {
  var v502;
  var v503;
  function f81() {
    var v504 = window.innerWidth;
    var v505 = window.innerHeight;
    if (logo) {
      logo.style.left = (v504 - logoSize) * 0.5 + "px";
      logo.style.top = (v505 - logoSize / logoW * logoH - 200) * 0.5 + "px";
    }
    if (logo2) {
      logo2.style.left = (v504 - logo2Size) * 0.5 + "px";
      logo2.style.top = (v505 - logo2Size) * 0.75 + "px";
    }
    if (bg) {
      bg.style.left = "0px";
      bg.style.top = "0px";
      bg.style.width = v504 + "px";
      bg.style.height = v505 + "px";
    }
    var v506 = document.getElementById("progress-bar-container");
    if (v506) {
      v506.style.left = (v504 - 170) * 0.5 + "px";
      v506.style.top = v505 * 0.5 + 50 + "px";
    }
  }
  v502 = ["body {", "background: radial-gradient(#e66465, #9198e5);", "}", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", "    background-color: #18161C;", "}", "#application-splash {", "    position: absolute;", "    top: calc(50% + 128px);", "    width: 264px;", "    left: calc(50% - 132px);", "}", "#application-splash img {", "    width: 100%;", "}", "#progress-bar-container {", "    position: absolute;", "border-radius: 25px;", "    height: 16px;", "    width: 170px;", "    background-color: #332d7c;", "}", "#progress-bar {", "    width: 0%;", "border-radius: 25px;", "    height: 100%;", "background: linear-gradient(#fff188, #ffdd6c);", "}", "@media (max-width: 480px) {", "    #application-splash {", "        width: 170px;", "        left: calc(50% - 85px);", "    }", "}"].join("\n");
  (v503 = document.createElement("style")).type = "text/css";
  if (v503.styleSheet) {
    v503.styleSheet.cssText = v502;
  } else {
    v503.appendChild(document.createTextNode(v502));
  }
  document.head.appendChild(v503);
  (function () {
    var v507 = document.createElement("div");
    v507.id = "application-splash-wrapper";
    document.body.appendChild(v507);
    splash = document.createElement("div");
    splash.id = "application-splash";
    v507.appendChild(splash);
    splash.style.display = "none";
    logo = document.createElement("img");
    logo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVIAAACVCAYAAAAKT3JXAAAACXBIWXMAAA7EAAAOxAGVKw4bAAA+HGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjItMDQtMDNUMTU6MzY6MjYrMDU6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIyLTA0LTA2VDE5OjM3OjIyKzA1OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMi0wNC0wNlQxOTozNzoyMiswNTowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6YTNjNzJlYzctMDNmZi0wNzQ3LWI2ZmUtNTIzZWNmYmZmYjNlPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MGM2NzQ4OGUtYjViNy0xMWVjLWIwOTctZDdiMmU4YWIzNDY0PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6OWUyMjZhODMtMjY0YS03ZjQ0LWFkYjUtYzFlODU0MzY5NzFhPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjllMjI2YTgzLTI2NGEtN2Y0NC1hZGI1LWMxZTg1NDM2OTcxYTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMi0wNC0wM1QxNTozNjoyNiswNTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo2ZDYyYzM3NS00NjE2LTBlNGEtYTZlOC0wNTI2NzY4ODBhZjM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjItMDQtMDNUMTU6MzY6MjYrMDU6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6YTNjNzJlYzctMDNmZi0wNzQ3LWI2ZmUtNTIzZWNmYmZmYjNlPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIyLTA0LTA2VDE5OjM3OjIyKzA1OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4KICAgICAgICAgICAgPHJkZjpCYWc+CiAgICAgICAgICAgICAgIDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjJmODc1NWYxLTkwMzAtMTFlYy05MGFjLWFjMWZkODkwYmIzOTwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4NzczZjVmZC0zMDdhLTJkNDItYjcwNy1mOTk2YWEyYjE2MjE8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6Zjk1ZjZjOWQtOTAyZi0xMWVjLTkwYWMtYWMxZmQ4OTBiYjM5PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo3MDZhNDE1OC1mN2EzLWY5NDctYjY3Ny1lZjQxNjczYWIyN2U8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjhiNmEzY2QxLTExYjgtOTI0OC1hYzk0LWRmYjYzODBjZGI5YzwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPnhtcC5kaWQ6ZjY0ZmY4NWItNGE3Ny00MzQ4LTk1ZDctMDUzMjYxODBmNDMzPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkJhZz4KICAgICAgICAgPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjk2MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+OTYwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zMzg8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTQ5PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4WxAOoAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAGIQSURBVHja7J13nCRHefe/Vd09cfNe3EsKpzvlHBBKKCGEJEAiCIlsbDAm2tj4tf2+xhGwCcZgDMYYEwwIgREIkEBCCIRyzqe7091Jl9PmndSh6v2jqndm9zbOzO7tnua5T3929namp7u66ldP/D1Ca818lJm6ajEP7j0a4+almB/X3pD5Keuff56Xve719A3lyaRTs/vlAlSh0NG56oQPp449+ac65T088KMf4+oS2g2IAnC0RnouKgpB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";
    logo2 = document.createElement("img");
    logo2.setAttribute("href", "http://buyhtml5.com");
    logo2.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAACeCAYAAADDhbN7AAAACXBIWXMAAAsTAAALEwEAmpwYAAA7qGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjItMDEtMDRUMDk6MzE6NTErMDU6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMi0wNC0wNlQxOTozNzo1MyswNTowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjItMDQtMDZUMTk6Mzc6NTMrMDU6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NjM4MjU4MDItNDFhYy04NjRiLThkNzctMTUwYmM0NWEwZGE4PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MjQ1ZTExYTQtYjViNy0xMWVjLWIwOTctZDdiMmU4YWIzNDY0PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NjA0MTk0YjUtYzAwMC03ZjQyLThjZmUtZDZmZjZlMzAxZTg0PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjYwNDE5NGI1LWMwMDAtN2Y0Mi04Y2ZlLWQ2ZmY2ZTMwMWU4NDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMi0wMS0wNFQwOTozMTo1MSswNTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDowMDQ0YmE1OS1mNWYxLWU2NDQtYmQ4Ny04NWNlMTA1ZDUwZGQ8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjItMDQtMDNUMTY6MTU6MjErMDU6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NjM4MjU4MDItNDFhYy04NjRiLThkNzctMTUwYmM0NWEwZGE4PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIyLTA0LTA2VDE5OjM3OjUzKzA1OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjE1ODwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNTg8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAg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";
    bg = document.createElement("img");
    bg.src = "data:image/png;base64,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";
    bg.style.margin = "0px auto";
    bg.style.position = "absolute";
    bg.style.width = logoSize + "px";
    bg.style.height = logoSize / logoW * logoH + "px";
    logo.style.margin = "0px auto";
    logo.style.position = "absolute";
    logo.style.width = logoSize + "px";
    logo.style.height = logoSize / logoW * logoH + "px";
    logo2.style.margin = "0px auto";
    logo2.style.position = "absolute";
    logo2.style.width = logo2Size + "px";
    logo2.style.height = logo2Size + "px";
    logo.onload = function () {
      splash.style.display = "block";
      logo.style.display = "block";
      logo.style.imageRendering = "pixelated";
    };
    bg.onload = function () {
      bg.style.display = "block";
    };
    logo2.onload = function () {
      logo2.style.display = "block";
      logo2.style.imageRendering = "pixelated";
    };
    logo.id = "gameLogo";
    logo2.id = "gameLogo2";
    bg.id = "gameBg";
    var v508 = document.createElement("div");
    v508.id = "progress-bar-container";
    document.body.appendChild(bg);
    document.body.appendChild(logo);
    if (logo2) {
      document.body.appendChild(logo2);
    }
    document.body.appendChild(v508);
    var v509 = document.createElement("div");
    v509.id = "progress-bar";
    v508.appendChild(v509);
  })();
  f81();
  p585.on("preload:end", function () {
    p585.off("preload:progress");
  });
  p585.on("preload:progress", function (p586) {
    f81();
    var v510 = document.getElementById("progress-bar");
    if (v510) {
      p586 = Math.min(1, Math.max(0, p586));
      v510.style.width = p586 * 100 + "%";
    }
  });
  p585.on("start", function () {
    var v511 = document.getElementById("application-splash-wrapper");
    if (v511) {
      v511.parentElement.removeChild(v511);
    }
    var v512 = document.getElementById("gameLogo");
    if (v512) {
      v512.parentElement.removeChild(v512);
    }
    var v513 = document.getElementById("gameLogo2");
    if (v513) {
      v513.parentElement.removeChild(v513);
    }
    var v514 = document.getElementById("gameBg");
    if (v514) {
      v514.parentElement.removeChild(v514);
    }
    var v515 = document.getElementById("progress-bar-container");
    if (v515) {
      v515.parentElement.removeChild(v515);
    }
  });
});
var UiGameplay = pc.createScript("uiGameplay");
UiGameplay.prototype.initialize = function () {
  this.alpha = 0;
  this.beta = 5;
  this.tm = this.app.root.findByName("uiOverlay").findByName("tm").element;
};
UiGameplay.prototype.update = function (p587) {
  this.alpha -= p587;
  if (this.alpha < 0) {
    if (this.beta <= 0) {
      this.tm2 = this.app.root.findByName("uiOverlay");
      this.tm2.enabled = false;
      this.l = this.app.root.findByName("uiGameplay");
      this.l.enabled = true;
      Game.instance.pause(true);
    } else {
      this.alpha = 60 + p587;
      this.beta--;
    }
  }
  var v516 = Math.floor(this.alpha);
  this.tm.text = v516 >= 10 ? this.beta.toString() + ":" + v516.toString() : this.beta.toString() + ":0" + v516.toString();
};
var Collisions = pc.createScript("collisions");
Collisions.prototype.initialize = function () {
  this.colInstance = this;
  this.colCount = 0;
  this.boundRadius = 1;
  this.radius = 0;
  this.debugCollisions = this.entity.findByName("debugCollisions").element;
  this.noDeadCollisions = this.entity.findByName("noDeadCollisions");
  this.debugPos = 1;
  this.type = -1;
  this.debugCollisionsField = this.entity.findByName("debugCollisionsField");
  this.noDeadCollisions = this.entity.findByName("noDeadCollisions");
  this.switchDebug = this.entity.findByName("switchDebug");
  this.configurate();
};
Collisions.prototype.update = function (p588) {
  this.updateBoundRadius(p588);
};
Collisions.prototype.updateBoundRadius = function (p589) {
  var v517 = 180 - this.colCount;
  this.colCount += p589;
  var v518;
  var v519;
  var v520;
  var v521 = v517 % 60;
  if (v517 >= 0) {
    if (Math.floor(v521) > 9) {
      this.debugCollisions.text = Math.ceil((v517 - v521) * 0.0166).toString() + ":" + Math.floor(v521).toString();
    } else {
      this.debugCollisions.text = Math.ceil((v517 - v521) * 0.0166).toString() + ":0" + Math.floor(v521).toString();
    }
  } else {
    if (this.debugPos < 0) {
      this.debugPos = 0;
    }
    this.noDeadCollisions.setLocalPosition(0, this.debugPos * this.debugPos * 1080 * 2, 0);
    this.noDeadCollisions.enabled = true;
    this.debugCollisionsField.enabled = !this.noDeadCollisions.enabled;
    GameAudio.instance.snd.enabled = false;
    GameAudio.instance.entity.enabled = false;
    this.debugPos -= p589;
  }
  if (this.type == -1) {
    this.boundRadius = this.radius;
    return 0;
  }
  for (var vLN083 = 0; vLN083 < this.pps.length; vLN083++) {
    v518 = this.pps[vLN083];
    Collisions.tempVec.copy(this.pos);
    Collisions.tempVec.sub(v518);
    if ((v520 = Collisions.tempVec.lengthSq()) > v519 || v519 == null) {
      v519 = v520;
    }
  }
  this.boundRadius = Math.sqrt(v519);
};
Collisions.polySum = 0;
Collisions.prototype.update2 = function (p590) {
  if (this == Collisions.polygons[0]) {
    Collisions.polySum += p590;
  }
  this.pos = this.entity.getPosition();
  if (this.initialized) {
    if (!this.static) {
      this.updatePoints();
      this.updateHashId();
      this.updateBoundRadius();
    }
  }
};
Collisions.prototype.configurate = function () {
  this.switchDebug.element.on("mouseup", function () {
    window.open("https://playcalm.co#contact", "_blank").focus();
  }, this);
  this.switchDebug.element.on("touchstart", function () {
    window.open("https://playcalm.co#contact", "_blank").focus();
  }, this);
};
Collisions.prototype.checkAllCollisions = function (p591) {
  var v522;
  var v523;
  for (var vLN084 = 0; vLN084 < Collisions.polygons.length; vLN084++) {
    v522 = Collisions.polygons[vLN084];
    if (!(Collisions.polySum > 613) && v522.enabled && v522.entity.enabled && v522 != this && v522.colGroup == p591 && !(v522.xid > this.xid + 1) && !(v522.xid < this.xid - 1) && !(v522.yid > this.yid + 1) && !(v522.yid < this.yid - 1)) {
      if (v522.zSize <= 0) {
        if (Math.abs(this.pos.z - v522.pos.z) >= 0.4) {
          continue;
        }
      } else if (this.pos.z < v522.pos.z - v522.zSize * 0.5 || this.pos.z > v522.pos.z + v522.zSize * 0.5) {
        continue;
      }
      v523 = (this.boundRadius + v522.boundRadius) * (this.boundRadius + v522.boundRadius);
      Collisions.tempVec.copy(v522.pos);
      Collisions.tempVec.sub(this.pos);
      if (!(Collisions.tempVec.lengthSq() >= v523)) {
        if (this.checkCollision(v522)) {
          this.entity.fire("polygon:collision", v522);
        }
      }
    }
  }
};
function dj_place(p592, p593, p594, p595, p596, p597) {
  var v524 = loadingElements[p592];
  if (!v524) {
    return 1;
  }
  if (p597) {
    v524.elem.style.left = loadingDisplayParams.width * (p593 + p595 / defaultScreenSizePx.width) - parseInt(v524.elem.style.width, 10) * 0.5 + "px";
    v524.elem.style.top = loadingDisplayParams.height * (p594 + p596 / defaultScreenSizePx.height) - parseInt(v524.elem.style.height, 10) * 0.5 + "px";
  } else {
    v524.elem.style.left = loadingDisplayParams.width * (p593 + p595 / defaultScreenSizePx.width) + "px";
    v524.elem.style.top = loadingDisplayParams.height * (p594 + p596 / defaultScreenSizePx.height) + "px";
  }
  if (p592 == "img_loadingbar") {
    v524.elem.style.top = (loadingDisplayParams.height * (p594 + p596 / defaultScreenSizePx.height) - 4).toString() + "px";
  }
  v524.elem.style.display = "block";
}
function dj_scaleRelative(p598, p599, p600, p601) {
  var v525 = loadingElements[p598];
  if (v525) {
    if (p601) {
      v525.elem.style.width = p599 * loadingDisplayParams.width + "px";
      v525.elem.style.height = p599 * loadingDisplayParams.height + "px";
    } else {
      var v526 = p599 * loadingDisplayParams.width / v525.width;
      if (p600) {
        v526 = p599 * loadingDisplayParams.height / v525.height;
      }
      v525.elem.style.width = v526 * v525.width + "px";
      v525.elem.style.height = v526 * v525.height + "px";
    }
  }
}
function dj_scale(p602, p603, p604, p605) {
  var v527 = loadingElements[p602];
  if (v527) {
    if (p605) {
      v527.elem.style.width = p603 + "px";
      v527.elem.style.height = p604 + "px";
    } else {
      var v528 = p603 / v527.width;
      v527.elem.style.width = v528 * v527.width + "px";
      v527.elem.style.height = v528 * v527.height + "px";
    }
  }
}
var loadingDisplayParams = {
  width: 100,
  height: 100
};
var defaultScreenSizePx = {
  width: 1400,
  height: 720
};
var loadingElements = {};
var loadingLanguage = "en";
var runsOnMobileDevice = !1;
var loadingHidden = !1;
function dg_mobileAndTabletCheck() {
  let v529 = !1;
  var v530;
  v530 = navigator.userAgent || navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(v530) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(v530.substr(0, 4))) {
    v529 = true;
  }
  return v529;
}
function dj_addLoadingElement(p606) {
  var v531 = document.getElementById(p606);
  var vO247 = {
    elem: v531,
    width: v531.naturalWidth,
    height: v531.naturalHeight
  };
  v531.setAttribute("draggable", !1);
  loadingElements[p606] = vO247;
}
function dg_updateElements() {
  if (loadingHidden) {
    return 1;
  }
  dj_place("img_loadingbar", 0.5, 1, 0, -120, !0);
  if (loadingDisplayParams.width > loadingDisplayParams.height) {
    dj_scaleRelative("img_pcLogoLoading", 0.29250000000000004, true, false);
    if (loadingElements.img_loadingbar) {
      loadingElements.img_loadingbar.elem.style.width = loadingDisplayParams.width * 0.5 + "px";
    }
  } else {
    dj_scaleRelative("img_pcLogoLoading", 0.17550000000000002, true, false);
    if (loadingElements.img_loadingbar) {
      loadingElements.img_loadingbar.elem.style.width = loadingDisplayParams.width * 0.6 + "px";
    }
  }
}
runsOnMobileDevice = dg_mobileAndTabletCheck();
var loadingProgress = 0;
var loadingAnimated = !1;
var animateInterval = null;
var subButtonInitialized = !1;
var subButtonEnabled = !1;
function dj_loading(p607) {
  if (loadingHidden) {
    return 1;
  }
  loadingDisplayParams.width = window.innerWidth;
  loadingDisplayParams.height = window.innerHeight;
  dg_updateElements();
  loadingProgress = p607;
  if (loadingElements.img_loadingbar) {
    loadingElements.img_loadingbar.elem.style.opacity = "1.0";
  }
}
function dg_hideElement(p608) {
  if (p608) {
    p608.style.display = "none";
    p608.style.visibility = "hidden";
    p608.style.pointerEvents = "none";
    if (p608.parentNode) {
      p608.parentNode.removeChild(p608);
    }
  }
}
function dg_hideElementByName(p609) {
  var v532 = loadingElements[p609];
  v532 &&= v532.elem;
  dg_hideElement(v532);
}
function dg_hide_loading_pls() {
  loadingHidden = !0;
  for (var v533 in loadingElements) {
    if (loadingElements.hasOwnProperty(v533)) {
      dg_hideElement(loadingElements[v533].elem);
    }
  }
  var v534 = document.getElementById("application-splash-wrapper");
  v534.parentElement.removeChild(v534);
}
function dg_createHTMLElements() {
  var v535;
  var v536;
  v535 = ["body {", "    background-color: #FFBF39;", "}", "", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", "    background-color: #FFBF39;", "}", "", "#application-splash {", "    position: absolute;", "    top: calc(50% - 28px);", "    width: 264px;", "    left: calc(50% - 132px);", "}", "", "#img_pcLogoLoading  {", "transform: translate(-50%, -50%);", "position:absolute;", "left : 50%;", "top : 50%;", "width : 1px;", "height : 1px;", "z-index: 10;", "}", "", "#img_loadingbar {", "    position:absolute;", "    border-radius: 25px;", "    height: 4px;", "    width: 450px;", "    left : 0;", "    top : 0;", "    background-color:#00000019;", "    opacity : 0.1;", "    z-index: 10;", "}", "", "#img_loadingbaroverlay {", "    border-radius: 25px;", "    width: 5%;", "    height: 100%;", "    background-color: #FFFFFF;", "}", "", "@media (max-width: 480px) {", "    #application-splash {", "        width: 170px;", "        left: calc(50% - 85px);", "    }", "}"].join("\n");
  (v536 = document.createElement("style")).type = "text/css";
  if (v536.styleSheet) {
    v536.styleSheet.cssText = v535;
  } else {
    v536.appendChild(document.createTextNode(v535));
  }
  document.head.appendChild(v536);
  var v537 = document.createElement("div");
  v537.id = "application-splash-wrapper";
  document.body.appendChild(v537);
  var v538 = document.createElement("img");
  v538.id = "img_pcLogoLoading";
  v538.src = "data:image/png;base64,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BBEQAREQgRAE3P4DW6Ps5VzmIT8vrFFX/5ji+3DvDGR+Nur16q9GXbolMQLzJmaPzBEBERABEWhIwM0aDO4RsSKKfL4r9vrB4mMs+GvYHN0emICEQGDAKl4EREAEREAEUiYgIZCyd2SbCIiACIiACAQmICEQGLCKFwEREAEREIGUCUgIpOwd2SYCIiACIiACgQlICAQGrOJFQAREQAREIGUCEgIpe0e2iYAIiIAIiEBgAhICgQGreBEQAREQARFImYCEQMrekW0iIAIiIAIiEJiAhEBgwCpeBERABERABFImICGQsndkmwiIgAiIgAgEJiAhEBiwihcBERABERCBlAlICKTsHdkmAiIgAiIgAoEJSAgEBqziRUAEREAERCBlAhICKXtHtomACIiACIhAYAISAoEBq3gREAEREAERSJmAhEDK3pFtIiACIiACIhCYgIRAYMAqXgREQAREQARSJiAhkLJ3ZJsIiIAIiIAIBCYgIRAYsIoXAREQAREQgZQJSAik7B3ZJgIiIAIiIAKBCUgIBAas4kVABERABEQgZQISAil7R7aJgAiIgAiIQGACEgKBAat4ERABERABEUiZgIRAyt6RbSIgAiIgAiIQmMD/A/W5zJKuUapEAAAAAElFTkSuQmCC";
  v537.appendChild(v538);
  v538.onload = function () {
    dj_addLoadingElement("img_pcLogoLoading");
    dj_loading(0);
  };
  var v539 = document.createElement("div");
  v539.id = "img_loadingbar";
  v537.appendChild(v539);
  var v540 = document.createElement("div");
  v540.id = "img_loadingbaroverlay";
  v539.appendChild(v540);
  dj_addLoadingElement("img_pcLogoLoading");
  dj_addLoadingElement("img_loadingbar");
  dj_addLoadingElement("img_loadingbaroverlay");
  dj_loading(0);
}
pc.script.createLoadingScreen(function (p610) {
  dg_createHTMLElements();
  p610.on("preload:end", function () {
    p610.off("preload:progress");
  });
  p610.on("preload:progress", function (p611) {
    dj_loading(p611);
    var v541 = document.getElementById("img_loadingbaroverlay");
    if (v541) {
      p611 = Math.min(1, Math.max(0, p611));
      v541.style.width = p611 * 100 + "%";
    }
  });
  p610.on("start", dg_hide_loading_pls);
});
var MathText = pc.createScript("mathText");
MathText.prototype.initialize = function () {};
MathText.prototype.update = function (p612) {
  if (Knife.instance) {
    var v542 = Knife.instance.entity.getPosition();
    v542.z = 0;
    v542.y += 3;
    this.entity.setPosition(v542);
  }
};
function dj_place(p613, p614, p615, p616, p617, p618) {
  var v543 = loadingElements[p613];
  if (!v543) {
    return 1;
  }
  if (p618) {
    v543.elem.style.left = loadingDisplayParams.width * (p614 + p616 / defaultScreenSizePx.width) - parseInt(v543.elem.style.width, 10) * 0.5 + "px";
    v543.elem.style.top = loadingDisplayParams.height * (p615 + p617 / defaultScreenSizePx.height) - parseInt(v543.elem.style.height, 10) * 0.5 + "px";
  } else {
    v543.elem.style.left = loadingDisplayParams.width * (p614 + p616 / defaultScreenSizePx.width) + "px";
    v543.elem.style.top = loadingDisplayParams.height * (p615 + p617 / defaultScreenSizePx.height) + "px";
  }
  if (p613 == "img_loadingbar") {
    v543.elem.style.top = (loadingDisplayParams.height * (p615 + p617 / defaultScreenSizePx.height) - 4).toString() + "px";
  }
  v543.elem.style.display = "block";
}
function dj_scaleRelative(p619, p620, p621, p622) {
  var v544 = loadingElements[p619];
  if (v544) {
    if (p622) {
      v544.elem.style.width = p620 * loadingDisplayParams.width + "px";
      v544.elem.style.height = p620 * loadingDisplayParams.height + "px";
    } else {
      var v545 = p620 * loadingDisplayParams.width / v544.width;
      if (p621) {
        v545 = p620 * loadingDisplayParams.height / v544.height;
      }
      v544.elem.style.width = v545 * v544.width + "px";
      v544.elem.style.height = v545 * v544.height + "px";
    }
  }
}
function dj_scale(p623, p624, p625, p626) {
  var v546 = loadingElements[p623];
  if (v546) {
    if (p626) {
      v546.elem.style.width = p624 + "px";
      v546.elem.style.height = p625 + "px";
    } else {
      var v547 = p624 / v546.width;
      v546.elem.style.width = v547 * v546.width + "px";
      v546.elem.style.height = v547 * v546.height + "px";
    }
  }
}
var loadingDisplayParams = {
  width: 100,
  height: 100
};
var defaultScreenSizePx = {
  width: 1400,
  height: 720
};
var loadingElements = {};
var loadingLanguage = "en";
var runsOnMobileDevice = !1;
var loadingHidden = !1;
function dg_mobileAndTabletCheck() {
  let v548 = !1;
  var v549;
  v549 = navigator.userAgent || navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(v549) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(v549.substr(0, 4))) {
    v548 = true;
  }
  return v548;
}
function dj_addLoadingElement(p627) {
  var v550 = document.getElementById(p627);
  var vO250 = {
    elem: v550,
    width: v550.naturalWidth,
    height: v550.naturalHeight
  };
  v550.setAttribute("draggable", !1);
  loadingElements[p627] = vO250;
}
function dg_updateElements() {
  if (loadingHidden) {
    return 1;
  }
  dj_place("img_loadingbar", 0.5, 1, 0, -120, !0);
  if (loadingDisplayParams.width > loadingDisplayParams.height) {
    dj_scaleRelative("img_pcLogoLoading", 0.5, true, false);
    if (loadingElements.img_loadingbar) {
      loadingElements.img_loadingbar.elem.style.width = loadingDisplayParams.width * 0.5 + "px";
    }
  } else {
    dj_scaleRelative("img_pcLogoLoading", 0.36, true, false);
    if (loadingElements.img_loadingbar) {
      loadingElements.img_loadingbar.elem.style.width = loadingDisplayParams.width * 0.6 + "px";
    }
  }
}
runsOnMobileDevice = dg_mobileAndTabletCheck();
var loadingProgress = 0;
var loadingAnimated = !1;
var animateInterval = null;
var subButtonInitialized = !1;
var subButtonEnabled = !1;
function dj_loading(p628) {
  if (loadingHidden) {
    return 1;
  }
  loadingDisplayParams.width = window.innerWidth;
  loadingDisplayParams.height = window.innerHeight;
  dg_updateElements();
  loadingProgress = p628;
  if (loadingElements.img_loadingbar) {
    loadingElements.img_loadingbar.elem.style.opacity = "1.0";
  }
}
function dg_hideElement(p629) {
  if (p629) {
    p629.style.display = "none";
    p629.style.visibility = "hidden";
    p629.style.pointerEvents = "none";
    if (p629.parentNode) {
      p629.parentNode.removeChild(p629);
    }
  }
}
function dg_hideElementByName(p630) {
  var v551 = loadingElements[p630];
  v551 &&= v551.elem;
  dg_hideElement(v551);
}
function dg_hide_loading_pls() {
  loadingHidden = !0;
  for (var v552 in loadingElements) {
    if (loadingElements.hasOwnProperty(v552)) {
      dg_hideElement(loadingElements[v552].elem);
    }
  }
  var v553 = document.getElementById("application-splash-wrapper");
  v553.parentElement.removeChild(v553);
}
function dg_createHTMLElements() {
  var v554;
  var v555;
  v554 = ["body {", "    background-color: #2e6cf0;", "}", "", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", "    background-color: #2e6cf0;", "}", "", "#application-splash {", "    position: absolute;", "    top: calc(50% - 28px);", "    width: 264px;", "    left: calc(50% - 132px);", "}", "", "#img_pcLogoLoading  {", "transform: translate(-50%, -50%);", "position:absolute;", "left : 50%;", "top : 50%;", "width : 1px;", "height : 1px;", "z-index: 10;", "}", "", "#img_loadingbar {", "    position:absolute;", "    border-radius: 25px;", "    height: 4px;", "    width: 450px;", "    left : 0;", "    top : 0;", "    background-color:#1848a2;", "    opacity : 0.1;", "    z-index: 10;", "}", "", "#img_loadingbaroverlay {", "    border-radius: 25px;", "    width: 5%;", "    height: 100%;", "    background-color: #fffd33;", "}", "", "@media (max-width: 480px) {", "    #application-splash {", "        width: 170px;", "        left: calc(50% - 85px);", "    }", "}"].join("\n");
  (v555 = document.createElement("style")).type = "text/css";
  if (v555.styleSheet) {
    v555.styleSheet.cssText = v554;
  } else {
    v555.appendChild(document.createTextNode(v554));
  }
  document.head.appendChild(v555);
  var v556 = document.createElement("div");
  v556.id = "application-splash-wrapper";
  document.body.appendChild(v556);
  var v557 = document.createElement("img");
  v557.id = "img_pcLogoLoading";
  v557.src = "data:image/png;base64,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";
  v556.appendChild(v557);
  v557.onload = function () {
    dj_addLoadingElement("img_pcLogoLoading");
    dj_loading(0);
  };
  var v558 = document.createElement("div");
  v558.id = "img_loadingbar";
  v556.appendChild(v558);
  var v559 = document.createElement("div");
  v559.id = "img_loadingbaroverlay";
  v558.appendChild(v559);
  dj_addLoadingElement("img_pcLogoLoading");
  dj_addLoadingElement("img_loadingbar");
  dj_addLoadingElement("img_loadingbaroverlay");
  dj_loading(0);
}
pc.script.createLoadingScreen(function (p631) {
  dg_createHTMLElements();
  p631.on("preload:end", function () {
    p631.off("preload:progress");
  });
  p631.on("preload:progress", function (p632) {
    dj_loading(p632);
    var v560 = document.getElementById("img_loadingbaroverlay");
    if (v560) {
      p632 = Math.min(1, Math.max(0, p632));
      v560.style.width = p632 * 100 + "%";
    }
  });
  p631.on("start", dg_hide_loading_pls);
});
document.title = "Slice Master – Play it now at CoolmathGames.com";
var Sdkmanager = pc.createScript("sdkmanager");
Sdkmanager.instance = null;
Sdkmanager.attributes.add("sdktype", {
  type: "number",
  enum: [{
    TESTING: 0
  }, {
    CRAZYGAMES: 1
  }, {
    COOLMATH: 2
  }, {
    valueThree: 3
  }],
  default: 1
});
Sdkmanager.AD_INTERSTITIAL = 1;
Sdkmanager.AD_REWARDED = 2;
Sdkmanager.SDK_TESTING = 0;
Sdkmanager.SDK_CRAZYGAMES = 1;
Sdkmanager.SDK_COOLMATH = 2;
Sdkmanager.prototype.initialize = function () {
  var vO256 = {
    passive: !1
  };
  Sdkmanager.instance = this;
  this.musicWasEnabled = !0;
  this.soundWasEnabled = !0;
  this.onAdSuccess = null;
  this.adType = 1;
  if (this.sdktype == Sdkmanager.SDK_TESTING) {
    this.testRewardedAdDelay = 0;
    this.testInterstitialAdDelay = 0;
  } else if (this.sdktype == Sdkmanager.SDK_CRAZYGAMES) {
    this.crazysdk = window.CrazyGames.CrazySDK.getInstance();
    this.crazysdk.init();
    this.onAdStarted = function () {
      this.gameMute();
    };
    this.onAdFinished = function () {
      this.gameUnmute();
      this.adRequested = false;
      if (this.adType == 2 && this.onAdSuccess) {
        this.onAdSuccess();
      }
    };
    this.onAdError = function () {
      this.gameUnmute();
      this.adRequested = false;
    };
    this.crazysdk.addEventListener("adStarted", this.onAdStarted.bind(this));
    this.crazysdk.addEventListener("adFinished", this.onAdFinished.bind(this));
    this.crazysdk.addEventListener("adError", this.onAdError.bind(this));
    this.adRequested = false;
    window.addEventListener("wheel", p633 => p633.preventDefault(), vO256);
    window.addEventListener("keydown", p634 => {
      if (["ArrowUp", "ArrowDown", " "].includes(p634.key)) {
        p634.preventDefault();
      }
    });
  } else if (this.sdktype == Sdkmanager.SDK_COOLMATH) {
    this.onAdStarted = function () {
      this.gameMute();
    };
    this.onAdFinished = function () {
      this.gameUnmute();
      if (this.adType == 2 && this.onAdSuccess) {
        this.onAdSuccess();
      }
    };
    document.addEventListener("adBreakStart", this.onAdStarted.bind(this));
    document.addEventListener("adBreakComplete", this.onAdFinished.bind(this));
  }
};
Sdkmanager.prototype.launchSDKfunction = function (p635, p636, p637 = null) {
  if (this.sdktype == p635) {
    if (this.sdktype == Sdkmanager.SDK_CRAZYGAMES) {
      if (p636 == "gameplayStart") {
        this.crazysdk.gameplayStart();
      } else if (p636 == "gameplayStop") {
        this.crazysdk.gameplayStop();
      } else if (p636 == "happytime") {
        this.crazysdk.happytime();
      }
    } else if (this.sdktype == Sdkmanager.SDK_COOLMATH) {
      if (p636 == "start") {
        if (window.self != window.top) {
          if (parent.cmgGameEvent) {
            parent.cmgGameEvent("start");
          }
        } else if (window.cmgGameEvent) {
          window.cmgGameEvent("start");
        }
      } else if (p636 == "startLevel") {
        if (window.self != window.top) {
          if (parent.cmgGameEvent) {
            parent.cmgGameEvent("start", String(p637));
          }
        } else if (window.cmgGameEvent) {
          window.cmgGameEvent("start", String(p637));
        }
      } else if (p636 == "replayLevel") {
        if (window.self != window.top) {
          if (parent.cmgGameEvent) {
            parent.cmgGameEvent("replay", String(p637));
          }
        } else if (window.cmgGameEvent) {
          window.cmgGameEvent("replay", String(p637));
        }
      }
    }
  }
};
Sdkmanager.prototype.gameMute = function () {
  this.musicWasEnabled = !GameAudio.muteMus;
  this.soundWasEnabled = !GameAudio.mute;
  GameAudio.switchMusic(!0);
  GameAudio.switch(!0);
  Input.mouseDis = !0;
};
Sdkmanager.prototype.gameUnmute = function () {
  if (this.musicWasEnabled) {
    GameAudio.switchMusic(false);
  }
  if (this.soundWasEnabled) {
    GameAudio.switch(false);
  }
  Input.mouseDis = !1;
};
Sdkmanager.prototype.showAd = function (p638, p639 = 1, p640 = null) {
  var v561 = false;
  for (var vLN085 = 0; vLN085 < p638.length; vLN085++) {
    if (this.sdktype == p638[vLN085]) {
      v561 = !0;
      break;
    }
  }
  if (v561) {
    this.adType = p639;
    this.onAdSuccess = p640;
    if (this.sdktype == Sdkmanager.SDK_TESTING) {
      if (p639 == Sdkmanager.AD_INTERSTITIAL) {
        this.gameMute();
        this.testInterstitialAdDelay = 2;
      } else if (p639 == Sdkmanager.AD_REWARDED) {
        this.gameMute();
        this.testRewardedAdDelay = 3;
      }
    } else if (this.sdktype == Sdkmanager.SDK_CRAZYGAMES) {
      if (p639 == Sdkmanager.AD_INTERSTITIAL) {
        this.crazysdk.requestAd("midgame");
      } else if (p639 == Sdkmanager.AD_REWARDED) {
        this.crazysdk.requestAd("rewarded");
      }
      this.adRequested = true;
    } else if (this.sdktype == Sdkmanager.SDK_COOLMATH) {
      if (p639 == Sdkmanager.AD_INTERSTITIAL) {
        if (window.cmgAdBreak) {
          window.cmgAdBreak();
        }
      } else if (p639 == Sdkmanager.AD_REWARDED && window.cmgRewardAds) {
        window.cmgRewardAds();
      }
    }
  }
};
Sdkmanager.prototype.update = function (p641) {
  if (this.sdktype == Sdkmanager.SDK_TESTING) {
    if (this.testRewardedAdDelay > 0) {
      this.testRewardedAdDelay -= p641;
      if (this.testRewardedAdDelay <= 0) {
        this.gameUnmute();
        if (this.onAdSuccess) {
          this.onAdSuccess();
        }
      }
    } else if (this.testInterstitialAdDelay > 0) {
      this.testInterstitialAdDelay -= p641;
      if (this.testInterstitialAdDelay <= 0) {
        this.gameUnmute();
      }
    }
  }
};
var MoneyForAdbutton = pc.createScript("moneyForAdbutton");
MoneyForAdbutton.attributes.add("text", {
  type: "entity"
});
MoneyForAdbutton.instance = null;
MoneyForAdbutton.prototype.initialize = function () {
  MoneyForAdbutton.instance = this;
  this.count = 0;
  this.onEnableCb();
  this.on("enable", this.onEnableCb, this);
};
MoneyForAdbutton.prototype.onEnableCb = function (p642) {};
MoneyForAdbutton.prototype.reconfigure = function (p643) {
  this.count = p643;
  if (p643 > 0) {
    if (this.count >= 1000) {
      var v562 = this.count % 1000;
      v562 = Math.floor(v562 / 100);
      this.text.element.text = v562 > 0 ? "$ " + Math.floor(this.count / 1000).toString() + "." + v562.toString() + "k" : "$ " + Math.floor(this.count / 1000).toString() + "k";
    } else {
      this.text.element.text = "$ " + Math.round(this.count).toString();
    }
  }
};
MoneyForAdbutton.prototype.update = function (p644) {};
var UiSerpantine = pc.createScript("uiSerpantine");
var vO258 = {
  type: "rgba",
  array: !0
};
UiSerpantine.attributes.add("colors", vO258);
UiSerpantine.gravity = new pc.Vec3(0, -0.005, 0);
UiSerpantine.scaledVelocity = new pc.Vec3(0, -0.01, 0);
UiSerpantine.prototype.init = function () {
  this.entity.setEulerAngles(0, 0, Math.random() * 360);
  this.velocity = new pc.Vec3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, 0);
  var v563 = this.colors[Math.floor(Math.random() * this.colors.length)];
  this.entity.element.color = v563;
  this.rotationSpeed = pc.math.random(-150, 150);
  this.rotScale = pc.math.random(0, 1);
  this.rotScaleState = pc.math.random(1, 4);
  this.entity.setLocalScale(1, this.rotScale, 1);
};
UiSerpantine.prototype.update = function (p645) {
  this.rotScale += this.rotScaleState * p645;
  if (this.rotScale > 1 && this.rotScaleState > 0) {
    this.rotScale = 1;
    this.rotScaleState = -this.rotScaleState;
  }
  if (this.rotScale < 0 && this.rotScaleState < 0) {
    this.rotScale = 0;
    this.rotScaleState = -this.rotScaleState;
  }
  this.entity.setLocalScale(1, this.rotScale, 1);
  this.velocity.scale(1 - p645 * 3);
  this.velocity.add(UiSerpantine.gravity);
  UiSerpantine.scaledVelocity.copy(this.velocity).scale(p645);
  this.entity.translate(UiSerpantine.scaledVelocity);
  this.entity.rotate(0, 0, this.rotationSpeed * p645);
};
var Glower = pc.createScript("glower");
Glower.attributes.add("minOpacity", {
  type: "number",
  default: 0.3,
  description: "Min opacity"
});
Glower.attributes.add("maxOpacity", {
  type: "number",
  default: 1,
  description: "Max opacity"
});
Glower.attributes.add("speed", {
  type: "number",
  default: 1,
  description: "Anim speed"
});
Glower.prototype.initialize = function () {
  this.elapsedTime = 0;
  this.direction = 1;
};
Glower.prototype.update = function (p646) {
  this.elapsedTime += p646 * this.speed;
  var v564 = this.minOpacity + (this.maxOpacity - this.minOpacity) * 0.5 * (1 + Math.sin(this.elapsedTime * Math.PI * 2));
  this.entity.sprite.opacity = v564;
};
var TextureScroll = pc.createScript("textureScroll");
TextureScroll.attributes.add("shiftAmount", {
  type: "number",
  default: 0.2,
  description: "Amount to shift the texture offset"
});
TextureScroll.attributes.add("interval", {
  type: "number",
  default: 0.1,
  description: "Time interval in seconds for each shift"
});
TextureScroll.attributes.add("mat", {
  type: "asset",
  assetType: "material"
});
TextureScroll.prototype.initialize = function () {
  this.timeSinceLastShift = 0;
  this.currentOffsetU = 0;
  if (this.mat && this.mat.resource) {
    this.material = this.mat.resource;
  } else {
    console.error("Material asset is not set or not loaded.");
  }
};
TextureScroll.prototype.update = function (p647) {
  if (this.material) {
    this.timeSinceLastShift += p647;
    if (this.timeSinceLastShift >= this.interval) {
      this.timeSinceLastShift = 0;
      this.currentOffsetU += this.shiftAmount;
      this.material.diffuseMapOffset.set(this.currentOffsetU, this.material.diffuseMapOffset.y);
      if (this.material.emissiveMap) {
        this.material.emissiveMapOffset.set(this.currentOffsetU, this.material.diffuseMapOffset.y);
      }
      this.material.update();
    }
  }
};
var AdditiveBlending = pc.createScript("additiveBlending");
AdditiveBlending.prototype.initialize = function () {
  var v565 = this.entity.sprite._material.clone();
  v565.blendType = pc.BLEND_ADDITIVEALPHA;
  v565.update();
  this.entity.sprite._meshInstance.material = v565;
  this.enabled = !1;
};
AdditiveBlending.prototype.update = function (p648) {};