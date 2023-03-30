import React from 'react';
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface ElectricityFormProps {
  iceWaterCoolingEntity: IceWaterCoolingEntity;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  width: 185,
  height: 210
}));

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
    <Container>
      <Typography sx={{ mt: 2, mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
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
    </Container>
  );
};