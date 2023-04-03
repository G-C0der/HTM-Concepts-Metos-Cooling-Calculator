import * as React from 'react';
import {KettleEntity, TimeUsageRow} from "../../entities/KettleEntity";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";

interface KettleTimeUsageDataGridProps {
  kettleEntity: KettleEntity;
  rows: TimeUsageRow[];
  setRows: (rows: any[]) => void;
}

export const KettleTimeUsageDataGrid = ({ kettleEntity, rows, setRows }: KettleTimeUsageDataGridProps) => {
  const columns: GridColDef[] = [
    { field: 'time', headerName: 'Time', width: 80 },
    { field: 'foodLitres', headerName: 'Food Litres', width: 100, editable: true }
  ];

  const onFoodLitresCellEditStop = (params: any, event: any) => {
    let foodLitres = +event.target.value;

    const rowIndex = rows.findIndex(row => row.id === params.id);
    const newRows = [...rows] as any;

    if (foodLitres < 0) newRows[rowIndex][params.field] = 0;
    else if (foodLitres > kettleEntity.getSizeLitres()) newRows[rowIndex][params.field] = kettleEntity.getSizeLitres();
    else newRows[rowIndex][params.field] = foodLitres; // TODO: check if this is a workaround

    setRows(newRows);

    kettleEntity.timeUsageRows = rows;
  };

  return (
    <Box sx={{ height: 910, width: 182 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        density='compact'
        sx={{ backgroundColor: '#E4E4E4' }}
        onCellEditStop={onFoodLitresCellEditStop}
        hideFooter
        disableRowSelectionOnClick
      />
    </Box>
  );
}