import {useState} from 'react';

const useInput = (validateValue, id = 0) => {
    const [value, setValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    let valueIsValid;

    if (id) {
        valueIsValid = validateValue(+value, id);
    } else {
        valueIsValid = validateValue(value);
    }

    const hasError = !valueIsValid && isTouched;

    const valueChangeHandler = (event) => {
        setValue(event.target.value);
    };

    const inputBlurHandler = (event) => {
        setIsTouched(true);
    };

    const reset = () => {
        setValue('');
        setIsTouched(false);
    }

    return {value, valueIsValid, hasError, valueChangeHandler, inputBlurHandler, reset};
};

export default useInput;