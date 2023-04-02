import React, {useEffect, useState} from 'react';
import {KettleEntity, TimeUsageRow} from "../../entities/KettleEntity";
import {Card, CardContent, FormControl, IconButton, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {KettleSizeLitres} from "../../enums/KettleSizeLitres";
import {getEnumNumericValues, getEnumValues} from "../../utils/enum";
import CloseIcon from '@mui/icons-material/Close';
import {KettleCoolingModes} from "../../enums/KettleCoolingModes";
import Box from "@mui/material/Box";
import {KettleTimeUsageDataGrid} from "../KettleTimeUsageDataGrid";
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";

interface KettleProps {
  kettleEntity: KettleEntity;
  number: number;
  handleKettleDeleteClick: (kettleNr: number) => void;
}

export const Kettle = ({ kettleEntity, number, handleKettleDeleteClick }: KettleProps) => {
  const [sizeLitres, setSizeLitres] = useState<KettleSizeLitres>(KettleSizeLitres.KettleSizeLitres200);
  const [coolingMode, setCoolingMode] = useState<KettleCoolingModes>(KettleCoolingModes.C2);
  const [timeUsageRows, setTimeUsageRows] = useState<TimeUsageRow[]>(kettleEntity.timeUsageRows);
  const [c3CoolingPercent, setC3CoolingPercent] = useState<number>(IceWaterCoolingEntity.maxC5iCoolingPercent);

  useEffect(() => {
    setSizeLitres(kettleEntity.getSizeLitres);
    setCoolingMode(kettleEntity.getCoolingMode);
    setTimeUsageRows(kettleEntity.timeUsageRows);
    setC3CoolingPercent(kettleEntity.getC3CoolingPercent());
  });

  const handleKettleSizeChange = (e: any) => {
    const sizeLitres = +e.target.value;
    setSizeLitres(sizeLitres);
    kettleEntity.setSizeLitres(sizeLitres);
  };

  const handleKettleCoolingModeChange = (e: any) => {
    const coolingMode = e.target.value;
    setCoolingMode(coolingMode);
    kettleEntity.setCoolingMode(coolingMode);
  };

  const handleC3CoolingPercentChange = (e: any) => {
    const c3CoolingPercent = +e.target.value;
    setC3CoolingPercent(c3CoolingPercent);
    kettleEntity.setCoolingPercent(c3CoolingPercent);
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography sx={{ mt: 0.5, mb: -2 }} variant="h6" component="div" style={{ color: "black" }}>
            Kettle {number}
          </Typography>

          <IconButton sx={{ mt: -9, ml: 22.5 }} onClick={() => handleKettleDeleteClick(number)}>
            <CloseIcon />
          </IconButton>

          <Box sx={{ height: 195 }}>
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

            {
              coolingMode === KettleCoolingModes.C5i &&
              <TextField
                style={{ width: "200px", margin: "5px" }}
                value={c3CoolingPercent}
                error={
                  c3CoolingPercent > 100
                  || c3CoolingPercent < 50
                }
                type="number"
                inputProps={{ type: 'number' }}
                label="C3 Cooling %"
                variant="outlined"
                onChange={handleC3CoolingPercentChange}
              />
            }
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 1.3, ml: 2.4 }}>
        <KettleTimeUsageDataGrid
          kettleEntity={kettleEntity}
          rows={timeUsageRows}
          setRows={setTimeUsageRows}
        />
      </Box>
    </Box>
  );
};