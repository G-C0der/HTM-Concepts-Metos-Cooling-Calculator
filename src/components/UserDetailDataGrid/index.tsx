import React from 'react';
import {User} from "../../types";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {userFieldLabels} from "../../constants";
import {userDetailDataGridRenderCell, userDetailDataGridValueGetter} from "../../utils";

interface UserDetailDataGridProps {
  user: User;
}

const UserDetailDataGrid = ({ user }: UserDetailDataGridProps)  => {
  const rows = ((user: User) => {
    const rows = [];

    let i = 0;
    for (const [key, value] of Object.entries(user)) {
      if (userFieldLabels.hasOwnProperty(key)) rows.push({
        id: i++,
        field: userFieldLabels[key as keyof typeof userFieldLabels],
        value
      });
    }

    return rows;
  })(user);

  const columns: GridColDef[] = [
    {
      field: 'field',
      headerName: 'Field',
      width: 100
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 1,
      valueGetter: userDetailDataGridValueGetter,
      renderCell: userDetailDataGridRenderCell
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
  UserDetailDataGrid
};