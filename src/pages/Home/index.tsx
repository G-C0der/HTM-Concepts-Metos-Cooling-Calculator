import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import { KettleCount } from "../../enums/KettleCount";
import { KettleContainer } from "../../components/KettleContainer";
import {Button, CircularProgress, IconButton, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import SaveIcon from '@mui/icons-material/Save';
import { getEnumMinMax } from "../../utils";
import { KettleEntity, IceWaterCoolingEntity, TimePowerUsageRow, TapWaterCoolingEntity } from "../../entities";
import { Calculator } from "../../services/Calculator";
import { WaterForm } from "../../components/WaterForm";
import { ElectricityForm } from "../../components/ElectricityForm";
import { DataProvider, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements } from "../../services/DataProvider";
import { MeasurementsTable } from "../../components/MeasurementsTable";
import { IceWaterBankTypesForm } from "../../components/IceWaterBankTypesForm";
import { TimePowerDataGrid } from "../../components/TimePowerDataGrid";
import Box from "@mui/material/Box";
import { ConsumptionDisplay } from "../../components/ConsumptionDisplay";
import { ConsumptionResult } from "../../components/ConsumptionDisplay/types";
import { C5iRecommendationsDataGrid } from "../../components/C5iRecommendationsDataGrid";
import { CustomAppBar } from "../../components/CustomAppBar";
import {AuthContext, CalculatorContext} from "../../contexts";
import { isMobile } from "../../utils";
import {AdminModal} from "../../components/AdminModal";
import {SettingsModal} from "../../components/SettingsModal";

const Home = () => {
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

  // Form fields
  const [kWhCHF, setKWhCHF] = useState(0);
  const [kWhCO2, setKWhCO2] = useState(0);

  const [waterLitreCHF, setWaterLitreCHF] = useState(0);
  const [waterLitreCO2, setWaterLitreCO2] = useState(0);

  // const dataProvider = new DataProvider(
  //   tapWaterCoolingEntity,
  //   iceWaterCoolingEntity
  // );

  const calculator = new Calculator(
    kettleEntities,
    tapWaterCoolingEntity,
    iceWaterCoolingEntity,
    timePowerUsageRows
  );

  const [isLoading, setIsLoading] = useState(true);
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { authenticatedUser: user } = useContext(AuthContext);
  const { save } = useContext(CalculatorContext);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleKettleAddClick = () => {
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

  const handleSaveClick = async () => {
    const saveResponse = await save(iceWaterCoolingEntity, tapWaterCoolingEntity, kettleEntities);

    if (saveResponse.success) {
      // TODO: show success temp alert
    } else {
      // TODO: show error temp alert
    }
  };

  return isLoading
    ? (
      <Box style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <CircularProgress size={80} />
      </Box>
    ) : (
      <Box className="home">
        <Box className="home-header">
          <CustomAppBar
            user={user!}
            setIsAdminModalOpen={setIsAdminModalOpen}
            setIsSettingsModalOpen={setIsSettingsModalOpen}
          />
        </Box>

        <Box className="home-content">
          <AdminModal isOpen={isAdminModalOpen} setIsOpen={setIsAdminModalOpen} />
          <SettingsModal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />

          <IconButton onClick={handleSaveClick}>
            <SaveIcon />
          </IconButton>

          <Box className='form-container'>
            <WaterForm
              tapWaterCoolingEntity={tapWaterCoolingEntity}
              waterLitreCHF={waterLitreCHF}
              setWaterLitreCHF={setWaterLitreCHF}
              waterLitreCO2={waterLitreCO2}
              setWaterLitreCO2={setWaterLitreCO2}
            />

            <ElectricityForm
              iceWaterCoolingEntity={iceWaterCoolingEntity}
              kWhCHF={kWhCHF}
              setKWhCHF={setKWhCHF}
              kWhCO2={kWhCO2}
              setKWhCO2={setKWhCO2}
            />

            <IceWaterBankTypesForm
              iceWaterCoolingEntity={iceWaterCoolingEntity}
              setTimePowerUsageRows={setTimePowerUsageRows}
            />
          </Box>

          <Box className='recommendation-container'>
            <C5iRecommendationsDataGrid rows={calculator.calculateC5iRecommendationsRows()} />
          </Box>

          <ConsumptionDisplay
            consumptionResult={consumptionResult}
          />

          <Box className={`calculate-container-${(isMobile() ? 'mobile' : 'desktop')}`}>
            <Box className='button-grid-container'>
              <Box className='data-grid'>
                <TimePowerDataGrid rows={timePowerUsageRows} iceWaterCoolingEntity={iceWaterCoolingEntity} />
              </Box>
              <Box className='button-container'>

                <Box className='kettle-button'>
                  <Tooltip title='add kettle'>
                    <Button
                      style={{
                        margin: '40px',
                        padding: '15px 0 15px 0',
                        backgroundColor: "white",
                      }}
                      variant="outlined"
                      onClick={handleKettleAddClick}
                    ><AddIcon /></Button>
                  </Tooltip>
                </Box>

                <Box className='calculate-button'>
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
                </Box>
              </Box>
            </Box>

            <Box>
              <KettleContainer
                kettleEntities={kettleEntities}
                handleKettleDeleteClick={handleKettleDeleteClick}
              />
            </Box>
          </Box>

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
        </Box>
      </Box>
    );
};

export default Home;
