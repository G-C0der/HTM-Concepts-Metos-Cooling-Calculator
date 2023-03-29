import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Kettle} from "../Kettle";
import {KettleEntity} from "../../entities/KettleEntity";

interface KettleContainerProps {
  kettleEntities: KettleEntity[];
  handleKettleDeleteClick: (kettleNr: number) => void;
}

export function KettleContainer({ kettleEntities, handleKettleDeleteClick }: KettleContainerProps) {
  let kettleNr = 1;

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1600, minWidth: 1600, minHeight: 700 }}>
      <Grid container spacing={1}>
        {kettleEntities.map(kettleEntity => (
          <Grid item xs={12} md={2} key={kettleNr++} >
            <Kettle kettleEntity={kettleEntity} number={kettleNr} handleKettleDeleteClick={handleKettleDeleteClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}