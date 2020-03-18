import React from 'react';
import { JuliaQuadraticParams } from '../../store/algorithm/types';
import ComplexNumberInput from '../../components/ComplexNumberInput';
import { withTheme } from '@material-ui/core/styles';
import {
  Box,
  FormControl,
  InputLabel,
  NumberInput,
} from '../../components';


interface Props {
  value: JuliaQuadraticParams
  theme: any
  onChange: (x: Partial<JuliaQuadraticParams>) => void
  onApply: () => void
}

type Evt = React.ChangeEvent<HTMLInputElement>

class JuliaQuadratic extends React.Component<Props> {

  setIterations(iterations: number) { this.props.onChange({iterations}) }
  changeIterations = (evt: Evt) => this.setIterations(+evt.target.value)

  setBound(bound: number) { this.props.onChange({bound}) }
  changeBound = (evt: Evt) => this.setBound(+evt.target.value)

  setPower(power: number) { this.props.onChange({power})} 
  changePower = (evt: Evt) => this.setPower(+evt.target.value)

  setC(x: number, y: number) { this.props.onChange({c: {x, y}}) }
  changeC = (x: number, y: number) => this.setC(x, y);

  applyC = (x: number, y: number) => {
    this.setC(x, y);
    this.props.onApply()
  }

  render() {
    return (
      <>
      <Box>
        <NumberInput
          label="Iterations"
          value={this.props.value.iterations} 
          onChange={this.changeIterations}
          step={1}
          min={1}
        />
      </Box>
      <Box>
        <NumberInput
          label="Boundary"
          value={this.props.value.bound} 
          onChange={this.changeBound}
          step={1}
          min={1}
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
      <Box style={{
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: this.props.theme.palette.text.secondary,
        borderRadius: '5px',
        padding: '5px',
      }}>
        <FormControl>
          <InputLabel shrink>
          c = 
          {Math.round(this.props.value.c.x * 1000)/1000}
          {this.props.value.c.y < 0 ? '-' : '+'}
          {Math.abs(Math.round(this.props.value.c.y * 1000)/1000)}i
          </InputLabel>
          <ComplexNumberInput
            value={this.props.value.c}
            onClick={this.changeC}
            onDoubleClick={this.applyC}
            size={200}
            max={1.15}
            precision={2}
            markerColor={this.props.theme.palette.secondary.main}
            gridColor={this.props.theme.palette.text.primary}
            textColor={this.props.theme.palette.text.secondary}
          />
        </FormControl>
      </Box>   
      </>
    )
  }

}

export default withTheme(JuliaQuadratic)