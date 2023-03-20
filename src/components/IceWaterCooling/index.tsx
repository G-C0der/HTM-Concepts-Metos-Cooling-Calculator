import React from 'react';
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface IceWaterCoolingProps {
  iceWaterCoolingEntity: IceWaterCoolingEntity;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  width: 1881,
  height: 180
}));

export const IceCooling = ({ iceWaterCoolingEntity }: IceWaterCoolingProps) => {
  const handleKwHourChange = (e: any) => {
    const kwHour = +e.target.value;
    iceWaterCoolingEntity.kwHour = kwHour;
  };

  const handleKwHourCostChange = (e: any) => {
    const kwHourCHF = +e.target.value;
    iceWaterCoolingEntity.kwHourCHF = kwHourCHF;
  };

  const handleKwHourCo2Change = (e: any) => {
    const kwHourCo2 = +e.target.value;
    iceWaterCoolingEntity.kwHourCo2 = kwHourCo2;
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography sx={{ mt: 4, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        Ice Water Cooling
      </Typography>

      <FormControl sx={{ width: 1500 }}>
        <Grid container sx={{ gap: 1, ml: 46 }}>
          <Grid item xs={12} md={2}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="kw/h"
              variant="outlined"
              onChange={handleKwHourChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="CHF/kw/h"
              variant="outlined"
              onChange={handleKwHourCostChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="Co2/kw/h"
              variant="outlined"
              onChange={handleKwHourCo2Change}
            />
          </Grid>
        </Grid>
      </FormControl>
    </Container>
  );
};