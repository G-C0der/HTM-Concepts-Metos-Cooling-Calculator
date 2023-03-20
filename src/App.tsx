import React, {useState} from 'react';
import './App.css';
import {CauldronCount} from "./enums/CauldronCount";
import {CauldronContainer} from "./components/CauldronContainer";
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import {getEnumMinMax} from "./utils/enum";
import {CauldronEntity} from "./entities/CauldronEntity";
import {Calculator} from "./services/Calculator";
import {WaterCooling} from "./components/TapWaterCooling";
import {IceWaterCoolingEntity} from "./entities/IceWaterCoolingEntity";
import {TapWaterCoolingEntity} from "./entities/TapWaterCoolingEntity";
import {IceCooling} from "./components/IceWaterCooling";
import {DataProvider, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements} from "./services/DataProvider";
import {MeasurementsGrid} from "./components/MeasurementsGrid";
import Grid from "@mui/material/Grid";

function App() {
  const [cauldronCount, setCauldronCount] = useState<CauldronCount>(1);
  const [cauldronEntities, setCauldronEntities] = useState<CauldronEntity[]>([new CauldronEntity()]);
  const [tapWaterCoolingEntity] = useState<TapWaterCoolingEntity>(new TapWaterCoolingEntity());
  const [iceWaterCoolingEntity] = useState<IceWaterCoolingEntity>(new IceWaterCoolingEntity());
  const [tapWaterCoolingMeasurements, setTapWaterCoolingMeasurements] = useState<TapWaterCoolingMeasurements>();
  const [iceWaterCoolingMeasurements, setIceWaterCoolingMeasurements] = useState<IceWaterCoolingMeasurements>();

  const dataProvider = new DataProvider(
    tapWaterCoolingEntity,
    iceWaterCoolingEntity
  );

  const calculator = new Calculator(
    cauldronEntities
  );

  const handleAddCauldronClick = () => {
    const maxCauldronCount = getEnumMinMax(CauldronCount)[1];

    if (cauldronCount >= maxCauldronCount) return;

    setCauldronEntities([...cauldronEntities, new CauldronEntity()]);

    setCauldronCount(cauldronCount + 1);
  };

  const handleCauldronDeleteClick = (cauldronNr: number) => {
    setCauldronEntities(cauldronEntities.filter((_, idx) => idx + 1 !== cauldronNr));

    setCauldronCount(cauldronCount - 1);
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
        }} variant="outlined" onClick={handleAddCauldronClick}><AddIcon /></Button>

        <WaterCooling tapWaterCoolingEntity={tapWaterCoolingEntity} />

        <CauldronContainer cauldronEntities={cauldronEntities} handleCauldronDeleteClick={handleCauldronDeleteClick} />

        <IceCooling iceWaterCoolingEntity={iceWaterCoolingEntity} />

        <Button style={{
          margin: '40px 0 0',
          padding: '15px 0 15px 0',
          backgroundColor: "white",
        }} variant="outlined" onClick={handleRefreshClick}><RefreshIcon /></Button>

        <Grid container sx={{ gap: 50, mt: 10, ml: 65, mr: 0 }}>
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
