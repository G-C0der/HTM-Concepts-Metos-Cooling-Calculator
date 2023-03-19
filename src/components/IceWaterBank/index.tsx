import React from 'react';
import {IceWaterBankEntity} from "../../entities/IceWaterBankEntity";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

interface IceBankProps {
  iceWaterBankEntity: IceWaterBankEntity;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  width: 1881,
  height: 180
}));

export const IceBank = ({ iceWaterBankEntity }: IceBankProps) => {
  const handleKwHourChange = (e: any) => {
    const kwHour = +e.target.value;
    iceWaterBankEntity.kwHour = kwHour;
  };

  const handleKwHourCostChange = (e: any) => {
    const kwHourCHF = +e.target.value;
    iceWaterBankEntity.kwHourCHF = kwHourCHF;
  };

  const handleKwHourCo2Change = (e: any) => {
    const kwHourCo2 = +e.target.value;
    iceWaterBankEntity.kwHourCo2 = kwHourCo2;
  };

  return (
    <Container>
      <Typography sx={{ mt: 4, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        Eiswasserbank
      </Typography>

      <FormControl sx={{ width: 1500 }}>
        <Grid container sx={{ gap: 1, ml: 14 }}>
          <Grid item xs={12} md={2}>
            <TextField
              disabled
              style={{ width: "200px", margin: "5px" }}
              type="number"
              inputProps={{ type: 'number' }}
              label="Nachladegeschwindigkeit kw/h"
              variant="outlined"
              value={IceWaterBankEntity.rechargeRateKwPerHour}
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
          {/*<Grid item xs={12} md={2}>*/}
          {/*  <TextField*/}
          {/*    disabled*/}
          {/*    style={{ width: "200px", margin: "5px" }}*/}
          {/*    type="number"*/}
          {/*    inputProps={{ type: 'number' }}*/}
          {/*    label="Leistung"*/}
          {/*    variant="outlined"*/}
          {/*    value={iceWaterBankEntity.kw}*/}
          {/*  />*/}
          {/*</Grid>*/}

          <Grid item xs={12} md={2}>
            <TextField
              disabled
              style={{ width: "200px", margin: "5px" }}
              type="number"
              inputProps={{ type: 'number' }}
              label="Eis kg"
              variant="outlined"
              value={iceWaterBankEntity.iceKg}
            />
          </Grid>
        </Grid>
      </FormControl>
    </Container>
  );
};