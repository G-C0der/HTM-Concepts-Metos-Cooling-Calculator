import React, {useEffect, useState} from 'react';
import {KettleEntity} from "../../entities/KettleEntity";
import {FormControl, IconButton, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {KettleSizeLitres} from "../../enums/KettleSizeLitres";
import {getEnumNumericValues} from "../../utils/enum";
import CloseIcon from '@mui/icons-material/Close';

interface KettleProps {
  kettleEntity: KettleEntity;
  number: number;
  handleKettleDeleteClick: (kettleNr: number) => void;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  maxWidth: 200
}));

export const Kettle = ({ kettleEntity, number, handleKettleDeleteClick }: KettleProps) => {
  const [sizeLitres, setSizeLitres] = useState<KettleSizeLitres>(KettleSizeLitres.KettleSizeLitres200);
  const [foodLitres, setFoodLitres] = useState(0);

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

  return (
    <Container>
      <Typography sx={{ mt: 4, mb: -2, pt: 2, pl: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        Kettle {number}
      </Typography>

      <IconButton sx={{ mt: -9, ml: 24 }} onClick={() => handleKettleDeleteClick(number)}>
        <CloseIcon />
      </IconButton>

      <FormControl>
        <InputLabel>Grösse</InputLabel>
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

        <TextField
          style={{ width: "200px", margin: "5px" }}
          value={foodLitres}
          error={foodLitres > sizeLitres/* || /[0-9]/.test(foodLitres.toString())*/}
          type="number"
          inputProps={{ type: 'number' }}
          label="Essen Liter"
          variant="outlined"
          onChange={handleKettleFoodLitresChange}
        />
      </FormControl>
    </Container>
  );
};