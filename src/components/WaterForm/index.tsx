import React from 'react';
import {TapWaterCoolingEntity} from "../../entities/TapWaterCoolingEntity";
import Typography from "@mui/material/Typography";
import {Card, CardContent, TextField} from "@mui/material";

interface WaterFormProps {
  tapWaterCoolingEntity: TapWaterCoolingEntity;
  waterLitreCHF: number;
  setWaterLitreCHF: (waterLitreCHF: number) => void;
  waterLitreCO2: number;
  setWaterLitreCO2: (waterLitreCO2: number) => void;
}

export const WaterForm = ({
  tapWaterCoolingEntity,
  waterLitreCHF,
  setWaterLitreCHF,
  waterLitreCO2,
  setWaterLitreCO2
}: WaterFormProps) => {
  const handleWaterLitreCostChange = (e: any) => {
    const waterLitreCHF = +e.target.value;
    setWaterLitreCHF(waterLitreCHF);
    tapWaterCoolingEntity.waterLitreCHF = waterLitreCHF;
  };

  const handleWaterLitreCo2Change = (e: any) => {
    const waterLitreCO2 = +e.target.value;
    setWaterLitreCO2(waterLitreCO2);
    tapWaterCoolingEntity.waterLitreCo2 = waterLitreCO2;
  };

  return (
    <Card sx={{ height: 235, width: 240 }}>
      <CardContent>
        <Typography sx={{ mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
          Water C2
        </Typography>

        <div>
          <div>
            <TextField
              style={{ margin: "5px" }}
              value={waterLitreCHF}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label="CHF/litres"
              variant="outlined"
              onChange={handleWaterLitreCostChange}
            />
          </div>

          <div>
            <TextField
              style={{ margin: "5px" }}
              value={waterLitreCO2}
              // error={/* || /[0-9]/.test(foodLitres.toString())*/}
              type="number"
              inputProps={{ type: 'number' }}
              label={'CO2g/litres'}
              variant="outlined"
              onChange={handleWaterLitreCo2Change}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}