import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Cauldron} from "../Cauldron";
import {CauldronEntity} from "../../entities/CauldronEntity";

interface CauldronContainerProps {
  cauldronEntities: CauldronEntity[];
  handleCauldronDeleteClick: (cauldronNr: number) => void;
}

export function CauldronContainer({ cauldronEntities, handleCauldronDeleteClick }: CauldronContainerProps) {
  let cauldronNr = 1;

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 2000, minWidth: 2000, margin: '0 0 35px 74px' }}>
      <Grid container spacing={2}>
        {cauldronEntities.map(cauldronEntity => {
          return (
            <Grid item xs={12} md={2} key={cauldronNr++} >
              <Cauldron cauldronEntity={cauldronEntity} number={cauldronNr} handleCauldronDeleteClick={handleCauldronDeleteClick} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}