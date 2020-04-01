import React from 'react';
import { ControlComplex } from '../fractals/algorithm/types'
import DownUpButtons, { DownUpButtonsProps } from './DownUpButtons';
import {
  complex,
  fromPolar,
  toPolar,
} from '../fractals/math/complex';
import { Polar } from '../fractals/math/types';
import { Icon } from '.';
import * as fmt from '../fractals/formatting';

//const round = (n: number) => Math.round(n * 100000) / 100000

type Vec = [number, number]

interface NewProps {
  controlProps: ControlComplex
  value: Vec
  onChange: (x: Vec) => void
}

interface Props extends NewProps, Omit<DownUpButtonsProps,'onChange'> {}

class ComplexIncrementer extends React.Component<Props> {

  setValue(v: Vec) {
    this.props.onChange(v)
  }

  toPolar() {
    return toPolar(complex(this.props.value[0], this.props.value[1]))
  }

  fromPolar(v: Polar): Vec {
    const a = fromPolar(v);
    return [a.re, a.im];
  }

  radiusDown(): Vec {
    const {stepRadius} = this.props.controlProps;
    const p = this.toPolar();
    return this.fromPolar({...p, radius: p.radius-stepRadius})
  }

  radiusUp(): Vec {
    const {stepRadius} = this.props.controlProps;
    const p = this.toPolar();
    return this.fromPolar({...p, radius: p.radius+stepRadius})
  }

  angleDown(): Vec {
    const {stepAngle} = this.props.controlProps;
    const p = this.toPolar();
    return this.fromPolar({...p, angle: p.angle-stepAngle})
  }

  angleUp(): Vec {
    const {stepAngle} = this.props.controlProps;
    const p = this.toPolar();
    return this.fromPolar({...p, angle: p.angle+stepAngle})
  }


  onAngleDown = () => {
    this.setValue(this.angleDown())
  }

  onAngleUp = () => {
    this.setValue(this.angleUp())
  }

  onRadiusDown = () => {
    this.setValue(this.radiusDown())
  }

  onRadiusUp = () => {
    this.setValue(this.radiusUp())
  }


  render() {
    const {controlProps, onChange, ...rest} = this.props;
    const pol = this.toPolar();
    return (
      <>
      <DownUpButtons
        {...rest}
        //label={controlProps.label + ': θ'}
        value={fmt.num(pol.angle)}
        label={controlProps.label + ': angle'}
        onDown={this.onAngleDown}
        onUp={this.onAngleUp}
        downIcon={Icon.RotateRight}
        upIcon={Icon.RotateLeft}
      />
      <DownUpButtons
        {...rest}
        value={fmt.num(pol.radius)}
        label={controlProps.label + ': radius'}
        onDown={this.onRadiusDown}
        onUp={this.onRadiusUp}
      />
      </>
    )
  }
}

export default ComplexIncrementer
