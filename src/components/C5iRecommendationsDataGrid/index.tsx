import * as React from 'react';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {C5iRecommendationsRow} from "./types";
import {round} from "../../utils/math";
import Typography from "@mui/material/Typography";

interface C5iRecommendationsDataGridProps {
  rows: C5iRecommendationsRow[]
}

export const C5iRecommendationsDataGrid = ({ rows }: C5iRecommendationsDataGridProps) => {
  const columns: GridColDef[] = [
    {
      field: 'c2CoolingPercent',
      headerName: 'C2',
      width: 75,
      valueGetter: (params) => `${params.value}%`
    },
    {
      field: 'c3CoolingPercent',
      headerName: 'C3',
      width: 75,
      valueGetter: (params) => `${params.value}%`
    },
    {
      field: 'waterLitresUsed',
      headerName: 'Litres',
      width: 75,
      valueGetter: (params) => round(params.value)
    },
    {
      field: 'powerKWUsed',
      headerName: 'kW',
      width: 75,
      valueGetter: (params) => round(params.value)
    },
    {
      field: 'totalCostCHF',
      headerName: 'CHF',
      width: 75,
      valueGetter: (params) => round(params.value)
    },
    {
      field: 'totalCO2Grams',
      headerName: 'CO2g',
      width: 75,
      valueGetter: (params) => round(params.value)
    },
    {
      field: 'timePlus',
      headerName: 'Minutes Plus',
      width: 95,
      valueGetter: (params) => round(params.value)
    }
  ];

  return (
    <Box>
      <Typography>
        Recommendations C5i 200l Proveno 4G
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        density='compact'
        sx={{ backgroundColor: '#E4E4E4' }}
        hideFooter
        autoHeight
      />
    </Box>
  );
};