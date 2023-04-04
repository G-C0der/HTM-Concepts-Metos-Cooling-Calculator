import React, {useEffect, useState} from 'react';
import {KettleEntity, TimeUsageRow} from "../../entities/KettleEntity";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField, Tooltip
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {KettleSizeLitres} from "../../enums/KettleSizeLitres";
import {getEnumNumericValues, getEnumValues} from "../../utils/enum";
import CloseIcon from '@mui/icons-material/Close';
import {KettleCoolingModes} from "../../enums/KettleCoolingModes";
import Box from "@mui/material/Box";
import {KettleTimeUsageDataGrid} from "../KettleTimeUsageDataGrid";
import {IceWaterCoolingEntity} from "../../entities/IceWaterCoolingEntity";
import ClearAllIcon from '@mui/icons-material/ClearAll';

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

  const handleClearUsagesClick = () => {
    const clearedTimeUsageRows = kettleEntity.timeUsageRows.map((row: TimeUsageRow) => ({ ...row, foodLitres: 0 }));
    kettleEntity.timeUsageRows = clearedTimeUsageRows;
    setTimeUsageRows(clearedTimeUsageRows);
  };

  return (
    <Box>
      <Card sx={{ width: 220 }}>
        <CardContent>
          <Typography sx={{ mt: 0.5, mb: -2 }} variant="h6" component="div" style={{ color: "black" }}>
            Kettle {number}
          </Typography>

          <IconButton sx={{ mt: -9, ml: 20.1 }} onClick={() => handleKettleDeleteClick(number)}>
            <CloseIcon />
          </IconButton>

          <Box sx={{ height: 205 }}>
            <FormControl>
              <InputLabel className='form-input-label'>Size</InputLabel>
              <Select
                style={{ width: "178px", margin: "5px" }}
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
                style={{ width: "178px", margin: "5px" }}
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
                style={{ width: "178px", margin: "5px" }}
                value={c3CoolingPercent}
                error={
                  c3CoolingPercent > IceWaterCoolingEntity.maxC5iCoolingPercent
                  || c3CoolingPercent < IceWaterCoolingEntity.minC5iCoolingPercent
                }
                type="number"
                inputProps={{ type: 'number' }}
                label="C3 Cooling %"
                variant="outlined"
                onChange={handleC3CoolingPercentChange}
              />
            }
          </Box>

          <Tooltip title='clear usages'>
            <Button
              style={{
                padding: '0 0 0 0'
              }}
              variant="outlined"
              onClick={handleClearUsagesClick}
            ><ClearAllIcon /></Button>
          </Tooltip>
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