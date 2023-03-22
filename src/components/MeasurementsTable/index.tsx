import React from 'react';
import {
  DataProvider,
  iceWaterCoolingFields,
  tapWaterCoolingFields,
  IceWaterCoolingMeasurements,
  TapWaterCoolingMeasurements, FIELD_TIME_MIN, TapWaterCoolingField, IceWaterCoolingField, DECIMALS
} from "../../services/DataProvider";
import {styled} from "@mui/material/styles";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import {round} from "../../utils/math";

interface MeasurementsTableProps {
  measurements: TapWaterCoolingMeasurements | IceWaterCoolingMeasurements;
  title: string;
  width: number;
}

const getFields = (measurements: TapWaterCoolingMeasurements | IceWaterCoolingMeasurements) => {
  let fields: TapWaterCoolingField[] | IceWaterCoolingField[] = [];
  
  if (DataProvider.isATapWaterCoolingMeasurement(measurements)) fields = tapWaterCoolingFields;
  if (DataProvider.isAnIceWaterCoolingMeasurement(measurements)) fields = iceWaterCoolingFields;

  return fields;
};

export const MeasurementsTable = ({ measurements, title, width }: MeasurementsTableProps) => {
  const Container = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width
  }));

  const fields = getFields(measurements);

  return (
    <Container sx={{ mb: 3 }}>
      <Typography sx={{ mt: 4, mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size='small'>
          <TableHead>
            <TableRow>
              {fields.map(field => (
                <TableCell align="right" key={field}>{field}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {measurements.map((row: any) => (
              <TableRow
                key={row[FIELD_TIME_MIN]}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
              >
                {fields.map(field => (
                  <TableCell sx={row.target ? { backgroundColor: '#ce8989' } : {}} align="right" key={field}>{/*(field in row) && */round(row[field], DECIMALS)}</TableCell> // TODO: remove row any type and check why this is not working
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};