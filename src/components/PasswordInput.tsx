import React from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";


interface PasswordInputProps {
    required?: boolean,
    label: string,
    value: string,
    onChange: (value: string) => void
}

export default function PasswordInput(
    {required = false, label, value, onChange}: PasswordInputProps
): React.ReactElement {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <TextField
            fullWidth
            required={required}
            label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                </InputAdornment>
            }}
        />
    );
}