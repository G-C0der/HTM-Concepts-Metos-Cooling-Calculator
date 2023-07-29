import {OutlinedInputProps, TextField, TextFieldProps} from '@mui/material';
import React from 'react';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

type NumberInputFieldProps = TextFieldProps & {
  inputRef?: (instance: HTMLInputElement | null) => void;
};

const NumberInputField = ({ inputRef = () => {}, ...props }: NumberInputFieldProps) => {
  const numberMask = createNumberMask({
    prefix: '',
    allowDecimal: true,
    decimalSymbol: '.',
    integerLimit: null,
    fractionLimit: null
  });
console.log('1-------------',inputRef)
console.log('2-------------',props)
  const MaskedInputComponent = React.forwardRef<HTMLInputElement, OutlinedInputProps & MaskedInputProps>((props, ref) => (
    <MaskedInput
      {...props}
      ref={ref}
      mask={numberMask}
      guide={false}
    />
  ));

  return (
    <TextField
      {...props}
      InputProps={{
        inputComponent: MaskedInputComponent,
      }}
    />
  );
};

export {
  NumberInputField
};