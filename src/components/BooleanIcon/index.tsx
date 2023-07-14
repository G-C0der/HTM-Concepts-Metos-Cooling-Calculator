import React from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface BooleanIconProps {
  value: any;
}

const BooleanIcon = ({ value }: BooleanIconProps) => {
  return (
    value === true ? <CheckCircleIcon color="success" /> : (value === false) && <CancelIcon color="error" />
  ) as JSX.Element | null;
};

export {
  BooleanIcon
};