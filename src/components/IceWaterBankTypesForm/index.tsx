import React, {useState} from 'react';
import {IceWaterCoolingEntity, TimePowerUsageRow} from "../../entities/IceWaterCoolingEntity";
import Typography from "@mui/material/Typography";
import {Card, CardContent, TextField} from "@mui/material";
import {IceWaterCoolingCount} from "../../enums/IceWaterCoolingCount";

interface IceWaterBankTypesFormProps {
  iceWaterCoolingEntity: IceWaterCoolingEntity;
  setTimePowerUsageRows: (timePowerUsageRows: TimePowerUsageRow[]) => void;
}

export const IceWaterBankTypesForm = ({ iceWaterCoolingEntity, setTimePowerUsageRows }: IceWaterBankTypesFormProps) => {
  const [type1Count, setType1Count] = useState<IceWaterCoolingCount>(IceWaterCoolingCount.IceWaterCoolingCount0);
  const [type4Count, setType4Count] = useState<IceWaterCoolingCount>(IceWaterCoolingCount.IceWaterCoolingCount0);

  const handleType1CountChange = (e: any) => {
    const type1Count = e.target.value;
    setType1Count(type1Count);
    iceWaterCoolingEntity.setType1Count(type1Count);
    setTimePowerUsageRows(iceWaterCoolingEntity.timePowerUsageRows);
  };

  const handleType4CountChange = (e: any) => {
    const type4Count = e.target.value;
    setType4Count(type4Count);
    iceWaterCoolingEntity.setType4Count(type4Count);
    setTimePowerUsageRows(iceWaterCoolingEntity.timePowerUsageRows);
  };

  return (
    <Card sx={{ height: 235, width: 240 }}>
      <CardContent>
        <Typography sx={{ mb: 1, pt: 2, pb: 2 }} variant="h6" component="div" style={{ color: "black" }}>
          Ice Water Bank Types
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
      </CardContent>
    </Card>
  );
};