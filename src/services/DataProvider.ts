import {csvToJSON} from "../utils/csv";
import {iceWaterBankMeasurements} from "../data/iceWaterBankMeasurements";
import {tapWaterBankMeasurements} from "../data/tapWaterBankMeasurements";
import {TapWaterBankEntity} from "../entities/TapWaterBankEntity";
import {IceWaterBankEntity} from "../entities/IceWaterBankEntity";

// Tap water bank calculated fields
const FIELD_KEY_WATER_LITRE = 'Wasser/l';
const FIELD_KEY_LITRE_CHF = 'l/CHF';
const FIELD_KEY_LITRE_CO2_GRAMS = 'l/Co2/g';

// Ice water bank calculated fields
const FIELD_KEY_KW_HOUR = 'kw/h';
const FIELD_KEY_KW_HOUR_CHF = 'kw/h/CHF';
const FIELD_KEY_KW_HOUR_CO2_GRAMS = 'kw/h/Co2/g';
const FIELD_KEY_ICE_INCREASE_KG = 'EisAufbau/kg';

// Shared calculated fields
const FIELD_KEY_FOOD_TEMP = 'Food/Temp';
const FIELD_KEY_TIME_MIN = 'Zeit/Min';

type TapWaterBankMainMeasurements = {
  [FIELD_KEY_FOOD_TEMP]?: number,
  [FIELD_KEY_TIME_MIN]: number,
  [FIELD_KEY_WATER_LITRE]: number
}[];

type IceWaterBankMainMeasurements = {
  [FIELD_KEY_FOOD_TEMP]: number,
  [FIELD_KEY_TIME_MIN]: number
}[];

type TapWaterBankMeasurements = TapWaterBankMainMeasurements & {
  [FIELD_KEY_LITRE_CHF]: number,
  [FIELD_KEY_LITRE_CO2_GRAMS]: number
}[];

type IceWaterBankMeasurements = IceWaterBankMainMeasurements & {
  [FIELD_KEY_KW_HOUR]: number,
  [FIELD_KEY_KW_HOUR_CHF]: number,
  [FIELD_KEY_KW_HOUR_CO2_GRAMS]: number,
  [FIELD_KEY_ICE_INCREASE_KG]: number
}[];

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
    this.clear();
    
    this.setTapWaterBankMeasurements(csvToJSON(tapWaterBankMeasurements));
    this.setIceWaterBankMeasurements(csvToJSON(iceWaterBankMeasurements));
    
    return {
      tapWaterBankMeasurements: (this.tapWaterBankMeasurements as TapWaterBankMeasurements),
      iceWaterBankMeasurements: (this.iceWaterBankMeasurements as IceWaterBankMeasurements)
    }
  };
  
  private clear = () => {
    this.tapWaterBankMeasurements = undefined;
    this.iceWaterBankMeasurements = undefined;
  };
  
  private setTapWaterBankMeasurements = (tapWaterBankMainMeasurements: TapWaterBankMainMeasurements) => {
    this.tapWaterBankMeasurements = tapWaterBankMainMeasurements;
    
    const litreCHFFactor = this.tapWaterBankEntity.waterLitreCHF;
    const litreCo2GramsFactor = this.tapWaterBankEntity.waterLitreCo2;
    console.log(this.tapWaterBankEntity.waterLitreCHF, this.tapWaterBankEntity.waterLitreCo2,this.iceWaterBankEntity.kwHour )

    for (let i = 0; i < this.tapWaterBankMeasurements.length; i++) {
      const tapWaterBankMeasurementsRow = (this.tapWaterBankMeasurements as TapWaterBankMeasurements)[i];
      const isFirstRow = i === 0;

      tapWaterBankMeasurementsRow[FIELD_KEY_LITRE_CHF] = isFirstRow
        ? litreCHFFactor
        : litreCHFFactor * tapWaterBankMeasurementsRow[FIELD_KEY_WATER_LITRE];

      tapWaterBankMeasurementsRow[FIELD_KEY_LITRE_CO2_GRAMS] = isFirstRow
        ? litreCo2GramsFactor
        : litreCo2GramsFactor * tapWaterBankMeasurementsRow[FIELD_KEY_WATER_LITRE];
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

      if (isFirstRow) foodTempMinuend = iceWaterBankMeasurementsRow[FIELD_KEY_FOOD_TEMP];

      iceWaterBankMeasurementsRow[FIELD_KEY_KW_HOUR] = isFirstRow
        ? kwHourFactor
        : kwHourFactor * (foodTempMinuend! - iceWaterBankMeasurementsRow[FIELD_KEY_FOOD_TEMP]);

      iceWaterBankMeasurementsRow[FIELD_KEY_KW_HOUR_CHF] = isFirstRow
        ? kwHourCHFFactor
        : kwHourCHFFactor * iceWaterBankMeasurementsRow[FIELD_KEY_KW_HOUR];

      // iceWaterBankMeasurementsRow[FIELD_KEY_KW_HOUR_CO2_GRAMS] = isFirstRow
      //   ? kwHourCo2GramsFactor
      //   : kwHourCo2GramsFactor * iceWaterBankMeasurementsRow[FIELDKEY]
    }
  };
}

export {
  DataProvider
};

export type {
  TapWaterBankMeasurements,
  IceWaterBankMeasurements
};