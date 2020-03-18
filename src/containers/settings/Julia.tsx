import React from 'react';
import { JuliaParams } from '../../store/algorithm/types';
import Katex from '../../components/katex';
import * as math from 'mathjs';
import {
  Box,
  NumberInput,
  MenuItem,
  TextField,
} from '../../components';


export const FORMULAS: {[k: string]: {latex?: string, previewPixels?: number}} = {
  'e^(z^3)-0.6': {
    latex: 'e^{z^3}-0.6',
    previewPixels: 160000,
  },
  'sqrt(sinh(z^2))+0.06+0.12i': {
    latex: '\\sqrt{\\sinh(z^2)}+0.06+0.12i',
    previewPixels: 90000,
  },
  '(1-z^3/6)/((z-z^2/2)^2)+c': {
    latex: '\\frac{1-\\frac{z^3}{6}}{\\left(z-\\frac{z^2}{2}\\right)^2}+x+yi',
    previewPixels: 90000,
  },
  '1-z^2+z^5/(2+4z)+c': {
    latex: '1 - z^2 + \\frac{z^5}{2+4z}+x+yi',
    previewPixels: 90000,
  },
  //'CUSTOM': {previewPixels: 6400},
}


interface Props {
  value: JuliaParams
  onChange: (x: Partial<JuliaParams>, p?: {previewPixels?: number}) => void
  onApply: () => void
}

function isComplexNumber(x: any): x is {re: number, im: number} {
  if ('re' in x && typeof x.re === 'number') {
    if ('im' in x && typeof x.im === 'number') {
      return true;
    }
  }
  return false;
}

class Julia extends React.Component<Props> {
  state: {
    formula: string,
    valid: boolean,
    custom: string,
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      formula: props.value.f,
      valid: false,
      custom: '',
    }
  }

  setBound(bound: number) { this.props.onChange({bound}) }
  setIterations(iterations: number) { this.props.onChange({iterations}) }
  setFormula(f: string) {
    this.props.onChange({f}, {
      previewPixels: (FORMULAS[f] || {previewPixels: 6400}).previewPixels,
    })
  }

  changeBound = (evt: any) => this.setBound(evt.target.value)
  changeIterations = (evt: any) => this.setIterations(evt.target.value)

  selectFormula = (evt: any) => {
    const f = evt.target.value;
    if (f === 'CUSTOM') {
      this.setState({formula: 'CUSTOM'})
      if (this.state.valid) {
        this.setFormula(this.state.custom);
      }
    } else {
      this.setState({formula: f})
      this.setFormula(f)
    }
  }

  changeFormula = (evt: any) => {
    const custom = evt.target.value;
    let a;
    try {
      a = math.evaluate(custom, {z: math.complex(1,2), c: math.complex(-1,-0.5)});
    } catch {
      this.setState({custom, valid: false})
    }
    if (a !== undefined) {
      if (isComplexNumber(a)) {
        this.setState({custom, valid: true})
        this.setFormula(custom);
      } else {
        this.setState({custom, valid: false})
      }
    }
  }

  customFormula() {
    return (
      <TextField
        variant="filled"
        label={<Katex math="f_c(z)="/>}
        value={this.state.custom}
        onChange={this.changeFormula}
        error={!this.state.valid}
      />
    )
  }


  render() {
    console.log(this.state.valid)
    return (
      <>
      <Box>
        <NumberInput 
          label="Iterations"
          value={this.props.value.iterations} 
          onChange={this.changeIterations} 
          step={1}
        />
      </Box>

      <Box>
          <TextField select
            label="Formula"
            onChange={this.selectFormula} 
            value={this.state.formula}
          >
            {Object.keys(FORMULAS).map(f => {
              const fmla = FORMULAS[f].latex;
              if (fmla) {
                return (
                  <MenuItem key={f} value={f}>
                    <Katex math={'f_c(z)='+fmla.replace('x+yi', 'c')}/>
                  </MenuItem>
                )
              } else {
                return (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                )
              }
            })}
            {//<MenuItem value="CUSTOM">Custom</MenuItem>
            }
          </TextField>
      </Box>
      {this.state.formula === 'CUSTOM' ? (
        <Box>{this.customFormula()}</Box>
      ) : null}
      </>
    )
  }

}

export default Julia