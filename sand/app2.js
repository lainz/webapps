"use strict"

class SandBox {
    bitmap = []
    w = 0
    h = 0
    canvas = null
    contest = null
    scaleX = 1
    scaleY = 1
    // size
    size = 5
    // threshold
    threshold = 0.95
    // mousedown
    md = false
    // mouse
    m = { x: 0, y: 0 }
    // color
    hsla = 58
    // global x, y iteration
    gx = 0
    gy = 0

    constructor() {
        console.log('new SandBox()')
        try {
            // canvas & context
            this.canvas = document.getElementById("canvas")
            this.context = canvas.getContext('2d')
            // canvas size
            if (screen.width > screen.height) {
                this.canvas.width = 150
                this.canvas.height = 85
            } else {
                this.canvas.width = 85
                this.canvas.height = 150
            }
            // bitmap
            this.w = this.canvas.width
            this.h = this.canvas.height
            for (var y = 0; y < this.h; y++) {
                this.bitmap.push([])
                for (var x = 0; x < this.w; x++) {
                    this.bitmap[y].push("white")
                }
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

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
                if (this.bitmap[this.gy][this.gx] != "white") {
                    // set color
                    this.context.fillStyle = this.bitmap[this.gy][this.gx];
                    // draw pixel
                    this.context.fillRect(this.gx, this.gy, 1, 1);

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
        window.requestAnimationFrame(this.draw.bind(this))
    }

    canBottom() {
        return this.bitmap[this.gy + 1][this.gx] == "white"
    }

    canBottomLeft() {
        return this.bitmap[this.gy + 1][this.gx - 1] == "white"
    }

    canBottomRight() {
        return this.bitmap[this.gy + 1][this.gx + 1] == "white"
    }

    pathBottom() {
        this.bitmap[this.gy + 1][this.gx] = this.bitmap[this.gy][this.gx]
        this.bitmap[this.gy][this.gx] = "white"
    }

    pathBottomLeft() {
        this.bitmap[this.gy + 1][this.gx - 1] = this.bitmap[this.gy][this.gx]
        this.bitmap[this.gy][this.gx] = "white"
    }

    pathBottomRight() {
        this.bitmap[this.gy + 1][this.gx + 1] = this.bitmap[this.gy][this.gx]
        this.bitmap[this.gy][this.gx] = "white"
    }

    putSand(x, y) {
        if (this.bitmap[y][x] == "white") {
            this.hsla += 0.05
            this.bitmap[y][x] = `hsla(${this.hsla}, 100%, ${this.getRandomInt(45, 65)}%, 1)`
        }
    }

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

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// start
new SandBox()