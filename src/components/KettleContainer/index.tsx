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
      <Box style={{
        display: 'flex',
        gap: '20px',
        flexGrow: 1, 
        minHeight: 700
      }}>
        {kettleEntities.map(kettleEntity => (
          <Grid item xs={12} md={2} key={kettleNr++} >
            <Kettle kettleEntity={kettleEntity} number={kettleNr} handleKettleDeleteClick={handleKettleDeleteClick} />
          </Grid>
        ))}
      </Box>
  );
}