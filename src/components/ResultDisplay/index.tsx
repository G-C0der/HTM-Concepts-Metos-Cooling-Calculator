import React from 'react';
import {Avatar, Box, Card, CardContent, Chip, Grid} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Co2Icon from '@mui/icons-material/Co2';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Typography from "@mui/material/Typography";
import {Result, TotalResult} from "./types";
import {round} from "../../utils/math";

interface ResultDisplayProps {
  waterResult: Result;
  electricityResult: Result;
  totalResult: TotalResult;
}

export const ResultDisplay = ({ waterResult, electricityResult, totalResult }: ResultDisplayProps) => {
  return (
    <Box sx={{ minWidth: 1220 }}>
      <Grid container spacing={1}>
        <Grid
          item
          container
          xs={4}
          md={3}
          alignItems='center'
        >
          <Card>
            <CardContent>
              <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
                Water
              </Typography>

              <Grid container spacing={2}>
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

        <Grid
          item
          container
          xs={4}
          md={9}
          alignItems='center'
          sx={{ml: -9}}
        >
          <Card>
            <CardContent>
              <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
                Electricity
              </Typography>

              <Grid container spacing={2}>
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

        <Grid
          item
          container
          xs={8}
          md={5}
          alignItems='center'
          justifyContent='center'
          sx={{ ml: -2 }}
        >
          <Card>
            <CardContent>
              <Typography sx={{ mt: 2, mb: 1, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
                Total
              </Typography>

              <Grid container spacing={2}>
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
      </Grid>
    </Box>
  );
};