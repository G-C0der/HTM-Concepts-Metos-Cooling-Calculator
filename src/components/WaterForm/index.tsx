import React from 'react';
import {TapWaterCoolingEntity} from "../../entities/TapWaterCoolingEntity";
import Typography from "@mui/material/Typography";
import {Card, CardContent, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface WaterFormProps {
  tapWaterCoolingEntity: TapWaterCoolingEntity;
}

export const WaterForm = ({ tapWaterCoolingEntity }: WaterFormProps) => {
  const handleWaterLitreCostChange = (e: any) => {
    const waterLitreCHF = +e.target.value;
    tapWaterCoolingEntity.waterLitreCHF = waterLitreCHF;
  };

  const handleWaterLitreCo2Change = (e: any) => {
    const waterLitreCo2 = +e.target.value;
    tapWaterCoolingEntity.waterLitreCo2 = waterLitreCo2;
  };

  return (
    <Card sx={{ height: 235, width: 240 }}>
      <CardContent>
        <Typography sx={{ mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
          Water
        </Typography>

        <Grid container sx={{ gap: 0, ml: 0 }}>
          <Grid item xs={12} md={10}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="CHF/litres"
              variant="outlined"
              onChange={handleWaterLitreCostChange}
            />
          </Grid>

          <Grid item xs={12} md={10}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="Co2/litres"
              variant="outlined"
              onChange={handleWaterLitreCo2Change}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}