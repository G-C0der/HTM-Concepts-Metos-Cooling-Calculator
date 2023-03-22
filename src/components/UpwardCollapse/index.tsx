import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';

interface UpwardCollapseProps {
  children: React.ReactNode
}

export const UpwardCollapse = ({ children }: UpwardCollapseProps) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box sx={{ height: 40 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Assign Time"
      />
      <Box
        sx={{
          '& > :not(style)': {
            display: 'flex',
            justifyContent: 'space-around',
            height: 120,
            width: 400,
            mt: 2,
            ml: -15
          },
        }}
      >
        <div>
          <Collapse in={checked} collapsedSize={20}>
            {children}
          </Collapse>
        </div>
      </Box>
    </Box>
  );
};