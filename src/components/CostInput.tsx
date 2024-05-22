import React, {ChangeEvent} from "react";
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";


interface CostInputProps<Required extends boolean> {
    required?: Required,
    fullWidth?: boolean,
    label: string,
    defaultValue?: number | "",
    onChange: Required extends true ? (value: number) => void : (value: number | "") => void
}

export default function CostInput<Required extends boolean>(
    {required, fullWidth, label, defaultValue, onChange}: CostInputProps<Required>
): React.ReactElement {
    const [value, setValue] = React.useState<string>(defaultValue ? defaultValue.toString() : "");
    const [textFieldIsFocused, setTextFieldIsFocused] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
        if (event.target.value === "") {
            setValue("");
            setError(required ?? false);
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
            value={value}
            fullWidth={fullWidth}
            required={required}
            onChange={handleInputChange}
            error={error}
            InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
            InputLabelProps={{
                shrink: textFieldIsFocused || value !== "",
                style: {paddingLeft: !textFieldIsFocused && value === "" ? "15px" : "0px"}
            }}
            onFocus={() => setTextFieldIsFocused(true)}
            onBlur={() => setTextFieldIsFocused(false)}
        />
    );
}