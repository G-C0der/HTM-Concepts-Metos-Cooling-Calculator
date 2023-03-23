import * as React from 'react';
import {KettleEntity, UsageTimeRow} from "../../entities/KettleEntity";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";

interface KettleUsageTimesDataGridProps {
  kettleEntity: KettleEntity;
  rows: UsageTimeRow[];
  setRows: (rows: any[]) => void;
}

export const KettleUsageTimesDataGrid = ({ kettleEntity, rows, setRows }: KettleUsageTimesDataGridProps) => {
  const columns: GridColDef[] = [
    { field: 'time', headerName: 'Zeit', width: 80 },
    { field: 'foodLitres', headerName: 'Food Litres', width: 100, editable: true }
  ];

  const onFoodLitresCellEditStop = (params: any, event: any) => {
    let foodLitres = +event.target.value;

    const rowIndex = rows.findIndex(row => row.id === params.id);
    const newRows = [...rows] as any;

    if (foodLitres < 0) newRows[rowIndex][params.field] = 0;
    else if (foodLitres > kettleEntity.sizeLitres) newRows[rowIndex][params.field] = kettleEntity.sizeLitres;
    else newRows[rowIndex][params.field] = foodLitres; // TODO: check if this is a workaround

    setRows(newRows);

    kettleEntity.usageTimeRows = rows;
  };

  return (
    <Box sx={{ height: 300, width: 200 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        density='compact'
        sx={{ backgroundColor: '#E4E4E4' }}
        onCellEditStop={onFoodLitresCellEditStop}
      />
    </Box>
  );
}