// stats.js - http://github.com/mrdoob/stats.js
(function (f, e) { "object" === typeof exports && "undefined" !== typeof module ? module.exports = e() : "function" === typeof define && define.amd ? define(e) : f.Stats = e() })(this, function () {
    var f = function () {
        function e(a) { c.appendChild(a.dom); return a } function u(a) { for (var d = 0; d < c.children.length; d++)c.children[d].style.display = d === a ? "block" : "none"; l = a } var l = 0, c = document.createElement("div"); c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000"; c.addEventListener("click", function (a) {
            a.preventDefault();
            u(++l % c.children.length)
        }, !1); var k = (performance || Date).now(), g = k, a = 0, r = e(new f.Panel("FPS", "#0ff", "#002")), h = e(new f.Panel("MS", "#0f0", "#020")); if (self.performance && self.performance.memory) var t = e(new f.Panel("MB", "#f08", "#201")); u(0); return {
            REVISION: 16, dom: c, addPanel: e, showPanel: u, begin: function () { k = (performance || Date).now() }, end: function () {
                a++; var c = (performance || Date).now(); h.update(c - k, 200); if (c >= g + 1E3 && (r.update(1E3 * a / (c - g), 100), g = c, a = 0, t)) {
                    var d = performance.memory; t.update(d.usedJSHeapSize /
                        1048576, d.jsHeapSizeLimit / 1048576)
                } return c
            }, update: function () { k = this.end() }, domElement: c, setMode: u
        }
    }; f.Panel = function (e, f, l) {
        var c = Infinity, k = 0, g = Math.round, a = g(window.devicePixelRatio || 1), r = 80 * a, h = 48 * a, t = 3 * a, v = 2 * a, d = 3 * a, m = 15 * a, n = 74 * a, p = 30 * a, q = document.createElement("canvas"); q.width = r; q.height = h; q.style.cssText = "width:80px;height:48px"; var b = q.getContext("2d"); b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif"; b.textBaseline = "top"; b.fillStyle = l; b.fillRect(0, 0, r, h); b.fillStyle = f; b.fillText(e, t, v);
        b.fillRect(d, m, n, p); b.fillStyle = l; b.globalAlpha = .9; b.fillRect(d, m, n, p); return { dom: q, update: function (h, w) { c = Math.min(c, h); k = Math.max(k, h); b.fillStyle = l; b.globalAlpha = 1; b.fillRect(0, 0, r, m); b.fillStyle = f; b.fillText(g(h) + " " + e + " (" + g(c) + "-" + g(k) + ")", t, v); b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p); b.fillRect(d + n - a, m, a, p); b.fillStyle = l; b.globalAlpha = .9; b.fillRect(d + n - a, m, a, g((1 - h / w) * p)) } }
    }; return f
});

function requestFullScreen() {

    var el = document.documentElement;

    // Supports most browsers and their versions.
    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen
        || el.mozRequestFullScreen || el.msRequestFullScreen;

    if (requestMethod) {

        // Native full screen.
        requestMethod.call(el);

    } else if (typeof window.ActiveXObject !== "undefined") {

        // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");

        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

class SandBox {
    stats
    bitmap
    w = 0
    h = 0
    canvas = null
    context = null
    // size
    size = 1
    speed = 2
    // threshold
    threshold = 0.95
    // mousedown
    md = false
    // mouse
    m = { x: 0, y: 0 }
    // color
    hsla = 0.01
    // global x, y iteration
    gx = 0
    gy = 0
    gColorIndices

    constructor() {
        console.log('new SandBox()')
        try {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
            // canvas & context
            this.canvas = document.getElementById("canvas")
            this.context = canvas.getContext('2d')
            // canvas size
            this.canvas.width = Math.round(screen.width / 2)
            this.canvas.height = Math.round(screen.height / 2)
            // bitmap
            this.w = this.canvas.width
            this.h = this.canvas.height
            this.size = Math.round(this.w / 16)
            this.bitmap = new ImageData(this.w, this.h)
            for (let i = 0; i < this.bitmap.data.length; i += 4) {
                this.bitmap.data[i + 0] = 255;    // R value
                this.bitmap.data[i + 1] = 255;  // G value
                this.bitmap.data[i + 2] = 255;    // B value
                this.bitmap.data[i + 3] = 255;  // A value
            }
            // events desktop
            this.canvas.addEventListener('touchstart', (event) => {
                this.md = true
            })
            this.canvas.addEventListener('touchend', (event) => {
                this.md = false
            })
            this.canvas.addEventListener('touchmove', (event) => {
                this.m = this.oMousePosScaleCSS(event, true)
            })
            // events mobile
            this.canvas.addEventListener('mousedown', (event) => {
                this.md = true
            })
            this.canvas.addEventListener('mouseup', (event) => {
                this.md = false
            })
            this.canvas.addEventListener('mousemove', (event) => {
                this.m = this.oMousePosScaleCSS(event, false)
            })
            // animate
            window.requestAnimationFrame(this.draw.bind(this))
        } catch (error) {
            console.error(error)
        }
    }

    randBool() {
        return
    }

    draw() {
        this.stats.begin();
        // put sand
        if (this.md) {
            for (var y = this.m.y - this.size; y < this.m.y + this.size; y++) {
                for (var x = this.m.x - this.size; x < this.m.x + this.size; x++) {
                    if (y > 0 && y < this.h && x > 0 && x < this.w) {
                        if (Math.random() > this.threshold) {
                            this.putSand(x, y)
                        }
                    }
                }
            }
        }
        for (this.gy = this.h - 1; this.gy > 0; this.gy--) {
            for (this.gx = 0; this.gx < this.w; this.gx++) {
                this.gColorIndices = this.getColorIndicesForCoord(this.gx, this.gy, this.w)
                if (!this.isWhite(this.gColorIndices)) {
                    if (this.gy + this.speed < this.h) {
                        if (this.canBottomLeft() && this.canBottomRight()) {
                            if (Math.random() > 0.5) {
                                this.pathBottomRight()
                            } else {
                                this.pathBottomLeft()
                            }
                        }
                        else if (this.canBottomLeft()) {
                            this.pathBottomLeft()
                        }
                        else if (this.canBottomRight()) {
                            this.pathBottomRight()
                        }
                        else if (this.canBottom()) {
                            this.pathBottom()
                        }
                    }
                }
            }
        }
        this.context.putImageData(this.bitmap, 0, 0);
        this.stats.end();
        window.requestAnimationFrame(this.draw.bind(this))
    }

    canBottom() {
        return this.isWhite(this.getColorIndicesForCoord(this.gx, this.gy + this.speed, this.w))
    }

    canBottomLeft() {
        return this.isWhite(this.getColorIndicesForCoord(this.gx - this.speed, this.gy + this.speed, this.w))
    }

    canBottomRight() {
        return this.isWhite(this.getColorIndicesForCoord(this.gx + this.speed, this.gy + this.speed, this.w))
    }

    pathBottom() {
        this.setColor(this.getColorIndicesForCoord(this.gx, this.gy + this.speed, this.w))
        this.setWhite()
    }

    pathBottomLeft() {
        this.setColor(this.getColorIndicesForCoord(this.gx - this.speed, this.gy + this.speed, this.w))
        this.setWhite()
    }

    pathBottomRight() {
        this.setColor(this.getColorIndicesForCoord(this.gx + this.speed, this.gy + this.speed, this.w))
        this.setWhite()
    }

    isWhite(colorIndices) {
        return this.bitmap.data[colorIndices[0]] == 255 &&
            this.bitmap.data[colorIndices[1]] == 255 &&
            this.bitmap.data[colorIndices[2]] == 255
    }

    setWhite() {
        this.bitmap.data[this.gColorIndices[0]] = 255
        this.bitmap.data[this.gColorIndices[1]] = 255
        this.bitmap.data[this.gColorIndices[2]] = 255
    }

    setColor(newColorIndices) {
        this.bitmap.data[newColorIndices[0]] = this.bitmap.data[this.gColorIndices[0]]
        this.bitmap.data[newColorIndices[1]] = this.bitmap.data[this.gColorIndices[1]]
        this.bitmap.data[newColorIndices[2]] = this.bitmap.data[this.gColorIndices[2]]
    }

    putSand(x, y) {
        const colorIndices = this.getColorIndicesForCoord(x, y, this.w);
        if (this.isWhite(colorIndices)) {
            this.hsla += 0.0001 / this.size
            if (this.hsla > 1) {
                this.hsla = 0
            }
            const rgb = this.hslToRgb(this.hsla, 1, this.getRandomNumberBetween(0.4, 0.6))
            this.bitmap.data[colorIndices[0]] = rgb[0]
            this.bitmap.data[colorIndices[1]] = rgb[1]
            this.bitmap.data[colorIndices[2]] = rgb[2]
        }
    }

    /**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
    hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    getColorIndicesForCoord = (x, y, width) => {
        const red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    };

    // scale click event
    oMousePosScaleCSS(evt, touch) {
        let ClientRect = this.canvas.getBoundingClientRect(),
            scaleX = this.canvas.width / ClientRect.width,
            scaleY = this.canvas.height / ClientRect.height;
        if (touch)
            // mobile
            return {
                x: Math.round((evt.changedTouches[0].clientX - ClientRect.left) * scaleX),
                y: Math.round((evt.changedTouches[0].clientY - ClientRect.top) * scaleY)
            }
        else
            // desktop
            return {
                x: Math.round((evt.clientX - ClientRect.left) * scaleX),
                y: Math.round((evt.clientY - ClientRect.top) * scaleY)
            }
    }

    getRandomNumberBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// start
new SandBox()