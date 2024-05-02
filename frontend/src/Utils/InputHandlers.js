export const usernameValidation = (event) => {
    const inputValue = event.target.value;
    let isError = false;
    let helperText = '';

    if (inputValue.length < 3) {
        isError = true;
        helperText = 'Username should be at least 3 characters long';
    }
    if (!/^[a-zA-Z0-9]+$/.test(inputValue)) {
        isError = true;
        helperText = 'Username should contain only English letters and numbers';
    }

    return {
        input: inputValue,
        error: isError,
        helper: helperText,
    };
}
export const passwordValidation = (event) => {
    const inputValue = event.target.value;
    let isError = false;
    let helperText = '';

    if (inputValue.length < 6) {
        isError = true;
        helperText = 'Password should be at least 6 characters long';
    }
    else if (!/^[a-zA-Z0-9]+$/.test(inputValue)) {
        isError = true;
        helperText = 'Password should contain only English letters and numbers';
    }

    return {
        input: inputValue,
        error: isError,
        helper: helperText,
    }
}
export const emailValidation = (event) => {
    const inputValue = event.target.value;
    let isError = false;
    let helperText = '';

    if (!/\S+@\S+\.\S+/.test(inputValue)) {
        isError = true;
        helperText = 'Please enter a valid email address';
    }

    return {
        input: inputValue,
        error: isError,
        helper: helperText,
    }
}
export const fullNameValidation = (event) => {
    const inputValue = event.target.value;
    let isError = false;
    let helperText = '';

    if (inputValue.length < 1) {
        isError = true;
        helperText = 'Please enter your real name';
    }

    return {
        input: inputValue,
        error: isError,
        helper: helperText,
    }
}
export const companyNameValidation = (event) => {
    const inputValue = event.target.value;
    let isError = false;
    let helperText = '';

    if (inputValue.length < 3) {
        isError = true;
        helperText = 'The company name must be at least 3 characters long';
    }

    return {
        input: inputValue,
        error: isError,
        helper: helperText,
    }
}
export const eventNameValidation = (event) => {
    const inputValue = event.target.value;
    let isError = false;
    let helperText = '';

    if (inputValue.length < 3) {
        isError = true;
        helperText = 'The event name must be at least 3 characters long';
    }

    return {
        input: inputValue,
        error: isError,
        helper: helperText,
    }
}
export const descriptionValidation = (event) => {
    const inputValue = event.target.value;
    let isError = false;
    let helperText = '';

    if (inputValue.length < 1) {
        isError = true;
        helperText = 'Description must be at least 3 characters';
    }

    return {
        input: inputValue,
        error: isError,
        helper: helperText,
    }
}
export const memberRoles = [
    { value: 4, label: 'Worker' },
    { value: 3, label: 'News Maker' },
    { value: 2, label: 'Editor' },
];

export const FORMATS = [
    {value: 'conferences', label: 'Conferences'},
    {value: 'lectures', label: 'Lectures'},
    {value: 'workshops', label: 'Workshops'},
    {value: 'fests', label: 'Fests'}
];
export const THEMES = [
    {value: 'business', label: 'Business'},
    {value: 'politics', label: 'Politics'},
    {value: 'psychology', label: 'Psychology'}
];

export const TICKET_TYPES = [
    {value: 'common'},
    {value: 'VIP'},
];

export function getRoleLabel(role_type) {
    switch (role_type) {
        case 'founder':
            return 'Founder';
        case 'editor':
            return 'Editor';
        case 'news_maker':
            return 'News Maker';
        case 'worker':
            return 'Worker';
        default:
            return '';
    }
}
