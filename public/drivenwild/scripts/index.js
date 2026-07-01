let e = Math.PI
  , aa = (e, t=1) => (e % t + t) % t
  , f = (e, t=0, a=1) => e < t ? t : a < e ? a : e
  , m = (e, t, a) => (a -= t) ? f((e - t) / a) : 0
  , u = (e, t, a) => t + f(e) * (a - t)
  , ba = (e=1, t=0) => e + f(Math.random()) * (t - e)
  , da = (e, t=0) => 0 | ba(e, t)
  , ea = (e, t, a) => {
    var i = z();
    return 2 * Math.abs(e.x - a.x) < t.x + i.x && 2 * Math.abs(e.y - a.y) < t.y + i.y
}
;
function fa(t, a, i) {
    var s = 180 / e
      , n = new DOMMatrix;
    return t && n.translateSelf(t.x, t.y, t.z),
    a && n.rotateSelf(a.x * s, a.y * s, a.z * s),
    i && n.scaleSelf(i.x, i.y, i.z),
    n
}
function ha(t) {
    for (let e = t.length; e; ) {
        var a = ia(e--);
        [t[e],t[a]] = [t[a], t[e]]
    }
    return t
}
function ja(e) {
    var t = e % 60 | 0
      , a = e % 1 * 1e3 | 0;
    return `${e / 60 | 0}:${t < 10 ? "0" + t : t}.` + (a < 10 ? "00" : a < 100 ? "0" : "") + a
}
let z = (e, t, a) => null == t && null == a ? new ka(e,e,e) : new ka(e,t,a)
  , ma = (e=0, t=0, a=0) => z(e, t, a);
function na(e, t) {
    return e.x += t.x,
    e.y += t.y,
    e.z += t.z,
    e
}
function pa(e, t) {
    return z(e.x - t.x, e.y - t.y, e.z - t.z)
}
function qa(e) {
    return e.x ** 2 + e.y ** 2 + e.z ** 2
}
function ra(e) {
    var t = e.length();
    return 1 < t ? e.scale(1 / t) : e
}
function sa(e, t) {
    return z(e.y * t.z - e.z * t.y, e.z * t.x - e.x * t.z, e.x * t.y - e.y * t.x)
}
function ta(e, t) {
    var a = Math.cos(t);
    return t = Math.sin(t),
    z(e.x, e.y * a - e.z * t, e.y * t + e.z * a)
}
function ua(e) {
    var t = va
      , a = Math.cos(t)
      , t = Math.sin(t);
    return z(e.x * a - e.z * t, e.y, e.x * t + e.z * a)
}
function wa(e, t) {
    var a = Math.cos(t);
    return t = Math.sin(t),
    z(e.x * a - e.y * t, e.x * t + e.y * a, e.z)
}
function ya(e, t=1) {
    return A(e.x, e.y, e.z, t)
}
class ka {
    constructor(e=0, t=0, a=0) {
        this.x = e,
        this.y = t,
        this.z = a
    }
    u() {
        return z(this.x, this.y, this.z)
    }
    add(e) {
        return z(this.x + e.x, this.y + e.y, this.z + e.z)
    }
    multiply(e) {
        return z(this.x * e.x, this.y * e.y, this.z * e.z)
    }
    scale(e) {
        return z(this.x * e, this.y * e, this.z * e)
    }
    length() {
        return qa(this) ** .5
    }
    normalize(e=1) {
        var t = this.length();
        return t ? this.scale(e / t) : z(e)
    }
    na(e) {
        return this.x * e.x + this.y * e.y + this.z * e.z
    }
    s(e, t) {
        return na(pa(e, this).scale(f(t)), this)
    }
    transform(e) {
        return e = e.transformPoint(this),
        z(e.x, e.y, e.z)
    }
}
let za = (e, t, a, i) => A(e, t, a, i);
function A(e=0, t=0, a=1, i=1) {
    var s = new Aa
      , n = (e = aa(e, 1),
    t = f(t),
    a = f(a),
    (e, t, a) => 6 * (a = aa(a, 1)) < 1 ? e + 6 * (t - e) * a : 2 * a < 1 ? t : 3 * a < 2 ? e + (t - e) * (4 - 6 * a) : e);
    return s.r = n(a = 2 * a - (t = a < .5 ? a * (1 + t) : a + t - a * t), t, e + 1 / 3),
    s.F = n(a, t, e),
    s.b = n(a, t, e - 1 / 3),
    s.a = i,
    s
}
function Ba(e, t=.1) {
    return new Aa(f(e.r + t),f(e.F + t),f(e.b + t),e.a)
}
function Ca(e) {
    var t = e => e < 0 ? 0 : 1 < e ? 255 : 255 * e;
    return t(e.r) | t(e.F) << 8 | t(e.b) << 16 | t(e.a) << 24
}
class Aa {
    constructor(e=1, t=1, a=1, i=1) {
        this.r = e,
        this.F = t,
        this.b = a,
        this.a = i
    }
    u() {
        return new Aa(this.r,this.F,this.b,this.a)
    }
    s(e, t) {
        return t = f(t),
        new Aa(u(t, this.r, e.r),u(t, this.F, e.F),u(t, this.b, e.b),u(t, this.a, e.a))
    }
    scale(e=1) {
        return new Aa(f(this.r * e),f(this.F * e),f(this.b * e),this.a)
    }
    toString() {
        return `rgb(${255 * this.r},${255 * this.F},${255 * this.b},${this.a})`
    }
}
function ia(e, t) {
    return 0 | D(F, e, t)
}
function D(e, t=1, a=0) {
    return e.seed ^= e.seed << 13,
    e.seed ^= e.seed >>> 17,
    e.seed ^= e.seed << 5,
    a + (t - a) * Math.abs(e.seed % 1e8) / 1e8
}
function Da(e, t) {
    e.seed = t + 1 | 0,
    D(e),
    D(e),
    D(e)
}
function Ea(e, t, a) {
    return D(e, t, a) * e.sign()
}
function Fa(e, t=.5) {
    return D(e) < t
}
function Ga(e, t=1) {
    return e[D(F) ** t * e.length | 0]
}
class Ia {
    constructor(e) {
        Da(this, e)
    }
    sign() {
        return Fa(this) ? -1 : 1
    }
    ub(t=0, a=.5) {
        return t *= D(this) ** a,
        a = D(this, 2 * e),
        z(t * Math.cos(a), t * Math.sin(a))
    }
    $(e, t=.1, a=0) {
        var i = f(D(F, 1, 1 - a) * (e.r + Ea(this, t)))
          , s = f(D(F, 1, 1 - a) * (e.F + Ea(this, t)));
        return t = f(D(F, 1, 1 - a) * (e.b + Ea(this, t))),
        new Aa(i,s,t,e.a)
    }
}
function Ja(e) {
    return null != e.time
}
class Ka {
    constructor() {
        this.setTime = this.time = void 0
    }
    set(e=0) {
        this.time = La + e,
        this.setTime = e
    }
    active() {
        return La < this.time
    }
    get() {
        return Ja(this) ? La - this.time : 0
    }
    toString() {}
    valueOf() {
        return this.get()
    }
}
let Ma, G, Oa, Pa, Qa, Ra, Sa, Ta, Wa, Xa, Ya, Za, $a, ab, bb;
function cb(e, t) {
    return t = G.createShader(t),
    G.shaderSource(t, e),
    G.compileShader(t),
    t
}
function db() {
    var e = G.createProgram();
    return G.attachShader(e, cb("#version 300 es\nprecision highp float;uniform vec4 l,g,a,f,e;uniform mat4 m,o;in vec4 p,n,c;in vec2 u;out vec4 v,d,q;void main(){gl_Position=m*o*p;v=vec4(u,n.w,0),q=f;\n            float specularPower = e.x;\n            float specularScale = e.y;\n            vec3 normal = normalize((transpose(inverse(o))*n).xyz);\n            vec3 viewPos = vec3(0,680,0);\n            vec3 viewDir = normalize(viewPos - vec3(gl_Position.xyz));\n            vec3 halfwayDir = normalize(l.xyz + viewDir);\n            float spec = specularScale*pow(max(dot(normal, halfwayDir), 0.), specularPower);\n            d=vec4(spec*g.xyz,0)+c*(a+vec4(g.xyz*dot(l.xyz,normal),1));}", 35633)),
    G.attachShader(e, cb("#version 300 es\nprecision highp float;in vec4 v,d,q;uniform sampler2D s;uniform vec4 l,g,a,f,e;out vec4 c;void main(){c=v.z>0.?d:texture(s,v.xy)*d;float f=gl_FragCoord.z/gl_FragCoord.w;e.z<1.?c:c=vec4(mix(c.xyz,q.xyz,clamp(f*f/1e10,0.,1.)),c.a*clamp(4.-f/2e4,0.,1.));if (c.a == 0.) discard;}", 35632)),
    G.linkProgram(e),
    e
}
function eb(e) {
    var t = G.getParameter(G.MAX_TEXTURE_SIZE)
      , a = e.width
      , i = e.height;
    return (t < a || t < i) && (a = a * (t /= Math.max(a, i)) | 0,
    i = i * t | 0,
    fb.width = a,
    fb.height = i,
    gb.drawImage(e, 0, 0, a, i),
    e = fb),
    a = G.createTexture(),
    G.bindTexture(3553, a),
    G.texImage2D(3553, 0, 6408, 6408, 5121, e),
    a
}
function hb(e=new DOMMatrix) {
    var t = (e, t, a, i, s=0) => G.uniform4f(bb[e], t, a, i, s)
      , a = Za ? Wa : kb
      , i = Za ? Xa : K;
    t("l", Ta.x, Ta.y, Ta.z),
    t("g", a.r, a.F, a.b),
    t("a", i.r, i.F, i.b),
    t("f", Ya.r, Ya.F, Ya.b),
    t("e", ab.Nc, ab.Oc, $a),
    t = Pa.subarray(0, 11 * Ra),
    e = e.scaleSelf(100, 100, 100),
    G.uniformMatrix4fv(bb.o, 0, e.toFloat32Array()),
    G.bufferSubData(34962, 0, t),
    G.drawArrays(5, 0, Ra),
    Ra = 0,
    ++Sa
}
function lb(e, t=1) {
    t ? G.enable(e) : G.disable(e)
}
function mb(e=0) {
    G.polygonOffset(0, -e),
    lb(32823, !!e)
}
function nb(e=1, t=1) {
    lb(2929, !!e),
    G.depthMask(!!t)
}
function ob(e=0, t=1) {
    ab.Oc = e,
    ab.Nc = t
}
let pb = z(1);
function qb(e, t, a, i) {
    var s = e.length;
    for (s < 1e4 - Ra || hb(),
    a = Ca(a); s--; )
        rb(e[s], t ? t[s] : pb, i ? i[s] : pb, a)
}
function sb(e, t, a, i) {
    var s = e.length;
    for (s + 2 < 1e4 - Ra || hb(),
    a = Ca(a),
    rb(e[s - 1], pb, pb, a); s--; )
        rb(e[s], t ? t[s] : pb, i ? i[s] : pb, a);
    rb(e[0], pb, pb, a)
}
function tb(e, t) {
    var a = e.length;
    for (a + 2 < 1e4 - Ra || hb(),
    rb(e[a - 1], pb, pb, Ca(t[a - 1])); a--; )
        rb(e[a], pb, pb, Ca(t[a]));
    rb(e[0], pb, pb, Ca(t[0]))
}
function rb(e, t, a, i) {
    var s = 11 * Ra++;
    Pa[s++] = .01 * e.x,
    Pa[s++] = .01 * e.y,
    Pa[s++] = .01 * e.z,
    Pa[s++] = 1,
    Pa[s++] = t.x,
    Pa[s++] = t.y,
    Pa[s++] = t.z,
    Pa[s++] = a.z,
    Qa[s++] = i,
    Pa[s++] = a.x,
    Pa[+s] = a.y
}
let ub, vb, wb, xb, yb, zb, K = new Aa, kb = new Aa(0,0,0), Ab = new Aa(1,0,0), Bb = new Aa(1,1,0), Cb = new Aa(0,1,0), Jb = new Aa(0,0,1), Kb = new Aa(.5,.5,.5), M, Lb;
class N {
    constructor(e, t=1e3, a=0, i=0, s=0, n=1) {
        this.ca = z((512 * e.x + 8) / 4096, (512 * e.y + 8) / 4096),
        this.size = t,
        this.va = a,
        this.vd = i,
        this.mc = s,
        this.D = n,
        this.Xb = this.nb = 0,
        this.i = 1.2,
        this.j = z(0, 0, 1),
        this.qa = .05,
        this.Pb = .01
    }
}
function Mb(e, t=1) {
    for (var a = [], i = [], s = e.length + 2, n = 2; n--; )
        for (var c = s; c--; ) {
            var h = (o = f(c - 1, 0, s - 3)) >> 1
              , o = o % 2 == s % 2 ? h : s - 3 - h;
            (o = e[o = n ? o : aa(s + 2 - o, e.length)].u()).z = n ? t : -t,
            a.push(o),
            i.push(z(0, 0, o.z))
        }
    for (s = e.length; s--; ) {
        o = e[s];
        var r, h = e[(s + 1) % e.length], d = z(0, 0, t);
        c = [n = o.add(d), n, c = h.add(d), o = pa(o, d), h = pa(h, d), h],
        n = sa(pa(o, h), pa(n, o)).normalize();
        for (r of c)
            a.push(r),
            i.push(n)
    }
    return new Nb(a,i)
}
function Ob(e, t, a, i) {
    var s = e.rb.map(e => ma(.12109375 - .12109375 * e.x + i.x, .12109375 * e.y + i.y));
    qb(e.points, e.Sb, a, s),
    hb(t)
}
class Nb {
    constructor(e, t, a) {
        this.points = e,
        this.Sb = t,
        this.rb = a
    }
    G(e, t) {
        qb(this.points, this.Sb, t),
        hb(e)
    }
    transform(e, t, a) {
        let i = fa(e, t, a)
          , s = fa(0, t);
        return new Nb(this.points.map(e => e.transform(i)),this.Sb.map(e => e.transform(s)),this.rb)
    }
}
function Rb(e, t) {
    var a = na(z(0, 800, 1e3), Sb)
      , i = z(5e3, 800);
    tb(vb.points.map(e => na(e.multiply(i), a)), [e, e, t, t])
}
function Tb(t, n, e, c, a=0) {
    var h = vb
      , o = h.points.map(e => ma(e.x * Math.abs(n.x) + t.x, e.y * Math.abs(n.y) + t.y, t.z));
    if (a *= n.y,
    o[0].x += a,
    o[1].x += a,
    c) {
        let t = c.x
          , a = c.y
          , i = .12109375
          , s = .12109375;
        n.x < 0 && (t -= i *= -1),
        n.y < 0 && (a -= s *= -1),
        sb(o, 0, e, c = h.rb.map(e => ma(e.x * i + t, e.y * s + a)))
    } else
        sb(o, 0, e)
}
function Ub(t, a, i) {
    var e, s, n;
    2e4 < t.z || (e = new Aa(0,0,0,.7),
    s = M.na.ca,
    sb((n = wb).points.map(e => ma(e.x * a + t.x, t.y, e.z * i + t.z)), 0, e, n = n.rb.map(e => ma(.12109375 * e.x + s.x, .12109375 * e.y + s.y))))
}
function Vb() {
    var e = document.body;
    document.fullscreenElement ? document.exitFullscreen && document.exitFullscreen() : e.requestFullscreen ? e.requestFullscreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.mozRequestFullScreen && e.mozRequestFullScreen()
}
function Wb(e, t, a=1, i=new Aa, s=0, n=new Aa(0,0,0), c="center") {
    let h = gb;
    h.fillStyle = i.toString(),
    h.lineWidth = s,
    h.strokeStyle = n.toString(),
    h.textAlign = c,
    h.font = a + "px OpenSans, arial",
    h.textBaseline = "middle",
    h.lineCap = h.lineJoin = "round",
    t = t.u(),
    (e + "").split("\n").forEach(e => {
        s && h.strokeText(e, t.x, t.y, void 0),
        h.fillText(e, t.x, t.y, void 0),
        t.y += a
    }
    )
}
function Xb(e=0) {
    var t = Yb / Zb
      , a = $b(t)
      , i = $b(t - 1)
      , s = m(t % 1, 0, .1)
      , t = i.A.s(a.A, s)
      , a = i.B.s(a.B, s);
    return t.s(a, e).scale(.8)
}
function ac() {
    var i = (s = new bc(Yb)).ua
      , s = s.ed;
    for (let e = 0, t = 0, a = 0; a < 1e3; ++a) {
        var n, c = i + a;
        R[c] && (n = a < 1 ? 1 - s : 1,
        R[c].g = R[c].offset.u(),
        R[c].g.x = e += t += 2 * n * R[c].g.x,
        R[c].g.z -= Yb)
    }
}
function cc(i) {
    var s = new bc(Yb).ua;
    for (let e = 1e3, t, a; e--; )
        if ((t = R[s + e]) && a) {
            if (!(e % (1 + 7 * f(e / 1e3) | 0))) {
                let c = t.g
                  , h = a.g
                  , o = [t.La, t.La, a.La, a.La];
                if (r(1e5, t.nc),
                !i && (r(t.width, t.Xa, void 0, a.width, void 0, 10),
                e < 500)) {
                    var n = 2 * t.width / 1400 - .2;
                    for (let e = 1; e < n; ++e)
                        r(30, t.wb, 1400 * e - t.width, void 0, 1400 * e - a.width, 10)
                }
                function r(e, t, a=0, i=e, s=a, n=0) {
                    e = [ma(c.x + e + a, c.y + n, c.z), ma(c.x - e + a, c.y + n, c.z), ma(h.x + i + s, h.y + n, h.z), ma(h.x - i + s, h.y + n, h.z)],
                    t.a && sb(e, o, t)
                }
                a = t
            }
        } else
            a = t;
    hb()
}
function dc(e, t, a, i, s=0) {
    var n, c, h;
    200 * t.y < e.z || Math.abs(e.x) - Math.abs(t.x) > 4 * e.z + 2e3 || e.z < 0 || (n = i.i,
    s *= i.vd,
    c = ec ? Sb.y / 20 : 10,
    h = t.y * (1 + i.Xb) + (ec ? Sb.y / 20 : 0),
    e.y += c,
    n && Ub(e, t.y * n, t.y * n / 6),
    e.y += h - c,
    Tb(e, t, a, i.ca, s))
}
class fc {
    constructor(e, t, a, i=K, s=1) {
        this.Qc = e,
        this.Oa = t,
        this.offset = a,
        this.color = i,
        i = t.size * s,
        this.scale = z(i),
        e = e.width,
        a.x < 2 * e && a.x > 2 * -e && t.nb ? this.scale.x *= a.x < 0 ? -1 : 1 : t.D && Fa(F) && (this.scale.x *= -1),
        this.Wa = t.mc * Math.abs(i)
    }
    l() {
        dc(this.Qc.g.add(this.offset), this.scale, this.color, this.Oa, hc(this.Qc))
    }
}
function hc(e) {
    return e = e.offset,
    Math.sin(La + .001 * (e.x + e.z)) / 2
}
function ic(e, t, a=0, i=0, s=1) {
    a = z(a, i),
    s *= 1 + D(F, -t.va, t.va),
    i = t.ea[ia(t.ea.length)],
    t = new fc(e,t,a,i,s),
    e.Yb.push(t)
}
class jc {
    constructor(t, a, i) {
        t >= 10 * kc && (i = 0),
        this.offset = a,
        this.width = i,
        this.pitch = 0,
        this.La = z(),
        this.Yb = [],
        a = t / kc;
        var s = this.level = lc ? lc.level : 0 | a
          , n = $b(s)
          , c = $b(a + 1)
          , h = m(a % 1, .9, 1)
          , o = (a = 25 < t && t < 30 || t % kc > kc - 10,
        s = t >> 3 == mc / 100 >> 3,
        this.lb = n.Fc && t % kc % 495 < 36,
        n.v.s(c.v, h))
          , r = n.Z.s(c.Z, h)
          , n = n.L.s(c.L, h)
          , c = (t / 9 | 0) % 2 ? .1 : 0;
        this.nc = Ba(o, Math.cos(2 * t / e) / 20),
        this.Xa = Ba(n, c && .05),
        s ? this.Xa = A(0, .8, .5) : a && (this.Xa = K),
        this.wb = r,
        c && (this.wb.a = 0),
        this.lb && (this.nc = this.Xa,
        this.wb = new Aa(0,0,0,0)),
        t == 10 * kc ? ic(this, M.Ic) : 0 == t % kc && t < 10 * kc && (ic(this, M.Gc, 500 - i),
        ic(this, M.Hc, i - 500)),
        30 == t && (ic(this, M.Jc),
        t = -(i + 100),
        ic(this, M.nd, t, 1690),
        ic(this, M.kd, t, 1140),
        ic(this, M.md, t),
        i += 100,
        ic(this, M.hd, i, 1590),
        ic(this, M.ld, i, 975),
        ic(this, M.jd, i))
    }
}
class bc {
    constructor(e) {
        var t = this.ua = e / 100 | 0
          , a = this.ed = e / 100 % 1;
        R[t] && R[1 + t] ? (this.g = R[t].g && R[1 + t].g ? R[t].g.s(R[1 + t].g, a) : z(0, 0, e),
        this.pitch = u(a, R[t].pitch, R[1 + t].pitch),
        this.offset = R[t].offset.s(R[1 + t].offset, a),
        this.width = u(a, R[t].width, R[1 + t].width)) : this.offset = this.g = z(this.pitch = this.width = 0, 0, e),
        e = this.ua / kc,
        t = this.level = 0 | e,
        this.wa = u(m(e % 1, .9, 1), $b(t).wa, $b(e + 1).wa)
    }
}
let nc, $b = e => lc || nc[0 | e] || nc[0];
class oc {
    constructor(e, t, a, i=M.Ib) {
        (nc[e] = this).level = e,
        this.Dc = t,
        this.Sc = a,
        this.ga = 29,
        this.Mc = this.fc = 0,
        this.X = .2,
        this.sb = 45,
        this.ic = 1,
        this.M = 5,
        this.Rc = 0,
        this.Zb = .5,
        this.v = A(.08, .2, .7),
        this.A = K,
        this.B = A(.57, 1, .5),
        this.Z = K,
        this.L = A(0, 0, .5),
        this.P = A(.15, 1, .95, .7),
        this.vb = 1,
        this.la = .3,
        this.Eb = i,
        this.R = 2,
        this.S = .8,
        this.ya = A(.15, 1, .95),
        this.J = 3,
        this.da = 1,
        this.N = .5,
        this.ia = 0,
        this.W = .6,
        this.T = .5,
        this.H = 0,
        this.O = .7,
        this.C = 50,
        this.I = 150,
        this.wa = 30,
        this.bd = 0
    }
}
let pc = 0;
function qc() {
    function t(e, t) {
        M.restore(),
        M.save(),
        M.setTransform(496, 0, 0, 496, 512 * e + 8, 512 * t + 8),
        M.beginPath(),
        M.rect(0, 0, 1, 1),
        M.clip()
    }
    function d(e, t, a, i=0, s=9) {
        b(e, t, a, a, 0, i, s)
    }
    function N(e=.5, t=.5, a=1, i=1, s=0) {
        M.save(),
        M.translate(e, t),
        M.rotate(s),
        M.fillRect(-a / 2, -i / 2, a, i),
        M.restore()
    }
    function k(e=K, t=0) {
        M.fillStyle = e,
        t && ([t=K] = [e],
        M.strokeStyle = t)
    }
    function b(e=.5, t=.5, a=.5, i=.5, s=0, n=0, c=9) {
        M.beginPath(),
        M.ellipse(e, t, Math.max(0, a), Math.max(0, i), s, n, c),
        M.fill()
    }
    function Z(t, a, i, s, n=.1, c=200) {
        for (let e = c = z(i - t, s - a).length() * c + 1 | 0; e--; )
            N(t + f(e / c) * (i - t), a + f(e / c) * (s - a), n, n)
    }
    function a(a=.5, i=.5, s=.5, n=0) {
        M.beginPath();
        for (let t = 3; t--; ) {
            var c = 2 * t / 3 * e;
            M.lineTo(a + s * Math.sin(c + n), i - s * Math.cos(c + n))
        }
        M.fill()
    }
    function c(e, t=.5, a=.5, i=1, s=.95, n=0, c="arial", h="center", o=400, r="") {
        M.save(),
        M.scale(.05, .05),
        t /= .05,
        a /= .05,
        s /= .05,
        n /= .05,
        M.font = r + ` ${o} ${i / .05}px ` + c,
        M.textBaseline = "middle",
        M.textAlign = h,
        M.lineWidth = n,
        M.lineCap = M.lineJoin = "round",
        n && M.strokeText(e, t, a, s),
        M.fillText(e, t, a, s),
        M.restore()
    }
    function i(e, t, a, i, s, n, c=300, h=.1) {
        for (k(n),
        N(e, t, a, i, s),
        c = c * a + 1; c--; ) {
            var o = D(F, a * h)
              , r = Ea(F, a - o)
              , d = wa(z(1, 0), s).scale(r / 2)
              , b = (k(F.$(n, .05, .7)),
            r = D(F, i / 4, i),
            Ea(F, i - r))
              , b = wa(z(0, 1), s).scale(b / 2);
            N(e + (d = d.add(b)).x, t + d.y, o, r, s)
        }
    }
    function s(c=.5, h=.1, o=.7, e=.01, r=.7, d=.7, b=.3, l=0, f=.03, M=520, v=z(0, 0, 1), y=0, p=.01) {
        for (let s = Math.max(1, M * o * .1), n = s; 0 < n--; h += D(F, e))
            for (let e = M * h, t = e, a = 0, i = o; 0 < t--; ) {
                var m = t / e
                  , w = n / s
                  , g = D(F, .2, .5)
                  , x = (w < Math.abs(r - m) / 20 && (g = D(F, .2)),
                Fa(F, .05) ? g = D(F, 1) : w > d + Math.abs(r - m) * b ? g *= 2 : r < m && (g /= 3),
                D(F, f, 2 * f))
                  , A = (i += a = -(a < 0 ? -1 : 1) * D(F, p),
                v.u());
                A.z = g * A.z + y,
                k(g = ya(A, .3)),
                N(c + u(m, -h, h), 1 - w * i - l - x + Ea(F, p), x, x, Ea(F, 2))
            }
    }
    function P(a, i, s, n=Ab) {
        var c = D(F, 2 * e)
          , h = 1 + Ea(F, .08);
        s = D(F, .6 * s, s),
        k(F.$(K, .2)),
        d(a.x, a.y, s * D(F, .5, 1)),
        n = F.$(n, .3);
        for (let t = i; t--; ) {
            var o = t / i * e * 2 + c
              , r = a.add(wa(z(s / .8, 0), o));
            k(F.$(n, .2)),
            b(r.x, r.y, s, s / 2, o ** h)
        }
    }
    function n(t=0, a=0, i=.6, s=0, n) {
        var c = ia(5, 9)
          , h = D(F, .03, .05);
        for (let e = 70; e--; ) {
            var o = .5 + Ea(F, .25)
              , o = new v(o,1,Ea(F, .25),Ea(F, -.6, -1),.5,.02)
              , r = A(t, a, i + D(F, .4));
            o.color = r,
            o.iterations = 99,
            o = o.l(),
            Fa(F, s) && P(o, c, h, n)
        }
    }
    function h(t=1, e=.9, a=A(0, 0, .1), i=K, s=.05, n=i, c=.2, h=0, o=0, r=.1) {
        for (let e = 2; e--; )
            k(e ? A(0, 0, .1) : n),
            N(.5 - c * t + .01 * e, .5 + h, r),
            N(.5 + c * t + .01 * e, .5 + h, r);
        k(a),
        o && N(.5, e / 2 + h, t + s, e + s),
        k(i),
        N(.5, e / 2 + h, t, e),
        k(a),
        N(.5, e / 2 + h, t - s, e - s)
    }
    function o(e, t, a, i=.5, s=.24, n=.46) {
        h(1, .6, a, K, .05, kb, i),
        k(K, 1),
        c(e, .5, s, .31, .85, .01),
        c(t, .5, n, .2, .8, .01)
    }
    function r(e) {
        N(.5, .58, 1, .16);
        var t = A(.08, .4, .2);
        i(.03, .75, .06, .53, 0, t),
        i(.97, .75, .06, .53, 0, t),
        k(Ab),
        c(e, .5, .6, .15, 1, .01, void 0, void 0, 600)
    }
    function l(e) {
        k(kb),
        N(.5 - .45 * e, .5, .1),
        k(A(0, 0, .2)),
        N(.49 - .45 * e, .5, .1),
        k(K),
        N(.5, 0, 1, .5),
        k(A(.3, .7, .5)),
        c("CHECK", .5, .14, .22, .95, .02, void 0, void 0, 600)
    }
    let M = gb;
    fb.height = fb.width = 4096,
    Da(F, 13);
    class v {
        constructor(e, t, a, i, s, n=.1, c=0, h=kb, o=.1) {
            this.x = e,
            this.y = t,
            this.td = a,
            this.ud = i,
            this.ka = s,
            this.Lc = n,
            this.Wb = c,
            this.color = h,
            this.style = this.xb = 0,
            this.iterations = 50,
            this.$ = o
        }
        l() {
            var a = z();
            for (let t = 0; t < this.iterations; ++t) {
                this.color && k(F.$(this.color, this.xb, this.$));
                var i = t / this.iterations;
                a.x = this.x + this.td * i,
                a.y = this.y + this.ud * i + this.ka * i * i,
                i = this.style ? Math.sin(i * e) * (this.Lc - this.Wb) + this.Wb : u(i, this.Lc, this.Wb),
                N(a.x, a.y, i, i)
            }
            return a
        }
    }
    class y {
        constructor() {
            this.g = z(.5, 1),
            this.xa = .09,
            this.od = .01,
            this.Aa = 1.2,
            this.Ba = .1,
            this.Ca = 451,
            this.Xc = .9,
            this.hb = 3,
            this.yc = .06,
            this.zc = .03,
            this.dd = .98,
            this.ma = .02,
            this.sa = .01,
            this.Qb = .005,
            this.ra = .3,
            this.Ia = .4,
            this.zb = Ab,
            this.kc = 1,
            this.ib = .5,
            this.jc = this.Rb = this.Za = this.pd = 0
        }
        l() {
            let o = 0
              , r = []
              , d = this.xa
              , b = this.Aa
              , l = this.Ba
              , f = this.Ca
              , u = this.Xc
              , M = this.jc
              , v = this.Rb
              , y = this.hb
              , i = this.yc
              , s = this.zc
              , p = this.dd
              , m = this.ma
              , w = this.sa
              , g = this.Qb
              , n = this.ra
              , c = this.Ia
              , h = this.ib
              , x = (e, t, a, i=0, s=0, n=Fa(F) ? 1 : -1) => {
                if (!(1e4 < o++))
                    if (t < g) {
                        if (Fa(F, y))
                            for (t = Math.max(1, 0 | y); t--; )
                                r.push(e)
                    } else {
                        var c, h = e.add(wa(z(0, -a), i));
                        k(A(.1, .6, D(F, .1, .2))),
                        Z(e.x, e.y, h.x, h.y, t),
                        s > f * t && (e = D(F, .5, 1) * this.kc,
                        c = D(F, .5, 1) * this.kc,
                        x(h, t * e, a * c, i + n * (b + Ea(F, l))),
                        n *= -1,
                        s = 0,
                        Fa(F, v) && x(h, t * e, a * c, i + n * (b + Ea(F, l))),
                        t *= u),
                        t < d / 2 && Fa(F, M) || this.pd && 300 < o || (i *= 1 - w,
                        x(h, t * p, a, i + Ea(F, m), s + 1, n))
                    }
            }
            ;
            for (var S in x(this.g, d, this.od),
            ha(r)) {
                let t = r[S]
                  , a = S / r.length;
                var S = (1 - a) * i
                  , R = h + Ea(F, .2);
                a = .1 + D(F, a, 1) * c,
                k(F.$(A(n, R, a), .1)),
                N((t = t.add(F.ub(s))).x, t.y, S, S, D(F, 2 * e)),
                Fa(F, this.Za) && P(t, 5, D(F, .01, .02), this.zb)
            }
        }
    }
    k(K),
    t(0, 0),
    d(.5, .5, .45),
    t(1, 0);
    for (var p, m = 40; m--; )
        k(A(0, 0, 1, m / 300)),
        d(.5, .5, .5 - m / 80);
    t(2, 0);
    for (let e = 40, t; e--; )
        k(za(0, 0, 1, t = e / 40)),
        N(.5, .5, .5 - t / 3, .9 - t / 3);
    t(3, 0),
    k(A(0, 0, .8)),
    N(),
    k(A(.7, .9, .25), 1),
    c("JS-13K", .5, .6, 1, .9, .03, "monospace"),
    t(4, 0),
    c(13, .5, .6, 1, 1, .04, void 0, void 0, 900),
    t(6, 0),
    l(1),
    t(7, 0),
    l(-1),
    t(0, 1);
    var w = new v(.3,.29,.3,.5,.5,.02,.06);
    for (w.color = A(.1, .5, .1),
    w.xb = .1,
    w.l(),
    w = 12; w--; ) {
        var g = w / 12 * 2 * e;
        (g = new v(.3,.23,.3 * Math.sin(g),.3 * Math.cos(g) - .1,.2,.05,.005)).style = 1;
        var x = A(.3, .6, D(F, .3, .5));
        g.color = x,
        g.xb = .1,
        g.l()
    }
    for (t(1, 1),
    Da(F, 13),
    (new y).l(),
    t(2, 1),
    Da(F, 192),
    (m = new y).xa = .1,
    m.Ca = 300,
    m.hb = 0,
    m.Aa = 1.2,
    m.Ba = .2,
    m.jc = .03,
    m.sa = .05,
    m.ma = .1,
    m.l(),
    t(3, 1),
    Da(F, 131),
    (m = new y).hb = 0,
    m.xa = .08,
    m.Ba = .5,
    m.Aa = 1.5,
    m.ma = .05,
    m.sa = .01,
    m.l(),
    t(4, 1),
    Da(F, 400),
    (m = new y).ma = .1,
    m.Aa = 1.5,
    m.Ba = .1,
    m.ra = 0,
    m.ib = .7,
    m.Ia = .7,
    m.sa = .02,
    m.Za = .05,
    m.zb = K,
    m.l(),
    t(5, 1),
    Da(F, 1333),
    (m = new y).Rb = 1,
    m.Ca = 800,
    m.xa = .04,
    m.Qb = .005,
    m.Aa = 1.5,
    m.ma = .1,
    m.Ba = .2,
    m.hb = 4,
    m.zc = .04,
    m.ra = .2,
    m.sa = .002,
    m.Za = .01,
    m.l(),
    t(6, 1),
    Da(F, 293),
    (m = new y).xa = .07,
    m.ma = .05,
    m.ra = .08,
    m.Ia = .6,
    m.ib = 1,
    m.l(),
    Da(F, 13),
    t(0, 2),
    h(),
    k(K, 1),
    c("JS", .25, .27, .5, .35, .02, "courier"),
    c("GAMES", .5, .66, .5, .9, .02, "courier"),
    k(A(1, .8, .5), 1),
    c("13K", .67, .27, .5, .5, .02, "courier"),
    t(1, 2),
    h(1, .6, kb, A(0, 0, .2)),
    k(A(.6, 1, .5), 1),
    c("ZZFX", .47, .38, .55, .8, .05),
    k(Bb, 1),
    c("ZZFX", .5, .35, .55, .8, .05),
    k(A(.96, 1, .5), 1),
    c("ZZFX", .53, .32, .55, .8, .05),
    t(2, 2),
    h(1, .4, K, kb),
    k(kb, 1),
    c("GitHub", .5, .22, .3, .9, .01),
    t(3, 2),
    o("FRANK FORCE", "GAME BY", kb, 0, .42, .2),
    t(4, 2),
    o("DRIVE", "SAFELY", A(.35, 1, .2)),
    t(5, 2),
    h(1, .6, K, kb),
    k(A(.65, .9, .45)),
    d(.28, .3, .2),
    N(.58, .3, .08, .4),
    N(.71, .14, .22, .08),
    N(.75, .3, .13, .08),
    d(.81, .22, .12, 4.7, 7.9),
    k(K),
    d(.28, .3, .12),
    d(.81, .22, .04),
    t(7, 2),
    p = A(0, .9, .6),
    h(.9, .9, K, A(0, 0, .2)),
    k(p, 1),
    d(.5, .37, .32),
    c("AVALANCHE", .5, .8, .13, 1, .003),
    k(K),
    a(.5, .37, .23),
    k(p),
    Z(.47, .52, .62, .26, .07),
    t(0, 3),
    n(),
    t(1, 3),
    n(.23, .5, .3, .3),
    t(2, 3),
    n(.35, .5, .3, .3, Bb),
    t(3, 3),
    Da(F, 5),
    n(.3, .5, .3, .64, Jb),
    t(4, 3),
    Da(F, 5),
    (m = new y).ra = .5,
    m.Ia = 1.2,
    m.yc = .04,
    m.Ca = 300,
    m.sa = .01,
    m.Za = .01,
    m.zb = Jb,
    m.l(),
    t(5, 3),
    Da(F, 9),
    (m = new y).ra = .13,
    m.Ia = .5,
    m.ib = .9,
    m.Rb = 1,
    m.Ca = 500,
    m.Qb = .008,
    m.xa = .1,
    m.l(),
    t(0, 4),
    i(.5, .5, .04, 1, 0, m = A(.08, .4, .2)),
    i(.5, .06, .03, .2, e / 2, m),
    i(.5, .12, .03, .2, e / 2, m),
    t(1, 4),
    s(),
    t(2, 4),
    s(.55, .08, .53, .015, .6, .7, .5),
    s(.4, .1, .45, .012, .3, .7),
    s(.6, .2, .2, .005, .4, .6),
    t(3, 4),
    m = 39; m--; ) {
        var S = D(F, .002, .015);
        s(.5 + Ea(F, .45), D(F, .005, .02), D(F, .02, .05), .005, .4, .3, .3, .02, S)
    }
    for (t(4, 4),
    m = 199; m--; ) {
        var S = .5 + Ea(F, .45)
          , R = D(F, .003, .006)
          , G = z(.13, .3, .7);
        s(S, D(F, .03), D(F, .05), .005, .4, .3, .3, .03, R, 500, G, .4)
    }
    for (t(5, 4),
    m = 99; m--; )
        S = m / 99,
        s(.05 + f(S) * (.95 - .05), .01, .02 + .11 * f(S), .01, .3, .6, .5, 0, .01, 500, z(.53, 1, 1), .4 - .2 * S);
    for (t(6, 4),
    s(.85, .05, .53, .002, .6, .7, .5, -.1, .02, 1e3),
    s(.15, .05, .53, .002, .6, .7, .5, -.1, .02, 1e3),
    s(.5, .42, .25, .002, .5, .7, .5, .2, .02, 1e3, void 0, void 0, 0),
    t(7, 4),
    k(A(0, 0, 1)),
    N(1, 1, .4, .5),
    N(0, 1, .4, .5),
    k(A(0, 0, .7)),
    N(.5, .75, 1, .15),
    t(0, 5),
    h(.5, .5, K, kb, .05, Kb, .3, .3, 1),
    k(kb),
    a(.42, .5, .12, -e / 2),
    M.lineWidth = .09,
    M.beginPath(),
    M.arc(.44, .7, .2, 3 * e / 2, 2 * e),
    M.stroke(),
    t(0, 6),
    r("GOAL"),
    t(1, 6),
    r("START"),
    t(2, 6),
    m = 2; m--; )
        for (S = 9; S--; )
            R = S / 9,
            k(A(0, 0, m ? .2 : .9)),
            d(.5 + .05 * m, .5 + R / 2, .3, .4);
    for (t(3, 6),
    k(kb),
    m = 19; m--; )
        S = m / 19,
        R = .9 + f(S) * (.86 - .9),
        N(.36 + .28 * f(S), .07 + R / 2, .03, R),
        N(.5 - Ea(F, .14), .5, D(F, .02), D(F, .85, 1));
    for (m = 28; m--; )
        for (S = 9; S--; )
            R = .372 + .03 * S,
            G = .1 + .03 * m,
            k(za(D(F, .07, .15), D(F, .5, 1), (S & m) % 2 ? 0 : D(F, .3, 1) ** 3)),
            N(R, G, .03 * .7, .03 * .7);
    for (t(6, 6),
    Da(F, 9),
    s(.5, 0, .25, .04, .5, 1, 1, -.1, void 0, 1e3, z(0, 0, .7), .7),
    t(7, 6),
    s(.45, .1, .5, .025, .3, .7, .8, void 0, void 0, void 0, z(0, 0, .7), .7),
    s(.7, .1, .25, .02, .3, .8, void 0, void 0, void 0, void 0, z(0, 0, .7), .6),
    S = (m = M.getImageData(0, 512, 4096, 4096)).data,
    R = 3; R < S.length; R += 4)
        S[R] = S[R] < 99 ? 0 : 255;
    M.putImageData(m, 0, 512)
}
let rc = void 0 !== window.ontouchstart, sc = z(), tc = z(), uc, wc = (e, t=0) => !!(1 & vc[t][e]), U = [];
function xc() {
    rc || document.hasFocus() || (U = []),
    yc()
}
function zc() {
    for (var e in U)
        U[e] &= 1
}
let Ac = e => {
    var t = fb.getBoundingClientRect();
    return z(m(e.x, t.left, t.right), m(e.y, t.top, t.bottom))
}
, vc, Bc, Cc;
function yc() {
    var t, a;
    if (rc && Dc(),
    navigator && navigator.getGamepads && document.hasFocus()) {
        var i = navigator.getGamepads();
        for (let e = i.length; e--; ) {
            var s = i[e]
              , n = vc[e] || (vc[e] = [])
              , c = Cc[e] || (Cc[e] = [])
              , h = Bc[e] || (Bc[e] = []);
            if (s) {
                for (var o = 0; o < s.axes.length - 1; o += 2)
                    h[o >> 1] = (t = z(s.axes[o], s.axes[o + 1]),
                    void 0,
                    a = e => .1 < e ? m(e, .1, .85) : e < -.1 ? -m(-e, .1, .85) : 0,
                    ra(z(a(t.x), a(-t.y))));
                for (o = s.buttons.length; o--; ) {
                    var r = s.buttons[o]
                      , d = wc(o, e);
                    n[o] = r.pressed ? d ? 1 : 3 : d ? 4 : 0,
                    c[o] = m(r.value || 0, .1, .9),
                    uc ||= !e && r.pressed
                }
                qa(s = z((wc(15, e) && 1) - (wc(14, e) && 1), (wc(12, e) && 1) - (wc(13, e) && 1))) && (h[0] = ra(s))
            }
        }
    }
}
function Hc() {
    let t = Ic;
    t = Jc,
    Kc = [],
    Lc = z(),
    document.addEventListener("touchstart", e => t(e), {
        passive: !1
    }),
    document.addEventListener("touchmove", e => t(e), {
        passive: !1
    }),
    document.addEventListener("touchend", e => t(e), {
        passive: !1
    }),
    onmousedown = onmouseup = () => 0
}
let Mc;
function Ic(e) {
    W && "running" != W.state && W.resume();
    var t = e.touches.length;
    if (t) {
        var a, i = z();
        for (a of e.touches)
            i.x += a.clientX / e.touches.length,
            i.y += a.clientY / e.touches.length;
        tc = i,
        sc = Ac(tc),
        Mc || (U[0] = 3)
    } else
        Mc && (U[0] = 2 & U[0] | 4);
    return Mc = t,
    document.hasFocus() && e.preventDefault(),
    !0
}
let Nc = new Ka, Kc, Lc, Oc;
function Jc(e) {
    W && "running" != W.state && W.resume(),
    Lc = z(),
    Kc = [],
    uc = !0,
    e.touches.length && Nc.set();
    var t, a = z(Oc, Y.y - Oc), i = pa(Y, z(Oc, Oc)), s = Y.scale(.5);
    for (t of e.touches) {
        let e = Ac(z(t.clientX, t.clientY));
        qa(pa(e = e.multiply(Y), a)) ** .5 < Oc ? ((Lc = pa(e, a).scale(3 / Oc)).x = f(Lc.x, -1, 1),
        Lc.y = f(Lc.y, -1, 1)) : qa(pa(e, i)) ** .5 < Oc ? Kc[e.y > i.y ? 1 : 0] = 1 : qa(pa(e, s)) ** .5 < Oc && !Mc && (Kc[9] = 1)
    }
    return Ic(e),
    document.hasFocus() && e.preventDefault(),
    !0
}
function Dc() {
    if (Oc = f(Y.y / 8, 99, Y.x / 2),
    Ja(Nc)) {
        (Bc[0] || (Bc[0] = []))[0] = Lc.u();
        var t = vc[0];
        for (let e = 10; e--; ) {
            var a = wc(e, 0);
            t[e] = Kc[e] ? a ? 1 : 3 : a ? 4 : 0
        }
    }
}
let Pc = .4, Qc;
function Rc(e, t=1) {
    e.Ab && (e.Ab.gain.value = t)
}
class Sc {
    constructor(e) {
        this.startTime = this.Tb = 0,
        e && (this.Tb = null != e[1] ? e[1] : .05,
        e[1] = 0,
        this.fa = [Tc(...e)],
        this.sampleRate = 44100)
    }
    play(e=1, t=1, a=1, i=!1, s=0) {
        if (this.fa)
            return t += t * this.Tb * a * ba(-1, 1),
            this.Ab = W.createGain(),
            this.source = Uc(this.fa, e, t, s, i, this.sampleRate, this.Ab, this)
    }
    stop() {
        this.source && this.startTime && this.source.stop(),
        this.startTime = 0,
        this.source = void 0
    }
}
class Vc extends Sc {
    constructor(e) {
        super(),
        e && (this.Tb = 0,
        fetch(e).then(e => e.arrayBuffer()).then(e => W.decodeAudioData(e)).then(t => {
            this.fa = [];
            for (let e = t.numberOfChannels; e--; )
                this.fa[e] = t.getChannelData(e);
            this.sampleRate = t.sampleRate
        }
        ))
    }
}
let W = new AudioContext;
function Uc(e, t=1, a=1, i=0, s=!1, n=44100, c, h) {
    let o = W.createBuffer(e.length, e[0].length, n)
      , r = W.createBufferSource();
    return e.forEach( (e, t) => o.getChannelData(t).set(e)),
    r.buffer = o,
    r.playbackRate.value = a,
    r.loop = s,
    (c = c || W.createGain()).gain.value = t,
    c.connect(Qc),
    e = new StereoPannerNode(W,{
        pan: f(i, -1, 1)
    }),
    r.connect(e).connect(c),
    h && (h.startTime = 0),
    "running" != W.state ? W.resume().then( () => {
        h && (h.startTime = W.currentTime),
        r.start()
    }
    ) : (r.start(),
    h.startTime = W.currentTime),
    r
}
function Tc(t=1, a, i=220, s=0, n=0, c=.1, h=0, o=1, r=0, d=0, b=0, l=0, u=0, z=0, M=0, v=0, y=0, p=1, m=0, w=0, g=0) {
    let E = r *= 500 * (a = 2 * e) / 44100 / 44100
      , x = i *= a / 44100
      , F = []
      , A = 0
      , W = 0
      , D = 0
      , S = 1
      , C = 0
      , O = 0
      , R = 0
      , N = a * Math.abs(g) * 2 / 44100
      , k = Math.cos(N)
      , K = Math.sin(N) / 2 / 2
      , Z = 1 + K
      , P = (N = -2 * k / Z,
    K = (1 - K) / Z,
    (1 + (g < 0 ? -1 : 1) * k) / 2 / Z)
      , L = -((g < 0 ? -1 : 1) + k) / Z
      , G = 0
      , T = 0
      , Y = 0
      , U = 0;
    for (d *= 500 * a / 44100 ** 3,
    M *= a / 44100,
    b *= a / 44100,
    l *= 44100,
    u = 44100 * u | 0,
    Z = (s = 44100 * s + 9) + (m *= 44100) + (n *= 44100) + (c *= 44100) + (y *= 44100) | 0; D < Z; F[D++] = R * t)
        ++O % (100 * v | 0) || (R = h ? 1 < h ? 2 < h ? 3 < h ? Math.sin(A ** 3) : f(Math.tan(A), 1, -1) : 1 - (2 * A / a % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(A / a) - A / a) : Math.sin(A),
        R = (u ? 1 - w + w * Math.sin(a * D / u) : 1) * (R < 0 ? -1 : 1) * Math.abs(R) ** o * (D < s ? D / s : D < s + m ? 1 - (D - s) / m * (1 - p) : D < s + m + n ? p : D < Z - y ? (Z - D - y) / c * p : 0),
        R = y ? R / 2 + (y > D ? 0 : (D < Z - y ? 1 : (Z - D) / y) * F[D - y | 0] / 2 / t) : R,
        g && (R = U = P * G + L * (G = T) + P * (T = R) - K * Y - N * (Y = U))),
        k = (i += r += d) * Math.cos(M * W++),
        A += k + k * z * Math.sin(D ** 5),
        S && ++S > l && (i += b,
        x += b,
        S = 0),
        !u || ++C % u || (i = x,
        r = E,
        S = S || 1);
    return F
}
let Wc = new Sc([, 0, 220, .01, .08, .05, , .5, , , , , , , , , .3, .9, .01, , -99])
  , Xc = new Sc([.3, 0, 320, .001, 10, .003, , 1, , , , , , 1, , , , , , , -1540])
  , Yc = new Sc([, .5, 90, .01, .03, .2, , 3, -.5, , , , , 19, , .1, , .5, .01])
  , Zc = new Sc([4, .2, 400, .01, .01, .01, , .8, -60, -70, , , .03, .1, , , .1, .5, .01, .4, 400])
  , $c = new Sc([.3, 0, 980, , , , , 3, , , , , , , , .03, , , , , 500])
  , ad = new Sc([1.5, 0, 110, .04, , 2, , 6, , 1, 330, .07, .05, , , , .4, .8, , .5, 1e3])
  , bd = new Sc([.7, 0, 528, , .2, 1, , 2.3, 6, , -59, , .1, , , , , .92, .1, .16, 112])
  , cd = new Sc([.05, 0, 900, .01, .15, .03, 1, .9, , , , , .01, 1, , , , , , .1, 300])
  , dd = new Sc([.9, 0, 420, .02, .2, , , 2, , , , , .007, , , , , , , 1, 200])
  , fd = new Sc([, , 250, .05, , .3, , 1.3, -.5, , , , , 3, , , , , , , 200])
  , gd = new Sc([3.4, , 511, , , .02, , 4.2, 85, 2, , , .02, .3, 1.8, .1, , .53, .01, , -1164]);
function hd(e) {
    0 != Pc && (speechSynthesis && speechSynthesis.cancel(),
    speechSynthesis) && ((e = new SpeechSynthesisUtterance(e)).lang = "en-GB",
    e.volume = +Pc,
    e.rate = 1,
    e.pitch = 1,
    speechSynthesis.speak(e))
}
new Sc([1, 0]);
let id = ["", '"Urban City" by traftay', '"Old Times (feat: Sychu)" by 8-BITek', '"VigiLatte" by VarxenCore9'], jd, kd, ld;
function md() {
    return !!jd.fa && !!kd.fa && !!ld.fa
}
function nd(e) {
    e < 0 || (od = e,
    pd = -.5,
    qd(),
    gd.play(1, 1 + od / 4))
}
let od = 1
  , rd = 0;
function sd() {
    var e;
    md() && "running" == W.state ? td < 1 || (rd != od && (1 == (e = rd = od) ? jd.play(1, 1, 0, 1) : jd.stop(),
    2 == e ? kd.play(1, 1, 0, 1) : kd.stop(),
    3 == e ? ld.play(1, 1, 0, 1) : ld.stop()),
    Rc(jd, .33),
    Rc(kd, .33),
    Rc(ld, .33)) : pd = 0
}
function ud() {
    var e, t = vd || Z.h.z < 20, a = $b((Z.g.z + (t ? 0 : 11e4)) / Zb).da;
    a && wd.length < 10 * a && !Ja(xd) && !yd.active() && (zd(Z.g.z + (t ? -1300 : ba(5e4, 6e4))),
    yd.set(ba(1, 2) / a));
    for (e of wd)
        e.update();
    wd = wd.filter(e => !e.yb)
}
function zd(e) {
    Ad || (e = new Bd(e),
    wd.push(e),
    e.update())
}
function Cd(e) {
    return 1400 * e.Ga - 1400 * ($b(e.g.z / Zb).J - 1) / 2 + e.tb
}
function Dd(e) {
    return Math.max(120, 120 + 20 * ($b(e.g.z / Zb).J - 1 - e.Ga))
}
class Bd {
    constructor(e=0, t) {
        this.g = z(0, 0, e),
        this.color = t,
        this.Fa = this.U = this.Y = this.ja = this.Ta = this.Ua = 0,
        this.Ea = z(230, 200, 380),
        this.h = z(),
        this.Nb = 0,
        this.Uc = new Ka,
        this.tb = 0,
        this.color || (this.color = da(9) ? A(ba(), ba(.5, .9), .5) : da(2) ? K : A(0, 0, .1),
        (this.Ob = .7 < ba()) && (this.Ea.z = 450,
        this.qd = A(ba(), ba(.5, 1), ba(.2, 1))),
        t = $b(this.g.z / Zb),
        this.Ga = da(t.J),
        !vd && e < Z.g.z && (this.Ga = 0 < Z.g.x ? 0 : t.J - 1),
        this.tb = ba(-200, 200),
        this.Ha = Cd(this),
        this.h.z = Dd(this))
    }
    update() {
        var e = new bc(this.g.z)
          , t = new bc(this.g.z + 100)
          , a = $b(this.g.z / Zb | 0)
          , i = Dd(this);
        i = this.Fa ? (--this.Fa,
        -1) : this.h.z < i ? .5 : this.h.z > i + 10 ? -.5 : 0,
        ba() < .002 && (this.tb = ba(-200, 200)),
        this.Ga = Math.min(this.Ga, a.J - 1),
        this.Ha = u(.01, this.Ha, Cd(this)),
        this.g.x = this.Ha,
        this.g.z += this.h.z = Math.max(0, this.h.z + i),
        a = this.Ha;
        for (n of wd)
            if (n != this && n != Z && this.g.z < n.g.z + 500 && this.g.z > n.g.z - 2e3 && Math.abs(a - n.Ha) < 500) {
                this.g.z >= n.g.z && (this.yb = 1);
                var i = this.h
                  , s = this.h.z
                  , n = n.h.z++;
                i.z = Math.min(s, n),
                this.Fa = da(20, 40);
                break
            }
        this.g.x = e.g.x + a,
        this.g.y = e.offset.y,
        t = pa(t.g, e.g),
        this.U = Math.atan2(t.x, t.z),
        this.Ua = this.U / 2,
        this.Y = e.pitch,
        this.Ta = this.ja += this.h.z / 200,
        e = this.g.z - Z.g.z,
        this.yb |= 7e4 < e || e < -2e3
    }
    l() {
        var t = new bc(this.g.z);
        if ((h = this.g.u()).y += 75,
        h.z -= Yb,
        !(h.z < 0) || ec) {
            var a = t.pitch
              , i = this.Y
              , s = fa(0, z(0, this.U), 0)
              , n = (i = fa(h, z(i, 0)).multiply(s)).multiply(fa(0, 0, z(450, this.Ob ? 700 : 500, 450)))
              , c = (nb(this != Z, 0),
            mb(60),
            new Aa(0,0,0,this.Nb ? .1 : .5));
            if (t = na(z(h.x, t.g.y, h.z), ua(z(0, 0, -60))),
            h = z(-720, 200, 600),
            a = fa(t, z(a, 0)).multiply(s).multiply(fa(0, 0, h)),
            Ob(wb, a, c, M.Zc.ca),
            mb(),
            nb(),
            ob(1, 32),
            yb.G(n, this.color),
            a = 130,
            s = -440,
            this.Ob && (a = 50,
            s = -560,
            n = z(0, 290, -250),
            c = this.qd,
            t = z(240, n.y, 300),
            mb(20),
            ub.G(i.multiply(fa(n, 0, t)), c)),
            mb(),
            !(4e4 < this.g.z - Z.g.z)) {
                ob(.2, 16),
                c = z(50, 110, 110);
                var n = fa(0, z(this.ja, this.Ua), c)
                  , c = fa(0, z(this.Ta, 0), c)
                  , t = A(0, 0, .2, this.color.a)
                  , h = z(240, 25, 220)
                  , o = z(240, 25, -300);
                for (let e = 4; e--; ) {
                    var r = e < 2 ? h : o;
                    mb(this.Ob && 1 < e && 20),
                    zb.G(i.multiply(fa(z(e % 2 ? r.x : -r.x, r.y, r.z))).multiply(e < 2 ? n : c), t)
                }
                if (mb(40),
                !this.Nb)
                    for (ob(.3, 16),
                    ub.G(i.multiply(fa(z(0, a, s), 0, z(140, 50, 20))), A(0, 0, .1)),
                    ob(1, 64),
                    n = this.Fa,
                    c = 2; c--; )
                        t = A(0, 1, n ? .5 : .2),
                        Za = !n,
                        ub.G(i.multiply(fa(z(180 * (c ? 1 : -1), a - 25, s - 10), 0, z(40, 25, 5))), t),
                        Za = 1,
                        ub.G(i.multiply(fa(z(180 * (c ? 1 : -1), a + 25, s - 10), 0, z(40, 25, 5))), K);
                this == Z && (ob(.3, 16),
                ub.G(i.multiply(fa(z(0, 10, 440), 0, z(240, 30, 30))), A(0, 0, .5)),
                ob(1, 64),
                Ob(vb, i.multiply(fa(z(0, a - 80, s - 20), z(0, e, 0), z(80, 25, 1))), K, M.Yc.ca),
                a = i.multiply(fa(z(0, 220, -200), z(-.22, 0, 0), z(190, 5, 80))),
                i = i.multiply(fa(z(0, 190, 200), z(.35, 0, 0), z(190, 5, 110))),
                n = z(a.m21, a.m22, a.m23).normalize(),
                s = z(i.m21, i.m22, i.m23).normalize(),
                n = Xb(m(n.y, 1, .85)),
                s = Xb(m(s.y, 1, .85)),
                ub.G(a, n),
                ub.G(i, s)),
                mb()
            }
        }
    }
}
class Ed extends Bd {
    constructor() {
        super(0, A(0, 1, .5, .5)),
        this.Nb = 1
    }
    l() {
        var e, t, a = Fd / 10 | 0, i = Fd % 10 / 10, s = Gd[a], n = Gd[a + 1];
        s && n && (a = s[0],
        a = z(a.x, a.y, a.z),
        e = n[0],
        e = z(e.x, e.y, e.z),
        t = a.s(e, i),
        i = u(i, s[1], n[1]),
        s = new bc(t.z),
        n = pa(new bc(t.z + 100).g, s.g),
        Hd.g = z(t.x + s.g.x, t.y, t.z),
        Hd.U = Math.atan2(n.x, n.z) + i,
        this.Ua = 1.3 * i,
        this.Y = s.pitch,
        this.h.z = e.z - a.z,
        this.Ta = this.ja += this.h.z / 200,
        super.l())
    }
}
function Id(e, t) {
    e.tc.active() || (Yc.play(m(e.h.z, 0, 50), 1, 1, 0, f(t / -300, -1, 1)),
    e.tc.set(.5))
}
function Jd(e, t=.99) {
    e.h.z *= t,
    e.Va < 0 && (Zc.play(m(e.h.z, 0, 50)),
    e.Va = 500 * ba(1, 1.5),
    e.h.y += Math.min(50, e.h.z) * ba(.1, .2))
}
class Kd extends Bd {
    constructor() {
        super(Ld || 2e3, A(0, .8, .5)),
        this.Ma = this.Va = this.aa = this.tc = new Ka,
        this.mb = new Ka,
        this.vc = new Ka,
        this.hc = new Ka,
        this.oa = [],
        this.Da = this.V = 0,
        this.Ub = new Ka,
        this.Bc = 0,
        this.Ka = new Ka,
        this.Ya = 0
    }
    l() {
        vd || super.l()
    }
    update() {
        if (vd)
            this.g.z += this.h.z = 20;
        else {
            Md ? this.oa = [] : 0 == Fd % 10 && (this.oa[Fd / 10 | 0] = [this.g.u(), this.U]),
            this.Va -= this.h.z,
            !Md && 0 < Nd && !Od.active() && ($c.play(),
            Od.set(.26),
            Nd--);
            var e, t = Z.g.z, a = (!Ja(xd) && t > Pd && (Md || 13 == (0 | Qd) && Rd.unlock(),
            ++Sd,
            Td.set(5),
            Pd += Zb,
            Qd += 38,
            Qd = Math.min(60, Qd),
            10 <= Sd && !Ja(xd) ? (Md ? Ud.unlock() : (hd("Congratulations"),
            Vd.unlock(),
            Wd < 360 && Xd.unlock(),
            0 == this.Da && Yd.unlock(),
            Zd && Zd.call("ScoreBoard.postScore", {
                id: 14643,
                value: 1e3 * Wd | 0
            }, !0)),
            $d = 1,
            ad.play(),
            xd.set(),
            1 < ae || Md || (mc = 0,
            Wd < be || !be ? (be = Wd,
            ce = 1,
            Gd = [...Z.oa]) : 0 == Gd.length && (Gd = [...Z.oa]),
            qd(),
            de())) : (Md || (hd("CHECKPOINT"),
            5 == Sd && ee.unlock()),
            Nd = 3)),
            (1 & U.ArrowRight) - (1 & U.ArrowLeft)), i = (t = 1 & U.ArrowUp,
            1 & U.Space || 1 & U.ArrowDown), s = ((2 & U.KeyE || 2 & vc[0][3] || 2 & vc[0][4]) && !this.vc.active() && (this.vc.set(.2),
            dd.play()),
            uc && (a = (Bc[0] && Bc[0][0] || z()).x,
            t = wc(0) || wc(7),
            i = wc(1) || wc(2) || wc(6),
            (e = Cc[0][7]) && (t = e),
            e = Cc[0][6]) && (i = e),
            ((fe = t || a || i ? 0 : fe) || 1 & U[0]) && !rc && (fe = 1,
            a = f(5 * (sc.x - .5), -1, 1),
            t = 1 & U[0],
            i = 1 & U[2],
            rc) && 1 & U[0] && (i = 1.8 - 2 * sc.y,
            t = m(i, .1, .2),
            i = i < 0,
            a = f(3 * (sc.x - .5), -1, 1)),
            ec && (t = a = i = 0),
            ge && (t = 1,
            a = 0),
            Ja(xd) && (t = a = i = 0),
            this.Fa = i,
            he && (2 < he ? this.V = t ? 1 : 0 : 2 == he ? t ? this.V || (this.V = ie.get() < -.5 ? 1 : 2) : this.V = 0 : t || (this.V = 0)),
            (e = new bc(this.g.z)).ua), n = (this.h.y += -4,
            this.h.u()), c = (n.z *= 1 / (1 + this.g.x / 2800 * Math.tan(-Math.atan2(20 * e.offset.x, 100))),
            na(this.g, n),
            e.width + 500), h = (this.g.x = f(this.g.x, -c, c),
            this.aa);
            this.aa = this.g.y < e.offset.y;
            for (var o, c = [{
                Ja: 80,
                ka: 3
            }, {
                Ja: 160,
                ka: 2
            }, {
                Ja: 700,
                ka: 1.25
            }], r = 0; r < c.length; r++) {
                var d = c[r];
                if (this.h.z < d.Ja && !(r < this.Ya && this.h.z > .9 * d.Ja)) {
                    this.Ya = r;
                    break
                }
            }
            Xc.source || Xc.play(1, 1, 1, 1),
            r = this.h.z * c[this.Ya].ka,
            d = f(50 / r, 0, 1),
            Xc.source && Xc.source.playbackRate.setValueAtTime(.4 + r / 400, W.currentTime),
            Rc(Xc, d),
            this.aa ? (.3 < this.hc.get() && je.unlock(),
            this.hc.set(),
            this.g.y = e.offset.y,
            r = e.pitch,
            this.Y = u(.2, this.Y, r),
            r = ta(z(0, 1, 0), r),
            d = this.h.na(r),
            r = r.scale(-1.2 * d),
            Ja(xd) || na(this.h, r),
            h || (h = m(r.length(), 20, 80),
            Zc.play(2 * h, .5)),
            (s = R[s]) && !s.lb && Math.abs(this.g.x) > e.width - this.Ea.x && !ge && Jd(this),
            i ? this.h.z -= 2 * i : t ? (s = .76 * (s = c[this.Ya]).ka * t * (1 + -.5 * f(f(this.h.z / s.Ja))),
            0 < Wd && (Wd < 2 ? (1 == this.V && (s *= .4),
            2 == this.V && (s *= 2,
            ke.unlock())) : this.V = 0),
            na(this.h, ta(z(0, 0, s), this.Y))) : this.h.z < .5 ? this.h.z *= 0 : this.h.z < 4 ? this.h.z *= .5 : this.h.z < 30 && (this.h.z *= .9),
            this.h.z = Math.max(0, .997 * this.h.z),
            this.h.x *= .5) : (this.Y *= .99,
            this.aa = 0),
            0 < Wd && (s = this.h.z / 200,
            c = Math.max(s, t / 8),
            this.ja += s,
            this.Ta += c),
            a = he ? 0 : a,
            ge && (a = f(-this.g.x / 1e3, -1, 1),
            this.g.x = f(this.g.x, -e.width, e.width)),
            a *= .4,
            s = f(this.h.z / 50, 0, .1),
            this.Ua = u(.1, this.Ua, 1.3 * a),
            this.Ma = u(.05, this.Ma, a),
            this.U = u(s, this.U, this.Ma),
            a = e.offset.x,
            a = .5 * -n.z * (a < 0 ? -1 : 1) * Math.abs(a) ** .7,
            this.g.x += a,
            this.aa && (n = .8 * this.Ma * this.h.z,
            e = 1.5 * e.wa,
            e /= Math.max(e, Math.abs(a)),
            a = f(.9 - e),
            a = f(3 * a * Math.abs(this.Ma)),
            0 < (a = i ? f(this.h.z / 100, 0, .8) : a) && !this.mb.active() && (this.mb.set(ba(.08, .1)),
            cd.play(a)),
            this.h.x += n * e),
            !he && this.aa && .5 < t && this.h.z < 70 && !this.mb.active() && 2 != this.V && (this.mb.set(ba(.08, .1)),
            cd.play(f(1))),
            $d && (this.U = u(xd.get(), this.U, -1)),
            he && (this.h.z = 0),
            Ja(xd) && (this.h = this.h.scale(.95)),
            La >= this.Ka.time && (this.Ka.time = void 0,
            le.unlock()),
            i = (t = new bc(this.g.z)).ua;
            for (o of wd)
                o != this && (e = pa(this.g, o.g),
                a = this.Ea.add(o.Ea),
                Math.abs(e.z) < a.z) && Math.abs(e.y) < a.y && (Math.abs(e.x) < a.x ? (ge || (n = this.h.z,
                this.h.z = o.h.z / 2,
                o.h.z = Math.max(o.h.z, .9 * n),
                this.h.x = 99 * (e.x < 0 ? -1 : 1),
                Id(this, e.x),
                Ja(xd)) || ++this.Da,
                this.Ub.time = void 0,
                this.Ka.time = void 0) : (n = m(Math.abs(e.x), 2e3, a.x + 200),
                n < 0 || (this.h.z > o.h.z && Math.abs(e.x) < a.x + 400 && (a = 0 < e.x ? 1 : -1,
                this.Ub.active() && this.Bc != a && !Ja(this.Ka) && this.Ka.set(.5),
                this.Ub.set(.3),
                this.Bc = a),
                !o.Uc.active() && this.g.z > o.g.z && (a = Math.abs(this.h.z - o.h.z) / 100,
                fd.play(f(n * a * .2), a, 0, 0, f(e.x / -100, -1, 1)),
                o.Uc.set(1)))));
            for (o = -20; o < 20; ++o)
                if (e = R[i + o])
                    for (var b of e.Yb)
                        b.Wa && (n = e.offset.add(b.offset),
                        a = pa(this.g, n),
                        s = z(this.Ea.x + b.Wa, 300, 430),
                        !b.fd && !b.Oa.wc && !b.Oa.xc && Math.abs(a.z) < s.z && this.g.z > n.z && (c = m(Math.abs(a.x), s.x + 1e3, s.x + 100),
                        0 < c) && (h = Math.abs(this.h.z) / 200 * (1 + Ea(F, .05)),
                        fd.play(.8 * f(c * h * .15), h, 0, 0, f(a.x / -100, -1, 1)),
                        b.fd = 1),
                        ge || Math.abs(a.z) > s.z || Math.abs(a.x) > s.x || (b.Oa.wc ? this.aa && (b.Wa = 0,
                        Jd(this, .8)) : b.Oa.xc ? this.aa && (b.Wa = 0,
                        Zc.play(3 * m(this.h.z, 0, 50), .2),
                        this.h.z *= .85) : Math.abs(a.y) < s.y && (this.h.x = 99 * ((Math.abs(n.x) + s.x + 200 > t.width ? -n.x : a.x) < 0 ? -1 : 1),
                        this.h.z *= .5,
                        Id(this, a.x),
                        b.ad || (b.ad = 1,
                        Ja(xd)) || ++this.Da)))
        }
    }
}
function me() {
    if (!ec) {
        if (ne && oe("-PAUSED-", z(.5, .6), .08, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3),
        vd) {
            for (var i = 2; i--; ) {
                var s = i ? "DRIVEN" : "WILD"
                  , n = z(.5, .3 - .15 * i).multiply(Y)
                  , c = Y.y / 9
                  , h = (Y.x / Y.y < .6 && (c = Y.x / 5),
                gb);
                h.strokeStyle = kb,
                h.textAlign = "center",
                h.lineWidth = 3,
                h.lineCap = h.lineJoin = "round";
                let a = 0;
                for (let t = 2; t--; )
                    for (let e = 0; e < s.length; e++) {
                        var o = La
                          , r = Math.sin(e - 2 * o - 2 * i)
                          , d = c + r * Y.y / 20;
                        if (d *= +f(2 * o - 2 + i),
                        h.font = `italic 900 ${d}px OpenSans, arial`,
                        o = s[e],
                        d = h.measureText(o).width,
                        t)
                            a += d;
                        else {
                            var b = n.x + d / 3 - a / 2;
                            for (let e = 2; e--; ) {
                                var l = e * Y.y / 99;
                                h.fillStyle = A(.15 - r / 9, 1, e ? 0 : .75 - .25 * r),
                                e || h.strokeText(o, b + l, n.y + l),
                                h.fillText(o, b + l, n.y + l)
                            }
                            n.x += d
                        }
                    }
            }
            if (2 < La)
                if (be && La % 20 < 10)
                    i = ja(be),
                    oe("BEST TIME", z(.5, .9), .07, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3),
                    oe(i, z(.5, .97), .07, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3);
                else if (oe(rc ? "" : uc ? "PRESS START" : "CLICK TO PLAY", z(.5, .97), rc ? .06 : .07, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3),
                !Zd) {
                    let n = 0
                      , c = (pe(e => {
                        e.Ec && e.za && ++n
                    }
                    ),
                    0);
                    pe(e => {
                        var t, a, i, s;
                        e.Ec && e.za && (i = Y.y / Y.x,
                        a = .1,
                        t = .08,
                        rc && (a *= .6,
                        t *= .6),
                        i = z(.5, .85).add(z((c - n / 2 + .5) * a * i, 0)),
                        e.image ? (e = e.image,
                        t = i,
                        a = z(.9 * a),
                        i = z(),
                        s = gb,
                        a = a.scale(Y.y),
                        t = t.multiply(Y).add(i.scale(Y.y)),
                        s.drawImage(e, t.x - a.x / 2 + i.x, t.y - a.y / 2 + i.y, a.x, a.y)) : (i.y += t / 2,
                        oe(e.icon, i, t, K, void 0, void 0, void 0, void 0, void 0, 0)),
                        ++c)
                    }
                    )
                }
        } else
            ie.active() || he ? (i = 1 - La % 1,
            s = !he && ie.active() ? "GO!" : 0 | he,
            (n = (he ? Ab : Cb).u()).a = i,
            oe(s, z(.5, .2), .25 - .1 * i, n, void 0, void 0, 900, void 0, void 0, .03)) : (i = .04 * (1 - Math.abs(Math.sin(2 * La))),
            Ja(xd) ? (s = $d ? Bb : K,
            n = .04 * (1 - Math.abs(Math.sin(2 * La + e / 2))),
            oe($d ? "YOU" : "GAME", z(.5, .2), .1 + i, s, void 0, void 0, 900, "italic", .5, void 0, 4),
            oe($d ? "WIN!" : "OVER!", z(.5, .3), .1 + n, s, void 0, void 0, 900, "italic", .5, void 0, 4),
            (ce || qe && !be) && oe("NEW RECORD!", z(.5, $d ? .6 : .5), .08 + i / 4, Ab, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3),
            $d || (i = Z.Da) && oe(i + " CRASHES", z(.5, .4), .06, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3)) : ie.active() || Md || (i = Qd < 4 ? Ab : Qd < 11 ? Bb : K,
            s = 0 | Qd,
            n = .13,
            c = .14,
            Y.x / Y.y < .6 && (n = .14,
            c = .1),
            oe(s, z(.5, n), c, i, void 0, void 0, 900, void 0, void 0, .04)));
        if ((!Md || ne) && !vd && ($d ? (i = ja(Wd),
        oe("TIME", z(.5, .42), .08, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3),
        oe(i, z(.5, .5), .08, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3),
        oe((i = Z.Da) ? i + " CRASHES" : "PERFECT!", z(.5, .67), .06, void 0, "RobotoMono, monospace", void 0, 900, void 0, void 0, void 0, 3)) : (oe(ja(Wd), z(.01, .05), .05, void 0, "RobotoMono, monospace", "left"),
        be && oe(ja(be) + " BEST", z(.01, .1), .031, void 0, "RobotoMono, monospace", "left"),
        oe("STAGE " + (Sd + 1), z(.99, .05), .05, void 0, "RobotoMono, monospace", "right"),
        i = Yb / Zb % 1,
        s = z(.985, .08),
        n = z(.18, .01),
        c = z(.005, .02),
        h = z(.01, .02),
        re(s, n, K, z(-n.x / 2, 0)),
        re(s, c, K),
        re(s, c, K, z(-n.x / 2, 0)),
        re(s, c, K, z(-n.x, 0)),
        re(s, h, Z.color, z(-n.x + n.x * i, 0)),
        rc || (i = new bc(Z.g.z).pitch,
        oe((i = .7 * (i = ta(z(0, 0, 1), i)).scale(Z.h.na(i)).length() | 0) + " MPH", z(.01, .95), .08, void 0, void 0, "left", 900, "italic"))),
        !rc || ne))
            for (i = "",
            md() && (i = id[od],
            od) && (i = "♫ " + i),
            i += "    ",
            s = pd < 0 ? 0 : (4 * pd | 0) % i.length,
            i += i,
            md() || (i = "Loading music...",
            s = 0),
            0 == Pc && (i = "Press M to Unmute",
            s = 0),
            i = i.slice(s, s + 21),
            s = .2 * Y.y / Y.x,
            n = z(.995 - s, .88),
            c = .029 * se,
            oe(i, n = rc ? ne ? (c *= .88,
            z(1 - .88 * se * s, .83)) : z(se * s, .96) : n, c, void 0, "RobotoMono, monospace"),
            i = 0; i < te.length; i++)
                te[i].l();
        vd && oe("v1.104", z(.01, .99), .04, A(0, 0, 1, .5), "RobotoMono, monospace", "left", 900, void 0, void 0, 0)
    }
}
let te = []
  , se = rc ? 1.5 : 1;
function ue() {
    for (let e = 0; e < te.length; e++)
        te[e].update()
}
class ve {
    constructor(e, t, a=0) {
        var i = we;
        this.text = e,
        this.g = t,
        this.size = i,
        this.color = K,
        this.backgroundColor = A(.6, 1, .2),
        this.oc = a
    }
    update() {
        var e, t, a;
        rc && !ne || vd || (e = Y.y / Y.x,
        this.K < 0 && rc && (this.g.y = 1.2 < e ? .75 : .97),
        t = this.g.u().add(z(this.oc * Y.y / Y.x, 0)),
        a = (e = this.size.scale(Y.y)).scale(-.5),
        t = t.multiply(Y).add(a),
        a = sc.multiply(Y),
        ea(t, e, a) && (xe.set(.05),
        e = (e = !rc && (2 & U[0] ? 1 : 0)) || (e = rc) && (4 & U[0] ? 1 : 0)) && (-1 == this.K ? (bd.play(.5, 3),
        vd = 1,
        ++ye,
        ze(),
        ne = 0,
        Nc.time = void 0) : -2 == this.K ? (Md = 1,
        ad.play(.5, 2),
        ne = 0) : (nd(this.K),
        U[0] = 0,
        vc[0][0] = 0,
        vc[0][9] = 0)))
    }
    l() {
        var e, t, a, i, s, n, c;
        rc && !ne || Md && -2 == this.K || (e = this.g.add(z(this.oc * Y.y / Y.x, 0)),
        t = this.backgroundColor,
        a = this.color,
        i = K,
        this.K == od && (t = od ? A(.1, 1, .5) : A(.1, 0, .5),
        i = kb),
        n = (s = this.size.scale(Y.y)).scale(-.5),
        n = e.multiply(Y).add(n),
        c = sc.multiply(Y),
        ea(n, s, c) && (!rc || 1 & U[0]) && (t = Ab),
        s = this.size.scale(-.5),
        t && re(e, this.size, t, s, i),
        e = e.u(),
        t = this.size.multiply(z(-.5, -.2)),
        oe(this.text, e, .8 * this.size.y, a, void 0, void 0, 900, void 0, .85 * this.size.x, void 0, 0, t))
    }
}
function re(e, t, a=K, i=z(), s) {
    var n, c = gb;
    t = t.scale(Y.y),
    e = e.multiply(Y).add(i.scale(Y.y)),
    s && (n = .005 * Y.y,
    c.fillStyle = s,
    c.fillRect(e.x - t.x / 2 - n, e.y - t.y / 2 - n, t.x + 2 * n, t.y + 2 * n)),
    c.fillStyle = a,
    c.fillRect(e.x - t.x / 2 + i.x, e.y - t.y / 2 + i.y, t.x, t.y)
}
function oe(e, t, a=.1, i=K, s="OpenSans, arial", n="center", c=400, h="", o, r=.07, d, b=z()) {
    a *= Y.y,
    o && (o *= Y.y),
    t = t.multiply(Y).add(b.scale(Y.y)),
    (b = gb).lineCap = b.lineJoin = "round",
    b.font = h + ` ${c} ${a}px ` + s,
    b.textAlign = n,
    a *= r,
    b.fillStyle = new Aa(0,0,0,i.a),
    a && b.fillText(e, t.x + a, t.y + a, o),
    (b.lineWidth = d) && b.strokeText(e, t.x, t.y, o),
    b.fillStyle = i,
    b.fillText(e, t.x, t.y, o)
}
A(0, 0, .5),
A(0, 0, .7);
let Ae = [];
function Be() {
    Ae.forEach(e => e.parent || function e(t) {
        if (t.visible) {
            t.parent && (t.g = t.zd.add(t.parent.g)),
            t.G();
            for (var a of t.children)
                e(a)
        }
    }(e))
}
let Ce = {}, De = [], Ee, Fe, Ge = z(640, 80);
function pe(t) {
    Object.values(Ce).forEach(e => t(e))
}
class He {
    constructor(e, t, a="", i="🏆") {
        this.id = e,
        this.name = t,
        this.description = a,
        this.icon = i,
        this.za = !1,
        this.Ec = !0,
        Ce[e] = this
    }
    unlock() {
        this.za || (localStorage[Ee + "_" + this.id] = this.za = !0,
        De.push(this))
    }
    G(e=0) {
        var t = gb
          , a = Math.min(Ge.x, fb.width)
          , i = fb.width - a;
        e *= -Ge.y,
        t.save(),
        t.beginPath(),
        t.fillStyle = new Aa(.9,.9,.9).toString(),
        t.strokeStyle = new Aa(0,0,0).toString(),
        t.lineWidth = 3,
        t.rect(i, e, a, Ge.y),
        t.fill(),
        t.stroke(),
        t.clip(),
        a = z(i + 15 + 25, e + Ge.y / 2),
        this.image ? gb.drawImage(this.image, a.x - 25, a.y - 25, 50, 50) : Wb(this.icon, a, 35, kb),
        i = z(i + 50 + 30, e + 28),
        Wb(this.name, i, 38, kb, 0, void 0, "left"),
        i.y += 32,
        Wb(this.description, i, 24, kb, 0, void 0, "left"),
        t.restore()
    }
}
class Ie extends He {
    unlock() {
        super.unlock(),
        Zd && Zd.call("Medal.unlock", {
            id: this.id
        }, !0)
    }
}
let Zd;
class Je {
    constructor() {
        var e = CryptoJS;
        if (this.Vc = "59869:rTPij6Lv",
        this.lc = "8X+kESmXQ76PYyEAXnmeUw==",
        this.$c = e,
        this.host = location ? location.hostname : "",
        this.Vb = new URL(location.href).searchParams.get("ngio_session_id")) {
            this.cd = (e = this.call("Medal.getList")) ? e.result.data.medals : [];
            for (var t of this.cd)
                (e = Ce[t.id]) && (e.yd = t.icon,
                e.name = t.name,
                e.description = t.description,
                e.za = t.unlocked,
                e.xd = t.difficulty,
                e.value = t.value,
                e.value) && (e.description += ` (${e.value})`);
            setInterval( () => this.call("Gateway.ping", 0, !0), 3e5)
        }
    }
    call(e, t, a=!1) {
        var i, s;
        return e = {
            component: e,
            parameters: t
        },
        this.lc && (s = (t = this.$c).enc.Base64.parse(this.lc),
        i = t.lib.WordArray.random(16),
        s = t.AES.encrypt(JSON.stringify(e), s, {
            iv: i
        }),
        e.secure = t.enc.Base64.stringify(i.concat(s.ciphertext)),
        e.parameters = 0),
        t = {
            app_id: this.Vc,
            session_id: this.Vb,
            call: e
        },
        (e = new FormData).append("input", JSON.stringify(t)),
        (t = new XMLHttpRequest).open("POST", "https://newgrounds.io/gateway_v3.php", a),
        t.send(e),
        t.responseText && JSON.parse(t.responseText)
    }
}
let ke = new Ie(83319,"Fired Up","Get off to a quick start","🔥"), ee = new Ie(83320,"Big City","Make it to the city","🌆"), Vd = new Ie(83321,"Go The Distance","Make it to the end of the road","🏆"), Yd = new Ie(83322,"Perfectionist","Finish without hitting anything","👌"), Xd = new Ie(83323,"Speed Racer","Finish in under 6 minutes","🚗"), Ud = new Ie(83324,"Easy Rider","Finish in free ride mode","🌴"), le = new Ie(83325,"Thread the Needle","Pass between two cars without crashing","🧵"), je = new Ie(83326,"Liftoff","Get off the ground","🚀"), Rd = new Ie(83327,"Lucky Number 13","Pass a checkpoint with 13 seconds left","🍀"), ae, Ad, ge, ec, lc, Ke, Le, Me = 1 / 60, F = new Ia, Ne = 0, Oe = 0, kc = (pc = 1,
Ke ? 1e3 : 4900), Zb = 100 * kc, Ld = 1 < ae ? ae * Zb - 1e3 : ae && !lc ? 5e3 : 0, Y, fb, gb, La, Fd, Pe, ne, Qe = 0, Re = 0, td = 0, Qd, he, ie, xd, Pd, Wd, Sd, $d, qe, ce, Td, Nd, Od, yd, vd = 1, ye = 0, pd = 0, xe, Sb, Se, Yb, Te, va, fe, R, wd, Z, Ue, Md;
function ze() {
    Md = La = Fd = Pe = Yb = Qd = Wd = Sd = $d = qe = ce = Md = Nd = 0,
    he = ae ? 0 : 4,
    va = vd ? ba(7) : -.15,
    Qd = 47,
    Pd = Zb,
    ie = new Ka,
    xd = new Ka,
    yd = new Ka,
    Od = new Ka,
    Td = new Ka,
    xe = new Ka,
    Sb = z(),
    Se = z(),
    Ue = 0,
    Te = 1,
    wd = [],
    Da(F, 1337),
    R = [];
    for (var t = 0, a = 0, e = 0, i = ia(1e5), s = 0, n = 1, c = 0, h = 1, o = 0, r = 0, d = 0, b = 0, l = 10 * kc, v = Ke ? Math.min(kc, 500) : 500, y = 0; y < l + 5e4; ++y) {
        var p, w, g, x = 0 | (S = y / kc), A = $b(x), S = 700 * u(m(y % kc, 0, v), $b(S - 1).J, A.J), N = y % kc;
        N = N < 100 || N > kc - 100,
        (N |= !x && y < 400) ? t = a = e = 0 : (x = A.N,
        N = A.ia,
        p = A.W,
        t-- < 0 && (t = ia(100, 400),
        e = Fa(F, .5 + b / 1e3) ? -1 : 1,
        e = Fa(F, x) ? e * D(F, N, p) : 0),
        x = A.T,
        N = A.H,
        p = A.O,
        w = A.C,
        g = A.I,
        a-- < 0 && (a = ia(100, 400),
        n = Fa(F, x) ? (s = D(F, N, p),
        D(F, w, g)) : (s = 0,
        w))),
        l - 500 < y && (e = 0),
        d += f(.02) * (e - d),
        o += r += f(.01) * (A.bd - r),
        x = c += f(.01) * (s - c),
        A = h += f(.01) * (n - h),
        c && (i += x / A),
        x = o,
        N = i,
        p = aa(N, 1),
        A = x + 20 * (N = u(p * p * (3 - 2 * p), D(new Ia(N), -1, 1), D(new Ia(N + 1), -1, 1))) * A,
        b += d = Le && (d = -.7,
        Math.min(.7, y / 999),
        A = 0,
        y < 100) ? 0 : d,
        R[y] = new jc(y,z(d, A, 100 * y),S)
    }
    for (t = 0; t < R.length - 1; ++t)
        R[t].offset = R[t].offset.s(R[t + 1].offset, .5);
    for (n = s = 1,
    h = c = i = a = t = 0; h < R.length; ++h)
        if (d = h % kc,
        o = R[h],
        r = $b(o.level),
        (b = R[h - 1]) && (o.pitch = Math.atan2(b.offset.y - o.offset.y, 100),
        o.La = sa(z(0, o.offset.y - b.offset.y, 100), z(1, 0)).normalize()),
        d || (s = 1),
        o.lb || h < 50)
            a = 0;
        else {
            for (v = l = b = 0; v < 150; v += 20)
                (y = R[h + v]) && v < 150 && (0 < (y = y.offset.x) ? b = Math.max(b, y) : l = Math.max(l, -y));
            let e;
            if (h < 10 * kc && (.45 < l || .45 < b) && (e = l - b < 0 ? -1 : 1,
            0 == h % 10) && ic(o, M.Kc, e * (o.width + 500)),
            r.Sa) {
                if (b = r.Sa.rd,
                l = r.Sa.sd,
                100 < d && d < kc - 100 && (v = a,
                i-- < 0 && (i = (a = !a) ? b ? 10 : ia(200, 500) : ia(500, 800)),
                a)) {
                    ic(o, l && !v ? M.ec : r.Sa, 0),
                    l && 0 == h % 50 && ic(o, M.Ac, 0, 1600);
                    continue
                }
            } else
                a = i = 0;
            b = r.X,
            0 == h % r.sb && Fa(F, b) ? (b = h - c,
            r = r.ic,
            d = e ? -e : F.sign(),
            200 < b && 5 == o.level && Fa(F, .2) && (c = h,
            r = 6,
            d = -o.offset.x < 0 ? -1 : 1),
            b = o.width,
            v = ia(l = Lb.length),
            1 < r && (v = n++ % l),
            l = Lb[v],
            1 < r && (b += r * l.size + D(F, 1e3)),
            ic(o, l, d * D(F, b + 600, b + 800), 0, r)) : r.Sc && (Fa(F, .001) && (s = Fa(F, .4) ? 1 : Fa(F, .1) ? 0 : D(F)),
            b = r.M,
            l = r.Zb,
            0 == h % b) && Fa(F, l * s) ? ic(o, r.Sc, (r.Rc || (h % (2 * b) < b ? 1 : -1)) * (o.width + D(F, 700, 1e3))) : 40 < d && d < kc - 40 && t-- < 0 && r.bb && Fa(F, r.Db) && (ic(o, r.bb, Ea(F, o.width / .9)),
            t = D(F, 40, 80))
        }
    Xc.stop(),
    wd.push(Z = new Kd),
    vd ? Z.g.z = 163e3 + 2 * ye % 9 * Zb : (Hd = new Ed,
    ae || hd("Get Ready!")),
    Ue = Z.g.z
}
function Ve(t=0) {
    ne && Xc.stop();
    var a = innerWidth / innerHeight
      , i = (Y = z(fb.width = 3 < a ? 3 * innerHeight : a < .45 ? .45 * innerHeight : innerWidth, fb.height = innerHeight),
    fb.width / fb.height);
    if (fb.style.width = Ma.style.width = a < i ? "100%" : "",
    fb.style.height = Ma.style.height = a < i ? "" : "100%",
    document.body.style.cursor = ne ? "auto" : xe.active() ? "pointer" : fe ? 1 & U[2] ? "grabbing" : 1 & U[0] ? "pointer" : "grab" : "auto",
    a = t - Re,
    Re = t,
    Pe += ne ? 0 : a,
    Pe = Math.min(Pe, 50),
    t = a / 1e3,
    td += t,
    pd += t,
    ne)
        xc(),
        ue(),
        (2 & U.Space || 2 & U.KeyP || 2 & U[0] && !rc || uc && (2 & vc[0][0] || 2 & vc[0][9])) && (ne = 0,
        $c.play(.5)),
        (2 & U.Escape || uc && 2 & vc[0][8]) && (ne = 0,
        Zc.play(2),
        vd = 1,
        ++ye,
        ze()),
        xc(),
        We(),
        ac(),
        sd(),
        zc();
    else {
        for (t = 0,
        Pe < 0 && -9 < Pe && (t = Pe,
        Pe = 0); 0 <= Pe; Pe -= 1e3 / 60)
            La = Fd++ / 60,
            ue(),
            Qc && Qc.gain && (Qc.gain.value = Pc),
            Zd && !Oe && ((a = Zd).call("App.logView", {
                host: a.host
            }, !0),
            Oe = 1),
            2 & U.KeyM && (speechSynthesis && speechSynthesis.cancel(),
            Pc && Zc.play(.4, 3),
            Pc = Pc ? 0 : .3) && Zc.play(),
            2 & U.Enter && Vb(),
            2 & U.KeyC && confirm("Clear save data?") && (bd.play(.5, .5),
            Gd = [],
            de(),
            mc = be = 0,
            qd()),
            ud(),
            vd ? ((2 & U[0] || 2 & U.Space || uc && (2 & vc[0][0] || 2 & vc[0][9])) && (vd = 0,
            ze()),
            60 < La && (++ye,
            ze())) : (2 & U.KeyR && (vd = 0,
            bd.play(1, 2),
            ze()),
            (2 & U.Escape || uc && 2 & vc[0][8]) && (bd.play(.5, 3),
            vd = 1,
            ++ye,
            ze()),
            2 & U.KeyF && !Md && (Md = 1,
            ad.play(.5, 2)),
            (2 & U.Digit0 || 2 & U.Backquote) && nd(0),
            2 & U.Digit1 && nd(1),
            2 & U.Digit2 && nd(2),
            2 & U.Digit3 && nd(3),
            2 & vc[0][5] && nd((od + 1) % 4),
            document.hasFocus() && (Ne && !document.fullscreenElement && Vb(),
            Ne = 0),
            Md && (he = 0),
            (1 < xd.get() && (2 & U[0] || uc && (2 & vc[0][0] || 2 & vc[0][9])) || 9 < xd.get()) && (vd = 1,
            ye = 0,
            ze()),
            0 < he && !ie.active() && (--he,
            Wc.play(1, he ? 1 : 2),
            ie.set(1)),
            he || Md || Ja(xd) || (Wd += Me,
            a = Qd,
            (Qd -= Me) < 4 && (0 | a) != (0 | Qd) && Wc.play(1, 3),
            a = Z.g.z,
            mc && !qe && a > mc && 5e3 < a && !be && (ad.play(1, 2),
            qe = 1,
            hd("NEW RECORD")),
            Qd <= 0 && (5e3 < a && (!mc || a > mc ? (qe = 1,
            mc = a,
            Gd = [...Z.oa],
            qd(),
            de()) : Gd.length || (Gd = [...Z.oa],
            qd(),
            de())),
            Qd = 0,
            hd("GAME OVER"),
            xd.set(),
            bd.play()))),
            xc(),
            vd || !(2 & U.KeyP || uc && 2 & vc[0][9]) || Ja(xd) || (ne = 1,
            Qe++,
            $c.play(.5, .5)),
            We(),
            ac(),
            sd(),
            zc();
        Pe += t
    }
    t = Y,
    G.viewport(0, 0, Ma.width = t.x, Ma.height = t.y),
    Sa = Ra = 0,
    ab.reset(),
    G.texParameteri(3553, 10241, 9728),
    G.texParameteri(3553, 10240, 9728),
    t = fa(Sb, Se).inverse(),
    a = 1 / Math.tan(.5),
    t = new DOMMatrix([a / (Ma.width / Ma.height), 0, 0, 0, 0, a, 0, 0, 0, 0, 10001 / 9999, 2.000200020002, 0, 0, -1, 0]).multiply(t),
    G.uniformMatrix4fv(bb.m, 0, t.toFloat32Array()),
    nb(Za = $a = 0, 0),
    Da(F, 13),
    t = Yb / Zb;
    for (var s, a = $b(t), n = $b(t - 1), i = t % 1, c = m(i, 0, .1), h = (Tb(na(z(0, 800, 1e3), Sb), z(495e3, 79200), a.A),
    n.A.s(a.A, c)), o = n.B.s(a.B, c), r = (Rb(h, o),
    Ta = ua(z(0, 1, 1)).normalize(),
    Wa = h.s(K, .8).s(kb, .3),
    Xa = o.s(K, .8).s(kb, .3),
    Ya = o.s(K, .5),
    o = M.ub.ca,
    h = M.na.ca,
    1400 * u(c, n.S, a.S)), d = n.ya.s(a.ya, c), b = aa(va + e, 2 * e) - e, l = 0; l < 1; l += .05)
        d.a = l ? (1 - l) ** 6 : 1,
        Tb(na(z(-5e3 * b, r, 1e3), Sb), z(200 * (1 + 30 * l)), d, l ? h : o);
    for (o = 99; o--; ) {
        r = n.P.s(a.P, c),
        d = u(c, n.vb, a.vb),
        b = u(c, n.la, a.la),
        l = -5e3 * va + D(F, 1e4) + 50 * La * D(F, 1, 1.5);
        var l = aa(l, 1e4) - 5e3
          , v = D(F, 1400)
          , y = D(F, 300, 800);
        Tb(na(z(l, v, 1e3), Sb), z(y * d, y * b), r, h)
    }
    for (c = (n = a.Eb).ca,
    h = a.R,
    o = 99; o--; )
        d = o / 99,
        r = 1 + -.5 * f(d),
        r = t < .5 || 9.5 < t ? 1 : i < .1 ? (i / .1) ** r : .9 < i ? 1 - ((i - 1) / .1 + 1) ** r : 1,
        b = .9 + f(d) * (.98 - .9),
        d = D(F, 100, 200) * h * (1 + -.6 * f(d)),
        d = z(D(F, 1, 2) * (n.D ? d * F.sign() : d), d, d),
        b = aa(-5e3 * va / b + D(F, 1e4), 1e4) - 5e3,
        l = .75 * d.y,
        a.uc && Fa(F, a.uc) && (d.y *= -1),
        r = u(r, 1.5 * -l, l),
        l = n.ea[ia(n.ea.length)],
        Tb(na(z(b, r, 1e3), Sb), d, l, c);
    t += .2,
    t = Ba($b(t - 1).v.s($b(t).v, m(t % 1, 0, .1)), .1),
    Tb(na(z(0, -800, 1e3), Sb), z(5e3, 800), t),
    hb(),
    nb(),
    Za = $a = 1,
    $a = 0,
    ob(.3, 16),
    cc(1),
    nb(0, 0),
    cc(),
    $a = 1,
    nb();
    for (s of wd)
        s.l();
    for (Hd && Hd.l(),
    s = new bc(Yb).ua,
    nb(1, 0),
    ob(0),
    Za = 0,
    t = 1e3; t--; )
        if (a = s + t,
        i = R[a]) {
            Da(F, 1337 + a);
            for (var p of i.Yb)
                p.l();
            if (n = $b(i.level),
            h = i.offset.z / Zb,
            c = $b(h + 1),
            h = m(h % 1, .9, 1),
            o = i.width,
            !i.lb)
                for (r = 2; r--; )
                    !r && n.Mc ? (d = D(F, -1e4, 1e4),
                    b = D(F, 2e3, 3e3),
                    b = 1e4 - (D(F, 1e4) + La * b) % 1e4,
                    Tb(na(z(d + 1e3 * hc(i), b), i.g), z(50), K, M.na.ca)) : (d = (a + r) % 2 ? 1 : -1) == n.fc ? (l = (b = M.Tc).size * (1 + D(F, -b.va, b.va)),
                    y = o + D(F, 12e3, 8e4),
                    v = La - a / 70,
                    dc(y = na(z(d * y + 2e3 * Math.sin(v), 0), i.g), z(d * l, .4 * l, l), K, b, 9 * Math.cos(v))) : (l = (b = Fa(F, h) ? c : n).Dc,
                    v = b.ga,
                    b.Dc && (l = (b = Ga(l, v)).size * (1 + D(F, -b.va, b.va)),
                    d *= D(F, o + b.size + 6 * b.mc * l, 3e4),
                    d = na(z(d, 0), i.g),
                    v = hc(i),
                    y = b.ea[ia(b.ea.length)],
                    dc(d, l = z(b.D && Fa(F) ? -l : l, l, l), y, b, v)))
        }
    if (hb(),
    nb(),
    Za = 1,
    Ja(Nc) && (s = m(Nc.get(), 4, 3)) && !ne) {
        for ((p = gb).save(),
        p.globalAlpha = .3 * s,
        p.strokeStyle = "#fff",
        p.lineWidth = 3,
        p.fillStyle = 0 < qa(Lc) ? "#fff" : "#000",
        p.beginPath(),
        s = z(Oc, Y.y - Oc),
        p.arc(s.x, s.y, Oc / 2, 0, 9),
        p.fill(),
        p.stroke(),
        s = z(Y.x - Oc, Y.y - Oc),
        t = 2; t--; )
            a = s.add(z(0, (t ? 1 : -1) * Oc / 2)),
            p.fillStyle = Kc[t] ? "#fff" : "#000",
            p.beginPath(),
            p.arc(a.x, a.y, Oc / 3, 0, 9),
            p.fill(),
            p.stroke();
        p.restore()
    }
    me(),
    Be(),
    De.length && (p = De[0],
    s = td - Fe,
    Fe ? 5 < s ? (Fe = 0,
    De.shift()) : p.G(s < .5 ? 1 - s / .5 : 4.5 < s ? (s - 4.5) / .5 : 0) : Fe = td),
    requestAnimationFrame(Ve)
}
function We() {
    var e = Z.g.z
      , t = new bc(e);
    va += (e - Ue) * t.offset.x / 2e4,
    Ue = e,
    e = .9 * t.pitch,
    ne || (Se.x = u(Te ? 1 : .1, Se.x, e),
    Te = 0),
    e = ta(z(0, 680, 1030), -Se.x),
    Yb = Z.g.z - e.z,
    Sb.y = t.offset.y + (vd ? 1e3 : e.y),
    Sb.x = Z.g.x,
    ec && (Sb = freeCamPos.u(),
    Se = freeCamRot.u())
}
onblur = () => {
    vd || ne || (speechSynthesis && speechSynthesis.cancel(),
    Xc.stop(),
    ne = 1,
    Qe++)
}
;
let be, mc, Gd, Hd, Xe = JSON.parse(localStorage.DrivenWild || "{}"), Ye = (be = Xe.time || 0,
mc = Xe.bestDistance || 0,
null != Xe.radioMusicTrack && (od = Xe.radioMusicTrack),
JSON.parse(localStorage.DrivenWildGHOST || "{}"));
function qd() {
    localStorage.DrivenWild = JSON.stringify({
        time: be,
        bestDistance: mc,
        radioMusicTrack: od
    })
}
function de() {
    localStorage.DrivenWildGHOST = JSON.stringify({
        ghost: Gd,
        ghostVersion: 5
    })
}
Gd = Ye.ghost || [],
(Ye.ghostVersion || 0) < 5 && (Gd = []),
console.log("Driven Wild v1.104 by Frank Force"),
console.log("www.frankforce.com 🚗🌴"),
(Zd = new Je).Vb || (Zd = 0),
jd = new Vc("./assets/song1.mp3"),
kd = new Vc("./assets/song2.mp3"),
ld = new Vc("./assets/song3.mp3"),
(Qc = W.createGain()).connect(W.destination),
Qc.gain.value = Pc;
let Ze, $e = z(1, .97), we = z(.07 * se), af = -we.x * (rc ? 1.2 : 1.4);
(Ze = new ve("OFF",$e,3 * af - .02)).K = 0,
te.push(Ze),
(Ze = new ve("1",$e,2 * af - .02)).K = 1,
te.push(Ze),
(Ze = new ve("2",$e,+af - .02)).K = 2,
te.push(Ze),
(Ze = new ve("3",$e,-.02)).K = 3,
te.push(Ze),
rc && ((Ze = new ve("QUIT",z(0, .97),.02 + we.x)).K = -1,
te.push(Ze),
(Ze = new ve("FREE",z(0, .97),.04 + 2 * we.x)).K = -2,
te.push(Ze)),
Ee = "DrivenWildMedals",
pe(e => e.za = !!localStorage[Ee + "_" + e.id]),
ae && (vd = 0),
( () => {
    document.body.appendChild(Ma = document.createElement("canvas")),
    G = Ma.getContext("webgl2", {
        alpha: !1
    }),
    Oa = db(),
    G.useProgram(Oa),
    G.bindBuffer(34962, G.createBuffer()),
    G.bufferData(34962, 44e4, 35048),
    G.blendFunc(770, 771),
    lb(3042),
    lb(2884);
    var e, t = new ArrayBuffer(44e4);
    Pa = new Float32Array(t),
    Qa = new Uint32Array(t);
    let n = 0;
    (t = (e, t, a, i) => {
        e = G.getAttribLocation(Oa, e);
        var s = 1 == a;
        G.enableVertexAttribArray(e),
        G.vertexAttribPointer(e, i, t, s, 44, n),
        n += i * a
    }
    )("p", 5126, 4, 4),
    t("n", 5126, 4, 4),
    t("c", 5121, 1, 4),
    t("u", 5126, 4, 2),
    (ab = {
        reset: function() {
            ab.Nc = 1,
            ab.Oc = 0
        }
    }).reset(),
    bb = {};
    for (e of "lgafeom".split(""))
        bb[e] = G.getUniformLocation(Oa, e)
}
)(),
document.body.appendChild(fb = document.createElement("canvas")),
gb = fb.getContext("2d"),
Ma.style.cssText = fb.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);",
( () => {
    ub = Mb([z(-1, 1), z(1, 1), z(1, -1), z(-1, -1)]);
    var t = [z(-1, 1), z(1, 1), z(-1, -1), z(1, -1)]
      , a = t.map(e => e.multiply(z(.5, -.5, .5)).add(z(.5)));
    for (vb = new Nb(t,t.map( () => z(0, 0, 1)),a),
    wb = vb.transform(0, z(e / 2, 0)),
    t = [],
    a = 12; a--; )
        t.push(wa(z(1, 0), a / 12 * e * 2));
    xb = Mb(t),
    yb = (yb = Mb([z(-1, .5), z(-.7, .4), z(-.2, .5), z(.1, .5), z(1, .2), z(1, .2), z(1, 0), z(-1, 0)], .5)).transform(0, z(0, -e / 2)),
    zb = xb.transform(0, z(0, -e / 2))
}
)(),
( () => {
    vc = [],
    Bc = [],
    Cc = [],
    vc[0] = [],
    Cc[0] = [],
    onkeydown = e => {
        uc = 0,
        e.repeat || (U[e.code] = 3,
        U[t(e.code)] = 3),
        e.stopPropagation(),
        e.preventDefault()
    }
    ,
    onkeyup = e => {
        U[e.code] = 4,
        U[t(e.code)] = 4,
        e.stopPropagation(),
        e.preventDefault()
    }
    ,
    onmousedown = e => {
        W && "running" != W.state && W.resume(),
        uc = 0,
        U[e.button] = 3,
        tc = z(e.x, e.y),
        sc = Ac(tc)
    }
    ,
    onmouseup = e => U[e.button] = 2 & U[e.button] | 4,
    onmousemove = e => {
        tc = z(e.x, e.y),
        sc = Ac(tc),
        ec && (mouseDelta.x += e.movementX / Y.x,
        mouseDelta.y += e.movementY / Y.y)
    }
    ,
    oncontextmenu = () => !1;
    let t = e => "KeyW" == e ? "ArrowUp" : "KeyS" == e ? "ArrowDown" : "KeyA" == e ? "ArrowLeft" : "KeyD" == e ? "ArrowRight" : e;
    rc && Hc()
}
)(),
(pc ? new Promise(e => {
    let t = new Image;
    t.onerror = t.onload = () => {
        G.bindTexture(3553, eb(t)),
        e()
    }
    ,
    t.crossOrigin = 'anonymous'
    t.src = "./assets/texture.png"
}
) : new Promise(e => {
    qc(),
    G.bindTexture(3553, eb(fb)),
    e()
}
)).then( () => {
    for (var e in Da(F, 12345),
    (M = {}).Ra = new N(z(0, 1),1500,.2,.1,.04),
    M.Ra.nb = 1,
    M.Qa = new N(z(1, 1),2e3,.5,.06,.1),
    M.ha = new N(z(2, 1),1e3,.6,.04),
    M.Pa = new N(z(3, 1),1e3,.3,.1,.06),
    M.bc = new N(z(4, 1),1500,.3,.1,.04),
    M.bc.nb = 1,
    M.ob = new N(z(5, 1),1e3,.5,.1,.06),
    M.$b = new N(z(6, 1),1500,.3,.1,.1),
    M.cc = new N(z(4, 3),1300,.3,.06,.1),
    M.dc = new N(z(5, 3),1e3,.3,.06,.1),
    M.ac = new N(z(3, 1),1e4,.5,.1,.1),
    M.ac.j = z(.8, 0, .5),
    M.ac.i = 0,
    M.Ra.i = M.Qa.i = M.ha.i = M.Pa.i = M.bc.i = M.ob.i = M.$b.i = M.cc.i = M.dc.i = .7,
    M.pa = new N(z(0, 3),500,.5,1),
    M.pa.j = z(.3, .4, .5),
    M.$a = new N(z(0, 3),600,.3,1),
    M.$a.j = z(.13, .6, .7),
    M.ab = new N(z(1, 3),500,.3,1),
    M.Bb = new N(z(2, 3),500,.3,1),
    M.pc = new N(z(3, 3),500,.3,1),
    M.Cb = new N(z(0, 3),700,.3,1),
    M.Cb.j = z(0, .8, .5),
    M.rc = new N(z(0, 3),300,.5,1),
    M.rc.j = z(.4, 1, .9),
    M.qc = new N(z(0, 3),1e3,.5,1),
    M.qc.j = z(.4, .4, .5),
    (Lb = []).push(M.ld = new N(z(0, 2),600,0,.02,.8,0)),
    Lb.push(M.Cd = new N(z(5, 2),900,0,.02,.4,0)),
    Lb.push(M.kd = new N(z(6, 2),450,0,.02,.8,0)),
    Lb.push(M.nd = new N(z(1, 2),500,0,.02,.4,0)),
    Lb.push(M.jd = new N(z(2, 2),550,0,.02,.8,0)),
    Lb.push(M.md = new N(z(7, 2),600,0,.02,.8,0)),
    Lb.push(M.Bd = new N(z(4, 2),500,0,.02,.6,0)),
    M.hd = new N(z(3, 2),500,0,.02,.8,0),
    M.Kc = new N(z(0, 5),500,0,.05,.5),
    M.Kc.nb = 1,
    M.gd = new N(z(1, 4),1e3,.3,0,.6,0),
    M.ba = new N(z(2, 4),800,.2,0,.57,0),
    M.Na = new N(z(1, 4),5e3,.7,0,.6,0),
    M.Na.i = 0,
    M.Na.j = z(.08, 1, .8),
    M.Na.qa = .01,
    M.ta = new N(z(2, 4),8e3,.5,0,.25,0),
    M.ta.i = 0,
    M.ta.j = z(.05, 1, .8),
    M.ta.qa = .01,
    M.jb = new N(z(2, 4),8e3,.7,0,.5,0),
    M.jb.i = 0,
    M.jb.j = z(.05, 1, .8),
    M.jb.qa = .01,
    M.kb = new N(z(2, 4),5e3,.5,0,1,0),
    M.kb.i = 0,
    M.kb.j = z(.8, 1, .8),
    M.kb.qa = .2,
    M.Cc = new N(z(1, 4),1e3,.5,0,.5,0),
    M.Cc.j = z(0, 0, .2),
    M.pb = new N(z(6, 4),1e4,0,0,0,0),
    M.pb.i = 0,
    M.pb.j = z(.05, 1, .8),
    M.pb.rd = 1,
    M.qb = new N(z(7, 4),5e3,0,0,0,0),
    M.qb.i = 0,
    M.qb.j = z(0, 0, .1),
    M.qb.sd = 1,
    M.ec = new N(z(7, 4),5e3,0,0,0,0),
    M.ec.i = 0,
    M.ec.j = z(0, 0, .8),
    M.cb = new N(z(3, 4),600,.2,0,.9),
    M.cb.i = 0,
    M.cb.wc = 1,
    M.cb.Xb = -.02,
    M.eb = new N(z(4, 4),600,.2,0,.9),
    M.eb.i = 0,
    M.eb.xc = 1,
    M.eb.Xb = -.02,
    M.Tc = new N(z(5, 4),6e3,.5,1),
    M.Tc.i = 0,
    M.Jc = new N(z(1, 6),2300,0,.01,0,0),
    M.Jc.i = 0,
    M.Ic = new N(z(0, 6),2300,0,.01,0,0),
    M.Ic.i = 0,
    M.Gc = new N(z(6, 0),1e3,0,.01,0,0),
    M.Gc.i = 0,
    M.Hc = new N(z(7, 0),1e3,0,.01,0,0),
    M.Hc.i = 0,
    M.Pc = new N(z(0, 4),1800,0,0,.03,0),
    M.Pc.i = .3,
    M.sc = new N(z(2, 6),500,.3,.05,.5,0),
    M.sc.Pb = .5,
    M.Ac = new N(z(0, 0),200,0,0,0,0),
    M.Ac.i = 0,
    M.fb = new N(z(3, 6),0,0,0,0,1),
    M.fb.qa = M.fb.Pb = .15,
    M.fb.j = z(1),
    M.Ib = new N(z(7, 6)),
    M.Ib.j = z(.25, .5, .6),
    M.Ib.D = 0,
    M.Jb = new N(z(7, 6)),
    M.Jb.j = z(.05, .7, .7),
    M.Jb.D = 0,
    M.Fb = new N(z(7, 6)),
    M.Fb.j = z(.1, .5, .6),
    M.Fb.D = 0,
    M.Kb = new N(z(6, 6)),
    M.Kb.j = z(.1, .5, .6),
    M.Kb.D = 0,
    M.Gb = new N(z(6, 6)),
    M.Gb.j = z(.15, .5, .8),
    M.Gb.D = 0,
    M.Lb = new N(z(7, 6)),
    M.Lb.j = z(0, 0, 1),
    M.Lb.D = 0,
    M.Hb = new N(z(6, 6)),
    M.Hb.j = z(.2, .4, .8),
    M.Hb.D = 0,
    M.Mb = new N(z(7, 6)),
    M.Mb.j = z(.7, .5, .6),
    M.Mb.D = 0,
    M.gb = new N(z(7, 6)),
    M.gb.j = z(0, 0, .7),
    M.gb.D = 0,
    M.ub = new N(z()),
    M.na = new N(z(1, 0)),
    M.Zc = new N(z(2, 0)),
    M.Yc = new N(z(3, 0)),
    M.wd = new N(z(4, 0)),
    M.Ad = new N(z(5, 0)),
    M.Wc = new N(z(),50),
    M.Wc.j = z(0, 0, 0),
    M) {
        var t = M[e];
        t.ea = [];
        for (let e = 32; e--; ) {
            var a = t.ea
              , i = a.push
              , s = t.j.u();
            s.x += Ea(F, t.qa),
            s.z += Ea(F, t.Pb),
            s = ya(s),
            i.call(a, s)
        }
    }
    nc = [],
    a = 0,
    (t = new oc(a++,[M.pa, M.Ra, M.ba],M.Ra)).fc = -1,
    t.R = .7,
    t.X = .3,
    t.da = .7,
    t.A = A(.5, 1, .5),
    t.N = .6,
    t.ia = .2,
    t.H = .1,
    t.O = .4,
    t.C = 15,
    t.I = 35,
    (t = new oc(a++,[M.Qa, M.pa, M.ob, M.ha, M.ab, M.pc, M.Bb],M.ob,M.Kb)).R = 10,
    t.M = 10,
    t.ga = 9,
    t.B = A(.5, .3, .5),
    t.L = A(.05, .4, .2),
    t.v = A(.2, .4, .4),
    t.P = A(0, 0, 1, .3),
    t.la = .2,
    t.S = .7,
    t.X = .1,
    t.N = .7,
    t.T = .8,
    t.H = .3,
    t.O = .7,
    t.C = 50,
    t.I = 100,
    (t = new oc(a++,[M.$a, M.Pa, M.ba, M.ha],M.Pc,M.Gb)).R = 4,
    t.M = 50,
    t.Zb = 1,
    t.A = A(.15, 1, .9),
    t.B = A(.5, .7, .6),
    t.L = A(.1, .2, .2),
    t.Z = A(0, 0, 1, .5),
    t.v = A(.1, .2, .5),
    t.Rc = 1,
    t.la = .05,
    t.S = .9,
    t.Fc = 1,
    t.J = 2,
    t.bb = M.eb,
    t.Db = .005,
    t.Sa = M.qb,
    t.da = .7,
    t.sb = 90,
    t.ic = 6,
    t.X = .5,
    t.N = .4,
    t.ia = .2,
    t.W = .6,
    t.T = 1,
    t.H = 0,
    t.O = .3,
    t.C = 30,
    t.I = 60,
    (t = new oc(a++,[M.rc, M.Pa, M.cc, M.ba, M.ha],M.cc,M.Lb)).R = 2,
    t.ga = 9,
    t.M = 21,
    t.A = A(.5, .2, .4),
    t.B = K,
    t.L = A(0, 0, .5, .3),
    t.v = A(.6, .3, .9),
    t.P = A(0, 0, .8, .5),
    t.Z = A(0, 0, 1, .5),
    t.S = .7,
    t.bb = M.cb,
    t.Db = .002,
    t.da = 1.2,
    t.Mc = 1,
    t.N = .4,
    t.ia = .3,
    t.W = .5,
    t.T = .8,
    t.H = .1,
    t.O = .6,
    t.C = 50,
    t.I = 100,
    t.wa = 15,
    (t = new oc(a++,[M.Na, M.$a, M.$b, M.ta, M.Bb, M.Pa, M.ha, M.ba],M.$b,M.Fb)).R = 3,
    t.ga = 2,
    t.M = 31,
    t.A = A(.7, 1, .7),
    t.B = A(.2, 1, .9),
    t.L = A(0, 0, .15),
    t.v = A(.1, .4, .5),
    t.P = A(0, 0, 1, .3),
    t.la = .1,
    t.ya = A(0, 1, .7),
    t.X = .1,
    t.da = .7,
    t.N = 1,
    t.ia = .2,
    t.W = .6,
    t.T = .9,
    t.H = .4,
    t.C = 40,
    t.I = 120,
    (t = new oc(a++,[M.Cb, M.dc, M.ba, M.ha],M.dc,M.fb)).M = 31,
    t.A = Bb,
    t.B = Ab,
    t.L = A(0, 0, .1),
    t.Z = A(.15, 1, .7),
    t.v = A(.05, .5, .4),
    t.P = A(.15, 1, .5, .5),
    t.sb = 23,
    t.X = .5,
    t.R = 1.5,
    t.uc = .3,
    t.S = .5,
    t.ya = A(.15, 1, .8),
    t.Fc = 1,
    t.J = 5,
    t.da = 2,
    t.N = .4,
    t.ia = .5,
    t.W = .75,
    t.H = .3,
    t.O = .6,
    t.C = 80,
    t.I = 200,
    (t = new oc(a++,[M.$a, M.pa, M.sc, M.Pa, M.ha],M.Qa,M.Hb)).ga = 2,
    t.M = 50,
    t.A = A(.5, 1, .5),
    t.B = A(0, 1, .8),
    t.L = A(.6, .3, .15),
    t.v = A(.2, .3, .5),
    t.Z = A(0, 0, 1, .5),
    t.X = 0,
    t.P = A(.15, 1, .9, .3),
    t.R = 4,
    t.S = 1.5,
    t.Zb = 1,
    t.N = .7,
    t.W = .7,
    t.T = .6,
    t.H = .5,
    t.O = .7,
    t.C = 60,
    t.I = 200,
    (t = new oc(a++,[M.qc, M.Ra, M.ab, M.gd, M.ba, M.ta],M.ba,M.Jb)).ga = 5,
    t.M = 25,
    t.A = A(0, 1, .8),
    t.B = A(.6, 1, .6),
    t.Z = A(0, 0, 0, 0),
    t.L = A(0, .6, .2, .8),
    t.v = A(.1, .5, .4),
    t.fc = 1,
    t.P = A(0, 1, .96, .8),
    t.vb = .6,
    t.S = .7,
    t.ya = A(.1, 1, .7),
    t.bb = M.ba,
    t.Db = .05,
    t.da = 0,
    t.wa = 20,
    t.N = 1,
    t.W = .25,
    t.T = 1,
    t.H = .2,
    t.O = .4,
    t.C = 10,
    t.I = 40,
    (t = new oc(a++,[M.Cb, M.kb, M.ac],M.Cc,M.Mb)).M = 50,
    t.A = A(.05, 1, .8),
    t.B = A(.15, 1, .7),
    t.Z = A(0, 1, .9),
    t.L = A(.6, 1, .1),
    t.v = A(.6, 1, .6),
    t.P = A(.9, 1, .5, .3),
    t.la = .2,
    t.ya = kb,
    t.J = 4,
    t.da = 1.5,
    t.N = .7,
    t.ia = .3,
    t.W = .75,
    t.T = 1,
    t.H = .4,
    t.O = .8,
    t.C = 30,
    t.I = 200,
    (t = new oc(a++,[M.pa, M.jb, M.ab, M.ta, M.Na],M.bc)).M = 21,
    t.A = A(.2, 1, .9),
    t.B = A(.55, 1, .5),
    t.L = A(0, 0, .1),
    t.v = A(.1, .5, .7),
    t.P = A(0, 0, 1, .5),
    t.Sa = M.pb,
    t.S = .6,
    t.Eb = M.gb,
    t.R = 1,
    t.J = 3,
    t.N = .8,
    t.W = .8,
    t.T = 1,
    t.H = .3,
    t.O = .8,
    t.C = 50,
    t.I = 80,
    (t = new oc(a++,[M.ab, M.Bb, M.pc, M.pa, M.Qa, M.ob],M.Qa)).ga = 1,
    t.v = A(.2, .3, .5),
    t.M = t.X = 0,
    t.C = 1e3,
    t.S = .6,
    t.Eb = M.gb,
    t.R = 1,
    ze(),
    Ve()
}
);
