
function repeatNTimes(f: () => void, n: number, timeout: number=50) {
  if (n > 0) {
    f();
    setTimeout(() => repeat(f, n-1, timeout), timeout)
  }
}

function repeatUntilFalse(f: () => void, condition: () => boolean, timeout: number=50) {
  if (condition()) {
    f();
    setTimeout(() => repeatUntilFalse(f, condition, timeout), timeout)
  }
}

export const repeat = (f: () => void, cond: number | (() => boolean), timeout?: number) => {
  if (typeof cond === 'number') {
    repeatNTimes(f, cond, timeout);
  } else {
    repeatUntilFalse(f, cond, timeout);
  }
}
