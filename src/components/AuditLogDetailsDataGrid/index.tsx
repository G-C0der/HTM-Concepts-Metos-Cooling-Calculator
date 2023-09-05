import React from 'react';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {paramsFieldLabels, userFieldLabels} from "../../constants";
import {detailDataGridRenderCell, detailDataGridValueGetter} from "../../utils";

interface AuditLogDetailsDataGridProps {
  before: object;
  after: object;
}

const AuditLogDetailsDataGrid = ({ before, after }: AuditLogDetailsDataGridProps) => {
  // Parse `before` and `after` into JSON objects if they're strings
  // On heroku prod env they are both strings
  before = (typeof before === 'string') ? JSON.parse(before) : before;
  after = (typeof after === 'string') ? JSON.parse(after) : after;

  const rows = ((before: object, after: object) => {
    const rows = [];

    const beforeEntries = Object.entries(before);
    const afterEntries = Object.entries(after);
    const longerLength = (beforeEntries.length > afterEntries.length) ? beforeEntries.length : afterEntries.length;

    for (let i = 0; i < longerLength; i++) {
      let field, valueBefore, valueAfter;
      if (beforeEntries[i] !== undefined) ([field, valueBefore] = beforeEntries[i]);
      if (afterEntries[i] !== undefined) ([field, valueAfter] = afterEntries[i]);

      const auditLogFieldLabels = { ...userFieldLabels, ...paramsFieldLabels };
      rows.push({
        ...(field && { id: i, field: auditLogFieldLabels[field as keyof typeof auditLogFieldLabels] }),
        ...(valueBefore !== undefined && { valueBefore }),
        ...(valueAfter !== undefined && { valueAfter })
      });
    }

    return rows;
  })(before, after);

  const columns: GridColDef[] = [
    {
      field: 'field',
      headerName: 'Field',
      width: 120
    },
    {
      field: 'valueBefore',
      headerName: 'Before',
      flex: 1,
      valueGetter: detailDataGridValueGetter,
      renderCell: detailDataGridRenderCell
    },
    {
      field: 'valueAfter',
      headerName: 'After',
      flex: 1,
      valueGetter: detailDataGridValueGetter,
      renderCell: detailDataGridRenderCell
    }
  ];

  return (
    <DataGrid
      rows={rows!}
      columns={columns}
      hideFooter
    />
  );
};

export {
  AuditLogDetailsDataGrid
};