import React, {useEffect, useState} from 'react';

// This file was mostly generated by GitHub Copilot Chat

interface ValidationRules {
    required?: boolean,
    maxLength?: number,
    minLength?: number,
    email?: boolean
}

interface ValidationState {
    value: string,
    error: string | null
}

export default function useStringValidation(
    rules: ValidationRules, initialValue: string = ''
): [ValidationState, React.Dispatch<React.SetStateAction<string>>] {
    const [value, setValue] = useState<string>(initialValue);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let newError = null;

        // email regex from Morgan English's code for the SENG65 reference server

        if (rules.required && value.trim() === '') {
            newError = 'This field is required';
        } else if (rules.maxLength && value.length > rules.maxLength) {
            newError = `This field cannot exceed ${rules.maxLength} characters`;
        } else if (rules.minLength && value.length < rules.minLength) {
            newError = `This field must be at least ${rules.minLength} characters`;
        } else if (rules.email && !value.match(
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
        )) {
            newError = 'Invalid email format';
        }

        setError(newError);
    }, [value, rules]);

    return [{value, error}, setValue];
}
