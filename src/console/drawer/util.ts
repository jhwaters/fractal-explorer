
export function* rangeGen(start: number, stop: number): Generator<number> {
  const d = Math.abs(stop - start)
  if (start < stop) {
    for (let i = 0; i <= d; i++) {
      yield start + i
    }
  } else {
    for (let i = 0; i <= d; i++) {
      yield stop - i
    }
  }
}

export function promiseGenerator<T>(gen: Generator<T>, f: (x: T) => void, ms: number) {
  const x = gen.next();
  if (x.done) {
    return new Promise(resolve => { resolve() })
  } else {
    f(x.value)
    return new Promise(resolve => {
      setTimeout(() => resolve(promiseGenerator(gen, f, ms)), ms)
    })
  }
}

export function promiseRangeGen(start: number, stop: number) {
  return (f: (n: number) => void, ms: number=0) => {
    return promiseGenerator(rangeGen(start, stop), f, ms);
  }
}
