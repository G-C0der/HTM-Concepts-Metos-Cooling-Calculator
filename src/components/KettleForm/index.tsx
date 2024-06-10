import React, {useEffect, useState} from 'react';
import {KettleEntity, TimeUsageRow, IceWaterCoolingEntity} from "../../entities";
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
import {getEnumNumericValues, getEnumValues} from "../../utils";
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {KettleCoolingModes} from "../../enums/KettleCoolingModes";
import Box from "@mui/material/Box";
import {KettleTimeUsageDataGrid} from "../KettleTimeUsageDataGrid";
import {UserMode} from "../../enums/UserMode";
import {User} from "../../types";

interface KettleProps {
  kettleEntity: KettleEntity;
  number: number;
  handleKettleDeleteClick: (kettleNr: number) => void;
  setKettleEntities: React.Dispatch<React.SetStateAction<KettleEntity[]>>;
  user: User;
}

export const Kettle = ({ kettleEntity, number, handleKettleDeleteClick, setKettleEntities, user }: KettleProps) => {
  const [sizeLitres, setSizeLitres] = useState<KettleSizeLitres>(KettleSizeLitres.KettleSizeLitres200);
  const [coolingMode, setCoolingMode] = useState<KettleCoolingModes>(KettleCoolingModes.C2);
  const [timeUsageRows, setTimeUsageRows] = useState<TimeUsageRow[]>(kettleEntity.timeUsageRows);
  const [c3CoolingPercent, setC3CoolingPercent] = useState<number>(IceWaterCoolingEntity.maxC5iCoolingPercent);

  const kettleSizeLabel = user!.mode === UserMode.UserModeElro
    ? 'Size Kettle'
    : 'Size Proveno 4G';

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
    setKettleEntities(currentKettleEntities => [...currentKettleEntities]);
  };

  const handleKettleCoolingModeChange = (e: any) => {
    const coolingMode = e.target.value;
    setCoolingMode(coolingMode);
    kettleEntity.setCoolingMode(coolingMode);
    setKettleEntities(currentKettleEntities => [...currentKettleEntities]);
  };

  const handleC3CoolingPercentChange = (e: any) => {
    const c3CoolingPercent = +e.target.value;
    setC3CoolingPercent(c3CoolingPercent);
    kettleEntity.setCoolingPercent(c3CoolingPercent);
    setKettleEntities(currentKettleEntities => [...currentKettleEntities]);
  };

  const handleClearUsagesClick = () => {
    const clearedTimeUsageRows = kettleEntity.timeUsageRows.map((row: TimeUsageRow) => ({ ...row, foodLitres: 0 }));
    kettleEntity.timeUsageRows = clearedTimeUsageRows;
    setTimeUsageRows(clearedTimeUsageRows);
    setKettleEntities(currentKettleEntities => [...currentKettleEntities]);
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
              <InputLabel className='form-input-label'>{kettleSizeLabel}</InputLabel>
              <Select
                style={{ width: "178px", margin: "5px" }}
                value={sizeLitres}
                label={kettleSizeLabel}
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

          <Tooltip title='reset usages'>
            <Button
              style={{
                padding: '0 0 0 0'
              }}
              variant="outlined"
              onClick={handleClearUsagesClick}
            ><RestartAltIcon /></Button>
          </Tooltip>
        </CardContent>
      </Card>

      <Box sx={{ mt: 1.3, ml: 2.4 }}>
        <KettleTimeUsageDataGrid
          kettleEntity={kettleEntity}
          rows={timeUsageRows}
          setRows={setTimeUsageRows}
          setKettleEntities={setKettleEntities}
        />
      </Box>
    </Box>
  );
};
