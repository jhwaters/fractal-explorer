import React from 'react';
import styles from './components.module.css';


function makegrid({max, stepX, stepY, stepRadius, stepAngle, angles}: {
  max: number,
  stepX: number,
  stepY: number,
  stepAngle: number,
  stepRadius: number,
  angles?: number[],
}) {
  const max_radius = max * 1.5;

  function circle(cx: number, cy: number, r: number) {
    return (
      'M' + cx+r + ',' + cy + 
      'A' + r + ',' + r + ',0,1,0,' + cx + ',' + cy + r +
      'A' + r + ',' + r + ',0,0,0,' + cx + r + ',' + cy
    )
  }

  function hline(v: number) {
    return 'M' + (-max) + ',' + v + 'H' + max;
  }

  function vline(v: number) {
    return 'M' + v + ',' + (-max) + 'V' + max;
  }
  
  let rect_minor = ''
  let i = 0;
  while (i <= max) {
    rect_minor += vline(i) + vline(-i);
    i += stepX;
  }

  i = 0;
  while (i <= max) {
    rect_minor += hline(i) + hline(-i);
    i += stepY;
  }
  
  let polar_minor = '';
  
  if (angles) {
    angles.forEach(a => {
      const rad = a * Math.PI / 180;
      polar_minor += 'M0,0L' + max_radius * Math.cos(rad) + ',' + max_radius * Math.sin(rad);
    })
  } else {
    i = 0;
    while (i < 360) {
      const rad = i * Math.PI / 180;
      polar_minor += 'M0,0L' + max_radius * Math.cos(rad) + ',' + max_radius * Math.sin(rad);
      i += stepAngle;
    }
  }

  i = stepRadius;
  while (i <= max_radius) {
    polar_minor += circle(0, 0, i);
    i += stepRadius;
  }

  return {
    RECT: {MINOR: rect_minor, MAJOR: hline(0) + vline(0)},
    POLAR: {MINOR: polar_minor, MAJOR: circle(0, 0, 1)},
  }
  
}

type Props = {
  value: {x: number, y: number},
  max: number,
  onClick?: (x: number, y: number) => void,
  onDoubleClick?: (x: number, y: number) => any,
  size: number,
  precision: number,
  stepRect: number,
  stepRadius: number,
  stepAngle: number,
  angles?: number[],
  style?: React.CSSProperties,

  markerColor: string,
  gridColor?: string,
  textColor?: string,
}



class ComplexNumberInput extends React.Component<Props> {
  ref: React.RefObject<SVGSVGElement>
  GRID: {
    RECT?: {MAJOR?: string, MINOR?: string},
    POLAR?: {MAJOR?: string, MINOR?: string},
  }
  round: (n: number) => number

  static defaultProps = {
    size: 100,
    precision: 3,
    stepAngle: 30,
    stepRadius: 0.2,
    stepRect: 0.2,

    markerColor: 'blue',
    //gridColor: 'black',
  }

  constructor(props: React.PropsWithChildren<Props>) {
    super(props);
    this.ref = React.createRef();
    const r = Math.pow(10, props.precision);
    this.round = (n: number) => Math.round(n*r) / r;
    const {max, stepRadius, stepRect, stepAngle, angles} = this.props;
    this.GRID = makegrid({max, stepRadius, stepAngle, angles, stepX: stepRect, stepY: stepRect});
  }

  getValueAtClick(evt: any): [number, number] | undefined {
    const svg = this.ref.current;
    if (svg) {
      const rect = svg.getBoundingClientRect();
      const {x, y} = rect;
      const {clientX, clientY} = evt.nativeEvent;
      const clickX = ((clientX - x) / this.props.size - 0.5) * 2*this.props.max;
      const clickY = -((clientY - y) / this.props.size - 0.5) * 2*this.props.max;
      return [this.round(clickX), this.round(clickY)];
    }
  }

  onClick = (evt: any) => {
    if (this.props.onClick) {
      const p = this.getValueAtClick(evt);
      if (p) this.props.onClick(...p);
    }
  }

  onDoubleClick = (evt: any) => {
    if (this.props.onDoubleClick) {
      const p = this.getValueAtClick(evt);
      if (p) this.props.onDoubleClick(...p);
    }
  }

  polarGrid() {
    if (this.GRID.POLAR) {
      return (
        <>
        {this.GRID.POLAR.MINOR ? (
          <path d={this.GRID.POLAR.MINOR} 
            className={styles.Minor} 
            vectorEffect="non-scaling-stroke"/>
        ) : null}
        {this.GRID.POLAR.MAJOR ? (
          <path d={this.GRID.POLAR.MAJOR} 
            className={styles.Major} 
            vectorEffect="non-scaling-stroke"/>
        ) : null}
        </>
      )
    }
    return null;
  }

  rectGrid() {
    if (this.GRID.RECT) {
      return (
        <>
        {this.GRID.RECT.MINOR ? (
          <path d={this.GRID.RECT.MINOR} 
            className={styles.Minor} 
            vectorEffect="non-scaling-stroke"/>
        ) : null}
        {this.GRID.RECT.MAJOR ? (
          <path d={this.GRID.RECT.MAJOR} 
            className={styles.Major} 
            vectorEffect="non-scaling-stroke"/>
        ) : null}
        </>
      )
    }
    return null;
  }
  
  render() {
    const markerRadius = this.props.max / 30;
    const viewBox = [-this.props.max, -this.props.max, 2*this.props.max, 2*this.props.max]
    return (
      <svg 
        ref={this.ref}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        viewBox={viewBox.join(' ')}
        className={styles.ComplexNumberInput}
        style={{...this.props.style, width: this.props.size, height: this.props.size}}
      >
        <g className={styles.Grid}
          style={{stroke: this.props.gridColor}}
        >
          {this.rectGrid()}
          {this.polarGrid()}
        </g>
        <circle 
          cx={this.props.value.x}
          cy={-this.props.value.y}
          r={markerRadius} 
          className={styles.Marker}
          style={{
            stroke: this.props.markerColor,
            fill: this.props.markerColor,
          }}
        />
      </svg>
    )
  }
}

export default ComplexNumberInput