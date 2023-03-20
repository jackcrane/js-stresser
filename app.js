import asciichart from "asciichart";
import cliProgress from "cli-progress";

Array.prototype.stanDeviate = function () {
  var i,
    j,
    total = 0,
    mean = 0,
    diffSqredArr = [];
  for (i = 0; i < this.length; i += 1) {
    total += this[i];
  }
  mean = total / this.length;
  for (j = 0; j < this.length; j += 1) {
    diffSqredArr.push(Math.pow(this[j] - mean, 2));
  }
  return Math.sqrt(
    diffSqredArr.reduce(function (firstEl, nextEl) {
      return firstEl + nextEl;
    }) / this.length
  );
};

const fibonacci = (n) => {
  if (n < 2) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
};

let scores = [];

const bar = new cliProgress.SingleBar(
  {
    format: "Progress |{bar}| {percentage}% || {value}/{total} Chunks",
  },
  cliProgress.Presets.shades_classic
);

const iterations = 100;
const depth = 30;
bar.start(iterations, 0);
for (let i = 0; i < iterations; i++) {
  const begin = performance.now();
  fibonacci(depth);
  const end = performance.now();
  const score = end - begin;
  scores.push(score);
  bar.update(i + 1);
}

bar.stop();

// If a score is over 2 standard deviations from the mean, update the score to be 2 standard deviations from the mean
const std_dev = scores.stanDeviate();
const average = scores.reduce((a, b) => a + b) / scores.length;
scores = scores.map((score) => {
  if (score > average + std_dev * 2) {
    return average + std_dev * 2;
  }
  return score;
});

console.log(asciichart.plot(scores, { height: 20 }));
console.log({
  average: scores.reduce((a, b) => a + b) / scores.length,
  min: Math.min(...scores),
  max: Math.max(...scores),
  std_dev: std_dev,
  outliers: std_dev !== scores.stanDeviate(),
});
