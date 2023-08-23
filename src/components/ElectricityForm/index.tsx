import React from 'react';
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";
import Typography from "@mui/material/Typography";
import {Card, CardContent, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface ElectricityFormProps {
  iceWaterCoolingEntity: IceWaterCoolingEntity;
  kWhCHF: number;
  setKWhCHF: (kWhCHF: number) => void;
  kWhCO2: number;
  setKWhCO2: (kWhCO2: number) => void;
  cop: number;
  setCop: (cop: number) => void;
}

export const ElectricityForm = ({
  iceWaterCoolingEntity,
  kWhCHF,
  setKWhCHF,
  kWhCO2,
  setKWhCO2,
  cop,
  setCop
}: ElectricityFormProps) => {
  const handleKwHourCostChange = (e: any) => {
    const kwHourCHF = +e.target.value;
    setKWhCHF(kwHourCHF);
    iceWaterCoolingEntity.kwHourCHF = kwHourCHF;
  };

  const handleKwHourCo2Change = (e: any) => {
    const kwHourCo2 = +e.target.value;
    setKWhCO2(kwHourCo2);
    iceWaterCoolingEntity.kwHourCo2 = kwHourCo2;
  };

  const handleCopChange = (e: any) => {
    const cop = +e.target.value;
    setCop(cop);
    iceWaterCoolingEntity.setCop(cop);
  };

  return (
    <Card sx={{ height: 300, width: 240 }}>
      <CardContent>
        <Typography sx={{ mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
          Electricity C3
        </Typography>

        <Grid container sx={{ gap: 0, ml: 0 }}>
          <Grid item xs={12} md={10}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              value={kWhCHF}
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
              value={kWhCO2}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label={'CO2g/kW'}
              variant="outlined"
              onChange={handleKwHourCo2Change}
            />
          </Grid>

          <Grid item xs={12} md={10}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              value={cop}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label={'COP'}
              variant="outlined"
              onChange={handleCopChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};