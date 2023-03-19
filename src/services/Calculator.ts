import {IceWaterBankMeasurements, TapWaterBankMeasurements} from "./DataProvider";
import {CauldronEntity} from "../entities/CauldronEntity";

export class Calculator {
  cauldronEntities: CauldronEntity[];
  tapWaterBankMeasurements?: TapWaterBankMeasurements;
  iceWaterBankMeasurements?: IceWaterBankMeasurements;
  result = 0;

  constructor(
    cauldronEntities: CauldronEntity[],
    tapWaterBankMeasurements?: TapWaterBankMeasurements,
    iceWaterBankMeasurements?: IceWaterBankMeasurements
  ) {
    this.cauldronEntities = cauldronEntities;
    this.tapWaterBankMeasurements = tapWaterBankMeasurements;
    this.iceWaterBankMeasurements = iceWaterBankMeasurements;

    this.calculateResult();
  }

  calculateResult = () => {
    this.result = 0;


    return this.result;
  };
}