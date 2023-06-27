import React from 'react';
import Button, {ButtonProps} from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  smallSpinner?: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({ loading, disabled, startIcon, smallSpinner, children, ...props }: LoadingButtonProps) => {
  return (
    <Button
      {...props}
      startIcon={loading ? <CircularProgress size={smallSpinner ? '0.6rem' : '1rem'} /> : (startIcon ? startIcon : null)}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}

export {
  LoadingButton
};
