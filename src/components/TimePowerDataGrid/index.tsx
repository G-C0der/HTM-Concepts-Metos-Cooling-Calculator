import React from 'react';
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";
import {round} from "../../utils/math";

interface TimePowerDataGridProps {
  rows: object[];
  iceWaterCoolingEntity: IceWaterCoolingEntity;
}

export const TimePowerDataGrid = ({ rows, iceWaterCoolingEntity }: TimePowerDataGridProps) => {
  const columns: GridColDef[] = [
    {
      field: 'time',
      headerName: 'Zeit',
      width: 115
    },
    {
      field: 'powerKW',
      headerName: 'Power kW',
      width: 80,
      valueGetter: (params) => params.row.powerKW
        ? `${round(100 / iceWaterCoolingEntity.getMaxPowerKW() * params.row.powerKW, 2)}%`
        : '-'
    }
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