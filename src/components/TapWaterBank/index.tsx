import React from 'react';
import {TapWaterBankEntity} from "../../entities/TapWaterBankEntity";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface WaterBankProps {
  tapWaterBankEntity: TapWaterBankEntity;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  width: 1881,
  height: 180
}));

export const WaterBank = ({ tapWaterBankEntity }: WaterBankProps) => {
  const handleWaterLitreCostChange = (e: any) => {
    const waterLitreCHF = +e.target.value;
    tapWaterBankEntity.waterLitreCHF = waterLitreCHF;
  };

  const handleWaterLitreCo2Change = (e: any) => {
    const waterLitreCo2 = +e.target.value;
    tapWaterBankEntity.waterLitreCo2 = waterLitreCo2;
  };

  return (
    <Container>
      <Typography sx={{ mt: 4, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        Frischwasserbank
      </Typography>

      <FormControl>
        <Grid container sx={{ gap: 13, ml: 13 }}>
          <Grid item xs={12} md={2}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="CHF/Liter"
              variant="outlined"
              onChange={handleWaterLitreCostChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              style={{ width: "200px", margin: "5px" }}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="Co2/Liter"
              variant="outlined"
              onChange={handleWaterLitreCo2Change}
            />
          </Grid>
        </Grid>
      </FormControl>
    </Container>
  );
}