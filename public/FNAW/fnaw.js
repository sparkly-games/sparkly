/* 
 * Copyright (C) 2018 Calder Young. All Rights Reserved.
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to Creative
 * Commons, PO Box 1866, Mountain View, CA 94042, USA. 
 */
const DEBUG = false;
const width = 1280;
const height = 720;
const aspect = 16 / 9;
const updateRate = 30;
const frameTime = 1000 / 30;
if (DEBUG) {
  window.addEventListener("error", function (e) {
    alert("ERROR: " + e.message + "\n" + e.filename + ":" + e.lineno + "e.colno");
    return false;
  });
}
window.addEventListener("load", async function () {
  const e = document.getElementById("webglcanvas");
  const t = document.getElementById("2dcanvas");
  const a = e.getContext("webgl");
  const i = t.getContext("2d");
  var n;
  i.imageSmoothingEnabled = false;
  try {
    var r = window.AudioContext || window.webkitAudioContext;
    n = new r();
  } catch (e) {
    alert("your browser does not support AudioContexts so yoo bad you can't play");
    return;
  }
  const o = n.destination;
  if (!a || !(a instanceof WebGLRenderingContext)) {
    alert("your browser does not support webgl so too bad you can't play");
    return;
  }
  var s = 1;
  var c = 1;
  var l = 0;
  var m = 0;
  var f = 0;
  var u = 0;
  var d = false;
  var p = 1;
  var w = 1;
  var g = false;
  var h = false;
  var T = false;
  var E = true;
  var b = false;
  var x = false;
  var v = true;
  var R = [];
  var y = [];
  var _ = [];
  function D() {
    var n = window.innerWidth;
    var r = n / aspect;
    if (r > window.innerHeight && window.innerHeight / r < 0.87) {
      n = (r = window.innerHeight) * aspect;
    }
    var o = Math.min(n, window.innerWidth);
    var f = Math.min(r, window.innerHeight);
    E = !(window.screen.width - o < 20) || !(window.screen.height - f < 20);
    if (document.fullscreenElement) {
      E = false;
    }
    e.width = o;
    e.height = f;
    t.width = o;
    t.height = f;
    s = o / width;
    c = f / height;
    i.setTransform(s, 0, 0, c, 0, 0);
    a.viewport(0, 0, o, f);
    l = (window.innerWidth - o) / 2;
    m = (window.innerHeight - f) / 2;
    if (l > 0 || m > 0) {
      true;
      H();
    } else {
      false;
    }
    e.style.top = m + "px";
    e.style.left = l + "px";
    t.style.top = m + "px";
    t.style.left = l + "px";
  }
  function U(e) {
    f = Math.floor((e.clientX - l) / s);
    u = Math.floor((e.clientY - m) / c);
    if (f < 0) {
      f = 0;
    }
    if (u < 0) {
      u = 0;
    }
    if (f > width) {
      f = width;
    }
    if (u > height) {
      u = height;
    }
  }
  function A() {
    try {
      document.body.requestFullscreen();
    } catch (e) {
      try {
        document.body.webkitRequestFullscreen();
      } catch (e) {
        try {
          document.body.mozRequestFullscreen();
        } catch (e) {}
      }
    }
  }
  async function X(e) {
    return new Promise((t, i) => {
      const n = new Image();
      n.crossOrigin = "anonymous";
      n.onload = function () {
        const e = a.createTexture();
        a.bindTexture(a.TEXTURE_2D, e);
        a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, n);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
        t(e);
      };
      n.onerror = i;
      n.src = e;
    });
  }
  async function k(e) {
    let t = {
      buf: e,
      sync: 0,
      retry: 0
    };
    return new Promise((e, a) => {
      (function e(t, a, i) {
        n.decodeAudioData(t.buf, a, function (n) {
          if (!function (e) {
            var t = new Uint8Array(e.buf);
            t.indexOf = Array.prototype.indexOf;
            for (var a = e.sync, i = t; e.retry++, (a = i.indexOf(255, a)) != -1 && !(i[a + 1] & true);) {
              a++;
            }
            if (a != -1) {
              var n = e.buf.slice(a);
              delete e.buf;
              e.buf = null;
              e.buf = n;
              e.sync = a;
              return true;
            }
            return false;
          }(t)) {
            i(n);
          } else {
            e(t, a, i);
          }
        });
      })(t, function (t) {
        t.buffer = I;
        e(t);
      }, function (e) {
        a(e);
      });
    });
  }
  window.addEventListener("resize", D);
  window.addEventListener("mousemove", U);
  window.addEventListener("mousedown", function () {
    true;
    g = true;
    h = true;
    T = true;
    if (DEBUG) {
      console.log("[x: " + f + ", y: " + u + "]");
    }
  });
  window.addEventListener("mouseup", function () {
    g = false || d;
  });
  window.addEventListener("keydown", function (e) {
    R[e.keyCode] = true;
    y[e.keyCode] = true;
    _[e.keyCode] = true;
  });
  window.addEventListener("keyup", function (e) {
    R[e.keyCode] = false;
  });
  window.addEventListener("touchmove", function (e) {
    if (!v) {
      U(e.touches[0]);
      p = e.touches[0].radiusX;
      p = e.touches[0].radiusY;
      e.preventDefault();
    }
  });
  window.addEventListener("touchstart", function (e) {
    if (!v) {
      U(e.touches[0]);
      p = e.touches[0].radiusX;
      p = e.touches[0].radiusY;
      d = true;
      g = true;
      h = true;
      T = true;
      e.preventDefault();
    }
  });
  window.addEventListener("touchend", function (e) {
    if (!v) {
      d = false;
      g = false;
      e.preventDefault();
    }
  });
  window.addEventListener("touchcancel", function (e) {
    if (!v) {
      d = false;
      g = false;
      e.preventDefault();
    }
  });
  window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    e.cancelBubble = true;
    return false;
  });
  document.addEventListener("selectstart", function (e) {
    e.preventDefault();
    return false;
  });
  var F = [];
  function I() {
    const e = n.createBufferSource();
    F.push(e);
    e.addEventListener("ended", function () {
      var t = F.indexOf(e);
      if (t != -1) {
        F.splice(t, 1);
      }
    });
    e.buffer = this;
    return e;
  }
  function L() {
    for (var e = 0; e < F.length; e++) {
      F[e].stop();
    }
    F = [];
  }
  function j(e, t, a) {
    const i = e.buffer();
    if (a) {
      i.loop = true;
    }
    i.connect(t);
    i.start();
  }
  function S() {
    const e = J.scream.buffer();
    e.connect(K.main);
    e.start(0, 0.05);
  }
  function M(e, t, a, i) {
    const r = e.buffer();
    if (i) {
      r.loop = true;
    }
    const o = n.createGain();
    r.connect(o);
    oa(o, t);
    o.connect(a);
    r.start();
  }
  function C() {
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.NEAREST);
  }
  function B() {
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
  }
  const N = await X("smile.jpg");
  function G(e, t) {
    i.fillText(e, (1280 - i.measureText(e).width) / 2, t);
  }
  function O(e, t, a) {
    i.fillText(e, 1280 - i.measureText(e).width - t, a);
  }
  function P(e, t, a) {
    i.fillText(t, (1280 - i.measureText(e).width) / 2, a);
  }
  function H() {
    return Date.now();
  }
  H();
  function V(e, t) {
    const i = a.createShader(e);
    a.shaderSource(i, t);
    a.compileShader(i);
    if (a.getShaderParameter(i, a.COMPILE_STATUS)) {
      return i;
    } else {
      console.log("shader error: " + a.getShaderInfoLog(i));
      a.deleteShader(i);
      return null;
    }
  }
  function z(e, t) {
    const i = a.createProgram();
    a.attachShader(i, e);
    a.attachShader(i, t);
    a.linkProgram(i);
    if (a.getProgramParameter(i, a.LINK_STATUS)) {
      return new Y(i);
    } else {
      console.log("program error: " + a.getProgramInfoLog(i));
      a.deleteProgram(i);
      return null;
    }
  }
  function Y(e) {
    this.id = e;
    this.attributes = {};
    this.uniforms = {};
  }
  Y.prototype.attribute = function (e) {
    this.attributes[e] = a.getAttribLocation(this.id, e);
  };
  Y.prototype.uniform = function (e) {
    this.uniforms[e] = a.getUniformLocation(this.id, e);
  };
  Y.prototype.bind = function () {
    a.useProgram(this.id);
  };
  var q = {};
  var W = {};
  var J = {};
  var K = {};
  var Q = a.createBuffer();
  function Z(e) {
    a.bindBuffer(a.ARRAY_BUFFER, Q);
    e.bind();
    Ee.exportTo(e);
    var t = e.attributes.vert;
    a.vertexAttribPointer(t, 2, a.FLOAT, false, 0, 0);
    a.enableVertexAttribArray(t);
    a.drawArrays(a.TRIANGLES, 0, 6);
    a.disableVertexAttribArray(t);
  }
  function $(e) {
    a.bindBuffer(a.ARRAY_BUFFER, Q);
    le.bind();
    a.uniform1f(le.uniforms.alpha, e);
    Ee.exportTo(le);
    var t = le.attributes.vert;
    a.vertexAttribPointer(t, 2, a.FLOAT, false, 0, 0);
    a.enableVertexAttribArray(t);
    a.drawArrays(a.TRIANGLES, 0, 6);
    a.disableVertexAttribArray(t);
  }
  function ee(e) {
    a.bindBuffer(a.ARRAY_BUFFER, Q);
    me.bind();
    a.uniform4fv(me.uniforms.color, e);
    Ee.exportTo(me);
    var t = me.attributes.vert;
    a.vertexAttribPointer(t, 2, a.FLOAT, false, 0, 0);
    a.enableVertexAttribArray(t);
    a.drawArrays(a.TRIANGLES, 0, 6);
    a.disableVertexAttribArray(t);
  }
  a.bindBuffer(a.ARRAY_BUFFER, Q);
  a.bufferData(a.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]), a.STATIC_DRAW);
  const te = "#define multimatrix(mat1,mat2,vec) vec2(mat1.x*vec.x + mat1.y*vec.y + mat1.z, mat2.x*vec.x + mat2.y*vec.y + mat2.z)";
  const ae = V(a.VERTEX_SHADER, "#version 100\n " + te + "\n precision mediump float; attribute vec2 vert; varying vec2 uv; uniform vec3 matrixr1; uniform vec3 matrixr2; void main(){ uv = vert; gl_Position = vec4(vec2(-1,1) + multimatrix(matrixr1,matrixr2,vert) / vec2(640,360), 0, 1.0); }");
  const ie = V(a.FRAGMENT_SHADER, "#version 100\n precision mediump float; varying vec2 uv; uniform sampler2D tex; void main(){ gl_FragColor = texture2D(tex, uv); }");
  const ne = V(a.FRAGMENT_SHADER, "#version 100\n precision mediump float; varying vec2 uv; uniform vec4 color; void main(){ gl_FragColor = color; }");
  const re = V(a.FRAGMENT_SHADER, "#version 100\n precision mediump float; varying vec2 uv; uniform float alpha; uniform sampler2D tex; void main(){ gl_FragColor = texture2D(tex, uv); gl_FragColor *= alpha; }");
  const oe = V(a.VERTEX_SHADER, "#version 100\n " + te + "\n precision mediump float; attribute vec2 vert; varying vec2 xy; varying vec2 uv; uniform vec3 matrixr1; uniform vec3 matrixr2; void main(){ vec2 eagler = vec2(-1,1) + multimatrix(matrixr1,matrixr2,vert) / vec2(640,360); xy = eagler; uv = vert; gl_Position = vec4(eagler, 0, 1.0); }");
  const se = V(a.FRAGMENT_SHADER, "#version 100\n precision mediump float; varying vec2 xy; varying vec2 uv; uniform sampler2D tex; uniform float warp; uniform float heightfac;  void main(){ float CurrentSinStep = xy.x / (2.0/3.1415) + 3.1415/2.0; float v = ((uv.y * heightfac) - xy.y * (((sin(CurrentSinStep) / (3.1415/2.0)) - 0.5) * warp - (warp/2.0/3.1415)))/heightfac; gl_FragColor = texture2D(tex, vec2(uv.x, v)); }");
  const ce = z(ae, ie);
  ce.attribute("vert");
  ce.uniform("matrixr1");
  ce.uniform("matrixr2");
  ce.uniform("tex");
  const le = z(ae, re);
  le.attribute("vert");
  le.uniform("matrixr1");
  le.uniform("matrixr2");
  le.uniform("tex");
  le.uniform("alpha");
  const me = z(ae, ne);
  me.attribute("vert");
  me.uniform("matrixr1");
  me.uniform("matrixr2");
  me.uniform("color");
  const fe = z(oe, se);
  fe.attribute("vert");
  fe.uniform("matrixr1");
  fe.uniform("matrixr2");
  fe.uniform("tex");
  fe.uniform("warp");
  fe.uniform("heightfac");
  var ue = 0.3;
  var de = 1;
  function pe(e, t) {
    if (e != ue || t != de) {
      if (e != ue) {
        a.uniform1f(fe.uniforms.warp, e);
        if (DEBUG) {
          console.log("setting warp: " + e);
        }
      }
      if (t != de) {
        a.uniform1f(fe.uniforms.heightfac, t);
        if (DEBUG) {
          console.log("setting heightfac: " + t);
        }
      }
      ue = e;
      de = t;
    }
  }
  fe.bind();
  a.uniform1f(fe.uniforms.warp, 0.3);
  a.uniform1f(fe.uniforms.heightfac, 1);
  a.enable(a.BLEND);
  a.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA);
  var we = 0;
  var ge = 0;
  var he = new XMLHttpRequest();
  he.responseType = "arraybuffer";
  he.addEventListener("progress", function (e) {
    we = e.loaded / e.total;
  });
  he.addEventListener("load", function (e) {
    we = 1;
    untar(he.response).progress(function (e) {
      q[e.name] = {
        buffer: e.buffer,
        url: e.getBlobUrl()
      };
    }).then(async function (e) {
      W.sstatic = {};
      W.sstatic.norm = [];
      W.sstatic.scan = [];
      W.sstatic.heavyscan = [];
      for (var t = 0; t < 6; t++) {
        W.sstatic.norm[t] = await X(q["img/ui/static/norm/" + t + ".jpg"].url);
      }
      for (t = 0; t < 7; t++) {
        W.sstatic.scan[t] = await X(q["img/ui/static/scan/" + t + ".png"].url);
      }
      for (t = 0; t < 5; t++) {
        W.sstatic.heavyscan[t] = await X(q["img/ui/static/heavyscan/" + t + ".png"].url);
      }
      W.title = await X(q["img/ui/title.jpg"].url);
      W.titletext = await X(q["img/ui/titletext.png"].url);
      W.titletext2 = await X(q["img/ui/titletext2.png"].url);
      W.titlenight = [];
      for (t = 1; t <= 5; t++) {
        W.titlenight[t] = await X(q["img/ui/night" + t + ".png"].url);
      }
      W.title6th = await X(q["img/ui/6thnight.png"].url);
      W.title7th = await X(q["img/ui/7thnight.png"].url);
      W.titlebottom = await X(q["img/ui/bottom.png"].url);
      W.titletop = await X(q["img/ui/top.png"].url);
      W.titlestar = await X(q["img/ui/winston.png"].url);
      W.titleselector = await X(q["img/ui/selector.png"].url);
      W.sticky1 = await X(q["img/ui/sticky1.jpg"].url);
      W.sticky2 = await X(q["img/ui/sticky2.jpg"].url);
      W.sticky3 = await X(q["img/ui/sticky3.jpg"].url);
      W.sticky4 = await X(q["img/ui/sticky4.jpg"].url);
      W.sticky4 = await X(q["img/ui/sticky4.jpg"].url);
      W.foundsticky = await X(q["img/ui/foundsticky.png"].url);
      W.skipcall = await X(q["img/ui/skipcall.png"].url);
      W.mutecall = await X(q["img/ui/mutecall.png"].url);
      W.customnight = await X(q["img/ui/custom.jpg"].url);
      W.x = await X(q["img/ui/x.png"].url);
      W.check1 = await X(q["img/ui/check1.jpg"].url);
      W.check2 = await X(q["img/ui/check2.jpg"].url);
      W.check3 = await X(q["img/ui/check3.jpg"].url);
      W.death = await X(q["img/ui/death.jpg"].url);
      W.office = {};
      W.office.normal = await X(q["img/office/normal.jpg"].url);
      W.office.dark1 = await X(q["img/office/dark1.jpg"].url);
      W.office.dark2 = await X(q["img/office/dark2.jpg"].url);
      W.office.llight = await X(q["img/office/llight.jpg"].url);
      W.office.llightl = await X(q["img/office/llightl.jpg"].url);
      W.office.llights = await X(q["img/office/llights.jpg"].url);
      W.office.rlight = await X(q["img/office/rlight.jpg"].url);
      W.office.rlightw = await X(q["img/office/rlightw.jpg"].url);
      W.office.rlights = await X(q["img/office/rlights.jpg"].url);
      W.office.tablewinston = await X(q["img/office/winston.jpg"].url);
      W.office.ldoor = [];
      for (t = 0; t < 8; t++) {
        W.office.ldoor[t] = await X(q["img/office/dl" + t + ".jpg"].url);
      }
      W.office.rdoor = [];
      for (t = 0; t < 8; t++) {
        W.office.rdoor[t] = await X(q["img/office/dr" + t + ".jpg"].url);
      }
      W.office.ldoor.d = await X(q["img/office/dld.jpg"].url);
      W.office.ldoor.l = await X(q["img/office/dll.jpg"].url);
      W.office.rdoor.d = await X(q["img/office/drd.jpg"].url);
      W.office.rdoor.l = await X(q["img/office/drl.jpg"].url);
      W.office.camzone = await X(q["img/ui/camflip.png"].url);
      W.office.cammap = await X(q["img/ui/map.png"].url);
      W.office.overlay = await X(q["img/ui/overlay.png"].url);
      W.office.rec = await X(q["img/ui/rec.png"].url);
      W.office.cam_anim = [];
      for (t = 0; t < 10; t++) {
        W.office.cam_anim[t] = await X(q["img/ui/cam" + t + ".png"].url);
      }
      W.office.js = {};
      W.office.js.longarms = [];
      for (t = 0; t < 25; t++) {
        W.office.js.longarms[t] = await X(q["img/office/jscares/l" + t + ".jpg"].url);
      }
      W.office.js.wierdclimber = [];
      for (t = 0; t < 10; t++) {
        W.office.js.wierdclimber[t] = await X(q["img/office/jscares/w" + t + ".jpg"].url);
      }
      W.office.js.charles = [];
      for (t = 0; t < 20; t++) {
        W.office.js.charles[t] = await X(q["img/office/jscares/c" + t + ".jpg"].url);
      }
      W.office.js.lax = [];
      for (t = 0; t < 18; t++) {
        W.office.js.lax[t] = await X(q["img/office/jscares/d" + t + ".jpg"].url);
      }
      W.office.js.winston = [];
      for (t = 0; t < 15; t++) {
        W.office.js.winston[t] = await X(q["img/office/jscares/s" + t + ".jpg"].url);
      }
      W.office.js.winstondark = [];
      for (t = 0; t < 16; t++) {
        W.office.js.winstondark[t] = await X(q["img/office/jscares/s2" + t + ".jpg"].url);
      }
      W.laxhall = [];
      for (t = 0; t < 21; t++) {
        W.laxhall[t] = await X(q["img/cams/laxdude/" + t + ".jpg"].url);
      }
      async function a(e, t) {
        return X(q["img/cams/cam" + e + t + ".jpg"].url);
      }
      async function i(e, t, a) {
        W.cams[e]["n" + a] = await X(q["img/cams/cam" + t + a + ".jpg"].url);
      }
      W.winstedcam = await X(q["img/cams/winston.png"].url);
      W.cams = [];
      W.cams[0] = {};
      i(0, "00", "");
      i(0, "00", "c0");
      i(0, "00", "c1");
      i(0, "00", "l1");
      i(0, "00", "l1c0");
      i(0, "00", "l1c1");
      W.cams[1] = {};
      i(1, "01", "");
      i(1, "01", "c2");
      i(1, "01", "c2d2");
      i(1, "01", "c2d3");
      i(1, "01", "c2d4");
      i(1, "01", "d2");
      i(1, "01", "d3");
      i(1, "01", "d4");
      i(1, "01", "l3");
      i(1, "01", "l3c2");
      i(1, "01", "l3c2d2");
      i(1, "01", "l3c2d3");
      i(1, "01", "l3c2d4");
      i(1, "01", "l3d2");
      i(1, "01", "l3d3");
      i(1, "01", "l3d4");
      i(1, "01", "l3w3");
      i(1, "01", "w3d3");
      W.cams[2] = {};
      i(2, "02", "");
      i(2, "02", "d1");
      i(2, "02", "d2");
      i(2, "02", "d3");
      i(2, "02", "d4");
      i(2, "02", "l3");
      i(2, "02", "l3d1");
      i(2, "02", "l3d2");
      i(2, "02", "l3d3");
      i(2, "02", "l3d4");
      i(2, "02", "l3w3");
      i(2, "02", "l3w3d1");
      i(2, "02", "l3w3d3");
      i(2, "02", "w3");
      i(2, "02", "w3d1");
      i(2, "02", "w3d2");
      i(2, "02", "w3d3");
      W.cams[3] = {};
      i(3, "03", "");
      i(3, "03", "c4");
      i(3, "03", "l4");
      i(3, "03", "l4c4");
      i(3, "03", "w4");
      W.cams[4] = {};
      i(4, "04", "");
      i(4, "04", "c6");
      i(4, "04", "l5");
      i(4, "04", "l6");
      W.cams[5] = {};
      i(5, "05", "");
      W.cams[6] = {};
      i(6, "06", "");
      i(6, "06", "c11");
      i(6, "06", "l11");
      i(6, "06", "l11w11");
      i(6, "06", "l21");
      i(6, "06", "w11");
      i(6, "06", "w12");
      i(6, "06", "w21");
      W.cams[7] = {};
      i(7, "07", "");
      i(7, "07", "c10");
      i(7, "07", "l10");
      W.cams[8] = {};
      i(8, "08", "");
      W.cams[9] = {};
      i(9, "09", "");
      i(9, "09", "w24");
      W.cams[10] = {};
      i(10, "10", "");
      i(10, "10", "w20");
      W.cams[11] = {};
      i(11, "11", "");
      W.cams[12] = {};
      i(12, "12", "");
      W.cams[13] = {};
      i(13, "13", "");
      i(13, "13", "c13");
      i(13, "13", "w13");
      i(13, "13", "w16");
      W.cams[14] = {};
      i(14, "14", "");
      i(14, "14", "c14");
      i(14, "14", "w14");
      W.cams[15] = {};
      i(15, "15", "");
      i(15, "15", "w15");
      W.cams[16] = {};
      W.cams[16].d = {};
      W.cams[16].l = {};
      W.cams[16].r = {};
      W.cams[16].n = await a("16", "");
      W.cams[16].d.l4 = await a("16", "dl4");
      W.cams[16].d.l4c4 = await a("16", "dl4c4");
      W.cams[16].d.w4 = await a("16", "dw4");
      W.cams[16].l.l7 = await a("16", "ll7");
      W.cams[16].l.lt = await a("16", "llt");
      W.cams[16].l.lf = await a("16", "llf");
      W.cams[16].l.w7 = await a("16", "lw7");
      W.cams[16].l.wt = await a("16", "lwt");
      W.cams[16].l.wf = await a("16", "lwf");
      W.cams[16].r.l18 = await a("16", "rl18");
      W.cams[16].r.lt = await a("16", "rlt");
      W.cams[16].r.lf = await a("16", "rlf");
      W.cams[17] = {};
      i(17, "17", "");
      J.amb = [];
      J.amb[0] = await k(q["sounds/amb1.mp3"].buffer);
      J.amb[1] = await k(q["sounds/amb2.mp3"].buffer);
      J.amb[2] = await k(q["sounds/amb3.mp3"].buffer);
      J.title = await k(q["sounds/title.mp3"].buffer);
      J.nightend = await k(q["sounds/nightend.mp3"].buffer);
      J.static1 = await k(q["sounds/static1.mp3"].buffer);
      J.static2 = await k(q["sounds/static2.mp3"].buffer);
      J.camopen = await k(q["sounds/camopen.mp3"].buffer);
      J.camclose = await k(q["sounds/camclose.mp3"].buffer);
      J.camswitch = await k(q["sounds/camswitch.mp3"].buffer);
      J.lights = await k(q["sounds/lights.wav"].buffer);
      J.office = await k(q["sounds/office.wav"].buffer);
      J.staticloop = await k(q["sounds/staticloop.wav"].buffer);
      J.door = await k(q["sounds/door.mp3"].buffer);
      J.deee = await k(q["sounds/deee.mp3"].buffer);
      J.toilet = await k(q["sounds/toilet.mp3"].buffer);
      J.doorerr = await k(q["sounds/yee2.mp3"].buffer);
      J.powerloss = await k(q["sounds/powerloss.mp3"].buffer);
      J.sticknya = await k(q["sounds/stick_n_ya2.mp3"].buffer);
      J.footsteps = [];
      for (t = 0; t < 6; t++) {
        J.footsteps[t] = await k(q["sounds/moving" + (t + 1) + ".mp3"].buffer);
      }
      J.boilerroom = [];
      for (t = 0; t < 7; t++) {
        J.boilerroom[t] = await k(q["sounds/boiler" + (t + 1) + ".mp3"].buffer);
      }
      J.random = [];
      for (t = 0; t < 2; t++) {
        J.random[t] = await k(q["sounds/random" + (t + 1) + ".mp3"].buffer);
      }
      J.loud = [];
      for (t = 0; t < 5; t++) {
        J.loud[t] = await k(q["sounds/loud" + (t + 1) + ".mp3"].buffer);
      }
      J.atdoor = [];
      for (t = 0; t < 3; t++) {
        J.atdoor[t] = await k(q["sounds/atdoor" + (t + 1) + ".mp3"].buffer);
      }
      J.scream = await k(q["sounds/scream.mp3"].buffer);
      J.call = [];
      for (t = 0; t < 7; t++) {
        J.call[t] = await k(q["sounds/phonecall" + (t + 1) + ".mp3"].buffer);
      }
      J.longarms = await k(q["sounds/heyDude.mp3"].buffer);
      J.weirdclimber = await k(q["sounds/eagler.mp3"].buffer);
      J.winston = await k(q["sounds/yee3.mp3"].buffer);
      J.laxdudecart = await k(q["sounds/cart.mp3"].buffer);
      J.laxdudecrash = await k(q["sounds/crash.mp3"].buffer);
      J.winstonsong = await k(q["sounds/winstonsong.mp3"].buffer);
      J.stickyopen = await k(q["sounds/stickyopen.mp3"].buffer);
      J.glitch = [];
      for (t = 0; t < 4; t++) {
        J.glitch[t] = await k(q["sounds/glitch" + (t + 1) + ".mp3"].buffer);
      }
      function r() {
        (function e() {
          var t = J.glitch[xe(0, 3)];
          var a = n.createBufferSource();
          a.buffer = t;
          a.connect(K.camglitch);
          setTimeout(e, Math.floor(t.duration * 1000));
          a.start();
        })();
        K.ambience = n.createGain();
        oa(K.ambience, 0.2);
        K.ambience.connect(o);
        K.lights = n.createGain();
        oa(K.lights, 0);
        K.lights.connect(o);
        var e = n.createBufferSource();
        e.buffer = J.lights;
        e.loop = true;
        e.connect(K.lights);
        e.start();
        K.office = n.createGain();
        oa(K.office, 0);
        K.office.connect(o);
        var t = n.createBufferSource();
        t.buffer = J.office;
        t.loop = true;
        t.connect(K.office);
        t.start();
        K.sstatic = n.createGain();
        oa(K.sstatic, 0);
        K.sstatic.connect(o);
        var a = n.createBufferSource();
        a.buffer = J.staticloop;
        a.loop = true;
        a.connect(K.sstatic);
        a.start();
      }
      K.main = o;
      K.mute = n.createGain();
      oa(K.mute, 0);
      K.mute.connect(o);
      K.half = n.createGain();
      oa(K.half, 0.5);
      K.half.connect(o);
      K.camglitch = n.createGain();
      oa(K.camglitch, 0);
      K.camglitch.connect(o);
      K.call = n.createGain();
      oa(K.call, 1);
      K.call.connect(o);
      var s;
      var c;
      var l = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"700\" height=\"500\"><foreignObject width=\"100%\" height=\"100%\"><body xmlns=\"http://www.w3.org/1999/xhtml\" style=\"font-size:14px;color:white;\"><div style=\"font-family:monospace;\">" + decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(q["copydisclaimermarkup.txt"].buffer)))) + "</div></body></foreignObject></svg>";
      W.copyinfo = await async function (e) {
        return new Promise((t, a) => {
          let i = new Image();
          i.crossOrigin = "anonymous";
          i.onload = () => t(i);
          i.onerror = a;
          i.src = e;
        });
      }("data:image/svg+xml," + encodeURIComponent(l));
      c = false;
      s = navigator.userAgent || navigator.vendor || window.opera;
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(s) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(s.substr(0, 4))) {
        c = true;
      }
      if (c) {
        alert("five nights at winston's works on mobile but is near impossible to play on most devices");
        x = true;
        v = true;
        document.getElementById("mobilebutton").style.display = "block";
        document.getElementById("allowsound").addEventListener("click", function () {
          A();
          j(J.camopen, K.main);
          r();
          document.getElementById("mobilebutton").style.display = "none";
          setTimeout(function () {
            v = false;
            ge = 1;
          }, 1000);
          zt();
        });
        document.getElementById("enterfull").addEventListener("click", function () {
          setTimeout(function () {
            v = false;
          }, 1000);
          A();
          document.getElementById("fullscreen").style.display = "none";
        });
        document.getElementById("hidefull").addEventListener("click", function () {
          setTimeout(function () {
            v = false;
          }, 1000);
          document.getElementById("fullscreen").style.display = "none";
        });
      } else {
        r();
        ge = 1;
        setTimeout(function () {
          v = false;
        }, 1000);
        zt();
      }
    });
  });
  he.open("GET", "assets.tar", true);
  he.send();
  D();
  var Te = 100;
  var Ee = {
    state: [1, 0, 0, 0, 1, 0],
    stack: [],
    push: function () {
      Ee.stack.push(Ee.state);
    },
    pop: function () {
      Ee.state = Ee.stack.pop();
      if (!Ee.state) {
        Ee.loadIdentity();
      }
    },
    reset: function () {
      Ee.loadIdentity();
      Ee.stack = [];
    },
    loadIdentity: function () {
      Ee.state = [1, 0, 0, 0, 1, 0];
    },
    multiplyVec2: function (e) {
      return [Ee.state[0] * e[0] + Ee.state[1] * e[1] + Ee.state[2], Ee.state[3] * e[0] + Ee.state[4] * e[1] + Ee.state[5]];
    },
    multiplyMat2: function (e) {
      return [Ee.state[0] * e[0] + Ee.state[1] * e[3], Ee.state[0] * e[1] + Ee.state[1] * e[4], Ee.state[0] * e[2] + Ee.state[1] * e[5] + Ee.state[2], Ee.state[3] * e[0] + Ee.state[4] * e[3], Ee.state[3] * e[1] + Ee.state[4] * e[4], Ee.state[3] * e[2] + Ee.state[4] * e[5] + Ee.state[5]];
    },
    translate: function (e) {
      Ee.state = Ee.multiplyMat2([1, 0, e[0], 0, 1, e[1]]);
    },
    rotate: function (e) {
      var t = e * 0.0174533;
      Ee.state = Ee.multiplyMat2([Math.cos(t), Math.sin(t), 0, -Math.sin(t), Math.cos(t), 0]);
    },
    scale: function (e) {
      Ee.state = Ee.multiplyMat2([e[0], 0, 0, 0, e[1], 0]);
    },
    exportTo: function (e) {
      a.uniform3f(e.uniforms.matrixr1, Ee.state[0], Ee.state[1], Ee.state[2]);
      a.uniform3f(e.uniforms.matrixr2, Ee.state[3], Ee.state[4], Ee.state[5]);
    }
  };
  function be(e, t, a, i) {
    if (d) {
      return f >= e - p && f <= a + p && u >= t - w && u <= i + w;
    } else {
      return f >= e && f <= a && u >= t && u <= i;
    }
  }
  function xe(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e;
  }
  var ve = 1;
  var Re = ve;
  var ye = 0;
  var _e = H();
  var De = false;
  var Ue = false;
  var Ae = 0;
  var Xe = 0;
  var ke = false;
  var Fe = false;
  var Ie = 0;
  var Le = false;
  var je = 0;
  var Se = 0;
  var Me = 0;
  var Ce = 17;
  var Be = 17;
  var Ne = 17;
  var Ge = 0;
  var Oe = -1;
  var Pe = 0;
  var He = 0;
  var Ve = 0;
  var ze = 0;
  var Ye = 3;
  var qe = 2;
  var We = 0;
  var Je = 0;
  var Ke = 0;
  var Qe = false;
  var Ze = false;
  var $e = false;
  var et = false;
  var tt = 0;
  var at = H();
  var it = Re;
  var nt = 0;
  var rt = 0;
  var ot = 0;
  var st = 0;
  var ct = 0;
  var lt = H() + 5000;
  var mt = 2;
  var ft = 0;
  var ut = H();
  var dt = false;
  var pt = 0;
  var wt = 0;
  var gt = H();
  var ht = 0;
  var Tt = 0;
  var Et = 0;
  var bt = 0;
  var xt = 0;
  var vt = 999;
  var Rt = false;
  var yt = H();
  var _t = H();
  var Dt = H();
  var Ut = H();
  var At = H();
  var Xt = 0;
  var kt = 0;
  var Ft = H();
  var It = 0;
  var Lt = false;
  var jt = 1;
  var St = true;
  var Mt = H();
  var Ct = 0;
  var Bt = false;
  var Nt = false;
  var Gt = false;
  var Ot = -1;
  var Pt = [{
    name: "3rd star",
    longarms: 20,
    wierdclimber: 20,
    laxdude: 20,
    charles: 20,
    winston: 20,
    infinitepower: false,
    reducedstatic: false,
    noaggression: false
  }, {
    name: "deevile",
    longarms: 15,
    wierdclimber: 15,
    laxdude: 15,
    charles: 15,
    winston: 15,
    infinitepower: false,
    reducedstatic: true,
    noaggression: false
  }, {
    name: "darvy's mode",
    longarms: 20,
    wierdclimber: 20,
    laxdude: 20,
    charles: 20,
    winston: 20,
    infinitepower: true,
    reducedstatic: true,
    noaggression: true
  }, {
    name: "classic fnaw",
    longarms: 8,
    wierdclimber: 8,
    laxdude: 15,
    charles: 0,
    winston: 0,
    infinitepower: false,
    reducedstatic: true,
    noaggression: false
  }, {
    name: "yee challenge",
    longarms: 5,
    wierdclimber: 5,
    laxdude: 5,
    charles: 5,
    winston: 5,
    infinitepower: false,
    reducedstatic: true,
    noaggression: false
  }, {
    name: "eee challenge",
    longarms: 10,
    wierdclimber: 10,
    laxdude: 10,
    charles: 10,
    winston: 10,
    infinitepower: false,
    reducedstatic: false,
    noaggression: false
  }, {
    name: "69420 mode",
    longarms: 6,
    wierdclimber: 9,
    laxdude: 4,
    charles: 2,
    winston: 0,
    infinitepower: true,
    reducedstatic: true,
    noaggression: false
  }, {
    name: "darvy's other mode",
    longarms: 20,
    wierdclimber: 20,
    laxdude: 20,
    charles: 20,
    winston: 20,
    infinitepower: true,
    reducedstatic: true,
    noaggression: false
  }, {
    name: "yeet",
    longarms: 0,
    wierdclimber: 5,
    laxdude: 20,
    charles: 0,
    winston: 0,
    infinitepower: false,
    reducedstatic: false,
    noaggression: true
  }];
  var Ht = {
    name: "you eagler",
    longarms: 6,
    wierdclimber: 9,
    laxdude: 4,
    charles: 2,
    winston: 0,
    infinitepower: false,
    reducedstatic: true,
    noaggression: false
  };
  function Vt() {
    clearTimeout(Me);
    L();
    oa(K.lights, 0);
    oa(K.office, 0);
    oa(K.sstatic, 0);
    oa(K.camglitch, 0);
  }
  function zt() {
    j(J.title, K.main, true);
    M(J.static2, 0.8, K.main);
  }
  function Yt() {
    var e = J.amb[xe(0, 2)];
    j(e, K.ambience);
    Me = setTimeout(Yt, Math.floor(e.duration * 1000));
  }
  var qt = 0.6;
  var Wt = 0.3;
  var Jt = 69;
  function Kt() {
    Ee.push();
    Ee.scale([1280, 720]);
    a.bindTexture(a.TEXTURE_2D, W.sstatic.norm[Jt % 6]);
    Z(ce);
    Ee.pop();
  }
  function Qt() {
    Ee.push();
    Ee.scale([1280, 720]);
    a.bindTexture(a.TEXTURE_2D, W.sstatic.heavyscan[Jt % 5]);
    C();
    Z(ce);
    Ee.pop();
  }
  function Zt() {
    if (Math.random() < 0.03) {
      Ee.push();
      Ee.scale([1280, 720]);
      a.bindTexture(a.TEXTURE_2D, W.sstatic.scan[Jt % 7]);
      C();
      $(0.5);
      Ee.pop();
    }
    if ((qt += Math.random() * 0.1 - 0.05) > 0.5) {
      qt -= 0.01;
    }
    if (qt > 0.7) {
      qt = 0.7;
    }
    if (qt < 0.2) {
      qt = 0.2;
    }
    Ee.push();
    Ee.scale([1280, 720]);
    a.bindTexture(a.TEXTURE_2D, W.sstatic.norm[Jt % 6]);
    $(qt);
    Ee.pop();
  }
  var $t = false;
  const ea = [[363, 236], [266, 246], [224, 228], [170, 210], [141, 255], [5, 228], [231, 136], [117, 133], [4, 125], [231, 54], [181, 35], [136, 15], [5, 38], [351, 175], [308, 98], [342, 61], [106, 218], [98, 38]];
  const ta = ["A Hall - Camera 1", "Main Enterance - Camera 1", "Main Enterance - Camera 2", "A Hall - Camera 4", "Pasillo 2 - Camera 1", "A Hall - Camera 7", "Main Hall - Camera 3", "B Hall - Camera 2", "B Hall - Camera 3", "C Hall - Camera 1", "C Hall - Camera 2", "Pasillo 2 - Camera 2", "C Hall - Camera 5", "Lower Gym - Camera 1", "Upper Gym - Camera 1", "Fitness Center - Camera 1", "A Hall - Camera 6", "C Hall - Camera 4"];
  var aa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var ia = [[0], [0], [1], [2, 1], [3, 16], [4], [4], [16], [16], [16], [7], [6], [6], [13], [14], [15], [13], [6], [16], [16], [10], [6], [], [], [], [], [9]];
  function na(e) {
    if (ke && !dt) {
      for (var t = ia[e], a = H(), i = 0; i < t.length; i++) {
        var n = t[i];
        if (a - aa[n] > 0 && Se == n) {
          aa[t[i]] = Nt ? a + xe(100, 200) : a + xe(5000, 9000);
        } else {
          aa[t[i]] = Nt ? a + xe(50, 100) : a + xe(1000, 2000);
        }
      }
    }
  }
  for (var ra = 0; ra < ea.length; ra++) {
    ea[ra][0] *= 1.25;
    ea[ra][1] *= 1.25;
  }
  function oa(e, t) {
    e.gain.setValueAtTime(t, n.currentTime);
  }
  const sa = "fnaw1_";
  var ca;
  var la = 0.5;
  var ma = 0;
  var fa = 0;
  var ua = false;
  var da = false;
  var pa = false;
  function wa(e) {
    window.localStorage.setItem(sa + "night", e);
    ve = e;
  }
  function ga(e) {
    window.localStorage.setItem(sa + "6th", e ? "1" : "0");
    ua = e;
  }
  function ha(e) {
    window.localStorage.setItem(sa + "7th", e ? "1" : "0");
    da = e;
  }
  function Ta(e) {
    window.localStorage.setItem(sa + "20mode", e ? "1" : "0");
    pa = e;
  }
  function Ea(e) {
    var t;
    var a;
    var i = ia[e];
    t = i.length == 0 ? [364, 191] : ea[i[0]];
    a = ke ? ea[Se] : [366, 212];
    var n = t[0] - a[0];
    var r = t[1] - a[1];
    var o = (280 - Math.sqrt(n * n + r * r)) / 280;
    if (isNaN(o) || o < 0.05) {
      o = 0.05;
    }
    if (o > 1) {
      o = 1;
    }
    return o * 0.5;
  }
  if (!(ca = parseInt(window.localStorage.getItem(sa + "night"))) || ca < 1 || ca > 5 || isNaN(ca)) {
    if (ca < 1) {
      ca = 1;
    }
    if (ca > 5) {
      ca = 5;
    }
    if (isNaN(ca)) {
      ca = 1;
    }
    window.localStorage.setItem(sa + "night", ca);
  }
  ve = ca;
  ga(ua = window.localStorage.getItem(sa + "6th") == "1");
  ha(da = window.localStorage.getItem(sa + "7th") == "1");
  Ta(pa = window.localStorage.getItem(sa + "20mode") == "1");
  setInterval(function () {
    if (!v && b != !E && x) {
      b = !E;
      if (E) {
        document.getElementById("fullscreen").style.display = "block";
        v = true;
      }
    }
    e.style.filter = ke ? "brightness(1.5)" : "none";
    var t;
    var n = H();
    if (++Te % 2 == 0) {
      Jt += 1;
    }
    h = g || T;
    for (var r = 0; r < 255; r++) {
      y[r] = R[r] || y[r];
    }
    i.fillRect(0, 0, 1280, 720);
    i.clearRect(0, 0, 1280, 720);
    i.font = "30px VT323";
    i.fillStyle = "#000000";
    a.clearColor(0, 0, 0, 1);
    a.clear(a.COLOR_BUFFER_BIT);
    Ee.reset();
    Ee.scale([1, -1]);
    if (ge == 0) {
      Ee.push();
      Ee.scale([1280, 720]);
      a.bindTexture(a.TEXTURE_2D, N);
      Z(ce);
      Ee.pop();
      var o = Math.floor(n / 300) % 4;
      if (we < 1) {
        var s = Math.floor(we * 19);
        P("Downloading Assets..", "Downloading Assets" + ".".repeat(o), 660);
        G("[" + "#".repeat(s) + " ".repeat(19 - s) + "]", 700);
      } else if (we < 2) {
        P("Extracting..", "Extracting" + ".".repeat(o), 680);
      } else if (we == 3) {
        G("you eagler", 700);
      }
    } else if (ge == 1) {
      if (be(138, 391, 369, 441) && ma != 0) {
        ma = 0;
        j(J.camswitch, K.main);
      }
      if (be(137, 458, 367, 510) && ma != 1) {
        ma = 1;
        j(J.camswitch, K.main);
      }
      if (be(135, 526, 394, 586) && ma != 2 && ua) {
        ma = 2;
        j(J.camswitch, K.main);
      }
      if (be(129, 597, 474, 661) && ma != 3 && da) {
        ma = 3;
        j(J.camswitch, K.main);
      }
      if (_[38] && ma > 0) {
        ma--;
        j(J.camswitch, K.main);
      }
      if (_[40] && ma < (ua ? da ? 3 : 2 : 1)) {
        ma++;
        j(J.camswitch, K.main);
      }
      Ee.push();
      Ee.scale([1280, 720]);
      a.bindTexture(a.TEXTURE_2D, W.title);
      Z(ce);
      Ee.pop();
      Zt();
      var c = 0;
      if (ua) {
        Ee.push();
        Ee.translate([136, 534]);
        Ee.scale([255, 51]);
        a.bindTexture(a.TEXTURE_2D, W.title6th);
        Z(ce);
        Ee.pop();
        c += 1;
      }
      if (da) {
        Ee.push();
        Ee.translate([134, 604]);
        Ee.scale([340, 50]);
        a.bindTexture(a.TEXTURE_2D, W.title7th);
        Z(ce);
        Ee.pop();
        c += 1;
      }
      if (pa) {
        c += 1;
      }
      Ee.push();
      Ee.translate([134, 55]);
      Ee.scale([295, 457]);
      a.bindTexture(a.TEXTURE_2D, c < 2 ? W.titletext : W.titletext2);
      Z(ce);
      Ee.pop();
      if (ma == 1) {
        Ee.push();
        Ee.translate([152, 505]);
        Ee.scale([72, 18]);
        a.bindTexture(a.TEXTURE_2D, W.titlenight[ve]);
        Z(ce);
        Ee.pop();
      }
      Ee.push();
      if (ma == 1) {
        Ee.translate([80, 467]);
      } else if (ma == 2) {
        Ee.translate([80, 540]);
      } else if (ma == 3) {
        Ee.translate([80, 611]);
      } else {
        Ee.translate([80, 403]);
      }
      Ee.scale([46, 27]);
      a.bindTexture(a.TEXTURE_2D, W.titleselector);
      Z(ce);
      Ee.pop();
      Ee.push();
      Ee.translate([0, 685]);
      Ee.scale([1280, 35]);
      a.bindTexture(a.TEXTURE_2D, W.titlebottom);
      Z(ce);
      Ee.pop();
      Ee.push();
      Ee.translate([980, 0]);
      Ee.scale([300, 70]);
      a.bindTexture(a.TEXTURE_2D, W.titletop);
      Z(ce);
      Ee.pop();
      Ee.push();
      a.bindTexture(a.TEXTURE_2D, W.titlestar);
      Ee.translate([148, 278]);
      Ee.scale([80, 80]);
      r = 0;
      for (; r < c; r++) {
        Z(ce);
        Ee.translate([1.1, 0]);
      }
      Ee.pop();
      if ($t) {
        if (T && !be(200, 50, 1080, 670) || _[27]) {
          $t = false;
        } else {
          i.fillStyle = "#000000";
          i.fillRect(200, 50, 880, 620);
          i.lineWidth = 5;
          i.lineJoin = "bevel";
          i.strokeStyle = "#FFFFFF";
          i.strokeRect(200, 50, 880, 620);
          i.fillStyle = "#FFFFFF";
          i.font = "40px VT323";
          G("Copyright Disclaimer", 100);
          i.drawImage(W.copyinfo, 290, 110, 700, 530);
        }
      }
      if (T) {
        if (ma == 0 && be(138, 391, 369, 441)) {
          wa(1);
          Re = 1;
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        } else if (ma == 1 && be(137, 458, 367, 510)) {
          Re = ve;
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        } else if (ma == 2 && be(135, 526, 394, 586)) {
          Re = 6;
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        } else if (ma == 3 && be(129, 597, 474, 661)) {
          ge = 7;
        } else if (be(460, 686, 704, 719)) {
          $t = true;
        } else if (be(1010, 0, 1280, 70)) {
          window.open("https://g.eags.us/fnaw/explanation.html", "_blank");
        }
      } else if (y[13]) {
        if (ma == 0) {
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        } else if (ma == 1) {
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        } else if (ma == 2) {
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        } else if (ma == 3) {
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        }
      }
      if (y[54] && y[57]) {
        Re = 8;
        L();
        j(J.camswitch, K.main);
        fa = Te;
        ge = 2;
      }
      if (DEBUG && _[32]) {
        L();
        it = 7;
        nt = n;
        ge = 6;
        j(J.sticknya, K.main);
      }
    } else if (ge == 2) {
      i.font = "100px font";
      i.fillStyle = "#FFFFFF";
      G("Night " + Re, 300);
      i.font = "60px font";
      i.fillStyle = "#FFFFFF";
      G("12:00 AM", 380);
      if (Te - fa < 10) {
        Qt();
      }
      if (Te - fa > 70) {
        ye = 0;
        _e = H();
        De = false;
        Ue = false;
        Ae = 0;
        Xe = 0;
        ke = false;
        Fe = false;
        Ie = 0;
        Le = false;
        je = 0;
        Se = 0;
        Me = setTimeout(Yt, 5000);
        Ce = 17;
        Be = 17;
        Ne = 17;
        Ge = 0;
        Oe = -1;
        Pe = 0;
        He = 0;
        Ve = 0;
        ze = 0;
        Bt = false;
        Nt = false;
        Gt = false;
        if (Re == 1) {
          Ye = 3;
          qe = 2;
          We = 0;
          Je = 0;
          Ke = 0;
        } else if (Re == 2) {
          Ye = 6;
          qe = 6;
          We = 0;
          Je = 6;
          Ke = 0;
        } else if (Re == 3) {
          Ye = 9;
          qe = 11;
          We = 5;
          Je = 9;
          Ke = 0;
        } else if (Re == 4) {
          Ye = 14;
          qe = 8;
          We = 8;
          Je = 11;
          Ke = 5;
        } else if (Re == 5) {
          Ye = 13;
          qe = 14;
          We = 13;
          Je = 13;
          Ke = 8;
        } else if (Re == 6) {
          Ye = 16;
          qe = 16;
          We = 16;
          Je = 16;
          Ke = 12;
        } else if (Re == 7) {
          Ye = Ht.longarms;
          qe = Ht.wierdclimber;
          We = Ht.charles;
          Je = Ht.laxdude;
          Ke = Ht.winston;
          Bt = Ht.infinitepower;
          Nt = Ht.reducedstatic;
          Gt = Ht.noaggression;
        } else if (Re == 8) {
          Ye = 20;
          qe = 20;
          We = 20;
          Je = 20;
          Ke = 20;
          Bt = true;
          Nt = true;
          Gt = true;
        }
        Qe = false;
        0;
        Ze = false;
        $e = false;
        et = false;
        tt = 0;
        at = H();
        it = Re;
        nt = 0;
        rt = 0;
        ot = 0;
        st = 0;
        ct = 0;
        lt = H() + 5000;
        mt = 2;
        ft = 0;
        ut = H();
        dt = false;
        pt = 0;
        0;
        0;
        wt = 0;
        gt = H();
        ht = 0;
        Tt = 0;
        Et = 0;
        bt = 0;
        xt = 0;
        vt = 999;
        Rt = false;
        yt = H();
        _t = H();
        Dt = H();
        Ut = H();
        At = H();
        Xt = 0;
        kt = 0;
        Ft = H();
        oa(K.ambience, 0.2);
        It = 0;
        Lt = false;
        St = true;
        Mt = H();
        Ct = 0;
        if (jt == 1 || jt != it) {
          jt = it;
          St = false;
          setTimeout(function () {
            oa(K.call, 1);
            j(J.call[it - 1], K.call);
          }, 5000);
        }
        ge = 3;
      }
    } else if (ge == 3) {
      var l = false;
      var m = false;
      if (ke || Fe) {
        l = be(0, 620, 700, 720) || be(0, 710, 1280, 720);
      } else if (!Lt) {
        l = be(0, 620, It != 0 && It != 69 ? 930 : 1280, 720);
      }
      if (!ke && Te - Ie >= 10 && Fe) {
        ke = true;
        m = true;
        je = Te;
      }
      if (!Le && l && Tt == 0 && !Rt && Te - Ie > 20) {
        Le = true;
        Ie = Te;
        if (ke) {
          j(J.camclose, K.main);
          ke = false;
          if (Ce == 24) {
            Tt = 1;
            Et = Te;
            S();
          } else if (Be == 24) {
            Tt = 2;
            Et = Te;
            S();
          } else if (Oe == 24) {
            Tt = 5;
            Et = Te;
            S();
          } else if (Oe == 25) {
            Oe = 24;
          }
        } else {
          j(J.camopen, K.main);
        }
        Fe = !Fe;
      } else if (Le && !be(0, 620, 1280, 720)) {
        Le = false;
      }
      if (Ge == 6 && Tt == 0) {
        if (De || Gt) {
          j(J.laxdudecrash, K.main);
          if (!Bt) {
            vt -= mt * 10;
          }
          mt += 5;
          Ge = xe(0, 1);
          na(3);
          gt = n;
          ft = 0;
        } else {
          Tt = 4;
          Et = Te;
          S();
          if (ke) {
            j(J.camclose, K.main);
            ke = false;
            Fe = false;
            Le = true;
            Ie = Te;
          }
        }
      }
      if (Ne == 24 && Tt == 0) {
        Tt = 3;
        Et = Te;
        S();
        if (ke) {
          j(J.camclose, K.main);
          ke = false;
          Fe = false;
          Le = true;
          Ie = Te;
        }
      }
      if (n - at > 70000 && (at = n, (tt += 1) != 2 && tt != 3 && tt != 4 || it == 7 || (Ye += 1, qe += 1, We += 1, Je += 1, Ke += 1), tt >= 6 && (Tt == 0 || Tt == 7))) {
        nt = n;
        Vt();
        j(J.nightend, K.main);
        ge = 5;
        return;
      }
      if (n - Dt > 60000 && xe(0, 600) == 0) {
        Dt = n;
        var f = J.random[xe(0, 1)];
        var u = xe(3, 6);
        var d = 0;
        for (r = 0; r < u; r++) {
          setTimeout(function () {
            j(f, K.half);
          }, d);
          if (xe(0, 1) == 0) {
            d += xe(600, 1000);
          } else {
            d += xe(1500, 5000);
          }
        }
      }
      var p = Ce;
      var w = Be;
      var D = Ne;
      var U = Ge;
      var X = Oe;
      if (Tt == 0) {
        if (n - rt > 4959 && xe(0, 5) == 0 && (rt = n, xe(3, 20) < Ye || Pe != 0 && tt > 3 && xe(0, 3) == 1)) {
          var k = Pe == 0 && tt > (it == 1 ? 3 : 2) || xe(0, 2) == 1;
          if (Ce == 17 && Ne != 11) {
            Ce = 11;
            if (Be == 21) {
              Be = 15;
            }
            if (it == 1 && It == 0) {
              It = 1;
            }
          } else if (Ce == 11 || Ce == 21) {
            if ((F = xe(1, 5)) == 1 || F == 2 || k) {
              Ce = 3;
            }
            if ((F == 3 || F == 4) && Ne != 10) {
              Ce = 10;
            }
            if (F == 5) {
              Ce = 21;
            }
          } else if (Ce == 3) {
            var F = xe(1, 3);
            if (n - Pe >= (25 - Ye) * 6000 || F == 1 || F == 3 || k) {
              Ce = 1;
            }
            if (F == 2 && Be != 4) {
              Ce = 4;
            }
          } else if (Ce == 1) {
            if ((F = xe(1, 5)) == 2 || F == 3 || it == 1 && Pe != 0) {
              Ce = 3;
            }
            if (n - Pe >= (25 - Ye) * 4000 || F == 1 || F == 4 || F == 5) {
              Ce = 0;
            }
          } else if (Ce == 0) {
            if (De || Gt) {
              Pe = n;
              Ce = xe(0, 2) == 0 ? 3 : 1;
            } else {
              Ce = 24;
            }
          } else if (Ce == 4) {
            if ((F = xe(1, 5)) == 1 || F == 2 || F == 5 || k) {
              Ce = 3;
            }
            if (F == 3 && Ne != 6) {
              Ce = 5;
            }
            if (F == 4 && Ne != 6) {
              Ce = 6;
            }
          } else if (Ce == 5 || Ce == 6) {
            if (((F = xe(1, 8)) == 1 || F == 2 || F == 3 || F == 4 || !!k) && Be != 4) {
              Ce = 4;
            }
            if ((F == 5 || F == 6) && Ne != 10 && !k) {
              Ce = 10;
            }
            if (F == 7 && !Ze && !k) {
              Ce = 18;
            }
            if (F == 8 && !$e && !et && Be != 7 && Be != 8 && !k) {
              Ce = 7;
            }
          } else if (Ce == 18) {
            Ce = 9;
          } else if (Ce == 9) {
            Ze = true;
            if ((F = xe(1, 2)) == 1) {
              Ce = 5;
            }
            if (F == 2) {
              Ce = 6;
            }
            if (Ne == 6) {
              Ne = 10;
            }
          } else if (Ce == 10) {
            if ((F = xe(1, 7)) == 1 || F == 2 || F == 3 || F == 4 || F == 5) {
              Ce = 6;
            }
            if ((F == 6 || F == 7) && Be != 11 && Be != 21 && Ne != 11) {
              Ce = 21;
            }
          } else if (Ce == 7) {
            Ce = 19;
          } else if (Ce == 19) {
            et = true;
            if ((F = xe(1, 2)) == 1) {
              Ce = 5;
            }
            if (F == 2) {
              Ce = 6;
            }
            if (Ne == 6) {
              Ne = 10;
            }
          }
        }
        if (n - ot > 4933 && xe(0, 5) == 0 && (ot = n, xe(3, 20) < qe)) {
          k = Pe == 0 && tt > (it == 1 ? 3 : 2) || xe(0, 2) == 1;
          if (Be == 17 && Ne != 11) {
            Be = 11;
            if (Ce == 21) {
              Ce = 11;
            }
          } else if (Be == 11 || Be == 21) {
            if ((F = xe(1, 7)) == 1 || F == 2) {
              Be = 14;
              if (Ne == 14) {
                Ne = 13;
              }
            }
            if (F == 3 || F == 4 || k || n - He >= (25 - qe) * 5000) {
              Be = 13;
              if (Ne == 13) {
                Ne = 14;
              }
            }
            if (F == 5) {
              Be = 15;
            }
            if (F == 6) {
              Be = 26;
            }
            if (F == 7) {
              Be = 3;
            }
          } else if (Be == 14) {
            if ((F = xe(1, 5)) == 1 || F == 3 || k || n - He >= (25 - qe) * 5000) {
              Be = 13;
              if (Ne == 13) {
                Ne = 14;
              }
            }
            if (F == 2 || F == 4) {
              Be = 15;
            }
            if (F == 5 && Ne != 11 && Ce != 11 && Ce != 21) {
              Be = 21;
            }
          } else if (Be == 13) {
            F = xe(1, 8);
            if (He == 0 || n - He >= (25 - qe) * 4000 || F == 1 || F == 3 || F == 7 || F == 8 || k) {
              Be = 16;
            }
            if (F == 2 || F == 4) {
              Be = 14;
              if (Ne == 14) {
                Ne = 13;
              }
            }
            if (F == 5 && Ne != 11 && Ce != 11 && Ce != 21) {
              Be = 21;
            }
            if (F == 6 && Ne != 2) {
              Be = 3;
            }
          } else if (Be == 16) {
            Be = 22;
          } else if (Be == 22) {
            Be = 23;
          } else if (Be == 23) {
            if (Ue || Gt) {
              He = n;
              Be = 13;
            } else {
              Be = 24;
            }
          } else if (Be == 15) {
            if ((F = xe(1, 3)) == 1 || k || n - He >= (25 - qe) * 7000) {
              Be = 14;
              if (Ne == 14) {
                Ne = 13;
              }
            }
            if (F == 2 && Ne != 11 && Ce != 11 && Ce != 21) {
              Be = 21;
            }
            if (F == 3) {
              Be = 26;
            }
          } else if (Be == 26) {
            if ((F = xe(1, 3)) == 1 || F == 2) {
              Be = 15;
            }
            if (F == 3) {
              Be = 20;
            }
          } else if (Be == 20) {
            Be = 26;
          } else if (Be == 3) {
            if ((F = xe(1, 2)) == 2 || k) {
              Be = 13;
              if (Ne == 13) {
                Ne = 14;
              }
            }
            if (F == 1 && Ce != 4) {
              Be = 4;
            }
          } else if (Be == 4) {
            if (((F = xe(1, 2)) == 1 || !!k) && Ne != 2) {
              Be = 3;
            }
            if (F == 2 && !$e && !et && Ce != 7 && Ce != 19) {
              Be = 7;
            }
          } else if (Be == 7) {
            Be = 8;
          } else if (Be == 8 && Ce != 4) {
            $e = true;
            Be = 4;
          }
        }
        if (n - st > 4926 && xe(0, 5) == 0 && (st = n, xe(3, 20) < We)) {
          k = Ve == 0 && tt > (it == 1 ? 3 : 2) || xe(0, 2) == 1;
          if (Ne == 17 && Ce != 11 && Be != 11 && Ce != 21 && Be != 21) {
            Ne = 11;
            if (it == 3 && It == 0) {
              It = 3;
            }
          } else if (Ne == 11) {
            if (((F = xe(1, 6)) == 1 || F == 2 || F == 3 || !!k) && Be != 3) {
              Ne = 2;
            }
            if ((F == 4 || F == 5) && Ce != 10) {
              Ne = 10;
            }
            if (F == 6) {
              if (Be != 14) {
                Ne = 14;
              } else if (Be != 13 && Be != 16) {
                Ne = 13;
              }
            }
          } else if (Ne == 10 && Ce != 6 && Ce != 5) {
            Ne = 6;
          } else if (Ne == 2) {
            if ((F = xe(1, 4)) == 1 || F == 2 || k) {
              Ne = 1;
            }
            if (F == 3) {
              Ne = 4;
            }
            if (F == 4 && Be != 13 && Be != 16) {
              Ne = 13;
            }
          } else if (Ne == 4 && Ce != 5 && Ce != 6) {
            Ne = !k && xe(1, 3) != 1 || Be == 3 ? 6 : 2;
          } else if (Ne == 6) {
            if ((F = xe(1, 3)) == 1 || F == 2 || k || n - Ve >= (25 - We) * 9000) {
              Ne = 4;
            }
            if (F == 3 && Ce != 10) {
              Ne = 10;
            }
          } else if (Ne == 10) {
            if (((F = xe(1, 3)) == 1 || F == 2) && Ce != 5 && Ce != 6) {
              Ne = 6;
            }
            if (F == 3 && Ce != 11 && Be != 11 && Ce != 21 && Be != 21) {
              Ne = 11;
            }
          } else if (Ne == 13) {
            if (((F = xe(1, 3)) == 2 || F == 3 || k || n - Ve >= (25 - We) * 6000) && Oe != 3) {
              Ne = 2;
            }
            if (F == 1 && Be != 14) {
              Ne = 14;
            }
          } else if (Ne == 14) {
            if (((F = xe(1, 3)) == 2 || F == 3 || k || n - Ve >= (25 - We) * 6000) && Ce != 11 && Be != 11 && Ce != 21 && Be != 21) {
              Ne = 11;
            }
            if (F == 1 && Be != 13) {
              Ne = 13;
            }
          } else if (Ne == 1) {
            if ((F = xe(1, 2)) == 1 || Ve == 0 || n - Ve >= (25 - We) * 7000) {
              Ne = 0;
            }
            if (F == 2) {
              Ne = Be != 3 ? 2 : 0;
            }
          } else if (Ne == 0 && xe(0, 7) == 1) {
            Ne = xe(0, 1) == 0 && Be != 3 ? 2 : 1;
            Ve = n;
          }
        }
        if (n - pt > 4757 && xe(0, 5) == 0 && (pt = n, xe(3, 20) < Ke)) {
          if (Oe == -1) {
            Oe = 6;
            if (it == 6 && It == 0) {
              It = 4;
            }
          } else if (Oe == 0) {
            if (De || Gt) {
              if (n - ht > 15000) {
                if ((F = xe(1, 2)) == 1) {
                  Oe = 2;
                }
                if (F == 2) {
                  Oe = 1;
                }
                ze = n;
              }
            } else {
              Oe = 25;
            }
          } else if (Oe == 1 || Oe == 2) {
            if (n - ze >= (25 - Ke) * 3000 || xe(0, 3) == 0) {
              if ((F = xe(1, 2)) == 1) {
                Oe = 0;
              }
              if (F == 2) {
                Oe = 13;
              }
            } else {
              Oe = 3;
            }
          } else if (Oe == 3) {
            Oe = n - ze >= (25 - Ke) * 4000 || xe(0, 3) == 0 ? 2 : 4;
          } else if (Oe == 4) {
            Oe = n - ze >= (25 - Ke) * 4000 || xe(0, 1) == 0 ? 2 : 7;
          } else if (Oe == 6) {
            if ((F = xe(1, 11)) == 1 || F == 7 || F == 9) {
              Oe = 1;
            }
            if (F == 2 || F == 8 || F == 10) {
              Oe = 2;
            }
            if (F == 3 || F == 11) {
              Oe = 7;
            }
            if (F == 4) {
              Oe = 15;
            }
            if (F == 5) {
              Oe = 14;
            }
            if (F == 6) {
              Oe = 13;
            }
          } else if (Oe == 7) {
            if ((F = xe(1, 2)) == 1) {
              Oe = 4;
            }
            if (F == 2) {
              Oe = 6;
            }
          } else if (Oe == 15) {
            Oe = 14;
          } else if (Oe == 14) {
            Oe = 13;
          } else if (Oe == 13) {
            Oe = n - ze >= (25 - Ke) * 3500 || xe(0, 3) == 0 ? 22 : 2;
          } else if (Oe == 22) {
            Oe = 23;
          } else if (Oe == 23) {
            if (Ue || Gt) {
              if (n - ht > 15000) {
                Oe = 13;
                ze = n;
              }
            } else {
              Oe = 25;
            }
          }
        }
        if (n - ct > 6579 && xe(0, 20) == 0) {
          ct = n;
          if (xe(3, 20) < Je && Ge < 4) {
            if (n - lt > 2000 + (20 - Je) * 200) {
              Ge += 1;
              gt = n;
              if (ke && Ge == 4 && Se == 0) {
                aa[0] = n + 200;
                j(J.laxdudecart, K.main);
                Ge = 5;
                gt = n;
                je = Te;
                dt = true;
              }
              if (Ge == 1 && xe(0, 2) == 0) {
                j(J.toilet, K.main);
              }
              if (Ge == 2) {
                j(J.deee, K.main);
                if (it == 2 && It == 0) {
                  It = 2;
                }
              }
              na(3);
              if (DEBUG) {
                console.log("lax + 1 > " + Ge);
              }
            } else if (ft > 20000 + (25 - Je) * 1000) {
              Ge = 4;
              gt = n;
              na(3);
              if (ke && Se == 0) {
                aa[0] = n + 200;
                j(J.laxdudecart, K.main);
                Ge = 5;
                gt = n;
                je = Te;
                dt = true;
              }
            }
          }
        }
        var I = [];
        if (Ge != U) {
          I.push(3);
        }
        if ((!ke || Se != 1 && Se != 2) && n - lt > xe(1000, 10000)) {
          ft = 0;
        }
        if (!!ke && (Se == 1 || Se == 2)) {
          lt = n;
        }
        if (Ge == 4 && n - gt > 20000) {
          Ge = 5;
          if (DEBUG) {
            console.log("lax is here");
          }
          gt = n;
        }
        if (Ge == 5 && n - gt > 3000) {
          Ge = 6;
          if (DEBUG) {
            console.log("ur fucked");
          }
          gt = n;
        }
        if (Ce != p) {
          I.push(Ce);
          n;
          na(Ce);
          na(p);
          if (DEBUG) {
            console.log("longarms: " + p + " > " + Ce);
          }
        }
        if (Be != w) {
          I.push(Be);
          n;
          na(Be);
          na(w);
          if (DEBUG) {
            console.log("wierdclimber: " + w + " > " + Be);
          }
        }
        if (Ne != D) {
          I.push(Ne);
          wt = n;
          na(Ne);
          na(D);
          if (DEBUG) {
            console.log("charles: " + D + " > " + Ne);
          }
        }
        if (Oe != X) {
          I.push(Oe);
          ht = n;
          aa[Oe] = Nt ? n + xe(100, 200) : n + xe(3000, 4000);
          if (X != -1) {
            aa[X] = Nt ? n + xe(1000, 2000) : n + xe(15000, 30000);
          }
          if (DEBUG) {
            console.log("winston: " + X + " > " + Oe);
          }
        }
        r = 0;
        for (; r < I.length; r++) {
          const e = I[r];
          setTimeout(function () {
            M(J.footsteps[xe(0, 5)], Ea(e), K.main);
          }, xe(r * 1000, r * 1500 + 2000));
        }
        if (I.length > 0 && n - Ut > xe(75000, 200000)) {
          Ut = n;
          j(J.loud[xe(0, 4)], K.half);
        }
        if (n - Ut > xe(150000, 300000)) {
          Ut = n;
          if (Ne == 2 || xe(0, 2) != 0) {
            j(J.loud[xe(3, 4)], K.main);
          } else {
            j(J.loud[xe(0, 2)], K.half);
          }
        }
        if (((Ce == 0 || Oe == 0) && De || (Be == 23 || Oe == 23) && Ue) && n - Ft > 5000 && xe(0, 60) == 0) {
          Ft = n;
          j(J.atdoor[xe(0, 2)], K.main);
        }
        if ((Be == 22 || Oe == 22) && n - At > 0) {
          var V = J.boilerroom[xe(0, 6)];
          At = n + xe(500, 1500);
          j(V, K.half);
        }
        if (Ne == 25 && n - wt > xe(20000, 35000) - We * 600) {
          Ne = 24;
          wt = n;
        }
      }
      if (ke && Tt == 0) {
        var z = false;
        if (Se == 1 || Se == 2) {
          ft += n - ut;
        }
        if (!De && !Gt && Ne == 0 && n - wt > xe(15000, 30000) - We * 600) {
          Ne = 25;
          wt = n;
          na(0);
          if (DEBUG) {
            console.log("charles is in");
          }
        }
        oa(K.office, 0.03);
        oa(K.sstatic, Math.max((Wt - 0.17) * 0.07, 0));
        if (T) {
          for (r = 0; r < 18; r++) {
            var Y = 760 + ea[r][0];
            var q = 325 + ea[r][1];
            if (be(Y, q, Y + 37, q + 25) && Se != r) {
              j(J.camswitch, K.main);
              je = Te;
              Se = r;
              z = true;
            }
          }
        }
        if (z || m) {
          if (Ge == 4 && Se == 0) {
            j(J.laxdudecart, K.main);
            Ge = 5;
            gt = n;
            dt = true;
          } else {
            dt = false;
          }
        }
        if (n - aa[Se] > 0) {
          oa(K.camglitch, 0);
          if (Se == 17) {
            a.bindTexture(a.TEXTURE_2D, W.cams[17].n);
            var Q = 360 + (te = 640);
            if ((ae = Math.abs((Te * 3 + 5464) % (Q * 2) - Q) - 180) < 0) {
              ae = 0;
            }
            if (ae > te) {
              ae = te;
            }
            Ee.push();
            Ee.translate([-ae, 0]);
            Ee.scale([1920, 720]);
            fe.bind();
            pe(0.3, 1);
            Z(fe);
            Ee.pop();
          } else if (Se == 16) {
            var te;
            var ae;
            a.bindTexture(a.TEXTURE_2D, W.cams[16].n);
            Q = 360 + (te = 1280);
            if ((ae = Math.abs((Te * 3 + 43234) % (Q * 2) - Q) - 180) < 0) {
              ae = 0;
            }
            if (ae > te) {
              ae = te;
            }
            fe.bind();
            pe(0.4, 1);
            Ee.push();
            Ee.translate([-ae, 0]);
            Ee.scale([2560, 720]);
            Z(fe);
            Ee.pop();
            Ee.push();
            Ee.translate([1350 - ae, 0]);
            Ee.scale([1210, 720]);
            if (Ce == 18) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].r.l18);
              Z(fe);
            } else if (Ce == 9) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].r.lt);
              Z(fe);
            } else if (Ze) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].r.lf);
              Z(fe);
            }
            Ee.pop();
            Ee.push();
            Ee.translate([-ae, 0]);
            Ee.scale([1250, 720]);
            if (Ce == 7) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].l.l7);
              Z(fe);
            } else if (Ce == 19) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].l.lt);
              Z(fe);
            } else if (et) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].l.wf);
              Z(fe);
            } else if (Be == 7) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].l.w7);
              Z(fe);
            } else if (Be == 8) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].l.lt);
              Z(fe);
            } else if ($e) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].l.wf);
              Z(fe);
            }
            Ee.pop();
            Ee.push();
            Ee.translate([1645 - ae, 0]);
            Ee.scale([280, 370]);
            fe.bind();
            pe(0.4, 280 / 720);
            if (Ce == 4 && Ne == 4) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].d.l4c4);
              Z(fe);
            } else if (Ce == 4) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].d.l4);
              Z(fe);
            } else if (Be == 4) {
              a.bindTexture(a.TEXTURE_2D, W.cams[16].d.w4);
              Z(fe);
            }
            Ee.pop();
          } else if (Se == 0 && dt) {
            var ie = Te - je;
            if (ie <= 50) {
              if (ie <= 10) {
                a.bindTexture(a.TEXTURE_2D, W.laxhall[0]);
              } else {
                a.bindTexture(a.TEXTURE_2D, W.laxhall[Math.floor((ie - 10) / 2)]);
              }
              Ee.push();
              Ee.scale([1280, 720]);
              Z(ce);
              Ee.pop();
              if (ie >= 50) {
                aa[0] = Nt ? n + 100 : n + 5000;
                dt = false;
              }
            }
          } else {
            Ee.push();
            a.bindTexture(a.TEXTURE_2D, Se == 0 ? Ce == 1 && Ne == 0 ? W.cams[0].nl1c1 : Ce == 1 && Ne == 1 ? W.cams[0].nl1c0 : Ne == 0 ? W.cams[0].nc0 : Ne == 1 ? W.cams[0].nc1 : Ce == 1 ? W.cams[0].nl1 : W.cams[0].n : Se == 1 ? Ge == 2 ? Ce == 3 && Ne == 2 ? W.cams[1].nl3c2d2 : Ce == 3 ? W.cams[1].nl3d2 : Ne == 2 ? W.cams[1].nc2d2 : W.cams[1].nd2 : Ge == 3 ? Ce == 3 && Ne == 2 ? W.cams[1].nl3c2d3 : Ce == 3 ? W.cams[1].nl3d3 : Ne == 2 ? W.cams[1].nc2d3 : Be == 3 ? W.cams[1].nw3d3 : W.cams[1].nd3 : Ge >= 4 ? Ce == 3 && Ne == 2 ? W.cams[1].nl3c2d4 : Ce == 3 ? W.cams[1].nl3d4 : Ne == 2 ? W.cams[1].nc2d4 : W.cams[1].nd4 : Ce == 3 && Be == 3 ? W.cams[1].nl3w3 : Ce == 3 && Ne == 2 ? W.cams[1].nl3c2 : Ne == 2 ? W.cams[1].nc2 : Ce == 3 ? W.cams[1].nl3 : W.cams[1].n : Se == 2 ? Ge == 1 ? Ce == 3 && Be == 3 ? W.cams[2].nl3w3d1 : Ce == 3 ? W.cams[2].nl3d1 : Be == 3 ? W.cams[2].nw3d1 : W.cams[2].nd1 : Ge == 2 ? Ce == 3 ? W.cams[2].nl3d2 : Be == 3 ? W.cams[2].nw3d2 : W.cams[2].nd2 : Ge == 3 ? Ce == 3 && Be == 3 ? W.cams[2].nl3w3d3 : Ce == 3 ? W.cams[2].nl3d3 : Be == 3 ? W.cams[2].nw3d3 : W.cams[2].nd3 : Ge >= 4 ? Ce == 3 ? W.cams[2].nl3d4 : W.cams[2].nd4 : Ce == 3 && Be == 3 ? W.cams[2].nl3w3 : Ce == 3 ? W.cams[2].nl3 : Be == 3 ? W.cams[2].nw3 : W.cams[2].n : Se == 3 ? Ne == 4 && Ce == 4 ? W.cams[3].nl4c4 : Be == 4 ? W.cams[3].nw4 : Ne == 4 ? W.cams[3].nc4 : Ce == 4 ? W.cams[3].nl4 : W.cams[3].n : Se == 4 ? Ne == 6 ? W.cams[4].nc6 : Ce == 5 ? W.cams[4].nl5 : Ce == 6 ? W.cams[4].nl6 : W.cams[4].n : Se == 5 ? W.cams[5].n : Se == 6 ? Ce == 11 && Be == 11 ? W.cams[6].nl11w11 : Ce == 11 ? W.cams[6].nl11 : Ne == 11 ? W.cams[6].nc11 : Ce == 21 ? W.cams[6].nl21 : Be == 11 ? W.cams[6].nw11 : Be == 12 ? W.cams[6].nw12 : Be == 21 ? W.cams[6].nw21 : W.cams[6].n : Se == 7 ? Ne == 10 ? W.cams[7].nc10 : Ce == 10 ? W.cams[7].nl10 : W.cams[7].n : Se == 8 ? W.cams[8].n : Se == 9 ? Be == 26 ? W.cams[9].nw24 : W.cams[9].n : Se == 10 ? Be == 20 ? W.cams[10].nw20 : W.cams[10].n : Se == 11 ? W.cams[11].n : Se == 12 ? W.cams[12].n : Se == 13 ? Be == 16 ? W.cams[13].nw16 : Be == 13 ? W.cams[13].nw13 : Ne == 13 ? W.cams[13].nc13 : W.cams[13].n : Se == 14 ? Be == 14 ? W.cams[14].nw14 : Ne == 14 ? W.cams[14].nc14 : W.cams[14].n : Se == 15 ? Be == 15 ? W.cams[15].nw15 : W.cams[15].n : undefined);
            Ee.scale([1280, 720]);
            Z(ce);
            Ee.pop();
          }
          if (Oe == Se) {
            if (Se == 0) {
              aa[0] = n + 1000;
            } else {
              Ee.push();
              a.bindTexture(a.TEXTURE_2D, W.winstedcam);
              Ee.scale([1280, 720]);
              Z(ce);
              Ee.pop();
            }
          }
          if ((Wt += Math.random() * 0.07 - 0.035) > 0.3) {
            Wt -= 0.01;
          }
          if (Wt > 0.5) {
            Wt = 0.5;
          }
          if (Wt < 0.15) {
            Wt = 0.15;
          }
          Ee.push();
          Ee.scale([1280, 720]);
          a.bindTexture(a.TEXTURE_2D, W.sstatic.norm[Jt % 6]);
          $(Wt);
          Ee.pop();
        } else {
          oa(K.camglitch, 1);
          Kt();
        }
        Ee.push();
        Ee.scale([1280, 720]);
        a.bindTexture(a.TEXTURE_2D, W.office.overlay);
        Z(ce);
        Ee.pop();
        if (Math.floor(Te / 20) % 2 == 0) {
          Ee.push();
          Ee.translate([578, 30]);
          Ee.scale([103, 28]);
          a.bindTexture(a.TEXTURE_2D, W.office.rec);
          Z(ce);
          Ee.pop();
        }
        if (Qe && (be(900, 0, 1280, 720) || be(0, 600, 1280, 720))) {
          Qe = false;
        }
        if (!Qe && !be(730, 0, 1280, 720) && !be(0, 500, 1280, 720)) {
          Qe = true;
        }
        if (Qe) {
          Ee.push();
          Ee.translate([1040, 530]);
          r = 0;
          for (; r < 18; r++) {
            Ee.push();
            var ne = ea[r];
            ne = [ne[0] * 0.4, ne[1] * 0.4];
            Ee.translate(ne);
            Ee.scale([15, 10]);
            if (r == Se && Math.floor(Te / 15) % 2 == 0) {
              ee([0.551 / 1.5, 0.68 / 1.5, 0, 1]);
            } else {
              ee([0.258 / 1.5, 0.258 / 1.5, 0.258 / 1.5, 1]);
            }
            Ee.pop();
          }
          Ee.push();
          Ee.scale([200, 150]);
          a.bindTexture(a.TEXTURE_2D, W.office.cammap);
          B();
          Z(ce);
          Ee.pop();
          Ee.pop();
        } else {
          Ee.push();
          Ee.translate([760, 325]);
          for (var r = 0; r < 18; r++) {
            Ee.push();
            Ee.translate(ea[r]);
            Ee.scale([37, 25]);
            if (r == Se && Math.floor(Te / 15) % 2 == 0) {
              ee([0.551 / 1.5, 0.68 / 1.5, 0, 1]);
            } else {
              ee([0.258 / 1.5, 0.258 / 1.5, 0.258 / 1.5, 1]);
            }
            Ee.pop();
          }
          i.font = "20px font";
          i.fillStyle = "#FFFFFF";
          i.fillText(ta[Se], 770, 332);
          Ee.push();
          Ee.scale([500, 375]);
          a.bindTexture(a.TEXTURE_2D, W.office.cammap);
          C();
          Z(ce);
          Ee.pop();
          Ee.pop();
        }
        if (Te - je < 10) {
          Qt();
        }
      } else {
        oa(K.office, Rt ? 0 : 0.1);
        oa(K.sstatic, 0);
        oa(K.camglitch, 0);
        if (Rt) {
          oa(K.ambience, 0);
        }
        if (be(0, 0, 200, 720)) {
          ye -= 10;
        }
        if (be(0, 0, 400, 720)) {
          ye -= 5;
        }
        if (be(880, 0, 1280, 720)) {
          ye += 5;
        }
        if (be(1080, 0, 1280, 720)) {
          ye += 10;
        }
        if (T && !Rt && Tt == 0) {
          if (be(64, 492, 118, 566)) {
            if (Ce == 24 || Oe == 24 || Oe == 25) {
              j(J.doorerr, K.main);
            } else {
              j(J.door, K.main);
              De = !De;
              Ae = Te;
            }
          } else if (be(1176, 486, 1217, 572)) {
            if (Be == 24 || Oe == 24 || Oe == 25) {
              j(J.doorerr, K.main);
            } else {
              j(J.door, K.main);
              Ue = !Ue;
              Xe = Te;
            }
          }
          if (!!be(61, 320, 90, 370) && (Ce == 24 || Oe == 24 || Oe == 25)) {
            j(J.doorerr, K.main);
          }
          if (!!be(1205, 318, 1231, 369) && (Be == 24 || Oe == 24 || Oe == 25)) {
            j(J.doorerr, K.main);
          }
        }
        if (h && !Rt && Tt == 0) {
          if (be(61, 320, 90, 370) && Ce != 24 && Oe != 24 && Oe != 25) {
            if (bt == 0) {
              if (Oe == 0) {
                if (!De) {
                  j(J.winston, K.main);
                }
                bt = W.office.llights;
              } else if (Ce == 0) {
                if (!De) {
                  j(J.longarms, K.main);
                }
                bt = W.office.llightl;
              } else {
                bt = W.office.llight;
              }
            }
          } else {
            bt = 0;
          }
          if (be(1205, 318, 1231, 369) && Be != 24 && Oe != 24 && Oe != 25) {
            if (xt == 0) {
              if (Oe == 23) {
                if (!Ue) {
                  j(J.winston, K.main);
                }
                xt = W.office.rlights;
              } else if (Be == 23) {
                if (!Ue) {
                  j(J.weirdclimber, K.main);
                }
                xt = W.office.rlightw;
              } else {
                xt = W.office.rlight;
              }
            }
          } else {
            xt = 0;
          }
        } else {
          xt = 0;
          bt = 0;
        }
        if (Tt == 4) {
          ye -= 50;
        }
        if (ye < 0) {
          ye = 0;
        }
        if (ye > 384) {
          ye = 384;
        }
        var re = 0;
        fe.bind();
        pe(0.3, 1);
        if (Tt == 0) {
          Ee.push();
          Ee.translate([-ye, 0]);
          Ee.scale([1664, 720]);
          a.bindTexture(a.TEXTURE_2D, W.office.normal);
          Z(fe);
          Ee.pop();
          if (Oe == 24) {
            pe(0.3, 235 / 720);
            a.bindTexture(a.TEXTURE_2D, W.office.tablewinston);
            Ee.push();
            Ee.translate([730 - ye, 205]);
            Ee.scale([245, 235]);
            Z(fe);
            Ee.pop();
          }
          if (Te - Ae < 8) {
            if (De) {
              a.bindTexture(a.TEXTURE_2D, W.office.ldoor[Te - Ae]);
            } else {
              a.bindTexture(a.TEXTURE_2D, W.office.ldoor[7 - (Te - Ae)]);
            }
            Ee.push();
            Ee.translate([-ye, 0]);
            Ee.scale([375, 720]);
            Z(fe);
            Ee.pop();
          } else if (De) {
            if (bt != 0) {
              re = 1;
              a.bindTexture(a.TEXTURE_2D, W.office.ldoor.l);
            } else {
              a.bindTexture(a.TEXTURE_2D, W.office.ldoor.d);
            }
            Ee.push();
            Ee.translate([-ye, 0]);
            Ee.scale([375, 720]);
            Z(fe);
            Ee.pop();
          } else if (bt != 0) {
            re = 1;
            Ee.push();
            Ee.translate([-ye, 0]);
            Ee.scale([525, 720]);
            a.bindTexture(a.TEXTURE_2D, bt);
            Z(fe);
            Ee.pop();
          }
          if (Te - Xe < 8) {
            if (Ue) {
              a.bindTexture(a.TEXTURE_2D, W.office.rdoor[Te - Xe]);
            } else {
              a.bindTexture(a.TEXTURE_2D, W.office.rdoor[7 - (Te - Xe)]);
            }
            Ee.push();
            Ee.translate([1664 - ye - 375, 0]);
            Ee.scale([375, 720]);
            Z(fe);
            Ee.pop();
          } else if (Ue) {
            if (xt != 0) {
              re = 1;
              a.bindTexture(a.TEXTURE_2D, W.office.rdoor.l);
            } else {
              a.bindTexture(a.TEXTURE_2D, W.office.rdoor.d);
            }
            Ee.push();
            Ee.translate([1664 - ye - 375, 0]);
            Ee.scale([375, 720]);
            Z(fe);
            Ee.pop();
          } else if (xt != 0) {
            re = 1;
            Ee.push();
            Ee.translate([1664 - ye - 525, 0]);
            Ee.scale([525, 720]);
            a.bindTexture(a.TEXTURE_2D, xt);
            Z(fe);
            Ee.pop();
          }
        } else {
          var oe = false;
          var se = Te - Et;
          if (Tt == 1) {
            a.bindTexture(a.TEXTURE_2D, W.office.js.longarms[se]);
            Ee.push();
            Ee.scale([1280, 720]);
            Z(fe);
            Ee.pop();
            if (se >= 24) {
              oe = true;
            }
          } else if (Tt == 2) {
            var le = se > 9 ? 9 : se;
            a.bindTexture(a.TEXTURE_2D, W.office.js.wierdclimber[le]);
            Ee.push();
            Ee.scale([1280, 720]);
            Z(fe);
            Ee.pop();
            if (se >= 19) {
              oe = true;
            }
          } else if (Tt == 3) {
            Ee.push();
            Ee.translate([-ye, 0]);
            Ee.scale([1664, 720]);
            a.bindTexture(a.TEXTURE_2D, W.office.js.charles[se]);
            Z(fe);
            Ee.pop();
            if (se >= 19) {
              oe = true;
            }
            if (se < 17) {
              if (Ue) {
                a.bindTexture(a.TEXTURE_2D, W.office.rdoor.d);
                Ee.push();
                Ee.translate([1664 - ye - 375, 0]);
                Ee.scale([375, 720]);
                Z(fe);
                Ee.pop();
              }
              if (De) {
                a.bindTexture(a.TEXTURE_2D, W.office.ldoor.d);
                Ee.push();
                Ee.translate([-ye, 0]);
                Ee.scale([375, 720]);
                Z(fe);
                Ee.pop();
              }
            }
          } else if (Tt == 4) {
            Ee.push();
            Ee.translate([-ye, 0]);
            Ee.scale([1664, 720]);
            a.bindTexture(a.TEXTURE_2D, W.office.js.lax[se]);
            Z(fe);
            Ee.pop();
            if (se >= 17) {
              oe = true;
            }
            if (Ue) {
              a.bindTexture(a.TEXTURE_2D, W.office.rdoor.d);
              Ee.push();
              Ee.translate([1664 - ye - 375, 0]);
              Ee.scale([375, 720]);
              Z(fe);
              Ee.pop();
            }
          } else if (Tt == 5) {
            a.bindTexture(a.TEXTURE_2D, W.office.js.winston[se]);
            Ee.push();
            Ee.scale([1280, 720]);
            Z(fe);
            Ee.pop();
            if (se >= 14) {
              oe = true;
            }
          } else if (Tt == 6) {
            a.bindTexture(a.TEXTURE_2D, W.office.js.winstondark[se]);
            Ee.push();
            Ee.scale([1280, 720]);
            Z(ce);
            Ee.pop();
            if (se >= 15) {
              oe = true;
            }
          } else if (Tt == 7) {
            if (kt == 0 && n - nt > 5000) {
              kt = 1;
              Xt = ye;
              j(J.winstonsong, K.main);
            }
            var me = Xt - ye;
            if (me < 0) {
              me = -me;
            }
            var ue = me * 50;
            if (ue > 20000) {
              ue = 20000;
            }
            if (kt == 1 && n - nt > 39000 - ue) {
              kt = 2;
              nt = n;
              Xt = ye;
              L();
            }
            if (kt == 2 && n - nt > xe(300, 1000)) {
              kt = 3;
            }
            if (kt == 3 && n - nt > 20000 - ue - me * 10) {
              Tt = 6;
              Et = Te;
              L();
              S();
            }
            var de = kt != 2 || xe(0, 2) == 0;
            if (kt < 3 && de) {
              a.bindTexture(a.TEXTURE_2D, W.office.dark1);
              Ee.push();
              Ee.translate([-ye, 0]);
              Ee.scale([1664, 720]);
              Z(fe);
              Ee.pop();
            }
            oa(K.office, kt == 2 && de ? 0.05 : 0);
            if (kt == 1 && (Te / 2 ^ 3566) % 3 != 0) {
              pe(0.3, 150 / 720);
              a.bindTexture(a.TEXTURE_2D, W.office.dark2);
              Ee.push();
              Ee.translate([173 - ye, 100]);
              Ee.scale([110, 150]);
              Z(fe);
              Ee.pop();
            }
          }
          if (oe) {
            Vt();
            j(J.static1, K.main);
            ge = 4;
            nt = n;
            return;
          }
        }
        oa(K.lights, re);
        if (E && n - _e < 10000) {
          i.font = "20px VT323";
          i.fillStyle = "#FFFFFF";
          G("press F to enter fullscreen and hide this message", 50);
        }
        var he = Tt == 0 ? Te - Ie : (Te - Ie) * 2 + 3;
        if (he < 10) {
          if (Fe) {
            a.bindTexture(a.TEXTURE_2D, W.office.cam_anim[he]);
          } else {
            a.bindTexture(a.TEXTURE_2D, W.office.cam_anim[9 - he]);
          }
          Ee.push();
          Ee.scale([1280, 720]);
          Z(ce);
          Ee.pop();
        } else if (!Rt && Tt == 0) {
          if (!Le) {
            a.bindTexture(a.TEXTURE_2D, W.office.camzone);
            Ee.push();
            Ee.translate([320, 650]);
            Ee.scale([600, 60]);
            Z(ce);
            Ee.pop();
          }
          if (!St && n - Mt > 6000 && n - Mt < 15000) {
            if (it == 1) {
              a.bindTexture(a.TEXTURE_2D, W.skipcall);
              if (T && be(10, 10, 110, 45)) {
                tt = 2;
                Ye += 1;
                qe += 1;
                Ct = n + 1000;
                vt -= 200;
                oa(K.call, 0);
                j(J.staticloop, K.main);
                St = true;
              }
            } else {
              a.bindTexture(a.TEXTURE_2D, W.mutecall);
              if (T && be(10, 10, 110, 45)) {
                oa(K.call, 0);
                St = true;
              }
            }
            Ee.push();
            Ee.translate([10, 10]);
            Ee.scale([100, 35]);
            Z(ce);
            Ee.pop();
          }
          if (It != 0 && It != 69) {
            if (Lt) {
              a.bindTexture(a.TEXTURE_2D, It == 1 ? W.sticky1 : It == 2 ? W.sticky2 : It == 3 ? W.sticky3 : W.sticky4);
              Ee.push();
              Ee.translate([490, 200]);
              Ee.scale([300, 300]);
              Z(ce);
              Ee.pop();
              if (_[27] || T && !be(490, 200, 790, 500) && !be(1070, 585, 1280, 720)) {
                Lt = false;
                It = 69;
              }
            } else {
              a.bindTexture(a.TEXTURE_2D, W.foundsticky);
              C();
              Ee.push();
              Ee.translate([1070, 585]);
              Ee.scale([200, 125]);
              $(Math.sin(Te / 5) / 13 + 0.6);
              Ee.pop();
              B();
              if (T && be(1070, 585, 1280, 720)) {
                j(J.stickyopen, K.main);
                Lt = true;
              }
            }
          }
          if (n - Ct < 0) {
            Kt();
          }
        }
        la += Math.random() * 0.1 - 0.06;
        if (Math.random() < 0.001) {
          la += Math.random() * 0.7 - 0.35;
        }
        if (la < 0) {
          la = 0;
        }
        if (la > 0.3) {
          la -= 0.2;
        }
        if (la > 1) {
          la = 1;
        }
        Ee.push();
        Ee.scale([1280, 720]);
        ee([0, 0, 0, la * 0.3]);
        Ee.pop();
      }
      var qt = 1;
      if (bt != 0 || xt != 0) {
        qt += 1;
      }
      if (Ue) {
        qt += 1;
      }
      if (De) {
        qt += 1;
      }
      if (ke) {
        qt += 1;
      }
      if (it == 2 && n - _t > 6000 || it == 3 && n - _t > 5000 || it == 4 && n - _t > 4000 || it >= 5 && n - _t > 3000 && !Bt) {
        _t = n;
        vt -= 1;
      }
      if (n - yt >= 1000 && !Bt) {
        yt = n;
        if ((vt -= qt) <= 5 && !Rt) {
          if (De) {
            De = false;
            Ae = Te;
            j(J.door, K.main);
          }
          if (Ue) {
            Ue = false;
            Xe = Te;
            j(J.door, K.main);
          }
          if (ke) {
            Ie = Te;
            Fe = false;
            ke = false;
          }
          Rt = true;
        }
      }
      if (Tt == 0 && (vt <= 0 && (Tt = 7, oa(K.office, 0), oa(K.sstatic, 0), oa(K.camglitch, 0), oa(K.ambience, 0), nt = n, j(J.powerloss, K.main)), !Lt && n - Ct > 100)) {
        var ia = Math.floor(vt / 10);
        i.font = "40px font";
        i.fillStyle = "#FFFFFF";
        O(tt == 0 ? "12\u2002AM" : tt + "\u2002AM", 40, 65);
        i.font = "20px font";
        O("Night " + it, 40, 95);
        i.fillText("Power Left:   %", 40, 650);
        i.font = "26.5px font";
        i.fillText(ia < 10 ? " " + ia : ia, 177, 650);
        i.font = "20px font";
        i.fillText("Usage:\u2008" + "#".repeat(qt), 40, 680);
      }
      ut = n;
    } else if (ge == 4) {
      if (n - nt < 10000) {
        Kt();
      } else if (n - nt < 15000) {
        a.bindTexture(a.TEXTURE_2D, W.death);
        Ee.push();
        Ee.scale([1280, 720]);
        Z(ce);
        Ee.pop();
      } else {
        ge = 1;
        zt();
      }
    } else if (ge == 5) {
      var ra = (n - nt - 2000) / 1000;
      if (ra < 0) {
        ra = 0;
      }
      if (ra > 1) {
        ra = 1;
      }
      ra *= 150;
      i.fillStyle = "#FFFFFF";
      i.font = "150px font";
      G("5   ", 410 - ra);
      G("6   ", 560 - ra);
      G("  AM", 410);
      i.fillStyle = "#000000";
      i.fillRect(350, 0, 500, 280);
      i.fillRect(350, 410, 500, 305);
      if (n - nt > 10000) {
        if (it == 5) {
          ga(true);
          nt = n;
          ge = 6;
          j(J.sticknya, K.main);
        } else if (it == 6) {
          ha(true);
          nt = n;
          ge = 6;
          j(J.sticknya, K.main);
        } else if (it == 7) {
          if (We == 20 && Ye == 20 && qe == 20 && Je == 20 && Ke == 20 && !Bt && !Nt && !Gt) {
            Ta(true);
          }
          nt = n;
          ge = 6;
          j(J.sticknya, K.main);
        } else if (it == 8) {
          ge = 1;
          zt();
        } else {
          wa(it + 1);
          Re = it + 1;
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        }
      }
    } else if (ge == 6) {
      if (it == 5) {
        a.bindTexture(a.TEXTURE_2D, W.check1);
      }
      if (it == 6) {
        a.bindTexture(a.TEXTURE_2D, W.check2);
      }
      if (it == 7) {
        a.bindTexture(a.TEXTURE_2D, W.check3);
      }
      Ee.push();
      Ee.scale([1280, 720]);
      Z(ce);
      Ee.pop();
      if (n - nt > 24500) {
        L();
        ge = 1;
        zt();
      }
    } else if (ge == 7) {
      a.bindTexture(a.TEXTURE_2D, W.customnight);
      Ee.push();
      Ee.scale([1280, 720]);
      Z(ce);
      Ee.pop();
      Ee.push();
      Ee.translate([30, 30]);
      Ee.scale([50, 50]);
      a.bindTexture(a.TEXTURE_2D, W.x);
      Z(ce);
      Ee.pop();
      if (T) {
        var sa = true;
        if (be(48, 419, 97, 483)) {
          if (Ht.longarms > 0) {
            Ht.longarms -= 1;
          }
        } else if (be(204, 419, 253, 483)) {
          if (Ht.longarms < 20) {
            Ht.longarms += 1;
          }
        } else if (be(297, 419, 346, 483)) {
          if (Ht.wierdclimber > 0) {
            Ht.wierdclimber -= 1;
          }
        } else if (be(453, 419, 502, 483)) {
          if (Ht.wierdclimber < 20) {
            Ht.wierdclimber += 1;
          }
        } else if (be(549, 419, 598, 483)) {
          if (Ht.laxdude > 0) {
            Ht.laxdude -= 1;
          }
        } else if (be(705, 419, 754, 483)) {
          if (Ht.laxdude < 20) {
            Ht.laxdude += 1;
          }
        } else if (be(797, 419, 846, 483)) {
          if (Ht.charles > 0) {
            Ht.charles -= 1;
          }
        } else if (be(953, 419, 1002, 483)) {
          if (Ht.charles < 20) {
            Ht.charles += 1;
          }
        } else if (be(1042, 419, 1091, 483)) {
          if (Ht.winston > 0) {
            Ht.winston -= 1;
          }
        } else if (be(1198, 419, 1247, 483)) {
          if (Ht.winston < 20) {
            Ht.winston += 1;
          }
        } else if (be(702, 517, 755, 542)) {
          Ht.infinitepower = !Ht.infinitepower;
        } else if (be(702, 550, 755, 575)) {
          Ht.reducedstatic = !Ht.reducedstatic;
        } else if (be(702, 583, 755, 608)) {
          Ht.noaggression = !Ht.noaggression;
        } else if (be(360, 634, 409, 698)) {
          if ((Ot -= 1) < 0) {
            Ot = Pt.length - 1;
          }
          Ht = JSON.parse(JSON.stringify(Pt[Ot]));
        } else if (be(1199, 634, 1248, 698)) {
          if ((Ot += 1) > Pt.length - 1) {
            Ot = 0;
          }
          Ht = JSON.parse(JSON.stringify(Pt[Ot]));
        } else if (be(867, 517, 1249, 620)) {
          sa = false;
          Re = 7;
          L();
          j(J.camswitch, K.main);
          fa = Te;
          ge = 2;
        } else if (be(30, 30, 80, 80)) {
          sa = false;
          ge = 1;
        } else {
          sa = false;
        }
        if (sa) {
          j(J.doorerr, K.main);
        }
      }
      if (_[27]) {
        ge = 1;
      }
      i.fillStyle = "#FFFFFF";
      i.font = "60px font";
      i.fillText(Ht.longarms < 10 ? " " + Ht.longarms : Ht.longarms, 116, 477);
      i.fillText(Ht.wierdclimber < 10 ? " " + Ht.wierdclimber : Ht.wierdclimber, 364, 477);
      i.fillText(Ht.laxdude < 10 ? " " + Ht.laxdude : Ht.laxdude, 612, 477);
      i.fillText(Ht.charles < 10 ? " " + Ht.charles : Ht.charles, 863, 477);
      i.fillText(Ht.winston < 10 ? " " + Ht.winston : Ht.winston, 1108, 477);
      (function (e, t, a, n) {
        i.fillText(e, a + (t - i.measureText(e).width) / 2, n);
      })(Ht.name, 780, 409, 684);
      i.font = "30px font";
      if (Ht.infinitepower) {
        i.fillText("X", 720, 543);
      }
      if (Ht.reducedstatic) {
        i.fillText("X", 720, 575);
      }
      if (Ht.noaggression) {
        i.fillText("X", 720, 608);
      }
    }
    if (_[70]) {
      A();
    }
    h = false;
    T = false;
    r = 0;
    for (; r < 255; r++) {
      _[r] = false;
      y[r] = false;
    }
    while ((t = a.getError()) != a.NO_ERROR) {
      if (t == a.INVALID_ENUM) {
        console.log("GL ERROR: INVALID_ENUM");
      } else if (t == a.INVALID_VALUE) {
        console.log("GL ERROR: INVALID_VALUE");
      } else if (t == a.INVALID_OPERATION) {
        console.log("GL ERROR: INVALID_OPERATION");
      } else if (t == a.INVALID_FRAMEBUFFER_OPERATION) {
        console.log("GL ERROR: INVALID_FRAMEBUFFER_OPERATION");
      } else if (t == a.OUT_OF_MEMORY) {
        console.log("GL ERROR: OUT_OF_MEMORY");
      } else if (t == a.CONTEXT_LOST_WEBGL) {
        console.log("GL ERROR: CONTEXT_LOST_WEBGL");
      }
    }
  }, 1000 / 30);
});