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
import {WaterBank} from "./components/TapWaterBank";
import {IceWaterBankEntity} from "./entities/IceWaterBankEntity";
import {TapWaterBankEntity} from "./entities/TapWaterBankEntity";
import {IceBank} from "./components/IceWaterBank";
import {DataProvider, IceWaterBankMeasurements, TapWaterBankMeasurements} from "./services/DataProvider";
import {MeasurementsGrid} from "./components/MeasurementsGrid";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function App() {
  const [cauldronCount, setCauldronCount] = useState<CauldronCount>(1);
  const [cauldronEntities, setCauldronEntities] = useState<CauldronEntity[]>([new CauldronEntity()]);
  const [tapWaterBankEntity] = useState<TapWaterBankEntity>(new TapWaterBankEntity());
  const [iceWaterBankEntity] = useState<IceWaterBankEntity>(new IceWaterBankEntity());
  const [tapWaterBankMeasurements, setTapWaterBankMeasurements] = useState<TapWaterBankMeasurements>();
  const [iceWaterBankMeasurements, setIceWaterBankMeasurements] = useState<IceWaterBankMeasurements>();

  const dataProvider = new DataProvider(
    tapWaterBankEntity,
    iceWaterBankEntity
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
    let { tapWaterBankMeasurements, iceWaterBankMeasurements } = dataProvider.fetch();
    calculator.setTapWaterBankMeasurements(tapWaterBankMeasurements);
    calculator.setIceWaterBankMeasurements(iceWaterBankMeasurements);

    // Set target row (row with smallest cost difference)
    // ({ tapWaterBankMeasurements, iceWaterBankMeasurements } = calculator.setTargetRow()); // TODO: check why this not works
    const res = calculator.setTargetRow();
    setTapWaterBankMeasurements(res?.tapWaterBankMeasurements);
    setIceWaterBankMeasurements(res?.iceWaterBankMeasurements);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button style={{
          margin: '40px',
          padding: '15px 0 15px 0',
          backgroundColor: "white",
        }} variant="outlined" onClick={handleAddCauldronClick}><AddIcon /></Button>

        <WaterBank tapWaterBankEntity={tapWaterBankEntity} />

        <CauldronContainer cauldronEntities={cauldronEntities} handleCauldronDeleteClick={handleCauldronDeleteClick} />

        <IceBank iceWaterBankEntity={iceWaterBankEntity} />

        <Button style={{
          margin: '40px 0 0',
          padding: '15px 0 15px 0',
          backgroundColor: "white",
        }} variant="outlined" onClick={handleRefreshClick}><RefreshIcon /></Button>

        <Grid container sx={{ gap: 50, mt: 10, ml: 65, mr: 0 }}>
          <Grid item xs={12} md={2}>
            {
              tapWaterBankMeasurements &&
              <MeasurementsGrid
                measurements={tapWaterBankMeasurements}
                title='Tap Water Cooling Measurements'
                width={800}
              />
            }
          </Grid>

          <Grid item xs={12} md={2}>
            {
              iceWaterBankMeasurements &&
              <MeasurementsGrid
                measurements={iceWaterBankMeasurements}
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
