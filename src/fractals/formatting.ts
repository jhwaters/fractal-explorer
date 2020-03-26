
type NumberOpts = {
  fixed?: number
  round?: number
  sign?: boolean
}

export function num(n: number, {
  sign,
  fixed=4
}: NumberOpts={}): string {
  if (sign && !(n < 0)) {
    return '+' + num(n, {fixed})
  }
  if (fixed) {
    return (+(n.toFixed(fixed))).toString()
  }
  return n.toString()
}



export function rounder(p: number) {
  const d = Math.pow(10, p);
  return (n: number) => Math.round(n * d) / d;
}



export function science(n: number, p: number=4) {
  const a = n.toPrecision(4);
  const b = a.split('e')
  if (b.length === 1) {
    return a;
  } else {
    return b[0] + '\\times 10^{' + b[1] + '}'
  }
}