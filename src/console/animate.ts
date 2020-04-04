import * as store from './store';
import { repeat } from './util';


function rect(a: number, r: number) {
  return [r*Math.cos(a), r*Math.sin(a)];
}

export function animate({domain, step, map, delay=100}: {
  domain: [number,number],
  step: number,
  map: (n: number) => any,
  delay?: number
}) {
  let x = domain[0];
  const s = domain[1] > domain[0] ? Math.abs(step) : -Math.abs(step);
  const condition = s > 0 ? () => x <= domain[1] : () => x >= domain[1];
  repeat(() => {
    store.params(map(x))
    x += s;
  }, condition, delay)
}

export function rotate(k: string='c', {range=[0,360],step=5,delay=100}:{range?: [number,number], step?: number, delay?: number}={}) {
  const current = store.getParam(k);
  const [x, y] = current;
  const a0 = Math.atan2(y, x);
  const radius = Math.sqrt(x*x + y*y);
  animate({
    domain: range,
    step: step,
    delay: delay,
    map: (i: number) => {
      const angle = a0 + i*Math.PI/180;
      return {[k]: rect(angle, radius)}
    }
  })
}