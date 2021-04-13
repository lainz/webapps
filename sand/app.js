function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var md = false
var mx, my = 0
var canvas = document.getElementById("canvas")
canvas.addEventListener('mousedown', (event) => {
    //console.log(event)
    md = true
})
canvas.addEventListener('mouseup', (event) => {
    //console.log(event)
    md = false
})
canvas.addEventListener('mousemove', (event) => {
    //console.log(event)
    mx = event.clientX
    my = event.clientY
})
var context = canvas.getContext('2d')

class Sand {
    color = "black"

    constructor() {
        this.color = `hsla(58, 100%, ${getRandomInt(45,80)}%, 1)`
    }
}

class SandBox {
    sand = []
    w = canvas.width
    h = canvas.height
    constructor() {
        for (var i = 0; i < this.h; i++) {
            this.sand.push([])
        }
    }

    putSand(x, y) {
        if (!this.sand[y][x])
        this.sand[y][x] = new Sand()
    }
}

var sb = new SandBox()

function draw() {

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (md) {
        for (var y = my - 10; y < my + 10; y++) {
            for (var x = mx - 10; x < mx + 10; x++) {
                if (y > 0 && y < sb.h && x > 0 && x < sb.w) {
                    if (Math.random() > 0.95) {
                        sb.putSand(x, y)
                    }
                }
            }
        }
    }

    function canBottom(x, y) {
        !sb.sand[y + 1][x]
    }

    function pathBottom(x, y) {
        sb.sand[y + 1][x] = sb.sand[y][x]
        sb.sand[y][x] = null
    }

    function canBottomLeft(x, y) {
        return !sb.sand[y + 1][x - 1]
    }

    function pathBottomLeft(x, y) {
        sb.sand[y + 1][x - 1] = sb.sand[y][x]
        sb.sand[y][x] = null
    }

    function canBottomRight(x, y) {
        return !sb.sand[y + 1][x + 1]
    }

    function pathBottomRight(x, y) {
        sb.sand[y + 1][x + 1] = sb.sand[y][x]
        sb.sand[y][x] = null
    }

    function canLeft(x, y) {
        return x + 1 <= sb.w && !sb.sand[y + 1][x + 1]
    }

    function canRight(x, y) {
        return x - 1 >= 0 && !sb.sand[y + 1][x - 1]
    }

    function pathLeft(x, y) {
        sb.sand[y][x + 1] = sb.sand[y][x]
        sb.sand[y][x] = null
    }

    function pathRight(x, y) {
        sb.sand[y][x - 1] = sb.sand[y][x]
        sb.sand[y][x] = null
    }

    for (var y = sb.h - 1; y > 0; y--) {
        for (var x = 0; x < sb.w; x++) {
            if (sb.sand[y][x]) {
                context.fillStyle = sb.sand[y][x].color;
                context.fillRect(x, y, 1, 1);

                if (y + 1 < sb.h) {
                    if (canBottom(x, y)) {
                        pathBottom(x, y)
                    }
                    else if (canBottomLeft(x, y) && canBottomRight(x, y)) {
                        if (Math.random() > 0.5) {
                            pathBottomRight(x, y)
                        } else {
                            pathBottomLeft(x, y)
                        }
                    }
                    else if (canBottomLeft(x, y)) {
                        pathBottomLeft(x, y)
                    }
                    else if (canBottomRight(x, y)) {
                        pathBottomRight(x, y)
                    }
                    else if (canLeft(x, y) && canRight(x, y)) {
                        if (Math.random() > 0.5) {
                            pathRight(x, y)
                        } else {
                            pathLeft(x, y)
                        }
                    }
                    else if (canLeft(x, y)) {
                        pathLeft(x, y)
                    }
                    else if (canRight()) {
                        pathRight(x, y)
                    }
                }
            }
        }
    }

    window.requestAnimationFrame(draw)
}


window.requestAnimationFrame(draw)