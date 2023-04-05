import React from 'react';
import {DataGrid, GridCellParams, GridColDef} from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import {IceWaterCoolingEntity, TimePowerUsageRow} from "../../entities/IceWaterCoolingEntity";
import {round} from "../../utils/math";
import './style.css';

interface TimePowerDataGridProps {
  rows: TimePowerUsageRow[];
  iceWaterCoolingEntity: IceWaterCoolingEntity;
}

export const TimePowerDataGrid = ({ rows, iceWaterCoolingEntity }: TimePowerDataGridProps) => {
  const columns: GridColDef[] = [
    {
      field: 'time',
      headerName: 'Time',
      width: 115
    },
    {
      field: 'powerKW',
      headerName: 'Power kW',
      width: 80,
      valueGetter: (params) => params.row.powerKW
        ? `${round(100 / iceWaterCoolingEntity.getMaxPowerKW() * params.row.powerKW)}%`
        : '-',
      cellClassName: (params: GridCellParams) => (params.row.powerKW as any) < 0
        ? 'data-grid-cell-negative-percentage'
        : ''
    }
  ];

  return (
    <Box sx={{ height: 910, width: 200 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        density='compact'
        sx={{ backgroundColor: '#E4E4E4' }}
        hideFooter
      />
    </Box>
  );
};