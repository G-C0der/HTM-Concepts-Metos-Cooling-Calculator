import {csvToJSON} from "../utils/csv";
import {iceWaterCoolingMeasurements} from "../data/iceWaterCoolingMeasurements";
import {tapWaterCoolingMeasurements} from "../data/tapWaterCoolingMeasurements";
import {TapWaterCoolingEntity} from "../entities/TapWaterCoolingEntity";
import {IceWaterCoolingEntity} from "../entities/IceWaterCoolingEntity";

// Tap water bank fields
const FIELD_WATER_LITRE = 'Wasser/l';
const FIELD_LITRE_CHF = 'l/CHF';
const FIELD_LITRE_CO2_GRAMS = 'l/Co2/g';

// Ice water bank fields
const FIELD_KWH = 'kWh';
const FIELD_KWH_CHF = 'kWh/CHF';
const FIELD_KWH_CO2_GRAMS = 'kWh/Co2/g';
const FIELD_ICE_INCREASE_KG = 'EisAufbau/kg';

// Shared fields
const FIELD_FOOD_TEMP = 'Food/Temp';
const FIELD_TIME_MIN = 'Zeit/Min';

const tapWaterCoolingFields: TapWaterCoolingField[] = [
  FIELD_FOOD_TEMP,
  FIELD_TIME_MIN,
  FIELD_WATER_LITRE,
  FIELD_LITRE_CHF,
  FIELD_LITRE_CO2_GRAMS
];

const iceWaterCoolingFields: IceWaterCoolingField[] = [
  FIELD_FOOD_TEMP,
  FIELD_TIME_MIN,
  FIELD_KWH,
  FIELD_KWH_CHF,
  FIELD_KWH_CO2_GRAMS
];

const DECIMALS = 4;

type TapWaterCoolingField = typeof FIELD_FOOD_TEMP
  | typeof FIELD_TIME_MIN
  | typeof FIELD_WATER_LITRE
  | typeof FIELD_LITRE_CHF
  | typeof FIELD_LITRE_CO2_GRAMS;

type IceWaterCoolingField = typeof FIELD_FOOD_TEMP
  | typeof FIELD_TIME_MIN
  | typeof FIELD_KWH
  | typeof FIELD_KWH_CHF
  | typeof FIELD_KWH_CO2_GRAMS
  | typeof FIELD_ICE_INCREASE_KG;

interface TapWaterCoolingMainMeasurement {
  [FIELD_FOOD_TEMP]?: number;
  [FIELD_TIME_MIN]: number;
  [FIELD_WATER_LITRE]: number;
}
interface TapWaterCoolingMainMeasurements extends Array<TapWaterCoolingMainMeasurement> {}

interface IceWaterCoolingMainMeasurement {
  [FIELD_FOOD_TEMP]: number;
  [FIELD_TIME_MIN]: number;
}
interface IceWaterCoolingMainMeasurements extends Array<IceWaterCoolingMainMeasurement> {}

interface TapWaterCoolingMeasurement extends TapWaterCoolingMainMeasurement {
  [FIELD_LITRE_CHF]: number;
  [FIELD_LITRE_CO2_GRAMS]: number;
  target?: boolean;
}
interface TapWaterCoolingMeasurements extends Array<TapWaterCoolingMeasurement> {}

interface IceWaterCoolingMeasurement extends IceWaterCoolingMainMeasurement {
  [FIELD_KWH]: number;
  [FIELD_KWH_CHF]: number;
  [FIELD_KWH_CO2_GRAMS]: number;
  [FIELD_ICE_INCREASE_KG]: number;
  target?: boolean;
}
interface IceWaterCoolingMeasurements extends Array<IceWaterCoolingMeasurement> {}

class DataProvider {
  tapWaterCoolingMeasurements?: TapWaterCoolingMainMeasurements | TapWaterCoolingMeasurements;
  iceWaterCoolingMeasurements?: IceWaterCoolingMainMeasurements | IceWaterCoolingMeasurements;
  tapWaterCoolingEntity: TapWaterCoolingEntity;
  iceWaterCoolingEntity: IceWaterCoolingEntity;

  constructor(
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    iceWaterCoolingEntity: IceWaterCoolingEntity
  ) {
    this.tapWaterCoolingEntity = tapWaterCoolingEntity;
    this.iceWaterCoolingEntity = iceWaterCoolingEntity;
  }
  
  fetch = () => {
    this.setTapWaterCoolingMeasurements(csvToJSON(tapWaterCoolingMeasurements));
    this.setIceWaterCoolingMeasurements(csvToJSON(iceWaterCoolingMeasurements));
    
    return {
      tapWaterCoolingMeasurements: (this.tapWaterCoolingMeasurements as TapWaterCoolingMeasurements),
      iceWaterCoolingMeasurements: (this.iceWaterCoolingMeasurements as IceWaterCoolingMeasurements)
    };
  };
  
  private setTapWaterCoolingMeasurements = (tapWaterCoolingMainMeasurements: TapWaterCoolingMainMeasurements) => {
    this.tapWaterCoolingMeasurements = tapWaterCoolingMainMeasurements;
    
    const litreCHFFactor = this.tapWaterCoolingEntity.waterLitreCHF;
    const litreCo2GramsFactor = this.tapWaterCoolingEntity.waterLitreCo2;

    for (let i = 0; i < this.tapWaterCoolingMeasurements.length; i++) {
      const tapWaterCoolingMeasurementsRow = (this.tapWaterCoolingMeasurements as TapWaterCoolingMeasurements)[i];
      const isFirstRow = i === 0;

      // Set calculated fields
      tapWaterCoolingMeasurementsRow[FIELD_LITRE_CHF] = isFirstRow
        ? litreCHFFactor
        : litreCHFFactor * tapWaterCoolingMeasurementsRow[FIELD_WATER_LITRE];

      tapWaterCoolingMeasurementsRow[FIELD_LITRE_CO2_GRAMS] = isFirstRow
        ? litreCo2GramsFactor
        : litreCo2GramsFactor * tapWaterCoolingMeasurementsRow[FIELD_WATER_LITRE];
    }
  };

  private setIceWaterCoolingMeasurements = (iceWaterCoolingMainMeasurements: IceWaterCoolingMainMeasurements) => {
    this.iceWaterCoolingMeasurements = iceWaterCoolingMainMeasurements;

    const kwHourFactor = this.iceWaterCoolingEntity.kwHour;
    const kwHourCHFFactor = this.iceWaterCoolingEntity.kwHourCHF;
    const kwHourCo2GramsFactor = this.iceWaterCoolingEntity.kwHourCo2;
    // const iceIncreaseFactor = this.iceWaterCoolingEntity.
    let foodTempMinuend: number; // Food temp of first row

    for (let i = 0; i < this.iceWaterCoolingMeasurements.length; i++) {
      const iceWaterCoolingMeasurementsRow = (this.iceWaterCoolingMeasurements as IceWaterCoolingMeasurements)[i];
      const isFirstRow = i === 0;

      if (isFirstRow) foodTempMinuend = iceWaterCoolingMeasurementsRow[FIELD_FOOD_TEMP];

      // Set calculated fields
      iceWaterCoolingMeasurementsRow[FIELD_KWH] = isFirstRow
        ? kwHourFactor
        : kwHourFactor * (foodTempMinuend! - iceWaterCoolingMeasurementsRow[FIELD_FOOD_TEMP]);

      iceWaterCoolingMeasurementsRow[FIELD_KWH_CHF] = isFirstRow
        ? kwHourCHFFactor
        : kwHourCHFFactor * iceWaterCoolingMeasurementsRow[FIELD_KWH];

      iceWaterCoolingMeasurementsRow[FIELD_KWH_CO2_GRAMS] = isFirstRow
        ? kwHourCo2GramsFactor
        : kwHourCo2GramsFactor * iceWaterCoolingMeasurementsRow[FIELD_KWH]
    }
  };

  static isATapWaterCoolingMeasurement = (measurements: TapWaterCoolingMeasurements | IceWaterCoolingMeasurements) => {
    const firstRow = measurements[0];

    return tapWaterCoolingFields.every(field => field in firstRow);
  }

  static isAnIceWaterCoolingMeasurement = (measurements: TapWaterCoolingMeasurements | IceWaterCoolingMeasurements) => {
    const firstRow = measurements[0];

    return iceWaterCoolingFields.every(field => field in firstRow);
  }
}

export {
  DataProvider,

  tapWaterCoolingFields,
  iceWaterCoolingFields,
  FIELD_FOOD_TEMP,
  FIELD_TIME_MIN,
  FIELD_WATER_LITRE,
  FIELD_LITRE_CHF,
  FIELD_LITRE_CO2_GRAMS,
  FIELD_KWH,
  FIELD_KWH_CHF,
  FIELD_KWH_CO2_GRAMS,
  FIELD_ICE_INCREASE_KG,

  DECIMALS
};

export type {
  TapWaterCoolingMeasurements,
  IceWaterCoolingMeasurements,

  TapWaterCoolingField,
  IceWaterCoolingField
};