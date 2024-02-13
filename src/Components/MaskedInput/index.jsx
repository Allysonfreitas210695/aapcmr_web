import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import InputMask from 'react-input-mask';
import './MaskedInput.css'; // Importe um arquivo de estilos separado

function MaskedInput({
  value,
  onChange,
  onBlur = null,
  mask,
  type,
  name,
  label
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleOnBlur = (event) => {
    if (onBlur) {
      onBlur(event.target.value);
    }
  };

  return (
    <FormGroup>
      <Label for={name}>{label}</Label>
      <div className="custom-input-container">
        <InputMask
          className="p-1 w-100 custom-input-mask"
          mask={mask}
          value={value}
          id={name}
          onChange={handleChange}
          type={type}
          onBlur={handleOnBlur}
        />
      </div>
    </FormGroup>
  );
}

export default MaskedInput;
