
function* rangeGen(start: number, stop: number, frames: number, inclusive: boolean=true): Generator<number,void> {
  const d = stop - start;
  if (inclusive) {
    for (let i = 0; i < frames; i++) {
      yield start + d*(i / (frames-1))
    }
  } else {
    for (let i = 0; i < frames; i++) {
      yield start + d*(i / frames)
    }
  }
}


function promiseGenerator<T>(gen: Generator<T>, f: (x: T) => void, ms: number) {
  const x = gen.next();
  if (x.done) {
    return new Promise(resolve => resolve(x))
  } else {
    f(x.value)
    return new Promise(resolve => {
      setTimeout(() => resolve(promiseGenerator(gen, f, ms)), ms)
    })
  }
}



export function animator(start: number, stop: number, frames: number=10, inclusive: boolean=true) {
  return (f: (n: number) => void, ms: number=0) => {
    return promiseGenerator(rangeGen(start, stop, frames, inclusive), f, ms);
  }
}
