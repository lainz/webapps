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

var zoom = 1;
var color = 0;

function setup() {
  // put setup code here
  createCanvas(640, 400, WEBGL);
  
  noStroke();
}

function draw() {
  background(0)
  color = 0;
  translate(-width / 2, 0)
  circles(width * zoom)
  zoom *= 1.015;
  if (zoom > 2) { zoom = 1 }
}

function circles(w) {
  if (w > 15) {
    color += 10;
    fill(color);
    ellipse(w / 2, 0, w, w)
    circles(w / 2)
    push()
    translate(w, 0)
    ellipse(w / 2, 0, w, w)
    circles(w / 2)
    pop()
  }
}