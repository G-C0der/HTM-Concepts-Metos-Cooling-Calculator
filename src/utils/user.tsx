import React from "react";
import {GridRenderCellParams, GridValueGetterParams} from "@mui/x-data-grid";
import {getName} from "country-list";
import moment from "moment/moment";
import {BooleanIcon} from "../components/BooleanIcon";

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
        <BooleanIcon value={value} />
      );
  }
};

export {
  userDetailDataGridValueGetter,
  userDetailDataGridRenderCell
};