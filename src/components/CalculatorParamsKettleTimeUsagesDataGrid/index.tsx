import React from 'react';
import {TimeUsage} from "../../entities";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {paramsKettleTimeUsagesLabels} from "../../constants";

interface CalculatorParamsKettleTimeUsagesDataGridProps {
  timeUsages: TimeUsage[];
}

const CalculatorParamsKettleTimeUsagesDataGrid = ({ timeUsages }: CalculatorParamsKettleTimeUsagesDataGridProps) => {
  const rows = (() => {
    const rows = [];

    for (let i = 0; i < timeUsages.length && i < 25; i++) {
      rows.push({
        id: i,
        ...timeUsages[i]
      })
    }

    return rows;
  })();

  const columns: GridColDef[] = [
    {
      field: 'time',
      headerName: paramsKettleTimeUsagesLabels['time'],
      width: 80
    },
    {
      field: 'foodLitres',
      headerName: paramsKettleTimeUsagesLabels['foodLitres'],
      width: 100,
      type: 'number'
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      sx={{ backgroundColor: '#e3f8fa', ml: 2 }}
      hideFooter
    />
  );
};

export {
  CalculatorParamsKettleTimeUsagesDataGrid
};