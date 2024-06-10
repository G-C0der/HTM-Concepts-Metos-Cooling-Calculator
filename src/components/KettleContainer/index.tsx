import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Kettle} from "../KettleForm";
import {KettleEntity} from "../../entities";
import {User} from "../../types";

interface KettleContainerProps {
  kettleEntities: KettleEntity[];
  handleKettleDeleteClick: (kettleNr: number) => void;
  setKettleEntities: React.Dispatch<React.SetStateAction<KettleEntity[]>>;
  user: User;
}

export function KettleContainer({ kettleEntities, handleKettleDeleteClick, setKettleEntities, user }: KettleContainerProps) {
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
          <Kettle
            kettleEntity={kettleEntity}
            number={kettleNr}
            handleKettleDeleteClick={handleKettleDeleteClick}
            setKettleEntities={setKettleEntities}
            user={user}
          />
        </Grid>
      ))}
    </Box>
  );
}
