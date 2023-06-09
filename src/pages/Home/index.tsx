import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import { KettleCount } from "../../enums/KettleCount";
import { KettleContainer } from "../../components/KettleContainer";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import { getEnumMinMax } from "../../utils/enum";
import { KettleEntity } from "../../entities/KettleEntity";
import { Calculator } from "../../services/Calculator";
import { WaterForm } from "../../components/WaterForm";
import { IceWaterCoolingEntity, TimePowerUsageRow } from "../../entities/IceWaterCoolingEntity";
import { TapWaterCoolingEntity } from "../../entities/TapWaterCoolingEntity";
import { ElectricityForm } from "../../components/ElectricityForm";
import { DataProvider, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements } from "../../services/DataProvider";
import { MeasurementsTable } from "../../components/MeasurementsTable";
import Grid from "@mui/material/Grid";
import { IceWaterBankTypesForm } from "../../components/IceWaterBankTypesForm";
import { styled } from "@mui/material/styles";
import { TimePowerDataGrid } from "../../components/TimePowerDataGrid";
import Box from "@mui/material/Box";
import { ConsumptionDisplay } from "../../components/ConsumptionDisplay";
import { ConsumptionResult } from "../../components/ConsumptionDisplay/types";
import { C5iRecommendationsDataGrid } from "../../components/C5iRecommendationsDataGrid";
import htmConceptsLogo from '../../assets/img/HTM_Concepts_AG_Logo_mit_Claim_2019_gray.png';
import metosLogo from '../../assets/img/metos_logo.png';
import { CustomAppBar } from "../../components/CustomAppBar";
import { AuthContext } from "../../contexts";

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

  const [loading, setLoading] = useState(true);

  const { authenticatedUser: user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

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

  const isMobile = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;  
  }

  return loading
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
      <div className="Home">
        <div className="Home-header">
          <CustomAppBar user={user!} />
        </div>

        <div className="Home-content">
          <div className="logo-container">
            <div>
              <img className='logo' src={htmConceptsLogo} width={100} />
            </div>

            <div>
              <img className='logo' src={metosLogo} width={100} />
            </div>
          </div>

          <div className='form-container'>
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


          </div>

          <div className='recommendation-container'>
            <C5iRecommendationsDataGrid rows={calculator.calculateC5iRecommendationsRows()} />
          </div>

          <ConsumptionDisplay
            consumptionResult={consumptionResult}
          />

          <div className={"calculate-container-" + (isMobile() ? 'mobile' : 'desktop')}>

            <div className='grid-button-container'>
              <div className='data-grid'>
                <TimePowerDataGrid rows={timePowerUsageRows} iceWaterCoolingEntity={iceWaterCoolingEntity} />
              </div>
              <div className='button-container'>

                <div className='kettle-button'>
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
                </div>

                <div className='calculate-button'>
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
                </div>
              </div>
            </div>

            <div className='kettle-container'>
              <KettleContainer
                kettleEntities={kettleEntities}
                handleKettleDeleteClick={handleKettleDeleteClick}
              />
            </div>

          </div>
        </div>

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
      </div>
    );
};

export default Home;
