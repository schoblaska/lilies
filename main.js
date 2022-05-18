import p5 from "p5";
import brush from "./src/brush.js";
import { colorJitter, randInt } from "./src/helpers.js";
import "./style.css";

const config = {
  backgroundColor: [72, 102, 155], // RGB
  splotchColor: [72, 102, 155],
  rippleColor: [46, 64, 112],
  lillyColors: {
    pads: [
      [159, 204, 179],
      [196, 223, 155],
      [151, 206, 217],
      [168, 177, 220],
    ],
    highlight: [217, 228, 245],
    shadow: [40, 50, 88],
  },
  rippleDensity: 5000, // smaller number == more ripples
  splotchDensity: 40000,
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

  // TODO: the lower the position of the splotch, the darker its
  // color is likely to be? (to create a rough 3d illusion)
  brush(
    p,
    [p0, p1],
    colorJitter(...config.splotchColor, 10),
    randInt(150) + 50
  );
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
  const padColor =
    config.lillyColors.pads[randInt(config.lillyColors.pads.length)];

  lillies.push({
    x,
    y,
    lines: [
      {
        color: padColor,
        points: [
          [x - 50, y],
          [x, y + 25],
          [x + 50, y - 20],
        ],
      },
      {
        color: padColor,
        points: [
          [x - 50, y],
          [x, y - 25],
          [x + 50, y + 20],
        ],
      },
      {
        color: padColor,
        points: [
          [x - 50, y],
          [x, y],
          [x + 50, y],
        ],
      },
    ],
    drawn: 0,
  });
}

function drawLillyLine(lillies, p) {
  let lilly = lillies.find((l) => l.lines.length > l.drawn);

  if (lilly) {
    const line = lilly.lines[lilly.drawn];
    brush(p, line.points, colorJitter(...line.color, 20), 5);
    lilly.drawn += 1;
  }
}
