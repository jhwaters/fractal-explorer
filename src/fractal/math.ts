
export type Complex = {re: number, im: number}

function complex(re: number | Complex, im?: number): Complex {
  if (typeof re === 'number') return {re, im: im || 0};
  else return re;
}

function fromPolar(angle: number, radius: number) {
  return {
    re: radius * Math.cos(angle),
    im: radius * Math.sin(angle),
  }
}

function add(a: Complex, b: Complex | number): Complex {
  if (typeof b === 'number') {
    return {re: a.re + b, im: a.im}
  } else {
    return {re: a.re + b.re, im: a.im + b.im}
  }
}

function neg(a: Complex): Complex {
  return {re: -a.re, im: -a.im}
}

function subtract(a: Complex, b: Complex | number): Complex {
  if (typeof b === 'number') {
    return {re: a.re - b, im: a.im}
  } else {
    return {re: a.re - b.re, im: a.im - b.im}
  }
}

function abs2(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

function abs(z: Complex): number {
  return Math.sqrt(abs2(z));
}

function angle(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

function multiply(a: Complex, b: Complex | number): Complex {
  if (typeof b === 'number') {
    return {
      re: a.re * b, 
      im: a.im * b,
    }
  } else {
    return {
      re: a.re*b.re - a.im*b.im,
      im: a.re*b.im + a.im*b.re,
    }
  }
}

function divide(a: Complex, b: Complex | number): Complex {
  if (typeof b === 'number') {
    return {
      re: a.re / b,
      im: a.im / b,
    }
  } else {
    const d = abs2(b);
    return {
      re: (a.re * b.re + a.im * b.im) / d,
      im: (a.im * b.re - a.re * b.im) / d,
    }
  }
}

function exp(z: Complex): Complex {
  const r = Math.exp(z.re)
  return {
    re: r * Math.cos(z.im),
    im: r * Math.sin(z.im),
  }
}

function pow(a: Complex, b: number): Complex {
  if (b === 0) return complex(1, 0)
  if (b === 1) return a
  if (b === 2) return multiply(a, a)
  if (b === 3) return multiply(multiply(a, a), a)
  const r2 = abs2(a);
  const ang = angle(a);
  return fromPolar(ang * b, Math.pow(r2, b/2))
}

function sinh(z: Complex): Complex {
  const a = subtract(exp(z), exp(neg(z)))
  return {
    re: a.re/2,
    im: a.im/2,
  }
}

function sqrt(z: Complex): Complex {
  const angle = Math.atan2(z.im, z.re);
  return fromPolar(
    angle / 2,
    Math.sqrt(abs(z))
  )
}

function polynomial(c: {[k: number]: number} | number[]): (z: Complex) => Complex;
function polynomial(c: {[k: number]: number} | number[], z: Complex): Complex;
function polynomial(coefficients: {[k: number]: number} | number[], z?: Complex) {
  if (z) {
    const r2 = abs2(z);
    const an = angle(z);
    let result = complex(0, 0);
    for (const k in coefficients) {
      result = add(result, fromPolar(+k * an, Math.pow(r2, coefficients[k]/2)))
    }
    return result;
  } else {
    const coeffs: {[key: number]: number} = {};
    for (const k in coefficients) {
      coeffs[k] = coefficients[k]/2;
    }
    return (z: Complex) => {
      const r2 = abs2(z);
      const an = angle(z);
      let result = complex(0, 0);
      for (const k in coeffs) {
        result = add(result, fromPolar(+k * an, Math.pow(r2, coeffs[k])))
      }
      return result;
    }
    
  }
}

export {
  add,
  abs,
  abs2,
  angle,
  complex,
  exp,
  divide,
  multiply,
  neg,
  polynomial,
  pow,
  sinh,
  sqrt,
  subtract,
}