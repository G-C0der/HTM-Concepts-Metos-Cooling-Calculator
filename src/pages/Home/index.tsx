import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import { KettleCount } from "../../enums/KettleCount";
import { KettleContainer } from "../../components/KettleContainer";
import {Button, CircularProgress, TextField, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
import {CalculatorParamsModal} from "../../components/CalculatorParamsModal";
import {ApiResponse, CalculatorParams, CalculatorParamsKettle} from "../../types";
import {IceWaterCoolingCount} from "../../enums/IceWaterCoolingCount";
import {TempAlert} from "../../components/TempAlert";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {LoadingButton} from "../../components/LoadingButton";
import {useFormik} from "formik";
import * as yup from "yup";
import {paramsFieldLengths} from "../../constants";

const Home = () => {
  const [kettleCount, setKettleCount] = useState<KettleCount>(1);
  const [kettleEntities, setKettleEntities] = useState<KettleEntity[]>([]);
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

  const [type1Count, setType1Count] = useState<IceWaterCoolingCount>(IceWaterCoolingCount.IceWaterCoolingCount0);
  const [type4Count, setType4Count] = useState<IceWaterCoolingCount>(IceWaterCoolingCount.IceWaterCoolingCount0);

  const [cop, setCop] = useState(1);

  // const dataProvider = new DataProvider(
  //   tapWaterCoolingEntity,
  //   iceWaterCoolingEntity
  // );

  const calculator = new Calculator(
    user!.mode,
    kettleEntities,
    tapWaterCoolingEntity,
    iceWaterCoolingEntity,
    timePowerUsageRows
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isPdfGenerationLoading, setIsPdfGenerationLoading] = useState(false);
  // const [isSelectedParamsLoadFinished, setIsSelectedParamsLoadFinished] = useState(false);

  const [wereParamsSaved, setWereParamsSaved] = useState(false);
  const [wereParamsCleared, setWereParamsCleared] = useState(false);

  const [isCalculatorParamsModalOpen, setIsCalculatorParamsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [apiResponse, setApiResponse] = useState<ApiResponse<unknown>>();
  const [successMessage, setSuccessMessage] = useState('');

  const { authenticatedUser: user } = useContext(AuthContext);
  const { saveCalculatorParams } = useContext(CalculatorContext);

  const validationSchema = yup.object({
    saveName: yup
      .string()
      .transform(value => value.trim())
      .required('Save name is required.')
      .max(paramsFieldLengths.saveName, `Save name is too long - should be maximum ${paramsFieldLengths.saveName} characters.`)
  });

  const formik = useFormik({
    initialValues: {
      saveName: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSaveLoading(true);

      const saveResponse = await saveCalculatorParams(
        values.saveName,
        iceWaterCoolingEntity,
        tapWaterCoolingEntity,
        kettleEntities
      );

      setApiResponse(saveResponse);
      if (saveResponse.success) {
        setSuccessMessage('Parameters have been saved.');
        setWereParamsSaved(true);
        if (wereParamsCleared) setWereParamsCleared(false);
      }

      setIsSaveLoading(false);
    }
  });

  // useEffect(() => {
  //   if (user) {
  //     const fetchCalculatorParams = async () => {
  //       const fetchSelectedParamsResponse = await fetchSelectedCalculatorParams();
  //       if (fetchSelectedParamsResponse.success && fetchSelectedParamsResponse.data!.calculatorParams) {
  //         loadParams(fetchSelectedParamsResponse.data!.calculatorParams);
  //       }
  //
  //       setIsSelectedParamsLoadFinished(true);
  //     };
  //
  //     fetchCalculatorParams();
  //   }
  // }, [user]);
  //
  // useEffect(() => {
  //   if (isSelectedParamsLoadFinished) {
  //     const timer = setTimeout(() => {
  //       setIsLoading(false);
  //     }, 1000);
  //
  //     return () => clearTimeout(timer);
  //   }
  // }, [isSelectedParamsLoadFinished]);

  useEffect(() => {
    if (user) {
      setKettleEntities([new KettleEntity(user.mode)]);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
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
    if (consumptionResult) setConsumptionResult(consumptionResult);
  }, [waterLitreCHF, waterLitreCO2, kWhCHF, kWhCO2, cop, type1Count, type4Count, kettleEntities]);

  const handleKettleAddClick = () => {
    const maxKettleCount = getEnumMinMax(KettleCount)[1];

    if (kettleCount >= maxKettleCount) return;

    setKettleEntities([...kettleEntities, new KettleEntity(user!.mode)]);

    setKettleCount(kettleCount + 1);
  };

  const handleKettleDeleteClick = (kettleNr: number) => {
    if (kettleCount <= 1) return;

    setKettleEntities(kettleEntities.filter((_, idx) => idx + 1 !== kettleNr));

    setKettleCount(kettleCount - 1);
  };

  const handleResetParamsClick = () => {
    loadParams();

    setWereParamsCleared(true);
  };

  const handleGeneratePdfClick = async () => {
    setIsPdfGenerationLoading(true);

    const content = document.getElementById('home-content');

    const canvas = await html2canvas(content!);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      // orientation: "landscape",
    });

    const imgProps = pdf.getImageProperties(imgData);

    // Determine whether to fit the content width-wise or height-wise
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let imgWidth = pageWidth;
    let imgHeight = (imgWidth / imgProps.width) * imgProps.height;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (imgHeight / imgProps.height) * imgProps.width;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    window.open(pdf.output('bloburl'), '_blank');

    setIsPdfGenerationLoading(false);
  };

  const loadParams = (params?: CalculatorParams) => {
    const name = params?.name ?? '';
    const waterLitreCHF = params?.waterLitreCHF ?? 0;
    const waterLitreCo2 = params?.waterLitreCo2 ?? 0;
    const kwHourCHF = params?.kwHourCHF ?? 0;
    const kwHourCo2 = params?.kwHourCo2 ?? 0;
    const iceWaterCoolingType1Count = params?.iceWaterCoolingType1Count ?? 0;
    const iceWaterCoolingType4Count = params?.iceWaterCoolingType4Count ?? 0;
    const cop = params?.cop ?? 1;
    const kettles = params
      ? (typeof params.kettles === 'string') ? JSON.parse(params.kettles) : params.kettles // Parse `kettles` into JSON objects if they're strings. This happens on heroku prod system
      : null;
    const kettleEntities = kettles
      ? kettles.map((kettleParams: CalculatorParamsKettle) => new KettleEntity(
          user!.mode,
          kettleParams.sizeLitres,
          kettleParams.coolingMode,
          kettleParams.c3CoolingPercent,
          kettleParams.timeUsages
        ))
      : [new KettleEntity(user!.mode)];
    const kettleCount = params ? kettles.length : 1;

    formik.setFieldValue('saveName', name);

    tapWaterCoolingEntity.waterLitreCHF = waterLitreCHF;
    setWaterLitreCHF(waterLitreCHF);
    tapWaterCoolingEntity.waterLitreCo2 = waterLitreCo2;
    setWaterLitreCO2(waterLitreCo2);
    iceWaterCoolingEntity.kwHourCHF = kwHourCHF;
    setKWhCHF(kwHourCHF);
    iceWaterCoolingEntity.kwHourCo2 = kwHourCo2;
    setKWhCO2(kwHourCo2);
    iceWaterCoolingEntity.setType1Count(iceWaterCoolingType1Count);
    setType1Count(iceWaterCoolingType1Count);
    iceWaterCoolingEntity.setType4Count(iceWaterCoolingType4Count);
    setType4Count(iceWaterCoolingType4Count);
    iceWaterCoolingEntity.setCop(cop);
    setCop(cop);

    setKettleEntities(kettleEntities);
    setKettleCount(kettleCount);
  };

  const clearApiResponse = () => {
    setApiResponse(undefined);
    setSuccessMessage('');
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
      <Box id="home">
        <Box id="home-header">
          <CustomAppBar
            user={user!}
            setIsCalculatorParamsModalOpen={setIsCalculatorParamsModalOpen}
            setIsAdminModalOpen={setIsAdminModalOpen}
            setIsSettingsModalOpen={setIsSettingsModalOpen}
          />
        </Box>

        <Box id="home-content">
          <CalculatorParamsModal
            isOpen={isCalculatorParamsModalOpen}
            setIsOpen={setIsCalculatorParamsModalOpen}
            loadParams={loadParams}
            wereParamsSaved={wereParamsSaved}
            wereParamsCleared={wereParamsCleared}
            setWereParamsCleared={setWereParamsCleared}
            setApiResponse={setApiResponse}
            setSuccessMessage={setSuccessMessage}
          />
          <AdminModal isOpen={isAdminModalOpen} setIsOpen={setIsAdminModalOpen} />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            setIsOpen={setIsSettingsModalOpen}
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />

          <form onSubmit={formik.handleSubmit}>
            <Box
              id='home-actions-container'
              gap={1}
              pt={1}
              sx={{ flexDirection: 'row', alignItems: 'flex-start' }}
            >
              <Box height="80px" display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  style={{ margin: "5px" }}
                  name='saveName'
                  label="Save Name"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  error={formik.touched.saveName && Boolean(formik.errors.saveName)}
                  helperText={formik.touched.saveName && formik.errors.saveName}
                  value={formik.values.saveName}
                  onChange={formik.handleChange}
                />
              </Box>

              <LoadingButton
                className='action-button'
                startIcon={<SaveAltIcon />}
                loading={isSaveLoading}
                type='submit'
              >
                Save Parameters
              </LoadingButton>

              <Button
                className='action-button'
                startIcon={<RestartAltIcon />}
                onClick={handleResetParamsClick}
              >
                Reset Parameters
              </Button>

              <LoadingButton
                className='action-button'
                startIcon={<PictureAsPdfIcon />}
                onClick={handleGeneratePdfClick}
                loading={isPdfGenerationLoading}
              >
                Generate PDF
              </LoadingButton>
            </Box>
          </form>

          <Box id='form-container'>
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
              cop={cop}
              setCop={setCop}
            />

            <IceWaterBankTypesForm
              iceWaterCoolingEntity={iceWaterCoolingEntity}
              setTimePowerUsageRows={setTimePowerUsageRows}
              type1Count={type1Count}
              setType1Count={setType1Count}
              type4Count={type4Count}
              setType4Count={setType4Count}
            />
          </Box>

          <Box id='recommendation-container'>
            <C5iRecommendationsDataGrid rows={calculator.calculateC5iRecommendationsRows(iceWaterCoolingEntity)} user={user!} />
          </Box>

          <ConsumptionDisplay
            consumptionResult={consumptionResult}
          />

          <Box id={`calculate-container-${(isMobile() ? 'mobile' : 'desktop')}`}>
            <Box id='button-grid-container'>
              <Box id='data-grid'>
                <TimePowerDataGrid rows={timePowerUsageRows} iceWaterCoolingEntity={iceWaterCoolingEntity} />
              </Box>
              <Box id='button-container'>

                <Box id='kettle-button'>
                  <Tooltip title='add kettle'>
                    <Button
                      style={{
                        margin: '40px',
                        marginTop: '80px',
                        padding: '15px 0 15px 0',
                        backgroundColor: "white",
                      }}
                      variant="outlined"
                      onClick={handleKettleAddClick}
                    ><AddIcon /></Button>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            <Box>
              <KettleContainer
                kettleEntities={kettleEntities}
                handleKettleDeleteClick={handleKettleDeleteClick}
                setKettleEntities={setKettleEntities}
                user={user!}
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

        {
          <TempAlert
            severity='success'
            message={successMessage}
            condition={apiResponse?.success}
            resetCondition={clearApiResponse}
          />
        }
        {
          apiResponse?.error &&
          <TempAlert
            severity={apiResponse.error.severity}
            message={apiResponse.error.message}
            condition={apiResponse.success === false}
            resetCondition={clearApiResponse}
          />
        }
      </Box>
    );
};

export default Home;
