import React from 'react';
import {DataGrid, GridColDef} from "@mui/x-data-grid";

interface AuditLogDetailsDataGridProps {
  before: object;
  after: object;
}

const AuditLogDetailsDataGrid = ({ before, after }: AuditLogDetailsDataGridProps) => {
  const rows = ((before: object, after: object) => {
    const getRows = (before: object, after: object) => {
      const rows = [];

      const beforeEntries = Object.entries(before);
      const afterEntries = Object.entries(after);
      const beforeLength = beforeEntries.length;
      const afterLength = afterEntries.length;
      const longerLength = beforeLength > afterLength ? beforeLength : afterLength;

      for (let i = 0; i < longerLength; i++) {
        let field, valueBefore, valueAfter;
        if (beforeEntries[i] !== undefined) ([field, valueBefore] = beforeEntries[i]);
        if (afterEntries[i] !== undefined) ([field, valueAfter] = afterEntries[i]);

        rows.push({
          ...(field && { id: i, field }),
          ...(valueBefore !== undefined && { valueBefore }),
          ...(valueAfter !== undefined && { valueAfter })
        });
      }

      return rows;
    };

    return getRows(before, after);
  })(before, after);

  const columns: GridColDef[] = [
    {
      field: 'field',
      headerName: 'Field',
      width: 100
    },
    {
      field: 'valueBefore',
      headerName: 'Before',
      flex: 1
    },
    {
      field: 'valueAfter',
      headerName: 'After',
      flex: 1
    }
  ];

  return (
    <DataGrid
      rows={rows!}
      columns={columns}
      // sx={{ backgroundColor: '#e3f8fa' }}
      hideFooter
    />
  );
};

export {
  AuditLogDetailsDataGrid
};