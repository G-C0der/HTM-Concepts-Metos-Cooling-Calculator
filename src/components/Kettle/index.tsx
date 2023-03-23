import React, {useEffect, useState} from 'react';
import {KettleEntity} from "../../entities/KettleEntity";
import {FormControl, IconButton, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {KettleSizeLitres} from "../../enums/KettleSizeLitres";
import {getEnumNumericValues, getEnumValues} from "../../utils/enum";
import CloseIcon from '@mui/icons-material/Close';
import {KettleCoolingModes} from "../../enums/KettleCoolingModes";
import {UpwardCollapse} from "../UpwardCollapse";
import Box from "@mui/material/Box";
import {KettleTimeFoodLitresDataGrid} from "../KettleTimeFoodLitresDataGrid";

interface KettleProps {
  kettleEntity: KettleEntity;
  number: number;
  handleKettleDeleteClick: (kettleNr: number) => void;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  maxWidth: 185
}));

export const Kettle = ({ kettleEntity, number, handleKettleDeleteClick }: KettleProps) => {
  const [sizeLitres, setSizeLitres] = useState<KettleSizeLitres>(KettleSizeLitres.KettleSizeLitres200);
  const [foodLitres, setFoodLitres] = useState(0);
  const [coolingMode, setCoolingMode] = useState<KettleCoolingModes>(KettleCoolingModes.C2);

  useEffect(() => {
    setSizeLitres(kettleEntity.sizeLitres);
    setFoodLitres(kettleEntity.foodLitres);
  });

  const handleKettleSizeChange = (e: any) => {
    const sizeLitres = +e.target.value;
    setSizeLitres(sizeLitres);
    kettleEntity.sizeLitres = sizeLitres;
  };

  const handleKettleFoodLitresChange = (e: any) => {
    const foodLitres = +e.target.value;
    setFoodLitres(foodLitres);
    kettleEntity.foodLitres = foodLitres;
  };

  const handleKettleCoolingModeChange = (e: any) => {
    const coolingMode = e.target.value;
    setCoolingMode(coolingMode);
    kettleEntity.coolingMode = coolingMode;
  };

  return (
    <Container>
      <Typography sx={{ mt: 4, mb: -2, pt: 2, pl: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        Kettle {number}
      </Typography>

      <IconButton sx={{ mt: -9, ml: 22.5 }} onClick={() => handleKettleDeleteClick(number)}>
        <CloseIcon />
      </IconButton>

      <FormControl>
        <InputLabel className='form-input-label'>Size</InputLabel>
        <Select
          style={{ width: "200px", margin: "5px" }}
          value={sizeLitres}
          label="Grösse"
          onChange={handleKettleSizeChange}
        >
          {getEnumNumericValues(KettleSizeLitres).map((kettleSize: KettleSizeLitres) => {
            return (
              <MenuItem value={kettleSize} key={kettleSize}>{kettleSize}</MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel className='form-input-label'>Cooling Mode</InputLabel>
        <Select
          style={{ width: "200px", margin: "5px" }}
          value={coolingMode}
          label="Cooling Mode"
          onChange={handleKettleCoolingModeChange}
        >
          {getEnumValues(KettleCoolingModes).map((coolingMode: KettleCoolingModes) => {
            return (
              <MenuItem value={coolingMode} key={coolingMode}>{coolingMode}</MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Box sx={{ ml: 3 }}>
        <UpwardCollapse switchLabelText='Show Usages'>
          <KettleTimeFoodLitresDataGrid kettleEntity={kettleEntity} />
        </UpwardCollapse>
      </Box>
    </Container>
  );
};