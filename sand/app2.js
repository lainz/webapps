"use strict"

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
    bitmap
    w = 0
    h = 0
    canvas = null
    contest = null
    scaleX = 1
    scaleY = 1
    // size
    size = 1
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
            // canvas & context
            this.canvas = document.getElementById("canvas")
            this.context = canvas.getContext('2d')
            // canvas size
            this.canvas.width = Math.round(screen.width / 2)
            this.canvas.height = Math.round(screen.height / 2)
            // bitmap
            this.w = this.canvas.width
            this.h = this.canvas.height
            this.size = Math.round(screen.width / 32)
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
                    if (this.gy + 1 < this.h) {
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
        window.requestAnimationFrame(this.draw.bind(this))
    }

    canBottom() {
        return this.isWhite(this.getColorIndicesForCoord(this.gx, this.gy + 1, this.w))
    }

    canBottomLeft() {
        return this.isWhite(this.getColorIndicesForCoord(this.gx - 1, this.gy + 1, this.w))
    }

    canBottomRight() {
        return this.isWhite(this.getColorIndicesForCoord(this.gx + 1, this.gy + 1, this.w))
    }

    pathBottom() {
        this.setColor(this.getColorIndicesForCoord(this.gx, this.gy + 1, this.w))
        this.setWhite()
    }

    pathBottomLeft() {
        this.setColor(this.getColorIndicesForCoord(this.gx - 1, this.gy + 1, this.w))
        this.setWhite()
    }

    pathBottomRight() {
        this.setColor(this.getColorIndicesForCoord(this.gx + 1, this.gy + 1, this.w))
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
            this.hsla += 0.00001
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