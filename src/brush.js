import { CurveInterpolator } from 'curve-interpolator';

// adapted from this post by Ahmad Moussa (@gorillasu):
// https://gorillasun.de/blog/simulating-brush-strokes-with-hooke's-law-in-p5js-and-processing
// which was adapted from this post by @BUN_information:
// https://twitter.com/BUN_information/status/1195300719231791104

export default function brush(p, coords, color, brushSize = 10) {
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
      p.strokeWeight(oldR + diff); // ADD
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