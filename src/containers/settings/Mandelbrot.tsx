import React from 'react';
import { MandelbrotParams } from '../../store/algorithm/types';
import {
  Box,
  NumberInput,
} from '../../components';


interface Props {
  value: MandelbrotParams
  onChange: (x: Partial<MandelbrotParams>) => void
  onApply: () => void
}

class Mandelbrot extends React.Component<Props> {

  setPower(power: number) { this.props.onChange({power}) }
  setIterations(iterations: number) { this.props.onChange({iterations}) }

  changePower = (evt: any) => this.setPower(+evt.target.value)
  changeIterations = (evt: any) => this.setIterations(+evt.target.value)

  render() {
    return (
      <>
      <Box>
        <NumberInput
          label="Iterations" 
          value={this.props.value.iterations} 
          onChange={this.changeIterations} 
        />
      </Box>
      <Box>
        <NumberInput 
          label="Exponent"
          value={this.props.value.power} 
          onChange={this.changePower} 
        />
      </Box>
      </>
    )
  }

}

export default Mandelbrot