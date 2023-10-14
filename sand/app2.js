class SandBox {
    constructor() {
        this.w = 0;
        this.h = 0;
        this.canvas = null;
        this.context = null;
        this.size = 1;
        this.speed = 2;
        this.threshold = 0.95;
        this.md = false;
        this.m = { x: 0, y: 0 };
        this.hsla = 0.01;
        this.gx = 0;
        this.gy = 0;

        this.getColorIndicesForCoord = function (x, y, width) {
            const red = y * (width * 4) + x * 4;
            return [red, red + 1, red + 2, red + 3];
        };

        console.log('new SandBox()');
        try {
            this.canvas = document.getElementById("canvas");
            this.context = this.canvas.getContext('2d');
            this.canvas.width = Math.round(screen.width / 2);
            this.canvas.height = Math.round(screen.height / 2);
            this.w = this.canvas.width;
            this.h = this.canvas.height;
            this.size = Math.round(this.w / 16);
            this.bitmap = new ImageData(this.w, this.h);
            this.initializeBitmap();

            this.addEventListeners();
            this.animate();
        } catch (error) {
            console.error(error);
        }
    }

    initializeBitmap() {
        const data = this.bitmap.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255; // R value
            data[i + 1] = 255; // G value
            data[i + 2] = 255; // B value
            data[i + 3] = 255; // A value
        }
    }

    addEventListeners() {
        const handleTouchStart = () => { this.md = true; };
        const handleTouchEnd = () => { this.md = false; };
        const handleTouchMove = (event) => {
            this.m = this.getMousePos(event, true);
        };

        this.canvas.addEventListener('touchstart', handleTouchStart);
        this.canvas.addEventListener('touchend', handleTouchEnd);
        this.canvas.addEventListener('touchmove', handleTouchMove);

        this.canvas.addEventListener('mousedown', handleTouchStart);
        this.canvas.addEventListener('mouseup', handleTouchEnd);
        this.canvas.addEventListener('mousemove', (event) => {
            this.m = this.getMousePos(event, false);
        });
    }

    animate() {
        if (this.md) {
            this.addSand();
        }

        for (this.gy = this.h - 1; this.gy > 0; this.gy--) {
            for (this.gx = 0; this.gx < this.w; this.gx++) {
                this.gColorIndices = this.getColorIndicesForCoord(this.gx, this.gy, this.w);
                if (!this.isWhite(this.gColorIndices)) {
                    this.moveSand();
                }
            }
        }

        this.context.putImageData(this.bitmap, 0, 0);
        window.requestAnimationFrame(() => this.animate());
    }

    getMousePos(event, touch) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const clientX = touch ? event.changedTouches[0].clientX : event.clientX;
        const clientY = touch ? event.changedTouches[0].clientY : event.clientY;
        return {
            x: Math.round((clientX - rect.left) * scaleX),
            y: Math.round((clientY - rect.top) * scaleY)
        };
    }

    getRandomNumberBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    addSand() {
        for (let y = this.m.y - this.size; y < this.m.y + this.size; y++) {
            for (let x = this.m.x - this.size; x < this.m.x + this.size; x++) {
                if (y > 0 && y < this.h && x > 0 && x < this.w && Math.random() > this.threshold) {
                    const colorIndices = this.getColorIndicesForCoord(x, y, this.w);
                    if (this.isWhite(colorIndices)) {
                        this.placeSand(x, y, colorIndices);
                    }
                }
            }
        }
    }

    isWhite(colorIndices) {
        const data = this.bitmap.data;
        return data[colorIndices[0]] === 255 && data[colorIndices[1]] === 255 && data[colorIndices[2]] === 255;
    }

    placeSand(x, y, colorIndices) {
        this.hsla += 0.0001 / this.size;
        if (this.hsla > 1) {
            this.hsla = 0;
        }
        const rgb = this.hslToRgb(this.hsla, 1, this.getRandomNumberBetween(0.4, 0.6));
        const data = this.bitmap.data;
        data[colorIndices[0]] = rgb[0];
        data[colorIndices[1]] = rgb[1];
        data[colorIndices[2]] = rgb[2];
    }

    moveSand() {
        const data = this.bitmap.data;
        const gx = this.gx;
        const gy = this.gy;
        const speed = this.speed;
        const w = this.w;
        const colorIndices = this.gColorIndices;

        if (gy + speed < this.h) {
            const canMoveLeft = this.isWhite(this.getColorIndicesForCoord(gx - speed, gy + speed, w));
            const canMoveRight = this.isWhite(this.getColorIndicesForCoord(gx + speed, gy + speed, w));

            if (canMoveLeft && canMoveRight) {
                if (Math.random() > 0.5) {
                    this.moveBottomRight(colorIndices);
                } else {
                    this.moveBottomLeft(colorIndices);
                }
            } else if (canMoveLeft) {
                this.moveBottomLeft(colorIndices);
            } else if (canMoveRight) {
                this.moveBottomRight(colorIndices);
            } else if (this.isWhite(this.getColorIndicesForCoord(gx, gy + speed, w))) {
                this.moveBottom(colorIndices);
            }
        }
    }

    moveBottom(colorIndices) {
        this.setColor(colorIndices);
        this.setWhite();
    }

    moveBottomLeft(colorIndices) {
        const newColorIndices = this.getColorIndicesForCoord(this.gx - this.speed, this.gy + this.speed, this.w);
        this.setColor(newColorIndices);
        this.setWhite();
    }

    moveBottomRight(colorIndices) {
        const newColorIndices = this.getColorIndicesForCoord(this.gx + this.speed, this.gy + this.speed, this.w);
        this.setColor(newColorIndices);
        this.setWhite();
    }

    setColor(newColorIndices) {
        const data = this.bitmap.data;
        const oldColorIndices = this.gColorIndices;
        data[newColorIndices[0]] = data[oldColorIndices[0]];
        data[newColorIndices[1]] = data[oldColorIndices[1]];
        data[newColorIndices[2]] = data[oldColorIndices[2]];
    }

    setWhite() {
        const data = this.bitmap.data;
        data[this.gColorIndices[0]] = 255;
        data[this.gColorIndices[1]] = 255;
        data[this.gColorIndices[2]] = 255;
    }

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
}

new SandBox();