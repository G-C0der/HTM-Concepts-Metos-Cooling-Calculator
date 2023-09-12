import React from 'react';
import {CalculatorParamsKettle} from "../../types";
import {DataGridPro, GridColDef} from "@mui/x-data-grid-pro";
import {paramsKettlesFieldLabels} from "../../constants";
import { CalculatorParamsKettleTimeUsagesDataGrid } from '../CalculatorParamsKettleTimeUsagesDataGrid';

interface CalculatorParamsKettlesDataGridProps {
  kettles: CalculatorParamsKettle[];
}

const CalculatorParamsKettlesDataGrid = ({ kettles }: CalculatorParamsKettlesDataGridProps) => {
  const rows = (() => {
    const rows = [];

    for (let i = 0; i < kettles.length && i < 6; i++) {
      const name = `${i + 1}`;

      rows.push({
        id: i,
        name,
        ...kettles[i]
      })
    }

    return rows;
  })();

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Kettle',
      width: 100
    },
    {
      field: 'coolingMode',
      headerName: paramsKettlesFieldLabels['coolingMode'],
      width: 120
    },
    {
      field: 'c3CoolingPercent',
      headerName: paramsKettlesFieldLabels['c3CoolingPercent'],
      width: 120,
      type: 'number'
    },
    {
      field: 'sizeLitres',
      headerName: paramsKettlesFieldLabels['sizeLitres'],
      width: 150,
      type: 'number'
    }
  ];

  return (
    <DataGridPro
      rows={rows}
      columns={columns}
      sx={{ backgroundColor: '#e3f8fa', ml: 2 }}
      hideFooter
      getDetailPanelContent={({ row }) => <CalculatorParamsKettleTimeUsagesDataGrid timeUsages={row.timeUsages} />}
    />
  );
};

export {
  CalculatorParamsKettlesDataGrid
};