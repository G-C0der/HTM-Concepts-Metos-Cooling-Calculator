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
      field: 'waterCostCHF',
      headerName: 'Water CHF',
      width: 85,
      valueGetter: (params) => round(params.row.waterCostCHF)
    },
    {
      field: 'waterCO2Grams',
      headerName: 'Water CO2',
      width: 85,
      valueGetter: (params) => round(params.row.waterCO2Grams)
    },
    {
      field: 'timePlus',
      headerName: 'Time Plus',
      width: 85,
      valueGetter: (params) => `${round(params.row.timePlus)} min`
    },
    {
      field: 'electricityCostCHF',
      headerName: 'Electricity CHF',
      width: 105,
      valueGetter: (params) => round(params.row.electricityCostCHF)
    },
    {
      field: 'electricityCO2Grams',
      headerName: 'Electricity CO2',
      width: 105,
      valueGetter: (params) => round(params.row.electricityCO2Grams)
    }
  ];

  return (
    <Box sx={{ height: 260, width: 610 }}>
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