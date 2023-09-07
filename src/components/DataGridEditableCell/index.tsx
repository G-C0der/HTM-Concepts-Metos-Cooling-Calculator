import React from 'react';
import {TextField} from "@mui/material";

interface DataGridEditableCellProps {
  value: any;
  id: any;
  field: any;
  onEdit: any;
}

const DataGridEditableCell = ({ value, id, field, onEdit }: DataGridEditableCellProps) => {
  const handleChange = (e: any) => {
    onEdit(id, field, e.target.value);
  };

  return (
    <TextField
      style={{ width: "200px", margin: "5px" }}
      value={value}
      // error={}
      type="text"
      inputProps={{ step: '0.01' }}
      variant="outlined"
      onChange={handleChange}
    />
  );

  return (
    <input type="text" value={value} onChange={handleChange} />
  );
};

export {
  DataGridEditableCell
};