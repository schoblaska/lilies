import p5 from "p5";
import brush from "./src/brush.js";
import { colorJitter, randInt, shuffleArray } from "./src/helpers.js";
import "./style.css";

const config = {
  backgroundColor: [72, 102, 155], // RGB
  splotchColors: [
    [72, 102, 155],
    [72, 125, 155],
  ],
  rippleColor: [46, 64, 112],
  lillyColors: {
    pads: [
      [159, 204, 179],
      [196, 223, 155],
      [151, 206, 217],
      [168, 177, 220],
    ],
    flowers: [
      [200, 55, 61],
      [232, 221, 63],
      [234, 117, 55],
      [217, 228, 245],
    ],
    highlight: [217, 228, 245],
    shadow: [40, 50, 88],
  },
  rippleDensity: 5000, // smaller number == more ripples
  splotchDensity: 40000,
  flowerFactor: 3, // 1/flowerFactor pads will have flowers
};

new p5((p5Instance) => {
  const p = p5Instance;
  const instructions = p.createDiv("click to make a lilly grow");

  p.setup = function setup() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(colorJitter(...config.backgroundColor, 10));
    instructions.id("instructions");
  };

  const ripplesTarget = (p.windowWidth * p.windowHeight) / config.rippleDensity;
  const splotchesTarget =
    (p.windowWidth * p.windowHeight) / config.splotchDensity;
  var ripplesCount = 0;
  var splotchesCount = 0;
  var lillies = [];

  p.draw = function draw() {
    if (splotchesCount < splotchesTarget) {
      for (var i = 0; i < 5; i++) {
        drawSplotch(p);
        splotchesCount += 1;
      }
    } else if (ripplesCount < ripplesTarget) {
      for (var i = 0; i < 5; i++) {
        drawRipple(p);
        ripplesCount += 1;
      }
    } else {
      if (lillies.length === 0) {
        instructions.show();
      } else {
        instructions.hide();
        drawLillyLine(lillies, p);
      }
    }
  };

  p.mousePressed = function mousePressed() {
    addLilly(lillies, p.mouseX, p.mouseY);
  };
}, document.getElementById("app"));

// draw a splotch
function drawSplotch(p) {
  const p0 = [randInt(p.width), randInt(p.height)];
  const p1 = [
    p0[0] + randInt(p.width / 2) - 200,
    p0[1] + randInt(p.height / 2) - 200,
  ];
  const color = config.splotchColors[randInt(config.splotchColors.length)];

  // TODO: the lower the position of the splotch, the darker its
  // color is likely to be? (to create a rough 3d illusion)

  brush(p, [p0, p1], colorJitter(...color, 10), randInt(150) + 50);
}

// draw a wavy blue line
function drawRipple(p) {
  const p0 = [randInt(p.width) - 50, randInt(p.height)];
  const p1 = [p0[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];
  const p2 = [p1[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];
  const p3 = [p2[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];

  brush(p, [p0, p1, p2, p3], colorJitter(...config.rippleColor, 10), 3);
}

function addLilly(lillies, x, y) {
  // TODO: return early unless splotches and ripples have been drawn

  // TODO: Rather than random, choose color based on which quadrant (divide into
  // 3x3 grid or something) it's in. This will create grouped lillies of
  // similar (but still different, thanks to jitter) colors
  // or use same color as closest pad if within 100 pixels or something
  // or weight the randomness based on nearby pads (I like this idea best)
  // maybe simpler: 2/3 chance of having the same color as the most
  // commonly-used within 100px; 1/3 chance of random
  const padColor =
    config.lillyColors.pads[randInt(config.lillyColors.pads.length)];

  var lines = [];

  // shadow
  lines.push({
    color: colorJitter(...config.lillyColors.shadow, 20),
    points: spiral(x + 10, y + 10, 40, 3, 0),
  });

  // tiny spirals to fill the hole in the middle of the pad
  for (var i = 0; i <= 2; i++) {
    lines.push({
      color: colorJitter(...padColor, 20),
      points: spiral(x, y, 5, 5, i),
    });
  }

  // big spirals to define the shape of the pad
  for (var i = 0; i <= 4; i++) {
    lines.push({
      color: colorJitter(...padColor, 20),
      points: spiral(x, y, 40, 5, i),
    });
  }

  // highlight
  lines.push({
    color: colorJitter(...config.lillyColors.highlight, 20),
    points: spiral(x, y, 40, 4, 2),
  });

  // tighter spirals to fill it in
  for (var i = 0; i <= 4; i++) {
    lines.push({
      color: colorJitter(...padColor, 20),
      points: spiral(x, y, 20, 5, i),
    });
  }

  if (randInt(config.flowerFactor) == 0) {
    const flowerColor =
      config.lillyColors.flowers[randInt(config.lillyColors.flowers.length)];

    for (var i = 0; i <= 4; i++) {
      lines.push({
        color: colorJitter(...flowerColor, 20),
        points: [
          [x, y],
          [x - 10 + randInt(20), y - randInt(15)],
          [x - 20 + randInt(40), y - 15 - randInt(15)],
        ],
      });
    }
  }

  lillies.push({
    x,
    y,
    lines: lines,
    drawn: 0,
  });
}

function drawLillyLine(lillies, p) {
  let lilly = lillies.find((l) => l.lines.length > l.drawn);

  if (lilly) {
    const line = lilly.lines[lilly.drawn];
    brush(p, line.points, line.color, 5, 25);
    lilly.drawn += 1;
  }
}

function spiral(x, y, size = 50, n = 5, origin = 0) {
  const funcs = [
    (size) => [x - size - randInt(20), y - 10 + randInt(20)],
    (size) => [x - 10 + randInt(20), y + size / 4 + randInt(20)],
    (size) => [x + size + randInt(20), y - 10 + randInt(20)],
    (size) => [x - 10 + randInt(20), y - size / 4 - randInt(20)],
  ];

  var points = [];

  for (var i = 0; i < n; i++) {
    points.push(funcs[(i + origin) % 4](i === 0 ? size / 2 : size));
  }

  return points;
}
