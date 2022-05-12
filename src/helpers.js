export function colorJitter(r, g, b, jitter = 5) {
  return [
    clamp(0, r + randInt(2 * jitter) - jitter, 255),
    clamp(0, g + randInt(2 * jitter) - jitter, 255),
    clamp(0, b + randInt(2 * jitter) - jitter, 255),
  ];
}

// "clamp" a number between min and max, inclusive
export function clamp(min, n, max) {
  return Math.min(max, Math.max(min, n));
}

// a random integer between 0 and n - 1, inclusive
export function randInt(n) {
  return Math.floor(Math.random() * n);
}