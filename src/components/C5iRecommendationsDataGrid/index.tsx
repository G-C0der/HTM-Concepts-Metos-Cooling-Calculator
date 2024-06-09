import * as React from 'react';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {C5iRecommendationsRow} from "./types";
import {round} from "../../utils/math";
import Typography from "@mui/material/Typography";
import {User} from "../../types";
import {UserMode} from "../../enums/UserMode";

interface C5iRecommendationsDataGridProps {
  rows: C5iRecommendationsRow[];
  user: User;
}

export const C5iRecommendationsDataGrid = ({ rows, user }: C5iRecommendationsDataGridProps) => {
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
      <Typography sx={{ color: '#000' }}>
        Recommendations {user.mode === UserMode.UserModeElro
          ? '200l Kettle'
          : 'Metos Proveno 4G 200l C5i'}
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
