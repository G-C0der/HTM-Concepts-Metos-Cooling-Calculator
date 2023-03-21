import React from 'react';
import {TapWaterCoolingEntity} from "../../entities/TapWaterCoolingEntity";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface WaterFormProps {
  tapWaterCoolingEntity: TapWaterCoolingEntity;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  maxWidth: 185,
  height: 210
}));

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
    <Container>
      <Typography sx={{ mt: 2, mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
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
    </Container>
  );
}