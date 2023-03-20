import React, {useEffect, useState} from 'react';
import {CauldronEntity} from "../../entities/CauldronEntity";
import {FormControl, IconButton, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {CauldronSizeLitres} from "../../enums/CauldronSizeLitres";
import {getEnumNumericValues} from "../../utils/enum";
import CloseIcon from '@mui/icons-material/Close';

interface CauldronProps {
  cauldronEntity: CauldronEntity;
  number: number;
  handleCauldronDeleteClick: (cauldronNr: number) => void;
}

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '0 35px 10px 10px',
  maxWidth: 200
}));

export const Cauldron = ({ cauldronEntity, number, handleCauldronDeleteClick }: CauldronProps) => {
  const [sizeLitres, setSizeLitres] = useState<CauldronSizeLitres>(CauldronSizeLitres.CauldronSizeLitres200);
  const [foodLitres, setFoodLitres] = useState(0);

  useEffect(() => {
    setSizeLitres(cauldronEntity.sizeLitres);
    setFoodLitres(cauldronEntity.foodLitres);
  });

  const handleCauldronSizeChange = (e: any) => {
    const sizeLitres = +e.target.value;
    setSizeLitres(sizeLitres);
    cauldronEntity.sizeLitres = sizeLitres;
  };

  const handleCauldronFoodLitresChange = (e: any) => {
    const foodLitres = +e.target.value;
    setFoodLitres(foodLitres);
    cauldronEntity.foodLitres = foodLitres;
  };

  return (
    <Container>
      <Typography sx={{ mt: 4, mb: -2, pt: 2, pl: 2 }} variant="h6" component="div" style={{ color: "black" }}>
        Cauldron {number}
      </Typography>

      <IconButton sx={{ mt: -9, ml: 24 }} onClick={() => handleCauldronDeleteClick(number)}>
        <CloseIcon />
      </IconButton>

      <FormControl>
        <InputLabel>Grösse</InputLabel>
        <Select
          style={{ width: "200px", margin: "5px" }}
          value={sizeLitres}
          label="Grösse"
          onChange={handleCauldronSizeChange}
        >
          {getEnumNumericValues(CauldronSizeLitres).map((cauldronSize: CauldronSizeLitres) => {
            return (
              <MenuItem value={cauldronSize} key={cauldronSize}>{cauldronSize}</MenuItem>
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
          onChange={handleCauldronFoodLitresChange}
        />
      </FormControl>
    </Container>
  );
};