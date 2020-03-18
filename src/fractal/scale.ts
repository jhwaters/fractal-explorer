import Big from 'big.js';


type IntervalTypes = [number, number] | [Big, Big];

class Interval {
  a: number
  b: number

  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }

  lo() { return this.a }
  hi() { return this.b }
  d() { return this.b - this.a }

  ratio(n: number): number;
  ratio(n: Big): Big;
  ratio(n: number | Big) {
    if (typeof n === 'number') {
      return (n - this.a) / this.d();
    } else {
      return n.sub(this.a).div(this.d());
    }
  }

  partition(r: number | Big): number | Big;
  partition(r: number): number;
  partition(r: Big): Big;
  partition(r: number | Big) {
    if (typeof r === 'number') {
      return this.d() * r + this.a;
    } else {
      return r.mul(this.d()).add(this.a);
    }
  }
}

class BigInterval {
  a: Big
  b: Big

  constructor(a: Big, b: Big) {
    this.a = a;
    this.b = b;
  }

  lo() { return this.a }
  hi() { return this.b }
  d() { return this.b.sub(this.a) }

  ratio(n: number | Big): Big;
  ratio(n: number): Big;
  ratio(n: Big): Big;
  ratio(n: number | Big): Big {
    if (typeof n === 'number') {
      return Big(n).sub(this.a).div(this.d());
    } else {
      return n.sub(this.a).div(this.d());
    }
  }

  partition(r: number | Big): Big;
  partition(r: number | Big): Big {
    return this.d().mul(r).add(this.a);
  }
}

function interval(a: IntervalTypes) {
  if (typeof a[0] === 'number') {
    return new Interval(a[0], a[1] as number);
  } else {
    return new BigInterval(a[0], a[1] as Big);
  }
}



export default class Scaler {
  _domain: Interval | BigInterval
  _range: Interval | BigInterval

  constructor(
    domain: IntervalTypes,
    range: IntervalTypes,
  ) {
    this._domain = interval(domain);
    this._range = interval(range);
  }

  domain(d: IntervalTypes) {
    this._domain = interval(d);
  }

  range(r: IntervalTypes) {
    this._range = interval(r);
  }

  scale() {
    const d = this._domain;
    const r = this._range;
    return (n: number) => {
      r.partition(d.ratio(n));
    }
  }

}
