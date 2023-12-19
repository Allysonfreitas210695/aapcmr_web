import React, { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import Select from 'react-select';

export default function SelectCustom({ name, value, onChange, options, label }) {
    const handleChange = (selectedOption) => {
        if (onChange) {
            onChange(selectedOption);
        }
    };

    return (
        <FormGroup>
            <Label for={name}>{label}</Label>
            {options.length > 0 &&
                <Select
                    className='w-100'
                    value={options.find(o => o.value === value.value)}
                    options={options}
                    id={name}
                    name={name}
                    onChange={handleChange}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                />
            }
        </FormGroup>
    );
}
