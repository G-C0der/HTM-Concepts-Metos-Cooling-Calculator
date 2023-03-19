import {csvToJSON} from "../utils/csv";
import {iceWaterBankMeasurements} from "../data/iceWaterBankMeasurements";
import {tapWaterBankMeasurements} from "../data/tapWaterBankMeasurements";
import {TapWaterBankEntity} from "../entities/TapWaterBankEntity";
import {IceWaterBankEntity} from "../entities/IceWaterBankEntity";

// Tap water bank fields
const FIELD_WATER_LITRE = 'Wasser/l';
const FIELD_LITRE_CHF = 'l/CHF';
const FIELD_LITRE_CO2_GRAMS = 'l/Co2/g';

// Ice water bank fields
const FIELD_KW_HOUR = 'kw/h';
const FIELD_KW_HOUR_CHF = 'kw/h/CHF';
const FIELD_KW_HOUR_CO2_GRAMS = 'kw/h/Co2/g';
const FIELD_ICE_INCREASE_KG = 'EisAufbau/kg';

// Shared fields
const FIELD_FOOD_TEMP = 'Food/Temp';
const FIELD_TIME_MIN = 'Zeit/Min';

const tapWaterBankFields: TapWaterBankField[] = [
  FIELD_FOOD_TEMP,
  FIELD_TIME_MIN,
  FIELD_WATER_LITRE,
  FIELD_LITRE_CHF,
  FIELD_LITRE_CO2_GRAMS
];

const iceWaterBankFields: IceWaterBankField[] = [
  FIELD_FOOD_TEMP,
  FIELD_TIME_MIN,
  FIELD_KW_HOUR,
  FIELD_KW_HOUR_CHF,
  // FIELD_KW_HOUR_CO2_GRAMS,
  // FIELD_ICE_INCREASE_KG
];

const DECIMALS = 4;

type TapWaterBankField = typeof FIELD_FOOD_TEMP
  | typeof FIELD_TIME_MIN
  | typeof FIELD_WATER_LITRE
  | typeof FIELD_LITRE_CHF
  | typeof FIELD_LITRE_CO2_GRAMS;

type IceWaterBankField = typeof FIELD_FOOD_TEMP
  | typeof FIELD_TIME_MIN
  | typeof FIELD_KW_HOUR
  | typeof FIELD_KW_HOUR_CHF
  | typeof FIELD_KW_HOUR_CO2_GRAMS
  | typeof FIELD_ICE_INCREASE_KG;

interface TapWaterBankMainMeasurement {
  [FIELD_FOOD_TEMP]?: number;
  [FIELD_TIME_MIN]: number;
  [FIELD_WATER_LITRE]: number;
}
interface TapWaterBankMainMeasurements extends Array<TapWaterBankMainMeasurement> {}

interface IceWaterBankMainMeasurement {
  [FIELD_FOOD_TEMP]: number;
  [FIELD_TIME_MIN]: number;
}
interface IceWaterBankMainMeasurements extends Array<IceWaterBankMainMeasurement> {}

interface TapWaterBankMeasurement extends TapWaterBankMainMeasurement {
  [FIELD_LITRE_CHF]: number;
  [FIELD_LITRE_CO2_GRAMS]: number;
  target?: boolean;
}
interface TapWaterBankMeasurements extends Array<TapWaterBankMeasurement> {}

interface IceWaterBankMeasurement extends IceWaterBankMainMeasurement {
  [FIELD_KW_HOUR]: number;
  [FIELD_KW_HOUR_CHF]: number;
  [FIELD_KW_HOUR_CO2_GRAMS]: number;
  [FIELD_ICE_INCREASE_KG]: number;
  target?: boolean;
}
interface IceWaterBankMeasurements extends Array<IceWaterBankMeasurement> {}

class DataProvider {
  tapWaterBankMeasurements?: TapWaterBankMainMeasurements | TapWaterBankMeasurements;
  iceWaterBankMeasurements?: IceWaterBankMainMeasurements | IceWaterBankMeasurements;
  tapWaterBankEntity: TapWaterBankEntity;
  iceWaterBankEntity: IceWaterBankEntity;

  constructor(
    tapWaterBankEntity: TapWaterBankEntity,
    iceWaterBankEntity: IceWaterBankEntity
  ) {
    this.tapWaterBankEntity = tapWaterBankEntity;
    this.iceWaterBankEntity = iceWaterBankEntity;
  }
  
  fetch = () => {
    this.setTapWaterBankMeasurements(csvToJSON(tapWaterBankMeasurements));
    this.setIceWaterBankMeasurements(csvToJSON(iceWaterBankMeasurements));
    
    return {
      tapWaterBankMeasurements: (this.tapWaterBankMeasurements as TapWaterBankMeasurements),
      iceWaterBankMeasurements: (this.iceWaterBankMeasurements as IceWaterBankMeasurements)
    };
  };
  
  private setTapWaterBankMeasurements = (tapWaterBankMainMeasurements: TapWaterBankMainMeasurements) => {
    this.tapWaterBankMeasurements = tapWaterBankMainMeasurements;
    
    const litreCHFFactor = this.tapWaterBankEntity.waterLitreCHF;
    const litreCo2GramsFactor = this.tapWaterBankEntity.waterLitreCo2;

    for (let i = 0; i < this.tapWaterBankMeasurements.length; i++) {
      const tapWaterBankMeasurementsRow = (this.tapWaterBankMeasurements as TapWaterBankMeasurements)[i];
      const isFirstRow = i === 0;

      // Set calculated fields
      tapWaterBankMeasurementsRow[FIELD_LITRE_CHF] = isFirstRow
        ? litreCHFFactor
        : litreCHFFactor * tapWaterBankMeasurementsRow[FIELD_WATER_LITRE];

      tapWaterBankMeasurementsRow[FIELD_LITRE_CO2_GRAMS] = isFirstRow
        ? litreCo2GramsFactor
        : litreCo2GramsFactor * tapWaterBankMeasurementsRow[FIELD_WATER_LITRE];
    }
  };

  private setIceWaterBankMeasurements = (iceWaterBankMainMeasurements: IceWaterBankMainMeasurements) => {
    this.iceWaterBankMeasurements = iceWaterBankMainMeasurements;

    const kwHourFactor = this.iceWaterBankEntity.kwHour;
    const kwHourCHFFactor = this.iceWaterBankEntity.kwHourCHF;
    const kwHourCo2GramsFactor = this.iceWaterBankEntity.kwHourCo2;
    // const iceIncreaseFactor = this.iceWaterBankEntity.
    let foodTempMinuend: number; // Food temp of first row

    for (let i = 0; i < this.iceWaterBankMeasurements.length; i++) {
      const iceWaterBankMeasurementsRow = (this.iceWaterBankMeasurements as IceWaterBankMeasurements)[i];
      const isFirstRow = i === 0;

      if (isFirstRow) foodTempMinuend = iceWaterBankMeasurementsRow[FIELD_FOOD_TEMP];

      // Set calculated fields
      iceWaterBankMeasurementsRow[FIELD_KW_HOUR] = isFirstRow
        ? kwHourFactor
        : kwHourFactor * (foodTempMinuend! - iceWaterBankMeasurementsRow[FIELD_FOOD_TEMP]);

      iceWaterBankMeasurementsRow[FIELD_KW_HOUR_CHF] = isFirstRow
        ? kwHourCHFFactor
        : kwHourCHFFactor * iceWaterBankMeasurementsRow[FIELD_KW_HOUR];

      // iceWaterBankMeasurementsRow[FIELD_KW_HOUR_CO2_GRAMS] = isFirstRow
      //   ? kwHourCo2GramsFactor
      //   : kwHourCo2GramsFactor * iceWaterBankMeasurementsRow[FIELDKEY]
    }
  };

  static isATapWaterBankMeasurement = (measurements: TapWaterBankMeasurements | IceWaterBankMeasurements) => {
    const firstRow = measurements[0];

    return tapWaterBankFields.every(field => field in firstRow);
  }

  static isAnIceWaterBankMeasurement = (measurements: TapWaterBankMeasurements | IceWaterBankMeasurements) => {
    const firstRow = measurements[0];

    return iceWaterBankFields.every(field => field in firstRow);
  }
}

export {
  DataProvider,

  tapWaterBankFields,
  iceWaterBankFields,
  FIELD_FOOD_TEMP,
  FIELD_TIME_MIN,
  FIELD_WATER_LITRE,
  FIELD_LITRE_CHF,
  FIELD_LITRE_CO2_GRAMS,
  FIELD_KW_HOUR,
  FIELD_KW_HOUR_CHF,
  FIELD_KW_HOUR_CO2_GRAMS,
  FIELD_ICE_INCREASE_KG,

  DECIMALS
};

export type {
  TapWaterBankMeasurements,
  IceWaterBankMeasurements,

  TapWaterBankField,
  IceWaterBankField
};