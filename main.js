import p5 from "p5";
import brush from "./src/brush.js";
import { colorJitter, randInt } from "./src/helpers.js"
import "./style.css";

const config = {
  backgroundColor: [72, 102, 155], // RGB
  splotchColor: [72, 102, 155],
  rippleColor: [46, 64, 112],
  rippleDensity: 5000, // smaller number == more ripples
  splotchDensity: 40000
}

new p5((p5Instance) => {
  const p = p5Instance;

  p.setup = function setup() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(colorJitter(...config.backgroundColor, 10));
  };

  const ripplesTarget = (p.windowWidth * p.windowHeight) / config.rippleDensity;
  const splotchesTarget = (p.windowWidth * p.windowHeight) / config.splotchDensity;
  var splotches = 0;
  var ripples = 0;

  p.draw = function draw() {
    for (var i = 0; i < 5; i++) {
      if (splotches < splotchesTarget) {
        drawSplotch(p);
        splotches += 1;
      } else if (ripples < ripplesTarget) {
        drawRipple(p);
        ripples += 1;
      } else {
        // TODO: draw lillies
        //       - decide how many lillies to draw based on res
        //       - generate lines for each lily, put into an array
        //       - draw n random lines (drawing in order for each individual lily)
        //       - repeat until all lines drawn
      }
    }
  };

  p.mousePressed = function mousePressed() {
    console.log("click", p.mouseX, p.mouseY)
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
  brush(p, [p0, p1], colorJitter(...config.splotchColor, 10), randInt(150) + 50);
}

// draw a wavy blue line
function drawRipple(p) {
  const p0 = [randInt(p.width) - 50, randInt(p.height)];
  const p1 = [p0[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];
  const p2 = [p1[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];
  const p3 = [p2[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];

  brush(p, [p0, p1, p2, p3], colorJitter(...config.rippleColor, 10), 3);
}