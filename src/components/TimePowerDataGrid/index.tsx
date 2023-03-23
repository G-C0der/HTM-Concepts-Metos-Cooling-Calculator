import React from 'react';
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid';
import Box from "@mui/material/Box";

interface TimePowerDataGridProps {
  rows: object[];
}

export const TimePowerDataGrid = ({ rows }: TimePowerDataGridProps) => {
  const columns: GridColDef[] = [
    { field: 'time', headerName: 'Zeit', width: 115 },
    { field: 'powerKWPercent', headerName: 'Power kW', width: 80 }
  ];

  return (
    <Box sx={{ height: 980, width: 200 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        density='compact'
        sx={{ backgroundColor: '#E4E4E4' }}
      />
    </Box>
  );
};