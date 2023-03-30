import React from 'react';
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";
import Typography from "@mui/material/Typography";
import {Card, CardContent, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface ElectricityFormProps {
  iceWaterCoolingEntity: IceWaterCoolingEntity;
}

export const ElectricityForm = ({ iceWaterCoolingEntity }: ElectricityFormProps) => {
  const handleKwHourCostChange = (e: any) => {
    const kwHourCHF = +e.target.value;
    iceWaterCoolingEntity.kwHourCHF = kwHourCHF;
  };

  const handleKwHourCo2Change = (e: any) => {
    const kwHourCo2 = +e.target.value;
    iceWaterCoolingEntity.kwHourCo2 = kwHourCo2;
  };

  return (
    <Card sx={{ height: 235, width: 240 }}>
      <CardContent>
        <Typography sx={{ mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
          Electricity
        </Typography>

        <Grid container sx={{ gap: 0, ml: 0 }}>
          <Grid item xs={12} md={10}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="CHF/kWh"
              variant="outlined"
              onChange={handleKwHourCostChange}
            />
          </Grid>

          <Grid item xs={12} md={10}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="Co2/kWh"
              variant="outlined"
              onChange={handleKwHourCo2Change}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};