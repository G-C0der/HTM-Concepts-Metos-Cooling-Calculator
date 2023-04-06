import React from 'react';
import {Avatar, Card, CardContent, Chip, Grid, Tooltip} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Co2Icon from '@mui/icons-material/Co2';
import WaterIcon from '@mui/icons-material/Water';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import Typography from "@mui/material/Typography";
import {ConsumptionResult} from "./types";
import {round} from "../../utils/math";

interface ResultDisplayProps {
  consumptionResult: ConsumptionResult
}

export const ConsumptionDisplay = ({
  consumptionResult: {
    waterConsumption,
    electricityConsumption,
    totalConsumption,
    waterLitresUsed,
    powerKWUsed,
    foodLitresTotal
  }
}: ResultDisplayProps) => {
  return (
    <Grid container gap={14}>
      <Grid item xs={4} md={3}>
        <Card sx={{ maxWidth: 350, minHeight: 192.3 }}>
          <CardContent>
            <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
              Water C2
            </Typography>

            <Grid
              container
              spacing={2}
              justifyContent='center'
            >
              <Grid item>
                <Tooltip title='Cost'>
                  <Chip
                    avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                    label={`${round(waterConsumption.costCHF)} CHF`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title='CO2'>
                  <Chip
                    avatar={<Avatar><Co2Icon /></Avatar>}
                    label={`${round(waterConsumption.co2Grams)} grams`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={1} md={3}>
        <Card sx={{ maxWidth: 350, minHeight: 192.3 }}>
          <CardContent>
            <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
              Electricity C3
            </Typography>

            <Grid
              container
              spacing={2}
              justifyContent='center'
            >
              <Grid item>
                <Tooltip title='Cost'>
                  <Chip
                    avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                    label={`${round(electricityConsumption.costCHF)} CHF`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title='CO2'>
                  <Chip
                    avatar={<Avatar><Co2Icon /></Avatar>}
                    label={`${round(electricityConsumption.co2Grams)} grams`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={8} md={4}>
        <Card sx={{ maxWidth: 430 }}>
          <CardContent>
            <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
              Total
            </Typography>

            <Grid
              container
              spacing={16}
              justifyContent='center'
              sx={{ mt: -22, mb: 1 }}
            >
              <Grid item>
                <Tooltip title='Water'>
                  <Chip
                    avatar={<Avatar><WaterIcon /></Avatar>}
                    label={`${round(waterLitresUsed)} litres`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title='Electricity'>
                  <Chip
                    avatar={<Avatar><ElectricBoltIcon /></Avatar>}
                    label={`${round(powerKWUsed)} kW`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>
            </Grid>

            <Tooltip title='Food'>
              <Chip
                avatar={<Avatar><SoupKitchenIcon /></Avatar>}
                label={`${round(foodLitresTotal)} kg food`}
                variant='outlined'
              />
            </Tooltip>

            <Grid
              container
              spacing={14}
              justifyContent='center'
            >
              <Grid item>
                <Tooltip title='Cost'>
                  <Chip
                    avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                    label={`${round(totalConsumption.costCHF)} CHF`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title='CO2'>
                  <Chip
                    avatar={<Avatar><Co2Icon /></Avatar>}
                    label={`${round(totalConsumption.co2Grams)} grams`}
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};