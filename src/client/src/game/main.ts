let canvas: HTMLCanvasElement;

export function init(pCanvas: HTMLCanvasElement) {
  canvas = pCanvas;
  canvas.style.backgroundColor = "black";
}

function update() {}

function render() {}

export function run() {
  update();
  render();
  window.requestAnimationFrame(run);
}
