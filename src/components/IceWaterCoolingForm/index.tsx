import React, {useState} from 'react';
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";
import {styled} from "@mui/material/styles";
import {IceWaterCoolingCount} from "../../enums/IceWaterCoolingCount";

interface IceWaterCoolingFormProps {
  iceWaterCoolingEntity: IceWaterCoolingEntity;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  maxWidth: 185,
  height: 210
}));

export const IceWaterCoolingForm = ({ iceWaterCoolingEntity }: IceWaterCoolingFormProps) => {
  const [type1Count, setType1Count] = useState<IceWaterCoolingCount>(IceWaterCoolingCount.IceWaterCoolingCount0);
  const [type4Count, setType4Count] = useState<IceWaterCoolingCount>(IceWaterCoolingCount.IceWaterCoolingCount0);

  const handleType1CountChange = (e: any) => {
    const type1Count = e.target.value;
    setType1Count(type1Count);
    iceWaterCoolingEntity.type1Count = type1Count;
  };

  const handleType4CountChange = (e: any) => {
    const type4Count = e.target.value;
    setType4Count(type4Count);
    iceWaterCoolingEntity.type4Count = type4Count;
  };

  return (
    <Container>
      <Typography sx={{ mt: 2, mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        Ice Water Cooling
      </Typography>

      <TextField
        style={{ width: "200px", margin: "5px" }}
        value={type1Count}
        error={
          type1Count > IceWaterCoolingCount.IceWaterCoolingCount4
          || type1Count < IceWaterCoolingCount.IceWaterCoolingCount0
        }
        type="number"
        inputProps={{ type: 'number' }}
        label="Type 1 Count"
        variant="outlined"
        onChange={handleType1CountChange}
      />

      <TextField
        style={{ width: "200px", margin: "5px" }}
        value={type4Count}
        error={
          type4Count > IceWaterCoolingCount.IceWaterCoolingCount4
          || type4Count < IceWaterCoolingCount.IceWaterCoolingCount0
        }
        type="number"
        inputProps={{ type: 'number' }}
        label="Type 4 Count"
        variant="outlined"
        onChange={handleType4CountChange}
      />
    </Container>
  );
};