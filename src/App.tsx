import React, {useState} from 'react';
import './App.css';
import {KettleCount} from "./enums/KettleCount";
import {KettleContainer} from "./components/KettleContainer";
import {Button, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import {getEnumMinMax} from "./utils/enum";
import {KettleEntity} from "./entities/KettleEntity";
import {Calculator} from "./services/Calculator";
import {WaterForm} from "./components/WaterForm";
import {IceWaterCoolingEntity, TimePowerUsageRow} from "./entities/IceWaterCoolingEntity";
import {TapWaterCoolingEntity} from "./entities/TapWaterCoolingEntity";
import {ElectricityForm} from "./components/ElectricityForm";
import {DataProvider, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements} from "./services/DataProvider";
import {MeasurementsTable} from "./components/MeasurementsTable";
import Grid from "@mui/material/Grid";
import {IceWaterBankTypesForm} from "./components/IceWaterBankTypesForm";
import {styled} from "@mui/material/styles";
import {TimePowerDataGrid} from "./components/TimePowerDataGrid";
import Box from "@mui/material/Box";
import {ConsumptionDisplay} from "./components/ConsumptionDisplay";
import {ConsumptionResult} from "./components/ConsumptionDisplay/types";
import {C5iRecommendationsDataGrid} from "./components/C5iRecommendationsDataGrid";
import metosLogo from './assets/img/metos_logo.png';
import htmConceptsLogo from './assets/img/HTM_Concepts_AG_Logo_mit_Claim_2019_gray.png';

const FormContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#E4E4E4',
  padding: '0 0 1px 10px',
  height: 275
}));

const ConsumptionContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#E4E4E4',
  padding: '17px 0 1px 10px',
  margin: '48px 0 0 0',
  height: 210
}));

function App() {
  const [kettleCount, setKettleCount] = useState<KettleCount>(1);
  const [kettleEntities, setKettleEntities] = useState<KettleEntity[]>([new KettleEntity()]);
  const [tapWaterCoolingEntity] = useState<TapWaterCoolingEntity>(new TapWaterCoolingEntity());
  const [iceWaterCoolingEntity] = useState<IceWaterCoolingEntity>(new IceWaterCoolingEntity());

  // const [tapWaterCoolingMeasurements, setTapWaterCoolingMeasurements] = useState<TapWaterCoolingMeasurements>();
  // const [iceWaterCoolingMeasurements, setIceWaterCoolingMeasurements] = useState<IceWaterCoolingMeasurements>();

  const [timePowerUsageRows, setTimePowerUsageRows] =
    useState<TimePowerUsageRow[]>(iceWaterCoolingEntity.timePowerUsageRows);

  const initialConsumption = { costCHF: 0, co2Grams: 0 };
  const [consumptionResult, setConsumptionResult] = useState<ConsumptionResult>({
    waterConsumption: initialConsumption,
    electricityConsumption: initialConsumption,
    totalConsumption: initialConsumption,
    waterLitresUsed: 0,
    powerKWUsed: 0,
    foodLitresTotal: 0
  });

  const dataProvider = new DataProvider(
    tapWaterCoolingEntity,
    iceWaterCoolingEntity
  );

  const calculator = new Calculator(
    kettleEntities,
    tapWaterCoolingEntity,
    iceWaterCoolingEntity,
    timePowerUsageRows
  );

  const handleAddKettleClick = () => {
    const maxKettleCount = getEnumMinMax(KettleCount)[1];

    if (kettleCount >= maxKettleCount) return;

    setKettleEntities([...kettleEntities, new KettleEntity()]);

    setKettleCount(kettleCount + 1);
  };

  const handleKettleDeleteClick = (kettleNr: number) => {
    if (kettleCount <= 1) return;

    setKettleEntities(kettleEntities.filter((_, idx) => idx + 1 !== kettleNr));

    setKettleCount(kettleCount - 1);
  };

  const handleCalculateClick = () => {
    // Fetch newest measurements
    // let { tapWaterCoolingMeasurements, iceWaterCoolingMeasurements } = dataProvider.fetch();
    // calculator.setTapWaterCoolingMeasurements(tapWaterCoolingMeasurements);
    // calculator.setIceWaterCoolingMeasurements(iceWaterCoolingMeasurements);

    // Calculate target row (row with smallest cost difference)
    // ({ tapWaterCoolingMeasurements, iceWaterCoolingMeasurements } = calculator.calculateMeasurementsTargetRow()); // TODO: check why this not works
    // const res = calculator.calculateMeasurementsTargetRow();
    // setTapWaterCoolingMeasurements(res?.tapWaterCoolingMeasurements);
    // setIceWaterCoolingMeasurements(res?.iceWaterCoolingMeasurements);

    // Calculate ice water cooling power percentages
    const timePowerUsageRows = calculator.calculateTimePowerRows();
    if (timePowerUsageRows) setTimePowerUsageRows(timePowerUsageRows!);

    // Calculate water litres used, power kW used, cost, CO2 & time consumptionResults
    const consumptionResult = calculator.calculateConsumption();
    setConsumptionResult(consumptionResult);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Grid container sx={{
          gap: 15,
          mt: 5,
          justifyContent:"center"
        }}>
          <Grid item>
            <img src={metosLogo} width={250} />
          </Grid>

          <Grid item>
            <img src={htmConceptsLogo} width={250} />
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 5, mb: 5,  ml: 40 }}>
          <Grid item xs={10}>
            <Box sx={{ maxWidth: 1470, ml: -15 }}>
              <FormContainer>
                <Grid container sx={{ gap: 4, mt: 6, mb: 5,  ml: 3, mr: 0, pt: 2 }}>
                  <Grid item md={2}>
                    <WaterForm tapWaterCoolingEntity={tapWaterCoolingEntity} />
                  </Grid>

                  <Grid item md={2}>
                    <ElectricityForm iceWaterCoolingEntity={iceWaterCoolingEntity} />
                  </Grid>

                  <Grid item md={2}>
                    <IceWaterBankTypesForm
                      iceWaterCoolingEntity={iceWaterCoolingEntity}
                      setTimePowerUsageRows={setTimePowerUsageRows}
                    />
                  </Grid>

                  <Grid item md={2} sx={{ mt: -1.2 }}>
                    <C5iRecommendationsDataGrid rows={calculator.calculateC5iRecommendationsRows()} />
                  </Grid>
                </Grid>
              </FormContainer>

              <Grid item xs={12}>
                <ConsumptionContainer>
                  <ConsumptionDisplay
                    consumptionResult={consumptionResult}
                  />
                </ConsumptionContainer>
              </Grid>

              <Grid item container sx={{ mt: 6 }}>
                <Grid item xs={2} sx={{ mt: 44 }}>
                  <TimePowerDataGrid rows={timePowerUsageRows} iceWaterCoolingEntity={iceWaterCoolingEntity} />
                </Grid>

                <Grid item xs={2} sx={{ ml: -33.5, mr: 4.5 }}>
                  <Tooltip title='add kettle'>
                    <Button
                      style={{
                        margin: '40px',
                        padding: '15px 0 15px 0',
                        backgroundColor: "white",
                      }}
                      variant="outlined"
                      onClick={handleAddKettleClick}
                    ><AddIcon /></Button>
                  </Tooltip>

                  <Tooltip title='calculate'>
                    <Button
                      style={{
                        margin: '40px',
                        padding: '15px 0 15px 0',
                        backgroundColor: "white",
                      }}
                      variant="outlined"
                      onClick={handleCalculateClick}
                    ><CalculateIcon /></Button>
                  </Tooltip>
                </Grid>

                <Grid item xs={4}>
                  <KettleContainer
                    kettleEntities={kettleEntities}
                    handleKettleDeleteClick={handleKettleDeleteClick}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/*<Grid container sx={{ gap: 50, mt: 10, ml: 3, mr: 0 }}>*/}
        {/*  <Grid item xs={12} md={2}>*/}
        {/*    {*/}
        {/*      tapWaterCoolingMeasurements &&*/}
        {/*      <MeasurementsTable*/}
        {/*        measurements={tapWaterCoolingMeasurements}*/}
        {/*        title='Tap Water Cooling Measurements'*/}
        {/*        width={800}*/}
        {/*      />*/}
        {/*    }*/}
        {/*  </Grid>*/}

        {/*  <Grid item xs={12} md={2}>*/}
        {/*    {*/}
        {/*      iceWaterCoolingMeasurements &&*/}
        {/*      <MeasurementsTable*/}
        {/*        measurements={iceWaterCoolingMeasurements}*/}
        {/*        title='Ice Water Cooling Measurements'*/}
        {/*        width={1200}*/}
        {/*      />*/}
        {/*    }*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}
      </header>
    </div>
  );
}

export default App;
