import * as React from 'react';
import { InputLabel, FormControl } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

const StyledFormControl = styled(FormControl)`
  width: 100%;
`;

const StyledInputLabel = styled(InputLabel)`
  position: absolute;
  pointer-events: none;
  left: -4px;
  top: -8px;
  background-color: inherit;
  padding: 0 4px;
  font-size: 0.75rem;
  color: ${props => props.focused ? props.theme.palette.primary.main : props.theme.palette.text.secondary};
  transition: color 0.3s;
`;

export default function CustomTextArea({
                                           label = 'Description',
                                           defaultValue,
                                           onChange,
                                           placeholder = 'Enter description'
                                       }) {
    const [focused, setFocused] = React.useState(false);

    const handleChange = (event) => {
        const newValue = event.target.value;
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <StyledFormControl fullWidth>
            {label && <StyledInputLabel focused={focused}>{label}</StyledInputLabel>}
            <StyledTextareaAutosize
                rows={3}
                aria-label="empty textarea"
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </StyledFormControl>
    );
}

const StyledTextareaAutosize = styled(BaseTextareaAutosize)`
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 24px 12px 8px 12px; /* увеличиваем верхний пэдинг, чтобы было место для метки */
  border-radius: 8px 8px 0 0;
  color: ${props => props.theme.palette.text.primary};
  background: ${props => props.theme.palette.mode === 'dark' ? grey[800] : '#fff'};
  border: none;
  border-bottom: 1px solid ${props => props.focused ? props.theme.palette.primary.main : 'rgb(242, 236, 255)'};
  box-shadow: 0px 2px 2px ${props => props.theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  resize: none; /* Убираем возможность изменения размера */

  &:hover {
    background: ${props => props.theme.palette.mode === 'dark' ? grey[700] : '#fff'};
    // border-color: ${props => props.theme.palette.primary.main};
  }

  &:focus {
    border-color: ${props => props.theme.palette.primary.main};
    //box-shadow: 0 0 0 3px ${props => props.theme.palette.primary.main};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`;

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};
