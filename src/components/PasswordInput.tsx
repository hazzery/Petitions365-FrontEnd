import React from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";


interface PasswordInputProps {
    name: string,
    label: string
}

export default function PasswordInput(
    {name, label}: PasswordInputProps
): React.ReactElement {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <TextField
            required
            fullWidth
            name={name}
            label={label}
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