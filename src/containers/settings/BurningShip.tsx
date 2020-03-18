import React from 'react';
import { BurningShipParams as Params } from '../../store/algorithm/types';
import {
  Box,
  FormControlLabel,
  NumberInput,
  Switch,
} from '../../components';


interface Props {
  value: Params
  onChange: (x: Partial<Params>) => void
  onApply: () => void
}

class BurningShip extends React.Component<Props> {

  setIterations(iterations: number) { this.props.onChange({iterations}) }
  changeIterations = (evt: React.ChangeEvent<HTMLInputElement>) => this.setIterations(+evt.target.value)
  
  setFlip(flip: boolean) { this.props.onChange({flip}) }
  changeFlip = (evt: React.ChangeEvent<HTMLInputElement>) => this.setFlip(evt.target.checked)

  setPower(power: number) { this.props.onChange({power}) }
  changePower = (evt: any) => this.setPower(+evt.target.value)

  render() {
    return (
      <>
      <Box>
        <NumberInput
          label="Iterations"
          value={this.props.value.iterations} 
          onChange={this.changeIterations} 
          min={1}
          step={1}
        />
      </Box>
      <Box>
        <NumberInput
          label="Exponent"
          value={this.props.value.power} 
          onChange={this.changePower} 
          step={0.1}
        />
      </Box>
      <Box>
        <FormControlLabel label="Flip"
          control={
            <Switch
              checked={this.props.value.flip}
              onChange={this.changeFlip}
            />
          }
        />
      </Box>
      </>
    )
  }

}

export default BurningShip