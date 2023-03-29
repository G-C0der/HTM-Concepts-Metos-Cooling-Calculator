import React from 'react';
import {Avatar, Box, Card, CardContent, Chip, Grid} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Co2Icon from '@mui/icons-material/Co2';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Typography from "@mui/material/Typography";
import {Result, TotalResult} from "./types";
import {round} from "../../utils/math";

interface ResultDisplayProps {
  waterResult?: Result;
  electricityResult?: Result;
  totalResult?: TotalResult;
}

export const ResultDisplay = ({ waterResult, electricityResult, totalResult }: ResultDisplayProps) => {
  return (
    <Grid container spacing={1}>
      {
        waterResult &&
        <Grid item xs={4} md={3}>
          <Card sx={{ maxWidth: 350 }}>
            <CardContent>
              <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
                Water
              </Typography>

              <Grid container spacing={2} justifyContent='center'>
                <Grid item>
                  <Chip
                    avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                    label={`${round(waterResult.costCHF)} CHF`}
                    variant='outlined'
                  />
                </Grid>

                <Grid item>
                  <Chip
                    avatar={<Avatar><Co2Icon /></Avatar>}
                    label={`${round(waterResult.co2Grams)} g`}
                    variant='outlined'
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      }

      {
        electricityResult &&
        <Grid item xs={1} md={3}>
          <Card sx={{ maxWidth: 350 }}>
            <CardContent>
              <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
                Electricity
              </Typography>

              <Grid container spacing={2} justifyContent='center'>
                <Grid item>
                  <Chip
                    avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                    label={`${round(electricityResult.costCHF)} CHF`}
                    variant='outlined'
                  />
                </Grid>

                <Grid item>
                  <Chip
                    avatar={<Avatar><Co2Icon /></Avatar>}
                    label={`${round(electricityResult.co2Grams)} g`}
                    variant='outlined'
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      }

      {
        totalResult &&
        <Grid item xs={8} md={7}>
          <Card sx={{ maxWidth: 400, ml: 18.5 }}>
            <CardContent>
              <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
                Total
              </Typography>

              <Grid container spacing={2} justifyContent='center'>
                <Grid item>
                  <Chip
                    avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                    label={`${round(totalResult.costCHF)} CHF`}
                    variant='outlined'
                  />
                </Grid>

                <Grid item>
                  <Chip
                    avatar={<Avatar><Co2Icon /></Avatar>}
                    label={`${round(totalResult.co2Grams)} g`}
                    variant='outlined'
                  />
                </Grid>

                <Grid item>
                  <Chip
                    avatar={<Avatar><HourglassBottomIcon /></Avatar>}
                    label={`${totalResult.timeMin} min`}
                    variant='outlined'
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      }
    </Grid>
  );
};