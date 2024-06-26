import React, {useEffect, useState} from 'react';


interface ValidationRules {
    required?: boolean,
    maxValue?: number,
    minValue?: number,
    integer?: boolean
}

interface ValidationState {
    value: string,
    error: string | null
}

export default function useNumberValidation(
    rules: ValidationRules, initialValue: string = ''
): [ValidationState, React.Dispatch<React.SetStateAction<string>>] {
    const [value, setValue] = useState<string>(initialValue);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let newError = null;

        const numberValue = rules.integer ? parseInt(value) : Number(value);
        if (rules.required && value.trim() === '') {
            newError = 'This field is required';
        } else if (isNaN(numberValue)) {
            newError = 'This field must be numeric';
        } else if (rules.maxValue && numberValue > rules.maxValue) {
            newError = `This field cannot exceed ${rules.maxValue}`;
        } else if (rules.minValue && numberValue < rules.minValue) {
            newError = `This field must be at least ${rules.minValue}`;
        }

        setError(newError);
    }, [value, rules]);

    return [{value, error}, setValue];
}
