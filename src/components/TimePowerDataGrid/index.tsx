import React from 'react';
import {DataGrid, GridCellParams, GridColDef} from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import {IceWaterCoolingEntity, TimePowerUsageRow} from "../../entities/IceWaterCoolingEntity";
import {getEnumNumericValues, round} from "../../utils";
import './style.css';
import {KettleSizeLitres} from "../../enums/KettleSizeLitres";
import {MenuItem, Select} from "@mui/material";
import {KettlePowerRegenPercent} from "../../enums/KettlePowerRegenPercent";

interface TimePowerDataGridProps {
  rows: TimePowerUsageRow[];
  setRows: (rows: any[]) => void;
  iceWaterCoolingEntity: IceWaterCoolingEntity;
}

export const TimePowerDataGrid = ({ rows, setRows, iceWaterCoolingEntity }: TimePowerDataGridProps) => {
  const columns: GridColDef[] = [
    {
      field: 'powerRegenPercent',
      headerName: 'Power Regen.',
      width: 140,
      renderCell: ({ row: { id, powerRegenPercent } }: GridCellParams) => (
        <Select
          style={{ width: "90px" }}
          disableUnderline
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiSelect-select:focus': {
              backgroundColor: 'transparent',
            },
          }}
          value={powerRegenPercent}
          onChange={(event) => handeKettlePowerRegenPercentChange(id, event.target.value)}
        >
          {getEnumNumericValues(KettlePowerRegenPercent).reverse().map((kettlePowerRegenPercent: KettlePowerRegenPercent) => (
            <MenuItem value={kettlePowerRegenPercent / 100} key={kettlePowerRegenPercent}>{kettlePowerRegenPercent}%</MenuItem>
          ))}
        </Select>
      )
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 115
    },
    {
      field: 'powerKW',
      headerName: 'Rest Power',
      width: 80,
      valueGetter: (params) => params.value
        ? `${round(100 / iceWaterCoolingEntity.getMaxPowerKW() * params.value)}%`
        : '-',
      cellClassName: (params: GridCellParams) => (params.row.powerKW as any) < 0
        ? 'data-grid-cell-negative-percentage'
        : ''
    }
  ];

  const handeKettlePowerRegenPercentChange = (rowId: string, newPercent: number) => {
    const rowIndex = rows.findIndex(row => row.id === rowId);
    const newRows = [...rows] as any;

    newRows[rowIndex]['powerRegenPercent'] = newPercent;

    setRows(newRows);
  };

  return (
    <Box sx={{ height: 910, width: 350 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        density='compact'
        sx={{ backgroundColor: '#E4E4E4' }}
        hideFooter
      />
    </Box>
  );
};
