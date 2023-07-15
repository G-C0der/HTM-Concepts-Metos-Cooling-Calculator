import React from 'react';
import Button, {ButtonProps} from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  small?: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({ loading, disabled, startIcon, small, children, ...props }: LoadingButtonProps) => {
  const { style, ...otherProps } = props;

  return (
    <Button
      style={
        small
          ? {
            border: "none", padding: "0 10px", textAlign: "center", textDecoration: "none",
            display: "inline-block", fontSize: "12px", margin: "0 0 0 3px", cursor: "pointer",
            ...style
          }
          : { ...style }
      }
      {...otherProps}
      startIcon={loading
        ? <CircularProgress size={small ? '0.6rem' : '1rem'} />
        : (startIcon
          ? (small
            ? React.cloneElement(startIcon as React.ReactElement, { style: {
              fontSize: '1rem', verticalAlign: 'middle', transform: 'translateY(-1px)'
            }})
            : startIcon)
          : null)}
      disabled={disabled || loading}
    >
      {
        loading
          ? 'Loading...'
          : (small
            ? <span style={{ position: 'relative', top: '1px' }}>{children}</span>
            : children)
      }
    </Button>
  );
}

export {
  LoadingButton
};
