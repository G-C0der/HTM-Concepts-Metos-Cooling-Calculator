import * as React from 'react';
import {KettleEntity} from "../../entities/KettleEntity";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {getHoursOfDay} from "../../utils/time";

interface KettleTimeFoodLitresDataGridProps {
  kettleEntity: KettleEntity;
}

export const KettleTimeFoodLitresDataGrid = ({ kettleEntity }: KettleTimeFoodLitresDataGridProps) => {
  const columns: GridColDef[] = [
    { field: 'time', headerName: 'Zeit', width: 80 },
    { field: 'foodLitres', headerName: 'Food Litres', width: 100, editable: true }
  ];

  const rows = [];

  for (const hour of getHoursOfDay()) {
    rows.push({ id: hour, time: hour, foodLitres: 0 });
  }

  return (
    <Box sx={{ height: 300, width: 200 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        density='compact'
        sx={{ backgroundColor: '#E4E4E4' }}
      />
    </Box>
  );
}