import {csvToJSON} from "../utils/csv";
import {iceWaterBankMeasurements} from "../data/iceWaterBankMeasurements";
import {tapWaterBankMeasurements} from "../data/tapWaterBankMeasurements";

class DataProvider {
  tapWaterBankMeasurements: WaterBankMeasurements;
  iceWaterBankMeasurements: IceBankMeasurements;

  constructor() {
    this.tapWaterBankMeasurements = csvToJSON(tapWaterBankMeasurements);
    this.iceWaterBankMeasurements = csvToJSON(iceWaterBankMeasurements);
  }
}

type WaterBankMeasurements = {
  'Temp/Food'?: number,
  'Zeit/Min': number,
  'Wasser/l': number
}[];

type IceBankMeasurements = {
  'Temp/Food': number,
  'Zeit/Min': number,
  'kW/h': number
}[];

export {
  DataProvider
};

export type {
  WaterBankMeasurements,
  IceBankMeasurements
};