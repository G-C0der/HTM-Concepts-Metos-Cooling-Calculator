import React from 'react';
import {
  DataProvider,
  iceWaterBankFields,
  tapWaterBankFields,
  IceWaterBankMeasurements,
  TapWaterBankMeasurements, FIELD_TIME_MIN, TapWaterBankField, IceWaterBankField
} from "../../services/DataProvider";
import {styled} from "@mui/material/styles";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";

interface MeasurementsGridProps {
  measurements: TapWaterBankMeasurements | IceWaterBankMeasurements;
  title: string;
  width: number;
}

const getFields = (measurements: TapWaterBankMeasurements | IceWaterBankMeasurements) => {
  let fields: TapWaterBankField[] | IceWaterBankField[] = [];
  
  if (DataProvider.isATapWaterBankMeasurement(measurements)) fields = tapWaterBankFields;
  if (DataProvider.isAnIceWaterBankMeasurement(measurements)) fields = iceWaterBankFields;
  console.log('fields', fields)
  console.log('measurements', measurements)

  return fields;
};

export const MeasurementsGrid = ({ measurements, title, width }: MeasurementsGridProps) => {
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
              >
                {fields.map(field => (
                  <TableCell align="right" key={field}>{/*(field in row) && */row[field]}</TableCell> // TODO: remove row any type and check why this is not working
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};