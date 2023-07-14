import React from "react";
import {GridRenderCellParams, GridValueGetterParams} from "@mui/x-data-grid";
import {getName} from "country-list";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import moment from "moment/moment";

const userDetailDataGridValueGetter = ({ row, value }: GridValueGetterParams) => {
  if (value === undefined) return;

  switch (row.field) {
    case 'Country':
      return getName(value);
    case 'Created at':
    case 'Updated at':
      return moment(value).format('DD.MM.YYYY HH:mm:ss');
    default:
      return value;
  }
};

const userDetailDataGridRenderCell = ({ row, value }: GridRenderCellParams) => {
  switch (row.field) {
    case 'Verified':
    case 'Active':
    case 'Admin':
      return (
        value ? <CheckCircleIcon color="success" /> : (value === false) && <CancelIcon color="error" />
      );
  }
};

export {
  userDetailDataGridValueGetter,
  userDetailDataGridRenderCell
};