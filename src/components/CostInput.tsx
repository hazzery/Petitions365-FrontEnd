import React, {ChangeEvent} from "react";
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";

import useNumberValidation from "../hooks/useNumberValidation.ts";


interface CostInputProps<Required extends boolean> {
    required?: Required,
    fullWidth?: boolean,
    label: string,
    defaultValue?: number | "",
    onChange: Required extends true ? (value: number) => void : (value: number | "") => void,
    disabled?: boolean,
    formSubmitted?: boolean
}

export default function CostInput<Required extends boolean>(
    {
        required = false as Required,
        fullWidth = false,
        label,
        defaultValue = "" as const,
        onChange,
        disabled = false,
        formSubmitted = false
    }: CostInputProps<Required>
): React.ReactElement {
    const [value, setValue] = useNumberValidation({
        required,
        minValue: 0,
        maxValue: 999999999
    }, defaultValue.toString());
    const [textFieldIsFocused, setTextFieldIsFocused] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
        if (event.target.value === "") {
            setValue("");
            setError(formSubmitted && (required ?? false));
            if (!required) {
                (onChange as (value: number | "") => void)("");
            }
        } else if (event.target.value.match(/^\d+$/)) {
            setValue(event.target.value);
            setError(false);
            onChange(parseInt(event.target.value));
        } else {
            setError(true);
            setTimeout(() => setError(false), 200);
        }
    }

    return (
        <TextField
            label={label}
            value={value.value}
            fullWidth={fullWidth}
            required={required}
            onChange={handleInputChange}
            error={(formSubmitted && Boolean(value.error)) || error}
            helperText={formSubmitted && value.error}
            disabled={disabled}
            InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
            InputLabelProps={{
                shrink: textFieldIsFocused || value.value !== "",
                style: {paddingLeft: !textFieldIsFocused && value.value === "" ? "15px" : "0px"}
            }}
            onFocus={() => setTextFieldIsFocused(true)}
            onBlur={() => setTextFieldIsFocused(false)}
        />
    );
}