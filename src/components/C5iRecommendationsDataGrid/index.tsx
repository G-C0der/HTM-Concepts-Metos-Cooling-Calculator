import * as React from 'react';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {C5iRecommendationsRow} from "./types";
import {round} from "../../utils/math";

interface C5iRecommendationsDataGridProps {
  rows: C5iRecommendationsRow[]
}

export const C5iRecommendationsDataGrid = ({ rows }: C5iRecommendationsDataGridProps) => {
  const columns: GridColDef[] = [
    {
      field: 'c2CoolingPercent',
      headerName: 'C2',
      width: 60,
      valueGetter: (params) => `${params.row.c2CoolingPercent}%`
    },
    {
      field: 'c3CoolingPercent',
      headerName: 'C3',
      width: 60,
      valueGetter: (params) => `${params.row.c3CoolingPercent}%`
    },
    {
      field: 'waterLitresUsed',
      headerName: 'Litres',
      width: 85,
      valueGetter: (params) => round(params.row.waterLitresUsed)
    },
    {
      field: 'powerKWUsed',
      headerName: 'kW',
      width: 85,
      valueGetter: (params) => round(params.row.powerKWUsed)
    },
    {
      field: 'totalCostCHF',
      headerName: 'CHF',
      width: 85,
      valueGetter: (params) => round(params.row.totalCostCHF)
    },
    {
      field: 'totalCO2Grams',
      headerName: 'CO2',
      width: 85,
      valueGetter: (params) => round(params.row.totalCO2Grams)
    },
    {
      field: 'timePlus',
      headerName: 'Minutes Plus',
      width: 95,
      valueGetter: (params) => round(params.row.timePlus)
    }
  ];

  return (
    <Box sx={{ height: 260, width: 565 }}>
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
}