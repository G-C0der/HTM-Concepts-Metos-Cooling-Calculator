import {DataProvider, IceBankMeasurements, WaterBankMeasurements} from "./DataProvider";
import {TapWaterBankEntity} from "../entities/TapWaterBankEntity";
import {IceWaterBankEntity} from "../entities/IceWaterBankEntity";
import {CauldronEntity} from "../entities/CauldronEntity";

export class Calculator {
  cauldronEntities: CauldronEntity[];
  tapWaterBankEntity: TapWaterBankEntity;
  iceWaterBankEntity: IceWaterBankEntity;
  tapWaterBankMeasurements: WaterBankMeasurements;
  iceWaterBankMeasurements: IceBankMeasurements;
  result = 0;

  constructor(
    cauldronEntities: CauldronEntity[],
    tapWaterBankEntity: TapWaterBankEntity,
    iceWaterBankEntity: IceWaterBankEntity
  ) {
    this.cauldronEntities = cauldronEntities;
    this.tapWaterBankEntity = tapWaterBankEntity;
    this.iceWaterBankEntity = iceWaterBankEntity;

    const { iceWaterBankMeasurements, tapWaterBankMeasurements } = new DataProvider();
    this.tapWaterBankMeasurements = tapWaterBankMeasurements;
    this.iceWaterBankMeasurements = iceWaterBankMeasurements;

    this.calculateResult();
  }

  calculateResult() {
    this.result = 0;

    for (const cauldronEntity of this.cauldronEntities) {
      this.result += cauldronEntity.sizeLitres;
    }

    this.result += this.tapWaterBankEntity.waterLitreCost + this.tapWaterBankEntity.waterLitreCo2;
    this.result += this.iceWaterBankEntity.kwHourCo2 + this.iceWaterBankEntity.kwHourCost;

    return this.result;
  }
}