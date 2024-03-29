import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { useController } from 'react-hook-form';

export default function ControlledInput({
  control,
  name,
  label,
  type,
  rules,
  maxlenght = 120,
  check = false
}) {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, error }
  } = useController({
    name,
    control,
    rules,
    defaultValue: ''
  });

  return (
    <FormGroup check={check}>
      <Label for={name}>{label}</Label>
      <Input
        {...inputProps}
        type={type}
        id={name}
        invalid={invalid}
        innerRef={ref}
        maxLength={maxlenght}
      />
      {error && (
        <span className="text-danger">
          {error?.message === '' ? 'Campo obrigatório' : error?.message}
        </span>
      )}
    </FormGroup>
  );
}
