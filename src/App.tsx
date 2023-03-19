import React, {useState} from 'react';
import './App.css';
import {CauldronCount} from "./enums/CauldronCount";
import {CauldronContainer} from "./components/CauldronContainer";
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import {getEnumMinMax} from "./utils/enum";
import {CauldronEntity} from "./entities/CauldronEntity";
import Box from "@mui/material/Box";
import {Calculator} from "./services/Calculator";
import {WaterBank} from "./components/TapWaterBank";
import {IceWaterBankEntity} from "./entities/IceWaterBankEntity";
import {TapWaterBankEntity} from "./entities/TapWaterBankEntity";
import {IceBank} from "./components/IceWaterBank";
import {DataProvider, IceWaterBankMeasurements, TapWaterBankMeasurements} from "./services/DataProvider";
import {MeasurementsGrid} from "./components/MeasurementsGrid";
import Grid from "@mui/material/Grid";

function App() {
  const [cauldronCount, setCauldronCount] = useState<CauldronCount>(1);
  const [cauldronEntities, setCauldronEntities] = useState<CauldronEntity[]>([new CauldronEntity()]);
  const [tapWaterBankMeasurements, setTapWaterBankMeasurements] = useState<TapWaterBankMeasurements>();
  const [iceWaterBankMeasurements, setIceWaterBankMeasurements] = useState<IceWaterBankMeasurements>();

  const [result, setResult] = useState(0);

  const tapWaterBankEntity = new TapWaterBankEntity();
  const iceWaterBankEntity = new IceWaterBankEntity();

  const dataProvider = new DataProvider(
    tapWaterBankEntity,
    iceWaterBankEntity
  );

  const calculator = new Calculator(
    cauldronEntities,
    tapWaterBankMeasurements,
    iceWaterBankMeasurements
  );

  const handleAddCauldronClick = () => {
    const maxCauldronCount = getEnumMinMax(CauldronCount)[1];

    if (cauldronCount >= maxCauldronCount) return;

    setCauldronEntities([...cauldronEntities, new CauldronEntity()]);

    setResult(calculator.calculateResult());

    setCauldronCount(cauldronCount + 1);
  };

  const handleCauldronDeleteClick = (cauldronNr: number) => {
    setCauldronEntities(cauldronEntities.filter((_, idx) => idx + 1 !== cauldronNr));

    setCauldronCount(cauldronCount - 1);
  };

  const handleRefreshClick = () => {
    // setResult(calculator.calculateResult());

    // Fetch newest measurements
    const { tapWaterBankMeasurements, iceWaterBankMeasurements } = dataProvider.fetch();
    setTapWaterBankMeasurements(tapWaterBankMeasurements);
    setIceWaterBankMeasurements(iceWaterBankMeasurements);
    // console.log(iceWaterBankMeasurements, tapWaterBankMeasurements)
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

        <Box
          component="div"
          sx={{
            display: 'inline',
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
            margin: '0 0 25px'
          }}
        >
          {result}
        </Box>

        <Grid container sx={{ gap: 50, ml: 65, mr: 0 }}>
          <Grid item xs={12} md={2}>
            {
              tapWaterBankMeasurements &&
              <MeasurementsGrid
                measurements={tapWaterBankMeasurements}
                title='Frischwasserbank Messungen'
                width={800}
              />
            }
          </Grid>

          <Grid item xs={12} md={2}>
            {
              iceWaterBankMeasurements &&
              <MeasurementsGrid
                measurements={iceWaterBankMeasurements}
                title='Eiswasserbank Messungen'
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
