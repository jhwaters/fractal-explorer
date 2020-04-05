
export function magic(drawer, {
  volatility=0.4,
  frames=30, 
  rounds=3,
  ms=0,
  param='c',
}={}) {
  const c0 = drawer.getParam(param);
  if (c0 && Array.isArray(c0)) {
    const [x0, y0] = c0;
    
    let x = x0, y = y0;
    drawer.setParam('c', [x, y])
    const rand = () => volatility*(0.5-Math.random())
    const randC = () => {
      [x, y] = [x + rand(), x + rand()];
      return [x, y];
    }
  
    let i = 0;
    const rotator = () => {    
      i++
      if (i <= rounds) {
        console.log('round', i);
        const angle = ((Math.random() * Math.PI) + Math.PI)/2;
        return drawer.rotateParam('c', {frames, center: randC(), angle, incl: false, ms}).then(rotator);
      } else {
        console.log('returning')
        const [x1, y1] = drawer.getParam('c');
        const xmid = (x0 + x1)/2;
        const ymid = (y0 + y1)/2;
        return drawer.rotateParam('c', {frames, center: [xmid, ymid], angle: Math.PI, ms})
      }
    };
  
    return rotator();
  } else {
    console.error('magic failed - does the fractal have a complex parameter "' + param + '"?')
  }
}