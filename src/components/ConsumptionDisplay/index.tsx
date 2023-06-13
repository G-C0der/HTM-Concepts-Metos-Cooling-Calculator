import React from 'react';
import {Avatar, Box, Card, CardContent, Chip, Grid, Tooltip} from "@mui/material";
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
    <Box style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingTop: '20px',
      gap: '20px'
    }}>
      <Card sx={{ maxWidth: 350, minHeight: 192.3 }}>
        <CardContent>
          <Typography sx={{ mt: 2, mb: -1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
            Water C2
          </Typography>

          <Tooltip title='Water'>
            <Chip
              avatar={<Avatar><WaterIcon /></Avatar>}
              label={`${round(waterLitresUsed)} litres`}
              variant='outlined'
            />
          </Tooltip>

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

      <Card sx={{ maxWidth: 350, minHeight: 192.3 }}>
        <CardContent>
          <Typography sx={{ mt: 2, mb: -1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
            Electricity C3
          </Typography>

          <Tooltip title='Electricity'>
            <Chip
              avatar={<Avatar><ElectricBoltIcon /></Avatar>}
              label={`${round(powerKWUsed)} kW`}
              variant='outlined'
            />
          </Tooltip>

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
    </Box>
  );
};