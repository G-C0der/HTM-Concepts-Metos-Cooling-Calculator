import React from 'react';
import {Avatar, Card, CardContent, Chip, Grid} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Co2Icon from '@mui/icons-material/Co2';
import WaterIcon from '@mui/icons-material/Water';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import Typography from "@mui/material/Typography";
import {ConsumptionResult} from "./types";
import {round} from "../../utils/math";

interface ResultDisplayProps {
  consumptionResult: ConsumptionResult
}

export const ConsumptionDisplay = ({
  consumptionResult: { waterConsumption, electricityConsumption, totalConsumption, waterLitresUsed, powerKWUsed}
}: ResultDisplayProps) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={4} md={3}>
        <Card sx={{ maxWidth: 350 }}>
          <CardContent>
            <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
              Water
            </Typography>

            <Grid
              container
              spacing={2}
              justifyContent='center'
            >
              <Grid item>
                <Chip
                  avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                  label={`${round(waterConsumption.costCHF)} CHF`}
                  variant='outlined'
                />
              </Grid>

              <Grid item>
                <Chip
                  avatar={<Avatar><Co2Icon /></Avatar>}
                  label={`${round(waterConsumption.co2Grams)} grams`}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={1} md={3}>
        <Card sx={{ maxWidth: 350 }}>
          <CardContent>
            <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
              Electricity
            </Typography>

            <Grid
              container
              spacing={2}
              justifyContent='center'
            >
              <Grid item>
                <Chip
                  avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                  label={`${round(electricityConsumption.costCHF)} CHF`}
                  variant='outlined'
                />
              </Grid>

              <Grid item>
                <Chip
                  avatar={<Avatar><Co2Icon /></Avatar>}
                  label={`${round(electricityConsumption.co2Grams)} grams`}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={8} md={7}>
        <Card sx={{ maxWidth: 400, ml: 18.5 }}>
          <CardContent>
            <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
              Total
            </Typography>

            <Grid
              container
              spacing={16}
              justifyContent='center'
              sx={{ mt: -22, mb: 2 }}
            >
              <Grid item>
                <Chip
                  avatar={<Avatar><WaterIcon /></Avatar>}
                  label={`${round(waterLitresUsed)} litres`}
                  variant='outlined'
                />
              </Grid>

              <Grid item>
                <Chip
                  avatar={<Avatar><ElectricBoltIcon /></Avatar>}
                  label={`${round(powerKWUsed)} kW`}
                  variant='outlined'
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              justifyContent='center'
            >
              <Grid item>
                <Chip
                  avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                  label={`${round(totalConsumption.costCHF)} CHF`}
                  variant='outlined'
                />
              </Grid>

              <Grid item>
                <Chip
                  avatar={<Avatar><Co2Icon /></Avatar>}
                  label={`${round(totalConsumption.co2Grams)} grams`}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};