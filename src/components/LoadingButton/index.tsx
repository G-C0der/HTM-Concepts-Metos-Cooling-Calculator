import React from 'react';
import Button, {ButtonProps} from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  smallIcon?: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({ loading, disabled, startIcon, smallIcon, children, ...props }: LoadingButtonProps) => {
  return (
    <Button
      {...props}
      startIcon={loading
        ? <CircularProgress size={smallIcon ? '0.6rem' : '1rem'} />
        : (startIcon
          ? (smallIcon
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
          : (smallIcon
            ? <span style={{ position: 'relative', top: '1px' }}>{children}</span>
            : children)
      }
    </Button>
  );
}

export {
  LoadingButton
};
