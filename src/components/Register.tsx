import React, {useState} from 'react';
import {Button, TextField} from '@mui/material';
import {register} from "../model/api.ts";
import {Failure, UserRegister} from "../model/responseBodies.ts";
import {Result} from "ts-results";

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        const result: Result<UserRegister, Failure> = await register(email, firstName, lastName, password);
        if (result.ok) {
            console.log(result.val);
        } else {
            console.log(result.val);
        }
    }

    return (
        <div>
            <h1>Register for SENG365 Petition Site</h1>
            <form onSubmit={onSubmit}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                />
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
}