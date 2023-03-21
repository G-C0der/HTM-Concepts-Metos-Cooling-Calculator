import React, {useState} from 'react';
import './App.css';
import {KettleCount} from "./enums/KettleCount";
import {KettleContainer} from "./components/KettleContainer";
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import {getEnumMinMax} from "./utils/enum";
import {KettleEntity} from "./entities/KettleEntity";
import {Calculator} from "./services/Calculator";
import {WaterForm} from "./components/WaterForm";
import {IceWaterCoolingEntity} from "./entities/IceWaterCoolingEntity";
import {TapWaterCoolingEntity} from "./entities/TapWaterCoolingEntity";
import {ElectricityForm} from "./components/ElectricityForm";
import {DataProvider, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements} from "./services/DataProvider";
import {MeasurementsGrid} from "./components/MeasurementsGrid";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function App() {
  const [kettleCount, setKettleCount] = useState<KettleCount>(1);
  const [kettleEntities, setKettleEntities] = useState<KettleEntity[]>([new KettleEntity()]);
  const [tapWaterCoolingEntity] = useState<TapWaterCoolingEntity>(new TapWaterCoolingEntity());
  const [iceWaterCoolingEntity] = useState<IceWaterCoolingEntity>(new IceWaterCoolingEntity());
  const [tapWaterCoolingMeasurements, setTapWaterCoolingMeasurements] = useState<TapWaterCoolingMeasurements>();
  const [iceWaterCoolingMeasurements, setIceWaterCoolingMeasurements] = useState<IceWaterCoolingMeasurements>();

  const dataProvider = new DataProvider(
    tapWaterCoolingEntity,
    iceWaterCoolingEntity
  );

  const calculator = new Calculator(
    kettleEntities
  );

  const handleAddKettleClick = () => {
    const maxKettleCount = getEnumMinMax(KettleCount)[1];

    if (kettleCount >= maxKettleCount) return;

    setKettleEntities([...kettleEntities, new KettleEntity()]);

    setKettleCount(kettleCount + 1);
  };

  const handleKettleDeleteClick = (kettleNr: number) => {
    setKettleEntities(kettleEntities.filter((_, idx) => idx + 1 !== kettleNr));

    setKettleCount(kettleCount - 1);
  };

  const handleRefreshClick = () => {
    // Fetch newest measurements
    let { tapWaterCoolingMeasurements, iceWaterCoolingMeasurements } = dataProvider.fetch();
    calculator.setTapWaterCoolingMeasurements(tapWaterCoolingMeasurements);
    calculator.setIceWaterCoolingMeasurements(iceWaterCoolingMeasurements);

    // Set target row (row with smallest cost difference)
    // ({ tapWaterCoolingMeasurements, iceWaterCoolingMeasurements } = calculator.setTargetRow()); // TODO: check why this not works
    const res = calculator.setTargetRow();
    setTapWaterCoolingMeasurements(res?.tapWaterCoolingMeasurements);
    setIceWaterCoolingMeasurements(res?.iceWaterCoolingMeasurements);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button style={{
          margin: '40px',
          padding: '15px 0 15px 0',
          backgroundColor: "white",
        }} variant="outlined" onClick={handleAddKettleClick}><AddIcon /></Button>

        <Grid container sx={{ gap: 10, mt: 5, mb: 5,  ml: 163, mr: 0, minWidth: 2000 }}>
          <Grid item xs={12} md={2}>
            <WaterForm tapWaterCoolingEntity={tapWaterCoolingEntity} />
          </Grid>

          <Grid item xs={12} md={2}>
            <ElectricityForm iceWaterCoolingEntity={iceWaterCoolingEntity} />
          </Grid>
        </Grid>

        <KettleContainer kettleEntities={kettleEntities} handleKettleDeleteClick={handleKettleDeleteClick} />

        <Button style={{
          margin: '40px 0 0',
          padding: '15px 0 15px 0',
          backgroundColor: "white",
        }} variant="outlined" onClick={handleRefreshClick}><RefreshIcon /></Button>

        <Grid container sx={{ gap: 50, mt: 10, ml: 10, mr: 0 }}>
          <Grid item xs={12} md={2}>
            {
              tapWaterCoolingMeasurements &&
              <MeasurementsGrid
                measurements={tapWaterCoolingMeasurements}
                title='Tap Water Cooling Measurements'
                width={800}
              />
            }
          </Grid>

          <Grid item xs={12} md={2}>
            {
              iceWaterCoolingMeasurements &&
              <MeasurementsGrid
                measurements={iceWaterCoolingMeasurements}
                title='Ice Water Cooling Measurements'
                width={1200}
              />
            }
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
