import p5 from 'p5';
import { CurveInterpolator } from 'curve-interpolator';
import './style.css'

new p5(p5Instance => {
  const p = p5Instance;

  p.setup = function setup() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(colorJitter(72, 102, 155, 10))
  };

  let wavesTarget = p.windowWidth * p.windowHeight / 5000;
  let splotchesTarget = p.windowWidth * p.windowHeight / 30000;
  var splotches = 0;
  var waves = 0;

  console.log(p.windowWidth, p.windowHeight)

  p.draw = function draw() {
    for(var i = 0; i < 5; i++) {
      if (splotches < splotchesTarget) {
        drawSplotch(p)
        splotches += 1
      } else if (waves < wavesTarget) {
        drawWave(p)
        waves += 1
      }
    }
  };
}, document.getElementById('app'));


// draw a splotch
function drawSplotch(p) {
  let p0 = [randInt(p.width), randInt(p.height)]
  let p1 = [p0[0] + randInt(p.width / 2) - 200, p0[1] + randInt(p.height / 2) - 200]
  
  brush(p, [p0, p1], colorJitter(72, 102, 155, 10), randInt(150) + 50)
}

// draw a wavy blue line
function drawWave(p) {
  let p0 = [randInt(p.width - 50), randInt(p.height - 50)]
  let p1 = [p0[0] + randInt(50) + 25, p0[1] - randInt(40) + 20]
  let p2 = [p1[0] + randInt(50) + 25, p0[1] - randInt(40) + 20]
  let p3 = [p2[0] + randInt(50) + 25, p0[1] - randInt(40) + 20]

    
  brush(p, [p0, p1, p2, p3], colorJitter(46, 64, 112, 10), 5)
}

// adapted from this post by Ahmad Moussa (@gorillasu):
// https://gorillasun.de/blog/simulating-brush-strokes-with-hooke's-law-in-p5js-and-processing
// which was adapted from this post by @BUN_information:
// https://twitter.com/BUN_information/status/1195300719231791104
function brush(p, coords, color, brushSize = 10) {
  let spring = 0.3;
  let friction = 0.45;
  let v = 0.5;
  let r = 0;
  let vx = 0;
  let vy = 0;
  let splitNum = 100;
  let diff = brushSize / 2;

  const interp = new CurveInterpolator(coords, { tension: 0.2 });

  let points = interp.getPoints(10)
  var x = points[0][0];
  var y = points[0][1];

  points.forEach((pair) => {
    let mouseX = pair[0]
    let mouseY = pair[1]
    vx += (mouseX - x) * spring;
    vy += (mouseY - y) * spring;
    vx *= friction;
    vy *= friction;

    v += p.sqrt(vx * vx + vy * vy) - v;
    v *= 0.55;

    var oldR = r;
    r = brushSize - v;

    var num = p.random(0.1, 0.8);
    var num2 = p.random(0.1, 0.8);

    for (let i = 0; i < splitNum; ++i) {
      var oldX = x;
      var oldY = y;
      x += vx / splitNum;
      y += vy / splitNum;
      oldR += (r - oldR) / splitNum;
      if (oldR < 1) {
        oldR = 1;
      }
      p.stroke(color)
      p.strokeWeight(oldR + diff); // AMEND: oldR -> oldR+diff
      p.line(x + num, y + num, oldX + num, oldY + num);
      p.strokeWeight(oldR); // ADD
      p.line(
        x + diff * num2,
        y + diff * num2,
        oldX + diff * num2,
        oldY + diff * num2
      ); // ADD
      p.line(
        x - diff * num,
        y - diff * num,
        oldX - diff * num,
        oldY - diff * num
      ); // ADD
    }
  });
}

function colorJitter(r, g, b, jitter = 5) {
  return [
    clamp(0, r + randInt(2 * jitter) - jitter, 255),
    clamp(0, g + randInt(2 * jitter) - jitter, 255),
    clamp(0, b + randInt(2 * jitter) - jitter, 255),
  ];
}

// "clamp" a number between min and max, inclusive
function clamp(min, n, max) {
  return Math.min(max, Math.max(min, n))
}

// a random integer between 0 and n - 1, inclusive
function randInt(n) {
  return Math.floor(Math.random() * n)
}