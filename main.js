import p5 from "p5";
import brush from "./src/brush.js";
import { colorJitter, randInt } from "./src/helpers.js"
import "./style.css";

new p5((p5Instance) => {
  const p = p5Instance;

  p.setup = function setup() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(colorJitter(72, 102, 155, 10));
  };

  let ripplesTarget = (p.windowWidth * p.windowHeight) / 5000;
  let splotchesTarget = (p.windowWidth * p.windowHeight) / 40000;
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
      }
    }
  };
}, document.getElementById("app"));

// draw a splotch
function drawSplotch(p) {
  let p0 = [randInt(p.width), randInt(p.height)];
  let p1 = [
    p0[0] + randInt(p.width / 2) - 200,
    p0[1] + randInt(p.height / 2) - 200,
  ];

  // TODO: the lower the position of the splotch, the darker its
  // color is likely to be? (to create a rough 3d illusion)
  brush(p, [p0, p1], colorJitter(72, 102, 155, 10), randInt(150) + 50);
}

// draw a wavy blue line
function drawRipple(p) {
  let p0 = [randInt(p.width) - 50, randInt(p.height)];
  let p1 = [p0[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];
  let p2 = [p1[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];
  let p3 = [p2[0] + randInt(30) + 15, p0[1] - randInt(60) + 30];

  brush(p, [p0, p1, p2, p3], colorJitter(46, 64, 112, 10), 3);
}