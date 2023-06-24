import React from 'react';
import Button, {ButtonProps} from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  children: React.ReactNode;
}

const LoadingButton = ({ loading, disabled, startIcon, children, ...props }: LoadingButtonProps) => {
  return (
    <Button
      {...props}
      startIcon={loading ? <CircularProgress size="1rem" /> : (startIcon ? startIcon : null)}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </Button>
  )
}

export {
  LoadingButton
};
